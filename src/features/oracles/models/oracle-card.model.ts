import { SupportedLanguage } from '../../../shared/models';

export interface OracleCard {
  name: string;
  artist: string;
  language: SupportedLanguage;
  image?: string;
  description: string[];
  web: string;
}
