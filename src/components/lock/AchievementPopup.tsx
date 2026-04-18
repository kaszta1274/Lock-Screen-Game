"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Achievement } from "@/lib/achievements";

export default function AchievementPopup({ achievement }: { achievement: Achievement | null }) {
  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="absolute top-20 left-4 right-4 z-50 flex items-center gap-4 px-4 py-3 rounded-2xl shadow-2xl"
          style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.95))",
            border: "1px solid rgba(251, 191, 36, 0.6)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl shadow-inner border border-white/30">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#fffbeb] drop-shadow-sm mb-0.5">
              Odblokowano Osiągnięcie!
            </p>
            <p className="text-white font-bold text-[15px] leading-tight drop-shadow-md">
              {achievement.title}
            </p>
            <p className="text-white/90 text-[11px] font-medium mt-0.5 leading-snug">
              {achievement.description}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
