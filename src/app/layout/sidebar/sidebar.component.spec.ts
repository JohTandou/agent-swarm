import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SidebarComponent } from './sidebar.component';
import { ContentService } from '@shared/services/content.service';
import { LanguageService } from '@shared/services/language.service';
import type { Skill } from '@shared/models';

const MOCK_SKILLS: Skill[] = [
  {
    id: 'ui-ux-pro-max',
    name: 'UI/UX Pro Max',
    emoji: '🎨',
    description: 'Intelligence de design',
    tags: [],
    category: 'creation',
    sourcePath: 'skills/ui-ux-pro-max.md',
    order: 1,
  },
  {
    id: 'tests-create',
    name: 'Tests Create',
    emoji: '🧪',
    description: 'Génération de tests',
    tags: [],
    category: 'creation',
    sourcePath: 'skills/tests-create.md',
    order: 2,
  },
  {
    id: 'graphify',
    name: 'Graphify',
    emoji: '🕸️',
    description: 'Transforme en graphe',
    tags: [],
    category: 'audit',
    sourcePath: 'skills/graphify.md',
    order: 3,
  },
];

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let contentService: ContentService;

  beforeEach(async () => {
    sessionStorage.clear();
    const mockContentService = {
      loadSkillsManifest: () => of(MOCK_SKILLS),
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ContentService, useValue: mockContentService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    contentService = TestBed.inject(ContentService);
    TestBed.inject(LanguageService).setLang('fr');
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir une liste de navItems non vide', () => {
    expect(component.navItems.length).toBeGreaterThan(0);
  });

  it('devrait afficher tous les éléments de navigation', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.sidebar__item');
    // Accueil, À propos, Agents (parent), Skills (parent), Workflow, Écosystème, Outils MCP (parent) = 7 top-level
    // Plus Problème & Innovation = 8
    expect(items.length).toBe(8);
  });

  it('devrait charger les skills dynamiquement dans la sidebar', () => {
    const skillsNode = component.navItems.find((item) => item.label === 'Skills');
    expect(skillsNode).toBeDefined();
    expect(skillsNode!.children).toBeDefined();
    expect(skillsNode!.children!.length).toBe(3);
    expect(skillsNode!.children![0].label).toBe('UI/UX Pro Max');
    expect(skillsNode!.children![0].route).toBe('/skills/ui-ux-pro-max');
  });

  it('devrait masquer le bouton close quand isMobile est false', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const closeBtn = fixture.nativeElement.querySelector('app-ui-button');
    expect(closeBtn).toBeFalsy();
  });

  it('devrait afficher le bouton close quand isMobile est true', () => {
    component.isMobile = true;
    fixture.detectChanges();
    const closeBtn = fixture.nativeElement.querySelector('app-ui-button');
    expect(closeBtn).toBeTruthy();
  });

  it('devrait émettre closeSidebar quand le bouton close est cliqué (mobile)', () => {
    component.isMobile = true;
    fixture.detectChanges();
    const emitSpy = spyOn(component.closeSidebar, 'emit');
    const closeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('app-ui-button');
    closeBtn.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('devrait basculer expanded et afficher les enfants au clic sur le chevron', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const parentDivs = fixture.nativeElement.querySelectorAll('.sidebar__link--parent');
    // "Agents" est le premier parent (pas de expandOnClick)
    const agentsDiv: HTMLElement = parentDivs[0];
    expect(agentsDiv.textContent?.trim()).toContain('Agents');
    
    // Avant clic : enfants masqués
    expect(fixture.nativeElement.querySelector('.sidebar__sublist')).toBeFalsy();
    
    // Cliquer sur le bouton chevron à l'intérieur du parent
    const expandBtn = agentsDiv.querySelector('.sidebar__expand-btn') as HTMLButtonElement;
    expect(expandBtn).toBeTruthy();
    expandBtn.click();
    fixture.detectChanges();
    
    // Après clic : enfants visibles
    const sublist = fixture.nativeElement.querySelector('.sidebar__sublist');
    expect(sublist).toBeTruthy();
    
    // Vérifie les enfants — 11 agents maintenant
    const childLinks = sublist.querySelectorAll('.sidebar__link--child');
    expect(childLinks.length).toBe(11);
    expect(childLinks[0].textContent?.trim()).toBe('Orchestrateur');
  });

  it('ne devrait pas basculer expanded pour un item sans enfants', () => {
    const leafItem = component.navItems[0]; // Accueil — pas d'enfants
    expect(leafItem.children).toBeUndefined();
    const previous = leafItem.expanded;
    component.toggleExpanded(leafItem);
    expect(leafItem.expanded).toBe(previous);
  });

  it("devrait naviguer vers le premier enfant et basculer expanded quand expandOnClick est true", async () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

    const outilsMcp = component.navItems.find((item) => item.label === 'Outils MCP');
    expect(outilsMcp).toBeDefined();
    expect(outilsMcp!.expandOnClick).toBeTrue();
    expect(outilsMcp!.expanded).toBeFalse();

    component.toggleExpanded(outilsMcp!);

    expect(outilsMcp!.expanded).toBeTrue();
    // La sidebar est en mode FR (setLang('fr') dans beforeEach), donc la route reste FR
    expect(navigateSpy).toHaveBeenCalledWith(['/outils-mcp/supabase']);
  });

  it('devrait avoir le role navigation et aria-label', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const aside: HTMLElement = fixture.nativeElement.querySelector('.sidebar');
    expect(aside.getAttribute('role')).toBe('navigation');
    expect(aside.getAttribute('aria-label')).toBe('Navigation principale');
  });

  it('should track nav items by route for @for loop stability', () => {
    const routes = component.navItems.map((item) => item.route);
    const uniqueRoutes = new Set(routes);
    expect(uniqueRoutes.size).toBe(routes.length);
  });
});
