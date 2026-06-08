import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';

/**
 * En-tête fixe glassmorphique.
 * Brand "Swarm Wiki" + navigation primaire (desktop) + hamburger (mobile).
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

  /** État de la sidebar pour l'icône hamburger (croix quand ouvert) */
  @Input() sidebarOpen = false;

  /** Émet quand l'utilisateur clique sur le hamburger */
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Émet quand l'utilisateur clique sur le bouton de recherche */
  @Output() openSearch = new EventEmitter<void>();

  onSearchClick(): void {
    this.openSearch.emit();
  }
}
