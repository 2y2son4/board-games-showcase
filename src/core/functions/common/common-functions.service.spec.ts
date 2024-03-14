import { TestBed } from '@angular/core/testing';

import { CommonFunctionsService } from './common-functions.service';

describe('CommonFunctionsService', () => {
  let service: CommonFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonFunctionsService],
    });
    service = TestBed.inject(CommonFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getColor function', () => {
    it('should return the correct color for number 1', () => {
      const color = service.getColor(1);
      expect(color).toEqual('#36ae7c');
    });

    it('should return the correct color for number 2', () => {
      const color = service.getColor(2);
      expect(color).toEqual('#98c450');
    });

    it('should return the correct color for a non-integer input (e.g., 2.42)', () => {
      const color = service.getColor(2.42);
      expect(color).toEqual('#c0cd3d');
    });

    it('should return the correct color for number 3', () => {
      const color = service.getColor(3);
      expect(color).toEqual('#f9d923');
    });

    it('should return the correct color for number 4', () => {
      const color = service.getColor(4);
      expect(color).toEqual('#f2963b');
    });

    it('should return the correct color for number 5', () => {
      const color = service.getColor(5);
      expect(color).toEqual('#eb5353');
    });
  });
});
