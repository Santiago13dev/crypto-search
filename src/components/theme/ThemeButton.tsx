'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from './ThemeSelector';
import ThemeCustomizer from './ThemeCustomizer';

export default function ThemeButton() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const {
    currentTheme,
    availableThemes,
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
  } = useTheme();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          importTheme(content);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = (themeId: string) => {
    const json = exportTheme(themeId);
    if (json) {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `theme-${themeId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSelectorOpen(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-primary)',
        }}
        title="Cambiar tema"
      >
        <SwatchIcon className="w-6 h-6" style={{ color: 'var(--color-background)' }} />
        
        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: 'var(--color-primary)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.7, 0, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.button>

      {/* Theme Selector Modal */}
      <ThemeSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        currentTheme={currentTheme}
        availableThemes={availableThemes}
        onSelectTheme={(themeName) => {
          setTheme(themeName);
          setIsSelectorOpen(false);
        }}
        onCreateCustom={() => {
          setIsSelectorOpen(false);
          setIsCustomizerOpen(true);
        }}
        onDeleteTheme={deleteCustomTheme}
        onExport={handleExport}
        onImport={handleImport}
      />

      {/* Theme Customizer Modal */}
      <ThemeCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onCreate={(name, baseTheme, customizations) => {
          createCustomTheme(name, baseTheme, customizations);
          setIsCustomizerOpen(false);
        }}
      />
    </>
  );
}
