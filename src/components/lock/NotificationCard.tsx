import React from "react";

interface NotificationCardProps {
  appName: string;
  appIcon: React.ReactNode;
  title: string;
  body: string;
  time: string;
}

export default function NotificationCard({
  appName,
  appIcon,
  title,
  body,
  time,
}: NotificationCardProps) {
  return (
    <div className="glass rounded-2xl p-3.5 mx-4 select-none">
      {/* Header row: icon + app name + time */}
      <div className="flex items-center gap-2.5 mb-1.5">
        {/* App icon */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white text-sm shrink-0">
          {appIcon}
        </div>

        {/* App name + time */}
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="text-[13px] font-semibold text-white/70 uppercase tracking-wide">
            {appName}
          </span>
          <span className="text-[12px] text-white/40 tabular-nums">
            {time}
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
    </div>
  );
}
