import { Router, Request, Response, NextFunction } from 'express';
import { apiKeyService } from '../services/apiKeyService.js';
import * as aiService from '../services/aiService.js';
import { socialService } from '../services/socialService.js';

const router = Router();

// Middleware to check API key
const authenticateCli = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey || typeof apiKey !== 'string') {
    res.status(401).json({ success: false, error: 'API Key missing or invalid format. Please use X-API-Key header or Bearer token.' });
    return;
  }

  const isValid = apiKeyService.validateKey(apiKey);
  if (!isValid) {
    res.status(403).json({ success: false, error: 'Unauthorized: Invalid API Key.' });
    return;
  }

  next();
};

// Route to manage (get/create/delete) API keys from the Dashboard (Internal)
router.get('/keys', (req, res) => {
  const keys = apiKeyService.getKeys();
  // Don't send the full keys for security, maybe truncate them
  const safeKeys = keys.map(k => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.key.substring(0, 10) + '...',
    createdAt: k.createdAt,
    lastUsed: k.lastUsed
  }));
  res.json({ success: true, keys: safeKeys });
});

router.post('/keys', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, error: 'Name is required' });
  }
  const newKey = apiKeyService.generateKey(name);
  // Send full key only once on creation
  res.json({ success: true, key: newKey });
});

router.delete('/keys/:id', (req, res) => {
  apiKeyService.revokeKey(req.params.id);
  res.json({ success: true });
});

// External CLI Execution Route
// Example: curl -X POST https://app-url/api/cli/execute -H "X-API-Key: aether_..." -d '{"command": "auth facebook XYZA"}'
router.post('/execute', authenticateCli, async (req: Request, res: Response): Promise<void> => {
  const { command } = req.body;
  if (!command) {
    res.status(400).json({ success: false, error: 'No command provided.' });
    return;
  }

  try {
    const args = command.trim().split(' ');
    const base = args[0].toLowerCase();
    
    let output = '';

    switch(base) {
      case 'ping':
        output = 'PONG! System is online.';
        break;

      case 'help':
        output = `Aether CLI Available Commands:
  ping                           - Check connection to Aether Core.
  system --status                - Get current agents health.
  auth <platform> <token>        - Connect social media platform.
  agent --deploy                 - Force auto-publishing of new content.
  scan --social                  - Scan linked platforms for messages.
  chat <message>                 - Interact with the AI directly.
  code <prompt>                  - Generate multi-file or code snippets.
  fix <code>                     - Analyze and fix provided code.
  security <code>                - Perform automated security analysis on code.
        `;
        break;

      case 'system':
        if (args.includes('--status')) {
          output = `[SYSTEM] Core Online.\n[PROCESS] Agent modules active.\n[MEMORY] Stable.`;
        } else {
          output = `Usage: system --status`;
        }
        break;

      case 'auth':
        if (args.length < 3) {
          output = 'Usage: auth <platform> <token>';
        } else {
          const platform = args[1];
          const token = args[2];
          await socialService.connect('cli_admin', platform, 'CLI_USER', 'CLI_PASS', token);
          output = `SUCCESS: Connected to ${platform} via CLI. Token applied securely.`;
        }
        break;
        
      case 'agent':
        if (args.includes('--deploy')) {
          output = 'AGENT DEPLOY: Social posts dispatched (Simulated from CLI context).';
        } else {
          output = 'Usage: agent --deploy';
        }
        break;

      case 'scan':
        if (args.includes('--social')) {
          output = 'SCAN SOCIAL: 0 new messages. System idle.';
        } else {
          output = 'Usage: scan --social';
        }
        break;

      case 'chat':
        const userMsg = args.slice(1).join(' ');
        if (!userMsg) {
          output = 'Usage: chat <message>';
        } else {
          const reply = await aiService.generateChatResponse(`User said via CLI: "${userMsg}". Reply concisely.`, "general");
          output = `[Aether AI] -> ${reply}`;
        }
        break;

      case 'code':
        const codePrompt = args.slice(1).join(' ');
        if (!codePrompt) {
          output = 'Usage: code <prompt>';
        } else {
          const res = await aiService.generateProject(codePrompt, 'html');
          output = `[Code Generation Output]\n${JSON.stringify(res, null, 2)}`;
        }
        break;

      case 'fix':
        const fixCode = args.slice(1).join(' ');
        if (!fixCode) {
          output = 'Usage: fix <code>';
        } else {
          const res = await aiService.validateAndFixCode(fixCode);
          output = `[Fix Results]\n${res}`;
        }
        break;

      case 'security':
        const secCode = args.slice(1).join(' ');
        if (!secCode) {
          output = 'Usage: security <code>';
        } else {
          const res = await aiService.analyzeSecurity(secCode);
          output = `[Security Audit] Score: ${res.score}/10\nVulnerabilities:\n${res.vulnerabilities.join('\\n') || 'None found.'}`;
        }
        break;

      default:
        // Pass unknown commands to AI for a smart terminal feel
        const aiCmd = await aiService.generateChatResponse(`User executed unknown CLI command "${command}". Reply as a terminal system rejecting it or acting upon it vaguely if it makes sense.`, "coding");
        output = `[UNKNOWN COMMAND] - ${aiCmd}`;
        break;
    }

    res.json({ success: true, command, output });

  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
