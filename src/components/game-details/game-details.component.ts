import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { GameDetails } from '../commons.models';
import { MatChipsModule } from '@angular/material/chips';
import type {
  XmlAttributes,
  XmlNodeObject,
  XmlNodeValue,
} from '../../core/models/xml.model';

@Component({
  selector: 'app-game-details',
  imports: [MatChipsModule],
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnChanges {
  @Input() objectid: string | null = null;
  @Input() gameDetails: GameDetails | null = null;
  private readonly http = inject(HttpClient);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['objectid'] && this.objectid) {
      this.fetchGameDetails(this.objectid);
    }
  }

  fetchGameDetails(objectid: string) {
    const apiUrl = `/api/xmlapi/boardgame/${objectid}`;
    this.http
      .get(apiUrl, { responseType: 'text' })
      .pipe(
        catchError((error) => {
          console.error('Error from fetchGameDetails: ', error);
          return throwError(() => new Error('Something went wrong'));
        }),
      )
      .subscribe((response) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(response, 'application/xml');
        const json = this.xmlToJson(xml);
        this.gameDetails = this.cleanGameDetails(
          this.asObject(json['boardgames'])['boardgame'],
        );
      });
    console.log(this.gameDetails);
  }

  cleanGameDetails(details: XmlNodeValue | undefined): GameDetails {
    const game = this.asObject(details);

    const cleanedGame = {
      name: this.extractNames(game['name'] as XmlNodeValue),
      yearpublished: this.extractTextValue(
        game['yearpublished'] as XmlNodeValue,
      ),
      minplayers: this.extractTextValue(game['minplayers'] as XmlNodeValue),
      maxplayers: this.extractTextValue(game['maxplayers'] as XmlNodeValue),
      playingtime: this.extractTextValue(game['playingtime'] as XmlNodeValue),
      age: this.extractTextValue(game['age'] as XmlNodeValue),
      description: this.extractTextValue(game['description'] as XmlNodeValue),
      boardgamecategory: this.extractNames(
        game['boardgamecategory'] as XmlNodeValue,
      ),
      image: this.extractTextValue(game['image'] as XmlNodeValue),
      boardgamepublisher: this.extractNames(
        game['boardgamepublisher'] as XmlNodeValue,
      ),
      size: this.extractNames(game['size'] as XmlNodeValue),
    };
    console.log(details);
    console.log(cleanedGame);
    return cleanedGame;
  }

  private extractNames(nameObj: XmlNodeValue | undefined): string[] {
    if (!nameObj) return [];
    if (Array.isArray(nameObj)) {
      return nameObj.map((nameItem) => this.extractTextValue(nameItem));
    } else {
      return [this.extractTextValue(nameObj)];
    }
  }

  private extractTextValue(node: XmlNodeValue | undefined): string {
    if (!node) {
      return '';
    }

    if (typeof node === 'string') {
      return node;
    }

    if (Array.isArray(node)) {
      return '';
    }

    const textNode = node['#text'];
    return typeof textNode === 'string' ? textNode : '';
  }

  xmlToJson(xml: Document): XmlNodeObject {
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

  parseAttributes(attributes: NamedNodeMap): XmlAttributes {
    const attrObj: XmlAttributes = {};
    for (let index = 0; index < attributes.length; index++) {
      const attribute = attributes.item(index);
      if (attribute) {
        attrObj[attribute.nodeName] = attribute.nodeValue ?? '';
      }
    }
    return attrObj;
  }

  getSortedCategories(categories: string[] | null | undefined): string[] {
    return [...(categories ?? [])].sort((a, b) => a.localeCompare(b));
  }

  private asObject(value: XmlNodeValue | undefined): XmlNodeObject {
    if (!value || typeof value === 'string' || Array.isArray(value)) {
      return {};
    }

    return value;
  }
}
