import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ToastService, ToastMessage } from '../../services/toast.service';

/**
 * Conteneur de toasts.
 * Affiche les notifications temporaires en bas à droite de l'écran.
 * Chaque toast s'auto-détruit après 4 secondes (géré par le service).
 *
 * États :
 * - Empty : aucun toast → rien n'est rendu
 * - Active : un ou plusieurs toasts empilés
 * - Dismiss : animation de sortie via fadeSlideIn (CSS)
 */
@Component({
  selector: 'app-toaster',
  standalone: true,
  template: `
    <div class="toaster__container" role="status" aria-live="polite">
      @for (toast of toasts(); track toast.id) {
        <div
          class="toaster__toast"
          [class]="'toaster__toast toaster__toast--' + toast.type"
        >
          <span class="toaster__icon" aria-hidden="true">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error') { ✕ }
              @case ('warning') { ⚠ }
              @case ('info') { ℹ }
            }
          </span>
          <span class="toaster__message">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .toaster__container {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000;
        display: flex;
        flex-direction: column-reverse;
        gap: 8px;
        max-width: 360px;
      }
      .toaster__toast {
        padding: 12px 20px;
        border-radius: 8px;
        font-family: var(--font-body);
        font-size: 0.875rem;
        color: var(--color-text-primary);
        animation: fadeSlideIn 300ms var(--ease-spring) both;
        box-shadow: var(--elevation-n3);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .toaster__icon {
        flex-shrink: 0;
        font-family: var(--font-display);
        font-weight: 700;
        font-size: 1rem;
      }
      .toaster__message {
        line-height: 1.4;
      }
      .toaster__toast--success {
        background: var(--color-success);
      }
      .toaster__toast--error {
        background: var(--color-error);
      }
      .toaster__toast--warning {
        background: var(--color-warning);
        color: var(--color-bg-primary);
      }
      .toaster__toast--info {
        background: var(--color-info);
      }
    `,
  ],
})
export class ToasterComponent implements OnInit, OnDestroy {
  /** Signal reflet de la file de toasts */
  readonly toasts = signal<readonly ToastMessage[]>([]);

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.registerOnChange(() => {
      this.toasts.set(this.toastService.toasts);
    });
    // Synchro initiale
    this.toasts.set(this.toastService.toasts);
  }

  ngOnDestroy(): void {
    // Le service survit au composant (providedIn: 'root'), pas de cleanup nécessaire
  }
}
