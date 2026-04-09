# 🚀 NearNest AI — Local Service Recommendation Platform

> **Find trusted local professionals (electricians, plumbers, tutors, etc.) powered by AI that analyzes reviews and ranks the best services for you.**

---

## 👨‍💻 Team — NearNest AI⭐

| #   | Name                 | Role | GitHub |
| --- | -------------------- |------|--------|
| 1   |**Sai Ganesh Pushadapu**     |Full Stack Developer | psg210107@gmail.com |
| 2   | **Shashank Reddy.D** |Frontend developer | dachanni2008@gmail.com |
| 3   | **S Sooraj**           |AI / DevOps Lead and also	System Integration & Testing| soorajidpcse@gmail.com |

---

## 📌 What Problem Does This Solve?

Finding reliable local services is frustrating:
- 📵 Fake/spam reviews make it hard to trust ratings
- 🤯 Too many choices without guidance
- 🔍 No easy way to search by natural language ("I need a plumber in Delhi")

## 💡 Our Solution

**NearNest AI** uses Artificial Intelligence to:
1. **Analyze every review** — AI reads each review and scores it as Positive, Neutral, or Negative (catches fake reviews!)
2. **Rank services fairly** — Uses a smart formula combining rating + number of reviews + AI analysis + verification
3. **Chatbot search** — Just type what you need in plain English (e.g., "Find me an electrician in Delhi")

---

## ⭐ Key Features

| Feature | What It Does |
|---------|-------------|
| 🤖 **AI Chatbot** | Type natural sentences like "Find me an AC repair in Mumbai" — AI understands and finds matching services |
| 🧠 **Smart Review Analysis** | Every review is analyzed by AI to detect if it's Positive, Neutral, or Negative |
| 🏆 **AI Trust Score** | Services are ranked by a formula that combines rating, review count, review sentiment, and verification status |
| 🔍 **Filter & Sort** | Filter by Verified Only, Minimum Rating, and sort by Highest/Lowest/Newest |
| 🔐 **Sign In / Sign Up** | Create an account and sign in to access the platform |
| ✨ **Modern UI** | Glassmorphic design with smooth animations powered by Framer Motion |

---

## 🛠️ Tech Stack
 
| Layer | Technology | What It Does |
|-------|-----------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion | The website you see and interact with |
| **Backend** | Node.js, Express.js, Mongoose | Handles API requests and talks to the database |
| **Database** | MongoDB (Local) | Stores all services, reviews, and user data |
| **AI Module** | Python, Flask, VADER, TextBlob | Analyzes reviews and extracts meaning from chat messages |
 


---

## 🔄 How It Works (Simple Version)

```
┌─────────────────────────────────┐
│  1. YOU open the app            │
│     → See homepage + chatbot    │
├─────────────────────────────────┤
│  2. YOU search for a service    │
│     Option A: Type in search    │
│       bar "AC Repair"           │
│     Option B: Ask chatbot       │
│       "Find electrician Delhi"  │
│     Option C: Browse all        │
│       services page             │
├─────────────────────────────────┤
│  3. BEHIND THE SCENES           │
│     → React sends your request  │
│       to Node.js server         │
│     → Node.js asks Python AI    │
│       to understand your text   │
│     → Python finds category +   │
│       location from your words  │
│     → Node.js searches MongoDB  │
│       and ranks results         │
├─────────────────────────────────┤
│  4. YOU see results             │
│     → Best services shown first │
│     → Each has rating + badges  │
│     → AI Trust Score displayed  │
│     → #1 Gold, #2 Silver,       │
│       #3 Bronze rank badges     │
├─────────────────────────────────┤
│  5. YOU can write a review      │
│     → AI analyzes your review   │
│       instantly (Positive/      │
│       Negative/Neutral)         │
│     → Service rating updates    │
│       automatically             │
└─────────────────────────────────┘
```

---

## ⚡ Quick Start (3 Terminals Needed)

### **Prerequisites**
Make sure these are installed on your computer:
- ✅ **Node.js** v18+ → Download: https://nodejs.org/
- ✅ **Python** 3.10+ → Download: https://www.python.org/downloads/
- ✅ **MongoDB** (local) → Download: https://www.mongodb.com/try/download/community
- ✅ **Git** → Download: https://git-scm.com/

### **Step 1: Clone the project**
```bash
git clone https://github.com/your-username/NearNestAI.git
cd NearNestAI
```

### **Step 2: Create environment file**
Create a file called `.env` inside the `server/` folder with this content:
```
PORT=5000
MONGODB_URI=mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest
PYTHON_AI_URL=http://127.0.0.1:5001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### **Step 3: Open 3 terminals and run each one**

**Terminal 1 — Backend (Node.js):**
```bash
cd server
npm install
node server.js
```
✅ You should see: `Server started on port 5000` + `MongoDB connected successfully`

**Terminal 2 — AI Engine (Python):**
```bash
cd ai-model
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
✅ You should see: `Running on http://127.0.0.1:5001`

**Terminal 3 — Frontend (React):**
```bash
cd client
npm install
npm run dev
```
✅ You should see: `Local: http://localhost:5173/`

### **Step 4: Seed the database (first time only)**
Open a **new terminal**:
```bash
cd server
npm run seed
```
✅ You should see: `Database seeded successfully`

### **Step 5: Open in browser**
Go to: **http://localhost:5173/**

---

## 🗄️ MongoDB Setup (Local and Atlas)

### **Install MongoDB on Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run the installer → Choose **"Install MongoDB as a Service"**
3. MongoDB runs automatically in the background
4. Download **MongoDB Compass** (GUI tool) from https://www.mongodb.com/products/compass

### **Verify MongoDB is running:**
```bash
mongosh
> show dbs
> exit
```

### **Connection String (used in .env file):**
```
mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest
```

### **Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect using: `mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest`
3. You'll see the `nearnest` database with `services` and `reviews` collections

### **Troubleshooting MongoDB:**

| Problem | Solution |
|---------|----------|
| `connection refused` | MongoDB not running. Open Command Prompt as Admin → `net start MongoDB` |
| `mongosh not found` | Add MongoDB to your PATH, or use the full path: `C:\Program Files\MongoDB\Server\7.0\bin\mongosh.exe` |

---

## 🧠 How AI Features Work (Simple Explanation)

### **1. Review Analysis (Sentiment)**
When someone writes a review like _"Great service, highly recommended!"_:
- Our AI (using VADER) reads the text
- It gives a score between -1.0 (very negative) and +1.0 (very positive)
- It labels it: **Positive** ✅, **Neutral** 😐, or **Negative** ❌
- This helps catch fake or spam reviews

### **2. Chatbot (Intent Extraction)**
When you type _"Find me an electrician in Delhi"_ in the chatbot:
- Our AI (using TextBlob) reads your sentence
- It finds the **category** → "Electrician"
- It finds the **location** → "Delhi"
- Then searches the database for matching services
- Returns the best matches ranked by AI score

### **3. AI Trust Score Ranking**
Instead of just sorting by star rating, we use a smart formula:

```
AI Trust Score = (40% × rating) + (25% × review volume) + (25% × positive reviews) + (10% × verified status)
```

**Why this matters:**
| Service | Rating | Reviews | AI Score | Result |
|---------|--------|---------|----------|--------|
| Service A | 4.9⭐ | 1 review | 0.67 | Ranks lower |
| Service B | 4.7⭐ | 50 reviews | 0.91 | **Ranks higher** ✅ |

A service with 50 good reviews is more trustworthy than one with just 1 perfect review!

---

## 📡 What Are API Endpoints? (Simple Explanation)

> **API = a URL your app calls to get or send data.** Think of it like ordering food:
> you tell the waiter (API) what you want, and the kitchen (server) prepares it.

### **Getting Services**
| What You Want | URL to Call | What You Get Back |
|--------------|-------------|-------------------|
| All services (best rated first) | `GET http://localhost:5000/api/services` | List of all services, sorted by rating |
| Top 3 AI-ranked services | `GET http://localhost:5000/api/services/ranked?limit=3` | Top 3 services with AI Trust Scores |
| One specific service + its reviews | `GET http://localhost:5000/api/services/SERVICE_ID` | That service's details and all reviews |

### **Searching via Chatbot**
| What You Want | URL to Call | What You Send | What You Get Back |
|--------------|-------------|---------------|-------------------|
| Search by natural language | `POST http://localhost:5000/api/services/chat` | `{"message": "Find electrician in Delhi"}` | AI extracts intent + matching services |

### **Adding a Review**
| What You Want | URL to Call | What You Send | What You Get Back |
|--------------|-------------|---------------|-------------------|
| Submit a review | `POST http://localhost:5000/api/services/SERVICE_ID/reviews` | `{"text": "Great work!", "rating": 5}` | Saved review + AI sentiment result |

### **Checking AI Server**
| What You Want | URL to Call | What You Get Back |
|--------------|-------------|-------------------|
| Is the Python AI server running? | `GET http://127.0.0.1:5001/health` | `{"status": "ok", "service": "NearNest AI Engine"}` |

---

## 🎨 UI Features

- **Glassmorphism Design** — Frosted glass effect with blurred backgrounds
- **Framer Motion Animations** — Smooth card animations when scrolling
- **Rank Badges** — 🥇 Gold (#1), 🥈 Silver (#2), 🥉 Bronze (#3) on top picks
- **AI Trust Score Badge** — Shows AI confidence percentage on each service
- **Sign In / Sign Up** — Create account, login, and see your name in the navbar
- **Filter Sidebar** — Sort by rating, filter by Verified Only, set minimum rating
- **Floating Chatbot** — Click the chat icon in bottom-right to ask for services

---

## 📂 Project Structure

```
NearNestAI/
├── client/                     ← React Frontend (what the user sees)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chatbot.jsx     ← Floating AI chat widget
│   │   │   ├── ServiceCard.jsx ← Individual service card
│   │   │   └── Navbar.jsx      ← Top navigation bar
│   │   ├── pages/
│   │   │   ├── Home.jsx        ← Homepage with hero + top picks
│   │   │   ├── SearchResults.jsx ← Browse all services with filters
│   │   │   ├── ServiceDetails.jsx ← Service info + reviews
│   │   │   └── SignIn.jsx      ← Login / Register page
│   │   ├── index.css           ← Global styles
│   │   └── App.jsx             ← Routes setup
│   └── package.json
│
├── server/                     ← Node.js Backend (handles data & API)
│   ├── routes/
│   │   └── serviceRoutes.js    ← All API endpoints
│   ├── models/
│   │   ├── Service.js          ← Service database schema
│   │   └── Review.js           ← Review database schema
│   ├── data/
│   │   └── seed.js             ← Script to add sample data
│   ├── server.js               ← Main server file
│   ├── .env                    ← Configuration (DB URL, ports)
│   └── package.json
│
├── ai-model/                   ← Python AI Engine (brain of the app)
│   ├── app.py                  ← Flask server with AI endpoints
│   ├── requirements.txt        ← Python packages needed
│   └── venv/                   ← Virtual environment (git-ignored)
│
├── README.md                   ← This file!
├── NEARNEST_RUN_TEST_GUIDE.md  ← Step-by-step guide to run & test
└── .gitignore
```

---

## ⚙️ Configuration

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest
PYTHON_AI_URL=http://127.0.0.1:5001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### `ai-model/requirements.txt`
```
Flask
flask-cors
textblob
vaderSentiment
gunicorn
```

### `client/.env.local` (Optional)
```
VITE_API_URL=http://localhost:5000
```

---

## 🐛 Known Issues & Fixes

| Issue | Status | Fix |
|-------|--------|-----|
| "Maximum update depth exceeded" in Navbar | ✅ Fixed | Removed `user` from useEffect deps, used useRef |
| Database empty (0 services on search page) | ✅ Fixed | Run `npm run seed` in server folder |
| Python `/health` endpoint missing | ✅ Fixed | Added health endpoint to app.py |
| Sort/filter not working in search page | ✅ Fixed | Wired up Verified Only + Minimum Rating filters |
| Sign In button not working | ✅ Fixed | Added SignIn page with login/register form |
| Search text invisible (white on white) | ✅ Fixed | Changed input text color to dark |

---

## 📸 Screenshots
*(Add your stunning UI screenshots here!)*
- `[Homepage with hero section and top picks]`
<img width="1498" height="871" alt="Image" src="https://github.com/user-attachments/assets/cf048dea-00a8-4177-aab9-2f1ba3e0899d" />
- `[Search results page with filters working]`
 <img width="1919" height="897" alt="Image" src="https://github.com/user-attachments/assets/c9ec947a-4240-4400-ab1d-802564e2af44" />
- `[AI Chatbot in action]`
<img width="1602" height="889" alt="Image" src="https://github.com/user-attachments/assets/ed2fdaea-8681-4fd2-bffd-6b0290b50333" />
- `[Service details with review sentiment badges]`
<img width="1897" height="873" alt="Image" src="https://github.com/user-attachments/assets/3197d491-db93-40ee-837f-6ff420ae304b" />
- `[Sign In / Sign Up page]`
<img width="1697" height="891" alt="Image" src="https://github.com/user-attachments/assets/2ad3d40a-d0c9-4345-a36f-f35c62626aba" />

## 📹 Video Tutorial
**[Project](https://drive.google.com/drive/folders/1ZXZI5dlbUbEkigkjb3UJEd-lahmfdRWq)**

## 🌍 Live Demo & Repository

- **Frontend:** [NearNest AI on Vercel](https://ai-local-service-recommendation-pla.vercel.app)
- **Repository:** [GitHub - NearNestAI](https://github.com/OptCamp/NearNestAI)

---
*Built with passion, microservices, and AI-powered recommendations. 🚀*

