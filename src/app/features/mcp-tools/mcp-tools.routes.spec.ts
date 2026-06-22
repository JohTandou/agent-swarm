import { mcpToolsRoutes } from './mcp-tools.routes';
import { McpToolsComponent } from './mcp-tools.component';

describe('McpToolsRoutes', () => {
  it('devrait avoir exactement 2 routes', () => {
    expect(mcpToolsRoutes.length).toBe(2);
  });

  it('la route par défaut (path vide) devrait rediriger vers supabase', () => {
    const defaultRoute = mcpToolsRoutes[0];
    expect(defaultRoute.path).toBe('');
    expect(defaultRoute.redirectTo).toBe('supabase');
    expect(defaultRoute.pathMatch).toBe('full');
  });

  it('la route :category devrait charger McpToolsComponent', () => {
    const categoryRoute = mcpToolsRoutes[1];
    expect(categoryRoute.path).toBe(':category');
    expect(categoryRoute.component).toBe(McpToolsComponent);
  });

  it('les routes ne devraient pas avoir de routes enfants', () => {
    mcpToolsRoutes.forEach((route) => {
      expect(route.children).toBeUndefined();
    });
  });
});
