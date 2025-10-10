import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CreatePostDto {
  coin_id: string;
  coin_symbol: string;
  title: string;
  content: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  target_price?: number;
  is_public?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private supabase: SupabaseService) {}

  getPosts(page = 1, limit = 20, filters?: any): Observable<any> {
    const offset = (page - 1) * limit;
    let query = this.supabase.from('posts_with_author')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filters?.coin_id) {
      query = query.eq('coin_id', filters.coin_id);
    }

    if (filters?.sentiment) {
      query = query.eq('sentiment', filters.sentiment);
    }

    return from(query).pipe(
      map(({ data, error, count }) => {
        if (error) throw error;
        return {
          posts: data,
          pagination: { page, limit, total: count || 0 }
        };
      })
    );
  }

  getPostById(id: string): Observable<any> {
    return from(
      this.supabase.from('posts_with_author')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        this.incrementViews(id);
        return data;
      })
    );
  }

  createPost(post: CreatePostDto): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('posts')
        .insert({ ...post, author_id: user.id })
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  updatePost(id: string, updates: Partial<CreatePostDto>): Observable<any> {
    return from(
      this.supabase.from('posts')
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

  deletePost(id: string): Observable<any> {
    return from(
      this.supabase.from('posts').delete().eq('id', id)
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  reactToPost(postId: string, reactionType: string): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('reactions')
        .upsert({
          post_id: postId,
          user_id: user.id,
          reaction_type: reactionType
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

  removeReaction(postId: string, reactionType: string): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('reactions')
        .delete()
        .match({ post_id: postId, user_id: user.id, reaction_type: reactionType })
    ).pipe(
      map(({ error }) => {
        if (error) throw error;
        return { success: true };
      })
    );
  }

  getComments(postId: string): Observable<any[]> {
    return from(
      this.supabase.from('comments')
        .select('*, author:profiles(*)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data || [];
      })
    );
  }

  createComment(postId: string, content: string, parentCommentId?: string): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('Not authenticated');

    return from(
      this.supabase.from('comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          parent_comment_id: parentCommentId
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

  private async incrementViews(postId: string) {
    await this.supabase.rpc('increment_post_views', { post_uuid: postId });
  }
}
