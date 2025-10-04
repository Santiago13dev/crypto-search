import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es';
import en from './locales/en';
import pt from './locales/pt';

const resources = {
  es,
  en,
  pt,
};

const isBrowser = typeof window !== 'undefined';

if (isBrowser && !i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'es',
      // NO establecer lng aquí - dejar que LanguageDetector lo maneje
      defaultNS: 'translation',
      
      detection: {
        order: ['localStorage', 'navigator'], // Primero localStorage
        caches: ['localStorage'],
        lookupLocalStorage: 'crypto-search-language',
      },

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
      },
    });
}

export default i18n;
