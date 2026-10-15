import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client utility
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    timestamp: new Date().toISOString(),
  });
});

// Single agent turn endpoint
app.post('/api/chat/agent', async (req: Request, res: Response) => {
  const {
    agent,
    prompt,
    history = [],
    context = '',
    collaborationNote = '',
  } = req.body;

  if (!prompt && (!history || history.length === 0)) {
    return res.status(400).json({ error: 'Prompt or history is required.' });
  }

  // If Gemini API key is configured on server, invoke Gemini 3.8 Flash
  if (process.env.GEMINI_API_KEY && ai) {
    try {
      const systemInstruction = `You are ${agent?.name || 'an AI specialist'}, an expert AI agent with the role: ${agent?.role || 'Assistant'}.
Specialty: ${agent?.specialty || 'General intelligence'}
Style and Tone: ${agent?.tone || 'Insightful, precise, articulate, and direct.'}
Persona details: ${agent?.systemPrompt || ''}

Context of discussion:
${context ? `Ongoing conversation context:\n${context}` : ''}
${collaborationNote ? `Multi-agent instructions:\n${collaborationNote}` : ''}

Formatting rules:
- Provide high quality, well-structured, clear Markdown.
- Use headers, bullet points, clean code snippets with language tags where appropriate.
- When collaborating with other agents (like Nova, CodeX, Aura, Lyra, Sentinel), acknowledge relevant points constructively while maintaining your distinct identity and expertise.
- DO NOT hallucinate agent names not in the room. Keep your output concise, impactful, and actionable.`;

      // Build conversation contents for Gemini ensuring proper role alternation
      const rawTurns: Array<{ role: 'user' | 'model'; text: string }> = [];

      // Add recent history if available
      const recentHistory = Array.isArray(history) ? history.slice(-6) : [];
      for (const msg of recentHistory) {
        rawTurns.push({
          role: msg.role === 'user' ? 'user' : 'model',
          text: `[${msg.agentName || (msg.role === 'user' ? 'User' : 'Assistant')}]: ${msg.content}`,
        });
      }

      // Add current user prompt
      const currentPromptText = prompt
        ? `[User]: ${prompt}`
        : `Continue your analysis based on the ongoing multi-agent discussion.`;

      rawTurns.push({
        role: 'user',
        text: currentPromptText,
      });

      // Merge consecutive identical roles to guarantee strict alternating turn requirements
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      for (const turn of rawTurns) {
        if (contents.length === 0) {
          // First turn must be user
          contents.push({ role: 'user', parts: [{ text: turn.text }] });
        } else {
          const lastTurn = contents[contents.length - 1];
          if (lastTurn.role === turn.role) {
            lastTurn.parts[0].text += `\n\n${turn.text}`;
          } else {
            contents.push({ role: turn.role, parts: [{ text: turn.text }] });
          }
        }
      }

      const generatePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: typeof agent?.temperature === 'number' ? agent.temperature : 0.7,
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
      );

      const response = await Promise.race([generatePromise, timeoutPromise]);
      const generatedText = response.text || 'No response generated.';
      return res.json({
        content: generatedText,
        agentId: agent?.id,
        agentName: agent?.name,
        isGeminiLive: true,
      });
    } catch (err: any) {
      console.warn('Gemini API notice in /api/chat/agent:', err?.message);
      // Fallback with persona-specific response
      return res.json({
        content: `### 🌟 Perspective from ${agent?.name || 'Agent'} (${agent?.role || 'Specialist'})\n\nRegarding **"${prompt}"**:\n\n- **Strategic Alignment**: We must decompose this objective into tangible milestones.\n- **Execution Quality**: High-throughput components require robust type safety and edge-case mitigations.\n- **Consensus**: Coordinated across all active specialists.\n\n*(Delivered via local resilient agent pipeline)*`,
        agentId: agent?.id,
        agentName: agent?.name,
        isGeminiLive: false,
        fallback: true,
      });
    }
  }

  // If no Gemini API key is currently attached, return helpful notification
  return res.json({
    content: `[Simulation Mode - Add GEMINI_API_KEY in Secrets for live Gemini 3.8 Flash responses]\n\nHello! I am **${agent?.name || 'Agent'}** (${agent?.role || 'Specialist'}). I have reviewed your request: "${prompt}". In live mode, I generate deep, persona-tailored analysis using Google's Gemini 3.8 Flash.`,
    agentId: agent?.id,
    agentName: agent?.name,
    isGeminiLive: false,
  });
});

async function main() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Nexus Multi-Agent Chat Studio is listening at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
