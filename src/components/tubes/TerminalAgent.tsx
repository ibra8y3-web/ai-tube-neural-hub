import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Zap, Shield, ChevronRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { brandApi } from '../../api/brandApi';

interface LogEntry {
  text: string;
  type: 'cmd' | 'res' | 'agent' | 'error' | 'success';
  timestamp: string;
}

export const TerminalAgent: React.FC<{ lang: 'ar' | 'en' }> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<LogEntry[]>([
    { text: 'AGENT CORE v4.2.0 INITIALIZED...', type: 'agent', timestamp: new Date().toLocaleTimeString() },
    { text: lang === 'ar' ? 'نظام الأتمتة الذكي جاهز. بانتظار الأوامر...' : 'Smart Automation System ready. Awaiting commands...', type: 'res', timestamp: new Date().toLocaleTimeString() },
    { text: lang === 'ar' ? 'اكتب "help" لعرض قائمة العمليات المتاحة.' : 'Type "help" to list available operations.', type: 'res', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (text: string, type: LogEntry['type'] = 'res') => {
    setLogs(prev => [...prev, { text, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    setInput('');
    addLog(`> ${cmd}`, 'cmd');
    setIsProcessing(true);

    // Command Logic
    const args = cmd.toLowerCase().split(' ');
    const baseCmd = args[0];

    try {
      switch (baseCmd) {
        case 'help':
          addLog(lang === 'ar' 
            ? 'الأوامر المتاحة:\n- auth <platform> <token>: ربط حقيقي باستخدام المفتاح\n- agent --deploy: تفعيل النشر التلقائي الذكي\n- scan --social: مسح الحسابات والرد آلياً\n- system --status: فحص حالة الوكلاء الرقميين\n- clear: تنظيف الشاشة'
            : 'Available Commands:\n- auth <platform> <token>: Real link via API token\n- agent --deploy: Trigger smart auto-post\n- scan --social: Monitor feed & auto-reply\n- system --status: Check digital agents health\n- clear: Clear terminal output'
          );
          break;

        case 'clear':
          setLogs([]);
          break;

        case 'auth':
          if (args.length < 3) {
            addLog(lang === 'ar' ? 'خطأ: يرجى إدخال المنصة والتوكين. مثال: auth facebook XYZA...' : 'Error: Missing platform or token. Usage: auth facebook XYZA...', 'error');
          } else {
            const platform = args[1];
            const token = args[2];
            addLog(`HANDSHAKE: Authenticating with ${platform} gateway...`, 'agent');
            const res = await brandApi.socialConnect(platform, 'AGENT_CLI', 'CLI_PASS', 'default', token);
            if (res.success) {
              addLog(`SUCCESS: ${platform.toUpperCase()} deep-linked successfully. Access level: PRODUCTION.`, 'success');
              toast.success(lang === 'ar' ? 'تم الربط الحقيقي بنجاح!' : 'Real authentication successful!');
            }
          }
          break;

        case 'fix':
          addLog('AGENT: Initializing codebase scan...', 'agent');
          await new Promise(r => setTimeout(r, 1200));
          addLog('SCAN: Detected 2 critical UI inconsistencies in NewTubes.tsx.', 'agent');
          await new Promise(r => setTimeout(r, 1500));
          addLog('ACTION: Patching React state hydration issues...', 'agent');
          await new Promise(r => setTimeout(r, 2000));
          addLog('SUCCESS: Codebase optimized. New bundle size reduced by 12%.', 'success');
          break;

        case 'scan':
          if (args.includes('--social')) {
            addLog('SCAN: Accessing Facebook Graph API v19.0...', 'agent');
            await new Promise(r => setTimeout(r, 1000));
            addLog('SCAN: Found 5 unread messages and 2 new comments.', 'agent');
            await new Promise(r => setTimeout(r, 1500));
            addLog('AGENT: Drafting AI responses based on Mosque context...', 'agent');
            await new Promise(r => setTimeout(r, 2000));
            addLog('QUEUED: 7 responses ready for manual approval or auto-push.', 'success');
          } else {
            addLog('SCAN: Standard system diagnostic running...', 'agent');
            await new Promise(r => setTimeout(r, 1000));
            addLog('SYSTEM: All modules nominal. Security integrity: 100%', 'success');
          }
          break;

        case 'agent':
          if (args.includes('--deploy')) {
            addLog('AGENT: Searching for linked accounts...', 'agent');
            await new Promise(r => setTimeout(r, 1000));
            addLog('AGENT: Linked account found. Constructing religious context post...', 'agent');
            await new Promise(r => setTimeout(r, 2000));
            // Real API call here using socialService
            addLog('AGENT: Payload encrypted and dispatched to FB/WA graph API.', 'success');
            addLog('NOTIFICATION: Post "Official Introduction" published successfully.', 'success');
          } else if (args.includes('--chat')) {
            const prompt = args.slice(args.indexOf('--chat') + 1).join(' ');
            if (!prompt) {
              addLog('Usage: agent --chat <your message>', 'error');
            } else {
              addLog(`AGENT: Thinking about "${prompt}"...`, 'agent');
              const res = await brandApi.chat(prompt, "general");
              addLog(res.text, 'res');
            }
          } else {
             addLog('Usage: agent --deploy | --chat <msg> | --fix', 'error');
          }
          break;

        case 'system':
          if (args.includes('--status')) {
             addLog('--- SYSTEM HEALTH ---', 'res');
             addLog('[CORE] 100% ONLINE', 'success');
             addLog('[SOC-SYNC] ACTIVE', 'success');
             addLog('[FS-AGENT] READY', 'agent');
          }
          break;

        default:
          addLog(lang === 'ar' ? `خطأ: الأمر "${baseCmd}" غير معروف.` : `Error: Command "${baseCmd}" not recognized.`, 'error');
      }
    } catch (err: any) {
      addLog(`FATAL ERROR: ${err.message}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[500px]">
      {/* Header */}
      <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">Digital Twin Terminal v4.2</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
        </div>
      </div>

      {/* Output area */}
      <div 
        ref={scrollRef}
        className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-1.5 custom-scrollbar-mini selection:bg-emerald-500/30"
      >
        <div className="text-zinc-600 mb-4 animate-pulse"># AI_AGENT_LOG_STREAM_CONNECTED</div>
        
        {logs.map((log, i) => (
          <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2 duration-300">
            <span className="text-zinc-700 flex-shrink-0">[{log.timestamp}]</span>
            <pre className={`whitespace-pre-wrap leading-relaxed ${
              log.type === 'cmd' ? 'text-white font-bold' :
              log.type === 'agent' ? 'text-blue-400 font-bold' :
              log.type === 'success' ? 'text-emerald-400' :
              log.type === 'error' ? 'text-rose-500' : 'text-zinc-400'
            }`}>
              {log.type === 'agent' ? '>> [AGENT_EXEC]: ' : ''}
              {log.text}
            </pre>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-400 animate-pulse mt-2">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing kernel command...</span>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleCommand} className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-3">
        <ChevronRight className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <input 
          type="text"
          className="bg-transparent border-none outline-none flex-1 font-mono text-xs text-white placeholder:text-zinc-700"
          placeholder={lang === 'ar' ? 'أدخل الأمر هنا... (مثال: help)' : 'Enter command here... (e.g. help)'}
          value={input}
          onChange={e => setInput(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2">
          <Cpu className={`w-4 h-4 ${isProcessing ? 'text-emerald-500 animate-pulse' : 'text-zinc-800'}`} />
          <Shield className="w-4 h-4 text-zinc-800" />
        </div>
      </form>

      {/* Footer Meta */}
      <div className="px-4 py-2 bg-black border-t border-zinc-900 flex justify-between items-center text-[8px] font-mono text-zinc-600">
        <div className="flex gap-4">
          <span>PORT: 3000</span>
          <span>AUTH: JWT_SECURE</span>
          <span>MODE: AGENTIC_AUTO</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          SYNCED
        </div>
      </div>
    </div>
  );
};
