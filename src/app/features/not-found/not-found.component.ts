import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';

/**
 * Page 404 — Affichée lorsque l'utilisateur navigue vers une route inexistante.
 *
 * Design Apple-grade : grand "404" en Cabinet Grotesk Extrabold avec dégradé ambré,
 * hexagone SVG décoratif en arrière-plan, deux boutons pour rediriger l'utilisateur.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, UiButtonComponent],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {}
