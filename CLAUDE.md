# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SWFT.AI is a static SaaS landing page for a B2B small business automation service (home services, dental, medical practices). The entire site is a single self-contained HTML file with inline CSS and vanilla JavaScript.

## Running Locally

```bash
# Serve via HTTP server (recommended)
python3 -m http.server 8000
# Then visit http://localhost:8000/SWFT%20Ai.html
```

No build step, package manager, or dependencies to install.

## Architecture

**Single file:** `SWFT Ai.html` (~1,073 lines) contains all markup, styles, and scripts inline.

**Sections:** Navigation bar → Hero → Features (4 cards) → Process (3 steps) → Pricing (3 tiers: Starter $497/mo, Growth $797/mo, Pro $1,197/mo) → Form modal → Footer

**Styling:** CSS custom properties with dark theme, lime-green accent (`#c8f400`). Uses flexbox and grid layouts, backdrop filters, and CSS animations.

**Fonts:** Google Fonts — Syne (headings), DM Sans (body text).

**JavaScript functionality:**
- Modal open/close with overlay
- Scroll-based reveal animations via IntersectionObserver
- Smooth anchor link scrolling
- Form submission with validation feedback
