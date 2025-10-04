import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Coin } from '@/types/coin';
import { coingeckoService } from '@/lib/services/coingecko';
import { toast } from 'react-hot-toast';

interface QuickAddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: string, name: string, symbol: string, image: string, amount: number, buyPrice: number) => void;
}

export default function QuickAddPortfolioModal({
  isOpen,
  onClose,
  onAdd,
}: QuickAddPortfolioModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Coin[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    try {
      const data = await coingeckoService.searchCoins(query);
      setSearchResults(data.coins || []);
    } catch (error) {
      console.error('Error searching coins:', error);
      toast.error('Error al buscar');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectCoin = async (coin: Coin) => {
    setSelectedCoin(coin);
    setSearchResults([]);
    setSearchQuery('');

    // Obtener precio actual
    try {
      const details = await coingeckoService.getCoinDetails(coin.id);
      const price = details.market_data?.current_price?.usd;
      if (price) {
        setCurrentPrice(price);
        setBuyPrice(price.toString());
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCoin) {
      toast.error('Selecciona una criptomoneda');
      return;
    }

    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(buyPrice);

    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Ingresa una cantidad válida');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      toast.error('Ingresa un precio válido');
      return;
    }

    onAdd(
      selectedCoin.id,
      selectedCoin.name,
      selectedCoin.symbol,
      selectedCoin.thumb || selectedCoin.large || '',
      amountNum,
      priceNum
    );

    // Reset
    setSelectedCoin(null);
    setAmount('');
    setBuyPrice('');
    setCurrentPrice(null);
    onClose();
  };

  const handleClose = () => {
    setSelectedCoin(null);
    setSearchQuery('');
    setSearchResults([]);
    setAmount('');
    setBuyPrice('');
    setCurrentPrice(null);
    onClose();
  };

  const totalValue = parseFloat(amount) * parseFloat(buyPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background border-2 border-primary/40 rounded-none max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary font-mono">
                  {`>`} Agregar al Portafolio
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-[#00ff00]/10 transition-colors rounded-none"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="w-6 h-6 text-primary" />
                </button>
              </div>

              {/* Search */}
              {!selectedCoin && (
                <div className="mb-4">
                  <label className="block text-sm text-primary/80 font-mono mb-2">
                    {`>`} Buscar Criptomoneda
                  </label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/50" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="bitcoin, ethereum..."
                      className="w-full bg-background border border-primary/40 text-primary placeholder-[#00ff00]/50 px-4 py-3 pl-12 focus:outline-none focus:border-primary rounded-none font-mono"
                    />
                  </div>

                  {/* Search Results */}
                  {searchQuery && (
                    <div className="mt-2 max-h-60 overflow-y-auto border border-primary/20 rounded-none">
                      {isSearching ? (
                        <div className="p-4 text-center text-primary/60 font-mono text-sm">
                          Buscando...
                        </div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-center text-primary/60 font-mono text-sm">
                          No se encontraron resultados
                        </div>
                      ) : (
                        <div className="divide-y divide-[#00ff00]/10">
                          {searchResults.map((coin) => (
                            <button
                              key={coin.id}
                              onClick={() => handleSelectCoin(coin)}
                              className="w-full p-3 hover:bg-[#00ff00]/10 transition-all flex items-center gap-3 text-left"
                            >
                              {(coin.thumb || coin.large) && (
                                <Image
                                  src={coin.thumb || coin.large || ''}
                                  alt={coin.name}
                                  width={32}
                                  height={32}
                                  className="rounded-full"
                                  unoptimized
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-primary font-mono font-bold truncate">
                                  {coin.name}
                                </p>
                                <p className="text-primary/60 font-mono text-sm uppercase">
                                  {coin.symbol}
                                </p>
                              </div>
                              {coin.market_cap_rank && (
                                <span className="text-primary/50 font-mono text-sm">
                                  #{coin.market_cap_rank}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Selected Coin Form */}
              {selectedCoin && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Selected Coin Display */}
                  <div className="p-4 border border-primary/20 bg-[#00ff00]/5 rounded-none flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {(selectedCoin.thumb || selectedCoin.large) && (
                        <Image
                          src={selectedCoin.thumb || selectedCoin.large || ''}
                          alt={selectedCoin.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                          unoptimized
                        />
                      )}
                      <div>
                        <p className="text-primary font-mono font-bold">
                          {selectedCoin.name}
                        </p>
                        <p className="text-primary/60 font-mono text-sm uppercase">
                          {selectedCoin.symbol}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCoin(null)}
                      className="text-primary/60 hover:text-primary text-sm font-mono underline"
                    >
                      Cambiar
                    </button>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm text-primary/80 font-mono mb-2">
                      {`>`} Cantidad
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>

                  {/* Buy Price */}
                  <div>
                    <label className="block text-sm text-primary/80 font-mono mb-2">
                      {`>`} Precio de Compra (USD)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={buyPrice}
                      onChange={(e) => setBuyPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono focus:outline-none focus:border-primary rounded-none"
                    />
                    {currentPrice && (
                      <p className="mt-2 text-xs text-primary/60 font-mono">
                        Precio actual: ${currentPrice.toLocaleString()}
                      </p>
                    )}
                  </div>

                  {/* Total Value */}
                  {!isNaN(totalValue) && totalValue > 0 && (
                    <div className="p-4 border border-primary/20 bg-[#00ff00]/5 rounded-none">
                      <p className="text-xs text-primary/60 font-mono mb-1">
                        Valor Total
                      </p>
                      <p className="text-2xl font-bold text-primary font-mono">
                        ${totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 bg-background border border-primary/20 text-primary font-mono hover:bg-[#00ff00]/10 transition-all rounded-none"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none flex items-center justify-center gap-2"
                    >
                      <PlusIcon className="w-5 h-5" />
                      Agregar
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
