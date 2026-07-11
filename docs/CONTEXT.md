# Cosmic Voyage — Full Design & Architecture Context

> A single, authoritative reference for the entire website: what it is, how it's
> built, how every piece fits together, and how to change it safely. If you read
> only one file before working on this project, read this one — then the file it
> points you to.

**Owner:** Abhishek Badar · **Repo:** `rocketwebsite` · **Live:** https://abhishekbadar.dev
**Last verified against source:** 2026-07-08

---

## 1. The concept in one paragraph

This is a scroll-driven **"space voyage" personal portfolio**. The visitor pilots
a rocket from a hero launchpad through deep space, and every portfolio section is
a celestial landmark along the flight path: launch → **Earth** (about) → an **ISS
station** (work log) → a **corridor of holographic skill cards** → a **ringed gas
giant** with project cards orbiting it → the **Sun** (contact). Scrolling *is*
flying — progress `0→1` drives a keyframed camera and rocket along the route. The
finale is a cinematic, slow-motion **kamikaze impact into the Sun** that plays out
(and rewinds) as you scroll the last stretch. It was built to replicate two
AI-generated concept videos; those videos are the design spec.

Aesthetic north star: **realistic space assets** (real NASA/Solar System Scope
textures, real GLB models) framed by a **sci-fi HUD** overlay. Minimal hero text,
no visual clutter, no blown-out bloom.

---

## 2. Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 16** (App Router, `16.2.10`), React **19.2** |
| Language | TypeScript (strict), path alias `@/*` → `src/*` |
| Styling | **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`), no config file |
| 3D | **three r0.185** + **@react-three/fiber 9** + **@react-three/drei 10** |
| Post FX | **@react-three/postprocessing 3** (Bloom · ChromaticAberration · Vignette) |
| Scroll | **Lenis 1.3** smooth scroll |
| Animation (DOM) | **motion 12** (`motion/react`) |
| State | **zustand 5** |
| Fonts | `next/font/google`: Space Grotesk (display), Inter (body), JetBrains Mono (HUD) |
| Deploy | Vercel (`vercel.json` forces the `nextjs` framework preset) |

> ⚠️ **This is not the Next.js in your training data.** Per `AGENTS.md`, this
> Next.js version has breaking changes. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing framework code, and heed
> deprecation notices.

**Scripts:** `npm run dev` · `npm run build` · `npm run start` · `npm run lint`.
Turbopack dev server must be **restarted** to pick up new files added to `/public`.

---

## 3. Who it's for — the content

All content is **real** and lives in **`src/lib/data.ts`** (the one file to edit to
change what the site says). Abhishek Badar — Software Development Engineer.

- **Now:** SDE I @ **Xeo Information Systems**, Pune (Mar 2025 – present). Owns full
  stack: migrating a Laravel Blade frontend to Next.js, building a Flutter app
  end-to-end (500+ users), designing the Laravel backend, plus production AI
  (RAG/Pinecone, OCR, N8N automation).
- **Before:** Associate SWE @ **Refyne**, Bangalore (Aug 2024 – Feb 2025). Internal
  CRM on Firebase for 150+ users; automations; HR chatbot with Pinecone + LLMs.
- **Education:** B.Tech IT — RCOEM (2020–2024); **AI Minor — IIT Ropar** (2024–2025);
  certified Azure · AI · Flutter.
- **Contact:** `ab15.badar@gmail.com` · GitHub `AbhishekBadar` · LinkedIn
  `abhishekbadar` · Medium `@abhishekbadar`.
- **Résumé:** served from `/public/Resume_AbhishekBadar.pdf`.

Content collections in `data.ts`:
- `PROFILE` — name, role, status chip, taglines, bio, `about` (lead/p2/p3 +
  credentials), email, socials, resume path, site URL.
- `EXPERIENCE: Job[]` — the two jobs, each with a bullet `points[]` list (drives the
  tabbed Work panel).
- `SKILLS: Skill[]` — six modules (`01`–`06`): Frontend, Backend, Mobile, AI &
  Automation, Tools & Infra, Languages. Drives the 3D skill cards.
- `PROJECTS: Project[]` — **seven** projects, each with `colorA/colorB` gradient
  endpoints (used to generate the orbiting card artwork), tags, optional external
  `link`, and a `featured` flag. Drives the orbiting cards + modal.
- `ARCHIVE_URL` — link to the full GitHub profile.

---

## 4. Architecture — how scroll becomes flight

Three ideas carry the whole site. Understand these and everything else follows.

### 4.1 The scroll runway (`src/app/page.tsx`)
The page is a tall empty `<div>` of height `TOTAL_PAGES * 100vh` (**10 screens**,
`TOTAL_PAGES = 10`). That scroll distance *is* the journey. Everything visible is
either the **fixed 3D canvas** (behind everything, `z-0`) or **fixed DOM overlays**
(HUD, panels, modal — `z-10`+). Nothing actually scrolls in the document flow; the
scroll position is read as a progress value and fed to the scene.

The 3D `Experience` is loaded with `next/dynamic({ ssr: false })` and only mounted
after `document.fonts.ready` resolves (so canvas-generated text textures use the
right fonts).

### 4.2 The scroll state bus (`src/lib/scroll.ts`)
`initSmoothScroll()` boots Lenis (`duration 1.35`, custom exponential easing) and
runs one rAF loop that publishes into a **mutable module singleton**:

```ts
export const scrollState = { progress, velocity, impact }
```

- `progress` — raw `0..1` down the page.
- `velocity` — low-pass-filtered progress units/sec (feeds warp streaks + camera shake).
- `impact` — the **slow-motion finale value**. It eases toward `impactProgress(progress)`
  **asymmetrically**: forward it plays cinematically slow (`IMPACT_LAMBDA = 0.7`,
  ≈4s to fully detonate), but scrolling back up **rewinds fast** (`IMPACT_REVERSE_LAMBDA
  = 9`) so the explosion is fully scrubbable. Every finale effect reads `impact`, not `progress`.

Canvas code reads `scrollState` **inside `useFrame`** — zero React re-renders on
scroll. DOM code that needs to animate on scroll subscribes via `useScrollRaf(cb)`
and writes styles imperatively. Reactive "which section am I in" comes from
`useCurrentSection()` (updates only on section *change*). Nav/rail jumps call
`scrollToSection(id)` which Lenis-scrolls to `sectionAnchor(id)`. A `window.__lenis`
handle is exposed for console/testing.

### 4.3 The journey map (`src/lib/journey.ts`) — the single source of truth
**Change this file before touching any component.** It defines the world layout and
the flight. The voyage travels along **−Z**. Key exports:

- **`SECTIONS`** — id/label/`range` `[start,end]` in progress space:

  | Section | id | Progress range | Nav label |
  |---------|-----|---------------|-----------|
  | Hero | `hero` | 0.00–0.10 | Home |
  | Launch | `launch` | 0.10–0.19 | Launch |
  | About | `about` | 0.19–0.34 | About |
  | Work | `experience` | 0.34–0.50 | Work |
  | Skills | `skills` | 0.50–0.62 | Skills |
  | Projects | `projects` | 0.62–0.80 | Projects |
  | Contact | `contact` | 0.80–1.00 | Contact |

- **Landmark positions** (everything anchors to these `THREE.Vector3`s):
  `ABOUT_PLANET` (−24, 5, −70; r 11) · `STATION` (−14, 2, −96) · `SKILLS_CENTER`
  (9, −2, −128) · `PROJECTS_PLANET` (−4, −3, −186; r 13, ring 16→30) · `CONTACT_SUN`
  (28, 9, −262; r 7) · `IMPACT_POINT` (24.7, 8.2, −256).
- **Keyframed paths**: `CAMERA_KEYS` (pos + target + fov per progress stop) and
  `ROCKET_KEYS` (pos per stop), both built into **centripetal Catmull-Rom curves**.
  `progressToU()` maps progress → curve parameter honouring non-uniform key spacing.
- **`sampleCamera(p, outPos, outTgt) → fov`** and **`sampleRocket(p, outPos, outQuat)
  → thrust`** are the two functions the camera rig and rocket call every frame.
  `sampleRocket` also computes orientation (nose points local **+Y**; slerps from
  vertical to travel-direction across the launch window `0.08–0.17`), banks into
  turns, and returns a thrust profile (cold on the pad → ignition → cruise →
  full-throttle burn into the sun).
- **Projects orbit lap** (`ORBIT_START 0.63` → `ORBIT_END 0.79`): inside this window
  both camera and rocket leave their Catmull-Rom paths and **circle the ring plane**
  a full 360° (`projectsOrbitBlend` eases in/out, `orbitTheta` sweeps `2π`), so every
  orbiting project card sweeps past the lens in turn. The rocket runs `ORBIT_LEAD`
  radians ahead of the camera.
- **`impactProgress(p) = smoothstep(p, 0.88, 0.99)`** — the finale ramp target
  (resolves a hair before 1.0 so it completes even if scroll settles short).
- Helpers: `sectionAt(p)`, `sectionProgress(p, id)`, `sectionAnchor(id)`.

### 4.4 UI state (`src/lib/store.ts`)
A tiny zustand store: `ready` (loader gate — set when the GPU is primed),
`selectedProject` (open modal id), `hoveredProject` (hovered 3D card → drives cursor
+ HUD chip). Exposed as `window.__ui`.

---

## 5. The 3D scene (`src/components/canvas/*`)

Root is **`Experience.tsx`** — one `<Canvas>` (`dpr [1,1.75]`, ACES tone mapping,
`antialias:false` because the EffectComposer owns MSAA, exponential fog `#0a0618`).
It mounts, in order: `CameraRig`, `SpaceEnvironment`, `Rocket`, `Planets`,
`SkillCards`, `ProjectOrbit`, `SunImpact`, then the `EffectComposer`
(Bloom `intensity 0.95 / threshold 0.22 / mipmapBlur` · ChromaticAberration ·
Vignette). Lighting: ambient + one directional key light + an HDRI `Environment`
("Dikhololo Night"). Also handles WebGL **context-loss recovery** (one clean reload).

**Loading orchestration** (see §9): `SceneReady` compiles shaders + uploads textures
behind the loader then flips `ready=true`; `DeferredScene` mounts the heavy off-hero
GLB models only *after* `ready`, then precompiles them. `ImpactPostSurge` spikes
bloom + chromatic aberration mid-blast.

### Component-by-component

- **`CameraRig.tsx`** — every frame: damp `smoothP` toward `scrollState.progress`
  (rate `3.2` — the camera trails the scrollbar slightly), call `sampleCamera`, add
  **mouse parallax** (stronger in the hero), **speed shake** (from velocity), and the
  **impact kick + recoil** (the blast jolts the camera and shoves it back along its
  view axis). Damps FOV toward `sampled fov + shake`.

- **`Rocket.tsx`** — the hero object, built **entirely from procedural geometry**
  (LatheGeometry hull with a real ogive profile, extruded swept fins, 3 side boosters
  120° apart, flared engine bell with a hot inner surface, portholes, antenna beacon,
  greebles). Materials are glossy `MeshPhysicalMaterial` with clearcoat, reflecting
  the HDRI. The **hull livery** ("AB-01" callsign, accent stripes, panel seams) is a
  canvas texture drawn in code (`makeLiveryTexture`). **Exhaust** is a custom GLSL
  plume shader (white-hot core → cyan → violet edge) per nozzle, plus additive glow
  sprites and an 80-particle **world-space trail** (InstancedMesh, billboarded,
  colored cyan). Animation: idle hover on the pad, engine turbulence under thrust,
  and finale **consume-shrink** (the sun swallows the rocket, driven by
  `scrollState.impact`). Same `damp(…, 3.2)` as the camera so they move as one.

- **`Planets.tsx`** — all the celestial bodies, each a real albedo texture wrapped in
  a custom shader:
  - **AboutPlanet** — Earth: day/night blend shader with warm terminator band, **city
    lights** emerging on the night side, blue limb haze; separate lit **cloud shell**;
    additive **atmosphere** halo (BackSide fresnel); a 600-point **asteroid belt**.
    Initial spin puts **India at the sub-camera point** of the hero view.
  - **ProjectsPlanet** — **Neptune** gas-giant shader (drifting bands + living FBM
    turbulence + limb darkening) with a procedural **ring** (Cassini-style gap,
    density falloff) that *reveals* as you approach (`smoothstep 0.5→0.64`). Cards
    orbit in this exact ring plane (`PROJECTS_RING_TILT`).
  - **ContactSun** — real solar-surface shader (churn + limb darkening), three
    additive glow halos + a huge point light that **swells on approach** and **flares
    white-hot on impact** (`uImpact`), plus a "CONTACT" label with a connector line.
  - **BackgroundPlanets** — distant inert Mars, Saturn (with its real remapped ring),
    Jupiter, a gray moon, and a foreground moon in the hero corridor — pure parallax depth.
  - **BillboardLabel** — the floating "ABOUT ME" / "PROJECTS" / "CONTACT" text planes
    (camera-facing, additive, canvas text texture, scroll-faded).

- **`SpaceEnvironment.tsx`** — the atmosphere of the whole voyage, all zero-alloc
  instanced systems that **ride with the camera** (the "infinity" layer): a **Milky
  Way skybox** (real 6K panorama + a whisper of violet nebula), two drei `Stars`
  fields, **220 comet streaks** (drift + wrap + twinkle, oriented along velocity),
  **350 velocity-reactive warp streaks** (invisible at rest, ramp with scroll speed —
  the "warp" effect), **130 tumbling asteroids** (belt around Earth, scattered down
  the skills corridor, clustered on the projects ring — all biased off the flight
  lane), and ambient `Sparkles` clusters.

- **`SkillCards.tsx`** — six **holographic HUD panels** floating along the skills
  corridor (z −109…−149), alternating sides of the flight path. Each billboards to
  the camera, fades in/out by flight distance (gated to the skills section so they
  never bleed into the Work panel's screen space), glows/scales on hover, and floats
  via drei `Float`. Artwork is `makeSkillCardTexture` (module ring with the HUD
  number, name, tech items).

- **`ProjectOrbit.tsx`** — the **interactive centerpiece**: the seven project cards
  orbiting inside the ring like satellites, in **three staggered lanes** (radius +
  height) so they never overlap in projection. Each card billboards to the camera,
  reveals with the projects section, **enlarges while the camera laps the planet**,
  and on **hover → glow + scale + sets `hoveredProject`** (drives cursor + "TARGET
  LOCKED" chip), on **click → opens the modal** (`setSelectedProject`, gated to the
  projects section + a min alpha so off-screen cards don't fire). Plus two ambient
  mini-satellites. Invisible meshes don't raycast, so hover/click is free-gated by
  the reveal envelope.

- **`SetDressing.tsx`** (deferred) — the downloaded GLB models placed as distant
  living detail: a drifting **astronaut** (Quaternius) near Earth, a **spaceship
  flyby** crossing the skills corridor, and the **ISS "WORK LOG" station** (NASA
  model) for the experience section — recentered without reparenting the GLTF scene
  (reparenting a `useGLTF` scene inside a memo breaks under React Strict Mode; it uses
  a pure JSX wrapper group + computed offset instead), with a blinking beacon and a
  camera-facing "WORK LOG" label.

- **`SunImpact.tsx`** — the finale detonation, entirely a **pure function of
  `scrollState.impact`** (so it plays and rewinds by scrubbing). Three synthesized VFX
  layer-groups, all zero-alloc, with explicit `renderOrder` compositing:
  - **FB_** Fireball — additive HDR core puffs (domain-warped FBM shader, >1 values
    so bloom ignites them) + billowing **dark smoke** that occludes the sun (NormalBlending).
  - **SD_** Sparks & debris — 120 velocity-aligned camera-billboarded **streak
    tracers** + 24 ballistic **shrapnel octahedra** that curve back into the sun and cool.
  - **SW_** Shockwave & flash — expanding **shockwave ring**, white-hot **lens flash**
    with star spikes, a horizontal **anamorphic streak**, and a molten **rim flash**
    riding the sun's limb.
  - Plus a shared blast point light. The raw clock is dilated ×0.5 so the fire churns
    lazily — the filmic slow-mo look.

---

## 6. The DOM overlay (`src/components/dom/*`)

All fixed, mostly `pointer-events-none` with `pointer-events-auto` on interactive
bits so clicks fall through to the 3D canvas underneath. All scroll animation is
imperative via `useScrollRaf` (opacity/transform writes, guarded against redundant
updates) — **no React re-renders on scroll**.

- **`Navbar.tsx`** — fixed top bar. `ab.` logo (→ hero), center links (About / Work /
  Projects / Contact, active one from `useCurrentSection`, animated underline via
  motion `layoutId`), Résumé pill. Gains a `.glass` background + hairline once scrolled.
- **`HeroOverlay.tsx`** — the hero identity band: status chip (blinking dot +
  `PROFILE.status`), the giant gradient **name** with a blurred glow layer, telemetry
  flourishes, a right-side vertical telemetry column, and the "Scroll To Explore"
  indicator. Motion stagger-reveals on load; fades + lifts out over progress `0.02→0.1`.
- **`SectionOverlays.tsx`** — the five content panels, each shown by a scroll
  **envelope** (ramp in, hold, ramp out) tuned per section:
  - **01 About** — glass panel slides in from the left (bio lead/p2/p3 + credentials list).
  - **02 Work** — right-side panel with **tabs** (Xeo / Refyne) and a scrollable bullet
    list (`onWheel` stop-propagation so you can scroll the list without moving the ship).
  - **Skills** — centered "Skill modules online / fly through the calibration corridor" heading.
  - **03 Projects** — top-left heading + "CLICK A CARD TO INSPECT" hint + archive link.
  - **04 Contact** — right panel: heading, copy, a big **`mailto:` button** (no backend,
    no form), social icons, footer.
  - Also renders the bottom-right **"TARGET LOCKED // <project>"** chip when a 3D card
    is hovered (`hoveredProject` from the store).
- **`ProjectModal.tsx`** — the "mission brief" detail modal (motion spring in,
  backdrop blur, ESC to close). Banner uses the project's `colorA→colorB` gradient;
  body shows tagline, description, tags, and the external link if any.
- **`HUDRail.tsx`** — right-edge vertical **flight-progress rail**: a gradient fill
  scaled by progress (composited transform), clickable section tick diamonds, and live
  telemetry readouts (ALT / VEL / SEC) that tick at ~8 Hz like real instruments.
- **`SocialRail.tsx`** — bottom-left vertical social icons (GitHub / LinkedIn / Medium
  / Email), motion-revealed.
- **`ImpactFlash.tsx`** — a full-viewport radial **white-hot flash** (screen blend
  mode, over the UI too) that spikes the instant the rocket detonates — driven off
  `scrollState.impact`, razor-fast, scrubbable.
- **`CustomCursor.tsx`** — a two-part cursor (instant dot + trailing ring) that grows
  and tints over interactive elements (`a[href]`, `button`, `[data-cursor]`) and over
  hovered 3D project cards. **Only on `(pointer: fine)` devices**; hides the native
  cursor via a body class. Runs its own rAF, no React updates in the hot path.

---

## 7. Procedural artwork (`src/lib/textures.ts`)

All in-scene text and card artwork is **canvas-generated at runtime** (so the scene
fetches no external images/fonts — it's self-contained and works offline). Functions
are client-only. `makeTextTexture` (glowing labels), `makeGlowTexture` (radial glow
sprites for halos/engine/nebula puffs), `makeProjectCardTexture` (the orbiting project
HUD panel — meta line, big title, tagline, tech tags, brand accent bar, ★ featured),
`makeSkillCardTexture` (the skill module — numbered ring, name, items). The rocket's
`makeLiveryTexture` lives in `Rocket.tsx`. Fonts referenced: Space Grotesk (display),
JetBrains Mono (HUD/mono).

Note the distinction: **planets/sun/stars use real downloaded textures** (§8), while
**cards/labels/rocket-livery/nebula-glow are procedural**. The earlier `docs/DESIGN.md`
predates the real-texture switch and says everything is procedural — trust *this* file.

---

## 8. Assets & credits

Stored under `/public`, loaded at runtime by the scene:

- **Planet/sun/star textures** — `/public/textures/*.webp` (+ Saturn ring `.png`) from
  [Solar System Scope](https://www.solarsystemscope.com/textures/) (CC BY 4.0). Earth
  (4K day/night/clouds), Sun (4K), Milky Way (6K), Neptune/Mars/Moon/Jupiter/Saturn (2K).
  Textures are WebP-optimized for load size.
- **HDRI lighting** — `/public/hdri/dikhololo_night_1k.hdr`, Poly Haven (CC0).
- **GLB models** — `/public/models/`: `astronaut.glb`, `spaceship.glb` (Quaternius
  Ultimate Space Kit, CC0); `iss.glb` (**NASA 3D Resources**, public domain —
  meshopt-compressed, optimized from ~96 MB down to ~13 MB via gltf-transform; drei
  decodes meshopt built-in, no separate draco decoder).
- **Résumé** — `/public/Resume_AbhishekBadar.pdf`.

Credits are listed in `README.md`. (Sketchfab needs a login; NASA's public-domain GLB
repo was used for the ISS instead.)

---

## 9. Performance & loading strategy

The whole point is a **fast hero paint** with no mid-scroll hitches.

- **Progressive load** — the hero paints on ~3.3 MB. The heavy off-hero GLB models
  (ISS 4.4 MB, astronaut, spaceship — none appear in the hero) + the HDRI are
  **deferred** (`DeferredScene`, mounted only after `ready`), streamed in the
  background, then **precompiled** so scrolling to Work/About/Skills never hitches.
- **GPU priming** — `SceneReady` runs `gl.compileAsync` + `gl.initTexture` on every
  material/texture behind the loader, so gated objects (skill cards, project cards,
  ISS) don't compile on the frame they first appear.
- **Loader** (`Loader.tsx`) — tracks real download `progress` (drei `useProgress`),
  holds at 96% during shader compile, snaps to 100% when `ready`. Min show 1.4 s,
  **hard force-release at 9 s** (never traps the user), hard unmount fallback for
  frozen background tabs.
- **Zero per-frame allocation** — every `useFrame` uses module-scope scratch
  vectors/matrices/quaternions. Instanced meshes for comets/warp/asteroids/sparks/
  debris. Asteroids tumble round-robin (30/frame). Textures use anisotropy 8–16.
- **No React re-renders on scroll** — canvas reads the `scrollState` singleton in
  `useFrame`; DOM overlays write styles imperatively via `useScrollRaf`. React state
  changes only on discrete events (section change, hover, modal open).
- `dpr` capped at 1.75; `powerPreference: high-performance`; WebGL context-loss auto-reload.

---

## 10. Design language

- **Palette** (`globals.css` `@theme`): space `#050310` / deep `#02010a` backgrounds;
  nebula purple `#7c3aed` / soft `#a78bfa`; **cyan `#4cc9f0`** and bright cyan
  `#7df9ff` (the primary accent); pink `#f0abfc`; HUD blue `#9adcff`; star white `#eef2ff`.
- **Type**: Space Grotesk (display/headings), Inter (body), JetBrains Mono (all the
  HUD/telemetry/mono labels). Uppercase + wide letter-spacing (`tracking-hud` = 0.34em)
  for the sci-fi instrument feel.
- **HUD utilities**: `.glass` (frosted gradient panel), `.hud-corners` (bracket
  corners), `.hud-line` (gradient hairline divider), `.text-outline` (ghost outlined
  text), custom keyframes `blink` / `scroll-dot` / `spin-slow`. Scrollbar hidden.
- **Motion vocabulary**: panels slide in from the screen edge nearest their landmark;
  everything eases with `[0.22, 1, 0.36, 1]`; telemetry blinks and ticks; the custom
  cursor grows on interactives.
- **Accessibility / fallbacks**: custom cursor only on fine pointers;
  `prefers-reduced-motion` disables smooth scroll behavior; the canvas is `aria-hidden`;
  the contact path is a plain `mailto:` (no JS-gated form); SEO/JSON-LD `Person`
  schema + OpenGraph/Twitter meta in `layout.tsx`.

---

## 11. The finale (impact system) — how the pieces cooperate

The last ~12% of scroll is a coordinated multi-component detonation, all reading
`scrollState.impact` (the eased slow-mo value), so it plays forward slowly and rewinds
fast when you scroll back up:

1. `journey.ts` `impactProgress` + `sampleRocket`'s burn profile aim the rocket at
   `IMPACT_POINT` on the sun's surface and ramp thrust to full.
2. `Rocket.tsx` shrinks/shudders the ship to nothing as the sun consumes it.
3. `SunImpact.tsx` plays the fireball + smoke + sparks + debris + shockwave + flashes.
4. `Planets.tsx` ContactSun flares white-hot and its halo/light swell.
5. `Experience.tsx` `ImpactPostSurge` spikes bloom + chromatic aberration mid-blast.
6. `CameraRig.tsx` adds the jolt + recoil.
7. `ImpactFlash.tsx` (DOM) blows out the whole viewport in a razor white flash.

---

## 12. File map

```
src/
  app/
    layout.tsx          fonts, metadata, JSON-LD Person schema
    page.tsx            10-screen runway + mounts canvas (ssr:false) + all DOM overlays
    globals.css         Tailwind v4 @theme (palette/fonts), HUD utility classes
  lib/
    journey.ts          ★ single source of truth: sections, landmarks, camera/rocket paths, orbit lap, finale ramp
    data.ts             ★ all real content: PROFILE, EXPERIENCE, SKILLS, PROJECTS
    scroll.ts           Lenis boot + scrollState bus + useScrollRaf/useCurrentSection/scrollToSection
    store.ts            zustand UI state (ready, selectedProject, hoveredProject)
    textures.ts         canvas-generated card/label/glow textures
  components/
    canvas/
      Experience.tsx    Canvas, lights, HDRI, post FX, load orchestration, impact post-surge
      CameraRig.tsx     scroll → camera path + parallax + shake + impact recoil
      Rocket.tsx        procedural rocket, GLSL exhaust, particle trail, consume-shrink
      Planets.tsx       Earth(about), Neptune+ring(projects), Sun(contact), background planets, labels
      SpaceEnvironment.tsx  Milky Way skybox, stars, comets, warp streaks, asteroids, sparkles
      SkillCards.tsx    6 holographic skill panels along the corridor
      ProjectOrbit.tsx  7 interactive orbiting project cards + mini-satellites
      SetDressing.tsx   deferred GLBs: astronaut, spaceship flyby, ISS "WORK LOG" station
      SunImpact.tsx     finale VFX (fireball, smoke, sparks, debris, shockwave, flashes)
    dom/
      Navbar.tsx        top nav + résumé
      HeroOverlay.tsx   hero identity band + scroll indicator
      SectionOverlays.tsx  About / Work(tabs) / Skills / Projects / Contact panels + TARGET LOCKED chip
      ProjectModal.tsx  mission-brief detail modal
      HUDRail.tsx       right progress rail + live telemetry
      SocialRail.tsx    bottom-left social icons
      ImpactFlash.tsx   full-frame impact flash
      CustomCursor.tsx  dot + ring cursor (fine pointers only)
      Loader.tsx        launch-sequence loader (real progress, 9s force-release)
public/
  textures/  hdri/  models/  Resume_AbhishekBadar.pdf
docs/
  DESIGN.md   older one-page design brief (partly stale — see §7)
  CONTEXT.md  this file
```

---

## 13. Editing playbook & gotchas

- **To change the route/pacing/framing** → edit `src/lib/journey.ts` *first*
  (section ranges, `CAMERA_KEYS`/`ROCKET_KEYS`, landmark positions, orbit window,
  `impactProgress`). Components follow the map; don't hardcode positions in components.
- **To change what the site says** → edit `src/lib/data.ts` only (profile, jobs,
  skills, projects). Card artwork and panels regenerate from it.
- **To retune the finale** → it's all keyed off `scrollState.impact`; adjust the ramp
  in `journey.ts` (`impactProgress`) and the easing rates in `scroll.ts`
  (`IMPACT_LAMBDA` / `IMPACT_REVERSE_LAMBDA`).
- **Taste guardrails** (owner's stated preferences): realistic assets over
  stylized/procedural; minimal hero text; no visual clutter; **no blown-out bloom** —
  keep bloom threshold/intensity conservative.
- **Gotchas:**
  - Turbopack dev server must be **restarted** for new `/public` files to be served.
  - Do **not** reparent a `useGLTF` scene inside `useMemo` — it breaks under React
    Strict Mode's double-invoked memos. Use a pure JSX wrapper group + a computed
    offset (see `WorkStation` in `SetDressing.tsx`).
  - The canvas is `ssr:false` and gated on `document.fonts.ready`, because in-scene
    text textures need the real fonts to rasterize.
  - Everything drawing text at runtime is client-only (`textures.ts`).
  - `docs/DESIGN.md` is the older brief and is partly out of date (5 procedural
    project cards, no Work/ISS section, no sun-impact finale). This file supersedes it.
```
