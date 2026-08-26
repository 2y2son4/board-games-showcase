import { HighlightTextPipe } from './highlight-text.pipe';

describe('HighlightTextPipe', () => {
  let pipe: HighlightTextPipe;

  beforeEach(() => {
    pipe = new HighlightTextPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should escape regex special characters in the search term', () => {
    const result = pipe.transform('A (great) game', '(');
    expect(result).toContain('<span class="highlight">(</span>');
  });

  it('should escape html from input value', () => {
    const result = pipe.transform('<img src=x onerror=alert(1)> game', 'game');
    expect(result).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(result).toContain('<span class="highlight">game</span>');
  });
});
