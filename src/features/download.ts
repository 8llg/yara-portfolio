import { ui } from '../content/ui';
import { t } from '../lib/locale';
import type { AppApi } from './api';

const FILE = 'Yara_Al-Mansouri_CV.pdf';

export function installDownloads(api: AppApi): void {
  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('[data-download-cv]');
    if (!link) return;
    event.preventDefault();
    if (link.classList.contains('is-downloading')) return;
    link.classList.add('is-downloading');
    window.setTimeout(
      () => {
        const anchor = document.createElement('a');
        anchor.href = link.href;
        anchor.download = FILE;
        anchor.rel = 'noopener';
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        link.classList.remove('is-downloading');
        link.classList.add('is-done');
        api.announce(t(ui.downloadStarted));
        window.setTimeout(() => link.classList.remove('is-done'), 2200);
      },
      api.reducedMotion ? 0 : 620,
    );
  });
}
