"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

// `text-background` (rather than a hardcoded text-white) is intentional: --ink and
// --background are inverses of each other in both themes, so pairing them keeps
// the primary/outline buttons legible whether --ink resolves to near-black (light
// mode) or near-white (dark mode) without needing separate dark: overrides.
const variantClasses: Record<Variant, string> = {
  primary: "bg-ink text-background hover:opacity-90 disabled:opacity-40",
  secondary: "bg-surface text-ink hover:bg-border/70 border border-border",
  outline: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-background",
  ghost: "bg-transparent text-ink hover:bg-surface",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-lg gap-2",
  lg: "text-base px-6 py-3 rounded-lg gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        "inline-flex items-center justify-center font-medium transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
