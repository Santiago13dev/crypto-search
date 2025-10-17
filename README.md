# 🚀 Crypto Search

Terminal retro de criptomonedas con red social integrada para traders y entusiastas del crypto.

<img width="1903" height="862" alt="image" src="https://github.com/user-attachments/assets/14ce2812-b9d2-4b3b-b83d-09e40fd6b89a" />

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Características

### 🔍 Búsqueda Avanzada
- Búsqueda en tiempo real de criptomonedas
- Datos actualizados de CoinGecko API
- Información detallada de precios y capitalización
- Sistema de favoritos

### 💼 Gestión de Portfolio
- Crea múltiples portfolios personalizados
- Tracking de inversiones en tiempo real
- Cálculo automático de ganancias/pérdidas (P&L)
- Portfolios públicos y privados
- Visualización de distribución de activos

### 🔔 Sistema de Alertas
- Alertas de precio personalizadas
- Notificaciones cuando se alcanza el precio objetivo
- Condiciones "above" y "below"
- Ver alertas populares con sentiment del mercado
- Notificaciones por email (opcional)

### 🌐 Red Social de Traders
- Crea posts sobre análisis de criptomonedas
- Sistema de reacciones (👍 Like, 📈 Bullish, 📉 Bearish, 🔥 Fire)
- Comentarios en posts
- Sentiment tracking (Bullish/Bearish/Neutral)
- Precios objetivo compartidos
- Feed en tiempo real con Supabase Realtime

### 👤 Perfiles de Usuario
- Perfiles personalizables
- Upload de foto de perfil
- Bio, redes sociales y sitio web
- Sistema de niveles y XP
- Seguidores y seguidos
- Estadísticas de trader

### 🎨 Diseño Terminal Retro
- Estética cyberpunk/terminal
- Animaciones suaves con Framer Motion
- Grid background tipo matriz
- Efectos de glow neón
- Tipografía monospace
- Modo oscuro nativo

### 🌍 Multiidioma
- Español e Inglés
- Cambio de idioma en tiempo real
- Detección automática del navegador

### 📱 Responsive
- Diseño adaptable a todos los dispositivos
- Mobile-first approach
- Menú hamburguesa en móvil

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 15.4** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Framer Motion** - Animaciones
- **React Hot Toast** - Notificaciones
- **Heroicons** - Iconos

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Realtime Subscriptions
  - Storage para avatares
  - Authentication (Email, Google, GitHub)

### APIs
- **CoinGecko API** - Datos de criptomonedas

## 📦 Instalación

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/crypto-terminal.git
cd crypto-terminal/crypto-search
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto:

```env
# CoinGecko API
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key

# App
NEXT_PUBLIC_APP_NAME=Crypto Terminal
```

### 4. Configurar Supabase

#### A. Crear proyecto en Supabase
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Copia la URL y la Anon Key

#### B. Ejecutar scripts SQL
Ve a SQL Editor en Supabase y ejecuta en orden:

1. **Crear tablas principales**
```sql
-- Ejecutar: crypto-backend/scripts/create-remaining-tables.sql
```

2. **Configurar triggers**
```sql
-- Ejecutar: crypto-backend/scripts/recreate-trigger.sql
```

3. **Arreglar constraints**
```sql
-- Ejecutar: crypto-backend/scripts/fix-constraints.sql
```

4. **Crear bucket de avatares**
```sql
-- Ejecutar: crypto-backend/scripts/create-avatar-bucket.sql
```

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📁 Estructura del Proyecto

```
crypto-search/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── alerts/            # Página de alertas
│   │   ├── auth/              # Login/Registro
│   │   ├── portfolio/         # Gestión de portfolios
│   │   ├── profile/           # Perfil de usuario
│   │   └── social/            # Red social
│   ├── components/
│   │   ├── features/          # Componentes de features
│   │   ├── language/          # Sistema i18n
│   │   ├── navigation/        # Navegación y menús
│   │   ├── theme/             # Temas
│   │   └── ui/                # Componentes UI base
│   ├── contexts/              # React Contexts
│   ├── hooks/                 # Custom Hooks
│   │   └── supabase/          # Hooks de Supabase
│   ├── lib/
│   │   ├── supabase/          # Cliente y funciones de Supabase
│   │   ├── services/          # Servicios externos (CoinGecko)
│   │   └── validations.ts     # Validaciones de formularios
│   └── types/                 # TypeScript types
├── public/                    # Assets estáticos
└── crypto-backend/
    └── scripts/               # Scripts SQL de Supabase
```

## 🗄️ Base de Datos

### Tablas Principales

- **profiles** - Perfiles de usuario
- **posts** - Posts de la red social
- **comments** - Comentarios en posts
- **reactions** - Reacciones (like, bullish, bearish, fire)
- **portfolios** - Portfolios de inversión
- **portfolio_items** - Items dentro de portfolios
- **alerts** - Alertas de precio
- **follows** - Sistema de seguir usuarios

### Vistas
- **posts_with_author** - Posts con información del autor
- **popular_alerts** - Alertas más populares con sentiment

### Storage
- **avatars** - Bucket para fotos de perfil

## 🔐 Autenticación

Métodos soportados:
- ✅ Email/Password
- ✅ Google OAuth
- ✅ GitHub OAuth

## 🎯 Uso

### Crear un Post
1. Inicia sesión o regístrate
2. Ve a la sección "Red Social"
3. Click en "CREAR_POST"
4. Completa el formulario:
   - Coin ID (ej: bitcoin)
   - Símbolo (ej: BTC)
   - Título del análisis
   - Contenido
   - Sentiment (Bullish/Bearish/Neutral)
   - Precio objetivo (opcional)
5. Publica y comparte con la comunidad

### Crear Portfolio
1. Ve a "Portfolio"
2. Click en "CREAR"
3. Nombra tu portfolio
4. Agrega cryptos:
   - Selecciona la moneda
   - Cantidad que posees
   - Precio de compra
5. El sistema calculará automáticamente tu P&L

### Configurar Alertas
1. Ve a "Alertas"
2. Click en "CREAR_ALERTA"
3. Configura:
   - Criptomoneda
   - Precio objetivo
   - Condición (above/below)
   - Notificación por email
4. Recibe notificaciones cuando se alcance el precio

## 🚀 Deployment

### Vercel (Recomendado)

1. Sube tu código a GitHub
2. Importa el proyecto en Vercel
3. Configura las variables de entorno
4. Deploy automático

### Variables de Entorno en Vercel
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_COINGECKO_API=https://api.coingecko.com/api/v3
NEXT_PUBLIC_APP_NAME=Crypto Terminal
```

## 🧪 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

## 🎨 Personalización

### Cambiar Tema
Edita `src/app/globals.css`:

```css
:root {
  --primary-rgb: 0, 255, 0;  /* Verde terminal */
  --background: #0a0a0a;
  --primary: #00ff00;
}

/* Para tema azul matrix */
:root {
  --primary-rgb: 0, 255, 255;
  --primary: #00ffff;
}
```

## 📊 Roadmap

- [ ] Sistema de badges y logros
- [ ] Notificaciones push
- [ ] Charts con TradingView
- [ ] API pública
- [ ] PWA support
- [ ] Sistema de comentarios mejorado
- [ ] Búsqueda de usuarios
- [ ] Trending traders
- [ ] Analytics avanzados

## 🤝 Contribuir

Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👨‍💻 Autor

**Kevin** - [GitHub](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [CoinGecko](https://www.coingecko.com/) por la API de datos
- [Supabase](https://supabase.com/) por el backend
- [Vercel](https://vercel.com/) por el hosting
- [Heroicons](https://heroicons.com/) por los iconos

## 📞 Soporte

¿Necesitas ayuda? Abre un issue en GitHub o contacta al equipo.

---

Hecho con ❤️ y ☕ por la comunidad crypto
