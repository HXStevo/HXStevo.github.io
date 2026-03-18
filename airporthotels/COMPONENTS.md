# AirportHotels.co.uk — Component Architecture

## Overview
Main SEO website for airporthotels.co.uk. Built for 90+ Core Web Vitals, mobile-first, international (EN/FR/ES/IT/DE/NL/AT).

## File Structure
```
airporthotels/
├── index.html          ← English homepage (primary)
├── fr/index.html       ← French (hreflang: fr)
├── es/index.html       ← Spanish (hreflang: es)
├── it/index.html       ← Italian (hreflang: it)
├── de/index.html       ← German (hreflang: de)
├── nl/index.html       ← Dutch (hreflang: nl)
├── at/index.html       ← Austrian German (hreflang: de-AT)
└── COMPONENTS.md       ← This file
```

## Skill File Upload Guide
Each component below can be enhanced with a skill file. Drop into the chat with the component name:

| Component | Skill File Name | What to include |
|-----------|----------------|-----------------|
| Hero Section | `skill-hero.md` | H1 messaging, badge text, stat numbers |
| Airport Cards | `skill-airports.md` | Airport names, prices, descriptions per airport |
| Why Us | `skill-why-us.md` | 6 USP tiles: title + 2-sentence description |
| Reviews | `skill-reviews.md` | 4-8 real guest reviews with score, airport, text |
| FAQ | `skill-faq.md` | 7-10 Q&A pairs in plain language |
| CTA Section | `skill-cta.md` | CTA headline, subtext, button label |
| Footer | `skill-footer.md` | Company info, legal links, social handles |
| International | `skill-{lang}.md` | Full translated content for FR/ES/IT/DE/NL/AT |

## CWV Optimisation Decisions
- System font stack (no Google Fonts) — eliminates render-blocking
- All CSS inlined — single HTTP request, no external stylesheets
- Hero image: img tag with fetchpriority="high" + link rel="preload" — fast LCP
- Images lazy-loaded below fold with explicit width/height — no CLS
- Minimal vanilla JS (no jQuery/frameworks) — fast INP
- No third-party scripts — clean waterfall
- Mobile drawer search (no layout shift) — stable CLS
- min-height:44px on all touch targets — accessibility + Lighthouse

## Mobile UX Decisions
- Desktop: Search card in hero column (right side)
- Mobile: Fixed bottom bar opens drawer from bottom
- Drawer: Large inputs (min 16px font prevents iOS zoom), 52px min-height inputs
- Nights counter: 52px buttons, easy to tap

## SEO Implementation
- Canonical per page
- Full hreflang set (all 7 pages reference each other)
- Schema: WebSite (with SearchAction), TravelAgency (with AggregateRating), FAQPage
- Semantic HTML: single H1, proper H2/H3 hierarchy
- Meta description: <160 chars, keyword-rich
- Airport cards: individual internal links with keyword-rich anchor text
- Popular search tags: internal links for crawlable keyword clusters
