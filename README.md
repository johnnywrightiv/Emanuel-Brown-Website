# Emanuel Brown

Single-page website for independent artist Emanuel Brown — Hip-Hop & R&B. Shows, mailing list signup, dark theme.

## Run locally

Open `index.html` in a browser, or: `npx serve .` To test signup locally, set `SIGNUP_ENDPOINT` and `SIGNUP_SECRET` in your environment and run `npm run build` first.

## Deploy

Push to GitHub and deploy on [Vercel](https://vercel.com). Set **Build command:** `npm run build` and add env vars **SIGNUP_ENDPOINT** (Apps Script Web App URL) and **SIGNUP_SECRET** (same value as in Apps Script Script Properties). Email signup uses `apps-script/Code.gs`; the build injects env vars into `js/main.js` so the secret is never committed.

## Structure

- `index.html` — landing (hero, about, Bandsintown shows, signup, footer)
- `css/style.css` — mobile-first, dark theme
- `js/main.js` — nav, signup form
- `assets/` — media and favicon
- `apps-script/Code.gs` — paste into a Google Sheet (Extensions → Apps Script), deploy as Web app, add `SIGNUP_SECRET` in Script properties
