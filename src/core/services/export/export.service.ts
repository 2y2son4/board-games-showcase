import { Injectable } from '@angular/core';

import { GameCard, OracleCard } from '../../../components/commons.models';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  async exportSelectedOraclesAsPdf(
    oracles: OracleCard[],
    filenameBase = 'selected-oracles',
  ): Promise<void> {
    // Lazy import so Jest/tests and initial load don't need to evaluate jsPDF.
    const jsPDFModule: any = await import('jspdf');
    const JsPDFCtor = jsPDFModule.jsPDF ?? jsPDFModule.default;
    const doc = new JsPDFCtor({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    const marginX = 40;
    const marginY = 48;
    const lineHeight = 18;

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxTextWidth = pageWidth - marginX * 2;

    let cursorY = marginY;

    const addLine = (text: string, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxTextWidth);

      for (const line of lines) {
        if (cursorY + lineHeight > pageHeight - marginY) {
          doc.addPage();
          cursorY = marginY;
        }
        doc.text(line, marginX, cursorY);
        cursorY += lineHeight;
      }
    };

    addLine(`Selected oracles (${oracles.length})`, true);
    addLine(`Generated: ${new Date().toLocaleString()}`);
    addLine('');

    oracles.forEach((oracle, i) => {
      addLine(`${i + 1}. ${oracle.name}`, true);
      if (oracle.artist) {
        addLine(`Artist: ${oracle.artist}`);
      }
      if (oracle.description && oracle.description.length > 0) {
        addLine('Description:');
        oracle.description.forEach((paragraph) => {
          addLine(`  ${paragraph}`);
        });
      }
      addLine('');
    });

    const filename = this.withTimestamp(`${filenameBase}.pdf`);
    doc.save(filename);
  }

  async exportSelectedGamesAsPdf(
    games: GameCard[],
    filenameBase = 'selected-games',
    metadata?: {
      selectedChipTypes?: string[];
      selectedDropdownTypes?: string[];
      playedFilter?: 'played' | 'unplayed' | null;
      searchQuery?: string;
      exactPlayers?: number;
      exactAge?: number;
      selectedEditors?: string[];
      selectedSize?: string;
    },
  ): Promise<void> {
    // Lazy import so Jest/tests and initial load don't need to evaluate jsPDF.
    const jsPDFModule: any = await import('jspdf');
    const JsPDFCtor = jsPDFModule.jsPDF ?? jsPDFModule.default;
    const doc = new JsPDFCtor({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
    });

    const marginX = 40;
    const marginY = 48;
    const lineHeight = 18;

    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxTextWidth = pageWidth - marginX * 2;

    let cursorY = marginY;

    const addLine = (text: string, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = doc.splitTextToSize(text, maxTextWidth);

      for (const line of lines) {
        if (cursorY + lineHeight > pageHeight - marginY) {
          doc.addPage();
          cursorY = marginY;
        }
        doc.text(line, marginX, cursorY);
        cursorY += lineHeight;
      }
    };

    addLine(`Selected games (${games.length})`, true);
    addLine(`Generated: ${new Date().toLocaleString()}`);

    // Add filter information
    if (metadata) {
      let hasFilters = false;

      if (metadata.searchQuery) {
        addLine(`Search query: "${metadata.searchQuery}"`);
        hasFilters = true;
      }

      if (metadata.selectedChipTypes && metadata.selectedChipTypes.length > 0) {
        addLine(
          `Filtered by types (AND): ${metadata.selectedChipTypes.join(', ')}`,
        );
        hasFilters = true;
      }

      if (
        metadata.selectedDropdownTypes &&
        metadata.selectedDropdownTypes.length > 0
      ) {
        addLine(
          `Filtered by types (OR): ${metadata.selectedDropdownTypes.join(', ')}`,
        );
        hasFilters = true;
      }

      if (metadata.exactPlayers) {
        addLine(`Player count: ${metadata.exactPlayers} players`);
        hasFilters = true;
      }

      if (metadata.exactAge) {
        addLine(`Age filter: ${metadata.exactAge}+ years`);
        hasFilters = true;
      }

      if (metadata.selectedEditors && metadata.selectedEditors.length > 0) {
        addLine(`Publisher filter: ${metadata.selectedEditors.join(', ')}`);
        hasFilters = true;
      }

      if (metadata.selectedSize) {
        addLine(`Size filter: ${metadata.selectedSize.toUpperCase()}`);
        hasFilters = true;
      }

      if (metadata.playedFilter) {
        addLine(
          `Status: ${metadata.playedFilter === 'played' ? 'Played games' : 'Unplayed games'}`,
        );
        hasFilters = true;
      }

      if (hasFilters) {
        addLine('');
      }
    }

    addLine('');

    // Group games by complexity
    const grouped = this.groupByComplexity(games);

    // Light games (1 / 1.5)
    if (grouped.light.length > 0) {
      addLine(
        `LIGHT GAMES (Complexity 1 / 1.5) - ${grouped.light.length} games`,
        true,
      );
      addLine('');
      this.renderGames(grouped.light, doc, addLine);
    }

    // Medium games (1.51 / 2)
    if (grouped.medium.length > 0) {
      if (grouped.light.length > 0) {
        addLine('-----------------------------------------------');
        addLine('');
      }
      addLine(
        `MEDIUM GAMES (Complexity 1.51 / 2) - ${grouped.medium.length} games`,
        true,
      );
      addLine('');
      this.renderGames(grouped.medium, doc, addLine);
    }

    // Heavy games (2.1 / 5)
    if (grouped.heavy.length > 0) {
      if (grouped.light.length > 0 || grouped.medium.length > 0) {
        addLine('-----------------------------------------------');
        addLine('');
      }
      addLine(
        `HEAVY GAMES (Complexity 2.1 / 5) - ${grouped.heavy.length} games`,
        true,
      );
      addLine('');
      this.renderGames(grouped.heavy, doc, addLine);
    }

    const filename = this.withTimestamp(`${filenameBase}.pdf`);
    doc.save(filename);
  }

  private groupByComplexity(games: GameCard[]): {
    light: GameCard[];
    medium: GameCard[];
    heavy: GameCard[];
  } {
    return {
      light: games.filter((g) => g.complexity >= 1 && g.complexity <= 1.5),
      medium: games.filter((g) => g.complexity > 1.5 && g.complexity <= 2),
      heavy: games.filter((g) => g.complexity > 2 && g.complexity <= 5),
    };
  }

  private renderGames(
    games: GameCard[],
    doc: any,
    addLine: (text: string, bold?: boolean) => void,
  ): void {
    games.forEach((game, i) => {
      addLine(
        `${i + 1}. ${game.name}${game.year ? ` (${game.year}). ${game.isPlayed ? 'Played' : 'Not played yet'}` : ''}`,
        true,
      );
      addLine(`Editor: ${game.editor || '-'}`);
      if (game.types && game.types.length > 0) {
        addLine(`Types: ${game.types.join(', ')}`);
      }
      addLine(`Players: ${this.formatPlayers(game.players)}`);
      if (game.age) {
        addLine(`Age: ${game.age}+ years`);
      }
      addLine(`Play time: ${this.formatTime(game.time)}`);
      if (game.complexity) {
        addLine(`Complexity: ${game.complexity}/5`);
      }
      if (game.rate) {
        // Color-coded rating
        const ratingColor = this.getRatingColor(game.rate);
        const prevColor = doc.getTextColor();
        doc.setTextColor(ratingColor.r, ratingColor.g, ratingColor.b);
        addLine(`Rating: ${game.rate}/10 ${game.rate > 6.5 ? '(HIGH)' : ''}`);
        doc.setTextColor(prevColor);
      }
      if (game.size) {
        addLine(`Size: ${game.size.toUpperCase()}`);
      }
      if (game.bggReference) {
        addLine(
          `BGG: https://boardgamegeek.com/boardgame/${game.bggReference}`,
        );
      }
      addLine('');
    });
  }

  private getRatingColor(rate: number): { r: number; g: number; b: number } {
    if (rate > 5.999) {
      return { r: 0, g: 128, b: 0 }; // Green for high ratings
    }
    return { r: 255, g: 0, b: 0 }; // Red for low ratings
  }

  private formatPlayers(players: number[] | undefined): string {
    if (!players || players.length === 0) return '-';
    if (players.length === 1) return `${players[0]}`;
    if (players.length === 2) return `${players[0]}-${players[1]}`;
    return players.join(', ');
  }

  private formatTime(minutes: number | undefined): string {
    if (!minutes && minutes !== 0) return '-';
    if (minutes < 60) return `${minutes} min`;
    const hours = minutes / 60;
    return hours === 1 ? '1 h' : `${hours} h`;
  }

  private withTimestamp(filename: string): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    const d = new Date();
    const ts = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;

    const dotIndex = filename.lastIndexOf('.');
    if (dotIndex === -1) return `${filename}-${ts}`;

    return `${filename.slice(0, dotIndex)}-${ts}${filename.slice(dotIndex)}`;
  }
}
