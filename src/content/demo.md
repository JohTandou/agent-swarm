---
title: Système de Contenu Statique Swarm Wiki
description: Démonstration du système de contenu Markdown avec callouts, code, tableaux et diagrammes
order: 1
---

## Fonctionnalités du moteur de contenu

Le système de contenu statique du **Swarm Wiki** repose sur trois piliers :

1. **Chargement asynchrone** — les fichiers Markdown sont chargés à la demande via HTTP
2. **Frontmatter YAML** — métadonnées structurées en tête de chaque document
3. **Rendu riche** — coloration syntaxique, diagrammes Mermaid et callouts personnalisés

:::tip
Le frontmatter est obligatoire pour chaque fichier `.md` du wiki. Il contient le titre, la description et l'ordre d'affichage.
:::

## Architecture technique

Voici comment les composants s'articulent :

| Composant | Responsabilité | Technologie |
|---|---|---|
| `ContentService` | Chargement et parsing des fichiers `.md` | HttpClient + js-yaml |
| `MarkdownRenderer` | Rendu HTML du Markdown avec extensions | ngx-markdown + marked.js |
| `TableOfContents` | Navigation intra-page avec scroll-spy | IntersectionObserver |
| `Prism.js` | Coloration syntaxique des blocs de code | Prism.js (thème dark custom) |
| `Mermaid` | Rendu des diagrammes | Mermaid.js (lazy-load) |

:::info
Tous les composants sont **standalone** et utilisent le nouveau control flow Angular (`@if`, `@for`).
:::

## Exemple de code — ContentService

Le service de contenu charge et parse les documents Markdown :

```typescript
@Injectable({ providedIn: 'root' })
export class ContentService {
  constructor(private http: HttpClient) {}

  loadDocument(sourcePath: string): Observable<MarkdownDocument> {
    return this.http.get(`/content/${sourcePath}`, { responseType: 'text' }).pipe(
      map((raw) => this.parseDocument(raw, sourcePath)),
      catchError((err) => {
        console.error(`[ContentService] Échec : ${sourcePath}`, err);
        return throwError(() => new Error(`Fichier "${sourcePath}" introuvable.`));
      }),
    );
  }

  private parseDocument(raw: string, sourcePath: string): MarkdownDocument {
    // Extraction frontmatter YAML
    // Construction hiérarchie des headings
    // Aplatissement en TocEntry[]
    return { frontmatter, content, headings, tocEntries, sourcePath };
  }
}
```

:::warning
Le YAML du frontmatter doit être syntaxiquement valide. Une erreur de parsing ne bloque pas le rendu mais les métadonnées seront vides.
:::

## Les callouts

Le moteur supporte 4 types de callouts pour structurer l'information :

:::info
**Information** — pour les notes contextuelles et les précisions techniques.
:::

:::tip
**Astuce** — pour les conseils pratiques et les bonnes pratiques à retenir.
:::

:::warning
**Attention** — pour les points importants qui méritent une vigilance particulière.
:::

:::danger
**Danger** — pour les erreurs courantes ou les pièges à éviter absolument.
:::

## Tableau des dépendances

Voici les dépendances ajoutées pour le système de contenu :

| Paquet | Version | Poids approx. | Usage |
|---|---|---|---|
| `ngx-markdown` | 19.x | ~80KB | Composant Angular de rendu Markdown |
| `marked` | 15.x | ~35KB | Parseur Markdown (utilisé par ngx-markdown) |
| `prismjs` | 1.30 | ~10KB | Coloration syntaxique (no Babel, no React) |
| `mermaid` | 11.x | ~500KB | Diagrammes (lazy-load, chargé à la demande) |
| `js-yaml` | 4.x | ~15KB | Parsing du frontmatter YAML |

## Prochaines étapes

Le système de contenu statique est maintenant opérationnel. Les prochaines itérations apporteront :

- La **recherche full-text** avec Fuse.js
- Les **pages agents, skills et tools** en Markdown
- Le **système de routage contextuel** pour la navigation intra-wiki
