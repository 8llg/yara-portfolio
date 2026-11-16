import { sections, type SectionId } from '../content/ui';
import { html } from '../lib/html';
import { t } from '../lib/locale';

export function sectionHead(id: SectionId) {
  const section = sections.find((item) => item.id === id);
  if (!section) return html``;
  return html`
    <header class="section-head">
      <h2 class="section-head__title" id="${id}-title" data-split>${t(section.title)}</h2>
      <p class="section-head__lede">${t(section.lede)}</p>
    </header>
  `;
}
