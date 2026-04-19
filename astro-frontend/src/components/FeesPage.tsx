import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Info, Sparkles } from 'lucide-react';

/* ═══════════════════════════════════════════
   TYPES & DATA
   ═══════════════════════════════════════════ */

type SessionDuration = '50min' | '90min' | '2hr';
type TherapyType = 'cbt' | 'cat' | 'emdr';
type SessionCount = 4 | 6 | 8 | 12 | 16;

type PricingOption = {
  therapy: TherapyType;
  duration: SessionDuration;
  sessions: SessionCount;
  bundleName: string;
  total: number;
  perSession: number;
  saving: number;
  stripeUrl: string;
};

const individualPrices: Record<SessionDuration, number> = {
  '50min': 120,
  '90min': 180,
  '2hr': 240,
};

// All available bundle combinations
const bundles: PricingOption[] = [
  // Monthly (4 sessions — any therapy at 50min)
  {
    therapy: 'cbt', duration: '50min', sessions: 4,
    bundleName: 'Monthly Sessions', total: 450, perSession: 112.5, saving: 30,
    stripeUrl: 'STRIPE_LINK_MONTHLY',
  },
  {
    therapy: 'cat', duration: '50min', sessions: 4,
    bundleName: 'Monthly Sessions', total: 450, perSession: 112.5, saving: 30,
    stripeUrl: 'STRIPE_LINK_MONTHLY',
  },

  // CBT
  {
    therapy: 'cbt', duration: '50min', sessions: 6,
    bundleName: 'CBT Start', total: 700, perSession: 116.67, saving: 20,
    stripeUrl: 'STRIPE_LINK_CBT_START',
  },
  {
    therapy: 'cbt', duration: '50min', sessions: 12,
    bundleName: 'CBT Full', total: 1380, perSession: 115, saving: 60,
    stripeUrl: 'STRIPE_LINK_CBT_FULL',
  },

  // CAT
  {
    therapy: 'cat', duration: '50min', sessions: 8,
    bundleName: 'CAT Start', total: 940, perSession: 117.5, saving: 20,
    stripeUrl: 'STRIPE_LINK_CAT_START',
  },
  {
    therapy: 'cat', duration: '50min', sessions: 16,
    bundleName: 'CAT Full', total: 1850, perSession: 115.63, saving: 70,
    stripeUrl: 'STRIPE_LINK_CAT_FULL',
  },

  // EMDR 90min
  {
    therapy: 'emdr', duration: '90min', sessions: 4,
    bundleName: 'EMDR+ Monthly', total: 700, perSession: 175, saving: 20,
    stripeUrl: 'STRIPE_LINK_EMDR_M90',
  },
  {
    therapy: 'emdr', duration: '90min', sessions: 8,
    bundleName: 'EMDR+ Intensive', total: 1400, perSession: 175, saving: 40,
    stripeUrl: 'STRIPE_LINK_EMDR_I90',
  },

  // EMDR 2hr
  {
    therapy: 'emdr', duration: '2hr', sessions: 4,
    bundleName: 'EMDR+ Monthly', total: 900, perSession: 225, saving: 60,
    stripeUrl: 'STRIPE_LINK_EMDR_M2H',
  },
  {
    therapy: 'emdr', duration: '2hr', sessions: 8,
    bundleName: 'EMDR+ Intensive', total: 1800, perSession: 225, saving: 120,
    stripeUrl: 'STRIPE_LINK_EMDR_I2H',
  },
];

const therapyOptions: { value: TherapyType; label: string; desc: string }[] = [
  { value: 'cbt', label: 'CBT', desc: 'Cognitive Behavioural Therapy' },
  { value: 'cat', label: 'CAT', desc: 'Cognitive Analytic Therapy' },
  { value: 'emdr', label: 'EMDR', desc: 'Eye Movement Desensitisation & Reprocessing' },
];

const durationOptions: { value: SessionDuration; label: string; mins: string }[] = [
  { value: '50min', label: 'Standard', mins: '50 minutes' },
  { value: '90min', label: 'Extended', mins: '90 minutes' },
  { value: '2hr', label: 'Intensive', mins: '2 hours' },
];

function getAvailableDurations(therapy: TherapyType): SessionDuration[] {
  if (therapy === 'emdr') return ['90min', '2hr'];
  return ['50min'];
}

function getAvailableSessions(therapy: TherapyType, duration: SessionDuration): SessionCount[] {
  return bundles
    .filter((b) => b.therapy === therapy && b.duration === duration)
    .map((b) => b.sessions)
    .sort((a, b) => a - b);
}

function formatGBP(amount: number): string {
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: amount % 1 ? 2 : 0 })}`;
}

/* ═══════════════════════════════════════════
   INDIVIDUAL SERVICES (top cards)
   ═══════════════════════════════════════════ */

const individualServices = [
  {
    name: 'Free Consultation',
    duration: '15 minutes',
    price: 'Free',
    desc: 'Discuss your goals, preferences, and how I can help.',
    href: 'https://calendly.com/itzia-morales/30min',
    external: true,
    accent: 'sage' as const,
  },
  {
    name: 'Initial Assessment',
    duration: '60 minutes',
    price: '£140',
    desc: 'Comprehensive clinical interview leading to a personalised formulation.',
    href: 'CALENDLY_ASSESSMENT_LINK',
    external: true,
    accent: 'teal' as const,
  },
  {
    name: 'Therapy Session',
    duration: '50 minutes',
    price: '£120',
    desc: 'CBT, CAT, ACT or CFT — adapted to your needs.',
    href: 'CALENDLY_THERAPY_LINK',
    external: true,
    accent: 'teal' as const,
  },
  {
    name: 'EMDR 90 min',
    duration: '90 minutes',
    price: '£180',
    desc: 'Extended trauma processing session.',
    href: 'CALENDLY_EMDR90_LINK',
    external: true,
    accent: 'terra' as const,
  },
  {
    name: 'EMDR 2 hours',
    duration: '2 hours',
    price: '£240',
    desc: 'Intensive EMDR session for complex trauma.',
    href: 'CALENDLY_EMDR2H_LINK',
    external: true,
    accent: 'terra' as const,
  },
  {
    name: 'Follow-Up',
    duration: '30 minutes',
    price: '£60',
    desc: 'Post-discharge review and support.',
    href: 'CALENDLY_FOLLOWUP_LINK',
    external: true,
    accent: 'teal' as const,
  },
];

const accentColors = {
  sage: { bg: 'rgba(122,158,126,0.08)', border: 'rgba(122,158,126,0.15)', text: '#5a7d5e', btn: 'linear-gradient(135deg, #7A9E7E, #5a7d5e)' },
  teal: { bg: 'rgba(29,78,95,0.06)', border: 'rgba(29,78,95,0.1)', text: '#1D4E5F', btn: 'linear-gradient(135deg, #1D4E5F, #2a6b82)' },
  terra: { bg: 'rgba(193,125,92,0.06)', border: 'rgba(193,125,92,0.12)', text: '#C17D5C', btn: 'linear-gradient(135deg, #C17D5C, #d4936f)' },
};

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function FeesPage() {
  const [therapy, setTherapy] = useState<TherapyType>('cbt');
  const [duration, setDuration] = useState<SessionDuration>('50min');
  const [sessions, setSessions] = useState<SessionCount | null>(null);

  // Auto-adjust duration when therapy changes
  const availableDurations = getAvailableDurations(therapy);
  const activeDuration = availableDurations.includes(duration)
    ? duration
    : availableDurations[0];

  const availableSessions = getAvailableSessions(therapy, activeDuration);

  // Auto-select first valid session count
  const activeSessions =
    sessions && availableSessions.includes(sessions) ? sessions : availableSessions[0] || null;

  // Find matching bundle
  const selectedBundle = useMemo(
    () =>
      bundles.find(
        (b) =>
          b.therapy === therapy &&
          b.duration === activeDuration &&
          b.sessions === activeSessions,
      ) || null,
    [therapy, activeDuration, activeSessions],
  );

  // Individual price for comparison
  const individualTotal = activeSessions
    ? activeSessions * individualPrices[activeDuration]
    : 0;

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section className="pt-32 pb-16 relative" style={{ background: '#FAF8F4' }}>
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1D4E5F 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div className="section-container relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: '#78716C' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M8 3L4 7.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Back to home
          </a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-5"
              style={{ background: 'rgba(29,78,95,0.07)', color: '#1D4E5F', border: '1px solid rgba(29,78,95,0.1)' }}
            >
              Fees &amp; Pricing
            </div>
            <h1
              className="font-display text-display-md leading-tight mb-4"
              style={{ color: '#1C1917' }}
            >
              Transparent fees,
              <br />
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #1D4E5F, #7A9E7E)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                no surprises.
              </em>
            </h1>
            <p style={{ color: '#44403C' }} className="leading-relaxed">
              All fees are agreed at the time of initial enquiry. Book and pay
              individual sessions directly, or choose a bundle after your
              assessment for the best value.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ INDIVIDUAL SESSIONS ═══════ */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="section-container">
          <h2
            className="font-display text-display-sm mb-2"
            style={{ color: '#1C1917' }}
          >
            Individual sessions
          </h2>
          <p className="text-sm mb-10" style={{ color: '#78716C' }}>
            Book and pay per session — no commitment required.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {individualServices.map((svc, i) => {
              const a = accentColors[svc.accent];
              return (
                <motion.a
                  key={svc.name}
                  href={svc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="group p-5 rounded-2xl flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                  style={{ background: '#fff', border: `1px solid ${a.border}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ background: a.bg, color: a.text }}
                    >
                      {svc.duration}
                    </span>
                    <span
                      className="font-display text-xl font-semibold"
                      style={{
                        background: a.btn,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {svc.price}
                    </span>
                  </div>
                  <h3
                    className="font-display text-lg mb-1"
                    style={{ color: '#1C1917' }}
                  >
                    {svc.name}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#78716C' }}>
                    {svc.desc}
                  </p>
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-medium transition-all group-hover:gap-2.5"
                    style={{ color: a.text }}
                  >
                    Book now
                    <ArrowRight size={12} />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ BUNDLE CONFIGURATOR ═══════ */}
      <section className="py-16" style={{ background: '#F7F4EF' }}>
        <div className="section-container">
          <div className="max-w-xl mb-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} style={{ color: '#C17D5C' }} />
              <span
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: '#C17D5C' }}
              >
                Save with bundles
              </span>
            </div>
            <h2
              className="font-display text-display-sm mb-2"
              style={{ color: '#1C1917' }}
            >
              Build your package
            </h2>
            <p className="text-sm" style={{ color: '#78716C' }}>
              Available after your initial assessment. Choose your therapy,
              session length, and number of sessions.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1fr,380px] gap-8">
            {/* ── LEFT: Configurator ── */}
            <div className="space-y-8">
              {/* Step 1: Therapy */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#1D4E5F' }}
                >
                  1. Choose therapy
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {therapyOptions.map((opt) => {
                    const active = therapy === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setTherapy(opt.value);
                          setSessions(null);
                        }}
                        className="p-4 rounded-xl text-left transition-all duration-200"
                        style={{
                          background: active ? 'rgba(29,78,95,0.08)' : '#fff',
                          border: `1.5px solid ${active ? '#1D4E5F' : 'rgba(0,0,0,0.06)'}`,
                        }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: active ? '#1D4E5F' : '#D1D5DB',
                            }}
                          >
                            {active && (
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ background: '#1D4E5F' }}
                              />
                            )}
                          </div>
                          <span
                            className="font-display text-base font-medium"
                            style={{ color: active ? '#1D4E5F' : '#1C1917' }}
                          >
                            {opt.label}
                          </span>
                        </div>
                        <p className="text-[11px] ml-6" style={{ color: '#78716C' }}>
                          {opt.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#1D4E5F' }}
                >
                  2. Session length
                </p>
                <div className="flex flex-wrap gap-3">
                  {durationOptions.map((opt) => {
                    const available = availableDurations.includes(opt.value);
                    const active = activeDuration === opt.value && available;
                    return (
                      <button
                        key={opt.value}
                        disabled={!available}
                        onClick={() => {
                          setDuration(opt.value);
                          setSessions(null);
                        }}
                        className="px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                        style={{
                          background: active
                            ? 'rgba(29,78,95,0.08)'
                            : available
                              ? '#fff'
                              : '#F9FAFB',
                          border: `1.5px solid ${active ? '#1D4E5F' : available ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)'}`,
                          color: active
                            ? '#1D4E5F'
                            : available
                              ? '#1C1917'
                              : '#D1D5DB',
                          cursor: available ? 'pointer' : 'not-allowed',
                          opacity: available ? 1 : 0.5,
                        }}
                      >
                        <span className="block">{opt.label}</span>
                        <span
                          className="block text-[11px] font-normal mt-0.5"
                          style={{ color: active ? '#1D4E5F' : '#78716C' }}
                        >
                          {opt.mins}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Sessions */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#1D4E5F' }}
                >
                  3. Number of sessions
                </p>
                {availableSessions.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {availableSessions.map((count) => {
                      const active = activeSessions === count;
                      const bundle = bundles.find(
                        (b) =>
                          b.therapy === therapy &&
                          b.duration === activeDuration &&
                          b.sessions === count,
                      );
                      return (
                        <button
                          key={count}
                          onClick={() => setSessions(count)}
                          className="px-5 py-3 rounded-xl text-left transition-all duration-200"
                          style={{
                            background: active ? 'rgba(29,78,95,0.08)' : '#fff',
                            border: `1.5px solid ${active ? '#1D4E5F' : 'rgba(0,0,0,0.06)'}`,
                            minWidth: 120,
                          }}
                        >
                          <span
                            className="font-display text-lg font-medium block"
                            style={{ color: active ? '#1D4E5F' : '#1C1917' }}
                          >
                            {count} sessions
                          </span>
                          {bundle && (
                            <span
                              className="text-[11px] font-medium"
                              style={{ color: '#7A9E7E' }}
                            >
                              Save {formatGBP(bundle.saving)}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: '#78716C' }}>
                    No bundles available for this combination.
                  </p>
                )}
              </div>
            </div>

            {/* ── RIGHT: Summary card ── */}
            <div className="lg:sticky lg:top-28 self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${therapy}-${activeDuration}-${activeSessions}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(29,78,95,0.1)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  }}
                >
                  {/* Header */}
                  <div
                    className="px-6 py-5"
                    style={{
                      background:
                        'linear-gradient(135deg, #0f2d38, #1D4E5F)',
                    }}
                  >
                    <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      Your package
                    </p>
                    <p className="font-display text-xl text-white">
                      {selectedBundle?.bundleName || 'Select options'}
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Details */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#78716C' }}>Therapy</span>
                        <span className="font-medium" style={{ color: '#1C1917' }}>
                          {therapyOptions.find((t) => t.value === therapy)?.label}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#78716C' }}>Session length</span>
                        <span className="font-medium" style={{ color: '#1C1917' }}>
                          {durationOptions.find((d) => d.value === activeDuration)?.mins}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: '#78716C' }}>Sessions</span>
                        <span className="font-medium" style={{ color: '#1C1917' }}>
                          {activeSessions || '—'}
                        </span>
                      </div>
                    </div>

                    <div
                      className="h-px"
                      style={{ background: 'rgba(0,0,0,0.06)' }}
                    />

                    {/* Pricing */}
                    {selectedBundle ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: '#78716C' }}>Individual total</span>
                          <span
                            className="line-through"
                            style={{ color: '#D1D5DB' }}
                          >
                            {formatGBP(individualTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span style={{ color: '#78716C' }}>Bundle price</span>
                          <span
                            className="font-display text-2xl font-semibold"
                            style={{
                              background:
                                'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {formatGBP(selectedBundle.total)}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 px-3 py-2 rounded-lg"
                          style={{ background: 'rgba(122,158,126,0.08)' }}
                        >
                          <Check size={14} style={{ color: '#7A9E7E' }} />
                          <span
                            className="text-xs font-medium"
                            style={{ color: '#5a7d5e' }}
                          >
                            You save {formatGBP(selectedBundle.saving)} —{' '}
                            {formatGBP(selectedBundle.perSession)}/session
                          </span>
                        </div>

                        <a
                          href={selectedBundle.stripeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
                          style={{
                            background:
                              'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                          }}
                        >
                          Pay {formatGBP(selectedBundle.total)}
                          <ArrowRight size={15} />
                        </a>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p
                          className="text-sm"
                          style={{ color: '#78716C' }}
                        >
                          Choose your options to see pricing
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Note */}
              <div
                className="mt-4 flex items-start gap-2.5 p-4 rounded-xl"
                style={{ background: 'rgba(29,78,95,0.04)' }}
              >
                <Info
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#1D4E5F' }}
                />
                <p className="text-[11px] leading-relaxed" style={{ color: '#78716C' }}>
                  Bundles are available after your initial assessment.
                  Cancellations within 48 hours are charged at the full
                  session rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA ═══════ */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="section-container text-center">
          <p
            className="font-display text-display-sm mb-3"
            style={{ color: '#1C1917' }}
          >
            Not sure where to start?
          </p>
          <p className="text-sm mb-8" style={{ color: '#78716C' }}>
            Book a free 15-minute consultation and I'll help you find the right
            option.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://calendly.com/itzia-morales/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 text-white font-medium rounded-full text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
              style={{
                background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
              }}
            >
              Book Free Consultation
              <ArrowRight size={15} />
            </a>
            <a
              href="/#faq"
              className="inline-flex items-center gap-2 px-8 py-4 font-medium rounded-full text-sm bg-white transition-all"
              style={{
                border: '1.5px solid rgba(29,78,95,0.2)',
                color: '#1D4E5F',
              }}
            >
              Read FAQ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}