# WhatsApp Enquiry Integration

## Requirement
When a visitor submits the enquiry form, the details are delivered to the owner's WhatsApp (appearing as a new chat/message from the business number), and the visitor sees a success message on the page.

## Is a Meta key required?
Yes. A browser-only solution (`wa.me` link) cannot send automatically; it only opens WhatsApp on the visitor's device. Automatic delivery to the owner requires the **WhatsApp Business Platform (Cloud API)** from Meta, which needs:

| Item | Where to get it |
|---|---|
| Meta Business account | business.facebook.com |
| Meta developer app with WhatsApp product | developers.facebook.com |
| Business sender phone number (not already used on a personal WhatsApp app) | WhatsApp > API Setup |
| Phone Number ID | WhatsApp > API Setup |
| Permanent access token (System User token with `whatsapp_business_messaging`) | Business Settings > System Users |
| Approved message template (e.g. `new_enquiry`) | WhatsApp Manager > Message templates |
| Owner's WhatsApp number (recipient) | Owner |

### Why a template is needed
The business sends the first message to the owner, so WhatsApp only allows an approved **template** message (outside the 24-hour customer-service window). Template body (category: Utility), 5 variables in this order:

```
New website enquiry
Name: {{1}}
Company: {{2}}
Phone: {{3}}
Project: {{4}}
Details: {{5}}
```

Notes:
- The owner's number must be added as a test recipient while the app is in development mode.
- Meta charges per conversation/template message (small amount; check current pricing).
- The token must stay server-side. Never put it in React code.

## Implementation
- Frontend: `src/App.jsx` POSTs the form as JSON to `/api/enquiry` and shows a success or error message.
- Backend: `functions/api/enquiry.js` (Cloudflare Pages Function, served at `/api/enquiry`) validates input and calls the Graph API `/{PHONE_NUMBER_ID}/messages`.

## Environment variables (Cloudflare Pages > Settings > Variables and Secrets; store `WHATSAPP_TOKEN` as a Secret; use `.dev.vars` locally)
```
WHATSAPP_TOKEN=<permanent access token>
WHATSAPP_PHONE_NUMBER_ID=<phone number id>
OWNER_WHATSAPP_NUMBER=<country code + number, digits only, e.g. 919XXXXXXXXX>
WHATSAPP_TEMPLATE_NAME=new_enquiry
WHATSAPP_TEMPLATE_LANG=en
```

## Email notification (Resend)
The same function also emails the owner. Create an API key at resend.com and set:
```
RESEND_API_KEY=<api key>   (Secret)
OWNER_EMAIL=<owner email; comma-separate for several>
EMAIL_FROM=Kanav Engineering <enquiries@yourdomain.com>   (optional; verify the domain in Resend. Default is the Resend test sender, which only delivers to your own Resend account email)
```
Each channel is optional; the enquiry succeeds if at least one configured channel delivers.

## Local testing
`vite` does not run `/functions`. Run `npm run build` then `npx wrangler pages dev dist` to test the form end to end.

## Alternatives without a Meta key
- Third-party gateways (Twilio, Gupshup, Interakt, WATI) - still use WhatsApp Business API underneath and have their own keys/fees.
- Email or Telegram notification - no WhatsApp approval needed.
