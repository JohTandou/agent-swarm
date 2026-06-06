import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import type { SearchResult } from '@shared/models';
import { CONTENT_REGISTRY } from './content-registry';

/**
 * Configuration de l'index Fuse.js.
 * Pondération : titre (50%), description (30%), section (20%).
 * Seuil bas pour une recherche inclusive — le classement fait le tri.
 */
const FUSE_OPTIONS: IFuseOptions<SearchResult> = {
  keys: [
    { name: 'title', weight: 0.5 },
    { name: 'description', weight: 0.3 },
    { name: 'section', weight: 0.2 },
  ],
  threshold: 0.4,
  distance: 100,
  minMatchCharLength: 2,
  includeMatches: true,
  ignoreLocation: true,
};

/**
 * Regex pour extraire le frontmatter YAML d'un document Markdown brut.
 */
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n/;

/**
 * Parse le contenu brut d'un fichier .md et retourne un SearchResult.
 * Extrait title et description du frontmatter YAML si présent.
 */
function parseMarkdownForSearch(raw: string, sourcePath: string, route: string, section: string): SearchResult {
  const fmMatch = raw.match(FRONTMATTER_REGEX);
  let title = sourcePath.split('/').pop()?.replace('.md', '') ?? sourcePath;
  let description = '';

  if (fmMatch) {
    const fm = fmMatch[1];
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }

  return { title, description, route, section, sourcePath };
}

/**
 * Service de recherche full-text via Fuse.js.
 * Charge et indexe paresseusement les {@link CONTENT_REGISTRY.length} documents Markdown,
 * puis expose une méthode search() pour la recherche fuzzy.
 *
 * @providedIn root — singleton applicatif
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  /** État d'ouverture de la modale de recherche */
  readonly isOpen = signal(false);

  /** Indique si l'index de recherche est en cours de construction */
  readonly isIndexing = signal(false);

  /** Instance Fuse.js — null tant que l'index n'est pas chargé */
  private fuseInstance: Fuse<SearchResult> | null = null;

  /** Données brutes pour le debug et le fallback */
  private documents: SearchResult[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /** Bascule l'ouverture de la modale */
  toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.loadIndex();
    }
  }

  /** Ouvre la modale */
  open(): void {
    this.isOpen.set(true);
    this.loadIndex();
  }

  /** Ferme la modale */
  close(): void {
    this.isOpen.set(false);
  }

  /**
   * Recherche fuzzy parmi les documents indexés.
   *
   * @param query - Texte de recherche (min 2 caractères)
   * @param limit - Nombre maximum de résultats (défaut 10)
   * @returns SearchResult[] — tableau vide si query < 2 ou index non chargé
   */
  search(query: string, limit = 10): SearchResult[] {
    if (!query || query.trim().length < 2) return [];
    if (!this.fuseInstance) return [];

    const results = this.fuseInstance.search(query.trim());
    return results.slice(0, limit).map((r) => r.item);
  }

  /**
   * Navigue vers la route du résultat et ferme la modale.
   */
  navigateToResult(result: SearchResult): void {
    this.close();
    this.router.navigateByUrl(result.route);
  }

  /**
   * Charge et indexe paresseusement les documents Markdown.
   * Utilise forkJoin pour charger tous les fichiers en parallèle,
   * puis construit l'index Fuse.js.
   */
  loadIndex(): void {
    // Déjà chargé — ne rien faire
    if (this.fuseInstance) return;

    // Déjà en cours de chargement — ne rien faire
    if (this.isIndexing()) return;

    this.isIndexing.set(true);

    const requests: Observable<SearchResult>[] = CONTENT_REGISTRY.map((entry) => {
      const url = `/content/${entry.sourcePath}`;
      return this.http.get(url, { responseType: 'text' }).pipe(
        map((raw) =>
          parseMarkdownForSearch(raw, entry.sourcePath, entry.route, entry.section)
        ),
        catchError(() =>
          // Document manquant → fallback avec les métadonnées du registre
          of({
            title: entry.sourcePath.split('/').pop()?.replace('.md', '') ?? entry.sourcePath,
            description: '',
            route: entry.route,
            section: entry.section,
            sourcePath: entry.sourcePath,
          } as SearchResult)
        ),
      );
    });

    forkJoin(requests).subscribe({
      next: (docs) => {
        this.documents = docs;
        this.fuseInstance = new Fuse(docs, FUSE_OPTIONS);
        this.isIndexing.set(false);
      },
      error: () => {
        // Fallback : index seulement avec les métadonnées du registre
        const fallbackDocs: SearchResult[] = CONTENT_REGISTRY.map((entry) => ({
          title: entry.sourcePath.split('/').pop()?.replace('.md', '') ?? entry.sourcePath,
          description: '',
          route: entry.route,
          section: entry.section,
          sourcePath: entry.sourcePath,
        }));
        this.documents = fallbackDocs;
        this.fuseInstance = new Fuse(fallbackDocs, FUSE_OPTIONS);
        this.isIndexing.set(false);
      },
    });
  }
}
