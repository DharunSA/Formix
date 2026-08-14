"use client";

import type { Question, QuestionType } from "@/lib/types";
import { QUESTION_TYPES, emptyQuestionDefaults, questionTypeMeta } from "@/lib/question-types";
import { OptionsEditor } from "./OptionsEditor";
import { Toggle } from "@/components/ui/Toggle";

export function QuestionEditor({
  question,
  onChange,
}: {
  question: Question;
  onChange: (patch: Partial<Question>) => void;
}) {
  const meta = questionTypeMeta(question.type);

  const changeType = (type: QuestionType) => {
    onChange({ type, ...emptyQuestionDefaults(type) });
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6 tf-fade-in">
      <div className="mb-6">
        <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">Question type</label>
        <div className="relative mt-1.5">
          <select
            value={question.type}
            onChange={(e) => changeType(e.target.value as QuestionType)}
            className="w-full appearance-none border border-border rounded-lg px-3.5 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink cursor-pointer"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-xs text-ink-soft mt-1">{meta.hint}</p>
      </div>

      <div className="mb-5">
        <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">Question</label>
        <textarea
          value={question.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Type your question here"
          rows={2}
          className="w-full mt-1.5 border border-border rounded-lg px-3.5 py-2.5 text-base font-medium resize-none focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
        />
      </div>

      <div className="mb-5">
        <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">
          Description <span className="normal-case font-normal">(optional)</span>
        </label>
        <textarea
          value={question.description ?? ""}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Add helper text shown below the question"
          rows={2}
          className="w-full mt-1.5 border border-border rounded-lg px-3.5 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
        />
      </div>

      {(question.type === "multiple_choice" || question.type === "dropdown") && (
        <div className="mb-5">
          <label className="text-xs font-medium text-ink-soft uppercase tracking-wide mb-1.5 block">
            Options
          </label>
          <OptionsEditor
            options={question.options ?? []}
            onChange={(options) => onChange({ options })}
          />
        </div>
      )}

      {question.type === "multiple_choice" && (
        <div className="mb-5 flex items-center justify-between py-2 border-y border-border">
          <div>
            <span className="text-sm text-ink font-medium block">Multiple selection</span>
            <span className="text-xs text-ink-soft block">Allow respondents to pick more than one option</span>
          </div>
          <Toggle
            checked={!!question.settings?.multiple}
            onChange={(multiple) =>
              onChange({ settings: { ...question.settings, multiple } })
            }
          />
        </div>
      )}

      {question.type === "rating" && (
        <div className="mb-5">
          <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">Max rating</label>
          <select
            value={question.settings?.max ?? 5}
            onChange={(e) => onChange({ settings: { ...question.settings, max: Number(e.target.value) } })}
            className="mt-1.5 border border-border rounded-lg px-3.5 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink cursor-pointer"
          >
            {[3, 5, 7, 10].map((n) => (
              <option key={n} value={n}>
                {n} stars
              </option>
            ))}
          </select>
        </div>
      )}

      {question.type === "number" && (
        <div className="mb-5 flex gap-4">
          <div>
            <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">Min</label>
            <input
              type="number"
              value={question.settings?.min ?? ""}
              onChange={(e) =>
                onChange({
                  settings: { ...question.settings, min: e.target.value === "" ? undefined : Number(e.target.value) },
                })
              }
              className="mt-1.5 w-28 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-soft uppercase tracking-wide">Max</label>
            <input
              type="number"
              value={question.settings?.max ?? ""}
              onChange={(e) =>
                onChange({
                  settings: { ...question.settings, max: e.target.value === "" ? undefined : Number(e.target.value) },
                })
              }
              className="mt-1.5 w-28 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border mt-6">
        <span className="text-sm text-ink font-medium">Required question</span>
        <Toggle checked={question.required} onChange={(required) => onChange({ required })} />
      </div>
    </div>
  );
}
