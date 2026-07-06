export const PROFILE = {
  name: "Abhishek Badar",
  firstName: "Abhishek",
  role: "Software Development Engineer",
  status: "Software engineer · currently shipping @ Xeo",
  taglines: [
    "ship AI into real products.",
    "build end-to-end systems.",
    "automate what slows teams down.",
    "fix bottlenecks and ship faster.",
    "architect it, ship it, make it fast.",
  ],
  bio: "I design and ship products end to end across web, mobile, backends, and the automation between them. At Xeo, I own the full stack: Laravel, Next.js, Flutter from zero. Plus AI in production: RAG with Pinecone, OCR workflows, and automation that cuts real operational drag.",
  about: {
    lead: "I work across the entire stack to reduce dependencies and move faster. I design APIs, build frontends, and develop mobile apps so products can be shipped without bottlenecks.",
    p2: "At Xeo, I'm rebuilding a production Laravel system into a modern architecture while delivering a Flutter app from scratch — handling legacy code, performance constraints, and scalability challenges in real-world systems.",
    p3: "I focus on building simple, fast, and maintainable systems — designed for actual usage, not just clean implementations.",
    credentials: [
      "B.Tech, IT — RCOEM (2020–2024)",
      "AI Minor — IIT Ropar (2024–2025)",
      "Certified: Azure · AI · Flutter",
      "Currently @ Xeo, Pune",
    ],
  },
  email: "ab15.badar@gmail.com",
  location: "Pune, India",
  resume: "/Resume_AbhishekBadar.pdf",
  siteUrl: "https://abhishekbadar.dev/",
  socials: {
    github: "https://github.com/AbhishekBadar",
    linkedin: "https://www.linkedin.com/in/abhishekbadar",
    medium: "https://medium.com/@abhishekbadar",
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
    company: "Xeo Information Systems",
    title: "Software Development Engineer I",
    range: "Mar 2025 — Present",
    location: "Pune · Hybrid",
    blurb:
      "Leading a frontend replatform, building a Flutter app end-to-end, and designing the Laravel backend that serves both.",
    points: [
      "Migrating web frontend from Laravel Blade → Next.js (App Router) — scalable routing, reusable component patterns",
      "Built a reusable React data table abstraction replacing legacy Yajra DataTables — standardized pagination, sorting, server-side data",
      "Shipped complex form workflows using React Hook Form + Zod for type-safe validation",
      "Designed Laravel backend architecture serving web + mobile via RESTful APIs",
      "Built a Flutter app end-to-end for students & parents — fees, events, newsletters, bookings, push notifications. 500+ users",
      "HMAC-based request auth for mobile API security",
      "Payment gateway integration + admin dashboard for tracking, dues reports, receipts",
      "FCM push notifications with deep-link routing",
    ],
  },
  {
    company: "Refyne",
    title: "Associate Software Engineer",
    range: "Aug 2024 — Feb 2025",
    location: "Bangalore · Full-time",
    blurb:
      "Built the internal CRM platform used by 150+ across sales, risk, and growth. Automated the boring parts.",
    points: [
      "Built an internal CRM on Firebase Auth + serverless architecture — 150+ active users across sales, risk, and growth",
      "Firestore data models for real-time deal tracking, activity logs, and threaded communication",
      "Two-way comment system synced with ClickUp and Postgres — bidirectional sync between CRM and task management",
      "Dashboards + search filters that cut data retrieval time by 60%; custom export-to-CSV for on-demand reports",
      "Migrated 50,000+ records from HubSpot → Firebase with validation and consistency checks (+30% query efficiency)",
      "Automated cross-platform workflows (Slack, Gmail, ClickUp) via N8N — reduced ops overhead ~40%",
      "Automated user onboarding via Slack APIs + Firebase Admin SDK — cut onboarding from 30 min → under 5 min",
      "HR chatbot using Pinecone vector DB + LLMs, integrated with Slack (+40% internal support efficiency)",
      "Resume ingestion + scoring pipeline: Google Drive, OCR, semantic matching against job descriptions",
      "Integrated Sentry for real-time error monitoring — debugging time down 50%",
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
  { num: "01", name: "Frontend", items: "React · Next.js · Tailwind CSS" },
  { num: "02", name: "Backend", items: "Laravel · REST APIs · MySQL" },
  { num: "03", name: "Mobile", items: "Flutter · Dart" },
  { num: "04", name: "AI & Automation", items: "RAG · Pinecone · OCR · N8N" },
  { num: "05", name: "Tools & Infra", items: "Firebase · Git · Deployments" },
  { num: "06", name: "Languages", items: "TypeScript · PHP · Python" },
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
    id: "dospaces",
    title: "DoSpaces Plugin",
    meta: "2025 · Open source",
    tagline: "osTicket attachments, offloaded to the cloud",
    description:
      "osTicket plugin that offloads ticket attachments to DigitalOcean Spaces with secure public-link generation — cut agent response time by 30%.",
    tags: ["PHP", "DigitalOcean Spaces", "REST"],
    colorA: "#0069ff",
    colorB: "#4cc9f0",
    link: null,
    featured: true,
  },
  {
    id: "autoposter",
    title: "twitter-autoposter",
    meta: "2026 · AI · Automation",
    tagline: "A content pipeline that runs itself",
    description:
      "End-to-end content pipeline: researches trending topics, generates posts with DeepSeek, queues them into Google Sheets, and routes through a Telegram approval bot. Runs daily on GitHub Actions.",
    tags: ["Python", "DeepSeek", "Telegram Bot", "Google Sheets", "GH Actions"],
    colorA: "#7c3aed",
    colorB: "#1da1f2",
    link: "https://github.com/AbhishekBadar/twitter-autoposter",
    linkLabel: "View on GitHub",
  },
  {
    id: "claude-tracker",
    title: "Claude-Tracker",
    meta: "2026 · macOS · Swift",
    tagline: "Never blow a quota mid-flow",
    description:
      "Native menu-bar app that tracks Claude Code usage across weekly and 5-hour rolling windows so you never blow a quota mid-flow.",
    tags: ["Swift", "SwiftUI", "macOS"],
    colorA: "#d97757",
    colorB: "#f0abfc",
    link: "https://github.com/AbhishekBadar/Claude-Tracker",
    linkLabel: "View on GitHub",
  },
  {
    id: "save-image-as",
    title: "Save Image As",
    meta: "2026 · Chrome extension · Live",
    tagline: "2.46K+ installs, 1K+ active users",
    description:
      "Chrome extension with intelligent file-naming suggestions and streamlined download management. 2.46K+ installs, 1K+ active users, 4.36K+ store page views.",
    tags: ["JavaScript", "Chrome APIs", "Manifest v3"],
    colorA: "#34a853",
    colorB: "#4285f4",
    link: "https://chromewebstore.google.com/detail/save-image-as/bcngajhkkkhfalgljjjjbjacjcdlophj",
    linkLabel: "Chrome Web Store",
  },
  {
    id: "puzzleit",
    title: "PuzzleIT",
    meta: "2024 · Side project",
    tagline: "Escape rooms in the browser",
    description:
      "Web-based escape-room puzzle game with real-time collaboration. Engaged 200+ participants through challenges that tested lateral thinking.",
    tags: ["React", "Redux", "MongoDB", "Node"],
    colorA: "#22d3ee",
    colorB: "#a3e635",
    link: "https://github.com/AbhishekBadar/puzzleIT",
    linkLabel: "View on GitHub",
  },
  {
    id: "traffic-analyzer",
    title: "Traffic Density Analyzer",
    meta: "2023 · Research",
    tagline: "YOLO-powered signal timing",
    description:
      "Real-time traffic management using YOLO for vehicle detection and dynamic signal timing. Reduced simulated congestion by 25%.",
    tags: ["Python", "YOLO", "OpenCV"],
    colorA: "#ef4444",
    colorB: "#fbbf24",
    link: "https://github.com/AbhishekBadar/Traffic-Density-Analyzer",
    linkLabel: "View on GitHub",
  },
  {
    id: "whilegptthinks",
    title: "WhileGPTThinks",
    meta: "2025 · Chrome extension",
    tagline: "A silly but useful toy",
    description:
      "Redirects you to YouTube Shorts while ChatGPT generates a reply, then brings you back when the answer is ready. A silly but useful toy.",
    tags: ["JavaScript", "Chrome APIs"],
    colorA: "#ff4444",
    colorB: "#f0abfc",
    link: "https://github.com/AbhishekBadar/whilegptthinks",
    linkLabel: "View on GitHub",
  },
];

export const ARCHIVE_URL = "https://github.com/AbhishekBadar";
