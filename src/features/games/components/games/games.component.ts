import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Subject, debounceTime, takeUntil } from 'rxjs';

import { FilterFunctionsService } from '../../../../core/functions/filter/filter-functions.service';
import { CommonFunctionsService } from '../../../../core/functions/common/common-functions.service';
import { HttpService } from '../../../../core/services/http/http.service';
import { ExportService } from '../../../../core/services/export/export.service';
import { ScrollToTopBtnComponent } from '../../../../shared/components/scroll-to-top-btn/scroll-to-top-btn.component';
import { GameOfTheDayComponent } from '../game-of-the-day/game-of-the-day.component';
import { GameCard } from '../../models';
import { GamesCardsComponent } from '../games-cards/games-cards.component';
import { GamesFiltersComponent } from '../games-filters/games-filters.component';
import { GamesFilterForm } from './games-filter-form.model';

@Component({
  selector: 'app-games',
  imports: [
    CommonModule,
    GamesCardsComponent,
    GamesFiltersComponent,
    MatButtonModule,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './games.component.html',
  styleUrl: './games.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesComponent implements OnInit {
  private static readonly INITIAL_VISIBLE_GAMES = 9;
  private static readonly LOAD_MORE_DELAY_MS = 180;

  readonly commonFunctions = inject(CommonFunctionsService);
  readonly filterFunctions = inject(FilterFunctionsService);
  private readonly httpDataService = inject(HttpService);
  private readonly exportService = inject(ExportService);
  private readonly dialog = inject(MatDialog);

  topPage = viewChild<ElementRef>('topPage');

  gamesList: GameCard[] = [];
  allTypes: string[] = [];
  allEditors: string[] = [];
  types: string[] = [];
  sizes: string[] = [];
  editors: string[] = [];

  isLoading = signal(false);
  isLoadingMoreGames = signal(false);
  selectedChipTypes = signal<string[]>([]);
  filteredGames = signal<GameCard[]>([]);
  visibleGamesCount = signal(GamesComponent.INITIAL_VISIBLE_GAMES);
  printGames = signal<GameCard[]>([]);
  playedGames = signal(false);
  unPlayedGames = signal(false);
  showPlayedBtn = signal(true);
  showUnplayedBtn = signal(true);
  showSelectAllBtn = signal(false);
  visibleGames = computed(() =>
    this.filteredGames().slice(0, this.visibleGamesCount()),
  );
  hasMoreVisibleGames = computed(
    () => this.visibleGames().length < this.filteredGames().length,
  );

  sortingSelectLabels: string[] = [];
  readonly gamesImageBase: string;

  readonly gamesFilterForm: GamesFilterForm = new FormGroup({
    searchQuery: new FormControl('', { nonNullable: true }),
    selectedSorting: new FormControl<string | null>(null),
    exactPlayers: new FormControl<number | null>(null),
    exactAge: new FormControl<number | null>(null),
    selectedTypes: new FormControl<string[] | null>([]),
    selectedEditors: new FormControl<string[] | null>([]),
    selectedSize: new FormControl<string | null>(null),
  });

  selectedTypes = this.gamesFilterForm.controls.selectedTypes;
  selectedEditors = this.gamesFilterForm.controls.selectedEditors;
  selectedSorting = this.gamesFilterForm.controls.selectedSorting;

  get searchQuery(): string {
    return this.gamesFilterForm.controls.searchQuery.value;
  }

  set searchQuery(value: string) {
    this.gamesFilterForm.controls.searchQuery.setValue(value, {
      emitEvent: false,
    });
  }

  get exactPlayers(): number | undefined {
    return this.gamesFilterForm.controls.exactPlayers.value ?? undefined;
  }

  set exactPlayers(value: number | undefined) {
    this.gamesFilterForm.controls.exactPlayers.setValue(value ?? null, {
      emitEvent: false,
    });
  }

  get exactAge(): number | undefined {
    return this.gamesFilterForm.controls.exactAge.value ?? undefined;
  }

  set exactAge(value: number | undefined) {
    this.gamesFilterForm.controls.exactAge.setValue(value ?? null, {
      emitEvent: false,
    });
  }

  get selectedSize(): string {
    return this.gamesFilterForm.controls.selectedSize.value ?? '';
  }

  set selectedSize(value: string) {
    this.gamesFilterForm.controls.selectedSize.setValue(value || null, {
      emitEvent: false,
    });
  }

  readonly #destroyRef = inject(DestroyRef);
  readonly #destroy$ = new Subject<void>();
  #loadMoreTimeoutId: number | undefined;

  constructor() {
    this.gamesImageBase = this.httpDataService.gamesImageBase;

    this.#destroyRef.onDestroy(() => {
      if (this.#loadMoreTimeoutId !== undefined) {
        window.clearTimeout(this.#loadMoreTimeoutId);
      }

      this.#destroy$.next();
      this.#destroy$.complete();
    });
  }

  ngOnInit(): void {
    this.sortingSelectLabels = this.filterFunctions.SORTING_LABELS;

    this.gamesFilterForm.valueChanges
      .pipe(debounceTime(200), takeUntil(this.#destroy$))
      .subscribe(() => {
        this.applyAllFilters();
      });

    this.loadGames();
  }

  private loadGames(): void {
    this.isLoading.set(true);

    this.httpDataService.getGames().subscribe({
      next: (response) => {
        const sortedGames = this.filterFunctions
          .sortByNameAscending(response.games)
          .map((game) => ({
            ...game,
            types: [...game.types].sort(),
          }));

        this.gamesList = sortedGames;
        this.filteredGames.set(sortedGames);
        this.resetVisibleGames();

        this.allTypes = this.commonFunctions.extractUniqueValues(
          sortedGames,
          'types',
        );
        this.types = [...this.allTypes];

        this.allEditors = this.commonFunctions.extractUniqueValues(
          sortedGames,
          'editor',
        );
        this.editors = [...this.allEditors];

        const sizeOrder = ['xs', 's', 'm', 'l', 'xl'];
        this.sizes = this.commonFunctions
          .extractUniqueValues(sortedGames, 'size')
          .sort((a, b) => {
            const indexA =
              sizeOrder.indexOf(a) !== -1
                ? sizeOrder.indexOf(a)
                : sizeOrder.length;
            const indexB =
              sizeOrder.indexOf(b) !== -1
                ? sizeOrder.indexOf(b)
                : sizeOrder.length;
            return indexA === indexB ? a.localeCompare(b) : indexA - indexB;
          });

        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching games data', error);
        this.isLoading.set(false);
      },
    });
  }

  onTypeChange(selectedChipTypes: string[]): void {
    this.selectedChipTypes.set(selectedChipTypes);

    if (selectedChipTypes.length > 0) {
      this.selectedTypes.setValue([]);
    }

    this.applyAllFilters();
  }

  onSizeChange(selectedSize: string): void {
    this.gamesFilterForm.patchValue(
      {
        searchQuery: '',
        selectedSorting: null,
        exactPlayers: null,
        exactAge: null,
        selectedTypes: [],
        selectedEditors: [],
        selectedSize: selectedSize || null,
      },
      { emitEvent: false },
    );

    this.selectedChipTypes.set([]);
    this.types = [...this.allTypes];
    this.editors = [...this.allEditors];
    this.printGames.set([]);
    this.resetPlayedGames();

    this.applyAllFilters();
  }

  onSizeFilterChange(event: MatSelectChange): void {
    this.unselectAll();
    this.gamesFilterForm.controls.selectedSize.setValue(event.value ?? null);
    this.applyAllFilters();
  }

  onSearchTypes(target: EventTarget | string | null): void {
    const searchValue =
      typeof target === 'string'
        ? target
        : target instanceof HTMLInputElement
          ? target.value
          : '';

    this.types = this.filterFunctions.searchInList(this.allTypes, searchValue);
  }

  onSearchEditors(target: EventTarget | string | null): void {
    const searchValue =
      typeof target === 'string'
        ? target
        : target instanceof HTMLInputElement
          ? target.value
          : '';

    this.editors = this.filterFunctions.searchInList(
      this.allEditors,
      searchValue,
    );
  }

  filterGames(): void {
    this.applyAllFilters();
  }

  onSearchInput(value: string): void {
    this.gamesFilterForm.controls.searchQuery.setValue(value);
  }

  togglePlayed(): void {
    this.unPlayedGames.set(false);
    this.playedGames.set(!this.playedGames());
    this.showPlayedBtn.set(false);
    this.showUnplayedBtn.set(true);
    this.applyAllFilters();
  }

  toggleUnPlayed(): void {
    this.playedGames.set(false);
    this.unPlayedGames.set(!this.unPlayedGames());
    this.showPlayedBtn.set(true);
    this.showUnplayedBtn.set(false);
    this.applyAllFilters();
  }

  resetGamesList(): void {
    this.filteredGames.set(this.gamesList);
  }

  restartFilters(): void {
    this.selectedChipTypes.set([]);
    this.resetPlayedGames();
    this.restartDropdownFilters();

    this.topPage()?.nativeElement?.scrollIntoView?.({
      block: 'end',
      behavior: 'smooth',
    });

    this.showPlayedBtn.set(true);
    this.showUnplayedBtn.set(true);
  }

  restartDropdownFilters(): void {
    this.gamesFilterForm.patchValue(
      {
        searchQuery: '',
        selectedSorting: null,
        exactPlayers: null,
        exactAge: null,
        selectedTypes: [],
        selectedEditors: [],
        selectedSize: null,
      },
      { emitEvent: false },
    );

    this.types = [...this.allTypes];
    this.editors = [...this.allEditors];
    this.applyAllFilters();
    this.printGames.set([]);
  }

  resetPlayedGames(): void {
    this.playedGames.set(false);
    this.unPlayedGames.set(false);
  }

  restartSearch(): void {
    this.gamesFilterForm.controls.searchQuery.setValue('');
    this.applyAllFilters();
  }

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
    this.resetVisibleGames();

    const selectedNames = new Set(result.map((g) => g.name));
    this.printGames.set(
      this.printGames().filter((game) => selectedNames.has(game.name)),
    );

    const hasActiveFilters = !!(
      criteria.searchQuery.trim() ||
      criteria.exactPlayers ||
      criteria.exactAge ||
      (criteria.selectedTypes?.length ?? 0) > 0 ||
      criteria.selectedEditors.length > 0 ||
      criteria.selectedChipTypes.length > 0 ||
      criteria.selectedSize ||
      criteria.playedGames ||
      criteria.unPlayedGames
    );

    this.showSelectAllBtn.set(hasActiveFilters && result.length > 1);
  }

  loadMoreGames(): void {
    if (!this.hasMoreVisibleGames() || this.isLoadingMoreGames()) {
      return;
    }

    this.isLoadingMoreGames.set(true);

    this.#loadMoreTimeoutId = window.setTimeout(() => {
      this.visibleGamesCount.update(
        (count) => count + GamesComponent.INITIAL_VISIBLE_GAMES,
      );
      this.isLoadingMoreGames.set(false);
      this.#loadMoreTimeoutId = undefined;
    }, GamesComponent.LOAD_MORE_DELAY_MS);
  }

  private resetVisibleGames(): void {
    this.visibleGamesCount.set(GamesComponent.INITIAL_VISIBLE_GAMES);
    this.isLoadingMoreGames.set(false);

    if (this.#loadMoreTimeoutId !== undefined) {
      window.clearTimeout(this.#loadMoreTimeoutId);
      this.#loadMoreTimeoutId = undefined;
    }
  }

  filterGamesByExactPlayers(): void {
    this.applyAllFilters();
  }

  filterGamesByAge(): void {
    this.applyAllFilters();
  }

  getAppliedFiltersSummary(): string[] {
    const selectedSorting = this.selectedSorting.value;
    const selectedEditors = this.selectedEditors.value ?? [];

    return [
      this.searchQuery.trim() ? `Search: "${this.searchQuery.trim()}"` : null,
      selectedSorting ? `Sort: ${selectedSorting}` : null,
      this.exactPlayers != null ? `Players: ${this.exactPlayers}` : null,
      this.exactAge != null ? `Age: ${this.exactAge}+` : null,
      selectedEditors.length
        ? `Publishers: ${selectedEditors.join(', ')}`
        : null,
      this.selectedSize ? `Size: ${this.selectedSize.toUpperCase()}` : null,
    ].filter((filter): filter is string => filter !== null);
  }

  toggleCardFlip(game: GameCard): void {
    const selected = this.printGames();
    const isCurrentlySelected = selected.some((g) => g.name === game.name);

    if (isCurrentlySelected) {
      this.printGames.set(selected.filter((g) => g.name !== game.name));
      return;
    }

    this.printGames.set([...selected, game]);
  }

  openGameOfTheDay(): void {
    this.dialog.open(GameOfTheDayComponent, {
      width: '700px',
      maxWidth: '95vw',
    });
  }

  allFilteredGamesSelected(): boolean {
    const filtered = this.filteredGames();
    const selected = this.printGames();
    if (filtered.length === 0) return true;

    return filtered.every((g) => selected.some((s) => s.name === g.name));
  }

  isUnselectMode(): boolean {
    return this.printGames().length > 0;
  }

  toggleSelectAll(): void {
    if (this.isUnselectMode()) {
      this.unselectAll();
    } else {
      this.selectAllFiltered();
    }
  }

  unselectAll(): void {
    this.printGames.set([]);
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
          (this.selectedTypes.value?.length ?? 0) > 0
            ? (this.selectedTypes.value ?? undefined)
            : undefined,
        exactPlayers: this.exactPlayers,
        exactAge: this.exactAge,
        selectedEditors:
          (this.selectedEditors.value?.length ?? 0) > 0
            ? (this.selectedEditors.value ?? undefined)
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
