"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrogLevel } from "@/lib/frogLevelsData";

interface ThreeFrogViewportProps {
  level: FrogLevel;
  userCss: string;
  isVictory: boolean;
}

// Convert any valid CSS color string to THREE.Color hex number safely
function parseCssColorToHex(colorStr: string): number | null {
  if (!colorStr) return null;
  if (typeof window === "undefined" || typeof document === "undefined") return null;

  try {
    const cleaned = colorStr.trim().toLowerCase();
    
    // First check direct tokens (e.g. from "4px solid white" -> check "white")
    const tokens = cleaned.split(/\s+/);
    for (const token of tokens) {
      if (token === "solid" || token === "dashed" || token === "dotted" || token.endsWith("px")) continue;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) continue;
      ctx.fillStyle = token;
      const computed = ctx.fillStyle;
      if (computed.startsWith("#")) {
        return parseInt(computed.replace("#", "0x"), 16);
      }
    }
  } catch (e) {
    /* ignore parsing error */
  }
  return null;
}

// Extract CSS properties grouped by selector (.frog vs #pond)
function parseCssSelectorRules(cssText: string): {
  frog: Record<string, string>;
  pond: Record<string, string>;
} {
  const result = { frog: {} as Record<string, string>, pond: {} as Record<string, string> };

  try {
    const frogBlockMatch = cssText.match(/\.frog\s*\{([^}]+)\}/i);
    if (frogBlockMatch) {
      const rules = frogBlockMatch[1].split(";");
      for (const rule of rules) {
        const parts = rule.split(":");
        if (parts.length >= 2) {
          result.frog[parts[0].trim().toLowerCase()] = parts.slice(1).join(":").trim().toLowerCase();
        }
      }
    } else {
      const rules = cssText.split(";");
      for (const rule of rules) {
        const parts = rule.split(":");
        if (parts.length >= 2) {
          result.frog[parts[0].trim().toLowerCase()] = parts.slice(1).join(":").trim().toLowerCase();
        }
      }
    }

    const pondBlockMatch = cssText.match(/#pond\s*\{([^}]+)\}/i);
    if (pondBlockMatch) {
      const rules = pondBlockMatch[1].split(";");
      for (const rule of rules) {
        const parts = rule.split(":");
        if (parts.length >= 2) {
          result.pond[parts[0].trim().toLowerCase()] = parts.slice(1).join(":").trim().toLowerCase();
        }
      }
    }
  } catch (e) {
    console.warn("CSS parsing error:", e);
  }

  return result;
}

export const ThreeFrogViewport: React.FC<ThreeFrogViewportProps> = ({
  level,
  userCss,
  isVictory,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frogGroupRef = useRef<THREE.Group | null>(null);
  const frogMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const eyeMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const pondMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const borderRingRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Build 3D Frog Mesh Group
  const createFrogMeshGroup = (defaultColor = 0x52525b) => {
    const group = new THREE.Group();

    // Glossy Frog Skin Material
    const frogMat = new THREE.MeshStandardMaterial({
      color: defaultColor,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 1.0,
    });

    // Body
    const bodyGeo = new THREE.SphereGeometry(1.0, 32, 24);
    bodyGeo.scale(1.1, 0.75, 1.2);
    const bodyMesh = new THREE.Mesh(bodyGeo, frogMat);
    bodyMesh.position.y = 0.65;
    group.add(bodyMesh);

    // Eye Sockets & Eye Whites
    const socketGeo = new THREE.SphereGeometry(0.35, 20, 20);
    const eyeWhiteGeo = new THREE.SphereGeometry(0.24, 20, 20);
    const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);

    const eyeWhiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });

    const socketL = new THREE.Mesh(socketGeo, frogMat);
    socketL.position.set(-0.48, 1.15, 0.4);
    group.add(socketL);

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.48, 1.2, 0.52);
    group.add(eyeL);

    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.48, 1.2, 0.74);
    group.add(pupilL);

    const socketR = new THREE.Mesh(socketGeo, frogMat);
    socketR.position.set(0.48, 1.15, 0.4);
    group.add(socketR);

    const eyeR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeR.position.set(0.48, 1.2, 0.52);
    group.add(eyeR);

    const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    pupilR.position.set(0.48, 1.2, 0.74);
    group.add(pupilR);

    // Mouth
    const mouthGeo = new THREE.TorusGeometry(0.45, 0.025, 8, 24, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x27272a });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.rotation.x = Math.PI / 2;
    mouth.position.set(0, 0.62, 0.95);
    group.add(mouth);

    // Legs
    const legFrontGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.55, 16);
    const footGeo = new THREE.ConeGeometry(0.28, 0.06, 16);
    footGeo.scale(1.2, 1, 1.5);

    const legFL = new THREE.Mesh(legFrontGeo, frogMat);
    legFL.position.set(-0.7, 0.35, 0.6);
    legFL.rotation.z = 0.25;
    const footFL = new THREE.Mesh(footGeo, frogMat);
    footFL.position.set(-0.8, 0.08, 0.8);
    group.add(legFL, footFL);

    const legFR = new THREE.Mesh(legFrontGeo, frogMat);
    legFR.position.set(0.7, 0.35, 0.6);
    legFR.rotation.z = -0.25;
    const footFR = new THREE.Mesh(footGeo, frogMat);
    footFR.position.set(0.8, 0.08, 0.8);
    group.add(legFR, footFR);

    const thighGeo = new THREE.SphereGeometry(0.48, 20, 20);
    thighGeo.scale(1.4, 0.6, 1.1);

    const thighL = new THREE.Mesh(thighGeo, frogMat);
    thighL.position.set(-0.95, 0.35, -0.3);
    thighL.rotation.z = 0.3;
    group.add(thighL);

    const thighR = new THREE.Mesh(thighGeo, frogMat);
    thighR.position.set(0.95, 0.35, -0.3);
    thighR.rotation.z = -0.3;
    group.add(thighR);

    return { group, material: frogMat, eyeMaterial: eyeWhiteMat };
  };

  // Initialize Three.js 3D Scene
  useEffect(() => {
    if (!mounted || !mountRef.current) return;

    try {
      const container = mountRef.current;
      const width = container.clientWidth || 400;
      const height = container.clientHeight || 300;

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x09090b);
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 4.8, 7.5);
      camera.lookAt(0, 0.4, 0);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0x10b981, 1.4);
      mainLight.position.set(5, 10, 6);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
      fillLight.position.set(-5, 4, -4);
      scene.add(fillLight);

      // Lily Pad Base (#pond)
      const lilyPadGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.12, 36);
      const lilyPadMat = new THREE.MeshStandardMaterial({
        color: 0x15803d, // default dark green
        roughness: 0.4,
      });
      pondMatRef.current = lilyPadMat;
      const lilyPadMesh = new THREE.Mesh(lilyPadGeo, lilyPadMat);
      lilyPadMesh.position.set(0, -0.06, 0);
      scene.add(lilyPadMesh);

      // User 3D Frog
      const userData = createFrogMeshGroup(0x52525b); // Neutral slate default
      frogGroupRef.current = userData.group;
      frogMatRef.current = userData.material;
      eyeMatRef.current = userData.eyeMaterial;
      userData.group.position.set(0, 0, 0);
      scene.add(userData.group);

      // Highly Visible 3D Border Aura Ring around Frog (Reacts to `border`)
      const borderGeo = new THREE.TorusGeometry(1.65, 0.12, 16, 48);
      const borderMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        visible: false,
      });
      const borderRing = new THREE.Mesh(borderGeo, borderMat);
      borderRing.rotation.x = Math.PI / 2;
      borderRing.position.y = 0.2; // Slightly raised off pad for maximum visibility!
      borderRingRef.current = borderRing;
      userData.group.add(borderRing);

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

        if (frogGroupRef.current) {
          if (isVictory) {
            frogGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 6)) * 1.3;
            frogGroupRef.current.rotation.y += 0.08;
          } else {
            frogGroupRef.current.position.y = Math.sin(elapsedTime * 2.5) * 0.03;
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
  }, [mounted, isVictory]);

  // Dynamically apply user CSS directly on EVERY KEYSTROKE!
  useEffect(() => {
    if (!mounted || !frogMatRef.current || !frogGroupRef.current) return;

    const parsed = parseCssSelectorRules(userCss);

    // 1. .frog background-color -> 3D Frog Skin Color
    if (parsed.frog["background-color"] || parsed.frog["background"]) {
      const colorVal = parsed.frog["background-color"] || parsed.frog["background"];
      const hex = parseCssColorToHex(colorVal);
      if (hex !== null) frogMatRef.current.color.setHex(hex);
    } else {
      frogMatRef.current.color.setHex(0x52525b); // default slate
    }

    // 2. .frog color -> 3D Frog Eye / Details Color
    if (parsed.frog["color"] && eyeMatRef.current) {
      const hex = parseCssColorToHex(parsed.frog["color"]);
      if (hex !== null) eyeMatRef.current.color.setHex(hex);
    } else if (eyeMatRef.current) {
      eyeMatRef.current.color.setHex(0xffffff); // default white eyes
    }

    // 3. #pond background-color -> 3D Lily Pad Pond Base Color
    if (parsed.pond["background-color"] || parsed.pond["background"]) {
      const pondColorVal = parsed.pond["background-color"] || parsed.pond["background"];
      const hex = parseCssColorToHex(pondColorVal);
      if (hex !== null && pondMatRef.current) {
        pondMatRef.current.color.setHex(hex);
      }
    } else if (pondMatRef.current) {
      pondMatRef.current.color.setHex(0x15803d); // default dark green
    }

    // 4. .frog opacity
    if (parsed.frog["opacity"]) {
      const op = parseFloat(parsed.frog["opacity"]);
      if (!isNaN(op)) frogMatRef.current.opacity = Math.max(0.1, Math.min(1.0, op));
    } else {
      frogMatRef.current.opacity = 1.0;
    }

    // 5. .frog border -> Highly Visible 3D Border Ring!
    if (parsed.frog["border"] || parsed.frog["outline"]) {
      if (borderRingRef.current) {
        borderRingRef.current.visible = true;
        const bVal = parsed.frog["border"] || parsed.frog["outline"] || "";
        const bColor = parseCssColorToHex(bVal) || 0xffffff;
        (borderRingRef.current.material as THREE.MeshBasicMaterial).color.setHex(bColor);

        // Adjust thickness based on px width
        const widthMatch = bVal.match(/(\d+)px/);
        if (widthMatch) {
          const px = parseInt(widthMatch[1], 10);
          const scaleFactor = 1 + (px * 0.08);
          borderRingRef.current.scale.set(scaleFactor, scaleFactor, scaleFactor);
        } else {
          borderRingRef.current.scale.set(1.1, 1.1, 1.1);
        }
      }
    } else if (borderRingRef.current) {
      borderRingRef.current.visible = false;
    }

    // 6. .frog scale
    if (parsed.frog["scale"]) {
      const s = parseFloat(parsed.frog["scale"]);
      if (!isNaN(s)) frogGroupRef.current.scale.set(s, s, s);
    } else if (parsed.frog["transform"] && parsed.frog["transform"].includes("scale")) {
      const scaleMatch = parsed.frog["transform"].match(/scale\(([^)]+)\)/);
      if (scaleMatch) {
        const s = parseFloat(scaleMatch[1]);
        if (!isNaN(s)) frogGroupRef.current.scale.set(s, s, s);
      }
    } else if (parsed.frog["width"] || parsed.frog["height"]) {
      const wPx = parseInt(parsed.frog["width"] || "100", 10);
      const scaleW = Math.max(0.5, Math.min(2.0, wPx / 100));
      frogGroupRef.current.scale.set(scaleW, scaleW, scaleW);
    } else {
      frogGroupRef.current.scale.set(1, 1, 1);
    }

    // 7. .frog rotation
    if (parsed.frog["transform"] && parsed.frog["transform"].includes("rotate")) {
      const rotMatch = parsed.frog["transform"].match(/rotate\(([^)]+)deg\)/);
      if (rotMatch) {
        const deg = parseFloat(rotMatch[1]);
        if (!isNaN(deg)) frogGroupRef.current.rotation.y = (deg * Math.PI) / 180;
      }
    } else {
      frogGroupRef.current.rotation.y = 0;
    }

    // 8. #pond flex positioning
    if (parsed.pond["justify-content"] || parsed.pond["align-items"]) {
      const justify = parsed.pond["justify-content"];
      if (justify === "flex-end" || justify === "right") frogGroupRef.current.position.x = 1.3;
      else if (justify === "center") frogGroupRef.current.position.x = 0;
      else if (justify === "flex-start" || justify === "left") frogGroupRef.current.position.x = -1.3;
    } else {
      frogGroupRef.current.position.set(0, 0, 0);
    }
  }, [mounted, userCss, level]);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[260px] bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-center font-mono text-xs text-zinc-600">
        Initializing 3D Viewport...
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[260px] bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center p-2 shadow-2xl">
      {/* Target Description Overlay Header */}
      <div className="absolute top-3 left-3 z-10 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono text-zinc-400 border border-zinc-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        Target: <span className="font-bold text-white">{level.targetDescription}</span>
      </div>

      {/* WebGL 3D Viewport Canvas */}
      <div ref={mountRef} className="w-full h-full min-h-[240px] relative z-0" />

      {/* Fallback Mode */}
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
