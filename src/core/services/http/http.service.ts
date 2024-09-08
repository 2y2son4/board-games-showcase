import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { GameCard, OracleCard } from '../../../components/commons.models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private gamesDb = 'assets/data/games.json';
  private oraclesDb = 'assets/data/oracles.json';
  private bggUrl = 'https://boardgamegeek.com/xmlapi2/';
  private proxyUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) {}

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
    return this.http.get<{ oracles: OracleCard[] }>(this.oraclesDb);
  }

  getBGG(): Observable<any> {
    return this.http.get(this.proxyUrl + this.bggUrl, { responseType: 'text' });
  }
}
