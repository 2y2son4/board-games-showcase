import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderService],
    });

    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading to true when show is called', fakeAsync(() => {
    let loadingValue = false;

    // Call show before subscribing
    service.show();
    tick(); // Simulate the passage of time

    service.loading$.subscribe((loading) => {
      loadingValue = loading;
    });

    tick(); // Simulate the passage of time to ensure the subscription gets the updated value

    expect(loadingValue).toBeTruthy();
  }));

  it('should set loading to false when hide is called', fakeAsync(() => {
    let loadingValue = true;

    // Call hide before subscribing
    service.hide();
    tick(); // Simulate the passage of time

    service.loading$.subscribe((loading) => {
      loadingValue = loading;
    });

    tick(); // Simulate the passage of time to ensure the subscription gets the updated value

    expect(loadingValue).toBeFalsy();
  }));
});
