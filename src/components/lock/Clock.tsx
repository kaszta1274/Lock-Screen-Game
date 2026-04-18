"use client";

import React from "react";

interface ClockProps {
  large?: boolean;
}

export default function Clock({ large = false }: ClockProps) {
  const [time, setTime] = React.useState({ hours: "", minutes: "" });
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        hours: now.getHours().toString().padStart(2, "0"),
        minutes: now.getMinutes().toString().padStart(2, "0"),
      });
      setDate(
        now.toLocaleDateString("pl-PL", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    };
    update();
    const interval = setInterval(update, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center ${large ? '' : 'pt-12 pb-2'} clock-shadow select-none`}>
      {/* Subtle time */}
      <div className={`${large ? 'text-7xl font-black' : 'text-3xl font-light'} leading-none tracking-tight text-white/90`}>
        {time.hours}
        <span className={large ? 'opacity-100' : 'opacity-70'}>:</span>
        {time.minutes}
      </div>

      {/* Subtle date */}
      <p className={`mt-2 ${large ? 'text-lg text-white/80' : 'text-sm text-white/60'} font-medium capitalize tracking-wide`}>
        {date}
      </p>
    </div>
  );
}
