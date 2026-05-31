import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollToTopBtnComponent } from './scroll-to-top-btn.component';

describe('ScrollToTopBtnComponent', () => {
  let component: ScrollToTopBtnComponent;
  let fixture: ComponentFixture<ScrollToTopBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollToTopBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScrollToTopBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
