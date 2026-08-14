"use client";

import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="8" width="6" height="16" rx="3" fill="rgba(255,255,255,0.9)" />
              <rect x="12" y="8" width="16" height="16" rx="5" fill="rgba(255,255,255,0.9)" />
            </svg>
            <span style={{ fontFamily: "var(--font-playfair)" }} className="font-bold text-xl text-white tracking-tight">
              Formix
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {["Privacy", "Terms", "Security", "Cookies"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-white/60 hover:text-white transition-colors text-sm"
                style={{ fontFamily: "var(--font-jakarta)" }}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-white/60 text-sm" style={{ fontFamily: "var(--font-jakarta)" }}>
            © {new Date().getFullYear()} Formix
          </p>
        </div>
      </div>
    </footer>
  );
}
