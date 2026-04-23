import React, { useState, useRef } from 'react';
import { Play, Pause, Music, Palette, Wrench, Zap, Component, MessageSquare, CheckCircle2, Loader2, Link as LinkIcon, Search, FileText, Copy, Download } from 'lucide-react';
import { brandApi } from '../../api/brandApi';
import { motion } from 'framer-motion';
import { saveToInbox, copyToClipboard, downloadAsFile } from '../../lib/inbox';
import { toast } from 'sonner';

export const SmartChat = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input) return;
    setIsLoading(true);
    setMessages(prev => [...prev, {role: 'user', text: input}]);
    try {
      const res = await brandApi.chat(input, "general");
      setMessages(prev => [...prev, {role: 'agent', text: res.text}]);
      saveToInbox({ type: 'chat', content: `Q: ${input}\nA: ${res.text}` });
    } catch (e) {
      setMessages(prev => [...prev, {role: 'agent', text: 'Error connecting to agent.'}]);
    }
    setInput("");
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] border border-orange-500/20 bg-zinc-900 rounded-xl overflow-hidden">
      <div className="p-3 bg-orange-500/10 border-b border-orange-500/20 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-orange-500" />
        <h3 className="font-bold text-orange-500">{lang === 'ar' ? 'الدردشة الذكية (ذاكرة مستمرة)' : 'Smart Chat (Persistent Memory)'}</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-orange-500 text-black' : 'bg-zinc-800 text-zinc-300'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />}
      </div>
      <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 text-sm focus:border-orange-500 focus:outline-none"
        />
        <button onClick={handleSend} className="px-4 py-2 bg-orange-500 text-black rounded-lg text-sm font-bold">
          {lang === 'ar' ? 'إرسال' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export const LogoGeneratorLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [idea, setIdea] = useState("");
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generate = async () => {
    setIsLoading(true);
    try {
      const res = await brandApi.generateLogo("Custom Brand", idea);
      setLogo(res.logoUrl);
      saveToInbox({ type: 'logo', content: idea, metadata: { logoUrl: res.logoUrl } });
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-pink-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-pink-500" />
          <h3 className="font-bold text-pink-500">{lang === 'ar' ? 'مولد الشعارات المتقدم' : 'Advanced Logo Generator'}</h3>
        </div>
        {logo && (
          <button onClick={() => window.open(logo, '_blank')} className="p-1.5 hover:bg-white/10 rounded" title={lang === 'ar' ? 'تحميل' : 'Download'}><Download className="w-4 h-4 text-zinc-400" /></button>
        )}
      </div>
      <textarea 
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm focus:border-pink-500 focus:outline-none" 
        placeholder={lang === 'ar' ? 'وصف الشعار المطلوب...' : 'Describe the desired logo...'}
        value={idea}
        onChange={e => setIdea(e.target.value)}
      />
      <button onClick={generate} disabled={isLoading} className="w-full py-2 bg-pink-500 text-black font-bold rounded-lg text-sm">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (lang === 'ar' ? 'توليد الشعار' : 'Generate Logo')}
      </button>
      {logo && (
        <div className="mt-4 flex justify-center">
          <img src={logo} alt="Generated Logo" className="w-48 h-48 rounded-xl object-cover border border-zinc-700" referrerPolicy="no-referrer" />
        </div>
      )}
    </div>
  );
};

export const RepairLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [code, setCode] = useState("");
  const [fixed, setFixed] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setIsLoading(true);
    try {
      const res = await brandApi.analyzeCode(code);
      setFixed(res.fixedCode || "No issues found or could not fix.");
      saveToInbox({ type: 'repair', content: res.fixedCode || code });
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-green-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-green-500">{lang === 'ar' ? 'مختبر الإصلاح والأخطاء التلقائي' : 'Auto Bug Fix & Repair Lab'}</h3>
        </div>
        {fixed && (
          <div className="flex gap-2">
            <button onClick={() => copyToClipboard(fixed)} className="p-1.5 hover:bg-white/10 rounded"><Copy className="w-4 h-4 text-zinc-400" /></button>
            <button onClick={() => downloadAsFile(fixed, 'fixed_code.txt')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <textarea 
          className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono focus:border-green-500 focus:outline-none" 
          placeholder={lang === 'ar' ? 'ضع الكود المكسور هنا...' : 'Paste broken code here...'}
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <div className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono overflow-auto text-green-400">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : fixed || (lang === 'ar' ? 'نتيجة الإصلاح...' : 'Repair result...')}
        </div>
      </div>
      <button onClick={analyze} disabled={isLoading} className="w-full py-2 bg-green-500 text-black font-bold rounded-lg text-sm">
        {lang === 'ar' ? 'فحص وإصلاح' : 'Scan & Repair'}
      </button>
    </div>
  );
};

export const MontageStudio = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState("");
  const [scenes, setScenes] = useState<{timestamp: string, description: string, duration: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const res = await brandApi.generateMontage(prompt);
      if (res.storyboard && res.storyboard.scenes) {
        setScenes(res.storyboard.scenes);
        saveToInbox({ type: 'video', content: JSON.stringify(res.storyboard.scenes, null, 2) });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-purple-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-purple-500">{lang === 'ar' ? 'استوديو المونتاج والتعديل' : 'Video Montage Studio'}</h3>
        </div>
        {scenes.length > 0 && (
          <button onClick={() => downloadAsFile(JSON.stringify(scenes, null, 2), 'montage_storyboard.json')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
        )}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Describe your video (e.g. AI presentation with tech b-roll)" 
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={handleGenerate} disabled={isLoading} className="px-4 py-2 bg-purple-500 text-black font-bold rounded flex items-center gap-2 text-sm">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'ar' ? 'إخراج' : 'Direct')}
        </button>
      </div>

      <div className="w-full min-h-64 bg-black border border-zinc-800 rounded-lg flex flex-col relative overflow-hidden">
        {scenes.length > 0 ? (
          <div className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-20">
            {scenes.map((scene, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded p-3">
                 <div className="text-xs text-purple-400 font-mono mb-2">{scene.timestamp} ({scene.duration})</div>
                 <p className="text-sm text-zinc-300">{scene.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 pb-20">
            <Play className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-bold uppercase">{lang === 'ar' ? 'معاينة القصة' : 'Storyboard Preview'}</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-16 bg-zinc-900 border-t border-zinc-800 flex items-center px-4 gap-2 overflow-x-auto">
          {scenes.length > 0 ? scenes.map((scene, i) => ( // Fixed typo
             <div key={i} className="flex-none w-32 h-8 bg-purple-500/20 border border-purple-500/40 rounded flex items-center justify-center text-[10px] text-purple-400 overflow-hidden px-2 whitespace-nowrap text-ellipsis">Scene {i+1}</div>
          )) : (
            [1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 h-8 bg-purple-500/10 border border-purple-500/20 rounded flex items-center justify-center text-[10px] text-purple-900">Clip {i}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export const MusicLab = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [prompt, setPrompt] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const res = await brandApi.generateMusic(prompt);
      if (res.audioUrl) {
         setAudioUrl(res.audioUrl);
         saveToInbox({ type: 'music', content: prompt, metadata: { audioUrl: res.audioUrl } });
      }
    } catch(e) {}
    setIsLoading(false);
  };

  const togglePlay = () => {
    if (audioRef.current) {
       if (isPlaying) {
         audioRef.current.pause();
       } else {
         audioRef.current.play();
       }
       setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-zinc-900 border border-blue-500/20 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-blue-500">{lang === 'ar' ? 'مختبر الموسيقى والصوتيات' : 'Music & Audio Lab'}</h3>
        </div>
        {audioUrl && (
          <button onClick={() => window.open(audioUrl, '_blank')} className="p-1.5 hover:bg-white/10 rounded"><Download className="w-4 h-4 text-zinc-400" /></button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col">
          <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">{lang === 'ar' ? 'توليد من النص' : 'Text to Audio'}</h4>
          <textarea 
            className="w-full flex-1 min-h-[80px] bg-zinc-900 border border-zinc-800 rounded p-2 text-sm text-white focus:border-blue-500 focus:outline-none mb-2 resize-none" 
            placeholder="e.g. Cyberpunk synthwave background music..." 
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />
          <button onClick={handleGenerate} disabled={isLoading} className="w-full py-1.5 flex items-center justify-center gap-2 bg-blue-500 text-black font-bold rounded text-xs">
             {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate Track'}
          </button>
        </div>
        <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 flex flex-col justify-center gap-2 relative">
          
          {audioUrl && (
             <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
          )}

          {/* Fake waveform */}
          <div className="flex items-end gap-1 h-12 justify-center mb-2 overflow-hidden">
            {[...Array(20)].map((_, i) => (
               <div key={i} className={`w-2 ${isPlaying ? 'bg-blue-400 animate-pulse' : 'bg-blue-500/50'} rounded-t transition-all duration-300`} style={{ height: `${Math.random() * 100}%` }} />
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={togglePlay}
              disabled={!audioUrl}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${audioUrl ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-900 text-zinc-600'}`}>
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className={`w-3 h-3 ${audioUrl ? 'ml-1' : ''}`} />}
            </button>
          </div>
          {!audioUrl && !isLoading && (
            <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center text-xs text-zinc-500 font-bold">
               No Audio Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AutomationTasks = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-4 p-4 bg-zinc-900 border border-yellow-500/20 rounded-xl">
    <div className="flex items-center gap-2 mb-4">
      <Zap className="w-5 h-5 text-yellow-500" />
      <h3 className="font-bold text-yellow-500">{lang === 'ar' ? 'محرك الأتمتة (Automation Engine)' : 'Automation Engine'}</h3>
    </div>
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded"><Component className="w-4 h-4 text-yellow-500" /></div>
          <div>
            <h4 className="font-bold text-sm text-white">On Push to Main</h4>
            <span className="text-[10px] text-zinc-500">Trigger</span>
          </div>
        </div>
        <Zap className="w-4 h-4 text-zinc-600" />
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-900 rounded"><Wrench className="w-4 h-4 text-green-500" /></div>
          <div>
            <h4 className="font-bold text-sm text-white">Run Tests & Build</h4>
            <span className="text-[10px] text-zinc-500">Action</span>
          </div>
        </div>
      </div>
      <button className="w-full py-2 border border-dashed border-zinc-700 text-zinc-400 font-bold rounded-lg text-sm hover:text-white hover:border-zinc-500 transition-colors">
        {lang === 'ar' ? '+ إضافة مسار أتمتة جديد' : '+ Add New Workflow'}
      </button>
    </div>
  </div>
);

export const PluginManager = ({ lang }: { lang: 'en' | 'ar' }) => (
  <div className="space-y-4 p-4 bg-zinc-900 border border-teal-500/20 rounded-xl">
    <div className="flex items-center gap-2 mb-4">
      <Component className="w-5 h-5 text-teal-500" />
      <h3 className="font-bold text-teal-500">{lang === 'ar' ? 'إضافات النظام (Plugins & Tools)' : 'System Plugins & Tools'}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { name: "GitHub Integration", status: true },
        { name: "Vercel Deployments", status: true },
        { name: "Stripe Payments", status: false },
        { name: "SendGrid Emails", status: false },
      ].map((p, i) => (
        <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-lg">
          <span className="text-sm font-bold text-white">{p.name}</span>
          <button className={`w-10 h-5 rounded-full relative transition-colors ${p.status ? 'bg-teal-500' : 'bg-zinc-700'}`}>
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${p.status ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>
      ))}
    </div>
  </div>
);
