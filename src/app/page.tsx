"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneFrame from "@/components/phone/PhoneFrame";
import StatusBar from "@/components/phone/StatusBar";
import Clock from "@/components/lock/Clock";
import NotificationCard from "@/components/lock/NotificationCard";
import InvestmentsDrawer from "@/components/lock/InvestmentsDrawer";
import { NOTIFICATIONS_DB } from "@/lib/notifications";
import { useInvestments } from "@/hooks/useInvestments";

const getIcon = (appName: string) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
};

export default function Home() {
  const [budget, setBudget] = useState(3000);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [timeSurvived, setTimeSurvived] = useState(0);
  const penaltyTimeouts = useRef<NodeJS.Timeout[]>([]);
  
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);

  const isGameOver = budget < 0 || batteryLevel <= 0;

  const { investments, cryptoStatus, actions: investmentActions } = useInvestments(budget, setBudget, isGameOver);

  const getPhase = (time: number) => {
    if (time >= 60) return { name: "Dorosłość", interval: 1300, mult: 3 };
    if (time >= 30) return { name: "Studia", interval: 1950, mult: 2 };
    return { name: "Szkoła", interval: 3250, mult: 1 };
  };

  const currentPhase = getPhase(timeSurvived);

  // TIME LOOP: tracks survived virtual months
  useEffect(() => {
    if (isGameOver || isInvestmentsOpen) return;
    const timer = setInterval(() => {
      setTimeSurvived((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver, isInvestmentsOpen]);

  // GAME LOOP: add a new notification based on phase interval
  useEffect(() => {
    if (isGameOver || isInvestmentsOpen) return; // Stop spawning when game over or paused

    const timer = setInterval(() => {
      const phaseData = NOTIFICATIONS_DB[currentPhase.name] || NOTIFICATIONS_DB["Szkoła"];
      const randomNotif = phaseData[Math.floor(Math.random() * phaseData.length)];
      
      const newNotif = {
        ...randomNotif,
        value: randomNotif.value,
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        appIcon: getIcon(randomNotif.appName)
      };

      setNotifications((prev) => [newNotif, ...prev]);
    }, currentPhase.interval);

    return () => clearInterval(timer);
  }, [isGameOver, isInvestmentsOpen, currentPhase.interval, currentPhase.mult, currentPhase.name]);

  const schedulePenalty = useCallback((notif: any) => {
    const timeout = setTimeout(() => {
      const penaltyNotif = {
        id: Math.random().toString(36).substring(7),
        appName: "KARA!",
        appIcon: getIcon("KARA!"),
        title: notif.penaltyTitle || "KARA!",
        body: notif.penaltyBody || "Zignorowano obowiązkową opłatę!",
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        value: notif.value * 5,
        energyEffect: -15,
        isPenalty: true,
      };
      setNotifications((prev) => [penaltyNotif, ...prev]);
    }, 12000); // 12s penalty delay
    
    penaltyTimeouts.current.push(timeout);
  }, []);

  const handleSwipeRight = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        setBudget((b) => b + notif.value);
        if (notif.energyEffect) {
          setBatteryLevel((energy) => Math.min(100, Math.max(0, energy + notif.energyEffect)));
        }
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const handleSwipeLeft = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        if (notif.isMandatory) schedulePenalty(notif);
        if (notif.value < 0 && notif.energyEffect > 0) {
          setBatteryLevel((energy) => Math.max(0, energy - 5)); // FOMO effect
        }
      }
      return prev.filter((n) => n.id !== id);
    });
  }, [schedulePenalty]);

  const handleExpire = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        if (notif.isPenalty) {
          setBudget((b) => b + notif.value);
          setBatteryLevel((energy) => Math.max(0, energy + (notif.energyEffect || -15)));
        } else if (notif.isMandatory) {
          schedulePenalty(notif);
        } else {
          setBudget((b) => b - 10);
        }
      }
      return prev.filter((n) => n.id !== id);
    });
  }, [schedulePenalty]);

  // KEYBOARD SUPPORT: swipe oldest notification with arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver || notifications.length === 0) return;

      const oldestCard = notifications[notifications.length - 1];

      if (e.key === "ArrowLeft" && !oldestCard.isPenalty) {
        handleSwipeLeft(oldestCard.id);
      } else if (e.key === "ArrowRight") {
        handleSwipeRight(oldestCard.id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [notifications, isGameOver, handleSwipeLeft, handleSwipeRight]);

  useEffect(() => {
    if (isGameOver) {
      penaltyTimeouts.current.forEach(clearTimeout);
      penaltyTimeouts.current = [];
    }
  }, [isGameOver]);

  const restartGame = () => {
    penaltyTimeouts.current.forEach(clearTimeout);
    penaltyTimeouts.current = [];
    setBudget(3000);
    setBatteryLevel(100);
    setNotifications([]);
    setTimeSurvived(0);
  };

  return (
    <PhoneFrame>
      {/* Wallpaper background */}
      <div className="relative w-full h-full wallpaper-gradient">
        {/* Status bar */}
        <StatusBar batteryLevel={batteryLevel} />

        {isGameOver ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-8 text-center"
          >
            <h1 className="text-5xl font-black text-red-500 mb-2 tracking-tighter">
              {budget < 0 ? "BANKRUT" : "WYPALENIE"}
            </h1>
            <p className="text-white/70 mb-2 font-medium">
              {budget < 0 
                ? `Twój budżet spadł poniżej zera (${budget} zł).` 
                : "Zabrakło Ci sił na dalsze zmagania (Bateria 0%)."}
            </p>
            <p className="text-white font-bold text-xl mb-8">Czas przetrwania: {timeSurvived} msc</p>
            <button 
              onClick={restartGame}
              className="px-8 py-3.5 bg-white text-black text-sm font-bold uppercase tracking-wider rounded-full active:scale-95 transition-transform"
            >
              Zagraj Ponownie
            </button>
          </motion.div>
        ) : (
          <>
            {/* Clock & Date */}
            <div className="w-full">
              <Clock />
              
              {/* Investment Widget */}
              <div className="flex justify-center mt-2 z-20 relative px-4">
                <button
                  onClick={() => setIsInvestmentsOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-900/60 to-blue-800/40 hover:from-blue-800/70 hover:to-blue-700/50 backdrop-blur-md border border-blue-400/30 rounded-full px-5 py-2.5 shadow-lg shadow-blue-900/20 active:scale-95 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                      <polyline points="16 7 22 7 22 13" />
                    </svg>
                  </div>
                  <span className="text-white/90 text-[13px] font-semibold tracking-wide">Portfel Inwestycyjny PKO</span>
                </button>
              </div>
            </div>

            {/* Budget Display (Directly below date) */}
            <div className="flex flex-col items-center mt-4 z-10 relative px-6">
              <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                Aktualne Saldo
              </span>
              <span className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">
                {budget} zł
              </span>
              
              <div className="w-full max-w-[220px] mt-4 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.1em] text-white/60">
                  <span>Poziom Energii</span>
                  <span className={batteryLevel <= 20 ? "text-red-400" : batteryLevel <= 50 ? "text-yellow-400" : "text-green-400"}>{batteryLevel}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/40 rounded-full border border-white/10 overflow-hidden shadow-inner">
                  <div 
                    className={`h-full transition-all duration-500 ease-out ${
                      batteryLevel > 50 ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.4)]' :
                      batteryLevel > 20 ? 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.4)]' :
                      'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                    }`}
                    style={{ width: `${batteryLevel}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timer and Phase */}
            <div className="mt-6 flex flex-row items-center justify-center gap-4">
              <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-white/90 text-sm font-bold tracking-wide">
                  Czas: {timeSurvived} sek
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  {currentPhase.name}
                </span>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex flex-col gap-3 mt-4 relative z-10 w-full overflow-hidden max-h-[60%]">
              <AnimatePresence>
                {notifications.map((notif) => (
                  <NotificationCard
                    key={notif.id}
                    id={notif.id}
                    appName={notif.appName}
                    appIcon={notif.appIcon}
                    title={notif.title}
                    body={notif.body}
                    time={notif.time}
                    value={notif.value}
                    isPenalty={notif.isPenalty}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onExpire={handleExpire}
                    isPaused={isInvestmentsOpen}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Swipe hint at bottom */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <div className="w-36 h-1.5 rounded-full bg-white/30 shimmer" />
            </div>

            <InvestmentsDrawer 
              isOpen={isInvestmentsOpen}
              onClose={() => setIsInvestmentsOpen(false)}
              investments={investments}
              cryptoStatus={cryptoStatus}
              actions={investmentActions}
            />
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
