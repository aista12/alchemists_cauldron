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

The current task branch covers repository setup, the initial TypeScript
dependency, the source folder structure, and the pull request template.

## Repository structure

```text
.
├── .github/                  # Contribution and pull request templates
├── public/                   # Static files served as-is
├── src/
│   ├── assets/               # Individual image, icon, and audio assets
│   ├── data/                 # Static game content and definitions
│   ├── logic/                # Rules and game calculations (no DOM rendering)
│   ├── state/                # Game state and state transitions
│   ├── storage/              # Persistence and save-data helpers
│   ├── styles/               # Global and component styles
│   └── ui/                   # DOM rendering and user interaction
└── package.json              # Project metadata and dependencies
```

The source folders are intentionally separated so future game rules can remain
independent of DOM rendering.

## Getting started

Install the project dependencies:

```sh
npm install
```

The game build and run scripts will be added with the development-environment
configuration task. No playable game is available in this setup stage.

## Requirements

- Latest Google Chrome
- Node.js and npm
