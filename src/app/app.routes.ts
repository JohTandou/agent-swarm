import { Routes } from '@angular/router';

/**
 * Routes racine de l'application.
 * Lazy loading par feature pour optimiser le chargement.
 * Layout shell + homepage chargés eagerly via AppComponent.
 */
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
    path: 'demo-markdown',
    loadChildren: () =>
      import('./features/wiki-demo/wiki-demo.routes').then((m) => m.wikiDemoRoutes),
  },
  {
    path: 'probleme-innovation',
    loadChildren: () =>
      import('./features/problem-innovation/problem-innovation.routes').then(
        (m) => m.problemInnovationRoutes
      ),
  },
  {
    path: 'outils-mcp',
    loadChildren: () =>
      import('./features/mcp-tools/mcp-tools.routes').then((m) => m.mcpToolsRoutes),
  },
  /* Route wildcard — redirige vers l'accueil */
  { path: '**', redirectTo: '' },
];
