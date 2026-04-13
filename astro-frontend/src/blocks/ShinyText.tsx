import type { CSSProperties } from 'react';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

export default function ShinyText({
  text,
  className = '',
  speed = 3,
  disabled = false,
}: ShinyTextProps) {
  const style: CSSProperties = {
    backgroundImage:
      'linear-gradient(120deg, #9bbf9e 0%, #9bbf9e 40%, #ffffff 50%, #9bbf9e 60%, #9bbf9e 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    animation: disabled ? 'none' : `shinySlide ${speed}s linear infinite`,
  };

  return (
    <>
      <style>{`
        @keyframes shinySlide {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <span style={style} className={className}>
        {text}
      </span>
    </>
  );
}