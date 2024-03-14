import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  constructor() {}

  getColor(number: number): string {
    const greenColor = [54, 174, 124];
    const yellowColor = [249, 217, 35];
    const redColor = [235, 83, 83];

    const percentage = (number - 1) / 4;

    let r, g, b;
    if (percentage < 0.5) {
      r = Math.round(
        greenColor[0] + percentage * 2 * (yellowColor[0] - greenColor[0]),
      );
      g = Math.round(
        greenColor[1] + percentage * 2 * (yellowColor[1] - greenColor[1]),
      );
      b = Math.round(
        greenColor[2] + percentage * 2 * (yellowColor[2] - greenColor[2]),
      );
    } else {
      r = Math.round(
        yellowColor[0] +
          (percentage - 0.5) * 2 * (redColor[0] - yellowColor[0]),
      );
      g = Math.round(
        yellowColor[1] +
          (percentage - 0.5) * 2 * (redColor[1] - yellowColor[1]),
      );
      b = Math.round(
        yellowColor[2] +
          (percentage - 0.5) * 2 * (redColor[2] - yellowColor[2]),
      );
    }

    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }
}
