import { Directive, AfterViewInit, ElementRef, Input } from '@angular/core';

/**
 * Directive [appStaggerChildren] qui injecte --stagger-index via CSS custom
 * property sur chaque enfant direct de l'élément hôte après l'initialisation
 * de la vue. Permet aux animations CSS d'utiliser des délais en cascade
 * (stagger) sans JavaScript supplémentaire.
 *
 * Usage :
 *   <div appStaggerChildren="60">  <!-- 60ms entre chaque enfant -->
 *     <div class="card">...</div>
 *     <div class="card">...</div>
 *   </div>
 *
 * CSS :
 *   .container > * {
 *     animation-delay: calc(var(--stagger-index) * 60ms);
 *   }
 */
@Directive({
  selector: '[appStaggerChildren]',
  standalone: true,
})
export class StaggerChildrenDirective implements AfterViewInit {
  /** Délai entre chaque enfant en ms (défaut: 60ms) */
  @Input('appStaggerChildren') staggerDelay = 60;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const children = this.el.nativeElement.children;
    for (let i = 0; i < children.length; i++) {
      (children[i] as HTMLElement).style.setProperty('--stagger-index', String(i));
    }
  }
}
