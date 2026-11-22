/**
 * Niranjan Kumar — Personal Portfolio Data Configuration
 * Strictly editable without modifying UI layouts.
 */

export const personalData = {
  name: "Niranjan Kumar",
  title: "Software Engineer with AI",
  email: "kumarniranjan84096@gmail.com",
  location: "India",
  bio: {
    tagline: "Bridging Scalable Software Engineering & Artificial Intelligence",
    summary: "Curious, adaptable, and analytical thinker. Focused on solving complex computational problems and building robust, scalable solutions at the intersection of modern software engineering and generative AI."
  },
  education: {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Birla Institute of Technology, Mesra",
    expectedGraduation: "2027",
    status: "In Progress"
  },
  socialLinks: [
    { name: "GitHub", url: "https://github.com", icon: "github" },
    { name: "LinkedIn", url: "https://linkedin.com", icon: "linkedin" },
    { name: "Email", url: "mailto:kumarniranjan84096@gmail.com", icon: "mail" }
  ],
  projects: [
    {
      id: "gym-trainer",
      title: "AI-Powered Gym Trainer",
      status: "In Progress",
      description: "Editable placeholder: Intelligent real-time fitness posture detection, repetition tracking, and adaptive coaching engine powered by computer vision and deep learning.",
      tags: ["Python", "PyTorch", "Computer Vision", "AI"]
    },
    {
      id: "lexai-india",
      title: "LexAI-India",
      status: "In Progress",
      description: "Editable placeholder: Specialized legal AI reasoning assistant tailored to the Indian legal code, utilizing retrieval-augmented generation (RAG) and dense vector embeddings.",
      tags: ["FastAPI", "RAG", "LLMs", "LangChain", "Vector DB"]
    }
  ]
};
