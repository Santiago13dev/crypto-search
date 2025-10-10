# 📡 API REST Documentation

Documentación completa de todos los endpoints del backend Crypto Social.

## 🔐 Autenticación

Todos los endpoints (excepto `/auth/register` y `/auth/login`) requieren autenticación mediante JWT token.

**Header requerido:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 Tabla de Contenidos

- [Autenticación](#autenticación)
- [Posts](#posts)
- [Comentarios](#comentarios)
- [Reacciones](#reacciones)
- [Portfolio](#portfolio)
- [Alertas](#alertas)
- [Social (Follow/Unfollow)](#social)
- [Notificaciones](#notificaciones)
- [Perfil](#perfil)
- [Badges](#badges)

---

## 🔑 Autenticación

### POST `/api/auth/register`

Registrar nuevo usuario.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "crypto_trader",
  "full_name": "John Doe"
}
```

**Response: 201 Created**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "crypto_trader"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

---

### POST `/api/auth/login`

Iniciar sesión.

**Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response: 200 OK**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "crypto_trader"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token"
  }
}
```

---

### POST `/api/auth/logout`

Cerrar sesión.

**Response: 200 OK**
```json
{
  "message": "Logout successful"
}
```

---

### GET `/api/auth/profile`

Obtener perfil del usuario autenticado.

**Response: 200 OK**
```json
{
  "id": "uuid",
  "username": "crypto_trader",
  "full_name": "John Doe",
  "bio": "Crypto enthusiast",
  "avatar_url": "https://...",
  "level": 5,
  "experience_points": 2500,
  "followers_count": 120,
  "following_count": 85
}
```

---

### PUT `/api/auth/profile`

Actualizar perfil.

**Body:**
```json
{
  "full_name": "John Doe Updated",
  "bio": "Professional crypto trader",
  "website": "https://example.com",
  "twitter": "@johndoe"
}
```

**Response: 200 OK**
```json
{
  "id": "uuid",
  "username": "crypto_trader",
  "full_name": "John Doe Updated",
  "bio": "Professional crypto trader"
}
```

---

## 📝 Posts

### GET `/api/posts`

Listar posts (feed personalizado).

**Query Params:**
- `page` (optional): Número de página (default: 1)
- `limit` (optional): Items por página (default: 20)
- `coin_id` (optional): Filtrar por criptomoneda
- `sentiment` (optional): Filtrar por sentimiento (bullish/bearish/neutral)

**Response: 200 OK**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "Bitcoin alcanzará $100k en 2025",
      "content": "Análisis detallado...",
      "coin_id": "bitcoin",
      "coin_symbol": "BTC",
      "sentiment": "bullish",
      "target_price": 100000,
      "author": {
        "id": "uuid",
        "username": "crypto_trader",
        "avatar_url": "https://..."
      },
      "likes_count": 45,
      "comments_count": 12,
      "views_count": 234,
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156
  }
}
```

---

### GET `/api/posts/:id`

Obtener detalle de un post.

**Response: 200 OK**
```json
{
  "id": "uuid",
  "title": "Bitcoin alcanzará $100k en 2025",
  "content": "Análisis detallado...",
  "coin_id": "bitcoin",
  "coin_symbol": "BTC",
  "sentiment": "bullish",
  "target_price": 100000,
  "author": {
    "id": "uuid",
    "username": "crypto_trader",
    "avatar_url": "https://...",
    "level": 5
  },
  "reactions": {
    "like": 45,
    "bullish": 78,
    "bearish": 12,
    "fire": 34
  },
  "user_reaction": "bullish",
  "comments_count": 12,
  "views_count": 234,
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### POST `/api/posts`

Crear nuevo post.

**Body:**
```json
{
  "title": "Bitcoin alcanzará $100k en 2025",
  "content": "Análisis detallado...",
  "coin_id": "bitcoin",
  "coin_symbol": "BTC",
  "sentiment": "bullish",
  "target_price": 100000,
  "is_public": true
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "title": "Bitcoin alcanzará $100k en 2025",
  "created_at": "2025-01-15T10:30:00Z"
}
```

---

### PUT `/api/posts/:id`

Actualizar post existente.

**Body:**
```json
{
  "title": "Bitcoin alcanzará $150k en 2025",
  "content": "Análisis actualizado...",
  "target_price": 150000
}
```

**Response: 200 OK**
```json
{
  "id": "uuid",
  "title": "Bitcoin alcanzará $150k en 2025",
  "updated_at": "2025-01-15T11:30:00Z"
}
```

---

### DELETE `/api/posts/:id`

Eliminar post.

**Response: 200 OK**
```json
{
  "message": "Post deleted successfully"
}
```

---

## 💬 Comentarios

### GET `/api/posts/:id/comments`

Obtener comentarios de un post.

**Response: 200 OK**
```json
{
  "comments": [
    {
      "id": "uuid",
      "content": "Gran análisis!",
      "author": {
        "id": "uuid",
        "username": "trader123",
        "avatar_url": "https://..."
      },
      "replies_count": 3,
      "created_at": "2025-01-15T10:45:00Z"
    }
  ]
}
```

---

### POST `/api/posts/:id/comments`

Crear comentario en un post.

**Body:**
```json
{
  "content": "Excelente análisis!",
  "parent_comment_id": null
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "content": "Excelente análisis!",
  "created_at": "2025-01-15T10:45:00Z"
}
```

---

## 👍 Reacciones

### POST `/api/posts/:id/reactions`

Agregar o cambiar reacción a un post.

**Body:**
```json
{
  "reaction_type": "bullish"
}
```

**Valores válidos:** `like`, `bullish`, `bearish`, `fire`

**Response: 200 OK**
```json
{
  "message": "Reaction added successfully",
  "reaction_type": "bullish"
}
```

---

### DELETE `/api/posts/:id/reactions/:type`

Eliminar reacción.

**Response: 200 OK**
```json
{
  "message": "Reaction removed successfully"
}
```

---

## 💼 Portfolio

### GET `/api/portfolio`

Obtener portfolio del usuario autenticado.

**Response: 200 OK**
```json
{
  "id": "uuid",
  "name": "Mi Portfolio Principal",
  "description": "Portfolio de largo plazo",
  "total_invested": 10000.00,
  "current_value": 15230.50,
  "profit_loss": 5230.50,
  "profit_loss_percentage": 52.31,
  "items": [
    {
      "id": "uuid",
      "coin_id": "bitcoin",
      "coin_symbol": "BTC",
      "amount": 0.5,
      "purchase_price": 45000,
      "current_price": 68000,
      "profit_loss_percentage": 51.11
    }
  ]
}
```

---

### POST `/api/portfolio`

Crear o actualizar portfolio.

**Body:**
```json
{
  "name": "Portfolio DeFi",
  "description": "Inversiones en DeFi",
  "is_public": true
}
```

**Response: 201 Created**

---

### POST `/api/portfolio/items`

Agregar item al portfolio.

**Body:**
```json
{
  "portfolio_id": "uuid",
  "coin_id": "bitcoin",
  "coin_symbol": "BTC",
  "amount": 0.5,
  "purchase_price": 45000,
  "notes": "Compra en el dip"
}
```

**Response: 201 Created**

---

### GET `/api/portfolio/:userId`

Ver portfolio público de otro usuario.

**Response: 200 OK**

---

### GET `/api/portfolio/rankings`

Rankings de traders por rentabilidad.

**Query Params:**
- `timeframe` (optional): day/week/month/year/all

**Response: 200 OK**
```json
{
  "rankings": [
    {
      "rank": 1,
      "user": {
        "id": "uuid",
        "username": "whale_trader",
        "avatar_url": "https://..."
      },
      "profit_loss_percentage": 245.50,
      "followers_count": 1250
    }
  ]
}
```

---

## 🔔 Alertas

### GET `/api/alerts`

Listar alertas del usuario.

**Response: 200 OK**
```json
{
  "alerts": [
    {
      "id": "uuid",
      "coin_id": "bitcoin",
      "coin_symbol": "BTC",
      "target_price": 70000,
      "condition": "above",
      "status": "active",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST `/api/alerts`

Crear nueva alerta.

**Body:**
```json
{
  "coin_id": "bitcoin",
  "coin_symbol": "BTC",
  "target_price": 70000,
  "condition": "above",
  "message": "Bitcoin alcanzó mi objetivo!",
  "notify_email": true
}
```

**Response: 201 Created**

---

### DELETE `/api/alerts/:id`

Eliminar alerta.

**Response: 200 OK**

---

### GET `/api/alerts/popular`

Ver alertas populares (sentiment del mercado).

**Response: 200 OK**
```json
{
  "popular_alerts": [
    {
      "coin_id": "bitcoin",
      "coin_symbol": "BTC",
      "target_price": 70000,
      "users_count": 156,
      "sentiment": "bullish"
    }
  ]
}
```

---

## 👥 Social

### POST `/api/social/follow/:userId`

Seguir a un usuario.

**Response: 200 OK**
```json
{
  "message": "Now following user",
  "user_id": "uuid"
}
```

---

### DELETE `/api/social/unfollow/:userId`

Dejar de seguir.

**Response: 200 OK**

---

### GET `/api/social/followers`

Lista de seguidores.

**Response: 200 OK**
```json
{
  "followers": [
    {
      "id": "uuid",
      "username": "trader123",
      "avatar_url": "https://...",
      "is_following_back": true
    }
  ]
}
```

---

### GET `/api/social/following`

Lista de usuarios seguidos.

**Response: 200 OK**

---

## 🔔 Notificaciones

### GET `/api/notifications`

Listar notificaciones.

**Query Params:**
- `unread_only` (optional): true/false

**Response: 200 OK**
```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "post_comment",
      "title": "Nuevo comentario",
      "message": "trader123 comentó en tu post",
      "link": "/posts/uuid",
      "read": false,
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### PUT `/api/notifications/:id/read`

Marcar como leída.

**Response: 200 OK**

---

### PUT `/api/notifications/read-all`

Marcar todas como leídas.

**Response: 200 OK**

---

## 🏆 Badges

### GET `/api/badges`

Listar todos los badges disponibles.

**Response: 200 OK**
```json
{
  "badges": [
    {
      "id": "uuid",
      "name": "First Post",
      "description": "Publicaste tu primer análisis",
      "icon": "📝",
      "xp_reward": 100
    }
  ]
}
```

---

### GET `/api/badges/user/:userId`

Badges desbloqueados por un usuario.

**Response: 200 OK**
```json
{
  "badges": [
    {
      "id": "uuid",
      "name": "First Post",
      "unlocked_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

## ❌ Errores

Todos los endpoints devuelven errores en el siguiente formato:

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "status": 401
  }
}
```

**Códigos de error comunes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 📊 Rate Limiting

- **Requests generales**: 100 req/min por IP
- **Autenticación**: 10 intentos/hora
- **Creación de posts**: 10 posts/hora
- **Comentarios**: 30 comentarios/hora

---

**Última actualización**: Enero 2025
