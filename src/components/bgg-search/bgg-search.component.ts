import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../loader/loader.component';
import { LoaderService } from '../../core/services/loader/loader.service';
import { catchError, throwError } from 'rxjs';
import { GameDetailsComponent } from '../game-details/game-details.component';
import { GameDetails } from '../models';
import type { BggResults } from './index';
import type { XmlNodeObject, XmlNodeValue } from '../../core/models';

@Component({
  selector: 'app-bgg-search',
  imports: [
    FormsModule,
    GameDetailsComponent,
    LoaderComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './bgg-search.component.html',
  styleUrls: ['./bgg-search.component.scss'],
})
export class BggSearchComponent {
  searchTerm = '';
  results: BggResults | null = null;
  selectedGameId: string | null = null;
  selectedGameDetails: GameDetails | null = null;
  showDetails!: boolean;
  isLoading!: boolean;
  noResults!: boolean;
  numberOfResults!: number;
  showNumberOfResults!: boolean;

  private readonly http = inject(HttpClient);
  private readonly loaderService = inject(LoaderService);

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

        const textNodes = this.results.boardgames?.['#text'];

        if (!textNodes) {
          this.noResults = true;
          this.showNumberOfResults = false;
        } else {
          this.noResults = false;
          this.showNumberOfResults = true;
          this.numberOfResults = Array.isArray(textNodes)
            ? textNodes.length
            : 1;
        }
      });
  }

  xmlToJson(xml: Document): BggResults {
    return this.asObject(this.parseElement(xml));
  }

  parseElement(element: Node): XmlNodeValue {
    const obj: XmlNodeObject = {};
    if (element.nodeType === Node.ELEMENT_NODE) {
      const el = element as Element;
      this.parseAttributesIntoObject(el, obj);
    } else if (element.nodeType === Node.TEXT_NODE) {
      return (element.nodeValue ?? '').trim();
    }
    this.parseChildNodesIntoObject(element, obj);
    return obj;
  }

  parseAttributesIntoObject(element: Element, obj: XmlNodeObject): void {
    if (element.attributes.length > 0) {
      obj['@attributes'] = this.parseAttributes(element.attributes);
    }
  }

  parseChildNodesIntoObject(element: Node, obj: XmlNodeObject): void {
    if (element.hasChildNodes()) {
      for (let i = 0; i < element.childNodes.length; i++) {
        const item = element.childNodes.item(i);
        const nodeName = item.nodeName;
        this.addChildNodeToObject(item, nodeName, obj);
      }
    }
  }

  addChildNodeToObject(item: Node, nodeName: string, obj: XmlNodeObject): void {
    const parsedChild = this.parseElement(item);
    const existingChild = obj[nodeName];

    if (typeof existingChild === 'undefined') {
      obj[nodeName] = parsedChild;
      return;
    }

    if (Array.isArray(existingChild)) {
      obj[nodeName] = [...existingChild, parsedChild];
      return;
    }

    obj[nodeName] = [existingChild, parsedChild];
  }

  parseAttributes(attributes: NamedNodeMap): XmlNodeObject {
    const attrObj: XmlNodeObject = {};
    for (let j = 0; j < attributes.length; j++) {
      const attribute = attributes.item(j);
      if (attribute) {
        // check if attribute is not null
        attrObj[attribute.nodeName] = attribute.nodeValue ?? '';
      }
    }
    return attrObj;
  }

  filterResults(json: BggResults): BggResults {
    const boardgames = json.boardgames?.boardgame ?? [];
    if (json.boardgames) {
      json.boardgames.boardgame = boardgames.filter((game) => {
        return game.name?.['#text'] && game.yearpublished?.['#text'];
      });
    }
    return json;
  }

  private asObject(value: XmlNodeValue): XmlNodeObject {
    if (typeof value === 'string' || Array.isArray(value)) {
      return {};
    }

    return value;
  }

  selectGame(objectid: string) {
    this.selectedGameId = objectid;
    this.showDetails = true;
  }
}
