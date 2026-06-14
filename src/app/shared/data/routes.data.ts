/* ==========================================================================
 * Coûts et tokens par route — source unique
 * Utilisé par workflow (arbre de décision) et problem-innovation (analyse coûts)
 * Tarification API DeepSeek V4 Pro, juin 2025
 * ========================================================================== */

export interface RouteCost {
  readonly tokens: string;
  readonly cost: string;
  readonly agents: string;
  readonly callout: string;
}

export const ROUTE_COSTS: Record<string, RouteCost> = {
  DIRECT: {
    tokens: '~5 K',
    cost: '~0,002 $',
    agents: 'Aucun',
    callout: 'Réponse textuelle — aucun agent déclenché',
  },
  SIMPLE: {
    tokens: '~50 K',
    cost: '~0,02 $',
    agents: 'Front ou Back → Tester',
    callout: 'Modification ciblée — agent unique',
  },
  ADAPT: {
    tokens: '~120 K',
    cost: '~0,06 $',
    agents: 'Search → Front ou Back → Tester',
    callout: 'Adaptation transversale — search + agent',
  },
  MEDIUM: {
    tokens: '~400 K',
    cost: '~0,20 $',
    agents: 'Search → Planner → Front + Back → Tester → Reviewer',
    callout: 'Feature multi-fichiers — planification + gates',
  },
  FULL: {
    tokens: '~550 K',
    cost: '~0,27 $',
    agents: 'Search → Planner → Contract → Front + Back → Tester → Reviewer → Writer',
    callout: 'Feature complexe — pipeline complet avec contrats',
  },
};
