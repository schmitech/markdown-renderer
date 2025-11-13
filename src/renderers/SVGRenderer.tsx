import React, { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import type { SVGRendererProps } from '../types';

export const SVGRenderer: React.FC<SVGRendererProps> = ({ code }) => {
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

