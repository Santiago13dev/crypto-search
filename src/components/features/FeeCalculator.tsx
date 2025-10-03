import { useState } from 'react';
import { motion } from 'framer-motion';

interface Exchange {
  name: string;
  makerFee: number;
  takerFee: number;
  withdrawalFee: number;
}

const exchanges: Exchange[] = [
  { name: 'Binance', makerFee: 0.1, takerFee: 0.1, withdrawalFee: 0.0005 },
  { name: 'Coinbase', makerFee: 0.5, takerFee: 0.5, withdrawalFee: 0.001 },
  { name: 'Kraken', makerFee: 0.16, takerFee: 0.26, withdrawalFee: 0.00015 },
  { name: 'KuCoin', makerFee: 0.1, takerFee: 0.1, withdrawalFee: 0.0005 },
  { name: 'Bitfinex', makerFee: 0.1, takerFee: 0.2, withdrawalFee: 0.0004 },
];

export default function FeeCalculator() {
  const [amount, setAmount] = useState('1000');
  const [selectedExchange, setSelectedExchange] = useState<Exchange>(exchanges[0]);
  const [orderType, setOrderType] = useState<'maker' | 'taker'>('taker');

  const calculateFees = () => {
    const amt = parseFloat(amount);
    const feePercentage = orderType === 'maker' ? selectedExchange.makerFee : selectedExchange.takerFee;
    const tradingFee = amt * (feePercentage / 100);
    const total = amt - tradingFee;
    
    return { tradingFee, withdrawalFee: selectedExchange.withdrawalFee, total, feePercentage };
  };

  const fees = calculateFees();

  return (
    <div className="p-6 border border-[#00ff00]/20 bg-[#0a0f1e] rounded-none">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#00ff00] font-mono mb-2">{`>`} Calculadora de Comisiones</h3>
        <p className="text-sm text-[#00ff00]/60 font-mono">Compara comisiones entre exchanges</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm text-[#00ff00]/80 font-mono mb-2">{`>`} Monto (USD)</label>
          <input type="number" step="any" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-[#0a0f1e] border border-[#00ff00]/40 text-[#00ff00] px-4 py-3 font-mono focus:outline-none rounded-none" />
        </div>

        <div>
          <label className="block text-sm text-[#00ff00]/80 font-mono mb-2">{`>`} Exchange</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {exchanges.map((exchange) => (
              <button key={exchange.name} type="button" onClick={() => setSelectedExchange(exchange)} className={`px-4 py-2 font-mono text-sm transition-all rounded-none ${selectedExchange.name === exchange.name ? 'bg-[#00ff00] text-black font-bold' : 'bg-[#0a0f1e] border border-[#00ff00]/20 text-[#00ff00]'}`}>{exchange.name}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-[#00ff00]/80 font-mono mb-2">{`>`} Tipo de Orden</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: 'maker' as const, label: 'Maker' }, { value: 'taker' as const, label: 'Taker' }].map((type) => (
              <button key={type.value} type="button" onClick={() => setOrderType(type.value)} className={`px-4 py-3 font-mono text-sm transition-all rounded-none ${orderType === type.value ? 'bg-[#00ff00] text-black font-bold' : 'bg-[#0a0f1e] border border-[#00ff00]/20 text-[#00ff00]'}`}>{type.label}</button>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 border-2 border-[#00ff00] bg-[#00ff00]/10 rounded-none">
          <h4 className="text-lg font-bold text-[#00ff00] font-mono mb-4">Resumen</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[#00ff00]/80 font-mono">Original:</span>
              <span className="text-[#00ff00] font-mono font-bold">${parseFloat(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#00ff00]/80 font-mono">Comisión ({fees.feePercentage}%):</span>
              <span className="text-red-400 font-mono font-bold">-${fees.tradingFee.toFixed(2)}</span>
            </div>
            <div className="border-t border-[#00ff00]/20 pt-3 flex justify-between">
              <span className="text-[#00ff00] font-mono font-bold">Total:</span>
              <span className="text-2xl text-[#00ff00] font-mono font-bold">${fees.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <div>
          <h4 className="text-lg font-bold text-[#00ff00] font-mono mb-4">{`>`} Comparación</h4>
          <div className="overflow-x-auto">
            <table className="w-full border border-[#00ff00]/20">
              <thead>
                <tr className="border-b border-[#00ff00]/20">
                  <th className="p-3 text-left font-mono text-[#00ff00] text-sm">Exchange</th>
                  <th className="p-3 text-center font-mono text-[#00ff00] text-sm">Maker</th>
                  <th className="p-3 text-center font-mono text-[#00ff00] text-sm">Taker</th>
                </tr>
              </thead>
              <tbody>
                {exchanges.map((exchange) => {
                  const isSelected = exchange.name === selectedExchange.name;
                  return (
                    <tr key={exchange.name} className={`border-b border-[#00ff00]/10 ${isSelected ? 'bg-[#00ff00]/10' : ''}`}>
                      <td className="p-3 font-mono text-[#00ff00]">{exchange.name}</td>
                      <td className="p-3 text-center font-mono text-[#00ff00]/80">{exchange.makerFee}%</td>
                      <td className="p-3 text-center font-mono text-[#00ff00]/80">{exchange.takerFee}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
