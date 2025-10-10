import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  constructor(private supabase: SupabaseService) {}

  followUser(userId: string): Observable<any> {
    const currentUser = this.supabase.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    return from(
      this.supabase.from('follows')
        .insert({
          follower_id: currentUser.id,
          following_id: userId
        })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  unfollowUser(userId: string): Observable<any> {
    const currentUser = this.supabase.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    return from(
      this.supabase.from('follows')
        .delete()
        .match({
          follower_id: currentUser.id,
          following_id: userId
        })
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  getFollowers(userId?: string): Observable<any[]> {
    const targetUserId = userId || this.supabase.currentUser?.id;
    if (!targetUserId) throw new Error('No user ID provided');

    return from(
      this.supabase.from('follows')
        .select('*, follower:profiles!follower_id(*)')
        .eq('following_id', targetUserId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  getFollowing(userId?: string): Observable<any[]> {
    const targetUserId = userId || this.supabase.currentUser?.id;
    if (!targetUserId) throw new Error('No user ID provided');

    return from(
      this.supabase.from('follows')
        .select('*, following:profiles!following_id(*)')
        .eq('follower_id', targetUserId)
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  isFollowing(userId: string): Observable<boolean> {
    const currentUser = this.supabase.currentUser;
    if (!currentUser) return from([false]);

    return from(
      this.supabase.from('follows')
        .select('id')
        .match({
          follower_id: currentUser.id,
          following_id: userId
        })
        .single()
    ).pipe(
      map(({ data }) => !!data)
    );
  }

  getFollowersCount(userId: string): Observable<number> {
    return from(
      this.supabase.from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('following_id', userId)
    ).pipe(
      map(({ count }) => count || 0)
    );
  }

  getFollowingCount(userId: string): Observable<number> {
    return from(
      this.supabase.from('follows')
        .select('id', { count: 'exact', head: true })
        .eq('follower_id', userId)
    ).pipe(
      map(({ count }) => count || 0)
    );
  }
}
