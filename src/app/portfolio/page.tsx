'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/components/language/I18nProvider';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  BriefcaseIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useCurrentPrices } from '@/hooks/useCurrentPrices';
import EmptyState from '@/components/ui/EmptyState';
import QuickAddPortfolioModal from '@/components/features/QuickAddPortfolioModal';
import PortfolioStats from '@/components/features/PortfolioStats';
import PortfolioChart from '@/components/features/PortfolioChart';

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
  const {
    portfolio,
    addToPortfolio,
    removeFromPortfolio,
    updateAmount,
    clearPortfolio,
    getTotalInvestment,
  } = usePortfolio();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

  const coinIds = portfolio.map(item => item.id);
  const { prices, loading: pricesLoading } = useCurrentPrices(coinIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleEdit = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = (id: string) => {
    const newAmount = parseFloat(editAmount);
    if (!isNaN(newAmount) && newAmount > 0) {
      updateAmount(id, newAmount);
      setEditingId(null);
      setEditAmount('');
    }
  };

  const handleQuickAdd = (
    id: string,
    name: string,
    symbol: string,
    image: string,
    amount: number,
    buyPrice: number
  ) => {
    addToPortfolio({
      id,
      name,
      symbol,
      image,
      amount,
      buyPrice,
    });
  };

  const totalInvestment = getTotalInvestment();

  const currentValue = portfolio.reduce((total, item) => {
    const currentPrice = prices[item.id]?.current_price || item.buyPrice;
    return total + (item.amount * currentPrice);
  }, 0);

  return (
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-primary"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-primary"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold font-mono text-primary">
                  {`>`} {t('portfolio.title')}
                </h1>
                <p className="text-primary/60 font-mono mt-1">
                  {t('portfolio.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
                className="px-4 py-2 font-bold font-mono hover:brightness-125 transition-all rounded-none flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                {t('portfolio.add')}
              </button>
              
              {portfolio.length > 0 && (
                <button
                  onClick={clearPortfolio}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 font-mono hover:bg-red-500/30 transition-all rounded-none flex items-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  {t('portfolio.clear')}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {portfolio.length === 0 ? (
          <EmptyState
            message={t('portfolio.emptyDescription')}
            showIcon={false}
          />
        ) : (
          <>
            <div className="mb-8">
              <PortfolioStats
                portfolio={portfolio}
                totalInvestment={totalInvestment}
                currentValue={currentValue}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-1">
                <PortfolioChart
                  portfolio={portfolio}
                  totalInvestment={totalInvestment}
                />
              </div>

              <div className="lg:col-span-2">
                <div className="p-6 border border-primary/20 bg-background rounded-none">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-primary font-mono">
                      {`>`} {t('portfolio.mainHoldings')}
                    </h3>
                    {pricesLoading && (
                      <div className="flex items-center gap-2 text-primary/60 text-sm font-mono">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        {t('portfolio.refreshing')}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {portfolio
                      .map(item => ({
                        ...item,
                        currentPrice: prices[item.id]?.current_price || item.buyPrice,
                        currentValue: (prices[item.id]?.current_price || item.buyPrice) * item.amount,
                        profitLoss: ((prices[item.id]?.current_price || item.buyPrice) - item.buyPrice) * item.amount,
                        profitLossPercent: prices[item.id]?.current_price 
                          ? (((prices[item.id].current_price - item.buyPrice) / item.buyPrice) * 100)
                          : 0,
                      }))
                      .sort((a, b) => b.currentValue - a.currentValue)
                      .slice(0, 5)
                      .map((item, index) => {
                        const isProfit = item.profitLoss >= 0;
                        
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center justify-between p-3 border border-primary/10 hover:border-primary/30 transition-all rounded-none"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                  unoptimized
                                />
                              )}
                              <div>
                                <p className="font-bold text-primary font-mono text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-primary/60 font-mono uppercase">
                                  {item.amount.toFixed(4)} {item.symbol}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold font-mono text-primary">
                                ${item.currentValue.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                              <div className="flex items-center justify-end gap-1">
                                {isProfit ? (
                                  <ArrowTrendingUpIcon className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <ArrowTrendingDownIcon className="w-3 h-3 text-red-400" />
                                )}
                                <span className={`text-xs font-mono ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {isProfit ? '+' : ''}{item.profitLossPercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold font-mono text-primary mb-4">
                {`>`} {t('portfolio.total')}
              </h2>

              {portfolio.map((item, index) => {
                const isEditing = editingId === item.id;
                const currentPrice = prices[item.id]?.current_price || item.buyPrice;
                const currentValue = item.amount * currentPrice;
                const investedValue = item.amount * item.buyPrice;
                const profitLoss = currentValue - investedValue;
                const profitLossPercent = ((currentPrice - item.buyPrice) / item.buyPrice) * 100;
                const isProfit = profitLoss >= 0;
                const priceChange24h = prices[item.id]?.price_change_percentage_24h || 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 sm:p-6 border border-primary/20 bg-background rounded-none hover:border-primary/40 transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {item.image && (
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-full border border-primary/20"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-primary font-mono truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-primary/60 font-mono uppercase">
                              {item.symbol}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.currentValue')}
                          </p>
                          <p className="text-2xl font-bold text-primary font-mono">
                            ${currentValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          {priceChange24h !== 0 && (
                            <div className="flex items-center justify-end gap-1 mt-1">
                              {priceChange24h >= 0 ? (
                                <ArrowTrendingUpIcon className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <ArrowTrendingDownIcon className="w-3 h-3 text-red-400" />
                              )}
                              <span className={`text-xs font-mono ${priceChange24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {priceChange24h >= 0 ? '+' : ''}{priceChange24h.toFixed(2)}% 24h
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div>
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.amount')}
                          </p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(item.id);
                              }}
                              className="w-full bg-background border border-primary text-primary px-2 py-1 text-sm font-mono focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <p className="text-base font-mono text-primary">
                              {item.amount.toFixed(8)}
                            </p>
                          )}
                        </div>

                        <div>
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.buyPrice')}
                          </p>
                          <p className="text-base font-mono text-primary">
                            ${item.buyPrice.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.currentPrice')}
                          </p>
                          <p className="text-base font-mono text-blue-400">
                            ${currentPrice.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.investment')}
                          </p>
                          <p className="text-base font-mono text-primary">
                            ${investedValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-primary/50 font-mono mb-1">
                            {t('portfolio.profitLoss')}
                          </p>
                          <div>
                            <p className={`text-base font-mono font-bold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isProfit ? '+' : ''}${Math.abs(profitLoss).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </p>
                            <p className={`text-xs font-mono ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                              {isProfit ? '+' : ''}{profitLossPercent.toFixed(2)}%
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-primary/10">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="px-3 py-2 bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-all text-xs font-mono rounded-none"
                            >
                              ✓ {t('common.save')}
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditAmount('');
                              }}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-xs font-mono rounded-none"
                            >
                              ✕ {t('common.cancel')}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(item.id, item.amount)}
                              className="p-2 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all rounded-none"
                              aria-label={t('common.edit')}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromPortfolio(item.id)}
                              className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-none"
                              aria-label={t('common.delete')}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {portfolio.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowAddModal(true)}
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
              className="inline-flex items-center gap-2 px-6 py-3 font-bold font-mono hover:brightness-125 transition-all rounded-none"
            >
              <PlusIcon className="w-5 h-5" />
              {t('portfolio.add')}
            </button>
          </motion.div>
        )}
      </div>

      <QuickAddPortfolioModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleQuickAdd}
      />
    </main>
  );
}
