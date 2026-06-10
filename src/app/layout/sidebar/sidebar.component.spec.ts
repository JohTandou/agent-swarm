import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
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
    expect(items.length).toBe(8);
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

  it('devrait basculer expanded et afficher les enfants au clic sur un parent', () => {
    component.isMobile = false;
    fixture.detectChanges();
    const parentButtons = fixture.nativeElement.querySelectorAll('.sidebar__link--parent');
    // Cliquer sur "Agents" (premier parent)
    const agentsBtn: HTMLButtonElement = parentButtons[0];
    expect(agentsBtn.textContent?.trim()).toContain('Agents');
    
    // Avant clic : enfants masqués
    expect(fixture.nativeElement.querySelector('.sidebar__sublist')).toBeFalsy();
    
    agentsBtn.click();
    fixture.detectChanges();
    
    // Après clic : enfants visibles
    const sublist = fixture.nativeElement.querySelector('.sidebar__sublist');
    expect(sublist).toBeTruthy();
    
    // Vérifie les enfants
    const childLinks = sublist.querySelectorAll('.sidebar__link--child');
    expect(childLinks.length).toBe(3);
    expect(childLinks[0].textContent?.trim()).toBe('Orchestrateur');
  });

  it('ne devrait pas basculer expanded pour un item sans enfants', () => {
    const leafItem = component.navItems[0]; // Accueil — pas d'enfants
    expect(leafItem.children).toBeUndefined();
    const previous = leafItem.expanded;
    component.toggleExpanded(leafItem);
    expect(leafItem.expanded).toBe(previous);
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
    // Vérifie que toutes les routes sont uniques (pas de doublon)
    const uniqueRoutes = new Set(routes);
    expect(uniqueRoutes.size).toBe(routes.length);
  });
});
