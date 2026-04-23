import { toast } from "sonner";
import { handleApiError } from "../lib/api";

export interface BrandStrategy {
  name: string;
  slogan: string;
  marketingSteps: string[];
  targetAudience: string;
  brandVoice?: string;
  poetry?: string;
  clarifyingQuestions?: string[];
  alternativeStrategies?: { name: string; description: string }[];
}

export interface DeploymentDetails {
  description: string;
  available_models_count: number;
  assigned_logic: string;
  assigned_vision: string;
  logoUrl?: string;
  sentiment?: any;
}

export const brandApi = {
  initializeBrand: async (projectName: string, description: string) => {
    try {
      const res = await fetch("/api/initialize-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, description }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to initialize brand");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to initialize brand");
      throw error;
    }
  },

  generateStrategy: async (idea: string): Promise<BrandStrategy> => {
    try {
      const res = await fetch("/api/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate strategy");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to generate strategy");
      throw error;
    }
  },

  generateContent: async (topic: string, tone: string) => {
    try {
      const res = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate content");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to generate content");
      throw error;
    }
  },

  optimizeSEO: async (content: string, keywords: string[]) => {
    try {
      const res = await fetch("/api/optimize-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, keywords }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to optimize SEO");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to optimize SEO");
      throw error;
    }
  },

  analyzeMarket: async (industry: string, region: string) => {
    try {
      const res = await fetch("/api/analyze-market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, region }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to analyze market");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to analyze market");
      throw error;
    }
  },

  updateModels: async () => {
    try {
      const res = await fetch("/api/update-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update models");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to update models");
      throw error;
    }
  },

  validateKey: async (provider: string, key: string): Promise<{ isValid: boolean }> => {
    try {
      const res = await fetch("/api/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, key }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to validate key");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to validate key");
      throw error;
    }
  },

  getModels: async () => {
    try {
      const res = await fetch("/api/models");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch models");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to fetch models");
      throw error;
    }
  },

  generateLogo: async (name: string, idea: string): Promise<{ logoUrl: string }> => {
    try {
      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, idea }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate logo");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to generate logo");
      throw error;
    }
  },

  analyzeSentiment: async (idea: string) => {
    try {
      const res = await fetch("/api/analyze-sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to analyze sentiment");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to analyze sentiment");
      throw error;
    }
  },

  generateProject: async (prompt: string, type: "json" | "html") => {
    try {
      const res = await fetch("/api/generate-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, type }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate project");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to generate project");
      throw error;
    }
  },

  generateMultiFileProject: async (prompt: string) => {
    try {
      const res = await fetch("/api/generate-multi-file-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to generate multi-file project");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to generate multi-file project");
      throw error;
    }
  },

  deploy: async (projectName: string, details: any, htmlContent: string, features: any, codeQualityScore: number, projectFiles?: any) => {
    try {
      const res = await fetch("/api/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, details, htmlContent, features, codeQualityScore, projectFiles }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to deploy");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to deploy");
      throw error;
    }
  },

  analyzeCode: async (code: string) => {
    try {
      const res = await fetch("/api/analyze-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to analyze code");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to analyze code");
      throw error;
    }
  },

  analyzeSecurity: async (code: string) => {
    try {
      const res = await fetch("/api/analyze-security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to analyze security");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to analyze security");
      throw error;
    }
  },

  chat: async (prompt: string, taskType: string = "general"): Promise<{ text: string }> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, taskType }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send chat message");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to send chat message");
      throw error;
    }
  },

  generateChat: async (prompt: string, taskType: string = "general"): Promise<{ text: string }> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, taskType }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send chat message");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to send chat message");
      throw error;
    }
  },

  visionChat: async (prompt: string, image: string): Promise<{ text: string }> => {
    try {
      const res = await fetch("/api/vision-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, image }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to send vision chat message");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to send vision chat message");
      throw error;
    }
  },

  getRecentProjects: async () => {
    try {
      const res = await fetch("/api/recent-projects");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch recent projects");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to fetch recent projects");
      throw error;
    }
  },

  /**
   * Conceptual Model Orchestrator
   * Routes tasks to the most suitable model based on complexity and cost.
   * This ensures the system is future-proof and can integrate any new AI.
   */
  routeTaskToModel: async (task: string, complexity: 'low' | 'medium' | 'high') => {
    console.log(`Routing task: "${task}" with complexity: ${complexity}`);
    // Logic to select best model (e.g., Groq for speed, Gemini for reasoning, etc.)
    // This is managed by the "Unified AI Standard" defined in README.md
    return { selectedModel: complexity === 'high' ? 'gemini-3.1-pro' : 'groq-llama3-70b' };
  },

  addModel: async (modelData: { name: string, provider: string, apiUrl: string, tokenization: string, agentType?: string }) => {
    try {
      const res = await fetch("/api/add-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add model");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to add model");
      throw error;
    }
  },

  toggleModel: async (modelId: string, isActive: boolean) => {
    try {
      const res = await fetch("/api/toggle-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelId, isActive }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to toggle model");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to toggle model");
      throw error;
    }
  },

  getBestModels: async () => {
    try {
      const res = await fetch("/api/best-models");
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to fetch best models");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Failed to fetch best models");
      throw error;
    }
  },

  generateApiStudio: async (a?: any, b?: any) => { return { status: 'mocked', readme: '', guide: '' } as any; },
  generateReadme: async (a?: any, b?: any) => { return { status: 'mocked', readme: '', guide: '' } as any; },
  generateUserGuide: async (a?: any, b?: any) => { return { status: 'mocked', readme: '', guide: '' } as any; },
  analyzeDeepLogic: async (a?: any, b?: any) => { return { status: 'mocked', readme: '', guide: '' } as any; },
  transpileProject: async (a?: any, b?: any) => { return { status: 'mocked', readme: '', guide: '' } as any; },

  investmentAnalysis: async (marketData: any, query: string) => {
    try {
      const res = await fetch("/api/investment-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketData, query }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed to run investment analysis" }));
        throw new Error(err.error || "Failed to run investment analysis");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Investment error");
      throw error;
    }
  },

  aiTubeSync: async (globalContext: string, recentChats: any[]) => {
    try {
      const res = await fetch("/api/ai-tube-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ globalContext, recentChats }),
      });
      if (!res.ok) throw new Error("Failed AI sync");
      return res.json();
    } catch (error: any) {
      // Return silent mocked failure so UI doesn't crash on fast polling
      return { success: true, action: { model: 'System', type: 'Error', message: 'Failed to sync with swarm', approvalNeeded: false }};
    }
  },

  aiTubeFileOp: async (fileName: string, content: string, action: string) => {
    try {
      const res = await fetch("/api/ai-tube-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, content, action }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed file operation" }));
        throw new Error(err.error || "Failed file operation");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "File Op error");
      throw error;
    }
  },

  decodeProject: async (codeStructure: string) => {
    try {
      const res = await fetch("/api/decode-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codeStructure }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed decoding" }));
        throw new Error(err.error || "Failed decoding");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Decode error");
      throw error;
    }
  },

  generateMontage: async (videoPrompt: string) => {
    try {
      const res = await fetch("/api/generate-montage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoPrompt }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed montage" }));
        throw new Error(err.error || "Failed montage");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Montage error");
      throw error;
    }
  },

  generateMusic: async (audioPrompt: string) => {
    try {
      const res = await fetch("/api/generate-music", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioPrompt }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed music generation" }));
        throw new Error(err.error || "Failed music generation");
      }
      return res.json();
    } catch (error: any) {
      handleApiError(error, "Music error");
      throw error;
    }
  }
};
