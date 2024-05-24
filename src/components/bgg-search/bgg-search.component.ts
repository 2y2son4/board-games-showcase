import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../loader/loader.component';
import { ScrollToTopBtnComponent } from '../scroll-to-top-btn/scroll-to-top-btn.component';
import { LoaderService } from '../../core/services/loader/loader.service';
import { catchError, throwError } from 'rxjs';
import { GameDetailsComponent } from '../game-details/game-details.component';

@Component({
  selector: 'app-bgg-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GameDetailsComponent,
    HttpClientModule,
    LoaderComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ScrollToTopBtnComponent,
  ],
  templateUrl: './bgg-search.component.html',
  styleUrls: ['./bgg-search.component.scss'],
})
export class BggSearchComponent {
  searchTerm: string = '';
  results: any = null;
  selectedGameId: string | null = null;
  selectedGameDetails: any = null;
  showDetails!: boolean;
  isLoading!: boolean;
  noResults!: boolean;
  numberOfResults!: number;
  showNumberOfResults!: boolean;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {}

  search() {
    this.loaderService.show();
    this.showDetails = false;
    this.isLoading = true;

    const apiUrl = `/api/xmlapi/search?search=${this.searchTerm}`; // Proxy URL

    this.http
      .get(apiUrl, { responseType: 'text' })
      .pipe(
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Something went wrong'));
        }),
      )
      .subscribe((response) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response, 'application/xml');
        const json = this.xmlToJson(xml);
        this.results = this.filterResults(json);
        this.loaderService.hide();
        this.isLoading = false;
        this.noResults = false;

        if (!json.boardgames['#text']) {
          this.noResults = true;
          this.showNumberOfResults = false;
        } else {
          this.noResults = false;
          this.showNumberOfResults = true;
          this.numberOfResults = json.boardgames['#text'].length;
        }
      });
  }

  xmlToJson(xml: Document): any {
    return this.parseElement(xml);
  }

  parseElement(element: Node): any {
    const obj: any = {};
    if (element.nodeType === Node.ELEMENT_NODE) {
      const el = element as Element;
      this.parseAttributesIntoObject(el, obj);
    } else if (element.nodeType === Node.TEXT_NODE) {
      return (element.nodeValue ?? '').trim();
    }
    this.parseChildNodesIntoObject(element, obj);
    return obj;
  }

  parseAttributesIntoObject(element: Element, obj: any): void {
    if (element.attributes.length > 0) {
      obj['@attributes'] = this.parseAttributes(element.attributes);
    }
  }

  parseChildNodesIntoObject(element: Node, obj: any): void {
    if (element.hasChildNodes()) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const item = element.childNodes.item(i);
        const nodeName = item.nodeName;
        this.addChildNodeToObject(item, nodeName, obj);
      }
    }
  }

  addChildNodeToObject(item: Node, nodeName: string, obj: any): void {
    if (typeof obj[nodeName] === 'undefined') {
      obj[nodeName] = this.parseElement(item);
    } else {
      if (!Array.isArray(obj[nodeName])) {
        obj[nodeName] = [obj[nodeName]];
      }
      obj[nodeName].push(this.parseElement(item));
    }
  }

  parseAttributes(attributes: NamedNodeMap): any {
    const attrObj: any = {};
    for (let j = 0; j < attributes.length; j++) {
      const attribute = attributes.item(j);
      if (attribute) {
        // check if attribute is not null
        attrObj[attribute.nodeName] = attribute.nodeValue;
      }
    }
    return attrObj;
  }

  filterResults(json: any): any {
    const boardgames = json?.boardgames?.boardgame;
    if (boardgames) {
      json.boardgames.boardgame = boardgames.filter((game: any) => {
        return game.name?.['#text'] && game.yearpublished?.['#text'];
      });
    }
    return json;
  }

  selectGame(objectid: string) {
    this.selectedGameId = objectid;
    this.showDetails = true;
  }
}
