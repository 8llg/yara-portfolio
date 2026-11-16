import type { T } from '../content/types';
import { t } from '../lib/locale';
import type { AppApi } from './api';

interface Step {
  selector: string;
  title: T;
  body: T;
}

const steps: Step[] = [
  {
    selector: '.hero__arch, .hero__stage',
    title: { en: 'An illustrated Yara', ar: 'يارا في صورة فنية' },
    body: {
      en: 'A real-time 3D portrait. Move your pointer and she follows it; switch language and she turns toward where your reading begins.',
      ar: 'بورتريه ثلاثي الأبعاد يعمل لحظيًا. حرّك المؤشر فتتبعه، وغيّر اللغة فتلتفت نحو الجهة التي تبدأ منها قراءتك.',
    },
  },
  {
    selector: '[data-switch]',
    title: { en: 'Two directions', ar: 'اتجاهان' },
    body: {
      en: 'This switch does more than translate: the whole layout mirrors, and the new language enters from its reading side. Shortcut: L.',
      ar: 'هذا الزر لا يترجم فقط: التخطيط كله ينعكس، واللغة الجديدة تدخل من جهة قراءتها. الاختصار: L.',
    },
  },
  {
    selector: '#work .projects',
    title: { en: 'Eight case studies', ar: 'ثماني دراسات حالة' },
    body: {
      en: 'Hover a project for its illustration, open it for the problem, her role, what she built and the measured result.',
      ar: 'مرّر المؤشر على مشروع لترى رسمه، وافتحه لتقرأ المشكلة ودورها وما بنته والنتيجة المقيسة.',
    },
  },
  {
    selector: '#impact .impact__layout',
    title: { en: 'Impact with sources', ar: 'أثر بمصادره' },
    body: {
      en: 'Thirty-five results from the CV. Filter by discipline and open any one to read the exact line it comes from.',
      ar: 'خمس وثلاثون نتيجة من السيرة. صفِّها حسب المجال وافتح أيًّا منها لتقرأ السطر الذي جاءت منه.',
    },
  },
  {
    selector: '#career .score-frame',
    title: { en: 'Sixteen years, to scale', ar: 'ستة عشر عامًا بمقياس حقيقي' },
    body: {
      en: 'Four parallel tracks drawn to scale. Time runs in your reading direction; select any bar for the role.',
      ar: 'أربعة مسارات متوازية بمقياس حقيقي. يجري الزمن باتجاه قراءتك، واختر أي شريط لتفاصيل الدور.',
    },
  },
  {
    selector: '#research .lab',
    title: { en: 'Her research, working', ar: 'بحثها وهو يعمل' },
    body: {
      en: 'Resize the frame and watch the Arabic paragraph re-set itself. Compare adaptive, fixed and manual settings.',
      ar: 'غيّر عرض الإطار وراقب الفقرة العربية تعيد ضبط نفسها. قارن بين الوضع التكيّفي والثابت واليدوي.',
    },
  },
  {
    selector: '#record .record__tools',
    title: { en: 'The full CV, searchable', ar: 'السيرة كاملة وقابلة للبحث' },
    body: {
      en: 'Every entry of the CV in both languages, plus the original PDF. Press Ctrl+K anywhere to search.',
      ar: 'كل ما في السيرة باللغتين، ومعها ملف PDF الأصلي. اضغط Ctrl+K في أي مكان للبحث.',
    },
  },
];

let active: { close(): void } | null = null;

export function startTour(api: AppApi): void {
  active?.close();
  const layer = document.createElement('div');
  layer.className = 'tour';
  layer.innerHTML = `
    <div class="tour__ring" aria-hidden="true"></div>
    <div class="tour__card" role="dialog" aria-modal="true" aria-labelledby="tour-title" tabindex="-1">
      <p class="tour__progress" aria-live="polite"></p>
      <h2 class="tour__title" id="tour-title"></h2>
      <p class="tour__body"></p>
      <div class="tour__actions">
        <button type="button" class="text-button" data-tour="skip"></button>
        <span class="tour__spacer"></span>
        <button type="button" class="tour__button tour__button--quiet" data-tour="back"></button>
        <button type="button" class="tour__button" data-tour="next"></button>
      </div>
    </div>`;
  document.body.append(layer);
  const ring = layer.querySelector<HTMLElement>('.tour__ring');
  const card = layer.querySelector<HTMLElement>('.tour__card');
  if (!ring || !card) return;
  const opener = document.activeElement as HTMLElement | null;
  let index = 0;
  let target: HTMLElement | null = null;

  const place = () => {
    if (!target) return;
    const box = target.getBoundingClientRect();
    const pad = 12;
    const top = Math.max(8, box.top - pad);
    const bottom = Math.min(window.innerHeight - 8, box.bottom + pad);
    ring.style.transform = `translate(${box.left - pad}px, ${top}px)`;
    ring.style.width = `${box.width + pad * 2}px`;
    ring.style.height = `${bottom - top}px`;
    const cardBox = card.getBoundingClientRect();
    const below = bottom + 16 + cardBox.height < window.innerHeight;
    const y = below ? bottom + 16 : Math.max(16, top - cardBox.height - 16);
    const x = Math.min(window.innerWidth - cardBox.width - 16, Math.max(16, box.left));
    card.style.transform = `translate(${x}px, ${y}px)`;
  };

  const show = async (next: number) => {
    index = next;
    const step = steps[index];
    if (!step) return;
    target = [...document.querySelectorAll<HTMLElement>(step.selector)].find((el) => el.getClientRects().length > 0) ?? null;
    card.querySelector('.tour__progress')!.textContent = t({ en: `${index + 1} of ${steps.length}`, ar: `${index + 1} من ${steps.length}` });
    card.querySelector('.tour__title')!.textContent = t(step.title);
    card.querySelector('.tour__body')!.textContent = t(step.body);
    card.querySelector('[data-tour="skip"]')!.textContent = t({ en: 'Skip tour', ar: 'تخطَّ الجولة' });
    const back = card.querySelector<HTMLButtonElement>('[data-tour="back"]')!;
    back.textContent = t({ en: 'Back', ar: 'السابق' });
    back.disabled = index === 0;
    card.querySelector('[data-tour="next"]')!.textContent = index === steps.length - 1 ? t({ en: 'Finish', ar: 'إنهاء' }) : t({ en: 'Next', ar: 'التالي' });
    layer.classList.add('is-moving');
    if (target) {
      const fixed = getComputedStyle(target).position === 'fixed' || Boolean(target.closest('.masthead'));
      if (!fixed) await api.scrollToElement(target, -Math.round(window.innerHeight * 0.18));
    }
    layer.classList.remove('is-moving');
    place();
    card.focus({ preventScroll: true });
  };

  const close = () => {
    window.removeEventListener('resize', place);
    window.removeEventListener('scroll', place);
    document.removeEventListener('keydown', onKey, true);
    layer.remove();
    active = null;
    opener?.focus?.({ preventScroll: true });
  };

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.stopPropagation();
      const forward = (event.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl');
      if (forward && index < steps.length - 1) void show(index + 1);
      if (!forward && index > 0) void show(index - 1);
    } else if (event.key === 'Tab') {
      const focusable = Array.from(card.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    } else {
      event.stopPropagation();
    }
  };

  layer.addEventListener('click', (event) => {
    const action = (event.target as HTMLElement).closest<HTMLElement>('[data-tour]')?.dataset.tour;
    if (action === 'skip') close();
    if (action === 'back' && index > 0) void show(index - 1);
    if (action === 'next') {
      if (index < steps.length - 1) void show(index + 1);
      else close();
    }
  });
  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
  document.addEventListener('keydown', onKey, true);
  active = { close };
  void show(0);
}
