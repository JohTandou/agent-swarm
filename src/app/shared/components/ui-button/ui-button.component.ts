import { Component, Input } from '@angular/core';

/** Variants disponibles pour le bouton */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'icon' | 'accent';

/** Tailles disponibles pour le bouton */
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Type HTML natif supporté par le bouton */
export type ButtonType = 'button' | 'submit';

/**
 * Composant bouton partagé du design system Swarm Wiki.
 *
 * États gérés :
 * - Normal (chaque variant avec son style propre)
 * - Hover (glow, changement de luminosité)
 * - Active / Press (scale 0.97)
 * - Focus-visible (anneau accent)
 * - Disabled (opacité réduite, pas d'interaction)
 * - Loading (dots animés, bouton désactivé)
 *
 * Accessibilité : aria-busy sur état loading, focus-visible natif.
 */
@Component({
  selector: 'app-ui-button',
  standalone: true,
  templateUrl: './ui-button.component.html',
  styleUrls: ['./ui-button.component.scss'],
})
export class UiButtonComponent {
  /** Variant visuel du bouton */
  @Input() variant: ButtonVariant = 'primary';

  /** Taille du bouton (sm, md, lg) */
  @Input() size: ButtonSize = 'md';

  /** Désactive le bouton (empêche toute interaction) */
  @Input() disabled = false;

  /** Affiche l'état de chargement avec dots animés */
  @Input() loading = false;

  /** Type HTML du bouton (button ou submit) */
  @Input() type: ButtonType = 'button';
}
