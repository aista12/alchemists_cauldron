export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeRange {
  min: number;
  max: number;
}

export interface Recipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: RecipeRange;
  density: RecipeRange;
  magicPower: RecipeRange;
}

export const RECIPES: readonly Recipe[] = [
  {
    id: 'moon-mist',
    name: 'Moon Mist',
    difficulty: 'Easy',
    temperature: { min: 32, max: 42 },
    density: { min: 12, max: 22 },
    magicPower: { min: 17, max: 27 },
  },
  {
    id: 'root-bloom',
    name: 'Root Bloom',
    difficulty: 'Easy',
    temperature: { min: 2, max: 12 },
    density: { min: 24, max: 34 },
    magicPower: { min: 15, max: 25 },
  },
  {
    id: 'frost-steam',
    name: 'Frost Steam',
    difficulty: 'Easy',
    temperature: { min: 2, max: 12 },
    density: { min: 7, max: 17 },
    magicPower: { min: 19, max: 29 },
  },
  {
    id: 'quiet-swirl',
    name: 'Quiet Swirl',
    difficulty: 'Easy',
    temperature: { min: -28, max: -18 },
    density: { min: 19, max: 29 },
    magicPower: { min: 17, max: 27 },
  },
  {
    id: 'bright-dew',
    name: 'Bright Dew',
    difficulty: 'Easy',
    temperature: { min: 27, max: 37 },
    density: { min: 32, max: 42 },
    magicPower: { min: 25, max: 35 },
  },
  {
    id: 'snow-dust',
    name: 'Snow Dust',
    difficulty: 'Easy',
    temperature: { min: -16, max: -6 },
    density: { min: 28, max: 38 },
    magicPower: { min: 29, max: 39 },
  },
  {
    id: 'acid-spark',
    name: 'Acid Spark',
    difficulty: 'Medium',
    temperature: { min: 17, max: 27 },
    density: { min: 18, max: 28 },
    magicPower: { min: 29, max: 39 },
  },
  {
    id: 'void-ember',
    name: 'Void Ember',
    difficulty: 'Medium',
    temperature: { min: 0, max: 10 },
    density: { min: 0, max: 10 },
    magicPower: { min: 45, max: 55 },
  },
  {
    id: 'heavy-acid',
    name: 'Heavy Acid',
    difficulty: 'Medium',
    temperature: { min: 0, max: 10 },
    density: { min: 29, max: 39 },
    magicPower: { min: 25, max: 35 },
  },
  {
    id: 'frost-acid',
    name: 'Frost Acid',
    difficulty: 'Medium',
    temperature: { min: -13, max: -3 },
    density: { min: 13, max: 23 },
    magicPower: { min: 31, max: 41 },
  },
  {
    id: 'dusty-void',
    name: 'Dusty Void',
    difficulty: 'Medium',
    temperature: { min: -13, max: -3 },
    density: { min: 0, max: 10 },
    magicPower: { min: 47, max: 57 },
  },
  {
    id: 'dragon-void',
    name: 'Dragon Void',
    difficulty: 'Medium',
    temperature: { min: 25, max: 35 },
    density: { min: 1, max: 11 },
    magicPower: { min: 55, max: 65 },
  },
  {
    id: 'rooted-night',
    name: 'Rooted Night',
    difficulty: 'Medium',
    temperature: { min: -18, max: -8 },
    density: { min: 14, max: 24 },
    magicPower: { min: 55, max: 65 },
  },
  {
    id: 'phoenix-pulse',
    name: 'Phoenix Pulse',
    difficulty: 'Hard',
    temperature: { min: 57, max: 67 },
    density: { min: 0, max: 10 },
    magicPower: { min: 37, max: 47 },
  },
  {
    id: 'slime-crown',
    name: 'Slime Crown',
    difficulty: 'Hard',
    temperature: { min: -5, max: 5 },
    density: { min: 45, max: 55 },
    magicPower: { min: 3, max: 13 },
  },
  {
    id: 'void-flame',
    name: 'Void Flame',
    difficulty: 'Hard',
    temperature: { min: 25, max: 35 },
    density: { min: 0, max: 10 },
    magicPower: { min: 60, max: 70 },
  },
  {
    id: 'acid-bog',
    name: 'Acid Bog',
    difficulty: 'Hard',
    temperature: { min: 10, max: 20 },
    density: { min: 39, max: 49 },
    magicPower: { min: 17, max: 27 },
  },
  {
    id: 'frozen-ash',
    name: 'Frozen Ash',
    difficulty: 'Hard',
    temperature: { min: 27, max: 37 },
    density: { min: 0, max: 10 },
    magicPower: { min: 39, max: 49 },
  },
  {
    id: 'triple-eclipse',
    name: 'Triple Eclipse',
    difficulty: 'Hard',
    temperature: { min: -20, max: -10 },
    density: { min: 19, max: 29 },
    magicPower: { min: 60, max: 70 },
  },
  {
    id: 'ember-soup',
    name: 'Ember Soup',
    difficulty: 'Hard',
    temperature: { min: 62, max: 72 },
    density: { min: 24, max: 34 },
    magicPower: { min: 37, max: 47 },
  },
];

export const LEVEL_ONE_DIFFICULTY: Difficulty = 'Medium';
export const LEVEL_ONE_RECIPE_TOLERANCE = 8;
export const STARTING_TIME_SECONDS = 150;
export const STARTING_LIVES = 3;
export const SCORE_PER_BREW = 200;
export const TIME_BONUS_SECONDS = 10;

export interface DifficultySettings {
  shelfSize: number;
  cauldronCapacity: number;
  startTimeSeconds: number;
  tolerance: number;
  startingLives: number;
  scorePerBrew: number;
  timeBonusSeconds: number;
  reactionCount: number;
}

export const DIFFICULTY_SETTINGS: Readonly<Record<Difficulty, DifficultySettings>> = {
  Easy: {
    shelfSize: 4,
    cauldronCapacity: 5,
    startTimeSeconds: 180,
    tolerance: 12,
    startingLives: 5,
    scorePerBrew: 150,
    timeBonusSeconds: 15,
    reactionCount: 0,
  },
  Medium: {
    shelfSize: 6,
    cauldronCapacity: 4,
    startTimeSeconds: STARTING_TIME_SECONDS,
    tolerance: LEVEL_ONE_RECIPE_TOLERANCE,
    startingLives: STARTING_LIVES,
    scorePerBrew: SCORE_PER_BREW,
    timeBonusSeconds: TIME_BONUS_SECONDS,
    reactionCount: 2,
  },
  Hard: {
    shelfSize: 8,
    cauldronCapacity: 3,
    startTimeSeconds: 150,
    tolerance: 5,
    startingLives: 3,
    scorePerBrew: 300,
    timeBonusSeconds: 10,
    reactionCount: 3,
  },
};

export function getRecipesByDifficulty(difficulty: Difficulty): readonly Recipe[] {
  return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

export function pickRandomRecipe(
  difficulty: Difficulty = LEVEL_ONE_DIFFICULTY,
  random: () => number = Math.random,
): Recipe {
  const availableRecipes = getRecipesByDifficulty(difficulty);
  const randomIndex = Math.floor(random() * availableRecipes.length);
  const recipe = availableRecipes[randomIndex];

  if (!recipe) {
    throw new Error(`No recipes are available for ${difficulty} difficulty.`);
  }

  return recipe;
}
