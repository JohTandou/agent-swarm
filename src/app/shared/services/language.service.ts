import { Injectable, signal } from '@angular/core';

/** Langues supportées par l'application */
export type Lang = 'fr' | 'en';

/** Clé de stockage sessionStorage pour la persistance de la langue */
const STORAGE_KEY = 'swarm-lang';

/**
 * Service de gestion de la langue active.
 * Détecte la langue depuis le sessionStorage ou l'URL au démarrage
 * et permet le changement à chaud avec persistance.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Signal réactif contenant la langue courante */
  readonly currentLang = signal<Lang>(this.detectInitialLang());

  /**
   * Détecte la langue initiale : l'URL prime sur sessionStorage.
   * Si le path commence par /en/ ou est exactement /en → anglais.
   * Sinon, utilise sessionStorage s'il contient une langue valide.
   * Par défaut → français.
   */
  private detectInitialLang(): Lang {
    const path = window.location.pathname;
    // L'URL prime toujours : si /en/ est dans le pathname → anglais
    if (path.startsWith('/en/') || path === '/en') {
      sessionStorage.setItem(STORAGE_KEY, 'en');
      return 'en';
    }
    // Pas de préfixe /en → vérifier sessionStorage, sinon français par défaut
    const stored = sessionStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'fr' || stored === 'en') return stored;
    sessionStorage.setItem(STORAGE_KEY, 'fr');
    return 'fr';
  }

  /** Définit la langue courante et persiste dans sessionStorage */
  setLang(lang: Lang): void {
    this.currentLang.set(lang);
    sessionStorage.setItem(STORAGE_KEY, lang);
  }

  /** Retourne le préfixe d'URL pour la langue courante : '' pour fr, '/en' pour en */
  get langPrefix(): string {
    return this.currentLang() === 'en' ? '/en' : '';
  }

  /** Mapping des segments de route FR → EN */
  private readonly ROUTE_MAP_FR_TO_EN: Record<string, string> = {
    'a-propos': 'about',
    'ecosysteme': 'ecosystem',
    'outils-mcp': 'mcp-tools',
    'probleme-innovation': 'problem-innovation',
  };

  /** Mapping inverse EN → FR (construit automatiquement) */
  private get ROUTE_MAP_EN_TO_FR(): Record<string, string> {
    const inverted: Record<string, string> = {};
    for (const [fr, en] of Object.entries(this.ROUTE_MAP_FR_TO_EN)) {
      inverted[en] = fr;
    }
    return inverted;
  }

  /**
   * Traduit un chemin FR en chemin EN.
   * /a-propos → /en/about
   * /outils-mcp/supabase → /en/mcp-tools/supabase
   * /agents/orchestrateur → /en/agents/orchestrateur (segment non mappé = inchangé)
   * / → /en
   */
  translatePathToEn(frPath: string): string {
    if (frPath === '/' || frPath === '') return '/en';
    const segments = frPath.split('/').filter(Boolean);
    const translated = segments.map((seg) => this.ROUTE_MAP_FR_TO_EN[seg] ?? seg);
    return '/en/' + translated.join('/');
  }

  /**
   * Traduit un chemin EN (avec préfixe /en) en chemin FR.
   * /en/about → /a-propos
   * /en/mcp-tools/supabase → /outils-mcp/supabase
   * /en → /
   */
  translatePathToFr(enPath: string): string {
    const withoutPrefix = enPath.replace(/^\/en\/?/, '');
    if (!withoutPrefix) return '/';
    const segments = withoutPrefix.split('/').filter(Boolean);
    const map = this.ROUTE_MAP_EN_TO_FR;
    const translated = segments.map((seg) => map[seg] ?? seg);
    return '/' + translated.join('/');
  }

  /**
   * Localise une route FR vers la langue courante.
   * En mode EN : /a-propos → /en/about
   * En mode FR : retourne la route inchangée
   */
  localizeRoute(route: string): string {
    if (this.currentLang() === 'en') {
      return this.translatePathToEn(route);
    }
    return route;
  }
}
