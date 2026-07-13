/**
 * Canonical origin — the deployed URL of this portfolio.
 * NOTE: Update this to the real Vercel URL once deployed.
 */
export const SITE_URL = "https://nawaf-al-hussain.vercel.app";

export const PROFILE = {
  name: "Nawaf Al Hussain",
  firstName: "Nawaf",
  role: "Platform Engineer · Cloud Architect · Backend Specialist",
  status: "CS undergrad @ UIU · building systems that never sleep",
  taglines: [
    "deploy justice one commit at a time.",
    "build systems that never sleep.",
    "ship products end-to-end across the stack.",
    "automate what slows teams down.",
    "architect it, ship it, make it fast.",
  ],
  bio: "Versatile technology professional with experience in software engineering, cloud architecture, and business operations. Proven expertise in designing and implementing high-availability backend systems using TypeScript and Node.js, with production systems handling 10K+ concurrent users. A unique combination of technical and business skills developed through software engineering, private tutoring with AI integration, BPO sales management, and 5+ years of retail business management. It's not who I am underneath, but what I code that defines me.",
  about: {
    lead: "I build across the full stack to reduce dependencies and move faster — designing APIs, building frontends, wiring up databases, and deploying to the cloud. My work spans AI-powered recruitment platforms, real-time multiplayer game engines, and fine-tuned open-source LLMs for education.",
    p2: "I'm currently studying Computer Science & Engineering at United International University in Dhaka, where I balance coursework with shipping real production systems — from a recruitment platform with ML-powered anti-ghosting detection to an event-sourced board game engine powering multiple games from a single modular core.",
    p3: "Beyond code, I bring a unique blend of technical and business skills: 5+ years of retail management, BPO sales experience, and private tutoring with AI integration. I focus on building simple, fast, and maintainable systems designed for actual usage, not just clean implementations.",
    credentials: [
      "BSc, Computer Science & Engineering — UIU, Dhaka (2024–Present)",
      "IAL: A in Pure Mathematics, A in Physics (full UMS in AS units)",
      "IGCSE: A* in Math, Physics, Chemistry, English, ICT, Bangla",
      "Based in Dhaka, Bangladesh",
    ],
  },
  email: "nawafalhussain81@gmail.com",
  location: "Dhaka, Bangladesh",
  resume: "/Resume_NawafAlHussain.pdf",
  siteUrl: `${SITE_URL}/`,
  socials: {
    github: "https://github.com/nawaf-al-hussain",
    linkedin: "https://www.linkedin.com/in/nawaf-al-hussain/",
    portfolio: "https://nawaf-al-hussain.vercel.app",
  },
};

export type Job = {
  company: string;
  title: string;
  range: string;
  location: string;
  blurb: string;
  points: string[];
};

export const EXPERIENCE: Job[] = [
  {
    company: "Independent",
    title: "Private Tutor & AI Education Developer",
    range: "Nov 2023 — Present",
    location: "Dhaka, Bangladesh",
    blurb:
      "Tutoring IGCSE/IAL Physics, Chemistry, Mathematics, and English while building Syllab AI — a fine-tuned LLM tutoring platform with RAG architecture for personalized student feedback.",
    points: [
      "Tutored 12 students in IGCSE/IAL Physics, Chemistry, Mathematics, and English, maintaining 7 active students",
      "Delivered university-level instruction in SPL, OOP, Discrete Mathematics, and Probability & Statistics",
      "Developed Syllab AI platform with interactive chatbot interface for personalized tutoring and real-time feedback",
      "Achieved A* grades in O-Levels and A grades in A-Levels through customized learning strategies and AI-powered tools",
      "Created individualized lesson plans addressing learning gaps using both traditional and AI-driven educational technologies",
    ],
  },
  {
    company: "SkyTech",
    title: "Closer (Promoted from Telesales Specialist)",
    range: "Feb 2023 — Nov 2023",
    location: "Dhaka, Bangladesh",
    blurb:
      "BPO sales role serving Australian customers — promoted to Closer after demonstrating exceptional telesales performance on government heat pump rebate programs.",
    points: [
      "Promoted to Closer after demonstrating exceptional telesales performance",
      "Closed sales from telesales leads for government rebate heat pump programs",
      "Developed advanced negotiation techniques to overcome customer objections",
      "Mentored telesales team members to improve lead quality and conversion rates",
      "Conducted outbound calls to Australian customers about government heat pump rebates",
      "Built rapport by explaining complex rebate programs and financial benefits clearly",
    ],
  },
  {
    company: "CityGroup",
    title: "Store Manager & Business Operations",
    range: "Mar 2018 — Jan 2023",
    location: "Dhaka, Bangladesh (Family Business)",
    blurb:
      "5+ years managing full retail operations at a family business — inventory, financial services, team supervision, and customer account management.",
    points: [
      "Managed full retail operations including inventory management, stock receiving, and product display optimization",
      "Oversaw financial operations: daily cash handling, mobile recharge services, mobile banking transactions, and comprehensive accounting",
      "Supervised delivery team and field workers with proper goods tracking and accountability",
      "Maintained detailed customer account records and outstanding payments",
      "Operated independently as sole manager during peak periods handling all business operations",
      "Developed expertise in multi-service retail combining traditional grocery sales with financial services and telecommunications",
    ],
  },
];

export type Skill = {
  /** HUD module number, "01".."06" */
  num: string;
  name: string;
  items: string;
};

export const SKILLS: Skill[] = [
  { num: "01", name: "Languages", items: "C · C++ · C# · TypeScript · JavaScript · Python · Java · SQL · Bash" },
  { num: "02", name: "Backend", items: "Node.js · Express · NestJS · Spring Boot 3.2 · Django · FastAPI · REST" },
  { num: "03", name: "Cloud & DevOps", items: "Docker · Kubernetes · Terraform · CI/CD · Nginx · Serverless" },
  { num: "04", name: "Databases", items: "PostgreSQL · MongoDB · Redis · SQLite · SQL Server · Neon · Supabase" },
  { num: "05", name: "AI/ML", items: "PyTorch · Transformers · RAG · Vector DBs · Fine-tuning · NLP" },
  { num: "06", name: "Frontend", items: "React 18 · Vite · Tailwind CSS · Konva.js · JavaFX 17 · HTML/CSS" },
];

export type Project = {
  id: string;
  title: string;
  meta: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Gradient endpoints used to generate the orbiting card artwork. */
  colorA: string;
  colorB: string;
  /** External link (GitHub / store). Null = no public link. */
  link: string | null;
  linkLabel?: string;
  featured?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "nexhire",
    title: "NexHire",
    meta: "2025 · Full-stack · AI · ML",
    tagline: "High-scale recruitment with anti-ghosting AI",
    description:
      "A high-scale recruitment management system with a normalized 3NF relational schema across 60+ entities. Includes string similarity algorithms (Jaro-Winkler, Levenshtein, TF-IDF cosine) for candidate matching at 94% precision, ML-powered anti-ghosting risk scorer (0.78 AUC-ROC), onboarding success predictor (85% accuracy), and an NLP pipeline for resume analysis with PDF/DOCX extraction and named entity recognition.",
    tags: ["Node.js", "Express", "React", "Vite", "PostgreSQL", "Neon", "Redis", "C# .NET", "JWT"],
    colorA: "#7c3aed",
    colorB: "#1da1f2",
    link: "https://nexhire-frontend.vercel.app/",
    linkLabel: "Visit Live Site",
    featured: true,
  },
  {
    id: "syllabai",
    title: "Syllab AI",
    meta: "2025 · AI/ML · Education · Ongoing",
    tagline: "Fine-tuned LLMs for personalized tutoring",
    description:
      "A hybrid AI system combining fine-tuned open-source language models (Granite 4.0 1B, Phi-3-mini) with a SQLite vector database for RAG architecture. Stores 500+ past paper questions with FTS5 and vector embeddings across Edexcel and Cambridge IGCSE/IAL Physics. Fine-tuned on 1000+ curated Q&A pairs achieving 40% faster inference with GGUF quantization while maintaining 95% accuracy. Deployed on Hugging Face Spaces with sub-3-second response times.",
    tags: ["Python", "PyTorch", "Transformers", "Granite 4.0", "Phi-3-mini", "SQLite-vec", "FTS5", "Gradio"],
    colorA: "#10b981",
    colorB: "#3b82f6",
    link: "https://syllabai-frontend.vercel.app",
    linkLabel: "Visit Live Site",
    featured: true,
  },
  {
    id: "game-engine",
    title: "Multiplayer Game Engine",
    meta: "2025 · Distributed · Event-Sourced · Ongoing",
    tagline: "One engine, many games — server-authoritative",
    description:
      "A universal, event-driven board game engine in Java 17 using DDD and event sourcing principles. Powers multiple games (The Game of Life 2, Monopoly, Clue) from a single modular core with zero game-specific coupling. Server-authoritative multiplayer via Spring Boot 3.2 WebSocket (STOMP) and Redis Pub/Sub, with an event-sourced persistence layer in PostgreSQL (Neon) for full game replayability. Dual frontends: React 18 + Konva.js web client and JavaFX 17 desktop client.",
    tags: ["Java 17", "Spring Boot 3.2", "WebSocket/STOMP", "Redis Pub/Sub", "PostgreSQL", "Hibernate", "Docker", "React 18", "Konva.js", "JavaFX 17"],
    colorA: "#22d3ee",
    colorB: "#a3e635",
    link: "https://github.com/nawaf-al-hussain",
    linkLabel: "View on GitHub",
    featured: true,
  },
  {
    id: "batcave",
    title: "The Batcave Portfolio",
    meta: "2025 · Portfolio · Dark theme",
    tagline: "Dark Knight of Code — Detective Mode enabled",
    description:
      "My primary dark-themed portfolio with a Batman-inspired Detective Mode aesthetic. Built around the 'Dark Knight of Code' persona — every project is a closed case file, color-coded in Batcave gold and black. Deployed at nawaf-al-hussain.vercel.app.",
    tags: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
    colorA: "#C9A44A",
    colorB: "#1a1a1a",
    link: "https://nawaf-al-hussain.vercel.app",
    linkLabel: "Visit Live Site",
  },
  {
    id: "tdkr",
    title: "TDKR Web Rebuild",
    meta: "2025 · Game · Reverse engineering",
    tagline: "Batman: The Dark Knight Rises — rebuilt in the browser",
    description:
      "A browser-based rebuild of The Dark Knight Rises (Gameloft J2ME, 2012) using authentic assets and game logic extracted via reverse engineering. A translation project — every value, behavior, and structure comes from the original game.",
    tags: ["TypeScript", "Vite", "Canvas", "Reverse Engineering"],
    colorA: "#C9A44A",
    colorB: "#0D0D0D",
    link: "https://github.com/nawaf-al-hussain/TDKR",
    linkLabel: "View on GitHub",
  },
  {
    id: "conflict-check",
    title: "Conflict Check",
    meta: "2024 · Database theory · Tool",
    tagline: "Database serializability solver",
    description:
      "A tool to check if a database schedule is conflict serializable using precedence graphs. Built as a course-aligned project to visualize and verify database transaction theory — generates a precedence graph and detects cycles.",
    tags: ["Python", "Graph Theory", "DBMS"],
    colorA: "#ef4444",
    colorB: "#fbbf24",
    link: "https://github.com/nawaf-al-hussain/conflict-check",
    linkLabel: "View on GitHub",
  },
  {
    id: "section-planner",
    title: "Section Planner",
    meta: "2024 · Utility · Student tool",
    tagline: "Pick course sections without conflicts",
    description:
      "A utility app for students to plan their semester schedules — pick course sections without time conflicts. Built to scratch my own itch during course registration at UIU.",
    tags: ["React", "TypeScript", "Scheduling"],
    colorA: "#34a853",
    colorB: "#4285f4",
    link: "https://github.com/nawaf-al-hussain/section-planner",
    linkLabel: "View on GitHub",
  },
];

export const ARCHIVE_URL = "https://github.com/nawaf-al-hussain";
