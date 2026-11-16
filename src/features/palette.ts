import { projects } from '../content/projects';
import { recordCategories } from '../content/record';
import { sections, ui } from '../content/ui';
import { escapeHtml } from '../lib/html';
import { t } from '../lib/locale';
import { focusRecord, searchRecord } from '../sections/record';
import type { AppApi } from './api';

interface Command {
  id: string;
  group: string;
  title: string;
  hint?: string;
  keywords: string;
  run(): void;
}

let dialog: HTMLDialogElement | null = null;

function commands(api: AppApi): Command[] {
  const go = t({ en: 'Go to', ar: 'انتقل إلى' });
  const groupSections = t({ en: 'Sections', ar: 'الأقسام' });
  const groupProjects = t({ en: 'Case studies', ar: 'دراسات الحالة' });
  const groupActions = t({ en: 'Actions', ar: 'أوامر' });
  const list: Command[] = [
    {
      id: 'action-language',
      group: groupActions,
      title: t({ en: 'Read in Arabic (mirror the page)', ar: 'اقرأ بالإنجليزية (اعكس الصفحة)' }),
      hint: 'L',
      keywords: 'language arabic english rtl ltr لغة عربي انجليزي اتجاه',
      run: () => void api.setLanguage(api.getLocale() === 'en' ? 'ar' : 'en'),
    },
    {
      id: 'action-cv',
      group: groupActions,
      title: t(ui.downloadCv),
      hint: 'PDF',
      keywords: 'download cv resume pdf تحميل سيرة',
      run: () => document.querySelector<HTMLElement>('.cv-button')?.click(),
    },
    {
      id: 'action-tour',
      group: groupActions,
      title: t(ui.tourStart),
      keywords: 'tour guide help جولة دليل',
      run: () => api.startTour(),
    },
    {
      id: 'action-present',
      group: groupActions,
      title: t(ui.presentStart),
      hint: 'P',
      keywords: 'present presentation demo judges عرض تقديم',
      run: () => api.startPresentation(),
    },
    {
      id: 'action-top',
      group: groupActions,
      title: t({ en: 'Back to the portrait', ar: 'العودة إلى البورتريه' }),
      hint: '0',
      keywords: 'top home hero portrait البداية الأعلى',
      run: () => api.goTo('top'),
    },
    ...sections.map((section) => ({
      id: `section-${section.id}`,
      group: groupSections,
      title: `${go} ${t(section.label)}`,
      hint: t(section.title),
      keywords: `${section.label.en} ${section.label.ar} ${section.title.en} ${section.title.ar}`,
      run: () => api.goTo(section.id),
    })),
    ...projects.map((project) => ({
      id: `project-${project.id}`,
      group: groupProjects,
      title: t(project.name),
      hint: t(project.org),
      keywords: `${project.name.en} ${project.name.ar} ${project.mark.latin} ${project.mark.arabic} ${project.tech.join(' ')}`,
      run: () => api.openCase(project.id),
    })),
  ];
  return list;
}

function score(command: Command, terms: string[]): number {
  const text = `${command.title} ${command.keywords} ${command.hint ?? ''}`.toLowerCase();
  let total = 0;
  for (const term of terms) {
    const index = text.indexOf(term);
    if (index < 0) return -1;
    total += index === 0 ? 3 : 1;
  }
  return total;
}

export function openPalette(api: AppApi): void {
  dialog?.remove();
  dialog = document.createElement('dialog');
  dialog.className = 'palette';
  dialog.setAttribute('aria-label', t(ui.paletteOpen));
  dialog.innerHTML = `
    <div class="palette__box">
      <div class="palette__field">
        <span class="search__icon" aria-hidden="true"></span>
        <input class="palette__input" type="text" role="combobox" aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list"
          placeholder="${escapeHtml(t({ en: 'Jump to a section, open a project, or search the CV', ar: 'انتقل إلى قسم، أو افتح مشروعًا، أو ابحث في السيرة' }))}" />
        <kbd>Esc</kbd>
      </div>
      <ul class="palette__list" id="palette-list" role="listbox" data-lenis-prevent></ul>
    </div>`;
  document.body.append(dialog);
  const input = dialog.querySelector<HTMLInputElement>('.palette__input');
  const list = dialog.querySelector<HTMLUListElement>('.palette__list');
  if (!input || !list) return;

  const all = commands(api);
  let shown: Command[] = [];
  let active = 0;

  const render = () => {
    const query = input.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const matches = terms.length
      ? all
          .map((command) => ({ command, s: score(command, terms) }))
          .filter((item) => item.s >= 0)
          .sort((a, b) => b.s - a.s)
          .map((item) => item.command)
      : all;
    const fromCv: Command[] = query.length > 1
      ? searchRecord(query)
          .slice(0, 6)
          .map((entry) => ({
            id: `cv-${entry.id}`,
            group: t({ en: 'In the CV', ar: 'في السيرة' }),
            title: t(entry.title),
            hint: t(recordCategories.find((c) => c.id === entry.category)?.label ?? { en: '', ar: '' }),
            keywords: '',
            run: () => {
              api.goTo('record');
              window.setTimeout(() => focusRecord(input.value.trim()), 50);
            },
          }))
      : [];
    shown = [...matches, ...fromCv];
    active = Math.min(active, Math.max(0, shown.length - 1));
    let lastGroup = '';
    list.innerHTML = shown.length
      ? shown
          .map((command, index) => {
            const heading = command.group !== lastGroup ? `<li class="palette__group" role="presentation">${escapeHtml(command.group)}</li>` : '';
            lastGroup = command.group;
            return `${heading}<li class="palette__item" role="option" id="palette-${index}" data-index="${index}" aria-selected="${index === active}">
              <span class="palette__title">${escapeHtml(command.title)}</span>${command.hint ? `<span class="palette__hint">${escapeHtml(command.hint)}</span>` : ''}</li>`;
          })
          .join('')
      : `<li class="palette__empty" role="presentation">${escapeHtml(t({ en: 'No matches. Try a project name or a year.', ar: 'لا نتائج. جرّب اسم مشروع أو سنة.' }))}</li>`;
    input.setAttribute('aria-activedescendant', shown.length ? `palette-${active}` : '');
    list.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  };

  const run = (index: number) => {
    const command = shown[index];
    if (!command) return;
    dialog?.close();
    command.run();
  };

  input.addEventListener('input', () => {
    active = 0;
    render();
  });
  input.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      active = (active + 1) % Math.max(1, shown.length);
      render();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      active = (active - 1 + shown.length) % Math.max(1, shown.length);
      render();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      run(active);
    }
  });
  list.addEventListener('click', (event) => {
    const item = (event.target as HTMLElement).closest<HTMLElement>('[data-index]');
    if (item) run(Number(item.dataset.index));
  });
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog?.close();
  });
  dialog.addEventListener('close', () => {
    dialog?.remove();
    dialog = null;
  });
  render();
  dialog.showModal();
  input.focus();
}
