import { motion } from 'framer-motion';

const insurers = [
  { name: 'AXA Health', src: '/images/insurers/axa.svg' },
  { name: 'Aviva',      src: '/images/insurers/aviva.svg' },
  { name: 'Bupa',       src: '/images/insurers/bupa.svg' },
  { name: 'Cigna',      src: '/images/insurers/cigna.svg' },
  { name: 'Vitality',   src: '/images/insurers/vitality.svg' },
  { name: 'Healix',     src: '/images/insurers/healix.svg' },
];

const allLogos = [...insurers, ...insurers, ...insurers];

export default function LogoStrip() {
  return (
    <div
      className="py-12 border-y overflow-hidden"
      style={{ background: '#ffffff', borderColor: 'rgba(29,78,95,0.07)' }}
    >
      <div className="section-container mb-8">
        <p className="text-xs font-medium uppercase tracking-widest text-center"
          style={{ color: '#78716C' }}
        >
          Registered provider with leading health insurers
        </p>
      </div>

      <div className="relative">
        {/* Fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
        />
        {/* Fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }}
        />

        <motion.div
          className="flex items-center gap-14"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ width: 'max-content' }}
        >
          {allLogos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0"
              style={{ minWidth: '90px', height: '36px' }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-7 w-auto object-contain"
                style={{
                  filter: 'grayscale(100%)',
                  opacity: 0.4,
                  transition: 'opacity 0.3s, filter 0.3s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter = 'grayscale(100%)';
                  e.currentTarget.style.opacity = '0.4';
                }}
                onError={e => {
                  // Si no carga la imagen, muestra el nombre como texto
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    e.currentTarget.style.display = 'none';
                    parent.innerHTML = `<span style="font-size:13px;font-weight:600;color:rgba(29,78,95,0.3);letter-spacing:0.05em;font-family:DM Sans,sans-serif">${logo.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}