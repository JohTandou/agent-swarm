import { Component, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { AnimationService } from '@shared/services/animation.service';
import { JsonLdService } from '@shared/services/json-ld.service';
import { TranslationService } from '@shared/services/translation.service';

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
export class AboutComponent implements OnDestroy, AfterViewInit {
  constructor(
    private readonly hostRef: ElementRef,
    private readonly animService: AnimationService,
    private readonly jsonLdService: JsonLdService,
    private readonly translationService: TranslationService,
  ) {
    // Ajoute le schéma Person pour l'auteur du wiki
    this.jsonLdService.addSchemas([this.jsonLdService.generatePersonSchema()]);
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }

  private initScrollAnimations(): void {
    const hostEl = this.hostRef.nativeElement as HTMLElement;
    const revealEls = hostEl.querySelectorAll('.reveal-on-scroll');
    this.animService.revealOnScroll(Array.from(revealEls), { staggerMs: 80 });
  }

  ngOnDestroy(): void {
    this.animService.killAll();
  }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }
}
