export type CareerTrack = "Computer Science Engineering" | "AI/ML" | "VLSI";

export const CAREER_TRACKS: CareerTrack[] = [
  "Computer Science Engineering",
  "AI/ML",
  "VLSI",
];

export type CourseCard = {
  title: string;
  provider: "Udemy" | "Coursera" | "edX";
  hours: number;
  rating: number;
  affiliateUrl: string;
};

export type SkillGap = {
  id: string;
  skill: string;
  course: CourseCard;
};

export type Semester = {
  label: string;
  year: number;
  covered: string[];
  missing: SkillGap[];
};

const c = (title: string, provider: CourseCard["provider"], hours = 18, rating = 4.7): CourseCard => ({
  title,
  provider,
  hours,
  rating,
  affiliateUrl: "#",
});

export const ROADMAPS: Record<CareerTrack, Semester[]> = {
  "Computer Science Engineering": [
    { label: "Sem 1", year: 1, covered: ["C Programming", "Math I"], missing: [
      { id: "cse-1-1", skill: "Git & GitHub Workflows", course: c("The Complete Git & GitHub Bootcamp", "Udemy", 14, 4.8) },
      { id: "cse-1-2", skill: "Markdown & Technical Writing", course: c("Technical Writing for Engineers", "Coursera", 8, 4.6) },
    ]},
    { label: "Sem 2", year: 1, covered: ["Data Structures", "Discrete Math"], missing: [
      { id: "cse-2-1", skill: "Modern JavaScript (ES2024)", course: c("JavaScript: The Hard Parts", "Udemy", 22, 4.9) },
    ]},
    { label: "Sem 3", year: 2, covered: ["DBMS", "OOP in Java"], missing: [
      { id: "cse-3-1", skill: "REST & GraphQL APIs", course: c("API Design Masterclass", "Udemy", 16) },
      { id: "cse-3-2", skill: "Postgres & Indexing", course: c("Mastering PostgreSQL", "Udemy", 20) },
    ]},
    { label: "Sem 4", year: 2, covered: ["Operating Systems"], missing: [
      { id: "cse-4-1", skill: "Docker & Containers", course: c("Docker & Kubernetes: The Complete Guide", "Udemy", 28, 4.8) },
      { id: "cse-4-2", skill: "Linux for Developers", course: c("Linux Command Line Bootcamp", "Udemy", 15) },
    ]},
    { label: "Sem 5", year: 3, covered: ["Computer Networks"], missing: [
      { id: "cse-5-1", skill: "React 19 + TypeScript", course: c("Epic React", "Udemy", 40, 4.9) },
      { id: "cse-5-2", skill: "System Design Basics", course: c("Grokking System Design", "Coursera", 30, 4.8) },
    ]},
    { label: "Sem 6", year: 3, covered: ["Software Engineering"], missing: [
      { id: "cse-6-1", skill: "CI/CD with GitHub Actions", course: c("DevOps Bootcamp", "Udemy", 24) },
      { id: "cse-6-2", skill: "Cloud Fundamentals (AWS)", course: c("AWS Certified Cloud Practitioner", "Coursera", 26, 4.7) },
    ]},
    { label: "Sem 7", year: 4, covered: ["AI Basics"], missing: [
      { id: "cse-7-1", skill: "LLM App Development", course: c("Building LLM Apps with LangChain", "Coursera", 18, 4.7) },
      { id: "cse-7-2", skill: "Distributed Systems", course: c("Designing Data-Intensive Apps", "edX", 32, 4.9) },
    ]},
    { label: "Sem 8", year: 4, covered: ["Capstone"], missing: [
      { id: "cse-8-1", skill: "Interview DSA Patterns", course: c("Neetcode Pro Patterns", "Udemy", 50, 4.9) },
      { id: "cse-8-2", skill: "Open Source Contribution", course: c("Open Source Bootcamp", "Coursera", 12) },
    ]},
  ],
  "AI/ML": [
    { label: "Sem 1", year: 1, covered: ["Python Basics"], missing: [
      { id: "ai-1-1", skill: "NumPy & Vectorization", course: c("Python for Data Science", "Coursera", 16) },
    ]},
    { label: "Sem 2", year: 1, covered: ["Linear Algebra"], missing: [
      { id: "ai-2-1", skill: "Pandas & EDA", course: c("Data Analysis with Pandas", "Udemy", 14) },
      { id: "ai-2-2", skill: "Jupyter + Colab Workflows", course: c("Practical Jupyter", "Udemy", 6) },
    ]},
    { label: "Sem 3", year: 2, covered: ["Probability"], missing: [
      { id: "ai-3-1", skill: "Scikit-Learn Pipelines", course: c("Hands-On ML with Scikit-Learn", "Udemy", 22, 4.8) },
    ]},
    { label: "Sem 4", year: 2, covered: ["Statistics"], missing: [
      { id: "ai-4-1", skill: "Deep Learning with PyTorch", course: c("PyTorch for Deep Learning", "Udemy", 30, 4.8) },
      { id: "ai-4-2", skill: "MLOps Fundamentals", course: c("MLOps Specialization", "Coursera", 28, 4.7) },
    ]},
    { label: "Sem 5", year: 3, covered: ["ML Theory"], missing: [
      { id: "ai-5-1", skill: "Transformers & Attention", course: c("NLP with Transformers", "Coursera", 24, 4.9) },
    ]},
    { label: "Sem 6", year: 3, covered: ["NLP Basics"], missing: [
      { id: "ai-6-1", skill: "LangChain & RAG", course: c("Building RAG Apps", "Udemy", 18, 4.8) },
      { id: "ai-6-2", skill: "Vector Databases (Pinecone)", course: c("Vector DB Masterclass", "Udemy", 10) },
    ]},
    { label: "Sem 7", year: 4, covered: ["Computer Vision"], missing: [
      { id: "ai-7-1", skill: "Fine-tuning LLMs (LoRA)", course: c("Fine-tune Llama 3", "Coursera", 16, 4.8) },
      { id: "ai-7-2", skill: "Model Deployment (FastAPI)", course: c("Deploy ML with FastAPI", "Udemy", 12) },
    ]},
    { label: "Sem 8", year: 4, covered: ["Project"], missing: [
      { id: "ai-8-1", skill: "Kaggle Competitions", course: c("Kaggle Grandmaster Path", "Udemy", 36) },
    ]},
  ],
  "VLSI": [
    { label: "Sem 1", year: 1, covered: ["Electronics Basics"], missing: [
      { id: "v-1-1", skill: "Linux for Hardware Engineers", course: c("Linux for EDA Engineers", "Udemy", 10) },
    ]},
    { label: "Sem 2", year: 1, covered: ["Digital Logic"], missing: [
      { id: "v-2-1", skill: "Verilog HDL", course: c("Verilog from Scratch", "Udemy", 20, 4.7) },
    ]},
    { label: "Sem 3", year: 2, covered: ["Microprocessors"], missing: [
      { id: "v-3-1", skill: "SystemVerilog", course: c("SystemVerilog Masterclass", "Udemy", 26, 4.8) },
      { id: "v-3-2", skill: "Python Scripting for EDA", course: c("Python for Chip Designers", "Coursera", 14) },
    ]},
    { label: "Sem 4", year: 2, covered: ["VLSI Design"], missing: [
      { id: "v-4-1", skill: "UVM Verification", course: c("UVM Bootcamp", "Udemy", 32, 4.8) },
    ]},
    { label: "Sem 5", year: 3, covered: ["CMOS Design"], missing: [
      { id: "v-5-1", skill: "Synthesis with Design Compiler", course: c("RTL to GDS Flow", "Coursera", 30) },
      { id: "v-5-2", skill: "Static Timing Analysis", course: c("STA Deep Dive", "Udemy", 18, 4.8) },
    ]},
    { label: "Sem 6", year: 3, covered: ["VLSI Testing"], missing: [
      { id: "v-6-1", skill: "Physical Design (Innovus)", course: c("Physical Design Bootcamp", "Udemy", 28) },
    ]},
    { label: "Sem 7", year: 4, covered: ["FPGA Basics"], missing: [
      { id: "v-7-1", skill: "RISC-V Architecture", course: c("Build a RISC-V Core", "edX", 24, 4.9) },
      { id: "v-7-2", skill: "Low Power Design", course: c("Low Power VLSI", "Coursera", 16) },
    ]},
    { label: "Sem 8", year: 4, covered: ["Project"], missing: [
      { id: "v-8-1", skill: "Chiplet & Advanced Packaging", course: c("Modern Chip Architectures", "Coursera", 14) },
    ]},
  ],
};

export type College = {
  id: string;
  name: string;
  scoresByTrack: Record<CareerTrack, { area: string; coverage: number }[]>;
};

export const COLLEGES: College[] = [
  {
    id: "iilm",
    name: "IILM University",
    scoresByTrack: {
      "Computer Science Engineering": [
        { area: "Fundamentals", coverage: 82 },
        { area: "Web/Mobile", coverage: 55 },
        { area: "Cloud/DevOps", coverage: 38 },
        { area: "AI & Data", coverage: 60 },
        { area: "System Design", coverage: 45 },
        { area: "Tooling", coverage: 50 },
      ],
      "AI/ML": [
        { area: "Math Foundations", coverage: 78 },
        { area: "Classical ML", coverage: 62 },
        { area: "Deep Learning", coverage: 50 },
        { area: "MLOps", coverage: 30 },
        { area: "LLMs/GenAI", coverage: 35 },
        { area: "Deployment", coverage: 40 },
      ],
      VLSI: [
        { area: "Digital Design", coverage: 75 },
        { area: "Verification", coverage: 45 },
        { area: "Physical Design", coverage: 40 },
        { area: "Scripting", coverage: 55 },
        { area: "Modern Arch", coverage: 38 },
        { area: "Tooling", coverage: 42 },
      ],
    },
  },
  {
    id: "niet",
    name: "NIET",
    scoresByTrack: {
      "Computer Science Engineering": [
        { area: "Fundamentals", coverage: 88 },
        { area: "Web/Mobile", coverage: 68 },
        { area: "Cloud/DevOps", coverage: 52 },
        { area: "AI & Data", coverage: 65 },
        { area: "System Design", coverage: 58 },
        { area: "Tooling", coverage: 62 },
      ],
      "AI/ML": [
        { area: "Math Foundations", coverage: 82 },
        { area: "Classical ML", coverage: 72 },
        { area: "Deep Learning", coverage: 64 },
        { area: "MLOps", coverage: 42 },
        { area: "LLMs/GenAI", coverage: 48 },
        { area: "Deployment", coverage: 55 },
      ],
      VLSI: [
        { area: "Digital Design", coverage: 80 },
        { area: "Verification", coverage: 58 },
        { area: "Physical Design", coverage: 52 },
        { area: "Scripting", coverage: 60 },
        { area: "Modern Arch", coverage: 45 },
        { area: "Tooling", coverage: 55 },
      ],
    },
  },
  {
    id: "dei",
    name: "Dayalbagh Educational Institute",
    scoresByTrack: {
      "Computer Science Engineering": [
        { area: "Fundamentals", coverage: 90 },
        { area: "Web/Mobile", coverage: 50 },
        { area: "Cloud/DevOps", coverage: 42 },
        { area: "AI & Data", coverage: 70 },
        { area: "System Design", coverage: 60 },
        { area: "Tooling", coverage: 55 },
      ],
      "AI/ML": [
        { area: "Math Foundations", coverage: 90 },
        { area: "Classical ML", coverage: 78 },
        { area: "Deep Learning", coverage: 60 },
        { area: "MLOps", coverage: 35 },
        { area: "LLMs/GenAI", coverage: 42 },
        { area: "Deployment", coverage: 45 },
      ],
      VLSI: [
        { area: "Digital Design", coverage: 85 },
        { area: "Verification", coverage: 50 },
        { area: "Physical Design", coverage: 48 },
        { area: "Scripting", coverage: 52 },
        { area: "Modern Arch", coverage: 42 },
        { area: "Tooling", coverage: 48 },
      ],
    },
  },
];

export type WeeklySprint = {
  id: string;
  title: string;
  prompt: string;
  course: CourseCard;
};

export const WEEKLY_SPRINTS: WeeklySprint[] = [
  {
    id: "sprint-git",
    title: "Git Branching Mastery",
    prompt: "Concept Check: Can you explain the difference between rebase and merge, and when to use each?",
    course: c("Advanced Git: From Branching to Bisect", "Udemy", 8, 4.8),
  },
  {
    id: "sprint-docker",
    title: "Containerize a Node App",
    prompt: "Concept Check: Could you write a multi-stage Dockerfile that produces a <100MB production image?",
    course: c("Docker & Kubernetes: The Complete Guide", "Udemy", 28, 4.8),
  },
  {
    id: "sprint-rag",
    title: "Ship a RAG Prototype",
    prompt: "Concept Check: Do you understand embeddings, chunking strategies, and vector similarity search?",
    course: c("Building RAG Apps with LangChain", "Coursera", 18, 4.8),
  },
];