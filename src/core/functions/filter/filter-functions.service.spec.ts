import { TestBed } from '@angular/core/testing';

import { FilterFunctionsService } from './filter-functions.service';
import { GameCard } from '../../../components/games/games.component.model';

describe('GameCardSortingService', () => {
  let service: FilterFunctionsService;
  const game1: GameCard = {
    name: 'Game 1',
    year: 2021,
    editor: 'Editor 1',
    type: ['Type A'],
    language: 'en',
    complexity: 2,
    isPlayed: true,
    players: [4],
  };
  const game2: GameCard = {
    name: 'Game 2',
    year: 2022,
    editor: 'Editor 2',
    type: ['Type B', 'Type C'],
    language: 'es',
    complexity: 3,
    isPlayed: false,
    players: [27],
  };
  const game3: GameCard = {
    name: 'Another thing',
    year: 2023,
    editor: 'Editor 1',
    type: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    players: [2],
  };
  const game4: GameCard = {
    name: 'Another thing 2 ',
    year: 2023,
    editor: 'Editor 1',
    type: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    players: [2],
  };
  const game5: GameCard = {
    name: 'Another thing 3',
    year: 2023,
    editor: 'Editor 1',
    type: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    players: [2],
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

  it('selectSorting should sort by name in descending order', () => {
    service.selectSorting({ value: 'Z to A' } as any, games);
    expect(games).toEqual([game2, game1, game5, game4, game3]);
  });

  it('sortByYearAscending should sort by year in ascending order', () => {
    const sortedGames = service.sortByYearAscending([
      game2,
      game1,
      game4,
      game3,
      game5,
    ]);
    expect(sortedGames).toEqual([game1, game2, game4, game3, game5]);
  });

  it('sortByYearDescending should sort by year in descending order', () => {
    const sortedGames = service.sortByYearDescending(games);
    expect(sortedGames).toEqual([game5, game4, game3, game2, game1]);
  });
});
