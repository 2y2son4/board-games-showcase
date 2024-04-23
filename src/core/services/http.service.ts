import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GameCard, OracleCard } from '../../components/commons.models';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGamesData(): Observable<{ games: GameCard[] }> {
    return this.http.get<{ games: GameCard[] }>('src/assets/data/games.json');
  }

  getOraclesData(): Observable<{ oracles: OracleCard[] }> {
    return this.http.get<{ oracles: OracleCard[] }>(
      'src/assets/data/oracles.json',
    );
  }
}
