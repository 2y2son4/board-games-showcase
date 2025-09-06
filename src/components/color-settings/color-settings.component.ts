import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-color-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './color-settings.component.html',
  styleUrls: ['./color-settings.component.scss'],
})
export class ColorSettingsComponent {
  bgColor = '#000000';
  fontColor = '#ffffff';
  contrastWarning = '';
  commonBgColors = [
    { name: 'White', value: this.getCssVar('--white', '#fff') },
    { name: 'Light Grey', value: this.getCssVar('--light-grey', '#b9b6b6') },
    { name: 'Black', value: this.getCssVar('--black', '#000') },
    { name: 'Hot Pink', value: this.getCssVar('--hot-pink', '#c2185b') },
    { name: 'Deep Purple', value: this.getCssVar('--deep-purple', '#673ab7') },
    { name: 'Indigo', value: '#3f51b5' },
    { name: 'Teal', value: '#009688' },
    { name: 'Lime', value: '#cddc39' },
    { name: 'Yellow', value: '#ffe082' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Blue Gray', value: '#607d8b' },
    { name: 'Dark Gray', value: this.getCssVar('--dark-grey', '#212121') },
  ];
  commonFontColors = [
    { name: 'Black', value: this.getCssVar('--black', '#000') },
    { name: 'White', value: this.getCssVar('--white', '#fff') },
    { name: 'Hot Pink', value: this.getCssVar('--hot-pink', '#c2185b') },
    { name: 'Deep Purple', value: this.getCssVar('--deep-purple', '#673ab7') },
    { name: 'Indigo', value: '#3f51b5' },
    { name: 'Teal', value: '#009688' },
    { name: 'Lime', value: '#cddc39' },
    { name: 'Yellow', value: '#ffe082' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Blue Gray', value: '#607d8b' },
    { name: 'Dark Gray', value: this.getCssVar('--dark-grey', '#212121') },
  ];

  private getCssVar(varName: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return value || fallback;
  }

  constructor(private readonly renderer: Renderer2) {}

  setBgColor(color: string) {
    this.bgColor = color;
    this.renderer.setStyle(document.body, 'background-color', color);
    this.checkContrast();
  }

  setFontColor(color: string) {
    this.fontColor = color;
    this.renderer.setStyle(document.body, 'color', color);
    this.checkContrast();
  }

  // Calculate contrast ratio using WCAG formula
  private hexToRgb(hex: string): [number, number, number] {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((x) => x + x)
        .join('');
    }
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  private luminance(r: number, g: number, b: number): number {
    const a = [r, g, b].map(function (v) {
      v = v / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  private contrastRatio(hex1: string, hex2: string): number {
    const [r1, g1, b1] = this.hexToRgb(hex1);
    const [r2, g2, b2] = this.hexToRgb(hex2);
    const lum1 = this.luminance(r1, g1, b1);
    const lum2 = this.luminance(r2, g2, b2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  checkContrast() {
    const ratio = this.contrastRatio(this.bgColor, this.fontColor);
    if (ratio < 4.5) {
      this.contrastWarning = `⚠️ The contrast ratio (${ratio.toFixed(2)}:1) is too low for accessibility. Please choose a better combination.`;
    } else {
      this.contrastWarning = '';
    }
  }
}
