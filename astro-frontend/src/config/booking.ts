/**
 * ──────────────────────────────────────────────────────────────────────────
 *  CENTRAL BOOKING CONFIG  ·  Zanda
 * ──────────────────────────────────────────────────────────────────────────
 *  Every "Book a Session" / "Free Consultation" link in the site reads from
 *  here, so swapping providers (or going live with Zanda) is a one-line change.
 *
 *  WHEN ZANDA IS LIVE:
 *   1. Set ZANDA_BOOKING_URL to your real Zanda Client Portal / online-booking
 *      URL  (Zanda → Settings → Online Bookings / Client Portal).
 *   2. Confirm the deep-link query param Zanda uses for a specific service
 *      (commonly `?service=` or `?appointmentType=`) and adjust `zandaUrl()`.
 *   3. Map your Zanda service names to the ids in ZANDA_SERVICE_IDS below.
 *   4. Leave BOOKING_MODE as 'embed' (the /booking page hosts the widget inside
 *      our own layout). Flip it to 'redirect' if you ever prefer sending users
 *      straight to the hosted Zanda portal.
 *
 *  No backend is required for any of this — Zanda runs the calendar, Stripe
 *  payments, notes and reminders on their side; the site just opens the widget.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type BookingMode = 'embed' | 'redirect';

/** 'embed'  → CTAs go to our internal /booking page that hosts the Zanda widget.
 *  'redirect' → CTAs go straight to the hosted Zanda portal. */
export const BOOKING_MODE: BookingMode = 'embed';

/** TODO(Zanda): replace this placeholder with the real Zanda portal URL. */
export const ZANDA_BOOKING_URL =
  'https://YOUR-PRACTICE.zandahealth.com/online-bookings';

/** Internal page that embeds the Zanda widget inside our own nav/footer. */
export const BOOKING_PAGE = '/booking';

/** Service id used for the free 15-minute consultation in Zanda. */
export const CONSULT_SERVICE = 'consultation';

/**
 * Maps the site's internal service ids to whatever Zanda expects in its
 * deep-link param. Until Zanda is live these pass through unchanged.
 * TODO(Zanda): align the right-hand values with your Zanda service names.
 */
export const ZANDA_SERVICE_IDS: Record<string, string> = {
  consultation: 'consultation',
  'initial-assessment': 'initial-assessment',
  'psychological-intervention': 'psychological-intervention',
  'emdr-standard': 'emdr-90',
  'emdr-90': 'emdr-90',
  'emdr-120': 'emdr-120',
  'follow-up': 'follow-up',
};

/** Builds the real Zanda URL, optionally deep-linking a specific service. */
export function zandaUrl(serviceId?: string): string {
  if (!serviceId) return ZANDA_BOOKING_URL;
  const id = ZANDA_SERVICE_IDS[serviceId] ?? serviceId;
  const sep = ZANDA_BOOKING_URL.includes('?') ? '&' : '?';
  // TODO(Zanda): confirm the param name ('service') matches your portal.
  return `${ZANDA_BOOKING_URL}${sep}service=${encodeURIComponent(id)}`;
}

/**
 * Where a "Book a Session" CTA should point.
 *  - embed mode    → our /booking page (optionally with ?service=…)
 *  - redirect mode → straight to Zanda
 */
export function bookHref(serviceId?: string): string {
  if (BOOKING_MODE === 'redirect') return zandaUrl(serviceId);
  return serviceId
    ? `${BOOKING_PAGE}?service=${encodeURIComponent(serviceId)}`
    : BOOKING_PAGE;
}

/** Where a "Free Consultation" CTA should point. */
export function consultHref(): string {
  return bookHref(CONSULT_SERVICE);
}

/** True when CTAs stay on-site (embed) — handy for deciding target="_blank". */
export const OPENS_IN_SAME_TAB = BOOKING_MODE === 'embed';
