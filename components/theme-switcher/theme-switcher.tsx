"use client";

import React from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { themeId, setThemeId, darkMode, setDarkMode, themeOptions } =
    useTheme();
  const [open, setOpen] = React.useState(false);

  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center gap-2 rounded-base">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          aria-label="Choose color scheme"
          aria-expanded={open}
        >
          <Palette className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="flex min-h-[36px] min-w-[36px] items-center justify-center rounded-base border-2 border-border bg-secondary-background text-foreground shadow-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun className="size-4" />
          ) : (
            <Moon className="size-4" />
          )}
        </button>
      </div>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            aria-hidden
            onClick={() => setOpen(false)}
          />
          <ul
            className="absolute right-0 top-full z-50 mt-1 min-w-[140px] rounded-base border-2 border-border bg-background py-1 shadow-shadow"
            role="listbox"
            aria-label="Color scheme"
          >
            {themeOptions.map((opt) => (
              <li key={opt.id} role="option" aria-selected={themeId === opt.id}>
                <button
                  type="button"
                  onClick={() => {
                    setThemeId(opt.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm font-medium transition-colors",
                    themeId === opt.id
                      ? "bg-main text-main-foreground"
                      : "text-foreground hover:bg-secondary-background",
                  )}
                >
                  {opt.name}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
