import type { SearchResult } from '@shared/models';

/**
 * Registre exhaustif des 14 fichiers Markdown du wiki.
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
  { sourcePath: 'skills/graphify.md', route: '/skills/graphify', section: 'Skills' },
  { sourcePath: 'skills/tests-create.md', route: '/skills/tests-create', section: 'Skills' },
  { sourcePath: 'skills/ui-ux-pro-max.md', route: '/skills/ui-ux-pro-max', section: 'Skills' },
];
