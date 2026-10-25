import { CAULDRON_CAPACITY, SHELF_INGREDIENTS, type IngredientId } from '../data/ingredients';
import type { GameState } from '../state/game-state';

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
