import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  viewChildren,
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
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit, AfterViewInit {
  @ViewChild('topPage') topPage!: ElementRef;
  innerElements = viewChildren<ElementRef>('innerElement');
  gamesList!: GameCard[];

  isLoading = signal(false);
  selectedChipTypes = signal<string[]>([]);
  filteredGames = signal<GameCard[]>([]);
  printGames = signal<GameCard[]>([]);
  playedGames = signal(false);
  unPlayedGames = signal(false);
  showPlayedBtn = signal(true);
  showUnplayedBtn = signal(true);
  showSelectAllBtn = signal(false);

  selectedTypes = new FormControl<string[]>([]);
  types: string[] = [];
  selectedSize!: string;
  selectedEditors = new FormControl<string[]>([]);
  editors: string[] = [];
  selectedSorting = new FormControl<string>('');
  searchQuery = '';
  exactPlayers!: number | undefined;
  exactAge!: number | undefined;
  gamesFilterForm!: FormGroup;
  flippedCards!: number;
  sortingSelectLabels: string[] = [];

  readonly gamesImageBase: string;

  readonly #searchSubject$ = new Subject<string>();
  readonly #destroyRef = inject(DestroyRef);
  readonly #destroy$ = new Subject<void>();

  constructor(
    public commonFunctions: CommonFunctionsService,
    public filterFunctions: FilterFunctionsService,
    private readonly httpDataService: HttpService,
    private readonly loaderService: LoaderService,
    private readonly exportService: ExportService,
  ) {
    this.gamesImageBase = this.httpDataService.gamesImageBase;

    this.#searchSubject$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.#destroy$),
      )
      .subscribe(() => {
        this.filterGames();
      });

    this.#destroyRef.onDestroy(() => {
      this.#destroy$.next();
      this.#destroy$.complete();
    });
  }

  ngOnInit(): void {
    this.sortingSelectLabels = this.filterFunctions.SORTING_LABELS;
    this.loaderService.show();
    this.isLoading.set(true);
    this.gamesList = [];

    this.httpDataService.getGames().subscribe({
      next: (response) => {
        this.gamesList = this.filterFunctions.sortByNameAscending(
          response.games,
        );
        this.filteredGames.set(
          this.filterFunctions.sortByNameAscending(response.games),
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
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching games data', error);
        this.loaderService.hide();
        this.isLoading.set(false);
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
    this.filterFunctions.getFlipCardCount(this.innerElements());
  }

  onTypeChange(selectedChipTypes: string[]) {
    this.selectedChipTypes.set(selectedChipTypes);

    // Clear dropdown selections when chips are selected
    if (selectedChipTypes.length > 0) {
      this.selectedTypes.setValue([], { emitEvent: false });
    }

    this.applyAllFilters();
    setTimeout(() => {
      this.filterFunctions.flipAllCards(this.innerElements());
      this.syncCardSelection();
    }, 100);
  }

  onDropdownTypeChange() {
    // Clear chip selections when dropdown is used
    const dropdownTypes = this.selectedTypes.value ?? [];
    if (dropdownTypes.length > 0) {
      this.selectedChipTypes.set([]);
    }

    this.filterFunctions.flipAllCards(this.innerElements());
    this.applyAllFilters();
    this.syncCardSelection();
  }

  onSizeChange(selectedSize: string) {
    this.gamesFilterForm.reset();
    this.restartDropdownFilters();
    this.selectedSize = selectedSize;
    this.applyAllFilters();
    setTimeout(() => {
      this.filterFunctions.flipAllCards(this.innerElements());
      this.syncCardSelection();
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
    this.filterFunctions.flipAllCards(this.innerElements());
    this.applyAllFilters();
    this.syncCardSelection();
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.#searchSubject$.next(value);
  }

  togglePlayed() {
    this.filterFunctions.flipAllCards(this.innerElements());
    this.unPlayedGames.set(false);
    this.playedGames.set(!this.playedGames());
    this.showPlayedBtn.set(false);
    this.showUnplayedBtn.set(true);
    this.applyAllFilters();
    this.syncCardSelection();
  }

  toggleUnPlayed() {
    this.filterFunctions.flipAllCards(this.innerElements());
    this.playedGames.set(false);
    this.unPlayedGames.set(!this.unPlayedGames());
    this.showPlayedBtn.set(true);
    this.showUnplayedBtn.set(false);
    this.applyAllFilters();
    this.syncCardSelection();
  }

  resetGamesList() {
    this.filteredGames.set(this.gamesList);
    this.filterFunctions.flipAllCards(this.innerElements());
  }

  restartFilters() {
    this.selectedChipTypes.set([]);
    this.resetPlayedGames();
    this.restartDropdownFilters();
    this.filterFunctions.flipAllCards(this.innerElements());
    this.topPage.nativeElement.scrollIntoView({
      block: 'end',
      behavior: 'smooth',
    });
    this.showPlayedBtn.set(true);
    this.showUnplayedBtn.set(true);
  }

  restartDropdownFilters() {
    this.selectedSorting.reset();
    this.selectedEditors.reset([]);
    this.selectedTypes.reset([]);
    this.searchQuery = '';
    this.exactPlayers = undefined;
    this.exactAge = undefined;
    this.selectedChipTypes.set([]);
    this.selectedSize = '';
    this.applyAllFilters();
    this.printGames.set([]);
  }

  resetPlayedGames() {
    this.playedGames.set(false);
    this.unPlayedGames.set(false);
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
    const criteria = {
      searchQuery: this.searchQuery,
      exactPlayers: this.exactPlayers,
      exactAge: this.exactAge,
      selectedTypes: this.selectedTypes.value ?? [],
      selectedEditors: this.selectedEditors.value ?? [],
      selectedChipTypes: this.selectedChipTypes(),
      selectedSize: this.selectedSize,
      playedGames: this.playedGames(),
      unPlayedGames: this.unPlayedGames(),
      sorting: this.selectedSorting.value ?? undefined,
    };

    const result = this.filterFunctions.applyFilters(this.gamesList, criteria);
    this.filteredGames.set(result);

    const hasActiveFilters = !!(
      criteria.searchQuery?.trim() ||
      criteria.exactPlayers ||
      criteria.exactAge ||
      (criteria.selectedTypes && criteria.selectedTypes.length > 0) ||
      (criteria.selectedEditors && criteria.selectedEditors.length > 0) ||
      (criteria.selectedChipTypes && criteria.selectedChipTypes.length > 0) ||
      criteria.selectedSize ||
      criteria.playedGames ||
      criteria.unPlayedGames
    );

    this.showSelectAllBtn.set(hasActiveFilters && result.length > 1);
  }

  filterGamesByExactPlayers() {
    this.applyAllFilters();
  }

  filterGamesByAge() {
    this.applyAllFilters();
  }

  /**
   * Syncs the visual selection state (active class) with the printGames signal.
   * This ensures selected cards remain visually selected after sorting/filtering.
   */
  private syncCardSelection(): void {
    setTimeout(() => {
      const elements = this.innerElements();
      const selected = this.printGames();

      elements.forEach((element, index) => {
        const game = this.filteredGames()[index];
        if (game && selected.some((g) => g.name === game.name)) {
          element.nativeElement.classList.add('active');
        }
      });
    }, 0);
  }

  toggleCardFlip(game: GameCard, index: number) {
    const targetElement = this.innerElements()[index];
    if (!targetElement) return;

    const isCurrentlySelected =
      targetElement.nativeElement.classList.contains('active');
    targetElement.nativeElement.classList.toggle('active');

    if (isCurrentlySelected) {
      // Unselect
      this.printGames.set(
        this.printGames().filter((g) => g.name !== game.name),
      );
    } else {
      // Select (avoid duplicates)
      if (!this.printGames().some((g) => g.name === game.name)) {
        this.printGames.set([...this.printGames(), game]);
      }
    }
  }

  allFilteredGamesSelected(): boolean {
    const filtered = this.filteredGames();
    const selected = this.printGames();
    if (filtered.length === 0) return true;
    return filtered.every((g) => selected.some((s) => s.name === g.name));
  }

  selectAllFiltered(): void {
    const currentlySelected = this.printGames();
    const filtered = this.filteredGames();
    const selectedNames = new Set(currentlySelected.map((g) => g.name));
    const merged = [...currentlySelected];

    filtered.forEach((g) => {
      if (!selectedNames.has(g.name)) {
        selectedNames.add(g.name);
        merged.push(g);
      }
    });
    this.printGames.set(merged);
    this.innerElements().forEach((element) => {
      element.nativeElement.classList.add('active');
    });
  }

  async exportSelectedAsPdf(): Promise<void> {
    await this.exportService.exportSelectedGamesAsPdf(
      this.printGames(),
      'selected-games',
      {
        searchQuery: this.searchQuery || undefined,
        selectedChipTypes:
          this.selectedChipTypes().length > 0
            ? this.selectedChipTypes()
            : undefined,
        selectedDropdownTypes:
          this.selectedTypes.value && this.selectedTypes.value.length > 0
            ? this.selectedTypes.value
            : undefined,
        exactPlayers: this.exactPlayers,
        exactAge: this.exactAge,
        selectedEditors:
          this.selectedEditors.value && this.selectedEditors.value.length > 0
            ? this.selectedEditors.value
            : undefined,
        selectedSize: this.selectedSize || undefined,
        playedFilter: this.playedGames()
          ? 'played'
          : this.unPlayedGames()
            ? 'unplayed'
            : null,
      },
    );
  }
}
