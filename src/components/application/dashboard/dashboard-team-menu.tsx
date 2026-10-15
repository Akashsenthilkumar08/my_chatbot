import React from "react";
import { RiSparklingLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

export interface DashboardTeamMenuProps {
  collapsed?: boolean;
  className?: string;
}

export const DashboardTeamMenu: React.FC<DashboardTeamMenuProps> = ({
  collapsed = false,
  className,
}) => {
  return (
    <div
      className={cx(
        "flex items-center gap-2.5 rounded-2lg border border-border-button-white bg-background-tertiary-default/50 p-2 text-left transition-all",
        collapsed ? "justify-center p-2" : "w-full justify-between",
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
          <RiSparklingLine className="size-4" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-text-primary truncate">
              5 Agents Ready
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ● Gemini 3.8 Flash
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
