<div align="center">

<img src="https://img.shields.io/badge/DisasterTrust-AI-FF4444?style=for-the-badge&logo=shield&logoColor=white" alt="DisasterTrust AI" height="40"/>

# 🛡️ DisasterTrust AI

### Community-Powered Disaster Response with AI Confidence Scoring

[![MIT License](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![OpenStreetMap](https://img.shields.io/badge/Map-OpenStreetMap-7EBC6F?style=flat-square&logo=openstreetmap&logoColor=white)](https://www.openstreetmap.org)
[![Status](https://img.shields.io/badge/Status-MVP%20Live-00C853?style=flat-square)](https://github.com/TabithaClitus/DisasterTrustAI)

<br/>

> **"When every second counts, trust matters."**
>
> India's first AI-powered disaster response platform that scores the credibility of every emergency report — before volunteers respond.

<br/>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TabithaClitus/DisasterTrustAI)
&nbsp;&nbsp;
[![View on GitHub](https://img.shields.io/badge/View%20on-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/TabithaClitus/DisasterTrustAI)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Landing Page — Live Incident Feed & Trust Score Innovation

![Landing Page](./public/screenshots/screenshot_landing.png)

### 🆘 Emergency Reporting Wizard — Live Camera + GPS Auto-Lock

![Report Emergency](./public/screenshots/screenshot_report.png)

### 🤝 Volunteer Dashboard — AI-Prioritized Mission Queue

![Volunteer Dashboard](./public/screenshots/screenshot_volunteer.png)

### 🏥 NGO Resource Portal — Real-Time Supply Availability

![NGO Portal](./public/screenshots/screenshot_ngo.png)

### 👮 Admin Command Center — Full Situational Awareness

![Admin Dashboard](./public/screenshots/screenshot_admin.png)

</div>

---

## 🚨 The Problem

During floods, cyclones, and earthquakes, information is scattered across:

- 📱 WhatsApp groups & Telegram channels
- 📞 Phone calls & social media posts
- 📺 News channels — often delayed or unverified

This creates **two critical failures**:

| Problem | Consequence |
|---|---|
| Fragmented information | Rescuers don't know where to go first |
| Fake or outdated reports | Volunteers waste time on false alarms |

People share **old flood videos**, **wrong locations**, and **false rescue requests**. Authorities spend valuable time verifying instead of rescuing.

---

## 💡 Our Solution

**DisasterTrust AI** is a community-powered disaster response platform with one unique innovation:

> ### 🔒 Every report gets a Trust Score (0–100%)
> Based on **live video evidence**, **GPS lock**, **server timestamp**, **community confirmations**, and **volunteer verification** — making fake reports nearly impossible.

---

## ✨ Key Features

### 🆘 Live Emergency Reporting
Citizens report emergencies through a guided 4-step wizard. The platform enforces live camera capture — **no gallery uploads allowed**. GPS and timestamp are captured and locked automatically.

### 🔒 AI Confidence Scoring *(Our Core Innovation)*
Every report is scored based on evidence quality:

| Evidence | Points |
|---|---|
| 📹 Live Video (camera-only, no gallery) | +35 pts |
| 📍 GPS Location (auto-locked) | +25 pts |
| 🕐 Server Timestamp (tamper-proof) | +15 pts |
| 📝 Detailed Description | +10 pts |
| 👥 Community Confirmations | +10 pts |
| ✅ Volunteer Verified | +5 pts |
| **Maximum Trust Score** | **100%** |

### 🤖 AI Priority Classification
Every report is automatically classified into:
- 🔴 **CRITICAL** — Immediate life threat (rescue needed, rising water, medical emergency)
- 🟠 **HIGH** — Urgent but not immediately life-threatening
- 🟡 **MEDIUM** — Resource needs (food, water, shelter)
- 🟢 **LOW** — Minor or unconfirmed situations

### 🗺️ Live Disaster Map
Real-time OpenStreetMap view with color-coded incident markers — rescues, medical emergencies, food distribution points, and NGO resources all visible in one place.

### 🤝 Volunteer Dashboard
Volunteers see AI-prioritized reports sorted by confidence score. Accept requests, mark en-route, and complete rescues — full status tracking.

### 🏥 NGO Resource Portal
NGOs post available food, water, medical supplies, shelter, and rescue equipment. Citizens and volunteers see availability in real-time.

### 👮 Admin Command Center
Full situational awareness with live statistics, critical alert banners, map overview, and incident feed. Auto-refreshes every 30 seconds.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DisasterTrust AI                         │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Citizen    │  Volunteer   │     NGO      │    Admin       │
│   Module     │  Dashboard   │    Portal    │   Command      │
│              │              │              │   Center       │
├──────────────┴──────────────┴──────────────┴────────────────┤
│                      Core AI Engine                          │
│  ┌─────────────────┐  ┌──────────────────────────────────┐  │
│  │ AI Classifier   │  │  Confidence Score Calculator     │  │
│  │ - Category      │  │  - Live Video   (+35 pts)        │  │
│  │ - Priority      │  │  - GPS Lock     (+25 pts)        │  │
│  │ - Urgency %     │  │  - Timestamp    (+15 pts)        │  │
│  └─────────────────┘  │  - Description  (+10 pts)        │  │
│                        │  - Community    (+10 pts)        │  │
│                        │  - Volunteer    (+5 pts)         │  │
│                        └──────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Evidence Capture Layer                     │
│     getUserMedia()    │   navigator.geolocation   │  Server  │
│     (Live Camera)     │   (GPS Auto-Lock)         │  Time    │
├─────────────────────────────────────────────────────────────┤
│                      Map Layer                               │
│              Leaflet.js + OpenStreetMap                      │
│              (CartoDB Dark Tiles)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧑‍💻 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI component library |
| **TypeScript 5** | Type-safe development |
| **Vanilla CSS Modules** | Component-scoped styling |
| **Leaflet.js + React-Leaflet** | OpenStreetMap live map |
| **Lucide React** | Icon library |
| **Google Fonts (Inter, Outfit)** | Typography |

### Browser APIs Used
| API | Purpose |
|---|---|
| `getUserMedia()` | Live camera capture — no gallery allowed |
| `navigator.geolocation` | GPS coordinates auto-lock |
| `MediaRecorder` | Record video evidence |

### Planned Backend
| Technology | Purpose |
|---|---|
| **Firebase Firestore** | Real-time database |
| **Firebase Auth** | Role-based authentication |
| **Firebase Storage** | Video/image uploads |
| **Google Gemini API** | Real AI classification |

### Maps
| Technology | Purpose |
|---|---|
| **OpenStreetMap** | Free, open-source map data |
| **CartoDB Dark Tiles** | Dark-theme map styling |

---

## 🗂️ Project Structure

```
DisasterTrustAI/
├── src/
│   └── app/
│       ├── globals.css              # Design system & tokens
│       ├── layout.tsx               # Root layout + SEO metadata
│       ├── page.tsx                 # Landing page
│       ├── lib/
│       │   ├── aiClassifier.ts      # AI classification engine
│       │   ├── mockData.ts          # Disaster reports & NGO data
│       │   └── store.ts             # In-memory state store
│       ├── components/
│       │   ├── Navbar.tsx           # Navigation bar
│       │   ├── PriorityBadge.tsx    # Critical/High/Medium/Low badge
│       │   └── ConfidenceScore.tsx  # Animated SVG trust score ring
│       ├── report/
│       │   └── page.tsx             # Emergency reporting wizard
│       ├── volunteer/
│       │   └── page.tsx             # Volunteer dashboard
│       ├── ngo/
│       │   └── page.tsx             # NGO resource portal
│       └── admin/
│           ├── page.tsx             # Admin command center
│           └── LiveMap.tsx          # Leaflet map component
├── public/
│   └── screenshots/                 # App screenshots
├── LICENSE
├── README.md
└── package.json
```

---

## 👥 User Roles

| Role | Route | Purpose |
|---|---|---|
| 🆘 **Citizen** | `/report` | Submit emergency reports with live evidence |
| 🤝 **Volunteer** | `/volunteer` | View, accept, and complete rescue requests |
| 🏥 **NGO** | `/ngo` | Post available resources (food, water, medical, shelter) |
| 👮 **Admin / Authority** | `/admin` | Full situational awareness and coordination |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/TabithaClitus/DisasterTrustAI.git

# Navigate to project directory
cd DisasterTrustAI

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Routes

| Route | Page |
|---|---|
| `/` | Landing Page — Live incident feed & stats |
| `/report` | Report Emergency — 4-step guided wizard |
| `/volunteer` | Volunteer Dashboard — AI-prioritized missions |
| `/ngo` | NGO Resource Portal — Post & view supplies |
| `/admin` | Admin Command Center — Full map + feed |

### One-Click Deploy

Deploy your own instance to Vercel in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TabithaClitus/DisasterTrustAI)

---

## 📊 MVP Status

| Feature | Status |
|---|---|
| Landing Page | ✅ Complete |
| Emergency Reporting Wizard | ✅ Complete |
| Live Camera Capture | ✅ Complete |
| GPS Auto-Lock | ✅ Complete |
| AI Confidence Scoring | ✅ Complete |
| AI Priority Classification | ✅ Complete |
| Volunteer Dashboard | ✅ Complete |
| NGO Resource Portal | ✅ Complete |
| Admin Command Center | ✅ Complete |
| OpenStreetMap Live Map | ✅ Complete |
| Dark Design System | ✅ Complete |
| Firebase Auth | 🔜 Planned |
| Firestore Real-time DB | 🔜 Planned |
| Gemini AI Integration | 🔜 Planned |
| Push Notifications | 🔜 Planned |
| Video Storage | 🔜 Planned |
| Mobile App | 🔜 Planned |

---

## 🔮 Future Scope

- **Firebase Authentication** — Role-based login (Citizen / Volunteer / NGO / Admin)
- **Firestore Persistence** — Real-time data that survives page refresh and syncs across users
- **Google Gemini AI** — True LLM-powered classification and urgency detection
- **Push Notifications** — Instant alerts to volunteers when critical reports come in
- **SMS Alerts** — Twilio integration for areas with low internet access
- **Mobile App** — React Native version for on-the-ground responders
- **Volunteer GPS Tracking** — Match nearest volunteers to incidents automatically
- **Heatmap View** — Identify disaster hotspot zones
- **Multi-language Support** — Tamil, Hindi, Telugu for broader reach
- **Historical Analytics** — Response time, resolution rates, trend analysis

---

## 🎯 Impact

> DisasterTrust AI directly addresses the **information reliability problem** in disaster response — the #1 bottleneck that causes preventable deaths.
>
> By scoring the trustworthiness of every report, we ensure that **the most credible emergencies get the fastest response**.

---

## 👩‍💻 Author

**Tabitha Merin Clitus**
GitHub: [@TabithaClitus](https://github.com/TabithaClitus)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ to save lives.

⭐ Star this repo if you find it useful!

</div>
