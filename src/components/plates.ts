import { html, type Markup } from '../lib/html';

const C = {
  ground: '#271c21',
  line: '#4a3a41',
  bone: '#ebe4dc',
  dim: '#a8999f',
  saffron: '#d9a441',
};

const rhombus = (cx: number, cy: number, r: number) => `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;

function frame(body: Markup, label: string): Markup {
  return html`<svg class="plate" viewBox="0 0 480 360" direction="ltr" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">
    <rect width="480" height="360" fill="${C.ground}" />
    ${body}
  </svg>`;
}

function mizan(): Markup {
  const greens = ['#24533f', '#2b6249', '#2f6b4f', '#367756', '#3d835e', '#468e67', '#519a72', '#5ea67e', '#6db28b', '#7ebe99', '#90c9a8'];
  const items = greens.map((color, i) => {
    const angle = (-70 + i * 14) * (Math.PI / 180);
    const x = 150 + Math.cos(angle) * 110 - 40;
    const y = 180 + Math.sin(angle) * 120;
    return html`<line x1="${x.toFixed(1)}" y1="${y.toFixed(1)}" x2="352" y2="180" stroke="${C.line}" stroke-width="1" />
      <polygon points="${rhombus(x, y, 13)}" fill="${color}" />`;
  });
  return frame(
    html`${items}<polygon points="${rhombus(352, 180, 54)}" fill="#3d835e" /><polygon points="${rhombus(352, 180, 66)}" fill="none" stroke="${C.saffron}" stroke-width="1.5" />
      <text x="352" y="290" fill="${C.dim}" font-size="15" text-anchor="middle" font-family="Readex Pro Variable, sans-serif">11 → 1</text>`,
    'Eleven shades of green converging into one',
  );
}

function telemedicine(): Markup {
  const points = [
    [70, 92],
    [130, 104],
    [190, 150],
    [250, 196],
    [310, 236],
    [370, 252],
    [420, 256],
  ];
  const path = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return frame(
    html`<line x1="60" y1="290" x2="430" y2="290" stroke="${C.line}" />
      <line x1="60" y1="70" x2="60" y2="290" stroke="${C.line}" />
      <path d="${path}" fill="none" stroke="${C.saffron}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="70" cy="92" r="6" fill="${C.ground}" stroke="${C.bone}" stroke-width="2" />
      <circle cx="420" cy="256" r="7" fill="${C.saffron}" />
      <text x="82" y="78" fill="${C.bone}" font-size="20" font-family="Alexandria Variable, sans-serif">22 min</text>
      <text x="420" y="236" fill="${C.saffron}" font-size="20" text-anchor="end" font-family="Alexandria Variable, sans-serif">6 min</text>
      <text x="60" y="318" fill="${C.dim}" font-size="13" font-family="Readex Pro Variable, sans-serif">average wait</text>`,
    'Average wait falling from 22 to 6 minutes',
  );
}

function savings(): Markup {
  const r = 104;
  const circumference = 2 * Math.PI * r;
  return frame(
    html`<circle cx="240" cy="176" r="${r}" fill="none" stroke="${C.line}" stroke-width="14" />
      <circle cx="240" cy="176" r="${r}" fill="none" stroke="${C.saffron}" stroke-width="14" stroke-linecap="round"
        stroke-dasharray="${(circumference * 0.72).toFixed(1)} ${circumference.toFixed(1)}" transform="rotate(-90 240 176)" />
      <text x="240" y="176" fill="${C.bone}" font-size="34" text-anchor="middle" font-family="Alexandria Variable, sans-serif">2,300</text>
      <text x="240" y="204" fill="${C.dim}" font-size="14" text-anchor="middle" font-family="Readex Pro Variable, sans-serif">SAR saved per goal</text>`,
    'A savings goal ring with SAR 2,300 average saved',
  );
}

function qalam(): Markup {
  return frame(
    html`<rect x="44" y="44" width="392" height="272" rx="10" fill="#1d1418" stroke="${C.line}" />
      <circle cx="66" cy="64" r="4" fill="${C.line}" /><circle cx="80" cy="64" r="4" fill="${C.line}" /><circle cx="94" cy="64" r="4" fill="${C.line}" />
      <g font-family="IBM Plex Mono, monospace" font-size="14" fill="${C.dim}">
        <text x="64" y="104"><tspan fill="${C.saffron}">for</tspan> (let i = 0; i &lt; 5; i++ {</text>
        <text x="84" y="130">print(i)</text>
        <text x="64" y="156">}</text>
      </g>
      <path d="M190 112 q4 -6 8 0 t8 0 t8 0" stroke="${C.saffron}" fill="none" stroke-width="1.5" />
      <rect x="64" y="186" width="352" height="104" rx="8" fill="#2c1f24" />
      <g font-family="Readex Pro Variable, sans-serif" text-anchor="start" direction="rtl" unicode-bidi="embed">
        <text x="400" y="222" fill="${C.bone}" font-size="17">ينقص قوس الإغلاق بعد الشرط</text>
        <text x="400" y="256" fill="${C.dim}" font-size="14">الخطوة التالية: أضف «)» قبل «{»</text>
      </g>`,
    'A code editor explaining an error in Arabic',
  );
}

function khatt(): Markup {
  const dots = [0, 1, 2].map((i) => html`<polygon points="${rhombus(400, 108 + i * 30, 13)}" fill="${C.saffron}" />`);
  return frame(
    html`<line x1="40" y1="250" x2="440" y2="250" stroke="${C.line}" />
      <line x1="40" y1="110" x2="440" y2="110" stroke="${C.line}" stroke-dasharray="4 6" />
      <line x1="40" y1="300" x2="440" y2="300" stroke="${C.line}" stroke-dasharray="4 6" />
      <text x="220" y="262" fill="${C.bone}" font-size="230" text-anchor="middle" font-family="Noto Naskh Arabic Variable, serif">خ</text>
      ${dots}
      <text x="400" y="216" fill="${C.dim}" font-size="13" text-anchor="middle" font-family="Readex Pro Variable, sans-serif">nuqta</text>`,
    'The Arabic letter Kha measured in rhombic dots',
  );
}

function hirfa(): Markup {
  const card = (x: number, align: 'start' | 'end') => {
    const bar = (y: number, w: number, color: string) =>
      html`<rect x="${align === 'start' ? x + 20 : x + 180 - 20 - w}" y="${y}" width="${w}" height="12" rx="6" fill="${color}" />`;
    return html`<rect x="${x}" y="80" width="180" height="200" rx="12" fill="#2c1f24" stroke="${C.line}" />
      <circle cx="${align === 'start' ? x + 36 : x + 144}" cy="116" r="16" fill="${C.saffron}" />
      ${bar(150, 120, C.bone)}${bar(174, 90, C.dim)}${bar(198, 130, C.line)}
      <rect x="${align === 'start' ? x + 20 : x + 100}" y="236" width="60" height="26" rx="13" fill="${C.saffron}" />`;
  };
  return frame(
    html`${card(36, 'start')}<line x1="240" y1="60" x2="240" y2="300" stroke="${C.bone}" stroke-dasharray="3 5" />${card(264, 'end')}
      <text x="126" y="320" fill="${C.dim}" font-size="13" text-anchor="middle" font-family="Readex Pro Variable, sans-serif">LTR</text>
      <text x="354" y="320" fill="${C.dim}" font-size="13" text-anchor="middle" font-family="Readex Pro Variable, sans-serif">RTL</text>`,
    'A component mirrored for left-to-right and right-to-left',
  );
}

function dalil(): Markup {
  const lines = [100, 130, 160, 190, 220, 250].map((y, i) => {
    const w = [300, 260, 320, 220, 280, 180][i] ?? 200;
    return html`<rect x="${410 - w}" y="${y}" width="${w}" height="10" rx="5" fill="${C.line}" />`;
  });
  const flags = [
    [410, 105],
    [250, 165],
    [330, 255],
  ].map(
    ([x, y]) => html`<circle cx="${x}" cy="${y}" r="14" fill="none" stroke="${C.saffron}" stroke-width="2" /><circle cx="${x}" cy="${y}" r="4" fill="${C.saffron}" />`,
  );
  return frame(
    html`<rect x="70" y="60" width="370" height="240" rx="10" fill="#2c1f24" stroke="${C.line}" />${lines}${flags}
      <rect x="64" y="252" width="86" height="40" rx="20" fill="${C.saffron}" />
      <text x="107" y="278" fill="${C.ground}" font-size="18" text-anchor="middle" font-family="Alexandria Variable, sans-serif">42</text>`,
    'A right-to-left page with accessibility issues flagged',
  );
}

function rafeeq(): Markup {
  const nodes = [
    [90, 250],
    [230, 110],
    [390, 220],
  ];
  return frame(
    html`<path d="M90 250 C 130 150, 180 120, 230 110" fill="none" stroke="${C.saffron}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round" />
      <path d="M230 110 C 300 110, 360 150, 390 220" fill="none" stroke="${C.bone}" stroke-width="2" stroke-dasharray="2 8" stroke-linecap="round" />
      <path d="M90 250 C 200 300, 300 290, 390 220" fill="none" stroke="${C.line}" stroke-width="2" />
      ${nodes.map(([x, y]) => html`<polygon points="${rhombus(x ?? 0, y ?? 0, 16)}" fill="${C.ground}" stroke="${C.bone}" stroke-width="2" />`)}
      <circle cx="168" cy="140" r="6" fill="${C.saffron}" /><circle cx="330" cy="140" r="6" fill="${C.bone}" />`,
    'Shared routes linking three campuses',
  );
}

const plates: Record<string, () => Markup> = { mizan, telemedicine, savings, qalam, khatt, hirfa, dalil, rafeeq };

export function plate(id: string): Markup {
  return (plates[id] ?? mizan)();
}
