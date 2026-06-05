/**
 * Nœud de heading extrait du contenu Markdown pour la construction du TOC.
 * Représente la hiérarchie brute des titres avant aplatissement en TocEntry[].
 *
 * @remarks
 * Supporte les niveaux h1 à h4. La conversion HeadingNode → TocEntry
 * est gérée par le MarkdownDocument (stocke les deux représentations).
 */
export interface HeadingNode {
  /** Slug HTML du heading (ex: 'section-introduction') utilisé pour les ancres */
  id: string;

  /** Texte brut du heading sans balisage Markdown */
  text: string;

  /** Niveau hiérarchique : 1 = h1, 2 = h2, 3 = h3, 4 = h4 */
  level: 1 | 2 | 3 | 4;

  /** Sous-headings imbriqués pour former l'arborescence du document */
  children?: HeadingNode[];
}
