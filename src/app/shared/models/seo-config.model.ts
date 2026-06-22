/** Configuration SEO pour une page — utilisée par SeoService.updatePageMeta() */
export interface SeoConfig {
  /** Titre de la page (sera suffixé par " — Swarm Wiki" automatiquement) */
  title: string;
  /** Meta description (max ~160 caractères recommandé) */
  description: string;
  /** Auteur de la page (optionnel, ajoute <meta name="author">) */
  author?: string;
  /** URL absolue de l'image OG (1200×630 recommandé) */
  image?: string;
  /** URL canonique de la page */
  canonicalUrl?: string;
  /** Type Open Graph (website, article, etc.) — défaut 'website' */
  type?: string;
}
