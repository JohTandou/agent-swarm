import { Injectable, signal } from '@angular/core';
import type { TocEntry } from '@shared/models';

/**
 * Service réactif pour la Table des Matières (TOC).
 * Gère l'état partagé entre le MarkdownRenderer (qui fournit les entrées)
 * et le TableOfContentsComponent (qui les affiche).
 *
 * @providedIn root — singleton applicatif
 */
@Injectable({ providedIn: 'root' })
export class TocService {
  /** Entrées hiérarchiques de la table des matières */
  readonly entries = signal<TocEntry[]>([]);

  /** ID du heading actuellement visible (scroll-spy) */
  readonly activeId = signal<string>('');

  /**
   * Remplace toutes les entrées de la TOC.
   * @param items - Liste hiérarchique des entrées de navigation
   */
  setEntries(items: TocEntry[]): void {
    this.entries.set(items);
  }

  /**
   * Définit l'ID du heading actif (scroll-spy).
   * @param id - Slug HTML du heading visible
   */
  setActiveId(id: string): void {
    this.activeId.set(id);
  }

  /** Réinitialise l'état (utilisé lors de la navigation) */
  clear(): void {
    this.entries.set([]);
    this.activeId.set('');
  }
}
