import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { SearchService } from './search.service';
import type { SearchResult } from '@shared/models';

/**
 * Helper : contenu Markdown minimal avec frontmatter.
 */
function mockMarkdown(title: string, description: string): string {
  return `---
title: ${title}
description: ${description}
order: 1
---

# ${title}

Contenu de test pour ${title}.
`;
}

/**
 * Helper : flush toutes les requêtes HTTP vers /content/ avec un mock Markdown.
 */
function flushContentRequests(httpMock: HttpTestingController): void {
  const requests = httpMock.match((req) => req.url.startsWith('/content/'));
  requests.forEach((req) => {
    const path = req.request.url.replace('/content/', '');
    const name = path.split('/').pop()?.replace('.md', '') ?? 'doc';
    req.flush(mockMarkdown(name, `Description pour ${name}`));
  });
}

/**
 * Helper : flush toutes les requêtes HTTP vers /content/ avec une erreur 404.
 */
function flushContentRequestsWithError(httpMock: HttpTestingController): void {
  const requests = httpMock.match((req) => req.url.startsWith('/content/'));
  requests.forEach((req) => {
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
}

describe('SearchService', () => {
  let service: SearchService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        SearchService,
      ],
    });
    service = TestBed.inject(SearchService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ------------------------------------------------------------------
  // Création
  // ------------------------------------------------------------------
  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait avoir isOpen à false initialement', () => {
    expect(service.isOpen()).toBeFalse();
  });

  it('devrait avoir isIndexing à false initialement', () => {
    expect(service.isIndexing()).toBeFalse();
  });

  // ------------------------------------------------------------------
  // open() / close() / toggle()
  // ------------------------------------------------------------------
  it('open() devrait passer isOpen à true', () => {
    service.open();
    expect(service.isOpen()).toBeTrue();
    // Flush les requêtes HTTP déclenchées par loadIndex()
    flushContentRequests(httpMock);
  });

  it('close() devrait passer isOpen à false', () => {
    // On évite d'appeler open() pour ne pas déclencher loadIndex
    service['isOpen'].set(true);
    service.close();
    expect(service.isOpen()).toBeFalse();
  });

  it('toggle() devrait basculer isOpen (false → true → false)', () => {
    expect(service.isOpen()).toBeFalse();
    service.toggle();
    expect(service.isOpen()).toBeTrue();
    // Flush les requêtes déclenchées par le premier toggle (→ open → loadIndex)
    flushContentRequests(httpMock);
    service.toggle();
    expect(service.isOpen()).toBeFalse();
  });

  it('toggle() devrait déclencher loadIndex quand isOpen passe à true', () => {
    expect(service.isIndexing()).toBeFalse();
    service.toggle();
    // loadIndex() est appelé → isIndexing passe à true
    expect(service.isIndexing()).toBeTrue();
    // Flush pour éviter l'erreur httpMock.verify()
    flushContentRequests(httpMock);
  });

  // ------------------------------------------------------------------
  // search()
  // ------------------------------------------------------------------
  it('search() devrait retourner [] si la query fait moins de 2 caractères', () => {
    expect(service.search('')).toEqual([]);
    expect(service.search('a')).toEqual([]);
    expect(service.search('  ')).toEqual([]);
  });

  it('search() devrait retourner [] si l\'index n\'est pas chargé', () => {
    expect(service.search('orchestrateur')).toEqual([]);
  });

  it('search() devrait retourner des résultats après chargement de l\'index', () => {
    service.open();
    flushContentRequests(httpMock);

    // L'index est maintenant chargé
    const results = service.search('orchestrateur');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toBeDefined();
    expect(results[0].route).toBeDefined();
  });

  it('search() devrait respecter le paramètre limit', () => {
    service.open();
    flushContentRequests(httpMock);

    const results = service.search('skill', 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it('search() devrait être insensible à la casse', () => {
    service.open();
    flushContentRequests(httpMock);

    const lower = service.search('orchestrateur');
    const upper = service.search('ORCHESTRATEUR');
    // Fuse.js est insensible à la casse par défaut
    expect(lower.length).toBe(upper.length);
  });

  it('search() devrait retourner [] pour une recherche qui ne matche rien', () => {
    service.open();
    flushContentRequests(httpMock);

    const results = service.search('xyznonexistent12345');
    expect(results).toEqual([]);
  });

  // ------------------------------------------------------------------
  // navigateToResult()
  // ------------------------------------------------------------------
  it('navigateToResult() devrait fermer la modale et naviguer', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl').and.returnValue(
      Promise.resolve(true),
    );

    const result: SearchResult = {
      title: 'Orchestrateur',
      description: 'Agent orchestration',
      route: '/agents/orchestrateur',
      section: 'Agents',
      sourcePath: 'agents/orchestrateur.md',
    };

    // On ouvre la modale sans passer par open() pour éviter loadIndex
    service['isOpen'].set(true);
    service.navigateToResult(result);

    expect(service.isOpen()).toBeFalse();
    expect(navigateSpy).toHaveBeenCalledWith('/agents/orchestrateur');
  });

  // ------------------------------------------------------------------
  // loadIndex() — déjà chargé
  // ------------------------------------------------------------------
  it('loadIndex() ne devrait pas recharger si l\'index est déjà chargé', () => {
    // Premier chargement
    service.open();
    flushContentRequests(httpMock);

    // Fermer et rouvrir : aucun nouvel appel HTTP
    service.close();
    service.open();

    // Aucune requête HTTP supplémentaire ne doit être en attente
    httpMock.expectNone('/content/agents/orchestrateur.md');
  });

  // ------------------------------------------------------------------
  // loadIndex() — déjà en cours
  // ------------------------------------------------------------------
  it('loadIndex() ne devrait pas lancer un deuxième chargement si déjà en cours', () => {
    // Premier open → démarre le chargement
    service.open();
    expect(service.isIndexing()).toBeTrue();

    // Deuxième open → ne change rien
    service.open();
    expect(service.isIndexing()).toBeTrue();

    // Flush les requêtes
    flushContentRequests(httpMock);

    expect(service.isIndexing()).toBeFalse();
  });

  // ------------------------------------------------------------------
  // loadIndex() — fallback en cas d'erreur HTTP
  // ------------------------------------------------------------------
  it('loadIndex() devrait utiliser le fallback du registre en cas d\'erreur réseau', () => {
    service.open();

    // Simuler une erreur sur toutes les requêtes
    flushContentRequestsWithError(httpMock);

    // L'index doit être construit avec les métadonnées du registre (fallback)
    expect(service.isIndexing()).toBeFalse();

    // Recherche avec le titre du fallback (nom de fichier sans .md)
    const results = service.search('orchestrateur');
    expect(results.length).toBeGreaterThan(0);
  });

  // ------------------------------------------------------------------
  // Signal d'indexing pendant le chargement
  // ------------------------------------------------------------------
  it('isIndexing devrait repasser à false après le chargement réussi', () => {
    service.open();
    expect(service.isIndexing()).toBeTrue();

    flushContentRequests(httpMock);

    expect(service.isIndexing()).toBeFalse();
  });
});
