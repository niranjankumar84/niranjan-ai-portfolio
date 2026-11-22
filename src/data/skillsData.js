/**
 * Technical Skills Inventory — Niranjan Kumar
 * All 15 domains preserved, editable status tags, no fake percentages.
 */

export const SKILL_STATUS = {
  HANDS_ON: {
    id: "hands-on",
    label: "Hands-on Experience",
    symbol: "●",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
  },
  FAMILIAR: {
    id: "familiar",
    label: "Familiar with",
    symbol: "▲",
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10"
  },
  LEARNING: {
    id: "learning",
    label: "Currently Learning",
    symbol: "◆",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10"
  }
};

export const skillCategories = [
  {
    id: "programming",
    title: "Programming Languages",
    badge: "CORE",
    skills: [
      { name: "Python", status: SKILL_STATUS.HANDS_ON, icon: "terminal" }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Development",
    badge: "INTERFACE",
    skills: [
      { name: "HTML", status: SKILL_STATUS.HANDS_ON, icon: "code" },
      { name: "CSS", status: SKILL_STATUS.HANDS_ON, icon: "palette" },
      { name: "React", status: SKILL_STATUS.HANDS_ON, icon: "atom" },
      { name: "Streamlit", status: SKILL_STATUS.HANDS_ON, icon: "layout" }
    ]
  },
  {
    id: "backend",
    title: "Backend Engineering",
    badge: "SERVICES",
    skills: [
      { name: "FastAPI", status: SKILL_STATUS.HANDS_ON, icon: "zap" },
      { name: "Django", status: SKILL_STATUS.FAMILIAR, icon: "server" }
    ]
  },
  {
    id: "databases",
    title: "Databases & Storage",
    badge: "DATA",
    skills: [
      { name: "MongoDB", status: SKILL_STATUS.FAMILIAR, icon: "database" },
      { name: "SQL", status: SKILL_STATUS.HANDS_ON, icon: "database" }
    ]
  },
  {
    id: "data-analysis",
    title: "Data Analysis & Visualization",
    badge: "ANALYTICS",
    skills: [
      { name: "NumPy", status: SKILL_STATUS.HANDS_ON, icon: "binary" },
      { name: "Pandas", status: SKILL_STATUS.HANDS_ON, icon: "table" },
      { name: "Matplotlib", status: SKILL_STATUS.HANDS_ON, icon: "bar-chart-2" },
      { name: "Seaborn", status: SKILL_STATUS.HANDS_ON, icon: "activity" }
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    badge: "ALGORITHMS",
    skills: [
      { name: "Scikit-learn", status: SKILL_STATUS.HANDS_ON, icon: "cpu" },
      { name: "ML Algorithms", status: SKILL_STATUS.HANDS_ON, icon: "git-branch" }
    ]
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    badge: "NEURAL",
    skills: [
      { name: "PyTorch", status: SKILL_STATUS.FAMILIAR, icon: "flame" }
    ]
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    badge: "INTELLIGENCE",
    skills: [
      { name: "LLMs", status: SKILL_STATUS.HANDS_ON, icon: "sparkles" },
      { name: "RAG", status: SKILL_STATUS.HANDS_ON, icon: "search" },
      { name: "Embeddings", status: SKILL_STATUS.HANDS_ON, icon: "layers" },
      { name: "Gemini API", status: SKILL_STATUS.HANDS_ON, icon: "cpu" },
      { name: "LangChain", status: SKILL_STATUS.HANDS_ON, icon: "link" },
      { name: "LlamaIndex", status: SKILL_STATUS.FAMILIAR, icon: "compass" },
      { name: "Hugging Face", status: SKILL_STATUS.HANDS_ON, icon: "smile" },
      { name: "ChromaDB", status: SKILL_STATUS.HANDS_ON, icon: "box" },
      { name: "FAISS", status: SKILL_STATUS.FAMILIAR, icon: "grid" },
      { name: "Ollama", status: SKILL_STATUS.HANDS_ON, icon: "terminal" }
    ]
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    badge: "AUTONOMY",
    skills: [
      { name: "Foundational Knowledge", status: SKILL_STATUS.LEARNING, icon: "bot" }
    ]
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    badge: "ARCHITECTURE",
    skills: [
      { name: "System Design", status: SKILL_STATUS.FAMILIAR, icon: "layout-grid" },
      { name: "REST API Design", status: SKILL_STATUS.HANDS_ON, icon: "network" },
      { name: "Backend Architecture", status: SKILL_STATUS.FAMILIAR, icon: "cpu" }
    ]
  },
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    badge: "LOGIC",
    skills: [
      { name: "Python", status: SKILL_STATUS.HANDS_ON, icon: "code-2" }
    ]
  },
  {
    id: "devops-cicd",
    title: "DevOps & CI/CD",
    badge: "OPERATIONS",
    skills: [
      { name: "CI/CD Pipelines", status: SKILL_STATUS.FAMILIAR, icon: "git-commit" },
      { name: "Continuous Integration", status: SKILL_STATUS.FAMILIAR, icon: "git-pull-request" },
      { name: "Continuous Deployment", status: SKILL_STATUS.FAMILIAR, icon: "rocket" },
      { name: "GitHub Actions", status: SKILL_STATUS.FAMILIAR, icon: "play-circle" }
    ]
  },
  {
    id: "containers",
    title: "Containerization & Orchestration",
    badge: "INFRASTRUCTURE",
    skills: [
      { name: "Docker", status: SKILL_STATUS.FAMILIAR, icon: "package" },
      { name: "Kubernetes", status: SKILL_STATUS.LEARNING, icon: "server" }
    ]
  },
  {
    id: "cloud-deployment",
    title: "Cloud & Deployment",
    badge: "PLATFORMS",
    skills: [
      { name: "AWS", status: SKILL_STATUS.FAMILIAR, icon: "cloud" },
      { name: "Netlify", status: SKILL_STATUS.HANDS_ON, icon: "globe" },
      { name: "GitHub Pages", status: SKILL_STATUS.HANDS_ON, icon: "github" },
      { name: "Application Deployment", status: SKILL_STATUS.HANDS_ON, icon: "upload-cloud" }
    ]
  },
  {
    id: "dev-tools",
    title: "Developer Tools & Environment",
    badge: "TOOLING",
    skills: [
      { name: "Git", status: SKILL_STATUS.HANDS_ON, icon: "git-branch" },
      { name: "GitHub", status: SKILL_STATUS.HANDS_ON, icon: "github" },
      { name: "VS Code", status: SKILL_STATUS.HANDS_ON, icon: "terminal" },
      { name: "Jupyter", status: SKILL_STATUS.HANDS_ON, icon: "book-open" },
      { name: "Linux", status: SKILL_STATUS.HANDS_ON, icon: "hard-drive" }
    ]
  }
];
