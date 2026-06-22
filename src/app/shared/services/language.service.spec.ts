import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;
  const originalHref: string = window.location.href;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    sessionStorage.removeItem('swarm-lang');
    history.replaceState({}, '', originalHref);
  });

  function setPathname(pathname: string): void {
    history.pushState({}, '', pathname);
  }

  it('devrait détecter le français par défaut quand le pathname ne contient pas /en', () => {
    setPathname('/');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
  });

  it('devrait détecter le français sur un pathname français', () => {
    setPathname('/agents/orchestrateur');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
  });

  it('devrait détecter l\'anglais quand le pathname commence par /en/', () => {
    setPathname('/en/agents/orchestrator');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('en');
  });

  it('devrait détecter l\'anglais quand le pathname est exactement /en', () => {
    setPathname('/en');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('en');
  });

  it('setLang devrait changer la langue courante', () => {
    setPathname('/');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
    svc.setLang('en');
    expect(svc.currentLang()).toBe('en');
    svc.setLang('fr');
    expect(svc.currentLang()).toBe('fr');
  });

  it('langPrefix devrait retourner une chaîne vide pour le français', () => {
    setPathname('/');
    const svc = TestBed.inject(LanguageService);
    svc.setLang('fr');
    expect(svc.langPrefix).toBe('');
  });

  it('langPrefix devrait retourner /en pour l\'anglais', () => {
    setPathname('/');
    const svc = TestBed.inject(LanguageService);
    svc.setLang('en');
    expect(svc.langPrefix).toBe('/en');
  });
});
