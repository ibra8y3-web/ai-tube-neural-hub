import React, { useState } from 'react';
import { User, Layers, Shield, Zap, Eye, Loader2, Copy, Download, MessageSquare, Code, Book, ShieldCheck, Search } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { saveToInbox, copyToClipboard, downloadAsFile, downloadAsZip } from '../../lib/inbox';
import { toast } from 'sonner';
import { FolderArchive } from 'lucide-react';

// 1. Neuro-UX Auditor
export const NeuroUXAuditor = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [desc, setDesc] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    if (!desc) return;
    setIsLoading(true);
    try {
      const prompt = `Analyze this UI/UX description and provide a professional audit: "${desc}". Return JSON with: 'usabilityScore' (0-100), 'issues' (array), 'recommendations' (array), 'conversionTips' (array).`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setResult(parsed);
         saveToInbox({ type: 'ux_audit', content: desc, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-teal-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-teal-400">{lang === 'ar' ? 'مدقق تجربة المستخدم العصبي' : 'Neuro-UX Auditor'}</h3>
        </div>
        {result && (
          <div className="flex gap-2">
            <button onClick={() => downloadAsFile(JSON.stringify(result, null, 2), 'ux_audit.json')} className="p-1.5 hover:bg-white/10 rounded" title={lang === 'ar' ? 'تحميل JSON' : 'Download JSON'}><Download className="w-4 h-4 text-zinc-400" /></button>
          </div>
        )}
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-teal-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'صف واجهة المستخدم أو رابطها...' : 'Describe UI or provide URL...'}
        value={desc}
        onChange={e => setDesc(e.target.value)}
      />
      <button onClick={analyze} disabled={isLoading} className="w-full py-2 bg-teal-500 text-black font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'بدء الفحص (JSON)' : 'Start Audit (JSON)')}
      </button>
      {result && (
        <div className="mt-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 uppercase">{lang === 'ar' ? 'درجة سهولة الاستخدام' : 'Usability Score'}</span>
            <span className="text-xl font-black text-teal-400">{result.usabilityScore}/100</span>
          </div>
          <div>
            <h4 className="text-xs text-zinc-500 mb-1 uppercase font-bold">{lang === 'ar' ? 'المشاكل المكتشفة' : 'Detected Issues'}</h4>
            <ul className="text-xs text-zinc-300 space-y-1 list-disc list-inside">
              {result.issues.map((it:any, i:number) => <li key={i}>{it}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="text-xs text-emerald-500 mb-1 uppercase font-bold">{lang === 'ar' ? 'توصيات التحسين' : 'Recommendations'}</h4>
            <ul className="text-xs text-emerald-400/80 space-y-1 list-disc list-inside">
              {result.recommendations.map((it:any, i:number) => <li key={i}>{it}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// 2. Architecture Blueprint
export const ArchitectureBlueprint = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [reqs, setReqs] = useState("");
  const [blueprint, setBlueprint] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!reqs) return;
    setIsLoading(true);
    try {
      const prompt = `Design a system architecture for: "${reqs}". Return JSON with: 'title', 'components' (array), 'dataFlow' (string), 'securityMeasures' (array), 'mermaid' (string mermaid diagram code).`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setBlueprint(parsed);
         saveToInbox({ type: 'architecture', content: reqs, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-blue-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-blue-400">{lang === 'ar' ? 'مخطط الهندسة البرمجية' : 'Architecture Blueprint'}</h3>
        </div>
        {blueprint && (
          <div className="flex gap-2">
            <button onClick={() => downloadAsZip({ 'architecture.json': JSON.stringify(blueprint, null, 2), 'diagram.mermaid': blueprint.mermaid || '' }, 'architecture_project')} className="p-1.5 hover:bg-blue-500/20 text-blue-400 rounded flex items-center gap-1.5 text-[10px]" title={lang === 'ar' ? 'تحميل المشروع كاملاً' : 'Download Full Project'}>
              <FolderArchive className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'تحميل المشروع' : 'Download Project'}</span>
            </button>
            <button onClick={() => downloadAsFile(JSON.stringify(blueprint, null, 2), 'architecture.json')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
          </div>
        )}
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-blue-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'اشرح متطلبات النظام...' : 'Describe system requirements...'}
        value={reqs}
        onChange={e => setReqs(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'توليد المخطط' : 'Generate Blueprint')}
      </button>
      {blueprint && (
        <div className="mt-4 p-3 bg-zinc-950 rounded-lg border border-zinc-800 space-y-4 font-mono text-[10px]">
          <div>
            <h4 className="text-blue-400 font-bold mb-1 uppercase">{blueprint.title}</h4>
            <div className="text-zinc-400">{blueprint.summary}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-zinc-600 mb-1 uppercase border-b border-white/5 pb-1">Components</p>
              <div className="space-y-2 mt-1">
                {blueprint.components.map((c: any, i: number) => (
                  <div key={i} className="text-zinc-300">
                    <div className="text-blue-500/80 font-bold">• {c.name}</div>
                    <div className="text-zinc-500 text-[9px] pl-3 leading-tight">{c.description}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-zinc-600 mb-1 uppercase border-b border-white/5 pb-1">Security</p>
              <div className="space-y-1 mt-1">
                {blueprint.securityMeasures.map((s: string, i: number) => <div key={i} className="text-zinc-400 text-[9px]">• {s}</div>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Persona Engine
export const PersonaEngine = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [product, setProduct] = useState("");
  const [personas, setPersonas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!product) return;
    setIsLoading(true);
    try {
      const prompt = `Generate 3 detailed customer personas for this product: "${product}". Return JSON array of objects with: 'name', 'age', 'bio', 'painPoints' (array), 'motivation'.`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setPersonas(parsed);
         saveToInbox({ type: 'personas', content: product, metadata: { personas: parsed } });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-orange-500/20 rounded-xl">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-5 h-5 text-orange-400" />
        <h3 className="font-bold text-orange-400">{lang === 'ar' ? 'محرك الشخصيات المستهدفة' : 'Persona Engine'}</h3>
      </div>
      <input 
        type="text"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-orange-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'ما هو منتجك أو خدمتك؟' : 'What is your product or service?'}
        value={product}
        onChange={e => setProduct(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'توليد الشخصيات' : 'Generate Personas')}
      </button>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {personas.map((p, i) => (
          <div key={i} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-[10px] space-y-2">
            <div className="flex justify-between items-center text-orange-400 font-bold">
              <span>{p.name}</span>
              <span>{p.age}y</span>
            </div>
            <p className="text-zinc-500 leading-tight">{p.bio}</p>
            <div className="text-zinc-600 uppercase border-t border-white/5 pt-1">Pain Points</div>
            {p.painPoints.map((pt:string, pi:number) => <div key={pi} className="text-red-400/70">• {pt}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. DevOps Catalyst
export const DevOpsCatalyst = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [tech, setTech] = useState("");
  const [config, setConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!tech) return;
    setIsLoading(true);
    try {
      const prompt = `Generate DevOps configuration scripts for: "${tech}". Return JSON with: 'dockerfile', 'nginxConfig', 'cicdYaml' (GitHub Actions), 'deploymentGuide'.`;
      const res = await brandApi.generateChat(prompt, "general");
      const jsonMatch = res.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
         const parsed = JSON.parse(jsonMatch[0]);
         setConfig(parsed);
         saveToInbox({ type: 'devops', content: tech, metadata: parsed });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-yellow-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-yellow-500">{lang === 'ar' ? 'محفز الـ DevOps الذكي' : 'DevOps Catalyst'}</h3>
        </div>
        {config && (
          <button onClick={() => downloadAsZip({ 'Dockerfile': config.dockerfile, 'nginx.conf': config.nginxConfig, 'ci-cd.yml': config.cicdYaml, 'README.md': config.deploymentGuide }, 'devops_project')} className="p-1.5 bg-yellow-500 text-black rounded flex items-center gap-1.5 text-[10px] font-bold">
            <FolderArchive className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تنزيل المجلد بالكامل' : 'Download Full Folder'}</span>
          </button>
        )}
      </div>
      <input 
        type="text"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-yellow-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'اللغة، قاعدة البيانات، بيئة التشغيل...' : 'Tech stack, DB, Runtime...'}
        value={tech}
        onChange={e => setTech(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-yellow-500 text-black font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'توليد السكريبتات (.sh)' : 'Generate Scripts (.sh)')}
      </button>
      {config && (
        <div className="space-y-2 mt-4">
           {['dockerfile', 'nginxConfig', 'cicdYaml'].map((key) => {
             const getExt = () => {
               if(key === 'dockerfile') return 'dockerfile';
               if(key === 'nginxConfig') return 'conf';
               return 'yml';
             };
             return (
               <div key={key} className="bg-zinc-950 rounded p-2 border border-zinc-800 relative group">
                 <div className="absolute top-2 right-2 flex gap-1">
                   <span className="text-[8px] text-zinc-600 uppercase tracking-widest">{key}</span>
                   <button onClick={() => downloadAsFile(config[key], `${key}.${getExt()}`)} className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Download className="w-3 h-3 text-zinc-500" /></button>
                 </div>
                 <pre className="text-[10px] text-zinc-400 font-mono overflow-x-auto max-h-[100px] py-4">{config[key]}</pre>
                 <button onClick={() => copyToClipboard(config[key])} className="absolute bottom-2 right-2 p-1 bg-zinc-900 border border-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"><Copy className="w-3 h-3 text-zinc-500" /></button>
               </div>
             );
           })}
        </div>
      )}
    </div>
  );
};

// 5. Legal AI Assistant
export const LegalAIAssistant = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [topic, setTopic] = useState("");
  const [doc, setDoc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const prompt = `Write a professional legal document or policy about: "${topic}". Include sections for Definitions, Terms, Liability, and governing law. If user prompt is Arabic, reply in Arabic.`;
      const res = await brandApi.generateChat(prompt, "general");
      setDoc(res.text);
      saveToInbox({ type: 'legal', content: topic, metadata: { result: res.text } });
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-purple-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-purple-400">{lang === 'ar' ? 'مساعد الشؤون القانونية' : 'Legal AI Assistant'}</h3>
        </div>
        {doc && (
          <div className="flex gap-2">
            <button onClick={() => copyToClipboard(doc)} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
            <button onClick={() => downloadAsFile(doc, 'legal_doc.txt')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
          </div>
        )}
      </div>
      <input 
        type="text"
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-purple-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'عنوان الوثيقة أو موضوع القانون...' : 'Document title or legal topic...'}
        value={topic}
        onChange={e => setTopic(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-purple-500 text-white font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'صياغة المادة' : 'Draft Document')}
      </button>
      {doc && (
        <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg max-h-[300px] overflow-y-auto custom-scrollbar">
          <pre className="text-[11px] text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">{doc}</pre>
        </div>
      )}
    </div>
  );
};
