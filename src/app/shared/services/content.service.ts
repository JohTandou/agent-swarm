import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import * as yaml from 'js-yaml';
import type { MarkdownDocument, MarkdownFrontmatter, HeadingNode, TocEntry } from '@shared/models';
import { CONTENT_REGISTRY } from './content-registry';
import type { Skill, SkillCategory } from '@shared/models';

/** Séparateur de frontmatter YAML dans les fichiers Markdown */
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---\s*\n/;
/** Capture les headings h1 à h4 avec leur texte */
const HEADING_REGEX = /^\s*(#{1,6})\s+(.+)$/gm;

/**
 * Service de chargement et parsing des documents Markdown.
 * Charge un fichier .md via HttpClient, extrait le frontmatter YAML,
 * construit la hiérarchie des headings et aplatit en TocEntry[].
 *
 * @providedIn root — singleton applicatif
 */
@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private http: HttpClient) {}

  /**
   * Charge et parse un document Markdown depuis `src/content/`.
   *
   * @param sourcePath - Chemin relatif dans src/content/ (ex: 'demo.md')
   * @returns Observable<MarkdownDocument> — document parsé prêt à l'affichage
   */
  /** Mapping emoji par catégorie pour les skills sans emoji dans le YAML */
  private readonly CATEGORY_EMOJI: Record<string, string> = {
    creation: '🎨',
    audit: '🔍',
    workflow: '🔄',
    documentation: '📝',
  };

  /**
   * Charge le manifeste des skills depuis les fichiers Markdown.
   * Filtre les entrées Skills du CONTENT_REGISTRY, parse le frontmatter
   * YAML de chaque fichier, et retourne un tableau trié par ordre.
   *
   * @returns Observable<Skill[]> — skills triés par `order`
   */
  loadSkillsManifest(): Observable<Skill[]> {
    const skillEntries = CONTENT_REGISTRY.filter((entry) => entry.section === 'Skills');

    const requests = skillEntries.map((entry) => {
      const url = `/content/${entry.sourcePath}`;
      return this.http.get(url, { responseType: 'text' }).pipe(
        map((raw) => {
          const id = entry.sourcePath.replace('skills/', '').replace('.md', '');
          let title = id;
          let description = '';
          let category: SkillCategory = 'creation';
          let order = 99;
          let emoji = '';

          const fmMatch = raw.match(FRONTMATTER_REGEX);
          if (fmMatch) {
            try {
              const parsed = yaml.load(fmMatch[1]) as Record<string, unknown>;
              title = (parsed['title'] as string) ?? id;
              description = (parsed['description'] as string) ?? '';
              category = (parsed['category'] as SkillCategory) ?? 'creation';
              order = (parsed['order'] as number) ?? 99;
              emoji = (parsed['emoji'] as string) ?? '';
            } catch {
              // Frontmatter invalide — utiliser les valeurs par défaut
            }
          }

          // Fallback emoji par catégorie
          if (!emoji) {
            emoji = this.CATEGORY_EMOJI[category] ?? '📦';
          }

          const skill: Skill = {
            id,
            name: title,
            emoji,
            description,
            tags: [],
            category,
            sourcePath: entry.sourcePath,
            order,
          };

          return skill;
        }),
        catchError(() => {
          // Fichier manquant — fallback minimal
          const id = entry.sourcePath.replace('skills/', '').replace('.md', '');
          return of({
            id,
            name: id,
            emoji: '📦',
            description: '',
            tags: [],
            category: 'creation' as SkillCategory,
            sourcePath: entry.sourcePath,
            order: 99,
          } as Skill);
        }),
      );
    });

    return forkJoin(requests).pipe(
      map((skills) => skills.sort((a, b) => a.order - b.order)),
    );
  }

  /**
   * Charge et parse un document Markdown depuis `src/content/`.
   *
   * @param sourcePath - Chemin relatif dans src/content/ (ex: 'demo.md')
   * @returns Observable<MarkdownDocument> — document parsé prêt à l'affichage
   */
  loadDocument(sourcePath: string): Observable<MarkdownDocument> {
    const url = `/content/${sourcePath}`;

    return this.http.get(url, { responseType: 'text' }).pipe(
      map((raw) => this.parseDocument(raw, sourcePath)),
      catchError((err) => {
        console.error(`[ContentService] Échec de chargement : ${sourcePath}`, err);
        return throwError(
          () => new Error(`Le fichier "${sourcePath}" est introuvable. Vérifiez le chemin.`)
        );
      }),
    );
  }

  /**
   * Parse un contenu Markdown brut en MarkdownDocument structuré.
   * Sépare le frontmatter YAML du corps du document.
   */
  private parseDocument(raw: string, sourcePath: string): MarkdownDocument {
    let frontmatter: MarkdownFrontmatter = { title: '', description: '', order: 0 };
    let content = raw;

    // Extraction du frontmatter YAML
    const fmMatch = raw.match(FRONTMATTER_REGEX);
    if (fmMatch) {
      try {
        const parsed = yaml.load(fmMatch[1]) as Record<string, unknown>;
        frontmatter = {
          title: (parsed['title'] as string) ?? '',
          description: (parsed['description'] as string) ?? '',
          order: (parsed['order'] as number) ?? 0,
          ...parsed,
        };
      } catch (yamlErr) {
        console.warn(
          `[ContentService] YAML invalide dans ${sourcePath} — frontmatter ignoré.`,
          yamlErr,
        );
      }
      content = raw.slice(fmMatch[0].length);
    }

    // Extraction des headings
    const headings = this.extractHeadings(content);
    const tocEntries = this.flattenHeadings(headings);

    return {
      frontmatter,
      content: content.trim(),
      headings,
      tocEntries,
      sourcePath,
    };
  }

  /**
   * Extrait les headings h1-h4 du contenu Markdown et construit
   * une hiérarchie arborescente de HeadingNode.
   */
  extractHeadings(content: string): HeadingNode[] {
    const headings: HeadingNode[] = [];
    const stack: HeadingNode[] = [];
    const regex = new RegExp(HEADING_REGEX);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length as 1 | 2 | 3 | 4;
      const text = match[2].trim();
      const id = this.generateSlug(text);

      const node: HeadingNode = { id, text, level };

      // Remonter la pile pour trouver le parent approprié
      while (stack.length > 0 && (stack[stack.length - 1]?.level ?? 4) >= level) {
        stack.pop();
      }

      if (stack.length === 0 || level === 1) {
        headings.push(node);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }

      stack.push(node);
    }

    return headings;
  }

  /**
   * Aplatit la hiérarchie HeadingNode[] en TocEntry[] pour le composant TOC.
   * Convertit `text` → `label` et ne garde que les niveaux 1-3.
   */
  flattenHeadings(headings: HeadingNode[]): TocEntry[] {
    const flat: TocEntry[] = [];
    const walk = (nodes: HeadingNode[], depth: number) => {
      for (const node of nodes) {
        if (node.level > 3) continue;
        const entry: TocEntry = {
          id: node.id,
          label: node.text,
          level: Math.min(node.level, 3) as 1 | 2 | 3,
        };
        if (node.children && node.children.length > 0) {
          const childEntries = this.flattenHeadings(node.children);
          if (childEntries.length > 0) {
            entry.children = childEntries;
          }
        }
        flat.push(entry);
      }
    };
    walk(headings, 0);
    return flat;
  }

  /**
   * Génère un slug HTML compatible à partir d'un texte de heading.
   * Exemple : "Mon Titre !" → "mon-titre"
   */
  generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9\s-]/g, '')     // Supprime caractères spéciaux
      .trim()                           // Trim avant conversion en tirets
      .replace(/\s+/g, '-')             // Espaces → tirets
      .replace(/-+/g, '-')              // Collapse tirets multiples
      .replace(/^-+|-+$/g, '');         // Supprime tirets début/fin
  }
}
