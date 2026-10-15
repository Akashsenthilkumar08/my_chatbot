import React, { useState } from "react";
import { RiMoonLine, RiSunLine, RiComputerLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

export interface ThemeToggleProps {
  collapsed?: boolean;
  appearance?: "sidebar-segmented" | "button";
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  collapsed = false,
  className,
}) => {
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex size-9 items-center justify-center rounded-full bg-background-tertiary-default text-foreground-icon-secondary hover:text-white transition-colors"
        title={`Theme: ${theme}`}
      >
        {theme === "dark" ? (
          <RiMoonLine className="size-4" />
        ) : (
          <RiSunLine className="size-4" />
        )}
      </button>
    );
  }

  return (
    <div
      className={cx(
        "flex items-center justify-between rounded-full bg-background-tertiary-default p-1",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cx(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors cursor-pointer",
          theme === "light"
            ? "bg-slate-700/80 text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <RiSunLine className="size-3.5" />
        <span>Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cx(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors cursor-pointer",
          theme === "dark"
            ? "bg-indigo-600 text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <RiMoonLine className="size-3.5" />
        <span>Dark</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("system")}
        className={cx(
          "flex flex-1 items-center justify-center gap-1.5 rounded-full py-1 text-xs font-medium transition-colors cursor-pointer",
          theme === "system"
            ? "bg-slate-700/80 text-white shadow-sm"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <RiComputerLine className="size-3.5" />
        <span>Auto</span>
      </button>
    </div>
  );
};
