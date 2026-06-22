#!/usr/bin/env node
/**
 * Script post-build : génère le sitemap.xml bilingue pour le Swarm Wiki.
 * Exécuté après `ng build` via le script npm `postbuild`.
 *
 * Parcourt src/content/agents/ et src/content/skills/ pour extraire
 * les slugs des fichiers .md, et combine avec les routes statiques.
 * Génère les URLs FR et EN avec hreflang alternates.
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
 * Génère les balises hreflang xhtml pour une URL donnée.
 * @param {string} frLoc - Chemin FR de l'URL (ex: '/agents/orchestrateur')
 * @param {string} enLoc - Chemin EN de l'URL (ex: '/en/agents/orchestrateur')
 * @returns {string} Balises xhtml:link pour fr et en
 */
function hreflangTags(frLoc, enLoc) {
  const frUrl = BASE_URL + frLoc;
  const enUrl = BASE_URL + enLoc;
  return `    <xhtml:link rel="alternate" hreflang="fr" href="${frUrl}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${enUrl}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${frUrl}"/>`;
}

/**
 * Génère une entrée <url> pour le sitemap avec hreflang.
 * @param {string} loc - Chemin de l'URL (ex: '/agents/orchestrateur')
 * @param {string} priority
 * @param {string} changefreq
 * @returns {string}
 */
function urlEntry(loc, priority, changefreq) {
  const frLoc = loc;
  // Construit le chemin EN : préfixe /en, sauf pour la racine FR qui devient /en
  const enLoc = loc === '/' ? '/en' : '/en' + loc;

  return `  <url>
    <loc>${BASE_URL}${loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangTags(frLoc, enLoc)}
  </url>`;
}

/**
 * Génère une entrée <url> pour la version anglaise (/en/...).
 * @param {string} loc - Chemin FR original
 * @param {string} priority
 * @param {string} changefreq
 * @returns {string}
 */
function urlEntryEn(loc, priority, changefreq) {
  const frLoc = loc;
  const enLoc = loc === '/' ? '/en' : '/en' + loc;

  return `  <url>
    <loc>${BASE_URL}${enLoc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangTags(frLoc, enLoc)}
  </url>`;
}

function main() {
  const agents = extractSlugs(path.join(ROOT, 'src', 'content', 'agents'));
  const skills = extractSlugs(path.join(ROOT, 'src', 'content', 'skills'));

  // URLs françaises
  const frUrls = [
    ...STATIC_ROUTES.map(r => urlEntry(r.loc, r.priority, r.changefreq)),
    ...agents.map(slug => urlEntry(`/agents/${slug}`, '0.8', 'monthly')),
    ...skills.map(slug => urlEntry(`/skills/${slug}`, '0.8', 'monthly')),
  ];

  // URLs anglaises
  const enUrls = [
    ...STATIC_ROUTES.map(r => urlEntryEn(r.loc, r.priority, r.changefreq)),
    ...agents.map(slug => urlEntryEn(`/agents/${slug}`, '0.8', 'monthly')),
    ...skills.map(slug => urlEntryEn(`/skills/${slug}`, '0.8', 'monthly')),
  ];

  const allUrls = [...frUrls, ...enUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.join('\n')}
</urlset>
`;

  const outDir = path.join(ROOT, 'dist', 'swarm-wiki', 'browser');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf-8');
  console.log(`✅ Sitemap bilingue généré : ${allUrls.length} URLs (${frUrls.length} FR + ${enUrls.length} EN) → dist/swarm-wiki/browser/sitemap.xml`);
}

main();
