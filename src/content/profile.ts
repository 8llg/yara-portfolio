import type { Award, Certification, Highlight, Language, Media, Patent, Publication, Skill, T, Talk } from './types';

export const person = {
  latin: ['Yara', 'Saud', 'Al-Mansouri'],
  arabic: ['يارا', 'سعود', 'المنصوري'],
  fullName: { en: 'Dr. Yara Saud Al-Mansouri', ar: 'د. يارا سعود المنصوري' } as T,
  roles: [
    { en: 'Principal Product Engineer', ar: 'مهندسة منتجات رئيسية' },
    { en: 'Design Technology Lead', ar: 'قائدة تقنيات التصميم' },
    { en: 'HCI Researcher', ar: 'باحثة في التفاعل بين الإنسان والحاسب' },
  ] as T[],
  city: { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' } as T,
  summary: {
    en: 'Sixteen years building digital products in Saudi Arabia and the United Kingdom, across health tech, fintech, education and mobility. She leads teams from first research to launch while still designing and writing code every week.',
    ar: 'ستة عشر عامًا في بناء المنتجات الرقمية بين المملكة العربية السعودية والمملكة المتحدة، في التقنية الصحية والمالية والتعليم والتنقّل. تقود الفرق من أول بحث حتى الإطلاق، وما زالت تصمّم وتكتب الكود كل أسبوع.',
  } as T,
};

export const highlights: Highlight[] = [
  {
    figure: '16',
    label: { en: 'years of professional experience', ar: 'عامًا من الخبرة المهنية' },
    detail: { en: 'since July 2010', ar: 'منذ يوليو 2010' },
  },
  {
    figure: '40',
    suffix: '+',
    label: { en: 'products shipped', ar: 'منتجًا أُطلق' },
    detail: { en: 'health, finance, education, mobility', ar: 'الصحة والمال والتعليم والتنقّل' },
  },
  {
    figure: '9M',
    suffix: '+',
    label: { en: 'people reached', ar: 'شخص وصلت إليهم' },
    detail: { en: 'by the products she shipped', ar: 'عبر المنتجات التي أطلقتها' },
  },
  {
    figure: '64',
    label: { en: 'people led', ar: 'شخصًا تحت قيادتها' },
    detail: { en: 'across 7 squads', ar: 'في 7 فرق' },
  },
  {
    figure: '2',
    label: { en: 'startups co-founded', ar: 'شركتان ناشئتان شاركت في تأسيسهما' },
    detail: { en: 'one acquired, one closed', ar: 'واحدة استُحوذ عليها وأخرى أُغلقت' },
  },
  {
    figure: '2',
    label: { en: 'patents', ar: 'براءتا اختراع' },
    detail: { en: 'one granted, one pending', ar: 'واحدة ممنوحة وأخرى قيد الدراسة' },
  },
  {
    figure: '9',
    label: { en: 'publications', ar: 'منشورات علمية' },
    detail: { en: 'and 31 talks and keynotes', ar: 'و31 محاضرة وكلمة رئيسية' },
  },
  {
    figure: '1,400',
    suffix: '+',
    label: { en: 'university students taught', ar: 'طالب جامعي درّستهم' },
    detail: { en: 'over 10 semesters', ar: 'على مدى 10 فصول دراسية' },
  },
  {
    figure: '19',
    label: { en: 'certifications earned', ar: 'شهادة احترافية' },
    detail: { en: 'and one in progress', ar: 'وواحدة قيد الإنجاز' },
  },
];

export const skills: Skill[] = [
  { area: { en: 'Product Design', ar: 'تصميم المنتجات' }, level: 'expert', years: 18, tools: 'Figma, design systems, prototyping, motion design, information architecture' },
  { area: { en: 'Front-End Engineering', ar: 'هندسة الواجهات الأمامية' }, level: 'expert', years: 16, tools: 'TypeScript, JavaScript, React, Next.js, Vue, Tailwind CSS, Web Components' },
  { area: { en: 'User Research', ar: 'أبحاث المستخدمين' }, level: 'expert', years: 14, tools: 'Interviews, usability testing, diary studies, A/B testing, eye-tracking' },
  { area: { en: 'Accessibility', ar: 'إمكانية الوصول' }, level: 'expert', years: 11, tools: 'WCAG 2.2 AA, ARIA, screen-reader testing, Arabic right-to-left accessibility' },
  { area: { en: 'Back-End and APIs', ar: 'الخوادم والواجهات البرمجية' }, level: 'advanced', years: 10, tools: 'Node.js, NestJS, GraphQL, REST, PostgreSQL, Redis' },
  { area: { en: 'Leadership', ar: 'القيادة' }, level: 'expert', years: 9, tools: 'Hiring, organization design, OKRs, budgeting, stakeholder management, mentoring' },
  { area: { en: 'Mobile', ar: 'تطبيقات الجوال' }, level: 'advanced', years: 8, tools: 'React Native, Flutter, Swift (basic)' },
  { area: { en: 'Cloud and DevOps', ar: 'السحابة وDevOps' }, level: 'advanced', years: 7, tools: 'AWS, Google Cloud, Docker, Kubernetes, Terraform, GitHub Actions' },
  { area: { en: 'Security and Compliance', ar: 'الأمن والامتثال' }, level: 'intermediate', years: 6, tools: 'Secure development lifecycle, PCI DSS, health-data privacy, threat modelling' },
  { area: { en: 'Data and AI', ar: 'البيانات والذكاء الاصطناعي' }, level: 'intermediate', years: 5, tools: 'Python, SQL, data visualization, recommendation systems, AI product features' },
];

export const levelLabels: Record<Skill['level'], T> = {
  expert: { en: 'Expert', ar: 'خبيرة' },
  advanced: { en: 'Advanced', ar: 'متقدمة' },
  intermediate: { en: 'Intermediate', ar: 'متوسطة' },
};

export const languages: Language[] = [
  { code: 'ar', native: 'العربية', name: { en: 'Arabic', ar: 'العربية' }, level: { en: 'Native', ar: 'اللغة الأم' }, rank: 6 },
  { code: 'en', native: 'English', name: { en: 'English', ar: 'الإنجليزية' }, level: { en: 'Fluent (C2), IELTS 8.5', ar: 'بطلاقة (C2)، IELTS 8.5' }, rank: 6 },
  { code: 'fr', native: 'Français', name: { en: 'French', ar: 'الفرنسية' }, level: { en: 'Upper intermediate (B2), DELF B2', ar: 'فوق المتوسط (B2)، DELF B2' }, rank: 4 },
  { code: 'de', native: 'Deutsch', name: { en: 'German', ar: 'الألمانية' }, level: { en: 'Elementary (A2), from the exchange semester', ar: 'أساسي (A2)، من فصل التبادل الدراسي' }, rank: 2 },
  { code: 'tr', native: 'Türkçe', name: { en: 'Turkish', ar: 'التركية' }, level: { en: 'Beginner (A1), currently learning', ar: 'مبتدئ (A1)، تتعلّمها حاليًا' }, rank: 1 },
];

const active: T = { en: 'Active', ar: 'سارية' };
const lifetime: T = { en: 'Lifetime', ar: 'مدى الحياة' };

export const certifications: Certification[] = [
  { name: 'Certified Security Architecture Professional (CSAP)', issuer: 'Global Cyber Assurance Council', year: null, status: 'progress', detail: { en: 'In progress, exam booked for Dec 2026', ar: 'قيد الإنجاز، الاختبار محجوز في ديسمبر 2026' }, credential: null },
  { name: 'Certified Cloud Solutions Architect – Professional', issuer: 'Cloud Architecture Guild', year: 2025, status: 'active', detail: active, credential: 'CAG-CSA-25-0912' },
  { name: 'Certified Design Leader', issuer: 'Arabian Design Council', year: 2025, status: 'active', detail: active, credential: 'ADC-CDL-25-0044' },
  { name: 'Multi-Cloud Platform Architect', issuer: 'Halcyon Cloud Institute', year: 2024, status: 'active', detail: active, credential: 'HLC-MPA-24-3307' },
  { name: 'Certified Container Application Developer', issuer: 'Open Container Academy', year: 2024, status: 'active', detail: active, credential: 'OCA-CAD-24-1185' },
  { name: 'Open Banking Product Specialist', issuer: 'Gulf FinTech Academy', year: 2024, status: 'active', detail: active, credential: 'GFA-OBP-24-0219' },
  { name: 'Certified Project Leadership Professional', issuer: 'International Project Leadership Society', year: 2023, status: 'active', detail: active, credential: 'IPLS-CPL-23-5560' },
  { name: 'Certified Accessibility Specialist', issuer: 'Inclusive Interfaces Council', year: 2023, status: 'active', detail: active, credential: 'IIC-CAS-23-0471' },
  { name: 'Applied Data Visualization Certificate', issuer: 'Riyadh Data Institute', year: 2023, status: 'lifetime', detail: lifetime, credential: 'RDI-ADV-23-0118' },
  { name: 'UX Research and Interaction Design Certificate', issuer: 'Meridian UX Institute', year: 2022, status: 'lifetime', detail: lifetime, credential: 'MUI-UXR-22-8842' },
  { name: 'Enterprise Architecture Practitioner', issuer: 'Global Enterprise Architecture Forum', year: 2022, status: 'active', detail: active, credential: 'GEAF-EAP-22-0193' },
  { name: 'Certified Agile Product Owner', issuer: 'Agile Practice Council', year: 2022, status: 'expired', detail: { en: 'Expired 2024', ar: 'انتهت في 2024' }, credential: 'APC-APO-22-6620' },
  { name: 'Professional Scrum Facilitator, Level 1', issuer: 'Agile Delivery Institute', year: 2021, status: 'lifetime', detail: lifetime, credential: 'ADI-PSF-21-4410' },
  { name: 'Cloud Application Developer – Associate', issuer: 'Skyline Developer Program', year: 2021, status: 'expired', detail: { en: 'Expired 2023', ar: 'انتهت في 2023' }, credential: 'SDP-CAD-21-2075' },
  { name: 'IT Service Management Foundation', issuer: 'Service Excellence Board', year: 2020, status: 'lifetime', detail: lifetime, credential: 'SEB-ITSM-20-9931' },
  { name: 'Health Data Privacy Practitioner', issuer: 'Middle East Health Informatics Board', year: 2020, status: 'active', detail: active, credential: 'MEHIB-HDP-20-0306' },
  { name: 'Lean Six Sigma Green Belt', issuer: 'Institute for Process Excellence', year: 2019, status: 'lifetime', detail: lifetime, credential: 'IPE-LSS-19-1402' },
  { name: 'Security Fundamentals Professional', issuer: 'Cyber Readiness Academy', year: 2019, status: 'expired', detail: { en: 'Expired 2022', ar: 'انتهت في 2022' }, credential: 'CRA-SFP-19-7718' },
  { name: 'Usability Analysis Professional', issuer: 'Usability Practice Institute', year: 2016, status: 'lifetime', detail: lifetime, credential: 'UPI-UAP-16-0268' },
  { name: 'Advanced Motion Design for Interfaces', issuer: 'London School of Interface Craft', year: 2014, status: 'lifetime', detail: lifetime, credential: 'LSIC-MD-14-0052' },
];

export const certStatusLabels: Record<Certification['status'], T> = {
  active: { en: 'Active', ar: 'سارية' },
  lifetime: { en: 'Lifetime', ar: 'مدى الحياة' },
  expired: { en: 'Expired', ar: 'منتهية' },
  progress: { en: 'In progress', ar: 'قيد الإنجاز' },
};

export const awards: Award[] = [
  { year: 2025, title: { en: 'Design Technology Leader of the Year', ar: 'قائدة تقنيات التصميم للعام' }, body: 'Gulf Design Week Awards', reason: { en: 'For the Mizan Design System', ar: 'عن نظام التصميم ميزان' } },
  { year: 2024, title: { en: 'Best Fintech Experience', ar: 'أفضل تجربة تقنية مالية' }, body: 'Arab Fintech Excellence Awards', reason: { en: 'For Savings Goals', ar: 'عن أهداف الادخار' } },
  { year: 2023, title: { en: 'Top 40 Under 40 in Saudi Tech', ar: 'أبرز 40 تحت سن الأربعين في التقنية السعودية' }, body: 'Riyadh Tech Review', reason: { en: 'For career achievement', ar: 'عن مجمل الإنجاز المهني' } },
  { year: 2022, title: { en: 'Best Doctoral Thesis in HCI', ar: 'أفضل أطروحة دكتوراه في التفاعل بين الإنسان والحاسب' }, body: 'Eastmoor Institute of Technology', reason: { en: 'For the PhD thesis', ar: 'عن أطروحة الدكتوراه' } },
  { year: 2022, title: { en: 'Open Source Impact Award', ar: 'جائزة أثر المصادر المفتوحة' }, body: 'Arab Open Source Foundation', reason: { en: 'For Hirfa UI', ar: 'عن مكتبة حرفة' } },
  { year: 2021, title: { en: 'Digital Health Innovation Award', ar: 'جائزة الابتكار في الصحة الرقمية' }, body: 'Middle East Health Informatics Board', reason: { en: 'For the telemedicine platform', ar: 'عن منصة الطب الاتصالي' } },
  { year: 2020, title: { en: 'Women in Tech Leadership Award', ar: 'جائزة المرأة في القيادة التقنية' }, body: 'Saudi Women in Design Network', reason: { en: 'For leadership at Zayna Health Tech', ar: 'عن قيادتها في زينة للتقنية الصحية' } },
  { year: 2014, title: { en: 'Silver, Responsive Design category', ar: 'الفضية، فئة التصميم المتجاوب' }, body: 'London Web Craft Awards', reason: { en: 'For a retail client website at Brightwell Studio', ar: 'عن موقع لعميل تجزئة في استوديو برايتويل' } },
  { year: 2013, title: { en: 'Rising Star in UX', ar: 'نجم صاعد في تجربة المستخدم' }, body: 'UK Interaction Design Guild', reason: { en: 'For a public-sector client website at Brightwell Studio', ar: 'عن موقع لعميل حكومي في استوديو برايتويل' } },
  { year: 2010, title: { en: 'Best Graduation Project', ar: 'أفضل مشروع تخرج' }, body: 'Najd Valley University', reason: { en: 'For an Arabic speech-to-text note-taking app', ar: 'عن تطبيق تدوين بتحويل الكلام العربي إلى نص' } },
];

export const patents: Patent[] = [
  {
    title: { en: 'Method for adaptive Arabic text rendering based on reading context', ar: 'طريقة لعرض النص العربي تكيّفيًا بحسب سياق القراءة' },
    number: 'Patent No. SA 11223',
    status: { en: 'Granted Jun 2024', ar: 'مُنحت في يونيو 2024' },
  },
  {
    title: { en: 'System for bilingual component theming in design systems', ar: 'نظام لتنسيق سمات المكوّنات ثنائية اللغة في أنظمة التصميم' },
    number: 'Application No. SA 2025-0417',
    status: { en: 'Filed Mar 2025, pending', ar: 'قُدّمت في مارس 2025، قيد الدراسة' },
  },
];

export const publications: Publication[] = [
  { authors: 'Al-Mansouri, Y., & Marsh, H.', year: 2022, title: 'Adaptive typography for Arabic interfaces: A study with 312 readers', venue: 'Journal of Human-Centred Computing, 14(3), 211–238' },
  { authors: 'Al-Mansouri, Y.', year: 2021, title: 'Trust signals in Arabic health apps', venue: 'Proceedings of the International Conference on Arabic Interfaces (ICAI 2021), 45–56' },
  { authors: 'Al-Mansouri, Y., Rahman, S., & Okafor, T.', year: 2020, title: 'Right-to-left design systems at scale', venue: 'Proceedings of DesignOps Summit Asia 2020, 12–19' },
  { authors: 'Al-Mansouri, Y., & Marsh, H.', year: 2020, title: 'Measuring reading comfort on small screens', venue: 'ICAI 2020 Workshop on Arabic Typography, 8–13' },
  { authors: 'Al-Mansouri, Y.', year: 2019, title: 'Teaching front-end development in Arabic: Lessons from 50,000 learners', venue: 'Gulf Journal of Computing Education, 7(1), 33–49' },
  { authors: 'Hart, L., & Al-Mansouri, Y.', year: 2012, title: 'Bilingual navigation menus on small screens', venue: 'Northbridge Interaction Lab Technical Report NIL-TR-2012-07' },
];

const keynote: T = { en: 'Keynote', ar: 'كلمة رئيسية' };
const talk: T = { en: 'Talk', ar: 'محاضرة' };
const panel: T = { en: 'Panel', ar: 'جلسة حوارية' };

export const talks: Talk[] = [
  { year: 2025, kind: keynote, title: 'Design systems that speak two languages', event: 'Najd Developer Days 2025', city: { en: 'Riyadh', ar: 'الرياض' } },
  { year: 2025, kind: talk, title: 'Accessibility is a product decision', event: 'Gulf Design Week 2025', city: { en: 'Dubai', ar: 'دبي' } },
  { year: 2024, kind: panel, title: 'Building trust in fintech UX', event: 'Gulf Fintech Builders Forum 2024', city: { en: 'Riyadh', ar: 'الرياض' } },
  { year: 2023, kind: talk, title: 'Scaling a team from 6 to 64', event: 'Engineering Leadership Week 2023', city: { en: 'Cairo', ar: 'القاهرة' } },
  { year: 2022, kind: talk, title: 'What my PhD taught me about Arabic type', event: 'Typography Majlis 2022', city: { en: 'Jeddah', ar: 'جدة' } },
  { year: 2021, kind: keynote, title: 'Telemedicine at national scale', event: 'Digital Health Middle East Summit 2021', city: { en: 'Online', ar: 'عبر الإنترنت' } },
  { year: 2016, kind: talk, title: 'Why our startup failed', event: 'Founders Night Riyadh 2016', city: { en: 'Riyadh', ar: 'الرياض' } },
  { year: 2014, kind: talk, title: 'Responsive design for right-to-left', event: 'Frontend Horizons London 2014', city: { en: 'London', ar: 'لندن' } },
];

export const media: Media[] = [
  { kind: { en: 'Cover story', ar: 'قصة الغلاف' }, title: 'The engineer who designs in two directions', outlet: 'Riyadh Tech Review', when: { en: 'Mar 2023', ar: 'مارس 2023' } },
  { kind: { en: 'Podcast guest', ar: 'ضيفة بودكاست' }, title: 'From startup failure to Principal Engineer', outlet: 'Build in Arabic, Episode 42', when: { en: 'Jun 2024', ar: 'يونيو 2024' } },
  { kind: { en: 'YouTube channel', ar: 'قناة يوتيوب' }, title: 'Yara Builds', outlet: 'YouTube', when: { en: '2020 – Present', ar: '2020 – الآن' }, detail: { en: '86 tutorials on design systems and right-to-left front-end · 48,000 subscribers', ar: '86 درسًا في أنظمة التصميم وواجهات اليمين إلى اليسار · 48,000 مشترك' } },
  { kind: { en: 'Article', ar: 'مقال' }, title: 'Accessibility debt in fintech', outlet: 'Medium', when: { en: 'Nov 2023', ar: 'نوفمبر 2023' }, detail: { en: 'Read 120,000 times', ar: 'قُرئ 120,000 مرة' } },
];

export const community: { figure: string; label: T }[] = [
  { figure: '1,400+', label: { en: 'university students taught HCI, front-end development and design systems', ar: 'طالب جامعي درسوا معها التفاعل بين الإنسان والحاسب وتطوير الواجهات وأنظمة التصميم' } },
  { figure: '60', label: { en: 'early-career designers in the annual mentorship program she runs', ar: 'مصممًا ومصممة في بداية مسيرتهم ضمن برنامج الإرشاد السنوي الذي تديره' } },
  { figure: '25', label: { en: 'startups mentored across 6 accelerator cohorts', ar: 'شركة ناشئة أرشدتها عبر 6 دفعات في المسرّعة' } },
  { figure: '12', label: { en: 'hackathons judged in Riyadh, Jeddah and Dubai', ar: 'هاكاثونًا حكّمتها في الرياض وجدة ودبي' } },
  { figure: '86', label: { en: 'tutorials on Yara Builds, watched by 48,000 subscribers', ar: 'درسًا على قناة Yara Builds يتابعها 48,000 مشترك' } },
  { figure: '45', label: { en: 'adult learners taught to build for the web, as a volunteer', ar: 'متعلمًا بالغًا تعلّموا معها بناء الويب تطوعًا' } },
];

export const interests: T[] = [
  { en: 'Arabic calligraphy, with work shown in 2 group exhibitions', ar: 'الخط العربي، وعُرضت أعمالها في معرضين جماعيين' },
  { en: 'Long-distance running: 3 half marathons', ar: 'الجري لمسافات طويلة: 3 أنصاف ماراثون' },
  { en: 'Restoring old film cameras', ar: 'ترميم كاميرات الأفلام القديمة' },
  { en: 'Chess, with an online rating of 1,850', ar: 'الشطرنج، بتصنيف 1,850 عبر الإنترنت' },
];

export const contact = {
  email: 'yara.almansouri@mail.example',
  phone: '+966 55 000 0000',
  links: [
    ['Portfolio', 'yara.example'],
    ['LinkedIn', 'linkedin.example/in/yaramansouri'],
    ['GitHub', 'github.example/yara-mansouri'],
    ['Dribbble', 'dribbble.example/yaram'],
    ['Behance', 'behance.example/yaram'],
    ['Medium', 'medium.example/@yaram'],
    ['Google Scholar', 'scholar.example/yaram'],
    ['YouTube', 'youtube.example/@YaraBuilds'],
  ] as const,
};
