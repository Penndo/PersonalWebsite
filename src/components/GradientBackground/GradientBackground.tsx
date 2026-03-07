import React from 'react';
import { motion } from 'framer-motion';
import styles from './GradientBackground.module.less';

/**
 * GradientBackground Component
 * @description Provides a modern, advanced "Aurora" or "Mesh" gradient background effect.
 * Uses Framer Motion for smooth, organic movement of color orbs.
 * @returns {JSX.Element} The rendered component.
 */
const GradientBackground: React.FC = () => {
  return (
    <div className={styles.gradientBackground}>
      {/* Primary Aurora Orbs */}
      <motion.div
        className={`${styles.gradientOrb} ${styles.orb1}`}
        animate={{
          x: [0, 150, 50, -100, 0],
          y: [0, 80, 180, 80, 0],
          scale: [1, 1.3, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${styles.gradientOrb} ${styles.orb2}`}
        animate={{
          x: [0, -120, -180, -60, 0],
          y: [0, 120, 60, 180, 0],
          scale: [1, 0.85, 1.15, 1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${styles.gradientOrb} ${styles.orb3}`}
        animate={{
          x: [0, 100, 180, 100, 0],
          y: [0, -100, -50, -150, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className={`${styles.gradientOrb} ${styles.orb4}`}
        animate={{
          x: [0, -60, -120, -30, 0],
          y: [0, 150, 90, 30, 0],
          scale: [1, 1.25, 1, 0.85, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Accent "Glitch" Orbs for more depth */}
      <motion.div
        className={`${styles.gradientOrb} ${styles.orbAccent}`}
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grainy Texture Overlay */}
      <div className={styles.grainOverlay} />
    </div>
  );
};

export default GradientBackground;
