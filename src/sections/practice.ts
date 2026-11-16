import { sectionHead } from '../components/section-head';
import { languages, levelLabels, skills } from '../content/profile';
import { ui } from '../content/ui';
import { html } from '../lib/html';
import { getLocale, t } from '../lib/locale';

const SCALE = 20;

export function practice() {
  const unit = getLocale() === 'ar' ? (n: number) => `${n} ${n <= 10 ? 'سنوات' : 'سنة'}` : (n: number) => `${n} years`;
  const ticks = [0, 5, 10, 15, 20];
  return html`
    <section class="section practice" id="practice" aria-labelledby="practice-title">
      ${sectionHead('practice')}
      <div class="practice__layout">
        <div class="skills">
          <h3 class="block-title">${t(ui.disciplines)}</h3>
          <div class="skills__axis" aria-hidden="true">
            ${ticks.map((tick) => html`<span style="--at:${(tick / SCALE) * 100}%">${tick}</span>`)}
          </div>
          <ol class="skills__list">
            ${skills.map(
              (skill, index) => html`
                <li class="skill" data-reveal style="--stagger:${index};--years:${(skill.years / SCALE) * 100}%">
                  <div class="skill__head">
                    <span class="skill__area">${t(skill.area)}</span>
                    <span class="skill__level skill__level--${skill.level}">${t(levelLabels[skill.level])}</span>
                    <span class="skill__years">${unit(skill.years)}</span>
                  </div>
                  <span class="skill__bar" aria-hidden="true"><span></span></span>
                  <p class="skill__tools" lang="en" dir="ltr">${skill.tools}</p>
                </li>
              `,
            )}
          </ol>
        </div>
        <div class="tongues">
          <h3 class="block-title">${t(ui.languagesTitle)}</h3>
          <ol class="tongues__list">
            ${languages.map(
              (lang) => html`
                <li class="tongue" data-reveal>
                  <span class="tongue__native" lang="${lang.code}" dir="${lang.code === 'ar' ? 'rtl' : 'ltr'}">${lang.native}</span>
                  <span class="tongue__meter" aria-hidden="true" style="--rank:${lang.rank}">
                    ${[1, 2, 3, 4, 5, 6].map((step) => html`<span class="${step <= lang.rank ? 'on' : ''}"></span>`)}
                  </span>
                  <span class="tongue__name">${t(lang.name)}</span>
                  <span class="tongue__level">${t(lang.level)}</span>
                </li>
              `,
            )}
          </ol>
        </div>
      </div>
    </section>
  `;
}
