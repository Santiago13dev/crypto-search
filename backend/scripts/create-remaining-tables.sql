-- ============================================
-- CREAR TABLAS RESTANTES
-- ============================================

-- Posts
CREATE TABLE IF NOT EXISTS posts (
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

CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_coin ON posts(coin_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);

-- Comments
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);

-- Reactions
CREATE TYPE reaction_type AS ENUM ('like', 'bullish', 'bearish', 'fire');

CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type reaction_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE INDEX idx_reactions_post ON reactions(post_id);

-- Portfolios
CREATE TABLE IF NOT EXISTS portfolios (
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_portfolios_user ON portfolios(user_id);

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
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

CREATE INDEX idx_portfolio_items_portfolio ON portfolio_items(portfolio_id);

-- Alerts
CREATE TYPE alert_condition AS ENUM ('above', 'below');
CREATE TYPE alert_status AS ENUM ('active', 'triggered', 'cancelled');

CREATE TABLE IF NOT EXISTS alerts (
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

CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_coin ON alerts(coin_id);

-- Follows
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- ============================================
-- RLS POLICIES
-- ============================================

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Posts viewable by everyone"
  ON posts FOR SELECT
  USING (is_public = true OR auth.uid() = author_id);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Comments policies
CREATE POLICY "Comments viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Reactions policies
CREATE POLICY "Reactions viewable by everyone"
  ON reactions FOR SELECT
  USING (true);

CREATE POLICY "Users can create reactions"
  ON reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
  ON reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Portfolios policies
CREATE POLICY "Portfolios viewable"
  ON portfolios FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolios"
  ON portfolios FOR ALL
  USING (auth.uid() = user_id);

-- Portfolio items policies
CREATE POLICY "Portfolio items viewable"
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

-- Alerts policies
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts"
  ON alerts FOR ALL
  USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows viewable by everyone"
  ON follows FOR SELECT
  USING (true);

CREATE POLICY "Users can follow"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- VISTAS
-- ============================================

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
HAVING COUNT(*) >= 3
ORDER BY users_count DESC;

-- ============================================
-- FUNCIONES
-- ============================================

CREATE OR REPLACE FUNCTION increment_post_views(post_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET views_count = views_count + 1
  WHERE id = post_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
