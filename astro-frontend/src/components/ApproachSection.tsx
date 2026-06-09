import { motion } from 'framer-motion';
import { bookHref, consultHref, OPENS_IN_SAME_TAB } from '../config/booking';

const consultTarget = OPENS_IN_SAME_TAB ? '_self' : '_blank';

const steps = [
  {
    number: '01',
    title: 'Free Consultation',
    description:
      'A brief 15-minute conversation to discuss your main difficulties, goals, and preferences — and to see if we\u2019re a good fit. No commitment, no referral needed.',
    accent: {
      bg: 'rgba(29,78,95,0.06)',
      text: '#1D4E5F',
      border: 'rgba(29,78,95,0.12)',
      num: 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
    },
  },
  {
    number: '02',
    title: 'Initial Assessment',
    description:
      'A thorough 60-minute session to explore your background, strengths, and context. Together we build a formulation — a collaborative map of how difficulties developed and what keeps them going.',
    accent: {
      bg: 'rgba(193,125,92,0.06)',
      text: '#C17D5C',
      border: 'rgba(193,125,92,0.15)',
      num: 'linear-gradient(135deg, #C17D5C, #d4936f)',
    },
  },
  {
    number: '03',
    title: 'Evidence-Based Therapy',
    description:
      'Guided by your formulation, I draw on CBT, EMDR, CAT, or an integrative approach — adapting to your needs, pace, and goals while following the strongest research evidence.',
    accent: {
      bg: 'rgba(29,78,95,0.06)',
      text: '#1D4E5F',
      border: 'rgba(29,78,95,0.12)',
      num: 'linear-gradient(135deg, #1D4E5F, #7A9E7E)',
    },
  },
  {
    number: '04',
    title: 'Review & Follow-Up',
    description:
      'We regularly review progress to keep therapy on track. On completion, discharge includes relapse prevention strategies, self-help resources, and the option of follow-up sessions.',
    accent: {
      bg: 'rgba(193,125,92,0.06)',
      text: '#C17D5C',
      border: 'rgba(193,125,92,0.15)',
      num: 'linear-gradient(135deg, #C17D5C, #1D4E5F)',
    },
  },
];

export default function ApproachSection() {
  return (
    <section
      id="approach"
      className="py-28 relative overflow-hidden"
      style={{ background: '#F0F5F6' }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(29,78,95,0.15), transparent)',
        }}
      />

      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #C17D5C 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="section-container">
        {/* ── Header ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20 items-end">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5"
              style={{
                background: 'rgba(29,78,95,0.08)',
                color: '#1D4E5F',
                border: '1px solid rgba(29,78,95,0.12)',
              }}
            >
              My Approach
            </div>
            <h2 className="font-display text-display-md leading-tight" style={{ color: '#1C1917' }}>
              How we'll work
              <br />
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #1D4E5F 0%, #C17D5C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                together
              </em>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="leading-relaxed"
            style={{ color: '#44403C' }}
          >
            Therapy is a collaboration. I bring clinical expertise and
            evidence-based methods; you bring your lived experience and
            willingness to explore. Together, we create meaningful change.
          </motion.p>
        </div>

        {/* ── Step cards ── */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div
                className="bg-white rounded-2xl p-7 h-full relative overflow-hidden group hover:shadow-lg transition-all duration-500"
                style={{ border: `1px solid ${step.accent.border}` }}
              >
                {/* Hover fill */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: step.accent.bg }}
                />

                <div className="relative z-10">
                  {/* Number badge */}
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl text-white font-display text-lg font-medium mb-6"
                    style={{ background: step.accent.num }}
                  >
                    {step.number}
                  </div>

                  <h3
                    className="font-display text-xl mb-3"
                    style={{ color: '#1C1917' }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: '#44403C' }}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── CTA Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 relative overflow-hidden rounded-3xl p-10 lg:p-14"
          style={{
            background:
              'linear-gradient(135deg, #0f2d38 0%, #1D4E5F 50%, #2a6b82 100%)',
          }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          {/* Terra glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full opacity-20"
            style={{
              background:
                'radial-gradient(circle, #C17D5C 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div>
              <h3 className="font-display text-3xl text-white mb-3">
                Ready to take the first step?
              </h3>
              <p
                className="max-w-lg leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Start with a free 15-minute consultation — no commitment, no
                referral needed. Or book a session directly if you already know
                what you need.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href={consultHref()}
                target={consultTarget}
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-white font-medium rounded-full text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: '#C17D5C' }}
              >
                Free Consultation
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href={bookHref()}
                className="inline-flex items-center gap-2.5 px-8 py-4 font-medium rounded-full text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Book a Session
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}