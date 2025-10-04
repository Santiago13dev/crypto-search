'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LanguageIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { locales, type Locale } from '@/types/i18n';
import { toast } from 'react-hot-toast';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language as Locale;

  const handleChangeLanguage = async (locale: Locale) => {
    try {
      console.log('🔄 Cambiando idioma de', i18n.language, 'a', locale);
      
      await i18n.changeLanguage(locale);
      
      console.log('✅ Idioma cambiado a:', i18n.language);
      
      const localeName = locales.find(l => l.code === locale)?.name;
      toast.success(`Idioma cambiado a ${localeName}`, { icon: '🌐' });
      
      onClose();
      
    } catch (error) {
      console.error('❌ Error al cambiar idioma:', error);
      toast.error('Error al cambiar idioma');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div 
              className="border-2 p-6"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-primary)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <LanguageIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                  <h2 className="text-xl font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
                    {`>`} Seleccionar idioma
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-primary/10 transition-colors"
                  style={{ color: 'var(--color-primary)' }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Language Options */}
              <div className="space-y-3">
                {locales.map((locale) => {
                  const isActive = currentLanguage === locale.code;

                  return (
                    <motion.button
                      key={locale.code}
                      onClick={() => handleChangeLanguage(locale.code)}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full p-4 border flex items-center justify-between transition-colors"
                      style={{
                        borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? 'var(--color-background)' : 'var(--color-text)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{locale.flag}</span>
                        <span className="font-mono font-bold">{locale.name}</span>
                      </div>

                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                          <CheckIcon className="w-6 h-6" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Info */}
              <div 
                className="mt-4 p-3 border font-mono text-sm"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background-secondary)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                💡 Tu preferencia de idioma se guardará automáticamente
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
