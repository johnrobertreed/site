"use client";

import { useEffect } from "react";
import { toggleTheme, watchSystemTheme } from "@/lib/theme";

export function ThemeToggle() {
  useEffect(() => watchSystemTheme(), []);

  return (
    <button
      id="theme-toggle"
      type="button"
      className="theme-toggle"
      aria-label="Toggle color theme"
      onClick={toggleTheme}
    >
      <span className="icon-light" aria-hidden="true">
        ☀
      </span>
      <span className="icon-dark" aria-hidden="true">
        ☾
      </span>
    </button>
  );
}
