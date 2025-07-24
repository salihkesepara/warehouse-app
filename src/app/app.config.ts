import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import routeConfig from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routeConfig),
    provideAnimationsAsync(),
    provideHttpClient(),
  ],
};
