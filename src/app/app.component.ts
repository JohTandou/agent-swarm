import { Component, signal, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart, ActivatedRoute, Data } from '@angular/router';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { ToasterComponent } from './shared/components/toaster/toaster.component';
import { SearchModalComponent } from './shared/components/search-modal/search-modal.component';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { SearchService } from './shared/services/search.service';
import { TranslationService } from './shared/services/translation.service';
import { AnimationService } from './shared/services/animation.service';
import { LanguageService } from './shared/services/language.service';
import { ScrollProgressComponent } from './shared/components/scroll-progress/scroll-progress.component';
import { SeoService } from './shared/services/seo.service';
import { JsonLdService } from './shared/services/json-ld.service';
import type { Breadcrumb } from '@shared/models';
import { EasterEggService } from './shared/services/easter-egg.service';
import type { SearchResult } from '@shared/models';
import type { SeoConfig } from '@shared/models';

/**
 * Mapping des segments d'URL vers les clés de traduction du fil d'Ariane.
 * Les routes avec paramètres dynamiques sont détectées via préfixe.
 */
const BREADCRUMB_LABELS: Record<string, string> = {
  'agents': 'nav.agents',
  'skills': 'nav.skills',
  'workflow': 'nav.workflow',
  'probleme-innovation': 'nav.problem',
  'normes': 'Standards',
  'outils-mcp': 'nav.mcp',
  'a-propos': 'nav.about',
  'demo-markdown': 'Démo Markdown',
  'ecosysteme': 'nav.ecosystem',
};

/**
 * Labels pour les segments dynamiques (ex: /agents/:id).
 * Le deuxième segment après un préfixe connu prend ce label.
 */
const DYNAMIC_LABELS: Record<string, string> = {
  'agents': 'Agent',
  'skills': 'Skill',
  'outils-mcp': 'Catégorie',
};

/** Mapping fallback des segments FR → clé de traduction (nécessaire pour les URLs non-françaises) */
const LABEL_MAP: Record<string, string> = {
  'accueil': 'nav.home',
  'a-propos': 'nav.about',
  'agents': 'nav.agents',
  'skills': 'nav.skills',
  'workflow': 'nav.workflow',
  'ecosysteme': 'nav.ecosystem',
  'probleme-innovation': 'nav.problem',
  'outils-mcp': 'nav.mcp',
  'about': 'nav.about',
  'problem-innovation': 'nav.problem',
  'mcp-tools': 'nav.mcp',
  'ecosystem': 'nav.ecosystem',
};

/**
 * Composant racine — Shell applicatif.
 * Gère le layout responsive (3 colonnes desktop, 1 colonne mobile),
 * l'état de la sidebar, le mode plein écran pour la page d'accueil,
 * les transitions de page GSAP, et les toasts de notification.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    ToasterComponent,
    UiButtonComponent,
    ScrollProgressComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('* <=> *', [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), { optional: true }),
        group([
          query(':leave', [
            animate('250ms var(--ease-out-expo)', style({ opacity: 0, transform: 'translateY(8px)' }))
          ], { optional: true }),
          query(':enter', [
            style({ opacity: 0, transform: 'translateY(12px)' }),
            animate('350ms var(--ease-out-expo)', style({ opacity: 1, transform: 'translateY(0)' }))
          ], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('pageWrapper', { static: false })
  pageWrapperRef?: ElementRef<HTMLElement>;

  /** Détection mobile via BreakpointObserver CDK */
  readonly isMobile = signal(false);

  /** État d'ouverture de la sidebar (mobile : overlay, desktop : permanente) */
  readonly sidebarOpen = signal(false);

  /** Indique si la route courante est la page d'accueil (full-width) */
  readonly isHomepage = signal(false);


  /** Fil d'Ariane dynamique construit à partir de l'URL courante */
  readonly breadcrumbs = signal<Breadcrumb[]>([
    { label: 'Accueil', route: '/' },
  ]);

  private subscriptions = new Subscription();

  private searchOverlayRef: OverlayRef | null = null;

  private readonly activatedRoute = inject(ActivatedRoute);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private overlay: Overlay,
    private searchService: SearchService,
    private animService: AnimationService,
    private easterEggService: EasterEggService,
    private readonly seoService: SeoService,
    private readonly jsonLdService: JsonLdService,
    private readonly translationService: TranslationService,
    private readonly languageService: LanguageService,
  ) {
    this.subscriptions.add(
      this.breakpointObserver
        .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
        .subscribe((result) => {
          this.isMobile.set(result.matches);
          if (!result.matches) {
            this.sidebarOpen.set(false);
          }
        })
    );
  }

  ngOnInit(): void {
    /* Détecte la page d'accueil et construit le fil d'Ariane à la navigation */
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e) => {
          const url = (e as NavigationEnd).urlAfterRedirects;
          const isHome = url === '/' || url === '' || url === '/en' || url === '/en/';
          this.isHomepage.set(isHome);

          // Construit le fil d'Ariane dynamique
          this.breadcrumbs.set(this.buildBreadcrumbs(url));

          // Mise à jour SEO
          this.updateSeo(url, isHome);

          // Animation d'entrée de page
          const wrapper = this.pageWrapperRef?.nativeElement;
          if (wrapper && !this.animService.isReducedMotion()) {
            this.animService.pageEnter(wrapper);
          }

          // Ferme la sidebar et le TOC à chaque navigation sur mobile
          this.sidebarOpen.set(false);

          // Reset scroll position on navigation
          window.scrollTo({ top: 0, behavior: 'instant' });
        })
    );

    // Animation de sortie de page
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationStart))
        .subscribe(() => {
          const wrapper = this.pageWrapperRef?.nativeElement;
          if (wrapper && !this.animService.isReducedMotion()) {
            this.animService.pageExit(wrapper);
          }
        })
    );

    /* Détection initiale (avant tout événement de navigation) */
    const currentUrl = this.router.url;
    const isHome = currentUrl === '/' || currentUrl === '' || currentUrl === '/en' || currentUrl === '/en/';
    this.isHomepage.set(isHome);
    this.breadcrumbs.set(this.buildBreadcrumbs(currentUrl));

    // SEO : mise à jour initiale au premier chargement
    this.updateSeo(currentUrl, isHome);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.animService.killAll();
    this.jsonLdService.clearAll();
  }

  /**
   * Construit le fil d'Ariane à partir de l'URL courante.
   * Toujours commence par « Accueil » (traduit).
   * Le segment /en est ignoré.
   * Les segments sont mappés vers des labels traduits selon la langue active.
   */
  private buildBreadcrumbs(url: string): Breadcrumb[] {
    const isEnglish = this.languageService.currentLang() === 'en';
    const homeLabel = this.translationService.translate('nav.home');
    const crumbs: Breadcrumb[] = [{ label: homeLabel, route: '/' }];
    if (!url || url === '/' || url === '/en' || url === '/en/') return crumbs;

    // Nettoie l'URL : retire le leading slash et les query params
    const segments = url.replace(/^\//, '').split('/').filter((s) => s.length > 0);
    if (segments.length === 0) return crumbs;

    let accumulatedPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      // Saute le segment de langue /en
      if (segment === 'en') {
        accumulatedPath += '/en';
        continue;
      }

      accumulatedPath += '/' + segment;

      const isLast = i === segments.length - 1;

      // Détermine le label pour ce segment
      let label: string;

      if (BREADCRUMB_LABELS[segment]) {
        // Segment connu (ex: "agents", "skills") → traduire
        const key = BREADCRUMB_LABELS[segment];
        label = this.translationService.translate(key);
      } else if (isEnglish && LABEL_MAP[segment]) {
        // Fallback : segment anglais mappé → traduire
        label = this.translationService.translate(LABEL_MAP[segment]);
      } else if (i > 0 && !isLast && DYNAMIC_LABELS[segments[i - 1]]) {
        // Segment dynamique après un préfixe connu (ex: /agents/orchestrateur)
        label = DYNAMIC_LABELS[segments[i - 1]];
      } else {
        // Fallback : capitalise le segment
        label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      }
      crumbs.push({
        label,
        route: isLast ? undefined : accumulatedPath,
      });
    }

    return crumbs;
  }

  /**
   * Récupère les données de la route la plus profonde (enfant le plus imbriqué).
   * Utilisé pour extraire title et description des route data.
   */
  private getDeepestRouteData(): Data {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route.snapshot.data;
  }

  /**
   * Met à jour les métadonnées SEO (titre, meta tags, JSON-LD)
   * en fonction de l'URL courante et du statut de page d'accueil.
   */
  private updateSeo(url: string, isHomepage: boolean): void {
    const routeData = this.getDeepestRouteData();
    const pageTitle = routeData['title'] as string | undefined;
    const pageDescription = routeData['description'] as string | undefined;

    if (pageTitle) {
      const seoConfig: SeoConfig = {
        title: pageTitle,
        description: pageDescription ?? 'Wiki technique du système Swarm — pipeline d\'agents IA orchestré pour le développement logiciel. Neuf agents spécialisés collaborent pour concevoir, implémenter, tester et documenter.',
        author: 'Joh Tandou',
        image: 'https://swarm-wiki.vercel.app/assets/images/homepage-hero.jpg',
      };
      this.seoService.updatePageMeta(seoConfig);
    }

    // JSON-LD : BreadcrumbList toujours présent
    const schemas: object[] = [this.jsonLdService.generateBreadcrumbListSchema(this.breadcrumbs())];

    // Schémas supplémentaires pour la homepage
    if (isHomepage) {
      schemas.push(this.jsonLdService.generateWebSiteSchema());
      schemas.push(this.jsonLdService.generateOrganizationSchema());
    }

    this.jsonLdService.setSchemas(schemas);
  }

  /** Bascule l'état d'ouverture de la sidebar (mobile uniquement) */
  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  /** Ferme la sidebar (utilisé par le bouton close et l'overlay) */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    // Délègue au service easter egg (Konami code, etc.)
    this.easterEggService.handleKey(event.key);

    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggleSearch();
    }
  }

  toggleSearch(): void {
    if (this.searchOverlayRef) {
      this.destroySearchOverlay();
      return;
    }
    this.openSearch();
  }

  openSearch(): void {
    if (this.searchOverlayRef) return;

    this.searchService.open();

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .top('0');

    const scrollStrategy = this.overlay.scrollStrategies.block();

    this.searchOverlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy,
      hasBackdrop: false,
      panelClass: 'search-overlay-panel',
    });

    const portal = new ComponentPortal(SearchModalComponent);
    const componentRef = this.searchOverlayRef.attach(portal);

    componentRef.instance.dismiss.subscribe(() => this.destroySearchOverlay());
    componentRef.instance.navigate.subscribe((result: SearchResult) => {
      this.destroySearchOverlay();
      this.searchService.navigateToResult(result);
    });
  }

  private destroySearchOverlay(): void {
    if (this.searchOverlayRef) {
      this.searchOverlayRef.dispose();
      this.searchOverlayRef = null;
    }
    this.searchService.close();
  }


  /**
   * Retourne l'état de route pour les animations Angular.
   * Désactive les animations si prefers-reduced-motion est actif
   * (les transitions GSAP sont déjà gérées séparément par AnimationService).
   */
  getRouteState(outlet: RouterOutlet): string {
    if (this.animService.isReducedMotion()) return 'void';
    return outlet?.activatedRouteData?.['animation'] ?? 'page';
  }
}
