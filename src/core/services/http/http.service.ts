import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { GameCard } from '../../../features/games/models';
import { OracleCard } from '../../../features/oracles/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  readonly #apiBase = environment.api.base;
  readonly #gamesDb = `${this.#apiBase}/v1/games.json`;
  readonly #oraclesDb = `${this.#apiBase}/v1/oracles.json`;
  readonly #bggUrl = environment.api.bggPath;
  readonly #proxyUrl = environment.api.proxy;

  readonly gamesImageBase = `${this.#apiBase}/images/games`;
  readonly oraclesImageBase = `${this.#apiBase}/images/oracles`;
  readonly #http = inject(HttpClient);
  readonly #errorHandler = inject(ErrorHandler);

  getGames(): Observable<{ games: GameCard[] }> {
    return this.#http
      .get<{ games: GameCard[] }>(this.#gamesDb)
      .pipe(catchError(this.#handleCollectionError('games', { games: [] })));
  }

  getOracles(): Observable<{ oracles: OracleCard[] }> {
    return this.#http
      .get<{ oracles: OracleCard[] }>(this.#oraclesDb)
      .pipe(
        catchError(this.#handleCollectionError('oracles', { oracles: [] })),
      );
  }

  getBGG(): Observable<string> {
    return this.#http
      .get(this.#proxyUrl + this.#bggUrl, { responseType: 'text' })
      .pipe(catchError(this.#handleCollectionError('bgg', '')));
  }

  #handleCollectionError<T>(resource: string, fallback: T) {
    return (error: unknown): Observable<T> => {
      const normalizedError =
        error instanceof Error
          ? error
          : new Error(`Failed to fetch ${resource}`);
      this.#errorHandler.handleError(normalizedError);
      return of(fallback);
    };
  }
}
