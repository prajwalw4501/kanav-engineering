// Cloudflare Pages Function: forwards website enquiries to the owner via WhatsApp (Meta Cloud API) and email (Resend).
const clean = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max)
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } })

// Each sender returns null when not configured, true on success, and throws on failure.
async function sendWhatsApp(env, fields) {
  const {
    WHATSAPP_TOKEN,
    WHATSAPP_PHONE_NUMBER_ID,
    OWNER_WHATSAPP_NUMBER,
    WHATSAPP_TEMPLATE_NAME = 'new_enquiry',
    WHATSAPP_TEMPLATE_LANG = 'en',
  } = env
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !OWNER_WHATSAPP_NUMBER) return null

  // Template body variables {{1}}..{{5}} must match the approved template order.
  const params = [fields.name, fields.company, fields.phone, fields.project, fields.message].map((text) => ({
    type: 'text',
    text,
  }))
  const response = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: OWNER_WHATSAPP_NUMBER.replace(/\D/g, ''),
      type: 'template',
      template: {
        name: WHATSAPP_TEMPLATE_NAME,
        language: { code: WHATSAPP_TEMPLATE_LANG },
        components: [{ type: 'body', parameters: params }],
      },
    }),
  })
  if (!response.ok) throw new Error(`WhatsApp ${response.status}: ${await response.text()}`)
  return true
}

async function sendEmail(env, fields) {
  const { RESEND_API_KEY, OWNER_EMAIL, EMAIL_FROM = 'Kanav Engineering <onboarding@resend.dev>' } = env
  if (!RESEND_API_KEY || !OWNER_EMAIL) return null

  const rows = [
    ['Name', fields.name],
    ['Company', fields.company],
    ['Phone', fields.phone],
    ['Project', fields.project],
    ['Details', fields.message],
  ]
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: OWNER_EMAIL.split(',').map((e) => e.trim()).filter(Boolean),
      subject: `New website enquiry from ${fields.name}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join('\n'),
      html: `<h3>New website enquiry</h3><table cellpadding="6">${rows
        .map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
        .join('')}</table>`,
    }),
  })
  if (!response.ok) throw new Error(`Email ${response.status}: ${await response.text()}`)
  return true
}

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request' }, 400)
  }

  const fields = {
    name: clean(body.name, 80),
    company: clean(body.company, 80) || 'Not provided',
    phone: clean(body.phone, 30),
    project: clean(body.project, 80),
    message: clean(body.message, 800),
  }

  if (!fields.name || !fields.phone || !fields.project || !fields.message) {
    return json({ error: 'Missing required fields' }, 400)
  }

  const results = await Promise.allSettled([sendWhatsApp(env, fields), sendEmail(env, fields)])
  results.forEach((r) => r.status === 'rejected' && console.error('Enquiry delivery failed', r.reason))

  if (results.some((r) => r.status === 'fulfilled' && r.value === true)) return json({ ok: true })
  if (results.some((r) => r.status === 'rejected')) return json({ error: 'Could not deliver enquiry' }, 502)
  return json({ error: 'Messaging is not configured' }, 500)
}
