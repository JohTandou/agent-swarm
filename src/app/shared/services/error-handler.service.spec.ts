import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandler } from './error-handler.service';

describe('GlobalErrorHandler', () => {
  let handler: GlobalErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalErrorHandler, { provide: ErrorHandler, useClass: GlobalErrorHandler }],
    });
    handler = TestBed.inject(GlobalErrorHandler);
  });

  /* ==========================================================================
   * Création et état initial
   * ========================================================================== */

  it('devrait être créé', () => {
    expect(handler).toBeTruthy();
  });

  it('devrait implémenter ErrorHandler', () => {
    expect(handler.handleError).toBeDefined();
    expect(typeof handler.handleError).toBe('function');
  });

  /* ==========================================================================
   * handleError — log console
   * ========================================================================== */

  it('devrait appeler console.error avec le préfixe [Swarm Wiki]', () => {
    const consoleErrorSpy = spyOn(console, 'error');
    const testError = new Error('Test error message');

    handler.handleError(testError);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Swarm Wiki] Erreur non gérée —',
      testError,
    );
  });

  it('devrait appeler console.error avec une erreur non-Error (string)', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    handler.handleError('something went wrong');

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Swarm Wiki] Erreur non gérée —',
      'something went wrong',
    );
  });

  it('devrait appeler console.error avec null', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    handler.handleError(null);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Swarm Wiki] Erreur non gérée —',
      null,
    );
  });

  it('devrait appeler console.error avec undefined', () => {
    const consoleErrorSpy = spyOn(console, 'error');

    handler.handleError(undefined);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[Swarm Wiki] Erreur non gérée —',
      undefined,
    );
  });

  it('devrait être fourni comme ErrorHandler dans le contexte applicatif', () => {
    const errorHandler = TestBed.inject(ErrorHandler);
    expect(errorHandler).toBeInstanceOf(GlobalErrorHandler);
  });
});
