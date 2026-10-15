import React, { useRef, useEffect, useState } from 'react';
import { Send, Mic, MicOff, Square, Sparkles, AtSign } from 'lucide-react';
import { Agent } from '../../types/chat';

interface InputAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onStop: () => void;
  agents: Agent[];
  activeAgent?: Agent;
  mode: 'roundtable' | 'direct' | 'pipeline';
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  agents,
  activeAgent,
  mode,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleAddMention = (agentName: string) => {
    setText((prev) => {
      const mention = `@${agentName} `;
      if (prev.endsWith(' ') || prev.length === 0) {
        return prev + mention;
      }
      return `${prev} ${mention}`;
    });
    textareaRef.current?.focus();
  };

  // Speech Recognition (Voice Input)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const placeholderText =
    mode === 'direct'
      ? `Ask ${activeAgent?.name || 'agent'} anything... (e.g., "Implement this algorithm in TypeScript")`
      : mode === 'pipeline'
      ? `Submit a task for the multi-stage pipeline... (Nova will orchestrate, CodeX will code, Sentinel will audit)`
      : `Start a collaborative discussion... (Use @Name to mention a specific specialist)`;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* Quick Agent Mention Bar */}
      <div className="mb-2 flex items-center gap-1.5 overflow-x-auto py-1 text-xs no-scrollbar">
        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 shrink-0">
          <AtSign className="h-3 w-3" /> Mention:
        </span>
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleAddMention(agent.name)}
            className="flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/80 px-2 py-0.5 text-[11px] text-slate-300 hover:border-indigo-500/50 hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          >
            <span>{agent.avatar}</span>
            <span>{agent.name}</span>
          </button>
        ))}
      </div>

      {/* Main Input Box */}
      <div className="relative rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl focus-within:border-indigo-500/80 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="w-full resize-none bg-transparent px-4 py-3.5 pr-24 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none max-h-48 overflow-y-auto"
        />

        {/* Action Controls */}
        <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
          {/* Voice input button */}
          <button
            onClick={toggleSpeechRecognition}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-600 text-white animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening... click to stop' : 'Voice input'}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>

          {/* Send or Stop button */}
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex items-center justify-center h-8 w-8 rounded-xl bg-rose-600 text-white hover:bg-rose-500 shadow-md transition-all cursor-pointer"
              title="Stop response"
            >
              <Square className="h-4 w-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              title="Send message (Enter)"
            >
              <Send className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>Press <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-slate-800 rounded text-slate-400">Shift+Enter</kbd> for newline</span>
        <span>Agents collaborate using Gemini 3.8 Flash</span>
      </div>
    </div>
  );
};
