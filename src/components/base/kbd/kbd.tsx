import React, { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface KbdProps {
  children: ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className }) => {
  return (
    <kbd
      className={cx(
        "inline-flex items-center rounded border border-slate-700/80 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 shadow-sm",
        className
      )}
    >
      {children}
    </kbd>
  );
};
