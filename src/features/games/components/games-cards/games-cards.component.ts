import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule, MatChipListboxChange } from '@angular/material/chips';

import { CommonFunctionsService } from '../../../../core/functions/common/common-functions.service';
import { HighlightTextPipe } from '../../../../shared/pipes/highlight-text/highlight-text.pipe';
import { GameCard } from '../../models';

@Component({
  selector: 'app-games-cards',
  imports: [
    CommonModule,
    HighlightTextPipe,
    MatCardModule,
    MatChipsModule,
    NgOptimizedImage,
  ],
  templateUrl: './games-cards.component.html',
  styleUrl: './games-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesCardsComponent {
  readonly commonFunctions = inject(CommonFunctionsService);
  private readonly destroyRef = inject(DestroyRef);

  private intersectionObserver?: IntersectionObserver;
  private loadMoreRequestedForBatch = false;

  games = input<GameCard[]>([]);
  selectedGames = input<GameCard[]>([]);
  selectedChipTypes = input<string[]>([]);
  selectedSize = input<string>('');
  searchQuery = input<string>('');
  gamesImageBase = input<string>('');
  hasMore = input(false);
  isLoadingMore = input(false);

  loadMoreTrigger = viewChild<ElementRef<HTMLDivElement>>('loadMoreTrigger');

  cardToggled = output<GameCard>();
  chipTypesChanged = output<string[]>();
  sizeChanged = output<string>();
  loadMoreRequested = output<void>();

  constructor() {
    effect(() => {
      this.games();
      this.hasMore();
      this.loadMoreRequestedForBatch = false;
    });

    effect(() => {
      const trigger = this.loadMoreTrigger();
      const hasMore = this.hasMore();

      this.intersectionObserver?.disconnect();

      if (!trigger || !hasMore) {
        return;
      }

      this.intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || this.loadMoreRequestedForBatch) {
            return;
          }

          this.loadMoreRequestedForBatch = true;
          this.loadMoreRequested.emit();
        },
        {
          rootMargin: '300px 0px',
        },
      );

      this.intersectionObserver.observe(trigger.nativeElement);
    });

    this.destroyRef.onDestroy(() => {
      this.intersectionObserver?.disconnect();
    });
  }

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

  formatDuration(minutes: number): string {
    if (minutes < 59) {
      return `${minutes} min`;
    }

    const hours = minutes / 60;
    return hours === 1 ? '1 h' : `${hours} h`;
  }
}
