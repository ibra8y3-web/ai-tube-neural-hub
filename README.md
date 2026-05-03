# ⚡ Aether Core (أثير كور) - The Ultimate CLI & GUI Automation Hub

Aether Core is an enterprise-grade, decentralized AI operations platform that serves as a single neural hub for engineering, design, and automation. It dynamically orchestrates the most powerful large language models and integrates a complete digital factory into your workflow.

**أثير كور** هو منصة تشغيل ذكاء اصطناعي لامركزية تعتبر مركزاً عصبياً موحداً للهندسة، التصميم، والأتمتة. يمكنك تشغيله والتحكم به بالكامل عبر سطر الأوامر (CLI) من Termux أو Linux أو عبر واجهاته الرسومية القوية.

---

## 🌟 ميزات وكيل الأتمتة (Agentic Features)

- **سطر الأوامر المتقدم (CLI & Termux Integration):** تحكم كامل في التطبيق عن بعد باستخدام مفاتيح API الخاصة والتكامل السلس مع Termux و Terminal.
- **توليد المفاتيح (API Keys Management):** لوحة تحكم داخلية لإصدار وإدارة وإبطال مفاتيح الوصول لربط تطبيقات خارجية أو نصوص برمجية (Scripts).
- **أتمتة منصات التواصل (Social Automation):** ربط حقيقي (Deep Connect) بمنصات فيسبوك، واتساب وغيرها لجدولة ونشر ومسح الرسائل برمجياً عبر الـ CLI.
- **توجيه الذكاء الاصطناعي (Neural Routing):** التبديل التلقائي بين نماذج Groq, OpenRouter, Hugging Face لضمان السرعة.
- **لوحات تحكم المختبرات (60+ Labs):** من محاكيات 3D، مهام ديف-أوبس (DevOps)، الترجمة الشاملة، إلى منشئ الأكواد ومهندس البنية التحتية.

---

## 🚀 طريقة الربط والتشغيل عبر سطر الأوامر (CLI)

بفضل نظام API Keys المدمج، يمكنك إصدار أوامر من جهازك (مثلاً عبر Termux في هاتفك، أو سيرفر Linux) دون الحاجة لفتح المتصفح.

### 1- إصدار مفتاح API (من لوحة التحكم)
1. افتح التطبيق في المتصفح.
2. اذهب إلى **الإعدادات (Settings) > الهندسة والتطوير (Engineering & Dev) > مفاتيح CLI**.
3. قم بتوليد مفتاح جديد (مثلاً: `aether_f5825b...`) وانسخه.

### 2- التشغيل والتحكم عبر Termux أو Linux
استخدم أداة `cURL` أو أي لغة برمجة (Python, Node.js) لإرسال الأوامر. 

> **ملاحظة هامة:** بيئة التطوير الحالية (AI Studio / Preview) محمية بجدار حماية (Nginx Reverse Proxy) يمنع طلبات `POST` الخارجية (cURL) لأغراض الأمان وسيعطيك خطأ `405 Not Allowed`. لكي تعمل مفاتيح التطبيق خارجياً بشكل كامل عبر Termux أو أي سيرفر، **يجب رفع المشروع على أي استضافة تدعم Node.js (مثل سيرفرات VPS، Hostinger، Render، Vercel، Railway، أو غيرها).** التطبيق مهيأ تلقائياً للعمل على أي بيئة حقيقية. تم إعداد `vercel.json` وملف `api/server.ts` ليعمل بسلاسة على Vercel أيضاً.

### 💾 نظام الحفظ ومعرف الربط التلقائي (Auto-Save & Routing IDs)
تم هندسة التطبيق ليقوم بإدارة وحفظ جلساتك بشكل آلي، إليك كيفية العمل:
- **معرف الربط التلقائي (Connection ID):** بمجرد إنشاء مفتاح عبر لوحة **"مفاتيح CLI"**، يقوم النظام بتوليد معرف فريد ومفتاح وصول آمن (مثلاً `aether_...`) ويتم ربطه تلقائياً بصلاحياتك، لتستخدمه كمعرف وحيد للتواصل بین Termux والتطبيق.
- **الحفظ التلقائي للاستضافات (Persistent Saving):** جميع جلسات التواصل (حسابات الفيسبوك والواتساب المربوطة) ومفاتيح الـ API يتم الاحتفاظ بها تلقائياً في ملفات الـ System كـ (`api_keys.json` و `social_sessions.json`).  
*(تنويه: إذا كنت تستخدم استضافات Serverless مثل Vercel التي تحذف الملفات المؤقتة، يمكنك استبدال وسيلة الحفظ بـ MongoDB أو Firebase من داخل الواجهة بسهولة لحفظ دائم ومستمر).*

**مثال: فحص حالة النظام (System Status)**
```bash
curl -X POST https://app-url.com/api/cli/execute \
  -H "X-API-Key: aether_YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"command": "system --status"}'
```

**مثال: ربط منصة التواصل الاجتماعي**
```bash
curl -X POST https://app-url.com/api/cli/execute \
  -H "X-API-Key: aether_YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"command": "auth facebook YOUR_ACCESS_TOKEN"}'
```

**مثال: التحدث مع مساعد الذكاء الاصطناعي**
```bash
curl -X POST https://app-url.com/api/cli/execute \
  -H "X-API-Key: aether_YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"command": "chat اكتب لي رسالة دعوية قصيرة لصباح اليوم"}'
```

---

## 📦 التثبيت والتشغيل المحلي (Installation)

1. استنساخ المستودع (Clone Repository):
   ```bash
   git clone https://github.com/your-username/aether-core.git
   ```
2. تثبيت الحزم (Install Dependencies):
   ```bash
   npm install
   ```
3. ضبط متغيرات البيئة في ملف `.env`:
   ```env
   GROQ_API_KEY="your_groq_key_here"
   # وغيرها من المفاتيح المذكورة في .env.example
   ```
4. تشغيل الخادم (Start Server):
   ```bash
   npm run dev
   ```

---

## 📱 Telegram Integration

إلى جانب أوامر الـ CLI، يتضمن التطبيق روبوت تيليجرام مدمج متصل بالخادم الخاص بك مباشرة. يمكنك من خلاله إصدار أوامر الأتمتة (مثل `تفعيل: المنصة | المعرف | التوكين`) ومراقبة العمليات بشكل لحظي.

## 📜 License

Designed and structured for advanced AI orchestrations and headless CLI integrations. All rights reserved.
