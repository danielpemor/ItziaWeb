import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/* ─── Real FAQ data ─── */
const faqs = [
  {
    question: 'What happens during the free consultation?',
    answer:
      'The free 15-minute consultation is an opportunity for us to briefly discuss your main difficulties, goals, and preferences. It also allows you to ask questions about the service, fees, and how I work. There is no pressure or commitment — it\u2019s simply a chance to see whether we\u2019re a good fit.',
  },
  {
    question: 'What can I expect from the initial assessment?',
    answer:
      'The initial assessment is a 60-minute session where we explore your main difficulties, their impact, and your background in detail. Together we build a formulation — a collaborative map of how your difficulties developed, what keeps them going, and how they can be changed. This formulation guides the treatment plan, ensuring therapy is evidence-based, tailored, and responsive to your individual context.',
  },
  {
    question: 'How long does therapy usually last?',
    answer:
      'It depends on the difficulty and approach. CBT and CAT are time-limited approaches that typically last between 7 and 20 sessions. For difficulties with a longer history, or when using EMDR or integrated approaches, therapy may last longer. We discuss expected duration during the assessment so you have a clear picture from the start.',
  },
  {
    question: 'What therapeutic approaches do you use?',
    answer:
      'I primarily use Cognitive Behavioural Therapy (CBT), Eye Movement Desensitisation and Reprocessing (EMDR), and Cognitive Analytic Therapy (CAT). I also integrate Acceptance and Commitment Therapy (ACT) and Compassion-Focused Therapy (CFT) when appropriate. The choice of approach is guided by your formulation, the research evidence, and your personal preferences.',
  },
  {
    question: 'Do you work with children and adolescents?',
    answer:
      'Yes. I offer one-to-one online sessions for children, adolescents, adults, and older adults. Interventions are adapted to each individual\u2019s developmental stage, communication style, sensory needs, and cognitive profile.',
  },
  {
    question: 'Are sessions online or in-person?',
    answer:
      'All sessions are currently delivered online via a secure video platform. This allows flexibility in scheduling and means you can access therapy from anywhere in the UK.',
  },
  {
    question: 'Do you accept insurance?',
    answer:
      'Yes. I am a registered provider with AXA, Aviva, Cigna, Healix, and Vitality. Please contact your insurer to confirm your cover and obtain an authorisation number before your first session. You can also get in touch directly for more information about insured fees and bookings.',
  },
  {
    question: 'What is the cancellation policy?',
    answer:
      'Cancellations made more than 48 hours before the scheduled appointment are free of charge. Late cancellations — those made within 48 hours — are charged at the full session rate unless the session can be rescheduled within the same week.',
  },
  {
    question: 'How do I know which therapy is right for me?',
    answer:
      'You don\u2019t need to decide before starting. The initial assessment is designed to build a shared understanding of your difficulties, from which I recommend the most appropriate evidence-based approach. We discuss options together so the treatment plan reflects both the clinical evidence and your preferences.',
  },
  {
    question: 'What are your fees?',
    answer:
      'The initial assessment is \u00A3140 per hour for self-funded clients and \u00A3120 for insured clients. Standard therapy sessions (50 minutes) are \u00A3120. Extended EMDR sessions are available at \u00A3180 for 90 minutes and \u00A3240 for 2 hours. I also offer session bundles for self-funded clients after the initial assessment. Visit the Fees page for full details.',
  },
];

/* ─── Single accordion row ─── */
function FAQItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: (typeof faqs)[number];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="border-b transition-colors duration-300"
        style={{ borderColor: isOpen ? 'rgba(29,78,95,0.18)' : 'rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 py-6 text-left group"
          aria-expanded={isOpen}
        >
          <span
            className="font-display text-lg md:text-xl transition-colors duration-300"
            style={{ color: isOpen ? '#1D4E5F' : '#1C1917' }}
          >
            {faq.question}
          </span>

          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300"
            style={{
              background: isOpen ? 'rgba(29,78,95,0.1)' : 'rgba(0,0,0,0.04)',
              color: isOpen ? '#1D4E5F' : '#78716C',
            }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p
                className="pb-6 pr-12 text-[15px] leading-relaxed"
                style={{ color: '#44403C' }}
              >
                {faq.answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Section ─── */
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-28 relative" style={{ background: '#ffffff' }}>
      {/* top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(29,78,95,0.12), transparent)',
        }}
      />

      <div className="section-container">
        {/* ── Header ── */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
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
              Common Questions
            </div>
            <h2 className="font-display text-display-md leading-tight" style={{ color: '#1C1917' }}>
              Frequently asked{' '}
              <em
                className="not-italic"
                style={{
                  background: 'linear-gradient(135deg, #1D4E5F 0%, #C17D5C 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                questions
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
            If you have a question that isn&rsquo;t answered here, please don&rsquo;t
            hesitate to{' '}
            <a
              href="https://calendly.com/itzia-morales/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 transition-colors duration-200"
              style={{ color: '#1D4E5F' }}
            >
              book a free consultation
            </a>{' '}
            or get in touch directly.
          </motion.p>
        </div>

        {/* ── Accordion ── */}
        <div className="max-w-3xl">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <p className="text-sm" style={{ color: '#78716C' }}>
            Still have questions?
          </p>
          <a
            href="https://calendly.com/itzia-morales/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: 'linear-gradient(135deg, #1D4E5F, #2a6b82)' }}
          >
            Book a Free Consultation
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}