export interface GameCard {
  name: string;
  editor: string;
  year: number;
  type: Array<string>;
  language: 'en' | 'es' | 'de' | '-';
  players?: Array<number>;
  time?: number;
  complexity: number;
  image?: string;
  isPlayed: boolean;
}

export interface SortingOrder {
  [key: string]: boolean;
}

export interface SortingFunctions {
  [key: string]: (data: GameCard[]) => GameCard[];
}
