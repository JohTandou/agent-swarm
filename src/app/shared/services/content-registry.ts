import type { SearchResult } from '@shared/models';

/**
 * Registre exhaustif des 37 fichiers Markdown du wiki.
 * Mapping sourcePath → route → section pour l'indexation de recherche.
 * 
 * Champs :
 * - sourcePath : chemin relatif dans src/content/
 * - route : route Angular correspondante
 * - section : catégorie d'affichage (Agents, Skills, Documentation)
 */
export const CONTENT_REGISTRY: Omit<SearchResult, 'title' | 'description'>[] = [
  // ==========================================================================
  // Agents (11) — src/content/agents/
  // ==========================================================================
  { sourcePath: 'agents/orchestrateur.md', route: '/agents/orchestrateur', section: 'Agents' },
  { sourcePath: 'agents/front.md', route: '/agents/front', section: 'Agents' },
  { sourcePath: 'agents/back.md', route: '/agents/back', section: 'Agents' },
  { sourcePath: 'agents/planner.md', route: '/agents/planner', section: 'Agents' },
  { sourcePath: 'agents/contract.md', route: '/agents/contract', section: 'Agents' },
  { sourcePath: 'agents/tester.md', route: '/agents/tester', section: 'Agents' },
  { sourcePath: 'agents/reviewer.md', route: '/agents/reviewer', section: 'Agents' },
  { sourcePath: 'agents/writer.md', route: '/agents/writer', section: 'Agents' },
  { sourcePath: 'agents/search.md', route: '/agents/search', section: 'Agents' },
  { sourcePath: 'agents/explore.md', route: '/agents/explore', section: 'Agents' },
  { sourcePath: 'agents/general.md', route: '/agents/general', section: 'Agents' },

  // ==========================================================================
  // Skills (3) — src/content/skills/
  // ==========================================================================
  { sourcePath: 'skills/admin-panel.md', route: '/skills/admin-panel', section: 'Skills' },
  { sourcePath: 'skills/audit-gamification.md', route: '/skills/audit-gamification', section: 'Skills' },
  { sourcePath: 'skills/audit-global.md', route: '/skills/audit-global', section: 'Skills' },
  { sourcePath: 'skills/audit-implementation.md', route: '/skills/audit-implementation', section: 'Skills' },
  { sourcePath: 'skills/audit-marketing.md', route: '/skills/audit-marketing', section: 'Skills' },
  { sourcePath: 'skills/audit-production.md', route: '/skills/audit-production', section: 'Skills' },
  { sourcePath: 'skills/audit-security.md', route: '/skills/audit-security', section: 'Skills' },
  { sourcePath: 'skills/audit-uxui.md', route: '/skills/audit-uxui', section: 'Skills' },
  { sourcePath: 'skills/background-images.md', route: '/skills/background-images', section: 'Skills' },
  { sourcePath: 'skills/customize-opencode.md', route: '/skills/customize-opencode', section: 'Skills' },
  { sourcePath: 'skills/dispatching-parallel-agents.md', route: '/skills/dispatching-parallel-agents', section: 'Skills' },
  { sourcePath: 'skills/documentation-create.md', route: '/skills/documentation-create', section: 'Skills' },
  { sourcePath: 'skills/documentation-update.md', route: '/skills/documentation-update', section: 'Skills' },
  { sourcePath: 'skills/executing-plans.md', route: '/skills/executing-plans', section: 'Skills' },
  { sourcePath: 'skills/finishing-a-development-branch.md', route: '/skills/finishing-a-development-branch', section: 'Skills' },
  { sourcePath: 'skills/graphify.md', route: '/skills/graphify', section: 'Skills' },
  { sourcePath: 'skills/receiving-code-review.md', route: '/skills/receiving-code-review', section: 'Skills' },
  { sourcePath: 'skills/requesting-code-review.md', route: '/skills/requesting-code-review', section: 'Skills' },
  { sourcePath: 'skills/subagent-driven-development.md', route: '/skills/subagent-driven-development', section: 'Skills' },
  { sourcePath: 'skills/test-driven-development.md', route: '/skills/test-driven-development', section: 'Skills' },
  { sourcePath: 'skills/tests-create.md', route: '/skills/tests-create', section: 'Skills' },
  { sourcePath: 'skills/tests-run.md', route: '/skills/tests-run', section: 'Skills' },
  { sourcePath: 'skills/ui-ux-pro-max.md', route: '/skills/ui-ux-pro-max', section: 'Skills' },
  { sourcePath: 'skills/using-git-worktrees.md', route: '/skills/using-git-worktrees', section: 'Skills' },
  { sourcePath: 'skills/writing-plans.md', route: '/skills/writing-plans', section: 'Skills' },
  { sourcePath: 'skills/writing-skills.md', route: '/skills/writing-skills', section: 'Skills' },
];
