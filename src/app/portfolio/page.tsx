'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
import { formatNumber } from '@/lib/utils/helpers';
import EmptyState from '@/components/ui/EmptyState';
import QuickAddPortfolioModal from '@/components/features/QuickAddPortfolioModal';
import PortfolioStats from '@/components/features/PortfolioStats';
import PortfolioChart from '@/components/features/PortfolioChart';

export default function PortfolioPage() {
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

  // Obtener precios actuales
  const coinIds = portfolio.map(item => item.id);
  const { prices, loading: pricesLoading } = useCurrentPrices(coinIds);

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

  // Calcular valor actual del portafolio
  const currentValue = portfolio.reduce((total, item) => {
    const currentPrice = prices[item.id]?.current_price || item.buyPrice;
    return total + (item.amount * currentPrice);
  }, 0);

  return (
    <main className="min-h-screen bg-[#0a0f1e] text-[#00ff00] relative overflow-hidden">
      {/* Grid de fondo */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-[#00ff00]"
            style={{ top: `${i * 5}%` }}
          />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-[#00ff00]"
            style={{ left: `${i * 5}%` }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BriefcaseIcon className="w-10 h-10 text-[#00ff00]" />
              <div>
                <h1 className="text-4xl font-bold font-mono text-[#00ff00]">
                  {`>`} MI PORTAFOLIO
                </h1>
                <p className="text-[#00ff00]/60 font-mono mt-1">
                  Gestiona y monitorea tus inversiones
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Agregar
              </button>
              
              {portfolio.length > 0 && (
                <button
                  onClick={clearPortfolio}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 font-mono hover:bg-red-500/30 transition-all rounded-none flex items-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  Limpiar
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {portfolio.length === 0 ? (
          <EmptyState
            message="Tu portafolio está vacío"
            showIcon={false}
          />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-8">
              <PortfolioStats
                portfolio={portfolio}
                totalInvestment={totalInvestment}
                currentValue={currentValue}
              />
            </div>

            {/* Grid: Chart + Holdings */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Chart */}
              <div className="lg:col-span-1">
                <PortfolioChart
                  portfolio={portfolio}
                  totalInvestment={totalInvestment}
                />
              </div>

              {/* Top Holdings */}
              <div className="lg:col-span-2">
                <div className="p-6 border border-[#00ff00]/20 bg-[#0a0f1e] rounded-none">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#00ff00] font-mono">
                      {`>`} Principales Holdings
                    </h3>
                    {pricesLoading && (
                      <div className="flex items-center gap-2 text-[#00ff00]/60 text-sm font-mono">
                        <ArrowPathIcon className="w-4 h-4 animate-spin" />
                        Actualizando...
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
                            className="flex items-center justify-between p-3 border border-[#00ff00]/10 hover:border-[#00ff00]/30 transition-all rounded-none"
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
                                <p className="font-bold text-[#00ff00] font-mono text-sm">
                                  {item.name}
                                </p>
                                <p className="text-xs text-[#00ff00]/60 font-mono uppercase">
                                  {item.amount.toFixed(4)} {item.symbol}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm font-bold font-mono text-[#00ff00]">
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

            {/* Full Portfolio List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold font-mono text-[#00ff00] mb-4">
                {`>`} Todos los Activos
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
                    className="p-4 sm:p-6 border border-[#00ff00]/20 bg-[#0a0f1e] rounded-none hover:border-[#00ff00]/40 transition-all"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Top Row */}
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        {/* Coin Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {item.image && (
                            <div className="relative w-12 h-12 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="rounded-full border border-[#00ff00]/20"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-[#00ff00] font-mono truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-[#00ff00]/60 font-mono uppercase">
                              {item.symbol}
                            </p>
                          </div>
                        </div>

                        {/* Current Value */}
                        <div className="text-right">
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            Valor Actual
                          </p>
                          <p className="text-2xl font-bold text-[#00ff00] font-mono">
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

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {/* Cantidad */}
                        <div>
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            Cantidad
                          </p>
                          {isEditing ? (
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(item.id);
                              }}
                              className="w-full bg-[#0a0f1e] border border-[#00ff00] text-[#00ff00] px-2 py-1 text-sm font-mono focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <p className="text-base font-mono text-[#00ff00]">
                              {item.amount.toFixed(8)}
                            </p>
                          )}
                        </div>

                        {/* Precio Compra */}
                        <div>
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            Compra
                          </p>
                          <p className="text-base font-mono text-[#00ff00]">
                            ${item.buyPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Precio Actual */}
                        <div>
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            Actual
                          </p>
                          <p className="text-base font-mono text-blue-400">
                            ${currentPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Invertido */}
                        <div>
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            Invertido
                          </p>
                          <p className="text-base font-mono text-[#00ff00]">
                            ${investedValue.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        {/* Ganancia/Pérdida */}
                        <div>
                          <p className="text-xs text-[#00ff00]/50 font-mono mb-1">
                            G/P
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

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-[#00ff00]/10">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(item.id)}
                              className="px-3 py-2 bg-[#00ff00]/20 border border-[#00ff00]/40 text-[#00ff00] hover:bg-[#00ff00]/30 transition-all text-xs font-mono rounded-none"
                            >
                              ✓ Guardar
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null);
                                setEditAmount('');
                              }}
                              className="px-3 py-2 bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all text-xs font-mono rounded-none"
                            >
                              ✕ Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(item.id, item.amount)}
                              className="p-2 bg-[#00ff00]/10 border border-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/20 transition-all rounded-none"
                              aria-label="Editar cantidad"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeFromPortfolio(item.id)}
                              className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-none"
                              aria-label="Eliminar"
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

        {/* Hint cuando está vacío */}
        {portfolio.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none"
            >
              <PlusIcon className="w-5 h-5" />
              Comenzar a agregar criptomonedas
            </button>
          </motion.div>
        )}
      </div>

      {/* Modal de Agregar */}
      <QuickAddPortfolioModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleQuickAdd}
      />
    </main>
  );
}
