import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { UserComponent } from '../components/user/user.component';
import { GamesComponent } from '../components/games/games.component';

// el decorador es una sintaxis y en patrón, que typescript implementa con JS.
// @Component afecta a la clase AppComponent
@Component({
  selector: 'app-root',
  standalone: true,
  // si queremos utilizar cualquier componente o cualquier módulo
  // ahora hay que ponerlo en "imports" de la siguiente línea
  // standalone previene mejor el código repetido
  imports: [
    CommonModule,
    GamesComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenav,
    MatSidenavModule,
    MatToolbarModule,
    RouterOutlet,
    UserComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  reason = '';

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }
}
