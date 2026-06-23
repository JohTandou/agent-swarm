// Polyfill SSR : mocks basiques de window/document pour les librairies
// qui y accèdent dans leur initialisation (GSAP, d3, mermaid, etc.)
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

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
