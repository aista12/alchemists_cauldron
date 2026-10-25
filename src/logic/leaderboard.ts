export const LEADERBOARD_LIMIT = 10;

export interface LeaderboardEntry {
  name: string;
  score: number;
  timestamp: number;
}

const PLAYER_NAME_PATTERN = /^[\p{L}\d _-]+$/u;

export function isValidPlayerName(name: string): boolean {
  const trimmedName = name.trim();
  const characterCount = Array.from(trimmedName).length;

  return characterCount >= 2 && characterCount <= 15 && PLAYER_NAME_PATTERN.test(trimmedName);
}

export function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.name === 'string' &&
    isValidPlayerName(entry.name) &&
    typeof entry.score === 'number' &&
    Number.isSafeInteger(entry.score) &&
    entry.score >= 0 &&
    typeof entry.timestamp === 'number' &&
    Number.isSafeInteger(entry.timestamp) &&
    entry.timestamp >= 0 &&
    Number.isFinite(new Date(entry.timestamp).getTime())
  );
}

export function sortLeaderboard(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort(
    (first, second) => second.score - first.score || first.timestamp - second.timestamp,
  );
}

export function qualifiesForLeaderboard(
  score: number,
  entries: readonly LeaderboardEntry[],
): boolean {
  if (!Number.isSafeInteger(score) || score < 0) {
    return false;
  }

  const sortedEntries = sortLeaderboard(entries);
  return (
    sortedEntries.length < LEADERBOARD_LIMIT ||
    score > (sortedEntries.at(-1)?.score ?? Number.POSITIVE_INFINITY)
  );
}

export function formatLeaderboardDate(timestamp: number): string {
  const date = new Date(timestamp);
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = `${date.getFullYear()}`;
  const hours = `${date.getHours()}`.padStart(2, '0');
  const minutes = `${date.getMinutes()}`.padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
