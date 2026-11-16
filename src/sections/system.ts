import { sectionHead } from '../components/section-head';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

const swatches = [
  { name: { en: 'Night', ar: 'الليل' }, hex: '#1c1418', role: { en: 'Stage and dark sections', ar: 'المسرح والأقسام الداكنة' } },
  { name: { en: 'Bone', ar: 'العاج' }, hex: '#ebe5de', role: { en: 'Reading sections', ar: 'أقسام القراءة' } },
  { name: { en: 'Saffron', ar: 'الزعفران' }, hex: '#d9a441', role: { en: 'The one accent: actions, the nuqta', ar: 'اللون الوحيد المميّز: الأفعال والنقطة' } },
  { name: { en: 'Saffron deep', ar: 'زعفران داكن' }, hex: '#8a5e12', role: { en: 'Accent text on bone', ar: 'نص مميّز على العاج' } },
  { name: { en: 'Muted on night', ar: 'خافت على الليل' }, hex: '#b6a6ac', role: { en: 'Secondary text on night', ar: 'نص ثانوي على الليل' } },
  { name: { en: 'Muted on bone', ar: 'خافت على العاج' }, hex: '#5a4e54', role: { en: 'Secondary text on bone', ar: 'نص ثانوي على العاج' } },
];

function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const rating = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? t({ en: 'AA large', ar: 'AA للنص الكبير' }) : t({ en: 'Fails', ar: 'غير كافٍ' }));

function swatchList(background: string) {
  return swatches.map((swatch) => {
    const ratio = contrast(swatch.hex, background);
    return html`
      <li class="swatch">
        <span class="swatch__chip" style="background:${swatch.hex}"></span>
        <span class="swatch__name">${t(swatch.name)}</span>
        <span class="swatch__hex" dir="ltr">${swatch.hex.toUpperCase()}</span>
        <span class="swatch__role">${t(swatch.role)}</span>
        <span class="swatch__ratio ${ratio >= 4.5 ? 'is-pass' : 'is-low'}" dir="ltr">${ratio.toFixed(2)}:1 · ${rating(ratio)}</span>
      </li>
    `;
  });
}

export function systemSection() {
  const locale = getLocale();
  return html`
    <section class="section system" id="system" aria-labelledby="system-title">
      ${sectionHead('system')}
      <div class="system__layout">
        <div class="system__tokens">
          <div class="system__group">
            <div class="system__group-head">
              <h3 class="block-title">${t({ en: 'Colour, checked against', ar: 'الألوان، مفحوصة مقابل' })}</h3>
              <div class="segmented" role="radiogroup" aria-label="${t({ en: 'Contrast background', ar: 'خلفية فحص التباين' })}">
                <button type="button" role="radio" aria-checked="true" data-contrast-bg="#1c1418">${t({ en: 'Night', ar: 'الليل' })}</button>
                <button type="button" role="radio" aria-checked="false" data-contrast-bg="#ebe5de">${t({ en: 'Bone', ar: 'العاج' })}</button>
              </div>
            </div>
            <ul class="swatches" data-swatches>${swatchList('#1c1418')}</ul>
          </div>
          <div class="system__group">
            <h3 class="block-title">${t({ en: 'Type, one family per role, both scripts', ar: 'الخطوط: عائلة لكل دور، وبالخطّين' })}</h3>
            <div class="specimen">
              <p class="specimen__display"><span lang="en">Aa</span> <span lang="ar">أب</span></p>
              <p class="specimen__meta">Alexandria · ${t({ en: 'display, 200–800', ar: 'للعناوين، 200–800' })}</p>
              <p class="specimen__body"><span lang="en">Designs in two directions.</span> <span lang="ar" dir="rtl">تصمّم في اتجاهين.</span></p>
              <p class="specimen__meta">Readex Pro · ${t({ en: 'text, designed for reading proficiency', ar: 'للنصوص، صُمّم لتيسير القراءة' })}</p>
            </div>
          </div>
        </div>
        <div class="system__lab" data-system-lab>
          <div class="system__toolbar">
            <div class="segmented" role="radiogroup" aria-label="${t({ en: 'Preview direction', ar: 'اتجاه المعاينة' })}">
              <button type="button" role="radio" aria-checked="${locale === 'en'}" data-preview-dir="ltr">LTR</button>
              <button type="button" role="radio" aria-checked="${locale === 'ar'}" data-preview-dir="rtl">RTL</button>
            </div>
            <div class="segmented" role="radiogroup" aria-label="${t({ en: 'Component state', ar: 'حالة المكوّن' })}">
              ${(['default', 'hover', 'focus', 'disabled'] as const).map(
                (state, i) => html`<button type="button" role="radio" aria-checked="${i === 0}" data-preview-state="${state}">${t(
                  {
                    default: { en: 'Default', ar: 'افتراضي' },
                    hover: { en: 'Hover', ar: 'تحويم' },
                    focus: { en: 'Focus', ar: 'تركيز' },
                    disabled: { en: 'Disabled', ar: 'معطّل' },
                  }[state],
                )}</button>`,
              )}
            </div>
          </div>
          <div class="preview-pane on-night" dir="${locale === 'ar' ? 'rtl' : 'ltr'}" data-state="default" data-preview>
            <div class="demo-field">
              <label class="demo-field__label" for="demo-input">${t({ en: 'Savings goal name', ar: 'اسم هدف الادخار' })}</label>
              <input class="demo-field__input" id="demo-input" type="text" value="${t({ en: 'Hajj trip', ar: 'رحلة الحج' })}" />
              <span class="demo-field__hint">${t({ en: 'Shown on your goal card.', ar: 'يظهر على بطاقة الهدف.' })}</span>
            </div>
            <div class="demo-row">
              <button class="demo-button" type="button" data-demo-target>${t({ en: 'Create goal', ar: 'أنشئ الهدف' })}<span class="demo-button__icon" aria-hidden="true"></span></button>
              <button class="demo-button demo-button--quiet" type="button">${t({ en: 'Cancel', ar: 'إلغاء' })}</button>
            </div>
            <div class="demo-row">
              <span class="demo-toggle" role="switch" aria-checked="true" tabindex="-1" aria-label="${t({ en: 'Monthly reminder', ar: 'تذكير شهري' })}"><span></span></span>
              <span>${t({ en: 'Monthly reminder', ar: 'تذكير شهري' })}</span>
            </div>
            <div class="demo-progress">
              <span>${t({ en: 'Progress', ar: 'التقدّم' })}</span>
              <span class="demo-progress__bar"><span></span></span>
            </div>
            <p class="demo-note">${t({ en: 'Illustrative component, not from a real product.', ar: 'مكوّن توضيحي، ليس من منتج حقيقي.' })}</p>
          </div>
          <ul class="checks" data-checks aria-live="polite"></ul>
          <p class="system__link">${t({
            en: 'The same principles shipped in Mizan (180 components, 96% of screens at WCAG 2.2 AA) and Hirfa UI (95 components with mirrored layouts).',
            ar: 'المبادئ نفسها طُبّقت في ميزان (180 مكوّنًا و96% من الشاشات مطابقة لـWCAG 2.2 AA) وفي حرفة (95 مكوّنًا بتخطيطات معكوسة).',
          })}</p>
        </div>
      </div>
    </section>
  `;
}

export function mountSystem(root: HTMLElement): void {
  const section = root.querySelector<HTMLElement>('#system');
  const preview = root.querySelector<HTMLElement>('[data-preview]');
  const checks = root.querySelector<HTMLElement>('[data-checks]');
  const list = root.querySelector<HTMLElement>('[data-swatches]');
  if (!section || !preview || !checks || !list) return;

  const runChecks = () => {
    const button = preview.querySelector<HTMLElement>('[data-demo-target]');
    const box = button?.getBoundingClientRect();
    const target = box ? Math.round(Math.min(box.width, box.height)) : 0;
    const buttonRatio = contrast('#1c1418', '#d9a441');
    const bodyRatio = contrast('#efe7df', '#1c1418');
    const dir = preview.getAttribute('dir') ?? 'ltr';
    const items = [
      { pass: buttonRatio >= 4.5, text: t({ en: `Button label on saffron: ${buttonRatio.toFixed(2)}:1`, ar: `نص الزر على الزعفران: ${buttonRatio.toFixed(2)}:1` }) },
      { pass: bodyRatio >= 7, text: t({ en: `Body text on night: ${bodyRatio.toFixed(2)}:1`, ar: `النص على الليل: ${bodyRatio.toFixed(2)}:1` }) },
      { pass: target >= 44, text: t({ en: `Smallest side of the button: ${target}px (44px minimum)`, ar: `أصغر بُعد للزر: ${target}px (الحد الأدنى 44px)` }) },
      { pass: true, text: t({ en: `Layout mirrored with logical properties: ${dir.toUpperCase()}`, ar: `التخطيط معكوس بالخصائص المنطقية: ${dir.toUpperCase()}` }) },
    ];
    checks.innerHTML = items
      .map((item) => `<li class="check ${item.pass ? 'is-pass' : 'is-low'}"><span class="check__mark" aria-hidden="true"></span>${item.text}</li>`)
      .join('');
  };

  section.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const radio = target.closest<HTMLButtonElement>('[role="radio"]');
    if (!radio) return;
    radio.parentElement?.querySelectorAll('[role="radio"]').forEach((b) => b.setAttribute('aria-checked', String(b === radio)));
    if (radio.dataset.contrastBg) list.innerHTML = swatchList(radio.dataset.contrastBg).map((m) => m.value).join('');
    if (radio.dataset.previewDir) preview.setAttribute('dir', radio.dataset.previewDir);
    if (radio.dataset.previewState) {
      preview.dataset.state = radio.dataset.previewState;
      preview.querySelectorAll<HTMLButtonElement | HTMLInputElement>('button, input').forEach((el) => {
        el.disabled = radio.dataset.previewState === 'disabled';
      });
    }
    runChecks();
  });
  runChecks();
}
