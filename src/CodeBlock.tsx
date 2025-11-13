import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MermaidRenderer } from './renderers/MermaidRenderer';
import { PlantUMLRenderer } from './renderers/PlantUMLRenderer';
import { SVGRenderer } from './renderers/SVGRenderer';
import { ChartRenderer } from './renderers/ChartRenderer';
import type { CodeBlockProps } from './types';

export const CodeBlock: React.FC<CodeBlockProps> = ({
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
      <div className="syntax-highlighted-wrapper">
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
      </div>
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

