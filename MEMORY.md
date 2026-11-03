# Signal Society — Project Memory

## Context
Signal Society is a digital infrastructure agency/consultancy. The website serves as a landing page to showcase services and capture leads via contact form.

## Services
1. **Signal Grow** — Marketing & Digital Growth (social media, campaigns, content)
2. **Signal Build** — Websites & Digital Experiences (websites, landing pages)
3. **Signal Operate** — ERP, POS & Business Systems (custom tools, management systems)

## Design Language (v8 — light editorial)
- Light premium aesthetic: white / off-white + deep black + purple gradients
- Headlines + technical labels: Space Mono
- Body, nav, buttons, descriptions: Montserrat (readable)
- Purple-dominant gradient system (atmospheric orbs, gradient text accents, gradient cards/CTA)
- BEM CSS methodology
- Smooth animations (IntersectionObserver)

## Color Palette (v8 light)
- `--white: #FFFFFF`, `--off-white: #F7F8FA`, `--soft-gray: #EEF1F5`
- `--black: #080808`, `--navy: #10162F`
- Palette is purple since Nov 2026 (token names kept): `--blue: #7A33FF`, `--blue-electric: #9A66FF`, `--blue-light: #C4A8FF`, `--blue-very-light: #F4EFFF`, `--navy: #1C0F3A`
- Original blue v8 palette preserved on branch `backup/website-lama-v8`; v9 redesign on `redesign/signal-v9`
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
