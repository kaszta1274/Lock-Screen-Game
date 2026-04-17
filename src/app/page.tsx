import PhoneFrame from "@/components/phone/PhoneFrame";
import StatusBar from "@/components/phone/StatusBar";
import Clock from "@/components/lock/Clock";
import NotificationCard from "@/components/lock/NotificationCard";

export default function Home() {
  return (
    <PhoneFrame>
      {/* Wallpaper background */}
      <div className="relative w-full h-full wallpaper-gradient">
        {/* Status bar */}
        <StatusBar />

        {/* Clock */}
        <Clock />

        {/* Notifications */}
        <div className="flex flex-col gap-3 mt-4">
          <NotificationCard
            appName="Wiadomości"
            appIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            }
            title="Mama"
            body="Pamiętaj o kodzie do szafki – to dzień Twoich urodzin! 🎂"
            time="12:34"
          />

          <NotificationCard
            appName="Bank"
            appIcon={
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
            }
            title="Przelew przychodzący"
            body="Jan Kowalski – 250,00 PLN. Saldo: 1 420,50 PLN"
            time="11:02"
          />
        </div>

        {/* Swipe hint at bottom */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="w-36 h-1.5 rounded-full bg-white/30 shimmer" />
        </div>
      </div>
    </PhoneFrame>
  );
}
