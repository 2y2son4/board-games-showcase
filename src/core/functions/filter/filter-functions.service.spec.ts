import { TestBed } from '@angular/core/testing';

import { FilterFunctionsService } from './filter-functions.service';
import { GameCard } from '../../../components/commons.models';

describe('GameCardSortingService', () => {
  let service: FilterFunctionsService;
  const game1: GameCard = {
    name: 'Game 1',
    year: 2021,
    editor: 'Editor 1',
    types: ['Type A'],
    language: 'en',
    complexity: 2,
    isPlayed: true,
    age: 10,
    rate: 7.5,
    players: [2, 4],
    time: 60,
    image: 'image',
    bggReference: 0,
    size: 's',
  };
  const game2: GameCard = {
    name: 'Game 2',
    year: 2022,
    editor: 'Editor 2',
    types: ['Type B', 'Type C'],
    language: 'es',
    complexity: 3,
    isPlayed: false,
    age: 12,
    rate: 6.0,
    players: [3, 5],
    time: 90,
    image: 'image',
    bggReference: 0,
    size: 'm',
  };
  const game3: GameCard = {
    name: 'Another thing',
    year: 2023,
    editor: 'Editor 1',
    types: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    age: 8,
    rate: 8.0,
    players: [2],
    time: 30,
    image: 'image',
    bggReference: 0,
    size: 's',
  };
  const game4: GameCard = {
    name: 'Another thing 2 ',
    year: 2023,
    editor: 'Editor 1',
    types: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    age: 8,
    rate: 5.0,
    players: [2],
    time: 30,
    image: 'image',
    bggReference: 0,
    size: 's',
  };
  const game5: GameCard = {
    name: 'Another thing 3',
    year: 2023,
    editor: 'Editor 1',
    types: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    age: 8,
    rate: 7.0,
    players: [2],
    time: 30,
    image: 'image',
    bggReference: 0,
    size: 's',
  };
  const games = [game1, game2, game3, game4, game5];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('sortByNameAscending should sort by name in ascending order', () => {
    const sortedGames = service.sortByNameAscending(games);
    expect(sortedGames).toEqual([game3, game4, game5, game1, game2]);
  });

  it('should filter games by search query', () => {
    const result = service.filterBySearch(games, 'Game 1');
    expect(result).toEqual([game1]);
  });

  it('should filter games by exact number of players', () => {
    const result = service.filterByPlayers(games, 3);
    expect(result).toEqual([game1, game2]); // game1 has [2,4] which includes 3, game2 has [3,5]
  });

  it('should filter games by age requirement', () => {
    const result = service.filterByAge(games, 10);
    expect(result).toEqual([game1, game3, game4, game5]); // age <= 10 (sorted by name via applyFilters)
  });

  it('should filter games by types (OR logic)', () => {
    const result = service.filterByTypes(games, ['Type B']);
    expect(result).toEqual([game2]);
  });

  it('should filter games by chip types (AND logic)', () => {
    const result = service.filterByChipTypes(games, ['Type A', 'Type D']);
    expect(result).toEqual([game3, game4, game5]); // Must have BOTH types
  });

  it('should filter games by editors', () => {
    const result = service.filterByEditors(games, ['Editor 2']);
    expect(result).toEqual([game2]);
  });

  it('should filter games by size', () => {
    const result = service.filterBySize(games, 'm');
    expect(result).toEqual([game2]);
  });

  it('should filter games by played status', () => {
    const result = service.filterByPlayedStatus(games, true, false);
    expect(result).toEqual([game1]);
  });

  it('should filter games by unplayed status', () => {
    const result = service.filterByPlayedStatus(games, false, true);
    expect(result).toEqual([game2, game3, game4, game5]);
  });

  it('should apply multiple filters using applyFilters', () => {
    const result = service.applyFilters(games, {
      searchQuery: 'Another',
      exactAge: 10,
      selectedTypes: ['Type A'],
    });
    expect(result).toEqual([game3, game4, game5]); // Matches "Another" AND age <= 10 AND has Type A
  });

  it('should sort games by complexity ascending', () => {
    const result = service.applySorting(games, 'Complexity ↑');
    expect(result[0]).toEqual(game3); // complexity 1
    expect(result[result.length - 1]).toEqual(game2); // complexity 3
  });

  it('should sort games by rate descending', () => {
    const result = service.applySorting(games, 'Rate ↓');
    expect(result[0]).toEqual(game3); // rate 8.0
    expect(result[result.length - 1]).toEqual(game4); // rate 5.0
  });

  it('should handle empty filters gracefully', () => {
    const result = service.applyFilters(games, {});
    expect(result.length).toBe(5); // All games returned, sorted by name
  });

  it('should search within a list', () => {
    const items = ['Strategy', 'Party', 'Family', 'Abstract'];
    const result = service.searchInList(items, 'str');
    expect(result).toEqual(['Strategy', 'Abstract']);
  });
});
