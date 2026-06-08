import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';

/**
 * Page "À propos du Swarm" — Contenu riche structuré en sections.
 *
 * Présente la philosophie, l'équipe, le pipeline et les chiffres clés
 * du système Swarm de développement agentic.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [UiButtonComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  private readonly router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
