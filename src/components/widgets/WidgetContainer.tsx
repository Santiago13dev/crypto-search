'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Layout } from 'react-grid-layout';
import type { WidgetConfig } from '@/types/widget';
import PriceWidget from './PriceWidget';
import NewsWidget from './NewsWidget';
import AlertsWidget from './AlertsWidget';
import PortfolioWidget from './PortfolioWidget';
import ChartWidget from './ChartWidget';

// Importar react-grid-layout dinámicamente para evitar problemas de SSR
const GridLayout = dynamic(() => import('react-grid-layout'), { ssr: false });

interface WidgetContainerProps {
  widgets: WidgetConfig[];
  layouts: Layout[];
  onLayoutChange: (newLayouts: Layout[]) => void;
  onRemoveWidget: (id: string) => void;
  onResizeWidget: (id: string, size: 'compact' | 'expanded') => void;
}

export default function WidgetContainer({
  widgets,
  layouts,
  onLayoutChange,
  onRemoveWidget,
  onResizeWidget,
}: WidgetContainerProps) {
  
  const renderWidget = (widget: WidgetConfig) => {
    const commonProps = {
      id: widget.id,
      size: widget.size,
      onRemove: () => onRemoveWidget(widget.id),
      onResize: (size: 'compact' | 'expanded') => onResizeWidget(widget.id, size),
    };

    switch (widget.type) {
      case 'price':
        return <PriceWidget {...commonProps} />;
      case 'news':
        return <NewsWidget {...commonProps} />;
      case 'alerts':
        return <AlertsWidget {...commonProps} />;
      case 'portfolio':
        return <PortfolioWidget {...commonProps} />;
      case 'chart':
        return <ChartWidget {...commonProps} />;
      default:
        return null;
    }
  };

  // Sincronizar layouts con widgets
  const syncedLayouts = useMemo(() => {
    return layouts.filter(layout => 
      widgets.some(widget => widget.id === layout.i)
    );
  }, [layouts, widgets]);

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-primary/30 rounded-lg">
        <div className="text-center">
          <p className="text-2xl font-mono text-primary mb-2">
            {`>`} No hay widgets
          </p>
          <p className="text-sm text-primary/60 font-mono">
            Haz clic en &quot;Agregar Widget&quot; para comenzar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <GridLayout
        className="layout"
        layout={syncedLayouts}
        cols={12}
        rowHeight={80}
        width={1200}
        onLayoutChange={onLayoutChange}
        draggableHandle=".widget-drag-handle"
        compactType="vertical"
        preventCollision={false}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        isDraggable={true}
        isResizable={true}
        resizeHandles={['se']}
      >
        {widgets.map((widget) => (
          <div 
            key={widget.id} 
            className="widget-drag-handle cursor-move"
          >
            {renderWidget(widget)}
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
