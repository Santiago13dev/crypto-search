'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/supabase/useAuth';
import { useRouter } from 'next/navigation';
import { getUserAlerts, createAlert, deleteAlert, getPopularAlerts } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function AlertsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [popularAlerts, setPopularAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-alerts' | 'popular'>('my-alerts');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadAlerts();
      loadPopularAlerts();
    }
  }, [user, authLoading]);

  const loadAlerts = async () => {
    const { alerts: data } = await getUserAlerts();
    setAlerts(data);
    setLoading(false);
  };

  const loadPopularAlerts = async () => {
    const { alerts: data } = await getPopularAlerts();
    setPopularAlerts(data);
  };

  const handleCreateAlert = async (alertData: any) => {
    const { error } = await createAlert(alertData);
    if (error) {
      toast.error('Error al crear alerta');
      return;
    }
    toast.success('¡Alerta creada!');
    setShowCreateAlert(false);
    loadAlerts();
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('¿Eliminar esta alerta?')) return;
    const { error } = await deleteAlert(alertId);
    if (error) {
      toast.error('Error al eliminar');
      return;
    }
    toast.success('Alerta eliminada');
    loadAlerts();
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">🔔</div>
          <p className="text-primary">&gt; Cargando alertas...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-primary font-mono pb-20">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary p-6 mb-8 bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔔</span>
              <div>
                <h1 className="text-2xl font-bold tracking-wider">&gt; ALERTAS_PRECIO</h1>
                <p className="text-sm opacity-70 mt-1">// Sistema de notificaciones</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="border-2 border-primary px-6 py-3 hover:bg-primary hover:text-background transition-all duration-300 font-bold tracking-wider"
            >
              + CREAR
            </button>
          </div>
        </motion.div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('my-alerts')}
            className={`border-2 px-6 py-3 font-bold tracking-wider transition-all ${
              activeTab === 'my-alerts'
                ? 'border-primary bg-primary text-background'
                : 'border-primary/30 hover:border-primary'
            }`}
          >
            MIS_ALERTAS ({alerts.length})
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`border-2 px-6 py-3 font-bold tracking-wider transition-all ${
              activeTab === 'popular'
                ? 'border-primary bg-primary text-background'
                : 'border-primary/30 hover:border-primary'
            }`}
          >
            🔥 POPULARES
          </button>
        </div>

        {activeTab === 'my-alerts' ? (
          <div className="space-y-4">
            {alerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-primary/30 p-12 text-center"
              >
                <p className="text-xl opacity-70 mb-4">&gt; NO_ALERTS_FOUND</p>
                <button
                  onClick={() => setShowCreateAlert(true)}
                  className="border-2 border-primary px-6 py-3 hover:bg-primary hover:text-background transition-all font-bold"
                >
                  CREAR_PRIMERA_ALERTA
                </button>
              </motion.div>
            ) : (
              alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-primary bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all"
                >
                  <div className="p-6 flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl font-bold">{alert.coin_symbol}</span>
                        <span className={`border-2 px-3 py-1 text-sm font-bold ${
                          alert.condition === 'above' 
                            ? 'border-green-500 text-green-500' 
                            : 'border-red-500 text-red-500'
                        }`}>
                          {alert.condition === 'above' ? '📈 ABOVE' : '📉 BELOW'}
                        </span>
                      </div>
                      
                      <p className="text-lg mb-2">
                        <span className="opacity-70">TARGET: </span>
                        <span className="font-bold">${alert.target_price.toLocaleString()}</span>
                      </p>
                      
                      {alert.message && (
                        <p className="opacity-70 text-sm mb-2">💬 {alert.message}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs opacity-70 font-mono">
                        <span>🔔 {alert.notify_email ? 'EMAIL_ON' : 'EMAIL_OFF'}</span>
                        <span>📅 {new Date(alert.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="border-2 border-red-500 text-red-500 px-4 py-2 hover:bg-red-500 hover:text-black transition-all font-bold"
                    >
                      DEL
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {popularAlerts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-2 border-primary/30 p-12 text-center"
              >
                <p className="text-xl opacity-70">&gt; NO_POPULAR_ALERTS</p>
              </motion.div>
            ) : (
              popularAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-2 border-primary bg-background/80 backdrop-blur-sm p-6"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold">{alert.coin_symbol}</span>
                    <span className={`text-2xl ${alert.sentiment === 'bullish' ? 'text-green-500' : 'text-red-500'}`}>
                      {alert.sentiment === 'bullish' ? '📈' : '📉'}
                    </span>
                    <span className="border-2 border-primary px-3 py-1 font-bold text-sm">
                      {alert.users_count} USUARIOS
                    </span>
                  </div>
                  
                  <p className="text-lg mb-2">
                    <span className="opacity-70">TARGET: </span>
                    <span className="font-bold">${alert.target_price.toLocaleString()}</span>
                  </p>
                  
                  <p className="opacity-70 text-sm">
                    AVG_PRICE: ${alert.avg_target_price?.toLocaleString()}
                  </p>
                  
                  <div className="mt-3">
                    <span className={`font-bold ${alert.sentiment === 'bullish' ? 'text-green-500' : 'text-red-500'}`}>
                      SENTIMENT: {alert.sentiment.toUpperCase()}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        <AnimatePresence>
          {showCreateAlert && (
            <CreateAlertModal
              onClose={() => setShowCreateAlert(false)}
              onCreate={handleCreateAlert}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function CreateAlertModal({ onClose, onCreate }: any) {
  const [formData, setFormData] = useState({
    coin_id: '',
    coin_symbol: '',
    target_price: '',
    condition: 'above' as 'above' | 'below',
    message: '',
    notify_email: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      coin_id: formData.coin_id.toLowerCase(),
      coin_symbol: formData.coin_symbol.toUpperCase(),
      target_price: parseFloat(formData.target_price),
      condition: formData.condition,
      message: formData.message,
      notify_email: formData.notify_email
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="border-4 border-primary bg-background p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6">&gt; CREAR_ALERTA</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">// COIN_ID</label>
              <input
                type="text"
                required
                value={formData.coin_id}
                onChange={(e) => setFormData({ ...formData, coin_id: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="bitcoin"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">// SYMBOL</label>
              <input
                type="text"
                required
                value={formData.coin_symbol}
                onChange={(e) => setFormData({ ...formData, coin_symbol: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="BTC"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">// TARGET</label>
              <input
                type="number"
                step="any"
                required
                value={formData.target_price}
                onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="70000"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">// CONDITION</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
              >
                <option value="above">📈 ABOVE</option>
                <option value="below">📉 BELOW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-70">// MESSAGE</label>
            <input
              type="text"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
              placeholder="Bitcoin alcanzó objetivo"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.notify_email}
              onChange={(e) => setFormData({ ...formData, notify_email: e.target.checked })}
              className="w-5 h-5 border-2 border-primary"
            />
            <label className="text-sm">NOTIFY_EMAIL</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-primary px-6 py-3 hover:bg-primary/20 transition-all font-bold"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              className="flex-1 border-2 border-primary px-6 py-3 bg-primary text-background hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all font-bold"
            >
              CREAR
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
