# [Board games and oracles showcase for `2y2son4`](https://2y2son4.github.io/board-games-showcase)

[LINK](https://2y2son4.github.io/board-games-showcase)

This web application, developed with Angular 17 and migrated to Angular 20, serves as a comprehensive showcase for a curated collection of board games and oracle decks. The platform offers an intuitive and visually engaging interface, enabling users to efficiently browse, filter, and explore detailed information about each item.

## Data Source

All game and oracle data (JSON files and images) is fetched at runtime from a separate GitHub Pages repository:

- **Base URL:** [`https://2y2son4.github.io/board-games-db`](https://2y2son4.github.io/board-games-db)
- **Games data:** `/v1/games.json`
- **Oracles data:** `/v1/oracles.json`
- **Game images:** `/images/games/<image>.webp`
- **Oracle images:** `/images/oracles/<image>.webp`

This decouples the data from the application code, allowing data updates without redeploying the app.

## Key Features

- **Dedicated Sections:** Access separate, purpose-built pages for board games and oracle decks, each offering tailored layouts and filter controls.
- **Interactive Card Flipping:** View each item as a card that can be flipped to reveal comprehensive details, including images, descriptions, and metadata.
- **Advanced Filtering and Search:** Utilize a robust set of filters and search capabilities to quickly locate specific games or decks based on multiple criteria.
- **Responsive User Experience:** Enjoy seamless usability across desktop and mobile devices, with adaptive layouts and controls.

## Filtering Options

### Board Games

- **Text Search:** Locate games by name, year, type, publisher, rating, or complexity.
- **Number of Players:** Filter by the exact supported player count.
- **Minimum Age:** Filter by the recommended minimum age.
- **Sorting:** Order results by name (A–Z, Z–A), year, play time, complexity, or rating (ascending/descending).
- **Game Type:** Filter by category (e.g., strategy, party, etc.).
- **Publisher:** Filter by publisher/editor.
- **Played Status:** Display only played or unplayed games.
- **Reset:** Restore the full list and clear all filters.

### Oracles

- **Text Search:** Locate decks by name or artist.
- **Reset:** Restore the full list and clear the search.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.1.2.

## Development server

Run `ng serve` for a dev server. `http://localhost:4200/` will automatically be opened on your browser. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `docs/` directory.

## CI/CD & Deployment

Deployment to GitHub Pages is fully automated via a GitHub Actions workflow defined in `.github/workflows/jekyll-gh-pages.yml`. No build artifacts need to be committed to the repository.

### Workflow Overview

The workflow runs two jobs:

1. **Test** — Runs on every push and pull request to `main`:
   - Installs dependencies (`npm ci`)
   - Runs all unit tests (`npm test`)

2. **Build & Deploy** — Runs only on pushes to `main` (after tests pass):
   - Installs dependencies
   - Builds the production app (`npm run build:prod`)
   - Deploys the output to GitHub Pages via `actions/deploy-pages`

### Manual Deployment

The workflow can also be triggered manually from the **Actions** tab using `workflow_dispatch`.

The app is available at: [https://2y2son4.github.io/board-games-showcase](https://2y2son4.github.io/board-games-showcase)

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestjs.io/).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## [Wiki](https://deepwiki.com/2y2son4/board-games-showcase)

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/2y2son4/board-games-showcase)

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
