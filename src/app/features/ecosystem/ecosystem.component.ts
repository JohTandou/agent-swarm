import { Component, OnInit, AfterViewInit, OnDestroy, signal, inject, ElementRef } from '@angular/core';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';

/** Délai de simulation du chargement (ms) */
const LOADING_SIMULATION_MS = 400;
/** Intervalle de vérification DOM prêt (ms) */
const READY_CHECK_INTERVAL_MS = 100;
/** Timeout de sécurité vérification DOM (ms) */
const READY_CHECK_TIMEOUT_MS = 2000;

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

/** Section de AGENTS.md */
interface AgentsSection {
  readonly title: string;
  readonly icon: string;
  readonly description: string;
}

/** Intégration MCP */
interface Integration {
  readonly name: string;
  readonly icon: string;
  readonly provider: string;
  readonly description: string;
  readonly features: readonly string[];
}

/**
 * Page Écosystème — Composant pur Apple-grade.
 *
 * Présente l'infrastructure complète du Swarm en 5 sections plein écran :
 * 1. Hero avec statistiques clés
 * 2. Structure .opencode/ — arborescence commentée
 * 3. swarm-workflow.json — configuration décortiquée
 * 4. AGENTS.md — sections clés
 * 5. Architecture Globale — diagramme Mermaid + intégrations MCP
 */
@Component({
  selector: 'app-ecosystem',
  standalone: true,
  imports: [MarkdownRendererComponent, UiButtonComponent, UiSkeletonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective],
  templateUrl: './ecosystem.component.html',
  styleUrls: ['./ecosystem.component.scss'],
})
export class EcosystemComponent implements OnInit, AfterViewInit, OnDestroy {
  private hostRef = inject(ElementRef);

  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Données — Section 1 : Hero
   * ========================================================================== */

  protected readonly heroTitle = 'L\'Écosystème Technique';
  protected readonly heroSubtitle =
    'Le Swarm ne se résume pas à ses agents. C\'est un écosystème complet de fichiers de configuration, de documentation vivante, de skills spécialisées et d\'intégrations MCP. Cette page décortique chaque composant de l\'infrastructure qui rend l\'orchestration possible.';

  /* ==========================================================================
   * Données — Section 2 : Structure .opencode/
   * ========================================================================== */

  protected readonly directoryTree: readonly DirectoryEntry[] = [
    {
      name: 'AGENTS.md', icon: '📜',
      description: 'Bible du projet (~400 lignes). Définit la stack technique, les conventions, les agents, les skills, la palette de couleurs et le protocole comportemental. Lu par l\'orchestrateur à chaque exécution.',
    },
    {
      name: 'swarm-workflow.json', icon: '⚙️',
      description: 'Configuration centralisée du pipeline Swarm. Contrôle l\'automatisation des issues, branches, PR, tests et les seuils de qualité.',
    },
    {
      name: 'package.json', icon: '📦',
      description: 'Dépendances Node.js du workspace OpenCode — notamment les packages MCP (Supabase, Vercel, Render, Playwright).',
    },
    {
      name: 'agents/', icon: '🤖', badge: '9 fichiers',
      description: 'Définitions des agents spécialisés. Chaque fichier décrit le rôle, les déclencheurs et le comportement d\'un agent.',
      children: [
        { name: 'orchestrateur.md', icon: '🎯', description: 'Chef d\'orchestre — interface utilisateur unique et routage des tâches' },
        { name: 'search.md', icon: '🔎', description: 'Cartographie du codebase, identifie les fichiers impactés, détecte les patterns' },
        { name: 'planner.md', icon: '📐', description: 'Planifie le travail en tâches atomiques, détecte les choix architecturaux' },
        { name: 'contract.md', icon: '📝', description: 'Écrit les types TypeScript, la spécification OpenAPI et les migrations Supabase' },
        { name: 'front.md', icon: '🎨', description: 'Implémente les composants UI Apple-grade avec animations premium' },
        { name: 'back.md', icon: '⚡', description: 'Implémente le backend, génère scripts, crons et configurations' },
        { name: 'tester.md', icon: '🧪', description: 'Génère les tests manquants, exécute la suite, mesure la couverture' },
        { name: 'reviewer.md', icon: '👁️', description: 'Audit sécurité et qualité du code avant merge. Note minimale : 0.85' },
        { name: 'writer.md', icon: '📚', description: 'Met à jour la documentation après chaque commit' },
      ],
    },
    {
      name: 'skills/', icon: '🧩', badge: '26 dossiers',
      description: 'Modules de compétences spécialisées chargés à la demande. Chaque skill est un dossier autonome avec ses propres instructions, workflows et ressources.',
    },
    {
      name: 'commands/', icon: '⌨️', badge: '3 commandes',
      description: 'Commandes slash disponibles dans l\'IDE : /docs (documentation), /help (aide contextuelle), /status (état de la session).',
    },
    {
      name: 'tools/', icon: '🔧',
      description: 'Scripts d\'automatisation Git : setup.ts (initialisation branche + issue), finish.ts (nettoyage, build, tests, PR), merge.ts (fusion).',
    },
    {
      name: 'scripts/', icon: '📜',
      description: 'Scripts utilitaires — notamment mcp-playwright.sh pour les tests E2E automatisés via Playwright.',
    },
  ];

  /* ==========================================================================
   * Données — Section 3 : swarm-workflow.json décortiqué
   * ========================================================================== */

  protected readonly workflowCategories: readonly WorkflowCategory[] = [
    {
      name: 'Pipeline', icon: '⚙️',
      description: 'Automatisation du cycle de vie des tâches.',
      fields: [
        { path: 'swarm.workflow.auto_create_github_issue', label: 'Création automatique d\'issue', type: 'boolean', value: 'true', description: 'Le Swarm crée une issue GitHub pour chaque nouvelle tâche identifiée.' },
        { path: 'swarm.workflow.auto_create_branch', label: 'Création automatique de branche', type: 'boolean', value: 'true', description: 'Une branche feature/ est créée automatiquement au démarrage d\'une tâche.' },
        { path: 'swarm.workflow.auto_create_pr', label: 'Création automatique de PR', type: 'boolean', value: 'true', description: 'Une pull request est ouverte automatiquement après validation des gates.' },
        { path: 'swarm.workflow.pr_draft_by_default', label: 'PR en draft par défaut', type: 'boolean', value: 'true', description: 'Les PR sont créées en mode brouillon, prêtes pour revue humaine optionnelle.' },
        { path: 'swarm.workflow.auto_decompose_tasks', label: 'Décomposition automatique', type: 'boolean', value: 'true', description: 'Les tâches complexes sont automatiquement décomposées en sous-tâches atomiques.' },
        { path: 'swarm.workflow.max_tasks_per_session', label: 'Tâches max par session', type: 'number', value: '5', description: 'Nombre maximum de tâches traitées en parallèle dans une session.' },
        { path: 'swarm.workflow.cleanup_processes_after_run', label: 'Nettoyage post-exécution', type: 'boolean', value: 'true', description: 'Les processus et fichiers temporaires sont nettoyés après chaque exécution.' },
      ],
    },
    {
      name: 'Qualité', icon: '🛡️',
      description: 'Gates qualité et seuils de validation.',
      fields: [
        { path: 'swarm.workflow.enforce_quality_gates', label: 'Gates qualité obligatoires', type: 'boolean', value: 'true', description: 'Les gates qualité (tester + reviewer) sont appliquées sur les routes MEDIUM et FULL.' },
        { path: 'swarm.workflow.require_tester_pass', label: 'Validation tester obligatoire', type: 'boolean', value: 'true', description: 'Le merge est bloqué tant que le tester n\'a pas validé la couverture ≥ 80 %.' },
        { path: 'swarm.workflow.require_reviewer_approve', label: 'Approbation reviewer obligatoire', type: 'boolean', value: 'true', description: 'Le merge est bloqué sans l\'approbation du reviewer (security ≥ 1.0, quality ≥ 0.85).' },
        { path: 'swarm.workflow.require_e2e_for_new_features', label: 'E2E pour nouvelles features', type: 'boolean', value: 'true', description: 'Toute nouvelle feature nécessite au moins un test E2E Playwright avant merge.' },
      ],
    },
    {
      name: 'Git & Branches', icon: '🌿',
      description: 'Conventions de nommage et intégration GitHub.',
      fields: [
        { path: 'swarm.github.default_base_branch', label: 'Branche de base', type: 'string', value: 'main', description: 'Branche cible par défaut pour les pull requests.' },
        { path: 'swarm.github.branch_prefix', label: 'Préfixe de branche', type: 'string', value: 'feature/swarm-', description: 'Toutes les branches suivent la convention feature/swarm-issue-{n}-{description}.' },
      ],
    },
    {
      name: 'Tests', icon: '🧪',
      description: 'Configuration des tests automatisés.',
      fields: [
        { path: 'swarm.testing.e2e_frontend_command', label: 'Commande serveur E2E', type: 'string', value: 'ng serve --port 3000', description: 'Commande pour démarrer le serveur de développement avant les tests E2E.' },
        { path: 'swarm.testing.e2e_frontend_url', label: 'URL de test E2E', type: 'string', value: 'http://localhost:3000', description: 'URL cible pour les tests Playwright.' },
        { path: 'swarm.testing.e2e_max_retries', label: 'Tentatives E2E max', type: 'number', value: '2', description: 'Nombre maximum de tentatives en cas d\'échec des tests E2E.' },
        { path: 'swarm.testing.e2e_timeout_minutes', label: 'Timeout E2E (minutes)', type: 'number', value: '15', description: 'Délai maximum avant abandon des tests E2E.' },
        { path: 'swarm.testing.coverage_threshold', label: 'Seuil de couverture (%)', type: 'number', value: '80', description: 'Pourcentage minimum de couverture de code exigé.' },
        { path: 'swarm.testing.coverage_enforce', label: 'Couverture obligatoire', type: 'boolean', value: 'true', description: 'Le seuil de couverture est bloquant — aucun merge si non atteint.' },
        { path: 'swarm.testing.test_scope', label: 'Périmètre des tests', type: 'string', value: 'changed-only', description: 'Seuls les fichiers modifiés sont testés pour optimiser le temps d\'exécution.' },
      ],
    },
  ];

  /* ==========================================================================
   * Données — Section 4 : AGENTS.md sections
   * ========================================================================== */

  protected readonly agentsMdSections: readonly AgentsSection[] = [
    { title: 'Stack Technique & Langue', icon: '🛠️', description: 'Angular 19 standalone, TypeScript strict, Tailwind v4, palette 6 couleurs, Cabinet Grotesk + Satoshi. Tout le socle technique en un seul endroit.' },
    { title: 'Protocole Comportemental', icon: '📋', description: 'Règles absolues pour tous les agents : réfléchir avant de coder, simplicité, modifications chirurgicales, exécution guidée par les objectifs.' },
    { title: 'Merge Gate', icon: '🚪', description: 'Règles de merge strictes : tester PASS obligatoire, reviewer APPROVE pour MEDIUM/FULL, E2E requis pour nouvelles features. Aucune exception.' },
    { title: 'Philosophie Projet', icon: '💡', description: 'Fusion de trois disciplines : ingénierie logicielle senior, design UX/UI, copywriting technique. Chaque décision est le produit de ces trois rôles.' },
    { title: 'Standards Apple-Grade', icon: '✨', description: 'Typographie monumentale, animations scroll-driven, dégradés sophistiqués, système d\'élévation dark N1-N4. Chaque pixel est intentionnel.' },
    { title: 'Directives par Agent', icon: '🤖', description: 'Rôles et responsabilités de chaque agent : front (UI Apple-grade), back (inactif sur ce projet statique), tester, reviewer, writer.' },
    { title: 'Palette & Typographie', icon: '🎨', description: '6 couleurs exclusives en CSS custom properties. Cabinet Grotesk pour les titres, Satoshi pour le corps. Dark mode natif, pas de toggle.' },
    { title: 'Standards Techniques', icon: '⚡', description: 'Architecture, performance, accessibilité WCAG AA, contenu statique en Markdown avec frontmatter YAML.' },
    { title: 'Processus de Génération', icon: '🔄', description: 'Checklist en 7 étapes avant de coder toute interface : palette, typo, élévation, animation, moment ludique, responsive, Apple-grade.' },
    { title: 'Checklist de Livraison', icon: '✅', description: '16 points de vérification avant de déclarer une tâche terminée — de la palette aux animations en passant par le contenu Markdown.' },
  ];

  /* ==========================================================================
   * Données — Section 5 : Intégrations
   * ========================================================================== */

  protected readonly integrations: readonly Integration[] = [
    { name: 'Supabase', icon: '🗄️', provider: 'MCP', description: 'Base de données Postgres, authentification, Edge Functions et stockage. Utilisé pour les projets full-stack générés par le Swarm.', features: ['Postgres managé', 'Auth intégrée', 'Edge Functions', 'Migrations automatiques'] },
    { name: 'Vercel', icon: '▲', provider: 'MCP', description: 'Déploiement continu, CDN global, serverless functions. Cible de déploiement par défaut pour les projets frontend.', features: ['Déploiement Git auto', 'CDN global', 'Preview deployments', 'Analytics intégrés'] },
    { name: 'Render', icon: '⚡', provider: 'MCP', description: 'Hébergement de services web, cron jobs, Postgres managé. Utilisé pour les backends et bases de données.', features: ['Web services', 'Cron jobs', 'Postgres', 'Key-Value stores'] },
    { name: 'Playwright', icon: '🎭', provider: 'MCP', description: 'Tests end-to-end cross-browser. Intégré au pipeline Swarm pour valider chaque PR sur Chromium et mobile (iPhone 14).', features: ['Tests multi-navigateurs', 'Auto-waiting', 'Visual comparisons', 'iPhone 14 simulé'] },
  ];

  protected readonly mermaidDiagram = `\`\`\`mermaid
graph TB
    subgraph IDE["🖥️ OpenCode IDE"]
        AGENTS["📜 AGENTS.md<br/>Bible du projet"]
        CONFIG["⚙️ swarm-workflow.json<br/>Configuration"]
        SKILLS["🧩 Skills (26)<br/>Modules spécialisés"]
    end

    IDE --> ORCH["🎯 Orchestrateur<br/>Classification & Routage"]

    ORCH --> ISSUE["📋 Issue GitHub"]
    ISSUE --> BRANCH["🌿 Branche feature/"]

    BRANCH --> SEARCH["🔎 Search<br/>Cartographie"]
    SEARCH --> PLAN["📐 Planner<br/>Planification"]

    PLAN --> FRONT["🎨 Front<br/>UI Apple-grade"]
    PLAN --> BACK["⚡ Back<br/>API & configs"]
    PLAN --> CONTRACT["📝 Contract<br/>Types & OpenAPI"]

    FRONT --> TEST["🧪 Tester<br/>Couverture ≥ 80%"]
    BACK --> TEST
    CONTRACT --> TEST

    TEST --> REVIEW["👁️ Reviewer<br/>Score ≥ 0.85"]

    REVIEW -->|"✅ Approuvé"| FINISH["🔧 finish.ts<br/>Nettoyage & PR"]
    REVIEW -->|"❌ Rejeté"| FIX["🔄 Corrections"]
    FIX --> TEST

    FINISH --> PR["🔀 Pull Request"]
    PR --> MERGE["🎉 Merge sur main"]
    MERGE --> WRITER["📚 Writer<br/>Documentation"]

    subgraph MCP["🔌 Intégrations MCP"]
        SUPABASE["🗄️ Supabase<br/>Postgres + Auth"]
        VERCEL["▲ Vercel<br/>Déploiement CDN"]
        RENDER["⚡ Render<br/>Services + Cron"]
        PLAYWRIGHT["🎭 Playwright<br/>Tests E2E"]
    end

    FRONT -.-> VERCEL
    FRONT -.-> PLAYWRIGHT
    BACK -.-> SUPABASE
    BACK -.-> RENDER
    TEST -.-> PLAYWRIGHT
    WRITER -.-> SUPABASE

    style IDE fill:#2A2520,stroke:#8E8882,color:#F5F0EB
    style ORCH fill:#4A4540,stroke:#F0A522,color:#F0A522
    style BRANCH fill:#3A3530,stroke:#8E8882,color:#F5F0EB
    style SEARCH fill:#3A3530,stroke:#8E8882,color:#F5F0EB
    style PLAN fill:#4A4540,stroke:#F0A522,color:#F0A522
    style FRONT fill:#2A2520,stroke:#8E8882,color:#F5F0EB
    style BACK fill:#2A2520,stroke:#8E8882,color:#F5F0EB
    style CONTRACT fill:#2A2520,stroke:#8E8882,color:#F5F0EB
    style TEST fill:#3A3530,stroke:#F0A522,color:#F0A522
    style REVIEW fill:#3A3530,stroke:#F0A522,color:#F0A522
    style MERGE fill:#4A4540,stroke:#F0A522,color:#F0A522
    style WRITER fill:#2A2520,stroke:#8E8882,color:#8E8882
    style MCP fill:#2A2520,stroke:#8E8882,color:#8E8882
  \`\`\``;

  /* ==========================================================================
   * Références DOM pour les animations
   * ========================================================================== */

  private _readyCheckInterval: ReturnType<typeof setInterval> | null = null;

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
    setTimeout(() => {
      this.loading.set(false);
    }, LOADING_SIMULATION_MS);
  }

  ngAfterViewInit(): void {
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.stopReadyCheck();
  }

  /* ==========================================================================
   * Animations au scroll — IntersectionObserver
   * ========================================================================== */

  private setupScrollAnimations(): void {
    this._readyCheckInterval = setInterval(() => {
      if (!this.loading()) {
        this.stopReadyCheck();
        this.observeAnimatedElements();
      }
    }, READY_CHECK_INTERVAL_MS);

    setTimeout(() => this.stopReadyCheck(), READY_CHECK_TIMEOUT_MS);
  }

  /**
   * Observe les éléments .reveal-on-scroll pour déclencher
   * les animations d'apparition avec stagger.
   */
  private observeAnimatedElements(): void {
    const revealElements = this.hostRef.nativeElement.querySelectorAll('.reveal-on-scroll');

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );

    revealElements.forEach((el: Element) => scrollObserver.observe(el));
  }

  private stopReadyCheck(): void {
    if (this._readyCheckInterval) {
      clearInterval(this._readyCheckInterval);
      this._readyCheckInterval = null;
    }
  }
}
