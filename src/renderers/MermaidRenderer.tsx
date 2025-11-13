import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { MermaidRendererProps } from '../types';

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

export const MermaidRenderer: React.FC<MermaidRendererProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

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
        // Extract a cleaner error message
        let errorMessage = 'Failed to render Mermaid diagram';
        if (err instanceof Error) {
          // Mermaid often includes "Syntax error in text" - try to extract more useful info
          const message = err.message;
          if (message.includes('Syntax error')) {
            // Try to extract line number or more specific error info
            const lineMatch = message.match(/line\s+(\d+)/i);
            const tokenMatch = message.match(/token\s+['"]([^'"]+)['"]/i);
            
            if (lineMatch || tokenMatch) {
              const parts = [];
              if (lineMatch) parts.push(`Line ${lineMatch[1]}`);
              if (tokenMatch) parts.push(`Unexpected token: ${tokenMatch[1]}`);
              errorMessage = `Syntax error${parts.length ? ` (${parts.join(', ')})` : ''}`;
            } else {
              errorMessage = 'Syntax error in Mermaid diagram';
            }
          } else {
            errorMessage = message.length > 100 ? message.substring(0, 100) + '...' : message;
          }
        }
        setError(errorMessage);
        setSvg(null);
        setShowErrorDetails(false); // Reset details visibility on new error
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-header">
          <div className="graph-error-icon">⚠️</div>
          <div className="graph-error-content">
            <div className="graph-error-title">Mermaid Diagram Error</div>
            <div className="graph-error-message">{error}</div>
          </div>
        </div>
        <button
          className="graph-error-toggle"
          onClick={() => setShowErrorDetails(!showErrorDetails)}
          type="button"
        >
          {showErrorDetails ? 'Hide' : 'Show'} Details
        </button>
        {showErrorDetails && (
          <details className="graph-error-details" open>
            <summary style={{ cursor: 'pointer', marginBottom: '8px', fontWeight: 500 }}>
              Mermaid Code
            </summary>
            <pre style={{ 
              marginTop: '8px', 
              fontSize: '0.8em', 
              opacity: 0.8,
              padding: '8px',
              background: 'rgba(0, 0, 0, 0.05)',
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              <code>{code}</code>
            </pre>
          </details>
        )}
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

