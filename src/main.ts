import './styles/index.css';
import type Lenis from 'lenis';
import { navSections, sections, ui } from './content/ui';
import type { Locale } from './content/types';
import { html } from './lib/html';
import { getLocale, initialLocale, other, setLocale, t } from './lib/locale';
import { careerSection, mountCareer } from './sections/career';
import { communitySection } from './sections/community';
import { contactSection, siteFooter } from './sections/contact';
import { hero } from './sections/hero';
import { masthead } from './sections/masthead';
import { practice } from './sections/practice';
import { mountRecognition, recognition } from './sections/recognition';
import { mountResearch, research } from './sections/research';
import { statement } from './sections/statement';
import { impactSection, mountImpact } from './sections/impact';
import { mountSystem, systemSection } from './sections/system';
import { mountRecord, recordSection } from './sections/record';
import type { AppApi } from './features/api';
import { installCursor } from './features/cursor';
import { installDownloads } from './features/download';
import { mountWork, work } from './sections/work';
import type { BustController } from './three/character';

const app = document.querySelector<HTMLElement>('#app');
const announcer = document.querySelector<HTMLElement>('#announcer');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || window.matchMedia('(max-width: 760px)').matches;

const bustCanvas = document.createElement('canvas');
bustCanvas.className = 'bust';
bustCanvas.setAttribute('aria-hidden', 'true');
let bust: BustController | null = null;
let bustRequested = false;

let lenis: Lenis | null = null;
let motion: typeof import('./motion') | null = null;
let observers: IntersectionObserver[] = [];
let teardown: (() => void)[] = [];

function shortcuts() {
  return html`
    <dialog class="shortcuts" data-shortcuts aria-labelledby="shortcuts-title">
      <div class="shortcuts__inner">
        <h2 id="shortcuts-title" class="shortcuts__title">${t(ui.shortcutsTitle)}</h2>
        <dl class="shortcuts__list">
          <div><dt><kbd>1</kbd>–<kbd>${navSections.length}</kbd></dt><dd>${t(ui.shortcutSections)}</dd></div>
          <div><dt><kbd>L</kbd></dt><dd>${t(ui.shortcutLanguage)}</dd></div>
          <div><dt><kbd>0</kbd></dt><dd>${t(ui.shortcutTop)}</dd></div>
          <div><dt><kbd>?</kbd></dt><dd>${t(ui.shortcutHelp)}</dd></div>
        </dl>
        <form method="dialog"><button class="text-button" type="submit">${t(ui.close)}</button></form>
      </div>
    </dialog>
  `;
}

function render(eager = false): void {
  if (!app) return;
  const locale = getLocale();
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === 'ar' ? 'rtl' : 'ltr';
  root.dataset.locale = locale;
  document.title = t(ui.metaTitle);
  document.querySelector('meta[name="description"]')?.setAttribute('content', t(ui.metaDescription));

  pending.forEach((handle) => window.clearTimeout(handle));
  pending = [];
  app.innerHTML = html`
    ${masthead()}
    <main id="main" tabindex="-1">${hero()} ${statement()} ${work()}<div data-deferred></div></main>
    ${siteFooter()} ${shortcuts()}
  `.value;

  app.querySelector('[data-bust-slot]')?.append(bustCanvas);
  teardown.push(mountWork(app, reducedMotion));
  mountChrome(app);
  bust?.setDirection(root.dir === 'rtl' ? 'rtl' : 'ltr');
  deferredDone = false;
  deferredIndex = 0;
  if (eager) flushDeferred();
  else scheduleDeferred();
}

const deferredSections: { render: () => { value: string }; mount?: (root: HTMLElement) => void }[] = [
  { render: impactSection, mount: mountImpact },
  { render: careerSection, mount: mountCareer },
  { render: research, mount: mountResearch },
  { render: systemSection, mount: mountSystem },
  { render: practice },
  { render: recognition, mount: mountRecognition },
  { render: communitySection },
  { render: recordSection, mount: mountRecord },
  { render: contactSection },
];

let pending: number[] = [];
let deferredDone = false;
let deferredIndex = 0;

function insertNext(): boolean {
  const slot = app?.querySelector<HTMLElement>('[data-deferred]');
  const item = deferredSections[deferredIndex];
  if (!slot || !item || !app) return false;
  const template = document.createElement('template');
  template.innerHTML = item.render().value;
  const fragment = template.content;
  const node = fragment.firstElementChild as HTMLElement | null;
  slot.before(fragment);
  if (node) {
    item.mount?.(app);
    wireAnchors(node);
  }
  deferredIndex += 1;
  return deferredIndex < deferredSections.length;
}

function finishDeferred(): void {
  if (!app || deferredDone) return;
  deferredDone = true;
  app.querySelector('[data-deferred]')?.remove();
  observeReveals(app);
  observeSections(app);
  mountMotionLayer(app);
}

function flushDeferred(): void {
  pending.forEach((handle) => window.clearTimeout(handle));
  pending = [];
  while (insertNext());
  finishDeferred();
}

function scheduleDeferred(): void {
  const step = () => {
    if (insertNext()) pending.push(window.setTimeout(step, 16));
    else finishDeferred();
  };
  pending.push(window.setTimeout(step, 60));
}

function ensureRendered(): void {
  if (!deferredDone) flushDeferred();
}

function observeReveals(root: HTMLElement): void {
  const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reducedMotion) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
  );
  targets.forEach((el) => observer.observe(el));
  observers.push(observer);
}

function observeSections(root: HTMLElement): void {
  const links = new Map<string, HTMLElement>();
  root.querySelectorAll<HTMLElement>('[data-nav]').forEach((link) => links.set(link.dataset.nav ?? '', link));
  const header = root.querySelector<HTMLElement>('[data-masthead]');
  const visible = new Map<string, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      let best = '';
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          best = id;
          bestRatio = ratio;
        }
      });
      links.forEach((link, id) => {
        if (id === best) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      const dark = best === '' || best === 'top' || best === 'work' || best === 'contact';
      header?.classList.toggle('is-on-light', !dark);
    },
    { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-8% 0px -60% 0px' },
  );
  ['top', ...sections.map((section) => section.id)].forEach((id) => {
    const el = root.querySelector(`#${id}`);
    if (el) observer.observe(el);
  });
  observers.push(observer);
}

function mountMotionLayer(root: HTMLElement): void {
  if (!motion) return;
  motion.mountMotion(root, lenis, {
    reducedMotion,
    onHeroProgress: (progress) => bust?.setScroll(progress),
    onHeroLeave: () => bust?.setActive(false),
    onHeroEnter: () => bust?.setActive(true),
    addTeardown: (fn) => teardown.push(fn),
  });
}

function scrollToY(y: number): void {
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo({ top: y, behavior: 'instant' });
}

function anchorPoint(): { id: string; ratio: number } {
  const ids = ['top', ...sections.map((section) => section.id)];
  let chosen = { id: 'top', ratio: 0 };
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const box = el.getBoundingClientRect();
    if (box.top <= window.innerHeight * 0.3) {
      chosen = { id, ratio: box.height ? Math.min(1, Math.max(0, -box.top / box.height)) : 0 };
    }
  }
  return chosen;
}

function restore(anchor: { id: string; ratio: number }): void {
  const el = document.getElementById(anchor.id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + el.offsetHeight * anchor.ratio;
  scrollToY(anchor.id === 'top' && anchor.ratio === 0 ? 0 : top);
}

function cleanup(): void {
  observers.forEach((observer) => observer.disconnect());
  observers = [];
  teardown.forEach((fn) => fn());
  teardown = [];
  motion?.killTriggers();
}

function switchLanguage(): Promise<void> {
  const next: Locale = other(getLocale());
  const anchor = anchorPoint();
  const hadFocusOnSwitch = document.activeElement?.hasAttribute('data-switch') ?? false;
  let swapped = false;
  const swap = () => {
    if (swapped) return;
    swapped = true;
    cleanup();
    setLocale(next);
    document.documentElement.classList.add('has-turned');
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
    render(true);
    restore(anchor);
    if (hadFocusOnSwitch) document.querySelector<HTMLElement>('[data-switch]')?.focus({ preventScroll: true });
    if (announcer) {
      announcer.textContent = '';
      window.setTimeout(() => {
        announcer.textContent = ui.switched[next];
      }, 60);
    }
  };
  const root = document.documentElement;
  root.dataset.turn = next === 'ar' ? 'rtl' : 'ltr';
  if (!document.startViewTransition || reducedMotion) {
    swap();
    delete root.dataset.turn;
    return Promise.resolve();
  }
  const transition = document.startViewTransition(swap);
  const fallback = window.setTimeout(() => {
    if (swapped) return;
    transition.skipTransition();
    swap();
  }, 1000);
  return transition.finished
    .catch(() => undefined)
    .finally(() => {
      window.clearTimeout(fallback);
      swap();
      delete root.dataset.turn;
    });
}

let scrollHandler: () => void = () => undefined;

function mountChrome(root: HTMLElement): void {
  root.querySelector('[data-switch]')?.addEventListener('click', () => void switchLanguage());
  root.querySelectorAll('[data-start-tour]').forEach((el) => el.addEventListener('click', () => api.startTour()));
  root.querySelectorAll('[data-open-palette]').forEach((el) => el.addEventListener('click', () => api.openPalette()));
  root.querySelectorAll('[data-start-presentation]').forEach((el) => el.addEventListener('click', () => api.startPresentation()));

  const header = root.querySelector<HTMLElement>('[data-masthead]');
  const menu = root.querySelector<HTMLButtonElement>('[data-menu]');
  menu?.addEventListener('click', () => {
    const open = !header?.classList.contains('is-open');
    header?.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    if (open) lenis?.stop();
    else lenis?.start();
  });
  wireAnchors(root);

  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.removeEventListener('scroll', scrollHandler);
  scrollHandler = onScroll;
  window.addEventListener('scroll', scrollHandler, { passive: true });

  const dialog = root.querySelector<HTMLDialogElement>('[data-shortcuts]');
  root.querySelector('[data-shortcuts-open]')?.addEventListener('click', () => dialog?.showModal());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  const caseDialog = root.querySelector<HTMLDialogElement>('[data-case]');
  if (caseDialog) {
    const observer = new MutationObserver(() => {
      if (caseDialog.open) lenis?.stop();
      else lenis?.start();
    });
    observer.observe(caseDialog, { attributes: true, attributeFilter: ['open'] });
    teardown.push(() => observer.disconnect());
  }
}

function wireAnchors(scope: HTMLElement): void {
  scope.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) =>
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href')?.slice(1) ?? '';
      if (!id) return;
      event.preventDefault();
      document.querySelector('[data-masthead]')?.classList.remove('is-open');
      document.querySelector('[data-menu]')?.setAttribute('aria-expanded', 'false');
      lenis?.start();
      goTo(id);
    }),
  );
}

function goTo(id: string): void {
  ensureRendered();
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(id === 'top' ? 0 : el, { duration: 1.4 });
  else el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', `${location.pathname}${location.search}${id === 'top' ? '' : `#${id}`}`);
}

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K')) {
    event.preventDefault();
    api.openPalette();
    return;
  }
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target instanceof Element ? event.target : document.body;
  if (document.documentElement.classList.contains('is-presenting')) return;
  if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (document.querySelector<HTMLDialogElement>('[data-case]')?.open) return;
  const shortcutsDialog = document.querySelector<HTMLDialogElement>('[data-shortcuts]');
  if (event.key === '?' || (event.key === '/' && event.shiftKey)) {
    event.preventDefault();
    if (shortcutsDialog?.open) shortcutsDialog.close();
    else shortcutsDialog?.showModal();
    return;
  }
  if (shortcutsDialog?.open) return;
  if (event.key === 'l' || event.key === 'L' || event.key === 'ل') {
    void switchLanguage();
    return;
  }
  if (event.key === 'p' || event.key === 'P') {
    api.startPresentation();
    return;
  }
  if (event.key === 'Escape') {
    document.querySelector('[data-masthead]')?.classList.remove('is-open');
    document.querySelector('[data-menu]')?.setAttribute('aria-expanded', 'false');
    lenis?.start();
    return;
  }
  const arabicDigits = '٠١٢٣٤٥٦٧٨٩';
  const digit = arabicDigits.includes(event.key) ? arabicDigits.indexOf(event.key) : Number(event.key);
  if (Number.isInteger(digit) && event.key.trim() !== '') {
    if (target.closest('[role="tablist"], [role="radiogroup"]')) return;
    if (digit === 0) goTo('top');
    const section = navSections[digit - 1];
    if (section) goTo(section.id);
  }
});

function hasWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    return Boolean(probe.getContext('webgl2') ?? probe.getContext('webgl'));
  } catch {
    return false;
  }
}

function loadBust(): void {
  if (bustRequested) return;
  bustRequested = true;
  if (!hasWebGL()) {
    document.documentElement.classList.add('no-webgl');
    return;
  }
  import('./three/character')
    .then(({ mountBust }) => mountBust(bustCanvas, { reducedMotion, lowPower }))
    .then((controller) => {
      bust = controller;
      bust.setDirection(document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr');
      requestAnimationFrame(() => document.documentElement.classList.add('bust-ready'));
    })
    .catch(() => document.documentElement.classList.add('no-webgl'));
}

const api: AppApi = {
  goTo,
  scrollToElement(element, offset = -96) {
    ensureRendered();
    return new Promise((resolve) => {
      if (lenis) {
        lenis.scrollTo(element, { offset, duration: 1.1, onComplete: () => resolve() });
        window.setTimeout(resolve, 1400);
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: reducedMotion ? 'auto' : 'smooth' });
        window.setTimeout(resolve, reducedMotion ? 0 : 600);
      }
    });
  },
  async setLanguage(locale) {
    if (getLocale() === locale) return;
    await Promise.race([switchLanguage(), new Promise<void>((resolve) => window.setTimeout(resolve, 1600))]);
  },
  getLocale,
  openCase(id) {
    const trigger = document.querySelector<HTMLElement>(`#work [data-case-open="${id}"]`);
    trigger?.click();
  },
  closeCase() {
    const dialog = document.querySelector<HTMLDialogElement>('[data-case]');
    if (dialog?.open) dialog.close();
  },
  announce(message) {
    if (!announcer) return;
    announcer.textContent = '';
    window.setTimeout(() => {
      announcer.textContent = message;
    }, 40);
  },
  reducedMotion,
  startTour() {
    ensureRendered();
    void import('./features/tour').then(({ startTour }) => startTour(api));
  },
  startPresentation() {
    ensureRendered();
    void import('./features/present').then(({ startPresentation }) => startPresentation(api));
  },
  openPalette() {
    if (document.querySelector('dialog.palette[open]')) return;
    ensureRendered();
    void import('./features/palette').then(({ openPalette }) => openPalette(api));
  },
};

if (new URLSearchParams(location.search).has('fps')) {
  const meter = document.createElement('output');
  meter.className = 'fps-meter';
  document.body.append(meter);
  let frames = 0;
  let last = performance.now();
  const count = (now: number) => {
    frames += 1;
    if (now - last >= 1000) {
      meter.textContent = `${Math.round((frames * 1000) / (now - last))} fps`;
      frames = 0;
      last = now;
    }
    requestAnimationFrame(count);
  };
  requestAnimationFrame(count);
}

installDownloads(api);
installCursor();
setLocale(initialLocale());
render();
let motionRequested = false;
const loadMotion = () => {
  if (motionRequested) return;
  motionRequested = true;
  void import('./motion').then((module) => {
    motion = module;
    if (!reducedMotion) lenis = module.startSmoothScroll();
    if (app && deferredDone) mountMotionLayer(app);
  });
};
window.addEventListener('wheel', loadMotion, { once: true, passive: true });
window.addEventListener('touchstart', loadMotion, { once: true, passive: true });
window.addEventListener('keydown', loadMotion, { once: true });
window.addEventListener('scroll', loadMotion, { once: true, passive: true });
const idleMotion = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
if (idleMotion) idleMotion(loadMotion, { timeout: 2500 });
else window.setTimeout(loadMotion, 1200);
if (location.hash) {
  ensureRendered();
  const target = document.getElementById(location.hash.slice(1));
  if (target) requestAnimationFrame(() => scrollToY(target.getBoundingClientRect().top + window.scrollY));
}
requestAnimationFrame(() => document.documentElement.classList.add('is-ready'));
const idle = window.requestIdleCallback as typeof window.requestIdleCallback | undefined;
const scheduleBust = () => {
  if (idle) idle(loadBust, { timeout: lowPower ? 2500 : 600 });
  else window.setTimeout(loadBust, lowPower ? 1500 : 200);
};
if (lowPower) {
  const early = () => loadBust();
  window.addEventListener('pointerdown', early, { once: true, passive: true });
  window.addEventListener('scroll', early, { once: true, passive: true });
  if (document.readyState === 'complete') window.setTimeout(scheduleBust, 1800);
  else window.addEventListener('load', () => window.setTimeout(scheduleBust, 1800), { once: true });
} else {
  scheduleBust();
}
