# Crypto Terminal - Backend Scripts

Scripts SQL para configurar la base de datos de Supabase.

## 📋 Orden de Ejecución

Ejecuta estos scripts en **SQL Editor de Supabase** en este orden:

### 1. Crear tablas y estructura
```sql
-- Ejecutar: scripts/create-remaining-tables.sql
```
Crea todas las tablas: profiles, posts, comments, reactions, portfolios, alerts, follows

### 2. Configurar triggers
```sql
-- Ejecutar: scripts/recreate-trigger.sql
```
Configura el trigger para crear perfiles automáticamente cuando un usuario se registra

### 3. Arreglar constraints
```sql
-- Ejecutar: scripts/fix-constraints.sql
```
Ajusta los constraints de longitud de texto en posts

### 4. Crear storage para avatares
```sql
-- Ejecutar: scripts/create-avatar-bucket.sql
```
Crea el bucket público para fotos de perfil

### 5. (Si es necesario) Arreglar perfiles faltantes
```sql
-- Ejecutar: scripts/fix-missing-profiles.sql
```
Crea perfiles para usuarios existentes que no tengan uno

## ✅ Verificación

Después de ejecutar todos los scripts, verifica en Supabase:

- [ ] Tabla `profiles` existe con RLS activado
- [ ] Tabla `posts` existe con RLS activado
- [ ] Tabla `portfolios` existe con RLS activado
- [ ] Tabla `alerts` existe con RLS activado
- [ ] Bucket `avatars` existe en Storage
- [ ] Trigger `on_auth_user_created` está activo
- [ ] Todas las policies de RLS están creadas

## 🔐 Seguridad

Todos los scripts incluyen:
- Row Level Security (RLS)
- Policies de acceso
- Constraints de validación
- Índices para performance

## 📝 Notas

- Los scripts son idempotentes (se pueden ejecutar múltiples veces)
- Usan `IF NOT EXISTS` y `ON CONFLICT` para evitar errores
- Incluyen logging de errores en triggers
