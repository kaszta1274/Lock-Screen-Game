"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface NotificationCardProps {
  id: string;
  appName: string;
  appIcon: React.ReactNode;
  title: string;
  body: string;
  time: string;
  value: number;
  isPenalty?: boolean;
  isEducational?: boolean;
  timeout?: number;
  onSwipeLeft: (id: string) => void;
  onSwipeRight: (id: string, value: number) => void;
  onExpire: (id: string) => void;
  isPaused?: boolean;
}

export default function NotificationCard({
  id,
  appName,
  appIcon,
  title,
  body,
  time,
  value,
  isPenalty,
  isEducational = false,
  timeout = 3000,
  onSwipeLeft,
  onSwipeRight,
  onExpire,
  isPaused = false,
}: NotificationCardProps) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const backgroundColor = useTransform(
    x,
    [-150, 0, 150],
    isPenalty
      ? ["rgba(239, 68, 68, 0.9)", "rgba(239, 68, 68, 0.3)", "rgba(239, 68, 68, 0.9)"]
      : isEducational
      ? ["rgba(0, 75, 135, 0.5)", "rgba(255, 255, 255, 0)", "rgba(0, 75, 135, 0.5)"]
      : ["rgba(239, 68, 68, 0.5)", "rgba(255, 255, 255, 0)", "rgba(34, 197, 94, 0.5)"]
  );

  const [timeLeft, setTimeLeft] = React.useState(timeout);
  const hasExpired = React.useRef(false);

  useEffect(() => {
    if (isPaused || hasExpired.current) return;

    if (timeLeft <= 0 && !hasExpired.current) {
      hasExpired.current = true;
      onExpire(id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 100;
        if (newTime <= 0 && !hasExpired.current) {
          hasExpired.current = true;
          onExpire(id);
        }
        return Math.max(newTime, 0);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [id, isPaused, onExpire]);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const swipeThreshold = 100;

    if (offset > swipeThreshold || velocity > 500) {
      onSwipeRight(id, value);
    } else if (!isPenalty && (offset < -swipeThreshold || velocity < -500)) {
      onSwipeLeft(id);
    }
  };

  return (
    <motion.div
      layout
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`backdrop-blur-md bg-white/5 shadow-md shadow-black/20 rounded-2xl p-3.5 mx-4 select-none touch-none relative overflow-hidden shrink-0 z-10 border ${isPenalty ? 'border-red-500/50' : 'border-white/10'}`}
    >
      {/* Background Swipe Color Hint */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-[-1]" 
        style={{ backgroundColor }} 
      />

      {/* Header row: icon + app name + time */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white text-sm shadow-sm shrink-0">
          {appIcon}
        </div>

        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-white/70 uppercase tracking-wide">
            {appName}
          </span>
          <span className="text-[12px] text-white/40 tabular-nums font-medium">
            {isEducational ? "EDUKACJA" : value > 0 ? `+${value} zł` : `${value} zł`}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-semibold text-white leading-snug mb-0.5 ml-[42px]">
        {title}
      </h3>

      {/* Body */}
      <p className="text-[14px] text-white/70 leading-snug ml-[42px] line-clamp-2">
        {body}
      </p>
      
      {/* Progress bar to visually indicate expiration */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
        <motion.div
           className={isEducational ? "h-full bg-blue-400/80" : "h-full bg-red-400/80"}
           animate={{ width: `${(Math.max(timeLeft, 0) / timeout) * 100}%` }}
           transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}

