import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  username!: string;
  isLoggedIn = false;
  clientInformation: string | undefined;
  x = document.getElementById('demo');

  logIn(ev: MouseEvent) {
    this.isLoggedIn = !this.isLoggedIn;
    if (!this.isLoggedIn) {
      this.username = '';
    }
    this.clientInformation = ev.view?.navigator.language;
  }
}
