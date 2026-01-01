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
    component.searchQuery = 'game';

    component.filterGames();

    expect(component.filteredGames.length).toBe(2);
    expect(component.filteredGames[0].name).toBe('Game 1');
    expect(component.filteredGames[1].name).toBe('Game 2');
  });

  it('should filter games by exact number of players properly', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
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
    component.filteredGames = [game1];
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

  it('should filter by playedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.togglePlayed();

    expect(component.filteredGames.every((g) => g.isPlayed)).toBe(true);
  });

  it('should filter by unPlayedGames', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.toggleUnPlayed();

    expect(component.filteredGames.every((g) => !g.isPlayed)).toBe(true);
  });

  it('should filter by editor', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedEditors.setValue(['Editor 1']);
    component.filterGamesByTypeAndEditor();

    expect(component.filteredGames.every((g) => g.editor === 'Editor 1')).toBe(
      true,
    );
  });

  it('should filter by type', () => {
    component.gamesList = [game1, game2, game3];
    component.filteredGames = [...component.gamesList];
    component.selectedTypes.setValue(['Type A']);
    component.filterGamesByTypeAndEditor();

    expect(
      component.filteredGames.every((g) => g.types.includes('Type A')),
    ).toBe(true);
  });

  it('should sort games by year', () => {
    component.gamesList = [game2, game3, game1];
    component.filteredGames = [...component.gamesList];
    component.selectSorting(
      { value: 'Year ↑' } as any,
      component.filteredGames,
    );

    expect(component.filteredGames[0].year).toBe(2021);
    expect(component.filteredGames[2].year).toBe(2023);
  });

  it('should sort games by name', () => {
    component.gamesList = [game2, game1, game3];
    component.filteredGames = [...component.gamesList];
    component.selectSorting(
      { value: 'A to Z' } as any,
      component.filteredGames,
    );

    expect(component.filteredGames[0].name).toBe('Another thing');
    expect(component.filteredGames[2].name).toBe('Game 2');
  });
});
