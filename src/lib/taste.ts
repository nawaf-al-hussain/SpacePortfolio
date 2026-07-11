/**
 * Taste-skill feature toggles.
 *
 * These flags control the taste-skill compliance fixes. If you don't like
 * a specific fix, set its flag to `false` and it reverts to the pre-fix
 * behavior — no git revert needed.
 *
 * Each fix is also a separate git commit, so you can `git revert <sha>`
 * for a clean removal if you prefer that approach.
 */
export const TASTE = {
  /** Fix 1: Use Geist instead of Inter for body text. */
  useGeistFont: true,
  /** Fix 2: Magnetic button effect on nav links + email CTA. */
  magneticButtons: true,
  /** Fix 3: Replace star/close glyphs with clean SVG icons. */
  useSvgIcons: true,
  /** Fix 4: Add inner-border refraction to glass panels. */
  glassRefraction: true,
  /** Fix 5: Tactile active:scale on all interactive elements. */
  tactileFeedback: true,
} as const;
