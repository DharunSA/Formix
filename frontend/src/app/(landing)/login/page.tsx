"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const slides = [
  {
    id: "slide-1",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxujM_mWlxSZrT-JVqeTT1FKeQo_5CjSnzgHp9_edGUueMbMxEWnBnDmNE3k4PDcpA1CeCLdd0axlNINyL_x9iZLiMh7O2NL1Hlavccoe3QialB26g3w1uS2cCtGSy_Sm4UNAl7-Wr9id9OnAsK-79n8U_6sKOYBX5agD7k1i7uVB3_bI-Z-MnxkzkfyFAaPmhjalHaVOqsgvS1TCalZpXHiE7TOlYTvEzGa2KRzUAUc5iLZgSfsAB53p6fxnmIkJm1UQ",
    alt: "Collect responses interface",
  },
  {
    id: "slide-2",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfhDhIWPZ7ZSzmlAOEa74ZyrRdjXKW8kH01MqCRuKVxN4LlCKCQL07zDPWuCBV-hG0mjt9Nso3UdqjQn4OsZ3wZe3f91fax6WYe4OBOikRdc1GN6reznx1cTdlzQ0cTcYuYJdtjkB520SDlBpSBcS1kvezH29z2aq2dU1v8TuKbRl7qc-xC7Qw7tvDpN_o8WkHkLxauJbG7ihLGi7SlY-b8kVzN3OfQGFautVW1NjWbsku9Z4LiLB3zkfe4obPJNsf44k",
    alt: "Manage your audience interface",
  },
  {
    id: "slide-3",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0DPG5CuOPLGxFTWky0VVfyflH35EXjpVubGcXNv3XhnICktSck-nbJJ_mOyYtsHxEmtnxT8ePnyEubFBAZFCNv0Kx9vxBf9ktjOtf2-Icfioi3e_Dg5q6Pw2GaoVR2_DxJsI_fy8XJslayeLydk1SY7hl1Hng6yqb1kq8TruxufUBpVx3Tg2KeISvcA3b61D8HjZgSvWhBPOqwcfaO1sbUGl5k_7F9qYiGKymEVtXitmwPxNZXjcvs3OqFlfWV8_K7SE",
    alt: "Automate workflows interface",
  },
];

export default function LoginPage() {
  const router = useRouter();


  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [email, setEmail] = useState("");


  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, next]);

  const { signInWithEmail, signUpWithEmail, signInWithProvider } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const handleOAuth = async (provider: "google" | "azure") => {
    if (provider === "azure") {
      toast.info("Microsoft Sign-In is not configured yet. Please use Google or Email to log in.");
      return;
    }
    try {
      const { error } = await signInWithProvider(provider);
      if (error) {
        toast.error(error.message);
      }
    } catch {
      toast.error("Failed to authenticate with " + provider);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const { error } = await signInWithEmail(email);
      if (error) {
        // If user doesn't exist, attempt sign up or notify user
        const { error: signUpErr } = await signUpWithEmail(email);
        if (signUpErr) {
          toast.error(error.message);
        } else {
          toast.success("Account created! Redirecting...");
          router.push("/dashboard");
        }
      } else {
        toast.success("Logged in successfully!");
        router.push("/dashboard");
      }
    } catch {
      toast.error("An error occurred during login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-[var(--font-jakarta)]">
      {/* Top Nav */}
      <nav className="flex justify-between items-center w-full px-6 md:px-10 h-20 absolute top-0 left-0 right-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <rect x="4" y="8" width="6" height="16" rx="3" fill="#261c23" />
            <rect x="12" y="8" width="16" height="16" rx="5" fill="#261c23" />
          </svg>
          <span style={{ fontFamily: "var(--font-playfair)" }} className="font-bold text-xl tracking-tight text-[#261c23]">
            Formix
          </span>
        </Link>
        <div className="flex items-center gap-4 text-sm text-[#4c4549]" style={{ fontFamily: "var(--font-jakarta)" }}>
          <span className="hidden sm:inline">Have a question?</span>
          <a href="mailto:hello@formix.app" className="hover:text-[#261c23] transition-colors underline">
            Contact us
          </a>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row pt-20">
        {/* Left: Log in form */}
        <section className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16 bg-[#faf9f7]">
          <div className="w-full max-w-[400px] flex flex-col gap-6">
            <div>
              <h1
                style={{ fontFamily: "var(--font-playfair)" }}
                className="text-4xl font-normal text-[#261c23] mb-2"
              >
                Log in
              </h1>
              <p className="text-[#4c4549] text-base" style={{ fontFamily: "var(--font-jakarta)" }}>
                Build forms, gather responses, and automate your workflows.
              </p>
            </div>

            {/* OAuth buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleOAuth("google")}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-[#cec4c8] rounded-xl bg-white hover:bg-[#f4f3f1] transition-colors text-[#1a1c1b] font-medium shadow-sm cursor-pointer"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l2.85-2.22.83-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleOAuth("azure")}
                className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-[#cec4c8] rounded-xl bg-white hover:bg-[#f4f3f1] transition-colors text-[#1a1c1b] font-medium shadow-sm cursor-pointer"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                <svg width="20" height="20" viewBox="0 0 21 21" fill="none">
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                Continue with Microsoft
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#cec4c8]" />
              <span className="text-xs uppercase text-[#7d7579]" style={{ fontFamily: "var(--font-jakarta)" }}>or</span>
              <div className="flex-1 h-px bg-[#cec4c8]" />
            </div>

            {/* Email form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="login-email"
                  className="text-sm font-medium text-[#1a1c1b]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                >
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-3 border border-[#cec4c8] rounded-xl bg-white focus:border-[#261c23] focus:ring-0 focus:outline-none transition-colors text-base text-[#1a1c1b] placeholder-[#7d7579]"
                  style={{ fontFamily: "var(--font-jakarta)" }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#261c23] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Continue with email
              </button>
            </form>

            <div className="text-center flex flex-col gap-3 mt-2">
              <a
                href="#"
                className="text-sm text-[#1a1c1b] underline hover:text-[#261c23] transition-colors"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                Log in with SSO
              </a>
              <div className="h-px bg-[#e9e8e6]" />
              <p className="text-sm text-[#4c4549]" style={{ fontFamily: "var(--font-jakarta)" }}>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-[#261c23] font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* Right: Feature slideshow */}
        <section
          className="hidden md:flex w-1/2 flex-col justify-center items-center p-8 md:p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #261c23 40%, #3a2233 100%)" }}
        >
          <div className="w-full max-w-[560px] flex flex-col items-center gap-6">
            <div className="text-center text-white z-10">
              <h2
                style={{ fontFamily: "var(--font-playfair)" }}
                className="text-2xl font-normal mb-1"
              >
                Continue exploring powerful features
              </h2>
              <p className="text-white/70 text-base" style={{ fontFamily: "var(--font-jakarta)" }}>
                that make data collection effortless
              </p>
            </div>

            {/* Slides */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl z-10">
              {slides.map((s, i) => (
                <img
                  key={s.id}
                  src={s.src}
                  alt={s.alt}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl transition-opacity duration-500"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#261c23]/60 to-transparent pointer-events-none" />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-5 z-10">
              <button
                onClick={prev}
                className="text-white/50 hover:text-white transition-colors p-2"
                aria-label="Previous slide"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8 10L4 6L8 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="text-white hover:scale-110 transition-transform p-2"
                aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
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

              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setCurrent(i); setIsPlaying(false); }}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ backgroundColor: i === current ? "white" : "rgba(255,255,255,0.3)" }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                className="text-white/50 hover:text-white transition-colors p-2"
                aria-label="Next slide"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Background glow */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: "#e7dff1" }} />
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10 blur-3xl"
            style={{ background: "#f0e3a6" }} />
        </section>
      </main>
    </div>
  );
}
