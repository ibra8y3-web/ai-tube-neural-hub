import React, { useState } from 'react';
import { Box, Database, GraduationCap, Loader2, Sparkles, Copy, Download, Save, Image as ImageIcon, FolderArchive } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { motion, AnimatePresence } from 'framer-motion';
import { saveToInbox, copyToClipboard, downloadAsFile, downloadAsZip, getExtensionForType } from '../../lib/inbox';
import { toast } from 'sonner';

export const ThreeDLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      // Parallel logic and vision
      const [textRes, imgRes] = await Promise.all([
        brandApi.chat(`Generate technical 3D modeling topology and specifications for: ${prompt}. Include polygon counts, suggested textures, and UV mapping strategy.`, "3d"),
        brandApi.generateLogo("3D Render", `A professional high-fidelity 3D model render of ${prompt}, studio lighting, octane render, 4k resolution, transparent background, isolated 3d asset`)
      ]);
      
      setResult(textRes.text);
      setRenderUrl(imgRes.logoUrl || null);
      
      saveToInbox({
        type: '3d',
        content: textRes.text,
        metadata: { renderUrl: imgRes.logoUrl, prompt }
      });
      
      toast.success(lang === 'ar' ? 'تم الحفظ في صندوق الوارد' : 'Saved to Inbox');
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-fuchsia-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-fuchsia-500" />
          <h3 className="font-bold text-fuchsia-500">{lang === 'ar' ? 'مختبر الأصول ثلاثية الأبعاد (3D)' : '3D Assets Lab'}</h3>
        </div>
        <div className="flex gap-2">
          {result && (
            <>
              <button onClick={() => copyToClipboard(result)} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
              <button onClick={() => downloadAsFile(result, '3d_blueprint.txt')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
            </>
          )}
        </div>
      </div>
      
      <p className="text-xs text-zinc-400 mb-4">{lang === 'ar' ? 'توليد أصول وتصميمات ثلاثية الأبعاد باستخدام محركات متخصصة.' : 'Generate 3D assets and high-fidelity renders.'}</p>
      
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-fuchsia-500 focus:outline-none" 
          placeholder={lang === 'ar' ? 'وصف المجسم...' : 'Describe the 3D asset...'} 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 flex items-center justify-center gap-2 bg-fuchsia-500 text-black font-bold rounded text-xs hover:opacity-90 transition-opacity">
           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
           {isLoading ? (lang === 'ar' ? 'جاري التوليد...' : 'Rendering...') : (lang === 'ar' ? 'توليد' : 'Generate')}
        </button>
      </div>

      <AnimatePresence>
        {(result || renderUrl) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {renderUrl && (
              <div className="aspect-square bg-zinc-950 rounded-lg border border-zinc-800 flex items-center justify-center overflow-hidden relative group">
                <img src={renderUrl} alt="3D Render" className="w-full h-full object-contain" />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                   <span className="text-[10px] text-fuchsia-400 font-mono">RENDER_V1</span>
                   <button onClick={() => window.open(renderUrl, '_blank')} className="p-1 bg-zinc-800 rounded"><Download className="w-3 h-3" /></button>
                </div>
              </div>
            )}
            {result && (
              <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 max-h-[300px] overflow-auto custom-scrollbar">
                 <div className="flex items-center gap-2 text-fuchsia-400/50 mb-2 border-b border-zinc-800 pb-1">
                    <Database className="w-3 h-3" />
                    <span className="text-[10px] uppercase font-mono">Specifications</span>
                 </div>
                 <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">{result}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DataScienceLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const res = await brandApi.chat(`Act as a senior data scientist. Analyze the following data request and provide Python Pandas/Numpy code and statistical insights: ${prompt}`, "data");
      setResult(res.text);
      saveToInbox({ type: 'data', content: res.text, metadata: { prompt } });
      toast.success(lang === 'ar' ? 'تم الحفظ' : 'Saved');
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-teal-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-teal-500" />
          <h3 className="font-bold text-teal-500">{lang === 'ar' ? 'مختبر علم البيانات' : 'Data Science Lab'}</h3>
        </div>
        <div className="flex gap-2">
          {result && (
            <>
              <button 
                onClick={() => downloadAsZip({ 'analysis.py': result, 'METADATA.md': `Analysis for prompt: ${prompt}` }, 'data_science_project')} 
                className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded flex items-center gap-1.5 text-[10px] font-bold border border-teal-500/30"
                title={lang === 'ar' ? 'تحميل المجلد' : 'Download Folder'}
              >
                <FolderArchive className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'ar' ? 'تحميل المشروع' : 'Download Project'}</span>
              </button>
              <button onClick={() => copyToClipboard(result)} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-teal-500 focus:outline-none" 
          placeholder={lang === 'ar' ? 'وصف البيانات أو المشكلة...' : 'Describe the dataset or problem...'} 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 flex items-center justify-center gap-2 bg-teal-500 text-black font-bold rounded text-xs">
           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800 relative group">
           <button onClick={() => downloadAsFile(result, 'analysis.py')} className="absolute top-2 right-2 p-1 bg-zinc-900 border border-zinc-800 rounded opacity-0 group-hover:opacity-100 transition-opacity" title="Download .py file">
              <Download className="w-3 h-3 text-zinc-500" />
           </button>
           <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

export const AcademyLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const res = await brandApi.chat(`Create a comprehensive syllabus and the first lesson for an academy course about: ${prompt}`, "academy");
      setResult(res.text);
      saveToInbox({ type: 'academy', content: res.text, metadata: { prompt } });
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-yellow-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-yellow-500" />
          <h3 className="font-bold text-yellow-500">{lang === 'ar' ? 'أكاديمية الذكاء الاصطناعي' : 'AI Academy'}</h3>
        </div>
        <div className="flex gap-2">
          {result && (
             <button onClick={() => downloadAsFile(result, `syllabus.${getExtensionForType('academy', result)}`)} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
          )}
        </div>
      </div>
      
      <div className="flex gap-2">
        <input 
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded p-2 text-sm text-white focus:border-yellow-500 focus:outline-none" 
          placeholder={lang === 'ar' ? 'موضوع الدورة...' : 'Course topic...'} 
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-yellow-500 text-black font-bold rounded text-xs">
           {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800 overflow-auto max-h-[400px] custom-scrollbar">
           <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
};

