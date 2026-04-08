# 🚀 NearNest AI: Step-by-Step Run & Test Guide

**Time Required:** ~20-30 minutes  
**Difficulty:** Beginner-friendly  
**Last Updated:** April 8, 2026

---

## ✅ STEP 1: Check Prerequisites

Open **Command Prompt** or **PowerShell** and run these commands:

```bash
node --version
# Should show: v18.x.x or higher ✅

python --version
# Should show: Python 3.10.x or higher ✅

git --version
# Should show: git version 2.x.x ✅
```

**Check MongoDB is running:**
```bash
mongosh --eval "db.adminCommand('ping')"
# Should show: { ok: 1 } ✅
```

❌ **Something missing?** Download from:
- Node.js: https://nodejs.org/ (LTS version)
- Python: https://www.python.org/downloads/
- MongoDB: https://www.mongodb.com/try/download/community
- Git: https://git-scm.com/

---

## 📂 STEP 2: Clone & Open Project

```bash
git clone https://github.com/your-username/NearNestAI.git
cd NearNestAI
```

Check that you see these 3 folders: `client/`, `server/`, `ai-model/`

---

## 🔧 STEP 3: Create Environment File

Create a file called `.env` inside the `server/` folder.

**On Windows (PowerShell):**
```powershell
cd server
@"
PORT=5000
MONGODB_URI=mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest
PYTHON_AI_URL=http://127.0.0.1:5001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or just create it manually:**
1. Open `server/` folder in File Explorer
2. Create a new text file called `.env` (no extension)
3. Paste this content:
```
PORT=5000
MONGODB_URI=mongodb+srv://soorajidpcse_db_user:jntuhroot@m0.h368xus.mongodb.net/nearnest
PYTHON_AI_URL=http://127.0.0.1:5001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

✅ **Check:** `.env` file exists in `server/` folder

---

## 📦 STEP 4: Install Backend Dependencies

```bash
cd server
npm install
```

✅ **Check:** No errors + `node_modules/` folder appears

---

## 🐍 STEP 5: Install Python AI Dependencies

```bash
cd ai-model
python -m venv venv

# Activate virtual environment (Windows):
venv\Scripts\activate

# Install packages:
pip install -r requirements.txt
```

✅ **Check:** You see `(venv)` in your terminal + no errors

---

## ⚛️ STEP 6: Install Frontend Dependencies

```bash
cd client
npm install
```

✅ **Check:** No errors + `node_modules/` folder appears

---

## 🚀 STEP 7: Start All 3 Servers (Open 3 Separate Terminals!)

### **Terminal 1: Backend Server**
```bash
cd server
node server.js
```
✅ **You should see:**
```
Server started on port 5000
MongoDB connected successfully
```

### **Terminal 2: Python AI Server**
```bash
cd ai-model
venv\Scripts\activate
python app.py
```
✅ **You should see:**
```
Running on http://127.0.0.1:5001
```

### **Terminal 3: React Frontend**
```bash
cd client
npm run dev
```
✅ **You should see:**
```
Local: http://localhost:5173/
```

---

## 🌱 STEP 8: Seed the Database (First Time Only)

Open a **4th terminal** (or use one that's free):
```bash
cd server
npm run seed
```

✅ **You should see:** `Database seeded successfully`

This adds 7 sample services (electricians, plumbers, tutors, etc.) to your database.

---

## 🧪 STEP 9: Test the App in Your Browser

### **9a. Open the app**
Go to: **http://localhost:5173/**

**What you should see:**
- ✅ NearNest AI logo in the top bar
- ✅ A big hero section with a search bar
- ✅ "AI Curated Top Picks" section with 3 service cards
- ✅ A floating chat button in the bottom-right corner

### **9b. Test the Search**
1. Type `"AC Repair"` in the hero search bar
2. Press Enter or click **Search**
3. You should see matching services (like "CoolBreeze AC Services")

### **9c. Test the Filters (Refine Results)**
On the search results page (`/search`):

1. **Sort By dropdown** — Change between:
   - ★ Highest Rated First (default)
   - ★ Lowest Rated First
   - 🕐 Newest First
   - Results should re-order each time you change it

2. **Verified Only checkbox** — Check it:
   - Only services with a green "VERIFIED" badge should appear
   - Unverified services (like "Glow Up Home Salon") disappear

3. **Minimum Rating slider** — Move it to 4.5:
   - Only services with rating ≥ 4.5 should appear
   - Services with lower ratings disappear

4. **Clear All button** — Click it:
   - All filters reset, all services reappear

### **9d. Test Sign In**
1. Click the **Sign In** button (top-right of the navbar)
2. Click **Sign Up** at the bottom of the form
3. Fill in: Name, Email, Password (min 6 chars)
4. Click **Create Account**
5. You should be redirected to the homepage
6. The navbar should now show your name instead of "Sign In"
7. Click your name → Click **Sign Out** to log out

### **9e. Test Service Details**
1. Click on any service card (e.g., "CoolBreeze AC Services")
2. You should see:
   - Service name, category, location, price
   - Contact phone number
   - "AI Verified Reviews" section
   - "Leave Feedback" form
3. Write a review: `"Excellent service, very professional!"` with 5 stars
4. Click **Publish Review**
5. The review should appear with a green **"Positive"** sentiment badge

### **9f. Test the Chatbot**
1. Click the **purple chat bubble** in the bottom-right
2. Type: `"Find me a plumber in Delhi"`
3. The chatbot should respond with matching services
4. Try: `"I need an electrician in Mumbai"`

---

## 🔍 STEP 10: Test Using API Directly (Optional)

> **What is this?** These commands let you test the backend directly without using the browser.
> Open a new terminal and run these:

### **Test 1: Get all services**
```bash
curl http://localhost:5000/api/services
```
**What you should get:** A list of all 7 services in JSON format.

### **Test 2: Get AI-ranked top picks**
```bash
curl http://localhost:5000/api/services/ranked?limit=3
```
**What you should get:** Top 3 services sorted by AI Trust Score.

### **Test 3: Test the chatbot**
**On Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/services/chat" -Method POST -ContentType "application/json" -Body '{"message":"Find electrician in Delhi"}'
```

**On Windows Command Prompt (cmd):**
```cmd
curl -X POST http://localhost:5000/api/services/chat -H "Content-Type: application/json" -d "{\"message\":\"Find electrician in Delhi\"}"
```

**What you should get:** AI finds category="Electrician", location="Delhi", and matching services.

### **Test 4: Check Python AI Server Health**
```bash
curl http://127.0.0.1:5001/health
```
**What you should get:**
```json
{
  "status": "ok",
  "service": "NearNest AI Engine",
  "version": "1.0.0",
  "endpoints": ["/analyze", "/extract_intent", "/rank", "/health"]
}
```

> ⚠️ **If you get "connection refused"** — the Python server (Terminal 2) is not running!
> Go back to Terminal 2, make sure `(venv)` is active, and run `python app.py`

### **Test 5: Test AI Sentiment Analysis**
**On Windows PowerShell:**
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:5001/analyze" -Method POST -ContentType "application/json" -Body '{"text":"This is great work!"}'
```

**What you should get:**
```json
{
  "sentiment": "Positive",
  "scores": {"compound": 0.6588, "neg": 0.0, "neu": 0.326, "pos": 0.674}
}
```

---

## 🐛 STEP 11: Troubleshooting Common Issues

### **"Port 5000 already in use"**
```bash
# Find what's using port 5000:
netstat -ano | findstr :5000
# Kill the process:
taskkill /PID <PID_NUMBER> /F
# Then restart:
node server.js
```

### **"Cannot connect to MongoDB"**
```bash
# Start MongoDB service (run as Administrator):
net start MongoDB
# Then verify:
mongosh 
```

### **"Python Flask not starting"**
```bash
# Make sure venv is activated:
venv\Scripts\activate
# You should see (venv) in your terminal
# If packages missing:
pip install -r requirements.txt
# Then restart:
python app.py
```

### **"Services not showing (0 results)"**
```bash
# Your database is empty! Seed it:
cd server
npm run seed
# Then refresh the browser
```

### **"Chatbot not responding"**
1. Check Terminal 2 (Python server) — is it running?
2. Check Terminal 1 (Node server) — any errors?
3. Open browser DevTools (F12) → Console tab → any red errors?

### **"Maximum update depth exceeded" (console error)**
This was a bug in the Navbar. It has been fixed.
If you still see it, make sure you have the latest `Navbar.jsx` file.

---

## ✅ STEP 12: Verify Everything Works

Check each item below:

```
✅ Node.js server running on port 5000 (Terminal 1)
✅ Python AI server running on port 5001 (Terminal 2)
✅ React app running on port 5173 (Terminal 3)
✅ App loads in browser (http://localhost:5173)
✅ Service cards appear on homepage (not empty)
✅ Search bar works (try "AC Repair")
✅ Sort dropdown changes order of results
✅ Verified Only checkbox filters services
✅ Minimum Rating slider filters services
✅ Sign In → Sign Up → Create Account works
✅ Chatbot responds to "Find electrician in Delhi"
✅ Service details page loads when clicking a card
✅ Adding a review works + shows sentiment badge
✅ No red errors in browser console (F12)
✅ curl http://127.0.0.1:5001/health returns OK

TOTAL: ____ / 15 checks passed ✅
```

---

## 🚀 STEP 13: Commit to Git

Once everything works, commit your code:

```bash
# Check what changed:
git status

# Add all files:
git add .

# Commit with a message:
git commit -m "feat: NearNest AI with AI ranking, chatbot, filters, and sign-in

- AI Trust Score ranking algorithm
- NLP chatbot with intent extraction
- Sentiment analysis on reviews
- Search filters (sort, verified, min rating)
- Sign In / Sign Up with localStorage
- MongoDB local setup with seed data
- All 3 services running locally"

# Push to GitHub:
git push origin main
```

✅ **Done! Your code is on GitHub! 🎉**

---

## 📞 Quick Reference Commands

| What | Command | Where |
|------|---------|-------|
| Start backend | `node server.js` | `server/` folder |
| Start Python AI | `python app.py` | `ai-model/` folder (with venv active) |
| Start frontend | `npm run dev` | `client/` folder |
| Seed database | `npm run seed` | `server/` folder |
| Check MongoDB | `mongosh` | Anywhere |
| Activate Python venv | `venv\Scripts\activate` | `ai-model/` folder |
| Install Node packages | `npm install` | `server/` or `client/` folder |
| Install Python packages | `pip install -r requirements.txt` | `ai-model/` folder (with venv) |

---
*Guide prepared for NearNest AI — April 2026*
