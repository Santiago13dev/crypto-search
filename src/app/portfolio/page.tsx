'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/supabase/useAuth';
import { useRouter } from 'next/navigation';
import { 
  getUserPortfolios, 
  createPortfolio, 
  addPortfolioItem,
  deletePortfolioItem,
  getPortfolioWithItems 
} from '@/lib/supabase';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showAddCoin, setShowAddCoin] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
      return;
    }

    if (user) {
      loadPortfolios();
    }
  }, [user, authLoading]);

  const loadPortfolios = async () => {
    const { portfolios: data } = await getUserPortfolios();
    setPortfolios(data);
    if (data.length > 0 && !selectedPortfolio) {
      loadPortfolioDetails(data[0].id);
    }
    setLoading(false);
  };

  const loadPortfolioDetails = async (portfolioId: string) => {
    const { portfolio } = await getPortfolioWithItems(portfolioId);
    setSelectedPortfolio(portfolio);
  };

  const handleCreatePortfolio = async (name: string, isPublic: boolean) => {
    const { error } = await createPortfolio({ name, is_public: isPublic });
    if (error) {
      toast.error('Error al crear portfolio');
      return;
    }
    toast.success('Portfolio creado!');
    setShowCreatePortfolio(false);
    loadPortfolios();
  };

  const handleAddCoin = async (coinData: any) => {
    if (!selectedPortfolio) return;
    
    const { error } = await addPortfolioItem({
      portfolio_id: selectedPortfolio.id,
      ...coinData
    });
    
    if (error) {
      toast.error('Error al agregar crypto');
      return;
    }
    
    toast.success('Crypto agregada!');
    setShowAddCoin(false);
    loadPortfolioDetails(selectedPortfolio.id);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('¿Eliminar esta crypto del portfolio?')) return;
    
    const { error } = await deletePortfolioItem(itemId);
    if (error) {
      toast.error('Error al eliminar');
      return;
    }
    
    toast.success('Crypto eliminada');
    loadPortfolioDetails(selectedPortfolio.id);
  };

  if (authLoading || loading) {
    return (
      <main className="min-h-screen bg-background text-primary flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-pulse">💼</div>
          <p className="text-primary">&gt; Cargando portfolio...</p>
        </div>
      </main>
    );
  }

  const totalValue = selectedPortfolio?.items?.reduce((sum: number, item: any) => {
    return sum + (item.amount * (item.current_price || item.purchase_price));
  }, 0) || 0;

  const totalInvested = selectedPortfolio?.items?.reduce((sum: number, item: any) => {
    return sum + (item.amount * item.purchase_price);
  }, 0) || 0;

  const profitLoss = totalValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  return (
    <main className="min-h-screen bg-background text-primary font-mono pb-20">
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(var(--primary) 1px, transparent 1px),
            linear-gradient(90deg, var(--primary) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-primary p-6 mb-8 bg-background/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">💼</span>
              <div>
                <h1 className="text-2xl font-bold tracking-wider">&gt; MI_PORTFOLIO</h1>
                <p className="text-sm opacity-70 mt-1">// Gestión de inversiones</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className="border-2 border-primary px-6 py-3 hover:bg-primary hover:text-background transition-all duration-300 font-bold tracking-wider"
            >
              + CREAR
            </button>
          </div>
        </motion.div>

        {portfolios.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-primary/30 p-12 text-center"
          >
            <p className="text-xl opacity-70 mb-4">&gt; NO_PORTFOLIOS_FOUND</p>
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className="border-2 border-primary px-6 py-3 hover:bg-primary hover:text-background transition-all font-bold"
            >
              CREAR_PRIMER_PORTFOLIO
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="border-2 border-primary bg-background/80 backdrop-blur-sm p-4">
                <h2 className="font-bold text-lg mb-4 border-b-2 border-primary/30 pb-2">PORTFOLIOS</h2>
                <div className="space-y-2">
                  {portfolios.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => loadPortfolioDetails(p.id)}
                      className={`w-full text-left p-3 border-2 transition-all ${
                        selectedPortfolio?.id === p.id
                          ? 'border-primary bg-primary text-background'
                          : 'border-primary/30 hover:border-primary'
                      }`}
                    >
                      <p className="font-bold truncate">{p.name}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {p.is_public ? '🌐 PÚBLICO' : '🔒 PRIVADO'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedPortfolio && (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="border-2 border-primary bg-background/80 backdrop-blur-sm p-6"
                    >
                      <p className="text-xs opacity-70 mb-2">VALOR_TOTAL</p>
                      <p className="text-3xl font-bold tracking-wider">
                        ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="border-2 border-primary bg-background/80 backdrop-blur-sm p-6"
                    >
                      <p className="text-xs opacity-70 mb-2">INVERTIDO</p>
                      <p className="text-3xl font-bold tracking-wider">
                        ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`border-2 ${profitLoss >= 0 ? 'border-green-500' : 'border-red-500'} bg-background/80 backdrop-blur-sm p-6`}
                    >
                      <p className="text-xs opacity-70 mb-2">P&L</p>
                      <p className={`text-3xl font-bold tracking-wider ${profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {profitLoss >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                      </p>
                      <p className="text-sm opacity-70">
                        ${Math.abs(profitLoss).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </motion.div>
                  </div>

                  {/* Holdings */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="border-2 border-primary bg-background/80 backdrop-blur-sm overflow-hidden"
                  >
                    <div className="p-6 border-b-2 border-primary/30 flex justify-between items-center">
                      <h2 className="text-xl font-bold tracking-wider">HOLDINGS</h2>
                      <button
                        onClick={() => setShowAddCoin(true)}
                        className="border-2 border-primary px-4 py-2 hover:bg-primary hover:text-background transition-all font-bold text-sm"
                      >
                        + AGREGAR
                      </button>
                    </div>
                    
                    {selectedPortfolio.items && selectedPortfolio.items.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full font-mono">
                          <thead className="border-b-2 border-primary/30">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold opacity-70">CRYPTO</th>
                              <th className="px-6 py-3 text-right text-xs font-bold opacity-70">CANTIDAD</th>
                              <th className="px-6 py-3 text-right text-xs font-bold opacity-70">P_COMPRA</th>
                              <th className="px-6 py-3 text-right text-xs font-bold opacity-70">P_ACTUAL</th>
                              <th className="px-6 py-3 text-right text-xs font-bold opacity-70">VALOR</th>
                              <th className="px-6 py-3 text-right text-xs font-bold opacity-70">P&L</th>
                              <th className="px-6 py-3"></th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-primary/10">
                            {selectedPortfolio.items.map((item: any) => {
                              const currentPrice = item.current_price || item.purchase_price;
                              const value = item.amount * currentPrice;
                              const invested = item.amount * item.purchase_price;
                              const pl = ((value - invested) / invested) * 100;

                              return (
                                <tr key={item.id} className="hover:bg-primary/5 transition-colors">
                                  <td className="px-6 py-4">
                                    <div>
                                      <p className="font-bold">{item.coin_symbol}</p>
                                      <p className="text-xs opacity-70">{item.coin_id}</p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-right">{item.amount}</td>
                                  <td className="px-6 py-4 text-right">${item.purchase_price.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right">${currentPrice.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-right font-bold">${value.toFixed(2)}</td>
                                  <td className={`px-6 py-4 text-right font-bold ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {pl >= 0 ? '+' : ''}{pl.toFixed(2)}%
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => handleDeleteItem(item.id)}
                                      className="border border-red-500 text-red-500 px-3 py-1 hover:bg-red-500 hover:text-black transition-all text-xs"
                                    >
                                      DEL
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="p-12 text-center opacity-70">
                        <p>&gt; NO_HOLDINGS</p>
                        <button
                          onClick={() => setShowAddCoin(true)}
                          className="mt-4 border-2 border-primary px-4 py-2 hover:bg-primary hover:text-background transition-all"
                        >
                          AGREGAR_CRYPTO
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showCreatePortfolio && (
            <CreatePortfolioModal
              onClose={() => setShowCreatePortfolio(false)}
              onCreate={handleCreatePortfolio}
            />
          )}

          {showAddCoin && (
            <AddCoinModal
              onClose={() => setShowAddCoin(false)}
              onAdd={handleAddCoin}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function CreatePortfolioModal({ onClose, onCreate }: any) {
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(name, isPublic);
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
        className="border-4 border-primary bg-background p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6">&gt; CREAR_PORTFOLIO</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2 opacity-70">// NOMBRE</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
              placeholder="Mi Portfolio"
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-5 h-5 border-2 border-primary"
            />
            <label className="text-sm">HACER_PÚBLICO</label>
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
              className="flex-1 border-2 border-primary px-6 py-3 bg-primary text-background hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all font-bold"
            >
              CREAR
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function AddCoinModal({ onClose, onAdd }: any) {
  const [formData, setFormData] = useState({
    coin_id: '',
    coin_symbol: '',
    amount: '',
    purchase_price: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      coin_id: formData.coin_id.toLowerCase(),
      coin_symbol: formData.coin_symbol.toUpperCase(),
      amount: parseFloat(formData.amount),
      purchase_price: parseFloat(formData.purchase_price),
      notes: formData.notes
    });
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
        className="border-4 border-primary bg-background p-8 max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-6">&gt; AGREGAR_CRYPTO</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2 opacity-70">// CANTIDAD</label>
              <input
                type="number"
                step="any"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="0.5"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 opacity-70">// PRECIO</label>
              <input
                type="number"
                step="any"
                required
                value={formData.purchase_price}
                onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all"
                placeholder="45000"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2 opacity-70">// NOTAS</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-background border-2 border-primary px-4 py-3 focus:outline-none focus:shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] transition-all resize-none"
              placeholder="Compra en el dip..."
            />
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
              className="flex-1 border-2 border-primary px-6 py-3 bg-primary text-background hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] transition-all font-bold"
            >
              AGREGAR
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
