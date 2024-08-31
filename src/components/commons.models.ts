export interface GameCard {
  name: string;
  editor: string;
  year: number;
  types: Array<string>;
  language: 'en' | 'es' | 'de' | 'x';
  players: Array<number>;
  time: number;
  complexity: number;
  rate: number;
  image: string;
  isPlayed: boolean;
  age: number;
  bggReference: number;
}

export interface OracleCard {
  name: string;
  artist: string;
  language: 'en' | 'es' | 'de' | '-';
  image?: string;
  description: Array<string>;
  web: string;
}

export interface SortingOrder {
  [key: string]: boolean;
}

export interface SortingFunctions {
  [key: string]: (data: GameCard[]) => GameCard[];
}

export interface GameDetails {
  name: string[];
  yearpublished: string;
  minplayers: string;
  maxplayers: string;
  playingtime: string;
  age: string;
  description: string;
  boardgamecategory: string[];
  image: string;
  boardgamepublisher: string[];
}
