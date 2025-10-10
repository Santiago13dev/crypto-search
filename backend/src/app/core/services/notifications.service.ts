import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationSubject = new Subject<any>();
  public notification$ = this.notificationSubject.asObservable();

  constructor(private supabase: SupabaseService) {
    this.subscribeToNotifications();
  }

  private subscribeToNotifications() {
    const user = this.supabase.currentUser;
    if (!user) return;

    this.supabase.client
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          this.notificationSubject.next(payload.new);
        }
      )
      .subscribe();
  }

  getNotifications(unreadOnly = false): Observable<any[]> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    let query = this.supabase.from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (unreadOnly) {
      query = query.eq('read', false);
    }

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  markAsRead(id: string): Observable<any> {
    return from(
      this.supabase.from('notifications')
        .update({ read: true })
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

  markAllAsRead(): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  deleteNotification(id: string): Observable<any> {
    return from(
      this.supabase.from('notifications').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  getUnreadCount(): Observable<number> {
    const user = this.supabase.currentUser;
    if (!user) return from([0]);

    return from(
      this.supabase.from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)
    ).pipe(
      map(({ count }) => count || 0)
    );
  }
}
