"use client";

import React, { useState, useEffect } from "react";
import {
  VoiceBeam,
  useMicrophone,
  VoiceBeamType,
  VoiceBeamColorVariant,
  VoiceBeamTheme,
} from "voice-glow";
import {
  RiMicLine,
  RiMicOffLine,
  RiSparklingLine,
  RiVolumeUpLine,
  RiSunLine,
  RiMoonLine,
  RiPulseLine,
  RiSoundModuleLine,
} from "@remixicon/react";

export const VoiceBeamShowcase: React.FC = () => {
  const mic = useMicrophone();

  const [useRealMic, setUseRealMic] = useState(true);
  const [simulatedLevel, setSimulatedLevel] = useState<number>(0.4);
  const [isSimulatingVoice, setIsSimulatingVoice] = useState(false);

  const [type, setType] = useState<VoiceBeamType>("default");
  const [colorVariant, setColorVariant] = useState<VoiceBeamColorVariant>("colorful");
  const [strength, setStrength] = useState<number>(0.85);
  const [theme, setTheme] = useState<VoiceBeamTheme>("dark");
  const [reach, setReach] = useState<number>(1.2);
  const [bend, setBend] = useState<number>(60);
  const [idle, setIdle] = useState<number>(0.25);

  const TYPES: VoiceBeamType[] = ["default", "pill", "mobile"];
  const COLOR_VARIANTS: VoiceBeamColorVariant[] = [
    "colorful",
    "mono",
    "ocean",
    "sunset",
    "forest",
    "candy",
    "ice",
    "gold",
  ];

  // Simulated voice waveform when testing without real microphone
  useEffect(() => {
    if (!isSimulatingVoice || useRealMic) return;
    const interval = setInterval(() => {
      // Natural voice fluctuations simulation
      const base = 0.3 + 0.5 * Math.sin(Date.now() / 200) * Math.sin(Date.now() / 450);
      setSimulatedLevel(Math.max(0.05, Math.min(1.0, Math.abs(base))));
    }, 50);
    return () => clearInterval(interval);
  }, [isSimulatingVoice, useRealMic]);

  const handleMicToggle = async () => {
    if (mic.state === "live") {
      mic.stop();
    } else {
      setUseRealMic(true);
      await mic.start();
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
            <RiSparklingLine className="size-4" /> Libraries.dev
          </div>
          <h3 className="text-lg font-bold text-white">VoiceBeam Sound-Reactive Effect</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Overlays a centered sound-reactive glow along the bottom edge that rises and blooms with your voice.
          </p>
        </div>

        <a
          href="https://libraries.dev/voice.html"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Libraries.dev/voice</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Live Reactive Card Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-h-[340px]">
          <VoiceBeam
            stream={useRealMic && mic.state === "live" ? mic.stream : null}
            level={!useRealMic || mic.state !== "live" ? simulatedLevel : undefined}
            type={type}
            colorVariant={colorVariant}
            strength={strength}
            theme={theme}
            reach={reach}
            bend={bend}
            idle={idle}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-border-button-white bg-slate-900 p-6 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-bold text-sm shadow-md">
                    <RiVolumeUpLine className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Voice-Reactive Element</h4>
                    <span className="text-[11px] text-indigo-400 font-mono">
                      {type} • {colorVariant}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {mic.state === "live" && (
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {mic.state === "live"
                      ? "Mic Live"
                      : isSimulatingVoice
                      ? "Simulating Speech"
                      : "Idle"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Speak into your microphone or toggle speech simulation to watch the centered colorful beam rise and bloom along the bottom boundary in real time.
              </p>

              {/* Live Mic Action Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleMicToggle}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md ${
                    mic.state === "live"
                      ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {mic.state === "live" ? (
                    <>
                      <RiMicOffLine className="size-4" /> Stop Microphone
                    </>
                  ) : (
                    <>
                      <RiMicLine className="size-4" /> Start Microphone
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setUseRealMic(false);
                    setIsSimulatingVoice(!isSimulatingVoice);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    !useRealMic && isSimulatingVoice
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-slate-800 bg-slate-800/80 text-slate-300 hover:text-white"
                  }`}
                >
                  <RiPulseLine className="size-3.5" />
                  <span>{isSimulatingVoice ? "Stop Waveform" : "Test Sine Audio"}</span>
                </button>
              </div>
            </div>
          </VoiceBeam>

          {/* Code snippet */}
          <div className="mt-6 w-full max-w-md rounded-xl bg-slate-900/90 border border-slate-800 p-3 text-xs font-mono text-slate-300">
            <div className="text-[10px] text-slate-500 uppercase mb-1 font-sans font-semibold">
              VoiceBeam JSX Usage
            </div>
            <code>
              {`<VoiceBeam stream={mic.stream} type="${type}" colorVariant="${colorVariant}" strength={${strength}} theme="${theme}">`}
            </code>
          </div>
        </div>

        {/* Customization Settings */}
        <div className="lg:col-span-5 space-y-4 text-xs">
          {/* Preset Type */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Geometry Type (`type`)</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-xl border capitalize transition-all cursor-pointer ${
                    type === t
                      ? "border-indigo-500 bg-indigo-600/20 text-white font-semibold"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Color Variant */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Color Variant (`colorVariant`)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {COLOR_VARIANTS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColorVariant(c)}
                  className={`px-2 py-1.5 rounded-xl border text-center capitalize text-[11px] transition-all cursor-pointer ${
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

          {/* Sliders: Strength, Reach, Bend */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span>Strength (`strength`)</span>
                <span className="font-mono text-indigo-400">{strength.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={strength}
                onChange={(e) => setStrength(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span>Rise Reach (`reach`)</span>
                <span className="font-mono text-indigo-400">{reach.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={reach}
                onChange={(e) => setReach(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-300">
                <span>Contour Arc Bend (`bend`)</span>
                <span className="font-mono text-indigo-400">{bend}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={bend}
                onChange={(e) => setBend(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Theme selector */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center justify-between">
            <span className="font-semibold text-slate-300">Background Theme</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTheme("dark")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  theme === "dark" ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                <RiMoonLine className="size-3.5 inline mr-1" /> Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  theme === "light" ? "bg-slate-200 text-slate-900" : "bg-slate-800 text-slate-400"
                }`}
              >
                <RiSunLine className="size-3.5 inline mr-1" /> Light
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceBeamShowcase;
