const insurers = [
  { name: 'AXA Health', src: '/images/insurers/axa.svg' },
  { name: 'Aviva',      src: '/images/insurers/aviva.svg' },
  { name: 'Cigna',      src: '/images/insurers/cigna.svg' },
  { name: 'Vitality',   src: '/images/insurers/vitality.svg' },
  { name: 'Healix',     src: '/images/insurers/healix.svg' },
];

// 6 copies → each animated "half" (3 copies) is wide enough to fill large
// viewports without gaps, and translateX(-50%) loops seamlessly.
const allLogos = Array.from({ length: 6 }, () => insurers).flat();

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

      <div className="logo-marquee relative">
        {/* Fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }}
        />
        {/* Fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }}
        />

        <div className="logo-marquee-track flex items-center" style={{ width: 'max-content' }}>
          {allLogos.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0"
              style={{ minWidth: '90px', height: '36px', marginRight: '3.5rem' }}
            >
              <img
                src={logo.src}
                alt={logo.name}
                className="h-7 w-auto object-contain logo-marquee-img"
                style={{
                  filter: 'grayscale(100%)',
                  opacity: 0.4,
                  transition: 'opacity 0.3s, filter 0.3s',
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
        </div>
      </div>
    </div>
  );
}
