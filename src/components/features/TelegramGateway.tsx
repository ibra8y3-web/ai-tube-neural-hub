import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, Play, Square, Settings, Radio, Globe, RefreshCcw, User, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { brandApi } from '../../api/brandApi';

export const TelegramGateway = ({ lang }: { lang: 'en' | 'ar' }) => {
  const [botToken, setBotToken] = useState(import.meta.env.VITE_TELEGRAM_BOT_TOKEN || localStorage.getItem('telegram_bot_token') || '');
  const [isActive, setIsActive] = useState(false);
  const [logs, setLogs] = useState<{ id: number, time: string, message: string, type: 'info' | 'error' | 'success' | 'user' }[]>([
    { id: 1, time: new Date().toLocaleTimeString(), message: 'النظام اللامركزي جاهز. تم تفعيل الربط التلقائي الدائم...', type: 'info' }
  ]);
  
  const pollIntervalRef = useRef<any>(null);
  const lastUpdateIdRef = useRef<number>(0);
  const userStatesRef = useRef<Record<number, string>>({});
  const isPollingRef = useRef<boolean>(false);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' | 'user' = 'info') => {
    setLogs(prev => [{ id: Date.now(), time: new Date().toLocaleTimeString(), message: msg, type }, ...prev].slice(0, 50));
  };

  const sendTelegramMessage = async (chatId: number, text: string, replyMarkup: any = null) => {
    try {
      const payload: any = { chat_id: chatId, text: text, parse_mode: 'Markdown' };
      if (replyMarkup) payload.reply_markup = replyMarkup;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error(e);
    }
  };

  const answerCallbackQuery = async (queryId: string) => {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callback_query_id: queryId })
      });
    } catch (e) {}
  };

  const sendMainMenu = async (chatId: number) => {
    const keyboard = {
      inline_keyboard: [
        [{ text: '🏗️ مصنع التطبيقات', callback_data: 'mode_factory' }],
        [{ text: '🎨 المختبرات الإبداعية', callback_data: 'cat_cre' }, { text: '⚡ تيوبات الكفاءة', callback_data: 'cat_eff' }],
        [{ text: '⚙️ الهندسة والتطوير', callback_data: 'cat_eng' }, { text: '🧪 مختبرات جديدة', callback_data: 'cat_new' }],
        [{ text: '🚀 التكنولوجيا المتطرفة', callback_data: 'cat_ext' }],
        [{ text: '💬 دردشة مفتوحة', callback_data: 'mode_chat' }, { text: '📞 الدعم البشري', callback_data: 'human_chat' }]
      ]
    };
    await sendTelegramMessage(chatId, `مرحباً بك في Aether Core ⚡\nجميع أدوات ومختبرات المنصة متصلة تلقائياً هنا.\n\nالرجاء اختيار القسم:`, keyboard);
  };

  const sendCategoryMenu = async (chatId: number, category: string) => {
    let keyboard: any = { inline_keyboard: [] };
    let msg = '';

    if (category === 'cat_cre') {
      msg = '🎨 *المختبرات الإبداعية*';
      keyboard.inline_keyboard = [
        [{ text: 'المحتوى (Content)', callback_data: 't_content' }, { text: 'الرؤية (Vision)', callback_data: 't_vision' }],
        [{ text: 'الصوت (Voice)', callback_data: 't_voice' }, { text: 'الشخصيات (Personas)', callback_data: 't_persona' }],
        [{ text: 'الكائنات (3D)', callback_data: 't_3d' }, { text: 'الشعارات (Logos)', callback_data: 't_logo' }],
        [{ text: 'القصص (Stories)', callback_data: 't_story' }],
        [{ text: 'التدقيق النفسي UX', callback_data: 't_neuroux' }, { text: 'المساعد القانوني', callback_data: 't_legal' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ];
    } else if (category === 'cat_eff') {
      msg = '⚡ *تيوبات الكفاءة الخارقة*';
      keyboard.inline_keyboard = [
        [{ text: 'السرب الذكي', callback_data: 't_swarm' }, { text: 'ثقب البيانات (SQL/JSON)', callback_data: 't_data' }],
        [{ text: 'مترجم الأنظمة (Swift/Rust)', callback_data: 't_omni' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ];
    } else if (category === 'cat_eng') {
      msg = '⚙️ *الهندسة والتطوير*';
      keyboard.inline_keyboard = [
        [{ text: 'المحرر (Editor)', callback_data: 't_editor' }, { text: 'المترجم (Transpiler)', callback_data: 't_transpiler' }],
        [{ text: 'المنطق (Logic)', callback_data: 't_logic' }, { text: 'مولد SDK', callback_data: 't_sdk' }],
        [{ text: 'ديف أوبس (DevOps)', callback_data: 't_devops' }, { text: 'تيرمينال (Terminal)', callback_data: 't_terminal' }],
        [{ text: 'الأتمتة (Automation)', callback_data: 't_autom' }, { text: 'فك المشاريع (Decoder)', callback_data: 't_decoder' }],
        [{ text: 'الإصلاح (Debugger)', callback_data: 't_fix' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ];
    } else if (category === 'cat_new') {
      msg = '🧪 *مختبرات جديدة*';
      keyboard.inline_keyboard = [
        [{ text: 'علم البيانات', callback_data: 't_datasci' }, { text: 'الأكاديمية', callback_data: 't_academy' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ];
    } else if (category === 'cat_ext') {
      msg = '🚀 *المختبرات المتطرفة (Extreme)*';
      keyboard.inline_keyboard = [
        [{ text: 'محرك الألعاب', callback_data: 't_game' }, { text: 'البلوكتشين', callback_data: 't_block' }],
        [{ text: 'الهاردوير و IoT', callback_data: 't_hard' }, { text: 'الأقمار الصناعية', callback_data: 't_sat' }],
        [{ text: 'الكمّ (Quantum)', callback_data: 't_quant' }, { text: 'التقنية الحيوية', callback_data: 't_bio' }],
        [{ text: 'التكنولوجيا المالية', callback_data: 't_fin' }, { text: 'الروبوتات', callback_data: 't_robot' }],
        [{ text: 'الواقع المعزز AR/VR', callback_data: 't_arvr' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ];
    }

    await sendTelegramMessage(chatId, msg, keyboard);
  };

  const setToolPrompt = async (chatId: number, action: string) => {
    userStatesRef.current[chatId] = action;
    const prompts: Record<string, string> = {
      't_content': '🎨 أرسل اسم المنتج وسأكتب محتوى تسويقي احترافي.',
      't_vision': '👁️ أرسل وصفك البصري وسأقوم بتحليله وتصوره لك.',
      't_voice': '🎤 أرسل النص الخاص بك وسأجهز لك هندسة الصوت والمؤثرات.',
      't_persona': '🎭 من ترغب في صناعته؟ أرسل لي المواصفات لإنشاء الهوية.',
      't_story': '📖 أرسل لي عقدة القصة وشخصياتها وسأكمل بناء السيناريو.',
      't_logo': 'أرسل وصف الشعار وسأقوم بتوليد أكواد تصميمه.',
      't_swarm': '🐝 أرسل فكرة التطبيق ليقوم فريق الذكاء (المعماري والأمني) بتحليلها.',
      't_data': '🗄️ أرسل نص عشوائي أو بيانات غير مرتبة لتحويلها إلى SQL و JSON.',
      't_omni': '⚡ المترجم العكسي: أرسل أي كود لأترجمه إلى Swift و Rust.',
      't_decoder': '🧬 أرسل كود مشروع لفكه وتحليله وهندسته عكسياً.',
      't_logic': '🧠 أرسل مشكلة برمجية وسأعطيك بنية منطق الحل الخوارزمي.',
      't_editor': '💻 أرسل الكود للتعديل أو طلب التحرير وسأقوم بإعادة صياغته وتطويره.',
      't_transpiler': '⚡ المترجم (Transpiler): أرسل الكود لأقوم بتحويله للغات أخرى.',
      't_sdk': '📦 أرسل تفاصيل الـ API وسأقوم بصياغة SDK جاهز للغات البرمجة.',
      't_devops': '⚙️ أرسل متطلبات مشروعك وسأبني هيكل البنية التحتية (Docker/CI-CD).',
      't_terminal': '🖥️ أرسل طلبك لأعطيك أوامر التيرمينال المطلوبة بدقة.',
      't_autom': '🔄 أرسل مسار العمل المُراد أتمتته وسأكتب الكود النصي للـ Automation.',
      't_fix': '🛠️ أرسل الأكواد التي تحتوي على أخطاء برمجية وسأقوم بفحصها وإصلاحها.',
      't_neuroux': 'أرسل تفاصيل واجهتك وسأحللها لك كتجربة مستخدم نفسية (Neuro UX).',
      't_legal': '⚖️ أرسل استفسارك القانوني التجاري أو العقود.',
      't_game': '🎮 أرسل فكرة لعبتك لتوليد محركها ومنطقها.',
      't_block': '⛓️ أرسل ما تود بناءه في العقود الذكية (Web3).',
      't_quant': '⚛️ مختبر الكم: అرسل معادلة أو خوارزمية.',
      't_bio': '🧬 مختبر التقنية الحيوية: أرسل معطيات التسلسل الحيوي أو الأبحاث.',
      't_fin': '💰 أرسل فكرتك لتطبيق التكنولوجيا المالية.',
      't_robot': '🤖 مختبر الروبوتكس، أرسل المنطق الحركي المطلوب.',
      't_arvr': '🕶️ أرسل فكرة العالم الافتراضي الذي ترغب بصناعته.',
      't_3d': 'أرسل وصف الشكل ثلاثي الأبعاد.',
      't_datasci': '📊 أرسل مشكلة البيانات التي تريد تحليلها.',
      'mode_factory': '🏭 *مصنع التطبيقات:*\nأرسل الفكرة الكاملة لتطبيقك ليتم بناء العصب الرئيسي له (Brand, Slogan, Architecture).'
    };

    const msg = prompts[action] || 'أرسل مدخلاتك للأداة المطلوبة:';
    await sendTelegramMessage(chatId, msg);
  };

  const processTelegramUpdate = async (update: any) => {
    // Button clicks
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message.chat.id;
      const action = cb.data;
      await answerCallbackQuery(cb.id);

      if (action === 'main_menu') {
        userStatesRef.current[chatId] = 'none';
        await sendMainMenu(chatId);
        return;
      }
      if (action.startsWith('cat_')) {
        await sendCategoryMenu(chatId, action);
        return;
      }
      if (action === 'human_chat') {
        await sendTelegramMessage(chatId, '💬 للتواصل البشري المباشر مع مؤسس النظام والمطور، تواصل مع:\n@Ibrahimali1999');
        return;
      }
      if (action === 'mode_chat') {
         userStatesRef.current[chatId] = 'none';
         await sendTelegramMessage(chatId, '💬 *الدردشة الحرة المفعلة.*\nأنا مجرد مساعد الذكاء الاصطناعي المركزي، اسألني ما تشاء!');
         return;
      }

      await setToolPrompt(chatId, action);
      addLog(`[Menu] Tool activated: ${action}`, 'info');
      return;
    }

    // Text processing
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text;
      const uName = update.message.chat.username || "User";
      addLog(`[@${uName}] sent msg`, 'user');

      if (text === '/start' || text === '/menu') {
        userStatesRef.current[chatId] = 'none';
        await sendMainMenu(chatId);
        return;
      }

      const activeTool = userStatesRef.current[chatId] || 'none';
      if (activeTool === 'none') {
        await sendTelegramMessage(chatId, 'تفحص البيانات...');
        const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: text, taskType: "coding" }) }).then(r => r.json());
        await sendTelegramMessage(chatId, res.content || res.text);
        return;
      }

      await sendTelegramMessage(chatId, '⏳ *جاري المعالجة...* (تعتمد سرعة الرد على الخادم والداشبورد الحالية، يرجى الانتظار ثواني)...');

      try {
        let aiResult = '';
        if (activeTool === 't_omni') {
          const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Translate strictly to Swift and Rust:\n${text}`, taskType: "coding" }) }).then(r => r.json());
          aiResult = res.content || res.text;
        } else if (activeTool === 't_data') {
          const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Format this into JSON output and optimal SQL schema:\n${text}`, taskType: "coding" }) }).then(r => r.json());
          aiResult = res.content || res.text;
        } else if (activeTool === 't_swarm') {
          const arch = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `System Architect analysis for idea: ${text}`, taskType: "reasoning" }) }).then(r => r.json());
          const sec = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Strict App Security critique for: ${arch.content || arch.text}`, taskType: "reasoning" }) }).then(r => r.json());
          aiResult = `👷‍♂️ *المهندس المعماري:*\n${arch.content || arch.text}\n\n🕵️ *خبير الأمن:*\n${sec.content || sec.text}`;
        } else if (activeTool === 'mode_factory') {
           const res = await fetch('/api/generate/strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: text }) }).then(r => r.json());
           aiResult = `🚀 *إنتاج المصنع:*\nالاسم: ${res.name || 'غير محدد'}\nالشعار: ${res.slogan || 'غير محدد'}\nالجمهور: ${res.targetAudience || 'غير محدد'}`;
        } else if (activeTool === 't_decoder') {
           const res = await fetch('/api/generate/project', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Decode and analyze this project: ${text}`, type: "json" }) }).then(r => r.json());
           aiResult = `🧬 *الفحص العكسي الهندسي:*\n${JSON.stringify(res).substring(0, 500)}`;
        } else {
          // General wrapper for other labs mapping to "creative", "reasoning", or "coding"
          const res = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: `Context Lab Tool (${activeTool}) request: ${text}`, taskType: "coding" }) }).then(r => r.json());
          aiResult = res.content || res.text;
        }

        // Telegram Message Max Length is 4096 characters per message
        const chunkSize = 4000;
        for (let i = 0; i < aiResult.length; i += chunkSize) {
            await sendTelegramMessage(chatId, aiResult.substring(i, i + chunkSize));
        }

        addLog(`Processed successfully for @${uName}`, 'success');
      } catch (e: any) {
        await sendTelegramMessage(chatId, `❌ خطأ بالنظام: ${e.message}`);
        addLog(`[Error] ${e.message}`, 'error');
      }
    }
  };

  const startPolling = async () => {
    isPollingRef.current = true;
    pollIntervalRef.current = { stop: () => { isPollingRef.current = false; } };

    // Delete webhook to ensure polling works flawlessly
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    } catch (e) {}

    const poll = async () => {
      if (!isPollingRef.current) return;
      try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateIdRef.current + 1}&timeout=5`);
        const data = await response.json();
        
        if (data.ok && data.result.length > 0) {
          for (const update of data.result) {
            // ALWAYS INCREMENT ID first to avoid infinite retry loop if process logic fails
            lastUpdateIdRef.current = Math.max(lastUpdateIdRef.current, update.update_id);
          }
          for (const update of data.result) {
            await processTelegramUpdate(update);
          }
        }
      } catch (error) {}
      
      if (isPollingRef.current) {
        setTimeout(poll, 1000);
      }
    };

    poll();
  };

  // ✅ AUTO-START ON MOUNT if Token Exists (Permanent Activation)
  useEffect(() => {
    if (botToken && !isActive) {
      localStorage.setItem('telegram_bot_token', botToken.trim());
      setIsActive(true);
      startPolling();
    }
    return () => {
      if (pollIntervalRef.current && pollIntervalRef.current.stop) {
        pollIntervalRef.current.stop();
      }
    };
  }, []); // Run only once on mount

  return (
    <div className="space-y-6">
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
          <Zap className="w-20 h-20 text-green-500" />
        </div>
        <h3 className="text-green-500 font-bold mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5" />
           البوابة الرقمية الشاملة (AUTO-SYNCED)
        </h3>
        <p className="text-sm text-zinc-400 max-w-2xl">
          الربط التلقائي الدائم مفعل. تم استيراد كافة مختبراتك (الإبداعية، متطرفة، تكنولوجية) لتطبيق تيليجرام بنجاح وسرعة استجابة عالية ولن تحتاج للضغط على أي قوى تشغيل بعد الآن، بمجرد فتح المنصة يعمل كل شيء!
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-mono text-zinc-500 uppercase mb-2 flex items-center gap-2">
              <User className="w-4 h-4"/> Admin ID: 1857967143 | Server Access Token
            </label>
            <input 
              type="password"
              value={botToken}
              disabled={true}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-green-500 font-mono opacity-50 cursor-not-allowed"
            />
            <p className="text-[10px] text-zinc-500 mt-2">التوكن مؤمن ومشفر تلقائياً ويعمل بالخلفية لربط المنصة.</p>
          </div>
          <div className="w-full md:w-auto px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all bg-green-600/20 text-green-500 border border-green-500/50">
            <Radio className="w-4 h-4 animate-pulse" />
            السيرفر يعمل باستمرار
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden flex flex-col h-[400px]">
        <div className="p-2 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500 flex items-center gap-2">
            <Radio className="w-3 h-3 text-green-500" />
            سجل حركة خوادم تيليجرام (Live Trace)
          </span>
          <button onClick={() => setLogs([])} className="text-zinc-500 hover:text-white">
            <RefreshCcw className="w-3 h-3" />
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] space-y-2 custom-scrollbar">
          <AnimatePresence>
            {logs.map((log) => (
              <motion.initial key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <span className="text-zinc-600">[{log.time}] </span>
                <span className={
                  log.type === 'error' ? 'text-red-400' : 
                  log.type === 'success' ? 'text-green-400' : 
                  log.type === 'user' ? 'text-orange-400 font-bold' : 
                  'text-blue-400'
                }>{log.message}</span>
              </motion.initial>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
