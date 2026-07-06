# Cosmic Voyage — 3D Portfolio Design

**Date:** 2026-07-06 · **Owner:** Abhishek Badar

## Concept

A scroll-driven "space voyage" portfolio replicating the reference concept
videos (`Create_a_video_then.mp4`, `This_video_is_crazy_impressive.mp4`):
the visitor pilots a rocket from a hero launchpad through deep space, and
each portfolio section is a celestial landmark along the flight path.

| Scroll | Section  | Scene |
|--------|----------|-------|
| 0.00–0.12 | Hero | Rocket idles vertically amid purple nebula, giant PORTFOLIO title behind it in 3D, HUD dressing, "scroll to explore" |
| 0.12–0.22 | Launch | Rocket pitches forward, engines ignite, camera swings behind, warp streaks ramp with scroll velocity |
| 0.22–0.40 | About | Orange planet with night-side city lights + "ABOUT ME" floating label; glass bio panel slides in |
| 0.40–0.56 | Skills | Corridor of holographic HUD skill cards (canvas-texture progress rings) the rocket threads through |
| 0.56–0.78 | Projects | Blue gas giant with glowing ring; 5 project "website screenshot" cards orbit in the ring — hover glows, click opens mission-file modal |
| 0.78–1.00 | Contact | Sun labeled CONTACT; glass transmission form (mailto), socials |

## Architecture

- **Stack:** Next.js 16 (App Router, TS strict, Tailwind v4), React 19,
  three r185 + @react-three/fiber 9 + drei 10 + postprocessing (Bloom /
  ChromaticAberration / Vignette), Lenis smooth scroll, motion 12, zustand.
- **Scroll model:** page is a 900vh runway; Lenis drives native scroll;
  `lib/scroll.ts` publishes `{progress, velocity}` into a mutable
  `scrollState` read by canvas code in `useFrame` (zero React re-renders).
  DOM overlays subscribe via `useScrollRaf`.
- **Journey map:** `lib/journey.ts` is the single source of truth —
  section ranges, landmark positions, and CatmullRom-keyframed camera +
  rocket paths (`sampleCamera`, `sampleRocket` with thrust profile).
  Camera and every follower smooth with the same `damp(…, 3.2, dt)`.
- **Self-contained assets:** everything is procedural — planets/sun/nebula
  are GLSL FBM shaders, rocket is lathe/primitive geometry, all text and
  card artwork are canvas-generated textures (`lib/textures.ts`). Zero
  runtime fetches; works offline.
- **Interaction:** 3D project cards raycast (hover → cursor/HUD reacts via
  zustand, click → modal). Nav + HUD rail scroll to section anchors.
  Mouse parallax on camera; velocity-reactive warp and engine shake.
- **Fallbacks:** custom cursor only on `pointer: fine`; loader has a 9s
  force-release; reduced-motion users get native scroll.

## Component map

```
app/page.tsx            runway + mounts everything (canvas ssr:false)
canvas/Experience.tsx   Canvas, lights, fog, post FX
canvas/CameraRig.tsx    scroll → camera path + parallax + shake
canvas/Rocket.tsx       procedural rocket, exhaust shaders, particle trail
canvas/Planets.tsx      about planet, projects planet + ring, sun, dressing
canvas/SpaceEnvironment central nebula skybox, stars, comet/warp streaks,
                        asteroids, 3D hero title
canvas/SkillCards.tsx   holographic skill panels
canvas/ProjectOrbit.tsx interactive orbiting project cards
dom/…                   Navbar, HeroOverlay, SectionOverlays, ProjectModal,
                        HUDRail, Loader, CustomCursor
```

Content lives in `lib/data.ts` (profile, skills, projects) — edit that file
to make the portfolio yours.
