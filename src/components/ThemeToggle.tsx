"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem("theme", newIsDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newIsDark);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-cream-100 dark:bg-forest-800 hover:bg-sage-100 dark:hover:bg-sage-900/30 border border-cream-300 dark:border-forest-700 transition-all hover:border-sage-400 dark:hover:border-sage-600 group"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <SunIcon
          className={`absolute inset-0 w-5 h-5 text-terra-500 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-90 scale-75"
          }`}
        />
        {/* Moon icon */}
        <MoonIcon
          className={`absolute inset-0 w-5 h-5 text-sage-600 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-75"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
      </div>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-sage-400/10 to-terra-400/10" />
    </button>
  );
}
