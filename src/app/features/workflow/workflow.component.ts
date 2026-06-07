import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { AnimationService } from '../../shared/services/animation.service';

/** Délai de simulation du chargement (ms) */
const LOADING_SIMULATION_MS = 400;
/** Intervalle de vérification DOM prêt (ms) */
const READY_CHECK_INTERVAL_MS = 100;
/** Timeout de sécurité vérification DOM (ms) */
const READY_CHECK_TIMEOUT_MS = 2000;

/** Nœud de l'arbre de décision (une route du pipeline) */
interface DecisionNode {
  readonly route: string;
  readonly label: string;
  readonly description: string;
  readonly complexity: string;
  readonly tokens: string;
  readonly cost: string;
  readonly agents: string;
}

/** Seuil de classification pré-search */
interface PreSearchThreshold {
  readonly route: string;
  readonly fichiers: string;
  readonly tokens: string;
  readonly classification: string;
}

/** Gate qualité */
interface QualityGate {
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly criteria: readonly string[];
}

/** Étape du pipeline Git */
interface GitStep {
  readonly step: string;
  readonly icon: string;
  readonly description: string;
}

/** Fichier swarm */
interface SwarmFile {
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly structure: string;
}

/**
 * Page Workflow Interactive — Composant pur Apple-grade.
 *
 * Présente le pipeline complet du Swarm en 6 sections plein écran :
 * 1. Hero
 * 2. Arbre de décision interactif (5 routes)
 * 3. Diagramme Mermaid du pipeline complet
 * 4. Pré-search expliqué
 * 5. Gates qualité (tester + reviewer)
 * 6. Intégration Git + Fichiers swarm
 */
@Component({
  selector: 'app-workflow',
  standalone: true,
  imports: [MarkdownRendererComponent],
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit, AfterViewInit, OnDestroy {
  private hostRef = inject(ElementRef);

  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Données — Section 1 : Hero
   * ========================================================================== */

  protected readonly heroTitle = 'Le Pipeline Swarm';
  protected readonly heroSubtitle =
    'De la réception d\'une issue GitHub à la pull request mergée, le Swarm orchestre un pipeline d\'agents IA spécialisés. Chaque tâche est automatiquement classifiée, routée, implémentée, testée, revue et documentée — sans intervention humaine.';

  /* ==========================================================================
   * Données — Section 2 : Arbre de décision
   * ========================================================================== */

  protected readonly decisionNodes: readonly DecisionNode[] = [
    {
      route: 'DIRECT',
      label: 'Correction triviale',
      description: 'Modification d\'une ligne, typo, commentaire. Aucun agent spécialisé — la correction est appliquée directement.',
      complexity: 'Minimale',
      tokens: '~5 K',
      cost: '~0,02 $',
      agents: 'Aucun (direct)',
    },
    {
      route: 'SIMPLE',
      label: 'Modification ciblée',
      description: 'Correction ou ajout limité à un fichier. L\'agent adapte le code existant sans planification préalable.',
      complexity: 'Faible',
      tokens: '~50 K',
      cost: '~0,25 $',
      agents: 'Front ou Back',
    },
    {
      route: 'ADAPT',
      label: 'Adaptation transversale',
      description: 'Modification impactant 2–3 fichiers. L\'agent search cartographie les dépendances avant modification.',
      complexity: 'Modérée',
      tokens: '~100 K',
      cost: '~0,50 $',
      agents: 'Search → Front ou Back',
    },
    {
      route: 'MEDIUM',
      label: 'Fonctionnalité multi-fichiers',
      description: 'Feature complète avec planification, génération de tests et revue de code automatisée.',
      complexity: 'Élevée',
      tokens: '~247 K',
      cost: '~1,25 $',
      agents: 'Planner → Front + Back + Tester + Reviewer',
    },
    {
      route: 'FULL',
      label: 'Feature complexe avec contrats',
      description: 'Fonctionnalité majeure nécessitant contrats TypeScript, parallélisme front+back, gates qualité et documentation.',
      complexity: 'Maximale',
      tokens: '~500 K',
      cost: '~2,50 $',
      agents: 'Planner → Contract → Front ∥ Back → Tester → Reviewer → Writer',
    },
  ];

  /* ==========================================================================
   * Données — Section 3 : Diagramme Mermaid
   * ========================================================================== */

  protected readonly mermaidDiagram = `\`\`\`mermaid
graph TB
    ISSUE["📋 Issue GitHub"] --> PRESEARCH["🔍 Pre-search<br/>Étape 0.3"]
    PRESEARCH --> CLASSIFY["🏷️ Classification<br/>Route automatique"]
    CLASSIFY --> DIRECT["⚡ DIRECT"]
    CLASSIFY --> SIMPLE["🔧 SIMPLE"]
    CLASSIFY --> ADAPT["🔄 ADAPT"]
    CLASSIFY --> MEDIUM["📦 MEDIUM"]
    CLASSIFY --> FULL["🏗️ FULL"]

    DIRECT --> DONE_DIRECT["✅ Correction directe"]

    SIMPLE --> SEARCH["🔎 Search<br/>Cartographie"]
    SEARCH --> IMPL_SIMPLE["💻 Implémentation<br/>Front ou Back"]
    IMPL_SIMPLE --> TEST["🧪 Tester<br/>Génération + exécution tests"]

    ADAPT --> SEARCH_ADAPT["🔎 Search<br/>Analyse dépendances"]
    SEARCH_ADAPT --> IMPL_ADAPT["💻 Implémentation<br/>Cross-cutting"]
    IMPL_ADAPT --> TEST

    MEDIUM --> PLAN["📐 Planner<br/>Planification"]
    PLAN --> IMPL_MEDIUM["💻 Front ∥ Back<br/>Parallèle"]
    IMPL_MEDIUM --> TEST

    FULL --> PLAN_FULL["📐 Planner<br/>Planification"]
    PLAN_FULL --> CONTRACT["📝 Contract<br/>Types + API"]
    CONTRACT --> IMPL_FULL["💻 Front ∥ Back<br/>Parallèle"]
    IMPL_FULL --> TEST

    TEST --> REVIEW["👁️ Reviewer<br/>Audit qualité"]
    REVIEW -->|"✅ Approuvé"| COMMIT["📝 Commit<br/>+ Documentation"]
    REVIEW -->|"❌ Rejeté"| FIX["🔄 Corrections"]
    FIX --> TEST

    COMMIT --> PR["🔀 Pull Request"]
    PR --> MERGE["🎉 Merge"]
    MERGE --> DOCS["📚 Writer<br/>Documentation"]
    DOCS --> DONE["🏁 Terminé"]

    style ISSUE fill:#4A4540,stroke:#8E8882,color:#F5F0EB
    style PRESEARCH fill:#3A3530,stroke:#F0A522,color:#F0A522
    style CLASSIFY fill:#3A3530,stroke:#F0A522,color:#F0A522
    style DONE fill:#2A2520,stroke:#8E8882,color:#8E8882
    style DIRECT fill:#2A2520,stroke:#8E8882,color:#8E8882
    style SIMPLE fill:#3A3530,stroke:#8E8882,color:#F5F0EB
    style ADAPT fill:#3A3530,stroke:#8E8882,color:#F5F0EB
    style MEDIUM fill:#4A4540,stroke:#F0A522,color:#F0A522
    style FULL fill:#4A4540,stroke:#F0A522,color:#F0A522
    style REVIEW fill:#3A3530,stroke:#F0A522,color:#F0A522
    style MERGE fill:#4A4540,stroke:#F0A522,color:#F0A522
    style DONE_DIRECT fill:#2A2520,stroke:#8E8882,color:#8E8882
    style DOCS fill:#2A2520,stroke:#8E8882,color:#8E8882
    style DONE fill:#2A2520,stroke:#F0A522,color:#F0A522
  \`\`\``;

  /* ==========================================================================
   * Données — Section 4 : Pré-search
   * ========================================================================== */

  protected readonly preSearchTitle = 'Étape 0.3 — Pre-search';
  protected readonly preSearchDescription =
    'Avant toute classification, le Swarm exécute une phase de pre-search : un grep parallèle sur l\'ensemble du codebase pour identifier les fichiers impactés, compter les occurrences et évaluer la complexité réelle de la tâche. Cette étape garantit que la route choisie correspond au niveau de complexité réel, pas à une estimation humaine approximative.';

  protected readonly preSearchThresholds: readonly PreSearchThreshold[] = [
    {
      route: 'DIRECT',
      fichiers: '1 fichier, ≤ 3 occurrences',
      tokens: '< 5 K',
      classification: 'Modification triviale — exécution immédiate',
    },
    {
      route: 'SIMPLE',
      fichiers: '1 fichier, > 3 occurrences',
      tokens: '5–50 K',
      classification: 'Modification ciblée — agent unique',
    },
    {
      route: 'ADAPT',
      fichiers: '2–5 fichiers',
      tokens: '50–100 K',
      classification: 'Adaptation transversale — search + agent',
    },
    {
      route: 'MEDIUM',
      fichiers: '5–15 fichiers, ≥ 1 feature',
      tokens: '100–300 K',
      classification: 'Feature multi-fichiers — planification + tests',
    },
    {
      route: 'FULL',
      fichiers: '> 15 fichiers, contrats nécessaires',
      tokens: '300 K – 1 M',
      classification: 'Feature complexe — pipeline complet avec gates',
    },
  ];

  /* ==========================================================================
   * Données — Section 5 : Gates qualité
   * ========================================================================== */

  protected readonly qualityGates: readonly QualityGate[] = [
    {
      name: 'Tester',
      icon: '🧪',
      description: 'Génération systématique de tests, exécution et mesure de couverture. Seuil bloquant : 80 %.',
      criteria: [
        'Génération automatique de tests unitaires et d\'intégration',
        'Exécution complète de la suite de tests',
        'Mesure de couverture (seuil : ≥ 80 %)',
        'Catégorisation des erreurs pour retry granulaire',
        'Rapport détaillé avec actions correctives',
      ],
    },
    {
      name: 'Reviewer',
      icon: '👁️',
      description: 'Audit de sécurité, qualité et cohérence du code ET des tests générés. Approbation ou rejet avec liste précise des corrections.',
      criteria: [
        'Security score ≥ 1.0 (aucune vulnérabilité critique)',
        'Quality score ≥ 0.85 (code propre, maintenable)',
        'Vérification des limites de diff (pas de modification massive non justifiée)',
        'Audit des tests générés (pas de faux positifs, couverture réelle)',
        'Approbation/rejet avec liste exhaustive des issues',
      ],
    },
  ];

  /* ==========================================================================
   * Données — Section 6 : Intégration Git
   * ========================================================================== */

  protected readonly gitSteps: readonly GitStep[] = [
    {
      step: 'Issue GitHub',
      icon: '📋',
      description: 'Tout commence par une issue. Le Swarm analyse le titre et la description pour classifier automatiquement la tâche.',
    },
    {
      step: 'Branche',
      icon: '🌿',
      description: 'Création automatique d\'une branche feature/ suivant la convention swarm-issue-{n}-{description}.',
    },
    {
      step: 'Commits',
      icon: '📝',
      description: 'Commits atomiques avec messages conventionnels (feat:, fix:, docs:). Un commit par étape majeure.',
    },
    {
      step: 'Pull Request',
      icon: '🔀',
      description: 'Création automatique de la PR avec description générée, checklist et lien vers l\'issue.',
    },
    {
      step: 'Merge',
      icon: '🎉',
      description: 'Après approbation des gates et revue humaine optionnelle, merge automatique dans la branche principale.',
    },
  ];

  protected readonly gitScriptsDescription =
    'Deux scripts automatisent le workflow Git : setup.ts initialise la branche et l\'environnement, finish.ts nettoie, documente et prépare la PR.';

  /* ==========================================================================
   * Données — Section 7 : Fichiers swarm
   * ========================================================================== */

  protected readonly swarmFiles: readonly SwarmFile[] = [
    {
      name: '.swarm-queue.json',
      icon: '📋',
      description: 'File d\'attente des tâches pour les sessions multi-tâches. Permet au Swarm de traiter jusqu\'à 5 tâches indépendantes en parallèle.',
      structure: `{
  "sessionId": "uuid",
  "tasks": [
    {
      "id": "T1",
      "route": "MEDIUM",
      "status": "pending|in_progress|done|failed",
      "agent": "front",
      "description": "..."
    }
  ],
  "maxParallel": 5,
  "maxCycles": 5
}`,
    },
    {
      name: '.agent-memory.json',
      icon: '🧠',
      description: 'Mémoire persistante des métriques et de l\'historique des sessions. Alimente les tableaux de bord et l\'optimisation continue.',
      structure: `{
  "sessions": [
    {
      "id": "uuid",
      "route": "MEDIUM",
      "tokensUsed": 247000,
      "cost": 1.25,
      "duration": "3m42s",
      "testsPassed": 12,
      "coverage": 87
    }
  ],
  "aggregates": {
    "totalSessions": 42,
    "totalTokens": 5200000,
    "totalCost": 26.50,
    "avgCoverage": 85
  }
}`,
    },
  ];

  /* ==========================================================================
   * Références DOM pour les animations
   * ========================================================================== */

  private readonly animService = inject(AnimationService);

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    this.initContent();
  }

  protected retry(): void {
    this.loading.set(true);
    this.error.set(null);
    this.initContent();
  }

  private initContent(): void {
    // Simulation d'un court chargement (données statiques, transition fluide)
    setTimeout(() => {
      this.loading.set(false);
    }, LOADING_SIMULATION_MS);
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.animService.killAll();
  }

  /* ==========================================================================
   * Animations au scroll — GSAP (fallback CSS)
   * ========================================================================== */

  private async setupScrollAnimations(): Promise<void> {
    // Attendre que le loading soit terminé
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
      const nodeCards = this.hostRef.nativeElement.querySelectorAll('.node-card');

      if (revealEls.length > 0) {
        await this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
      }
      if (nodeCards.length > 0) {
        await this.animService.revealOnScroll(Array.from(nodeCards), { staggerMs: 100 });
      }

      // Mermaid section highlight
      const mermaidSection = this.hostRef.nativeElement.querySelector('.mermaid-section');
      if (mermaidSection) {
          const { ScrollTrigger } = await this.animService.initGsap();
            // Utiliser ScrollTrigger pour ajouter la classe mermaid-visible
        ScrollTrigger.create({
          trigger: mermaidSection,
          start: 'top 80%',
          once: true,
          onEnter: () => mermaidSection.classList.add('mermaid-visible'),
        });
      }
    } catch {
      // Fallback CSS : ajouter .revealed à tous les éléments .reveal-on-scroll
      const all = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll, .node-card');
      all.forEach((el: Element) => el.classList.add('revealed'));
    }
  }
}
