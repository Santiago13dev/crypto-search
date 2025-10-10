'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/supabase/useAuth';
import { useRouter } from 'next/navigation';
import { getProfile, updateProfile, uploadAvatar, deleteAvatar } from '@/lib/supabase';
import { getFollowersCount, getFollowingCount } from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: '',
    twitter: '',
    telegram: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user, authLoading]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await getProfile(user.id);
    if (data) {
      setProfile(data);
      setFormData({
        username: data.username || '',
        full_name: data.full_name || '',
        bio: data.bio || '',
        website: data.website || '',
        twitter: data.twitter || '',
        telegram: data.telegram || ''
      });
    }
    setLoading(false);
  };

  const loadStats = async () => {
    if (!user) return;
    const { count: followers } = await getFollowersCount(user.id);
    const { count: following } = await getFollowingCount(user.id);
    setStats({ followers, following });
  };

  const handleSave = async () => {
    if (!user) return;
    
    const { error } = await updateProfile(user.id, formData);
    if (error) {
      toast.error('Error al actualizar perfil');
      return;
    }
    
    toast.success('¡Perfil actualizado!');
    setEditing(false);
    loadProfile();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen debe ser menor a 2MB');
      return;
    }

    setUploadingAvatar(true);

    try {
      const { error } = await uploadAvatar(user.id, file);
      
      if (error) throw error;
      
      toast.success('¡Avatar actualizado!');
      loadProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error al subir avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!user || !confirm('¿Eliminar foto de perfil?')) return;

    setUploadingAvatar(true);

    try {
      const { error } = await deleteAvatar(user.id);
      
      if (error) throw error;
      
      toast.success('Avatar eliminado');
      loadProfile();
    } catch (error: any) {
      toast.error(error.message || 'Error al eliminar avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">👤</div>
          <p className="text-primary">&gt; Cargando perfil...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-primary font-mono pb-20">
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary bg-background/80 backdrop-blur-sm p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              {/* Avatar with upload */}
              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                
                <div 
                  onClick={handleAvatarClick}
                  className="w-24 h-24 border-2 border-primary flex items-center justify-center text-4xl font-bold cursor-pointer overflow-hidden relative"
                >
                  {uploadingAvatar ? (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <div className="animate-spin">⚡</div>
                    </div>
                  ) : profile?.avatar_url ? (
                    <>
                      <Image
                        src={profile.avatar_url}
                        alt="Avatar"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-sm">
                        CAMBIAR
                      </div>
                    </>
                  ) : (
                    <>
                      {profile?.username?.[0]?.toUpperCase() || 'U'}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
                        SUBIR
                      </div>
                    </>
                  )}
                </div>

                {profile?.avatar_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAvatar();
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 border-2 border-red-500 bg-background text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-black transition-all text-xs"
                    disabled={uploadingAvatar}
                  >
                    ✕
                  </button>
                )}
              </div>
              
              <div>
                <h1 className="text-3xl font-bold tracking-wider">&gt; {profile?.username}</h1>
                {profile?.full_name && (
                  <p className="text-lg opacity-70 mt-1">{profile.full_name}</p>
                )}
                <div className="flex gap-6 mt-3 font-mono">
                  <div>
                    <span className="font-bold text-xl">{stats.followers}</span>
                    <span className="ml-1 opacity-70 text-sm">FOLLOWERS</span>
                  </div>
                  <div>
                    <span className="font-bold text-xl">{stats.following}</span>
                    <span className="ml-1 opacity-70 text-sm">FOLLOWING</span>
                  </div>
                  <div>
                    <span className="font-bold text-xl">LVL_{profile?.level || 1}</span>
                    <span className="ml-1 opacity-70 text-sm">({profile?.experience_points || 0} XP)</span>
                  </div>
                </div>
              </div>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="border-2 border-primary px-6 py-2 hover:bg-primary hover:text-background transition-all font-bold"
              >
                ✏️ EDIT
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false);
                    loadProfile();
                  }}
                  className="border-2 border-primary px-4 py-2 hover:bg-primary/20 transition-all font-bold"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  className="border-2 border-primary px-6 py-2 bg-primary text-background hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all font-bold"
                >
                  SAVE
                </button>
              </div>
            )}
          </div>

          <div className="border-t-2 border-primary/30 pt-4">
            <p className="text-xs opacity-70 mb-2">XP_PROGRESS</p>
            <div className="h-4 border-2 border-primary">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${((profile?.experience_points || 0) % 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="border-2 border-primary bg-background/80 backdrop-blur-sm p-8"
        >
          {!editing ? (
            <div className="space-y-6">
              {profile?.bio && (
                <div>
                  <h3 className="text-sm font-bold opacity-70 mb-2">// BIO</h3>
                  <p className="opacity-90">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-primary/30 pt-6">
                {profile?.website && (
                  <div>
                    <h3 className="text-sm font-bold opacity-70 mb-2">// WEBSITE</h3>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline break-all"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}

                {profile?.twitter && (
                  <div>
                    <h3 className="text-sm font-bold opacity-70 mb-2">// TWITTER</h3>
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{profile.twitter}
                    </a>
                  </div>
                )}

                {profile?.telegram && (
                  <div>
                    <h3 className="text-sm font-bold opacity-70 mb-2">// TELEGRAM</h3>
                    <a
                      href={`https://t.me/${profile.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @{profile.telegram}
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t-2 border-primary/30 pt-6">
                <h3 className="text-lg font-bold mb-4">⚙️ SETTINGS</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border-2 border-primary/30">
                    <div>
                      <p className="font-bold">PUBLIC_PROFILE</p>
                      <p className="text-xs opacity-70">Visible to other users</p>
                    </div>
                    <span className={`border-2 px-3 py-1 text-sm font-bold ${
                      profile?.is_public 
                        ? 'border-green-500 text-green-500' 
                        : 'border-red-500 text-red-500'
                    }`}>
                      {profile?.is_public ? '✓ ON' : '✗ OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-primary/30">
                    <div>
                      <p className="font-bold">SHOW_PORTFOLIO</p>
                      <p className="text-xs opacity-70">Portfolio visibility</p>
                    </div>
                    <span className={`border-2 px-3 py-1 text-sm font-bold ${
                      profile?.show_portfolio 
                        ? 'border-green-500 text-green-500' 
                        : 'border-red-500 text-red-500'
                    }`}>
                      {profile?.show_portfolio ? '✓ ON' : '✗ OFF'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 border-2 border-primary/30">
                    <div>
                      <p className="font-bold">EMAIL_NOTIFICATIONS</p>
                      <p className="text-xs opacity-70">Receive alerts and updates</p>
                    </div>
                    <span className={`border-2 px-3 py-1 text-sm font-bold ${
                      profile?.email_notifications 
                        ? 'border-green-500 text-green-500' 
                        : 'border-red-500 text-red-500'
                    }`}>
                      {profile?.email_notifications ? '✓ ON' : '✗ OFF'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-bold opacity-70 mb-2">// USERNAME</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                  placeholder="tu_username"
                />
              </div>

              <div>
                <label className="block text-sm font-bold opacity-70 mb-2">// FULL_NAME</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                  placeholder="Tu Nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-bold opacity-70 mb-2">// BIO</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-background border-2 border-primary px-4 py-3 h-24 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all resize-none"
                  placeholder="Cuéntanos sobre ti..."
                  maxLength={500}
                />
                <p className="text-xs opacity-70 mt-1">{formData.bio.length}/500</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2">// WEBSITE</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                    placeholder="https://tuweb.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2">// TWITTER</label>
                  <input
                    type="text"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                    placeholder="tu_usuario"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold opacity-70 mb-2">// TELEGRAM</label>
                  <input
                    type="text"
                    value={formData.telegram}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                    className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                    placeholder="tu_usuario"
                  />
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </main>
  );
}
