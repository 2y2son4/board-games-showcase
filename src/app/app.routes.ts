import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  {
    path: 'games',
    loadComponent: () =>
      import('../features/games/components/games/games.component').then(
        (m) => m.GamesComponent,
      ),
  },
  {
    path: 'oracles',
    loadComponent: () =>
      import('../features/oracles/components/oracles/oracles.component').then(
        (m) => m.OraclesComponent,
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('../features/bgg-search/components/bgg-search/bgg-search.component').then(
        (m) => m.BggSearchComponent,
      ),
  },
  { path: '**', redirectTo: 'games' },
];
