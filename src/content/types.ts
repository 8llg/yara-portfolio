export type Locale = 'en' | 'ar';

export interface T {
  en: string;
  ar: string;
}

export interface ShiftMetric {
  kind: 'shift';
  label: T;
  from: number;
  to: number;
  max: number;
  fromText: T;
  toText: T;
  better: 'up' | 'down';
}

export interface FigureMetric {
  kind: 'figure';
  label: T;
  value: T;
}

export type Metric = ShiftMetric | FigureMetric;

export type YearMonth = `${number}-${number}${number}`;

export interface Project {
  id: string;
  name: T;
  mark: { latin: string; arabic: string };
  org: T;
  start: YearMonth;
  end: YearMonth | null;
  role: T;
  team: T;
  problem: T;
  action: T;
  result: T;
  tech: string[];
  metrics: Metric[];
  aside?: T;
}

export type TrackId = 'work' | 'venture' | 'study' | 'community';

export interface CareerEntry {
  id: string;
  track: TrackId;
  lane: number;
  start: YearMonth;
  end: YearMonth | null;
  title: T;
  org: T;
  place: T;
  bullets: T[];
  tech?: string[];
  metrics?: Metric[];
  pause?: boolean;
}

export interface Skill {
  area: T;
  level: 'expert' | 'advanced' | 'intermediate';
  years: number;
  tools: string;
}

export interface Language {
  code: string;
  native: string;
  name: T;
  level: T;
  rank: number;
}

export type CertStatus = 'active' | 'lifetime' | 'expired' | 'progress';

export interface Certification {
  name: string;
  issuer: string;
  year: number | null;
  status: CertStatus;
  detail: T;
  credential: string | null;
}

export interface Award {
  year: number;
  title: T;
  body: string;
  reason: T;
}

export interface Talk {
  year: number;
  kind: T;
  title: string;
  event: string;
  city: T;
}

export interface Media {
  kind: T;
  title: string;
  outlet: string;
  when: T;
  detail?: T;
}

export interface Publication {
  authors: string;
  year: number;
  title: string;
  venue: string;
}

export interface Patent {
  title: T;
  number: string;
  status: T;
}

export interface Highlight {
  figure: string;
  suffix?: string;
  label: T;
  detail: T;
}
