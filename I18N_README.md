# 🌐 Sistema Multi-Idioma (i18n)

## 📋 Descripción

Sistema completo de internacionalización que soporta múltiples idiomas con cambio dinámico y persistencia de preferencias.

## ✨ Características

### Idiomas Soportados

1. **🇪🇸 Español** - Idioma por defecto
2. **🇺🇸 English** - Inglés
3. **🇧🇷 Português** - Portugués de Brasil

### Funcionalidades

- ✅ Cambio dinámico de idioma
- ✅ Detección automática del idioma del navegador
- ✅ Persistencia en localStorage
- ✅ Botón flotante con bandera del idioma actual
- ✅ Modal de selección visual de idiomas
- ✅ Hook `useTranslation` para usar en cualquier componente
- ✅ Interpolación de variables (plurales, números, etc.)

## 🚀 Uso

### En Componentes

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
    </div>
  );
}
```

### Con Variables

```tsx
// Singular/Plural automático
<p>{t('favorites.count', { count: 5 })}</p>
// Output: "5 favoritos"

<p>{t('favorites.count', { count: 1 })}</p>
// Output: "1 favorito"
```

### Cambiar Idioma Programáticamente

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { i18n } = useTranslation();
  
  const changeToEnglish = () => {
    i18n.changeLanguage('en');
  };
  
  return <button onClick={changeToEnglish}>Change to English</button>;
}
```

## 📁 Estructura de Archivos

```
src/
├── lib/
│   └── i18n/
│       ├── config.ts           # Configuración de i18next
│       └── locales/
│           ├── es.ts           # Traducciones en español
│           ├── en.ts           # Traducciones en inglés
│           └── pt.ts           # Traducciones en portugués
│
├── types/
│   └── i18n.ts                 # Tipos TypeScript
│
└── components/
    └── language/
        ├── LanguageSelector.tsx # Modal de selección
        ├── LanguageButton.tsx   # Botón flotante
        └── index.ts             # Exports
```

## 🔧 Configuración

### 1. Instalación de Dependencias

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Configuración en `config.ts`

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { es, en, pt },
    fallbackLng: 'es',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'crypto-search-language',
    },
  });
```

## 📝 Añadir Nuevas Traducciones

### 1. Agregar clave en `locales/es.ts`

```typescript
export default {
  translation: {
    mySection: {
      title: 'Mi Título',
      description: 'Mi descripción',
    },
  },
};
```

### 2. Añadir en todos los idiomas

Repite el paso anterior en `en.ts` y `pt.ts` con las traducciones correspondientes.

### 3. Usar en componente

```tsx
<h1>{t('mySection.title')}</h1>
<p>{t('mySection.description')}</p>
```

## 🎯 Ejemplo Completo

```tsx
'use client';

import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export default function WelcomeSection() {
  const { t, i18n } = useTranslation();
  
  const currentLanguage = i18n.language;
  const itemCount = 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      
      {/* Con interpolación */}
      <p>{t('home.results', { count: itemCount })}</p>
      
      {/* Idioma actual */}
      <span>Current: {currentLanguage}</span>
      
      {/* Cambiar idioma */}
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </motion.div>
  );
}
```

## 🔄 Flujo de Funcionamiento

1. **Inicio**: Se detecta el idioma del navegador o se carga desde localStorage
2. **Cambio**: Usuario hace clic en el botón de idioma
3. **Modal**: Se abre selector visual con banderas
4. **Selección**: Usuario elige nuevo idioma
5. **Actualización**: i18next cambia el idioma globalmente
6. **Persistencia**: Se guarda en localStorage
7. **Re-render**: Todos los componentes se actualizan automáticamente

## 🎨 Personalización

### Añadir Nuevo Idioma

1. Crear archivo `src/lib/i18n/locales/fr.ts`
2. Añadir traducciones
3. Importar en `config.ts`
4. Añadir a array de recursos
5. Actualizar `types/i18n.ts` con nuevo código

### Cambiar Idioma por Defecto

En `config.ts`:

```typescript
i18n.init({
  fallbackLng: 'en', // Cambiar de 'es' a 'en'
});
```

## 💾 Persistencia

- **Key**: `crypto-search-language`
- **Storage**: localStorage
- **Formato**: Código de idioma (`'es'`, `'en'`, `'pt'`)

## 🐛 Solución de Problemas

### Las traducciones no aparecen

1. Verifica que i18n está importado en `providers.tsx`
2. Asegúrate de usar `useTranslation()` en el componente
3. Revisa que la clave existe en todos los archivos de idiomas

### El idioma no persiste

1. Verifica que localStorage está habilitado
2. Revisa la configuración en `config.ts`
3. Limpia localStorage y recarga

### Interpolación no funciona

Asegúrate de pasar las variables correctamente:

```tsx
// ✅ Correcto
{t('key', { count: 5 })}

// ❌ Incorrecto
{t('key', 5)}
```

## 📚 Recursos

- [react-i18next Docs](https://react.i18next.com/)
- [i18next Docs](https://www.i18next.com/)

---

**Creado con 🌐 para una mejor experiencia global**
