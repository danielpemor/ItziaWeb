import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Info, Sparkles } from 'lucide-react';
import { bookHref, consultHref, insuranceHref, OPENS_IN_SAME_TAB } from '../config/booking';

const consultTarget = OPENS_IN_SAME_TAB ? '_self' : '_blank';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

type ServiceType = 'assessment' | 'therapy' | 'emdr' | 'followup';
type SessionDuration = '50min' | '90min' | '2hr';
type SessionCount = 1 | 4 | 6 | 8 | 12 | 16;

type PricingResult = {
  label: string;
  total: number;
  perSession: number;
  saving: number;
  href: string;
  isBundle: boolean;
};

const services: {
  value: ServiceType;
  label: string;
  desc: string;
  durations: SessionDuration[];
}[] = [
  {
    value: 'assessment',
    label: 'Initial Assessment',
    desc: 'Comprehensive clinical interview and personalised formulation',
    durations: ['50min'],
  },
  {
    value: 'therapy',
    label: 'Psychological Therapy',
    desc: 'CBT, CAT, ACT or CFT — tailored to your needs',
    durations: ['50min'],
  },
  {
    value: 'emdr',
    label: 'EMDR Therapy',
    desc: 'Trauma processing — standard or extended sessions',
    durations: ['90min', '2hr'],
  },
  {
    value: 'followup',
    label: 'Follow-Up',
    desc: 'Post-discharge review and ongoing support',
    durations: ['50min'],
  },
];

const durationLabels: Record<SessionDuration, { label: string; mins: string }> = {
  '50min': { label: 'Standard', mins: '50 minutes' },
  '90min': { label: 'Extended', mins: '90 minutes' },
  '2hr':   { label: 'Intensive', mins: '2 hours' },
};

const individualPrices: Record<string, number> = {
  'assessment-50min': 140,
  'therapy-50min': 120,
  'emdr-90min': 180,
  'emdr-2hr': 240,
  'followup-50min': 60,
};

// Maps each fees-matrix entry to a Zanda service id (deep-linked into the
// booking widget). Payment is taken inside Zanda via Stripe — no per-service
// payment links needed any more.
// TODO(Zanda): align these ids with the service names you create in Zanda.
const zandaServiceId: Record<string, string> = {
  'assessment-50min': 'initial-assessment',
  'therapy-50min':    'psychological-intervention',
  'emdr-90min':       'emdr-90',
  'emdr-2hr':         'emdr-120',
  'followup-50min':   'follow-up',
};

// Bundle definitions: service-duration-sessions → display name + price.
// Bundles are booked through the same Zanda flow (as the base service);
// configure the package/payment inside Zanda.
const bundleData: Record<string, { name: string; total: number }> = {
  'therapy-50min-4':  { name: 'Monthly Sessions',   total: 450  },
  'therapy-50min-6':  { name: 'CBT Start',          total: 700  },
  'therapy-50min-8':  { name: 'CAT Start',          total: 940  },
  'therapy-50min-12': { name: 'CBT Full',           total: 1380 },
  'therapy-50min-16': { name: 'CAT Full',           total: 1850 },
  'emdr-90min-4':     { name: 'EMDR+ Monthly',      total: 700  },
  'emdr-90min-8':     { name: 'EMDR+ Intensive',    total: 1400 },
  'emdr-2hr-4':       { name: 'EMDR+ Monthly',      total: 900  },
  'emdr-2hr-8':       { name: 'EMDR+ Intensive',    total: 1800 },
};

function getSessionCounts(_service: ServiceType, _duration: SessionDuration): SessionCount[] {
  // Bundles/packages are PAUSED until Zanda's API supports selling multi-session
  // packages through the portal. For now we show transparent single-session
  // pricing only; packages are arranged directly after the initial assessment.
  // To re-enable later, restore the original logic that read from `bundleData`.
  return [1];
}

function getPricing(
  service: ServiceType,
  duration: SessionDuration,
  sessions: SessionCount,
): PricingResult | null {
  const key = `${service}-${duration}`;
  const unitPrice = individualPrices[key];
  if (!unitPrice) return null;

  if (sessions === 1) {
    return {
      label: services.find((s) => s.value === service)!.label,
      total: unitPrice,
      perSession: unitPrice,
      saving: 0,
      href: bookHref(zandaServiceId[key]),
      isBundle: false,
    };
  }

  const bundle = bundleData[`${key}-${sessions}`];
  if (!bundle) return null;

  const individualTotal = sessions * unitPrice;
  return {
    label: bundle.name,
    total: bundle.total,
    perSession: Math.round((bundle.total / sessions) * 100) / 100,
    saving: individualTotal - bundle.total,
    href: bookHref(zandaServiceId[key]),
    isBundle: true,
  };
}

function formatGBP(amount: number): string {
  if (Number.isInteger(amount)) return `£${amount.toLocaleString('en-GB')}`;
  return `£${amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function FeesPage() {
  const [service, setService] = useState<ServiceType>('therapy');
  const [duration, setDuration] = useState<SessionDuration>('50min');
  const [sessions, setSessions] = useState<SessionCount>(1);

  const activeService = services.find((s) => s.value === service)!;
  const availableDurations = activeService.durations;
  const activeDuration = availableDurations.includes(duration)
    ? duration
    : availableDurations[0];
  const availableSessions = getSessionCounts(service, activeDuration);
  const activeSessions = availableSessions.includes(sessions)
    ? sessions
    : availableSessions[0];

  const pricing = useMemo(
    () => getPricing(service, activeDuration, activeSessions),
    [service, activeDuration, activeSessions],
  );

  const individualTotal = activeSessions > 1
    ? activeSessions * (individualPrices[`${service}-${activeDuration}`] || 0)
    : 0;

  return (
    <div>
      {/* ═══════ HERO ═══════ */}
      <section className="pt-32 pb-14 relative" style={{ background: '#FAF8F4' }}>
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.03] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #1D4E5F 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div className="section-container relative z-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-8 transition-colors"
            style={{ color: '#78716C' }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M8 3L4 7.5L8 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
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
              style={{
                background: 'rgba(29,78,95,0.07)',
                color: '#1D4E5F',
                border: '1px solid rgba(29,78,95,0.1)',
              }}
            >
              Fees &amp; Pricing
            </div>
            <h1
              className="font-display text-display-md leading-tight mb-4"
              style={{ color: '#1C1917' }}
            >
              Choose your service,
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
                book instantly.
              </em>
            </h1>
            <p style={{ color: '#44403C' }} className="leading-relaxed">
              Transparent, per-session pricing — no hidden fees.
              All fees are agreed at your initial enquiry.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ CONFIGURATOR ═══════ */}
      <section className="py-16" style={{ background: '#ffffff' }}>
        <div className="section-container">
          <div className="grid lg:grid-cols-[1fr,380px] gap-10">
            {/* ── LEFT: Options ── */}
            <div className="space-y-10">
              {/* Step 1: Service */}
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-4"
                  style={{ color: '#1D4E5F' }}
                >
                  1. What do you need?
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((svc) => {
                    const active = service === svc.value;
                    return (
                      <button
                        key={svc.value}
                        onClick={() => {
                          setService(svc.value);
                          setSessions(1);
                        }}
                        className="p-4 rounded-xl text-left transition-all duration-200"
                        style={{
                          background: active ? 'rgba(29,78,95,0.07)' : '#FAFAF9',
                          border: `1.5px solid ${active ? '#1D4E5F' : 'rgba(0,0,0,0.05)'}`,
                        }}
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div
                            className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                            style={{ borderColor: active ? '#1D4E5F' : '#D1D5DB' }}
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
                            {svc.label}
                          </span>
                        </div>
                        <p
                          className="text-[11px] ml-[26px] leading-relaxed"
                          style={{ color: '#78716C' }}
                        >
                          {svc.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Duration (only if multiple options) */}
              {availableDurations.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: '#1D4E5F' }}
                  >
                    2. Session length
                  </p>
                  <div className="flex gap-3">
                    {availableDurations.map((dur) => {
                      const active = activeDuration === dur;
                      const dl = durationLabels[dur];
                      return (
                        <button
                          key={dur}
                          onClick={() => {
                            setDuration(dur);
                            setSessions(1);
                          }}
                          className="flex-1 p-4 rounded-xl text-center transition-all duration-200"
                          style={{
                            background: active ? 'rgba(29,78,95,0.07)' : '#FAFAF9',
                            border: `1.5px solid ${active ? '#1D4E5F' : 'rgba(0,0,0,0.05)'}`,
                          }}
                        >
                          <span
                            className="font-display text-base font-medium block"
                            style={{ color: active ? '#1D4E5F' : '#1C1917' }}
                          >
                            {dl.label}
                          </span>
                          <span
                            className="text-[11px] block mt-0.5"
                            style={{ color: '#78716C' }}
                          >
                            {dl.mins}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Sessions (only if bundles available) */}
              {availableSessions.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-widest mb-4"
                    style={{ color: '#1D4E5F' }}
                  >
                    {availableDurations.length > 1 ? '3' : '2'}. How many sessions?
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {availableSessions.map((count) => {
                      const active = activeSessions === count;
                      const key = `${service}-${activeDuration}-${count}`;
                      const bundle = bundleData[key];
                      const isIndividual = count === 1;

                      return (
                        <button
                          key={count}
                          onClick={() => setSessions(count)}
                          className="p-4 rounded-xl text-left transition-all duration-200 min-w-[130px]"
                          style={{
                            background: active ? 'rgba(29,78,95,0.07)' : '#FAFAF9',
                            border: `1.5px solid ${active ? '#1D4E5F' : 'rgba(0,0,0,0.05)'}`,
                          }}
                        >
                          <span
                            className="font-display text-base font-medium block"
                            style={{ color: active ? '#1D4E5F' : '#1C1917' }}
                          >
                            {isIndividual ? 'Single session' : `${count} sessions`}
                          </span>
                          {bundle ? (
                            <span
                              className="text-[11px] font-medium block mt-0.5"
                              style={{ color: '#7A9E7E' }}
                            >
                              Save {formatGBP(
                                count * (individualPrices[`${service}-${activeDuration}`] || 0) -
                                  bundle.total,
                              )}
                            </span>
                          ) : (
                            <span
                              className="text-[11px] block mt-0.5"
                              style={{ color: '#78716C' }}
                            >
                              Pay per session
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Free consultation nudge */}
              <div
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(122,158,126,0.06)',
                  border: '1px solid rgba(122,158,126,0.12)',
                }}
              >
                <Sparkles
                  size={15}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#7A9E7E' }}
                />
                <div>
                  <p
                    className="text-sm font-medium mb-0.5"
                    style={{ color: '#1C1917' }}
                  >
                    Not sure yet?
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: '#78716C' }}>
                    Start with a{' '}
                    <a
                      href={consultHref()}
                      target={consultTarget}
                      rel="noopener noreferrer"
                      className="underline underline-offset-2"
                      style={{ color: '#1D4E5F' }}
                    >
                      free 15-minute consultation
                    </a>{' '}
                    to discuss your needs — no commitment required.
                  </p>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Summary card ── */}
            <div className="lg:sticky lg:top-28 self-start">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${service}-${activeDuration}-${activeSessions}`}
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
                  {/* Card header */}
                  <div
                    className="px-6 py-5"
                    style={{
                      background: 'linear-gradient(135deg, #0f2d38, #1D4E5F)',
                    }}
                  >
                    <p
                      className="text-[11px] font-medium uppercase tracking-widest mb-1"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {pricing?.isBundle ? 'Bundle' : 'Single session'}
                    </p>
                    <p className="font-display text-xl text-white">
                      {pricing?.label || 'Select a service'}
                    </p>
                  </div>

                  <div className="p-6 space-y-4">
                    {pricing ? (
                      <>
                        {/* Details */}
                        <div className="space-y-2.5">
                          <div className="flex justify-between text-sm">
                            <span style={{ color: '#78716C' }}>Service</span>
                            <span
                              className="font-medium text-right"
                              style={{ color: '#1C1917' }}
                            >
                              {activeService.label}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: '#78716C' }}>Duration</span>
                            <span className="font-medium" style={{ color: '#1C1917' }}>
                              {durationLabels[activeDuration].mins}
                            </span>
                          </div>
                          {activeSessions > 1 && (
                            <div className="flex justify-between text-sm">
                              <span style={{ color: '#78716C' }}>Sessions</span>
                              <span
                                className="font-medium"
                                style={{ color: '#1C1917' }}
                              >
                                {activeSessions}
                              </span>
                            </div>
                          )}
                        </div>

                        <div
                          className="h-px"
                          style={{ background: 'rgba(0,0,0,0.06)' }}
                        />

                        {/* Price */}
                        {pricing.isBundle && (
                          <div className="flex justify-between items-center text-sm">
                            <span style={{ color: '#78716C' }}>
                              Without bundle
                            </span>
                            <span
                              className="line-through"
                              style={{ color: '#D1D5DB' }}
                            >
                              {formatGBP(individualTotal)}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-end">
                          <span className="text-sm" style={{ color: '#78716C' }}>
                            {pricing.isBundle ? 'Bundle price' : 'Session fee'}
                          </span>
                          <span
                            className="font-display text-3xl font-semibold"
                            style={{
                              background:
                                'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                            }}
                          >
                            {formatGBP(pricing.total)}
                          </span>
                        </div>

                        {/* Saving badge */}
                        {pricing.saving > 0 && (
                          <div
                            className="flex items-center gap-2 px-3 py-2 rounded-lg"
                            style={{ background: 'rgba(122,158,126,0.08)' }}
                          >
                            <Check size={14} style={{ color: '#7A9E7E' }} />
                            <span
                              className="text-xs font-medium"
                              style={{ color: '#5a7d5e' }}
                            >
                              You save {formatGBP(pricing.saving)} —{' '}
                              {formatGBP(pricing.perSession)}/session
                            </span>
                          </div>
                        )}

                        {/* CTA */}
                        <a
                          href={pricing.href}
                          target={consultTarget}
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2.5 py-4 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 mt-2"
                          style={{
                            background:
                              'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                          }}
                        >
                          {`Book ${formatGBP(pricing.total)}`}
                          <ArrowRight size={15} />
                        </a>

                        <p
                          className="text-center text-[11px]"
                          style={{ color: '#78716C' }}
                        >
                          You'll choose a date &amp; time and pay securely on the next step.
                        </p>
                      </>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm" style={{ color: '#78716C' }}>
                          Select a service to see pricing
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Info note */}
              <div
                className="mt-4 flex items-start gap-2.5 p-4 rounded-xl"
                style={{ background: 'rgba(29,78,95,0.04)' }}
              >
                <Info
                  size={14}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: '#1D4E5F' }}
                />
                <p
                  className="text-[11px] leading-relaxed"
                  style={{ color: '#78716C' }}
                >
                  Bundles available after initial assessment.
                  Cancellations within 48h charged at full rate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ BOTTOM CTA ═══════ */}
      <section className="py-16" style={{ background: '#F7F4EF' }}>
        <div className="section-container text-center">
          <p
            className="font-display text-display-sm mb-3"
            style={{ color: '#1C1917' }}
          >
            Not sure where to start?
          </p>
          <p className="text-sm mb-8" style={{ color: '#78716C' }}>
            Book a free 15-minute consultation and I'll help you
            find the right option.
          </p>
          <a
            href={consultHref()}
            target={consultTarget}
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-4 text-white font-medium rounded-full text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            style={{
              background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
            }}
          >
            Book Free Consultation
            <ArrowRight size={15} />
          </a>
          <p className="text-sm mt-5" style={{ color: '#78716C' }}>
            Using health insurance?{' '}
            <a
              href={insuranceHref()}
              className="font-medium underline underline-offset-2"
              style={{ color: '#1D4E5F' }}
            >
              Send us your authorisation details
            </a>{' '}
            and we'll book you in — no online payment needed.
          </p>
        </div>
      </section>
    </div>
  );
}