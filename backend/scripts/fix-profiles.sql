-- ============================================
-- VERIFICAR Y ARREGLAR SETUP DE SUPABASE
-- ============================================
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- 1. VERIFICAR SI EXISTE LA TABLA PROFILES
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'profiles'
);

-- Si devuelve "false", ejecuta todo lo de abajo
-- Si devuelve "true", salta al paso 2

-- ============================================
-- PASO 1: CREAR TABLA PROFILES (si no existe)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
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

-- ============================================
-- PASO 2: ELIMINAR TRIGGER ANTERIOR (si existe)
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- PASO 3: CREAR FUNCIÓN PARA AUTO-CREAR PERFIL
-- ============================================

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
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PASO 4: CREAR TRIGGER
-- ============================================

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PASO 5: HABILITAR RLS
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PASO 6: CREAR POLICIES
-- ============================================

-- Eliminar policies anteriores
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Crear nuevas policies
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PASO 7: VERIFICAR QUE TODO ESTÁ BIEN
-- ============================================

-- Esto debería devolver información de la tabla
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Esto debería devolver el trigger
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- LISTO! Ahora intenta registrarte de nuevo
-- ============================================
