import type { CareerEntry, T, TrackId } from './types';

const riyadh: T = { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' };
const london: T = { en: 'London, United Kingdom', ar: 'لندن، المملكة المتحدة' };
const northbridge: T = { en: 'Northbridge, United Kingdom', ar: 'نورثبريدج، المملكة المتحدة' };
const remote: T = { en: 'Part-time, remote', ar: 'دوام جزئي، عن بُعد' };
const online: T = { en: 'Online', ar: 'عبر الإنترنت' };

export const tracks: { id: TrackId; label: T; lanes: number }[] = [
  { id: 'work', label: { en: 'Industry', ar: 'العمل المهني' }, lanes: 1 },
  { id: 'venture', label: { en: 'Ventures & open source', ar: 'الريادة والمصادر المفتوحة' }, lanes: 3 },
  { id: 'study', label: { en: 'Study & research', ar: 'الدراسة والبحث' }, lanes: 2 },
  { id: 'community', label: { en: 'Teaching & community', ar: 'التعليم والمجتمع' }, lanes: 5 },
];

export const timelineStart = '2006-09';

export const career: CareerEntry[] = [
  {
    id: 'freelance',
    track: 'work',
    lane: 0,
    start: '2008-09',
    end: '2010-06',
    title: { en: 'Freelance Graphic and Web Designer (part-time)', ar: 'مصممة جرافيك وويب مستقلة (دوام جزئي)' },
    org: { en: 'Self-employed', ar: 'عمل حر' },
    place: riyadh,
    bullets: [
      {
        en: 'Designed logos, printed material and websites for 35 clients while at university.',
        ar: 'صممت شعارات ومطبوعات ومواقع إلكترونية لـ35 عميلًا خلال سنوات الجامعة.',
      },
    ],
  },
  {
    id: 'mirqab',
    track: 'work',
    lane: 0,
    start: '2010-07',
    end: '2011-08',
    title: { en: 'Junior Web Developer', ar: 'مطوّرة ويب مبتدئة' },
    org: { en: 'Mirqab Digital Agency', ar: 'وكالة مرقاب الرقمية' },
    place: riyadh,
    bullets: [
      {
        en: 'Built more than 20 websites in HTML, CSS, jQuery and PHP for local businesses and event organizers.',
        ar: 'بنت أكثر من 20 موقعًا بلغات HTML وCSS وjQuery وPHP لشركات محلية ومنظّمي فعاليات.',
      },
    ],
  },
  {
    id: 'brightwell',
    track: 'work',
    lane: 0,
    start: '2012-10',
    end: '2014-05',
    title: { en: 'UX Engineer', ar: 'مهندسة تجربة مستخدم' },
    org: { en: 'Brightwell Studio', ar: 'استوديو برايتويل' },
    place: london,
    bullets: [
      {
        en: 'Designed and built responsive websites for 14 clients in retail, banking and the public sector.',
        ar: 'صممت وبنت مواقع متجاوبة لـ14 عميلًا في قطاعات التجزئة والمصارف والقطاع العام.',
      },
      {
        en: 'Delivered 2 projects that won industry awards.',
        ar: 'سلّمت مشروعين فازا بجوائز في القطاع.',
      },
    ],
  },
  {
    id: 'brightwell-senior',
    track: 'work',
    lane: 0,
    start: '2014-06',
    end: '2015-03',
    title: { en: 'Senior UX Engineer', ar: 'مهندسة تجربة مستخدم أولى' },
    org: { en: 'Brightwell Studio', ar: 'استوديو برايتويل' },
    place: london,
    bullets: [
      {
        en: "Led the studio's first Arabic, right-to-left project, for a Gulf travel client.",
        ar: 'قادت أول مشروع عربي من اليمين إلى اليسار في الاستوديو، لعميل خليجي في قطاع السفر.',
      },
      {
        en: "Mentored 3 junior designers and ran the studio's monthly front-end guild.",
        ar: 'أرشدت 3 مصممين مبتدئين، وأدارت الملتقى الشهري لتطوير الواجهات في الاستوديو.',
      },
    ],
  },
  {
    id: 'break',
    track: 'work',
    lane: 0,
    start: '2017-01',
    end: '2017-06',
    pause: true,
    title: { en: 'Career Break', ar: 'استراحة مهنية' },
    org: { en: 'Family relocation and volunteering', ar: 'انتقال عائلي وعمل تطوعي' },
    place: riyadh,
    bullets: [
      { en: 'Family relocation and volunteering.', ar: 'انتقال عائلي وعمل تطوعي.' },
      {
        en: 'Taught a 12-week web development course to 45 adult learners with the Code for Community initiative.',
        ar: 'درّست دورة في تطوير الويب مدتها 12 أسبوعًا لـ45 متعلمًا بالغًا ضمن مبادرة Code for Community.',
      },
    ],
  },
  {
    id: 'zayna-frontend',
    track: 'work',
    lane: 0,
    start: '2017-07',
    end: '2018-12',
    title: { en: 'Senior Front-End Engineer', ar: 'مهندسة واجهات أمامية أولى' },
    org: { en: 'Zayna Health Tech', ar: 'زينة للتقنية الصحية' },
    place: riyadh,
    bullets: [
      {
        en: "Rebuilt the clinic dashboard in React, cutting doctors' average task time by 27%.",
        ar: 'أعادت بناء لوحة العيادة بتقنية React، فانخفض متوسط وقت إنجاز المهام لدى الأطباء بنسبة 27%.',
      },
      {
        en: 'Created the first shared component library, which later grew into the Zayna design system.',
        ar: 'أنشأت أول مكتبة مكوّنات مشتركة، وتطوّرت لاحقًا إلى نظام التصميم في زينة.',
      },
    ],
    metrics: [
      { kind: 'figure', label: { en: "shorter average task time for doctors", ar: 'أقل في متوسط وقت مهام الأطباء' }, value: { en: '27%', ar: '27%' } },
    ],
  },
  {
    id: 'zayna-manager',
    track: 'work',
    lane: 0,
    start: '2019-01',
    end: '2021-02',
    title: { en: 'Engineering Manager, Patient Apps', ar: 'مديرة الهندسة، تطبيقات المرضى' },
    org: { en: 'Zayna Health Tech', ar: 'زينة للتقنية الصحية' },
    place: riyadh,
    bullets: [
      {
        en: 'Grew the patient apps team from 6 to 22 people; hired and mentored 4 team leads.',
        ar: 'نمّت فريق تطبيقات المرضى من 6 إلى 22 شخصًا، ووظّفت 4 قادة فرق وأرشدتهم.',
      },
      {
        en: 'Shipped appointment booking used by 1.8 million patients across 140 clinics.',
        ar: 'أطلقت خدمة حجز المواعيد التي استخدمها 1.8 مليون مريض في 140 عيادة.',
      },
      {
        en: 'Shortened the release cycle from 6 weeks to 1 week with CI/CD and feature flags.',
        ar: 'قلّصت دورة الإصدار من 6 أسابيع إلى أسبوع واحد بالتكامل والنشر المستمرين ومفاتيح الميزات.',
      },
    ],
    metrics: [
      {
        kind: 'shift',
        label: { en: 'Release cycle', ar: 'دورة الإصدار' },
        from: 6,
        to: 1,
        max: 6,
        fromText: { en: '6 weeks', ar: '6 أسابيع' },
        toText: { en: '1 week', ar: 'أسبوع' },
        better: 'down',
      },
      {
        kind: 'shift',
        label: { en: 'Patient apps team', ar: 'فريق تطبيقات المرضى' },
        from: 6,
        to: 22,
        max: 24,
        fromText: { en: '6 people', ar: '6 أشخاص' },
        toText: { en: '22 people', ar: '22 شخصًا' },
        better: 'up',
      },
    ],
  },
  {
    id: 'zayna-director',
    track: 'work',
    lane: 0,
    start: '2021-03',
    end: '2023-08',
    title: { en: 'Director of Product Engineering', ar: 'مديرة هندسة المنتجات' },
    org: { en: 'Zayna Health Tech', ar: 'زينة للتقنية الصحية' },
    place: riyadh,
    bullets: [
      {
        en: 'Led 64 people across 7 squads (engineering, design, quality and data) with an annual budget of SAR 21 million.',
        ar: 'قادت 64 شخصًا في 7 فرق (الهندسة والتصميم والجودة والبيانات) بميزانية سنوية قدرها 21 مليون ريال.',
      },
      {
        en: 'Launched the telemedicine platform at national scale, delivering 3.1 million consultations in 2022.',
        ar: 'أطلقت منصة الطب الاتصالي على المستوى الوطني، وقدّمت 3.1 مليون استشارة في عام 2022.',
      },
      {
        en: 'Cut the app crash rate from 2.4% to 0.3% and raised the app-store rating from 3.6 to 4.7.',
        ar: 'خفّضت معدل أعطال التطبيق من 2.4% إلى 0.3%، ورفعت تقييمه في متجر التطبيقات من 3.6 إلى 4.7.',
      },
      {
        en: 'Took the platform through two health-data security audits with zero major findings.',
        ar: 'اجتازت المنصة تدقيقَين لأمن البيانات الصحية دون أي ملاحظة جوهرية.',
      },
    ],
    tech: ['React', 'React Native', 'Node.js', 'PostgreSQL', 'Google Cloud', 'Kubernetes'],
    metrics: [
      {
        kind: 'shift',
        label: { en: 'App crash rate', ar: 'معدل أعطال التطبيق' },
        from: 2.4,
        to: 0.3,
        max: 2.6,
        fromText: { en: '2.4%', ar: '2.4%' },
        toText: { en: '0.3%', ar: '0.3%' },
        better: 'down',
      },
      {
        kind: 'shift',
        label: { en: 'App-store rating (out of 5)', ar: 'تقييم المتجر (من 5)' },
        from: 3.6,
        to: 4.7,
        max: 5,
        fromText: { en: '3.6', ar: '3.6' },
        toText: { en: '4.7', ar: '4.7' },
        better: 'up',
      },
    ],
  },
  {
    id: 'faseela',
    track: 'work',
    lane: 0,
    start: '2023-09',
    end: null,
    title: { en: 'Principal Product Engineer & Design Technology Lead', ar: 'مهندسة منتجات رئيسية وقائدة تقنيات التصميم' },
    org: { en: 'Faseela Ventures', ar: 'فسيلة فنتشرز' },
    place: riyadh,
    bullets: [
      {
        en: 'Set the front-end and design-system direction for 9 product teams across payments, savings and rewards in a fintech super-app with 4.2 million users.',
        ar: 'تحدد توجّه الواجهات الأمامية ونظام التصميم لـ9 فرق منتجات في المدفوعات والادخار والمكافآت، ضمن تطبيق مالي شامل يستخدمه 4.2 مليون شخص.',
      },
      {
        en: "Built Mizan, the company's bilingual design system: 180 components adopted by all 9 teams, cutting UI build time by 38%.",
        ar: 'بنت «ميزان»، نظام التصميم ثنائي اللغة للشركة: 180 مكوّنًا اعتمدتها الفرق التسعة، وقلّص وقت بناء الواجهات بنسبة 38%.',
      },
      {
        en: 'Led the rebuild of the web app in Next.js and TypeScript, reducing Largest Contentful Paint from 4.8 s to 1.6 s.',
        ar: 'قادت إعادة بناء تطبيق الويب بـNext.js وTypeScript، فانخفض زمن عرض أكبر عنصر (LCP) من 4.8 إلى 1.6 ثانية.',
      },
      {
        en: 'Introduced accessibility reviews for every release, raising screens that meet WCAG 2.2 AA from 41% to 96%.',
        ar: 'أدخلت مراجعات إمكانية الوصول في كل إصدار، فارتفعت نسبة الشاشات المطابقة لمعيار WCAG 2.2 AA من 41% إلى 96%.',
      },
      {
        en: 'Designed the Savings Goals feature from research in 5 cities; 610,000 users opened a goal in its first 6 months.',
        ar: 'صممت ميزة «أهداف الادخار» انطلاقًا من بحث في 5 مدن، وفتح 610,000 مستخدم هدفًا خلال أشهرها الستة الأولى.',
      },
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React Native', 'GraphQL', 'AWS'],
    metrics: [
      {
        kind: 'shift',
        label: { en: 'Largest Contentful Paint', ar: 'زمن عرض أكبر عنصر (LCP)' },
        from: 4.8,
        to: 1.6,
        max: 5,
        fromText: { en: '4.8 s', ar: '4.8 ث' },
        toText: { en: '1.6 s', ar: '1.6 ث' },
        better: 'down',
      },
      {
        kind: 'shift',
        label: { en: 'Screens meeting WCAG 2.2 AA', ar: 'الشاشات المطابقة لـWCAG 2.2 AA' },
        from: 41,
        to: 96,
        max: 100,
        fromText: { en: '41%', ar: '41%' },
        toText: { en: '96%', ar: '96%' },
        better: 'up',
      },
    ],
  },
  {
    id: 'rafeeq',
    track: 'venture',
    lane: 0,
    start: '2015-04',
    end: '2016-12',
    title: { en: 'Co-founder & Chief Technology Officer', ar: 'شريكة مؤسسة ورئيسة التقنية' },
    org: { en: 'Rafeeq Rides', ar: 'رفيق رايدز' },
    place: riyadh,
    bullets: [
      {
        en: 'Built a ride-sharing app for university students: 26,000 sign-ups and 140,000 rides in 20 months.',
        ar: 'بنت تطبيق توصيل مشترك لطلاب الجامعات: 26,000 تسجيل و140,000 رحلة خلال 20 شهرًا.',
      },
      {
        en: 'Raised SAR 3.5 million in seed funding and led a team of 11.',
        ar: 'جمعت 3.5 مليون ريال في جولة التمويل التأسيسية، وقادت فريقًا من 11 شخصًا.',
      },
      {
        en: 'Closed the company in Dec 2016 after a market change and wrote a public post-mortem read by 80,000 people.',
        ar: 'أغلقت الشركة في ديسمبر 2016 بعد تغيّر في السوق، وكتبت تحليلًا علنيًا لأسباب الإغلاق قرأه 80,000 شخص.',
      },
    ],
    tech: ['React Native', 'Node.js', 'MongoDB', 'Google Maps APIs'],
  },
  {
    id: 'qalam',
    track: 'venture',
    lane: 0,
    start: '2019-02',
    end: '2022-11',
    title: { en: 'Co-founder (part-time)', ar: 'شريكة مؤسسة (دوام جزئي)' },
    org: { en: 'Qalam Learn', ar: 'قلم ليرن' },
    place: riyadh,
    bullets: [
      {
        en: 'Co-founded an Arabic-first coding education platform that reached 230,000 learners in 14 countries.',
        ar: 'شاركت في تأسيس منصة لتعليم البرمجة بالعربية أولًا، وصلت إلى 230,000 متعلم في 14 دولة.',
      },
      {
        en: 'Designed and built its interactive code editor, which explains errors in plain Arabic.',
        ar: 'صممت وبنت محرّر الأكواد التفاعلي للمنصة، الذي يشرح الأخطاء بعربية واضحة.',
      },
      {
        en: 'Grew the team to 9 people and led product until the company was acquired by Mirqab Group in Nov 2022.',
        ar: 'نمّت الفريق إلى 9 أشخاص وقادت المنتج حتى استحوذت مجموعة مرقاب على الشركة في نوفمبر 2022.',
      },
    ],
    tech: ['Vue', 'TypeScript', 'Monaco Editor', 'Firebase'],
  },
  {
    id: 'hirfa',
    track: 'venture',
    lane: 1,
    start: '2020-03',
    end: null,
    title: { en: 'Founder and lead maintainer', ar: 'المؤسسة والمشرفة الرئيسية' },
    org: { en: 'Hirfa UI (open source)', ar: 'حرفة (مفتوح المصدر)' },
    place: { en: '210 contributors', ar: '210 مساهمين' },
    bullets: [
      {
        en: '95 components with mirrored layouts, Arabic typography presets and full keyboard support.',
        ar: '95 مكوّنًا بتخطيطات معكوسة وإعدادات للطباعة العربية ودعم كامل للوحة المفاتيح.',
      },
      {
        en: '9,800 GitHub stars and 1.2 million npm downloads a year; Open Source Impact Award 2022.',
        ar: '9,800 نجمة على GitHub و1.2 مليون تنزيل سنويًا، وجائزة أثر المصادر المفتوحة 2022.',
      },
    ],
    tech: ['React', 'TypeScript', 'CSS logical properties', 'Storybook'],
  },
  {
    id: 'dalil',
    track: 'venture',
    lane: 2,
    start: '2022-01',
    end: '2022-09',
    title: { en: 'Designer and developer (solo)', ar: 'مصممة ومطوّرة (بمفردها)' },
    org: { en: 'Dalil Accessibility Toolkit', ar: 'دليل لإمكانية الوصول' },
    place: { en: 'Side project', ar: 'مشروع جانبي' },
    bullets: [
      {
        en: 'A browser extension that flags 42 Arabic-specific accessibility issues, used by 3,400 developers in 22 countries.',
        ar: 'إضافة للمتصفح ترصد 42 مشكلة وصول خاصة بالعربية، يستخدمها 3,400 مطوّر في 22 دولة.',
      },
    ],
    tech: ['JavaScript', 'Chrome Extensions API', 'axe-core'],
  },
  {
    id: 'bsc',
    track: 'study',
    lane: 0,
    start: '2006-09',
    end: '2010-06',
    title: { en: 'BSc in Computer Science, First Class Honours', ar: 'بكالوريوس علوم الحاسب، مرتبة الشرف الأولى' },
    org: { en: 'Najd Valley University', ar: 'جامعة وادي نجد' },
    place: riyadh,
    bullets: [
      { en: 'GPA: 4.81 / 5.00', ar: 'المعدل التراكمي: 4.81 من 5.00' },
      {
        en: 'Exchange semester: Lindenhall University, Germany, Feb 2009 – Jul 2009.',
        ar: 'فصل تبادل دراسي: جامعة ليندنهال، ألمانيا، فبراير – يوليو 2009.',
      },
      {
        en: 'Best Graduation Project, 2010, for an Arabic speech-to-text note-taking app.',
        ar: 'جائزة أفضل مشروع تخرج 2010، عن تطبيق لتدوين الملاحظات بتحويل الكلام العربي إلى نص.',
      },
    ],
  },
  {
    id: 'msc',
    track: 'study',
    lane: 0,
    start: '2011-09',
    end: '2012-09',
    title: { en: 'MSc in Interaction Design, with Distinction', ar: 'ماجستير تصميم التفاعل، بامتياز' },
    org: { en: 'University of Northbridge', ar: 'جامعة نورثبريدج' },
    place: northbridge,
    bullets: [
      {
        en: 'Dissertation: “Bilingual Navigation Menus on Small Screens”.',
        ar: 'رسالة الماجستير: «قوائم التنقل ثنائية اللغة على الشاشات الصغيرة».',
      },
      { en: 'Full scholarship.', ar: 'منحة دراسية كاملة.' },
    ],
  },
  {
    id: 'research-assistant',
    track: 'study',
    lane: 1,
    start: '2012-01',
    end: '2012-09',
    title: { en: 'Research Assistant (part-time)', ar: 'مساعدة باحث (دوام جزئي)' },
    org: { en: 'University of Northbridge, Interaction Lab', ar: 'جامعة نورثبريدج، مختبر التفاعل' },
    place: northbridge,
    bullets: [
      {
        en: 'Ran 30 usability sessions for a study on bilingual navigation menus and co-authored a technical report.',
        ar: 'أدارت 30 جلسة اختبار قابلية استخدام لدراسة عن قوائم التنقل ثنائية اللغة، وشاركت في تأليف تقرير تقني.',
      },
    ],
  },
  {
    id: 'phd',
    track: 'study',
    lane: 0,
    start: '2018-09',
    end: '2022-07',
    title: { en: 'PhD in Human-Computer Interaction', ar: 'دكتوراه في التفاعل بين الإنسان والحاسب' },
    org: { en: 'Eastmoor Institute of Technology', ar: 'معهد إيستمور للتقنية' },
    place: remote,
    bullets: [
      {
        en: 'Thesis: “Adaptive Typography for Arabic Interfaces: Readability, Density and Trust”.',
        ar: 'الأطروحة: «الطباعة التكيّفية للواجهات العربية: المقروئية والكثافة والثقة».',
      },
      { en: 'Best Doctoral Thesis in HCI, 2022.', ar: 'جائزة أفضل أطروحة دكتوراه في التفاعل بين الإنسان والحاسب 2022.' },
    ],
  },
  {
    id: 'executive',
    track: 'study',
    lane: 1,
    start: '2021-01',
    end: '2021-06',
    title: { en: 'Executive Certificate in Technology Leadership', ar: 'شهادة تنفيذية في القيادة التقنية' },
    org: { en: 'Eastmoor Business School', ar: 'كلية إيستمور للأعمال' },
    place: online,
    bullets: [
      {
        en: '6-month program completed while working full-time.',
        ar: 'برنامج مدته 6 أشهر أكملته إلى جانب العمل بدوام كامل.',
      },
    ],
  },
  {
    id: 'volunteer',
    track: 'community',
    lane: 0,
    start: '2017-01',
    end: '2017-06',
    title: { en: 'Volunteer Instructor', ar: 'مدرّبة متطوعة' },
    org: { en: 'Code for Community', ar: 'Code for Community' },
    place: riyadh,
    bullets: [
      {
        en: 'Taught a 12-week web development course to 45 adult learners.',
        ar: 'درّست دورة في تطوير الويب مدتها 12 أسبوعًا لـ45 متعلمًا بالغًا.',
      },
    ],
  },
  {
    id: 'judge',
    track: 'community',
    lane: 1,
    start: '2018-01',
    end: null,
    title: { en: 'Hackathon Judge', ar: 'محكّمة هاكاثونات' },
    org: { en: 'Various organizers', ar: 'جهات منظّمة متعددة' },
    place: { en: 'Riyadh, Jeddah and Dubai', ar: 'الرياض وجدة ودبي' },
    bullets: [
      {
        en: 'Judged 12 hackathons in Riyadh, Jeddah and Dubai.',
        ar: 'حكّمت 12 هاكاثونًا في الرياض وجدة ودبي.',
      },
    ],
  },
  {
    id: 'lecturer',
    track: 'community',
    lane: 0,
    start: '2019-09',
    end: '2024-06',
    title: { en: 'Adjunct Lecturer (part-time)', ar: 'محاضرة متعاونة (دوام جزئي)' },
    org: { en: 'College of Computing, Najd Valley University', ar: 'كلية الحوسبة، جامعة وادي نجد' },
    place: riyadh,
    bullets: [
      {
        en: 'Taught Human-Computer Interaction, Front-End Development and Design Systems to 1,400+ students over 10 semesters.',
        ar: 'درّست التفاعل بين الإنسان والحاسب وتطوير الواجهات الأمامية وأنظمة التصميم لأكثر من 1,400 طالب على مدى 10 فصول دراسية.',
      },
    ],
  },
  {
    id: 'mentor',
    track: 'community',
    lane: 2,
    start: '2020-01',
    end: null,
    title: { en: 'Mentor', ar: 'مرشدة' },
    org: { en: 'Najd Valley Startup Accelerator', ar: 'مسرّعة وادي نجد للشركات الناشئة' },
    place: riyadh,
    bullets: [{ en: 'Mentored 25 startups across 6 cohorts.', ar: 'أرشدت 25 شركة ناشئة عبر 6 دفعات.' }],
  },
  {
    id: 'advisory',
    track: 'community',
    lane: 3,
    start: '2022-03',
    end: null,
    title: { en: 'Advisory Board Member', ar: 'عضوة المجلس الاستشاري' },
    org: { en: 'Saudi Women in Design Network', ar: 'شبكة السعوديات في التصميم' },
    place: riyadh,
    bullets: [
      {
        en: 'Runs the annual mentorship program for 60 early-career designers.',
        ar: 'تدير برنامج الإرشاد السنوي لـ60 مصممًا ومصممة في بداية مسيرتهم.',
      },
    ],
  },
  {
    id: 'advisor',
    track: 'community',
    lane: 4,
    start: '2024-02',
    end: null,
    title: { en: 'Technical Advisor', ar: 'مستشارة تقنية' },
    org: { en: '2 early-stage health-tech startups', ar: 'شركتان ناشئتان في التقنية الصحية' },
    place: riyadh,
    bullets: [
      {
        en: 'Advises on product strategy, hiring and architecture.',
        ar: 'تقدّم المشورة في استراتيجية المنتج والتوظيف والبنية التقنية.',
      },
    ],
  },
];
