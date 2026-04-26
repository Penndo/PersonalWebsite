import React from 'react';
import { motion } from 'framer-motion';
import styles from './GradientBackground.module.less';

/**
 * GradientBackground
 * Editorial-grade ambient layer for a designer portfolio.
 * - Warm-dark base (#0E0E08) aligned with the homepage palette
 * - Two restrained warm orbs anchored off-screen, slow orbital drift
 * - Static dot grid as quiet textural signature
 * - Soft vignette + grain to anchor focus and add tactile depth
 *
 * No purple/pink/cyan; no aurora chaos; no diagonal light streaks.
 * The background supports the type — never competes with it.
 */
const GradientBackground: React.FC = () => {
  return (
    <div className={styles.gradientBackground} aria-hidden="true">
      <motion.div
        className={`${styles.orb} ${styles.orbWarm}`}
        animate={{
          x: [0, 60, -20, 0],
          y: [0, -40, 30, 0],
          scale: [1, 1.06, 0.96, 1],
        }}
        transition={{
          duration: 56,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`${styles.orb} ${styles.orbDeep}`}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 50, -20, 0],
          scale: [1, 0.94, 1.08, 1],
        }}
        transition={{
          duration: 64,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className={styles.dotGrid} />
      <div className={styles.vignette} />
      <div className={styles.grain} />
    </div>
  );
};

export default GradientBackground;
