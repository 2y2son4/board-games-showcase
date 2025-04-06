import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { GamesComponent } from '../components/games/games.component';
import { OraclesComponent } from '../components/oracles/oracles.component';
import { BggSearchComponent } from '../components/bgg-search/bgg-search.component';
import { GameDetailsComponent } from '../components/game-details/game-details.component';

@Component({
    selector: 'app-root',
    imports: [
        BggSearchComponent,
        CommonModule,
        GamesComponent,
        GameDetailsComponent,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatSidenav,
        MatToolbarModule,
        OraclesComponent,
        RouterModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isGames!: boolean;
  isOracles!: boolean;
  isSearch!: boolean;

  ngOnInit(): void {
    this.selectComponent('games');
  }

  selectComponent(component: string) {
    if (component === 'games') {
      this.isGames = true;
      this.isOracles = false;
      this.isSearch = false;
    } else if (component === 'oracles') {
      this.isGames = false;
      this.isOracles = true;
      this.isSearch = false;
    } else if (component === 'search') {
      this.isGames = false;
      this.isOracles = false;
      this.isSearch = true;
    }
  }
}
