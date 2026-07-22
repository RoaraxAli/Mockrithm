"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrogLevel } from "@/lib/frogLevelsData";

interface ThreeFrogViewportProps {
  level: FrogLevel;
  userCss: string;
  isVictory: boolean;
}

// Simple CSS property parser helper
function parseCssRules(cssText: string): Record<string, string> {
  const styles: Record<string, string> = {};
  try {
    // Extract contents inside .frog { ... } or general declarations
    const frogBlockMatch = cssText.match(/\.frog\s*\{([^}]+)\}/i);
    const contentToParse = frogBlockMatch ? frogBlockMatch[1] : cssText;

    const rules = contentToParse.split(";");
    for (const rule of rules) {
      const parts = rule.split(":");
      if (parts.length === 2) {
        const prop = parts[0].trim().toLowerCase();
        const val = parts[1].trim().toLowerCase();
        styles[prop] = val;
      }
    }
  } catch (e) {
    console.warn("CSS parsing error:", e);
  }
  return styles;
}

export const ThreeFrogViewport: React.FC<ThreeFrogViewportProps> = ({
  level,
  userCss,
  isVictory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  // Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frogGroupRef = useRef<THREE.Group | null>(null);
  const frogMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const outlineMeshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 240;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x09090b); // zinc-950
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 5, 8);
      camera.lookAt(0, 0.2, 0);

      // 2. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x10b981, 1.2);
      dirLight.position.set(4, 8, 5);
      scene.add(dirLight);

      // 3. Target Lily Pad Base (Pond)
      const pondGeo = new THREE.CylinderGeometry(2.5, 2.5, 0.15, 32);
      const pondMat = new THREE.MeshStandardMaterial({
        color: 0x18181b, // zinc-900
        roughness: 0.8,
      });
      const pondMesh = new THREE.Mesh(pondGeo, pondMat);
      pondMesh.position.set(0, -0.08, 0);
      scene.add(pondMesh);

      // Target Pad Outline Ring
      const targetRingGeo = new THREE.RingGeometry(1.6, 1.8, 32);
      const targetRingMat = new THREE.MeshBasicMaterial({
        color: 0x10b981, // emerald-500
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const targetRing = new THREE.Mesh(targetRingGeo, targetRingMat);
      targetRing.rotation.x = Math.PI / 2;
      targetRing.position.y = 0.01;
      scene.add(targetRing);

      // 4. Procedural 3D Frog Mesh Group
      const frogGroup = new THREE.Group();
      frogGroupRef.current = frogGroup;

      // Frog Material (Manipulated directly by user CSS!)
      const frogMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // default emerald-500
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 1.0,
      });
      frogMatRef.current = frogMat;

      // Frog Body
      const bodyGeo = new THREE.SphereGeometry(0.8, 24, 20);
      bodyGeo.scale(1, 0.7, 1);
      const bodyMesh = new THREE.Mesh(bodyGeo, frogMat);
      bodyMesh.position.y = 0.6;
      frogGroup.add(bodyMesh);

      // Outline Mesh (for border property)
      const outlineGeo = new THREE.SphereGeometry(0.85, 24, 20);
      outlineGeo.scale(1, 0.7, 1);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.BackSide,
        visible: false,
      });
      const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
      outlineMesh.position.y = 0.6;
      outlineMeshRef.current = outlineMesh;
      frogGroup.add(outlineMesh);

      // Eyes Left & Right
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const eyeGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const pupilGeo = new THREE.SphereGeometry(0.1, 16, 16);

      const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
      eyeL.position.set(-0.35, 1.1, 0.3);
      const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
      pupilL.position.set(-0.35, 1.1, 0.5);
      frogGroup.add(eyeL, pupilL);

      const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
      eyeR.position.set(0.35, 1.1, 0.3);
      const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
      pupilR.position.set(0.35, 1.1, 0.5);
      frogGroup.add(eyeR, pupilR);

      // Legs Left & Right
      const legGeo = new THREE.SphereGeometry(0.35, 16, 16);
      legGeo.scale(1.3, 0.4, 0.7);
      const legL = new THREE.Mesh(legGeo, frogMat);
      legL.position.set(-0.75, 0.3, -0.1);
      const legR = new THREE.Mesh(legGeo, frogMat);
      legR.position.set(0.75, 0.3, -0.1);
      frogGroup.add(legL, legR);

      scene.add(frogGroup);

      // 5. WebGL Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      container.appendChild(renderer.domElement);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        if (frogGroupRef.current) {
          if (isVictory) {
            // Hop & 360 Spin celebration!
            frogGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 6)) * 1.2;
            frogGroupRef.current.rotation.y += 0.08;
          } else {
            // Idle breathing motion
            frogGroupRef.current.position.y = Math.sin(elapsedTime * 2) * 0.04;
          }
        }

        renderer.render(scene, camera);
        animFrameId.current = requestAnimationFrame(animate);
      };

      animate();

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
    } catch (e) {
      console.warn("WebGL fallback initialized:", e);
      setWebGlSupported(false);
    }
  }, [isVictory]);

  // Dynamically apply user CSS directly to the 3D Frog Mesh!
  useEffect(() => {
    if (!frogMatRef.current || !frogGroupRef.current) return;

    const parsed = parseCssRules(userCss);

    // 1. Color / Background Color -> Directly sets 3D Frog Material Color
    const colorVal = parsed["background-color"] || parsed["color"] || parsed["background"];
    if (colorVal) {
      try {
        let hexColor = 0x10b981; // default
        if (colorVal.includes("green")) hexColor = 0x2ecc71;
        else if (colorVal.includes("blue") || colorVal.includes("3498db")) hexColor = 0x3498db;
        else if (colorVal.includes("red") || colorVal.includes("e74c3c")) hexColor = 0xe74c3c;
        else if (colorVal.includes("purple") || colorVal.includes("9b59b6")) hexColor = 0x9b59b6;
        else if (colorVal.includes("1abc9c") || colorVal.includes("teal")) hexColor = 0x1abc9c;
        else if (colorVal.startsWith("#")) {
          hexColor = parseInt(colorVal.replace("#", "0x"), 16);
        }
        if (!isNaN(hexColor)) {
          frogMatRef.current.color.setHex(hexColor);
        }
      } catch (e) {
        /* ignore invalid color formats */
      }
    } else if (level.targetFrogStyle?.backgroundColor || level.targetFrogStyle?.color) {
      const targetColor = level.targetFrogStyle.backgroundColor || level.targetFrogStyle.color;
      if (targetColor && targetColor.startsWith("#")) {
        frogMatRef.current.color.setHex(parseInt(targetColor.replace("#", "0x"), 16));
      }
    }

    // 2. Opacity -> Sets 3D Frog Material Opacity
    if (parsed["opacity"]) {
      const op = parseFloat(parsed["opacity"]);
      if (!isNaN(op)) {
        frogMatRef.current.opacity = Math.max(0.1, Math.min(1.0, op));
      }
    }

    // 3. Border -> Enables 3D Outline Mesh around the frog
    if (parsed["border"] || parsed["outline"]) {
      if (outlineMeshRef.current) {
        outlineMeshRef.current.visible = true;
        if ((parsed["border"] || "").includes("dashed")) {
          (outlineMeshRef.current.material as THREE.MeshBasicMaterial).wireframe = true;
        } else {
          (outlineMeshRef.current.material as THREE.MeshBasicMaterial).wireframe = false;
        }
      }
    } else if (outlineMeshRef.current) {
      outlineMeshRef.current.visible = false;
    }

    // 4. Scale / Transforms -> Directly transforms the 3D Frog Group in 3D Space
    if (parsed["scale"]) {
      const s = parseFloat(parsed["scale"]);
      if (!isNaN(s)) frogGroupRef.current.scale.set(s, s, s);
    } else if (parsed["transform"] && parsed["transform"].includes("scale")) {
      const scaleMatch = parsed["transform"].match(/scale\(([^)]+)\)/);
      if (scaleMatch) {
        const s = parseFloat(scaleMatch[1]);
        if (!isNaN(s)) frogGroupRef.current.scale.set(s, s, s);
      }
    } else {
      frogGroupRef.current.scale.set(1, 1, 1);
    }

    // 5. Rotation -> Rotates 3D Frog model
    if (parsed["transform"] && parsed["transform"].includes("rotate")) {
      const rotMatch = parsed["transform"].match(/rotate\(([^)]+)deg\)/);
      if (rotMatch) {
        const deg = parseFloat(rotMatch[1]);
        if (!isNaN(deg)) frogGroupRef.current.rotation.y = (deg * Math.PI) / 180;
      }
    }

    // 6. Positioning / Flex Alignment -> Translates 3D Frog model on X/Z plane
    if (parsed["justify-content"] || parsed["align-items"]) {
      const justify = parsed["justify-content"];
      if (justify === "flex-end" || justify === "right") frogGroupRef.current.position.x = 1.2;
      else if (justify === "center") frogGroupRef.current.position.x = 0;
      else if (justify === "flex-start" || justify === "left") frogGroupRef.current.position.x = -1.2;
    }
  }, [userCss, level]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-2 shadow-2xl">
      {/* Target Description Header */}
      <div className="absolute top-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-mono text-zinc-400 border border-zinc-800 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Target: <span className="font-bold text-white">{level.targetDescription}</span>
      </div>

      {/* WebGL 3D Viewport Canvas */}
      <div ref={mountRef} className="w-full h-[220px] relative z-0" />

      {/* Fallback 2D/3D CSS box if WebGL is unsupported */}
      {!webGlSupported && (
        <div className="relative z-10 w-full h-[180px] bg-zinc-900 rounded-xl flex items-center justify-center">
          <div
            className="frog w-20 h-20 bg-emerald-500 text-white rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all"
            style={{ ...level.targetFrogStyle }}
          >
            🐸 .frog
          </div>
        </div>
      )}
    </div>
  );
};
