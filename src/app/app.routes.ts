import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/homepage/homepage.routes').then((m) => m.homepageRoutes),
  },
  {
    path: 'a-propos',
    loadChildren: () =>
      import('./features/about/about.routes').then((m) => m.aboutRoutes),
  },
  {
    path: 'agents',
    loadChildren: () =>
      import('./features/agents/agents.routes').then((m) => m.agentsRoutes),
  },
  {
    path: 'probleme-innovation',
    loadChildren: () =>
      import('./features/problem-innovation/problem-innovation.routes').then(
        (m) => m.problemInnovationRoutes
      ),
  },
  {
    path: 'skills',
    loadChildren: () =>
      import('./features/skills/skills.routes').then((m) => m.skillsRoutes),
  },
  {
    path: 'workflow',
    loadChildren: () =>
      import('./features/workflow/workflow.routes').then((m) => m.workflowRoutes),
  },
  {
    path: 'ecosysteme',
    loadChildren: () =>
      import('./features/ecosystem/ecosystem.routes').then((m) => m.ecosystemRoutes),
  },
  {
    path: 'outils-mcp',
    loadChildren: () =>
      import('./features/mcp-tools/mcp-tools.routes').then((m) => m.mcpToolsRoutes),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    data: { title: 'Page introuvable' },
  },
];
