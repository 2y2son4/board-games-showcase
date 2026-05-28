import type { XmlNodeObject, XmlNodeValue } from '../../core/models/xml.model';

export interface BggGame extends XmlNodeObject {
  name?: XmlNodeObject;
  yearpublished?: XmlNodeObject;
}

export interface BggBoardgames extends XmlNodeObject {
  boardgame?: BggGame[];
  '#text'?: XmlNodeValue;
}

export interface BggResults extends XmlNodeObject {
  boardgames?: BggBoardgames;
}
