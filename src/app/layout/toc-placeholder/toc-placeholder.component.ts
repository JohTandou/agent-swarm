import { Component } from '@angular/core';

/**
 * Placeholder de la Table des Matières (TOC).
 * 220px sticky right, desktop only.
 * Affiche un titre + 3 barres shimmer en attendant l'intégration
 * du service de génération TOC dynamique (T2).
 */
@Component({
  selector: 'app-toc-placeholder',
  standalone: true,
  template: `
    <aside class="toc" aria-label="Table des matières">
      <h4 class="toc__title">Sur cette page</h4>
      <div class="toc__skeleton">
        <div class="toc__bar toc__bar--1"></div>
        <div class="toc__bar toc__bar--2"></div>
        <div class="toc__bar toc__bar--3"></div>
      </div>
    </aside>
  `,
  styles: [
    `
      .toc {
        padding: 16px 0 16px 24px;
      }
      .toc__title {
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        color: var(--color-text-secondary);
        margin-bottom: 16px;
      }
      .toc__skeleton {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .toc__bar {
        height: 8px;
        border-radius: 4px;
      }
      /* Barres shimmer avec largeurs variées */
      .toc__bar--1 {
        width: 85%;
        animation: shimmer 2s ease-in-out infinite;
      }
      .toc__bar--2 {
        width: 60%;
        animation: shimmer 2s ease-in-out 0.2s infinite;
      }
      .toc__bar--3 {
        width: 72%;
        animation: shimmer 2s ease-in-out 0.4s infinite;
      }
    `,
  ],
})
export class TocPlaceholderComponent {}
