"""
NIRANJAN.AI — FastAPI Backend
Stage 2.5: Voice Intelligence Experience

Endpoints:
  POST /api/chat        — LLM conversation (verified knowledge base only)
  POST /api/tts         — Text-to-speech (edge-tts, en-US-ChristopherNeural)
  GET  /api/health      — Health check

Environment variables (never committed):
  GEMINI_API_KEY        — Google Gemini API key (optional, falls back to rule-based)
  OPENAI_API_KEY        — OpenAI API key (optional alternative)
  CORS_ORIGIN           — Allowed frontend origin (default: http://localhost:5173)
"""

import os
import io
import json
import asyncio
import logging
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

import edge_tts
from knowledge import SYSTEM_PROMPT, PORTFOLIO_KNOWLEDGE

# ── Logging ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("niranjan.ai")

# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NIRANJAN.AI Portfolio Backend",
    version="2.5.0",
    description="Voice intelligence and AI conversation for Niranjan Kumar's portfolio",
)

CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN, "http://localhost:4173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Voice configuration ───────────────────────────────────────────────────
TTS_VOICE = "en-US-ChristopherNeural"   # Warm, natural American English male
TTS_RATE = "+0%"                        # Normal speaking rate

# ── Schemas ───────────────────────────────────────────────────────────────
class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    action: Optional[dict] = None   # e.g. {"action": "navigate", "section": "projects"}

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = None     # defaults to TTS_VOICE

# ── LLM abstraction layer (replaceable) ──────────────────────────────────
async def call_llm(messages: List[Message]) -> str:
    """
    Call the configured LLM. Tries Gemini, then OpenAI, then rule-based fallback.
    API keys are read from environment — never hardcoded.
    """
    gemini_key = os.getenv("GEMINI_API_KEY", "")
    openai_key = os.getenv("OPENAI_API_KEY", "")

    # ── Gemini path ───────────────────────────────────────────────────────
    if gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=SYSTEM_PROMPT,
            )
            history = []
            for m in messages[:-1]:
                history.append({"role": m.role if m.role != "assistant" else "model", "parts": [m.content]})
            chat = model.start_chat(history=history)
            resp = chat.send_message(messages[-1].content)
            return resp.text
        except Exception as e:
            logger.warning(f"Gemini call failed: {e}. Falling back.")

    # ── OpenAI path ───────────────────────────────────────────────────────
    if openai_key:
        try:
            import openai
            client = openai.AsyncOpenAI(api_key=openai_key)
            chat_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
            for m in messages:
                chat_messages.append({"role": m.role, "content": m.content})
            resp = await client.chat.completions.create(
                model="gpt-4o-mini",
                messages=chat_messages,
                max_tokens=400,
            )
            return resp.choices[0].message.content
        except Exception as e:
            logger.warning(f"OpenAI call failed: {e}. Using rule-based fallback.")

    # ── Rule-based fallback (no API key required) ─────────────────────────
    return _rule_based_response(messages[-1].content if messages else "")


def _rule_based_response(user_input: str) -> str:
    """Minimal rule-based responder when no LLM is available. Strictly verified info only."""
    q = user_input.lower().strip()

    if any(w in q for w in ["who are you", "what are you", "introduce yourself", "who is this"]):
        return ("I'm the AI assistant inside Niranjan Kumar's portfolio. "
                "I can help you explore his background, technical skills, and ongoing projects. "
                "What would you like to know?")

    if any(w in q for w in ["who is niranjan", "about niranjan", "tell me about him"]):
        return ("Niranjan Kumar is a curious and adaptable Software Engineer with an interest in "
                "Artificial Intelligence. He is currently pursuing a Bachelor of Computer Applications "
                "at Birla Institute of Technology, Mesra, with an expected graduation in 2027.")

    if any(w in q for w in ["project", "work", "building", "making"]):
        return ("Niranjan has three ongoing projects: AI-Powered Gym Trainer (computer vision & pose estimation), "
                "LexAI-India (legal AI with RAG for Indian jurisprudence), and an AI Resume ATS System "
                "(semantic resume parsing and scoring). All are currently in progress.")

    if any(w in q for w in ["gym", "fitness", "trainer", "workout"]):
        return ("The AI-Powered Gym Trainer is an ongoing project using computer vision and deep learning "
                "for real-time exercise form guidance and repetition tracking. Technologies include "
                "Python, Pose Estimation, and Deep Learning.")

    if any(w in q for w in ["lexai", "legal", "law", "india"]):
        return ("LexAI-India is an ongoing legal AI project. It uses RAG (Retrieval-Augmented Generation) "
                "and vector search to assist with Indian statutory research and legal document intelligence. "
                "Built with FastAPI and embedding models.")

    if any(w in q for w in ["resume", "ats", "cv", "job"]):
        return ("The AI Resume ATS System is an ongoing project for intelligent resume parsing, "
                "semantic scoring, and job description matching. It uses LLMs, NLP, and Python.")

    if any(w in q for w in ["skill", "tech", "language", "know", "experience", "python"]):
        return ("Niranjan's core skills include Python, React, FastAPI, and a strong generative AI stack: "
                "LLMs, RAG, embeddings, Gemini API, LangChain, Hugging Face, and ChromaDB. "
                "He also works with NumPy, Pandas, Scikit-learn, SQL, and Docker.")

    if any(w in q for w in ["education", "study", "college", "bit", "mesra", "degree", "bca"]):
        return ("Niranjan is pursuing a Bachelor of Computer Applications (BCA) at "
                "Birla Institute of Technology, Mesra, expected to graduate in 2027. "
                "He scored 94% in Class X (2022) and 84.4% in Class XII (2024).")

    if any(w in q for w in ["contact", "reach", "email", "linkedin", "github", "instagram"]):
        return ("You can contact Niranjan through: "
                "Email — kumarniranjan84096@gmail.com, "
                "LinkedIn — linkedin.com/in/niranjan-kumar84, "
                "GitHub — github.com/niranjankumar84, "
                "Instagram — @this_is_niranjans.")

    if any(w in q for w in ["certification", "course", "apna", "ml", "ai/ml"]):
        return ("Niranjan has completed an AI/ML course at Apna College, covering machine learning "
                "algorithms, statistical data analysis, mathematical foundations, and practical "
                "deep learning implementations.")

    if any(w in q for w in ["navigate", "go to", "show me", "take me", "open"]):
        for section in ["projects", "skills", "about", "education", "contact", "hero", "achievements"]:
            if section in q:
                return json.dumps({"action": "navigate", "section": section,
                                   "message": f"Taking you to the {section} section."})

    if any(w in q for w in ["hello", "hi", "hey", "greet"]):
        return ("Hello! I'm Niranjan's AI portfolio assistant. "
                "I can tell you about his background, projects, skills, education, or how to contact him. "
                "What would you like to explore?")

    return ("I don't have specific information about that. "
            "For anything not covered here, the best way is to reach Niranjan directly at "
            "kumarniranjan84096@gmail.com or through his LinkedIn profile.")


def _parse_action(reply: str) -> tuple[str, Optional[dict]]:
    """Check if the LLM returned a navigation JSON action."""
    try:
        data = json.loads(reply.strip())
        if isinstance(data, dict) and data.get("action") == "navigate":
            msg = data.get("message", f"Navigating to {data.get('section', '')}.")
            return msg, {"action": "navigate", "section": data.get("section")}
    except (json.JSONDecodeError, ValueError):
        pass
    return reply, None


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": "2.5.0",
        "tts_voice": TTS_VOICE,
        "llm_available": bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")),
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=422, detail="No messages provided.")

    # Sanitize: strip system role from client messages (security)
    safe_messages = [m for m in req.messages if m.role in ("user", "assistant")]
    if not safe_messages:
        raise HTTPException(status_code=422, detail="No user messages provided.")

    try:
        raw_reply = await call_llm(safe_messages)
    except Exception as e:
        logger.error(f"LLM error: {e}")
        raise HTTPException(status_code=500, detail="AI assistant is temporarily unavailable. Please try again.")

    reply_text, action = _parse_action(raw_reply)
    return ChatResponse(reply=reply_text, action=action)


@app.post("/api/tts")
async def text_to_speech(req: TTSRequest):
    """
    Stream MP3 audio for the given text using edge-tts.
    Voice defaults to en-US-ChristopherNeural (warm American English male).
    """
    text = req.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Text is required.")
    if len(text) > 1200:
        raise HTTPException(status_code=422, detail="Text too long (max 1200 characters).")

    voice = req.voice or TTS_VOICE

    try:
        communicate = edge_tts.Communicate(text, voice)
        audio_buf = io.BytesIO()

        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_buf.write(chunk["data"])

        audio_buf.seek(0)
        audio_bytes = audio_buf.read()

        if not audio_bytes:
            raise HTTPException(status_code=502, detail="No audio received from TTS service.")

        return StreamingResponse(
            io.BytesIO(audio_bytes),
            media_type="audio/mpeg",
            headers={
                "Cache-Control": "no-store",
                "Content-Length": str(len(audio_bytes)),
            },
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=502, detail="Voice synthesis unavailable. Please try text mode.")
