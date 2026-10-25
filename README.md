# Alchemist's Cauldron

Alchemist's Cauldron is a browser-based alchemy mini-game built with TypeScript and
plain web technologies. Its visual direction is inspired by the polished fantasy
adventure interfaces of games such as Genshin Impact, while its artwork and
interface are designed for this project.

## Game goal

The planned game centers on discovering and combining ingredients to create
potions. The exact gameplay will be introduced in later stories. This repository
currently contains the project foundation; playable game mechanics are not
implemented yet.

## Project status and task set

Work is delivered incrementally through story branches and task pull requests:

- **Precondition 1 — Project setup:** repository documentation, folder structure,
  development tooling, and project workflow.
- **Level 1 — Basic game:** the initial playable alchemy experience and common
  game requirements.
- **Level 2 — Extended game:** additional game features.
- **Level 3 — Full game:** the complete feature set.

The current project foundation includes the repository setup, the TypeScript
source structure, and development tooling. The welcome screen is a visual
scaffold; potion crafting and other game mechanics have not been implemented.

## Repository structure

```text
.
├── .github/                  # Contribution and pull request templates
├── .husky/                   # Commit-message and pre-push hooks
├── index.html                # Vite application entry
├── public/                   # Static files served as-is
├── scripts/                  # Repository workflow helpers
├── src/
│   ├── assets/               # Individual image, icon, and audio assets
│   ├── data/                 # Static game content and definitions
│   ├── logic/                # Rules and game calculations (no DOM rendering)
│   ├── state/                # Game state and state transitions
│   ├── storage/              # Persistence and save-data helpers
│   ├── styles/               # Global and component styles
│   └── ui/                   # DOM rendering and user interaction
├── eslint.config.js          # TypeScript and JavaScript lint rules
├── package.json              # Scripts and dependencies
├── tsconfig.json             # Strict TypeScript compiler settings
└── vite.config.ts            # Vite development and production settings
```

The source folders are intentionally separated so future game rules can remain
independent of DOM rendering.

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
messages and runs lint, formatting, and build checks before pushing. The current
welcome screen is only a visual scaffold; gameplay is not implemented yet.

## Requirements

- Latest Google Chrome
- Node.js 20.19+ or 22.12+, and npm
