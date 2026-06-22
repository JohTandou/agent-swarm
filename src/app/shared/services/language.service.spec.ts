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

  describe('translatePathToEn', () => {
    it('devrait traduire /a-propos en /en/about', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/a-propos')).toBe('/en/about');
    });

    it('devrait traduire /outils-mcp/supabase en /en/mcp-tools/supabase', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/outils-mcp/supabase')).toBe('/en/mcp-tools/supabase');
    });

    it('devrait traduire /ecosysteme en /en/ecosystem', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/ecosysteme')).toBe('/en/ecosystem');
    });

    it('devrait traduire /probleme-innovation en /en/problem-innovation', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/probleme-innovation')).toBe('/en/problem-innovation');
    });

    it('devrait garder les segments non mappés', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/agents/orchestrateur')).toBe('/en/agents/orchestrateur');
    });

    it('devrait traduire / en /en', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.translatePathToEn('/')).toBe('/en');
    });
  });

  describe('translatePathToFr', () => {
    it('devrait traduire /en/about en /a-propos', () => {
      const svc = TestBed.inject(LanguageService);
      expect(svc.translatePathToFr('/en/about')).toBe('/a-propos');
    });

    it('devrait traduire /en/mcp-tools/supabase en /outils-mcp/supabase', () => {
      const svc = TestBed.inject(LanguageService);
      expect(svc.translatePathToFr('/en/mcp-tools/supabase')).toBe('/outils-mcp/supabase');
    });

    it('devrait traduire /en en /', () => {
      const svc = TestBed.inject(LanguageService);
      expect(svc.translatePathToFr('/en')).toBe('/');
    });

    it('devrait garder les segments non mappés', () => {
      const svc = TestBed.inject(LanguageService);
      expect(svc.translatePathToFr('/en/agents/orchestrateur')).toBe('/agents/orchestrateur');
    });
  });

  describe('localizeRoute', () => {
    it('devrait retourner la route FR quand la langue est FR', () => {
      sessionStorage.clear();
      history.pushState({}, '', '/');
      const svc = TestBed.inject(LanguageService);
      svc.setLang('fr');
      expect(svc.localizeRoute('/a-propos')).toBe('/a-propos');
    });

    it('devrait retourner la route EN quand la langue est EN', () => {
      const svc = TestBed.inject(LanguageService);
      svc.setLang('en');
      expect(svc.localizeRoute('/a-propos')).toBe('/en/about');
      expect(svc.localizeRoute('/')).toBe('/en');
    });
  });
});
