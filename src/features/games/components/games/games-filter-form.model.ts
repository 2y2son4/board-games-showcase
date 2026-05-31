import { FormControl, FormGroup } from '@angular/forms';

export type GamesFilterForm = FormGroup<{
  searchQuery: FormControl<string>;
  selectedSorting: FormControl<string | null>;
  exactPlayers: FormControl<number | null>;
  exactAge: FormControl<number | null>;
  selectedTypes: FormControl<string[] | null>;
  selectedEditors: FormControl<string[] | null>;
  selectedSize: FormControl<string | null>;
}>;
