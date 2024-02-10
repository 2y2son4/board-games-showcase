import { Component, OnInit } from '@angular/core';
import GAMES_JSON from '../../static/games.json';
import { GameCard } from './games.component.model';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
})
export class GamesComponent implements OnInit {
  public gamesList: Array<GameCard> = this.sortAtoZ(GAMES_JSON.games);
  types: string[] = [];
  selectedTypes = new FormControl([]);
  filteredGames: GameCard[] = [];

  isAlphaUp = false;
  isYearUp = false;
  isTimeUp = false;

  constructor() {
    this.extractUniqueTypes();
  }

  ngOnInit(): void {
    this.filteredGames = this.gamesList;
  }

  extractUniqueTypes() {
    const allTypes: string[] = [];
    this.gamesList.forEach((game) => {
      game.type.forEach((type) => {
        if (!allTypes.includes(type)) {
          allTypes.push(type);
        }
      });
    });
    this.types = allTypes.sort();
  }

  filterGames(selectedTypes: string[]) {
    console.log('selectedTypes: ', selectedTypes);
    if (selectedTypes.length === 0) {
      // If no types are selected, show all games
      this.filteredGames = this.gamesList;
    } else {
      // Filter games based on selected types
      this.filteredGames = this.gamesList.filter((game) =>
        game.type.some((type) => selectedTypes.includes(type)),
      );

      console.log(this.filteredGames);
    }
  }

  onSelectionChange() {
    console.log('Selection changed');
    this.filterGames(this.selectedTypes.value ?? []);
  }

  getColor(number: number): string {
    // Colors for the endpoints
    const greenColor = [54, 174, 124];
    const yellowColor = [249, 217, 35];
    const redColor = [235, 83, 83];

    // Calculate the percentage of the number within the range 1 to 5
    const percentage = (number - 1) / 4;

    // Interpolate colors based on the percentage
    let r, g, b;
    if (percentage < 0.5) {
      // Transition from green to yellow
      r = Math.round(
        greenColor[0] + percentage * 2 * (yellowColor[0] - greenColor[0]),
      );
      g = Math.round(
        greenColor[1] + percentage * 2 * (yellowColor[1] - greenColor[1]),
      );
      b = Math.round(
        greenColor[2] + percentage * 2 * (yellowColor[2] - greenColor[2]),
      );
    } else {
      // Transition from yellow to red
      r = Math.round(
        yellowColor[0] +
          (percentage - 0.5) * 2 * (redColor[0] - yellowColor[0]),
      );
      g = Math.round(
        yellowColor[1] +
          (percentage - 0.5) * 2 * (redColor[1] - yellowColor[1]),
      );
      b = Math.round(
        yellowColor[2] +
          (percentage - 0.5) * 2 * (redColor[2] - yellowColor[2]),
      );
    }

    // Convert RGB values to hexadecimal format
    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }

  sortAtoZ(data: Array<GameCard>) {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortZtoA(data: Array<GameCard>) {
    return data.sort((a, b) => b.name.localeCompare(a.name));
  }

  sortByYearAsc(data: Array<GameCard>) {
    return data.sort((a, b) => {
      if (a.year < 0) {
        return -1;
      }
      if (b.year < 0) {
        return 1;
      }
      return b.year - a.year;
    });
  }

  sortByYearDesc(data: Array<GameCard>) {
    return data.sort((a, b) => {
      if (a.year > 0) {
        return -1;
      }
      if (b.year > 0) {
        return 1;
      }
      return a.year - b.year;
    });
  }

  sortByTimeAsc(data: Array<GameCard>) {
    return data.sort((a, b) => {
      if (a.time! < 0) {
        return -1;
      }
      if (b.time! < 0) {
        return 1;
      }
      return b.time! - a.time!;
    });
  }

  sortByTimeDesc(data: Array<GameCard>) {
    return data.sort((a, b) => {
      if (a.time! > 0) {
        return -1;
      }
      if (b.time! > 0) {
        return 1;
      }
      return a.time! - b.time!;
    });
  }
}
