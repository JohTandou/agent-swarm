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
});
