import {
  Component,
  signal,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SwarmGraphComponent } from './swarm-graph.component';

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
 * 1. Hero — tagline + résumé exécutif (100vh)
 * 2. Graphe D3.js — 9 agents interconnectés (100vh)
 * 3. Statistiques — 4 métriques animées au scroll (60vh)
 * 4. Navigation — 4 cartes vers les sections (100vh)
 *
 * États : le composant est toujours en succès (données statiques).
 * Le graphe SwarmGraphComponent gère ses propres états (loading/error).
 */
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, SwarmGraphComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit, OnDestroy {
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
      value: 125, // centimes → animé de 0 à 125, affiché "1.25 $"
      label: 'par session MEDIUM',
      format: (v: number): string => `1.${String(v).padStart(2, '0')} $`,
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
      title: 'Écosystème',
      description:
        'Supabase, Vercel, Render, Playwright — les intégrations natives.',
      route: '/ecosysteme',
      icon: '🌐',
    },
  ];

  /** Valeurs courantes de l'animation de compteur (0 → cible) */
  readonly animatedValues = signal<number[]>([0, 0, 0, 0]);
  /** L'animation des compteurs est-elle terminée ? */
  readonly countersDone = signal(false);

  private observer: IntersectionObserver | null = null;
  private rafId: number | null = null;

  ngOnInit(): void {
    this.setupStatsObserver();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Observe l'entrée dans le viewport de la section statistiques
   * pour déclencher l'animation des compteurs une seule fois.
   */
  private setupStatsObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.countersDone()) {
            this.animateCounters();
          }
        });
      },
      { threshold: 0.2 }
    );

    /* Délai pour laisser le DOM se stabiliser après le rendu */
    setTimeout(() => {
      const el = document.querySelector('.homepage__stats');
      if (el) this.observer?.observe(el);
    }, 200);
  }

  /**
   * Anime les 4 compteurs de 0 vers leur valeur cible.
   * Utilise requestAnimationFrame avec easing cubic-out.
   * Durée : 2000ms.
   */
  private animateCounters(): void {
    const duration = 2000;
    const startTime = performance.now();
    const targets = this.stats.map((s) => s.value);

    const tick = (now: number): void => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      /* Easing cubic-out pour un ralentissement naturel */
      const eased = 1 - Math.pow(1 - rawProgress, 3);

      const current = targets.map((t) => Math.round(t * eased));
      this.animatedValues.set(current);

      if (rawProgress < 1) {
        this.rafId = requestAnimationFrame(tick);
      } else {
        this.countersDone.set(true);
      }
    };

    this.rafId = requestAnimationFrame(tick);
  }

  /** Formate la valeur animée d'un compteur */
  formatStat(index: number): string {
    const stat = this.stats[index];
    const value = this.animatedValues()[index] ?? 0;
    return stat.format(value);
  }
}
