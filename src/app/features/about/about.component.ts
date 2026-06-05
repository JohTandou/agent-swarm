import { Component } from '@angular/core';

/**
 * Page "À propos" — placeholder.
 * Contenu riche à venir (T4).
 */
@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <section class="about">
      <h1 class="about__title">À propos du Swarm</h1>
      <p class="about__description">
        Le Swarm est un pipeline d'agents IA spécialisés qui collaborent pour concevoir,
        implémenter, tester et documenter des projets logiciels de bout en bout.
      </p>
      <div class="about__meta">
        <span class="about__stat"><strong>9</strong> agents spécialisés</span>
        <span class="about__stat"><strong>26</strong> skills disponibles</span>
        <span class="about__stat"><strong>4</strong> catégories MCP</span>
      </div>
    </section>
  `,
  styles: [
    `
      .about {
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 64px 0;
      }
      .about__title {
        font-family: var(--font-display);
        font-weight: 800;
        font-size: clamp(2rem, 4vw, 3rem);
        letter-spacing: -0.03em;
        color: var(--color-text-primary);
      }
      .about__description {
        font-family: var(--font-body);
        font-size: 1.125rem;
        color: var(--color-text-secondary);
        max-width: 600px;
        line-height: 1.7;
      }
      .about__meta {
        display: flex;
        gap: 32px;
        flex-wrap: wrap;
      }
      .about__stat {
        font-family: var(--font-display);
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        letter-spacing: 0.03em;
        text-transform: uppercase;
      }
      .about__stat strong {
        display: block;
        font-size: 2rem;
        font-weight: 800;
        color: var(--color-accent);
        letter-spacing: -0.02em;
      }
    `,
  ],
})
export class AboutComponent {}
