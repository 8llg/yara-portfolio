import { metrics } from '../components/metric';
import { sectionHead } from '../components/section-head';
import { patents, publications } from '../content/profile';
import { projects } from '../content/projects';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';
import { viewState } from '../lib/state';

const MIN_WIDTH = 260;
const MAX_WIDTH = 920;

export function research() {
  const khatt = projects.find((project) => project.id === 'khatt');
  const mode = viewState.labMode;
  const manual = viewState.labManual;
  return html`
    <section class="section research" id="research" aria-labelledby="research-title">
      ${sectionHead('research')}
      <div class="lab" data-lab data-mode="${viewState.labMode}">
        <div class="lab__intro">
          <h3 class="lab__title">${t(ui.labTitle)}</h3>
          <p>${t(ui.labIntro)}</p>
          <p class="lab__note">${t(ui.labNote)}</p>
          <p class="lab__disclaimer">${t(ui.labDisclaimer)}</p>
        </div>
        <div class="lab__controls">
          <div class="segmented" role="radiogroup" aria-label="${t({ en: 'Typesetting mode', ar: 'طريقة الصفّ' })}">
            <button type="button" role="radio" aria-checked="${mode === 'adaptive'}" data-lab-mode="adaptive">${t(ui.labAdaptive)}</button>
            <button type="button" role="radio" aria-checked="${mode === 'fixed'}" data-lab-mode="fixed">${t(ui.labFixed)}</button>
            <button type="button" role="radio" aria-checked="${mode === 'manual'}" data-lab-mode="manual">${t({ en: 'Manual', ar: 'يدوي' })}</button>
          </div>
          <div class="lab__manual" data-lab-manual ${mode === 'manual' ? '' : html`hidden`}>
            <label class="range">
              <span class="range__label">${t(ui.labSize)} <output dir="ltr" data-manual-out="size">${manual.size}px</output></span>
              <input type="range" min="12" max="34" step="0.5" value="${manual.size}" data-manual="size" />
            </label>
            <label class="range">
              <span class="range__label">${t(ui.labLeading)} <output dir="ltr" data-manual-out="leading">${manual.leading.toFixed(2)}</output></span>
              <input type="range" min="1.1" max="2.4" step="0.05" value="${manual.leading}" data-manual="leading" />
            </label>
            <label class="range">
              <span class="range__label">${t(ui.labWords)} <output dir="ltr" data-manual-out="words">${manual.words.toFixed(2)}em</output></span>
              <input type="range" min="0" max="0.4" step="0.01" value="${manual.words}" data-manual="words" />
            </label>
          </div>
          <label class="range">
            <span class="range__label">${t(ui.labWidth)} <output data-lab-width-out dir="ltr">${viewState.labWidth}px</output></span>
            <input type="range" min="${MIN_WIDTH}" max="${MAX_WIDTH}" step="1" value="${viewState.labWidth}" data-lab-width />
          </label>
        </div>
        <div class="lab__stage">
          <div class="lab__frame" data-lab-frame>
            <p class="lab__text" lang="ar" dir="rtl" data-lab-text>${ui.labSample.ar}</p>
          </div>
        </div>
        <dl class="lab__readout" aria-live="polite">
          <div><dt>${t(ui.labSize)}</dt><dd dir="ltr" data-out="size"></dd></div>
          <div><dt>${t(ui.labLeading)}</dt><dd dir="ltr" data-out="leading"></dd></div>
          <div><dt>${t(ui.labWords)}</dt><dd dir="ltr" data-out="words"></dd></div>
          <div><dt>${t(ui.labMeasure)}</dt><dd dir="ltr" data-out="measure"></dd></div>
        </dl>
        ${getLocale() === 'en' ? html`<p class="lab__gloss">${ui.labGloss.en}</p>` : ''}
      </div>
      <div class="research__grid">
        <article class="research__card thesis" data-reveal>
          <p class="research__kicker">${t(ui.thesis)}</p>
          <h3 class="thesis__title">${t(ui.thesisTitle)}</h3>
          <p class="thesis__meta">${t({ en: 'PhD in Human-Computer Interaction · Eastmoor Institute of Technology · 2018–2022', ar: 'دكتوراه في التفاعل بين الإنسان والحاسب · معهد إيستمور للتقنية · 2018–2022' })}</p>
          <p class="thesis__award">${t(ui.thesisAward)}</p>
          ${metrics(khatt?.metrics)}
        </article>
        <article class="research__card" data-reveal>
          <h3 class="research__kicker">${t(ui.patents)}</h3>
          <ul class="plain-list">
            ${patents.map(
              (patent) => html`
                <li class="patent">
                  <p class="patent__title">${t(patent.title)}</p>
                  <p class="patent__meta"><span dir="ltr" lang="en">${patent.number}</span> <span class="pill">${t(ui.fictionalNumber)}</span></p>
                  <p class="patent__status">${t(patent.status)}</p>
                </li>
              `,
            )}
          </ul>
        </article>
        <article class="research__card research__card--wide" data-reveal>
          <h3 class="research__kicker">${t(ui.publications)} <span class="count">${t(ui.publicationsNote)}</span></h3>
          <ol class="citations" lang="en" dir="ltr">
            ${publications.map(
              (pub) => html`
                <li class="citation">
                  <span class="citation__year">${pub.year}</span>
                  <span class="citation__body">${pub.authors} <em>${pub.title}.</em> ${pub.venue}.</span>
                </li>
              `,
            )}
          </ol>
        </article>
      </div>
    </section>
  `;
}

interface Setting {
  size: number;
  leading: number;
  words: number;
  measure: number;
}

function adaptive(width: number): Setting {
  const size = Math.min(27, Math.max(17, 12.5 + width * 0.0175));
  const measure = Math.min(width, size * 30);
  const ratio = measure / size;
  const leading = Math.min(2.05, Math.max(1.75, 1.6 + ratio * 0.015));
  const words = Math.min(0.12, Math.max(0.04, 0.02 + ratio * 0.003));
  return { size, leading, words, measure };
}

function fixedSetting(width: number): Setting {
  return { size: 13, leading: 1.3, words: 0, measure: width };
}

export function mountResearch(root: HTMLElement): void {
  const lab = root.querySelector<HTMLElement>('[data-lab]');
  if (!lab) return;
  const frame = lab.querySelector<HTMLElement>('[data-lab-frame]');
  const text = lab.querySelector<HTMLElement>('[data-lab-text]');
  const range = lab.querySelector<HTMLInputElement>('[data-lab-width]');
  const widthOut = lab.querySelector<HTMLOutputElement>('[data-lab-width-out]');
  const stage = lab.querySelector<HTMLElement>('.lab__stage');
  if (!frame || !text || !range || !widthOut || !stage) return;

  const out = (key: string, value: string) => {
    const node = lab.querySelector<HTMLElement>(`[data-out="${key}"]`);
    if (node) node.textContent = value;
  };

  const wordCount = text.textContent?.trim().split(/\s+/).length ?? 0;

  const manualPanel = lab.querySelector<HTMLElement>('[data-lab-manual]');
  lab.querySelectorAll<HTMLInputElement>('[data-manual]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.manual as 'size' | 'leading' | 'words';
      viewState.labManual[key] = Number(input.value);
      const output = lab.querySelector<HTMLElement>(`[data-manual-out="${key}"]`);
      if (output) output.textContent = key === 'size' ? `${input.value}px` : key === 'words' ? `${Number(input.value).toFixed(2)}em` : Number(input.value).toFixed(2);
      apply();
    });
  });

  const apply = () => {
    const available = Math.floor(stage.clientWidth);
    const max = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, available));
    range.max = String(max);
    const width = Math.min(viewState.labWidth, max);
    range.value = String(width);
    widthOut.textContent = `${width}px`;
    const setting =
      viewState.labMode === 'fixed'
        ? fixedSetting(width)
        : viewState.labMode === 'manual'
          ? { ...viewState.labManual, measure: width }
          : adaptive(width);
    frame.style.inlineSize = `${width}px`;
    text.style.fontSize = `${setting.size.toFixed(1)}px`;
    text.style.lineHeight = setting.leading.toFixed(2);
    text.style.wordSpacing = `${setting.words.toFixed(3)}em`;
    text.style.maxInlineSize = `${Math.round(setting.measure)}px`;
    const linePx = setting.size * setting.leading;
    const lines = Math.max(1, Math.round(text.clientHeight / linePx));
    out('size', `${setting.size.toFixed(1)}px`);
    out('leading', setting.leading.toFixed(2));
    out('words', `${setting.words.toFixed(2)}em`);
    out('measure', `≈ ${Math.round(wordCount / lines)}`);
  };

  range.addEventListener('input', () => {
    viewState.labWidth = Number(range.value);
    apply();
  });

  lab.querySelectorAll<HTMLButtonElement>('[data-lab-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      const mode = button.dataset.labMode === 'fixed' ? 'fixed' : button.dataset.labMode === 'manual' ? 'manual' : 'adaptive';
      viewState.labMode = mode;
      lab.dataset.mode = mode;
      if (manualPanel) manualPanel.hidden = mode !== 'manual';
      lab.querySelectorAll<HTMLButtonElement>('[data-lab-mode]').forEach((item) => {
        item.setAttribute('aria-checked', String(item === button));
      });
      apply();
    });
  });

  lab.querySelector('.segmented')?.addEventListener('keydown', (event) => {
    const key = (event as KeyboardEvent).key;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(key)) return;
    event.preventDefault();
    const order = ['adaptive', 'fixed', 'manual'] as const;
    const step = key === 'ArrowRight' || key === 'ArrowDown' ? 1 : -1;
    const forward = document.documentElement.dir === 'rtl' && (key === 'ArrowRight' || key === 'ArrowLeft') ? -step : step;
    const next = order[(order.indexOf(viewState.labMode) + forward + order.length) % order.length];
    const target = lab.querySelector<HTMLButtonElement>(`[data-lab-mode="${next}"]`);
    target?.click();
    target?.focus();
  });

  new ResizeObserver(() => apply()).observe(stage);
  document.fonts?.ready.then(apply).catch(() => undefined);
  apply();
}
