export interface GameCard {
  name: string;
  editor: string;
  year: number;
  types: string[];
  language: 'en' | 'es' | 'de' | 'x';
  players: number[];
  time: number;
  complexity: number;
  rate: number;
  image: string;
  isPlayed: boolean;
  age: number;
  bggReference: number;
  size: 'xs' | 's' | 'm' | 'l';
}

export interface OracleCard {
  name: string;
  artist: string;
  language: 'en' | 'es' | 'de' | 'x';
  image?: string;
  description: string[];
  web: string;
}

export interface SortingOrder {
  [key: string]: boolean;
}

export interface SortingFunctions {
  [key: string]: (data: GameCard[]) => GameCard[];
}

export interface GameDetails {
  name: string | string[];
  yearpublished: string;
  minplayers: string;
  maxplayers: string;
  playingtime: string;
  age: string;
  description: string;
  boardgamecategory: string[];
  image: string;
  boardgamepublisher: string[];
  size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
}
