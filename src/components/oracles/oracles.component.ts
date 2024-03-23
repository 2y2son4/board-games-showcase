import { Component, OnInit } from '@angular/core';
import ORACLES_JSON from '../../static/oracles.json';
import { CommonModule } from '@angular/common';
import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';

@Component({
  selector: 'app-oracles',
  standalone: true,
  imports: [CommonModule, HighlightTextPipe, ScrollToTopBtnComponent],
  templateUrl: './oracles.component.html',
  styleUrl: '../common-styles.scss',
})
export class OraclesComponent implements OnInit {
  oraclesList!: any;
  notPlayedGames = false;
  searchQuery = '';

  constructor(
    public commonFunctions: CommonFunctionsService,
    private filterFunctions: FilterFunctionsService,
  ) {}

  ngOnInit(): void {
    this.oraclesList = this.filterFunctions.sortByNameAscending(
      ORACLES_JSON.oracles,
    );
  }
}
