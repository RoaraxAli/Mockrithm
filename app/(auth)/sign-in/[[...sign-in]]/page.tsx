"use client";

import { SignIn } from "@clerk/nextjs";
import { Circle } from "lucide-react";
import { motion } from "framer-motion";

function StepItem({ number, text, active }: { number: number; text: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-2xl w-full max-w-sm transition-all duration-300 ${
      active 
        ? "bg-white text-black border border-white" 
        : "bg-brand-gray text-white border-none"
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
        active ? "bg-black text-white" : "bg-white/10 text-white/40"
      }`}>
        {number}
      </div>
      <span className="font-medium text-sm tracking-tight">{text}</span>
    </div>
  );
}

export default function SignInPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-black selection:bg-white/30 p-2 lg:p-4 font-sans text-white overflow-y-auto lg:overflow-hidden relative z-[100]">
      {/* Left Column (Hero & Video) - Hidden on mobile, flex on desktop */}
      <section className="relative hidden lg:flex w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source 
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" 
            type="video/mp4" 
          />
        </video>
        
        {/* Content Container */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 w-full max-w-xs space-y-8"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <Circle className="w-5 h-5 fill-white text-white" />
            <span className="text-xl font-semibold tracking-tight">Mockrithm</span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h2 className="text-4xl font-medium tracking-tight whitespace-nowrap">Welcome Back</h2>
            <p className="text-white/60 text-sm leading-relaxed px-4">
              Access your career calibration workspace and tools.
            </p>
          </motion.div>

          {/* Steps */}
          <motion.div variants={itemVariants} className="space-y-3">
            <StepItem number={1} text="Authenticate developer keys" active />
            <StepItem number={2} text="Load workspace configs" />
            <StepItem number={3} text="Access interview terminal" />
          </motion.div>
        </motion.div>
      </section>

      {/* Right Column (Sign In Form) */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10 flex flex-col justify-center"
        >
          <SignIn 
            routing="path" 
            path="/sign-in" 
            appearance={{
              variables: {
                colorPrimary: "#FFFFFF",
                colorBackground: "#000000",
                colorText: "#FFFFFF",
                colorTextSecondary: "#A3A3A3",
                colorBorder: "rgba(255, 255, 255, 0.1)",
                colorInputBackground: "#1A1A1A",
                colorInputText: "#FFFFFF",
                fontFamily: "Inter, sans-serif",
              },
              elements: {
                card: "bg-transparent p-0 border-none shadow-none w-full max-w-xl",
                headerTitle: "text-3xl font-medium tracking-tight text-white",
                headerSubtitle: "text-white/40 text-sm mt-1",
                socialButtonsIconButton: "bg-black border border-white/10 hover:bg-white/5 text-white rounded-xl h-11 flex items-center justify-center transition-colors",
                socialButtonsBlockButton: "bg-black border border-white/10 hover:bg-white/5 text-white rounded-xl h-11 flex items-center justify-center transition-colors",
                dividerLine: "bg-white/10",
                dividerText: "text-white/40 uppercase tracking-widest text-[10px] font-semibold bg-black px-4",
                formFieldLabel: "text-sm font-medium text-white mb-2",
                formFieldInput: "bg-[#1A1A1A] border-none rounded-xl h-11 px-4 text-white focus:ring-2 focus:ring-white/20 w-full transition-all",
                formButtonPrimary: "w-full h-14 bg-white text-black font-semibold rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer mt-4",
                footerActionText: "text-white/40 text-sm",
                footerActionLink: "text-white hover:text-white/80 transition-colors font-medium",
                footer: "bg-black",
                header: "space-y-1 mb-6",
                form: "space-y-4",
                alert: "bg-zinc-900 border border-white/10 text-white rounded-xl",
                alertText: "text-white/80 text-xs",
              }
            }}
          />
        </motion.div>
      </section>
    </main>
  );
}
