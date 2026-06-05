import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { SkillDetailComponent } from './skill-detail.component';
import type { Skill } from '@shared/models';

describe('SkillDetailComponent', () => {
  let component: SkillDetailComponent;
  let fixture: ComponentFixture<SkillDetailComponent>;

  function createComponent(paramId: string): void {
    TestBed.configureTestingModule({
      imports: [SkillDetailComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', paramId]])),
          },
        },
      ],
    }).compileComponents();
  }

  it('devrait créer le composant', async () => {
    await createComponent('ui-ux-pro-max');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it("devrait charger un skill par son ID d'URL", async () => {
    await createComponent('ui-ux-pro-max');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.skillId()).toBe('ui-ux-pro-max');
    expect(component.skill()).toBeDefined();
    expect(component.skill()!.name).toBe('UI/UX Pro Max');
  });

  it("devrait signaler un skill introuvable pour un ID inexistant", async () => {
    await createComponent('skill-inexistant');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.notFound()).toBeTrue();
    expect(component.skill()).toBeUndefined();
  });

  it("ne devrait pas signaler d'erreur si l'ID est vide", async () => {
    await createComponent('');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.notFound()).toBeFalse();
  });

  it("devrait avoir un sourcePath pour le Markdown d'un skill valide", async () => {
    await createComponent('tests-create');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.sourcePath()).toBe('skills/tests-create.md');
    expect(component.hasContent()).toBeTrue();
  });

  it('devrait retourner le label de catégorie en français', async () => {
    await createComponent('graphify');
    fixture = TestBed.createComponent(SkillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const skillData = component.skill() as Skill;
    expect(component.getCategoryLabel(skillData.category)).toBe('Analyse');
  });
});
