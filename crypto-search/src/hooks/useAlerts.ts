import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

const ALERTS_KEY = 'crypto-price-alerts';

export type AlertCondition = 'above' | 'below' | 'change_up' | 'change_down';
export type AlertStatus = 'active' | 'triggered' | 'cancelled';

export interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage?: string;
  condition: AlertCondition;
  targetPrice?: number;
  targetPercentage?: number;
  currentPrice: number;
  createdAt: number;
  triggeredAt?: number;
  status: AlertStatus;
  note?: string;
}

interface UseAlertsReturn {
  alerts: PriceAlert[];
  activeAlerts: PriceAlert[];
  triggeredAlerts: PriceAlert[];
  createAlert: (alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => void;
  deleteAlert: (id: string) => void;
  checkAlerts: (coinId: string, currentPrice: number) => void;
  clearAllAlerts: () => void;
  clearTriggered: () => void;
}

/**
 * Hook para gestionar alertas de precios de criptomonedas
 */
export const useAlerts = (): UseAlertsReturn => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar alertas desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(ALERTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setAlerts(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error al cargar alertas:', error);
      toast.error('Error al cargar alertas');
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Guardar alertas en localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
      } catch (error) {
        console.error('Error al guardar alertas:', error);
        toast.error('Error al guardar alertas');
      }
    }
  }, [alerts, isInitialized]);

  /**
   * Crear una nueva alerta
   */
  const createAlert = useCallback((alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      status: 'active',
    };

    setAlerts((prev) => [...prev, newAlert]);
    
    let message = '';
    if (alert.condition === 'above') {
      message = `Alerta creada: ${alert.coinName} > $${alert.targetPrice}`;
    } else if (alert.condition === 'below') {
      message = `Alerta creada: ${alert.coinName} < $${alert.targetPrice}`;
    } else if (alert.condition === 'change_up') {
      message = `Alerta creada: ${alert.coinName} +${alert.targetPercentage}%`;
    } else if (alert.condition === 'change_down') {
      message = `Alerta creada: ${alert.coinName} -${alert.targetPercentage}%`;
    }
    
    toast.success(message, { icon: '🔔', duration: 3000 });
  }, []);

  /**
   * Eliminar una alerta
   */
  const deleteAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    toast.success('Alerta eliminada', { icon: '🗑️' });
  }, []);

  /**
   * Verificar si alguna alerta se debe activar
   */
  const checkAlerts = useCallback((coinId: string, currentPrice: number) => {
    setAlerts((prev) =>
      prev.map((alert) => {
        if (alert.coinId !== coinId || alert.status !== 'active') {
          return alert;
        }

        let shouldTrigger = false;

        switch (alert.condition) {
          case 'above':
            shouldTrigger = currentPrice >= (alert.targetPrice || 0);
            break;
          case 'below':
            shouldTrigger = currentPrice <= (alert.targetPrice || 0);
            break;
          case 'change_up':
            const increasePercent = ((currentPrice - alert.currentPrice) / alert.currentPrice) * 100;
            shouldTrigger = increasePercent >= (alert.targetPercentage || 0);
            break;
          case 'change_down':
            const decreasePercent = ((alert.currentPrice - currentPrice) / alert.currentPrice) * 100;
            shouldTrigger = decreasePercent >= (alert.targetPercentage || 0);
            break;
        }

        if (shouldTrigger) {
          // Notificar al usuario
          let message = '';
          if (alert.condition === 'above') {
            message = `¡${alert.coinName} ha superado $${alert.targetPrice}!`;
          } else if (alert.condition === 'below') {
            message = `¡${alert.coinName} ha bajado de $${alert.targetPrice}!`;
          } else if (alert.condition === 'change_up') {
            message = `¡${alert.coinName} ha subido +${alert.targetPercentage}%!`;
          } else if (alert.condition === 'change_down') {
            message = `¡${alert.coinName} ha bajado -${alert.targetPercentage}%!`;
          }

          toast.success(message, {
            icon: '🚨',
            duration: 10000,
            style: {
              background: '#00ff00',
              color: '#000',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            },
          });

          // Intentar notificación del navegador
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Crypto Alert!', {
              body: message,
              icon: alert.coinImage,
            });
          }

          return {
            ...alert,
            status: 'triggered' as AlertStatus,
            triggeredAt: Date.now(),
          };
        }

        return alert;
      })
    );
  }, []);

  /**
   * Limpiar todas las alertas
   */
  const clearAllAlerts = useCallback(() => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar todas las ${alerts.length} alertas?`
    );

    if (confirmed) {
      setAlerts([]);
      toast.success('Todas las alertas eliminadas', { icon: '🗑️' });
    }
  }, [alerts.length]);

  /**
   * Limpiar alertas activadas
   */
  const clearTriggered = useCallback(() => {
    setAlerts((prev) => prev.filter((alert) => alert.status !== 'triggered'));
    toast.success('Alertas activadas limpiadas', { icon: '✅' });
  }, []);

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const triggeredAlerts = alerts.filter((a) => a.status === 'triggered');

  return {
    alerts,
    activeAlerts,
    triggeredAlerts,
    createAlert,
    deleteAlert,
    checkAlerts,
    clearAllAlerts,
    clearTriggered,
  };
};