import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  {
    path: 'games',
    title: 'Games',
    loadComponent: () =>
      import('../features/games/components/games/games.component').then(
        (m) => m.GamesComponent,
      ),
  },
  {
    path: 'oracles',
    title: 'Oracles',
    loadComponent: () =>
      import('../features/oracles/components/oracles/oracles.component').then(
        (m) => m.OraclesComponent,
      ),
  },
  {
    path: 'search',
    title: 'BGG Search',
    loadComponent: () =>
      import('../features/bgg-search/components/bgg-search/bgg-search.component').then(
        (m) => m.BggSearchComponent,
      ),
  },
  { path: '**', title: 'Games', redirectTo: 'games' },
];
