"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { EducationalTip } from "@/lib/educationalTips";

interface EducationalToastProps {
  tip: EducationalTip | null;
  visible: boolean;
}

export default function EducationalToast({ tip, visible }: EducationalToastProps) {
  return (
    <AnimatePresence>
      {visible && tip && (
        <motion.div
          key={tip.text}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          style={{
            position: "absolute",
            bottom: "120px",
            left: "12px",
            right: "12px",
            zIndex: 60,
            padding: "16px 16px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(0,75,135,0.95), rgba(0,75,135,0.75))",
            backdropFilter: "blur(16px)",
            border: "2px solid rgba(0,163,224,0.4)",
            boxShadow: "0 12px 40px rgba(0,75,135,0.5), 0 0 0 1px rgba(0,163,224,0.15) inset",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          {/* Icon */}
          <span
            style={{
              fontSize: "28px",
              lineHeight: 1.3,
              flexShrink: 0,
            }}
          >
            {tip.icon}
          </span>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* PKO badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "6px",
                padding: "3px 10px",
                borderRadius: "100px",
                background: "rgba(0,163,224,0.25)",
                border: "1px solid rgba(0,163,224,0.3)",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 800,
                  color: "#7dd3fc",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                }}
              >
                PKO Edukacja
              </span>
            </div>

            {/* Tip text */}
            <p
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              {tip.text}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
