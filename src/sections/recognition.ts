import { sectionHead } from '../components/section-head';
import { awards, certifications, certStatusLabels, media, talks } from '../content/profile';
import type { CertStatus } from '../content/types';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { t } from '../lib/locale';
import { viewState } from '../lib/state';

const filters: (CertStatus | 'all')[] = ['all', 'active', 'lifetime', 'expired', 'progress'];

function count(filter: CertStatus | 'all'): number {
  return filter === 'all' ? certifications.length : certifications.filter((cert) => cert.status === filter).length;
}

export function recognition() {
  return html`
    <section class="section recognition" id="recognition" aria-labelledby="recognition-title">
      ${sectionHead('recognition')}
      <div class="recognition__layout">
        <div class="awards">
          <h3 class="block-title">${t(ui.awards)} <span class="count">10</span></h3>
          <ol class="awards__list">
            ${awards.map(
              (award) => html`
                <li class="award" data-reveal>
                  <span class="award__year">${award.year}</span>
                  <span class="award__body">
                    <span class="award__title">${t(award.title)}</span>
                    <span class="award__by" lang="en" dir="ltr">${award.body}</span>
                    <span class="award__reason">${t(award.reason)}</span>
                  </span>
                </li>
              `,
            )}
          </ol>
        </div>
        <div class="voices">
          <h3 class="block-title">${t(ui.talks)} <span class="count">${t(ui.talksNote)}</span></h3>
          <ol class="talks">
            ${talks.map(
              (talk) => html`
                <li class="talk" data-reveal>
                  <span class="talk__meta"><span>${talk.year}</span><span>${t(talk.kind)}</span><span>${t(talk.city)}</span></span>
                  <span class="talk__title" lang="en" dir="ltr">“${talk.title}”</span>
                  <span class="talk__event" lang="en" dir="ltr">${talk.event}</span>
                </li>
              `,
            )}
          </ol>
          <h3 class="block-title">${t(ui.media)}</h3>
          <ul class="media">
            ${media.map(
              (item) => html`
                <li class="media__item" data-reveal>
                  <span class="talk__meta"><span>${t(item.when)}</span><span>${t(item.kind)}</span></span>
                  <span class="talk__title" lang="en" dir="ltr">${item.title}</span>
                  <span class="talk__event" lang="en" dir="ltr">${item.outlet}</span>
                  ${item.detail ? html`<span class="media__detail">${t(item.detail)}</span>` : ''}
                </li>
              `,
            )}
          </ul>
        </div>
      </div>
      <div class="certs" data-certs>
        <div class="certs__head">
          <h3 class="block-title">${t(ui.certifications)} <span class="count">20</span></h3>
          <div class="chips" role="group" aria-label="${t(ui.certFilter)}">
            ${filters.map(
              (filter) => html`
                <button class="chip" type="button" data-cert-filter="${filter}" aria-pressed="${viewState.certFilter === filter ? 'true' : 'false'}">
                  <span>${filter === 'all' ? t(ui.all) : t(certStatusLabels[filter])}</span>
                  <span class="chip__count">${count(filter)}</span>
                </button>
              `,
            )}
          </div>
        </div>
        <p class="certs__note">${t(ui.certsNote)}</p>
        <ol class="certs__list" aria-live="polite">
          ${certifications.map(
            (cert) => html`
              <li class="cert" data-status="${cert.status}" ${viewState.certFilter === 'all' || viewState.certFilter === cert.status ? '' : html`hidden`}>
                <span class="cert__year">${cert.year ?? '—'}</span>
                <span class="cert__name" lang="en" dir="ltr">${cert.name}</span>
                <span class="cert__issuer" lang="en" dir="ltr">${cert.issuer}</span>
                <span class="cert__status cert__status--${cert.status}">${t(cert.detail)}</span>
                ${cert.credential ? html`<span class="cert__id" dir="ltr"><span class="visually-hidden">${t(ui.credential)}: </span>${cert.credential}</span>` : html`<span class="cert__id"></span>`}
              </li>
            `,
          )}
        </ol>
      </div>
    </section>
  `;
}

export function mountRecognition(root: HTMLElement): void {
  const host = root.querySelector<HTMLElement>('[data-certs]');
  if (!host) return;
  host.addEventListener('click', (event) => {
    const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-cert-filter]');
    if (!chip) return;
    const filter = chip.dataset.certFilter as CertStatus | 'all';
    viewState.certFilter = filter;
    host.querySelectorAll<HTMLButtonElement>('[data-cert-filter]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === chip));
    });
    host.querySelectorAll<HTMLElement>('.cert').forEach((item) => {
      item.hidden = !(filter === 'all' || item.dataset.status === filter);
    });
  });
}
