import { getShelfIngredients, type IngredientId } from '../data/ingredients';
import { DIFFICULTY_SETTINGS, RECIPES, type Difficulty, type Recipe } from '../data/recipes';
import type { GameState } from '../state/game-state';

const SAVE_KEY = 'alchemists-cauldron:run';
const SAVE_VERSION = 2;

export interface SavedGame {
  shelfStock: Partial<Record<IngredientId, number>>;
  cauldronIngredients: IngredientId[];
  difficulty: Difficulty;
  activeRecipe: Recipe;
  score: number;
  timeLeft: number;
  lives: number;
  status: 'playing' | 'paused';
}

export type SavedGameReadResult =
  | { status: 'missing' }
  | { status: 'unavailable' }
  | { status: 'invalid' }
  | { status: 'available'; game: SavedGame };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isIngredientId(value: unknown, difficulty: Difficulty): value is IngredientId {
  return getShelfIngredients(difficulty).some((ingredient) => ingredient.id === value);
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'Easy' || value === 'Medium' || value === 'Hard';
}

function isShelfStock(
  value: unknown,
  difficulty: Difficulty,
): value is Partial<Record<IngredientId, number>> {
  const ingredients = getShelfIngredients(difficulty);

  return (
    isRecord(value) &&
    Object.keys(value).length === ingredients.length &&
    ingredients.every((ingredient) => {
      const stock = value[ingredient.id];
      return typeof stock === 'number' && Number.isInteger(stock) && stock >= 0 && stock <= 15;
    })
  );
}

function isIngredientList(value: unknown, difficulty: Difficulty): value is IngredientId[] {
  return (
    Array.isArray(value) &&
    value.length <= DIFFICULTY_SETTINGS[difficulty].cauldronCapacity &&
    value.every((ingredientId) => isIngredientId(ingredientId, difficulty))
  );
}

function parseSavedGame(value: unknown): SavedGame | null {
  if (
    !isRecord(value) ||
    value.version !== SAVE_VERSION ||
    !isDifficulty(value.difficulty) ||
    typeof value.score !== 'number' ||
    !Number.isInteger(value.score) ||
    value.score < 0 ||
    typeof value.timeLeft !== 'number' ||
    !Number.isInteger(value.timeLeft) ||
    value.timeLeft <= 0 ||
    value.timeLeft > DIFFICULTY_SETTINGS[value.difficulty].startTimeSeconds * 1000 ||
    typeof value.lives !== 'number' ||
    !Number.isInteger(value.lives) ||
    value.lives < 1 ||
    value.lives > DIFFICULTY_SETTINGS[value.difficulty].startingLives ||
    (value.status !== 'playing' && value.status !== 'paused')
  ) {
    return null;
  }

  const savedRecipe = value.activeRecipe;
  const shelfStock = value.shelfStock;
  const cauldronIngredients = value.cauldronIngredients;

  if (
    !isRecord(savedRecipe) ||
    typeof savedRecipe.id !== 'string' ||
    !isShelfStock(shelfStock, value.difficulty) ||
    !isIngredientList(cauldronIngredients, value.difficulty)
  ) {
    return null;
  }

  const activeRecipe = RECIPES.find(
    (recipe) => recipe.id === savedRecipe.id && recipe.difficulty === value.difficulty,
  );

  if (!activeRecipe) {
    return null;
  }

  const spentStockIsValid = getShelfIngredients(value.difficulty).every((ingredient) => {
    const spentInCauldron = cauldronIngredients.filter(
      (ingredientId) => ingredientId === ingredient.id,
    ).length;
    return (shelfStock[ingredient.id] ?? 0) + spentInCauldron <= 15;
  });

  if (!spentStockIsValid) {
    return null;
  }

  return {
    shelfStock,
    cauldronIngredients,
    difficulty: value.difficulty,
    activeRecipe,
    score: value.score,
    timeLeft: value.timeLeft,
    lives: value.lives,
    status: value.status,
  };
}

export function readSavedGame(): SavedGameReadResult {
  let rawSave: string | null;

  try {
    rawSave = window.localStorage.getItem(SAVE_KEY);
  } catch {
    return { status: 'unavailable' };
  }

  if (rawSave === null) {
    return { status: 'missing' };
  }

  let parsedSave: unknown;

  try {
    parsedSave = JSON.parse(rawSave);
  } catch {
    return clearSavedGame() ? { status: 'invalid' } : { status: 'unavailable' };
  }

  const game = parseSavedGame(parsedSave);

  if (!game) {
    return clearSavedGame() ? { status: 'invalid' } : { status: 'unavailable' };
  }

  return { status: 'available', game };
}

export function saveGame(state: GameState): boolean {
  if (!state.hasStarted || state.isGameOver || !state.activeRecipe || state.timeRemainingMs <= 0) {
    return false;
  }

  const shelfStock: Partial<Record<IngredientId, number>> = {};

  for (const ingredient of getShelfIngredients(state.difficulty)) {
    const stock = state.shelfStock[ingredient.id];
    if (stock === undefined) {
      return false;
    }
    shelfStock[ingredient.id] = stock;
  }

  const save = {
    version: SAVE_VERSION,
    shelfStock,
    cauldronIngredients: state.cauldronIngredients,
    difficulty: state.difficulty,
    activeRecipe: state.activeRecipe,
    score: state.score,
    timeLeft: state.timeRemainingMs,
    lives: state.lives,
    status: state.isPaused ? 'paused' : 'playing',
  };

  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    return false;
  }

  return true;
}

export function clearSavedGame(): boolean {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    return false;
  }

  return true;
}

export function restoreSavedGame(state: GameState, game: SavedGame): void {
  state.shelfStock = { ...game.shelfStock };
  state.cauldronIngredients = [...game.cauldronIngredients];
  state.difficulty = game.difficulty;
  state.activeRecipe = game.activeRecipe;
  state.hasStarted = true;
  state.isPaused = true;
  state.isGameOver = false;
  state.gameOverReason = null;
  state.score = game.score;
  state.timeRemainingMs = game.timeLeft;
  state.lives = game.lives;
}
