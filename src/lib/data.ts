/**
 * Canonical origin — the deployed URL of this portfolio.
 * NOTE: Update this to the real Vercel URL once deployed.
 */
export const SITE_URL = "https://nawaf-al-hussain.vercel.app";

export const PROFILE = {
  name: "Nawaf Al Hussain",
  firstName: "Nawaf",
  role: "Platform Engineer & Cloud Architect",
  status: "CS undergrad @ UIU · building systems that never sleep",
  taglines: [
    "deploy justice one commit at a time.",
    "build systems that never sleep.",
    "ship products end-to-end across the stack.",
    "automate what slows teams down.",
    "architect it, ship it, make it fast.",
  ],
  bio: "I'm a Computer Science & Engineering undergrad at United International University, Dhaka, building end-to-end systems across web, backend, cloud, and AI. I treat every commit like a closed case file — from AI-powered recruitment platforms to real-time multiplayer game engines, reverse-engineered Batman games, and database-theory tooling. It's not who I am underneath, but what I code that defines me.",
  about: {
    lead: "I build across the full stack to reduce dependencies and move faster — designing APIs, building frontends, wiring up databases, and deploying to the cloud. My work spans AI platforms, real-time game engines, developer tooling, and browser-based game rebuilds.",
    p2: "I'm currently studying Computer Science & Engineering at United International University in Dhaka, where I balance coursework with shipping real systems — from a recruitment anti-ghosting engine to a database serializability solver and a browser-based rebuild of The Dark Knight Rises (J2ME, 2012).",
    p3: "I focus on building simple, fast, and maintainable systems — designed for actual usage, not just clean implementations. It's not who I am underneath, but what I code that defines me.",
    credentials: [
      "BSc, Computer Science & Engineering — UIU, Dhaka (2024–Present)",
      "Focus: Full-stack · Cloud · AI/ML · Systems Design",
      "Dark Knight of Code — Batman-themed portfolio @ nawaf-al-hussain.vercel.app",
      "Based in Dhaka, Bangladesh",
    ],
  },
  email: "nkhondokar2420136@bscse.uiu.ac.bd",
  location: "Dhaka, Bangladesh",
  /** Add your own resume PDF at public/Resume_NawafAlHussain.pdf to enable this link. */
  resume: "/Resume_NawafAlHussain.pdf",
  siteUrl: `${SITE_URL}/`,
  socials: {
    github: "https://github.com/nawaf-al-hussain",
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
    company: "UIU",
    title: "BSc Computer Science & Engineering",
    range: "2024 — Present",
    location: "Dhaka, Bangladesh",
    blurb:
      "Studying Computer Science & Engineering at United International University — building the theoretical foundation alongside practical projects in algorithms, databases, systems design, and software engineering.",
    points: [
      "Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Software Engineering, Computer Networks",
      "Built Conflict Check — a database serializability solver that generates precedence graphs to verify conflict serializability",
      "Built a Section Planner app to help students pick course sections without time-slot conflicts",
      "Maintaining a strong academic record while shipping real-world side projects in parallel",
      "Active in the coding community — participating in hackathons and online coding challenges",
    ],
  },
  {
    company: "GitHub",
    title: "Independent Developer & Open Source Contributor",
    range: "2024 — Present",
    location: "Remote · Dhaka-based",
    blurb:
      "Building and shipping systems end-to-end across the full stack — from AI-powered recruitment platforms to real-time multiplayer game engines and browser-based game rebuilds.",
    points: [
      "Built NexHire — an AI-powered recruitment platform with candidate management, job posting, interviews, and analytics; migrated from MS SQL Server to Neon PostgreSQL",
      "Shipped Game of Life 2 — a real-time multiplayer board game engine with a React frontend",
      "Reverse-engineered The Dark Knight Rises (Gameloft J2ME, 2012) into a browser-based TypeScript rebuild (TDKR) using authentic game assets",
      "Built Conflict Check — a database serializability solver using precedence graphs and cycle detection",
      "Tech stack: Java, Spring Boot, TypeScript, Next.js, React, Python, C#, Node.js, Docker, Redis, SQL",
      "Maintaining 16+ public repositories on GitHub",
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
  { num: "01", name: "Frontend", items: "React · Next.js · Tailwind CSS · Framer Motion" },
  { num: "02", name: "Backend", items: "Spring Boot · Node.js · REST APIs · SQL" },
  { num: "03", name: "Languages", items: "Java · TypeScript · Python · C# · JavaScript" },
  { num: "04", name: "Cloud & Infra", items: "Docker · Redis · Vercel · Neon Postgres" },
  { num: "05", name: "AI & Automation", items: "LLMs · RAG · Vector DBs · Automation" },
  { num: "06", name: "Tools", items: "Git · GitHub Actions · Linux · Reverse Engineering" },
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
    meta: "2025 · Full-stack · AI",
    tagline: "AI-powered recruitment anti-ghosting engine",
    description:
      "A comprehensive recruitment platform with candidate management, job posting, interview scheduling, and analytics. Includes an AI-powered anti-ghosting engine to keep candidates engaged. Migrated from MS SQL Server to Neon PostgreSQL for Vercel-ready deployment.",
    tags: ["Java", "Spring Boot", "Next.js", "Neon Postgres", "AI"],
    colorA: "#7c3aed",
    colorB: "#1da1f2",
    link: "https://github.com/nawaf-al-hussain/NexHire",
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
    featured: true,
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
    id: "gol2",
    title: "Game of Life 2",
    meta: "2025 · Real-time · Multiplayer",
    tagline: "Real-time multiplayer board game engine",
    description:
      "A board game engine implementation of The Game of Life with a React frontend and real-time multiplayer support. Players join a shared session and progress through life events together in real time.",
    tags: ["React", "Node.js", "WebSocket", "Real-time"],
    colorA: "#22d3ee",
    colorB: "#a3e635",
    link: "https://github.com/nawaf-al-hussain/game-of-life-2",
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
    id: "syllabai",
    title: "SyllabAI",
    meta: "2025 · AI · Education",
    tagline: "AI-powered syllabus assistant",
    description:
      "An AI-powered tool for syllabus management and educational assistance. Currently in development — exploring LLM applications for academic course planning, study aids, and intelligent content recommendations.",
    tags: ["TypeScript", "AI", "LLM", "Education"],
    colorA: "#10b981",
    colorB: "#3b82f6",
    link: "https://github.com/nawaf-al-hussain/SyllabAI",
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
