# DocuMind AI - Multi-format Document Reader

A production-ready application for intelligent document analysis using RAG (Retrieval Augmented Generation).

## Setup Instructions

### Backend (FastAPI)
1. Navigate to `backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate: `source venv/bin/activate` (Mac) or `venv\Scripts\activate` (Win)
4. Install: `pip install -r requirements.txt`
5. Configure: Rename `.env.example` to `.env` and add your API keys.
6. Run: `python main.py`

### Frontend (React + Vite)
1. Install: `npm install`
2. Run: `npm run dev`

## Architecture
- **Processing**: LangChain handles doc loading and splitting.
- **Search**: FAISS vector store with HuggingFace embeddings.
- **LLM**: Groq (Mixtral) or OpenAI for context-aware responses.
- **UI**: Modern React 19 interface with floating AI popups.