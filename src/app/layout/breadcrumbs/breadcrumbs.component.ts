import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Breadcrumb } from '@shared/models';
import { TranslationService } from '@shared/services/translation.service';

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
  private readonly translationService = inject(TranslationService);

  /** Segments du fil d'Ariane (dernier = page courante, non cliquable) */
  @Input() breadcrumbs: Breadcrumb[] = [];

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }
}
