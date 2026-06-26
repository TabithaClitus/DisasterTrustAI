# Unbound '26 Development Declaration

## Project: DisasterTrust AI

This document declares the development timeline and scope of work completed for the **Unbound '26 Hackathon**.

---

## Project Summary

**DisasterTrust AI** is a community-powered disaster response platform that addresses the problem of fragmented and unreliable emergency information during disasters. The core innovation is a **real-time AI Confidence Scoring system** that scores every emergency report based on live video evidence, GPS verification, and community confirmations — making fake reports nearly impossible.

---

## Core Features Implemented

| Feature | Description |
|---|---|
| **Emergency Reporting Wizard** | 4-step guided flow with category selection, live evidence capture, AI classification, and review |
| **Live Camera Enforcement** | `getUserMedia()` — only live camera recording accepted, no gallery uploads |
| **GPS Auto-Lock** | `navigator.geolocation` — location captured and locked at submission, user cannot edit |
| **AI Confidence Scoring Engine** | Scores every report 0–100% based on video, GPS, timestamp, community confirms, volunteer verification |
| **AI Classification Engine** | Classifies reports into categories (Flood/Rescue/Medical/etc.) and priorities (Critical/High/Medium/Low) |
| **Volunteer Dashboard** | Prioritized report feed, accept/complete flow, community confirmation system |
| **NGO Resource Portal** | Post and view food, water, medical, shelter, rescue resource availability |
| **Admin Command Center** | Live situational overview with statistics, critical alert banners, and incident feed |
| **Disaster Mapping System** | OpenStreetMap integration (Leaflet.js) with color-coded priority markers and NGO resource pins |
| **Design System** | Full dark-theme UI with emergency color palette, glassmorphism, and micro-animations |

---

## Development Timeline

> Timeline reflects actual development activity as verified by git commit history.

### June 23, 2026 — Core Development Day

| Time (IST) | Activity |
|---|---|
| Planning | Project architecture design, component planning, data modeling |
| Early session | Design system (`globals.css`) — color palette, typography, animations, glassmorphism |
| Session 1 | `layout.tsx` (SEO), `lib/mockData.ts` (8 disaster reports, 5 NGO resources), `lib/aiClassifier.ts`, `lib/store.ts` |
| Session 2 | Shared components — `Navbar`, `PriorityBadge`, `ConfidenceScore` (animated SVG ring) |
| Session 3 | Landing page (`page.tsx`, `page.module.css`) — hero, stats counters, live report feed, features, role cards |
| Session 4 | Emergency Reporting Wizard (`/report`) — 4-step flow with live camera, GPS lock, real-time AI analysis |
| Session 5 | Volunteer Dashboard (`/volunteer`) — filter/sort, report cards, accept/complete flow, confirm reports |
| Session 6 | NGO Portal (`/ngo`) — resource form, resource grid with call buttons |
| Session 7 | Admin Command Center (`/admin`) — stats bar, critical alert, Leaflet map (`LiveMap.tsx`), incident feed |
| Evening | Bug fixes (hydration mismatch, resource type correction), testing all 5 pages |
| **Commit** | `50c942b` — "Initial commit: DisasterTrust AI full MVP" — 38 files, 12,532 lines |

### June 24, 2026 — Documentation & Submission Day

| Time (IST) | Activity |
|---|---|
| Morning | Project review, status assessment |
| 21:25 IST | `ffe9b49` — Added MIT License (`LICENSE`) |
| 21:29 IST | `b2e6132` — Added comprehensive README (`README.md`) with architecture diagram, feature tables, tech stack |
| 21:34 IST | Created `docs/HACKATHON.md` — this document |
| Remaining | Final submission preparation |

---

## Verified Commit Log

```
b2e6132  2026-06-24 21:29  Add comprehensive README with architecture, features, and tech stack
ffe9b49  2026-06-24 21:25  Add MIT License
192813c  2026-06-23 21:37  Remove temp commit message file
50c942b  2026-06-23 21:36  Initial commit: DisasterTrust AI full MVP (38 files, 12,532 lines)
```

---

## Technical Scope

### Files Created During Hackathon

```
38 source files created from scratch:

src/app/globals.css                          ← Design system (~500 lines)
src/app/layout.tsx                           ← Root layout + SEO
src/app/page.tsx                             ← Landing page
src/app/page.module.css                      ← Landing page styles
src/app/lib/aiClassifier.ts                  ← AI engine
src/app/lib/mockData.ts                      ← Data layer
src/app/lib/store.ts                         ← State management
src/app/components/Navbar.tsx                ← Navigation
src/app/components/Navbar.module.css
src/app/components/PriorityBadge.tsx         ← Priority indicators
src/app/components/PriorityBadge.module.css
src/app/components/ConfidenceScore.tsx       ← Animated SVG ring
src/app/components/ConfidenceScore.module.css
src/app/report/page.tsx                      ← Emergency wizard
src/app/report/report.module.css
src/app/volunteer/page.tsx                   ← Volunteer dashboard
src/app/volunteer/volunteer.module.css
src/app/ngo/page.tsx                         ← NGO portal
src/app/ngo/ngo.module.css
src/app/admin/page.tsx                       ← Admin command center
src/app/admin/LiveMap.tsx                    ← OpenStreetMap component
src/app/admin/admin.module.css
```

### Total Lines of Code

| Category | Lines |
|---|---|
| TypeScript / TSX | ~8,200 |
| CSS Modules | ~4,300 |
| **Total** | **~12,500** |

---

## Dependencies Added

```bash
npm install leaflet react-leaflet @types/leaflet lucide-react
```

| Package | Purpose |
|---|---|
| `leaflet` | OpenStreetMap rendering |
| `react-leaflet` | React wrapper for Leaflet |
| `@types/leaflet` | TypeScript types |
| `lucide-react` | Icon library |

---

## Originality Declaration

- All code in this repository was written during the Unbound '26 Hackathon period
- No pre-existing codebase was reused
- The project was initialized from a standard `create-next-app` scaffold and all application logic was built from scratch
- The **AI Confidence Scoring System** is an original concept developed specifically for this hackathon

---

## Repository

**GitHub:** [https://github.com/TabithaClitus/DisasterTrustAI](https://github.com/TabithaClitus/DisasterTrustAI)

**License:** MIT — Copyright (c) 2026 Tabitha Merin Clitus

---

*This document was created as part of the Unbound '26 Hackathon submission.*
