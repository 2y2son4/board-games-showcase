import { Injectable } from '@angular/core';
import { GameCard } from '../../../components/commons.models';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  constructor() {}

  /** Background color */
  getComplexityColor(number: number): string {
    const greenColor = [54, 174, 124];
    const yellowColor = [249, 217, 35];
    const redColor = [235, 83, 83];

    const percentage = (number - 1) / 4;

    const interpolateColor = (
      color1: number[],
      color2: number[],
      factor: number,
    ) => {
      return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
    };

    let r, g, b;
    if (percentage < 0.5) {
      [r, g, b] = interpolateColor(greenColor, yellowColor, percentage * 2);
    } else {
      [r, g, b] = interpolateColor(
        yellowColor,
        redColor,
        (percentage - 0.5) * 2,
      );
    }

    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }

  getRatingColor(number: number): string {
    const greyColor = [46, 46, 46];
    const greenColor = [54, 174, 124];
    const blueColor = [60, 76, 167];

    const percentage = (number - 1) / 9;

    let r, g, b;
    const interpolateColor = (
      color1: number[],
      color2: number[],
      factor: number,
    ) => {
      return color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
    };

    if (percentage < 0.5) {
      [r, g, b] = interpolateColor(greyColor, blueColor, percentage * 2);
    } else {
      [r, g, b] = interpolateColor(
        blueColor,
        greenColor,
        (percentage - 0.5) * 2,
      );
    }

    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }

  extractUniqueValues(
    listData: GameCard[],
    propertyName: keyof GameCard,
  ): string[] {
    const uniqueValues = new Set<string>();

    listData.forEach((game) => {
      const valueOrArray = game[propertyName];

      if (Array.isArray(valueOrArray)) {
        valueOrArray.forEach((value) => {
          const stringValue = String(value);
          if (stringValue) {
            uniqueValues.add(stringValue);
          }
        });
      } else {
        const stringValue = String(valueOrArray);
        if (stringValue) {
          uniqueValues.add(stringValue);
        }
      }
    });

    return Array.from(uniqueValues).sort((a, b) => a.localeCompare(b));
  }
}
