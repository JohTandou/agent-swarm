import { Component, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StaggerChildrenDirective } from '@shared/directives/stagger-children.directive';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TextRevealDirective } from '@shared/directives/text-reveal.directive';
import { AnimationService } from '@shared/services/animation.service';

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
  ) {}

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
}
