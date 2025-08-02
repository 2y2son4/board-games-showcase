import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { LoaderService } from '../../core/services/loader/loader.service';
import { BggSearchComponent } from './bgg-search.component';

class HttpClientMock {
  get = jest.fn();
}
class LoaderServiceMock {
  show = jest.fn();
  hide = jest.fn();
}

describe('BggSearchComponent', () => {
  let component: BggSearchComponent;
  let fixture: ComponentFixture<BggSearchComponent>;
  let http: HttpClientMock;
  let loaderService: LoaderServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BggSearchComponent],
      providers: [
        { provide: HttpClient, useClass: HttpClientMock },
        { provide: LoaderService, useClass: LoaderServiceMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BggSearchComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpClient) as any;
    loaderService = TestBed.inject(LoaderService) as any;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loaderService.show and hide, and handle successful search', () => {
    const xmlString =
      '<boardgames><boardgame><name>#text</name><yearpublished>#text</yearpublished></boardgame></boardgames>';
    const response = xmlString;
    http.get.mockReturnValue(of(response));
    jest
      .spyOn(component, 'xmlToJson')
      .mockReturnValue({
        boardgames: {
          '#text': ['a'],
          boardgame: [
            { name: { '#text': 'foo' }, yearpublished: { '#text': '2020' } },
          ],
        },
      });
    jest
      .spyOn(component, 'filterResults')
      .mockReturnValue({
        boardgames: {
          '#text': ['a'],
          boardgame: [
            { name: { '#text': 'foo' }, yearpublished: { '#text': '2020' } },
          ],
        },
      });
    component.searchTerm = 'test';
    component.search();
    expect(loaderService.show).toHaveBeenCalled();
    expect(loaderService.hide).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(component.noResults).toBe(false);
    expect(component.showNumberOfResults).toBe(true);
    expect(component.numberOfResults).toBe(1);
  });

  it('should handle error in search', () => {
    http.get.mockReturnValue(throwError(() => new Error('fail')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    component.searchTerm = 'fail';
    component.search();
    expect(loaderService.show).toHaveBeenCalled();
    expect(component.isLoading).toBe(true);
  });

  it('should handle no results in search', () => {
    const xmlString = '<boardgames></boardgames>';
    http.get.mockReturnValue(of(xmlString));
    jest.spyOn(component, 'xmlToJson').mockReturnValue({ boardgames: {} });
    jest.spyOn(component, 'filterResults').mockReturnValue({ boardgames: {} });
    component.searchTerm = 'none';
    component.search();
    expect(component.noResults).toBe(true);
    expect(component.showNumberOfResults).toBe(false);
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

  it('should filter results', () => {
    const json = {
      boardgames: {
        boardgame: [
          { name: { '#text': 'foo' }, yearpublished: { '#text': '2020' } },
          { name: {}, yearpublished: { '#text': '2020' } },
          { name: { '#text': 'bar' }, yearpublished: {} },
        ],
      },
    };
    const filtered = component.filterResults(JSON.parse(JSON.stringify(json)));
    expect(filtered.boardgames.boardgame.length).toBe(1);
  });

  it('should select game', () => {
    component.selectedGameId = null;
    component.showDetails = false;
    component.selectGame('123');
    expect(component.selectedGameId).toBe('123');
    expect(component.showDetails).toBe(true);
  });
});
