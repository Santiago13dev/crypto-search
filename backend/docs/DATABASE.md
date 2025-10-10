```sql
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🎯 Datos de Ejemplo (Seed Data)

### Badges iniciales

```sql
INSERT INTO badges (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('First Post', 'Publicaste tu primer análisis', '📝', 100, 'posts_count', 1),
  ('Social Butterfly', 'Alcanzaste 10 seguidores', '🦋', 200, 'followers_count', 10),
  ('Influencer', 'Alcanzaste 100 seguidores', '⭐', 500, 'followers_count', 100),
  ('Crypto Guru', 'Publicaste 50 análisis', '🧙', 1000, 'posts_count', 50),
  ('Popular', 'Tu post recibió 100 likes', '🔥', 300, 'post_likes', 100),
  ('Trader Pro', 'Tu portfolio ganó más del 50%', '💰', 500, 'portfolio_profit', 50),
  ('Diamond Hands', 'Has mantenido inversiones por más de 1 año', '💎', 750, 'holding_time', 365),
  ('Early Bird', 'Configuraste tu primera alerta', '🔔', 50, 'alerts_count', 1),
  ('Alert Master', 'Tienes 20 alertas activas', '🎯', 200, 'alerts_count', 20);
```

---

## 📈 Índices de Performance

```sql
-- Índice compuesto para búsqueda de posts por moneda y fecha
CREATE INDEX idx_posts_coin_created ON posts(coin_id, created_at DESC);

-- Índice para feed personalizado
CREATE INDEX idx_posts_public_created ON posts(is_public, created_at DESC) WHERE is_public = true;

-- Índice para conteo de reacciones
CREATE INDEX idx_reactions_post_type ON reactions(post_id, reaction_type);

-- Índice para búsqueda de usuarios
CREATE INDEX idx_profiles_username_trgm ON profiles USING gin(username gin_trgm_ops);
CREATE INDEX idx_profiles_fullname_trgm ON profiles USING gin(full_name gin_trgm_ops);

-- Habilitar extensión para búsqueda fuzzy
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## 🔍 Queries Útiles

### Obtener top traders por rentabilidad

```sql
SELECT 
  p.username,
  po.name as portfolio_name,
  po.profit_loss_percentage,
  po.current_value,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as followers
FROM profiles p
JOIN portfolios po ON p.id = po.user_id
WHERE po.is_public = true
ORDER BY po.profit_loss_percentage DESC
LIMIT 10;
```

### Sentiment de mercado por moneda

```sql
SELECT 
  coin_id,
  coin_symbol,
  COUNT(*) as total_posts,
  COUNT(*) FILTER (WHERE sentiment = 'bullish') as bullish_count,
  COUNT(*) FILTER (WHERE sentiment = 'bearish') as bearish_count,
  COUNT(*) FILTER (WHERE sentiment = 'neutral') as neutral_count,
  ROUND(
    (COUNT(*) FILTER (WHERE sentiment = 'bullish')::FLOAT / COUNT(*)) * 100, 
    2
  ) as bullish_percentage
FROM posts
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY coin_id, coin_symbol
ORDER BY total_posts DESC;
```

### Posts más populares de la semana

```sql
SELECT 
  p.id,
  p.title,
  p.coin_symbol,
  pr.username,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id) as total_reactions,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as total_comments,
  p.views_count
FROM posts p
JOIN profiles pr ON p.author_id = pr.id
WHERE p.created_at > NOW() - INTERVAL '7 days'
  AND p.is_public = true
ORDER BY 
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id) + 
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) DESC
LIMIT 20;
```

### Usuarios más activos

```sql
SELECT 
  p.id,
  p.username,
  p.level,
  COUNT(DISTINCT po.id) as posts_count,
  COUNT(DISTINCT c.id) as comments_count,
  COUNT(DISTINCT r.id) as reactions_count,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as followers_count
FROM profiles p
LEFT JOIN posts po ON p.id = po.author_id
LEFT JOIN comments c ON p.id = c.author_id
LEFT JOIN reactions r ON p.id = r.user_id
WHERE p.created_at > NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY (
  COUNT(DISTINCT po.id) * 3 + 
  COUNT(DISTINCT c.id) * 1 + 
  COUNT(DISTINCT r.id) * 0.5
) DESC
LIMIT 50;
```

---

## 🛡️ Consideraciones de Seguridad

### 1. Rate Limiting en Supabase

Configurar en Supabase Dashboard:
- Límite de requests por IP: 100 req/min
- Límite de autenticación: 10 intentos/hora
- Límite de uploads: 50 MB por archivo

### 2. Validación de Datos

Todos los constraints SQL actúan como primera línea de defensa:
- Longitudes mínimas/máximas en textos
- Valores positivos en precios y cantidades
- Checks de integridad referencial

### 3. Sanitización

```sql
-- Función para sanitizar HTML/SQL en comentarios
CREATE OR REPLACE FUNCTION sanitize_text(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN regexp_replace(
    input_text,
    '<[^>]*>|DROP|DELETE|UPDATE|INSERT|ALTER|CREATE|TRUNCATE',
    '',
    'gi'
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;
```

### 4. Auditoría

```sql
-- Tabla de auditoría para acciones sensibles
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
```

---

## 📱 Realtime Subscriptions

### Configurar canales de Realtime en Supabase

```sql
-- Habilitar Realtime para tablas específicas
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
```

### Ejemplo de uso en cliente

```typescript
// Escuchar nuevos posts en tiempo real
supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Nuevo post:', payload.new);
    }
  )
  .subscribe();

// Escuchar notificaciones del usuario
supabase
  .channel(`notifications:${userId}`)
  .on('postgres_changes',
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'notifications',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Nueva notificación:', payload.new);
    }
  )
  .subscribe();
```

---

## 🔄 Migraciones

### Estructura de migraciones

```
supabase/
└── migrations/
    ├── 20250101000000_initial_schema.sql
    ├── 20250101000001_create_profiles.sql
    ├── 20250101000002_create_posts.sql
    ├── 20250101000003_create_social_features.sql
    ├── 20250101000004_create_portfolios.sql
    ├── 20250101000005_create_alerts.sql
    ├── 20250101000006_create_badges.sql
    ├── 20250101000007_create_rls_policies.sql
    ├── 20250101000008_create_triggers.sql
    └── 20250101000009_seed_data.sql
```

### Comandos de migración

```bash
# Crear nueva migración
supabase migration new nombre_de_migracion

# Aplicar migraciones
supabase db push

# Reset database (CUIDADO: elimina todos los datos)
supabase db reset

# Ver estado de migraciones
supabase migration list
```

---

## 💾 Backup y Recuperación

### Configurar backups automáticos

En Supabase Dashboard:
1. Settings → Database
2. Habilitar Point-in-Time Recovery (PITR)
3. Configurar retención: 7 días (plan gratuito) o más

### Backup manual

```bash
# Exportar schema
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -s \
  -f schema.sql \
  postgres

# Exportar datos
pg_dump -h db.your-project.supabase.co \
  -U postgres \
  -a \
  -f data.sql \
  postgres
```

---

## 📊 Monitoreo

### Queries lentas

```sql
-- Ver queries más lentas
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;
```

### Tamaño de tablas

```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Índices no utilizados

```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## 🎓 Mejores Prácticas

1. **Usar transacciones**: Para operaciones que modifican múltiples tablas
2. **Índices selectivos**: Solo crear índices necesarios
3. **Paginar resultados**: Siempre usar LIMIT y OFFSET
4. **Cachear queries pesadas**: Usar vistas materializadas para reports
5. **Monitorear performance**: Revisar pg_stat_statements regularmente
6. **RLS siempre activo**: Nunca deshabilitar Row Level Security
7. **Validar en múltiples capas**: Backend + Database constraints
8. **Usar prepared statements**: Para prevenir SQL injection
9. **Soft deletes**: Considerar flags is_deleted en vez de DELETE
10. **Versionado de schema**: Usar migraciones versionadas

---

## 🚀 Optimizaciones Avanzadas

### Particionamiento de tablas grandes

```sql
-- Particionar tabla de notificaciones por mes
CREATE TABLE notifications_partitioned (
  LIKE notifications INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Crear particiones
CREATE TABLE notifications_2025_01 PARTITION OF notifications_partitioned
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE notifications_2025_02 PARTITION OF notifications_partitioned
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

### Materialized Views para analytics

```sql
-- Vista materializada para estadísticas de usuarios
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
  p.id,
  p.username,
  COUNT(DISTINCT po.id) as posts_count,
  COUNT(DISTINCT c.id) as comments_count,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as followers_count,
  (SELECT COUNT(*) FROM follows WHERE follower_id = p.id) as following_count
FROM profiles p
LEFT JOIN posts po ON p.id = po.author_id
LEFT JOIN comments c ON p.id = c.author_id
GROUP BY p.id;

-- Índice en la vista materializada
CREATE INDEX idx_user_stats_posts ON user_stats(posts_count DESC);

-- Refrescar la vista (ejecutar periódicamente con cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;
```

---

## 📚 Referencias

- [Supabase Database](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

**Última actualización**: Enero 2025
