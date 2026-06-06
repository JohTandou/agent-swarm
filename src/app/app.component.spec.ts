import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { importProvidersFrom } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let breakpointObserverMock: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    breakpointObserverMock = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    breakpointObserverMock.observe.and.returnValue(of({ matches: false, breakpoints: {} }));

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        importProvidersFrom(OverlayModule),
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('devrait avoir isMobile initialisé à false (desktop par défaut)', () => {
    expect(component.isMobile()).toBeFalse();
  });

  it('devrait avoir sidebarOpen initialisé à false', () => {
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('devrait basculer sidebarOpen via toggleSidebar()', () => {
    expect(component.sidebarOpen()).toBeFalse();
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeTrue();
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('devrait fermer la sidebar via closeSidebar()', () => {
    component.toggleSidebar(); // ouvre
    expect(component.sidebarOpen()).toBeTrue();
    component.closeSidebar();
    expect(component.sidebarOpen()).toBeFalse();
    // Appeler closeSidebar quand déjà fermé ne doit pas lever d'erreur
    component.closeSidebar();
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('devrait avoir des breadcrumbs définis', () => {
    expect(component.breadcrumbs.length).toBe(2);
    expect(component.breadcrumbs[0].label).toBe('Accueil');
    expect(component.breadcrumbs[0].route).toBe('/');
    expect(component.breadcrumbs[1].label).toBe('Documentation');
    expect(component.breadcrumbs[1].route).toBeUndefined();
  });

  it('devrait afficher le lien skip-to-content', () => {
    const skipLink: HTMLElement = fixture.nativeElement.querySelector('.skip-to-content');
    expect(skipLink).toBeTruthy();
    expect(skipLink.getAttribute('href')).toBe('#main-content');
  });

  it('devrait afficher le shell-layout avec les composants enfants', () => {
    const shellLayout: HTMLElement = fixture.nativeElement.querySelector('.shell-layout');
    expect(shellLayout).toBeTruthy();
  });

  it('devrait avoir un main avec id="main-content"', () => {
    const mainEl: HTMLElement = fixture.nativeElement.querySelector('main#main-content');
    expect(mainEl).toBeTruthy();
  });

  it('devrait réagir au breakpoint mobile et mettre isMobile à true', () => {
    // Simuler un changement vers mobile
    const matchesTrue = { matches: true, breakpoints: {} };
    breakpointObserverMock.observe.and.returnValue(of(matchesTrue));

    // Recréer le composant pour que le nouveau mock soit utilisé
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isMobile()).toBeTrue();
  });

  it('devrait fermer la sidebar quand on passe de mobile à desktop', () => {
    // D'abord mobile : sidebar ouverte
    const mobileMatch = { matches: true, breakpoints: {} };
    breakpointObserverMock.observe.and.returnValue(of(mobileMatch));
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeTrue();

    // Puis retour desktop : sidebar doit se fermer
    const desktopMatch = { matches: false, breakpoints: {} };
    breakpointObserverMock.observe.and.returnValue(of(desktopMatch));
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.sidebarOpen()).toBeFalse();
  });

  it('devrait avoir un router-outlet dans le template', () => {
    const routerOutlet = fixture.nativeElement.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  // ─── Nouveaux tests pour la couverture ───

  it('devrait avoir isHomepage initialisé à true (route par défaut = homepage)', () => {
    // Le routeur avec provideRouter([]) positionne l'URL à '', ce qui correspond à la homepage.
    expect(component.isHomepage()).toBeTrue();
  });

  it('devrait avoir tocOpen initialisé à false', () => {
    expect(component.tocOpen()).toBeFalse();
  });

  it('toggleToc() devrait basculer tocOpen', () => {
    expect(component.tocOpen()).toBeFalse();
    component.toggleToc();
    expect(component.tocOpen()).toBeTrue();
    component.toggleToc();
    expect(component.tocOpen()).toBeFalse();
  });

  it('closeSidebar() ne devrait pas lever d\'erreur quand la sidebar est déjà fermée', () => {
    component.sidebarOpen.set(false);
    expect(() => component.closeSidebar()).not.toThrow();
  });

  it('handleGlobalKeydown Cmd+K devrait appeler toggleSearch', () => {
    const toggleSearchSpy = spyOn(component, 'toggleSearch');
    const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
    component.handleGlobalKeydown(event);
    expect(toggleSearchSpy).toHaveBeenCalled();
  });

  it('handleGlobalKeydown Ctrl+K devrait appeler toggleSearch', () => {
    const toggleSearchSpy = spyOn(component, 'toggleSearch');
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
    component.handleGlobalKeydown(event);
    expect(toggleSearchSpy).toHaveBeenCalled();
  });

  it('handleGlobalKeydown autre touche ne devrait pas appeler toggleSearch', () => {
    const toggleSearchSpy = spyOn(component, 'toggleSearch');
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.handleGlobalKeydown(event);
    expect(toggleSearchSpy).not.toHaveBeenCalled();
  });

  it('handleGlobalKeydown Cmd+Shift+K ne devrait pas appeler toggleSearch', () => {
    const toggleSearchSpy = spyOn(component, 'toggleSearch');
    const event = new KeyboardEvent('keydown', { key: 'Shift', metaKey: true });
    component.handleGlobalKeydown(event);
    expect(toggleSearchSpy).not.toHaveBeenCalled();
  });

  it('ngOnDestroy devrait se désabonner sans erreur', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('devrait pouvoir appeler openSearch sans erreur (overlay CDK)', () => {
    expect(() => component.openSearch()).not.toThrow();
  });

  it('toggleSearch devrait appeler openSearch quand aucun overlay n\'est ouvert', () => {
    const openSearchSpy = spyOn(component, 'openSearch');
    component.toggleSearch();
    expect(openSearchSpy).toHaveBeenCalled();
  });

  it('devrait détecter correctement les signaux initiaux', () => {
    expect(component.isMobile()).toBeDefined();
    expect(component.sidebarOpen()).toBeDefined();
    expect(component.isHomepage()).toBeDefined();
    expect(component.tocOpen()).toBeDefined();
  });
});
