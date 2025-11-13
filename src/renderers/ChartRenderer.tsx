import React, { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type {
  ChartConfig,
  ChartFormatterConfig,
  ChartReferenceLineConfig,
  ChartRendererProps,
  ChartSeriesConfig,
} from '../types';

// Default color palette for charts
export const DEFAULT_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#6366f1',
  '#ef4444',
];

type PartialChartConfig = Partial<ChartConfig> & {
  labels?: string[];
};

interface NormalizedSeries extends ChartSeriesConfig {
  color: string;
  name: string;
  type: 'bar' | 'line' | 'area' | 'scatter';
  yAxisId: 'left' | 'right';
  opacity: number;
  stackId?: string;
  strokeWidth?: number;
  dot?: boolean;
}

const tryParseJSON = <T,>(value: string): T | null => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const stripQuotes = (value: string) => value.replace(/^['"]|['"]$/g, '');

const parseListValue = (value: string): string[] => {
  const trimmed = value.trim();
  if (!trimmed) return [];

  const parsed = tryParseJSON<string[]>(trimmed);
  if (parsed) return parsed;

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    const inner = trimmed.slice(1, -1);
    return inner
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }

  return trimmed
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean);
};

const parseNumericValue = (value: string): number | undefined => {
  const normalized = value.trim().replace(/px$/i, '');
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const parseFormatterValue = (value: string): ChartFormatterConfig | undefined => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const parsed = tryParseJSON<ChartFormatterConfig>(trimmed);
  if (parsed) return parsed;

  return { format: trimmed as ChartFormatterConfig['format'] };
};

const applyConfigLine = (config: PartialChartConfig, key: string, rawValue: string) => {
  const trimmedKey = key.trim();
  if (!trimmedKey) return;

  const value = rawValue.trim();
  if (!value.length) return;

  const lowerKey = trimmedKey.toLowerCase();
  const boolValue = value.toLowerCase();

  const ensureFormatter = () => {
    if (!config.formatter) config.formatter = {};
    return config.formatter;
  };

  switch (lowerKey) {
    case 'type':
      config.type = value as ChartConfig['type'];
      return;
    case 'title':
      config.title = value;
      return;
    case 'description':
      config.description = value;
      return;
    case 'xaxislabel':
      config.xAxisLabel = value;
      return;
    case 'yaxislabel':
      config.yAxisLabel = value;
      return;
    case 'yaxisrightlabel':
      config.yAxisRightLabel = value;
      return;
    case 'stacked':
      config.stacked = boolValue === 'true';
      return;
    case 'showlegend':
      config.showLegend = boolValue === 'true';
      return;
    case 'showgrid':
      config.showGrid = boolValue === 'true';
      return;
    case 'height': {
      const parsed = parseNumericValue(value);
      if (typeof parsed === 'number') config.height = parsed;
      return;
    }
    case 'width': {
      const parsed = parseNumericValue(value);
      if (typeof parsed === 'number') config.width = parsed;
      return;
    }
    case 'xkey':
      config.xKey = value;
      return;
    case 'valueformat': {
      const formatter = ensureFormatter();
      formatter.format = value as ChartFormatterConfig['format'];
      return;
    }
    case 'valueprefix': {
      const formatter = ensureFormatter();
      formatter.prefix = value;
      return;
    }
    case 'valuesuffix': {
      const formatter = ensureFormatter();
      formatter.suffix = value;
      return;
    }
    case 'valuecurrency': {
      const formatter = ensureFormatter();
      formatter.currency = value;
      return;
    }
    case 'valuedecimals': {
      const parsed = parseNumericValue(value);
      if (typeof parsed === 'number') {
        const formatter = ensureFormatter();
        formatter.decimals = parsed;
      }
      return;
    }
    case 'formatter': {
      const parsed = parseFormatterValue(value);
      if (parsed) {
        config.formatter = { ...config.formatter, ...parsed };
      }
      return;
    }
    case 'colors':
      config.colors = parseListValue(value);
      return;
    case 'labels':
      config.labels = parseListValue(value);
      return;
    case 'datakeys':
      config.dataKeys = parseListValue(value);
      return;
    case 'data': {
      const parsed = tryParseJSON<any[]>(value);
      if (parsed) config.data = parsed;
      return;
    }
    case 'series': {
      const parsed = tryParseJSON<ChartSeriesConfig[]>(value);
      if (parsed) config.series = parsed;
      return;
    }
    case 'referencelines': {
      const parsed = tryParseJSON<ChartReferenceLineConfig[]>(value);
      if (parsed) config.referenceLines = parsed;
      return;
    }
    default:
      return;
  }
};

export const parseChartConfig = (code: string, language: string): ChartConfig | null => {
  try {
    // Parse JSON format
    if (language === 'chart-json') {
      return JSON.parse(code) as ChartConfig;
    }

    const lines = code.trim().split('\n');
    const config: PartialChartConfig = { colors: DEFAULT_COLORS };

    // Check if it's table format
    const hasTable = lines.some((line) => line.includes('|'));

    if (hasTable) {
      const tableLines = lines.filter((line) => line.includes('|'));
      const headers = tableLines[0]
        .split('|')
        .map((h) => h.trim())
        .filter(Boolean);
      const dataRows = tableLines.slice(2); // Skip header and separator

      config.data = dataRows
        .map((row) => {
          const values = row
            .split('|')
            .map((v) => v.trim())
            .filter(Boolean);
          if (!values.length) return null;
          const obj: Record<string, any> = {};
          headers.forEach((header, idx) => {
            const value = values[idx];
            if (typeof value === 'undefined') return;
            obj[header] = value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value;
          });
          return obj;
        })
        .filter(Boolean) as any[];

      config.xKey = headers[0];
      config.dataKeys = headers.slice(1);

      for (const line of lines) {
        if (line.includes('|')) break;
        const [key, ...valueParts] = line.split(':');
        if (!key || !valueParts.length) continue;
        applyConfigLine(config, key, valueParts.join(':'));
      }
    } else {
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (!key || !valueParts.length) continue;
        applyConfigLine(config, key, valueParts.join(':'));
      }

      if (Array.isArray(config.data) && typeof config.data[0] === 'number') {
        const labels =
          config.labels || config.data.map((_: number, idx: number) => `Item ${idx + 1}`);
        config.data = (config.data as number[]).map((value: number, idx: number) => ({
          name: labels[idx],
          value,
        }));
        config.xKey = 'name';
        config.dataKeys = ['value'];
      }
    }

    config.data = config.data ?? [];
    if (!config.colors || config.colors.length === 0) {
      config.colors = DEFAULT_COLORS;
    }

    return config as ChartConfig;
  } catch (err) {
    console.error('Failed to parse chart config:', err);
    return null;
  }
};

const formatValue = (value: unknown, formatter?: ChartFormatterConfig) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return value ?? '';
  }

  if (!formatter) {
    return new Intl.NumberFormat().format(value);
  }

  const {
    format = 'number',
    currency = 'USD',
    decimals,
    minimumFractionDigits,
    maximumFractionDigits,
    prefix = '',
    suffix = '',
  } = formatter;

  const options: Intl.NumberFormatOptions = {};

  if (typeof decimals === 'number' && !Number.isNaN(decimals)) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  } else {
    if (typeof minimumFractionDigits === 'number') {
      options.minimumFractionDigits = minimumFractionDigits;
    }
    if (typeof maximumFractionDigits === 'number') {
      options.maximumFractionDigits = maximumFractionDigits;
    }
  }

  if (format === 'currency') {
    options.style = 'currency';
    options.currency = currency || 'USD';
  } else if (format === 'percent') {
    options.style = 'percent';
  } else if (format === 'compact') {
    options.notation = 'compact';
  } else if (!options.maximumFractionDigits) {
    options.maximumFractionDigits = 2;
  }

  const formatted = new Intl.NumberFormat(undefined, options).format(value);
  return `${prefix}${formatted}${suffix}`;
};

const buildSeries = (config: ChartConfig, colors: string[]): NormalizedSeries[] => {
  const fallbackSeries: ChartSeriesConfig[] =
    config.dataKeys && config.dataKeys.length
      ? config.dataKeys.map((key) => ({ key }))
      : [{ key: 'value' }];

  const baseSeries: ChartSeriesConfig[] = (config.series && config.series.length ? config.series : fallbackSeries).filter(
    (series): series is ChartSeriesConfig => Boolean(series.key),
  );

  const defaultType: NormalizedSeries['type'] =
    config.type === 'line'
      ? 'line'
      : config.type === 'area'
      ? 'area'
      : config.type === 'scatter'
      ? 'scatter'
      : 'bar';

  return baseSeries.map((series, idx) => {
    const resolvedType = config.type === 'composed' ? series.type || defaultType : defaultType;
    return {
      ...series,
      type: resolvedType,
      key: series.key as string,
      name: series.name ?? (series.key as string),
      color: series.color ?? colors[idx % colors.length],
      yAxisId: (series.yAxisId ?? 'left') as 'left' | 'right',
      stackId:
        typeof series.stackId !== 'undefined'
          ? series.stackId
          : config.stacked
          ? 'stack'
          : undefined,
      strokeWidth: series.strokeWidth ?? (resolvedType === 'line' ? 2 : 1),
      dot: typeof series.dot === 'boolean' ? series.dot : true,
      opacity: series.opacity ?? (resolvedType === 'area' ? 0.55 : 1),
    };
  });
};

const renderReferenceLines = (referenceLines?: ChartReferenceLineConfig[]) => {
  if (!referenceLines?.length) return null;
  return referenceLines
    .filter((line) => typeof line.y !== 'undefined' || typeof line.x !== 'undefined')
    .map((line, idx) => {
      // Map position values to valid Recharts LabelPosition values
      const mapPosition = (pos?: 'start' | 'middle' | 'end'): 'insideStart' | 'middle' | 'end' => {
        if (pos === 'start') return 'insideStart';
        if (pos === 'middle') return 'middle';
        if (pos === 'end') return 'end';
        return 'end';
      };
      
      return (
        <ReferenceLine
          key={`reference-${idx}`}
          y={line.y}
          x={line.x}
          stroke={line.color || '#9ca3af'}
          strokeDasharray={line.strokeDasharray || '4 4'}
          label={
            line.label
              ? {
                  value: line.label,
                  position: mapPosition(line.position),
                  fill: line.color || '#4b5563',
                }
              : undefined
          }
        />
      );
    });
};

const inferAxisLabel = (series: NormalizedSeries[], axis: 'left' | 'right'): string | undefined => {
  const axisSeries = series.filter((item) => item.yAxisId === axis);
  if (!axisSeries.length) return undefined;
  const labels = axisSeries
    .map((item) => item.name || item.key)
    .filter((name): name is string => Boolean(name));
  if (!labels.length) return undefined;
  const unique = Array.from(new Set(labels));
  return unique.join(' / ');
};

const renderYAxisLabel = (value: string | undefined, orientation: 'left' | 'right') => {
  if (!value) return null;
  const offset = orientation === 'right' ? 20 : -20;
  const position = orientation === 'right' ? 'insideRight' : 'insideLeft';
  return (
    <Label
      value={value}
      angle={orientation === 'right' ? 90 : -90}
      position={position}
      style={{ textAnchor: 'middle', fill: '#374151', fontSize: 12, fontWeight: 500 }}
      offset={offset}
    />
  );
};

export const ChartRenderer: React.FC<ChartRendererProps> = ({ code, language }) => {
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ChartConfig | null>(null);

  useEffect(() => {
    const parsed = parseChartConfig(code, language);
    if (!parsed) {
      setConfig(null);
      setError('Failed to parse chart configuration');
      return;
    }

    if (!Array.isArray(parsed.data) || parsed.data.length === 0) {
      setConfig(null);
      setError('Chart data is empty');
      return;
    }

    if (!parsed.type) {
      setConfig(null);
      setError('Chart type is required (bar, line, pie, area, scatter, composed)');
      return;
    }

    setError(null);
    setConfig(parsed);
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

  const colors = config.colors && config.colors.length ? config.colors : DEFAULT_COLORS;
  const height = config.height || 320;
  const derivedSeries = buildSeries(config, colors);
  const hasRightAxis = derivedSeries.some((series) => series.yAxisId === 'right');
  const showLegend = config.showLegend ?? (config.type === 'pie' || derivedSeries.length > 1);
  const showGrid = config.showGrid ?? true;

  const referenceLineElements = renderReferenceLines(config.referenceLines);
  const inferredLeftLabel = inferAxisLabel(derivedSeries, 'left');
  const inferredRightLabel = inferAxisLabel(derivedSeries, 'right');
  const leftAxisLabelText = config.yAxisLabel ?? inferredLeftLabel ?? 'Value';
  const rightAxisLabelText = hasRightAxis
    ? config.yAxisRightLabel ?? inferredRightLabel ?? 'Value'
    : undefined;

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

  const tooltipFormatter = (value: any, name: string) => {
    if (typeof value === 'number') {
      return [formatValue(value, config.formatter), name];
    }
    return [value, name];
  };

  const axisTickFormatter = (value: any) => {
    if (typeof value !== 'number') return String(value ?? '');
    const formatted = formatValue(value, config.formatter);
    return String(formatted ?? '');
  };

  const xAxisLabel = config.xAxisLabel
    ? {
        value: config.xAxisLabel,
        position: 'insideBottom',
        offset: -5,
      }
    : undefined;

  const chartMargin = {
    left: leftAxisLabelText ? 80 : 10,
    right: rightAxisLabelText ? 80 : 10,
    top: 10,
    bottom: 20,
  };

  return (
    <div
      className="graph-container chart-container"
      style={{ flexDirection: 'column', alignItems: 'stretch' }}
    >
      {config.title && (
        <h4
          style={{
            textAlign: 'center',
            marginBottom: config.description ? '4px' : '12px',
            marginTop: 0,
            color: '#000000',
            fontWeight: 600,
          }}
        >
          {config.title}
        </h4>
      )}
      {config.description && (
        <p
          style={{
            textAlign: 'center',
            marginTop: 0,
            marginBottom: '12px',
            color: '#4b5563',
            fontSize: '0.9rem',
          }}
        >
          {config.description}
        </p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {config.type === 'bar' && (
          <BarChart data={config.data} margin={chartMargin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={config.xKey || 'name'} label={xAxisLabel} />
            <YAxis yAxisId="left" tickFormatter={axisTickFormatter}>
              {renderYAxisLabel(leftAxisLabelText, 'left')}
            </YAxis>
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={axisTickFormatter}
              >
                {renderYAxisLabel(rightAxisLabelText, 'right')}
              </YAxis>
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
            {referenceLineElements}
            {derivedSeries.map((series) => (
              <Bar
                key={series.key}
                dataKey={series.key}
                fill={series.color}
                stackId={series.stackId}
                yAxisId={series.yAxisId}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}

        {config.type === 'line' && (
          <LineChart data={config.data} margin={chartMargin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={config.xKey || 'name'} label={xAxisLabel} />
            <YAxis yAxisId="left" tickFormatter={axisTickFormatter}>
              {renderYAxisLabel(leftAxisLabelText, 'left')}
            </YAxis>
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={axisTickFormatter}
              >
                {renderYAxisLabel(rightAxisLabelText, 'right')}
              </YAxis>
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
            {referenceLineElements}
            {derivedSeries.map((series) => (
              <Line
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                yAxisId={series.yAxisId}
                strokeWidth={series.strokeWidth}
                dot={series.dot}
              />
            ))}
          </LineChart>
        )}

        {config.type === 'area' && (
          <AreaChart data={config.data} margin={chartMargin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={config.xKey || 'name'} label={xAxisLabel} />
            <YAxis yAxisId="left" tickFormatter={axisTickFormatter}>
              {renderYAxisLabel(leftAxisLabelText, 'left')}
            </YAxis>
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={axisTickFormatter}
              >
                {renderYAxisLabel(rightAxisLabelText, 'right')}
              </YAxis>
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
            {referenceLineElements}
            {derivedSeries.map((series) => (
              <Area
                key={series.key}
                type="monotone"
                dataKey={series.key}
                stroke={series.color}
                yAxisId={series.yAxisId}
                fill={series.color}
                fillOpacity={series.opacity}
                stackId={series.stackId}
              />
            ))}
          </AreaChart>
        )}

        {config.type === 'composed' && (
          <ComposedChart data={config.data} margin={chartMargin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={config.xKey || 'name'} label={xAxisLabel} />
            <YAxis yAxisId="left" tickFormatter={axisTickFormatter}>
              {renderYAxisLabel(leftAxisLabelText, 'left')}
            </YAxis>
            {hasRightAxis && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={axisTickFormatter}
              >
                {renderYAxisLabel(rightAxisLabelText, 'right')}
              </YAxis>
            )}
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
            {referenceLineElements}
            {derivedSeries.map((series) => {
              switch (series.type) {
                case 'line':
                  return (
                    <Line
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      yAxisId={series.yAxisId}
                      strokeWidth={series.strokeWidth}
                      dot={series.dot}
                    />
                  );
                case 'area':
                  return (
                    <Area
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      stroke={series.color}
                      yAxisId={series.yAxisId}
                      fill={series.color}
                      fillOpacity={series.opacity}
                      stackId={series.stackId}
                    />
                  );
                case 'scatter':
                  return (
                    <Scatter
                      key={series.key}
                      dataKey={series.key}
                      fill={series.color}
                      yAxisId={series.yAxisId}
                    />
                  );
                default:
                  return (
                    <Bar
                      key={series.key}
                      dataKey={series.key}
                      fill={series.color}
                      stackId={series.stackId}
                      yAxisId={series.yAxisId}
                      radius={[4, 4, 0, 0]}
                    />
                  );
              }
            })}
          </ComposedChart>
        )}

        {config.type === 'pie' && (
          <PieChart>
            <Pie
              data={config.data}
              dataKey={config.dataKeys?.[0] || 'value'}
              nameKey={config.xKey || 'name'}
              cx="50%"
              cy="50%"
              outerRadius={height / 3}
              label
            >
              {config.data.map((_: unknown, index: number) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
          </PieChart>
        )}

        {config.type === 'scatter' && (
          <ScatterChart margin={chartMargin}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={config.xKey || 'x'} label={xAxisLabel} />
            <YAxis
              dataKey={config.dataKeys?.[0] || 'y'}
              tickFormatter={axisTickFormatter}
            >
              {renderYAxisLabel(leftAxisLabelText, 'left')}
            </YAxis>
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={tooltipLabelStyle}
              itemStyle={tooltipItemStyle}
              formatter={tooltipFormatter}
            />
            {showLegend && <Legend />}
            {referenceLineElements}
            <Scatter name="Data" data={config.data} fill={colors[0]} />
          </ScatterChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};
