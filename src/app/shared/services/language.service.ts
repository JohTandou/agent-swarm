import { Injectable, signal } from '@angular/core';

/** Langues supportées par l'application */
export type Lang = 'fr' | 'en';

/**
 * Service de gestion de la langue active.
 * Détecte la langue depuis l'URL au démarrage et permet le changement à chaud.
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  /** Signal réactif contenant la langue courante */
  readonly currentLang = signal<Lang>(this.detectInitialLang());

  /**
   * Détecte la langue initiale depuis le pathname de l'URL.
   * Si le path commence par /en/ ou est exactement /en → anglais,
   * sinon → français (langue par défaut).
   */
  private detectInitialLang(): Lang {
    const path = window.location.pathname;
    return path.startsWith('/en/') || path === '/en' ? 'en' : 'fr';
  }

  /** Définit la langue courante */
  setLang(lang: Lang): void {
    this.currentLang.set(lang);
  }

  /** Retourne le préfixe d'URL pour la langue courante : '' pour fr, '/en' pour en */
  get langPrefix(): string {
    return this.currentLang() === 'en' ? '/en' : '';
  }
}
