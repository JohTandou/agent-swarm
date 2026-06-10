import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import type { NavItem } from '@shared/models';

/**
 * Sidebar de navigation hiérarchique.
 * 280px fixed left desktop, overlay mobile.
 * Menus pliables, hover premium (scale + glow ambré).
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  /** Mode mobile pour afficher le bouton close */
  @Input() isMobile = false;

  /** Émet quand l'utilisateur ferme la sidebar sur mobile */
  @Output() closeSidebar = new EventEmitter<void>();

  /** Position X de départ du touch pour le swipe-to-dismiss */
  private touchStartX = 0;

  /**
   * Structure de navigation hiérarchique.
   * Placeholder — sera remplacé par un service de navigation dynamique (T2).
   */
  readonly navItems: NavItem[] = [
    { label: 'Accueil', route: '/' },
    { label: 'À propos', route: '/a-propos' },
    {
      label: 'Agents',
      route: '/agents',
      expanded: false,
      children: [
        { label: 'Orchestrateur', route: '/agents/orchestrateur' },
        { label: 'Front', route: '/agents/front' },
        { label: 'Back', route: '/agents/back' },
      ],
    },
    {
      label: 'Skills',
      route: '/skills',
      expanded: false,
      children: [
        { label: 'UI/UX Pro Max', route: '/skills/ui-ux-pro-max' },
        { label: 'Tests Create', route: '/skills/tests-create' },
      ],
    },
    { label: 'Workflow', route: '/workflow' },
    { label: 'Problème & Innovation', route: '/probleme-innovation' },
    { label: 'Écosystème', route: '/ecosysteme' },
    {
      label: 'Outils MCP',
      route: '/outils-mcp',
      expanded: false,
      children: [
        { label: 'Supabase', route: '/outils-mcp/supabase' },
        { label: 'Vercel', route: '/outils-mcp/vercel' },
        { label: 'Render', route: '/outils-mcp/render' },
        { label: 'Playwright', route: '/outils-mcp/playwright' },
        { label: 'Context7', route: '/outils-mcp/context7' },
        { label: '21st.dev', route: '/outils-mcp/magic' },
      ],
    },
  ];

  /** Détecte le début d'un touch pour le swipe-to-dismiss */
  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    if (!this.isMobile) return;
    this.touchStartX = event.touches[0].clientX;
  }

  /** Détecte la fin d'un touch — ferme la sidebar si swipe > 80px vers la droite */
  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent): void {
    if (!this.isMobile) return;
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    if (deltaX > 80) {
      this.closeSidebar.emit();
    }
  }

  /** Bascule l'expansion d'un menu parent */
  toggleExpanded(item: NavItem): void {
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }
}
