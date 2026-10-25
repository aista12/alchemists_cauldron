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

The current playable features are **US 1.1 — Ingredient Shelf & Cauldron** and
**US 1.2 — Cauldron Parameter Bars**. A new visit starts with random stock for
the first six ingredients. Add ingredients to the four-slot cauldron, in order,
or empty it to make room; discarded ingredients remain spent. Three animated
bars show the summed temperature, density, and magic power, with zero-centered
scales for signed values and green highlights inside the target zones. The
current fixed target is the Medium recipe **Acid Spark**: temperature 17..27,
density 18..28, and magic power 29..39. Random recipe selection and brewing are
part of US 1.3.

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
│   ├── data/recipes.ts       # Current recipe and target ranges
│   ├── logic/cauldron.ts     # Ingredient rules and value calculation
│   ├── state/game-state.ts   # Shelf stock and cauldron state
│   ├── storage/              # Save-data helpers for later stories
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
