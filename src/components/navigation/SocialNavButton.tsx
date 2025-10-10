'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/supabase/useAuth';
import { signOut, getProfile } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SocialNavButton() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await getProfile(user.id);
    setProfile(data);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Sesión cerrada');
    router.push('/');
    setShowMenu(false);
  };

  if (pathname === '/auth') return null;

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth"
        className="fixed top-20 right-4 z-40 border-2 border-primary bg-background text-primary px-6 py-3 font-mono font-bold hover:bg-primary hover:text-background transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]"
      >
        &gt; LOGIN
      </Link>
    );
  }

  const menuItems = [
    { label: 'RED_SOCIAL', href: '/social', icon: '🌐' },
    { label: 'PORTFOLIO', href: '/portfolio', icon: '💼' },
    { label: 'ALERTAS', href: '/alerts', icon: '🔔' },
    { label: 'PERFIL', href: '/profile', icon: '👤' },
  ];

  return (
    <div ref={menuRef} className="fixed top-20 right-4 z-40">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="border-2 border-primary bg-background hover:bg-primary hover:text-background transition-all duration-300 shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)] group"
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Avatar */}
          <div className="w-8 h-8 border border-primary overflow-hidden flex items-center justify-center font-mono font-bold text-sm">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={32}
                height={32}
                className="object-cover w-full h-full"
              />
            ) : (
              <span>{profile?.username?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>
          
          {/* Username */}
          <span className="font-mono font-bold text-sm hidden sm:block">
            {profile?.username || 'USER'}
          </span>
          
          {/* Indicator */}
          <motion.div
            animate={{ rotate: showMenu ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="font-mono font-bold"
          >
            ▼
          </motion.div>
        </div>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 w-64 border-2 border-primary bg-background shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]"
          >
            {/* User Info */}
            <div className="p-4 border-b-2 border-primary/30">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 border border-primary overflow-hidden flex items-center justify-center font-mono font-bold">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt="Avatar"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xl">{profile?.username?.[0]?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-sm truncate">{profile?.username}</p>
                  <p className="font-mono text-xs opacity-70 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono opacity-70">
                <span>LVL_{profile?.level || 1}</span>
                <span>•</span>
                <span>{profile?.experience_points || 0} XP</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 font-mono text-sm transition-colors ${
                    pathname === item.href
                      ? 'bg-primary text-background'
                      : 'hover:bg-primary/20'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Logout */}
            <div className="border-t-2 border-primary/30 p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 font-mono text-sm font-bold border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all"
              >
                <span className="text-lg">✕</span>
                <span>CERRAR_SESIÓN</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
