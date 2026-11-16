import { CV_URL } from '../lib/assets';
import { navSections, ui } from '../content/ui';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

export function masthead() {
  const target = getLocale() === 'en' ? 'ar' : 'en';
  return html`
    <a class="skip" href="#main">${t(ui.skip)}</a>
    <header class="masthead" data-masthead>
      <a class="monogram" href="#top" aria-label="${t({ en: 'Yara Al-Mansouri, back to top', ar: 'يارا المنصوري، العودة إلى الأعلى' })}">
        <span class="monogram__latin" lang="en" dir="ltr">Yara</span>
        <span class="monogram__nuqta" aria-hidden="true"></span>
        <span class="monogram__arabic" lang="ar" dir="rtl">يارا</span>
      </a>
      <nav class="masthead__nav" id="site-nav" aria-label="${t(ui.menu)}">
        <ul class="nav">
          ${navSections.map(
            (section) => html`
              <li>
                <a class="nav__link" href="#${section.id}" data-nav="${section.id}">${t(section.label)}</a>
              </li>
            `,
          )}
        </ul>
      </nav>
      <div class="masthead__tools">
        <button class="icon-button" type="button" data-open-palette aria-keyshortcuts="Control+K Meta+K" title="${t(ui.paletteOpen)}">
          <span class="icon-button__search" aria-hidden="true"></span><span class="visually-hidden">${t({ en: 'Search', ar: 'بحث' })}</span><kbd class="icon-button__kbd">Ctrl K</kbd>
        </button>
        <a class="cv-button" href="${CV_URL}" download data-download-cv>
          <span class="pill-link__icon" aria-hidden="true"></span><span class="pill-link__label">${t(ui.cvShort)}</span>
        </a>
        <button class="switch" type="button" data-switch lang="${target}" title="${t(ui.switchLabel)}">
          <span class="switch__nuqta" aria-hidden="true"></span>
          <span class="switch__text">${t(ui.switchTo)}</span>
        </button>
        <button class="menu-toggle" type="button" data-menu aria-expanded="false" aria-controls="site-nav" aria-label="${t(ui.menu)}">
          <span class="menu-toggle__bars" aria-hidden="true"></span>
        </button>
      </div>
    </header>
  `;
}
