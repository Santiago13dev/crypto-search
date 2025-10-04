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

// Verificar si estamos en el cliente
const isBrowser = typeof window !== 'undefined';

if (isBrowser && !i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'es',
      lng: 'es', // Idioma inicial
      defaultNS: 'translation',
      
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: 'crypto-search-language',
      },

      interpolation: {
        escapeValue: false,
      },

      react: {
        useSuspense: false,
        bindI18n: 'languageChanged',
        bindI18nStore: 'added',
      },

      debug: true, // Activar para ver qué pasa en consola
    })
    .then(() => {
      console.log('✅ i18next inicializado correctamente');
      console.log('📍 Idioma detectado:', i18n.language);
    })
    .catch((err) => {
      console.error('❌ Error inicializando i18next:', err);
    });
}

export default i18n;
