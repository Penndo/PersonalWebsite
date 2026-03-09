import React, { useEffect, useRef } from 'react';
import styles from './DynamicParticles.module.less';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  layer: 0 | 1;
}

/**
 * DynamicParticles Component
 * @description A high-performance canvas-based particle background with interactive elements.
 * @returns {JSX.Element} The rendered component.
 */
const DynamicParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 170;
    const baseConnectionDistance = 150;
    const mouseRadius = 200;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /**
     * Initializes the canvas size and particles.
     */
    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];

      const palette = [
        'rgba(56, 189, 248, 0.45)',  // cyan
        'rgba(129, 140, 248, 0.42)', // indigo
        'rgba(244, 114, 182, 0.42)', // pink
        'rgba(251, 191, 36, 0.24)',  // amber accent
      ];

      for (let i = 0; i < particleCount; i++) {
        const layer: 0 | 1 = Math.random() > 0.65 ? 1 : 0;
        const speedFactor = layer ? 0.7 : 0.35;
        const baseSize = layer ? Math.random() * 2.2 + 1.2 : Math.random() * 1.6 + 0.4;

        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speedFactor,
          vy: (Math.random() - 0.5) * speedFactor,
          size: baseSize,
          color: palette[Math.floor(Math.random() * palette.length)],
          layer,
        });
      }
    };

    /**
     * Animation loop for particles.
     */
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Basic movement
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRadius) {
            const force = (mouseRadius - distance) / mouseRadius;
            p.x += dx * force * 0.05;
            p.y += dy * force * 0.05;
          }
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const sameLayer = p.layer === p2.layer;
          const connectionDistance = sameLayer ? baseConnectionDistance + 40 : baseConnectionDistance - 30;

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * (sameLayer ? 0.22 : 0.14);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.lineWidth = sameLayer ? 0.7 : 0.4;
            ctx.stroke();
          }
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    const handleResize = () => {
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default DynamicParticles;
