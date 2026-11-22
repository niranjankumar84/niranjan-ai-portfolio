/**
 * Technical Skills Inventory — Niranjan Kumar
 * Strictly verified categories, editable status tags, no invented proficiency percentages.
 * 
 * Removed from Generative AI: LlamaIndex, FAISS, Ollama
 * Removed from Cloud & Deployment: AWS, GitHub Pages
 */

export const SKILL_STATUS = {
  HANDS_ON: {
    id: "hands-on",
    label: "Hands-on Experience",
    shortLabel: "Hands-on",
    symbol: "●",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    glowColor: "#10B981"
  },
  FAMILIAR: {
    id: "familiar",
    label: "Familiar with",
    shortLabel: "Familiar",
    symbol: "▲",
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    glowColor: "#0284C7"
  },
  LEARNING: {
    id: "learning",
    label: "Currently Learning",
    shortLabel: "Learning",
    symbol: "◆",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    glowColor: "#F59E0B"
  }
};

export const skillCategories = [
  {
    id: "programming",
    title: "Programming Languages",
    badge: "CORE",
    color: "#00E5FF",
    // 3D coordinates for spatial constellation positioning
    coords: [-4.2, 2.5, 0.8],
    skills: [
      { name: "Python", status: SKILL_STATUS.HANDS_ON, icon: "terminal" }
    ]
  },
  {
    id: "frontend",
    title: "Frontend Development",
    badge: "INTERFACE",
    color: "#38BDF8",
    coords: [-3.2, 0.8, 3.2],
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
    color: "#00E5FF",
    coords: [-1.2, 3.6, -1.8],
    skills: [
      { name: "FastAPI", status: SKILL_STATUS.HANDS_ON, icon: "zap" },
      { name: "Django", status: SKILL_STATUS.FAMILIAR, icon: "server" }
    ]
  },
  {
    id: "databases",
    title: "Databases & Storage",
    badge: "DATA",
    color: "#818CF8",
    coords: [1.8, 2.8, -3.2],
    skills: [
      { name: "MongoDB", status: SKILL_STATUS.FAMILIAR, icon: "database" },
      { name: "SQL", status: SKILL_STATUS.HANDS_ON, icon: "database" }
    ]
  },
  {
    id: "data-analysis",
    title: "Data Analysis & Visualization",
    badge: "ANALYTICS",
    color: "#34D399",
    coords: [3.8, 1.2, -2.1],
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
    color: "#00E5FF",
    coords: [0.2, 1.5, 0.2], // Near Center
    skills: [
      { name: "Scikit-learn", status: SKILL_STATUS.HANDS_ON, icon: "cpu" },
      { name: "ML Algorithms", status: SKILL_STATUS.HANDS_ON, icon: "git-branch" }
    ]
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    badge: "NEURAL",
    color: "#F43F5E",
    coords: [1.6, -0.8, 1.8],
    skills: [
      { name: "PyTorch", status: SKILL_STATUS.FAMILIAR, icon: "flame" }
    ]
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    badge: "INTELLIGENCE",
    color: "#A855F7",
    coords: [-0.6, -1.8, 2.5],
    skills: [
      { name: "LLMs", status: SKILL_STATUS.HANDS_ON, icon: "sparkles" },
      { name: "RAG", status: SKILL_STATUS.HANDS_ON, icon: "search" },
      { name: "Embeddings", status: SKILL_STATUS.HANDS_ON, icon: "layers" },
      { name: "Gemini API", status: SKILL_STATUS.HANDS_ON, icon: "cpu" },
      { name: "LangChain", status: SKILL_STATUS.HANDS_ON, icon: "link" },
      { name: "Hugging Face", status: SKILL_STATUS.HANDS_ON, icon: "smile" },
      { name: "ChromaDB", status: SKILL_STATUS.HANDS_ON, icon: "box" }
    ]
  },
  {
    id: "agentic-ai",
    title: "Agentic AI",
    badge: "AUTONOMY",
    color: "#EC4899",
    coords: [2.8, -2.4, 0.5],
    skills: [
      { name: "Foundational Knowledge", status: SKILL_STATUS.LEARNING, icon: "bot" }
    ]
  },
  {
    id: "software-engineering",
    title: "Software Engineering",
    badge: "ARCHITECTURE",
    color: "#38BDF8",
    coords: [-2.8, -2.5, -1.2],
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
    color: "#FBBF24",
    coords: [-4.5, -0.6, -2.5],
    skills: [
      { name: "Python", status: SKILL_STATUS.HANDS_ON, icon: "code-2" }
    ]
  },
  {
    id: "devops-cicd",
    title: "DevOps & CI/CD",
    badge: "OPERATIONS",
    color: "#60A5FA",
    coords: [4.2, -1.2, -1.8],
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
    color: "#06B6D4",
    coords: [3.5, 3.2, 1.2],
    skills: [
      { name: "Docker", status: SKILL_STATUS.FAMILIAR, icon: "package" },
      { name: "Kubernetes", status: SKILL_STATUS.LEARNING, icon: "server" }
    ]
  },
  {
    id: "cloud-deployment",
    title: "Cloud & Deployment",
    badge: "PLATFORMS",
    color: "#38BDF8",
    coords: [0.8, 4.0, 2.2],
    skills: [
      { name: "Netlify", status: SKILL_STATUS.HANDS_ON, icon: "globe" },
      { name: "Application Deployment", status: SKILL_STATUS.HANDS_ON, icon: "upload-cloud" }
    ]
  },
  {
    id: "dev-tools",
    title: "Developer Tools & Environment",
    badge: "TOOLING",
    color: "#94A3B8",
    coords: [-1.8, 2.4, -4.0],
    skills: [
      { name: "Git", status: SKILL_STATUS.HANDS_ON, icon: "git-branch" },
      { name: "GitHub", status: SKILL_STATUS.HANDS_ON, icon: "github" },
      { name: "VS Code", status: SKILL_STATUS.HANDS_ON, icon: "terminal" },
      { name: "Jupyter", status: SKILL_STATUS.HANDS_ON, icon: "book-open" },
      { name: "Linux", status: SKILL_STATUS.HANDS_ON, icon: "hard-drive" }
    ]
  }
];
