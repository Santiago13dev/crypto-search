# Instalación del Sistema de Widgets

## 📦 Dependencias Necesarias

Ejecuta este comando para instalar las dependencias:

```bash
npm install react-grid-layout @types/react-grid-layout
```

## 📁 Archivos Creados

### Tipos
- `src/types/widget.ts` - Definiciones de tipos para widgets

### Hooks
- `src/hooks/useWidgets.ts` - Lógica principal de widgets
- `src/hooks/useWidgetLayouts.ts` - Gestión de layouts

### Componentes Base
- `src/components/widgets/BaseWidget.tsx` - Componente base para widgets
- `src/components/widgets/WidgetContainer.tsx` - Contenedor drag & drop

### Widgets Específicos
- `src/components/widgets/PriceWidget.tsx` - Widget de precios
- `src/components/widgets/NewsWidget.tsx` - Widget de noticias
- `src/components/widgets/AlertsWidget.tsx` - Widget de alertas
- `src/components/widgets/PortfolioWidget.tsx` - Widget de portafolio
- `src/components/widgets/ChartWidget.tsx` - Widget de gráficos

### UI
- `src/components/widgets/WidgetToolbar.tsx` - Barra de herramientas
- `src/components/widgets/AddWidgetModal.tsx` - Modal para agregar widgets

### Página
- `src/app/dashboard/page.tsx` - Página del dashboard con widgets

## 🚀 Uso

1. Navega a `/dashboard` para ver el sistema de widgets
2. Click en "Agregar Widget" para añadir nuevos widgets
3. Arrastra y suelta para reorganizar
4. Cambiar entre layouts guardados
5. Alternar entre modo compacto y expandido

## ✨ Características

- ✅ Drag & Drop con react-grid-layout
- ✅ Widgets personalizables
- ✅ Guardar múltiples layouts
- ✅ Modo compacto/expandido
- ✅ Persistencia en localStorage
- ✅ Diseño responsive
- ✅ Tema terminal retro
