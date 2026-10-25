import { INGREDIENTS, type IngredientId } from '../data/ingredients';
import { DIFFICULTY_SETTINGS, type Difficulty } from '../data/recipes';
import { calculateCauldron, type CauldronValues } from './cauldron-values';
import type { GameState } from '../state/game-state';

export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'Easy'>;
  isActive: (ingredients: readonly IngredientId[]) => boolean;
  apply: (values: CauldronValues) => CauldronValues;
  timeCostSeconds?: number;
  lifeCost?: number;
  clearsCauldron?: boolean;
}

const includesIngredients =
  (...ingredientIds: IngredientId[]) =>
  (ingredients: readonly IngredientId[]): boolean =>
    ingredientIds.every((ingredientId) => ingredients.includes(ingredientId));

const hasTemperaturePair = (ingredients: readonly IngredientId[]): boolean => {
  const temperatures = ingredients.map((ingredientId) => {
    const ingredient = INGREDIENTS.find((item) => item.id === ingredientId);
    if (!ingredient) {
      throw new Error(`Unknown cauldron ingredient: ${ingredientId}`);
    }
    return ingredient.temperature;
  });
  return (
    temperatures.some((temperature) => temperature > 15) &&
    temperatures.some((temperature) => temperature < -15)
  );
};

export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    difficulty: 'Medium',
    isActive: includesIngredients('fairy-dust', 'caustic-acid'),
    apply: (values) => ({ ...values, magicPower: values.magicPower * 1.5 }),
    timeCostSeconds: 10,
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    difficulty: 'Hard',
    isActive: includesIngredients('phoenix-feather', 'essence-of-the-void'),
    apply: (values) => values,
    lifeCost: 1,
    clearsCauldron: true,
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    difficulty: 'Medium',
    isActive: includesIngredients('dragon-tears', 'frost-lotus'),
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: values.density * 1.2,
    }),
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    difficulty: 'Hard',
    isActive: includesIngredients('mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: values.density * 1.25,
      magicPower: values.magicPower * 0.9,
    }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    difficulty: 'Hard',
    isActive: includesIngredients('phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: values.magicPower * 1.25,
    }),
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    difficulty: 'Hard',
    isActive: hasTemperaturePair,
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: values.density * 2,
    }),
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    difficulty: 'Hard',
    isActive: (ingredients) => calculateCauldron(ingredients).density >= 70,
    apply: (values) => ({
      ...values,
      density: 70,
      magicPower: values.magicPower * 1.1,
    }),
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    difficulty: 'Hard',
    isActive: (ingredients) => calculateCauldron(ingredients).temperature >= 60,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.2,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    difficulty: 'Hard',
    isActive: (ingredients) => calculateCauldron(ingredients).temperature <= -20,
    apply: (values) => ({
      ...values,
      density: values.density * 1.15,
      magicPower: values.magicPower * 0.85,
    }),
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    difficulty: 'Hard',
    isActive: (ingredients) => calculateCauldron(ingredients).magicPower >= 80,
    apply: (values) => ({
      ...values,
      magicPower: 80,
      temperature: values.temperature + 5,
    }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    difficulty: 'Hard',
    isActive: (ingredients) =>
      includesIngredients('dragon-tears', 'caustic-acid')(ingredients) &&
      calculateCauldron(ingredients).temperature >= 35,
    apply: (values) => ({ ...values, temperature: values.temperature + 10 }),
    timeCostSeconds: 5,
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    difficulty: 'Hard',
    isActive: (ingredients) =>
      includesIngredients('frost-lotus', 'essence-of-the-void')(ingredients) &&
      calculateCauldron(ingredients).density <= 0,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 10,
      magicPower: values.magicPower * 1.2,
    }),
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    difficulty: 'Hard',
    isActive: (ingredients) =>
      includesIngredients('fairy-dust', 'toad-slime')(ingredients) &&
      calculateCauldron(ingredients).density >= 40,
    apply: (values) => ({
      ...values,
      density: values.density * 1.2,
      magicPower: values.magicPower * 1.1,
    }),
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    difficulty: 'Hard',
    isActive: (ingredients) =>
      includesIngredients('mandrake-root', 'phoenix-feather')(ingredients) &&
      calculateCauldron(ingredients).temperature >= 40,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 15,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    difficulty: 'Hard',
    isActive: (ingredients) =>
      includesIngredients('essence-of-the-void', 'dragon-tears')(ingredients) &&
      calculateCauldron(ingredients).magicPower >= 50,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.3,
      temperature: values.temperature - 5,
    }),
  },
];

export function getReactionsForDifficulty(difficulty: Difficulty): readonly IReaction[] {
  return REACTIONS.filter((reaction) => reaction.difficulty === difficulty).slice(
    0,
    DIFFICULTY_SETTINGS[difficulty].reactionCount,
  );
}

export function getActiveReactions(
  ingredients: readonly IngredientId[],
  difficulty: Difficulty,
): readonly IReaction[] {
  return getReactionsForDifficulty(difficulty).filter((reaction) => reaction.isActive(ingredients));
}

export function calculateCauldronWithReactions(
  ingredients: readonly IngredientId[],
  difficulty: Difficulty,
): CauldronValues {
  return getActiveReactions(ingredients, difficulty).reduce(
    (values, reaction) => reaction.apply(values),
    calculateCauldron(ingredients),
  );
}

export function applyNewReactionEffects(
  state: GameState,
  previousIngredients: readonly IngredientId[],
): readonly string[] {
  const before = new Set(
    getActiveReactions(previousIngredients, state.difficulty).map((reaction) => reaction.id),
  );
  const newlyActive = getActiveReactions(state.cauldronIngredients, state.difficulty).filter(
    (reaction) => !before.has(reaction.id),
  );

  for (const reaction of newlyActive) {
    state.timeRemainingMs = Math.max(
      0,
      state.timeRemainingMs - (reaction.timeCostSeconds ?? 0) * 1000,
    );
    state.lives = Math.max(0, state.lives - (reaction.lifeCost ?? 0));
    if (reaction.clearsCauldron) {
      state.cauldronIngredients = [];
    }
  }

  return newlyActive.map((reaction) => reaction.name);
}
