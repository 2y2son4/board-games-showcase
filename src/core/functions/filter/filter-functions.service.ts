import { Injectable } from '@angular/core';
import { GameCard } from '../../../components/games/games.component.model';

@Injectable({
  providedIn: 'root',
})
export class FilterFunctionsService {
  constructor() {}

  sortByNameAscending(data: Array<GameCard>) {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }

  sortByNameDescending(data: Array<GameCard>) {
    return data.sort((a, b) => b.name.localeCompare(a.name));
  }

  sortByYearAscending(data: Array<GameCard>) {
    return data.sort((a, b) => this.compareYears(a.year, b.year));
  }

  sortByYearDescending(data: Array<GameCard>) {
    return data.sort((a, b) => this.compareYears(b.year, a.year));
  }

  sortByTimeAscending(data: Array<GameCard>) {
    return data.sort((a, b) => this.compareTimes(a.time, b.time));
  }

  sortByTimeDescending(data: Array<GameCard>) {
    return data.sort((a, b) => this.compareTimes(b.time, a.time));
  }

  sortByComplexityAscending(data: Array<GameCard>) {
    return data.sort((a, b) =>
      this.compareComplexity(a.complexity, b.complexity),
    );
  }

  sortByComplexityDescending(data: Array<GameCard>) {
    return data.sort((a, b) =>
      this.compareComplexity(b.complexity, a.complexity),
    );
  }

  private compareYears(
    yearA: number | undefined,
    yearB: number | undefined,
  ): number {
    if (!yearA && !yearB) return 0;
    if (!yearA) return 1;
    if (!yearB) return -1;
    return yearA - yearB;
  }

  private compareTimes(
    timeA: number | undefined,
    timeB: number | undefined,
  ): number {
    if (!timeA && !timeB) return 0;
    if (!timeA) return 1;
    if (!timeB) return -1;
    return timeA - timeB;
  }

  private compareComplexity(
    complexityA: number | undefined,
    complexityB: number | undefined,
  ): number {
    if (!complexityA && !complexityB) return 0;
    if (!complexityA) return 1;
    if (!complexityB) return -1;
    return complexityA - complexityB;
  }
}
