/** Initialize theme from localStorage or system preference */
export function initTheme(): "dark" | "light" {
  const saved = localStorage.getItem("ui-theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.setAttribute("data-theme", saved);
    return saved;
  }

  // Fall back to system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = prefersDark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

export function setTheme(theme: "dark" | "light"): void {
  localStorage.setItem("ui-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}
