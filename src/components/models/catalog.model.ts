export type SupportedLanguage = 'en' | 'es' | 'de' | 'x';

export type GameSize = 'xs' | 's' | 'm' | 'l';

export interface GameCard {
  name: string;
  editor: string;
  year: number;
  types: string[];
  language: SupportedLanguage;
  players: number[];
  time: number;
  complexity: number;
  rate: number;
  image: string;
  isPlayed: boolean;
  age: number;
  bggReference: number;
  size: GameSize;
}

export interface OracleCard {
  name: string;
  artist: string;
  language: SupportedLanguage;
  image?: string;
  description: string[];
  web: string;
}

export type SortingOrder = Record<string, boolean>;

export type SortingFunctions = Record<string, (data: GameCard[]) => GameCard[]>;
