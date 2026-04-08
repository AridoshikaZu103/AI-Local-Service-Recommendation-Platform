# Deploy NearNestAI: localhost → https://near_nest_ai.vercel.app/

## Architecture Overview

Your app has **3 parts**:

| Component | Tech | localhost | Production Plan |
|-----------|------|-----------|-----------------|
| **Client** | React + Vite | `localhost:5173` | ✅ Vercel (static hosting) |
| **Server** | Express + Mongoose | `localhost:5000` | ✅ Vercel Serverless Functions |
| **AI Model** | Flask + Python | `localhost:5001` | ⚠️ See options below |
| **Database** | MongoDB Atlas | Cloud already | ✅ Already set up |

---

## User Review Required

> [!IMPORTANT]
> **Python AI Model**: Vercel Serverless Functions support **Node.js and Python**, but your Python Flask app uses `textblob`, `vaderSentiment`, and `flask` which need special packaging. There are **3 options**:
>
> **Option A** — Deploy AI as a separate Python service on **Render.com** (free tier) or **Railway.app** — keeps Flask as-is  
> **Option B** — Convert the Python AI logic to **Node.js** (pure JS sentiment analysis) so everything runs on Vercel — simplest single-platform deploy  
> **Option C** — Use Vercel's Python runtime for the AI endpoints — requires restructuring into Vercel's Python function format  
>
> **My recommendation**: **Option A** (Render.com free tier for Python) — minimal code changes.
> 
> Which option do you prefer?

> [!WARNING]
> Your MongoDB connection string is currently **hardcoded in `server.js`** AND committed in `.env` (which is gitignored, but the string is also in the source code). For production, use **only environment variables** and never commit credentials.

---

## Proposed Changes

### 1. Restructure Server for Vercel Serverless Functions

Vercel doesn't run a persistent Express server. Instead, each route becomes a serverless function.

#### [NEW] [vercel.json](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/desktop-tutorial/CODE/NearNestAI/vercel.json)
Root-level Vercel config to handle routing:
- Route `/api/*` → serverless functions in `server/api/`
- Route everything else → client static build

#### [MODIFY] [server.js](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/desktop-tutorial/CODE/NearNestAI/server/server.js)
- Export the Express app for Vercel serverless instead of `app.listen()`
- Keep `app.listen()` for local development behind a guard

#### [NEW] `server/api/index.js`
- Vercel entry point that imports the Express app and wraps it for serverless

---

### 2. Update Client for Production API URL

#### [MODIFY] [.env.local](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/desktop-tutorial/CODE/NearNestAI/client/.env.local)
- Keep as `http://localhost:5000` for local dev (no change)

#### [NEW] `.env.production`
- `VITE_API_URL=https://near-nest-ai.vercel.app` (or your actual Vercel backend URL)

Your client code already uses `import.meta.env.VITE_API_URL` with fallback — ✅ no code changes needed in components.

---

### 3. Fix CORS for Production

#### [MODIFY] [server.js](file:///c:/Users/ADMIN/OneDrive/Documents/GitHub/desktop-tutorial/CODE/NearNestAI/server/server.js)
- Allow multiple origins (localhost for dev + Vercel domain for prod)
- Use `CORS_ORIGIN` env var

---

### 4. MongoDB Atlas Configuration

Your MongoDB Atlas is already connected. For deployment:
- Add `MONGODB_URI` as an environment variable in Vercel dashboard
- Remove the hardcoded fallback connection string from `server.js`

---

## Deployment Steps (after code changes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Configure for Vercel deployment"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → Import your GitHub repo
2. Set **Root Directory** to `NearNestAI` (or wherever your `vercel.json` lives)
3. Set **Framework Preset** to `Vite`
4. Set **Build Command** to `cd client && npm install && npm run build`
5. Set **Output Directory** to `client/dist`

### Step 3: Add Environment Variables in Vercel Dashboard
| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://soorajidpcse_db_user:***@m0.h368xus.mongodb.net/nearnest` |
| `PYTHON_AI_URL` | `https://your-python-service.onrender.com` (if Option A) |
| `CORS_ORIGIN` | `https://near-nest-ai.vercel.app` |
| `NODE_ENV` | `production` |

### Step 4: Seed Database (if needed)
```bash
cd server && node data/seed.js
```
(Run locally pointing to Atlas — your Atlas connection already works)

---

## Open Questions

> [!IMPORTANT]
> 1. **Python AI Model** — Which option (A/B/C) do you prefer? This affects how we structure the deployment.
> 2. **Custom Domain** — Do you already have `near_nest_ai.vercel.app` reserved, or will Vercel auto-generate the domain?
> 3. **MongoDB Atlas credentials** — Should I remove the hardcoded connection string from `server.js` and rely purely on env vars?

---

## Verification Plan

### Automated Tests
- Build client locally: `cd client && npm run build`
- Test vercel dev locally: `vercel dev` (requires Vercel CLI)
- Hit `/api/services` endpoint and verify JSON response

### Manual Verification
- After deployment, visit `https://near-nest-ai.vercel.app`
- Test search, service details, chatbot, and review submission
- Verify MongoDB Atlas data is being read correctly
