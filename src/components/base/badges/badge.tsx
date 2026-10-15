import React, { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface BadgeProps {
  color?: "primary" | "neutral" | "success" | "warning";
  children: ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  color = "neutral",
  children,
  className,
}) => {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums",
        color === "primary"
          ? "bg-white/20 text-white"
          : "bg-slate-800 text-slate-300 border border-slate-700/60",
        className
      )}
    >
      {children}
    </span>
  );
};
