# Website CMS - Bot Skills Guide

This document describes how to operate this website via the API. It is intended for bots and AI agents that manage content on the site.

## Overview

This is a multilingual CMS website. Pages are stored in a database with markdown content. Each page belongs to a specific language and has a unique slug within that language. Pages can be published or archived.

## Authentication

All API requests require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <your-api-key>
```

API keys are issued by administrators. If you don't have one, ask your administrator to run the provisioning script.

## Base URL

All API endpoints are prefixed with `/api/v1`.

## Supported Languages

- `en` - English
- `fr` - French
- `de` - German
- `es` - Spanish

Every page must specify a language. The public site routes pages under `/<lang>/<slug>`.

## URL Structure

- `/` - Redirects to the best language homepage based on browser settings
- `/<lang>/index.html` - Language homepage listing published pages
- `/<lang>/<slug>` - Individual page
- `/sitemap.xml` - Global sitemap index
- `/<lang>/sitemap.xml` - Per-language sitemap

## API Endpoints

### List Pages

```
GET /api/v1/pages
```

Query parameters:
- `lang` (optional) - Filter by language code (e.g., `en`, `fr`)
- `q` (optional) - Search across title, slug, description, and content
- `status` (optional) - `published` (default), `archived`, or `all`
- `limit` (optional) - Results per page, default 50, max 200
- `cursor` (optional) - Pagination cursor from previous response's `next_cursor`

Response:
```json
{
  "items": [...],
  "next_cursor": "uuid-or-null"
}
```

### Get a Single Page

```
GET /api/v1/pages/:lang/:slug
```

Returns the full page including `content_markdown`.

### Create a Page

```
POST /api/v1/pages
Content-Type: application/json

{
  "lang": "en",
  "slug": "my-new-page",
  "title": "My New Page",
  "page_title": "My New Page | Site Name",
  "description": "A brief description for SEO",
  "contentMarkdown": "# Hello\n\nThis is the page content in **markdown**.",
  "template_key": "editorial"
}
```

Required fields: `lang`, `title`, `contentMarkdown`

If `slug` is omitted, one will be generated from the title.

Returns `201` on success, `409` if the page already exists.

### Update a Page

```
PUT /api/v1/pages/:lang/:slug
Content-Type: application/json

{
  "title": "Updated Title",
  "contentMarkdown": "# Updated Content\n\nNew content here."
}
```

All fields are optional - only include what you want to change.

### Archive a Page

```
POST /api/v1/pages/:lang/:slug/archive
```

Sets the page status to `archived`. Archived pages return 404 on the public site.

### Unarchive a Page

```
POST /api/v1/pages/:lang/:slug/unarchive
```

Sets the page status back to `published`.

## Content Format

Pages use GitHub-Flavored Markdown (GFM). Content is sanitised on render, so raw HTML may be stripped. Stick to standard markdown:

- Headings (`#`, `##`, `###`)
- Bold, italic, strikethrough
- Links and images
- Ordered and unordered lists
- Code blocks and inline code
- Tables
- Blockquotes

## Slug Rules

- Lowercase letters, numbers, and hyphens only: `[a-z0-9-]`
- Must start and end with a letter or number
- Unique within a language
- Examples: `getting-started`, `about-us`, `2024-annual-report`

## Editorial Style Guide

### Brand Mission

Holiday Extras removes the stress around travel so customers can enjoy their holidays. We sell the extras — airport parking, airport hotels, airport hotels with parking, airport lounges, travel insurance, car hire, overseas transfers, airport transfers, port parking, rail station parking, travel money, destination experiences and tickets, and holiday packages — but what we really provide is calm, confidence and control.

Strapline: **Less hassle. More holiday.**

### Voice and Tone

- **Confident, not cocky.** We are the market leader. State facts and let them do the work. Do not hedge. Do not apologise for being good. Do not inflate.
- **Playful, not flippant.** A well-placed pun or clever turn of phrase is welcome. If a joke doesn't land naturally, leave it out. Never try too hard.
- **Direct, not rude.** Plain English always. Short sentences. No jargon, corporate waffle, or complicated words when a simple one will do.
- **Empathetic, not patronising.** When something has gone wrong for a customer, practise tactical empathy. See it from their side first. Do not say "have a nice day" to someone who has missed a flight.
- **Data-driven, not dull.** If you make a claim, support it. If you compare prices, explain how. Present data clearly and simply.

### Writing Rules

- Short paragraphs — if one goes beyond four or five lines, break it up. White space is your friend.
- Prefer well-written paragraphs over endless bullet lists. Use bullets only when clarity demands it.
- Never bury the answer at the bottom. If there is a key finding, stat or conclusion, it appears early and clearly.
- Active voice over passive. Say what we do, not what was done.
- We are positive and forward-looking. We count people down to their trips. We build anticipation. We celebrate travel.

### Headlines

- Bold, clear, engaging. Think confident clarity — no sensationalism or clickbait.
- Follow every headline with a short summary line that reinforces the story and sharpens the angle.
- Opening paragraphs must deliver on the headline immediately.

### Brand Phrases (Use Naturally, Never Force)

- **Less hassle. More holiday.** — use where it fits, not everywhere.
- **We've got your back.** — use in insurance content where appropriate.
- **Tried, tested, recommended.** — use when reinforcing credibility.

### Insurance Content

- Calm and reassuring. Never alarmist. Never frighten people into buying.
- Explain risks clearly and practically. Explain cover in simple terms.
- Avoid dense policy language unless legally required. Highlight what matters most.

### Disruption and Bad News

- Lead with practical advice. Explain what customers can do. Clarify their rights.
- Be steady and calm. Never trivialise. Never over-dramatise. Never blame.

### Do Not

- Use patronising language, empty enthusiasm, or "have a nice day" filler
- Write clickbait headlines or overuse travel clichés
- Create walls of text or use corporate jargon
- Use overly technical insurance language
- Attack supply partners or engage in political grandstanding
- Create content purely to chase links — we create content to help customers

### Pre-Publish Checklist

Before publishing, confirm the content passes all of these:

1. Does it reduce hassle for the customer?
2. Does it give the customer clarity?
3. Does it help them make a better decision?
4. Does it feel fair?
5. Would I find this useful if I were travelling next week?
6. Does the tone feel clear, positive, human, and certain?

### SEO

- Set `page_title` for the browser tab (include keywords)
- Write a concise `description` (under 160 characters) for search results
- Use descriptive slugs (e.g., `airport-parking-tips` not `page1`)

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "error_code",
    "message": "Human-readable description"
  }
}
```

Common error codes:
- `unauthorized` (401) - Missing or invalid API key
- `forbidden` (403) - Missing required permission
- `not_found` (404) - Page does not exist
- `conflict` (409) - Page with that lang/slug already exists
- `validation_error` (400) - Invalid input data

## Guardrails

- Pages cannot be deleted, only archived
- Archiving is reversible via the unarchive endpoint
- All changes are audited with timestamps and actor information
- Content is sanitised on render to prevent XSS
