import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';

import { CommonFunctionsService } from '../../../../core/functions/common/common-functions.service';
import { HighlightTextPipe } from '../../../../shared/pipes/highlight-text/highlight-text.pipe';
import { GameCard } from '../../models';

@Component({
  selector: 'app-games-cards',
  imports: [CommonModule, HighlightTextPipe, MatCardModule, MatChipsModule],
  templateUrl: './games-cards.component.html',
  styleUrl: './games-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesCardsComponent {
  readonly commonFunctions = inject(CommonFunctionsService);

  games = input<GameCard[]>([]);
  selectedGames = input<GameCard[]>([]);
  selectedChipTypes = input<string[]>([]);
  selectedSize = input<string>('');
  searchQuery = input<string>('');
  gamesImageBase = input<string>('');

  cardToggled = output<GameCard>();
  chipTypesChanged = output<string[]>();
  sizeChanged = output<string>();

  isSelected(game: GameCard): boolean {
    return this.selectedGames().some((selected) => selected.name === game.name);
  }

  onTypeSelectionChange(event: MatChipListboxChange): void {
    this.chipTypesChanged.emit((event.value as string[]) ?? []);
  }

  onSizeSelectionChange(event: MatChipListboxChange): void {
    const value = event.value;
    if (Array.isArray(value)) {
      this.sizeChanged.emit((value[0] as string | undefined) ?? '');
      return;
    }

    this.sizeChanged.emit((value as string | null) ?? '');
  }
}
