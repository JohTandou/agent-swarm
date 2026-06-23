// Polyfill SSR : mocks basiques de window/document pour les librairies
// qui y accèdent dans leur initialisation (GSAP, d3, mermaid, etc.)
// Doit être défini avant tout import de l'application Angular.
const g = globalThis as any;
if (typeof g.window === 'undefined') g.window = g;
if (typeof g.document === 'undefined') {
  g.document = {
    createElement: () => ({}),
    createElementNS: () => ({}),
    querySelectorAll: () => [],
    querySelector: () => null,
    getElementsByTagName: () => [],
    head: { appendChild: () => {} },
    body: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    documentElement: { scrollTop: 0, scrollHeight: 0, clientHeight: 0, style: {} },
    location: { href: '', pathname: '/', origin: 'http://localhost' },
    cookie: '',
  };
}
if (typeof g.location === 'undefined') {
  g.location = { href: '', pathname: '/', origin: 'http://localhost' };
}
if (typeof g.localStorage === 'undefined') {
  g.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
}
if (typeof g.matchMedia === 'undefined') {
  g.matchMedia = () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} });
}
if (typeof g.requestAnimationFrame === 'undefined') {
  g.requestAnimationFrame = (cb: () => void) => { cb(); return 0; };
}
if (typeof g.scrollTo === 'undefined') {
  g.scrollTo = () => {};
}

import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(AppComponent, config, context);

export default bootstrap;
