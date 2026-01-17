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
  gamesList!: GameCard[];

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedChipTypes: string[] = [];
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
  sortingSelectLabels: string[] = [];
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
    this.sortingSelectLabels = this.filterFunctions.SORTING_LABELS;
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

  onTypeChange(selectedChipTypes: string[]) {
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
    const allTypes = this.commonFunctions.extractUniqueValues(
      this.filterFunctions.sortByNameAscending(this.gamesList),
      'types',
    );
    this.types = this.filterFunctions.searchInList(allTypes, target.value);
  }

  onSearchEditors(target: any) {
    const allEditors = this.commonFunctions.extractUniqueValues(
      this.filterFunctions.sortByNameAscending(this.gamesList),
      'editor',
    );
    this.editors = this.filterFunctions.searchInList(allEditors, target.value);
  }

  filterGames() {
    this.filterFunctions.flipAllCards(this.innerElements);
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
   * Centralized method to apply all active filters using the filter service.
   * This ensures filters work together (AND logic) rather than independently.
   */
  applyAllFilters(): void {
    this.filteredGames = this.filterFunctions.applyFilters(this.gamesList, {
      searchQuery: this.searchQuery,
      exactPlayers: this.exactPlayers,
      exactAge: this.exactAge,
      selectedTypes: this.selectedTypes.value ?? [],
      selectedEditors: this.selectedEditors.value ?? [],
      selectedChipTypes: this.selectedChipTypes,
      selectedSize: this.selectedSize,
      playedGames: this.playedGames,
      unPlayedGames: this.unPlayedGames,
      sorting: this.selectedSorting.value ?? undefined,
    });
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
