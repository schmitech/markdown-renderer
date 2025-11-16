import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MermaidRenderer } from './renderers/MermaidRenderer';
import { PlantUMLRenderer } from './renderers/PlantUMLRenderer';
import { SVGRenderer } from './renderers/SVGRenderer';
import { ChartRenderer } from './renderers/ChartRenderer';
import type { CodeBlockProps } from './types';

// Copy button component for code blocks
const CopyButton: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = code;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy code:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <button
      className="code-copy-button"
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy code'}
      aria-label={copied ? 'Copied!' : 'Copy code to clipboard'}
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.5 4.5H3.5C2.94772 4.5 2.5 4.94772 2.5 5.5V12.5C2.5 13.0523 2.94772 13.5 3.5 13.5H10.5C11.0523 13.5 11.5 13.0523 11.5 12.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6.5 2.5H12.5C13.0523 2.5 13.5 2.94772 13.5 3.5V9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.5 6.5L13.5 2.5L9.5 2.5V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      <span className="code-copy-button-text">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
};

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
      <div className="syntax-highlighted-wrapper code-block-container">
        <CopyButton code={code} />
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
    <div className={`markdown-code-block code-block-container ${className}`.trim()}>
      <CopyButton code={code} />
      <pre style={{ margin: 0, padding: 0, background: 'transparent', border: 'none' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

