import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Loader2, Globe } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' }
];

export const OmniTranslator: React.FC<{ lang: 'en' | 'ar' }> = ({ lang }) => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('ar');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const srcName = LANGUAGES.find(l => l.code === sourceLang)?.name;
      const tgtName = LANGUAGES.find(l => l.code === targetLang)?.name;
      
      const prompt = `Translate the following text from ${srcName} to ${tgtName}. 
      Ensure the translation is natural, contextually accurate, and professionally phrased.
      Return ONLY the translated text, no explanations.
      
      Text to translate:
      ${text}`;

      const res = await brandApi.chat(prompt, "general");
      setTranslatedText(res.text.trim());
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل المشروع في الترجمة' : 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translatedText) {
      setText(translatedText);
      setTranslatedText('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(lang === 'ar' ? 'تم النسخ!' : 'Copied!');
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center gap-3">
        <Languages className="w-6 h-6 text-indigo-500" />
        <div>
          <h3 className="text-indigo-500 font-bold">{lang === 'ar' ? 'المترجم الذكي الشامل' : 'Omni Translator'}</h3>
          <p className="text-[10px] text-zinc-500">{lang === 'ar' ? 'ترجمة فورية بين جميع لغات العالم بدقة الـ AI' : 'Instant AI-powered translation across human languages'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center">
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ar' ? 'من' : 'From'}</label>
          <select 
            value={sourceLang} 
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:border-indigo-500 transition-colors outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>

        <button 
          onClick={swapLanguages}
          className="p-2 mt-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all transform hover:rotate-180"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-500 uppercase">{lang === 'ar' ? 'إلى' : 'To'}</label>
          <select 
            value={targetLang} 
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-200 focus:border-indigo-500 transition-colors outline-none"
          >
            {LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={lang === 'ar' ? 'أدخل النص المراد ترجمته هنا...' : 'Enter text to translate...'}
            className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-200 resize-none focus:border-indigo-500/50 transition-colors outline-none"
          />
        </div>

        <div className="relative group">
          <div className={`w-full h-48 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 overflow-auto whitespace-pre-wrap ${!translatedText && 'flex items-center justify-center italic text-zinc-600'}`}>
            {translatedText ? translatedText : (lang === 'ar' ? 'ستظهر الترجمة هنا...' : 'Translation will appear here...')}
          </div>
          {translatedText && (
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-zinc-800/80 backdrop-blur rounded-lg border border-zinc-700 text-zinc-400 hover:text-indigo-500 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !text.trim()}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {lang === 'ar' ? 'جاري الترجمة...' : 'Translating...'}
          </>
        ) : (
          <>
            <Globe className="w-5 h-5" />
            {lang === 'ar' ? 'ترجمة النص' : 'Translate Text'}
          </>
        )}
      </button>

      <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <p className="text-[10px] text-zinc-500 leading-relaxed italic">
          {lang === 'ar' 
            ? 'ملاحظة: هذا المترجم يستخدم نماذج لغوية متقدمة لضمان دقة المعنى وليس مجرد ترجمة حرفية.' 
            : 'Note: This translator uses advanced language models to ensure semantic accuracy rather than just literal word-for-word translation.'}
        </p>
      </div>
    </div>
  );
};
