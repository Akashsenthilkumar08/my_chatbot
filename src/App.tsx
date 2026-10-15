import React, { useState } from "react";
import { DashboardSidebar, DASHBOARD_NAV } from "@/components/application/dashboard/dashboard-sidebar";
import { MultiAgentChat } from "@/components/application/multi-agent-chat/multi-agent-chat";
import {
  RiChatAiLine,
  RiCpuLine,
  RiSparklingLine,
  RiShieldCheckLine,
  RiKanbanView2,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiCodeSSlashLine,
  RiTeamLine,
} from "@remixicon/react";
import { BorderBeam } from "border-beam";
import { BorderBeamShowcase } from "@/components/application/beam/border-beam-showcase";
import { VoiceBeamShowcase } from "@/components/application/beam/voice-beam-showcase";

export function Example() {
  const [selectedNav, setSelectedNav] = useState("ai-chat");

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background-full p-2 sm:p-3 gap-2.5 sm:gap-3">
      {/* Board UI Floating Dashboard Sidebar */}
      <DashboardSidebar
        selected={selectedNav}
        onSelect={(key) => setSelectedNav(key)}
      />

      {/* Main Page View */}
      <main className="flex-1 min-w-0 h-full rounded-3xl overflow-hidden border border-border-button-white bg-slate-950/60 shadow-sidebar flex flex-col relative">
        {selectedNav === "ai-chat" && <MultiAgentChat />}

        {selectedNav === "home" && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
            {/* Header banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                  <RiSparklingLine className="size-4" /> Nexus Operations Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Autonomous Multi-Agent Workspace
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  5 specialized AI agents collaborating in real time powered by Gemini 3.8 Flash.
                </p>
              </div>

              <button
                onClick={() => setSelectedNav("ai-chat")}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer shrink-0"
              >
                <RiChatAiLine className="size-4" />
                <span>Launch Multi-Agent Chat</span>
                <RiArrowRightLine className="size-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Active Agents</span>
                  <RiTeamLine className="size-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-bold text-white">5 Specialists</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-mono">
                  ● Nova, CodeX, Aura, Lyra, Sentinel
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Underlying Model</span>
                  <RiCpuLine className="size-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold text-white">Gemini 3.8 Flash</div>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Server-side @google/genai
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Consensus Modes</span>
                  <RiKanbanView2 className="size-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white">3 Protocols</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Roundtable, Pipeline & 1:1 Direct
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-medium">Security Guardrails</span>
                  <RiShieldCheckLine className="size-4 text-rose-400" />
                </div>
                <div className="text-2xl font-bold text-white">Sentinel Shield</div>
                <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <RiCheckboxCircleLine className="size-3.5" /> Vulnerability Auditing
                </div>
              </div>
            </div>

            {/* Agent Roster Cards */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Specialized Agent Fleet
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { name: "Nova", role: "Consensus Architect", emoji: "🌟", color: "border-indigo-500/40 text-indigo-400", desc: "Coordinates complex task decomposition and synthesizes multi-agent resolutions." },
                  { name: "CodeX", role: "Principal Software Engineer", emoji: "⚡", color: "border-emerald-500/40 text-emerald-400", desc: "Builds production-grade TypeScript/React architecture, clean code, and API contracts." },
                  { name: "Aura", role: "Deep Research Analyst", emoji: "🧠", color: "border-amber-500/40 text-amber-400", desc: "Uncovers empirical benchmarks, historical precedents, and logical proofs." },
                  { name: "Lyra", role: "Creative Director", emoji: "✨", color: "border-pink-500/40 text-pink-400", desc: "Crafts intuitive human psychology, marketing copy, and brand narratives." },
                  { name: "Sentinel", role: "Security & Logic Auditor", emoji: "🛡️", color: "border-rose-500/40 text-rose-400", desc: "Stress-tests edge cases, attacks assumptions, and provides mitigation matrices." },
                ].map((ag, i) => {
                  const cardContent = (
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700 transition-colors h-full">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">
                          {ag.emoji}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-white">{ag.name}</div>
                          <div className={`text-xs font-semibold ${ag.color}`}>{ag.role}</div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{ag.desc}</p>
                    </div>
                  );

                  return i === 0 ? (
                    <BorderBeam key={i} size="sm" colorVariant="colorful" strength={0.85} active={true}>
                      {cardContent}
                    </BorderBeam>
                  ) : (
                    <div key={i}>{cardContent}</div>
                  );
                })}
              </div>
            </div>

            {/* Interactive BorderBeam Playground from Libraries.dev */}
            <BorderBeamShowcase />

            {/* Interactive VoiceBeam Sound-Reactive Playground from Libraries.dev */}
            <VoiceBeamShowcase />
          </div>
        )}

        {selectedNav === "project-board" && (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-2xl font-bold text-white">Agent Task Pipeline</h1>
                <p className="text-xs text-slate-400 mt-1">
                  Sequential multi-stage handoffs between Nova (Strategy), CodeX (Build), and Sentinel (Audit).
                </p>
              </div>
              <button
                onClick={() => setSelectedNav("ai-chat")}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Open in Chat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Stage 1 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Stage 1: Deconstruction
                  </span>
                  <span className="text-xs text-slate-500">Nova 🌟</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <div className="font-semibold text-white mb-1">Architecture Objectives</div>
                  Problem scope framing and domain boundary definition.
                </div>
              </div>

              {/* Stage 2 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Stage 2: Execution
                  </span>
                  <span className="text-xs text-slate-500">CodeX ⚡</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <div className="font-semibold text-white mb-1">TypeScript Engine Implementation</div>
                  Production-grade code blocks, type schemas, and execution pipelines.
                </div>
              </div>

              {/* Stage 3 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Stage 3: Verification
                  </span>
                  <span className="text-xs text-slate-500">Sentinel 🛡️</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                  <div className="font-semibold text-white mb-1">Security & Edge-Case Audit</div>
                  Vulnerability probing, risk mitigation matrices, and safety sign-off.
                </div>
              </div>
            </div>
          </div>
        )}

        {(selectedNav === "marketing" ||
          selectedNav === "calendar" ||
          selectedNav === "finance" ||
          selectedNav === "profile") && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-3xl">
              ✨
            </div>
            <h2 className="text-xl font-bold text-white capitalize">
              {selectedNav.replace("-", " ")} Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-md">
              Specialized workspace connected directly with your autonomous AI agents. Switch back to Multi-Agent Chat anytime.
            </p>
            <button
              onClick={() => setSelectedNav("ai-chat")}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
            >
              Open Multi-Agent Chat
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ChatPage() {
  return <Example />;
}
