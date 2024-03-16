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

// el decorador es una sintaxis y en patrón, que typescript implementa con JS.
// @Component afecta a la clase AppComponent
@Component({
  selector: 'app-root',
  // standalone previene mejor el código repetido
  standalone: true,
  /** si queremos utilizar cualquier componente o cualquier módulo
   * ahora hay que ponerlo en "imports" de la siguiente línea. */
  imports: [
    CommonModule,
    GamesComponent,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenav,
    MatToolbarModule,
    OraclesComponent,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  isGames!: boolean;
  isOracles!: boolean;

  ngOnInit(): void {
    this.selectComponent('games');
  }

  selectComponent(component: string) {
    if (component === 'games') {
      this.isGames = true;
      this.isOracles = false;
    } else {
      this.isGames = false;
      this.isOracles = true;
    }
  }
}
