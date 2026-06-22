import { Injectable, ErrorHandler } from '@angular/core';

/**
 * Gestionnaire global d'erreurs pour Swarm Wiki.
 * Capture les erreurs non gérées et les loggue en console.
 * V1 : log console uniquement. Extensible pour Sentry/analytics.
 */
@Injectable({ providedIn: 'root' })
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    console.error('[Swarm Wiki] Erreur non gérée —', error);
  }
}
