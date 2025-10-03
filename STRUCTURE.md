# Estructura del Proyecto

## 📁 Organización de Carpetas

```
src/
├── app/                          # App Router de Next.js
│   ├── coin/                     # Ruta dinámica para detalles de monedas
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   └── providers.tsx            # Providers globales (Toast, etc)
│
├── components/                   # Componentes reutilizables
│   ├── features/                # Componentes de funcionalidades
│   │   ├── CoinCard.tsx        # Tarjeta de criptomoneda
│   │   ├── SearchBar.tsx       # Barra de búsqueda
│   │   └── index.ts            # Barrel export
│   │
│   └── ui/                      # Componentes de UI básicos
│       ├── Loading.tsx         # Indicador de carga
│       ├── EmptyState.tsx      # Estado vacío
│       └── index.ts            # Barrel export
│
├── hooks/                        # Custom Hooks
│   ├── useCoinsSearch.ts       # Hook para búsqueda de criptos
│   └── index.ts                # Barrel export
│
├── lib/                          # Lógica de negocio y utilidades
│   ├── services/                # Servicios externos
│   │   └── coingecko.ts        # Servicio API CoinGecko
│   │
│   └── utils/                   # Funciones utilitarias
│       ├── helpers.ts          # Helpers generales
│       └── index.ts            # Barrel export
│
└── types/                        # Definiciones de TypeScript
    └── coin.ts                  # Tipos de criptomonedas
```

## 🔑 Archivos Clave

### Servicios
- **`lib/services/coingecko.ts`**: Maneja todas las peticiones a la API de CoinGecko con sistema de cache.

### Hooks
- **`hooks/useCoinsSearch.ts`**: Lógica de búsqueda encapsulada y reutilizable.

### Componentes
- **`components/features/CoinCard.tsx`**: Card optimizada con animaciones.
- **`components/features/SearchBar.tsx`**: Barra de búsqueda con validaciones.
- **`components/ui/Loading.tsx`**: Componente de carga con animaciones.
- **`components/ui/EmptyState.tsx`**: Estado vacío elegante.

### Utilidades
- **`lib/utils/helpers.ts`**: Funciones helper para formateo, debounce, etc.

## 🎯 Principios de Organización

1. **Separación de responsabilidades**: Cada carpeta tiene un propósito específico.
2. **Barrel exports**: Uso de archivos `index.ts` para simplificar imports.
3. **Colocación cercana**: Los archivos relacionados están juntos.
4. **Escalabilidad**: Fácil agregar nuevas features sin romper la estructura.

## 📝 Nomenclatura

- **PascalCase**: Componentes React (`CoinCard.tsx`)
- **camelCase**: Funciones y hooks (`useCoinsSearch.ts`)
- **kebab-case**: Carpetas y archivos de config (`next.config.ts`)

## 🚀 Imports Recomendados

```typescript
// ✅ Bueno - Usando alias y barrel exports
import { CoinCard, SearchBar } from '@/components/features';
import { useCoinsSearch } from '@/hooks';
import { formatNumber } from '@/lib/utils';

// ❌ Evitar - Imports largos
import CoinCard from '../../../components/features/CoinCard';
```
