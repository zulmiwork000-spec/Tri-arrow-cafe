# Tri Arrow Cafe — Ordering Website

A production-ready ordering site: React + Vite frontend, a serverless backend
endpoint that talks to your Rista API, promo codes, "make it a meal" upsells,
and checkout suggestions.

## What's safe vs. what needs your attention

✅ **Safe as-is:** `/src` — this is all frontend code. No secrets live here.
This is the only part visitors' browsers ever download.

⚠️ **You must configure:** `/api/place-order.js` — this is your backend. It
references `process.env.RISTA_API_KEY` and `process.env.RISTA_MERCHANT_ID`.
**Do not** put your real key directly in this file. Set it in Vercel's
dashboard instead (steps below). This is what actually prevents the "customer
details leak" issue — your secret key and customer data only ever touch
Vercel's servers, never the browser.

The exact request shape sent to Rista (`api.dotpe.in/rista/v1/orders` and its
body) in `place-order.js` is a **placeholder** — replace it with the real
endpoint and field names from your Rista API documentation. I don't have
access to your specific docs, so this part needs a 10-minute edit from you
(or send me the docs and I'll do it).

## Local setup (optional — only if you want to test on your own computer)

```bash
npm install
cp .env.example .env.local
# edit .env.local with your real Rista keys (this file is gitignored, safe locally)
npm run dev
```

## Deploying for real (no local setup needed)

### 1. Push to GitHub
- Create a new repository at github.com (private is fine, recommended even)
- Upload this whole folder to it (drag-and-drop works on github.com, or use
  GitHub Desktop if you prefer a GUI)

### 2. Connect to Vercel
- Go to vercel.com → sign in with GitHub
- "Add New Project" → select your `tri-arrow-cafe` repo → Deploy
- Vercel auto-detects Vite and builds it. You'll get a live `.vercel.app` URL
  in about a minute.

### 3. Add your real secrets (this is the important security step)
- In Vercel: your project → **Settings → Environment Variables**
- Add:
  - `RISTA_API_KEY` = (your real key from DotPe)
  - `RISTA_MERCHANT_ID` = (your real merchant ID)
- Redeploy (Vercel does this automatically after you save env vars, or click
  "Redeploy" manually)

### 4. Connect your GoDaddy domain
- In Vercel: your project → **Settings → Domains** → add `triarrowcafe.in`
- Vercel shows you DNS records (usually an A record or CNAME)
- In GoDaddy: My Products → DNS → add those same records
- Takes a few hours to fully propagate; Vercel auto-issues free HTTPS once it
  does

## Before going live — a short checklist

- [ ] Replace the placeholder Rista endpoint/payload in `api/place-order.js`
      with your real API docs
- [ ] Test placing a real order end-to-end and confirm it appears in your
      Rista app
- [ ] Swap placeholder promo codes (`WELCOME50`, `TAC10`, `FREESHIP`) for
      whatever codes you actually want to run, in both
      `src/menuData.js` (display copy) and `api/place-order.js`
      (the authoritative server-side logic)
- [ ] Double check your phone number and hours in `src/App.jsx` are correct
- [ ] Test the mobile view on an actual phone, not just resizing a browser
