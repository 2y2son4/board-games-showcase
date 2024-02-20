import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';

import { MatSidenav } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UserComponent } from '../components/user/user.component';
import { GamesComponent } from '../components/games/games.component';

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
    RouterModule,
    UserComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
