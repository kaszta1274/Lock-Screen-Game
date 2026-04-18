export interface Achievement {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "absolwent", icon: "🎓", title: "Absolwent", description: "Przetrwaj fazę Szkoła (30s)" },
  { id: "oszczedny", icon: "💰", title: "Oszczędny", description: "Dbaj o budżet: przebij 5000 zł salda" },
  { id: "strateg", icon: "📊", title: "Strateg", description: "Utrzymaj Zdrowie Finansowe powyżej 85 pkt przez całą grę" },
  { id: "hazardzista", icon: "🎰", title: "Deweloper", description: "Spróbuj szczęścia na rynku Crypto" },
  { id: "survivor", icon: "🔥", title: "Survivor", description: "Przetrwaj ponad 60 sekund (faza Dorosłość)" },
];

export interface GameStateForAchievements {
  timeSurvived: number;
  budget: number;
  healthIndex: number;
  cryptoStatus: "none" | "invested" | "rugged" | "sold";
}

export function getUnlockedAchievements(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem("pko_achievements");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveUnlockedAchievements(ids: string[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("pko_achievements", JSON.stringify(ids));
}

// Checks state and returns an array of NEWLY unlocked achievement IDs
export function checkAndUnlockAchievements(state: GameStateForAchievements): Achievement[] {
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked: Achievement[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !unlocked.includes(id)) {
      const achievement = ACHIEVEMENTS.find(a => a.id === id);
      if (achievement) {
        newlyUnlocked.push(achievement);
        unlocked.push(id);
      }
    }
  };

  // Conditions
  check("absolwent", state.timeSurvived >= 30);
  check("survivor", state.timeSurvived >= 60);
  check("oszczedny", state.budget >= 5000);
  check("strateg", state.timeSurvived >= 45 && state.healthIndex >= 85);
  check("hazardzista", state.cryptoStatus === "invested" || state.cryptoStatus === "rugged" || state.cryptoStatus === "sold");

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return newlyUnlocked;
}
