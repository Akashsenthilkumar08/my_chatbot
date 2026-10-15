import React from "react";
import { RiMore2Line } from "@remixicon/react";
import { cx } from "@/utils/cx";

export interface DashboardUserMenuProps {
  collapsed?: boolean;
  suppressHover?: boolean;
  onHoverSuppressionEnd?: () => void;
  avatarClassName?: string;
}

export const DashboardUserMenu: React.FC<DashboardUserMenuProps> = ({
  collapsed = false,
  avatarClassName,
}) => {
  return (
    <div
      className={cx(
        "flex items-center gap-2.5 rounded-2lg p-1.5 hover:bg-background-secondary-hover transition-colors cursor-pointer",
        collapsed ? "justify-center" : "w-full justify-between"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className={cx(
            "flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-md",
            avatarClassName
          )}
        >
          ✨
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-body-medium text-text-primary font-semibold truncate leading-tight">
              Nexus Studio
            </span>
            <span className="text-[11px] text-text-tertiary truncate leading-tight">
              AI Multi-Agent Team
            </span>
          </div>
        )}
      </div>
      {!collapsed && (
        <RiMore2Line className="size-4 shrink-0 text-foreground-icon-secondary" />
      )}
    </div>
  );
};
