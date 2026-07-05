"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Custom vertex shader for morphing noise deformation + scroll-linked explosion displacement
const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uExplosionForce;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying float vNoise;

  // Simplex 3D Noise Generator
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0 );
      vec4 p = permute( permute( permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                      dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;

      // Calculate organic noise deformation
      float noiseFreq = 0.8;
      float noiseSpeed = 0.6;
      float noiseVal = snoise(position * noiseFreq + uTime * noiseSpeed);
      vNoise = noiseVal;

      // Base noise deformation + scroll-linked explosion force (melting out)
      vec3 displacedPos = position + normal * (noiseVal * 0.22 + uExplosionForce * 1.8);

      vec4 mvPosition = modelViewMatrix * vec4(displacedPos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 4.0;
  }
`;

// Custom fragment shader for edge glow (fresnel) and scrolling fade
const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec2 vUv;
  varying float vNoise;

  void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel edge lighting with a stronger glow
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);

      // Cinematic monochrome colors
      vec3 edgeColor = vec3(1.2, 1.2, 1.2); // Over-bright edges for glow effect
      vec3 baseColor = vec3(0.02, 0.02, 0.02); // Deeper black core

      vec3 finalColor = mix(baseColor, edgeColor, fresnel * 1.4);

      // Add a subtle noise-based inner glow
      if (vNoise > 0.0) {
          finalColor += vec3(0.12) * vNoise;
      }

      // Fade out centerpiece completely during transition
      float alpha = clamp(1.0 - uScrollProgress, 0.0, 1.0);

      gl_FragColor = vec4(finalColor, alpha * 0.85);
  }
`;

export default function AwwwardsCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. THREE.JS SCENE SETUP
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false, // Turn off antialiasing for maximum GPU efficiency
      alpha: true,
      powerPreference: "high-performance",
    });
    const startW = window.innerWidth;
    const startH = window.innerHeight;

    renderer.setSize(startW, startH);
    // Cap pixel ratio at 1.0 for lag-free performance on lower-end devices
    renderer.setPixelRatio(1.0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, startW / startH, 0.1, 120);
    camera.position.z = 7;

    // 2. HERO morphing centerpiece: cybernetic holographic globe
    const centerpieceGeometry = new THREE.SphereGeometry(1.4, 18, 18);
    const centerpieceMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uScrollProgress: { value: 0.0 },
        uExplosionForce: { value: 0.0 },
      },
      transparent: true,
      depthWrite: true,
      blending: THREE.NormalBlending,
      wireframe: true,
    });

    const centerpieceMesh = new THREE.Mesh(centerpieceGeometry, centerpieceMaterial);
    scene.add(centerpieceMesh);

    const centerpiecePoints = new THREE.Points(centerpieceGeometry, centerpieceMaterial);
    scene.add(centerpiecePoints);

    // Set count to 1000 on desktop, 350 on mobile to balance aesthetics and speed
    const particleCount = isMobile ? 350 : 1000;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.5 + Math.pow(Math.random(), 2.0) * 12.0;

      particlePositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      particlePositions[i * 3 + 2] = Math.cos(phi) * radius;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const createParticleTexture = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 16;
      pCanvas.height = 16;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.22,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. MOUSE POSITION PARALLAX SETUP
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const mx = (e.clientX / window.innerWidth) * 2 - 1;
      const my = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = mx * 2.0;
      mouse.targetY = my * 1.5;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. ANIMATION TICK LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Calculate showcase element progress for flight
      const showcaseElement = document.getElementById("features");
      let showcaseProgress = 0;
      if (showcaseElement) {
        const rect = showcaseElement.getBoundingClientRect();
        const startOffset = window.innerHeight;
        const totalDist = rect.height + startOffset;
        const currentDist = startOffset - rect.top;
        showcaseProgress = Math.max(0, Math.min(1, currentDist / totalDist));
      }

      const heroScrollProgress = Math.max(0, Math.min(1, window.scrollY / window.innerHeight));
      const featureOneProgress = Math.max(0, Math.min(1, showcaseProgress / 0.2));

      let explosionProgress = 0;
      if (showcaseProgress > 0) {
        explosionProgress = 0.5 + featureOneProgress * 0.5;
      } else {
        explosionProgress = heroScrollProgress * 0.5;
      }

      // Update centerpiece uniforms
      centerpieceMaterial.uniforms.uTime.value = elapsedTime;
      centerpieceMaterial.uniforms.uScrollProgress.value = explosionProgress;

      let explosionForce = 0;
      if (explosionProgress > 0.0) {
        explosionForce = explosionProgress * 30.0;
      }
      centerpieceMaterial.uniforms.uExplosionForce.value = explosionForce;

      // Rotate centerpiece autonomously
      centerpieceMesh.rotation.y = elapsedTime * 0.08;
      centerpieceMesh.rotation.z = elapsedTime * 0.04;
      if (centerpiecePoints) {
        centerpiecePoints.rotation.y = centerpieceMesh.rotation.y;
        centerpiecePoints.rotation.z = centerpieceMesh.rotation.z;
      }

      // Parallax mouse follow for centerpiece
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      centerpieceMesh.position.x = mouse.x * 0.35;
      centerpieceMesh.position.y = mouse.y * 0.35;
      if (centerpiecePoints) {
        centerpiecePoints.position.x = centerpieceMesh.position.x;
        centerpiecePoints.position.y = centerpieceMesh.position.y;
      }

      // Move camera Z along gallery line based on showcaseProgress
      const targetCameraZ = 7 - showcaseProgress * 52;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.08;

      // Camera subtle parallax on mouse move
      camera.position.x = mouse.x * 0.15;
      camera.position.y = mouse.y * 0.15;

      // Rotate background particles globally (No expensive per-particle math or buffer re-uploads!)
      particles.rotation.y = elapsedTime * 0.015;
      particles.rotation.z = elapsedTime * 0.005;

      // Animate background particles moving upward as we scroll back to Hero
      particles.position.y = -explosionProgress * 18.0;

      // Fade out background particles based on progress
      const particleAlpha = Math.max(0, Math.min(0.85, 0.85 * (1 - explosionProgress)));
      particleMaterial.opacity = particleAlpha;

      // Visibility controls
      const isModelVisible = explosionProgress < 0.99;
      centerpieceMesh.visible = isModelVisible;
      if (centerpiecePoints) centerpiecePoints.visible = isModelVisible;
      particles.visible = isModelVisible;

      // Render the scene directly without post-processing bloom pass for 60fps performance
      renderer.render(scene, camera);

      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 6. RESIZE HANDLER
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      centerpieceGeometry.dispose();
      centerpieceMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none z-0 overflow-hidden bg-black"
      style={{ width: "100vw", height: "100vh" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-35"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
