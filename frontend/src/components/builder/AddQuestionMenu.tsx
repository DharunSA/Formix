"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTION_TYPES } from "@/lib/question-types";
import type { QuestionType } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/ui/icons";

export function AddQuestionMenu({ onAdd }: { onAdd: (type: QuestionType) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-64 bg-card border border-border rounded-xl shadow-lg py-2 max-h-80 overflow-y-auto tf-scrollbar tf-fade-in z-20">
          {QUESTION_TYPES.map(({ type, label, icon: Icon, hint }) => (
            <button
              key={type}
              onClick={() => {
                onAdd(type);
                setOpen(false);
              }}
              className="w-full flex items-start gap-3 px-3.5 py-2 text-left hover:bg-surface cursor-pointer"
            >
              <Icon width={16} height={16} className="text-ink-soft mt-0.5 shrink-0" />
              <span>
                <span className="block text-sm text-ink font-medium">{label}</span>
                <span className="block text-xs text-ink-soft">{hint}</span>
              </span>
            </button>
          ))}
        </div>
      )}
      <Button variant="secondary" className="w-full" onClick={() => setOpen((v) => !v)}>
        <PlusIcon width={16} height={16} />
        Add question
      </Button>
    </div>
  );
}
