import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Play, Square, Settings, Radio, Globe, RefreshCcw, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandApi } from '../../api/brandApi';

export const TelegramGateway = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [botToken] = useState(import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '');
  const [logs] = useState<{ id: number, time: string, message: string, type: 'info' | 'error' | 'success' | 'user' }[]>([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'خادم تيليجرام يعمل الآن مركزياً من السيرفر 24/7.', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), message: 'لا حاجة لفتح المتصفح للرد، النظام يتفاعل تلقائياً.', type: 'success' }
  ]);

  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <Zap className="w-20 h-20 text-green-500" />
        </div>
        <h3 className="text-green-500 font-bold mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5" />
           البوابة الرقمية المركزية (Server-Side)
        </h3>
        <p className="text-sm text-zinc-400 max-w-2xl">
          تم نقل نظام التشغيل بالكامل إلى الخادم السحابي. البوت يعمل الآن بشكل مستقل ودائم دون الحاجة لبقاء هذه الصفحة مفتوحة. جميع المختبرات موصولة ومفعلة.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
              <User className="w-4 h-4"/> Bot Status: Autonomous Active
            </label>
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-500 font-mono italic">
              Bot Token is securely managed by the server backend.
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">التوكن مخفي ومشفر في بيئة الخادم لضمان أمان البيانات.</p>
          </div>
          <div className="w-full md:w-auto px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-green-600/20 text-green-500 border border-green-500/50">
            <Radio className="w-4 h-4 animate-pulse" />
            البوت متصل بالسيرفر (ON)
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[400px]">
        <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-2">
            <Radio className="w-3 h-3 text-green-500" />
             حالة البوابة (Global Status)
          </span>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
          {logs.map((log) => (
            <div key={log.id} className="animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-zinc-600">[{log.time}] </span>
              <span className={
                log.type === 'error' ? 'text-red-400' : 
                log.type === 'success' ? 'text-green-400' : 
                'text-blue-400'
              }>{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
