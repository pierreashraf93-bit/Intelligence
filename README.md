# الهيئة العليا لأمن الدولة — بوابة العمليات السرية
### State Security Operations Portal (Pierre Ashraf)

منصة استخباراتية تفاعلية سينمائية مبنية باستخدام React 19، Vite، وTailwind CSS.

---

## 🛠️ كيفية تشغيل المشروع على اللابتوب (Local Machine)

### السبب في ظهور الشاشة البيضاء عند فتح الملف مباشرة:
المتصفحات الحديثة (Chrome, Edge, Firefox) تمنع تشغيل ملفات JavaScript من نوع (ES Modules) مباشرة عبر بروتوكول `file:///` عند الضغط مرتين على ملف `index.html` بسبب قيود أمان المتصفح (CORS Policy).

لتشغيل المشروع بشكل صحيح على جهازك:

### الخطوة 1: تثبيت الحزم (Dependencies)
تأكد من تثبيت [Node.js](https://nodejs.org) على جهازك، ثم افتح موجه الأوامر (Terminal / CMD) في مجلد المشروع ونفّذ:
```bash
npm install
```

### الخطوة 2: تشغيل المشروع في وضع التطوير (Dev Server)
```bash
npm run dev
```
ثم افتح الرابط في المتصفح:
`http://localhost:3000`

### أو تشغيل النسخة الإنتاجية المبنية (Production Build Preview):
```bash
npm run build
npm run preview
```

---

## 🌐 النشر على GitHub Pages (بدون شاشة بيضاء)

تم ضبط ملف `vite.config.ts` بخاصية:
```ts
base: './'
```
هذا يضمن أن جميع مسارات الملفات (`CSS` و `JS`) تكون نسبية وتعمل على أي مستودع GitHub Pages مثل:
`https://username.github.io/repository-name/`

### خطوات رفع مجلد dist إلى GitHub Pages:
1. قم بتنفيذ:
   ```bash
   npm run build
   ```
2. ادخل إلى إعدادات المستودع على GitHub:
   `Settings -> Pages -> Build and deployment -> Source`
3. اختر إما GitHub Actions للنشر التلقائي لـ Vite، أو اختر مجلد `gh-pages` / `dist`.
