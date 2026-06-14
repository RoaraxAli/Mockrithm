"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Cpu, Volume2, Check, Crown, Zap, BarChart3, Terminal, Calendar, Clock, User, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthRedirectUrl } from "@/lib/utils/auth";
import { getBlogs } from "@/lib/actions/admin.action";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
}

// Custom geometric section divider with shape changes at start/end and glowing node
const SectionDivider = () => (
  <div className="relative w-full flex items-center justify-center my-10 select-none">
    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent relative">
      {/* Starting shape - diamond */}
      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
      
      {/* Center glowing node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-zinc-600 border border-zinc-800 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
      
      {/* Ending shape - diamond */}
      <div className="absolute right-[15%] top-1/2 -translate-y-1/2 size-1.5 rotate-45 border border-zinc-700 bg-black" />
    </div>
  </div>
);

export default function MarketingLanding() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  // Fetch blogs dynamically for the resources section
  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await getBlogs();
        if (res.success && res.data) {
          setArticles(res.data as any[]);
        }
      } catch (err) {
        console.error("Failed to load blogs on landing page:", err);
      } finally {
        setLoadingBlogs(false);
      }
    }
    loadBlogs();
  }, []);

  // Master WebGL (Three.js Points Cloud) + Scroll Physics + GSAP Integration Hook
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // 1. THREE.JS SCENE SETUP
    const canvas = document.getElementById("gravity-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    // Custom GPU shaders for particle deformation, filament rendering, and white/grayscale light clumping
    const vertexShader = `
        uniform float uTime;
        uniform vec3 uMouse;
        uniform float uMouseRadius;
        uniform float uMouseStrength;
        uniform float uScrollDisplacement;
        
        varying vec3 vColor;
        varying float vDepth;

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
            vec3 pos = position;

            // GPU noise drift for organic clumping motion
            float driftFactor = snoise(pos * 0.8 + uTime * 0.1) * 0.45;
            pos += normal * driftFactor;

            // Mouse Proximity Magnetic Repulsion
            vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
            float distToTouch = distance(worldPos, uMouse);
            
            if (distToTouch < uMouseRadius) {
                float force = (uMouseRadius - distToTouch) / uMouseRadius;
                float smoothForce = smoothstep(0.0, 1.0, force) * uMouseStrength;
                
                vec3 deflectDir = normalize(worldPos - uMouse);
                vec3 swirlDir = vec3(-deflectDir.y, deflectDir.x, 0.0);
                
                pos += (deflectDir * 0.6 + swirlDir * 0.4) * smoothForce;
            }

            // Scroll linked cloud dispersion
            pos += normal * uScrollDisplacement * 3.5;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;

            // Size attenuation
            gl_PointSize = (18.0 / -mvPosition.z) * (1.0 + abs(driftFactor) * 0.5);
            vDepth = -mvPosition.z;

            // Pure premium white color palette
            vColor = vec3(1.0, 1.0, 1.0);
        }
    `;

    const fragmentShader = `
        varying vec3 vColor;
        varying float vDepth;

        void main() {
            vec2 centerDist = gl_PointCoord - vec2(0.5);
            float strength = 1.0 - (length(centerDist) * 2.0);
            strength = max(0.0, strength);
            strength = pow(strength, 1.8);

            if (strength < 0.01) discard;

            float fadeFactor = clamp((10.0 - vDepth) / 10.0, 0.2, 1.0);
            gl_FragColor = vec4(vColor, strength * fadeFactor * 1.0);
        }
    `;

    // 2. POINTS CLOUD GEOMETRY GENERATION
    const particleCount = 90000;
    const positions = new Float32Array(particleCount * 3);
    const normals = new Float32Array(particleCount * 3);

    function evaluateInitialNoise(x: number, y: number, z: number) {
      return Math.sin(x * 2.5) * Math.cos(y * 2.5) * Math.sin(z * 2.5);
    }

    let pIdx = 0;
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      let radius = 2.4 * Math.pow(Math.random(), 1.4);
      
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      const noiseVal = evaluateInitialNoise(x * radius, y * radius, z * radius);
      if (noiseVal > 0.1) {
        radius += noiseVal * 0.3;
      } else {
        radius -= Math.abs(noiseVal) * 0.25;
      }

      positions[pIdx] = x * radius;
      positions[pIdx + 1] = y * radius;
      positions[pIdx + 2] = z * radius;

      normals[pIdx] = x;
      normals[pIdx + 1] = y;
      normals[pIdx + 2] = z;

      pIdx += 3;
    }

    const bufferGeometry = new THREE.BufferGeometry();
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    bufferGeometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector3(-999, -999, -999) },
        uMouseRadius: { value: 2.2 },
        uMouseStrength: { value: 0.0 },
        uScrollDisplacement: { value: 0.0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    // Parent group to handle GSAP Scroll Trigger displacements
    const pointsCloudGroup = new THREE.Group();
    pointsCloudGroup.position.y = 0.55; // Base vertical offset to center in viewport
    scene.add(pointsCloudGroup);

    const pointsCloud = new THREE.Points(bufferGeometry, shaderMaterial);
    pointsCloud.scale.set(1.9, 1.5, 1.5); // Increased size to be 10% larger and wider
    pointsCloudGroup.add(pointsCloud);

    // 3. MOUSE TARGETS WITH SPRING PHYSICS LERP
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const introSection = document.getElementById("intro");
    
    let mousePhysics = {
      strength: 0.0,
      targetStrength: 0.0,
      velocity: 0.0,
      stiffness: 150,
      damping: 14
    };

    const uMouseTarget = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 0.15;
    const mouse2D = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      // Map coordinates to full screen dimensions
      mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse2D, camera);
      const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const targetPoint = new THREE.Vector3();
      
      if (raycaster.ray.intersectPlane(interactionPlane, targetPoint)) {
        uMouseTarget.copy(targetPoint);
        mousePhysics.targetStrength = 1.0;
        
        // Remove clamps completely to track cursor exactly to the edges
        mouse.targetX = targetPoint.x;
        mouse.targetY = targetPoint.y - 0.55;
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // 2. LENIS SCROLL SETUP
    const lenis = new Lenis({
      lerp: 0.038,
      wheelMultiplier: 0.52,
      touchMultiplier: 0.65,
      infinite: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis frame looping with GSAP
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // 3. GSAP SCROLL TRIGGERS FOR 3D DISPERSION
    gsap.to(pointsCloudGroup.position, {
      z: -4.5,
      y: -2.2,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
      }
    });

    gsap.to(pointsCloudGroup.rotation, {
      y: Math.PI * 1.3,
      x: Math.PI * 0.4,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      }
    });

    // Background decorative elements lag
    gsap.to(".spline-ribbon-1", {
      y: -120,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
      }
    });

    gsap.to(".spline-ribbon-2", {
      y: 120,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "bottom top",
        scrub: 2.2,
      }
    });

    gsap.to(".spline-ribbon-3", {
      y: -80,
      ease: "none",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "bottom top",
        scrub: 1.0,
      }
    });

    // Content fade/scale down
    gsap.to(".hero-content-anim", {
      opacity: 0,
      y: 100,
      scale: 0.93,
      ease: "power1.out",
      scrollTrigger: {
        trigger: "#intro",
        start: "top top",
        end: "80% top",
        scrub: 1.2,
      }
    });

    // Physics distortion for scrolling cards
    const cardElements = gsap.utils.toArray(".floating-card, .pricing-card");
    const skewTo = cardElements.map((el: any) => gsap.quickTo(el, "skewY", { duration: 0.8, ease: "power3.out" }));
    const scaleYTo = cardElements.map((el: any) => gsap.quickTo(el, "scaleY", { duration: 0.8, ease: "power3.out" }));
    const yOffsetTo = cardElements.map((el: any) => gsap.quickTo(el, "y", { duration: 1.2, ease: "power2.out" }));

    lenis.on("scroll", ({ velocity }) => {
      const clampedVelocity = Math.max(Math.min(velocity, 12), -12);
      const skewAngle = clampedVelocity * 0.8;
      const scaleStretch = 1 + Math.abs(clampedVelocity) * 0.005;
      
      skewTo.forEach((fn) => fn(skewAngle));
      scaleYTo.forEach((fn) => fn(scaleStretch));
      
      yOffsetTo.forEach((fn, idx) => {
        const baseOffset = idx % 2 === 0 ? -40 : 40;
        const speedInfluence = clampedVelocity * 3.5 * (idx % 2 === 0 ? -1 : 1);
        fn(baseOffset + speedInfluence);
      });
    });

    // RENDER ANIMATION TICK
    let requestFrameId: number;
    let clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      shaderMaterial.uniforms.uTime.value = elapsedTime;

      // Spring physics integration for magnetic deflection
      const springForce = (mousePhysics.targetStrength - mousePhysics.strength) * mousePhysics.stiffness;
      const dampingForce = -mousePhysics.velocity * mousePhysics.damping;
      const acceleration = springForce + dampingForce;

      mousePhysics.velocity += acceleration * delta;
      mousePhysics.strength += mousePhysics.velocity * delta;

      shaderMaterial.uniforms.uMouseStrength.value = mousePhysics.strength;

      // Smooth interpolation for mouse deflection coordinates
      shaderMaterial.uniforms.uMouse.value.lerp(uMouseTarget, 0.08);

      // Smooth cursor-follow LERP mapping for PointsCloud center
      mouse.x += (mouse.targetX - mouse.x) * 0.045;
      mouse.y += (mouse.targetY - mouse.y) * 0.045;
      pointsCloud.position.x = mouse.x;
      pointsCloud.position.y = mouse.y;

      // Rotate points cloud autonomously for structural perspective
      pointsCloud.rotation.y = elapsedTime * 0.08;
      pointsCloud.rotation.x = elapsedTime * 0.04;

      renderer.render(scene, camera);
      requestFrameId = requestAnimationFrame(tick);
    };

    tick();

    // RESIZE EVENT HANDLER
    const onResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(requestFrameId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      lenis.destroy();
      gsap.ticker.remove(onTick);
      renderer.dispose();
      
      // Memory cleanup for geometries and materials
      bufferGeometry.dispose();
      shaderMaterial.dispose();
    };
  }, []);

  const features = [
    {
      title: "Conversational AI Engine",
      subtitle: "High-fidelity audio feedback",
      icon: Cpu,
      points: [
        "Vocal Filler Tracking: Logs verbal pauses like 'um', 'like', and 'ah'.",
        "WPM Pacing Analyzer: Guides speaking speed in the optimal WPM range.",
        "STAR Method Recognition: Rates how well you outline answers.",
      ],
    },
    {
      title: "ATS-Optimized Resumes",
      subtitle: "Pass the screening algorithms",
      icon: Terminal,
      points: [
        "6 Professional Templates: Built specifically to pass standard filters.",
        "Real-Time HTML Preview: Edit raw values and see updates instantly.",
        "Export Support: Download clean PDF files maintaining parseable structures.",
      ],
    },
    {
      title: "Real-Time AI Analytics",
      subtitle: "Instant feedback reports on finish",
      icon: BarChart3,
      points: [
        "Aggregated Grading Scale: Get overall prep readiness marks.",
        "Strengths & Improvements: AI outlines exactly what to fix.",
        "Session Logs: Review the full transcription of your dialogue.",
      ],
    },
  ];

  const pricingDetails = {
    premium: isAnnual ? { monthly: 8, total: 96 } : { monthly: 10, total: 10 },
    pro: isAnnual ? { monthly: 20, total: 240 } : { monthly: 25, total: 25 },
  };

  const comparison = [
    { feature: "AI Voice Practice Engine", free: "Standard", premium: "Advanced", pro: "Ultra-Low Latency" },
    { feature: "Speech Pacing Telemetry", free: "Standard", premium: "Detailed Logs", pro: "Real-time Alerts" },
    { feature: "Mock Evaluation Sessions", free: "1 Session", premium: "Unlimited", pro: "Unlimited" },
    { feature: "ATS Optimized Templates", free: "1 Template", premium: "6 Templates", pro: "All Templates" },
    { feature: "Real-Time HTML Editor", free: false, premium: true, pro: true },
    { feature: "Vocal Filler word tracker", free: "Basic (Counts)", premium: "Complete (Timestamps)", pro: "Interactive feedback" },
    { feature: "Advanced System Design Engine", free: false, premium: false, pro: "Full Access" },
    { feature: "Custom Job Description sync", free: false, premium: false, pro: "Unlimited" },
    { feature: "Priority AI queue access", free: false, premium: true, pro: "Instant routing" },
    { feature: "1-on-1 team sharing metrics", free: false, premium: false, pro: "Supported" },
  ];

  const springTransition = { type: "spring", stiffness: 90, damping: 18 };

  return (
    <div className="w-full flex flex-col font-mona-sans relative z-10 bg-zinc-950 min-h-screen text-white overflow-x-hidden selection:bg-white selection:text-black">
      
      {/* High-performance ambient gradients (No CSS filters to prevent scrolling lag) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(63,63,70,0.12)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0 ambient-glow-1" style={{ willChange: "transform" }} />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(39,39,42,0.06)_0%,rgba(0,0,0,0)_70%)] pointer-events-none z-0 ambient-glow-2" style={{ willChange: "transform" }} />

      {/* Grid Dot Overlay */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />

      {/* SECTION 1: HERO CONTAINER */}
      <section id="intro" className="relative w-full h-[90vh] min-h-[600px] flex flex-col justify-center items-center pt-14 bg-gradient-to-b from-black via-zinc-950 to-zinc-900 overflow-hidden select-none">
        
        {/* Interactive anti-gravity canvas background */}
        <canvas id="gravity-canvas" className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-60" />

        {/* Fake 3D Spline Fluid Wireframes & Light Emissions */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Subsurface scattering glows - using radial gradients to prevent rasterization lag */}
          <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[radial-gradient(circle,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0)_70%)] rounded-full" />
          <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(113,113,122,0.02)_0%,rgba(0,0,0,0)_70%)] rounded-full" />
          
          {/* Layered SVGs mapping animated, non-scaling vector wireframe ribbons */}
          <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="spline-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#71717a" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="spline-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.3" />
                <stop offset="60%" stopColor="#27272a" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Wavy Ribbon Paths with GSAP float scroll hooks */}
            <path 
              d="M-100,280 C300,100 700,500 1100,200 C1300,50 1450,150 1540,100" 
              stroke="url(#spline-grad-1)" 
              strokeWidth="2.5" 
              vectorEffect="non-scaling-stroke" 
              className="spline-ribbon-1"
            />
            <path 
              d="M-100,420 C400,220 800,680 1200,320 C1350,180 1400,280 1540,200" 
              stroke="url(#spline-grad-2)" 
              strokeWidth="1.5" 
              vectorEffect="non-scaling-stroke" 
              className="spline-ribbon-2"
            />
            <path 
              d="M-50,200 C500,80 900,550 1300,350 C1400,300 1480,380 1520,320" 
              stroke="#ffffff" 
              strokeWidth="1" 
              strokeOpacity="0.12" 
              strokeDasharray="6, 6" 
              vectorEffect="non-scaling-stroke" 
              className="spline-ribbon-3"
            />
          </svg>
        </div>

        {/* Grid Dot Overlay */}
        <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
        
        {/* Glassmorphic centered content */}
        <div className="max-w-4xl mx-auto w-full px-6 sm:px-8 flex flex-col items-center text-center gap-5 z-10 mt-6 mb-8 relative hero-content-anim">
          <motion.h1
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.95] text-white tracking-tight"
          >
            Face the machine. <br />
            <span className="text-zinc-500">
              Master the interview.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="text-sm sm:text-base lg:text-lg text-zinc-400 leading-relaxed font-medium max-w-2xl tracking-wide"
          >
            Conduct dynamic, voice-driven mock interviews tailored specifically to your resume. Eliminate vocal fillers, perfect your pacing, and pass corporate screeners with automated real-time analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.3 }}
            className="flex gap-4 items-center justify-center max-sm:flex-col w-full max-w-md mt-2"
          >
            <Button asChild className="bg-white hover:bg-zinc-200 text-black font-extrabold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300 border border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2">
              <Link href={getAuthRedirectUrl("sign-up")} className="flex items-center justify-center gap-2">
                Start Prep <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-zinc-850 hover:border-zinc-700 bg-white/5 backdrop-blur-md text-zinc-300 hover:text-white font-extrabold text-xs px-8 py-3 rounded-xl cursor-pointer h-12 w-full sm:w-48 transition-all duration-300 flex items-center justify-center">
              <Link href={getAuthRedirectUrl("sign-in")}>
                Access Portal
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Dynamic Infinite Ticker */}
        <div className="w-full overflow-hidden py-4 border-y border-white/5 bg-black/10 select-none relative z-10 mb-14 mt-4">
          <div className="animate-marquee space-x-12 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] text-zinc-550">
            <span>Conversational AI Mock interviews</span>
            <span>•</span>
            <span>System Design Drills</span>
            <span>•</span>
            <span>ATS Resume Builder</span>
            <span>•</span>
            <span>Real-time Speech Telemetry</span>
            <span>•</span>
            <span>STAR Method Evaluation</span>
            <span>•</span>
            <span>Vocal Filler Detection</span>
            <span>•</span>
            <span>Conversational AI Mock interviews</span>
            <span>•</span>
            <span>System Design Drills</span>
            <span>•</span>
            <span>ATS Resume Builder</span>
            <span>•</span>
            <span>Real-time Speech Telemetry</span>
            <span>•</span>
            <span>STAR Method Evaluation</span>
            <span>•</span>
            <span>Vocal Filler Detection</span>
            <span>•</span>
          </div>
        </div>

        {/* TRANSITION 1: Curved Flatter Divider - Absolute positioned bottom to prevent clipping */}
        <div className="absolute bottom-0 left-0 w-full z-20">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px] block" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,50 Q720,120 1440,50 L1440,120 L0,120 Z" fill="#ffffff" />
          </svg>
        </div>
      </section>

      {/* SECTION 2: FEATURE MATRIX GRID (Pure White Background) */}
      <section id="features" className="relative w-full py-24 bg-white text-zinc-950 scroll-mt-16 z-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ ...springTransition }}
            className="text-center space-y-4 mb-20"
          >
            <span className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">Core Capabilities</span>
            <h2 className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-none">
              Built for developers, <br />
              <span className="text-zinc-600">engineered to convert.</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-zinc-550 max-w-xl mx-auto leading-relaxed font-semibold">
              A comprehensive suite of tools designed to drill conversational fluency, structural logic, and ATS parser readiness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: idx * 0.08 }}
                className="p-8 rounded-2xl border border-zinc-200 bg-zinc-550/20 relative overflow-hidden group hover:border-zinc-300 hover:bg-zinc-550/40 transition-all flex flex-col justify-between floating-card"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-zinc-900 opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="space-y-6">
                  <div className="size-10 bg-zinc-900 text-white rounded-lg flex items-center justify-center">
                    <feat.icon className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-black tracking-tight">{feat.title}</h3>
                    <p className="text-[9px] text-zinc-550 font-black uppercase tracking-widest mt-1.5">{feat.subtitle}</p>
                  </div>

                  <ul className="space-y-3.5 pt-5 border-t border-zinc-250">
                    {feat.points.map((pt, pIdx) => {
                      const [head, desc] = pt.split(":");
                      return (
                        <li key={pIdx} className="flex items-start gap-2.5 text-xs text-zinc-600">
                          <Check className="size-3.5 text-zinc-900 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            <strong className="text-black font-bold">{head}</strong>: {desc}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSITION 2: Fluid Liquid Blob Divider (Bottom of Section 2) */}
      <div className="w-full relative z-20 -mb-[1px]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[80px] sm:h-[120px] block" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Underlying Offset Blob path */}
          <path d="M0,45 Q360,95 720,45 T1440,85 L1440,120 L0,120 Z" fill="#171717" fillOpacity="0.4" />
          {/* Foreground Blob path */}
          <path d="M0,65 Q360,25 720,85 T1440,45 L1440,120 L0,120 Z" fill="#171717" />
        </svg>
      </div>

      {/* SECTION 3: SOCIAL PROOF & LIVE TELEMETRY (Deep Charcoal - bg-neutral-900 / #171717) */}
      <section id="showcase" className="py-24 bg-[#171717] relative scroll-mt-16 z-10 text-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ ...springTransition }}
            className="md:col-span-5 space-y-6"
          >
            <span className="text-xs font-black tracking-[0.2em] text-zinc-500 uppercase">Live Telemetry</span>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[0.98]">
              Analyze speech pacing & parameters dynamically
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-semibold">
              As you talk, our voice model captures speed patterns, hesitation anchors, and keyword match rates. Get immediate corrective guidelines.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { title: "STAR Evaluation", desc: "Measures story composition elements dynamically." },
                { title: "Acoustic Pacing Guard", desc: "Flagging excessive run-ons or speed drops." },
                { title: "Structural ATS Sync", desc: "Aligns spoken experience with resume keywords." },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ type: "spring", stiffness: 90, damping: 18, delay: idx * 0.1 }}
                  className="flex gap-3 items-start"
                >
                  <span className="size-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-zinc-350 font-black shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-xs font-black text-white uppercase tracking-wider">{item.title}</h5>
                    <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="md:col-span-7 flex justify-center items-center">
            <motion.div 
              initial={{ scale: 0.94, opacity: 0, rotateY: 12 }}
              whileInView={{ scale: 1, opacity: 1, rotateY: 0 }}
              viewport={{ once: false, margin: "-120px" }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
              className="w-full max-w-md bg-zinc-950/40 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden group hover:border-zinc-800 transition-all shadow-xl"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-850 via-white/10 to-zinc-850" />
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-6">
                <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.15em]">Acoustic telemetry</span>
                <span className="size-2 rounded-full bg-white animate-pulse" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-zinc-400">Pacing Speed (WPM)</span>
                    <span className="text-white">130 WPM</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "70%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="h-full bg-white rounded-full" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-zinc-400">STAR Content Alignment</span>
                    <span className="text-white">94%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "94%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                      className="h-full bg-zinc-500 rounded-full" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-zinc-400">ATS Keyword Fit</span>
                    <span className="text-white">88%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "88%" }}
                      viewport={{ once: false }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                      className="h-full bg-zinc-650 rounded-full" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRANSITION 3: Curved Divider (Bottom of Section 3 - matches bg-zinc-800 / #27272a) */}
      <div className="w-full relative z-20 -mb-[1px]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[60px] sm:h-[80px] block" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,50 Q720,120 1440,50 L1440,120 L0,120 Z" fill="#27272a" />
        </svg>
      </div>

      {/* SECTION 4: PRICING PLANS & RESOURCES (Zinc Grey Background - bg-zinc-900 / #27272a) */}
      <div className="bg-[#27272a] relative z-10">
        
        {/* Resources part */}
        <section id="resources" className="py-24 relative scroll-mt-16">
          <div className="max-w-5xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ ...springTransition }}
              className="text-center space-y-4 mb-20"
            >
              <span className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">Guides & Resources</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Expert articles, <br />
                <span className="text-zinc-400">proven preparation logs.</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-350 max-w-xl mx-auto leading-relaxed font-semibold">
                Read preparation feedback, vocal studies, and technical interview layouts compiled by senior developers.
              </p>
            </motion.div>

            {loadingBlogs ? (
              <div className="flex flex-col justify-center items-center py-20 gap-3">
                <Loader2 className="size-8 animate-spin text-zinc-400" />
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Loading Resources...</span>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-16 border border-zinc-800 bg-zinc-950/20 rounded-2xl max-w-xl mx-auto">
                <BookOpen className="size-8 mx-auto text-zinc-500 mb-3" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">No articles found</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Check back later for newly published guides.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 85, damping: 18, delay: index * 0.08 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-950/30 hover:border-zinc-700 transition-all flex flex-col justify-between min-h-[260px] relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[9px] text-zinc-400 font-black uppercase tracking-wider">
                        <span className="bg-zinc-950 px-3 py-1 rounded-full border border-zinc-800 text-zinc-300">{article.category}</span>
                        <span className="flex items-center gap-1"><Clock className="size-3" /> {article.readTime}</span>
                      </div>
                      <h3 className="text-base font-black text-white group-hover:text-zinc-200 transition-colors leading-snug tracking-tight">{article.title}</h3>
                      <p className="text-xs text-zinc-300 leading-relaxed font-semibold">{article.excerpt}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800/60 pt-4 mt-6 text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em]">
                      <span className="flex items-center gap-1.5"><Calendar className="size-3.5" /> {article.date}</span>
                      <span className="flex items-center gap-1.5"><User className="size-3.5" /> {article.author}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Pricing part */}
        <section id="pricing" className="py-24 relative scroll-mt-16">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ ...springTransition }}
              className="text-center space-y-4 mb-16"
            >
              <span className="text-xs font-black tracking-[0.2em] text-zinc-400 uppercase">Pricing Plans</span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Choose your speed, <br />
                <span className="text-zinc-400">unlock professional preparation.</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-350 max-w-xl mx-auto leading-relaxed font-semibold">
                Upgrade your evaluation credentials. Pay monthly or choose annual billing to save up to 20%.
              </p>

              {/* Toggle Switch */}
              <div className="inline-flex items-center gap-3 mt-8 bg-zinc-950/40 p-1.5 rounded-full border border-zinc-800 shadow-xl z-20">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    !isAnnual 
                      ? "bg-white text-black font-black" 
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Monthly Billing
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAnnual 
                      ? "bg-white text-black font-black" 
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Annual Billing
                  <span className="text-[9px] font-black bg-zinc-900 border border-zinc-800 text-white px-2 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch mb-24">
              
              {/* Freemium Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 18 }}
                className="border border-zinc-800 bg-zinc-950/20 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-750 transition-all relative pricing-card"
              >
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full">
                    Freemium Plan
                  </span>
                  <h4 className="text-3xl font-black text-white mt-6">$0.00</h4>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                    Standard practice evaluation to test the voice engine framework.
                  </p>
                  <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-300 font-medium border-t border-zinc-800 pt-6">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-400 shrink-0" />
                      <span>1 AI Voice Practice Session</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-400 shrink-0" />
                      <span>1 Basic ATS Resume Template</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-400 shrink-0" />
                      <span>Vocal Filler words overview</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" className="mt-8 border-zinc-800 text-zinc-350 hover:text-white bg-zinc-950/40 rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer">
                  <Link href={getAuthRedirectUrl("sign-in")}>Start Free Trial</Link>
                </Button>
              </motion.div>

              {/* Premium Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.08 }}
                className="border border-white/10 bg-white/[0.015] rounded-2xl p-8 flex flex-col justify-between hover:border-white/20 transition-all relative overflow-hidden pricing-card"
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-20 bg-white/5 blur-[40px] rounded-full pointer-events-none" />
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1">
                      <Crown className="size-3 fill-white text-white" /> Recommended
                    </span>
                    <span className="text-[9px] font-black uppercase bg-white text-black px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <h4 className="text-3xl font-black text-white">${pricingDetails.premium.monthly}.00</h4>
                    <span className="text-xs text-zinc-400 font-bold">/ month</span>
                  </div>
                  <p className="text-[10px] text-zinc-450 font-bold uppercase mt-1">
                    {isAnnual ? `Billed annually at $${pricingDetails.premium.total}.00/yr` : "Billed monthly"}
                  </p>
                  <p className="text-xs text-zinc-300 mt-3 leading-relaxed">
                    Complete practice with advanced analytics, custom resumes, and full session transcription logs.
                  </p>
                  <ul className="space-y-3.5 mt-8 text-[11px] text-white font-medium border-t border-zinc-800 pt-6">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>Unlimited AI Voice Interviews</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>6 Premium ATS Resume Templates</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-white shrink-0" />
                      <span>Full Real-Time Resume HTML Editing</span>
                    </li>
                  </ul>
                </div>
                <Button asChild className="mt-8 bg-white hover:bg-zinc-200 text-black rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer flex justify-center items-center gap-1.5 shadow-lg shadow-white/5">
                  <Link href={getAuthRedirectUrl("sign-up")}>
                    Start Prep <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </motion.div>

              {/* Pro Plan */}
              <motion.div 
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-100px" }}
                transition={{ type: "spring", stiffness: 80, damping: 18, delay: 0.16 }}
                className="border border-zinc-800 bg-zinc-950/20 rounded-2xl p-8 flex flex-col justify-between hover:border-zinc-750 transition-all relative pricing-card"
              >
                <div>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="size-3 text-zinc-400" /> Pro Plan
                  </span>
                  <div className="flex items-baseline gap-1 mt-6">
                    <h4 className="text-3xl font-black text-white">${pricingDetails.pro.monthly}.00</h4>
                    <span className="text-xs text-zinc-400 font-bold">/ month</span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1">
                    {isAnnual ? `Billed annually at $${pricingDetails.pro.total}.00/yr` : "Billed monthly"}
                  </p>
                  <p className="text-xs text-zinc-350 mt-3 leading-relaxed">
                    Designed for serious tech applicants seeking advanced system design and team-level diagnostic reviews.
                  </p>
                  <ul className="space-y-3.5 mt-8 text-[11px] text-zinc-350 font-medium border-t border-zinc-800 pt-6">
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-350 shrink-0" />
                      <span>Everything in Premium</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-350 shrink-0" />
                      <span>System Design Interactive Simulator</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Check className="size-3.5 text-zinc-350 shrink-0" />
                      <span>Custom Job Description parsing</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" className="mt-8 border-zinc-800 text-zinc-350 hover:text-white bg-zinc-950/40 rounded-xl w-full text-xs font-bold py-2.5 cursor-pointer">
                  <Link href={getAuthRedirectUrl("sign-up")}>Get Started Pro</Link>
                </Button>
              </motion.div>
            </div>

            {/* Benefit Comparison Table */}
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 70, damping: 20 }}
              className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-950/25 backdrop-blur-md"
            >
              <h3 className="text-sm font-black text-white text-center py-4 bg-zinc-950/60 uppercase tracking-widest border-b border-zinc-800">Compare Benefits</h3>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 font-bold uppercase text-zinc-400 tracking-wider">
                    <th className="p-4">Feature Details</th>
                    <th className="p-4 text-center">Freemium</th>
                    <th className="p-4 text-center">Premium</th>
                    <th className="p-4 text-center">Pro</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 font-medium">
                  {comparison.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.01] transition-colors">
                      <td className="p-4 text-zinc-300 font-semibold">{row.feature}</td>
                      <td className="p-4 text-center text-zinc-400">
                        {typeof row.free === "boolean" ? (row.free ? "✓" : "✕") : row.free}
                      </td>
                      <td className="p-4 text-center text-zinc-200">
                        {typeof row.premium === "boolean" ? (row.premium ? "✓" : "✕") : row.premium}
                      </td>
                      <td className="p-4 text-center text-white font-bold">
                        {typeof row.pro === "boolean" ? (row.pro ? "✓" : "✕") : row.pro}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </div>
        </section>
      </div>

      {/* TRANSITION 4: Overlapping Wave Divider (Pricing Plans to Footer Layout - matches bg-black) */}
      <div className="w-full relative z-20 -mt-10 -mb-[1px]">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-[80px] sm:h-[120px] block animate-fadeIn" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 Q240,20 480,80 T960,40 T1440,80 L1440,120 L0,120 Z" fill="#000000" />
        </svg>
      </div>
    </div>
  );
}
