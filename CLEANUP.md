# Script de Limpieza - Archivos Eliminados

## Archivos duplicados que se eliminaron:

1. ❌ `src/app/components/CoinCard.tsx` (duplicado)
   - ✅ Reemplazado por: `src/components/features/CoinCard.tsx`

2. ❌ `src/app/components/SearchBar.tsx` (duplicado)
   - ✅ Reemplazado por: `src/components/features/SearchBar.tsx`

3. ❌ `src/components/CoinCard.tsx` (duplicado)
   - ✅ Reemplazado por: `src/components/features/CoinCard.tsx`

4. ❌ `src/components/SearchBar.tsx` (duplicado)
   - ✅ Reemplazado por: `src/components/features/SearchBar.tsx`

5. ❌ `src/app/lib/coingecko.ts` (antiguo)
   - ✅ Reemplazado por: `src/lib/services/coingecko.ts`

6. ❌ `src/app/types/coin.ts` (antiguo)
   - ✅ Reemplazado por: `src/types/coin.ts`

## Nueva estructura consolidada:

```
src/
├── components/
│   ├── features/      ← ÚNICA ubicación para componentes de features
│   └── ui/            ← ÚNICA ubicación para componentes UI
├── hooks/             ← NUEVA ubicación para custom hooks
├── lib/
│   ├── services/      ← ÚNICA ubicación para servicios
│   └── utils/         ← NUEVA ubicación para utilidades
└── types/             ← ÚNICA ubicación para tipos TypeScript
```

Fecha de limpieza: $(date)
