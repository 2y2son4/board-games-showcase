import { Component } from '@angular/core';
import GAMES_JSON from '../../static/games.json';
import { GameCard } from './games.component.model';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent {
  public gamesList: Array<GameCard> = GAMES_JSON.games;
}
