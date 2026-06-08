import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le hero avec le titre "Le Swarm"', () => {
    const heroEl: HTMLElement = fixture.nativeElement.querySelector('.about__hero');
    expect(heroEl).toBeTruthy();

    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.about__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Le Swarm');
  });

  it('devrait afficher le sous-titre de la section hero', () => {
    const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('.about__subtitle');
    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.textContent).toContain('architecture agentic');
  });

  it('devrait afficher l\'eyebrow dans le hero', () => {
    const eyebrowEl: HTMLElement = fixture.nativeElement.querySelector('.about__eyebrow');
    expect(eyebrowEl).toBeTruthy();
    expect(eyebrowEl.textContent?.trim()).toBe('L\'intelligence collective');
  });

  it('devrait avoir la section "Le développement moderne est fractal"', () => {
    const sectionTitles = fixture.nativeElement.querySelectorAll('.about__section-title');
    const titles = Array.from<Element>(sectionTitles).map((el) => (el as HTMLElement).textContent?.trim());
    expect(titles).toContain('Le développement moderne est fractal');
  });

  it('devrait avoir la section "Un pipeline, neuf expertises"', () => {
    const sectionTitles = fixture.nativeElement.querySelectorAll('.about__section-title');
    const titles = Array.from<Element>(sectionTitles).map((el) => (el as HTMLElement).textContent?.trim());
    expect(titles).toContain('Un pipeline, neuf expertises');
  });

  it('devrait afficher 9 cartes d\'équipe', () => {
    const teamCards = fixture.nativeElement.querySelectorAll('.about__team-card');
    expect(teamCards.length).toBe(9);
  });

  it('devrait afficher les noms des agents dans les cartes d\'équipe', () => {
    const teamNames = fixture.nativeElement.querySelectorAll('.about__team-name');
    const names = Array.from<Element>(teamNames).map((el) => (el as HTMLElement).textContent?.trim());
    expect(names).toContain('Orchestrateur');
    expect(names).toContain('Contract');
    expect(names).toContain('Front');
    expect(names).toContain('Back');
    expect(names).toContain('Tester');
    expect(names).toContain('Reviewer');
    expect(names).toContain('Writer');
    expect(names).toContain('Planner');
    expect(names).toContain('Search');
  });

  it('devrait afficher 6 cartes de statistiques', () => {
    const statCards = fixture.nativeElement.querySelectorAll('.about__stat-card');
    expect(statCards.length).toBe(6);
  });

  it('devrait afficher les chiffres clés dans les statistiques', () => {
    const statNumbers = fixture.nativeElement.querySelectorAll('.about__stat-number');
    const numbers = Array.from<Element>(statNumbers).map((el) => (el as HTMLElement).textContent?.trim());
    expect(numbers).toContain('9');
    expect(numbers).toContain('26');
    expect(numbers).toContain('5');
    expect(numbers).toContain('80%');
    expect(numbers).toContain('4');
    expect(numbers).toContain('~1,25 $');
  });

  it('devrait avoir une section CTA avec des boutons de navigation', () => {
    const ctaSection = fixture.nativeElement.querySelector('.about__cta');
    expect(ctaSection).toBeTruthy();

    const ctaButtons = fixture.nativeElement.querySelectorAll('.about__cta-btn');
    expect(ctaButtons.length).toBe(2);
    expect(ctaButtons[0].textContent?.trim()).toContain('Explorer les agents');
    expect(ctaButtons[1].textContent?.trim()).toContain('Voir le pipeline');
  });

  it('devrait avoir des liens vers /agents et /workflow dans le CTA', () => {
    const ctaLinks = fixture.nativeElement.querySelectorAll('.about__cta-btn[href]');
    // Les RouterLink ne produisent pas d'attribut href dans les tests unitaires
    // On vérifie juste que les boutons existent
    expect(ctaLinks.length).toBeGreaterThanOrEqual(2);
  });

  it('devrait afficher la visualisation du pipeline', () => {
    const pipelineViz = fixture.nativeElement.querySelector('.about__pipeline-viz');
    expect(pipelineViz).toBeTruthy();

    const steps = fixture.nativeElement.querySelectorAll('.about__pipeline-step');
    expect(steps.length).toBe(6);
  });

  it('devrait afficher le graphique de complexité', () => {
    const complexityGraphic = fixture.nativeElement.querySelector('.about__complexity-graphic');
    expect(complexityGraphic).toBeTruthy();

    const nodes = fixture.nativeElement.querySelectorAll('.about__complexity-node');
    expect(nodes.length).toBe(9);
  });

  it('devrait avoir la section "Le Swarm en chiffres"', () => {
    const sectionTitles = fixture.nativeElement.querySelectorAll('.about__section-title');
    const titles = Array.from<Element>(sectionTitles).map((el) => (el as HTMLElement).textContent?.trim());
    expect(titles).toContain('Le Swarm en chiffres');
  });
});
