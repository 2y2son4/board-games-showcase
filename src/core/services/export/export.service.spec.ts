import { ExportService } from './export.service';
import type { GameCard } from '../../../components/commons.models';

// Mock jsPDF so tests don't generate real PDFs.
jest.mock('jspdf', () => {
  class FakeJsPDF {
    static instances: FakeJsPDF[] = [];

    internal = {
      pageSize: {
        getHeight: () => 842, // A4 height in pt (roughly)
        getWidth: () => 595, // A4 width in pt (roughly)
      },
    };

    setFont = jest.fn();
    splitTextToSize = jest.fn((text: string) => [text]);
    addPage = jest.fn();
    text = jest.fn();
    save = jest.fn();

    constructor() {
      FakeJsPDF.instances.push(this);
    }
  }

  return {
    jsPDF: FakeJsPDF,
    default: FakeJsPDF,
  };
});

const getFakeJsPdfCtor = async () => {
  const jspdf = await import('jspdf');
  const FakeJsPDF: any = jspdf.jsPDF ?? jspdf.default;
  return FakeJsPDF;
};

describe('ExportService', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-01-01T12:34:56.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('generates a PDF and saves it with a timestamped filename', async () => {
    const service = new ExportService();

    const FakeJsPDF = await getFakeJsPdfCtor();
    FakeJsPDF.instances.length = 0;

    const games: GameCard[] = [
      {
        name: 'Test Game',
        editor: 'Test Publisher',
        players: [1, 4],
        time: 90,
        year: 2020,
        image: 'a-sacar-la-basura',
        bggReference: '12345',
      } as unknown as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games, 'my-export');

    expect(FakeJsPDF.instances.length).toBe(1);

    const doc = FakeJsPDF.instances[0];

    // Ensure we saved a timestamped filename.
    expect(doc.save).toHaveBeenCalledTimes(1);
    const filenameArg = doc.save.mock.calls[0][0] as string;
    expect(filenameArg.startsWith('my-export-')).toBe(true);
    expect(filenameArg.endsWith('.pdf')).toBe(true);
    expect(filenameArg).toMatch(/^my-export-\d{8}-\d{6}\.pdf$/);

    // Ensure we wrote expected lines.
    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(writtenText).toContain('Selected games (1)');
    expect(writtenText).toContain('1. Test Game (2020)');
    expect(writtenText).toContain('Editor: Test Publisher');
    expect(writtenText).toContain('Players: 1-4');
    expect(writtenText).toContain('Play time: 1.5 h');
    expect(writtenText).toContain(
      'BGG: https://boardgamegeek.com/boardgame/12345',
    );

    // Image line was intentionally removed.
    expect(writtenText).not.toContain('Image:');
  });

  it('handles missing optional fields gracefully', async () => {
    const service = new ExportService();

    const FakeJsPDF = await getFakeJsPdfCtor();
    FakeJsPDF.instances.length = 0;

    const games: GameCard[] = [
      {
        name: 'No Extras Game',
        editor: '',
        players: undefined,
        time: undefined,
        year: undefined,
        bggReference: undefined,
      } as unknown as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games);

    const doc = FakeJsPDF.instances[0];

    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(writtenText).toContain('Selected games (1)');
    expect(writtenText).toContain('1. No Extras Game');
    expect(writtenText).toContain('Editor: -');
    expect(writtenText).toContain('Players: -');
    expect(writtenText).toContain('Play time: -');
    expect(writtenText).toContain('BGG: -');
  });
});
