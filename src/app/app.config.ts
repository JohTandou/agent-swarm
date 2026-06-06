import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';

/**
 * Configuration applicative racine.
 * Providers : détection de changement zoneless-compatible, router, HTTP client,
 * et rendu Markdown via ngx-markdown.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(OverlayModule),
    ...provideMarkdown(),
  ],
};
