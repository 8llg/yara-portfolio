import { CV_URL } from '../lib/assets';
import { sectionHead } from '../components/section-head';
import { contact, person } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { t } from '../lib/locale';

export function contactSection() {
  return html`
    <section class="section contact on-night" id="contact" aria-labelledby="contact-title">
      ${sectionHead('contact')}
      <div class="contact__layout">
        <dl class="contact__primary">
          <div>
            <dt>${t(ui.email)}</dt>
            <dd class="contact__big" dir="ltr" lang="en">${contact.email}</dd>
          </div>
          <div>
            <dt>${t(ui.phone)}</dt>
            <dd class="contact__big" dir="ltr" lang="en">${contact.phone}</dd>
          </div>
          <div>
            <dt>${t(ui.downloadCv)}</dt>
            <dd>
              <a class="pill-link pill-link--big" href="${CV_URL}" download data-download-cv>
                <span class="pill-link__icon" aria-hidden="true"></span><span class="pill-link__label">${t({ en: 'Yara_Al-Mansouri_CV.pdf · 202 KB', ar: 'Yara_Al-Mansouri_CV.pdf · 202 ك.ب' })}</span>
              </a>
            </dd>
          </div>
          <div>
            <dt>${t({ en: 'Based in', ar: 'المقر' })}</dt>
            <dd>${t(person.city)}</dd>
          </div>
        </dl>
        <div class="contact__links">
          <p class="block-title">${t(ui.elsewhere)}</p>
          <dl class="links">
            ${contact.links.map(
              ([label, address]) => html`
                <div class="links__row">
                  <dt lang="en" dir="ltr">${label}</dt>
                  <dd lang="en" dir="ltr">${address}</dd>
                </div>
              `,
            )}
          </dl>
          <p class="contact__note">${t(ui.placeholderNote)}</p>
        </div>
      </div>
    </section>
  `;
}

export function siteFooter() {
  return html`
    <footer class="colophon on-night">
      <div class="colophon__names" aria-hidden="true">
        <span lang="en" dir="ltr">Yara Al-Mansouri</span>
        <span class="colophon__axis"></span>
        <span lang="ar" dir="rtl">يارا المنصوري</span>
      </div>
      <p class="colophon__persona">${t(ui.footerPersona)}</p>
      <div class="colophon__row">
        <button class="text-button" type="button" data-shortcuts-open>${t(ui.shortcutsHint)}</button>
        <button class="text-button" type="button" data-start-presentation>${t(ui.presentStart)} (P)</button>
        <a class="text-button" href="#top">${t(ui.backToTop)}</a>
      </div>
    </footer>
  `;
}
