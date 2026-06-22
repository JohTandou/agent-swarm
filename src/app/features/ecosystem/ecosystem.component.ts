import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { AnimationService } from '../../shared/services/animation.service';
import { LanguageService, type Lang } from '../../shared/services/language.service';
import { TranslationService } from '../../shared/services/translation.service';

/** Entrée de l'arborescence du répertoire */
interface DirectoryEntry {
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly children?: readonly DirectoryEntry[];
  readonly badge?: string;
}

/** Champ de configuration workflow */
interface WorkflowField {
  readonly path: string;
  readonly label: string;
  readonly type: 'boolean' | 'number' | 'string';
  readonly value: string;
  readonly description: string;
}

/** Catégorie de configuration workflow */
interface WorkflowCategory {
  readonly name: string;
  readonly icon: string;
  readonly description: string;
  readonly fields: readonly WorkflowField[];
}

/** Intégration MCP */
interface Integration {
  readonly name: string;
  readonly icon: string;
  readonly provider: string;
  readonly description: string;
  readonly features: readonly string[];
}

/* ==========================================================================
 * Données bilingues — Hero
 * ========================================================================== */

const ECOSYSTEM_HERO: Record<Lang, { title: string; subtitle: string }> = {
  fr: {
    title: 'Les coulisses de la Swarm',
    subtitle: 'Derrière les neuf agents se cache un écosystème complet : configuration centralisée, documentation auto-générée, skills activables à la demande et intégrations natives avec Supabase, Vercel, Render et Playwright. Voici comment tout cela s\'articule.',
  },
  en: {
    title: 'Behind the Scenes of the Swarm',
    subtitle: 'Behind the nine agents lies a complete ecosystem: centralized configuration, auto-generated documentation, on-demand activatable skills, and native integrations with Supabase, Vercel, Render, and Playwright. Here\'s how it all fits together.',
  },
};

/* ==========================================================================
 * Données bilingues — Directory tree (descriptions seulement)
 * ========================================================================== */

const DIRECTORY_TREE_DESCS: Record<Lang, { desc: string; childrenDescs?: string[] }[]> = {
  fr: [
    { desc: 'Bible du projet (~400 lignes). Définit la stack technique, les conventions, les agents, les skills, la palette de couleurs et le protocole comportemental. Lu par l\'orchestrateur à chaque exécution.' },
    { desc: 'Configuration centralisée du pipeline Swarm. Contrôle l\'automatisation des issues, branches, PR, tests et les seuils de qualité.' },
    { desc: 'Dépendances Node.js du workspace OpenCode — notamment les packages MCP (Supabase, Vercel, Render, Playwright).' },
    {
      desc: 'Définitions des agents spécialisés. Chaque fichier décrit le rôle, les déclencheurs et le comportement d\'un agent.',
      childrenDescs: [
        'Chef d\'orchestre — interface utilisateur unique et routage des tâches',
        'Cartographie du codebase, identifie les fichiers impactés, détecte les patterns',
        'Planifie le travail en tâches atomiques, détecte les choix architecturaux',
        'Écrit les types TypeScript, la spécification OpenAPI et les migrations Supabase',
        'Implémente les composants UI Apple-grade avec animations premium',
        'Implémente le backend, génère scripts, crons et configurations',
        'Génère les tests manquants, exécute la suite, mesure la couverture',
        'Audit sécurité et qualité du code avant merge. Note minimale : 0.85',
        'Met à jour la documentation après chaque commit',
      ],
    },
    { desc: 'Modules de compétences spécialisées chargés à la demande. Chaque skill est un dossier autonome avec ses propres instructions, workflows et ressources.' },
    { desc: 'Commandes slash disponibles dans l\'IDE : /docs (documentation), /help (aide contextuelle), /status (état de la session).' },
    { desc: 'Scripts d\'automatisation Git : setup.ts (initialisation branche + issue), finish.ts (nettoyage, build, tests, PR), merge.ts (fusion).' },
    { desc: 'Scripts utilitaires — notamment mcp-playwright.sh pour les tests E2E automatisés via Playwright.' },
  ],
  en: [
    { desc: 'Project bible (~400 lines). Defines the tech stack, conventions, agents, skills, color palette, and behavioral protocol. Read by the orchestrator on every execution.' },
    { desc: 'Centralized configuration of the Swarm pipeline. Controls automation of issues, branches, PRs, tests, and quality thresholds.' },
    { desc: 'Node.js dependencies for the OpenCode workspace — notably MCP packages (Supabase, Vercel, Render, Playwright).' },
    {
      desc: 'Specialized agent definitions. Each file describes the role, triggers, and behavior of an agent.',
      childrenDescs: [
        'Conductor — single user interface and task routing',
        'Codebase mapping, identifies impacted files, detects patterns',
        'Plans work into atomic tasks, detects architectural choices',
        'Writes TypeScript types, OpenAPI specification, and Supabase migrations',
        'Implements Apple-grade UI components with premium animations',
        'Implements backend, generates scripts, crons, and configurations',
        'Generates missing tests, runs the suite, measures coverage',
        'Security and code quality audit before merge. Minimum score: 0.85',
        'Updates documentation after each commit',
      ],
    },
    { desc: 'Specialized skill modules loaded on demand. Each skill is a self-contained folder with its own instructions, workflows, and resources.' },
    { desc: 'Slash commands available in the IDE: /docs (documentation), /help (contextual help), /status (session status).' },
    { desc: 'Git automation scripts: setup.ts (branch + issue initialization), finish.ts (cleanup, build, tests, PR), merge.ts (merge).' },
    { desc: 'Utility scripts — notably mcp-playwright.sh for automated E2E testing via Playwright.' },
  ],
};

/* ==========================================================================
 * Données bilingues — Workflow config fields (descriptions seulement)
 * ========================================================================== */

const WORKFLOW_FIELD_DESCS: Record<Lang, { categoryDesc: string; fieldDescs: string[] }[]> = {
  fr: [
    {
      categoryDesc: 'Automatisation du cycle de vie des tâches.',
      fieldDescs: [
        'la Swarm crée une issue GitHub pour chaque nouvelle tâche identifiée.',
        'Une branche feature/ est créée automatiquement au démarrage d\'une tâche.',
        'Une pull request est ouverte automatiquement après validation des gates.',
        'Les PR sont créées en mode brouillon, prêtes pour revue humaine optionnelle.',
        'Les tâches complexes sont automatiquement décomposées en sous-tâches atomiques.',
        'Nombre maximum de tâches traitées en parallèle dans une session.',
        'Les processus et fichiers temporaires sont nettoyés après chaque exécution.',
      ],
    },
    {
      categoryDesc: 'Gates qualité et seuils de validation.',
      fieldDescs: [
        'Les gates qualité (tester + reviewer) sont appliquées sur les tâches MEDIUM et FULL.',
        'Le merge est bloqué tant que le tester n\'a pas validé la couverture ≥ 80 %.',
        'Le merge est bloqué sans l\'approbation du reviewer (security ≥ 1.0, quality ≥ 0.85).',
        'Toute nouvelle feature nécessite au moins un test E2E Playwright avant merge.',
      ],
    },
    {
      categoryDesc: 'Conventions de nommage et intégration GitHub.',
      fieldDescs: [
        'Branche cible par défaut pour les pull requests.',
        'Toutes les branches suivent la convention feature/swarm-issue-{n}-{description}.',
      ],
    },
    {
      categoryDesc: 'Configuration des tests automatisés.',
      fieldDescs: [
        'Commande pour démarrer le serveur de développement avant les tests E2E.',
        'URL cible pour les tests Playwright.',
        'Nombre maximum de tentatives en cas d\'échec des tests E2E.',
        'Délai maximum avant abandon des tests E2E.',
        'Pourcentage minimum de couverture de code exigé.',
        'Le seuil de couverture est bloquant — aucun merge si non atteint.',
        'Seuls les fichiers modifiés sont testés pour optimiser le temps d\'exécution.',
      ],
    },
  ],
  en: [
    {
      categoryDesc: 'Task lifecycle automation.',
      fieldDescs: [
        'The Swarm creates a GitHub issue for every new identified task.',
        'A feature/ branch is automatically created when a task starts.',
        'A pull request is automatically opened after gate validation.',
        'PRs are created in draft mode, ready for optional human review.',
        'Complex tasks are automatically decomposed into atomic sub-tasks.',
        'Maximum number of tasks processed in parallel in a session.',
        'Processes and temporary files are cleaned up after each execution.',
      ],
    },
    {
      categoryDesc: 'Quality gates and validation thresholds.',
      fieldDescs: [
        'Quality gates (tester + reviewer) are applied to MEDIUM and FULL tasks.',
        'Merge is blocked until the tester validates coverage ≥ 80%.',
        'Merge is blocked without reviewer approval (security ≥ 1.0, quality ≥ 0.85).',
        'Any new feature requires at least one Playwright E2E test before merge.',
      ],
    },
    {
      categoryDesc: 'Naming conventions and GitHub integration.',
      fieldDescs: [
        'Default target branch for pull requests.',
        'All branches follow the feature/swarm-issue-{n}-{description} convention.',
      ],
    },
    {
      categoryDesc: 'Automated testing configuration.',
      fieldDescs: [
        'Command to start the development server before E2E tests.',
        'Target URL for Playwright tests.',
        'Maximum number of retries on E2E test failure.',
        'Maximum delay before abandoning E2E tests.',
        'Minimum required code coverage percentage.',
        'Coverage threshold is blocking — no merge if not met.',
        'Only modified files are tested to optimize execution time.',
      ],
    },
  ],
};

/* ==========================================================================
 * Données bilingues — Intégrations (descriptions + features)
 * ========================================================================== */

const INTEGRATION_DATA: Record<Lang, { desc: string; features: string[] }[]> = {
  fr: [
    { desc: 'Base de données Postgres, authentification, Edge Functions et stockage. Utilisé pour les projets full-stack générés par la Swarm.', features: ['Postgres managé', 'Auth intégrée', 'Edge Functions', 'Migrations automatiques'] },
    { desc: 'Déploiement continu, CDN global, serverless functions. Cible de déploiement par défaut pour les projets frontend.', features: ['Déploiement Git auto', 'CDN global', 'Preview deployments', 'Analytics intégrés'] },
    { desc: 'Hébergement de services web, cron jobs, Postgres managé. Utilisé pour les backends et bases de données.', features: ['Web services', 'Cron jobs', 'Postgres', 'Key-Value stores'] },
    { desc: 'Tests end-to-end cross-browser. Intégré au pipeline Swarm pour valider chaque PR sur Chromium et mobile (iPhone 14).', features: ['Tests multi-navigateurs', 'Auto-waiting', 'Visual comparisons', 'iPhone 14 simulé'] },
    { desc: 'Recherche de documentation temps réel pour tous les frameworks et bibliothèques. Résout les Library ID et interroge la doc à jour pour éviter les APIs obsolètes.', features: ['Recherche documentation', 'Résolution Library ID', 'APIs à jour', 'Multi-framework'] },
    { desc: 'Génération de composants UI via IA. Recherche, inspiration et raffinement de composants React/Next.js avec design system intégré.', features: ['Génération composants', 'Recherche UI', 'Inspiration design', 'Refinement visuel'] },
  ],
  en: [
    { desc: 'Postgres database, authentication, Edge Functions, and storage. Used for full-stack projects generated by the Swarm.', features: ['Managed Postgres', 'Built-in Auth', 'Edge Functions', 'Automatic Migrations'] },
    { desc: 'Continuous deployment, global CDN, serverless functions. Default deployment target for frontend projects.', features: ['Auto Git Deploy', 'Global CDN', 'Preview Deployments', 'Built-in Analytics'] },
    { desc: 'Web service hosting, cron jobs, managed Postgres. Used for backends and databases.', features: ['Web Services', 'Cron Jobs', 'Postgres', 'Key-Value Stores'] },
    { desc: 'Cross-browser end-to-end testing. Integrated into the Swarm pipeline to validate each PR on Chromium and mobile (iPhone 14).', features: ['Multi-browser Tests', 'Auto-waiting', 'Visual Comparisons', 'Simulated iPhone 14'] },
    { desc: 'Real-time documentation search for all frameworks and libraries. Resolves Library IDs and queries up-to-date docs to avoid obsolete APIs.', features: ['Documentation Search', 'Library ID Resolution', 'Up-to-date APIs', 'Multi-framework'] },
    { desc: 'AI-powered UI component generation. Search, inspiration, and refinement of React/Next.js components with integrated design system.', features: ['Component Generation', 'UI Search', 'Design Inspiration', 'Visual Refinement'] },
  ],
};

/* ==========================================================================
 * Données bilingues — Diagramme Mermaid
 * ========================================================================== */

const ECOSYSTEM_MERMAID: Record<Lang, string> = {
  fr: `\`\`\`mermaid
graph TB
    subgraph IDE["OPENCODE"]
        AGENTS["📜 AGENTS.md<br/>Bible du projet"]
        CONFIG["⚙️ swarm-workflow.json<br/>Configuration"]
        SKILLS["🧩 Skills (3)<br/>Modules spécialisés"]
    end

    IDE --> ORCH["🧠 Orchestrateur<br/>Classification & Routage"]

    subgraph SOURCE["SETUP.TS"]
      ISSUE["📋 Issue GitHub"]
      ISSUE --> BRANCH["🌿 Branche feature/"]
    end

    ORCH --> ISSUE

    BRANCH --> SEARCH["🔎 Search<br/>Cartographie"]
    SEARCH --> PLAN["🧩 Planner<br/>Planification"]

    PLAN --> FRONT["🎨 Front<br/>UI Apple-grade"]
    PLAN --> BACK["⚙️ Back<br/>API & configs"]
    PLAN --> CONTRACT["📋 Contract<br/>Types & OpenAPI"]

    FRONT --> TEST["🧪 Tester<br/>Couverture ≥ 80%"]
    BACK --> TEST
    CONTRACT --> TEST

    subgraph finish["FINISH.TS"]
      TEST --> REVIEW["👁️ Reviewer<br/>Score ≥ 0.85"]
      REVIEW -->|"✅ Approuvé"| WRITER["✍️ Writer<br/>Documentation"]
      REVIEW -->|"❌ Rejeté"| FIX["🔄 Corrections"]
      FIX --> TEST
      WRITER --> COMMIT["Commit + Push"]
      COMMIT --> PR["🔀 Pull Request"]
    end
    style finish fill:transparent,stroke:#7A8899,color:#7A8899
    style SOURCE fill:transparent,stroke:#7A8899,color:#7A8899

    PR --> MERGE["MERGE.TS<br/>Fusion dans main"]

    subgraph MCP["INTÉGRATIONS MCP"]
        SUPABASE["🗄️ Supabase<br/>Postgres + Auth"]
        VERCEL["▲ Vercel<br/>Déploiement CDN"]
        RENDER["⚡ Render<br/>Services + Cron"]
        PLAYWRIGHT["🎭 Playwright<br/>Tests E2E"]
        CONTEXT7["📖 Context7<br/>Documentation"]
        MAGIC["🪄 21st.dev<br/>Composants UI"]
    end

    FRONT -.-> VERCEL
    FRONT -.-> PLAYWRIGHT
    FRONT -.-> MAGIC
    BACK -.-> SUPABASE
    BACK -.-> RENDER
    TEST -.-> PLAYWRIGHT
    WRITER -.-> SUPABASE
    SEARCH -.-> CONTEXT7
    CONTRACT -.-> CONTEXT7

    style IDE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style AGENTS fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONFIG fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style SKILLS fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style ORCH fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style ISSUE fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style BRANCH fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style SEARCH fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style PLAN fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style FRONT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style BACK fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style CONTRACT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style TEST fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style REVIEW fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style WRITER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style COMMIT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PR fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FIX fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MERGE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style MCP fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style SUPABASE fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style VERCEL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style RENDER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAYWRIGHT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONTEXT7 fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MAGIC fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style finish fill:transparent,stroke:#7A8899,color:#7A8899
    style SOURCE fill:transparent,stroke:#7A8899,color:#7A8899
    linkStyle 12 color:#0E0C09
    linkStyle 13 color:#0E0C09
  \`\`\``,
  en: `\`\`\`mermaid
graph TB
    subgraph IDE["OPENCODE"]
        AGENTS["📜 AGENTS.md<br/>Project Bible"]
        CONFIG["⚙️ swarm-workflow.json<br/>Configuration"]
        SKILLS["🧩 Skills (3)<br/>Specialized Modules"]
    end

    IDE --> ORCH["🧠 Orchestrator<br/>Classification & Routing"]

    subgraph SOURCE["SETUP.TS"]
      ISSUE["📋 GitHub Issue"]
      ISSUE --> BRANCH["🌿 feature/ Branch"]
    end

    ORCH --> ISSUE

    BRANCH --> SEARCH["🔎 Search<br/>Mapping"]
    SEARCH --> PLAN["🧩 Planner<br/>Planning"]

    PLAN --> FRONT["🎨 Front<br/>Apple-grade UI"]
    PLAN --> BACK["⚙️ Back<br/>API & configs"]
    PLAN --> CONTRACT["📋 Contract<br/>Types & OpenAPI"]

    FRONT --> TEST["🧪 Tester<br/>Coverage ≥ 80%"]
    BACK --> TEST
    CONTRACT --> TEST

    subgraph finish["FINISH.TS"]
      TEST --> REVIEW["👁️ Reviewer<br/>Score ≥ 0.85"]
      REVIEW -->|"✅ Approved"| WRITER["✍️ Writer<br/>Documentation"]
      REVIEW -->|"❌ Rejected"| FIX["🔄 Corrections"]
      FIX --> TEST
      WRITER --> COMMIT["Commit + Push"]
      COMMIT --> PR["🔀 Pull Request"]
    end
    style finish fill:transparent,stroke:#7A8899,color:#7A8899
    style SOURCE fill:transparent,stroke:#7A8899,color:#7A8899

    PR --> MERGE["MERGE.TS<br/>Merge into main"]

    subgraph MCP["MCP INTEGRATIONS"]
        SUPABASE["🗄️ Supabase<br/>Postgres + Auth"]
        VERCEL["▲ Vercel<br/>CDN Deployment"]
        RENDER["⚡ Render<br/>Services + Cron"]
        PLAYWRIGHT["🎭 Playwright<br/>E2E Tests"]
        CONTEXT7["📖 Context7<br/>Documentation"]
        MAGIC["🪄 21st.dev<br/>UI Components"]
    end

    FRONT -.-> VERCEL
    FRONT -.-> PLAYWRIGHT
    FRONT -.-> MAGIC
    BACK -.-> SUPABASE
    BACK -.-> RENDER
    TEST -.-> PLAYWRIGHT
    WRITER -.-> SUPABASE
    SEARCH -.-> CONTEXT7
    CONTRACT -.-> CONTEXT7

    style IDE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style AGENTS fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONFIG fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style SKILLS fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style ORCH fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style ISSUE fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style BRANCH fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style SEARCH fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style PLAN fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style FRONT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style BACK fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style CONTRACT fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style TEST fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style REVIEW fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style WRITER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style COMMIT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PR fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style FIX fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MERGE fill:#0E0C09,stroke:#7A8899,color:#F5F0EB
    style MCP fill:#0E0C09,stroke:#7A8899,color:#7A8899
    style SUPABASE fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style VERCEL fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style RENDER fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style PLAYWRIGHT fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style CONTEXT7 fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style MAGIC fill:#0E0C09,stroke:#C4780D,color:#C4780D
    style finish fill:transparent,stroke:#7A8899,color:#7A8899
    style SOURCE fill:transparent,stroke:#7A8899,color:#7A8899
    linkStyle 12 color:#0E0C09
    linkStyle 13 color:#0E0C09
  \`\`\``,
};

/**
 * Page Écosystème — Composant pur Apple-grade.
 *
 * Présente l'infrastructure complète de la Swarm en 5 sections plein écran :
 * 1. Hero avec statistiques clés
 * 2. Structure .opencode/ — arborescence commentée
 * 3. swarm-workflow.json — configuration décortiquée
 * 4. AGENTS.md — sections clés
 * 5. Architecture Globale — diagramme Mermaid + intégrations MCP
 */
@Component({
  selector: 'app-ecosystem',
  standalone: true,
  imports: [MarkdownRendererComponent, UiButtonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective],
  templateUrl: './ecosystem.component.html',
  styleUrls: ['./ecosystem.component.scss'],
})
export class EcosystemComponent implements OnInit, AfterViewInit, OnDestroy {
  private hostRef = inject(ElementRef);
  private readonly animService = inject(AnimationService);
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

  protected get heroTitle(): string { return ECOSYSTEM_HERO[this.lang].title; }
  protected get heroSubtitle(): string { return ECOSYSTEM_HERO[this.lang].subtitle; }

  /* ==========================================================================
   * Données — Section 2 : Structure .opencode/
   * ========================================================================== */

  protected get directoryTree(): readonly DirectoryEntry[] {
    const l = DIRECTORY_TREE_DESCS[this.lang];
    const staticData: Omit<DirectoryEntry, 'description' | 'children'>[] = [
      { name: 'AGENTS.md', icon: '📜' },
      { name: 'swarm-workflow.json', icon: '⚙️' },
      { name: 'package.json', icon: '📦' },
      { name: 'agents/', icon: '🤖', badge: '9 fichiers' },
      { name: 'skills/', icon: '🧩', badge: '3 skills' },
      { name: 'commands/', icon: '⌨️', badge: '3 commandes' },
      { name: 'tools/', icon: '🔧' },
      { name: 'scripts/', icon: '📜' },
    ];
    const childNames = [
      'build.md (orchestrateur)', 'search.md', 'planner.md', 'contract.md',
      'front.md', 'back.md', 'tester.md', 'reviewer.md', 'writer.md',
    ];
    const childIcons = ['🎯', '🔎', '📐', '📝', '🎨', '⚡', '🧪', '👁️', '📚'];

    return staticData.map((d, i) => ({
      ...d,
      description: l[i].desc,
      children: l[i].childrenDescs?.map((cd, ci) => ({
        name: childNames[ci],
        icon: childIcons[ci],
        description: cd,
      })),
    }));
  }

  /* ==========================================================================
   * Données — Section 3 : swarm-workflow.json décortiqué
   * ========================================================================== */

  protected get workflowCategories(): readonly WorkflowCategory[] {
    const l = WORKFLOW_FIELD_DESCS[this.lang];
    const staticCats: Omit<WorkflowCategory, 'description'>[] = [
      { name: 'Pipeline', icon: '⚙️', fields: [
        { path: 'swarm.workflow.auto_create_github_issue', label: 'Création automatique d\'issue', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.auto_create_branch', label: 'Création automatique de branche', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.auto_create_pr', label: 'Création automatique de PR', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.pr_draft_by_default', label: 'PR en draft par défaut', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.auto_decompose_tasks', label: 'Décomposition automatique', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.max_tasks_per_session', label: 'Tâches max par session', type: 'number' as const, value: '5', description: '' },
        { path: 'swarm.workflow.cleanup_processes_after_run', label: 'Nettoyage post-exécution', type: 'boolean' as const, value: 'true', description: '' },
      ] },
      { name: 'Qualité', icon: '🛡️', fields: [
        { path: 'swarm.workflow.enforce_quality_gates', label: 'Gates qualité obligatoires', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.require_tester_pass', label: 'Validation tester obligatoire', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.require_reviewer_approve', label: 'Approbation reviewer obligatoire', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.workflow.require_e2e_for_new_features', label: 'E2E pour nouvelles features', type: 'boolean' as const, value: 'true', description: '' },
      ] },
      { name: 'Git & Branches', icon: '🌿', fields: [
        { path: 'swarm.github.default_base_branch', label: 'Branche de base', type: 'string' as const, value: 'main', description: '' },
        { path: 'swarm.github.branch_prefix', label: 'Préfixe de branche', type: 'string' as const, value: 'feature/swarm-', description: '' },
      ] },
      { name: 'Tests', icon: '🧪', fields: [
        { path: 'swarm.testing.e2e_frontend_command', label: 'Commande serveur E2E', type: 'string' as const, value: 'ng serve --port 3000', description: '' },
        { path: 'swarm.testing.e2e_frontend_url', label: 'URL de test E2E', type: 'string' as const, value: 'http://localhost:3000', description: '' },
        { path: 'swarm.testing.e2e_max_retries', label: 'Tentatives E2E max', type: 'number' as const, value: '2', description: '' },
        { path: 'swarm.testing.e2e_timeout_minutes', label: 'Timeout E2E (minutes)', type: 'number' as const, value: '15', description: '' },
        { path: 'swarm.testing.coverage_threshold', label: 'Seuil de couverture (%)', type: 'number' as const, value: '80', description: '' },
        { path: 'swarm.testing.coverage_enforce', label: 'Couverture obligatoire', type: 'boolean' as const, value: 'true', description: '' },
        { path: 'swarm.testing.test_scope', label: 'Périmètre des tests', type: 'string' as const, value: 'changed-only', description: '' },
      ] },
    ];
    return staticCats.map((c, i) => ({
      ...c,
      description: l[i].categoryDesc,
      fields: c.fields.map((f, j) => ({ ...f, description: l[i].fieldDescs[j] })),
    }));
  }

  /**
   * Données — Section 5 : Intégrations
   * ========================================================================== */

  protected readonly integrations: readonly Integration[] = [
    { name: 'Supabase', icon: '🗄️', provider: 'MCP', description: '', features: [] },
    { name: 'Vercel', icon: '▲', provider: 'MCP', description: '', features: [] },
    { name: 'Render', icon: '⚡', provider: 'MCP', description: '', features: [] },
    { name: 'Playwright', icon: '🎭', provider: 'MCP', description: '', features: [] },
    { name: 'Context7', icon: '📖', provider: 'MCP', description: '', features: [] },
    { name: '21st.dev (Magic)', icon: '🪄', provider: 'MCP', description: '', features: [] },
  ] as const;

  protected get localizedIntegrations(): readonly Integration[] {
    const l = INTEGRATION_DATA[this.lang];
    return this.integrations.map((i, idx) => ({ ...i, ...l[idx] }));
  }

  protected get mermaidDiagram(): string { return ECOSYSTEM_MERMAID[this.lang]; }

  /* ==========================================================================
   * Références DOM pour les animations
   * ========================================================================== */

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngOnInit(): void {
    this.initContent();
  }

  protected retry(): void {
    this.error.set(null);
  }

  private initContent(): void {
    // Données statiques — aucune initialisation asynchrone nécessaire
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  ngOnDestroy(): void {
    this.animService.killAll();
  }

  /* ==========================================================================
   * Animations au scroll — GSAP via AnimationService
   * ========================================================================== */

  private initScrollAnimations(): void {
    const hostEl = this.hostRef.nativeElement as HTMLElement;
    const revealEls = hostEl.querySelectorAll('.reveal-on-scroll');
    this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
  }
}
