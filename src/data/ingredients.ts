import { DIFFICULTY_SETTINGS, type Difficulty } from './recipes';

export const INGREDIENTS = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    temperature: 25,
    density: 8,
    magicPower: 10,
    icon: 'drop',
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    temperature: 12,
    density: 9,
    magicPower: 12,
    icon: 'spark',
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    temperature: -18,
    density: 4,
    magicPower: 14,
    icon: 'flower',
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    temperature: -5,
    density: 20,
    magicPower: 8,
    icon: 'root',
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    temperature: 10,
    density: 14,
    magicPower: 22,
    icon: 'flask',
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    temperature: -20,
    density: -10,
    magicPower: 40,
    icon: 'moon',
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    temperature: 50,
    density: -10,
    magicPower: 30,
    icon: 'feather',
  },
  {
    id: 'toad-slime',
    name: 'Toad Slime',
    temperature: 5,
    density: 30,
    magicPower: 0,
    icon: 'slime',
  },
] as const;

export const LEVEL_ONE_INGREDIENT_COUNT = 6;
export const CAULDRON_CAPACITY = 4;

export type Ingredient = (typeof INGREDIENTS)[number];
export type IngredientId = Ingredient['id'];
export type IngredientIcon = Ingredient['icon'];

export const SHELF_INGREDIENTS = INGREDIENTS.slice(
  0,
  LEVEL_ONE_INGREDIENT_COUNT,
) as readonly Ingredient[];

export function getShelfIngredients(difficulty: Difficulty): readonly Ingredient[] {
  return INGREDIENTS.slice(0, DIFFICULTY_SETTINGS[difficulty].shelfSize);
}
