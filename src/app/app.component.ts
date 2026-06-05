import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { BreadcrumbsComponent } from './layout/breadcrumbs/breadcrumbs.component';
import { TableOfContentsComponent } from './shared/components/table-of-contents/table-of-contents.component';
import type { Breadcrumb } from '@shared/models';

/**
 * Composant racine — Shell applicatif.
 * Gère le layout responsive (3 colonnes desktop, 1 colonne mobile),
 * l'état de la sidebar et les signaux réactifs.
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
export class AppComponent {
  /** Détection mobile via BreakpointObserver CDK */
  readonly isMobile = signal(false);

  /** État d'ouverture de la sidebar (mobile : overlay, desktop : permanente) */
  readonly sidebarOpen = signal(false);

  /** Fil d'Ariane placeholder en attendant le service de routing contextuel */
  readonly breadcrumbs: Breadcrumb[] = [
    { label: 'Accueil', route: '/' },
    { label: 'Documentation' },
  ];

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
        /* Ferme la sidebar overlay quand on passe en desktop */
        if (!result.matches) {
          this.sidebarOpen.set(false);
        }
      });
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
