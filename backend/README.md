# NIRANJAN.AI — Voice & Agent Backend

This service powers the Conversational Voice Intelligence experience for the 3D Mechanical AI Entity.

## Architecture

- **Framework:** FastAPI (Python 3.10+)
- **Speech Synthesis (TTS):** Microsoft Edge Neural TTS (`en-US-ChristopherNeural` — natural US-English male voice)
- **Speech Recognition (STT):** Browser Web Speech API via `useVoiceInput` with microphone permission gating
- **Conversational Intelligence:** Rule-based / verified portfolio knowledge engine with optional Gemini / OpenAI LLM integration via `backend/.env`
- **Knowledge Base:** `backend/knowledge.py` — strictly grounded in Niranjan Kumar's verified profile

## Quick Start

1. Run the startup script:
   ```bash
   cd backend
   ./start.sh
   ```
   This will activate the virtual environment (`backend/.venv`) and launch Uvicorn on `http://localhost:8000`.

2. Test server health:
   ```bash
   curl http://localhost:8000/api/health
   ```

## Adding an LLM API Key (Optional)

Create a `backend/.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# or
OPENAI_API_KEY=your_openai_api_key_here
PORT=8000
```
When no external API key is set, the backend operates in **Autonomous Local Mode**, answering inquiries about Niranjan's background, education at BIT Mesra, projects, AI skills, and contact details with zero latency and complete reliability.
