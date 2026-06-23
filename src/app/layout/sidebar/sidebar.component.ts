import { Component, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import type { NavItem } from '@shared/models';
import { UiButtonComponent } from '@shared/components/ui-button/ui-button.component';
import { TranslationService } from '@shared/services/translation.service';
import { LanguageService } from '@shared/services/language.service';

/** Mapping des labels français du menu → clés de traduction i18n */
const NAV_LABEL_KEYS: Record<string, string> = {
  'Accueil': 'nav.home',
  'À propos': 'nav.about',
  'Workflow': 'nav.workflow',
  'Écosystème': 'nav.ecosystem',
  'Problème & Innovation': 'nav.problem',
  'Agents': 'nav.agents',
  'Skills': 'nav.skills',
  'Outils MCP': 'nav.mcp',
  'Orchestrateur': 'sidebar.children.orchestrateur',
  'Front': 'sidebar.children.front',
  'Back': 'sidebar.children.back',
  'Search': 'sidebar.children.search',
  'Planner': 'sidebar.children.planner',
  'Contract': 'sidebar.children.contract',
  'Tester': 'sidebar.children.tester',
  'Reviewer': 'sidebar.children.reviewer',
  'Writer': 'sidebar.children.writer',
  'Explore': 'sidebar.children.explore',
  'General': 'sidebar.children.general',
  'UI/UX Pro Max': 'sidebar.children.uiux',
  'Tests Create': 'sidebar.children.testsCreate',
  'Graphify': 'sidebar.children.graphify',
  'Supabase': 'sidebar.children.supabase',
  'Vercel': 'sidebar.children.vercel',
  'Render': 'sidebar.children.render',
  'Playwright': 'sidebar.children.playwright',
  'Context7': 'sidebar.children.context7',
  '21st.dev': 'sidebar.children.magic',
};

/**
 * Sidebar de navigation hiérarchique.
 * 280px fixed left desktop, overlay mobile.
 * Menus pliables, hover premium (scale + glow ambré).
 * Labels et routes adaptés dynamiquement à la langue active.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, UiButtonComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  private readonly langService = inject(LanguageService);

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
    { label: 'Workflow', route: '/workflow' },
    { label: 'Écosystème', route: '/ecosysteme' },
    { label: 'Problème & Innovation', route: '/probleme-innovation' },
    {
      label: 'Agents',
      route: '/agents',
      expanded: false,
      children: [
        { label: 'Orchestrateur', route: '/agents/orchestrateur' },
        { label: 'Front', route: '/agents/front' },
        { label: 'Back', route: '/agents/back' },
        { label: 'Search', route: '/agents/search' },
        { label: 'Planner', route: '/agents/planner' },
        { label: 'Contract', route: '/agents/contract' },
        { label: 'Tester', route: '/agents/tester' },
        { label: 'Reviewer', route: '/agents/reviewer' },
        { label: 'Writer', route: '/agents/writer' },
        { label: 'Explore', route: '/agents/explore' },
        { label: 'General', route: '/agents/general' },
      ],
    },
    {
      label: 'Skills',
      route: '/skills',
      expanded: false,
      children: [
        { label: 'UI/UX Pro Max', route: '/skills/ui-ux-pro-max' },
        { label: 'Tests Create', route: '/skills/tests-create' },
        { label: 'Graphify', route: '/skills/graphify' },
      ],
    },
    {
      label: 'Outils MCP',
      route: '/outils-mcp',
      expanded: false,
      expandOnClick: true,
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

  /** Traduit un label de navigation français via le dictionnaire i18n */
  translateNavLabel(frLabel: string): string {
    const key = NAV_LABEL_KEYS[frLabel];
    return key ? this.translationService.translate(key) : frLabel;
  }

  /** Retourne la traduction pour la clé donnée dans la langue courante */
  t(key: string): string {
    return this.translationService.translate(key);
  }

  /** Localise une route FR vers la langue courante via LanguageService */
  localizeRoute(route: string): string {
    return this.langService.localizeRoute(route);
  }

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
    if (!item.children) return;
    item.expanded = !item.expanded;
    if (item.expandOnClick && item.expanded && item.children.length > 0) {
      void this.router.navigate([this.localizeRoute(item.children[0].route)]);
    }
  }

  /** Indique si la route courante est un enfant de l'item parent */
  isParentActive(item: NavItem): boolean {
    return this.router.url.startsWith(this.localizeRoute(item.route) + '/');
  }
}
