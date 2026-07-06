"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROJECTS } from "@/lib/data";
import { useUIStore } from "@/lib/store";

export default function ProjectModal() {
  const selectedProject = useUIStore((s) => s.selectedProject);
  const setSelectedProject = useUIStore((s) => s.setSelectedProject);

  const project = selectedProject
    ? (PROJECTS.find((p) => p.id === selectedProject) ?? null)
    : null;

  // ESC closes
  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedProject, setSelectedProject]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={project.title}
        >
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          />

          {/* panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.9 }}
            className="glass relative w-[92vw] max-w-2xl overflow-hidden rounded-3xl p-0"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* banner */}
            <div
              className="relative h-40"
              style={{
                background: `linear-gradient(120deg, ${project.colorA}, ${project.colorB})`,
              }}
            >
              {/* subtle depth on the gradient + readability for the title */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 140% at 85% -20%, rgba(255,255,255,0.35), transparent 55%), linear-gradient(to top, rgba(2,1,10,0.55), transparent 60%)",
                }}
              />
              <span className="absolute left-8 top-5 font-mono text-[10px] tracking-[0.3em] text-white/70">
                ▸ MISSION BRIEF
              </span>
              <div className="absolute bottom-4 left-8 right-16">
                <h3 className="font-display text-4xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                  {project.title}
                </h3>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {project.featured && (
                    <span className="rounded-full border border-cyan/40 px-3 py-1 font-mono text-[10px] text-cyan">
                      ★ FEATURED PROJECT
                    </span>
                  )}
                  <span className="font-mono text-[10px] uppercase tracking-hud text-white/60">
                    {project.meta}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close"
                data-cursor="hover"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/20 text-white/80 transition-colors hover:border-cyan hover:text-cyan"
              >
                ✕
              </button>
            </div>

            {/* body */}
            <div className="p-8">
              <p className="font-display text-lg font-medium text-cyan">
                {project.tagline}
              </p>
              <p className="mt-4 leading-relaxed text-white/70">
                {project.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between gap-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="rounded-full bg-gradient-to-r from-cyan to-nebula px-6 py-2.5 font-display text-sm font-semibold uppercase tracking-wide text-space transition hover:brightness-110 active:scale-[0.98]"
                  >
                    {project.linkLabel ?? "Visit project"} ▸
                  </a>
                )}
                <span className="ml-auto font-mono text-[10px] tracking-[0.24em] text-white/30">
                  MISSION FILE // {project.id.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
