import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  /* ==========================================================================
   * Création et état initial
   * ========================================================================== */

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it("devrait avoir une file de toasts vide à l'initialisation", () => {
    expect(service.toasts.length).toBe(0);
  });

  /* ==========================================================================
   * show() — ajout de toast
   * ========================================================================== */

  it('devrait ajouter un toast à la file', () => {
    service.show('Opération réussie');
    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].message).toBe('Opération réussie');
  });

  it('devrait générer un identifiant unique pour chaque toast', () => {
    service.show('Premier');
    service.show('Deuxième');
    expect(service.toasts.length).toBe(2);
    expect(service.toasts[0].id).not.toBe(service.toasts[1].id);
  });

  it("devrait utiliser le type 'info' par défaut", () => {
    service.show('Message');
    expect(service.toasts[0].type).toBe('info');
  });

  it('devrait utiliser le type spécifié', () => {
    service.show('Succès', 'success');
    expect(service.toasts[0].type).toBe('success');

    service.show('Erreur', 'error');
    expect(service.toasts[1].type).toBe('error');

    service.show('Attention', 'warning');
    expect(service.toasts[2].type).toBe('warning');
  });

  /* ==========================================================================
   * show() — callback onChange
   * ========================================================================== */

  it('devrait appeler le callback onChange après show()', () => {
    let called = false;
    service.registerOnChange(() => {
      called = true;
    });
    service.show('Test');
    expect(called).toBeTrue();
  });

  it("ne devrait pas lever d'erreur si onChange n'est pas enregistré", () => {
    expect(() => service.show('Sans callback')).not.toThrow();
  });

  /* ==========================================================================
   * dismiss() — retrait de toast
   * ========================================================================== */

  it('devrait retirer un toast de la file par son ID', () => {
    service.show('Message');
    const id = service.toasts[0].id;
    service.dismiss(id);
    expect(service.toasts.length).toBe(0);
  });

  it("ne devrait rien faire si l'ID est inconnu", () => {
    service.show('Message');
    service.dismiss('id-inexistant');
    expect(service.toasts.length).toBe(1);
  });

  it('devrait appeler le callback onChange après dismiss()', () => {
    service.show('Message');
    let called = false;
    service.registerOnChange(() => {
      called = true;
    });
    service.dismiss(service.toasts[0].id);
    expect(called).toBeTrue();
  });

  /* ==========================================================================
   * registerOnChange()
   * ========================================================================== */

  it("devrait enregistrer le callback onChange", () => {
    let received = '';
    service.registerOnChange(() => {
      received = 'changed';
    });
    service.show('Test');
    expect(received).toBe('changed');
  });

  /* ==========================================================================
   * Auto-dismiss après 4 secondes
   * ========================================================================== */

  it('devrait auto-dismiss le toast après 4 secondes', fakeAsync(() => {
    service.show('Message temporaire');
    expect(service.toasts.length).toBe(1);

    // Avance de 3999ms — le toast est toujours présent
    tick(3999);
    expect(service.toasts.length).toBe(1);

    // Avance de 1ms supplémentaire — le toast est retiré
    tick(1);
    expect(service.toasts.length).toBe(0);
  }));

  it("devrait auto-dismiss plusieurs toasts indépendamment", fakeAsync(() => {
    service.show('Premier');
    tick(1000);
    service.show('Deuxième');
    expect(service.toasts.length).toBe(2);

    // Après 3s de plus (total 4s pour le premier), le premier est retiré
    tick(3000);
    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].message).toBe('Deuxième');

    // Après 1s de plus (total 4s pour le deuxième), le deuxième est retiré
    tick(1000);
    expect(service.toasts.length).toBe(0);
  }));
});
