import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightText',
  standalone: true,
})
export class HighlightTextPipe implements PipeTransform {
  transform(value: string | null | undefined, searchTerm: string): string {
    const safeValue = this.#escapeHtml(value ?? '');

    if (!searchTerm || searchTerm.trim() === '') {
      return safeValue;
    }

    const regex = new RegExp(this.#escapeRegExp(searchTerm.trim()), 'ig');
    return safeValue.replace(
      regex,
      (match) => `<span class="highlight">${match}</span>`,
    );
  }

  #escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  #escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
