import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import ORACLES_JSON from '../../assets/data/oracles.json';
import { CommonModule } from '@angular/common';
import { HighlightTextPipe } from '../../core/pipes/highlight-text/highlight-text.pipe';
import { CommonFunctionsService } from '../../core/functions/common/common-functions.service';
import { FilterFunctionsService } from '../../core/functions/filter/filter-functions.service';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { OracleCard } from '../commons.models';

@Component({
  selector: 'app-oracles',
  standalone: true,
  imports: [CommonModule, HighlightTextPipe, ScrollToTopBtnComponent],
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
  ) {}

  ngOnInit(): void {
    this.oraclesList = this.filterFunctions.sortByNameAscending(
      ORACLES_JSON.oracles,
    );
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
