import { supabase } from './client';

// Obtener portfolios del usuario
export async function getUserPortfolios() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { portfolios: [], error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  return { portfolios: data || [], error };
}

// Obtener portfolio con items
export async function getPortfolioWithItems(portfolioId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      *,
      items:portfolio_items(*)
    `)
    .eq('id', portfolioId)
    .single();
  
  return { portfolio: data, error };
}

// Crear portfolio
export async function createPortfolio(portfolio: {
  name: string;
  description?: string;
  is_public?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('portfolios')
    .insert({
      ...portfolio,
      user_id: user.id
    })
    .select()
    .single();
  
  return { data, error };
}

// Actualizar portfolio
export async function updatePortfolio(portfolioId: string, updates: any) {
  const { data, error } = await supabase
    .from('portfolios')
    .update(updates)
    .eq('id', portfolioId)
    .select()
    .single();
  
  return { data, error };
}

// Eliminar portfolio
export async function deletePortfolio(portfolioId: string) {
  const { error } = await supabase
    .from('portfolios')
    .delete()
    .eq('id', portfolioId);
  
  return { error };
}

// Agregar item al portfolio
export async function addPortfolioItem(item: {
  portfolio_id: string;
  coin_id: string;
  coin_symbol: string;
  amount: number;
  purchase_price: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert(item)
    .select()
    .single();
  
  return { data, error };
}

// Actualizar item del portfolio
export async function updatePortfolioItem(itemId: string, updates: any) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(updates)
    .eq('id', itemId)
    .select()
    .single();
  
  return { data, error };
}

// Eliminar item del portfolio
export async function deletePortfolioItem(itemId: string) {
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', itemId);
  
  return { error };
}

// Obtener portfolio público de otro usuario
export async function getPublicPortfolio(userId: string) {
  const { data, error } = await supabase
    .from('portfolios')
    .select(`
      *,
      items:portfolio_items(*),
      user:profiles(*)
    `)
    .eq('user_id', userId)
    .eq('is_public', true)
    .single();
  
  return { portfolio: data, error };
}

// Obtener rankings de traders
export async function getTraderRankings(limit = 50) {
  const { data, error } = await supabase
    .from('trader_rankings')
    .select('*')
    .limit(limit);
  
  return { rankings: data || [], error };
}
