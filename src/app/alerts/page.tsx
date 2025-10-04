'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/components/language/I18nProvider';
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
import { coingeckoService } from '@/lib/services/coingecko';
import { toast } from 'react-hot-toast';

export default function AlertsPage() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  
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

  const coinIds = [...new Set(activeAlerts.map((a) => a.coinId))];
  const { prices } = useCurrentPrices(coinIds);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    Object.entries(prices).forEach(([coinId, priceData]) => {
      checkAlerts(coinId, priceData.current_price);
    });
  }, [prices, checkAlerts]);

  if (!mounted) return null;

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
      case 'percent_up':
        return `+${alert.targetPrice}%`;
      case 'percent_down':
        return `-${alert.targetPrice}%`;
      default:
        return '';
    }
  };

  return (
    <main className="min-h-screen bg-background text-primary relative overflow-hidden">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full h-px bg-primary" style={{ top: `${i * 5}%` }} />
        ))}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full w-px bg-primary" style={{ left: `${i * 5}%` }} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-3">
              <BellAlertIcon className="w-10 h-10 text-primary" />
              <div>
                <h1 className="text-4xl font-bold font-mono text-primary">
                  {`>`} {t('alerts.title')}
                </h1>
                <p className="text-primary/60 font-mono mt-1">
                  {t('alerts.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSearchModal(true)}
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
                className="px-4 py-2 font-bold font-mono hover:brightness-125 transition-all rounded-none flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                {t('alerts.new')}
              </button>
              
              {alerts.length > 0 && (
                <button
                  onClick={clearAllAlerts}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/40 text-red-400 font-mono hover:bg-red-500/30 transition-all rounded-none flex items-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  {t('common.clear')}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-primary/20 bg-background-secondary rounded-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-primary/60 font-mono uppercase">{t('alerts.active')}</span>
                <ClockIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary font-mono">{activeAlerts.length}</p>
            </div>

            <div className="p-4 border border-emerald-500/20 bg-emerald-500/5 rounded-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400/80 font-mono uppercase">{t('alerts.triggered')}</span>
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-bold text-emerald-400 font-mono">{triggeredAlerts.length}</p>
            </div>

            <div className="p-4 border border-primary/20 bg-background-secondary rounded-none">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-primary/60 font-mono uppercase">{t('alerts.total')}</span>
                <BellAlertIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-primary font-mono">{alerts.length}</p>
            </div>
          </div>
        </motion.div>

        {alerts.length === 0 ? (
          <div className="space-y-6">
            <EmptyState message={t('alerts.noAlerts')} showIcon={false} />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
              <button
                onClick={() => setShowSearchModal(true)}
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}
                className="inline-flex items-center gap-2 px-6 py-3 font-bold font-mono hover:brightness-125 transition-all rounded-none"
              >
                <PlusIcon className="w-5 h-5" />
                {t('alerts.createFirst')}
              </button>
              <p className="mt-4 text-sm text-primary/60 font-mono">
                {t('alerts.description')}
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 sm:p-6 border rounded-none transition-all ${
                  alert.status === 'triggered'
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-primary/20 bg-background hover:border-primary/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {alert.coinImage && (
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={alert.coinImage}
                          alt={alert.coinName}
                          width={48}
                          height={48}
                          className="rounded-full border border-primary/20"
                          unoptimized
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-primary font-mono truncate">
                        {alert.coinName}
                      </h3>
                      <p className="text-sm text-primary/60 font-mono uppercase">
                        {alert.coinSymbol}
                      </p>
                      
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-mono text-primary/80">
                          Condición: <span className="text-primary font-bold">{getConditionText(alert)}</span>
                        </p>
                        <p className="text-xs text-primary/50 font-mono">
                          Creada: {formatDate(alert.createdAt)}
                        </p>
                        {alert.status === 'triggered' && alert.triggeredAt && (
                          <p className="text-xs text-emerald-400 font-mono">
                            ✓ Activada: {formatDate(alert.triggeredAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all rounded-none flex-shrink-0"
                    aria-label={t('common.delete')}
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <QuickAddPortfolioModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onAdd={handleSelectCoinForAlert}
      />

      {selectedCoin && (
        <CreateAlertModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCoin(null);
          }}
          onCreate={createAlert}
          coin={selectedCoin}
        />
      )}
    </main>
  );
}
