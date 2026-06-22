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
   * Détecte la langue initiale depuis le sessionStorage,
   * puis depuis le pathname de l'URL.
   * Si le path commence par /en/ ou est exactement /en → anglais,
   * sinon → français (langue par défaut).
   */
  private detectInitialLang(): Lang {
    const stored = sessionStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'fr' || stored === 'en') return stored;
    const path = window.location.pathname;
    const detected = path.startsWith('/en/') || path === '/en' ? 'en' : 'fr';
    sessionStorage.setItem(STORAGE_KEY, detected);
    return detected;
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
}
