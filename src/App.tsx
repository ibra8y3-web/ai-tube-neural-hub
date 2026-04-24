import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI } from "@google/genai";
import { 
  Rocket, 
  Cpu, 
  Palette, 
  Code, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Loader2, 
  Globe,
  Zap,
  TrendingUp,
  Brain,
  Activity,
  ShieldCheck,
  RefreshCw,
  Layout,
  Eye,
  Send,
  Bot,
  User,
  Sparkles,
  ChevronRight,
  Download,
  AlertCircle,
  Menu,
  X,
  Settings,
  Database,
  Layers,
  Component,
  Wrench,
  UploadCloud,
  Terminal,
  Smartphone,
  HardDrive,
  TerminalSquare,
  Search,
  Plus,
  Trash2,
  Play,
  Square,
  Terminal as TerminalIcon,
  Mail,
  Image as ImageIcon,
  Mic,
  Volume2,
  Music,
  ExternalLink,
  Wand2,
  Video,
  Box,
  GraduationCap,
  Gamepad2,
  Beaker,
  Wifi,
  Glasses,
  Link as LinkIcon,
  BookOpen,
  Link2,
  Server,
  Shield,
  Network,
  DollarSign,
  HeartPulse,
  Leaf,
  FileCode,
  ListChecks,
  Utensils,
  Gift,
  GitBranch,
  MapPin
} from "lucide-react";
import { Toaster, toast } from "sonner";
import { Drawer } from "vaul";
import { useWindowSize } from "react-use";
import { brandApi } from "./api/brandApi";
import { cn } from "@/src/lib/utils";
import { WelcomeTable } from "./components/features/WelcomeTable";
import { DatabaseExplorer } from "./components/features/DatabaseExplorer";
import { UniversalModels } from "./components/features/UniversalModels";
import { ContentLab } from "./components/features/ContentLab";
import { SmartTools } from "./components/features/SmartTools";
import { RecentProjects } from "./components/features/RecentProjects";
import { VisionLab } from "./components/features/VisionLab";
import { GlobalIntelligence } from "./components/features/GlobalIntelligence";
import { VoiceStudio } from "./components/features/VoiceStudio";
import { ProjectTranspiler } from "./components/features/ProjectTranspiler";
import { LogicReverseLab } from "./components/features/LogicReverseLab";
import { SmartTerminal } from "./components/features/SmartTerminal";
import { SDKGenerator } from "./components/features/SDKGenerator";
import { SecretManager } from "./components/features/SecretManager";
import { 
  ProjectDecoder, 
  VideoLab, 
  AdvancedPreviewDashboard, 
  MemoryEngine, 
  TeamSystem 
} from "./components/features/NewSettingsViews";
import { 
  SmartChat, 
  LogoGeneratorLab, 
  RepairLab, 
  AutomationTasks, 
  PluginManager 
} from "./components/features/AdvancedLabs";
import { NeuroUXAuditor, ArchitectureBlueprint, PersonaEngine, DevOpsCatalyst, LegalAIAssistant } from "./components/features/CreativeLabs";
import { ThreeDLab, DataScienceLab, AcademyLab } from "./components/features/NewLabs";
import { GameEngineLab, BlockchainLab, HardwareLab, SatelliteLab, QuantumLab, BioTechLab, FinTechVault, RoboticsLab, IoTHubLab, ARVRFactoryLab } from "./components/features/ExtremeLabs";
import { InboxBrowser } from "./components/ui/InboxBrowser";
import { DataSingularity, SwarmLab, OmniBridge, MarketTrends, APIArchitect, RegexMaster, LogAnalyzer, CSSPlayground, GitSuggest, LifePlanner, RecipeAlchemist, GiftFinder, StoryWeaver, TravelBuddy } from "./components/tubes/NewTubes";
import { TelegramGateway } from "./components/features/TelegramGateway";

interface BrandStrategy {
  name: string;
  slogan: string;
  marketingSteps: string[];
  targetAudience: string;
  brandVoice?: string;
  poetry?: string;
  clarifyingQuestions?: string[];
  alternativeStrategies?: { name: string; description: string }[];
}

const translations = {
  en: {
    title: "OMNIVERSE",
    entity: "AETHER CORE",
    subtitle: "The self-evolving factory that transforms a single sentence into a fully operational business entity.",
    placeholder: "Describe your brand idea (e.g., Smart clothing that changes color with weather)",
    launch: "LAUNCH FACTORY",
    manufacturing: "MANUFACTURING...",
    roadmap: "Marketing Roadmap",
    essence: "Brand Essence",
    voice: "Brand Voice",
    manifesto: "Manifesto",
    sentiment: "Market Sentiment Analysis",
    support: "Agent Support",
    online: "Online & Trained",
    chatPlaceholder: "Try talking to the assistant...",
    preview: "Live Preview",
    download: "Download (ZIP)",
    agents: "Assigned AI Agents",
    target: "Target",
    live: "Live on Supabase",
    security: "Security & Compliance",
    footer: "OmniVerse Aether Core - Powered by Groq & CometAPI",
    chatError: "Sorry, I'm having trouble connecting right now. Please try again later.",
    chatIntro: "Hello! I am the AI assistant for",
    chatIntro2: ". I've been trained on your brand identity. How can I help your customers today?"
  },
  ar: {
    title: "أومني فيرس",
    entity: "أثير كور",
    subtitle: "المصنع ذاتي التطور الذي يحول جملة واحدة إلى كيان تجاري كامل التشغيل.",
    placeholder: "صف فكرة علامتك التجارية (مثلاً: ملابس ذكية يتغير لونها مع الطقس)",
    launch: "إطلاق المصنع",
    manufacturing: "جاري التصنيع...",
    roadmap: "خارطة الطريق التسويقية",
    essence: "جوهر العلامة",
    voice: "صوت العلامة",
    manifesto: "البيان (Manifesto)",
    sentiment: "تحليل مشاعر السوق",
    support: "دعم الوكيل",
    online: "متصل ومدرب",
    chatPlaceholder: "جرب التحدث مع المساعد...",
    preview: "معاينة مباشرة",
    download: "تحميل (ZIP)",
    agents: "وكلاء الذكاء المعينين",
    target: "الهدف",
    live: "مباشر على Supabase",
    security: "الأمن والامتثال",
    footer: "أومني فيرس أثير كور - مدعوم بواسطة Groq و CometAPI",
    chatError: "عذراً، أواجه مشكلة في الاتصال حالياً. يرجى المحاولة لاحقاً.",
    chatIntro: "مرحباً! أنا مساعد الذكاء الاصطناعي لعلامة",
    chatIntro2: ". لقد تم تدريبي على هوية علامتك التجارية. كيف يمكنني مساعدة عملائك اليوم؟"
  }
};

interface SentimentData {
  labels: string[];
  scores: number[];
}

type AgentStatus = "idle" | "working" | "completed" | "error";

const AppRenderer = ({ structure }: { structure: any }) => {
  if (!structure) return null;
  return (
    <div className="p-8" style={{ color: structure.theme?.colors?.text || 'white', backgroundColor: structure.theme?.colors?.background || 'black', fontFamily: structure.theme?.fonts?.body || 'sans-serif' }}>
      <h1 className="text-4xl font-bold mb-4">{structure.title}</h1>
      <p className="text-lg mb-8">{structure.description}</p>
      {structure.sections?.map((section: any, index: number) => (
        <section key={index} className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </div>
  );
};

export default function App() {
  const [idea, setIdea] = useState("");
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [isBuilding, setIsBuilding] = useState(false);
  const [projectType, setProjectType] = useState<'single' | 'multi'>('single');
  const [currentStep, setCurrentStep] = useState(0);
  
  useEffect(() => {
    // Background sync of models on app load
    const syncModels = async () => {
      try {
        await brandApi.updateModels();
        console.log("Models synced successfully in background.");
      } catch (error) {
        console.error("Background model sync failed:", error);
      }
    };
    syncModels();
  }, []);
  
  const [strategy, setStrategy] = useState<BrandStrategy | null>(null);
  const [appStructure, setAppStructure] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [sentiment, setSentiment] = useState<SentimentData | null>(null);
  const [deployed, setDeployed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [projectFiles, setProjectFiles] = useState<any[] | null>(null);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [assignedAgents, setAssignedAgents] = useState<{logic?: any, vision?: any} | null>(null);

  const [chatMessages, setChatMessages] = useState<{role: 'user'|'agent', content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('inbox');
  const [activeSettingsCategory, setActiveSettingsCategory] = useState<string>('core');

  const settingsCategories = [
    { id: 'core', label: lang === 'ar' ? 'النظام الأساسي' : 'Core System', icon: Settings },
    { id: 'creative', label: lang === 'ar' ? 'المختبرات الإبداعية' : 'Creative Labs', icon: Sparkles },
    { id: 'tubes', label: lang === 'ar' ? 'تيوبات الكفاءة' : 'Efficiency Tubes', icon: Zap },
    { id: 'engineering', label: lang === 'ar' ? 'الهندسة والتطوير' : 'Engineering & Dev', icon: Code },
    { id: 'advanced', label: lang === 'ar' ? 'تكنولوجيا متقدمة' : 'Advanced Tech', icon: Cpu },
  ];

  const categoryTabs: { [key: string]: any[] } = {
    core: [
      { id: 'inbox', icon: Mail, label: lang === 'ar' ? 'صندوق الوارد' : 'Inbox', badge: 'USER', badgeColor: 'bg-green-500 text-black' },
      { id: 'telegram', icon: Send, label: lang === 'ar' ? 'تيليجرام' : 'Telegram', badge: 'OMNI', badgeColor: 'bg-blue-500 text-white' },
      { id: 'agents', icon: Bot, label: lang === 'ar' ? 'الوكلاء' : 'Agents', badge: 'NEW', badgeColor: 'bg-orange-500 text-black' },
      { id: 'models', icon: Database, label: lang === 'ar' ? 'النماذج' : 'Models', badge: 'DEEP', badgeColor: 'bg-blue-500 text-white' },
      { id: 'search', icon: Search, label: lang === 'ar' ? 'الذكاء العالمي' : 'Global Intel', badge: 'LIVE', badgeColor: 'bg-blue-500 text-white' },
      { id: 'database', icon: Database, label: lang === 'ar' ? 'البيانات' : 'Database', badge: 'SQL', badgeColor: 'bg-purple-500 text-white' },
      { id: 'memory', icon: HardDrive, label: lang === 'ar' ? 'الذاكرة' : 'Memory' },
      { id: 'diagnostics', icon: Activity, label: lang === 'ar' ? 'التشخيص' : 'Diagnostics' },
      { id: 'security', icon: ShieldCheck, label: lang === 'ar' ? 'الأمان' : 'Security' },
      { id: 'capabilities', icon: ShieldCheck, label: lang === 'ar' ? 'الصلاحيات' : 'Capabilities' },
    ],
    creative: [
      { id: 'content', icon: Sparkles, label: lang === 'ar' ? 'المحتوى' : 'Content Lab' },
      { id: 'vision', icon: ImageIcon, label: lang === 'ar' ? 'الرؤية' : 'Vision Lab' },
      { id: 'voice', icon: Mic, label: lang === 'ar' ? 'الصوت' : 'Voice Studio' },
      { id: 'persona', icon: User, label: lang === 'ar' ? 'الشخصيات' : 'Personas' },
      { id: '3d', icon: Box, label: lang === 'ar' ? '3D' : '3D Models' },
      { id: 'logo_gen', icon: Palette, label: lang === 'ar' ? 'الشعارات' : 'Logo Gen' },
      { id: 'infinite_story', icon: BookOpen, label: lang === 'ar' ? 'القصص' : 'Story Engine' },
    ],
    tubes: [
      { id: 'data_singularity', icon: Database, label: lang === 'ar' ? 'ثقب البيانات' : 'Data Singularity', badge: 'SQL', badgeColor: 'bg-purple-500 text-white' },
      { id: 'swarm_lab', icon: Cpu, label: lang === 'ar' ? 'السرب الذكي' : 'Swarm AI', badge: 'MULTI', badgeColor: 'bg-orange-500 text-white' },
      { id: 'omni_bridge', icon: Code, label: lang === 'ar' ? 'ترجمة نيتف' : 'OmniBridge', badge: 'COMPILE', badgeColor: 'bg-cyan-500 text-black' },
      { id: 'market_trends', icon: TrendingUp, label: lang === 'ar' ? 'بوصلة السوق' : 'Market Trends', badge: 'LIVE', badgeColor: 'bg-emerald-500 text-white' },
      { id: 'api_architect', icon: FileCode, label: lang === 'ar' ? 'مهندس API' : 'API Architect', badge: 'DEV', badgeColor: 'bg-blue-600 text-white' },
      { id: 'regex_master', icon: Layers, label: lang === 'ar' ? 'خبير Regex' : 'Regex Master', badge: 'DEV', badgeColor: 'bg-orange-600 text-white' },
      { id: 'log_analyzer', icon: Activity, label: lang === 'ar' ? 'محلل سجلات' : 'Log Analyzer', badge: 'DEV', badgeColor: 'bg-red-600 text-white' },
      { id: 'css_playground', icon: Layout, label: lang === 'ar' ? 'محرر CSS' : 'CSS Forge', badge: 'DEV', badgeColor: 'bg-indigo-600 text-white' },
      { id: 'git_suggest', icon: GitBranch, label: lang === 'ar' ? 'مساعد Git' : 'Git Suggest', badge: 'DEV', badgeColor: 'bg-orange-500 text-black' },
      { id: 'life_planner', icon: ListChecks, label: lang === 'ar' ? 'مخطط حياة' : 'Life Planner', badge: 'USER', badgeColor: 'bg-pink-500 text-white' },
      { id: 'recipe_alchemist', icon: Utensils, label: lang === 'ar' ? 'خيميائي وصفات' : 'Recipes', badge: 'USER', badgeColor: 'bg-amber-500 text-black' },
      { id: 'gift_finder', icon: Gift, label: lang === 'ar' ? 'مستشار هدايا' : 'Gift Finder', badge: 'USER', badgeColor: 'bg-emerald-500 text-white' },
      { id: 'story_weaver', icon: BookOpen, label: lang === 'ar' ? 'ناسج قصص' : 'Story AI', badge: 'USER', badgeColor: 'bg-indigo-500 text-white' },
      { id: 'travel_buddy', icon: MapPin, label: lang === 'ar' ? 'رفيق سفر' : 'Travel Buddy', badge: 'USER', badgeColor: 'bg-sky-500 text-white' },
    ],
    engineering: [
      { id: 'code', icon: Code, label: lang === 'ar' ? 'محرر' : 'Editor' },
      { id: 'transpiler', icon: Component, label: lang === 'ar' ? 'المترجم' : 'Transpiler' },
      { id: 'logic', icon: Layers, label: lang === 'ar' ? 'المنطق' : 'Logic' },
      { id: 'sdk', icon: Code, label: lang === 'ar' ? 'SDK' : 'SDK Gen' },
      { id: 'devops', icon: Zap, label: lang === 'ar' ? 'ديف أوبس' : 'DevOps' },
      { id: 'terminal', icon: Terminal, label: lang === 'ar' ? 'تيرمينال' : 'Aether' },
      { id: 'automation', icon: Zap, label: lang === 'ar' ? 'الأتمتة' : 'Automation' },
      { id: 'project_decoder', icon: Layers, label: lang === 'ar' ? 'فك المشاريع' : 'Decoder' },
      { id: 'repair_lab', icon: Wrench, label: lang === 'ar' ? 'الإصلاح' : 'Repair' },
    ],
    advanced: [
      { id: 'game_engine', icon: Gamepad2, label: lang === 'ar' ? 'الألعاب' : 'Game' },
      { id: 'blockchain', icon: LinkIcon, label: lang === 'ar' ? 'بلوكشين' : 'Blockchain' },
      { id: 'hardware', icon: Cpu, label: lang === 'ar' ? 'هارديوير' : 'Hardware' },
      { id: 'satellite', icon: Globe, label: lang === 'ar' ? 'أقمار' : 'Satellite' },
      { id: 'quantum', icon: Zap, label: lang === 'ar' ? 'كمي' : 'Quantum' },
      { id: 'biotech', icon: Beaker, label: lang === 'ar' ? 'حيوي' : 'BioTech' },
      { id: 'fintech', icon: TrendingUp, label: lang === 'ar' ? 'مالي' : 'FinTech' },
      { id: 'robotics', icon: Settings, label: lang === 'ar' ? 'روبوتات' : 'Robotics' },
      { id: 'iot', icon: Wifi, label: lang === 'ar' ? 'IoT' : 'IoT Hub' },
      { id: 'ar_vr', icon: Glasses, label: lang === 'ar' ? 'VR/AR' : 'AR/VR' },
    ]
  };
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editorCode, setEditorCode] = useState("");
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);
  const [editorResult, setEditorResult] = useState<string | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<{id: number, type: 'info' | 'error' | 'success' | 'cmd', msg: string, time: string}[]>([
    { id: 1, type: 'info', msg: 'Aether Shell v2.5 initialized...', time: new Date().toLocaleTimeString() },
    { id: 2, type: 'success', msg: 'Remote connection established with device: Galaxy-S24-Ultra', time: new Date().toLocaleTimeString() }
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [isTerminalBusy, setIsTerminalBusy] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<string[]>(["python", "pip", "node", "npm"]);

  const handleTerminalCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setTerminalLogs(prev => [...prev, { id: Date.now(), type: 'cmd', msg: trimmedCmd, time: new Date().toLocaleTimeString() }]);
    setTerminalInput("");
    setIsTerminalBusy(true);

    try {
      const response = await brandApi.chat(`
        You are a high-level Aether OS Shell (v2.5) running on a Galaxy S24 Ultra. 
        You support ANY programming language (Python, Node.js, C++, Rust, etc.), package managers (pip, npm, pkg), and web connectivity.
        
        Current Session Context:
        - OS: Aether OS (Android-based Linux)
        - User: aether-shell
        - Device: Galaxy-S24-Ultra
        - Installed Packages: ${installedPackages.join(", ")}
        - History: ${terminalLogs.slice(-5).map(l => l.msg).join(" | ")}
        
        Execute the following command and return ONLY the output as it would appear in a real terminal. 
        If the command is 'pip install' or 'pkg install', confirm the installation and I will update the state.
        If the command involves connecting to a website, simulate the real output from that site (e.g., curl output).
        
        Command: ${trimmedCmd}
      `, "coding");

      const output = response.text || "Command executed.";
      
      // Check if it was an installation command
      if (trimmedCmd.startsWith('pip install ') || trimmedCmd.startsWith('pkg install ') || trimmedCmd.startsWith('npm install ')) {
        const pkg = trimmedCmd.split(' ').pop();
        if (pkg && !installedPackages.includes(pkg)) {
          setInstalledPackages(prev => [...prev, pkg]);
        }
      }

      setTerminalLogs(prev => [...prev, { 
        id: Date.now() + 1, 
        type: output.toLowerCase().includes('error') ? 'error' : 'info', 
        msg: output, 
        time: new Date().toLocaleTimeString() 
      }]);
    } catch (error) {
      setTerminalLogs(prev => [...prev, { id: Date.now() + 1, type: 'error', msg: "Execution failed: Connection to Aether Core lost.", time: new Date().toLocaleTimeString() }]);
    } finally {
      setIsTerminalBusy(false);
    }
  };

  const [activeBots, setActiveBots] = useState<string[]>([
    "Code Optimizer Bot", 
    "Security Auditor Bot", 
    "Model Trainer Bot", 
    "UI/UX Enhancer Bot", 
    "SEO Master Bot", 
    "Performance Booster", 
    "Localization Bot", 
    "Documentation Bot", 
    "Market Trend Bot", 
    "Bug Fixer Bot",
    "Zora AI Bot"
  ]);
  const [botLogs, setBotLogs] = useState<{id: number, bot: string, msg: string, time: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeBots.length === 0) return;
      const randomBot = activeBots[Math.floor(Math.random() * activeBots.length)];
      const msgs = [
        "Optimizing code structure...",
        "Scanning for vulnerabilities...",
        "Updating SEO metadata...",
        "Analyzing market trends...",
        "Improving UI responsiveness...",
        "Generating documentation...",
        "Translating assets...",
        "Cleaning up database...",
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setBotLogs(prev => [{
        id: Date.now(),
        bot: randomBot,
        msg: randomMsg,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 5));
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBots]);

  const toggleBot = (botName: string) => {
    setActiveBots(prev => 
      prev.includes(botName) 
        ? prev.filter(b => b !== botName) 
        : [...prev, botName]
    );
  };

  const t = translations[lang];

  useEffect(() => {
    if (strategy) {
      setChatMessages([
        {
          role: "agent",
          content: `${t.chatIntro} ${strategy.name}${t.chatIntro2}`,
        },
      ]);
    }
  }, [strategy, lang]);

  const [agents, setAgents] = useState({
    alpha: "idle" as AgentStatus,
    visual: "idle" as AgentStatus,
    ui: "idle" as AgentStatus,
    dev: "idle" as AgentStatus,
    support: "idle" as AgentStatus,
  });

  const steps = [
    { id: "alpha", name: "Agent Alpha", icon: Cpu, desc: "Strategy & Identity" },
    { id: "visual", name: "Agent Visual", icon: Palette, desc: "Visual Identity" },
    { id: "ui", name: "Agent UI", icon: Layout, desc: "Interface Design" },
    { id: "dev", name: "Agent Dev", icon: Code, desc: "Deployment & DB" },
    { id: "support", name: "Agent Support", icon: MessageSquare, desc: "AI Support Bot" },
  ];

  const { width } = useWindowSize();
  const isMobile = width < 768;

  const [bestModels, setBestModels] = useState<any[]>([]);

  useEffect(() => {
    const fetchBestModels = async () => {
      try {
        const data = await brandApi.getBestModels();
        setBestModels(data);
      } catch (error) {
        console.error("Failed to fetch best models");
      }
    };
    if (isSettingsOpen) {
      fetchBestModels();
    }
  }, [isSettingsOpen]);

  const handleBuild = async () => {
    if (!idea) return;
    setIsBuilding(true);
    setDeployed(false);
    setStrategy(null);
    setLogoUrl(null);
    setSentiment(null);
    setErrorMessage(null);
    
    try {
      // 0. Initialize Brand & Select Agents
      setAgents(prev => ({ ...prev, alpha: "working" }));
      const initData = await brandApi.initializeBrand(idea, idea);
      setAssignedAgents(initData.agents);
      toast.info(lang === 'ar' ? "بدء عملية التصنيع..." : "Starting manufacturing process...");

      // 1. Sentiment Analysis (Hugging Face)
      setChatMessages([]);
      let sentimentData = null;
      try {
        sentimentData = await brandApi.analyzeSentiment(idea);
        setSentiment(sentimentData);
      } catch (e) {
        console.warn("Sentiment analysis skipped due to error", e);
      }

      // 2. Strategy Generation (Groq)
      const strategyData = await brandApi.generateStrategy(idea);
      setStrategy(strategyData);
      setAgents(prev => ({ ...prev, alpha: "completed", visual: "working" }));
      toast.success(lang === 'ar' ? "تم توليد الاستراتيجية" : "Strategy generated");

      // 3. Logo Generation (CometAPI)
      const logoData = await brandApi.generateLogo(strategyData.name, idea);
      setLogoUrl(logoData.logoUrl);
      setAgents(prev => ({ ...prev, visual: "completed", ui: "working" }));
      toast.success(lang === 'ar' ? "تم تصميم الشعار" : "Logo designed");

      // 4. UI Generation (Groq)
      const uiData = await brandApi.generateProject(
        `Create a complete website for ${strategyData.name} based on this idea: ${idea}. Return a JSON object with title, description, sections, and theme.`,
        "json"
      );
      if (uiData.appStructure) {
        setAppStructure(uiData.appStructure);
      }

      // 4b. Full HTML Generation for Download/Preview
      let finalHtml = "";
      let files = null;
      
      if (projectType === 'multi') {
        const multiProject = await brandApi.generateMultiFileProject(
          `Create a complete multi-file project for ${strategyData.name} based on this idea: ${idea}.`
        );
        files = multiProject.project.files;
        setProjectFiles(files);
        
        // Create a simple HTML preview for multi-file projects
        finalHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>${strategyData.name}</title>
            <style>
              body { font-family: system-ui, sans-serif; background: #111; color: white; padding: 2rem; }
              .container { max-width: 800px; margin: 0 auto; }
              .file { background: #222; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; border: 1px solid #333; }
              .path { font-weight: bold; color: #f97316; margin-bottom: 0.5rem; }
              pre { background: #000; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${strategyData.name} - Multi-File Project</h1>
              <p>Tech Stack: ${multiProject.project.tech_stack}</p>
              <p>Download the ZIP file to run the project locally.</p>
              ${files.map((f: any) => `
                <div class="file">
                  <div class="path">${f.path}</div>
                  <pre><code>${f.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                </div>
              `).join('')}
            </div>
          </body>
          </html>
        `;
        setGeneratedHtml(finalHtml);
      } else {
        const htmlData = await brandApi.generateProject(
          `Create a complete, single-file HTML website for ${strategyData.name} based on this idea: ${idea}. Include all CSS and JS.`,
          "html"
        );
        finalHtml = htmlData.html;
        setGeneratedHtml(finalHtml);
      }

      setAgents(prev => ({ ...prev, ui: "completed", dev: "working" }));

      // 5. Deployment (Supabase)
      const deployRes = await brandApi.deploy(
        strategyData.name, 
        { ...strategyData, logoUrl: logoData.logoUrl, sentiment: sentimentData }, 
        finalHtml,
        strategyData.marketingSteps,
        98,
        files
      );
      
      if (deployRes?.data?.id) {
        setDeploymentId(deployRes.data.id);
      }

      setAgents(prev => ({ ...prev, dev: "completed", support: "completed" }));
      setDeployed(true);
      toast.success(lang === 'ar' ? "تم النشر بنجاح" : "Deployed successfully");

    } catch (error: any) {
      console.error("Build failed:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
      setAgents({ alpha: "error", visual: "error", ui: "error", dev: "error", support: "error" });
      toast.error(lang === 'ar' ? "فشل في التصنيع" : "Manufacturing failed");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatting || !strategy) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsChatting(true);

    try {
      const prompt = `You are the AI support agent for a brand named "${strategy.name}". 
      Brand Slogan: "${strategy.slogan}". 
      Target Audience: "${strategy.targetAudience}".
      User says: "${userMsg}"
      Respond helpfully, concisely, and stay in character. If the user speaks Arabic, respond in Arabic.`;

      const data = await brandApi.chat(prompt);
      setChatMessages(prev => [...prev, { role: "agent", content: data.text }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { role: "agent", content: t.chatError }]);
    } finally {
      setIsChatting(false);
    }
  };

  const handlePreviewUI = () => {
    if (!generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = async () => {
    if (!strategy || !deploymentId) return;
    try {
      const response = await fetch(`/api/download-project/${deploymentId}`);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${strategy.name.replace(/\s+/g, '_').toLowerCase()}_project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500 selection:text-black ${lang === 'ar' ? 'rtl' : 'ltr'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Toaster position="top-center" richColors />
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="text-black w-6 h-6 fill-current" />
              </div>
              <span className="text-xs font-mono tracking-widest uppercase opacity-50">Autonomous Brand Factory v2.5</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => {
                    setActiveSettingsTab('content');
                    setIsSettingsOpen(true);
                  }}
                  className="flex px-3 md:px-4 py-2 rounded-full bg-zinc-800 border border-white/10 text-[10px] md:text-xs font-bold hover:bg-zinc-700 transition-all items-center gap-2 relative"
                >
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'مختبر المحتوى' : 'Content Lab'}</span>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-orange-500 text-black text-[7px] md:text-[8px] font-black rounded-full animate-pulse">NEW</span>
                </button>
                <button 
                  onClick={() => {
                    setActiveSettingsTab('models');
                    setIsSettingsOpen(true);
                  }}
                  className="flex px-3 md:px-4 py-2 rounded-full bg-zinc-800 border border-white/10 text-[10px] md:text-xs font-bold hover:bg-zinc-700 transition-all items-center gap-2 relative"
                >
                  <Database className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'النماذج العالمية' : 'Universal Models'}</span>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-blue-500 text-white text-[7px] md:text-[8px] font-black rounded-full animate-pulse">NEW</span>
                </button>
                <button 
                  onClick={() => {
                    setActiveSettingsTab('tools');
                    setIsSettingsOpen(true);
                  }}
                  className="flex px-3 md:px-4 py-2 rounded-full bg-zinc-800 border border-white/10 text-[10px] md:text-xs font-bold hover:bg-zinc-700 transition-all items-center gap-2 relative"
                >
                  <Wrench className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">{lang === 'ar' ? 'أدوات ذكية' : 'Smart Tools'}</span>
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-green-500 text-white text-[7px] md:text-[8px] font-black rounded-full animate-pulse">NEW</span>
                </button>
              </div>
              <button 
                onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
                className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold hover:bg-white/5 transition-all flex items-center gap-2"
              >
                <Globe className="w-4 h-4" />
                {lang === 'en' ? 'العربية' : 'English'}
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-full border border-white/10 hover:bg-white/5 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-none">
            {t.title} <span className="text-orange-500 italic">{t.entity}</span>
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
          
          {/* Welcome Table Section */}
          <div className="mt-10">
            <WelcomeTable lang={lang} />
          </div>
        </header>

        {/* Input Section */}
        <section className="mb-16 md:mb-20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setProjectType('single')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${projectType === 'single' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {lang === 'ar' ? 'ملف واحد (معاينة)' : 'Single File (Preview)'}
              </button>
              <button
                onClick={() => setProjectType('multi')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${projectType === 'multi' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
              >
                {lang === 'ar' ? 'مشروع كامل (متعدد الملفات)' : 'Full Project (Multi-file)'}
              </button>
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
                {lang === 'ar' ? 'المحرك النشط:' : 'Active Engine:'} {bestModels.find(m => m.type === 'coding')?.model?.name || 'Auto-Switching'}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:relative group gap-4 md:gap-0">
            <input
              type="text"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={t.placeholder}
              className="w-full bg-zinc-900/50 border-b-2 border-zinc-800 p-6 md:p-8 text-xl md:text-2xl lg:text-3xl focus:outline-none focus:border-orange-500 transition-colors placeholder:opacity-30 rounded-2xl md:rounded-none"
              disabled={isBuilding}
            />
            <button
              onClick={handleBuild}
              disabled={isBuilding || !idea}
              className={`w-full md:w-auto md:absolute ${lang === 'ar' ? 'left-4' : 'right-4'} top-1/2 md:-translate-y-1/2 bg-orange-500 text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-orange-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isBuilding ? <Loader2 className="animate-spin" /> : <Rocket className="w-5 h-5" />}
              {isBuilding ? t.manufacturing : t.launch}
            </button>
          </div>
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}
        </section>

        {/* New Features Quick Actions */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">{lang === 'ar' ? 'الميزات الجديدة' : 'New Features'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
              onClick={() => {
                setActiveSettingsTab('content');
                setIsSettingsOpen(true);
              }}
              className="flex flex-col items-start p-6 bg-zinc-900/50 border border-orange-500/30 hover:bg-orange-500/10 rounded-2xl transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'مختبر المحتوى' : 'Content Lab'}</h3>
                <span className="px-2 py-0.5 bg-orange-500 text-black text-[10px] font-black rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-sm text-zinc-400">
                {lang === 'ar' ? 'توليد محتوى تسويقي ذكي لعلامتك التجارية.' : 'Generate smart marketing content for your brand.'}
              </p>
            </button>

            <button 
              onClick={() => {
                setActiveSettingsTab('models');
                setIsSettingsOpen(true);
              }}
              className="flex flex-col items-start p-6 bg-zinc-900/50 border border-blue-500/30 hover:bg-blue-500/10 rounded-2xl transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'النماذج العالمية' : 'Universal Models'}</h3>
                <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-black rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-sm text-zinc-400">
                {lang === 'ar' ? 'إضافة وإدارة نماذج ذكاء اصطناعي خارجية.' : 'Add and manage external AI models.'}
              </p>
            </button>

            <button 
              onClick={() => {
                setActiveSettingsTab('tools');
                setIsSettingsOpen(true);
              }}
              className="flex flex-col items-start p-6 bg-zinc-900/50 border border-green-500/30 hover:bg-green-500/10 rounded-2xl transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'أدوات ذكية' : 'Smart Tools'}</h3>
                <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-black rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                {lang === 'ar' ? 'أدوات SEO، تنسيق الكود، وفحص الأمان.' : 'SEO tools, code formatting, and security check.'}
              </p>
              <div className="grid grid-cols-2 gap-2 w-full text-[10px]">
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  {lang === 'ar' ? 'فحص SEO' : 'SEO Audit'}
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  {lang === 'ar' ? 'تنسيق الكود' : 'Code Formatter'}
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  {lang === 'ar' ? 'فحص الأمان' : 'Security Scan'}
                </div>
                <div className="bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  {lang === 'ar' ? 'تحليل الأداء' : 'Performance'}
                </div>
              </div>
            </button>

            <button 
              onClick={() => {
                setActiveSettingsTab('database');
                setIsSettingsOpen(true);
              }}
              className="flex flex-col items-start p-6 bg-zinc-900/50 border border-purple-500/30 hover:bg-purple-500/10 rounded-2xl transition-all group text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform" />
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg">{lang === 'ar' ? 'مستكشف البيانات' : 'Database Explorer'}</h3>
                <span className="px-2 py-0.5 bg-purple-500 text-white text-[10px] font-black rounded-full animate-pulse">NEW</span>
              </div>
              <p className="text-sm text-zinc-400">
                {lang === 'ar' ? 'استكشاف جداول قاعدة البيانات وهيكل البيانات.' : 'Explore database tables and data structure.'}
              </p>
            </button>
          </div>
        </section>

        {/* Agents Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-16 md:mb-20">
          {steps.map((step) => {
            const status = agents[step.id as keyof typeof agents];
            return (
              <div 
                key={step.id}
                className={cn(
                  "p-4 md:p-6 border border-zinc-800 rounded-2xl transition-all duration-500",
                  status === "working" && "border-orange-500 bg-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.1)]",
                  status === "completed" && "border-green-500/30 bg-green-500/5",
                  status === "error" && "border-red-500/30 bg-red-500/5"
                )}
              >
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <div className={cn(
                    "p-2 md:p-3 rounded-xl",
                    status === "working" ? "bg-orange-500 text-black" : "bg-zinc-900 text-zinc-400"
                  )}>
                    <step.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  {status === "completed" && <CheckCircle2 className="text-green-500 w-4 h-4 md:w-5 md:h-5" />}
                  {status === "working" && <Loader2 className="text-orange-500 w-4 h-4 md:w-5 md:h-5 animate-spin" />}
                </div>
                <h3 className="font-bold text-sm md:text-lg mb-1">{step.name}</h3>
                <p className="text-xs md:text-sm text-zinc-500">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Projects Section */}
        <section className="mb-20">
          <RecentProjects lang={lang} />
        </section>

        {/* Hyper-Efficiency Future Labs (The 10 New Tubes) */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-orange-500/10 rounded-2xl">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {lang === 'ar' ? 'أنظمة الكفاءة الفائقة' : 'Hyper-Efficiency Tubes'}
              </h2>
              <p className="text-zinc-500 text-sm font-medium">
                {lang === 'ar' ? 'أنابيب ذكاء اصطناعي متخصصة للقطاعات السيادية والمستقبلية.' : 'Specialized AI tubes for sovereign and future-defining sectors.'}
              </p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence>
          {strategy && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Brand Identity Card */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrendingUp className="w-64 h-64" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                    {logoUrl ? (
                      <img 
                        src={logoUrl} 
                        alt="Brand Logo" 
                        className="w-48 h-48 rounded-2xl object-cover border border-zinc-700 shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-zinc-800 rounded-2xl animate-pulse flex items-center justify-center">
                        <Palette className="w-12 h-12 text-zinc-600" />
                      </div>
                    )}
                    
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-5xl font-black tracking-tight mb-2 uppercase">{strategy.name}</h2>
                      <p className="text-2xl text-orange-500 font-serif italic mb-6">{strategy.slogan}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-4">
                        <span className="px-4 py-1 bg-zinc-800 rounded-full text-xs font-mono uppercase tracking-widest">Target: {strategy.targetAudience}</span>
                        {deployed && <span className="px-4 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-mono uppercase tracking-widest flex items-center gap-1"><Globe className="w-3 h-3" /> Live on Supabase</span>}
                      </div>

                      {/* Detected Features */}
                      {appStructure?.features && (
                        <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
                          {appStructure.features.map((feature: string) => (
                            <span key={feature} className="px-3 py-1 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-lg text-[10px] font-mono uppercase">
                              {feature}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
                        {generatedHtml && (
                          <button 
                            onClick={handlePreviewUI}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-colors"
                          >
                            <Eye className="w-4 h-4" /> {t.preview}
                          </button>
                        )}
                        <button 
                          onClick={handleDownload}
                          className="px-6 py-2 border border-zinc-700 hover:bg-zinc-800 text-white rounded-full text-sm font-bold flex items-center gap-2 transition-colors"
                        >
                          <Download className="w-4 h-4" /> {t.download}
                        </button>
                      </div>
                      
                      {assignedAgents && (
                        <div className="mt-6 p-4 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                          <h5 className="text-[10px] font-mono uppercase tracking-widest text-orange-500 mb-2">{t.agents}</h5>
                          <div className="flex gap-4 text-xs">
                            <div className="flex items-center gap-2">
                              <Cpu className="w-3 h-3 text-purple-400" />
                              <span className="text-zinc-400">Logic:</span>
                              <span className="font-bold">{assignedAgents.logic?.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Palette className="w-3 h-3 text-pink-400" />
                              <span className="text-zinc-400">Vision:</span>
                              <span className="font-bold">{assignedAgents.vision?.name}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Marketing Steps */}
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                      <Zap className="w-4 h-4" /> {t.roadmap}
                    </h4>
                    <div className="space-y-6">
                      {(strategy.marketingSteps || []).map((step: string, i: number) => (
                        <div key={i} className="flex gap-4">
                          <span className="text-orange-500 font-mono font-bold">0{i + 1}</span>
                          <p className="text-zinc-300 leading-relaxed text-sm">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Brand Essence & Voice */}
                  <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> {t.essence}
                    </h4>
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-mono mb-2 block">{t.voice}</span>
                        <p className="text-orange-500 font-bold italic">{strategy.brandVoice || "Visionary & Bold"}</p>
                      </div>
                      <div className="pt-4 border-t border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono mb-2 block">{t.manifesto}</span>
                        <p className="text-zinc-300 italic leading-relaxed whitespace-pre-line">
                          "{strategy.poetry || "Innovation in every step, \nVision in every breath."}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alternative Strategies & Questions */}
                {(strategy.alternativeStrategies?.length > 0 || strategy.clarifyingQuestions?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    {strategy.alternativeStrategies && strategy.alternativeStrategies.length > 0 && (
                      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                          <Layers className="w-4 h-4" /> {lang === 'ar' ? 'استراتيجيات بديلة' : 'Alternative Strategies'}
                        </h4>
                        <div className="space-y-4">
                          {strategy.alternativeStrategies.map((alt: any, i: number) => (
                            <div key={i} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                              <h5 className="font-bold text-orange-500 mb-1">{alt.name}</h5>
                              <p className="text-xs text-zinc-400 leading-relaxed">{alt.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {strategy.clarifyingQuestions && strategy.clarifyingQuestions.length > 0 && (
                      <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                        <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> {lang === 'ar' ? 'أسئلة توضيحية' : 'Clarifying Questions'}
                        </h4>
                        <div className="space-y-3">
                          {strategy.clarifyingQuestions.map((q: string, i: number) => (
                            <div key={i} className="flex gap-3 items-start">
                              <div className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">?</div>
                              <p className="text-sm text-zinc-300">{q}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Market Sentiment (Full Width) */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-3xl p-8">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> {t.sentiment}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {(sentiment?.labels || []).map((label: string, i: number) => (
                      <div key={label} className="space-y-2">
                        <div className="flex justify-between text-[10px] uppercase tracking-widest">
                          <span>{label}</span>
                          <span className="text-orange-500">{Math.round((sentiment?.scores?.[i] || 0) * 100)}%</span>
                        </div>
                        <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(sentiment?.scores?.[i] || 0) * 100}%` }}
                            className="h-full bg-orange-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chat Bot - Desktop Floating / Mobile Drawer */}
              {strategy && (
                <>
                  {isMobile ? (
                    <Drawer.Root>
                      <Drawer.Trigger asChild>
                        <button className="fixed bottom-6 right-6 p-4 bg-orange-500 rounded-full shadow-2xl shadow-orange-500/50 hover:scale-110 transition-transform z-40">
                          <Bot className="w-6 h-6 text-black" />
                        </button>
                      </Drawer.Trigger>
                      <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                        <Drawer.Content className="bg-zinc-900 flex flex-col rounded-t-[32px] h-[85%] mt-24 fixed bottom-0 left-0 right-0 z-50 border-t border-white/10">
                          <div className="p-6 bg-zinc-900 rounded-t-[32px] flex-1 flex flex-col">
                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-800 mb-8" />
                            <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
                              <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                  <Bot className="w-6 h-6 text-black" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-white">{t.support}</h3>
                                  <p className="text-[10px] text-orange-500 font-mono uppercase tracking-widest">{t.online}</p>
                                </div>
                              </div>
                              
                              <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
                                {chatMessages.map((msg, i) => (
                                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                                      msg.role === 'user' ? 'bg-orange-500 text-black font-medium' : 'bg-zinc-800 text-zinc-300 border border-white/5'
                                    }`}>
                                      {msg.content}
                                    </div>
                                  </div>
                                ))}
                                {isChatting && (
                                  <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                                  </div>
                                )}
                              </div>

                              <form onSubmit={handleChat} className="relative pb-8">
                                <input 
                                  type="text" 
                                  value={chatInput}
                                  onChange={(e) => setChatInput(e.target.value)}
                                  placeholder={t.chatPlaceholder}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 pr-12 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <button 
                                  type="submit"
                                  disabled={isChatting || !chatInput.trim()}
                                  className={`absolute ${lang === 'ar' ? 'left-3' : 'right-3'} top-4 text-zinc-500 hover:text-orange-500 disabled:opacity-50`}
                                >
                                  {isChatting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                              </form>
                            </div>
                          </div>
                        </Drawer.Content>
                      </Drawer.Portal>
                    </Drawer.Root>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed bottom-8 right-8 w-96 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-40 overflow-hidden flex flex-col max-h-[600px]"
                    >
                      <div className="p-4 border-b border-white/10 bg-orange-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center">
                            <Bot className="w-6 h-6 text-black" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-sm">{t.support}</h3>
                            <p className="text-[10px] text-orange-500 font-medium uppercase tracking-wider">{t.online}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] custom-scrollbar">
                        {chatMessages.map((msg, i) => (
                          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                              msg.role === 'user' ? 'bg-orange-500 text-black font-medium' : 'bg-white/5 text-white/90 border border-white/10'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        ))}
                        {isChatting && (
                          <div className="bg-zinc-800/50 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 border-t border-white/10 bg-black/20">
                        <form onSubmit={handleChat} className="flex gap-2">
                          <input 
                            type="text" 
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder={t.chatPlaceholder}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                          />
                          <button 
                            type="submit"
                            disabled={isChatting || !chatInput.trim()}
                            className="p-2 bg-orange-500 text-black rounded-xl disabled:opacity-50"
                          >
                            {isChatting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-32 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-mono uppercase">{t.footer}</span>
          </div>
          <div className="flex gap-8 text-xs font-mono uppercase">
            <a href="#" className="hover:text-orange-500 transition-colors">Documentation</a>
            <a href="#" className="hover:text-orange-500 transition-colors">API Status</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
          </div>
        </footer>
      </main>

      {/* Side Settings Panel */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: lang === 'ar' ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: lang === 'ar' ? '-100%' : '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 bottom-0 ${lang === 'ar' ? 'left-0' : 'right-0'} w-full md:w-[450px] bg-zinc-950 border-${lang === 'ar' ? 'r' : 'l'} border-white/10 z-50 flex flex-col shadow-2xl`}
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-orange-500" />
                  <h2 className="font-bold text-base">{lang === 'ar' ? 'إعدادات المنصة والذكاء' : 'Platform & AI Settings'}</h2>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col border-b border-white/10 bg-zinc-900/50">
                {/* Category Navigation (Top Level) */}
                <div className="flex overflow-x-auto border-b border-white/10 bg-black/20 custom-scrollbar">
                  {settingsCategories.map((cat) => (
                    <button 
                      key={cat.id}
                      onClick={() => {
                        setActiveSettingsCategory(cat.id);
                        setActiveSettingsTab(categoryTabs[cat.id][0].id);
                      }}
                      className={`flex-none px-6 py-4 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeSettingsCategory === cat.id ? 'text-orange-500 bg-white/5 border-b-2 border-orange-500' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <cat.icon className="w-3.5 h-3.5" />
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Sub-Tab Navigation (Second Level) */}
                <div className="flex overflow-x-auto custom-scrollbar">
                  {categoryTabs[activeSettingsCategory].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => setActiveSettingsTab(tab.id as any)}
                      className={`flex-none w-[72px] sm:w-[84px] py-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-tighter transition-all ${activeSettingsTab === tab.id ? 'text-orange-500 bg-orange-500/5' : 'text-zinc-500 hover:text-white hover:bg-white/5'} relative flex flex-col items-center justify-center gap-1.5`}
                    >
                      <tab.icon className={`w-3 h-3 ${activeSettingsTab === tab.id ? 'text-orange-500' : 'text-zinc-500'}`} />
                      <span className="truncate max-w-full px-0.5">{tab.label}</span>
                      {tab.badge && (
                        <span className={`absolute top-0.5 right-0.5 px-0.5 py-0.25 ${tab.badgeColor} text-[4px] font-black rounded-full`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                {activeSettingsTab === 'inbox' && (
                  <InboxBrowser lang={lang} />
                )}
                
                {activeSettingsTab === 'telegram' && (
                  <TelegramGateway lang={lang} />
                )}

                {activeSettingsTab === 'agents' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 rounded-2xl p-5 mb-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Zap className="w-20 h-20 text-orange-500" />
                      </div>
                      <h3 className="text-orange-500 font-black text-lg mb-2 flex items-center gap-2">
                        <Cpu className="w-5 h-5" />
                        {lang === 'ar' ? 'أوركسترا الذكاء الاصطناعي' : 'AI Orchestration'}
                      </h3>
                      <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                        {lang === 'ar' 
                          ? 'مرحباً بك في مركز التحكم الذكي. النظام الآن يعمل بنظام التبديل التلقائي الذكي. يتم اختيار أفضل نموذج لكل مهمة بناءً على قاعدة البيانات (Llama للبرمجة، GPT للمنطق، Comet للرؤية).' 
                          : 'Welcome to the Smart Control Center. The system now operates on a Smart Auto-Switching engine. The best model for each task is selected dynamically from the database.'}
                      </p>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                          {['Groq', 'OpenRouter', 'HF', 'Puter', 'Anthropic', 'Google'].map((p, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                              {p[0]}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-orange-500 font-mono uppercase tracking-widest animate-pulse">
                          {lang === 'ar' ? 'الوضع التلقائي نشط' : 'Auto-Mode Active'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          {lang === 'ar' ? 'وكيل المحتوى: نشط' : 'Content Agent: Active'}
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          {lang === 'ar' ? 'وكيل SEO: نشط' : 'SEO Agent: Active'}
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          {lang === 'ar' ? 'وكيل السوق: نشط' : 'Market Agent: Active'}
                        </div>
                        <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
                          {lang === 'ar' ? 'وكيل التصميم: نشط' : 'Design Agent: Active'}
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                      <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        {lang === 'ar' ? 'تحديث قاعدة البيانات' : 'Update Database'}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {lang === 'ar' ? 'مزامنة وكلاء الذكاء الاصطناعي الجدد (المحتوى، SEO، تحليل السوق) مع قاعدة بيانات Supabase.' : 'Sync new AI agents (Content, SEO, Market Analysis) with Supabase database.'}
                      </p>
                      <button 
                        onClick={async () => {
                          const loadingToast = toast.loading(lang === 'ar' ? 'جاري المزامنة...' : 'Syncing...');
                          try {
                            const res = await brandApi.updateModels();
                            toast.dismiss(loadingToast);
                            toast.success(res.message || (lang === 'ar' ? 'تم تحديث النماذج بنجاح' : 'Models updated successfully'));
                            
                            // Show detailed status in a separate toast or console
                            console.log("Sync Status:", res.status);
                            if (res.status) {
                              const missing = Object.entries(res.status)
                                .filter(([_, v]) => v === "Missing Key")
                                .map(([k, _]) => k.toUpperCase());
                              
                              if (missing.length > 0) {
                                toast.warning(
                                  lang === 'ar' 
                                    ? `تنبيه: بعض المفاتيح مفقودة (${missing.join(', ')})`
                                    : `Warning: Some keys are missing (${missing.join(', ')})`
                                );
                              }
                            }
                          } catch (e: any) {
                            toast.dismiss(loadingToast);
                            toast.error(e.message || (lang === 'ar' ? 'فشل التحديث' : 'Update failed'));
                          }
                        }}
                        className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors text-sm"
                      >
                        {lang === 'ar' ? 'مزامنة النماذج' : 'Sync Models'}
                      </button>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-6">
                      <h3 className="text-zinc-300 font-bold mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4 text-blue-500" />
                        {lang === 'ar' ? 'وضع توليد المشاريع' : 'Project Generation Mode'}
                      </h3>
                      <div className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                        <div className="flex items-center gap-2">
                          <Zap className="w-3 h-3 text-orange-500" />
                          <span className="text-xs text-zinc-400">{lang === 'ar' ? 'النموذج النشط حالياً:' : 'Current Active Model:'}</span>
                          <span className="text-xs font-bold text-white">
                            {bestModels.find(m => m.type === 'coding')?.model?.name || (lang === 'ar' ? 'جاري التحديد...' : 'Auto-Selecting...')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">Dynamic</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-2 italic">
                        {lang === 'ar' 
                          ? 'يتم اختيار أفضل نموذج برمجي تلقائياً من قاعدة البيانات لضمان أعلى جودة.' 
                          : 'The best coding model is automatically selected from the database for maximum quality.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-zinc-300">{lang === 'ar' ? 'الوكلاء النشطين والمحركات' : 'Active Agents & Engines'}</h4>
                        <span className="text-[10px] px-2 py-0.5 bg-orange-500/10 text-orange-500 rounded-full font-bold animate-pulse">
                          {lang === 'ar' ? 'تبديل تلقائي ذكي' : 'Smart Auto-Switching'}
                        </span>
                      </div>
                      
                      {bestModels.length > 0 ? (
                        bestModels.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-orange-500/30 transition-all">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-zinc-800 rounded-md group-hover:scale-110 transition-transform">
                                {item.type === 'coding' ? <Code className="w-4 h-4 text-blue-400" /> :
                                 item.type === 'vision' ? <ImageIcon className="w-4 h-4 text-purple-400" /> :
                                 item.type === 'market' ? <Globe className="w-4 h-4 text-emerald-400" /> :
                                 item.type === 'seo' ? <TrendingUp className="w-4 h-4 text-pink-400" /> :
                                 item.type === 'content' ? <Sparkles className="w-4 h-4 text-orange-400" /> :
                                 item.type === 'security' ? <ShieldCheck className="w-4 h-4 text-red-400" /> :
                                 item.type === 'music' ? <Music className="w-4 h-4 text-cyan-400" /> :
                                 item.type === 'voice' ? <Mic className="w-4 h-4 text-indigo-400" /> :
                                 item.type === 'video' ? <Video className="w-4 h-4 text-rose-400" /> :
                                 item.type === '3d' ? <Box className="w-4 h-4 text-fuchsia-400" /> :
                                 item.type === 'data' ? <Database className="w-4 h-4 text-teal-400" /> :
                                 item.type === 'academy' ? <GraduationCap className="w-4 h-4 text-yellow-400" /> :
                                 <Bot className="w-4 h-4 text-zinc-400" />}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-white capitalize">{item.type} Agent</p>
                                <p className="text-[10px] text-zinc-500 font-mono">
                                  {item.model.provider}: {item.model.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
                              <span className="text-[8px] text-zinc-600 font-mono uppercase">Optimized</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="space-y-4">
                          {[
                            { name: "Content Generator", type: "Auto-Selecting...", icon: <Bot className="w-4 h-4 text-blue-400" /> },
                            { name: "SEO Optimizer", type: "Auto-Selecting...", icon: <TrendingUp className="w-4 h-4 text-green-400" /> },
                            { name: "Market Analyst", type: "Auto-Selecting...", icon: <Globe className="w-4 h-4 text-purple-400" /> },
                          ].map((agent, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg animate-pulse">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-zinc-800 rounded-md">{agent.icon}</div>
                                <div>
                                  <p className="font-medium text-sm text-white opacity-50">{agent.name}</p>
                                  <p className="text-[10px] text-zinc-500 font-mono italic">{agent.type}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'content' && (
                  <ContentLab lang={lang} brandStrategy={strategy || undefined} />
                )}

                {activeSettingsTab === 'models' && (
                  <UniversalModels lang={lang} />
                )}

                {activeSettingsTab === 'tools' && (
                  <SmartTools lang={lang} />
                )}

                {activeSettingsTab === 'database' && (
                  <DatabaseExplorer lang={lang} />
                )}

                {activeSettingsTab === 'vision' && (
                  <VisionLab lang={lang} />
                )}

                {activeSettingsTab === 'search' && (
                  <GlobalIntelligence lang={lang} />
                )}

                {activeSettingsTab === 'voice' && (
                  <VoiceStudio lang={lang} />
                )}

                {activeSettingsTab === 'ux_audit' && (
                  <NeuroUXAuditor lang={lang} />
                )}

                {activeSettingsTab === 'architecture' && (
                  <ArchitectureBlueprint lang={lang} />
                )}

                {activeSettingsTab === 'persona' && (
                  <PersonaEngine lang={lang} />
                )}

                {activeSettingsTab === 'devops' && (
                  <DevOpsCatalyst lang={lang} />
                )}

                {activeSettingsTab === 'legal' && (
                  <LegalAIAssistant lang={lang} />
                )}

                {activeSettingsTab === '3d' && (
                  <ThreeDLab lang={lang} />
                )}

                {activeSettingsTab === 'data' && (
                  <DataScienceLab lang={lang} />
                )}

                {activeSettingsTab === 'academy' && (
                  <AcademyLab lang={lang} />
                )}

                {/* Extreme Labs */}
                {activeSettingsTab === 'game_engine' && <GameEngineLab lang={lang} />}
                {activeSettingsTab === 'blockchain' && <BlockchainLab lang={lang} />}
                {activeSettingsTab === 'hardware' && <HardwareLab lang={lang} />}
                {activeSettingsTab === 'satellite' && <SatelliteLab lang={lang} />}
                {activeSettingsTab === 'quantum' && <QuantumLab lang={lang} />}
                {activeSettingsTab === 'biotech' && <BioTechLab lang={lang} />}
                {activeSettingsTab === 'fintech' && <FinTechVault lang={lang} />}
                {activeSettingsTab === 'robotics' && <RoboticsLab lang={lang} />}
                {activeSettingsTab === 'iot' && <IoTHubLab lang={lang} />}
                {activeSettingsTab === 'ar_vr' && <ARVRFactoryLab lang={lang} />}

                {/* Hyper-Efficiency Future Labs (The 10 New Tubes) has been removed */}

                {activeSettingsTab === 'bots' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                      <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        {lang === 'ar' ? 'بوتات المساهمة التلقائية' : 'Auto-Contribution Bots'}
                      </h3>
                      <p className="text-sm text-zinc-400 mb-4">
                        {lang === 'ar' 
                          ? 'بوتات ذكية ومجانية تعمل تلقائياً للمساهمة في تطوير المنصة وتحسين النماذج.' 
                          : 'Smart, free bots that work automatically to contribute to platform development and model improvement.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-mono uppercase text-zinc-500 flex items-center justify-between">
                        {lang === 'ar' ? 'حالة البوتات' : 'Bot Status'}
                        <span className="text-orange-500">{activeBots.length} {lang === 'ar' ? 'نشط دائماً' : 'Always Active'}</span>
                      </h4>
                      {[
                        { name: "Code Optimizer Bot", desc: lang === 'ar' ? 'تحسين جودة الكود تلقائياً' : 'Automatically optimize code quality' },
                        { name: "Security Auditor Bot", desc: lang === 'ar' ? 'فحص الثغرات الأمنية باستمرار' : 'Continuously check for security vulnerabilities' },
                        { name: "Model Trainer Bot", desc: lang === 'ar' ? 'تحسين دقة النماذج بناءً على البيانات' : 'Improve model accuracy based on data' },
                        { name: "UI/UX Enhancer Bot", desc: lang === 'ar' ? 'اقتراح تحسينات لواجهة المستخدم' : 'Suggest UI/UX improvements' },
                        { name: "SEO Master Bot", desc: lang === 'ar' ? 'تحسين ظهور المنصة في محركات البحث' : 'Optimize platform visibility in search engines' },
                        { name: "Performance Booster", desc: lang === 'ar' ? 'تسريع أداء المنصة وتقليل استهلاك الموارد' : 'Speed up platform performance and reduce resource usage' },
                        { name: "Localization Bot", desc: lang === 'ar' ? 'دعم اللغات المتعددة والترجمة التلقائية' : 'Support multi-languages and auto-translation' },
                        { name: "Documentation Bot", desc: lang === 'ar' ? 'توليد وتحديث الوثائق التقنية للمشروع' : 'Generate and update technical documentation' },
                        { name: "Market Trend Bot", desc: lang === 'ar' ? 'تحليل اتجاهات السوق العالمية' : 'Analyze global market trends' },
                        { name: "Bug Fixer Bot", desc: lang === 'ar' ? 'إصلاح الأخطاء البرمجية الشائعة' : 'Fix common programming bugs' },
                        { name: "Zora AI Bot", desc: lang === 'ar' ? 'المساعد الذكي المتطور (Zora)' : 'Advanced AI Assistant (Zora)' },
                      ].map((bot, i) => (
                        <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-white">{bot.name}</h4>
                            <p className="text-xs text-zinc-500">{bot.desc}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[10px] text-orange-500 font-mono uppercase">Active</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bot Activity Log */}
                    <div className="mt-8 p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
                      <h4 className="text-xs font-mono uppercase text-zinc-500 mb-4 flex items-center gap-2">
                        <RefreshCw className="w-3 h-3 animate-spin text-orange-500" />
                        {lang === 'ar' ? 'سجل نشاط البوتات' : 'Bot Activity Log'}
                      </h4>
                      <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                          {botLogs.length > 0 ? (
                            botLogs.map((log) => (
                              <motion.div 
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="text-[10px] font-mono flex items-center gap-2 text-zinc-400"
                              >
                                <span className="text-zinc-600">[{log.time}]</span>
                                <span className="text-orange-500/80">{log.bot}:</span>
                                <span>{log.msg}</span>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-[10px] text-zinc-600 italic">
                              {lang === 'ar' ? 'بانتظار نشاط البوتات...' : 'Waiting for bot activity...'}
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'security' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                      <h3 className="text-green-500 font-bold mb-2 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        {lang === 'ar' ? 'مركز الأمان' : 'Security Center'}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {lang === 'ar' 
                          ? 'إدارة إعدادات الأمان، التشفير، وحماية البيانات.' 
                          : 'Manage security settings, encryption, and data protection.'}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { name: lang === 'ar' ? 'تشفير البيانات' : 'Data Encryption', status: 'AES-256 Enabled' },
                        { name: lang === 'ar' ? 'جدار الحماية الذكي' : 'Smart Firewall', status: 'Active' },
                        { name: lang === 'ar' ? 'فحص الثغرات' : 'Vulnerability Scan', status: 'Scheduled' },
                        { name: lang === 'ar' ? 'سجل الوصول' : 'Access Logs', status: 'Monitoring' },
                      ].map((item, i) => (
                        <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-white">{item.name}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-mono">{item.status}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'transpiler' && <ProjectTranspiler />}
                {activeSettingsTab === 'logic' && <LogicReverseLab lang={lang} />}
                {activeSettingsTab === 'sdk' && <SDKGenerator />}
                {activeSettingsTab === 'secrets' && <SecretManager />}
                {activeSettingsTab === 'terminal' && (
                  <SmartTerminal />
                )}
                {activeSettingsTab === 'data_singularity' && <DataSingularity lang={lang} />}
                {activeSettingsTab === 'swarm_lab' && <SwarmLab lang={lang} />}
                {activeSettingsTab === 'omni_bridge' && <OmniBridge lang={lang} />}
                {activeSettingsTab === 'market_trends' && <MarketTrends lang={lang} />}
                {activeSettingsTab === 'api_architect' && <APIArchitect lang={lang} />}
                {activeSettingsTab === 'regex_master' && <RegexMaster lang={lang} />}
                {activeSettingsTab === 'log_analyzer' && <LogAnalyzer lang={lang} />}
                {activeSettingsTab === 'css_playground' && <CSSPlayground lang={lang} />}
                {activeSettingsTab === 'git_suggest' && <GitSuggest lang={lang} />}
                {activeSettingsTab === 'life_planner' && <LifePlanner lang={lang} />}
                {activeSettingsTab === 'recipe_alchemist' && <RecipeAlchemist lang={lang} />}
                {activeSettingsTab === 'gift_finder' && <GiftFinder lang={lang} />}
                {activeSettingsTab === 'story_weaver' && <StoryWeaver lang={lang} />}
                {activeSettingsTab === 'travel_buddy' && <TravelBuddy lang={lang} />}
                {activeSettingsTab === 'project_decoder' && <ProjectDecoder lang={lang} />}
                {activeSettingsTab === 'preview_dashboard' && <AdvancedPreviewDashboard lang={lang} />}
                {activeSettingsTab === 'memory_engine' && <MemoryEngine lang={lang} />}
                {activeSettingsTab === 'team_system' && <TeamSystem lang={lang} />}
                {activeSettingsTab === 'smart_chat' && <SmartChat lang={lang} />}
                {activeSettingsTab === 'logo_gen' && <LogoGeneratorLab lang={lang} />}
                {activeSettingsTab === 'repair_lab' && <RepairLab lang={lang} />}
                {activeSettingsTab === 'automation' && <AutomationTasks lang={lang} />}
                {activeSettingsTab === 'plugins' && <PluginManager lang={lang} />}
                {activeSettingsTab === 'templates' && (
                  <div className="space-y-6">
                    <p className="text-sm text-zinc-400">
                      {lang === 'ar' 
                        ? 'مجموعة القوالب الجاهزة التي يستخدمها الذكاء الاصطناعي لبناء المنصات.' 
                        : 'Pre-built templates used by AI to construct platforms.'}
                    </p>
                    
                    {[
                      { title: lang === 'ar' ? 'قوالب لوحات التحكم' : 'Admin & Dashboard', items: ['Sidebar Navigation', 'Stats Cards (KPIs)', 'Data Tables (CRUD)', 'Analytics Charts'] },
                      { title: lang === 'ar' ? 'قوالب الصفحات الرئيسية' : 'Landing Page Patterns', items: ['Hero Section', 'Feature Grid', 'Pricing Tables', 'Testimonials Slider'] },
                      { title: lang === 'ar' ? 'التجارة الإلكترونية' : 'E-commerce Patterns', items: ['Product Grid', 'Filter Sidebar', 'Shopping Cart Drawer', 'Checkout Stepper'] },
                      { title: lang === 'ar' ? 'قوالب الذكاء الاصطناعي' : 'AI & Communication', items: ['Chat Interface', 'Prompt Input Area', 'Model Playground', 'Typewriter Effect'] },
                    ].map((category, i) => (
                      <div key={i} className="mb-4">
                        <h4 className="font-bold text-zinc-300 mb-3 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-orange-500" />
                          {category.title}
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {category.items.map((item, j) => (
                            <div key={j} className="text-xs p-2 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-green-500" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSettingsTab === 'libraries' && (
                  <div className="space-y-6">
                    <p className="text-sm text-zinc-400">
                      {lang === 'ar' 
                        ? 'المكتبات المدعومة والمدمجة في النظام.' 
                        : 'Supported and integrated libraries in the system.'}
                    </p>

                    <div className="space-y-4">
                      {[
                        { name: "Shadcn/ui", desc: lang === 'ar' ? 'مكونات حديثة قابلة للتخصيص' : 'Modern customizable components', badge: 'Tailwind' },
                        { name: "Radix UI", desc: lang === 'ar' ? 'مكونات أساسية بدون تصميم' : 'Unstyled primitive components', badge: 'Core' },
                        { name: "Vercel AI SDK", desc: lang === 'ar' ? 'واجهات الذكاء الاصطناعي المتدفقة' : 'Streaming AI interfaces', badge: 'AI' },
                        { name: "Lucide React", desc: lang === 'ar' ? 'أيقونات متناسقة وجميلة' : 'Consistent & beautiful icons', badge: 'Icons' },
                        { name: "Framer Motion", desc: lang === 'ar' ? 'حركات وتفاعلات سلسة' : 'Smooth animations & interactions', badge: 'Animation' },
                      ].map((lib, i) => (
                        <div key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-sm text-white">{lib.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-full">{lib.badge}</span>
                          </div>
                          <p className="text-xs text-zinc-500">{lib.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSettingsTab === 'code' && (
                  <div className="space-y-6 flex flex-col h-full">
                    <p className="text-sm text-zinc-400">
                      {lang === 'ar' 
                        ? 'محرر الأكواد المدمج لتصحيح الأخطاء وتحليلها باستخدام الذكاء الاصطناعي (مدعوم بمحرك Groq Llama 3.3).' 
                        : 'Integrated code editor for debugging and analysis using AI (Powered by Groq Llama 3.3).'}
                    </p>
                    <div className="flex-1 flex flex-col gap-4">
                      <textarea 
                        className="flex-1 w-full min-h-[300px] bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:outline-none focus:border-orange-500 resize-none"
                        placeholder={lang === 'ar' ? 'اكتب أو الصق الكود هنا...' : 'Type or paste code here...'}
                        value={editorCode}
                        onChange={(e) => setEditorCode(e.target.value)}
                      />
                      <button 
                        onClick={async () => {
                          if (!editorCode.trim()) return;
                          setIsAnalyzingCode(true);
                          setEditorResult(null);
                          try {
                            const res = await brandApi.analyzeCode(editorCode);
                            setEditorResult(res.fixedCode);
                            toast.success(lang === 'ar' ? 'تم تحليل الكود بنجاح' : 'Code analyzed successfully');
                          } catch (error) {
                            setEditorResult(lang === 'ar' ? 'فشل تحليل الكود. حاول مرة أخرى.' : 'Failed to analyze code. Try again.');
                          } finally {
                            setIsAnalyzingCode(false);
                          }
                        }}
                        disabled={isAnalyzingCode || !editorCode.trim()}
                        className="w-full py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {isAnalyzingCode ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wrench className="w-5 h-5" />}
                        {lang === 'ar' ? 'تحليل وتصحيح الكود' : 'Analyze & Fix Code'}
                      </button>
                      {editorResult && (
                        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 overflow-y-auto max-h-64">
                          <h4 className="font-bold text-orange-500 mb-2">{lang === 'ar' ? 'النتيجة:' : 'Result:'}</h4>
                          <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono">{editorResult}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeSettingsTab === 'capabilities' && (
                  <div className="space-y-6">
                    <p className="text-sm text-zinc-400">
                      {lang === 'ar' 
                        ? 'الصلاحيات والقدرات المتاحة للذكاء الاصطناعي لاستخدامها في المشاريع.' 
                        : 'Capabilities and permissions available for AI to use in projects.'}
                    </p>

                    {[
                      { 
                        title: lang === 'ar' ? 'الوسائط والتواصل' : 'Media & Communication', 
                        items: ['Camera', 'Microphone', 'Photos & Media', 'Contacts', 'Call Logs', 'Phone'] 
                      },
                      { 
                        title: lang === 'ar' ? 'الموقع والحركة' : 'Location & Motion', 
                        items: ['Location (GPS)', 'Physical Activity', 'Body Sensors', 'Bluetooth'] 
                      },
                      { 
                        title: lang === 'ar' ? 'التنبيهات والظهور' : 'Notifications & Display', 
                        items: ['Notifications', 'Display over other apps', 'Write System Settings', 'Notification Access'] 
                      },
                      { 
                        title: lang === 'ar' ? 'النظام والخصوصية' : 'System & Privacy', 
                        items: ['Storage / Files', 'Usage Data', 'Calendar', 'SMS', 'Biometrics'] 
                      },
                      { 
                        title: lang === 'ar' ? 'الحركة والتحريك' : 'Motion & Animation', 
                        items: ['Animation', 'Transitions', 'Interactive Animation', 'Physics-based Motion', '2D/3D Animation', 'Parallax Effect'] 
                      },
                      { 
                        title: lang === 'ar' ? 'الجرافيكس والرسومات' : 'Graphics & Visuals', 
                        items: ['Vector Graphics', 'UI/UX Elements', '3D Rendering', 'Canvas', 'Modeling', 'Lighting & Shadows'] 
                      },
                      { 
                        title: lang === 'ar' ? 'التأثيرات البصرية' : 'Visual Effects (VFX)', 
                        items: ['Filters', 'Particle Effects', 'Blur Effects', 'Overlay/Blending', 'Distortion', 'Bloom/Glow', 'Chroma Key'] 
                      },
                      { 
                        title: lang === 'ar' ? 'التعامل مع الوسائط' : 'Media Handling', 
                        items: ['Image Processing', 'Video Editing', 'Audio Processing', 'Content Generation'] 
                      },
                      { 
                        title: lang === 'ar' ? 'أدوات متقدمة' : 'Advanced Tools', 
                        items: ['Background Camera', 'Install Unknown Apps', 'Battery Optimization', 'Accessibility'] 
                      }
                    ].map((category, i) => (
                      <div key={i} className="mb-4">
                        <h4 className="font-bold text-zinc-300 mb-3 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-orange-500" />
                          {category.title}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {category.items.map((item, j) => (
                            <span key={j} className="text-[10px] px-2 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSettingsTab === 'diagnostics' && (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <h3 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        {lang === 'ar' ? 'حالة النظام والذكاء' : 'System & AI Health'}
                      </h3>
                      <p className="text-sm text-zinc-400">
                        {lang === 'ar' 
                          ? 'مراقبة أداء النماذج واستهلاك الموارد في الوقت الفعلي.' 
                          : 'Monitor model performance and resource consumption in real-time.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'محرك Groq' : 'Groq Engine'}</span>
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full font-bold">ACTIVE</span>
                        </div>
                        <div className="text-lg font-bold text-white">Llama 3.3 70B</div>
                        <p className="text-[10px] text-zinc-500 mt-1">{lang === 'ar' ? 'المحرك الرئيسي للدردشة والاستراتيجية' : 'Primary engine for chat & strategy'}</p>
                      </div>

                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'محرك Hugging Face' : 'Hugging Face'}</span>
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full font-bold">ACTIVE</span>
                        </div>
                        <div className="text-lg font-bold text-white">RoBERTa Base</div>
                        <p className="text-[10px] text-zinc-500 mt-1">{lang === 'ar' ? 'تحليل المشاعر والبيانات اللغوية' : 'Sentiment & linguistic analysis'}</p>
                      </div>

                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'محرك Comet' : 'Comet Vision'}</span>
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] rounded-full font-bold">ACTIVE</span>
                        </div>
                        <div className="text-lg font-bold text-white">Stable Diffusion XL</div>
                        <p className="text-[10px] text-zinc-500 mt-1">{lang === 'ar' ? 'توليد الصور والشعارات' : 'Image & logo generation'}</p>
                      </div>

                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'محرك Gemini' : 'Gemini Core'}</span>
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] rounded-full font-bold">SECONDARY</span>
                        </div>
                        <div className="text-lg font-bold text-white">Gemini 3 Flash</div>
                        <p className="text-[10px] text-zinc-500 mt-1">{lang === 'ar' ? 'البحث المباشر وتحويل النص لصوت' : 'Live search & TTS'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'وقت الاستجابة' : 'Latency'}</span>
                        <div className="text-xl font-bold text-white mt-1">124ms</div>
                        <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> -12%
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'دقة النماذج' : 'Model Accuracy'}</span>
                        <div className="text-xl font-bold text-white mt-1">99.8%</div>
                        <div className="text-[10px] text-zinc-500 mt-1">{lang === 'ar' ? 'مستقر' : 'Stable'}</div>
                      </div>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'استهلاك التوكنز' : 'Token Usage'}</span>
                        <div className="text-xl font-bold text-white mt-1">1.2M</div>
                        <div className="text-[10px] text-zinc-500 mt-1">/ {lang === 'ar' ? 'يوم' : 'day'}</div>
                      </div>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <span className="text-[10px] text-zinc-500 uppercase font-mono">{lang === 'ar' ? 'المهام المنجزة' : 'Tasks Completed'}</span>
                        <div className="text-xl font-bold text-white mt-1">45,892</div>
                        <div className="text-[10px] text-orange-500 mt-1 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> {lang === 'ar' ? 'نشط' : 'Active'}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                      <h4 className="text-xs font-mono uppercase text-zinc-500 mb-4">{lang === 'ar' ? 'توزيع الحمل' : 'Load Distribution'}</h4>
                      <div className="space-y-3">
                        {[
                          { name: 'GPT-4o', load: 45, color: 'bg-green-500' },
                          { name: 'Claude 3.5', load: 30, color: 'bg-blue-500' },
                          { name: 'Gemini 1.5', load: 25, color: 'bg-orange-500' },
                        ].map((m, i) => (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between text-[10px] text-zinc-400">
                              <span>{m.name}</span>
                              <span>{m.load}%</span>
                            </div>
                            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full", m.color)} style={{ width: `${m.load}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {activeSettingsTab === 'upload' && (
                  <div className="space-y-6 flex flex-col h-full">
                    <p className="text-sm text-zinc-400">
                      {lang === 'ar' 
                        ? 'رفع مشروعك الحالي ليقوم الذكاء الاصطناعي بتحليله والبناء عليه.' 
                        : 'Upload your existing project for AI to analyze and build upon.'}
                    </p>
                    <div className="flex-1 flex flex-col gap-4">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        multiple 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setIsUploading(true);
                            setUploadProgress(0);
                            let progress = 0;
                            const interval = setInterval(() => {
                              progress += 10;
                              setUploadProgress(progress);
                              if (progress >= 100) {
                                clearInterval(interval);
                                setIsUploading(false);
                                setUploadProgress(null);
                                toast.success(lang === 'ar' ? 'تم رفع المشروع بنجاح!' : 'Project uploaded successfully!');
                              }
                            }, 300);
                          }
                        }}
                      />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`flex-1 border-2 border-dashed ${isUploading ? 'border-orange-500 bg-orange-500/5' : 'border-zinc-800 hover:border-orange-500/50'} rounded-xl flex flex-col items-center justify-center p-8 text-center transition-colors bg-zinc-900/50 cursor-pointer`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center">
                            <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                            <h3 className="text-orange-500 font-bold mb-2">{lang === 'ar' ? 'جاري الرفع والتحليل...' : 'Uploading & Analyzing...'}</h3>
                            <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
                              <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <UploadCloud className="w-12 h-12 text-zinc-600 mb-4" />
                            <h3 className="text-zinc-300 font-bold mb-2">
                              {lang === 'ar' ? 'اسحب وأفلت ملفات المشروع هنا' : 'Drag & drop project files here'}
                            </h3>
                            <p className="text-xs text-zinc-500 mb-6">
                              {lang === 'ar' ? 'يدعم ملفات ZIP أو المجلدات' : 'Supports ZIP files or folders'}
                            </p>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              {lang === 'ar' ? 'تصفح الملفات' : 'Browse Files'}
                            </button>
                          </>
                        )}
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-sm font-bold text-orange-500 mb-1">
                              {lang === 'ar' ? 'تحليل ذكي للمشاريع' : 'Smart Project Analysis'}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {lang === 'ar' 
                                ? 'سيقوم الذكاء الاصطناعي بقراءة هيكل المشروع، فهم المكاتب المستخدمة، وإضافة الميزات المطلوبة مع الحفاظ على الكود الأصلي.' 
                                : 'AI will read the project structure, understand used libraries, and add requested features while preserving original code.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
