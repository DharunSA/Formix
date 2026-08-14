"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="lp-nav fixed top-0 w-full z-50">
      <div className="lp-container flex justify-between items-center h-16">
        {/* Logo — icon stays, text collapses on scroll */}
        <Link href="/" className="flex items-center gap-2 text-lp-primary overflow-hidden">
          {/* Icon — always visible */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <rect x="4" y="8" width="6" height="16" rx="3" fill="#261c23" />
            <rect x="12" y="8" width="16" height="16" rx="5" fill="#261c23" />
          </svg>

          {/* Text — slides left and fades out when scrolled */}
          <AnimatePresence initial={false}>
            {!scrolled && (
              <motion.span
                key="logo-text"
                className="lp-font-headline-md font-bold tracking-tight text-lp-primary whitespace-nowrap overflow-hidden"
                initial={{ opacity: 0, x: -12, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -10, width: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ display: "inline-block" }}
              >
                Formix
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* CTA — Direct Instant Access to Dashboard */}
        <Link href="/dashboard" className="lp-btn-primary lp-font-btn">
          Open App — Free Access
        </Link>

      </div>
    </header>
  );
}
