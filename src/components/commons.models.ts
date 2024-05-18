export interface GameCard {
  name: string;
  editor: string;
  year: number;
  types: Array<string>;
  language: 'en' | 'es' | 'de' | '-';
  players?: Array<number>;
  time?: number;
  complexity: number;
  rate: number;
  image?: string;
  isPlayed: boolean;
  age: number;
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
