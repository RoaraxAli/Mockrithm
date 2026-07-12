"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import MarketingNavbar from "@/components/shared/MarketingNavbar";
import Footer from "@/components/shared/Footer";
import FeedbackForm from "@/components/FeedbackForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white relative overflow-hidden font-mona-sans selection:bg-white selection:text-black flex flex-col">
      <MarketingNavbar />

      {/* Abstract Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/[0.02] blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-white/[0.01] blur-[120px] rounded-full" />
        <div className="absolute inset-0 premium-grid-dot opacity-10" />
      </div>

      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-6 pt-40 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Info & Story */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-10"
          >
            <div>
              <h1 
                className="text-5xl md:text-7xl font-normal tracking-[-2px] leading-[1.1] text-white mb-6"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Get in <em className="text-white/60 italic font-light">touch</em>
              </h1>
              <p 
                className="text-base md:text-lg text-zinc-400 leading-relaxed font-medium max-w-md"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Have questions, feedback, or need support? Send us a message directly and our team will get back to you shortly. We're building this for you.
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              {/* Contact Method: Email */}
              <div className="flex items-start gap-4 group cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                  <Mail className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                </div>
                <div className="flex flex-col gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Email Us</span>
                  <a href="mailto:support@mockrithm.me" className="text-lg font-medium text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
                    support@mockrithm.me <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                  <span className="text-sm text-zinc-500">We typically reply within 24 hours.</span>
                </div>
              </div>

              {/* Contact Method: Location */}
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white/70" />
                </div>
                <div className="flex flex-col gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Location</span>
                  <span className="text-lg font-medium text-white">Global / Remote</span>
                  <span className="text-sm text-zinc-500">Built in the cloud, for the world.</span>
                </div>
              </div>

              {/* Contact Method: Hours */}
              <div className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-white/70" />
                </div>
                <div className="flex flex-col gap-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Operating Hours</span>
                  <span className="text-lg font-medium text-white">24/7 Platform</span>
                  <span className="text-sm text-zinc-500">Support: Mon-Fri, 9AM-5PM EST</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="relative w-full rounded-3xl border border-white/10 bg-zinc-900/40 p-8 md:p-12 backdrop-blur-md overflow-hidden">
              <div className="absolute inset-0 premium-grid-dot opacity-5 pointer-events-none" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-normal text-white mb-8" style={{ fontFamily: "'Instrument Serif', serif" }}>
                  Send a Message
                </h3>
                {/* 
                  FeedbackForm internally is likely styled with bg/cards. 
                  If it has its own heavy backgrounds, we might need to adjust it, 
                  but usually it works well inside a container.
                */}
                <div className="form-container-override">
                  <FeedbackForm />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </main>

      <Footer />
    </div>
  );
}