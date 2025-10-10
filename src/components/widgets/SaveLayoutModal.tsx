'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookmarkIcon } from '@heroicons/react/24/outline';

interface SaveLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export default function SaveLayoutModal({ isOpen, onClose, onSave }: SaveLayoutModalProps) {
  const [layoutName, setLayoutName] = useState('');

  const handleSave = () => {
    if (layoutName.trim()) {
      onSave(layoutName.trim());
      setLayoutName('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
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
            <div className="bg-background border-2 border-primary rounded-lg shadow-2xl max-w-md w-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-primary/30 bg-[#00ff00]/5">
                <div className="flex items-center gap-2">
                  <BookmarkIcon className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-mono font-bold text-primary">
                    {`>`} Guardar Layout
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <label className="block mb-2 text-sm font-mono text-primary">
                  Nombre del Layout
                </label>
                <input
                  type="text"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ej: Mi Dashboard Principal"
                  className="w-full px-4 py-3 bg-background border border-primary/30 rounded text-primary font-mono placeholder-[#00ff00]/30 focus:outline-none focus:border-primary transition-colors"
                  autoFocus
                />

                <p className="mt-3 text-xs text-primary/60 font-mono">
                  💡 El layout guardará la posición y configuración actual de todos los widgets
                </p>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-primary/30 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#00ff00]/5 border border-primary/30 rounded hover:bg-[#00ff00]/10 transition-colors font-mono text-primary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={!layoutName.trim()}
                  className="px-4 py-2 bg-[#00ff00]/20 border border-primary rounded hover:bg-[#00ff00]/30 transition-colors font-mono font-bold text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
