import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, FileCode, ArrowRight, Download, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';
import JSZip from 'jszip';

export const ProjectTranspiler = () => {
  const [sourceCode, setSourceCode] = useState('');
  const [targetFramework, setTargetFramework] = useState('Flutter');
  const [isTranspiling, setIsTranspiling] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedStates, setCopiedStates] = useState<Record<number, boolean>>({});

  const handleTranspile = async () => {
    if (!sourceCode) {
      toast.error('يرجى إدخال الكود المصدري أولاً');
      return;
    }

    setIsTranspiling(true);
    try {
      const prompt = `CRITICAL: Transpile the following React code to ${targetFramework}.
      STRICT RULES:
      1. DO NOT return random numbers or decimals.
      2. Provide the output as a valid JSON object starting with { and ending with }.
      3. It MUST contain a 'files' array, where each item has 'path' and 'content'.
      4. Reconstruct the full project structure.
      5. IGNORE hallucinated confidence scores or sequence IDs.
      
      Source Code:
      ${sourceCode}`;

      const res = await brandApi.generateChat(prompt, 'coding');
      const response = res?.text?.trim() || "";
      
      // Guard against numeric hallucinations
      if (/^[0-9.]+$/.test(response)) {
         throw new Error("Invalid output received (hallucinated numbers). Please try again.");
      }
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        setResult(JSON.parse(jsonMatch[0]));
        toast.success('تم تحويل المشروع بنجاح');
      } else {
        setResult({ files: [{ path: `main.${targetFramework === 'Flutter' ? 'dart' : 'tsx'}`, content: response }] });
        toast.success('تم التحويل بنجاح (ملف واحد)');
      }
    } catch (error) {
      toast.error('فشل تحويل المشروع');
    } finally {
      setIsTranspiling(false);
    }
  };

  const handleDownloadAll = async () => {
    if (!result?.files) return;
    const zip = new JSZip();
    result.files.forEach((f: any) => {
      zip.file(f.path, f.content);
    });
    const content = await zip.generateAsync({ type: 'blob' });
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `project_${targetFramework.toLowerCase()}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('تم تحميل المشروع كـ ZIP');
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
            <RefreshCw className="text-blue-400" />
            محول المشاريع (Project Transpiler)
          </h2>
          <p className="text-gray-400">حول مشاريعك من React إلى Flutter أو Next.js بضغطة زر</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-black/40 border border-white/10 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">الكود المصدري (React)</label>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              placeholder="الصق كود React هنا..."
              className="w-full h-[400px] bg-transparent border-none focus:ring-0 text-gray-300 font-mono text-sm resize-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <select
              value={targetFramework}
              onChange={(e) => setTargetFramework(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
            >
              <option value="Flutter">Flutter</option>
              <option value="Next.js">Next.js</option>
              <option value="SwiftUI">SwiftUI</option>
            </select>

            <button
              onClick={handleTranspile}
              disabled={isTranspiling}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 font-medium flex items-center justify-center gap-2 transition-all"
            >
              {isTranspiling ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
              تحويل المشروع الآن
            </button>
          </div>
        </div>

        <div className="bg-black/40 border border-white/10 rounded-xl p-4 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-medium text-gray-400">هيكل المشروع الناتج ({targetFramework})</label>
            {result && (
              <button onClick={handleDownloadAll} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                <Download size={14} />
                تحميل الكل (ZIP)
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-4">
            {!result && !isTranspiling && (
              <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
                <FileCode size={48} className="opacity-20" />
                <p>سيظهر المشروع المحول هنا</p>
              </div>
            )}

            {isTranspiling && (
              <div className="h-full flex flex-col items-center justify-center text-blue-400 space-y-2">
                <Loader2 size={48} className="animate-spin opacity-50" />
                <p>جاري إعادة بناء المشروع...</p>
              </div>
            )}

            {result?.files?.map((file: any, idx: number) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/5 rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-300">{file.path}</span>
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
