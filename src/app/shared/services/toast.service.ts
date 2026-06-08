import { Injectable } from '@angular/core';

/** Message de toast affiché à l'utilisateur */
export interface ToastMessage {
  /** Identifiant unique pour le tracking (généré automatiquement) */
  id: string;
  /** Texte affiché */
  message: string;
  /** Type de toast (détermine la couleur de fond) */
  type: 'success' | 'error' | 'info' | 'warning';
}

/**
 * Service de notification toast.
 * Gère une file de messages affichés temporairement via le composant Toaster.
 * Chaque toast s'auto-détruit après 4 secondes.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  /** File de toasts actifs */
  private _toasts: ToastMessage[] = [];

  /** Callback notifiant le composant Toaster d'un changement */
  private _onChange: (() => void) | null = null;

  /** Retourne la liste courante des toasts (lecture seule) */
  get toasts(): readonly ToastMessage[] {
    return this._toasts;
  }

  /**
   * Enregistre le callback de mise à jour pour le composant Toaster.
   * Appelé une seule fois par le composant hôte.
   */
  registerOnChange(callback: () => void): void {
    this._onChange = callback;
  }

  /**
   * Affiche un toast.
   * @param message Texte affiché
   * @param type Type de toast (info par défaut)
   */
  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const toast: ToastMessage = { id, message, type };
    this._toasts = [...this._toasts, toast];
    this._onChange?.();

    // Auto-dismiss après 4 secondes
    setTimeout(() => this.dismiss(id), 4000);
  }

  /**
   * Retire un toast de la file.
   * @param id Identifiant du toast à retirer
   */
  dismiss(id: string): void {
    this._toasts = this._toasts.filter((t) => t.id !== id);
    this._onChange?.();
  }
}
