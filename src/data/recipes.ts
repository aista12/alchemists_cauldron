export interface RecipeRange {
  min: number;
  max: number;
}

export interface Recipe {
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  temperature: RecipeRange;
  density: RecipeRange;
  magicPower: RecipeRange;
}

export const ACTIVE_RECIPE: Recipe = {
  name: 'Acid Spark',
  difficulty: 'Medium',
  temperature: { min: 17, max: 27 },
  density: { min: 18, max: 28 },
  magicPower: { min: 29, max: 39 },
};
