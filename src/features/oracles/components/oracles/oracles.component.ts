import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  viewChildren,
  inject,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { CommonFunctionsService } from '../../../../core/functions/common/common-functions.service';
import { FilterFunctionsService } from '../../../../core/functions/filter/filter-functions.service';
import { HttpService } from '../../../../core/services/http/http.service';
import { ScrollToTopBtnComponent } from '../../../../shared/components/scroll-to-top-btn/scroll-to-top-btn.component';
import { OracleCard } from '../../models';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { LoaderService } from '../../../../core/services/loader/loader.service';
import { ExportService } from '../../../../core/services/export/export.service';

@Component({
  selector: 'app-oracles',
  imports: [
    CommonModule,
    LoaderComponent,
    MatButtonModule,
    NgOptimizedImage,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './oracles.component.html',
  styleUrl: '../../../../shared/styles/common-styles.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OraclesComponent implements OnInit, AfterViewInit {
  commonFunctions = inject(CommonFunctionsService);
  filterFunctions = inject(FilterFunctionsService);
  private readonly httpDataService = inject(HttpService);
  private readonly loaderService = inject(LoaderService);
  private readonly exportService = inject(ExportService);

  innerElements = viewChildren<ElementRef>('innerElement');

  oraclesList = signal<OracleCard[]>([]);

  printOracles = signal<OracleCard[]>([]);
  readonly oraclesImageBase: string;

  constructor() {
    this.oraclesImageBase = this.httpDataService.oraclesImageBase;
  }

  ngOnInit(): void {
    this.loaderService.show();
    this.httpDataService.getOracles().subscribe({
      next: (response) => {
        this.oraclesList.set(
          this.filterFunctions.sortByNameAscending(response.oracles),
        );
        this.loaderService.hide();
      },
      error: (error) => {
        console.error('Error fetching oracles data', error);
        this.loaderService.hide();
      },
    });
  }

  ngAfterViewInit() {
    this.filterFunctions.getFlipCardCount(this.innerElements());
  }

  toggleCardFlip(oracle: OracleCard, index: number) {
    const targetElement = this.innerElements()[index];
    if (!targetElement) return;

    const isCurrentlySelected =
      targetElement.nativeElement.classList.contains('active');
    targetElement.nativeElement.classList.toggle('active');

    if (isCurrentlySelected) {
      // Unselect
      this.printOracles.set(
        this.printOracles().filter((o) => o.name !== oracle.name),
      );
    } else {
      // Select (avoid duplicates)
      if (!this.printOracles().some((o) => o.name === oracle.name)) {
        this.printOracles.set([...this.printOracles(), oracle]);
      }
    }
  }

  async exportSelectedAsPdf(): Promise<void> {
    await this.exportService.exportSelectedOraclesAsPdf(
      this.printOracles(),
      'selected-oracles',
    );
  }
}
