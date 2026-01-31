import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { HttpService } from '../../core/services/http/http.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { OracleCard } from '../commons.models';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader/loader.service';
import { ExportService } from '../../core/services/export/export.service';

@Component({
  selector: 'app-oracles',
  imports: [
    CommonModule,
    LoaderComponent,
    MatButtonModule,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './oracles.component.html',
  styleUrl: '../common-styles.scss',
})
export class OraclesComponent implements OnInit, AfterViewInit {
  innerElements = viewChildren<ElementRef>('innerElement');

  oraclesList: OracleCard[] = [];

  printOracles = signal<OracleCard[]>([]);

  constructor(
    public commonFunctions: CommonFunctionsService,
    public filterFunctions: FilterFunctionsService,
    private readonly httpDataService: HttpService,
    private readonly loaderService: LoaderService,
    private readonly exportService: ExportService,
  ) {}

  ngOnInit(): void {
    this.loaderService.show();
    this.httpDataService.getOracles().subscribe({
      next: (response) => {
        this.oraclesList = this.filterFunctions.sortByNameAscending(
          response.oracles,
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
