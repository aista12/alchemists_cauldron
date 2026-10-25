import { SHELF_INGREDIENTS, type IngredientId } from '../data/ingredients';
import {
  LEVEL_ONE_DIFFICULTY,
  STARTING_LIVES,
  STARTING_TIME_SECONDS,
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

export function createStock(random: RandomSource = Math.random): GameState['shelfStock'] {
  return Object.fromEntries(
    SHELF_INGREDIENTS.map((ingredient) => [ingredient.id, Math.floor(random() * 14) + 2]),
  );
}

export function createGameState(): GameState {
  return {
    shelfStock: {},
    cauldronIngredients: [],
    difficulty: LEVEL_ONE_DIFFICULTY,
    activeRecipe: null,
    hasStarted: false,
    isPaused: false,
    isGameOver: false,
    gameOverReason: null,
    score: 0,
    timeRemainingMs: 0,
    lives: STARTING_LIVES,
  };
}

export function startNewGame(state: GameState, random: RandomSource = Math.random): void {
  state.shelfStock = createStock(random);
  state.cauldronIngredients = [];
  state.difficulty = LEVEL_ONE_DIFFICULTY;
  state.activeRecipe = pickRandomRecipe(state.difficulty, random);
  state.hasStarted = true;
  state.isPaused = false;
  state.isGameOver = false;
  state.gameOverReason = null;
  state.score = 0;
  state.timeRemainingMs = STARTING_TIME_SECONDS * 1000;
  state.lives = STARTING_LIVES;
}
