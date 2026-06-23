import { Component, inject, OnInit, OnDestroy, signal, effect } from '@angular/core';
import { TocService } from '../../services/toc.service';
import { TranslationService } from '../../services/translation.service';
import type { TocEntry } from '@shared/models';

/**
 * Table des matières interactive avec scroll-spy.
 * Affiche la hiérarchie des headings du document courant,
 * surligne la section active au scroll, et permet
 * la navigation par clic vers les ancres.
 *
 * État vide : message invitant à charger un document.
 */
@Component({
  selector: 'app-table-of-contents',
  standalone: true,
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  private tocService = inject(TocService);
  private readonly translationService = inject(TranslationService);

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }

  /** Signal réactif lié au service — entrées TOC */
  readonly entries = this.tocService.entries;

  /** Signal réactif lié au service — ID actif */
  readonly activeId = this.tocService.activeId;

  /** État local de visibilité pour l'animation d'entrée */
  readonly isVisible = signal(false);

  /** Indique si on est en train de défiler programmatiquement */
  private isScrollingProgrammatically = false;

  private observer: IntersectionObserver | null = null;

  constructor() {
    // Déclenche l'animation d'entrée après le premier rendu
    effect(() => {
      const items = this.entries();
      if (items.length > 0) {
        // Petit délai pour l'animation stagger
        setTimeout(() => this.isVisible.set(true), 50);
      } else {
        this.isVisible.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.setupScrollSpy();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  /**
   * Configure l'IntersectionObserver pour le scroll-spy.
   * Observe chaque heading avec son ID pour déterminer
   * lequel est visible dans le viewport.
   */
  private setupScrollSpy(): void {
    if (typeof IntersectionObserver === 'undefined') return;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (this.isScrollingProgrammatically) return;

        // Trouver le premier heading visible en haut de la page
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const firstVisible = visible[0];
          // Extraire l'ID du heading (format: "slug-de-la-section")
          const headingEl = firstVisible.target as HTMLElement;
          const anchorEl = headingEl.querySelector('.heading-anchor');
          if (anchorEl && anchorEl.id) {
            this.tocService.setActiveId(anchorEl.id);
          }
        }
      },
      {
        rootMargin: '-64px 0px -20% 0px',
        threshold: [0, 0.5],
      },
    );

    // Observer tous les headings après un court délai (le temps du rendu)
    setTimeout(() => this.observeHeadings(), 200);
  }

  /** Trouve et observe tous les headings dans le contenu principal */
  private observeHeadings(): void {
    if (!this.observer) return;

    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const headings = mainContent.querySelectorAll('h1, h2, h3');
    headings.forEach((h) => this.observer!.observe(h));
  }

  /**
   * Défilement fluide vers une section du document.
   * @param id - Slug HTML du heading cible
   */
  scrollTo(id: string): void {
    this.tocService.setActiveId(id);
    this.isScrollingProgrammatically = true;

    // Approche : chercher l'élément heading qui contient l'ancre avec l'ID correspondant
    const anchor = document.getElementById(id);
    const heading = anchor?.closest('h1, h2, h3, h4');

    if (heading) {
      heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback : chercher l'ancre elle-même
      anchor?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Réactiver l'IntersectionObserver après le scroll
    setTimeout(() => {
      this.isScrollingProgrammatically = false;
    }, 800);
  }

  /**
   * Calcule le padding-left pour l'indentation hiérarchique.
   * @param level - Niveau du heading (1, 2, 3)
   * @returns padding-left en px
   */
  getIndent(level: number): number {
    const indents: Record<number, number> = { 1: 0, 2: 16, 3: 32 };
    return indents[level] ?? 0;
  }

  /**
   * Détermine la classe CSS pour le niveau hiérarchique.
   */
  getLevelClass(level: number): string {
    return `toc__link--level-${level}`;
  }
}
