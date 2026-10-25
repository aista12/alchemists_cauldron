import { INGREDIENTS, type IngredientId } from '../data/ingredients';

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
