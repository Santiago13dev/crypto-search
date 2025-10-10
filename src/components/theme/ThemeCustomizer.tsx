'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaintBrushIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import type { ThemeColors, ThemeName } from '@/types/theme';
import { predefinedThemes } from '@/lib/themes/predefined';

interface ThemeCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, baseTheme: ThemeName, customizations: Partial<ThemeColors>) => void;
}

export default function ThemeCustomizer({ isOpen, onClose, onCreate }: ThemeCustomizerProps) {
  const [themeName, setThemeName] = useState('');
  const [baseTheme, setBaseTheme] = useState<ThemeName>('matrix');
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>({});
  const [showPreview, setShowPreview] = useState(false);

  const currentBaseTheme = predefinedThemes.find(t => t.name === baseTheme);
  const previewColors = { ...currentBaseTheme?.colors, ...customColors };

  const colorFields: { key: keyof ThemeColors; label: string; group: string }[] = [
    // Principales
    { key: 'primary', label: 'Color Principal', group: 'Principales' },
    { key: 'primaryDark', label: 'Principal Oscuro', group: 'Principales' },
    { key: 'primaryLight', label: 'Principal Claro', group: 'Principales' },
    
    // Fondos
    { key: 'background', label: 'Fondo Principal', group: 'Fondos' },
    { key: 'backgroundSecondary', label: 'Fondo Secundario', group: 'Fondos' },
    { key: 'backgroundTertiary', label: 'Fondo Terciario', group: 'Fondos' },
    
    // Texto
    { key: 'text', label: 'Texto Principal', group: 'Texto' },
    { key: 'textSecondary', label: 'Texto Secundario', group: 'Texto' },
    { key: 'textTertiary', label: 'Texto Terciario', group: 'Texto' },
    
    // Acentos
    { key: 'accent', label: 'Acento 1', group: 'Acentos' },
    { key: 'accentSecondary', label: 'Acento 2', group: 'Acentos' },
    
    // Estados
    { key: 'success', label: 'Éxito', group: 'Estados' },
    { key: 'error', label: 'Error', group: 'Estados' },
    { key: 'warning', label: 'Advertencia', group: 'Estados' },
    { key: 'info', label: 'Información', group: 'Estados' },
    
    // Bordes
    { key: 'border', label: 'Borde', group: 'Bordes' },
    { key: 'borderLight', label: 'Borde Claro', group: 'Bordes' },
    { key: 'borderDark', label: 'Borde Oscuro', group: 'Bordes' },
  ];

  const groupedFields = colorFields.reduce((acc, field) => {
    if (!acc[field.group]) acc[field.group] = [];
    acc[field.group].push(field);
    return acc;
  }, {} as Record<string, typeof colorFields>);

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setCustomColors(prev => ({ ...prev, [key]: value }));
  };

  const handleCreate = () => {
    if (!themeName.trim()) {
      alert('Por favor ingresa un nombre para el tema');
      return;
    }

    onCreate(themeName, baseTheme, customColors);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setThemeName('');
    setBaseTheme('matrix');
    setCustomColors({});
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
              className="w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl"
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
                    <PaintBrushIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                    <h2 
                      className="text-xl font-mono font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {`>`} Crear Tema Personalizado
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 px-3 py-1 rounded font-mono text-sm transition-colors"
                      style={{
                        backgroundColor: showPreview ? 'var(--color-primary)' : 'rgba(var(--color-primary), 0.1)',
                        color: showPreview ? 'var(--color-background)' : 'var(--color-primary)',
                        border: `1px solid var(--color-primary)`,
                      }}
                    >
                      <EyeIcon className="w-4 h-4" />
                      {showPreview ? 'Ocultar' : 'Preview'}
                    </button>
                    <button
                      onClick={onClose}
                      className="transition-colors font-mono text-2xl"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex">
                {/* Editor */}
                <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-180px)] scrollbar-terminal">
                  {/* Basic Info */}
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-mono" style={{ color: 'var(--color-primary)' }}>
                      Nombre del Tema
                    </label>
                    <input
                      type="text"
                      value={themeName}
                      onChange={(e) => setThemeName(e.target.value)}
                      placeholder="Mi Tema Personalizado"
                      className="w-full px-4 py-3 rounded font-mono focus:outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--color-background-secondary)',
                        border: `1px solid var(--color-border)`,
                        color: 'var(--color-primary)',
                      }}
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-mono" style={{ color: 'var(--color-primary)' }}>
                      Tema Base
                    </label>
                    <select
                      value={baseTheme}
                      onChange={(e) => setBaseTheme(e.target.value as ThemeName)}
                      className="w-full px-4 py-3 rounded font-mono focus:outline-none transition-colors"
                      style={{
                        backgroundColor: 'var(--color-background-secondary)',
                        border: `1px solid var(--color-border)`,
                        color: 'var(--color-primary)',
                      }}
                    >
                      {predefinedThemes.map(theme => (
                        <option key={theme.name} value={theme.name}>
                          {theme.displayName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Customization */}
                  <div className="space-y-6">
                    {Object.entries(groupedFields).map(([group, fields]) => (
                      <div key={group}>
                        <h3 
                          className="text-sm font-mono font-bold mb-3 pb-2"
                          style={{ 
                            color: 'var(--color-primary)',
                            borderBottom: `1px solid var(--color-border)`,
                          }}
                        >
                          {group}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {fields.map(field => {
                            const defaultValue = currentBaseTheme?.colors[field.key] || '#000000';
                            const currentValue = customColors[field.key] || defaultValue;
                            
                            return (
                              <div key={field.key} className="flex items-center gap-3">
                                <input
                                  type="color"
                                  value={currentValue}
                                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                                  className="w-12 h-12 rounded cursor-pointer"
                                  style={{ border: `2px solid var(--color-border)` }}
                                />
                                <div className="flex-1">
                                  <label className="block text-xs font-mono mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                                    {field.label}
                                  </label>
                                  <input
                                    type="text"
                                    value={currentValue}
                                    onChange={(e) => handleColorChange(field.key, e.target.value)}
                                    className="w-full px-2 py-1 text-xs rounded font-mono focus:outline-none"
                                    style={{
                                      backgroundColor: 'var(--color-background-secondary)',
                                      border: `1px solid var(--color-border)`,
                                      color: 'var(--color-primary)',
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                {showPreview && (
                  <div 
                    className="w-80 p-6 overflow-y-auto max-h-[calc(90vh-180px)]"
                    style={{
                      backgroundColor: previewColors.background,
                      borderLeft: `1px solid ${previewColors.border}`,
                    }}
                  >
                    <h3 className="text-sm font-mono font-bold mb-4" style={{ color: previewColors.primary }}>
                      Vista Previa
                    </h3>

                    {/* Preview card */}
                    <div 
                      className="p-4 rounded mb-4"
                      style={{
                        backgroundColor: previewColors.backgroundSecondary,
                        border: `1px solid ${previewColors.border}`,
                      }}
                    >
                      <h4 className="font-mono font-bold mb-2" style={{ color: previewColors.primary }}>
                        Título de Ejemplo
                      </h4>
                      <p className="text-sm font-mono mb-2" style={{ color: previewColors.textSecondary }}>
                        Texto secundario de ejemplo para ver cómo se ve el contenido.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <div 
                          className="px-3 py-1 rounded text-xs font-mono"
                          style={{
                            backgroundColor: previewColors.success,
                            color: previewColors.background,
                          }}
                        >
                          Success
                        </div>
                        <div 
                          className="px-3 py-1 rounded text-xs font-mono"
                          style={{
                            backgroundColor: previewColors.error,
                            color: previewColors.background,
                          }}
                        >
                          Error
                        </div>
                      </div>
                    </div>

                    {/* Color palette */}
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(previewColors).slice(0, 9).map(([key, color]) => (
                        <div key={key}>
                          <div
                            className="w-full h-12 rounded mb-1"
                            style={{ backgroundColor: color }}
                          />
                          <p className="text-xs font-mono truncate" style={{ color: previewColors.textTertiary }}>
                            {key}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div 
                className="px-6 py-4 flex justify-between items-center"
                style={{
                  borderTop: `1px solid var(--color-border)`,
                  backgroundColor: 'var(--color-background-secondary)',
                }}
              >
                <p className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  {Object.keys(customColors).length} color{Object.keys(customColors).length !== 1 ? 'es' : ''} personalizado{Object.keys(customColors).length !== 1 ? 's' : ''}
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded font-mono text-sm transition-colors"
                    style={{
                      backgroundColor: 'rgba(var(--color-primary), 0.1)',
                      border: `1px solid var(--color-border)`,
                      color: 'var(--color-primary)',
                    }}
                  >
                    <XMarkIcon className="w-4 h-4 inline mr-2" />
                    Resetear
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!themeName.trim()}
                    className="px-4 py-2 rounded font-mono text-sm font-bold transition-colors disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-background)',
                    }}
                  >
                    <CheckIcon className="w-4 h-4 inline mr-2" />
                    Crear Tema
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
