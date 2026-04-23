import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Code, Download, Copy, Share2, Loader2, FileCode, CheckCircle2 } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';
import JSZip from 'jszip';

export const SDKGenerator = () => {
  const [botDescription, setBotDescription] = useState('');
  const [language, setLanguage] = useState('TypeScript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sdk, setSdk] = useState<any>(null);
  const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});

  const handleGenerate = async () => {
    if (!botDescription) {
      toast.error('يرجى وصف البوت أولاً');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate a professional SDK library in ${language} for an AI bot with the following description:
      ${botDescription}
      
      Include:
      1. Main client class
      2. Authentication methods
      3. Core functionality methods
      4. Usage example
      5. README content
      
      Return as a JSON object with 'files' array (path, content).`;

      const res = await brandApi.generateChat(prompt, 'coding');
      const response = res.text;
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setSdk(JSON.parse(jsonMatch[0]));
        toast.success('تم إنشاء مكتبة الـ SDK بنجاح');
      } else {
        setSdk({ files: [{ path: `sdk.${language === 'TypeScript' ? 'ts' : 'py'}`, content: response }] });
        toast.success('تم الإنشاء بنجاح (ملف واحد)');
      }
    } catch (error) {
      toast.error('فشل إنشاء الـ SDK');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!sdk?.files) return;
    const zip = new JSZip();
    sdk.files.forEach((f: any) => {
      zip.file(f.path, f.content);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sdk_${language.toLowerCase()}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('تم تحميل المكتبة كـ ZIP');
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedStates(prev => ({ ...prev, [idx]: true }));
    toast.success('تم النسخ');
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [idx]: false })), 2000);
  };

  const handleDownloadFile = (file: any) => {
    const blob = new Blob([file.content], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.path.split('/').pop() || 'file';
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('تم تحميل الملف');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="text-orange-400" />
            مصنع الـ SDK (SDK Generator)
          </h2>
          <p className="text-gray-400">حول بوتاتك إلى مكتبات برمجية جاهزة للاستخدام (SaaS)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">وصف البوت ووظائفه</label>
            <textarea
              value={botDescription}
              onChange={(e) => setBotDescription(e.target.value)}
              placeholder="صف ما يفعله البوت وكيفية استخدامه..."
              className="w-full h-[300px] bg-transparent border-none focus:ring-0 text-gray-300 font-mono text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-orange-500 transition-colors"
            >
              <option value="TypeScript">TypeScript / JS</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
              <option value="Java">Java</option>
            </select>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Package size={18} />}
              إنشاء مكتبة الـ SDK
            </button>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-400">ملفات المكتبة الناتجة</label>
            {sdk && (
              <button onClick={handleDownloadAll} className="text-orange-400 hover:text-orange-300 text-sm flex items-center gap-1">
                <Download size={14} />
                تحميل المكتبة (ZIP)
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {!sdk && !isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                <FileCode size={48} className="opacity-20" />
                <p>ستظهر ملفات الـ SDK هنا</p>
              </div>
            )}

            {isGenerating && (
              <div className="h-full flex flex-col items-center justify-center text-orange-400 space-y-2">
                <Loader2 size={48} className="animate-spin opacity-50" />
                <p>جاري توليد الكود المصدري...</p>
              </div>
            )}

            {sdk?.files?.map((file: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/5 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-orange-300">{file.path}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(file.content, idx)} className="text-gray-500 hover:text-white transition-colors">
                      {copiedStates[idx] ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => handleDownloadFile(file)} className="text-gray-500 hover:text-white transition-colors">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
                <pre className="text-xs text-gray-400 font-mono overflow-x-auto p-2 bg-black/20 rounded">
                  {file.content}
                </pre>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
