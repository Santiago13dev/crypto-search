'use client';

import { useState } from 'react';
import BaseWidget from './BaseWidget';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import type { WidgetProps } from '@/types/widget';
import { useFavorites } from '@/hooks/useFavorites';

export default function ChartWidget({ id, size, onRemove, onResize }: WidgetProps) {
  const { favorites } = useFavorites();
  const [selectedCoin, setSelectedCoin] = useState(favorites[0]?.id || 'bitcoin');

  // Mock chart data - en producción esto vendría de una API
  const chartData = [
    { time: '00:00', price: 42000 },
    { time: '04:00', price: 42500 },
    { time: '08:00', price: 43200 },
    { time: '12:00', price: 42800 },
    { time: '16:00', price: 44100 },
    { time: '20:00', price: 45000 },
    { time: '24:00', price: 44500 },
  ];

  const maxPrice = Math.max(...chartData.map(d => d.price));
  const minPrice = Math.min(...chartData.map(d => d.price));
  const range = maxPrice - minPrice;

  return (
    <BaseWidget
      id={id}
      title="Gráfico de Precios"
      size={size}
      onRemove={onRemove}
      onToggleSize={onResize ? () => onResize(size === 'compact' ? 'expanded' : 'compact') : undefined}
      icon={<PresentationChartLineIcon className="w-5 h-5" />}
    >
      <div className="space-y-4 h-full flex flex-col">
        {/* Coin selector */}
        {favorites.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-terminal">
            {favorites.slice(0, 5).map((coin) => (
              <button
                key={coin.id}
                onClick={() => setSelectedCoin(coin.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded border font-mono text-xs whitespace-nowrap transition-colors ${
                  selectedCoin === coin.id
                    ? 'bg-[#00ff00]/20 border-[#00ff00] text-[#00ff00]'
                    : 'bg-[#00ff00]/5 border-[#00ff00]/20 text-[#00ff00]/60 hover:border-[#00ff00]/40'
                }`}
              >
                {coin.image && (
                  <img src={coin.image} alt={coin.name} className="w-4 h-4" />
                )}
                {coin.symbol.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        {/* Chart */}
        <div className="flex-1 relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={i * 50}
                x2="400"
                y2={i * 50}
                stroke="#00ff00"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
            ))}

            {/* Price line */}
            <polyline
              fill="none"
              stroke="#00ff00"
              strokeWidth="2"
              points={chartData
                .map((point, i) => {
                  const x = (i / (chartData.length - 1)) * 400;
                  const y = 200 - ((point.price - minPrice) / range) * 180 - 10;
                  return `${x},${y}`;
                })
                .join(' ')}
            />

            {/* Fill area */}
            <polygon
              fill="#00ff00"
              fillOpacity="0.1"
              points={
                chartData
                  .map((point, i) => {
                    const x = (i / (chartData.length - 1)) * 400;
                    const y = 200 - ((point.price - minPrice) / range) * 180 - 10;
                    return `${x},${y}`;
                  })
                  .join(' ') + ' 400,200 0,200'
              }
            />

            {/* Data points */}
            {chartData.map((point, i) => {
              const x = (i / (chartData.length - 1)) * 400;
              const y = 200 - ((point.price - minPrice) / range) * 180 - 10;
              return (
                <circle
                  key={`point-${i}`}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#00ff00"
                  className="cursor-pointer hover:r-6 transition-all"
                >
                  <title>{`${point.time}: $${point.price.toLocaleString()}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>

        {/* Chart info */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
            <p className="text-[#00ff00]/60 mb-1">Máximo</p>
            <p className="text-[#00ff00] font-bold">${maxPrice.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
            <p className="text-[#00ff00]/60 mb-1">Mínimo</p>
            <p className="text-[#00ff00] font-bold">${minPrice.toLocaleString()}</p>
          </div>
          <div className="p-2 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded">
            <p className="text-[#00ff00]/60 mb-1">Variación</p>
            <p className="text-green-400 font-bold">+{((range / minPrice) * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </BaseWidget>
  );
}
