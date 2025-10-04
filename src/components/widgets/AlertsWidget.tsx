'use client';

import BaseWidget from './BaseWidget';
import { BellAlertIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { WidgetProps } from '@/types/widget';
import { useAlerts } from '@/hooks/useAlerts';

export default function AlertsWidget({ id, size, onRemove, onResize }: WidgetProps) {
  const { activeAlerts, triggeredAlerts, deleteAlert } = useAlerts();

  const displayAlerts = size === 'compact' 
    ? [...triggeredAlerts.slice(0, 2), ...activeAlerts.slice(0, 1)]
    : [...triggeredAlerts, ...activeAlerts];

  return (
    <BaseWidget
      id={id}
      title="Alertas Activas"
      size={size}
      onRemove={onRemove}
      onToggleSize={onResize ? () => onResize(size === 'compact' ? 'expanded' : 'compact') : undefined}
      icon={<BellAlertIcon className="w-5 h-5" />}
    >
      {displayAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-primary/60 font-mono">
          <BellAlertIcon className="w-12 h-12 mb-2" />
          <p>No hay alertas</p>
          <p className="text-xs mt-1">Crea alertas de precio</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAlerts.map((alert) => {
            const isTriggered = alert.status === 'triggered';
            
            return (
              <div
                key={alert.id}
                className={`p-3 rounded border ${
                  isTriggered
                    ? 'bg-[#00ff00]/10 border-primary'
                    : 'bg-[#00ff00]/5 border-primary/20'
                } hover:border-primary/40 transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {alert.coinImage && (
                      <img src={alert.coinImage} alt={alert.coinName} className="w-6 h-6" />
                    )}
                    <div>
                      <p className="font-mono font-bold text-primary text-sm">
                        {alert.coinSymbol.toUpperCase()}
                      </p>
                      <p className="text-xs text-primary/60 font-mono">{alert.coinName}</p>
                    </div>
                  </div>
                  
                  {isTriggered && (
                    <span className="text-xs bg-[#00ff00] text-black px-2 py-1 rounded font-mono font-bold">
                      ACTIVADA
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-mono text-primary/80">
                    {alert.condition === 'above' && `Precio > $${alert.targetPrice}`}
                    {alert.condition === 'below' && `Precio < $${alert.targetPrice}`}
                    {alert.condition === 'change_up' && `Aumento > ${alert.targetPercentage}%`}
                    {alert.condition === 'change_down' && `Caída > ${alert.targetPercentage}%`}
                  </p>
                  
                  {alert.note && (
                    <p className="text-xs text-primary/60 font-mono italic">
                      {alert.note}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-xs text-primary/50 font-mono">
                      <ClockIcon className="w-3 h-3" />
                      <span>
                        {new Date(alert.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      Eliminar
                    </button>
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
