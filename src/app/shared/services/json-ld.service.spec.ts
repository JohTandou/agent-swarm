import { TestBed } from '@angular/core/testing';
import { JsonLdService } from './json-ld.service';
import type { Breadcrumb } from '@shared/models';

describe('JsonLdService', () => {
  let service: JsonLdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsonLdService],
    });
    service = TestBed.inject(JsonLdService);

    // Nettoie les scripts résiduels entre les tests
    document.querySelectorAll('script[data-swarm-json-ld]').forEach((s) => s.remove());
  });

  afterEach(() => {
    document.querySelectorAll('script[data-swarm-json-ld]').forEach((s) => s.remove());
  });

  it('devrait injecter les scripts JSON-LD dans document.head', () => {
    const schemas = [{ '@type': 'WebSite', name: 'Test' }];
    service.setSchemas(schemas);

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(1);
    expect((scripts[0] as HTMLScriptElement).type).toBe('application/ld+json');
  });

  it('les scripts injectés devraient porter l\'attribut data-swarm-json-ld', () => {
    service.setSchemas([{ '@type': 'WebSite' }]);

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(1);
    expect(scripts[0].hasAttribute('data-swarm-json-ld')).toBe(true);
  });

  it('devrait supprimer les scripts existants avant d\'injecter de nouveaux schémas', () => {
    service.setSchemas([{ '@type': 'WebSite' }]);
    service.setSchemas([{ '@type': 'Organization' }]);

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(1);

    const content = JSON.parse(scripts[0].textContent ?? '{}');
    expect(content['@type']).toBe('Organization');
  });

  it('clearAll devrait supprimer tous les scripts', () => {
    service.setSchemas([{ '@type': 'WebSite' }, { '@type': 'Organization' }]);
    service.clearAll();

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(0);
  });

  it('BreadcrumbList devrait avoir la bonne structure (position commence à 1)', () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Accueil', route: '/' },
      { label: 'Agents', route: '/agents' },
      { label: 'Orchestrateur' },
    ];

    const schema = service.generateBreadcrumbListSchema(breadcrumbs) as Record<string, unknown>;
    const items = schema['itemListElement'] as Array<Record<string, unknown>>;

    expect(items.length).toBe(3);
    expect(items[0]['position']).toBe(1);
    expect(items[1]['position']).toBe(2);
    expect(items[2]['position']).toBe(3);
  });

  it('le dernier élément du BreadcrumbList ne devrait pas avoir item', () => {
    const breadcrumbs: Breadcrumb[] = [
      { label: 'Accueil', route: '/' },
      { label: 'Agents' },
    ];

    const schema = service.generateBreadcrumbListSchema(breadcrumbs) as Record<string, unknown>;
    const items = schema['itemListElement'] as Array<Record<string, unknown>>;

    expect(items[0]['item']).toBeDefined();
    expect(items[1]['item']).toBeUndefined();
  });

  it('generateWebSiteSchema devrait retourner un schéma valide avec SearchAction', () => {
    const schema = service.generateWebSiteSchema() as Record<string, unknown>;
    expect(schema['@type']).toBe('WebSite');
    expect(schema['potentialAction']).toBeDefined();
  });

  it('generateOrganizationSchema devrait retourner un schéma valide', () => {
    const schema = service.generateOrganizationSchema() as Record<string, unknown>;
    expect(schema['@type']).toBe('Organization');
    expect(schema['founder']).toBeDefined();
  });

  /* ==========================================================================
   * Tests addSchemas
   * ========================================================================== */

  it('addSchemas devrait ajouter des scripts sans effacer les existants', () => {
    service.setSchemas([{ '@type': 'WebSite' }]);
    service.addSchemas([{ '@type': 'Organization' }]);

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(2);

    const firstContent = JSON.parse(scripts[0].textContent ?? '{}');
    const secondContent = JSON.parse(scripts[1].textContent ?? '{}');
    expect(firstContent['@type']).toBe('WebSite');
    expect(secondContent['@type']).toBe('Organization');
  });

  it('addSchemas devrait ajouter plusieurs schémas à la fois', () => {
    service.setSchemas([{ '@type': 'WebSite' }]);
    service.addSchemas([{ '@type': 'Organization' }, { '@type': 'Person' }]);

    const scripts = document.querySelectorAll('script[data-swarm-json-ld]');
    expect(scripts.length).toBe(3);

    const types = Array.from(scripts).map(
      (s) => JSON.parse((s as HTMLScriptElement).textContent ?? '{}')['@type'],
    );
    expect(types).toEqual(['WebSite', 'Organization', 'Person']);
  });

  /* ==========================================================================
   * Tests générateurs de schémas
   * ========================================================================== */

  it('generateTechArticleSchema devrait retourner un schéma TechArticle valide', () => {
    const schema = service.generateTechArticleSchema({
      headline: 'Orchestrateur — Agent IA de classification',
      description: 'Point d\'entrée unique de la Swarm.',
      authorName: 'Joh Tandou',
      authorUrl: 'https://github.com/JohTandou',
      datePublished: '2025-05-15',
      image: 'https://swarm-wiki.vercel.app/assets/og-image.png',
      url: 'https://swarm-wiki.vercel.app/agents/orchestrateur',
    }) as Record<string, unknown>;

    expect(schema['@type']).toBe('TechArticle');
    expect(schema['headline']).toBe('Orchestrateur — Agent IA de classification');
    expect(schema['author']).toBeDefined();
    expect((schema['author'] as Record<string, unknown>)['@type']).toBe('Person');
    expect((schema['author'] as Record<string, unknown>)['name']).toBe('Joh Tandou');
    expect(schema['datePublished']).toBe('2025-05-15');
    expect(schema['image']).toBeDefined();
  });

  it('generateItemListSchema devrait retourner un schéma ItemList valide', () => {
    const schema = service.generateItemListSchema([
      { name: 'Orchestrateur', url: '/agents/orchestrateur', description: 'Tech Lead' },
      { name: 'Front', url: '/agents/front' },
    ]) as Record<string, unknown>;

    expect(schema['@type']).toBe('ItemList');
    const items = schema['itemListElement'] as Array<Record<string, unknown>>;
    expect(items.length).toBe(2);
    expect(items[0]['position']).toBe(1);
    expect(items[0]['name']).toBe('Orchestrateur');
    expect(items[0]['description']).toBe('Tech Lead');
    expect(items[1]['position']).toBe(2);
    expect(items[1]['description']).toBeUndefined();
  });

  it('generateHowToSchema devrait retourner un schéma HowTo valide avec étapes', () => {
    const schema = service.generateHowToSchema({
      name: 'Pipeline de développement Swarm',
      description: 'Étapes du pipeline agentic de bout en bout.',
      steps: [
        { name: 'Pre-search', text: 'Analyse du codebase en parallèle.' },
        { name: 'Classification', text: 'L\'orchestrateur classifie la tâche.' },
      ],
    }) as Record<string, unknown>;

    expect(schema['@type']).toBe('HowTo');
    expect(schema['name']).toBe('Pipeline de développement Swarm');
    const steps = schema['step'] as Array<Record<string, unknown>>;
    expect(steps.length).toBe(2);
    expect(steps[0]['@type']).toBe('HowToStep');
    expect(steps[0]['position']).toBe(1);
    expect(steps[0]['name']).toBe('Pre-search');
    expect(steps[1]['position']).toBe(2);
  });

  it('generatePersonSchema devrait retourner un schéma Person pour Joh Tandou', () => {
    const schema = service.generatePersonSchema() as Record<string, unknown>;

    expect(schema['@type']).toBe('Person');
    expect(schema['name']).toBe('Joh Tandou');
    expect(schema['url']).toBe('https://github.com/JohTandou');
    expect(schema['jobTitle']).toBe('Architecte du système Swarm');
    expect(schema['description']).toContain('pipeline d\'agents IA');
  });
});
