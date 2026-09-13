"use client";

import { Moon, Sun } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";

import { isTheme, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

type ThemeToggleProps = {
  variant?: "default" | "compact" | "icon";
};

export function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      function handleStorage(event: StorageEvent) {
        if (event.key === THEME_STORAGE_KEY && isTheme(event.newValue)) {
          applyTheme(event.newValue);
          onStoreChange();
        }
      }

      window.addEventListener("autosafir-theme-change", onStoreChange);
      window.addEventListener("storage", handleStorage);
      return () => {
        window.removeEventListener("autosafir-theme-change", onStoreChange);
        window.removeEventListener("storage", handleStorage);
      };
    },
    () => {
      const activeTheme = document.documentElement.dataset.theme;
      return isTheme(activeTheme) ? activeTheme : "dark";
    },
    () => "dark",
  );

  function toggleTheme() {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;

    root.dataset.themeTransition = "true";
    applyTheme(nextTheme);
    window.dispatchEvent(new Event("autosafir-theme-change"));

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }

    window.setTimeout(() => {
      delete root.dataset.themeTransition;
    }, 220);
  }

  const isLight = theme === "light";
  const label = isLight ? "فعال‌کردن پوسته تیره" : "فعال‌کردن پوسته روشن";

  return (
    <button
      type="button"
      className={`touch-target border-border bg-surface text-foreground shadow-subtle hover:bg-surface-strong inline-flex items-center justify-center gap-2 border text-sm font-semibold transition-colors ${
        variant === "default" ? "rounded-sm px-4 py-2" : "rounded-full px-3"
      }`}
      aria-label={label}
      aria-pressed={isLight}
      onClick={toggleTheme}
    >
      <span aria-hidden="true" className="grid size-5 place-items-center">
        {isLight ? (
          <Sun size={19} weight="light" />
        ) : (
          <Moon size={19} weight="light" />
        )}
      </span>
      {variant !== "icon" ? (
        <span>
          {variant === "compact" ? "تم" : isLight ? "پوسته روشن" : "پوسته تیره"}
        </span>
      ) : null}
    </button>
  );
}
