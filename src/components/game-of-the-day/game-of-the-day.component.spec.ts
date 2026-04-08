import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { GameOfTheDayComponent } from './game-of-the-day.component';
import { GameCard } from '../commons.models';
import { HttpService } from '../../core/services/http/http.service';
import { of } from 'rxjs';

const game1: GameCard = {
  name: 'Game 1',
  editor: 'Editor 1',
  year: 2021,
  types: ['Party'],
  language: 'en',
  players: [4],
  time: 15,
  complexity: 2,
  rate: 7,
  image: 'image',
  isPlayed: true,
  age: 8,
  bggReference: 12345,
  size: 's',
};

const game2: GameCard = {
  name: 'Game 2',
  editor: 'Editor 2',
  year: 2022,
  types: ['Strategy', 'Family'],
  language: 'es',
  players: [2, 4],
  time: 60,
  complexity: 3,
  rate: 8,
  image: 'image2',
  isPlayed: false,
  age: 10,
  bggReference: 67890,
  size: 'm',
};

const game3: GameCard = {
  name: 'Game 3',
  editor: 'Editor 1',
  year: 2023,
  types: ['Party', 'Family'],
  language: 'en',
  players: [3, 6],
  time: 30,
  complexity: 1,
  rate: 6,
  image: 'image3',
  isPlayed: false,
  age: 6,
  bggReference: 11111,
  size: 's',
};

describe('GameOfTheDayComponent', () => {
  let component: GameOfTheDayComponent;
  let fixture: ComponentFixture<GameOfTheDayComponent>;
  let dialogRefSpy: jest.Mocked<MatDialogRef<GameOfTheDayComponent>>;

  beforeEach(async () => {
    dialogRefSpy = { close: jest.fn() } as any;

    const httpServiceMock = {
      gamesImageBase: 'https://example.com/images',
      getGames: jest.fn().mockReturnValue(of({ games: [game1, game2, game3] })),
    };

    await TestBed.configureTestingModule({
      imports: [GameOfTheDayComponent, BrowserAnimationsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameOfTheDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load types from games on init', () => {
    expect(component.types).toEqual(['Family', 'Party', 'Strategy']);
  });

  it('should load games list on init', () => {
    expect(component.gamesList.length).toBe(3);
  });

  it('should select a random game matching the selected type', () => {
    component.selectedType = 'Party';
    component.showGame();
    const game = component.selectedGame();
    expect(game).not.toBeNull();
    expect(game!.types).toContain('Party');
  });

  it('should not set a game when no games match the type', () => {
    component.selectedType = 'NonExistentType';
    component.showGame();
    expect(component.selectedGame()).toBeNull();
  });

  it('should select from Strategy type correctly', () => {
    component.selectedType = 'Strategy';
    component.showGame();
    const game = component.selectedGame();
    expect(game).not.toBeNull();
    expect(game!.name).toBe('Game 2');
  });

  it('should close the dialog', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  describe('player count filter', () => {
    it('should have player options defined', () => {
      expect(component.playerOptions).toEqual([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9+',
      ]);
    });

    it('should filter by exact player count within range', () => {
      // game2 supports 2-4 players, game3 supports 3-6 players
      component.selectedType = 'Family';
      component.selectedPlayers = '3';
      component.showGame();
      const game = component.selectedGame();
      expect(game).not.toBeNull();
      expect(['Game 2', 'Game 3']).toContain(game!.name);
    });

    it('should filter by single player count (exact match)', () => {
      // game1 supports exactly 4 players
      component.selectedType = 'Party';
      component.selectedPlayers = '4';
      component.showGame();
      const game = component.selectedGame();
      expect(game).not.toBeNull();
      // game1 (4 players) and game3 (3-6 players) both match Party + 4 players
      expect(['Game 1', 'Game 3']).toContain(game!.name);
    });

    it('should return no game when player count does not match any game', () => {
      // game2 (Strategy) supports 2-4 players, so 8 should not match
      component.selectedType = 'Strategy';
      component.selectedPlayers = '8';
      component.showGame();
      expect(component.selectedGame()).toBeNull();
    });

    it('should handle 9+ player filter', () => {
      // No games in test data support 9+ players
      component.selectedType = 'Party';
      component.selectedPlayers = '9+';
      component.showGame();
      expect(component.selectedGame()).toBeNull();
    });

    it('should ignore player filter when not selected', () => {
      component.selectedType = 'Party';
      component.selectedPlayers = '';
      component.showGame();
      const game = component.selectedGame();
      expect(game).not.toBeNull();
      expect(game!.types).toContain('Party');
    });

    it('should filter by player count only (no type selected)', () => {
      component.selectedType = '';
      component.selectedPlayers = '4';
      component.showGame();
      const game = component.selectedGame();
      expect(game).not.toBeNull();
      // game1 (4), game2 (2-4), game3 (3-6) all support 4 players
      expect(['Game 1', 'Game 2', 'Game 3']).toContain(game!.name);
    });

    it('should pick from all games when only player count is set', () => {
      component.selectedType = '';
      component.selectedPlayers = '2';
      component.showGame();
      const game = component.selectedGame();
      expect(game).not.toBeNull();
      // only game2 (2-4) supports 2 players
      expect(game!.name).toBe('Game 2');
    });
  });
});
