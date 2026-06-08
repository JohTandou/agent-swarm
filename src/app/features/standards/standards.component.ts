import { Component, AfterViewInit, OnDestroy, ElementRef, signal } from '@angular/core';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';
import { UiBadgeComponent } from '@shared/components/ui-badge/ui-badge.component';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';

/* Constantes de configuration */
const LOADING_SIMULATION_DELAY_MS = 500;
const READY_CHECK_INTERVAL_MS = 100;
const READY_CHECK_TIMEOUT_MS = 2000;

/* ==========================================================================
 * Interfaces de données
 * ========================================================================== */

/** Échantillon de la palette de couleurs. */
interface PaletteColor {
  readonly name: string;
  readonly hex: string;
  readonly variable: string;
  readonly usage: string;
}

/** Niveau d'élévation dark (N1 à N4). */
interface ElevationLevel {
  readonly level: string;
  readonly name: string;
  readonly background: string;
  readonly border: string;
  readonly shadow: string;
}

/** Entrée du vocabulaire d'animation. */
interface AnimationEntry {
  readonly context: string;
  readonly properties: string;
  readonly duration: string;
  readonly easing: string;
}

/** Paire typographique (display vs body). */
interface TypoPair {
  readonly font: string;
  readonly role: string;
  readonly weight: string;
  readonly sample: string;
  readonly cssClass: string;
}

/** Convention de code. */
interface CodeConvention {
  readonly title: string;
  readonly description: string;
  readonly examples: readonly string[];
}

/** Principe de test. */
interface TestPrinciple {
  readonly title: string;
  readonly description: string;
}

/** Ressource de documentation. */
interface DocResource {
  readonly title: string;
  readonly description: string;
}

/** Entrée de la checklist qualité */
interface QualityCheckItem {
  readonly title: string;
  readonly description: string;
  readonly category: 'code' | 'design' | 'test' | 'accessibilité';
}

/**
 * Page Standards — Référence complète des normes du projet Swarm Wiki.
 *
 * Présente la palette, la typographie, le système d'élévation,
 * les conventions de code, la philosophie de test et les règles
 * de documentation.
 */
@Component({
  selector: 'app-standards',
  standalone: true,
  templateUrl: './standards.component.html',
  styleUrls: ['./standards.component.scss'],
  imports: [UiButtonComponent, UiSkeletonComponent, UiBadgeComponent, StaggerChildrenDirective, TextRevealDirective],
})
export class StandardsComponent implements AfterViewInit, OnDestroy {
  constructor(private elementRef: ElementRef) {}
  /* ==========================================================================
   * État du composant
   * ========================================================================== */

  /** Indique si le contenu est en cours de chargement (shimmer skeleton). */
  protected readonly loading = signal(true);

  /** Message d'erreur éventuel. */
  protected readonly error = signal<string | null>(null);

  /* ==========================================================================
   * Section 1 — Standards Apple-grade
   * ========================================================================== */

  /* -- Palette de couleurs -- */
  protected readonly paletteColors: readonly PaletteColor[] = [
    {
      name: 'Fond principal',
      hex: '#3A3530',
      variable: '--color-bg-primary',
      usage: 'Arrière-plan de page, fond général',
    },
    {
      name: 'Surface surélevée',
      hex: '#4A4540',
      variable: '--color-bg-elevated',
      usage: 'Cartes, conteneurs, composants',
    },
    {
      name: 'Fond profond',
      hex: '#2A2520',
      variable: '--color-bg-subtle',
      usage: 'Zones d\'ombre, footer, blocs de code',
    },
    {
      name: 'Texte principal',
      hex: '#F5F0EB',
      variable: '--color-text-primary',
      usage: 'Titres, corps de texte, contenu prioritaire',
    },
    {
      name: 'Texte secondaire',
      hex: '#8E8882',
      variable: '--color-text-secondary',
      usage: 'Légendes, métadonnées, texte d\'appoint',
    },
    {
      name: 'Accent ambré',
      hex: '#F0A522',
      variable: '--color-accent',
      usage: 'Liens, survols, surbrillances, éléments interactifs',
    },
  ];

  /* -- Pairing typographique -- */
  protected readonly typoPairs: readonly TypoPair[] = [
    {
      font: 'Cabinet Grotesk',
      role: 'Display — titres, navigation, labels',
      weight: 'Bold (700), Extrabold (800)',
      sample: 'Le Swarm orchestre vos agents',
      cssClass: 'typo-demo__sample--display',
    },
    {
      font: 'Satoshi',
      role: 'Body — paragraphes, code, tableaux, métadonnées',
      weight: 'Regular (400), Medium (500)',
      sample: 'Chaque agent est spécialisé et autonome dans son domaine d\'expertise.',
      cssClass: 'typo-demo__sample--body',
    },
  ];

  /* -- Système d'élévation -- */
  protected readonly elevationLevels: readonly ElevationLevel[] = [
    {
      level: 'N1',
      name: 'Page',
      background: '#3A3530',
      border: '—',
      shadow: '—',
    },
    {
      level: 'N2',
      name: 'Carte',
      background: '#4A4540',
      border: '1px rgba(142,136,130, 0.12)',
      shadow: '—',
    },
    {
      level: 'N3',
      name: 'Carte surélevée',
      background: '#4A4540',
      border: '1px rgba(142,136,130, 0.2)',
      shadow: '0 0 20px rgba(240,165,34, 0.04)',
    },
    {
      level: 'N4',
      name: 'Modale',
      background: '#4A4540',
      border: '1px rgba(142,136,130, 0.3)',
      shadow: '0 0 40px rgba(240,165,34, 0.06) + blur(12px)',
    },
  ];

  /* -- Vocabulaire d'animation -- */
  protected readonly animationVocabulary: readonly AnimationEntry[] = [
    {
      context: 'Transition de page',
      properties: 'fade + translateY(8px→0)',
      duration: '400ms',
      easing: 'cubic-bezier(0.22,1,0.36,1)',
    },
    {
      context: 'Navigation (hover)',
      properties: 'color + scale(1.02)',
      duration: '200ms',
      easing: 'ease-out',
    },
    {
      context: 'Stagger contenu',
      properties: 'fade + translateY(16px→0)',
      duration: '80ms/item',
      easing: 'ease-out',
    },
    {
      context: 'Hover carte',
      properties: 'translateY(-2px) + glow',
      duration: '250ms',
      easing: 'cubic-bezier(0.25,0.46,0.45,0.94)',
    },
    {
      context: 'Active (press)',
      properties: 'scale(0.97)',
      duration: '100ms',
      easing: 'ease-in-out',
    },
    {
      context: 'Scroll décoratif',
      properties: 'parallaxe, sticky',
      duration: 'continu',
      easing: 'linear',
    },
  ];

  /* ==========================================================================
   * Section 2 — Conventions de code
   * ========================================================================== */

  protected readonly codeConventions: readonly CodeConvention[] = [
    {
      title: 'Architecture Angular',
      description: 'Composants standalone, pas de NgModules. Chaque feature est lazy-loadée via son fichier .routes.ts dédié.',
      examples: [
        '@Component({ standalone: true })',
        'loadChildren: () => import(\'./feature/feature.routes\')',
      ],
    },
    {
      title: 'TypeScript strict',
      description: 'Mode strict activé dans tsconfig.json. Pas de any, pas de @ts-ignore. Types explicites sur toutes les signatures publiques.',
      examples: [
        'readonly items: readonly Item[]',
        'protected readonly loading = signal(true)',
      ],
    },
    {
      title: 'Nommage',
      description: 'Fichiers en kebab-case, composants en PascalCase, variables/fonctions en camelCase. Code en anglais, commentaires en français.',
      examples: [
        'standards.component.ts',
        'StandardsComponent',
        'loadContent()',
      ],
    },
    {
      title: 'Simplicité architecturale',
      description: 'Un composant = une responsabilité. Pas d\'abstraction pour usage unique. Pas de fonctionnalité non demandée. Pas de refactoring adjacent non sollicité.',
      examples: [
        'Composant < 200 lignes idéalement',
        'Helper appelé une seule fois → code inline',
      ],
    },
  ];

  /* ==========================================================================
   * Section 3 — Philosophie de test
   * ========================================================================== */

  protected readonly testPrinciples: readonly TestPrinciple[] = [
    {
      title: 'Framework de test',
      description: 'Tests unitaires avec Jest via @angular-builders/jest. Plus rapide que Karma, support des snapshots et du watch mode efficace.',
    },
    {
      title: 'Couverture de code',
      description: 'Seuil minimum de 80 % de couverture sur l\'ensemble du projet. Chaque composant et hook exporté doit avoir au moins un test unitaire.',
    },
    {
      title: 'Tests end-to-end',
      description: 'Playwright pour les tests de navigation complète, le rendu Markdown, le responsive et les snapshots visuels. Chromium + iPhone 14.',
    },
    {
      title: 'Pattern AAA',
      description: 'Arrange, Act, Assert — chaque test suit ce pattern. Les tests sont indépendants, déterministes et lisibles par un humain.',
    },
  ];

  /* ==========================================================================
   * Section 4 — Documentation
   * ========================================================================== */

  protected readonly docResources: readonly DocResource[] = [
    {
      title: 'AGENTS.md',
      description: 'Document maître définissant les règles comportementales, la stack technique, la palette de couleurs et les standards pour tous les agents du Swarm.',
    },
    {
      title: 'CHANGELOG.md',
      description: 'Mise à jour automatique après chaque merge par l\'agent writer. Historique chronologique de toutes les modifications du projet.',
    },
    {
      title: 'Agent writer',
      description: 'Agent dédié à la documentation. Déclenché sur les routes MEDIUM (si endpoint public) et FULL (toujours). Met à jour CHANGELOG, ARCHITECTURE.md et README.',
    },
    {
      title: 'Synchronisation post-merge',
      description: 'La documentation est toujours synchronisée avec le code. Après chaque merge, l\'agent writer garantit que les docs reflètent l\'état réel du codebase.',
    },
  ];

  /* ==========================================================================
   * Section 5 — Checklist qualité
   * ========================================================================== */

  protected readonly qualityChecklist: readonly QualityCheckItem[] = [
    {
      title: 'Palette 6 couleurs respectée',
      description: 'Aucune couleur hors palette. Pas de violet, pas de bleu, pas d\'indigo. Dark mode exclusif, pas de media query light.',
      category: 'design',
    },
    {
      title: 'Pairing typographique cohérent',
      description: 'Cabinet Grotesk pour les titres et la navigation, Satoshi pour le corps de texte. Hiérarchie dramatique avec au moins 3 niveaux de contraste typographique.',
      category: 'design',
    },
    {
      title: 'Système d\'élévation N1-N4',
      description: 'Glow borders appliqués correctement selon le niveau de profondeur. Pas d\'ombres portées CSS classiques.',
      category: 'design',
    },
    {
      title: 'Animations cinématiques au scroll',
      description: 'Stagger systématique, parallaxe multi-couches, easings personnalisés. Pas de fade-in basique comme seule animation.',
      category: 'design',
    },
    {
      title: 'Composant < 200 lignes',
      description: 'Un composant = une responsabilité. Pas d\'abstraction pour usage unique. Pas de logique métier dans le template.',
      category: 'code',
    },
    {
      title: 'TypeScript strict, zéro `any`',
      description: 'Mode strict activé. Types explicites sur toutes les signatures publiques. Pas de @ts-ignore. Interfaces dédiées pour les données.',
      category: 'code',
    },
    {
      title: 'Nommage cohérent',
      description: 'Fichiers en kebab-case, composants en PascalCase, méthodes en camelCase. Code en anglais, commentaires en français.',
      category: 'code',
    },
    {
      title: 'Tests unitaires par composant',
      description: 'Chaque composant et hook exporté a au moins un test unitaire. Pattern AAA (Arrange, Act, Assert). Tests indépendants et déterministes.',
      category: 'test',
    },
    {
      title: 'Couverture ≥ 80%',
      description: 'Seuil de couverture global minimum. Les zones critiques (services, utilitaires) visent 90%+.',
      category: 'test',
    },
    {
      title: 'Tests E2E pour les flux critiques',
      description: 'Playwright sur Chromium + iPhone 14. Navigation, recherche, rendu Markdown, responsive validés automatiquement.',
      category: 'test',
    },
    {
      title: 'Navigation clavier complète',
      description: 'Tab, Enter, Escape, flèches fonctionnels sur tous les composants interactifs. Skip-to-content présent. Pas de piège au clavier.',
      category: 'accessibilité',
    },
    {
      title: 'Contrastes WCAG AA',
      description: 'Vérifier les contrastes de la palette dark sur tous les textes. Touch targets ≥ 44×44px. Labels aria sur tous les éléments interactifs.',
      category: 'accessibilité',
    },
  ];

  /** Retourne le label français pour une catégorie de checklist */
  protected getCheckCategoryLabel(category: QualityCheckItem['category']): string {
    const labels: Record<QualityCheckItem['category'], string> = {
      design: 'Design',
      code: 'Code',
      test: 'Tests',
      accessibilité: 'Accessibilité',
    };
    return labels[category];
  }

  /* ==========================================================================
   * Références DOM pour animations
   * ========================================================================== */

  private _readyCheckInterval: ReturnType<typeof setInterval> | null = null;
  private revealObserver?: IntersectionObserver;

  /* ==========================================================================
   * Lifecycle
   * ========================================================================== */

  ngAfterViewInit(): void {
    this.initContent();
    this.setupScrollAnimations();
  }

  ngOnDestroy(): void {
    this.stopReadyCheck();
    this.revealObserver?.disconnect();
  }

  /** Méthode de retry — réinitialise le chargement. */
  protected retry(): void {
    this.loading.set(true);
    this.error.set(null);
    this.initContent();
  }

  /* ==========================================================================
   * Méthodes privées
   * ========================================================================== */

  private initContent(): void {
    setTimeout(() => {
      this.loading.set(false);
    }, LOADING_SIMULATION_DELAY_MS);
  }

  private setupScrollAnimations(): void {
    this._readyCheckInterval = setInterval(() => {
      if (!this.loading()) {
        this.stopReadyCheck();
        this.observeRevealElements();
      }
    }, READY_CHECK_INTERVAL_MS);

    setTimeout(() => this.stopReadyCheck(), READY_CHECK_TIMEOUT_MS);
  }

  private observeRevealElements(): void {
    const revealElements = this.elementRef.nativeElement.querySelectorAll('.reveal-on-scroll') as NodeListOf<Element>;

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            this.revealObserver!.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => this.revealObserver!.observe(el));
  }

  private stopReadyCheck(): void {
    if (this._readyCheckInterval) {
      clearInterval(this._readyCheckInterval);
      this._readyCheckInterval = null;
    }
  }
}
