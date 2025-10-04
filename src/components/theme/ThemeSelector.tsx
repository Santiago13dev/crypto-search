'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  SwatchIcon, 
  CheckIcon,
  PlusIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ThemeConfig, ThemeName } from '@/types/theme';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  availableThemes: ThemeConfig[];
  onSelectTheme: (themeName: ThemeName) => void;
  onCreateCustom: () => void;
  onDeleteTheme: (themeId: string) => void;
  onExport: (themeId: string) => void;
  onImport: () => void;
}

export default function ThemeSelector({
  isOpen,
  onClose,
  currentTheme,
  availableThemes,
  onSelectTheme,
  onCreateCustom,
  onDeleteTheme,
  onExport,
  onImport,
}: ThemeSelectorProps) {
  
  const handleExport = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onExport(themeId);
  };

  const handleDelete = (e: React.MouseEvent, themeId: string) => {
    e.stopPropagation();
    onDeleteTheme(themeId);
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
            <div 
              className="w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-lg shadow-2xl"
              style={{
                backgroundColor: 'var(--color-background)',
                border: `2px solid var(--color-primary)`,
              }}
            >
              {/* Header */}
              <div 
                className="px-6 py-4"
                style={{
                  borderBottom: `1px solid var(--color-border)`,
                  backgroundColor: 'var(--color-background-secondary)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SwatchIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    <h2 
                      className="text-xl font-mono font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {`>`} Seleccionar Tema
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="transition-colors font-mono text-2xl"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)] scrollbar-terminal">
                {/* Actions */}
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={onCreateCustom}
                    className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-background)',
                    }}
                  >
                    <PlusIcon className="w-4 h-4" />
                    Crear Personalizado
                  </button>

                  <button
                    onClick={onImport}
                    className="flex items-center gap-2 px-4 py-2 rounded font-mono text-sm transition-all"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary), 0.1)',
                      border: `1px solid var(--color-border)`,
                      color: 'var(--color-primary)',
                    }}
                  >
                    <ArrowUpTrayIcon className="w-4 h-4" />
                    Importar
                  </button>
                </div>

                {/* Themes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableThemes.map((theme) => {
                    const isActive = currentTheme.id === theme.id;
                    
                    return (
                      <motion.button
                        key={theme.id}
                        onClick={() => onSelectTheme(theme.name as ThemeName)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative p-4 rounded-lg text-left transition-all"
                        style={{
                          backgroundColor: isActive 
                            ? 'rgba(var(--color-primary), 0.2)' 
                            : 'rgba(var(--color-primary), 0.05)',
                          border: isActive
                            ? `2px solid ${theme.colors.primary}`
                            : `1px solid var(--color-border)`,
                        }}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <div 
                            className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: theme.colors.primary }}
                          >
                            <CheckIcon className="w-4 h-4" style={{ color: theme.colors.background }} />
                          </div>
                        )}

                        {/* Theme preview */}
                        <div className="flex gap-2 mb-3">
                          {Object.entries(theme.colors).slice(0, 5).map(([key, color]) => (
                            <div
                              key={key}
                              className="w-8 h-8 rounded"
                              style={{ backgroundColor: color }}
                              title={key}
                            />
                          ))}
                        </div>

                        {/* Theme info */}
                        <h3 
                          className="font-mono font-bold mb-1"
                          style={{ color: theme.colors.primary }}
                        >
                          {theme.displayName}
                        </h3>
                        <p 
                          className="text-xs font-mono mb-3"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {theme.description}
                        </p>

                        {/* Actions for custom themes */}
                        {theme.isCustom && (
                          <div className="flex gap-2 pt-3" style={{ borderTop: `1px solid var(--color-border)` }}>
                            <button
                              onClick={(e) => handleExport(e, theme.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors"
                              style={{
                                backgroundColor: 'rgba(var(--color-primary), 0.1)',
                                color: 'var(--color-primary)',
                              }}
                            >
                              <ArrowDownTrayIcon className="w-3 h-3" />
                              Exportar
                            </button>
                            
                            <button
                              onClick={(e) => handleDelete(e, theme.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded text-xs font-mono transition-colors"
                              style={{
                                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                                color: '#ff0000',
                              }}
                            >
                              <TrashIcon className="w-3 h-3" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Info */}
                <div 
                  className="mt-6 p-4 rounded"
                  style={{
                    backgroundColor: 'rgba(var(--color-primary), 0.05)',
                    border: `1px solid var(--color-border)`,
                  }}
                >
                  <p className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                    💡 <span style={{ color: 'var(--color-primary)' }}>Tip:</span> Puedes crear temas personalizados 
                    basados en los predefinidos y exportarlos para compartir con otros usuarios.
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
