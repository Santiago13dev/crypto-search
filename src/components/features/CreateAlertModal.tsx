import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { AlertCondition } from '@/hooks/useAlerts';

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAlert: (
    condition: AlertCondition,
    targetPrice?: number,
    targetPercentage?: number,
    note?: string
  ) => void;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  coinImage?: string;
  currentPrice: number;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  onCreateAlert,
  coinId,
  coinName,
  coinSymbol,
  coinImage,
  currentPrice,
}: CreateAlertModalProps) {
  const [condition, setCondition] = useState<AlertCondition>('above');
  const [targetPrice, setTargetPrice] = useState(currentPrice.toString());
  const [targetPercentage, setTargetPercentage] = useState('10');
  const [note, setNote] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (condition === 'above' || condition === 'below') {
      const price = parseFloat(targetPrice);
      if (isNaN(price) || price <= 0) {
        alert('Ingresa un precio válido');
        return;
      }
      onCreateAlert(condition, price, undefined, note);
    } else {
      const percentage = parseFloat(targetPercentage);
      if (isNaN(percentage) || percentage <= 0) {
        alert('Ingresa un porcentaje válido');
        return;
      }
      onCreateAlert(condition, undefined, percentage, note);
    }

    // Reset
    setTargetPrice(currentPrice.toString());
    setTargetPercentage('10');
    setNote('');
    onClose();
  };

  const isPriceCondition = condition === 'above' || condition === 'below';
  const targetValue = isPriceCondition ? parseFloat(targetPrice) : currentPrice;
  const percentageValue = !isPriceCondition ? parseFloat(targetPercentage) : 0;

  // Calcular rango para la mini-gráfica
  const maxPrice = Math.max(currentPrice, targetValue) * 1.1;
  const minPrice = Math.min(currentPrice, targetValue) * 0.9;
  const priceRange = maxPrice - minPrice;

  const currentPricePosition = ((currentPrice - minPrice) / priceRange) * 100;
  const targetPricePosition = ((targetValue - minPrice) / priceRange) * 100;

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
              className="bg-background border-2 border-primary/40 rounded-none max-w-lg w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BellAlertIcon className="w-7 h-7 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold text-primary font-mono">
                      Crear Alerta
                    </h2>
                    <p className="text-sm text-primary/60 font-mono">
                      {coinName} ({coinSymbol.toUpperCase()})
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#00ff00]/10 transition-colors rounded-none"
                >
                  <XMarkIcon className="w-6 h-6 text-primary" />
                </button>
              </div>

              {/* Coin Info */}
              <div className="p-4 border border-primary/20 bg-[#00ff00]/5 rounded-none mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {coinImage && (
                    <Image
                      src={coinImage}
                      alt={coinName}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                  )}
                  <div>
                    <p className="text-sm text-primary/60 font-mono">
                      Precio Actual
                    </p>
                    <p className="text-2xl font-bold text-primary font-mono">
                      ${currentPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Condition Type */}
                <div>
                  <label className="block text-sm text-primary/80 font-mono mb-3">
                    {`>`} Tipo de Alerta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCondition('above')}
                      className={`p-3 border rounded-none font-mono text-sm transition-all ${
                        condition === 'above'
                          ? 'bg-[#00ff00] text-black border-primary font-bold'
                          : 'bg-background text-primary border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      ⬆️ Mayor que
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('below')}
                      className={`p-3 border rounded-none font-mono text-sm transition-all ${
                        condition === 'below'
                          ? 'bg-[#00ff00] text-black border-primary font-bold'
                          : 'bg-background text-primary border-primary/20 hover:border-primary/40'
                      }`}
                    >
                      ⬇️ Menor que
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('change_up')}
                      className={`p-3 border rounded-none font-mono text-sm transition-all ${
                        condition === 'change_up'
                          ? 'bg-emerald-400 text-black border-emerald-400 font-bold'
                          : 'bg-background text-emerald-400 border-emerald-400/20 hover:border-emerald-400/40'
                      }`}
                    >
                      📈 Sube %
                    </button>
                    <button
                      type="button"
                      onClick={() => setCondition('change_down')}
                      className={`p-3 border rounded-none font-mono text-sm transition-all ${
                        condition === 'change_down'
                          ? 'bg-red-400 text-black border-red-400 font-bold'
                          : 'bg-background text-red-400 border-red-400/20 hover:border-red-400/40'
                      }`}
                    >
                      📉 Baja %
                    </button>
                  </div>
                </div>

                {/* Target Value */}
                {isPriceCondition ? (
                  <div>
                    <label className="block text-sm text-primary/80 font-mono mb-2">
                      {`>`} Precio Objetivo (USD)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      required
                      className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono text-xl focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm text-primary/80 font-mono mb-2">
                      {`>`} Cambio Porcentual (%)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={targetPercentage}
                      onChange={(e) => setTargetPercentage(e.target.value)}
                      required
                      className="w-full bg-background border border-primary/40 text-primary px-4 py-3 font-mono text-xl focus:outline-none focus:border-primary rounded-none"
                    />
                  </div>
                )}

                {/* Mini Chart */}
                <div className="p-4 border border-primary/20 bg-background rounded-none">
                  <p className="text-xs text-primary/60 font-mono mb-3">
                    Visualización
                  </p>
                  <div className="relative h-32 bg-[#00ff00]/5 rounded-none">
                    {/* Current Price Line */}
                    <div
                      className="absolute left-0 right-0 border-t-2 border-blue-400 border-dashed"
                      style={{ bottom: `${currentPricePosition}%` }}
                    >
                      <span className="absolute -top-6 left-2 text-xs font-mono text-blue-400 bg-background px-2 py-1">
                        Actual: ${currentPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Target Price Line */}
                    {isPriceCondition && !isNaN(targetValue) && (
                      <div
                        className="absolute left-0 right-0 border-t-2 border-primary"
                        style={{ bottom: `${targetPricePosition}%` }}
                      >
                        <span className="absolute -bottom-6 right-2 text-xs font-mono text-primary bg-background px-2 py-1">
                          Objetivo: ${targetValue.toFixed(2)}
                        </span>
                        {condition === 'above' && targetValue > currentPrice && (
                          <span className="absolute right-2 -top-5 text-lg">⬆️</span>
                        )}
                        {condition === 'below' && targetValue < currentPrice && (
                          <span className="absolute right-2 bottom-1 text-lg">⬇️</span>
                        )}
                      </div>
                    )}

                    {/* Percentage Indicator */}
                    {!isPriceCondition && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-3xl font-bold font-mono text-primary">
                            {condition === 'change_up' ? '+' : '-'}{percentageValue}%
                          </p>
                          <p className="text-xs font-mono text-primary/60 mt-1">
                            desde ${currentPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm text-primary/80 font-mono mb-2">
                    {`>`} Nota (Opcional)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ej: Vender cuando llegue aquí"
                    className="w-full bg-background border border-primary/40 text-primary placeholder-[#00ff00]/30 px-4 py-3 font-mono focus:outline-none focus:border-primary rounded-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-background border border-primary/20 text-primary font-mono hover:bg-[#00ff00]/10 transition-all rounded-none"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-[#00ff00] text-black font-bold font-mono hover:brightness-125 transition-all rounded-none"
                  >
                    🔔 Crear Alerta
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
