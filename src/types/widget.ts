export type WidgetType = 'price' | 'news' | 'alerts' | 'portfolio' | 'chart';
export type WidgetSize = 'compact' | 'expanded';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  settings?: Record<string, unknown>;
}

export interface WidgetLayout {
  i: string; // id del widget
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export interface SavedLayout {
  id: string;
  name: string;
  layouts: WidgetLayout[];
  widgets: WidgetConfig[];
  createdAt: number;
  updatedAt: number;
}

export interface WidgetProps {
  id: string;
  size: WidgetSize;
  onRemove: () => void;
  onResize?: (size: WidgetSize) => void;
}

export interface PriceWidgetSettings {
  coinIds: string[];
  refreshInterval?: number;
}

export interface NewsWidgetSettings {
  category?: string;
  limit?: number;
}

export interface AlertsWidgetSettings {
  showTriggered?: boolean;
  limit?: number;
}

export interface PortfolioWidgetSettings {
  showChart?: boolean;
  sortBy?: 'value' | 'change' | 'name';
}

export interface ChartWidgetSettings {
  coinId?: string;
  timeRange?: '24h' | '7d' | '30d' | '1y';
  chartType?: 'line' | 'candlestick' | 'area';
}
