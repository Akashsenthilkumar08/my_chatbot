"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  RiAddLine,
  RiGitBranchLine,
  RiFolder3Line,
  RiCpuLine,
  RiShieldCheckLine,
  RiArrowDownSLine,
  RiMicLine,
  RiMicOffLine,
  RiArrowUpLine,
  RiStopFill,
  RiAtLine,
  RiSparklingLine,
  RiCheckLine,
  RiCloseLine,
  RiFileLine,
  RiCodeSSlashLine,
  RiLinkM,
  RiBrainLine,
  RiSpeedUpLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import { Kbd } from "@/components/base/kbd/kbd";
import { BorderBeam } from "border-beam";
import { VoiceBeam, useMicrophone } from "voice-glow";

export type PermissionMode = "Auto" | "Manual" | "Plan mode" | "Bypass all";
export type ReasoningEffort = "Minimal" | "Low" | "Medium" | "High";

export interface ComposerPanelProps {
  value?: string;
  onChange?: (val: string) => void;
  onSubmit?: (text: string, options?: { mode: PermissionMode; model: string; effort: ReasoningEffort }) => void;
  isLoading?: boolean;
  onStop?: () => void;
  placeholder?: string;
  className?: string;
  agents?: Array<{ id: string; name: string; avatar: string; role: string }>;
  branch?: string;
  projectFolder?: string;
  contextUsage?: { used: number; total: number };
}

const MODELS = [
  { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", provider: "Google", desc: "Flagship high-speed multimodality & reasoning", recommended: true },
  { id: "gemini-4-argon", name: "Gemini 4 Argon", provider: "Google", desc: "Maximum reasoning depth for complex STEM & code" },
  { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite", provider: "Google", desc: "Ultra low latency & high throughput" },
  { id: "gemini-3.8-live", name: "Gemini 3.8 Live", provider: "Google", desc: "Real-time bidirectional speech & interaction" },
];

const PERMISSIONS: Array<{ id: PermissionMode; label: string; desc: string; icon: string }> = [
  { id: "Auto", label: "Auto", desc: "Agents orchestrate and execute autonomously", icon: "⚡" },
  { id: "Manual", label: "Manual", desc: "Require confirmation between agent handoffs", icon: "✋" },
  { id: "Plan mode", label: "Plan mode", desc: "Generate architecture and roadmap before execution", icon: "📋" },
  { id: "Bypass all", label: "Bypass all", desc: "Immediate single-pass execution without critique", icon: "🚀" },
];

export const ComposerPanel: React.FC<ComposerPanelProps> = ({
  value: controlledValue,
  onChange,
  onSubmit,
  isLoading = false,
  onStop,
  placeholder,
  className,
  agents = [
    { id: "nova", name: "Nova", avatar: "🌟", role: "Consensus Architect" },
    { id: "codex", name: "CodeX", avatar: "⚡", role: "Software Engineer" },
    { id: "aura", name: "Aura", avatar: "🧠", role: "Research Analyst" },
    { id: "lyra", name: "Lyra", avatar: "✨", role: "Creative Director" },
    { id: "sentinel", name: "Sentinel", avatar: "🛡️", role: "Security Auditor" },
  ],
  branch = "main",
  projectFolder = "src/components/multi-agent",
  contextUsage = { used: 3420, total: 1000000 },
}) => {
  const [internalValue, setInternalValue] = useState("");
  const textValue = controlledValue !== undefined ? controlledValue : internalValue;

  const [permissionMode, setPermissionMode] = useState<PermissionMode>("Auto");
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [reasoningEffort, setReasoningEffort] = useState<ReasoningEffort>("High");

  // Menus
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isPermissionMenuOpen, setIsPermissionMenuOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isEffortPopoverOpen, setIsEffortPopoverOpen] = useState(false);
  const [isMentionsOpen, setIsMentionsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ name: string; type: string }>>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto resize
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`;
    }
  }, [textValue]);

  // Click outside to close menus
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
        setIsPermissionMenuOpen(false);
        setIsModelMenuOpen(false);
        setIsEffortPopoverOpen(false);
        setIsMentionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (onChange) onChange(val);
    else setInternalValue(val);

    // If typed @, open mention helper
    if (val.endsWith("@")) {
      setIsMentionsOpen(true);
    } else if (!val.includes("@")) {
      setIsMentionsOpen(false);
    }
  };

  const handleAddMention = (agentName: string) => {
    const mention = `@${agentName} `;
    let nextVal = textValue;
    if (nextVal.endsWith("@")) {
      nextVal = nextVal.slice(0, -1) + mention;
    } else {
      nextVal = nextVal ? `${nextVal} ${mention}` : mention;
    }

    if (onChange) onChange(nextVal);
    else setInternalValue(nextVal);

    setIsMentionsOpen(false);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (!textValue.trim() || isLoading) return;
    if (onSubmit) {
      onSubmit(textValue.trim(), {
        mode: permissionMode,
        model: selectedModel,
        effort: reasoningEffort,
      });
    }
    if (onChange) onChange("");
    else setInternalValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const mic = useMicrophone();

  // Voice Speech Recognition + VoiceBeam sound-reactive audio
  const toggleSpeech = async () => {
    if (mic.state === "live") {
      mic.stop();
      setIsListening(false);
      return;
    }

    try {
      await mic.start();
      setIsListening(true);
    } catch (err) {
      console.warn("Microphone start notice:", err);
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
          setIsListening(false);
          mic.stop();
        };
        recognition.onerror = () => {
          setIsListening(false);
          mic.stop();
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            const updated = textValue ? `${textValue} ${transcript}` : transcript;
            if (onChange) onChange(updated);
            else setInternalValue(updated);
          }
        };

        recognition.start();
      } catch {
        // mic stream continues for VoiceBeam
      }
    }
  };

  const activeModelObj = MODELS.find((m) => m.id === selectedModel) || MODELS[0];
  const contextPct = ((contextUsage.used / contextUsage.total) * 100).toFixed(1);

  return (
    <div
      ref={containerRef}
      className={cx("relative w-full max-w-4xl mx-auto pt-4 px-3 sm:px-4 pb-2", className)}
    >
      {/* ========================================================= */}
      {/* TOP STATUS TAB (Hanging off the card's top edge)          */}
      {/* ========================================================= */}
      <div className="flex items-center justify-between px-4 pb-2 text-[11px] font-medium text-slate-400 select-none">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Branch Pill */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm"
            title={`Active Git Branch: ${branch}`}
          >
            <RiGitBranchLine className="size-3.5 text-indigo-400" />
            <span className="font-mono">{branch}</span>
          </div>

          {/* Project Folder Pill */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 shadow-sm"
            title={`Active Context Scope: ${projectFolder}`}
          >
            <RiFolder3Line className="size-3.5 text-amber-400" />
            <span className="font-mono truncate max-w-[150px]">{projectFolder}</span>
          </div>
        </div>

        {/* Context Meter Pill */}
        <div
          className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm"
          title={`Context Usage: ${contextUsage.used.toLocaleString()} of ${contextUsage.total.toLocaleString()} tokens (${contextPct}%)`}
        >
          <div className="flex items-center gap-1 font-mono text-[11px]">
            <span className="text-slate-400">Context:</span>
            <span className="text-emerald-400 font-semibold">{contextUsage.used > 1000 ? `${(contextUsage.used / 1000).toFixed(1)}k` : contextUsage.used}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">1M</span>
          </div>
          <div className="w-12 h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.max(parseFloat(contextPct), 6)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN TWO-ROW COMPOSER CARD (Radius-24: rounded-3xl)       */}
      {/* ========================================================= */}
      <VoiceBeam
        stream={mic.stream}
        type="default"
        colorVariant="colorful"
        strength={mic.state === "live" ? 0.95 : 0}
        theme="dark"
        className="w-full"
      >
        <BorderBeam
          size="md"
          colorVariant={isLoading ? "sunset" : "colorful"}
          strength={isLoading ? 0.95 : 0.7}
          active={true}
          theme="dark"
          className="w-full"
        >
        <div className="relative rounded-[24px] border border-border-button-white bg-slate-900/95 shadow-2xl backdrop-blur-2xl transition-all duration-200 focus-within:border-indigo-500/80 focus-within:ring-2 focus-within:ring-indigo-500/20">
          {/* ROW 1: Prompt Input Area */}
        <div className="p-4 sm:p-5 pb-2">
          {/* Active Attachments if any */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {attachments.map((att, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-xs text-slate-200 border border-slate-700"
                >
                  <RiFileLine className="size-3.5 text-indigo-400" />
                  <span>{att.name}</span>
                  <button
                    onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-white ml-1"
                  >
                    <RiCloseLine className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Quick Mentions Overlay */}
          {isMentionsOpen && (
            <div className="absolute left-4 top-14 z-30 w-64 rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl animate-in fade-in">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Mention Agent
              </div>
              {agents.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => handleAddMention(ag.name)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer text-left"
                >
                  <span className="text-base">{ag.avatar}</span>
                  <div>
                    <div className="font-semibold text-white">@{ag.name}</div>
                    <div className="text-[10px] text-slate-400">{ag.role}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            rows={2}
            value={textValue}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={
              placeholder ||
              "Ask multi-agent team or describe a goal... (type @ to assign Nova, CodeX, Sentinel)"
            }
            className="w-full resize-none bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-tertiary outline-none leading-relaxed"
          />
        </div>

        {/* ROW 2: Controls Toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 border-t border-slate-800/80 bg-slate-950/60 rounded-b-[24px]">
          {/* Left Toolbar Items: Add Menu, Permission Picker, Model Picker with Effort */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* 1. Add Menu (+) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsAddMenuOpen(!isAddMenuOpen);
                  setIsPermissionMenuOpen(false);
                  setIsModelMenuOpen(false);
                }}
                className={cx(
                  "flex size-8 items-center justify-center rounded-full border text-slate-300 transition-colors cursor-pointer",
                  isAddMenuOpen
                    ? "border-indigo-500 bg-indigo-600/20 text-white"
                    : "border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:text-white"
                )}
                title="Add context or files"
              >
                <RiAddLine className="size-4" />
              </button>

              {isAddMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-2xl border border-slate-800 bg-slate-900 p-1.5 shadow-2xl z-30 animate-in fade-in">
                  <button
                    onClick={() => {
                      setAttachments([...attachments, { name: "schema.ts", type: "code" }]);
                      setIsAddMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <RiCodeSSlashLine className="size-4 text-emerald-400" />
                    <span>Attach Code File</span>
                  </button>
                  <button
                    onClick={() => {
                      setAttachments([...attachments, { name: "spec.md", type: "doc" }]);
                      setIsAddMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <RiFileLine className="size-4 text-indigo-400" />
                    <span>Attach Document</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMentionsOpen(true);
                      setIsAddMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
                  >
                    <RiAtLine className="size-4 text-amber-400" />
                    <span>Mention Agent (@)</span>
                  </button>
                </div>
              )}
            </div>

            {/* 2. Permission Picker (Auto, Manual, Plan mode, Bypass all) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPermissionMenuOpen(!isPermissionMenuOpen);
                  setIsAddMenuOpen(false);
                  setIsModelMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
                title="Agent Execution Permission"
              >
                <RiShieldCheckLine className="size-3.5 text-indigo-400" />
                <span>{permissionMode}</span>
                <RiArrowDownSLine className="size-3 text-slate-500" />
              </button>

              {isPermissionMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-30 animate-in fade-in">
                  <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Execution Permission
                  </div>
                  {PERMISSIONS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPermissionMode(p.id);
                        setIsPermissionMenuOpen(false);
                      }}
                      className={cx(
                        "flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer",
                        permissionMode === p.id
                          ? "bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30"
                          : "text-slate-300 hover:bg-slate-800 hover:text-white"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{p.icon}</span>
                          <span>{p.label}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {p.desc}
                        </div>
                      </div>
                      {permissionMode === p.id && <RiCheckLine className="size-4 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Model Picker with Provider Rail & Effort Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsModelMenuOpen(!isModelMenuOpen);
                  setIsAddMenuOpen(false);
                  setIsPermissionMenuOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-slate-800 bg-slate-900/80 text-xs font-medium text-slate-300 hover:border-slate-700 hover:text-white transition-colors cursor-pointer"
                title="Selected LLM Engine"
              >
                <RiCpuLine className="size-3.5 text-emerald-400" />
                <span className="font-semibold">{activeModelObj.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950/80 text-indigo-400 border border-indigo-500/30">
                  {reasoningEffort}
                </span>
                <RiArrowDownSLine className="size-3 text-slate-500" />
              </button>

              {isModelMenuOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-80 rounded-2xl border border-slate-800 bg-slate-900 p-2.5 shadow-2xl z-30 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <span className="text-xs font-bold text-white">Model Selection</span>
                    <button
                      onClick={() => setIsEffortPopoverOpen(!isEffortPopoverOpen)}
                      className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <RiBrainLine className="size-3.5" />
                      <span>Effort: {reasoningEffort}</span>
                    </button>
                  </div>

                  {/* Effort Level selector strip if toggled */}
                  {isEffortPopoverOpen && (
                    <div className="mb-2.5 rounded-xl bg-slate-950 p-2 border border-slate-800">
                      <div className="text-[10px] font-semibold uppercase text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Reasoning Effort</span>
                        <span className="text-indigo-400 lowercase">thinkingLevel</span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {(["Minimal", "Low", "Medium", "High"] as ReasoningEffort[]).map((eff) => (
                          <button
                            key={eff}
                            onClick={() => setReasoningEffort(eff)}
                            className={cx(
                              "py-1 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer",
                              reasoningEffort === eff
                                ? "bg-indigo-600 text-white"
                                : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                          >
                            {eff}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Provider & Model list */}
                  <div className="space-y-1">
                    {MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setSelectedModel(m.id);
                          setIsModelMenuOpen(false);
                        }}
                        className={cx(
                          "flex w-full items-start justify-between rounded-xl p-2 text-left text-xs transition-colors cursor-pointer",
                          selectedModel === m.id
                            ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-semibold text-white">
                            <span>{m.name}</span>
                            {m.recommended && (
                              <span className="text-[9px] uppercase px-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            {m.desc}
                          </div>
                        </div>
                        {selectedModel === m.id && <RiCheckLine className="size-4 shrink-0 mt-0.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Toolbar Items: Mic, Send / Stop button, Kbd hint */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Mic Button */}
            <button
              type="button"
              onClick={toggleSpeech}
              className={cx(
                "flex size-8 items-center justify-center rounded-full transition-colors cursor-pointer",
                isListening
                  ? "bg-rose-600 text-white animate-pulse"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
              title={isListening ? "Listening... click to stop" : "Voice dictation"}
            >
              {isListening ? <RiMicOffLine className="size-4" /> : <RiMicLine className="size-4" />}
            </button>

            {/* Send / Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                className="flex size-8 items-center justify-center rounded-full bg-rose-600 text-white hover:bg-rose-500 shadow-md transition-all cursor-pointer"
                title="Stop generation"
              >
                <RiStopFill className="size-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!textValue.trim()}
                className={cx(
                  "flex size-8 items-center justify-center rounded-full transition-all cursor-pointer shadow-md",
                  textValue.trim()
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed"
                )}
                title="Send message (Enter)"
              >
                <RiArrowUpLine className="size-4 stroke-[2.5]" />
              </button>
            )}

            {/* Keyboard hint */}
            <div className="hidden sm:block">
              <Kbd>↵</Kbd>
            </div>
          </div>
        </div>
      </div>
    </BorderBeam>
  </VoiceBeam>
</div>
  );
};

export default ComposerPanel;
