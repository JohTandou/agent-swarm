import { Component, Input } from '@angular/core';

/** Variantes disponibles pour le badge */
export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

/** Tailles disponibles pour le badge */
export type BadgeSize = 'sm' | 'md';

/**
 * ui-badge — Badge sémantique pour étiqueter du contenu.
 *
 * Affiche une pastille colorée avec un libellé projeté via ng-content.
 * Supporte 5 variantes sémantiques (default, success, warning, error, info)
 * et 2 tailles (sm, md).
 *
 * @example
 *   <app-ui-badge variant="success">Actif</app-ui-badge>
 *   <app-ui-badge variant="warning" size="sm">Attention</app-ui-badge>
 */
@Component({
  selector: 'app-ui-badge',
  standalone: true,
  templateUrl: './ui-badge.component.html',
  styleUrls: ['./ui-badge.component.scss'],
})
export class UiBadgeComponent {
  /** Variante sémantique du badge */
  @Input() variant: BadgeVariant = 'default';

  /** Taille du badge (sm = compact, md = standard) */
  @Input() size: BadgeSize = 'md';
}
