import type {
  XmlNodeObject,
  XmlNodeValue,
} from '../../../../core/models/xml.model';

export type BggAttributes = {
  objectid: string;
} & Record<string, string>;

export interface BggTextNode {
  '#text': string;
}

export interface BggGameRaw extends XmlNodeObject {
  name?: XmlNodeObject;
  yearpublished?: XmlNodeObject;
  '@attributes'?: BggAttributes;
}

export interface BggGame {
  name: BggTextNode;
  yearpublished: BggTextNode;
  '@attributes': BggAttributes;
}

export interface BggBoardgamesRaw extends XmlNodeObject {
  boardgame?: BggGameRaw[];
  '#text'?: XmlNodeValue;
}

export interface BggResultsRaw extends XmlNodeObject {
  boardgames?: BggBoardgamesRaw;
}

export interface BggBoardgames {
  boardgame: BggGame[];
}

export interface BggResults {
  boardgames: BggBoardgames;
}
