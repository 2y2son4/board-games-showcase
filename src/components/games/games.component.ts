import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GameCard } from './games.component.model';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import GAMES_JSON from '../../static/games.json';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighlightTextPipe,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss', '../common-styles.scss'],
})
export class GamesComponent implements OnInit {
  gamesList!: Array<GameCard>;

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedEditors = new FormControl<string[]>([]);
  editors: string[] = [];
  selectedSorting = new FormControl<string>('');
  filteredGames: GameCard[] = [];
  searchQuery = '';
  playedGames = true;
  notPlayedGames = false;

  sortingSelectLabels = [
    'A to Z',
    'Z to A',
    'Year ↑',
    'Year ↓',
    'Time ↑',
    'Time ↓',
    'Complexity ↑',
    'Complexity ↓',
  ];

  constructor(public filterFunctions: FilterFunctionsService) {}

  ngOnInit(): void {
    this.gamesList = this.filterFunctions.sortByNameAscending(GAMES_JSON.games);
    this.filteredGames = this.gamesList;
    this.types = this.extractUniqueValues('type');
    this.editors = this.extractUniqueValues('editor');
  }

  extractUniqueValues(propertyName: keyof GameCard): string[] {
    const allValues: string[] = [];
    this.gamesList.forEach((game) => {
      const valueOrArray = game[propertyName];

      if (Array.isArray(valueOrArray)) {
        valueOrArray.forEach((value) => {
          const stringValue = String(value);
          if (stringValue && !allValues.includes(stringValue)) {
            allValues.push(stringValue);
          }
        });
      } else {
        const stringValue = String(valueOrArray);
        if (stringValue && !allValues.includes(stringValue)) {
          allValues.push(stringValue);
        }
      }
    });

    return allValues.sort();
  }

  filterGames() {
    if (this.searchQuery.trim() === '') {
      this.filteredGames = this.filterFunctions.sortByNameAscending(
        this.gamesList,
      );
    } else {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredGames = this.gamesList.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.editor.toLowerCase().includes(query) ||
          game.year.toString().includes(query) ||
          game.type.some((type) => type.toLowerCase().includes(query)),
      );
    }
  }

  filterGamesByTypeAndEditor() {
    const selectedTypeValues = this.selectedTypes.value ?? [];
    const selectedEditorValues = this.selectedEditors.value ?? [];

    if (selectedTypeValues.length === 0 && selectedEditorValues!.length === 0) {
      this.filteredGames = this.gamesList;
    } else {
      this.filteredGames = this.gamesList.filter((game) => {
        const matchTypes =
          selectedTypeValues.length === 0 ||
          game.type.some((type) => selectedTypeValues.includes(type));
        const matchEditors =
          selectedEditorValues!.length === 0 ||
          selectedEditorValues!.includes(game.editor);
        return matchTypes && matchEditors;
      });
    }
  }

  togglePlayedFilter(played: boolean): void {
    this.playedGames = played;
    this.notPlayedGames = !played;
    this.filteredGames = this.gamesList.filter(
      (game) => game.isPlayed === played,
    );
  }

  restartFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset();
    this.selectedTypes.reset();
    this.searchQuery = '';
    this.playedGames = true;
    this.notPlayedGames = false;
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
  }

  getColor(number: number): string {
    const greenColor = [54, 174, 124];
    const yellowColor = [249, 217, 35];
    const redColor = [235, 83, 83];

    const percentage = (number - 1) / 4;

    let r, g, b;
    if (percentage < 0.5) {
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

    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }
}
