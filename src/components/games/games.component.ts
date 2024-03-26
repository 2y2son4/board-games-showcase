import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
} from '@angular/core';
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
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

import { GameCard } from '../commons.models';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import GAMES_JSON from '../../assets/data/games.json';
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
export class GamesComponent implements OnInit, AfterViewInit {
  @ViewChildren('innerElement') innerElements!: QueryList<ElementRef>;

  gamesList!: Array<GameCard>;

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedChipTypes: Array<string> = [''];
  selectedEditors = new FormControl<string[]>([]);
  editors: string[] = [];
  selectedSorting = new FormControl<string>('');
  filteredGames: GameCard[] = [];
  searchQuery = '';
  playedGames = false;
  unPlayedGames = false;
  exactPlayers!: number | undefined;
  gamesFilterForm!: FormGroup;
  flippedCards!: number;

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
    public commonFunctions: CommonFunctionsService,
    public filterFunctions: FilterFunctionsService,
  ) {}

  ngOnInit(): void {
    this.gamesList = this.filterFunctions.sortByNameAscending(GAMES_JSON.games);
    this.resetGamesList();
    this.types = this.commonFunctions.extractUniqueValues(
      this.gamesList,
      'types',
    );
    this.editors = this.commonFunctions.extractUniqueValues(
      this.gamesList,
      'editor',
    );

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

  ngAfterViewInit() {
    this.filterFunctions.getFlipCardCount(this.innerElements);
  }

  onTypeChange(selectedChipTypes: Array<string>) {
    this.gamesFilterForm.reset();
    this.restartDropdownFilters();
    if (!selectedChipTypes) {
      this.resetGamesList();
    } else {
      this.filteredGames = this.gamesList.filter((card) => {
        return selectedChipTypes.every((selectedType) =>
          card.types.includes(selectedType),
        );
      });
    }
  }

  filterGames() {
    this.selectedChipTypes = [];
    this.resetPlayedGames();
    this.filterFunctions.flipAllCards(this.innerElements);
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
          game.rate.toString().includes(query) ||
          game.complexity.toString().includes(query) ||
          game.types.some((type) => type.toLowerCase().includes(query)),
      );
    }
  }

  filterGamesByTypeAndEditor() {
    this.resetPlayedGames();
    this.selectedChipTypes = [];
    this.filterFunctions.flipAllCards(this.innerElements);
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

  selectSorting(change: MatSelectChange, filteredGames: GameCard[]) {
    this.resetPlayedGames();
    // this.selectedChipTypes = [];
    this.filterFunctions.flipAllCards(this.innerElements);
    const sortFunctions: {
      [key: string]: (a: GameCard, b: GameCard) => number;
    } = {
      'A to Z': (a, b) => a.name.localeCompare(b.name),
      'Z to A': (a, b) => b.name.localeCompare(a.name),
      'Year ↑': (a, b) => a.year - b.year,
      'Year ↓': (a, b) => b.year - a.year,
      'Time ↑': (a, b) => a.time! - b.time!,
      'Time ↓': (a, b) => b.time! - a.time!,
      'Complexity ↑': (a, b) => a.complexity - b.complexity,
      'Complexity ↓': (a, b) => b.complexity - a.complexity,
      'Rate ↑': (a, b) => a.rate - b.rate,
      'Rate ↓': (a, b) => b.rate - a.rate,
    };

    const sortFunction = sortFunctions[change.value];
    if (sortFunction) {
      filteredGames.sort(sortFunction);
    }
  }

  togglePlayed() {
    this.resetGamesList();
    this.unPlayedGames = false;
    this.selectedChipTypes = [];
    this.playedGames = !this.playedGames;
    this.filteredGames = this.filteredGames.filter(
      (game) => game.isPlayed === this.playedGames,
    );

    if (!this.playedGames) {
      this.resetGamesList();
    }
  }

  toggleUnPlayed() {
    this.resetGamesList();
    this.playedGames = false;
    this.selectedChipTypes = [];
    this.unPlayedGames = !this.unPlayedGames;
    this.filteredGames = this.filteredGames.filter(
      (game) => game.isPlayed === !this.unPlayedGames,
    );

    if (!this.unPlayedGames) {
      this.resetGamesList();
    }
  }

  resetGamesList() {
    this.filteredGames = this.gamesList;
    this.filterFunctions.flipAllCards(this.innerElements);
  }

  restartFilters() {
    this.restartDropdownFilters();
    this.selectedChipTypes = [];
    this.resetPlayedGames();
    this.filterFunctions.flipAllCards(this.innerElements);
  }

  restartDropdownFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset([]);
    this.selectedTypes.reset([]);
    this.searchQuery = '';
    this.exactPlayers = undefined;
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
  }

  resetPlayedGames() {
    this.playedGames = false;
    this.unPlayedGames = false;
  }

  restartSearch() {
    this.searchQuery = '';
    this.filteredGames = this.filterFunctions.sortByNameAscending(
      this.gamesList,
    );
  }

  filterGamesByExactPlayers() {
    this.selectedChipTypes = [];

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

  toggleCardFlip(index: number) {
    const targetElement = this.innerElements.toArray()[index];
    if (targetElement) {
      targetElement.nativeElement.classList.toggle('active');
    }
  }
}
