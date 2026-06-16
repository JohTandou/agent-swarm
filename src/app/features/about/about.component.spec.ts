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

  it('devrait afficher le hero avec le titre "la Swarm"', () => {
    const heroEl: HTMLElement = fixture.nativeElement.querySelector('.about__hero');
    expect(heroEl).toBeTruthy();

    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.about__title');
    expect(titleEl).toBeTruthy();
    expect((titleEl.textContent ?? '').replace(/\u00A0/g, ' ')).toContain('La Swarm');
  });

  it('devrait afficher le sous-titre de la section hero', () => {
    const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('.about__subtitle');
    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.textContent).toContain('architecture agentique');
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

  it('devrait afficher 6 cartes de statistiques', () => {
    const statCards = fixture.nativeElement.querySelectorAll('.about__stat-card');
    expect(statCards.length).toBe(6);
  });

  it('devrait afficher les chiffres clés dans les statistiques', () => {
    const statNumbers = fixture.nativeElement.querySelectorAll('.about__stat-number');
    const numbers = Array.from<Element>(statNumbers).map((el) => (el as HTMLElement).textContent?.trim());
    expect(numbers).toContain('9');
    expect(numbers).toContain('3');
    expect(numbers).toContain('5');
    expect(numbers).toContain('80%');
    expect(numbers).toContain('6');
    expect(numbers).toContain('~0,20 $');
  });

  it('devrait avoir la section "la Swarm en chiffres"', () => {
    const sectionTitles = fixture.nativeElement.querySelectorAll('.about__section-title');
    const titles = Array.from<Element>(sectionTitles).map((el) => (el as HTMLElement).textContent?.trim());
    expect(titles).toContain('la Swarm en chiffres');
  });
});
