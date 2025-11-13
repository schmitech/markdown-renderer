import React, { useEffect, useState } from 'react';
import { encode } from 'plantuml-encoder';
import type { PlantUMLRendererProps } from '../types';

export const PlantUMLRenderer: React.FC<PlantUMLRendererProps> = ({ code, serverUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorDetails, setShowErrorDetails] = useState(false);
  const [format, setFormat] = useState<'svg' | 'png'>('svg');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (!code.trim()) return;

    // Validate PlantUML code has required tags
    // Support all PlantUML diagram types: @startuml, @startmindmap, @startwbs, @startjson, etc.
    const trimmedCode = code.trim();
    // Check for any @start... pattern (case-insensitive)
    const hasStartTag = /@start\w+/i.test(trimmedCode);
    // Check for any @end... pattern (case-insensitive)
    const hasEndTag = /@end\w+/i.test(trimmedCode);
    
    if (!hasStartTag) {
      setError('PlantUML diagram must start with @start... (e.g., @startuml, @startmindmap, @startwbs, etc.)');
      setIsLoading(false);
      return;
    }

    if (!hasEndTag) {
      setError('PlantUML diagram must end with @end... (e.g., @enduml, @endmindmap, @endwbs, etc.)');
      setIsLoading(false);
      return;
    }

    try {
      const encoded = encode(code);
      const baseUrl = serverUrl || 'https://www.plantuml.com/plantuml';
      const url = `${baseUrl}/${format}/${encoded}`;
      setImageUrl(url);
      setIsLoading(false);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to encode PlantUML diagram');
      setIsLoading(false);
    }
  }, [code, serverUrl, format]);

  const handleImageError = () => {
    // Try PNG format if SVG fails (PNG sometimes works better with CORS)
    if (format === 'svg' && retryCount === 0) {
      setRetryCount(1);
      setFormat('png');
      setError(null);
      setIsLoading(true);
      return;
    }
    
    setError('Failed to load PlantUML diagram image. This may be due to network issues, CORS restrictions, or the PlantUML server being unavailable. You can try: 1) Using a custom PlantUML server URL, 2) Checking your network connection, 3) Hosting your own PlantUML server.');
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="graph-error">
        <div className="graph-error-header">
          <div className="graph-error-icon">⚠️</div>
          <div className="graph-error-content">
            <div className="graph-error-title">PlantUML Rendering Error</div>
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
              PlantUML Code
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
            {imageUrl && (
              <div style={{ marginTop: '8px', fontSize: '0.8em', opacity: 0.7 }}>
                <strong>Generated URL:</strong> <a href={imageUrl} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all', color: '#cc0000' }}>{imageUrl.substring(0, 100)}...</a>
                <div style={{ marginTop: '8px' }}>
                  <strong>Note:</strong> If the image fails to load, it may be due to CORS restrictions. Try:
                  <ul style={{ marginTop: '4px', paddingLeft: '20px' }}>
                    <li>Opening the URL directly in a new tab to test if it works</li>
                    <li>Using a custom PlantUML server via the <code>plantUMLServerUrl</code> prop</li>
                    <li>Setting up your own PlantUML server (see <a href="http://plantuml.com/starting" target="_blank" rel="noopener noreferrer" style={{ color: '#cc0000' }}>PlantUML documentation</a>)</li>
                  </ul>
                </div>
              </div>
            )}
          </details>
        )}
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
        onError={handleImageError}
        onLoad={() => {
          setError(null);
          setIsLoading(false);
        }}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
};

