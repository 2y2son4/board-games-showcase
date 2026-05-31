import { ApplicationConfig } from '@angular/core';
import { IMAGE_CONFIG } from '@angular/common';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideHttpClient,
  withFetch,
  withJsonpSupport,
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  // los providers se añadirían al routing
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withJsonpSupport()),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
      },
    },
  ],
};
