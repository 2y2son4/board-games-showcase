import { ElementRef, Injectable, QueryList } from '@angular/core';
import { GameCard, OracleCard } from '../../../components/commons.models';

export interface FilterCriteria {
  searchQuery?: string;
  exactPlayers?: number;
  exactAge?: number;
  selectedTypes?: string[];
  selectedEditors?: string[];
  selectedChipTypes?: string[];
  selectedSize?: string;
  playedGames?: boolean;
  unPlayedGames?: boolean;
  sorting?: string;
}

@Injectable({
  providedIn: 'root',
})
export class FilterFunctionsService {
  readonly SORTING_LABELS = [
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

  private readonly sortFunctions: {
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

  constructor() {}

  /**
   * Applies all filters to the game list based on the provided criteria
   */
  applyFilters(games: GameCard[], criteria: FilterCriteria): GameCard[] {
    let result = [...games];

    result = this.filterBySearch(result, criteria.searchQuery);
    result = this.filterByPlayers(result, criteria.exactPlayers);
    result = this.filterByAge(result, criteria.exactAge);

    // Apply type filtering: prioritize chip types (AND logic) over dropdown types (OR logic)
    const hasChipTypes =
      criteria.selectedChipTypes && criteria.selectedChipTypes.length > 0;
    const hasDropdownTypes =
      criteria.selectedTypes && criteria.selectedTypes.length > 0;

    if (hasChipTypes) {
      result = this.filterByChipTypes(result, criteria.selectedChipTypes);
    } else if (hasDropdownTypes) {
      result = this.filterByTypes(result, criteria.selectedTypes);
    }

    result = this.filterByEditors(result, criteria.selectedEditors);
    result = this.filterBySize(result, criteria.selectedSize);
    result = this.filterByPlayedStatus(
      result,
      criteria.playedGames,
      criteria.unPlayedGames,
    );
    result = this.applySorting(result, criteria.sorting);

    return result;
  }

  /**
   * Filters games by search query (name, editor, year, rate, complexity, types)
   */
  filterBySearch(games: GameCard[], searchQuery?: string): GameCard[] {
    if (!searchQuery?.trim()) {
      return games;
    }

    const query = searchQuery.toLowerCase().trim();
    return games.filter(
      (game) =>
        game.name.toLowerCase().includes(query) ||
        game.editor.toLowerCase().includes(query) ||
        game.year.toString().includes(query) ||
        game.rate.toString().includes(query) ||
        game.complexity.toString().includes(query) ||
        game.types.some((type) => type.toLowerCase().includes(query)),
    );
  }

  /**
   * Filters games by exact number of players
   */
  filterByPlayers(games: GameCard[], exactPlayers?: number): GameCard[] {
    if (!exactPlayers || exactPlayers <= 0) {
      return games;
    }

    return games.filter((game) => {
      const players = game.players;
      if (!players) return false;

      if (players.length === 1) {
        return players[0] === exactPlayers;
      } else if (players.length === 2) {
        const [minPlayers, maxPlayers] = players;
        return minPlayers <= exactPlayers && exactPlayers <= maxPlayers;
      }
      return false;
    });
  }

  /**
   * Filters games by minimum age requirement
   */
  filterByAge(games: GameCard[], exactAge?: number): GameCard[] {
    if (!exactAge) {
      return games;
    }

    return games.filter((game) => game.age && game.age <= exactAge);
  }

  /**
   * Filters games by selected types.
   * The provided types array may include values from the dropdown, chips, or a merged selection.
   */
  filterByTypes(games: GameCard[], selectedTypes?: string[]): GameCard[] {
    if (!selectedTypes || selectedTypes.length === 0) {
      return games;
    }

    return games.filter((game) =>
      game.types.some((type) => selectedTypes.includes(type)),
    );
  }

  /**
   * Filters games by selected editors/publishers
   */
  filterByEditors(games: GameCard[], selectedEditors?: string[]): GameCard[] {
    if (!selectedEditors || selectedEditors.length === 0) {
      return games;
    }

    return games.filter((game) => selectedEditors.includes(game.editor));
  }

  /**
   * Filters games by chip types (requires ALL selected types to be present)
   */
  filterByChipTypes(
    games: GameCard[],
    selectedChipTypes?: string[],
  ): GameCard[] {
    if (!selectedChipTypes || selectedChipTypes.length === 0) {
      return games;
    }

    return games.filter((game) =>
      selectedChipTypes.every((selectedType) =>
        game.types.includes(selectedType),
      ),
    );
  }

  /**
   * Filters games by box size
   */
  filterBySize(games: GameCard[], selectedSize?: string): GameCard[] {
    if (!selectedSize) {
      return games;
    }

    return games.filter((game) => game.size.includes(selectedSize));
  }

  /**
   * Filters games by played/unplayed status
   */
  filterByPlayedStatus(
    games: GameCard[],
    playedGames?: boolean,
    unPlayedGames?: boolean,
  ): GameCard[] {
    if (playedGames) {
      return games.filter((game) => game.isPlayed);
    } else if (unPlayedGames) {
      return games.filter((game) => !game.isPlayed);
    }
    return games;
  }

  /**
   * Applies sorting to the games list
   */
  applySorting(games: GameCard[], sorting?: string): GameCard[] {
    if (!sorting) {
      return this.sortByNameAscending(games);
    }

    const sortFunction = this.sortFunctions[sorting];
    if (sortFunction) {
      return [...games].sort(sortFunction);
    }

    return games;
  }

  /**
   * Sorts items by name in ascending order (generic method)
   */
  sortByNameAscending<T extends { name: string }>(data: T[]): T[] {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Filters oracles by search query (name, artist, description, web)
   */
  filterOraclesBySearch(
    oracles: OracleCard[],
    searchQuery?: string,
  ): OracleCard[] {
    if (!searchQuery?.trim()) {
      return oracles;
    }

    const query = searchQuery.toLowerCase().trim();
    return oracles.filter(
      (oracle) =>
        oracle.name.toLowerCase().includes(query) ||
        oracle.artist.toLowerCase().includes(query) ||
        oracle.web.toLowerCase().includes(query) ||
        oracle.description.some((desc) => desc.toLowerCase().includes(query)),
    );
  }

  /**
   * Searches within a list of items (for dropdown search)
   */
  searchInList(items: string[], searchValue: string): string[] {
    if (!searchValue) {
      return items;
    }

    const filter = searchValue.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(filter));
  }

  /** Cards */
  getFlipCardCount(innerElements: readonly ElementRef[]): number {
    return innerElements
      ? innerElements.filter((innerElement) =>
          innerElement.nativeElement.classList.contains('active'),
        ).length
      : 0;
  }

  flipAllCards(innerElements: readonly ElementRef[]): void {
    if (innerElements) {
      innerElements.forEach((innerElement) => {
        innerElement.nativeElement.classList.remove('active');
      });
    }
  }
}
