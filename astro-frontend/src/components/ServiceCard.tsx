import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Clock, Monitor, MapPin, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { bookHref } from '../config/booking';

export interface Service {
  id: string;
  name: string;
  tagline: string;
  description: string;
  duration_minutes: number;
  price_gbp: number;
  modality: 'online' | 'in-person' | 'both';
  features: string[];
  accent: string;
  iconBg: string;
  iconContent: React.ReactNode;
}

function ModalityBadge({ modality }: { modality: Service['modality'] }) {
  const config = {
    online: {
      icon: Monitor,
      label: 'Online',
      style: { background: 'rgba(45,74,62,0.08)', color: '#2D4A3E', border: '1px solid rgba(45,74,62,0.15)' },
    },
    'in-person': {
      icon: MapPin,
      label: 'In-Person',
      style: { background: 'rgba(193,125,92,0.08)', color: '#C17D5C', border: '1px solid rgba(193,125,92,0.2)' },
    },
    both: {
      icon: Monitor,
      label: 'Online & In-Person',
      style: { background: 'rgba(45,74,62,0.08)', color: '#2D4A3E', border: '1px solid rgba(45,74,62,0.15)' },
    },
  };
  const { icon: Icon, label, style } = config[modality];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={style}
    >
      <Icon size={10} />
      {label}
    </span>
  );
}

function CheckIcon() {
  return (
    <span
      className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5"
      style={{ background: 'rgba(45,74,62,0.1)' }}
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path d="M1 4l2 2 4-4" stroke="#2D4A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function ServiceCard({ service, index }: { service: Service; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), { stiffness: 300, damping: 30 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className="group cursor-pointer h-full"
    >
      <div className="relative bg-white rounded-2xl overflow-hidden border h-full flex flex-col transition-all duration-500 group-hover:shadow-xl"
        style={{ borderColor: 'rgba(45,74,62,0.1)' }}
      >
        {/* Accent top bar */}
        <div className="h-1 w-full" style={{ background: service.accent }} />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(45,74,62,0.02) 0%, rgba(193,125,92,0.02) 100%)' }}
        />

        <div className="p-7 flex flex-col flex-1">

          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: service.iconBg }}
            >
              {service.iconContent}
            </div>
            <ModalityBadge modality={service.modality} />
          </div>

          {/* Name */}
          <h3 className="font-display text-display-sm text-warm mb-1">
            {service.name}
          </h3>

          {/* Tagline */}
          <p className="font-display italic mb-4 text-sm" style={{ color: '#6B8F82' }}>
            {service.tagline}
          </p>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: '#44403C' }}>
            {service.description}
          </p>

          {/* Features */}
          <ul className="space-y-2.5 mb-7">
            {service.features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: '#44403C' }}>
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: 'rgba(45,74,62,0.08)' }} />

          {/* Price row */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Clock size={13} style={{ color: '#78716C' }} />
                <span className="text-sm" style={{ color: '#44403C' }}>
                  {service.duration_minutes} min
                </span>
              </div>
              <span className="font-display text-2xl font-medium text-warm">
                £{service.price_gbp}
              </span>
            </div>
            <motion.div
              whileHover={{ x: 3 }}
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                background: 'rgba(45,74,62,0.08)',
                color: '#2D4A3E',
              }}
            >
              <ArrowRight size={15} />
            </motion.div>
          </div>

          {/* CTA */}
          <a
            href={bookHref(service.id)}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #2D4A3E 0%, #3D6456 100%)' }}
          >
            Book This Service
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ── Icon components ──────────────────────────────────────────────────────────

function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function IconBrain() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2D4A3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function IconHands() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C17D5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 12H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1" />
      <path d="M20 16.7A2 2 0 0 0 22 15v-1a2 2 0 0 0-2-2h-8l-1-2H7a2 2 0 0 0-2 2v5" />
      <circle cx="7.5" cy="21.5" r="1.5" />
      <circle cx="17.5" cy="21.5" r="1.5" />
      <path d="M7 12V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C17D5C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

// ── Mock services data ───────────────────────────────────────────────────────

const MOCK_SERVICES: Service[] = [
  {
    id: 'initial-assessment',
    name: 'Initial Assessment',
    tagline: 'Understanding your unique story',
    description: 'A thorough 60-minute assessment to reach a shared understanding of your difficulties, context, strengths, and goals. Leads to a personalised formulation.',
    duration_minutes: 60,
    price_gbp: 150,
    modality: 'online',
    features: [
      'Comprehensive clinical interview',
      'Collaborative formulation map',
      'Personalised treatment plan',
      'Evidence-based goal setting',
    ],
    accent: 'linear-gradient(90deg, #1D4E5F, #2a6b82)',
    iconBg: 'rgba(29,78,95,0.08)',
    iconContent: <IconLeaf />,
  },
  {
    id: 'psychological-intervention',
    name: 'Psychological Therapy',
    tagline: 'Evidence-based, tailored to you',
    description: 'Individual therapy sessions using CBT, EMDR, CAT, ACT or CFT — adapted to your needs, developmental stage, and therapeutic goals.',
    duration_minutes: 50,
    price_gbp: 120,
    modality: 'online',
    features: [
      'CBT, EMDR, CAT, ACT or CFT',
      'Trauma-focused when indicated',
      'Culturally responsive approach',
      'Relapse prevention & resources',
    ],
    accent: 'linear-gradient(90deg, #2a6b82, #1D4E5F)',
    iconBg: 'rgba(29,78,95,0.08)',
    iconContent: <IconBrain />,
  },
  {
    id: 'emdr-standard',
    name: 'EMDR Therapy',
    tagline: 'Processing trauma at its roots',
    description: 'Specialised Eye Movement Desensitisation and Reprocessing therapy for trauma, PTSD, and complex presentations. Standard or extended sessions available.',
    duration_minutes: 90,
    price_gbp: 180,
    modality: 'online',
    features: [
      'Standard (50 min) or extended (90 min)',
      'EMDR UK trained specialist',
      'Weekly or intensive format',
      'Integrated with CBT or CAT if needed',
    ],
    accent: 'linear-gradient(90deg, #C17D5C, #d4936f)',
    iconBg: 'rgba(193,125,92,0.08)',
    iconContent: <IconHands />,
  },
  {
    id: 'free-consultation',
    name: 'Free Consultation',
    tagline: 'Let\'s see if we\'re a good fit',
    description: 'A free 15-minute call to introduce ourselves, discuss your availability, preferences, main difficulties, and how I can best support you.',
    duration_minutes: 15,
    price_gbp: 0,
    modality: 'online',
    features: [
      'No commitment required',
      'Discuss goals & preferences',
      'Ask any questions',
      'Book via Calendly instantly',
    ],
    accent: 'linear-gradient(90deg, #7A9E7E, #5a8260)',
    iconBg: 'rgba(122,158,126,0.08)',
    iconContent: <IconZap />,
  },
];
// ── Services section ─────────────────────────────────────────────────────────

export function ServicesSection() {
  return (
    <section id="services" className="py-28 relative overflow-hidden"
      style={{ background: '#F7F4EF' }}
    >
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(45,74,62,0.2), transparent)' }}
      />

      <div className="section-container">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5"
              style={{
                background: 'rgba(45,74,62,0.08)',
                color: '#2D4A3E',
                border: '1px solid rgba(45,74,62,0.12)',
              }}
            >
              Services
            </div>
            <h2 className="font-display text-display-md text-warm leading-tight">
              How I can
              <br />
              <em className="not-italic" style={{
                background: 'linear-gradient(135deg, #2D4A3E 0%, #7A9E7E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                support you
              </em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-warm-light leading-relaxed lg:text-right"
          >
            Each service is designed to meet you where you are.
            Whether you're seeking therapy, a diagnostic assessment,
            or targeted coaching — there's a pathway for you.
          </motion.p>
        </div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {MOCK_SERVICES.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm mt-10"
          style={{ color: '#78716C' }}
        >
          Not sure which service is right for you?{' '}
          <a href="mailto:itzia.morales@outlook.com"
            className="font-medium underline underline-offset-2"
            style={{ color: '#2D4A3E' }}
          >
            Send me a message
          </a>{' '}
          and I'll help you choose.
        </motion.p>
      </div>
    </section>
  );
}