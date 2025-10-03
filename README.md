# 🔍 Crypto Search Terminal

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

Un buscador de criptomonedas moderno con diseño tipo terminal retro.

[Demo](#) • [Características](#características) • [Instalación](#instalación) • [Uso](#uso)

</div>

---

## ✨ Características

- 🔍 **Búsqueda en tiempo real** de más de 10,000 criptomonedas
- 💾 **Sistema de caché** para optimizar peticiones API
- 🎨 **Diseño terminal retro** con efectos cyberpunk
- ⚡ **Animaciones fluidas** con Framer Motion
- 📱 **Totalmente responsive** para todos los dispositivos
- 🌙 **Modo oscuro nativo** con tema matrix
- 🚀 **Optimizado con Next.js 15** y App Router
- 💪 **TypeScript** para type-safety completo

## 🚀 Tecnologías

- **Framework**: [Next.js 15.4](https://nextjs.org/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **API**: [CoinGecko API](https://www.coingecko.com/api/documentation)
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/)
- **Iconos**: [Heroicons](https://heroicons.com/)

## 📦 Instalación

### Prerequisitos

- Node.js 18+ 
- npm, yarn, pnpm o bun

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/crypto-search.git
cd crypto-search
```

2. **Instalar dependencias**

```bash
npm install
# o
yarn install
# o
pnpm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
NEXT_PUBLIC_APP_NAME=Crypto Search Terminal
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── coin/              # Página de detalles (dinámica)
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── providers.tsx      # Providers (Toast, etc)
│
├── components/            # Componentes reutilizables
│   ├── features/         # Componentes de funcionalidades
│   │   ├── CoinCard.tsx
│   │   └── SearchBar.tsx
│   └── ui/               # Componentes UI básicos
│       ├── Loading.tsx
│       └── EmptyState.tsx
│
├── hooks/                # Custom Hooks
│   └── useCoinsSearch.ts
│
├── lib/                  # Lógica de negocio
│   ├── services/        # Servicios externos
│   │   └── coingecko.ts
│   └── utils/           # Utilidades
│       └── helpers.ts
│
└── types/               # Tipos TypeScript
    └── coin.ts
```

Ver [STRUCTURE.md](./STRUCTURE.md) para más detalles.

## 🎯 Uso

### Búsqueda básica

1. Escribe el nombre o símbolo de una criptomoneda en la barra de búsqueda
2. Presiona Enter o haz clic en el botón "BUSCAR"
3. Los resultados aparecerán animados en tarjetas

### Ver detalles

Haz clic en cualquier tarjeta de criptomoneda para ver información detallada (próximamente).

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Compilar para producción
npm run start    # Ejecutar compilado de producción
npm run lint     # Linter ESLint
```

## 🎨 Personalización

### Cambiar colores del tema

Edita `src/app/globals.css` o los componentes directamente:

```css
/* Color principal (verde matrix) */
--primary: #00ff00;

/* Fondo terminal */
--background: #0a0f1e;
```

### Agregar nuevas funcionalidades

1. Crea un hook en `src/hooks/`
2. Crea componentes en `src/components/features/` o `src/components/ui/`
3. Importa y usa en tus páginas

## 📝 Roadmap

- [ ] Página de detalles completa de cada criptomoneda
- [ ] Gráficos de precios históricos
- [ ] Sistema de favoritos con localStorage
- [ ] Comparador de criptomonedas
- [ ] Filtros avanzados (por market cap, cambio 24h, etc)
- [ ] Modo claro/oscuro toggle
- [ ] Búsqueda con autocompletado
- [ ] PWA (Progressive Web App)

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Tu Nombre**

- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [Tu Perfil](https://linkedin.com/in/tu-perfil)

## 🙏 Agradecimientos

- [CoinGecko](https://www.coingecko.com/) por su excelente API gratuita
- [Vercel](https://vercel.com/) por el hosting
- La comunidad de Next.js

---

<div align="center">

**[⬆ Volver arriba](#-crypto-search-terminal)**

Hecho con 💚 y mucho ☕

</div>
