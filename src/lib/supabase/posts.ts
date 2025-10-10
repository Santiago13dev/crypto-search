import { supabase } from './client';

// Obtener posts (feed)
export async function getPosts(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const { data, error, count } = await supabase
    .from('posts_with_author')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  
  return { 
    posts: data || [], 
    error,
    pagination: {
      page,
      limit,
      total: count || 0
    }
  };
}

// Obtener posts por coin
export async function getPostsByCoin(coinId: string) {
  const { data, error } = await supabase
    .from('posts_with_author')
    .select('*')
    .eq('coin_id', coinId)
    .order('created_at', { ascending: false });
  
  return { posts: data || [], error };
}

// Obtener un post por ID
export async function getPostById(postId: string) {
  const { data, error } = await supabase
    .from('posts_with_author')
    .select('*')
    .eq('id', postId)
    .single();
  
  // Incrementar contador de vistas
  if (data) {
    await supabase.rpc('increment_post_views', { post_uuid: postId });
  }
  
  return { post: data, error };
}

// Crear post
export async function createPost(post: {
  coin_id: string;
  coin_symbol: string;
  title: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  target_price?: number;
  is_public?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...post,
      author_id: user.id
    })
    .select()
    .single();
  
  return { data, error };
}

// Actualizar post
export async function updatePost(postId: string, updates: any) {
  const { data, error } = await supabase
    .from('posts')
    .update(updates)
    .eq('id', postId)
    .select()
    .single();
  
  return { data, error };
}

// Eliminar post
export async function deletePost(postId: string) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);
  
  return { error };
}

// Reaccionar a un post
export async function reactToPost(postId: string, reactionType: 'like' | 'bullish' | 'bearish' | 'fire') {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('reactions')
    .upsert({
      post_id: postId,
      user_id: user.id,
      reaction_type: reactionType
    })
    .select()
    .single();
  
  return { data, error };
}

// Eliminar reacción
export async function removeReaction(postId: string, reactionType: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Not authenticated') };
  
  const { error } = await supabase
    .from('reactions')
    .delete()
    .match({
      post_id: postId,
      user_id: user.id,
      reaction_type: reactionType
    });
  
  return { error };
}

// Obtener comentarios de un post
export async function getComments(postId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles(*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  
  return { comments: data || [], error };
}

// Crear comentario
export async function createComment(postId: string, content: string, parentCommentId?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      author_id: user.id,
      content,
      parent_comment_id: parentCommentId
    })
    .select()
    .single();
  
  return { data, error };
}

// Suscribirse a nuevos posts en tiempo real
export function subscribeToNewPosts(callback: (post: any) => void) {
  const channel = supabase
    .channel('posts')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'posts' },
      (payload) => callback(payload.new)
    )
    .subscribe();
  
  return () => supabase.removeChannel(channel);
}
