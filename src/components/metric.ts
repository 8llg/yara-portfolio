import type { Metric, ShiftMetric } from '../content/types';
import { ui } from '../content/ui';
import { html, type Markup } from '../lib/html';
import { t } from '../lib/locale';

function percent(value: number, max: number): string {
  return `${Math.max(0, Math.min(100, (value / max) * 100)).toFixed(2)}%`;
}

function shift(metric: ShiftMetric): Markup {
  const from = percent(metric.from, metric.max);
  const to = percent(metric.to, metric.max);
  const low = metric.from < metric.to ? from : to;
  const span = percent(Math.abs(metric.to - metric.from), metric.max);
  const direction = metric.to < metric.from ? 'falls' : 'rises';
  return html`
    <figure class="shift" data-direction="${direction}" data-reveal>
      <figcaption class="shift__label">${t(metric.label)}</figcaption>
      <div class="shift__values">
        <span class="shift__from"><span class="shift__tag">${t(ui.before)}</span> ${t(metric.fromText)}</span>
        <span class="shift__arrow" aria-hidden="true"></span>
        <span class="shift__to"><span class="shift__tag">${t(ui.after)}</span> ${t(metric.toText)}</span>
      </div>
      <div class="shift__scale" aria-hidden="true" style="--from:${from};--to:${to};--low:${low};--span:${span}">
        <span class="shift__track"></span>
        <span class="shift__bar"></span>
        <span class="shift__dot shift__dot--from"></span>
        <span class="shift__dot shift__dot--to"></span>
      </div>
    </figure>
  `;
}

function figure(metric: Extract<Metric, { kind: 'figure' }>): Markup {
  return html`
    <div class="figure" data-reveal>
      <span class="figure__value">${t(metric.value)}</span>
      <span class="figure__label">${t(metric.label)}</span>
    </div>
  `;
}

export function metrics(list: Metric[] | undefined): Markup {
  if (!list || list.length === 0) return html``;
  const shifts = list.filter((m): m is ShiftMetric => m.kind === 'shift');
  const figures = list.filter((m) => m.kind === 'figure');
  return html`
    <div class="metrics">
      ${shifts.length ? html`<div class="metrics__shifts">${shifts.map(shift)}</div>` : ''}
      ${figures.length ? html`<div class="metrics__figures">${figures.map((m) => (m.kind === 'figure' ? figure(m) : ''))}</div>` : ''}
    </div>
  `;
}
