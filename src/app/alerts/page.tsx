'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  BellAlertIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAlerts } from '@/hooks/useAlerts';
import { useCurrentPrices } from '@/hooks/useCurrentPrices';
import EmptyState from '@/components/ui/EmptyState';
import QuickAddPortfolioModal from '@/components/features/QuickAddPortfolioModal';
import CreateAlertModal from '@/components/features/CreateAlertModal';
import { Coin } from '@/types/coin';
import { coingeckoService } from '@/lib/services/coingecko';
import { toast } from 'react-hot-toast';

export default function AlertsPage() {
  const {
    alerts,
    activeAlerts,
    triggeredAlerts,
    createAlert,
    deleteAlert,
    checkAlerts,
    clearAllAlerts,
    clearTriggered,
  } = useAlerts();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<{
    id: string;
    name: string;
    symbol: string;
    image?: string;
    currentPrice: number;
  } | null>(null);

  // Obtener precios actuales para verificar alertas
  const coinIds = [...new Set(activeAlerts.map((a) => a.coinId))];
  const { prices } = useCurrentPrices(coinIds);

  // Verificar alertas cuando cambien los precios
  useEffect(() => {
    Object.entries(prices).forEach(([coinId, priceData]) => {
      checkAlerts(coinId, priceData.current_price);
    });
  }, [prices, checkAlerts]);

  const handleSelectCoinForAlert = async (
    id: string,
    name: string,
    symbol: string,
    image: string
  ) => {
    try {
      const details = await coingeckoService.getCoinDetails(id);
      const currentPrice = details.market_data?.current_price?.usd;

      if (!currentPrice) {
        toast.error('No se pudo obtener el precio actual');
        return;
      }

      setSelectedCoin({
        id,
        name,
        symbol,
        image,
        currentPrice,
      });

      setShowSearchModal(false);
      setShowCreateModal(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al obtener información de la moneda');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getConditionText = (alert: typeof alerts[0]) => {
    switch (alert.condition) {
      case 'above':
        return `> $${alert.targetPrice?.toLocaleString()}`;
      case 'below':
        return `< $${alert.targetPrice?.toLocaleString()}`;
      case 'change_up':
        return `+${alert.targetPercentage}%`;
      case 'change_down':
        return `-${alert.targetPercentage}%`;
    }
  };

  const getConditionIcon = (alert: typeof alerts[0]) => {
    switch (alert.condition) {
      case 'above':
        return '⬆️';
      case 'below':
        return '⬇️';
      case 'change_up':
        return '📈';
      case 'change_down':
        return '📉';
    }
  };

  // Solicitar permiso para notificaciones
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
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
              <BellAlertIcon className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold font-mono text-primary">
                  {`>`} ALERTAS DE PRECIOS
                </h1>
                <p className="text-primary/60 font-mono mt-1">
                  Recibe notificaciones cuando el precio cambie
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSearchModal(true)}
                className="px-4 py-2 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Nueva Alerta
              </button>

              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 font-mono hover:bg-red-500/30 transition-all rounded-none flex items-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-primary/20 bg-background rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <ClockIcon className="w-5 h-5 text-primary" />
                <p className="text-xs text-primary/60 font-mono">Activas</p>
              </div>
              <p className="text-3xl font-bold text-primary font-mono">
                {activeAlerts.length}
              </p>
            </div>

            <div className="p-4 border border-emerald-400/20 bg-emerald-400/5 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                <p className="text-xs text-emerald-400/60 font-mono">Activadas</p>
              </div>
              <p className="text-3xl font-bold text-emerald-400 font-mono">
                {triggeredAlerts.length}
              </p>
            </div>

            <div className="p-4 border border-blue-400/20 bg-blue-400/5 rounded-none">
              <div className="flex items-center gap-2 mb-2">
                <BellAlertIcon className="w-5 h-5 text-blue-400" />
                <p className="text-xs text-blue-400/60 font-mono">Total</p>
              </div>
              <p className="text-3xl font-bold text-blue-400 font-mono">
                {alerts.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {alerts.length === 0 ? (
          <EmptyState message="No tienes alertas configuradas" showIcon={false} />
        ) : (
          <>
            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-mono text-primary mb-4">
                  {`>`} Alertas Activas
                </h2>
                <div className="space-y-3">
                  {activeAlerts.map((alert, index) => {
                    const currentPrice = prices[alert.coinId]?.current_price;

                    return (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 border border-primary/20 bg-background hover:border-primary/40 transition-all rounded-none"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 flex-1">
                            {alert.coinImage && (
                              <Image
                                src={alert.coinImage}
                                alt={alert.coinName}
                                width={40}
                                height={40}
                                className="rounded-full flex-shrink-0"
                                unoptimized
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-primary font-mono">
                                  {alert.coinName}
                                </h3>
                                <span className="text-sm text-primary/60 font-mono uppercase">
                                  {alert.coinSymbol}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-mono text-primary/80">
                                  {getConditionIcon(alert)} {getConditionText(alert)}
                                </span>
                                {currentPrice && (
                                  <span className="font-mono text-blue-400">
                                    • Actual: ${currentPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {alert.note && (
                                <p className="text-xs text-primary/50 font-mono mt-1">
                                  📝 {alert.note}
                                </p>
                              )}
                              <p className="text-xs text-primary/40 font-mono mt-1">
                                Creada: {formatDate(alert.createdAt)}
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-none flex-shrink-0"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Triggered Alerts */}
            {triggeredAlerts.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold font-mono text-emerald-400">
                    {`>`} Alertas Activadas
                  </h2>
                  <button
                    onClick={clearTriggered}
                    className="text-sm font-mono text-primary/60 hover:text-primary underline"
                  >
                    Limpiar activadas
                  </button>
                </div>
                <div className="space-y-3">
                  {triggeredAlerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 border border-emerald-400/20 bg-emerald-400/5 rounded-none"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1">
                          {alert.coinImage && (
                            <Image
                              src={alert.coinImage}
                              alt={alert.coinName}
                              width={40}
                              height={40}
                              className="rounded-full flex-shrink-0"
                              unoptimized
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                              <h3 className="font-bold text-emerald-400 font-mono">
                                {alert.coinName}
                              </h3>
                              <span className="text-sm text-emerald-400/60 font-mono uppercase">
                                {alert.coinSymbol}
                              </span>
                            </div>
                            <p className="text-sm font-mono text-emerald-400/80">
                              {getConditionIcon(alert)} {getConditionText(alert)}
                            </p>
                            {alert.note && (
                              <p className="text-xs text-emerald-400/60 font-mono mt-1">
                                📝 {alert.note}
                              </p>
                            )}
                            <p className="text-xs text-emerald-400/50 font-mono mt-1">
                              Activada: {formatDate(alert.triggeredAt || alert.createdAt)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteAlert(alert.id)}
                          className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-none flex-shrink-0"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Info cuando está vacío */}
        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center space-y-4"
          >
            <button
              onClick={() => setShowSearchModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none"
            >
              <BellAlertIcon className="w-5 h-5" />
              Crear tu primera alerta
            </button>
            <p className="text-primary/60 font-mono text-sm">
              Las alertas te notificarán cuando el precio alcance tu objetivo
            </p>
          </motion.div>
        )}
      </div>

      {/* Modal de Búsqueda */}
      <QuickAddPortfolioModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onAdd={handleSelectCoinForAlert}
      />

      {/* Modal de Crear Alerta */}
      {selectedCoin && (
        <CreateAlertModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCoin(null);
          }}
          onCreateAlert={(condition, targetPrice, targetPercentage, note) => {
            createAlert({
              coinId: selectedCoin.id,
              coinName: selectedCoin.name,
              coinSymbol: selectedCoin.symbol,
              coinImage: selectedCoin.image,
              condition,
              targetPrice,
              targetPercentage,
              currentPrice: selectedCoin.currentPrice,
              note,
            });
          }}
          coinId={selectedCoin.id}
          coinName={selectedCoin.name}
          coinSymbol={selectedCoin.symbol}
          coinImage={selectedCoin.image}
          currentPrice={selectedCoin.currentPrice}
        />
      )}
    </main>
  );
}
