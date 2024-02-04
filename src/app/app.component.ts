import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  imports: [CommonModule, RouterOutlet, UserComponent, GamesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Angular 17 Playground';
  city = 'Madrid';
}
