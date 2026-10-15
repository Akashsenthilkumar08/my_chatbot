"use client";

import React, { useState } from "react";
import { BorderBeam, BorderBeamSize, BorderBeamColorVariant, BorderBeamTheme } from "border-beam";
import {
  RiSparklingLine,
  RiPlayLine,
  RiPauseLine,
  RiSunLine,
  RiMoonLine,
  RiFlashlightLine,
  RiContrastDropLine,
  RiSunFoggyLine,
} from "@remixicon/react";

export const BorderBeamShowcase: React.FC = () => {
  // Configured with strong pulse-inner as requested
  const [size, setSize] = useState<BorderBeamSize>("pulse-inner");
  const [colorVariant, setColorVariant] = useState<BorderBeamColorVariant>("colorful");
  const [strength, setStrength] = useState<number>(1.0);
  const [brightness, setBrightness] = useState<number>(2.2);
  const [saturation, setSaturation] = useState<number>(1.6);
  const [active, setActive] = useState<boolean>(true);
  const [theme, setTheme] = useState<BorderBeamTheme>("dark");

  const SIZES: BorderBeamSize[] = ["pulse-inner", "pulse-outside", "md", "sm", "line"];
  const COLOR_VARIANTS: BorderBeamColorVariant[] = ["colorful", "mono", "ocean", "sunset"];

  const setStrongPulseInner = () => {
    setSize("pulse-inner");
    setColorVariant("colorful");
    setStrength(1.0);
    setBrightness(2.4);
    setSaturation(1.8);
    setActive(true);
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
            <RiSparklingLine className="size-4" /> Libraries.dev
          </div>
          <h3 className="text-lg font-bold text-white">Strong Pulse-Inner BorderBeam Effect</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Demonstrating <code className="text-indigo-300">size="pulse-inner"</code> with maximum glow strength, vivid brightness, and breathing saturation.
          </p>
        </div>

        <button
          onClick={setStrongPulseInner}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 hover:opacity-95 transition-all cursor-pointer self-start sm:self-auto"
        >
          <RiFlashlightLine className="size-4" />
          <span>Apply Ultra-Strong Preset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Interactive Preview Card */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-h-[340px]">
          {/* BorderBeam Card with Strong Pulse-Inner */}
          <BorderBeam
            size={size}
            colorVariant={colorVariant}
            strength={strength}
            brightness={brightness}
            saturation={saturation}
            active={active}
            theme={theme}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-border-button-white bg-slate-900 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-base shadow-lg">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Strong Pulse-Inner Glow Card</h4>
                    <span className="text-[11px] text-indigo-400 font-mono">
                      size="{size}" • strength={strength}
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  {strength >= 0.9 ? "Max Glow" : "Active"}
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                The <code className="text-indigo-300 font-mono">pulse-inner</code> family creates a breathing, sound/presence glow contained strictly within the border contours. With high brightness ({brightness}x) and saturation ({saturation}x), it produces a striking luminous aura.
              </p>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-mono text-emerald-400">Brightness: {brightness}x</span>
                <span className="font-mono text-indigo-400">Saturation: {saturation}x</span>
                <span className="font-mono text-slate-300">Theme: {theme}</span>
              </div>
            </div>
          </BorderBeam>

          {/* Quick code snippet output */}
          <div className="mt-6 w-full max-w-md rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-xs font-mono text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase mb-1 font-sans font-semibold">
              Exact Strong Implementation Code
            </div>
            <code className="text-indigo-300 break-all">
              {`<BorderBeam size="${size}" colorVariant="${colorVariant}" strength={${strength}} brightness={${brightness}} saturation={${saturation}} active={${active}}>`}
              <br />
              {"  <Card>Content</Card>"}
              <br />
              {"</BorderBeam>"}
            </code>
          </div>
        </div>

        {/* Controls Configuration Panel */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Size Preset */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Size Preset (`size`)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-2.5 py-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                    size === s
                      ? "border-indigo-500 bg-indigo-600/20 text-white font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <div className="truncate font-mono">{s}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Variant */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Color Variant (`colorVariant`)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {COLOR_VARIANTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColorVariant(c)}
                  className={`px-3 py-1.5 rounded-xl border text-left capitalize transition-all cursor-pointer ${
                    colorVariant === c
                      ? "border-indigo-500 bg-indigo-600/20 text-white font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Strength, Brightness, Saturation */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <RiFlashlightLine className="size-3.5 text-indigo-400" />
                  <span>Glow Strength (`strength`)</span>
                </span>
                <span className="font-mono text-indigo-400 font-bold">{strength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <RiSunFoggyLine className="size-3.5 text-amber-400" />
                  <span>Glow Brightness (`brightness`)</span>
                </span>
                <span className="font-mono text-amber-400 font-bold">{brightness.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={brightness}
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <RiContrastDropLine className="size-3.5 text-pink-400" />
                  <span>Color Saturation (`saturation`)</span>
                </span>
                <span className="font-mono text-pink-400 font-bold">{saturation.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.1"
                value={saturation}
                onChange={(e) => setSaturation(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Active & Theme Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="font-semibold text-slate-300 block">Animation State</span>
              <button
                onClick={() => setActive(!active)}
                className={`w-full mt-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  active ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {active ? <RiPlayLine className="size-4" /> : <RiPauseLine className="size-4" />}
                <span>{active ? "Active" : "Paused"}</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="font-semibold text-slate-300 block">Theme Mode</span>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer ${
                    theme === "dark" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <RiMoonLine className="size-3.5" /> Dark
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1 text-xs font-semibold cursor-pointer ${
                    theme === "light" ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  <RiSunLine className="size-3.5" /> Light
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorderBeamShowcase;
