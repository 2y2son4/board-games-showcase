import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { HttpService } from '../../core/services/http/http.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { OracleCard } from '../commons.models';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-oracles',
  standalone: true,
  imports: [
    CommonModule,
    HighlightTextPipe,
    HttpClientModule,
    LoaderComponent,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './oracles.component.html',
  styleUrl: '../common-styles.scss',
})
export class OraclesComponent implements OnInit, AfterViewInit {
  @ViewChildren('innerElement') innerElements!: QueryList<ElementRef>;

  oraclesList!: Array<OracleCard>;
  unPlayedGames = false;
  searchQuery = '';

  constructor(
    public commonFunctions: CommonFunctionsService,
    public filterFunctions: FilterFunctionsService,
    private httpDataService: HttpService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.oraclesList = [];
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
    this.filterFunctions.getFlipCardCount(this.innerElements);
  }

  toggleCardFlip(index: number) {
    const targetElement = this.innerElements.toArray()[index];
    if (targetElement) {
      targetElement.nativeElement.classList.toggle('active');
    }
  }
}
