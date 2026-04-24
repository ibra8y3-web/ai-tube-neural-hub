import axios from "axios";
import dotenv from "dotenv";
import { getSupabase } from "../config/supabase.js";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const COMET_API_KEY = process.env.COMET_API_KEY || "";
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || "";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
const PUTER_API_KEY = process.env.PUTER_API_KEY || "";

export const fetchHuggingFaceModels = async (retries = 2) => {
  try {
    const tasks = ["text-generation", "text2text-generation", "text-to-image", "image-to-text", "text-to-speech", "automatic-speech-recognition", "conversational"];
    let allModels: any[] = [];

    for (const task of tasks) {
      // Pull heavily to get a massive diverse dataset of all active models
      const response = await axios.get(`https://huggingface.co/api/models?pipeline_tag=${task}&sort=downloads&direction=-1&limit=500&inference=warm`, {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
        timeout: 20000
      });
      
      const mapped = response.data
        .filter((m: any) => m.downloads > 100) // Only take models with more than 100 downloads
        .map((m: any) => ({
          name: m.id,
          provider: "Hugging Face",
          description: `Model by ${m.author || 'unknown'}. Downloads: ${m.downloads}. Task: ${task}`,
          category: task.includes("image") ? "Vision" : task.includes("speech") ? "Audio" : "NLP",
          is_active: true,
          api_url: `https://router.huggingface.co/hf-inference/models/${m.id}`
        }));
      
      allModels = [...allModels, ...mapped];
    }

    // Remove duplicates
    const uniqueModels = Array.from(new Map(allModels.map(m => [m.name, m])).values());
    
    // Filter out known problematic models, prompt guards, and audio models not suited for chat
    const filteredModels = uniqueModels.filter(m => {
      const name = m.name.toLowerCase();
      return !name.includes("qwen3") && 
             !name.includes("qwen-7b-chat") && 
             !name.includes("prompt-guard") && 
             !name.includes("whisper") &&
             !name.includes("stable-diffusion") &&
             !name.includes("allam") &&
             !name.includes("gpt-oss") &&
             !name.includes("orpheus");
    });

    return filteredModels;
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 408)) {
      console.log(`HF fetch timed out. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchHuggingFaceModels(retries - 1);
    }
    console.error("Error fetching HF models:", error.message);
    return [];
  }
};

export const fetchOpenRouterModels = async (retries = 3) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}` },
      timeout: 30000 // Increase timeout to 30s
    });
    
    // Process ALL active OpenRouter Models
    const allModels = response.data.data;
    
    // Give slight priority scoring implicitly by sorting, but keep all
    return allModels.map((m: any) => ({
        name: m.id,
        provider: "OpenRouter",
        description: m.description || `OpenRouter Model: ${m.name}`,
        category: "LLM",
        is_active: true,
        api_url: "https://openrouter.ai/api/v1/chat/completions"
      }));
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 408)) {
      console.log(`OpenRouter fetch timed out. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      return fetchOpenRouterModels(retries - 1);
    }
    console.error("Error fetching OpenRouter models:", error.message);
    return [];
  }
};

export const fetchGroqModels = async (retries = 2) => {
  try {
    const response = await axios.get("https://api.groq.com/openai/v1/models", {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
      timeout: 15000
    });
    return response.data.data.map((m: any) => ({
      name: m.id,
      provider: "Groq",
      description: `Groq model: ${m.id} (Owned by ${m.owned_by})`,
      category: "LLM",
      is_active: true,
      api_url: "https://api.groq.com/openai/v1/chat/completions"
    }));
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 408)) {
      console.log(`Groq fetch timed out. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchGroqModels(retries - 1);
    }
    console.error("Error fetching Groq models:", error.message);
    return [];
  }
};

export const fetchCometModels = async (retries = 2) => {
  try {
    const response = await axios.get("https://api.cometapi.com/v1/models", {
      headers: { Authorization: `Bearer ${COMET_API_KEY}` },
      timeout: 15000
    });
    return response.data.data.map((m: any) => ({
      name: m.id,
      provider: "CometAPI",
      description: `CometAPI model: ${m.id}`,
      category: "LLM",
      is_active: true,
      api_url: "https://api.cometapi.com/v1/chat/completions"
    }));
  } catch (error: any) {
    if (retries > 0 && (error.code === 'ECONNABORTED' || error.response?.status === 408)) {
      console.log(`Comet fetch timed out. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return fetchCometModels(retries - 1);
    }
    console.error("Error fetching CometAPI models:", error.message);
    return [];
  }
};

export const validateApiKey = async (provider: string, key: string) => {
  try {
    if (provider === "Groq") {
      await axios.get("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${key}` }
      });
    } else if (provider === "OpenRouter") {
      await axios.get("https://openrouter.ai/api/v1/models", {
        headers: { Authorization: `Bearer ${key}` }
      });
    } else if (provider === "Hugging Face") {
      await axios.get("https://huggingface.co/api/whoami-v2", {
        headers: { Authorization: `Bearer ${key}` }
      });
    }
    return true;
  } catch (error) {
    return false;
  }
};

export const getBestModelForTask = async (taskType: string, excludeIds: string[] = []) => {
  const client = getSupabase();
  
  // Fetch a large pool of active models to allow massive cycling
  let query = client
    .from("ai_models")
    .select("*")
    .eq("is_active", true)
    .limit(3000);
    
  const { data: allModels, error } = await query
    .order("likes", { ascending: false });

  if (error || !allModels || allModels.length === 0) {
    // Ultimate fallback to a reliable fast model
    if (excludeIds.includes("llama-3.3-70b-versatile")) {
        return { provider: "OpenRouter", name: "openai/gpt-4o-mini", api_url: "https://openrouter.ai/api/v1/chat/completions", agent_type: taskType };
    }
    return { provider: "Groq", name: "llama-3.3-70b-versatile", api_url: "https://api.groq.com/openai/v1/chat/completions", agent_type: taskType };
  }

  // Filter out excluded first
  const models = allModels.filter(m => !excludeIds.includes(m.name));

  if (models.length === 0) {
    // If we excluded everything, fallback
    return { provider: "Groq", name: "llama-3.3-70b-versatile", api_url: "https://api.groq.com/openai/v1/chat/completions", agent_type: taskType };
  }

  // Filter by task type if possible, otherwise look at all
  const taskModels = models.filter(m => m.agent_type === taskType || m.agent_type === "general");
  const pool = taskModels.length > 0 ? taskModels : models;

  // Scoring logic for distribution and speed
  const scoredModels = pool.map(m => {
    const name = (m.name || "").toLowerCase();
    const provider = (m.provider || "").toLowerCase();
    let score = 0;

    // Prioritize Free models as requested, but skip the extreme boost if we are in a fallback/retry loop
    if ((name.includes(":free") || name.includes("free") || name.includes("mistral") || name.includes("llama")) && excludeIds.length === 0) {
      score += 2000;
    } else if (name.includes(":free") || name.includes("free")) {
      score -= 500; // Penalize certain free models during deep retries, though we still want to try them if they are fast
    }

    // Provider distribution & speed preference
    if (provider.includes("groq")) score += 1500; // Fastest
    if (provider.includes("gemini")) score += 1200; // Very reliable & fast
    if (provider.includes("openrouter")) score += 1000; // Good variety
    if (provider.includes("comet")) score += 800; // Good for logic/vision
    if (provider.includes("hugging")) score += 500; // Good but can be slower

    // Task-specific boosts
    if (taskType === "coding" && (name.includes("coder") || name.includes("r1") || name.includes("qwen") || name.includes("claude"))) score += 500;
    if (taskType === "vision" && (name.includes("vision") || name.includes("vl") || name.includes("pixtral"))) score += 500;
    if (taskType === "voice" && (name.includes("tts") || name.includes("voice") || name.includes("speech"))) score += 500;

    // Likes boost
    score += (m.likes || 0) / 10;
    
    // Add small random noise to ensure we cycle through equivalently scored models evenly instead of always hitting the exact same bad one
    score += Math.random() * 50;

    return { ...m, score };
  });

  // Sort by score descending
  const sorted = scoredModels.sort((a, b) => b.score - a.score);

  // Return the best one
  return sorted[0];
};

export const markModelAsInactive = async (modelName: string) => {
  const client = getSupabase();
  console.log(`Marking model ${modelName} as inactive due to failure.`);
  await client
    .from("ai_models")
    .update({ is_active: false })
    .eq("name", modelName);
};

export const callAiModel = async (model: any, prompt: string, systemPrompt: string = "", isJson: boolean = false, excludeIds: string[] = [], retries = 15): Promise<string> => {
  const providerName = (model.provider || "").toLowerCase();
  
  let apiKey = "";
  if (providerName.includes("groq")) apiKey = GROQ_API_KEY;
  else if (providerName.includes("openrouter")) apiKey = OPENROUTER_API_KEY;
  else if (providerName.includes("hugging")) apiKey = HUGGINGFACE_API_KEY;
  else if (providerName.includes("comet")) apiKey = COMET_API_KEY;
  else if (providerName.includes("gemini") || providerName.includes("google")) apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || "";
  else if (providerName.includes("puter")) apiKey = PUTER_API_KEY;
  else if (providerName.includes("anthropic")) apiKey = process.env.ANTHROPIC_API_KEY || "";
  else if (providerName.includes("stability")) apiKey = OPENROUTER_API_KEY; // Fallback for stability if routed through openrouter
  else apiKey = OPENROUTER_API_KEY; // Default fallback

  let apiUrl = model.api_url || "https://api.groq.com/openai/v1/chat/completions";
  
  // Handle Gemini specific URL and key
  const isGemini = providerName.includes("gemini") || providerName.includes("google");
  if (isGemini && !apiUrl.includes("key=")) {
    apiUrl = `${apiUrl}?key=${apiKey}`;
  }
  
  try {
    let payload: any = {
      model: model.name,
      messages: [
        ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
        { role: "user", content: prompt }
      ],
      ...(isJson ? { response_format: { type: "json_object" } } : {})
    };

    // Handle Gemini specific payload
    if (isGemini) {
      payload = {
        contents: [
          ...(systemPrompt ? [{ role: "user", parts: [{ text: `System Instruction: ${systemPrompt}` }] }] : []),
          { role: "user", parts: [{ text: prompt }] }
        ]
      };
    }

    const response = await axios.post(
      apiUrl,
      payload,
      {
        headers: { 
          ...(!isGemini ? { Authorization: `Bearer ${apiKey}` } : {}),
          "Content-Type": "application/json"
        },
        timeout: 10000,
      }
    );
    
    // Handle different response formats from various providers
    let content = "";
    if (isGemini) {
      content = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      content = response.data.choices?.[0]?.message?.content || "";
    }

    if (!content && retries > 0) {
      throw new Error("Empty response from model");
    }

    // Global Hallucination Detection (Pure numeric/score noise)
    const isNoise = /^[0-9.\-eE+\s]{5,}$/.test(content.trim()) || (content.length < 50 && (content.match(/\d/g) || []).length / content.length > 0.9);
    if (isNoise && retries > 0) {
       console.warn(`Model ${model.name} hallucinated numeric noise. Marking inactive and retrying...`);
       markModelAsInactive(model.name).catch(console.error);
       const nextModel = await getBestModelForTask(model.agent_type || "general", [...excludeIds, model.name]);
       return callAiModel(nextModel, prompt, systemPrompt, isJson, [...excludeIds, model.name], retries - 1);
    }

    return content;
  } catch (error: any) {
    const errorMsg = error.response?.data?.error?.message || error.message;
    console.error(`Model ${model.name} failed:`, errorMsg);
    
    // Auto mark offline or bad-request models as inactive to prevent recurring failures
    const status = error.response?.status;
    if (status === 400 || status === 404) {
      markModelAsInactive(model.name).catch(console.error);
    }
    
    if (retries > 0) {
      console.log(`Retrying with a different model... (${retries} left)`);
      const nextModel = await getBestModelForTask(model.agent_type || "general", [...excludeIds, model.name]);
      return callAiModel(nextModel, prompt, systemPrompt, isJson, [...excludeIds, model.name], retries - 1);
    }
    
    throw new Error("All available models failed to respond. Please try again later.");
  }
};

export const generateChatResponse = async (prompt: string, taskType: string = "general") => {
  const bestModel = await getBestModelForTask(taskType);
  return await callAiModel(bestModel, prompt);
};

export const generateStrategy = async (idea: string) => {
  const bestModel = await getBestModelForTask("market");
  const systemPrompt = `You are a world-class brand strategist and creative director. 
          Your goal is to transform a simple idea into a professional, poetic, and highly marketable brand identity.
          
          Return a JSON object with EXACTLY these keys:
          - 'name': A creative, memorable brand name in English.
          - 'slogan': A powerful, poetic, and professional slogan in English.
          - 'marketingSteps': An array of 5 strategic, professional steps to launch and scale this brand (in English).
          - 'targetAudience': A detailed description of the ideal customer persona (in English).
          - 'brandVoice': A description of the brand's tone (e.g., "Sophisticated & Minimalist" or "Energetic & Bold").
          - 'poetry': A short, 4-line poetic manifesto or brand essence statement in English.
          - 'clarifyingQuestions': An array of 3 insightful questions to ask the user to better understand their vision and refine the strategy.
          - 'alternativeStrategies': An array of 2 alternative strategic angles or positioning options for the brand.
          
          IMPORTANT: 
          1. ALL output MUST be in high-quality, professional English.
          2. Even if the user input is in Arabic, you MUST translate the concept and respond in English.
          3. Ensure the tone is premium and visionary.`;
  const prompt = `Create a comprehensive, professional brand strategy for this idea: ${idea}`;
  const res = await callAiModel(bestModel, prompt, systemPrompt, true);
  return typeof res === 'string' ? JSON.parse(res) : res;
};

export const generateContent = async (topic: string, tone: string) => {
  const bestModel = await getBestModelForTask("content");
  const systemPrompt = `You are an expert content generator and copywriter. Your goal is to write high-quality, engaging content based on the provided topic and tone. Output in English.`;
  const prompt = `Topic: ${topic}\nTone: ${tone}\nWrite a comprehensive piece of content.`;
  return await callAiModel(bestModel, prompt, systemPrompt);
};

export const optimizeSEO = async (content: string, keywords: string[]) => {
  const bestModel = await getBestModelForTask("seo");
  const systemPrompt = `You are an elite SEO specialist. Analyze the provided content and keywords, and return a JSON object with:
          - 'optimizedTitle': An SEO-optimized title.
          - 'metaDescription': A compelling meta description (under 160 characters).
          - 'keywordSuggestions': An array of 5 additional LSI or long-tail keywords.
          - 'contentImprovements': An array of 3 specific suggestions to improve the content's SEO ranking.`;
  const prompt = `Content: ${content}\nTarget Keywords: ${keywords.join(", ")}`;
  const res = await callAiModel(bestModel, prompt, systemPrompt, true);
  return typeof res === 'string' ? JSON.parse(res) : res;
};

export const analyzeMarket = async (industry: string, region: string) => {
  const bestModel = await getBestModelForTask("market");
  const systemPrompt = `You are a top-tier market research analyst. Provide a comprehensive market analysis for the specified industry and region.
          Return a JSON object with:
          - 'marketSize': Estimated market size and growth rate.
          - 'keyCompetitors': An array of 3-5 major competitors.
          - 'trends': An array of 3 current industry trends.
          - 'opportunities': An array of 2 untapped opportunities or gaps in the market.
          - 'threats': An array of 2 potential risks or challenges.`;
  const prompt = `Industry: ${industry}\nRegion: ${region}`;
  const res = await callAiModel(bestModel, prompt, systemPrompt, true);
  return typeof res === 'string' ? JSON.parse(res) : res;
};

export const generateLogo = async (name: string, idea: string) => {
  const bestModel = await getBestModelForTask("vision");
  
  if (bestModel.provider === "CometAPI") {
    try {
      const response = await axios.post(
        "https://api.cometapi.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: `A ultra-premium, minimalist, and unique professional logo for a company named '${name}'. Concept: ${idea}. The design should be iconic, modern, and high-end. Use a clean white background. The logo MUST clearly feature the text '${name}' in a sophisticated, bespoke English font. Vector style, corporate identity, 4k resolution.`,
          n: 1,
          size: "1024x1024"
        },
        {
          headers: { 
            "Authorization": `Bearer ${COMET_API_KEY}`,
            "Content-Type": "application/json"
          },
          timeout: 30000,
        }
      );
      return response.data.data[0].url;
    } catch (error) {
      console.log("CometAPI failed, falling back to Pollinations...");
    }
  }
  
  const prompt = `A ultra-premium, minimalist, professional abstract logo for a company named '${name}'. Concept: ${idea}. Clean white background, vector style, modern corporate identity. NO TEXT. High-end aesthetic.`;
  const seed = Math.floor(Math.random() * 1000000);
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&model=flux&seed=${seed}`;
};

export const analyzeSentiment = async (idea: string) => {
  const bestModel = await getBestModelForTask("market");
  const systemPrompt = `Analyze the sentiment of the following idea. Return a JSON object with 'label' (positive, neutral, negative) and 'score' (0 to 1).`;
  const res = await callAiModel(bestModel, idea, systemPrompt, true);
  return typeof res === 'string' ? JSON.parse(res) : res;
};

export const generateProject = async (prompt: string, type: "json" | "html" = "json") => {
  const bestModel = await getBestModelForTask("coding");
  const htmlSystemPrompt = `You are a Senior Full-Stack Engineer and System Architect. 
  Your goal is to build a COMPLETE, HIGH-FIDELITY, and FULLY FUNCTIONAL web application in a single file.
  
  CORE ARCHITECTURAL DIRECTIVES:
  1. FUNCTIONALITY IS KING: Do NOT just build a static UI. You MUST implement real JavaScript logic. 
     - If the user asks for a camera app, use 'navigator.mediaDevices.getUserMedia' to actually open the camera.
     - If they ask for a to-do list, use 'localStorage' to save and load items.
     - If they ask for a calculator, implement the math logic.
  2. NO PLACEHOLDERS: NEVER include "YOUR_API_KEY" or empty strings. Use mock data generators or public free APIs if absolutely necessary.
  3. ENGLISH ONLY: The generated application UI, content, and code comments MUST be in English only.
  4. PREMIUM DESIGN: Use Tailwind CSS via CDN. Use modern UI/UX principles (glassmorphism, shadows, rounded corners).
  5. SINGLE FILE OUTPUT: Combine all HTML, Tailwind CSS classes, and complex JavaScript logic into ONE single valid HTML file.
  
  OUTPUT FORMAT:
  - Return ONLY the raw HTML code.
  - NO markdown formatting. NO \`\`\`html tags.
  - Start directly with <!DOCTYPE html>.`;

  const jsonSystemPrompt = `You are a System Architect. 
  Return a JSON object representing the structure and functional requirements of a web application.
  The JSON should have:
  - 'title': App name in English.
  - 'description': App purpose in English.
  - 'features': Array of detected functional modules (e.g., ["Chatbot", "Movie API", "Auth System"]).
  - 'sections': Array of objects with 'title', 'content', 'type', and 'logic' (any specific JS logic needed for this section).
  - 'theme': Colors, fonts, and spacing.
  - 'dependencies': Array of required CDN links or libraries.
  
  IMPORTANT: ALL content MUST be in English. Do not include any markdown formatting.`;

  const systemPrompt = type === "html" ? htmlSystemPrompt : jsonSystemPrompt;

  const content = await callAiModel(bestModel, prompt, systemPrompt, type === "json");
  
  let cleanedContent = typeof content === 'string' ? content.trim() : JSON.stringify(content);
  if (cleanedContent.includes("```")) {
    const matches = cleanedContent.match(/```(?:html|json)?\n?([\s\S]*?)\n?```/);
    if (matches && matches[1]) {
      cleanedContent = matches[1].trim();
    } else {
      cleanedContent = cleanedContent.replace(/```(?:html|json)?/g, "").replace(/```/g, "").trim();
    }
  }

  if (type === "json") {
    try {
      return JSON.parse(cleanedContent);
    } catch (e) {
      console.error("Failed to parse JSON project structure:", cleanedContent);
      try {
        const fixedContent = cleanedContent.substring(cleanedContent.indexOf('{'), cleanedContent.lastIndexOf('}') + 1);
        return JSON.parse(fixedContent);
      } catch (e2) {
        return { error: "Invalid JSON structure generated" };
      }
    }
  } else {
    // Run the code through the QA Agent before returning
    return await validateAndFixCode(cleanedContent);
  }
};

export const validateAndFixCode = async (code: string) => {
  console.log("Running QA Agent to validate and fix code...");
  const bestModel = await getBestModelForTask("security");
  const systemPrompt = `You are a Senior QA Engineer and Code Reviewer. 
            Review the provided code. 
            1. Fix any syntax errors, bugs, or broken logic.
            2. Ensure best practices and proper error handling.
            3. Return ONLY the fully fixed and working raw code. NO markdown, NO explanations.
            If the code is HTML, start with <!DOCTYPE html>. Otherwise, just return the raw code.`;
  
  try {
    let fixedCode = await callAiModel(bestModel, code, systemPrompt);
    fixedCode = fixedCode.trim();
    if (fixedCode.includes("```")) {
      const matches = fixedCode.match(/```[a-z]*\n?([\s\S]*?)\n?```/);
      if (matches && matches[1]) fixedCode = matches[1].trim();
      else fixedCode = fixedCode.replace(/```[a-z]*/g, "").replace(/```/g, "").trim();
    }
    return fixedCode;
  } catch (error) {
    console.error("QA Agent failed, returning original code.", error);
    return code; // Fallback to original if QA fails
  }
};

export const analyzeSecurity = async (code: string) => {
  console.log("Running Security Agent to analyze code...");
  const bestModel = await getBestModelForTask("security");
  const systemPrompt = `You are a Senior Security Auditor and Penetration Tester.
            Review the provided code for security vulnerabilities.
            Return a JSON object with:
            - 'score': A security score from 0 to 100.
            - 'vulnerabilities': An array of objects with 'severity' (High, Medium, Low), 'title', and 'description'.
            - 'recommendations': An array of 3 specific actionable steps to secure the code.
            IMPORTANT: Output MUST be valid JSON only.`;
  
  try {
    const res = await callAiModel(bestModel, code, systemPrompt, true);
    return typeof res === 'string' ? JSON.parse(res) : res;
  } catch (error) {
    console.error("Security Agent failed.", error);
    throw new Error("Failed to analyze security");
  }
};

export const generateMultiFileProject = async (prompt: string) => {
  const bestModel = await getBestModelForTask("coding");
  const systemPrompt = `You are a Senior Software Architect and Full-Stack Engineer.
  Your goal is to build a COMPLETE, FULLY FUNCTIONAL multi-file project based on the user's idea.
  
  CORE DIRECTIVES:
  1. Choose the BEST tech stack for the idea (e.g., React+Vite, Node.js+Express, Python+Flask, HTML/JS/CSS).
  2. Implement REAL logic. Do not just build a UI.
  3. Return a JSON object representing the entire file structure.
  
  CAPABILITIES & PERMISSIONS:
  You have full access to use and integrate the following capabilities if the project requires them:
  - Media & Communication: Camera, Microphone, Photos, Contacts, Call Logs, Phone.
  - Location & Motion: GPS Location, Physical Activity, Body Sensors, Bluetooth.
  - Notifications & Display: Push Notifications, Display over other apps, System Settings.
  - System & Privacy: Storage/Files, Usage Data, Calendar, SMS, Biometrics.
  - Motion & Animation: 2D/3D Animation, Physics-based Motion, Parallax, Transitions.
  - Graphics & Visuals: WebGL, Canvas, 3D Rendering, UI/UX Elements.
  - Visual Effects (VFX): Filters, Particle Effects, Blending, Distortion, Bloom/Glow.
  - Media Handling: Image/Video/Audio Processing.
  
  Ensure you include the necessary libraries (e.g., Three.js, Framer Motion, WebRTC) in package.json and request appropriate browser/device permissions in your code.
  
  OUTPUT FORMAT:
  You MUST return ONLY a valid JSON object with the following structure:
  {
    "tech_stack": "Name of tech stack (e.g., React + Vite)",
    "files": [
      {
        "path": "package.json",
        "content": "..."
      },
      {
        "path": "src/App.jsx",
        "content": "..."
      }
    ]
  }
  
  Ensure the JSON is valid, properly escaped, and contains no markdown outside the JSON structure.`;

  try {
    const res = await callAiModel(bestModel, prompt, systemPrompt, true);
    return typeof res === 'string' ? JSON.parse(res) : res;
  } catch (error) {
    console.error("Failed to generate multi-file project:", error);
    throw error;
  }
};

export const generateMusic = async (prompt: string): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);
    
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/musicgen-small",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer",
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);
    
    // We get audio payload (usually FLAC)
    const base64 = Buffer.from(response.data).toString("base64");
    return `data:audio/flac;base64,${base64}`;
  } catch (error: any) {
    console.error("Music generation failed:", error.message);
    // Fallback to static audio
    return "https://actions.google.com/sounds/v1/science_fiction/sci_fi_computer_processing_2.ogg";
  }
};

const addWavHeader = (pcmData: Buffer, sampleRate: number) => {
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // Type: PCM
  header.writeUInt16LE(1, 22); // Channels: Mono
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28); // Byte rate
  header.writeUInt16LE(2, 32); // Block align
  header.writeUInt16LE(16, 34); // Bits per sample
  header.write('data', 36);
  header.writeUInt32LE(pcmData.length, 40);

  return Buffer.concat([header, pcmData]);
};

export const generateVoice = async (text: string, voice: string = "Kore", style: string = "cheerful"): Promise<string> => {
  try {
    const bestModel = await getBestModelForTask("voice");
    const isGemini = bestModel.provider.toLowerCase().includes("gemini");
    const isHF = bestModel.provider.toLowerCase().includes("hugging");

    // 1. Refine text
    const refinementPrompt = `
      Refine the following text to be more professional, engaging, and suitable for a ${style} voiceover. 
      Keep it concise and clear. 
      If the text is in Arabic, keep it in Arabic.
      Text: "${text}"
      Return ONLY the refined text.
    `;
    const refinedText = await generateChatResponse(refinementPrompt, 'general');

    if (isGemini) {
      // 2. Map style to instruction
      const styleInstructions: Record<string, string> = {
        cheerful: "Say cheerfully",
        horror: "Say in a scary, whispering horror tone",
        deep: "Say in a very deep, authoritative voice",
        singing: "Sing this text like a professional singer",
        whisper: "Whisper this text very quietly and softly",
        news: "Say this text in a formal breaking news anchor voice",
        asmr: "Say this in an ASMR style with close microphone effect and soft breathy tone",
        sad: "Say this text in a very sad, emotional, and crying tone",
        professional: "Say this text in a clear, professional, and corporate voice"
      };
      const styleInstruction = styleInstructions[style] || styleInstructions.cheerful;

      // 3. Generate audio using Gemini SDK
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await (ai as any).models.generateContent({
        model: bestModel.name || "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `${styleInstruction}: ${refinedText}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const pcmBuffer = Buffer.from(base64Audio, 'base64');
        const wavBuffer = addWavHeader(pcmBuffer, 24000);
        return `data:audio/wav;base64,${wavBuffer.toString('base64')}`;
      }
    } else if (isHF) {
      const response = await axios.post(
        bestModel.api_url || `https://router.huggingface.co/hf-inference/models/${bestModel.name}`,
        { inputs: refinedText },
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json"
          },
          responseType: "arraybuffer",
          timeout: 25000
        }
      );
      const base64 = Buffer.from(response.data).toString("base64");
      return `data:audio/wav;base64,${base64}`;
    }

    throw new Error("No compatible voice model found or audio generation failed");
  } catch (error: any) {
    console.error("Voice generation failed:", error.message);
    // Fallback to static audio
    return "https://actions.google.com/sounds/v1/science_fiction/sci_fi_computer_processing_2.ogg";
  }
};

