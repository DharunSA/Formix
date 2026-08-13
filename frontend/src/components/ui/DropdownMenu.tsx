"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  danger?: boolean;
}

export function DropdownMenu({ trigger, items }: { trigger: ReactNode; items: MenuItem[] }) {
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
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {trigger}
      </div>
      {open && (
        <div
          className="absolute right-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-lg py-1.5 z-30 tf-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={clsx(
                "w-full flex items-center gap-2 px-3.5 py-2 text-sm text-left hover:bg-surface cursor-pointer",
                item.danger ? "text-danger" : "text-ink"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
