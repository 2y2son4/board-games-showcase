import { ElementRef, Injectable, QueryList } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FilterFunctionsService {
  constructor() {}

  sortByNameAscending(data: Array<any>) {
    return data.sort((a, b) => a.name.localeCompare(b.name));
  }

  getFlipCardCount(innerElements: QueryList<ElementRef>): number {
    return innerElements
      ? innerElements.filter((innerElement) =>
          innerElement.nativeElement.classList.contains('active'),
        ).length
      : 0;
  }

  flipAllCards(innerElements: QueryList<ElementRef>) {
    if (innerElements) {
      innerElements.forEach((innerElement) => {
        innerElement.nativeElement.classList.remove('active');
      });
    }
  }
}
