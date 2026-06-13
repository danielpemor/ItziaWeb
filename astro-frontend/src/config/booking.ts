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
 *  No backend is required for any of this, Zanda runs the calendar, Stripe
 *  payments, notes and reminders on their side; the site just opens the widget.
 * ──────────────────────────────────────────────────────────────────────────
 */

export type BookingMode = 'embed' | 'redirect';

/** 'embed'  → CTAs go to our internal /booking page that hosts the Zanda widget.
 *  'redirect' → CTAs go straight to the hosted Zanda portal.
 *
 *  We use 'redirect': Zanda's Client Portal needs a SameSite=Lax session cookie
 *  that browsers will NOT send inside a cross-site <iframe>, so an embed loops
 *  forever (especially on iOS Safari). Redirecting to the portal is reliable. */
export const BOOKING_MODE = 'redirect' as BookingMode;

/** Dr. Morales' live Zanda Client Portal. */
export const ZANDA_BOOKING_URL =
  'https://clientportal.uk.zandahealth.com/clientportal/drmorales';

/** Internal page that embeds the Zanda widget inside our own nav/footer. */
export const BOOKING_PAGE = '/booking';

/**
 * Free 15-minute consultation runs through Calendly (no account / no payment,
 * lowest friction for first contact). Paid sessions go through Zanda.
 * NOTE: to avoid double-bookings, Calendly and Zanda must both sync to the
 * SAME Google/Outlook calendar so they see each other's busy times.
 */
export const CONSULT_URL = 'https://calendly.com/itzia-morales/30min';

/**
 * Reference map: the site's internal service ids → the matching service in
 * Zanda's Billing → Services list. Kept for documentation; the portal does not
 * currently support per-service deep-links via URL (it strips query params on
 * its session redirect), so every CTA opens the portal and the patient picks
 * the service from the (short) list.
 *
 *   consultation                → Clinical Psychology Consultation (CP001, £0)
 *   initial-assessment          → Initial Assessment            (AA810, £140)
 *   psychological-intervention  → Clinical Psychology Session   (AA809, £120)
 *   emdr-standard / emdr-90     → EMDR Extended Session         (EMDR90, £180)
 *   emdr-120                    → EMDR+                         (EMDR120, £240)
 *   follow-up                   → Follow-Up                     (F30, £60)
 */
export const ZANDA_SERVICE_IDS: Record<string, string> = {
  consultation: 'CP001',
  'initial-assessment': 'AA810',
  'psychological-intervention': 'AA809',
  'emdr-standard': 'EMDR90',
  'emdr-90': 'EMDR90',
  'emdr-120': 'EMDR120',
  'follow-up': 'F30',
};

/**
 * The Zanda portal URL. `serviceId` is accepted so callers don't have to
 * change, but is currently ignored, the portal drops query params on its
 * session redirect, so there's no reliable way to pre-select a service yet.
 */
export function zandaUrl(_serviceId?: string): string {
  return ZANDA_BOOKING_URL;
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

/** Where a "Free Consultation" CTA should point (Calendly). */
export function consultHref(): string {
  return CONSULT_URL;
}

/**
 * ── Insurance channel ──────────────────────────────────────────────────────
 * Insured clients (AXA, Aviva, Cigna, Healix, Vitality) do NOT pay at booking
 *, their insurer is billed and they must obtain an authorisation number first.
 * So they bypass the (payment-required) portal and contact the practice directly.
 *
 * TODO: confirm this is the correct, real contact email for the practice.
 */
export const INSURANCE_CONTACT_EMAIL = 'itzia.morales@outlook.com';

/**
 * Insured clients are routed to the contact form (pre-filled with the insurer
 * fields), which sends an email via the Netlify function + Resend. More reliable
 * than a mailto: link, which depends on the visitor having a mail client set up.
 */
export function insuranceHref(): string {
  return '/contact?topic=insurance';
}

/** True when CTAs stay on-site (embed), handy for deciding target="_blank". */
export const OPENS_IN_SAME_TAB = BOOKING_MODE === 'embed';
