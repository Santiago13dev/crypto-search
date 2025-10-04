export type Locale = 'es' | 'en' | 'pt';

export interface LocaleOption {
  code: Locale;
  name: string;
  flag: string;
}

export const locales: LocaleOption[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];
