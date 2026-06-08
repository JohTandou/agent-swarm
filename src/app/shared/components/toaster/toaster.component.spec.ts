import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToasterComponent } from './toaster.component';
import { ToastService } from '../../services/toast.service';

describe('ToasterComponent', () => {
  let component: ToasterComponent;
  let fixture: ComponentFixture<ToasterComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToasterComponent],
      providers: [ToastService],
    }).compileComponents();

    fixture = TestBed.createComponent(ToasterComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  /* ==========================================================================
   * Création
   * ========================================================================== */

  it('devrait créer le composant', () => {
    expect(component).toBeTruthy();
  });

  /* ==========================================================================
   * État vide
   * ========================================================================== */

  it("ne devrait afficher aucun toast quand la file est vide", () => {
    const toasts = fixture.nativeElement.querySelectorAll('.toaster__toast');
    expect(toasts.length).toBe(0);
  });

  it("devrait avoir le conteneur avec role='status'", () => {
    const container: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__container');
    expect(container).toBeTruthy();
    expect(container.getAttribute('role')).toBe('status');
  });

  it("devrait avoir aria-live='polite' sur le conteneur", () => {
    const container: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__container');
    expect(container.getAttribute('aria-live')).toBe('polite');
  });

  /* ==========================================================================
   * Affichage des toasts
   * ========================================================================== */

  it('devrait afficher un toast quand le service en a un', () => {
    toastService.show('Opération réussie', 'success');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toaster__toast');
    expect(toasts.length).toBe(1);
    const message: HTMLElement = toasts[0].querySelector('.toaster__message');
    expect(message.textContent?.trim()).toBe('Opération réussie');
  });

  it('devrait afficher plusieurs toasts simultanément', () => {
    toastService.show('Premier');
    toastService.show('Deuxième');
    toastService.show('Troisième');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('.toaster__toast');
    expect(toasts.length).toBe(3);
  });

  /* ==========================================================================
   * Types de toast — classes CSS
   * ========================================================================== */

  it('devrait appliquer la classe CSS pour le type success', () => {
    toastService.show('Succès', 'success');
    fixture.detectChanges();
    const toast: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__toast');
    expect(toast.classList).toContain('toaster__toast--success');
  });

  it('devrait appliquer la classe CSS pour le type error', () => {
    toastService.show('Erreur', 'error');
    fixture.detectChanges();
    const toast: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__toast');
    expect(toast.classList).toContain('toaster__toast--error');
  });

  it('devrait appliquer la classe CSS pour le type warning', () => {
    toastService.show('Attention', 'warning');
    fixture.detectChanges();
    const toast: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__toast');
    expect(toast.classList).toContain('toaster__toast--warning');
  });

  it('devrait appliquer la classe CSS pour le type info', () => {
    toastService.show('Info', 'info');
    fixture.detectChanges();
    const toast: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__toast');
    expect(toast.classList).toContain('toaster__toast--info');
  });

  /* ==========================================================================
   * Icônes
   * ========================================================================== */

  it("devrait afficher l'icône ✓ pour le type success", () => {
    toastService.show('Succès', 'success');
    fixture.detectChanges();
    const icon: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__icon');
    expect(icon.textContent?.trim()).toContain('✓');
  });

  it("devrait afficher l'icône ✕ pour le type error", () => {
    toastService.show('Erreur', 'error');
    fixture.detectChanges();
    const icon: HTMLElement =
      fixture.nativeElement.querySelector('.toaster__icon');
    expect(icon.textContent?.trim()).toContain('✕');
  });

  /* ==========================================================================
   * Mise à jour du signal après dismiss
   * ========================================================================== */

  it('devrait retirer le toast du DOM après dismiss', () => {
    toastService.show('Message');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.toaster__toast').length
    ).toBe(1);

    toastService.dismiss(toastService.toasts[0].id);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelectorAll('.toaster__toast').length
    ).toBe(0);
  });
});
