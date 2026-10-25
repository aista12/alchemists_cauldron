import {
  CAULDRON_CAPACITY,
  SHELF_INGREDIENTS,
  type Ingredient,
  type IngredientId,
} from '../data/ingredients';
import { addIngredient, clearCauldron } from '../logic/cauldron';
import { createGameState } from '../state/game-state';
import { renderIngredientIcon } from './ingredient-icons';

const signed = (value: number): string => (value > 0 ? `+${value}` : `${value}`);

function renderShelfCard(ingredient: Ingredient, stock: number, blocked: boolean): string {
  const empty = stock <= 0;
  const disabled = empty || blocked;

  return `
    <button
      class="ingredient-card${empty ? ' ingredient-card--empty' : ''}"
      type="button"
      data-ingredient-id="${ingredient.id}"
      aria-label="${ingredient.name}, temperature ${signed(ingredient.temperature)}, density ${signed(ingredient.density)}, magic power ${signed(ingredient.magicPower)}, stock ${stock}"
      ${disabled ? 'disabled' : ''}
    >
      <span class="ingredient-card__stock" aria-label="Stock ${stock}">${stock}</span>
      <span class="ingredient-card__icon">${empty ? '' : renderIngredientIcon(ingredient.icon)}</span>
      <span class="ingredient-card__name">${ingredient.name}</span>
      <span class="ingredient-card__values">
        <span title="Temperature"><i class="value-mark value-mark--temperature">T</i>${signed(ingredient.temperature)}</span>
        <span title="Density"><i class="value-mark value-mark--density">D</i>${signed(ingredient.density)}</span>
        <span title="Magic Power"><i class="value-mark value-mark--magic">✦</i>${signed(ingredient.magicPower)}</span>
      </span>
    </button>
  `;
}

function renderCauldronSlot(ingredientId: IngredientId | undefined, index: number): string {
  const ingredient = SHELF_INGREDIENTS.find((item) => item.id === ingredientId);

  if (!ingredient) {
    return `<div class="cauldron-slot cauldron-slot--empty" aria-label="Empty cauldron slot ${index + 1}"><span>${index + 1}</span></div>`;
  }

  return `
    <div class="cauldron-slot" aria-label="${ingredient.name}, slot ${index + 1}">
      <span class="cauldron-slot__icon">${renderIngredientIcon(ingredient.icon)}</span>
      <span class="cauldron-slot__name">${ingredient.name}</span>
    </div>
  `;
}

export function mountGameScreen(root: HTMLElement): void {
  const state = createGameState();

  root.innerHTML = `
    <main class="game-room">
      <header class="room-header">
        <a class="game-title" href="./">
          <span class="game-title__sigil" aria-hidden="true">✧</span>
          <span>Alchemist's <em>Cauldron</em></span>
        </a>
        <div class="room-header__location"><span>✦</span> The quiet atelier</div>
        <div class="room-header__day">FIELD NOTES <span>01</span></div>
      </header>

      <section class="atelier" aria-label="Alchemist's room">
        <div class="atelier__wall">
          <div class="window-view" aria-label="View through the window to a mountain valley">
            <div class="window-view__sky"></div>
            <div class="window-view__sun"></div>
            <div class="window-view__cloud window-view__cloud--one"></div>
            <div class="window-view__cloud window-view__cloud--two"></div>
            <div class="window-view__mountain window-view__mountain--far"></div>
            <div class="window-view__mountain window-view__mountain--near"></div>
            <div class="window-view__hill"></div>
            <div class="window-view__tree window-view__tree--one"></div>
            <div class="window-view__tree window-view__tree--two"></div>
            <div class="window-view__village"></div>
            <span class="window-view__caption">A quiet morning in Mondstadt</span>
            <span class="window-view__frame window-view__frame--vertical"></span>
            <span class="window-view__frame window-view__frame--horizontal"></span>
          </div>
          <div class="wall-shelf wall-shelf--left" aria-hidden="true">
            <span>✧</span><span>♧</span><span>◈</span>
          </div>
          <div class="wall-shelf wall-shelf--right" aria-hidden="true">
            <span>⌕</span><span>✦</span><span>♧</span>
          </div>
          <div class="atelier__note">
            <span class="atelier__note-mark">✦</span>
            <span>Every journey begins<br />with a curious mind.</span>
          </div>
        </div>

        <div class="worktable" aria-hidden="true">
          <span class="worktable__edge"></span>
        </div>

        <section class="workbench" aria-label="Cauldron">
          <div class="workbench__label">
            <span class="workbench__ornament"></span>
            <h1>Wayfarer's Cauldron</h1>
            <span class="workbench__ornament"></span>
          </div>
          <div class="cauldron-bowl" aria-hidden="true">
            <span class="cauldron-bowl__steam cauldron-bowl__steam--one"></span>
            <span class="cauldron-bowl__steam cauldron-bowl__steam--two"></span>
            <span class="cauldron-bowl__steam cauldron-bowl__steam--three"></span>
            <span class="cauldron-bowl__rim"></span>
            <span class="cauldron-bowl__body"><span>✧</span></span>
            <span class="cauldron-bowl__foot cauldron-bowl__foot--left"></span>
            <span class="cauldron-bowl__foot cauldron-bowl__foot--right"></span>
          </div>
          <p class="workbench__hint" data-status aria-live="polite">Choose ingredients from your shelf to begin.</p>
          <div class="recipe-counter">
            <span class="recipe-counter__label">Ingredients</span>
            <span class="recipe-counter__count" data-counter>0 <i>/</i> ${CAULDRON_CAPACITY}</span>
          </div>
          <div class="cauldron-slots" data-cauldron aria-live="polite"></div>
          <button class="clear-button" type="button" data-clear disabled>Empty cauldron</button>
        </section>

        <section class="ingredient-shelf" aria-label="Ingredient shelf">
          <div class="ingredient-shelf__header">
            <div>
              <span class="ingredient-shelf__eyebrow">YOUR FIELD COLLECTION</span>
              <h2>Ingredients</h2>
            </div>
            <p>Choose a material to add it to the cauldron.</p>
          </div>
          <div class="ingredient-grid" data-shelf></div>
          <p class="shelf-message" data-shelf-message aria-live="polite"></p>
        </section>
      </section>
      <footer class="room-footer">
        <span>✧ &nbsp; ALCHEMY JOURNAL</span>
        <span>Ingredients are precious. Each addition uses one portion.</span>
        <span>MONDSTADT · 09:15</span>
      </footer>
    </main>
  `;

  const shelf = root.querySelector<HTMLDivElement>('[data-shelf]');
  const cauldron = root.querySelector<HTMLDivElement>('[data-cauldron]');
  const counter = root.querySelector<HTMLSpanElement>('[data-counter]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]');
  const status = root.querySelector<HTMLParagraphElement>('[data-status]');
  const shelfMessage = root.querySelector<HTMLParagraphElement>('[data-shelf-message]');

  if (!shelf || !cauldron || !counter || !clearButton || !status || !shelfMessage) {
    throw new Error('The alchemy screen is missing required elements.');
  }

  const render = (): void => {
    const isFull = state.cauldronIngredients.length >= CAULDRON_CAPACITY;
    shelf.innerHTML = SHELF_INGREDIENTS.map((ingredient) =>
      renderShelfCard(ingredient, state.shelfStock[ingredient.id] ?? 0, isFull),
    ).join('');
    cauldron.innerHTML = Array.from({ length: CAULDRON_CAPACITY }, (_, index) =>
      renderCauldronSlot(state.cauldronIngredients[index], index),
    ).join('');
    counter.innerHTML = `${state.cauldronIngredients.length} <i>/</i> ${CAULDRON_CAPACITY}`;
    clearButton.disabled = state.cauldronIngredients.length === 0;
    clearButton.setAttribute(
      'aria-label',
      `Empty cauldron; ${state.cauldronIngredients.length} ingredients will be discarded`,
    );
    shelfMessage.textContent = isFull ? 'The cauldron is full. Empty it before adding more.' : '';
    shelf.classList.toggle('ingredient-grid--blocked', isFull);
  };

  root.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    const ingredientButton = target.closest<HTMLButtonElement>('[data-ingredient-id]');
    if (ingredientButton && !ingredientButton.disabled) {
      const ingredient = SHELF_INGREDIENTS.find(
        (item) => item.id === ingredientButton.dataset.ingredientId,
      );
      if (ingredient && addIngredient(state, ingredient.id)) {
        status.textContent = `${ingredient.name} added to the cauldron.`;
        render();
      }
      return;
    }

    if (target.closest('[data-clear]') && !clearButton.disabled) {
      const spentIngredients = state.cauldronIngredients.length;
      clearCauldron(state);
      status.textContent = `${spentIngredients} ingredient${spentIngredients === 1 ? '' : 's'} discarded. Shelf stock is unchanged.`;
      render();
    }
  });

  render();
}
