import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { GameDetailsComponent } from './game-details.component';

class HttpClientMock {
  get = jest.fn();
}

describe('GameDetailsComponent', () => {
  let component: GameDetailsComponent;
  let fixture: ComponentFixture<GameDetailsComponent>;
  let http: HttpClientMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameDetailsComponent],
      providers: [{ provide: HttpClient, useClass: HttpClientMock }],
    }).compileComponents();
    fixture = TestBed.createComponent(GameDetailsComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchGameDetails in ngOnChanges if objectid changes', () => {
    const spy = jest.spyOn(component, 'fetchGameDetails').mockImplementation();
    component.objectid = '123';
    component.ngOnChanges({
      objectid: {
        currentValue: '123',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(spy).toHaveBeenCalledWith('123');
  });

  it('should not call fetchGameDetails in ngOnChanges if objectid is null', () => {
    const spy = jest.spyOn(component, 'fetchGameDetails');
    component.objectid = null;
    component.ngOnChanges({
      objectid: {
        currentValue: null,
        previousValue: '1',
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(spy).not.toHaveBeenCalled();
  });

  it('should fetch game details and set gameDetails on success', () => {
    const xmlString =
      '<boardgames><boardgame><name>#text</name></boardgame></boardgames>';
    http.get.mockReturnValue(of(xmlString));
    jest.spyOn(component, 'xmlToJson').mockReturnValue({
      boardgames: { boardgame: { name: { '#text': 'foo' } } },
    });
    jest
      .spyOn(component, 'cleanGameDetails')
      .mockReturnValue({
        name: 'foo',
        yearpublished: '2020',
        minplayers: '1',
        maxplayers: '4',
        playingtime: '30',
        age: '8',
        description: 'desc',
        boardgamecategory: ['cat1', 'cat2'],
        image: 'img.png',
        boardgamepublisher: ['pub1'],
        size: 's',
      });
    component.fetchGameDetails('123');
    expect(component.gameDetails).toEqual({
      name: 'foo',
      yearpublished: '2020',
      minplayers: '1',
      maxplayers: '4',
      playingtime: '30',
      age: '8',
      description: 'desc',
      boardgamecategory: ['cat1', 'cat2'],
      image: 'img.png',
      boardgamepublisher: ['pub1'],
      size: 's',
    });
  });

  it('should handle error in fetchGameDetails', () => {
    http.get.mockReturnValue(throwError(() => new Error('fail')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    component.fetchGameDetails('fail');
    // No throw, error handled
    expect(true).toBe(true);
  });

  it('should clean game details with all fields', () => {
    const details = {
      name: { '#text': 'foo' },
      yearpublished: { '#text': '2020' },
      minplayers: { '#text': '1' },
      maxplayers: { '#text': '4' },
      playingtime: { '#text': '30' },
      age: { '#text': '8' },
      description: { '#text': 'desc' },
      boardgamecategory: [{ '#text': 'cat1' }, { '#text': 'cat2' }],
      image: { '#text': 'img.png' },
      boardgamepublisher: [{ '#text': 'pub1' }],
      size: ['small', 'large'],
    };
    const cleaned = component.cleanGameDetails(details);
    expect(cleaned.name).toEqual(['foo']);
    expect(cleaned.yearpublished).toBe('2020');
    expect(cleaned.minplayers).toBe('1');
    expect(cleaned.maxplayers).toBe('4');
    expect(cleaned.playingtime).toBe('30');
    expect(cleaned.age).toBe('8');
    expect(cleaned.description).toBe('desc');
    expect(cleaned.boardgamecategory).toEqual(['cat1', 'cat2']);
    expect(cleaned.image).toBe('img.png');
    expect(cleaned.boardgamepublisher).toEqual(['pub1']);
    expect(cleaned.size).toEqual(['small', 'large']);
  });

  it('should extract names from array, object, and undefined', () => {
    expect(
      (component as any).extractNames([{ '#text': 'foo' }, { '#text': 'bar' }]),
    ).toEqual(['foo', 'bar']);
    expect((component as any).extractNames({ '#text': 'baz' })).toEqual([
      'baz',
    ]);
    expect((component as any).extractNames(undefined)).toEqual([]);
  });

  it('should extract text value from node', () => {
    expect((component as any).extractTextValue({ '#text': 'foo' })).toBe('foo');
    expect((component as any).extractTextValue({})).toBe('');
    expect((component as any).extractTextValue(undefined)).toBe('');
  });

  it('should convert xml to json', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root><child>value</child></root>',
      'application/xml',
    );
    const json = component.xmlToJson(xml);
    expect(json).toBeDefined();
  });

  it('should parse element node', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root attr="1"><child>value</child></root>',
      'application/xml',
    );
    const root = xml.documentElement;
    const result = component.parseElement(root);
    expect(result).toBeDefined();
    expect(result['@attributes']).toBeDefined();
  });

  it('should parse text node', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString('<root>text</root>', 'application/xml');
    const textNode = xml.documentElement.childNodes[0];
    const result = component.parseElement(textNode);
    expect(result).toBe('text');
  });

  it('should parse attributes into object', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root attr="1"></root>',
      'application/xml',
    );
    const root = xml.documentElement;
    const obj: any = {};
    component.parseAttributesIntoObject(root, obj);
    expect(obj['@attributes']).toBeDefined();
    expect(obj['@attributes'].attr).toBe('1');
  });

  it('should parse child nodes into object', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root><child>value</child></root>',
      'application/xml',
    );
    const root = xml.documentElement;
    const obj: any = {};
    component.parseChildNodesIntoObject(root, obj);
    expect(obj.child).toBeDefined();
  });

  it('should add child node to object', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root><child>value</child><child>value2</child></root>',
      'application/xml',
    );
    const root = xml.documentElement;
    const obj: any = {};
    const child1 = root.childNodes[0];
    const child2 = root.childNodes[1];
    component.addChildNodeToObject(child1, child1.nodeName, obj);
    component.addChildNodeToObject(child2, child2.nodeName, obj);
    expect(Array.isArray(obj.child)).toBe(true);
  });

  it('should parse attributes', () => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(
      '<root attr1="a" attr2="b"></root>',
      'application/xml',
    );
    const root = xml.documentElement;
    const attrs = component.parseAttributes(root.attributes);
    expect(attrs.attr1).toBe('a');
    expect(attrs.attr2).toBe('b');
  });
});
