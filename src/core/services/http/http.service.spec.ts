import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpService } from './http.service';
import { GameCard, OracleCard } from '../../../components/commons.models';
import { HttpErrorResponse } from '@angular/common/http';

describe('HttpService', () => {
  let service: HttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });

    service = TestBed.inject(HttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch games data', () => {
    const dummyGames: { games: GameCard[] } = {
      games: [
        {
          name: 'Game 1',
          editor: 'Editor 1',
          year: 2020,
          types: ['Type 1'],
          language: 'en',
          players: [2, 4],
          time: 60,
          complexity: 3,
          rate: 4.5,
          image: 'image1.png',
          isPlayed: true,
          age: 12,
        },
      ],
    };

    service.getGames().subscribe((games) => {
      expect(games).toEqual(dummyGames);
    });

    const req = httpMock.expectOne(service['gamesDb']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyGames);
  });

  it('should handle error when fetching games data', () => {
    service.getGames().subscribe((games) => {
      expect(games).toEqual({ games: [] });
    });

    const req = httpMock.expectOne(service['gamesDb']);
    expect(req.request.method).toBe('GET');

    const errorResponse = new HttpErrorResponse({
      error: 'Network error',
      status: 500,
      statusText: 'Internal Server Error',
    });

    req.flush(errorResponse, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should fetch oracles data', () => {
    const dummyOracles: { oracles: OracleCard[] } = {
      oracles: [
        {
          name: 'Oracle 1',
          artist: 'Artist 1',
          language: 'en',
          image: 'oracle1.png',
          description: ['Description 1'],
          web: 'http://oracle1.com',
        },
      ],
    };

    service.getOracles().subscribe((oracles) => {
      expect(oracles).toEqual(dummyOracles);
    });

    const req = httpMock.expectOne(service['oraclesDb']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyOracles);
  });

  it('should fetch BGG data', () => {
    const dummyBGGData = '<xml>BGG Data</xml>';

    service.getBGG().subscribe((data) => {
      expect(data).toEqual(dummyBGGData);
    });

    const req = httpMock.expectOne(service['proxyUrl'] + service['bggUrl']);
    expect(req.request.method).toBe('GET');
    req.flush(dummyBGGData);
  });
});
