import { supabase } from './client';

// Obtener alertas del usuario
export async function getUserAlerts() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { alerts: [], error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  
  return { alerts: data || [], error };
}

// Crear alerta
export async function createAlert(alert: {
  coin_id: string;
  coin_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  message?: string;
  notify_email?: boolean;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Not authenticated') };
  
  const { data, error } = await supabase
    .from('alerts')
    .insert({
      ...alert,
      user_id: user.id
    })
    .select()
    .single();
  
  return { data, error };
}

// Actualizar alerta
export async function updateAlert(alertId: string, updates: any) {
  const { data, error } = await supabase
    .from('alerts')
    .update(updates)
    .eq('id', alertId)
    .select()
    .single();
  
  return { data, error };
}

// Eliminar alerta
export async function deleteAlert(alertId: string) {
  const { error } = await supabase
    .from('alerts')
    .delete()
    .eq('id', alertId);
  
  return { error };
}

// Cancelar alerta
export async function cancelAlert(alertId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ status: 'cancelled' })
    .eq('id', alertId)
    .select()
    .single();
  
  return { data, error };
}

// Obtener alertas populares
export async function getPopularAlerts() {
  const { data, error } = await supabase
    .from('popular_alerts')
    .select('*')
    .limit(20);
  
  return { alerts: data || [], error };
}

// Obtener alertas por coin
export async function getAlertsByCoin(coinId: string) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*')
    .eq('coin_id', coinId)
    .eq('status', 'active');
  
  return { alerts: data || [], error };
}
