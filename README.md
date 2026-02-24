<p align="center">
  <h1 align="center">📄 ResumeForge</h1>
  <p align="center">
    <strong>A full-stack AI-powered resume builder with 15 professional templates, real-time preview, ATS scoring, and a drag-and-drop sandbox editor.</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#license">License</a>
  </p>
</p>

---

## ✨ Features

### 🖊️ Resume Editor
- **15 Professional Templates** — Classic, Modern, Tech (GitHub-style), Minimal, Executive, Creative, Compact, Professional, Elegant, Bold, Simple, Academic, Timeline, Glance, and Identity
- **Live Preview** — see changes reflected instantly as you type
- **Drag & Drop Reordering** — reorder sections, work experience, education, projects, and more via drag handles
- **Section Order Control** — customize the order in which sections appear on the resume
- **Custom Sections** — add unlimited user-defined sections (Volunteer Work, Publications, Awards, etc.) with full CRUD support

### 🤖 AI-Powered Assistance
- **AI Bullet Improvement** — powered by Google Gemini to refine and strengthen resume bullet points
- **Contextual Suggestions** — AI understands the section context and provides relevant improvements

### 📊 ATS Checker
- **Real-time ATS Scoring** — analyze your resume against ATS (Applicant Tracking System) criteria
- **Actionable Feedback** — get specific suggestions to improve your ATS compatibility score

### 🎨 Sandbox Editor (Pro)
- **Drag-and-Drop Canvas** — Figma-like editor for complete creative control
- **Components Panel** — pre-built resume building blocks
- **Assets & Styles** — manage images, fonts, and styling
- **Layers Management** — z-index and visibility control
- **Rulers & Zoom** — precision layout tools
- **Content Assist** — AI-powered writing assistance within the canvas
- **Job Description Matching** — compare resume against specific job postings
- **Section Semantics** — ATS-aware semantic tagging for custom layouts
- **Version History** — track and restore previous versions
- **Smart Starting Points** — pre-designed templates to kickstart your design

### 💳 Subscription & Payments
- **Tiered Plans** — Free, Pro, and Pro Plus tiers
- **Razorpay Integration** — secure payment processing
- **Subscription Management** — tier expiry tracking and renewal

### 📈 Analytics Dashboard
- **Usage Tracking** — views, downloads, and copies
- **Download Breakdown** — track PDF, DOCX, and TXT exports separately
- **Visual Charts** — interactive analytics dashboard for premium users

### 🔐 Authentication
- **JWT-based Auth** — secure login/registration with hashed passwords (bcrypt)
- **Password Reset** — OTP-based password recovery via email
- **Protected Routes** — tier-gated access to premium features

### 📤 Export Options
- **PDF Export** — server-side rendering via Puppeteer for pixel-perfect PDFs
- **DOCX Export** — Microsoft Word compatible documents
- **JSON Export** — save/load resume data for backup and portability

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Zustand** | State management |
| **Zundo** | Undo/redo history |
| **React Router v7** | Client-side routing |
| **@dnd-kit** | Drag-and-drop interactions |
| **Lucide React** | Icon library |
| **React Hot Toast** | Notification toasts |

### Backend
| Technology | Purpose |
|---|---|
| **Express** | HTTP server framework |
| **TypeScript** | Type safety |
| **PostgreSQL** | Relational database |
| **Puppeteer** | Server-side PDF generation |
| **Google Gemini AI** | AI-powered content improvement |
| **Razorpay** | Payment processing |
| **JWT + bcrypt** | Authentication & password hashing |
| **Nodemailer** | Email delivery (password resets) |
| **docx** | DOCX file generation |

### Shared
| Technology | Purpose |
|---|---|
| **TypeScript** | Shared type definitions and schemas |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- **PostgreSQL** ≥ 14
- **Google Chrome / Chromium** — installed locally (required by Puppeteer)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/resumebuilder.git
cd resumebuilder
```

### 2. Install Dependencies
```bash
npm install
```
This installs dependencies for all three workspaces (`shared`, `client`, `server`).

### 3. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/resumebuilder

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Google Gemini AI
GOOGLE_API_KEY=your-google-api-key

# Razorpay Payments
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

Create a `.env` file in the `client/` directory (optional):

```env
VITE_API_URL=http://localhost:3001
```

### 4. Set Up the Database

Create the PostgreSQL database and run the schema:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE resumebuilder;"

# Run schema setup
npm run db:setup --workspace=server
```

Or manually apply the schema:

```bash
psql -U postgres -d resumebuilder -f server/src/db/schema.sql
```

### 5. Start Development Servers

```bash
# Start both client and server concurrently
npm run dev
```

Or start them individually:

```bash
# Terminal 1 — Server (port 3001)
npm run dev:server

# Terminal 2 — Client (port 5173)
npm run dev:client
```

### 6. Open in Browser

Navigate to **http://localhost:5173**

---

## 📁 Project Structure

```
resumebuilder/
├── package.json              # Root workspace config
├── shared/                   # Shared types & schemas
│   └── src/
│       ├── resume-schema.ts  # Core types (ResumeData, interfaces)
│       └── index.ts          # Re-exports
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── App.tsx           # Route definitions
│       ├── index.css         # Global styles
│       ├── pages/
│       │   ├── LandingPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── PricingPage.tsx
│       │   └── PaymentSuccessPage.tsx
│       ├── components/
│       │   ├── MainEditor.tsx          # Template-based editor
│       │   ├── editor/                 # Editor form components
│       │   │   ├── PersonalInfoForm.tsx
│       │   │   ├── WorkExperienceForm.tsx
│       │   │   ├── EducationForm.tsx
│       │   │   ├── SkillsForm.tsx
│       │   │   ├── ProjectsForm.tsx
│       │   │   ├── CertificationsForm.tsx
│       │   │   ├── CustomSectionsForm.tsx
│       │   │   ├── SettingsForm.tsx
│       │   │   ├── ATSChecker.tsx
│       │   │   ├── AiAssistButton.tsx
│       │   │   └── Sortable*Card.tsx   # DnD-enabled cards
│       │   ├── sandbox/                # Drag-and-drop canvas editor
│       │   │   ├── SandboxEditor.tsx
│       │   │   ├── SandboxCanvas.tsx
│       │   │   ├── DraggableElement.tsx
│       │   │   └── ...panels
│       │   ├── preview/
│       │   │   └── ResumePreview.tsx
│       │   └── dashboard/
│       │       └── AnalyticsDashboard.tsx
│       ├── stores/
│       │   └── useResumeStore.ts       # Zustand store
│       ├── contexts/
│       │   ├── AuthContext.tsx
│       │   └── TierContext.tsx
│       └── utils/
└── server/                   # Express backend
    └── src/
        ├── index.ts          # Server entry point
        ├── routes/
        │   ├── auth.routes.ts        # Registration, login, password reset
        │   ├── ai.routes.ts          # AI bullet improvement
        │   ├── pdf.routes.ts         # PDF/DOCX/TXT export
        │   ├── payment.routes.ts     # Razorpay order & verification
        │   └── analytics.routes.ts   # Usage tracking
        ├── services/
        │   ├── template-renderer.ts  # Classic & Modern templates
        │   ├── templates-extra.ts    # 5 additional templates
        │   ├── templates-more.ts     # 5 more templates
        │   ├── tech-template.ts      # GitHub-style tech template
        │   ├── templates-photo.ts    # Photo-enabled templates
        │   ├── pdf-generator.ts      # Puppeteer PDF generation
        │   ├── docx-generator.ts     # DOCX file generation
        │   └── sandbox-renderer.ts   # Sandbox canvas renderer
        ├── db/
        │   ├── schema.sql            # Database schema
        │   ├── setup.ts              # DB initialization script
        │   └── index.ts              # PostgreSQL connection pool
        └── utils/
            └── email.ts              # Email service (Nodemailer)
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get current user profile |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP |
| `POST` | `/api/auth/reset-password` | Reset password using OTP |

### Resume Export
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/generate-pdf` | Generate PDF from resume data |
| `POST` | `/api/generate-docx` | Generate DOCX from resume data |
| `POST` | `/api/generate-txt` | Generate plain text resume |

### AI Assistance
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/improve` | Improve a resume bullet point |
| `POST` | `/api/ai/assist` | General AI writing assistance |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payment/create-order` | Create Razorpay order |
| `POST` | `/api/payment/verify` | Verify payment and upgrade tier |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analytics/track` | Track a usage event |
| `GET` | `/api/analytics/stats` | Get usage statistics |

### Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Server health check |

---

## 🗃️ Database Schema

```mermaid
erDiagram
    users {
        int id PK
        varchar email UK
        varchar password_hash
        varchar name
        tier_type tier
        date tier_expiry
        timestamp created_at
        timestamp updated_at
    }
    payments {
        int id PK
        int user_id FK
        varchar razorpay_payment_id
        varchar razorpay_order_id
        varchar razorpay_signature
        int amount
        varchar currency
        varchar plan
        varchar status
        timestamp created_at
    }
    password_resets {
        int id PK
        int user_id FK
        varchar otp
        timestamp expires_at
        boolean used
        timestamp created_at
    }
    resume_analytics {
        int id PK
        int user_id FK
        varchar event_type
        jsonb metadata
        timestamp created_at
    }
    users ||--o{ payments : "has"
    users ||--o{ password_resets : "requests"
    users ||--o{ resume_analytics : "generates"
```

---

## 🎨 Templates

<table>
<tr>
<td align="center"><strong>Classic</strong><br>Clean single-column</td>
<td align="center"><strong>Modern</strong><br>Two-column with sidebar</td>
<td align="center"><strong>Tech</strong><br>GitHub-inspired dark theme</td>
</tr>
<tr>
<td align="center"><strong>Minimal</strong><br>Whitespace-focused</td>
<td align="center"><strong>Executive</strong><br>Corporate & authoritative</td>
<td align="center"><strong>Creative</strong><br>Bold & expressive</td>
</tr>
<tr>
<td align="center"><strong>Compact</strong><br>Dense, space-efficient</td>
<td align="center"><strong>Professional</strong><br>Balanced & versatile</td>
<td align="center"><strong>Elegant</strong><br>Serif typography</td>
</tr>
<tr>
<td align="center"><strong>Bold</strong><br>Strong visual impact</td>
<td align="center"><strong>Simple</strong><br>No-frills clean design</td>
<td align="center"><strong>Academic</strong><br>Scholarly formatting</td>
</tr>
<tr>
<td align="center"><strong>Timeline</strong><br>Chronological visual flow</td>
<td align="center"><strong>Glance</strong><br>Photo-enabled sidebar</td>
<td align="center"><strong>Identity</strong><br>Photo-header layout</td>
</tr>
</table>

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run server tests
npm test --workspace=server

# Watch mode
npm run test:watch --workspace=server
```

---

## 🏗️ Building for Production

```bash
# Build all packages
npm run build

# Start production server
npm start --workspace=server
```

---

## 📝 Scripts Reference

| Command | Description |
|---|---|
| `npm run dev` | Start client + server concurrently |
| `npm run dev:client` | Start Vite dev server (port 5173) |
| `npm run dev:server` | Start Express dev server (port 3001) |
| `npm run build` | Build all workspaces |
| `npm test` | Run all tests |
| `npm run db:setup --workspace=server` | Initialize database tables |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Built using React, Express, and TypeScript
</p>
