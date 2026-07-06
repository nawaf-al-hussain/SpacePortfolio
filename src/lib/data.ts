export const PROFILE = {
  name: "Abhishek Badar",
  firstName: "Abhishek",
  role: "Creative Developer",
  tagline: "I build immersive experiences for the web.",
  bio: "I'm a creative developer who turns ambitious ideas into fast, polished products. From real-time 3D on the web to full-stack applications, I obsess over the details — motion, performance, and the small interactions that make software feel alive.",
  bio2: "Currently crafting interfaces and engines for the next generation of the web. Available for select freelance missions.",
  email: "abhishek.badar@parityfox.com",
  location: "Earth · Remote",
  socials: {
    github: "https://github.com/abhishekbadar",
    linkedin: "https://linkedin.com/in/abhishekbadar",
    twitter: "https://x.com/abhishekbadar",
  },
  stats: [
    { value: "5+", label: "Years in orbit" },
    { value: "40+", label: "Missions shipped" },
    { value: "20+", label: "Happy crews" },
  ],
};

export type Skill = {
  name: string;
  pct: number;
  blurb: string;
};

export const SKILLS: Skill[] = [
  { name: "React / Next.js", pct: 95, blurb: "App router, RSC, edge" },
  { name: "Three.js / WebGL", pct: 88, blurb: "R3F, GLSL, shaders" },
  { name: "TypeScript", pct: 93, blurb: "Strict, end to end" },
  { name: "Node.js", pct: 90, blurb: "APIs, realtime, infra" },
  { name: "Motion & 3D Design", pct: 86, blurb: "GSAP, Blender, rigs" },
  { name: "UI Engineering", pct: 92, blurb: "Design systems, a11y" },
];

export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Gradient endpoints used to generate the orbiting card artwork. */
  colorA: string;
  colorB: string;
  link: string;
};

export const PROJECTS: Project[] = [
  {
    id: "nebula",
    title: "Nebula Analytics",
    tagline: "Realtime dashboards at warp speed",
    description:
      "A realtime analytics platform streaming millions of events per minute into GPU-accelerated dashboards. Built with Next.js, ClickHouse and WebGL scatter fields rendering 1M+ points at 60fps.",
    tags: ["Next.js", "WebGL", "ClickHouse"],
    colorA: "#7c3aed",
    colorB: "#4cc9f0",
    link: "#",
  },
  {
    id: "orbit",
    title: "Orbit Commerce",
    tagline: "Headless storefront with 3D product try-on",
    description:
      "Headless e-commerce storefront where every product spins in photoreal 3D. Configurator with live materials, AR export, and a checkout that converts 23% better than the legacy store.",
    tags: ["React Three Fiber", "Shopify", "AR"],
    colorA: "#0ea5e9",
    colorB: "#f0abfc",
    link: "#",
  },
  {
    id: "pulse",
    title: "Pulse AI",
    tagline: "Conversational copilot for support teams",
    description:
      "An AI copilot that drafts replies, summarizes threads and surfaces knowledge in-flight. Streaming UI, tool-calling agents, and a feedback loop that lifted resolution speed by 40%.",
    tags: ["AI / LLM", "Streaming UX", "Node.js"],
    colorA: "#f472b6",
    colorB: "#7c3aed",
    link: "#",
  },
  {
    id: "terra",
    title: "Terra Studio",
    tagline: "Procedural world-builder in the browser",
    description:
      "A browser-based terrain and world editor: procedural noise stacks, erosion simulation on the GPU, and one-click export to glTF. Used by indie studios to prototype game worlds.",
    tags: ["GLSL", "Compute", "glTF"],
    colorA: "#22d3ee",
    colorB: "#a3e635",
    link: "#",
  },
  {
    id: "comet",
    title: "Comet Mail",
    tagline: "Email client that feels like a game",
    description:
      "An opinionated email client with command-palette triage, physics-based gestures and offline sync. Inbox zero, but make it fun — 4.9★ from 2k+ early users.",
    tags: ["Electron", "Local-first", "Motion"],
    colorA: "#fbbf24",
    colorB: "#f472b6",
    link: "#",
  },
];
