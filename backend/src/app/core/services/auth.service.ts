import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  full_name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.checkAuth();
  }

  private async checkAuth() {
    const { data: { session } } = await this.supabase.auth.getSession();
    this.isAuthenticatedSubject.next(!!session);
  }

  register(data: RegisterData): Observable<any> {
    return from(
      this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name
          }
        }
      })
    ).pipe(
      tap(({ data, error }) => {
        if (error) throw error;
        if (data.session) {
          this.isAuthenticatedSubject.next(true);
        }
      })
    );
  }

  login(credentials: LoginCredentials): Observable<any> {
    return from(
      this.supabase.auth.signInWithPassword(credentials)
    ).pipe(
      tap(({ data, error }) => {
        if (error) throw error;
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  async loginWithGoogle() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google'
    });
    if (error) throw error;
  }

  async loginWithGithub() {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'github'
    });
    if (error) throw error;
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getProfile(): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('No user logged in');

    return from(
      this.supabase.from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  updateProfile(updates: any): Observable<any> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('No user logged in');

    return from(
      this.supabase.from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data;
      })
    );
  }

  async uploadAvatar(file: File): Promise<string> {
    const user = this.supabase.currentUser;
    if (!user) throw new Error('No user logged in');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = this.supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  }
}
