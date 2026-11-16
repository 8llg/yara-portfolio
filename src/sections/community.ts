import { sectionHead } from '../components/section-head';
import { community, interests } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { t } from '../lib/locale';

export function communitySection() {
  return html`
    <section class="section community" id="community" aria-labelledby="community-title">
      ${sectionHead('community')}
      <ol class="community__grid">
        ${community.map(
          (item, index) => html`
            <li class="community__item" data-reveal style="--stagger:${index}">
              <span class="community__figure" dir="ltr">${item.figure}</span>
              <span class="community__label">${t(item.label)}</span>
            </li>
          `,
        )}
      </ol>
      <div class="interests" data-reveal>
        <h3 class="block-title">${t(ui.interests)}</h3>
        <ul class="interests__list">
          ${interests.map((item) => html`<li>${t(item)}</li>`)}
        </ul>
      </div>
    </section>
  `;
}
