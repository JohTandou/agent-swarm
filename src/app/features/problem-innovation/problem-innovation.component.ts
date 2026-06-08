import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { AnimationService } from '../../shared/services/animation.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';

/* Constantes de configuration */
const LOADING_SIMULATION_DELAY_MS = 500;
const READY_CHECK_INTERVAL_MS = 100;
const READY_CHECK_TIMEOUT_MS = 2000;

/**
 * Données structurées pour la section Avant/Après.
 */
interface ComparisonEntry {
  readonly label: string;
  readonly withoutSwarm: string;
  readonly withSwarm: string;
  readonly improvement: string;
}

/**
 * Données structurées pour la section Comparaison système.
 */
interface SystemComparison {
  readonly system: string;
  readonly type: string;
  readonly architecture: string;
  readonly forces: string;
  readonly weaknesses: string;
}

/**
 * Données structurées pour les piliers d'innovation.
 */
interface Pillar {
  readonly title: string;
  readonly description: string;
}

/**
 * Données structurées pour l'analyse des coûts.
 */
interface CostEntry {
  readonly route: string;
  readonly tokens: string;
  readonly cost: string;
  readonly description: string;
}

/**
 * Données structurées pour les limites du système.
 */
interface LimitCategory {
  readonly category: string;
  readonly items: readonly string[];
}

/**
 * Données structurées pour la section Pour qui.
 */
interface TargetAudience {
  readonly audience: string;
  readonly description: string;
}

/**
 * Page Problème & Innovation — Composant pur Apple-grade.
 *
 * Présente la proposition de valeur du Swarm à travers 8 sections
 * en plein écran avec animations au scroll, compteur animé et
 * barres de comparaison.
 */
@Component({
  selector: 'app-problem-innovation',
  standalone: true,
  imports: [UiButtonComponent, UiSkeletonComponent],
  templateUrl: './problem-innovation.component.html',
  styleUrls: ['./problem-innovation.component.scss'],
})
export class ProblemInnovationComponent implements OnInit, AfterViewInit, OnDestroy {
  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  /** Indique si le contenu est en cours de chargement (shimmer skeleton). */
  protected readonly loading = signal(true);

  /** Message d'erreur éventuel. */
  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Données — Section 1 : Hero
   * ========================================================================== */

  protected readonly heroTitle = 'Pourquoi le Swarm ?';
  protected readonly heroSubtitle =
    'Le développement logiciel moderne est fractal : chaque fonctionnalité cache des dizaines de micro-décisions architecturales, de dépendances croisées et de cas limites. Les agents IA isolés savent écrire du code, mais échouent face à la complexité systémique des vrais projets. Le Swarm change la donne.';

  /* ==========================================================================
   * Données — Section 2 : Avant/Après
   * ========================================================================== */

  protected readonly comparisonData: readonly ComparisonEntry[] = [
    {
      label: 'Temps de développement',
      withoutSwarm: '3–5 jours pour une feature complète (spéculation, implémentation, tests, debug, documentation)',
      withSwarm: '15–45 minutes — le pipeline parallélise conception, code, tests et documentation',
      improvement: 'Jusqu\'à 160× plus rapide',
    },
    {
      label: 'Qualité du code',
      withoutSwarm: 'Revue humaine subjective, tests partiels, documentation déconnectée du code',
      withSwarm: 'Tests systématiques générés par un agent dédié, revue automatique par reviewer, documentation synchronisée',
      improvement: 'Couverture ≥ 80 %, zéro régression non détectée',
    },
    {
      label: 'Parallélisme',
      withoutSwarm: 'Un développeur = une tâche à la fois. Équipes bloquées par les dépendances',
      withSwarm: 'Agents front et back travaillent simultanément. Jusqu\'à 5 tâches indépendantes en parallèle',
      improvement: 'Débit ×5 sur les projets complexes',
    },
    {
      label: 'Documentation',
      withoutSwarm: 'Souvent obsolète avant même la fin du sprint. Écrite après coup, jamais prioritaire',
      withSwarm: 'Documentation générée automatiquement à chaque merge, toujours à jour, toujours en français',
      improvement: 'Docs vivantes, jamais obsolètes',
    },
    {
      label: 'Coût',
      withoutSwarm: '150–250 K€/an par développeur senior. Le coût d\'opportunité des bugs est massif',
      withSwarm: '~1,25 $ par session MEDIUM. ~50–150 $/mois en usage intensif via API',
      improvement: '5–8× moins cher qu\'un abonnement Claude Max',
    },
  ];

  /* ==========================================================================
   * Données — Section 3 : Comparaison systèmes agentiques
   * ========================================================================== */

  protected readonly systemComparisons: readonly SystemComparison[] = [
    {
      system: 'Claude Code',
      type: 'Agent conversationnel',
      architecture: 'Monolithique — un seul agent pour tout',
      forces: 'Excellente compréhension du code, itération rapide en session',
      weaknesses: 'Pas de parallélisme. Pas de gates qualité. Un seul modèle = pas d\'optimisation de coût. Pas d\'intégration Git native (branche→PR→merge)',
    },
    {
      system: 'Cursor Agent',
      type: 'Agent IDE intégré',
      architecture: 'Agent unique couplé à l\'IDE',
      forces: 'Très bonne expérience développeur, édition inline',
      weaknesses: 'Pas de pipeline. Pas de planification architecturale. Pas de tests automatisés. Dépendant de l\'interface IDE',
    },
    {
      system: 'GitHub Copilot',
      type: 'Auto-complétion + agent',
      architecture: 'Suggestions inline + agent Workspace',
      forces: 'Intégration GitHub native, gratuit pour l\'open source',
      weaknesses: 'Pas de planification. Pas de gates qualité. Un seul modèle. Pas de parallélisme front+back. Pas de documentation automatique',
    },
    {
      system: 'Devin',
      type: 'Agent full-stack autonome',
      architecture: 'Agent unique avec sandbox',
      forces: 'Autonome, peut exécuter du code en sandbox',
      weaknesses: 'Très lent (heures pour des tâches simples). Pas de parallélisme. Coût élevé (500 $/mois). Pas de classification automatique de complexité. Pas de gates qualité',
    },
    {
      system: 'Aider',
      type: 'Agent CLI open-source',
      architecture: 'Agent unique avec édition de fichiers',
      forces: 'Open source, multi-modèles, très bon pour l\'édition ciblée',
      weaknesses: 'Pas de pipeline. Pas de parallélisme. Pas de planification. Pas de gates qualité. Pas de documentation automatique',
    },
    {
      system: 'CrewAI / AutoGen',
      type: 'Framework multi-agents',
      architecture: 'Orchestrateur + agents spécialisés',
      forces: 'Multi-agents natif, configuration flexible',
      weaknesses: 'Nécessite configuration manuelle. Pas de classification automatique. Pas d\'intégration Git native. Pas de gates qualité automatisées. Pas de routine front+back parallèle documentée',
    },
    {
      system: 'Swarm',
      type: 'Pipeline full-stack autonome',
      architecture: 'Routage intelligent → planification → parallélisme → gates → merge',
      forces: 'Classification automatique. Parallélisme front+back. Gates qualité (tester + reviewer). Intégration Git native (issue→branche→PR→merge). Documentation automatique. Optimisation coût (2 modèles).',
      weaknesses: 'Limité à 5 cycles et 5 tâches par session. Dépend de la qualité de la planification initiale. Pas de support multi-langages exotiques',
    },
  ];

  /* ==========================================================================
   * Données — Section 4 : 7 piliers d'innovation
   * ========================================================================== */

  protected readonly pillars: readonly Pillar[] = [
    {
      title: 'Classification automatique de complexité',
      description: 'Le système évalue chaque tâche et la route sur le pipeline approprié : DIRECT, SIMPLE, ADAPT, MEDIUM ou FULL. Pas de configuration manuelle — le Swarm décide seul du niveau de rigueur nécessaire.',
    },
    {
      title: 'Routage intelligent à 5 niveaux',
      description: 'DIRECT pour les corrections triviales → SIMPLE pour les modifications ciblées → ADAPT pour les adaptations cross-cutting → MEDIUM pour les features multi-fichiers → FULL pour les fonctionnalités complexes avec contrats et gates.',
    },
    {
      title: 'Planification architecturale',
      description: 'Avant d\'écrire une ligne de code, un agent planner analyse l\'ensemble du codebase, détecte les fichiers impactés, identifie les patterns et conventions, et cartographie les dépendances. Le plan est validé par l\'humain avant exécution.',
    },
    {
      title: 'Implémentation parallèle front+back',
      description: 'Sur les routes MEDIUM et FULL, les agents front et back travaillent simultanément. Le contract agent définit l\'interface (types + API) en amont, garantissant que les deux flux convergeront sans conflit.',
    },
    {
      title: 'Gates qualité automatisées',
      description: 'Chaque modification passe par deux gates : un agent tester génère et exécute les tests (seuil 80 % de couverture), puis un agent reviewer audite le code ET les tests avant d\'approuver ou de rejeter avec une liste précise des corrections nécessaires.',
    },
    {
      title: 'Intégration Git native',
      description: 'Le pipeline est pensé pour le workflow GitHub : une issue déclenche la création d\'une branche, le Swarm implémente, les gates valident, une PR est créée, et après revue humaine le merge est automatique. Zéro friction d\'intégration.',
    },
    {
      title: 'Documentation automatique',
      description: 'Après chaque merge, un agent writer met à jour le CHANGELOG, la documentation technique, le README et la proposition de valeur. La documentation est toujours synchronisée avec le code — elle n\'est jamais une corvée de fin de sprint.',
    },
  ];

  /* ==========================================================================
   * Données — Section 5 : Analyse des coûts
   * ========================================================================== */

  protected readonly costData: readonly CostEntry[] = [
    {
      route: 'SIMPLE',
      tokens: '~50 K',
      cost: '~0,25 $',
      description: 'Correction ciblée, modification d\'un fichier',
    },
    {
      route: 'ADAPT',
      tokens: '~100 K',
      cost: '~0,50 $',
      description: 'Adaptation cross-cutting, 2–3 fichiers',
    },
    {
      route: 'MEDIUM',
      tokens: '~247 K',
      cost: '~1,25 $',
      description: 'Feature multi-fichiers avec tests et revue',
    },
    {
      route: 'FULL',
      tokens: '~500 K',
      cost: '~2,50 $',
      description: 'Fonctionnalité complexe avec contrats, parallélisme et gates',
    },
  ];

  protected readonly costComparisonNote =
    'À titre de comparaison, un abonnement Claude Max coûte 100–200 $/mois pour un agent unique sans parallélisme ni gates qualité. Le Swarm, en usage intensif (40 sessions MEDIUM/mois), revient à ~50 $/mois via API — soit 2 à 4× moins cher pour une solution 5 à 160× plus rapide.';

  /* ==========================================================================
   * Données — Section 6 : Modèles d'IA
   * ========================================================================== */

  protected readonly modelTitle = 'Deux modèles, une stratégie';
  protected readonly modelIntro =
    'Le Swarm utilise deux modèles complémentaires pour optimiser le rapport qualité/coût.';

  protected readonly models = {
    heavy: {
      name: 'DeepSeek V4 Pro',
      role: 'Agents lourds',
      description:
        'Moteur principal pour les agents planner, contract, back, front et reviewer. Excellent en raisonnement architectural, génération de code complexe et audit qualité. Utilisé sur les routes MEDIUM et FULL où la précision est critique.',
      costNote: 'Coût modéré (~0,50 $/M tokens en entrée)',
    },
    light: {
      name: 'Gemini Flash Lite',
      role: 'Agents légers',
      description:
        'Moteur économique pour les agents search, tester et writer. Rapidité d\'exécution et coût minimal (~0,02 $/M tokens). Utilisé pour les tâches à fort volume mais faible complexité : recherche de patterns, génération de tests, mise à jour de documentation.',
      costNote: 'Coût ultra-léger (~0,02 $/M tokens en entrée)',
    },
  };

  protected readonly modelConclusion =
    'Cette architecture bi-modèle est un des piliers de l\'efficacité économique du Swarm : les agents lourds (20 % des tokens) font le travail critique, les agents légers (80 % des tokens) font le volume. Résultat : qualité premium, coût maîtrisé.';

  /* ==========================================================================
   * Données — Section 7 : Limites du système
   * ========================================================================== */

  protected readonly limits: readonly LimitCategory[] = [
    {
      category: 'Limites matérielles (hard limits)',
      items: [
        'Maximum 5 cycles par session — au-delà, le contexte devient trop lourd et la qualité se dégrade',
        'Maximum 5 tâches indépendantes en parallèle — limite dictée par la cohérence des résultats',
        'Tokens limités par le modèle (contexte maximum ~128 K tokens pour DeepSeek V4 Pro)',
      ],
    },
    {
      category: 'Limites architecturales',
      items: [
        'Pas de support pour les langages exotiques ou les frameworks obscurs — le Swarm s\'appuie sur la documentation disponible',
        'La qualité dépend de la planification initiale — un mauvais plan produit un mauvais résultat',
        'Pas de boucle de rétroaction après merge — chaque session est indépendante',
        'Pas de persistance de la mémoire entre sessions — chaque issue repart de zéro',
      ],
    },
    {
      category: 'Limites par agent',
      items: [
        'Planner : peut sous-estimer la complexité de tâches inhabituelles',
        'Front : limité par la qualité du contrat — si le contrat est incomplet, l\'agent est bloqué',
        'Back : inactif sur les projets statiques (comme ce wiki)',
        'Reviewer : ne détecte pas les incohérences métier subtiles',
        'Writer : génère de la documentation technique, pas du contenu marketing',
      ],
    },
  ];

  /* ==========================================================================
   * Données — Section 8 : Pour qui
   * ========================================================================== */

  protected readonly targetAudiences: readonly TargetAudience[] = [
    {
      audience: 'Recruteurs techniques',
      description: 'Comprenez en 3 minutes la proposition de valeur unique du Swarm : un pipeline qui transforme une issue GitHub en PR validée, testée et documentée — sans intervention humaine.',
    },
    {
      audience: 'Tech leads & CTO',
      description: 'Évaluez le Swarm comme un membre d\'équipe virtuel : parallélisme natif, gates qualité automatisées, documentation vivante. Un multiplicateur de vélocité, pas un remplacement.',
    },
    {
      audience: 'Développeurs',
      description: 'Voyez comment le Swarm élimine les tâches répétitives (tests, documentation, boilerplate) pour vous concentrer sur l\'architecture et les décisions créatives.',
    },
    {
      audience: 'Startups & indés',
      description: 'Un coût mensuel inférieur à un abonnement SaaS premium pour une capacité de développement équivalente à une petite équipe. Idéal pour prototyper, itérer et shipper vite.',
    },
  ];

  /* ==========================================================================
   * Injection du service d'animation
   * ========================================================================== */

  private readonly animService = inject(AnimationService);
  private readonly hostRef = inject(ElementRef);

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    this.initContent();
  }

  /** Méthode de retry — réinitialise le chargement. */
  protected retry(): void {
    this.loading.set(true);
    this.error.set(null);
    this.initContent();
  }

  private initContent(): void {
    // Simulation d'un court chargement pour afficher le shimmer skeleton
    // (donne le temps au DOM d'être prêt et crée une transition fluide)
    setTimeout(() => {
      this.loading.set(false);
    }, LOADING_SIMULATION_DELAY_MS);
  }

  ngAfterViewInit(): void {
    // Initialiser les animations au scroll après le rendu du DOM
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.animService.killAll();
  }

  /* ==========================================================================
   * Animations au scroll — GSAP (fallback CSS)
   * ========================================================================== */

  private async setupScrollAnimations(): Promise<void> {
    if (this.loading()) {
      const check = setInterval(() => {
        if (!this.loading()) {
          clearInterval(check);
          this.initScrollAnimations();
        }
      }, READY_CHECK_INTERVAL_MS);
      setTimeout(() => clearInterval(check), READY_CHECK_TIMEOUT_MS);
    } else {
      this.initScrollAnimations();
    }
  }

  private async initScrollAnimations(): Promise<void> {
    try {
      const revealEls = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');
      const barEls = this.hostRef.nativeElement.querySelectorAll('.comparison-bar');
      const counterEl = this.hostRef.nativeElement.querySelector('.counter-target') as HTMLElement;

      if (revealEls.length > 0) {
        await this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
      }

      // Barres de comparaison — animation GSAP de la largeur
      if (barEls.length > 0) {
        const { gsap, ScrollTrigger } = await this.animService.initGsap();
        Array.from(barEls).forEach((el, i) => {
          const bar = el as HTMLElement;
          const targetWidth = bar.getAttribute('data-width');
          if (targetWidth) {
            gsap.to(bar, {
              width: targetWidth,
              duration: 0.8,
              delay: i * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: bar,
                start: 'top 85%',
                once: true,
              },
            });
          }
        });
      }

      // Compteur 8×
      if (counterEl) {
        const { ScrollTrigger } = await this.animService.initGsap();
        ScrollTrigger.create({
          trigger: counterEl,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            this.animService.animateCounter(counterEl, 0, 8, 1800);
          },
        });
      }
    } catch {
      // Fallback CSS : révéler immédiatement
      const all = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll, .comparison-bar');
      all.forEach((el: Element) => el.classList.add('revealed'));
    }
  }
}
