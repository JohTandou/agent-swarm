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
import type { Skill } from '@shared/models';

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
      const skillData = component.skill() as Skill;
      expect(component.getCategoryLabel(skillData.category)).toBe('Création');
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
      expect(component.skill()?.category).toBe('analyse');
    });
  });

  describe('getCategoryLabel', () => {
    beforeEach(async () => {
      await setupComponent('ui-ux-pro-max');
    });

    it('devrait retourner le label français pour chaque catégorie', () => {
      expect(component.getCategoryLabel('création')).toBe('Création');
      expect(component.getCategoryLabel('qualité')).toBe('Qualité');
      expect(component.getCategoryLabel('analyse')).toBe('Analyse');
    });
  });
});
