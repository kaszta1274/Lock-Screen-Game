"use client";

import React from "react";

export default function Clock() {
  const [time, setTime] = React.useState({ hours: "", minutes: "" });
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime({
        hours: now.toLocaleTimeString("pl-PL", {
          hour: "2-digit",
          hour12: false,
        }),
        minutes: now.toLocaleTimeString("pl-PL", {
          minute: "2-digit",
        }),
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
    <div className="flex flex-col items-center pt-14 pb-6 clock-shadow select-none">
      {/* Large time */}
      <div className="text-[82px] font-extralight leading-none tracking-tight text-white">
        {time.hours}
        <span className="opacity-80">:</span>
        {time.minutes}
      </div>

      {/* Date */}
      <p className="mt-2 text-[17px] font-normal text-white/80 capitalize">
        {date}
      </p>
    </div>
  );
}
