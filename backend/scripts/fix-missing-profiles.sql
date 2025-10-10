-- ============================================
-- ARREGLAR USUARIOS SIN PERFIL
-- ============================================

-- Paso 1: Ver si hay usuarios sin perfil
SELECT u.id, u.email 
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;

-- Paso 2: Crear perfiles para usuarios existentes sin perfil
INSERT INTO public.profiles (id, username, full_name, avatar_url)
SELECT 
  u.id,
  COALESCE(u.raw_user_meta_data->>'username', 'user_' || substr(u.id::text, 1, 8)),
  COALESCE(u.raw_user_meta_data->>'full_name', ''),
  COALESCE(u.raw_user_meta_data->>'avatar_url', '')
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Paso 3: Verificar que todos los usuarios tienen perfil
SELECT COUNT(*) as total_users FROM auth.users;
SELECT COUNT(*) as total_profiles FROM public.profiles;

-- Si los números coinciden, está todo bien
