# 🎨 Sistema de Temas Personalizables

## 📋 Descripción

Sistema completo de temas personalizables que permite a los usuarios cambiar la apariencia de la aplicación con temas predefinidos o crear sus propios temas personalizados.

## ✨ Características

### Temas Predefinidos

1. **Matrix Terminal** (Por defecto)
   - Verde neón clásico
   - Estilo terminal retro
   - Alta legibilidad

2. **Cyberpunk 2077**
   - Rosa y cyan vibrantes
   - Estética futurista
   - Inspirado en el videojuego

3. **Minimal Clean**
   - Blanco y grises suaves
   - Diseño minimalista
   - Elegante y moderno

4. **High Contrast**
   - Amarillo brillante sobre negro
   - Máximo contraste
   - Accesibilidad mejorada

### Funcionalidades

- ✅ Cambio de tema en tiempo real
- ✅ Persistencia en localStorage
- ✅ Crear temas personalizados
- ✅ Editor visual de colores
- ✅ Vista previa en vivo
- ✅ Exportar temas como JSON
- ✅ Importar temas compartidos
- ✅ Eliminar temas personalizados
- ✅ Botón flotante con animación

## 🚀 Uso

### Cambiar Tema

1. Click en el botón flotante de paleta (esquina inferior derecha)
2. Selecciona un tema de la lista
3. El tema se aplicará instantáneamente

### Crear Tema Personalizado

1. Click en el botón flotante de paleta
2. Click en "Crear Personalizado"
3. Ingresa un nombre para tu tema
4. Selecciona un tema base
5. Personaliza los colores que desees
6. Activa "Preview" para ver en tiempo real
7. Click en "Crear Tema"

### Exportar Tema

1. Abre el selector de temas
2. En el tema que deseas exportar, click en "Exportar"
3. Se descargará un archivo JSON con la configuración

### Importar Tema

1. Abre el selector de temas
2. Click en "Importar"
3. Selecciona el archivo JSON del tema
4. El tema se agregará a tu lista

## 🎯 Estructura de Archivos

```
src/
├── types/
│   └── theme.ts                    # Tipos TypeScript
│
├── lib/
│   └── themes/
│       └── predefined.ts           # Temas predefinidos
│
├── hooks/
│   └── useTheme.ts                 # Hook principal
│
└── components/
    └── theme/
        ├── ThemeSelector.tsx       # Selector de temas
        ├── ThemeCustomizer.tsx     # Editor de temas
        ├── ThemeButton.tsx         # Botón flotante
        └── index.ts                # Exports
```

## 💾 Persistencia

Los datos se guardan en `localStorage`:

- **Tema actual**: `crypto-search-theme`
- **Temas personalizados**: `crypto-search-custom-themes`

## 🎨 Variables CSS

El sistema usa variables CSS que se aplican dinámicamente:

```css
:root {
  /* Principales */
  --color-primary: #00ff00;
  --color-primary-dark: #00cc00;
  --color-primary-light: #33ff33;
  
  /* Fondos */
  --color-background: #0a0f1e;
  --color-background-secondary: #0d1420;
  --color-background-tertiary: #111827;
  
  /* Texto */
  --color-text: #00ff00;
  --color-text-secondary: rgba(0, 255, 0, 0.8);
  --color-text-tertiary: rgba(0, 255, 0, 0.6);
  
  /* Y más... */
}
```

## 🔧 API del Hook useTheme

```typescript
const {
  currentTheme,          // Tema actual
  themeName,             // Nombre del tema actual
  availableThemes,       // Todos los temas disponibles
  customThemes,          // Solo temas personalizados
  setTheme,              // Cambiar tema
  createCustomTheme,     // Crear tema personalizado
  updateCustomTheme,     // Actualizar tema personalizado
  deleteCustomTheme,     // Eliminar tema personalizado
  exportTheme,           // Exportar como JSON
  importTheme,           // Importar desde JSON
} = useTheme();
```

## 📝 Ejemplo de Uso en Componentes

### Usar colores del tema

```tsx
// Inline styles
<div style={{ color: 'var(--color-primary)' }}>
  Texto con color principal del tema
</div>

// Tailwind con variables
<div className="bg-[var(--color-background)]">
  Fondo usando variable
</div>
```

### Acceder al tema actual

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { currentTheme } = useTheme();
  
  return (
    <div style={{ backgroundColor: currentTheme.colors.background }}>
      <h1 style={{ color: currentTheme.colors.primary }}>
        {currentTheme.displayName}
      </h1>
    </div>
  );
}
```

## 🎨 Crear Tema Programáticamente

```typescript
import { useTheme } from '@/hooks/useTheme';

const { createCustomTheme } = useTheme();

createCustomTheme(
  'Mi Tema Oscuro',
  'matrix',
  {
    primary: '#00ffcc',
    background: '#000000',
    text: '#ffffff',
  }
);
```

## 📤 Formato de Exportación

Los temas se exportan en este formato JSON:

```json
{
  "version": "1.0",
  "theme": {
    "displayName": "Mi Tema",
    "description": "Descripción del tema",
    "baseTheme": "matrix",
    "colors": {
      "primary": "#00ff00",
      "background": "#0a0f1e",
      ...
    },
    "customizations": {
      "primary": "#custom-color"
    }
  },
  "exportedAt": 1234567890
}
```

## 🎯 Mejoras Futuras

- [ ] Temas con gradientes
- [ ] Temas animados
- [ ] Galería de temas comunitarios
- [ ] Sincronización en la nube
- [ ] Temas programados (día/noche)
- [ ] Generador de temas con IA
- [ ] Accesibilidad automática

## 🐛 Solución de Problemas

### Los colores no cambian

- Asegúrate de usar `var(--color-*)` en los estilos
- Verifica que el hook `useTheme` esté importado
- Revisa la consola por errores

### El tema no persiste

- Verifica que localStorage esté habilitado
- Limpia el cache del navegador
- Revisa las DevTools → Application → Local Storage

### Error al importar tema

- Verifica que el archivo JSON tenga el formato correcto
- Asegúrate de que todos los colores estén en formato hexadecimal o rgba

## 📄 Licencia

Este sistema de temas es parte del proyecto Crypto Search Terminal.

---

**Creado con 🎨 para una mejor experiencia de usuario**
