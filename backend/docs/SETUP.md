# 🚀 Setup Guide - Crypto Social Backend

Guía paso a paso para configurar el backend completo.

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 17.x
```

### Instalar Angular CLI

```bash
npm install -g @angular/cli@17
```

---

## 🎯 Paso 1: Configurar Supabase

### 1.1. Crear cuenta y proyecto

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta (gratis)
3. Click en "New Project"
4. Completa los datos:
   - **Name**: crypto-social-backend
   - **Database Password**: (guarda esta contraseña)
   - **Region**: Elige la más cercana
   - **Pricing Plan**: Free (suficiente para empezar)
5. Espera ~2 minutos mientras se crea el proyecto

### 1.2. Ejecutar scripts SQL

1. En el dashboard de Supabase, ve a **SQL Editor**
2. Click en "New Query"
3. Copia y pega todo el contenido de `scripts/setup-supabase.sql`
4. Click en "Run" o presiona `Ctrl+Enter`
5. Espera a que termine (verás mensaje de éxito)
6. Repite el proceso con `scripts/seed-data.sql`

### 1.3. Configurar Storage para Avatares

1. Ve a **Storage** en el menú lateral
2. Click en "Create a new bucket"
3. Nombre: `avatars`
4. **Public bucket**: ✅ Activar
5. Click en "Create bucket"

### 1.4. Obtener credenciales

1. Ve a **Settings** → **API**
2. Copia estos valores:
   - **Project URL** (algo como: `https://xyz.supabase.co`)
   - **anon/public key** (clave larga que empieza con `eyJ...`)

---

## 🎯 Paso 2: Crear Proyecto Angular

### 2.1. Crear proyecto

```bash
cd C:\Users\kevin\Desktop\SantiagoDev\proyectospersonales\crypto-search
ng new crypto-backend --routing --style=scss --standalone
```

Responde a las preguntas:
- **Strict mode**: Yes
- **Server-Side Rendering**: No

```bash
cd crypto-backend
```

### 2.2. Instalar dependencias

```bash
npm install @supabase/supabase-js@latest
```

---

## 🎯 Paso 3: Configurar Environments

### 3.1. Crear archivo de environment

Crea `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://TU_PROYECTO.supabase.co',
  supabaseKey: 'eyJ...TU_ANON_KEY',
  apiUrl: 'http://localhost:4200/api'
};
```

### 3.2. Crear environment de producción

Crea `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  supabaseUrl: 'https://TU_PROYECTO.supabase.co',
  supabaseKey: 'eyJ...TU_ANON_KEY',
  apiUrl: 'https://tu-dominio.com/api'
};
```

---

## 🎯 Paso 4: Copiar Archivos del Proyecto

Copia todos los archivos de la carpeta `crypto-backend` que se creó en este repositorio a tu nuevo proyecto Angular.

---

## 🎯 Paso 5: Ejecutar el Proyecto

### 5.1. Modo desarrollo

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:4200`

### 5.2. Compilar para producción

```bash
ng build --configuration production
```

---

## 🎯 Paso 6: Integrar con Frontend Next.js

### 6.1. En tu proyecto Next.js

Crea un servicio para consumir el backend:

```typescript
// src/lib/services/backend.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api';

export class BackendService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Posts
  async getPosts(page = 1, limit = 20) {
    return this.request(`/posts?page=${page}&limit=${limit}`);
  }

  async createPost(data: any) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Portfolio
  async getPortfolio() {
    return this.request('/portfolio');
  }

  // Alerts
  async getAlerts() {
    return this.request('/alerts');
  }

  async createAlert(data: any) {
    return this.request('/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Social
  async followUser(userId: string) {
    return this.request(`/social/follow/${userId}`, {
      method: 'POST',
    });
  }
}

export const backendService = new BackendService();
```

### 6.2. Ejemplo de uso en componente Next.js

```typescript
'use client';

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/services/backend';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function loadPosts() {
      const data = await backendService.getPosts();
      setPosts(data.posts);
    }
    loadPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🎯 Paso 7: Configurar Variables de Entorno en Next.js

Crea `.env.local` en tu proyecto Next.js:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4200/api
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...TU_ANON_KEY
```

---

## ✅ Verificar que Todo Funciona

### 1. Backend funcionando

```bash
cd crypto-backend
npm start
```

Abre `http://localhost:4200` - deberías ver la página de Angular

### 2. Probar API

```bash
curl http://localhost:4200/api/posts
```

### 3. Frontend funcionando

```bash
cd crypto-search
npm run dev
```

Abre `http://localhost:3000` - tu app Next.js debería conectarse al backend

---

## 🐛 Troubleshooting

### Error: CORS

**Problema**: Error de CORS al hacer requests desde Next.js

**Solución**:
1. Ve a Supabase Dashboard → Settings → API
2. En "CORS Allowed Origins", agrega:
   - `http://localhost:3000`
   - `http://localhost:4200`

### Error: Cannot find module '@supabase/supabase-js'

**Solución**:
```bash
cd crypto-backend
npm install @supabase/supabase-js
```

### Error: Supabase connection failed

**Solución**:
1. Verifica que las credenciales en `environment.ts` sean correctas
2. Verifica que el proyecto de Supabase esté activo

### Error: Table does not exist

**Solución**:
1. Ve a Supabase SQL Editor
2. Ejecuta nuevamente `scripts/setup-supabase.sql`

---

## 📚 Próximos Pasos

1. ✅ Configurar autenticación en Next.js
2. ✅ Implementar componentes de UI para posts
3. ✅ Agregar sistema de notificaciones
4. ✅ Configurar despliegue en Vercel

---

## 📞 Soporte

Si tienes problemas, revisa:
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Angular](https://angular.io/docs)
- Los archivos en `docs/` de este repositorio
