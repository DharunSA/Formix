"use client";

import Link from "next/link";
import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";

/* ─── Carousel state ───────────────────────────────────── */
const carouselSlides = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDemvbnrRsCYXA3sNdcQ8I7pDHc_c67MalA8ipGrmD5r22xU1jx0-o52P4STfjXtAzNgnDfpp046Nte8H64ZFB2XJFg-C1x6gL5ikSzVjXFFrcRXie7RlUchq0D2DFUgaWe_4R9HceSz68ZU9UDjZlLODuo2j3WMlq1uVPv06ojW6e3dy9MK13FtRvFIdJE0J2Er11RsEdcVbI3iQY-8bKZ_V2ITpYaVY4D5FvG7K85bH-ErnNXJKfCpwF8wCgCtf9ipQM",
    alt: "Form Builder Interface",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuaM8U_wY2MIDZowyn-RuoXlYB2bzqgRFfwjZVFN_FpbLhpwsOL23QVlId4ahQSeVBm8WpodQdezrteC2D5takepjCnvrf4vCS6_hkCNeAjANAZAtXtQz_WyRxQtIexoDeGMZ8tO3AXyqiRi0q51mRYotVzdgvxoxrG9pJg44M2AErdCRj9W-WIRD4tMChgVez7OK9isjFWfcwPqAmwQa0Yg_iHWJVXnONu7EuZoXwjgoyqlLzKQSNUIJG8G5bH6C6BrM",
    alt: "Results Interface",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmQTZDIl1wbd8KRreEDHwVlNqS_dPvPZRCePGDl2PYv5RS1TkNiABmPDDDbhhkAQgVmnWlhbvC-TTR-N9dBtzSQdb6t31E0jL8wb6QGWQUGBrc_dmfrAMC-Lfnt3C7RCl5fHUWeg3pF84_DT-TzEWp5tuL8dTMTejXnmp908SOn1Nu0YRaVnvugLuiGsAdEEEU4su8IHf4EMh1gikIQUtRG9nCHs2_ROsoHtuYQknQMyiqiQL9lcYMxKmvHoMN-bR8-FU",
    alt: "Automations Interface",
  },
];

type CarouselState = { current: number };
type CarouselAction =
  | { type: "next" }
  | { type: "prev" }
  | { type: "goto"; index: number };

function carouselReducer(state: CarouselState, action: CarouselAction): CarouselState {
  const len = carouselSlides.length;
  switch (action.type) {
    case "next": return { current: (state.current + 1) % len };
    case "prev": return { current: (state.current - 1 + len) % len };
    case "goto": return { current: action.index };
  }
}

function getSlideClass(i: number, current: number): string {
  const len = carouselSlides.length;
  if (i === current) return "carousel-active";
  if (i === (current - 1 + len) % len) return "carousel-prev";
  if (i === (current + 1) % len) return "carousel-next";
  return "carousel-hidden";
}

/* ─── Component ─────────────────────────────────────────── */
export default function SignupPage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(carouselReducer, { current: 0 });
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => dispatch({ type: "next" }), 4000);
    return () => clearInterval(id);
  }, [isPlaying]);

  const handleSignup = () => router.push("/dashboard");

  return (
    <>
      <style>{`
        .carousel-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          max-width: 520px;
          margin: auto;
          transition: all 0.6s cubic-bezier(0.4,0,0.2,1);
          opacity: 0;
          transform: scale(0.88) translateY(24px);
          pointer-events: none;
          z-index: 1;
        }
        .carousel-slide img {
          width: 100%;
          height: auto;
          border-radius: 16px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.28);
        }
        .carousel-active {
          opacity: 1;
          transform: scale(1) translateY(0);
          z-index: 3;
          pointer-events: auto;
        }
        .carousel-prev {
          opacity: 0.55;
          transform: scale(0.94) translateX(-16%) translateZ(-60px);
          z-index: 2;
        }
        .carousel-next {
          opacity: 0.55;
          transform: scale(0.94) translateX(16%) translateZ(-60px);
          z-index: 2;
        }
        .carousel-hidden {
          opacity: 0;
          transform: scale(0.85);
          z-index: 0;
        }
      `}</style>

      <div className="min-h-screen flex flex-col md:flex-row font-[var(--font-jakarta)] overflow-x-hidden">

        {/* ── LEFT PANEL: Carousel ──────────────────────────── */}
        <aside
          className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen flex flex-col px-8 py-12 md:p-12 lg:p-16 relative"
          style={{ background: "#382D35" }}
        >
          <div className="flex-grow flex flex-col justify-center items-center mx-auto w-full">
            {/* Carousel container */}
            <div
              className="w-full relative mb-10"
              style={{ minHeight: 340, perspective: "1000px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {carouselSlides.map((slide, i) => (
                <div
                  key={i}
                  className={`carousel-slide ${getSlideClass(i, state.current)}`}
                  aria-hidden={i !== state.current}
                >
                  <img src={slide.src} alt={slide.alt} />
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-6 mb-12">
              <button
                onClick={() => { dispatch({ type: "prev" }); setIsPlaying(false); }}
                className="text-white/50 hover:text-white transition-colors p-2 disabled:cursor-not-allowed"
                aria-label="Previous slide"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 10L4 6L8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="text-white hover:scale-110 transition-transform p-2"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="1" width="3.5" height="12" rx="1" />
                    <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 2V12L11 7L3 2Z" />
                  </svg>
                )}
              </button>

              <div className="flex space-x-2">
                {carouselSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { dispatch({ type: "goto", index: i }); setIsPlaying(false); }}
                    aria-label={`Go to slide ${i + 1}`}
                    className="w-2 h-2 rounded-full transition-all duration-200"
                    style={{ backgroundColor: i === state.current ? "white" : "rgba(255,255,255,0.35)" }}
                  />
                ))}
              </div>

              <button
                onClick={() => { dispatch({ type: "next" }); setIsPlaying(false); }}
                className="text-white/50 hover:text-white transition-colors p-2"
                aria-label="Next slide"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Trust logos strip */}
            <div className="w-full mx-auto">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8vJ4uq7TOpLGvr7Tq3ZkglV5Yx0UC4ONPNcwvIwCz01m3obnw_jBQ9ic_3rNulCML5y5v4636d-Pr4TzPNSYScPvKQTo1Z0G6MI3Mskc2DOzg4-hWBUc7SSMimihlnxN-wXlZgSUO4p-Av7rKeUdRAGuiZlMOFCVTCRpcqY3MRBgZ3FyW_Ce7zUrGJ6IoEDBUDiB1EMToHq4yMOE05Zt5MMAyvufb5IKU71x7I6k7YxfKXUgKVptmaqR3NHuIlc1PGik"
                alt="Trusted by leading brands"
                className="w-full max-w-[500px] mx-auto h-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL: Sign up ─────────────────────────── */}
        <main className="w-full md:w-1/2 bg-white min-h-screen flex flex-col px-6 py-8 md:p-8 lg:p-12 overflow-y-auto">
          {/* Top nav */}
          <div className="flex justify-between items-center w-full mb-12 md:mb-16">
            {/* Language selector */}
            <button
              className="flex items-center gap-2 text-sm text-[#4c4549] border border-[#cec4c8] rounded-lg px-3 py-1.5 hover:bg-[#faf9f7] transition-colors"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              <svg width="16" height="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              English
              <svg width="12" height="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Login link */}
            <div className="text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
              <span className="text-[#4c4549] hidden sm:inline mr-2">Already have an account?</span>
              <Link
                href="/login"
                className="font-medium text-[#261c23] border border-[#cec4c8] rounded px-3 py-1.5 hover:bg-[#faf9f7] transition-colors"
              >
                Log in
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow flex flex-col justify-center items-center max-w-md mx-auto w-full">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <rect x="4" y="8" width="6" height="16" rx="3" fill="#261c23" />
                <rect x="12" y="8" width="16" height="16" rx="5" fill="#261c23" />
              </svg>
              <span
                style={{ fontFamily: "var(--font-jakarta)" }}
                className="font-bold text-2xl tracking-tight text-[#261c23]"
              >
                Formix
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{ fontFamily: "var(--font-playfair)" }}
              className="text-[28px] md:text-[32px] leading-tight font-normal text-center text-[#261c23] mb-10"
            >
              Get better data with conversational forms, surveys, quizzes and more.
            </h1>

            {/* Buttons */}
            <div className="w-full space-y-4">
              <button
                onClick={handleSignup}
                className="w-full flex items-center justify-center gap-3 border border-[#dadad8] rounded-xl py-3.5 px-4 hover:bg-[#faf9f7] transition-colors font-medium text-[#1a1c1b] bg-white shadow-sm"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </button>

              <button
                onClick={handleSignup}
                className="w-full flex items-center justify-center gap-3 border border-[#dadad8] rounded-xl py-3.5 px-4 hover:bg-[#faf9f7] transition-colors font-medium text-[#1a1c1b] bg-white shadow-sm"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Sign up with Microsoft
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dadad8]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-[#7d7579] uppercase" style={{ fontFamily: "var(--font-jakarta)" }}>Or</span>
                </div>
              </div>

              <button
                onClick={handleSignup}
                className="w-full flex items-center justify-center py-3.5 px-4 bg-[#382D35] hover:bg-[#261c23] text-white rounded-xl font-semibold transition-colors"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Sign up with email
              </button>
            </div>

            <p
              className="text-xs text-[#7d7579] text-center mt-6 leading-relaxed"
              style={{ fontFamily: "var(--font-jakarta)" }}
            >
              By creating an account, you agree to our{" "}
              <a href="#" className="underline hover:text-[#261c23]">Terms of Service</a> and{" "}
              <a href="#" className="underline hover:text-[#261c23]">Privacy Policy</a>.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
