import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TableOfContentsComponent } from './table-of-contents.component';
import { TocService } from '../../services/toc.service';
import { LanguageService } from '../../services/language.service';
import type { TocEntry } from '@shared/models';

describe('TableOfContentsComponent', () => {
  let component: TableOfContentsComponent;
  let fixture: ComponentFixture<TableOfContentsComponent>;
  let tocService: TocService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOfContentsComponent],
      providers: [
        TocService,
        LanguageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableOfContentsComponent);
    component = fixture.componentInstance;
    tocService = TestBed.inject(TocService);
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "Sur cette page"', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.toc__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('Sur cette page');
  });

  it('devrait avoir un aria-label "Table des matières" sur le aside', () => {
    const aside: HTMLElement = fixture.nativeElement.querySelector('.toc');
    expect(aside.getAttribute('aria-label')).toBe('Table des matières');
  });

  describe('État vide', () => {
    it('devrait afficher le message d\'état vide quand il n\'y a pas d\'entrées', () => {
      tocService.setEntries([]);
      fixture.detectChanges();
      const emptyEl = fixture.nativeElement.querySelector('.toc__empty');
      expect(emptyEl).toBeTruthy();
      const emptyText = fixture.nativeElement.querySelector('.toc__empty-text');
      expect(emptyText.textContent?.trim()).toBe('Aucune section détectée');
    });

    it('ne devrait pas afficher la navigation quand il n\'y a pas d\'entrées', () => {
      tocService.setEntries([]);
      fixture.detectChanges();
      const nav = fixture.nativeElement.querySelector('.toc__nav');
      expect(nav).toBeFalsy();
    });
  });

  describe('Affichage hiérarchique', () => {
    const entries: TocEntry[] = [
      { id: 'intro', label: 'Introduction', level: 1 },
      {
        id: 'archi',
        label: 'Architecture',
        level: 1,
        children: [
          { id: 'front', label: 'Frontend', level: 2 },
          { id: 'back', label: 'Backend', level: 2 },
        ],
      },
      { id: 'deploiement', label: 'Déploiement', level: 1 },
    ];

    beforeEach(() => {
      tocService.setEntries(entries);
      fixture.detectChanges();
    });

    it('devrait afficher toutes les entrées de niveau 1', () => {
      const items = fixture.nativeElement.querySelectorAll('.toc__list > .toc__item');
      expect(items.length).toBe(3);
    });

    it('devrait afficher les sous-entrées pour les entrées avec enfants', () => {
      const sublists = fixture.nativeElement.querySelectorAll('.toc__sublist');
      expect(sublists.length).toBe(1);
      const subItems = sublists[0].querySelectorAll('.toc__item');
      expect(subItems.length).toBe(2);
    });

    it('devrait afficher les labels corrects', () => {
      const links = fixture.nativeElement.querySelectorAll('.toc__link');
      const labels = Array.from(links).map((l) => (l as Element).textContent?.trim());
      expect(labels).toContain('Introduction');
      expect(labels).toContain('Architecture');
      expect(labels).toContain('Frontend');
      expect(labels).toContain('Backend');
      expect(labels).toContain('Déploiement');
    });

    it('devrait avoir des href corrects pointant vers les ancres', () => {
      const links = fixture.nativeElement.querySelectorAll('.toc__link');
      const firstLink = links[0] as HTMLAnchorElement;
      expect(firstLink.getAttribute('href')).toBe('#intro');
    });
  });

  describe('État actif', () => {
    const entries: TocEntry[] = [
      { id: 'intro', label: 'Introduction', level: 1 },
      { id: 'archi', label: 'Architecture', level: 1 },
    ];

    beforeEach(() => {
      tocService.setEntries(entries);
    });

    it('devrait surligner l\'entrée active', () => {
      tocService.setActiveId('archi');
      fixture.detectChanges();
      const activeLink = fixture.nativeElement.querySelector('.toc__link--active');
      expect(activeLink).toBeTruthy();
      expect(activeLink.textContent?.trim()).toBe('Architecture');
    });

    it('ne devrait rien surligner quand l\'ID actif est vide', () => {
      tocService.setActiveId('');
      fixture.detectChanges();
      const activeLink = fixture.nativeElement.querySelector('.toc__link--active');
      expect(activeLink).toBeFalsy();
    });
  });

  describe('getIndent()', () => {
    it('devrait retourner 0 pour le niveau 1', () => {
      expect(component.getIndent(1)).toBe(0);
    });

    it('devrait retourner 16 pour le niveau 2', () => {
      expect(component.getIndent(2)).toBe(16);
    });

    it('devrait retourner 32 pour le niveau 3', () => {
      expect(component.getIndent(3)).toBe(32);
    });

    it('devrait retourner 0 pour un niveau inconnu', () => {
      expect(component.getIndent(99)).toBe(0);
    });
  });

  describe('getLevelClass()', () => {
    it('devrait retourner une classe basée sur le niveau', () => {
      expect(component.getLevelClass(1)).toBe('toc__link--level-1');
      expect(component.getLevelClass(2)).toBe('toc__link--level-2');
      expect(component.getLevelClass(3)).toBe('toc__link--level-3');
    });
  });

  describe('scrollTo()', () => {
    it('devrait appeler tocService.setActiveId avec l\'ID fourni', () => {
      const spy = spyOn(tocService, 'setActiveId');
      component.scrollTo('intro');
      expect(spy).toHaveBeenCalledWith('intro');
    });
  });

  describe('scrollTo() — interaction DOM', () => {
    const entries: TocEntry[] = [
      { id: 'intro', label: 'Introduction', level: 1 },
      { id: 'archi', label: 'Architecture', level: 1 },
    ];

    beforeEach(() => {
      tocService.setEntries(entries);
      fixture.detectChanges();
    });

    it('devrait défiler vers le heading quand l\'ancre existe', () => {
      // Créer un heading avec une ancre dans le DOM
      const mainContent = document.createElement('div');
      mainContent.id = 'main-content';
      const h2 = document.createElement('h2');
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.id = 'archi';
      h2.appendChild(anchor);
      mainContent.appendChild(h2);
      document.body.appendChild(mainContent);

      const scrollSpy = spyOn(h2, 'scrollIntoView');
      component.scrollTo('archi');

      expect(scrollSpy).toHaveBeenCalled();
      expect(tocService.activeId()).toBe('archi');

      document.body.removeChild(mainContent);
    });

    it('devrait faire le fallback vers l\'ancre si pas de heading parent', () => {
      const anchor = document.createElement('a');
      anchor.id = 'intro-only';
      document.body.appendChild(anchor);

      const scrollSpy = spyOn(anchor, 'scrollIntoView');
      component.scrollTo('intro-only');

      expect(scrollSpy).toHaveBeenCalled();

      document.body.removeChild(anchor);
    });

    it('ne devrait pas planter si l\'élément n\'existe pas', () => {
      expect(() => component.scrollTo('inexistant-id')).not.toThrow();
    });
  });

  describe('ngOnDestroy', () => {
    it('devrait déconnecter l\'observer', () => {
      // Créer un observer mock
      const mockObserver = { disconnect: jasmine.createSpy('disconnect') };
      (component as any).observer = mockObserver;

      component.ngOnDestroy();

      expect(mockObserver.disconnect).toHaveBeenCalled();
      expect((component as any).observer).toBeNull();
    });

    it('devrait gérer un observer null', () => {
      (component as any).observer = null;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Réactivité — changement d\'entrées', () => {
    it('devrait mettre à jour l\'affichage quand les entrées changent', () => {
      tocService.setEntries([{ id: 'intro', label: 'Introduction', level: 1 }]);
      fixture.detectChanges();

      let items = fixture.nativeElement.querySelectorAll('.toc__item');
      expect(items.length).toBe(1);

      // Ajouter plus d'entrées
      tocService.setEntries([
        { id: 'intro', label: 'Introduction', level: 1 },
        { id: 'archi', label: 'Architecture', level: 1 },
        { id: 'deploy', label: 'Déploiement', level: 1 },
      ]);
      fixture.detectChanges();

      items = fixture.nativeElement.querySelectorAll('.toc__list > .toc__item');
      expect(items.length).toBe(3);
    });

    it('devrait revenir à l\'état vide quand on clear le service', () => {
      tocService.setEntries([{ id: 'intro', label: 'Introduction', level: 1 }]);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.toc__nav')).toBeTruthy();

      tocService.clear();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.toc__nav')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.toc__empty')).toBeTruthy();
    });
  });

  describe('observeHeadings — scroll-spy interne', () => {
    it('devrait observer les headings dans #main-content', () => {
      const mainContent = document.createElement('div');
      mainContent.id = 'main-content';
      const h1 = document.createElement('h1');
      const anchor1 = document.createElement('a');
      anchor1.className = 'heading-anchor';
      anchor1.id = 'section-1';
      h1.appendChild(anchor1);
      mainContent.appendChild(h1);

      const h2 = document.createElement('h2');
      const anchor2 = document.createElement('a');
      anchor2.className = 'heading-anchor';
      anchor2.id = 'section-2';
      h2.appendChild(anchor2);
      mainContent.appendChild(h2);

      document.body.appendChild(mainContent);

      // Mock de l'observer pour tester observeHeadings
      const mockObserve = jasmine.createSpy('observe');
      const mockObserver = { observe: mockObserve, disconnect: jasmine.createSpy('disconnect') };
      (component as any).observer = mockObserver;

      (component as any).observeHeadings();

      // Les h1 et h2 devraient être observés
      expect(mockObserve).toHaveBeenCalledTimes(2);

      // Nettoyage
      document.body.removeChild(mainContent);
    });

    it('ne devrait rien faire si l\'observer est null', () => {
      (component as any).observer = null;
      expect(() => (component as any).observeHeadings()).not.toThrow();
    });

    it('ne devrait rien faire si #main-content n\'existe pas', () => {
      const mockObserve = jasmine.createSpy('observe');
      const mockObserver = { observe: mockObserve, disconnect: jasmine.createSpy('disconnect') };
      (component as any).observer = mockObserver;

      // S'assurer que main-content n'existe pas
      const existing = document.getElementById('main-content');
      if (existing) existing.remove();

      (component as any).observeHeadings();
      expect(mockObserve).not.toHaveBeenCalled();
    });
  });

  describe('IntersectionObserver — setupScrollSpy', () => {
    let originalIO: typeof IntersectionObserver | undefined;

    beforeEach(() => {
      originalIO = (window as any).IntersectionObserver;
    });

    afterEach(() => {
      (window as any).IntersectionObserver = originalIO;
    });

    it('devrait configurer un IntersectionObserver avec les bonnes options', () => {
      let capturedOptions: any = null;

      class MockIntersectionObserver {
        constructor(_callback: unknown, options?: unknown) {
          capturedOptions = options ?? null;
        }
        observe() {}
        disconnect() {}
      }
      (window as any).IntersectionObserver = MockIntersectionObserver;

      (component as any).observer = null;
      (component as any).setupScrollSpy();

      expect(capturedOptions?.rootMargin).toBe('-64px 0px -20% 0px');
      expect(capturedOptions?.threshold).toEqual([0, 0.5]);
      expect((component as any).observer).toBeDefined();
    });

    it('ne devrait pas planter si IntersectionObserver est undefined', () => {
      (component as any).observer = null;
      delete (window as any).IntersectionObserver;

      expect(() => (component as any).setupScrollSpy()).not.toThrow();
      expect((component as any).observer).toBeNull();
    });
  });

  describe('scrollTo — vérification du flag programmatique', () => {
    beforeEach(() => {
      tocService.setEntries([{ id: 'intro', label: 'Introduction', level: 1 }]);
      fixture.detectChanges();
    });

    it('devrait activer le flag isScrollingProgrammatically', () => {
      const anchor = document.createElement('a');
      anchor.id = 'intro';
      document.body.appendChild(anchor);

      component.scrollTo('intro');
      expect((component as any).isScrollingProgrammatically).toBeTrue();

      document.body.removeChild(anchor);
    });
});

  describe('IntersectionObserver callback — branches', () => {
    let observerCallback: Function;
    let originalIO: typeof IntersectionObserver | undefined;

    beforeEach(() => {
      originalIO = (window as any).IntersectionObserver;

      class MockIntersectionObserver {
        constructor(cb: Function) {
          observerCallback = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }

      (window as any).IntersectionObserver = MockIntersectionObserver;
      component.ngOnInit();
    });

    afterEach(() => {
      (window as any).IntersectionObserver = originalIO;
      (component as any).observer?.disconnect();
      (component as any).observer = null;
    });

    it('ne devrait pas traiter les entrées quand isScrollingProgrammatically est true', () => {
      (component as any).isScrollingProgrammatically = true;
      const spy = spyOn(tocService, 'setActiveId');

      observerCallback([{ isIntersecting: true, boundingClientRect: { top: 0 }, target: document.createElement('div') }]);

      expect(spy).not.toHaveBeenCalled();
    });

    it('ne devrait pas appeler setActiveId si aucune entrée n\'est visible', () => {
      (component as any).isScrollingProgrammatically = false;
      const spy = spyOn(tocService, 'setActiveId');

      observerCallback([{ isIntersecting: false, boundingClientRect: { top: 0 }, target: document.createElement('div') }]);

      expect(spy).not.toHaveBeenCalled();
    });

    it('devrait gérer un heading sans .heading-anchor', () => {
      (component as any).isScrollingProgrammatically = false;
      const spy = spyOn(tocService, 'setActiveId');
      const heading = document.createElement('h2');
      // Pas de .heading-anchor enfant

      observerCallback([{ isIntersecting: true, boundingClientRect: { top: 10 }, target: heading }]);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('IntersectionObserver callback — anchor avec ID vide', () => {
    let observerCallback: Function;
    let originalIO: typeof IntersectionObserver | undefined;

    beforeEach(() => {
      originalIO = (window as any).IntersectionObserver;

      class MockIntersectionObserver {
        constructor(cb: Function) {
          observerCallback = cb;
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }

      (window as any).IntersectionObserver = MockIntersectionObserver;
      component.ngOnInit();
    });

    afterEach(() => {
      (window as any).IntersectionObserver = originalIO;
      (component as any).observer?.disconnect();
      (component as any).observer = null;
    });

    it('ne devrait pas appeler setActiveId si anchorEl.id est vide', () => {
      (component as any).isScrollingProgrammatically = false;
      const spy = spyOn(tocService, 'setActiveId');

      const heading = document.createElement('h2');
      const anchor = document.createElement('a');
      anchor.className = 'heading-anchor';
      anchor.id = '';
      heading.appendChild(anchor);

      observerCallback([{ isIntersecting: true, boundingClientRect: { top: 10 }, target: heading }]);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});


