# EduBridge 📚
### Offline AI Tutor powered by Gemma 4 + Ollama — Works 100% Without Internet

> Built for students in Pakistan and developing countries where internet is unreliable.  
> No API key. No subscription. No internet needed after setup.

---

## 📋 Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Step 1 — Install Ollama](#step-1--install-ollama)
5. [Step 2 — Pull Gemma 4 Models](#step-2--pull-gemma-4-models)
6. [Step 3 — Backend Setup](#step-3--backend-setup)
7. [Step 4 — Frontend Setup](#step-4--frontend-setup)
8. [Step 5 — ngrok Setup (Live Demo)](#step-5--ngrok-setup-live-demo)
9. [Running Everything Together](#running-everything-together)
10. [Testing with Playwright](#testing-with-playwright)
11. [Troubleshooting](#troubleshooting)

---

## ✨ Features

- 🤖 Chat with AI tutor powered by **Gemma 4** (runs locally)
- 📄 Upload **PDF or TXT** study materials (textbooks, notes, past papers)
- 🔍 **RAG pipeline** — answers grounded in your own uploaded material
- 🔌 Works **100% offline** after one-time setup
- 🔒 **No data** sent to any external server
- 🆓 No API key, no subscription, no cost after setup

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Model | Gemma 4 (`gemma3:4b`) via Ollama |
| Embeddings | `nomic-embed-text` via Ollama |
| Vector Store | ChromaDB (persisted on disk) |
| RAG Framework | LangChain |
| Backend | FastAPI + Python |
| Document Parsing | PyMuPDF + pypdf (fallback) |
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Tunneling | ngrok (for live demo sharing) |

---

## ✅ Prerequisites

Install these before starting:

| Tool | Version | Download |
|------|---------|----------|
| Python | 3.10 or higher | https://python.org/downloads |
| Node.js | 18 or higher | https://nodejs.org |
| Ollama | Latest | https://ollama.com/download |
| ngrok | Latest | https://ngrok.com/download |
| Git | Any | https://git-scm.com |

---

## Step 1 — Install Ollama

### Windows
1. Go to **https://ollama.com/download/windows**
2. Download `OllamaSetup.exe`
3. Run the installer — it installs and starts automatically

### macOS
```bash
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Start Ollama Service
After install, open a terminal and run:
```bash
ollama serve
```

You should see:
```
Listening on 127.0.0.1:11434
```

> ⚠️ Keep this terminal open. Ollama must stay running.

### Verify Ollama is working:
```bash
curl http://localhost:11434/api/tags
```
Should return JSON — means Ollama is running ✅

---

## Step 2 — Pull Gemma 4 Models

These are one-time downloads. After this, everything works offline.

```bash
# Gemma 4 — the AI brain (2.5 GB)
ollama pull gemma3:4b

# Embedding model — for document search (274 MB)
ollama pull nomic-embed-text
```

Wait for both to finish. Then verify:
```bash
ollama list
```

Expected output:
```
NAME                    SIZE
gemma3:4b              2.5 GB
nomic-embed-text       274 MB
```

Test Gemma 4 works:
```bash
ollama run gemma3:4b "Say hello in one sentence"
```

---

## Step 3 — Backend Setup

### Clone the Repository
```bash
git clone https://github.com/Siddiqu92/edubridge.git
cd edubridge
```

### Setup Python Environment

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**macOS / Linux:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Start Backend Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

### Verify Backend is Working
Open in browser:
```
http://localhost:8000/health
```

Expected response:
```json
{"status": "EduBridge is running!", "model": "gemma3:4b"}
```

View full API docs:
```
http://localhost:8000/docs
```

> ⚠️ Keep this terminal open.

---

## Step 4 — Frontend Setup

Open a **new terminal** (keep backend terminal running):

```bash
cd edubridge/frontend
npm install
```

### Create Environment File
Create a file called `.env.local` inside the `frontend` folder:

**Windows:**
```bash
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local
```

**macOS / Linux:**
```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Start Frontend
```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.x
- Local:   http://localhost:3000
- Environments: .env.local
✓ Ready in 1659ms
```

### Open the App
Go to **http://localhost:3000** in your browser.

You should see EduBridge with:
- ● **Ollama Online** badge (green, top right)
- Chat input at the bottom
- Upload panel on the left sidebar

> ⚠️ Keep this terminal open.

---

## Step 5 — ngrok Setup (Live Demo)

ngrok creates a public HTTPS URL so judges and others can access your app from anywhere — without them needing to install anything.

### Install ngrok

**Windows:**
1. Go to **https://ngrok.com/download**
2. Download the Windows ZIP
3. Extract `ngrok.exe` to any folder (e.g., `C:\ngrok\`)
4. Add that folder to your system PATH, or just run from that folder

**macOS:**
```bash
brew install ngrok
```

**Linux:**
```bash
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok
```

### Get Free ngrok Account
1. Go to **https://ngrok.com** and sign up (free)
2. Go to your Dashboard → **Your Authtoken**
3. Copy the token

### Authenticate ngrok (one time only)
```bash
ngrok authtoken YOUR_TOKEN_HERE
```

### Start ngrok — Expose Backend

Open a **new terminal** and run:
```bash
ngrok http 8000
```

You will see:
```
Session Status    online
Account           Your Name (Plan: Free)
Forwarding        https://xxxx-xxxx.ngrok-free.app -> http://localhost:8000
```

Copy the **https URL** — example:
```
https://eaten-counting-unrushed.ngrok-free.dev
```

### Update Frontend to Use ngrok URL

Go to `frontend/.env.local` and update it:

**Windows:**
```bash
echo NEXT_PUBLIC_API_URL=https://eaten-counting-unrushed.ngrok-free.dev > .env.local
```

Replace `eaten-counting-unrushed.ngrok-free.dev` with YOUR actual ngrok URL.

### Restart Frontend
```bash
# Press Ctrl+C to stop, then:
npm run dev
```

### Verify ngrok is Working
Open in browser:
```
https://your-ngrok-url.ngrok-free.dev/health
```

Expected:
```json
{"status": "EduBridge is running!", "model": "gemma3:4b"}
```

Full API docs via ngrok:
```
https://your-ngrok-url.ngrok-free.dev/docs
```

> ⚠️ Free ngrok URLs expire after ~2 hours. Restart `ngrok http 8000` and update `.env.local` if it expires.

---

## 🚀 Running Everything Together

You need **4 terminals open at the same time:**

```
Terminal 1 — Ollama
─────────────────────────────────────
ollama serve

Terminal 2 — Backend
─────────────────────────────────────
cd edubridge/backend
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS/Linux
uvicorn main:app --reload --host 0.0.0.0 --port 8000

Terminal 3 — Frontend
─────────────────────────────────────
cd edubridge/frontend
npm run dev

Terminal 4 — ngrok (for live demo)
─────────────────────────────────────
ngrok http 8000
```

### Quick Status Check

| URL | What to expect |
|-----|----------------|
| http://localhost:11434 | Ollama running |
| http://localhost:8000/health | Backend healthy |
| http://localhost:3000 | EduBridge app |
| https://your-url.ngrok-free.dev/health | Public backend |

---

## 🧪 Testing with Playwright

Playwright tests run against a mock backend — no Ollama needed.

### Install
```bash
cd frontend
npm install
npx playwright install chromium
```

### Run All Tests
```bash
npm run test:e2e
```

### Run with Browser Visible
```bash
npx playwright test --headed
```

### View HTML Report
```bash
npm run test:e2e:report
```

---

## 🔧 Troubleshooting

### "Unable to connect to backend"
- Check `.env.local` has the correct URL (no typos, no extra spaces)
- Make sure backend is running on port 8000
- Make sure ngrok is running and URL is updated in `.env.local`
- Restart frontend after changing `.env.local`

### "Ollama Offline" badge (red)
- Run `ollama serve` in a terminal
- Check: `curl http://localhost:11434/api/tags`

### Answers from wrong documents
- Old data in ChromaDB — delete it:
```bash
# Windows:
cd backend
rmdir /s /q chroma_db

# macOS/Linux:
rm -rf backend/chroma_db
```
Then restart backend.

### ngrok URL expired
- Free ngrok sessions last ~2 hours
- Run `ngrok http 8000` again
- Update `.env.local` with new URL
- Restart frontend

### Backend port already in use
```bash
# Windows — find and kill process on port 8000:
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

### pip install fails
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

---

## 📁 Project Structure

```
edubridge/
├── backend/
│   ├── main.py              # FastAPI app — all API endpoints
│   ├── requirements.txt     # Python dependencies
│   └── chroma_db/           # Vector store (auto-created, gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx     # Main chat page
│   │   │   └── layout.tsx   # Root layout
│   │   └── components/
│   │       ├── ChatWindow.tsx   # Chat UI
│   │       ├── UploadPanel.tsx  # File upload
│   │       └── StatusBadge.tsx  # Ollama status
│   ├── tests/
│   │   ├── edubridge.spec.ts    # Playwright E2E tests
│   │   └── mock_backend.py      # Mock server for tests
│   ├── .env.local           # Your API URL (create this)
│   ├── package.json
│   └── playwright.config.ts
│
└── README.md
```

---

## 🌐 Live Demo Links

| Link | Description |
|------|-------------|
| https://edubridge-neon.vercel.app | Frontend (Vercel) |
| https://your-ngrok-url.ngrok-free.dev/docs | Backend API Docs |
| https://your-ngrok-url.ngrok-free.dev/health | Health Check |


