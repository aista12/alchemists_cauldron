# Alchemist's Cauldron

Alchemist's Cauldron is a browser-based alchemy mini-game built with TypeScript
and plain web technologies. The atelier uses an original, restrained fantasy RPG
style with a view across the valley and a Genshin-inspired ingredient shelf.

## Project status and task set

Work is delivered incrementally through story branches and task pull requests:

- **Precondition 1 — Project setup:** repository documentation, folder structure,
  development tooling, and project workflow.
- **Level 1 — Basic game:** the initial playable alchemy experience and common
  game requirements.
- **Level 2 — Extended game:** additional game features.
- **Level 3 — Full game:** the complete feature set.

The current playable features are **US 1.1 — Ingredient Shelf & Cauldron**,
**US 1.2 — Cauldron Parameter Bars**, **US 1.3 — Recipe & Brewing Check**,
**US 1.4 — Timer & Game Over**, and **US 1.5 — Pause**. Start a run to receive
random stock for the first six ingredients and a random Medium recipe. Add
ingredients to the four-slot cauldron, watch the summed temperature, density,
and magic power move on the animated bars, and brew when the values match the
recipe. A successful brew awards points and time; a failed brew costs a life.
Stock spent on ingredients is not refunded.

## Repository structure

```text
.
├── .github/                  # Contribution and pull request templates
├── .husky/                   # Commit-message and pre-push hooks
├── index.html                # Vite application entry
├── public/                   # Static files served as-is
├── scripts/                  # Repository workflow helpers
├── src/
│   ├── main.ts               # Minimal TypeScript entry point
│   ├── assets/               # Individual game assets
│   ├── data/ingredients.ts   # Ordered ingredient catalogue and values
│   ├── data/recipes.ts       # Fixed recipe pool and Level 1 settings
│   ├── logic/cauldron.ts     # Ingredient, parameter, and brew rules
│   ├── state/game-state.ts   # Run, stock, recipe, score, time, and lives
│   ├── storage/game-save.ts  # Validated local run saves and restoration
│   ├── styles/main.css       # Room, shelf, cauldron, and parameter-bar styles
│   └── ui/                   # DOM rendering and ingredient icons
├── eslint.config.js          # TypeScript and JavaScript lint rules
├── package.json              # Scripts and dependencies
├── tsconfig.json             # Strict TypeScript compiler settings
└── vite.config.ts            # Vite development and production settings
```

The complete ingredient catalogue is kept in the specified order. Level 1 uses
the first six entries; the last two remain available for later levels.

| #   | Ingredient          | Temperature | Density | Magic Power |
| --- | ------------------- | ----------: | ------: | ----------: |
| 1   | Dragon Tears        |         +25 |      +8 |         +10 |
| 2   | Fairy Dust          |         +12 |      +9 |         +12 |
| 3   | Frost Lotus         |         −18 |      +4 |         +14 |
| 4   | Mandrake Root       |          −5 |     +20 |          +8 |
| 5   | Caustic Acid        |         +10 |     +14 |         +22 |
| 6   | Essence of the Void |         −20 |     −10 |         +40 |
| 7   | Phoenix Feather     |         +50 |     −10 |         +30 |
| 8   | Toad Slime          |          +5 |     +30 |           0 |

## Level 1 recipes and controls

Level 1 uses **Medium** recipes, a tolerance of **±8**, a four-ingredient
cauldron, three lives, and a 150-second time limit. Each recipe target range is
checked inclusively after expanding both ends by the tolerance. A successful
brew awards **200 points**, adds **10 seconds** up to 150 seconds, clears the
cauldron, and selects another Medium recipe. A failed brew clears the cauldron
and costs one life. Ingredients used in either result stay spent.

To play, select **Start Game**, add ingredients using their shelf cards, and
press **Brew** to check the current mixture. **Empty cauldron** discards the
current mixture without refunding stock. The timer is shown as **MM:SS** and a
remaining-time bar; it pulses red below 15 seconds. Use **Pause**, then
**Resume** or **Exit to Menu** in the pause dialog. A hidden browser tab pauses
the run automatically. The **Game Over** screen reports the end reason and
final score and offers **Play again**. The run ends when time or lives reach
zero, or when all shelf stock is gone and the cauldron is empty. Active runs
are saved in local storage; **Continue Game** restores a valid unfinished run
in a paused state. Invalid or unavailable saved data is handled without
crashing the game.

| #   | Difficulty | Recipe name    | Temperature | Density | Magic Power |
| --- | ---------- | -------------- | :---------: | :-----: | :---------: |
| 1   | Easy       | Moon Mist      |   32..42    | 12..22  |   17..27    |
| 2   | Easy       | Root Bloom     |    2..12    | 24..34  |   15..25    |
| 3   | Easy       | Frost Steam    |    2..12    |  7..17  |   19..29    |
| 4   | Easy       | Quiet Swirl    |  -28..-18   | 19..29  |   17..27    |
| 5   | Easy       | Bright Dew     |   27..37    | 32..42  |   25..35    |
| 6   | Easy       | Snow Dust      |   -16..-6   | 28..38  |   29..39    |
| 7   | Medium     | Acid Spark     |   17..27    | 18..28  |   29..39    |
| 8   | Medium     | Void Ember     |    0..10    |  0..10  |   45..55    |
| 9   | Medium     | Heavy Acid     |    0..10    | 29..39  |   25..35    |
| 10  | Medium     | Frost Acid     |   -13..-3   | 13..23  |   31..41    |
| 11  | Medium     | Dusty Void     |   -13..-3   |  0..10  |   47..57    |
| 12  | Medium     | Dragon Void    |   25..35    |  1..11  |   55..65    |
| 13  | Medium     | Rooted Night   |   -18..-8   | 14..24  |   55..65    |
| 14  | Hard       | Phoenix Pulse  |   57..67    |  0..10  |   37..47    |
| 15  | Hard       | Slime Crown    |    -5..5    | 45..55  |    3..13    |
| 16  | Hard       | Void Flame     |   25..35    |  0..10  |   60..70    |
| 17  | Hard       | Acid Bog       |   10..20    | 39..49  |   17..27    |
| 18  | Hard       | Frozen Ash     |   27..37    |  0..10  |   39..49    |
| 19  | Hard       | Triple Eclipse |  -20..-10   | 19..29  |   60..70    |
| 20  | Hard       | Ember Soup     |   62..72    | 24..34  |   37..47    |

## Getting started

Install the project dependencies:

```sh
npm install
```

Start the Vite development server:

```sh
npm run dev
```

Available project checks and builds:

```sh
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run build
npm run preview
```

`npm run build` type-checks the strict TypeScript source before producing the
optimized production bundle in `dist/`. Husky validates conventional commit
messages and runs lint, formatting, and build checks before pushing.

## Requirements

- Latest Google Chrome
- Node.js 20.19+ or 22.12+, and npm
