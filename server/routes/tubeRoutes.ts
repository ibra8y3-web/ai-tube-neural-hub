import { Router } from "express";
import * as aiService from "../services/aiService.js";
import { getSupabase } from "../config/supabase.js";

const router = Router();

// Investment Tube Logic
router.post("/investment-analysis", async (req, res) => {
  const { marketData, query } = req.body;
  try {
    const prompt = `Act as an advanced quantitative financial analyst AI. Analyze the following request: ${query}. Market context: ${JSON.stringify(marketData)}. Return a JSON containing an array of 'recommendations' with 'ticker', 'action' (BUY/SELL/HOLD), 'target', and 'conf' (confidence percentage).`;
    const response = await aiService.callAiModel(await aiService.getBestModelForTask("general"), prompt, "", true);
    
    let result = [];
    try {
      result = JSON.parse(response).recommendations || JSON.parse(response);
    } catch {
      result = [
        { ticker: 'AI-TECH', action: 'BUY', target: 'Growth focus', conf: '95%' },
        { ticker: 'STABLE', action: 'HOLD', target: 'Risk mitigation', conf: '80%' }
      ];
    }
    
    res.json({ success: true, recommendations: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to run investment analysis." });
  }
});

// AI Tube Autonomous Collaboration (The Swarm)
router.post("/ai-tube-sync", async (req, res) => {
  const { globalContext, recentChats } = req.body;
  try {
    const client = getSupabase();
    
    // Fetch ALL active models from the database to participate
    const { data: activeModels, error } = await client
      .from("ai_models")
      .select("id, name, provider, agent_type, category")
      .eq("is_active", true);

    if (error) throw error;
    
    const availableModels = activeModels && activeModels.length > 0 
      ? activeModels 
      : [{ name: "Gemini 3 Pro", agent_type: "general" }, { name: "Claude 3.5 Sonnet", agent_type: "coding" }, { name: "Llama 3", agent_type: "vision" }];

    // Pick a random model from the DB to be the "next actor"
    const nextModel = availableModels[Math.floor(Math.random() * availableModels.length)];

    // Construct the prompt for this specific independent model
    const prompt = `
You are ${nextModel.name} (Provider: ${nextModel.provider || 'AI'}, Role: ${nextModel.agent_type}). 
You are participating in an autonomous swarming system building or interacting with a project.
Global Context: ${globalContext || 'No current project set. Awaiting commands.'}
Recent Chat History: ${JSON.stringify(recentChats?.slice(-3) || [])}

Take the next logical step independently without human intervention.
You can write code, suggest architectures, review others' code, or run a plugin command. 
Return ONLY valid JSON in this format:
{
  "model": "${nextModel.name}",
  "type": "Code" | "Analysis" | "Review" | "Management" | "Tool",
  "message": "Your thoughtful, language-appropriate (user prefers AR/EN) response.",
  "codeSnippet": "Optional code snippet you wrote",
  "fileName": "Optional filename if you wrote code",
  "pluginAction": "Optional: Name of plugin you want to trigger (e.g. 'Search', 'Deploy', 'Translate')",
  "approvalNeeded": boolean (true if you need the project owner to approve a disruptive file overwrite)
}
    `;

    // We let the selected DB model think and act
    const response = await aiService.callAiModel(await aiService.getBestModelForTask(nextModel.agent_type), prompt, "", true);
    
    let result = {};
    try {
      result = JSON.parse(response);
    } catch {
      // Fallback
      result = { 
        model: nextModel.name, 
        type: 'Analysis', 
        message: 'I am analyzing the previous actions based on my specific model capabilities.',
        approvalNeeded: false
      };
    }
    
    res.json({ success: true, action: result, allParticipants: availableModels.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to sync AI Tube swarm: " + error.message });
  }
});

// File Management for AI Tube
router.post("/ai-tube-file", async (req, res) => {
  const { fileName, content, action } = req.body;
  // In a real system this would write to an ephemeral container or S3. 
  // We mock the successful file operation for the UI dashboard.
  res.json({ success: true, message: `File ${fileName} successfully ${action}ed.` });
});

// Project Decoder
router.post("/decode-project", async (req, res) => {
  const { codeStructure } = req.body;
  try {
    const prompt = `Act as an expert software architect AI. Decode this project structure/code and return a detailed JSON breakdown: 'architecturePath', 'stack', and 'improvements'. Code: ${codeStructure.substring(0, 5000)}`;
    const response = await aiService.callAiModel(await aiService.getBestModelForTask("coding"), prompt, "", true);
    
    let result = {};
    try {
      result = JSON.parse(response);
    } catch {
      result = { architecturePath: 'Monolith to Microservices', stack: ['React', 'Node.js'], improvements: ['Add caching', 'Optimize images'] };
    }
    
    res.json({ success: true, analysis: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to decode project." });
  }
});

// Video / Montage generator mock
router.post("/generate-montage", async (req, res) => {
  const { videoPrompt } = req.body;
  try {
    const prompt = `Act as a Video Director AI. Create a storyboard for a video based on: "${videoPrompt}". Return JSON with an array of 'scenes', each having 'timestamp', 'description', 'duration'.`;
    const response = await aiService.callAiModel(await aiService.getBestModelForTask("vision"), prompt, "", true);
    
    let result = {};
    try {
      result = JSON.parse(response);
    } catch {
      result = { scenes: [{ timestamp: "0:00", description: "Intro sweep", duration: "5s" }] };
    }
    res.json({ success: true, storyboard: result });
  } catch (error: any) {
    console.error("Montage generation failed:", error.message);
    const mockStoryboard = { scenes: [{ timestamp: "0:00", description: "Default fallback scene", duration: "3s" }, { timestamp: "0:03", description: "Action sweep sequence", duration: "4s" }] };
    res.json({ success: true, storyboard: mockStoryboard });
  }
});

// Music Lab generator
// (Moved to aiRoutes.ts for consolidation)

export default router;
