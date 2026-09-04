import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesCardsComponent } from './games-cards.component';
import { GameCard } from '../../models';

const playedGame: GameCard = {
  name: 'Played Game',
  editor: 'Editor 1',
  year: 2021,
  types: ['Strategy'],
  language: 'en',
  players: [2, 4],
  time: 60,
  complexity: 2,
  rate: 8,
  image: 'played-game',
  isPlayed: true,
  age: 10,
  bggReference: 123,
  size: 'm',
};

describe('GamesCardsComponent', () => {
  let component: GamesCardsComponent;
  let fixture: ComponentFixture<GamesCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesCardsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamesCardsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('games', [playedGame]);
    fixture.componentRef.setInput('gamesImageBase', 'assets/games');
    fixture.detectChanges();
  });

  it('should apply the played-card highlight border color', () => {
    const frontCard = fixture.nativeElement.querySelector('.games-card__list-front');
    const ratingBadge = fixture.nativeElement.querySelector('.games-card__rate');

    expect(frontCard.classList.contains('border-pink')).toBe(true);
    expect(ratingBadge.classList.contains('border-pink')).toBe(true);
    expect(getComputedStyle(frontCard).borderColor).toBe('rgb(103, 58, 183)');
    expect(getComputedStyle(ratingBadge).borderColor).toBe('rgb(103, 58, 183)');
  });
});
