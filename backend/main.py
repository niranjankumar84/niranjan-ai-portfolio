"""
NIRANJAN.AI — FastAPI Backend
Stage 7: Limited-Scope Agentic AI Experience

Features:
  - Understands visitor intent & identifies required tasks
  - Selects appropriate portfolio-scoped tools
  - Executes real, verified tools (navigate, explore_project, compare_projects, explore_skills, get_contact_channel)
  - Evaluates results and generates verified synthesized responses
  - Returns structured agent execution trace for interactive frontend visualization
  - Controlled execution with max 3 iterations (prevents infinite tool loops)
  - Secure backend-side API key handling
  - Full fallback when external LLMs are unavailable
"""

import os
import io
import json
import asyncio
import logging
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field

import edge_tts
from knowledge import SYSTEM_PROMPT, PORTFOLIO_KNOWLEDGE
from agent_tools import AGENT_TOOL_REGISTRY, VERIFIED_PROJECTS, VERIFIED_CONTACT_INFO

# ── Logging ───────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("niranjan.ai")

# ── App ───────────────────────────────────────────────────────────────────
app = FastAPI(
    title="NIRANJAN.AI Portfolio Agentic Backend",
    version="7.0.0",
    description="Agentic AI assistant and voice intelligence for Niranjan Kumar's portfolio",
)

CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:5173")
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
if CORS_ORIGIN and CORS_ORIGIN not in ALLOWED_ORIGINS:
    ALLOWED_ORIGINS.append(CORS_ORIGIN)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TTS_VOICE = "en-US-ChristopherNeural"

# ── Models ────────────────────────────────────────────────────────────────
class Message(BaseModel):
    role: str = Field(..., pattern="^(user|assistant|system)$")
    content: str

class AgentTraceStep(BaseModel):
    step: int
    stage: str               # 'intent' | 'tool_selection' | 'tool_execution' | 'evaluation'
    status: str              # 'thinking' | 'completed' | 'failed'
    title: str
    detail: Optional[str] = None
    tool: Optional[str] = None
    args: Optional[Dict[str, Any]] = None
    result: Optional[Dict[str, Any]] = None

class ChatRequest(BaseModel):
    messages: List[Message]
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    action: Optional[Dict[str, Any]] = None
    agent_trace: Optional[List[AgentTraceStep]] = None

class TTSRequest(BaseModel):
    text: str
    voice: Optional[str] = None


# ── Gemini Tool Declarations ──────────────────────────────────────────────
GEMINI_TOOL_DECLARATIONS = [
    {
        "name": "navigate_portfolio",
        "description": "Navigate visitors to a specific section of Niranjan's portfolio: hero, about, skills, projects, education, achievements, contact.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "section": {
                    "type": "STRING",
                    "description": "Target section name",
                    "enum": ["hero", "about", "skills", "projects", "education", "achievements", "contact"]
                }
            },
            "required": ["section"]
        }
    },
    {
        "name": "explore_project",
        "description": "Retrieve verified technical information about one of Niranjan's three projects and optionally open the Project World case study.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "project_id": {
                    "type": "STRING",
                    "description": "Project ID: 'gym-trainer', 'lexai-india', or 'ai-resume-ats'",
                    "enum": ["gym-trainer", "lexai-india", "ai-resume-ats"]
                },
                "open_world": {
                    "type": "BOOLEAN",
                    "description": "Whether to trigger and open the immersive Project World case study modal"
                }
            },
            "required": ["project_id"]
        }
    },
    {
        "name": "compare_projects",
        "description": "Compare two of Niranjan's projects using verified information (objectives, architecture, technologies, status).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "project_a_id": {
                    "type": "STRING",
                    "description": "First project ID ('gym-trainer', 'lexai-india', or 'ai-resume-ats')",
                    "enum": ["gym-trainer", "lexai-india", "ai-resume-ats"]
                },
                "project_b_id": {
                    "type": "STRING",
                    "description": "Second project ID ('gym-trainer', 'lexai-india', or 'ai-resume-ats')",
                    "enum": ["gym-trainer", "lexai-india", "ai-resume-ats"]
                }
            },
            "required": ["project_a_id", "project_b_id"]
        }
    },
    {
        "name": "explore_skills",
        "description": "Retrieve and explain verified technical skills from Niranjan's inventory by category or specific technology name.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "query_or_category": {
                    "type": "STRING",
                    "description": "Category name ('programming', 'ai-ml', 'data-science', 'web-dev', 'databases', 'tools') or technology name (e.g. 'python', 'pytorch', 'rag')"
                }
            },
            "required": ["query_or_category"]
        }
    },
    {
        "name": "get_contact_channel",
        "description": "Provide verified contact information and directs visitors to the appropriate channel (email, github, linkedin, instagram, or all).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "channel": {
                    "type": "STRING",
                    "description": "Contact channel: 'email', 'github', 'linkedin', 'instagram', or 'all'",
                    "enum": ["email", "github", "linkedin", "instagram", "all"]
                }
            },
            "required": ["channel"]
        }
    }
]


# ── Autonomous Deterministic Agentic Router (Fallback) ───────────────────
def run_autonomous_agent(user_prompt: str) -> tuple[str, Optional[dict], List[AgentTraceStep]]:
    """
    Genuine Agentic execution without external API dependencies.
    Understands intent -> selects tool -> executes tool -> evaluates result -> synthesizes reply.
    """
    q = user_prompt.strip().lower()
    trace: List[AgentTraceStep] = []
    step_num = 1
    action = None

    # Step 1: Understand Intent
    trace.append(AgentTraceStep(
        step=step_num,
        stage="intent",
        status="completed",
        title="Intent Understanding",
        detail=f"Analyzed visitor query: '{user_prompt[:80]}...'"
    ))
    step_num += 1

    # Check 1: Portfolio Navigation (Explicit Intent)
    if any(k in q for k in ["navigate", "take me to", "go to", "scroll to", "show section", "head to"]):
        target_sec = "hero"
        for s in ["about", "skills", "projects", "education", "achievements", "contact", "hero"]:
            if s in q:
                target_sec = s
                break

        args = {"section": target_sec}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="navigate_portfolio",
            args=args,
            detail=f"Selected navigation tool for section '{target_sec}'."
        ))
        step_num += 1

        result = AGENT_TOOL_REGISTRY["navigate_portfolio"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="navigate_portfolio",
            result=result,
            detail=f"Validated navigation target '{target_sec}'."
        ))
        step_num += 1

        action = {"action": "navigate", "section": target_sec}
        reply = f"Navigating directly to the **{target_sec.upper()}** section of Niranjan's portfolio."

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Dispatched navigation action to client."
        ))
        return reply, action, trace

    # Check 2: Contact Assistant
    if any(k in q for k in ["contact", "reach", "email", "linkedin", "github", "instagram", "hire", "collaborate", "mail to"]):
        ch = "all"
        if "email" in q or "mail" in q: ch = "email"
        elif "github" in q or "repo" in q: ch = "github"
        elif "linkedin" in q: ch = "linkedin"
        elif "instagram" in q: ch = "instagram"

        args = {"channel": ch}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="get_contact_channel",
            args=args,
            detail=f"Selected contact tool for channel '{ch}'."
        ))
        step_num += 1

        result = AGENT_TOOL_REGISTRY["get_contact_channel"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="get_contact_channel",
            result=result,
            detail="Retrieved verified communication endpoint."
        ))
        step_num += 1

        reply = result["message"] + "\n\n*(Note: For security, no automated emails or forms are dispatched without your direct action).* "
        action = {"action": "navigate", "section": "contact"}

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Prepared verified contact channels and direct navigation action."
        ))
        return reply, action, trace

    # Check 3: Project Comparison
    if any(k in q for k in ["compare", "difference between", "versus", " vs "]):
        tool_name = "compare_projects"
        p_a = "gym-trainer"
        p_b = "lexai-india"
        if "resume" in q or "ats" in q:
            p_b = "ai-resume-ats"
            if "lexai" in q or "legal" in q:
                p_a = "lexai-india"

        args = {"project_a_id": p_a, "project_b_id": p_b}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool=tool_name,
            args=args,
            detail=f"Selected tool to compare {p_a} and {p_b}."
        ))
        step_num += 1

        # Execute
        result = AGENT_TOOL_REGISTRY[tool_name](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed" if result.get("status") == "success" else "failed",
            title="Tool Execution",
            tool=tool_name,
            result=result,
            detail="Executed project comparison against verified specifications."
        ))
        step_num += 1

        # Synthesize
        pa_title = result["comparison"]["project_a"]["title"]
        pb_title = result["comparison"]["project_b"]["title"]
        pa_tech = ", ".join(result["comparison"]["project_a"]["technologies"])
        pb_tech = ", ".join(result["comparison"]["project_b"]["technologies"])

        reply = (
            f"Here is the verified architectural comparison between {pa_title} and {pb_title}:\n\n"
            f"• **{pa_title}** ({result['comparison']['project_a']['systemCode']}): "
            f"{result['comparison']['project_a']['summary']}\n"
            f"  *Core Technologies:* {pa_tech}\n"
            f"  *Status:* {result['comparison']['project_a']['status']}\n\n"
            f"• **{pb_title}** ({result['comparison']['project_b']['systemCode']}): "
            f"{result['comparison']['project_b']['summary']}\n"
            f"  *Core Technologies:* {pb_tech}\n"
            f"  *Status:* {result['comparison']['project_b']['status']}\n\n"
            f"Both initiatives reflect active in-progress research in Niranjan's lab."
        )

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Evaluated technical domains and formatted structured comparison."
        ))
        return reply, action, trace

    # Check 2: Project Explorer / Open Project World
    if any(k in q for k in ["project", "gym", "trainer", "lexai", "legal", "resume", "ats", "world", "case study"]):
        pid = "gym-trainer"
        if any(k in q for k in ["lexai", "legal", "rag", "jurisprudence"]):
            pid = "lexai-india"
        elif any(k in q for k in ["resume", "ats", "parser", "scoring"]):
            pid = "ai-resume-ats"

        should_open = any(k in q for k in ["open", "show me", "explore world", "enter", "deep dive", "inspect"])
        args = {"project_id": pid, "open_world": should_open}

        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="explore_project",
            args=args,
            detail=f"Selected tool to inspect project '{pid}' (open_world={should_open})."
        ))
        step_num += 1

        # Execute
        result = AGENT_TOOL_REGISTRY["explore_project"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="explore_project",
            result=result,
            detail=f"Retrieved verified project dossier for {result['project']['title']}."
        ))
        step_num += 1

        p = result["project"]
        if should_open:
            action = {"action": "open_project_world", "target": pid}

        reply = (
            f"**{p['title']}** ({p['systemCode']} • Status: {p['status']})\n\n"
            f"{p['description']}\n\n"
            f"• **Verified Technologies:** {', '.join(p['techStack'])}\n"
            f"• **Computational Pipeline:** {', '.join(p['pipeline'][:2])}...\n"
            f"• **Repository:** {p['github']}"
        )
        if should_open:
            reply += f"\n\n*Action executed: Opening the immersive Project World for {p['title']} now.*"

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Verified project facts and generated client navigation/modal dispatch."
        ))
        return reply, action, trace

    # Check 5: Skills Explorer
    if any(k in q for k in ["skill", "technolog", "python", "fastapi", "react", "pytorch", "rag", "database", "docker", "machine learning", " deep learning", " ai ", "generative ai", "chromadb", "langchain"]):
        lookup_query = "ai-ml"
        if "python" in q: lookup_query = "python"
        elif "fastapi" in q: lookup_query = "fastapi"
        elif "react" in q: lookup_query = "react"
        elif "database" in q or "sql" in q: lookup_query = "databases"
        elif "tool" in q or "docker" in q or "git" in q: lookup_query = "tools"
        elif "data" in q or "pandas" in q or "numpy" in q: lookup_query = "data-science"

        args = {"query_or_category": lookup_query}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="explore_skills",
            args=args,
            detail=f"Selected tool to query skills database for '{lookup_query}'."
        ))
        step_num += 1

        result = AGENT_TOOL_REGISTRY["explore_skills"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="explore_skills",
            result=result,
            detail="Queried verified skills database."
        ))
        step_num += 1

        if "matches" in result:
            items = [f"• **{m['name']}** ({m['status']}): {m['context']}" for m in result["matches"][:4]]
            reply = f"Here are the matching verified technologies for **{lookup_query}**:\n\n" + "\n".join(items)
        elif "skills" in result:
            items = [f"• **{s['name']}** ({s['status']})" for s in result["skills"]]
            reply = f"Verified technologies in **{result['category']}**:\n\n" + "\n".join(items)
        else:
            reply = result["message"]

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Synthesized verified competency listings without invented ratings."
        ))
        return reply, action, trace

    # Check 4: Contact Assistant
    if any(k in q for k in ["contact", "reach", "email", "mail", "linkedin", "github", "instagram", "hire", "collaborate"]):
        ch = "all"
        if "email" in q or "mail" in q: ch = "email"
        elif "github" in q or "repo" in q: ch = "github"
        elif "linkedin" in q: ch = "linkedin"
        elif "instagram" in q: ch = "instagram"

        args = {"channel": ch}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="get_contact_channel",
            args=args,
            detail=f"Selected contact tool for channel '{ch}'."
        ))
        step_num += 1

        result = AGENT_TOOL_REGISTRY["get_contact_channel"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="get_contact_channel",
            result=result,
            detail="Retrieved verified communication endpoint."
        ))
        step_num += 1

        reply = result["message"] + "\n\n*(Note: For security, no automated emails or forms are dispatched without your direct action).* "
        action = {"action": "navigate", "section": "contact"}

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Prepared verified contact channels and direct navigation action."
        ))
        return reply, action, trace

    # Check 5: Portfolio Navigation
    if any(k in q for k in ["navigate", "go to", "take me", "show section", "scroll to"]):
        target_sec = "hero"
        for s in ["about", "skills", "projects", "education", "achievements", "contact", "hero"]:
            if s in q:
                target_sec = s
                break

        args = {"section": target_sec}
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title="Tool Selection",
            tool="navigate_portfolio",
            args=args,
            detail=f"Selected navigation tool for section '{target_sec}'."
        ))
        step_num += 1

        result = AGENT_TOOL_REGISTRY["navigate_portfolio"](**args)
        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status="completed",
            title="Tool Execution",
            tool="navigate_portfolio",
            result=result,
            detail=f"Validated navigation target '{target_sec}'."
        ))
        step_num += 1

        action = {"action": "navigate", "section": target_sec}
        reply = f"Navigating directly to the **{target_sec.upper()}** section of Niranjan's portfolio."

        trace.append(AgentTraceStep(
            step=step_num,
            stage="evaluation",
            status="completed",
            title="Result Synthesis",
            detail="Dispatched navigation action to client."
        ))
        return reply, action, trace

    # General Conversational Response
    trace.append(AgentTraceStep(
        step=step_num,
        stage="evaluation",
        status="completed",
        title="Direct Conversational Reasoning",
        detail="Handled general conversational inquiry using verified knowledge base."
    ))

    if any(w in q for w in ["hello", "hi", "hey"]):
        reply = (
            "Hello! I am Niranjan's Agentic AI assistant. I have direct access to verified portfolio tools to:\n\n"
            "• **Navigate sections** (e.g., 'Take me to projects')\n"
            "• **Explore & open Project Worlds** (e.g., 'Open the LexAI-India project world')\n"
            "• **Compare projects** (e.g., 'Compare Gym Trainer and LexAI')\n"
            "• **Explore verified skills** (e.g., 'What are Niranjan's AI and Python skills?')\n"
            "• **Retrieve contact links** (e.g., 'How can I contact Niranjan?')\n\n"
            "How can I assist you today?"
        )
    elif any(w in q for w in ["education", "college", "degree", "bca", "bit mesra"]):
        reply = (
            "Niranjan Kumar is pursuing his Bachelor of Computer Applications (BCA) at Birla Institute of "
            "Technology, Mesra (2024–2027, In Progress). He scored 94% in Class X (2022) and 84.4% in Class XII (2024)."
        )
        action = {"action": "navigate", "section": "education"}
    else:
        reply = (
            "I am Niranjan Kumar's portfolio agent. I can guide you through his verified background, "
            "his 3 in-progress projects (Gym Trainer, LexAI-India, AI Resume ATS), technical skills in Python and AI, "
            "or direct you to his verified contact channels. What would you like to explore?"
        )

    return reply, action, trace


# ── Gemini Agentic Tool Loop (if configured) ──────────────────────────────
async def run_gemini_agent_loop(messages: List[Message], gemini_key: str) -> tuple[str, Optional[dict], List[AgentTraceStep]]:
    """
    Executes a multi-turn tool calling loop using Gemini's function calling API.
    Max 3 iterations to prevent loops.
    """
    import google.generativeai as genai
    genai.configure(api_key=gemini_key)

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT,
        tools=GEMINI_TOOL_DECLARATIONS
    )

    trace: List[AgentTraceStep] = []
    step_num = 1
    action = None

    history = []
    for m in messages[:-1]:
        history.append({"role": m.role if m.role != "assistant" else "model", "parts": [m.content]})

    chat = model.start_chat(history=history)
    user_msg = messages[-1].content

    trace.append(AgentTraceStep(
        step=step_num,
        stage="intent",
        status="completed",
        title="Intent Understanding (Gemini 1.5 Flash)",
        detail=f"Processing visitor request: '{user_msg[:80]}...'"
    ))
    step_num += 1

    # Send initial message to Gemini with timeout
    response = await asyncio.wait_for(
        asyncio.to_thread(chat.send_message, user_msg),
        timeout=10.0
    )

    # Maximum 3 tool execution turns
    for _ in range(3):
        tool_call = None
        for part in response.candidates[0].content.parts:
            if hasattr(part, "function_call") and part.function_call:
                tool_call = part.function_call
                break

        if not tool_call:
            break

        tool_name = tool_call.name
        tool_args = dict(tool_call.args)

        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_selection",
            status="completed",
            title=f"Tool Selected: {tool_name}",
            tool=tool_name,
            args=tool_args,
            detail=f"Agent identified tool '{tool_name}' with args {tool_args}."
        ))
        step_num += 1

        # Execute verified tool
        if tool_name in AGENT_TOOL_REGISTRY:
            try:
                tool_result = AGENT_TOOL_REGISTRY[tool_name](**tool_args)
                status = "completed" if tool_result.get("status") != "error" else "failed"

                if "action" in tool_result:
                    action = {"action": tool_result["action"], "target": tool_result.get("target") or tool_result.get("section")}
            except Exception as tool_err:
                tool_result = {"status": "error", "message": str(tool_err)}
                status = "failed"
        else:
            tool_result = {"status": "error", "message": f"Tool '{tool_name}' is not in the authorized portfolio registry."}
            status = "failed"

        trace.append(AgentTraceStep(
            step=step_num,
            stage="tool_execution",
            status=status,
            title=f"Tool Execution: {tool_name}",
            tool=tool_name,
            result=tool_result,
            detail=f"Tool '{tool_name}' execution completed with status '{status}'."
        ))
        step_num += 1

        # Send tool response back to Gemini to complete reasoning
        response = await asyncio.wait_for(
            asyncio.to_thread(chat.send_message, {
                "parts": [{
                    "function_response": {
                        "name": tool_name,
                        "response": tool_result
                    }
                }]
            }),
            timeout=10.0
        )

    final_reply = response.text if hasattr(response, "text") and response.text else "Operation completed."
    trace.append(AgentTraceStep(
        step=step_num,
        stage="evaluation",
        status="completed",
        title="Result Synthesis",
        detail="Evaluated tool outputs against verified knowledge base and generated response."
    ))

    return final_reply, action, trace


# ── Routes ────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "version": "7.0.0",
        "architecture": "Limited-Scope Agentic AI Assistant",
        "agent_tools_count": len(AGENT_TOOL_REGISTRY),
        "tts_voice": TTS_VOICE,
        "llm_available": bool(os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")),
    }


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(status_code=422, detail="No messages provided.")

    safe_messages = [m for m in req.messages if m.role in ("user", "assistant")]
    if not safe_messages:
        raise HTTPException(status_code=422, detail="No user messages provided.")

    user_query = safe_messages[-1].content
    gemini_key = os.getenv("GEMINI_API_KEY", "")

    # Try Gemini Tool Calling loop first if key exists
    if gemini_key:
        try:
            reply_text, action, trace = await asyncio.wait_for(
                run_gemini_agent_loop(safe_messages, gemini_key),
                timeout=15.0
            )
            return ChatResponse(reply=reply_text, action=action, agent_trace=trace)
        except Exception as e:
            logger.warning(f"Gemini agent loop failed ({type(e).__name__}: {e}). Operating in deterministic agent engine mode.")
            reply_text, action, trace = run_autonomous_agent(user_query)
            if trace and len(trace) > 0:
                trace[0].detail = f"Autonomous engine active (fallback reason: {type(e).__name__}). Query: '{user_query[:70]}...'"
            return ChatResponse(reply=reply_text, action=action, agent_trace=trace)

    # Autonomous Deterministic Agentic Engine
    reply_text, action, trace = run_autonomous_agent(user_query)
    return ChatResponse(reply=reply_text, action=action, agent_trace=trace)


@app.post("/api/tts")
async def text_to_speech(req: TTSRequest):
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
