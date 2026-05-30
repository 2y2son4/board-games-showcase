import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { GamesFilterForm } from '../games/games-filter-form.model';

@Component({
  selector: 'app-games-filters',
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './games-filters.component.html',
  styleUrls: [
    './games-filters.component.scss',
    '../../../../shared/styles/common-styles.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesFiltersComponent {
  filterForm = input.required<GamesFilterForm>();
  sortingSelectLabels = input<string[]>([]);
  types = input<string[]>([]);
  editors = input<string[]>([]);
  sizes = input<string[]>([]);
  showPlayedBtn = input(true);
  showUnplayedBtn = input(true);

  playedToggled = output<void>();
  unplayedToggled = output<void>();
  resetClicked = output<void>();
  typeSearchChanged = output<string>();
  editorSearchChanged = output<string>();

  clearSearch(): void {
    this.filterForm().controls.searchQuery.setValue('');
  }

  onTypeSearch(target: EventTarget | null): void {
    const value = target instanceof HTMLInputElement ? target.value : '';
    this.typeSearchChanged.emit(value);
  }

  onEditorSearch(target: EventTarget | null): void {
    const value = target instanceof HTMLInputElement ? target.value : '';
    this.editorSearchChanged.emit(value);
  }
}
