"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FrogLevel } from "@/lib/frogLevelsData";

interface ThreeFrogViewportProps {
  level: FrogLevel;
  userCss: string;
  isVictory: boolean;
}

// Convert any valid CSS color string to THREE.Color hex number
function parseCssColorToHex(colorStr: string): number | null {
  if (!colorStr) return null;
  const cleaned = colorStr.trim().toLowerCase();
  const ctx = document.createElement("canvas").getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = cleaned;
  const computed = ctx.fillStyle;
  if (computed.startsWith("#")) {
    return parseInt(computed.replace("#", "0x"), 16);
  }
  return null;
}

// Extract CSS properties from user code
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

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const frogGroupRef = useRef<THREE.Group | null>(null);
  const frogMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const outlineMeshRef = useRef<THREE.Mesh | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Build a Polished, Realistic 3D Frog Mesh Model
  const createBetterFrogMeshGroup = (defaultColor = 0x52525b) => {
    const group = new THREE.Group();

    // Glossy Frog Skin Material
    const frogMat = new THREE.MeshStandardMaterial({
      color: defaultColor,
      roughness: 0.2, // glossy skin
      metalness: 0.1,
      transparent: true,
      opacity: 1.0,
    });

    // 1. Head / Main Body (Smooth Tapered Ellipsoid)
    const bodyGeo = new THREE.SphereGeometry(1.0, 32, 24);
    bodyGeo.scale(1.1, 0.75, 1.2);
    const bodyMesh = new THREE.Mesh(bodyGeo, frogMat);
    bodyMesh.position.y = 0.65;
    group.add(bodyMesh);

    // 2. Eye Sockets & Expressive Eyes
    const socketGeo = new THREE.SphereGeometry(0.35, 20, 20);
    const eyeWhiteGeo = new THREE.SphereGeometry(0.24, 20, 20);
    const pupilGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const shineGeo = new THREE.SphereGeometry(0.04, 8, 8);

    const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Left Eye Socket & Eye
    const socketL = new THREE.Mesh(socketGeo, frogMat);
    socketL.position.set(-0.48, 1.15, 0.4);
    group.add(socketL);

    const eyeL = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeL.position.set(-0.48, 1.2, 0.52);
    group.add(eyeL);

    const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
    pupilL.position.set(-0.48, 1.2, 0.74);
    group.add(pupilL);

    const shineL = new THREE.Mesh(shineGeo, shineMat);
    shineL.position.set(-0.44, 1.24, 0.84);
    group.add(shineL);

    // Right Eye Socket & Eye
    const socketR = new THREE.Mesh(socketGeo, frogMat);
    socketR.position.set(0.48, 1.15, 0.4);
    group.add(socketR);

    const eyeR = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
    eyeR.position.set(0.48, 1.2, 0.52);
    group.add(eyeR);

    const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
    pupilR.position.set(0.48, 1.2, 0.74);
    group.add(pupilR);

    const shineR = new THREE.Mesh(shineGeo, shineMat);
    shineR.position.set(0.44, 1.24, 0.84);
    group.add(shineR);

    // 3. Cute Mouth Line
    const mouthGeo = new THREE.TorusGeometry(0.45, 0.025, 8, 24, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x27272a });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.rotation.x = Math.PI / 2;
    mouth.position.set(0, 0.62, 0.95);
    group.add(mouth);

    // 4. Front Legs & Webbed Feet
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

    // 5. Hind Thighs & Bent Back Legs
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

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
      camera.position.set(0, 4.8, 7.5);
      camera.lookAt(0, 0.4, 0);

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0x10b981, 1.4);
      mainLight.position.set(5, 10, 6);
      scene.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
      fillLight.position.set(-5, 4, -4);
      scene.add(fillLight);

      // Lily Pad Base
      const lilyPadGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.12, 36);
      const lilyPadMat = new THREE.MeshStandardMaterial({
        color: 0x15803d, // dark green lily pad
        roughness: 0.4,
      });
      const lilyPadMesh = new THREE.Mesh(lilyPadGeo, lilyPadMat);
      lilyPadMesh.position.set(0, -0.06, 0);
      scene.add(lilyPadMesh);

      // Water Ripple Ring around Lily Pad
      const ringGeo = new THREE.RingGeometry(2.85, 3.1, 36);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const waterRing = new THREE.Mesh(ringGeo, ringMat);
      waterRing.rotation.x = Math.PI / 2;
      waterRing.position.y = -0.05;
      scene.add(waterRing);

      // User 3D Frog (Polished 3D Model, NO net wireframe mesh!)
      const userData = createBetterFrogMeshGroup(0x52525b); // Neutral slate default
      frogGroupRef.current = userData.group;
      frogMatRef.current = userData.material;
      userData.group.position.set(0, 0, 0);
      scene.add(userData.group);

      // Outline Mesh (only for border property)
      const outlineGeo = new THREE.SphereGeometry(1.05, 24, 20);
      outlineGeo.scale(1.1, 0.75, 1.2);
      const outlineMat = new THREE.MeshBasicMaterial({
        color: 0xef4444,
        side: THREE.BackSide,
        visible: false,
      });
      const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
      outlineMesh.position.y = 0.65;
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

        if (frogGroupRef.current) {
          if (isVictory) {
            // Victory 3D spin & hop animation!
            frogGroupRef.current.position.y = Math.abs(Math.sin(elapsedTime * 6)) * 1.3;
            frogGroupRef.current.rotation.y += 0.08;
          } else {
            // Gentle idle breathing motion
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
  }, [isVictory]);

  // Dynamically apply user CSS directly to User 3D Frog on EVERY KEYSTROKE!
  useEffect(() => {
    if (!frogMatRef.current || !frogGroupRef.current) return;

    const parsed = parseCssRules(userCss);

    // 1. Color / Background-Color -> Directly updates 3D Frog Skin Color
    const colorStr = parsed["background-color"] || parsed["color"] || parsed["background"];
    if (colorStr) {
      const parsedHex = parseCssColorToHex(colorStr);
      if (parsedHex !== null) {
        frogMatRef.current.color.setHex(parsedHex);
      }
    } else {
      // Neutral slate default when no color property set yet
      frogMatRef.current.color.setHex(0x52525b);
    }

    // 2. Opacity -> Sets 3D Frog Material Opacity
    if (parsed["opacity"]) {
      const op = parseFloat(parsed["opacity"]);
      if (!isNaN(op)) {
        frogMatRef.current.opacity = Math.max(0.1, Math.min(1.0, op));
      }
    } else {
      frogMatRef.current.opacity = 1.0;
    }

    // 3. Border -> Enables outline mesh if requested
    if (parsed["border"] || parsed["outline"]) {
      if (outlineMeshRef.current) {
        outlineMeshRef.current.visible = true;
        const bVal = parsed["border"] || parsed["outline"] || "";
        const bColor = parseCssColorToHex(bVal) || 0xef4444;
        (outlineMeshRef.current.material as THREE.MeshBasicMaterial).color.setHex(bColor);
      }
    } else if (outlineMeshRef.current) {
      outlineMeshRef.current.visible = false;
    }

    // 4. Scale
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

    // 5. Rotation
    if (parsed["transform"] && parsed["transform"].includes("rotate")) {
      const rotMatch = parsed["transform"].match(/rotate\(([^)]+)deg\)/);
      if (rotMatch) {
        const deg = parseFloat(rotMatch[1]);
        if (!isNaN(deg)) frogGroupRef.current.rotation.y = (deg * Math.PI) / 180;
      }
    } else {
      frogGroupRef.current.rotation.y = 0;
    }

    // 6. Positioning / Flex Align
    if (parsed["justify-content"] || parsed["align-items"]) {
      const justify = parsed["justify-content"];
      if (justify === "flex-end" || justify === "right") frogGroupRef.current.position.x = 1.2;
      else if (justify === "center") frogGroupRef.current.position.x = 0;
      else if (justify === "flex-start" || justify === "left") frogGroupRef.current.position.x = -1.2;
    } else {
      userFrogGroupRef.current?.position.set(0, 0, 0);
    }
  }, [userCss, level]);

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
