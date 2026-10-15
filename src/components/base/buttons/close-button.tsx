import React from "react";
import { RiCloseLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

export interface CloseButtonProps {
  size?: "2xs" | "xs" | "sm";
  onClick?: () => void;
  className?: string;
  "aria-label"?: string;
}

export const CloseButton: React.FC<CloseButtonProps> = ({
  size = "xs",
  onClick,
  className,
  "aria-label": ariaLabel,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || "Close"}
      className={cx(
        "flex items-center justify-center rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer",
        size === "2xs" ? "h-5 w-5" : size === "xs" ? "h-6 w-6" : "h-7 w-7",
        className
      )}
    >
      <RiCloseLine className={size === "2xs" ? "size-3.5" : "size-4"} />
    </button>
  );
};
