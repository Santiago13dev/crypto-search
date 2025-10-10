-- ============================================
-- CRYPTO SOCIAL BACKEND - SUPABASE SETUP
-- ============================================
-- Script completo para configurar la base de datos
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda fuzzy

-- ============================================
-- 1. CREAR ENUMS
-- ============================================

CREATE TYPE reaction_type AS ENUM ('like', 'bullish', 'bearish', 'fire');
CREATE TYPE alert_condition AS ENUM ('above', 'below');
CREATE TYPE alert_status AS ENUM ('active', 'triggered', 'cancelled');
CREATE TYPE notification_type AS ENUM (
  'new_follower',
  'post_comment',
  'post_reaction',
  'alert_triggered',
  'badge_unlocked',
  'mention'
);

-- ============================================
-- 2. CREAR TABLAS
-- ============================================

-- Tabla: profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  twitter TEXT,
  telegram TEXT,
  experience_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT true,
  show_portfolio BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT bio_length CHECK (char_length(bio) <= 500)
);

-- Tabla: posts
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  sentiment TEXT CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  target_price DECIMAL(20, 8),
  is_public BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT title_length CHECK (char_length(title) >= 5 AND char_length(title) <= 200),
  CONSTRAINT content_length CHECK (char_length(content) >= 10 AND char_length(content) <= 5000)
);

-- Tabla: comments
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 1000)
);

-- Tabla: reactions
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(post_id, user_id, reaction_type)
);

-- Tabla: portfolios
CREATE TABLE portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Mi Portfolio',
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  total_invested DECIMAL(20, 2) DEFAULT 0,
  current_value DECIMAL(20, 2) DEFAULT 0,
  profit_loss DECIMAL(20, 2) DEFAULT 0,
  profit_loss_percentage DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Tabla: portfolio_items
CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  amount DECIMAL(30, 18) NOT NULL,
  purchase_price DECIMAL(20, 8) NOT NULL,
  current_price DECIMAL(20, 8),
  purchase_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT amount_positive CHECK (amount > 0),
  CONSTRAINT price_positive CHECK (purchase_price > 0)
);

-- Tabla: alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL,
  coin_symbol TEXT NOT NULL,
  target_price DECIMAL(20, 8) NOT NULL,
  condition alert_condition NOT NULL,
  status alert_status DEFAULT 'active',
  message TEXT,
  notify_email BOOLEAN DEFAULT true,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT target_price_positive CHECK (target_price > 0)
);

-- Tabla: follows
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Tabla: badges
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  xp_reward INTEGER DEFAULT 0,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla: user_badges
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, badge_id)
);

-- Tabla: notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CREAR ÍNDICES
-- ============================================

-- Índices para profiles
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_level ON profiles(level DESC);
CREATE INDEX idx_profiles_xp ON profiles(experience_points DESC);
CREATE INDEX idx_profiles_username_trgm ON profiles USING gin(username gin_trgm_ops);
CREATE INDEX idx_profiles_fullname_trgm ON profiles USING gin(full_name gin_trgm_ops);

-- Índices para posts
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_coin ON posts(coin_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_sentiment ON posts(sentiment);
CREATE INDEX idx_posts_coin_created ON posts(coin_id, created_at DESC);
CREATE INDEX idx_posts_public_created ON posts(is_public, created_at DESC) WHERE is_public = true;

-- Índices para comments
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- Índices para reactions
CREATE INDEX idx_reactions_post ON reactions(post_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);
CREATE INDEX idx_reactions_post_type ON reactions(post_id, reaction_type);

-- Índices para portfolios
CREATE INDEX idx_portfolios_user ON portfolios(user_id);
CREATE INDEX idx_portfolios_public ON portfolios(is_public) WHERE is_public = true;
CREATE INDEX idx_portfolios_profit ON portfolios(profit_loss_percentage DESC);

-- Índices para portfolio_items
CREATE INDEX idx_portfolio_items_portfolio ON portfolio_items(portfolio_id);
CREATE INDEX idx_portfolio_items_coin ON portfolio_items(coin_id);

-- Índices para alerts
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_coin ON alerts(coin_id);
CREATE INDEX idx_alerts_status ON alerts(status) WHERE status = 'active';
CREATE INDEX idx_alerts_price ON alerts(target_price);

-- Índices para follows
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Índices para badges
CREATE INDEX idx_badges_name ON badges(name);

-- Índices para user_badges
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- Índices para notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = false;
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- 4. FUNCIONES Y TRIGGERS
-- ============================================

-- Función: Auto-crear perfil al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función: Actualizar timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger de updated_at a todas las tablas relevantes
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_posts
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_comments
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_portfolios
  BEFORE UPDATE ON portfolios
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_portfolio_items
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_alerts
  BEFORE UPDATE ON alerts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Función: Incrementar vistas de posts
CREATE OR REPLACE FUNCTION public.increment_post_views(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET views_count = views_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función: Calcular nivel basado en XP
CREATE OR REPLACE FUNCTION public.calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(SQRT(xp / 100.0))::INTEGER);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION public.update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level = calculate_level(NEW.experience_points);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_user_level
  BEFORE INSERT OR UPDATE OF experience_points ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_level();

-- Función: Notificar nuevo comentario
CREATE OR REPLACE FUNCTION public.notify_post_comment()
RETURNS TRIGGER AS $$
DECLARE
  post_author_id UUID;
  post_title TEXT;
BEGIN
  SELECT author_id, title INTO post_author_id, post_title
  FROM posts WHERE id = NEW.post_id;
  
  IF post_author_id != NEW.author_id THEN
    INSERT INTO notifications (user_id, type, title, message, link)
    VALUES (
      post_author_id,
      'post_comment',
      'Nuevo comentario',
      'Alguien comentó en tu post: ' || post_title,
      '/posts/' || NEW.post_id
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_comment_created
  AFTER INSERT ON comments
  FOR EACH ROW EXECUTE FUNCTION notify_post_comment();

-- Función: Notificar nuevo seguidor
CREATE OR REPLACE FUNCTION public.notify_new_follower()
RETURNS TRIGGER AS $$
DECLARE
  follower_username TEXT;
BEGIN
  SELECT username INTO follower_username
  FROM profiles WHERE id = NEW.follower_id;
  
  INSERT INTO notifications (user_id, type, title, message, link)
  VALUES (
    NEW.following_id,
    'new_follower',
    'Nuevo seguidor',
    follower_username || ' te está siguiendo',
    '/profile/' || NEW.follower_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_follow_created
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION notify_new_follower();

-- Función: Feed personalizado
CREATE OR REPLACE FUNCTION public.get_personalized_feed(
  user_uuid UUID, 
  page_size INTEGER DEFAULT 20, 
  page_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  post_id UUID,
  title TEXT,
  content TEXT,
  coin_id TEXT,
  coin_symbol TEXT,
  sentiment TEXT,
  author_username TEXT,
  author_avatar TEXT,
  likes_count BIGINT,
  comments_count BIGINT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.title,
    p.content,
    p.coin_id,
    p.coin_symbol,
    p.sentiment,
    pr.username,
    pr.avatar_url,
    (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'like'),
    (SELECT COUNT(*) FROM comments WHERE post_id = p.id),
    p.created_at
  FROM posts p
  JOIN profiles pr ON p.author_id = pr.id
  WHERE 
    p.is_public = true
    AND (
      p.author_id IN (SELECT following_id FROM follows WHERE follower_id = user_uuid)
      OR p.author_id = user_uuid
    )
  ORDER BY p.created_at DESC
  LIMIT page_size
  OFFSET page_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable based on privacy"
  ON posts FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = author_id);

-- Reactions
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reactions are viewable by everyone"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolios
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolios viewable based on privacy"
  ON portfolios FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolios"
  ON portfolios FOR ALL
  USING (auth.uid() = user_id);

-- Portfolio Items
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Portfolio items viewable via portfolio"
  ON portfolio_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_items.portfolio_id
      AND (portfolios.is_public = true OR portfolios.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can manage own portfolio items"
  ON portfolio_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM portfolios
      WHERE portfolios.id = portfolio_items.portfolio_id
      AND portfolios.user_id = auth.uid()
    )
  );

-- Alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts"
  ON alerts FOR ALL
  USING (auth.uid() = user_id);

-- Follows
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Follows are viewable by everyone"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- Badges
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Badges are viewable by everyone"
  ON badges FOR SELECT
  USING (true);

-- User Badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User badges are viewable by everyone"
  ON user_badges FOR SELECT
  USING (true);

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. CONFIGURAR REALTIME
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;

-- ============================================
-- 7. VISTAS
-- ============================================

-- Vista: Posts con información del autor
CREATE OR REPLACE VIEW posts_with_author AS
SELECT 
  p.*,
  pr.username,
  pr.full_name,
  pr.avatar_url,
  pr.level,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'like') as likes_count,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'bullish') as bullish_count,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'bearish') as bearish_count,
  (SELECT COUNT(*) FROM reactions WHERE post_id = p.id AND reaction_type = 'fire') as fire_count,
  (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
FROM posts p
JOIN profiles pr ON p.author_id = pr.id;

-- Vista: Rankings de traders
CREATE OR REPLACE VIEW trader_rankings AS
SELECT 
  p.id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.level,
  p.experience_points,
  po.total_invested,
  po.current_value,
  po.profit_loss_percentage,
  (SELECT COUNT(*) FROM follows WHERE following_id = p.id) as followers_count,
  (SELECT COUNT(*) FROM posts WHERE author_id = p.id) as posts_count,
  RANK() OVER (ORDER BY po.profit_loss_percentage DESC) as rank
FROM profiles p
LEFT JOIN portfolios po ON p.id = po.user_id AND po.is_public = true
WHERE p.show_portfolio = true
ORDER BY po.profit_loss_percentage DESC NULLS LAST;

-- Vista: Alertas populares
CREATE OR REPLACE VIEW popular_alerts AS
SELECT 
  a.coin_id,
  a.coin_symbol,
  a.target_price,
  a.condition,
  COUNT(*) as users_count,
  AVG(a.target_price) as avg_target_price,
  CASE 
    WHEN SUM(CASE WHEN a.condition = 'above' THEN 1 ELSE 0 END) > 
         SUM(CASE WHEN a.condition = 'below' THEN 1 ELSE 0 END)
    THEN 'bullish'
    ELSE 'bearish'
  END as sentiment
FROM alerts a
WHERE a.status = 'active'
GROUP BY a.coin_id, a.coin_symbol, a.target_price, a.condition
HAVING COUNT(*) >= 5
ORDER BY users_count DESC;

-- ============================================
-- SETUP COMPLETADO
-- ============================================

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '📊 Tables created: 11';
  RAISE NOTICE '🔒 RLS policies enabled';
  RAISE NOTICE '⚡ Triggers configured';
  RAISE NOTICE '🔔 Realtime enabled for key tables';
  RAISE NOTICE '';
  RAISE NOTICE '📝 Next steps:';
  RAISE NOTICE '1. Run seed-data.sql to populate initial badges';
  RAISE NOTICE '2. Configure Storage bucket for avatars';
  RAISE NOTICE '3. Setup email templates for notifications';
END $$;
