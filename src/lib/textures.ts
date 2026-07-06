"use client";

import * as THREE from "three";
import type { Project, Skill } from "./data";

/**
 * Canvas-generated textures — keeps the whole site self-contained
 * (no external images/models/fonts fetched at runtime by the scene).
 * All functions must only be called client-side.
 */

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return { canvas: c, ctx: c.getContext("2d")! };
}

function toTexture(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 8;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const DISPLAY_FONT = "'Space Grotesk', 'Arial', sans-serif";
const MONO_FONT = "'JetBrains Mono', 'Menlo', monospace";

/* ------------------------------------------------------------------ */

/** Big glowing label like the "ABOUT ME" floating over the planet. */
export function makeTextTexture(
  text: string,
  opts: {
    size?: number;
    color?: string;
    letterSpacing?: number;
    glow?: string;
  } = {}
): { texture: THREE.CanvasTexture; aspect: number } {
  const size = opts.size ?? 160;
  const color = opts.color ?? "#ffffff";
  const glow = opts.glow ?? "rgba(124,200,255,0.9)";
  const ls = opts.letterSpacing ?? 0.12;

  const probe = makeCanvas(8, 8).ctx;
  probe.font = `700 ${size}px ${DISPLAY_FONT}`;
  const spaced = text.split("").join(" "); // hair-spaces for tracking
  const w = probe.measureText(spaced).width * (1 + ls) + size * 2;
  const h = size * 2.2;

  const { canvas, ctx } = makeCanvas(Math.ceil(w), Math.ceil(h));
  ctx.font = `700 ${size}px ${DISPLAY_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = glow;
  ctx.shadowBlur = size * 0.14;
  ctx.fillStyle = color;
  ctx.fillText(spaced, canvas.width / 2, canvas.height / 2);
  ctx.shadowBlur = size * 0.05;
  ctx.fillText(spaced, canvas.width / 2, canvas.height / 2);

  return { texture: toTexture(canvas), aspect: canvas.width / canvas.height };
}

/* ------------------------------------------------------------------ */

/** Soft radial glow sprite (nebula puffs, sun halo, engine glow). */
export function makeGlowTexture(
  inner: string,
  outer = "rgba(0,0,0,0)",
  size = 256
): THREE.CanvasTexture {
  const { canvas, ctx } = makeCanvas(size, size);
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  g.addColorStop(0, inner);
  g.addColorStop(0.4, inner.replace(/[\d.]+\)$/, "0.35)"));
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return toTexture(canvas);
}

/* ------------------------------------------------------------------ */

/**
 * Fake "website screenshot" for the orbiting project cards — browser
 * chrome, gradient hero, headline bars and content blocks in the
 * project's palette.
 */
export function makeProjectCardTexture(project: Project): THREE.CanvasTexture {
  // Drawn in 640x400 logical space at 2x physical resolution so titles
  // stay crisp when the cards are viewed from orbit distance.
  const W = 640;
  const H = 400;
  const { canvas, ctx } = makeCanvas(W * 2, H * 2);
  ctx.scale(2, 2);

  const r = 18;
  ctx.beginPath();
  ctx.roundRect(0, 0, W, H, r);
  ctx.clip();

  // Page background
  ctx.fillStyle = "#0b0e1a";
  ctx.fillRect(0, 0, W, H);

  // Browser chrome
  ctx.fillStyle = "#141829";
  ctx.fillRect(0, 0, W, 44);
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(26 + i * 22, 22, 6, 0, Math.PI * 2);
    ctx.fillStyle = ["#ff5f57", "#febc2e", "#28c840"][i];
    ctx.fill();
  }
  ctx.fillStyle = "#1e2338";
  ctx.beginPath();
  ctx.roundRect(110, 10, W - 220, 24, 12);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = `500 13px ${MONO_FONT}`;
  ctx.textAlign = "center";
  ctx.fillText("github.com/AbhishekBadar", W / 2, 27);

  // Hero gradient band
  const grad = ctx.createLinearGradient(0, 44, W, 220);
  grad.addColorStop(0, project.colorA);
  grad.addColorStop(1, project.colorB);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 44, W, 176);

  // Decorative orbits on the hero
  ctx.strokeStyle = "rgba(255,255,255,0.25)";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.ellipse(W - 120, 130, 60 + i * 28, 24 + i * 12, -0.35, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(W - 120, 130, 18, 0, Math.PI * 2);
  ctx.fill();

  // Headline on hero
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 34px ${DISPLAY_FONT}`;
  ctx.fillText(project.title, 36, 120);
  ctx.font = `400 17px ${DISPLAY_FONT}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(project.tagline, 36, 152);

  // CTA pill
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.beginPath();
  ctx.roundRect(36, 172, 120, 30, 15);
  ctx.fill();
  ctx.fillStyle = "#0b0e1a";
  ctx.font = `600 14px ${DISPLAY_FONT}`;
  ctx.fillText("Explore →", 58, 192);

  // Content blocks below hero
  const rows = [
    [36, 250, 260, 12],
    [36, 274, 220, 12],
    [36, 298, 240, 12],
  ] as const;
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  for (const [x, y, w, h] of rows) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
  }
  // Cards row
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(330 + i * 96, 244, 84, 110, 10);
    ctx.fill();
    const cg = ctx.createLinearGradient(0, 244, 0, 300);
    cg.addColorStop(0, project.colorB + "66");
    cg.addColorStop(1, "transparent");
    ctx.fillStyle = cg;
    ctx.beginPath();
    ctx.roundRect(330 + i * 96, 244, 84, 44, 10);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.roundRect(36, 330, 180, 40, 10);
  ctx.fill();

  return toTexture(canvas);
}

/* ------------------------------------------------------------------ */

/** Holographic skill module — bold, high-contrast, readable at distance. */
export function makeSkillCardTexture(skill: Skill): THREE.CanvasTexture {
  // 512x288 logical space at 2x physical resolution
  const W = 512;
  const H = 288;
  const { canvas, ctx } = makeCanvas(W * 2, H * 2);
  ctx.scale(2, 2);

  // Panel — near-opaque so text never fights the starfield behind it
  ctx.beginPath();
  ctx.roundRect(5, 5, W - 10, H - 10, 22);
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "rgba(16,22,44,0.97)");
  bg.addColorStop(1, "rgba(7,10,22,0.97)");
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = "rgba(154,220,255,0.8)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Corner accents
  ctx.strokeStyle = "#7df9ff";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(5, 44);
  ctx.lineTo(5, 28);
  ctx.quadraticCurveTo(5, 5, 28, 5);
  ctx.lineTo(44, 5);
  ctx.stroke();

  // Module ring with the HUD number inside
  const cx = W - 88;
  const cy = 84;
  const R = 46;
  ctx.lineWidth = 9;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.stroke();
  const grad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
  grad.addColorStop(0, "#4cc9f0");
  grad.addColorStop(1, "#a78bfa");
  ctx.strokeStyle = grad;
  ctx.lineCap = "round";
  ctx.shadowColor = "rgba(76,201,240,0.7)";
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.arc(cx, cy, R, -Math.PI / 2, Math.PI * 1.32);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 32px ${DISPLAY_FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(skill.num, cx, cy + 2);

  // Name — big and bold, up to two lines
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(76,201,240,0.35)";
  ctx.shadowBlur = 6;
  ctx.font = `700 52px ${DISPLAY_FONT}`;
  wrapText(ctx, skill.name, 36, 106, W - 190, 58);
  ctx.shadowBlur = 0;

  // Items — bright cyan, large
  ctx.fillStyle = "#7df9ff";
  ctx.font = `600 26px ${MONO_FONT}`;
  wrapText(ctx, skill.items.toUpperCase(), 36, 216, W - 80, 36);

  return toTexture(canvas);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  lineH: number
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w;
      yy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line, x, yy);
}
