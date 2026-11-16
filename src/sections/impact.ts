import { metrics } from '../components/metric';
import { sectionHead } from '../components/section-head';
import { domains, impact, type Domain, type ImpactItem } from '../content/impact';
import { projects } from '../content/projects';
import { html } from '../lib/html';
import { t } from '../lib/locale';

const state: { filter: Domain | 'all'; selected: string } = { filter: 'all', selected: 'tele-wait' };

const countFor = (domain: Domain) => impact.filter((item) => item.domains.includes(domain)).length;

const shownLabel = (n: number) => t({ en: `${n} documented results shown`, ar: `${n} نتيجة موثّقة معروضة` });

function value(item: ImpactItem) {
  if (item.metric.kind === 'figure') return html`<span class="impact-card__value" dir="ltr">${t(item.metric.value)}</span>`;
  return html`<span class="impact-card__value impact-card__value--shift" dir="ltr">
    <span class="impact-card__from">${t(item.metric.fromText)}</span>
    <span class="impact-card__arrow" aria-hidden="true"></span>
    <span>${t(item.metric.toText)}</span>
  </span>`;
}

function label(item: ImpactItem) {
  return t(item.metric.label);
}

function detail(item: ImpactItem) {
  const project = item.project ? projects.find((p) => p.id === item.project) : undefined;
  return html`
    <div class="impact-detail__inner">
      <p class="impact-detail__source">${t(item.source)}</p>
      ${metrics([item.metric])}
      <blockquote class="impact-detail__quote">
        <p>${t(item.quote)}</p>
        <footer>${t({ en: 'From the CV', ar: 'من السيرة الذاتية' })}</footer>
      </blockquote>
      <p class="impact-detail__domains">
        ${item.domains.map((d) => html`<span class="tag">${t(domains.find((x) => x.id === d)?.label ?? { en: d, ar: d })}</span>`)}
      </p>
      ${project
        ? html`<button class="impact-detail__open" type="button" data-case-open="${project.id}">${t({ en: 'Open the case study', ar: 'افتح دراسة الحالة' })}: ${t(project.name)}</button>`
        : ''}
    </div>
  `;
}

export function impactSection() {
  const total = impact.reduce((sum, item) => sum + item.domains.length, 0);
  const selected = impact.find((item) => item.id === state.selected) ?? impact[0];
  const visible = state.filter === 'all' ? impact.length : countFor(state.filter);
  return html`
    <section class="section impact" id="impact" aria-labelledby="impact-title">
      ${sectionHead('impact')}
      <div class="impact__spectrum" aria-hidden="true">
        ${domains.map((d) => html`<span class="impact__band impact__band--${d.id}" style="flex:${countFor(d.id) / total}"><span>${t(d.label)}</span></span>`)}
      </div>
      <div class="impact__controls">
        <div class="chips" role="group" aria-label="${t({ en: 'Filter results by discipline', ar: 'تصفية النتائج حسب المجال' })}">
          <button class="chip" type="button" data-impact-filter="all" aria-pressed="${state.filter === 'all'}">${t({ en: 'All', ar: 'الكل' })}<span class="chip__count">${impact.length}</span></button>
          ${domains.map(
            (d) => html`<button class="chip chip--${d.id}" type="button" data-impact-filter="${d.id}" aria-pressed="${state.filter === d.id}">${t(d.label)}<span class="chip__count">${countFor(d.id)}</span></button>`,
          )}
        </div>
        <p class="impact__count" aria-live="polite" data-impact-count>${shownLabel(visible)}</p>
      </div>
      <div class="impact__layout">
        <ul class="impact__grid" data-impact-grid>
          ${impact.map(
            (item) => html`
              <li class="impact-card" data-domains="${item.domains.join(' ')}" ${state.filter === 'all' || item.domains.includes(state.filter as Domain) ? '' : html`hidden`}>
                <button type="button" class="impact-card__button" data-impact="${item.id}" aria-pressed="${item.id === selected?.id}" aria-controls="impact-detail">
                  ${value(item)}
                  <span class="impact-card__label">${label(item)}</span>
                  <span class="impact-card__dots" aria-hidden="true">${item.domains.map((d) => html`<span class="dot dot--${d}"></span>`)}</span>
                </button>
              </li>
            `,
          )}
        </ul>
        <aside class="impact-detail" id="impact-detail" aria-live="polite" data-impact-detail>${selected ? detail(selected) : ''}</aside>
      </div>
    </section>
  `;
}

export function mountImpact(root: HTMLElement): void {
  const section = root.querySelector<HTMLElement>('#impact');
  const panel = root.querySelector<HTMLElement>('[data-impact-detail]');
  const count = root.querySelector<HTMLElement>('[data-impact-count]');
  if (!section || !panel || !count) return;
  section.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const filterButton = target.closest<HTMLButtonElement>('[data-impact-filter]');
    if (filterButton) {
      const filter = filterButton.dataset.impactFilter as Domain | 'all';
      state.filter = filter;
      section.querySelectorAll<HTMLButtonElement>('[data-impact-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === filterButton)));
      let shown = 0;
      section.querySelectorAll<HTMLElement>('.impact-card').forEach((card) => {
        const match = filter === 'all' || (card.dataset.domains ?? '').split(' ').includes(filter);
        card.hidden = !match;
        if (match) shown += 1;
      });
      count.textContent = shownLabel(shown);
      return;
    }
    const card = target.closest<HTMLButtonElement>('[data-impact]');
    if (card?.dataset.impact) {
      const item = impact.find((entry) => entry.id === card.dataset.impact);
      if (!item) return;
      state.selected = item.id;
      section.querySelectorAll<HTMLButtonElement>('[data-impact]').forEach((b) => b.setAttribute('aria-pressed', String(b === card)));
      panel.innerHTML = detail(item).value;
      panel.querySelectorAll('[data-reveal]').forEach((el) => requestAnimationFrame(() => el.classList.add('is-visible')));
      panel.classList.remove('is-swapping');
      void panel.offsetWidth;
      panel.classList.add('is-swapping');
    }
  });
  panel.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
}
