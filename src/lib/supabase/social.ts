import { supabase } from './client';

// Seguir usuario
export async function followUser(userId: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('follows')
    .insert({
      follower_id: currentUser.id,
      following_id: userId
    })
    .select()
    .single();
  
  return { data, error };
}

// Dejar de seguir
export async function unfollowUser(userId: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return { error: new Error('Not authenticated') };
  
  const { error } = await supabase
    .from('follows')
    .delete()
    .match({
      follower_id: currentUser.id,
      following_id: userId
    });
  
  return { error };
}

// Obtener seguidores
export async function getFollowers(userId?: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const targetUserId = userId || currentUser?.id;
  
  if (!targetUserId) return { followers: [], error: new Error('No user ID') };
  
  const { data, error } = await supabase
    .from('follows')
    .select('*, follower:profiles!follower_id(*)')
    .eq('following_id', targetUserId);
  
  return { followers: data || [], error };
}

// Obtener seguidos
export async function getFollowing(userId?: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const targetUserId = userId || currentUser?.id;
  
  if (!targetUserId) return { following: [], error: new Error('No user ID') };
  
  const { data, error } = await supabase
    .from('follows')
    .select('*, following:profiles!following_id(*)')
    .eq('follower_id', targetUserId);
  
  return { following: data || [], error };
}

// Verificar si sigue a un usuario
export async function isFollowing(userId: string) {
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  if (!currentUser) return { isFollowing: false, error: null };
  
  const { data, error } = await supabase
    .from('follows')
    .select('id')
    .match({
      follower_id: currentUser.id,
      following_id: userId
    })
    .single();
  
  return { isFollowing: !!data, error };
}

// Obtener contador de seguidores
export async function getFollowersCount(userId: string) {
  const { count, error } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('following_id', userId);
  
  return { count: count || 0, error };
}

// Obtener contador de seguidos
export async function getFollowingCount(userId: string) {
  const { count, error } = await supabase
    .from('follows')
    .select('id', { count: 'exact', head: true })
    .eq('follower_id', userId);
  
  return { count: count || 0, error };
}
