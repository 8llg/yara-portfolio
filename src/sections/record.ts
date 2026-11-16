import { CV_URL } from '../lib/assets';
import { sectionHead } from '../components/section-head';
import { record, recordCategories, type RecordCategory } from '../content/record';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

const state: { category: RecordCategory | 'all'; query: string } = { category: 'all', query: '' };

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

const haystack = new Map(
  record.map((entry) => [
    entry.id,
    normalize([entry.title.en, entry.title.ar, entry.meta.en, entry.meta.ar, ...entry.body.flatMap((b) => [b.en, b.ar])].join(' ')),
  ]),
);

export function searchRecord(query: string, category: RecordCategory | 'all' = 'all') {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  return record.filter(
    (entry) =>
      (category === 'all' || entry.category === category) && terms.every((term) => (haystack.get(entry.id) ?? '').includes(term)),
  );
}

const resultLabel = (n: number) => t({ en: `${n} of ${record.length} entries`, ar: `${n} من ${record.length} مُدخلًا` });

export function recordSection() {
  const counts = new Map<RecordCategory, number>();
  record.forEach((entry) => counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1));
  const visible = searchRecord(state.query, state.category);
  return html`
    <section class="section record" id="record" aria-labelledby="record-title">
      ${sectionHead('record')}
      <div class="record__tools">
        <label class="search">
          <span class="visually-hidden">${t({ en: 'Search the CV', ar: 'ابحث في السيرة' })}</span>
          <span class="search__icon" aria-hidden="true"></span>
          <input class="search__input" type="search" data-record-search value="${state.query}" placeholder="${t({ en: 'Search: Mizan, WCAG, London, 2022…', ar: 'ابحث: ميزان، WCAG، لندن، 2022…' })}" autocomplete="off" />
        </label>
        <a class="download-link" href="${CV_URL}" download data-download-cv>
          <span class="download-link__icon" aria-hidden="true"></span>${t({ en: 'Download the original CV (PDF, 202 KB)', ar: 'حمّل السيرة الأصلية (PDF، 202 ك.ب)' })}
        </a>
      </div>
      <div class="chips record__chips" role="group" aria-label="${t({ en: 'Filter by section of the CV', ar: 'تصفية حسب أقسام السيرة' })}">
        <button class="chip" type="button" data-record-filter="all" aria-pressed="${state.category === 'all'}">${t({ en: 'Everything', ar: 'الكل' })}<span class="chip__count">${record.length}</span></button>
        ${recordCategories.map(
          (c) => html`<button class="chip" type="button" data-record-filter="${c.id}" aria-pressed="${state.category === c.id}">${t(c.label)}<span class="chip__count">${counts.get(c.id) ?? 0}</span></button>`,
        )}
      </div>
      <p class="record__count" aria-live="polite" data-record-count>${resultLabel(visible.length)}</p>
      <ol class="record__list" data-record-list data-lenis-prevent>
        ${record.map((entry) => {
          const category = recordCategories.find((c) => c.id === entry.category);
          const shown = visible.includes(entry);
          return html`
            <li class="record-entry" data-record-id="${entry.id}" ${shown ? '' : html`hidden`}>
              <span class="record-entry__category">${category ? t(category.label) : ''}</span>
              <div class="record-entry__main">
                <h3 class="record-entry__title">${t(entry.title)}</h3>
                ${t(entry.meta) ? html`<p class="record-entry__meta">${t(entry.meta)}</p>` : ''}
                ${entry.body.length ? html`<ul class="record-entry__body">${entry.body.map((b) => html`<li>${t(b)}</li>`)}</ul>` : ''}
              </div>
            </li>
          `;
        })}
      </ol>
      <p class="record__empty" data-record-empty ${visible.length ? html`hidden` : ''}>${t({ en: 'Nothing in the CV matches that search. Try a shorter word.', ar: 'لا يوجد في السيرة ما يطابق البحث. جرّب كلمة أقصر.' })}</p>
      <p class="record__note">${getLocale() === 'ar' ? 'أسماء الشهادات والمنشورات تبقى بلغتها الأصلية كما وردت في السيرة.' : 'Certification and publication titles stay in their original language, as in the CV.'}</p>
    </section>
  `;
}

export function mountRecord(root: HTMLElement): void {
  const section = root.querySelector<HTMLElement>('#record');
  const input = root.querySelector<HTMLInputElement>('[data-record-search]');
  const count = root.querySelector<HTMLElement>('[data-record-count]');
  const empty = root.querySelector<HTMLElement>('[data-record-empty]');
  if (!section || !input || !count || !empty) return;
  const rows = new Map<string, HTMLElement>();
  section.querySelectorAll<HTMLElement>('[data-record-id]').forEach((row) => rows.set(row.dataset.recordId ?? '', row));

  const apply = () => {
    const visible = new Set(searchRecord(state.query, state.category).map((entry) => entry.id));
    rows.forEach((row, id) => {
      row.hidden = !visible.has(id);
    });
    count.textContent = resultLabel(visible.size);
    empty.hidden = visible.size > 0;
  };

  let timer = 0;
  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      state.query = input.value;
      apply();
    }, 90);
  });

  section.addEventListener('click', (event) => {
    const chip = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-record-filter]');
    if (!chip) return;
    state.category = chip.dataset.recordFilter as RecordCategory | 'all';
    section.querySelectorAll<HTMLButtonElement>('[data-record-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === chip)));
    apply();
  });
}

export function focusRecord(query: string): void {
  state.query = query;
  state.category = 'all';
  const input = document.querySelector<HTMLInputElement>('[data-record-search]');
  if (!input) return;
  input.value = query;
  input.dispatchEvent(new Event('input'));
}
