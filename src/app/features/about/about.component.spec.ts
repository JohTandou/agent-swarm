import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "À propos du Swarm"', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.about__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('À propos du Swarm');
  });

  it('devrait afficher la description', () => {
    const descEl: HTMLElement = fixture.nativeElement.querySelector('.about__description');
    expect(descEl).toBeTruthy();
    expect(descEl.textContent?.trim()).toContain('Le Swarm est un pipeline d\'agents IA');
  });

  it('devrait afficher les 3 statistiques', () => {
    const stats = fixture.nativeElement.querySelectorAll('.about__stat');
    expect(stats.length).toBe(3);
    expect(stats[0].textContent?.trim()).toContain('9');
    expect(stats[0].textContent?.trim()).toContain('agents spécialisés');
    expect(stats[1].textContent?.trim()).toContain('26');
    expect(stats[1].textContent?.trim()).toContain('skills disponibles');
    expect(stats[2].textContent?.trim()).toContain('4');
    expect(stats[2].textContent?.trim()).toContain('catégories MCP');
  });

  it('devrait afficher les chiffres en strong avec la couleur accent', () => {
    const strongEls = fixture.nativeElement.querySelectorAll('.about__stat strong');
    expect(strongEls.length).toBe(3);
    expect(strongEls[0].textContent?.trim()).toBe('9');
    expect(strongEls[1].textContent?.trim()).toBe('26');
    expect(strongEls[2].textContent?.trim()).toBe('4');
  });
});
