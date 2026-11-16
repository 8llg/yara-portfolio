import { metrics } from '../components/metric';
import { plate } from '../components/plates';
import { sectionHead } from '../components/section-head';
import { projects } from '../content/projects';
import type { Project } from '../content/types';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { formatSpan, getLocale, t } from '../lib/locale';

const year = (project: Project) => {
  const start = project.start.slice(0, 4);
  const end = project.end ? project.end.slice(0, 4) : t(ui.present);
  return start === end ? start : `${start}–${end}`;
};

function caseBody(project: Project) {
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const locale = getLocale();
  return html`
    <div class="case__inner">
      <header class="case__head">
        <p class="case__mark" lang="${locale === 'en' ? 'ar' : 'en'}" aria-hidden="true">${locale === 'en' ? project.mark.arabic : project.mark.latin}</p>
        <h2 class="case__title" id="case-title">${t(project.name)}</h2>
        <dl class="case__meta">
          <div><dt>${t({ en: 'Organisation', ar: 'الجهة' })}</dt><dd>${t(project.org)}</dd></div>
          <div><dt>${t({ en: 'Period', ar: 'المدة' })}</dt><dd>${formatSpan(project.start, project.end)}</dd></div>
          <div><dt>${t({ en: 'Role', ar: 'الدور' })}</dt><dd>${t(project.role)}</dd></div>
          <div><dt>${t({ en: 'Team', ar: 'الفريق' })}</dt><dd>${t(project.team)}</dd></div>
        </dl>
      </header>
      <figure class="case__plate">
        ${plate(project.id)}
        <figcaption>${t(ui.caseIllustration)}</figcaption>
      </figure>
      <ol class="story">
        <li class="story__step"><h3 class="story__label">${t(ui.problem)}</h3><p>${t(project.problem)}</p></li>
        <li class="story__step"><h3 class="story__label">${t(ui.action)}</h3><p>${t(project.action)}</p></li>
        <li class="story__step story__step--result"><h3 class="story__label">${t(ui.result)}</h3><p>${t(project.result)}</p></li>
      </ol>
      ${metrics(project.metrics)}
      <footer class="case__foot">
        <p class="tags" aria-label="${t(ui.builtWith)}">${project.tech.map((tech) => html`<span class="tag" lang="en" dir="ltr">${tech}</span>`)}</p>
        ${project.aside ? html`<p class="case__aside">${t(project.aside)}</p>` : ''}
        ${next
          ? html`<button class="case__next" type="button" data-case-open="${next.id}">
              <span class="case__next-label">${t(ui.caseNext)}</span>
              <span class="case__next-name">${t(next.name)}</span>
            </button>`
          : ''}
      </footer>
    </div>
  `;
}

export function work() {
  return html`
    <section class="section work on-night" id="work" aria-labelledby="work-title">
      ${sectionHead('work')}
      <ul class="projects" data-projects>
        ${projects.map(
          (project) => html`
            <li class="project">
              <button class="project__button" type="button" data-case-open="${project.id}" aria-haspopup="dialog" data-cursor="${t({ en: 'Open case', ar: 'افتح' })}">
                <span class="project__name">${t(project.name)}</span>
                <span class="project__org">${t(project.org)}</span>
                <span class="project__year" dir="ltr">${year(project)}</span>
                <span class="project__thumb" aria-hidden="true">${plate(project.id)}</span>
                <span class="visually-hidden">, ${t(ui.openProject)}</span>
              </button>
            </li>
          `,
        )}
      </ul>
      <div class="preview" aria-hidden="true" data-preview>
        <div class="preview__frame">
          ${projects.map((project) => html`<div class="preview__plate" data-preview-plate="${project.id}">${plate(project.id)}</div>`)}
        </div>
      </div>
      <dialog class="case on-night" data-case aria-labelledby="case-title">
        <button class="case__close" type="button" data-case-close aria-label="${t(ui.caseClose)}"><span aria-hidden="true"></span></button>
        <div class="case__scroll" data-case-body></div>
      </dialog>
    </section>
  `;
}

export function mountWork(root: HTMLElement, reducedMotion: boolean): () => void {
  const section = root.querySelector<HTMLElement>('#work');
  const dialog = root.querySelector<HTMLDialogElement>('[data-case]');
  const body = root.querySelector<HTMLElement>('[data-case-body]');
  const preview = root.querySelector<HTMLElement>('[data-preview]');
  const list = root.querySelector<HTMLElement>('[data-projects]');
  if (!section || !dialog || !body || !preview || !list) return () => undefined;

  let lastTrigger: HTMLElement | null = null;

  const open = (id: string, trigger: HTMLElement | null, origin?: { x: number; y: number }) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    body.innerHTML = caseBody(project).value;
    body.scrollTop = 0;
    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? window.innerHeight / 2;
    dialog.style.setProperty('--ox', `${x}px`);
    dialog.style.setProperty('--oy', `${y}px`);
    if (!dialog.open) {
      lastTrigger = trigger;
      dialog.showModal();
      document.documentElement.classList.add('case-open');
    }
    dialog.classList.remove('is-entering');
    void dialog.offsetWidth;
    if (!reducedMotion) dialog.classList.add('is-entering');
    body.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
    dialog.querySelector<HTMLElement>('.case__close')?.focus({ preventScroll: true });
  };

  const close = () => {
    if (!dialog.open) return;
    dialog.close();
  };

  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('case-open');
    lastTrigger?.focus({ preventScroll: true });
  });

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const trigger = target.closest<HTMLElement>('[data-case-open]');
    if (trigger?.dataset.caseOpen) {
      const fromDialog = dialog.contains(trigger);
      open(trigger.dataset.caseOpen, fromDialog ? lastTrigger : trigger, event.detail ? { x: event.clientX, y: event.clientY } : undefined);
      return;
    }
    if (target.closest('[data-case-close]') || target === dialog) close();
  };
  root.addEventListener('click', onClick);

  let frame = 0;
  let active = '';
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const tick = () => {
    current.x += (target.x - current.x) * (reducedMotion ? 1 : 0.16);
    current.y += (target.y - current.y) * (reducedMotion ? 1 : 0.16);
    const tilt = reducedMotion ? 0 : Math.max(-8, Math.min(8, (target.x - current.x) * 0.06));
    preview.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) rotate(${tilt}deg)`;
    if (Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3) frame = requestAnimationFrame(tick);
    else frame = 0;
  };

  const show = (id: string) => {
    if (id === active) return;
    active = id;
    preview.querySelectorAll<HTMLElement>('[data-preview-plate]').forEach((item) => {
      item.classList.toggle('is-active', item.dataset.previewPlate === id);
    });
  };

  if (hoverCapable) {
    list.addEventListener('pointermove', (event) => {
      const row = (event.target as HTMLElement).closest<HTMLElement>('[data-case-open]');
      if (!row?.dataset.caseOpen) return;
      show(row.dataset.caseOpen);
      target.x = event.clientX;
      target.y = event.clientY;
      if (!preview.classList.contains('is-visible')) {
        current.x = target.x;
        current.y = target.y;
        preview.classList.add('is-visible');
      }
      if (!frame) frame = requestAnimationFrame(tick);
    });
    list.addEventListener('pointerleave', () => {
      preview.classList.remove('is-visible');
      active = '';
    });
  }

  return () => {
    root.removeEventListener('click', onClick);
    cancelAnimationFrame(frame);
    if (dialog.open) dialog.close();
  };
}
