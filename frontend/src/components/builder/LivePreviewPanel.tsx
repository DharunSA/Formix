"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Question } from "@/lib/types";
import { QuestionField } from "@/components/respondent/QuestionField";
import { ArrowRightIcon } from "@/components/ui/icons";
import { getIosEmojiById } from "@/lib/ios-emojis";

export function LivePreviewPanel({
  question,
  index,
  total,
  themeColor,
  themeBackground,
}: {
  question: Question | null;
  index: number;
  total: number;
  themeColor: string;
  themeBackground?: string;
}) {
  const [value, setValue] = useState<unknown>(null);

  // This panel mimics the public respondent screen, which always renders with the
  // form's own light/dark theme_background - never the creator's app-wide dark
  // mode preference. Re-pin the shared design tokens to their light values here so
  // text stays legible if this panel happens to be nested under a `.dark` ancestor.
  const previewTokens = {
    ["--tf-accent" as string]: themeColor,
    ["--ink" as string]: "#191919",
    ["--ink-soft" as string]: "#4a4a4a",
    ["--border" as string]: "#e6e6e4",
    ["--surface" as string]: "#f8f8f6",
    ["--danger" as string]: "#dc2626",
    colorScheme: "light" as const,
  };

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-ink-soft" style={previewTokens}>
        Select a question to preview it
      </div>
    );
  }

  const activeToon = getIosEmojiById(question.settings?.toon_id as string | undefined);
  const activeMediaUrl = question.settings?.media_url as string | undefined;

  return (
    <div
      className="h-full flex flex-col rounded-2xl border border-border overflow-hidden"
      style={{ ...previewTokens, background: themeBackground || "#ffffff" }}
    >
      <div className="h-1 bg-neutral-100">
        <div
          className="h-full transition-all"
          style={{ width: `${((index + 1) / Math.max(total, 1)) * 100}%`, background: themeColor }}
        />
      </div>
      <div
        className="flex-1 flex flex-col justify-center px-8 py-10 overflow-y-auto tf-scrollbar tf-fade-in"
        key={question.id}
      >
        <div className="text-xs font-medium text-ink-soft mb-3">
          {index + 1} <ArrowRightIcon width={10} height={10} className="inline -mt-0.5" /> {total}
        </div>

        {/* Render 3D iOS Emoji or Custom Image attachment */}
        {activeToon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4"
          >
            <img
              src={activeToon.url}
              alt={activeToon.name}
              className="w-16 h-16 object-contain drop-shadow-md"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = "flex";
              }}
            />
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-4xl shadow-sm select-none hidden">
              {activeToon.symbol}
            </div>
          </motion.div>
        )}

        {activeMediaUrl && (
          <motion.div
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="mb-4"
          >
            <img
              src={activeMediaUrl}
              alt="Question attachment"
              className="max-h-48 max-w-full rounded-2xl object-cover shadow-sm border border-border"
            />
          </motion.div>
        )}

        <h3 className="text-xl font-semibold text-ink mb-1 flex items-start gap-1">
          {question.title || "Untitled question"}
          {question.required && <span className="text-danger">*</span>}
        </h3>
        {question.description && <p className="text-sm text-ink-soft mb-5">{question.description}</p>}
        <div className={question.description ? "" : "mt-5"}>
          <QuestionField question={question} value={value} onChange={setValue} autoFocus={false} />
        </div>
      </div>
      <div className="px-8 py-3 border-t border-border text-xs text-ink-soft">Live preview - not saved</div>
    </div>
  );
}
