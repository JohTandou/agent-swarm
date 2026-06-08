import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { McpToolsComponent } from './mcp-tools.component';
import { UiSkeletonComponent } from '@shared/components/ui-skeleton/ui-skeleton.component';

describe('McpToolsComponent', () => {
  let component: McpToolsComponent;
  let fixture: ComponentFixture<McpToolsComponent>;
  let paramMapSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    paramMapSubject = new BehaviorSubject(convertToParamMap({ category: 'supabase' }));

    await TestBed.configureTestingModule({
      imports: [McpToolsComponent, UiSkeletonComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: paramMapSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(McpToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /* ==========================================================================
   * Création
   * ========================================================================== */

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  /* ==========================================================================
   * État loading
   * ========================================================================== */

  it('devrait afficher le skeleton shimmer quand loading est true', () => {
    const skeleton: HTMLElement = fixture.nativeElement.querySelector('.mcp-tools__skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('devrait avoir 4 éléments de navigation dans le skeleton', () => {
    const navContainer = fixture.nativeElement.querySelector('.mcp-skeleton__nav');
    const navItems = navContainer.querySelectorAll('app-ui-skeleton');
    expect(navItems.length).toBe(4);
  });

  it('devrait avoir 5 lignes de tableau dans le skeleton', () => {
    const tableContainer = fixture.nativeElement.querySelector('.mcp-skeleton__table');
    const rows = tableContainer.querySelectorAll('app-ui-skeleton');
    expect(rows.length).toBe(5);
  });

  /* ==========================================================================
   * État succès — après chargement
   * ========================================================================== */

  it('devrait afficher la navigation entre catégories après chargement', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const nav = fixture.nativeElement.querySelector('.mcp-tools__nav');
    expect(nav).toBeTruthy();
  }));

  it('devrait avoir 4 onglets de catégorie', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('.mcp-nav__tab');
    expect(tabs.length).toBe(4);
  }));

  it('devrait afficher le titre de la catégorie active', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const title: HTMLElement = fixture.nativeElement.querySelector('.mcp-header__title');
    expect(title).toBeTruthy();
    expect(title.textContent?.trim()).toBe('Supabase');
  }));

  it('devrait afficher le compteur d\'outils', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const count: HTMLElement = fixture.nativeElement.querySelector('.mcp-header__count');
    expect(count).toBeTruthy();
    expect(count.textContent).toContain('10');
    expect(count.textContent).toContain('outils');
  }));

  it('devrait afficher 10 lignes dans le tableau pour Supabase', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.mcp-table__row');
    expect(rows.length).toBe(10);
  }));

  it('devrait afficher l\'exemple d\'utilisation', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const example = fixture.nativeElement.querySelector('.mcp-tools__example');
    expect(example).toBeTruthy();
  }));

  it('devrait afficher la section playground', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();
    const playground = fixture.nativeElement.querySelector('.mcp-tools__playground');
    expect(playground).toBeTruthy();
  }));

  /* ==========================================================================
   * Changement de catégorie via route
   * ========================================================================== */

  it('devrait mettre à jour la catégorie quand le paramètre de route change', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    paramMapSubject.next(convertToParamMap({ category: 'vercel' }));
    tick(600);
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('.mcp-header__title');
    expect(title.textContent?.trim()).toBe('Vercel');
  }));

  it('devrait afficher 8 outils pour Vercel', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'vercel' }));
    tick(600);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.mcp-table__row');
    expect(rows.length).toBe(8);
  }));

  it('devrait afficher 10 outils pour Render', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'render' }));
    tick(600);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.mcp-table__row');
    expect(rows.length).toBe(10);
  }));

  it('devrait afficher 10 outils pour Playwright', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'playwright' }));
    tick(600);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('.mcp-table__row');
    expect(rows.length).toBe(10);
  }));

  /* ==========================================================================
   * État erreur — catégorie inexistante
   * ========================================================================== */

  it('devrait afficher l\'état erreur pour une catégorie inconnue', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'inconnue' }));
    tick(100);
    fixture.detectChanges();

    const errorEl = fixture.nativeElement.querySelector('.mcp-tools__error');
    expect(errorEl).toBeTruthy();
    const errorMsg = fixture.nativeElement.querySelector('.mcp-error__message');
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.textContent).toContain('inconnue');
  }));

  it('devrait avoir un bouton Réessayer dans l\'état erreur', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'inconnue' }));
    tick(100);
    fixture.detectChanges();

    const retryBtn = fixture.nativeElement.querySelector('.mcp-error__actions app-ui-button');
    expect(retryBtn).toBeTruthy();
    expect(retryBtn.textContent?.trim()).toBe('Réessayer');
  }));

  it('retry() devrait réinitialiser l\'erreur et relancer le chargement', fakeAsync(() => {
    // Forcer categorie inconnue
    paramMapSubject.next(convertToParamMap({ category: 'inconnue' }));
    tick(100);
    fixture.detectChanges();

    const comp = component as any;
    expect(comp.error()).toBeTruthy();

    // Changer vers une catégorie valide pour que retry puisse réussir
    comp.categoryId.set('supabase');
    comp.retry();
    expect(comp.loading()).toBeTrue();
    expect(comp.error()).toBeNull();
  }));

  /* ==========================================================================
   * displayToolName
   * ========================================================================== */

  it('displayToolName devrait préfixer avec le namespace de la catégorie', () => {
    const tool = { name: 'apply_migration', description: '...', params: ['name'] };
    const comp = component as any;
    expect(comp.displayToolName(tool)).toBe('supabase_apply_migration');
  });

  it('displayToolName sans préfixe si catégorie sans namespace', () => {
    const comp = component as any;
    comp.categoryId.set('inconnue');
    const tool = { name: 'test', description: '...', params: [] };
    expect(comp.displayToolName(tool)).toBe('test');
  });

  /* ==========================================================================
   * Playground
   * ========================================================================== */

  it('togglePlaygroundResult devrait basculer la visibilité', () => {
    const comp = component as any;
    expect(comp.playgroundVisible()).toBeFalse();
    comp.togglePlaygroundResult();
    expect(comp.playgroundVisible()).toBeTrue();
    comp.togglePlaygroundResult();
    expect(comp.playgroundVisible()).toBeFalse();
  });

  it('le bouton du playground devrait avoir le bon texte selon l\'état', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    const btn: HTMLElement = fixture.nativeElement.querySelector('.mcp-playground__actions app-ui-button');
    expect(btn.textContent?.trim()).toContain('Assembler les paramètres');

    btn.click();
    fixture.detectChanges();
    expect(btn.textContent?.trim()).toContain('Masquer le résultat');
  }));

  it('le résultat du playground devrait afficher le JSON des paramètres', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    const btn: HTMLElement = fixture.nativeElement.querySelector('.mcp-playground__actions app-ui-button');
    btn.click();
    fixture.detectChanges();

    const result = fixture.nativeElement.querySelector('.mcp-playground__result');
    expect(result).toBeTruthy();
    const code: HTMLElement = fixture.nativeElement.querySelector('.mcp-result__code');
    expect(code).toBeTruthy();
  }));

  it('playgroundPayload devrait retourner {} si aucun paramètre rempli', () => {
    const comp = component as any;
    expect(comp.playgroundPayload()).toBe('{}');
  });

  it('playgroundValue devrait retourner une chaîne vide pour un paramètre inconnu', () => {
    const comp = component as any;
    expect(comp.playgroundValue('inconnue')).toBe('');
  });

  /* ==========================================================================
   * Navigation — onglets actifs
   * ========================================================================== */

  it('l\'onglet actif devrait avoir la classe --active', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    const activeTab = fixture.nativeElement.querySelector('.mcp-nav__tab--active');
    expect(activeTab).toBeTruthy();
    expect(activeTab.textContent?.trim()).toContain('Supabase');
  }));

  it('devrait avoir aria-current="page" sur l\'onglet actif', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    const activeTab = fixture.nativeElement.querySelector('[aria-current="page"]');
    expect(activeTab).toBeTruthy();
  }));

  /* ==========================================================================
   * Accessibilité
   * ========================================================================== */

  it('la section principale devrait avoir un aria-label approprié', () => {
    const section = fixture.nativeElement.querySelector('section[aria-label="Outils MCP"]');
    expect(section).toBeTruthy();
  });

  it('le tableau devrait avoir un aria-label', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({ category: 'supabase' }));
    tick(600);
    fixture.detectChanges();

    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
    expect(table.getAttribute('aria-label')).toContain('Liste des outils');
  }));

  /* ==========================================================================
   * Cas par défaut : catégorie absente → supabase
   * ========================================================================== */

  it('devrait utiliser supabase comme catégorie par défaut si paramètre absent', fakeAsync(() => {
    paramMapSubject.next(convertToParamMap({}));
    tick(600);
    fixture.detectChanges();

    const title: HTMLElement = fixture.nativeElement.querySelector('.mcp-header__title');
    expect(title).toBeTruthy();
    expect(title.textContent?.trim()).toBe('Supabase');
  }));

  /* ==========================================================================
   * ngOnDestroy
   * ========================================================================== */

  it('ngOnDestroy devrait se désabonner de paramMap', () => {
    const comp = component as any;
    // Vérifier que routeSub existe après ngOnInit
    expect(comp.routeSub).toBeTruthy();
    const unsubSpy = spyOn(comp.routeSub, 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubSpy).toHaveBeenCalled();
  });
});
