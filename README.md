# EduBridge 
### AI Tutor powered by Gemma 4 + Ollama — Works 100% Offline

EduBridge is an offline-first AI tutoring platform built for students 
in underserved communities where internet access is unreliable.
Powered by Google's Gemma 4 model running locally via Ollama.

## Features
- Chat with AI tutor powered by Gemma 4 (local)
- Upload PDF/TXT study materials
- RAG pipeline for document-based answers
- Works completely offline
- No data sent to external servers

## Tech Stack
- **AI Model**: Gemma 4 (gemma3:4b) via Ollama
- **Embeddings**: nomic-embed-text via Ollama
- **Backend**: FastAPI + LangChain + ChromaDB
- **Frontend**: Next.js + TypeScript + Tailwind CSS
- **RAG**: ChromaDB vector store

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama installed

### 1. Install Ollama Models
```bash
ollama pull gemma3:4b
ollama pull nomic-embed-text
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4. Open App
