import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AppTitleStrategy extends TitleStrategy {
  readonly #title = inject(Title);
  readonly #defaultTitle = "2y2son4's games and oracles showcase";

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);
    const nextTitle = routeTitle
      ? `${this.#defaultTitle} | ${routeTitle}`
      : this.#defaultTitle;

    this.#title.setTitle(nextTitle);
  }
}
