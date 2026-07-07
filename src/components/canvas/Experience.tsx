"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import { useUIStore } from "@/lib/store";
import CameraRig from "./CameraRig";
import Rocket from "./Rocket";
import Planets from "./Planets";
import SpaceEnvironment from "./SpaceEnvironment";
import SkillCards from "./SkillCards";
import ProjectOrbit from "./ProjectOrbit";
import SetDressing from "./SetDressing";

/**
 * Primes the GPU behind the loading screen: compiles every shader program
 * and uploads every texture before the loader lifts. Without this, gated
 * objects (ISS, skill cards, project cards) compile/upload on the frame
 * they first appear — a visible hitch mid-scroll.
 */
function SceneReady() {
  const setReady = useUIStore((s) => s.setReady);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    let alive = true;

    const collectTextures = (mat: THREE.Material): THREE.Texture[] => {
      const out: THREE.Texture[] = [];
      for (const value of Object.values(mat)) {
        if ((value as THREE.Texture)?.isTexture) out.push(value as THREE.Texture);
      }
      const uniforms = (mat as THREE.ShaderMaterial).uniforms;
      if (uniforms) {
        for (const u of Object.values(uniforms)) {
          if ((u?.value as THREE.Texture)?.isTexture) out.push(u.value as THREE.Texture);
        }
      }
      return out;
    };

    const prime = async () => {
      try {
        await gl.compileAsync(scene, camera);
        scene.traverse((o) => {
          const mesh = o as THREE.Mesh;
          if (!mesh.isMesh && !(o as THREE.Sprite).isSprite) return;
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const mat of mats) {
            if (!mat) continue;
            for (const tex of collectTextures(mat)) gl.initTexture(tex);
          }
        });
      } catch {
        // Priming is best-effort — never block the site on it
      }
      if (alive) setReady(true);
    };

    prime();
    return () => {
      alive = false;
    };
  }, [gl, scene, camera, setReady]);

  return null;
}

export default function Experience() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.4, 10], fov: 45, near: 0.1, far: 400 }}
        onCreated={(state) => {
          state.scene.fog = new THREE.FogExp2("#0a0618", 0.0035);
          // Handle for console debugging / tests
          (window as unknown as { __r3f: typeof state }).__r3f = state;
          // Graceful recovery if the GPU drops the context (tab pressure,
          // driver reset): one clean reload restores the scene.
          state.gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              window.location.reload();
            },
            { once: true }
          );
        }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={["#050310"]} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[30, 20, 10]} intensity={1.1} color="#dfe8ff" />

          {/* Local HDRI for PBR reflections — no network fetch */}
          <Environment
            files="/hdri/dikhololo_night_1k.hdr"
            environmentIntensity={0.5}
          />

          <CameraRig />
          <SpaceEnvironment />
          <Rocket />
          <Planets />
          <SkillCards />
          <ProjectOrbit />
          <SetDressing />

          <EffectComposer>
            <Bloom
              intensity={0.95}
              luminanceThreshold={0.22}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration offset={[0.0004, 0.0004]} />
            <Vignette eskil={false} offset={0.18} darkness={0.82} />
          </EffectComposer>

          <SceneReady />
        </Suspense>
      </Canvas>
    </div>
  );
}
