"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="lp-section-hero">
      <div className="lp-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Copy */}
          <motion.div
            className="lg:col-span-6 flex flex-col gap-6 z-10"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-lp-secondary rounded-full px-4 py-1.5 w-fit">
              <span className="w-2 h-2 rounded-full bg-lp-accent-purple"></span>
              <span className="lp-font-label text-lp-accent-purple">Now with AI-powered insights</span>
            </div>

            <h1 className="lp-font-display text-lp-primary leading-[1.08] tracking-[-0.02em]">
              Take your<br />
              <span className="italic">toolbox</span> to the<br />
              next level
            </h1>

            <p className="lp-font-body-lg text-lp-muted max-w-lg">
              Save time with beautiful, interactive forms that connect to your
              favorite apps — and let your data flow seamlessly.
            </p>

            <div className="flex flex-wrap gap-4 mt-2">
              <Link href="/signup" className="lp-btn-primary lp-font-btn px-8 py-4 text-base">
                Get started — it&apos;s free
              </Link>
              <Link href="#features" className="lp-btn-secondary lp-font-btn px-8 py-4 text-base">
                See how it works
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex -space-x-2">
                {["#e7dff1", "#b7ac74", "#d3c2cb", "#efeeec"].map((bg, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ backgroundColor: bg }}
                  />
                ))}
              </div>
              <p className="lp-font-label text-lp-muted">
                <strong className="text-lp-primary">10,000+</strong> teams already building with Formix
              </p>
            </div>
          </motion.div>

          {/* Right: Hero image */}
          <motion.div
            className="lg:col-span-6 relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-[600px]">
              {/* Decorative blob */}
              <div
                className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-30 blur-3xl"
                style={{ background: "radial-gradient(circle, #e7dff1, #f0dee7)" }}
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZuIP2Pi5Ce-wKBfarbeFx6bs__UWiQm7OLSuABbT3RUlTlmOaVRZ5gzsz6WBuGRlTWc_Ea5vzHAZqoJ6PEReqlFq2lzyilczaYsr0uFy-sJMH4L4Z4_oKOM2Fn3aBQux768SU17ZeZJmLieQWEg_d0oqUBfUUKl5ogkaGS8x8oYR7HSKNfuvqGL_ny66vntpSE8z5aJWvOFQ205dQ6CrfnPUb0erpC-6itoaCdv0ZfE6eTRCx-aCl2Xmr-Eml8bU1cM"
                alt="Formix integration ecosystem"
                className="w-full h-auto object-contain drop-shadow-2xl relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
