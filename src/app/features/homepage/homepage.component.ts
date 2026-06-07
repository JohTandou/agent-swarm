import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwarmGraphComponent } from './swarm-graph.component';
import { HexGridComponent } from './hex-grid.component';
import { AnimationService } from '../../shared/services/animation.service';

/** Délai de stabilisation du DOM après le rendu initial */
const DOM_STABILIZE_DELAY_MS = 200;
/** Durée de l'animation des compteurs en ms */
const COUNTER_ANIMATION_DURATION_MS = 2000;

/** Données d'une carte statistique */
interface StatCard {
  value: number;
  label: string;
  format: (v: number) => string;
}

/** Données d'une carte de navigation */
interface NavCard {
  title: string;
  description: string;
  route: string;
  icon: string;
}

/**
 * Page d'accueil immersive du Swarm Wiki.
 *
 * Composition :
 * 1. Hero — tagline animée GSAP + grille hexagonale en arrière-plan
 * 2. Graphe D3.js — 9 agents interconnectés (100vh)
 * 3. Statistiques — 4 métriques animées au scroll via GSAP
 * 4. Navigation — 4 cartes vers les sections (100vh)
 *
 * États : le composant est toujours en succès (données statiques).
 * Le graphe SwarmGraphComponent gère ses propres états (loading/error).
 */
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, SwarmGraphComponent, HexGridComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: false })
  heroSectionRef?: ElementRef<HTMLElement>;

  @ViewChild('statsSection', { static: false })
  statsSectionRef?: ElementRef<HTMLElement>;

  /** Statistiques clés — les valeurs brutes sont animées vers ces cibles */
  readonly stats: StatCard[] = [
    {
      value: 9,
      label: 'Agents spécialisés',
      format: (v: number): string => `${v}`,
    },
    {
      value: 26,
      label: 'Skills disponibles',
      format: (v: number): string => `${v}`,
    },
    {
      value: 4,
      label: 'Catégories MCP',
      format: (v: number): string => `${v}`,
    },
    {
      value: 125,
      label: 'par session MEDIUM',
      format: (v: number): string => `1.${String(v).padStart(2, '0')}\u00A0$`,
    },
  ];

  /** Cartes de navigation vers les sections principales */
  readonly navCards: NavCard[] = [
    {
      title: 'Agents',
      description:
        'Découvrez les 9 agents spécialisés qui collaborent automatiquement.',
      route: '/agents',
      icon: '🤖',
    },
    {
      title: 'Workflow',
      description:
        'Comprenez le pipeline orchestré de la tâche au déploiement.',
      route: '/workflow',
      icon: '⚡',
    },
    {
      title: 'Skills',
      description:
        'Explorez les 26 compétences disponibles pour chaque contexte.',
      route: '/skills',
      icon: '🔧',
    },
    {
      title: 'Outils MCP',
      description:
        'Supabase, Vercel, Render, Playwright — 4 intégrations natives pour le déploiement.',
      route: '/outils-mcp',
      icon: '🌐',
    },
  ];

  /** Valeurs courantes de l'animation de compteur (0 → cible) */
  readonly animatedValues = signal<number[]>([0, 0, 0, 0]);
  /** L'animation des compteurs est-elle terminée ? */
  readonly countersDone = signal(false);

  private statsTriggered = false;

  constructor(private animService: AnimationService) {}

  ngOnInit(): void {
    this.setupHeroAnimation();
  }

  ngAfterViewInit(): void {
    this.setupAnimations();
  }

  ngOnDestroy(): void {
    this.animService.killAll();
  }

  /* ==========================================================================
   * Hero — animation GSAP au montage
   * ========================================================================== */

  private async setupHeroAnimation(): Promise<void> {
    if (this.animService.isReducedMotion()) return;

    setTimeout(async () => {
      try {
        const gsap = await this.animService.getGsap();

        // Stagger sur les éléments du hero
        const heroEls = document.querySelectorAll('.homepage__hero-stagger');
        if (heroEls.length > 0) {
          gsap.fromTo(
            heroEls,
            { autoAlpha: 0, y: 16 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.12,
              ease: 'power2.out',
            },
          );
        }

        // Parallaxe multi-couches — 3 vitesses différentes
        const { ScrollTrigger } = await this.animService.initGsap();
        
        const parallaxLayers = [
          { selector: '.homepage__hero-decor--far', y: 80 },
          { selector: '.homepage__hero-decor--mid', y: 120 },
          { selector: '.homepage__hero-decor--near', y: 200 },
        ] as const;

        for (const layer of parallaxLayers) {
          const el = document.querySelector(layer.selector) as HTMLElement;
          if (el) {
            gsap.to(el, {
              y: layer.y,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top top',
                end: 'bottom top',
                scrub: true,
              },
            });
          }
        }
      } catch {
        // GSAP non disponible — l'animation CSS de fallback reste active
      }
    }, DOM_STABILIZE_DELAY_MS);
  }

  /* ==========================================================================
   * Animations au scroll (après render DOM)
   * ========================================================================== */

  private async setupAnimations(): Promise<void> {
    if (this.animService.isReducedMotion()) {
      // Révéler immédiatement tous les éléments
      document.querySelectorAll('.homepage__stat-card, .homepage__nav-card').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    try {
      const { gsap, ScrollTrigger } = await this.animService.initGsap();

      // Compteurs de stats
      this.setupStatsTrigger(gsap, ScrollTrigger);

      // Révélation des cartes de navigation
      const navCards = document.querySelectorAll('.homepage__nav-card');
      navCards.forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 20, scale: 0.97 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });

      ScrollTrigger.refresh();
    } catch {
      // Fallback : utiliser l'IntersectionObserver classique
      this.setupStatsObserverFallback();
    }
  }

  /* ==========================================================================
   * Stats — déclenchement au scroll via GSAP ScrollTrigger
   * ========================================================================== */

  private setupStatsTrigger(gsap: any, _ScrollTrigger: any): void {
    const statsEl = document.querySelector('.homepage__stats');
    if (!statsEl) return;

    const scrollerTrigger = {
      trigger: statsEl,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        statsEl.classList.add('homepage__stats--visible');
        if (!this.statsTriggered) {
          this.statsTriggered = true;
          this.animateCountersGSAP();
        }
      },
    };

    // ScrollTrigger.create
    const stInstance = _ScrollTrigger.create ? _ScrollTrigger.create(scrollerTrigger) : null;
    // Fallback : vérifier manuellement si déjà visible
    if (!stInstance || !stInstance.kill) {
      const rect = statsEl.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.8) {
        scrollerTrigger.onEnter();
      }
    }
  }

  /**
   * Anime les 4 compteurs de 0 vers leur valeur cible avec GSAP.
   */
  private animateCountersGSAP(): void {
    const targets = this.stats.map((s) => s.value);
    const obj = { v0: 0, v1: 0, v2: 0, v3: 0 };

    this.animService.initGsap().then(({ gsap }) => {
      gsap.to(obj, {
        v0: targets[0],
        v1: targets[1],
        v2: targets[2],
        v3: targets[3],
        duration: COUNTER_ANIMATION_DURATION_MS / 1000,
        ease: 'power2.out',
        onUpdate: () => {
          this.animatedValues.set([
            Math.round(obj.v0),
            Math.round(obj.v1),
            Math.round(obj.v2),
            Math.round(obj.v3),
          ]);
        },
        onComplete: () => {
          this.countersDone.set(true);
        },
      });
    }).catch(() => {
      // Fallback RAF
      this.animateCountersRAF();
    });
  }

  /* ==========================================================================
   * Fallback — IntersectionObserver + RAF (si GSAP échoue)
   * ========================================================================== */

  private setupStatsObserverFallback(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('homepage__stats--visible');
            if (!this.statsTriggered) {
              this.statsTriggered = true;
              this.animateCountersRAF();
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    setTimeout(() => {
      const el = document.querySelector('.homepage__stats');
      if (el) observer.observe(el);
    }, DOM_STABILIZE_DELAY_MS);
  }

  /**
   * Animation RAF des compteurs (fallback sans GSAP).
   */
  private animateCountersRAF(): void {
    const duration = COUNTER_ANIMATION_DURATION_MS;
    const startTime = performance.now();
    const targets = this.stats.map((s) => s.value);

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      this.animatedValues.set(targets.map((t) => Math.round(t * eased)));

      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        this.countersDone.set(true);
      }
    };

    requestAnimationFrame(tick);
  }

  /* ==========================================================================
   * Helpers d'affichage
   * ========================================================================== */

  /** Formate la valeur animée d'un compteur */
  formatStat(index: number): string {
    const stat = this.stats[index];
    const value = this.animatedValues()[index] ?? 0;
    return stat.format(value);
  }
}
