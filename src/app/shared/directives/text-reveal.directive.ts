import { Directive, ElementRef, AfterViewInit, Input, OnDestroy } from '@angular/core';

/**
 * Directive [appTextReveal] qui anime chaque mot du texte à l'entrée
 * dans le viewport. Chaque mot apparaît avec un flou → netteté et
 * translateY → 0, avec un stagger de 80ms entre chaque mot.
 *
 * Respecte prefers-reduced-motion : si activé, le texte apparaît
 * immédiatement sans animation.
 *
 * Usage :
 *   <h1 appTextReveal [revealDelay]="200">Le pipeline Swarm</h1>
 */
@Directive({
  selector: '[appTextReveal]',
  standalone: true,
})
export class TextRevealDirective implements AfterViewInit, OnDestroy {
  /** Délai initial avant le début du stagger (ms) */
  @Input() revealDelay = 0;

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    // Respecte prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const text = this.el.nativeElement.textContent?.trim() ?? '';
    if (text.length === 0) return;

    const words = text.split(' ');

    // Vide l'élément et recrée chaque mot dans un <span>
    this.el.nativeElement.innerHTML = '';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + '\u00A0'; // espace insécable après chaque mot
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.filter = 'blur(4px)';
      span.style.transform = 'translateY(16px)';
      span.style.transition =
        'opacity 600ms var(--ease-out-expo), filter 600ms var(--ease-out-expo), transform 600ms var(--ease-out-expo)';
      span.style.transitionDelay = `${this.revealDelay + i * 80}ms`;
      this.el.nativeElement.appendChild(span);
    });

    // IntersectionObserver déclenche l'animation
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            Array.from(this.el.nativeElement.children).forEach((child) => {
              (child as HTMLElement).style.opacity = '1';
              (child as HTMLElement).style.filter = 'blur(0)';
              (child as HTMLElement).style.transform = 'translateY(0)';
            });
            this.observer?.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
