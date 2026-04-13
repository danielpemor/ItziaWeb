import { motion } from 'framer-motion';
import { Award, BookOpen, Users, Globe, Shield } from 'lucide-react';
import CountUp from '../blocks/CountUp';

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const qualifications = [
  { icon: BookOpen, label: 'DClinPsy', detail: 'University of Sheffield' },
  { icon: Award,    label: 'MSc Psychiatric Research', detail: "King's College London" },
  { icon: BookOpen, label: 'PGCert Low-Intensity CBT', detail: 'University College London' },
  { icon: Award,    label: 'UG Cert Public Policy', detail: 'University of Oxford' },
  { icon: Shield,   label: 'EMDR Standard Training', detail: 'EMDR UK certified' },
  { icon: Users,    label: 'ADI-R & ADOS-2 Training', detail: 'Neurodevelopmental assessment' },
];

const registrations = [
  { abbr: 'H', label: 'HCPC', detail: 'Registered Practitioner Psychologist' },
  { abbr: 'B', label: 'BPS',  detail: 'Chartered Member' },
  { abbr: 'E', label: 'EMDR', detail: 'EMDR UK Member' },
];

const specialisms = [
  'Trauma & PTSD',
  'Complex PTSD',
  'Anxiety Disorders',
  'OCD',
  'Health Anxiety',
  'Social Anxiety',
  'Panic Disorder',
  'Depression',
  'ADHD & Neurodiversity',
  'Personality Disorders',
  'Psychosis & Bipolar',
  'Perinatal Difficulties',
  'Chronic Health Conditions',
  'LGBTQIA+ Affirmative Care',
  'Identity & Attachment',
  'Relationship Difficulties',
];

const stats = [
  { value: 10,  suffix: '+', label: 'Years NHS & Private', duration: 1.5 },
  { value: 200, suffix: '+', label: 'Clients supported',   duration: 2 },
  { value: 4,   suffix: '',  label: 'Countries of practice', duration: 1 },
];

/* ═══════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════ */

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-28 relative overflow-hidden"
      style={{ background: '#ffffff' }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(29,78,95,0.15), transparent)',
        }}
      />

      <div className="section-container">

        {/* ═══════ TWO-COLUMN LAYOUT ═══════ */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT — Photo + Stats + Governing Bodies ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:sticky lg:top-28"
          >
            <div className="relative max-w-sm mx-auto lg:mx-0">

              {/* ── Photo ── */}
              <div
                className="w-full rounded-3xl overflow-hidden relative"
                style={{ aspectRatio: '3/4' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(160deg, #2a6b82 0%, #1D4E5F 60%, #0f2d38 100%)',
                  }}
                />

                <img
                  src="/images/dr-itzia-about.jpg"
                  alt="Dr. Itzia Perez Morales"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />

                {/* Bottom gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top,
                      rgba(15,45,56,0.95) 0%,
                      rgba(15,45,56,0.2) 45%,
                      transparent 65%
                    )`,
                  }}
                />

                {/* Profile info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <p className="font-display text-xl text-white font-medium leading-tight mb-0.5">
                    Dr. Itzia Perez Morales
                  </p>
                  <p
                    className="text-sm mb-4"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                  >
                    Highly Specialist Clinical Psychologist
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {registrations.map(({ label }) => (
                      <span
                        key={label}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: 'rgba(255,255,255,0.85)',
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* International badge */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-5 right-5 z-10"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.875rem',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Globe
                      size={13}
                      style={{ color: 'rgba(255,255,255,0.7)' }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                      UK · USA · Mexico · Palestine
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* ── Stats row ── */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {stats.map(({ value, suffix, label, duration }) => (
                  <div
                    key={label}
                    className="text-center p-3 rounded-xl"
                    style={{
                      background: 'rgba(29,78,95,0.04)',
                      border: '1px solid rgba(29,78,95,0.08)',
                    }}
                  >
                    <p className="font-display text-2xl font-medium" style={{ color: '#1C1917' }}>
                      <CountUp
                        to={value}
                        suffix={suffix}
                        duration={duration}
                      />
                    </p>
                    <p
                      className="text-xs mt-0.5 leading-tight"
                      style={{ color: '#78716C' }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Governing Bodies (moved here from right) ── */}
              <div className="mt-5">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: '#1D4E5F' }}
                >
                  Governing Bodies
                </p>
                <div className="space-y-2">
                  {registrations.map(({ abbr, label, detail }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{
                        background: 'rgba(29,78,95,0.04)',
                        border: '1px solid rgba(29,78,95,0.08)',
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                        style={{
                          background:
                            'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                        }}
                      >
                        {abbr}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-xs font-semibold"
                          style={{ color: '#1C1917' }}
                        >
                          {label}
                        </p>
                        <p className="text-xs" style={{ color: '#78716C' }}>
                          {detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative ring */}
              <div
                className="absolute -inset-3 rounded-[2.5rem] -z-10 pointer-events-none"
                style={{ border: '1px solid rgba(29,78,95,0.07)' }}
              />
            </div>
          </motion.div>

          {/* ── RIGHT — Bio + Qualifications + CTA ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-6"
              style={{
                background: 'rgba(29,78,95,0.07)',
                color: '#1D4E5F',
                border: '1px solid rgba(29,78,95,0.1)',
              }}
            >
              About
            </div>

            {/* Headline */}
            <h2
              className="font-display text-display-md leading-tight mb-6"
              style={{ color: '#1C1917' }}
            >
              Specialist care
              <br />
              <em
                className="not-italic"
                style={{
                  background:
                    'linear-gradient(135deg, #1D4E5F 0%, #7A9E7E 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                rooted in evidence.
              </em>
            </h2>
            
            {/* Bio — condensed to 2 paragraphs */}
            <div
              className="space-y-4 leading-relaxed mb-10 text-justify"
              style={{ color: '#44403C' }}
            >
              <p>
                I am a Highly Specialist Clinical Psychologist registered with the
                HCPC and holding Chartered Status with the BPS. With over 10
                years of experience across NHS primary care, community mental
                health, inpatient services, and specialist pathways, my work
                extends internationally across England, the USA, Palestine, and
                Mexico. I am a trauma specialist with expertise in anxiety
                disorders and complex trauma, including challenges relating to
                identity, attachment, relationships, and fears where trauma has
                had an impact.
              </p>
              <p>
                My clinical practice is structured, evidence-based, and
                patient-centred. After an initial assessment, we build a shared
                understanding of how your difficulties developed and what
                maintains them — then create a bespoke treatment plan integrating
                psychological theory, research evidence, lived experience,
                personal values, and current context. I am committed to providing
                an anti-discriminatory and inclusive service, recognising the
                impact of social, cultural, and systemic factors on mental health.
              </p>
            </div>

            {/* Qualifications — compact 2-col grid */}
            <div className="mb-10">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#1D4E5F' }}
              >
                Qualifications
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {qualifications.map(({ icon: Icon, label, detail }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{
                      background: 'rgba(29,78,95,0.03)',
                      border: '1px solid rgba(29,78,95,0.07)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(29,78,95,0.08)' }}
                    >
                      <Icon size={13} style={{ color: '#1D4E5F' }} />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium leading-tight"
                        style={{ color: '#1C1917' }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-[11px] leading-tight"
                        style={{ color: '#78716C' }}
                      >
                        {detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="flex flex-col sm:flex-row gap-3 p-5 rounded-2xl"
              style={{
                background: 'rgba(29,78,95,0.04)',
                border: '1px solid rgba(29,78,95,0.08)',
              }}
            >
              <a
                href="https://calendly.com/itzia-morales/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 text-sm font-medium rounded-xl text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
                }}
              >
                Free 15-min Consultation
              </a>
              <a
                href="/fees"
                className="flex-1 text-center py-3 text-sm font-medium rounded-xl bg-white transition-all hover:shadow-sm hover:-translate-y-0.5"
                style={{
                  border: '1.5px solid rgba(29,78,95,0.2)',
                  color: '#1D4E5F',
                }}
              >
                View Fees
              </a>
            </div>
          </motion.div>
        </div>

        {/* ═══════ FULL-WIDTH SPECIALISMS ═══════ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-20 pt-12"
          style={{
            borderTop: '1px solid rgba(29,78,95,0.08)',
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#1D4E5F' }}
            >
              Areas of Specialism
            </p>
            <p className="text-sm" style={{ color: '#78716C' }}>
              Children, adolescents, and adults
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {specialisms.map((spec, i) => (
              <motion.span
                key={spec}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025, duration: 0.35 }}
                whileHover={{ scale: 1.04 }}
                className="px-3.5 py-2 rounded-full text-xs font-medium cursor-default transition-colors duration-200"
                style={{
                  background: 'rgba(29,78,95,0.05)',
                  border: '1px solid rgba(29,78,95,0.1)',
                  color: '#1D4E5F',
                }}
              >
                {spec}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}