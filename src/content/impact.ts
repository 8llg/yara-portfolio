import { career } from './career';
import { projects } from './projects';
import type { Metric, T } from './types';

export type Domain = 'product' | 'systems' | 'access' | 'research' | 'leadership';

export const domains: { id: Domain; label: T }[] = [
  { id: 'product', label: { en: 'Product engineering', ar: 'هندسة المنتجات' } },
  { id: 'systems', label: { en: 'Design systems', ar: 'أنظمة التصميم' } },
  { id: 'access', label: { en: 'Accessibility', ar: 'إمكانية الوصول' } },
  { id: 'research', label: { en: 'Research', ar: 'البحث' } },
  { id: 'leadership', label: { en: 'Leadership', ar: 'القيادة' } },
];

export interface ImpactItem {
  id: string;
  metric: Metric;
  source: T;
  quote: T;
  domains: Domain[];
  project?: string;
}

const role = (id: string, index: number): T => career.find((entry) => entry.id === id)?.bullets[index] ?? { en: '', ar: '' };
const result = (id: string): T => projects.find((project) => project.id === id)?.result ?? { en: '', ar: '' };
const action = (id: string): T => projects.find((project) => project.id === id)?.action ?? { en: '', ar: '' };
const fig = (en: string, ar: string, label: T): Metric => ({ kind: 'figure', value: { en, ar }, label });

const src = {
  mizan: { en: 'Mizan Design System · Faseela Ventures', ar: 'نظام ميزان · فسيلة فنتشرز' },
  faseela: { en: 'Principal Product Engineer · Faseela Ventures', ar: 'مهندسة منتجات رئيسية · فسيلة فنتشرز' },
  savings: { en: 'Savings Goals · Faseela Ventures', ar: 'أهداف الادخار · فسيلة فنتشرز' },
  tele: { en: 'National Telemedicine Platform · Zayna Health Tech', ar: 'المنصة الوطنية للطب الاتصالي · زينة' },
  director: { en: 'Director of Product Engineering · Zayna Health Tech', ar: 'مديرة هندسة المنتجات · زينة' },
  manager: { en: 'Engineering Manager · Zayna Health Tech', ar: 'مديرة الهندسة · زينة' },
  frontend: { en: 'Senior Front-End Engineer · Zayna Health Tech', ar: 'مهندسة واجهات أولى · زينة' },
  qalam: { en: 'Qalam Learn', ar: 'قلم ليرن' },
  khatt: { en: 'Khatt · PhD research', ar: 'محرّك خط · بحث الدكتوراه' },
  hirfa: { en: 'Hirfa UI · open source', ar: 'حرفة · مفتوح المصدر' },
  dalil: { en: 'Dalil Accessibility Toolkit', ar: 'دليل لإمكانية الوصول' },
  rafeeq: { en: 'Rafeeq Rides', ar: 'رفيق رايدز' },
  teaching: { en: 'Teaching and mentoring', ar: 'التعليم والإرشاد' },
} satisfies Record<string, T>;

const telemedicine = projects.find((project) => project.id === 'telemedicine');
const qalamProject = projects.find((project) => project.id === 'qalam');
const faseela = career.find((entry) => entry.id === 'faseela');
const director = career.find((entry) => entry.id === 'zayna-director');
const manager = career.find((entry) => entry.id === 'zayna-manager');

const shiftOf = (metrics: Metric[] | undefined, index: number, fallback: Metric): Metric => metrics?.[index] ?? fallback;
const none: Metric = fig('', '', { en: '', ar: '' });

export const impact: ImpactItem[] = [
  { id: 'mizan-components', project: 'mizan', domains: ['systems'], source: src.mizan, quote: role('faseela', 1), metric: fig('180', '180', { en: 'components adopted by all 9 teams', ar: 'مكوّنًا اعتمدتها الفرق التسعة' }) },
  { id: 'mizan-speed', project: 'mizan', domains: ['systems', 'product'], source: src.mizan, quote: result('mizan'), metric: fig('38%', '38%', { en: 'faster UI build time', ar: 'أسرع في بناء الواجهات' }) },
  { id: 'mizan-audit', project: 'mizan', domains: ['systems', 'research'], source: src.mizan, quote: action('mizan'), metric: fig('1,300', '1,300', { en: 'screens audited', ar: 'شاشة رُوجعت' }) },
  { id: 'faseela-wcag', domains: ['access', 'leadership'], source: src.faseela, quote: role('faseela', 3), metric: shiftOf(faseela?.metrics, 1, none) },
  { id: 'faseela-lcp', domains: ['product'], source: src.faseela, quote: role('faseela', 2), metric: shiftOf(faseela?.metrics, 0, none) },
  { id: 'faseela-teams', domains: ['systems', 'leadership'], source: src.faseela, quote: role('faseela', 0), metric: fig('9', '9', { en: 'product teams, in a super-app with 4.2M users', ar: 'فرق منتجات في تطبيق شامل يستخدمه 4.2 مليون' }) },
  { id: 'savings-goals', project: 'savings', domains: ['product'], source: src.savings, quote: result('savings'), metric: fig('610,000', '610,000', { en: 'goals opened in 6 months', ar: 'هدف خلال 6 أشهر' }) },
  { id: 'savings-research', project: 'savings', domains: ['research'], source: src.savings, quote: action('savings'), metric: fig('48', '48', { en: 'interviews in 5 cities, 3 prototypes tested', ar: 'مقابلة في 5 مدن واختبار 3 نماذج' }) },
  { id: 'tele-wait', project: 'telemedicine', domains: ['product'], source: src.tele, quote: result('telemedicine'), metric: shiftOf(telemedicine?.metrics, 0, none) },
  { id: 'tele-drops', project: 'telemedicine', domains: ['product'], source: src.tele, quote: result('telemedicine'), metric: shiftOf(telemedicine?.metrics, 1, none) },
  { id: 'tele-volume', project: 'telemedicine', domains: ['product', 'leadership'], source: src.director, quote: role('zayna-director', 1), metric: fig('3.1M', '3.1 مليون', { en: 'consultations in 2022', ar: 'استشارة في 2022' }) },
  { id: 'director-team', domains: ['leadership'], source: src.director, quote: role('zayna-director', 0), metric: fig('64', '64', { en: 'people across 7 squads, SAR 21M budget', ar: 'شخصًا في 7 فرق بميزانية 21 مليون ريال' }) },
  { id: 'director-crash', domains: ['product'], source: src.director, quote: role('zayna-director', 2), metric: shiftOf(director?.metrics, 0, none) },
  { id: 'director-rating', domains: ['product'], source: src.director, quote: role('zayna-director', 2), metric: shiftOf(director?.metrics, 1, none) },
  { id: 'director-audits', domains: ['product', 'leadership'], source: src.director, quote: role('zayna-director', 3), metric: fig('0', '0', { en: 'major findings across two health-data security audits', ar: 'ملاحظة جوهرية في تدقيقَين لأمن البيانات الصحية' }) },
  { id: 'manager-team', domains: ['leadership'], source: src.manager, quote: role('zayna-manager', 0), metric: shiftOf(manager?.metrics, 1, none) },
  { id: 'manager-release', domains: ['product', 'leadership'], source: src.manager, quote: role('zayna-manager', 2), metric: shiftOf(manager?.metrics, 0, none) },
  { id: 'manager-booking', domains: ['product'], source: src.manager, quote: role('zayna-manager', 1), metric: fig('1.8M', '1.8 مليون', { en: 'patients across 140 clinics', ar: 'مريض في 140 عيادة' }) },
  { id: 'frontend-task', domains: ['product'], source: src.frontend, quote: role('zayna-frontend', 0), metric: fig('27%', '27%', { en: "shorter average task time for doctors", ar: 'أقل في متوسط وقت مهام الأطباء' }) },
  { id: 'frontend-library', domains: ['systems'], source: src.frontend, quote: role('zayna-frontend', 1), metric: fig('1st', 'الأولى', { en: 'shared component library at Zayna', ar: 'مكتبة مكوّنات مشتركة في زينة' }) },
  { id: 'qalam-completion', project: 'qalam', domains: ['product', 'research'], source: src.qalam, quote: result('qalam'), metric: shiftOf(qalamProject?.metrics, 0, none) },
  { id: 'qalam-reach', project: 'qalam', domains: ['product'], source: src.qalam, quote: role('qalam', 0), metric: fig('230,000', '230,000', { en: 'learners in 14 countries', ar: 'متعلم في 14 دولة' }) },
  { id: 'khatt-speed', project: 'khatt', domains: ['research', 'access'], source: src.khatt, quote: result('khatt'), metric: fig('+19%', '+19%', { en: 'reading speed', ar: 'في سرعة القراءة' }) },
  { id: 'khatt-errors', project: 'khatt', domains: ['research', 'access'], source: src.khatt, quote: result('khatt'), metric: fig('−31%', '−31%', { en: 'reading errors', ar: 'في أخطاء القراءة' }) },
  { id: 'khatt-study', project: 'khatt', domains: ['research'], source: src.khatt, quote: action('khatt'), metric: fig('312', '312', { en: 'participants tested', ar: 'مشاركًا في الاختبار' }) },
  { id: 'hirfa-downloads', project: 'hirfa', domains: ['systems', 'access'], source: src.hirfa, quote: result('hirfa'), metric: fig('1.2M', '1.2 مليون', { en: 'npm downloads a year', ar: 'تنزيل سنويًا عبر npm' }) },
  { id: 'hirfa-components', project: 'hirfa', domains: ['systems', 'access'], source: src.hirfa, quote: action('hirfa'), metric: fig('95', '95', { en: 'components with mirrored layouts', ar: 'مكوّنًا بتخطيطات معكوسة' }) },
  { id: 'hirfa-community', project: 'hirfa', domains: ['systems', 'leadership'], source: src.hirfa, quote: result('hirfa'), metric: fig('210', '210', { en: 'contributors, 9,800 GitHub stars', ar: 'مساهمًا و9,800 نجمة على GitHub' }) },
  { id: 'dalil-checks', project: 'dalil', domains: ['access'], source: src.dalil, quote: action('dalil'), metric: fig('42', '42', { en: 'Arabic-specific accessibility issues flagged', ar: 'مشكلة وصول خاصة بالعربية' }) },
  { id: 'dalil-reach', project: 'dalil', domains: ['access'], source: src.dalil, quote: result('dalil'), metric: fig('3,400', '3,400', { en: 'developers in 22 countries', ar: 'مطوّر في 22 دولة' }) },
  { id: 'rafeeq-rides', project: 'rafeeq', domains: ['product'], source: src.rafeeq, quote: result('rafeeq'), metric: fig('140,000', '140,000', { en: 'rides, 26,000 sign-ups', ar: 'رحلة و26,000 تسجيل' }) },
  { id: 'rafeeq-seed', project: 'rafeeq', domains: ['leadership'], source: src.rafeeq, quote: role('rafeeq', 1), metric: fig('SAR 3.5M', '3.5 مليون ريال', { en: 'seed funding, team of 11', ar: 'تمويل تأسيسي وفريق من 11' }) },
  { id: 'teach-students', domains: ['leadership'], source: src.teaching, quote: role('lecturer', 0), metric: fig('1,400+', '1,400+', { en: 'university students over 10 semesters', ar: 'طالب جامعي على مدى 10 فصول' }) },
  { id: 'teach-mentoring', domains: ['leadership'], source: src.teaching, quote: role('mentor', 0), metric: fig('25', '25', { en: 'startups mentored across 6 cohorts', ar: 'شركة ناشئة عبر 6 دفعات' }) },
  { id: 'teach-designers', domains: ['leadership', 'systems'], source: src.teaching, quote: role('advisory', 0), metric: fig('60', '60', { en: 'early-career designers mentored each year', ar: 'مصممًا في بداية مسيرتهم سنويًا' }) },
];
