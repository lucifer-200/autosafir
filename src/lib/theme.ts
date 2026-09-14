export const THEME_STORAGE_KEY = "autosafir-theme-v1";

export const themes = ["dark", "light"] as const;

export type Theme = (typeof themes)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && themes.includes(value as Theme);
}

export const themeBootstrapScript = `
(function () {
  var storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
  var theme = "light";

  try {
    var storedTheme = window.localStorage.getItem(storageKey);
    if (storedTheme === "light" || storedTheme === "dark") {
      theme = storedTheme;
    }
  } catch (_) {}

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
`;
