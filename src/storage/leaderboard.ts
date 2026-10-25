import {
  isLeaderboardEntry,
  isValidPlayerName,
  qualifiesForLeaderboard,
  LEADERBOARD_LIMIT,
  sortLeaderboard,
  type LeaderboardEntry,
} from '../logic/leaderboard';
import type { Difficulty } from '../data/recipes';

const leaderboardKey = (difficulty: Difficulty): string =>
  `alchemists-cauldron:leaderboard:${difficulty.toLowerCase()}`;

export type LeaderboardReadResult =
  | { status: 'available'; entries: LeaderboardEntry[]; recovered: boolean }
  | { status: 'unavailable'; entries: [] };

export type LeaderboardWriteResult =
  | { status: 'saved'; entries: LeaderboardEntry[]; recovered: boolean }
  | { status: 'invalid-name' }
  | { status: 'not-qualified' }
  | { status: 'unavailable' };

function readLeaderboard(difficulty: Difficulty): LeaderboardReadResult {
  let storedValue: string | null;

  try {
    storedValue = window.localStorage.getItem(leaderboardKey(difficulty));
  } catch {
    return { status: 'unavailable', entries: [] };
  }

  if (storedValue === null) {
    return { status: 'available', entries: [], recovered: false };
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(storedValue);
  } catch {
    return { status: 'available', entries: [], recovered: true };
  }

  if (!Array.isArray(parsedValue)) {
    return { status: 'available', entries: [], recovered: true };
  }

  const validEntries = parsedValue.filter(
    (entry): entry is LeaderboardEntry =>
      isLeaderboardEntry(entry) && entry.difficulty === difficulty,
  );
  const sortedEntries = sortLeaderboard(validEntries).slice(0, LEADERBOARD_LIMIT);

  return {
    status: 'available',
    entries: sortedEntries,
    recovered: validEntries.length !== parsedValue.length || parsedValue.length > LEADERBOARD_LIMIT,
  };
}

export function getLeaderboard(difficulty: Difficulty): LeaderboardReadResult {
  return readLeaderboard(difficulty);
}

export function saveLeaderboardEntry(
  name: string,
  score: number,
  difficulty: Difficulty,
  timestamp = Date.now(),
): LeaderboardWriteResult {
  const trimmedName = name.trim();

  if (!isValidPlayerName(trimmedName)) {
    return { status: 'invalid-name' };
  }

  const current = readLeaderboard(difficulty);

  if (current.status === 'unavailable') {
    return { status: 'unavailable' };
  }

  if (!qualifiesForLeaderboard(score, current.entries)) {
    return { status: 'not-qualified' };
  }

  const entry: LeaderboardEntry = { name: trimmedName, score, timestamp, difficulty };
  const entries = sortLeaderboard([...current.entries, entry]).slice(0, LEADERBOARD_LIMIT);

  try {
    window.localStorage.setItem(leaderboardKey(difficulty), JSON.stringify(entries));
  } catch {
    return { status: 'unavailable' };
  }

  return { status: 'saved', entries, recovered: current.recovered };
}

export function clearLeaderboard(difficulty: Difficulty): boolean {
  try {
    window.localStorage.removeItem(leaderboardKey(difficulty));
  } catch {
    return false;
  }

  return true;
}
