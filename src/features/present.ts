import type { T } from '../content/types';
import { t } from '../lib/locale';
import type { AppApi } from './api';

interface Scene {
  title: T;
  cue: T;
  run(api: AppApi): Promise<void>;
}

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const pressRadio = (selector: string) => document.querySelector<HTMLButtonElement>(selector)?.click();

const scenes: Scene[] = [
  {
    title: { en: 'The portrait', ar: 'البورتريه' },
    cue: { en: 'Same CV for 22 teams. We asked what only Yara could have. Move the pointer: she follows.', ar: 'السيرة نفسها لـ22 فريقًا. سألنا: ما الذي يخص يارا وحدها؟ حرّك المؤشر: تتبعه.' },
    async run(api) {
      api.closeCase();
      if (api.getLocale() !== 'en') await api.setLanguage('en');
      api.goTo('top');
    },
  },
  {
    title: { en: 'Two directions', ar: 'اتجاهان' },
    cue: { en: 'One switch mirrors the whole page, and she turns toward where Arabic begins.', ar: 'زر واحد يعكس الصفحة كلها، وتلتفت نحو بداية القراءة بالعربية.' },
    async run(api) {
      api.goTo('top');
      await wait(200);
      await api.setLanguage(api.getLocale() === 'en' ? 'ar' : 'en');
    },
  },
  {
    title: { en: 'The work, as case studies', ar: 'الأعمال كدراسات حالة' },
    cue: { en: 'Telemedicine: average wait from 22 to 6 minutes. Problem, role, solution, measured result.', ar: 'الطب الاتصالي: الانتظار من 22 إلى 6 دقائق. المشكلة والدور والحل والنتيجة المقيسة.' },
    async run(api) {
      if (api.getLocale() !== 'en') await api.setLanguage('en');
      api.goTo('work');
      await wait(900);
      api.openCase('telemedicine');
    },
  },
  {
    title: { en: 'Every number has a source', ar: 'لكل رقم مصدر' },
    cue: { en: 'Thirty-five results, each tied to the exact line of the CV that states it.', ar: 'خمس وثلاثون نتيجة، كل منها مربوط بسطرها في السيرة.' },
    async run(api) {
      api.closeCase();
      api.goTo('impact');
      await wait(700);
      pressRadio('[data-impact-filter="access"]');
      document.querySelector<HTMLButtonElement>('[data-impact="faseela-wcag"]')?.click();
    },
  },
  {
    title: { en: 'Her research, working', ar: 'بحثها وهو يعمل' },
    cue: { en: 'Fixed setting first: small and dense. Then adaptive: the paragraph re-sets for its frame.', ar: 'الوضع الثابت أولًا: صغير ومزدحم. ثم التكيّفي: الفقرة تعيد ضبط نفسها.' },
    async run(api) {
      api.closeCase();
      api.goTo('research');
      await wait(900);
      pressRadio('[data-lab-mode="fixed"]');
      await wait(1600);
      pressRadio('[data-lab-mode="adaptive"]');
    },
  },
  {
    title: { en: 'Built on a real system', ar: 'مبني على نظام حقيقي' },
    cue: { en: 'Tokens and components checked live for contrast, target size and direction, like Mizan and Hirfa.', ar: 'رموز ومكوّنات مفحوصة لحظيًا للتباين وحجم الهدف والاتجاه، كما في ميزان وحرفة.' },
    async run(api) {
      api.goTo('system');
      await wait(900);
      pressRadio('[data-preview-dir="rtl"]');
    },
  },
  {
    title: { en: 'The complete record', ar: 'السجل الكامل' },
    cue: { en: 'Every CV entry, searchable in both languages, and the original PDF one click away.', ar: 'كل ما في السيرة قابل للبحث باللغتين، والملف الأصلي على بُعد نقرة.' },
    async run(api) {
      api.goTo('record');
    },
  },
  {
    title: { en: 'Thank you', ar: 'شكرًا' },
    cue: { en: 'One portfolio, two languages, two directions, designed around Yara alone.', ar: 'موقع واحد، لغتان، اتجاهان، صُمّم حول يارا وحدها.' },
    async run(api) {
      api.closeCase();
      api.goTo('top');
    },
  },
];

let running: { stop(): void } | null = null;

export function startPresentation(api: AppApi): void {
  running?.stop();
  const hud = document.createElement('div');
  hud.className = 'present';
  hud.setAttribute('role', 'region');
  hud.setAttribute('aria-label', t({ en: 'Presentation controls', ar: 'أدوات العرض' }));
  hud.innerHTML = `
    <div class="present__bar">
      <button type="button" class="present__btn" data-present="prev"></button>
      <div class="present__text">
        <p class="present__meta"><span class="present__step"></span><span class="present__clock" aria-hidden="true">0:00 / 3:00</span></p>
        <p class="present__title" aria-live="polite"></p>
        <p class="present__cue"></p>
      </div>
      <button type="button" class="present__btn present__btn--primary" data-present="next"></button>
      <button type="button" class="present__exit" data-present="exit"></button>
    </div>
    <span class="present__progress" aria-hidden="true"><span></span></span>`;
  document.body.append(hud);
  document.documentElement.classList.add('is-presenting');
  const started = performance.now();
  let index = -1;
  let busy = false;
  let busySince = 0;
  const clock = hud.querySelector<HTMLElement>('.present__clock');
  const progress = hud.querySelector<HTMLElement>('.present__progress span');

  const dock = () => {
    const caseDialog = document.querySelector<HTMLDialogElement>('[data-case]');
    const host = caseDialog?.open ? caseDialog : document.body;
    if (hud.parentElement !== host) host.append(hud);
  };

  const tick = window.setInterval(() => {
    dock();
    const seconds = Math.floor((performance.now() - started) / 1000);
    if (clock) clock.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')} / 3:00`;
    hud.classList.toggle('is-over', seconds > 180);
  }, 500);

  const labels = () => {
    hud.querySelector('[data-present="prev"]')!.textContent = t({ en: 'Back', ar: 'السابق' });
    hud.querySelector('[data-present="next"]')!.textContent = index === scenes.length - 1 ? t({ en: 'Finish', ar: 'إنهاء' }) : t({ en: 'Next', ar: 'التالي' });
    hud.querySelector('[data-present="exit"]')!.textContent = t({ en: 'Exit', ar: 'خروج' });
    hud.querySelector<HTMLButtonElement>('[data-present="exit"]')!.setAttribute('aria-label', t({ en: 'Exit presentation mode', ar: 'الخروج من وضع العرض' }));
  };

  const go = async (next: number) => {
    if (next < 0 || next >= scenes.length) return;
    if (busy && performance.now() - busySince < 2500) return;
    busy = true;
    busySince = performance.now();
    index = next;
    const scene = scenes[index];
    if (!scene) return;
    hud.querySelector('.present__step')!.textContent = `${index + 1} / ${scenes.length}`;
    hud.querySelector('.present__title')!.textContent = t(scene.title);
    hud.querySelector('.present__cue')!.textContent = t(scene.cue);
    hud.querySelector<HTMLButtonElement>('[data-present="prev"]')!.disabled = index === 0;
    if (progress) progress.style.transform = `scaleX(${(index + 1) / scenes.length})`;
    labels();
    try {
      await Promise.race([scene.run(api), wait(4500)]);
    } finally {
      busy = false;
      dock();
      hud.querySelector('.present__title')!.textContent = t(scene.title);
      hud.querySelector('.present__cue')!.textContent = t(scene.cue);
      labels();
    }
  };

  const stop = () => {
    window.clearInterval(tick);
    document.removeEventListener('keydown', onKey, true);
    hud.remove();
    document.documentElement.classList.remove('is-presenting');
    running = null;
  };

  const onKey = (event: KeyboardEvent) => {
    if (document.querySelector('dialog.palette[open]')) return;
    const next = ['ArrowRight', 'PageDown', ' ', 'Enter'].includes(event.key) && !(event.target as Element).closest?.('button');
    const prev = ['ArrowLeft', 'PageUp'].includes(event.key);
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (document.querySelector<HTMLDialogElement>('[data-case]')?.open) api.closeCase();
      else stop();
      return;
    }
    if (next || event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      event.stopPropagation();
      if (index === scenes.length - 1) stop();
      else void go(index + 1);
    } else if (prev) {
      event.preventDefault();
      event.stopPropagation();
      void go(index - 1);
    }
  };

  hud.addEventListener('click', (event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-present]')?.dataset.present;
    if (action === 'next') {
      if (index === scenes.length - 1) stop();
      else void go(index + 1);
    }
    if (action === 'prev') void go(index - 1);
    if (action === 'exit') stop();
  });
  document.addEventListener('keydown', onKey, true);
  running = { stop };
  void go(0);
}
