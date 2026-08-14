"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function QuoteSection() {
  return (
    <motion.section
      className="lp-section border-t border-lp-outline"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="lp-container">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-10">
          {/* Large quote mark */}
          <span
            className="text-8xl leading-none font-serif text-lp-secondary select-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>

          <blockquote className="lp-font-headline-md text-lp-primary max-w-2xl -mt-8">
            Replicating Typeform&apos;s pixel-perfect UX was step one — now I&apos;m ready
            to step in, collaborate with the team, and build production-grade AI systems.
          </blockquote>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-lp-surface shadow-xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3CRtgKkaB-dCYnLrHE9p7DX2rwwRVRMFvWY677Nhfr8w06YEGPY-PCT5BDhs3ITbeXuXln60hBYcEDDbGYp12URbfRzkhZUF7Hp5xm7db8YaKaWACkEOKRJo5Ybgg02lJamKei8Cicp9_VjIbUC9-VTRj28M2tgK6jPkJM-loVp6DueVRpH7_UbvSKs3eWnuOf6pBXGwxDiZHfNppKPeWOxiKbgac7OQtaE0rLf4aiDVWfRtxc1C3B3tW1DVRFe8vFVo"
                alt="Dharun SA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center">
              <p className="lp-font-btn font-semibold text-lp-primary">Dharun SA</p>
              <p className="lp-font-body text-lp-muted">Incoming SDE Intern @ Scaler AI</p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
