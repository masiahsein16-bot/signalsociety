# Signal Society — Project Memory

## Context
Signal Society is a digital infrastructure agency/consultancy. The website serves as a landing page to showcase services and capture leads via contact form.

## Services
1. **Signal Grow** — Marketing & Digital Growth (social media, campaigns, content)
2. **Signal Build** — Websites & Digital Experiences (websites, landing pages)
3. **Signal Operate** — ERP, POS & Business Systems (custom tools, management systems)

## Design Language (v9 — "Signal over Noise", current)
- Void #0A0910 stage + white/paper pages; Signal Violet #7A33FF used sparingly as the one accent (Violet 400 #9A66FF for violet text on dark)
- Fonts: Archivo (display, expanded width 112–125) + Instrument Sans (body, labels in caps). No monospace or script faces
- Logo: Signal Ring (12-dot ring, constant gap, geometric size ramp) — `logosignalsociety/signal-ring*.svg`, favicons, lockups
- Square edges (4px controls, 0 panels); only dots are round. No glass tiles, twinkles or blue gradients
- Legacy token names (--blue, --black …) kept and remapped so inline styles keep working; HTML body markup and script.js unchanged from v8
- Previous light v8 site preserved on branch `backup/website-lama-v8`

## Design Language (v8 — light editorial, superseded)
- Light premium aesthetic: white / off-white + deep black + blue gradients
- Headlines + technical labels: Space Mono
- Body, nav, buttons, descriptions: Montserrat (readable)
- Blue-dominant gradient system (atmospheric orbs, gradient text accents, gradient cards/CTA)
- BEM CSS methodology
- Smooth animations (IntersectionObserver)

## Color Palette (v8 light)
- `--white: #FFFFFF`, `--off-white: #F7F8FA`, `--soft-gray: #EEF1F5`
- `--black: #080808`, `--navy: #10162F`
- `--blue: #2457FF`, `--blue-electric: #397BFF`, `--blue-light: #8EC5FF`, `--blue-very-light: #EAF4FF`
- Dark `#080808` section reserved for Why bands only

## Site Architecture (multi-page, static)
- `/`, `/about/`, `/services/`, `/services/signal-grow|build|operate/`
- `/work/` + 6 detail pages, `/why-us/`, `/faqs/`, `/contact/`
- `/process/` — How We Work: 6 progress steps (Discovery → Proposal → 50% kickoff → Build → Launch → Ownership), vanilla scroll-driven horizontal rail
- Legacy dark single-page design lives in `main` history (up to commit a6ca1a1); light redesign snapshot also saved on branch `redesign/light-v8`

## Brand Identity
- Clean, minimal, tech-forward
- Tagline: "Digital Infrastructure for Growing Businesses"
- Signal metaphor: concentric circles, pulse animation

## Contact Form Fields
- Name (required)
- Email (required)
- Company (optional)
- Service dropdown (grow/build/operate/multiple)
- Message (required)

## Supabase
- Project: `signalsociety`
- Table: `contact_submissions`
- RLS enabled for security
- Status tracking: new → read → replied

## Deployment History
- 2026-08-28: Initial site created, ready for Vercel deployment
- 2026-09-04: Redesigned to dark tech aesthetic, monospace everywhere, strict palette
