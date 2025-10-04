# 🎨 Guía Rápida para Aplicar Temas

## ⚡ SOLUCIÓN RÁPIDA

El problema es que los componentes tienen colores hardcodeados. La solución es usar las clases de Tailwind que ahora apuntan a variables CSS.

### Reemplazos Globales Necesarios:

Busca y reemplaza en TODOS los archivos `.tsx`:

```
bg-background     →    bg-background
bg-background-secondary     →    bg-background-secondary
bg-[#111827]     →    bg-background-tertiary

text-primary   →    text-primary
#00ff00          →    var(--color-primary)

border-primary →    border-primary
```

### Archivos Críticos a Actualizar:

1. `src/app/page.tsx` ✅ (Ya actualizado)
2. `src/components/features/Navbar.tsx`
3. `src/components/features/SearchBar.tsx`
4. `src/components/features/CoinCard.tsx`
5. `src/components/ui/Loading.tsx`
6. `src/components/ui/EmptyState.tsx`
7. Todos los componentes de widgets
8. Todas las páginas en `src/app/*/page.tsx`

### Comando para Reiniciar con Temas Funcionando:

```bash
# 1. Hacer commit de los cambios actuales
git add .
git commit -m "fix(theme): update tailwind config and home page to use theme variables"

# 2. Reiniciar servidor
npm run dev

# 3. Probar los temas - DEBERÍAN FUNCIONAR EN LA HOME
```

## 🔧 Cómo Verificar que Funciona:

1. Abre la consola del navegador (F12)
2. Cambia de tema
3. Deberías ver: "✅ Tema aplicado: [nombre del tema]"
4. El fondo y textos deberían cambiar

## 📝 Patrón de Actualización:

### Antes:
```tsx
<div className="bg-background text-primary border-primary/30">
```

### Después:
```tsx
<div className="bg-background text-primary border-primary/30">
```

### Para estilos inline:
```tsx
// Antes
<div style={{ backgroundColor: '#00ff00' }}>

// Después
<div style={{ backgroundColor: 'var(--color-primary)' }}>
```

## 🎯 Estado Actual:

- ✅ ThemeContext creado
- ✅ Variables CSS configuradas  
- ✅ Tailwind config actualizado
- ✅ Página principal actualizada
- ⏳ Otros componentes pendientes

**El sistema de temas FUNCIONA, solo necesita que actualices los componentes!**
