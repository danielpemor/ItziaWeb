import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format, addWeeks, isSameDay, isToday,
  addMonths, startOfMonth, endOfMonth,
  eachDayOfInterval, getDay, addHours, isBefore,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Video, User, Mail, Check } from 'lucide-react';

const MOCK_SERVICES = [
  {
    id: 'consultation',
    name: 'Free Consultation',
    description: '15-min intro call to discuss your needs',
    duration_minutes: 15,
    price_gbp: 0,
    modality: 'online',
  },
  {
    id: 'initial-assessment',
    name: 'Initial Assessment',
    description: 'Comprehensive 60-min clinical assessment',
    duration_minutes: 60,
    price_gbp: 140,
    modality: 'online',
  },
  {
    id: 'psychological-intervention',
    name: 'Psychological Therapy',
    description: 'Individual therapy — CBT, EMDR, CAT, ACT or CFT',
    duration_minutes: 50,
    price_gbp: 120,
    modality: 'online',
  },
  {
    id: 'emdr-90',
    name: 'EMDR Extended (90 min)',
    description: 'Extended EMDR trauma processing session',
    duration_minutes: 90,
    price_gbp: 180,
    modality: 'online',
  },
  {
    id: 'emdr-120',
    name: 'EMDR Extended (2 hours)',
    description: 'Intensive EMDR session — insured & self-funded',
    duration_minutes: 120,
    price_gbp: 240,
    modality: 'online',
  },
  {
    id: 'follow-up',
    name: 'Follow-Up Session',
    description: 'Short follow-up after discharge',
    duration_minutes: 30,
    price_gbp: 60,
    modality: 'online',
  },
];

function generateMockSlots(date: Date): string[] {
  const dayOfWeek = getDay(date);
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];
  const allSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const seed = date.getDate() + date.getMonth() * 31;
  return allSlots.filter((_, i) => (seed + i * 7) % 5 !== 0);
}

// ── Service Selector ────────────────────────────────────────────────────────

function ServiceSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {MOCK_SERVICES.map((service) => {
        const selected = selectedId === service.id;
        return (
          <motion.button
            key={service.id}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(service.id)}
            className="w-full text-left p-4 rounded-xl border transition-all duration-200"
            style={{
              borderColor: selected ? '#1D4E5F' : 'rgba(29,78,95,0.1)',
              background: selected ? 'rgba(29,78,95,0.05)' : 'white',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <p className="text-sm font-medium text-warm">{service.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
                  {service.description}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                    <Clock size={10} />
                    {service.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: '#78716C' }}>
                    <Video size={10} />
                    Online
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-display text-lg font-medium text-warm">
                  {service.price_gbp === 0 ? 'Free' : `£${service.price_gbp}`}
                </span>
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  style={{
                    borderColor: selected ? '#1D4E5F' : 'rgba(29,78,95,0.2)',
                    background: selected ? '#1D4E5F' : 'transparent',
                  }}
                >
                  {selected && <Check size={10} className="text-white" strokeWidth={3} />}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ── Calendar Grid ───────────────────────────────────────────────────────────

function CalendarGrid({
  currentMonth,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
}: {
  currentMonth: Date;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}) {
  const today = new Date();
  const minDate = addHours(today, 24);
  const maxDate = addWeeks(today, 8);

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const allDays = eachDayOfInterval({ start, end });
    const startPad = getDay(start);
    const adjusted = startPad === 0 ? 6 : startPad - 1;
    return [...Array(adjusted).fill(null), ...allDays];
  }, [currentMonth]);

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function isAvailable(date: Date) {
    const dow = getDay(date);
    if (dow === 0 || dow === 6) return false;
    if (isBefore(date, minDate) && !isSameDay(date, minDate)) return false;
    if (isBefore(maxDate, date)) return false;
    return true;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#44403C' }}
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-display text-lg font-medium text-warm">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <button
          onClick={onNextMonth}
          className="p-2 rounded-lg transition-colors"
          style={{ color: '#44403C' }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: '#78716C' }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />;
          const available = isAvailable(day);
          const selected = selectedDate ? isSameDay(day, selectedDate) : false;
          const todayDay = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              whileHover={available ? { scale: 1.08 } : {}}
              whileTap={available ? { scale: 0.96 } : {}}
              onClick={() => available && onSelectDate(day)}
              disabled={!available}
              className="aspect-square rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center relative"
              style={{
                background: selected ? '#1D4E5F' : 'transparent',
                color: selected ? 'white' : available ? '#1C1917' : '#D1CDC8',
                outline: todayDay && !selected ? '1.5px solid rgba(29,78,95,0.3)' : 'none',
                cursor: available ? 'pointer' : 'not-allowed',
              }}
            >
              {format(day, 'd')}
              {available && !selected && (
                <span
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#7A9E7E' }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Time Slot Picker ────────────────────────────────────────────────────────

function TimeSlotPicker({
  date,
  selectedTime,
  onSelect,
}: {
  date: Date;
  selectedTime: string | null;
  onSelect: (t: string) => void;
}) {
  const slots = useMemo(() => generateMockSlots(date), [date]);

  if (slots.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm" style={{ color: '#78716C' }}>No availability on this day.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-warm mb-3">
        {format(date, 'EEEE, d MMMM')}
      </p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((time) => {
          const selected = selectedTime === time;
          return (
            <motion.button
              key={time}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(time)}
              className="py-2.5 px-3 rounded-lg text-sm font-medium border transition-all duration-200"
              style={{
                background: selected ? '#1D4E5F' : 'white',
                color: selected ? 'white' : '#1C1917',
                borderColor: selected ? '#1D4E5F' : 'rgba(29,78,95,0.15)',
              }}
            >
              {time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ── Patient Form ────────────────────────────────────────────────────────────

function PatientForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: { name: string; email: string }) => void;
  isLoading: boolean;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  function validate() {
    const e: typeof errors = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Please enter your full name';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = 'Please enter a valid email';
    return e;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    onSubmit({ name: name.trim(), email: email.trim() });
  }

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    borderRadius: '0.75rem',
    border: `1.5px solid ${hasError ? '#EF4444' : 'rgba(29,78,95,0.15)'}`,
    fontSize: '0.875rem',
    color: '#1C1917',
    outline: 'none',
    background: 'white',
    transition: 'border-color 0.2s',
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-warm mb-1.5">Full name</label>
        <div className="relative">
          <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#78716C' }} />
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
            placeholder="Your full name"
            style={inputStyle(!!errors.name)}
            onFocus={e => { e.currentTarget.style.borderColor = '#1D4E5F'; }}
            onBlur={e => { e.currentTarget.style.borderColor = errors.name ? '#EF4444' : 'rgba(29,78,95,0.15)'; }}
          />
        </div>
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-warm mb-1.5">Email address</label>
        <div className="relative">
          <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#78716C' }} />
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="your@email.com"
            style={inputStyle(!!errors.email)}
            onFocus={e => { e.currentTarget.style.borderColor = '#1D4E5F'; }}
            onBlur={e => { e.currentTarget.style.borderColor = errors.email ? '#EF4444' : 'rgba(29,78,95,0.15)'; }}
          />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: '#78716C' }}>
        Your details are used only to send your booking confirmation and session reminders.
        We never share your information.
      </p>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.01 } : {}}
        whileTap={!isLoading ? { scale: 0.99 } : {}}
        className="w-full py-4 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm"
        style={{
          background: isLoading ? 'rgba(29,78,95,0.5)' : 'linear-gradient(135deg, #1D4E5F, #2a6b82)',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
            </svg>
            Processing…
          </>
        ) : (
          <>
            Continue to Payment
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </motion.button>
    </form>
  );
}

// ── Booking Summary ─────────────────────────────────────────────────────────

function BookingSummary({
  service,
  date,
  time,
}: {
  service: (typeof MOCK_SERVICES)[0] | null;
  date: Date | null;
  time: string | null;
}) {
  if (!service && !date && !time) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(29,78,95,0.06)' }}
        >
          <Clock size={20} style={{ color: '#1D4E5F' }} />
        </div>
        <p className="text-sm" style={{ color: '#78716C' }}>
          Your booking summary will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-4"
      style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
    >
      <h3 className="font-display text-lg font-medium text-warm">Booking Summary</h3>

      {service && (
        <div
          className="flex items-start gap-3 p-3 rounded-xl"
          style={{ background: 'rgba(29,78,95,0.04)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: '#1D4E5F' }}
          >
            <Video size={13} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-warm">{service.name}</p>
            <p className="text-xs mt-0.5" style={{ color: '#78716C' }}>
              {service.duration_minutes} min · Online
            </p>
          </div>
        </div>
      )}

      {date && (
        <div className="flex items-center gap-3 text-sm">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
            style={{ background: 'rgba(29,78,95,0.06)', color: '#1D4E5F' }}
          >
            📅
          </div>
          <span className="text-sm text-warm">{format(date, 'EEEE, d MMMM yyyy')}</span>
        </div>
      )}

      {time && (
        <div className="flex items-center gap-3 text-sm">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(29,78,95,0.06)' }}
          >
            <Clock size={14} style={{ color: '#1D4E5F' }} />
          </div>
          <span className="text-sm text-warm">{time} (London time)</span>
        </div>
      )}

      {service && date && time && (
        <>
          <div className="h-px" style={{ background: 'rgba(29,78,95,0.08)' }} />
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: '#78716C' }}>Total</span>
            <span className="font-display text-xl font-medium text-warm">
              {service.price_gbp === 0 ? 'Free' : `£${service.price_gbp}`}
            </span>
          </div>
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{ background: 'rgba(29,78,95,0.04)', border: '1px solid rgba(29,78,95,0.08)' }}
          >
            <span className="text-sm">🔒</span>
            <p className="text-xs" style={{ color: '#44403C' }}>
              Secure payment via Stripe. Cancel free up to 48h before.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ['Service', 'Date & Time', 'Your Details'];
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const num = i + 1;
        const active = num === currentStep;
        const done = num < currentStep;
        return (
          <div key={step} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300"
                style={{
                  background: done ? '#1D4E5F' : active ? '#1D4E5F' : 'rgba(29,78,95,0.1)',
                  color: done || active ? 'white' : '#78716C',
                }}
              >
                {done ? <Check size={12} strokeWidth={2.5} /> : num}
              </div>
              <span
                className="text-sm hidden sm:block transition-colors"
                style={{ color: active ? '#1C1917' : '#78716C', fontWeight: active ? 500 : 400 }}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="h-px mx-3 transition-all duration-300"
                style={{
                  width: '2rem',
                  background: done ? '#1D4E5F' : 'rgba(29,78,95,0.15)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function BookingCalendar() {
  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedService = MOCK_SERVICES.find(s => s.id === selectedServiceId) ?? null;
  const canStep1 = !!selectedServiceId;
  const canStep2 = !!selectedDate && !!selectedTime;

  function handleSubmit({ name, email }: { name: string; email: string }) {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const params = new URLSearchParams({
        service: selectedService?.name ?? '',
        date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
        time: selectedTime ?? '',
        price: String(selectedService?.price_gbp ?? 0),
        name,
        email,
      });
      window.location.href = `/success?${params.toString()}`;
    }, 1800);
  }

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ background: '#FAF8F4' }}>
      <div className="section-container">

        {/* Header */}
        <div className="mb-10">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#78716C' }}
          >
            <ChevronLeft size={15} />
            Back to home
          </a>
          <h1 className="font-display text-display-md text-warm mb-2">Book a Session</h1>
          <p className="text-sm" style={{ color: '#44403C' }}>
            Complete the steps below to secure your appointment.
          </p>
        </div>

        {/* Steps */}
        <div className="mb-10">
          <StepIndicator currentStep={step} />
        </div>

        {/* Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">

          {/* Left — steps */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">

              {/* Step 1 */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl p-8"
                  style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
                >
                  <h2 className="font-display text-display-sm text-warm mb-1">Choose a service</h2>
                  <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                    Select the type of session you'd like to book.
                  </p>

                  <ServiceSelector selectedId={selectedServiceId} onSelect={setSelectedServiceId} />

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      whileHover={canStep1 ? { scale: 1.02 } : {}}
                      whileTap={canStep1 ? { scale: 0.98 } : {}}
                      onClick={() => canStep1 && setStep(2)}
                      disabled={!canStep1}
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-medium rounded-xl transition-all"
                      style={{
                        background: canStep1
                          ? 'linear-gradient(135deg, #1D4E5F, #2a6b82)'
                          : 'rgba(29,78,95,0.25)',
                        cursor: canStep1 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Select Date & Time
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl p-8"
                  style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
                >
                  <h2 className="font-display text-display-sm text-warm mb-1">Choose a date & time</h2>
                  <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                    All times shown in London (GMT/BST). Minimum 24h advance booking.
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <CalendarGrid
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                        onSelectDate={(d) => { setSelectedDate(d); setSelectedTime(null); }}
                        onPrevMonth={() => setCurrentMonth(p => addMonths(p, -1))}
                        onNextMonth={() => setCurrentMonth(p => addMonths(p, 1))}
                      />
                      {/* Legend */}
                      <div
                        className="flex items-center gap-4 mt-4 pt-4"
                        style={{ borderTop: '1px solid rgba(29,78,95,0.08)' }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: '#7A9E7E' }} />
                          <span className="text-xs" style={{ color: '#78716C' }}>Available</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: '#1D4E5F' }} />
                          <span className="text-xs" style={{ color: '#78716C' }}>Selected</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <AnimatePresence mode="wait">
                        {selectedDate ? (
                          <motion.div
                            key={selectedDate.toISOString()}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <TimeSlotPicker
                              date={selectedDate}
                              selectedTime={selectedTime}
                              onSelect={setSelectedTime}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center py-12 text-center"
                          >
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                              style={{ background: 'rgba(29,78,95,0.05)' }}
                            >
                              <Clock size={22} style={{ color: '#1D4E5F' }} />
                            </div>
                            <p className="text-sm" style={{ color: '#78716C' }}>
                              Select a date to see available times
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div
                    className="mt-8 flex items-center justify-between pt-6"
                    style={{ borderTop: '1px solid rgba(29,78,95,0.08)' }}
                  >
                    <button
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-colors"
                      style={{ color: '#44403C' }}
                    >
                      <ChevronLeft size={15} />
                      Back
                    </button>
                    <motion.button
                      whileHover={canStep2 ? { scale: 1.02 } : {}}
                      whileTap={canStep2 ? { scale: 0.98 } : {}}
                      onClick={() => canStep2 && setStep(3)}
                      disabled={!canStep2}
                      className="inline-flex items-center gap-2 px-7 py-3.5 text-white text-sm font-medium rounded-xl transition-all"
                      style={{
                        background: canStep2
                          ? 'linear-gradient(135deg, #1D4E5F, #2a6b82)'
                          : 'rgba(29,78,95,0.25)',
                        cursor: canStep2 ? 'pointer' : 'not-allowed',
                      }}
                    >
                      Enter Your Details
                      <ChevronRight size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl p-8"
                  style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
                >
                  <h2 className="font-display text-display-sm text-warm mb-1">Your details</h2>
                  <p className="text-sm mb-6" style={{ color: '#78716C' }}>
                    We only need your name and email to send your confirmation.
                  </p>

                  {/* Recap */}
                  {selectedService && selectedDate && selectedTime && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap items-center gap-3 p-4 rounded-xl mb-8"
                      style={{ background: 'rgba(29,78,95,0.05)', border: '1px solid rgba(29,78,95,0.1)' }}
                    >
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium text-white"
                        style={{ background: '#1D4E5F' }}
                      >
                        {selectedService.name}
                      </span>
                      <span className="text-sm" style={{ color: '#1D4E5F' }}>
                        {format(selectedDate, 'EEE, d MMM')} at {selectedTime}
                      </span>
                      <span className="ml-auto font-display text-lg font-medium text-warm">
                        {selectedService.price_gbp === 0 ? 'Free' : `£${selectedService.price_gbp}`}
                      </span>
                    </motion.div>
                  )}

                  <PatientForm onSubmit={handleSubmit} isLoading={isLoading} />

                  <button
                    onClick={() => setStep(2)}
                    disabled={isLoading}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl transition-colors"
                    style={{ color: '#78716C' }}
                  >
                    <ChevronLeft size={15} />
                    Change date or time
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right — summary */}
          <div className="lg:sticky lg:top-28">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BookingSummary
                service={selectedService}
                date={selectedDate}
                time={selectedTime}
              />

              {/* Info cards */}
              <div className="mt-4 space-y-3">
                {[
                  {
                    icon: '💻',
                    title: 'Online via Microsoft Teams',
                    desc: 'A secure Teams link is sent to your email immediately after booking.',
                  },
                  {
                    icon: '↩',
                    title: 'Cancellation policy',
                    desc: 'Free cancellation up to 48h before. Late cancellations charged at full rate.',
                  },
                  {
                    icon: '🔒',
                    title: 'Secure & confidential',
                    desc: 'GDPR compliant. Your data is never shared.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-4 rounded-xl"
                    style={{ background: 'white', border: '1px solid rgba(29,78,95,0.08)' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <p className="text-xs font-medium text-warm mb-0.5">{title}</p>
                        <p className="text-xs leading-relaxed" style={{ color: '#78716C' }}>{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}