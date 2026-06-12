import {
  Component,
  HostListener,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { HexGridComponent } from './hex-grid.component';
import { SparkleEffectComponent } from '../../shared/components/sparkle-effect/sparkle-effect.component';
import { AnimationService } from '../../shared/services/animation.service';

/** Délai de stabilisation du DOM après le rendu initial */
const DOM_STABILIZE_DELAY_MS = 200;

/** Données d'une carte de navigation */
interface NavCard {
  title: string;
  description: string;
  route: string;
  icon: string;
}

/**
 * Page d'accueil immersive de la Swarm Wiki.
 *
 * Composition :
 * 1. Hero — tagline animée GSAP + grille hexagonale en arrière-plan
 * 2. Navigation — 4 cartes vers les sections
 *
 * États : le composant est toujours en succès (données statiques).
 */
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, HexGridComponent, SparkleEffectComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSection', { static: false })
  heroSectionRef?: ElementRef<HTMLElement>;

  /** Cartes de navigation vers les sections principales */
  readonly navCards: NavCard[] = [
    {
      title: 'Agents',
      description:
        'Neuf agents, une équipe de développement complète orchestrée automatiquement pour vous.',
      route: '/agents',
      icon: '🤖',
    },
    {
      title: 'Workflow',
      description:
        'De l\'idée au déploiement : découvrez comment le pipeline automatise chaque étape sans intervention.',
      route: '/workflow',
      icon: '⚡',
    },
    {
      title: 'Skills',
      description:
        '26 modules activables à la demande. Chaque skill étend vos agents avec une expertise ciblée.',
      route: '/skills',
      icon: '🔧',
    },
    {
      title: 'Outils MCP',
      description:
        'Supabase, Vercel, Render, Playwright, Context7, 21st.dev — 6 intégrations natives.',
      route: '/outils-mcp',
      icon: '🌐',
    },
  ];

  /** Déclenche l'effet sparkle après le chargement initial */
  readonly showSparkle = signal(false);

  /** Position X du curseur en pourcentage (pour le gradient radial) */
  protected readonly cursorX = signal(50);
  /** Position Y du curseur en pourcentage (pour le gradient radial) */
  protected readonly cursorY = signal(50);

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.cursorX.set(((event.clientX - rect.left) / rect.width) * 100);
    this.cursorY.set(((event.clientY - rect.top) / rect.height) * 100);
  }

  constructor(private animService: AnimationService) {}

  ngOnInit(): void {
    this.setupHeroAnimation();
    // Sparkle effect après chargement initial
    setTimeout(() => this.showSparkle.set(true), 800);
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
          { selector: '.homepage__hero-decor--far', y: 80, scale: 1.1, rotateX: -1 },
          { selector: '.homepage__hero-decor--mid', y: 120, scale: 1.05, rotateX: 0 },
          { selector: '.homepage__hero-decor--near', y: 200, scale: 0.95, rotateX: 1 },
        ] as const;

        for (const layer of parallaxLayers) {
          const el = document.querySelector(layer.selector) as HTMLElement;
          if (el) {
            gsap.fromTo(
              el,
              { y: 0, scale: 1, rotateX: 0 },
              {
                y: layer.y,
                scale: layer.scale,
                rotateX: layer.rotateX,
                ease: 'none',
                scrollTrigger: {
                  trigger: el,
                  start: 'top top',
                  end: 'bottom top',
                  scrub: true,
                },
              },
            );
          }
        }

        // Active la perspective 3D sur la section hero
        const heroSection = this.heroSectionRef?.nativeElement;
        if (heroSection) {
          gsap.set(heroSection, {
            perspective: 1000,
            transformStyle: 'preserve-3d',
          });
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
      document.querySelectorAll('.homepage__nav-card').forEach((el) => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    try {
      const { gsap, ScrollTrigger } = await this.animService.initGsap();

      // Stats supprimées

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
      // Stats supprimées
    }
  }

}
