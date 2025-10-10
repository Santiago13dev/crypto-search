'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  CurrencyDollarIcon,
  NewspaperIcon,
  BellAlertIcon,
  ChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import type { WidgetType } from '@/types/widget';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: WidgetType) => void;
}

const WIDGET_OPTIONS = [
  {
    type: 'price' as WidgetType,
    title: 'Precios',
    description: 'Monitorea precios en tiempo real',
    icon: CurrencyDollarIcon,
  },
  {
    type: 'news' as WidgetType,
    title: 'Noticias',
    description: 'Últimas noticias del mundo crypto',
    icon: NewspaperIcon,
  },
  {
    type: 'alerts' as WidgetType,
    title: 'Alertas',
    description: 'Gestiona tus alertas de precio',
    icon: BellAlertIcon,
  },
  {
    type: 'portfolio' as WidgetType,
    title: 'Portafolio',
    description: 'Resumen de tu portafolio',
    icon: ChartBarIcon,
  },
  {
    type: 'chart' as WidgetType,
    title: 'Gráfico',
    description: 'Gráficos de precios detallados',
    icon: PresentationChartLineIcon,
  },
];

export default function AddWidgetModal({ isOpen, onClose, onAdd }: AddWidgetModalProps) {
  const handleAdd = (type: WidgetType) => {
    onAdd(type);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-primary/30 bg-[#00ff00]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlusIcon className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-mono font-bold text-primary">
                      {`>`} Agregar Widget
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-primary hover:text-primary/70 transition-colors font-mono text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)] scrollbar-terminal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WIDGET_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.type}
                        onClick={() => handleAdd(option.type)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="p-4 bg-[#00ff00]/5 border border-primary/30 rounded-lg hover:border-primary hover:bg-[#00ff00]/10 transition-all text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-[#00ff00]/10 rounded border border-primary/30 group-hover:bg-[#00ff00]/20 transition-colors">
                            <Icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-mono font-bold text-primary mb-1">
                              {option.title}
                            </h3>
                            <p className="text-sm text-primary/60 font-mono">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-[#00ff00]/5 border border-primary/30 rounded">
                  <p className="text-xs text-primary/60 font-mono">
                    💡 <span className="text-primary">Tip:</span> Arrastra y suelta los widgets para reorganizarlos. 
                    Redimensiónalos para ajustar el tamaño.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
