import React, { useState } from 'react';
import { TrendingUp, Code, ShieldCheck, Loader2, CheckCircle2, AlertTriangle, AlertCircle, Wrench, Copy, Download } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { toast } from 'sonner';
import { saveToInbox, copyToClipboard, downloadAsFile, getExtensionForType } from '../../lib/inbox';

interface SmartToolsProps {
  lang: 'ar' | 'en';
}

export const SmartTools: React.FC<SmartToolsProps> = ({ lang }) => {
  const [activeTool, setActiveTool] = useState<'seo' | 'formatter' | 'security' | 'techeye' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // SEO State
  const [seoContent, setSeoContent] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoResult, setSeoResult] = useState<any>(null);

  // Tech Eye State
  const [errorImage, setErrorImage] = useState<string | null>(null);
  const [techEyeResult, setTechEyeResult] = useState<any>(null);

  const handleTechEye = async () => {
    if (!errorImage) {
      toast.error(lang === 'ar' ? 'يرجى رفع صورة الخطأ أولاً' : 'Please upload an error image first');
      return;
    }
    setIsLoading(true);
    try {
      const prompt = `Analyze this error screenshot. Identify the error message, the likely cause, and provide a step-by-step fix.
      Return a JSON object with:
      - 'errorName': string
      - 'cause': string
      - 'solution': Array of strings
      - 'fixedCodeSnippet': string (if applicable)`;

      const res = await brandApi.visionChat(prompt, errorImage);
      const result = res.text;
      
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        setTechEyeResult(parsed);
        saveToInbox({ type: 'repair', content: `Error: ${parsed.errorName}\nSolution: ${parsed.solution.join(', ')}`, metadata: { errorImage } });
        toast.success(lang === 'ar' ? 'تم تحليل الخطأ بنجاح' : 'Error analyzed successfully');
      } else {
        toast.error(lang === 'ar' ? 'فشل تحليل الصورة' : 'Failed to analyze image');
      }
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل التحليل' : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setErrorImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (activeTool === 'techeye') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full">
        <button onClick={() => setActiveTool(null)} className="text-sm text-zinc-400 hover:text-white mb-4">
          &larr; {lang === 'ar' ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {lang === 'ar' ? 'العين التقنية (Tech Eye)' : 'Tech Eye (Error Analyzer)'}
          </h3>
          {techEyeResult && (
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(JSON.stringify(techEyeResult, null, 2))} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
              <button onClick={() => downloadAsFile(JSON.stringify(techEyeResult, null, 2), 'tech_eye_analysis.json')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div 
            className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer relative overflow-hidden"
            onClick={() => document.getElementById('error-upload')?.click()}
          >
            {errorImage ? (
              <img src={errorImage} alt="Error" className="w-full h-full object-contain" />
            ) : (
              <>
                <AlertCircle className="w-8 h-8 text-zinc-600" />
                <p className="text-xs text-zinc-500">{lang === 'ar' ? 'ارفع صورة الخطأ هنا' : 'Upload error screenshot here'}</p>
              </>
            )}
            <input 
              id="error-upload" 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleImageUpload}
            />
          </div>

          <button
            onClick={handleTechEye}
            disabled={isLoading || !errorImage}
            className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-500 transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
            {lang === 'ar' ? 'تحليل الخطأ بالذكاء الاصطناعي' : 'Analyze Error with AI'}
          </button>
        </div>

        {techEyeResult && (
          <div className="mt-6 space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800 overflow-y-auto">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-400 text-xs font-bold uppercase mb-1">{lang === 'ar' ? 'الخطأ المكتشف' : 'Detected Error'}</h4>
              <p className="text-white font-mono text-sm">{techEyeResult.errorName}</p>
            </div>

            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-1">{lang === 'ar' ? 'السبب المحتمل' : 'Likely Cause'}</h4>
              <p className="text-zinc-300 text-sm">{techEyeResult.cause}</p>
            </div>

            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'خطوات الحل' : 'Solution Steps'}</h4>
              <ul className="space-y-2">
                {techEyeResult.solution.map((step: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="w-5 h-5 bg-zinc-800 rounded flex items-center justify-center text-[10px] flex-shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {techEyeResult.fixedCodeSnippet && (
              <div>
                <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'الكود المصحح' : 'Fixed Code'}</h4>
                <pre className="bg-black/50 p-3 rounded-lg text-[10px] text-green-400 font-mono overflow-x-auto">
                  {techEyeResult.fixedCodeSnippet}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Formatter State
  const [formatterCode, setFormatterCode] = useState('// Write or paste your code here\nfunction hello() {\nconsole.log("world")\n}');
  const [formatterResult, setFormatterResult] = useState('');

  // Security State
  const [securityCode, setSecurityCode] = useState('// Paste code to analyze for vulnerabilities\nconst dbPassword = "my_secret_password";\nfunction login(user, pass) {\n  if(pass == dbPassword) return true;\n}');
  const [securityResult, setSecurityResult] = useState<any>(null);

  const handleSEO = async () => {
    if (!seoContent || !seoKeywords) {
      toast.error(lang === 'ar' ? 'يرجى إدخال المحتوى والكلمات المفتاحية' : 'Please enter content and keywords');
      return;
    }
    setIsLoading(true);
    try {
      const keywordsArray = seoKeywords.split(',').map(k => k.trim());
      const result = await brandApi.optimizeSEO(seoContent, keywordsArray);
      setSeoResult(result);
      saveToInbox({ type: 'seo', content: result.optimizedContent || JSON.stringify(result, null, 2) });
      toast.success(lang === 'ar' ? 'تم التحليل بنجاح' : 'Analysis successful');
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل التحليل' : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormatter = async () => {
    if (!formatterCode) return;
    setIsLoading(true);
    try {
      const result = await brandApi.analyzeCode(formatterCode);
      setFormatterResult(result.fixedCode);
      saveToInbox({ type: 'formatter', content: result.fixedCode });
      toast.success(lang === 'ar' ? 'تم تنسيق الكود بنجاح' : 'Code formatted successfully');
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل التنسيق' : 'Formatting failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecurity = async () => {
    if (!securityCode) return;
    setIsLoading(true);
    try {
      const result = await brandApi.analyzeSecurity(securityCode);
      setSecurityResult(result);
      saveToInbox({ type: 'security', content: JSON.stringify(result, null, 2) });
      toast.success(lang === 'ar' ? 'تم فحص الأمان بنجاح' : 'Security check completed');
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل الفحص' : 'Check failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeTool === 'seo') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <button onClick={() => setActiveTool(null)} className="text-sm text-zinc-400 hover:text-white mb-4">
          &larr; {lang === 'ar' ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-orange-500 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {lang === 'ar' ? 'مُحسّن محركات البحث (SEO)' : 'SEO Optimizer'}
          </h3>
          {seoResult && (
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(JSON.stringify(seoResult, null, 2))} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
              <button onClick={() => downloadAsFile(JSON.stringify(seoResult, null, 2), 'seo_analysis.json')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
            </div>
          )}
        </div>
        <textarea
          value={seoContent}
          onChange={(e) => setSeoContent(e.target.value)}
          placeholder={lang === 'ar' ? 'أدخل النص هنا...' : 'Enter content here...'}
          className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none"
        />
        <input
          type="text"
          value={seoKeywords}
          onChange={(e) => setSeoKeywords(e.target.value)}
          placeholder={lang === 'ar' ? 'الكلمات المفتاحية (مفصولة بفاصلة)' : 'Keywords (comma separated)'}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-sm text-white focus:border-orange-500 outline-none"
        />
        <button
          onClick={handleSEO}
          disabled={isLoading}
          className="w-full py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-400 transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
          {lang === 'ar' ? 'تحليل وتحسين' : 'Analyze & Optimize'}
        </button>

        {seoResult && (
          <div className="mt-6 space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-1">{lang === 'ar' ? 'العنوان المحسن' : 'Optimized Title'}</h4>
              <p className="text-white font-medium">{seoResult.optimizedTitle}</p>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-1">{lang === 'ar' ? 'الوصف التعريفي' : 'Meta Description'}</h4>
              <p className="text-zinc-300 text-sm">{seoResult.metaDescription}</p>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'كلمات مفتاحية مقترحة' : 'Suggested Keywords'}</h4>
              <div className="flex flex-wrap gap-2">
                {seoResult.keywordSuggestions?.map((k: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'تحسينات مقترحة' : 'Suggested Improvements'}</h4>
              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                {seoResult.contentImprovements?.map((imp: string, i: number) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (activeTool === 'formatter') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full">
        <button onClick={() => setActiveTool(null)} className="text-sm text-zinc-400 hover:text-white mb-4">
          &larr; {lang === 'ar' ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-blue-500 flex items-center gap-2">
            <Code className="w-5 h-5" />
            {lang === 'ar' ? 'منسق الأكواد الذكي' : 'Smart Code Formatter'}
          </h3>
          {formatterResult && (
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(formatterResult)} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
              <button onClick={() => downloadAsFile(formatterResult, `formatted_code.${getExtensionForType('code', formatterResult)}`)} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
            </div>
          )}
        </div>
        <textarea
          value={formatterCode}
          onChange={(e) => setFormatterCode(e.target.value)}
          className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-white font-mono focus:border-blue-500 outline-none resize-none"
          spellCheck={false}
        />
        <button
          onClick={handleFormatter}
          disabled={isLoading}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-400 transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Code className="w-5 h-5" />}
          {lang === 'ar' ? 'تنسيق وإصلاح الكود' : 'Format & Fix Code'}
        </button>
        
        {formatterResult && (
          <div className="mt-4">
            <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'النتيجة' : 'Result'}</h4>
            <textarea
              readOnly
              value={formatterResult}
              className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-white font-mono outline-none resize-none"
              spellCheck={false}
            />
          </div>
        )}
      </div>
    );
  }

  if (activeTool === 'security') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full">
        <button onClick={() => setActiveTool(null)} className="text-sm text-zinc-400 hover:text-white mb-4">
          &larr; {lang === 'ar' ? 'العودة للأدوات' : 'Back to Tools'}
        </button>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-green-500 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            {lang === 'ar' ? 'مدقق الأمان' : 'Security Checker'}
          </h3>
          {securityResult && (
            <div className="flex gap-2">
              <button onClick={() => copyToClipboard(JSON.stringify(securityResult, null, 2))} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
              <button onClick={() => downloadAsFile(JSON.stringify(securityResult, null, 2), 'security_audit.json')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
            </div>
          )}
        </div>
        <textarea
          value={securityCode}
          onChange={(e) => setSecurityCode(e.target.value)}
          className="w-full h-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-white font-mono focus:border-green-500 outline-none resize-none"
          spellCheck={false}
        />
        <button
          onClick={handleSecurity}
          disabled={isLoading}
          className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-400 transition-colors flex justify-center items-center gap-2"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
          {lang === 'ar' ? 'فحص الأمان' : 'Run Security Check'}
        </button>

        {securityResult && (
          <div className="mt-6 space-y-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <h4 className="text-zinc-400 text-xs uppercase">{lang === 'ar' ? 'درجة الأمان' : 'Security Score'}</h4>
              <span className={`text-xl font-black ${securityResult.score > 80 ? 'text-green-500' : securityResult.score > 50 ? 'text-orange-500' : 'text-red-500'}`}>
                {securityResult.score}/100
              </span>
            </div>
            
            {securityResult.vulnerabilities?.length > 0 ? (
              <div>
                <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'الثغرات المكتشفة' : 'Detected Vulnerabilities'}</h4>
                <div className="space-y-2">
                  {securityResult.vulnerabilities.map((v: any, i: number) => (
                    <div key={i} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                      <div className="flex items-center gap-2 mb-1">
                        {v.severity === 'High' ? <AlertCircle className="w-4 h-4 text-red-500" /> : 
                         v.severity === 'Medium' ? <AlertTriangle className="w-4 h-4 text-orange-500" /> : 
                         <AlertCircle className="w-4 h-4 text-yellow-500" />}
                        <span className="font-bold text-sm text-zinc-200">{v.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{v.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-500 p-3 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">{lang === 'ar' ? 'لم يتم اكتشاف ثغرات خطيرة' : 'No critical vulnerabilities detected'}</span>
              </div>
            )}

            {securityResult.recommendations?.length > 0 && (
              <div>
                <h4 className="text-zinc-400 text-xs uppercase mb-2">{lang === 'ar' ? 'توصيات الأمان' : 'Security Recommendations'}</h4>
                <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                  {securityResult.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
        <h3 className="text-purple-500 font-bold mb-2 flex items-center gap-2">
          <Wrench className="w-4 h-4" />
          {lang === 'ar' ? 'أدوات الذكاء الاصطناعي' : 'AI Smart Tools'}
        </h3>
        <p className="text-sm text-zinc-400">
          {lang === 'ar' ? 'مجموعة من الأدوات الذكية المساعدة لتطوير وتحسين مشاريعك.' : 'A collection of smart assistant tools to develop and improve your projects.'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => setActiveTool('seo')}
          className="flex items-start gap-4 p-4 bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-xl transition-all text-left group"
        >
          <div className="p-2 bg-zinc-800 group-hover:bg-orange-500/20 rounded-lg text-zinc-400 group-hover:text-orange-500 transition-colors">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 group-hover:text-white mb-1">
              {lang === 'ar' ? 'مُحسّن محركات البحث (SEO)' : 'SEO Optimizer'}
            </h4>
            <p className="text-xs text-zinc-500">
              {lang === 'ar' ? 'تحليل وتحسين نصوصك لتصدر نتائج البحث.' : 'Analyze and optimize your texts to rank higher in search results.'}
            </p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTool('formatter')}
          className="flex items-start gap-4 p-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 rounded-xl transition-all text-left group"
        >
          <div className="p-2 bg-zinc-800 group-hover:bg-blue-500/20 rounded-lg text-zinc-400 group-hover:text-blue-500 transition-colors">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 group-hover:text-white mb-1">
              {lang === 'ar' ? 'منسق الأكواد الذكي' : 'Smart Code Formatter'}
            </h4>
            <p className="text-xs text-zinc-500">
              {lang === 'ar' ? 'تنسيق وتنظيف الأكواد البرمجية تلقائياً.' : 'Automatically format and clean up source code.'}
            </p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTool('security')}
          className="flex items-start gap-4 p-4 bg-zinc-900 border border-zinc-800 hover:border-green-500/50 rounded-xl transition-all text-left group"
        >
          <div className="p-2 bg-zinc-800 group-hover:bg-green-500/20 rounded-lg text-zinc-400 group-hover:text-green-500 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 group-hover:text-white mb-1">
              {lang === 'ar' ? 'مدقق الأمان' : 'Security Checker'}
            </h4>
            <p className="text-xs text-zinc-500">
              {lang === 'ar' ? 'فحص الأكواد لاكتشاف الثغرات الأمنية.' : 'Scan code to discover security vulnerabilities.'}
            </p>
          </div>
        </button>

        <button 
          onClick={() => setActiveTool('techeye')}
          className="flex items-start gap-4 p-4 bg-zinc-900 border border-zinc-800 hover:border-red-500/50 rounded-xl transition-all text-left group"
        >
          <div className="p-2 bg-zinc-800 group-hover:bg-red-500/20 rounded-lg text-zinc-400 group-hover:text-red-500 transition-colors">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-zinc-200 group-hover:text-white mb-1">
              {lang === 'ar' ? 'العين التقنية (Tech Eye)' : 'Tech Eye'}
            </h4>
            <p className="text-xs text-zinc-500">
              {lang === 'ar' ? 'تحليل صور الأخطاء البرمجية وإيجاد الحلول فوراً.' : 'Analyze error screenshots and find solutions instantly.'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
