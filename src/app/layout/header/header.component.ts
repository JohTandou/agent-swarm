import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { LanguageService } from '@shared/services/language.service';
import { TranslationService } from '@shared/services/translation.service';

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
  private readonly translationService = inject(TranslationService);
  private readonly router = inject(Router);

  /** Lien d'accueil tenant compte de la langue courante */
  get homeLink(): string {
    return this.langService.currentLang() === 'en' ? '/en' : '/';
  }

  /** Lien À propos tenant compte de la langue courante */
  get aboutLink(): string {
    return this.langService.currentLang() === 'en' ? '/en/about' : '/a-propos';
  }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }

  /** Gère le clic sur le bouton hamburger — émet toggleSidebar vers le parent */
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onSearchClick(): void {
    this.openSearch.emit();
  }

  /**
   * Bascule la langue et navigue vers l'URL correspondante.
   * FR → EN : traduit le chemin avec translatePathToEn
   * EN → FR : traduit le chemin avec translatePathToFr
   */
  toggleLang(): void {
    const currentLang = this.langService.currentLang();
    const newLang: 'fr' | 'en' = currentLang === 'fr' ? 'en' : 'fr';
    const currentPath = this.router.url.split('?')[0]; // Ignore query params

    let newPath: string;
    if (newLang === 'en') {
      newPath = this.langService.translatePathToEn(
        currentLang === 'en'
          ? this.langService.translatePathToFr(currentPath)
          : currentPath
      );
    } else {
      newPath = this.langService.translatePathToFr(currentPath);
    }

    this.langService.setLang(newLang);
    this.router.navigateByUrl(newPath);
  }

  /** Route localisée pour le lien "À propos" dans le header */
  get aboutRoute(): string {
    return this.langService.localizeRoute('/a-propos');
  }
}
