(function () {
  "use strict";

  const STORAGE_KEY = "mini_toolkit_lang";
  const SUPPORTED = ["en", "zh", "hi", "es", "fr", "ja", "pt", "de", "ko"];
  const LANG_LABELS = {
    en: "English",
    zh: "中文",
    hi: "हिन्दी",
    es: "Español",
    fr: "Français",
    ja: "日本語",
    pt: "Português",
    de: "Deutsch",
    ko: "한국어"
  };

  const UI = {
    en: {
      "nav.tools": "Tools",
      "nav.blog": "Blog",
      "back.tools": "← Back to All Tools",
      "dash.title": "Tools Dashboard",
      "dash.search": "Search 30 tools...",
      "dash.all": "All",
      "dash.empty": "No matching tools found.",
      "blog.title": "Blog",
      "blog.desc": "Tool introductions, usage guides, and practical tips.",
      "blog.back": "← Back to Posts",
      "blog.loading": "Loading posts...",
      "comments.title": "Comments",
      "comments.desc": "Share feedback, bug reports, or feature requests.",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ Buy Me a Coffee",
      "common.copy": "Copy",
      "common.copied": "Copied to clipboard!",
      "common.clear": "Clear",
      "common.generate": "Generate",
      "common.convert": "Convert",
      "common.reset": "Reset",
      "common.download": "Download",
      "common.input": "Input",
      "common.output": "Output",
      "common.sample": "Sample"
    },
    zh: {
      "nav.tools": "工具",
      "nav.blog": "博客",
      "back.tools": "← 返回全部工具",
      "dash.title": "工具导航",
      "dash.search": "搜索 30 个工具...",
      "dash.all": "全部",
      "dash.empty": "未找到匹配的工具。",
      "blog.title": "博客",
      "blog.desc": "工具介绍、使用指南与实用技巧。",
      "blog.back": "← 返回文章列表",
      "blog.loading": "正在加载文章...",
      "comments.title": "评论",
      "comments.desc": "欢迎留下使用反馈、问题报告或功能建议。",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ 请我喝杯咖啡",
      "common.copy": "复制",
      "common.copied": "已复制到剪贴板！",
      "common.clear": "清空",
      "common.generate": "生成",
      "common.convert": "转换",
      "common.reset": "重置",
      "common.download": "下载",
      "common.input": "输入",
      "common.output": "输出",
      "common.sample": "示例"
    },
    hi: {
      "nav.tools": "टूल्स",
      "nav.blog": "ब्लॉग",
      "back.tools": "← सभी टूल्स पर वापस जाएं",
      "dash.title": "टूल्स डैशबोर्ड",
      "dash.search": "30 टूल्स खोजें...",
      "dash.all": "सभी",
      "dash.empty": "कोई टूल नहीं मिला।",
      "blog.title": "ब्लॉग",
      "blog.desc": "टूल परिचय, उपयोग गाइड और उपयोगी टिप्स।",
      "blog.back": "← पोस्ट सूची पर वापस जाएं",
      "blog.loading": "पोस्ट लोड हो रही हैं...",
      "comments.title": "टिप्पणियाँ",
      "comments.desc": "प्रतिक्रिया, बग रिपोर्ट या फीचर सुझाव साझा करें।",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ कॉफी पिलाएं",
      "common.copy": "कॉपी करें",
      "common.copied": "क्लिपबोर्ड पर कॉपी हो गया!",
      "common.clear": "साफ करें",
      "common.generate": "जनरेट करें",
      "common.convert": "कन्वर्ट करें",
      "common.reset": "रीसेट",
      "common.download": "डाउनलोड",
      "common.input": "इनपुट",
      "common.output": "आउटपुट",
      "common.sample": "नमूना"
    },
    es: {
      "nav.tools": "Herramientas",
      "nav.blog": "Blog",
      "back.tools": "← Volver a herramientas",
      "dash.title": "Panel de Herramientas",
      "dash.search": "Buscar entre 30 herramientas...",
      "dash.all": "Todas",
      "dash.empty": "No se encontraron herramientas.",
      "blog.title": "Blog",
      "blog.desc": "Guías de uso, presentaciones de herramientas y consejos.",
      "blog.back": "← Volver a artículos",
      "blog.loading": "Cargando artículos...",
      "comments.title": "Comentarios",
      "comments.desc": "Comparte tu opinión, errores o sugerencias.",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ Invítame a un café",
      "common.copy": "Copiar",
      "common.copied": "¡Copiado al portapapeles!",
      "common.clear": "Limpiar",
      "common.generate": "Generar",
      "common.convert": "Convertir",
      "common.reset": "Reiniciar",
      "common.download": "Descargar",
      "common.input": "Entrada",
      "common.output": "Salida",
      "common.sample": "Ejemplo"
    },
    fr: {
      "nav.tools": "Outils",
      "nav.blog": "Blog",
      "back.tools": "← Retour aux outils",
      "dash.title": "Tableau des Outils",
      "dash.search": "Rechercher parmi 30 outils...",
      "dash.all": "Tous",
      "dash.empty": "Aucun outil trouvé.",
      "blog.title": "Blog",
      "blog.desc": "Guides d'utilisation, présentations d'outils et astuces.",
      "blog.back": "← Retour aux articles",
      "blog.loading": "Chargement des articles...",
      "comments.title": "Commentaires",
      "comments.desc": "Partagez vos avis, bugs ou idées de fonctionnalités.",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ Offrir un café",
      "common.copy": "Copier",
      "common.copied": "Copié dans le presse-papiers !",
      "common.clear": "Effacer",
      "common.generate": "Générer",
      "common.convert": "Convertir",
      "common.reset": "Réinitialiser",
      "common.download": "Télécharger",
      "common.input": "Entrée",
      "common.output": "Sortie",
      "common.sample": "Exemple"
    },
    ko: {
      "nav.tools": "Tools",
      "nav.blog": "Blog",
      "back.tools": "← 모든 툴 보기",
      "dash.title": "Tools 대시보드",
      "dash.search": "30개 툴 검색...",
      "dash.all": "전체",
      "dash.empty": "일치하는 툴이 없습니다.",
      "blog.title": "Blog",
      "blog.desc": "30가지 웹 툴 소개와 사용법을 정리했습니다.",
      "blog.back": "← 글 목록으로",
      "blog.loading": "글 목록을 불러오는 중...",
      "comments.title": "댓글",
      "comments.desc": "사용 후기, 버그 제보, 기능 요청을 자유롭게 남겨주세요.",
      "footer.copy": "© 2026 Mini Toolkit",
      "footer.coffee": "☕ 커피 한 잔 후원하기",
      "common.copy": "복사",
      "common.copied": "클립보드에 복사되었습니다!",
      "common.clear": "지우기",
      "common.generate": "생성",
      "common.convert": "변환",
      "common.reset": "초기화",
      "common.download": "다운로드",
      "common.input": "입력",
      "common.output": "결과",
      "common.sample": "샘플"
    }
  };


  const EXTRA_UI = {"en": {"loan.amt": "Principal Amount", "loan.rate": "Annual Interest (%)", "loan.months": "Term (Months)", "loan.emi": "Monthly Payment", "loan.int": "Total Interest", "loan.tot": "Total Repayment", "bmi.h": "Height (cm)", "bmi.w": "Weight (kg)", "bmi.age": "Age", "bmi.bmr": "BMR (kcal/day)", "bmi.tdee": "Maintenance (kcal/day)", "pct.q1": "What is X% of Y?", "pct.q2": "X is what % of Y?", "pct.q3": "% Change (X → Y)", "age.start": "Birth Date / Start Date", "age.end": "Target Date", "age.ymd": "Years / Months / Days", "age.days": "Total Days", "pm.focus": "Focus (25m)", "pm.short": "Short Break (5m)", "pm.long": "Long Break (15m)", "pm.start": "Start", "pm.pause": "Pause", "sw.start": "Start", "sw.lap": "Lap", "tz.ref": "Reference Local Time", "tz.now": "Now", "nb.dec": "Decimal (Base 10)", "nb.hex": "Hexadecimal (Base 16)", "nb.bin": "Binary (Base 2)", "nb.oct": "Octal (Base 8)", "ar.w1": "Original Width", "ar.h1": "Original Height", "ar.w2": "Target Width", "ar.h2": "Target Height", "ar.ratio": "Simplified Ratio", "uc.cat": "Category", "uc.from": "From", "uc.to": "To", "uc.val": "Value", "uc.res": "Result", "uc.len": "Length", "uc.wt": "Weight", "uc.tmp": "Temperature", "uc.dat": "Data Storage", "ug.cnt": "Count", "ug.up": "Uppercase", "ug.nh": "No Hyphens", "pg.len": "Length", "ts.num": "Unix Timestamp (sec or ms)", "ts.now": "Now", "ts.dt": "Date / Time (Local)", "ir.w": "Width (px)", "ir.h": "Height (px)", "ir.q": "Quality (0.1 - 1.0)", "ir.lock": "Lock Aspect Ratio", "df.cmp": "Compare", "df.a": "Original Text", "df.b": "Changed Text", "rx.str": "Test String", "md.copy": "Copy HTML", "md.prev": "Preview", "jwt.tok": "JWT Token", "jwt.hdr": "Header", "jwt.pay": "Payload", "lr.para": "Paragraphs", "lr.sent": "Sentences", "ue.enc": "Encode", "ue.dec": "Decode", "he.enc": "Encode", "he.dec": "Decode", "jf.fmt": "Format", "jf.min": "Minify", "jf.in": "Input JSON", "jf.out": "Output", "b64.enc": "Encode (Text → Base64)", "b64.dec": "Decode (Base64 → Text)", "tc.in": "Input Text", "tc.ws": "With Spaces", "tc.ns": "No Spaces", "tc.wd": "Words", "tc.by": "UTF-8 Bytes", "pdf.drop": "Drag & drop images here or click to select", "pdf.sub": "Supports PNG, JPG, WebP, GIF · Multiple files & reordering", "pdf.size": "Page Size", "pdf.orient": "Orientation", "pdf.margin": "Margin", "pdf.fname": "File Name", "pdf.add": "+ Add Images", "pdf.clr": "Clear All", "pdf.dl": "Download PDF"}, "zh": {"loan.amt": "贷款本金", "loan.rate": "年利率 (%)", "loan.months": "贷款期限 (月)", "loan.emi": "每月还款额", "loan.int": "总利息", "loan.tot": "还款总额", "bmi.h": "身高 (cm)", "bmi.w": "体重 (kg)", "bmi.age": "年龄", "bmi.bmr": "基础代谢 BMR (kcal/天)", "bmi.tdee": "每日维持热量 (kcal/天)", "pct.q1": "Y 的 X% 是多少？", "pct.q2": "X 是 Y 的百分之几？", "pct.q3": "变化率 (X → Y)", "age.start": "出生日期 / 开始日期", "age.end": "目标日期", "age.ymd": "年 / 月 / 日", "age.days": "总天数", "pm.focus": "专注 (25分)", "pm.short": "短休息 (5分)", "pm.long": "长休息 (15分)", "pm.start": "开始", "pm.pause": "暂停", "sw.start": "开始", "sw.lap": "计次", "tz.ref": "参考本地时间", "tz.now": "现在", "nb.dec": "十进制 (Base 10)", "nb.hex": "十六进制 (Base 16)", "nb.bin": "二进制 (Base 2)", "nb.oct": "八进制 (Base 8)", "ar.w1": "原始宽度", "ar.h1": "原始高度", "ar.w2": "目标宽度", "ar.h2": "目标高度", "ar.ratio": "化简宽高比", "uc.cat": "类别", "uc.from": "从", "uc.to": "到", "uc.val": "数值", "uc.res": "结果", "uc.len": "长度", "uc.wt": "重量", "uc.tmp": "温度", "uc.dat": "数据存储", "ug.cnt": "数量", "ug.up": "大写", "ug.nh": "去除连字符", "pg.len": "长度", "ts.num": "Unix 时间戳 (秒或毫秒)", "ts.now": "现在", "ts.dt": "日期 / 时间 (本地)", "ir.w": "宽度 (px)", "ir.h": "高度 (px)", "ir.q": "质量 (0.1 - 1.0)", "ir.lock": "锁定宽高比", "df.cmp": "对比", "df.a": "原始文本", "df.b": "修改后文本", "rx.str": "测试文本", "md.copy": "复制 HTML", "md.prev": "预览", "jwt.tok": "JWT 令牌", "jwt.hdr": "头部 (Header)", "jwt.pay": "载荷 (Payload)", "lr.para": "段落", "lr.sent": "句子", "ue.enc": "编码", "ue.dec": "解码", "he.enc": "编码", "he.dec": "解码", "jf.fmt": "格式化", "jf.min": "压缩", "jf.in": "输入 JSON", "jf.out": "输出结果", "b64.enc": "编码 (文本 → Base64)", "b64.dec": "解码 (Base64 → 文本)", "tc.in": "输入文本", "tc.ws": "含空格字符", "tc.ns": "不含空格", "tc.wd": "单词数", "tc.by": "UTF-8 字节", "pdf.drop": "将图片拖拽到此处或点击选择", "pdf.sub": "支持 PNG, JPG, WebP, GIF · 可多选并调整顺序", "pdf.size": "纸张大小", "pdf.orient": "方向", "pdf.margin": "边距", "pdf.fname": "文件名", "pdf.add": "+ 添加图片", "pdf.clr": "全部清空", "pdf.dl": "下载 PDF"}, "hi": {"loan.amt": "मूल राशि (Principal)", "loan.rate": "वार्षिक ब्याज (%)", "loan.months": "अवधि (महीने)", "loan.emi": "मासिक किस्त (EMI)", "loan.int": "कुल ब्याज", "loan.tot": "कुल भुगतान", "bmi.h": "ऊंचाई (cm)", "bmi.w": "वजन (kg)", "bmi.age": "आयु", "bmi.bmr": "BMR (kcal/दिन)", "bmi.tdee": "दैनिक कैलोरी (kcal/दिन)", "pct.q1": "Y का X% क्या है?", "pct.q2": "X, Y का कितना % है?", "pct.q3": "% बदलाव (X → Y)", "age.start": "जन्म तिथि / प्रारंभ तिथि", "age.end": "लक्ष्य तिथि", "age.ymd": "साल / महीने / दिन", "age.days": "कुल दिन", "pm.focus": "फोकस (25मि)", "pm.short": "छोटा ब्रेक (5मि)", "pm.long": "लंबा ब्रेक (15मि)", "pm.start": "शुरू", "pm.pause": "रोकें", "sw.start": "शुरू", "sw.lap": "लैप", "tz.ref": "स्थानीय समय", "tz.now": "अभी", "nb.dec": "दशमलव (Base 10)", "nb.hex": "हेक्साडेसिमल (Base 16)", "nb.bin": "बाइनरी (Base 2)", "nb.oct": "ऑक्टल (Base 8)", "ar.w1": "मूल चौड़ाई", "ar.h1": "मूल ऊंचाई", "ar.w2": "लक्ष्य चौड़ाई", "ar.h2": "लक्ष्य ऊंचाई", "ar.ratio": "सरल अनुपात", "uc.cat": "श्रेणी", "uc.from": "से", "uc.to": "में", "uc.val": "मान", "uc.res": "परिणाम", "uc.len": "लंबाई", "uc.wt": "वजन", "uc.tmp": "तापमान", "uc.dat": "डेटा स्टोरेज", "ug.cnt": "संख्या", "ug.up": "बड़े अक्षर", "ug.nh": "बिना हाइफ़न", "pg.len": "लंबाई", "ts.num": "Unix टाइमस्टैम्प (सेकंड/मि.से.)", "ts.now": "अभी", "ts.dt": "तिथि / समय (स्थानीय)", "ir.w": "चौड़ाई (px)", "ir.h": "ऊंचाई (px)", "ir.q": "गुणवत्ता (0.1 - 1.0)", "ir.lock": "अनुपात लॉक करें", "df.cmp": "तुलना करें", "df.a": "मूल टेक्स्ट", "df.b": "बदला हुआ टेक्स्ट", "rx.str": "टेस्ट स्ट्रिंग", "md.copy": "HTML कॉपी करें", "md.prev": "प्रीव्यू", "jwt.tok": "JWT टोकन", "jwt.hdr": "हेडर", "jwt.pay": "पेलोड", "lr.para": "पैराग्राफ", "lr.sent": "वाक्य", "ue.enc": "एनकोड", "ue.dec": "डिकोड", "he.enc": "एनकोड", "he.dec": "डिकोड", "jf.fmt": "फॉर्मेट", "jf.min": "मिनीफाई", "jf.in": "इनपुट JSON", "jf.out": "आउटपुट", "b64.enc": "एनकोड (Text → Base64)", "b64.dec": "डिकोड (Base64 → Text)", "tc.in": "टेक्स्ट दर्ज करें", "tc.ws": "स्पेस सहित", "tc.ns": "स्पेस रहित", "tc.wd": "शब्द", "tc.by": "UTF-8 बाइट्स", "pdf.drop": "इमेज यहाँ खींचें या चुनने के लिए क्लिक करें", "pdf.sub": "PNG, JPG, WebP, GIF समर्थित · क्रम बदलें", "pdf.size": "पेज आकार", "pdf.orient": "दिशा", "pdf.margin": "मार्जिन", "pdf.fname": "फ़ाइल का नाम", "pdf.add": "+ इमेज जोड़ें", "pdf.clr": "सभी साफ करें", "pdf.dl": "PDF डाउनलोड"}, "es": {"loan.amt": "Monto del Préstamo", "loan.rate": "Interés Anual (%)", "loan.months": "Plazo (Meses)", "loan.emi": "Pago Mensual", "loan.int": "Interés Total", "loan.tot": "Pago Total", "bmi.h": "Altura (cm)", "bmi.w": "Peso (kg)", "bmi.age": "Edad", "bmi.bmr": "TMB (kcal/día)", "bmi.tdee": "Mantenimiento (kcal/día)", "pct.q1": "¿Cuánto es X% de Y?", "pct.q2": "¿X qué % es de Y?", "pct.q3": "% Cambio (X → Y)", "age.start": "Fecha de Nacimiento / Inicio", "age.end": "Fecha Objetivo", "age.ymd": "Años / Meses / Días", "age.days": "Días Totales", "pm.focus": "Enfoque (25m)", "pm.short": "Descanso Corto (5m)", "pm.long": "Descanso Largo (15m)", "pm.start": "Iniciar", "pm.pause": "Pausar", "sw.start": "Iniciar", "sw.lap": "Vuelta", "tz.ref": "Hora Local de Referencia", "tz.now": "Ahora", "nb.dec": "Decimal (Base 10)", "nb.hex": "Hexadecimal (Base 16)", "nb.bin": "Binario (Base 2)", "nb.oct": "Octal (Base 8)", "ar.w1": "Ancho Original", "ar.h1": "Alto Original", "ar.w2": "Ancho Objetivo", "ar.h2": "Alto Objetivo", "ar.ratio": "Relación Simplificada", "uc.cat": "Categoría", "uc.from": "De", "uc.to": "A", "uc.val": "Valor", "uc.res": "Resultado", "uc.len": "Longitud", "uc.wt": "Peso", "uc.tmp": "Temperatura", "uc.dat": "Almacenamiento", "ug.cnt": "Cantidad", "ug.up": "Mayúsculas", "ug.nh": "Sin Guiones", "pg.len": "Longitud", "ts.num": "Timestamp Unix (seg o ms)", "ts.now": "Ahora", "ts.dt": "Fecha / Hora (Local)", "ir.w": "Ancho (px)", "ir.h": "Alto (px)", "ir.q": "Calidad (0.1 - 1.0)", "ir.lock": "Bloquear Proporción", "df.cmp": "Comparar", "df.a": "Texto Original", "df.b": "Texto Modificado", "rx.str": "Texto de Prueba", "md.copy": "Copiar HTML", "md.prev": "Vista Previa", "jwt.tok": "Token JWT", "jwt.hdr": "Encabezado", "jwt.pay": "Payload", "lr.para": "Párrafos", "lr.sent": "Frases", "ue.enc": "Codificar", "ue.dec": "Decodificar", "he.enc": "Codificar", "he.dec": "Decodificar", "jf.fmt": "Formatear", "jf.min": "Minificar", "jf.in": "JSON de Entrada", "jf.out": "Resultado", "b64.enc": "Codificar (Texto → Base64)", "b64.dec": "Decodificar (Base64 → Texto)", "tc.in": "Texto de Entrada", "tc.ws": "Con Espacios", "tc.ns": "Sin Espacios", "tc.wd": "Palabras", "tc.by": "Bytes UTF-8", "pdf.drop": "Arrastra imágenes aquí o haz clic para seleccionar", "pdf.sub": "Soporta PNG, JPG, WebP, GIF · Múltiples archivos y reordenamiento", "pdf.size": "Tamaño de Página", "pdf.orient": "Orientación", "pdf.margin": "Margen", "pdf.fname": "Nombre del Archivo", "pdf.add": "+ Añadir Imágenes", "pdf.clr": "Limpiar Todo", "pdf.dl": "Descargar PDF"}, "fr": {"loan.amt": "Montant du Prêt", "loan.rate": "Taux Annuel (%)", "loan.months": "Durée (Mois)", "loan.emi": "Mensualité", "loan.int": "Intérêts Totaux", "loan.tot": "Coût Total", "bmi.h": "Taille (cm)", "bmi.w": "Poids (kg)", "bmi.age": "Âge", "bmi.bmr": "MB (kcal/jour)", "bmi.tdee": "Maintien (kcal/jour)", "pct.q1": "Combien fait X% de Y ?", "pct.q2": "X est quel % de Y ?", "pct.q3": "% Variation (X → Y)", "age.start": "Date de Naissance / Début", "age.end": "Date Cible", "age.ymd": "Ans / Mois / Jours", "age.days": "Jours Totaux", "pm.focus": "Focus (25m)", "pm.short": "Pause Courte (5m)", "pm.long": "Pause Longue (15m)", "pm.start": "Démarrer", "pm.pause": "Pause", "sw.start": "Démarrer", "sw.lap": "Tour", "tz.ref": "Heure Locale de Référence", "tz.now": "Maintenant", "nb.dec": "Décimal (Base 10)", "nb.hex": "Hexadécimal (Base 16)", "nb.bin": "Binaire (Base 2)", "nb.oct": "Octal (Base 8)", "ar.w1": "Largeur Originale", "ar.h1": "Hauteur Originale", "ar.w2": "Largeur Cible", "ar.h2": "Hauteur Cible", "ar.ratio": "Ratio Simplifié", "uc.cat": "Catégorie", "uc.from": "De", "uc.to": "Vers", "uc.val": "Valeur", "uc.res": "Résultat", "uc.len": "Longueur", "uc.wt": "Poids", "uc.tmp": "Température", "uc.dat": "Stockage", "ug.cnt": "Nombre", "ug.up": "Majuscules", "ug.nh": "Sans Tirets", "pg.len": "Longueur", "ts.num": "Timestamp Unix (sec ou ms)", "ts.now": "Maintenant", "ts.dt": "Date / Heure (Locale)", "ir.w": "Largeur (px)", "ir.h": "Hauteur (px)", "ir.q": "Qualité (0.1 - 1.0)", "ir.lock": "Verrouiller Ratio", "df.cmp": "Comparer", "df.a": "Texte Original", "df.b": "Texte Modifié", "rx.str": "Texte de Test", "md.copy": "Copier HTML", "md.prev": "Aperçu", "jwt.tok": "Jeton JWT", "jwt.hdr": "En-tête", "jwt.pay": "Payload", "lr.para": "Paragraphes", "lr.sent": "Phrases", "ue.enc": "Encoder", "ue.dec": "Décoder", "he.enc": "Encoder", "he.dec": "Décoder", "jf.fmt": "Formater", "jf.min": "Minifier", "jf.in": "JSON Entrée", "jf.out": "Résultat", "b64.enc": "Encoder (Texte → Base64)", "b64.dec": "Décoder (Base64 → Texte)", "tc.in": "Texte d'Entrée", "tc.ws": "Avec Espaces", "tc.ns": "Sans Espaces", "tc.wd": "Mots", "tc.by": "Octets UTF-8", "pdf.drop": "Glissez des images ici ou cliquez pour choisir", "pdf.sub": "PNG, JPG, WebP, GIF · Sélection multiple et réorganisation", "pdf.size": "Format", "pdf.orient": "Orientation", "pdf.margin": "Marge", "pdf.fname": "Nom du Fichier", "pdf.add": "+ Ajouter Images", "pdf.clr": "Tout Effacer", "pdf.dl": "Télécharger PDF"}, "ko": {"loan.amt": "대출 원금", "loan.rate": "연 이자율 (%)", "loan.months": "대출 기간 (개월)", "loan.emi": "월 상환액", "loan.int": "총 이자", "loan.tot": "총 상환액", "bmi.h": "키 (cm)", "bmi.w": "체중 (kg)", "bmi.age": "나이", "bmi.bmr": "기초대사량 BMR (kcal/일)", "bmi.tdee": "유지 칼로리 (kcal/일)", "pct.q1": "Y의 X%는?", "pct.q2": "X는 Y의 몇 %?", "pct.q3": "증감률 (X → Y)", "age.start": "생년월일 / 시작일", "age.end": "기준일", "age.ymd": "년 / 개월 / 일", "age.days": "총 일수", "pm.focus": "집중 (25분)", "pm.short": "짧은 휴식 (5분)", "pm.long": "긴 휴식 (15분)", "pm.start": "시작", "pm.pause": "일시정지", "sw.start": "시작", "sw.lap": "랩", "tz.ref": "기준 로컬 시간", "tz.now": "현재 시각", "nb.dec": "10진수 (Decimal)", "nb.hex": "16진수 (Hex)", "nb.bin": "2진수 (Binary)", "nb.oct": "8진수 (Octal)", "ar.w1": "원본 너비", "ar.h1": "원본 높이", "ar.w2": "대상 너비", "ar.h2": "대상 높이", "ar.ratio": "화면 비율", "uc.cat": "분류", "uc.from": "변환 전", "uc.to": "변환 후", "uc.val": "값", "uc.res": "결과", "uc.len": "길이", "uc.wt": "무게", "uc.tmp": "온도", "uc.dat": "데이터 용량", "ug.cnt": "개수", "ug.up": "대문자", "ug.nh": "하이픈(-) 제거", "pg.len": "길이", "ts.num": "Unix 타임스탬프 (초 또는 ms)", "ts.now": "현재", "ts.dt": "날짜 / 시간 (로컬)", "ir.w": "너비 (px)", "ir.h": "높이 (px)", "ir.q": "품질 (0.1 - 1.0)", "ir.lock": "비율 고정", "df.cmp": "비교하기", "df.a": "원본 텍스트", "df.b": "변경된 텍스트", "rx.str": "테스트 문자열", "md.copy": "HTML 복사", "md.prev": "미리보기", "jwt.tok": "JWT 토큰", "jwt.hdr": "헤더 (Header)", "jwt.pay": "페이로드 (Payload)", "lr.para": "문단", "lr.sent": "문장", "ue.enc": "인코딩", "ue.dec": "디코딩", "he.enc": "인코딩", "he.dec": "디코딩", "jf.fmt": "정렬 (Format)", "jf.min": "압축 (Minify)", "jf.in": "입력 JSON", "jf.out": "변환 결과", "b64.enc": "인코딩 (Text → Base64)", "b64.dec": "디코딩 (Base64 → Text)", "tc.in": "텍스트 입력", "tc.ws": "공백 포함", "tc.ns": "공백 제외", "tc.wd": "단어 수", "tc.by": "UTF-8 바이트", "pdf.drop": "여기에 이미지를 끌어다 놓거나 클릭하여 선택하세요", "pdf.sub": "PNG, JPG, WebP, GIF 지원 · 여러 장 선택 및 순서 변경 가능", "pdf.size": "용지 크기", "pdf.orient": "용지 방향", "pdf.margin": "여백", "pdf.fname": "저장 파일명", "pdf.add": "+ 이미지 추가", "pdf.clr": "전체 비우기", "pdf.dl": "PDF 다운로드"}};
  Object.keys(EXTRA_UI).forEach((l) => { if (UI[l]) Object.assign(UI[l], EXTRA_UI[l]); });


  const MORE_UI = {"en": {"bg.sub": "Generate barcodes and QR codes directly in your browser and save as PNG or SVG.", "bg.sup": "Supported:", "bg.fnc1": "For FNC1 separator, enter \\F. Example:", "bg.tab.bc": "Barcode", "bg.tab.qr": "QR Code", "bg.invalid.bc": "Invalid barcode data.", "bg.invalid.qr": "Unable to generate QR code for this data.", "bg.png": "Save PNG", "bg.svg": "Save SVG", "bg.copy": "Copy Image", "bg.ph.bc": "Enter barcode data", "bg.ph.qr": "Enter URL or text (e.g. https://example.com)", "bg.sample": "Sample", "bg.gen": "Generate", "bg.qr.lbl": "Label Text", "bg.qr.ph": "Text to display with QR code (optional)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "All barcode and QR code generation runs locally in your browser.", "jf.i2": "Indent: 2 spaces", "jf.i4": "Indent: 4 spaces", "jf.ph.out": "Formatted output will appear here.", "b64.ph.in": "Enter text or Base64 string to convert.", "tc.ph.in": "Type text here to count characters and UTF-8 bytes in real time.", "pdf.fit": "Fit to Image", "pdf.auto": "Auto (Image Ratio)", "pdf.port": "Portrait", "pdf.land": "Landscape", "pdf.m0": "None (0mm)", "pdf.m8": "Narrow (8mm)", "pdf.m15": "Normal (15mm)"}, "zh": {"bg.sub": "直接在浏览器中生成条形码和二维码，并保存为 PNG 或 SVG。", "bg.sup": "支持格式：", "bg.fnc1": "FNC1 分隔符请输入 \\F。示例：", "bg.tab.bc": "条形码", "bg.tab.qr": "二维码", "bg.invalid.bc": "无效的条形码数据。", "bg.invalid.qr": "无法为该数据生成二维码。", "bg.png": "保存 PNG", "bg.svg": "保存 SVG", "bg.copy": "复制图片", "bg.ph.bc": "请输入条形码数据", "bg.ph.qr": "请输入网址或文本（例如 https://example.com）", "bg.sample": "填入示例", "bg.gen": "生成", "bg.qr.lbl": "显示文本", "bg.qr.ph": "与二维码一同显示的文字（留空则不显示）", "bg.ec.l": "L (7% 容错)", "bg.ec.m": "M (15% 容错)", "bg.ec.q": "Q (25% 容错)", "bg.ec.h": "H (30% 容错)", "bg.foot": "所有条形码和二维码均在浏览器本地生成，不会上传至服务器。", "jf.i2": "缩进：2 空格", "jf.i4": "缩进：4 空格", "jf.ph.out": "格式化结果将显示在此处。", "b64.ph.in": "请输入要转换的文本或 Base64 字符串。", "tc.ph.in": "在此输入文本，实时统计字数与 UTF-8 字节。", "pdf.fit": "适应图片尺寸", "pdf.auto": "自动（图片比例）", "pdf.port": "纵向 (Portrait)", "pdf.land": "横向 (Landscape)", "pdf.m0": "无边距 (0mm)", "pdf.m8": "窄边距 (8mm)", "pdf.m15": "标准 (15mm)"}, "hi": {"bg.sub": "ब्राउज़र में सीधे बारकोड और QR कोड बनाएं और PNG या SVG के रूप में सेव करें।", "bg.sup": "समर्थित:", "bg.fnc1": "FNC1 सेपरेटर के लिए \\F दर्ज करें। उदाहरण:", "bg.tab.bc": "बारकोड", "bg.tab.qr": "QR कोड", "bg.invalid.bc": "अमान्य बारकोड डेटा।", "bg.invalid.qr": "इस डेटा के लिए QR कोड नहीं बन सका।", "bg.png": "PNG सेव", "bg.svg": "SVG सेव", "bg.copy": "इमेज कॉपी", "bg.ph.bc": "बारकोड डेटा दर्ज करें", "bg.ph.qr": "URL या टेक्स्ट दर्ज करें (जैसे https://example.com)", "bg.sample": "नमूना", "bg.gen": "जनरेट", "bg.qr.lbl": "लेबल टेक्स्ट", "bg.qr.ph": "QR कोड के साथ दिखाने के लिए टेक्स्ट (वैकल्पिक)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "सभी बारकोड और QR कोड आपके ब्राउज़र में लोकल रूप से बनते हैं।", "jf.i2": "इंडेंट: 2 स्पेस", "jf.i4": "इंडेंट: 4 स्पेस", "jf.ph.out": "फॉर्मेट किया गया आउटपुट यहाँ दिखेगा।", "b64.ph.in": "कन्वर्ट करने के लिए टेक्स्ट या Base64 दर्ज करें।", "tc.ph.in": "अक्षर और UTF-8 बाइट्स गिनने के लिए यहाँ टेक्स्ट लिखें।", "pdf.fit": "इमेज के अनुसार", "pdf.auto": "ऑटो (इमेज अनुपात)", "pdf.port": "पोर्ट्रेट", "pdf.land": "लैंडस्केप", "pdf.m0": "कोई नहीं (0mm)", "pdf.m8": "कम (8mm)", "pdf.m15": "सामान्य (15mm)"}, "es": {"bg.sub": "Genera códigos de barras y QR directamente en tu navegador y guárdalos en PNG o SVG.", "bg.sup": "Compatibles:", "bg.fnc1": "Para el separador FNC1, escribe \\F. Ejemplo:", "bg.tab.bc": "Código de barras", "bg.tab.qr": "Código QR", "bg.invalid.bc": "Datos de código de barras no válidos.", "bg.invalid.qr": "No se pudo generar el código QR.", "bg.png": "Guardar PNG", "bg.svg": "Guardar SVG", "bg.copy": "Copiar imagen", "bg.ph.bc": "Introduce los datos del código", "bg.ph.qr": "Introduce URL o texto (ej. https://example.com)", "bg.sample": "Ejemplo", "bg.gen": "Generar", "bg.qr.lbl": "Texto de etiqueta", "bg.qr.ph": "Texto a mostrar con el QR (opcional)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "Toda la generación se procesa localmente en tu navegador.", "jf.i2": "Sangría: 2 espacios", "jf.i4": "Sangría: 4 espacios", "jf.ph.out": "El resultado formateado aparecerá aquí.", "b64.ph.in": "Introduce texto o cadena Base64 para convertir.", "tc.ph.in": "Escribe texto aquí para contar caracteres y bytes UTF-8.", "pdf.fit": "Ajustar a imagen", "pdf.auto": "Auto (proporción)", "pdf.port": "Vertical", "pdf.land": "Horizontal", "pdf.m0": "Sin margen (0mm)", "pdf.m8": "Estrecho (8mm)", "pdf.m15": "Normal (15mm)"}, "fr": {"bg.sub": "Générez des codes-barres et QR codes dans votre navigateur et enregistrez-les en PNG ou SVG.", "bg.sup": "Formats :", "bg.fnc1": "Pour le séparateur FNC1, saisissez \\F. Exemple :", "bg.tab.bc": "Code-barres", "bg.tab.qr": "QR Code", "bg.invalid.bc": "Données de code-barres invalides.", "bg.invalid.qr": "Impossible de générer ce QR code.", "bg.png": "Enregistrer PNG", "bg.svg": "Enregistrer SVG", "bg.copy": "Copier l'image", "bg.ph.bc": "Saisissez les données", "bg.ph.qr": "Saisissez une URL ou un texte (ex. https://example.com)", "bg.sample": "Exemple", "bg.gen": "Générer", "bg.qr.lbl": "Texte d'étiquette", "bg.qr.ph": "Texte à afficher avec le QR code (optionnel)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "Toute la génération est effectuée localement dans votre navigateur.", "jf.i2": "Indentation : 2 espaces", "jf.i4": "Indentation : 4 espaces", "jf.ph.out": "Le résultat formaté s'affichera ici.", "b64.ph.in": "Saisissez du texte ou une chaîne Base64.", "tc.ph.in": "Saisissez votre texte ici pour compter caractères et octets UTF-8.", "pdf.fit": "Adapter à l'image", "pdf.auto": "Auto (ratio)", "pdf.port": "Portrait", "pdf.land": "Paysage", "pdf.m0": "Aucune (0mm)", "pdf.m8": "Étroite (8mm)", "pdf.m15": "Normale (15mm)"}, "ko": {"bg.sub": "별도의 프로그램 설치 없이 브라우저에서 바로 바코드와 QR코드를 생성하고 PNG · SVG로 저장하세요.", "bg.sup": "지원 바코드:", "bg.fnc1": "분리 문자인 FNC1을 사용하는 바코드는 \\F로 입력 가능합니다. 예)", "bg.tab.bc": "바코드", "bg.tab.qr": "QR코드", "bg.invalid.bc": "유효하지 않는 데이터입니다.", "bg.invalid.qr": "QR코드를 생성할 수 없는 데이터입니다.", "bg.png": "PNG 저장", "bg.svg": "SVG 저장", "bg.copy": "이미지 복사", "bg.ph.bc": "바코드 데이터를 입력하세요", "bg.ph.qr": "URL 또는 텍스트를 입력하세요 (예: https://example.com)", "bg.sample": "예시 입력", "bg.gen": "생성", "bg.qr.lbl": "표시할 텍스트", "bg.qr.ph": "QR코드에 함께 표시할 글 (비워두면 표시 안 됨)", "bg.ec.l": "L (7% 복원)", "bg.ec.m": "M (15% 복원)", "bg.ec.q": "Q (25% 복원)", "bg.ec.h": "H (30% 복원)", "bg.foot": "모든 바코드 및 QR코드 생성은 브라우저 내에서 로컬로 처리되며 서버로 전송되지 않습니다.", "jf.i2": "들여쓰기: 2칸", "jf.i4": "들여쓰기: 4칸", "jf.ph.out": "여기에 정렬된 결과가 표시됩니다.", "b64.ph.in": "변환할 텍스트 또는 Base64 문자열을 입력하세요.", "tc.ph.in": "여기에 텍스트를 입력하면 글자수와 바이트를 실시간 계산합니다.", "pdf.fit": "이미지 크기에 맞춤", "pdf.auto": "자동 (이미지 비율)", "pdf.port": "세로 (Portrait)", "pdf.land": "가로 (Landscape)", "pdf.m0": "없음 (0mm)", "pdf.m8": "좁게 (8mm)", "pdf.m15": "보통 (15mm)"}};
  Object.keys(MORE_UI).forEach((l) => { if (UI[l]) Object.assign(UI[l], MORE_UI[l]); });


  const NEW_UI_JPD = {"ja": {"nav.tools": "ツール", "nav.blog": "ブログ", "back.tools": "← すべてのツールへ", "dash.title": "ツール一覧", "dash.search": "30個のツールを検索...", "dash.all": "すべて", "dash.empty": "一致するツールがありません。", "blog.title": "ブログ", "blog.desc": "各ツールの紹介と使い方をまとめています。", "blog.back": "← 記事一覧へ", "blog.loading": "記事を読み込み中...", "comments.title": "コメント", "comments.desc": "ご感想・バグ報告・機能リクエストをお寄せください。", "footer.copy": "© 2026 Mini Toolkit", "footer.coffee": "☕ コーヒーをおごる", "common.copy": "コピー", "common.copied": "コピーしました！", "common.clear": "クリア", "common.generate": "生成", "common.convert": "変換", "common.reset": "リセット", "common.download": "ダウンロード", "common.input": "入力", "common.output": "出力", "common.sample": "サンプル", "loan.amt": "借入元本", "loan.rate": "年利 (%)", "loan.months": "返済期間 (ヶ月)", "loan.emi": "毎月の返済額", "loan.int": "総利息", "loan.tot": "総返済額", "bmi.h": "身長 (cm)", "bmi.w": "体重 (kg)", "bmi.age": "年齢", "bmi.bmr": "基礎代謝 BMR (kcal/日)", "bmi.tdee": "維持カロリー (kcal/日)", "pct.q1": "Y の X% は？", "pct.q2": "X は Y の何%？", "pct.q3": "変化率 (X → Y)", "age.start": "生年月日 / 開始日", "age.end": "基準日", "age.ymd": "年 / ヶ月 / 日", "age.days": "合計日数", "pm.focus": "集中 (25分)", "pm.short": "小休憩 (5分)", "pm.long": "長休憩 (15分)", "pm.start": "開始", "pm.pause": "一時停止", "sw.start": "開始", "sw.lap": "ラップ", "tz.ref": "基準ローカル時刻", "tz.now": "現在時刻", "nb.dec": "10進数 (Decimal)", "nb.hex": "16進数 (Hex)", "nb.bin": "2進数 (Binary)", "nb.oct": "8進数 (Octal)", "ar.w1": "元の幅", "ar.h1": "元の高さ", "ar.w2": "変換後の幅", "ar.h2": "変換後の高さ", "ar.ratio": "アスペクト比", "uc.cat": "カテゴリ", "uc.from": "変換元", "uc.to": "変換先", "uc.val": "値", "uc.res": "結果", "uc.len": "長さ", "uc.wt": "重さ", "uc.tmp": "温度", "uc.dat": "データ容量", "ug.cnt": "生成数", "ug.up": "大文字", "ug.nh": "ハイフンなし", "pg.len": "文字数", "ts.num": "Unix タイムスタンプ (秒/ms)", "ts.now": "現在", "ts.dt": "日時 (ローカル)", "ir.w": "幅 (px)", "ir.h": "高さ (px)", "ir.q": "品質 (0.1 - 1.0)", "ir.lock": "縦横比を固定", "df.cmp": "比較", "df.a": "元のテキスト", "df.b": "変更後のテキスト", "rx.str": "テスト文字列", "md.copy": "HTMLをコピー", "md.prev": "プレビュー", "jwt.tok": "JWT トークン", "jwt.hdr": "ヘッダー", "jwt.pay": "ペイロード", "lr.para": "段落", "lr.sent": "文", "ue.enc": "エンコード", "ue.dec": "デコード", "he.enc": "エンコード", "he.dec": "デコード", "jf.fmt": "整形 (Format)", "jf.min": "圧縮 (Minify)", "jf.in": "入力 JSON", "jf.out": "結果", "b64.enc": "エンコード (Text → Base64)", "b64.dec": "デコード (Base64 → Text)", "tc.in": "テキスト入力", "tc.ws": "空白あり", "tc.ns": "空白なし", "tc.wd": "単語数", "tc.by": "UTF-8 バイト", "pdf.drop": "画像をここにドラッグ＆ドロップ、またはクリックして選択", "pdf.sub": "PNG, JPG, WebP, GIF 対応 · 複数選択・並べ替え可能", "pdf.size": "用紙サイズ", "pdf.orient": "向き", "pdf.margin": "余白", "pdf.fname": "ファイル名", "pdf.add": "+ 画像を追加", "pdf.clr": "すべてクリア", "pdf.dl": "PDF ダウンロード", "bg.sub": "ブラウザ上でバーコードとQRコードを生成し、PNG・SVG形式で保存できます。", "bg.sup": "対応形式:", "bg.fnc1": "FNC1区切り文字は \\F を入力してください。例:", "bg.tab.bc": "バーコード", "bg.tab.qr": "QRコード", "bg.invalid.bc": "無効なバーコードデータです。", "bg.invalid.qr": "QRコードを生成できないデータです。", "bg.png": "PNG 保存", "bg.svg": "SVG 保存", "bg.copy": "画像コピー", "bg.ph.bc": "バーコードデータを入力", "bg.ph.qr": "URLまたはテキストを入力 (例: https://example.com)", "bg.sample": "サンプル", "bg.gen": "生成", "bg.qr.lbl": "ラベル文字", "bg.qr.ph": "QRコードと一緒に表示する文字（任意）", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "すべてのバーコード・QRコード生成はブラウザ内でローカル処理されます。", "jf.i2": "インデント: 2スペース", "jf.i4": "インデント: 4スペース", "jf.ph.out": "整形された結果がここに表示されます。", "b64.ph.in": "変換するテキストまたはBase64文字列を入力してください。", "tc.ph.in": "ここにテキストを入力すると文字数とバイト数をリアルタイム計算します。", "pdf.fit": "画像サイズに合わせる", "pdf.auto": "自動 (画像比率)", "pdf.port": "縦 (Portrait)", "pdf.land": "横 (Landscape)", "pdf.m0": "なし (0mm)", "pdf.m8": "狭い (8mm)", "pdf.m15": "標準 (15mm)"}, "pt": {"nav.tools": "Ferramentas", "nav.blog": "Blog", "back.tools": "← Voltar às Ferramentas", "dash.title": "Painel de Ferramentas", "dash.search": "Buscar 30 ferramentas...", "dash.all": "Todas", "dash.empty": "Nenhuma ferramenta encontrada.", "blog.title": "Blog", "blog.desc": "Apresentações das ferramentas, guias de uso e dicas.", "blog.back": "← Voltar aos Artigos", "blog.loading": "Carregando artigos...", "comments.title": "Comentários", "comments.desc": "Deixe seu feedback, relato de erro ou sugestão.", "footer.copy": "© 2026 Mini Toolkit", "footer.coffee": "☕ Pague um Café", "common.copy": "Copiar", "common.copied": "Copiado!", "common.clear": "Limpar", "common.generate": "Gerar", "common.convert": "Converter", "common.reset": "Reiniciar", "common.download": "Baixar", "common.input": "Entrada", "common.output": "Saída", "common.sample": "Exemplo", "loan.amt": "Valor do Empréstimo", "loan.rate": "Juros Anuais (%)", "loan.months": "Prazo (Meses)", "loan.emi": "Parcela Mensal", "loan.int": "Juros Totais", "loan.tot": "Total a Pagar", "bmi.h": "Altura (cm)", "bmi.w": "Peso (kg)", "bmi.age": "Idade", "bmi.bmr": "TMB (kcal/dia)", "bmi.tdee": "Manutenção (kcal/dia)", "pct.q1": "Quanto é X% de Y?", "pct.q2": "X é qual % de Y?", "pct.q3": "% Variação (X → Y)", "age.start": "Nascimento / Início", "age.end": "Data Alvo", "age.ymd": "Anos / Meses / Dias", "age.days": "Total de Dias", "pm.focus": "Foco (25m)", "pm.short": "Pausa Curta (5m)", "pm.long": "Pausa Longa (15m)", "pm.start": "Iniciar", "pm.pause": "Pausar", "sw.start": "Iniciar", "sw.lap": "Volta", "tz.ref": "Hora Local de Referência", "tz.now": "Agora", "nb.dec": "Decimal (Base 10)", "nb.hex": "Hexadecimal (Base 16)", "nb.bin": "Binário (Base 2)", "nb.oct": "Octal (Base 8)", "ar.w1": "Largura Original", "ar.h1": "Altura Original", "ar.w2": "Largura Alvo", "ar.h2": "Altura Alvo", "ar.ratio": "Proporção", "uc.cat": "Categoria", "uc.from": "De", "uc.to": "Para", "uc.val": "Valor", "uc.res": "Resultado", "uc.len": "Comprimento", "uc.wt": "Peso", "uc.tmp": "Temperatura", "uc.dat": "Dados", "ug.cnt": "Qtd", "ug.up": "Maiúsculas", "ug.nh": "Sem Hífens", "pg.len": "Tamanho", "ts.num": "Timestamp Unix (seg ou ms)", "ts.now": "Agora", "ts.dt": "Data / Hora (Local)", "ir.w": "Largura (px)", "ir.h": "Altura (px)", "ir.q": "Qualidade (0.1 - 1.0)", "ir.lock": "Travar Proporção", "df.cmp": "Comparar", "df.a": "Texto Original", "df.b": "Texto Alterado", "rx.str": "Texto de Teste", "md.copy": "Copiar HTML", "md.prev": "Visualizar", "jwt.tok": "Token JWT", "jwt.hdr": "Cabeçalho", "jwt.pay": "Payload", "lr.para": "Parágrafos", "lr.sent": "Frases", "ue.enc": "Codificar", "ue.dec": "Decodificar", "he.enc": "Codificar", "he.dec": "Decodificar", "jf.fmt": "Formatar", "jf.min": "Minificar", "jf.in": "JSON Entrada", "jf.out": "Resultado", "b64.enc": "Codificar (Texto → Base64)", "b64.dec": "Decodificar (Base64 → Texto)", "tc.in": "Texto de Entrada", "tc.ws": "Com Espaços", "tc.ns": "Sem Espaços", "tc.wd": "Palavras", "tc.by": "Bytes UTF-8", "pdf.drop": "Arraste imagens aqui ou clique para selecionar", "pdf.sub": "Suporta PNG, JPG, WebP, GIF · Múltiplos arquivos e ordem", "pdf.size": "Tamanho", "pdf.orient": "Orientação", "pdf.margin": "Margem", "pdf.fname": "Nome do Arquivo", "pdf.add": "+ Adicionar", "pdf.clr": "Limpar Tudo", "pdf.dl": "Baixar PDF", "bg.sub": "Gere códigos de barras e QR no navegador e salve em PNG ou SVG.", "bg.sup": "Compatíveis:", "bg.fnc1": "Para separador FNC1, digite \\F. Exemplo:", "bg.tab.bc": "Código de Barras", "bg.tab.qr": "Código QR", "bg.invalid.bc": "Dados inválidos.", "bg.invalid.qr": "Não foi possível gerar o QR.", "bg.png": "Salvar PNG", "bg.svg": "Salvar SVG", "bg.copy": "Copiar Imagem", "bg.ph.bc": "Digite os dados do código", "bg.ph.qr": "Digite URL ou texto (ex: https://example.com)", "bg.sample": "Exemplo", "bg.gen": "Gerar", "bg.qr.lbl": "Texto do Rótulo", "bg.qr.ph": "Texto exibido com o QR (opcional)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "Toda a geração ocorre localmente no seu navegador.", "jf.i2": "Indentação: 2 espaços", "jf.i4": "Indentação: 4 espaços", "jf.ph.out": "O resultado formatado aparecerá aqui.", "b64.ph.in": "Digite texto ou Base64 para converter.", "tc.ph.in": "Digite o texto aqui para contar caracteres e bytes UTF-8.", "pdf.fit": "Ajustar à Imagem", "pdf.auto": "Auto (Proporção)", "pdf.port": "Retrato", "pdf.land": "Paisagem", "pdf.m0": "Sem margem (0mm)", "pdf.m8": "Estreita (8mm)", "pdf.m15": "Normal (15mm)"}, "de": {"nav.tools": "Tools", "nav.blog": "Blog", "back.tools": "← Alle Tools", "dash.title": "Tool-Übersicht", "dash.search": "30 Tools durchsuchen...", "dash.all": "Alle", "dash.empty": "Keine passenden Tools gefunden.", "blog.title": "Blog", "blog.desc": "Tool-Vorstellungen, Anleitungen und Tipps.", "blog.back": "← Zurück zu Beiträgen", "blog.loading": "Beiträge werden geladen...", "comments.title": "Kommentare", "comments.desc": "Teilen Sie Feedback, Fehlerberichte oder Wünsche.", "footer.copy": "© 2026 Mini Toolkit", "footer.coffee": "☕ Kaffee spendieren", "common.copy": "Kopieren", "common.copied": "Kopiert!", "common.clear": "Leeren", "common.generate": "Generieren", "common.convert": "Umwandeln", "common.reset": "Zurücksetzen", "common.download": "Herunterladen", "common.input": "Eingabe", "common.output": "Ausgabe", "common.sample": "Beispiel", "loan.amt": "Kreditbetrag", "loan.rate": "Jahreszins (%)", "loan.months": "Laufzeit (Monate)", "loan.emi": "Monatsrate", "loan.int": "Gesamtzinsen", "loan.tot": "Gesamtrückzahlung", "bmi.h": "Größe (cm)", "bmi.w": "Gewicht (kg)", "bmi.age": "Alter", "bmi.bmr": "Grundumsatz (kcal/Tag)", "bmi.tdee": "Tagesbedarf (kcal/Tag)", "pct.q1": "Was ist X% von Y?", "pct.q2": "X ist wie viel % von Y?", "pct.q3": "% Änderung (X → Y)", "age.start": "Geburtsdatum / Start", "age.end": "Zieldatum", "age.ymd": "Jahre / Monate / Tage", "age.days": "Gesamttage", "pm.focus": "Fokus (25m)", "pm.short": "Kurze Pause (5m)", "pm.long": "Lange Pause (15m)", "pm.start": "Start", "pm.pause": "Pause", "sw.start": "Start", "sw.lap": "Runde", "tz.ref": "Lokale Referenzzeit", "tz.now": "Jetzt", "nb.dec": "Dezimal (Basis 10)", "nb.hex": "Hexadezimal (Basis 16)", "nb.bin": "Binär (Basis 2)", "nb.oct": "Oktal (Basis 8)", "ar.w1": "Originalbreite", "ar.h1": "Originalhöhe", "ar.w2": "Zielbreite", "ar.h2": "Zielhöhe", "ar.ratio": "Seitenverhältnis", "uc.cat": "Kategorie", "uc.from": "Von", "uc.to": "Nach", "uc.val": "Wert", "uc.res": "Ergebnis", "uc.len": "Länge", "uc.wt": "Gewicht", "uc.tmp": "Temperatur", "uc.dat": "Speicher", "ug.cnt": "Anzahl", "ug.up": "Großbuchstaben", "ug.nh": "Ohne Bindestrich", "pg.len": "Länge", "ts.num": "Unix-Zeitstempel (Sek/ms)", "ts.now": "Jetzt", "ts.dt": "Datum / Uhrzeit (Lokal)", "ir.w": "Breite (px)", "ir.h": "Höhe (px)", "ir.q": "Qualität (0.1 - 1.0)", "ir.lock": "Seitenverhältnis sperren", "df.cmp": "Vergleichen", "df.a": "Originaltext", "df.b": "Geänderter Text", "rx.str": "Testtext", "md.copy": "HTML kopieren", "md.prev": "Vorschau", "jwt.tok": "JWT-Token", "jwt.hdr": "Header", "jwt.pay": "Payload", "lr.para": "Absätze", "lr.sent": "Sätze", "ue.enc": "Kodieren", "ue.dec": "Dekodieren", "he.enc": "Kodieren", "he.dec": "Dekodieren", "jf.fmt": "Formatieren", "jf.min": "Minifizieren", "jf.in": "Eingabe-JSON", "jf.out": "Ausgabe", "b64.enc": "Kodieren (Text → Base64)", "b64.dec": "Dekodieren (Base64 → Text)", "tc.in": "Eingabetext", "tc.ws": "Mit Leerzeichen", "tc.ns": "Ohne Leerzeichen", "tc.wd": "Wörter", "tc.by": "UTF-8-Bytes", "pdf.drop": "Bilder hierher ziehen oder klicken zum Auswählen", "pdf.sub": "PNG, JPG, WebP, GIF · Mehrere Dateien & Sortierung", "pdf.size": "Seitenformat", "pdf.orient": "Ausrichtung", "pdf.margin": "Rand", "pdf.fname": "Dateiname", "pdf.add": "+ Bilder", "pdf.clr": "Alle leeren", "pdf.dl": "PDF herunterladen", "bg.sub": "Erstellen Sie Barcodes & QR-Codes direkt im Browser als PNG oder SVG.", "bg.sup": "Unterstützt:", "bg.fnc1": "Für FNC1-Trennzeichen \\F eingeben. Beispiel:", "bg.tab.bc": "Barcode", "bg.tab.qr": "QR-Code", "bg.invalid.bc": "Ungültige Barcode-Daten.", "bg.invalid.qr": "QR-Code konnte nicht erstellt werden.", "bg.png": "PNG speichern", "bg.svg": "SVG speichern", "bg.copy": "Bild kopieren", "bg.ph.bc": "Barcode-Daten eingeben", "bg.ph.qr": "URL oder Text eingeben (z.B. https://example.com)", "bg.sample": "Beispiel", "bg.gen": "Generieren", "bg.qr.lbl": "Label-Text", "bg.qr.ph": "Text unter dem QR-Code (optional)", "bg.ec.l": "L (7%)", "bg.ec.m": "M (15%)", "bg.ec.q": "Q (25%)", "bg.ec.h": "H (30%)", "bg.foot": "Alle Barcodes und QR-Codes werden lokal im Browser generiert.", "jf.i2": "Einzug: 2 Leerzeichen", "jf.i4": "Einzug: 4 Leerzeichen", "jf.ph.out": "Formatiertes Ergebnis erscheint hier.", "b64.ph.in": "Text oder Base64-String zum Umwandeln eingeben.", "tc.ph.in": "Text hier eingeben, um Zeichen und UTF-8-Bytes zu zählen.", "pdf.fit": "An Bild anpassen", "pdf.auto": "Auto (Bildformat)", "pdf.port": "Hochformat", "pdf.land": "Querformat", "pdf.m0": "Keiner (0mm)", "pdf.m8": "Schmal (8mm)", "pdf.m15": "Normal (15mm)"}};
  Object.keys(NEW_UI_JPD).forEach((l) => { UI[l] = NEW_UI_JPD[l]; });


  const GAP_UI = {"en": {"bg.c.bw": "Bar Width", "bg.c.h": "Height", "bg.c.m": "Margin", "bg.c.bg": "Background", "bg.c.lc": "Line Color", "bg.c.show": "Show", "bg.c.hide": "Hide", "bg.c.top": "Top", "bg.c.bot": "Bottom", "bg.c.left": "Left", "bg.c.ctr": "Center", "bg.c.right": "Right", "bg.c.font": "Font", "bg.c.bold": "Bold", "bg.c.ital": "Italic", "bg.c.fs": "Font Size", "bg.c.tm": "Text Margin", "bg.c.sz": "Size (px)", "bg.c.ec": "Error Correction", "bg.c.col": "Color", "bg.c.ml": "Max Lines", "ph.case": "Enter text to transform...", "ph.hash": "Type or paste text to hash...", "ph.from": "From", "ph.to": "To", "ph.rx.pat": "Regex pattern", "ph.rx.flags": "flags", "pdf.count": "Selected images: {n}"}, "zh": {"bg.c.bw": "条宽", "bg.c.h": "高度", "bg.c.m": "边距", "bg.c.bg": "背景色", "bg.c.lc": "线条颜色", "bg.c.show": "显示", "bg.c.hide": "隐藏", "bg.c.top": "顶部", "bg.c.bot": "底部", "bg.c.left": "左对齐", "bg.c.ctr": "居中", "bg.c.right": "右对齐", "bg.c.font": "字体", "bg.c.bold": "粗体", "bg.c.ital": "斜体", "bg.c.fs": "字号", "bg.c.tm": "文字边距", "bg.c.sz": "尺寸 (px)", "bg.c.ec": "容错级别", "bg.c.col": "颜色", "bg.c.ml": "最大行数", "ph.case": "输入要转换的英文文本...", "ph.hash": "输入或粘贴要计算哈希的文本...", "ph.from": "原值", "ph.to": "新值", "ph.rx.pat": "正则表达式", "ph.rx.flags": "修饰符", "pdf.count": "已选图片：{n} 张"}, "hi": {"bg.c.bw": "बार चौड़ाई", "bg.c.h": "ऊंचाई", "bg.c.m": "मार्जिन", "bg.c.bg": "पृष्ठभूमि", "bg.c.lc": "रेखा का रंग", "bg.c.show": "दिखाएं", "bg.c.hide": "छिपाएं", "bg.c.top": "ऊपर", "bg.c.bot": "नीचे", "bg.c.left": "बाएं", "bg.c.ctr": "केंद्र", "bg.c.right": "दाएं", "bg.c.font": "फ़ॉन्ट", "bg.c.bold": "बोल्ड", "bg.c.ital": "इटैलिक", "bg.c.fs": "फ़ॉन्ट आकार", "bg.c.tm": "टेक्स्ट मार्जिन", "bg.c.sz": "आकार (px)", "bg.c.ec": "त्रुटि सुधार", "bg.c.col": "रंग", "bg.c.ml": "अधिकतम पंक्तियाँ", "ph.case": "बदलने के लिए टेक्स्ट दर्ज करें...", "ph.hash": "हैश बनाने के लिए टेक्स्ट दर्ज करें...", "ph.from": "से", "ph.to": "तक", "ph.rx.pat": "Regex पैटर्न", "ph.rx.flags": "फ्लैग्स", "pdf.count": "चयनित इमेज: {n}"}, "es": {"bg.c.bw": "Ancho de barra", "bg.c.h": "Altura", "bg.c.m": "Margen", "bg.c.bg": "Fondo", "bg.c.lc": "Color de línea", "bg.c.show": "Mostrar", "bg.c.hide": "Ocultar", "bg.c.top": "Arriba", "bg.c.bot": "Abajo", "bg.c.left": "Izquierda", "bg.c.ctr": "Centro", "bg.c.right": "Derecha", "bg.c.font": "Fuente", "bg.c.bold": "Negrita", "bg.c.ital": "Cursiva", "bg.c.fs": "Tamaño", "bg.c.tm": "Margen texto", "bg.c.sz": "Tamaño (px)", "bg.c.ec": "Corrección", "bg.c.col": "Color", "bg.c.ml": "Líneas máx.", "ph.case": "Introduce texto para transformar...", "ph.hash": "Escribe o pega texto para calcular hash...", "ph.from": "Desde", "ph.to": "Hasta", "ph.rx.pat": "Patrón Regex", "ph.rx.flags": "banderas", "pdf.count": "Imágenes seleccionadas: {n}"}, "fr": {"bg.c.bw": "Largeur barre", "bg.c.h": "Hauteur", "bg.c.m": "Marge", "bg.c.bg": "Arrière-plan", "bg.c.lc": "Couleur ligne", "bg.c.show": "Afficher", "bg.c.hide": "Masquer", "bg.c.top": "Haut", "bg.c.bot": "Bas", "bg.c.left": "Gauche", "bg.c.ctr": "Centre", "bg.c.right": "Droite", "bg.c.font": "Police", "bg.c.bold": "Gras", "bg.c.ital": "Italique", "bg.c.fs": "Taille police", "bg.c.tm": "Marge texte", "bg.c.sz": "Taille (px)", "bg.c.ec": "Correction", "bg.c.col": "Couleur", "bg.c.ml": "Lignes max", "ph.case": "Saisissez le texte à transformer...", "ph.hash": "Saisissez ou collez du texte...", "ph.from": "De", "ph.to": "À", "ph.rx.pat": "Motif Regex", "ph.rx.flags": "drapeaux", "pdf.count": "Images sélectionnées : {n}"}, "ja": {"bg.c.bw": "バー幅", "bg.c.h": "高さ", "bg.c.m": "余白", "bg.c.bg": "背景色", "bg.c.lc": "線の色", "bg.c.show": "表示", "bg.c.hide": "非表示", "bg.c.top": "上", "bg.c.bot": "下", "bg.c.left": "左", "bg.c.ctr": "中央", "bg.c.right": "右", "bg.c.font": "フォント", "bg.c.bold": "太字", "bg.c.ital": "斜体", "bg.c.fs": "文字サイズ", "bg.c.tm": "文字余白", "bg.c.sz": "サイズ (px)", "bg.c.ec": "誤り訂正", "bg.c.col": "色", "bg.c.ml": "最大行数", "ph.case": "変換するテキストを入力...", "ph.hash": "ハッシュ化するテキストを入力...", "ph.from": "変更前", "ph.to": "変更後", "ph.rx.pat": "正規表現パターン", "ph.rx.flags": "フラグ", "pdf.count": "選択中の画像: {n}枚"}, "pt": {"bg.c.bw": "Largura barra", "bg.c.h": "Altura", "bg.c.m": "Margem", "bg.c.bg": "Fundo", "bg.c.lc": "Cor da linha", "bg.c.show": "Mostrar", "bg.c.hide": "Ocultar", "bg.c.top": "Topo", "bg.c.bot": "Base", "bg.c.left": "Esquerda", "bg.c.ctr": "Centro", "bg.c.right": "Direita", "bg.c.font": "Fonte", "bg.c.bold": "Negrito", "bg.c.ital": "Itálico", "bg.c.fs": "Tam. fonte", "bg.c.tm": "Margem texto", "bg.c.sz": "Tamanho (px)", "bg.c.ec": "Correção", "bg.c.col": "Cor", "bg.c.ml": "Máx. linhas", "ph.case": "Digite o texto para transformar...", "ph.hash": "Digite ou cole texto para hash...", "ph.from": "De", "ph.to": "Para", "ph.rx.pat": "Padrão Regex", "ph.rx.flags": "flags", "pdf.count": "Imagens selecionadas: {n}"}, "de": {"bg.c.bw": "Balkenbreite", "bg.c.h": "Höhe", "bg.c.m": "Rand", "bg.c.bg": "Hintergrund", "bg.c.lc": "Linienfarbe", "bg.c.show": "Anzeigen", "bg.c.hide": "Ausblenden", "bg.c.top": "Oben", "bg.c.bot": "Unten", "bg.c.left": "Links", "bg.c.ctr": "Mitte", "bg.c.right": "Rechts", "bg.c.font": "Schriftart", "bg.c.bold": "Fett", "bg.c.ital": "Kursiv", "bg.c.fs": "Schriftgröße", "bg.c.tm": "Textabstand", "bg.c.sz": "Größe (px)", "bg.c.ec": "Fehlerkorrektur", "bg.c.col": "Farbe", "bg.c.ml": "Max. Zeilen", "ph.case": "Text zum Umwandeln eingeben...", "ph.hash": "Text zum Hashen eingeben...", "ph.from": "Von", "ph.to": "Bis", "ph.rx.pat": "Regex-Muster", "ph.rx.flags": "Flags", "pdf.count": "Ausgewählte Bilder: {n}"}, "ko": {"bg.c.bw": "막대 두께", "bg.c.h": "높이", "bg.c.m": "여백", "bg.c.bg": "배경색", "bg.c.lc": "선 색상", "bg.c.show": "표시", "bg.c.hide": "숨김", "bg.c.top": "상단", "bg.c.bot": "하단", "bg.c.left": "왼쪽", "bg.c.ctr": "가운데", "bg.c.right": "오른쪽", "bg.c.font": "글꼴", "bg.c.bold": "굵게", "bg.c.ital": "기울임", "bg.c.fs": "글자 크기", "bg.c.tm": "글자 여백", "bg.c.sz": "크기 (px)", "bg.c.ec": "오류 복원", "bg.c.col": "색상", "bg.c.ml": "최대 줄 수", "ph.case": "변환할 텍스트를 입력하세요...", "ph.hash": "해시할 텍스트를 입력하거나 붙여넣으세요...", "ph.from": "이전 값", "ph.to": "이후 값", "ph.rx.pat": "정규식 패턴", "ph.rx.flags": "플래그", "pdf.count": "선택된 이미지: {n}장"}};
  Object.keys(GAP_UI).forEach((l) => { if (UI[l]) Object.assign(UI[l], GAP_UI[l]); });

  function detectDefaultLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch {}
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return SUPPORTED.includes(nav) ? nav : "en";
  }

  let currentLang = detectDefaultLang();

  function getLang() {
    return currentLang;
  }

  function t(key, fallback) {
    const dict = UI[currentLang] || UI.en;
    return dict[key] || UI.en[key] || fallback || key;
  }

  function applyTranslations() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key, "");
      if (val) el.textContent = val;
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key, "");
      if (val) el.setAttribute("placeholder", val);
    });

    const toolId = document.body.getAttribute("data-tool-id");
    if (toolId && Array.isArray(window.MINI_TOOLKIT_TOOLS)) {
      const tool = window.MINI_TOOLKIT_TOOLS.find((item) => item.id === toolId);
      if (tool) {
        const loc = tool.i18n[currentLang] || tool.i18n.en;
        const titleEl = document.querySelector(".page-title");
        const descEl = document.querySelector(".page-desc");
        if (titleEl && loc.name) titleEl.textContent = loc.name;
        if (descEl && loc.desc) descEl.textContent = loc.desc;
        if (loc.name) document.title = loc.name + " — Mini Toolkit";
      }
    }

    const select = document.getElementById("langSelect");
    if (select && select.value !== currentLang) {
      select.value = currentLang;
    }
  }

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
    applyTranslations();
    window.dispatchEvent(new CustomEvent("mini-toolkit-lang-change", { detail: { lang } }));
  }

  function ensureHeaderCoffeeLink() {
    const navContainer = document.querySelector(".nav-tabs, .site-nav-tabs");
    if (!navContainer || navContainer.querySelector(".coffee-header")) return;

    const a = document.createElement("a");
    a.className = "coffee-link coffee-header";
    a.href = "https://buymeacoffee.com/";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.setAttribute("data-i18n", "footer.coffee");
    a.textContent = t("footer.coffee", "☕ Buy Me a Coffee");
    navContainer.appendChild(a);
  }

  function ensureLangSwitcher() {
    const navContainer = document.querySelector(".nav-tabs, .site-nav-tabs");
    if (!navContainer || document.getElementById("langSelect")) return;

    const select = document.createElement("select");
    select.id = "langSelect";
    select.className = "lang-select";
    select.setAttribute("aria-label", "Language");
    SUPPORTED.forEach((code) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = LANG_LABELS[code];
      select.appendChild(opt);
    });
    select.value = currentLang;
    select.addEventListener("change", (e) => setLang(e.target.value));
    navContainer.appendChild(select);
  }

  function init() {
    // ensureHeaderCoffeeLink(); // TODO: 후원 링크 연동 후 활성화
    ensureLangSwitcher();
    applyTranslations();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.MiniToolkitI18n = {
    SUPPORTED,
    LANG_LABELS,
    getLang,
    setLang,
    t,
    applyTranslations
  };
})();
