'use client';

import { useState, useEffect } from 'react';
import BaseWidget from './BaseWidget';
import { CurrencyDollarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import type { WidgetProps } from '@/types/widget';
import { useCurrentPrices } from '@/hooks/useCurrentPrices';
import { useFavorites } from '@/hooks/useFavorites';

export default function PriceWidget({ id, size, onRemove, onResize }: WidgetProps) {
  const { favorites } = useFavorites();
  const coinIds = favorites.map(f => f.id).slice(0, size === 'compact' ? 3 : 6);
  const { prices, loading } = useCurrentPrices(coinIds);

  return (
    <BaseWidget
      id={id}
      title="Precios en Tiempo Real"
      size={size}
      onRemove={onRemove}
      onToggleSize={onResize ? () => onResize(size === 'compact' ? 'expanded' : 'compact') : undefined}
      icon={<CurrencyDollarIcon className="w-5 h-5" />}
    >
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-[#00ff00] font-mono animate-pulse">Cargando precios...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-[#00ff00]/60 font-mono">
          <CurrencyDollarIcon className="w-12 h-12 mb-2" />
          <p>No hay favoritos</p>
          <p className="text-xs mt-1">Agrega monedas a favoritos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.slice(0, size === 'compact' ? 3 : 6).map((coin) => {
            const price = prices[coin.id];
            const change = price?.price_change_percentage_24h || 0;
            const isPositive = change >= 0;

            return (
              <div
                key={coin.id}
                className="flex items-center justify-between p-3 bg-[#00ff00]/5 border border-[#00ff00]/20 rounded hover:border-[#00ff00]/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {coin.image && (
                    <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  )}
                  <div>
                    <p className="font-mono font-bold text-[#00ff00]">{coin.symbol.toUpperCase()}</p>
                    <p className="text-xs text-[#00ff00]/60 font-mono">{coin.name}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-mono font-bold text-[#00ff00]">
                    ${price?.current_price?.toLocaleString() || '---'}
                  </p>
                  <div className={`flex items-center gap-1 justify-end text-xs font-mono ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? (
                      <ArrowTrendingUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3" />
                    )}
                    <span>{Math.abs(change).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </BaseWidget>
  );
}
