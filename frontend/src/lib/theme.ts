import { useCallback, useEffect, useSyncExternalStore } from "react";

const STORAGE_KEY = "formix-theme";

export type Theme = "light" | "dark";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSnapshot(): Theme {
  const stored = typeof window !== "undefined" ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null;
  return stored ?? (typeof window !== "undefined" ? getSystemTheme() : "light");
}

function getServerSnapshot(): Theme {
  return "light";
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

const emptySubscribe = () => () => {};

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  useEffect(() => {
    const currentTheme = getSnapshot();
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [theme, mounted]);

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
    }
    window.dispatchEvent(new Event("storage"));
  }, []);

  return { theme, toggle, mounted };
}
