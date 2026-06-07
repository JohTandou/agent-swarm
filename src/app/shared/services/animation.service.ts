import { Injectable, signal } from '@angular/core';

/**
 * Service d'animation global basé sur GSAP + ScrollTrigger.
 *
 * Charge GSAP paresseusement (comme D3 dans SwarmGraph), expose
 * une API unifiée pour les animations au scroll, les compteurs,
 * les transitions de page et le stagger.
 *
 * Respecte prefers-reduced-motion : si activé, toutes les animations
 * sont désactivées et les éléments apparaissent immédiatement.
 *
 * @providedIn root — singleton applicatif
 */
@Injectable({ providedIn: 'root' })
export class AnimationService {
  /** Détection temps réel de prefers-reduced-motion */
  readonly isReducedMotion = signal(false);

  /** Instance GSAP chargée paresseusement */
  private gsap: any = null;

  /** Module ScrollTrigger */
  private ScrollTrigger: any = null;

  /** Promesse de chargement (évite les chargements concurrents) */
  private initPromise: Promise<void> | null = null;

  /** Registre des animations créées pour le cleanup */
  private readonly tweens: any[] = [];

  constructor() {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.isReducedMotion.set(mq.matches);
    mq.addEventListener('change', (e) => this.isReducedMotion.set(e.matches));
  }

  /* ==========================================================================
   * Initialisation paresseuse
   * ========================================================================== */

  /**
   * Charge GSAP et ScrollTrigger une seule fois.
   * Retourne les modules pour usage avancé.
   */
  async initGsap(): Promise<{ gsap: any; ScrollTrigger: any }> {
    if (this.gsap) return { gsap: this.gsap, ScrollTrigger: this.ScrollTrigger };

    if (this.initPromise) {
      await this.initPromise;
      return { gsap: this.gsap, ScrollTrigger: this.ScrollTrigger };
    }

    this.initPromise = (async () => {
      const gsapModule = await import('gsap');
      const stModule = await import('gsap/ScrollTrigger');
      this.gsap = gsapModule.default ?? gsapModule;
      this.ScrollTrigger = stModule.ScrollTrigger;
      this.gsap.registerPlugin(this.ScrollTrigger);
    })();

    await this.initPromise;
    return { gsap: this.gsap, ScrollTrigger: this.ScrollTrigger };
  }

  /**
   * Retourne l'instance GSAP chargée paresseusement.
   * Pratique quand on n'a besoin que de gsap (pas de ScrollTrigger).
   */
  async getGsap(): Promise<any> {
    const { gsap } = await this.initGsap();
    return gsap;
  }

  /* ==========================================================================
   * API publique — révélations au scroll
   * ========================================================================== */

  /**
   * Anime des éléments individuels quand ils entrent dans le viewport.
   * Chaque élément reçoit un délai incrémental (stagger).
   */
  async revealOnScroll(elements: Element[], options?: {
    staggerMs?: number;
    scrollTrigger?: Record<string, unknown>;
  }): Promise<void> {
    if (this.isReducedMotion()) {
      elements.forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      });
      return;
    }

    const { gsap, ScrollTrigger } = await this.initGsap();
    const stagger = options?.staggerMs ?? 80;

    elements.forEach((el, i) => {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          delay: i * (stagger / 1000),
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true,
            ...options?.scrollTrigger,
          },
        },
      );
      this.tweens.push(tween);
    });
  }

  /**
   * Stagger entrée pour tous les éléments matchant un sélecteur
   * dans un conteneur donné.
   */
  async staggerEntrance(
    container: Element,
    selector: string,
    options?: { staggerMs?: number; fromY?: number; duration?: number },
  ): Promise<void> {
    if (this.isReducedMotion()) return;

    const { gsap } = await this.initGsap();
    const els = container.querySelectorAll(selector);
    if (els.length === 0) return;

    const tween = gsap.fromTo(
      els,
      { autoAlpha: 0, y: options?.fromY ?? 16 },
      {
        autoAlpha: 1,
        y: 0,
        duration: options?.duration ?? 0.5,
        stagger: (options?.staggerMs ?? 80) / 1000,
        ease: 'power2.out',
      },
    );
    this.tweens.push(tween);
  }

  /* ==========================================================================
   * API publique — compteurs animés
   * ========================================================================== */

  /**
   * Anime un compteur de `from` à `to` sur une durée donnée.
   * Met à jour le textContent de l'élément cible.
   */
  async animateCounter(
    target: HTMLElement,
    from: number,
    to: number,
    durationMs = 2000,
  ): Promise<void> {
    if (this.isReducedMotion()) {
      target.textContent = `${to}`;
      return;
    }

    const { gsap } = await this.initGsap();
    const obj = { value: from };

    const tween = gsap.to(obj, {
      value: to,
      duration: durationMs / 1000,
      ease: 'power2.out',
      onUpdate: () => {
        target.textContent = `${Math.round(obj.value)}`;
      },
      onComplete: () => {
        target.textContent = `${to}`;
      },
    });
    this.tweens.push(tween);
  }

  /* ==========================================================================
   * API publique — transitions de page
   * ========================================================================== */

  /** Sortie de page : fade + translateY */
  async pageExit(wrapper: Element): Promise<void> {
    if (this.isReducedMotion()) return;
    const { gsap } = await this.initGsap();
    const tween = gsap.to(wrapper, { autoAlpha: 0, y: 8, duration: 0.2 });
    this.tweens.push(tween);
  }

  /** Entrée de page : fade + translateY */
  async pageEnter(wrapper: Element): Promise<void> {
    if (this.isReducedMotion()) return;
    const { gsap } = await this.initGsap();
    const tween = gsap.to(wrapper, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    });
    this.tweens.push(tween);
  }

  /* ==========================================================================
   * Nettoyage
   * ========================================================================== */

  /** Tue toutes les animations GSAP et ScrollTriggers enregistrés. */
  killAll(): void {
    if (this.ScrollTrigger) {
      this.ScrollTrigger.getAll().forEach((st: any) => st.kill());
    }
    this.tweens.forEach((t) => {
      if (t && typeof t.kill === 'function') t.kill();
    });
    this.tweens.length = 0;
  }
}
