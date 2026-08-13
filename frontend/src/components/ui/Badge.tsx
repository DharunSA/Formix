import clsx from "clsx";

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "draft";
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
        tone === "success" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
        tone === "draft" && "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        tone === "neutral" && "bg-surface text-ink-soft"
      )}
    >
      {tone !== "neutral" && (
        <span
          className={clsx(
            "w-1.5 h-1.5 rounded-full",
            tone === "success" && "bg-emerald-500",
            tone === "draft" && "bg-amber-500"
          )}
        />
      )}
      {children}
    </span>
  );
}
