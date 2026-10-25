import { getShelfIngredients, type IngredientId } from '../data/ingredients';
import {
  DIFFICULTY_SETTINGS,
  LEVEL_ONE_DIFFICULTY,
  type Difficulty,
  type Recipe,
  pickRandomRecipe,
} from '../data/recipes';

export interface GameState {
  shelfStock: Partial<Record<IngredientId, number>>;
  cauldronIngredients: IngredientId[];
  difficulty: Difficulty;
  activeRecipe: Recipe | null;
  hasStarted: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  gameOverReason: 'time' | 'lives' | 'ingredients' | null;
  score: number;
  timeRemainingMs: number;
  lives: number;
}

export type RandomSource = () => number;

export function createStock(
  difficulty: Difficulty,
  random: RandomSource = Math.random,
): GameState['shelfStock'] {
  return Object.fromEntries(
    getShelfIngredients(difficulty).map((ingredient) => [
      ingredient.id,
      Math.floor(random() * 14) + 2,
    ]),
  );
}

export function createGameState(difficulty: Difficulty = LEVEL_ONE_DIFFICULTY): GameState {
  return {
    shelfStock: {},
    cauldronIngredients: [],
    difficulty,
    activeRecipe: null,
    hasStarted: false,
    isPaused: false,
    isGameOver: false,
    gameOverReason: null,
    score: 0,
    timeRemainingMs: 0,
    lives: DIFFICULTY_SETTINGS[difficulty].startingLives,
  };
}

export function startNewGame(
  state: GameState,
  difficulty: Difficulty = state.difficulty,
  random: RandomSource = Math.random,
): void {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  state.shelfStock = createStock(difficulty, random);
  state.cauldronIngredients = [];
  state.difficulty = difficulty;
  state.activeRecipe = pickRandomRecipe(state.difficulty, random);
  state.hasStarted = true;
  state.isPaused = false;
  state.isGameOver = false;
  state.gameOverReason = null;
  state.score = 0;
  state.timeRemainingMs = settings.startTimeSeconds * 1000;
  state.lives = settings.startingLives;
}
