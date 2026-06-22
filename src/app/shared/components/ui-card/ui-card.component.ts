import { Component, Input } from '@angular/core';

/** Variants visuels supportés par la carte */
export type CardVariant = 'default' | 'glass' | 'hover' | 'bento';

/** Tailles de padding interne */
export type CardPadding = 'sm' | 'md' | 'lg' | 'none';

/**
 * Carte partagée — surface conteneur avec variants visuels.
 *
 * États gérés :
 * - default : surface simple avec bordure subtile (élévation N2)
 * - glass : fond translucide avec flou d'arrière-plan (glassmorphism)
 * - hover : tilt 3D CSS-only au survol + glow ambré
 * - bento : étend la carte sur 2 colonnes dans une grille CSS parente
 *
 * Accessibilité : role="article" implicite, contenu projeté via ng-content.
 */
@Component({
  selector: 'app-ui-card',
  standalone: true,
  templateUrl: './ui-card.component.html',
  styleUrls: ['./ui-card.component.scss'],
  host: {
    '[class.ui-card--bento]': 'variant === "bento"',
  },
})
export class UiCardComponent {
  /** Variant visuel de la carte */
  @Input() variant: CardVariant = 'default';

  /** Taille du padding interne */
  @Input() padding: CardPadding = 'md';

  /** Si true, le curseur devient pointer (indique une carte cliquable) */
  @Input() clickable = false;

  /** Si true, applique une bordure et un glow ambré subtil */
  @Input() highlight = false;
}
