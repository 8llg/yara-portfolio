import type { Locale } from '../content/types';

export interface AppApi {
  goTo(id: string): void;
  scrollToElement(element: HTMLElement, offset?: number): Promise<void>;
  setLanguage(locale: Locale): Promise<void>;
  getLocale(): Locale;
  openCase(id: string): void;
  closeCase(): void;
  announce(message: string): void;
  reducedMotion: boolean;
  startTour(): void;
  startPresentation(): void;
  openPalette(): void;
}
