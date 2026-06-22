import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { LanguageService } from '../../shared/services/language.service';
import type { Breadcrumb } from '@shared/models';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  const sampleBreadcrumbs: Breadcrumb[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Agents', route: '/agents' },
    { label: 'Orchestrateur' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsComponent],
      providers: [
        provideRouter([]),
        { provide: LanguageService, useValue: { currentLang: signal('fr' as const), langPrefix: '' } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait afficher tous les segments du fil d\'Ariane', () => {
    component.breadcrumbs = sampleBreadcrumbs;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.breadcrumbs__item');
    expect(items.length).toBe(3);
  });

  it('devrait rendre les segments non-finaux comme des liens cliquables', () => {
    component.breadcrumbs = sampleBreadcrumbs;
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.breadcrumbs__link');
    expect(links.length).toBe(2); // Accueil et Agents
    expect(links[0].getAttribute('href')).toBe('/');
    expect(links[1].getAttribute('href')).toBe('/agents');
  });

  it('devrait rendre le dernier segment comme non cliquable avec aria-current', () => {
    component.breadcrumbs = sampleBreadcrumbs;
    fixture.detectChanges();
    const currentEl = fixture.nativeElement.querySelector('.breadcrumbs__current');
    expect(currentEl).toBeTruthy();
    expect(currentEl.getAttribute('aria-current')).toBe('page');
    expect(currentEl.textContent?.trim()).toBe('Orchestrateur');
  });

  it('ne devrait rien afficher quand le tableau de breadcrumbs est vide', () => {
    component.breadcrumbs = [];
    fixture.detectChanges();
    const navEl = fixture.nativeElement.querySelector('.breadcrumbs');
    expect(navEl).toBeFalsy();
  });

  it('devrait avoir le role navigation et aria-label "Fil d\'Ariane"', () => {
    component.breadcrumbs = sampleBreadcrumbs;
    fixture.detectChanges();
    const navEl: HTMLElement = fixture.nativeElement.querySelector('.breadcrumbs');
    expect(navEl.getAttribute('aria-label')).toBe('Fil d\'Ariane');
  });

  it('devrait avoir un séparateur entre chaque segment sauf le dernier', () => {
    component.breadcrumbs = sampleBreadcrumbs;
    fixture.detectChanges();
    const separators = fixture.nativeElement.querySelectorAll('.breadcrumbs__separator');
    expect(separators.length).toBe(2);
  });

  it('devrait gérer un breadcrumb avec un seul élément (pas de lien, aria-current)', () => {
    component.breadcrumbs = [{ label: 'Accueil' }];
    fixture.detectChanges();
    const currentEl = fixture.nativeElement.querySelector('.breadcrumbs__current');
    expect(currentEl).toBeTruthy();
    expect(currentEl.getAttribute('aria-current')).toBe('page');
    const links = fixture.nativeElement.querySelectorAll('.breadcrumbs__link');
    expect(links.length).toBe(0);
  });
});
