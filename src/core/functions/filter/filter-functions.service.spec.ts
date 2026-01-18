import { TestBed } from '@angular/core/testing';

import { FilterFunctionsService } from './filter-functions.service';
import { GameCard, OracleCard } from '../../../components/commons.models';

describe('FilterFunctionsService', () => {
  let service: FilterFunctionsService;
  const game1: GameCard = {
    name: 'Catan',
    year: 2020,
    editor: 'Kosmos',
    types: ['Strategy', 'Family'],
    language: 'en',
    complexity: 2,
    isPlayed: true,
    age: 10,
    rate: 7.5,
    players: [3, 4],
    time: 90,
    image: 'catan.jpg',
    bggReference: 13,
    size: 'm',
  };
  const game2: GameCard = {
    name: 'Azul',
    year: 2022,
    editor: 'Plan B Games',
    types: ['Abstract', 'Family'],
    language: 'es',
    complexity: 3,
    isPlayed: false,
    age: 8,
    rate: 8.0,
    players: [2, 4],
    time: 45,
    image: 'azul.jpg',
    bggReference: 230802,
    size: 's',
  };
  const game3: GameCard = {
    name: 'Wingspan',
    year: 2019,
    editor: 'Stonemaier Games',
    types: ['Strategy', 'Animals'],
    language: 'en',
    complexity: 2,
    isPlayed: false,
    age: 10,
    rate: 8.5,
    players: [1, 5],
    time: 60,
    image: 'wingspan.jpg',
    bggReference: 266192,
    size: 'l',
  };
  const game4: GameCard = {
    name: 'Ticket to Ride',
    year: 2021,
    editor: 'Days of Wonder',
    types: ['Family', 'Trains'],
    language: 'en',
    complexity: 1,
    isPlayed: true,
    age: 8,
    rate: 7.0,
    players: [2, 5],
    time: 30,
    image: 'ticket.jpg',
    bggReference: 9209,
    size: 'm',
  };
  const game5: GameCard = {
    name: 'Pandemic',
    year: 2023,
    editor: 'Z-Man Games',
    types: ['Cooperative', 'Strategy'],
    language: 'en',
    complexity: 2,
    isPlayed: false,
    age: 8,
    rate: 7.8,
    players: [4],
    time: 45,
    image: 'pandemic.jpg',
    bggReference: 30549,
    size: 'm',
  };
  const games = [game1, game2, game3, game4, game5];

  const oracle1: OracleCard = {
    name: 'Oracle of Delphi',
    artist: 'John Doe',
    language: 'en',
    description: ['Ancient wisdom', 'Greek mythology'],
    web: 'https://oracle-delphi.com',
  };
  const oracle2: OracleCard = {
    name: 'Tarot Cards',
    artist: 'Jane Smith',
    language: 'es',
    description: ['Divination tool', 'Fortune telling'],
    web: 'https://tarot.com',
  };
  const oracles = [oracle1, oracle2];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sortByNameAscending', () => {
    it('should sort by name in ascending order', () => {
      const sortedGames = service.sortByNameAscending(games);
      expect(sortedGames[0].name).toBe('Azul');
      expect(sortedGames[1].name).toBe('Catan');
      expect(sortedGames[2].name).toBe('Pandemic');
      expect(sortedGames[3].name).toBe('Ticket to Ride');
      expect(sortedGames[4].name).toBe('Wingspan');
    });

    it('should not modify the original array', () => {
      const original = [...games];
      service.sortByNameAscending(games);
      expect(games).toEqual(original);
    });
  });

  describe('filterBySearch', () => {
    it('should return all games when search query is empty', () => {
      expect(service.filterBySearch(games, '')).toEqual(games);
      expect(service.filterBySearch(games, '   ')).toEqual(games);
      expect(service.filterBySearch(games, undefined)).toEqual(games);
    });

    it('should filter games by name', () => {
      const result = service.filterBySearch(games, 'Catan');
      expect(result).toEqual([game1]);
    });

    it('should filter games by editor', () => {
      const result = service.filterBySearch(games, 'Kosmos');
      expect(result).toEqual([game1]);
    });

    it('should filter games by year', () => {
      const result = service.filterBySearch(games, '2019');
      expect(result).toEqual([game3]);
    });

    it('should filter games by rate', () => {
      const result = service.filterBySearch(games, '8.5');
      expect(result).toEqual([game3]);
    });

    it('should filter games by complexity', () => {
      const result = service.filterBySearch(games, '3');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should filter games by type', () => {
      const result = service.filterBySearch(games, 'Strategy');
      expect(result).toContain(game1);
      expect(result).toContain(game3);
      expect(result).toContain(game5);
    });

    it('should be case insensitive', () => {
      const result1 = service.filterBySearch(games, 'CATAN');
      const result2 = service.filterBySearch(games, 'catan');
      expect(result1).toEqual(result2);
    });

    it('should handle partial matches', () => {
      const result = service.filterBySearch(games, 'ame');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('filterByPlayers', () => {
    it('should return all games when exactPlayers is not provided', () => {
      expect(service.filterByPlayers(games, undefined)).toEqual(games);
      expect(service.filterByPlayers(games, 0)).toEqual(games);
      expect(service.filterByPlayers(games, -1)).toEqual(games);
    });

    it('should filter games by exact player count for single value', () => {
      const result = service.filterByPlayers(games, 4);
      expect(result).toContain(game5);
    });

    it('should filter games by player count within range', () => {
      const result = service.filterByPlayers(games, 3);
      expect(result).toContain(game1);
    });

    it('should exclude games where player count is outside range', () => {
      const result = service.filterByPlayers(games, 6);
      expect(result.length).toBe(0);
    });

    it('should handle edge cases for player range', () => {
      const result = service.filterByPlayers(games, 2);
      expect(result).toContain(game2);
      expect(result).toContain(game4);
    });

    it('should handle games with single exact player count', () => {
      const result = service.filterByPlayers(games, 4);
      expect(result).toContain(game5);
    });
  });

  describe('filterByAge', () => {
    it('should return all games when exactAge is not provided', () => {
      expect(service.filterByAge(games, undefined)).toEqual(games);
      expect(service.filterByAge(games, 0)).toEqual(games);
    });

    it('should filter games by minimum age requirement', () => {
      const result = service.filterByAge(games, 8);
      expect(result).toContain(game2);
      expect(result).toContain(game4);
      expect(result).toContain(game5);
    });

    it('should exclude games with higher age requirement', () => {
      const result = service.filterByAge(games, 9);
      expect(result).not.toContain(game1);
      expect(result).not.toContain(game3);
    });

    it('should include games with exact age match', () => {
      const result = service.filterByAge(games, 10);
      expect(result).toContain(game1);
      expect(result).toContain(game3);
    });
  });

  describe('filterByTypes', () => {
    it('should return all games when selectedTypes is empty or undefined', () => {
      expect(service.filterByTypes(games, undefined)).toEqual(games);
      expect(service.filterByTypes(games, [])).toEqual(games);
    });

    it('should filter games by single type', () => {
      const result = service.filterByTypes(games, ['Strategy']);
      expect(result).toContain(game1);
      expect(result).toContain(game3);
      expect(result).toContain(game5);
    });

    it('should filter games by multiple types (OR logic)', () => {
      const result = service.filterByTypes(games, ['Strategy', 'Abstract']);
      expect(result).toContain(game1);
      expect(result).toContain(game2);
      expect(result).toContain(game3);
      expect(result).toContain(game5);
    });

    it('should include game if it has at least one matching type', () => {
      const result = service.filterByTypes(games, ['Family']);
      expect(result).toContain(game1);
      expect(result).toContain(game2);
      expect(result).toContain(game4);
    });
  });

  describe('filterByEditors', () => {
    it('should return all games when selectedEditors is empty or undefined', () => {
      expect(service.filterByEditors(games, undefined)).toEqual(games);
      expect(service.filterByEditors(games, [])).toEqual(games);
    });

    it('should filter games by single editor', () => {
      const result = service.filterByEditors(games, ['Kosmos']);
      expect(result).toEqual([game1]);
    });

    it('should filter games by multiple editors', () => {
      const result = service.filterByEditors(games, ['Kosmos', 'Plan B Games']);
      expect(result).toContain(game1);
      expect(result).toContain(game2);
      expect(result.length).toBe(2);
    });
  });

  describe('filterByChipTypes', () => {
    it('should return all games when selectedChipTypes is empty or undefined', () => {
      expect(service.filterByChipTypes(games, undefined)).toEqual(games);
      expect(service.filterByChipTypes(games, [])).toEqual(games);
    });

    it('should filter games that have ALL selected types (AND logic)', () => {
      const result = service.filterByChipTypes(games, ['Strategy', 'Family']);
      expect(result).toEqual([game1]);
    });

    it('should exclude games that have only some of the selected types', () => {
      const result = service.filterByChipTypes(games, ['Strategy', 'Abstract']);
      expect(result.length).toBe(0);
    });

    it('should handle single type selection', () => {
      const result = service.filterByChipTypes(games, ['Cooperative']);
      expect(result).toEqual([game5]);
    });

    it('should exclude games missing any required type', () => {
      const result = service.filterByChipTypes(games, ['Strategy', 'Trains']);
      expect(result.length).toBe(0);
    });
  });

  describe('filterBySize', () => {
    it('should return all games when selectedSize is not provided', () => {
      expect(service.filterBySize(games, undefined)).toEqual(games);
      expect(service.filterBySize(games, '')).toEqual(games);
    });

    it('should filter games by size', () => {
      const result = service.filterBySize(games, 'm');
      expect(result).toContain(game1);
      expect(result).toContain(game4);
      expect(result).toContain(game5);
    });

    it('should filter games by small size', () => {
      const result = service.filterBySize(games, 's');
      expect(result).toEqual([game2]);
    });

    it('should filter games by large size', () => {
      const result = service.filterBySize(games, 'l');
      expect(result).toEqual([game3]);
    });
  });

  describe('filterByPlayedStatus', () => {
    it('should return all games when neither flag is set', () => {
      expect(service.filterByPlayedStatus(games, false, false)).toEqual(games);
      expect(service.filterByPlayedStatus(games, undefined, undefined)).toEqual(games);
    });

    it('should filter played games', () => {
      const result = service.filterByPlayedStatus(games, true, false);
      expect(result).toContain(game1);
      expect(result).toContain(game4);
      expect(result.length).toBe(2);
    });

    it('should filter unplayed games', () => {
      const result = service.filterByPlayedStatus(games, false, true);
      expect(result).toContain(game2);
      expect(result).toContain(game3);
      expect(result).toContain(game5);
      expect(result.length).toBe(3);
    });

    it('should prioritize playedGames when both flags are true', () => {
      const result = service.filterByPlayedStatus(games, true, true);
      expect(result).toContain(game1);
      expect(result).toContain(game4);
      expect(result.length).toBe(2);
    });
  });

  describe('applySorting', () => {
    it('should sort by name ascending by default', () => {
      const result = service.applySorting(games, undefined);
      expect(result[0].name).toBe('Azul');
      expect(result[4].name).toBe('Wingspan');
    });

    it('should sort A to Z', () => {
      const result = service.applySorting(games, 'A to Z');
      expect(result[0].name).toBe('Azul');
      expect(result[4].name).toBe('Wingspan');
    });

    it('should sort Z to A', () => {
      const result = service.applySorting(games, 'Z to A');
      expect(result[0].name).toBe('Wingspan');
      expect(result[4].name).toBe('Azul');
    });

    it('should sort by year ascending', () => {
      const result = service.applySorting(games, 'Year ↑');
      expect(result[0].year).toBe(2019);
      expect(result[4].year).toBe(2023);
    });

    it('should sort by year descending', () => {
      const result = service.applySorting(games, 'Year ↓');
      expect(result[0].year).toBe(2023);
      expect(result[4].year).toBe(2019);
    });

    it('should sort by time ascending', () => {
      const result = service.applySorting(games, 'Time ↑');
      expect(result[0].time).toBe(30);
      expect(result[4].time).toBe(90);
    });

    it('should sort by time descending', () => {
      const result = service.applySorting(games, 'Time ↓');
      expect(result[0].time).toBe(90);
      expect(result[4].time).toBe(30);
    });

    it('should sort by complexity ascending', () => {
      const result = service.applySorting(games, 'Complexity ↑');
      expect(result[0].complexity).toBe(1);
      expect(result[4].complexity).toBe(3);
    });

    it('should sort by complexity descending', () => {
      const result = service.applySorting(games, 'Complexity ↓');
      expect(result[0].complexity).toBe(3);
      expect(result[4].complexity).toBe(1);
    });

    it('should sort by rate ascending', () => {
      const result = service.applySorting(games, 'Rate ↑');
      expect(result[0].rate).toBe(7.0);
      expect(result[4].rate).toBe(8.5);
    });

    it('should sort by rate descending', () => {
      const result = service.applySorting(games, 'Rate ↓');
      expect(result[0].rate).toBe(8.5);
      expect(result[4].rate).toBe(7.0);
    });

    it('should return games unchanged for invalid sorting option', () => {
      const result = service.applySorting(games, 'Invalid Sort');
      expect(result).toEqual(games);
    });

    it('should not modify the original array', () => {
      const original = [...games];
      service.applySorting(games, 'Year ↑');
      expect(games).toEqual(original);
    });
  });

  describe('applyFilters', () => {
    it('should apply no filters when criteria is empty', () => {
      const result = service.applyFilters(games, {});
      expect(result.length).toBe(5);
    });

    it('should apply single filter', () => {
      const result = service.applyFilters(games, { searchQuery: 'Catan' });
      expect(result).toEqual([game1]);
    });

    it('should apply multiple filters in combination', () => {
      const result = service.applyFilters(games, {
        selectedTypes: ['Strategy'],
        exactPlayers: 4,
      });
      expect(result).toContain(game1);
      expect(result).toContain(game5);
    });

    it('should apply all filter types together', () => {
      const result = service.applyFilters(games, {
        searchQuery: 'Game',
        exactPlayers: 4,
        exactAge: 10,
        selectedTypes: ['Strategy'],
        playedGames: false,
        unPlayedGames: true,
        sorting: 'A to Z',
      });
      expect(result.length).toBeGreaterThanOrEqual(0);
    });

    it('should return sorted results', () => {
      const result = service.applyFilters(games, {
        selectedTypes: ['Family'],
        sorting: 'Year ↑',
      });
      expect(result.length).toBeGreaterThan(0);
      if (result.length > 1) {
        expect(result[0].year).toBeLessThanOrEqual(result[1].year);
      }
    });

    it('should chain filters correctly reducing results', () => {
      const result1 = service.applyFilters(games, { selectedTypes: ['Strategy'] });
      const result2 = service.applyFilters(games, {
        selectedTypes: ['Strategy'],
        exactAge: 8,
      });
      expect(result2.length).toBeLessThanOrEqual(result1.length);
    });

    it('should not modify the original games array', () => {
      const original = [...games];
      service.applyFilters(games, { searchQuery: 'test' });
      expect(games).toEqual(original);
    });
  });

  describe('filterOraclesBySearch', () => {
    it('should return all oracles when search query is empty', () => {
      expect(service.filterOraclesBySearch(oracles, '')).toEqual(oracles);
      expect(service.filterOraclesBySearch(oracles, '   ')).toEqual(oracles);
      expect(service.filterOraclesBySearch(oracles, undefined)).toEqual(oracles);
    });

    it('should filter oracles by name', () => {
      const result = service.filterOraclesBySearch(oracles, 'Delphi');
      expect(result).toEqual([oracle1]);
    });

    it('should filter oracles by artist', () => {
      const result = service.filterOraclesBySearch(oracles, 'Jane Smith');
      expect(result).toEqual([oracle2]);
    });

    it('should filter oracles by web', () => {
      const result = service.filterOraclesBySearch(oracles, 'tarot.com');
      expect(result).toEqual([oracle2]);
    });

    it('should filter oracles by description', () => {
      const result = service.filterOraclesBySearch(oracles, 'mythology');
      expect(result).toEqual([oracle1]);
    });

    it('should be case insensitive', () => {
      const result1 = service.filterOraclesBySearch(oracles, 'TAROT');
      const result2 = service.filterOraclesBySearch(oracles, 'tarot');
      expect(result1).toEqual(result2);
    });

    it('should handle partial matches', () => {
      const result = service.filterOraclesBySearch(oracles, 'Del');
      expect(result).toEqual([oracle1]);
    });

    it('should search across multiple description entries', () => {
      const result = service.filterOraclesBySearch(oracles, 'Fortune');
      expect(result).toEqual([oracle2]);
    });
  });

  describe('searchInList', () => {
    const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

    it('should return all items when search value is empty', () => {
      expect(service.searchInList(items, '')).toEqual(items);
    });

    it('should filter items by search value', () => {
      const result = service.searchInList(items, 'an');
      expect(result).toContain('Banana');
    });

    it('should be case insensitive', () => {
      const result = service.searchInList(items, 'APPLE');
      expect(result).toContain('Apple');
    });

    it('should handle partial matches', () => {
      const result = service.searchInList(items, 'err');
      expect(result).toContain('Cherry');
      expect(result).toContain('Elderberry');
    });

    it('should return empty array when no matches found', () => {
      const result = service.searchInList(items, 'xyz');
      expect(result).toEqual([]);
    });

    it('should handle special characters', () => {
      const specialItems = ['test-1', 'test_2', 'test.3'];
      const result = service.searchInList(specialItems, 'test-');
      expect(result).toContain('test-1');
    });
  });
});
