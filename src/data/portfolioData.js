/**
 * Niranjan Kumar — Personal Portfolio Data Configuration
 * Strictly editable without modifying UI layouts.
 * No invented personal information, verified academic records only.
 */

export const personalData = {
  name: "Niranjan Kumar",
  title: "Software Engineer with AI",
  email: "kumarniranjan84096@gmail.com",
  location: "India (IST UTC+5:30)",
  bio: {
    statement: "I am a curious and adaptable Software Engineer with an interest in Artificial Intelligence. I enjoy understanding complex problems, researching efficient approaches, and turning ideas into practical technology solutions.",
    heroStatement: "Exploring intelligent systems, building practical software, and turning complex problems into meaningful technology solutions.",
    corePhilosophy: "Focused on engineering scalable systems, exploring applied generative models, and translating algorithmic theory into dependable software products."
  },

  // Exactly the three verified qualifications required:
  // 1. Bachelor of Computer Applications (BCA), Birla Institute of Technology, Mesra, Expected 2027
  // 2. Class XII, 84.4%, 2024
  // 3. Class X, 94%, 2022
  // Strictly no CGPA, no school names, no assumed BCA starting year, no invented academic information.
  educationMilestones: [
    {
      id: "bca",
      number: "01",
      qualification: "BACHELOR OF COMPUTER APPLICATIONS",
      degree: "BCA",
      institution: "Birla Institute of Technology, Mesra",
      periodLabel: "EXPECTED GRADUATION",
      periodValue: "2027",
      scoreLabel: null,
      scoreValue: null,
      status: "IN PROGRESS",
      tag: "UNDERGRADUATE DEGREE"
    },
    {
      id: "class-12",
      number: "02",
      qualification: "CLASS XII",
      degree: null,
      institution: null,
      periodLabel: "PASSING YEAR",
      periodValue: "2024",
      scoreLabel: "PERCENTAGE",
      scoreValue: "84.4%",
      status: "COMPLETED",
      tag: "SENIOR SECONDARY"
    },
    {
      id: "class-10",
      number: "03",
      qualification: "CLASS X",
      degree: null,
      institution: null,
      periodLabel: "PASSING YEAR",
      periodValue: "2022",
      scoreLabel: "PERCENTAGE",
      scoreValue: "94%",
      status: "COMPLETED",
      tag: "SECONDARY EDUCATION"
    }
  ],

  // Exactly the four verified contact links:
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/niranjankumar84",
      handle: "@niranjankumar84",
      icon: "github"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/niranjan-kumar84",
      handle: "niranjan-kumar84",
      icon: "linkedin"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/this_is_niranjans/",
      handle: "@this_is_niranjans",
      icon: "instagram"
    },
    {
      name: "Email",
      url: "mailto:kumarniranjan84096@gmail.com",
      handle: "kumarniranjan84096@gmail.com",
      icon: "mail"
    }
  ],

  // Exactly the three specified projects in progress:
  // 01. AI-Powered Gym Trainer
  // 02. LexAI-India
  // 03. AI Resume ATS System
  projects: [
    {
      id: "gym-trainer",
      number: "01",
      systemCode: "SYS-CV-01",
      keyboardKey: "1",
      title: "AI-Powered Gym Trainer",
      status: "IN PROGRESS",
      summary: "Intelligent real-time workout form guidance, repetition tracking, and biomechanics telemetry pipeline.",
      description: "Computer vision and deep learning pose estimation framework engineered for real-time exercise telemetry, posture angle analysis, and kinetic feedback.",
      techStack: ["Computer Vision", "Pose Estimation", "Python", "Deep Learning"],
      pipeline: [
        { stage: "01 // INGESTION", label: "Biomechanics Stream", detail: "Real-time camera video stream capture" },
        { stage: "02 // INFERENCE", label: "Deep Learning Pose Estimation", detail: "Kinetic joint angle calculation and posture tracking" },
        { stage: "03 // TELEMETRY", label: "Real-time Feedback", detail: "Repetition counting, form alignment, and error correction" }
      ],
      links: {
        github: "https://github.com/niranjankumar84",
        demo: "#"
      },
      previewPlaceholder: "POSTURE_TELEMETRY_ENGINE",
      polyhedronType: "icosahedron",
      accentColor: "#00E5FF",
      benchmarkNote: "Benchmark telemetry and repetition accuracy calibration are currently ongoing as the model architecture is refined."
    },
    {
      id: "lexai-india",
      number: "02",
      systemCode: "SYS-RAG-02",
      keyboardKey: "2",
      title: "LexAI-India",
      status: "IN PROGRESS",
      summary: "Specialized legal AI reasoning assistant tailored to statutory Indian jurisprudence and legal document intelligence.",
      description: "Dense vector retrieval-augmented generation (RAG) architecture engineered for statutory case research, section cross-referencing, and Indian legal context interpretation.",
      techStack: ["RAG", "Embeddings", "FastAPI", "Vector Search"],
      pipeline: [
        { stage: "01 // INGESTION", label: "Statutory Legal Queries", detail: "Legal question intake and contextual corpus indexing" },
        { stage: "02 // RETRIEVAL", label: "Dense Vector Embeddings", detail: "Similarity search across Indian legal sections and precedents via FastAPI" },
        { stage: "03 // SYNTHESIS", label: "RAG Context Reasoning", detail: "Grounded legal answer synthesis with statutory cross-references" }
      ],
      links: {
        github: "https://github.com/niranjankumar84",
        demo: "#"
      },
      previewPlaceholder: "LEGAL_REASONING_PIPELINE",
      polyhedronType: "octahedron",
      accentColor: "#38BDF8",
      benchmarkNote: "Retrieval precision metrics and citation faithfulness validation are being tested across Indian penal and civil statutes."
    },
    {
      id: "ai-resume-ats",
      number: "03",
      systemCode: "SYS-ATS-03",
      keyboardKey: "3",
      title: "AI Resume ATS System",
      status: "IN PROGRESS",
      summary: "Intelligent resume parsing, automated semantic scoring, and Application Tracking System (ATS) matching platform.",
      description: "Semantic parser and job description evaluation engine designed to analyze candidate resumes against targeted role requirements with explainable scoring.",
      techStack: ["LLMs", "NLP", "Python", "Semantic Search"],
      pipeline: [
        { stage: "01 // PARSING", label: "Document Ingestion", detail: "Resume & job description structural parsing and text extraction" },
        { stage: "02 // EVALUATION", label: "Semantic NLP & LLM Matching", detail: "Contextual skill matching and qualification alignment using Python" },
        { stage: "03 // SCORING", label: "Explainable ATS Telemetry", detail: "Composite ATS score breakdown and keyword gap diagnostics" }
      ],
      links: {
        github: "https://github.com/niranjankumar84",
        demo: "#"
      },
      previewPlaceholder: "ATS_SCORING_ENGINE",
      polyhedronType: "dodecahedron",
      accentColor: "#3B82F6",
      benchmarkNote: "Parsing accuracy and match scoring calibration are undergoing validation against diverse technical job descriptions."
    }
  ],

  // Exactly the single verified achievement/certification:
  // AI/ML Course — Apna College
  // Smart India Hackathon and GDG DevFest removed completely.
  achievements: [
    {
      id: "apna-college-aiml",
      number: "01",
      title: "AI/ML Course",
      subtitle: "Apna College",
      type: "Coursework & Certification",
      status: "Completed Coursework",
      description: "Comprehensive curriculum covering machine learning algorithms, statistical data analysis, mathematical foundations, and practical deep learning implementations.",
      issuer: "Apna College",
      verified: true
    }
  ]
};
