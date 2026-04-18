"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PhoneFrame from "@/components/phone/PhoneFrame";
import StatusBar from "@/components/phone/StatusBar";
import Clock from "@/components/lock/Clock";
import NotificationCard from "@/components/lock/NotificationCard";
import InvestmentsDrawer from "@/components/lock/InvestmentsDrawer";
import Leaderboard from "@/components/lock/Leaderboard";
import EducationalToast from "@/components/lock/EducationalToast";
import AchievementPopup from "@/components/lock/AchievementPopup";
import { NOTIFICATIONS_DB } from "@/lib/notifications";
import { submitScore, getHighscores, type HighscoreEntry } from "@/lib/highscores";
import { useInvestments } from "@/hooks/useInvestments";
import { useDecisionTracker } from "@/hooks/useDecisionTracker";
import { type Achievement, checkAndUnlockAchievements, getUnlockedAchievements, ACHIEVEMENTS } from "@/lib/achievements";
import { getRandomTip, type EducationalTip } from "@/lib/educationalTips";

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
  const chainTimeouts = useRef<NodeJS.Timeout[]>([]);
  const scheduledPenalties = useRef<Set<string>>(new Set()); // Track which notifications already have penalties scheduled
  
  const [isInvestmentsOpen, setIsInvestmentsOpen] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<HighscoreEntry[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const hasSubmittedScore = useRef(false);
  
  const { trackDecision, getAnalysis, resetTracker } = useDecisionTracker();
  
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);  const [currentTip, setCurrentTip] = useState<EducationalTip | null>(null);
  const [showTip, setShowTip] = useState(false);
  const tipTimeoutRef = useRef<NodeJS.Timeout | null>(null);  
  // Load badges on mount
  useEffect(() => {
    setUnlockedBadges(getUnlockedAchievements());
  }, []);

  const isGameOver = budget < 0 || batteryLevel <= 0;

  const { investments, cryptoStatus, actions: investmentActions } = useInvestments(budget, setBudget, isGameOver);

  const getPhase = (time: number) => {
    if (time >= 60) return { name: "Dorosłość", interval: 1800, mult: 3 };
    if (time >= 30) return { name: "Studia", interval: 2200, mult: 2 };
    return { name: "Szkoła", interval: 2500, mult: 1 };
  };

  const currentPhase = getPhase(timeSurvived);

  // Check achievements continuously
  useEffect(() => {
    if (!isGameStarted && !isGameOver) return;
    const unlocked = checkAndUnlockAchievements({
      timeSurvived,
      budget,

      cryptoStatus: cryptoStatus as any, // Cast if needed
    });
    
    if (unlocked.length > 0) {
      setCurrentAchievement(unlocked[0]);
      setUnlockedBadges(prev => [...prev, ...unlocked.map(a => a.id)]);
      setTimeout(() => {
        setCurrentAchievement(null);
      }, 4000);
    }
  }, [timeSurvived, budget, cryptoStatus, isGameStarted, isGameOver]);

  // TIME LOOP: tracks survived virtual months
  useEffect(() => {
    if (!isGameStarted || isGameOver || isInvestmentsOpen) return;
    const timer = setInterval(() => {
      setTimeSurvived((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isGameStarted, isGameOver, isInvestmentsOpen]);

  // GAME LOOP: add a new notification based on phase interval
  useEffect(() => {
    if (!isGameStarted || isGameOver || isInvestmentsOpen) return; // Stop spawning when game over or paused

    const timer = setInterval(() => {
      const pName = currentPhase.name;
      const phaseData = NOTIFICATIONS_DB[pName] || NOTIFICATIONS_DB["Szkoła"];
      
      if (!phaseData || phaseData.length === 0) {
        console.error("No phase data for", pName);
        return;
      }
      
      const randomNotif = phaseData[Math.floor(Math.random() * phaseData.length)];
      console.log("Spawning notification for phase", pName, randomNotif.title);
      
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
  }, [isGameStarted, isGameOver, isInvestmentsOpen, currentPhase.interval, currentPhase.mult, currentPhase.name]);

  const schedulePenalty = useCallback((notif: any) => {
    // Skip if penalty already scheduled for this notification
    if (scheduledPenalties.current.has(notif.id)) return;
    
    scheduledPenalties.current.add(notif.id);
    
    const timeout = setTimeout(() => {
      // Zmniejszona kara: 3x zamiast 5x, zależy od fazy gry
      const phase = getPhase(timeSurvived);
      const penaltyMultiplier = phase.name === "Dorosłość" ? 2.5 : phase.name === "Studia" ? 2.2 : 2;
      
      const penaltyNotif = {
        id: Math.random().toString(36).substring(7),
        appName: "KARA!",
        appIcon: getIcon("KARA!"),
        title: notif.penaltyTitle || "KARA!",
        body: notif.penaltyBody || "Zignorowano obowiązkową opłatę!",
        time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
        value: Math.round(notif.value * penaltyMultiplier),
        energyEffect: -15,
        isPenalty: true,
      };
      setNotifications((prev) => [penaltyNotif, ...prev]);
      scheduledPenalties.current.delete(notif.id); // Clear the flag when penalty is created
    }, 25000); // 25s penalty delay - więcej czasu na reagowanie
    
    penaltyTimeouts.current.push(timeout);
  }, []);

  const scheduleChainEvents = useCallback((notif: any, action: "accepted" | "rejected") => {
    if (!notif.chainEvents || notif.chainEvents.length === 0) return;
    
    notif.chainEvents.forEach((chain: any) => {
      if (chain.condition === action) {
        const timeout = setTimeout(() => {
          const newNotif = {
            ...chain.notification,
            value: chain.notification.value,
            id: Math.random().toString(36).substring(7),
            time: new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
            appIcon: getIcon(chain.notification.appName)
          };
          setNotifications((prev) => [newNotif, ...prev]);
        }, chain.delayMs);
        chainTimeouts.current.push(timeout);
      }
    });
  }, []);

  const handleSwipeRight = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        trackDecision(notif, "accept");
        if (!notif.isEducational) {
          if (notif.isMandatory) {
            setBatteryLevel(prev => Math.min(100, prev + 5)); // mandatory accepted = good
          } else if (notif.value < 0) {
            setBatteryLevel(prev => Math.max(0, prev - 15)); // optional expense accepted = battery drain
          } else if (notif.value > 0) {
            setBatteryLevel(prev => Math.min(100, prev + 5)); // optional income accepted = good
          }
          
          setBudget((b) => b + notif.value);
          // Obowiązkowe opłaty nie wpływają na energię baterii - to tylko dla opcjonalnych wydatków
          if (notif.energyEffect && !notif.isMandatory && !notif.isPenalty) {
            setBatteryLevel((energy) => Math.min(100, Math.max(0, energy + notif.energyEffect)));
          }
          scheduleChainEvents(notif, "accepted");
          
          // Show educational tip after accepting
          const tip = getRandomTip(notif.appName, "accept");
          if (tip) {
            setCurrentTip(tip);
            setShowTip(true);
            if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
            tipTimeoutRef.current = setTimeout(() => {
              setShowTip(false);
            }, 4500);
          }
        }
      }
      return prev.filter((n) => n.id !== id);
    });
  }, [scheduleChainEvents, trackDecision]);

  const handleSwipeLeft = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif) {
        trackDecision(notif, "reject");
        if (!notif.isEducational) {
          if (notif.isMandatory) {
            setBatteryLevel(prev => Math.max(0, prev - 20)); // missed mandatory = big drain
            schedulePenalty(notif);
          } else if (notif.value < 0) {
             setBatteryLevel(prev => Math.min(100, prev + 5)); // avoided optional expense = good
          }
          if (notif.value < 0 && notif.energyEffect > 0) {
            setBatteryLevel((energy) => Math.max(0, energy - 5)); // FOMO effect
          }
          scheduleChainEvents(notif, "rejected");
          
          // Show educational tip after rejecting
          const tip = getRandomTip(notif.appName, "reject");
          if (tip) {
            setCurrentTip(tip);
            setShowTip(true);
            if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
            tipTimeoutRef.current = setTimeout(() => {
              setShowTip(false);
            }, 4500);
          }
        }
      }
      // Mark as handled by removing immediately to prevent double handling
      return prev.filter((n) => n.id !== id);
    });
  }, [scheduleChainEvents, schedulePenalty, trackDecision]);

  const handleExpire = useCallback((id: string) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      // Only handle if notification still exists (prevents double handling)
      if (!notif) return prev;
      
      trackDecision(notif, "expire");
      if (!notif.isEducational) {
        if (notif.isPenalty) {
          // Penalty expired - accept it and battery takes big hit
          setBatteryLevel(prev => Math.max(0, prev - 30)); // penalty = massive drain
          setBudget((b) => b + notif.value);
        } else if (notif.isMandatory && !notif.isPenalty) {
          // Only schedule penalty if it's a mandatory notification (not already a penalty)
          setBatteryLevel(prev => Math.max(0, prev - 20)); // ignored mandatory = big drain
          schedulePenalty(notif);
        } else {
          setBudget((b) => b - 10);
        }
        
        // Show educational tip after expiring
        const tip = getRandomTip(notif.appName, "expire");
        if (tip) {
          setCurrentTip(tip);
          setShowTip(true);
          if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
          tipTimeoutRef.current = setTimeout(() => {
            setShowTip(false);
          }, 4500);
        }
      }
      return prev.filter((n) => n.id !== id);
    });
  }, [schedulePenalty, trackDecision]);

  // KEYBOARD SUPPORT: swipe oldest notification with arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameStarted || isGameOver || notifications.length === 0) return;

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

      // Auto-submit score once
      if (!hasSubmittedScore.current) {
        hasSubmittedScore.current = true;
        const result = submitScore(timeSurvived, budget);
        setLeaderboard(result.leaderboard);
        setHighlightIndex(result.newEntryIndex);
      }
    }
  }, [isGameOver, timeSurvived, budget]);

  const restartGame = () => {
    penaltyTimeouts.current.forEach(clearTimeout);
    penaltyTimeouts.current = [];
    chainTimeouts.current.forEach(clearTimeout);
    chainTimeouts.current = [];
    scheduledPenalties.current.clear(); // Clear pending penalties tracking
    if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
    hasSubmittedScore.current = false;
    setBudget(3000);
    setBatteryLevel(100);
    setNotifications([]);
    setTimeSurvived(0);
    setLeaderboard([]);
    setHighlightIndex(-1);
    setCurrentTip(null);
    setShowTip(false);
    resetTracker();
    setIsGameStarted(false);
  };

  return (
    <PhoneFrame>
      {/* Wallpaper background */}
      <div className="relative w-full h-full wallpaper-gradient overflow-hidden">
        {/* Status bar */}
      <StatusBar batteryLevel={batteryLevel} />

      {/* Achievement Popup overlay */}
      <AchievementPopup achievement={currentAchievement} />

        <AnimatePresence>
          {!isGameStarted && (
            <motion.div
              layout
              key="cover-screen"
              className="absolute inset-0 z-50 flex flex-col items-center justify-center touch-none bg-black/20 backdrop-blur-[8px]"
              drag="y"
              dragConstraints={{ top: -1000, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y < -150 || info.velocity.y < -500) {
                  setIsGameStarted(true);
                }
              }}
              exit={{ y: "-100%", opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
            >
              <div className="absolute top-[20%] flex flex-col items-center w-full">
                <Clock large={true} />
              </div>

              {/* iOS-style bottom unlock area */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-3 pt-8">
                <motion.span
                  animate={{ opacity: [0.5, 0.9, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="text-white/70 text-[13px] font-light tracking-wide mb-6"
                >
                  Przesuń w górę, aby odblokować
                </motion.span>
                {/* iOS home indicator pill */}
                <div
                  style={{
                    width: "134px",
                    height: "5px",
                    borderRadius: "100px",
                    backgroundColor: "rgba(255,255,255,0.6)",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isGameOver ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-50 flex flex-col items-center bg-black/85 backdrop-blur-xl text-center overflow-y-auto phone-scroll"
            style={{ justifyContent: "flex-start", paddingTop: "50px", paddingBottom: "30px", paddingLeft: "24px", paddingRight: "24px" }}
          >
            {/* Cause-dependent icon */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
              style={{
                fontSize: "52px",
                marginBottom: "8px",
                filter: "drop-shadow(0 0 20px rgba(255,50,50,0.4))",
              }}
            >
              {budget < 0 ? "💸" : "🔋"}
            </motion.div>

            {/* Big title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                fontSize: "38px",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                color: budget < 0 ? "#ef4444" : "#f97316",
                marginBottom: "8px",
                textShadow: `0 0 40px ${budget < 0 ? "rgba(239,68,68,0.5)" : "rgba(249,115,22,0.5)"}`,
              }}
            >
              {budget < 0 ? "BANKRUCTWO!" : "WYPALENIE!"}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.4 }}
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.55)",
                fontWeight: 500,
                maxWidth: "260px",
                lineHeight: 1.5,
                marginBottom: "20px",
              }}
            >
              {budget < 0 
                ? `Twoje saldo spadło do ${budget} zł. Nie udało się utrzymać finansów na plusie.` 
                : "Poziom energii spadł do zera. Ciągły stres finansowy doprowadził do wypalenia."}
            </motion.p>

            {/* Survival stat - educational */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "16px 24px",
                marginBottom: "24px",
                backdropFilter: "blur(8px)",
              }}
            >
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "4px" }}>
                Twój wynik
              </p>
              <p style={{ fontSize: "28px", fontWeight: 800, color: "white", letterSpacing: "-0.02em" }}>
                {timeSurvived} sekund
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 500, marginTop: "4px", lineHeight: 1.4 }}>
                Udało Ci się przeżyć {timeSurvived} sekund w świecie finansów
              </p>
            </motion.div>

            {/* Analysis Section (Faza 5) */}
            {(() => {
              const analysis = getAnalysis();
              const adviceMap = {
                impulsive: "Rozważ ograniczenie spontanicznych wydatków. Zastosuj zasadę 24h przed kolejnym drogim zakupem zachcianek.",
                ignorant: "Zaniedbywanie opłat na czas to najdroższy z możliwych błędów – kary mogą wielokrotnie przewyższyć koszt samego rachunku.",
                perfect: "Świetne zarządzanie budżetem! Jesteś gotowy jako pełnoprawny Inwestor. Pilnujesz wydatków i mądrze skalujesz przychody.",
                balanced: "Dobrze kontrolujesz swoje wydatki. Zadbaj tylko o nieco więcej regularnego oszczędzania (minimum 20%)."
              };
              
              return (
                <div className="w-full max-w-xs mt-6 mb-6">
                  {/* Zarobki vs Wydatki */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                     <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                       <p className="text-white/50 text-[9px] uppercase font-bold tracking-widest mb-1">Przychody</p>
                       <p className="text-green-400 font-black text-lg">+{analysis.totalEarned} zł</p>
                     </div>
                     <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                       <p className="text-white/50 text-[9px] uppercase font-bold tracking-widest mb-1">Wydatki</p>
                       <p className="text-red-400 font-black text-lg">-{analysis.totalSpent} zł</p>
                     </div>
                  </div>
                  
                  {/* Wskazówka Analiza */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="w-full p-4 rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,75,135,0.7), rgba(0,75,135,0.4))",
                      border: "1px solid rgba(0,163,224,0.3)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🏦</span>
                      <span className="text-[10px] font-extrabold text-[#7dd3fc] uppercase tracking-wider">
                        Analiza PKO
                      </span>
                    </div>
                    <p className="text-white/90 text-[13px] leading-snug font-medium">
                      {adviceMap[analysis.adviceCategory]}
                    </p>
                    
                    {analysis.bestDecision && analysis.bestDecision.value > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-[10px] text-white/50 uppercase font-bold mb-1">Najlepsza decyzja (dochód):</p>
                        <p className="text-green-300 text-[11px] font-semibold flex justify-between">
                          <span>{analysis.bestDecision.title}</span>
                          <span>+{analysis.bestDecision.value} zł</span>
                        </p>
                      </div>
                    )}
                    
                    {analysis.worstDecision && (
                      <div className="mt-2 pt-2 border-t border-white/10">
                        <p className="text-[10px] text-white/50 uppercase font-bold mb-1">Największy koszt/kara:</p>
                        <p className="text-red-300 text-[11px] font-semibold flex justify-between">
                          <span>{analysis.worstDecision.title}</span>
                          <span>{analysis.worstDecision.value} zł</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                </div>
              );
            })()}

            {/* Twoje Odznaki */}
            <div className="w-full max-w-xs mt-4 mb-4">
              <h3 className="text-white/60 text-[10px] uppercase tracking-widest font-black text-center mb-3">Twoje Odznaki</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {ACHIEVEMENTS.map(a => {
                  const isUnlocked = unlockedBadges.includes(a.id);
                  return (
                    <div key={a.id} className="relative group flex flex-col items-center cursor-help">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border-2 transition-all duration-300 ${isUnlocked ? 'bg-amber-500/20 border-amber-400 opacity-100 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-white/5 border-white/10 opacity-30 grayscale'}`}>
                        {a.icon}
                      </div>
                      <div className="absolute top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-black/90 p-2 rounded text-center min-w-[120px] shadow-xl z-50 border border-white/10">
                        <p className="text-[11px] font-bold text-white mb-0.5">{a.title}</p>
                        <p className="text-[9px] text-white/70 leading-tight">{a.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Restart button */}
            <motion.button 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.4 }}
              onClick={restartGame}
              style={{
                padding: "14px 36px",
                background: "white",
                color: "black",
                fontSize: "14px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 20px rgba(255,255,255,0.15)",
                transition: "transform 0.15s ease",
              }}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
            >
              Zacznij od nowa
            </motion.button>

            {/* Leaderboard */}
            <Leaderboard entries={leaderboard} highlightIndex={highlightIndex} />

            {/* iOS home indicator */}
            <div style={{ marginTop: "20px", width: "134px", height: "5px", borderRadius: "100px", backgroundColor: "rgba(255,255,255,0.3)" }} />
          </motion.div>
        ) : (
          <>
            {/* Budget Display (top) */}
            <div className="flex flex-col items-center pt-10 z-10 relative px-6">
              <span className="text-white/60 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">
                Aktualne Saldo
              </span>
              <span className="text-white text-5xl font-black tracking-tighter drop-shadow-lg">
                {budget} zł
              </span>
            </div>

            {/* Investment Widget */}
            <div className="flex justify-center mt-3 z-20 relative px-4">
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

            {/* Timer, Phase and Health */}
            <div className="mt-6 flex flex-row items-center justify-center gap-2">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-white/90 text-sm font-bold tracking-wide">
                  Czas: {timeSurvived}s
                </span>
              </div>
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
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
                    isEducational={notif.isEducational}
                    timeout={notif.timeout}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                    onExpire={handleExpire}
                    isPaused={isInvestmentsOpen}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* iOS home indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
              <div
                style={{
                  width: "134px",
                  height: "5px",
                  borderRadius: "100px",
                  backgroundColor: "rgba(255,255,255,0.4)",
                }}
              />
            </div>

            {/* Educational Tip Toast */}
            <EducationalToast tip={currentTip} visible={showTip} />

            <InvestmentsDrawer 
              isOpen={isInvestmentsOpen}
              onClose={() => setIsInvestmentsOpen(false)}
              investments={investments}
              cryptoStatus={cryptoStatus}
              actions={investmentActions}
            />

            {/* Large Battery Display at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-xs font-bold uppercase tracking-wider">Bateria</span>
                <span className="text-2xl font-black" style={{
                  color: batteryLevel > 50 ? '#4ade80' : batteryLevel > 20 ? '#facc15' : '#ef4444'
                }}>
                  {batteryLevel}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden border border-white/20">
                <div 
                  className="h-full transition-all duration-300 rounded-full" 
                  style={{
                    width: `${batteryLevel}%`,
                    background: batteryLevel > 50 ? 'linear-gradient(90deg, #22c55e, #4ade80)' : 
                                batteryLevel > 20 ? 'linear-gradient(90deg, #eab308, #facc15)' :
                                'linear-gradient(90deg, #dc2626, #ef4444)'
                  }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
