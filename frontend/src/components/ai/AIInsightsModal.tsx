"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { SparkleIcon, XIcon } from "@/components/ui/icons";

interface AIInsightsModalProps {
  formId: number;
  open: boolean;
  onClose: () => void;
}

export function AIInsightsModal({ formId, open, onClose }: AIInsightsModalProps) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ai-insights", formId],
    queryFn: () => api.getAIInsights(formId),
    enabled: open,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-[#faf9f7] dark:bg-[#1a1c1b]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#e7dff1] to-[#f0dee7] flex items-center justify-center text-[#261c23] shadow-sm">
              <SparkleIcon width={18} height={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-ink tracking-tight flex items-center gap-2">
                Formix AI Response Insights
                <span className="text-xs bg-[#e7dff1] text-[#261c23] px-2 py-0.5 rounded-full font-semibold">
                  Beta
                </span>
              </h2>
              <p className="text-xs text-ink-soft">Natural language synthesis across all submissions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface transition-colors"
            aria-label="Close"
          >
            <XIcon width={16} height={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center gap-3">
              <svg className="animate-spin w-8 h-8 text-[#261c23]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <p className="text-sm text-ink-soft font-medium">Synthesizing respondent answers with AI...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
              Unable to generate AI insights right now. Please make sure responses exist for this form.
            </div>
          )}

          {data && (
            <>
              {/* Executive Summary Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#faf9f7] to-[#efeeec] dark:from-[#221920] dark:to-[#1a1c1b] border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Executive Summary
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 px-2.5 py-1 rounded-full">
                    <span>Sentiment:</span>
                    <span>{data.sentiment_label} ({(data.sentiment_score * 100).toFixed(0)}%)</span>
                  </div>
                </div>
                <p className="text-sm text-ink leading-relaxed">{data.executive_summary}</p>
              </div>

              {/* Key Findings */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                  Key Findings & Patterns
                </h3>
                <div className="space-y-2">
                  {data.key_findings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-ink bg-surface rounded-xl p-3 border border-border">
                      <span className="text-purple-600 font-bold mt-0.5">•</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Quotes */}
              {data.top_quotes.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                    Notable Respondent Quotes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.top_quotes.map((q, i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface border border-border text-xs text-ink-soft italic">
                        &ldquo;{q}&rdquo;
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Recommendations */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-3">
                  Recommended Next Steps
                </h3>
                <div className="space-y-2">
                  {data.action_recommendations.map((rec, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-ink bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-xl p-3">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-between items-center bg-surface">
          <button
            onClick={() => refetch()}
            className="text-xs font-semibold text-ink-soft hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <SparkleIcon width={14} height={14} /> Refresh analysis
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#261c23] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
}
