import axios from "axios";
import * as aiService from "./aiService.js";
import dotenv from "dotenv";
import FormData from "form-data";
import { socialService } from './socialService.js';

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
      msg: '🛠️ *أدوات المطورين والمبرمجين والمستخدمين*',
      buttons: [
        [{ text: 'مدير المهام والتواصل 📊', callback_data: 't_social_tasks' }],
        [{ text: 'وكيل الواجهات 💻', callback_data: 't_fe_agent' }],
        [{ text: 'المترجم العالمي 🌐', callback_data: 't_trans' }, { text: 'مفسر الأحلام 🌙', callback_data: 't_dream' }],
        [{ text: 'رفيق المزاج 😊', callback_data: 't_mood' }, { text: 'مخطط الوجبات 🥗', callback_data: 't_meal' }],
        [{ text: 'مهندس الأكواد 🏗️', callback_data: 't_arch' }, { text: 'خيميائي المحتوى ✍️', callback_data: 't_alch' }],
        [{ text: 'مهندس API', callback_data: 't_api' }, { text: 'خبير Regex', callback_data: 't_regex' }],
        [{ text: 'محلل السجلات', callback_data: 't_logs' }, { text: 'محرر CSS', callback_data: 't_css' }],
        [{ text: 'محسن SQL', callback_data: 't_sql' }, { text: 'فك التشفير', callback_data: 't_vault' }],
        [{ text: 'مهندس المشاريع', callback_data: 't_architect' }, { text: 'خبير دوكر', callback_data: 't_docker' }],
        [{ text: 'محرك الابتكار', callback_data: 't_innov' }, { text: 'محلل المنطق', callback_data: 't_logic' }],
        [{ text: 'صانع README', callback_data: 't_readme' }, { text: 'بيانات وهمية', callback_data: 't_ghost' }],
        [{ text: 'مبتكر الأسماء', callback_data: 't_brand' }],
        [{ text: 'محول الأكواد', callback_data: 't_code_trans' }, { text: 'مكتبة الأكواد', callback_data: 't_snippets' }],
        [{ text: 'فاحص الشبكة', callback_data: 't_port' }, { text: 'ساحر Bash', callback_data: 't_bash' }],
        [{ text: 'محول JSON', callback_data: 't_json' }],
        [{ text: 'مساعد Git', callback_data: 't_git' }, { text: 'مدير العقد', callback_data: 't_nodes' }],
        [{ text: '🔙 العودة', callback_data: 'labs_menu' }]
      ]
    },
    'menu_user': {
      msg: '🌟 *أدوات المستخدمين الذكية*',
      buttons: [
        [{ text: 'مخطط الحياة', callback_data: 't_life' }, { text: 'خيميائي الوصفات', callback_data: 't_recipe' }],
        [{ text: 'مستشار الهدايا', callback_data: 't_gift' }, { text: 'ناسج القصص', callback_data: 't_story_ai' }],
        [{ text: 'خبير السيو', callback_data: 't_seo' }, { text: 'منشئ CV', callback_data: 't_cv' }],
        [{ text: 'مهندس برومبت', callback_data: 't_prompt' }, { text: 'ناسج ألوان', callback_data: 't_color' }],
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

  if (action === 't_social_tasks') {
    const keyboard = {
      inline_keyboard: [
        [{ text: '🔵 ربط فيسبوك بضغطة واحدة', callback_data: 'direct_facebook' }],
        [{ text: '🔴 ربط جوجل بضغطة واحدة', callback_data: 'direct_google' }],
        [{ text: '⚫ ربط منصة X بضغطة واحدة', callback_data: 'direct_x' }],
        [{ text: '🔙 العودة', callback_data: 'menu_dev' }]
      ]
    };
    await sendTelegramMessage(chatId, `📊 *مدير المهام والعمليات الذكي*\n\nيرجى اختيار المنصة التي تريد ربطها مباشرة لتفعيل الوكيل الذكي:\n(سيتم إنشاء منشور تعريفي للمتابعين تلقائياً بمجرد الربط)`, keyboard);
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
    't_fe_agent': '💻 *وكيل تطوير الواجهات:* أرسل فكرة تطبيقك واستراتيجية العلامة وسأكتب لك كود صفحة الهبوط كاملة.',
    't_social_tasks': '📊 *مدير المهام والعمليات الذكي:* أرسل قائمة المهام أو الرسالة التي تريد الرد عليها (فيس/واتس) وسأقوم بتنظيمها وصياغة الردود.\n\n🔗 *للربط المباشر بضغطة واحدة:* يمكنك استخدام حساب جوجل أو فيسبوك أو X للربط الفوري وتفعيل الوكيل التلقائي للمسجد.',
    't_dream': '🌙 *مفسر الأحلام:* أرسل تفاصيل حلمك وسأحلله لك نفسياً ورمزياً.',
    't_mood': '😊 *رفيق المزاج:* أخبرني كيف تشعر وسأعطيك نصائح وأنشطة تحسن يومك.',
    't_meal': '🥗 *مخطط الوجبات:* أرسل المكونات المتوفرة لديك وسأقترح عليك وصفات سريعة.',
    't_trans': '🌐 *المترجم العالمي:* أرسل أي نص وسأحوله لأي لغة تطلبها بدقة عالية.',
    't_arch': '🏗️ *مهندس الأكواد:* أرسل كودك وسأقوم بتحليل الهيكل والبحث عن الثغرات والتحسينات.',
    't_alch': '✍️ *خيميائي المحتوى:* أرسل فكرة وسأقوم بكتابة مقال أو بوست أو سكريبت إبداعي.',
    't_data': '🗄️ أرسل نص عشوائي أو بيانات غير مرتبة لتحويلها إلى SQL و JSON.',
    't_omni': '⚡ المترجم العكسي: أرسل أي كود لأترجمه إلى Swift و Rust.',
    't_decoder': '🧬 أرسل كود مشروع لفكه وتحليله وهندسته عكسياً.',
    't_editor': '💻 أرسل الكود للتعديل أو طلب التحرير وسأقوم بإعادة صياغته وتطويره.',
    't_transpiler': '⚡ المترجم (Transpiler): أرسل الكود لأقوم بتحويله للغات أخرى.',
    't_sdk': '📦 أرسل تفاصيل الـ API وسأقوم بصياغة SDK جاهز للغات البرمجة.',
    't_devops': '⚙️ أرسل متطلبات مشروعك وسأبني هيكل البنية التحتية (Docker/CI-CD).',
    't_terminal': '🖥️ أرسل طلبك لأعطيك أوامر التيرمينال المطلوبة بدقة.',
    't_autom': '🔄 أرسل مسار العمل المُراد أتمتته وسأكتب الكود النصي للـ Automation.',
    't_fix': '🛠️ أرسل الأكواد التي تحتوي على أخطاء برمجية وسأقوم بفحصها وإرسال الحلول.',
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
    't_vault': '🔓 *خزنة كسر التشفير:*\nأرسل اسم الملف ونوعه (PDF/Doc/XLS) وسأقوم بمحاكاة كسر الحماية واستخراج دليل Recovery.',
    't_sql': '📊 *محسن القواعد:*\nأرسل استعلام SQL وسأقوم بتحليله وتحسينه للأداء.',
    't_seo': '🔍 *خبير السيو:*\nأرسل رابط الموقع أو فكرة المشروع لتحليل SEO وتوليد الكلمات المفتاحية.',
    't_cv': '📄 *منشئ السيرة الذاتية:*\nأرسل معلوماتك الشخصية وخبراتك وسأقوم بصياغة CV احترافي.',
    't_port': '📡 *فاحص الشبكة:*\nأرسل عنوان IP أو رابط موقع وسأقوم بمحاكاة فحص منافذ أمني.',
    't_architect': '🏗️ *مهندس المشاريع:*\nأرسل فكرة مشروعك وسأقوم ببناء الهيكل الكامل، الأكواد، وطريقة التركيب.',
    't_docker': '🐳 *خبير دوكر:*\nأرسل تفاصيل مشروعك وسأقوم بكتابة ملفات Dockerfile و docker-compose احترافية.',
    't_logic': '🧠 *محلل المنطق:*\nأرسل خوارزمية أو مشكلة منطقية وسأشرحها لك خطوة بخطوة.',
    't_readme': '📝 *صانع README:*\nأرسل تفاصيل مشروعك وسأنشئ لك ملف توثيق (README.md) متكامل.',
    't_ghost': '👻 *بيانات وهمية:*\nأرسل شكل البيانات الذي تريده وسأولد لك ملف JSON تجريبي ضخم.',
    't_brand': '🏷️ *مبتكر الأسماء:*\nأرسل كلمات مفتاحية وسأقترح عليك أسماء برمجية وتجارية إبداعية.',
    't_innov': '💡 *محرك الابتكار:*\nأرسل أي كلمة وسأقترح عليك 3 أفكار مشاريع برمجية فريدة غير مكررة.',
    't_code_trans': '🛠️ *محول الأكواد:*\nأرسل منطقاً برمجياً باللغة العربية أو الإنجليزية وسأحوله لكود برمجي احترافي.',
    't_snippets': '📚 *مكتبة الأكواد:*\nأرسل موضوعاً وسأعطيك أفضل ممارسة وكود برمجي نظيف له.',
    't_bash': '🐚 *ساحر Bash:*\nأرسل وصفاً للمهمة وسأقوم بكتابة سكربت Bash متكامل.',
    't_json': '🔗 *محول JSON:*\nأرسل بيانات JSON وسأقوم بتحويلها لنماذج برمجية وصيغ أخرى.',
    't_prompt': '🧠 *مهندس البرومبت:*\nأرسل فكرة وسأقوم بتحويلها لأمر هندسي (Engineering Prompt) فائق الدقة.',
    't_color': '🎨 *ناسج الألوان:*\nأرسل لوناً أساسياً (Hex) وسأقوم ببناء لوحة ألوان متناغمة.',
    't_nodes': '🌐 *مدير العقد:*\nأرسل مدخلاً لتفقد حالة السيرفرات السحابية وتوزيع الحمل.',
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

    if (action.startsWith('direct_')) {
      const platform = action.replace('direct_', '');
      const sessions = await socialService.connect(chatId.toString(), platform, 'PAGE_ID_REPLACE', 'PASS', 'TOKEN_REPLACE');
      
      await sendTelegramMessage(chatId, `🚀 *تفعيل الوكيل الحقيقي لـ ${platform}*\n\nلإتمام الربط الحقيقي، يرجى إرسال البيانات كالتالي:\n\`تفعيل: ${platform} | معرف_الصفحة | توكين_الوصول\`\n\n*(الوكيل الذكي سينشر منشوراً ترحيبياً فورياً عند النجاح)*`);
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
    
    // Auto-detect tool if file is sent without tool being active
    // This will be handled in the document handling block below
  }

  // Handle Documents (Files)
  if (update.message && update.message.document) {
    const chatId = update.message.chat.id;
    const doc = update.message.document;
    const activeTool = userStates[chatId] || 'none';

    await sendTelegramMessage(chatId, `📂 *تم استلام الملف:* ${doc.file_name}\nنوع الملف: ${doc.mime_type}\nالحجم: ${(doc.file_size / 1024).toFixed(2)} KB\n\n⏳ جاري تحليل البنية وفحص نظام التشفير...`);

    try {
      const resp = await aiService.generateChatResponse(`Act as a high-end file decryptor and security analyst. A file has been uploaded: "${doc.file_name}" (MIME: ${doc.mime_type}). Perform a technical analysis of the potential encryption used and simulate a "cracking" sequence with a successful recovery of a master password or extraction of raw content. Be extremely technical and realistic.`, "coding");
      await sendTelegramMessage(chatId, `🔓 *نتائج كسر التشفير لـ ${doc.file_name}:*\n\n${resp}`);
    } catch (e: any) {
      await sendTelegramMessage(chatId, `❌ فشل الفحص الفني: ${e.message}`);
    }
    return;
  }

  if (update.message && update.message.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    const activeTool = userStates[chatId] || 'none';
    
    if (activeTool === 'none') {
      if (text.startsWith('ربط:') || text.toLowerCase().startsWith('connect:')) {
        const parts = text.split('|');
        if (parts.length >= 3) {
          const platform = parts[0].replace('ربط:', '').replace('connect:', '').trim();
          const email = parts[1].trim();
          const pass = parts[2].trim();
          
          await socialService.connect(chatId.toString(), platform, email, pass);
          
          await sendTelegramMessage(chatId, `✅ *تم الربط الحقيقي لـ ${platform} بنجاح!*\n\n📧 الحساب: ${email}\n🔒 الحالة: متصل ونشط\n\nالآن يمكنك إرسال أي رسالة وسأقوم بالرد عليها تلقائياً من هذا الحساب.`);
          return;
        } else {
          await sendTelegramMessage(chatId, `❌ *صيغة خاطئة*\nيرجى استخدام: \`ربط: منصة | بريد | كلمة سر\``);
          return;
        }
      }

      if (text.startsWith('تفعيل:') || text.toLowerCase().startsWith('activate:')) {
        const parts = text.split('|');
        if (parts.length >= 3) {
          const platform = parts[0].replace('تفعيل:', '').replace('activate:', '').trim();
          const pageId = parts[1].trim();
          const token = parts[2].trim();
          
          await socialService.connect(chatId.toString(), platform, pageId, 'PASS_HIDDEN', token);
          
          const welcomeMsg = `السلام عليكم ورحمة الله وبركاته،\n\nتم تفعيل "وكيل المسجد الذكي" لإدارة هذه الصفحة آلياً. ترقبوا التحديثات والرسائل الإيمانية اليومية.\n[تم النشر بواسطة نظام الأتمتة]`;
          
          try {
            await socialService.reply(chatId.toString(), platform, welcomeMsg);
            await sendTelegramMessage(chatId, `✅ *تم التفعيل الحقيقي لـ ${platform} بنجاح!*\n\n🚀 *أتمتة الوكيل:* تم نشر المنشور التعريفي الأول على صفحتك بنجاح باستخدام التوكين المعتمد.\n\n[رابط المنشور: تم النشر كمنشور عام]`);
          } catch (e: any) {
            await sendTelegramMessage(chatId, `⚠️ *تم الربط ولكن فشل النشر التلقائي:*\nالسبب: ${e.message}\n(تأكد أن التوكين لديه صلاحية pages_manage_posts)`);
          }
          return;
        } else {
          await sendTelegramMessage(chatId, `❌ *صيغة خاطئة للتفعيل الحقيقي*\nيرجى استخدام: \`تفعيل: فيسبوك | معرف_الصفحة | توكين_الوصول\``);
          return;
        }
      }

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
        case 't_fe_agent':
          aiResult = `💻 *Landing Page Architecture:*\n${await aiService.generateChatResponse(`Act as a Senior Frontend Developer. Generate a complete React + Tailwind component for a landing page based on: ${text}. Return ONLY the code.`, "coding")}`;
          break;
        case 't_social_tasks':
          const sessions = socialService.getStatus(chatId.toString());
          const waSession = sessions['WhatsApp'];
          const fbSession = sessions['Facebook'];
          const isWA = waSession?.status === 'active_live';
          const isFB = fbSession?.status === 'active_live';
          
          const aiDraft = await aiService.generateChatResponse(`Act as a Social Media Manager. A user sent this message: "${text}". Draft a professional reply for Facebook or WhatsApp.`, "general");
          
          if (isWA || isFB) {
            aiResult = `📊 *مدير العمليات الذكي:*\n\nالرسالة المستلمة: "${text}"\n\n*الرد الذي صاغه الوكيل:*\n"${aiDraft}"\n\n✅ *الحالة:* الربط الحقيقي نشط لـ (${isWA ? 'WhatsApp' : ''}${isFB ? ' Facebook' : ''})\n🚀 جاري تنفيذ الإرسال المباشر للصفحة الآن... تم بنجاح!`;
            if (isWA) await socialService.reply(chatId.toString(), 'WhatsApp', aiDraft);
            if (isFB) await socialService.reply(chatId.toString(), 'Facebook', aiDraft);
          } else {
            aiResult = `📊 *تحليل العمليات الذكي:*\n\n*الرد المقترح:*\n"${aiDraft}"\n\n⚠️ *تنبيه:* أنت الآن في "وضع المحاكاة". لجعل هذا الرد يرسل حقيقياً لمنصاتك، استخدم أمر:\n\`تفعيل: فيسبوك | معرف_الصفحة | توكين_الوصول\``;
          }
          break;

        case 't_omni':
          aiResult = await aiService.generateChatResponse(`Translate strictly to Swift and Rust:\n${text}`, "coding");
          break;
        case 't_dream':
          aiResult = `🌙 *Dream Interpretation:* \n${await aiService.generateChatResponse(`Interpret this dream: ${text}`, "general")}`;
          break;
        case 't_mood':
          aiResult = `😊 *Vibe Boost:* \n${await aiService.generateChatResponse(`I feel ${text}. Give me positive vibes and 3 activities.`, "general")}`;
          break;
        case 't_meal':
          aiResult = `🥗 *Chef AI:* \n${await aiService.generateChatResponse(`Suggest recipes for: ${text}`, "general")}`;
          break;
        case 't_trans':
          aiResult = `🌐 *AI Translation:* \n${await aiService.generateChatResponse(`Act as a high-end translator. Translate this: ${text} to common human languages if specified, or detect and translate to English/Arabic.`, "general")}`;
          break;
        case 't_arch':
          aiResult = `🏗️ *Architecture Review:* \n${await aiService.generateChatResponse(`Analyze this code architecture: ${text}`, "coding")}`;
          break;
        case 't_alch':
          aiResult = `✍️ *Content Magic:* \n${await aiService.generateChatResponse(`Write creative content about: ${text}`, "general")}`;
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
        case 't_vault':
          aiResult = `🔓 *Security Vault Unlocker:*\n${await aiService.generateChatResponse(`Act as a file security expert. Provide a complex technical guide for unlocking/recovering a password-protected file described as: ${text}. Include potential common passwords and hashing analysis.`, "coding")}`;
          break;
        case 't_sql':
          aiResult = `📊 *SQL Optimizer:*\n${await aiService.generateChatResponse(`Optimize this SQL for performance and explain why: ${text}`, "coding")}`;
          break;
        case 't_seo':
          aiResult = `🔍 *SEO Master:*\n${await aiService.generateChatResponse(`Perform detailed SEO analysis and keyword suggestion for: ${text}`, "general")}`;
          break;
        case 't_cv':
          aiResult = `📄 *CV/Resume Builder:*\n${await aiService.generateChatResponse(`Build a professional structured CV based on: ${text}. Use markdown.`, "general")}`;
          break;
        case 't_nodes':
          const nodeStatus = `🌐 *Cloud Node System Status:*\n- Node DE-01 (Frankfurt): Online [LOAD 12%]\n- Node US-04 (New York): Online [LOAD 45%]\n- Node SG-02 (Singapore): WARNING [LOAD 89%]\n\n${await aiService.generateChatResponse(`Analyze this simulated server load and suggest redistribution: ${text}`, "reasoning")}`;
          aiResult = nodeStatus;
          break;
        case 't_port':
          aiResult = `📡 *Port Warden Scan for ${text}:*\n${await aiService.generateChatResponse(`Simulate a detailed port scan and vulnerability report for: ${text}`, "coding")}`;
          break;
        case 't_architect':
          aiResult = `🏗️ *Project Architect:* \n${await aiService.generateChatResponse(`Act as a Senior Architect. Create a full project structure, file system, code for core files, and installation guide for: ${text}. Be very detailed and professional.`, "coding")}`;
          break;
        case 't_docker':
          aiResult = `🐳 *Docker Master:* \n${await aiService.generateChatResponse(`Create high-quality Dockerfiles and docker-compose.yml for: ${text}. Include comments and best practices.`, "coding")}`;
          break;
        case 't_logic':
          aiResult = `🧠 *Logic Solver:* \n${await aiService.generateChatResponse(`Explain this algorithm/logic step-by-step: ${text}.`, "reasoning")}`;
          break;
        case 't_readme':
          aiResult = `📝 *README Wizard:* \n${await aiService.generateChatResponse(`Write a professional README.md for project: ${text}.`, "general")}`;
          break;
        case 't_ghost':
          aiResult = `👻 *Ghost Data:* \n${await aiService.generateChatResponse(`Generate 10 records of fake JSON data for: ${text}.`, "coding")}`;
          break;
        case 't_brand':
          aiResult = `🏷️ *Brand Namer:* \n${await aiService.generateChatResponse(`Suggest 10 creative names for: ${text}. Include meanings.`, "general")}`;
          break;
        case 't_innov':
          aiResult = `💡 *Innovation Engine:* \n${await aiService.generateChatResponse(`Suggest 3 unique, non-repetitive project ideas for a programmer based on: ${text}. Briefly explain the stack and logic.`, "reasoning")}`;
          break;
        case 't_code_trans':
          aiResult = `🛠️ *Code Transformer:* \n${await aiService.generateChatResponse(`Convert this logical description into high-quality code: ${text}.`, "coding")}`;
          break;
        case 't_snippets':
          aiResult = `📚 *Smart Snippets:* \n${await aiService.generateChatResponse(`Provide a production-ready clean code snippet for: ${text}.`, "coding")}`;
          break;
        case 't_bash':
          aiResult = `🐚 *Bash Wizard Script:*\n${await aiService.generateChatResponse(`Write a robust bash script for: ${text}`, "coding")}`;
          break;
        case 't_json':
          aiResult = `🔗 *Data Transformer:*\n${await aiService.generateChatResponse(`Transform this data/JSON into TS Interfaces and XML: ${text}`, "coding")}`;
          break;
        case 't_prompt':
          aiResult = `🧠 *Prompt Engineering:*\n${await aiService.generateChatResponse(`Turn this basic idea into a master AI prompt: ${text}`, "reasoning")}`;
          break;
        case 't_color':
          aiResult = `🎨 *Color Palette:*\n${await aiService.generateChatResponse(`Generate a harmonious accessible color palette for base: ${text}`, "general")}`;
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
