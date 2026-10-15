import React from 'react';
import { Agent } from '../../types/chat';
import { Check, Settings2, Sparkles, MessageSquare } from 'lucide-react';

interface AgentPillProps {
  agent: Agent;
  isSelected?: boolean;
  isRoundtableActive?: boolean;
  onToggleRoundtable?: (agentId: string) => void;
  onSelectDirect?: (agentId: string) => void;
  onOpenSettings?: (agent: Agent) => void;
  mode: 'roundtable' | 'direct' | 'pipeline';
}

export const AgentPill: React.FC<AgentPillProps> = ({
  agent,
  isSelected = false,
  isRoundtableActive = false,
  onToggleRoundtable,
  onSelectDirect,
  onOpenSettings,
  mode,
}) => {
  const isDirectMode = mode === 'direct';

  return (
    <div
      className={`group relative flex items-center justify-between gap-2.5 rounded-xl border p-2 sm:p-2.5 transition-all duration-200 ${
        isSelected
          ? 'bg-slate-800/90 border-indigo-500 shadow-md shadow-indigo-500/10'
          : isRoundtableActive
          ? 'bg-slate-900/90 border-slate-700/80 hover:border-slate-600'
          : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-100'
      }`}
    >
      {/* Clickable body for direct selection or roundtable toggle */}
      <button
        onClick={() => {
          if (isDirectMode && onSelectDirect) {
            onSelectDirect(agent.id);
          } else if (onToggleRoundtable) {
            onToggleRoundtable(agent.id);
          }
        }}
        className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
      >
        <div className="relative shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-lg border ${
              agent.borderColor
            } shadow-inner`}
          >
            {agent.avatar}
          </div>
          {/* Status pulse */}
          {agent.status !== 'idle' && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-xs sm:text-sm text-slate-100 truncate">
              {agent.name}
            </span>
            <span
              className={`text-[10px] font-medium px-1.5 py-0.2 rounded border bg-slate-950/80 truncate ${
                agent.color
              } ${agent.borderColor}`}
            >
              {agent.badge}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[180px]">
            {agent.role}
          </p>
        </div>
      </button>

      {/* Action control */}
      <div className="flex items-center gap-1 shrink-0">
        {isDirectMode ? (
          <button
            onClick={() => onSelectDirect && onSelectDirect(agent.id)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Chat directly"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={() => onToggleRoundtable && onToggleRoundtable(agent.id)}
            className={`flex h-6 w-6 items-center justify-center rounded-md border text-xs transition-colors ${
              isRoundtableActive
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'border-slate-700 bg-slate-950 text-slate-400 hover:border-slate-600'
            }`}
            title={isRoundtableActive ? 'Remove from roundtable' : 'Include in roundtable'}
          >
            {isRoundtableActive && <Check className="h-3.5 w-3.5 stroke-[3]" />}
          </button>
        )}

        {onOpenSettings && (
          <button
            onClick={() => onOpenSettings(agent)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800/80 transition-colors opacity-0 group-hover:opacity-100"
            title="Configure agent"
          >
            <Settings2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
