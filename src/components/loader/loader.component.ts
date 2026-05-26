import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  loading = false;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.loaderService.loading$.subscribe((loading) => {
      this.loading = loading;
      this.cdr.detectChanges();
    });
  }
}
