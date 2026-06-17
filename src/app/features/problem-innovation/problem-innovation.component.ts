import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { AnimationService } from '../../shared/services/animation.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { ROUTE_COSTS } from '@shared/data/routes.data';

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
 * Données structurées pour les piliers d'innovation.
 */
interface Pillar {
  readonly title: string;
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
 * Présente la proposition de valeur de la Swarm à travers 8 sections
 * en plein écran avec animations au scroll, compteur animé et
 * barres de comparaison.
 */
@Component({
  selector: 'app-problem-innovation',
  standalone: true,
  imports: [UiButtonComponent, TextRevealDirective],
  templateUrl: './problem-innovation.component.html',
  styleUrls: ['./problem-innovation.component.scss'],
})
export class ProblemInnovationComponent implements OnInit, AfterViewInit, OnDestroy {
  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  /** Message d'erreur éventuel. */
  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Données — Section 1 : Hero
   * ========================================================================== */

  protected readonly heroTitle = 'Pourquoi la Swarm ?';
  protected readonly heroSubtitle =
    'Le développement logiciel moderne est fractal : chaque fonctionnalité cache des dizaines de micro-décisions architecturales, de dépendances croisées et de cas limites. Les agents IA isolés savent écrire du code, mais échouent face à la complexité systémique des vrais projets. la Swarm change la donne.';

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
  ];

  /* ==========================================================================
   * Données — Section 4 : 7 piliers d'innovation
   * ========================================================================== */

  protected readonly pillars: readonly Pillar[] = [
    {
      title: 'Classification automatique de complexité',
      description: 'Le système évalue chaque tâche et la route sur le pipeline approprié : DIRECT, SIMPLE, ADAPT, MEDIUM ou FULL. Pas de configuration manuelle — la Swarm décide seul du niveau de rigueur nécessaire.',
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
      description: 'Le pipeline est pensé pour le workflow GitHub : une issue déclenche la création d\'une branche, la Swarm implémente, les gates valident, une PR est créée, et après revue humaine le merge est automatique. Zéro friction d\'intégration.',
    },
    {
      title: 'Documentation automatique',
      description: 'Après chaque merge, un agent writer met à jour le CHANGELOG, la documentation technique, le README et la proposition de valeur. La documentation est toujours synchronisée avec le code — elle n\'est jamais une corvée de fin de sprint.',
    },
  ];

  /* ==========================================================================
   * Données — Section 5 : Analyse des coûts
   * ========================================================================== */

  protected readonly costComparisonNote =
    'Estimations basées sur la tarification API DeepSeek V4 Pro (juin 2025). 40 sessions MEDIUM/mois = usage intensif (~2 features/jour). Coûts réels variables selon le volume et la complexité. La Swarm fonctionne en API — vous ne payez que les tokens consommés, sans abonnement.';

  /** Données du tableau comparatif Swarm vs Claude */
  protected readonly claudeComparisonRows: readonly { label: string; swarm: string; claudePro: string; claudeMax: string }[] = [
    {
      label: 'Prix / mois (usage intensif)',
      swarm: '~8–25 $',
      claudePro: '20 $',
      claudeMax: '100–200 $',
    },
    {
      label: 'Modèle de tarification',
      swarm: 'Pay-per-token (DeepSeek V4 Pro)',
      claudePro: 'Abonnement fixe',
      claudeMax: 'Abonnement fixe',
    },
    {
      label: 'Pipeline automatisé (issue→PR→merge)',
      swarm: '✅ Full auto',
      claudePro: '❌',
      claudeMax: '❌',
    },
    {
      label: 'Agents parallèles',
      swarm: '✅ 9 agents + 2 utilitaires',
      claudePro: '❌ Mono-agent',
      claudeMax: '❌ Mono-agent',
    },
    {
      label: 'Gates qualité (tests + review)',
      swarm: '✅ Tester + Reviewer',
      claudePro: '❌ Aucune',
      claudeMax: '❌ Aucune',
    },
    {
      label: 'Intégration Git native',
      swarm: '✅ Branche → PR → Merge',
      claudePro: '❌',
      claudeMax: '❌',
    },
    {
      label: 'Contexte maximum',
      swarm: '1M tokens (DeepSeek V4 Pro)',
      claudePro: '1M tokens (Opus 4.8, Sonnet 4.6)',
      claudeMax: '1M tokens (Opus 4.8, Sonnet 4.6)',
    },
    {
      label: 'Déploiement automatisé',
      swarm: '✅ Vercel + Render + Supabase',
      claudePro: '❌ Manuel',
      claudeMax: '❌ Manuel',
    },
    {
      label: 'Documentation auto',
      swarm: '✅ CHANGELOG, README, ARCHITECTURE',
      claudePro: '❌',
      claudeMax: '❌',
    },
    {
      label: 'Contrats TypeScript / OpenAPI',
      swarm: '✅ Génération automatique',
      claudePro: '❌',
      claudeMax: '❌',
    },
  ];

  protected readonly claudeComparisonNote =
    'Comparaison à juin 2025. Les tarifs Claude Pro/Max sont des abonnements fixes sans frais de token supplémentaires dans la limite des quotas. La Swarm fonctionne en API — vous ne payez que les tokens consommés, sans abonnement.';

  /* ==========================================================================
   * Données — Section 6 : Modèle d'IA
   * ========================================================================== */

  protected readonly modelInfo = {
    name: 'DeepSeek V4 Pro',
    description:
      'Modèle unique utilisé par tous les agents de la Swarm — orchestration, planification, implémentation front et back, tests, review et documentation.',
    strengths:
      'Contexte de 1M tokens, raisonnement architectural, génération de code, analyse de codebase.',
    costNote: '0,435 $/M tokens en entrée (cache miss), 0,0036 $/M (cache hit), 0,87 $/M en sortie. Soit ~0,49 $/M effectif (65/35 input/output, 35% cache hit). Tarification API DeepSeek V4 Pro, juin 2025.',
  };

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
        'Pas de support pour les langages exotiques ou les frameworks obscurs — la Swarm s\'appuie sur la documentation disponible',
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
        'Back : inactif sur les projets statiques',
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
      description: 'Comprenez en 3 minutes la proposition de valeur unique de la Swarm : un pipeline qui transforme une issue GitHub en PR validée, testée et documentée — sans intervention humaine.',
    },
    {
      audience: 'Tech leads & CTO',
      description: 'Évaluez la Swarm comme un membre d\'équipe virtuel : parallélisme natif, gates qualité automatisées, documentation vivante. Un multiplicateur de vélocité, pas un remplacement.',
    },
    {
      audience: 'Développeurs',
      description: 'Voyez comment la Swarm élimine les tâches répétitives (tests, documentation, boilerplate) pour vous concentrer sur l\'architecture et les décisions créatives.',
    },
    {
      audience: 'Startups & indés',
      description: 'Un pipeline de développement qui transforme une issue GitHub en PR mergée, à la vitesse d\'une petite équipe. Idéal pour prototyper, itérer et shipper sans friction.',
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

  /** Méthode de retry — efface l'erreur. */
  protected retry(): void {
    this.error.set(null);
  }

  private initContent(): void {
    // Données statiques — aucune initialisation asynchrone nécessaire
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
    this.initScrollAnimations();
  }

  private async initScrollAnimations(): Promise<void> {
    try {
      const revealEls = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');

      if (revealEls.length > 0) {
        await this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
      }
    } catch {
      // Fallback CSS : révéler immédiatement
      const all = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');
      all.forEach((el: Element) => el.classList.add('revealed'));
    }
  }
}
