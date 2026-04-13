import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  separator?: string;
}

export default function CountUp({
  from = 0,
  to,
  duration = 2,
  suffix = '',
  prefix = '',
  className = '',
  separator = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(from);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const range = to - from;

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime: number) {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);
      const current = Math.round(from + range * easedProgress);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [inView, from, to, duration]);

  function formatNumber(n: number) {
    if (!separator) return n.toString();
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }

  return (
    <span ref={ref} className={className}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
}