import { Component, signal, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MarkdownRendererComponent } from '../../shared/components/markdown-renderer/markdown-renderer.component';
import { TocService } from '../../shared/services/toc.service';
import { SeoService } from '../../shared/services/seo.service';
import { JsonLdService } from '../../shared/services/json-ld.service';
import { TranslationService } from '../../shared/services/translation.service';
import { LanguageService, type Lang } from '../../shared/services/language.service';
import type { Skill, SkillCategory, TocEntry, MarkdownDocument } from '@shared/models';

/** Skills hardcodés */
const SKILLS: Skill[] = [
  { id: 'ui-ux-pro-max', name: 'UI/UX Pro Max', emoji: '🎨', category: 'creation', sourcePath: 'skills/ui-ux-pro-max.md', order: 1, tags: [], description: 'Intelligence de design UI/UX avec 67 styles, 96 palettes' },
  { id: 'tests-create', name: 'Tests Create', emoji: '🧪', category: 'creation', sourcePath: 'skills/tests-create.md', order: 2, tags: [], description: 'Génération optimale de tests unitaires, fonctionnels, intégration et E2E' },
  { id: 'graphify', name: 'Graphify', emoji: '🕸️', category: 'audit', sourcePath: 'skills/graphify.md', order: 3, tags: [], description: 'Transforme code, docs, papiers en graphes de connaissances' },
];

const SKILL_DESCS_EN: Record<string, string> = {
  'ui-ux-pro-max': 'UI/UX design intelligence with 67 styles, 96 palettes',
  'tests-create': 'Optimal generation of unit, functional, integration and E2E tests',
  'graphify': 'Transforms code, docs, papers into knowledge graphs',
};

/**
 * Page de détail d'un skill Swarm.
 * Charge le contenu Markdown depuis src/content/skills/:id.md
 * et l'affiche via MarkdownRenderer.
 *
 * États gérés :
 * - Loading : chargement du Markdown (géré par MarkdownRenderer)
 * - Success : header skill + contenu Markdown rendu
 * - Error : skill introuvable (ID invalide)
 */
@Component({
  selector: 'app-skill-detail',
  standalone: true,
  imports: [MarkdownRendererComponent, RouterLink],
  templateUrl: './skill-detail.component.html',
  styleUrls: ['./skill-detail.component.scss'],
})
export class SkillDetailComponent {
  private route = inject(ActivatedRoute);
  private tocService = inject(TocService);
  private seoService = inject(SeoService);
  private jsonLdService = inject(JsonLdService);
  private readonly translate = inject(TranslationService);
  private readonly langService = inject(LanguageService);

  private get lang(): Lang { return this.langService.currentLang(); }

  /** ID du skill extrait de l'URL */
  readonly skillId = signal<string>('');

  /** Tous les skills (hardcodés) */
  readonly allSkills = signal<Skill[]>(SKILLS);

  /** Données du skill (undefined si ID invalide), localisées selon la langue */
  readonly skill = computed<Skill | undefined>(() => {
    const id = this.skillId();
    const skills = this.allSkills();
    if (!id || skills.length === 0) return undefined;
    const skill = skills.find((s) => s.id === id);
    if (!skill) return undefined;
    if (this.lang === 'fr') return skill;
    return { ...skill, description: SKILL_DESCS_EN[id] ?? skill.description };
  });

  /** Erreur si skill non trouvé */
  readonly notFound = computed(() => this.skillId() !== '' && !this.skill());

  /** Source path pour MarkdownRenderer */
  readonly sourcePath = computed(() => {
    const s = this.skill();
    return s?.sourcePath ?? '';
  });

  /** Le skill a-t-il un contenu Markdown ? */
  readonly hasContent = computed(() => this.sourcePath() !== '');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.skillId.set(id ?? '');
      this.tocService.clear();
      this.setSeoAndSchemas(id);
    });
  }

  /** Raccourci pour les traductions dans le template */
  t(key: string): string {
    return this.translate.translate(key);
  }

  /**
   * Définit les métadonnées SEO et les schémas JSON-LD initiaux.
   * Sera mis à jour par onDocumentLoaded() quand le Markdown frontmatter est disponible.
   * @param id Identifiant du skill extrait de l'URL
   */
  private setSeoAndSchemas(id: string | null): void {
    if (!id) return;
    const skill = SKILLS.find((s) => s.id === id);
    if (!skill) return;

    const canonicalUrl = `https://swarm-wiki.vercel.app/skills/${id}`;
    const ogImage = 'https://swarm-wiki.vercel.app/assets/images/homepage-hero.jpg';

    this.seoService.updatePageMeta({
      title: skill.name,
      description: skill.description,
      canonicalUrl,
      image: ogImage,
      type: 'article',
      author: 'Joh Tandou',
    });

    const techArticle = this.jsonLdService.generateTechArticleSchema({
      headline: `${skill.name} — Skill Swarm`,
      description: skill.description,
      authorName: 'Joh Tandou',
      authorUrl: 'https://github.com/JohTandou',
      datePublished: '2025-05-15',
      image: ogImage,
      url: canonicalUrl,
    });

    this.jsonLdService.addSchemas([techArticle, this.jsonLdService.generatePersonSchema()]);
  }

  /**
   * Appelé quand le MarkdownRenderer a terminé le chargement du document.
   * Met à jour le SEO avec le frontmatter et enrichit le JSON-LD.
   * @param doc Document Markdown chargé (contient frontmatter, TOC, contenu)
   */
  onDocumentLoaded(doc: MarkdownDocument): void {
    const id = this.skillId();
    if (!id) return;

    const canonicalUrl = `https://swarm-wiki.vercel.app/skills/${id}`;
    const ogImage = 'https://swarm-wiki.vercel.app/assets/images/homepage-hero.jpg';
    const title = doc.frontmatter.title || this.skill()?.name || 'Skill';
    const description = doc.frontmatter.description || this.skill()?.description || '';

    this.seoService.updatePageMeta({
      title,
      description,
      canonicalUrl,
      image: ogImage,
      type: 'article',
      author: 'Joh Tandou',
    });

    const techArticleUpdated = this.jsonLdService.generateTechArticleSchema({
      headline: title,
      description,
      authorName: 'Joh Tandou',
      authorUrl: 'https://github.com/JohTandou',
      datePublished: '2025-05-15',
      image: ogImage,
      url: canonicalUrl,
    });

    this.jsonLdService.addSchemas([techArticleUpdated, this.jsonLdService.generatePersonSchema()]);
  }

  /** Transmet les entrées TOC au service partagé */
  onTocEntries(entries: TocEntry[]): void {
    this.tocService.setEntries(entries);
  }

  /** Retourne le label traduit pour une catégorie */
  getCategoryLabel(category: SkillCategory): string {
    return this.translate.translate('skills.category.' + category);
  }
}
