import { TestBed } from '@angular/core/testing';
import { AnimationService } from './animation.service';

describe('AnimationService', () => {
  let service: AnimationService;
  let matchMediaSpy: jasmine.Spy;
  let mockMq: { matches: boolean; listeners: Array<(e: MediaQueryListEvent) => void> };

  beforeEach(() => {
    mockMq = {
      matches: false,
      listeners: [],
    };

    matchMediaSpy = spyOn(window, 'matchMedia').and.callFake((_query: string) => {
      return {
        get matches() {
          return mockMq.matches;
        },
        addEventListener: (type: string, listener: (e: MediaQueryListEvent) => void) => {
          if (type === 'change') mockMq.listeners.push(listener);
        },
        removeEventListener: jasmine.createSpy('removeEventListener'),
      } as unknown as MediaQueryList;
    });

    TestBed.configureTestingModule({
      providers: [AnimationService],
    });
    service = TestBed.inject(AnimationService);
  });

  afterEach(() => {
    spyOn(service, 'killAll').and.callThrough();
    service.killAll();
  });

  /* ==========================================================================
   * Création et état initial
   * ========================================================================== */

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait exposer isReducedMotion comme signal accessible', () => {
    expect(service.isReducedMotion).toBeDefined();
    expect(typeof service.isReducedMotion()).toBe('boolean');
  });

  it('devrait avoir isReducedMotion à false par défaut (pas de préférence)', () => {
    expect(service.isReducedMotion()).toBeFalse();
  });

  it('devrait avoir isReducedMotion à true quand matchMedia indique prefers-reduced-motion', () => {
    // Le service est déjà créé avec matches: false — on simule le déclenchement
    // de l'event listener comme si le système indiquait prefers-reduced-motion.
    mockMq.matches = true;
    mockMq.listeners.forEach((l) =>
      l({ matches: true } as MediaQueryListEvent),
    );
    expect(service.isReducedMotion()).toBeTrue();
  });

  it('devrait mettre à jour isReducedMotion quand la préférence matchMedia change', () => {
    expect(service.isReducedMotion()).toBeFalse();

    // Simuler un changement de préférence vers « reduce »
    mockMq.matches = true;
    mockMq.listeners.forEach((listener) =>
      listener({ matches: true } as MediaQueryListEvent),
    );
    expect(service.isReducedMotion()).toBeTrue();

    // Simuler un retour à la normale
    mockMq.matches = false;
    mockMq.listeners.forEach((listener) =>
      listener({ matches: false } as MediaQueryListEvent),
    );
    expect(service.isReducedMotion()).toBeFalse();
  });

  /* ==========================================================================
   * revealOnScroll — mode reduced motion
   * ========================================================================== */

  it('devrait rendre les éléments visibles immédiatement en reduced motion (revealOnScroll)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    const el = document.createElement('div');
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';

    await service.revealOnScroll([el]);

    expect(el.style.opacity).toBe('1');
    // Le navigateur normalise translateY(0) en translateY(0px)
    expect(el.style.transform).toBe('translateY(0px)');
  });

  it('ne devrait pas lever d\'erreur avec un tableau vide (revealOnScroll)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    await expectAsync(service.revealOnScroll([])).toBeResolved();
  });

  /* ==========================================================================
   * staggerEntrance — mode reduced motion
   * ========================================================================== */

  it('ne devrait rien faire en reduced motion (staggerEntrance)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    const container = document.createElement('div');
    container.innerHTML = '<p class="item">A</p><p class="item">B</p>';

    // Les éléments commencent cachés
    const items = container.querySelectorAll('.item');
    expect(items.length).toBe(2);

    // Ne devrait pas lancer GSAP, donc pas d'erreur
    await service.staggerEntrance(container, '.item');
    // La méthode est un no-op en reduced motion — on vérifie juste qu'elle
    // n'a pas planté (pas d'exception = succès)
    expect().nothing();
  });

  /* ==========================================================================
   * animateCounter — mode reduced motion
   * ========================================================================== */

  it('devrait afficher la valeur finale immédiatement en reduced motion (animateCounter)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    const target = document.createElement('span');
    target.textContent = '0';

    await service.animateCounter(target, 0, 42, 2000);

    expect(target.textContent).toBe('42');
  });

  /* ==========================================================================
   * pageExit / pageEnter — mode reduced motion
   * ========================================================================== */

  it('ne devrait rien faire en reduced motion (pageExit)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    const wrapper = document.createElement('section');
    await service.pageExit(wrapper);
    // No-op en reduced motion — pas d'exception = succès
    expect().nothing();
  });

  it('ne devrait rien faire en reduced motion (pageEnter)', async () => {
    mockMq.matches = true;
    mockMq.listeners.forEach((l) => l({ matches: true } as MediaQueryListEvent));

    const wrapper = document.createElement('section');
    await service.pageEnter(wrapper);
    // No-op en reduced motion — pas d'exception = succès
    expect().nothing();
  });

  /* ==========================================================================
   * killAll — nettoyage
   * ========================================================================== */

  it('ne devrait pas lever d\'erreur quand aucune animation n\'est enregistrée (killAll)', () => {
    service.killAll();
    // Pas d'exception = succès
    expect().nothing();
  });

  it('ne devrait pas lever d\'erreur quand killAll est appelé plusieurs fois', () => {
    service.killAll();
    service.killAll();
    service.killAll();
    expect().nothing();
  });

  /* ==========================================================================
   * initGsap — chargement paresseux
   * ========================================================================== */

  it('devrait retourner la même promesse pour les appels concurrents (initGsap)', async () => {
    // isReducedMotion = false pour autoriser le chargement GSAP
    expect(service.isReducedMotion()).toBeFalse();

    const [result1, result2] = await Promise.all([
      service.initGsap(),
      service.initGsap(),
    ]);

    // Les deux appels concurrents doivent retourner la même instance gsap
    expect(result1.gsap).toBeDefined();
    expect(result1.ScrollTrigger).toBeDefined();
    expect(result1.gsap).toBe(result2.gsap);
    expect(result1.ScrollTrigger).toBe(result2.ScrollTrigger);
  });

  it('ne devrait pas ré-importer GSAP après un premier succès (initGsap)', async () => {
    expect(service.isReducedMotion()).toBeFalse();

    const first = await service.initGsap();
    const second = await service.initGsap();

    // Même référence = pas de ré-import
    expect(first.gsap).toBe(second.gsap);
    expect(first.ScrollTrigger).toBe(second.ScrollTrigger);
  });
});
