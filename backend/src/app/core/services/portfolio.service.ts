import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CreatePortfolioDto {
  name: string;
  description?: string;
  is_public?: boolean;
}

export interface AddPortfolioItemDto {
  portfolio_id: string;
  coin_id: string;
  coin_symbol: string;
  amount: number;
  purchase_price: number;
  notes?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  constructor(private supabase: SupabaseService) {}

  getUserPortfolios(): Observable<any[]> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  getPortfolioById(id: string): Observable<any> {
    return from(
      this.supabase.from('portfolios')
        .select(`
          *,
          items:portfolio_items(*)
        `)
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  createPortfolio(portfolio: CreatePortfolioDto): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('portfolios')
        .insert({ ...portfolio, user_id: user.id })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  updatePortfolio(id: string, updates: Partial<CreatePortfolioDto>): Observable<any> {
    return from(
      this.supabase.from('portfolios')
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

  deletePortfolio(id: string): Observable<any> {
    return from(
      this.supabase.from('portfolios').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  addItem(item: AddPortfolioItemDto): Observable<any> {
    return from(
      this.supabase.from('portfolio_items')
        .insert(item)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  updateItem(id: string, updates: Partial<AddPortfolioItemDto>): Observable<any> {
    return from(
      this.supabase.from('portfolio_items')
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

  deleteItem(id: string): Observable<any> {
    return from(
      this.supabase.from('portfolio_items').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  getPublicPortfolio(userId: string): Observable<any> {
    return from(
      this.supabase.from('portfolios')
        .select(`
          *,
          items:portfolio_items(*),
          user:profiles(*)
        `)
        .eq('user_id', userId)
        .eq('is_public', true)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  getRankings(timeframe: string = 'all', limit = 50): Observable<any[]> {
    return from(
      this.supabase.from('trader_rankings')
        .select('*')
        .limit(limit)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }
}
