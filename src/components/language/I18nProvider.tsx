'use client';

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from '@/lib/i18n/config';
import type { Locale } from '@/types/i18n';

interface LanguageContextValue {
  currentLanguage: Locale;
  renderKey: number;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>('es');
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    if (i18n.isInitialized) {
      setCurrentLanguage(i18n.language as Locale);
    }

    const handleLanguageChange = (lng: string) => {
      console.log('🔄 Forzando re-render completo de la aplicación');
      setCurrentLanguage(lng as Locale);
      setRenderKey(prev => prev + 1); // Incrementar para forzar re-render
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const value: LanguageContextValue = {
    currentLanguage,
    renderKey,
  };

  return (
    <LanguageContext.Provider value={value}>
      <div key={renderKey}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  const translation = useI18nTranslation();
  
  return {
    ...translation,
    currentLanguage: context?.currentLanguage || 'es',
    renderKey: context?.renderKey || 0,
  };
}

export default I18nProvider;
