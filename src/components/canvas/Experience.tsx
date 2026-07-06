"use client";

import { Canvas } from "@react-three/fiber";
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

function SceneReady() {
  const setReady = useUIStore((s) => s.setReady);
  useEffect(() => {
    // First commit of the scene tree — release the loader next frame
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [setReady]);
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
