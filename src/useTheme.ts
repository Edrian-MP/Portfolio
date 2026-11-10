import { useLayoutEffect, useState } from "react";

type Theme = "light" | "dark";
const key = "edrian-portfolio-theme";
function preferredTheme(): Theme {
  try {
    const saved = localStorage.getItem(key);
    if (saved === "light" || saved === "dark") return saved;
  } catch { /* Theme switching still works when storage is unavailable. */ }
  return matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(preferredTheme);
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f3f6fb" : "#0b0e14");
  }, [theme]);
  useLayoutEffect(() => {
    const media = matchMedia("(prefers-color-scheme: light)");
    const sync = () => setTheme(preferredTheme());
    const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) sync(); };
    media.addEventListener("change", sync);
    window.addEventListener("storage", storage);
    return () => { media.removeEventListener("change", sync); window.removeEventListener("storage", storage); };
  }, []);
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    try { localStorage.setItem(key, next); } catch { /* Keep the current session usable. */ }
    setTheme(next);
  };
  return { theme, toggleTheme };
}
