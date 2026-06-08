import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Page "À propos du Swarm" — Contenu riche structuré en sections.
 *
 * Présente la philosophie, l'équipe, le pipeline et les chiffres clés
 * du système Swarm de développement agentic.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {}
