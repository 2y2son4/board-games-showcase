import { Routes } from '@angular/router';

import { GamesComponent } from '../features/games/components/games/games.component';
import { OraclesComponent } from '../features/oracles/components/oracles/oracles.component';
import { BggSearchComponent } from '../features/bgg-search/components/bgg-search/bgg-search.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'games' },
  { path: 'games', component: GamesComponent },
  { path: 'oracles', component: OraclesComponent },
  { path: 'search', component: BggSearchComponent },
  { path: '**', redirectTo: 'games' },
];
