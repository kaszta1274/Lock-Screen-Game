import { useState, useEffect, useCallback } from "react";

export interface InvestmentsState {
  lokata: number;
  etf: number;
  crypto: number;
}

export function useInvestments(
  budget: number,
  setBudget: React.Dispatch<React.SetStateAction<number>>,
  isGameOver: boolean
) {
  const [investments, setInvestments] = useState<InvestmentsState>({
    lokata: 0,
    etf: 0,
    crypto: 0,
  });
  
  // Reset investments when game ends
  useEffect(() => {
    if (isGameOver) {
      // Withdraw all investments and add to budget before reset
      setBudget((prev) => prev + investments.lokata + investments.etf + investments.crypto);
      setInvestments({ lokata: 0, etf: 0, crypto: 0 });
    }
  }, [isGameOver, investments.lokata, investments.etf, investments.crypto, setBudget]);

  const [cryptoStatus, setCryptoStatus] = useState<string>("");

  // Lokata: +5% to main budget every 10s
  useEffect(() => {
    if (isGameOver || investments.lokata <= 0) return;

    const timer = setInterval(() => {
      const profit = Math.floor(investments.lokata * 0.05);
      if (profit > 0) {
        setBudget((prev) => prev + profit);
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [investments.lokata, isGameOver, setBudget]);

  // ETF: fluctuates tightly (-10% to +20%) every 5s
  useEffect(() => {
    if (isGameOver || investments.etf <= 0) return;

    const timer = setInterval(() => {
      setInvestments((prev) => {
        if (prev.etf <= 0) return prev;
        const changePercent = Math.random() * 0.30 - 0.10; // -10% to +20%
        const newEtf = Math.max(0, Math.floor(prev.etf * (1 + changePercent)));
        return { ...prev, etf: newEtf };
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [investments.etf, isGameOver]);

  const buyLokata = useCallback((amount: number) => {
    if (amount <= 0 || budget < amount) return;
    setBudget((prev) => prev - amount);
    setInvestments((prev) => ({ ...prev, lokata: prev.lokata + amount }));
  }, [budget, setBudget]);

  const withdrawLokata = useCallback(() => {
    if (investments.lokata <= 0) return;
    setBudget((prev) => prev + investments.lokata);
    setInvestments((prev) => ({ ...prev, lokata: 0 }));
  }, [investments.lokata, setBudget]);

  const buyEtf = useCallback((amount: number) => {
    if (amount <= 0 || budget < amount) return;
    setBudget((prev) => prev - amount);
    setInvestments((prev) => ({ ...prev, etf: prev.etf + amount }));
  }, [budget, setBudget]);

  const withdrawEtf = useCallback(() => {
    if (investments.etf <= 0) return;
    setBudget((prev) => prev + investments.etf);
    setInvestments((prev) => ({ ...prev, etf: 0 }));
  }, [investments.etf, setBudget]);

  const buyCrypto = useCallback((amount: number) => {
    if (amount <= 0 || budget < amount || cryptoStatus === "Oczekuję...") return;
    setBudget((prev) => prev - amount);
    setCryptoStatus("Oczekuję...");
    
    // Wait for random 1s-5s
    const delay = Math.floor(Math.random() * 4000) + 1000;
    
    setTimeout(() => {
      const isWin = Math.random() < 0.2; // 20% to win x5, 80% to lose everything
      const result = isWin ? amount * 5 : 0;
      
      setInvestments((prev) => ({ ...prev, crypto: prev.crypto + result }));
      setCryptoStatus(isWin ? `Wygrałeś +${result} zł!` : `Straciłeś -${amount} zł!`);
      
      setTimeout(() => {
        setCryptoStatus("");
      }, 4000);
      
    }, delay);
  }, [budget, setBudget, cryptoStatus]);

  const withdrawCrypto = useCallback(() => {
    if (investments.crypto <= 0) return;
    setBudget((prev) => prev + investments.crypto);
    setInvestments((prev) => ({ ...prev, crypto: 0 }));
  }, [investments.crypto, setBudget]);

  return {
    investments,
    cryptoStatus,
    actions: {
      buyLokata,
      withdrawLokata,
      buyEtf,
      withdrawEtf,
      buyCrypto,
      withdrawCrypto
    }
  };
}
