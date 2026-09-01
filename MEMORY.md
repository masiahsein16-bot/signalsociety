# Signal Society — Project Memory

## Context
Signal Society is a digital infrastructure agency/consultancy. The website serves as a landing page to showcase services and capture leads via contact form.

## Services
1. **SIGNALS GROW** — Marketing & Digital Growth (social media, campaigns, content)
2. **SIGNALS BUILD** — Websites & Digital Experiences (websites, landing pages)
3. **SIGNALS OPERATE** — ERP, POS & Business Systems (custom tools, management systems)

## Design Language
- Minimalist, modern, professional
- Dark/light contrast with orange accent
- Smooth animations (IntersectionObserver)
- BEM CSS methodology
- Inter font family

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
