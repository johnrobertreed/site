export type ThemeName = "light" | "dark";

export function getTheme(): ThemeName {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function systemTheme(): ThemeName {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(next: ThemeName) {
  document.documentElement.dataset.theme = next;
  if (next === systemTheme()) {
    localStorage.removeItem("theme");
  } else {
    localStorage.setItem("theme", next);
  }
}

export function toggleTheme() {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
}

export function watchSystemTheme() {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (!localStorage.getItem("theme")) {
      document.documentElement.dataset.theme = media.matches ? "dark" : "light";
    }
  };
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
