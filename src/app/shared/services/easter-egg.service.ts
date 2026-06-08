import { Injectable, signal } from '@angular/core';
import { ToastService } from './toast.service';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const BUFFER_SIZE = 10;

const RESET_DELAY_MS = 3000;

const TOAST_MESSAGE = '🐝 Code activé ! Bienvenue dans la ruche.';

@Injectable({ providedIn: 'root' })
export class EasterEggService {
  readonly konamiTriggered = signal(false);

  private buffer: string[] = [];

  constructor(private readonly toastService: ToastService) {}

  handleKey(key: string): void {
    const normalizedKey = key.toLowerCase();

    this.buffer.push(normalizedKey);
    if (this.buffer.length > BUFFER_SIZE) {
      this.buffer.shift();
    }

    if (this.matchesKonami()) {
      if (this.konamiTriggered()) {
        return;
      }

      this.konamiTriggered.set(true);
      this.toastService.show(TOAST_MESSAGE, 'success');

      setTimeout(() => {
        this.konamiTriggered.set(false);
      }, RESET_DELAY_MS);
    }
  }

  private matchesKonami(): boolean {
    if (this.buffer.length < KONAMI_SEQUENCE.length) {
      return false;
    }

    const tail = this.buffer.slice(-KONAMI_SEQUENCE.length);
    return tail.every((key, i) => key === KONAMI_SEQUENCE[i].toLowerCase());
  }
}
