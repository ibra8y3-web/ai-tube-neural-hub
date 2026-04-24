import axios from "axios";
import * as aiService from "./aiService.js";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const botToken = process.env.VITE_TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
let lastUpdateId = 0;
const userStates: Record<number, string> = {};
const userPrefs: Record<number, { voice: string, style: string }> = {};

const VOICES = ['Kore', 'Fenrir', 'Puck', 'Charon', 'Zephyr', 'Aoede', 'Eos', 'Orpheus', 'Lyra'];
const STYLES = [
  { id: 'cheerful', label: 'حماسي/Cheerful' },
  { id: 'horror', label: 'رعب/Horror' },
  { id: 'deep', label: 'عميق/Deep' },
  { id: 'singing', label: 'غناء/Singing' },
  { id: 'whisper', label: 'همس/Whisper' },
  { id: 'news', label: 'أخبار/News' },
  { id: 'asmr', label: 'ASMR' },
  { id: 'sad', label: 'حزين/Sad' },
  { id: 'professional', label: 'احترافي/Professional' }
];

const TELEGRAM_API = `https://api.telegram.org/bot${botToken}`;

export const sendTelegramMessage = async (chatId: number, text: string, replyMarkup: any = null) => {
  if (!botToken) return;
  try {
    const payload: any = { chat_id: chatId, text: text, parse_mode: 'Markdown' };
    if (replyMarkup) payload.reply_markup = replyMarkup;
    await axios.post(`${TELEGRAM_API}/sendMessage`, payload);
  } catch (e: any) {
    console.error("Telegram Send Error:", e.message);
  }
};

export const sendTelegramPhoto = async (chatId: number, photo: string, caption?: string) => {
  if (!botToken) return;
  try {
    const payload: any = { chat_id: chatId, photo, parse_mode: 'Markdown' };
    if (caption) payload.caption = caption;
    await axios.post(`${TELEGRAM_API}/sendPhoto`, payload);
  } catch (e: any) {
    console.error("Telegram Photo Error:", e.message);
  }
};

export const sendTelegramAudio = async (chatId: number, audio: string, caption?: string) => {
  if (!botToken) return;
  try {
    if (audio.startsWith('data:audio')) {
      const mimeType = audio.split(';')[0].split(':')[1];
      const extension = mimeType.split('/')[1] || 'flac';
      const base64Data = audio.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      const form = new FormData();
      form.append('chat_id', chatId.toString());
      form.append('audio', buffer, { filename: `audio.${extension}`, contentType: mimeType });
      if (caption) form.append('caption', caption);
      
      await axios.post(`${TELEGRAM_API}/sendAudio`, form, {
        headers: form.getHeaders()
      });
    } else {
      await axios.post(`${TELEGRAM_API}/sendAudio`, {
        chat_id: chatId,
        audio: audio,
        caption: caption
      });
    }
  } catch (e: any) {
    console.error("Telegram Audio Error:", e.response?.data || e.message);
    await sendTelegramMessage(chatId, `🎵 الملف الصوتي جاهز ولكن واجهت مشكلة في إرساله تلقائياً. يرجى مراجعة الداشبورد.`);
  }
};

const answerCallbackQuery = async (queryId: string) => {
  if (!botToken) return;
  try {
    await axios.post(`${TELEGRAM_API}/answerCallbackQuery`, { callback_query_id: queryId });
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
  await sendTelegramMessage(chatId, `مرحباً بك في Aether Core ⚡\nالبوت يعمل الآن من السيرفر مباشرة 24/7.\n\nالرجاء اختيار القسم:`, keyboard);
};

const sendCategoryMenu = async (chatId: number, category: string) => {
  let keyboard: any = { inline_keyboard: [] };
  let msg = '';

  const categories: any = {
    'cat_cre': {
      msg: '🎨 *المختبرات الإبداعية*',
      buttons: [
        [{ text: 'المحتوى (Content)', callback_data: 't_content' }, { text: 'الرؤية (Vision)', callback_data: 't_vision' }],
        [{ text: 'الصوت (Voice)', callback_data: 't_voice' }, { text: 'الشخصيات (Personas)', callback_data: 't_persona' }],
        [{ text: 'الكائنات (3D)', callback_data: 't_3d' }, { text: 'الشعارات (Logos)', callback_data: 't_logo' }],
        [{ text: 'القصص (Stories)', callback_data: 't_story' }],
        [{ text: 'التدقيق النفسي UX', callback_data: 't_neuroux' }, { text: 'المساعد القانوني', callback_data: 't_legal' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ]
    },
    'cat_eff': {
      msg: '⚡ *تيوبات الكفاءة الخارقة*',
      buttons: [
        [{ text: 'السرب الذكي', callback_data: 't_swarm' }, { text: 'ثقب البيانات (SQL/JSON)', callback_data: 't_data' }],
        [{ text: 'مترجم الأنظمة (Swift/Rust)', callback_data: 't_omni' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ]
    },
    'cat_eng': {
      msg: '⚙️ *الهندسة والتطوير*',
      buttons: [
        [{ text: 'المحرر (Editor)', callback_data: 't_editor' }, { text: 'المترجم (Transpiler)', callback_data: 't_transpiler' }],
        [{ text: 'المنطق (Logic)', callback_data: 't_logic' }, { text: 'مولد SDK', callback_data: 't_sdk' }],
        [{ text: 'ديف أوبس (DevOps)', callback_data: 't_devops' }, { text: 'تيرمينال (Terminal)', callback_data: 't_terminal' }],
        [{ text: 'الأتمتة (Automation)', callback_data: 't_autom' }, { text: 'فك المشاريع (Decoder)', callback_data: 't_decoder' }],
        [{ text: 'الإصلاح (Debugger)', callback_data: 't_fix' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ]
    },
    'cat_new': {
      msg: '🧪 *المختبرات والأنظمة*',
      buttons: [
        [{ text: '🛠️ أدوات المطورين', callback_data: 'menu_dev' }, { text: '🌟 أدوات عامة', callback_data: 'menu_user' }],
        [{ text: '📊 تحليل السوق', callback_data: 't_market' }, { text: '🎓 الأكاديمية', callback_data: 't_academy' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ]
    },
    'menu_dev': {
      msg: '🛠️ *أدوات المطورين والمبرمجين*',
      buttons: [
        [{ text: 'مهندس API', callback_data: 't_api' }, { text: 'خبير Regex', callback_data: 't_regex' }],
        [{ text: 'محلل السجلات', callback_data: 't_logs' }, { text: 'محرر CSS', callback_data: 't_css' }],
        [{ text: 'مساعد Git', callback_data: 't_git' }],
        [{ text: '🔙 العودة', callback_data: 'labs_menu' }]
      ]
    },
    'menu_user': {
      msg: '🌟 *أدوات المستخدمين الذكية*',
      buttons: [
        [{ text: 'مخطط الحياة', callback_data: 't_life' }, { text: 'خيميائي الوصفات', callback_data: 't_recipe' }],
        [{ text: 'مستشار الهدايا', callback_data: 't_gift' }, { text: 'ناسج القصص', callback_data: 't_story_ai' }],
        [{ text: 'رفيق السفر', callback_data: 't_travel' }],
        [{ text: '🔙 العودة', callback_data: 'labs_menu' }]
      ]
    },
    'cat_ext': {
      msg: '🚀 *المختبرات المتطرفة (Extreme)*',
      buttons: [
        [{ text: 'محرك الألعاب', callback_data: 't_game' }, { text: 'البلوكتشين', callback_data: 't_block' }],
        [{ text: 'الهاردوير و IoT', callback_data: 't_hard' }, { text: 'الأقمار الصناعية', callback_data: 't_sat' }],
        [{ text: 'الكمّ (Quantum)', callback_data: 't_quant' }, { text: 'التقنية الحيوية', callback_data: 't_bio' }],
        [{ text: 'التكنولوجيا المالية', callback_data: 't_fin' }, { text: 'الروبوتات', callback_data: 't_robot' }],
        [{ text: 'الواقع المعزز AR/VR', callback_data: 't_arvr' }],
        [{ text: '🔙 العودة', callback_data: 'main_menu' }]
      ]
    }
  };

  const selected = categories[category];
  if (selected) {
    await sendTelegramMessage(chatId, selected.msg, { inline_keyboard: selected.buttons });
  }
};

const setToolPrompt = async (chatId: number, action: string) => {
  userStates[chatId] = action;
  
  if (action === 't_voice') {
    const prefs = userPrefs[chatId] || { voice: 'Kore', style: 'cheerful' };
    const keyboard = {
      inline_keyboard: [
        [{ text: `🎤 الصوت الحالي: ${prefs.voice}`, callback_data: 'menu_voices' }],
        [{ text: `🎨 النمط الحالي: ${prefs.style}`, callback_data: 'menu_styles' }],
        [{ text: '✅ ابدأ التوليد', callback_data: 'start_voice_gen' }]
      ]
    };
    await sendTelegramMessage(chatId, `🎤 *استوديو الصوت الذكي*\n\nيرجى تحديد الصوت والنمط المفضل، ثم اضغط على "ابدأ التوليد" لإرسال النص.`, keyboard);
    return;
  }

  const prompts: Record<string, string> = {
    't_content': '🎨 أرسل اسم المنتج وسأكتب محتوى تسويقي احترافي.',
    't_vision': '👁️ أرسل وصفك البصري وسأقوم بتحليله وتصوره لك.',
    't_voice': '🎤 أرسل النص الخاص بك وسأجهز لك هندسة الصوت والمؤثرات.',
    't_persona': '🎭 من ترغب في صناعته؟ أرسل لي المواصفات لإنشاء الهوية.',
    't_story': '📖 أرسل لي عقدة القصة وشخصياتها وسأكمل بناء السيناريو.',
    't_logo': '🎨 أرسل وصف الشعار وسأقوم بتوليده كصورة فوراً.',
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
    't_api': '📑 أرسل وصفاً للنظام الذي تريد بناء API له (OpenAPI Spec).',
    't_regex': '🔍 أرسل النص أو النمط الذي تريد استخراج Regex له.',
    't_logs': '📋 أرسل سجلات الأخطاء (Logs) لتحليلها وإيجاد الحلول.',
    't_css': '🎨 أرسل وصفاً للتصميم (Layout) وسأقوم بكتابة الـ CSS الخاص به.',
    't_git': '🌿 أرسل توضيحاً للتغييرات التي قمت بها وسأقترح رسائل Commit احترافية.',
    't_life': '📅 أرسل هدفك القادم وسأقوم برسم خطة عمل لمدة أسبوع.',
    't_recipe': '🥘 أرسل المكونات المتوفرة لديك وسأخترع لك وصفة فريدة.',
    't_gift': '🎁 أرسل معلومات عن الشخص (عمره، اهتماماته) وسأقترح هدايا مناسبة.',
    't_story_ai': '📚 أرسل عنواناً أو موضوعاً وسأنسج لك قصة للأطفال.',
    't_travel': '✈️ أرسل اسم المدينة وسأرسم لك برنامجاً سياحياً لمدة 3 أيام.',
    't_market': '📈 أرسل اسم الشركة أو المجال وسأعطيك تحليلاً شاملاً للسوق والفرص.',
    'mode_factory': '🏭 *مصنع التطبيقات:*\nأرسل الفكرة الكاملة لتطبيقك ليتم بناء العصب الرئيسي له (Brand, Slogan, Architecture).'
  };

  const msg = prompts[action] || 'أرسل مدخلاتك للأداة المطلوبة:';
  await sendTelegramMessage(chatId, msg);
};

const processTelegramUpdate = async (update: any) => {
  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message.chat.id;
    const action = cb.data;
    await answerCallbackQuery(cb.id);

    if (action === 'main_menu') {
      userStates[chatId] = 'none';
      await sendMainMenu(chatId);
      return;
    }
    if (action.startsWith('cat_') || action.startsWith('menu_')) {
      await sendCategoryMenu(chatId, action);
      return;
    }
    if (action === 'labs_menu') {
      await sendCategoryMenu(chatId, 'cat_new');
      return;
    }
    if (action === 'human_chat') {
      await sendTelegramMessage(chatId, '💬 للتواصل البشري المباشر مع مؤسس النظام والمطور، تواصل مع:\n@Ibrahimali1999');
      return;
    }
    if (action === 'mode_chat') {
       userStates[chatId] = 'none';
       await sendTelegramMessage(chatId, '💬 *الدردشة الحرة المفعلة.*\nأنا مجرد مساعد الذكاء الاصطناعي المركزي، اسألني ما تشاء!');
       return;
    }

    // Voice Studio menus
    if (action === 'menu_voices') {
      const buttons = VOICES.map(v => [{ text: v, callback_data: `set_v_${v}` }]);
      buttons.push([{ text: '🔙 عودة', callback_data: 't_voice' }]);
      await sendTelegramMessage(chatId, '🎤 اختر محرك الصوت:', { inline_keyboard: buttons });
      return;
    }
    if (action === 'menu_styles') {
      const buttons = STYLES.map(s => [{ text: s.label, callback_data: `set_s_${s.id}` }]);
      buttons.push([{ text: '🔙 عودة', callback_data: 't_voice' }]);
      await sendTelegramMessage(chatId, '🎨 اختر نمط الصوت:', { inline_keyboard: buttons });
      return;
    }
    if (action.startsWith('set_v_')) {
      const voice = action.replace('set_v_', '');
      userPrefs[chatId] = { ...(userPrefs[chatId] || { voice: 'Kore', style: 'cheerful' }), voice };
      await setToolPrompt(chatId, 't_voice');
      return;
    }
    if (action.startsWith('set_s_')) {
      const style = action.replace('set_s_', '');
      userPrefs[chatId] = { ...(userPrefs[chatId] || { voice: 'Kore', style: 'cheerful' }), style };
      await setToolPrompt(chatId, 't_voice');
      return;
    }
    if (action === 'start_voice_gen') {
      await sendTelegramMessage(chatId, '🎤 أرسل النص الذي تريد تحويله لمقطع صوتي احترافي:');
       userStates[chatId] = 'active_voice_gen';
      return;
    }

    await setToolPrompt(chatId, action);
    return;
  }

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    if (text === '/start' || text === '/menu') {
      userStates[chatId] = 'none';
      await sendMainMenu(chatId);
      return;
    }

    const activeTool = userStates[chatId] || 'none';
    
    if (activeTool === 'none') {
      const resp = await aiService.generateChatResponse(text, "coding");
      await sendTelegramMessage(chatId, resp);
      return;
    }

    await sendTelegramMessage(chatId, '⏳ *جاري المعالجة...*');

    try {
      let aiResult = '';
      let mediaType = '';
      let mediaUrl = '';
      
      switch(activeTool) {
        case 't_logo':
          mediaUrl = await aiService.generateLogo("Logo", text);
          mediaType = 'photo';
          aiResult = "✨ تمت هندسة الشعار بنجاح.";
          break;
        case 't_vision':
          const visionPrompt = `A professional, ultra-detailed image render based on this description: ${text}`;
          mediaUrl = await aiService.generateLogo("Vision", visionPrompt);
          mediaType = 'photo';
          aiResult = "👁️ تمت المعالجة البصرية بنجاح.";
          break;
        case 't_3d':
          const [text3d, img3d] = await Promise.all([
            aiService.generateChatResponse(`Generate technical 3D modeling topology and specifications for: ${text}. Include polygon counts, suggested textures, and UV mapping strategy.`, "3d"),
            aiService.generateLogo("3D Render", `A professional high-fidelity 3D model render of ${text}, studio lighting, octane render, 4k resolution, transparent background, isolated 3d asset`)
          ]);
          mediaUrl = img3d;
          mediaType = 'photo';
          aiResult = `🧊 *تصميم الكائن ثلاثي الأبعاد:*\n${text3d}`;
          break;
        case 'active_voice_gen':
        case 't_voice':
          const prefs = userPrefs[chatId] || { voice: 'Kore', style: 'cheerful' };
          mediaUrl = await aiService.generateVoice(text, prefs.voice, prefs.style);
          mediaType = 'audio';
          aiResult = `🎵 تمت هندسة الصوت بنجاح بنمط (${prefs.style}) وصوت (${prefs.voice})`;
          break;
        case 't_content':
          aiResult = `📝 *المحتوى المولد:*\n${await aiService.generateChatResponse(`Write a high-quality, professional, and engaging content piece about: ${text}. Use appropriate markdown formatting.`, "general")}`;
          break;
        case 't_persona':
          aiResult = `👥 *الشخصيات المستهدفة:*\n${await aiService.generateChatResponse(`Generate 3 detailed customer personas for this product/idea: "${text}". Return highly structured detailed descriptions.`, "general")}`;
          break;
        case 't_story':
          aiResult = `📖 *القصة:*\n${await aiService.generateChatResponse(`Write a compelling and creative story about: ${text}. Use vivid descriptions and engaging narrative language.`, "general")}`;
          break;
        case 't_omni':
          aiResult = await aiService.generateChatResponse(`Translate strictly to Swift and Rust:\n${text}`, "coding");
          break;
        case 't_data':
          aiResult = await aiService.generateChatResponse(`Format this into JSON output and optimal SQL schema:\n${text}`, "coding");
          break;
        case 't_swarm':
          const arch = await aiService.generateChatResponse(`System Architect analysis for idea: ${text}`, "reasoning");
          const sec = await aiService.generateChatResponse(`Strict App Security critique for: ${arch}`, "reasoning");
          aiResult = `👷‍♂️ *المهندس المعماري:*\n${arch}\n\n🕵️ *خبير الأمن:*\n${sec}`;
          break;
        case 'mode_factory':
          const strat = await aiService.generateStrategy(text);
          aiResult = `🚀 *إنتاج المصنع:*\nالاسم: ${strat.name || 'غير محدد'}\nالشعار: ${strat.slogan || 'غير محدد'}\nالجمهور: ${strat.targetAudience || 'غير محدد'}`;
          break;
        case 't_decoder':
          const dec = await aiService.generateProject(text, "json");
          aiResult = `🧬 *الفحص العكسي الهندسي:*\n${JSON.stringify(dec, null, 2).substring(0, 3900)}`;
          break;
        case 't_editor':
          aiResult = `💻 *المحرر البرمجي:*\n${await aiService.generateChatResponse(`Act as an expert Code Editor. Refactor, modularize, and improve the following request/code: ${text}`, "coding")}`;
          break;
        case 't_transpiler':
          aiResult = `⚡ *المترجم:*\n${await aiService.generateChatResponse(`Transpile or translate this code/concept to the target language optimally: ${text}`, "coding")}`;
          break;
        case 't_logic':
          aiResult = `🧠 *منطق الخوارزمية:*\n${await aiService.generateChatResponse(`Provide the core algorithmic logic and algorithmic steps for: ${text}`, "coding")}`;
          break;
        case 't_sdk':
          aiResult = `📦 *مولد SDK:*\n${await aiService.generateChatResponse(`Generate a production-ready SDK wrapper logic for: ${text}`, "coding")}`;
          break;
        case 't_devops':
          aiResult = `⚙️ *بنية DevOps:*\n${await aiService.generateChatResponse(`Write complete DevOps scripts (Docker/Kubernetes/CI-CD) for: ${text}`, "coding")}`;
          break;
        case 't_terminal':
          aiResult = `🖥️ *تيرمينال:*\n${await aiService.generateChatResponse(`Provide the exact Shell/Bash Terminal commands for: ${text}`, "coding")}`;
          break;
        case 't_autom':
          aiResult = `🔄 *أتمتة العمليات:*\n${await aiService.generateChatResponse(`Write Python or Node.js automation/RPA scripts for: ${text}`, "coding")}`;
          break;
        case 't_fix':
          aiResult = `🛠️ *المصلح (Debugger):*\n${await aiService.generateChatResponse(`Act as a senior debugger. Find the bug and provide the corrected code for: ${text}`, "coding")}`;
          break;
        case 't_api':
          aiResult = `📑 *API Architect:*\n${await aiService.generateChatResponse(`Create an OpenAPI 3.0 YAML spec for: ${text}`, "coding")}`;
          break;
        case 't_regex':
          aiResult = `🔍 *Regex Master:*\n${await aiService.generateChatResponse(`Create a Regex and explanation for: ${text}. Return as: Regex: [pattern], Explanation: [desc]`, "coding")}`;
          break;
        case 't_logs':
          aiResult = `📋 *Log Analysis:*\n${await aiService.generateChatResponse(`Analyze these logs and suggest fixes: ${text}`, "coding")}`;
          break;
        case 't_css':
          aiResult = `🎨 *CSS Forge:*\n${await aiService.generateChatResponse(`Generate advanced CSS for: ${text}`, "coding")}`;
          break;
        case 't_git':
          aiResult = `🌿 *Git Suggester:*\n${await aiService.generateChatResponse(`Suggest 3 professional git commit messages for: ${text}`, "coding")}`;
          break;
        case 't_life':
          aiResult = `📅 *Life Plan:*\n${await aiService.generateChatResponse(`Create a 7-day action plan for: ${text}`, "general")}`;
          break;
        case 't_recipe':
          aiResult = `🥘 *Recipe Alchemist:*\n${await aiService.generateChatResponse(`Create a recipe using these ingredients: ${text}`, "general")}`;
          break;
        case 't_gift':
          aiResult = `🎁 *Gift Ideas:*\n${await aiService.generateChatResponse(`Suggest 5 unique gifts for: ${text}`, "general")}`;
          break;
        case 't_story_ai': 
          aiResult = `📚 *Story Weaver:*\n${await aiService.generateChatResponse(`Write a short kids story about: ${text}`, "general")}`;
          break;
        case 't_travel':
          aiResult = `✈️ *Travel Buddy:*\n${await aiService.generateChatResponse(`Create a 3-day travel itinerary for: ${text}`, "general")}`;
          break;
        case 't_datasci':
          aiResult = `📊 *علم البيانات:*\n${await aiService.generateChatResponse(`Act as a senior data scientist. Analyze this request and provide Pandas/NumPy code or stats: ${text}`, "general")}`;
          break;
        case 't_academy':
          aiResult = `🎓 *الأكاديمية العلمية:*\n${await aiService.generateChatResponse(`Create a comprehensive course syllabus and lesson details for: ${text}`, "general")}`;
          break;
        case 't_market':
          const marketData = await aiService.analyzeMarket(text, "Global");
          aiResult = `📈 *تحليل السوق لـ ${text}:*\n\n` +
                     `📏 الحجم: ${marketData.marketSize}\n` +
                     `👥 المنافسون: ${marketData.keyCompetitors.join(", ")}\n` +
                     `🔥 التوجهات: ${marketData.trends.join(", ")}\n` +
                     `💡 الفرص: ${marketData.opportunities.join(", ")}\n` +
                     `⚠️ التهديدات: ${marketData.threats.join(", ")}`;
          break;
        default:
           aiResult = await aiService.generateChatResponse(`Context Lab Tool (${activeTool}) request: ${text}`, "coding");
      }

      if (mediaType === 'photo' && mediaUrl) {
        await sendTelegramPhoto(chatId, mediaUrl, aiResult.length < 1000 ? aiResult : `✨ مخرجات جاهزة.`);
        if (aiResult.length >= 1000) {
          const chunkSize = 4000;
          for (let i = 0; i < aiResult.length; i += chunkSize) {
            await sendTelegramMessage(chatId, aiResult.substring(i, i + chunkSize));
          }
        }
      } else if (mediaType === 'audio' && mediaUrl) {
        await sendTelegramAudio(chatId, mediaUrl, aiResult);
      } else {
        const chunkSize = 4000;
        for (let i = 0; i < aiResult.length; i += chunkSize) {
          await sendTelegramMessage(chatId, aiResult.substring(i, i + chunkSize));
        }
      }

    } catch (e: any) {
      console.error("Bot Processing Error:", e.message);
      await sendTelegramMessage(chatId, `❌ خطأ بالنظام: ${e.message}`);
    }
  }
};

export const startTelegramBot = async () => {
  if (!botToken) {
    console.log("Telegram Bot Token not found. Bot disabled.");
    return;
  }

  console.log(">>> Telegram Bot is running in background...");
  
  // Clear webhook
  try { await axios.get(`${TELEGRAM_API}/deleteWebhook`); } catch (e) {}

  const poll = async () => {
    try {
      const response = await axios.get(`${TELEGRAM_API}/getUpdates`, {
        params: { offset: lastUpdateId + 1, timeout: 20 }
      });
      const data = response.data;
      
      if (data.ok && data.result.length > 0) {
        for (const update of data.result) {
          lastUpdateId = Math.max(lastUpdateId, update.update_id);
          await processTelegramUpdate(update);
        }
      }
    } catch (e) {}
    setTimeout(poll, 1000);
  };

  poll();
};
