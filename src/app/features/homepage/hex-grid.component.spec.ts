import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HexGridComponent } from './hex-grid.component';

describe('HexGridComponent', () => {
  let component: HexGridComponent;
  let fixture: ComponentFixture<HexGridComponent>;

  /* ── Helpers : mock de matchMedia ── */

  function stubMatchMedia(matches: boolean): jasmine.Spy {
    return spyOn(window, 'matchMedia').and.callFake(
      (query: string): MediaQueryList =>
        ({
          matches,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    );
  }

  function stubDesktop(): jasmine.Spy {
    return stubMatchMedia(false);
  }

  function stubMobile(): jasmine.Spy {
    return stubMatchMedia(true);
  }

  /** Mock minimal d'un contexte Canvas 2D pour les tests desktop */
  function mockCanvasContext(): CanvasRenderingContext2D {
    const ctx = {
      setTransform: jasmine.createSpy('setTransform'),
      clearRect: jasmine.createSpy('clearRect'),
      beginPath: jasmine.createSpy('beginPath'),
      moveTo: jasmine.createSpy('moveTo'),
      lineTo: jasmine.createSpy('lineTo'),
      stroke: jasmine.createSpy('stroke'),
      fill: jasmine.createSpy('fill'),
      closePath: jasmine.createSpy('closePath'),
    } as any;

    // Propriétés mutables utilisées par draw()
    ctx.strokeStyle = '';
    ctx.fillStyle = '';
    ctx.lineWidth = 1;

    return ctx as CanvasRenderingContext2D;
  }

  /* ── Configuration ── */

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HexGridComponent);
    component = fixture.componentInstance;

    // Conteneur parent pour le canvas — requis pour resize()
    const wrapper = document.createElement('div');
    fixture.nativeElement.appendChild(wrapper);

    // Polyfill ResizeObserver si absent de l'environnement de test
    if (typeof (window as any).ResizeObserver === 'undefined') {
      (window as any).ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    }
  });

  /* ==========================================================================
   * Création et état initial
   * ========================================================================== */

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  it('le canvas devrait exister avec aria-hidden="true"', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(mockCtx);
    fixture.detectChanges();

    const canvas: HTMLCanvasElement =
      fixture.nativeElement.querySelector('.hex-grid__canvas')!;
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute('aria-hidden')).toBe('true');
  });

  it('le canvas devrait avoir la classe CSS .hex-grid__canvas', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(mockCtx);
    fixture.detectChanges();

    const canvas: HTMLElement =
      fixture.nativeElement.querySelector('.hex-grid__canvas')!;
    expect(canvas.classList.contains('hex-grid__canvas')).toBeTrue();
  });

  it('isMobile devrait être un signal accessible', () => {
    expect(component.isMobile).toBeDefined();
    expect(typeof component.isMobile).toBe('function');
    // Signal initialisé à false par défaut
    expect(component.isMobile()).toBe(false);
  });

  /* ==========================================================================
   * Détection mobile vs desktop
   * ========================================================================== */

  it('devrait détecter le mobile et ne pas initialiser le canvas', () => {
    stubMobile(); // matchMedia → matches: true

    const getContextSpy = spyOn(
      HTMLCanvasElement.prototype,
      'getContext',
    );

    fixture.detectChanges();

    expect(component.isMobile()).toBeTrue();
    // getContext ne doit pas être appelé sur mobile
    expect(getContextSpy).not.toHaveBeenCalled();
  });

  it('devrait initialiser le canvas en mode desktop', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    const getContextSpy = spyOn(
      HTMLCanvasElement.prototype,
      'getContext',
    ).and.returnValue(mockCtx);

    fixture.detectChanges();

    expect(component.isMobile()).toBeFalse();
    expect(getContextSpy).toHaveBeenCalledWith('2d');
  });

  /* ==========================================================================
   * Nettoyage
   * ========================================================================== */

  it('ngOnDestroy devrait nettoyer sans erreur en mode desktop', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(
      mockCtx,
    );
    fixture.detectChanges();

    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('ngOnDestroy devrait nettoyer sans erreur en mode mobile', () => {
    stubMobile();
    fixture.detectChanges();

    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  it('plusieurs appels à ngOnDestroy ne devraient pas lever d\'exception', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(
      mockCtx,
    );
    fixture.detectChanges();

    component.ngOnDestroy();
    expect(() => component.ngOnDestroy()).not.toThrow();
    expect(() => component.ngOnDestroy()).not.toThrow();
  });

  /* ==========================================================================
   * Structure DOM
   * ========================================================================== */

  it('le canvas devrait avoir un élément parent dans le DOM', () => {
    stubDesktop();
    const mockCtx = mockCanvasContext();
    spyOn(HTMLCanvasElement.prototype, 'getContext').and.returnValue(
      mockCtx,
    );
    fixture.detectChanges();

    const canvas: HTMLCanvasElement =
      fixture.nativeElement.querySelector('.hex-grid__canvas')!;
    expect(canvas.parentElement).not.toBeNull();
  });

  /* ==========================================================================
   * Métadonnées du composant
   * ========================================================================== */

  it('devrait être un composant standalone', () => {
    const cmpMeta = (HexGridComponent as any).ɵcmp;

    expect(cmpMeta).toBeDefined();
    expect(cmpMeta.standalone).toBeTrue();
  });
});
