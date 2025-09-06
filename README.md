# [Board games and oracles showcase for `2y2son4`](https://2y2son4.github.io/board-games-showcase)

[LINK](https://2y2son4.github.io/board-games-showcase)

This web application, developed with Angular 17 and migrated to Angular 19, serves as a comprehensive showcase for a curated collection of board games and oracle decks. The platform offers an intuitive and visually engaging interface, enabling users to efficiently browse, filter, and explore detailed information about each item.

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

## Deployment & GitHub Actions Workflow

All new features are developed in the `gh-pages` branch. Deployment to GitHub Pages is fully automated using a GitHub Actions workflow defined in `.github/workflows/jekyll-gh-pages.yml`.

### How Deployment Works

1. **Build the App:**
   Run the production build script to generate the static site files:

   ```bash
   npm run build:prod
   ```

   This command outputs the production-ready files to the `docs/` folder.

2. **Automatic Deployment:**
   The GitHub Actions workflow is triggered on every push to the `main` branch or when manually run from the Actions tab. The workflow performs the following steps:
   - **Checkout:** Retrieves the latest code from the repository.
   - **Setup Pages:** Prepares the GitHub Pages environment.
   - **Build (Jekyll by default):** Runs a Jekyll build step (can be adapted or replaced for Angular/static site output).
   - **Upload Artifact:** Uploads the generated site as an artifact for deployment.
   - **Deploy:** Publishes the uploaded artifact to GitHub Pages, making the site available at the configured URL.

> **Note:** Although the workflow is based on a Jekyll template, it can be customized to better fit an Angular project by replacing the Jekyll build step with one that copies the contents of `docs/` to the deployment artifact.

The app is available at: [https://2y2son4.github.io/board-games-showcase](https://2y2son4.github.io/board-games-showcase)

## Running unit tests

Run `ng test` to execute the unit tests via [Jest](https://jestjs.io/).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
