import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CreateAlertDto {
  coin_id: string;
  coin_symbol: string;
  target_price: number;
  condition: 'above' | 'below';
  message?: string;
  notify_email?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  constructor(private supabase: SupabaseService) {}

  getUserAlerts(): Observable<any[]> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  createAlert(alert: CreateAlertDto): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('alerts')
        .insert({ ...alert, user_id: user.id })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  updateAlert(id: string, updates: Partial<CreateAlertDto>): Observable<any> {
    return from(
      this.supabase.from('alerts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  deleteAlert(id: string): Observable<any> {
    return from(
      this.supabase.from('alerts').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  cancelAlert(id: string): Observable<any> {
    return from(
      this.supabase.from('alerts')
        .update({ status: 'cancelled' })
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  getPopularAlerts(): Observable<any[]> {
    return from(
      this.supabase.from('popular_alerts')
        .select('*')
        .limit(20)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  getAlertsByCoin(coinId: string): Observable<any[]> {
    return from(
      this.supabase.from('alerts')
        .select('*')
        .eq('coin_id', coinId)
        .eq('status', 'active')
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }
}
