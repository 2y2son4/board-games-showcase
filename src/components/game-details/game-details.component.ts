import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GameDetails } from '../commons.models';
import { MatChipsModule } from '@angular/material/chips';

@Component({
    selector: 'app-game-details',
    imports: [CommonModule, MatChipsModule],
    templateUrl: './game-details.component.html',
    styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent implements OnChanges {
  @Input() objectid: string | null = null;
  @Input() gameDetails: any = null;

  constructor(private readonly http: HttpClient) {}

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
        this.gameDetails = this.cleanGameDetails(json.boardgames?.boardgame);
      });
    console.log(this.gameDetails);
  }

  cleanGameDetails(details: any): GameDetails {
    const game = details;

    const cleanedGame = {
      name: this.extractNames(game.name),
      yearpublished: this.extractTextValue(game.yearpublished),
      minplayers: this.extractTextValue(game.minplayers),
      maxplayers: this.extractTextValue(game.maxplayers),
      playingtime: this.extractTextValue(game.playingtime),
      age: this.extractTextValue(game.age),
      description: this.extractTextValue(game.description),
      boardgamecategory: this.extractNames(game.boardgamecategory),
      image: this.extractTextValue(game.image),
      boardgamepublisher: this.extractNames(game.boardgamepublisher),
      size: game.size,
    };
    console.log(details);
    console.log(cleanedGame);
    return cleanedGame;
  }

  private extractNames(nameObj: any): string[] {
    if (!nameObj) return [];
    if (Array.isArray(nameObj)) {
      return nameObj.map((nameItem: any) => this.extractTextValue(nameItem));
    } else {
      return [this.extractTextValue(nameObj)];
    }
  }

  private extractTextValue(node: any): string {
    return node ? node['#text'] || '' : '';
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
    for (let index = 0; index < attributes.length; index++) {
      const attribute = attributes.item(index);
      if (attribute) {
        attrObj[attribute.nodeName] = attribute.nodeValue;
      }
    }
    return attrObj;
  }
}
