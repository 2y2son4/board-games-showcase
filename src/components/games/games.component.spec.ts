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
    component.filteredGames.set([...component.gamesList]);
    component.searchQuery = 'game';
    component.selectedChipTypes.set([]);

    component.filterGames();

    expect(component.filteredGames().length).toBe(2);
    expect(component.filteredGames()[0].name).toBe('Game 1');
    expect(component.filteredGames()[1].name).toBe('Game 2');
  });

  it('should filter games by exact number of players properly', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.exactPlayers = 2;
    component.filterGamesByExactPlayers();

    expect(component.filteredGames().length).toBe(1);
    expect(component.filteredGames()[0].name).toBe('Another thing');
  });

  it('should reset all filters properly', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedEditors.setValue(['Editor 1']);
    component.selectedSorting.setValue('Year ↑');
    component.selectedTypes.setValue(['Type A']);
    component.searchQuery = 'Game';
    component.exactPlayers = 4;
    component.playedGames.set(true);
    component.unPlayedGames.set(true);
    component.selectedChipTypes.set([]);
    component.filteredGames.set([game1]);
    component.restartFilters();

    expect(component.selectedSorting.value).toBeFalsy();
    expect(component.selectedEditors.value).toEqual([]);
    expect(component.selectedTypes.value).toEqual([]);
    expect(component.searchQuery).toBeFalsy();
    expect(component.exactPlayers).toBe(undefined);
    expect(component.playedGames()).toBe(false);
    expect(component.unPlayedGames()).toBe(false);
    expect(component.filteredGames().length).toBe(component.gamesList.length);
  });

  it('should filter by playedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.togglePlayed();

    expect(component.filteredGames().every((g: GameCard) => g.isPlayed)).toBe(
      true,
    );
  });

  it('should filter by unPlayedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.toggleUnPlayed();

    expect(component.filteredGames().every((g: GameCard) => !g.isPlayed)).toBe(
      true,
    );
  });

  it('should filter by editor', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.selectedEditors.setValue(['Editor 1']);
    component.applyAllFilters();

    expect(
      component.filteredGames().every((g: GameCard) => g.editor === 'Editor 1'),
    ).toBe(true);
  });

  it('should filter by type', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.selectedTypes.setValue(['Type A']);
    component.applyAllFilters();

    expect(
      component
        .filteredGames()
        .every((g: GameCard) => g.types.includes('Type A')),
    ).toBe(true);
  });

  it('should sort games by year', () => {
    component.gamesList = [game2, game3, game1];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.selectedSorting.setValue('Year ↑');
    component.applyAllFilters();

    expect(component.filteredGames()[0].year).toBe(2021);
    expect(component.filteredGames()[2].year).toBe(2023);
  });

  it('should sort games by name', () => {
    component.gamesList = [game2, game1, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.selectedSorting.setValue('A to Z');
    component.applyAllFilters();

    expect(component.filteredGames()[0].name).toBe('Another thing');
    expect(component.filteredGames()[2].name).toBe('Game 2');
  });

  it('should show "Select all" button when a filter is active and results > 1', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.searchQuery = 'game';
    component.applyAllFilters();

    expect(component.showSelectAllBtn()).toBe(true);
  });

  it('should not show "Select all" button when no filter is active', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.applyAllFilters();

    expect(component.showSelectAllBtn()).toBe(false);
  });

  it('should not show "Select all" button when filter yields only one result', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.searchQuery = 'Game 1';
    component.applyAllFilters();

    expect(component.showSelectAllBtn()).toBe(false);
  });

  it('should hide "Select all" button after reset', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([...component.gamesList]);
    component.selectedChipTypes.set([]);
    component.searchQuery = 'game';
    component.applyAllFilters();
    expect(component.showSelectAllBtn()).toBe(true);

    component.restartFilters();
    expect(component.showSelectAllBtn()).toBe(false);
  });

  it('should select all filtered games when selectAllFiltered is called', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([game1, game2]);
    component.printGames.set([]);

    component.selectAllFiltered();

    expect(component.printGames().length).toBe(2);
    expect(component.printGames()).toEqual([game1, game2]);
  });

  it('should not add duplicates when selectAllFiltered is called with already-selected games', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames.set([game1, game2]);
    component.printGames.set([game1]);

    component.selectAllFiltered();

    expect(component.printGames().length).toBe(2);
    expect(component.printGames().filter((g) => g.name === game1.name).length).toBe(1);
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
      component.filteredGames.set([...component.gamesList]);
      component.selectedChipTypes.set([]);

      // Apply "4 players" filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();

      // Should have 2 games (both with 4 players)
      expect(component.filteredGames().length).toBe(2);

      // Then apply "Played" filter
      component.togglePlayed();

      // Should have only 1 game (4 players AND played)
      expect(component.filteredGames().length).toBe(1);
      expect(component.filteredGames()[0].players).toContain(4);
      expect(component.filteredGames()[0].isPlayed).toBe(true);
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
      component.filteredGames.set([...component.gamesList]);
      component.selectedChipTypes.set([]);

      // Apply "4 players" filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();

      // Should have 2 games (both with 4 players)
      expect(component.filteredGames().length).toBe(2);

      // Then apply "Unplayed" filter
      component.toggleUnPlayed();

      // Should have only 1 game (4 players AND unplayed)
      expect(component.filteredGames().length).toBe(1);
      expect(component.filteredGames()[0].players).toContain(4);
      expect(component.filteredGames()[0].isPlayed).toBe(false);
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
      component.filteredGames.set([...component.gamesList]);
      component.selectedChipTypes.set([]);

      // Apply players filter
      component.exactPlayers = 4;
      component.filterGamesByExactPlayers();
      expect(component.filteredGames().length).toBe(3); // All have 4 players

      // Apply age filter
      component.exactAge = 12;
      component.filterGamesByAge();
      expect(component.filteredGames().length).toBe(2); // gameNoAge excluded

      // Apply unplayed filter
      component.toggleUnPlayed();
      expect(component.filteredGames().length).toBe(1); // gamePlayed excluded
      expect(component.filteredGames()[0].name).toBe('Matches All');

      // Apply sorting
      component.selectedSorting.setValue('Year ↑');
      component.applyAllFilters();

      // Should still have the same 1 game, just sorted
      expect(component.filteredGames().length).toBe(1);
      expect(component.filteredGames()[0].name).toBe('Matches All');
    });

    it('should keep filters active when sorting is changed', () => {
      component.gamesList = [game1, game2, game3];
      component.filteredGames.set([...component.gamesList]);
      component.selectedChipTypes.set([]);

      // Apply type filter
      component.selectedTypes.setValue(['Type A']);
      component.applyAllFilters();

      const filteredCount = component.filteredGames().length;
      expect(filteredCount).toBeGreaterThan(0);
      expect(filteredCount).toBeLessThan(3);

      // Change sorting
      component.selectedSorting.setValue('Year ↑');
      component.applyAllFilters();

      // Should have the same number of games, not expanded to full list
      expect(component.filteredGames().length).toBe(filteredCount);
      expect(
        component
          .filteredGames()
          .every((g: GameCard) => g.types.includes('Type A')),
      ).toBe(true);
    });

    it('should apply search + type + publisher filters cumulatively', () => {
      component.gamesList = [game1, game2, game3];
      component.filteredGames.set([...component.gamesList]);
      component.selectedChipTypes.set([]);

      // Apply search filter
      component.searchQuery = 'Game';
      component.filterGames();
      expect(component.filteredGames().length).toBe(2); // game1, game2

      // Apply type filter
      component.selectedTypes.setValue(['Type A']);
      component.applyAllFilters();
      expect(component.filteredGames().length).toBe(1); // Only game1

      // Apply publisher filter
      component.selectedEditors.setValue(['Editor 1']);
      component.applyAllFilters();
      expect(component.filteredGames().length).toBe(1); // Still game1
      expect(component.filteredGames()[0].name).toBe('Game 1');
    });
  });
});
