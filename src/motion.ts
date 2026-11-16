import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export interface MotionHooks {
  reducedMotion: boolean;
  onHeroProgress(progress: number): void;
  onHeroLeave(): void;
  onHeroEnter(): void;
  addTeardown(fn: () => void): void;
}

export function startSmoothScroll(): Lenis {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function killTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

export function mountMotion(root: HTMLElement, lenis: Lenis | null, hooks: MotionHooks): void {
  const heroEl = root.querySelector<HTMLElement>('.hero');
  if (heroEl) {
    ScrollTrigger.create({
      trigger: heroEl,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        hooks.onHeroProgress(self.progress);
        heroEl.style.setProperty('--hero-progress', self.progress.toFixed(3));
      },
      onLeave: hooks.onHeroLeave,
      onEnterBack: hooks.onHeroEnter,
    });
  }

  if (hooks.reducedMotion) {
    ScrollTrigger.refresh();
    return;
  }

  const words = root.querySelectorAll<HTMLElement>('[data-ink] .ink-word');
  if (words.length) {
    gsap.fromTo(
      words,
      { color: '#685b61' },
      {
        color: '#1c1418',
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: { trigger: root.querySelector('[data-ink]'), start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      },
    );
  }

  root.querySelectorAll<HTMLElement>('[data-split]').forEach((title) => {
    gsap.fromTo(
      title,
      { yPercent: 30, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: title, start: 'top 90%', once: true } },
    );
  });

  const animations: Animation[] = [];
  root.querySelectorAll<HTMLElement>('.marquee__track').forEach((track) => {
    track.getAnimations().forEach((animation) => animations.push(animation));
  });
  if (lenis && animations.length) {
    const onScroll = ({ velocity }: { velocity: number }) => {
      const rate = 1 + Math.min(4, Math.abs(velocity) * 0.25);
      animations.forEach((animation) => {
        animation.playbackRate += (rate - animation.playbackRate) * 0.2;
      });
    };
    const settle = window.setInterval(() => {
      animations.forEach((animation) => {
        animation.playbackRate += (1 - animation.playbackRate) * 0.15;
      });
    }, 100);
    lenis.on('scroll', onScroll);
    hooks.addTeardown(() => {
      lenis.off('scroll', onScroll);
      window.clearInterval(settle);
    });
  }

  root.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = 0.3;
    const move = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      gsap.to(el, {
        x: (event.clientX - (box.left + box.width / 2)) * strength,
        y: (event.clientY - (box.top + box.height / 2)) * strength,
        duration: 0.6,
        ease: 'power3.out',
      });
    };
    const leave = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
  });

  ScrollTrigger.refresh();
}
