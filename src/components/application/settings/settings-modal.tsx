import React, { useState } from "react";
import {
  RiCloseLine,
  RiSettings4Line,
  RiCpuLine,
  RiShieldCheckLine,
  RiPaletteLine,
  RiCheckLine,
} from "@remixicon/react";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  planArtSrc?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "model" | "agents">("general");
  const [autoScroll, setAutoScroll] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl border border-border-button-white bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <RiSettings4Line className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">System Settings</h2>
              <p className="text-xs text-slate-400">Configure Nexus Multi-Agent Studio</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RiCloseLine className="size-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 border-b border-slate-800 py-3 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("general")}
            className={`pb-1 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "general"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("model")}
            className={`pb-1 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "model"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            AI Engine
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`pb-1 px-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === "agents"
                ? "border-indigo-500 text-white"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Agent Deliberation
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
          {activeTab === "general" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <div className="font-semibold text-slate-200">Auto-scroll during chat</div>
                  <div className="text-[11px] text-slate-400">
                    Automatically smooth-scroll down as agents respond
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoScroll}
                  onChange={(e) => setAutoScroll(e.target.checked)}
                  className="size-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div>
                  <div className="font-semibold text-slate-200">Audio playback synthesis</div>
                  <div className="text-[11px] text-slate-400">
                    Enable persona-tuned text-to-speech reader
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="size-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === "model" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-200">Selected Gemini Model</span>
                  <span className="font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
                    gemini-3.8-flash
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Configured with server-side SDK execution via <code className="text-indigo-300">@google/genai</code>. Includes automated role alternation, multi-turn context synthesis, and fallback execution safeguards.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="font-semibold text-slate-200 block mb-1">Architecture</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Full-stack Express + Vite with isolated server credentials. API keys are strictly kept server-side.
                </p>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="font-semibold text-slate-200 mb-1">Roundtable Protocol</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  In Roundtable mode, Nova coordinates topic delegation, while CodeX, Aura, Lyra, and Sentinel build sequential domain insights without repetitive boilerplate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <RiCheckLine className="size-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
