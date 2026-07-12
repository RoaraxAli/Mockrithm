"use client";

export default function AwwwardsHero() {
  const handleJourneyBegin = () => {
    window.location.href = "https://accounts.mockrithm.me/sign-up";
  };

  return (
    <section
      id="awwwards-hero"
      className="relative w-full h-screen flex flex-col overflow-hidden select-none"
    >
      {/* Fullscreen Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="/upscaled-video.mp4"
      />

      {/* Dark overlay for text readability */}
      <div className="fixed inset-0 bg-black/30 z-[1]" />

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <span
          className="text-2xl md:text-3xl tracking-tight text-white select-none cursor-pointer"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          onClick={() => { window.location.href = "https://mockrithm.me"; }}
        >
          Mockrithm<sup className="text-[10px] align-super">®</sup>
        </span>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
          <span className="text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me"; }}>
            Home
          </span>
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://games.mockrithm.me"; }}>
            Games
          </span>
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://resume.mockrithm.me"; }}>
            Resume
          </span>
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://docs.mockrithm.me"; }}>
            Docs
          </span>
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me/blog"; }}>
            Blog
          </span>
          <span className="text-white/60 hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me/contact"; }}>
            Reach Us
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleJourneyBegin}
          className="liquid-glass rounded-full px-5 py-2 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-lg active:scale-95 border-none outline-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Begin Journey
        </button>
      </nav>

      {/* Hero Content Section — vertically centered in remaining space */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full">
        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-[5.5rem] leading-[1] tracking-[-2px] font-normal text-white animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{" "}
          <em className="not-italic text-white/60">talent</em>{" "}
          rises <br className="hidden sm:block" />
          <em className="not-italic text-white/60">through the practice.</em>
        </h1>

        {/* Subtext */}
        <p
          className="text-white/60 text-base sm:text-lg max-w-2xl mt-6 leading-relaxed animate-fade-rise-delay"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          We build tools for sharp developers, bold engineering leaders, and quiet builders.
          Amid the noise, we create private spaces for focused practice and real skill growth.
        </p>

        {/* Big CTA */}
        <button
          onClick={handleJourneyBegin}
          className="liquid-glass rounded-full px-12 py-4 text-base text-white font-medium mt-10 hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-xl active:scale-95 border-none outline-none animate-fade-rise-delay-2"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Begin Journey
        </button>
      </div>

      {/* Scroll indicator pinned to bottom */}
      <div className="relative z-10 flex justify-center pb-8">
        <div className="flex flex-col items-center gap-2 opacity-50">
          <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            Scroll to explore
          </span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </section>
  );
}
