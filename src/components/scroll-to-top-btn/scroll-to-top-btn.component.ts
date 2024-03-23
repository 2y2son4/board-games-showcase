import { Component, HostListener } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-scroll-to-top-btn',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './scroll-to-top-btn.component.html',
  styleUrl: './scroll-to-top-btn.component.scss',
})
export class ScrollToTopBtnComponent {
  showScrollButton = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 300) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
