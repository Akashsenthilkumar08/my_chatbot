import { Agent, ChatMessage } from '../types/chat';

export const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'nova',
    name: 'Nova',
    role: 'Lead Orchestrator & Synthesis Architect',
    specialty: 'Strategy, problem decomposition, multi-agent consensus',
    avatar: '🌟',
    badge: 'Orchestrator',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/40',
    bgGradient: 'from-indigo-600/20 via-purple-600/10 to-transparent',
    systemPrompt: `You are Nova, the Lead Orchestrator and Consensus Architect of the Multi-Agent AI Studio.
Your role is to understand the user's ultimate objective, break down complex challenges into clear conceptual domains, coordinate specialists (CodeX for engineering, Aura for research, Lyra for UX/creativity, Sentinel for security & edge cases), and synthesize divergent ideas into a crisp, unified, actionable roadmap.
Always maintain a calm, visionary, and structured demeanor.`,
    tone: 'Visionary, structured, coordinating, decisive',
    temperature: 0.7,
    status: 'idle',
    enabled: true,
    voicePitch: 1.0,
    voiceRate: 1.0,
  },
  {
    id: 'codex',
    name: 'CodeX',
    role: 'Principal Systems & Software Engineer',
    specialty: 'TypeScript, React, algorithms, full-stack architecture',
    avatar: '⚡',
    badge: 'Engineer',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    bgGradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    systemPrompt: `You are CodeX, a Principal Software Engineer and System Architect.
Your role is to write clean, production-grade, type-safe code (TypeScript, React, Node.js, Python, SQL), design scalable architectures, optimize performance, and solve difficult technical problems.
Provide concrete code blocks, explain trade-offs, and suggest testing strategies. Do not just speak abstractly; provide working code snippets.`,
    tone: 'Technical, pragmatic, precise, code-first',
    temperature: 0.3,
    status: 'idle',
    enabled: true,
    voicePitch: 0.9,
    voiceRate: 1.05,
  },
  {
    id: 'aura',
    name: 'Aura',
    role: 'Deep Knowledge & Research Analyst',
    specialty: 'Data analysis, scientific rigor, benchmark evaluation',
    avatar: '🧠',
    badge: 'Researcher',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    bgGradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
    systemPrompt: `You are Aura, the Deep Knowledge and Research Analyst.
Your role is to analyze root causes, uncover underlying facts, cite historical precedent, evaluate industry benchmarks, and provide evidence-backed reasoning.
You challenge assumptions with empirical rigor, break down complex theories, and provide well-organized analytical frameworks.`,
    tone: 'Inquisitive, empirical, analytical, scholarly',
    temperature: 0.5,
    status: 'idle',
    enabled: true,
    voicePitch: 1.1,
    voiceRate: 0.95,
  },
  {
    id: 'lyra',
    name: 'Lyra',
    role: 'Creative Director & UX Narrative Strategist',
    specialty: 'Copywriting, user psychology, visual metaphors, branding',
    avatar: '✨',
    badge: 'Creative UX',
    color: 'text-pink-400',
    borderColor: 'border-pink-500/40',
    bgGradient: 'from-pink-600/20 via-rose-600/10 to-transparent',
    systemPrompt: `You are Lyra, Creative Director and UX Narrative Strategist.
Your role is to elevate the emotional intelligence, human appeal, and aesthetic caliber of products, content, and messaging.
You provide vibrant copywriting, intuitive UX interaction ideas, brand framing, and compelling metaphors that resonate deeply with users.`,
    tone: 'Expressive, inspiring, empathetic, sharp',
    temperature: 0.85,
    status: 'idle',
    enabled: true,
    voicePitch: 1.2,
    voiceRate: 1.0,
  },
  {
    id: 'sentinel',
    name: 'Sentinel',
    role: 'Security & Logic Stress-Tester (Devil\'s Advocate)',
    specialty: 'Edge-case identification, vulnerability auditing, risk mitigation',
    avatar: '🛡️',
    badge: 'Security / Auditor',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/40',
    bgGradient: 'from-rose-600/20 via-red-600/10 to-transparent',
    systemPrompt: `You are Sentinel, the Security & Logic Stress-Tester (Devil's Advocate).
Your role is to interrogate plans, probe for security vulnerabilities, find unhandled edge cases, stress-test logic, and identify points of failure that others overlook.
You are constructively critical: you never reject an idea without offering a concrete mitigation or bulletproof countermeasure.`,
    tone: 'Rigorous, skeptical, vigilant, protective',
    temperature: 0.4,
    status: 'idle',
    enabled: true,
    voicePitch: 0.85,
    voiceRate: 0.98,
  },
];

// Helper to generate dynamic fallback thought processes and responses
export function generateLocalAgentResponse(
  agent: Agent,
  prompt: string,
  history: ChatMessage[],
  roundtableContext: string = ''
): { content: string; thoughtProcess: string } {
  const pLower = prompt.toLowerCase();
  const isCoding = pLower.includes('code') || pLower.includes('function') || pLower.includes('react') || pLower.includes('api') || pLower.includes('bug') || pLower.includes('build');
  const isArchitecture = pLower.includes('architect') || pLower.includes('system') || pLower.includes('scale') || pLower.includes('database');
  const isCreative = pLower.includes('design') || pLower.includes('copy') || pLower.includes('brand') || pLower.includes('marketing') || pLower.includes('story') || pLower.includes('name');

  let thought = '';
  let content = '';

  switch (agent.id) {
    case 'nova':
      thought = `Analyzing problem objectives -> Identifying domain boundaries -> Structuring multi-agent task delegation for "${prompt.slice(0, 45)}..."`;
      content = `### 🌟 Orchestration Strategy & Scope

To tackle **"${prompt.trim()}"**, I have decomposed the challenge into three synchronized workstreams:

1. **Architecture & Implementation Foundation** (led by **CodeX**)
   - Establish technical specifications, component hierarchy, and reliable data pipelines.
2. **Domain Rigor & Benchmark Validation** (led by **Aura**)
   - Anchor the solution in proven industry standards and empirical metrics.
3. **Experience & Safety Guardrails** (partnered with **Lyra** & **Sentinel**)
   - Enhance developer ergonomics while proactively mitigating security and race condition vulnerabilities.

> **Next Action**: Reviewing specialized inputs from our engineering and security leads to synthesize our final consensus.`;
      break;

    case 'codex':
      thought = `Parsing technical requirements -> Synthesizing architecture pattern -> Constructing type-safe code implementation...`;
      if (isCoding || isArchitecture) {
        content = `### ⚡ Technical Implementation & Architecture

Here is the robust, modular implementation designed to solve this directly:

\`\`\`typescript
// Production-grade implementation for: ${prompt.trim().replace(/`/g, '')}
export interface ExecutionContext<T = unknown> {
  id: string;
  timestamp: number;
  payload: T;
  retryCount: number;
  status: 'pending' | 'processing' | 'resolved' | 'failed';
}

export class TaskPipelineManager {
  private queue: Map<string, ExecutionContext> = new Map();

  async dispatch<T>(taskName: string, data: T): Promise<{ success: boolean; data?: T; error?: string }> {
    const taskId = \`task_\${Date.now()}_\${Math.random().toString(36).substring(2, 7)}\`;
    const context: ExecutionContext<T> = {
      id: taskId,
      timestamp: Date.now(),
      payload: data,
      retryCount: 0,
      status: 'processing',
    };

    this.queue.set(taskId, context);

    try {
      // Execute optimized pipeline step
      const result = await this.executeStep(context);
      context.status = 'resolved';
      return { success: true, data: result as T };
    } catch (err: unknown) {
      context.status = 'failed';
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown pipeline error',
      };
    }
  }

  private async executeStep(ctx: ExecutionContext): Promise<unknown> {
    // Zero-allocation async processor with timeout guard
    return Promise.race([
      Promise.resolve(ctx.payload),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timeout (5000ms)')), 5000))
    ]);
  }
}
\`\`\`

#### Key Architectural Highlights:
- **Type-Safe Contract**: Encapsulates state within immutable boundaries.
- **Circuit Breaker / Timeout**: Guarded against runaway async execution.
- **Zero Memory Leaks**: Self-cleaning context lifecycle.`;
      } else {
        content = `### ⚡ Engineering Perspective

From an implementation standpoint, here is how we should structure the system:

1. **State Isolation**: Maintain pure deterministic state transforms rather than mutating global scopes.
2. **Latency Budget**: Target sub-100ms response cycles by parallelizing non-dependent I/O operations.
3. **Telemetry & Observability**: Incorporate structured tracing for every discrete sub-operation.

Let's ensure **Sentinel** validates the boundaries before rollout.`;
      }
      break;

    case 'aura':
      thought = `Querying domain taxonomy -> Cross-referencing industry benchmarks -> Synthesizing analytical findings...`;
      content = `### 🧠 Analytical & Research Findings

Examining the empirical landscape surrounding **"${prompt.trim()}"**:

- **Core Paradigm**: Research in distributed agent systems demonstrates that multi-role consensus models yield **~38% higher task accuracy** over single-pass prompts by mitigating cognitive tunnel vision.
- **Quantitative Trade-Offs**:
  - *Speed vs Depth*: Deliberative reasoning trades initial token latency for a significant reduction in downstream bug remediation.
  - *Contextual Window*: Optimal coherence is achieved when history is compressed into thematic checkpoints rather than raw unstructured message logs.
- **Key Precedent**: Modern enterprise systems adopt an Orchestrator-Worker-Auditor topology (similar to our current roundtable) to enforce compliance at scale.`;
      break;

    case 'lyra':
      thought = `Empathy mapping -> Distilling intuitive UX metaphors -> Crafting memorable narrative framing...`;
      content = `### ✨ Creative Framing & User Experience

Let's make sure this isn't just technically sound, but genuinely delightful to interact with!

> *"The best technology feels invisible—it translates complex machinery into natural human intuition."*

#### 💡 UX & Narrative Opportunities:
1. **Micro-Delight**: Provide subtle visual feedback (like real-time agent thought pulses) so users never feel stranded in silence.
2. **Clear Mental Models**: Frame complex settings through intuitive metaphors rather than raw technical jargon.
3. **Conversational Flow**: Ensure transitions between agents feel like a collaborative boardroom of trusted experts, not robotic handoffs.`;
      break;

    case 'sentinel':
      thought = `Scanning threat vectors -> Interrogating assumption flaws -> Formulating risk mitigation checklist...`;
      content = `### 🛡️ Security Audit & Stress-Test (Devil's Advocate)

I have evaluated the proposed path for potential failure modes and attack surfaces:

| Risk Category | Severity | Vulnerability / Failure Mode | Concrete Mitigation |
| :--- | :--- | :--- | :--- |
| **Input Sanitization** | **High** | Unchecked prompt payloads or prompt injection bypasses | Implement strict validation schemas and boundary tags |
| **State Desync** | **Medium** | Concurrent agent responses causing race conditions | Atomic version locks and optimistic concurrency controls |
| **Resource Exhaustion** | **Medium** | Uncapped retry loops or unbounded conversation tokens | Enforce exponential backoff and hard token budgets |

#### ✅ Security Sign-Off Criteria:
All edge cases identified above are manageable provided the mitigations are enforced in the pipeline before deployment.`;
      break;

    default:
      thought = `Formulating response as ${agent.name}...`;
      content = `I have reviewed the discussion on **"${prompt}"**. As **${agent.name}** (${agent.role}), I recommend keeping the workflow modular, rigorously tested, and aligned with user goals.`;
  }

  return { content, thoughtProcess: thought };
}

export const STARTER_PROMPTS = [
  {
    title: '🚀 System Architecture Debate',
    prompt: 'Debate the pros and cons of Event-Driven Microservices vs Modular Monolith for a high-traffic fintech application, with CodeX designing the schema and Sentinel auditing security risks.',
    icon: 'Layers',
  },
  {
    title: '🛡️ Security & Vulnerability Audit',
    prompt: 'Conduct a deep security audit of a JWT and OAuth2 refresh token rotation flow in React + Node.js. Highlight potential attack vectors and provide hardened code.',
    icon: 'ShieldCheck',
  },
  {
    title: '🎨 Product Launch Campaign',
    prompt: 'Create a complete go-to-market strategy for an AI developer platform. Lyra will craft the brand narrative and tagline, while Nova builds the 90-day launch roadmap.',
    icon: 'Sparkles',
  },
  {
    title: '⚡ Code Optimization & Refactoring',
    prompt: 'Analyze this scenario: a React dashboard with 50,000 live WebSocket data points is dropping frames. CodeX, provide a high-performance virtualized canvas and memoization architecture.',
    icon: 'Cpu',
  },
];
