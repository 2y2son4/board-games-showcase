import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading: boolean = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
      this.cdr.detectChanges();
    });
  }
}
