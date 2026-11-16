import { CV_URL } from '../lib/assets';
import { person } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

export function hero() {
  const ar = getLocale() === 'ar';
  const primary = ar ? ['يارا', 'المنصوري'] : ['Yara', 'Al-Mansouri'];
  const secondary = ar ? 'Yara Al-Mansouri' : 'يارا المنصوري';
  return html`
    <section class="hero on-night" id="top" aria-labelledby="hero-title">
      <div class="hero__arch" aria-hidden="true"><span class="hero__arch-line"></span></div>
      <div class="hero__floor" aria-hidden="true"></div>
      <div class="hero__stage" data-bust-slot></div>
      <div class="hero__content">
        <h1 class="hero__name" id="hero-title">
          <span class="visually-hidden">${t(person.fullName)}</span>
          <span class="hero__line" aria-hidden="true"><span class="hero__word">${primary[0]}</span></span>
          <span class="hero__line" aria-hidden="true"><span class="hero__word">${primary[1]}</span></span>
        </h1>
        <p class="hero__alt" lang="${ar ? 'en' : 'ar'}" dir="${ar ? 'ltr' : 'rtl'}" aria-hidden="true">
          <span class="hero__nuqta"></span><span class="hero__alt-text">${secondary}</span>
        </p>
        <div class="hero__intro">
          <p class="hero__roles">${person.roles.map((role, i) => html`${i ? html`<span class="hero__sep" aria-hidden="true"></span>` : ''}<span>${t(role)}</span>`)}</p>
          <p class="hero__text">${t(ui.heroIntro)}</p>
          <div class="hero__actions">
            <a class="pill-link" href="${CV_URL}" download data-download-cv>
              <span class="pill-link__icon" aria-hidden="true"></span><span class="pill-link__label">${t(ui.downloadCv)}</span>
            </a>
            <button class="pill-link pill-link--quiet" type="button" data-start-tour>${t(ui.tourStart)}</button>
          </div>
        </div>
      </div>
      <a class="cta" href="#work" data-magnetic>
        <span class="cta__label">${t(ui.heroCta)}</span>
      </a>
      <p class="hero__caption">${t(ui.heroCaption)}</p>
    </section>
  `;
}
