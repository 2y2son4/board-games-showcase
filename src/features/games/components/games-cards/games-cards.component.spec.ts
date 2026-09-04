import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

  it('should apply the played-card highlight state', () => {
    const frontCard = fixture.nativeElement.querySelector(
      '.games-card__list-front',
    );
    const ratingBadge =
      fixture.nativeElement.querySelector('.games-card__rate');

    expect(frontCard.classList.contains('border-purple')).toBe(true);
    expect(ratingBadge.classList.contains('border-purple')).toBe(true);
  });
});
