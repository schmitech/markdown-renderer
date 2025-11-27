import React, { useEffect, useRef, useState } from 'react';
import type { MusicRendererProps } from '../types';

// Dynamic import for abcjs to handle both ESM and CommonJS
let abcjs: any = null;
const loadAbcjs = async () => {
  if (typeof window === 'undefined') {
    throw new Error('abcjs requires a browser environment');
  }
  
  if (abcjs) return abcjs;
  
  try {
    // Import abcjs (CommonJS module, will be default export in ESM)
    const abcjsModule = await import('abcjs');
    
    // CommonJS modules are typically the default export when imported as ESM
    const abcjsLib = abcjsModule.default || abcjsModule;
    
    if (!abcjsLib) {
      throw new Error('abcjs module is empty');
    }
    
    if (typeof abcjsLib.renderAbc !== 'function') {
      throw new Error(`renderAbc is not a function. Available methods: ${Object.keys(abcjsLib).join(', ')}`);
    }
    
    abcjs = abcjsLib;
    return abcjs;
  } catch (err) {
    // Fallback: try to load from window if available
    if (typeof window !== 'undefined' && (window as any).ABCJS) {
      abcjs = (window as any).ABCJS;
      return abcjs;
    }
    const errorMessage = err instanceof Error ? err.message : 'Failed to load abcjs';
    throw new Error(`Failed to load abcjs: ${errorMessage}`);
  }
};

/**
 * Detects if the code is ABC notation
 */
const isAbcNotation = (code: string): boolean => {
  const trimmed = code.trim();
  // ABC notation typically starts with headers like X:, T:, M:, L:, K:
  return /^[XMTLK]:/m.test(trimmed) || /^X:\d+/m.test(trimmed);
};

export const MusicRenderer: React.FC<MusicRendererProps> = ({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAbc, setIsAbc] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // First effect: Detect ABC notation
  useEffect(() => {
    if (!code.trim()) {
      setIsLoading(false);
      setIsAbc(false);
      return;
    }

    if (isAbcNotation(code)) {
      setIsAbc(true);
      setError(null);
    } else {
      setIsAbc(false);
      setError('Unable to detect ABC notation. Expected ABC notation starting with headers like X:, T:, M:, L:, or K:');
      setIsLoading(false);
    }
  }, [code]);

  // Second effect: Render ABC notation after container is mounted
  useEffect(() => {
    if (!isAbc || !code.trim()) {
      return;
    }

    const renderAbc = async () => {
      try {
        setIsLoading(true);
        
        // Wait for container to be available (with retries)
        let retries = 0;
        const maxRetries = 10;
        while (!containerRef.current && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 50));
          retries++;
        }
        
        if (!containerRef.current) {
          throw new Error('Container element not found after waiting');
        }

        const abcjsLib = await loadAbcjs();
        
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Render ABC notation
        abcjsLib.renderAbc(containerRef.current, code, {
          responsive: 'resize',
          staffwidth: 740,
          paddingleft: 0,
          paddingright: 0,
          paddingtop: 20,
          paddingbottom: 20,
          scale: 1.0,
        });

        setError(null);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to render ABC notation';
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    renderAbc();
  }, [code, isAbc]);

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-header">
          <div className="graph-error-icon">⚠️</div>
          <div className="graph-error-content">
            <div className="graph-error-title">ABC Notation Rendering Error</div>
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
              ABC Notation Code
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

  // Render ABC notation - always render container so ref is available
  if (isAbc) {
    return (
      <div className="graph-container music-container abc-container">
        {isLoading && !error && (
          <div style={{ padding: '20px', textAlign: 'center', position: 'absolute', zIndex: 1 }}>
            Loading ABC notation...
          </div>
        )}
        <div ref={containerRef} />
      </div>
    );
  }

  return null;
};


