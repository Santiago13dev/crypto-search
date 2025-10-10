'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp, signInWithGoogle, signInWithGithub } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: ''
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn({
          email: formData.email,
          password: formData.password
        });
        
        if (error) throw error;
        
        toast.success('¡Bienvenido de nuevo!');
        router.push('/');
      } else {
        const { error } = await signUp({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          full_name: formData.full_name
        });
        
        if (error) throw error;
        
        toast.success('¡Cuenta creada!');
        router.push('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'Algo salió mal');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const { error } = await signInWithGithub();
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-background text-primary flex items-center justify-center p-4 font-mono">
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative border-4 border-primary bg-background p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl mb-4"
          >
            ⚡
          </motion.div>
          <h1 className="text-3xl font-bold tracking-wider mb-2">
            &gt; CRYPTO_TERMINAL
          </h1>
          <p className="opacity-70 text-sm">
            // {isLogin ? 'INICIAR_SESIÓN' : 'CREAR_CUENTA'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm mb-2 opacity-70">// USERNAME</label>
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all"
                  placeholder="tu_username"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 opacity-70">// FULL_NAME (opcional)</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all"
                  placeholder="Tu Nombre"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm mb-2 opacity-70">// EMAIL</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-70">// PASSWORD</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border-2 border-primary bg-primary text-background py-3 font-bold tracking-wider hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESANDO...' : (isLogin ? 'LOGIN' : 'REGISTER')}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-primary/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background opacity-70">O_CONTINUAR_CON</span>
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleGoogleLogin}
            className="border-2 border-primary px-4 py-3 hover:bg-primary hover:text-background transition-all flex items-center justify-center gap-2 font-bold"
          >
            <span>G</span>
            GOOGLE
          </button>

          <button
            onClick={handleGithubLogin}
            className="border-2 border-primary px-4 py-3 hover:bg-primary hover:text-background transition-all flex items-center justify-center gap-2 font-bold"
          >
            <span>GH</span>
            GITHUB
          </button>
        </div>

        {/* Toggle */}
        <div className="mt-6 text-center border-t-2 border-primary/30 pt-6">
          <p className="opacity-70 text-sm mb-2">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="border-2 border-primary px-6 py-2 hover:bg-primary hover:text-background transition-all font-bold"
          >
            {isLogin ? 'CREAR_CUENTA' : 'INICIAR_SESIÓN'}
          </button>
        </div>
      </motion.div>
    </main>
  );
}
