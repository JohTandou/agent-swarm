import { Routes } from '@angular/router';
import { routes } from './app.routes';

describe('AppRoutes', () => {
  it('devrait avoir 4 routes définies', () => {
    expect(routes.length).toBe(4);
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
});
