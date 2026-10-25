import {
  isLeaderboardEntry,
  isValidPlayerName,
  qualifiesForLeaderboard,
  LEADERBOARD_LIMIT,
  sortLeaderboard,
  type LeaderboardEntry,
} from '../logic/leaderboard';

const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';

export type LeaderboardReadResult =
  | { status: 'available'; entries: LeaderboardEntry[]; recovered: boolean }
  | { status: 'unavailable'; entries: [] };

export type LeaderboardWriteResult =
  | { status: 'saved'; entries: LeaderboardEntry[]; recovered: boolean }
  | { status: 'invalid-name' }
  | { status: 'not-qualified' }
  | { status: 'unavailable' };

function readLeaderboard(): LeaderboardReadResult {
  let storedValue: string | null;

  try {
    storedValue = window.localStorage.getItem(LEADERBOARD_KEY);
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

  const validEntries = parsedValue.filter(isLeaderboardEntry);
  const sortedEntries = sortLeaderboard(validEntries).slice(0, LEADERBOARD_LIMIT);

  return {
    status: 'available',
    entries: sortedEntries,
    recovered: validEntries.length !== parsedValue.length || parsedValue.length > LEADERBOARD_LIMIT,
  };
}

export function getLeaderboard(): LeaderboardReadResult {
  return readLeaderboard();
}

export function saveLeaderboardEntry(
  name: string,
  score: number,
  timestamp = Date.now(),
): LeaderboardWriteResult {
  const trimmedName = name.trim();

  if (!isValidPlayerName(trimmedName)) {
    return { status: 'invalid-name' };
  }

  const current = readLeaderboard();

  if (current.status === 'unavailable') {
    return { status: 'unavailable' };
  }

  if (!qualifiesForLeaderboard(score, current.entries)) {
    return { status: 'not-qualified' };
  }

  const entry: LeaderboardEntry = { name: trimmedName, score, timestamp };
  const entries = sortLeaderboard([...current.entries, entry]).slice(0, LEADERBOARD_LIMIT);

  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
  } catch {
    return { status: 'unavailable' };
  }

  return { status: 'saved', entries, recovered: current.recovered };
}

export function clearLeaderboard(): boolean {
  try {
    window.localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    return false;
  }

  return true;
}
