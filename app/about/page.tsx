"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
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

export default function AboutPage() {
  const features = [
    {
      icon: <Mic className="h-5 w-5 text-white" />,
      title: "Real-Time Voice Interaction",
      description:
        "Practice with AI that responds naturally to your voice, simulating authentic interview conversations.",
    },
    {
      icon: <Brain className="h-5 w-5 text-white" />,
      title: "Intelligent Feedback",
      description: "Get instant, personalized feedback on your responses, communication style, and technical accuracy.",
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      title: "Performance Tracking",
      description: "Monitor your progress over time with detailed analytics and improvement recommendations.",
    },
    {
      icon: <Users className="h-5 w-5 text-white" />,
      title: "Multiple Interview Types",
      description: "Practice technical coding interviews, behavioral questions, and industry-specific scenarios.",
    },
    {
      icon: <Zap className="h-5 w-5 text-white" />,
      title: "Realistic Pressure Simulation",
      description: "Experience authentic interview pressure to build confidence for real-world situations.",
    },
    {
      icon: <Shield className="h-5 w-5 text-white" />,
      title: "Secure & Private",
      description: "Your practice sessions and data are protected with enterprise-grade security.",
    },
  ]

  const techStack = [
    {
      category: "Frontend",
      icon: <Code className="h-5 w-5 text-white" />,
      technologies: ["Next.js 14", "React", "TypeScript", "Tailwind CSS"],
    },
    {
      category: "Backend & Database",
      icon: <Database className="h-5 w-5 text-white" />,
      technologies: ["Firebase Auth", "Firestore", "Server Actions"],
    },
    {
      category: "AI & Voice",
      icon: <Brain className="h-5 w-5 text-white" />,
      technologies: ["Vapi AI", "Real-time Speech Processing", "Natural Language Processing"],
    },
    {
      category: "Deployment",
      icon: <Cloud className="h-5 w-5 text-white" />,
      technologies: ["Vercel", "CI/CD Pipeline", "Edge Functions"],
    },
  ]

  const steps = [
    {
      number: "01",
      title: "Choose Your Format",
      description:
        "Select from technical, behavioral, or industry-specific interview formats tailored to your career goals.",
    },
    {
      number: "02",
      title: "Voice Conversation",
      description: "Engage with our AI interviewer through natural voice interaction, just like a real interview.",
    },
    {
      number: "03",
      title: "Instant Analytics",
      description: "Get immediate, actionable insights on your performance, communication, and areas for improvement.",
    },
    {
      number: "04",
      title: "Track & Improve",
      description: "Monitor your improvement over time with detailed analytics and recommendations.",
    },
  ]

  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const fadeInUp: any = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const cardHoverEffect: any = {
    rest: { scale: 1, borderColor: "rgba(255, 255, 255, 0.08)", backgroundColor: "rgba(13, 15, 22, 0.7)" },
    hover: { 
      scale: 1.025, 
      borderColor: "rgba(255, 255, 255, 0.2)",
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      boxShadow: "0 15px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(255, 255, 255, 0.02)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }

  // Scroll Pinned Telemetry
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"]
  });

  // Transform values for text and background zoom (AURA scroll style)
  const bgScale = useTransform(scrollYProgress, [0, 1], [0.8, 1.25]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 0.25, 0.25, 0]);

  const text1Opacity = useTransform(scrollYProgress, [0, 0.12, 0.26, 0.36], [0, 1, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0, 0.12, 0.26, 0.36], [40, 0, 0, -40]);

  const text2Opacity = useTransform(scrollYProgress, [0.38, 0.48, 0.62, 0.72], [0, 1, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.38, 0.48, 0.62, 0.72], [40, 0, 0, -40]);

  const text3Opacity = useTransform(scrollYProgress, [0.74, 0.84, 0.94, 1], [0, 1, 1, 0]);
  const text3Y = useTransform(scrollYProgress, [0.74, 0.84, 0.94, 1], [40, 0, 0, -40]);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-mona-sans">
      {/* Absolute dot matrix overlay and ambient glow */}
      <div className="absolute inset-0 premium-grid-dot pointer-events-none opacity-25 z-0" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-white/[0.015] blur-[150px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* 1. Hero Presentation Grid */}
        <section className="w-full relative py-28 sm:py-36 border-b border-zinc-900 bg-zinc-950/10">
          <div className="max-w-6xl mx-auto px-6 text-center">
            
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-6"
            >
              <Badge
                variant="secondary"
                className="bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white px-4 py-1 text-[10px] font-bold tracking-widest uppercase transition-colors"
              >
                AI-Powered Evaluation Platform
              </Badge>
            </motion.div>

            {/* Premium Giant Typography */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white"
            >
              Meet <br />
              <span className="text-zinc-500 italic font-medium">Mockrithm.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto font-medium"
            >
              The future of interview preparation. Practice with intelligent AI-powered voice interfaces, receive real-time, constructive diagnostics, and build confidence to anchor your dream role.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-10 flex items-center justify-center gap-4 flex-wrap"
            >
              <Button asChild size="lg" className="bg-white hover:bg-zinc-200 text-black font-bold text-xs px-8 py-3 rounded-full cursor-pointer transition-all duration-300">
                <Link href="/interview" className="flex items-center gap-2">
                  Start Practice <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:text-white font-bold text-xs px-8 py-3 rounded-full cursor-pointer transition-all duration-300">
                <Link href="https://github.com/AHAPRX/interviewer" target="_blank" className="flex items-center gap-2">
                  <Github className="h-3.5 w-3.5" /> View Source
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* 2. Scroll-Driven Mission Statement */}
        <section className="w-full py-28 border-b border-zinc-900 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={fadeInUp}
              className="flex flex-col gap-6"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">Our Operational Creed</h2>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Democratizing access to high-fidelity interview training.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium">
                We believe that everyone deserves the opportunity to showcase their true competence in technical and behavioral interviews. Mockrithm removes standard gatekeeping boundaries by providing adaptive, real-time voice evaluations that diagnose filler words, technical inconsistencies, and delivery speed, providing granular metrics designed for self-optimization.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 3. AURA Pinned Interactive Scroll Reveal Section */}
        <section ref={scrollRef} className="w-full relative h-[300vh] bg-black select-none z-10 border-b border-zinc-900">
          <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Ambient Background visual scaling/zooming */}
            <motion.div 
              style={{ scale: bgScale, opacity: bgOpacity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="size-[500px] sm:size-[700px] rounded-full border border-white/5 bg-zinc-950/20 backdrop-blur-sm relative flex items-center justify-center">
                <div className="absolute inset-20 rounded-full border border-white/5" />
                <div className="absolute inset-40 rounded-full border border-white/5" />
                <div className="absolute inset-0 premium-grid-dot opacity-20" />
              </div>
            </motion.div>

            {/* Pinned text reveals */}
            <div className="relative z-10 w-full max-w-4xl px-6 text-center h-full">
              
              {/* Segment 1 */}
              <motion.div 
                style={{ opacity: text1Opacity, y: text1Y }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 px-6 pointer-events-none"
              >
                <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">METHODOLOGY 01 // SPEECH CADENCE</span>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                  Design that breathes.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-semibold uppercase tracking-wider max-w-md mt-2 leading-relaxed">
                  Analyze vocal filler ratios and silent pauses to establish relaxed, rhythmic speech patterns.
                </p>
              </motion.div>

              {/* Segment 2 */}
              <motion.div 
                style={{ opacity: text2Opacity, y: text2Y }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 px-6 pointer-events-none"
              >
                <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">METHODOLOGY 02 // VOCAL METRICS</span>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                  Luxury in every detail.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-semibold uppercase tracking-wider max-w-md mt-2 leading-relaxed">
                  Real-time sentiment parsing evaluates technical vocabulary accuracy and delivery pacing.
                </p>
              </motion.div>

              {/* Segment 3 */}
              <motion.div 
                style={{ opacity: text3Opacity, y: text3Y }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 px-6 pointer-events-none"
              >
                <span className="text-[10px] font-black text-zinc-500 tracking-widest uppercase">METHODOLOGY 03 // MASTER THE INTERVIEW</span>
                <h3 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                  Welcome home.
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-semibold uppercase tracking-wider max-w-md mt-2 leading-relaxed">
                  Aggregate granular speech reports to anchor confidence and lock down dream tech offers.
                </p>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 4. Steps (How It Works) */}
        <section className="w-full py-28 border-b border-zinc-900 relative bg-zinc-950/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-4">Core Framework</h2>
              <h3 className="text-3xl font-black text-white">How Mockrithm Operates</h3>
              <p className="mt-4 text-xs text-zinc-400 font-semibold uppercase tracking-wider">A four-stage cycle to refine your verbal and technical mastery</p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
            >
              {steps.map((step, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp} 
                  className="flex flex-col items-center text-center p-6 bg-zinc-950/40 border border-zinc-900 rounded-xl relative group hover:border-zinc-800 transition-colors duration-300"
                >
                  <div className="size-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 group-hover:border-white/20 transition-all duration-300">
                    <span className="text-xs font-black text-white">{step.number}</span>
                  </div>
                  <h4 className="text-sm font-black text-white mb-2">{step.title}</h4>
                  <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 5. Interactive Key Features */}
        <section className="w-full py-28 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-550 mb-4">Platform Specs</h2>
              <h3 className="text-3xl font-black text-white">Engineering Metrics & Capabilities</h3>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.15 }}
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.div
                    variants={cardHoverEffect}
                    className="border border-white/5 rounded-xl p-6 h-full flex flex-col transition-all cursor-default"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20">
                        {feature.icon}
                      </div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-white">{feature.title}</h4>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-medium leading-relaxed mt-2">{feature.description}</p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 6. Modern Tech Stack Showcase */}
        <section className="w-full py-28 border-b border-zinc-900 bg-zinc-950/5">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-xs font-black uppercase tracking-widest text-zinc-550 mb-4">System Infrastructure</h2>
              <h3 className="text-3xl font-black text-white">Platform Stack</h3>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.1 }}
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {techStack.map((stack, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                  className="bg-zinc-950/40 border border-white/5 rounded-xl p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-5 border-b border-white/5 pb-3">
                    <div className="text-white bg-white/5 p-2 rounded-md border border-white/10">
                      {stack.icon}
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-white">{stack.category}</h4>
                  </div>
                  <ul className="space-y-2.5">
                    {stack.technologies.map((tech, techIndex) => (
                      <motion.li
                        key={techIndex}
                        className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-wide"
                      >
                        <CheckCircle className="h-3 w-3 text-white" />
                        {tech}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 7. Premium Creator Card */}
        <section className="w-full py-28 relative">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="max-w-4xl mx-auto px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={fadeInUp}
            >
              <Card className="bg-zinc-950/40 border border-zinc-900 rounded-xl relative overflow-hidden group hover:border-zinc-800 transition-colors duration-300">
                <div className="absolute inset-0 premium-grid-dot opacity-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/[0.01] to-transparent pointer-events-none" />
                <CardContent className="p-8 sm:p-12 relative z-10 text-center flex flex-col gap-6 items-center">
                  <Badge variant="outline" className="border-white/20 text-white font-bold text-[10px] px-3 py-0.5 rounded-full uppercase">Creator Base</Badge>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Built by Ahmed, for Everyone</h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-medium max-w-2xl">
                    Mockrithm was created by Ahmed — someone who understands the challenges of technical interviews firsthand. Having experienced the cognitive friction, delivery pacing hurdles, and prep bottlenecks, I built this system to represent what high-density preparation should feel like.
                  </p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                    Minimalist Interface • Robust AI Diagnostics • Zero Fillers
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  )
}
