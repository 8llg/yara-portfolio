import { sectionHead } from '../components/section-head';
import { highlights, person } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

export function statement() {
  const words = t(person.summary).split(/\s+/);
  return html`
    <section class="section statement" id="about" aria-labelledby="about-title">
      <p class="statement__text" data-ink>
        ${words.map((word) => html`<span class="ink-word">${word}</span> `)}
      </p>
      <figure class="statement__quote">
        <blockquote><p>${t(ui.heroQuote)}</p></blockquote>
        <figcaption>
          ${t(ui.heroCover)}
          ${getLocale() === 'ar' ? html`<span class="statement__original" lang="en" dir="ltr">“The engineer who designs in two directions”</span>` : ''}
        </figcaption>
      </figure>
      ${sectionHead('about')}
      <ul class="ledger">
        ${highlights.map(
          (item, index) => html`
            <li class="ledger__item" style="--i:${index}" data-reveal>
              <span class="ledger__figure" dir="ltr">${item.figure}${item.suffix ? html`<span class="ledger__suffix">${item.suffix}</span>` : ''}</span>
              <span class="ledger__label">${t(item.label)}</span>
              <span class="ledger__detail">${t(item.detail)}</span>
            </li>
          `,
        )}
      </ul>
    </section>
  `;
}
