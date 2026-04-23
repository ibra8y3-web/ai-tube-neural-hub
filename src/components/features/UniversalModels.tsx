import React, { useState, useEffect } from 'react';
import { Database, Zap, Plus, CheckCircle2, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { brandApi } from '../../api/brandApi';

interface UniversalModelsProps {
  lang: 'ar' | 'en';
}

export const UniversalModels: React.FC<UniversalModelsProps> = ({ lang }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [bestModels, setBestModels] = useState<any[]>([]);
  const [modelName, setModelName] = useState('');
  const [provider, setProvider] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [tokenization, setTokenization] = useState('');
  const [agentType, setAgentType] = useState('general');
  const [apiKey, setApiKey] = useState('');

  const fetchModels = async () => {
    try {
      const [modelsData, bestModelsData] = await Promise.all([
        brandApi.getModels(),
        brandApi.getBestModels()
      ]);
      setModels(modelsData);
      setBestModels(bestModelsData);
    } catch (error) {
      console.error("Failed to fetch models");
    }
  };

  useEffect(() => {
    fetchModels();
    // Background sync on mount
    const backgroundSync = async () => {
      try {
        await brandApi.updateModels();
        fetchModels();
      } catch (error) {
        console.error("Background sync failed", error);
      }
    };
    backgroundSync();
    
    // Optional: Set up an interval for continuous syncing (e.g., every hour)
    const syncInterval = setInterval(backgroundSync, 60 * 60 * 1000);
    return () => clearInterval(syncInterval);
  }, []);

  const handleToggleModel = async (modelId: string, currentStatus: boolean) => {
    try {
      await brandApi.toggleModel(modelId, !currentStatus);
      toast.success(lang === 'ar' ? 'تم تحديث حالة النموذج' : 'Model status updated');
      fetchModels();
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل تحديث الحالة' : 'Failed to update status');
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const res = await brandApi.updateModels();
      toast.success(res.message);
      fetchModels();
    } catch (error) {
      toast.error(lang === 'ar' ? 'فشل في مزامنة النماذج' : 'Failed to sync models');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleValidateKey = async () => {
    if (!apiKey || !provider) {
      toast.error(lang === 'ar' ? 'يرجى إدخال المفتاح واختيار المزود' : 'Please enter key and select provider');
      return;
    }
    setIsValidating(true);
    try {
      const { isValid } = await brandApi.validateKey(provider, apiKey);
      if (isValid) {
        toast.success(lang === 'ar' ? 'المفتاح صالح وفعال!' : 'Key is valid and active!');
      } else {
        toast.error(lang === 'ar' ? 'المفتاح غير صالح أو منتهي الصلاحية' : 'Key is invalid or expired');
      }
    } catch (error) {
      toast.error('Validation error');
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddModel = async () => {
    if (!modelName || !provider || !apiUrl) {
      toast.error(lang === 'ar' ? 'يرجى تعبئة جميع الحقول' : 'Please fill all fields');
      return;
    }
    setIsAdding(true);
    try {
      await brandApi.addModel({
        name: modelName,
        provider,
        apiUrl,
        tokenization,
        agentType
      });
      toast.success(lang === 'ar' ? 'تمت إضافة النموذج بنجاح' : 'Model added successfully');
      setModelName('');
      setProvider('');
      setApiUrl('');
      setTokenization('');
      setAgentType('general');
      fetchModels();
    } catch (error: any) {
      toast.error(lang === 'ar' ? 'فشل في إضافة النموذج' : 'Failed to add model');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">
          {lang === 'ar' 
            ? 'ربط ودعم أي نموذج ذكاء اصطناعي عالمي عبر أي ترميز أو بروتوكول.' 
            : 'Link and support any universal AI model via any encoding or protocol.'}
        </p>
      </div>
      
      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-xs font-bold text-blue-400 mb-1 flex items-center gap-2">
          <Zap className="w-3 h-3" />
          {lang === 'ar' ? 'المحركات الأساسية نشطة' : 'Primary Engines Active'}
        </h4>
        <p className="text-[10px] text-zinc-400">
          {lang === 'ar' 
            ? 'تم دمج GROQ و Hugging Face و OpenRouter كمحركات أساسية. يتم التبديل التلقائي بينهم لضمان استمرارية الخدمة.' 
            : 'GROQ, Hugging Face, and OpenRouter are integrated. Automatic switching ensures service continuity.'}
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <h4 className="text-xs font-mono uppercase text-orange-500 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" /> {lang === 'ar' ? 'التحقق من المفاتيح' : 'Key Validation'}
        </h4>
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={lang === 'ar' ? 'أدخل مفتاح الـ API للتحقق' : 'Enter API Key to validate'} 
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:border-orange-500 outline-none" 
            />
            <button 
              onClick={handleValidateKey}
              disabled={isValidating}
              className="px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold border border-zinc-700"
            >
              {isValidating ? <Loader2 className="w-3 h-3 animate-spin" /> : (lang === 'ar' ? 'تحقق' : 'Check')}
            </button>
          </div>
        </div>

        <h4 className="text-xs font-mono uppercase text-orange-500 mb-4 flex items-center gap-2">
          <Zap className="w-3 h-3" /> {lang === 'ar' ? 'إضافة نموذج جديد' : 'Add New Model'}
        </h4>
        <div className="space-y-3">
          <input 
            type="text" 
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder={lang === 'ar' ? 'اسم النموذج (مثلاً: GPT-4, Claude 3)' : 'Model Name (e.g., GPT-4, Claude 3)'} 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:border-orange-500 outline-none" 
          />
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-400 focus:border-orange-500 outline-none"
          >
            <option value="">{lang === 'ar' ? 'اختر المزود' : 'Select Provider'}</option>
            <option value="Groq">Groq</option>
            <option value="OpenRouter">OpenRouter</option>
            <option value="Hugging Face">Hugging Face</option>
            <option value="Gemini">Gemini</option>
            <option value="Puter">Puter</option>
            <option value="Custom">Custom</option>
          </select>
          <input 
            type="text" 
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder={lang === 'ar' ? 'رابط الـ API أو نقطة النهاية' : 'API URL or Endpoint'} 
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-white focus:border-orange-500 outline-none" 
          />
          <select 
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-2 text-xs text-zinc-400 focus:border-orange-500 outline-none"
          >
            <option value="general">General Logic</option>
            <option value="coding">Coding</option>
            <option value="vision">Vision/Image</option>
            <option value="market">Market Analysis</option>
            <option value="seo">SEO</option>
            <option value="security">Security</option>
          </select>
          <button 
            onClick={handleAddModel}
            disabled={isAdding}
            className="w-full py-2 mt-2 bg-orange-500/10 text-orange-500 border border-orange-500/30 hover:bg-orange-500 hover:text-black font-medium rounded-lg transition-colors text-xs flex items-center justify-center gap-2"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {lang === 'ar' ? 'ربط النموذج' : 'Link Model'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-mono uppercase text-zinc-500 flex items-center justify-between">
          <span>{lang === 'ar' ? 'النماذج المتصلة' : 'Connected Models'} ({models.length})</span>
          <span className="text-[10px] text-orange-500">{lang === 'ar' ? 'التبديل التلقائي نشط' : 'Auto-Switching Active'}</span>
        </h4>
        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {models.map((model, i) => (
            <div key={i} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-orange-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${model.is_active ? 'bg-orange-500/10' : 'bg-zinc-800'}`}>
                    <Database className={`w-4 h-4 ${model.is_active ? 'text-orange-500' : 'text-zinc-500'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white truncate max-w-[150px]">
                        {lang === 'ar' ? 'محرك ذكاء' : 'AI Engine'} #{model.id?.slice(0, 4) || i + 100}
                      </p>
                      <span className="text-[8px] px-1 bg-zinc-800 text-zinc-400 rounded uppercase">{model.agent_type}</span>
                      {bestModels.some(bm => bm.type === model.agent_type && bm.model.name === model.name) && (
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] px-1 bg-orange-500/20 text-orange-500 rounded font-bold border border-orange-500/30 animate-pulse">
                            OPTIMIZED
                          </span>
                          <span className="text-[8px] px-1 bg-green-500/20 text-green-500 rounded font-bold border border-green-500/30">
                            LIVE
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      {lang === 'ar' ? 'مزود معتمد' : 'Verified Provider'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${model.is_active ? 'text-green-500 bg-green-500/10' : 'text-zinc-500 bg-zinc-800'}`}
                  >
                    {model.is_active ? (lang === 'ar' ? 'نشط' : 'Active') : (lang === 'ar' ? 'معطل' : 'Disabled')}
                  </span>
                  {model.is_verified && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 italic pl-12 line-clamp-1">{model.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
