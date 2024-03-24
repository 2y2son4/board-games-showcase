import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesComponent } from './games.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameCard } from './games.component.model';

const game1: GameCard = {
  name: 'Game 1',
  year: 2021,
  editor: 'Editor 1',
  types: ['Type A'],
  language: 'en',
  complexity: 2,
  rate: 0,
  isPlayed: true,
  players: [4],
};

const game2: GameCard = {
  name: 'Game 2',
  year: 2022,
  editor: 'Editor 2',
  types: ['Type B', 'Type C'],
  language: 'es',
  complexity: 3,
  rate: 0,
  isPlayed: false,
  players: [27],
};

const game3: GameCard = {
  name: 'Another thing',
  year: 2023,
  editor: 'Editor 1',
  types: ['Type A', 'Type D'],
  language: 'en',
  complexity: 1,
  rate: 0,
  isPlayed: false,
  players: [2],
};

describe('GamesComponent', () => {
  let component: GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesComponent, BrowserAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter games properly based on searchQuery', () => {
    component.gamesList = [game1, game2, game3];
    component.searchQuery = 'game';

    component.filterGames();

    expect(component.filteredGames.length).toBe(2);
    expect(component.filteredGames[0].name).toBe('Game 1');
    expect(component.filteredGames[1].name).toBe('Game 2');
  });

  it('should filter games by exact number of players properly', () => {
    component.gamesList = [game1, game2, game3];
    component.exactPlayers = 2;
    component.filterGamesByExactPlayers();

    expect(component.filteredGames.length).toBe(1);
    expect(component.filteredGames[0].name).toBe('Another thing');
  });

  it('should reset all filters properly', () => {
    component.gamesList = [game1, game2, game3];
    component.selectedEditors.setValue(['Editor 1']);
    component.searchQuery = 'Game';
    component.restartFilters();

    expect(component.selectedSorting.value).toBeFalsy();
    expect(component.selectedEditors.value).toEqual([]);
    expect(component.selectedTypes.value).toEqual([]);
    expect(component.searchQuery).toBeFalsy();
    expect(component.exactPlayers).toBe(undefined);
    expect(component.playedGames).toBe(false);
    expect(component.unPlayedGames).toBe(false);
    expect(component.filteredGames).toEqual(component.gamesList);
  });
});
