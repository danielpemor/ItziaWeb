import { motion } from 'framer-motion';
import { Shield, Video, Clock, Calendar, Star } from 'lucide-react';
import ShinyText from '../blocks/ShinyText';
import Magnet from '../blocks/Magnet';
import CountUp from '../blocks/CountUp';

const trustBadges = [
  { icon: Shield,   text: 'HCPC Registered' },
  { icon: Video,    text: 'Online Sessions' },
  { icon: Clock,    text: 'Flexible Hours' },
  { icon: Calendar, text: 'Free Consultation' },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">

      {/* Background — limpio, sin grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #FAF8F4 0%, #f2ede6 50%, #eaf0f2 100%)' }}
        />
        <div
          className="absolute -top-60 right-0 w-[700px] h-[700px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #1D4E5F 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 -left-40 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #C17D5C 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="section-container w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] py-16">

          {/* ── LEFT ── */}
          <div className="relative z-10 max-w-xl">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(29,78,95,0.07)', border: '1px solid rgba(29,78,95,0.12)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#7A9E7E' }} />
              <ShinyText
                text="Trauma Specialist · Clinical Psychologist"
                className="text-xs font-medium tracking-widest uppercase"
                speed={4}
              />
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-display-lg lg:text-display-xl text-warm leading-[1.05] mb-6"
            >
              Specialist care
              <br />
              for{' '}
              <em className="not-italic" style={{
                background: 'linear-gradient(135deg, #1D4E5F 30%, #7A9E7E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                complex minds.
              </em>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-lg leading-relaxed mb-10"
              style={{ color: '#44403C' }}
            >
              Highly Specialist Clinical Psychologist with 10+ years of NHS
              and private experience. Trauma-focused therapy using CBT, EMDR,
              and CAT — online, tailored to you.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Magnet padding={40}>
                <a
                  href="https://calendly.com/itzia-morales/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-4 text-white font-medium rounded-full text-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)' }}
                >
                  Free 15-min Consultation
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </Magnet>
              <Magnet padding={40}>
                <a
                  href="/booking"
                  className="inline-flex items-center gap-2.5 px-7 py-4 font-medium rounded-full text-sm bg-white transition-all hover:shadow-sm"
                  style={{ border: '1.5px solid rgba(29,78,95,0.2)', color: '#1D4E5F' }}
                >
                  Book a Session
                </a>
              </Magnet>
            </motion.div>

            {/* Social proof — minimalista */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex items-center gap-5 pb-10 border-b"
              style={{ borderColor: 'rgba(29,78,95,0.08)' }}
            >
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
                ))}
              </div>
              <p className="text-sm" style={{ color: '#78716C' }}>
                <span className="font-medium" style={{ color: '#1C1917' }}>200+ clients</span>
                {' '}across UK & internationally
              </p>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="flex flex-wrap gap-x-6 gap-y-3 pt-8"
            >
              {trustBadges.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: '#78716C' }}>
                  <Icon size={14} style={{ color: '#1D4E5F' }} />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — imagen con overlays internos ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/*
              Contenedor principal — aspect ratio fijo
              Las tarjetas van DENTRO como absolute overlays
              No hay tarjetas externas que compitan con el layout
            */}
            <div className="relative mx-auto" style={{ maxWidth: '400px' }}>

              {/* Imagen */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: '3/4', borderRadius: '2rem' }}
              >
                <img
                  src="/images/dr-itzia.jpg"
                  alt="Dr. Itzia Perez Morales"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.background =
                      'linear-gradient(160deg, #2a6b82 0%, #1D4E5F 60%, #0f2d38 100%)';
                  }}
                />

                {/* Gradient overlay — más fuerte en el borde superior e inferior */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      linear-gradient(to bottom,
                        rgba(15,45,56,0.55) 0%,
                        transparent 35%,
                        transparent 55%,
                        rgba(15,45,56,0.85) 100%
                      )
                    `,
                  }}
                />

                {/* ── Overlay TOP — Free consultation ── */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="absolute top-5 left-5 right-5"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '1rem',
                    padding: '0.875rem 1.125rem',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Free consultation
                      </p>
                      <p className="font-display text-white text-lg font-medium leading-tight">
                        15 minutes
                      </p>
                    </div>
                    <a
                      href="https://calendly.com/itzia-morales/30min"
                      target="_blank"
                      className="text-xs font-medium px-3 py-1.5 rounded-full transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      Book free →
                    </a>
                  </div>
                </motion.div>

                {/* ── Overlay BOTTOM — nombre + stat ── */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Stat pill */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#C17D5C' }} />
                    <span className="text-xs text-white font-medium">
                      <CountUp to={10} duration={2} suffix="+ years" /> NHS & Private · 4 countries
                    </span>
                  </motion.div>

                  {/* Nombre */}
                  <p className="font-display text-xl text-white font-medium leading-tight mb-0.5">
                    Dr. Itzia Perez Morales
                  </p>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    Highly Specialist Clinical Psychologist
                  </p>
                </div>
              </div>

              {/* Decorative ring — sutil */}
              <div
                className="absolute -inset-3 -z-10 rounded-[2.5rem] pointer-events-none"
                style={{ border: '1px solid rgba(29,78,95,0.1)' }}
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: '#78716C' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-px h-8"
          style={{ background: 'linear-gradient(to bottom, #1D4E5F, transparent)' }}
        />
      </motion.div>
    </section>
  );
}