# Signal Society — Project Memory

## Context
Signal Society is a digital infrastructure agency/consultancy. The website serves as a landing page to showcase services and capture leads via contact form.

## Services
1. **Signal Grow** — Marketing & Digital Growth (social media, campaigns, content)
2. **Signal Build** — Websites & Digital Experiences (websites, landing pages)
3. **Signal Operate** — ERP, POS & Business Systems (custom tools, management systems)

## Design Language (v7)
- Dark tech / terminal aesthetic
- Monospace everything (Space Mono)
- Black backgrounds only, no beige/white/cream
- Minimalist separators (| and ·) instead of em-dashes
- Professional but casual UX copy
- BEM CSS methodology
- Smooth animations (IntersectionObserver)

## Color Palette (Strict)
- `--blue: #1A1AFF` — Primary accent
- `--orange: #FF6600` — Secondary accent
- `--dark: #0A0A0A` — Primary background
- `--dark-surface: #111111` — Section backgrounds
- `--dark-elevated: #1a1a1a` — Elevated surfaces
- `--dark-border: #1f1f1f` — Border color
- `--gray: #6B6B6B` — Muted text
- `--gray-light: #999999` — Secondary text
- `--white: #FFFFFF` — Primary text

**BANNED colors:** beige, cream, off-white, sand, any light background

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
