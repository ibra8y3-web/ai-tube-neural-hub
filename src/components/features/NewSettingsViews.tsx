import React, { useState, useEffect } from 'react';
import { Bot, Play, Music, Layout, Code, TrendingUp, Zap, HardDrive, User, Wrench, MessageSquare, Palette, Component, Link as LinkIcon, Globe, Search, Database, FileText, CheckCircle2, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandApi } from '../../api/brandApi';

// Removed AiTube export as it is now inside AiTubeDashboard.tsx

export const ProjectDecoder = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [codeStructure, setCodeStructure] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleDecode = async () => {
    if (!codeStructure) return;
    setLoading(true);
    setAnalysis(null);
    try {
      const res = await brandApi.decodeProject(codeStructure);
      if (res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
        <h3 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4" />
          {lang === 'ar' ? 'فك المشاريع (Project Decoder)' : 'Project Decoder'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'تفكيك الكود، استخراج المنطق، وإنشاء بنية جديدة لأي مشروع يتم تحميله.' 
            : 'Deconstruct code, extract logic, and scaffold a new structure for any uploaded project.'}
        </p>
      </div>

      <div className="space-y-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <textarea
          className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm text-white focus:border-orange-500 focus:outline-none resize-none font-mono"
          placeholder={lang === 'ar' ? 'ضع الكود أو هيكل المشروع هنا...' : 'Paste code or project structure here...'}
          value={codeStructure}
          onChange={(e) => setCodeStructure(e.target.value)}
        />
        <button 
          onClick={handleDecode} 
          disabled={loading || !codeStructure}
          className="w-full py-2 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Code className="w-4 h-4" />}
          {lang === 'ar' ? 'تحليل وفك الشفرة' : 'Analyze & Decode'}
        </button>
      </div>

      {analysis && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-4">
          <h4 className="text-sm font-bold text-white border-b border-zinc-800 pb-2">{lang === 'ar' ? 'نتيجة التحليل' : 'Analysis Result'}</h4>
          
          <div>
            <h5 className="text-xs text-orange-500 font-bold mb-1 uppercase">Architecture Path</h5>
            <p className="text-sm text-zinc-300">{analysis.architecturePath}</p>
          </div>

          <div>
            <h5 className="text-xs text-orange-500 font-bold mb-1 uppercase">Tech Stack</h5>
            <div className="flex flex-wrap gap-2">
              {analysis.stack?.map((tech: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs font-mono text-zinc-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-xs text-orange-500 font-bold mb-1 uppercase">Improvements</h5>
            <ul className="list-disc list-inside space-y-1">
              {analysis.improvements?.map((imp: string, i: number) => (
                <li key={i} className="text-sm text-zinc-300">{imp}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export const VideoLab = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-6">
    <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
      <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
        <Play className="w-4 h-4" />
        {lang === 'ar' ? 'مختبر الفيديو (Video Lab)' : 'Video Lab'}
      </h3>
      <p className="text-sm text-zinc-400">
        {lang === 'ar' 
          ? 'تحليل وتوليد الفيديوهات باستخدام الذكاء الاصطناعي (مخططات، مشاهد، وغيرها).' 
          : 'Analyze and generate videos using AI (storyboards, scenes, etc).'}
      </p>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center flex-col text-zinc-500">
        <Play className="w-6 h-6 mb-2 text-purple-500" />
        <span className="text-xs uppercase font-bold">{lang === 'ar' ? 'توليد مشهد' : 'Generate Scene'}</span>
      </div>
      <div className="h-32 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center flex-col text-zinc-500">
        <Code className="w-6 h-6 mb-2 text-blue-500" />
        <span className="text-xs uppercase font-bold">{lang === 'ar' ? 'كود المونتاج' : 'Montage Code'}</span>
      </div>
    </div>
  </div>
);

export const AdvancedPreviewDashboard = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-6">
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-start gap-4">
      <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg"><Layout className="w-6 h-6" /></div>
      <div>
        <h3 className="text-white font-bold mb-1">{lang === 'ar' ? 'الواجهة الشاملة والمهام' : 'Comprehensive Dashboard & Tasks'}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {lang === 'ar' ? 'إدارة شاملة للمشاريع، الملفات، الدردشات، المعاينة المباشرة، وقرارات الـ AI في مكان واحد.' : 'Centralized management for projects, files, chats, live previews, and AI decisions.'}
        </p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
        <h4 className="text-xs font-mono uppercase text-zinc-500 mb-3">{lang === 'ar' ? 'ملفات المشروع' : 'Project Files'}</h4>
        <div className="space-y-2">
          {['index.html', 'App.tsx', 'vite.config.ts', 'server.js'].map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 p-2 rounded">
              <FileText className="w-3 h-3 text-zinc-500" /> {f}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl">
        <h4 className="text-xs font-mono uppercase text-zinc-500 mb-3">{lang === 'ar' ? 'حالة الأتمتة' : 'Automation Status'}</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">CI/CD Pipeline</span>
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-zinc-400">Auto-Backup</span>
            <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const MemoryEngine = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-6">
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
        <HardDrive className="w-4 h-4 text-blue-500" />
        {lang === 'ar' ? 'الذاكرة طويلة المدى ومحرك البحث' : 'Long-Term Memory & Search Engine'}
      </h3>
      <p className="text-sm text-zinc-400 mb-4">
        {lang === 'ar' 
          ? 'محرك بحث ذكي مدمج في كل الملفات والإنترنت مع ذاكرة للمشروع لعدم فقدان أي سياق.' 
          : 'Integrated smart search across all files and the web with persistent project memory.'}
      </p>
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute top-3 left-3" />
        <input 
          type="text" 
          placeholder={lang === 'ar' ? "ابحث في الملفات، الأكواد، أو الإنترنت..." : "Search files, codes, or the internet..."} 
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-sm text-white focus:border-orange-500 focus:outline-none"
        />
      </div>
    </div>
  </div>
);

export const TeamSystem = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-6">
    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
      <h3 className="text-blue-500 font-bold mb-2 flex items-center gap-2">
        <User className="w-4 h-4" />
        {lang === 'ar' ? 'نظام الفريق والموافقات' : 'Team System & Approvals'}
      </h3>
      <p className="text-sm text-zinc-400">
        {lang === 'ar' 
          ? 'قروبات، شات مباشر، توزيع المهام تلقائياً، وموافقة صاحب المشروع على التغييرات.' 
          : 'Groups, live chat, auto task distribution, and owner approvals for changes.'}
      </p>
    </div>
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Pending PR #{100+i}</h4>
            <p className="text-[10px] text-zinc-500">Feature: Global AI Hub</p>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-green-500/20 text-green-500 text-xs rounded hover:bg-green-500/30">Approve</button>
            <button className="px-3 py-1 bg-red-500/20 text-red-500 text-xs rounded hover:bg-red-500/30">Reject</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const GenericPlaceholder = ({ title, icon: Icon, desc, colorClass }: any) => (
  <div className="space-y-6">
    <div className={`p-4 ${colorClass}/10 border ${colorClass}/20 border-b border-r rounded-xl`}>
      <h3 className={`${colorClass.replace('bg-', 'text-')} font-bold mb-2 flex items-center gap-2`}>
        <Icon className="w-4 h-4" /> {title}
      </h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
    <div className="h-32 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center bg-zinc-900/50">
      <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Module Initializing...</span>
    </div>
  </div>
);
