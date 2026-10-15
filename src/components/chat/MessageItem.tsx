import React, { useState } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  ChevronDown,
  ChevronRight,
  BrainCircuit,
  Bot,
  User,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage, Agent } from '../../types/chat';

interface MessageItemProps {
  message: ChatMessage;
  agent?: Agent;
  onSpeak?: (text: string, agent?: Agent) => void;
  isSpeaking?: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  agent,
  onSpeak,
  isSpeaking = false,
}) => {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [thoughtsOpen, setThoughtsOpen] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessage(true);
      setTimeout(() => setCopiedMessage(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyCode = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCodeId(id);
      setTimeout(() => setCopiedCodeId(null), 2000);
    } catch {
      // ignore
    }
  };

  // Render markdown with code block parsing
  const renderFormattedContent = (content: string) => {
    // Split by code blocks
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let blockIdx = 0;
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      if (matchIndex > lastIndex) {
        const textChunk = content.substring(lastIndex, matchIndex);
        parts.push(renderTextChunk(textChunk, `txt-${lastIndex}`));
      }

      const lang = match[1] || 'plaintext';
      const code = match[2];
      const codeId = `code-${blockIdx++}`;

      parts.push(
        <div
          key={codeId}
          className="my-3 overflow-hidden rounded-xl border border-slate-700/70 bg-slate-950/90 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-slate-400">
            <span className="font-mono uppercase tracking-wider font-semibold text-slate-300">
              {lang}
            </span>
            <button
              onClick={() => handleCopyCode(code, codeId)}
              className="flex items-center gap-1.5 rounded-md bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              title="Copy code"
            >
              {copiedCodeId === codeId ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-emerald-300/90 leading-relaxed">
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      );

      lastIndex = matchIndex + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(renderTextChunk(content.substring(lastIndex), `txt-end`));
    }

    return parts;
  };

  // Helper for paragraphs, lists, bold, blockquotes
  const renderTextChunk = (text: string, keyPrefix: string) => {
    const lines = text.split('\n');
    return (
      <div key={keyPrefix} className="space-y-2 text-slate-200">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={`${keyPrefix}-${idx}`} className="h-2" />;
          }

          // Headers
          if (trimmed.startsWith('### ')) {
            return (
              <h3
                key={`${keyPrefix}-${idx}`}
                className="text-base sm:text-lg font-bold text-white pt-2 pb-1 border-b border-slate-800 flex items-center gap-2"
              >
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2
                key={`${keyPrefix}-${idx}`}
                className="text-lg sm:text-xl font-bold text-white pt-3 pb-1.5 border-b border-slate-800"
              >
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('# ')) {
            return (
              <h1
                key={`${keyPrefix}-${idx}`}
                className="text-xl sm:text-2xl font-black text-white pt-4 pb-2"
              >
                {trimmed.replace('# ', '')}
              </h1>
            );
          }

          // Blockquotes
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote
                key={`${keyPrefix}-${idx}`}
                className="border-l-4 border-indigo-500/60 bg-indigo-950/20 px-3 py-2 rounded-r-lg text-slate-300 italic text-sm my-2"
              >
                {parseInlineText(trimmed.replace('> ', ''))}
              </blockquote>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            return (
              <div
                key={`${keyPrefix}-${idx}`}
                className="flex items-start gap-2.5 text-slate-300 pl-2 text-sm sm:text-base leading-relaxed"
              >
                <span className="text-indigo-400 font-bold select-none mt-1 text-xs">●</span>
                <span>{parseInlineText(trimmed.replace(/^[-*]\s+/, ''))}</span>
              </div>
            );
          }

          // Numbered lists
          const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div
                key={`${keyPrefix}-${idx}`}
                className="flex items-start gap-2 text-slate-300 pl-2 text-sm sm:text-base leading-relaxed"
              >
                <span className="font-mono text-xs font-semibold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-500/30">
                  {numMatch[1]}
                </span>
                <span>{parseInlineText(numMatch[2])}</span>
              </div>
            );
          }

          // Table handling simple detection
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
            const isSeparator = cells.every(c => c.trim().match(/^:?-+:?$/));
            if (isSeparator) return null;
            return (
              <div
                key={`${keyPrefix}-${idx}`}
                className="grid grid-flow-col auto-cols-fr gap-2 bg-slate-900/60 p-2 rounded border border-slate-800 text-xs sm:text-sm font-mono overflow-x-auto"
              >
                {cells.map((cell, cIdx) => (
                  <div key={cIdx} className="px-2 py-1 text-slate-200">
                    {parseInlineText(cell.trim())}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <p
              key={`${keyPrefix}-${idx}`}
              className="text-slate-300 leading-relaxed text-sm sm:text-base"
            >
              {parseInlineText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper for bold, code, highlights in text
  const parseInlineText = (text: string) => {
    // Replace **bold** with <strong>
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((chunk, i) => {
      if (chunk.startsWith('**') && chunk.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {chunk.slice(2, -2)}
          </strong>
        );
      }
      if (chunk.startsWith('`') && chunk.endsWith('`')) {
        return (
          <code
            key={i}
            className="rounded bg-slate-800 px-1.5 py-0.5 text-xs font-mono text-emerald-300 border border-slate-700/60"
          >
            {chunk.slice(1, -1)}
          </code>
        );
      }
      return chunk;
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/90 px-4 py-1.5 text-xs text-slate-400 shadow-sm backdrop-blur">
          <Bot className="h-3.5 w-3.5 text-indigo-400" />
          <span>{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex w-full gap-3 sm:gap-4 p-4 sm:p-5 transition-colors rounded-2xl ${
        isUser
          ? 'bg-slate-900/40 border border-slate-800/60 ml-auto max-w-3xl'
          : 'bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-md max-w-4xl'
      }`}
    >
      {/* Avatar column */}
      <div className="shrink-0 flex flex-col items-center">
        {isUser ? (
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/20">
            <User className="h-5 w-5" />
          </div>
        ) : (
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-slate-950 text-xl border shadow-md ${
              agent?.borderColor || 'border-indigo-500/40'
            }`}
          >
            <span>{message.agentAvatar || agent?.avatar || '🤖'}</span>
          </div>
        )}
      </div>

      {/* Main message body */}
      <div className="flex-1 min-w-0 space-y-2">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm sm:text-base text-slate-100">
              {isUser ? 'You' : message.agentName || agent?.name || 'Agent'}
            </span>
            {!isUser && (
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border bg-slate-950/80 ${
                  agent?.borderColor || 'border-indigo-500/30'
                } ${agent?.color || 'text-indigo-400'}`}
              >
                {message.agentRole || agent?.badge || 'Specialist'}
              </span>
            )}
            <span className="text-xs text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>

          {/* Action buttons (Copy, Read Aloud) */}
          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {!isUser && onSpeak && (
              <button
                onClick={() => onSpeak(message.content, agent)}
                className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ${
                  isSpeaking ? 'text-indigo-400 bg-indigo-950/50 animate-pulse' : ''
                }`}
                title={isSpeaking ? 'Stop speech' : 'Listen to response'}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={() => handleCopyText(message.content)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy message"
            >
              {copiedMessage ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Thought Process Accordion */}
        {message.thoughtProcess && (
          <div className="my-2 rounded-xl border border-indigo-900/40 bg-indigo-950/20 overflow-hidden">
            <button
              onClick={() => setThoughtsOpen(!thoughtsOpen)}
              className="flex w-full items-center justify-between px-3.5 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-900/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
                <span>Agent Deliberation & Reasoning Trace</span>
              </div>
              {thoughtsOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
            {thoughtsOpen && (
              <div className="border-t border-indigo-900/30 bg-slate-950/70 p-3 text-xs font-mono text-indigo-200/80 leading-relaxed">
                {message.thoughtProcess}
              </div>
            )}
          </div>
        )}

        {/* Formatted Content */}
        <div className="break-words">
          {renderFormattedContent(message.content)}
        </div>
      </div>
    </div>
  );
};
