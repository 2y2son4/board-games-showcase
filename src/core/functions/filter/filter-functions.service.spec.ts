import { TestBed } from '@angular/core/testing';

import { FilterFunctionsService } from './filter-functions.service';
import { GameCard } from '../../../components/games/games.component.model';

describe('GameCardSortingService', () => {
  let service: FilterFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sortByNameAscending', () => {
    it('should sort game cards by name in ascending order', () => {
      const testData: GameCard[] = [
        {
          name: 'C',
          year: 2000,
          time: 100,
          editor: '',
          type: [''],
          language: 'es',
          complexity: 1.0,
        },
        {
          name: 'A',
          year: 1990,
          time: 50,
          editor: '',
          type: [''],
          language: 'es',
          complexity: 1.0,
        },
        {
          name: 'B',
          year: 1985,
          time: 75,
          editor: '',
          type: [''],
          language: 'es',
          complexity: 1.0,
        },
      ];
      const sortedData = service.sortByNameAscending(testData);
      expect(sortedData[0].name).toBe('A');
      expect(sortedData[1].name).toBe('B');
      expect(sortedData[2].name).toBe('C');
    });
  });
});
