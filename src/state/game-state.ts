import { SHELF_INGREDIENTS, type IngredientId } from '../data/ingredients';

export interface GameState {
  shelfStock: Partial<Record<IngredientId, number>>;
  cauldronIngredients: IngredientId[];
}

export type RandomSource = () => number;

export function createStock(random: RandomSource = Math.random): GameState['shelfStock'] {
  return Object.fromEntries(
    SHELF_INGREDIENTS.map((ingredient) => [ingredient.id, Math.floor(random() * 14) + 2]),
  );
}

export function createGameState(random: RandomSource = Math.random): GameState {
  return {
    shelfStock: createStock(random),
    cauldronIngredients: [],
  };
}
