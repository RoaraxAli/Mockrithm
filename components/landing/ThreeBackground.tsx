"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Simplex Noise algorithm in GLSL to deform our centerpiece sphere dynamically on the GPU
const vertexShader = `
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;
  uniform float uScrollProgress;
  
  varying vec3 vPosition;
  varying vec3 vNormal;
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
      vPosition = position;
      vNormal = normal;
      vUv = uv;

      // Calculate noise deformation
      float noiseFreq = 1.2;
      float noiseSpeed = 0.5;
      float noiseVal = snoise(position * noiseFreq + uTime * noiseSpeed);
      vNoise = noiseVal;

      // Displace position along normals
      vec3 newPosition = position + normal * noiseVal * 0.25;

      // Mouse Interaction
      vec3 worldPos = (modelMatrix * vec4(newPosition, 1.0)).xyz;
      float distToMouse = distance(worldPos, uMouse);
      
      if (distToMouse < uMouseRadius) {
          float force = (uMouseRadius - distToMouse) / uMouseRadius;
          float smoothForce = smoothstep(0.0, 1.0, force) * uMouseStrength;
          
          vec3 pushDirection = normalize(worldPos - uMouse);
          // Swirl effect
          vec3 swirlDirection = vec3(-pushDirection.y, pushDirection.x, 0.0);
          
          newPosition += (pushDirection * 0.35 + swirlDirection * 0.25) * smoothForce;
      }

      // Scroll dispersion effect
      newPosition += normal * uScrollProgress * 0.6;

      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      gl_Position = projectionMatrix * mvPosition;
  }
`;

// Fragment shader to create glowing neon edge gradients based on normals, depth and noise
const fragmentShader = `
  uniform float uTime;
  uniform float uScrollProgress;

  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying float vNoise;

  void main() {
      // Calculate fresnel-like edge glow
      vec3 viewDir = vec3(0.0, 0.0, 1.0); // Simple forward camera view
      float fresnel = 1.0 - max(0.0, dot(vNormal, viewDir));
      fresnel = pow(fresnel, 2.5);

      // Create glowing neon gradient (violet to cyan)
      vec3 colorViolet = vec3(0.55, 0.15, 1.0); // Violet
      vec3 colorCyan = vec3(0.1, 0.8, 1.0);   // Cyan glow
      
      // Mix colors based on UV coord, noise and scroll progress
      float mixFactor = vUv.x + sin(uTime * 0.3) * 0.2 + vNoise * 0.15;
      mixFactor = clamp(mixFactor, 0.0, 1.0);
      vec3 baseColor = mix(colorViolet, colorCyan, mixFactor);

      // Add a touch of premium white light to high peaks
      if (vNoise > 0.4) {
          baseColor = mix(baseColor, vec3(1.0, 1.0, 1.0), (vNoise - 0.4) * 0.6);
      }

      // Neon glowing outline glow + soft interior
      float intensity = fresnel * 1.2 + 0.15;
      
      // Fade out based on scroll progress to transition focus to UI elements
      float opacity = (intensity * (1.0 - uScrollProgress * 0.5));

      gl_FragColor = vec4(baseColor, opacity);
  }
`;

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. THREE.JS SCENE SETUP
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 7;

    // 2. CENTERPIECE 3D GEOMETRY
    const sphereGeometry = new THREE.IcosahedronGeometry(1.6, 6);

    const sphereMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector3(-999, -999, -999) },
        uMouseRadius: { value: 2.5 },
        uMouseStrength: { value: 0.0 },
        uScrollProgress: { value: 0.0 },
      },
      transparent: true,
      depthWrite: true,
      blending: THREE.AdditiveBlending,
      wireframe: true, // Wireframe holographic mesh aesthetic
    });

    const centerpieceMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(centerpieceMesh);

    // Inner glowing solid core
    const coreGeometry = new THREE.IcosahedronGeometry(0.8, 3);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x8a2be2, // Violet
      wireframe: true,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    centerpieceMesh.add(coreMesh);

    // 3. BACKGROUND ORBITING PARTICLES
    const particleCount = 18000;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount * 3); // theta, phi, radius

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 2.0 + Math.pow(Math.random(), 2.0) * 8.0;

      particlePositions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      particlePositions[i * 3 + 2] = Math.cos(phi) * radius;

      particleSpeeds[i] = 0.05 + Math.random() * 0.15;
      particleAngles[i * 3] = theta;
      particleAngles[i * 3 + 1] = phi;
      particleAngles[i * 3 + 2] = radius;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Dynamic glowing custom texture using simple Canvas gradient
    const createParticleTexture = () => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 16;
      pCanvas.height = 16;
      const ctx = pCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(168, 85, 247, 0.8)"); // Purple glow
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      map: createParticleTexture(),
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 4. MOUSE MOVEMENT INTERACTION WITH SPRING PHYSICS
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let mousePhysics = {
      strength: 0.0,
      targetStrength: 0.0,
      velocity: 0.0,
      stiffness: 140,
      damping: 15,
    };

    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();
    const uMouseTarget = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse2D, camera);
      const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const targetPoint = new THREE.Vector3();

      if (raycaster.ray.intersectPlane(interactionPlane, targetPoint)) {
        uMouseTarget.copy(targetPoint);
        mousePhysics.targetStrength = 1.0;
        mouse.targetX = targetPoint.x;
        mouse.targetY = targetPoint.y;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 5. ANIMATION TICK LOOP
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Read current scroll progress of page (0 to 1 scaling roughly)
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;

      // Update centerpiece uniforms
      sphereMaterial.uniforms.uTime.value = elapsedTime;
      sphereMaterial.uniforms.uScrollProgress.value = scrollProgress;

      // Spring physics for mouse interaction
      const springForce = (mousePhysics.targetStrength - mousePhysics.strength) * mousePhysics.stiffness;
      const dampingForce = -mousePhysics.velocity * mousePhysics.damping;
      const acceleration = springForce + dampingForce;

      mousePhysics.velocity += acceleration * delta;
      mousePhysics.strength += mousePhysics.velocity * delta;

      sphereMaterial.uniforms.uMouseStrength.value = mousePhysics.strength;
      sphereMaterial.uniforms.uMouse.value.lerp(uMouseTarget, 0.08);

      // Autonomously rotate centerpiece
      centerpieceMesh.rotation.y = elapsedTime * 0.06;
      centerpieceMesh.rotation.x = elapsedTime * 0.04;
      coreMesh.rotation.y = -elapsedTime * 0.12;

      // Parallax mouse follow for centerpiece
      mouse.x += (mouse.targetX - mouse.x) * 0.035;
      mouse.y += (mouse.targetY - mouse.y) * 0.035;
      centerpieceMesh.position.x = mouse.x * 0.35;
      centerpieceMesh.position.y = mouse.y * 0.35;

      // Scroll actions: move centerpiece down and back, zoom camera slightly
      centerpieceMesh.position.y += -scrollProgress * 2.8;
      centerpieceMesh.position.z = -scrollProgress * 3.5;
      centerpieceMesh.scale.setScalar(1.0 - scrollProgress * 0.2);

      // Animate background particles (orbiting motion)
      const positionsAttr = particleGeometry.getAttribute("position") as THREE.BufferAttribute;
      const positions = positionsAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        // Orbit speed modified by elapsed time
        const theta = particleAngles[i * 3] + elapsedTime * particleSpeeds[i] * 0.1;
        const phi = particleAngles[i * 3 + 1];
        // Disperse particles outward on scroll
        const radius = particleAngles[i * 3 + 2] * (1.0 + scrollProgress * 0.6);

        positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius + mouse.x * 0.1;
        positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius + mouse.y * 0.1 - scrollProgress * 1.5;
        positions[i * 3 + 2] = Math.cos(phi) * radius;
      }
      positionsAttr.needsUpdate = true;

      // Slow orbital rotate of all particles group
      particles.rotation.y = elapsedTime * 0.015;
      particles.rotation.z = elapsedTime * 0.005;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 6. RESIZE HANDLER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    window.addEventListener("resize", handleResize);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-70 transition-opacity duration-1000"
      />
    </div>
  );
}
