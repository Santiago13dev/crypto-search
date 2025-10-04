import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface AddToPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (amount: number, buyPrice: number) => void;
  coinName: string;
  coinSymbol: string;
  coinImage?: string;
  currentPrice?: number;
}

export default function AddToPortfolioModal({
  isOpen,
  onClose,
  onAdd,
  coinName,
  coinSymbol,
  coinImage,
  currentPrice,
}: AddToPortfolioModalProps) {
  const [amount, setAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState(currentPrice?.toString() || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    const priceNum = parseFloat(buyPrice);

    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Por favor ingresa una cantidad válida');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      alert('Por favor ingresa un precio válido');
      return;
    }

    onAdd(amountNum, priceNum);
    setAmount('');
    setBuyPrice(currentPrice?.toString() || '');
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
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-background border-2 border-primary/40 rounded-none max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {coinImage && (
                    <div className="relative w-10 h-10">
                      <Image
                        src={coinImage}
                        alt={coinName}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-bold text-primary font-mono">
                      Agregar a Portafolio
                    </h2>
                    <p className="text-sm text-primary/60 font-mono">
                      {coinName} ({coinSymbol.toUpperCase()})
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#00ff00]/10 transition-colors rounded-none"
                  aria-label="Cerrar"
                >
                  <XMarkIcon className="w-6 h-6 text-primary" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    <button
                      type="button"
                      onClick={() => setBuyPrice(currentPrice.toString())}
                      className="mt-2 text-xs text-primary/60 hover:text-primary font-mono underline"
                    >
                      Usar precio actual: ${currentPrice.toLocaleString()}
                    </button>
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
                    onClick={onClose}
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
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
