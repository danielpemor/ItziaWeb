// Netlify Function (free tier) — receives the /contact form and emails it via Resend.
// The Resend API key stays server-side (set RESEND_API_KEY in the Netlify dashboard).
//
// Required env vars (Netlify → Site settings → Environment variables):
//   RESEND_API_KEY      — your Resend API key (secret)
//   CONTACT_FROM_EMAIL  — a verified sender, e.g. "Website <noreply@yourdomain.com>"
//   CONTACT_TO_EMAIL    — where enquiries land (defaults to itzia.morales@outlook.com)

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let data;
  try {
    data = await req.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const name = (data.name || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const topic = (data.topic || 'General enquiry').trim();
  const message = (data.message || '').trim();
  const honeypot = (data.company || '').trim(); // hidden field; bots fill it

  // Silently accept bots so they don't retry.
  if (honeypot) return json({ ok: true });

  if (name.length < 2 || !isEmail(email) || message.length < 5) {
    return json({ error: 'Please enter your name, a valid email, and a short message.' }, 422);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL || 'Website Enquiry <onboarding@resend.dev>';
  const to = process.env.CONTACT_TO_EMAIL || 'itzia.morales@outlook.com';

  if (!apiKey) {
    return json({ error: 'The contact form is not configured yet. Please email us directly.' }, 503);
  }

  const html = `
    <div style="font-family:system-ui,sans-serif;font-size:14px;color:#1c1917;line-height:1.6">
      <h2 style="margin:0 0 12px">New website enquiry</h2>
      <p style="margin:0 0 4px"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
      <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 12px"><strong>Phone:</strong> ${escapeHtml(phone) || '—'}</p>
      <p style="margin:0 0 4px"><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;margin:0;padding:12px;background:#faf8f4;border-radius:8px">${escapeHtml(message)}</p>
    </div>`;

  try {
    const resp = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New enquiry (${topic}) — ${name}`,
        html,
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error('Resend error:', resp.status, detail);
      return json({ error: 'Could not send your message right now. Please email us directly.' }, 502);
    }
  } catch (err) {
    console.error('Contact function error:', err);
    return json({ error: 'Something went wrong. Please email us directly.' }, 500);
  }

  return json({ ok: true });
};
