"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrogLevel } from "@/lib/frogLevelsData";

interface ThreeFrogViewportProps {
  level: FrogLevel;
  userCss: string;
  isVictory: boolean;
}

// Convert any valid CSS color string (hex, named, rgb, hsl) to THREE.Color hex number
function parseCssColorToHex(colorStr: string): number | null {
  if (!colorStr) return null;
  const cleaned = colorStr.trim().toLowerCase();

  // Create temporary element to let browser parse any CSS color format
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = cleaned;
  const computed = ctx.fillStyle; // returns #rrggbb or rgba

  if (computed.startsWith("#")) {
    return parseInt(computed.replace("#", "0x"), 16);
  }
  return null;
}

// Extract CSS properties from user code string
function parseCssRules(cssText: string): Record<string, string> {
  const styles: Record<string, string> = {};
  try {
    const frogBlockMatch = cssText.match(/\.frog\s*\{([^}]+)\}/i);
    const contentToParse = frogBlockMatch ? frogBlockMatch[1] : cssText;

    const rules = contentToParse.split(";");
    for (const rule of rules) {
      const parts = rule.split(":");
      if (parts.length >= 2) {
        const prop = parts[0].trim().toLowerCase();
        const val = parts.slice(1).join(":").trim().toLowerCase();
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

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const userFrogGroupRef = useRef<THREE.Group | null>(null);
  const targetFrogGroupRef = useRef<THREE.Group | null>(null);
  const userFrogMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const targetFrogMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const outlineMeshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Helper to build 3D Frog Mesh Group
  const createFrogMeshGroup = (isGhost = false, defaultColor = 0x52525b) => {
    const group = new THREE.Group();

    const frogMat = new THREE.MeshStandardMaterial({
      color: defaultColor,
      roughness: isGhost ? 0.8 : 0.3,
      metalness: isGhost ? 0.0 : 0.1,
      transparent: true,
      opacity: isGhost ? 0.45 : 1.0,
      wireframe: isGhost,
    });

    // Body
    const bodyGeo = new THREE.SphereGeometry(0.85, 24, 20);
    bodyGeo.scale(1, 0.7, 1);
    const bodyMesh = new THREE.Mesh(bodyGeo, frogMat);
    bodyMesh.position.y = 0.6;
    group.add(bodyMesh);

    // Eyes
    const eyeMat = new THREE.MeshBasicMaterial({
      color: isGhost ? 0x10b981 : 0xffffff,
      transparent: isGhost,
      opacity: isGhost ? 0.6 : 1.0,
    });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const eyeGeo = new THREE.SphereGeometry(0.22, 16, 16);
    const pupilGeo = new THREE.SphereGeometry(0.1, 16, 16);

    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.35, 1.1, 0.35);
    group.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.35, 1.1, 0.35);
    group.add(eyeR);

    if (!isGhost) {
      const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
      pupilL.position.set(-0.35, 1.1, 0.53);
      group.add(pupilL);

      const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
      pupilR.position.set(0.35, 1.1, 0.53);
      group.add(pupilR);
    }

    // Legs
    const legGeo = new THREE.SphereGeometry(0.38, 16, 16);
    legGeo.scale(1.3, 0.4, 0.7);
    const legL = new THREE.Mesh(legGeo, frogMat);
    legL.position.set(-0.75, 0.3, -0.1);
    const legR = new THREE.Mesh(legGeo, frogMat);
    legR.position.set(0.75, 0.3, -0.1);
    group.add(legL, legR);

    return { group, material: frogMat };
  };

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!mountRef.current) return;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 300;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x09090b); // zinc-950
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      camera.position.set(0, 5.5, 7.5);
      camera.lookAt(0, 0.2, 0);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0x10b981, 1.3);
      dirLight.position.set(4, 8, 5);
      scene.add(dirLight);

      // Lily Pad Base
      const pondGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.15, 32);
      const pondMat = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.8,
      });
      const pondMesh = new THREE.Mesh(pondGeo, pondMat);
      pondMesh.position.set(0, -0.08, 0);
      scene.add(pondMesh);

      // Target Pad Ring
      const ringGeo = new THREE.RingGeometry(1.6, 1.8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const targetRing = new THREE.Mesh(ringGeo, ringMat);
      targetRing.rotation.x = Math.PI / 2;
      targetRing.position.y = 0.01;
      scene.add(targetRing);

      // 1. Target Ghost Frog (Shows the target state)
      const targetData = createFrogMeshGroup(true, 0x10b981);
      targetFrogGroupRef.current = targetData.group;
      targetFrogMatRef.current = targetData.material;
      targetData.group.position.set(0, 0, 0);
      scene.add(targetData.group);

      // 2. User 3D Frog (Starts as neutral gray 0x52525b)
      const userData = createFrogMeshGroup(false, 0x52525b);
      userFrogGroupRef.current = userData.group;
      userFrogMatRef.current = userData.material;
      userData.group.position.set(0, 0, 0);
      scene.add(userData.group);

      // Outline Mesh (for border property)
      const outlineGeo = new THREE.SphereGeometry(0.9, 24, 20);
      outlineGeo.scale(1, 0.7, 1);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.BackSide,
        visible: false,
      });
      const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
      outlineMesh.position.y = 0.6;
      outlineMeshRef.current = outlineMesh;
      userData.group.add(outlineMesh);

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      rendererRef.current = renderer;

      container.appendChild(renderer.domElement);

      // Animation Loop
      let clock = new THREE.Clock();
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        if (userFrogGroupRef.current) {
          if (isVictory) {
            // Victory 3D spin & hop animation!
            userFrogGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 6)) * 1.2;
            userFrogGroupRef.current.rotation.y += 0.08;
          } else {
            // Gentle idle float
            userFrogGroupRef.current.position.y = Math.sin(elapsedTime * 2.5) * 0.03;
          }
        }

        if (targetFrogGroupRef.current) {
          targetFrogGroupRef.current.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
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

  // Update Target Ghost Frog properties based on level level.targetFrogStyle
  useEffect(() => {
    if (!targetFrogMatRef.current || !targetFrogGroupRef.current) return;

    if (level.targetFrogStyle) {
      const targetColorStr =
        level.targetFrogStyle.backgroundColor || level.targetFrogStyle.color;
      if (targetColorStr) {
        const hex = parseCssColorToHex(targetColorStr);
        if (hex !== null) targetFrogMatRef.current.color.setHex(hex);
      }
      if (level.targetFrogStyle.opacity) {
        targetFrogMatRef.current.opacity = parseFloat(level.targetFrogStyle.opacity) * 0.5;
      }
    }
  }, [level]);

  // Dynamically apply user CSS directly to User 3D Frog on EVERY KEYSTROKE!
  useEffect(() => {
    if (!userFrogMatRef.current || !userFrogGroupRef.current) return;

    const parsed = parseCssRules(userCss);

    // 1. Color / Background-Color
    const colorStr = parsed["background-color"] || parsed["color"] || parsed["background"];
    if (colorStr) {
      const parsedHex = parseCssColorToHex(colorStr);
      if (parsedHex !== null) {
        userFrogMatRef.current.color.setHex(parsedHex);
      }
    } else {
      // Default initial neutral gray state if no color property written yet
      userFrogMatRef.current.color.setHex(0x52525b); // zinc-600
    }

    // 2. Opacity
    if (parsed["opacity"]) {
      const op = parseFloat(parsed["opacity"]);
      if (!isNaN(op)) {
        userFrogMatRef.current.opacity = Math.max(0.1, Math.min(1.0, op));
      }
    } else {
      userFrogMatRef.current.opacity = 1.0;
    }

    // 3. Border
    if (parsed["border"] || parsed["outline"]) {
      if (outlineMeshRef.current) {
        outlineMeshRef.current.visible = true;
        const bVal = parsed["border"] || parsed["outline"] || "";
        const bColor = parseCssColorToHex(bVal) || 0xef4444;
        (outlineMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(bColor);
        (outlineMeshRef.current.material as THREE.MeshBasicMaterial).wireframe = bVal.includes("dashed");
      }
    } else if (outlineMeshRef.current) {
      outlineMeshRef.current.visible = false;
    }

    // 4. Scale
    if (parsed["scale"]) {
      const s = parseFloat(parsed["scale"]);
      if (!isNaN(s)) userFrogGroupRef.current.scale.set(s, s, s);
    } else if (parsed["transform"] && parsed["transform"].includes("scale")) {
      const scaleMatch = parsed["transform"].match(/scale\(([^)]+)\)/);
      if (scaleMatch) {
        const s = parseFloat(scaleMatch[1]);
        if (!isNaN(s)) userFrogGroupRef.current.scale.set(s, s, s);
      }
    } else {
      userFrogGroupRef.current.scale.set(1, 1, 1);
    }

    // 5. Rotation
    if (parsed["transform"] && parsed["transform"].includes("rotate")) {
      const rotMatch = parsed["transform"].match(/rotate\(([^)]+)deg\)/);
      if (rotMatch) {
        const deg = parseFloat(rotMatch[1]);
        if (!isNaN(deg)) userFrogGroupRef.current.rotation.y = (deg * Math.PI) / 180;
      }
    } else {
      userFrogGroupRef.current.rotation.y = 0;
    }

    // 6. Positioning / Flex Align
    if (parsed["justify-content"] || parsed["align-items"]) {
      const justify = parsed["justify-content"];
      if (justify === "flex-end" || justify === "right") userFrogGroupRef.current.position.x = 1.2;
      else if (justify === "center") userFrogGroupRef.current.position.x = 0;
      else if (justify === "flex-start" || justify === "left") userFrogGroupRef.current.position.x = -1.2;
    } else {
      userFrogGroupRef.current.position.x = 0;
    }
  }, [userCss, level]);

  return (
    <div className="w-full h-full min-h-[260px] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-2 shadow-2xl">
      {/* Target Description Overlay */}
      <div className="absolute top-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-400 border border-zinc-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Target: <span className="font-bold text-white">{level.targetDescription}</span>
      </div>

      {/* Legend Indicator */}
      <div className="absolute bottom-3 right-3 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-1 rounded-xl text-[9px] font-mono text-zinc-400 border border-zinc-800 flex items-center gap-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-500" /> Your 3D Frog</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500/50 border border-emerald-400" /> Target Ghost</span>
      </div>

      {/* WebGL 3D Canvas */}
      <div ref={mountRef} className="w-full h-full min-h-[240px] relative z-0" />

      {/* Fallback mode */}
      {!webGlSupported && (
        <div className="relative z-10 w-full h-full min-h-[240px] bg-zinc-900 rounded-xl flex items-center justify-center">
          <div
            className="frog w-24 h-24 bg-emerald-500 text-white rounded-xl flex flex-col items-center justify-center font-bold text-xs shadow-lg transition-all"
            style={{ ...level.targetFrogStyle }}
          >
            🐸 .frog
          </div>
        </div>
      )}
    </div>
  );
};
