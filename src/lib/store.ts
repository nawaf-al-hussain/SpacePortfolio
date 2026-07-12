"use client";

import { create } from "zustand";

type UIState = {
  /** Fonts + first canvas frame ready; loader fades out when true. */
  ready: boolean;
  setReady: (v: boolean) => void;
  /** Project id whose detail modal is open, or null. */
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  /** Id of the 3D project card currently hovered (drives cursor + hint). */
  hoveredProject: string | null;
  setHoveredProject: (id: string | null) => void;
};

export const useUIStore = create<UIState>((set) => ({
  ready: false,
  setReady: (v) => set({ ready: v }),
  selectedProject: null,
  setSelectedProject: (id) => set({ selectedProject: id }),
  hoveredProject: null,
  setHoveredProject: (id) => set({ hoveredProject: id }),
}));

// NOTE: previously stored useUIStore on window.__ui for debugging, but
// removed to avoid potential circular structure serialization issues in
// React 19 dev mode.
