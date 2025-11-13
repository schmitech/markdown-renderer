import type { ReactNode } from 'react';

/**
 * Props for Mermaid diagram renderer
 */
export interface MermaidRendererProps {
  code: string;
}

/**
 * Props for PlantUML diagram renderer
 */
export interface PlantUMLRendererProps {
  code: string;
  serverUrl?: string;
}

/**
 * Props for SVG renderer
 */
export interface SVGRendererProps {
  code: string;
}

/**
 * Props for chart renderer
 */
export interface ChartRendererProps {
  code: string;
  language: string;
}

export type ChartValueFormat = 'number' | 'compact' | 'currency' | 'percent';

export interface ChartFormatterConfig {
  format?: ChartValueFormat;
  currency?: string;
  decimals?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  prefix?: string;
  suffix?: string;
}

export interface ChartSeriesConfig {
  key: string;
  name?: string;
  type?: 'bar' | 'line' | 'area' | 'scatter';
  color?: string;
  yAxisId?: 'left' | 'right';
  stackId?: string;
  strokeWidth?: number;
  dot?: boolean;
  opacity?: number;
}

export interface ChartReferenceLineConfig {
  x?: string | number;
  y?: string | number;
  label?: string;
  color?: string;
  strokeDasharray?: string;
  position?: 'start' | 'middle' | 'end';
}

/**
 * Chart configuration interface
 */
export interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed';
  title?: string;
  description?: string;
  data: any[];
  dataKeys?: string[];
  xKey?: string;
  colors?: string[];
  width?: number;
  height?: number;
  stacked?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  yAxisRightLabel?: string;
  formatter?: ChartFormatterConfig;
  series?: ChartSeriesConfig[];
  referenceLines?: ChartReferenceLineConfig[];
}

/**
 * Props for the main MarkdownRenderer component
 */
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
 * Props for CodeBlock component
 */
export interface CodeBlockProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
  'data-block-code'?: string;
  enableGraphs?: boolean;
  enableMermaid?: boolean;
  enablePlantUML?: boolean;
  enableSVG?: boolean;
  enableCharts?: boolean;
  plantUMLServerUrl?: string;
  enableSyntaxHighlighting?: boolean;
  syntaxTheme?: 'dark' | 'light';
}

/**
 * Set of block-level HTML tags that should not be wrapped in paragraph tags
 */
export const BLOCK_LEVEL_TAGS = new Set([
  'div',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'table',
  'thead',
  'tbody',
  'tr',
  'td',
  'th',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'section',
  'article',
  'figure',
]);
