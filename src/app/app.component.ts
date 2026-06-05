import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription, filter } from 'rxjs';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { TableOfContentsComponent } from './shared/components/table-of-contents/table-of-contents.component';
import type { Breadcrumb } from '@shared/models';

/**
 * Composant racine — Shell applicatif.
 * Gère le layout responsive (3 colonnes desktop, 1 colonne mobile),
 * l'état de la sidebar, et le mode plein écran pour la page d'accueil.
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

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
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
        })
    );

    /* Détection initiale (avant tout événement de navigation) */
    const currentUrl = this.router.url;
    this.isHomepage.set(currentUrl === '/' || currentUrl === '');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /** Bascule l'état d'ouverture de la sidebar (mobile uniquement) */
  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  /** Ferme la sidebar (utilisé par le bouton close et l'overlay) */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
