import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Breadcrumb } from '@shared/models';

/**
 * Fil d'Ariane (breadcrumbs).
 * Affiche le chemin hiérarchique de navigation.
 * Chaque segment est cliquable sauf le dernier (page courante).
 * Accessible : aria-label "Fil d'Ariane".
 */
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent {
  /** Segments du fil d'Ariane (dernier = page courante, non cliquable) */
  @Input() breadcrumbs: Breadcrumb[] = [];
}
