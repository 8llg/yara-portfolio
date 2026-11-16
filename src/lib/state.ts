import type { CertStatus } from '../content/types';

export const viewState = {
  careerEntry: 'faseela',
  certFilter: 'all' as CertStatus | 'all',
  labMode: 'adaptive' as 'adaptive' | 'fixed' | 'manual',
  labManual: { size: 20, leading: 1.8, words: 0.08 },
  labWidth: 560,
};
