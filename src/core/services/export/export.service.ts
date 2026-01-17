import { Injectable } from '@angular/core';

import { GameCard } from '../../../components/commons.models';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  async exportSelectedGamesAsPdf(
    games: GameCard[],
    filenameBase = 'selected-games',
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
    const blockSpacing = 6;

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
    addLine('');

    games.forEach((game, idx) => {
      addLine(
        `${idx + 1}. ${game.name}${game.year ? ` (${game.year})` : ''}`,
        true,
      );
      addLine(`Editor: ${game.editor || '-'}`);
      addLine(`Players: ${this.formatPlayers(game.players)}`);
      addLine(`Play time: ${this.formatTime(game.time)}`);
      addLine(
        `BGG: ${game.bggReference ? `https://boardgamegeek.com/boardgame/${game.bggReference}` : '-'}`,
      );
      cursorY += blockSpacing;
      addLine('');
    });

    const filename = this.withTimestamp(`${filenameBase}.pdf`);
    doc.save(filename);
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

    const dotIdx = filename.lastIndexOf('.');
    if (dotIdx === -1) return `${filename}-${ts}`;

    return `${filename.slice(0, dotIdx)}-${ts}${filename.slice(dotIdx)}`;
  }
}
