import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoaderComponent } from '../../../../shared/components/loader/loader.component';
import { LoaderService } from '../../../../core/services/loader/loader.service';
import { catchError, throwError } from 'rxjs';
import { GameDetailsComponent } from '../game-details/game-details.component';
import { GameDetails } from '../../../../shared/models';
import type {
  BggAttributes,
  BggGame,
  BggGameRaw,
  BggResults,
  BggResultsRaw,
  BggTextNode,
} from './index';
import type { XmlNodeObject, XmlNodeValue } from '../../../../core/models';

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

        const totalResults = this.results.boardgames.boardgame.length;

        if (totalResults === 0) {
          this.noResults = true;
          this.showNumberOfResults = false;
        } else {
          this.noResults = false;
          this.showNumberOfResults = true;
          this.numberOfResults = totalResults;
        }
      });
  }

  xmlToJson(xml: Document): BggResultsRaw {
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

  filterResults(json: BggResultsRaw): BggResults {
    const boardgames = json.boardgames?.boardgame ?? [];
    const normalizedGames = boardgames
      .map((game) => this.normalizeGame(game))
      .filter((game): game is BggGame => game !== null);

    return {
      boardgames: {
        boardgame: normalizedGames,
      },
    };
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

  private normalizeGame(game: BggGameRaw): BggGame | null {
    const name = this.asTextNode(game.name);
    const yearpublished = this.asTextNode(game.yearpublished);
    const attributes = this.asAttributes(game['@attributes']);

    if (!name || !yearpublished || !attributes) {
      return null;
    }

    return {
      name,
      yearpublished,
      '@attributes': attributes,
    };
  }

  private asTextNode(value: XmlNodeValue | undefined): BggTextNode | null {
    if (!value || typeof value === 'string' || Array.isArray(value)) {
      return null;
    }

    const text = value['#text'];
    if (typeof text !== 'string' || text.trim() === '') {
      return null;
    }

    return { '#text': text };
  }

  private asAttributes(value: XmlNodeValue | undefined): BggAttributes | null {
    if (!value || typeof value === 'string' || Array.isArray(value)) {
      return null;
    }

    const objectid = value['objectid'];
    if (typeof objectid !== 'string' || objectid.trim() === '') {
      return null;
    }

    const attributes: Record<string, string> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (typeof entry === 'string') {
        attributes[key] = entry;
      }
    }

    return {
      ...attributes,
      objectid,
    };
  }
}
