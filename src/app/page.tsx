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

  const isGameOver = budget < 0;

  const { investments, cryptoStatus, actions: investmentActions } = useInvestments(budget, setBudget, isGameOver);

  const getPhase = (time: number) => {
    if (time >= 60) return { name: "Dorosłość", interval: 1000, mult: 3 };
    if (time >= 30) return { name: "Studia", interval: 1500, mult: 2 };
    return { name: "Szkoła", interval: 2500, mult: 1 };
  };

  const currentPhase = getPhase(timeSurvived);

  // TIME LOOP: tracks survived virtual months
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => {
      setTimeSurvived((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameOver]);

  // GAME LOOP: add a new notification based on phase interval
  useEffect(() => {
    if (isGameOver) return; // Stop spawning when game over

    const timer = setInterval(() => {
      const phaseData = NOTIFICATIONS_DB[currentPhase.name] || NOTIFICATIONS_DB["Szkoła"];
      const randomNotif = phaseData[Math.floor(Math.random() * phaseData.length)];
      
      const newNotif = {
        ...randomNotif,
        value: randomNotif.value * currentPhase.mult,
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        appIcon: getIcon(randomNotif.appName)
      };

      setNotifications((prev) => [newNotif, ...prev]);
    }, currentPhase.interval);

    return () => clearInterval(timer);
  }, [isGameOver, currentPhase.interval, currentPhase.mult, currentPhase.name]);

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
        isPenalty: true,
      };
      setNotifications((prev) => [penaltyNotif, ...prev]);
    }, 12000); // 12s penalty delay
    
    penaltyTimeouts.current.push(timeout);
  }, []);

  const handleSwipeRight = useCallback((id: string, value: number) => {
    setBudget((prev) => prev + value);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const handleSwipeLeft = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif && notif.isMandatory) schedulePenalty(notif);
      return prev.filter((n) => n.id !== id);
    });
  }, [schedulePenalty]);

  const handleExpire = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        if (notif.isPenalty) {
          setBudget((b) => b + notif.value); // Forced penalty
        } else if (notif.isMandatory) {
          schedulePenalty(notif);
        } else {
          setBudget((b) => b - 10); // Standard missing penalty
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
        handleSwipeRight(oldestCard.id, oldestCard.value);
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
    setNotifications([]);
    setTimeSurvived(0);
  };

  return (
    <PhoneFrame>
      {/* Wallpaper background */}
      <div className="relative w-full h-full wallpaper-gradient">
        {/* Status bar */}
        <StatusBar />

        {isGameOver ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-8 text-center"
          >
            <h1 className="text-5xl font-black text-red-500 mb-2 tracking-tighter">BANKRUT</h1>
            <p className="text-white/70 mb-2 font-medium">Twój budżet spadł poniżej zera ({budget} zł).</p>
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
            {/* Budget Display */}
            <div className="flex flex-col items-center mt-6 z-10 relative">
              <span className="text-white/70 text-xs font-semibold tracking-widest uppercase mb-0.5">
                Budżet
              </span>
              <span className="text-white text-3xl font-bold tracking-tight mix-blend-overlay">
                {budget} zł
              </span>
            </div>

            {/* Clock */}
            <div className="mt-2 text-center flex flex-col items-center">
              <Clock />
              <span className="text-white/60 text-xs font-medium uppercase tracking-widest mt-1">
                Faza: {currentPhase.name}
              </span>
              <span className="text-white/80 text-sm font-bold mt-1">
                Czas przetrwania: {timeSurvived} msc
              </span>
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
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Apps dock / bottom */}
            <div className="absolute bottom-6 left-0 right-0 px-8 flex justify-center items-end">
              <button 
                onClick={() => setIsInvestmentsOpen(true)}
                className="flex flex-col items-center gap-1.5 active:scale-95 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 border border-white/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10" />
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-white drop-shadow-md tracking-wide">Inwestycje</span>
              </button>
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
