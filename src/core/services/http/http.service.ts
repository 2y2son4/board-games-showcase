import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { GameCard, OracleCard } from '../../../components/commons.models';

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

  constructor(private readonly http: HttpClient) {}

  getGames(): Observable<{ games: GameCard[] }> {
    return this.http.get<{ games: GameCard[] }>(this.gamesDb).pipe(
      map((data) => {
        if (Array.isArray(data.games)) {
          return data;
        } else {
          return data.games;
        }
      }),
      catchError((error) => {
        console.error('Error fetching games data:', error);
        return of({ games: [] });
      }),
    );
  }

  getOracles(): Observable<{ oracles: OracleCard[] }> {
    return this.http.get<{ oracles: OracleCard[] }>(this.oraclesDb).pipe(
      map((data) => {
        if (Array.isArray(data.oracles)) {
          return data;
        } else {
          return data.oracles;
        }
      }),
      catchError((error) => {
        console.error('Error fetching oracles data:', error);
        return of({ oracles: [] });
      }),
    );
  }

  getBGG(): Observable<any> {
    return this.http.get(this.proxyUrl + this.bggUrl, { responseType: 'text' });
  }
}
