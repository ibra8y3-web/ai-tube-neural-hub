import React, { useState } from 'react';
import { 
  Database, Zap, Cpu, Sparkles, Box, Code, MessageSquare, 
  ShieldCheck, Braces, Terminal, Copy, CheckCircle2, 
  TrendingUp, Search, Globe, AlertTriangle, RefreshCw,
  FileCode, Layers, ListChecks, Utensils, Gift, BookOpen, 
  MapPin, GitBranch, Layout, Activity
} from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { motion, AnimatePresence } from 'framer-motion';

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
