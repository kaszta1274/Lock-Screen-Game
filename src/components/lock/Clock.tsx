"use client";

import React from "react";

export default function Clock() {
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
    <div className="flex flex-col items-center pt-12 pb-2 clock-shadow select-none">
      {/* Subtle time */}
      <div className="text-3xl font-light leading-none tracking-wide text-white/90">
        {time.hours}
        <span className="opacity-70">:</span>
        {time.minutes}
      </div>

      {/* Subtle date */}
      <p className="mt-1 text-sm font-medium text-white/60 capitalize tracking-wide">
        {date}
      </p>
    </div>
  );
}
