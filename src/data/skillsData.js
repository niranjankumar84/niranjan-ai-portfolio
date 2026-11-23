/**
 * Technical Skills Inventory — Niranjan Kumar
 * Strictly verified categories, authentic competency statuses.
 * No invented proficiency percentages or unverified claims.
 */

export const SKILL_STATUS = {
  HANDS_ON: {
    id: "hands-on",
    label: "Hands-on Experience",
    shortLabel: "Hands-on",
    symbol: "●",
    color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    badgeColor: "#10B981"
  },
  FAMILIAR: {
    id: "familiar",
    label: "Familiar with",
    shortLabel: "Familiar",
    symbol: "▲",
    color: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    badgeColor: "#38BDF8"
  },
  LEARNING: {
    id: "learning",
    label: "Currently Learning",
    shortLabel: "Learning",
    symbol: "◆",
    color: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    badgeColor: "#F59E0B"
  }
};

export const SKILL_PILLARS = [
  { id: "all", label: "All Capabilities", count: 37 },
  { id: "programming", label: "Programming Languages", count: 2 },
  { id: "ai-ml", label: "AI & Machine Learning", count: 11 },
  { id: "data-science", label: "Data Science & Analytics", count: 4 },
  { id: "web-dev", label: "Web & Engineering", count: 8 },
  { id: "databases", label: "Databases", count: 2 },
  { id: "tools-platforms", label: "Developer Tools & Platforms", count: 5 },
  { id: "professional", label: "Professional & Leadership", count: 5 }
];

export const skillCategories = [
  {
    id: "programming",
    pillar: "programming",
    title: "Programming Languages",
    badge: "CORE LANGUAGE",
    accentColor: "#00E5FF",
    description: "Core algorithmic language foundational to Niranjan's software engineering and applied AI initiatives.",
    coords: [-4.2, 2.5, 0.8],
    skills: [
      {
        name: "Python",
        status: SKILL_STATUS.HANDS_ON,
        icon: "terminal",
        context: "Primary language for AI model building, backend APIs with FastAPI, data manipulation, and automation."
      },
      {
        name: "DSA in Python",
        status: SKILL_STATUS.HANDS_ON,
        icon: "code-2",
        context: "Data structures and algorithm implementations focusing on clean problem-solving and efficiency."
      }
    ]
  },
  {
    id: "machine-learning",
    pillar: "ai-ml",
    title: "Machine Learning & Deep Learning",
    badge: "INTELLIGENCE",
    accentColor: "#38BDF8",
    description: "Algorithmic modeling, statistical learning, and neural network foundations.",
    coords: [0.2, 1.5, 0.2],
    skills: [
      {
        name: "Scikit-learn",
        status: SKILL_STATUS.HANDS_ON,
        icon: "cpu",
        context: "Classification, regression, and model evaluation pipelines."
      },
      {
        name: "ML Algorithms",
        status: SKILL_STATUS.HANDS_ON,
        icon: "git-branch",
        context: "Supervised and unsupervised learning foundations, decision boundaries, and loss functions."
      },
      {
        name: "PyTorch",
        status: SKILL_STATUS.FAMILIAR,
        icon: "flame",
        context: "Neural network layer construction, tensors, and deep learning architectures."
      }
    ]
  },
  {
    id: "generative-ai",
    pillar: "ai-ml",
    title: "Generative AI & LLM Systems",
    badge: "APPLIED AI",
    accentColor: "#A855F7",
    description: "Applied generative workflows, vector search, dense retrieval, and model orchestration.",
    coords: [-0.6, -1.8, 2.5],
    skills: [
      {
        name: "LLMs",
        status: SKILL_STATUS.HANDS_ON,
        icon: "sparkles",
        context: "Prompt engineering, structured outputs, and LLM reasoning integration."
      },
      {
        name: "RAG (Retrieval-Augmented)",
        status: SKILL_STATUS.HANDS_ON,
        icon: "search",
        context: "Dense vector retrieval for grounding model generations with external statutory/document context."
      },
      {
        name: "Dense Embeddings",
        status: SKILL_STATUS.HANDS_ON,
        icon: "layers",
        context: "High-dimensional vector representations for semantic search and similarity scoring."
      },
      {
        name: "Gemini API",
        status: SKILL_STATUS.HANDS_ON,
        icon: "cpu",
        context: "Multimodal API integration, structured reasoning pipelines, and API client development."
      },
      {
        name: "LangChain",
        status: SKILL_STATUS.HANDS_ON,
        icon: "link",
        context: "Document loaders, text splitters, vector stores, and prompt chaining."
      },
      {
        name: "Hugging Face",
        status: SKILL_STATUS.HANDS_ON,
        icon: "smile",
        context: "Open models, tokenizers, and inference abstractions."
      },
      {
        name: "ChromaDB",
        status: SKILL_STATUS.HANDS_ON,
        icon: "box",
        context: "Embedded vector database for local document embedding indexing and semantic retrieval."
      },
      {
        name: "Agentic AI",
        status: SKILL_STATUS.LEARNING,
        icon: "bot",
        context: "Autonomous agent architectures, tool calling, and multi-step reasoning systems."
      }
    ]
  },
  {
    id: "data-analysis",
    pillar: "data-science",
    title: "Data Science & Analytics",
    badge: "ANALYTICS",
    accentColor: "#34D399",
    description: "Numerical computation, structured dataset manipulation, and exploratory visualization.",
    coords: [3.8, 1.2, -2.1],
    skills: [
      {
        name: "NumPy",
        status: SKILL_STATUS.HANDS_ON,
        icon: "binary",
        context: "Vectorized array calculations, linear algebra operations, and numeric indexing."
      },
      {
        name: "Pandas",
        status: SKILL_STATUS.HANDS_ON,
        icon: "table",
        context: "DataFrame manipulation, feature aggregation, filtering, and data cleaning."
      },
      {
        name: "Matplotlib",
        status: SKILL_STATUS.HANDS_ON,
        icon: "bar-chart-2",
        context: "Statistical plotting, distributions, multi-axis figure generation, and telemetry visual output."
      },
      {
        name: "Seaborn",
        status: SKILL_STATUS.HANDS_ON,
        icon: "activity",
        context: "Statistical data visualization, heatmaps, and correlation matrix charts."
      }
    ]
  },
  {
    id: "web-development",
    pillar: "web-dev",
    title: "Web Development & Engineering",
    badge: "SYSTEMS",
    accentColor: "#00E5FF",
    description: "Modern responsive web applications, high-performance backends, and modular APIs.",
    coords: [-3.2, 0.8, 3.2],
    skills: [
      {
        name: "React",
        status: SKILL_STATUS.HANDS_ON,
        icon: "atom",
        context: "Component architecture, hooks, state management, and modern interactive UI design."
      },
      {
        name: "FastAPI",
        status: SKILL_STATUS.HANDS_ON,
        icon: "zap",
        context: "Asynchronous Python REST API development with automatic OpenAPI schema generation."
      },
      {
        name: "Django",
        status: SKILL_STATUS.FAMILIAR,
        icon: "server",
        context: "Full-stack Python web framework with MVC architecture and ORM."
      },
      {
        name: "HTML5 & CSS3",
        status: SKILL_STATUS.HANDS_ON,
        icon: "code",
        context: "Semantic layout markup, accessible structure, modern CSS grid, flexbox, and styling."
      },
      {
        name: "Streamlit",
        status: SKILL_STATUS.HANDS_ON,
        icon: "layout",
        context: "Rapid prototype development for machine learning applications and data dashboards."
      },
      {
        name: "REST API Design",
        status: SKILL_STATUS.HANDS_ON,
        icon: "network",
        context: "HTTP verbs, endpoint design, JSON payload validation, and clean interface contracts."
      },
      {
        name: "System Design",
        status: SKILL_STATUS.FAMILIAR,
        icon: "layout-grid",
        context: "Architectural decomposition, modular service design, and client-server boundaries."
      },
      {
        name: "Backend Architecture",
        status: SKILL_STATUS.FAMILIAR,
        icon: "cpu",
        context: "Structuring scalable Python backend servers, async event loops, and middleware."
      }
    ]
  },
  {
    id: "databases",
    pillar: "databases",
    title: "Databases & Storage",
    badge: "PERSISTENCE",
    accentColor: "#818CF8",
    description: "Relational querying, document storage, and persistent data layer integration.",
    coords: [1.8, 2.8, -3.2],
    skills: [
      {
        name: "SQL",
        status: SKILL_STATUS.HANDS_ON,
        icon: "database",
        context: "Relational queries, schema design, filtering, joins, and data normalization."
      },
      {
        name: "MongoDB",
        status: SKILL_STATUS.FAMILIAR,
        icon: "database",
        context: "Document-oriented NoSQL storage, BSON documents, and collection indexing."
      }
    ]
  },
  {
    id: "developer-tools",
    pillar: "tools-platforms",
    title: "Developer Tools & Platforms",
    badge: "DEVOPS & TOOLS",
    accentColor: "#94A3B8",
    description: "Version control, containerization environments, CI/CD pipelines, and cloud hosting.",
    coords: [-1.8, 2.4, -4.0],
    skills: [
      {
        name: "Git & GitHub",
        status: SKILL_STATUS.HANDS_ON,
        icon: "git-branch",
        context: "Distributed version control, branching strategies, commit hygiene, and code collaboration."
      },
      {
        name: "Linux & Shell",
        status: SKILL_STATUS.HANDS_ON,
        icon: "hard-drive",
        context: "Command-line navigation, shell scripting, process monitoring, and file permission management."
      },
      {
        name: "VS Code & Jupyter",
        status: SKILL_STATUS.HANDS_ON,
        icon: "terminal",
        context: "Primary development environments for software development, debugging, and computational notebooks."
      },
      {
        name: "Docker",
        status: SKILL_STATUS.FAMILIAR,
        icon: "package",
        context: "Application containerization, Dockerfiles, and reproducible environment packaging."
      },
      {
        name: "Kubernetes",
        status: SKILL_STATUS.LEARNING,
        icon: "server",
        context: "Foundational container orchestration concepts, pods, and cluster architectures."
      },
      {
        name: "CI/CD & GitHub Actions",
        status: SKILL_STATUS.FAMILIAR,
        icon: "play-circle",
        context: "Automated test runs, build verification, and deployment pipelines."
      },
      {
        name: "Netlify",
        status: SKILL_STATUS.HANDS_ON,
        icon: "globe",
        context: "Continuous web application hosting, build workflows, and static asset delivery."
      }
    ]
  },
  {
    id: "professional",
    pillar: "professional",
    title: "Professional & Leadership",
    badge: "HUMAN & LEADERSHIP",
    accentColor: "#34D399",
    description: "Collaborative engineering leadership, structured technical communication, and systematic problem-solving.",
    coords: [-2.2, -0.6, -1.8],
    skills: [
      {
        name: "Leadership & Teamwork",
        status: SKILL_STATUS.HANDS_ON,
        icon: "users",
        context: "Collaborative project coordination, sprint organization, and guiding peer initiatives."
      },
      {
        name: "Technical Communication",
        status: SKILL_STATUS.HANDS_ON,
        icon: "message-square",
        context: "Translating complex machine learning and software architectures into clear, actionable documentation and diagrams."
      },
      {
        name: "Problem-Solving & Logic",
        status: SKILL_STATUS.HANDS_ON,
        icon: "cpu",
        context: "Deconstructing ambiguous engineering requirements into algorithmic solutions and verifiable tests."
      },
      {
        name: "Public Speaking",
        status: SKILL_STATUS.FAMILIAR,
        icon: "mic",
        context: "Presenting technical project architectures, demonstrations, and academic seminars."
      },
      {
        name: "Adaptive Learning",
        status: SKILL_STATUS.HANDS_ON,
        icon: "compass",
        context: "Rapid assimilation of state-of-the-art AI frameworks, emerging tooling, and modern software paradigms."
      }
    ]
  }
];
