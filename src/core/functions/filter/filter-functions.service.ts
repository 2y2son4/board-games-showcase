import { Injectable } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';

import { GameCard } from '../../../components/games/games.component.model';

@Injectable({
  providedIn: 'root',
})
export class FilterFunctionsService {
  constructor() {}

  sortByNameAscending(data: Array<GameCard>) {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }

  selectSorting(change: MatSelectChange, filteredGames: GameCard[]) {
    const sortFunctions: {
      [key: string]: (a: GameCard, b: GameCard) => number;
    } = {
      'A to Z': (a, b) => a.name.localeCompare(b.name),
      'Z to A': (a, b) => b.name.localeCompare(a.name),
      'Year ↑': (a, b) => a.year - b.year,
      'Year ↓': (a, b) => b.year - a.year,
      'Time ↑': (a, b) => a.time! - b.time!,
      'Time ↓': (a, b) => b.time! - a.time!,
      'Complexity ↑': (a, b) => a.complexity - b.complexity,
      'Complexity ↓': (a, b) => b.complexity - a.complexity,
      'Rate ↑': (a, b) => a.rate - b.rate,
      'Rate ↓': (a, b) => b.rate - a.rate,
    };

    const sortFunction = sortFunctions[change.value];
    if (sortFunction) {
      filteredGames.sort(sortFunction);
    }
  }
}
