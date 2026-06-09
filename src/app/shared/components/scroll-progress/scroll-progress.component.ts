import { Component, HostListener, signal } from '@angular/core';

/**
 * Barre de progression de lecture (scroll).
 * Fixée en haut de la page, 3px de hauteur, dégradé ambré.
 * Indique la progression de défilement de la page.
 */
@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `
    <div
      class="scroll-progress"
      [style.transform]="'scaleX(' + progress() + ')'"
      role="progressbar"
      [attr.aria-valuenow]="progress() * 100"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Progression de lecture"
    ></div>
  `,
  styles: [`
    .scroll-progress {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, var(--color-accent), #C4780D, var(--color-accent));
      transform-origin: left;
      z-index: var(--z-toast, 400);
      pointer-events: none;
    }
  `],
})
export class ScrollProgressComponent {
  /** Progression du scroll (0 à 1) */
  protected readonly progress = signal(0);

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.progress.set(docHeight > 0 ? scrollTop / docHeight : 0);
  }
}
