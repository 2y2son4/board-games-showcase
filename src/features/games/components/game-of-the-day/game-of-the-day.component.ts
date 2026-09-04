import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { GameCard } from '../../models';
import { CommonFunctionsService } from '../../../../core/functions/common/common-functions.service';
import { HttpService } from '../../../../core/services/http/http.service';

@Component({
  selector: 'app-game-of-the-day',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    NgOptimizedImage,
  ],
  templateUrl: './game-of-the-day.component.html',
  styleUrl: './game-of-the-day.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOfTheDayComponent implements OnInit {
  readonly #dialogRef = inject(MatDialogRef<GameOfTheDayComponent>);
  readonly #httpService = inject(HttpService);
  readonly commonFunctions = inject(CommonFunctionsService);

  readonly gamesImageBase: string;

  types: string[] = [];
  selectedType = '';
  playerOptions: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9+'];
  selectedPlayers = '';
  gamesList: GameCard[] = [];
  selectedGame = signal<GameCard | null>(null);
  searchPerformed = signal(false);

  constructor() {
    this.gamesImageBase = this.#httpService.gamesImageBase;
  }

  ngOnInit(): void {
    this.#httpService.getGames().subscribe({
      next: (response) => {
        this.gamesList = response.games;
        const allTypes = new Set<string>();
        this.gamesList.forEach((game) =>
          game.types.forEach((type) => allTypes.add(type)),
        );
        this.types = [...allTypes].sort();
      },
    });
  }

  showGame(): void {
    this.searchPerformed.set(true);
    let matching = [...this.gamesList];

    if (this.selectedType) {
      matching = matching.filter((game) =>
        game.types.includes(this.selectedType),
      );
    }

    if (this.selectedPlayers) {
      matching = matching.filter((game) => this.#matchesPlayerCount(game));
    }

    if (matching.length === 0) {
      this.selectedGame.set(null);
      return;
    }
    const randomIndex = Math.floor(Math.random() * matching.length);
    this.selectedGame.set(matching[randomIndex]);
  }

  #matchesPlayerCount(game: GameCard): boolean {
    if (!game.players || game.players.length === 0) return false;
    const min = game.players[0];
    const max =
      game.players.length > 1 ? game.players[game.players.length - 1] : min;

    if (this.selectedPlayers === '9+') {
      return max >= 9;
    }
    const count = parseInt(this.selectedPlayers, 10);
    return count >= min && count <= max;
  }

  formatDuration(minutes: number): string {
    if (minutes < 59) {
      return `${minutes} min`;
    }

    const hours = minutes / 60;
    return hours === 1 ? '1 h' : `${hours} h`;
  }

  close(): void {
    this.#dialogRef.close();
  }
}
