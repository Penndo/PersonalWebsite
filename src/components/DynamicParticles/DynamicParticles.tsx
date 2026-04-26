import React, { useEffect, useRef } from 'react';
import styles from './DynamicParticles.module.less';

interface Dust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  twinkleSeed: number;
}

/**
 * DynamicParticles
 * Cursor-reactive layer for a designer portfolio:
 *  - A soft warm "spotlight" that smoothly trails the cursor (Brittany Chiang style)
 *  - A sparse field of slow-drifting "stardust" — no connection lines, no mouse repulsion
 *
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
const DynamicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let dust: Dust[] = [];
    let animationId = 0;
    let frame = 0;

    // Smoothed cursor position (lerped target)
    const cursor = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedDust(w, h);
    };

    const seedDust = (w: number, h: number) => {
      // Density scales gently with viewport area; keep it sparse.
      const target = Math.min(22, Math.max(10, Math.round((w * h) / 110000)));
      dust = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.06 - 0.015, // slight upward bias
        size: Math.random() * 0.7 + 0.7,           // 0.7–1.4px
        alpha: Math.random() * 0.25 + 0.25,        // 0.25–0.5
        twinkleSeed: Math.random() * Math.PI * 2,
      }));
    };

    const drawSpotlight = () => {
      if (!cursor.active || isTouch) return;
      const radius = 320;
      const grad = ctx.createRadialGradient(cursor.x, cursor.y, 0, cursor.x, cursor.y, radius);
      grad.addColorStop(0, 'rgba(255, 215, 103, 0.085)');
      grad.addColorStop(0.45, 'rgba(255, 215, 103, 0.025)');
      grad.addColorStop(1, 'rgba(255, 215, 103, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cursor.x - radius, cursor.y - radius, radius * 2, radius * 2);
    };

    const drawDust = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        // Wrap around the viewport instead of bouncing — feels calmer.
        if (d.x < -8) d.x = w + 8;
        else if (d.x > w + 8) d.x = -8;
        if (d.y < -8) d.y = h + 8;
        else if (d.y > h + 8) d.y = -8;

        const twinkle = 0.85 + Math.sin(frame * 0.012 + d.twinkleSeed) * 0.15;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 239, 225, ${d.alpha * twinkle})`;
        ctx.fill();
      }
    };

    const tick = () => {
      // Lerp cursor toward target for smooth trailing
      cursor.x += (cursor.tx - cursor.x) * 0.08;
      cursor.y += (cursor.ty - cursor.y) * 0.08;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSpotlight();
      drawDust();
      frame++;

      if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(tick);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      cursor.tx = e.clientX;
      cursor.ty = e.clientY;
      if (!cursor.active) {
        cursor.x = e.clientX;
        cursor.y = e.clientY;
        cursor.active = true;
      }
    };

    const handleMouseLeave = () => {
      cursor.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);

    resize();

    if (prefersReducedMotion) {
      // Render a single static frame so dust still shows quietly.
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDust();
    } else {
      tick();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
};

export default DynamicParticles;
