"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const features = [
  {
    tag: "Automation",
    title: "Automate your customer journey",
    body: "Grow your audience effortlessly with forms that integrate with your CRM and marketing automation platform. Trigger workflows, segment leads, and never lose a response.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDq3wABQCx58TXIZu0ZKkCpz_1mIF1TCCBSED5ft3AtWZH5zOgFXKQ9n6GC0GGVqrmlEF_7zsDkoYrUMexbdnmfG91_H0oBDhtHpLiMFaSaAJuDvkFk5tSQDv1DvwxJGzkSq-EZYhLYn3hNp_SSPjWpQF6phEUN5wB50cyEuBaI1Z6YVOnNhFHOUFQOcv-OVp775p3-n1dVD5e2wMa_r2PQTel8d84oQ9D5Cjdtj1ySWBeJ5qcdxQw8vneFQBtBfWc_EhI",
    alt: "Automate your customer journey",
    imgRight: false,
    accent: "#e7dff1",
  },
  {
    tag: "Conversions",
    title: "Turn visitors into customers",
    body: "Save time scheduling calls with automatic booking via Calendly. You can even let prospects buy directly from your form with our Stripe integration.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAoImbKHjAOM92aqOFCZwNiRVmNaWmwAbt4dM6Pd6WrwMUCkkwFVQjmuabaINk0qm3V0H5PrxGKlrKvToTyashGjjrW4ciPzPiDWs11KplXFTwjRsUDfiZVC_PyrmKFExq_B7Gq7KN0TVDDEFg2NT-0saBHhNPHNJKDgqh3sQ0YsB8vx0Z6aAb8rK9ZZIcs8P6-cuNEapWmXJMWVLU2NiZkuCEz9Jno3kseDbsmtPBLU1lLrznBFgG_gkT1IoCSySgqpOw",
    alt: "Turn visitors into customers",
    imgRight: true,
    accent: "#f0e3a6",
  },
  {
    tag: "Analytics",
    title: "Do more with your data",
    body: "See how people interact with your forms. Send that data where you need it automatically, so you can adjust what you're doing — and make more sales.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1_kARTkCFwvBXSWeaZC1Kdx7qfCudhFtD9YKwUr_LFTyNy3fgc_4Dvn-9fpT_igsNp5OoicvWRV3py2T7Ze8GasOkbOULu-_S5wUKESxncoexXm9prSyfldl4RxwYgrlwjelzgQbpMcFtWKMAERtdqj0Oo5ZlO5uk_99lEYpB22C4r3_CnEHUj8cx-R_FBvHCzewg5vRDukxvzI_F8-l2jgCggUStDZjv2kTZSX_f6ekWFVfVhYxWj6h_297OOEhsC_o",
    alt: "Do more with your data",
    imgRight: false,
    accent: "#d3c2cb",
  },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Magnetic tilt image card ───────────────────────────────── */
function TiltCard({
  src,
  alt,
  accent,
}: {
  src: string;
  alt: string;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const springConfig = { stiffness: 160, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleEnter = () => scale.set(1.025);
  const handleLeave = () => {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d", perspective: 800 }}
      className="relative h-[420px] flex items-center justify-center rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Accent background blob */}
      <motion.div
        className="absolute inset-0 rounded-3xl transition-opacity duration-500"
        style={{ backgroundColor: accent }}
        initial={{ opacity: 0.45 }}
        whileHover={{ opacity: 0.65 }}
      />

      {/* Subtle inner glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        initial={{ boxShadow: "inset 0 0 0px 0px rgba(38,28,35,0)" }}
        whileHover={{ boxShadow: "inset 0 0 40px 0px rgba(38,28,35,0.06)" }}
        transition={{ duration: 0.4 }}
      />

      {/* Image — lifts slightly on hover (translateZ via scale) */}
      <motion.img
        src={src}
        alt={alt}
        className="relative z-10 w-full h-full object-contain"
        style={{ translateZ: 20 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.5, ease }}
      />
    </motion.div>
  );
}

/* ─── Arrow link with animated underline ─────────────────────── */
function AnimatedLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      className="group relative lp-font-label text-lp-primary w-fit mt-2 flex items-center gap-1 overflow-hidden"
    >
      <span className="relative">
        Learn more
        {/* underline that wipes in */}
        <span
          className="absolute bottom-0 left-0 h-[1.5px] w-full bg-lp-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"
        />
      </span>
      {/* Arrow slides right on hover */}
      <motion.span
        className="inline-block"
        initial={{ x: 0 }}
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        →
      </motion.span>
    </a>
  );
}

/* ─── Main section ───────────────────────────────────────────── */
export function FeaturesSection() {
  return (
    <section id="features" className="lp-section">
      <div className="lp-container flex flex-col gap-24 lg:gap-32">
        {/* Section header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <span className="lp-font-label uppercase tracking-widest text-lp-accent-purple mb-3 block">
            Features
          </span>
          <h2 className="lp-font-headline text-lp-primary max-w-2xl mx-auto">
            Everything you need to capture and act on data
          </h2>
        </motion.div>

        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, delay: i * 0.08, ease }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Image — tilt card */}
            <div className={f.imgRight ? "md:order-2" : "md:order-1"}>
              <TiltCard src={f.img} alt={f.alt} accent={f.accent} />
            </div>

            {/* Text — staggered children */}
            <motion.div
              className={`flex flex-col gap-5 ${f.imgRight ? "md:order-1 md:pr-12" : "md:order-2 md:pl-12"}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 + i * 0.08 } },
              }}
            >
              {/* Tag */}
              <motion.span
                className="lp-font-label uppercase tracking-widest text-lp-accent-purple"
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}
              >
                {f.tag}
              </motion.span>

              {/* Headline */}
              <motion.h3
                className="lp-font-headline text-lp-primary"
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
              >
                {f.title}
              </motion.h3>

              {/* Body */}
              <motion.p
                className="lp-font-body-lg text-lp-muted"
                variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
              >
                {f.body}
              </motion.p>

              {/* Link */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } }}
              >
                <AnimatedLink href="/signup" />
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
