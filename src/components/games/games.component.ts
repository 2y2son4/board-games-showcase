import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { HttpService } from '../../core/services/http/http.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HighlightTextPipe,
    HttpClientModule,
    LoaderComponent,
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
  isLoading!: boolean;
  exactPlayers!: number | undefined;
  exactAge!: number;
  gamesFilterForm!: FormGroup;
  flippedCards!: number;

  printGames: GameCard[] = [];

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
    private httpDataService: HttpService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.gamesList = [];
    this.loaderService.show();
    this.isLoading = true;
    this.httpDataService.getGames().subscribe({
      next: (response) => {
        this.gamesList = this.filterFunctions.sortByNameAscending(
          response.games,
        );
        this.filteredGames = this.filterFunctions.sortByNameAscending(
          response.games,
        );
        this.types = this.commonFunctions.extractUniqueValues(
          this.filterFunctions.sortByNameAscending(response.games),
          'types',
        );
        this.editors = this.commonFunctions.extractUniqueValues(
          this.filterFunctions.sortByNameAscending(response.games),
          'editor',
        );
        this.loaderService.hide();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching games data', error);
        this.loaderService.hide();
        this.isLoading = false;
      },
    });

    this.resetGamesList();
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

    if (selectedTypeValues.length === 0 && selectedEditorValues.length === 0) {
      this.resetGamesList();
    } else {
      this.filteredGames = this.gamesList.filter((game) => {
        const matchTypes =
          selectedTypeValues.length === 0 ||
          game.types.some((type) => selectedTypeValues.includes(type));
        const matchEditors =
          selectedEditorValues.length === 0 ||
          selectedEditorValues.includes(game.editor);
        return matchTypes && matchEditors;
      });
    }
  }

  selectSorting(change: MatSelectChange, filteredGames: GameCard[]) {
    this.resetPlayedGames();
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
    this.restartFilters();
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
    this.restartFilters();
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
    this.printGames = [];
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

  filterGamesByAge() {
    this.selectedChipTypes = [];

    const exactYear = this.exactAge;

    if (!exactYear) {
      this.resetGamesList();
    } else {
      this.filteredGames = this.gamesList.filter((game) => {
        const players = game.age;
        if (players) {
          return players <= exactYear;
        }
        return false;
      });
    }
  }

  toggleCardFlip(index: number) {
    const targetElement = this.innerElements.toArray()[index];
    const gameName =
      targetElement.nativeElement.firstElementChild.childNodes[1].innerHTML;
    const gameObject = this.gamesList.filter(
      (games) => games.name === gameName,
    );

    this.printGames = [...this.printGames, gameObject[0]];

    if (targetElement) {
      targetElement.nativeElement.classList.toggle('active');
    }
  }
}
