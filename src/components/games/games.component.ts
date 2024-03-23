import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { GameCard } from './games.component.model';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import GAMES_JSON from '../../static/games.json';
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighlightTextPipe,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './games.component.html',
  styleUrl: '../common-styles.scss',
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
  exactPlayers!: number | undefined;
  gamesFilterForm!: FormGroup;
  type: any;

  sortingSelectLabels = [
    'A to Z',
    'Z to A',
    'Year ↑',
    'Year ↓',
    'Time ↑',
    'Time ↓',
    'Complexity ↑',
    'Complexity ↓',
    'Rate ↑',
    'Rate ↓',
  ];

  constructor(
    public filterFunctions: FilterFunctionsService,
    public commonFunctions: CommonFunctionsService,
  ) {}

  ngOnInit(): void {
    this.gamesList = this.filterFunctions.sortByNameAscending(GAMES_JSON.games);
    this.resetGamesList();
    this.types = this.extractUniqueValues('types');
    this.editors = this.extractUniqueValues('editor');

    this.gamesFilterForm = new FormGroup({
      searchQuery: new FormControl(''),
      exactPlayers: new FormControl(''),
      selectedSorting: new FormControl([]),
      selectedTypes: new FormControl([]),
      selectedEditors: new FormControl([]),
      isPlayed: new FormControl(false),
      isNotPlayed: new FormControl(false),
    });
  }

  onTypeChange(modelType: string) {
    this.searchQuery = modelType;
    if (this.searchQuery) {
      this.filterGames();
    } else {
      this.resetGamesList();
      this.type = '';
    }
  }

  resetGamesList() {
    this.filteredGames = this.gamesList;
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
          game.types.some((type) => type.toLowerCase().includes(query)),
      );
    }
  }

  filterGamesByTypeAndEditor() {
    const selectedTypeValues = this.selectedTypes.value ?? [];
    const selectedEditorValues = this.selectedEditors.value ?? [];

    if (selectedTypeValues.length === 0 && selectedEditorValues!.length === 0) {
      this.resetGamesList();
    } else {
      this.filteredGames = this.gamesList.filter((game) => {
        const matchTypes =
          selectedTypeValues.length === 0 ||
          game.types.some((type) => selectedTypeValues.includes(type));
        const matchEditors =
          selectedEditorValues!.length === 0 ||
          selectedEditorValues!.includes(game.editor);
        return matchTypes && matchEditors;
      });
    }
  }

  togglePlayedFilter(played: boolean): void {
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
    this.playedGames = played;
    this.notPlayedGames = !played;
    this.filteredGames = this.filteredGames.filter(
      (game) => game.isPlayed === played,
    );
  }

  restartFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset([]);
    this.selectedTypes.reset([]);
    this.searchQuery = '';
    this.exactPlayers = undefined;
    this.playedGames = true;
    this.notPlayedGames = false;
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
  }

  restartSearch() {
    this.searchQuery = '';
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
  }

  filterGamesByExactPlayers() {
    const exactPlayersValue = this.exactPlayers;

    if (exactPlayersValue! <= 0) {
      this.resetGamesList();
    } else {
      this.filteredGames = this.gamesList.filter((game) => {
        const players = game.players;
        if (players) {
          if (players.length === 1) {
            return players[0] === exactPlayersValue;
          } else if (players.length === 2) {
            const [minPlayers, maxPlayers] = players;
            return (
              minPlayers <= exactPlayersValue! &&
              exactPlayersValue! <= maxPlayers
            );
          }
        }
        return false;
      });
    }
  }
}
