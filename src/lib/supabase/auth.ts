import { supabase } from './client';

// Tipos de autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  full_name?: string;
}

// Registro de usuario
export async function signUp(data: RegisterData) {
  const { email, password, username, full_name } = data;
  
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        full_name: full_name || ''
      }
    }
  });
  
  return { data: authData, error };
}

// Login
export async function signIn(credentials: LoginCredentials) {
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  return { data, error };
}

// Login con Google
export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
}

// Login con GitHub
export async function signInWithGithub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
}

// Logout
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// Obtener usuario actual
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// Obtener sesión actual
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

// Obtener perfil del usuario
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data, error };
}

// Actualizar perfil
export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data, error };
}

// Subir avatar
export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  // Subir imagen
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { 
      upsert: true,
      contentType: file.type
    });

  if (uploadError) {
    return { data: null, error: uploadError };
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Actualizar perfil con nueva URL
  const { data, error } = await updateProfile(userId, { avatar_url: publicUrl });

  return { data: publicUrl, error };
}

// Eliminar avatar
export async function deleteAvatar(userId: string) {
  // Listar todos los archivos del usuario
  const { data: files } = await supabase.storage
    .from('avatars')
    .list(userId);

  if (files && files.length > 0) {
    // Eliminar todos los avatares del usuario
    const filesToRemove = files.map(file => `${userId}/${file.name}`);
    
    const { error } = await supabase.storage
      .from('avatars')
      .remove(filesToRemove);

    if (error) return { error };
  }

  // Actualizar perfil para remover URL
  const { error } = await updateProfile(userId, { avatar_url: null });

  return { error };
}

// Escuchar cambios de autenticación
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
