import type { CalloutType } from './callout-type.model';

describe('CalloutType (modèle)', () => {
  it('devrait accepter les types valides', () => {
    const valid: CalloutType[] = ['info', 'warning', 'tip', 'danger'];
    valid.forEach((type) => {
      const ct: CalloutType = type;
      expect(ct).toBe(type);
    });
  });
});
