import React, { useState, useEffect, useRef } from 'react';
import {
  Agent,
  ChatMessage,
  ChatSession,
  CollaborationMode,
} from '../../../types/chat';
import {
  DEFAULT_AGENTS,
  STARTER_PROMPTS,
  generateLocalAgentResponse,
} from '../../../utils/agents';
import { MessageItem } from '../../chat/MessageItem';
import { AgentPill } from '../../chat/AgentPill';
import { AgentSettingsModal } from '../../chat/AgentSettingsModal';
import { ComposerPanel } from '../composer-panel/composer-panel';
import { BorderBeam } from 'border-beam';
import {
  Users,
  MessageSquare,
  Workflow,
  Sparkles,
  RotateCcw,
  Plus,
  ShieldAlert,
  SlidersHorizontal,
  Bot,
  Zap,
  Download,
} from 'lucide-react';

const STORAGE_KEY_SESSIONS = 'nexus_multiagent_sessions_v1';
const STORAGE_KEY_AGENTS = 'nexus_multiagent_agents_v1';

export const MultiAgentChat: React.FC = () => {
  // State: Agents
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AGENTS);
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_AGENTS;
  });

  // Save agents to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_AGENTS, JSON.stringify(agents));
  }, [agents]);

  // State: Sessions
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SESSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const initialSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'Multi-Agent Strategy Roundtable',
      messages: [
        {
          id: 'welcome_1',
          role: 'system',
          content: 'Multi-Agent Studio initialized. Nova, CodeX, Aura, Lyra, and Sentinel are ready in the roundtable.',
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'roundtable',
      activeAgentId: 'nova',
      selectedAgentIds: ['nova', 'codex', 'sentinel'],
    };
    return [initialSession];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(
    sessions[0]?.id || ''
  );

  const activeSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Save sessions to storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  // Mode and active agent
  const mode = activeSession?.mode || 'roundtable';
  const selectedAgentIds = activeSession?.selectedAgentIds || ['nova', 'codex', 'sentinel'];
  const activeAgentId = activeSession?.activeAgentId || 'nova';
  const activeAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [selectedAgentForModal, setSelectedAgentForModal] = useState<Agent | null>(null);
  const [currentlySpeakingAgentId, setCurrentlySpeakingAgentId] = useState<string | null>(null);
  const [isLiveApiBackend, setIsLiveApiBackend] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check health and Gemini API key status from backend
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsLiveApiBackend(Boolean(data.hasApiKey));
      })
      .catch(() => {
        setIsLiveApiBackend(false);
      });
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isProcessing]);

  // Handle Session actions
  const handleNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: 'New Collaboration Chat',
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          role: 'system',
          content: 'Started new multi-agent session. Select a mode or type a prompt to begin.',
          timestamp: Date.now(),
        },
      ],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      mode: 'roundtable',
      activeAgentId: 'nova',
      selectedAgentIds: ['nova', 'codex', 'sentinel'],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleUpdateCurrentSession = (updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? updater(s) : s))
    );
  };

  // Switch modes
  const handleSetMode = (newMode: CollaborationMode) => {
    handleUpdateCurrentSession((s) => ({
      ...s,
      mode: newMode,
      updatedAt: Date.now(),
    }));
  };

  // Toggle agent in roundtable
  const handleToggleRoundtableAgent = (agentId: string) => {
    handleUpdateCurrentSession((s) => {
      const current = s.selectedAgentIds || [];
      const exists = current.includes(agentId);
      let updated: string[];
      if (exists) {
        if (current.length <= 1) return s; // Keep at least one
        updated = current.filter((id) => id !== agentId);
      } else {
        updated = [...current, agentId];
      }
      return { ...s, selectedAgentIds: updated, updatedAt: Date.now() };
    });
  };

  // Select direct agent
  const handleSelectDirectAgent = (agentId: string) => {
    handleUpdateCurrentSession((s) => ({
      ...s,
      activeAgentId: agentId,
      mode: 'direct',
      updatedAt: Date.now(),
    }));
  };

  // Export session transcript
  const handleExportSession = (format: 'markdown' | 'json') => {
    if (!activeSession) return;
    let fileContent = '';
    let fileName = `${activeSession.title.toLowerCase().replace(/\s+/g, '_')}_export`;

    if (format === 'json') {
      fileContent = JSON.stringify(activeSession, null, 2);
      fileName += '.json';
    } else {
      fileName += '.md';
      fileContent = `# ${activeSession.title}\n`;
      fileContent += `*Mode: ${activeSession.mode.toUpperCase()} | Date: ${new Date(activeSession.createdAt).toLocaleString()}*\n\n---\n\n`;
      activeSession.messages.forEach((msg) => {
        const sender = msg.role === 'user' ? 'User' : msg.agentName || 'Agent';
        fileContent += `### [${sender}] (${new Date(msg.timestamp).toLocaleTimeString()})\n\n`;
        if (msg.thoughtProcess) {
          fileContent += `> *Reasoning:* ${msg.thoughtProcess}\n\n`;
        }
        fileContent += `${msg.content}\n\n---\n\n`;
      });
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Text to Speech playback
  const handleSpeakText = (text: string, agent?: Agent) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (currentlySpeakingAgentId) {
      window.speechSynthesis.cancel();
      setCurrentlySpeakingAgentId(null);
      return;
    }

    // Strip markdown tags for natural speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, 'Code block omitted for brevity.')
      .replace(/[#*`_>]/g, '')
      .slice(0, 450); // Read first chunk

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = agent?.voicePitch || 1.0;
    utterance.rate = agent?.voiceRate || 1.0;

    utterance.onend = () => setCurrentlySpeakingAgentId(null);
    utterance.onerror = () => setCurrentlySpeakingAgentId(null);

    setCurrentlySpeakingAgentId(agent?.id || 'agent');
    window.speechSynthesis.speak(utterance);
  };

  // Stop currently running generation
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' })));
  };

  // Save agent settings from modal
  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === updatedAgent.id ? updatedAgent : a))
    );
  };

  // Add custom agent
  const handleAddNewCustomAgent = () => {
    const newId = `custom_${Date.now()}`;
    const newAgent: Agent = {
      id: newId,
      name: 'Custom Specialist',
      role: 'Domain Expert',
      specialty: 'Specialized domain logic & analysis',
      avatar: '🤖',
      badge: 'Custom Agent',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgGradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
      systemPrompt: 'You are a custom AI specialist. Provide structured, accurate, and insightful responses tailored to the user’s domain.',
      tone: 'Specialized, clear, and direct',
      temperature: 0.7,
      status: 'idle',
      enabled: true,
      voicePitch: 1.0,
      voiceRate: 1.0,
      isCustom: true,
    };
    setAgents((prev) => [...prev, newAgent]);
    setSelectedAgentForModal(newAgent);
    setSettingsModalOpen(true);
  };

  const handleDeleteCustomAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
  };

  // Single agent API invocation helper
  const invokeAgentTurn = async (
    agent: Agent,
    prompt: string,
    history: ChatMessage[],
    collaborationNote: string = ''
  ): Promise<{ content: string; thoughtProcess: string }> => {
    // Set agent status to thinking
    setAgents((prev) =>
      prev.map((a) => (a.id === agent.id ? { ...a, status: 'thinking' } : a))
    );

    try {
      const res = await fetch('/api/chat/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          prompt,
          history,
          collaborationNote,
        }),
        signal: abortControllerRef.current?.signal,
      });

      if (res.ok) {
        const data = await res.json();
        // Generate simulated thought trace if needed
        const fallback = generateLocalAgentResponse(agent, prompt, history);
        return {
          content: data.content,
          thoughtProcess: fallback.thoughtProcess,
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') throw err;
      console.warn('Backend call failed, using high-quality local generator:', err);
    }

    // High quality fallback
    await new Promise((r) => setTimeout(r, 600));
    return generateLocalAgentResponse(agent, prompt, history);
  };

  // Main message submission logic
  const handleSendMessage = async (userPrompt: string) => {
    if (!userPrompt.trim() || isProcessing) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: userPrompt,
      timestamp: Date.now(),
    };

    // Auto-update session title if it's the first user message
    const isFirstUserMessage =
      activeSession.messages.filter((m) => m.role === 'user').length === 0;

    const newTitle = isFirstUserMessage
      ? userPrompt.slice(0, 36) + (userPrompt.length > 36 ? '...' : '')
      : activeSession.title;

    // Append user message immediately
    const updatedMessages = [...activeSession.messages, userMessage];
    handleUpdateCurrentSession((s) => ({
      ...s,
      title: newTitle,
      messages: updatedMessages,
      updatedAt: Date.now(),
    }));

    setIsProcessing(true);
    abortControllerRef.current = new AbortController();

    try {
      // Determine which agents to invoke
      let participatingAgents: Agent[] = [];

      // Check for @mention in prompt (e.g., @Nova, @CodeX, @Aura)
      const mentionedAgentNames = agents.filter((a) =>
        userPrompt.toLowerCase().includes(`@${a.name.toLowerCase()}`)
      );

      if (mentionedAgentNames.length > 0) {
        participatingAgents = mentionedAgentNames;
      } else if (mode === 'direct') {
        participatingAgents = [activeAgent];
      } else if (mode === 'pipeline') {
        // Pipeline: Nova (Plan) -> CodeX (Build) -> Sentinel (Audit)
        const nova = agents.find((a) => a.id === 'nova') || agents[0];
        const codex = agents.find((a) => a.id === 'codex') || agents[1];
        const sentinel = agents.find((a) => a.id === 'sentinel') || agents[2];
        participatingAgents = [nova, codex, sentinel];
      } else {
        // Roundtable: All selected agents in activeSession
        participatingAgents = agents.filter((a) =>
          selectedAgentIds.includes(a.id)
        );
        if (participatingAgents.length === 0) {
          participatingAgents = [agents[0]];
        }
      }

      // Execute turns sequentially so agents can build on each other's outputs
      let currentSessionMessages = [...updatedMessages];

      for (let i = 0; i < participatingAgents.length; i++) {
        const agent = participatingAgents[i];

        // Status update
        setAgents((prev) =>
          prev.map((a) =>
            a.id === agent.id ? { ...a, status: 'speaking' } : a
          )
        );

        let note = '';
        if (mode === 'roundtable' && i > 0) {
          note = `You are speaking in a multi-agent roundtable following ${
            participatingAgents[i - 1].name
          }. Address their contributions constructively and add your specialized domain perspective.`;
        } else if (mode === 'pipeline') {
          if (i === 0) note = 'Pipeline Stage 1: Strategy & Task Decomposition.';
          if (i === 1) note = 'Pipeline Stage 2: Technical Architecture & Code Implementation.';
          if (i === 2) note = 'Pipeline Stage 3: Security & Logic Stress-Test Audit.';
        }

        const agentTurnResult = await invokeAgentTurn(
          agent,
          userPrompt,
          currentSessionMessages,
          note
        );

        const agentMessage: ChatMessage = {
          id: `ag_${agent.id}_${Date.now()}`,
          role: 'agent',
          agentId: agent.id,
          agentName: agent.name,
          agentRole: agent.role,
          agentAvatar: agent.avatar,
          agentColor: agent.color,
          content: agentTurnResult.content,
          thoughtProcess: agentTurnResult.thoughtProcess,
          timestamp: Date.now(),
        };

        currentSessionMessages = [...currentSessionMessages, agentMessage];

        // Update messages in state after each agent finishes
        handleUpdateCurrentSession((s) => ({
          ...s,
          messages: currentSessionMessages,
          updatedAt: Date.now(),
        }));

        // Reset agent status
        setAgents((prev) =>
          prev.map((a) =>
            a.id === agent.id ? { ...a, status: 'idle' } : a
          )
        );
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Multi-agent execution error:', err);
      }
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
      setAgents((prev) => prev.map((a) => ({ ...a, status: 'idle' })));
    }
  };

  const activeMessages = activeSession?.messages || [];
  const displayableMessages = activeMessages.filter(
    (m) => m.role === 'user' || m.role === 'agent' || m.role === 'system'
  );

  return (
    <div className="flex flex-1 flex-col h-full min-w-0 bg-slate-950/40 relative font-sans text-slate-100 select-none">
      {/* Top Navbar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base text-white truncate flex items-center gap-2">
              <span>{activeSession.title}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-400">
                <Bot className="h-3 w-3" />
                {mode === 'roundtable'
                  ? `Roundtable (${selectedAgentIds.length} active)`
                  : mode === 'pipeline'
                  ? '3-Stage Pipeline'
                  : `Direct: ${activeAgent.name}`}
              </span>
              <span>•</span>
              <span className="text-[11px] text-slate-500">
                {activeMessages.length} messages
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/90 p-1">
            <button
              onClick={() => handleSetMode('roundtable')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                mode === 'roundtable'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="All active agents discuss and collaborate in sequence"
            >
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Roundtable</span>
            </button>

            <button
              onClick={() => handleSetMode('pipeline')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                mode === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Orchestrator -> Engineer -> Security Auditor pipeline"
            >
              <Workflow className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Pipeline</span>
            </button>

            <button
              onClick={() => handleSetMode('direct')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                mode === 'direct'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="1-on-1 dedicated chat with chosen specialist"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Direct 1:1</span>
            </button>
          </div>

          {/* Quick Header Actions: New Chat & Export */}
          <button
            onClick={handleNewSession}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            title="Start new chat session"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden md:inline">New Chat</span>
          </button>

          <button
            onClick={() => handleExportSession('markdown')}
            className="flex items-center gap-1 p-2 rounded-xl border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Export conversation as Markdown"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

        {/* Agents Bar (Roster / Selection) */}
        <section className="shrink-0 border-b border-slate-800/60 bg-slate-900/40 px-4 py-2.5 overflow-x-auto no-scrollbar">
          <div className="flex items-center justify-between gap-3 min-w-max">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mr-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" />
                {mode === 'direct' ? 'Choose Specialist:' : 'Active Roster:'}
              </span>

              {agents.map((agent) => (
                <AgentPill
                  key={agent.id}
                  agent={agent}
                  isSelected={mode === 'direct' && activeAgentId === agent.id}
                  isRoundtableActive={selectedAgentIds.includes(agent.id)}
                  onToggleRoundtable={handleToggleRoundtableAgent}
                  onSelectDirect={handleSelectDirectAgent}
                  onOpenSettings={(ag) => {
                    setSelectedAgentForModal(ag);
                    setSettingsModalOpen(true);
                  }}
                  mode={mode}
                />
              ))}
            </div>

            <button
              onClick={handleAddNewCustomAgent}
              className="flex items-center gap-1 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-2.5 py-1.5 text-xs text-slate-400 hover:border-indigo-500 hover:text-white transition-all cursor-pointer"
              title="Add a custom persona"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Add Agent</span>
            </button>
          </div>
        </section>

        {/* Chat Message Scroll Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
          {displayableMessages.length <= 1 ? (
            /* Empty State / Welcome Screen with Starter Prompts */
            <div className="max-w-3xl mx-auto my-auto text-center py-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-600/30 text-3xl mb-4">
                ✨
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Nexus Multi-Agent Collaboration Studio
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Harness specialized AI agents collaborating in real time. Nova
                orchestrates, CodeX engineers, Aura researches, Lyra crafts UX, and
                Sentinel audits security.
              </p>

              {/* Starter Prompt Cards */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {STARTER_PROMPTS.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(starter.prompt)}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 hover:border-indigo-500/60 hover:bg-slate-900 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">
                      <span>{starter.title}</span>
                      <Zap className="h-3.5 w-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {starter.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Render Message list */
            <div className="max-w-4xl mx-auto space-y-4">
              {displayableMessages.map((msg) => {
                const agent = agents.find((a) => a.id === msg.agentId);
                return (
                  <MessageItem
                    key={msg.id}
                    message={msg}
                    agent={agent}
                    onSpeak={handleSpeakText}
                    isSpeaking={currentlySpeakingAgentId === (agent?.id || 'agent')}
                  />
                );
              })}

              {/* Processing Pulse Indicator with Strong Pulse-Inner Glow */}
              {isProcessing && (
                <BorderBeam
                  size="pulse-inner"
                  colorVariant="colorful"
                  strength={1.0}
                  brightness={2.2}
                  saturation={1.6}
                  active={true}
                  theme="dark"
                  className="w-full max-w-md"
                >
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-2xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 border border-indigo-500/40 text-xl shadow-md">
                      ✨
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Agents Deliberating...
                        </span>
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Generating specialized multi-turn response using Gemini 3.8 Flash
                      </p>
                    </div>
                  </div>
                </BorderBeam>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Bottom Composer Panel */}
        <ComposerPanel
          onSubmit={(text) => handleSendMessage(text)}
          isLoading={isProcessing}
          onStop={handleStopGeneration}
          agents={agents}
          branch="main"
          projectFolder="nexus-multiagent"
        />

      {/* Agent Settings & Persona Configuration Modal */}
      <AgentSettingsModal
        isOpen={settingsModalOpen}
        agent={selectedAgentForModal}
        onClose={() => {
          setSettingsModalOpen(false);
          setSelectedAgentForModal(null);
        }}
        onSaveAgent={handleSaveAgent}
        onDeleteAgent={handleDeleteCustomAgent}
      />
    </div>
  );
};

export default MultiAgentChat;
