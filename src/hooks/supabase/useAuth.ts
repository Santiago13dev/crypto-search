'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from '@/lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener usuario actual
    getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
