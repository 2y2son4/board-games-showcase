export interface FilterCriteria {
  searchQuery?: string;
  exactPlayers?: number;
  exactAge?: number;
  selectedTypes?: string[];
  selectedEditors?: string[];
  selectedChipTypes?: string[];
  selectedSize?: string;
  playedGames?: boolean;
  unPlayedGames?: boolean;
  sorting?: string;
}
