import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le titre "Swarm Wiki"', () => {
    const titleEl: HTMLElement = fixture.nativeElement.querySelector('.homepage__title');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent?.trim()).toBe('Swarm Wiki');
  });

  it('devrait afficher le sous-titre', () => {
    const subtitleEl: HTMLElement = fixture.nativeElement.querySelector('.homepage__subtitle');
    expect(subtitleEl).toBeTruthy();
    expect(subtitleEl.textContent?.trim()).toBe(
      'Documentation technique du pipeline d\'agents IA orchestré pour le développement logiciel.'
    );
  });

  it('devrait avoir un lien CTA vers /a-propos', () => {
    const ctaLink: HTMLAnchorElement = fixture.nativeElement.querySelector('.homepage__link');
    expect(ctaLink).toBeTruthy();
    expect(ctaLink.getAttribute('href')).toBe('/a-propos');
    expect(ctaLink.textContent?.trim()).toContain('Découvrir le système');
  });

  it('devrait avoir une section avec la classe homepage', () => {
    const sectionEl: HTMLElement = fixture.nativeElement.querySelector('.homepage');
    expect(sectionEl).toBeTruthy();
  });
});
