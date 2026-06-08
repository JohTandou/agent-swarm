import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '../ui-button/ui-button.component';

/**
 * Composant d'état vide partagé — illustre visuellement l'absence de contenu.
 *
 * Utilisé lorsque des listes, résultats de recherche ou pages sont vides.
 * Affiche une illustration hexagonale animée, un titre, une description,
 * et jusqu'à deux calls-to-action (primaire + secondaire).
 *
 * États gérés :
 * - Empty (titre + description + actions)
 * - Minimal (pas de titre → illustration seule)
 * - Action unique (bouton primaire uniquement)
 * - Double action (bouton primaire + lien secondaire)
 *
 * Accessibilité : illustration marquée aria-hidden, titres sémantiques.
 */
@Component({
  selector: 'app-ui-empty-state',
  standalone: true,
  imports: [UiButtonComponent, RouterLink],
  templateUrl: './ui-empty-state.component.html',
  styleUrls: ['./ui-empty-state.component.scss'],
})
export class UiEmptyStateComponent {
  /** Titre principal de l'état vide */
  @Input() title = '';

  /** Description secondaire, sous le titre */
  @Input() description = '';

  /** Label du bouton d'action primaire */
  @Input() primaryActionLabel = '';

  /** Label du lien d'action secondaire */
  @Input() secondaryActionLabel = '';

  /** Route du lien d'action secondaire (format Angular : ['/path'] ou '/path') */
  @Input() secondaryActionRoute: string | string[] = '';

  /** Émis au clic sur le bouton d'action primaire */
  @Output() primaryAction = new EventEmitter<void>();
}
