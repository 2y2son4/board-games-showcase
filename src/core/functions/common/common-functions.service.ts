import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  constructor() {}

  getComplexityColor(number: number): string {
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

  getRateColor(number: number): string {
    const greyColor = [46, 46, 46];
    const greenColor = [54, 174, 124];
    const blueColor = [60, 76, 167];

    const percentage = (number - 1) / 9; // Adjusted for range 1 to 10

    let r, g, b;
    if (percentage < 0.5) {
      r = Math.round(
        greyColor[0] + percentage * 2 * (blueColor[0] - greyColor[0]),
      );
      g = Math.round(
        greyColor[1] + percentage * 2 * (blueColor[1] - greyColor[1]),
      );
      b = Math.round(
        greyColor[2] + percentage * 2 * (blueColor[2] - greyColor[2]),
      );
    } else {
      r = Math.round(
        blueColor[0] + (percentage - 0.5) * 2 * (greenColor[0] - blueColor[0]),
      );
      g = Math.round(
        blueColor[1] + (percentage - 0.5) * 2 * (greenColor[1] - blueColor[1]),
      );
      b = Math.round(
        blueColor[2] + (percentage - 0.5) * 2 * (greenColor[2] - blueColor[2]),
      );
    }

    const colorHex =
      '#' + ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');

    return colorHex;
  }
}
