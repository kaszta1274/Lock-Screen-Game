import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex items-center justify-center w-full h-dvh p-4">
      {/* Phone bezel */}
      <div
        className="relative w-full max-w-[380px] overflow-hidden rounded-[3rem] border-[3px] border-zinc-700/60 shadow-2xl shadow-black/60"
        style={{ aspectRatio: "9 / 19.5" }}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50">
          <div className="w-28 h-7 bg-black rounded-full" />
        </div>

        {/* Screen content */}
        <div className="relative w-full h-full overflow-hidden phone-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
