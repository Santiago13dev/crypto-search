'use client';

import { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n/config';

interface I18nProviderWrapperProps {
  children: ReactNode;
}

export default function I18nProviderWrapper({ children }: I18nProviderWrapperProps) {
  const [mounted, setMounted] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    setMounted(true);
    
    console.log('🌐 i18n inicializado:', i18n.isInitialized);
    console.log('🌐 Idioma actual:', i18n.language);
    console.log('🌐 Idiomas disponibles:', Object.keys(i18n.options.resources || {}));

    // Listener para forzar re-render cuando cambie el idioma
    const handleLanguageChange = (lng: string) => {
      console.log('🔄 I18nProvider detectó cambio de idioma:', lng);
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <I18nextProvider i18n={i18n} key={currentLanguage}>
      {children}
    </I18nextProvider>
  );
}
