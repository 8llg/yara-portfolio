import { metrics } from '../components/metric';
import { sectionHead } from '../components/section-head';
import { career, timelineStart, tracks } from '../content/career';
import type { CareerEntry, YearMonth } from '../content/types';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { formatDuration, formatSpan, monthsBetween, t, today } from '../lib/locale';
import { viewState } from '../lib/state';

const totalMonths = monthsBetween(timelineStart, today) + 1;
const firstYear = Number(timelineStart.slice(0, 4)) + 1;
const lastYear = Number(today.slice(0, 4));

function offset(months: number): string {
  return `${((months / totalMonths) * 100).toFixed(3)}%`;
}

function bar(entry: CareerEntry) {
  const start = monthsBetween(timelineStart, entry.start);
  const length = monthsBetween(entry.start, entry.end ?? today) + 1;
  const selected = entry.id === viewState.careerEntry;
  return html`
    <button
      class="bar${entry.pause ? ' bar--pause' : ''}${entry.end ? '' : ' bar--ongoing'}"
      type="button"
      data-entry="${entry.id}"
      aria-pressed="${selected ? 'true' : 'false'}"
      aria-controls="career-detail"
      style="--start:${offset(start)};--length:${offset(length)};--lane:${entry.lane}"
    >
      <span class="bar__label">${t(entry.org)}</span>
      <span class="visually-hidden">, ${t(entry.title)}, ${formatSpan(entry.start, entry.end)}</span>
    </button>
  `;
}

function detail(entry: CareerEntry) {
  return html`
    <div class="career-detail__inner" data-reveal>
      <p class="career-detail__when">
        <span>${formatSpan(entry.start, entry.end)}</span>
        <span class="career-detail__duration">${formatDuration(entry.start, entry.end)}</span>
      </p>
      <h3 class="career-detail__title">${t(entry.title)}</h3>
      <p class="career-detail__org">${t(entry.org)} <span aria-hidden="true">·</span> ${t(entry.place)}</p>
      <ul class="career-detail__list">
        ${entry.bullets.map((bullet) => html`<li>${t(bullet)}</li>`)}
      </ul>
      ${metrics(entry.metrics)}
      ${entry.tech
        ? html`<p class="tags" aria-label="${t(ui.builtWith)}">${entry.tech.map((tech) => html`<span class="tag" lang="en" dir="ltr">${tech}</span>`)}</p>`
        : ''}
    </div>
  `;
}

export function careerSection() {
  const current = career.find((entry) => entry.id === viewState.careerEntry) ?? career[0];
  const years: number[] = [];
  for (let year = firstYear; year <= lastYear; year += 1) years.push(year);
  return html`
    <section class="section career" id="career" aria-labelledby="career-title">
      ${sectionHead('career')}
      <p class="career__hint">${t(ui.careerHint)} <span class="career__scroll-hint">${t(ui.careerScroll)}</span></p>
      <div class="score-frame" tabindex="0" role="group" aria-label="${t({ en: 'Career timeline', ar: 'الخط الزمني للمسيرة' })}">
        <div class="score">
          <div class="score__years" aria-hidden="true">
            ${years.map(
              (year) => html`<span class="score__year" style="--start:${offset(monthsBetween(timelineStart, `${year}-01` as YearMonth))}">${year}</span>`,
            )}
            <span class="score__now" style="--start:${offset(totalMonths)}"><span>${t(ui.now)}</span></span>
          </div>
          ${tracks.map(
            (track) => html`
              <div class="track" style="--lanes:${track.lanes}">
                <p class="track__label">${t(track.label)}</p>
                <div class="track__lanes">
                  ${career.filter((entry) => entry.track === track.id).map(bar)}
                </div>
              </div>
            `,
          )}
        </div>
      </div>
      <div class="career-detail" id="career-detail" aria-live="polite">${current ? detail(current) : ''}</div>
    </section>
  `;
}

export function mountCareer(root: HTMLElement): void {
  const section = root.querySelector<HTMLElement>('#career');
  const host = root.querySelector<HTMLElement>('#career-detail');
  if (!section || !host) return;
  section.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-entry]');
    if (!button?.dataset.entry) return;
    const entry = career.find((item) => item.id === button.dataset.entry);
    if (!entry) return;
    viewState.careerEntry = entry.id;
    section.querySelectorAll<HTMLButtonElement>('[data-entry]').forEach((item) => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    host.innerHTML = detail(entry).value;
    host.querySelectorAll('[data-reveal]').forEach((el) => {
      requestAnimationFrame(() => el.classList.add('is-visible'));
    });
  });

  const frame = section.querySelector<HTMLElement>('.score-frame');
  const selected = section.querySelector<HTMLElement>('[aria-pressed="true"]');
  if (frame && selected && frame.scrollWidth > frame.clientWidth) {
    const frameBox = frame.getBoundingClientRect();
    const box = selected.getBoundingClientRect();
    frame.scrollLeft += box.left - frameBox.left - frameBox.width / 2 + box.width / 2;
  }
}
