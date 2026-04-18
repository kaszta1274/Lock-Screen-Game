"use client";

import { motion } from "framer-motion";
import type { HighscoreEntry } from "@/lib/highscores";

interface LeaderboardProps {
  entries: HighscoreEntry[];
  highlightIndex: number; // index of the current player's score (-1 if not on board)
}

export default function Leaderboard({ entries, highlightIndex }: LeaderboardProps) {
  if (entries.length === 0) return null;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="w-full max-w-xs mt-6"
    >
      {/* Header */}
      <div className="text-center mb-3">
        <h2
          style={{
            fontSize: "13px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            background: "linear-gradient(135deg, #facc15, #f59e0b, #d97706)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Ranking Mistrzów PKO
        </h2>
        <div
          style={{
            width: "60px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, #facc15, transparent)",
            margin: "6px auto 0",
            borderRadius: "2px",
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          overflow: "hidden",
        }}
      >
        {/* Table header row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "36px 1fr 60px 70px",
            padding: "8px 12px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>#</span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Gracz</span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right" }}>Czas</span>
          <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "right" }}>Saldo</span>
        </div>

        {/* Rows with staggered animation */}
        {entries.map((entry, i) => {
          const isHighlighted = i === highlightIndex;
          return (
            <motion.div
              key={`${entry.name}-${entry.date}-${i}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.8 + i * 0.15,
                duration: 0.4,
                ease: "easeOut",
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "36px 1fr 60px 70px",
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: i < entries.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: isHighlighted
                  ? "linear-gradient(90deg, rgba(250,204,21,0.12), rgba(250,204,21,0.04))"
                  : "transparent",
              }}
            >
              {/* Rank */}
              <span style={{ fontSize: i < 3 ? "16px" : "12px", fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>
                {i < 3 ? medals[i] : `${i + 1}.`}
              </span>

              {/* Name */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isHighlighted ? 700 : 500,
                  color: isHighlighted ? "#facc15" : "rgba(255,255,255,0.8)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.name}
                {isHighlighted && (
                  <span style={{ fontSize: "9px", marginLeft: "4px", color: "#facc15", opacity: 0.8 }}>← TY</span>
                )}
              </span>

              {/* Time */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {entry.timeSurvived}s
              </span>

              {/* Budget */}
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textAlign: "right",
                  fontVariantNumeric: "tabular-nums",
                  color: entry.finalBudget >= 0 ? "#4ade80" : "#f87171",
                }}
              >
                {entry.finalBudget} zł
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
