import {
  CAULDRON_CAPACITY,
  SHELF_INGREDIENTS,
  type Ingredient,
  type IngredientId,
} from '../data/ingredients';
import { STARTING_LIVES, STARTING_TIME_SECONDS, type Recipe } from '../data/recipes';
import {
  addIngredient,
  calculateCauldron,
  brewCauldron,
  clearCauldron,
  type CauldronValues,
} from '../logic/cauldron';
import { createGameState, startNewGame, type GameState } from '../state/game-state';
import { clearSavedGame, readSavedGame, restoreSavedGame, saveGame } from '../storage/game-save';
import { renderIngredientIcon } from './ingredient-icons';

const signed = (value: number): string => (value > 0 ? `+${value}` : `${value}`);

function formatTime(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

interface ParameterBarDefinition {
  key: keyof CauldronValues;
  label: string;
  domain: { min: number; max: number };
}

const PARAMETER_BARS: readonly ParameterBarDefinition[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    domain: { min: -100, max: 100 },
  },
  {
    key: 'density',
    label: 'Density',
    domain: { min: -80, max: 80 },
  },
  {
    key: 'magicPower',
    label: 'Magic Power',
    domain: { min: 0, max: 160 },
  },
];

const GAME_OVER_MESSAGES = {
  time: 'Time ran out.',
  lives: 'No lives remain.',
  ingredients: 'Out of ingredients.',
} as const;

function toTrackPosition(value: number, domain: ParameterBarDefinition['domain']): number {
  return Math.min(100, Math.max(0, ((value - domain.min) / (domain.max - domain.min)) * 100));
}

function renderParameterBar(definition: ParameterBarDefinition, recipe: Recipe | null): string {
  const zeroPosition = toTrackPosition(0, definition.domain);
  const target = recipe?.[definition.key];
  const targetStart = target ? toTrackPosition(target.min, definition.domain) : zeroPosition;
  const targetEnd = target ? toTrackPosition(target.max, definition.domain) : zeroPosition;
  const targetLabel = target ? `Target ${signed(target.min)}–${signed(target.max)}` : 'Target —';

  return `
    <div
      class="parameter-bar"
      data-parameter="${definition.key}"
      role="group"
      aria-label="${definition.label}"
      style="--zero-position: ${zeroPosition}%; --target-start: ${targetStart}%; --target-width: ${targetEnd - targetStart}%; --current-position: ${zeroPosition}%"
    >
      <div class="parameter-bar__heading">
        <span class="parameter-bar__name">${definition.label}</span>
        <span class="parameter-bar__values">
              <output class="parameter-bar__current" data-current-value aria-label="Current value">0</output>
          <span class="parameter-bar__target-label">${targetLabel}</span>
        </span>
      </div>
      <div class="parameter-bar__track" aria-hidden="true">
        <span class="parameter-bar__zero"></span>
        <span class="parameter-bar__target"></span>
        <span class="parameter-bar__marker"></span>
      </div>
    </div>
  `;
}

function renderShelfCard(ingredient: Ingredient, stock: number, blocked: boolean): string {
  const empty = stock <= 0;
  const disabled = empty || blocked;

  return `
    <button
      class="ingredient-card ingredient-card--${ingredient.id}${empty ? ' ingredient-card--empty' : ''}"
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
  let state = createGameState();

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
            <div class="window-view__tree window-view__tree--small window-view__tree--three"></div>
            <div class="window-view__tree window-view__tree--one"></div>
            <div class="window-view__tree window-view__tree--small window-view__tree--four"></div>
            <div class="window-view__tree window-view__tree--small window-view__tree--five"></div>
            <div class="window-view__tree window-view__tree--small window-view__tree--six"></div>
            <div class="window-view__tree window-view__tree--two"></div>
            <div class="window-view__tree window-view__tree--small window-view__tree--seven"></div>
            <div class="window-view__village"></div>
            <span class="window-view__caption">A quiet morning in Mondstadt</span>
            <span class="window-view__handle" aria-hidden="true"></span>
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
          <section class="parameter-bars" data-parameter-bars aria-label="Active recipe and cauldron values">
            <div class="run-hud" data-run-hud hidden>
              <div class="run-hud__timer" data-timer>
                <span class="run-hud__item">TIME <output data-time>02:30</output></span>
                <div
                  class="timer-bar"
                  data-time-progress
                  role="progressbar"
                  aria-label="Time remaining"
                  aria-valuemin="0"
                  aria-valuemax="${STARTING_TIME_SECONDS}"
                  aria-valuenow="${STARTING_TIME_SECONDS}"
                >
                  <span data-time-bar></span>
                </div>
              </div>
              <span class="run-hud__item">SCORE <output data-score>0</output></span>
              <span class="run-hud__item run-hud__lives" data-lives aria-label="Lives: 3">♥ ♥ ♥</span>
            </div>
            <h2 class="parameter-bars__heading">
              <span>Current recipe</span>
              <span class="parameter-bars__recipe" data-recipe-name>Begin your run</span>
            </h2>
            ${PARAMETER_BARS.map((definition) => renderParameterBar(definition, null)).join('')}
            <div class="recipe-counter" data-recipe-counter>
              <span class="recipe-counter__label">Ingredients</span>
              <span class="recipe-counter__count" data-counter>0 <i>/</i> ${CAULDRON_CAPACITY}</span>
            </div>
          </section>
          <p class="workbench__hint" data-status aria-live="polite">Begin a run to receive your recipe.</p>
          <div class="run-start-actions" data-run-start-actions>
            <button class="start-game-button" type="button" data-start-game>Start Game</button>
            <button class="continue-game-button" type="button" data-continue-game hidden>Continue Game</button>
          </div>
          <button class="pause-game-button" type="button" data-pause hidden>Pause</button>
          <button class="brew-button" type="button" data-brew hidden disabled>Brew</button>
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
    <dialog class="run-dialog" data-run-dialog aria-labelledby="run-dialog-title">
      <section data-pause-panel>
        <span class="run-dialog__eyebrow">ALCHEMY PAUSED</span>
        <h2 id="run-dialog-title">Pause</h2>
        <div class="run-dialog__actions">
          <button class="run-dialog__button" type="button" data-resume>Resume</button>
          <button class="run-dialog__button run-dialog__button--secondary" type="button" data-exit-menu>
            Exit to Menu
          </button>
        </div>
      </section>
      <section data-game-over-panel hidden>
        <span class="run-dialog__eyebrow">ALCHEMY JOURNAL</span>
        <h2 id="game-over-title">Game Over</h2>
        <p data-game-over-reason></p>
        <p class="run-dialog__score">Final score <output data-final-score>0</output></p>
        <button class="run-dialog__button" type="button" data-play-again>Play again</button>
      </section>
    </dialog>
  `;

  const shelf = root.querySelector<HTMLDivElement>('[data-shelf]');
  const cauldron = root.querySelector<HTMLDivElement>('[data-cauldron]');
  const counter = root.querySelector<HTMLSpanElement>('[data-counter]');
  const clearButton = root.querySelector<HTMLButtonElement>('[data-clear]');
  const runStartActions = root.querySelector<HTMLDivElement>('[data-run-start-actions]');
  const startButton = root.querySelector<HTMLButtonElement>('[data-start-game]');
  const continueButton = root.querySelector<HTMLButtonElement>('[data-continue-game]');
  const pauseButton = root.querySelector<HTMLButtonElement>('[data-pause]');
  const brewButton = root.querySelector<HTMLButtonElement>('[data-brew]');
  const status = root.querySelector<HTMLParagraphElement>('[data-status]');
  const shelfMessage = root.querySelector<HTMLParagraphElement>('[data-shelf-message]');
  const parameterBars = root.querySelector<HTMLElement>('[data-parameter-bars]');
  const recipeName = root.querySelector<HTMLSpanElement>('[data-recipe-name]');
  const recipeCounter = root.querySelector<HTMLDivElement>('[data-recipe-counter]');
  const runHud = root.querySelector<HTMLDivElement>('[data-run-hud]');
  const timeOutput = root.querySelector<HTMLOutputElement>('[data-time]');
  const scoreOutput = root.querySelector<HTMLOutputElement>('[data-score]');
  const livesOutput = root.querySelector<HTMLSpanElement>('[data-lives]');
  const timer = root.querySelector<HTMLDivElement>('[data-timer]');
  const timeProgress = root.querySelector<HTMLDivElement>('[data-time-progress]');
  const timeBar = root.querySelector<HTMLSpanElement>('[data-time-bar]');
  const runDialog = root.querySelector<HTMLDialogElement>('[data-run-dialog]');
  const pausePanel = root.querySelector<HTMLElement>('[data-pause-panel]');
  const gameOverPanel = root.querySelector<HTMLElement>('[data-game-over-panel]');
  const gameOverReason = root.querySelector<HTMLParagraphElement>('[data-game-over-reason]');
  const finalScoreOutput = root.querySelector<HTMLOutputElement>('[data-final-score]');

  if (
    !shelf ||
    !cauldron ||
    !counter ||
    !clearButton ||
    !runStartActions ||
    !startButton ||
    !continueButton ||
    !pauseButton ||
    !brewButton ||
    !status ||
    !shelfMessage ||
    !parameterBars ||
    !recipeName ||
    !recipeCounter ||
    !runHud ||
    !timeOutput ||
    !scoreOutput ||
    !livesOutput ||
    !timer ||
    !timeProgress ||
    !timeBar ||
    !runDialog ||
    !pausePanel ||
    !gameOverPanel ||
    !gameOverReason ||
    !finalScoreOutput
  ) {
    throw new Error('The alchemy screen is missing required elements.');
  }

  const parameterBarElements = PARAMETER_BARS.map((definition) => {
    const bar = parameterBars.querySelector<HTMLDivElement>(`[data-parameter="${definition.key}"]`);
    const currentValue = bar?.querySelector<HTMLOutputElement>('[data-current-value]');
    const targetLabel = bar?.querySelector<HTMLSpanElement>('.parameter-bar__target-label');

    if (!bar || !currentValue || !targetLabel) {
      throw new Error(`The ${definition.label} bar is missing required elements.`);
    }

    return { definition, bar, currentValue, targetLabel };
  });

  const savedGameResult = readSavedGame();
  let availableSave = savedGameResult.status === 'available' ? savedGameResult.game : null;
  let lastSaveAt = 0;
  let endTime: number | null = null;

  if (savedGameResult.status === 'invalid') {
    status.textContent = 'A saved run was damaged and could not be restored.';
  } else if (savedGameResult.status === 'unavailable') {
    status.textContent = 'Saved runs are unavailable in this browser session.';
  }

  const render = (): void => {
    const hasActiveRun = state.hasStarted && !state.isGameOver;
    const isPlaying = hasActiveRun && !state.isPaused;
    const isFull = state.cauldronIngredients.length >= CAULDRON_CAPACITY;
    const currentValues = calculateCauldron(state.cauldronIngredients);
    const recipe = state.activeRecipe;

    parameterBarElements.forEach(({ definition, bar, currentValue, targetLabel }) => {
      const value = currentValues[definition.key];
      const target = recipe?.[definition.key];
      const inTargetRange = target !== undefined && value >= target.min && value <= target.max;
      const zeroPosition = toTrackPosition(0, definition.domain);
      const targetStart = target ? toTrackPosition(target.min, definition.domain) : zeroPosition;
      const targetEnd = target ? toTrackPosition(target.max, definition.domain) : zeroPosition;

      currentValue.value = `${value}`;
      currentValue.textContent = signed(value);
      bar.style.setProperty('--current-position', `${toTrackPosition(value, definition.domain)}%`);
      bar.style.setProperty('--target-start', `${targetStart}%`);
      bar.style.setProperty('--target-width', `${targetEnd - targetStart}%`);
      bar.classList.toggle('parameter-bar--in-range', inTargetRange);
      bar.setAttribute(
        'aria-label',
        target
          ? `${definition.label}: ${value}. Target range ${target.min} to ${target.max}.`
          : `${definition.label}: ${value}. No active recipe.`,
      );
      targetLabel.textContent = target
        ? `Target ${signed(target.min)}–${signed(target.max)}`
        : 'Target —';
    });

    recipeName.textContent = recipe ? `${recipe.name} · ${recipe.difficulty}` : 'Begin your run';
    shelf.innerHTML = SHELF_INGREDIENTS.map((ingredient) =>
      renderShelfCard(ingredient, state.shelfStock[ingredient.id] ?? 0, isFull || !isPlaying),
    ).join('');
    cauldron.innerHTML = Array.from({ length: CAULDRON_CAPACITY }, (_, index) =>
      renderCauldronSlot(state.cauldronIngredients[index], index),
    ).join('');
    counter.innerHTML = `${state.cauldronIngredients.length} <i>/</i> ${CAULDRON_CAPACITY}`;
    recipeCounter.classList.toggle('recipe-counter--full', isFull);
    clearButton.disabled = !isPlaying || state.cauldronIngredients.length === 0;
    clearButton.hidden = !isPlaying || state.cauldronIngredients.length === 0;
    clearButton.setAttribute(
      'aria-label',
      `Empty cauldron; ${state.cauldronIngredients.length} ingredients will be discarded`,
    );
    runStartActions.hidden = state.hasStarted;
    startButton.textContent = state.isGameOver ? 'Start a New Run' : 'Start Game';
    continueButton.hidden = availableSave === null || state.hasStarted;
    pauseButton.hidden = !hasActiveRun;
    pauseButton.textContent = state.isPaused ? 'Resume' : 'Pause';
    pauseButton.setAttribute('aria-pressed', `${state.isPaused}`);
    brewButton.hidden = !hasActiveRun;
    brewButton.disabled = !isPlaying || state.cauldronIngredients.length === 0;
    runHud.hidden = !state.hasStarted;
    timeOutput.value = formatTime(state.timeRemainingMs);
    timeOutput.textContent = formatTime(state.timeRemainingMs);
    const timeRatio = Math.max(
      0,
      Math.min(1, state.timeRemainingMs / (STARTING_TIME_SECONDS * 1000)),
    );
    timeBar.style.width = `${timeRatio * 100}%`;
    timeProgress.setAttribute('aria-valuenow', `${Math.ceil(state.timeRemainingMs / 1000)}`);
    timer.classList.toggle('run-hud__timer--urgent', state.timeRemainingMs < 15_000);
    scoreOutput.value = `${state.score}`;
    scoreOutput.textContent = `${state.score}`;
    livesOutput.textContent = Array.from({ length: STARTING_LIVES }, (_, index) =>
      index < state.lives ? '♥' : '♡',
    ).join(' ');
    livesOutput.setAttribute('aria-label', `Lives: ${state.lives}`);
    recipeCounter.setAttribute(
      'aria-label',
      `Ingredients: ${state.cauldronIngredients.length} / ${CAULDRON_CAPACITY}`,
    );
    shelfMessage.textContent = isFull ? 'The cauldron is full. Empty it before adding more.' : '';
    shelf.classList.toggle('ingredient-grid--blocked', isFull);
    pausePanel.hidden = state.isGameOver;
    gameOverPanel.hidden = !state.isGameOver;
    runDialog.setAttribute(
      'aria-labelledby',
      state.isGameOver ? 'game-over-title' : 'run-dialog-title',
    );
    if (state.gameOverReason) {
      gameOverReason.textContent = GAME_OVER_MESSAGES[state.gameOverReason];
    }
    finalScoreOutput.value = `${state.score}`;
    finalScoreOutput.textContent = `${state.score}`;

    if ((state.isPaused || state.isGameOver) && !runDialog.open && !document.hidden) {
      runDialog.showModal();
    } else if (!state.isPaused && !state.isGameOver && runDialog.open) {
      runDialog.close();
    }
  };

  let timerHandle: number | undefined;

  const stopTimer = (): void => {
    if (timerHandle !== undefined) {
      window.clearInterval(timerHandle);
      timerHandle = undefined;
    }
  };

  const updateTimeDisplay = (): void => {
    timeOutput.value = formatTime(state.timeRemainingMs);
    timeOutput.textContent = formatTime(state.timeRemainingMs);
    const timeRatio = Math.max(
      0,
      Math.min(1, state.timeRemainingMs / (STARTING_TIME_SECONDS * 1000)),
    );
    timeBar.style.width = `${timeRatio * 100}%`;
    timeProgress.setAttribute('aria-valuenow', `${Math.ceil(state.timeRemainingMs / 1000)}`);
    timer.classList.toggle('run-hud__timer--urgent', state.timeRemainingMs < 15_000);
  };

  const persistProgress = (): void => {
    if (state.hasStarted && !state.isGameOver && !saveGame(state)) {
      status.textContent = 'Progress could not be saved in this browser session.';
    }
  };

  const finishSavedProgress = (): void => {
    availableSave = null;
    if (!clearSavedGame()) {
      status.textContent += ' Saved progress could not be cleared.';
    }
  };

  const endRun = (reason: NonNullable<GameState['gameOverReason']>): void => {
    state.isGameOver = true;
    state.isPaused = false;
    state.gameOverReason = reason;
    endTime = null;
    stopTimer();
    status.textContent = GAME_OVER_MESSAGES[reason];
    finishSavedProgress();
    render();
  };

  const hasNoIngredients = (): boolean =>
    state.cauldronIngredients.length === 0 &&
    SHELF_INGREDIENTS.every((ingredient) => (state.shelfStock[ingredient.id] ?? 0) === 0);

  const updateTimer = (): void => {
    if (!state.hasStarted || state.isGameOver || state.isPaused || endTime === null) {
      return;
    }

    const now = Date.now();
    state.timeRemainingMs = Math.max(0, endTime - now);

    if (state.timeRemainingMs === 0) {
      endRun('time');
      return;
    }

    updateTimeDisplay();

    if (now - lastSaveAt >= 1000) {
      lastSaveAt = now;
      persistProgress();
    }
  };

  const beginTimer = (): void => {
    if (document.hidden || state.isPaused) {
      return;
    }
    endTime = Date.now() + state.timeRemainingMs;
    if (timerHandle === undefined) {
      timerHandle = window.setInterval(updateTimer, 200);
    }
  };

  const pauseRun = (): void => {
    updateTimer();
    if (!state.hasStarted || state.isGameOver) {
      return;
    }
    state.isPaused = true;
    endTime = null;
    stopTimer();
    persistProgress();
    render();
  };

  const resumeRun = (): void => {
    if (!state.hasStarted || state.isGameOver) {
      return;
    }
    state.isPaused = false;
    beginTimer();
    render();
    persistProgress();
  };

  root.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }

    if (target.closest('[data-start-game]')) {
      availableSave = null;
      startNewGame(state);
      status.textContent = `${state.activeRecipe?.name ?? 'A new recipe'} awaits your ingredients.`;
      beginTimer();
      render();
      persistProgress();
      return;
    }

    if (target.closest('[data-continue-game]') && availableSave) {
      restoreSavedGame(state, availableSave);
      availableSave = null;
      stopTimer();
      if (hasNoIngredients()) {
        endRun('ingredients');
        return;
      }
      status.textContent = 'Your saved run is paused. Press Resume when ready.';
      render();
      persistProgress();
      return;
    }

    if (target.closest('[data-pause]')) {
      status.textContent = 'Run paused.';
      pauseRun();
      return;
    }

    if (target.closest('[data-resume]')) {
      status.textContent = 'Run resumed.';
      resumeRun();
      return;
    }

    if (target.closest('[data-exit-menu]')) {
      stopTimer();
      endTime = null;
      availableSave = null;
      state = createGameState();
      status.textContent = 'Run ended. Start a new game when you are ready.';
      if (!clearSavedGame()) {
        status.textContent = 'Saved progress could not be cleared.';
      }
      render();
      return;
    }

    if (target.closest('[data-play-again]')) {
      availableSave = null;
      startNewGame(state);
      status.textContent = `${state.activeRecipe?.name ?? 'A new recipe'} awaits your ingredients.`;
      beginTimer();
      render();
      persistProgress();
      return;
    }

    const ingredientButton = target.closest<HTMLButtonElement>('[data-ingredient-id]');
    if (ingredientButton && !ingredientButton.disabled) {
      updateTimer();
      if (state.isGameOver || state.isPaused) {
        return;
      }
      const ingredient = SHELF_INGREDIENTS.find(
        (item) => item.id === ingredientButton.dataset.ingredientId,
      );
      if (ingredient && addIngredient(state, ingredient.id)) {
        status.textContent = `${ingredient.name} added to the cauldron.`;
        render();
        persistProgress();
      }
      return;
    }

    if (target.closest('[data-brew]') && !brewButton.disabled) {
      updateTimer();
      if (state.isGameOver) {
        return;
      }

      const result = brewCauldron(state);
      if (result.status === 'success') {
        status.textContent = `Brew successful! +200 score and +10 seconds (maximum 02:30). New recipe: ${state.activeRecipe?.name ?? 'ready'}.`;
      } else if (result.status === 'failure') {
        status.textContent = state.isGameOver
          ? 'The brew failed. No lives remain; your run is over.'
          : `The brew failed. 1 life lost; ${state.lives} remaining.`;
      } else {
        return;
      }

      if (result.status === 'failure' && state.isGameOver) {
        endRun('lives');
        return;
      }

      endTime = Date.now() + state.timeRemainingMs;
      render();
      if (hasNoIngredients()) {
        endRun('ingredients');
      } else {
        persistProgress();
      }
      return;
    }

    if (target.closest('[data-clear]') && !clearButton.disabled) {
      updateTimer();
      if (state.isGameOver || state.isPaused) {
        return;
      }
      const spentIngredients = state.cauldronIngredients.length;
      clearCauldron(state);
      status.textContent = `${spentIngredients} ingredient${spentIngredients === 1 ? '' : 's'} discarded. Shelf stock is unchanged.`;
      if (hasNoIngredients()) {
        endRun('ingredients');
        return;
      }
      render();
      persistProgress();
    }
  });

  runDialog.addEventListener('cancel', (event: Event) => {
    event.preventDefault();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (state.hasStarted && !state.isGameOver && !state.isPaused) {
        status.textContent = 'The run was paused because this tab became hidden.';
        pauseRun();
      }
    } else if (state.isPaused || state.isGameOver) {
      render();
    }
  });

  render();
}
