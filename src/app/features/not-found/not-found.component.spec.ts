import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { LanguageService } from '../../shared/services/language.service';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    sessionStorage.clear();
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher le texte "404"', () => {
    const codeEl: HTMLElement = fixture.nativeElement.querySelector('.not-found__code');
    expect(codeEl).toBeTruthy();
    expect(codeEl.textContent?.trim()).toBe('404');
  });

  it('devrait afficher le lien "Retour à la ruche"', () => {
    const actions: HTMLElement = fixture.nativeElement.querySelector('.not-found__actions');
    expect(actions).toBeTruthy();

    const links = actions.querySelectorAll('app-ui-button');
    const linkTexts = Array.from(links).map((el) => (el as HTMLElement).textContent?.trim());
    expect(linkTexts).toContain('Retour à la ruche');
  });

  it('devrait afficher le lien "Explorer les agents"', () => {
    const actions: HTMLElement = fixture.nativeElement.querySelector('.not-found__actions');
    expect(actions).toBeTruthy();

    const links = actions.querySelectorAll('app-ui-button');
    const linkTexts = Array.from(links).map((el) => (el as HTMLElement).textContent?.trim());
    expect(linkTexts).toContain('Explorer les agents');
  });
});
