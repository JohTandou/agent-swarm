import { Component, signal, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, NavigationStart } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { TableOfContentsComponent } from './shared/components/table-of-contents/table-of-contents.component';
import { SearchModalComponent } from './shared/components/search-modal/search-modal.component';
import { SearchService } from './shared/services/search.service';
import { AnimationService } from './shared/services/animation.service';
import type { Breadcrumb } from '@shared/models';
import type { SearchResult } from '@shared/models';

/**
 * Composant racine — Shell applicatif.
 * Gère le layout responsive (3 colonnes desktop, 1 colonne mobile),
 * l'état de la sidebar, le mode plein écran pour la page d'accueil,
 * et les transitions de page GSAP.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    TableOfContentsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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

  /** Fil d'Ariane placeholder en attendant le service de routing contextuel */
  readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Documentation' },
  ];

  private subscriptions = new Subscription();

  private searchOverlayRef: OverlayRef | null = null;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private overlay: Overlay,
    private searchService: SearchService,
    private animService: AnimationService,
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
    /* Détecte la page d'accueil à la navigation */
    this.subscriptions.add(
      this.router.events
        .pipe(filter((e) => e instanceof NavigationEnd))
        .subscribe((e) => {
          const url = (e as NavigationEnd).urlAfterRedirects;
          this.isHomepage.set(url === '/' || url === '');

          // Animation d'entrée de page
          const wrapper = this.pageWrapperRef?.nativeElement;
          if (wrapper && !this.animService.isReducedMotion()) {
            this.animService.pageEnter(wrapper);
          }
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
    this.isHomepage.set(currentUrl === '/' || currentUrl === '');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.animService.killAll();
  }

  /** Bascule l'état d'ouverture de la sidebar (mobile uniquement) */
  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  /** Ferme la sidebar (utilisé par le bouton close et l'overlay) */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
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
}
