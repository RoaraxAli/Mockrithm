"use client"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import FeedbackForm from "@/components/FeedbackForm"
import {
  Mic,
  Brain,
  TrendingUp,
  ExternalLink,
  Github,
  Compass,
  Sparkles,
  Users,
  Target,
  FileUser,
  HeartHandshake,
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
  const coreValues = [
    {
      icon: <Sparkles className="h-5 w-5 text-white" />,
      title: "High-Fidelity Realism",
      description: "We focus on replicating the actual cognitive friction of interview pressure. Our adaptive AI doesn't just ask templates; it listens, follows up, and challenges you dynamically.",
    },
    {
      icon: <Target className="h-5 w-5 text-white" />,
      title: "Actionable Intelligence",
      description: "Vague feedback like 'do better' is useless. We break down your performance through speech metrics, pacing, confidence delivery, and STAR structural methodology.",
    },
    {
      icon: <HeartHandshake className="h-5 w-5 text-white" />,
      title: "Radical Accessibility",
      description: "Elite interview coaching shouldn't cost thousands of dollars. We believe that top-tier career preparation and ATS resume optimization tools should be accessible to anyone, anywhere.",
    },
  ]

  const differences = [
    {
      metric: "Conversational Pace",
      traditional: "Static forms, slow text inputs, or rigid videos.",
      mockrithm: "Instant, low-latency conversational AI simulating real vocal flow.",
    },
    {
      metric: "Feedback Quality",
      traditional: "Generic grades or delayed human assessment.",
      mockrithm: "Instant breakdowns of pace, filler words, and answer structure.",
    },
    {
      metric: "Resume Optimization",
      traditional: "Basic templates that don't match specific roles.",
      mockrithm: "ATS-friendly builders aligned directly with target role configurations.",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans">
      {/* Absolute grid and radial background highlights */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-20 z-0" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-white/[0.01] blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-white/[0.01] blur-[100px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">
        
        {/* 1. Hero Block */}
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
              The Story & Philosophy of Mockrithm
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white animate-pulse"
          >
            Redefining Career Prep. <br />
            <span className="text-zinc-550 italic font-medium">Built for the Modern Professional.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 text-[11px] sm:text-xs text-zinc-400 leading-relaxed max-w-xl mx-auto font-medium"
          >
            Mockrithm bridges the gap between passive learning and high-intensity realism. We build intelligence tools designed to build confidence, structure, and pacing.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-3 flex-wrap"
          >
            <Button asChild size="sm" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-6 py-2 rounded-full cursor-pointer transition-all duration-300">
              <Link href="/user/dashboard" className="flex items-center gap-1.5">
                Go to Dashboard <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-6 py-2 rounded-full cursor-pointer transition-all duration-300">
              <Link href="https://github.com/RoaraxAli/Mockrithm" target="_blank" className="flex items-center gap-1.5">
                <Github className="h-3 w-3" /> View Repository
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* 2. The Genesis / Our Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-zinc-900 pb-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500">The Genesis</h2>
            <h3 className="text-2xl font-black text-white leading-tight">
              Why We Built Mockrithm
            </h3>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              We realized that standard career preparation is fundamentally broken. Standard platforms rely on passive reading or static video responses, while hiring managers are seeking authentic communication, structured logic, and quick critical thinking.
            </p>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
              Mockrithm was created to simulate the actual mental pressure of real conversations. Our vision is to combine advanced conversational artificial intelligence with high-fidelity speech diagnostics, enabling candidates to build speaking rhythm, conquer anxiety, and land their dream jobs.
            </p>
          </div>
          <div>
            <ThreeDTiltCard className="p-6 border border-zinc-900 bg-zinc-950/40 relative">
              <Compass className="absolute top-4 right-4 h-12 w-12 text-white/5" />
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">Our Vision</h4>
              <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                To build the ultimate companion for career preparation—making premium, adaptive, real-time AI-driven coaching accessible to job-seekers worldwide without the premium price tag.
              </p>
            </ThreeDTiltCard>
          </div>
        </section>

        {/* 3. Core Values */}
        <section className="w-full">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Our Pillars</h2>
            <h3 className="text-xl font-black text-white">What Guides Our Platform</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreValues.map((value, index) => (
              <ThreeDTiltCard key={index} className="flex flex-col p-5 h-full">
                <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 mb-3 shrink-0">
                  {value.icon}
                </div>
                <h4 className="text-[11px] font-black text-white mb-2 uppercase tracking-wide">{value.title}</h4>
                <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">{value.description}</p>
              </ThreeDTiltCard>
            ))}
          </div>
        </section>

        {/* 4. Compare Table (The Mockrithm Difference) */}
        <section className="w-full border-t border-b border-zinc-900 py-10">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Comparison</h2>
            <h3 className="text-xl font-black text-white">The Mockrithm Difference</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-zinc-900 bg-zinc-950/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-950/60">
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-400">Aspect</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-zinc-500">Traditional Prep</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-wider text-white">Mockrithm</th>
                </tr>
              </thead>
              <tbody>
                {differences.map((diff, index) => (
                  <tr key={index} className="border-b border-zinc-900/50 hover:bg-zinc-950/40 transition-colors">
                    <td className="p-4 text-[10px] font-bold text-white uppercase tracking-wide">{diff.metric}</td>
                    <td className="p-4 text-[10.5px] text-zinc-500 font-medium">{diff.traditional}</td>
                    <td className="p-4 text-[10.5px] text-white font-semibold">{diff.mockrithm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 5. Creator Story */}
        <section className="w-full">
          <ThreeDTiltCard className="p-0 border border-zinc-900 overflow-hidden bg-zinc-950/40">
            <div className="absolute inset-0 premium-grid-dot opacity-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />
            <CardContent className="p-6 sm:p-8 text-center flex flex-col gap-3.5 items-center">
              <Badge variant="outline" className="border-white/20 text-white font-bold text-[8px] px-3.5 py-0.5 rounded-full uppercase">Creator Base</Badge>
              <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-white" /> Built by Ali & Ahmed, for Everyone
              </h3>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-relaxed font-medium max-w-xl">
                Mockrithm was created by Ali & Ahmed — engineers who understand the pressure, anxiety, and bottlenecks of recruitment. Having faced the hurdles of professional job hunts first-hand, we built this tool to represent the ultimate high-fidelity preparation companion.
              </p>
              <p className="text-[10px] sm:text-[11px] text-zinc-450 leading-relaxed font-medium max-w-xl">
                We believe standard study guides aren't enough. Communication is a muscle, and Mockrithm helps you train it. We look forward to hearing your feedback and continually iterating on our AI-powered interview dynamics.
              </p>
              <p className="text-[8.5px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                Minimalist Interface • Robust AI Diagnostics • Actionable Analytics
              </p>
            </CardContent>
          </ThreeDTiltCard>
        </section>

        {/* 6. Contact / Feedback Form */}
        <section id="contact" className="w-full border-t border-zinc-900 pt-10">
          <div className="text-center mb-6">
            <h2 className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Get In Touch</h2>
            <h3 className="text-xl font-black text-white">Contact & Feedback</h3>
            <p className="text-[11px] text-zinc-450 max-w-md mx-auto mt-2 leading-relaxed">
              Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 relative">
            <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
            <FeedbackForm />
          </div>
        </section>

      </div>
    </div>
  )
}
