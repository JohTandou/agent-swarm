import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { SkillDetailComponent } from './skill-detail.component';
import { TocService } from '../../shared/services/toc.service';
import { ContentService } from '../../shared/services/content.service';
import { LanguageService } from '../../shared/services/language.service';
import { provideMarkdown } from 'ngx-markdown';
import type { Skill } from '@shared/models';

const MOCK_SKILLS: Skill[] = [
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    emoji: '🎨',
    description: 'Intelligence de design : 67 styles, 96 palettes.',
    tags: ['design', 'UI', 'UX', 'tailwind'],
    category: 'creation',
    sourcePath: 'skills/ui-ux-pro-max.md',
    order: 1,
  },
  {
    id: 'tests-create',
    name: 'Tests Create',
    emoji: '🧪',
    description: 'Génération de tests unitaires, fonctionnels, E2E.',
    tags: ['tests', 'playwright'],
    category: 'creation',
    sourcePath: 'skills/tests-create.md',
    order: 2,
  },
  {
    id: 'graphify',
    name: 'Graphify',
    emoji: '🕸️',
    description: 'Transforme code et docs en graphes de connaissances.',
    tags: ['graphe', 'analyse', 'visualisation'],
    category: 'audit',
    sourcePath: 'skills/graphify.md',
    order: 3,
  },
];

describe('SkillDetailComponent', () => {
  let component: SkillDetailComponent;
  let fixture: ComponentFixture<SkillDetailComponent>;
  let tocService: TocService;

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
        LanguageService,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: skillId })),
          },
        },
      ],
    }).compileComponents();

    // Spy MUST be set up BEFORE createComponent — the constructor calls loadSkillsManifest()
    const contentService = TestBed.inject(ContentService);
    spyOn(contentService, 'loadSkillsManifest').and.returnValue(of(MOCK_SKILLS));

    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    tocService = TestBed.inject(TocService);
    fixture.detectChanges();
    TestBed.inject(LanguageService).setLang('fr');
  }

  describe('avec un skill valide (ui-ux-pro-max)', () => {
    beforeEach(async () => {
      await setupComponent('ui-ux-pro-max');
    });

    it('devrait créer le composant', () => {
      expect(component).toBeTruthy();
    });

    it("devrait charger un skill par son ID d'URL", () => {
      expect(component.skillId()).toBe('ui-ux-pro-max');
      expect(component.skill()).toBeDefined();
      expect(component.skill()!.name).toBe('UI/UX Pro Max');
    });

    it("devrait avoir un sourcePath pour le Markdown d'un skill valide", () => {
      expect(component.sourcePath()).toBe('skills/ui-ux-pro-max.md');
      expect(component.hasContent()).toBeTrue();
    });

    it('devrait retourner le label de catégorie en français', () => {
      expect(component.getCategoryLabel('creation')).toBe('Création');
    });
  });

  describe("avec un skill invalide", () => {
    beforeEach(async () => {
      await setupComponent('skill-inexistant');
    });

    it("devrait signaler un skill introuvable pour un ID inexistant", () => {
      expect(component.notFound()).toBeTrue();
      expect(component.skill()).toBeUndefined();
    });

    it('devrait avoir sourcePath vide', () => {
      expect(component.sourcePath()).toBe('');
    });
  });

  describe("sans paramètre id (route vide)", () => {
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

      // Spy MUST be set up BEFORE createComponent
      const contentService = TestBed.inject(ContentService);
      spyOn(contentService, 'loadSkillsManifest').and.returnValue(of(MOCK_SKILLS));

      fixture = TestBed.createComponent(SkillDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it("ne devrait pas signaler d'erreur si l'ID est vide", () => {
      expect(component.notFound()).toBeFalse();
    });
  });

  describe('avec le skill tests-create', () => {
    beforeEach(async () => {
      await setupComponent('tests-create');
    });

    it('devrait charger les données de tests-create', () => {
      expect(component.skill()?.name).toBe('Tests Create');
      expect(component.skill()?.emoji).toBe('🧪');
      expect(component.sourcePath()).toBe('skills/tests-create.md');
    });
  });

  describe('avec le skill graphify', () => {
    beforeEach(async () => {
      await setupComponent('graphify');
    });

    it('devrait charger les données de graphify', () => {
      expect(component.skill()?.name).toBe('Graphify');
      expect(component.skill()?.emoji).toBe('🕸️');
      expect(component.skill()?.category).toBe('audit');
    });
  });

  describe('getCategoryLabel', () => {
    beforeEach(async () => {
      await setupComponent('ui-ux-pro-max');
    });

    it('devrait retourner le label français pour chaque catégorie', () => {
      expect(component.getCategoryLabel('creation')).toBe('Création');
      expect(component.getCategoryLabel('audit')).toBe('Audit');
      expect(component.getCategoryLabel('workflow')).toBe('Workflow');
      expect(component.getCategoryLabel('documentation')).toBe('Documentation');
    });
  });
});
