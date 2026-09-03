# Signal Society — Agent Guidelines

## Project Overview
Signal Society is a digital infrastructure company website. Static HTML/CSS/JS site with Supabase backend for contact form submissions.

## Tech Stack
- **Frontend**: HTML5, CSS3 (custom properties, BEM naming), Vanilla JS
- **Backend**: Supabase (PostgreSQL + Row Level Security)
- **Deployment**: Vercel (static site)
- **Font**: Space Mono (Google Fonts, monospace only)

## File Structure
```
signalsociety/
├── index.html              # Main entry point
├── styles.css              # Design system + all styles
├── script.js               # Navigation, scroll, form handling
├── supabase-setup.sql      # Database schema + RLS policies
├── logosignalsociety/      # Logo assets
│   └── logosignalsociety.png
├── colourpalette/          # Color reference (empty)
├── vercel.json             # Vercel deployment config
├── package.json            # Project metadata
├── .env                    # Environment variables (Supabase)
├── AGENTS.md               # This file
└── MEMORY.md               # Project memory/context
```

## Code Conventions
- CSS uses BEM naming: `.block__element--modifier`
- CSS custom properties for colors, spacing, typography
- Responsive breakpoints: 1024px (tablet), 768px (mobile), 480px (small mobile)
- Smooth scroll with IntersectionObserver for reveal animations
- Form submits to Supabase `contact_submissions` table

## Key Colors
- `--blue: #1A1AFF`
- `--orange: #FF6600`
- `--dark: #0A0A0A`
- `--dark-surface: #111111`
- `--dark-elevated: #1a1a1a`
- `--dark-border: #1f1f1f`
- `--gray: #6B6B6B`
- `--gray-light: #999999`
- `--white: #FFFFFF`

## Supabase Setup
1. Run `supabase-setup.sql` in Supabase SQL Editor
2. Table: `contact_submissions`
3. RLS: Anonymous inserts allowed, authenticated reads allowed
4. Credentials in `.env` and hardcoded in `script.js`

## Deployment
- Push to GitHub repo
- Connect repo to Vercel
- Vercel auto-deploys on push
- No build step needed (static site)

## Notes
- No framework dependencies — pure vanilla JS
- Logo path: `logosignalsociety/logosignalsociety.png`
- Contact form uses Supabase JS client v2 (CDN)
