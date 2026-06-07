import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkillsListComponent } from './skills-list.component';

describe('SkillsListComponent', () => {
  let component: SkillsListComponent;
  let fixture: ComponentFixture<SkillsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsListComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir 3 skills', () => {
    expect(component.skills.length).toBe(3);
  });

  it('devrait avoir 3 catégories de filtre', () => {
    expect(component.categories.length).toBe(3);
  });

  it('devrait retourner tous les skills par défaut (pas de filtre)', () => {
    expect(component.filteredSkills().length).toBe(3);
  });

  it('devrait filtrer par catégorie création', () => {
    component.toggleCategory('création');
    fixture.detectChanges();
    expect(component.filteredSkills().length).toBe(1);
    expect(component.filteredSkills()[0].id).toBe('ui-ux-pro-max');
  });

  it('devrait filtrer par catégorie qualité', () => {
    component.toggleCategory('qualité');
    fixture.detectChanges();
    expect(component.filteredSkills().length).toBe(1);
    expect(component.filteredSkills()[0].id).toBe('tests-create');
  });

  it('devrait filtrer par catégorie analyse', () => {
    component.toggleCategory('analyse');
    fixture.detectChanges();
    expect(component.filteredSkills().length).toBe(1);
    expect(component.filteredSkills()[0].id).toBe('graphify');
  });

  it('devrait désactiver le filtre si on clique deux fois', () => {
    component.toggleCategory('création');
    fixture.detectChanges();
    component.toggleCategory('création');
    fixture.detectChanges();
    expect(component.activeCategory()).toBeNull();
    expect(component.filteredSkills().length).toBe(3);
  });

  it('la première carte devrait avoir la classe --featured', () => {
    const firstCard = fixture.nativeElement.querySelector('.skills__card');
    expect(firstCard).toBeTruthy();
    expect(firstCard.classList.contains('skills__card--featured')).toBeTrue();
  });

  it('devrait retourner le label de catégorie', () => {
    expect(component.getCategoryLabel('création')).toBe('Création');
    expect(component.getCategoryLabel('qualité')).toBe('Qualité');
    expect(component.getCategoryLabel('analyse')).toBe('Analyse');
  });

  it('devrait compter les skills par catégorie', () => {
    expect(component.getCategoryCount('création')).toBe(1);
    expect(component.getCategoryCount('qualité')).toBe(1);
    expect(component.getCategoryCount('analyse')).toBe(1);
  });
});
