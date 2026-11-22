/**
 * Project Worlds Centralized Data — NIRANJAN.AI
 * 
 * Strict Guidelines:
 * - Only verified information is included.
 * - All three projects are strictly marked IN PROGRESS.
 * - No invented achievements, benchmarks, metrics, or deployment URLs.
 * - Editable placeholders provided for future calibration data.
 */

export const projectWorlds = [
  {
    id: "gym-trainer",
    number: "01",
    systemCode: "SYS-CV-01",
    title: "AI-Powered Gym Trainer",
    subtitle: "Real-time Biomechanics & Pose Estimation Pipeline",
    status: "IN PROGRESS",
    accentColor: "#00E5FF",
    themeBadge: "COMPUTER VISION & KINETICS",
    polyhedronType: "icosahedron",
    heroStatement: "An intelligent computer vision framework engineered for real-time exercise telemetry, posture angle analysis, and kinetic feedback.",
    
    // Verified Case Study Architecture
    caseStudy: {
      problem: "Traditional fitness self-training frequently leads to incorrect posture, suboptimal repetition mechanics, and increased risk of joint strain due to lack of immediate, objective biomechanical feedback.",
      objective: "To design a lightweight, real-time computer vision pipeline capable of detecting kinetic keypoints, computing joint angle trajectories, and delivering instant form correction without requiring proprietary wearable sensors.",
      approach: "Utilizing deep learning-based pose estimation to extract coordinate landmarks from standard video streams, translating 2D coordinate vectors into kinematic joint angles, and applying geometric threshold validation to evaluate repetition cadence.",
      pipeline: [
        {
          stage: "01 // VIDEO INGESTION",
          title: "Frame Capture Stream",
          description: "Continuously ingests standard camera frames with normalization and pre-processing for inference efficiency."
        },
        {
          stage: "02 // POSE ESTIMATION",
          title: "Deep Learning Joint Landmark Extraction",
          description: "Infers 33 anatomical landmarks across shoulders, elbows, hips, and knees using deep learning models."
        },
        {
          stage: "03 // KINEMATIC ANALYSIS",
          title: "Vector Angle Computation",
          description: "Calculates real-time trigonometric angles between adjacent joint vectors to track concentric and eccentric phases."
        },
        {
          stage: "04 // TELEMETRY FEEDBACK",
          title: "Posture Alignment & Repetition Logging",
          description: "Detects rep completion thresholds, form deviation warnings, and outputs real-time kinetic telemetry."
        }
      ],
      technologies: [
        { name: "Computer Vision", category: "Core Discipline", verified: true },
        { name: "Pose Estimation", category: "Inference Model", verified: true },
        { name: "Python", category: "Core Implementation", verified: true },
        { name: "Deep Learning", category: "Architecture", verified: true }
      ],
      developmentProgress: [
        { phase: "Phase 1: Geometric Math & Joint Angle Formulas", status: "VERIFIED IN PROGRESS", completed: true },
        { phase: "Phase 2: Landmark Detection Pipeline Integration", status: "ACTIVE DEVELOPMENT", completed: true },
        { phase: "Phase 3: Repetition State Machine & Cadence Scoring", status: "UNDER REFINEMENT", completed: false },
        { phase: "Phase 4: Real-time Audio/Visual Telemetry UI", status: "SCHEDULED FOR PROTO-BUILD", completed: false }
      ],
      placeholders: {
        benchmarkMetrics: "[MODEL INFERENCE FPS & JOINT ANGLE ACCURACY: PENDING FORMAL BENCHMARK TESTING UPON MODEL STABILIZATION]",
        deploymentUrl: "[PUBLIC DEPLOYMENT URL: IN ACTIVE DEVELOPMENT — TARGETED UPON PROTO-BUILD COMPLETION]",
        sampleData: "[SAMPLE EXERCISE POSE DATASET: TO BE PUBLISHED IN PUBLIC REPOSITORY RELEASES]"
      }
    },
    links: {
      github: "https://github.com/niranjankumar84"
    }
  },
  {
    id: "lexai-india",
    number: "02",
    systemCode: "SYS-RAG-02",
    title: "LexAI-India",
    subtitle: "Statutory Jurisprudence & RAG Intelligence System",
    status: "IN PROGRESS",
    accentColor: "#38BDF8",
    themeBadge: "LEGAL AI & DENSE RETRIEVAL",
    polyhedronType: "octahedron",
    heroStatement: "A specialized legal AI reasoning assistant tailored to statutory Indian jurisprudence, dense vector legal search, and document intelligence.",
    
    // Verified Case Study Architecture
    caseStudy: {
      problem: "Navigating extensive Indian statutory documentation, legal sections, and judicial precedents is cognitively demanding and prone to omission when relying exclusively on basic keyword searches.",
      objective: "To architect a high-precision Retrieval-Augmented Generation (RAG) system grounded in Indian statutes and legal texts, ensuring answers cite authoritative statutory provisions and minimize hallucinations.",
      approach: "Employing dense semantic vector embeddings to index statutory corpuses into vector databases, executing cosine-similarity hybrid search via a high-performance FastAPI service, and feeding retrieved statutory contexts into LLM reasoning prompts.",
      pipeline: [
        {
          stage: "01 // DOCUMENT INGESTION",
          title: "Statute Parsing & Chunking",
          description: "Segments statutory acts, sections, and legal provisions into semantically coherent textual chunks with hierarchical metadata."
        },
        {
          stage: "02 // DENSE EMBEDDING",
          title: "Vector Representation Generation",
          description: "Generates high-dimensional embedding vectors for each statutory segment to capture semantic jurisprudence context."
        },
        {
          stage: "03 // FASTAPI RETRIEVAL",
          title: "Vector Similarity Query Engine",
          description: "Queries ChromaDB/vector index via async FastAPI endpoints to retrieve the top-k most relevant legal provisions."
        },
        {
          stage: "04 // CONTEXT SYNTHESIS",
          title: "Grounded Reasoning & Cross-Referencing",
          description: "Synthesizes clear legal explanations strictly bounded by the retrieved statutory provisions with explicit citations."
        }
      ],
      technologies: [
        { name: "RAG Architecture", category: "Core Pattern", verified: true },
        { name: "Dense Embeddings", category: "Vector Modeling", verified: true },
        { name: "FastAPI", category: "Backend Service", verified: true },
        { name: "Vector Search", category: "Information Retrieval", verified: true }
      ],
      developmentProgress: [
        { phase: "Phase 1: Legal Text Chunking & Indexing Schema", status: "VERIFIED IN PROGRESS", completed: true },
        { phase: "Phase 2: FastAPI Vector Search API Pipeline", status: "ACTIVE DEVELOPMENT", completed: true },
        { phase: "Phase 3: Statutory Citation Grounding Engine", status: "UNDER REFINEMENT", completed: false },
        { phase: "Phase 4: Multi-statute Cross-Referencing Benchmark", status: "SCHEDULED FOR PROTO-BUILD", completed: false }
      ],
      placeholders: {
        benchmarkMetrics: "[RETRIEVAL FAITHFULNESS & CITATION PRECISION: CURRENTLY UNDERGOING EVALUATION AGAINST INDIAN STATUTORY QUERIES]",
        deploymentUrl: "[PUBLIC API ENDPOINT: IN ACTIVE DEVELOPMENT — TARGETED UPON PROTO-BUILD COMPLETION]",
        sampleData: "[STATUTORY CORPUS BENCHMARK SUITE: TO BE DOCUMENTED IN GITHUB REPOSITORY]"
      }
    },
    links: {
      github: "https://github.com/niranjankumar84"
    }
  },
  {
    id: "ai-resume-ats",
    number: "03",
    systemCode: "SYS-ATS-03",
    title: "AI Resume ATS System",
    subtitle: "Semantic Resume Parsing & Application Tracking Engine",
    status: "IN PROGRESS",
    accentColor: "#3B82F6",
    themeBadge: "SEMANTIC NLP & ATS EVALUATION",
    polyhedronType: "dodecahedron",
    heroStatement: "An intelligent resume parsing, automated semantic scoring, and Application Tracking System (ATS) matching platform designed for explainable evaluation.",
    
    // Verified Case Study Architecture
    caseStudy: {
      problem: "Traditional keyword-based ATS parsers reject qualified candidates due to trivial phrasing mismatches, while lacking the semantic ability to comprehend equivalent technical skills and experience levels.",
      objective: "To create an intelligent evaluation platform that semantically compares candidate resumes against job descriptions, identifying genuine skill alignments and generating explainable matching diagnostics.",
      approach: "Using Natural Language Processing (NLP) tokenization and Large Language Models (LLMs) to extract structured entity profiles from resumes and job descriptions, computing multi-dimensional contextual match vectors, and generating transparent breakdown reports.",
      pipeline: [
        {
          stage: "01 // RESUME INGESTION",
          title: "Multi-Format Document Parsing",
          description: "Extracts and normalizes raw text from PDF and DOCX documents while preserving section boundaries (Education, Skills, Projects)."
        },
        {
          stage: "02 // SEMANTIC EXTRACTION",
          title: "Entity Recognition & Skill Mapping",
          description: "Applies NLP techniques to extract technical proficiencies, roles, and qualifications into structured semantic schema."
        },
        {
          stage: "03 // LLM COMPARATIVE SCORING",
          title: "Contextual Job Description Alignment",
          description: "Compares candidate qualifications against role requirements using semantic evaluation models."
        },
        {
          stage: "04 // DIAGNOSTIC TELEMETRY",
          title: "Explainable Gap Analysis",
          description: "Generates category-by-category match scores, highlighted skill alignments, and identified competency gaps."
        }
      ],
      technologies: [
        { name: "LLMs", category: "Language Modeling", verified: true },
        { name: "NLP", category: "Text Processing", verified: true },
        { name: "Python", category: "Core Pipeline", verified: true },
        { name: "Semantic Search", category: "Contextual Matching", verified: true }
      ],
      developmentProgress: [
        { phase: "Phase 1: Resume Structural Section Parsing", status: "VERIFIED IN PROGRESS", completed: true },
        { phase: "Phase 2: Semantic Skill Extraction & Taxonomy", status: "ACTIVE DEVELOPMENT", completed: true },
        { phase: "Phase 3: Explainable Matching Logic & Scoring Formula", status: "UNDER REFINEMENT", completed: false },
        { phase: "Phase 4: Interactive ATS Report Dashboard", status: "SCHEDULED FOR PROTO-BUILD", completed: false }
      ],
      placeholders: {
        benchmarkMetrics: "[PARSING ACCURACY & SCORING CORRELATION: CURRENTLY UNDERGOING CALIBRATION ACROSS TECHNICAL JOB PROFILES]",
        deploymentUrl: "[PUBLIC WEB APPLICATION: IN ACTIVE DEVELOPMENT — TARGETED UPON PROTO-BUILD COMPLETION]",
        sampleData: "[ANONYMIZED TEST RESUMES & EVALUATION DATASET: TO BE INCLUDED IN REPOSITORY DOCUMENTATION]"
      }
    },
    links: {
      github: "https://github.com/niranjankumar84"
    }
  }
];
