import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';

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
  styleUrl: './games.component.scss',
})
export class GamesComponent implements OnInit {
  public gamesList: Array<GameCard> = this.filterFunctions.sortByNameAscending(
    GAMES_JSON.games,
  );

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedEditors = new FormControl<string[]>([]);
  editors: string[] = [];
  selectedSorting = new FormControl<string>('');
  filteredGames: GameCard[] = [];
  searchQuery!: string;

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

  constructor(public filterFunctions: FilterFunctionsService) {
    this.extractUniqueTypes();
    this.extractUniqueEditors();
  }

  selectSorting(change: MatSelectChange) {
    switch (change.value) {
      case 'A to Z':
        this.filterFunctions.sortByNameAscending(this.filteredGames);
        break;
      case 'Z to A':
        this.filterFunctions.sortByNameDescending(this.filteredGames);
        break;
      case 'Year ↑':
        this.filterFunctions.sortByYearAscending(this.filteredGames);
        break;
      case 'Year ↓':
        this.filterFunctions.sortByYearDescending(this.filteredGames);
        break;
      case 'Time ↑':
        this.filterFunctions.sortByTimeAscending(this.filteredGames);
        break;
      case 'Time ↓':
        this.filterFunctions.sortByTimeDescending(this.filteredGames);
        break;
      case 'Complexity ↑':
        this.filterFunctions.sortByComplexityAscending(this.filteredGames);
        break;
      case 'Complexity ↓':
        this.filterFunctions.sortByComplexityDescending(this.filteredGames);
        break;

      default:
        break;
    }
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

  extractUniqueEditors() {
    const allEditors: string[] = [];
    this.gamesList.forEach((game) => {
      if (!allEditors.includes(game.editor)) {
        allEditors.push(game.editor);
      }
    });
    this.editors = allEditors.sort();
  }

  filterGames() {
    if (this.searchQuery.trim() === '') {
      // If search query is empty, show all games
      this.filteredGames = this.filterFunctions.sortByNameAscending(
        this.gamesList,
      );
    } else {
      // Filter entire gamesList based on search query
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
      // If no types or editors are selected, show all games
      this.filteredGames = this.gamesList;
    } else {
      // Filter games based on selected types and/or editors
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

  restartFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset();
    this.selectedTypes.reset();
    this.searchQuery = '';
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
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
}
