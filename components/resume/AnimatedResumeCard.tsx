"use client";

import { motion } from "framer-motion";
import { TEMPLATE_MAPPING } from "./templates";

// Mapping of template IDs to gradient classes and font families
const gradientMap: Record<string, string> = {
  minimal: "from-gray-800 to-gray-700",
  corporate: "from-indigo-800 to-indigo-600",
  cyber: "from-purple-800 to-pink-600",
  modern: "from-blue-800 to-cyan-600",
  creative: "from-pink-800 to-red-600",
  executive: "from-green-800 to-emerald-600",
  academic: "from-yellow-800 to-amber-600",
  elegant: "from-orange-900 to-orange-700",
  tech: "from-teal-800 to-emerald-700",
  compact: "from-rose-800 to-amber-650"
};

const fontMap: Record<string, string> = {
  minimal: "font-sans",
  corporate: "font-serif",
  cyber: "font-mono",
  modern: "font-sans",
  creative: "font-sans",
  executive: "font-serif",
  academic: "font-serif",
  elegant: "font-serif",
  tech: "font-mono",
  compact: "font-sans"
};

interface AnimatedResumeCardProps {
  templateId: string;
}

export default function AnimatedResumeCard({ templateId }: AnimatedResumeCardProps) {
  const baseId = TEMPLATE_MAPPING[templateId.toLowerCase()] || templateId.toLowerCase();
  const gradient = gradientMap[baseId] ?? "from-gray-800 to-gray-700";
  const fontClass = fontMap[baseId] ?? "font-sans";

  return (
    <motion.div
      className={`bg-gradient-to-br ${gradient} rounded-xl shadow-xl p-4 overflow-hidden ${fontClass}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03, rotate: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header placeholder – avatar + name line */}
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 bg-gray-600 rounded-full mr-2 animate-pulse" />
        <div className="flex-1 h-3 bg-gray-600 rounded animate-pulse" style={{ width: "45%" }} />
      </div>
      {/* Title placeholder */}
      <div className="h-3 bg-gray-600 rounded animate-pulse mb-2" style={{ width: "30%" }} />
      {/* Section blocks – skills, experience, education */}
      {["skills", "experience", "education"].map((section, idx) => (
        <div key={section} className="mb-2">
          <div className="h-2 bg-gray-500 rounded animate-pulse mb-1" style={{ width: "20%" }} />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-2 bg-gray-600 rounded animate-pulse mb-1"
              style={{ width: `${70 - i * 10}%` }}
            />
          ))}
        </div>
      ))}
    </motion.div>
  );
}
