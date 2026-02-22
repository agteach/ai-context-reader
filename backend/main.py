from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os
import shutil
from services.document_loader import process_document
from services.vector_store import VectorStoreManager
from services.llm_engine import LLMEngine
from pydantic import BaseModel

app = FastAPI(title="DocuMind AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_manager = VectorStoreManager()
llm_engine = LLMEngine()

class QueryRequest(BaseModel):
    query: str
    doc_id: str
    context_text: Optional[str] = None

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    temp_dir = "temp_files"
    os.makedirs(temp_dir, exist_ok=True)
    file_path = os.path.join(temp_dir, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        chunks = process_document(file_path)
        doc_id = vector_manager.create_index(chunks, file.filename)
        return {"status": "success", "doc_id": doc_id, "filename": file.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/ask")
async def ask_question(request: QueryRequest):
    try:
        context = vector_manager.get_relevant_context(request.doc_id, request.query)
        response = llm_engine.generate_response(request.query, context)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-selection")
async def analyze_selection(request: QueryRequest):
    try:
        # Get vector store context even for specific selection to provide broader understanding
        vector_context = vector_manager.get_relevant_context(request.doc_id, request.context_text or request.query)
        prompt = f"Selected text: {request.context_text}

Task: {request.query}

Overall Document Context: {vector_context}"
        response = llm_engine.generate_response(prompt, "")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)