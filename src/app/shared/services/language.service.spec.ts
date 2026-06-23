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

  /**
   * Helper: définit la langue stockée dans sessionStorage avant création du service.
   * Le service lit l'URL en premier (detectInitialLang),
   * puis utilise sessionStorage comme fallback.
   */
  function presetStoredLang(lang: string | null): void {
    sessionStorage.clear();
    if (lang) sessionStorage.setItem('swarm-lang', lang);
  }

  it('devrait détecter le français par défaut quand rien n\'est stocké', () => {
    presetStoredLang(null);
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
  });

  it('devrait utiliser la langue stockée en session quand elle existe', () => {
    presetStoredLang('fr');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
  });

  it('devrait détecter l\'anglais depuis le sessionStorage', () => {
    presetStoredLang('en');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('en');
  });

  it('devrait détecter l\'anglais via l\'URL même si sessionStorage contient fr', () => {
    sessionStorage.setItem('swarm-lang', 'fr'); // Contamination simulée
    setPathname('/en/about');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('en'); // L'URL prime
  });

  it('devrait utiliser sessionStorage si l\'URL n\'a pas de préfixe /en', () => {
    sessionStorage.setItem('swarm-lang', 'en'); // Laissé par une page EN précédente
    setPathname('/a-propos');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('en'); // sessionStorage = 'en', pas de /en dans l'URL
  });

  it('setLang devrait changer la langue courante', () => {
    presetStoredLang('fr');
    const svc = TestBed.inject(LanguageService);
    expect(svc.currentLang()).toBe('fr');
    svc.setLang('en');
    expect(svc.currentLang()).toBe('en');
    svc.setLang('fr');
    expect(svc.currentLang()).toBe('fr');
  });

  it('devrait persister dans sessionStorage après setLang', () => {
    presetStoredLang('fr');
    const svc = TestBed.inject(LanguageService);
    svc.setLang('en');
    expect(sessionStorage.getItem('swarm-lang')).toBe('en');
    svc.setLang('fr');
    expect(sessionStorage.getItem('swarm-lang')).toBe('fr');
  });

  it('langPrefix devrait retourner une chaîne vide pour le français', () => {
    presetStoredLang('fr');
    const svc = TestBed.inject(LanguageService);
    svc.setLang('fr');
    expect(svc.langPrefix).toBe('');
  });

  it('langPrefix devrait retourner /en pour l\'anglais', () => {
    presetStoredLang('fr');
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
