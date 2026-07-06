"use client";

import { Sparkles, Stars } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  ABOUT_PLANET,
  PROJECTS_PLANET,
  PROJECTS_RING_TILT,
  SKILLS_CENTER,
} from "@/lib/journey";
import { scrollState } from "@/lib/scroll";
import { makeGlowTexture, makeTextTexture } from "@/lib/textures";

/**
 * SpaceEnvironment — the atmosphere of the whole voyage.
 * Nebula skybox, starfields, comet streaks, velocity-reactive warp lines,
 * asteroid fields, the 3D hero title and ambient sparkle clusters.
 */

/* ------------------------------------------------------------------ */
/* Module-level scratch (zero per-frame allocations)                   */
/* ------------------------------------------------------------------ */

const _p = new THREE.Vector3();
const _s = new THREE.Vector3();
const _x = new THREE.Vector3();
const _y = new THREE.Vector3();
const _z = new THREE.Vector3();
const _toCam = new THREE.Vector3();
const _m4 = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _dq = new THREE.Quaternion();
const Z_AXIS = new THREE.Vector3(0, 0, 1);

/**
 * Build a streak matrix: local X along the unit direction (ux,uy,uz),
 * plane normal rolled toward the camera. Returns shared _m4 — consume
 * immediately (setMatrixAt copies).
 */
function composeStreak(
  px: number,
  py: number,
  pz: number,
  ux: number,
  uy: number,
  uz: number,
  cx: number,
  cy: number,
  cz: number,
  len: number,
  wid: number
): THREE.Matrix4 {
  _x.set(ux, uy, uz);
  _toCam.set(cx - px, cy - py, cz - pz);
  _z.copy(_toCam).addScaledVector(_x, -_toCam.dot(_x));
  if (_z.lengthSq() < 1e-6) {
    _z.set(-uz, 0, ux);
    if (_z.lengthSq() < 1e-6) _z.set(1, 0, 0);
  }
  _z.normalize();
  _y.crossVectors(_z, _x);
  _m4.makeBasis(_x, _y, _z);
  _q.setFromRotationMatrix(_m4);
  _p.set(px, py, pz);
  _s.set(len, wid, 1);
  _m4.compose(_p, _q, _s);
  return _m4;
}

/* ------------------------------------------------------------------ */
/* Nebula skybox shader                                                */
/* ------------------------------------------------------------------ */

const NEBULA_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const NEBULA_FRAG = /* glsl */ `
precision highp float;
varying vec3 vDir;
uniform float uTime;

float hash13(vec3 p) {
  p = fract(p * 0.1031);
  p += dot(p, p.zyx + 31.32);
  return fract((p.x + p.y) * p.z);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash13(i + vec3(0.0, 0.0, 0.0)), hash13(i + vec3(1.0, 0.0, 0.0)), u.x),
        mix(hash13(i + vec3(0.0, 1.0, 0.0)), hash13(i + vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(mix(hash13(i + vec3(0.0, 0.0, 1.0)), hash13(i + vec3(1.0, 0.0, 1.0)), u.x),
        mix(hash13(i + vec3(0.0, 1.0, 1.0)), hash13(i + vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.52;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p = p * 2.07 + vec3(11.3, 7.1, 5.9);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 dir = normalize(vDir);
  float t = uTime * 0.004; // very slow drift
  vec3 p = dir * 3.1;

  // Domain warp: q warps p, r warps again for wispy filaments
  vec3 q = vec3(
    fbm(p + t),
    fbm(p + vec3(5.2, 1.3, 2.8) - t * 0.7),
    fbm(p + vec3(1.2, 8.3, 4.7))
  );
  float f = fbm(p + 2.4 * q + vec3(9.7, 2.1, 6.4) + t * 0.35);
  float g = fbm(p * 1.7 + 3.1 * q + vec3(4.4, 14.2, 8.8));

  // Large-scale directional density — some sky regions stay near-black
  float region = fbm(dir * 1.25 + vec3(23.7, 11.9, 31.4));
  float density = smoothstep(0.32, 0.78, region);

  // Brightest clouds gather toward a horizon-ish band
  float band = 1.0 - smoothstep(0.05, 0.6, abs(dir.y + 0.06));

  float clouds = f * mix(0.25, 1.25, density);

  vec3 col = vec3(0.0196, 0.0118, 0.0627);                                        // #050310 base
  col = mix(col, vec3(0.043, 0.165, 0.369),
            smoothstep(0.3, 0.72, q.y) * 0.5 * density);                           // #0b2a5e pockets
  col = mix(col, vec3(0.231, 0.114, 0.561), smoothstep(0.34, 0.8, clouds));        // #3b1d8f
  col = mix(col, vec3(0.486, 0.227, 0.929),
            smoothstep(0.56, 0.98, clouds) * (0.35 + 0.65 * band));                // #7c3aed
  col = mix(col, vec3(0.698, 0.231, 0.839),
            smoothstep(0.62, 1.05, g * clouds * 1.6) * 0.6 * band);                // #b23bd6 accents
  col += vec3(0.486, 0.227, 0.929) * band * clouds * clouds * 0.3;

  // Fine procedural star sparkle
  vec3 sp = dir * 260.0;
  vec3 cell = floor(sp);
  float h = hash13(cell);
  if (h > 0.998) {
    vec3 sf = fract(sp) - 0.5;
    float d = length(sf);
    float tw = 0.7 + 0.3 * sin(uTime * 1.4 + h * 900.0);
    float s = smoothstep(0.24, 0.0, d) * tw * 1.5;
    vec3 starCol = mix(vec3(0.93, 0.95, 1.0), vec3(0.604, 0.863, 1.0), step(0.9992, h)); // some #9adcff
    col += starCol * s;
  }

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const COMET_COUNT = 220;
const COMET_X = 45;
const COMET_Y = 25;
const COMET_Z_NEAR = 15;
const COMET_Z_SPAN = 305; // z in [15, -290]

const WARP_COUNT = 350;
const WARP_NEAR = 20;
const WARP_SPAN = 140; // z in [camZ-20, camZ-160]

const AST_COUNT = 130;
const AST_STEP = 30; // instances tumbled per frame (round-robin)

/* ------------------------------------------------------------------ */

export default function SpaceEnvironment() {
  const envGroup = useRef<THREE.Group | null>(null);
  const titleGroup = useRef<THREE.Group | null>(null);
  const warpSpeed = useRef(0);
  const astCursor = useRef(0);

  /* -------- nebula skybox -------- */
  const sky = useMemo(() => {
    const geo = new THREE.SphereGeometry(340, 48, 32);
    const mat = new THREE.ShaderMaterial({
      vertexShader: NEBULA_VERT,
      fragmentShader: NEBULA_FRAG,
      uniforms: { uTime: { value: 0 } },
      side: THREE.BackSide,
      depthWrite: false,
    });
    return { geo, mat };
  }, []);

  /* -------- comet streaks -------- */
  const comets = useMemo(() => {
    const N = COMET_COUNT;
    const geo = new THREE.PlaneGeometry(1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: makeGlowTexture("rgba(255,255,255,0.95)"),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.frustumCulled = false;
    mesh.renderOrder = 4;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = colorAttr;

    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    const unit = new Float32Array(N * 3);
    const len = new Float32Array(N);
    const phase = new Float32Array(N);
    const pulse = new Float32Array(N);
    const baseCol = new Float32Array(N * 3);
    const palette = ["#7df9ff", "#f0abfc", "#a78bfa", "#ffffff"].map(
      (c) => new THREE.Color(c)
    );
    const c = new THREE.Color();

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 2 * COMET_X;
      pos[i3 + 1] = (Math.random() - 0.5) * 2 * COMET_Y;
      pos[i3 + 2] = COMET_Z_NEAR - Math.random() * COMET_Z_SPAN;
      // Drift: mostly -z biased
      const vx = (Math.random() - 0.5) * 0.5;
      const vy = (Math.random() - 0.5) * 0.4;
      const vz = -(0.35 + Math.random() * 1.05);
      const inv = 1 / Math.hypot(vx, vy, vz);
      vel[i3] = vx;
      vel[i3 + 1] = vy;
      vel[i3 + 2] = vz;
      unit[i3] = vx * inv;
      unit[i3 + 1] = vy * inv;
      unit[i3 + 2] = vz * inv;
      len[i] = 1.0 + Math.random() * 1.8;
      phase[i] = Math.random() * Math.PI * 2;
      pulse[i] = 0.6 + Math.random() * 1.2;
      c.copy(palette[Math.floor(Math.random() * palette.length)]).multiplyScalar(1.7);
      baseCol[i3] = c.r;
      baseCol[i3 + 1] = c.g;
      baseCol[i3 + 2] = c.b;
      // Initial matrices (hero camera position) so frame 0 is clean
      mesh.setMatrixAt(
        i,
        composeStreak(
          pos[i3], pos[i3 + 1], pos[i3 + 2],
          unit[i3], unit[i3 + 1], unit[i3 + 2],
          0, 0.4, 10,
          len[i], 0.075
        )
      );
      colorAttr.setXYZ(i, baseCol[i3], baseCol[i3 + 1], baseCol[i3 + 2]);
    }
    return { mesh, pos, vel, unit, len, phase, pulse, baseCol, colorAttr, N };
  }, []);

  /* -------- warp streaks (velocity-reactive) -------- */
  const warp = useMemo(() => {
    const N = WARP_COUNT;
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateY(Math.PI / 2); // length axis -> local Z, normal -> local X
    const mat = new THREE.MeshBasicMaterial({
      map: makeGlowTexture("rgba(255,255,255,0.9)"),
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.frustumCulled = false;
    mesh.visible = false; // invisible at rest — hero stays clean
    mesh.renderOrder = 6;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(N * 3), 3);
    mesh.instanceColor = colorAttr;

    const ox = new Float32Array(N);
    const oy = new Float32Array(N);
    const zArr = new Float32Array(N);
    const widths = new Float32Array(N);
    const lenF = new Float32Array(N);
    const quats: THREE.Quaternion[] = [];
    const white = new THREE.Color("#ffffff");
    const cyan = new THREE.Color("#7df9ff");
    const c = new THREE.Color();

    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 23; // annulus r 3..26
      ox[i] = Math.cos(a) * r;
      oy[i] = Math.sin(a) * r;
      zArr[i] = -WARP_NEAR - Math.random() * WARP_SPAN;
      widths[i] = 0.035 + Math.random() * 0.05;
      lenF[i] = 0.7 + Math.random() * 0.6;
      quats.push(new THREE.Quaternion().setFromAxisAngle(Z_AXIS, a));
      c.copy(white).lerp(cyan, Math.random() * 0.85).multiplyScalar(1.2);
      colorAttr.setXYZ(i, c.r, c.g, c.b);
      // park at identity-ish matrices; first visible frame recomputes all
      _p.set(ox[i], oy[i], zArr[i]);
      _s.set(1, widths[i], 2);
      _m4.compose(_p, quats[i], _s);
      mesh.setMatrixAt(i, _m4);
    }
    return { mesh, mat, ox, oy, zArr, widths, lenF, quats, N };
  }, []);

  /* -------- asteroid fields -------- */
  const asteroids = useMemo(() => {
    const N = AST_COUNT;
    const geo = new THREE.IcosahedronGeometry(1, 1);
    // CPU-displace vertices once with hash noise (±0.35)
    const pa = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pa.count; i++) {
      v.fromBufferAttribute(pa, i);
      const h =
        Math.sin(v.x * 12.9898 + v.y * 78.233 + v.z * 37.719) * 43758.5453;
      const n = h - Math.floor(h); // fract
      v.multiplyScalar(1 + (n - 0.5) * 0.7);
      pa.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: "#8a7d72",
      roughness: 0.9,
      metalness: 0.1,
    });
    const mesh = new THREE.InstancedMesh(geo, mat, N);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const positions = new Float32Array(N * 3);
    const scales = new Float32Array(N);
    const speeds = new Float32Array(N);
    const axes: THREE.Vector3[] = [];
    const quats: THREE.Quaternion[] = [];

    let i = 0;
    const put = (x: number, y: number, z: number) => {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    };

    // Tight belt hugging the about planet, biased away from the flight
    // path (the camera passes on the +x/+z side — mirror rocks that
    // would spawn there so none sit on the lens).
    const bandTilt = new THREE.Euler(0.28, 0, 0.14);
    const frontDir = new THREE.Vector3(0.95, -0.11, 0.27);
    for (let k = 0; k < 45; k++, i++) {
      const a = Math.random() * Math.PI * 2;
      const r = ABOUT_PLANET.radius + 2 + Math.random() * 6;
      v.set(Math.cos(a) * r, (Math.random() - 0.5) * 1.5, Math.sin(a) * r)
        .applyEuler(bandTilt);
      if (v.dot(frontDir) > r * 0.35) v.multiplyScalar(-1);
      v.add(ABOUT_PLANET.position);
      put(v.x, v.y, v.z);
    }
    // Scatter along the skills corridor (40)
    for (let k = 0; k < 40; k++, i++) {
      let sx = (Math.random() - 0.5) * 40;
      const sy = (Math.random() - 0.5) * 18;
      if (Math.hypot(sx, sy) < 10) sx += sx >= 0 ? 12 : -12; // keep the flight lane clear
      const sz = (Math.random() - 0.5) * 56;
      put(SKILLS_CENTER.x + sx, SKILLS_CENTER.y + sy, SKILLS_CENTER.z + sz);
    }
    // Cluster on the projects ring outskirts (45)
    for (let k = 0; k < 45; k++, i++) {
      const a = Math.random() * Math.PI * 2;
      const r = PROJECTS_PLANET.ringOuter + 2 + Math.random() * 12;
      v.set(Math.cos(a) * r, (Math.random() - 0.5) * 2, Math.sin(a) * r)
        .applyEuler(PROJECTS_RING_TILT)
        .add(PROJECTS_PLANET.position);
      put(v.x, v.y, v.z);
    }

    for (let k = 0; k < N; k++) {
      scales[k] = 0.2 + Math.pow(Math.random(), 1.7) * 1.4;
      speeds[k] = 0.06 + Math.random() * 0.35;
      const ax = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      );
      if (ax.lengthSq() < 1e-6) ax.set(0, 1, 0);
      ax.normalize();
      axes.push(ax);
      const qq = new THREE.Quaternion().setFromAxisAngle(
        ax,
        Math.random() * Math.PI * 2
      );
      quats.push(qq);
      _p.set(positions[k * 3], positions[k * 3 + 1], positions[k * 3 + 2]);
      _s.setScalar(scales[k]);
      _m4.compose(_p, qq, _s);
      mesh.setMatrixAt(k, _m4);
    }
    return { mesh, positions, scales, speeds, axes, quats, N };
  }, []);

  /* -------- hero title -------- */
  const title = useMemo(() => {
    const { texture, aspect } = makeTextTexture("PORTFOLIO", {
      size: 230,
      color: "#f4f6ff",
    });
    const mainMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      fog: false,
      opacity: 1,
    });
    const ghostMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      fog: false,
      opacity: 0.22,
    });
    return { aspect, mainMat, ghostMat };
  }, []);

  const titleGeo = useMemo(() => new THREE.PlaneGeometry(1, 1), []);

  /* -------- per-frame animation -------- */
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.066);
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    const p = scrollState.progress;

    // Skybox + far starfields ride with the camera (true "infinity" layer)
    if (envGroup.current) envGroup.current.position.copy(cam.position);
    sky.mat.uniforms.uTime.value = t;

    /* comet streaks — drift, wrap, orient along velocity, pulse */
    {
      const { mesh, pos, vel, unit, len, phase, pulse, baseCol, colorAttr, N } =
        comets;
      const carr = colorAttr.array as Float32Array;
      const cx = cam.position.x;
      const cy = cam.position.y;
      const cz = cam.position.z;
      for (let i = 0; i < N; i++) {
        const i3 = i * 3;
        let px = pos[i3] + vel[i3] * dt;
        let py = pos[i3 + 1] + vel[i3 + 1] * dt;
        let pz = pos[i3 + 2] + vel[i3 + 2] * dt;
        if (px > COMET_X) px -= COMET_X * 2;
        else if (px < -COMET_X) px += COMET_X * 2;
        if (py > COMET_Y) py -= COMET_Y * 2;
        else if (py < -COMET_Y) py += COMET_Y * 2;
        if (pz < COMET_Z_NEAR - COMET_Z_SPAN) pz += COMET_Z_SPAN;
        else if (pz > COMET_Z_NEAR) pz -= COMET_Z_SPAN;
        pos[i3] = px;
        pos[i3 + 1] = py;
        pos[i3 + 2] = pz;
        mesh.setMatrixAt(
          i,
          composeStreak(
            px, py, pz,
            unit[i3], unit[i3 + 1], unit[i3 + 2],
            cx, cy, cz,
            len[i], 0.075
          )
        );
        const tw = 0.55 + 0.45 * Math.sin(t * pulse[i] + phase[i]);
        carr[i3] = baseCol[i3] * tw;
        carr[i3 + 1] = baseCol[i3 + 1] * tw;
        carr[i3 + 2] = baseCol[i3 + 2] * tw;
      }
      mesh.instanceMatrix.needsUpdate = true;
      colorAttr.needsUpdate = true;
    }

    /* warp streaks — velocity-reactive, wrap relative to camera z */
    {
      warpSpeed.current = THREE.MathUtils.damp(
        warpSpeed.current,
        Math.abs(scrollState.velocity),
        5,
        dt
      );
      const sp = warpSpeed.current;
      const op = THREE.MathUtils.clamp(sp * 3.5 - 0.05, 0, 0.85);
      warp.mat.opacity = op;
      if (op < 0.003) {
        warp.mesh.visible = false;
      } else {
        warp.mesh.visible = true;
        const { mesh, ox, oy, zArr, widths, lenF, quats, N } = warp;
        const camX = cam.position.x;
        const camY = cam.position.y;
        const camZ = cam.position.z;
        const hi = camZ - WARP_NEAR;
        const lo = hi - WARP_SPAN;
        const L = 2 + sp * 26;
        for (let i = 0; i < N; i++) {
          let z = zArr[i];
          if (z > hi) z -= WARP_SPAN * Math.ceil((z - hi) / WARP_SPAN);
          else if (z < lo) z += WARP_SPAN * Math.ceil((lo - z) / WARP_SPAN);
          zArr[i] = z;
          _p.set(camX + ox[i], camY + oy[i], z);
          _s.set(1, widths[i], L * lenF[i]);
          _m4.compose(_p, quats[i], _s);
          mesh.setMatrixAt(i, _m4);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }
    }

    /* asteroids — round-robin tumble (AST_STEP per frame) */
    {
      const { mesh, positions, scales, speeds, axes, quats, N } = asteroids;
      const mult = N / AST_STEP; // compensate for skipped frames
      const start = astCursor.current;
      for (let k = 0; k < AST_STEP; k++) {
        const i = (start + k) % N;
        _dq.setFromAxisAngle(axes[i], speeds[i] * dt * mult);
        quats[i].premultiply(_dq);
        _p.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        _s.setScalar(scales[i]);
        _m4.compose(_p, quats[i], _s);
        mesh.setMatrixAt(i, _m4);
      }
      astCursor.current = (start + AST_STEP) % N;
      mesh.instanceMatrix.needsUpdate = true;
    }

    /* hero title — dissolve on launch, pointer parallax */
    {
      const fade = 1 - THREE.MathUtils.smoothstep(p, 0.055, 0.13);
      const tg = titleGroup.current;
      if (tg) {
        tg.visible = fade > 0.004;
        if (tg.visible) {
          title.mainMat.opacity = fade;
          title.ghostMat.opacity = 0.22 * fade;
          tg.position.x = THREE.MathUtils.damp(
            tg.position.x,
            state.pointer.x * 0.3,
            3.2,
            dt
          );
          tg.position.y = THREE.MathUtils.damp(
            tg.position.y,
            state.pointer.y * 0.3,
            3.2,
            dt
          );
        }
      }
    }
  });

  return (
    <group>
      {/* Infinity layer: nebula skybox + far starfields, follow the camera */}
      <group ref={envGroup}>
        <mesh geometry={sky.geo} material={sky.mat} renderOrder={-1} />
        <Stars radius={170} depth={60} count={4000} factor={3} saturation={0} fade speed={0.4} />
        <Stars radius={300} depth={60} count={2500} factor={5} saturation={0} fade speed={0.4} />
      </group>

      {/* Comet streaks / warp lines / asteroid fields */}
      <primitive object={comets.mesh} />
      <primitive object={warp.mesh} />
      <primitive object={asteroids.mesh} />

      {/* Hero title in 3D — the rocket occludes it like the video */}
      <group ref={titleGroup}>
        <mesh
          position={[0, 0.72, -4.6]}
          scale={[11.5, 11.5 / title.aspect, 1]}
          geometry={titleGeo}
          material={title.mainMat}
          renderOrder={2}
        />
        <mesh
          position={[0.55, 1.05, -8.5]}
          scale={[13.5, 13.5 / title.aspect, 1]}
          geometry={titleGeo}
          material={title.ghostMat}
          renderOrder={1}
        />
      </group>

      {/* Ambient sparkle clusters */}
      <Sparkles
        count={60}
        scale={[14, 8, 6]}
        position={[0, 0, -2]}
        size={2.5}
        speed={0.3}
        color="#7df9ff"
      />
      <Sparkles
        count={80}
        scale={[24, 12, 30]}
        position={[SKILLS_CENTER.x, SKILLS_CENTER.y, SKILLS_CENTER.z]}
        size={3}
        speed={0.3}
        color="#a78bfa"
      />
    </group>
  );
}
