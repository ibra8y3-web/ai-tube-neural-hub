import React, { useState } from 'react';
import { Database, Zap, Cpu, Sparkles, Box, Code, MessageSquare, ShieldCheck, Braces, Terminal, Copy, CheckCircle2 } from 'lucide-react';
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
