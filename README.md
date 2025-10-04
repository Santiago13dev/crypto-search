# 🔍 Crypto Search Terminal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)

**Una plataforma completa de análisis y gestión de criptomonedas con diseño terminal retro**

[🚀 Demo en Vivo](#) • [📖 Documentación](#características) • [💻 Instalación](#instalación)

![Crypto Search Terminal](https://via.placeholder.com/800x400/0a0f1e/00ff00?text=Crypto+Search+Terminal)

</div>

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [Documentación](#-documentación)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## ✨ Características

### 🔍 Búsqueda y Exploración

- **Búsqueda en Tiempo Real**: Encuentra entre más de 10,000 criptomonedas instantáneamente
- **Detalles Completos**: Información detallada de cada moneda incluyendo:
  - Precio actual y histórico
  - Market cap y volumen
  - Cambios porcentuales (24h, 7d, 30d)
  - Supply circulante y total
  - Links oficiales y redes sociales
- **Sistema de Caché Inteligente**: Optimización de peticiones API para mejor rendimiento

### 📊 Dashboard Personalizable

- **Widgets Drag & Drop**: Reorganiza tu dashboard arrastrando y soltando
- **5 Tipos de Widgets**:
  - 💰 **Precios**: Monitoreo en tiempo real de tus favoritos
  - 📰 **Noticias**: Últimas noticias del mundo crypto
  - 🔔 **Alertas**: Gestión de alertas de precio
  - 📊 **Portafolio**: Resumen de tu inversión
  - 📈 **Gráficos**: Visualización de precios
- **Guardar Layouts**: Múltiples configuraciones guardadas
- **Modo Compacto/Expandido**: Ajusta el tamaño de cada widget

### 💼 Gestión de Portafolio

- **Agregar Holdings**: Registra tus inversiones fácilmente
- **Tracking en Tiempo Real**: Actualización automática de precios
- **Métricas de Rendimiento**:
  - Valor total del portafolio
  - Ganancia/Pérdida absoluta
  - Porcentaje de retorno
  - Distribución por moneda
- **Gráficos Visuales**: Representación gráfica de tu portafolio
- **Calculadoras Integradas**:
  - DCA (Dollar Cost Averaging)
  - Calculadora de comisiones

### 🔔 Sistema de Alertas

- **Alertas de Precio**: Notificaciones cuando se alcancen objetivos
- **Tipos de Condiciones**:
  - Precio mayor que X
  - Precio menor que X
  - Cambio porcentual ascendente
  - Cambio porcentual descendente
- **Gestión Completa**: Crear, editar y eliminar alertas
- **Notificaciones del Navegador**: Avisos visuales cuando se activan

### ⭐ Sistema de Favoritos

- **Guardar Favoritos**: Marca tus criptomonedas preferidas
- **Panel Lateral**: Acceso rápido a favoritos
- **Sincronización**: Persistencia en localStorage
- **Botón Flotante**: Contador visual de favoritos

### 📈 Herramientas de Análisis

- **Comparador de Criptomonedas**: Compara hasta 4 monedas lado a lado
- **Gráficos Interactivos**: Visualización de datos históricos
- **Conversor de Monedas**: Calcula equivalencias instantáneamente
- **Filtros Avanzados**: Ordena y filtra por diferentes criterios

### 🎨 Diseño y UX

- **Tema Terminal Retro**: Diseño tipo Matrix con efectos cyberpunk
- **Animaciones Fluidas**: Transiciones suaves con Framer Motion
- **Totalmente Responsive**: Optimizado para móvil, tablet y desktop
- **Dark Mode Nativo**: Diseño oscuro que no cansa la vista
- **Efectos Visuales**:
  - Grid animado de fondo
  - Indicadores de cursor parpadeantes
  - Transiciones de página suaves
  - Loading states elegantes

### ⚡ Rendimiento

- **Next.js 15 App Router**: Arquitectura moderna y optimizada
- **Caché Inteligente**: Reducción de llamadas API innecesarias
- **Lazy Loading**: Carga diferida de componentes
- **Optimización de Imágenes**: Next.js Image Optimization
- **Type Safety**: TypeScript en todo el proyecto

### 🔒 Características de Seguridad

- **No Auth Required**: Sin necesidad de registro para funcionalidades básicas
- **Datos Locales**: Tu información se guarda en tu navegador
- **Sin Tracking**: Respeto total a la privacidad
- **API Segura**: Comunicación segura con CoinGecko

---

## 📸 Capturas de Pantalla

<div align="center">

### 🏠 Página Principal
![Búsqueda](https://via.placeholder.com/800x450/0a0f1e/00ff00?text=Busqueda+de+Criptomonedas)

### 📊 Dashboard Personalizable
![Dashboard](https://via.placeholder.com/800x450/0a0f1e/00ff00?text=Dashboard+con+Widgets)

### 💼 Gestión de Portafolio
![Portafolio](https://via.placeholder.com/800x450/0a0f1e/00ff00?text=Gestion+de+Portafolio)

### 🔔 Sistema de Alertas
![Alertas](https://via.placeholder.com/800x450/0a0f1e/00ff00?text=Alertas+de+Precio)

</div>

---

## 🛠️ Tecnologías

### Frontend Framework
- **[Next.js 15.4](https://nextjs.org/)** - React Framework con App Router
- **[React 19](https://react.dev/)** - Biblioteca de UI
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type Safety

### Estilos y Animaciones
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Utility-first CSS
- **[Framer Motion 12](https://www.framer.com/motion/)** - Animaciones fluidas
- **[Fira Code](https://github.com/tonsky/FiraCode)** - Fuente monospace

### UI y Componentes
- **[Heroicons 2](https://heroicons.com/)** - Iconos SVG
- **[React Hot Toast 2](https://react-hot-toast.com/)** - Notificaciones
- **[React Grid Layout](https://github.com/react-grid-layout/react-grid-layout)** - Drag & Drop

### Gestión de Estado
- **React Hooks** - useState, useEffect, useCallback, useMemo
- **Custom Hooks** - usePortfolio, useAlerts, useFavorites, useWidgets
- **LocalStorage** - Persistencia de datos

### API y Datos
- **[CoinGecko API](https://www.coingecko.com/api/documentation)** - Datos de criptomonedas
- **Fetch API** - Peticiones HTTP
- **Sistema de Caché** - Optimización de requests

### Tooling
- **[ESLint](https://eslint.org/)** - Linting
- **[PostCSS](https://postcss.org/)** - Procesamiento CSS
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Prefijos CSS

---

## 📦 Instalación

### Prerequisitos

- **Node.js** 18.0 o superior
- **npm**, **yarn**, **pnpm** o **bun**
- **Git** (opcional)

### Clonar el Repositorio

```bash
# HTTPS
git clone https://github.com/tu-usuario/crypto-search.git

# SSH
git clone git@github.com:tu-usuario/crypto-search.git

# GitHub CLI
gh repo clone tu-usuario/crypto-search

cd crypto-search
```

### Instalar Dependencias

```bash
# npm
npm install

# yarn
yarn install

# pnpm
pnpm install

# bun
bun install
```

### Configurar Variables de Entorno (Opcional)

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API de CoinGecko (Opcional - la pública funciona sin key)
NEXT_PUBLIC_COINGECKO_API_KEY=tu_api_key_aqui

# Nombre de la aplicación
NEXT_PUBLIC_APP_NAME=Crypto Search Terminal

# URL base (para producción)
NEXT_PUBLIC_BASE_URL=https://tu-dominio.com
```

### Ejecutar en Desarrollo

```bash
# npm
npm run dev

# yarn
yarn dev

# pnpm
pnpm dev

# bun
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para Producción

```bash
# Compilar
npm run build

# Ejecutar producción
npm run start
```

---

## 🎯 Uso

### 🔍 Búsqueda de Criptomonedas

1. En la página principal, escribe el nombre o símbolo de una criptomoneda
2. Presiona Enter o haz clic en "BUSCAR"
3. Los resultados aparecerán en tarjetas animadas
4. Haz clic en una tarjeta para ver detalles completos

### 📊 Dashboard de Widgets

1. Navega a `/dashboard` desde el menú
2. **Agregar Widgets**:
   - Click en "Agregar Widget"
   - Selecciona el tipo de widget que deseas
3. **Reorganizar**:
   - Arrastra los widgets desde su header
   - Suéltalos donde quieras
4. **Redimensionar**:
   - Hover sobre la esquina inferior derecha
   - Arrastra para cambiar tamaño
5. **Guardar Layout**:
   - Click en "Guardar"
   - Dale un nombre a tu configuración
6. **Cargar Layout**:
   - Click en "Cargar"
   - Selecciona el layout guardado

### 💼 Gestión de Portafolio

1. Navega a `/portfolio`
2. **Agregar Monedas**:
   - Click en "Agregar al Portafolio"
   - Selecciona la moneda
   - Ingresa cantidad y precio de compra
3. **Ver Estadísticas**:
   - Valor total actualizado
   - Ganancias/Pérdidas
   - Distribución por moneda
4. **Calculadoras**:
   - DCA para calcular promedios
   - Calculadora de fees

### 🔔 Alertas de Precio

1. Navega a `/alerts`
2. **Crear Alerta**:
   - Click en "Nueva Alerta"
   - Selecciona la moneda
   - Define la condición (mayor/menor/cambio %)
   - Establece el valor objetivo
3. **Gestionar**:
   - Ver alertas activas
   - Eliminar alertas
   - Ver alertas activadas

### ⭐ Favoritos

1. En cualquier tarjeta de moneda, click en el ícono de estrella
2. Accede a favoritos desde:
   - Botón flotante (contador)
   - Panel lateral deslizable
3. Gestiona tus favoritos:
   - Eliminar individualmente
   - Limpiar todos

### 📈 Herramientas

- **Conversor** (`/converter`): Convierte entre criptomonedas y fiat
- **Comparador** (`/compare`): Compara hasta 4 monedas
- **Gráficos** (`/charts`): Visualiza datos históricos
- **Noticias** (`/news`): Últimas noticias crypto

---

## 📁 Estructura del Proyecto

```
crypto-search/
├── public/                     # Archivos estáticos
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── alerts/            # Página de alertas
│   │   ├── charts/            # Página de gráficos
│   │   ├── coin/[id]/         # Detalles de moneda (dinámico)
│   │   ├── compare/           # Comparador de monedas
│   │   ├── converter/         # Conversor de monedas
│   │   ├── dashboard/         # Dashboard con widgets
│   │   ├── news/              # Noticias crypto
│   │   ├── portfolio/         # Gestión de portafolio
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicio (búsqueda)
│   │   └── providers.tsx      # Providers (Toast, etc)
│   │
│   ├── components/            # Componentes reutilizables
│   │   ├── features/         # Componentes de funcionalidades
│   │   │   ├── AddToPortfolioModal.tsx
│   │   │   ├── CoinCard.tsx
│   │   │   ├── ConverterForm.tsx
│   │   │   ├── CreateAlertModal.tsx
│   │   │   ├── DCACalculator.tsx
│   │   │   ├── FavoritesPanel.tsx
│   │   │   ├── FeeCalculator.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PortfolioChart.tsx
│   │   │   ├── PortfolioStats.tsx
│   │   │   ├── QuickAddPortfolioModal.tsx
│   │   │   └── SearchBar.tsx
│   │   │
│   │   ├── ui/               # Componentes UI básicos
│   │   │   ├── button.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FavoriteButton.tsx
│   │   │   ├── FavoritesFloatingButton.tsx
│   │   │   ├── input.tsx
│   │   │   └── Loading.tsx
│   │   │
│   │   └── widgets/          # Componentes de widgets
│   │       ├── AddWidgetModal.tsx
│   │       ├── AlertsWidget.tsx
│   │       ├── BaseWidget.tsx
│   │       ├── ChartWidget.tsx
│   │       ├── LoadLayoutModal.tsx
│   │       ├── NewsWidget.tsx
│   │       ├── PortfolioWidget.tsx
│   │       ├── PriceWidget.tsx
│   │       ├── SaveLayoutModal.tsx
│   │       ├── WidgetContainer.tsx
│   │       └── WidgetToolbar.tsx
│   │
│   ├── hooks/                # Custom Hooks
│   │   ├── useAlerts.ts      # Gestión de alertas
│   │   ├── useCoinsSearch.ts # Búsqueda de monedas
│   │   ├── useCurrentPrices.ts # Precios en tiempo real
│   │   ├── useFavorites.ts   # Sistema de favoritos
│   │   ├── usePortfolio.ts   # Gestión de portafolio
│   │   └── useWidgets.ts     # Sistema de widgets
│   │
│   ├── lib/                  # Lógica de negocio
│   │   ├── services/        # Servicios externos
│   │   │   └── coingecko.ts # API de CoinGecko
│   │   └── utils/           # Utilidades
│   │       ├── helpers.ts   # Funciones auxiliares
│   │       └── index.ts     # Exports
│   │
│   └── types/               # Tipos TypeScript
│       ├── coin.ts          # Tipos de monedas
│       └── widget.ts        # Tipos de widgets
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── INSTALL_WIDGETS.md        # Guía de instalación widgets
├── WIDGETS_README.md         # Documentación widgets
├── WIDGETS_SUMMARY.md        # Resumen widgets
└── README.md                 # Este archivo
```

Ver [STRUCTURE.md](./STRUCTURE.md) para más detalles sobre la arquitectura.

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Compilar para producción
npm run start        # Ejecutar build de producción

# Calidad de código
npm run lint         # Ejecutar ESLint

# Instalación de widgets
./install-widgets.sh # Linux/Mac
install-widgets.bat  # Windows
```

---

## 📚 Documentación

### Documentación General
- **[README.md](./README.md)** - Este archivo
- **[STRUCTURE.md](./STRUCTURE.md)** - Arquitectura del proyecto
- **[MIGRATION.md](./MIGRATION.md)** - Guía de migración
- **[CLEANUP.md](./CLEANUP.md)** - Notas de limpieza

### Documentación de Widgets
- **[INSTALL_WIDGETS.md](./INSTALL_WIDGETS.md)** - Instalación del sistema de widgets
- **[WIDGETS_README.md](./WIDGETS_README.md)** - Documentación completa de widgets
- **[WIDGETS_SUMMARY.md](./WIDGETS_SUMMARY.md)** - Resumen y estado del proyecto

### Ejemplos
- **[widget-config-example.js](./widget-config-example.js)** - Configuraciones de ejemplo para widgets

---

## 🗺️ Roadmap

### ✅ Completado

- [x] Búsqueda de criptomonedas en tiempo real
- [x] Detalles completos de cada moneda
- [x] Sistema de favoritos con persistencia
- [x] Gestión completa de portafolio
- [x] Sistema de alertas de precio
- [x] Dashboard personalizable con widgets
- [x] Drag & Drop para widgets
- [x] Conversor de monedas
- [x] Comparador de criptomonedas
- [x] Calculadoras (DCA, Fees)
- [x] Diseño terminal retro completo
- [x] Responsive design completo

### 🚧 En Progreso

- [ ] **Sistema de temas personalizables**
  - [ ] Tema Cyberpunk
  - [ ] Tema Minimal
  - [ ] Tema High Contrast
  - [ ] Editor de temas personalizado

### 📅 Futuro

#### V2.0
- [ ] Gráficos de precios históricos avanzados
- [ ] Integración con múltiples exchanges
- [ ] Modo claro (Light mode)
- [ ] Búsqueda con autocompletado
- [ ] Filtros avanzados mejorados

#### V2.1
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Exportar/Importar datos

#### V3.0
- [ ] Sistema de autenticación (opcional)
- [ ] Sincronización en la nube
- [ ] API propia para datos
- [ ] Modo multi-usuario
- [ ] Compartir portafolios públicamente

#### Mejoras Continuas
- [ ] Tests unitarios y de integración
- [ ] Documentación interactiva
- [ ] Blog/Noticias integrado
- [ ] Soporte multi-idioma
- [ ] Accesibilidad mejorada (WCAG)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este proyecto sigue las mejores prácticas de código abierto.

### Cómo Contribuir

1. **Fork el proyecto**
2. **Crea tu rama de feature**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit tus cambios**
   ```bash
   git commit -m 'feat: add some amazing feature'
   ```
4. **Push a la rama**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Abre un Pull Request**

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formateo, sin cambios de código
refactor: refactorización de código
perf: mejoras de rendimiento
test: agregar tests
chore: cambios en build, configs, etc
```

### Guías de Estilo

- **TypeScript**: Usa tipos estrictos
- **React**: Componentes funcionales con hooks
- **CSS**: Tailwind utility-first
- **Nombres**: camelCase para variables, PascalCase para componentes

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para más detalles.

```
MIT License

Copyright (c) 2025 Tu Nombre

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 Contacto

**Kevin Santiago**

- 🐙 GitHub: [@tu-usuario](https://github.com/tu-usuario)
- 💼 LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)
- 📧 Email: tu-email@ejemplo.com
- 🌐 Portfolio: [tu-sitio.com](https://tu-sitio.com)

---

## 🙏 Agradecimientos

- **[CoinGecko](https://www.coingecko.com/)** - Por su excelente API gratuita de criptomonedas
- **[Vercel](https://vercel.com/)** - Por el hosting y deployment
- **[Next.js Team](https://nextjs.org/)** - Por el increíble framework
- **[Tailwind CSS](https://tailwindcss.com/)** - Por el sistema de diseño
- **[Framer Motion](https://www.framer.com/motion/)** - Por las animaciones
- **Comunidad Open Source** - Por todas las herramientas y librerías

---

## ⭐ Muestra tu Apoyo

Si este proyecto te fue útil, ¡dale una ⭐️!

---

<div align="center">

**[⬆️ Volver arriba](#-crypto-search-terminal)**

Hecho con 💚 y mucho ☕ por [Kevin Santiago](#-contacto)

[![GitHub followers](https://img.shields.io/github/followers/tu-usuario?style=social)](https://github.com/tu-usuario)
[![Twitter Follow](https://img.shields.io/twitter/follow/tu-usuario?style=social)](https://twitter.com/tu-usuario)

</div>
