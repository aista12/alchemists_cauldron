import type { IngredientIcon } from '../data/ingredients';

const ICON_ART: Record<IngredientIcon, string> = {
  drop: '<path d="M20 3C17 8 9 15 9 21a11 11 0 0 0 22 0c0-6-8-13-11-18Z"/><path d="M15 23a5 5 0 0 0 5 5"/>',
  spark:
    '<path d="m20 3 3.6 12.4L36 19l-12.4 3.6L20 35l-3.6-12.4L4 19l12.4-3.6L20 3Z"/><path d="m32 27 1.5 5.5L39 34l-5.5 1.5L32 41l-1.5-5.5L25 34l5.5-1.5L32 27Z"/>',
  flower:
    '<path d="M20 18c-8-12 8-16 8 0 12-8 16 8 0 8 8 12-8 16-8 0-12 8-16-8 0-8Z"/><circle cx="24" cy="22" r="3"/><path d="M24 29v8m0-4c-5 0-8-2-10-5"/>',
  root: '<path d="M23 5v18m0-11c-6-5-10-4-12-2 2 5 6 7 12 7m0-1c5-7 10-8 14-6-1 6-6 10-14 10"/><path d="M23 23c-1 6-7 10-5 16m5-13c4 4 2 9 5 13m-7-9c-4 1-7 4-8 8m12-12c5 1 8 4 9 8"/>',
  flask:
    '<path d="M16 4h16m-12 0v12L11 31a5 5 0 0 0 4 7h18a5 5 0 0 0 4-7l-9-15V4"/><path d="M15 28h18m-14-5h10"/>',
  moon: '<path d="M31 7a16 16 0 1 0 5 29A17 17 0 0 1 31 7Z"/><path d="m14 14 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Zm20 7 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z"/>',
  feather:
    '<path d="M36 5C23 5 9 13 9 28c0 6 4 10 9 10 15 0 23-14 23-27 0-4-1-6-5-6Z"/><path d="M8 40c8-12 17-20 29-29M17 31l-1-8m9 1-1-8m1 17 8-1"/>',
  slime:
    '<path d="M7 31c2-6 6-7 8-14 2 5 5 5 8 1 2 5 5 6 8 2 1 7 5 8 6 13a15 15 0 0 1-30-2Z"/><path d="M16 30h.1m15 0h.1m-12 6c3 2 7 2 10 0"/>',
};

export function renderIngredientIcon(icon: IngredientIcon): string {
  return `<svg class="ingredient-icon__art" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.7">${ICON_ART[icon]}</svg>`;
}
