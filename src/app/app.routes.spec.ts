import { Routes } from '@angular/router';
import { routes } from './app.routes';

describe('AppRoutes', () => {
  it('devrait avoir 7 routes définies', () => {
    expect(routes.length).toBe(7);
  });

  it('devrait avoir une route racine avec lazy loading vers homepage', () => {
    const rootRoute = routes.find((r) => r.path === '');
    expect(rootRoute).toBeTruthy();
    expect(rootRoute?.loadChildren).toBeDefined();
    expect(typeof rootRoute?.loadChildren).toBe('function');
  });

  it('devrait avoir une route /a-propos avec lazy loading vers about', () => {
    const aboutRoute = routes.find((r) => r.path === 'a-propos');
    expect(aboutRoute).toBeTruthy();
    expect(aboutRoute?.loadChildren).toBeDefined();
    expect(typeof aboutRoute?.loadChildren).toBe('function');
  });

  it('devrait avoir une route /agents avec lazy loading vers agents', () => {
    const agentsRoute = routes.find((r) => r.path === 'agents');
    expect(agentsRoute).toBeTruthy();
    expect(agentsRoute?.loadChildren).toBeDefined();
    expect(typeof agentsRoute?.loadChildren).toBe('function');
  });

  it('devrait avoir une route wildcard ** qui redirige vers "" (accueil)', () => {
    const wildcardRoute = routes.find((r) => r.path === '**');
    expect(wildcardRoute).toBeTruthy();
    expect(wildcardRoute?.redirectTo).toBe('');
  });

  it('la fonction lazy load de la route racine devrait retourner une promesse', () => {
    const rootRoute = routes.find((r) => r.path === '');
    const loadFn = rootRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    const result = loadFn?.();
    expect(result).toBeInstanceOf(Promise);
  });

  it('la fonction lazy load de la route /a-propos devrait retourner une promesse', () => {
    const aboutRoute = routes.find((r) => r.path === 'a-propos');
    const loadFn = aboutRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    const result = loadFn?.();
    expect(result).toBeInstanceOf(Promise);
  });

  it('la fonction lazy load de la route /agents devrait retourner une promesse', () => {
    const agentsRoute = routes.find((r) => r.path === 'agents');
    const loadFn = agentsRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    const result = loadFn?.();
    expect(result).toBeInstanceOf(Promise);
  });

  it('la route racine devrait charger les routes homepage correctement', async () => {
    const rootRoute = routes.find((r) => r.path === '');
    const loadFn = rootRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    if (loadFn) {
      const loadedRoutes = await loadFn();
      expect(loadedRoutes).toBeDefined();
      expect(Array.isArray(loadedRoutes)).toBeTrue();
      const homeRoute = loadedRoutes.find((r) => r.path === '');
      expect(homeRoute).toBeTruthy();
    }
  });

  it('la route /a-propos devrait charger les routes about correctement', async () => {
    const aboutRoute = routes.find((r) => r.path === 'a-propos');
    const loadFn = aboutRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    if (loadFn) {
      const loadedRoutes = await loadFn();
      expect(loadedRoutes).toBeDefined();
      expect(Array.isArray(loadedRoutes)).toBeTrue();
      const route = loadedRoutes.find((r) => r.path === '');
      expect(route).toBeTruthy();
    }
  });

  it('la route /agents devrait charger les routes agents correctement', async () => {
    const agentsRoute = routes.find((r) => r.path === 'agents');
    const loadFn = agentsRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    if (loadFn) {
      const loadedRoutes = await loadFn();
      expect(loadedRoutes).toBeDefined();
      expect(Array.isArray(loadedRoutes)).toBeTrue();
      const listRoute = loadedRoutes.find((r) => r.path === '');
      expect(listRoute).toBeTruthy();
      const detailRoute = loadedRoutes.find((r) => r.path === ':id');
      expect(detailRoute).toBeTruthy();
    }
  });

  it('devrait avoir une route /outils-mcp avec lazy loading vers mcp-tools', () => {
    const mcpRoute = routes.find((r) => r.path === 'outils-mcp');
    expect(mcpRoute).toBeTruthy();
    expect(mcpRoute?.loadChildren).toBeDefined();
    expect(typeof mcpRoute?.loadChildren).toBe('function');
  });

  it('la fonction lazy load de la route /outils-mcp devrait retourner une promesse', () => {
    const mcpRoute = routes.find((r) => r.path === 'outils-mcp');
    const loadFn = mcpRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    const result = loadFn?.();
    expect(result).toBeInstanceOf(Promise);
  });

  it('la route /outils-mcp devrait charger les routes mcp-tools correctement', async () => {
    const mcpRoute = routes.find((r) => r.path === 'outils-mcp');
    const loadFn = mcpRoute?.loadChildren as (() => Promise<Routes>) | undefined;
    if (loadFn) {
      const loadedRoutes = await loadFn();
      expect(loadedRoutes).toBeDefined();
      expect(Array.isArray(loadedRoutes)).toBeTrue();
      const redirectRoute = loadedRoutes.find((r) => r.path === '');
      expect(redirectRoute).toBeTruthy();
      expect(redirectRoute?.redirectTo).toBe('supabase');
      const categoryRoute = loadedRoutes.find((r) => r.path === ':category');
      expect(categoryRoute).toBeTruthy();
    }
  });
});
