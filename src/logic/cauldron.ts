import {
  CAULDRON_CAPACITY,
  INGREDIENTS,
  SHELF_INGREDIENTS,
  type IngredientId,
} from '../data/ingredients';
import type { GameState } from '../state/game-state';

export interface CauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
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

export function addIngredient(state: GameState, ingredientId: IngredientId): boolean {
  const stock = state.shelfStock[ingredientId];

  if (
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
