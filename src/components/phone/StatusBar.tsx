"use client";

import React from "react";

export default function StatusBar() {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-40 flex items-center justify-between px-8 pt-4 pb-1 text-[13px] font-semibold text-white/90">
      {/* Left — time */}
      <span>{time}</span>

      {/* Right — icons */}
      <div className="flex items-center gap-1.5">
        {/* Signal strength */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="1" />
          <rect x="4" y="5" width="3" height="7" rx="0.5" opacity="1" />
          <rect x="8" y="2" width="3" height="10" rx="0.5" opacity="1" />
          <rect x="12" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
        </svg>

        {/* WiFi */}
        <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
          <path
            d="M7.5 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"
            transform="translate(0,-2)"
          />
          <path
            d="M4.5 9a4.2 4.2 0 0 1 6 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            transform="translate(0,-2)"
          />
          <path
            d="M2 6a7.5 7.5 0 0 1 11 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            transform="translate(0,-2)"
          />
        </svg>

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="relative w-6 h-3 rounded-[3px] border border-white/70 p-[1.5px]">
            <div className="w-[65%] h-full rounded-[1.5px] bg-green-400" />
          </div>
          <div className="w-[2px] h-1.5 rounded-r-sm bg-white/70" />
        </div>
      </div>
    </div>
  );
}
