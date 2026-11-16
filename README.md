# Yara Al-Mansouri Portfolio | يارا المنصوري

Our portfolio website for Dr. Yara Saud Al-Mansouri, built for Portfolio Summit 2026 at Al Yamamah University.

**Live site:** https://8llg.github.io/yara-portfolio/

## The idea

Yara works between two languages and two reading directions, so the site is built to read in both. Switching to Arabic mirrors the whole page, not just the text.

## Features

- Full-body 3D character in a black abaya, hijab and niqab, standing in a Najdi arch. She follows the mouse, blinks, reacts on hover and turns when the language changes
- Full English and Arabic versions (LTR and RTL)
- Eight case studies with problem, role, solution and results
- Impact explorer: 35 results from the CV, filterable by field
- Career timeline
- Arabic typography lab based on Yara's PhD research
- Design system playground with live contrast checks
- Full CV explorer: 110 entries, searchable in both languages
- Download the original CV as PDF
- Command palette (`Ctrl+K`), guided tour and presentation mode (`P`)
- Keyboard shortcuts: `1` to `8` for sections, `0` for top, `L` for language, `?` for help

## Tech

- Vite and TypeScript
- Three.js for the character
- GSAP and Lenis for scroll animation
- Fonts: Alexandria, Readex Pro, Noto Naskh Arabic

All CV content is stored in `src/content/` with English and Arabic side by side.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Add `?lang=ar` to open in Arabic.

## Build

```bash
npm run build
npm run preview
```

The build goes to `out/` and is deployed to GitHub Pages automatically on every push to `main`.

## Performance

Lighthouse (production build): desktop 100 / 100 / 100, mobile 90 / 100 / 100 (Performance / Accessibility / Best Practices).

The 3D character, animations and dialogs load on demand, and the character stops rendering when it is off screen.
