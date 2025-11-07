import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';
import mermaid from 'mermaid';
import { encode } from 'plantuml-encoder';
import DOMPurify from 'dompurify';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import 'katex/dist/katex.min.css';
// Load mhchem for chemistry support
import 'katex/dist/contrib/mhchem.js';

/**
 * Utility: mask segments that must be preserved verbatim (fenced & inline code).
 */
function maskCodeSegments(src: string) {
  const masks: Record<string, string> = {};
  let i = 0;

  // Mask fenced code blocks ``` ``` and ~~~ ~~~
  src = src.replace(/(^|\n)(```|~~~)([^\n]*)\n([\s\S]*?)\n\2(\n|$)/g, (_m, p1, fence, info, body, p5) => {
    const key = `__FENCED_CODE_${i++}__`;
    masks[key] = `${p1}${fence}${info}\n${body}\n${fence}${p5}`;
    return key;
  });

  // Mask inline code `...`
  src = src.replace(/`([^`]+)`/g, (_m) => {
    const key = `__INLINE_CODE_${i++}__`;
    masks[key] = _m;
    return key;
  });

  return { masked: src, masks };
}

function unmaskCodeSegments(src: string, masks: Record<string, string>) {
  for (const [k, v] of Object.entries(masks)) {
    src = src.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), v);
  }
  return src;
}

/**
 * Enhanced markdown preprocessing that handles both currency and math notation
 * without clobbering each other.
 */
export const preprocessMarkdown = (content: string): string => {
  if (!content || typeof content !== 'string') return '';

  try {
    // Normalize line endings
    let processed = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // 0) Mask code blocks/inline code FIRST so we never touch them during preprocessing
    //    This is critical for preserving $ symbols in Mermaid, PlantUML, and other code blocks
    const { masked, masks } = maskCodeSegments(processed);
    processed = masked;
    
    // Auto-detect and wrap common math patterns that might not have delimiters
    // This helps catch expressions like "x^2 + y^2 = z^2" and wrap them properly
    const mathPatterns = [
      // Equations with equals sign and math operators
      /(?:^|\s)([a-zA-Z0-9]+\s*[\^_]\s*[a-zA-Z0-9{}]+(?:\s*[+\-*/]\s*[a-zA-Z0-9]+\s*[\^_]\s*[a-zA-Z0-9{}]+)*\s*=\s*[^$\n]+)(?:\s|$)/g,
      // Fractions not already wrapped
      /(?:^|\s)(\\frac\{[^}]+\}\{[^}]+\})(?:\s|$)/g,
      // Square roots, integrals, sums not already wrapped
      /(?:^|\s)(\\(?:sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|exp)\b[^$\n]{0,50})(?:\s|$)/g,
      // Chemical formulas (e.g., H2O, CO2, Ca(OH)2)
      /(?:^|\s)([A-Z][a-z]?(?:\d+)?(?:\([A-Z][a-z]?(?:\d+)?\))?(?:\d+)?(?:[+-]\d*)?)+(?:\s|$)/g,
    ];
    
    // Wrap detected patterns in $ delimiters if not already wrapped
    mathPatterns.forEach(pattern => {
      processed = processed.replace(pattern, (match, expr) => {
        // Check if already wrapped in $ or $$
        if (match.includes('$')) return match;
        // Avoid wrapping single-letter words like "I" that are not math
        const trimmed = String(expr ?? '').trim();
        if (/^[A-Za-z]$/.test(trimmed)) return match;

        // Heuristics: only auto-wrap if it clearly looks like math or chemistry
        const looksLikeMath = /[\\^_+=<>]|\\b(?:frac|sqrt|sum|int|lim|log|ln|sin|cos|tan|exp)\b/.test(trimmed);
        const hasDigit = /\d/.test(trimmed);
        const hasParens = /[()]/.test(trimmed);
        const uppercaseCount = (trimmed.match(/[A-Z]/g) || []).length;
        const lowercaseCount = (trimmed.match(/[a-z]/g) || []).length;
        const hasTwoElementTokens = uppercaseCount >= 2; // e.g., NaCl, CO2 (with digits handled separately)

        const looksLikeChemistry = hasDigit || hasParens || (hasTwoElementTokens && lowercaseCount > 0);

        if (!looksLikeMath && !looksLikeChemistry) return match;

        return match.replace(expr, `$${expr}$`);
      });
    });

    // 1) Temporarily replace currency with placeholders
    //    - Supports negatives, parentheses, thousands, decimals, ranges, and suffixes (k/m/b, etc.)
    //    - Examples: $5, $1,299.99, ($12.50), -$3.25, $5–$10, $5-$10, $1.2k, $3M
    const currencyMap = new Map<string, string>();
    let idx = 0;

    // Range helper: replace ranges like $5-$10 or $5–$10 with placeholders for BOTH sides
    const currencyCore = String.raw`-?\$\(?\d{1,3}(?:,\d{3})*(?:\.\d+)?|\$-?\d+(?:\.\d+)?|\$-?\d+(?:\.\d+)?\)?(?:\s?(?:[KMBkmb]|[Kk]ilo|[Mm]illion|[Bb]illion))?`;
    const rangeRegex = new RegExp(
      String.raw`(${currencyCore})(\s?[–-]\s?)(${currencyCore})`,
      'g'
    );

    processed = processed.replace(rangeRegex, (_m, left, dash, right) => {
      const lph = `__CURRENCY_${idx++}__`;
      const rph = `__CURRENCY_${idx++}__`;
      currencyMap.set(lph, left);
      currencyMap.set(rph, right);
      return `${lph}${dash}${rph}`;
    });

    // Single currency amounts
    const singleCurrencyRegex = new RegExp(currencyCore, 'g');
    processed = processed.replace(singleCurrencyRegex, (match) => {
      const ph = `__CURRENCY_${idx++}__`;
      currencyMap.set(ph, match);
      return ph;
    });

    // 2) Normalize LaTeX delimiters to markdown-math friendly forms
    //    \[...\] -> $$...$$   and   \(...\) -> $...$
    processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_m, p1) => `\n$$${p1}$$\n`);
    processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_m, p1) => `$${p1}$`);

    // 3) Protect stray $ that aren't math (e.g., isolated dollar signs in prose)
    //    If we see $word$ that doesn't look like math, escape both sides.
    processed = processed.replace(
      /(?<!\\)\$(?!\$)([^$\n]+?)(?<!\\)\$(?!\$)/g,
      (m, inner) => {
        // Much more aggressive math detection - assume math unless it's clearly currency
        const isLikelyCurrency = /^\d+(?:,\d{3})*(?:\.\d{2})?$/.test(inner.trim());
        const hasBackslash = /\\/.test(inner);
        const hasMathOperators = /[+\-*/=<>^_{}()]/.test(inner);
        const hasLettersAndNumbers = /[a-zA-Z].*\d|\d.*[a-zA-Z]/.test(inner);
        const hasGreekLetters = /\\(?:alpha|beta|gamma|delta|epsilon|theta|lambda|mu|pi|sigma|omega)/.test(inner);
        const hasMathFunctions = /\\(?:frac|sqrt|sum|int|lim|log|ln|sin|cos|tan|exp)/.test(inner);
        
        // It's probably math if it has any math-like characteristics
        const isProbablyMath = !isLikelyCurrency && (
          hasBackslash || 
          hasMathOperators || 
          hasLettersAndNumbers || 
          hasGreekLetters || 
          hasMathFunctions ||
          inner.length > 1 // Single characters are likely variables
        );
        
        if (isProbablyMath) return m;
        return `\\$${inner}\\$`;
      }
    );

    // 4) Restore currency placeholders BUT escape the leading '$' so remark-math won't pair them
    //    This is the key to allowing $…$ math while keeping $ amounts literal.
    currencyMap.forEach((original, ph) => {
      const escaped = original.replace(/\$/g, '\\$');
      processed = processed.replace(new RegExp(ph.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), escaped);
    });

    // 5) Unmask code segments
    processed = unmaskCodeSegments(processed, masks);

    // 6) Final tidy
    processed = processed.trimEnd() + '\n';
    return processed;
  } catch (err) {
    console.warn('Error preprocessing markdown:', err);
    return content;
  }
};

/**
 * Mermaid diagram renderer component
 */
interface MermaidRendererProps {
  code: string;
}

// Initialize mermaid once
let mermaidInitialized = false;
const initializeMermaid = () => {
  if (typeof window === 'undefined' || mermaidInitialized) return;

  try {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#fff',
        secondaryColor: '#f4f4f4',
        tertiaryColor: '#fff',
      }
    });
    mermaidInitialized = true;
  } catch (err) {
    console.warn('Failed to initialize Mermaid:', err);
  }
};

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);

  useEffect(() => {
    if (!code.trim()) return;

    const renderDiagram = async () => {
      try {
        initializeMermaid();

        const diagramId = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Use mermaid.render to generate SVG
        const result = await mermaid.render(diagramId, code);
        setSvg(result.svg);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to render Mermaid diagram');
        setSvg(null);
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-title">Mermaid Rendering Error</div>
        <div className="graph-error-message">{error}</div>
        <pre style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="graph-container mermaid-container">
        <div>Loading Mermaid diagram...</div>
      </div>
    );
  }

  return (
    <div className="graph-container mermaid-container">
      <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
};

/**
 * PlantUML diagram renderer component
 */
interface PlantUMLRendererProps {
  code: string;
  serverUrl?: string;
}

const PlantUMLRenderer: React.FC<PlantUMLRendererProps> = ({ code, serverUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!code.trim()) return;

    try {
      const encoded = encode(code);
      const baseUrl = serverUrl || 'https://www.plantuml.com/plantuml';
      const url = `${baseUrl}/svg/${encoded}`;
      setImageUrl(url);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode PlantUML diagram');
      setIsLoading(false);
    }
  }, [code, serverUrl]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-title">PlantUML Rendering Error</div>
        <div className="graph-error-message">{error}</div>
        <pre style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (isLoading || !imageUrl) {
    return (
      <div className="graph-container plantuml-container">
        <div>Loading PlantUML diagram...</div>
      </div>
    );
  }

  return (
    <div className="graph-container plantuml-container">
      <img
        src={imageUrl}
        alt="PlantUML diagram"
        onError={() => setError('Failed to load PlantUML diagram image')}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

/**
 * SVG renderer component with sanitization
 */
interface SVGRendererProps {
  code: string;
}

const SVGRenderer: React.FC<SVGRendererProps> = ({ code }) => {
  const [sanitizedSvg, setSanitizedSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code.trim()) return;

    try {
      // Sanitize the SVG content
      const sanitized = DOMPurify.sanitize(code, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'defs', 'use'],
        ADD_ATTR: ['viewBox', 'xmlns', 'x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width', 'd', 'transform'],
      });

      if (!sanitized || sanitized.trim().length === 0) {
        throw new Error('SVG sanitization resulted in empty content');
      }

      setSanitizedSvg(sanitized);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sanitize SVG');
    }
  }, [code]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-title">SVG Rendering Error</div>
        <div className="graph-error-message">{error}</div>
        <pre style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (!sanitizedSvg) {
    return (
      <div className="graph-container svg-container">
        <div>Processing SVG...</div>
      </div>
    );
  }

  return (
    <div className="graph-container svg-container">
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedSvg }}
        style={{ display: 'inline-block' }}
      />
    </div>
  );
};

/**
 * Chart renderer component with support for multiple formats
 */
interface ChartRendererProps {
  code: string;
  language: string;
}

// Default color palette for charts
const DEFAULT_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ef4444'];

interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter';
  title?: string;
  data: any[];
  dataKeys?: string[];
  xKey?: string;
  colors?: string[];
  width?: number;
  height?: number;
}

const parseChartConfig = (code: string, language: string): ChartConfig | null => {
  try {
    // Parse JSON format
    if (language === 'chart-json') {
      return JSON.parse(code);
    }

    // Parse simple YAML-like format
    const lines = code.trim().split('\n');
    const config: any = { colors: DEFAULT_COLORS };

    // Check if it's table format
    const hasTable = lines.some(line => line.includes('|'));

    if (hasTable) {
      // Parse table format
      const tableLines = lines.filter(line => line.includes('|'));
      const headers = tableLines[0].split('|').map(h => h.trim()).filter(Boolean);
      const dataRows = tableLines.slice(2); // Skip header and separator

      config.data = dataRows.map(row => {
        const values = row.split('|').map(v => v.trim()).filter(Boolean);
        const obj: any = {};
        headers.forEach((header, idx) => {
          const value = values[idx];
          // Try to parse as number, otherwise keep as string
          obj[header] = isNaN(Number(value)) ? value : Number(value);
        });
        return obj;
      });

      config.xKey = headers[0];
      config.dataKeys = headers.slice(1);

      // Parse config lines (before table)
      for (const line of lines) {
        if (line.includes('|')) break;
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();
          if (key.trim() === 'type') config.type = value;
          if (key.trim() === 'title') config.title = value;
        }
      }
    } else {
      // Parse simple key-value format
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (!key || !valueParts.length) continue;

        const trimmedKey = key.trim();
        const value = valueParts.join(':').trim();

        if (trimmedKey === 'type') {
          config.type = value;
        } else if (trimmedKey === 'title') {
          config.title = value;
        } else if (trimmedKey === 'data') {
          // Parse array: [1, 2, 3]
          config.data = JSON.parse(value);
        } else if (trimmedKey === 'labels') {
          // Parse array: [A, B, C] or [Product A, Product B]
          // Handle items with spaces by splitting on commas outside brackets
          if (value.startsWith('[') && value.endsWith(']')) {
            const content = value.slice(1, -1); // Remove [ and ]
            config.labels = content.split(',').map(item => item.trim());
          } else {
            config.labels = JSON.parse(value);
          }
        } else if (trimmedKey === 'colors') {
          // Parse array: [#fff, #000] or [#10b981, #3b82f6]
          if (value.startsWith('[') && value.endsWith(']')) {
            const content = value.slice(1, -1); // Remove [ and ]
            config.colors = content.split(',').map(item => item.trim());
          } else {
            config.colors = JSON.parse(value);
          }
        } else if (trimmedKey === 'xKey') {
          config.xKey = value;
        } else if (trimmedKey === 'dataKeys') {
          // Parse array: [key1, key2]
          if (value.startsWith('[') && value.endsWith(']')) {
            const content = value.slice(1, -1); // Remove [ and ]
            config.dataKeys = content.split(',').map(item => item.trim());
          } else {
            config.dataKeys = JSON.parse(value);
          }
        }
      }

      // Transform simple format to recharts format
      if (Array.isArray(config.data) && typeof config.data[0] === 'number') {
        const labels = config.labels || config.data.map((_: number, i: number) => `Item ${i + 1}`);
        config.data = config.data.map((value: number, idx: number) => ({
          name: labels[idx],
          value: value
        }));
        config.xKey = 'name';
        config.dataKeys = ['value'];
      }
    }

    return config as ChartConfig;
  } catch (err) {
    console.error('Failed to parse chart config:', err);
    return null;
  }
};

const ChartRenderer: React.FC<ChartRendererProps> = ({ code, language }) => {
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);

  useEffect(() => {
    const parsed = parseChartConfig(code, language);
    if (!parsed) {
      setError('Failed to parse chart configuration');
    } else if (!parsed.type) {
      setError('Chart type is required (bar, line, pie, area, scatter)');
    } else {
      setConfig(parsed);
      setError(null);
    }
  }, [code, language]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-title">Chart Rendering Error</div>
        <div className="graph-error-message">{error}</div>
        <pre style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="graph-container chart-container">
        <div>Loading chart...</div>
      </div>
    );
  }

  const colors = config.colors || DEFAULT_COLORS;
  const height = config.height || 300;

  // Custom tooltip styling for better readability
  const tooltipStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '8px',
    color: '#000000',
  };

  const tooltipLabelStyle = {
    color: '#000000',
    fontWeight: 600,
    marginBottom: '4px',
  };

  const tooltipItemStyle = {
    color: '#000000',
  };

  return (
    <div className="graph-container chart-container" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      {config.title && <h4 style={{ textAlign: 'center', marginBottom: '12px', marginTop: 0, color: '#000000', fontWeight: 600 }}>{config.title}</h4>}
      <ResponsiveContainer width="100%" height={height}>
        {config.type === 'bar' && (
          <BarChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'name'} />
            <YAxis />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend />
            {config.dataKeys?.map((key, idx) => (
              <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} />
            )) || <Bar dataKey="value" fill={colors[0]} />}
          </BarChart>
        )}
        {config.type === 'line' && (
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'name'} />
            <YAxis />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend />
            {config.dataKeys?.map((key, idx) => (
              <Line key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} />
            )) || <Line type="monotone" dataKey="value" stroke={colors[0]} />}
          </LineChart>
        )}
        {config.type === 'area' && (
          <AreaChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'name'} />
            <YAxis />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend />
            {config.dataKeys?.map((key, idx) => (
              <Area key={key} type="monotone" dataKey={key} fill={colors[idx % colors.length]} stroke={colors[idx % colors.length]} />
            )) || <Area type="monotone" dataKey="value" fill={colors[0]} stroke={colors[0]} />}
          </AreaChart>
        )}
        {config.type === 'pie' && (
          <PieChart>
            <Pie
              data={config.data}
              dataKey={config.dataKeys?.[0] || 'value'}
              nameKey={config.xKey || 'name'}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {config.data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend />
          </PieChart>
        )}
        {config.type === 'scatter' && (
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey || 'x'} />
            <YAxis dataKey={config.dataKeys?.[0] || 'y'} />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
            />
            <Legend />
            <Scatter name="Data" data={config.data} fill={colors[0]} />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

/**
 * Custom link component for ReactMarkdown that opens links in new tabs
 */
export const MarkdownLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  children,
  href,
  ...props
}) => (
  <a {...props} href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

export interface MarkdownRendererProps {
  content: string;
  className?: string;
  /**
   * Optional flag to disable math rendering entirely if needed
   */
  disableMath?: boolean;
  /**
   * Enable graph rendering (default: true)
   */
  enableGraphs?: boolean;
  /**
   * Enable Mermaid diagram rendering (default: true)
   */
  enableMermaid?: boolean;
  /**
   * Enable PlantUML diagram rendering (default: true)
   */
  enablePlantUML?: boolean;
  /**
   * Enable SVG rendering (default: true)
   */
  enableSVG?: boolean;
  /**
   * Custom PlantUML server URL (optional)
   */
  plantUMLServerUrl?: string;
  /**
   * Enable syntax highlighting for code blocks (default: true)
   */
  enableSyntaxHighlighting?: boolean;
  /**
   * Syntax highlighting theme: 'dark' or 'light' (default: 'dark')
   */
  syntaxTheme?: 'dark' | 'light';
  /**
   * Enable chart rendering (default: true)
   */
  enableCharts?: boolean;
}

/**
 * Custom code block component that routes to appropriate graph renderers
 */
interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  enableGraphs?: boolean;
  enableMermaid?: boolean;
  enablePlantUML?: boolean;
  enableSVG?: boolean;
  enableCharts?: boolean;
  plantUMLServerUrl?: string;
  enableSyntaxHighlighting?: boolean;
  syntaxTheme?: 'dark' | 'light';
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  inline,
  className = '',
  children,
  enableGraphs = true,
  enableMermaid = true,
  enablePlantUML = true,
  enableSVG = true,
  enableCharts = true,
  plantUMLServerUrl,
  enableSyntaxHighlighting = true,
  syntaxTheme = 'dark',
}) => {
  // Handle inline code (always render as code)
  if (inline) {
    return <code className={className}>{children}</code>;
  }

  // Extract language from className (e.g., "language-mermaid" -> "mermaid")
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1].toLowerCase() : '';
  const code = String(children).replace(/\n$/, '');

  // Route to chart renderer (if enabled)
  if (enableCharts && (language === 'chart' || language === 'chart-json' || language === 'chart-table')) {
    return <ChartRenderer code={code} language={language} />;
  }

  // Route to graph renderers (if enabled)
  if (enableGraphs) {
    if (language === 'mermaid' && enableMermaid) {
      return <MermaidRenderer code={code} />;
    }

    if ((language === 'plantuml' || language === 'puml') && enablePlantUML) {
      return <PlantUMLRenderer code={code} serverUrl={plantUMLServerUrl} />;
    }

    if (language === 'svg' && enableSVG) {
      return <SVGRenderer code={code} />;
    }
  }

  // Use syntax highlighting for regular code blocks
  if (enableSyntaxHighlighting && language) {
    const style = syntaxTheme === 'light' ? vs : vscDarkPlus;
    return (
      <SyntaxHighlighter
        language={language}
        style={style}
        customStyle={{
          margin: '12px 0',
          borderRadius: '6px',
          fontSize: '0.9em',
        }}
        showLineNumbers={false}
      >
        {code}
      </SyntaxHighlighter>
    );
  }

  // Fallback: render as normal code block
  // Use div instead of pre to avoid nesting issues with ReactMarkdown paragraph wrapping
  return (
    <div className={`markdown-code-block ${className}`.trim()}>
      <pre style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

/**
 * Enhanced Markdown renderer with robust currency and math handling
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className = '',
  disableMath = false,
  enableGraphs = true,
  enableMermaid = true,
  enablePlantUML = true,
  enableSVG = true,
  enableCharts = true,
  plantUMLServerUrl,
  enableSyntaxHighlighting = true,
  syntaxTheme = 'dark',
}) => {
  const processedContent = preprocessMarkdown(content);
  if (!processedContent) return null;

  const remarkPlugins: PluggableList = disableMath
    ? [remarkGfm]
    : [remarkGfm, [remarkMath, { singleDollarTextMath: true }]];

  const rehypePlugins: PluggableList = disableMath ? [] : [
    [rehypeKatex, {
      // KaTeX options for better rendering
      throwOnError: false, // Don't crash on invalid LaTeX
      errorColor: '#cc0000',
      strict: false, // Allow more flexible syntax
      trust: true, // Enable all KaTeX features including chemistry
      // mhchem is loaded automatically when imported above
      macros: {
        // Add other useful macros (mhchem provides \ce and \pu)
        "\\RR": "\\mathbb{R}",
        "\\NN": "\\mathbb{N}",
        "\\ZZ": "\\mathbb{Z}",
        "\\QQ": "\\mathbb{Q}",
        "\\CC": "\\mathbb{C}",
        // Common shortcuts
        "\\dx": "\\,dx",
        "\\dy": "\\,dy",
        "\\dt": "\\,dt",
        "\\dz": "\\,dz",
      }
    }]
  ];

  const components: Partial<Components> = {
    code: (props) => {
      const { className, children, ...rest } = props;
      const inline = 'inline' in props && typeof props.inline === 'boolean' ? props.inline : false;
      // Check if this is a block-level code block (has language-* className)
      const isBlockLevel = !inline && className && /language-/.test(className);
      
      // If it's block-level, wrap in a fragment with a data attribute for paragraph detection
      const codeBlock = (
        <CodeBlock
          inline={inline}
          className={className}
          enableGraphs={enableGraphs}
          enableMermaid={enableMermaid}
          enablePlantUML={enablePlantUML}
          enableSVG={enableSVG}
          enableCharts={enableCharts}
          plantUMLServerUrl={plantUMLServerUrl}
          enableSyntaxHighlighting={enableSyntaxHighlighting}
          syntaxTheme={syntaxTheme}
          {...rest}
        >
          {children}
        </CodeBlock>
      );
      
      // For block-level code, wrap in a fragment that signals it shouldn't be in a paragraph
      if (isBlockLevel) {
        return <React.Fragment key="block-code">{codeBlock}</React.Fragment>;
      }
      
      return codeBlock;
    },
    // Custom paragraph component to avoid nesting block elements inside <p>
    p: (props) => {
      const hasBlockChild = React.Children.toArray(props.children).some(child =>
        React.isValidElement(child) &&
        (child.type as any) === CodeBlock && // Direct comparison to the component
        !child.props.inline
      );

      if (hasBlockChild) {
        // Use a div instead of a p tag to avoid nesting errors
        return <div>{props.children}</div>;
      }

      return <p>{props.children}</p>;
    },
  };

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

// Utility: detect likely math without false positives from currency
export const containsMathNotation = (text: string): boolean => {
  const withoutCurrency = text.replace(/\$\s?\d+(?:,\d{3})*(?:\.\d+)?\b/gi, '');
  const patterns = [
    /\$\$[\s\S]+?\$\$/,
    /(?<!\\)\$[^$\n]+?(?<!\\)\$/,
    /\\\[[\s\S]+?\\\]/,
    /\\\([^)]+?\\\)/,
  ];
  return patterns.some((re) => re.test(withoutCurrency));
};
