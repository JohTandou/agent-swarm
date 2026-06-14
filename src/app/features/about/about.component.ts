import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';

/**
 * Page "À propos de la Swarm" — Contenu riche structuré en sections.
 *
 * Présente la philosophie, l'équipe, le pipeline et les chiffres clés
 * du système Swarm de développement agentic.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [UiButtonComponent, StaggerChildrenDirective, TextRevealDirective, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
}
