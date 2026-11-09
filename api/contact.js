// Vercel serverless function: receives the website's forms and emails them via Resend.
// Needs one environment variable in Vercel: RESEND_API_KEY (never put the key in this file).
// Optional: CONTACT_TO (default music@nirhermelin.com), CONTACT_FROM (default below).
const TO   = process.env.CONTACT_TO   || 'music@nirhermelin.com';
const FROM = process.env.CONTACT_FROM || 'Nir Music website <website@nirhermelin.com>';

const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isEmail = e => /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(e);

module.exports = async (req, res) => {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false }); }
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }

  // honeypot: real people never fill the hidden "website" field
  if (clean(b.website, 200)) return res.status(200).json({ ok: true });

  const type    = b.type === 'signup' ? 'signup' : 'contact';
  const email   = clean(b.email, 200);
  const name    = clean(b.name, 120);
  const message = clean(b.message, 5000);
  const page    = clean(b.page, 80) || 'website';
  if (!isEmail(email)) return res.status(400).json({ ok: false, error: 'Please enter a valid email.' });
  if (type === 'contact' && !message) return res.status(400).json({ ok: false, error: 'Please write a message.' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(500).json({ ok: false, error: 'Email is not set up yet.' });

  const subject = type === 'signup'
    ? `New mailing-list signup: ${email}`
    : `Website message from ${name || email}`;
  const text = type === 'signup'
    ? `New signup from the ${page} page:\n\n${email}\n`
    : `From: ${name || '(no name)'} <${email}>\nPage: ${page}\n\n${message}\n`;
  const html = type === 'signup'
    ? `<p>New signup from the <b>${esc(page)}</b> page:</p><p style="font-size:16px">${esc(email)}</p>`
    : `<p><b>From:</b> ${esc(name || '(no name)')} &lt;${esc(email)}&gt;<br><b>Page:</b> ${esc(page)}</p>` +
      `<p style="white-space:pre-wrap;font-size:15px">${esc(message)}</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html })
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'Could not send right now.' });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Resend request failed', e);
    return res.status(502).json({ ok: false, error: 'Could not send right now.' });
  }
};
