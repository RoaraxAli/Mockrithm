"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrogLevel } from "@/lib/frogLevelsData";

interface ThreeFrogViewportProps {
  level: FrogLevel;
  userCss: string;
  isVictory: boolean;
}

export const ThreeFrogViewport: React.FC<ThreeFrogViewportProps> = ({
  level,
  userCss,
  isVictory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frogGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 500;
      const height = container.clientHeight || 400;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a192f); // Dark pond night background
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 8, 12);
      camera.lookAt(0, 0, 0);

      // 2. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x2ecc71, 1.2);
      dirLight.position.set(5, 12, 7);
      scene.add(dirLight);

      const pointLight = new THREE.PointLight(0x3498db, 1, 20);
      pointLight.position.set(-5, 5, -5);
      scene.add(pointLight);

      // 3. Water Pond Base
      const pondGeo = new THREE.CylinderGeometry(6, 6, 0.4, 32);
      const pondMat = new THREE.MeshPhongMaterial({
        color: 0x1b4965,
        transparent: true,
        opacity: 0.85,
        shininess: 90,
      });
      const pondMesh = new THREE.Mesh(pondGeo, pondMat);
      pondMesh.position.set(0, -0.2, 0);
      scene.add(pondMesh);

      // Water Ripple Ring
      const ringGeo = new THREE.RingGeometry(4.5, 5.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x62b6cb,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.y = 0.01;
      scene.add(ringMesh);

      // 4. Procedural 3D Frog Mesh Group
      const frogGroup = new THREE.Group();
      frogGroupRef.current = frogGroup;

      // Frog Body
      const bodyGeo = new THREE.SphereGeometry(1.2, 32, 24);
      bodyGeo.scale(1, 0.75, 1.1);
      const frogMat = new THREE.MeshStandardMaterial({
        color: 0x2ecc71,
        roughness: 0.3,
        metalness: 0.1,
      });
      const bodyMesh = new THREE.Mesh(bodyGeo, frogMat);
      bodyMesh.position.y = 0.9;
      frogGroup.add(bodyMesh);

      // Eyes Left & Right
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eyeGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const pupilGeo = new THREE.SphereGeometry(0.18, 16, 16);

      // Left Eye
      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.5, 1.6, 0.4);
      const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
      pupilL.position.set(-0.5, 1.6, 0.7);
      frogGroup.add(eyeL, pupilL);

      // Right Eye
      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.5, 1.6, 0.4);
      const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
      pupilR.position.set(0.5, 1.6, 0.7);
      frogGroup.add(eyeR, pupilR);

      // Legs Left & Right
      const legGeo = new THREE.SphereGeometry(0.5, 16, 16);
      legGeo.scale(1.4, 0.5, 0.8);
      const legL = new THREE.Mesh(legGeo, frogMat);
      legL.position.set(-1.1, 0.4, -0.2);
      const legR = new THREE.Mesh(legGeo, frogMat);
      legR.position.set(1.1, 0.4, -0.2);
      frogGroup.add(legL, legR);

      // Lily Pad Base
      const lilyGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.1, 24);
      const lilyMat = new THREE.MeshStandardMaterial({ color: 0x27ae60 });
      const lilyPad = new THREE.Mesh(lilyGeo, lilyMat);
      lilyPad.position.set(0, 0.05, 0);
      frogGroup.add(lilyPad);

      scene.add(frogGroup);

      // 5. Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      // Clear container and append canvas
      container.appendChild(renderer.domElement);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Idle 3D breathing / floating motion
        if (frogGroupRef.current && !isVictory) {
          frogGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.1;
          ringMesh.scale.setScalar(1 + Math.sin(elapsedTime * 1.5) * 0.08);
        }

        // Victory celebration animation: Hop and spin!
        if (frogGroupRef.current && isVictory) {
          frogGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 6)) * 2;
          frogGroupRef.current.rotation.y += 0.08;
        }

        renderer.render(scene, camera);
        animFrameId.current = requestAnimationFrame(animate);
      };

      animate();

      // Handle Resize
      const handleResize = () => {
        if (!mountRef.current || !rendererRef.current) return;
        const w = mountRef.current.clientWidth;
        const h = mountRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
        if (rendererRef.current && rendererRef.current.domElement) {
          rendererRef.current.domElement.remove();
        }
      };
    } catch (err) {
      console.warn("WebGL initialization failed, falling back to 2D/3D CSS layer:", err);
      setWebGlSupported(false);
    }
  }, [isVictory]);

  return (
    <div className="relative w-full h-full min-h-[380px] bg-slate-950 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-2xl flex flex-col items-center justify-center p-4">
      {/* Dynamic Inject Style Tag for User CSS */}
      <style>{`
        #pond {
          transition: all 0.3s ease;
        }
        ${userCss}
      `}</style>

      {/* Background Three.js 3D WebGL Canvas */}
      {webGlSupported && (
        <div
          ref={mountRef}
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        />
      )}

      {/* Victory Sparkle Effects */}
      {isVictory && (
        <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="animate-bounce text-6xl">✨ 🐸 ✨</div>
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
        </div>
      )}

      {/* Target Preview Overlay Indicator */}
      <div className="absolute top-4 right-4 z-20 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        Live 3D Viewport Target: <span className="font-bold text-white">{level.targetDescription}</span>
      </div>

      {/* Interactive HTML/CSS Pond & Frog Layer */}
      <div className="relative z-10 w-full max-w-lg h-[300px] bg-emerald-950/40 rounded-xl border border-emerald-500/30 p-6 flex flex-col justify-between overflow-hidden shadow-inner">
        {/* Pond Water Ripple Grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2ecc71_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

        {/* Level Pond Container (#pond) */}
        <div
          id="pond"
          className="w-full h-full relative transition-all duration-300 flex items-center justify-center rounded-lg"
          style={level.targetPondStyle}
        >
          {/* Target Lily Pad outline */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-400/60 bg-emerald-500/10 flex items-center justify-center text-[10px] font-mono text-emerald-300/80 animate-pulse pointer-events-none">
            Target Pad 🎯
          </div>

          {/* Interactive User 3D Frog Element (.frog) */}
          <div
            className={`frog relative w-24 h-24 rounded-2xl bg-emerald-600 text-white font-bold flex flex-col items-center justify-center shadow-lg transition-all duration-300 border-2 border-emerald-400 select-none ${
              isVictory ? "animate-bounce ring-4 ring-emerald-400" : ""
            }`}
            style={{
              boxShadow: "0 10px 25px -5px rgba(46, 204, 113, 0.4)",
              ...level.targetFrogStyle,
            }}
          >
            {/* 3D Frog Face Graphic */}
            <div className="flex items-center gap-2 mb-1">
              <span className="w-3 h-3 rounded-full bg-white flex items-center justify-center text-[8px]">👀</span>
              <span className="w-3 h-3 rounded-full bg-white flex items-center justify-center text-[8px]">👀</span>
            </div>
            <span className="text-xs font-mono tracking-wider">.frog</span>
          </div>
        </div>
      </div>
    </div>
  );
};
