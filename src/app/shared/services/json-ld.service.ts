import { Injectable } from '@angular/core';
import type { Breadcrumb } from '@shared/models';

/**
 * Service de gestion des scripts JSON-LD pour le SEO.
 * Injecte et nettoie les données structurées Schema.org
 * dans des balises <script type="application/ld+json">.
 */
@Injectable({ providedIn: 'root' })
export class JsonLdService {
  /** Attribut HTML utilisé pour identifier les scripts JSON-LD injectés par ce service */
  private readonly ATTR = 'data-swarm-json-ld';

  /** URL de base du site */
  private readonly BASE_URL = 'https://swarm-wiki.vercel.app';

  /**
   * Injecte un script JSON-LD dans le <head> du document.
   * @param schema Objet Schema.org à sérialiser
   */
  private injectScript(schema: object): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(this.ATTR, '');
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }

  /**
   * Supprime tous les scripts JSON-LD précédemment injectés par ce service.
   */
  private removeAllScripts(): void {
    const scripts = document.querySelectorAll(`script[${this.ATTR}]`);
    scripts.forEach((script) => script.remove());
  }

  /**
   * Génère le schéma WebSite avec SearchAction pour la page d'accueil.
   * @returns Objet Schema.org WebSite
   */
  generateWebSiteSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: this.BASE_URL,
      name: 'Swarm Wiki',
      description: 'Wiki technique du système Swarm — pipeline d\'agents IA orchestré pour le développement logiciel.',
      potentialAction: {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          urlTemplate: `${this.BASE_URL}/?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Génère le schéma Organization pour l'auteur du wiki.
   * @returns Objet Schema.org Organization
   */
  generateOrganizationSchema(): object {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Swarm Wiki',
      url: this.BASE_URL,
      description: 'Documentation technique du système Swarm — pipeline d\'agents IA pour le développement logiciel.',
      founder: {
        '@type': 'Person',
        name: 'Joh Tandou',
      },
      knowsAbout: [
        'Intelligence Artificielle',
        'Développement Logiciel',
        'Pipeline CI/CD',
        'Agents Autonomes',
      ],
    };
  }

  /**
   * Génère le schéma BreadcrumbList à partir du fil d'Ariane courant.
   * @param breadcrumbs Liste des segments du fil d'Ariane
   * @returns Objet Schema.org BreadcrumbList
   */
  generateBreadcrumbListSchema(breadcrumbs: Breadcrumb[]): object {
    const items = breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: crumb.label,
      item: crumb.route != null
        ? (crumb.route === '/' ? this.BASE_URL : `${this.BASE_URL}${crumb.route}`)
        : undefined,
    }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items,
    };
  }

  /**
   * Remplace tous les scripts JSON-LD actuels par une nouvelle liste de schémas.
   * @param schemas Liste d'objets Schema.org à injecter
   */
  setSchemas(schemas: object[]): void {
    this.removeAllScripts();
    for (const schema of schemas) {
      this.injectScript(schema);
    }
  }

  /**
   * Supprime tous les scripts JSON-LD sans en réinjecter.
   */
  clearAll(): void {
    this.removeAllScripts();
  }
}
