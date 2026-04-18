export interface HighscoreEntry {
  name: string;
  timeSurvived: number;
  finalBudget: number;
  date: string;
}

const STORAGE_KEY = "pko_lockscreen_highscores";
const MAX_ENTRIES = 5;

function generatePlayerName(): string {
  const id = Math.floor(100 + Math.random() * 900);
  return `Gracz #${id}`;
}

export function getHighscores(): HighscoreEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HighscoreEntry[];
  } catch {
    return [];
  }
}

function saveHighscores(entries: HighscoreEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/**
 * Check if a score qualifies for the top 5 and save it if it does.
 * Returns the updated leaderboard and whether the new score was added.
 */
export function submitScore(
  timeSurvived: number,
  finalBudget: number
): { leaderboard: HighscoreEntry[]; isNewHighscore: boolean; newEntryIndex: number } {
  const entries = getHighscores();

  const newEntry: HighscoreEntry = {
    name: generatePlayerName(),
    timeSurvived,
    finalBudget,
    date: new Date().toLocaleDateString("pl-PL"),
  };

  // Sort by time survived (desc), then by final budget (desc) as tiebreaker
  entries.push(newEntry);
  entries.sort((a, b) => {
    if (b.timeSurvived !== a.timeSurvived) return b.timeSurvived - a.timeSurvived;
    return b.finalBudget - a.finalBudget;
  });

  // Keep only top N
  const trimmed = entries.slice(0, MAX_ENTRIES);
  saveHighscores(trimmed);

  const newEntryIndex = trimmed.indexOf(newEntry);
  const isNewHighscore = newEntryIndex !== -1;

  return { leaderboard: trimmed, isNewHighscore, newEntryIndex };
}
