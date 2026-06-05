import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SkillDetailComponent } from './skill-detail.component';
import { TocService } from '../../shared/services/toc.service';
import { ContentService } from '../../shared/services/content.service';
import { provideMarkdown } from 'ngx-markdown';

describe('SkillDetailComponent', () => {
  let component: SkillDetailComponent;
  let fixture: ComponentFixture<SkillDetailComponent>;
  let tocService: TocService;

  /**
   * Helper pour créer le composant avec un ID de skill spécifique dans la route.
   */
  async function setupComponent(skillId: string): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [SkillDetailComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideMarkdown(),
        ContentService,
        TocService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: skillId })),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    tocService = TestBed.inject(TocService);
    fixture.detectChanges();
  }

  // === TESTS AVEC SKILL VALIDE ===
  describe('avec un skill valide (ui-ux-pro-max)', () => {
    beforeEach(async () => {
      await setupComponent('ui-ux-pro-max');
    });

    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it('devrait avoir le bon skillId', () => {
      expect(component.skillId()).toBe('ui-ux-pro-max');
    });

    it('devrait trouver le skill dans la map', () => {
      expect(component.skill()).toBeDefined();
      expect(component.skill()?.name).toBe('UI/UX Pro Max');
      expect(component.skill()?.emoji).toBe('🎨');
    });

    it('ne devrait pas être en état notFound', () => {
      expect(component.notFound()).toBeFalse();
    });

    it('devrait avoir un sourcePath valide', () => {
      expect(component.sourcePath()).toBe('skills/ui-ux-pro-max.md');
    });

    it('should have hasContent = true', () => {
      expect(component.hasContent()).toBeTrue();
    });

    it('devrait afficher le nom du skill dans le header', () => {
      const nameEl = fixture.nativeElement.querySelector('.skill-detail__name');
      expect(nameEl).toBeTruthy();
      expect(nameEl.textContent?.trim()).toBe('UI/UX Pro Max');
    });

    it('devrait afficher l\'emoji du skill', () => {
      const emojiEl = fixture.nativeElement.querySelector('.skill-detail__emoji');
      expect(emojiEl).toBeTruthy();
      expect(emojiEl.textContent?.trim()).toBe('🎨');
    });

    it('devrait afficher la description du skill', () => {
      const descEl = fixture.nativeElement.querySelector('.skill-detail__description');
      expect(descEl).toBeTruthy();
      expect(descEl.textContent).toContain('Intelligence de design');
    });

    it('devrait afficher la catégorie', () => {
      const catEl = fixture.nativeElement.querySelector('.skill-detail__category');
      expect(catEl).toBeTruthy();
      expect(catEl.textContent?.trim()).toBe('Création');
    });

    it('devrait avoir un fil d\'ariane avec lien retour vers /skills', () => {
      const breadcrumbLink = fixture.nativeElement.querySelector('.skill-detail__breadcrumb-link');
      expect(breadcrumbLink).toBeTruthy();
      expect(breadcrumbLink.getAttribute('href')).toBe('/skills');
    });

    it('devrait avoir le composant markdown-renderer', () => {
      const renderer = fixture.nativeElement.querySelector('app-markdown-renderer');
      expect(renderer).toBeTruthy();
    });

    it('devrait avoir un lien de retour au catalogue dans le footer', () => {
      const backLink = fixture.nativeElement.querySelector('.skill-detail__back');
      expect(backLink).toBeTruthy();
      expect(backLink.getAttribute('href')).toBe('/skills');
      expect(backLink.textContent?.trim()).toContain('Retour au catalogue');
    });

    it('devrait appeler tocService.clear() à l\'initialisation', () => {
      expect(tocService.entries()).toEqual([]);
    });

    it('devrait mettre à jour les entrées TOC via onTocEntries', () => {
      const entries = [
        { id: 'role', label: 'Rôle', level: 2 as const },
        { id: 'cas-usage', label: 'Cas d\'usage', level: 2 as const },
      ];
      component.onTocEntries(entries);
      expect(tocService.entries()).toEqual(entries);
      expect(tocService.entries().length).toBe(2);
    });
  });

  // === TESTS AVEC LE SKILL GRAPHIFY ===
  describe('avec le skill graphify', () => {
    beforeEach(async () => {
      await setupComponent('graphify');
    });

    it('devrait charger les données du graphify', () => {
      expect(component.skill()?.name).toBe('Graphify');
      expect(component.skill()?.emoji).toBe('🕸️');
      expect(component.skill()?.category).toBe('workflow');
      expect(component.sourcePath()).toBe('skills/graphify.md');
    });

    it('devrait afficher la catégorie Workflow', () => {
      const catEl = fixture.nativeElement.querySelector('.skill-detail__category');
      expect(catEl).toBeTruthy();
      expect(catEl.textContent?.trim()).toBe('Workflow');
    });
  });

  // === TESTS AVEC LE SKILL TESTS-CREATE ===
  describe('avec le skill tests-create', () => {
    beforeEach(async () => {
      await setupComponent('tests-create');
    });

    it('devrait charger les données du tests-create', () => {
      expect(component.skill()?.name).toBe('Tests Create');
      expect(component.skill()?.emoji).toBe('🧪');
      expect(component.skill()?.category).toBe('creation');
    });
  });

  // === TESTS AVEC SKILL INVALIDE (404) ===
  describe('avec un skill invalide', () => {
    beforeEach(async () => {
      await setupComponent('skill-inexistant');
    });

    it('devrait être en état notFound', () => {
      expect(component.notFound()).toBeTrue();
    });

    it('devrait avoir skill = undefined', () => {
      expect(component.skill()).toBeUndefined();
    });

    it('devrait avoir sourcePath vide', () => {
      expect(component.sourcePath()).toBe('');
    });

    it('should have hasContent = false', () => {
      expect(component.hasContent()).toBeFalse();
    });

    it('devrait afficher le message "Skill introuvable"', () => {
      const errorEl = fixture.nativeElement.querySelector('.skill-detail__error');
      expect(errorEl).toBeTruthy();
      const title = fixture.nativeElement.querySelector('.skill-detail__error-title');
      expect(title).toBeTruthy();
      expect(title.textContent?.trim()).toBe('Skill introuvable');
    });

    it('devrait afficher l\'ID invalide dans le message d\'erreur', () => {
      const errorText = fixture.nativeElement.querySelector('.skill-detail__error-text');
      expect(errorText).toBeTruthy();
      expect(errorText.textContent).toContain('skill-inexistant');
    });

    it('devrait proposer un lien retour vers le catalogue', () => {
      const link = fixture.nativeElement.querySelector('.skill-detail__error-link');
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/skills');
    });

    it('ne devrait pas afficher le header skill', () => {
      const header = fixture.nativeElement.querySelector('.skill-detail__header');
      expect(header).toBeFalsy();
    });

    it('ne devrait pas afficher le markdown renderer', () => {
      const renderer = fixture.nativeElement.querySelector('app-markdown-renderer');
      expect(renderer).toBeFalsy();
    });
  });

  // === TESTS SANS ID (route vide) ===
  describe('sans paramètre id (route vide)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SkillDetailComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting(),
          provideMarkdown(),
          ContentService,
          TocService,
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of(convertToParamMap({})),
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SkillDetailComponent);
      component = fixture.componentInstance;
      tocService = TestBed.inject(TocService);
      fixture.detectChanges();
    });

    it('devrait avoir skillId vide', () => {
      expect(component.skillId()).toBe('');
    });

    it('ne devrait pas être en notFound (pas encore)', () => {
      expect(component.notFound()).toBeFalse();
    });

    it('devrait avoir skill = undefined', () => {
      expect(component.skill()).toBeUndefined();
    });
  });

  // === TESTS DES MÉTHODES UTILITAIRES ===
  describe('getCategoryLabel', () => {
    beforeEach(async () => {
      await setupComponent('ui-ux-pro-max');
    });

    it('devrait retourner le label français', () => {
      expect(component.getCategoryLabel('audit')).toBe('Audit');
      expect(component.getCategoryLabel('creation')).toBe('Création');
      expect(component.getCategoryLabel('workflow')).toBe('Workflow');
      expect(component.getCategoryLabel('documentation')).toBe('Documentation');
    });
  });
});
