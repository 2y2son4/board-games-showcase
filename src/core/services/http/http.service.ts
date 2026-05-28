import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { GameCard } from '../../../features/games/models';
import { OracleCard } from '../../../features/oracles/models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly apiBase = 'https://2y2son4.github.io/board-games-db';
  private readonly gamesDb = `${this.apiBase}/v1/games.json`;
  private readonly oraclesDb = `${this.apiBase}/v1/oracles.json`;
  private readonly bggUrl = 'https://boardgamegeek.com/xmlapi2/';
  private readonly proxyUrl = 'http://localhost:8080/';

  readonly gamesImageBase = `${this.apiBase}/images/games`;
  readonly oraclesImageBase = `${this.apiBase}/images/oracles`;
  private readonly http = inject(HttpClient);

  getGames(): Observable<{ games: GameCard[] }> {
    return this.http.get<{ games: GameCard[] }>(this.gamesDb).pipe(
      catchError((error) => {
        console.error('Error fetching games data:', error);
        return of({ games: [] });
      }),
    );
  }

  getOracles(): Observable<{ oracles: OracleCard[] }> {
    return this.http.get<{ oracles: OracleCard[] }>(this.oraclesDb).pipe(
      catchError((error) => {
        console.error('Error fetching oracles data:', error);
        return of({ oracles: [] });
      }),
    );
  }

  getBGG(): Observable<string> {
    return this.http.get(this.proxyUrl + this.bggUrl, { responseType: 'text' });
  }
}
