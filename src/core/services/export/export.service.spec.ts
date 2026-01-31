import { ExportService } from './export.service';
import type { GameCard, OracleCard } from '../../../components/commons.models';

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
    setTextColor = jest.fn();
    getTextColor = jest.fn(() => 'rgb(0,0,0)');

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
        bggReference: 12345,
        complexity: 1.5,
        rate: 7.5,
        types: ['Strategy', 'Family'],
        age: 10,
        size: 'm',
        isPlayed: true,
      } as GameCard,
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
    expect(writtenText).toContain('LIGHT GAMES (Complexity 1 / 1.5)');
    expect(writtenText).toContain('1. Test Game (2020). Played');
    expect(writtenText).toContain('Editor: Test Publisher');
    expect(writtenText).toContain('Types: Strategy, Family');
    expect(writtenText).toContain('Players: 1-4');
    expect(writtenText).toContain('Age: 10+ years');
    expect(writtenText).toContain('Play time: 1.5 h');
    expect(writtenText).toContain('Complexity: 1.5/5');
    expect(writtenText).toContain('Rating: 7.5/10 (HIGH)');
    expect(writtenText).toContain('Size: M');
    expect(writtenText).toContain(
      'BGG: https://boardgamegeek.com/boardgame/12345',
    );

    // Verify color-coding was applied
    expect(doc.setTextColor).toHaveBeenCalledWith(0, 128, 0); // Green for high rating
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
        complexity: 2.5,
        rate: 5.0,
        types: [],
        age: undefined,
        size: undefined,
        isPlayed: false,
      } as unknown as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games);

    const doc = FakeJsPDF.instances[0];

    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');
    expect(writtenText).toContain('Selected games (1)');
    expect(writtenText).toContain('HEAVY GAMES (Complexity 2.1 / 5)');
    expect(writtenText).toContain('1. No Extras Game');
    expect(writtenText).toContain('Editor: -');
    expect(writtenText).toContain('Players: -');
    expect(writtenText).toContain('Play time: -');

    // Verify red color for low rating
    expect(doc.setTextColor).toHaveBeenCalledWith(255, 0, 0);
  });

  it('includes metadata filters in the PDF header', async () => {
    const service = new ExportService();

    const FakeJsPDF = await getFakeJsPdfCtor();
    FakeJsPDF.instances.length = 0;

    const games: GameCard[] = [
      {
        name: 'Test Game',
        editor: 'Test Publisher',
        complexity: 1.2,
        rate: 8.0,
        types: ['Strategy'],
        players: [2, 4],
        time: 60,
        year: 2023,
        age: 12,
        size: 's',
        isPlayed: true,
        bggReference: 123,
      } as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games, 'filtered-games', {
      searchQuery: 'strategy',
      selectedChipTypes: ['Strategy', 'Family'],
      exactPlayers: 3,
      exactAge: 10,
      selectedEditors: ['Publisher A', 'Publisher B'],
      selectedSize: 'm',
      playedFilter: 'played',
    });

    const doc = FakeJsPDF.instances[0];
    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');

    expect(writtenText).toContain('Search query: "strategy"');
    expect(writtenText).toContain('Filtered by types (AND): Strategy, Family');
    expect(writtenText).toContain('Player count: 3 players');
    expect(writtenText).toContain('Age filter: 10+ years');
    expect(writtenText).toContain('Publisher filter: Publisher A, Publisher B');
    expect(writtenText).toContain('Size filter: M');
    expect(writtenText).toContain('Status: Played games');
  });

  it('groups games by complexity correctly', async () => {
    const service = new ExportService();

    const FakeJsPDF = await getFakeJsPdfCtor();
    FakeJsPDF.instances.length = 0;

    const games: GameCard[] = [
      {
        name: 'Light Game',
        complexity: 1.3,
        rate: 7.0,
        editor: 'Ed1',
        types: ['Party'],
        players: [2],
        time: 30,
        year: 2021,
        age: 8,
        size: 's',
        isPlayed: false,
        bggReference: 1,
      } as GameCard,
      {
        name: 'Medium Game',
        complexity: 1.8,
        rate: 7.5,
        editor: 'Ed2',
        types: ['Strategy'],
        players: [2, 4],
        time: 60,
        year: 2022,
        age: 10,
        size: 'm',
        isPlayed: true,
        bggReference: 2,
      } as GameCard,
      {
        name: 'Heavy Game',
        complexity: 3.5,
        rate: 8.0,
        editor: 'Ed3',
        types: ['Strategy'],
        players: [1, 4],
        time: 120,
        year: 2023,
        age: 14,
        size: 'l',
        isPlayed: false,
        bggReference: 3,
      } as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games);

    const doc = FakeJsPDF.instances[0];
    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');

    expect(writtenText).toContain('LIGHT GAMES (Complexity 1 / 1.5) - 1 games');
    expect(writtenText).toContain(
      'MEDIUM GAMES (Complexity 1.51 / 2) - 1 games',
    );
    expect(writtenText).toContain('HEAVY GAMES (Complexity 2.1 / 5) - 1 games');
    expect(writtenText).toContain('Light Game');
    expect(writtenText).toContain('Medium Game');
    expect(writtenText).toContain('Heavy Game');
  });

  it('displays dropdown types filter with OR logic', async () => {
    const service = new ExportService();

    const FakeJsPDF = await getFakeJsPdfCtor();
    FakeJsPDF.instances.length = 0;

    const games: GameCard[] = [
      {
        name: 'Test',
        complexity: 1.5,
        rate: 6.0,
        editor: 'Ed',
        types: ['Party'],
        players: [2],
        time: 30,
        year: 2021,
        age: 8,
        size: 's',
        isPlayed: false,
        bggReference: 1,
      } as GameCard,
    ];

    await service.exportSelectedGamesAsPdf(games, 'test', {
      selectedDropdownTypes: ['Party', 'Strategy', 'Family'],
    });

    const doc = FakeJsPDF.instances[0];
    const writtenText = doc.text.mock.calls.map((c: any[]) => c[0]).join('\n');

    expect(writtenText).toContain(
      'Filtered by types (OR): Party, Strategy, Family',
    );
  });

  describe('Oracle Export', () => {
    it('exports oracle cards to PDF with name, artist, and description', async () => {
      const service = new ExportService();

      const FakeJsPDF = await getFakeJsPdfCtor();
      FakeJsPDF.instances.length = 0;

      const oracles: OracleCard[] = [
        {
          name: 'Test Oracle',
          artist: 'Test Artist',
          description: ['First paragraph', 'Second paragraph'],
          language: 'en',
          web: 'https://example.com',
        },
        {
          name: 'Another Oracle',
          artist: 'Another Artist',
          description: ['Description text'],
          language: 'es',
          web: '',
        },
      ];

      await service.exportSelectedOraclesAsPdf(oracles, 'my-oracles');

      expect(FakeJsPDF.instances.length).toBe(1);

      const doc = FakeJsPDF.instances[0];

      // Ensure we saved a timestamped filename.
      expect(doc.save).toHaveBeenCalledTimes(1);
      const filenameArg = doc.save.mock.calls[0][0] as string;
      expect(filenameArg.startsWith('my-oracles-')).toBe(true);
      expect(filenameArg.endsWith('.pdf')).toBe(true);
      expect(filenameArg).toMatch(/^my-oracles-\d{8}-\d{6}\.pdf$/);

      // Ensure we wrote expected lines.
      const writtenText = doc.text.mock.calls
        .map((c: any[]) => c[0])
        .join('\n');
      expect(writtenText).toContain('Selected oracles (2)');
      expect(writtenText).toContain('1. Test Oracle');
      expect(writtenText).toContain('Artist: Test Artist');
      expect(writtenText).toContain('Description:');
      expect(writtenText).toContain('First paragraph');
      expect(writtenText).toContain('Second paragraph');
      expect(writtenText).toContain('2. Another Oracle');
      expect(writtenText).toContain('Artist: Another Artist');
      expect(writtenText).toContain('Description text');
    });

    it('handles oracles with missing optional fields', async () => {
      const service = new ExportService();

      const FakeJsPDF = await getFakeJsPdfCtor();
      FakeJsPDF.instances.length = 0;

      const oracles: OracleCard[] = [
        {
          name: 'Minimal Oracle',
          artist: '',
          description: [],
          language: 'en',
          web: '',
        },
      ];

      await service.exportSelectedOraclesAsPdf(oracles);

      const doc = FakeJsPDF.instances[0];

      const writtenText = doc.text.mock.calls
        .map((c: any[]) => c[0])
        .join('\n');
      expect(writtenText).toContain('Selected oracles (1)');
      expect(writtenText).toContain('1. Minimal Oracle');
      // Artist should not be present when empty
      expect(
        writtenText
          .split('\n')
          .filter((line: string) => line.includes('Artist:')).length,
      ).toBe(0);
      // Description should not be present when empty
      expect(
        writtenText
          .split('\n')
          .filter((line: string) => line.includes('Description:')).length,
      ).toBe(0);
    });
  });
});
