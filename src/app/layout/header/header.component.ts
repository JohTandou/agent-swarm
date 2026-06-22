import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { LanguageService } from '@shared/services/language.service';

/**
 * En-tête fixe glassmorphique.
 * Brand "Swarm Wiki" + navigation primaire (desktop) + hamburger (mobile)
 * + language switcher FR/EN.
 * Touch targets ≥ 44×44px sur mobile.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiButtonComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /** Détection mobile pour afficher/cacher la nav desktop et le hamburger */
  @Input() isMobile = false;

  /** État de la sidebar pour l'icône hamburger (hexagone quand ouvert) */
  @Input() sidebarOpen = false;

  /** Émet quand l'utilisateur clique sur le hamburger */
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Émet quand l'utilisateur clique sur le bouton de recherche */
  @Output() openSearch = new EventEmitter<void>();

  readonly langService = inject(LanguageService);
  private readonly router = inject(Router);

  /** Gère le clic sur le bouton hamburger — émet toggleSidebar vers le parent */
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onSearchClick(): void {
    this.openSearch.emit();
  }

  /**
   * Bascule la langue et navigue vers l'URL correspondante.
   * FR → EN : ajoute le préfixe /en
   * EN → FR : retire le préfixe /en
   */
  toggleLang(): void {
    const newLang = this.langService.currentLang() === 'fr' ? 'en' : 'fr';
    const currentPath = this.router.url;
    let newPath: string;

    if (newLang === 'en') {
      newPath = '/en' + (currentPath === '/' ? '' : currentPath);
    } else {
      newPath = currentPath === '/en' ? '/' : currentPath.replace(/^\/en/, '') || '/';
    }

    this.langService.setLang(newLang);
    this.router.navigateByUrl(newPath);
  }
}
