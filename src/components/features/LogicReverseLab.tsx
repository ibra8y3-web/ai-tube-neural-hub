import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Code, GitBranch, Share2, Download, Loader2, 
  FileCode, Copy, CheckCircle2, UploadCloud, Trash2, 
  ChevronRight, AlertTriangle, Save, Sparkles, RefreshCcw, ImageIcon, Zap
} from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';
import JSZip from 'jszip';
import { saveToInbox, downloadAsFile, downloadAsZip } from '../../lib/inbox';

interface ProjectFile {
  name: string;
  content: string; // Used for text files
  isBinary?: boolean;
  binaryData?: Blob;
  status: 'pending' | 'processing' | 'healing' | 'done' | 'error' | 'skipped';
  convertedContent?: string;
}

export const LogicReverseLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [targetLang, setTargetLang] = useState('Python');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [isRefining, setIsRefining] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from local storage (Memory)
  useEffect(() => {
    const saved = localStorage.getItem('reverse_lab_memory');
    if (saved) {
      try {
        setProjectFiles(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  // Save to memory
  useEffect(() => {
    try {
      localStorage.setItem('reverse_lab_memory', JSON.stringify(projectFiles));
    } catch (e) {
      console.warn("Memory full, could not save state", e);
    }
  }, [projectFiles]);

  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Binary extensions to skip and preserve
    const binaryExts = /\.(jpg|jpeg|png|gif|bmp|webp|mp4|webm|avi|mov|mp3|wav|ogg|zip|rar|7z|exe|dll|so|bin|pdf)$/i;

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const extractedFiles: ProjectFile[] = [];

      for (const [path, zipEntry] of Object.entries(content.files)) {
        if (!zipEntry.dir) {
          if (binaryExts.test(path)) {
            const blob = await zipEntry.async('blob');
            extractedFiles.push({
              name: path,
              content: `[Binary Data: ${path}]`,
              isBinary: true,
              binaryData: blob,
              status: 'skipped'
            });
          } else {
            const text = await zipEntry.async('string');
            extractedFiles.push({
              name: path,
              content: text,
              status: 'pending'
            });
          }
        }
      }

      setProjectFiles([...projectFiles, ...extractedFiles]);
      toast.success(lang === 'ar' ? 'تم رفع المشروع بنجاح (مع تصفية الملفات الثنائية)' : 'Project uploaded (Assets preserved)');
    } catch (error) {
      toast.error('فشل معالجة ملف ZIP');
    }
  };

  const startReverseEngineering = async () => {
    if (projectFiles.filter(f => f.status !== 'done').length === 0) {
      toast.error('لا توجد ملفات للمعالجة');
      return;
    }

    setIsProcessing(true);
    
    for (let i = 0; i < projectFiles.length; i++) {
      if (projectFiles[i].status === 'done' || projectFiles[i].status === 'skipped') continue;

      setCurrentFileIndex(i);
      setProjectFiles(prev => {
        const next = [...prev];
        next[i].status = 'processing';
        return next;
      });

      try {
        const prompt = `CRITICAL: You are a Expert Code Transpiler. 
        TASK: Convert the file "${projectFiles[i].name}" into ${targetLang}.
        STRICT RULES:
        1. DO NOT return random numbers, decimal values, or confidence scores.
        2. DO NOT return any explanations, comments, or "Here is the code".
        3. RETURN ONLY functional, high-quality ${targetLang} code.
        4. If you cannot convert it, return a single comment in ${targetLang} explaining why.
        5. IGNORE any metadata or seeds in the file path.
        
        SOURCE CODE:
        ${projectFiles[i].content}`;

        let res = await brandApi.generateChat(prompt, 'coding');
        let convertedText = res?.text?.trim() || "";

        const cleanHallucination = (text: string) => {
          const trimmed = text.trim();
          // Check if it's just a number, scientific notation, or a very short string of mostly numbers
          const numericPattern = /^[\d\s.\-eE+]+$/;
          const isMostlyNumeric = (trimmed.match(/\d/g) || []).length / (trimmed.length || 1) > 0.8;
          return numericPattern.test(trimmed) || (trimmed.length < 20 && isMostlyNumeric);
        };

        const stripMarkdown = (text: string) => {
          let cleaned = text.trim();
          
          // Remove leading numeric hallucinations (confidence scores often prepended by small models)
          // Look for cases like "0.9987..." followed by actual text or code
          const leadingNumericNoise = /^[\d\s.\-eE+]{5,}\n+/;
          if (leadingNumericNoise.test(cleaned)) {
             cleaned = cleaned.replace(leadingNumericNoise, '').trim();
          }

          if (cleaned.includes('```')) {
            const matches = cleaned.match(/```[a-zA-Z]*\n?([\s\S]*?)\n?```/);
            return matches ? matches[1].trim() : cleaned.replace(/```[a-zA-Z]*/g, '').replace(/```/g, '').trim();
          }
          return cleaned.trim();
        };

        if (cleanHallucination(convertedText) || convertedText.length < 5) {
           console.warn(`Detected hallucination in ${projectFiles[i].name}, attempting forced retry...`);
           const retryPrompt = `SYSTEM EMERGENCY: The previous output was a numeric hallucination. 
           COVERT THIS FILE TO ${targetLang} CODE IMMEDIATELY. 
           NO NUMBERS, NO EXPLANATIONS. 
           ONLY ${targetLang} CODE.
           
           FILE CONTENT:
           ${projectFiles[i].content}`;
           
           const retryRes = await brandApi.generateChat(retryPrompt, 'coding');
           convertedText = stripMarkdown(retryRes?.text?.trim() || "");
        } else {
           convertedText = stripMarkdown(convertedText);
        }

        // Final check: if still numeric after retry, we mark as error
        if (cleanHallucination(convertedText)) {
           throw new Error("Persistant output hallucination (numbers). Model failed to generate code.");
        }

        // [Self-Healing Pass] New Stage: AI Debugging & Refinement
        if (convertedText.length > 20) {
           setProjectFiles(prev => {
              const next = [...prev];
              next[i].status = 'healing';
              return next;
           });

           const debugPrompt = `Act as a Critical Software Debugger. 
           Review the following ${targetLang} code converted from "${projectFiles[i].name}".
           FIND AND FIX:
           1. Syntax errors or missing imports.
           2. Logical inconsistencies.
           3. Unfinished code blocks.
           
           CODE TO REVIEW:
           ${convertedText}
           
           RETURN ONLY THE FIXED/HEALED ${targetLang} CODE.`;
           
           const healedRes = await brandApi.generateChat(debugPrompt, 'coding');
           if (healedRes?.text && healedRes.text.length > 20) {
              convertedText = healedRes.text.trim();
           }
        }
        
        setProjectFiles(prev => {
          const next = [...prev];
          next[i].status = 'done';
          next[i].convertedContent = convertedText;
          return next;
        });

        // Save progress to inbox every 3 files or at end
        if (i % 3 === 0 || i === projectFiles.length -1) {
           saveToInbox({ 
             type: 'logic', 
             content: `Converted ${projectFiles[i].name} to ${targetLang}`,
             metadata: { file: projectFiles[i].name, code: res.text, fullProjectStatus: 'partially_done' }
           });
        }

      } catch (error) {
        setProjectFiles(prev => {
          const next = [...prev];
          next[i].status = 'error';
          return next;
        });
        toast.error(`فشل معالجة: ${projectFiles[i].name}`);
      }
    }

    setIsProcessing(false);
    setCurrentFileIndex(-1);
    toast.success('اكتملت عملية الهندسة العكسية للمشروع');
  };

  const [clearConfirm, setClearConfirm] = useState(false);

  const clearMemory = () => {
    if (!clearConfirm) {
      setClearConfirm(true);
      setTimeout(() => setClearConfirm(false), 3000);
      toast.info(lang === 'ar' ? 'اضغط مرة أخرى للتأكيد' : 'Click again to confirm');
      return;
    }
    setProjectFiles([]);
    localStorage.removeItem('reverse_lab_memory');
    toast.info('تم مسح الذاكرة');
    setClearConfirm(false);
  };

  const downloadConvertedProject = async () => {
    const files: { [key: string]: string | Blob } = {};
    const doneFiles = projectFiles.filter(f => f.status === 'done');
    
    // Add converted files
    doneFiles.forEach(f => {
      if (f.convertedContent) {
        files[f.name] = f.convertedContent;
      }
    });

    // Add binary assets back (images, videos, etc.)
    projectFiles.forEach(f => {
       if (f.isBinary && f.binaryData) {
          files[f.name] = f.binaryData;
       }
    });

    if (doneFiles.length === 0 && Object.keys(files).length === 0) return;

    const loadingToast = toast.loading(lang === 'ar' ? 'جاري توليد الملفات التعريفية الذكية...' : 'Generating professional documentation...');
    
    try {
      // Use AI to generate a professional README based on the actual converted content
      const fileSummary = doneFiles.map(f => `- ${f.name} (Converted to ${targetLang})`).join('\n');
      const sampleCode = doneFiles[0]?.convertedContent?.substring(0, 500) || "";

      const readmePrompt = `Act as a Senior Technical Writer. 
      Generate a professional README.md for a project that has been converted to ${targetLang}.
      
      CONTEXT:
      - Files Converted: 
      ${fileSummary}
      
      - Sample Code from project:
      ${sampleCode}
      
      REQUIREMENTS:
      1. Write in a professional "Enterprise" style.
      2. Sections: # Project Name, ## Overview (explain what this project does based on files), ## Architecture, ## Prerequisites, ## Installation, ## Usage (specific to ${targetLang} but smart about it), ## File Structure.
      3. Use appropriate Markdown formatting and emojis.
      4. Language: ${lang === 'ar' ? 'Arabic' : 'English'}.
      
      RETURN ONLY THE MARKDOWN CONTENT.`;

      const res = await brandApi.generateChat(readmePrompt, 'general');
      files['README.md'] = res?.text || `# Project Converted to ${targetLang}\n\nGenerated by Logic Lab.`;

      await downloadAsZip(files, `converted_project_${targetLang}`);
      toast.success(lang === 'ar' ? 'تم تجهيز المشروع مع الدليل الاحترافي!' : 'Project ready with professional manual!');
    } catch (e) {
      console.error("Documentation generation failed", e);
      try {
        files['README.md'] = `# Project Converted to ${targetLang}\n\nGenerated by Logic Lab.`;
        await downloadAsZip(files, `converted_project_${targetLang}`);
      } catch (zipErr) {
        toast.error(lang === 'ar' ? 'فشل تحميل الملفات' : 'Failed to download files');
      }
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <RefreshCcw className="text-purple-400 w-8 h-8" />
            {lang === 'ar' ? 'مختبر المنطق والهندسة العكسية' : 'Logic Reverse & Conversion Lab'}
          </h2>
          <p className="text-zinc-400 text-sm">{lang === 'ar' ? 'حول المشاريع بالكامل، فك شفرتها، وأعد بناءها بأي لغة' : 'Reverse projects, decode logic, and rebuild in any language'}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={clearMemory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl border border-red-500/20 transition-all font-bold text-xs"
          >
            <Trash2 size={16} />
            {lang === 'ar' ? 'مسح الذاكرة' : 'Memory Clear'}
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all font-bold text-xs shadow-lg shadow-purple-500/20"
          >
            <UploadCloud size={16} />
            {lang === 'ar' ? 'رفع مشروع (ZIP)' : 'Upload Project (ZIP)'}
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept=".zip" onChange={handleZipUpload} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
        {/* Project Explorer */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{lang === 'ar' ? 'هيكل المشروع' : 'Project Files'}</span>
            <span className="text-[10px] text-purple-400 font-mono">{projectFiles.length} {lang === 'ar' ? 'ملف' : 'Files'}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {projectFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-600 opacity-50">
                <FileCode size={48} className="mb-4" />
                <p className="text-xs">{lang === 'ar' ? 'لا توجد هلفات حالياً' : 'Project is empty'}</p>
              </div>
            ) : (
              projectFiles.map((file, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${i === currentFileIndex ? 'bg-purple-500/10 border-purple-500' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'}`}>
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.status === 'done' ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> : 
                     file.status === 'healing' ? <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse flex-shrink-0" /> :
                     file.status === 'skipped' ? <ImageIcon className="w-4 h-4 text-zinc-500 flex-shrink-0" /> :
                     file.status === 'processing' ? <Loader2 className="w-4 h-4 text-purple-400 animate-spin flex-shrink-0" /> : 
                     file.status === 'error' ? <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" /> : 
                     <div className="w-4 h-4 border border-zinc-700 rounded-full flex-shrink-0" />}
                    <span className="text-xs text-zinc-300 truncate font-mono">{file.name}</span>
                  </div>
                  {file.status === 'done' && <Sparkles className="w-3 h-3 text-yellow-500 animate-pulse" />}
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 space-y-4">
             <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">{lang === 'ar' ? 'لغة البرمجة المستهدفة' : 'Target Language'}</label>
                <select 
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-white outline-none focus:border-purple-500"
                >
                  {['Python', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Flutter/Dart', 'Swift', 'C++', 'Java', 'PHP'].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
             </div>
             <button
               onClick={startReverseEngineering}
               disabled={isProcessing || projectFiles.length === 0}
               className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl"
             >
               {isProcessing ? <Loader2 className="animate-spin" /> : <GitBranch size={20} />}
               {lang === 'ar' ? 'هندسة عكسية وتحويل المشروع' : 'Start Full Project Conversion'}
             </button>
          </div>
        </div>

        {/* Results / Code Viewer */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
          {/* Info Card explaining logic of multi-file vs single file */}
          {projectFiles.length > 2 && (
            <div className="bg-orange-500/10 border-b border-orange-500/20 p-3 flex gap-3 items-center">
              <Zap className="w-5 h-5 text-orange-500 shrink-0" />
              <div className="text-[10px] leading-relaxed text-zinc-400">
                <p className="font-bold text-orange-500 mb-0.5">
                  {lang === 'ar' ? 'نمط المشاريع متعددة الملفات' : 'Multi-file Project Mode Active'}
                </p>
                {lang === 'ar' 
                  ? 'لماذا لا تظهر الواجهة؟ المشاريع الضخمة تتطلب بيئة تشغيل كاملة (Node/Docker). قمنا بتجهيز ملفاتك للتحميل حتى تبدأ العمل فوراً على جهازك الخاص.' 
                  : 'Why no interactive face? Large projects require a full runtime (Node/Docker). We’ve prepped your files for download so you can start working on your local machine instantly.'}
              </div>
            </div>
          )}

          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">{lang === 'ar' ? 'النتائج المصححة والمنطق المستخرج' : 'Conversion Results & Logic'}</span>
            </div>
            {projectFiles.filter(f => f.status === 'done').length > 0 && (
              <button 
                onClick={downloadConvertedProject}
                className="flex items-center gap-2 text-[10px] font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase"
              >
                <Download size={14} />
                {lang === 'ar' ? 'تحميل المشروع المحول' : 'Download All as ZIP'}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {projectFiles.filter(f => f.status === 'done').length === 0 && !isProcessing && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-700">
                <Sparkles size={64} className="mb-4 opacity-20" />
                <p className="text-sm font-bold opacity-50">{lang === 'ar' ? 'سيتم عرض الكود المحول والمنطق المحلل هنا' : 'Converted code and logic results will appear here'}</p>
              </div>
            )}
            
            {projectFiles.map((file, i) => file.convertedContent && (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden"
              >
                <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                  <span className="text-xs font-mono text-purple-400 flex items-center gap-2">
                    <FileCode size={14} />
                    {file.name} {'->'} {targetLang}
                  </span>
                  <button onClick={() => saveToInbox({ type: 'logic', content: file.convertedContent || '', metadata: { name: file.name, lang: targetLang } })} className="p-1.5 hover:bg-white/10 rounded">
                    <Save className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors" />
                  </button>
                </div>
                <pre className="p-4 text-[10px] text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto bg-black/40">
                  {file.convertedContent}
                </pre>
              </motion.div>
            ))}
            
            {isProcessing && currentFileIndex >= 0 && (
              <div className="p-12 flex flex-col items-center justify-center text-purple-400 space-y-4">
                 <Loader2 className="w-12 h-12 animate-spin opacity-50" />
                 <p className="text-[10px] font-mono uppercase tracking-[0.2em] animate-pulse">
                   {lang === 'ar' ? `جاري معالجة: ${projectFiles[currentFileIndex].name}` : `Processing: ${projectFiles[currentFileIndex].name}`}
                 </p>
                 <div className="w-64 h-1 bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-purple-500" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${((currentFileIndex + 1) / projectFiles.length) * 100}%` }} 
                    />
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

