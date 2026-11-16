export function installCursor(): void {
  const capable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!capable || reduced) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  dot.innerHTML = '<span class="cursor__shape"></span><span class="cursor__label"></span>';
  document.body.append(dot);
  const label = dot.querySelector<HTMLElement>('.cursor__label');

  const target = { x: -100, y: -100 };
  const current = { x: -100, y: -100 };
  let frame = 0;
  let mode = '';

  const tick = () => {
    current.x += (target.x - current.x) * 0.22;
    current.y += (target.y - current.y) * 0.22;
    dot.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
    frame = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.2 ? requestAnimationFrame(tick) : 0;
  };

  const setMode = (next: string, text = '') => {
    if (next === mode) return;
    mode = next;
    dot.dataset.mode = next;
    if (label) label.textContent = text;
  };

  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType !== 'mouse') return;
      target.x = event.clientX;
      target.y = event.clientY;
      dot.classList.add('is-visible');
      if (!frame) frame = requestAnimationFrame(tick);
      const el = event.target instanceof Element ? event.target : null;
      const labelled = el?.closest<HTMLElement>('[data-cursor]');
      if (labelled) setMode('label', labelled.dataset.cursor ?? '');
      else if (el?.closest('a, button, [role="radio"], [role="switch"], input, label')) setMode('hover');
      else if (el?.closest('.hero__stage, .bust')) setMode('portrait');
      else setMode('');
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => dot.classList.remove('is-visible'));
  window.addEventListener('pointerdown', () => dot.classList.add('is-pressed'));
  window.addEventListener('pointerup', () => dot.classList.remove('is-pressed'));
}
