import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideMarkdown } from 'ngx-markdown';
import { GlobalErrorHandler } from './shared/services/error-handler.service';

import { routes } from './app.routes';

/**
 * Configuration applicative racine.
 * Providers : détection de changement zoneless-compatible, router, HTTP client,
 * rendu Markdown via ngx-markdown, et gestionnaire global d'erreurs.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom(OverlayModule),
    ...provideMarkdown(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
