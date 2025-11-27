"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const currentTheme = theme ?? resolvedTheme ?? "system";
    const isDark = currentTheme === "dark";

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/10 px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur dark:border-slate-700/60 dark:text-slate-200"
        >
            {isDark ? (
                <FiSun className="text-lg text-yellow-300" />
            ) : (
                <FiMoon className="text-lg" />
            )}
            {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
    );
}
