"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { useAuth } from "@/lib/auth-context";

export function CtaSection() {
  const { user } = useAuth();
  return (
    <motion.section
      className="lp-section text-center"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="lp-container flex flex-col items-center gap-8">
        <h2
          className="text-lp-primary max-w-3xl mx-auto leading-[1.08] tracking-[-0.02em]"
          style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 400 }}
        >
          Ready for a simpler workflow?
        </h2>
        <p className="lp-font-body-lg text-lp-muted max-w-lg">
          Join thousands of teams who have replaced clunky forms with beautiful,
          conversational experiences that people actually enjoy filling out.
        </p>
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="lp-btn-primary lp-font-btn px-10 py-5 text-lg shadow-2xl hover:shadow-lp-primary/20 transition-all"
        >
          {user ? "Go to Dashboard" : "Get started free"}
        </Link>
        <p className="lp-font-label text-lp-muted">
          No credit card required · Free plan available
        </p>
      </div>
    </motion.section>
  );
}
