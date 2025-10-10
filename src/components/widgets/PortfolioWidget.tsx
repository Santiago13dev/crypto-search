'use client';

import BaseWidget from './BaseWidget';
import { ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import type { WidgetProps } from '@/types/widget';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useCurrentPrices } from '@/hooks/useCurrentPrices';

export default function PortfolioWidget({ id, size, onRemove, onResize }: WidgetProps) {
  const { portfolio } = usePortfolio();
  const coinIds = portfolio.map(p => p.id);
  const { prices } = useCurrentPrices(coinIds);

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, item) => {
      const currentPrice = prices[item.id]?.current_price || item.buyPrice;
      return total + (item.amount * currentPrice);
    }, 0);
  };

  const calculateTotalInvested = () => {
    return portfolio.reduce((total, item) => {
      return total + (item.amount * item.buyPrice);
    }, 0);
  };

  const totalValue = calculatePortfolioValue();
  const totalInvested = calculateTotalInvested();
  const profitLoss = totalValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
  const isProfit = profitLoss >= 0;

  return (
    <BaseWidget
      id={id}
      title="Mi Portafolio"
      size={size}
      onRemove={onRemove}
      onToggleSize={onResize ? () => onResize(size === 'compact' ? 'expanded' : 'compact') : undefined}
      icon={<ChartBarIcon className="w-5 h-5" />}
    >
      {portfolio.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-primary/60 font-mono">
          <ChartBarIcon className="w-12 h-12 mb-2" />
          <p>Portafolio vacío</p>
          <p className="text-xs mt-1">Agrega criptomonedas</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#00ff00]/5 border border-primary/20 rounded">
              <p className="text-xs text-primary/60 font-mono mb-1">Valor Total</p>
              <p className="text-lg font-mono font-bold text-primary">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className={`p-3 border rounded ${
              isProfit 
                ? 'bg-green-500/5 border-green-500/20' 
                : 'bg-red-500/5 border-red-500/20'
            }`}>
              <p className="text-xs text-primary/60 font-mono mb-1">Ganancia/Pérdida</p>
              <div className="flex items-center gap-1">
                {isProfit ? (
                  <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                ) : (
                  <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                )}
                <p className={`text-sm font-mono font-bold ${
                  isProfit ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Holdings List */}
          <div className="space-y-2">
            {portfolio.slice(0, size === 'compact' ? 3 : 10).map((item) => {
              const currentPrice = prices[item.id]?.current_price || item.buyPrice;
              const value = item.amount * currentPrice;
              const invested = item.amount * item.buyPrice;
              const itemProfit = value - invested;
              const itemProfitPercent = (itemProfit / invested) * 100;
              const isItemProfit = itemProfit >= 0;

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 bg-[#00ff00]/5 border border-primary/20 rounded hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-6 h-6" />
                    )}
                    <div>
                      <p className="text-xs font-mono font-bold text-primary">
                        {item.symbol.toUpperCase()}
                      </p>
                      <p className="text-xs text-primary/50 font-mono">
                        {item.amount} @ ${item.buyPrice}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-primary">
                      ${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-mono ${
                      isItemProfit ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isItemProfit ? '+' : ''}{itemProfitPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {size === 'compact' && portfolio.length > 3 && (
            <p className="text-xs text-center text-primary/50 font-mono">
              +{portfolio.length - 3} más...
            </p>
          )}
        </div>
      )}
    </BaseWidget>
  );
}
