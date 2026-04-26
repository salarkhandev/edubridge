from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama
import os
import shutil
from rag import RAGPipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rag = RAGPipeline()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    # RAG se relevant context dhoondhao
    context = rag.search(request.message)
    
    # System prompt with or without context
    if context:
        system_prompt = f"""You are EduBridge, a helpful AI tutor for students worldwide.
        Use the following context from uploaded documents to answer the question.
        If context is relevant, use it. Otherwise use your own knowledge.
        Always respond in English only.
        Give SHORT, clear answers in maximum 4-5 sentences.
        Be friendly and encouraging.
        
        Context from documents:
        {context}"""
    else:
        system_prompt = """You are EduBridge, a helpful AI tutor for students worldwide.
        Give SHORT, clear answers in maximum 4-5 sentences.
        Always respond in English only.
        Be friendly and encouraging."""

    response = ollama.chat(
        model="gemma3:4b",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": request.message}
        ]
    )
    
    return {
        "answer": response.message.content,
        "used_rag": bool(context)
    }

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    os.makedirs("./documents", exist_ok=True)
    file_path = f"./documents/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    chunks = rag.ingest(file_path, file.filename)
    
    return {
        "message": f"Document uploaded successfully!",
        "filename": file.filename,
        "chunks_indexed": chunks
    }

@app.get("/health")
async def health():
    return {"status": "EduBridge is running!", "model": "gemma3:4b"}