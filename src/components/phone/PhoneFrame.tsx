import React from "react";

interface PhoneFrameProps {
  children: React.ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative flex items-center justify-center w-full h-dvh p-4 sm:p-6 md:p-8 bg-zinc-950 overflow-hidden">
      
      {/* Big Background Indicators outside the tablet */}
      <div className="absolute left-4 lg:left-12 xl:left-32 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-70 hidden md:flex pointer-events-none select-none">
         <span className="text-8xl lg:text-[120px] xl:text-[180px] font-black text-red-500 tracking-tighter">&larr;</span>
         <div className="mt-4 text-white/50">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
         </div>
      </div>

      <div className="absolute right-4 lg:right-12 xl:right-32 top-1/2 -translate-y-1/2 flex flex-col items-center opacity-70 hidden md:flex pointer-events-none select-none">
         <span className="text-8xl lg:text-[120px] xl:text-[180px] font-black text-green-500 tracking-tighter">&rarr;</span>
         <div className="mt-4 text-white/50">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 lg:w-24 lg:h-24 xl:w-32 xl:h-32">
             <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
           </svg>
         </div>
      </div>

      {/* Tablet bezel (iPad style) */}
      <div
        className="relative h-full max-h-[92vh] aspect-[3/4] overflow-hidden rounded-[2rem] sm:rounded-[3rem] border-[16px] sm:border-[24px] border-black shadow-[0_0_150px_rgba(0,0,0,0.8)] ring-1 ring-zinc-800 z-10"
      >
        {/* Front Camera Dot - integrated in bezel */}

        {/* Screen content */}
        <div className="relative w-full h-full overflow-hidden phone-scroll bg-black">
          {children}
        </div>
      </div>
    </div>
  );
}
