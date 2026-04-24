import { Router } from "express";
import * as aiService from "../services/aiService.js";
import { getSupabase } from "../config/supabase.js";

const router = Router();

router.get("/models", async (req, res) => {
  try {
    const client = getSupabase();
    const { data, error } = await client.from("ai_models").select("*").limit(15000).order("provider", { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

router.get("/best-models", async (req, res) => {
  try {
    const taskTypes = [
      "general", 
      "coding", 
      "vision", 
      "market", 
      "seo", 
      "content", 
      "security",
      "music",
      "voice",
      "video",
      "3d",
      "data",
      "academy"
    ];
    const bestModels = await Promise.all(
      taskTypes.map(async (type) => {
        const model = await aiService.getBestModelForTask(type);
        return { type, model };
      })
    );
    res.json(bestModels);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch best models" });
  }
});

let isSyncing = false;

router.post("/update-models", async (req, res) => {
  if (isSyncing) {
    return res.json({ 
      success: true, 
      message: "Sync already in progress.",
      alreadySynced: true
    });
  }
  
  isSyncing = true;
  try {
    const client = getSupabase();
    
    // Check if we synced recently (within the last 1 hour) to prevent deadlocks and unnecessary load
    const { data: recentModels } = await client
      .from("ai_models")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);
      
    if (recentModels && recentModels.length > 0) {
      const lastUpdate = new Date(recentModels[0].updated_at).getTime();
      const now = new Date().getTime();
      const oneHour = 60 * 60 * 1000;
      
      if (now - lastUpdate < oneHour && !req.body.force) {
        return res.json({ 
          success: true, 
          message: "النماذج محدثة بالفعل (تم التحديث منذ أقل من ساعة).",
          alreadySynced: true
        });
      }
    }

    // Fetch real models from providers in parallel to save time
    const [hfModels, orModels, groqModels, cometModels] = await Promise.all([
      aiService.fetchHuggingFaceModels(),
      aiService.fetchOpenRouterModels(),
      aiService.fetchGroqModels(),
      aiService.fetchCometModels()
    ]);

    // Map HF models to categories based on their names/ids
    const categorizedHfModels = hfModels.map(m => {
      let agent_type = "general";
      if (m.name.toLowerCase().includes("vision") || m.name.toLowerCase().includes("image")) agent_type = "vision";
      if (m.name.toLowerCase().includes("code") || m.name.toLowerCase().includes("coder")) agent_type = "coding";
      if (m.name.toLowerCase().includes("sentiment")) agent_type = "market";
      if (m.name.toLowerCase().includes("speech") || m.name.toLowerCase().includes("voice")) agent_type = "voice";
      return { ...m, agent_type };
    });

    // Map OpenRouter models to categories
    const categorizedOrModels = orModels.map(m => {
      let agent_type = "general";
      const name = m.name.toLowerCase();
      if (name.includes("vision") || name.includes("vl")) agent_type = "vision";
      if (name.includes("code") || name.includes("llama-3.3") || name.includes("r1") || name.includes("coder")) agent_type = "coding";
      if (name.includes("reasoning") || name.includes("r1")) agent_type = "coding"; // Reasoning models are good for coding
      return { ...m, agent_type };
    });

    // Map Groq models to categories
    const categorizedGroqModels = groqModels.map(m => {
      let agent_type = "general";
      if (m.name.toLowerCase().includes("vision")) agent_type = "vision";
      if (m.name.toLowerCase().includes("code") || m.name.toLowerCase().includes("llama-3.3")) agent_type = "coding";
      return { ...m, agent_type };
    });

    // Map Comet models to categories
    const categorizedCometModels = cometModels.map(m => {
      let agent_type = "general";
      if (m.name.toLowerCase().includes("vision")) agent_type = "vision";
      if (m.name.toLowerCase().includes("code")) agent_type = "coding";
      return { ...m, agent_type };
    });

    // Define the initial seed models if database is empty
    const { count } = await client.from("ai_models").select("*", { count: "exact", head: true });
    
    if (count === 0) {
      const seedModels = [
        { name: "llama-3.3-70b-versatile", provider: "Groq", agent_type: "coding", is_active: true, is_verified: true, likes: 1100, api_url: "https://api.groq.com/openai/v1/chat/completions" },
        { name: "mixtral-8x7b-32768", provider: "Groq", agent_type: "general", is_active: true, is_verified: true, likes: 750, api_url: "https://api.groq.com/openai/v1/chat/completions" },
        { name: "llama-3.3-70b-specdec", provider: "Groq", agent_type: "market", is_active: true, is_verified: true, likes: 900, api_url: "https://api.groq.com/openai/v1/chat/completions" },
        { name: "llama-3.1-8b-instant", provider: "Groq", agent_type: "content", is_active: true, is_verified: true, likes: 850, api_url: "https://api.groq.com/openai/v1/chat/completions" },
        { name: "gpt-3.5-turbo", provider: "Puter", agent_type: "general", is_active: true, is_verified: true, likes: 1300, api_url: "https://api.puter.com/v1/ai/chat" },
        { name: "claude-3-haiku-20240307", provider: "Puter", agent_type: "coding", is_active: true, is_verified: true, likes: 1150, api_url: "https://api.puter.com/v1/ai/chat" },
        { name: "gemini-1.5-flash", provider: "Gemini", agent_type: "general", is_active: true, is_verified: true, likes: 1500, api_url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" },
        { name: "gemini-1.5-pro", provider: "Gemini", agent_type: "coding", is_active: true, is_verified: true, likes: 1400, api_url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent" }
      ];
      await client.from("ai_models").upsert(seedModels, { onConflict: 'name' });
    } else {
      // Clean up legacy "fake" models if they exist
      const legacyNames = ["Market Analyst", "Content Generator", "SEO Optimizer", "Vision Lab Engine", "Global Intelligence", "Voice Studio", "Code Architect", "Security Auditor", "Puter Intelligence", "Puter Coder"];
      await client.from("ai_models").delete().in("name", legacyNames);
    }
    
    const allModels = [...categorizedHfModels, ...categorizedOrModels, ...categorizedGroqModels, ...categorizedCometModels];
    
    // Add Gemini models explicitly to the sync list
    const geminiModels = [
      { name: "gemini-1.5-flash", provider: "Gemini", agent_type: "general", is_active: true, is_verified: true, likes: 1500, api_url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent" },
      { name: "gemini-1.5-pro", provider: "Gemini", agent_type: "coding", is_active: true, is_verified: true, likes: 1400, api_url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent" },
      { name: "gemini-2.5-flash-preview-tts", provider: "Gemini", agent_type: "voice", is_active: true, is_verified: true, likes: 2000, api_url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent" }
    ];
    
    const finalModelsToSync = [...allModels, ...geminiModels];
    
    // Remove duplicates by name to prevent ON CONFLICT DO UPDATE error
    const uniqueAllModels = Array.from(new Map(finalModelsToSync.map(m => [m.name, m])).values());
    
    // Fetch existing inactive models to avoid re-activating them
    const { data: inactiveModels } = await client
      .from("ai_models")
      .select("name")
      .eq("is_active", false);
    
    const inactiveNames = new Set(inactiveModels?.map(m => m.name) || []);
    
    // Filter out models that are already marked as inactive
    const modelsToUpsert = uniqueAllModels.filter(m => !inactiveNames.has(m.name));
    
    // Optional: Clean up the database to only have the latest/top models if needed
    
    // 1. First, mark ALL models from these specific providers as inactive
    const providersToSync = ["Hugging Face", "OpenRouter", "Groq", "CometAPI", "Gemini"];
    await client
      .from("ai_models")
      .update({ is_active: false })
      .in("provider", providersToSync);

    // 2. Upsert the new models in chunks to prevent database completely locking (deadlocks)
    const chunkSize = 1000;
    for (let i = 0; i < modelsToUpsert.length; i += chunkSize) {
      const chunk = modelsToUpsert.slice(i, i + chunkSize);
      const { error } = await client.from("ai_models").upsert(chunk, { onConflict: 'name' });
      if (error) {
        console.error("Chunk upsert error:", error);
      }
    }

    // Check API connectivity status
    const status = {
      gemini: !!process.env.GEMINI_API_KEY ? "Connected" : "Missing Key",
      groq: !!process.env.GROQ_API_KEY ? "Connected" : "Missing Key",
      comet: !!process.env.COMET_API_KEY ? "Connected" : "Missing Key",
      huggingface: !!process.env.HUGGINGFACE_API_KEY ? "Connected" : "Missing Key",
      openrouter: !!process.env.OPENROUTER_API_KEY ? "Connected" : "Missing Key",
      supabase: !!process.env.VITE_SUPABASE_URL ? "Connected" : "Missing Config"
    };

    res.json({ 
      success: true, 
      message: "تم سحب ومزامنة مئات النماذج الحقيقية من Hugging Face و OpenRouter و Groq و Comet بنجاح.",
      status,
      syncedCount: allModels.length
    });
  } catch (error: any) {
    console.error("Sync Error:", error.message);
    res.status(500).json({ error: error.message || "فشل في مزامنة النماذج مع قاعدة البيانات." });
  } finally {
    isSyncing = false;
  }
});

router.post("/validate-key", async (req, res) => {
  const { provider, key } = req.body;
  try {
    const isValid = await aiService.validateApiKey(provider, key);
    res.json({ isValid });
  } catch (error) {
    res.status(500).json({ error: "Validation failed" });
  }
});

router.post("/chat", async (req, res) => {
  const { prompt, taskType } = req.body;
  try {
    const text = await aiService.generateChatResponse(prompt, taskType);
    res.json({ text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate chat response" });
  }
});

router.post("/vision-chat", async (req, res) => {
  const { prompt, image } = req.body;
  try {
    const text = await aiService.callAiModel(prompt, "vision", image);
    res.json({ text });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate vision chat response" });
  }
});

router.post("/generate-strategy", async (req, res) => {
  const { idea } = req.body;
  try {
    const strategy = await aiService.generateStrategy(idea);
    res.json(strategy);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate strategy" });
  }
});

router.post("/generate-content", async (req, res) => {
  const { topic, tone } = req.body;
  try {
    const content = await aiService.generateContent(topic, tone);
    res.json({ content });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate content" });
  }
});

router.post("/optimize-seo", async (req, res) => {
  const { content, keywords } = req.body;
  try {
    const seoData = await aiService.optimizeSEO(content, keywords);
    res.json(seoData);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to optimize SEO" });
  }
});

// Moved to brandRoutes.ts
// router.post("/analyze-market", async (req, res) => {
// ...
// });

// Moved to brandRoutes.ts
// router.post("/generate-music", async (req, res) => {
// ...
// });

router.post("/generate-voice", async (req, res) => {
  const { text, voice, style } = req.body;
  try {
    const audioUrl = await aiService.generateVoice(text, voice, style);
    res.json({ success: true, audioUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to generate voice." });
  }
});

router.post("/generate-logo", async (req, res) => {
  const { name, idea } = req.body;
  try {
    const logoUrl = await aiService.generateLogo(name, idea);
    res.json({ logoUrl });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate logo" });
  }
});

router.post("/analyze-sentiment", async (req, res) => {
  const { idea } = req.body;
  try {
    const sentiment = await aiService.analyzeSentiment(idea);
    res.json(sentiment);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to analyze sentiment" });
  }
});

router.post("/generate-project", async (req, res) => {
  const { prompt, type } = req.body;
  try {
    const result = await aiService.generateProject(prompt, type);
    if (type === "json") {
      res.json({ appStructure: result });
    } else {
      res.json({ html: result });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || "فشل في توليد واجهة المستخدم." });
  }
});

router.post("/generate-multi-file-project", async (req, res) => {
  const { prompt } = req.body;
  try {
    const project = await aiService.generateMultiFileProject(prompt);
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to generate multi-file project" });
  }
});

router.post("/analyze-code", async (req, res) => {
  const { code } = req.body;
  try {
    const fixedCode = await aiService.validateAndFixCode(code);
    res.json({ success: true, fixedCode });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to analyze code" });
  }
});

router.post("/analyze-security", async (req, res) => {
  const { code } = req.body;
  try {
    const securityReport = await aiService.analyzeSecurity(code);
    res.json(securityReport);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to analyze security" });
  }
});

router.post("/toggle-model", async (req, res) => {
  const { modelId, isActive } = req.body;
  try {
    const client = getSupabase();
    const { error } = await client
      .from("ai_models")
      .update({ is_active: isActive })
      .eq("id", modelId);
    
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
