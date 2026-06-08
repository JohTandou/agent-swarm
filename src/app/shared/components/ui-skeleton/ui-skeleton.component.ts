import { Component, Input } from '@angular/core';

/**
 * Variants disponibles pour le skeleton loader.
 */
export type SkeletonVariant = 'text' | 'card' | 'circle' | 'table-row';

/**
 * Skeleton loader réutilisable avec shimmer ambré.
 *
 * Variants :
 * - `text` (défaut) : ligne de texte, 16px de haut
 * - `card` : carte placeholder, 200px de haut
 * - `circle` : rond placeholder, aspect-ratio 1:1
 * - `table-row` : ligne de tableau, 48px de haut
 *
 * Utilisation dans un @for avec stagger :
 * ```html
 * @for (item of skeletonArray; track $index) {
 *   <app-ui-skeleton variant="text" [delay]="$index * 80" width="80%" />
 * }
 * ```
 *
 * Accessibilité : `aria-hidden="true"` — purement décoratif.
 */
@Component({
  selector: 'app-ui-skeleton',
  standalone: true,
  templateUrl: './ui-skeleton.component.html',
  styleUrls: ['./ui-skeleton.component.scss'],
})
export class UiSkeletonComponent {
  /** Forme du skeleton */
  @Input() variant: SkeletonVariant = 'text';

  /** Largeur CSS (ex: '100%', '200px') */
  @Input() width = '100%';

  /** Hauteur CSS (auto = défaut par variant) */
  @Input() height = 'auto';

  /** Délai d'animation en ms (pour stagger) */
  @Input() delay = 0;
}
