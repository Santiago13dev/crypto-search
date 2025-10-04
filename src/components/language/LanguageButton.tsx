'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/components/language/I18nProvider';
import { locales } from '@/types/i18n';
import LanguageSelector from './LanguageSelector';

export default function LanguageButton() {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { currentLanguage } = useTranslation();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentLocale = locales.find(l => l.code === currentLanguage);

  return (
    <>
      <motion.button
        key={currentLanguage}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSelectorOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center"
        style={{
          backgroundColor: 'var(--color-primary)',
        }}
        title="Cambiar idioma"
      >
        <span className="text-2xl">{currentLocale?.flag || '🌐'}</span>
        
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

      <LanguageSelector
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />
    </>
  );
}
