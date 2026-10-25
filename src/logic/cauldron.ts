import {
  CAULDRON_CAPACITY,
  INGREDIENTS,
  SHELF_INGREDIENTS,
  type IngredientId,
} from '../data/ingredients';
import {
  LEVEL_ONE_RECIPE_TOLERANCE,
  SCORE_PER_BREW,
  STARTING_TIME_SECONDS,
  TIME_BONUS_SECONDS,
  pickRandomRecipe,
} from '../data/recipes';
import type { GameState } from '../state/game-state';

export interface CauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export interface BrewResult {
  status: 'success' | 'failure' | 'unavailable';
  values: CauldronValues;
}

export function calculateCauldron(ingredients: readonly IngredientId[]): CauldronValues {
  return ingredients.reduce<CauldronValues>(
    (values, ingredientId) => {
      const ingredient = INGREDIENTS.find((item) => item.id === ingredientId);

      if (!ingredient) {
        throw new Error(`Unknown cauldron ingredient: ${ingredientId}`);
      }

      return {
        temperature: values.temperature + ingredient.temperature,
        density: values.density + ingredient.density,
        magicPower: values.magicPower + ingredient.magicPower,
      };
    },
    { temperature: 0, density: 0, magicPower: 0 },
  );
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
  const values = calculateCauldron(state.cauldronIngredients);

  if (
    !state.hasStarted ||
    state.isPaused ||
    state.isGameOver ||
    state.cauldronIngredients.length === 0 ||
    !state.activeRecipe
  ) {
    return { status: 'unavailable', values };
  }

  if (checkRecipe(values, state.activeRecipe)) {
    state.score += SCORE_PER_BREW;
    state.timeRemainingMs = Math.min(
      STARTING_TIME_SECONDS * 1000,
      state.timeRemainingMs + TIME_BONUS_SECONDS * 1000,
    );
    state.activeRecipe = pickRandomRecipe(state.difficulty, random);
    state.cauldronIngredients = [];
    return { status: 'success', values };
  }

  state.lives -= 1;
  state.cauldronIngredients = [];
  state.isGameOver = state.lives <= 0;
  return { status: 'failure', values };
}

export function addIngredient(state: GameState, ingredientId: IngredientId): boolean {
  const stock = state.shelfStock[ingredientId];

  if (
    !state.hasStarted ||
    state.isPaused ||
    state.isGameOver ||
    state.cauldronIngredients.length >= CAULDRON_CAPACITY ||
    stock === undefined ||
    stock <= 0 ||
    !SHELF_INGREDIENTS.some((ingredient) => ingredient.id === ingredientId)
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
