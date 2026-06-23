import type { Agent, AgentCategory } from '@shared/models';

/* ==========================================================================
 * Définitions statiques des agents du pipeline Swarm.
 * Source unique importée par agents-list et agent-detail.
 * ========================================================================== */

export const AGENTS: Agent[] = [
  {
    id: 'orchestrateur', name: 'Orchestrator', emoji: '🧠',
    role: 'Tech Lead — classifie, route et supervise le pipeline',
    description: "Point d'entrée unique, il analyse la complexité des demandes et orchestre la collaboration entre agents.",
    route: 'DIRECT', active: true, category: 'build', sourcePath: 'agents/orchestrateur.md',
  },
  {
    id: 'general', name: 'General', emoji: '🤖',
    role: 'Couteau Suisse — tâches de recherche et exécution multi-étapes',
    description: "Exécute des unités de travail indépendantes, délègue les commandes shell, et orchestre les sous-tâches.",
    route: 'ADAPT', active: true, category: 'infrastructure', sourcePath: 'agents/general.md',
  },
  {
    id: 'planner', name: 'Planner', emoji: '🧩',
    role: 'Chef de Projet — planifie le travail en tâches atomiques',
    description: "Détecte les choix architecturaux, les soumet à l'utilisateur, et délègue la définition des contrats à contract.",
    route: 'MEDIUM', active: true, category: 'build', sourcePath: 'agents/planner.md',
  },
  {
    id: 'explore', name: 'Explore', emoji: '🗺️',
    role: 'Explorateur — découverte rapide du codebase',
    description: "Agent utilitaire pour la découverte : recherche par motif, mots-clés, et analyse de structure.",
    route: 'SIMPLE', active: true, category: 'infrastructure', sourcePath: 'agents/explore.md',
  },
  {
    id: 'search', name: 'Search', emoji: '🔎',
    role: 'Analyste — cartographie le codebase et identifie les dépendances',
    description: "Identifie les fichiers impactés, détecte les patterns, récupère la doc à jour. LECTURE SEULE absolue.",
    route: 'ADAPT', active: true, category: 'infrastructure', sourcePath: 'agents/search.md',
  },
  {
    id: 'contract', name: 'Contract', emoji: '📋',
    role: 'Architecte — types TypeScript, spec OpenAPI, migrations Supabase',
    description: "Source de vérité absolue pour front et back. Appelé uniquement sur la route FULL, par planner.",
    route: 'FULL', active: true, category: 'qualité', sourcePath: 'agents/contract.md',
  },
  {
    id: 'front', name: 'Front', emoji: '🎨',
    role: 'Développeur Frontend — composants UI Apple-grade',
    description: "Responsable de tous les composants visibles : UI, animations, accessibilité, intégration des contrats TypeScript.",
    route: 'SIMPLE', active: true, category: 'build', sourcePath: 'agents/front.md',
  },
  {
    id: 'back', name: 'Back', emoji: '⚙️',
    role: 'Développeur Backend — scripts, crons, configurations',
    description: "Respecte strictement la spécification OpenAPI sur la route FULL. S'appuie sur context7 pour la doc des frameworks.",
    route: 'SIMPLE', active: true, category: 'build', sourcePath: 'agents/back.md',
  },
  {
    id: 'tester', name: 'Tester', emoji: '🧪',
    role: 'Ingénieur QA — génération de tests, couverture, catégorisation',
    description: "Garant de la qualité logicielle. Seuil de couverture 80%. Rapporte des faits, corrige les gaps de test.",
    route: 'SIMPLE', active: true, category: 'qualité', sourcePath: 'agents/tester.md',
  },
  {
    id: 'reviewer', name: 'Reviewer', emoji: '👁️',
    role: 'Code Reviewer — gate sécurité, qualité et audit des tests',
    description: "Intervient uniquement après tester PASS. Vérifie le code ET les tests générés. Approuve ou rejette.",
    route: 'MEDIUM', active: true, category: 'qualité', sourcePath: 'agents/reviewer.md',
  },
  {
    id: 'writer', name: 'Writer', emoji: '✍️',
    role: 'Rédacteur Technique — documentation vivante après chaque commit',
    description: "Maintient CHANGELOG, API.md, ARCHITECTURE.md et README. Déclenché sur MEDIUM et FULL.",
    route: 'MEDIUM', active: true, category: 'qualité', sourcePath: 'agents/writer.md',
  },
];

/** Lookup map pour accès rapide par ID */
export const AGENTS_MAP: Record<string, Agent> = Object.fromEntries(
  AGENTS.map((a) => [a.id, a])
);

/** Rôles des agents en anglais */
export const AGENT_ROLES_EN: Record<string, string> = {
  orchestrateur: 'Tech Lead — classifies, routes, and supervises the pipeline',
  general: 'Swiss Army Knife — research tasks and multi-step execution',
  planner: 'Project Manager — plans work into atomic tasks',
  explore: 'Explorer — fast codebase discovery',
  search: 'Analyst — maps the codebase and identifies dependencies',
  contract: 'Architect — TypeScript types, OpenAPI spec, Supabase migrations',
  front: 'Frontend Developer — Apple-grade UI components',
  back: 'Backend Developer — scripts, crons, configurations',
  tester: 'QA Engineer — test generation, coverage, categorization',
  reviewer: 'Code Reviewer — security gate, quality, and test audit',
  writer: 'Technical Writer — living documentation after each commit',
};

/** Descriptions des agents en anglais */
export const AGENT_DESCS_EN: Record<string, string> = {
  orchestrateur: 'Single entry point, analyzes task complexity and orchestrates agent collaboration.',
  general: 'Executes independent work units, delegates shell commands, and orchestrates sub-tasks.',
  planner: 'Detects architectural choices, submits them to the user, and delegates contract definition to contract.',
  explore: 'Utility agent for discovery: pattern search, keyword matching, and structural analysis.',
  search: 'Identifies impacted files, detects patterns, retrieves up-to-date documentation. READ-ONLY.',
  contract: 'Absolute source of truth for front and back. Called only on the FULL route, by planner.',
  front: 'Responsible for all visible components: UI, animations, accessibility, TypeScript contract integration.',
  back: 'Strictly respects the OpenAPI specification on the FULL route. Leverages context7 for framework documentation.',
  tester: 'Software quality guardian. 80% coverage threshold. Reports facts, fixes test gaps.',
  reviewer: 'Intervenes only after tester PASS. Verifies both code AND generated tests. Approves or rejects.',
  writer: 'Maintains CHANGELOG, API.md, ARCHITECTURE.md, and README. Triggered on MEDIUM and FULL.',
};

/** Labels des catégories pour les filtres et badges */
export const CATEGORY_LABELS: Record<AgentCategory, string> = {
  build: 'Build',
  qualité: 'Qualité',
  infrastructure: 'Infrastructure',
};

/** Couleurs associées à chaque route de complexité */
export const ROUTE_COLORS: Record<string, string> = {
  DIRECT: '#7A8899',
  SIMPLE: '#7A8899',
  ADAPT: '#7A8899',
  MEDIUM: '#C4780D',
  FULL: '#C4780D',
};
