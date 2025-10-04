'use client';

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { I18nextProvider, useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import type { Locale } from '@/types/i18n';

interface LanguageContextValue {
  currentLanguage: Locale;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Locale | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLanguage = async () => {
      // Esperar a que i18next se inicialice completamente
      if (!i18n.isInitialized) {
        await new Promise((resolve) => {
          i18n.on('initialized', resolve);
        });
      }

      const lang = i18n.language as Locale;
      console.log('🌐 Idioma cargado:', lang);
      setCurrentLanguage(lang);
      setIsReady(true);
    };

    initLanguage();

    const handleLanguageChange = (lng: string) => {
      console.log('🔄 Idioma cambiado a:', lng);
      setCurrentLanguage(lng as Locale);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  // No renderizar nada hasta que el idioma esté listo
  if (!isReady || !currentLanguage) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Loading...</div>
      </div>
    );
  }

  const value: LanguageContextValue = {
    currentLanguage,
  };

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContext.Provider value={value}>
        {children}
      </LanguageContext.Provider>
    </I18nextProvider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  const translation = useI18nTranslation();
  
  return {
    ...translation,
    currentLanguage: context?.currentLanguage || 'es',
  };
}

export default I18nProvider;
