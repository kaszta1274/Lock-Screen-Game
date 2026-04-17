import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InvestmentsState } from "@/hooks/useInvestments";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  investments: InvestmentsState;
  cryptoStatus: string;
  actions: {
    buyLokata: (val: number) => void;
    withdrawLokata: () => void;
    buyEtf: (val: number) => void;
    withdrawEtf: () => void;
    buyCrypto: (val: number) => void;
    withdrawCrypto: () => void;
  };
}

export default function InvestmentsDrawer({ isOpen, onClose, investments, cryptoStatus, actions }: DrawerProps) {
  const [lokataAmount, setLokataAmount] = useState("");
  const [etfAmount, setEtfAmount] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");

  const handleBuyLokata = () => { actions.buyLokata(Number(lokataAmount) || 0); setLokataAmount(""); };
  const handleBuyEtf = () => { actions.buyEtf(Number(etfAmount) || 0); setEtfAmount(""); };
  const handleBuyCrypto = () => { actions.buyCrypto(Number(cryptoAmount) || 0); setCryptoAmount(""); };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 z-50 flex flex-col bg-zinc-900 border-t border-white/10 rounded-t-[2.5rem] h-[80%] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 shrink-0" />
            <div className="px-6 py-4 pb-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Portfel Inwestycyjny</h2>
              <p className="text-sm text-white/50">Zbuduj kapitał, póki masz na koncie oszczędności.</p>
            </div>

            <div className="flex-1 overflow-y-auto phone-scroll px-6 pb-12 space-y-4">
              
              {/* LOKATA */}
              <div className="bg-white/5 rounded-2xl p-4 border border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400 uppercase rounded-bl-xl">Niskie Ryzyko</div>
                <h3 className="font-bold text-white mb-1">Lokata PKO (+5% co 10s)</h3>
                <p className="text-xs text-white/60 mb-3">Pieniądze pracują na 5% w interwałach. Możesz wypłacić wkład w dowolnym momencie.</p>
                
                <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 mb-3">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Zamrożone</span>
                  <span className="font-bold text-blue-400">{investments.lokata} zł</span>
                </div>

                <div className="flex gap-2">
                  <input type="number" 
                    value={lokataAmount} onChange={e => setLokataAmount(e.target.value)} 
                    placeholder="Kwota" 
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-blue-500/50 transition-colors" 
                  />
                  <button onClick={handleBuyLokata} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Zamroź</button>
                  <button onClick={actions.withdrawLokata} disabled={investments.lokata <= 0} className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Wypłać</button>
                </div>
              </div>

              {/* ETF */}
              <div className="bg-white/5 rounded-2xl p-4 border border-yellow-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500/20 px-3 py-1 text-[10px] font-bold text-yellow-400 uppercase rounded-bl-xl">Średnie Ryzyko</div>
                <h3 className="font-bold text-white mb-1">Fundusz ETF</h3>
                <p className="text-xs text-white/60 mb-3">Wartość waha się od -10% do +20% co 5 sekund. Wyczuj dobry moment.</p>
                
                <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 mb-3">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Wartość portfela</span>
                  <span className="font-bold text-yellow-400">{investments.etf} zł</span>
                </div>

                <div className="flex gap-2">
                  <input type="number" 
                    value={etfAmount} onChange={e => setEtfAmount(e.target.value)} 
                    placeholder="Kwota" 
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-yellow-500/50 transition-colors" 
                  />
                  <button onClick={handleBuyEtf} className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Kup ETF</button>
                  <button onClick={actions.withdrawEtf} disabled={investments.etf <= 0} className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Wypłać</button>
                </div>
              </div>

              {/* CRYPTO */}
              <div className="bg-white/5 rounded-2xl p-4 border border-purple-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-500/20 px-3 py-1 text-[10px] font-bold text-purple-400 uppercase rounded-bl-xl">Ekstremalne Ryzyko</div>
                <h3 className="font-bold text-white mb-1">Memecoin</h3>
                <p className="text-xs text-white/60 mb-3">Kasyno. Przelewasz kasę, czekasz kilka sekund. Albo robisz x5, albo tracisz wszystko (0 zł).</p>
                
                <div className="flex justify-between items-center bg-black/30 rounded-xl p-3 mb-3">
                  <span className="text-xs text-white/50 uppercase tracking-widest">Saldo Crypto</span>
                  <span className="font-bold text-purple-400">{investments.crypto} zł</span>
                </div>

                {cryptoStatus && (
                  <div className="text-center font-bold text-sm text-purple-300 mb-2 py-1 bg-purple-900/30 rounded-lg border border-purple-500/20">
                    {cryptoStatus}
                  </div>
                )}

                <div className="flex gap-2">
                  <input type="number" 
                    value={cryptoAmount} onChange={e => setCryptoAmount(e.target.value)} 
                    placeholder="Wpisz stawkę..." 
                    className="w-full bg-black/40 rounded-xl px-3 py-2 text-sm text-white outline-none border border-white/10 focus:border-purple-500/50 transition-colors" 
                  />
                  <button onClick={handleBuyCrypto} className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Graj</button>
                  <button onClick={actions.withdrawCrypto} disabled={investments.crypto <= 0} className="bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition">Wypłać</button>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
