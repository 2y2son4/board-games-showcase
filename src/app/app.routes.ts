import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamesComponent } from '../components/games/games.component';
import { AppComponent } from './app.component';
import { OraclesComponent } from '../components/oracles/oracles.component';

export const routes: Routes = [
  { path: '', component: GamesComponent },
  { path: 'oracles', component: OraclesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
