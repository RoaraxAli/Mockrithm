"use client";

export default function AwwwardsHero() {
  const handleJourneyBegin = () => {
    window.location.href = "https://accounts.mockrithm.me/sign-up";
  };

  const navyThemeStyles = {
    "--background": "201 100% 13%",
    "--foreground": "0 0% 100%",
    "--muted-foreground": "240 4% 66%",
    "--primary": "0 0% 100%",
    "--primary-foreground": "0 0% 4%",
    "--secondary": "0 0% 10%",
    "--muted": "0 0% 10%",
    "--accent": "0 0% 10%",
    "--border": "0 0% 18%",
    "--input": "0 0% 18%",
  } as React.CSSProperties;

  return (
    <div
      id="awwwards-hero"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden select-none bg-[hsl(201,100%,13%)]"
      style={navyThemeStyles}
    >
      {/* Fullscreen Looping Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
      />

      {/* Navigation Bar */}
      <nav className="relative z-10 w-full max-w-7xl mx-auto px-8 py-6 flex items-center justify-between font-sans">
        {/* Logo */}
        <span
          className="text-3xl tracking-tight text-white select-none cursor-pointer"
          style={{ fontFamily: "'Instrument Serif', serif" }}
          onClick={() => { window.location.href = "https://mockrithm.me"; }}
        >
          Mockrithm<sup className="text-xs">®</sup>
        </span>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <span className="text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me"; }}>
            Home
          </span>
          <span className="text-[hsl(240,4%,66%)] hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://games.mockrithm.me"; }}>
            Games
          </span>
          <span className="text-[hsl(240,4%,66%)] hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://docs.mockrithm.me"; }}>
            Docs
          </span>
          <span className="text-[hsl(240,4%,66%)] hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me/blog"; }}>
            Blog
          </span>
          <span className="text-[hsl(240,4%,66%)] hover:text-white cursor-pointer transition-colors duration-200" onClick={() => { window.location.href = "https://mockrithm.me/contact"; }}>
            Reach Us
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={handleJourneyBegin}
          className="liquid-glass rounded-full px-6 py-2.5 text-sm text-white font-medium hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-lg active:scale-95 border-none outline-none"
        >
          Begin Journey
        </button>
      </nav>

      {/* Hero Content Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40 max-w-7xl mx-auto w-full">
        {/* Headline */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-white animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{"  "}
          <em className="not-italic text-[hsl(240,4%,66%)] font-normal">
            talent
          </em>{" "}
          rises <br />
          <em className="not-italic text-[hsl(240,4%,66%)] font-normal">
            through the practice.
          </em>
        </h1>

        {/* Subtext */}
        <p className="text-[hsl(240,4%,66%)] text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans animate-fade-rise-delay">
          We're building tools for sharp developers, bold engineering leaders, and quiet builders.
          Amid the noise, we construct private spaces for focused practice and real skill development.
        </p>

        {/* Big CTA */}
        <button
          onClick={handleJourneyBegin}
          className="liquid-glass rounded-full px-14 py-5 text-base text-white font-medium mt-12 hover:scale-[1.03] transition-all duration-300 cursor-pointer shadow-xl active:scale-95 border-none outline-none animate-fade-rise-delay-2"
        >
          Begin Journey
        </button>
      </main>
    </div>
  );
}
