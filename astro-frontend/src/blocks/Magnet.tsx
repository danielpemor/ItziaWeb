import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  className?: string;
}

export default function Magnet({
  children,
  padding = 50,
  disabled = false,
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = Math.max(rect.width, rect.height) / 2 + padding;

    if (dist < maxDist) {
      const strength = (1 - dist / maxDist) * 0.4;
      setPosition({ x: dx * strength, y: dy * strength });
    }
  }

  function handleMouseLeave() {
    setPosition({ x: 0, y: 0 });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}