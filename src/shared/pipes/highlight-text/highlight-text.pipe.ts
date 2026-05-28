import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
  standalone: true,
})
export class HighlightTextPipe implements PipeTransform {
  transform(value: string, searchTerm: string): string {
    if (!searchTerm || searchTerm.trim() === '') {
      return value;
    }

    const regex = new RegExp(searchTerm, 'ig');
    return value.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`,
    );
  }
}
