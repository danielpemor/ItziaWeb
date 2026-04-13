import { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  onAnimationComplete?: () => void;
}

export default function BlurText({
  text,
  className = '',
  delay = 0,
  animateBy = 'words',
  direction = 'bottom',
  onAnimationComplete,
}: BlurTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [hasCompleted, setHasCompleted] = useState(false);

  const tokens = animateBy === 'words' ? text.split(' ') : text.split('');

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: 'blur(10px)',
      y: direction === 'bottom' ? 20 : -20,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
    },
  };

  return (
    <span ref={ref} className={`inline ${className}`}>
      {tokens.map((token, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={variants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          onAnimationComplete={
            i === tokens.length - 1
              ? () => {
                  if (!hasCompleted) {
                    setHasCompleted(true);
                    onAnimationComplete?.();
                  }
                }
              : undefined
          }
        >
          {token}
          {animateBy === 'words' && i < tokens.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}