import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import type { SeoConfig } from '@shared/models';

/**
 * Service de gestion SEO pour le Swarm Wiki.
 * Met à jour les balises <title>, <meta>, Open Graph et Twitter Card
 * via les API natives Angular Title et Meta.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly SUFFIX = ' — Swarm Wiki';

  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
  ) {}

  /**
   * Met à jour toutes les métadonnées SEO de la page courante.
   * Nettoie automatiquement le titre avant de le suffixer.
   *
   * @param config Configuration SEO de la page
   */
  updatePageMeta(config: SeoConfig): void {
    const cleanedTitle = this.stripSuffix(config.title);
    const fullTitle = `${cleanedTitle}${this.SUFFIX}`;

    // Titre de la page
    this.title.setTitle(fullTitle);

    // Meta description
    this.meta.updateTag({ name: 'description', content: config.description });

    // Meta author (optionnel)
    if (config.author) {
      this.meta.updateTag({ name: 'author', content: config.author });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }
    this.meta.updateTag({ property: 'og:type', content: config.type ?? 'website' });
    if (config.canonicalUrl) {
      this.meta.updateTag({ property: 'og:url', content: config.canonicalUrl });
    } else {
      this.meta.updateTag({ property: 'og:url', content: window.location.href });
    }

    // Twitter Card
    const twitterCard = config.image ? 'summary_large_image' : 'summary';
    this.meta.updateTag({ name: 'twitter:card', content: twitterCard });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
  }

  /**
   * Nettoie le titre en retirant le suffixe Swarm Wiki s'il est déjà présent.
   * Évite la duplication : "Accueil — Swarm Wiki — Swarm Wiki".
   */
  private stripSuffix(title: string): string {
    if (title.endsWith(this.SUFFIX)) {
      return title.slice(0, -this.SUFFIX.length).trimEnd();
    }
    return title.trimEnd();
  }
}
