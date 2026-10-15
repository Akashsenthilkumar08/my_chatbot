import React, { useState } from 'react';
import { ChatSession } from '../../types/chat';
import {
  Plus,
  MessageSquare,
  Trash2,
  Download,
  Search,
  Sparkles,
  Bot,
  Settings,
  ChevronLeft,
  X,
  FileText,
  FileCode,
} from 'lucide-react';

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onExportSession: (format: 'markdown' | 'json') => void;
  isLiveApi: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onAddNewCustomAgent: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onExportSession,
  isLiveApi,
  isOpenMobile,
  onCloseMobile,
  onAddNewCustomAgent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950/95 p-3.5 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header: App Branding */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-md shadow-indigo-600/30 text-white font-black text-lg">
              ✨
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white tracking-tight">Nexus AI</span>
                <span className="text-[10px] uppercase font-mono px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                  Multi-Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Gemini 3.8 Flash Engine</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="my-3">
          <button
            onClick={() => {
              onNewSession();
              onCloseMobile();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-purple-500 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Collaboration Chat</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          <div className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Conversations ({filteredSessions.length})
          </div>
          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No conversations found.
            </div>
          ) : (
            filteredSessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  className={`group relative flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-white font-medium border border-slate-700/80 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      onSelectSession(s.id);
                      onCloseMobile();
                    }}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left"
                  >
                    <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                    <span className="truncate">{s.title || 'Untitled Session'}</span>
                  </button>

                  {/* Delete button (hidden unless hover or active) */}
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(s.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete session"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Custom Agent Add button */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onAddNewCustomAgent}
            className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-indigo-400" />
              <span>Create Custom Agent</span>
            </div>
            <Plus className="h-3.5 w-3.5 text-slate-500" />
          </button>

          {/* Export dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-emerald-400" />
                <span>Export Chat</span>
              </div>
              <span className="text-[10px] text-slate-500">MD / JSON</span>
            </button>

            {showExportMenu && (
              <div className="absolute bottom-full left-0 mb-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-1.5 shadow-xl">
                <button
                  onClick={() => {
                    onExportSession('markdown');
                    setShowExportMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <FileText className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Export as Markdown (.md)</span>
                </button>
                <button
                  onClick={() => {
                    onExportSession('json');
                    setShowExportMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <FileCode className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Export as JSON (.json)</span>
                </button>
              </div>
            )}
          </div>

          {/* Engine Status pill */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">Backend AI Engine</span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Gemini 3.8 Flash
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
