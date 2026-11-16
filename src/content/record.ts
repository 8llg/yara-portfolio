import { career } from './career';
import { awards, certifications, certStatusLabels, highlights, interests, languages, levelLabels, media, patents, publications, skills, talks } from './profile';
import { projects } from './projects';
import type { T } from './types';

export type RecordCategory =
  | 'highlights'
  | 'experience'
  | 'projects'
  | 'education'
  | 'community'
  | 'skills'
  | 'certifications'
  | 'awards'
  | 'patents'
  | 'publications'
  | 'talks'
  | 'languages'
  | 'interests';

export const recordCategories: { id: RecordCategory; label: T }[] = [
  { id: 'highlights', label: { en: 'Highlights', ar: 'أبرز الأرقام' } },
  { id: 'experience', label: { en: 'Experience', ar: 'الخبرة' } },
  { id: 'projects', label: { en: 'Projects', ar: 'المشاريع' } },
  { id: 'education', label: { en: 'Education', ar: 'التعليم' } },
  { id: 'community', label: { en: 'Teaching & community', ar: 'التعليم والمجتمع' } },
  { id: 'skills', label: { en: 'Skills', ar: 'المهارات' } },
  { id: 'certifications', label: { en: 'Certifications', ar: 'الشهادات' } },
  { id: 'awards', label: { en: 'Awards', ar: 'الجوائز' } },
  { id: 'patents', label: { en: 'Patents', ar: 'براءات الاختراع' } },
  { id: 'publications', label: { en: 'Publications', ar: 'المنشورات' } },
  { id: 'talks', label: { en: 'Talks & media', ar: 'المحاضرات والإعلام' } },
  { id: 'languages', label: { en: 'Languages', ar: 'اللغات' } },
  { id: 'interests', label: { en: 'Interests', ar: 'الاهتمامات' } },
];

export interface RecordEntry {
  id: string;
  category: RecordCategory;
  title: T;
  meta: T;
  body: T[];
}

const same = (value: string): T => ({ en: value, ar: value });
const span = (start: string, end: string | null): T => ({
  en: `${start.slice(0, 4)} – ${end ? end.slice(0, 4) : 'Present'}`,
  ar: `${start.slice(0, 4)} – ${end ? end.slice(0, 4) : 'الآن'}`,
});
const join = (a: T, b: T): T => ({ en: `${a.en} · ${b.en}`, ar: `${a.ar} · ${b.ar}` });

const categoryForTrack = { work: 'experience', venture: 'experience', study: 'education', community: 'community' } as const;

export const record: RecordEntry[] = [
  ...highlights.map((item, i) => ({
    id: `highlight-${i}`,
    category: 'highlights' as const,
    title: { en: `${item.figure}${item.suffix ?? ''} ${item.label.en}`, ar: `${item.figure}${item.suffix ?? ''} ${item.label.ar}` },
    meta: item.detail,
    body: [],
  })),
  ...career.map((entry) => ({
    id: `career-${entry.id}`,
    category: categoryForTrack[entry.track],
    title: entry.title,
    meta: join(join(entry.org, entry.place), span(entry.start, entry.end)),
    body: entry.bullets,
  })),
  ...projects.map((project) => ({
    id: `project-${project.id}`,
    category: 'projects' as const,
    title: project.name,
    meta: join(join(project.org, project.role), span(project.start, project.end)),
    body: [project.problem, project.action, project.result],
  })),
  ...skills.map((skill, i) => ({
    id: `skill-${i}`,
    category: 'skills' as const,
    title: skill.area,
    meta: { en: `${levelLabels[skill.level].en} · ${skill.years} years`, ar: `${levelLabels[skill.level].ar} · ${skill.years} ${skill.years <= 10 ? 'سنوات' : 'سنة'}` },
    body: [same(skill.tools)],
  })),
  ...certifications.map((cert, i) => ({
    id: `cert-${i}`,
    category: 'certifications' as const,
    title: same(cert.name),
    meta: join(same(cert.issuer), cert.year ? join(same(String(cert.year)), certStatusLabels[cert.status]) : cert.detail),
    body: cert.credential ? [same(cert.credential)] : [cert.detail],
  })),
  ...awards.map((award, i) => ({
    id: `award-${i}`,
    category: 'awards' as const,
    title: award.title,
    meta: join(same(award.body), same(String(award.year))),
    body: [award.reason],
  })),
  ...patents.map((patent, i) => ({
    id: `patent-${i}`,
    category: 'patents' as const,
    title: patent.title,
    meta: join(same(patent.number), patent.status),
    body: [],
  })),
  ...publications.map((pub, i) => ({
    id: `pub-${i}`,
    category: 'publications' as const,
    title: same(pub.title),
    meta: same(`${pub.authors} (${pub.year})`),
    body: [same(pub.venue)],
  })),
  ...talks.map((talk, i) => ({
    id: `talk-${i}`,
    category: 'talks' as const,
    title: same(talk.title),
    meta: join(join(talk.kind, same(talk.event)), join(talk.city, same(String(talk.year)))),
    body: [],
  })),
  ...media.map((item, i) => ({
    id: `media-${i}`,
    category: 'talks' as const,
    title: same(item.title),
    meta: join(join(item.kind, same(item.outlet)), item.when),
    body: item.detail ? [item.detail] : [],
  })),
  ...languages.map((lang, i) => ({
    id: `lang-${i}`,
    category: 'languages' as const,
    title: lang.name,
    meta: lang.level,
    body: [],
  })),
  ...interests.map((item, i) => ({
    id: `interest-${i}`,
    category: 'interests' as const,
    title: item,
    meta: { en: '', ar: '' },
    body: [],
  })),
];
