'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/supabase/useAuth';
import { getPosts, createPost, reactToPost, subscribeToNewPosts } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SocialPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadPosts();
      const unsubscribe = subscribeToNewPosts((newPost) => {
        toast.success('¡Nuevo post disponible!');
        loadPosts();
      });
      return () => unsubscribe();
    }
  }, [user, authLoading]);

  const loadPosts = async () => {
    const { posts: data } = await getPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleReact = async (postId: string, type: 'like' | 'bullish' | 'bearish' | 'fire') => {
    await reactToPost(postId, type);
    await loadPosts();
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">⚡</div>
          <p className="text-primary">&gt; Cargando feed...</p>
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

      <div className="relative max-w-5xl mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary p-6 mb-8 bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📡</span>
              <div>
                <h1 className="text-2xl font-bold tracking-wider">&gt; FEED_DE_CRYPTO</h1>
                <p className="text-sm opacity-70 mt-1">// Red Social Descentralizada</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="border-2 border-primary px-6 py-3 hover:bg-primary hover:text-background transition-all duration-300 font-bold tracking-wider"
            >
              + CREAR_POST
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t-2 border-primary/30">
            <div>
              <p className="text-xs opacity-70">TOTAL_POSTS</p>
              <p className="text-2xl font-bold">{posts.length}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">USUARIO</p>
              <p className="text-xl font-bold truncate">{user?.email?.split('@')[0]}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">STATUS</p>
              <p className="text-xl font-bold text-green-500">● ONLINE</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard post={post} onReact={handleReact} />
              </motion.div>
            ))}
          </AnimatePresence>

          {posts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-2 border-primary/30 p-12 text-center"
            >
              <p className="text-xl opacity-70 mb-2">&gt; NO_DATA_FOUND</p>
              <p className="text-sm opacity-50">// Sé el primero en compartir análisis</p>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCreatePost && (
          <CreatePostModal
            onClose={() => setShowCreatePost(false)}
            onSuccess={() => {
              setShowCreatePost(false);
              loadPosts();
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function PostCard({ post, onReact }: any) {
  const sentimentColors: any = {
    bullish: 'text-green-500 border-green-500',
    bearish: 'text-red-500 border-red-500',
    neutral: 'text-primary border-primary'
  };

  const sentimentIcons: any = {
    bullish: '📈',
    bearish: '📉',
    neutral: '➡️'
  };

  return (
    <div className="border-2 border-primary bg-background/80 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] transition-all duration-300">
      <div className="border-b-2 border-primary/30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary flex items-center justify-center font-bold text-xl overflow-hidden">
            {post.avatar_url ? (
              <Image
                src={post.avatar_url}
                alt={post.username}
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              post.username?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div>
            <p className="font-bold text-lg">&gt; {post.username || 'Anonymous'}</p>
            <p className="text-sm opacity-70">{post.coin_symbol}</p>
          </div>
        </div>
        <div className={`border-2 px-3 py-1 ${sentimentColors[post.sentiment]}`}>
          <span className="mr-2">{sentimentIcons[post.sentiment]}</span>
          <span className="font-bold text-sm">{post.sentiment.toUpperCase()}</span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold mb-3 tracking-wide">// {post.title}</h2>
        <p className="opacity-90 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {post.target_price && (
          <div className="mt-4 border-2 border-primary/30 p-3 inline-block">
            <span className="text-sm opacity-70">TARGET_PRICE: </span>
            <span className="font-bold text-xl">${post.target_price.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="border-t-2 border-primary/30 p-4 flex items-center gap-2">
        <button
          onClick={() => onReact(post.id, 'like')}
          className="border-2 border-primary/30 px-4 py-2 hover:bg-primary hover:text-background transition-all duration-200 flex items-center gap-2"
        >
          <span>👍</span>
          <span className="font-mono font-bold">{post.likes_count || 0}</span>
        </button>
        <button
          onClick={() => onReact(post.id, 'bullish')}
          className="border-2 border-green-500/50 px-4 py-2 hover:bg-green-500 hover:text-black transition-all duration-200 flex items-center gap-2"
        >
          <span>📈</span>
          <span className="font-mono font-bold">{post.bullish_count || 0}</span>
        </button>
        <button
          onClick={() => onReact(post.id, 'bearish')}
          className="border-2 border-red-500/50 px-4 py-2 hover:bg-red-500 hover:text-black transition-all duration-200 flex items-center gap-2"
        >
          <span>📉</span>
          <span className="font-mono font-bold">{post.bearish_count || 0}</span>
        </button>
        <button
          onClick={() => onReact(post.id, 'fire')}
          className="border-2 border-orange-500/50 px-4 py-2 hover:bg-orange-500 hover:text-black transition-all duration-200 flex items-center gap-2"
        >
          <span>🔥</span>
          <span className="font-mono font-bold">{post.fire_count || 0}</span>
        </button>
        <div className="ml-auto opacity-70 font-mono">
          💬 {post.comments_count || 0}
        </div>
      </div>
    </div>
  );
}

function CreatePostModal({ onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    coin_id: '',
    coin_symbol: '',
    title: '',
    content: '',
    sentiment: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    target_price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await createPost({
        coin_id: formData.coin_id.toLowerCase(),
        coin_symbol: formData.coin_symbol.toUpperCase(),
        title: formData.title,
        content: formData.content,
        sentiment: formData.sentiment,
        target_price: formData.target_price ? parseFloat(formData.target_price) : undefined,
        is_public: true
      });

      if (error) throw error;

      toast.success('¡Post creado!');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Error al crear post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-mono"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="border-4 border-primary bg-background p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-primary/30">
          <h2 className="text-2xl font-bold">&gt; CREAR_NUEVO_POST</h2>
          <button
            onClick={onClose}
            className="border-2 border-primary px-4 py-2 hover:bg-primary hover:text-background transition-all"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">// COIN_ID</label>
              <input
                type="text"
                required
                value={formData.coin_id}
                onChange={(e) => setFormData({ ...formData, coin_id: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="bitcoin"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">// SYMBOL</label>
              <input
                type="text"
                required
                value={formData.coin_symbol}
                onChange={(e) => setFormData({ ...formData, coin_symbol: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="BTC"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-70">// TITULO</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
              placeholder="Bitcoin alcanzará $100k"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 opacity-70">// CONTENIDO</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 h-32 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all resize-none"
              placeholder="Comparte tu análisis..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">// SENTIMENT</label>
              <select
                value={formData.sentiment}
                onChange={(e) => setFormData({ ...formData, sentiment: e.target.value as any })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
              >
                <option value="bullish">📈 BULLISH</option>
                <option value="bearish">📉 BEARISH</option>
                <option value="neutral">➡️ NEUTRAL</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">// TARGET_PRICE</label>
              <input
                type="number"
                value={formData.target_price}
                onChange={(e) => setFormData({ ...formData, target_price: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="100000"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-primary px-6 py-3 hover:bg-primary/20 transition-all font-bold"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 border-2 border-primary px-6 py-3 bg-primary text-background hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all font-bold disabled:opacity-50"
            >
              {loading ? 'PUBLICANDO...' : 'PUBLICAR'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
