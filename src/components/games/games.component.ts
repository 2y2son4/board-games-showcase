import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
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
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { HttpService } from '../../core/services/http/http.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader/loader.service';
import { ExportService } from '../../core/services/export/export.service';

@Component({
  selector: 'app-games',
  imports: [
    CommonModule,
    FormsModule,
    HighlightTextPipe,
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
  @ViewChild('topPage') topPage!: ElementRef;
  @ViewChildren('innerElement')
  innerElements!: QueryList<ElementRef>;
  gamesList!: Array<GameCard>;

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedChipTypes: Array<string> = [''];
  selectedSize!: string;
  selectedEditors = new FormControl<string[]>([]);
  editors: string[] = [];
  selectedSorting = new FormControl<string>('');
  filteredGames: GameCard[] = [];
  searchQuery = '';
  playedGames = false;
  unPlayedGames = false;
  isLoading!: boolean;
  exactPlayers!: number | undefined;
  exactAge!: number | undefined;
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
  showPlayedBtn = true;
  showUnplayedBtn = true;

  constructor(
    public commonFunctions: CommonFunctionsService,
    public filterFunctions: FilterFunctionsService,
    private readonly httpDataService: HttpService,
    private readonly loaderService: LoaderService,
    private readonly exportService: ExportService,
  ) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.isLoading = true;
    this.gamesList = [];

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
    this.selectedChipTypes = selectedChipTypes;
    this.applyAllFilters();
    setTimeout(() => {
      this.filterFunctions.flipAllCards(this.innerElements);
    }, 100);
  }

  onSizeChange(selectedSize: string) {
    console.log(selectedSize);
    this.gamesFilterForm.reset();
    this.restartDropdownFilters();
    this.selectedSize = selectedSize;
    this.applyAllFilters();
    setTimeout(() => {
      this.filterFunctions.flipAllCards(this.innerElements);
    }, 100);
  }

  onSearchTypes(target: any) {
    this.types = this.searchTypes(target.value);
  }

  searchTypes(value: any) {
    let filter = value.toLowerCase();
    if (!value) {
      return this.commonFunctions.extractUniqueValues(
        this.filterFunctions.sortByNameAscending(this.gamesList),
        'types',
      );
    } else {
      return this.types.filter((editor) =>
        editor.toLowerCase().includes(filter),
      );
    }
  }

  onSearchEditors(target: any) {
    this.editors = this.searchEditors(target.value);
  }

  searchEditors(value: any) {
    let filter = value.toLowerCase();
    if (!value) {
      return this.commonFunctions.extractUniqueValues(
        this.filterFunctions.sortByNameAscending(this.gamesList),
        'editor',
      );
    } else {
      return this.editors.filter((editor) =>
        editor.toLowerCase().includes(filter),
      );
    }
  }

  filterGames() {
    this.filterFunctions.flipAllCards(this.innerElements);
    this.applyAllFilters();
  }

  filterGamesByTypeAndEditor() {
    this.filterFunctions.flipAllCards(this.innerElements);
    this.applyAllFilters();
  }

  selectSorting(change: MatSelectChange) {
    this.filterFunctions.flipAllCards(this.innerElements);
    // The form control value is already updated by the time this is called
    // Just re-apply all filters with the new sorting
    this.applyAllFilters();
  }

  togglePlayed() {
    this.filterFunctions.flipAllCards(this.innerElements);
    this.unPlayedGames = false;
    this.playedGames = !this.playedGames;
    this.showPlayedBtn = false;
    this.showUnplayedBtn = true;
    this.applyAllFilters();
  }

  toggleUnPlayed() {
    this.filterFunctions.flipAllCards(this.innerElements);
    this.playedGames = false;
    this.unPlayedGames = !this.unPlayedGames;
    this.showPlayedBtn = true;
    this.showUnplayedBtn = false;
    this.applyAllFilters();
  }

  resetGamesList() {
    this.filteredGames = this.gamesList;
    this.filterFunctions.flipAllCards(this.innerElements);
  }

  restartFilters() {
    // Must clear these BEFORE calling restartDropdownFilters()
    // so that applyAllFilters() runs with all filters cleared
    this.selectedChipTypes = [];
    this.resetPlayedGames();
    this.restartDropdownFilters();
    this.filterFunctions.flipAllCards(this.innerElements);
    this.topPage.nativeElement.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
    this.showPlayedBtn = true;
    this.showUnplayedBtn = true;
  }

  restartDropdownFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset([]);
    this.selectedTypes.reset([]);
    this.searchQuery = '';
    this.exactPlayers = undefined;
    this.exactAge = undefined;
    this.selectedChipTypes = [];
    this.selectedSize = '';
    this.applyAllFilters();
    this.printGames = [];
  }

  resetPlayedGames() {
    this.playedGames = false;
    this.unPlayedGames = false;
  }

  restartSearch() {
    this.searchQuery = '';
    this.applyAllFilters();
  }

  /**
   * Centralized method to apply all active filters cumulatively.
   * This ensures filters work together (AND logic) rather than independently.
   */
  applyAllFilters() {
    let result = [...this.gamesList];

    // Apply search query filter
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      result = result.filter(
        (game) =>
          game.name.toLowerCase().includes(query) ||
          game.editor.toLowerCase().includes(query) ||
          game.year.toString().includes(query) ||
          game.rate.toString().includes(query) ||
          game.complexity.toString().includes(query) ||
          game.types.some((type) => type.toLowerCase().includes(query)),
      );
    }

    // Apply exact players filter
    if (this.exactPlayers && this.exactPlayers > 0) {
      result = result.filter((game) => {
        const players = game.players;
        if (players) {
          if (players.length === 1) {
            return players[0] === this.exactPlayers;
          } else if (players.length === 2) {
            const [minPlayers, maxPlayers] = players;
            return (
              minPlayers <= this.exactPlayers! &&
              this.exactPlayers! <= maxPlayers
            );
          }
        }
        return false;
      });
    }

    // Apply age filter
    if (this.exactAge) {
      result = result.filter((game) => {
        const ages = game.age;
        if (ages) {
          return ages <= this.exactAge!;
        }
        return false;
      });
    }

    // Apply type filter (from dropdown)
    const selectedTypeValues = this.selectedTypes.value ?? [];
    if (selectedTypeValues.length > 0) {
      result = result.filter((game) =>
        game.types.some((type) => selectedTypeValues.includes(type)),
      );
    }

    // Apply editor/publisher filter
    const selectedEditorValues = this.selectedEditors.value ?? [];
    if (selectedEditorValues.length > 0) {
      result = result.filter((game) =>
        selectedEditorValues.includes(game.editor),
      );
    }

    // Apply chip types filter (from clicking on chips in cards)
    if (this.selectedChipTypes && this.selectedChipTypes.length > 0) {
      result = result.filter((card) => {
        return this.selectedChipTypes.every((selectedType) =>
          card.types.includes(selectedType),
        );
      });
    }

    // Apply size filter
    if (this.selectedSize) {
      result = result.filter((card) => card.size.includes(this.selectedSize));
    }

    // Apply played/unplayed filter
    if (this.playedGames) {
      result = result.filter((game) => game.isPlayed);
    } else if (this.unPlayedGames) {
      result = result.filter((game) => !game.isPlayed);
    }

    // Apply current sorting if any
    const currentSorting = this.selectedSorting.value;
    if (currentSorting) {
      const sortFunctions: {
        [key: string]: (a: GameCard, b: GameCard) => number;
      } = {
        'A to Z': (a, b) => a.name.localeCompare(b.name),
        'Z to A': (a, b) => b.name.localeCompare(a.name),
        'Year ↑': (a, b) => a.year - b.year,
        'Year ↓': (a, b) => b.year - a.year,
        'Time ↑': (a, b) => a.time - b.time,
        'Time ↓': (a, b) => b.time - a.time,
        'Complexity ↑': (a, b) => a.complexity - b.complexity,
        'Complexity ↓': (a, b) => b.complexity - a.complexity,
        'Rate ↑': (a, b) => a.rate - b.rate,
        'Rate ↓': (a, b) => b.rate - a.rate,
      };
      const sortFunction = sortFunctions[currentSorting];
      if (sortFunction) {
        result.sort(sortFunction);
      }
    } else {
      // Default sorting by name ascending if no sorting is selected
      result = this.filterFunctions.sortByNameAscending(result);
    }

    this.filteredGames = result;
  }

  filterGamesByExactPlayers() {
    this.applyAllFilters();
  }

  filterGamesByAge() {
    this.applyAllFilters();
  }

  toggleCardFlip(game: GameCard, index: number) {
    const targetElement = this.innerElements?.toArray()?.[index];
    if (!targetElement) return;

    const isCurrentlySelected =
      targetElement.nativeElement.classList.contains('active');
    targetElement.nativeElement.classList.toggle('active');

    if (isCurrentlySelected) {
      // Unselect
      this.printGames = this.printGames.filter((g) => g.name !== game.name);
    } else {
      // Select (avoid duplicates)
      if (!this.printGames.some((g) => g.name === game.name)) {
        this.printGames = [...this.printGames, game];
      }
    }
  }

  async exportSelectedAsPdf(): Promise<void> {
    await this.exportService.exportSelectedGamesAsPdf(this.printGames);
  }
}
