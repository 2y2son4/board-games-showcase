import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamesComponent } from './games.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GameCard } from '../commons.models';
import { FormControl } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const game1: GameCard = {
  name: 'Game 1',
  editor: 'Editor 1',
  year: 2021,
  types: ['Type A'],
  language: 'en',
  players: [4],
  time: 15,
  complexity: 2,
  rate: 0,
  image: 'image',
  isPlayed: true,
  age: 1,
  bggReference: 0,
  size: 's',
};

const game2: GameCard = {
  name: 'Game 2',
  editor: 'Editor 2',
  year: 2022,
  types: ['Type B', 'Type C'],
  language: 'es',
  players: [27],
  time: 20,
  complexity: 3,
  rate: 0,
  image: 'image',
  isPlayed: false,
  age: 1,
  bggReference: 0,
  size: 's',
};

const game3: GameCard = {
  name: 'Another thing',
  editor: 'Editor 1',
  year: 2023,
  types: ['Type A', 'Type D'],
  language: 'en',
  players: [2],
  time: 15,
  complexity: 1,
  rate: 0,
  image: 'image',
  isPlayed: false,
  age: 1,
  bggReference: 0,
  size: 's',
};

describe('GamesComponent', () => {
  let component: GamesComponent;
  let fixture: ComponentFixture<GamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesComponent, BrowserAnimationsModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    fixture = TestBed.createComponent(GamesComponent);
    component = fixture.componentInstance;
    // Manually initialize form controls if not done in constructor
    if (!component.selectedEditors)
      component.selectedEditors = new FormControl([]);
    if (!component.selectedSorting)
      component.selectedSorting = new FormControl();
    if (!component.selectedTypes) component.selectedTypes = new FormControl([]);
    fixture.detectChanges();

    // JSDOM doesn't implement scrollIntoView; Angular sets @ViewChild after detectChanges
    if (component.topPage?.nativeElement) {
      component.topPage.nativeElement.scrollIntoView = jest.fn();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter games properly based on searchQuery', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.searchQuery = 'game';
    component.selectedChipTypes = [];

    component.filterGames();

    expect(component.filteredGames.length).toBe(2);
    expect(component.filteredGames[0].name).toBe('Game 1');
    expect(component.filteredGames[1].name).toBe('Game 2');
  });

  it('should filter games by exact number of players properly', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.exactPlayers = 2;
    component.filterGamesByExactPlayers();

    expect(component.filteredGames.length).toBe(1);
    expect(component.filteredGames[0].name).toBe('Another thing');
  });

  it('should reset all filters properly', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedEditors.setValue(['Editor 1']);
    component.selectedSorting.setValue('Year ↑');
    component.selectedTypes.setValue(['Type A']);
    component.searchQuery = 'Game';
    component.exactPlayers = 4;
    component.playedGames = true;
    component.unPlayedGames = true;
    component.selectedChipTypes = [];
    component.filteredGames = [game1];
    component.restartFilters();

    expect(component.selectedSorting.value).toBeFalsy();
    expect(component.selectedEditors.value).toEqual([]);
    expect(component.selectedTypes.value).toEqual([]);
    expect(component.searchQuery).toBeFalsy();
    expect(component.exactPlayers).toBe(undefined);
    expect(component.playedGames).toBe(false);
    expect(component.unPlayedGames).toBe(false);
    expect(component.filteredGames.length).toBe(component.gamesList.length);
  });

  it('should filter by playedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.togglePlayed();

    expect(component.filteredGames.every((g) => g.isPlayed)).toBe(true);
  });

  it('should filter by unPlayedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.toggleUnPlayed();

    expect(component.filteredGames.every((g) => !g.isPlayed)).toBe(true);
  });

  it('should filter by editor', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.selectedEditors.setValue(['Editor 1']);
    component.filterGamesByTypeAndEditor();

    expect(component.filteredGames.every((g) => g.editor === 'Editor 1')).toBe(
      true,
    );
  });

  it('should filter by type', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.selectedTypes.setValue(['Type A']);
    component.filterGamesByTypeAndEditor();

    expect(
      component.filteredGames.every((g) => g.types.includes('Type A')),
    ).toBe(true);
  });

  it('should sort games by year', () => {
    component.gamesList = [game2, game3, game1];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.selectedSorting.setValue('Year ↑');
    component.selectSorting({ value: 'Year ↑' } as any);

    expect(component.filteredGames[0].year).toBe(2021);
    expect(component.filteredGames[2].year).toBe(2023);
  });

  it('should sort games by name', () => {
    component.gamesList = [game2, game1, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedChipTypes = [];
    component.selectedSorting.setValue('A to Z');
    component.selectSorting({ value: 'A to Z' } as any);

    expect(component.filteredGames[0].name).toBe('Another thing');
    expect(component.filteredGames[2].name).toBe('Game 2');
  });

  // Cumulative filtering tests (regression tests for the reported bug)
  describe('Cumulative Filters', () => {
    it('should apply "4 players" filter and then "Played" cumulatively', () => {
      // Setup: Create games with different player counts and played status
      const game4Players = {
        ...game1,
        players: [4],
        isPlayed: true,
      };
      const game4PlayersUnplayed = {
        ...game2,
        players: [4],
        isPlayed: false,
      };
      const game2PlayersPlayed = {
        ...game3,
        players: [2],
        isPlayed: true,
      };

      component.gamesList = [
        game4Players,
        game4PlayersUnplayed,
        game2PlayersPlayed,
      ];
      component.filteredGames = [...component.gamesList];
      component.selectedChipTypes = [];

      // Apply "4 players" filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();

      // Should have 2 games (both with 4 players)
      expect(component.filteredGames.length).toBe(2);

      // Then apply "Played" filter
      component.togglePlayed();

      // Should have only 1 game (4 players AND played)
      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].players).toContain(4);
      expect(component.filteredGames[0].isPlayed).toBe(true);
    });

    it('should apply "4 players" filter and then "Unplayed" cumulatively', () => {
      const game4Players = {
        ...game1,
        players: [4],
        isPlayed: true,
      };
      const game4PlayersUnplayed = {
        ...game2,
        players: [4],
        isPlayed: false,
      };
      const game2PlayersUnplayed = {
        ...game3,
        players: [2],
        isPlayed: false,
      };

      component.gamesList = [
        game4Players,
        game4PlayersUnplayed,
        game2PlayersUnplayed,
      ];
      component.filteredGames = [...component.gamesList];
      component.selectedChipTypes = [];

      // Apply "4 players" filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();

      // Should have 2 games (both with 4 players)
      expect(component.filteredGames.length).toBe(2);

      // Then apply "Unplayed" filter
      component.toggleUnPlayed();

      // Should have only 1 game (4 players AND unplayed)
      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].players).toContain(4);
      expect(component.filteredGames[0].isPlayed).toBe(false);
    });

    it('should apply multiple filters cumulatively: players + age + unplayed + sorting', () => {
      const gameMatches = {
        ...game1,
        name: 'Matches All',
        players: [2, 4], // 4 is within range
        age: 10,
        isPlayed: false,
        year: 2020,
      };
      const gameNoAge = {
        ...game2,
        name: 'Wrong Age',
        players: [4],
        age: 15, // Too old
        isPlayed: false,
        year: 2019,
      };
      const gamePlayed = {
        ...game3,
        name: 'Is Played',
        players: [4],
        age: 10,
        isPlayed: true, // Played, not unplayed
        year: 2021,
      };

      component.gamesList = [gameMatches, gameNoAge, gamePlayed];
      component.filteredGames = [...component.gamesList];
      component.selectedChipTypes = [];

      // Apply players filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();
      expect(component.filteredGames.length).toBe(3); // All have 4 players

      // Apply age filter
      component.exactAge = 12;
      component.filterGamesByAge();
      expect(component.filteredGames.length).toBe(2); // gameNoAge excluded

      // Apply unplayed filter
      component.toggleUnPlayed();
      expect(component.filteredGames.length).toBe(1); // gamePlayed excluded
      expect(component.filteredGames[0].name).toBe('Matches All');

      // Apply sorting
      component.selectedSorting.setValue('Year ↑');
      component.applyAllFilters();

      // Should still have the same 1 game, just sorted
      expect(component.filteredGames.length).toBe(1);
      expect(component.filteredGames[0].name).toBe('Matches All');
    });

    it('should keep filters active when sorting is changed', () => {
      component.gamesList = [game1, game2, game3];
      component.filteredGames = [...component.gamesList];
      component.selectedChipTypes = [];

      // Apply type filter
      component.selectedTypes.setValue(['Type A']);
      component.filterGamesByTypeAndEditor();

      const filteredCount = component.filteredGames.length;
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThan(3);

      // Change sorting
      component.selectedSorting.setValue('Year ↑');
      component.selectSorting({ value: 'Year ↑' } as any);

      // Should have the same number of games, not expanded to full list
      expect(component.filteredGames.length).toBe(filteredCount);
      expect(
        component.filteredGames.every((g) => g.types.includes('Type A')),
      ).toBe(true);
    });

    it('should apply search + type + publisher filters cumulatively', () => {
      component.gamesList = [game1, game2, game3];
      component.filteredGames = [...component.gamesList];
      component.selectedChipTypes = [];

      // Apply search filter
      component.searchQuery = 'Game';
      component.filterGames();
      expect(component.filteredGames.length).toBe(2); // game1, game2

      // Apply type filter
      component.selectedTypes.setValue(['Type A']);
      component.filterGamesByTypeAndEditor();
      expect(component.filteredGames.length).toBe(1); // Only game1

      // Apply publisher filter
      component.selectedEditors.setValue(['Editor 1']);
      component.filterGamesByTypeAndEditor();
      expect(component.filteredGames.length).toBe(1); // Still game1
      expect(component.filteredGames[0].name).toBe('Game 1');
    });
  });
});
