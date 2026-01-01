import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorSettingsComponent } from './color-settings.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ColorSettingsComponent', () => {
  let component: ColorSettingsComponent;
  let fixture: ComponentFixture<ColorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ColorSettingsComponent,
        FormsModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
