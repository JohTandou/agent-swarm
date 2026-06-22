import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'Accueil — Swarm Wiki' },
    loadChildren: () =>
      import('./features/homepage/homepage.routes').then((m) => m.homepageRoutes),
  },
  {
    path: 'a-propos',
    data: { title: 'À propos — La Swarm, neuf agents, un pipeline' },
    loadChildren: () =>
      import('./features/about/about.routes').then((m) => m.aboutRoutes),
  },
  {
    path: 'agents',
    data: { title: 'Agents IA — Les 9 agents spécialisés de la Swarm' },
    loadChildren: () =>
      import('./features/agents/agents.routes').then((m) => m.agentsRoutes),
  },
  {
    path: 'probleme-innovation',
    data: { title: 'Pourquoi la Swarm — Les 7 piliers d\'innovation' },
    loadChildren: () =>
      import('./features/problem-innovation/problem-innovation.routes').then(
        (m) => m.problemInnovationRoutes
      ),
  },
  {
    path: 'skills',
    data: { title: 'Skills — Les 26 modules de la Swarm' },
    loadChildren: () =>
      import('./features/skills/skills.routes').then((m) => m.skillsRoutes),
  },
  {
    path: 'workflow',
    data: { title: 'Workflow — Le pipeline de développement agentic' },
    loadChildren: () =>
      import('./features/workflow/workflow.routes').then((m) => m.workflowRoutes),
  },
  {
    path: 'ecosysteme',
    data: { title: 'Écosystème — Les technologies de la Swarm' },
    loadChildren: () =>
      import('./features/ecosystem/ecosystem.routes').then((m) => m.ecosystemRoutes),
  },
  {
    path: 'outils-mcp',
    data: { title: 'Outils MCP — Connecteurs natifs de la Swarm' },
    loadChildren: () =>
      import('./features/mcp-tools/mcp-tools.routes').then((m) => m.mcpToolsRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { title: 'Page introuvable — Swarm Wiki' },
  },
];
