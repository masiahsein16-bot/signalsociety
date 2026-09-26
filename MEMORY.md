# Signal Society — Project Memory

## Context
Signal Society is a digital infrastructure agency/consultancy. The website serves as a landing page to showcase services and capture leads via contact form.

## Services
1. **Signal Grow** — Marketing & Digital Growth (social media, campaigns, content)
2. **Signal Build** — Websites & Digital Experiences (websites, landing pages)
3. **Signal Operate** — ERP, POS & Business Systems (custom tools, management systems)

## Design Language (v8 — light editorial)
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
