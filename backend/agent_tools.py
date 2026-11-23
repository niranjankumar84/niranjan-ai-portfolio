"""
backend/agent_tools.py
Agentic AI Tool Declarations & Execution Engine for NIRANJAN.AI

Strict rules:
- Only portfolio-scoped, safe tools.
- Grounded strictly in Niranjan Kumar's verified records.
- No external email sending or file modifications without explicit confirmation.
"""

from typing import Dict, Any, List, Optional
import json

VERIFIED_PROJECTS = {
    "gym-trainer": {
        "id": "gym-trainer",
        "number": "01",
        "systemCode": "SYS-CV-01",
        "title": "AI-Powered Gym Trainer",
        "status": "IN PROGRESS",
        "accentColor": "#00E5FF",
        "summary": "Intelligent real-time workout form guidance, repetition tracking, and biomechanics telemetry pipeline.",
        "description": "Computer vision and deep learning pose estimation framework engineered for real-time exercise telemetry, posture angle analysis, and kinetic feedback.",
        "techStack": ["Computer Vision", "Pose Estimation", "Python", "Deep Learning"],
        "pipeline": [
            "01 // Frame Capture Stream Normalization",
            "02 // Deep Learning Joint Landmark Extraction (33 Nodes)",
            "03 // Trigonometric Joint Angle Vector Calculation",
            "04 // Real-time Posture Alignment & Repetition Logging"
        ],
        "github": "https://github.com/niranjankumar84"
    },
    "lexai-india": {
        "id": "lexai-india",
        "number": "02",
        "systemCode": "SYS-RAG-02",
        "title": "LexAI-India",
        "status": "IN PROGRESS",
        "accentColor": "#38BDF8",
        "summary": "Specialized legal AI reasoning assistant tailored to statutory Indian jurisprudence and legal document intelligence.",
        "description": "Dense vector retrieval-augmented generation (RAG) architecture engineered for statutory case research, section cross-referencing, and Indian legal context interpretation.",
        "techStack": ["RAG", "Embeddings", "FastAPI", "Vector Search"],
        "pipeline": [
            "01 // Statutory Document Ingestion & Chunking",
            "02 // High-Dimensional Dense Vector Embedding Generation",
            "03 // Async Vector Cosine Similarity Search via FastAPI",
            "04 // Grounded Statutory Cross-Referencing & Synthesis"
        ],
        "github": "https://github.com/niranjankumar84"
    },
    "ai-resume-ats": {
        "id": "ai-resume-ats",
        "number": "03",
        "systemCode": "SYS-ATS-03",
        "title": "AI Resume ATS System",
        "status": "IN PROGRESS",
        "accentColor": "#3B82F6",
        "summary": "Intelligent resume parsing, automated semantic scoring, and Application Tracking System (ATS) matching platform.",
        "description": "Semantic parser and job description evaluation engine designed to analyze candidate resumes against targeted role requirements with explainable scoring.",
        "techStack": ["LLMs", "NLP", "Python", "Semantic Search"],
        "pipeline": [
            "01 // Resume Structural Section Parsing (PDF/DOCX)",
            "02 // Semantic Skill & Qualification Entity Extraction",
            "03 // LLM Comparative Job Description Alignment",
            "04 // Explainable Category-by-Category Diagnostic Scoring"
        ],
        "github": "https://github.com/niranjankumar84"
    }
}

VERIFIED_SKILLS_DATABASE = {
    "programming": {
        "category": "Programming Languages",
        "skills": [
            {"name": "Python", "status": "Hands-on Experience", "context": "Core language for ML models, FastAPI backends, and data science."},
            {"name": "DSA in Python", "status": "Hands-on Experience", "context": "Data structures and algorithm implementations focusing on clean problem-solving."}
        ]
    },
    "ai-ml": {
        "category": "AI & Machine Learning",
        "skills": [
            {"name": "Scikit-learn", "status": "Hands-on Experience", "context": "Classical machine learning modeling, regression, and classification."},
            {"name": "ML Algorithms", "status": "Hands-on Experience", "context": "Supervised and unsupervised mathematical foundations."},
            {"name": "PyTorch", "status": "Familiar with", "context": "Neural network layer construction and tensor operations."},
            {"name": "LLMs", "status": "Hands-on Experience", "context": "Prompt engineering, structured output parsing, and reasoning chains."},
            {"name": "RAG", "status": "Hands-on Experience", "context": "Dense vector retrieval grounding generative models with domain context."},
            {"name": "Dense Embeddings", "status": "Hands-on Experience", "context": "High-dimensional vector representations for semantic search."},
            {"name": "Gemini API", "status": "Hands-on Experience", "context": "Multimodal LLM API integration and tool-calling architectures."},
            {"name": "LangChain", "status": "Hands-on Experience", "context": "Document loaders, vector stores, and prompt composition."},
            {"name": "Hugging Face", "status": "Hands-on Experience", "context": "Open model ecosystems and tokenization workflows."},
            {"name": "ChromaDB", "status": "Hands-on Experience", "context": "Embedded vector database for local document retrieval."},
            {"name": "Agentic AI", "status": "Currently Learning", "context": "Autonomous tool calling and multi-step reasoning agent patterns."}
        ]
    },
    "data-science": {
        "category": "Data Science & Analytics",
        "skills": [
            {"name": "NumPy", "status": "Hands-on Experience", "context": "Vectorized numerical array operations."},
            {"name": "Pandas", "status": "Hands-on Experience", "context": "DataFrames, feature extraction, and tabular manipulation."},
            {"name": "Matplotlib", "status": "Hands-on Experience", "context": "Statistical plotting and telemetry chart rendering."},
            {"name": "Seaborn", "status": "Hands-on Experience", "context": "Exploratory distribution analysis and heatmaps."}
        ]
    },
    "web-dev": {
        "category": "Web & Engineering",
        "skills": [
            {"name": "React", "status": "Hands-on Experience", "context": "Interactive component-driven frontend architecture."},
            {"name": "FastAPI", "status": "Hands-on Experience", "context": "Asynchronous REST API engineering with Pydantic validation."},
            {"name": "Django", "status": "Familiar with", "context": "Full-stack Python web framework with ORM."},
            {"name": "HTML5 & CSS3", "status": "Hands-on Experience", "context": "Semantic layouts and modern responsive styling."},
            {"name": "Streamlit", "status": "Hands-on Experience", "context": "Rapid ML prototype application dashboards."},
            {"name": "REST API Design", "status": "Hands-on Experience", "context": "HTTP contracts, status codes, and schema validation."},
            {"name": "System Design", "status": "Familiar with", "context": "Architectural decomposition and service boundaries."},
            {"name": "Backend Architecture", "status": "Familiar with", "context": "Python async event loops and server middleware."}
        ]
    },
    "databases": {
        "category": "Databases & Storage",
        "skills": [
            {"name": "SQL", "status": "Hands-on Experience", "context": "Relational schema design, filtering, joins, and normalization."},
            {"name": "MongoDB", "status": "Familiar with", "context": "Document-oriented NoSQL storage and collections."}
        ]
    },
    "tools": {
        "category": "Developer Tools & Platforms",
        "skills": [
            {"name": "Git & GitHub", "status": "Hands-on Experience", "context": "Version control, branching, and repository collaboration."},
            {"name": "Linux & Shell", "status": "Hands-on Experience", "context": "Command-line navigation and shell automation."},
            {"name": "VS Code & Jupyter", "status": "Hands-on Experience", "context": "Development IDE and computational notebooks."},
            {"name": "Docker", "status": "Familiar with", "context": "Containerization and reproducible runtime packaging."},
            {"name": "Kubernetes", "status": "Currently Learning", "context": "Container orchestration fundamentals and pods."},
            {"name": "CI/CD & GitHub Actions", "status": "Familiar with", "context": "Automated build and test workflows."},
            {"name": "Netlify", "status": "Hands-on Experience", "context": "Web application hosting and deployment."}
        ]
    }
}

VERIFIED_CONTACT_INFO = {
    "email": "kumarniranjan84096@gmail.com",
    "github": "https://github.com/niranjankumar84",
    "linkedin": "https://www.linkedin.com/in/niranjan-kumar84",
    "instagram": "https://www.instagram.com/this_is_niranjans/",
    "location": "India (IST, UTC+5:30)",
    "education": "Birla Institute of Technology, Mesra — BCA (2024–2027, In Progress)"
}


# ── TOOL 1: Portfolio Navigation ──────────────────────────────────────────
def navigate_portfolio(section: str) -> Dict[str, Any]:
    """
    Navigate visitors to a specific section of Niranjan's portfolio.
    Allowed sections: 'hero', 'about', 'skills', 'projects', 'education', 'achievements', 'contact'.
    """
    valid_sections = ["hero", "about", "skills", "projects", "education", "achievements", "contact"]
    clean_sec = section.strip().lower()

    # Map common aliases
    alias_map = {
        "home": "hero",
        "intro": "hero",
        "bio": "about",
        "experience": "about",
        "tech": "skills",
        "technologies": "skills",
        "stack": "skills",
        "works": "projects",
        "portfolio": "projects",
        "academic": "education",
        "college": "education",
        "certifications": "achievements",
        "reach": "contact",
        "email": "contact"
    }
    target = alias_map.get(clean_sec, clean_sec)

    if target not in valid_sections:
        return {
            "status": "error",
            "message": f"Section '{section}' is not recognized. Valid sections are: {', '.join(valid_sections)}."
        }

    return {
        "status": "success",
        "action": "navigate",
        "section": target,
        "message": f"Navigating to the {target.upper()} section."
    }


# ── TOOL 2: Project Explorer ──────────────────────────────────────────────
def explore_project(project_id: str, open_world: bool = False) -> Dict[str, Any]:
    """
    Retrieve verified technical information about one of Niranjan's three projects.
    Allows triggering the immersive Project World case study modal.
    Allowed project_id values: 'gym-trainer', 'lexai-india', 'ai-resume-ats'.
    """
    pid = project_id.strip().lower()
    # Handle aliases
    alias_map = {
        "gym": "gym-trainer",
        "trainer": "gym-trainer",
        "fitness": "gym-trainer",
        "pose": "gym-trainer",
        "lexai": "lexai-india",
        "legal": "lexai-india",
        "rag": "lexai-india",
        "resume": "ai-resume-ats",
        "ats": "ai-resume-ats"
    }
    pid = alias_map.get(pid, pid)

    if pid not in VERIFIED_PROJECTS:
        return {
            "status": "error",
            "message": f"Project '{project_id}' not found. Available projects: 'gym-trainer', 'lexai-india', 'ai-resume-ats'."
        }

    pdata = VERIFIED_PROJECTS[pid]
    res = {
        "status": "success",
        "project": pdata,
        "message": f"Retrieved verified project specifications for {pdata['title']} (Status: {pdata['status']})."
    }
    if open_world:
        res["action"] = "open_project_world"
        res["target"] = pid
        res["message"] += f" Opening immersive Project World for {pdata['title']}."

    return res


# ── TOOL 3: Project Comparison ────────────────────────────────────────────
def compare_projects(project_a_id: str, project_b_id: str) -> Dict[str, Any]:
    """
    Compare two projects using strictly verified technical details.
    """
    res_a = explore_project(project_a_id)
    res_b = explore_project(project_b_id)

    if res_a.get("status") == "error":
        return res_a
    if res_b.get("status") == "error":
        return res_b

    pa = res_a["project"]
    pb = res_b["project"]

    comparison = {
        "project_a": {
            "title": pa["title"],
            "systemCode": pa["systemCode"],
            "status": pa["status"],
            "primaryDomain": pa["techStack"][0],
            "technologies": pa["techStack"],
            "summary": pa["summary"]
        },
        "project_b": {
            "title": pb["title"],
            "systemCode": pb["systemCode"],
            "status": pb["status"],
            "primaryDomain": pb["techStack"][0],
            "technologies": pb["techStack"],
            "summary": pb["summary"]
        },
        "comparison_points": [
            f"Both {pa['title']} and {pb['title']} are currently IN PROGRESS.",
            f"{pa['title']} focuses on {pa['techStack'][0]}, whereas {pb['title']} tackles {pb['techStack'][0]}.",
            f"{pa['title']} utilizes {', '.join(pa['techStack'])}; {pb['title']} utilizes {', '.join(pb['techStack'])}."
        ]
    }

    return {
        "status": "success",
        "comparison": comparison,
        "message": f"Successfully compared {pa['title']} and {pb['title']}."
    }


# ── TOOL 4: Skills Explorer ───────────────────────────────────────────────
def explore_skills(query_or_category: str) -> Dict[str, Any]:
    """
    Retrieve and explain technologies from Niranjan's verified skills inventory.
    Accepts category names ('programming', 'ai-ml', 'data-science', 'web-dev', 'databases', 'tools')
    or specific technology names ('python', 'rag', 'fastapi', etc.).
    """
    q = query_or_category.strip().lower()

    # Check category match
    if q in VERIFIED_SKILLS_DATABASE:
        cat_data = VERIFIED_SKILLS_DATABASE[q]
        return {
            "status": "success",
            "category": cat_data["category"],
            "skills": cat_data["skills"],
            "message": f"Found {len(cat_data['skills'])} verified skills in '{cat_data['category']}'."
        }

    # Search for specific technology across all categories
    matches = []
    for cat_key, cat_data in VERIFIED_SKILLS_DATABASE.items():
        for skill in cat_data["skills"]:
            if q in skill["name"].lower() or q in skill["context"].lower():
                matches.append({
                    "category": cat_data["category"],
                    "name": skill["name"],
                    "status": skill["status"],
                    "context": skill["context"]
                })

    if matches:
        return {
            "status": "success",
            "query": query_or_category,
            "matches": matches,
            "message": f"Found {len(matches)} matching verified skills for '{query_or_category}'."
        }

    # If no exact match, return list of available categories
    available_cats = [c["category"] for c in VERIFIED_SKILLS_DATABASE.values()]
    return {
        "status": "not_found",
        "message": f"No specific verified skill found for '{query_or_category}'. Available categories: {', '.join(available_cats)}."
    }


# ── TOOL 5: Contact Assistant ─────────────────────────────────────────────
def get_contact_channel(channel: str = "all") -> Dict[str, Any]:
    """
    Provide verified contact links and handles for Niranjan Kumar.
    channel options: 'email', 'github', 'linkedin', 'instagram', or 'all'.
    Note: Does not send emails or submit forms without direct user action.
    """
    ch = channel.strip().lower()

    if ch in ("email", "mail"):
        return {
            "status": "success",
            "channel": "email",
            "value": VERIFIED_CONTACT_INFO["email"],
            "url": f"mailto:{VERIFIED_CONTACT_INFO['email']}",
            "message": f"Niranjan's primary contact email is {VERIFIED_CONTACT_INFO['email']}."
        }
    if ch in ("github", "repo", "git"):
        return {
            "status": "success",
            "channel": "github",
            "value": "@niranjankumar84",
            "url": VERIFIED_CONTACT_INFO["github"],
            "message": f"Niranjan's GitHub profile is {VERIFIED_CONTACT_INFO['github']}."
        }
    if ch in ("linkedin", "in"):
        return {
            "status": "success",
            "channel": "linkedin",
            "value": "in/niranjan-kumar84",
            "url": VERIFIED_CONTACT_INFO["linkedin"],
            "message": f"Niranjan's LinkedIn profile is {VERIFIED_CONTACT_INFO['linkedin']}."
        }
    if ch in ("instagram", "insta"):
        return {
            "status": "success",
            "channel": "instagram",
            "value": "@this_is_niranjans",
            "url": VERIFIED_CONTACT_INFO["instagram"],
            "message": f"Niranjan's Instagram profile is {VERIFIED_CONTACT_INFO['instagram']}."
        }

    return {
        "status": "success",
        "channel": "all",
        "contacts": VERIFIED_CONTACT_INFO,
        "message": "Niranjan's verified contact channels are: Email (kumarniranjan84096@gmail.com), GitHub (@niranjankumar84), LinkedIn (in/niranjan-kumar84), and Instagram (@this_is_niranjans)."
    }


# Map of callable tool functions
AGENT_TOOL_REGISTRY = {
    "navigate_portfolio": navigate_portfolio,
    "explore_project": explore_project,
    "compare_projects": compare_projects,
    "explore_skills": explore_skills,
    "get_contact_channel": get_contact_channel
}
