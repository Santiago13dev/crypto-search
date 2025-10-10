-- ============================================
-- SEED DATA - Datos Iniciales
-- ============================================

INSERT INTO badges (name, description, icon, xp_reward, requirement_type, requirement_value) VALUES
  ('First Post', 'Publicaste tu primer análisis crypto', '📝', 100, 'posts_count', 1),
  ('Regular Analyst', 'Publicaste 10 análisis', '📊', 250, 'posts_count', 10),
  ('Crypto Guru', 'Publicaste 50 análisis', '🧙', 1000, 'posts_count', 50),
  ('Social Butterfly', 'Alcanzaste 10 seguidores', '🦋', 200, 'followers_count', 10),
  ('Influencer', 'Alcanzaste 100 seguidores', '⭐', 1000, 'followers_count', 100),
  ('Popular Post', 'Tu post recibió 50 likes', '🔥', 300, 'post_likes', 50),
  ('Pro Trader', 'Tu portfolio ganó más del 50%', '🚀', 500, 'portfolio_profit', 50),
  ('Diamond Hands', 'Mantuviste inversiones por más de 1 año', '💎', 750, 'holding_time', 365),
  ('Alert Master', 'Tienes 10 alertas activas', '🎯', 200, 'alerts_count', 10);
