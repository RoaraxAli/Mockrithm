"use client"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  Mic,
  Brain,
  TrendingUp,
  Users,
  Zap,
  Shield,
  Github,
  ExternalLink,
  CheckCircle,
  Code,
  Database,
  Cloud,
} from "lucide-react"

// Premium 3D Tilt Card with Glare Reflection
function ThreeDTiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glareX, setGlareX] = useState(50)
  const [glareY, setGlareY] = useState(50)
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate rotation (-12 to 12 degrees)
    const rY = ((mouseX / width) - 0.5) * 24
    const rX = ((mouseY / height) - 0.5) * -24

    setRotateY(rY)
    setRotateX(rX)
    setGlareX((mouseX / width) * 100)
    setGlareY((mouseY / height) * 100)
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-xl border border-white/5 bg-zinc-950/70 p-5 transition-all duration-300 ${
        isHovered ? "border-white/15 shadow-[0_15px_30px_rgba(0,0,0,0.7)]" : ""
      } ${className}`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "none" : "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none rounded-xl mix-blend-overlay opacity-30 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 140px at ${glareX}% ${glareY}%, rgba(255,255,255,0.2), transparent)`,
            }}
          />
        )}
        {children}
      </div>
    </div>
  )
}

export default function AboutPage() {
  const features = [
    {
      icon: <Mic className="h-4.5 w-4.5 text-white" />,
      title: "Real-Time Voice",
      description: "Practice with AI that responds naturally to your voice, simulating real interview rhythms.",
    },
    {
      icon: <Brain className="h-4.5 w-4.5 text-white" />,
      title: "Smart Diagnostics",
      description: "Get instant feedback on your response structure, communication tone, and filler words.",
    },
    {
      icon: <TrendingUp className="h-4.5 w-4.5 text-white" />,
      title: "Progress Telemetry",
      description: "Monitor improvements over time with granular dashboards and metric reports.",
    },
    {
      icon: <Users className="h-4.5 w-4.5 text-white" />,
      title: "Mock Formats",
      description: "Practice technical coding challenges, STAR behavioral methods, or general resume reviews.",
    },
    {
      icon: <Zap className="h-4.5 w-4.5 text-white" />,
      title: "Pressure Simulator",
      description: "Experience timed, authentic interview conditions designed to build real comfort.",
    },
    {
      icon: <Shield className="h-4.5 w-4.5 text-white" />,
      title: "Enterprise Security",
      description: "All practice sessions, resumes, and reports are fully isolated and encrypted.",
    },
  ]

  const techStack = [
    {
      category: "Frontend Stack",
      icon: <Code className="h-4.5 w-4.5 text-white" />,
      technologies: ["Next.js 14 App Router", "React 19 Hooks", "TypeScript Types", "Tailwind CSS"],
    },
    {
      category: "Backend Engine",
      icon: <Database className="h-4.5 w-4.5 text-white" />,
      technologies: ["Firebase Admin SDK", "Firestore Database", "Session Cookie Auth"],
    },
    {
      category: "AI Integrations",
      icon: <Brain className="h-4.5 w-4.5 text-white" />,
      technologies: ["Vapi Voice AI", "Gemini 2.5 LLM Models", "Speech Synthesis API"],
    },
    {
      category: "Infrastructure",
      icon: <Cloud className="h-4.5 w-4.5 text-white" />,
      technologies: ["Vercel Edge Platform", "Edge Route Guards", "Middleware Sessions"],
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Setup Format",
      description: "Choose technical stacks, behavioral constraints, or job description alignments.",
    },
    {
      number: "02",
      title: "Talk to AI",
      description: "Converse in real-time with our low-latency, speech-enabled interviewer named Alex.",
    },
    {
      number: "03",
      title: "Review Insights",
      description: "Receive instant STAR method evaluations, scoring cards, and suggestions.",
    },
    {
      number: "04",
      title: "Track Mastery",
      description: "Evaluate your speaking cadence, content accuracy, and metric logs over time.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans">
      {/* Absolute grid and radial background highlights */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/[0.01] blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/[0.01] blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* 1. Hero Block (Tight Margins/Paddings) */}
        <section className="text-center py-6 sm:py-10 border-b border-zinc-900 bg-zinc-950/20 rounded-2xl p-6 relative">
          <div className="absolute inset-0 premium-grid-dot opacity-10 pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-3"
          >
            <Badge
              variant="secondary"
              className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-3.5 py-0.5 text-[9px] font-bold tracking-widest uppercase transition-colors"
            >
              AI-Powered Evaluation Platform
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white"
          >
            Meet <span className="text-zinc-550 italic font-medium">Mockrithm.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-[11px] sm:text-xs text-zinc-400 leading-relaxed max-w-lg mx-auto font-medium"
          >
            Practice with low-latency AI-powered voice interviewers, receive real-time, constructive diagnostic scores, and refine your delivery cadence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3 flex-wrap"
          >
            <Button asChild size="sm" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2 rounded-full cursor-pointer transition-all duration-300">
              <Link href="/interview" className="flex items-center gap-1.5">
                Start Practice <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2 rounded-full cursor-pointer transition-all duration-300">
              <Link href="https://github.com/AHAPRX/interviewer" target="_blank" className="flex items-center gap-1.5">
                <Github className="h-3 w-3" /> Source
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* 2. Creed Statement (Reduced Gap) */}
        <section className="text-center py-4 max-w-3xl mx-auto border-b border-zinc-900 pb-8 w-full">
          <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Our Operational Creed</h2>
          <h3 className="text-lg sm:text-xl font-black text-white leading-tight mb-2">
            Democratizing access to high-fidelity interview training.
          </h3>
          <p className="text-[10px] sm:text-[11px] text-zinc-450 leading-relaxed font-medium">
            Mockrithm removes gatekeeping boundaries by providing adaptive, real-time voice evaluations that diagnose filler words, technical inconsistencies, and delivery speed, providing metrics designed for self-optimization.
          </p>
        </section>

        {/* 3. Steps (How It Works - Compact with 3D Tilt) */}
        <section className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Core Framework</h2>
            <h3 className="text-xl font-black text-white">How It Works</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <ThreeDTiltCard key={index} className="flex flex-col items-center text-center p-4">
                <div className="size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-3">
                  <span className="text-[10px] font-black text-white">{step.number}</span>
                </div>
                <h4 className="text-[11px] font-black text-white mb-1 uppercase tracking-wide">{step.title}</h4>
                <p className="text-[9px] text-zinc-400 font-medium leading-relaxed">{step.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* 4. Interactive Key Features (Compact & 3D Tilt) */}
        <section className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Platform Specs</h2>
            <h3 className="text-xl font-black text-white">Platform Capabilities</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <ThreeDTiltCard key={index} className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                    {feature.icon}
                  </div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-white">{feature.title}</h4>
                </div>
                <p className="text-[9px] text-zinc-450 font-medium leading-relaxed">{feature.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* 5. Modern Tech Stack Showcase (Compact & 3D Tilt) */}
        <section className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-550 mb-1">System Infrastructure</h2>
            <h3 className="text-xl font-black text-white">Platform Stack</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {techStack.map((stack, index) => (
              <ThreeDTiltCard key={index} className="p-4">
                <div className="flex items-center gap-3.5 mb-3 border-b border-white/5 pb-2">
                  <div className="text-white bg-white/5 p-1.5 rounded-md border border-white/10 shrink-0">
                    {stack.icon}
                  </div>
                  <h4 className="text-[9px] font-black uppercase tracking-widest text-white">{stack.category}</h4>
                </div>
                <ul className="space-y-1.5">
                  {stack.technologies.map((tech, techIndex) => (
                    <li
                      key={techIndex}
                      className="flex items-center gap-2 text-[8.5px] text-zinc-450 font-bold uppercase tracking-wide"
                    >
                      <CheckCircle className="h-2.5 w-2.5 text-white shrink-0" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* 6. Premium Creator Card (Reduced Margins) */}
        <section className="w-full">
          <ThreeDTiltCard className="p-0 border border-zinc-900 overflow-hidden bg-zinc-950/40">
            <div className="absolute inset-0 premium-grid-dot opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />
            <CardContent className="p-6 sm:p-8 text-center flex flex-col gap-3.5 items-center">
              <Badge variant="outline" className="border-white/20 text-white font-bold text-[8px] px-3.5 py-0.5 rounded-full uppercase">Creator Base</Badge>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white">Built by Ali & Ahmed, for Everyone</h3>
              <p className="text-[9.5px] sm:text-[10.5px] text-zinc-450 leading-relaxed font-medium max-w-xl">
                Mockrithm was created by Ali & Ahmed — developers who understand the challenges of technical interviews firsthand. Having experienced the cognitive friction, delivery pacing hurdles, and prep bottlenecks, we built this system to represent what high-density preparation should feel like.
              </p>
              <p className="text-[8.5px] text-zinc-550 font-bold uppercase tracking-widest mt-1">
                Minimalist Interface • Robust AI Diagnostics • Zero Fillers
              </p>
            </CardContent>
          </ThreeDTiltCard>
        </section>

      </div>
    </div>
  )
}
