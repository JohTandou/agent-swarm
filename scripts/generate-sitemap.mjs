#!/usr/bin/env node
/**
 * Script post-build : génère le sitemap.xml pour le Swarm Wiki.
 * Exécuté après `ng build` via le script npm `postbuild`.
 *
 * Parcourt src/content/agents/ et src/content/skills/ pour extraire
 * les slugs des fichiers .md, et combine avec les routes statiques.
 * Sortie : dist/swarm-wiki/browser/sitemap.xml
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://swarm-wiki.vercel.app';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const STATIC_ROUTES = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/a-propos', priority: '0.8', changefreq: 'monthly' },
  { loc: '/agents', priority: '0.9', changefreq: 'weekly' },
  { loc: '/skills', priority: '0.9', changefreq: 'weekly' },
  { loc: '/workflow', priority: '0.8', changefreq: 'monthly' },
  { loc: '/ecosysteme', priority: '0.7', changefreq: 'monthly' },
  { loc: '/probleme-innovation', priority: '0.7', changefreq: 'monthly' },
  { loc: '/outils-mcp', priority: '0.7', changefreq: 'monthly' },
];

/**
 * Extrait les slugs des fichiers .md dans un répertoire.
 * Chaque fichier `{slug}.md` → slug.
 */
function extractSlugs(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''));
}

/**
 * Génère une entrée <url> pour le sitemap.
 */
function urlEntry(loc, priority, changefreq) {
  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function main() {
  const agents = extractSlugs(path.join(ROOT, 'src', 'content', 'agents'));
  const skills = extractSlugs(path.join(ROOT, 'src', 'content', 'skills'));

  const urls = [
    ...STATIC_ROUTES.map(r => urlEntry(r.loc, r.priority, r.changefreq)),
    ...agents.map(slug => urlEntry(`/agents/${slug}`, '0.8', 'monthly')),
    ...skills.map(slug => urlEntry(`/skills/${slug}`, '0.8', 'monthly')),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  const outDir = path.join(ROOT, 'dist', 'swarm-wiki', 'browser');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`✅ Sitemap généré : ${urls.length} URLs → dist/swarm-wiki/browser/sitemap.xml`);
}

main();
