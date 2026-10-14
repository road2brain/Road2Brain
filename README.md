# Road 2 Brain 🚀
> **Learn. Build. Grow.** — The Student Career Development Platform for Engineering Students in India.

Road 2 Brain is a production-grade career ecosystem built specifically for B.Tech CSE/IT students preparing for internships, technical careers, hackathons, and campus placements. It consolidates verified student opportunities, curated coursework from global universities, and year-wise engineering roadmaps so students never have to search dozens of websites or unverified chat groups.

---

## 🌟 Key Features

### 1. Verified Opportunity Directory (`/opportunities`)
- **Direct Official Links:** Every listing is checked against official corporate career boards, hackathon platforms, or university circulars.
- **Verification Integrity:** Badges show verification status, verifying admin, audit notes, and verified dates.
- **Smart Filtering:** Filter by Opportunity Type (Internships, Fresher Jobs, Hackathons, Scholarships, Student Programs), Academic Year (1st to 4th Year), Work Mode (Remote, Hybrid, On-site), and Application Deadline.
- **Shareable URLs:** Filter state is synchronized with URL parameters for sharing.
- **Deadline Indicators:** Real-time countdowns and clear indicators for expired opportunities.

### 2. Structured 4-Year Engineering Roadmaps (`/roadmaps`)
- **Career Tracks:**
  - **Software Development Engineer (SDE)** (10 structured milestones)
  - **Machine Learning / AI Engineer** (9 structured milestones)
  - **Data Analyst / Data Scientist** (7 structured milestones)
- **Year-by-Year Guidance:** 1st Year (Foundations), 2nd Year (Development & Core DSA), 3rd Year (Systems, Cloud & Internships), 4th Year (Placements & Portfolio).
- **Interactive Progress Tracking:** Check off completed milestones with persistent storage across sessions.
- **Project Suggestions & Curated Resources:** Hands-on portfolio project ideas and direct resource links for every milestone.

### 3. Curated Free & Affordable Course Directory (`/courses`)
- Direct links to top-tier university curricula: Harvard CS50, DeepLearning.AI, MIT Missing Semester, freeCodeCamp, fast.ai, NeetCode, and AWS Skill Builder.
- Filtering by difficulty level, category, and free vs paid.
- Certificate availability indicators and price verification tracking.

### 4. Student Dashboard (`/dashboard`)
- **Deterministic Recommendations:** Matches opportunities based on student's branch, academic year, and skills.
- **Roadmap Milestone Progress:** Visual percentage bar with direct link to the next incomplete milestone.
- **Saved Items:** Bookmarked opportunities and courses with 1-click removal.
- **Upcoming Deadlines Alert:** Alerts for saved listings closing within 14 days.

### 5. Administrative Console (`/admin`)
- **Real Platform Metrics:** Actual counts of active listings, pending reviews, expired records, and roadmaps.
- **Verification Queue:** Dedicated audit interface to review source URLs, write verification notes, and verify listings before publishing.
- **Strict Content Lifecycle:** Draft → Pending Verification → Verified → Published → Expired/Archived. Unverified listings cannot be published.
- **Course & Price Management:** Track price updates and certificate details.
- **Student Account Oversight:** Inspect student enrollment and target tracks with anti-escalation security.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite 6 |
| **Styling & Design System** | Tailwind CSS 3.4, Custom Accessible Primitives |
| **Icons & Motion** | Lucide React, GSAP 3.12, Framer Motion |
| **Routing** | React Router DOM v6 |
| **Database & Auth** | Cloud Firestore, Firebase Authentication, Firebase Hosting |
| **Local Fallback Mode** | Intelligent LocalStorage Persistence Layer for offline demo evaluation |
| **Testing** | Vitest 2.1, React Testing Library, jsdom |

---

## 📁 Project Directory Structure

```text
Road2Brain/
├── public/
│   ├── favicon.svg            # Emblem brand favicon
│   ├── logo.svg               # Full wordmark SVG asset
│   ├── logo-icon.svg          # Compact emblem SVG
│   ├── robots.txt             # SEO crawler instructions
│   └── sitemap.xml            # Search engine sitemap
├── src/
│   ├── components/
│   │   ├── admin/             # Admin forms, modals & layout
│   │   ├── common/            # Button, Badge, Card, Modal, Input, Select, Skeleton, EmptyState
│   │   ├── courses/           # Course cards and category filters
│   │   ├── dashboard/         # WelcomeBanner, QuickActions, Recommendations, SavedItems
│   │   ├── layout/            # Navbar with mobile drawer, Footer with disclaimers
│   │   ├── opportunities/     # OpportunityCard, OpportunityFilters
│   │   └── roadmaps/          # RoadmapCard, RoadmapTimeline
│   ├── contexts/
│   │   ├── AuthContext.tsx    # Firebase Auth & student role state
│   │   └── ToastContext.tsx   # Accessible notifications
│   ├── hooks/
│   │   ├── useBookmarks.ts    # Persistent bookmark management
│   │   ├── useDebounce.ts     # Search debouncing
│   │   └── useRoadmapProgress.ts # Milestone completion tracking
│   ├── lib/
│   │   ├── firebase.ts        # Firebase client & emulator configuration
│   │   ├── seedData.ts        # 30+ verified opportunities, 12 courses, 3 full roadmaps
│   │   └── utils.ts           # URL validation, currency/date formatters, deadline calculations
│   ├── pages/
│   │   ├── admin/             # Admin dashboard, opportunities, courses, roadmaps, users
│   │   ├── Home.tsx           # Startup landing page with GSAP motion & honest FAQ
│   │   ├── Opportunities.tsx  # Searchable, filterable directory with URL sync
│   │   ├── OpportunityDetails.tsx # Detailed view with verification audit notes
│   │   ├── Courses.tsx        # Curated technical coursework
│   │   ├── Roadmaps.tsx       # 4-year engineering guidance
│   │   ├── RoadmapDetails.tsx # Interactive visual milestone timeline
│   │   ├── Dashboard.tsx      # Student personalized control center
│   │   ├── Profile.tsx        # Profile editing (academic year, skills, branch)
│   │   ├── Login.tsx          # Sign in with 1-click evaluation accounts
│   │   ├── Signup.tsx         # Student onboarding with role-lock
│   │   ├── ForgotPassword.tsx # Password reset
│   │   ├── About.tsx          # Startup vision & non-affiliation disclaimer
│   │   ├── Contact.tsx        # Feedback & broken link reporting
│   │   ├── Privacy.tsx        # Transparent privacy policy
│   │   ├── Terms.tsx          # Terms of service
│   │   └── NotFound.tsx       # 404 page
│   ├── services/              # Opportunities, courses, roadmaps, bookmarks, user services
│   ├── types/                 # Strict TypeScript data models
│   ├── App.tsx                # App routes & role guards
│   ├── index.css              # Tailwind base & smooth scroll styling
│   └── main.tsx               # App entrypoint
├── tests/
│   ├── auth.test.tsx          # Student registration, login & admin guard tests
│   ├── opportunities.test.tsx # Opportunity filtering, verification lifecycle tests
│   ├── roadmaps_bookmarks.test.tsx # Bookmark persistence & roadmap progress tests
│   ├── security.test.ts       # URL scheme validation & anti-escalation tests
│   └── setup.ts               # Testing library setup
├── firestore.rules            # Strict Firestore security rules with role checks
├── firestore.indexes.json     # Compound query indexes
├── firebase.json              # Firebase Hosting SPA rewrites & emulator ports
├── .env.example               # Environment variables template
├── package.json               # Dependencies and build scripts
└── vite.config.ts             # Vite & Vitest configuration
```

---

## ⚡ Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/bhanuxai/Road2Brain.git
cd Road2Brain
npm install
```

### 2. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env
```

> **Note on Offline/Demo Mode:**
> If Firebase credentials are not provided in `.env`, Road 2 Brain automatically boots in **Local Persistence Mode**. All 30+ verified opportunities, courses, and roadmaps are loaded instantly into your browser's persistent storage, allowing you to test student logins, bookmarks, milestone completions, and admin CRUD immediately!

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing

Run the full automated test suite (Unit, Integration, and Security tests):
```bash
npm test
```
All 13 automated tests verify:
1. Student registration with academic profile fields.
2. Demo logins and password recovery.
3. Access denial for students attempting to enter the Admin console.
4. Opportunity filtering by academic year, type, and location.
5. Opportunity slug-based detail retrieval.
6. Bookmark persistence across browser sessions.
7. Course browsing and price type filters.
8. Roadmap loading and milestone progression.
9. Milestone completion persistence.
10. Content verification lifecycle (cannot publish unverified listings).
11. Expired listing filtering.
12. Strict URL scheme validation preventing `javascript:` injection.
13. Anti-escalation security preventing students from elevating their role.

---

## 🏗️ Production Build

To test and create the optimized production bundle:
```bash
npm run build
```
Output files will be generated in `dist/`.

Preview the production build locally:
```bash
npm run preview
```

---

## 🔥 Firebase Setup & Deployment

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project called **Road2Brain**.
3. Under **Build > Authentication**, enable **Email/Password** sign-in provider.
4. Under **Build > Firestore Database**, create a Firestore database in **Production mode**.
5. Copy your web app configuration keys into `.env`:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=road2brain.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=road2brain
   VITE_FIREBASE_STORAGE_BUCKET=road2brain.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

### 2. Deploy Firestore Rules & Indexes
Ensure Firebase CLI is logged in:
```bash
firebase login
firebase use --add <your-firebase-project-id>
firebase deploy --only firestore:rules,firestore:indexes
```

### 3. Deploy to Firebase Hosting
```bash
npm run build
firebase deploy --only hosting
```

---

## 🔐 Security Architecture

- **Strict Firestore Rules (`firestore.rules`):**
  - Public users can only read opportunities that are `status == 'published'` AND `verificationStatus == 'verified'`.
  - Students can only read/write their own bookmarks and roadmap progress (`request.auth.uid == userId`).
  - Client-side role escalation is blocked (`request.resource.data.role == resource.data.role`).
- **URL Scheme Validation:** All submitted application and source URLs are strictly verified for `http:` or `https:` protocols, stopping malicious protocols like `javascript:`.
- **Admin Guard (`AdminGuard.tsx`):** Route-level enforcement ensuring only authenticated users with `role === 'admin'` can access admin tools.

---

## 📄 License & Disclaimers

Road 2 Brain is developed as an independent career platform for engineering students. All brand names, company names, and logos belong to their respective trademark holders. Road 2 Brain does not guarantee employment; our roadmaps provide an industry-aligned technical curriculum to maximize student competence.
