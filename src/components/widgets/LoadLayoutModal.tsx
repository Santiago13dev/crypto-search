'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowPathIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import type { SavedLayout } from '@/types/widget';

interface LoadLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLayouts: SavedLayout[];
  activeLayoutId: string | null;
  onLoad: (layoutId: string) => void;
  onDelete: (layoutId: string) => void;
}

export default function LoadLayoutModal({
  isOpen,
  onClose,
  savedLayouts,
  activeLayoutId,
  onLoad,
  onDelete,
}: LoadLayoutModalProps) {
  const handleLoad = (layoutId: string) => {
    onLoad(layoutId);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, layoutId: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de eliminar este layout?')) {
      onDelete(layoutId);
    }
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
            <div className="bg-[#0a0f1e] border-2 border-[#00ff00] rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#00ff00]/30 bg-[#00ff00]/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ArrowPathIcon className="w-6 h-6 text-[#00ff00]" />
                    <h2 className="text-xl font-mono font-bold text-[#00ff00]">
                      {`>`} Cargar Layout
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-[#00ff00] hover:text-[#00ff00]/70 transition-colors font-mono text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] scrollbar-terminal">
                {savedLayouts.length === 0 ? (
                  <div className="text-center py-12">
                    <ArrowPathIcon className="w-16 h-16 text-[#00ff00]/30 mx-auto mb-4" />
                    <p className="text-[#00ff00]/60 font-mono">
                      No hay layouts guardados
                    </p>
                    <p className="text-xs text-[#00ff00]/40 font-mono mt-2">
                      Guarda tu configuración actual para acceder rápidamente después
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedLayouts.map((layout) => (
                      <motion.div
                        key={layout.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleLoad(layout.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          activeLayoutId === layout.id
                            ? 'bg-[#00ff00]/20 border-2 border-[#00ff00]'
                            : 'bg-[#00ff00]/5 border border-[#00ff00]/30 hover:border-[#00ff00] hover:bg-[#00ff00]/10'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-mono font-bold text-[#00ff00]">
                                {layout.name}
                              </h3>
                              {activeLayoutId === layout.id && (
                                <span className="text-xs bg-[#00ff00] text-black px-2 py-1 rounded font-mono font-bold">
                                  ACTIVO
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-[#00ff00]/60 font-mono">
                              <span>{layout.widgets.length} widgets</span>
                              <div className="flex items-center gap-1">
                                <ClockIcon className="w-3 h-3" />
                                <span>
                                  {new Date(layout.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Widget types */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {[...new Set(layout.widgets.map(w => w.type))].map((type) => (
                                <span
                                  key={type}
                                  className="text-xs px-2 py-1 bg-[#00ff00]/10 border border-[#00ff00]/30 rounded font-mono"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleDelete(e, layout.id)}
                            className="p-2 hover:bg-red-500/10 rounded transition-colors group ml-4"
                            title="Eliminar layout"
                          >
                            <TrashIcon className="w-4 h-4 text-[#00ff00] group-hover:text-red-500" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#00ff00]/30">
                <p className="text-xs text-[#00ff00]/60 font-mono">
                  💡 Haz clic en un layout para cargarlo. Los layouts incluyen la posición y configuración de todos los widgets.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
