import { getShelfIngredients, type IngredientId } from '../data/ingredients';
import { DIFFICULTY_SETTINGS, LEVEL_ONE_RECIPE_TOLERANCE, pickRandomRecipe } from '../data/recipes';
import { calculateCauldronWithReactions } from './reactions';
import type { CauldronValues } from './cauldron-values';
import type { GameState } from '../state/game-state';

export { calculateCauldron } from './cauldron-values';
export type { CauldronValues } from './cauldron-values';

export interface BrewResult {
  status: 'success' | 'failure' | 'unavailable';
  values: CauldronValues;
}

export function checkRecipe(
  values: CauldronValues,
  recipe: NonNullable<GameState['activeRecipe']>,
  tolerance: number = LEVEL_ONE_RECIPE_TOLERANCE,
): boolean {
  return (
    values.temperature >= recipe.temperature.min - tolerance &&
    values.temperature <= recipe.temperature.max + tolerance &&
    values.density >= recipe.density.min - tolerance &&
    values.density <= recipe.density.max + tolerance &&
    values.magicPower >= recipe.magicPower.min - tolerance &&
    values.magicPower <= recipe.magicPower.max + tolerance
  );
}

export function brewCauldron(state: GameState, random: () => number = Math.random): BrewResult {
  const values = calculateCauldronWithReactions(state.cauldronIngredients, state.difficulty);

  if (
    !state.hasStarted ||
    state.isPaused ||
    state.isGameOver ||
    state.cauldronIngredients.length === 0 ||
    !state.activeRecipe
  ) {
    return { status: 'unavailable', values };
  }

  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  if (checkRecipe(values, state.activeRecipe, settings.tolerance)) {
    state.score += settings.scorePerBrew;
    state.timeRemainingMs = Math.min(
      settings.startTimeSeconds * 1000,
      state.timeRemainingMs + settings.timeBonusSeconds * 1000,
    );
    state.activeRecipe = pickRandomRecipe(state.difficulty, random);
    state.cauldronIngredients = [];
    return { status: 'success', values };
  }

  state.lives -= 1;
  state.cauldronIngredients = [];
  state.isGameOver = state.lives <= 0;
  state.gameOverReason = state.isGameOver ? 'lives' : null;
  return { status: 'failure', values };
}

export function addIngredient(state: GameState, ingredientId: IngredientId): boolean {
  const stock = state.shelfStock[ingredientId];

  if (
    !state.hasStarted ||
    state.isPaused ||
    state.isGameOver ||
    state.cauldronIngredients.length >= DIFFICULTY_SETTINGS[state.difficulty].cauldronCapacity ||
    stock === undefined ||
    stock <= 0 ||
    !getShelfIngredients(state.difficulty).some((ingredient) => ingredient.id === ingredientId)
  ) {
    return false;
  }

  state.cauldronIngredients.push(ingredientId);
  state.shelfStock[ingredientId] = stock - 1;
  return true;
}

export function clearCauldron(state: GameState): void {
  state.cauldronIngredients = [];
}

export function pourOut(state: GameState): boolean {
  if (
    !state.hasStarted ||
    state.isPaused ||
    state.isGameOver ||
    state.cauldronIngredients.length === 0
  ) {
    return false;
  }

  clearCauldron(state);
  state.timeRemainingMs = Math.max(0, state.timeRemainingMs - 10_000);
  return true;
}
