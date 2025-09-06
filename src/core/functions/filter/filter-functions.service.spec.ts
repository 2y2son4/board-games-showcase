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
    age: 2,
    rate: 1,
    players: [4],
    time: 15,
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
    age: 2,
    rate: 1,
    players: [27],
    time: 15,
    image: 'image',
    bggReference: 0,
    size: 's',
  };
  const game3: GameCard = {
    name: 'Another thing',
    year: 2023,
    editor: 'Editor 1',
    types: ['Type A', 'Type D'],
    language: 'en',
    complexity: 1,
    isPlayed: false,
    age: 2,
    rate: 1,
    players: [2],
    time: 15,
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
    age: 2,
    rate: 1,
    players: [2],
    time: 15,
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
    age: 2,
    rate: 1,
    players: [2],
    time: 15,
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
});
