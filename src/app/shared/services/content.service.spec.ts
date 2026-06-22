import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ContentService } from './content.service';
import { LanguageService } from './language.service';
import type { MarkdownDocument } from '@shared/models';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  const mockMarkdown = `---
title: Document de test
description: Une description de test
order: 1
---

# Introduction

Ceci est un paragraphe d'introduction.

## Architecture

Le système est composé de plusieurs couches.

### Frontend

Le frontend utilise Angular 19.

## Déploiement

Déploiement via Vercel.
`;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ContentService,
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '', setLang: () => {} } },
      ],
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait charger et parser un document Markdown complet', (done) => {
    service.loadDocument('test.md').subscribe((doc: MarkdownDocument) => {
      expect(doc.frontmatter.title).toBe('Document de test');
      expect(doc.frontmatter.description).toBe('Une description de test');
      expect(doc.frontmatter.order).toBe(1);
      expect(doc.sourcePath).toBe('test.md');
      expect(doc.content).not.toContain('---');
      expect(doc.content).toContain('# Introduction');
      expect(doc.tocEntries.length).toBeGreaterThan(0);
      done();
    });

    const req = httpMock.expectOne('/content/test.md');
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('text');
    req.flush(mockMarkdown);
  });

  it('devrait gérer un document sans frontmatter', (done) => {
    service.loadDocument('sans-fm.md').subscribe((doc: MarkdownDocument) => {
      expect(doc.frontmatter.title).toBe('');
      expect(doc.frontmatter.description).toBe('');
      expect(doc.frontmatter.order).toBe(0);
      expect(doc.content).toContain('# Sans Frontmatter');
      done();
    });

    httpMock.expectOne('/content/sans-fm.md').flush('# Sans Frontmatter\n\nDu contenu.');
  });

  it('devrait lever une erreur pour un fichier introuvable (404)', (done) => {
    service.loadDocument('inexistant.md').subscribe({
      next: () => fail('Ne devrait pas réussir'),
      error: (err) => {
        expect(err.message).toContain('inexistant.md');
        done();
      },
    });

    httpMock
      .expectOne('/content/inexistant.md')
      .flush('Not Found', { status: 404, statusText: 'Not Found' });
  });

  it('extractHeadings() devrait construire la hiérarchie correcte', () => {
    const content = `# H1\n## H2A\n### H3\n## H2B`;
    const headings = service.extractHeadings(content);
    expect(headings.length).toBe(1);
    expect(headings[0].text).toBe('H1');
    expect(headings[0].level).toBe(1);
    expect(headings[0].children?.length).toBe(2);
    expect(headings[0].children?.[0].text).toBe('H2A');
    expect(headings[0].children?.[0].children?.[0].text).toBe('H3');
  });

  it('flattenHeadings() devrait aplatir en TocEntry[]', () => {
    const content = `# Intro\n## Section\n### Détail\n# Suite\n## Suite Section`;
    const headings = service.extractHeadings(content);
    const toc = service.flattenHeadings(headings);
    expect(toc.length).toBe(2); // 2 H1
    expect(toc[0].label).toBe('Intro');
    expect(toc[0].level).toBe(1);
    expect(toc[1].label).toBe('Suite');
  });

  it('generateSlug() devrait générer un slug valide', () => {
    expect(service.generateSlug('Mon Titre !')).toBe('mon-titre');
    expect(service.generateSlug('Été 2024')).toBe('ete-2024');
    expect(service.generateSlug('Déjà vu — section')).toBe('deja-vu-section');
  });

  it('devrait gérer un YAML invalide sans planter', (done) => {
    const badYaml = `---
title: "Titre
description: cassé
---
# Contenu`;

    service.loadDocument('bad-yaml.md').subscribe((doc: MarkdownDocument) => {
      expect(doc.frontmatter.title).toBe('');
      expect(doc.content).toContain('# Contenu');
      done();
    });

    httpMock.expectOne('/content/bad-yaml.md').flush(badYaml);
  });
});
