import { CV_URL } from '../lib/assets';
import { person } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { t } from '../lib/locale';

const repeat = (text: string, times: number) =>
  Array.from({ length: times }, () => html`<span class="marquee__item">${text}</span><span class="marquee__nuqta" aria-hidden="true"></span>`);

export function hero() {
  const latin = 'Yara Al-Mansouri';
  const arabic = 'يارا المنصوري';
  return html`
    <section class="hero on-night" id="top" aria-labelledby="hero-title">
      <h1 class="visually-hidden" id="hero-title">
        <span lang="en">${person.fullName.en}</span> <span lang="ar">${person.fullName.ar}</span>
      </h1>
      <div class="hero__names" aria-hidden="true">
        <div class="marquee marquee--latin" lang="en" dir="ltr">
          <div class="marquee__track">${repeat(latin, 4)}</div>
          <div class="marquee__track">${repeat(latin, 4)}</div>
        </div>
        <div class="marquee marquee--arabic" lang="ar" dir="ltr">
          <div class="marquee__track">${repeat(arabic, 5)}</div>
          <div class="marquee__track">${repeat(arabic, 5)}</div>
        </div>
      </div>
      <div class="hero__stage" data-bust-slot></div>
      <div class="hero__shade" aria-hidden="true"></div>
      <div class="hero__content">
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
        <a class="cta" href="#work" data-magnetic>
          <span class="cta__label">${t(ui.heroCta)}</span>
        </a>
      </div>
      <p class="hero__caption">${t(ui.heroCaption)}</p>
    </section>
  `;
}
