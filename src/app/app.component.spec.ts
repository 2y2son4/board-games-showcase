import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call ngOnInit and set isGames to true', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.ngOnInit();
    expect(app.isGames).toBe(true);
    expect(app.isOracles).toBe(false);
    expect(app.isSearch).toBe(false);
  });

  it('should select games component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.selectComponent('games');
    expect(app.isGames).toBe(true);
    expect(app.isOracles).toBe(false);
    expect(app.isSearch).toBe(false);
  });

  it('should select oracles component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.selectComponent('oracles');
    expect(app.isGames).toBe(false);
    expect(app.isOracles).toBe(true);
    expect(app.isSearch).toBe(false);
  });

  it('should select search component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.selectComponent('search');
    expect(app.isGames).toBe(false);
    expect(app.isOracles).toBe(false);
    expect(app.isSearch).toBe(true);
  });

  it('should handle invalid component selection', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.isGames = false;
    app.isOracles = false;
    app.isSearch = false;
    app.selectComponent('invalid');
    // Should remain unchanged
    expect(app.isGames).toBe(false);
    expect(app.isOracles).toBe(false);
    expect(app.isSearch).toBe(false);
  });
});
