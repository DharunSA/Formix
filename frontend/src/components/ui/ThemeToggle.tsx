"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Theme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "./icons";

export function ThemeToggle({
  theme,
  onToggle,
  mounted,
}: {
  theme: Theme;
  onToggle: () => void;
  mounted: boolean;
}) {
  if (!mounted) return <div className="w-9 h-9 shrink-0" aria-hidden />;

  return (
    <button
      onClick={onToggle}
      className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-surface cursor-pointer transition-all duration-300 active:scale-90"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          {theme === "dark" ? <SunIcon width={17} height={17} /> : <MoonIcon width={17} height={17} />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
