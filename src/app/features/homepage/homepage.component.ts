import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Page d'accueil — placeholder.
 * Sera remplacée par la carte interactive D3.js + contenu riche (T3).
 */
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="homepage">
      <h1 class="homepage__title">Swarm Wiki</h1>
      <p class="homepage__subtitle">
        Documentation technique du pipeline d'agents IA orchestré pour le développement logiciel.
      </p>
      <div class="homepage__cta">
        <a routerLink="/a-propos" class="homepage__link">Découvrir le système →</a>
      </div>
    </section>
  `,
  styles: [
    `
      .homepage {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;
        padding: 80px 0;
      }
      .homepage__title {
        font-family: var(--font-display);
        font-weight: 800;
        font-size: clamp(2.5rem, 5vw, 4rem);
        letter-spacing: -0.03em;
        color: var(--color-text-primary);
        background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .homepage__subtitle {
        font-family: var(--font-body);
        font-size: clamp(1rem, 2vw, 1.25rem);
        color: var(--color-text-secondary);
        max-width: 560px;
        line-height: 1.7;
      }
      .homepage__link {
        display: inline-block;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1rem;
        color: var(--color-accent);
        text-decoration: none;
        padding: 12px 24px;
        border: 1px solid rgba(240, 165, 34, 0.3);
        border-radius: 8px;
        transition: all 200ms ease-out;
      }
      .homepage__link:hover {
        background: rgba(240, 165, 34, 0.08);
        box-shadow: 0 0 20px rgba(240, 165, 34, 0.1);
      }
    `,
  ],
})
export class HomepageComponent {}
