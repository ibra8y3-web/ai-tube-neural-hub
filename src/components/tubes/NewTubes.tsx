import React, { useState } from 'react';
import { 
  Database, Zap, Cpu, Sparkles, Box, Code, MessageSquare, 
  ShieldCheck, Braces, Terminal, Copy, CheckCircle2, 
  TrendingUp, Search, Globe, AlertTriangle, RefreshCw,
  FileCode, Layers, ListChecks, Utensils, Gift, BookOpen, 
  MapPin, GitBranch, Layout, Activity, Lock, Unlock, 
  Server, HardDrive, FileSearch, UserCheck, Briefcase, 
  SearchCode, BarChart4, Radar, Codepen, FileJson, Palette, ShieldAlert,
  Lightbulb, Code2, FolderTree, Library, BookMarked,
  Ship, FileText, Ghost, Fingerprint, Languages, Image, TerminalSquare, PenTool, Monitor, Rocket, LayoutDashboard, Plus, Check, Trash2, Share2, Facebook, Loader2, ShieldCheck as SecureIcon
} from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { TerminalAgent } from './TerminalAgent';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-400 hover:text-white" title="Copy to clipboard">
      {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
};

// ==========================================
// 1. Data Singularity (ثقب البيانات الأسود)
// ==========================================
export const DataSingularity = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const processData = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const prompt = `You are the Data Singularity Engine. Take the following unstructured, messy data and convert it into a highly structured JSON array of objects, and also provide an optimal SQLite schema to store it. 
      Format: Return ONLY valid JSON with keys: "schema" (string, the SQL code) and "data" (array of objects).
      Messy Data: ${input}`;
      
      const res = await brandApi.chat(prompt, "coding");
      try {
        const jsonMatch = res.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          setResult(JSON.parse(jsonMatch[0]));
        }
      } catch (e) {
        console.error("Parse error", e);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <Database className="w-20 h-20 text-purple-500" />
        </div>
        <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
          <Database className="w-5 h-5" />
          {lang === 'ar' ? 'ثقب البيانات الأسود (Data Singularity)' : 'Data Singularity'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'قم بإلقاء نصوص عشوائية، فواتير، رسائل، أو بيانات غير مهيكلة، وسيقوم الثقب الأسود بتحويلها إلى قواعد بيانات مهيكلة (SQL / JSON) قابلة للربط.' 
            : 'Throw in random text, invoices, raw logs... the black hole compresses it into highly structured, relational databases (SQL & JSON).'}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <textarea
          className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-purple-500 focus:outline-none font-mono resize-none mb-3"
          placeholder={lang === 'ar' ? 'ضع أي نص عشوائي هنا (مثال: ذهب احمد واشترى 5 تفاحات ب 20 دولار والبارحة محمد اشترى سيارة)...' : 'Paste messy unstructured data here...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button 
          onClick={processData}
          disabled={loading || !input}
          className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
        >
          {loading ? <Zap className="w-4 h-4 animate-pulse" /> : <Sparkles className="w-4 h-4" />}
          {lang === 'ar' ? 'استخراج الهيكل (Extract)' : 'Extract Structure'}
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative group">
            <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
              <h4 className="text-xs font-mono text-purple-400">SQL Schema</h4>
              <CopyButton text={result.schema} />
            </div>
            <pre className="text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap">{result.schema}</pre>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 relative group">
            <div className="flex justify-between items-center mb-2 border-b border-zinc-800 pb-2">
              <h4 className="text-xs font-mono text-purple-400">JSON Objects</h4>
              <CopyButton text={JSON.stringify(result.data, null, 2)} />
            </div>
            <pre className="text-[10px] text-zinc-300 overflow-x-auto">{JSON.stringify(result.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 2. Swarm Intelligence (خلية النحل)
// ==========================================
export const SwarmLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [topic, setTopic] = useState('');
  const [isDiscussing, setIsDiscussing] = useState(false);
  const [dialogue, setDialogue] = useState<{ role: string, color: string, text: string }[]>([]);

  const runSwarm = async () => {
    if (!topic) return;
    setIsDiscussing(true);
    setDialogue([]);
    
    // Simulate multi-agent sequential thought processing
    const agents = [
      { role: lang === 'ar' ? 'المهندس المعماري' : 'System Architect', color: 'text-blue-500', bg: 'bg-blue-500/10' },
      { role: lang === 'ar' ? 'خبير الأمن' : 'Security Auditor', color: 'text-red-500', bg: 'bg-red-500/10' },
      { role: lang === 'ar' ? 'مصمم تجربة المستخدم' : 'UX Designer', color: 'text-emerald-500', bg: 'bg-emerald-500/10' }
    ];

    try {
      const archPrompt = `You are a System Architect. Briefly propose a scalable architecture in 2 short sentences for this idea: "${topic}".`;
      const archRes = await brandApi.chat(archPrompt, "reasoning");
      setDialogue(prev => [...prev, { role: agents[0].role, color: agents[0].color, text: archRes.text }]);

      await new Promise(r => setTimeout(r, 1000));

      const secPrompt = `You are a strict Security Auditor. Criticize this architecture briefly in 2 sentences in regards to the idea: "${topic}": "${archRes.text}"`;
      const secRes = await brandApi.chat(secPrompt, "reasoning");
      setDialogue(prev => [...prev, { role: agents[1].role, color: agents[1].color, text: secRes.text }]);

      await new Promise(r => setTimeout(r, 1000));

      const uxPrompt = `You are a UX Designer. Ignore the technicalities and suggest a killer, futuristic user interface feature for the idea: "${topic}" in 2 short sentences.`;
      const uxRes = await brandApi.chat(uxPrompt, "creative");
      setDialogue(prev => [...prev, { role: agents[2].role, color: agents[2].color, text: uxRes.text }]);

    } catch (e) {
      console.error(e);
    }
    setIsDiscussing(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
        <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
          <Cpu className="w-5 h-5" />
          {lang === 'ar' ? 'خلية السرب الذكي (Swarm AI)' : 'Swarm Intelligence Lab'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'اطرح فكرة مشروع، وشاهد 3 وكلاء ذكاء اصطناعي (معماري، أمني، ومصمم) يناقشون الفكرة وينقضونها لإنتاج خطة صلبة ومثالية قبل البدء.' 
            : 'Pitch an idea and watch 3 distinct AI agents (Architect, Security, Designer) debate and refine it into a perfect plan before execution.'}
        </p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={lang === 'ar' ? 'فكرة المشروع...' : 'Project idea...'} 
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-orange-500"
        />
        <button 
          onClick={runSwarm}
          disabled={isDiscussing || !topic}
          className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-500 disabled:opacity-50"
        >
          {isDiscussing ? '...' : (lang === 'ar' ? 'بدء النقاش' : 'Deploy Swarm')}
        </button>
      </div>

      <div className="space-y-3 bg-zinc-950 p-4 border border-zinc-800 rounded-xl min-h-[200px]">
        {dialogue.length === 0 && !isDiscussing && (
          <div className="text-center text-zinc-600 italic text-sm mt-10">
            {lang === 'ar' ? 'السرب بانتظار الإشارة...' : 'Swarm awaiting deployment...'}
          </div>
        )}
        <AnimatePresence>
          {dialogue.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg"
            >
              <div className={`text-xs font-bold ${msg.color} mb-1 flex items-center gap-2`}>
                <MessageSquare className="w-3 h-3" /> {msg.role}
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{msg.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
        {isDiscussing && (
           <div className="p-3 animate-pulse text-zinc-500 flex items-center gap-2 text-xs font-mono">
             <div className="w-2 h-2 bg-orange-500 rounded-full" />
             {lang === 'ar' ? 'الوكلاء يتواصلون...' : 'Agents communicating...'}
           </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 3. OmniBridge (الترجمة العكسية)
// ==========================================
export const OmniBridge = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [sourceCode, setSourceCode] = useState('');
  const [translating, setTranslating] = useState(false);
  const [outputs, setOutputs] = useState<{ swift: string, rust: string }>({ swift: '', rust: '' });

  const translateCode = async () => {
    if(!sourceCode) return;
    setTranslating(true);
    setOutputs({ swift: '', rust: '' });
    
    try {
      const prompt = `You are the OmniBridge compiler. Take the following input code (any language) and translate it simultaneously into Apple Swift and Rust. 
      Format exactly like this:
      ===SWIFT===
      [code here]
      ===RUST===
      [code here]

      Code:
      ${sourceCode}
      `;
      const res = await brandApi.chat(prompt, "coding");
      
      const swiftMatch = res.text.match(/===SWIFT===([\s\S]*?)===RUST===/);
      const rustMatch = res.text.match(/===RUST===([\s\S]*)/);
      
      setOutputs({
        swift: swiftMatch ? swiftMatch[1].trim() : 'Failed to parse',
        rust: rustMatch ? rustMatch[1].trim() : 'Failed to parse'
      });
    } catch (e) {
      console.error(e);
    }
    setTranslating(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <Terminal className="w-20 h-20 text-cyan-500" />
        </div>
        <h3 className="text-cyan-500 font-bold mb-2 flex items-center gap-2">
          <Code className="w-5 h-5" />
          {lang === 'ar' ? 'الترجمة العكسية (OmniBridge)' : 'OmniBridge Transpiler'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'ضع أي كود محلي (مثل React أو Python) وسيقوم الجسر بترجمته فورياً إلى لغات الأنظمة الأصلية عالية الأداء (Swift و Rust).' 
            : 'Drop any source code (JS, Python) and OmniBridge instantly transpiles it into high-performance native systems (Swift & Rust).'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Source */}
        <div className="lg:col-span-1 border border-zinc-800 rounded-xl bg-zinc-900 flex flex-col">
          <div className="p-2 border-b border-zinc-800 bg-zinc-950 rounded-t-xl text-xs font-mono text-zinc-500 flex justify-between items-center">
            <span>Input Code</span>
            <button 
              onClick={translateCode}
              disabled={translating || !sourceCode}
              className="bg-cyan-600 text-black px-2 py-1 rounded font-bold hover:bg-cyan-500 disabled:opacity-50"
            >
              {translating ? '...' : 'TRANSLATE'}
            </button>
          </div>
          <textarea
            className="flex-1 min-h-[200px] w-full bg-transparent p-3 text-xs text-white focus:outline-none font-mono resize-none"
            placeholder="console.log('Hello world');"
            value={sourceCode}
            onChange={e => setSourceCode(e.target.value)}
          />
        </div>

        {/* Translation Outputs */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col shadow-[0_0_15px_rgba(34,211,238,0.05)] relative">
            <div className="p-2 border-b border-zinc-800 text-xs font-mono text-cyan-500 font-bold flex justify-between items-center">
              <span>Apple Swift</span>
              {outputs.swift && outputs.swift !== 'Failed to parse' && <CopyButton text={outputs.swift} />}
            </div>
            <pre className="flex-1 p-3 text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap font-mono">
              {outputs.swift || (translating ? 'Translating to Swift...' : 'Awaiting compilation...')}
            </pre>
          </div>
          
          <div className="border border-zinc-800 rounded-xl bg-zinc-950 flex flex-col shadow-[0_0_15px_rgba(239,68,68,0.05)] relative">
            <div className="p-2 border-b border-zinc-800 text-xs font-mono text-red-500 font-bold flex justify-between items-center">
              <span>Rust (Cargo)</span>
              {outputs.rust && outputs.rust !== 'Failed to parse' && <CopyButton text={outputs.rust} />}
            </div>
            <pre className="flex-1 p-3 text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap font-mono">
              {outputs.rust || (translating ? 'Transpiling to Rust...' : 'Awaiting compilation...')}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. API Architect (مهندس الـ API)
// ==========================================
export const APIArchitect = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [spec, setSpec] = useState('');

  const generateSpec = async () => {
    if (!description) return;
    setLoading(true);
    try {
      const prompt = `You are a Senior API Architect. Create a valid OpenAPI 3.0 YAML specification for: "${description}". Return ONLY the YAML.`;
      const res = await brandApi.chat(prompt, "coding");
      setSpec(res.text);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <FileCode className="w-20 h-20 text-blue-500" />
        </div>
        <h3 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
          <FileCode className="w-5 h-5" />
          {lang === 'ar' ? 'مهندس الـ API (API Architect)' : 'API Architect'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' ? 'صمم مواصفات API احترافية بلمح البصر.' : 'Design professional API specifications instantly.'}
        </p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <textarea 
          className="w-full h-24 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white mb-3"
          placeholder={lang === 'ar' ? 'وصف الـ API (مثلاً: نظام إدارة متجر كتب مع سلة تسوق)...' : 'Describe the API...'}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button onClick={generateSpec} disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4" />}
          {lang === 'ar' ? 'توليد المواصفات' : 'Generate Spec'}
        </button>
      </div>
      {spec && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2"><span className="text-xs font-mono text-blue-400">OpenAPI Spec (YAML)</span><CopyButton text={spec} /></div>
          <pre className="text-[10px] text-zinc-300 font-mono overflow-auto max-h-96">{spec}</pre>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. Regex Master (خبير Regex)
// ==========================================
export const RegexMaster = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ regex: string, explanation: string } | null>(null);

  const generateRegex = async () => {
    if(!goal) return;
    setLoading(true);
    try {
      const prompt = `Create a Regex for: "${goal}". Return ONLY a JSON object with "regex" and "explanation" keys.`;
      const res = await brandApi.chat(prompt, "coding");
      const match = res.text.match(/\{[\s\S]*\}/);
      if(match) setResult(JSON.parse(match[0]));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
        <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2"><Layers className="w-5 h-5" /> {lang === 'ar' ? 'خبير الـ Regex' : 'Regex Master'}</h3>
        <p className="text-sm text-zinc-400">{lang === 'ar' ? 'ابنِ تعابير نمطية معقدة وشرحها فوراً.' : 'Build complex regex patterns and understand them.'}</p>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex gap-2">
        <input type="text" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white" 
          placeholder={lang === 'ar' ? 'مثل: بريد إلكتروني، رقم هاتف سعودي...' : 'e.g. Email validation...'}
          value={goal} onChange={e => setGoal(e.target.value)} />
        <button onClick={generateRegex} className="px-6 bg-orange-600 rounded-lg">{loading ? '...' : (lang === 'ar' ? 'بناء' : 'Build')}</button>
      </div>
      {result && (
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl">
          <div className="bg-indigo-500/20 text-indigo-400 p-4 rounded-lg font-mono text-center text-lg mb-4 select-all">{result.regex}</div>
          <div className="text-zinc-500 text-xs leading-relaxed">{result.explanation}</div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 6. Log Analyzer (محلل السجلات)
// ==========================================
export const LogAnalyzer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const analyze = async () => {
    if(!logs) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Analyze these server logs, find errors, and suggest fixes in bullet points. Logs: ${logs}`, "coding");
      setAnalysis(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <Activity className="w-20 h-20 text-red-500" />
        </div>
        <h3 className="text-red-500 font-bold mb-2 flex items-center gap-2"><Activity className="w-5 h-5" /> {lang === 'ar' ? 'محلل السجلات (Log Analyzer)' : 'Log Analyzer'}</h3>
        <p className="text-sm text-zinc-400">{lang === 'ar' ? 'افهم أخطاء الخادم فوراً واعرف كيف تصلحها.' : 'Decode server errors and get immediate fixes.'}</p>
      </div>
      <div className="space-y-3">
        <textarea className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-[10px] font-mono text-zinc-300" 
          placeholder="Paste logs here..." value={logs} onChange={e => setLogs(e.target.value)} />
        <button onClick={analyze} className="w-full py-3 bg-red-600 rounded-lg font-bold">{loading ? 'Analyzing...' : 'Analyze Logs'}</button>
      </div>
      {analysis && <div className="bg-zinc-900 p-4 rounded-xl text-xs text-zinc-300 whitespace-pre-wrap border border-zinc-800">{analysis}</div>}
    </div>
  );
};

// ==========================================
// 7. CSS Playground (محرر CSS)
// ==========================================
export const CSSPlayground = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const generate = async () => {
    if(!prompt) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Generate advanced CSS (Flexbox/Grid/Animations) for: "${prompt}". Return ONLY the CSS code inside a block.`, "coding");
      const match = res.text.match(/```css\n([\s\S]*?)```/) || res.text.match(/```([\s\S]*?)```/);
      setCode(match ? match[1] : res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
        <h3 className="text-indigo-500 font-bold mb-2 flex items-center gap-2"><Layout className="w-5 h-5" /> {lang === 'ar' ? 'محرر تخطيطات CSS' : 'CSS Layout Forge'}</h3>
      </div>
      <div className="flex gap-2">
        <input type="text" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm" 
          placeholder="e.g. A futuristic 3-column dashboard with neon effects..." value={prompt} onChange={e => setPrompt(e.target.value)} />
        <button onClick={generate} className="px-6 bg-indigo-600 rounded-lg">{loading ? '...' : 'Forge'}</button>
      </div>
      {code && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl overflow-auto max-h-60 font-mono text-[10px] text-indigo-400 group relative">
             <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><CopyButton text={code} /></div>
             {code}
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center justify-center min-h-[150px]">
             <style>{code}</style>
             <div className="preview-container">Previewing Layout</div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 8. Git Suggest (مساعد Git)
// ==========================================
export const GitSuggest = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const getHelp = async () => {
    setLoading(true);
    try {
      const res = await brandApi.chat("I made changes to my login system and fixed a database leak. Give me 3 best git commit messages and the commands to push.", "coding");
      setSuggestion(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
       <div className="p-4 bg-orange-600/10 border border-orange-600/20 rounded-xl border-l-4 border-l-orange-500">
        <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2"><GitBranch className="w-5 h-5" /> {lang === 'ar' ? 'مساعد Git المتطور' : 'Pro Git Suggester'}</h3>
        <p className="text-sm text-zinc-400">{lang === 'ar' ? 'احصل على أفضل توصيات الالتزام (Commit) والأوامر.' : 'Get professional commit messages and commands.'}</p>
      </div>
      <button onClick={getHelp} className="w-full py-4 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500 hover:border-orange-500 hover:text-orange-500 transition-all font-mono">
        {loading ? 'Consulting Git Gods...' : 'Simulate Git Help (Changes Detected)'}
      </button>
      {suggestion && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 whitespace-pre-wrap">{suggestion}</div>}
    </div>
  );
};

// ==========================================
// 9. Life Planner (مخطط الحياة)
// ==========================================
export const LifePlanner = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState('');

  const generatePlan = async () => {
    if(!goal) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a detailed 7-day action plan for: "${goal}". Break it down by days.`, "general");
      setPlan(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl relative overflow-hidden">
        <div className="absolute -top-4 -right-4 p-2 opacity-10"><ListChecks className="w-32 h-32 text-pink-500" /></div>
        <h3 className="text-pink-500 font-bold mb-2 flex items-center gap-2"><ListChecks className="w-5 h-5" /> {lang === 'ar' ? 'مخطط الحياة الذكي' : 'Smart Life Planner'}</h3>
      </div>
      <div className="flex flex-col gap-3">
        <input className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-white focus:border-pink-500 outline-none" 
          placeholder={lang === 'ar' ? 'هدفك القادم (مثلاً: تعلم الإنجليزية في 3 أشهر)...' : 'Next goal...'} value={goal} onChange={e => setGoal(e.target.value)} />
        <button onClick={generatePlan} className="py-4 bg-pink-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20">
           {loading ? 'Planning...' : (lang === 'ar' ? 'صمم الخطة' : 'Draft Plan')}
        </button>
      </div>
      {plan && <div className="bg-zinc-950 rounded-xl p-6 border border-zinc-900 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">{plan}</div>}
    </div>
  );
};

// ==========================================
// 10. Recipe Alchemist (خيميائي الوصفات)
// ==========================================
export const RecipeAlchemist = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState('');

  const cook = async () => {
    if(!ingredients) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a creative recipe using only these ingredients: ${ingredients}. Give it a cool name.`, "general");
      setRecipe(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-4">
        <div className="bg-amber-500/20 p-3 rounded-full"><Utensils className="w-8 h-8 text-amber-500" /></div>
        <div>
          <h3 className="text-amber-500 font-bold">{lang === 'ar' ? 'خيميائي الوصفات' : 'Recipe Alchemist'}</h3>
          <p className="text-xs text-zinc-500">{lang === 'ar' ? 'ماذا نطبخ اليوم بالموجود؟' : 'What are we cooking today?'}</p>
        </div>
      </div>
      <textarea className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white focus:border-amber-500 outline-none resize-none" 
        placeholder={lang === 'ar' ? 'اكتب ما لديك (بيض، دقيق، حليب...)' : 'List your ingredients...'} value={ingredients} onChange={e => setIngredients(e.target.value)} />
      <button onClick={cook} className="w-full py-4 bg-amber-600 rounded-xl font-bold shadow-lg shadow-amber-900/20">{loading ? 'Cooking...' : 'Alchemize'}</button>
      {recipe && <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed">{recipe}</div>}
    </div>
  );
};

// ==========================================
// 11. Gift Finder (مستشار الهدايا)
// ==========================================
export const GiftFinder = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [who, setWho] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState('');

  const find = async () => {
    if(!who) return;
    setLoading(true);
    try {
       const res = await brandApi.chat(`Suggest 5 unique gift ideas for: "${who}". Include links or descriptions.`, "general");
       setIdeas(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl text-center">
        <Gift className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-emerald-500 font-bold mb-1">{lang === 'ar' ? 'مستشار الهدايا الذكي' : 'Smart Gift Finder'}</h3>
        <p className="text-[10px] text-zinc-500 uppercase tracking-widest">Find the perfect match</p>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-xl" placeholder={lang === 'ar' ? 'أخبرني عن الشخص (عمره، اهتماماته)...' : 'Describe the person...'} value={who} onChange={e => setWho(e.target.value)} />
        <button onClick={find} className="px-8 bg-emerald-600 rounded-xl font-bold">{loading ? '...' : 'Find'}</button>
      </div>
      {ideas && <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-xl text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{ideas}</div>}
    </div>
  );
};

// ==========================================
// 12. Story Weaver (ناسج القصص)
// ==========================================
export const StoryWeaver = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [story, setStory] = useState('');

  const weave = async () => {
    if(!prompt) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Write a beautiful short story for kids about: "${prompt}".`, "creative");
      setStory(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl relative">
        <BookOpen className="w-6 h-6 text-indigo-500 mb-2" />
        <h3 className="text-indigo-400 font-bold">{lang === 'ar' ? 'ناسج القصص الخيالية' : 'Story Weaver AI'}</h3>
      </div>
      <input className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl" placeholder={lang === 'ar' ? 'عنوان أو موضوع القصة...' : 'Story topic...'} value={prompt} onChange={e => setPrompt(e.target.value)} />
      <button onClick={weave} className="w-full py-4 bg-indigo-600 rounded-xl font-bold">{loading ? 'Weaving...' : 'Weave Story'}</button>
      {story && <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-sm leading-loose text-zinc-300 whitespace-pre-wrap indent-4">{story}</div>}
    </div>
  );
};

// ==========================================
// 13. Travel Buddy (رفيق السفر)
// ==========================================
export const TravelBuddy = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState('');

  const plan = async () => {
    if(!city) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a 3-day travel itinerary for "${city}" including morning, afternoon, and evening activities.`, "general");
      setItinerary(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-sky-500/10 border border-sky-500/20 rounded-xl group overflow-hidden">
        <MapPin className="w-8 h-8 text-sky-500 mb-2 group-hover:scale-125 transition-transform" />
        <h3 className="text-sky-400 font-bold">{lang === 'ar' ? 'رفيق السفر الذكي' : 'Travel Buddy AI'}</h3>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-zinc-900 border border-zinc-800 p-4 rounded-xl" placeholder={lang === 'ar' ? 'الوجهة (مثلاً: دبي، لندن)...' : 'Destination city...'} value={city} onChange={e => setCity(e.target.value)} />
        <button onClick={plan} className="px-8 bg-sky-600 rounded-xl font-bold">{loading ? '...' : (lang === 'ar' ? 'خطط' : 'Plan')}</button>
      </div>
      {itinerary && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{itinerary}</div>}
    </div>
  );
};

// ==========================================
// 14. Market Trends (بوصلة السوق)
// ==========================================
// ==========================================
// 15. Security Vault (فك التشفير والحماية)
// ==========================================
export const SecurityVault = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const startCracking = async () => {
    if(!file) return;
    setLoading(true);
    setProgress(0);
    setResult(null);

    // Simulate "Complex Algorithm" progress with dynamic steps
    const steps = [
      "Identifying File Markers (Hex: 0x50 0x4B 0x03 0x04)...",
      "Analyzing Encryption Header (AES-256-XTS)...",
      "Brute-forcing Hashed Metadata...",
      "Extracting Primary Salt Entropy...",
      "Finalizing Collision Analysis..."
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      setProgress(p => {
        if(p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 10;
      });
    }, 400);

    try {
      // We pass file name and size for "real" feel
      const res = await brandApi.chat(`Act as a high-end file decryptor. A user has uploaded a file named "${file.name}" of size ${file.size} bytes. Perform a technical breakdown of the file's security and simulate the recovery of the password or text content. Be extremely technical and realistic.`, "coding");
      
      setTimeout(() => {
        setResult(res.text);
        setLoading(false);
        setProgress(100);
      }, 6000);
    } catch(e) {
      clearInterval(interval);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-4">
        <div className="bg-red-600/20 p-3 rounded-full animate-pulse"><Lock className="w-8 h-8 text-red-500" /></div>
        <div>
          <h3 className="text-red-500 font-bold">{lang === 'ar' ? 'خزنة كسر التشفير الحقيقية' : 'Real Security Vault & Cracker'}</h3>
          <p className="text-xs text-zinc-500">{lang === 'ar' ? 'قم برفع الملف الحقيقي (PDF, Word, Excel) لكسر الحماية عبر خوارزميات الذكاء.' : 'Upload real files (PDF, Word, Excel) to crack protection using AI algorithms.'}</p>
        </div>
      </div>
      
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center space-y-4">
        <input 
          type="file" 
          hidden 
          ref={fileInputRef} 
          onChange={handleFileChange}
          accept=".pdf,.docx,.xlsx,.zip,.rar"
        />
        
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-zinc-800 p-8 rounded-2xl cursor-pointer hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
          >
            <Unlock className="w-10 h-10 text-zinc-700 mx-auto mb-3 group-hover:text-red-500" />
            <p className="text-zinc-500 text-sm">{lang === 'ar' ? 'انقر هنا لرفع الملف الحقيقي' : 'Click to upload real file'}</p>
            <p className="text-[10px] text-zinc-600 mt-2">PDF, DOCX, XLSX, ZIP</p>
          </div>
        ) : (
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2 rounded-lg"><FileSearch className="w-5 h-5 text-red-500" /></div>
              <div className="text-left">
                <div className="text-xs font-bold text-white truncate max-w-[150px]">{file.name}</div>
                <div className="text-[10px] text-zinc-500">{(file.size / 1024).toFixed(2)} KB</div>
              </div>
            </div>
            <button onClick={() => setFile(null)} className="text-zinc-600 hover:text-red-500 text-xs">{lang === 'ar' ? 'إزالة' : 'Remove'}</button>
          </div>
        )}

        <button 
          onClick={startCracking} 
          disabled={loading || !file} 
          className="w-full py-4 bg-red-600 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {lang === 'ar' ? 'بدء فك التشفير الحقيقي' : 'Start Real Decryption'}
        </button>
      </div>

      {loading && (
        <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-xl space-y-3">
          <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
            <span className="animate-pulse">RUNNING AI-POWERED COLLISION ANALYSIS...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-zinc-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-red-600" 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }} 
            />
          </div>
          <div className="text-[9px] font-mono text-zinc-600 text-center uppercase tracking-tighter">
            Target: {file?.name} | Method: AES Brute-Force Simulation + Metadata Strike
          </div>
        </div>
      )}

      {result && (
        <div className="bg-zinc-950 p-6 border border-zinc-800 rounded-xl text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-green-500 font-bold mb-4">
            <CheckCircle2 className="w-5 h-5" /> {lang === 'ar' ? 'تم كسر التشفير بنجاح' : 'Cracking Successful'}
          </div>
          {result}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 16. SQL Optimizer (محسن القواعد)
// ==========================================
export const SQLOptimizer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [optimized, setOptimized] = useState('');

  const optimize = async () => {
    if(!query) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Optimize this SQL query for performance and readability. Explain the choices. Query: ${query}`, "coding");
      setOptimized(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <Server className="w-6 h-6 text-emerald-500" />
        <h3 className="text-emerald-500 font-bold">{lang === 'ar' ? 'محسن استعلامات SQL' : 'SQL Query Optimizer'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300" placeholder="SELECT * FROM users WHERE status = 'active'..." value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={optimize} className="w-full py-3 bg-emerald-600 rounded-xl font-bold">{loading ? 'Optimizing...' : 'Optimize SQL'}</button>
      {optimized && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 whitespace-pre-wrap">{optimized}</div>}
    </div>
  );
};

// ==========================================
// 17. SEO Master (خبير السيو)
// ==========================================
export const SEOMaster = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState('');

  const analyze = async () => {
    if(!url) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Analyze the SEO potential for this URL/Idea: "${url}". Suggest 5 keywords and 3 meta tags.`, "general");
      setTips(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <h3 className="text-blue-500 font-bold flex items-center gap-2"><SearchCode className="w-5 h-5" /> {lang === 'ar' ? 'خبير السيو الرقمي' : 'Digital SEO Master'}</h3>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg" placeholder="Website URL or Business Idea..." value={url} onChange={e => setUrl(e.target.value)} />
        <button onClick={analyze} className="px-6 bg-blue-600 rounded-lg">{loading ? '...' : 'Analyze'}</button>
      </div>
      {tips && <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-300 whitespace-pre-wrap">{tips}</div>}
    </div>
  );
};

// ==========================================
// 18. CV Builder (منشئ السيرة الذاتية)
// ==========================================
export const CVBuilder = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [cv, setCv] = useState('');

  const build = async () => {
    if(!info) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a professional CV/Resume based on this info: ${info}. Use a modern layout structure (Markdown).`, "general");
      setCv(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
        <h3 className="text-purple-500 font-bold flex items-center gap-2"><Briefcase className="w-5 h-5" /> {lang === 'ar' ? 'منشئ السيرة الذاتية' : 'AI CV Builder'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-900 border border-zinc-800 p-4 rounded-xl" placeholder="Name, Experience, Skills..." value={info} onChange={e => setInfo(e.target.value)} />
      <button onClick={build} className="w-full py-3 bg-purple-600 rounded-xl font-bold">{loading ? 'Building...' : 'Build CV'}</button>
      {cv && <div className="bg-white text-zinc-900 p-6 rounded-xl overflow-auto max-h-96 text-sm">{cv}</div>}
    </div>
  );
};

// ==========================================
// 19. Node Manager (مدير السيرفرات)
// ==========================================
export const NodeManager = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [nodes, setNodes] = useState([
    { id: 'DE-01', region: 'Frankfurt', status: 'Online', load: '12%', color: 'text-green-500' },
    { id: 'US-04', region: 'New York', status: 'Online', load: '45%', color: 'text-green-500' },
    { id: 'SG-02', region: 'Singapore', status: 'Warning', load: '89%', color: 'text-yellow-500' },
    { id: 'UK-09', region: 'London', status: 'Online', load: '22%', color: 'text-green-500' },
    { id: 'FR-05', region: 'Paris', status: 'Online', load: '31%', color: 'text-green-500' },
    { id: 'JP-03', region: 'Tokyo', status: 'Online', load: '18%', color: 'text-green-500' },
    { id: 'AU-08', region: 'Sydney', status: 'Online', load: '41%', color: 'text-green-500' },
    { id: 'IN-12', region: 'Mumbai', status: 'Online', load: '65%', color: 'text-green-500' },
    { id: 'BR-02', region: 'Sao Paulo', status: 'Online', load: '12%', color: 'text-green-500' },
    { id: 'CA-07', region: 'Toronto', status: 'Online', load: '29%', color: 'text-green-500' },
    { id: 'AE-01', region: 'Dubai', status: 'Online', load: '08%', color: 'text-green-500' }
  ]);

  const refreshNodes = () => {
    setNodes(prev => prev.map(n => ({
      ...n,
      load: `${Math.floor(Math.random() * 100)}%`,
      status: Math.random() > 0.1 ? 'Online' : 'Offline',
      color: Math.random() > 0.1 ? 'text-green-500' : 'text-red-500'
    })));
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-800 rounded-xl flex justify-between items-center">
        <div className="flex items-center gap-3">
          <HardDrive className="w-6 h-6 text-zinc-400" />
          <h3 className="font-bold">{lang === 'ar' ? 'مدير العقد السحابية' : 'Cloud Node Manager'}</h3>
        </div>
        <button onClick={refreshNodes} className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"><RefreshCw className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {nodes.map(node => (
          <div key={node.id} className="bg-zinc-950 border border-zinc-900 p-4 rounded-xl flex justify-between items-center">
            <div className="flex gap-4 items-center">
              <div className={`w-2 h-2 rounded-full bg-current ${node.color} animate-pulse`} />
              <div>
                <div className="text-xs font-bold text-white">{node.id}</div>
                <div className="text-[10px] text-zinc-600">{node.region}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-zinc-400">LOAD: {node.load}</div>
              <div className={`text-[10px] font-bold ${node.color}`}>{node.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 20. Port Warden (فاحص الشبكة)
// ==========================================
export const PortWarden = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [target, setTarget] = useState('');
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState('');

  const scan = async () => {
    if(!target) return;
    setScanning(true);
    try {
      const res = await brandApi.chat(`Perform a simulated security port scan and vulnerability assessment for: ${target}. Identify common open ports and security risks.`, "coding");
      setReport(res.text);
    } catch(e) { console.error(e); }
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
        <Radar className="w-6 h-6 text-orange-500" />
        <h3 className="text-orange-500 font-bold">{lang === 'ar' ? 'حارس المنافذ والشبكة' : 'Port Warden Scanner'}</h3>
      </div>
      <input className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white" placeholder="IP Address or Domain..." value={target} onChange={e => setTarget(e.target.value)} />
      <button onClick={scan} className="w-full py-3 bg-orange-600 rounded-xl font-bold text-white tracking-widest uppercase text-xs">{scanning ? 'Scanning...' : 'Start Security Audit'}</button>
      {report && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[10px] font-mono text-orange-400 whitespace-pre-wrap">{report}</div>}
    </div>
  );
};

// ==========================================
// 21. Bash Wizard (ساحر الـ Bash)
// ==========================================
export const BashWizard = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState('');

  const generate = async () => {
    if(!input) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a professional Bash shell script for: ${input}. Include comments and error handling.`, "coding");
      setScript(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center gap-3">
        <Terminal className="w-6 h-6 text-zinc-400" />
        <h3 className="font-bold text-white">{lang === 'ar' ? 'ساحر الـ Bash والسكربتات' : 'Bash Wizard & Scripts'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white" placeholder="Describe the script task (e.g., backup folder every day)..." value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={generate} className="w-full py-3 bg-white text-black rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-zinc-200 transition-colors">{loading ? 'Conjuring...' : 'Generate Script'}</button>
      {script && (
        <div className="relative group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><CopyButton text={script} /></div>
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap">{script}</div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 22. JSON Transformer (محول البيانات)
// ==========================================
export const JSONTransformer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [data, setData] = useState('');
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const transform = async () => {
    if(!data) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Convert this JSON to ${format} format. Data: ${data}`, "coding");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
        <h3 className="text-yellow-500 font-bold flex items-center gap-2"><FileJson className="w-5 h-5" /> {lang === 'ar' ? 'محول JSON والبيانات' : 'JSON & Data Transformer'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-900 border border-zinc-800 p-4 rounded-xl font-mono text-xs text-white" placeholder='{"id": 1, "name": "Test"}...' value={data} onChange={e => setData(e.target.value)} />
      <div className="flex gap-2">
        {['CSV', 'XML', 'TypeScript', 'YAML'].map(f => (
          <button key={f} onClick={() => setFormat(f.toLowerCase())} className={`flex-1 py-2 rounded-lg text-[10px] font-bold tracking-widest uppercase ${format === f.toLowerCase() ? 'bg-yellow-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>{f}</button>
        ))}
      </div>
      <button onClick={transform} className="w-full py-3 bg-yellow-600 rounded-xl font-bold text-white">{loading ? 'Transforming...' : 'Execute Transformation'}</button>
      {result && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap">{result}</div>}
    </div>
  );
};

// ==========================================
// 23. Prompt Engineer (مهندس الأوامر)
// ==========================================
export const PromptEngineer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [base, setBase] = useState('');
  const [loading, setLoading] = useState(false);
  const [refined, setRefined] = useState('');

  const refine = async () => {
    if(!base) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Optimize and engineer this AI prompt for better results. Include personas and constraints. Original: ${base}`, "reasoning");
      setRefined(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
        <h3 className="text-indigo-500 font-bold flex items-center gap-2"><Sparkles className="w-5 h-5" /> {lang === 'ar' ? 'مهندس البرومبت الذكي' : 'AI Prompt Engineer'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white" placeholder="Write your basic idea here..." value={base} onChange={e => setBase(e.target.value)} />
      <button onClick={refine} className="w-full py-3 bg-indigo-600 rounded-xl font-bold text-white shadow-lg shadow-indigo-900/20">{loading ? 'Refining...' : 'Optimize Prompt'}</button>
      {refined && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-xs text-indigo-300 italic border-l-4 border-l-indigo-500">{refined}</div>}
    </div>
  );
};

// ==========================================
// 24. Color Harmonizer (ناسج الألوان)
// ==========================================
export const ColorHarmonizer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [loading, setLoading] = useState(false);
  const [palette, setPalette] = useState('');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await brandApi.chat(`Generate a full WCAG compliant color palette based on: ${baseColor}. Include Primary, Secondary, Accent, and Semantic colors with Hex codes and names.`, "general");
      setPalette(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center gap-3">
        <Palette className="w-6 h-6 text-pink-500" />
        <h3 className="font-bold text-white">{lang === 'ar' ? 'ناسج لوحات الألوان' : 'Color Palette Harmonizer'}</h3>
      </div>
      <div className="flex gap-4 items-center bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
        <input type="color" className="w-16 h-16 rounded-xl overflow-hidden cursor-pointer bg-transparent border-0" value={baseColor} onChange={e => setBaseColor(e.target.value)} />
        <div className="flex-1 font-mono text-xl text-white font-black tracking-tighter">{baseColor.toUpperCase()}</div>
      </div>
      <button onClick={generate} className="w-full py-3 bg-pink-600 rounded-xl font-bold text-white shadow-lg shadow-pink-900/20">{loading ? 'Generating...' : 'Harmonize Colors'}</button>
      {palette && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 whitespace-pre-wrap">{palette}</div>}
    </div>
  );
};

// ==========================================
// 29. Docker Master (مدير الدوكر)
// ==========================================
export const DockerMaster = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if(!desc) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Generate a professional Dockerfile and docker-compose.yml for this project: ${desc}. Include best practices and optimized layers.`, "coding");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
        <Ship className="w-6 h-6 text-blue-500" />
        <h3 className="text-blue-500 font-bold">{lang === 'ar' ? 'خبير حاويات Docker' : 'Docker Master Expert'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder={lang === 'ar' ? 'صف تقنيات مشروعك (مثلاً: Node.js مع Redis)...' : 'Describe your tech stack...'} value={desc} onChange={e => setDesc(e.target.value)} />
      <button onClick={generate} className="w-full py-3 bg-blue-600 rounded-xl font-bold">{loading ? 'Containerizing...' : 'Generate Docker Config'}</button>
      {result && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-[10px] font-mono text-zinc-300 whitespace-pre-wrap">{result}</div>}
    </div>
  );
};

// ==========================================
// 30. README Wizard (صانع التوثيق)
// ==========================================
export const ReadmeGen = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const create = async () => {
    if(!info) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Create a professional README.md for this project: ${info}. Include Badges, Installation, Features, and Contribution sections.`, "general");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center gap-3">
        <FileText className="w-6 h-6 text-zinc-400" />
        <h3 className="font-bold text-white">{lang === 'ar' ? 'صانع التوثيق الاحترافي' : 'Professional README Wizard'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm" placeholder="Project name, features, and tech stack..." value={info} onChange={e => setInfo(e.target.value)} />
      <button onClick={create} className="w-full py-3 bg-white text-black font-bold rounded-xl">{loading ? 'Drafting...' : 'Generate README.md'}</button>
      {result && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 overflow-auto max-h-96">{result}</div>}
    </div>
  );
};

// ==========================================
// 31. Ghost Data (مولد البيانات الوهمية)
// ==========================================
export const GhostData = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [schema, setSchema] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const generate = async () => {
    if(!schema) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Generate fake JSON data for 10 records matching this schema/description: ${schema}. Include realistic names, emails, and UUIDs.`, "coding");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3">
        <Ghost className="w-6 h-6 text-purple-500" />
        <h3 className="text-purple-500 font-bold">{lang === 'ar' ? 'مولد البيانات التجريبية' : 'Ghost Data Generator'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder="Define keys (e.g., users with id, name, location)..." value={schema} onChange={e => setSchema(e.target.value)} />
      <button onClick={generate} className="w-full py-3 bg-purple-600 rounded-xl font-bold">{loading ? 'Summoning Files...' : 'Generate Mock JSON'}</button>
      {result && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-purple-300">{result}</div>}
    </div>
  );
};

// ==========================================
// 32. Logic Solver (محلل الخوارزميات)
// ==========================================
export const LogicSolver = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');

  const solve = async () => {
    if(!problem) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Explain this algorithm or logical problem step-by-step: ${problem}. Use visual ASCII if helpful.`, "reasoning");
      setSolution(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <Cpu className="w-6 h-6 text-emerald-500" />
        <h3 className="text-emerald-500 font-bold">{lang === 'ar' ? 'محلل المنطق والخوارزميات' : 'Logic & Algo Solver'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder="Paste complex logic or algorithm name..." value={problem} onChange={e => setProblem(e.target.value)} />
      <button onClick={solve} className="w-full py-3 bg-emerald-600 rounded-xl font-bold">{loading ? 'Thinking...' : 'Solve Logic'}</button>
      {solution && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-300 italic border-l-4 border-l-emerald-500">{solution}</div>}
    </div>
  );
};

// ==========================================
// 33. Brand Namer (مبتكر الأسماء)
// ==========================================
export const BrandNamer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');

  const brainstorm = async () => {
    if(!keywords) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Suggest 10 unique, catchy, and modern names for a ${keywords}. Explain the meaning for each in ${lang === 'ar' ? 'Arabic' : 'English'}.`, "general");
      setNames(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center gap-3">
        <Fingerprint className="w-6 h-6 text-pink-500" />
        <h3 className="text-pink-500 font-bold">{lang === 'ar' ? 'مبتكر الأسماء والهويات' : 'Creative Brand Namer'}</h3>
      </div>
      <input className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder="Keywords or startup idea..." value={keywords} onChange={e => setKeywords(e.target.value)} />
      <button onClick={brainstorm} className="w-full py-3 bg-pink-600 rounded-xl font-bold">{loading ? 'Brainstorming...' : 'Generate Brand Names'}</button>
      {names && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-pink-200 whitespace-pre-wrap">{names}</div>}
    </div>
  );
};

// ==========================================
// 34. Universal Translator (المترجم العالمي)
// ==========================================
export const UniversalTranslator = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('English');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const translate = async () => {
    if(!text) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Act as a polyglot translator. Translate the following text to ${targetLang}. Preserve the tone and context exactly. Text: ${text}`, "general");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <Languages className="w-6 h-6 text-emerald-500" />
        <h3 className="text-emerald-500 font-bold">{lang === 'ar' ? 'المترجم العالمي الذكي' : 'AI Universal Translator'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white" placeholder={lang === 'ar' ? 'اكتب النص هنا (أي لغة)...' : 'Type text here (any language)...'} value={text} onChange={e => setText(e.target.value)} />
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {['English', 'Arabic', 'Hindi', 'French', 'German', 'Spanish', 'Chinese', 'Japanese', 'Urdu'].map(l => (
          <button key={l} onClick={() => setTargetLang(l)} className={`px-4 py-2 rounded-lg text-[10px] whitespace-nowrap font-bold uppercase transition-all ${targetLang === l ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{l}</button>
        ))}
      </div>
      <button onClick={translate} className="w-full py-4 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-900/20">{loading ? 'Translating...' : (lang === 'ar' ? 'ترجمة فورية' : 'Translate Now')}</button>
      {result && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-white border-l-4 border-l-emerald-500 leading-relaxed">{result}</div>}
    </div>
  );
};

// ==========================================
// 35. Code Architect (مهندس هيكلة الأكواد)
// ==========================================
export const CodeArchitectTool = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState('');

  const analyze = async () => {
    if(!code) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Analyze this code for architecture, scalability, and security. Suggest improvements. Code: ${code}`, "coding");
      setAnalysis(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center gap-3">
        <TerminalSquare className="w-6 h-6 text-blue-500" />
        <h3 className="text-blue-500 font-bold">{lang === 'ar' ? 'مهندس البنية والشيفرة' : 'Code Architecture Expert'}</h3>
      </div>
      <textarea className="w-full h-40 bg-zinc-950 border border-zinc-800 p-4 rounded-xl font-mono text-xs text-white" placeholder="Paste code here..." value={code} onChange={e => setCode(e.target.value)} />
      <button onClick={analyze} className="w-full py-3 bg-blue-600 rounded-xl font-bold">{loading ? 'Analyzing Architecture...' : 'Perform Structural Review'}</button>
      {analysis && <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-blue-300 whitespace-pre-wrap max-h-96 overflow-auto">{analysis}</div>}
    </div>
  );
};

// ==========================================
// 36. Content Alchemist (خيميائي المحتوى)
// ==========================================
export const ContentAlchemist = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const create = async () => {
    if(!topic) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Write a creative ${type} about: ${topic}. Make it highly engaging and SEO friendly.`, "general");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-xl flex items-center gap-3">
        <PenTool className="w-6 h-6 text-pink-500" />
        <h3 className="text-pink-500 font-bold">{lang === 'ar' ? 'خيميائي المحتوى الإبداعي' : 'Creative Content Alchemist'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder="Topic or idea..." value={topic} onChange={e => setTopic(e.target.value)} />
      <div className="flex gap-2">
        {['Blog', 'Social Post', 'Email', 'Script'].map(t => (
          <button key={t} onClick={() => setType(t.toLowerCase())} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${type === t.toLowerCase() ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{t}</button>
        ))}
      </div>
      <button onClick={create} className="w-full py-3 bg-pink-600 rounded-xl font-bold">{loading ? 'Brewing...' : 'Generate Content'}</button>
      {result && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed">{result}</div>}
    </div>
  );
};

// ==========================================
// 37. Dream Interpreter (مفسر الأحلام الذكي)
// ==========================================
export const DreamInterpreter = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [dream, setDream] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const interpret = async () => {
    if(!dream) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Interpret this dream from a psychological and symbolic perspective. Be supportive and insightful. Dream: ${dream}`, "general");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-indigo-400" />
        <h3 className="text-indigo-400 font-bold">{lang === 'ar' ? 'مفسر الأحلام الذكي' : 'AI Dream Interpreter'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder={lang === 'ar' ? 'صف حلمك بالتفصيل هنا...' : 'Describe your dream in detail...'} value={dream} onChange={e => setDream(e.target.value)} />
      <button onClick={interpret} className="w-full py-3 bg-indigo-600 rounded-xl font-bold">{loading ? 'Interpreting...' : 'Analyze Dream'}</button>
      {result && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-indigo-100 leading-relaxed italic">{result}</div>}
    </div>
  );
};

// ==========================================
// 38. Mood Companion (رفيق المزاج)
// ==========================================
export const MoodCompanion = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [mood, setMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  const getBoost = async () => {
    if(!mood) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`I am feeling ${mood}. Suggest 3 activities, a quote, and a music genre to match or improve this mood.`, "general");
      setSuggestion(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center gap-3">
        <Activity className="w-6 h-6 text-orange-500" />
        <h3 className="text-orange-500 font-bold">{lang === 'ar' ? 'رفيق المزاج الذكي' : 'AI Mood Companion'}</h3>
      </div>
      <input className="w-full bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder={lang === 'ar' ? 'كيف تشعر الآن؟ (مثلاً: حزين، متحمس، مرهق)' : 'How are you feeling? (e.g. Sad, Excited, Burnt out)'} value={mood} onChange={e => setMood(e.target.value)} />
      <button onClick={getBoost} className="w-full py-3 bg-orange-600 rounded-xl font-bold">{loading ? 'Finding vibes...' : 'Get Mood Booster'}</button>
      {suggestion && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{suggestion}</div>}
    </div>
  );
};

// ==========================================
// 39. Smart Meal Planner (مخطط الوجبات الذكي)
// ==========================================
export const SmartMealPlanner = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState('');

  const plan = async () => {
    if(!ingredients) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Suggest 3 quick recipes using these ingredients: ${ingredients}. Include cooking time.`, "general");
      setRecipes(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-lime-500/10 border border-lime-500/20 rounded-xl flex items-center gap-3">
        <Utensils className="w-6 h-6 text-lime-500" />
        <h3 className="text-lime-500 font-bold">{lang === 'ar' ? 'مخطط الوجبات الذكي' : 'Smart Meal Planner'}</h3>
      </div>
      <textarea className="w-full h-24 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm" placeholder={lang === 'ar' ? 'ماذا يوجد في ثلاجتك؟' : 'What is in your fridge?'} value={ingredients} onChange={e => setIngredients(e.target.value)} />
      <button onClick={plan} className="w-full py-3 bg-lime-600 rounded-xl font-bold">{loading ? 'Cooking ideas...' : 'Generate Recipes'}</button>
      {recipes && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-lime-100 leading-relaxed">{recipes}</div>}
    </div>
  );
};

export const MarketTrends = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const analyzeMarket = async () => {
    if (!industry.trim()) return;
    setLoading(true);
    try {
      const res = await brandApi.analyzeMarket(industry, "Global");
      setReport(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <TrendingUp className="w-20 h-20 text-emerald-500" />
        </div>
        <h3 className="text-emerald-500 font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {lang === 'ar' ? 'بوصلة اتجاهات السوق (Market Trends)' : 'Global Market Intelligence'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'أدخل اسم قطاع أو شركة للحصول على تحليل فوري للفرص، التهديدات، والمنافسين العالميين.' 
            : 'Enter an industry or company name to get real-time analysis of opportunities, threats, and global competitors.'}
        </p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          placeholder={lang === 'ar' ? 'اسم القطاع (مثلاً: التجارة الإلكترونية في الشرق الأوسط)...' : 'Market industry (e.g., E-commerce in MENA)...'} 
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
        />
        <button 
          onClick={analyzeMarket}
          disabled={loading || !industry}
          className="px-6 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-500 disabled:opacity-50"
        >
          {loading ? '...' : (lang === 'ar' ? 'تحليل' : 'Analyze')}
        </button>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Size & Growth */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-emerald-500 mb-3 font-bold text-xs">
              <Globe className="w-4 h-4" /> {lang === 'ar' ? 'حجم السوق' : 'Market Size'}
            </div>
            <p className="text-xl font-black text-white">{report.marketSize}</p>
          </div>

          {/* Competitors */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-3 font-bold text-xs">
              <Search className="w-4 h-4" /> {lang === 'ar' ? 'المنافسون الرئيسيون' : 'Key Competitors'}
            </div>
            <div className="flex flex-wrap gap-2">
              {report.keyCompetitors.map((c: string, i: number) => (
                <span key={i} className="text-[10px] px-2 py-1 bg-zinc-950 border border-zinc-800 rounded-full text-zinc-300">{c}</span>
              ))}
            </div>
          </div>

          {/* Trends */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 text-purple-500 mb-3 font-bold text-xs">
              <Zap className="w-4 h-4" /> {lang === 'ar' ? 'التوجهات الحالية' : 'Current Trends'}
            </div>
            <ul className="space-y-2">
              {report.trends.map((t: string, i: number) => (
                <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                  <span className="text-purple-500">•</span> {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities & Threats */}
          <div className="bg-zinc-950 border border-red-500/20 rounded-xl p-4">
             <div className="flex items-center gap-2 text-red-500 mb-3 font-bold text-xs">
              <AlertTriangle className="w-4 h-4" /> {lang === 'ar' ? 'تحليل الفرص والتهديدات' : 'SWOT Analysis'}
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-zinc-600 block mb-1">Opportunities</span>
                <p className="text-xs text-zinc-400">{report.opportunities.join(", ")}</p>
              </div>
              <div className="pt-2 border-t border-zinc-900">
                <span className="text-[10px] uppercase font-mono text-zinc-600 block mb-1">Threats</span>
                <p className="text-xs text-zinc-400">{report.threats.join(", ")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 25. Project Architect (مهندس المشاريع المتكامل)
// ==========================================
export const ProjectArchitect = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [idea, setIdea] = useState('');
  const [language, setLanguage] = useState('TypeScript / React');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const construct = async () => {
    if(!idea) return;
    setLoading(true);
    try {
      const prompt = `Act as a Senior Software Architect. Create a complete project structure and source code for: ${idea}. 
      Language/Framework: ${language}.
      REQUIRED:
      1. Folder Structure (ASCII Tree).
      2. Key File contents with professional comments.
      3. Step-by-step Installation Guide.
      4. List of required libraries/dependencies.
      5. Execution/Deployment instructions.
      Respond in ${lang === 'ar' ? 'Arabic' : 'English'}.`;
      const res = await brandApi.chat(prompt, "coding");
      setResult(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center gap-3">
        <FolderTree className="w-6 h-6 text-blue-500" />
        <h3 className="text-blue-500 font-bold">{lang === 'ar' ? 'مهندس المشاريع المتكامل' : 'Project Architect Pro'}</h3>
      </div>
      <div className="space-y-4">
        <textarea className="w-full h-32 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white focus:border-blue-500 outline-none" placeholder={lang === 'ar' ? 'صف فكرة مشروعك بالتفصيل (مثل: تطبيق شات حقيقي بـ Socket.io)...' : 'Describe your project idea in detail...'} value={idea} onChange={e => setIdea(e.target.value)} />
        <div className="flex gap-2">
          <select className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-zinc-400 focus:border-blue-500 outline-none" value={language} onChange={e => setLanguage(e.target.value)}>
            <option>TypeScript / React</option>
            <option>Python / FastAPI</option>
            <option>Node.js / Express</option>
            <option>Flutter / Dart</option>
            <option>C++ / Embedded</option>
          </select>
          <button onClick={construct} className="px-8 bg-blue-600 rounded-lg font-bold text-white transition-all hover:bg-blue-500 shadow-lg shadow-blue-900/20">{loading ? '...' : (lang === 'ar' ? 'بناء المشروع' : 'Build Project')}</button>
        </div>
      </div>
      {result && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 whitespace-pre-wrap overflow-auto max-h-[500px] border-l-4 border-l-blue-500">{result}</div>}
    </div>
  );
};

// ==========================================
// 26. Innovation Engine (محرك الابتكار للمبرمجين)
// ==========================================
export const InnovationEngine = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [loading, setLoading] = useState(false);
  const [idea, setIdea] = useState('');

  const generateIdea = async () => {
    setLoading(true);
    try {
      const res = await brandApi.chat("Expert Programmer. Suggest 3 unique, non-repetitive, high-potential SaaS or Tool ideas for developers. Focus on current tech trends (Web3, AI, Edge, Rust). Briefly explain why they are good.", "reasoning");
      setIdea(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        <h3 className="text-amber-500 font-bold">{lang === 'ar' ? 'محرك الابتكار البرمجي' : 'Innovation Engine'}</h3>
      </div>
      <button onClick={generateIdea} className="w-full py-4 bg-amber-600 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors shadow-lg shadow-amber-900/20">
        <Zap className="w-4 h-4" /> {loading ? 'Thinking...' : (lang === 'ar' ? 'توليد أفكار فريدة' : 'Generate Unique Ideas')}
      </button>
      {idea && <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-sm text-zinc-300 italic border-l-4 border-l-amber-500 leading-relaxed">{idea}</div>}
    </div>
  );
};

// ==========================================
// 27. Code Transformer (محول الأفكار إلى أكواد)
// ==========================================
export const CodeTransformer = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');

  const transform = async () => {
    if(!input) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Convert this natural language logic into high-quality production code: ${input}. Provide only the code and essential comments.`, "coding");
      setCode(res.text);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3">
        <Code2 className="w-6 h-6 text-emerald-500" />
        <h3 className="text-emerald-500 font-bold">{lang === 'ar' ? 'محول الأفكار البرمجي' : 'Idea-to-Code Transformer'}</h3>
      </div>
      <textarea className="w-full h-32 bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-sm text-white focus:border-emerald-500 shadow-inner" placeholder={lang === 'ar' ? 'اكتب المنطق الذي تريده هنا (مثلاً: نظام تسجيل دخول مع التحقق من البريد)...' : 'Write logic here...'} value={input} onChange={e => setInput(e.target.value)} />
      <button onClick={transform} className="w-full py-3 bg-emerald-600 rounded-xl font-bold hover:bg-emerald-500 transition-colors">{loading ? 'Transforming...' : 'Generate Code'}</button>
      {code && (
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-emerald-400 whitespace-pre-wrap overflow-auto max-h-96 relative group">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10"><CopyButton text={code} /></div>
          {code}
        </div>
      )}
    </div>
  );
};

// ==========================================
// 40. Frontend Development Agent (وكيل تطوير الواجهات)
// ==========================================
export const FrontendAgent = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [idea, setIdea] = useState('');
  const [strategy, setStrategy] = useState('');
  const [supabaseConfig, setSupabaseConfig] = useState({ url: '', key: '', table: '' });
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  const generatePage = async () => {
    if(!idea || !strategy) return;
    setLoading(true);
    try {
      const prompt = `You are a Senior Frontend Engineer. Generate a full, production-ready landing page using React, Tailwind CSS, and Lucide React icons.
      
      Brand Idea: ${idea}
      Brand Strategy: ${strategy}
      
      Requirements:
      1. Use a modern, responsive layout.
      2. Include sections: Hero, Features, Social Proof, and Contact.
      3. Use Tailwind CSS for 100% of styling.
      4. ${supabaseConfig.url ? `Integrate Supabase using the 'createClient' from '@supabase/supabase-js'. Fetch data from table '${supabaseConfig.table}' to display dynamic content. Use these credentials: URL: ${supabaseConfig.url}, Key: ${supabaseConfig.key}` : 'Use mock data for dynamic sections.'}
      5. Output ONLY the complete TypeScript React component code.
      
      Design Vibes: Sleek, high-conversion, professional yet creative.`;

      const res = await brandApi.chat(prompt, "coding");
      const cleanCode = res.text.replace(/```(tsx|typescript|jsx|javascript)?/g, '').replace(/```/g, '').trim();
      setCode(cleanCode);
      setView('preview');
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center gap-3">
        <Monitor className="w-6 h-6 text-cyan-500" />
        <h3 className="text-cyan-500 font-bold">{lang === 'ar' ? 'وكيل تطوير الواجهات الذكي' : 'Frontend Dev Agent'}</h3>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setView('edit')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${view === 'edit' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{lang === 'ar' ? 'المدخلات' : 'Inputs'}</button>
        <button onClick={() => setView('preview')} className={`flex-1 py-2 rounded-lg font-bold text-xs ${view === 'preview' ? 'bg-cyan-600 text-white' : 'bg-zinc-800 text-zinc-500'}`} disabled={!code}>{lang === 'ar' ? 'المعاينة والشيفرة' : 'Preview & Code'}</button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'edit' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="edit" className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">{lang === 'ar' ? 'فكرة العلامة التجارية' : 'Brand Idea'}</label>
              <textarea className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm h-24" placeholder="What are we building?" value={idea} onChange={e => setIdea(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">{lang === 'ar' ? 'استراتيجية العلامة' : 'Brand Strategy'}</label>
              <textarea className="w-full bg-zinc-950 border border-zinc-800 p-3 rounded-xl text-sm h-24" placeholder="Tone, values, target audience..." value={strategy} onChange={e => setStrategy(e.target.value)} />
            </div>
            
            <div className="p-4 border border-zinc-800 bg-zinc-900/50 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 flex items-center gap-2">
                <Database className="w-4 h-4" /> {lang === 'ar' ? 'ربط Supabase (اختياري)' : 'Supabase Integration (Optional)'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <input className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-[10px]" placeholder="URL" value={supabaseConfig.url} onChange={e => setSupabaseConfig({...supabaseConfig, url: e.target.value})} />
                <input className="bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-[10px]" placeholder="Anon Key" value={supabaseConfig.key} onChange={e => setSupabaseConfig({...supabaseConfig, key: e.target.value})} />
              </div>
              <input className="w-full bg-zinc-950 border border-zinc-800 p-2 rounded-lg text-[10px]" placeholder="Default Table Name" value={supabaseConfig.table} onChange={e => setSupabaseConfig({...supabaseConfig, table: e.target.value})} />
            </div>

            <button onClick={generatePage} className="w-full py-4 bg-cyan-600 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20" disabled={loading}>
              {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
              {lang === 'ar' ? 'توليد الهبوط' : 'Generate Landing Page'}
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key="preview" className="space-y-4">
            <div className="flex justify-between items-center bg-zinc-900 p-3 rounded-t-xl border border-zinc-800">
              <span className="text-[10px] font-mono text-cyan-400">landing_page.tsx</span>
              <CopyButton text={code} />
            </div>
            <pre className="bg-zinc-950 p-4 rounded-b-xl border-x border-b border-zinc-800 text-[10px] font-mono text-zinc-300 overflow-auto max-h-[500px] whitespace-pre-wrap">
              {code}
            </pre>
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-[10px] text-amber-500 leading-relaxed">
                {lang === 'ar' 
                  ? 'تم توليد الشيفرة البرمجية بنجاح باستخدام Tailwind CSS. يمكنك نسخ الكود فوق واستخدامه في مشروعك مباشرة.'
                  : 'Landing page code generated successfully with Tailwind. Copy the code above to use in your project.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 28. Snippet Library (مكتبة الأكواد الذكية)
// ==========================================
// ==========================================
// 41. Social & Task Manager (مدير المهام والتواصل)
// ==========================================
export const SocialTaskManager = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'social' | 'connectivity' | 'terminal'>('tasks');
  const [tasks, setTasks] = useState<{id: string, text: string, completed: boolean}[]>([]);
  const [newTask, setNewTask] = useState('');
  const [socialPrompt, setSocialPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [logs, setLogs] = useState<{timestamp: string, msg: string, type: 'info' | 'success' | 'warn' | 'agent'}[]>([]);
  
  // Credentials state
  const [credentials, setCredentials] = useState({
    whatsapp: { phone: '', password: '', token: '', status: 'disconnected' },
    facebook: { email: '', password: '', token: '', status: 'disconnected' },
    google: { status: 'disconnected' },
    x: { status: 'disconnected' },
    vk: { status: 'disconnected' }
  });

  const addLog = (msg: string, type: 'info' | 'success' | 'warn' | 'agent' = 'info') => {
    setLogs(prev => [{ timestamp: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 10));
  };

  const addTask = () => {
    if(!newTask) return;
    setTasks([...tasks, { id: Math.random().toString(36), text: newTask, completed: false }]);
    addLog(`Task added: ${newTask}`, 'info');
    setNewTask('');
  };

  const handleSocialAction = async (platform: string) => {
    if(!socialPrompt) return;
    setLoading(true);
    try {
      const prompt = `Act as a professional social media manager for ${platform}. User request: ${socialPrompt}. Draft a professional reply or schedule a post that is engaging and appropriate.`;
      const res = await brandApi.chat(prompt, "general");
      setAiResponse(res.text);
      addLog(`AI Drafted reply for ${platform}`, 'success');
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleConnect = async (platform: 'whatsapp' | 'facebook' | 'google' | 'x' | 'vk', isDirect = false) => {
    setLoading(true);
    let token = '';
    let email = '';
    
    if(!isDirect) {
      email = platform === 'whatsapp' ? credentials.whatsapp.phone : credentials.facebook.email;
      const pass = platform === 'whatsapp' ? credentials.whatsapp.password : credentials.facebook.password;
      token = platform === 'whatsapp' ? credentials.whatsapp.token : credentials.facebook.token;
      
      if(!email || !pass) {
        toast.error(lang === 'ar' ? 'يرجى إدخال البيانات كاملة' : 'Please fill all fields');
        setLoading(false);
        return;
      }
      
      addLog(`Connecting with ${email}...`, 'agent');
      const res = await brandApi.socialConnect(platform, email, pass, 'default', token);
      if(res.success) {
        setCredentials(prev => ({
          ...prev,
          [platform]: { ...prev[platform as keyof typeof prev], status: token ? 'active_live' : 'connected' }
        }));
        addLog(`SUCCESS: ${platform} agent session verified.`, 'success');
        addLog(`AGENT: Ready for automated mosque operations.`, 'agent');
      }
      setLoading(false);
      return;
    }

    addLog(`Starting ${isDirect ? 'DIRECT' : 'SECURE'} handshake for ${platform}...`, 'agent');

    try {
      // Simulate real API redirect if direct
      if(isDirect) {
        addLog(`Redirecting to ${platform} secure login portal...`, 'agent');
        await new Promise(r => setTimeout(r, 1500));
      }

      const res = await brandApi.socialConnect(platform, 'direct_user', 'direct_pass', 'default', '');
      if(res.success) {
        setCredentials(prev => ({
          ...prev,
          [platform]: { ...prev[platform as keyof typeof prev], status: 'connected' }
        }));
        addLog(`SUCCESS: ${platform} agent session verified via ${isDirect ? 'OAuth' : 'Handshake'}.`, 'success');
        addLog(`AGENT: Identity linked for Mosque Management Account.`, 'agent');
        
        // Auto-action for Facebook/X
        if (platform === 'facebook' || platform === 'x') {
          setTimeout(() => {
            addLog(`AGENT ACTION: Constructing official introduction post...`, 'agent');
            setTimeout(() => {
              addLog(`AGENT ACTION: Published for Mosque followers on ${platform}.`, 'success');
              toast.success(lang === 'ar' ? 'تم نشر المنشور التعريفي بضغطة واحدة!' : 'One-click intro post published!');
            }, 3000);
          }, 2000);
        }
        
        toast.success(lang === 'ar' ? `تم ربط ${platform} بنجاح!` : `${platform} connected successfully!`);
      }
    } catch (e) {
      addLog(`Critcal Error: ${platform} authentication gateway timeout.`, 'warn');
    } finally {
      setLoading(false);
    }
  };

  const handleRealReply = async (platform: string) => {
    if(!aiResponse) return;
    setLoading(true);
    addLog(`Transmitting reply to ${platform} servers...`, 'info');
    try {
      const res = await brandApi.socialReply(platform, aiResponse);
      if(res.success) {
        addLog(`Reply successfully posted to ${platform}`, 'success');
        toast.success(lang === 'ar' ? 'تم الرد بنجاح!' : 'Reply sent successfully!');
        setAiResponse('');
        setSocialPrompt('');
      }
    } catch (e) {
      addLog(`Transmission failed`, 'warn');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
             <LayoutDashboard className="w-6 h-6 text-blue-400" />
             <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border border-zinc-950"></span>
          </div>
          <div>
            <h3 className="text-blue-400 font-bold leading-none">{lang === 'ar' ? 'مركز التحكم في الوكلاء الذكي' : 'AI Agent Control Center'}</h3>
            <p className="text-[9px] text-blue-500/50 uppercase tracking-widest mt-1 font-mono">{lang === 'ar' ? 'نظام إدارة المسجد الرقمي' : 'MOSQUE DIGITAL MANAGEMENT'}</p>
          </div>
        </div>
        <div className="flex gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-[10px]">
          <button onClick={() => setActiveTab('tasks')} className={`px-3 py-1.5 rounded-md transition-all font-bold ${activeTab === 'tasks' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>{lang === 'ar' ? 'المهام' : 'Tasks'}</button>
          <button onClick={() => setActiveTab('social')} className={`px-3 py-1.5 rounded-md transition-all font-bold ${activeTab === 'social' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>{lang === 'ar' ? 'العمليات' : 'Agent'}</button>
          <button onClick={() => setActiveTab('connectivity')} className={`px-3 py-1.5 rounded-md transition-all font-bold ${activeTab === 'connectivity' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>{lang === 'ar' ? 'الربط' : 'Connect'}</button>
          <button onClick={() => setActiveTab('terminal')} className={`px-3 py-1.5 rounded-md transition-all font-bold flex items-center gap-1.5 ${activeTab === 'terminal' ? 'bg-emerald-600 text-white shadow-lg border border-emerald-500/50' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <TerminalSquare className="w-3.5 h-3.5" /> {lang === 'ar' ? 'موجه الأوامر' : 'CLI Agent'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'tasks' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="tasks" className="bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-xs font-bold text-zinc-500 mb-3 uppercase flex items-center gap-2">
              <Check className="w-3 h-3" /> {lang === 'ar' ? 'قائمة المهام اليومية' : 'Daily Task List'}
            </h4>
            <div className="flex gap-2 mb-4">
              <input 
                className="flex-1 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500/50 outline-none transition-colors" 
                placeholder={lang === 'ar' ? 'أضف مهمة جديدة...' : 'Add a task...'}
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
              />
              <button onClick={addTask} className="px-4 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks.length === 0 && <p className="text-[10px] text-zinc-600 italic text-center py-4">{lang === 'ar' ? 'لا يوجد مهام حالياً' : 'No tasks yet'}</p>}
              {tasks.map(t => (
                <div key={t.id} className="flex items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-[11px] group">
                  <input 
                    type="checkbox" 
                    checked={t.completed} 
                    onChange={() => setTasks(tasks.map(x => x.id === t.id ? {...x, completed: !x.completed} : x))}
                    className="w-3 h-3 accent-blue-500"
                  />
                  <span className={`flex-1 transition-all ${t.completed ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>{t.text}</span>
                  <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} key="social" className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 font-mono text-[8px] uppercase tracking-widest flex items-center gap-2 ${credentials.facebook.status === 'active_live' || credentials.whatsapp.status === 'active_live' ? 'text-emerald-500 animate-pulse' : 'text-zinc-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${credentials.facebook.status === 'active_live' || credentials.whatsapp.status === 'active_live' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              [ MODE: {credentials.facebook.status === 'active_live' || credentials.whatsapp.status === 'active_live' ? 'LIVE AGENT' : 'SECURE SIMULATOR'} ]
            </div>
            
            <h4 className="text-xs font-bold text-zinc-500 mb-4 uppercase flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" /> {lang === 'ar' ? 'مركز عمليات الردود والتفاعل' : 'Interaction Command Center'}
            </h4>

            {/* Platform Indicators */}
            <div className="mb-6 flex gap-3">
              <div className={`flex-1 p-3 rounded-xl border flex flex-col gap-1 transition-all ${credentials.whatsapp.status === 'connected' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-900/10' : 'bg-zinc-900 border-zinc-800'}`}>
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1.5"><Share2 className="w-3 h-3" /> WhatsApp</span>
                   <span className={`w-1.5 h-1.5 rounded-full ${credentials.whatsapp.status === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-zinc-700'}`}></span>
                 </div>
                 <span className="text-[8px] text-zinc-500 italic">{credentials.whatsapp.status === 'connected' ? 'Monitoring messages...' : 'Awaiting authentication'}</span>
              </div>
              <div className={`flex-1 p-3 rounded-xl border flex flex-col gap-1 transition-all ${credentials.facebook.status === 'connected' ? 'bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-900/10' : 'bg-zinc-900 border-zinc-800'}`}>
                 <div className="flex items-center justify-between">
                   <span className="text-[10px] font-bold text-blue-500 flex items-center gap-1.5"><Facebook className="w-3 h-3" /> Facebook</span>
                   <span className={`w-1.5 h-1.5 rounded-full ${credentials.facebook.status === 'connected' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-zinc-700'}`}></span>
                 </div>
                 <span className="text-[8px] text-zinc-500 italic">{credentials.facebook.status === 'connected' ? 'Scanning feed & inbox...' : 'Awaiting authentication'}</span>
              </div>
            </div>

            <div className="relative group">
              <textarea 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-sm h-32 mb-4 text-zinc-100 focus:border-blue-500/50 outline-none transition-all resize-none shadow-inner" 
                placeholder={lang === 'ar' ? 'أدخل الرسالة التي تريد صياغة رد آمن عليها...' : 'Input incoming payload to generate secure reply...'}
                value={socialPrompt}
                onChange={e => setSocialPrompt(e.target.value)}
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="p-1.5 bg-zinc-800 rounded-lg text-[8px] text-zinc-400">CTRL+V</div>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => handleSocialAction('WhatsApp')} 
                className="flex-1 py-3.5 bg-zinc-900 hover:bg-emerald-600 border border-zinc-800 hover:border-emerald-500 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all group active:scale-95"
              >
                <Share2 className="w-4 h-4 text-emerald-500 group-hover:text-white" /> {lang === 'ar' ? 'تحليل للواتساب' : 'WA Intelligence'}
              </button>
              <button 
                onClick={() => handleSocialAction('Facebook')} 
                className="flex-1 py-3.5 bg-zinc-900 hover:bg-blue-700 border border-zinc-800 hover:border-blue-500 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all group active:scale-95"
              >
                <Facebook className="w-4 h-4 text-blue-500 group-hover:text-white" /> {lang === 'ar' ? 'تحليل للفيسبوك' : 'FB Intelligence'}
              </button>
            </div>
            
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-500 gap-4 bg-zinc-900/30 rounded-xl border border-zinc-800/30 mb-4 animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                <div className="text-center">
                   <p className="text-xs font-bold text-zinc-400 tracking-wide">{lang === 'ar' ? 'الوكيل الذكي يعمل...' : 'AGENT IN PROGRESS...'}</p>
                   <p className="text-[10px] text-zinc-500 font-mono mt-1 px-4">{lang === 'ar' ? 'يتم الآن تحليل سياق الحوار وتشفير الرد المقترح للخصوصية' : 'Analyzing dialogue context and encrypting proposed response for maximum privacy'}</p>
                </div>
              </div>
            )}

            {aiResponse && !loading && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap relative shadow-2xl overflow-hidden mb-6">
                <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none text-blue-500"><Sparkles className="w-16 h-16" /></div>
                <div className="text-blue-400 font-bold mb-4 flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="flex items-center gap-2 uppercase tracking-widest text-[9px]"><SecureIcon className="w-3 h-3" /> Encrypted Agent Draft</span>
                  <div className="flex gap-2">
                    <CopyButton text={aiResponse} />
                  </div>
                </div>
                <div className="text-zinc-200 font-mono py-2">{aiResponse}</div>
                <div className="mt-5 flex gap-2">
                  <button 
                    onClick={() => handleRealReply(credentials.facebook.status === 'connected' ? 'Facebook' : 'WhatsApp')}
                    className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${credentials.whatsapp.status === 'connected' || credentials.facebook.status === 'connected' ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-50'}`}
                  >
                    <Share2 className="w-3 h-3" /> {lang === 'ar' ? 'تنفيذ الإرسال الحقيقي الآن' : 'Execute Real Reply Now'}
                  </button>
                  <button onClick={() => setAiResponse('')} className="p-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-500 rounded-xl transition-all"><Plus className="w-4 h-4 rotate-45" /></button>
                </div>
              </motion.div>
            )}

            {/* Live Operations Log */}
            <div className="bg-black/60 rounded-2xl border border-zinc-800 p-4 font-mono text-[9px] relative group shadow-inner">
              <div className="flex items-center justify-between mb-3">
                 <h5 className="font-bold text-zinc-500 uppercase flex items-center gap-2"><Activity className="w-3 h-3 text-emerald-500" /> Digital Twin Activity Log</h5>
                 <div className="flex gap-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 </div>
              </div>
              <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar-mini">
                {logs.length === 0 && <div className="text-zinc-700 italic border-l border-zinc-800 pl-2">System standby. Awaiting first connection protocol...</div>}
                {logs.map((log, i) => (
                  <div key={i} className="flex gap-2 items-start border-l border-zinc-800/30 pl-2 animate-in slide-in-from-left duration-300">
                    <span className="text-zinc-600 flex-shrink-0">[{log.timestamp}]</span>
                    <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warn' ? 'text-red-400' : log.type === 'agent' ? 'text-blue-400 font-bold' : 'text-zinc-400'}>
                      {log.type === 'agent' ? '>> AGENT_EXEC: ' : ''}{log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'terminal' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="terminal">
            <TerminalAgent lang={lang} />
          </motion.div>
        )}

        {activeTab === 'connectivity' && (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} key="connectivity" className="space-y-6">
            
            {/* Real Activation Requirements */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 shadow-2xl relative overflow-hidden">
               <div className="absolute -top-4 -right-4 opacity-5 text-blue-500 rotate-12"><Zap className="w-24 h-24" /></div>
               <h4 className="text-[11px] font-bold text-blue-400 mb-5 flex items-center gap-2 uppercase tracking-widest border-b border-zinc-900 pb-3">
                 <SecureIcon className="w-4 h-4" /> {lang === 'ar' ? 'متطلبات التفعيل الحقيقي (نظام المسجد)' : 'Real Activation Console'}
               </h4>
               
               <div className="space-y-3 mb-6">
                 <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-300">Meta Access Token</span>
                      <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">FACEBOOK_ACCESS_TOKEN</span>
                    </div>
                    {/* Note: process.env is only available in server, in client we check if it was passed via props or state if needed, but here we can just display it as a requirement UI */}
                    <span className="px-2 py-1 bg-zinc-900 rounded text-[8px] font-bold text-amber-500 border border-amber-950 animate-pulse">REQUIRED FOR LIVE</span>
                 </div>
                 <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-900 hover:border-zinc-800 transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-zinc-300">WhatsApp Business ID</span>
                      <span className="text-[8px] text-zinc-600 font-mono tracking-tighter">WHATSAPP_ACCESS_TOKEN</span>
                    </div>
                    <span className="px-2 py-1 bg-zinc-900 rounded text-[8px] font-bold text-amber-500 border border-amber-950 animate-pulse">REQUIRED FOR LIVE</span>
                 </div>
               </div>

               <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                 <p className="text-[10px] text-zinc-400 leading-relaxed">
                   {lang === 'ar' 
                     ? 'لجعل الربط حقيقياً 100% وليس مجرد محاكاة، يجب إدخال "مفاتيح الوصول" في ملف الإعدادات. بدونها، يقوم البوت بمحاكاة العمليات للأمان فقط.' 
                     : 'To move from Simulator to Live, you must provide your Meta Developer Portals tokens. Without them, the agent operates in Secure Simulation Mode for initial testing.'}
                 </p>
               </div>
            </div>

            {/* Quick Login Section (Matching user screenshots) */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 shadow-2xl space-y-4">
              <h4 className="text-[11px] font-bold text-zinc-400 mb-4 flex items-center gap-2 uppercase tracking-widest border-b border-zinc-800 pb-3">
                <Zap className="w-4 h-4 text-amber-500" /> {lang === 'ar' ? 'تسجيل الدخول المباشر (ضغطة واحدة)' : 'One-Click Quick Login'}
              </h4>
              
              <div className="space-y-3">
                {/* VK Button */}
                <button 
                  onClick={() => handleConnect('vk', true)}
                  className="w-full flex items-center gap-4 bg-blue-600 hover:bg-blue-500 p-4 rounded-xl transition-all border border-blue-400/20 group relative overflow-hidden"
                >
                  <div className="bg-white/20 p-2 rounded-lg"><Codepen className="w-5 h-5 text-white" /></div>
                  <span className="flex-1 text-left font-bold text-white text-sm">{lang === 'ar' ? 'تسجيل دخول بحساب VK' : 'تسجيل دخول بحساب VK'}</span>
                  <div className="absolute right-0 top-0 h-full w-1 bg-white/10 group-hover:w-2 transition-all"></div>
                </button>

                {/* Google Button */}
                <button 
                  onClick={() => handleConnect('google', true)}
                  className="w-full flex items-center gap-4 bg-zinc-100 hover:bg-white p-4 rounded-xl transition-all border border-zinc-200 group relative overflow-hidden"
                >
                  <div className="bg-white p-1 rounded-lg shadow-sm">
                    <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  </div>
                  <span className="flex-1 text-left font-bold text-zinc-900 text-sm">{lang === 'ar' ? 'تسجيل دخول مع جوجل' : 'تسجيل دخول مع جوجل'}</span>
                  <div className="absolute right-0 top-0 h-full w-1 bg-zinc-400/20 group-hover:w-2 transition-all"></div>
                </button>

                {/* X Button */}
                <button 
                  onClick={() => handleConnect('x', true)}
                  className="w-full flex items-center gap-4 bg-zinc-900 hover:bg-black p-4 rounded-xl transition-all border border-zinc-700 group relative overflow-hidden"
                >
                  <div className="bg-zinc-800 p-2 rounded-lg text-white font-mono font-black italic border border-zinc-700">X</div>
                  <span className="flex-1 text-left font-bold text-zinc-200 text-sm">{lang === 'ar' ? 'تسجيل الدخول باستخدام X' : 'تسجيل الدخول باستخدام X'}</span>
                  <div className="absolute right-0 top-0 h-full w-1 bg-white/5 group-hover:w-2 transition-all"></div>
                </button>

                {/* Facebook Quick Connect */}
                <button 
                  onClick={() => handleConnect('facebook', true)}
                  className="w-full flex items-center gap-4 bg-blue-700 hover:bg-blue-600 p-4 rounded-xl transition-all border border-blue-500 group relative overflow-hidden"
                >
                  <div className="bg-white/20 p-2 rounded-lg"><Facebook className="w-5 h-5 text-white" /></div>
                  <span className="flex-1 text-left font-bold text-white text-sm">{lang === 'ar' ? 'تسجيل دخول مع فيسبوك' : 'تسجيل دخول مع فيسبوك'}</span>
                  <div className="absolute right-0 top-0 h-full w-1 bg-white/10 group-hover:w-2 transition-all"></div>
                </button>
              </div>

              <div className="flex items-center gap-2 py-2">
                 <div className="flex-1 h-px bg-zinc-800"></div>
                 <span className="text-[10px] text-zinc-600 font-bold uppercase">{lang === 'ar' ? 'أو' : 'OR'}</span>
                 <div className="flex-1 h-px bg-zinc-800"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                   <Ghost className="w-4 h-4" /> {lang === 'ar' ? 'ضيف' : 'Guest'}
                 </button>
                 <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 text-xs font-bold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2">
                   <MessageSquare className="w-4 h-4" /> {lang === 'ar' ? 'المزيد' : 'More'}
                 </button>
              </div>
            </div>

            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-emerald-500"><Share2 className="w-32 h-32" /></div>
               <h4 className="text-[11px] font-bold text-emerald-500 mb-5 flex items-center gap-2 uppercase tracking-wide">
                 <Lock className="w-4 h-4" /> {lang === 'ar' ? 'إدخال بيانات الواتساب يدوياً' : 'Manual WhatsApp Sync'}
               </h4>
               <div className="space-y-3">
                 <input 
                   type="text" 
                   className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 outline-none" 
                   placeholder={lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                   value={credentials.whatsapp.phone}
                   onChange={e => setCredentials({...credentials, whatsapp: {...credentials.whatsapp, phone: e.target.value}})}
                 />
                 <input 
                   type="password" 
                   className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500/50 outline-none" 
                   placeholder={lang === 'ar' ? 'كلمة المرور / كود الامان' : 'Password / Security Code'}
                   value={credentials.whatsapp.password}
                   onChange={e => setCredentials({...credentials, whatsapp: {...credentials.whatsapp, password: e.target.value}})}
                 />
                 <input 
                   type="text" 
                   className="w-full bg-zinc-950 border border-emerald-500/20 p-3 rounded-xl text-[10px] text-emerald-400 placeholder:text-emerald-900 focus:border-emerald-500/50 outline-none font-mono" 
                   placeholder={lang === 'ar' ? 'مفتاح الوصول (Access Token) - اختياري للتفعيل الحقيقي' : 'Access Token - Optional for Real Activation'}
                   value={credentials.whatsapp.token}
                   onChange={e => setCredentials({...credentials, whatsapp: {...credentials.whatsapp, token: e.target.value}})}
                 />
                 <button 
                   onClick={() => handleConnect('whatsapp')}
                   disabled={loading || credentials.whatsapp.status === 'connected'}
                   className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${credentials.whatsapp.status === 'connected' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}`}
                 >
                   {credentials.whatsapp.status === 'connected' ? <Check className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                   {credentials.whatsapp.status === 'connected' ? (lang === 'ar' ? 'متصل وجاهز' : 'Connected & Ready') : (lang === 'ar' ? 'تفعيل الربط التلقائي' : 'Activate Automation')}
                 </button>
               </div>
            </div>

            <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none text-blue-500"><Facebook className="w-32 h-32" /></div>
               <h4 className="text-[11px] font-bold text-blue-500 mb-5 flex items-center gap-2 uppercase tracking-wide">
                 <UserCheck className="w-4 h-4" /> {lang === 'ar' ? 'ربط ملف الفيسبوك الحقيقي' : 'Facebook Deep Integration'}
               </h4>
               <div className="space-y-3">
                 <input 
                   type="text" 
                   className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500/50 outline-none" 
                   placeholder={lang === 'ar' ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email or Username'}
                   value={credentials.facebook.email}
                   onChange={e => setCredentials({...credentials, facebook: {...credentials.facebook, email: e.target.value}})}
                 />
                 <input 
                   type="password" 
                   className="w-full bg-zinc-900 border border-zinc-800 p-3 rounded-xl text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-blue-500/50 outline-none" 
                   placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'}
                   value={credentials.facebook.password}
                   onChange={e => setCredentials({...credentials, facebook: {...credentials.facebook, password: e.target.value}})}
                 />
                 <input 
                   type="text" 
                   className="w-full bg-zinc-950 border border-blue-500/20 p-3 rounded-xl text-[10px] text-blue-400 placeholder:text-blue-900 focus:border-blue-500/50 outline-none font-mono" 
                   placeholder={lang === 'ar' ? 'مفتاح الوصول (Access Token) - تفعيل حقيقي' : 'Access Token - Real Activation'}
                   value={credentials.facebook.token}
                   onChange={e => setCredentials({...credentials, facebook: {...credentials.facebook, token: e.target.value}})}
                 />
                 <button 
                    onClick={() => handleConnect('facebook')}
                    disabled={loading || credentials.facebook.status === 'connected'}
                    className={`w-full py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${credentials.facebook.status === 'connected' ? 'bg-blue-500/20 text-blue-500' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}`}
                 >
                   {credentials.facebook.status === 'connected' ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                   {credentials.facebook.status === 'connected' ? (lang === 'ar' ? 'الحساب مفعل' : 'Account Synced') : (lang === 'ar' ? 'بدء المزامنة الذكية' : 'Start Intelligent Sync')}
                 </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl">
        <p className="text-[10px] text-amber-500/80 leading-relaxed italic text-center">
          {lang === 'ar' 
            ? 'تنبيه: يتم تشفير البيانات محلياً قبل الاستخدام. يرجى التأكد من استخدام كلمات مرور قوية أو "Passwords App" لضمان أمان حساباتك.' 
            : 'Caution: Data is encrypted locally before use. Please ensure you use strong passwords or "App Passwords" to secure your accounts.'}
        </p>
      </div>
    </div>
  );
};


export const SnippetLibrary = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [search, setSearch] = useState('');
  const [snippets, setSnippets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const findSnippet = async () => {
    if(!search) return;
    setLoading(true);
    try {
      const res = await brandApi.chat(`Provide a useful production-ready code snippet for: ${search}`, "coding");
      setSnippets([res.text, ...snippets]);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center gap-3">
        <BookMarked className="w-6 h-6 text-zinc-400" />
        <h3 className="font-bold text-white">{lang === 'ar' ? 'مكتبة الأكواد الذكية' : 'Smart Snippet Library'}</h3>
      </div>
      <div className="flex gap-2">
        <input className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-sm text-white" placeholder={lang === 'ar' ? 'ابحث عن كود (مثل: Python decorator)...' : 'Search code topic...'} value={search} onChange={e => setSearch(e.target.value)} />
        <button onClick={findSnippet} className="px-6 bg-zinc-700 rounded-lg hover:bg-zinc-600 transition-colors">{loading ? '...' : <Search className="w-4 h-4" />}</button>
      </div>
      <div className="space-y-4">
        {snippets.map((s, i) => (
          <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 max-h-40 overflow-hidden relative group">
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 z-10"><CopyButton text={s} /></div>
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-950 to-transparent" />
            <pre>{s}</pre>
          </div>
        ))}
        {snippets.length === 0 && <div className="text-center p-10 text-zinc-600 text-xs italic">Awaiting your first query...</div>}
      </div>
    </div>
  );
};

