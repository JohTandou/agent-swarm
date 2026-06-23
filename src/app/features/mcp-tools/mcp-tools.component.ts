import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { LanguageService, type Lang } from '../../shared/services/language.service';
import { TranslationService } from '../../shared/services/translation.service';

/* ==========================================================================
 * Types — Outil MCP
 * ========================================================================== */

interface McpTool {
  readonly name: string;
  readonly description: string;
  readonly params: readonly string[];
}

interface McpCategory {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
  readonly tools: readonly McpTool[];
  readonly exampleCode: string;
  readonly playgroundLabel: string;
}

/* ==========================================================================
 * Constantes de configuration
 * ========================================================================== */

const CATEGORIES: readonly string[] = ['supabase', 'vercel', 'render', 'playwright', 'context7', 'magic'];

/* ==========================================================================
 * Données statiques — Outils MCP par catégorie
 * ========================================================================== */

const SUPABASE_TOOLS: readonly McpTool[] = [
  { name: 'apply_migration', description: 'Applique une migration DDL à la base de données', params: ['name', 'query'] },
  { name: 'execute_sql', description: 'Exécute du SQL brut dans la base Postgres', params: ['query'] },
  { name: 'list_tables', description: 'Liste toutes les tables d\'un ou plusieurs schémas', params: ['schemas'] },
  { name: 'list_migrations', description: 'Liste toutes les migrations de la base', params: [] },
  { name: 'get_logs', description: 'Récupère les logs par type de service', params: ['service'] },
  { name: 'deploy_edge_function', description: 'Déploie une Edge Function sur Supabase', params: ['name', 'files', 'entrypoint_path'] },
  { name: 'create_branch', description: 'Crée une branche de développement', params: ['name'] },
  { name: 'merge_branch', description: 'Fusionne une branche de développement en production', params: ['branch_id'] },
  { name: 'search_docs', description: 'Recherche dans la documentation Supabase via GraphQL', params: ['graphql_query'] },
  { name: 'generate_typescript_types', description: 'Génère les types TypeScript depuis la base', params: [] },
];

const VERCEL_TOOLS: readonly McpTool[] = [
  { name: 'deploy_to_vercel', description: 'Déploie le projet courant sur Vercel', params: [] },
  { name: 'list_deployments', description: 'Liste tous les déploiements d\'un projet', params: ['projectId', 'teamId'] },
  { name: 'get_deployment', description: 'Récupère un déploiement par ID ou URL', params: ['idOrUrl', 'teamId'] },
  { name: 'list_projects', description: 'Liste tous les projets Vercel', params: ['teamId'] },
  { name: 'get_project', description: 'Récupère un projet spécifique', params: ['projectId', 'teamId'] },
  { name: 'check_domain_availability', description: 'Vérifie la disponibilité de noms de domaine', params: ['names'] },
  { name: 'get_runtime_logs', description: 'Récupère les logs d\'exécution', params: ['projectId', 'teamId', 'deploymentId', 'level', 'since'] },
  { name: 'search_documentation', description: 'Recherche dans la documentation Vercel', params: ['topic', 'tokens'] },
];

const RENDER_TOOLS: readonly McpTool[] = [
  { name: 'create_web_service', description: 'Crée un nouveau service web', params: ['name', 'runtime', 'repo', 'buildCommand', 'startCommand', 'plan'] },
  { name: 'create_postgres', description: 'Crée une nouvelle instance Postgres', params: ['name', 'plan', 'version', 'diskSizeGb'] },
  { name: 'create_static_site', description: 'Crée un nouveau site statique', params: ['name', 'buildCommand', 'publishPath', 'repo'] },
  { name: 'list_services', description: 'Liste tous les services du compte', params: ['includePreviews'] },
  { name: 'get_service', description: 'Récupère les détails d\'un service', params: ['serviceId'] },
  { name: 'get_metrics', description: 'Récupère les métriques de performance', params: ['resourceId', 'metricTypes', 'startTime', 'endTime'] },
  { name: 'list_deploys', description: 'Liste les déploiements d\'un service', params: ['serviceId', 'limit', 'cursor'] },
  { name: 'get_deploy', description: 'Récupère un déploiement spécifique', params: ['serviceId', 'deployId'] },
  { name: 'list_logs', description: 'Liste les logs selon des filtres', params: ['resource', 'level', 'startTime', 'endTime', 'limit'] },
  { name: 'create_cron_job', description: 'Crée une tâche planifiée (cron)', params: ['name', 'schedule', 'runtime', 'buildCommand', 'startCommand'] },
];

const PLAYWRIGHT_TOOLS: readonly McpTool[] = [
  { name: 'browser_navigate', description: 'Navigue vers une URL', params: ['url'] },
  { name: 'browser_click', description: 'Effectue un clic sur un élément', params: ['element', 'target'] },
  { name: 'browser_type', description: 'Saisit du texte dans un champ', params: ['target', 'text'] },
  { name: 'browser_snapshot', description: 'Capture le snapshot d\'accessibilité de la page', params: [] },
  { name: 'browser_take_screenshot', description: 'Prend une capture d\'écran de la page', params: ['filename', 'type', 'fullPage'] },
  { name: 'browser_fill_form', description: 'Remplit plusieurs champs de formulaire', params: ['fields'] },
  { name: 'browser_hover', description: 'Survole un élément', params: ['target'] },
  { name: 'browser_press_key', description: 'Appuie sur une touche du clavier', params: ['key'] },
  { name: 'browser_select_option', description: 'Sélectionne une option dans un menu déroulant', params: ['target', 'values'] },
  { name: 'browser_wait_for', description: 'Attend l\'apparition ou la disparition d\'un texte', params: ['time', 'text', 'textGone'] },
];

const CONTEXT7_TOOLS: readonly McpTool[] = [
  { name: 'resolve-library-id', description: 'Résout un identifiant de bibliothèque à partir du nom et de la version', params: ['libraryName'] },
  { name: 'query-docs', description: 'Interroge la documentation à jour d\'une bibliothèque', params: ['libraryId', 'query'] },
];

const MAGIC_TOOLS: readonly McpTool[] = [
  { name: 'component-builder', description: 'Génère un composant UI à partir d\'une description textuelle', params: ['prompt', 'stack'] },
  { name: 'inspiration', description: 'Recherche des inspirations de design par mots-clés', params: ['query'] },
  { name: 'refiner', description: 'Améliore un composant existant avec des standards de qualité', params: ['componentCode', 'improvements'] },
  { name: 'logo-search', description: 'Recherche des logos d\'entreprise par nom de domaine', params: ['domain'] },
];

/* ==========================================================================
 * Données structurées — Catégories MCP
 * ========================================================================== */

const MCP_CATEGORIES: Record<string, McpCategory> = {
  supabase: {
    id: 'supabase',
    label: 'Supabase',
    icon: '🗄️',
    description: 'Outils MCP pour la gestion de bases de données Supabase : migrations, branches de développement, Edge Functions, logs et documentation.',
    tools: SUPABASE_TOOLS,
    exampleCode: `// Déploiement d'une Edge Function
supabase_deploy_edge_function({
  name: "hello-world",
  files: [
    { name: "index.ts", content: "Deno.serve(() => new Response('Hello'))" }
  ],
  entrypoint_path: "index.ts"
});

// Création d'une migration
supabase_apply_migration({
  name: "add_users_table",
  query: "CREATE TABLE users (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT UNIQUE NOT NULL);"
});`,
    playgroundLabel: 'Simulez une migration Supabase',
  },
  vercel: {
    id: 'vercel',
    label: 'Vercel',
    icon: '▲',
    description: 'Outils MCP pour la plateforme Vercel : déploiements, projets, domaines, logs d\'exécution et documentation.',
    tools: VERCEL_TOOLS,
    exampleCode: `// Déploiement automatique
vercel_deploy_to_vercel();

// Lister les déploiements récents
vercel_list_deployments({
  projectId: "prj_abc123",
  teamId: "team_xyz789"
});

// Récupérer les logs d'erreur
vercel_get_runtime_logs({
  projectId: "prj_abc123",
  teamId: "team_xyz789",
  level: ["error", "fatal"],
  since: "1h"
});`,
    playgroundLabel: 'Simulez une recherche de logs Vercel',
  },
  render: {
    id: 'render',
    label: 'Render',
    icon: '⚡',
    description: 'Outils MCP pour la plateforme cloud Render : services web, bases de données, sites statiques, métriques et tâches planifiées.',
    tools: RENDER_TOOLS,
    exampleCode: `// Créer un service web Node.js
render_create_web_service({
  name: "mon-api",
  runtime: "node",
  repo: "https://github.com/user/repo",
  buildCommand: "npm install && npm run build",
  startCommand: "npm start",
  plan: "starter"
});

// Surveiller les métriques
render_get_metrics({
  resourceId: "srv-cf8x9h2",
  metricTypes: ["cpu_usage", "memory_usage"],
  startTime: "2024-01-01T00:00:00Z",
  endTime: "2024-01-01T12:00:00Z"
});`,
    playgroundLabel: 'Simulez la création d\'un service Render',
  },
  playwright: {
    id: 'playwright',
    label: 'Playwright',
    icon: '🎭',
    description: 'Outils MCP pour l\'automatisation de navigateur via Playwright : navigation, interactions, captures d\'écran et tests E2E.',
    tools: PLAYWRIGHT_TOOLS,
    exampleCode: `// Naviguer et interagir
playwright_browser_navigate({ url: "https://example.com" });

// Remplir un formulaire
playwright_browser_fill_form({
  fields: [
    { target: "#email", name: "Email", type: "textbox", value: "user@example.com" },
    { target: "#password", name: "Mot de passe", type: "textbox", value: "••••••••" }
  ]
});

// Cliquer sur le bouton de connexion
playwright_browser_click({
  element: "Bouton de connexion",
  target: "button[type='submit']"
});

// Capturer le résultat
playwright_browser_take_screenshot({
  filename: "apres-connexion.png",
  type: "png",
  fullPage: true
});`,
    playgroundLabel: 'Simulez un remplissage de formulaire Playwright',
  },
  context7: {
    id: 'context7',
    label: 'Context7',
    icon: '📚',
    description: 'Outils MCP pour l\'accès à la documentation des bibliothèques et frameworks : résolution d\'identifiants et interrogation de la documentation à jour.',
    tools: CONTEXT7_TOOLS,
    exampleCode: `// Résoudre une bibliothèque et interroger sa documentation
const libraryId = await context7.resolveLibraryId({
  libraryName: '@angular/core'
});
const docs = await context7.queryDocs({
  libraryId,
  query: 'standalone components'
});`,
    playgroundLabel: 'Simulez une recherche de documentation Context7',
  },
  magic: {
    id: 'magic',
    label: '21st.dev',
    icon: '🪄',
    description: 'Outils MCP pour la génération et l\'inspiration de composants UI via 21st.dev : création de composants, recherche d\'inspirations, raffinement et logos.',
    tools: MAGIC_TOOLS,
    exampleCode: `// Générer un composant bouton premium
const component = await magic.componentBuilder({
  prompt: 'A premium dark mode button with amber accent, loading state, and hover glow',
  stack: 'html'
});

// Rechercher des inspirations de design
const inspirations = await magic.inspiration({
  query: 'dark mode dashboard cards'
});`,
    playgroundLabel: 'Simulez la génération d\'un composant 21st.dev',
  },
};

/* ==========================================================================
 * Préfixes de namespace pour chaque catégorie.
 * ========================================================================== */
const CATEGORY_PREFIXES: Record<string, string> = {
  supabase: 'supabase',
  vercel: 'vercel',
  render: 'render',
  playwright: 'playwright',
  context7: 'context7',
  magic: 'magic',
};

/* ==========================================================================
 * Données bilingues — Descriptions des outils (EN)
 * ========================================================================== */

const TOOL_DESCRIPTIONS_EN: Record<string, string[]> = {
  supabase: [
    'Applies a DDL migration to the database',
    'Executes raw SQL in the Postgres database',
    'Lists all tables from one or more schemas',
    'Lists all database migrations',
    'Retrieves logs by service type',
    'Deploys an Edge Function to Supabase',
    'Creates a development branch',
    'Merges a development branch to production',
    'Searches Supabase documentation via GraphQL',
    'Generates TypeScript types from the database',
  ],
  vercel: [
    'Deploys the current project to Vercel',
    'Lists all project deployments',
    'Retrieves a deployment by ID or URL',
    'Lists all Vercel projects',
    'Retrieves a specific project',
    'Checks domain name availability',
    'Retrieves runtime logs',
    'Searches Vercel documentation',
  ],
  render: [
    'Creates a new web service',
    'Creates a new Postgres instance',
    'Creates a new static site',
    'Lists all account services',
    'Retrieves service details',
    'Retrieves performance metrics',
    'Lists service deployments',
    'Retrieves a specific deployment',
    'Lists logs with filters',
    'Creates a scheduled cron job',
  ],
  playwright: [
    'Navigates to a URL',
    'Clicks on an element',
    'Types text into a field',
    'Captures accessibility snapshot of the page',
    'Takes a screenshot of the page',
    'Fills multiple form fields',
    'Hovers over an element',
    'Presses a keyboard key',
    'Selects a dropdown option',
    'Waits for text to appear or disappear',
  ],
  context7: [
    'Resolves a library identifier from name and version',
    'Queries up-to-date library documentation',
  ],
  magic: [
    'Generates a UI component from a text description',
    'Searches for design inspirations by keywords',
    'Improves an existing component with quality standards',
    'Searches for company logos by domain name',
  ],
};

/* ==========================================================================
 * Données bilingues — Métadonnées des catégories (EN)
 * ========================================================================== */

const CATEGORY_META_EN: Record<string, { description: string; playgroundLabel: string }> = {
  supabase: {
    description: 'MCP tools for Supabase database management: migrations, development branches, Edge Functions, logs, and documentation.',
    playgroundLabel: 'Simulate a Supabase migration',
  },
  vercel: {
    description: 'MCP tools for the Vercel platform: deployments, projects, domains, runtime logs, and documentation.',
    playgroundLabel: 'Simulate a Vercel log search',
  },
  render: {
    description: 'MCP tools for the Render cloud platform: web services, databases, static sites, metrics, and scheduled tasks.',
    playgroundLabel: 'Simulate creating a Render service',
  },
  playwright: {
    description: 'MCP tools for browser automation via Playwright: navigation, interactions, screenshots, and E2E tests.',
    playgroundLabel: 'Simulate a Playwright form fill',
  },
  context7: {
    description: 'MCP tools for accessing library and framework documentation: identifier resolution and up-to-date documentation querying.',
    playgroundLabel: 'Simulate a Context7 documentation search',
  },
  magic: {
    description: 'MCP tools for UI component generation and inspiration via 21st.dev: component creation, design search, refinement, and logos.',
    playgroundLabel: 'Simulate a 21st.dev component generation',
  },
};

/* ==========================================================================
 * Composant — McpToolsComponent
 * ========================================================================== */

/**
 * Page Outils MCP — Composant pur Apple-grade.
 *
 * Présente les 6 catégories d'outils MCP (Supabase, Vercel, Render, Playwright)
 * avec un tableau des outils, un exemple de code et un mini-playground interactif.
 */
@Component({
  selector: 'app-mcp-tools',
  standalone: true,
  imports: [RouterLink, UiButtonComponent, UiBadgeComponent, StaggerChildrenDirective],
  templateUrl: './mcp-tools.component.html',
  styleUrls: ['./mcp-tools.component.scss'],
})
export class McpToolsComponent implements OnInit, OnDestroy {
  /* ==========================================================================
   * Injection
   * ========================================================================== */

  private readonly route = inject(ActivatedRoute);
  private readonly langService = inject(LanguageService);
  private readonly translationService = inject(TranslationService);

  private get lang(): Lang { return this.langService.currentLang(); }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string { return this.translationService.translate(key); }

  /** Catégories MCP localisées (FR ou EN selon la langue courante) */
  private get mcpCategories(): Record<string, McpCategory> {
    if (this.lang === 'fr') return MCP_CATEGORIES;

    // Construire la version EN en remplaçant les descriptions FR
    const en: Record<string, McpCategory> = {};
    for (const [key, cat] of Object.entries(MCP_CATEGORIES)) {
      const meta = CATEGORY_META_EN[key];
      const descs = TOOL_DESCRIPTIONS_EN[key] ?? [];
      en[key] = {
        ...cat,
        description: meta?.description ?? cat.description,
        playgroundLabel: meta?.playgroundLabel ?? cat.playgroundLabel,
        tools: cat.tools.map((t, i) => ({
          ...t,
          description: descs[i] ?? t.description,
        })),
      };
    }
    return en;
  }

  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  protected readonly error = signal<string | null>(null);
  protected readonly categoryId = signal<string>('supabase');

  /** Catégories disponibles pour la navigation */
  protected readonly categories = CATEGORIES;

  /** Données de la catégorie active */
  protected readonly categoryData = computed<McpCategory | null>(() => {
    return this.mcpCategories[this.categoryId()] ?? null;
  });

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  private routeSub: Subscription | null = null;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const cat = params.get('category') ?? 'supabase';
      this.categoryId.set(cat);
      this.loadCategoryData();
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  /* ==========================================================================
   * Méthodes
   * ========================================================================== */

  /** Charge les données de la catégorie. */
  private loadCategoryData(): void {
    const id = this.categoryId();

    if (!this.mcpCategories[id]) {
      this.error.set(`Catégorie « ${id} » introuvable.`);
      return;
    }

    this.error.set(null);

    // Toast supprimé — les catégories se chargent sans notification
  }

  /** Réinitialise l'état en cas d'erreur. */
  protected retry(): void {
    this.error.set(null);
    this.loadCategoryData();
  }

  /** Formate l'affichage du nom d'un outil avec le préfixe de la catégorie. */
  protected displayToolName(tool: McpTool): string {
    const prefix = CATEGORY_PREFIXES[this.categoryId()] ?? '';
    return prefix ? `${prefix}_${tool.name}` : tool.name;
  }
}
