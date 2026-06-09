import { ApplicationConfig, ErrorHandler, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideMarkdown, MERMAID_OPTIONS } from 'ngx-markdown';
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
    ...provideMarkdown({
      mermaidOptions: {
        provide: MERMAID_OPTIONS,
        useValue: {
          darkMode: true,
          themeVariables: {
            primaryColor: '#1C1812',
            primaryTextColor: '#F5F0EB',
            primaryBorderColor: 'rgba(122,136,153,0.3)',
            lineColor: '#7A8899',
            secondaryColor: '#28231C',
            tertiaryColor: '#0E0C09',
          },
        },
      },
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
};
