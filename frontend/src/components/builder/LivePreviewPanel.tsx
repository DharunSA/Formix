"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { QuestionField } from "@/components/respondent/QuestionField";
import { ArrowRightIcon } from "@/components/ui/icons";

export function LivePreviewPanel({
  question,
  index,
  total,
  themeColor,
}: {
  question: Question | null;
  index: number;
  total: number;
  themeColor: string;
}) {
  const [value, setValue] = useState<unknown>(null);

  if (!question) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-ink-soft">
        Select a question to preview it
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col rounded-2xl border border-border bg-white overflow-hidden"
      style={{ ["--tf-accent" as string]: themeColor }}
    >
      <div className="h-1 bg-neutral-100">
        <div
          className="h-full transition-all"
          style={{ width: `${((index + 1) / Math.max(total, 1)) * 100}%`, background: themeColor }}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-10 overflow-y-auto tf-scrollbar" key={question.id}>
        <div className="text-xs font-medium text-ink-soft mb-3">
          {index + 1} <ArrowRightIcon width={10} height={10} className="inline -mt-0.5" /> {total}
        </div>
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
