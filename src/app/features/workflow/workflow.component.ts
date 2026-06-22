import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { AnimationService } from '../../shared/services/animation.service';
import { SeoService } from '../../shared/services/seo.service';
import { JsonLdService } from '../../shared/services/json-ld.service';
import { LanguageService, type Lang } from '../../shared/services/language.service';
import { TranslationService } from '../../shared/services/translation.service';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { ROUTE_COSTS, type RouteCost } from '@shared/data/routes.data';

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

/* ==========================================================================
 * Données bilingues — Section 1 : Hero
 * ========================================================================== */

const HERO: Record<Lang, { title: string; subtitle: string }> = {
  fr: {
    title: 'De l\'issue au merge — sans effort',
    subtitle: 'Une issue GitHub arrive, une pull request mergée en ressort. Entre les deux : classification automatique, routage intelligent, implémentation parallèle, tests rigoureux et documentation vivante. Le tout orchestré sans que vous leviez le petit doigt.',
  },
  en: {
    title: 'From issue to merge — effortlessly',
    subtitle: 'A GitHub issue comes in, a merged pull request comes out. In between: automatic classification, intelligent routing, parallel implementation, rigorous testing, and living documentation. All orchestrated without you lifting a finger.',
  },
};

/* ==========================================================================
 * Données bilingues — Section 2 : Arbre de décision
 * ========================================================================== */

const DECISION_NODES: Record<Lang, Pick<DecisionNode, 'label' | 'description' | 'complexity'>[]> = {
  fr: [
    {
      label: 'Réponse textuelle',
      description: 'Réponse à une question, commande /slash, information. Aucun agent spécialisé — pas de modification de fichier.',
      complexity: 'Minimale',
    },
    {
      label: 'Modification ciblée',
      description: 'Correction ou ajout limité à un fichier. L\'agent adapte le code existant sans planification préalable.',
      complexity: 'Faible',
    },
    {
      label: 'Adaptation transversale',
      description: 'Modification impactant 2–3 fichiers. L\'agent search cartographie les dépendances avant modification.',
      complexity: 'Modérée',
    },
    {
      label: 'Fonctionnalité multi-fichiers',
      description: 'Feature complète avec planification, génération de tests et revue de code automatisée.',
      complexity: 'Élevée',
    },
    {
      label: 'Feature complexe avec contrats',
      description: 'Fonctionnalité majeure nécessitant contrats TypeScript, parallélisme front+back, gates qualité et documentation.',
      complexity: 'Maximale',
    },
  ],
  en: [
    {
      label: 'Text response',
      description: 'Answer to a question, /slash command, information. No specialized agent — no file modification.',
      complexity: 'Minimal',
    },
    {
      label: 'Targeted modification',
      description: 'Fix or addition limited to a single file. The agent adapts existing code without prior planning.',
      complexity: 'Low',
    },
    {
      label: 'Cross-cutting adaptation',
      description: 'Modification impacting 2–3 files. The search agent maps dependencies before modification.',
      complexity: 'Moderate',
    },
    {
      label: 'Multi-file feature',
      description: 'Complete feature with planning, automated test generation, and code review.',
      complexity: 'High',
    },
    {
      label: 'Complex feature with contracts',
      description: 'Major feature requiring TypeScript contracts, front+back parallelism, quality gates, and documentation.',
      complexity: 'Maximum',
    },
  ],
};

const ROUTE_LIST = ['DIRECT', 'SIMPLE', 'ADAPT', 'MEDIUM', 'FULL'] as const;

/* ==========================================================================
 * Données bilingues — Section 3 : Diagramme Mermaid
 * ========================================================================== */

const MERMAID_DIAGRAMS: Record<Lang, string> = {
  fr: `\`\`\`mermaid
graph TB
    ISSUE["📋 Issue GitHub"] --> PRESEARCH["🔍 Pre-search<br/>Étape 0.3"]
    PRESEARCH --> CLASSIFY["🧠 Orchestrateur<br/>Classification tâche"]

    CLASSIFY --> ADAPT["🔄 ADAPT"]
    CLASSIFY --> SIMPLE["🔧 SIMPLE"]
    CLASSIFY --> MEDIUM["📦 MEDIUM"]
    CLASSIFY --> FULL["🏗️ FULL"]



    SIMPLE --> IMPL_SIMPLE["💻 Front ou Back<br/>Implémentation"]
    IMPL_SIMPLE --> TEST["🧪 Tester<br/>Génération + exécution tests"]

    ADAPT --> SEARCH_ADAPT["🔎 Search<br/>Cartographie"]
    SEARCH_ADAPT --> IMPL_ADAPT["💻 Front ou Back<br/>Implémentation"]
    IMPL_ADAPT --> TEST

    MEDIUM --> SEARCH_MED["🔎 Search<br/>Cartographie"]
    SEARCH_MED --> PLAN["🧩 Planner<br/>Planification"]
    PLAN --> IMPL_MEDIUM["💻 Front + Back<br/>Parallèle"]
    IMPL_MEDIUM --> TEST

    FULL --> SEARCH_FULL["🔎 Search<br/>Cartographie"]
    SEARCH_FULL --> PLAN_FULL["🧩 Planner<br/>Planification"]
    PLAN_FULL --> CONTRACT["📝 Contract<br/>Types + API"]
    CONTRACT --> IMPL_FULL["💻 Front + Back<br/>Parallèle"]
    IMPL_FULL --> TEST

    TEST --> REVIEW["👁️ Reviewer<br/>Audit qualité"]
    REVIEW -->|"✅ Approuvé"| WRITER["✍️ Writer<br/>Documentation"]
    REVIEW -->|"❌ Rejeté"| FIX["🔄 Corrections"]
    FIX --> TEST

    WRITER --> COMMIT["📝 Commit + Push"]
    COMMIT --> PR["🔀 Pull Request"]
    PR --> MERGE["🎉 Merge"]


    style ISSUE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style PRESEARCH fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style CLASSIFY fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style SIMPLE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style ADAPT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style MEDIUM fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FULL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style REVIEW fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MERGE fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style WRITER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAN fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAN_FULL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONTRACT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FIX fill:#0E0C09,stroke:#C4780D,color:#C4780D
    linkStyle 21 color:#0E0C09
    linkStyle 22 color:#0E0C09
  \`\`\``,
  en: `\`\`\`mermaid
graph TB
    ISSUE["📋 GitHub Issue"] --> PRESEARCH["🔍 Pre-search<br/>Step 0.3"]
    PRESEARCH --> CLASSIFY["🧠 Orchestrator<br/>Task classification"]

    CLASSIFY --> ADAPT["🔄 ADAPT"]
    CLASSIFY --> SIMPLE["🔧 SIMPLE"]
    CLASSIFY --> MEDIUM["📦 MEDIUM"]
    CLASSIFY --> FULL["🏗️ FULL"]



    SIMPLE --> IMPL_SIMPLE["💻 Front or Back<br/>Implementation"]
    IMPL_SIMPLE --> TEST["🧪 Tester<br/>Generation + test execution"]

    ADAPT --> SEARCH_ADAPT["🔎 Search<br/>Mapping"]
    SEARCH_ADAPT --> IMPL_ADAPT["💻 Front or Back<br/>Implementation"]
    IMPL_ADAPT --> TEST

    MEDIUM --> SEARCH_MED["🔎 Search<br/>Mapping"]
    SEARCH_MED --> PLAN["🧩 Planner<br/>Planning"]
    PLAN --> IMPL_MEDIUM["💻 Front + Back<br/>Parallel"]
    IMPL_MEDIUM --> TEST

    FULL --> SEARCH_FULL["🔎 Search<br/>Mapping"]
    SEARCH_FULL --> PLAN_FULL["🧩 Planner<br/>Planning"]
    PLAN_FULL --> CONTRACT["📝 Contract<br/>Types + API"]
    CONTRACT --> IMPL_FULL["💻 Front + Back<br/>Parallel"]
    IMPL_FULL --> TEST

    TEST --> REVIEW["👁️ Reviewer<br/>Quality audit"]
    REVIEW -->|"✅ Approved"| WRITER["✍️ Writer<br/>Documentation"]
    REVIEW -->|"❌ Rejected"| FIX["🔄 Corrections"]
    FIX --> TEST

    WRITER --> COMMIT["📝 Commit + Push"]
    COMMIT --> PR["🔀 Pull Request"]
    PR --> MERGE["🎉 Merge"]


    style ISSUE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style PRESEARCH fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style CLASSIFY fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style SIMPLE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style ADAPT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style MEDIUM fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FULL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style REVIEW fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MERGE fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style WRITER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAN fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAN_FULL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONTRACT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FIX fill:#0E0C09,stroke:#C4780D,color:#C4780D
    linkStyle 21 color:#0E0C09
    linkStyle 22 color:#0E0C09
  \`\`\``,
};

/* ==========================================================================
 * Données bilingues — Section 4 : Pré-search
 * ========================================================================== */

const PRESEARCH: Record<Lang, { title: string; description: string }> = {
  fr: {
    title: 'Pré-search : le diagnostic qui évite les erreurs',
    description: 'Avant de classifier votre tâche, les agents de la Swarm analysent l\'ensemble du codebase en parallèle. Fichiers impactés, occurrences, complexité réelle — tout est mesuré objectivement. Résultat : la bonne route est choisie à chaque fois, sans tâtonnement.',
  },
  en: {
    title: 'Pre-search: the diagnosis that prevents errors',
    description: 'Before classifying your task, Swarm agents analyze the entire codebase in parallel. Impacted files, occurrences, real complexity — everything is measured objectively. Result: the right route is chosen every time, without trial and error.',
  },
};

const PRESEARCH_THRESHOLDS: Record<Lang, Pick<PreSearchThreshold, 'fichiers' | 'classification'>[]> = {
  fr: [
    { fichiers: '0 fichier', classification: 'Réponse textuelle — aucun agent déclenché' },
    { fichiers: '1 fichier, > 3 occurrences', classification: 'Modification ciblée — agent unique' },
    { fichiers: '2–5 fichiers', classification: 'Adaptation transversale — search + agent' },
    { fichiers: '5–15 fichiers, ≥ 1 feature', classification: 'Feature multi-fichiers — planification + tests' },
    { fichiers: '> 15 fichiers, contrats nécessaires', classification: 'Feature complexe — pipeline complet avec gates' },
  ],
  en: [
    { fichiers: '0 file', classification: 'Text response — no agent triggered' },
    { fichiers: '1 file, > 3 occurrences', classification: 'Targeted modification — single agent' },
    { fichiers: '2–5 files', classification: 'Cross-cutting adaptation — search + agent' },
    { fichiers: '5–15 files, ≥ 1 feature', classification: 'Multi-file feature — planning + tests' },
    { fichiers: '> 15 files, contracts needed', classification: 'Complex feature — full pipeline with gates' },
  ],
};

/* ==========================================================================
 * Données bilingues — Section 5 : Gates qualité
 * ========================================================================== */

const QUALITY_GATES: Record<Lang, Pick<QualityGate, 'description' | 'criteria'>[]> = {
  fr: [
    {
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
      description: 'Audit de sécurité, qualité et cohérence du code ET des tests générés. Approbation ou rejet avec liste précise des corrections.',
      criteria: [
        'Security score ≥ 1.0 (aucune vulnérabilité critique)',
        'Quality score ≥ 0.85 (code propre, maintenable)',
        'Vérification des limites de diff (pas de modification massive non justifiée)',
        'Audit des tests générés (pas de faux positifs, couverture réelle)',
        'Approbation/rejet avec liste exhaustive des issues',
      ],
    },
  ],
  en: [
    {
      description: 'Systematic test generation, execution, and coverage measurement. Blocking threshold: 80%.',
      criteria: [
        'Automatic generation of unit and integration tests',
        'Full test suite execution',
        'Coverage measurement (threshold: ≥ 80%)',
        'Error categorization for granular retry',
        'Detailed report with corrective actions',
      ],
    },
    {
      description: 'Security, quality, and consistency audit of code AND generated tests. Approval or rejection with precise list of corrections.',
      criteria: [
        'Security score ≥ 1.0 (no critical vulnerabilities)',
        'Quality score ≥ 0.85 (clean, maintainable code)',
        'Diff limit verification (no unjustified massive modification)',
        'Generated test audit (no false positives, real coverage)',
        'Approval/rejection with exhaustive issue list',
      ],
    },
  ],
};

/* ==========================================================================
 * Données bilingues — Section 6 : Intégration Git
 * ========================================================================== */

const GIT_STEPS: Record<Lang, Pick<GitStep, 'step' | 'description'>[]> = {
  fr: [
    { step: 'Issue GitHub', description: 'Tout commence par une issue. la Swarm analyse le titre et la description pour classifier automatiquement la tâche.' },
    { step: 'Branche', description: 'Création automatique d\'une branche feature/ suivant la convention swarm-issue-{n}-{description}.' },
    { step: 'Commits', description: 'Commits atomiques avec messages conventionnels (feat:, fix:, docs:). Un commit par étape majeure.' },
    { step: 'Pull Request', description: 'Création automatique de la PR avec description générée, checklist et lien vers l\'issue.' },
    { step: 'Merge', description: 'Après approbation des gates et revue humaine optionnelle, merge automatique dans la branche principale.' },
  ],
  en: [
    { step: 'GitHub Issue', description: 'Everything starts with an issue. The Swarm analyzes the title and description to automatically classify the task.' },
    { step: 'Branch', description: 'Automatic creation of a feature/ branch following the swarm-issue-{n}-{description} convention.' },
    { step: 'Commits', description: 'Atomic commits with conventional messages (feat:, fix:, docs:). One commit per major step.' },
    { step: 'Pull Request', description: 'Automatic PR creation with generated description, checklist, and link to the issue.' },
    { step: 'Merge', description: 'After gate approval and optional human review, automatic merge into the main branch.' },
  ],
};

const GIT_SCRIPTS: Record<Lang, string> = {
  fr: 'Deux scripts automatisent le workflow Git : setup.ts initialise la branche et l\'environnement, finish.ts nettoie, documente et prépare la PR.',
  en: 'Two scripts automate the Git workflow: setup.ts initializes the branch and environment, finish.ts cleans up, documents, and prepares the PR.',
};

const GIT_GRAPH: Record<Lang, string> = {
  fr: `\`\`\`mermaid
gitGraph
   commit id: "main"
   branch feature/swarm-issue-N
   commit id: "implémentation"
   commit id: "tests validés"
   checkout main
   merge feature/swarm-issue-N tag: "squash merge"
   commit id: "main (post-merge)"
\`\`\``,
  en: `\`\`\`mermaid
gitGraph
   commit id: "main"
   branch feature/swarm-issue-N
   commit id: "implementation"
   commit id: "tests validated"
   checkout main
   merge feature/swarm-issue-N tag: "squash merge"
   commit id: "main (post-merge)"
\`\`\``,
};

/* ==========================================================================
 * Données bilingues — Section 7 : Fichiers swarm
 * ========================================================================== */

const SWARM_FILES: Record<Lang, Pick<SwarmFile, 'description'>[]> = {
  fr: [
    {
      description: 'File d\'attente des tâches pour les sessions multi-tâches. Permet au Swarm de traiter jusqu\'à 5 tâches indépendantes en parallèle.',
    },
    {
      description: 'Mémoire persistante des métriques et de l\'historique des sessions. Alimente les tableaux de bord et l\'optimisation continue.',
    },
  ],
  en: [
    {
      description: 'Task queue for multi-task sessions. Allows the Swarm to process up to 5 independent tasks in parallel.',
    },
    {
      description: 'Persistent memory of metrics and session history. Feeds dashboards and continuous optimization.',
    },
  ],
};

/* ==========================================================================
 * Données bilingues — SEO & Schema
 * ========================================================================== */

const SEO_DATA: Record<Lang, { title: string; description: string; schemaName: string; schemaDesc: string; steps: { name: string; text: string }[] }> = {
  fr: {
    title: 'Pipeline de développement',
    description: 'De l\'issue au merge sans effort. Découvrez comment la Swarm orchestre le développement logiciel de bout en bout : classification, routage, implémentation parallèle, tests et revue automatisés.',
    schemaName: 'Pipeline de développement Swarm',
    schemaDesc: 'Étapes du pipeline agentic de bout en bout, de l\'issue GitHub au merge automatisé.',
    steps: [
      { name: 'Pre-search', text: 'Analyse du codebase en parallèle par les agents de la Swarm pour mesurer l\'impact réel de la tâche.' },
      { name: 'Classification', text: 'L\'orchestrateur analyse la complexité et choisit la route appropriée : DIRECT, SIMPLE, ADAPT, MEDIUM ou FULL.' },
      { name: 'Search', text: 'L\'agent Search cartographie le codebase, identifie les fichiers impactés et détecte les patterns.' },
      { name: 'Plan', text: 'L\'agent Planner décompose la tâche en sous-tâches atomiques et détecte les choix architecturaux.' },
      { name: 'Implementation', text: 'Les agents Front et Back implémentent en parallèle, guidés par les contrats TypeScript.' },
      { name: 'Tests', text: 'L\'agent Tester génère et exécute les tests, mesure la couverture (seuil 80 %) et catégorise les erreurs.' },
      { name: 'Review & Merge', text: 'L\'agent Reviewer audite la qualité et la sécurité. Après approbation, le Writer documente et la PR est mergée.' },
    ],
  },
  en: {
    title: 'Development Pipeline',
    description: 'From issue to merge effortlessly. Discover how the Swarm orchestrates end-to-end software development: classification, routing, parallel implementation, automated testing, and review.',
    schemaName: 'Swarm Development Pipeline',
    schemaDesc: 'Steps of the end-to-end agentic pipeline, from GitHub issue to automated merge.',
    steps: [
      { name: 'Pre-search', text: 'Parallel codebase analysis by Swarm agents to measure the real impact of the task.' },
      { name: 'Classification', text: 'The orchestrator analyzes complexity and chooses the appropriate route: DIRECT, SIMPLE, ADAPT, MEDIUM, or FULL.' },
      { name: 'Search', text: 'The Search agent maps the codebase, identifies impacted files, and detects patterns.' },
      { name: 'Plan', text: 'The Planner agent breaks down the task into atomic sub-tasks and detects architectural choices.' },
      { name: 'Implementation', text: 'Front and Back agents implement in parallel, guided by TypeScript contracts.' },
      { name: 'Tests', text: 'The Tester agent generates and executes tests, measures coverage (80% threshold), and categorizes errors.' },
      { name: 'Review & Merge', text: 'The Reviewer agent audits quality and security. After approval, the Writer documents and the PR is merged.' },
    ],
  },
};

/**
 * Page Workflow Interactive — Composant pur Apple-grade.
 *
 * Présente le pipeline complet de la Swarm en 6 sections plein écran :
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
  imports: [MarkdownRendererComponent, UiButtonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective],
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.scss'],
})
export class WorkflowComponent implements OnInit, AfterViewInit, OnDestroy {
  private hostRef = inject(ElementRef);
  private readonly animService = inject(AnimationService);
  private readonly seoService = inject(SeoService);
  private readonly jsonLdService = inject(JsonLdService);
  private readonly langService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);

  private get lang(): Lang { return this.langService.currentLang(); }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string { return this.translationService.translate(key); }

  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Données — Section 1 : Hero
   * ========================================================================== */

  protected get heroTitle(): string { return HERO[this.lang].title; }
  protected get heroSubtitle(): string { return HERO[this.lang].subtitle; }

  /* ==========================================================================
   * Données — Section 2 : Arbre de décision
   * ========================================================================== */

  protected get decisionNodes(): readonly DecisionNode[] {
    const l = DECISION_NODES[this.lang];
    return ROUTE_LIST.map((route, i) => ({
      route,
      label: l[i].label,
      description: l[i].description,
      complexity: l[i].complexity,
      tokens: ROUTE_COSTS[route].tokens,
      cost: ROUTE_COSTS[route].cost,
      agents: ROUTE_COSTS[route].agents,
    }));
  }

  /* ==========================================================================
   * Données — Section 3 : Diagramme Mermaid
   * ========================================================================== */

  protected get mermaidDiagram(): string { return MERMAID_DIAGRAMS[this.lang]; }

  /* ==========================================================================
   * Données — Section 4 : Pré-search
   * ========================================================================== */

  protected get preSearchTitle(): string { return PRESEARCH[this.lang].title; }
  protected get preSearchDescription(): string { return PRESEARCH[this.lang].description; }

  protected get preSearchThresholds(): readonly PreSearchThreshold[] {
    const l = PRESEARCH_THRESHOLDS[this.lang];
    return ROUTE_LIST.map((route, i) => ({
      route,
      fichiers: l[i].fichiers,
      tokens: `${ROUTE_COSTS[route].tokens}`,
      classification: l[i].classification,
    }));
  }

  /* ==========================================================================
   * Données — Section 5 : Gates qualité
   * ========================================================================== */

  protected get qualityGates(): readonly QualityGate[] {
    const l = QUALITY_GATES[this.lang];
    return [
      { name: 'Tester', icon: '🧪', ...l[0] },
      { name: 'Reviewer', icon: '👁️', ...l[1] },
    ];
  }

  /* ==========================================================================
   * Données — Section 6 : Intégration Git
   * ========================================================================== */

  protected get gitSteps(): readonly GitStep[] {
    return GIT_STEPS[this.lang].map((s, i) => ({
      ...s,
      icon: ['📋', '🌿', '📝', '🔀', '🎉'][i],
    }));
  }

  protected get gitScriptsDescription(): string { return GIT_SCRIPTS[this.lang]; }

  protected get gitGraphDiagram(): string { return GIT_GRAPH[this.lang]; }

  /* ==========================================================================
   * Données — Section 7 : Fichiers swarm
   * ========================================================================== */

  protected get swarmFiles(): readonly SwarmFile[] {
    return SWARM_FILES[this.lang].map((s, i) => ({
      name: ['.swarm-queue.json', '.agent-memory.json'][i],
      icon: ['📋', '🧠'][i],
      description: s.description,
      structure: [
        `{
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
        `{
  "sessions": [
    {
      "id": "uuid",
      "route": "MEDIUM",
      "tokensUsed": 400000,
      "cost": 0.20,
      "duration": "3m42s",
      "testsPassed": 12,
      "coverage": 87
    }
  ],
  "aggregates": {
    "totalSessions": 42,
    "totalTokens": 16800000,
    "totalCost": 8.40,
    "avgCoverage": 85
  }
}`,
      ][i],
    }));
  }

  /* ==========================================================================
   * Références DOM pour les animations
   * ========================================================================== */

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    this.initContent();
    this.initSeoAndSchemas();
  }

  protected retry(): void {
    this.error.set(null);
  }

  private initContent(): void {
    // Données statiques — aucune initialisation asynchrone nécessaire
  }

  /** Initialise les métadonnées SEO et le schéma HowTo pour la page workflow */
  private initSeoAndSchemas(): void {
    const canonicalUrl = 'https://swarm-wiki.vercel.app/workflow';
    const seo = SEO_DATA[this.lang];

    this.seoService.updatePageMeta({
      title: seo.title,
      description: seo.description,
      canonicalUrl,
      type: 'article',
      author: 'Joh Tandou',
    });

    const howToSchema = this.jsonLdService.generateHowToSchema({
      name: seo.schemaName,
      description: seo.schemaDesc,
      steps: seo.steps,
    });

    this.jsonLdService.addSchemas([howToSchema]);
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
    this.initScrollAnimations();
  }

  private async initScrollAnimations(): Promise<void> {
    try {
      const revealEls = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');

      if (revealEls.length > 0) {
        await this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
      }
    } catch {
      // Fallback CSS : ajouter .revealed à tous les éléments .reveal-on-scroll
      const all = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');
      all.forEach((el: Element) => el.classList.add('revealed'));
    }
  }
}
