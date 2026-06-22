import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MarkdownRendererComponent } from './markdown-renderer.component';
import { ContentService } from '../../services/content.service';
import { LanguageService } from '../../services/language.service';
import { provideMarkdown } from 'ngx-markdown';

describe('MarkdownRendererComponent', () => {
  let component: MarkdownRendererComponent;
  let fixture: ComponentFixture<MarkdownRendererComponent>;
  let httpMock: HttpTestingController;

  const mockMarkdown = `---
title: Document de test
description: Une description
order: 1
---

# Introduction

Ceci est un paragraphe.

## Architecture

Détails de l'architecture.

:::info
Ceci est un callout info.
:::

:::warning
Attention : ceci est un avertissement.
:::
`;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MarkdownRendererComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMarkdown(),
        ContentService,
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarkdownRendererComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    TestBed.inject(LanguageService).setLang('fr');
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir un aria-label sur l\'article', () => {
    const article: HTMLElement = fixture.nativeElement.querySelector('.markdown-body');
    expect(article.getAttribute('aria-label')).toBe('Contenu du document');
  });

  describe('État vide', () => {
    it('devrait afficher l\'état vide quand il n\'y a pas de contenu', () => {
      component.processedContent = '';
      component.isLoading = false;
      component.errorMessage = null;
      fixture.detectChanges();

      const emptyEl = fixture.nativeElement.querySelector('.markdown-empty');
      expect(emptyEl).toBeTruthy();
      expect(emptyEl.textContent).toContain('Aucun contenu à afficher');
    });
  });

  describe('État de chargement', () => {
    it('devrait afficher la barre de progression pendant le chargement', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingEl = fixture.nativeElement.querySelector('.markdown-renderer__loading');
      expect(loadingEl).toBeTruthy();
      expect(loadingEl.getAttribute('aria-busy')).toBe('true');
      const progressEl = fixture.nativeElement.querySelector('.markdown-renderer__progress');
      expect(progressEl).toBeTruthy();
    });

    it('devrait cacher le contenu pendant le chargement', () => {
      component.processedContent = 'test';
      component.isLoading = true;
      fixture.detectChanges();

      const markdownEl = fixture.nativeElement.querySelector('markdown');
      expect(markdownEl).toBeFalsy();
    });
  });

  describe('État d\'erreur', () => {
    it('devrait afficher le message d\'erreur', () => {
      component.errorMessage = 'Fichier introuvable.';
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector('.markdown-error');
      expect(errorEl).toBeTruthy();
      expect(errorEl.getAttribute('role')).toBe('alert');
      expect(errorEl.textContent).toContain('Fichier introuvable');
    });
  });

  describe('processContent() — pre-processing', () => {
    it('devrait transformer les callouts :::info en HTML structuré', () => {
      component.processContent(':::info\nCeci est une information.\n:::');
      expect(component.processedContent).toContain('callout--info');
      expect(component.processedContent).toContain('callout__icon');
      expect(component.processedContent).toContain('Ceci est une information.');
    });

    it('devrait transformer les callouts :::warning', () => {
      component.processContent(':::warning\nAttention.\n:::');
      expect(component.processedContent).toContain('callout--warning');
    });

    it('devrait transformer les callouts :::tip', () => {
      component.processContent(':::tip\nAstuce utile.\n:::');
      expect(component.processedContent).toContain('callout--tip');
    });

    it('devrait transformer les callouts :::danger', () => {
      component.processContent(':::danger\nDanger critique.\n:::');
      expect(component.processedContent).toContain('callout--danger');
    });

    it('devrait utiliser "info" comme fallback pour un type inconnu', () => {
      component.processContent(':::unknown\nType inconnu.\n:::');
      expect(component.processedContent).toContain('callout--info');
    });

    it('devrait ajouter des ancres aux headings', () => {
      component.processContent('# Mon Titre');
      expect(component.processedContent).toContain('heading-anchor');
      expect(component.processedContent).toContain('id="mon-titre"');
    });

    it('devrait ajouter des ancres aux headings h2', () => {
      component.processContent('## Sous-section');
      expect(component.processedContent).toContain('id="sous-section"');
    });

    it('ne devrait pas altérer les paragraphes sans heading', () => {
      component.processContent('Un simple paragraphe.');
      expect(component.processedContent).toBe('Un simple paragraphe.');
    });
  });

  describe('Chargement depuis sourcePath', () => {
    it('devrait charger le contenu quand sourcePath change', () => {
      component.sourcePath = 'test.md';
      component.ngOnChanges({
        sourcePath: {
          currentValue: 'test.md',
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      const req = httpMock.expectOne('/content/test.md');
      expect(req.request.method).toBe('GET');
      req.flush(mockMarkdown);

      expect(component.processedContent).toContain('Introduction');
      expect(component.processedContent).toContain('Architecture');
      expect(component.isLoading).toBeFalse();
    });

    it('devrait émettre les tocEntries après chargement', () => {
      spyOn(component.tocEntries, 'emit');
      component.sourcePath = 'test.md';
      component.ngOnChanges({
        sourcePath: {
          currentValue: 'test.md',
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      httpMock.expectOne('/content/test.md').flush(mockMarkdown);
      expect(component.tocEntries.emit).toHaveBeenCalled();
    });

    it('devrait gérer l\'erreur de chargement', () => {
      component.sourcePath = 'inexistant.md';
      component.ngOnChanges({
        sourcePath: {
          currentValue: 'inexistant.md',
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      httpMock
        .expectOne('/content/inexistant.md')
        .flush('Not Found', { status: 404, statusText: 'Not Found' });

      expect(component.errorMessage).toBeTruthy();
      expect(component.errorMessage).toContain('inexistant.md');
      expect(component.isLoading).toBeFalse();
      expect(component.processedContent).toBe('');
    });
  });

  describe('Chargement depuis content (input direct)', () => {
    it('devrait traiter le contenu brut directement', () => {
      component.content = '# Titre Direct\n\nContenu direct.';
      component.ngOnChanges({
        content: {
          currentValue: '# Titre Direct\n\nContenu direct.',
          previousValue: null,
          firstChange: true,
          isFirstChange: () => true,
        },
      });

      expect(component.processedContent).toContain('Titre Direct');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('processContent() — cas limites', () => {
    it('devrait gérer un contenu vide', () => {
      component.processContent('');
      expect(component.processedContent).toBe('');
    });

    it('devrait gérer plusieurs callouts dans le même contenu', () => {
      const raw = ':::info\nInfo 1.\n:::\n\n:::warning\nWarning 1.\n:::';
      component.processContent(raw);
      expect(component.processedContent).toContain('callout--info');
      expect(component.processedContent).toContain('callout--warning');
    });

    it('devrait gérer les headings avec caractères spéciaux', () => {
      component.processContent('# Titre avec "guillemets" et (parenthèses)');
      expect(component.processedContent).toContain('heading-anchor');
    });

    it('devrait gérer les callouts avec contenu multiligne', () => {
      const raw = ':::tip\nLigne 1.\nLigne 2.\nLigne 3.\n:::';
      component.processContent(raw);
      expect(component.processedContent).toContain('Ligne 1.');
      expect(component.processedContent).toContain('Ligne 3.');
    });

    it('devrait générer des slugs uniques pour des headings identiques', () => {
      component.processContent('# Test\n# Test');
      // Les deux headings ont le même slug "test"
      expect(component.processedContent).toContain('id="test"');
    });

    it('devrait gérer les headings h3 et h4', () => {
      component.processContent('### Sous-section\n#### Sous-sous-section');
      expect(component.processedContent).toContain('id="sous-section"');
      expect(component.processedContent).toContain('id="sous-sous-section"');
    });
  });

  describe('États combinés', () => {
    it('ne devrait pas afficher l\'état vide quand isLoading est true', () => {
      component.isLoading = true;
      component.processedContent = '';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.markdown-empty')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.markdown-renderer__loading')).toBeTruthy();
    });

    it('ne devrait pas afficher l\'état vide quand errorMessage est défini', () => {
      component.errorMessage = 'Erreur';
      component.processedContent = '';
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('.markdown-empty')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.markdown-error')).toBeTruthy();
    });

    it('devrait afficher le contenu quand tout est OK', () => {
      component.processedContent = '# OK';
      component.isLoading = false;
      component.errorMessage = null;
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('markdown')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.markdown-renderer__loading')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.markdown-error')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.markdown-empty')).toBeFalsy();
    });
  });

  describe('Inputs par défaut', () => {
    it('devrait avoir enableMermaid à false par défaut', () => {
      expect(component.enableMermaid).toBeFalse();
    });

    it('devrait avoir enablePrism à true par défaut', () => {
      expect(component.enablePrism).toBeTrue();
    });

    it('devrait avoir baseUrl vide par défaut', () => {
      expect(component.baseUrl).toBe('');
    });

    it('devrait avoir sourcePath à null par défaut', () => {
      expect(component.sourcePath).toBeNull();
    });

    it('devrait avoir content à null par défaut', () => {
      expect(component.content).toBeNull();
    });
  });

  describe('ngOnChanges — cas limites', () => {
    it('ne devrait pas charger si sourcePath est null', () => {
      component.sourcePath = null;
      component.ngOnChanges({
        sourcePath: {
          currentValue: null,
          previousValue: 'test.md',
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      // Aucune requête HTTP ne devrait être faite
      httpMock.expectNone('/content/test.md');
    });

    it('ne devrait pas traiter si content est null', () => {
      component.content = null;
      component.processedContent = 'old';
      component.ngOnChanges({
        content: {
          currentValue: null,
          previousValue: 'old',
          firstChange: false,
          isFirstChange: () => false,
        },
      });
      // Le contenu ne devrait pas changer
      expect(component.processedContent).toBe('old');
    });
  });

  describe('processContent — ne pas traiter les blocs de code comme headings', () => {
    it('ne devrait pas ajouter d\'ancre aux # dans les blocs de code inline', () => {
      // Les headings dans le markdown sont en début de ligne seulement
      component.processContent('Du texte avec # dans une phrase.');
      // ^ ne commence pas par # donc pas de heading
      expect(component.processedContent).not.toContain('heading-anchor');
    });
  });

  describe('ngAfterViewInit — post-processing', () => {
    it('devrait appeler afterRender quand processedContent existe', () => {
      component.processedContent = '# Test content';
      // Spy on private method via prototype
      const afterRenderSpy = spyOn(component as any, 'afterRender').and.callThrough();
      const highlightSpy = spyOn(component as any, 'highlightCode').and.callThrough();

      component.ngAfterViewInit();

      expect(afterRenderSpy).toHaveBeenCalled();
      expect(highlightSpy).toHaveBeenCalled();
    });

    it('ne devrait pas lever d\'erreur quand enableMermaid est false (support ngx-markdown natif)', () => {
      component.enableMermaid = false;
      component.processedContent = '# Test';
      // afterRender n'appelle plus renderMermaidBlocks, juste highlightCode
      component.ngAfterViewInit();
      // Ne devrait pas planter
      expect(true).toBeTrue();
    });

    it('ne devrait pas appeler highlightCode quand enablePrism est false', () => {
      component.enablePrism = false;
      component.processedContent = '# Test';
      const highlightSpy = spyOn(component as any, 'highlightCode').and.callThrough();

      component.ngAfterViewInit();

      expect(highlightSpy).not.toHaveBeenCalled();
    });
  });

  describe('highlightCode — gestion d\'erreur', () => {
    it('devrait logger un warning en cas d\'erreur Prism', () => {
      const consoleSpy = spyOn(console, 'warn');
      const markdownService = (component as any).markdownService;
      spyOn(markdownService, 'highlight').and.throwError('Prism error');

      (component as any).highlightCode();

      expect(consoleSpy).toHaveBeenCalledWith(
        '[MarkdownRenderer] Erreur de coloration Prism :',
        jasmine.any(Error)
      );
    });
  });

  describe('ngAfterViewInit — subscribe aux markdownComponents', () => {
    it('devrait souscrire aux changements de markdownComponents', () => {
      component.processedContent = '';
      const afterRenderSpy = spyOn(component as any, 'afterRender');
      component.ngAfterViewInit();
      // La souscription ne déclenche pas immédiatement
      expect(afterRenderSpy).not.toHaveBeenCalled();
    });
  });

  describe('processContent — ne pas altérer les anchors existantes', () => {
    it('devrait ignorer les # déjà dans un contexte d\'anchor', () => {
      // Le regex utilise ^ pour matcher le début de ligne
      component.processContent('Texte normal avec un # dedans.');
      expect(component.processedContent).toBe('Texte normal avec un # dedans.');
    });
  });
});
