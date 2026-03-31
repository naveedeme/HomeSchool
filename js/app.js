const { useState, useEffect, useRef, useCallback, useContext } = React;

const {
  SUBJECTS,
  GRADES,
  BADGES,
  POS_DATA,
  TENSES_DATA,
  VOCABULARY_DATA,
  getLessons,
  getQuiz,
} = window.HomeSchoolData;
const { loadState, saveState, localStorageFallback, debounce, downloadJson, calculateXP, calculateStreak, formatDate, isTtsEnabled, getStorageEstimateLabel, regroupDayEntries, regroupSentencePairs, validateProgressImport, applyThemeMode, getResolvedTheme, isStandaloneMode, hideLaunchSplash, registerServiceWorker, applyServiceWorkerUpdate, setPendingReviewBadge, getSpeechConfig } = window.HomeSchoolUtils;
const { SettingsPanel } = window.HomeSchoolSettings || {};
const {
  adverbs: ADVERBS_DATA,
  prepositions: PREPOSITIONS_DATA,
  adjectives: ADJECTIVES_DATA,
  conjunctions: CONJUNCTIONS_DATA,
  pronouns: PRONOUNS_DATA,
  collectiveNouns: COLLECTIVE_NOUNS_DATA,
  verbs: VERBS_DATA,
} = POS_DATA;
const AppContext = React.createContext(null);

const UI_TEXT = {
  en: {
    loadingHome: "Loading HomeSchool...",
    loadingDb: "Setting up your learning database",
    tagline: "Your personal learning companion",
    yourName: "YOUR NAME",
    enterName: "Enter your name...",
    yourNameUr: "YOUR URDU NAME",
    enterNameUr: "Enter your Urdu name...",
    selectGrade: "SELECT YOUR GRADE",
    lessons: "lessons",
    grade: "Grade",
    lesson: "Lesson",
    completed: "Completed",
    notStarted: "Not started",
    startQuiz: "Start Quiz",
    progress: "Progress",
    achievements: "Achievements",
    tutor: "AI Tutor",
    settings: "Settings",
    home: "Home",
    badges: "Badges",
    quiz: "Quiz",
    currentGrade: "Current Grade",
    changeGrade: "Change Grade",
    dataManagement: "Data Management",
    dataVersion: "Data Version",
    checkUpdates: "Check Updates",
    refreshCurriculum: "Re-seed from Source",
    exportProgress: "Export Progress",
    importProgress: "Import Progress",
    versionHistory: "Version History",
    userData: "User Data",
    storageUsage: "Storage",
    resetProgress: "Reset Progress",
    fullReset: "Full Reset",
    dayBasedSections: "Day-Based English Sections",
    dayBasedDescription: "Adjust how many words appear in each study day for every English subsection independently.",
    perDay: "Items per day",
    pacingHelp: "These pacing controls change the study-day grouping without changing the source curriculum files.",
    preferences: "Preferences",
    aiConnections: "AI Tutor Connections",
    aiConnectionsHelp: "Keys stay only in this browser and are excluded from backup export. Browser API calls may still be blocked by a provider or by file mode.",
    aiApiKey: "API Key",
    aiDefaultModel: "Default Model",
    aiSaveConnection: "Save Connection",
    aiClearConnection: "Clear Connection",
    aiOpenSettings: "Open Settings",
    aiConfigureFirst: "Add at least one AI provider key in Settings to use the tutor.",
    aiSelectProvider: "Provider",
    aiSelectModel: "Model",
    aiBrowserBlocked: "Direct browser AI access works best on the published HTTPS site or localhost, not from file mode.",
    aiUpdateKey: "Update Key",
    textToSpeech: "Text to Speech",
    ttsSpeed: "Playback Speed",
    englishVoice: "English Voice",
    urduVoice: "Urdu Voice",
    voiceAuto: "Auto",
    voiceAutoHelp: "Auto chooses the best supported browser voice.",
    urduVoiceHelp: "Choose the closest Urdu or Urdu-friendly browser voice.",
    enabled: "Enabled",
    disabled: "Disabled",
    themeMode: "Theme Mode",
    themeSystem: "System",
    themeDark: "Dark",
    themeLight: "Light",
    dailyReviewCap: "Daily Review Cap",
    dailyReviewCapHelp: "Limits how many review cards appear in one study session.",
    interfaceLanguage: "Interface Language",
    languageEnglish: "English",
    languageUrdu: "اردو",
    languageBilingual: "Bilingual",
    studyPlanning: "Study Planning",
    dailyGoal: "Daily Review Goal",
    weeklyGoal: "Weekly Word Goal",
    focusTimer: "Focus Timer",
    studyReminder: "Study Reminder",
    reminderTime: "Reminder Time",
    browserNotificationsOn: "Browser Notifications On",
    browserNotificationsOff: "Browser Notifications Off",
    notificationReady: "Permission Ready",
    requestNotifications: "Request Permission",
    reminderHelp: "Reminders work when the app is open, installed, or notifications are permitted by the browser.",
    profileSection: "Profile & Names",
    gradeSection: "Grade Selection",
    navPlacement: "Navigation Placement",
    navAutoHide: "Auto-hide Top Header",
    navBarAutoHide: "Auto-hide Navigation Bar",
    navBottom: "Bottom",
    navRight: "Right",
    navLeft: "Left",
    navTop: "Top",
    transitionStyle: "Transition Style",
    transitionNone: "None",
    transitionFade: "Fade",
    transitionSlide: "Slide",
    transitionZoom: "Zoom",
    notificationHistory: "Notification History",
    clearNotifications: "Clear History",
    noNotificationsYet: "No notifications yet.",
    notificationHistoryHint: "Study reminders and focus-session alerts will appear here after they trigger.",
    review: "Review",
    reviewReady: "Review Queue",
    dueReviews: "Due Reviews",
    reviewedToday: "Reviewed Today",
    learningWords: "Learning Words",
    masteredWords: "Mastered Words",
    retentionRate: "Retention Rate",
    startReview: "Start Review",
    noReviewsDue: "No reviews are due right now.",
    revealAnswer: "Reveal Answer",
    reviewAgain: "Again",
    reviewGood: "Good",
    reviewEasy: "Easy",
    reviewComplete: "Review session complete",
    reviewEarnedXp: "Review XP earned",
    reviewHint: "Use spaced repetition to keep tricky words fresh.",
    reviewSection: "Section",
    reviewExample: "Context",
    reviewReadyNow: "ready now",
    reviewTotalDue: "total due",
    reviewHeatmap: "Review Heatmap",
    reviewHeatmapHint: "See how consistently you reviewed over the last 12 weeks.",
    weakWordsReport: "Weak Words Report",
    weakWordsHint: "These words need extra attention because they are overdue, frequently missed, or still unstable.",
    favorites: "Favorites",
    favoriteWords: "Favorite Words",
    notedWords: "Notes Board",
    studyCollections: "Study Collections",
    customLists: "Custom Lists",
    createList: "Create List",
    createListPlaceholder: "Add a list name...",
    noWeakWords: "No weak words right now. Keep your review streak going.",
    noFavorites: "Star words from lessons or review cards to keep them handy here.",
    noNotes: "Save notes on tricky words and they will collect here.",
    noCustomLists: "Create a custom list to group words for focused practice.",
    addNote: "Add Note",
    saveNote: "Save Note",
    notePlaceholder: "Write a quick reminder, trick, or sentence...",
    accuracy: "Accuracy",
    lapses: "Lapses",
    overdue: "Overdue",
    dueNow: "Due now",
    listItems: "List items",
    deleteList: "Delete List",
    noListItems: "No words in this list yet.",
    importNow: "Import this backup now?",
    replacePrompt: "Press OK to replace your current saved progress.\nPress Cancel to merge this backup with your current progress.",
    importSuccessReplace: "Progress imported successfully and replaced your current saved progress.",
    importSuccessMerge: "Progress imported successfully and merged with your current saved progress.",
    importInvalid: "This backup file is not valid.",
    importNewer: "This backup was created from a newer curriculum version. Import anyway?",
    refreshConfirm: "Refresh curriculum data from the split source files while keeping your progress?",
    refreshSuccess: "Curriculum refreshed successfully",
    refreshNoChanges: "Curriculum is already up to date.",
    resetConfirm: "Reset quiz progress while keeping the curriculum data?",
    fullResetConfirm: "Full reset will clear the database, progress, and reseed the curriculum. Continue?",
    updateAvailableTitle: "An update is available.",
    upToDateTitle: "Curriculum is up to date.",
    changedSubjects: "Changed subjects",
    appExperience: "App Experience",
    installStatus: "Install Status",
    offlineAccess: "Offline Access",
    networkStatus: "Network",
    installApp: "Install App",
    appInstalled: "Installed",
    appInstallAvailable: "Ready to install",
    appInstallUnavailable: "Browser install not available",
    offlineReady: "Offline cache ready",
    offlineCaching: "Preparing offline cache",
    offlineLocalStatic: "Direct local file mode",
    offlineUnsupported: "Offline worker not available here",
    offlineError: "Offline setup failed",
    updateReady: "Update ready after refresh",
    refreshToUpdate: "Refresh to Update",
    online: "Online",
    offline: "Offline",
    installBannerTitle: "Install and study offline",
    installBannerText: "Pin HomeSchool to your device and keep your lessons ready even without internet.",
    installBrowserHint: "Use your browser's install option from the address bar or browser menu.",
    hideBanner: "Hide",
  },
  ur: {
    loadingHome: "ہوم اسکول لوڈ ہو رہا ہے...",
    loadingDb: "آپ کا لرننگ ڈیٹا بیس تیار کیا جا رہا ہے",
    tagline: "آپ کا ذاتی تعلیمی ساتھی",
    yourName: "آپ کا نام",
    enterName: "اپنا نام درج کریں...",
    yourNameUr: "آپ کا اردو نام",
    enterNameUr: "اپنا اردو نام درج کریں...",
    selectGrade: "اپنی جماعت منتخب کریں",
    lessons: "اسباق",
    grade: "جماعت",
    lesson: "سبق",
    completed: "مکمل",
    notStarted: "شروع نہیں ہوا",
    startQuiz: "امتحان شروع کریں",
    progress: "پیش رفت",
    achievements: "کامیابیاں",
    tutor: "اے آئی استاد",
    settings: "ترتیبات",
    home: "ہوم",
    badges: "بیجز",
    quiz: "امتحان",
    currentGrade: "موجودہ جماعت",
    changeGrade: "جماعت تبدیل کریں",
    dataManagement: "ڈیٹا مینجمنٹ",
    dataVersion: "ڈیٹا ورژن",
    checkUpdates: "اپ ڈیٹس چیک کریں",
    refreshCurriculum: "سورس سے دوبارہ لوڈ کریں",
    exportProgress: "پیش رفت ایکسپورٹ کریں",
    importProgress: "پیش رفت امپورٹ کریں",
    versionHistory: "ورژن ہسٹری",
    userData: "یوزر ڈیٹا",
    storageUsage: "اسٹوریج",
    resetProgress: "پیش رفت ری سیٹ کریں",
    fullReset: "مکمل ری سیٹ",
    dayBasedSections: "دن کے حساب سے انگریزی سیکشنز",
    dayBasedDescription: "ہر انگریزی ذیلی سیکشن کے لیے الگ الگ طے کریں کہ ایک دن میں کتنے الفاظ یا جملے دکھائے جائیں۔",
    perDay: "فی دن",
    pacingHelp: "یہ سیٹنگز صرف مطالعے کی دن وار گروپنگ بدلتی ہیں، اصل ڈیٹا فائلیں نہیں۔",
    preferences: "ترجیحات",
    aiConnections: "اے آئی استاد کنیکشنز",
    aiConnectionsHelp: "یہ کیز صرف اسی براؤزر میں محفوظ رہیں گی اور بیک اپ ایکسپورٹ میں شامل نہیں ہوں گی۔ پھر بھی فائل موڈ یا کسی فراہم کنندہ کی پالیسی سے براؤزر کالز بلاک ہو سکتی ہیں۔",
    aiApiKey: "اے آئی کی",
    aiDefaultModel: "ڈیفالٹ ماڈل",
    aiSaveConnection: "کنیکشن محفوظ کریں",
    aiClearConnection: "کنیکشن حذف کریں",
    aiOpenSettings: "ترتیبات کھولیں",
    aiConfigureFirst: "اے آئی استاد استعمال کرنے کے لیے پہلے ترتیبات میں کم از کم ایک فراہم کنندہ کی کی شامل کریں۔",
    aiSelectProvider: "فراہم کنندہ",
    aiSelectModel: "ماڈل",
    aiBrowserBlocked: "براہِ راست براؤزر اے آئی رسائی شائع شدہ HTTPS سائٹ یا localhost پر بہتر چلتی ہے، فائل موڈ میں نہیں۔",
    aiUpdateKey: "کی تبدیل کریں",
    textToSpeech: "آواز میں پڑھنا",
    ttsSpeed: "رفتار",
    englishVoice: "انگریزی آواز",
    urduVoice: "اردو آواز",
    voiceAuto: "خودکار",
    voiceAutoHelp: "خودکار موڈ براؤزر کی مناسب آواز منتخب کرے گا۔",
    urduVoiceHelp: "قریب ترین اردو یا اردو کے موافق براؤزر آواز منتخب کریں۔",
    enabled: "آن",
    disabled: "آف",
    themeMode: "تھیم موڈ",
    themeSystem: "سسٹم",
    themeDark: "گہرا",
    themeLight: "ہلکا",
    dailyReviewCap: "روزانہ ریویو حد",
    dailyReviewCapHelp: "ایک ریویو سیشن میں زیادہ سے زیادہ کارڈز کی تعداد طے کریں۔",
    interfaceLanguage: "انٹرفیس زبان",
    languageEnglish: "English",
    languageUrdu: "اردو",
    languageBilingual: "Bilingual",
    studyPlanning: "مطالعہ منصوبہ بندی",
    dailyGoal: "روزانہ ریویو ہدف",
    weeklyGoal: "ہفتہ وار لفظی ہدف",
    focusTimer: "فوکس ٹائمر",
    studyReminder: "مطالعہ یاد دہانی",
    reminderTime: "یاد دہانی وقت",
    browserNotificationsOn: "براؤزر نوٹیفکیشن آن",
    browserNotificationsOff: "براؤزر نوٹیفکیشن آف",
    notificationReady: "اجازت تیار",
    requestNotifications: "اجازت مانگیں",
    reminderHelp: "یاد دہانیاں اس وقت کام کریں گی جب ایپ کھلی ہو، انسٹال ہو، یا براؤزر نوٹیفکیشن کی اجازت دے۔",
    profileSection: "پروفائل اور نام",
    gradeSection: "جماعت کا انتخاب",
    navPlacement: "نیویگیشن کی جگہ",
    navAutoHide: "اوپر والا ہیڈر خودکار چھپائیں",
    navBarAutoHide: "نیویگیشن بار خودکار چھپائیں",
    navBottom: "نیچے",
    navRight: "دائیں",
    navLeft: "بائیں",
    navTop: "اوپر",
    transitionStyle: "ٹرانزیشن انداز",
    transitionNone: "بند",
    transitionFade: "فِیڈ",
    transitionSlide: "سلائیڈ",
    transitionZoom: "زوم",
    notificationHistory: "نوٹیفکیشن ہسٹری",
    clearNotifications: "ہسٹری صاف کریں",
    noNotificationsYet: "ابھی کوئی نوٹیفکیشن نہیں۔",
    notificationHistoryHint: "مطالعہ یاد دہانیاں اور فوکس سیشن کی اطلاعیں یہاں محفوظ ہوں گی۔",
    review: "ریویو",
    reviewReady: "ریویو قطار",
    dueReviews: "باقی ریویوز",
    reviewedToday: "آج دہرائے گئے",
    learningWords: "سیکھے جا رہے الفاظ",
    masteredWords: "مہارت یافتہ الفاظ",
    retentionRate: "یاد رکھنے کی شرح",
    startReview: "ریویو شروع کریں",
    noReviewsDue: "اس وقت کوئی ریویو باقی نہیں۔",
    revealAnswer: "جواب دکھائیں",
    reviewAgain: "دوبارہ",
    reviewGood: "اچھا",
    reviewEasy: "آسان",
    reviewComplete: "ریویو سیشن مکمل",
    reviewEarnedXp: "حاصل شدہ ریویو ایکس پی",
    reviewHint: "مشکل الفاظ کو یاد رکھنے کے لیے اسپیسڈ ریپیٹیشن استعمال کریں۔",
    reviewSection: "سیکشن",
    reviewExample: "مثال",
    reviewReadyNow: "ابھی تیار",
    reviewTotalDue: "کل باقی",
    reviewHeatmap: "ریویو ہیٹ میپ",
    reviewHeatmapHint: "گزشتہ 12 ہفتوں میں آپ نے کتنی باقاعدگی سے ریویو کیا، یہاں دیکھیں۔",
    weakWordsReport: "کمزور الفاظ رپورٹ",
    weakWordsHint: "یہ الفاظ زیادہ توجہ چاہتے ہیں کیونکہ یہ بار بار غلط ہوئے، باقی ہیں، یا ابھی مضبوط نہیں ہوئے۔",
    favorites: "پسندیدہ",
    favoriteWords: "پسندیدہ الفاظ",
    notedWords: "نوٹس بورڈ",
    studyCollections: "مطالعہ کلیکشنز",
    customLists: "اپنی فہرستیں",
    createList: "فہرست بنائیں",
    createListPlaceholder: "فہرست کا نام لکھیں...",
    noWeakWords: "اس وقت کوئی کمزور لفظ نہیں۔ اپنا ریویو تسلسل جاری رکھیں۔",
    noFavorites: "اسباق یا ریویو کارڈز سے الفاظ کو ستارہ دیں، وہ یہاں جمع ہو جائیں گے۔",
    noNotes: "مشکل الفاظ پر نوٹس لکھیں، وہ یہاں نظر آئیں گے۔",
    noCustomLists: "مشقی الفاظ کو جمع کرنے کے لیے نئی فہرست بنائیں۔",
    addNote: "نوٹ لکھیں",
    saveNote: "نوٹ محفوظ کریں",
    notePlaceholder: "یاد رکھنے کے لیے کوئی اشارہ، مثال یا چھوٹا نوٹ لکھیں...",
    accuracy: "درستگی",
    lapses: "غلطیاں",
    overdue: "تاخیر",
    dueNow: "ابھی واجب",
    listItems: "فہرست کے الفاظ",
    deleteList: "فہرست حذف کریں",
    noListItems: "اس فہرست میں ابھی کوئی لفظ نہیں۔",
    importNow: "کیا یہ بیک اپ ابھی امپورٹ کرنا ہے؟",
    replacePrompt: "اوکے دبائیں تاکہ موجودہ پیش رفت بدل دی جائے۔\nکینسل دبائیں تاکہ بیک اپ کو موجودہ پیش رفت کے ساتھ ملا دیا جائے۔",
    importSuccessReplace: "پیش رفت کامیابی سے امپورٹ ہو گئی اور موجودہ ڈیٹا بدل دیا گیا۔",
    importSuccessMerge: "پیش رفت کامیابی سے امپورٹ ہو گئی اور موجودہ ڈیٹا کے ساتھ ملا دی گئی۔",
    importInvalid: "یہ بیک اپ فائل درست نہیں ہے۔",
    importNewer: "یہ بیک اپ نئے نصابی ورژن سے بنایا گیا تھا۔ کیا پھر بھی امپورٹ کرنا ہے؟",
    refreshConfirm: "کیا سورس فائلز سے نصاب دوبارہ لوڈ کیا جائے جبکہ آپ کی پیش رفت محفوظ رہے؟",
    refreshSuccess: "نصاب کامیابی سے ریفریش ہو گیا",
    refreshNoChanges: "نصاب پہلے ہی تازہ ترین ہے۔",
    resetConfirm: "کیا نصابی ڈیٹا برقرار رکھتے ہوئے کوئز پیش رفت ری سیٹ کرنی ہے؟",
    fullResetConfirm: "مکمل ری سیٹ ڈیٹا بیس اور پیش رفت دونوں صاف کر دے گا۔ کیا جاری رکھنا ہے؟",
    updateAvailableTitle: "نئی اپ ڈیٹ دستیاب ہے۔",
    upToDateTitle: "نصاب پہلے ہی تازہ ترین ہے۔",
    changedSubjects: "بدلے گئے مضامین",
    appExperience: "ایپ تجربہ",
    installStatus: "انسٹال حالت",
    offlineAccess: "آف لائن رسائی",
    networkStatus: "نیٹ ورک",
    installApp: "ایپ انسٹال کریں",
    appInstalled: "انسٹال شدہ",
    appInstallAvailable: "انسٹال کے لیے تیار",
    appInstallUnavailable: "اس براؤزر میں انسٹال دستیاب نہیں",
    offlineReady: "آف لائن کیش تیار",
    offlineCaching: "آف لائن کیش تیار ہو رہی ہے",
    offlineLocalStatic: "براہ راست لوکل فائل موڈ",
    offlineUnsupported: "یہاں آف لائن ورکر دستیاب نہیں",
    offlineError: "آف لائن سیٹ اپ ناکام",
    updateReady: "ریفریش کے بعد اپ ڈیٹ تیار",
    refreshToUpdate: "اپ ڈیٹ کے لیے ریفریش کریں",
    online: "آن لائن",
    offline: "آف لائن",
    installBannerTitle: "ایپ انسٹال کریں اور آف لائن پڑھیں",
    installBannerText: "HomeSchool کو اپنے ڈیوائس پر رکھیں تاکہ انٹرنیٹ کے بغیر بھی اسباق دستیاب رہیں۔",
    installBrowserHint: "انسٹال کے لیے براؤزر کی ایڈریس بار یا مینو والا آپشن استعمال کریں۔",
    hideBanner: "چھپائیں",
  },
};

const DAY_SECTION_META = {
  adverbs: { labelEn: "Adverbs", labelUr: "قید", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  prepositions: { labelEn: "Prepositions", labelUr: "حروف جار", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  adjectives: { labelEn: "Adjectives", labelUr: "صفات", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  conjunctions: { labelEn: "Conjunctions", labelUr: "حروف عطف", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  pronouns: { labelEn: "Pronouns", labelUr: "ضمائر", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  collectiveNouns: { labelEn: "Collective Nouns", labelUr: "اسم جمع", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  verbs: { labelEn: "Verbs", labelUr: "افعال", unitEn: "words", unitUr: "الفاظ", defaultSize: 3, max: 10 },
  vocabulary: { labelEn: "Vocabulary", labelUr: "ذخیرہ الفاظ", unitEn: "words", unitUr: "الفاظ", defaultSize: 5, max: 20 },
  wordMeanings: { labelEn: "Words Meanings", labelUr: "الفاظ کے معانی", unitEn: "words", unitUr: "الفاظ", defaultSize: 5, max: 20 },
  wordOpposites: { labelEn: "Words Opposites", labelUr: "الفاظ کے متضاد", unitEn: "words", unitUr: "الفاظ", defaultSize: 5, max: 20 },
  adverbPhrases: { labelEn: "Adverb Phrases", labelUr: "فقراتِ حال", unitEn: "phrases", unitUr: "فقرے", defaultSize: 5, max: 15 },
  sentences: { labelEn: "Sentence Sections", labelUr: "جملوں والے سیکشن", unitEn: "sentences", unitUr: "جملے", defaultSize: 10, max: 20 },
  urduToEnglish: { labelEn: "Urdu to English", labelUr: "اردو سے انگریزی", unitEn: "sentences", unitUr: "جملے", defaultSize: 5, max: 20 },
};

const AI_PROVIDER_ORDER = ["openai", "anthropic", "ollama"];
const AI_PROVIDER_DEFS = {
  openai: {
    id: "openai",
    name: "ChatGPT",
    nameUr: "چیٹ جی پی ٹی",
    defaultModel: "gpt-4.1-mini",
    keyPlaceholder: "sk-...",
    modelHints: ["gpt-4.1-mini", "gpt-4o-mini", "gpt-5-mini"],
  },
  anthropic: {
    id: "anthropic",
    name: "Claude AI",
    nameUr: "کلاڈ اے آئی",
    defaultModel: "claude-sonnet-4-20250514",
    keyPlaceholder: "sk-ant-...",
    modelHints: ["claude-sonnet-4-20250514", "claude-3-7-sonnet-latest", "claude-3-5-haiku-latest"],
  },
  ollama: {
    id: "ollama",
    name: "Ollama Cloud",
    nameUr: "اولا ما کلاوڈ",
    defaultModel: "gpt-oss:20b",
    keyPlaceholder: "ollama_...",
    modelHints: ["gpt-oss:20b", "gpt-oss:120b", "llama3.2:latest"],
  },
};

function createDefaultAiProviderConfigs() {
  return AI_PROVIDER_ORDER.reduce((acc, providerId) => {
    const definition = AI_PROVIDER_DEFS[providerId];
    acc[providerId] = {
      apiKey: "",
      model: definition.defaultModel,
      models: definition.modelHints.slice(),
      status: "empty",
      lastError: "",
      validatedAt: null,
    };
    return acc;
  }, {});
}

function sanitizeAiProviderConfigs(rawConfigs) {
  const defaults = createDefaultAiProviderConfigs();
  const source = rawConfigs && typeof rawConfigs === "object" ? rawConfigs : {};
  AI_PROVIDER_ORDER.forEach((providerId) => {
    const fallback = defaults[providerId];
    const raw = source[providerId] && typeof source[providerId] === "object" ? source[providerId] : {};
    defaults[providerId] = {
      apiKey: String(raw.apiKey || ""),
      model: String(raw.model || fallback.model),
      models: Array.isArray(raw.models) && raw.models.length > 0 ? raw.models.map((entry) => String(entry || "").trim()).filter(Boolean) : fallback.models.slice(),
      status: String(raw.status || (raw.apiKey ? "saved" : "empty")),
      lastError: String(raw.lastError || ""),
      validatedAt: raw.validatedAt || null,
    };
    if (!defaults[providerId].models.includes(defaults[providerId].model)) {
      defaults[providerId].models.unshift(defaults[providerId].model);
    }
  });
  return defaults;
}

function maskApiKey(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return "••••••••";
  return `${trimmed.slice(0, 4)}••••••${trimmed.slice(-4)}`;
}

function canUseDirectAiFromBrowser() {
  if (window.location.protocol === "file:") {
    return { ok: false, reason: "file" };
  }
  const hostname = window.location.hostname || "";
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  if (window.location.protocol !== "https:" && !isLocal) {
    return { ok: false, reason: "insecure" };
  }
  return { ok: true, reason: null };
}

function buildTutorSystemPrompt(grade, language) {
  const replyHint = language === "ur"
    ? "Reply in Urdu."
    : language === "bilingual"
      ? "Use mostly English with Urdu support when helpful."
      : "Reply in English unless the student clearly asks for Urdu.";
  return `You are a friendly AI tutor named Ustaad for a Grade ${grade || 5} student in Pakistan. Explain simply, use Pakistani examples, keep responses concise (2-4 short paragraphs), and focus on helping the student understand the lesson. ${replyHint}`;
}

function normalizeAiModelList(providerId, models, preferredModel) {
  const definition = AI_PROVIDER_DEFS[providerId];
  const merged = new Set([...(definition?.modelHints || []), ...(Array.isArray(models) ? models : []), preferredModel || definition?.defaultModel]);
  return Array.from(merged).map((entry) => String(entry || "").trim()).filter(Boolean);
}

function extractOpenAiText(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content.map((entry) => {
      if (typeof entry === "string") return entry;
      if (typeof entry?.text === "string") return entry.text;
      return "";
    }).join("").trim();
  }
  return "";
}

function buildAiError(code, message, status = null) {
  const error = new Error(message);
  error.code = code;
  error.status = status;
  return error;
}

function getAiErrorCode(error) {
  return String(error?.code || "unknown");
}

function getAiStatusFromError(error) {
  const code = getAiErrorCode(error);
  if (code === "auth") return "auth";
  if (code === "blocked") return "blocked";
  if (code === "rate_limit") return "quota";
  return "error";
}

function getFriendlyAiErrorMessage(providerId, error, language) {
  const provider = AI_PROVIDER_DEFS[providerId];
  const providerName = joinLocalizedText(provider?.name || providerId, provider?.nameUr || provider?.name || providerId, language);
  const code = getAiErrorCode(error);
  if (code === "auth") {
    return joinLocalizedText(`${providerName} key is invalid or no longer authorized.`, `${providerName} کی درست نہیں ہے یا اب مجاز نہیں رہی۔`, language);
  }
  if (code === "rate_limit") {
    return providerId === "openai"
      ? joinLocalizedText("OpenAI API billing or quota is required for this key.", "اس OpenAI کی کے لیے API بلنگ یا کوٹہ درکار ہے۔", language)
      : joinLocalizedText(`${providerName} quota or rate limit was reached.`, `${providerName} کا کوٹہ یا ریٹ لمٹ پوری ہو گئی ہے۔`, language);
  }
  if (code === "blocked") {
    return providerId === "ollama"
      ? joinLocalizedText("Ollama Cloud is blocking direct browser access from this site.", "Ollama Cloud اس سائٹ سے براہِ راست براؤزر رسائی کو بلاک کر رہا ہے۔", language)
      : joinLocalizedText(`${providerName} is blocking direct browser access from this site.`, `${providerName} اس سائٹ سے براہِ راست براؤزر رسائی کو بلاک کر رہا ہے۔`, language);
  }
  if (code === "timeout") {
    return joinLocalizedText(`${providerName} took too long to respond.`, `${providerName} نے جواب دینے میں بہت وقت لیا۔`, language);
  }
  return error?.message || joinLocalizedText(`${providerName} could not be reached right now.`, `${providerName} تک اس وقت رسائی نہیں ہو سکی۔`, language);
}

function isAiProviderReady(config) {
  return Boolean(String(config?.apiKey || "").trim()) && config?.status === "ready";
}

async function fetchJsonWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timeout = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller ? controller.signal : options.signal,
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { raw: text };
    }
    if (!response.ok) {
      const message = data?.error?.message || data?.message || data?.raw || `Request failed with status ${response.status}.`;
      if (response.status === 401 || response.status === 403) throw buildAiError("auth", message, response.status);
      if (response.status === 429) throw buildAiError("rate_limit", message, response.status);
      throw buildAiError("provider", message, response.status);
    }
    return data;
  } catch (error) {
    if (error?.name === "AbortError") throw buildAiError("timeout", "The request timed out.");
    if (error?.code) throw error;
    if (error instanceof TypeError) throw buildAiError("blocked", "The browser blocked the request or the provider did not allow this origin.");
    throw buildAiError("unknown", error?.message || "Unknown AI request error.");
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function validateAiProviderConfig(providerId, apiKey, preferredModel) {
  const browserCapability = canUseDirectAiFromBrowser();
  if (!browserCapability.ok) {
    throw buildAiError("blocked", browserCapability.reason === "file"
      ? "Browser AI access is blocked in direct file mode. Use the published HTTPS site or localhost."
      : "Browser AI access needs HTTPS or localhost.");
  }
  if (providerId === "openai") {
    const data = await fetchJsonWithTimeout("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });
    const models = normalizeAiModelList(providerId, (data?.data || []).map((entry) => entry.id).filter((id) => /^gpt|^o\d|^chatgpt/i.test(id)), preferredModel);
    return {
      model: preferredModel || AI_PROVIDER_DEFS.openai.defaultModel,
      models,
      status: "ready",
    };
  }
  if (providerId === "anthropic") {
    await fetchJsonWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: preferredModel || AI_PROVIDER_DEFS.anthropic.defaultModel,
        max_tokens: 4,
        system: "Reply with ok.",
        messages: [{ role: "user", content: "ok" }],
      }),
    });
    return {
      model: preferredModel || AI_PROVIDER_DEFS.anthropic.defaultModel,
      models: normalizeAiModelList(providerId, AI_PROVIDER_DEFS.anthropic.modelHints, preferredModel),
      status: "ready",
    };
  }
  const data = await fetchJsonWithTimeout("https://ollama.com/api/tags", {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
    },
  });
  return {
    model: preferredModel || AI_PROVIDER_DEFS.ollama.defaultModel,
    models: normalizeAiModelList(providerId, (data?.models || []).map((entry) => entry.name || entry.model), preferredModel),
    status: "ready",
  };
}

async function requestAiTutorResponse(providerId, apiKey, model, conversation, systemPrompt) {
  const browserCapability = canUseDirectAiFromBrowser();
  if (!browserCapability.ok) {
    throw buildAiError("blocked", browserCapability.reason === "file"
      ? "Browser AI access is blocked in direct file mode. Open the HTTPS published site or localhost."
      : "Browser AI access needs HTTPS or localhost.");
  }
  const messages = conversation.map((entry) => ({
    role: entry.role === "ai" ? "assistant" : "user",
    content: entry.text,
  }));
  if (providerId === "openai") {
    const data = await fetchJsonWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });
    return extractOpenAiText(data?.choices?.[0]?.message?.content) || "Sorry, I could not generate a reply.";
  }
  if (providerId === "anthropic") {
    const data = await fetchJsonWithTimeout("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model,
        max_tokens: 800,
        system: systemPrompt,
        messages: messages.map((entry) => ({
          role: entry.role === "assistant" ? "assistant" : "user",
          content: entry.content,
        })),
      }),
    });
    return (data?.content || []).map((entry) => entry?.text || "").join("").trim() || "Sorry, I could not generate a reply.";
  }
  const data = await fetchJsonWithTimeout("https://ollama.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      stream: false,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    }),
  });
  return data?.message?.content || data?.response || "Sorry, I could not generate a reply.";
}

function getLocalizedNamePair(studentName, studentNameUr) {
  return {
    en: String(studentName || studentNameUr || "").trim(),
    ur: String(studentNameUr || studentName || "").trim(),
  };
}

function sanitizeUrduInput(value) {
  return String(value || "")
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s\u060C\u061B\u061F\u0640\u0660-\u0669\u06F0-\u06F9]/g, "")
    .replace(/\s{2,}/g, " ")
    .trimStart();
}

function containsUrduText(value) {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(String(value || ""));
}

function joinLocalizedText(enText, urText, language) {
  if (language === "ur") return urText;
  if (language === "bilingual") return `${enText} / ${urText}`;
  return enText;
}

function isUrduUi(language) {
  return language === "ur";
}

function isBilingualUi(language) {
  return language === "bilingual";
}

function getUiText(language) {
  if (!isBilingualUi(language)) return isUrduUi(language) ? UI_TEXT.ur : UI_TEXT.en;
  return Object.keys(UI_TEXT.en).reduce((acc, key) => {
    acc[key] = joinLocalizedText(UI_TEXT.en[key], UI_TEXT.ur[key] || UI_TEXT.en[key], language);
    return acc;
  }, {});
}

function getSubjectDisplayName(subject, language) {
  if (!subject) return "";
  return joinLocalizedText(subject.name, subject.nameUr || subject.name, language);
}

function getDayDisplayLabel(day, language) {
  return joinLocalizedText(`Day ${day}`, `دن ${day}`, language);
}

function getScopedDayTitle(day, enTitle, urTitle, language) {
  return joinLocalizedText(`Day ${day} - ${enTitle}`, `${urTitle} دن ${day}`, language);
}

function formatNumberLabel(value) {
  return Number(value || 0).toLocaleString();
}

function renderLocalizedTextNode(text, language, urStyle = {}) {
  if (typeof text !== "string") return text;
  if (language === "ur") {
    return React.createElement("span", {
      style: {
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        unicodeBidi: "isolate",
        ...urStyle,
      },
    }, text);
  }
  if (language !== "bilingual" || !text.includes(" / ")) return text;
  const [enText, ...rest] = text.split(" / ");
  const urText = rest.join(" / ");
  return React.createElement(React.Fragment, null,
    React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate",
      },
    }, enText),
    React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate",
      },
    }, " / "),
    React.createElement("span", {
      style: {
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        unicodeBidi: "isolate",
        ...urStyle,
      },
    }, urText));
}

function renderSeparatedLocalizedTextNode(enText, urText, language, options = {}) {
  const {
    gap = 4,
    asBlock = false,
    align = "flex-start",
    enStyle = {},
    urStyle = {},
  } = options;
  if (language === "ur") {
    return React.createElement(asBlock ? "div" : "span", {
      style: {
        display: asBlock ? "block" : "inline-block",
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        unicodeBidi: "isolate",
        textAlign: "right",
        ...urStyle,
      },
    }, urText);
  }
  if (language !== "bilingual") {
    return React.createElement(asBlock ? "div" : "span", {
      style: {
        display: asBlock ? "block" : "inline-block",
        direction: "ltr",
        unicodeBidi: "isolate",
        textAlign: "left",
        ...enStyle,
      },
    }, enText);
  }
  return React.createElement(asBlock ? "div" : "span", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: align,
      gap,
    },
  },
  React.createElement("span", {
    style: {
      direction: "ltr",
      unicodeBidi: "isolate",
      textAlign: "left",
      ...enStyle,
    },
  }, enText),
  React.createElement("span", {
    style: {
      fontFamily: "var(--font-ur)",
      direction: "rtl",
      unicodeBidi: "isolate",
      textAlign: "right",
      ...urStyle,
    },
  }, urText));
}

function renderDirectionalName(name, fallbackDirection = "ltr", extraStyle = {}) {
  const trimmed = String(name || "").trim();
  return React.createElement("span", {
    style: {
      direction: trimmed && isUrduText(trimmed) ? "rtl" : fallbackDirection,
      unicodeBidi: "isolate",
      ...extraStyle,
    },
  }, trimmed);
}

function renderGradeValueNode(gradeLabel, gradeValue, language) {
  const safeGrade = String(gradeValue || "").trim();
  if (language === "ur") {
    return React.createElement("span", {
      style: {
        display: "inline-flex",
        alignItems: "baseline",
        gap: 6,
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        unicodeBidi: "isolate",
      },
    },
    gradeLabel,
    React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate",
        fontFamily: "var(--font)",
      },
    }, safeGrade));
  }
  if (language === "bilingual") {
    return renderSeparatedLocalizedTextNode(
      `Grade ${safeGrade}`,
      `${gradeLabel} ${safeGrade}`,
      language,
      {
        gap: 1,
        enStyle: { fontSize: 14, fontWeight: 700 },
        urStyle: { fontSize: 14, fontWeight: 700 },
      },
    );
  }
  return React.createElement("span", {
    style: {
      direction: "ltr",
      unicodeBidi: "isolate",
    },
  }, `Grade ${safeGrade}`);
}

function renderWelcomeGreeting(namePair, language) {
  const hasName = Boolean(namePair.en || namePair.ur);
  if (!hasName) return renderLocalizedTextNode(joinLocalizedText("Welcome!", "خوش آمدید!", language), language);
  if (language === "ur") {
    return React.createElement("span", {
      style: {
        fontFamily: "var(--font-ur)",
        direction: "rtl",
        unicodeBidi: "isolate",
      },
    },
    "خوش آمدید، ",
    renderDirectionalName(namePair.ur, "rtl", { fontFamily: "inherit" }),
    "!");
  }
  if (language === "bilingual") {
    return React.createElement(React.Fragment, null,
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      },
      "Hi, ",
      renderDirectionalName(namePair.en, "ltr"),
      "!"),
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
        },
      }, " / "),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
        },
      },
      "خوش آمدید، ",
      renderDirectionalName(namePair.ur, "rtl", { fontFamily: "inherit" }),
      "!"));
  }
  return React.createElement(React.Fragment, null, "Hi, ", renderDirectionalName(namePair.en, "ltr"), "!");
}

function buildDaySectionSettings(language, overrides = {}) {
  return Object.keys(DAY_SECTION_META).reduce((acc, key) => {
    const meta = DAY_SECTION_META[key];
    acc[key] = {
      label: joinLocalizedText(meta.labelEn, meta.labelUr, language),
      unitLabel: joinLocalizedText(meta.unitEn, meta.unitUr, language),
      itemsPerDay: Math.max(1, Math.min(meta.max, Number(overrides?.[key]?.itemsPerDay) || meta.defaultSize)),
      min: 1,
      max: meta.max,
      helpText: joinLocalizedText(
        `Set how many ${meta.unitEn} appear in each study day for this section.`,
        `اس سیکشن میں ایک دن میں ${meta.unitUr} کی تعداد مقرر کریں۔`,
        language,
      ),
    };
    return acc;
  }, {});
}

function getSubsectionSettingKey(subtitle) {
  const value = String(subtitle || "").trim().toLowerCase();
  if (value === "urdu to english") return "urduToEnglish";
  if (value === "adverb phrases") return "adverbPhrases";
  if (value === "words meanings") return "wordMeanings";
  if (value === "words opposites") return "wordOpposites";
  if (value === "adverbs") return "adverbs";
  if (value === "prepositions") return "prepositions";
  if (value === "adjectives") return "adjectives";
  if (value === "conjunctions") return "conjunctions";
  if (value === "pronouns") return "pronouns";
  if (value === "collective nouns") return "collectiveNouns";
  if (value === "verbs") return "verbs";
  return null;
}

function PlaceValueChart({ number }) {
  const s = String(number).replace(/,/g,"");
  const places = ["Ones","Tens","Hundreds","Thousands","Ten-Th","Hund-Th","Millions","Ten-M","Hund-M","Billions"];
  const colors = ["#38BDF8","#22C55E","#F59E0B","#EF4444","#A855F7","#EC4899","#14B8A6","#F97316","#6366F1","#D946EF"];
  const digits = s.split("").reverse();
  const w = Math.max(digits.length * 90 + 40, 340);
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} 160`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height="160" rx="12" fill="#1E293B"/>
    {digits.map((d, i) => {
      const x = w - 70 - i * 90;
      return (<g key={i}>
        <rect x={x} y="15" width="70" height="55" rx="10" fill={colors[i%10]} opacity="0.2" stroke={colors[i%10]} strokeWidth="2"/>
        <text x={x+35} y="54" textAnchor="middle" fill={colors[i%10]} fontSize="32" fontWeight="800" fontFamily="'Baloo 2'">{d}</text>
        <text x={x+35} y="100" textAnchor="middle" fill={colors[i%10]} fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{places[i] || ""}</text>
        <text x={x+35} y="130" textAnchor="middle" fill="#94A3B8" fontSize="12" fontFamily="'Baloo 2'">{d !== "0" ? d + new Array(i).fill("0").join("") : "0"}</text>
      </g>);
    })}
  </svg></div>);
}

function ExpandedFormSVG({ number, parts }) {
  const w = Math.max(parts.length * 120 + 60, 380);
  const colors = ["#EF4444","#F59E0B","#22C55E","#38BDF8","#A855F7","#EC4899","#14B8A6"];
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} 120`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height="120" rx="12" fill="#1E293B"/>
    <text x={w/2} y="34" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="800" fontFamily="'Baloo 2'">{number}</text>
    <text x={w/2} y="58" textAnchor="middle" fill="#64748B" fontSize="18" fontFamily="'Baloo 2'">=</text>
    {parts.map((p, i) => {
      const x = 30 + i * 120;
      return (<g key={i}>
        <rect x={x} y="68" width="100" height="38" rx="10" fill={colors[i%7]} opacity="0.15" stroke={colors[i%7]} strokeWidth="2"/>
        <text x={x+50} y="93" textAnchor="middle" fill={colors[i%7]} fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{p}</text>
        {i < parts.length - 1 && <text x={x+112} y="93" textAnchor="middle" fill="#64748B" fontSize="20" fontWeight="800">+</text>}
      </g>);
    })}
  </svg></div>);
}

function NumberLineSVG({ min, max, marks, highlight }) {
  const w = 620, h = 90, pad = 50;
  const lineW = w - pad * 2;
  const getX = (v) => pad + ((v - min) / (max - min)) * lineW;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <line x1={pad} y1="48" x2={w-pad} y2="48" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
    <polygon points={`${pad-8},48 ${pad},42 ${pad},54`} fill="#475569"/>
    <polygon points={`${w-pad+8},48 ${w-pad},42 ${w-pad},54`} fill="#475569"/>
    {marks.map((m, i) => {
      const x = getX(m);
      const isHl = highlight && highlight.includes(m);
      return (<g key={i}>
        <line x1={x} y1="40" x2={x} y2="56" stroke={isHl ? "#F59E0B" : "#94A3B8"} strokeWidth={isHl ? 3 : 2}/>
        <text x={x} y={isHl ? 28 : 75} textAnchor="middle" fill={isHl ? "#F59E0B" : "#94A3B8"} fontSize={isHl ? "15" : "13"} fontWeight={isHl ? "800" : "600"} fontFamily="'Baloo 2'">{m.toLocaleString()}</text>
        {isHl && <circle cx={x} cy="48" r="6" fill="#F59E0B"/>}
      </g>);
    })}
  </svg></div>);
}

function CompareBarsSVG({ num1, num2, label1, label2 }) {
  const mx = Math.max(num1, num2);
  const w1 = (num1 / mx) * 320, w2 = (num2 / mx) * 320;
  const sym = num1 > num2 ? ">" : num1 < num2 ? "<" : "=";
  const symWord = num1 > num2 ? "Greater than" : num1 < num2 ? "Less than" : "Equal to";
  const col1 = num1 >= num2 ? "#22C55E" : "#EF4444", col2 = num2 >= num1 ? "#22C55E" : "#EF4444";
  return (<div className="math-svg"><svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="120" rx="12" fill="#1E293B"/>
    <rect x="90" y="15" width={w1} height="30" rx="8" fill={col1} opacity="0.7"/>
    <text x="10" y="38" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{label1 || num1.toLocaleString()}</text>
    <text x={96 + w1} y="38" fill={col1} fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{num1.toLocaleString()}</text>
    <rect x="90" y="60" width={w2} height="30" rx="8" fill={col2} opacity="0.7"/>
    <text x="10" y="83" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{label2 || num2.toLocaleString()}</text>
    <text x={96 + w2} y="83" fill={col2} fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{num2.toLocaleString()}</text>
    <line x1="440" y1="20" x2="440" y2="100" stroke="#334155" strokeWidth="1" strokeDasharray="4"/>
    <text x="530" y="55" textAnchor="middle" fill="#F59E0B" fontSize="36" fontWeight="900" fontFamily="'Baloo 2'">{sym}</text>
    <text x="530" y="85" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{symWord}</text>
  </svg></div>);
}

function CompareTripleSVG() {
  return (<>
    <CompareBarsSVG num1={5432} num2={4999} />
    <CompareBarsSVG num1={3210} num2={4567} />
    <CompareBarsSVG num1={5678} num2={5678} />
  </>);
}

function RoundingSVG({ number, place, result, direction }) {
  const col = direction === "up" ? "#22C55E" : "#F59E0B";
  return (<div className="math-svg"><svg viewBox="0 0 600 110" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="110" rx="12" fill="#1E293B"/>
    <rect x="15" y="18" width="140" height="70" rx="12" fill="#38BDF822" stroke="#38BDF8" strokeWidth="2"/>
    <text x="85" y="44" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Original</text>
    <text x="85" y="72" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="800" fontFamily="'Baloo 2'">{number.toLocaleString()}</text>
    <line x1="165" y1="53" x2="220" y2="53" stroke={col} strokeWidth="3" strokeLinecap="round"/>
    <polygon points={direction==="up"?"220,48 230,53 220,58":"220,48 230,53 220,58"} fill={col}/>
    <rect x="240" y="18" width="130" height="36" rx="10" fill={col+"22"} stroke={col} strokeWidth="2"/>
    <text x="305" y="42" textAnchor="middle" fill={col} fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Round {direction === "up" ? "↑ UP" : "↓ DOWN"}</text>
    <text x="305" y="76" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">nearest {place}</text>
    <line x1="390" y1="53" x2="430" y2="53" stroke="#A855F7" strokeWidth="3" strokeLinecap="round"/>
    <polygon points="430,48 440,53 430,58" fill="#A855F7"/>
    <rect x="445" y="18" width="140" height="70" rx="12" fill="#A855F722" stroke="#A855F7" strokeWidth="2"/>
    <text x="515" y="44" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Result</text>
    <text x="515" y="72" textAnchor="middle" fill="#F1F5F9" fontSize="22" fontWeight="800" fontFamily="'Baloo 2'">{result.toLocaleString()}</text>
  </svg></div>);
}

function RoundingDualSVG() {
  return (<>
    <RoundingSVG number={4567} place="100" result={4600} direction="up" />
    <RoundingSVG number={3421} place="100" result={3400} direction="down" />
  </>);
}

function StatesOfMatterSVG() {
  const [clickedBox, setClickedBox] = React.useState(null);
  
  const handleBoxClick = (label) => {
    setClickedBox(label);
    setTimeout(() => setClickedBox(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(label);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  const states = [
    {label:"Solid",emoji:"🧊",desc:"Fixed shape & volume",col:"#38BDF8",note:"Tightly packed",dots:[[95,85],[105,85],[100,95],[95,105],[105,105],[100,75],[110,80],[90,100]]},
    {label:"Liquid",emoji:"💧",desc:"Fixed volume, takes shape",col:"#22C55E",note:"Loosely arranged",dots:[[280,75],[295,75],[288,90],[280,105],[295,105],[288,120],[275,85],[300,95]]},
    {label:"Gas",emoji:"💨",desc:"Fills all space",col:"#F59E0B",note:"Far apart, fast-moving",dots:[[425,50],[575,65],[440,95],[570,125],[455,150],[580,170],[430,185],[565,75]]}
  ];
  return (<div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 600 215" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="215" rx="12" fill="#1E293B"/>
    <text x="300" y="20" textAnchor="middle" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">⚗️ Three States of Matter</text>
    {states.map((s,i) => {
      const bx = i===0?10:i===1?210:410;
      return (<g key={i}>
        <rect x={bx} y="30" width="180" height="170" rx="12" fill={clickedBox === s.label ? s.col+"40" : s.col+"18"} stroke={s.col} strokeWidth={clickedBox === s.label ? "3" : "2"}/>
        <text x={bx+90} y="58" textAnchor="middle" fill={s.col} fontSize="19" fontWeight="800" fontFamily="'Baloo 2'">{s.emoji} {s.label}</text>
        {s.dots.map((d,j) => <circle key={j} cx={d[0]} cy={d[1]} r="9" fill={s.col} opacity="0.75"/>)}
        <text x={bx+90} y="168" textAnchor="middle" fill="#E2E8F0" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">{s.desc}</text>
        <text x={bx+90} y="186" textAnchor="middle" fill="#64748B" fontSize="12" fontFamily="'Baloo 2'">{s.note}</text>
      </g>);
    })}
    <text x="200" y="118" textAnchor="middle" fill="#F59E0B" fontSize="32" fontWeight="800">→</text>
    <text x="200" y="138" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">+Heat</text>
    <text x="400" y="118" textAnchor="middle" fill="#F59E0B" fontSize="32" fontWeight="800">→</text>
    <text x="400" y="138" textAnchor="middle" fill="#94A3B8" fontSize="13" fontFamily="'Baloo 2'">+Heat</text>
  </svg></div>);
}

function FoodChainSVG() {
  const items = [
    {emoji:"☀️",label:"Sun",sub:"Energy source",col:"#F59E0B"},
    {emoji:"🌿",label:"Producer",sub:"Makes own food",col:"#22C55E"},
    {emoji:"🐰",label:"Herbivore",sub:"Eats plants",col:"#38BDF8"},
    {emoji:"🦊",label:"Carnivore",sub:"Eats animals",col:"#EF4444"},
    {emoji:"🦅",label:"Top Predator",sub:"Apex of chain",col:"#A855F7"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 600 165" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="165" rx="12" fill="#1E293B"/>
    <text x="300" y="19" textAnchor="middle" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">🌱 Food Chain — Energy Flow</text>
    {items.map((it,i) => {
      const x = 15 + i * 118;
      return (<g key={i}>
        <rect x={x} y="28" width="106" height="125" rx="11" fill={it.col+"18"} stroke={it.col} strokeWidth="2"/>
        <text x={x+53} y="75" textAnchor="middle" fontSize="42">{it.emoji}</text>
        <text x={x+53} y="100" textAnchor="middle" fill={it.col} fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">{it.label}</text>
        <text x={x+53} y="118" textAnchor="middle" fill="#94A3B8" fontSize="12.5" fontFamily="'Baloo 2'">{it.sub}</text>
        <text x={x+53} y="143" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">{["Primary","Secondary","Tertiary","",""][i]||""}</text>
        {i<4 && <text x={x+115} y="94" fill="#F59E0B" fontSize="28" fontWeight="800">→</text>}
      </g>);
    })}
  </svg></div>);
}

function SolarSystemSVG() {
  const planets = [
    {l:"Mercury",d:28,c:"#94A3B8",r:5,n:"1st"},
    {l:"Venus",d:52,c:"#F59E0B",r:7,n:"2nd"},
    {l:"Earth",d:78,c:"#38BDF8",r:7,n:"3rd"},
    {l:"Mars",d:104,c:"#EF4444",r:6,n:"4th"},
    {l:"Jupiter",d:140,c:"#F97316",r:13,n:"5th"},
    {l:"Saturn",d:174,c:"#E2C044",r:11,n:"6th"},
    {l:"Uranus",d:202,c:"#14B8A6",r:9,n:"7th"},
    {l:"Neptune",d:226,c:"#6366F1",r:9,n:"8th"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 700 210" xmlns="http://www.w3.org/2000/svg">
    <rect width="700" height="210" rx="12" fill="#0F172A"/>
    <text x="350" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🪐 Our Solar System — 8 Planets</text>
    {[[80,40],[180,25],[260,45],[370,20],[450,42],[540,28],[630,42],[50,160],[150,170],[280,155],[380,168],[480,162],[590,170],[660,155]].map((s,i) => (
      <circle key={i} cx={s[0]} cy={s[1]} r="1.5" fill="white" opacity="0.4"/>
    ))}
    <circle cx="36" cy="115" r="30" fill="#F59E0B" opacity="0.85"/>
    <text x="36" y="121" textAnchor="middle" fontSize="20">☀️</text>
    <text x="36" y="158" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Sun</text>
    {planets.map((p,i) => {
      const cx = 70 + p.d * 2.7;
      return (<g key={i}>
        <circle cx={cx} cy="115" r={p.r} fill={p.c} opacity="0.9"/>
        {p.l==="Saturn" && <ellipse cx={cx} cy="115" rx={p.r+8} ry="3.5" fill="none" stroke="#E2C044" strokeWidth="2" opacity="0.75"/>}
        <line x1={cx} y1={115+p.r+3} x2={cx} y2="162" stroke={p.c} strokeWidth="0.8" opacity="0.4"/>
        <text x={cx} y="172" textAnchor="middle" fill={p.c} fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{p.l}</text>
        <text x={cx} y="185" textAnchor="middle" fill="#475569" fontSize="8.5" fontFamily="'Baloo 2'">{p.n}</text>
      </g>);
    })}
    <text x="185" y="200" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'Baloo 2'">← Rocky inner planets →</text>
    <text x="510" y="200" textAnchor="middle" fill="#475569" fontSize="9" fontFamily="'Baloo 2'">← Gas giant outer planets →</text>
  </svg></div>);
}

function EarthLayersSVG() {
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 560 320" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="320" rx="12" fill="#1E293B"/>
    <text x="280" y="22" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌍 Earth's Internal Layers</text>
    <circle cx="210" cy="175" r="130" fill="#38BDF825" stroke="#38BDF8" strokeWidth="2"/>
    <circle cx="210" cy="175" r="100" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="2"/>
    <circle cx="210" cy="175" r="62" fill="#EF444432" stroke="#EF4444" strokeWidth="2"/>
    <circle cx="210" cy="175" r="30" fill="#F9731670" stroke="#F97316" strokeWidth="2.5"/>
    <text x="210" y="172" textAnchor="middle" fill="#F1F5F9" fontSize="8.5" fontWeight="800" fontFamily="'Baloo 2'">Inner</text>
    <text x="210" y="182" textAnchor="middle" fill="#F1F5F9" fontSize="8.5" fontWeight="800" fontFamily="'Baloo 2'">Core</text>
    <line x1="318" y1="92" x2="390" y2="92" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="62" width="152" height="50" rx="8" fill="#38BDF812" stroke="#38BDF8" strokeWidth="1"/>
    <text x="468" y="80" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Crust</text>
    <text x="468" y="94" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">5–70 km thick</text>
    <text x="468" y="106" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Thin outer shell</text>
    <line x1="292" y1="150" x2="390" y2="150" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="122" width="152" height="50" rx="8" fill="#F59E0B12" stroke="#F59E0B" strokeWidth="1"/>
    <text x="468" y="140" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Mantle</text>
    <text x="468" y="154" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">~2,900 km thick</text>
    <text x="468" y="166" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Hot semi-solid rock</text>
    <line x1="258" y1="205" x2="390" y2="205" stroke="#EF4444" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="182" width="152" height="50" rx="8" fill="#EF444412" stroke="#EF4444" strokeWidth="1"/>
    <text x="468" y="200" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Outer Core</text>
    <text x="468" y="214" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">Liquid iron + nickel</text>
    <text x="468" y="226" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">Creates magnetic field</text>
    <line x1="236" y1="175" x2="390" y2="266" stroke="#F97316" strokeWidth="1" strokeDasharray="4" opacity="0.6"/>
    <rect x="392" y="242" width="152" height="50" rx="8" fill="#F9731618" stroke="#F97316" strokeWidth="1"/>
    <text x="468" y="260" textAnchor="middle" fill="#F97316" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Inner Core</text>
    <text x="468" y="274" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">Solid iron + nickel</text>
    <text x="468" y="286" textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">~5,500°C</text>
  </svg></div>);
}

function BodySystemSVG({ system }) {
  const [clickedBox, setClickedBox] = React.useState(null);
  
  const handleBoxClick = (part) => {
    setClickedBox(part);
    setTimeout(() => setClickedBox(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(part);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  const data = {
    digestive: {
      title:"🍽️ Digestive System",
      parts:["Mouth","Esophagus","Stomach","Small Intestine","Large Intestine"],
      cols:["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899"],
      descs:["Chew + saliva","Pushes food down","Acid breaks food","Absorbs nutrients","Absorbs water"]
    },
    respiratory: {
      title:"🫁 Respiratory System",
      parts:["Nose/Mouth","Trachea","Bronchi","Lungs","Alveoli"],
      cols:["#38BDF8","#22C55E","#F59E0B","#EF4444","#A855F7"],
      descs:["Filters + warms air","Windpipe","Splits to each lung","Gas exchange","O₂ into blood"]
    },
    circulatory: {
      title:"❤️ Circulatory System",
      parts:["Heart","Arteries","Capillaries","Veins","Heart"],
      cols:["#EF4444","#F59E0B","#EC4899","#38BDF8","#EF4444"],
      descs:["Pumps blood","Carry blood away","Exchange O₂/CO₂","Return to heart","Cycle repeats"]
    }
  };
  const d = data[system]; if(!d) return null;
  
  const illustrations = {
    digestive: {
      url: "img/grade-5/science/human-body-systems/digestive-system.jpg",
      desc: "Mouth → Esophagus → Stomach → Small Intestine → Large Intestine"
    },
    respiratory: {
      urls: ["img/grade-5/science/human-body-systems/respiratory-system.png", "img/grade-5/science/human-body-systems/respiration-process-2-1.jpg"],
      desc: "Nose → Trachea → Bronchi → Lungs → Alveoli (gas exchange)"
    },
    circulatory: {
      urls: ["img/grade-5/science/human-body-systems/human-circulatory-system.jpg", "img/grade-5/science/human-body-systems/human-circulatory-system-detail.jpg"],
      desc: "Heart → Arteries → Capillaries → Veins → Back to Heart"
    }
  };
  
  const illust = illustrations[system];
  
  return (
    <div>
      <div className="math-svg" style={{maxWidth:"1000px"}}><svg viewBox="0 0 630 170" xmlns="http://www.w3.org/2000/svg">
    <rect width="630" height="170" rx="12" fill="#1E293B"/>
    <text x="315" y="20" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{d.title}</text>
    {d.parts.map((p,i) => {
      const x = 12 + i * 122;
      const isClicked = clickedBox === p;
      return (<g key={i} onClick={() => handleBoxClick(p)} style={{cursor: 'pointer'}}>
        <rect x={x} y="30" width="106" height="128" rx="10" fill={d.cols[i]+"22"} stroke={d.cols[i]} strokeWidth="1.8" style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 94px`, transition: 'transform 0.1s ease-out'}}/>
        <g style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 68px`, transition: 'transform 0.1s ease-out'}}>
          <text x={x+53} y="68" textAnchor="middle" fill={d.cols[i]} fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">{i+1}</text>
        </g>
        <g style={{transform: isClicked ? 'scale(0.95)' : 'scale(1)', transformOrigin: `${x+53}px 92px`, transition: 'transform 0.1s ease-out'}}>
          <text x={x+53} y="92" textAnchor="middle" fill={d.cols[i]} fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">{p}</text>
        </g>
        <line x1={x+10} y1="100" x2={x+96} y2="100" stroke={d.cols[i]+"40"} strokeWidth="1"/>
        <text x={x+53} y="116" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{d.descs[i]}</text>
        {i<4 && <text x={x+114} y="94" fill="#F59E0B" fontSize="28" fontWeight="800" textAnchor="middle">→</text>}
      </g>);
    })}
  </svg></div>
      <div style={{marginTop:"20px", textAlign:"center"}}>
        <h3 style={{color:"#94A3B8", fontSize:"14px", marginBottom:"10px"}}>Illustration</h3>
        {illust.urls ? (
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"15px", maxWidth:"900px", margin:"0 auto"}}>
            {illust.urls.map((url, idx) => (
              <img key={idx} src={url} alt={`${system}-${idx}`} style={{width:"100%", height:"400px", borderRadius:"8px", border:"1px solid #475569", boxShadow:"0 4px 6px rgba(0,0,0,0.3)", objectFit:"cover"}} />
            ))}
          </div>
        ) : (
          <img src={illust.url} alt={system} style={{maxWidth:"100%", maxHeight:"450px", borderRadius:"8px", border:"1px solid #475569", boxShadow:"0 4px 6px rgba(0,0,0,0.3)", objectFit:"contain"}} />
        )}
        <p style={{color:"#CBD5E1", fontSize:"13px", marginTop:"10px", lineHeight:"1.5"}}>{illust.desc}</p>
      </div>
    </div>
  );
}

function MoonPhasesSVG() {
  const phases = [
    {e:"🌑",l:"New Moon",d:"Dark side facing us"},
    {e:"🌒",l:"Waxing Crescent",d:"Small right sliver"},
    {e:"🌓",l:"First Quarter",d:"Right half lit"},
    {e:"🌔",l:"Waxing Gibbous",d:"More than half lit"},
    {e:"🌕",l:"Full Moon",d:"Fully illuminated"},
    {e:"🌖",l:"Waning Gibbous",d:"Left shrinking"},
    {e:"🌗",l:"Last Quarter",d:"Left half lit"},
    {e:"🌘",l:"Waning Crescent",d:"Small left sliver"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 680 175" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="175" rx="12" fill="#0F172A"/>
    <text x="340" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌙 Moon Phases — 29.5 Day Cycle</text>
    {phases.map((ph,i) => {
      const x = 10 + i * 83;
      return (<g key={i}>
        <rect x={x} y="26" width="74" height="138" rx="10" fill="#1E293B" stroke="#334155" strokeWidth="1.5"/>
        <text x={x+37} y="74" textAnchor="middle" fontSize="36">{ph.e}</text>
        <text x={x+37} y="96" textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{ph.l.split(' ')[0]}</text>
        <text x={x+37} y="110" textAnchor="middle" fill="#CBD5E1" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">{ph.l.split(' ').slice(1).join(' ')}</text>
        <line x1={x+8} y1="118" x2={x+66} y2="118" stroke="#334155" strokeWidth="1"/>
        <text x={x+37} y="133" textAnchor="middle" fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{ph.d.split(' ').slice(0,2).join(' ')}</text>
        <text x={x+37} y="147" textAnchor="middle" fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{ph.d.split(' ').slice(2).join(' ')}</text>
        {i<7 && <text x={x+80} y="77" fill="#F59E0B" fontSize="14" fontWeight="800">→</text>}
      </g>);
    })}
  </svg></div>);
}

function MagnetPolesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 230" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="230" rx="12" fill="#1E293B"/>
    <text x="320" y="20" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🧲 Magnetic Poles — Attraction &amp; Repulsion</text>
    {/* ATTRACT panel */}
    <rect x="12" y="30" width="300" height="188" rx="12" fill="#22C55E12" stroke="#22C55E" strokeWidth="1.8"/>
    <text x="162" y="50" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">✓ Unlike Poles ATTRACT</text>
    <rect x="28" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="64" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <rect x="122" y="62" width="72" height="52" rx="8" fill="#38BDF835" stroke="#38BDF8" strokeWidth="2.5"/>
    <text x="158" y="95" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">S</text>
    <text x="111" y="94" textAnchor="middle" fill="#F59E0B" fontSize="22" fontWeight="900">⟵⟶</text>
    <path d="M100 72 Q111 52 122 72" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M100 104 Q111 124 122 104" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <text x="222" y="72" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">Magnetic:</text>
    <text x="222" y="87" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">iron 🔩 steel</text>
    <text x="222" y="102" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">nickel, cobalt</text>
    <text x="222" y="118" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Not magnetic:</text>
    <text x="222" y="133" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">wood, plastic,</text>
    <text x="222" y="148" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">glass, copper</text>
    <text x="162" y="204" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Force = PULL together ✓</text>
    {/* REPEL panel */}
    <rect x="328" y="30" width="300" height="188" rx="12" fill="#EF444412" stroke="#EF4444" strokeWidth="1.8"/>
    <text x="478" y="50" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">✗ Like Poles REPEL</text>
    <rect x="345" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="381" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <rect x="438" y="62" width="72" height="52" rx="8" fill="#EF444435" stroke="#EF4444" strokeWidth="2.5"/>
    <text x="474" y="95" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">N</text>
    <text x="427" y="94" textAnchor="middle" fill="#EF4444" fontSize="22" fontWeight="900">⟶⟵</text>
    <path d="M417 72 Q405 52 388 67" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M417 104 Q405 124 388 109" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M427 72 Q438 52 455 67" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <path d="M427 104 Q438 124 455 109" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="4" opacity="0.8"/>
    <text x="536" y="75" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">S+S also repels</text>
    <text x="536" y="90" fill="#94A3B8" fontSize="10.5" fontFamily="'Baloo 2'">🧭 Compass uses</text>
    <text x="536" y="105" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Earth's magnetic</text>
    <text x="536" y="120" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">field to point N</text>
    <text x="478" y="204" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Force = PUSH apart ✗</text>
  </svg></div>);
}

function LightRefractionSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 265" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="265" rx="12" fill="#1E293B"/>
    <text x="320" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💡 Reflection &amp; Refraction of Light</text>
    <rect x="10" y="26" width="302" height="228" rx="10" fill="#38BDF815" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="161" y="43" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">REFLECTION (Mirror)</text>
    <line x1="26" y1="188" x2="298" y2="188" stroke="#94A3B8" strokeWidth="5" strokeLinecap="round"/>
    <text x="161" y="208" textAnchor="middle" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Smooth mirror surface</text>
    <line x1="161" y1="100" x2="161" y2="188" stroke="#475569" strokeWidth="1.5" strokeDasharray="5"/>
    <text x="175" y="113" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">Normal</text>
    <line x1="82" y1="74" x2="161" y2="188" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <text x="52" y="70" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Incident</text>
    <line x1="161" y1="188" x2="240" y2="74" stroke="#22C55E" strokeWidth="3" strokeLinecap="round"/>
    <text x="228" y="70" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Reflected</text>
    <text x="108" y="166" fill="#F59E0B" fontSize="15" fontFamily="'Baloo 2'">i°</text>
    <text x="200" y="166" fill="#22C55E" fontSize="15" fontFamily="'Baloo 2'">r°</text>
    <text x="161" y="244" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Angle i = Angle r (Law of Reflection)</text>
    <rect x="328" y="26" width="302" height="228" rx="10" fill="#A855F715" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="479" y="43" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">REFRACTION (Water/Glass)</text>
    <rect x="338" y="164" width="282" height="78" rx="5" fill="#38BDF818"/>
    <line x1="338" y1="164" x2="620" y2="164" stroke="#38BDF8" strokeWidth="2.5"/>
    <text x="479" y="230" textAnchor="middle" fill="#38BDF8" fontSize="11" fontFamily="'Baloo 2'">Water/Glass (denser medium)</text>
    <line x1="479" y1="76" x2="479" y2="212" stroke="#475569" strokeWidth="1.5" strokeDasharray="5"/>
    <line x1="400" y1="72" x2="479" y2="164" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
    <text x="372" y="68" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Incident</text>
    <line x1="479" y1="164" x2="504" y2="236" stroke="#EC4899" strokeWidth="3" strokeLinecap="round"/>
    <text x="506" y="242" fill="#EC4899" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Refracted (bent)</text>
    <text x="479" y="118" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">Bends toward normal</text>
    <text x="479" y="255" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Light slows &amp; bends entering denser medium</text>
  </svg></div>);
}

function SimpleMachinesSVG() {
  const machines = [
    {n:"Lever",e:"⚖️",d:"Bar + fulcrum",x:"Seesaw, scissors",c:"#38BDF8"},
    {n:"Wheel & Axle",e:"🎡",d:"Wheel on rod",x:"Doorknob, steering",c:"#22C55E"},
    {n:"Pulley",e:null,d:"Rope + wheel",x:"Flagpole, crane",c:"#F59E0B"},
    {n:"Inclined Plane",e:"📐",d:"Sloped surface",x:"Ramp, slide",c:"#A855F7"},
    {n:"Wedge",e:"🪓",d:"Thin sharp edge",x:"Axe, knife",c:"#EF4444"},
    {n:"Screw",e:"🔩",d:"Wrapped ramp",x:"Jar lid, bolt",c:"#EC4899"}
  ];
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 590 310" xmlns="http://www.w3.org/2000/svg">
    <rect width="590" height="310" rx="12" fill="#1E293B"/>
    <text x="295" y="19" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">⚙️ The 6 Simple Machines</text>
    {machines.map((m,i) => {
      const col = i%3, row = Math.floor(i/3);
      const bx = 10 + col*192, by = 28 + row*136;
      return (<g key={i}>
        <rect x={bx} y={by} width="182" height="128" rx="10" fill={m.c+"18"} stroke={m.c} strokeWidth="1.5"/>
        {m.e ? (
          <text x={bx+91} y={by+46} textAnchor="middle" fontSize="32">{m.e}</text>
        ) : (
          <g>
            <rect x={bx+60} y={by+9} width="62" height="8" rx="3" fill="#64748B"/>
            <line x1={bx+91} y1={by+17} x2={bx+91} y2={by+24} stroke="#64748B" strokeWidth="2.5"/>
            <circle cx={bx+91} cy={by+38} r="14" fill="none" stroke="#F59E0B" strokeWidth="2.5"/>
            <circle cx={bx+91} cy={by+38} r="5" fill="#F59E0B"/>
            <path d={`M${bx+77},${by+38} A14,14 0 0,0 ${bx+105},${by+38}`} fill="none" stroke="#94A3B8" strokeWidth="2"/>
            <line x1={bx+77} y1={by+38} x2={bx+77} y2={by+60} stroke="#94A3B8" strokeWidth="2"/>
            <rect x={bx+69} y={by+60} width="16" height="9" rx="2" fill="#F59E0B30" stroke="#F59E0B" strokeWidth="1.5"/>
            <line x1={bx+105} y1={by+38} x2={bx+105} y2={by+55} stroke="#94A3B8" strokeWidth="2"/>
            <text x={bx+107} y={by+53} fill="#22C55E" fontSize="13" fontFamily="'Baloo 2'">↑F</text>
          </g>
        )}
        <text x={bx+91} y={by+76} textAnchor="middle" fill={m.c} fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{m.n}</text>
        <text x={bx+91} y={by+93} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{m.d}</text>
        <line x1={bx+12} y1={by+99} x2={bx+170} y2={by+99} stroke={m.c+"40"} strokeWidth="1"/>
        <text x={bx+91} y={by+114} textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{m.x.split(',')[0]}</text>
        <text x={bx+91} y={by+127} textAnchor="middle" fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{m.x.split(',')[1]||''}</text>
      </g>);
    })}
  </svg></div>);
}

function SkeletonSVG() {
  const [clickedBone, setClickedBone] = React.useState(null);
  
  const handleBoneClick = (bone) => {
    setClickedBone(bone);
    setTimeout(() => setClickedBone(null), 200);
    
    // TTS
    const utterance = new SpeechSynthesisUtterance(bone);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  };
  
  return (<div className="math-svg" style={{maxWidth:"1050px"}}><svg viewBox="0 0 560 310" xmlns="http://www.w3.org/2000/svg">
    <rect width="560" height="310" rx="12" fill="#1E293B"/>
    <text x="280" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🦴 Human Skeleton — 206 Bones</text>
    {/* Dashed lines from labels to bones */}
    <line x1="260" y1="54" x2="232" y2="57" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="128" x2="221" y2="135" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="180" x2="215" y2="165" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="260" y1="224" x2="236" y2="218" stroke="#22C55E" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="78" y1="137" x2="155" y2="141" stroke="#A855F7" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="74" y1="202" x2="146" y2="205" stroke="#A855F7" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <line x1="82" y1="272" x2="182" y2="264" stroke="#EC4899" strokeWidth="1" strokeDasharray="4" opacity="0.5"/>
    <ellipse cx="207" cy="57" rx="25" ry="34" fill="#1E3A5F" stroke={clickedBone === "Skull" ? "#F59E0B" : "#CBD5E1"} strokeWidth={clickedBone === "Skull" ? 2.5 : 1.5} style={{cursor: 'pointer', transition: 'stroke-width 0.1s, stroke 0.1s'}} onClick={() => handleBoneClick("Skull")}/>
    <text x="207" y="63" textAnchor="middle" fill="#CBD5E1" fontSize="15" style={{cursor: 'pointer'}} onClick={() => handleBoneClick("Skull")}>💀</text>
    <line x1="207" y1="91" x2="207" y2="213" stroke={clickedBone === "Spine" ? "#38BDF8" : "#94A3B8"} strokeWidth={clickedBone === "Spine" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Spine")}/>
    {[105,121,137,153,169,185,201].map((y,i) => <rect key={i} x="200" y={y-5} width="14" height="9" rx="2" fill={clickedBone === "Rib Cage" ? "#F59E0B" : "#64748B"} stroke="#94A3B8" strokeWidth="1" style={{cursor: 'pointer', transition: 'fill 0.1s'}} onClick={() => handleBoneClick("Rib Cage")}/>)}
    {[0,1,2,3,4].map(i => (<g key={i} onClick={() => handleBoneClick("Rib Cage")} style={{cursor: 'pointer'}}><path d={`M207,${120+i*14} Q188,${113+i*14} 181,${127+i*14}`} fill="none" stroke={clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Rib Cage" ? "3" : "2"} style={{transition: 'stroke 0.1s, stroke-width 0.1s'}}/><path d={`M207,${120+i*14} Q226,${113+i*14} 233,${127+i*14}`} fill="none" stroke={clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Rib Cage" ? "3" : "2"} style={{transition: 'stroke 0.1s, stroke-width 0.1s'}}/></g>))}
    <ellipse cx="207" cy="218" rx="29" ry="18" fill="#1E3A5F" stroke={clickedBone === "Pelvis" ? "#22C55E" : "#94A3B8"} strokeWidth={clickedBone === "Pelvis" ? 2.5 : 1.5} style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Pelvis")}/>
    <line x1="181" y1="108" x2="155" y2="175" stroke={clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Humerus" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Humerus")}/>
    <line x1="155" y1="175" x2="137" y2="229" stroke={clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Radius/Ulna" ? 4 : 3} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <line x1="233" y1="108" x2="260" y2="175" stroke={clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Humerus" ? 5 : 4} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Humerus")}/>
    <line x1="260" y1="175" x2="278" y2="229" stroke={clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Radius/Ulna" ? 4 : 3} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <line x1="193" y1="235" x2="177" y2="290" stroke={clickedBone === "Femur" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Femur" ? 7 : 6} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Femur")}/>
    <line x1="221" y1="235" x2="237" y2="290" stroke={clickedBone === "Femur" ? "#F59E0B" : "#94A3B8"} strokeWidth={clickedBone === "Femur" ? 7 : 6} strokeLinecap="round" style={{cursor: 'pointer', transition: 'stroke 0.1s, stroke-width 0.1s'}} onClick={() => handleBoneClick("Femur")}/>
    <line x1="215" y1="165" x2="260" y2="180" stroke="#38BDF8" strokeWidth={clickedBone === "Spine" ? 2 : 1} strokeDasharray="4" opacity="0.5" style={{transition: 'stroke-width 0.1s'}}/>
    <rect x="260" y={clickedBone === "Skull" ? 44 : 48} width="70" height="20" rx="6" fill="#F59E0B" opacity={clickedBone === "Skull" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Skull" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 61px'}} onClick={() => handleBoneClick("Skull")}/>
    <text x="295" y="61" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Skull" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 61px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Skull")}>Skull</text>
    <rect x="260" y={clickedBone === "Rib Cage" ? 118 : 122} width="70" height="20" rx="6" fill="#F59E0B" opacity={clickedBone === "Rib Cage" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Rib Cage" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 135px'}} onClick={() => handleBoneClick("Rib Cage")}/>
    <text x="295" y="135" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Rib Cage" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 135px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Rib Cage")}>Rib Cage</text>
    <rect x="260" y={clickedBone === "Spine" ? 168 : 172} width="70" height="20" rx="6" fill="#38BDF8" opacity={clickedBone === "Spine" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Spine" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 185px'}} onClick={() => handleBoneClick("Spine")}/>
    <text x="295" y="185" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Spine" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 185px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Spine")}>Spine</text>
    <rect x="260" y={clickedBone === "Pelvis" ? 212 : 216} width="70" height="20" rx="6" fill="#22C55E" opacity={clickedBone === "Pelvis" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Pelvis" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 229px'}} onClick={() => handleBoneClick("Pelvis")}/>
    <text x="295" y="229" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Pelvis" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '295px 229px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Pelvis")}>Pelvis</text>
    <rect x="8" y={clickedBone === "Humerus" ? 125 : 129} width="70" height="20" rx="6" fill="#A855F7" opacity={clickedBone === "Humerus" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Humerus" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '43px 142px'}} onClick={() => handleBoneClick("Humerus")}/>
    <text x="43" y="142" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Humerus" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '43px 142px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Humerus")}>Humerus</text>
    <rect x="4" y={clickedBone === "Radius/Ulna" ? 190 : 194} width="70" height="20" rx="6" fill="#A855F7" opacity={clickedBone === "Radius/Ulna" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Radius/Ulna" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '39px 207px'}} onClick={() => handleBoneClick("Radius/Ulna")}/>
    <text x="39" y="207" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Radius/Ulna" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '39px 207px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Radius/Ulna")}>Radius/Ulna</text>
    <rect x="12" y={clickedBone === "Femur" ? 260 : 264} width="70" height="20" rx="6" fill="#EC4899" opacity={clickedBone === "Femur" ? 1 : 0.85} style={{cursor: 'pointer', transition: 'all 0.1s', transform: clickedBone === "Femur" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '47px 277px'}} onClick={() => handleBoneClick("Femur")}/>
    <text x="47" y="277" textAnchor="middle" fill="#1E293B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'" style={{cursor: 'pointer', pointerEvents: 'none', transform: clickedBone === "Femur" ? 'scale(0.95)' : 'scale(1)', transformOrigin: '47px 277px', transition: 'transform 0.1s ease-out'}} onClick={() => handleBoneClick("Femur")}>Femur</text>
  </svg></div>);
}

function WaterCycleSVG() {
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 680 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="680" height="260" rx="12" fill="#0F172A"/>
    <text x="340" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💧 The Water Cycle</text>
    <circle cx="77" cy="69" r="30" fill="#F59E0B" opacity="0.75"/>
    <text x="77" y="77" textAnchor="middle" fontSize="26">☀️</text>
    <path d="M0 202 Q115 185 230 202 Q345 219 460 202 Q570 185 680 202 L680 260 L0 260 Z" fill="#38BDF830" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="340" y="238" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Ocean / Lake / River</text>
    <ellipse cx="318" cy="65" rx="66" ry="39" fill="#F1F5F9" opacity="0.88"/>
    <ellipse cx="283" cy="75" rx="42" ry="32" fill="#F1F5F9" opacity="0.88"/>
    <ellipse cx="353" cy="75" rx="42" ry="32" fill="#F1F5F9" opacity="0.88"/>
    <text x="318" y="77" textAnchor="middle" fill="#475569" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">☁️ Cloud</text>
    <text x="195" y="158" textAnchor="middle" fill="#F59E0B" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">⬆ Evaporation</text>
    {[143,176,214,247].map((x,i) => (<text key={i} x={x} y={191} fill="#F59E0B" fontSize="17" opacity="0.8">↑</text>))}
    <text x="450" y="39" textAnchor="middle" fill="#8B5CF6" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Condensation (vapor → droplets)</text>
    <text x="472" y="104" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌧️ Precipitation</text>
    {[415,448,481,514,547].map((x,i) => (<text key={i} x={x} y={130} fill="#38BDF8" fontSize="18">↓</text>))}
    <polygon points="612,202 642,115 672,202" fill="#64748B" opacity="0.75"/>
    <text x="617" y="156" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">⛰️ Mts</text>
    <path d="M639 202 Q651 202 659 224" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="4"/>
    <text x="636" y="245" textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="'Baloo 2'">Runoff</text>
  </svg></div>);
}

function PhotosynthesisSVG() {
  return (<div className="math-svg" style={{maxWidth:"1100px"}}><svg viewBox="0 0 620 230" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="230" rx="12" fill="#1E293B"/>
    <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🌿 Photosynthesis — How Plants Make Food</text>
    <defs><marker id="phArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94A3B8"/></marker></defs>
    <circle cx="64" cy="96" r="34" fill="#F59E0B" opacity="0.75"/>
    <text x="64" y="103" textAnchor="middle" fontSize="28">☀️</text>
    <text x="64" y="152" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Sunlight</text>
    <text x="64" y="174" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">CO₂ ↗</text>
    <text x="64" y="197" textAnchor="middle" fill="#38BDF8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">H₂O ↗</text>
    <path d="M98 99 L195 121" stroke="#F59E0B" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <path d="M98 174 L195 148" stroke="#EF4444" strokeWidth="2" opacity="0.7" markerEnd="url(#phArr)"/>
    <path d="M98 196 L195 163" stroke="#38BDF8" strokeWidth="2" opacity="0.7" markerEnd="url(#phArr)"/>
    <ellipse cx="273" cy="137" rx="74" ry="60" fill="#22C55E" opacity="0.65" stroke="#22C55E" strokeWidth="2.5"/>
    <line x1="202" y1="137" x2="344" y2="137" stroke="#15803D" strokeWidth="2.5"/>
    <line x1="273" y1="80" x2="273" y2="193" stroke="#15803D" strokeWidth="2"/>
    <text x="273" y="141" textAnchor="middle" fill="#F0FDF4" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">🌿 Leaf</text>
    <text x="273" y="160" textAnchor="middle" fill="#dcfce7" fontSize="10" fontFamily="'Baloo 2'">Chlorophyll absorbs light</text>
    <path d="M344 113 L425 77" stroke="#A855F7" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <path d="M344 159 L425 178" stroke="#22C55E" strokeWidth="2.5" opacity="0.8" markerEnd="url(#phArr)"/>
    <rect x="427" y="56" width="125" height="54" rx="8" fill="#A855F720" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="489" y="81" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">🍬 Glucose</text>
    <text x="489" y="99" textAnchor="middle" fill="#A855F7" fontSize="10" fontFamily="'Baloo 2'">(Energy / Food)</text>
    <rect x="427" y="160" width="125" height="54" rx="8" fill="#22C55E20" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="489" y="185" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">💨 Oxygen</text>
    <text x="489" y="203" textAnchor="middle" fill="#22C55E" fontSize="10" fontFamily="'Baloo 2'">(Released into air)</text>
    <text x="310" y="222" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="'Baloo 2'">Formula: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂</text>
  </svg></div>);
}

function MaterialPropertiesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Properties of Materials</text>
    <rect x="36" y="52" width="258" height="154" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <text x="165" y="76" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Conductors and Insulators</text>
    <circle cx="80" cy="128" r="18" fill="#F59E0B"/><rect x="74" y="109" width="12" height="8" rx="2" fill="#94A3B8"/><rect x="74" y="139" width="12" height="8" rx="2" fill="#94A3B8"/>
    <line x1="98" y1="128" x2="150" y2="128" stroke="#F59E0B" strokeWidth="5"/>
    <line x1="150" y1="128" x2="192" y2="104" stroke="#22C55E" strokeWidth="5"/>
    <line x1="150" y1="128" x2="192" y2="152" stroke="#22C55E" strokeWidth="5"/>
    <circle cx="208" cy="104" r="7" fill="#22C55E"/><circle cx="208" cy="152" r="7" fill="#22C55E"/>
    <rect x="58" y="166" width="58" height="24" rx="8" fill="#334155"/><text x="87" y="182" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Metal</text>
    <rect x="178" y="166" width="74" height="24" rx="8" fill="#334155"/><text x="215" y="182" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Rubber</text>
    <rect x="324" y="52" width="260" height="154" rx="14" fill="#0F172A" stroke="#22C55E" strokeWidth="2"/>
    <text x="454" y="76" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Transparent to Opaque</text>
    <rect x="360" y="98" width="44" height="82" rx="10" fill="#DDF4FF" stroke="#7DD3FC" strokeWidth="2"/><text x="382" y="194" textAnchor="middle" fill="#7DD3FC" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Clear</text>
    <rect x="436" y="98" width="44" height="82" rx="10" fill="#E2E8F055" stroke="#CBD5E1" strokeWidth="2"/><text x="458" y="194" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Frosted</text>
    <rect x="512" y="98" width="44" height="82" rx="10" fill="#64748B" stroke="#94A3B8" strokeWidth="2"/><text x="534" y="194" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Wood</text>
    <polygon points="336,139 351,132 351,146" fill="#F8FAFC"/><polygon points="412,139 427,132 427,146" fill="#F8FAFC88"/><polygon points="488,139 503,132 503,146" fill="#F8FAFC33"/>
  </svg></div>);
}

function MixturesSolutionsSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Mixtures and Solutions</text>
    <rect x="42" y="54" width="248" height="150" rx="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="2"/>
    <text x="166" y="78" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Mixture</text>
    <rect x="104" y="96" width="124" height="84" rx="12" fill="#38BDF822" stroke="#7DD3FC" strokeWidth="2"/>
    <circle cx="129" cy="118" r="8" fill="#FACC15"/><circle cx="159" cy="146" r="8" fill="#F97316"/><circle cx="198" cy="121" r="8" fill="#22C55E"/><circle cx="145" cy="167" r="8" fill="#F97316"/><circle cx="205" cy="159" r="8" fill="#FACC15"/>
    <text x="166" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Different parts can still be seen</text>
    <rect x="330" y="54" width="248" height="150" rx="14" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <text x="454" y="78" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Solution</text>
    <rect x="392" y="96" width="124" height="84" rx="12" fill="#22C55E22" stroke="#86EFAC" strokeWidth="2"/>
    {Array.from({length:5}).map((_,r)=>Array.from({length:6}).map((__,c)=><circle key={r+"_"+c} cx={411+c*16} cy={114+r*13} r="4" fill={r%2===0 ? "#E2E8F0" : "#22C55E"} />))}
    <text x="454" y="195" textAnchor="middle" fill="#94A3B8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Particles spread evenly through the liquid</text>
  </svg></div>);
}

function GravityForceSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Gravity Pulls Toward Earth</text>
    <circle cx="310" cy="184" r="44" fill="#2563EB"/>
    <path d="M282 175c10-18 30-28 52-22" stroke="#34D399" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <path d="M302 199c15 9 33 8 46-3" stroke="#BBF7D0" strokeWidth="9" fill="none" strokeLinecap="round"/>
    <text x="310" y="189" textAnchor="middle" fill="#F8FAFC" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Earth</text>
    <circle cx="310" cy="72" r="18" fill="#F59E0B"/>
    <line x1="310" y1="90" x2="310" y2="126" stroke="#F59E0B" strokeWidth="4"/>
    <polygon points="310,146 301,128 319,128" fill="#F59E0B"/>
    <line x1="310" y1="146" x2="310" y2="136" stroke="#38BDF8" strokeWidth="4" strokeDasharray="10 8"/>
    <line x1="310" y1="136" x2="310" y2="148" stroke="#38BDF8" strokeWidth="4"/>
    <text x="350" y="110" fill="#F8FAFC" fontSize="14" fontWeight="700" fontFamily="'Baloo 2'">apple falls</text>
    <path d="M310 140 L310 148" stroke="#38BDF8" strokeWidth="4" markerEnd="url(#gravityArrow)"/>
    <text x="310" y="214" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Gravity gives objects weight, makes things fall, and keeps moons and satellites in orbit.</text>
    <defs>
      <marker id="gravityArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#38BDF8"/>
      </marker>
    </defs>
  </svg></div>);
}

function FrictionForceSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Friction Opposes Motion</text>
    <rect x="78" y="118" width="180" height="40" rx="12" fill="#F59E0B"/>
    <rect x="58" y="160" width="230" height="18" rx="8" fill="#475569"/>
    {Array.from({length:11}).map((_,i)=><line key={i} x1={68+i*20} y1="178" x2={78+i*20} y2="190" stroke="#94A3B8" strokeWidth="2"/>)}
    <line x1="118" y1="100" x2="238" y2="100" stroke="#22C55E" strokeWidth="5"/><polygon points="253,100 235,91 235,109" fill="#22C55E"/>
    <line x1="238" y1="90" x2="148" y2="90" stroke="#EF4444" strokeWidth="5"/><polygon points="133,90 151,81 151,99" fill="#EF4444"/>
    <text x="186" y="72" textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">motion</text>
    <text x="194" y="56" textAnchor="middle" fill="#EF4444" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">friction</text>
    <circle cx="426" cy="140" r="54" fill="#0F172A" stroke="#38BDF8" strokeWidth="2"/>
    <path d="M387 141c15-20 47-28 78-18" stroke="#7DD3FC" strokeWidth="8" fill="none" strokeLinecap="round"/>
    <text x="426" y="146" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">rough grip</text>
    <text x="310" y="214" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Rough surfaces increase friction. Oil, ice, and polished floors reduce friction.</text>
  </svg></div>);
}

function EnergyTypesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 255" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="255" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Types of Energy</text>
    {[
      [110,84,'#F59E0B','Heat'],[220,84,'#38BDF8','Light'],[330,84,'#A855F7','Sound'],[440,84,'#22C55E','Kinetic'],
      [165,164,'#EC4899','Chemical'],[290,164,'#F97316','Electrical'],[415,164,'#14B8A6','Potential']
    ].map(([x,y,color,label],i)=><g key={i}><circle cx={x} cy={y} r="34" fill={color+"22"} stroke={color} strokeWidth="3"/><text x={x} y={y+5} textAnchor="middle" fill={color} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
    <rect x="234" y="116" width="152" height="26" rx="13" fill="#0F172A" stroke="#64748B" strokeWidth="1.5"/>
    <text x="310" y="133" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Energy can change form</text>
    <path d="M199 157 C 225 157, 238 157, 251 157" stroke="#EC4899" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M316 149 C 300 126, 275 112, 244 102" stroke="#38BDF8" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M314 147 C 323 125, 332 112, 334 102" stroke="#A855F7" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M421 149 C 432 132, 438 118, 440 102" stroke="#22C55E" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <path d="M412 90 C 340 70, 220 68, 143 80" stroke="#F59E0B" strokeWidth="3" fill="none" markerEnd="url(#energyArrow)"/>
    <text x="225" y="151" fill="#EC4899" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">stored to current</text>
    <text x="239" y="94" fill="#38BDF8" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">powers light</text>
    <text x="342" y="96" fill="#A855F7" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">makes sound</text>
    <text x="451" y="124" fill="#22C55E" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">becomes motion</text>
    <text x="272" y="66" textAnchor="middle" fill="#F59E0B" fontSize="9.5" fontWeight="700" fontFamily="'Baloo 2'">motion creates heat</text>
    <text x="310" y="232" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Energy can change form, such as chemical energy in food becoming motion and body heat.</text>
    <defs>
      <marker id="energyArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#CBD5E1"/>
      </marker>
    </defs>
  </svg></div>);
}

function DayNightSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 240" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="240" rx="16" fill="#0F172A"/>
    <circle cx="132" cy="108" r="38" fill="#FACC15"/>
    {Array.from({length:10}).map((_,i)=>{ const a=i*Math.PI/5; return <line key={i} x1={132+Math.cos(a)*48} y1={108+Math.sin(a)*48} x2={132+Math.cos(a)*64} y2={108+Math.sin(a)*64} stroke="#FDE68A" strokeWidth="4" strokeLinecap="round"/>; })}
    <circle cx="395" cy="122" r="66" fill="#2563EB"/>
    <path d="M395 56A66 66 0 0 1 395 188" fill="#0B1220"/>
    <line x1="395" y1="56" x2="395" y2="188" stroke="#F8FAFC55" strokeWidth="2" strokeDasharray="8 8"/>
    <line x1="395" y1="40" x2="415" y2="204" stroke="#F59E0B" strokeWidth="4"/>
    <line x1="182" y1="86" x2="332" y2="86" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" opacity="0.95"/>
    <line x1="182" y1="108" x2="340" y2="108" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" opacity="0.95"/>
    <line x1="182" y1="130" x2="332" y2="130" stroke="#FACC15" strokeWidth="5" strokeLinecap="round" opacity="0.95"/>
    <polygon points="349,108 334,100 334,116" fill="#FDE68A"/>
    <path d="M438 94c8-12 24-17 38-13-6 8-8 18-5 28-13 2-27-3-33-15z" fill="#E2E8F0"/>
    <circle cx="472" cy="156" r="5" fill="#E2E8F0"/><circle cx="495" cy="138" r="4" fill="#E2E8F0"/><circle cx="504" cy="164" r="3.5" fill="#E2E8F0"/>
    <text x="395" y="222" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">As Earth rotates, one side faces the Sun for day while the opposite side experiences night.</text>
  </svg></div>);
}

function SeasonsCycleSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 250" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="250" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Seasons and Earth's Tilt</text>
    <circle cx="310" cy="128" r="34" fill="#FACC15"/>
    <ellipse cx="310" cy="128" rx="205" ry="72" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="10 8"/>
    {[[105,128,'Summer'],[310,56,'Autumn'],[515,128,'Winter'],[310,200,'Spring']].map(([x,y,label],i)=><g key={i}><circle cx={x} cy={y} r="18" fill="#2563EB"/><line x1={x-8} y1={y-22} x2={x+8} y2={y+22} stroke="#F59E0B" strokeWidth="3"/><text x={x} y={y+40} textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
    <text x="310" y="230" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Earth's tilt stays the same as it orbits the Sun, so different hemispheres get different sunlight.</text>
  </svg></div>);
}

function NervousSystemSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 255" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="255" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Nervous System</text>
    <circle cx="310" cy="72" r="26" fill="#A855F7"/>
    <rect x="300" y="96" width="20" height="78" rx="10" fill="#8B5CF6"/>
    <line x1="310" y1="115" x2="240" y2="138" stroke="#C084FC" strokeWidth="6"/><line x1="310" y1="115" x2="380" y2="138" stroke="#C084FC" strokeWidth="6"/>
    <line x1="250" y1="140" x2="220" y2="188" stroke="#C084FC" strokeWidth="5"/><line x1="370" y1="140" x2="400" y2="188" stroke="#C084FC" strokeWidth="5"/>
    <line x1="310" y1="174" x2="280" y2="224" stroke="#C084FC" strokeWidth="5"/><line x1="310" y1="174" x2="340" y2="224" stroke="#C084FC" strokeWidth="5"/>
    <rect x="60" y="74" width="120" height="56" rx="12" fill="#0F172A" stroke="#A855F7" strokeWidth="2"/><text x="120" y="98" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Brain</text><text x="120" y="116" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">command center</text>
    <rect x="440" y="74" width="120" height="56" rx="12" fill="#0F172A" stroke="#A855F7" strokeWidth="2"/><text x="500" y="98" textAnchor="middle" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Spinal Cord</text><text x="500" y="116" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">signal highway</text>
    <text x="310" y="240" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Nerves carry messages between the brain, senses, muscles, and organs.</text>
  </svg></div>);
}

function ClassificationSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Classification of Living Things</text>
    <rect x="246" y="48" width="128" height="40" rx="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="2"/><text x="310" y="73" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Living Things</text>
    <line x1="310" y1="88" x2="310" y2="116" stroke="#94A3B8" strokeWidth="3"/><line x1="180" y1="116" x2="440" y2="116" stroke="#94A3B8" strokeWidth="3"/>
    <line x1="180" y1="116" x2="180" y2="140" stroke="#94A3B8" strokeWidth="3"/><line x1="440" y1="116" x2="440" y2="140" stroke="#94A3B8" strokeWidth="3"/>
    <rect x="110" y="140" width="140" height="44" rx="12" fill="#38BDF822" stroke="#38BDF8" strokeWidth="2"/><text x="180" y="166" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Vertebrates</text>
    <rect x="370" y="140" width="140" height="44" rx="12" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="2"/><text x="440" y="166" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Invertebrates</text>
    <text x="180" y="206" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">have backbones</text>
    <text x="440" y="206" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">no backbone</text>
    <text x="310" y="228" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Scientists group organisms by shared features such as kingdom and body structure.</text>
  </svg></div>);
}

function AdaptationSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Adaptation Helps Survival</text>
    <rect x="46" y="60" width="242" height="146" rx="14" fill="#0F172A" stroke="#F59E0B" strokeWidth="2"/>
    <text x="167" y="84" textAnchor="middle" fill="#F59E0B" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Desert Camel</text>
    <ellipse cx="167" cy="150" rx="65" ry="30" fill="#D6A56B"/><circle cx="224" cy="132" r="18" fill="#D6A56B"/><rect x="128" y="100" width="40" height="26" rx="12" fill="#C08457"/>
    <line x1="132" y1="175" x2="125" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="158" y1="175" x2="153" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="185" y1="175" x2="190" y2="204" stroke="#D6A56B" strokeWidth="6"/><line x1="210" y1="175" x2="217" y2="204" stroke="#D6A56B" strokeWidth="6"/>
    <text x="167" y="223" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">hump, eyelashes, wide feet</text>
    <rect x="332" y="60" width="242" height="146" rx="14" fill="#0F172A" stroke="#22C55E" strokeWidth="2"/>
    <text x="453" y="84" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Arctic Polar Bear</text>
    <ellipse cx="453" cy="152" rx="68" ry="26" fill="#F8FAFC"/><circle cx="505" cy="136" r="16" fill="#F8FAFC"/><circle cx="494" cy="123" r="5" fill="#E2E8F0"/><circle cx="515" cy="123" r="5" fill="#E2E8F0"/>
    <text x="453" y="223" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">fur, camouflage, fat layer</text>
  </svg></div>);
}

function SoundWavesSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 245" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="245" rx="16" fill="#1E293B"/>
    <text x="310" y="24" textAnchor="middle" fill="#E2E8F0" fontSize="17" fontWeight="800" fontFamily="'Baloo 2'">Sound Waves and Vibration</text>
    <rect x="60" y="94" width="48" height="74" rx="12" fill="#475569"/>
    <circle cx="130" cy="131" r="8" fill="#F59E0B"/>
    {[0,1,2,3,4].map(i => <path key={i} d={`M ${145+i*18} 131 q 9 -18 18 0 q 9 18 18 0`} fill="none" stroke="#38BDF8" strokeWidth="4"/>)}
    <text x="84" y="183" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">speaker</text>
    <text x="272" y="98" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">sound wave</text>
    <path d="M400 92 q 10 -24 20 0 q 10 24 20 0 q 10 -24 20 0 q 10 24 20 0" fill="none" stroke="#A855F7" strokeWidth="4"/>
    <path d="M400 152 q 25 -10 50 0 q 25 10 50 0" fill="none" stroke="#22C55E" strokeWidth="4"/>
    <text x="486" y="82" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">high pitch</text>
    <text x="486" y="184" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">low pitch</text>
    <text x="310" y="224" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Sound is made by vibrations and travels through solids, liquids, and gases, but not through vacuum.</text>
  </svg></div>);
}

function PakistanMapSVG() {
  const legend = [["#38BDF8","KPK"],["#F59E0B","Punjab"],["#22C55E","Balochistan"],["#EF4444","Sindh"],["#8B5CF6","GB/AJK"]];
  return (<div className="math-svg"><svg viewBox="0 0 600 340" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="340" rx="12" fill="#0F172A"/>
    <text x="300" y="19" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan - Provinces &amp; Borders</text>
    <polygon points="152,72 200,44 280,40 325,57 385,72 245,67 225,67" fill="#8B5CF6" opacity="0.78" stroke="#7C3AED" strokeWidth="1.5"/>
    <text x="268" y="60" textAnchor="middle" fill="#DDD6FE" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Gilgit-Baltistan / AJK</text>
    <polygon points="92,135 155,72 225,67 245,84 245,164 188,184 122,169" fill="#38BDF8" opacity="0.78" stroke="#0EA5E9" strokeWidth="1.5"/>
    <text x="172" y="124" textAnchor="middle" fill="#E0F2FE" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">KPK</text>
    <text x="172" y="140" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Peshawar</text>
    <polygon points="245,67 388,72 400,88 398,190 328,200 268,200 245,164 245,84" fill="#F59E0B" opacity="0.78" stroke="#D97706" strokeWidth="1.5"/>
    <text x="320" y="130" textAnchor="middle" fill="#FEF3C7" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Punjab</text>
    <text x="320" y="148" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Lahore</text>
    <polygon points="92,169 122,169 188,184 245,200 268,200 258,290 200,300 138,290 92,225" fill="#22C55E" opacity="0.72" stroke="#16A34A" strokeWidth="1.5"/>
    <text x="176" y="248" textAnchor="middle" fill="#DCFCE7" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Balochistan</text>
    <text x="176" y="266" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Quetta</text>
    <polygon points="268,200 328,200 398,190 435,210 448,300 392,300 258,290" fill="#EF4444" opacity="0.72" stroke="#DC2626" strokeWidth="1.5"/>
    <text x="352" y="252" textAnchor="middle" fill="#FEE2E2" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Sindh</text>
    <text x="352" y="270" textAnchor="middle" fill="#FECACA" fontSize="9" fontFamily="'Baloo 2'">Karachi</text>
    <circle cx="282" cy="104" r="6" fill="#F1F5F9" stroke="#F59E0B" strokeWidth="2"/>
    <text x="296" y="102" fill="#F59E0B" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Islamabad</text>
    <text x="44" y="100" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Afghanistan</text>
    <text x="44" y="210" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Iran</text>
    <text x="300" y="24" textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">China</text>
    <text x="492" y="148" fill="#64748B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">India</text>
    <text x="300" y="322" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Arabian Sea</text>
    {legend.map(([c, n], i) => (
      <g key={i}>
        <rect x={480} y={58 + i * 28} width="15" height="15" rx="3" fill={c} opacity="0.78"/>
        <text x={499} y={70 + i * 28} fill="#94A3B8" fontSize="10" fontFamily="'Baloo 2'">{n}</text>
      </g>
    ))}
  </svg></div>);
}

function IndusValleySVG() {
  const facts = ["2600-1900 BCE","South Asia (Pakistan)","Grid-plan streets","Drainage system","Standard weights","Undeciphered script","Agriculture & trade","Pottery & seals"];
  const timeline = [{x:32,l:"3000 BCE",s:"Early Indus",c:"#22C55E"},{x:148,l:"2600 BCE",s:"Peak Civilization",c:"#38BDF8"},{x:268,l:"1900 BCE",s:"Decline",c:"#EF4444"},{x:388,l:"1526 CE",s:"Mughal Empire",c:"#F59E0B"},{x:505,l:"1947",s:"Independence",c:"#A855F7"}];
  return (<div className="math-svg"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="300" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Indus Valley Civilization - Mohenjo-daro</text>
    <rect x="18" y="28" width="176" height="152" rx="8" fill="#B4530930" stroke="#D97706" strokeWidth="2"/>
    <text x="106" y="46" textAnchor="middle" fill="#FDE68A" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Citadel (Upper City)</text>
    <rect x="28" y="54" width="72" height="52" rx="5" fill="#38BDF840" stroke="#0EA5E9" strokeWidth="2"/>
    <text x="64" y="74" textAnchor="middle" fill="#F1F5F9" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Great</text>
    <text x="64" y="88" textAnchor="middle" fill="#F1F5F9" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Bath</text>
    <rect x="112" y="54" width="70" height="52" rx="5" fill="#F59E0B40" stroke="#D97706" strokeWidth="2"/>
    <text x="147" y="78" textAnchor="middle" fill="#FEF3C7" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Granary</text>
    <text x="147" y="96" textAnchor="middle" fill="#FDE68A" fontSize="8" fontFamily="'Baloo 2'">Food Store</text>
    <rect x="28" y="116" width="154" height="56" rx="5" fill="#A855F730" stroke="#9333EA" strokeWidth="1.5"/>
    <text x="105" y="148" textAnchor="middle" fill="#E9D5FF" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Assembly Hall</text>
    <rect x="206" y="28" width="240" height="152" rx="8" fill="#64748B18" stroke="#475569" strokeWidth="2"/>
    <text x="326" y="45" textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Lower City (Residential)</text>
    {[0,1,2,3].map(i => <line key={"h"+i} x1="206" y1={54+i*40} x2="446" y2={54+i*40} stroke="#94A3B8" strokeWidth="1" opacity="0.5"/>)}
    {[0,1,2,3,4].map(i => <line key={"v"+i} x1={214+i*46} y1="28" x2={214+i*46} y2="180" stroke="#94A3B8" strokeWidth="1" opacity="0.5"/>)}
    {[[214,54],[260,54],[306,54],[352,54],[214,94],[260,94],[306,94],[352,94],[214,134],[260,134]].map(([x,y],i) => (
      <rect key={i} x={x+2} y={y+2} width="38" height="34" rx="4" fill="#92400E" opacity="0.4" stroke="#D97706" strokeWidth="1"/>
    ))}
    <circle cx="380" cy="140" r="11" fill="#38BDF840" stroke="#0EA5E9" strokeWidth="1.5"/>
    <text x="380" y="160" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'Baloo 2'">Public Well</text>
    <rect x="458" y="28" width="132" height="152" rx="8" fill="#1E3A5F" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="524" y="46" textAnchor="middle" fill="#38BDF8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Key Facts</text>
    {facts.map((f,i) => <text key={i} x="466" y={60+i*18} fill="#CBD5E1" fontSize="8.5" fontFamily="'Baloo 2'">{f}</text>)}
    <rect x="10" y="188" width="580" height="102" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="1"/>
    <text x="300" y="204" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Timeline - Civilizations in Pakistan</text>
    <line x1="28" y1="225" x2="572" y2="225" stroke="#334155" strokeWidth="1.5"/>
    {timeline.map((t,i) => (
      <g key={i}>
        <circle cx={t.x} cy={225} r="6" fill={t.c}/>
        <text x={t.x} y={218} textAnchor="middle" fill={t.c} fontSize="8.5" fontWeight="700" fontFamily="'Baloo 2'">{t.l}</text>
        <text x={t.x} y={238} textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="'Baloo 2'">{t.s}</text>
      </g>
    ))}
  </svg></div>);
}

function PakFlagSVG() {
  const symbols = [
    {e:"Animal",n:"National Animal",v:"Snow Leopard"},
    {e:"Flower",n:"National Flower",v:"Jasmine"},
    {e:"Bird",n:"National Bird",v:"Shaheen"},
    {e:"Tree",n:"National Tree",v:"Deodar Cedar"},
    {e:"Fruit",n:"National Fruit",v:"Mango"},
    {e:"Sport",n:"National Sport",v:"Field Hockey"},
  ];
  return (<div className="math-svg"><svg viewBox="0 0 600 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="280" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan - National Identity &amp; Symbols</text>
    <rect x="18" y="28" width="208" height="136" rx="6" fill="#01411C" stroke="#334155" strokeWidth="2"/>
    <rect x="18" y="28" width="42" height="136" fill="#F8FAFC"/>
    <text x="138" y="108" textAnchor="middle" fill="#F8FAFC" fontSize="52">☪</text>
    <text x="122" y="180" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Pakistan Flag</text>
    {[
      "Green = Muslim majority",
      "White = Religious minorities",
      "Crescent = Progress",
      "Star = Light & knowledge",
    ].map((t, i) => <text key={i} x="18" y={196+i*14} fill="#64748B" fontSize="9.5" fontFamily="'Baloo 2'">{t}</text>)}
    <rect x="18" y="250" width="208" height="24" rx="6" fill="#22C55E18" stroke="#22C55E" strokeWidth="1"/>
    <text x="122" y="262" textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Qaumi Tarana - Hafeez Jalandhari</text>
    {symbols.map((s,i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const sx = 238 + col * 118;
      const sy = 28 + row * 124;
      return (<g key={i}>
        <rect x={sx} y={sy} width="112" height="116" rx="8" fill="#334155" stroke="#475569" strokeWidth="1.5"/>
        <text x={sx+56} y={sy+38} textAnchor="middle" fill="#F1F5F9" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">{s.e}</text>
        <text x={sx+56} y={sy+56} textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="'Baloo 2'">{s.n}</text>
        <line x1={sx+8} y1={sy+62} x2={sx+104} y2={sy+62} stroke="#475569" strokeWidth="1"/>
        <text x={sx+56} y={sy+80} textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">{s.v}</text>
      </g>);
    })}
  </svg></div>);
}

function PakGovSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 600 296" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="296" rx="12" fill="#1E293B"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan's Government Structure</text>
    <rect x="222" y="26" width="156" height="46" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="300" y="45" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="300" y="60" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Head of State</text>
    <line x1="300" y1="72" x2="300" y2="88" stroke="#475569" strokeWidth="2"/>
    <rect x="208" y="88" width="184" height="46" rx="8" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="300" y="107" textAnchor="middle" fill="#A855F7" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Prime Minister</text>
    <text x="300" y="122" textAnchor="middle" fill="#E9D5FF" fontSize="9" fontFamily="'Baloo 2'">Head of Government</text>
    <line x1="300" y1="134" x2="300" y2="148" stroke="#475569" strokeWidth="2"/>
    <rect x="218" y="148" width="164" height="40" rx="8" fill="#38BDF818" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="300" y="165" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Federal Cabinet</text>
    <text x="300" y="180" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Ministers of departments</text>
    <line x1="300" y1="188" x2="300" y2="204" stroke="#475569" strokeWidth="2"/>
    <line x1="144" y1="204" x2="456" y2="204" stroke="#475569" strokeWidth="2"/>
    <line x1="144" y1="204" x2="144" y2="218" stroke="#475569" strokeWidth="2"/>
    <line x1="300" y1="204" x2="300" y2="218" stroke="#475569" strokeWidth="2"/>
    <line x1="456" y1="204" x2="456" y2="218" stroke="#475569" strokeWidth="2"/>
    <rect x="54" y="218" width="180" height="48" rx="8" fill="#22C55E18" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="144" y="236" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Senate</text>
    <text x="144" y="250" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Upper House</text>
    <rect x="218" y="218" width="164" height="48" rx="8" fill="#EC489918" stroke="#EC4899" strokeWidth="1.5"/>
    <text x="300" y="236" textAnchor="middle" fill="#EC4899" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Supreme Court</text>
    <text x="300" y="250" textAnchor="middle" fill="#FBCFE8" fontSize="9" fontFamily="'Baloo 2'">Judiciary</text>
    <rect x="366" y="218" width="180" height="48" rx="8" fill="#EF444418" stroke="#EF4444" strokeWidth="1.5"/>
    <text x="456" y="236" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">National Assembly</text>
    <text x="456" y="250" textAnchor="middle" fill="#FECACA" fontSize="9" fontFamily="'Baloo 2'">Lower House</text>
    <text x="300" y="286" textAnchor="middle" fill="#475569" fontSize="9.5" fontFamily="'Baloo 2'">Governed by the 1973 Constitution</text>
  </svg></div>);
}



function PresidentialSystemSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 600 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="300" rx="12" fill="#0F172A"/>
    <text x="300" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Presidential System</text>
    <rect x="220" y="28" width="160" height="48" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="300" y="48" textAnchor="middle" fill="#F59E0B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="300" y="63" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Executive leader for a fixed term</text>
    <line x1="300" y1="76" x2="300" y2="100" stroke="#475569" strokeWidth="2"/>
    <rect x="212" y="100" width="176" height="38" rx="8" fill="#1E293B" stroke="#64748B"/>
    <text x="300" y="122" textAnchor="middle" fill="#E2E8F0" fontSize="10.5" fontWeight="700" fontFamily="'Baloo 2'">Cabinet and ministries</text>
    <rect x="52" y="176" width="140" height="54" rx="10" fill="#38BDF818" stroke="#38BDF8" strokeWidth="2"/>
    <text x="122" y="197" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Legislature</text>
    <text x="122" y="216" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">Makes laws</text>
    <rect x="230" y="176" width="140" height="54" rx="10" fill="#22C55E18" stroke="#22C55E" strokeWidth="2"/>
    <text x="300" y="197" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Executive</text>
    <text x="300" y="216" textAnchor="middle" fill="#BBF7D0" fontSize="9" fontFamily="'Baloo 2'">Runs government</text>
    <rect x="408" y="176" width="140" height="54" rx="10" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="478" y="197" textAnchor="middle" fill="#C4B5FD" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Judiciary</text>
    <text x="478" y="216" textAnchor="middle" fill="#DDD6FE" fontSize="9" fontFamily="'Baloo 2'">Interprets laws</text>
    <line x1="122" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <line x1="300" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <line x1="478" y1="176" x2="300" y2="144" stroke="#334155" strokeWidth="2"/>
    <rect x="148" y="252" width="304" height="28" rx="8" fill="#111827" stroke="#334155"/>
    <text x="300" y="270" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="'Baloo 2'">Checks and balances stop one branch from taking all power</text>
  </svg></div>);
}

function FederalParliamentrySVG() {
  return (<div className="math-svg"><svg viewBox="0 0 620 308" xmlns="http://www.w3.org/2000/svg">
    <rect width="620" height="308" rx="12" fill="#1E293B"/>
    <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Federal Parliamentry System</text>
    <rect x="246" y="28" width="128" height="40" rx="8" fill="#22C55E18" stroke="#22C55E" strokeWidth="2"/>
    <text x="310" y="50" textAnchor="middle" fill="#22C55E" fontSize="11.5" fontWeight="700" fontFamily="'Baloo 2'">Citizens / Voters</text>
    <line x1="310" y1="68" x2="310" y2="94" stroke="#475569" strokeWidth="2"/>
    <rect x="136" y="94" width="348" height="52" rx="10" fill="#38BDF818" stroke="#38BDF8" strokeWidth="2"/>
    <text x="310" y="116" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Parliament</text>
    <text x="310" y="132" textAnchor="middle" fill="#BAE6FD" fontSize="9" fontFamily="'Baloo 2'">National Assembly represents people • Senate represents provinces</text>
    <rect x="238" y="176" width="144" height="48" rx="8" fill="#F59E0B18" stroke="#F59E0B" strokeWidth="2"/>
    <text x="310" y="196" textAnchor="middle" fill="#F59E0B" fontSize="11.5" fontWeight="700" fontFamily="'Baloo 2'">Prime Minister</text>
    <text x="310" y="212" textAnchor="middle" fill="#FDE68A" fontSize="9" fontFamily="'Baloo 2'">Head of government from parliamentary majority</text>
    <rect x="54" y="176" width="126" height="48" rx="8" fill="#A855F718" stroke="#A855F7" strokeWidth="2"/>
    <text x="117" y="196" textAnchor="middle" fill="#C4B5FD" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">President</text>
    <text x="117" y="212" textAnchor="middle" fill="#DDD6FE" fontSize="8.8" fontFamily="'Baloo 2'">Head of state</text>
    <rect x="440" y="176" width="126" height="48" rx="8" fill="#14B8A618" stroke="#14B8A6" strokeWidth="2"/>
    <text x="503" y="196" textAnchor="middle" fill="#5EEAD4" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Provinces</text>
    <text x="503" y="212" textAnchor="middle" fill="#99F6E4" fontSize="8.8" fontFamily="'Baloo 2'">Assemblies share federal power</text>
    <line x1="310" y1="146" x2="310" y2="176" stroke="#475569" strokeWidth="2"/>
    <line x1="180" y1="200" x2="238" y2="200" stroke="#475569" strokeWidth="2"/>
    <line x1="382" y1="200" x2="440" y2="200" stroke="#475569" strokeWidth="2"/>
    <rect x="144" y="250" width="332" height="30" rx="8" fill="#0F172A" stroke="#334155"/>
    <text x="310" y="269" textAnchor="middle" fill="#CBD5E1" fontSize="10" fontFamily="'Baloo 2'">The 1973 Constitution explains how federal and parliamentary institutions work together</text>
  </svg></div>);
}

function PakRiversSVG() {
  const rivers = [
    {n:"Indus",km:"3,180 km",c:"#38BDF8",note:"Longest - main artery"},
    {n:"Jhelum",km:"725 km",c:"#22C55E",note:"Punjab - Mangla Dam"},
    {n:"Chenab",km:"960 km",c:"#A855F7",note:"Joins Indus in Sindh"},
    {n:"Ravi",km:"720 km",c:"#F59E0B",note:"Flows past Lahore"},
    {n:"Kabul",km:"700 km",c:"#EC4899",note:"Meets Indus at Attock"},
    {n:"Sutlej",km:"1,551 km",c:"#14B8A6",note:"Enters from India"},
  ];
  return (<div className="math-svg"><svg viewBox="0 0 630 295" xmlns="http://www.w3.org/2000/svg">
    <rect width="630" height="295" rx="12" fill="#0F172A"/>
    <text x="315" y="18" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Pakistan's Rivers &amp; Water System</text>
    <rect x="18" y="26" width="368" height="256" rx="8" fill="#1E3A5F14" stroke="#334155" strokeWidth="1"/>
    <polygon points="18,95 48,52 90,72 130,44 168,64 198,40 232,57 268,36 300,54 340,30 372,50 386,95" fill="#64748B" opacity="0.45"/>
    <text x="202" y="72" textAnchor="middle" fill="#94A3B8" fontSize="9" fontFamily="'Baloo 2'">Himalayas / Karakoram / Hindu Kush</text>
    <path d="M232,44 Q236,82 222,118 Q212,154 217,194 Q220,234 212,268" fill="none" stroke="#38BDF8" strokeWidth="5.5" strokeLinecap="round" opacity="0.9"/>
    <text x="168" y="178" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Indus River</text>
    <path d="M298,48 Q292,82 283,112 Q267,142 244,162 Q234,167 222,168" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
    <text x="276" y="112" fill="#22C55E" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Jhelum</text>
    <path d="M332,52 Q322,82 312,114 Q297,142 272,160 Q257,165 242,166" fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" opacity="0.85"/>
    <text x="314" y="110" fill="#A855F7" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Chenab</text>
    <path d="M362,57 Q350,82 340,107 Q322,132 302,150 Q282,160 267,160" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
    <text x="346" y="102" fill="#F59E0B" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Ravi</text>
    <path d="M18,110 Q78,110 132,114 Q178,118 217,118" fill="none" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" opacity="0.85"/>
    <text x="82" y="106" fill="#EC4899" fontSize="9" fontWeight="700" fontFamily="'Baloo 2'">Kabul</text>
    {[{x:234,y:102,n:"Tarbela",c:"#EF4444"},{x:287,y:128,n:"Mangla",c:"#EF4444"},{x:172,y:118,n:"Warsak",c:"#F97316"}].map((d,i) => (
      <g key={i}>
        <rect x={d.x-13} y={d.y-9} width="26" height="18" rx="3" fill={d.c} opacity="0.85"/>
        <text x={d.x} y={d.y+5} textAnchor="middle" fill="#F1F5F9" fontSize="7" fontWeight="700" fontFamily="'Baloo 2'">DAM</text>
        <text x={d.x} y={d.y-13} textAnchor="middle" fill={d.c} fontSize="8.5" fontWeight="700" fontFamily="'Baloo 2'">{d.n}</text>
      </g>
    ))}
    <rect x="18" y="268" width="368" height="14" fill="#38BDF8" opacity="0.25"/>
    <text x="202" y="279" textAnchor="middle" fill="#38BDF8" fontSize="9.5" fontFamily="'Baloo 2'">Arabian Sea</text>
    <rect x="398" y="26" width="220" height="256" rx="8" fill="#1E293B" stroke="#334155" strokeWidth="1"/>
    <text x="508" y="44" textAnchor="middle" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Major Rivers</text>
    {rivers.map((r,i) => (
      <g key={i}>
        <line x1="406" y1={58+i*34} x2="610" y2={58+i*34} stroke={r.c} strokeWidth="2.5" opacity="0.7"/>
        <text x="408" y={72+i*34} fill={r.c} fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">{r.n} ({r.km})</text>
        <text x="408" y={84+i*34} fill="#64748B" fontSize="8.5" fontFamily="'Baloo 2'">{r.note}</text>
      </g>
    ))}
  </svg></div>);
}

function ColumnAddSVG({ num1, num2, result }) {
  const sr = String(result).split("");
  const maxL = sr.length;
  const s1 = String(num1).padStart(maxL," ").split("");
  const s2 = String(num2).padStart(maxL," ").split("");
  // Calculate carries from right to left
  const d1r = String(num1).split("").reverse().map(Number);
  const d2r = String(num2).split("").reverse().map(Number);
  const carryArr = new Array(maxL).fill(0);
  let carry = 0;
  for(let i=0; i<d1r.length || i<d2r.length; i++){
    const sum = (d1r[i]||0)+(d2r[i]||0)+carry;
    carry = sum >= 10 ? 1 : 0;
    // carry goes to position (maxL - 1 - i - 1) which is the column to the left
    if(carry && (maxL-2-i) >= 0) carryArr[maxL-2-i] = 1;
  }
  const cw = 48, pad = 55;
  const w = maxL * cw + pad + 20, h = 200;
  const xOf = (i) => pad + i * cw + cw/2;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <text x={w-10} y="18" textAnchor="end" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Column Addition</text>
    {/* Carry circles */}
    {carryArr.map((c,i) => c ? <g key={"c"+i}>
      <circle cx={xOf(i)} cy="40" r="14" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="1.5"/>
      <text x={xOf(i)} y="45" textAnchor="middle" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">1</text>
      <path d={`M${xOf(i+1)-5},62 Q${xOf(i+1)-cw/2},30 ${xOf(i)+5},50`} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3" opacity="0.6"/>
    </g> : null)}
    {/* Number 1 */}
    {s1.map((d,i) => d!==" " ? <text key={"a"+i} x={xOf(i)} y="85" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text> : null)}
    {/* + sign and Number 2 */}
    <text x="22" y="122" fill="#22C55E" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">+</text>
    {s2.map((d,i) => d!==" " ? <text key={"b"+i} x={xOf(i)} y="122" textAnchor="middle" fill="#22C55E" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text> : null)}
    {/* Line */}
    <line x1="12" y1="135" x2={w-12} y2="135" stroke="#F59E0B" strokeWidth="3"/>
    {/* Answer */}
    {sr.map((d,i) => <text key={"r"+i} x={xOf(i)} y="172" textAnchor="middle" fill="#F1F5F9" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">{d}</text>)}
  </svg></div>);
}

function ColumnSubSVG({ num1, num2, result }) {
  const maxL = Math.max(String(num1).length, String(num2).length, String(result).length);
  const s1 = String(num1).padStart(maxL,"0").split("").map(Number);
  const s2 = String(num2).padStart(maxL,"0").split("").map(Number);
  const sr = String(result).padStart(maxL," ").split("");
  // Simulate borrowing: track original and modified top digits
  const newTop = [...s1];
  const changed = new Array(maxL).fill(false); // any column whose value changed
  for(let i=maxL-1; i>=0; i--){
    if(newTop[i] < s2[i]){
      // Need to borrow - find nearest left column with value > 0
      let j = i-1;
      while(j >= 0 && newTop[j] === 0){ newTop[j] = 9; changed[j] = true; j--; }
      if(j >= 0){ newTop[j] -= 1; changed[j] = true; }
      newTop[i] += 10;
      changed[i] = true;
    }
  }
  const cw = 48, pad = 55;
  const w = maxL * cw + pad + 20, h = 210;
  const xOf = (i) => pad + i * cw + cw/2;
  return (<div className="math-svg"><svg viewBox={`0 0 ${w} ${h}`} xmlns="http://www.w3.org/2000/svg">
    <rect width={w} height={h} rx="12" fill="#1E293B"/>
    <text x={w-10} y="18" textAnchor="end" fill="#64748B" fontSize="11" fontFamily="'Baloo 2'">Borrowing</text>
    {/* Borrow annotations above */}
    {changed.map((ch,i) => {
      if(!ch) return null;
      const gave = newTop[i] < s1[i]; // this column gave (decreased)
      const got = newTop[i] > s1[i];  // this column received (increased to 10+)
      return (<g key={"bw"+i}>
        {/* Crossed-out original */}
        <text x={xOf(i)+12} y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="600" fontFamily="'Baloo 2'" opacity="0.5"><tspan textDecoration="line-through">{s1[i]}</tspan></text>
        {/* New value in circle */}
        <circle cx={xOf(i)-8} cy="42" r="13" fill={got?"#22C55E22":"#F59E0B22"} stroke={got?"#22C55E":"#F59E0B"} strokeWidth="1.5"/>
        <text x={xOf(i)-8} y="47" textAnchor="middle" fill={got?"#22C55E":"#F59E0B"} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">{newTop[i]}</text>
        {/* Arrow from lender to receiver */}
        {got && i > 0 && <path d={`M${xOf(i-1)+10},55 Q${xOf(i)-cw/2+10},25 ${xOf(i)-20},35`} fill="none" stroke="#F59E0B" strokeWidth="2" markerEnd="url(#bArr)"/>}
      </g>);
    })}
    {/* Number 1 - original digits (faded if changed) */}
    {s1.map((d,i) => <text key={"a"+i} x={xOf(i)} y="82" textAnchor="middle" fill="#38BDF8" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'" opacity={changed[i]?0.25:1}>{d}</text>)}
    {/* − sign and Number 2 */}
    <text x="22" y="118" fill="#EF4444" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">−</text>
    {s2.map((d,i) => <text key={"b"+i} x={xOf(i)} y="118" textAnchor="middle" fill="#EF4444" fontSize="28" fontWeight="800" fontFamily="'Baloo 2'">{d}</text>)}
    {/* Line */}
    <line x1="12" y1="132" x2={w-12} y2="132" stroke="#EF4444" strokeWidth="3"/>
    {/* Answer */}
    {sr.map((d,i) => <text key={"r"+i} x={xOf(i)} y="170" textAnchor="middle" fill="#F1F5F9" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">{d}</text>)}
    <defs><marker id="bArr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#F59E0B"/></marker></defs>
  </svg></div>);
}

function EstimationSVG({ num1, num2, op, rounded1, rounded2, estimate, exact }) {
  const opSym = op === "+" ? "+" : "−";
  const opCol = op === "+" ? "#22C55E" : "#EF4444";
  return (<div className="math-svg"><svg viewBox="0 0 580 130" xmlns="http://www.w3.org/2000/svg">
    <rect width="580" height="130" rx="12" fill="#1E293B"/>
    <text x="290" y="18" textAnchor="middle" fill="#64748B" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Estimation: Round → Calculate</text>
    {/* Original */}
    <rect x="15" y="30" width="130" height="85" rx="10" fill="#38BDF822" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="80" y="52" textAnchor="middle" fill="#38BDF8" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Original</text>
    <text x="80" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">{num1.toLocaleString()}</text>
    <text x="80" y="95" textAnchor="middle" fill={opCol} fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">{opSym} {num2.toLocaleString()}</text>
    {/* Arrow */}
    <line x1="155" y1="72" x2="195" y2="72" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="195,67 205,72 195,77" fill="#F59E0B"/>
    <text x="180" y="62" textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="700" fontFamily="'Baloo 2'">Round</text>
    {/* Rounded */}
    <rect x="215" y="30" width="130" height="85" rx="10" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="1.5"/>
    <text x="280" y="52" textAnchor="middle" fill="#F59E0B" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Rounded</text>
    <text x="280" y="75" textAnchor="middle" fill="#F1F5F9" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">{rounded1.toLocaleString()}</text>
    <text x="280" y="95" textAnchor="middle" fill={opCol} fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">{opSym} {rounded2.toLocaleString()}</text>
    {/* Arrow */}
    <line x1="355" y1="72" x2="395" y2="72" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round"/>
    <polygon points="395,67 405,72 395,77" fill="#A855F7"/>
    {/* Result */}
    <rect x="415" y="30" width="150" height="85" rx="10" fill="#22C55E22" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="490" y="52" textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="700" fontFamily="'Baloo 2'">Estimate</text>
    <text x="490" y="78" textAnchor="middle" fill="#F1F5F9" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">≈ {estimate.toLocaleString()}</text>
    <text x="490" y="102" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="'Baloo 2'">Exact: {exact.toLocaleString()}</text>
  </svg></div>);
}

function getMathVisualTheme(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/fraction|decimal|ratio|percent/.test(title)) return { accent: "#8B5CF6", soft: "#EDE9FE", dark: "#312E81", chip: "#C4B5FD" };
  if (/algebra|unknown|equation|symbol/.test(title)) return { accent: "#EC4899", soft: "#FCE7F3", dark: "#831843", chip: "#F9A8D4" };
  if (/graph|data|pattern|sequence/.test(title)) return { accent: "#14B8A6", soft: "#CCFBF1", dark: "#134E4A", chip: "#5EEAD4" };
  if (/measure|time|temperature|area|volume|perimeter|shape|angle|line/.test(title)) return { accent: "#F97316", soft: "#FFEDD5", dark: "#9A3412", chip: "#FDBA74" };
  if (/multiply|division|table|factor|multiple|prime|lcm|hcf/.test(title)) return { accent: "#22C55E", soft: "#DCFCE7", dark: "#14532D", chip: "#86EFAC" };
  return { accent: "#38BDF8", soft: "#E0F2FE", dark: "#0F172A", chip: "#7DD3FC" };
}

function clipSvgText(text, maxLength = 140) {
  const clean = normalizeText(text);
  if (clean.length <= maxLength) return clean;
  return clean.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "…";
}

function wrapSvgLines(text, maxChars = 30, maxLines = 4) {
  const words = clipSvgText(text, maxChars * maxLines + 20).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  words.forEach(word => {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) current = next;
    else {
      if (current) lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const trimmed = lines.slice(0, maxLines);
  trimmed[maxLines - 1] = trimmed[maxLines - 1].replace(/…?$/, "") + "…";
  return trimmed;
}

function SvgTextBlock({ text, x, y, maxChars = 30, maxLines = 4, lineHeight = 18, fill = "#E2E8F0", anchor = "start", size = 14, weight = 600 }) {
  const lines = wrapSvgLines(text, maxChars, maxLines);
  return (
    <text x={x} y={y} textAnchor={anchor} fill={fill} fontSize={size} fontWeight={weight} fontFamily="'Baloo 2'">
      {lines.map((line, idx) => <tspan key={idx} x={x} dy={idx === 0 ? 0 : lineHeight}>{line}</tspan>)}
    </text>
  );
}

function getUniqueMathText(items, limit) {
  const seen = new Set();
  const out = [];
  items.forEach(item => {
    const clean = clipSvgText(item, 150);
    const key = clean.toLowerCase();
    if (!clean || seen.has(key)) return;
    seen.add(key);
    out.push(clean);
  });
  return out.slice(0, limit);
}

function getMathSummaryPoints(sub) {
  const points = [];
  splitFactSentences(sub?.c).forEach(line => points.push(line));
  (sub?.examples || []).forEach(line => points.push(line));
  return getUniqueMathText(points, 3);
}

function getMathWorkedExamples(sub) {
  const examples = getUniqueMathText(sub?.examples || [], 3);
  if (examples.length >= 3) return examples;
  const derived = [...examples];
  (sub?.exercises || []).forEach(ex => {
    if (!Array.isArray(ex.parts) || !Array.isArray(ex.ans)) return;
    ex.parts.forEach((part, idx) => {
      if (derived.length >= 3) return;
      derived.push(`${trimQuestionText(part)} -> ${normalizeText(ex.ans[idx])}`);
    });
  });
  return getUniqueMathText(derived, 3);
}

function getMathPracticeExample(sub) {
  if (Array.isArray(sub?.wordProblems) && sub.wordProblems.length) return sub.wordProblems[0];
  if (Array.isArray(sub?.quiz) && sub.quiz.length) return sub.quiz[0].q;
  if (Array.isArray(sub?.examples) && sub.examples.length) return sub.examples[0];
  return sub?.c || "";
}

function getMathQuickRule(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/place value/.test(title)) return "Value = digit × its place.";
  if (/expanded form/.test(title)) return "Write each non-zero place value separately, then add.";
  if (/comparing/.test(title)) return "More digits wins; otherwise compare from the left.";
  if (/rounding/.test(title)) return "Look one place to the right before rounding.";
  if (/number lines/.test(title)) return "Equal spacing helps you locate, compare, and jump correctly.";
  if (/addition/.test(title)) return "Line up place values and carry only when a column reaches 10 or more.";
  if (/borrowing/.test(title)) return "Borrow 1 from the next place to make 10 extra in the current column.";
  if (/estimation in multiplication/.test(title)) return "Round first, multiply quickly, then compare with the exact answer.";
  if (/estimation/.test(title)) return "Round first to get a quick answer that checks your exact work.";
  if (/large multiplication/.test(title)) return "Multiply by each place separately, then add the partial products.";
  if (/long division/.test(title)) return "D-M-S-B: Divide, Multiply, Subtract, Bring down.";
  if (/table/.test(title)) return "Tables are equal groups and skip-counting patterns.";
  if (/factor|multiple/.test(title)) return "Factors divide exactly; multiples come from repeated multiplication.";
  if (/prime|composite/.test(title)) return "Prime numbers have exactly two factors.";
  if (/lcm/.test(title)) return "LCM is the first common multiple you see.";
  if (/hcf/.test(title)) return "HCF is the greatest factor shared by all numbers.";
  if (/divisibility/.test(title)) return "Check the last digit or digit sum before doing full division.";
  if (/proper|improper/.test(title)) return "Compare the numerator with the denominator to decide the type.";
  if (/mixed numbers/.test(title)) return "Divide to make a mixed number; multiply-and-add to go back.";
  if (/equivalent fractions/.test(title)) return "Multiply or divide the top and bottom by the same number.";
  if (/simplifying/.test(title)) return "Use the HCF to reduce a fraction to lowest terms.";
  if (/add & subtract fractions/.test(title)) return "Make denominators the same before combining numerators.";
  if (/multiply fractions/.test(title)) return "Multiply top with top and bottom with bottom, then simplify.";
  if (/decimal place value/.test(title)) return "Each place to the right of the decimal is ten times smaller.";
  if (/fractions ↔ decimals/.test(title)) return "Divide to get a decimal; use place value to turn decimals into fractions.";
  if (/add & subtract decimals/.test(title)) return "Line up decimal points before calculating.";
  if (/comparing decimals/.test(title)) return "Compare whole numbers first, then tenths, hundredths, and beyond.";
  if (/ratio to fraction/.test(title)) return "Turn the ratio into part/whole by adding all parts first.";
  if (/ratio/.test(title)) return "Keep the order the same and simplify only if both parts stay proportional.";
  if (/percentage|real-life problems/.test(title)) return "Percent means out of 100, so benchmark fractions help a lot.";
  if (/conversion/.test(title)) return "Multiply when changing to a smaller unit; divide for a bigger unit.";
  if (/length|mass|capacity/.test(title)) return "Choose a unit that matches the size of the object.";
  if (/time/.test(title)) return "Convert minutes and seconds whenever the total passes 60.";
  if (/temperature/.test(title)) return "Use Celsius and compare hotter/colder by the scale.";
  if (/perimeter/.test(title)) return "Perimeter measures the distance around a shape.";
  if (/area/.test(title)) return "Area measures the space inside a shape.";
  if (/volume/.test(title)) return "Volume measures how much space a solid can hold.";
  if (/bar graph/.test(title)) return "Read the title, scale, and bar height before answering.";
  if (/pictograph/.test(title)) return "Always use the key before counting symbols.";
  if (/line graph/.test(title)) return "Connected points show how values change over time.";
  if (/data/.test(title)) return "Highest, lowest, total, and trend come after reading labels and scale.";
  if (/pattern|sequence|skip counting|missing numbers/.test(title)) return "The change between terms reveals the rule.";
  if (/unknown|equation|symbol/.test(title)) return "Undo operations in reverse order and check by substitution.";
  if (/parallel|perpendicular/.test(title)) return "Parallel never meet; perpendicular meet at 90°.";
  if (/2d shapes/.test(title)) return "Count sides, angles, and lines of symmetry.";
  if (/3d shapes/.test(title)) return "Look at faces, edges, and vertices to name the solid.";
  return "Read carefully, choose the right rule, solve step by step, and check the answer.";
}

function getMathSolveSteps(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  if (/place value/.test(title)) return ["Start at the ones place on the right.", "Move left to name the correct place.", "Find the target digit in the number.", "Multiply the digit by that place value."];
  if (/expanded form/.test(title)) return ["Read each digit and its place.", "Write the non-zero place values separately.", "Join the parts with plus signs.", "Add the parts back to check the number."];
  if (/comparing/.test(title)) return ["Check which number has more digits.", "If equal, compare from the leftmost place.", "Stop at the first place that is different.", "Use >, <, or = and order the numbers."];
  if (/rounding/.test(title)) return ["Choose the place to round to.", "Look at the digit just to its right.", "5 or more means up; 4 or less means down.", "Keep that place and change the rest to zero."];
  if (/number lines/.test(title)) return ["Read the start, end, and interval marks.", "Count equal jumps along the line.", "Locate the point or midpoint carefully.", "Check that the position matches the scale."];
  if (/multi-digit addition/.test(title)) return ["Line up the digits by place value.", "Add from ones toward the left.", "Carry to the next column if needed.", "Estimate to see if the total makes sense."];
  if (/carrying|borrowing/.test(title)) return ["Work from ones to higher places.", "Borrow or carry when the column needs it.", "Rewrite the changed digits clearly.", "Subtract or add again to verify the result."];
  if (/large multiplication/.test(title)) return ["Write the numbers in columns.", "Multiply by the ones digit first.", "Multiply by the next place value.", "Add the partial products carefully."];
  if (/long division/.test(title)) return ["Divide the leading part of the number.", "Multiply the quotient digit back.", "Subtract to find the remainder.", "Bring down the next digit and repeat."];
  if (/table/.test(title)) return ["See the fact as equal groups.", "Skip count or use repeated addition.", "Notice doubles, 5s, and 10s patterns.", "Recall the fact quickly in bigger questions."];
  if (/estimation/.test(title)) return ["Round the numbers to friendly values.", "Do the easier calculation first.", "Compare the estimate with the exact answer.", "Use the estimate to catch mistakes."];
  if (/factor|multiple/.test(title)) return ["List factor pairs or multiples neatly.", "Circle the shared numbers if needed.", "Choose the exact factor or multiple asked for.", "Check by multiplication or division."];
  if (/prime|composite/.test(title)) return ["Test small divisors one by one.", "Count how many factors the number has.", "Exactly two factors means prime.", "More than two factors means composite."];
  if (/lcm/.test(title)) return ["Write multiples of each number.", "Keep going until a common multiple appears.", "Choose the smallest common one.", "Check both numbers divide into it exactly."];
  if (/hcf/.test(title)) return ["List factors of each number.", "Find the common factors.", "Choose the greatest common factor.", "Check it divides every number exactly."];
  if (/divisibility/.test(title)) return ["Look at the last digit or the digit sum.", "Apply the matching divisibility rule.", "Decide if the number divides evenly.", "Confirm with a quick division if needed."];
  if (/proper|improper/.test(title)) return ["Compare numerator with denominator.", "Decide if the fraction is less than or at least 1.", "Name it as proper or improper.", "Sketch or imagine the fraction as parts of a whole."];
  if (/mixed numbers/.test(title)) return ["Divide the numerator by the denominator.", "Use the quotient as the whole number.", "Keep the remainder over the same denominator.", "Reverse by multiply-and-add when needed."];
  if (/equivalent fractions/.test(title)) return ["Choose a number to multiply or divide by.", "Do the same operation to top and bottom.", "Write the new fraction.", "Check the value stays the same."];
  if (/simplifying/.test(title)) return ["Find the HCF of numerator and denominator.", "Divide both by that HCF.", "Write the reduced fraction.", "Check that no common factor is left."];
  if (/add & subtract fractions/.test(title)) return ["Check if denominators already match.", "If not, find a common denominator.", "Combine the numerators only.", "Simplify the final fraction if possible."];
  if (/multiply fractions/.test(title)) return ["Multiply the numerators together.", "Multiply the denominators together.", "Reduce the fraction if possible.", "Convert to a mixed number if needed."];
  if (/decimal place value/.test(title)) return ["Find the decimal point first.", "Read places to the right as tenths, hundredths, and thousandths.", "Match each digit to its place.", "Write the value of the target digit."];
  if (/fractions ↔ decimals/.test(title)) return ["Use division to turn a fraction into a decimal.", "Use place value to turn a decimal into a fraction.", "Write the fraction over 10, 100, or 1000.", "Simplify if possible."];
  if (/add & subtract decimals/.test(title)) return ["Line up decimal points vertically.", "Add zeros to empty places if needed.", "Calculate column by column.", "Bring the decimal point straight down."];
  if (/comparing decimals/.test(title)) return ["Make the decimal lengths equal with zeros.", "Compare whole numbers first.", "Then compare tenths, hundredths, and beyond.", "Choose the greater or smaller value."];
  if (/ratio to fraction/.test(title)) return ["Add the ratio parts to get the total.", "Write the chosen part over the total.", "Simplify the fraction if possible.", "Check both part-fractions match the ratio."];
  if (/ratio/.test(title)) return ["Keep the quantities in the same order.", "Write the ratio with a colon.", "Simplify both parts together.", "Check that the comparison still means the same thing."];
  if (/percentage|real-life problems/.test(title)) return ["Turn the percent into a fraction or decimal.", "Find the whole amount first.", "Calculate the required part, discount, or score.", "Write the answer with context."];
  if (/length|mass|capacity/.test(title)) return ["Choose the correct unit for the object.", "Estimate or read the measurement.", "Convert only if the question asks for it.", "Write the unit with the answer."];
  if (/conversion/.test(title)) return ["Decide whether the new unit is bigger or smaller.", "Multiply for smaller units or divide for bigger ones.", "Use 10, 100, or 1000 as needed.", "Check the size of the answer for reasonableness."];
  if (/time/.test(title)) return ["Read hours, minutes, and seconds carefully.", "Convert when totals pass 60.", "Use counting on or subtraction for elapsed time.", "Write the final time clearly."];
  if (/temperature/.test(title)) return ["Read the Celsius scale carefully.", "Compare hotter and colder values.", "Find the difference if asked.", "Keep the degree sign in the answer."];
  if (/lines & angles/.test(title)) return ["Identify the line or angle shown.", "Estimate or measure the size.", "Classify it by its property.", "Check the name matches the picture."];
  if (/parallel|perpendicular/.test(title)) return ["See whether the lines ever meet.", "If they meet, check for a 90° angle.", "Name them as parallel or perpendicular.", "Match the idea to a real-life example."];
  if (/2d shapes/.test(title)) return ["Count sides and corners.", "Look for equal sides or right angles.", "Check symmetry if needed.", "Name the shape using its properties."];
  if (/3d shapes/.test(title)) return ["Count faces, edges, and vertices.", "Notice whether the solid rolls or stacks.", "Match its net or real object.", "Name the solid correctly."];
  if (/perimeter/.test(title)) return ["Read every side length.", "Add all outer sides together.", "Use the same unit throughout.", "Check that you measured around the shape."];
  if (/area/.test(title)) return ["Identify the base and height or length and width.", "Use the correct area formula.", "Multiply to find the space inside.", "Write square units in the answer."];
  if (/volume/.test(title)) return ["Read the three dimensions.", "Multiply length × width × height.", "Compare the result with cube counting if helpful.", "Write cubic units in the answer."];
  if (/word problems/.test(title) && /perimeter|area|volume/.test(sub?.c || "")) return ["Underline the dimensions and units.", "Choose perimeter, area, or volume.", "Apply the correct formula carefully.", "Write the answer with units or cost."];
  if (/word problems/.test(title) && /each|shared equally|divided/.test(sub?.c || "")) return ["Read the story and underline numbers.", "Look for equal groups or sharing clues.", "Choose multiplication or division.", "Label the final answer clearly."];
  if (/word problems/.test(title)) return ["Read the story twice.", "Underline clue words like total, left, or difference.", "Choose addition or subtraction.", "Solve neatly and write the unit."];
  if (/bar graph/.test(title)) return ["Read the title, axes, and scale.", "Compare the heights of the bars.", "Find the highest, lowest, or difference asked.", "Use the scale to read exact values."];
  if (/pictograph/.test(title)) return ["Read the key before counting anything.", "Count whole and half symbols carefully.", "Multiply by the key value.", "Check the total matches the picture."];
  if (/line graph/.test(title)) return ["Read the time and value axes.", "Follow the points in order.", "Notice rises, falls, and flat parts.", "State the trend with evidence from the graph."];
  if (/interpreting data/.test(title)) return ["Read the title and labels first.", "Find the highest and lowest values.", "Work out totals, averages, or differences.", "Describe any clear pattern or trend."];
  if (/number patterns/.test(title)) return ["Compare one term to the next.", "Spot the repeated change.", "State the rule clearly.", "Use the rule to continue the pattern."];
  if (/skip counting/.test(title)) return ["Choose the jump size.", "Count forward or backward by that amount.", "Write the sequence in order.", "Link the pattern to multiplication facts."];
  if (/missing numbers/.test(title)) return ["Look at the numbers before and after the gap.", "Work out the rule of the pattern.", "Fill in the missing value.", "Check the whole sequence again."];
  if (/sequence/.test(title)) return ["Decide if the pattern adds or multiplies.", "Find the constant difference or ratio.", "Continue the rule carefully.", "Check that every step follows the same pattern."];
  if (/unknown|equation|symbol/.test(title)) return ["Find the operation attached to the variable.", "Undo it in reverse order.", "Isolate the variable step by step.", "Substitute back to check the solution."];
  return ["Read the question carefully.", "Highlight the numbers and key words.", "Choose the correct operation or rule.", "Solve and check if the answer makes sense."];
}

function renderMathPrimaryVisual(sub) {
  if (!sub || !sub.svgType) return null;
  if (sub.svgType === "placeValue") return <PlaceValueChart number={sub.svgData.number} />;
  if (sub.svgType === "expandedForm") return <ExpandedFormSVG number={sub.svgData.number} parts={sub.svgData.parts} />;
  if (sub.svgType === "compare") return <CompareTripleSVG />;
  if (sub.svgType === "rounding") return <RoundingDualSVG />;
  if (sub.svgType === "columnAdd") return <ColumnAddSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />;
  if (sub.svgType === "columnSub") return <ColumnSubSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />;
  if (sub.svgType === "estimation") return <EstimationSVG num1={sub.svgData.num1} num2={sub.svgData.num2} op={sub.svgData.op} rounded1={sub.svgData.rounded1} rounded2={sub.svgData.rounded2} estimate={sub.svgData.estimate} exact={sub.svgData.exact} />;
  if (sub.svgType === "numberLine") {
    return <>
      <NumberLineSVG min={sub.svgData.min} max={sub.svgData.max} marks={sub.svgData.marks} highlight={sub.svgData.highlight} />
      <div className="math-svg"><svg viewBox="0 0 620 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="620" height="100" rx="12" fill="#1E293B"/>
        <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive &amp; Negative Numbers</text>
        <line x1="30" y1="52" x2="590" y2="52" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
        <polygon points="22,52 30,46 30,58" fill="#475569"/>
        <polygon points="598,52 590,46 590,58" fill="#475569"/>
        {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => {
          const x = 310 + n * 52;
          const isZero = n === 0;
          const isNeg = n < 0;
          const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
          return <g key={i}>
            <line x1={x} y1="44" x2={x} y2="60" stroke={col} strokeWidth={isZero ? 4 : 2}/>
            <text x={x} y="80" textAnchor="middle" fill={col} fontSize={isZero ? "18" : "15"} fontWeight={isZero ? "900" : "700"} fontFamily="'Baloo 2'">{n}</text>
            {isZero && <circle cx={x} cy="52" r="6" fill="#F59E0B"/>}
          </g>;
        })}
        <text x="80" y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">← Negative</text>
        <text x="540" y="38" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive →</text>
      </svg></div>
    </>;
  }
  return null;
}

function MathWordProblemStrategySVG({ sub, lessonTitle }) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  const multDiv = /multiplication|division/.test(title) || /shared equally|each|per|divided/.test(sub?.c || "");
  const pav = /perimeter|area|volume/.test(lessonTitle || "");
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    <rect x="28" y="56" width="182" height="152" rx="16" fill="#1E293B" stroke="#38BDF8" strokeWidth="1.5"/>
    <text x="50" y="82" fill="#38BDF8" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1. Read the Story</text>
    <SvgTextBlock text={multDiv ? "Circle equal groups, each, total, and share clues." : pav ? "Underline dimensions, units, cost, and what must be found." : "Circle numbers and clue words like total, left, or difference."} x={50} y={108} maxChars={22} maxLines={5} fill="#E2E8F0" size={13} weight={600} />
    <rect x="228" y="56" width="182" height="152" rx="16" fill="#1E293B" stroke="#22C55E" strokeWidth="1.5"/>
    <text x="250" y="82" fill="#22C55E" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">2. Choose Method</text>
    {multDiv ? <>
      <rect x="252" y="108" width="48" height="36" rx="10" fill="#22C55E22" stroke="#22C55E"/><text x="276" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">4</text>
      <text x="306" y="131" fill="#94A3B8" fontSize="18" fontWeight="700" fontFamily="'Baloo 2'">groups × 6</text>
      <text x="250" y="170" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Equal groups → multiply</text>
      <text x="250" y="190" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Shared equally → divide</text>
    </> : pav ? <>
      <rect x="250" y="104" width="96" height="54" rx="10" fill="#F59E0B22" stroke="#F59E0B"/>
      <text x="298" y="128" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">l = 12 m</text>
      <text x="298" y="148" textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">w = 8 m</text>
      <text x="250" y="182" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Around → perimeter</text>
      <text x="250" y="200" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Inside → area or volume</text>
    </> : <>
      <text x="250" y="116" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">48 + 27 = 75</text>
      <text x="250" y="148" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">75 − 19 = 56</text>
      <text x="250" y="178" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Total / altogether → add</text>
      <text x="250" y="198" fill="#E2E8F0" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Left / difference → subtract</text>
    </>}
    <rect x="428" y="56" width="184" height="152" rx="16" fill="#1E293B" stroke="#A855F7" strokeWidth="1.5"/>
    <text x="450" y="82" fill="#A855F7" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">3. Solve & Check</text>
    <SvgTextBlock text={multDiv ? "Write the number sentence, solve, and check if the answer matches the groups." : pav ? "Use the right formula, keep units, and check whether the answer is distance, area, or capacity." : "Solve neatly, label the answer, then compare it with the story."} x={450} y={110} maxChars={20} maxLines={5} fill="#E2E8F0" size={13} weight={600} />
    <line x1="210" y1="132" x2="228" y2="132" stroke="#64748B" strokeWidth="3"/><polygon points="228,132 218,126 218,138" fill="#64748B"/>
    <line x1="410" y1="132" x2="428" y2="132" stroke="#64748B" strokeWidth="3"/><polygon points="428,132 418,126 418,138" fill="#64748B"/>
  </svg></div>);
}

function MathMultiplicationMethodSVG() {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:"18px"}}>
      <div>
        <div className="math-visual-label" style={{marginBottom:8}}>Column Method with Carry</div>
        <div className="math-svg"><svg viewBox="0 0 760 310" xmlns="http://www.w3.org/2000/svg">
          <rect width="760" height="310" rx="20" fill="#0F172A"/>
          <rect x="78" y="34" width="604" height="248" rx="18" fill="#1E293B" stroke="#86EFAC" strokeWidth="1.6"/>
          <text x="118" y="64" fill="#86EFAC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Multiply ones first, then tens, then add the partial products</text>
          <circle cx="568" cy="78" r="14" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="1.5"/>
          <text x="568" y="83" textAnchor="middle" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">1</text>
          <path d="M582 98 Q576 66 575 76" fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3" opacity="0.7"/>
          <text x="590" y="120" textAnchor="end" fill="#F8FAFC" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">23</text>
          <text x="590" y="156" textAnchor="end" fill="#22C55E" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">× 14</text>
          <line x1="448" y1="168" x2="592" y2="168" stroke="#F59E0B" strokeWidth="3"/>
          <text x="590" y="204" textAnchor="end" fill="#38BDF8" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">92</text>
          <text x="590" y="236" textAnchor="end" fill="#A855F7" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">230</text>
          <line x1="448" y1="246" x2="592" y2="246" stroke="#475569" strokeWidth="2.5"/>
          <text x="590" y="274" textAnchor="end" fill="#F8FAFC" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">322</text>
          <text x="140" y="122" fill="#94A3B8" fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">3 × 4 = 12, write 2 and carry 1</text>
          <text x="140" y="154" fill="#94A3B8" fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">2 × 4 = 8, then add the carried 1 to make 9</text>
          <text x="140" y="202" fill="#94A3B8" fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">Now multiply by 1 ten, so the next line starts in the tens place</text>
          <text x="140" y="234" fill="#94A3B8" fontSize="15" fontWeight="700" fontFamily="'Baloo 2'">23 × 10 = 230, then add 92 + 230</text>
        </svg></div>
      </div>
      <div>
        <div className="math-visual-label" style={{marginBottom:8}}>Area / Partial Products</div>
        <div className="math-svg"><svg viewBox="0 0 760 286" xmlns="http://www.w3.org/2000/svg">
          <rect width="760" height="286" rx="20" fill="#0F172A"/>
          <rect x="34" y="30" width="692" height="226" rx="18" fill="#1E293B" stroke="#22C55E" strokeWidth="1.6"/>
          <text x="76" y="66" fill="#22C55E" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Split 23 into tens and ones, then add both products</text>
          <text x="204" y="98" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">20</text>
          <text x="556" y="98" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">3</text>
          <text x="96" y="160" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">14</text>
          <rect x="116" y="112" width="176" height="88" rx="14" fill="#38BDF822" stroke="#38BDF8" strokeWidth="2"/>
          <rect x="292" y="112" width="176" height="88" rx="14" fill="#14B8A622" stroke="#14B8A6" strokeWidth="2"/>
          <rect x="468" y="112" width="176" height="88" rx="14" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="2"/>
          <text x="204" y="136" textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">14 × 20</text>
          <text x="204" y="174" textAnchor="middle" fill="#F8FAFC" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">280</text>
          <text x="380" y="136" textAnchor="middle" fill="#14B8A6" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Add the parts</text>
          <text x="380" y="174" textAnchor="middle" fill="#F8FAFC" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">280 + 42</text>
          <text x="556" y="136" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">14 × 3</text>
          <text x="556" y="174" textAnchor="middle" fill="#F8FAFC" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">42</text>
          <path d="M214 150 C248 126, 300 126, 338 150" fill="none" stroke="#14B8A6" strokeWidth="3.2" strokeLinecap="round"/>
          <polygon points="338,150 328,145 329,155" fill="#14B8A6"/>
          <path d="M546 150 C512 126, 460 126, 422 150" fill="none" stroke="#14B8A6" strokeWidth="3.2" strokeLinecap="round"/>
          <polygon points="422,150 432,145 431,155" fill="#14B8A6"/>
          <line x1="116" y1="214" x2="644" y2="214" stroke="#334155" strokeWidth="2"/>
          <text x="380" y="240" textAnchor="middle" fill="#E2E8F0" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">14 × 23 = 280 + 42 = 322</text>
        </svg></div>
      </div>
    </div>
  );
}

function MathLongDivisionMethodSVG() {
  return <MathLongDivisionWorkedSVG />;
}

function MathLongDivisionWorkedSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 320" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="320" rx="20" fill="#0F172A"/>
    <path d="M296 112 h-228 v126" fill="none" stroke="#38BDF8" strokeWidth="4"/>
    <path d="M296 112 q-18 -18 -36 0" fill="none" stroke="#38BDF8" strokeWidth="4"/>
    <text x="44" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">5</text>
    <text x="174" y="104" textAnchor="end" fill="#22C55E" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">27</text>
    <text x="126" y="140" textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">1</text>
    <text x="150" y="140" textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">3</text>
    <text x="174" y="140" textAnchor="middle" fill="#F8FAFC" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">5</text>
    <text x="108" y="162" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">−</text>
    <text x="126" y="162" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">1</text>
    <text x="150" y="162" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">0</text>
    <line x1="92" y1="168" x2="182" y2="168" stroke="#F59E0B" strokeWidth="3"/>
    <text x="150" y="186" textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">3</text>
    <text x="174" y="186" textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">5</text>
    <text x="126" y="210" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">−</text>
    <text x="150" y="210" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">3</text>
    <text x="174" y="210" textAnchor="middle" fill="#A855F7" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">5</text>
    <line x1="92" y1="216" x2="182" y2="216" stroke="#F59E0B" strokeWidth="3"/>
    <text x="174" y="236" textAnchor="middle" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">0</text>
    <rect x="324" y="86" width="284" height="184" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="344" y="114" fill="#94A3B8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Repeat the steps</text>
    <text x="344" y="144" fill="#22C55E" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Divide: 13 ÷ 5 = 2</text>
    <text x="344" y="170" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Multiply: 2 × 5 = 10</text>
    <text x="344" y="196" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Subtract: 13 − 10 = 3</text>
    <text x="344" y="222" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">4. Bring down 5 to make 35</text>
    <text x="344" y="246" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">5. Divide again: 35 ÷ 5 = 7</text>
  </svg></div>);
}

function MathFactorsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    {title.includes("lcm") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Find the LCM</text>
      <text x="48" y="108" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Multiples of 4</text>
      {["4","8","12","16"].map((n,i)=><rect key={n} x={48+i*64} y="122" width="52" height="34" rx="10" fill={n==="12"?"#22C55E22":"#1E293B"} stroke={n==="12"?"#22C55E":"#475569"}/>)}
      {["4","8","12","16"].map((n,i)=><text key={"t"+n} x={74+i*64} y="144" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{n}</text>)}
      <text x="48" y="192" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Multiples of 6</text>
      {["6","12","18","24"].map((n,i)=><rect key={n} x={48+i*64} y="206" width="52" height="34" rx="10" fill={n==="12"?"#22C55E22":"#1E293B"} stroke={n==="12"?"#22C55E":"#475569"}/>)}
      {["6","12","18","24"].map((n,i)=><text key={"b"+n} x={74+i*64} y="228" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{n}</text>)}
      <text x="374" y="150" fill="#22C55E" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">LCM(4, 6) = 12</text>
      <SvgTextBlock text="List multiples in order and choose the first number that appears in both lists." x={374} y={182} maxChars={28} maxLines={3} fill="#E2E8F0" size={13} weight={700} />
    </> : title.includes("hcf") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Find the HCF</text>
      <text x="48" y="104" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Factors of 18</text>
      <text x="48" y="126" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">1, 2, 3, 6, 9, 18</text>
      <text x="48" y="166" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Factors of 24</text>
      <text x="48" y="188" fill="#F8FAFC" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">1, 2, 3, 4, 6, 8, 12, 24</text>
      <rect x="394" y="92" width="174" height="110" rx="16" fill="#1E293B" stroke="#22C55E"/>
      <text x="482" y="126" textAnchor="middle" fill="#22C55E" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">Common Factors</text>
      <text x="482" y="154" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1, 2, 3, 6</text>
      <text x="482" y="184" textAnchor="middle" fill="#F59E0B" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">HCF = 6</text>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Prime, Composite, Factors</text>
      <rect x="44" y="104" width="160" height="108" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      <text x="124" y="130" textAnchor="middle" fill="#38BDF8" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Prime: 13</text>
      <text x="124" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1 and 13</text>
      <text x="124" y="192" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Exactly two factors</text>
      <rect x="238" y="104" width="160" height="108" rx="16" fill="#1E293B" stroke="#F59E0B"/>
      <text x="318" y="130" textAnchor="middle" fill="#F59E0B" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Composite: 12</text>
      <text x="318" y="164" textAnchor="middle" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">1, 2, 3, 4, 6, 12</text>
      <text x="318" y="192" textAnchor="middle" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">More than two factors</text>
      <rect x="432" y="104" width="164" height="108" rx="16" fill="#1E293B" stroke="#A855F7"/>
      <SvgTextBlock text="List factor pairs to find all factors, then classify the number." x={452} y={144} maxChars={18} maxLines={4} fill="#E2E8F0" size={14} weight={700} />
    </>}
  </svg></div>);
}
function MathConceptSummarySVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const points = getMathSummaryPoints(sub);
  return (<div className="math-svg"><svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="250" rx="20" fill="#0F172A"/>
    <rect x="18" y="18" width="604" height="214" rx="18" fill={theme.soft} opacity="0.14" stroke={theme.accent} strokeWidth="1.6"/>
    <text x="34" y="46" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Key Idea</text>
    <text x="34" y="74" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{sub.t}</text>
    <SvgTextBlock text={getMathQuickRule(sub, lessonTitle)} x={34} y={102} maxChars={42} maxLines={2} lineHeight={18} fill="#CBD5E1" size={14} weight={600} />
    {points.map((point, idx) => {
      const y = 132 + idx * 34;
      return <g key={idx}>
        <circle cx="42" cy={y - 5} r="8" fill={theme.accent}/>
        <SvgTextBlock text={point} x={60} y={y} maxChars={55} maxLines={2} lineHeight={16} fill="#E2E8F0" size={13} weight={600} />
      </g>;
    })}
  </svg></div>);
}

function MathFractionsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    {title.includes("mixed") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Improper to Mixed Number</text>
      <text x="54" y="116" fill="#F8FAFC" fontSize="22" fontWeight="900" fontFamily="'Baloo 2'">11 ÷ 4 = 2 remainder 3</text>
      <text x="54" y="170" fill="#8B5CF6" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">11/4 = 2 3/4</text>
      <rect x="346" y="96" width="216" height="108" rx="16" fill="#1E293B" stroke="#C4B5FD"/>
      <SvgTextBlock text="Whole number = quotient, fraction = remainder over the same denominator." x={366} y={130} maxChars={22} maxLines={4} fill="#E2E8F0" size={14} weight={700} />
    </> : title.includes("equivalent") || title.includes("simplifying") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{title.includes("equivalent") ? "Equivalent Fractions" : "Simplifying Fractions"}</text>
      <rect x="48" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="94" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1/2</text>
      <text x="158" y="132" fill="#94A3B8" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">=</text>
      <rect x="180" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="226" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">2/4</text>
      <text x="290" y="132" fill="#94A3B8" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">=</text>
      <rect x="312" y="108" width="92" height="34" rx="10" fill="#8B5CF622" stroke="#8B5CF6"/><text x="358" y="131" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">4/8</text>
      <text x="50" y="188" fill="#F59E0B" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">12/18 ÷ 6 = 2/3</text>
      <SvgTextBlock text="Multiply or divide the numerator and denominator by the same number to keep the value unchanged." x={50} y={214} maxChars={40} maxLines={2} fill="#E2E8F0" size={13} weight={700}/>
    </> : title.includes("add") || title.includes("subtract") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Add and Subtract Fractions</text>
      <rect x="50" y="110" width="180" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="50" y="110" width="45" height="28" rx="10" fill="#8B5CF6"/>
      <rect x="250" y="110" width="180" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="250" y="110" width="90" height="28" rx="10" fill="#A78BFA"/>
      <text x="140" y="92" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">1/4</text>
      <text x="240" y="128" textAnchor="middle" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">+</text>
      <text x="340" y="92" textAnchor="middle" fill="#F8FAFC" fontSize="18" fontWeight="900" fontFamily="'Baloo 2'">2/4</text>
      <text x="500" y="128" fill="#22C55E" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">= 3/4</text>
      <SvgTextBlock text="If denominators match, add only the numerators. If they differ, make equivalent fractions first." x={50} y={192} maxChars={42} maxLines={3} fill="#E2E8F0" size={13} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Proper and Improper Fractions</text>
      <text x="74" y="100" fill="#8B5CF6" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Proper 3/5</text>
      <rect x="54" y="116" width="160" height="28" rx="10" fill="#1E293B" stroke="#8B5CF6"/><rect x="54" y="116" width="96" height="28" rx="10" fill="#8B5CF6"/>
      <text x="332" y="100" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Improper 7/5</text>
      <rect x="268" y="116" width="160" height="28" rx="10" fill="#1E293B" stroke="#F59E0B"/><rect x="268" y="116" width="160" height="28" rx="10" fill="#F59E0B"/>
      <rect x="438" y="116" width="60" height="28" rx="10" fill="#F59E0B"/>
      <SvgTextBlock text="Numerator smaller than denominator → proper. Numerator equal to or greater than denominator → improper." x={54} y={188} maxChars={44} maxLines={3} fill="#E2E8F0" size={13} weight={700}/>
    </>}
  </svg></div>);
}

function MathDecimalsToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    {title.includes("fractions") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Fractions and Decimals</text>
      <text x="62" y="130" fill="#F8FAFC" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">3/4 = 0.75</text>
      <text x="62" y="170" fill="#94A3B8" fontSize="16" fontWeight="700" fontFamily="'Baloo 2'">divide 3 by 4</text>
      <rect x="342" y="94" width="220" height="116" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      <text x="452" y="126" textAnchor="middle" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Place Value</text>
      <text x="452" y="158" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">0 . 7 5</text>
      <text x="452" y="186" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">7 tenths, 5 hundredths</text>
    </> : title.includes("add") || title.includes("subtract") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Add and Subtract Decimals</text>
      <text x="144" y="126" textAnchor="end" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">12.30</text>
      <text x="144" y="156" textAnchor="end" fill="#22C55E" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">+ 4.75</text>
      <line x1="68" y1="166" x2="150" y2="166" stroke="#F59E0B" strokeWidth="3"/>
      <text x="144" y="198" textAnchor="end" fill="#38BDF8" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">17.05</text>
      <SvgTextBlock text="Keep decimal points in one straight line and add zeros if places are missing." x={220} y={136} maxChars={28} maxLines={3} fill="#E2E8F0" size={14} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Decimal Place Value</text>
      <rect x="52" y="96" width="508" height="82" rx="16" fill="#1E293B" stroke="#38BDF8"/>
      {["Ones","Tenths","Hundredths","Thousandths"].map((label,i)=><g key={label}><line x1={52+i*127} y1="96" x2={52+i*127} y2="178" stroke="#334155"/><text x={115+i*127} y="122" textAnchor="middle" fill="#38BDF8" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">{label}</text></g>)}
      <text x="115" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3</text>
      <text x="242" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">4</text>
      <text x="369" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">8</text>
      <text x="496" y="156" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2</text>
      <text x="177" y="156" textAnchor="middle" fill="#F59E0B" fontSize="28" fontWeight="900" fontFamily="'Baloo 2'">.</text>
    </>}
  </svg></div>);
}

function MathRatioPercentToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  return (<div className="math-svg"><svg viewBox="0 0 640 260" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="260" rx="20" fill="#0F172A"/>
    {title.includes("ratio to fraction") ? <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Ratio to Fraction</text>
      <rect x="56" y="104" width="72" height="52" rx="14" fill="#EC489922"/><text x="92" y="138" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2</text>
      <text x="144" y="138" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">:</text>
      <rect x="164" y="104" width="72" height="52" rx="14" fill="#EC489922"/><text x="200" y="138" textAnchor="middle" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3</text>
      <text x="280" y="138" fill="#94A3B8" fontSize="26" fontWeight="900" fontFamily="'Baloo 2'">→</text>
      <text x="332" y="138" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2/5 and 3/5</text>
      <SvgTextBlock text="Add parts first: 2 + 3 = 5. Then write each part over the total." x={58} y={196} maxChars={42} maxLines={2} fill="#E2E8F0" size={13} weight={700}/>
    </> : <>
      <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Percent as Part of 100</text>
      {Array.from({length:20}).map((_,i)=> { const x = 58 + (i%10)*20; const y = 106 + Math.floor(i/10)*20; return <rect key={i} x={x} y={y} width="18" height="18" fill="#EC4899" stroke="#0F172A"/>; })}
      {Array.from({length:80}).map((_,i)=> { const x = 58 + ((i+20)%10)*20; const y = 106 + Math.floor((i+20)/10)*20; return <rect key={"w"+i} x={x} y={y} width="18" height="18" fill="#1E293B" stroke="#334155"/>; })}
      <text x="300" y="150" fill="#F8FAFC" fontSize="30" fontWeight="900" fontFamily="'Baloo 2'">20%</text>
      <SvgTextBlock text="Shade 20 out of 100 boxes. 25% = one quarter, 50% = one half, 75% = three quarters." x={372} y={126} maxChars={24} maxLines={4} fill="#E2E8F0" size={13} weight={700}/>
    </>}
  </svg></div>);
}

function MathLinesAnglesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Lines and Angles</text>
    <rect x="34" y="88" width="250" height="146" rx="16" fill="#1E293B" stroke="#38BDF8"/>
    <text x="52" y="112" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Line, Ray, Segment</text>
    <line x1="64" y1="138" x2="246" y2="138" stroke="#F8FAFC" strokeWidth="4"/><polygon points="64,138 74,132 74,144" fill="#F8FAFC"/><polygon points="246,138 236,132 236,144" fill="#F8FAFC"/>
    <text x="52" y="156" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Line goes on in both directions</text>
    <circle cx="68" cy="188" r="6" fill="#22C55E"/><line x1="68" y1="188" x2="246" y2="188" stroke="#F8FAFC" strokeWidth="4"/><polygon points="246,188 236,182 236,194" fill="#F8FAFC"/>
    <text x="52" y="208" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Ray has one endpoint</text>
    <circle cx="68" cy="224" r="6" fill="#F59E0B"/><circle cx="246" cy="224" r="6" fill="#F59E0B"/><line x1="68" y1="224" x2="246" y2="224" stroke="#F8FAFC" strokeWidth="4"/>
    <text x="52" y="244" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Segment has two endpoints</text>
    <rect x="306" y="88" width="300" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="326" y="112" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Classify the Angles</text>
    <line x1="346" y1="192" x2="346" y2="136" stroke="#F8FAFC" strokeWidth="4"/><line x1="346" y1="192" x2="402" y2="192" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M346 176 A16 16 0 0 1 362 192" fill="none" stroke="#22C55E" strokeWidth="3"/><text x="372" y="170" fill="#22C55E" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">90° Right</text>
    <line x1="456" y1="192" x2="456" y2="136" stroke="#F8FAFC" strokeWidth="4"/><line x1="456" y1="192" x2="508" y2="154" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M456 174 A22 22 0 0 1 478 176" fill="none" stroke="#F59E0B" strokeWidth="3"/><text x="500" y="144" fill="#F59E0B" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Acute &lt; 90°</text>
    <line x1="346" y1="234" x2="396" y2="234" stroke="#F8FAFC" strokeWidth="4"/><line x1="346" y1="234" x2="316" y2="194" stroke="#F8FAFC" strokeWidth="4"/>
    <path d="M332 214 A26 26 0 0 0 372 232" fill="none" stroke="#A855F7" strokeWidth="3"/><text x="404" y="236" fill="#A855F7" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Obtuse &gt; 90°</text>
    <line x1="456" y1="234" x2="522" y2="234" stroke="#F8FAFC" strokeWidth="4"/><line x1="456" y1="234" x2="390" y2="234" stroke="#F8FAFC" strokeWidth="4"/>
    <text x="464" y="220" fill="#38BDF8" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">180° Straight</text>
  </svg></div>);
}

function MathParallelPerpendicularToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Parallel and Perpendicular</text>
    <rect x="34" y="88" width="266" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="54" y="112" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Parallel Lines</text>
    <line x1="74" y1="142" x2="254" y2="142" stroke="#F8FAFC" strokeWidth="5"/><line x1="74" y1="178" x2="254" y2="178" stroke="#F8FAFC" strokeWidth="5"/>
    <line x1="96" y1="130" x2="96" y2="192" stroke="#F59E0B" strokeWidth="2"/><line x1="232" y1="130" x2="232" y2="192" stroke="#F59E0B" strokeWidth="2"/>
    <text x="54" y="214" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Same distance apart like train tracks</text>
    <text x="54" y="234" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Symbol: ||</text>
    <rect x="322" y="88" width="284" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <text x="342" y="112" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Perpendicular Lines</text>
    <line x1="462" y1="132" x2="462" y2="220" stroke="#F8FAFC" strokeWidth="5"/><line x1="396" y1="176" x2="528" y2="176" stroke="#F8FAFC" strokeWidth="5"/>
    <rect x="462" y="160" width="20" height="20" fill="none" stroke="#38BDF8" strokeWidth="3"/>
    <text x="342" y="206" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Meet to form a right angle of 90°</text>
    <text x="342" y="226" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Symbol: ⊥</text>
  </svg></div>);
}

function Math2DShapesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">2D Shapes</text>
    <rect x="34" y="88" width="572" height="146" rx="16" fill="#1E293B" stroke="#8B5CF6"/>
    <rect x="68" y="128" width="54" height="54" fill="#8B5CF622" stroke="#C4B5FD" strokeWidth="3"/><text x="95" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Square</text>
    <rect x="156" y="136" width="76" height="42" fill="#38BDF822" stroke="#38BDF8" strokeWidth="3"/><text x="194" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Rectangle</text>
    <polygon points="288,182 250,128 326,128" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="3"/><text x="288" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Triangle</text>
    <circle cx="390" cy="156" r="28" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/><text x="390" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Circle</text>
    <polygon points="470,182 444,162 454,130 486,130 496,162" fill="#EC489922" stroke="#EC4899" strokeWidth="3"/><text x="470" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Pentagon</text>
    <polygon points="554,182 530,168 530,142 554,128 578,142 578,168" fill="#FACC1522" stroke="#FACC15" strokeWidth="3"/><text x="554" y="204" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Hexagon</text>
    <text x="52" y="112" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Flat shapes have length and width. Count sides, corners, and equal sides.</text>
  </svg></div>);
}

function Math3DShapesToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">3D Shapes</text>
    <rect x="34" y="88" width="572" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <g transform="translate(70 112)">
      <rect x="0" y="18" width="54" height="54" fill="none" stroke="#38BDF8" strokeWidth="3"/><rect x="18" y="0" width="54" height="54" fill="none" stroke="#38BDF8" strokeWidth="3"/><line x1="0" y1="18" x2="18" y2="0" stroke="#38BDF8" strokeWidth="3"/><line x1="54" y1="18" x2="72" y2="0" stroke="#38BDF8" strokeWidth="3"/><line x1="54" y1="72" x2="72" y2="54" stroke="#38BDF8" strokeWidth="3"/><line x1="0" y1="72" x2="18" y2="54" stroke="#38BDF8" strokeWidth="3"/>
      <text x="36" y="96" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cube</text>
    </g>
    <g transform="translate(206 110)">
      <ellipse cx="36" cy="12" rx="30" ry="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/><line x1="6" y1="12" x2="6" y2="72" stroke="#22C55E" strokeWidth="3"/><line x1="66" y1="12" x2="66" y2="72" stroke="#22C55E" strokeWidth="3"/><ellipse cx="36" cy="72" rx="30" ry="12" fill="#22C55E22" stroke="#22C55E" strokeWidth="3"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cylinder</text>
    </g>
    <g transform="translate(338 110)">
      <ellipse cx="36" cy="74" rx="32" ry="12" fill="#A855F722" stroke="#A855F7" strokeWidth="3"/><line x1="4" y1="74" x2="36" y2="8" stroke="#A855F7" strokeWidth="3"/><line x1="68" y1="74" x2="36" y2="8" stroke="#A855F7" strokeWidth="3"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Cone</text>
    </g>
    <g transform="translate(470 110)">
      <circle cx="36" cy="42" r="34" fill="#F59E0B22" stroke="#F59E0B" strokeWidth="3"/><ellipse cx="36" cy="42" rx="34" ry="12" fill="none" stroke="#FDE68A" strokeWidth="2"/>
      <text x="36" y="102" textAnchor="middle" fill="#F8FAFC" fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Sphere</text>
    </g>
    <text x="52" y="112" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">3D shapes have length, width, and height. Count faces, edges, and vertices.</text>
  </svg></div>);
}

function MathGeometryToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  if (title.includes("parallel") || title.includes("perpendicular")) return <MathParallelPerpendicularToolkitSVG />;
  if (title.includes("2d")) return <Math2DShapesToolkitSVG />;
  if (title.includes("3d")) return <Math3DShapesToolkitSVG />;
  return <MathLinesAnglesToolkitSVG />;
}

function MathBarGraphToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Bar Graphs</text>
    <line x1="86" y1="210" x2="292" y2="210" stroke="#F8FAFC" strokeWidth="4"/><line x1="86" y1="210" x2="86" y2="98" stroke="#F8FAFC" strokeWidth="4"/>
    {[0,10,20,30].map((n, i) => <g key={n}><line x1="78" y1={210 - i*34} x2="94" y2={210 - i*34} stroke="#94A3B8" strokeWidth="2"/><text x="64" y={214 - i*34} textAnchor="end" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">{n}</text></g>)}
    <rect x="114" y="142" width="34" height="68" rx="6" fill="#F59E0B"/><rect x="170" y="108" width="34" height="102" rx="6" fill="#22C55E"/><rect x="226" y="74" width="34" height="136" rx="6" fill="#A855F7"/>
    <text x="131" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Apple</text><text x="187" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Banana</text><text x="243" y="230" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">Mango</text>
    <rect x="330" y="88" width="276" height="146" rx="16" fill="#1E293B" stroke="#38BDF8"/>
    <text x="350" y="114" fill="#38BDF8" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">How to Read</text>
    <text x="350" y="146" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Read the title and both axes.</text>
    <text x="350" y="172" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Check the scale: 0, 10, 20, 30.</text>
    <text x="350" y="198" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Compare bar heights to find most or least.</text>
    <text x="350" y="224" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Equal-width bars with equal spacing make the graph fair.</text>
  </svg></div>);
}

function MathPictographToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Pictographs</text>
    <rect x="34" y="88" width="262" height="146" rx="16" fill="#1E293B" stroke="#22C55E"/>
    <text x="54" y="114" fill="#22C55E" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Key</text>
    <text x="54" y="142" fill="#F8FAFC" fontSize="20" fontWeight="900" fontFamily="'Baloo 2'">★ = 4 students</text>
    <text x="54" y="178" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Blue  ★ ★ ★  = 12</text>
    <text x="54" y="204" fill="#F8FAFC" fontSize="16" fontWeight="800" fontFamily="'Baloo 2'">Red   ★ ★    = 8</text>
    <text x="54" y="228" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Half a symbol means half the key value.</text>
    <rect x="318" y="88" width="288" height="146" rx="16" fill="#1E293B" stroke="#86EFAC"/>
    <text x="338" y="114" fill="#86EFAC" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">How to Solve</text>
    <text x="338" y="146" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">1. Read one picture from the key.</text>
    <text x="338" y="172" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">2. Count pictures in each row.</text>
    <text x="338" y="198" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">3. Multiply count by key value.</text>
    <text x="338" y="224" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Example: 3 stars means 3 × 4 = 12 students.</text>
  </svg></div>);
}

function MathLineGraphToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Line Graphs</text>
    <line x1="86" y1="212" x2="300" y2="212" stroke="#F8FAFC" strokeWidth="4"/><line x1="86" y1="212" x2="86" y2="96" stroke="#F8FAFC" strokeWidth="4"/>
    <polyline points="110,188 154,170 198,136 242,150 286,116" fill="none" stroke="#A855F7" strokeWidth="4"/>
    {[["Mon",110,188],["Tue",154,170],["Wed",198,136],["Thu",242,150],["Fri",286,116]].map(([d,x,y]) => <g key={d}><circle cx={x} cy={y} r="6" fill="#F59E0B"/><text x={x} y="232" textAnchor="middle" fill="#F8FAFC" fontSize="12" fontWeight="800" fontFamily="'Baloo 2'">{d}</text></g>)}
    <text x="330" y="112" fill="#A855F7" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Trend Reading</text>
    <rect x="330" y="126" width="276" height="108" rx="16" fill="#1E293B" stroke="#A855F7"/>
    <text x="350" y="154" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Line rising upward = increase</text>
    <text x="350" y="180" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Line falling downward = decrease</text>
    <text x="350" y="206" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Flat line = no change</text>
    <text x="350" y="228" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Steeper slope means faster change.</text>
  </svg></div>);
}

function MathDataInterpretationToolkitSVG() {
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">Interpreting Data</text>
    <rect x="34" y="88" width="248" height="146" rx="16" fill="#1E293B" stroke="#F59E0B"/>
    <text x="54" y="114" fill="#F59E0B" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Sample Table</text>
    <text x="54" y="142" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Apples   30</text>
    <text x="54" y="168" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Bananas  45</text>
    <text x="54" y="194" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Oranges  20</text>
    <text x="54" y="220" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Grapes   35</text>
    <rect x="304" y="88" width="302" height="146" rx="16" fill="#1E293B" stroke="#FDE68A"/>
    <text x="324" y="114" fill="#FDE68A" fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Question Checks</text>
    <text x="324" y="144" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Highest: 45 bananas</text>
    <text x="324" y="170" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Lowest: 20 oranges</text>
    <text x="324" y="196" fill="#F8FAFC" fontSize="14" fontWeight="800" fontFamily="'Baloo 2'">Range: 45 - 20 = 25</text>
    <text x="324" y="222" fill="#94A3B8" fontSize="13" fontWeight="700" fontFamily="'Baloo 2'">Always read title, labels, total, difference, and trend.</text>
  </svg></div>);
}

function MathDataHandlingToolkitSVG({ sub }) {
  const title = (sub?.t || "").toLowerCase();
  if (title.includes("pictograph")) return <MathPictographToolkitSVG />;
  if (title.includes("line")) return <MathLineGraphToolkitSVG />;
  if (title.includes("interpreting")) return <MathDataInterpretationToolkitSVG />;
  return <MathBarGraphToolkitSVG />;
}

function MathTextbookStarterSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const examples = getMathWorkedExamples(sub).slice(0, 2);
  const rule = getMathQuickRule(sub, lessonTitle);
  const steps = getMathSolveSteps(sub, lessonTitle).slice(0, 3);
  return (<div className="math-svg"><svg viewBox="0 0 640 270" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="270" rx="20" fill="#0F172A"/>
    <text x="34" y="66" fill="#F8FAFC" fontSize="24" fontWeight="900" fontFamily="'Baloo 2'">{clipSvgText(sub?.t || "Math Method", 24)}</text>
    <rect x="32" y="86" width="242" height="152" rx="18" fill={theme.soft} opacity="0.18" stroke={theme.accent} strokeWidth="1.4"/>
    <text x="52" y="112" fill={theme.accent} fontSize="15" fontWeight="800" fontFamily="'Baloo 2'">Worked Pattern</text>
    <SvgTextBlock text={examples[0] || rule} x={52} y={138} maxChars={24} maxLines={3} lineHeight={18} fill="#F8FAFC" size={14} weight={700}/>
    <line x1="52" y1="178" x2="254" y2="178" stroke="#334155" strokeWidth="1.5"/>
    <SvgTextBlock text={examples[1] || "Check the same pattern with another example."} x={52} y={202} maxChars={24} maxLines={3} lineHeight={18} fill="#CBD5E1" size={13} weight={600}/>
    <rect x="292" y="86" width="316" height="58" rx="18" fill={theme.accent} opacity="0.16" stroke={theme.accent} strokeWidth="1.4"/>
    <text x="314" y="112" fill={theme.chip} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Rule to Remember</text>
    <SvgTextBlock text={rule} x={314} y={134} maxChars={31} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700}/>
    {steps.map((step, idx) => {
      const y = 170 + idx * 28;
      return <g key={idx}>
        <circle cx="314" cy={y - 4} r="10" fill={theme.accent}/>
        <text x="314" y={y} textAnchor="middle" fill="#082F49" fontSize="12" fontWeight="900" fontFamily="'Baloo 2'">{idx + 1}</text>
        <SvgTextBlock text={step} x={334} y={y} maxChars={31} maxLines={1} lineHeight={16} fill="#E2E8F0" size={13} weight={700}/>
      </g>;
    })}
  </svg></div>);
}

function renderMathTextbookPrimarySVG(sub, lessonTitle) {
  const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
  const subTitle = (sub?.t || "").toLowerCase();
  const content = (sub?.c || "").toLowerCase();
  if ((lessonTitle || "").toLowerCase().includes("geometry")) return <MathGeometryToolkitSVG sub={sub} />;
  if ((lessonTitle || "").toLowerCase().includes("data handling")) return <MathDataHandlingToolkitSVG sub={sub} />;
  if (subTitle === "long division") return <MathLongDivisionWorkedSVG />;
  if (subTitle === "word problems") return <MathWordProblemStrategySVG sub={sub} lessonTitle={lessonTitle} />;
  if (subTitle === "large multiplication") return <MathMultiplicationMethodSVG />;
  if (/word problem|story problem|problem solving/.test(title) || /shared equally|each|perimeter|area|volume|altogether|left/.test(content)) return <MathWordProblemStrategySVG sub={sub} lessonTitle={lessonTitle} />;
  if (/division|divide|quotient|remainder/.test(subTitle)) return <MathLongDivisionWorkedSVG />;
  if (/multiplication|multiply|times/.test(subTitle)) return <MathMultiplicationMethodSVG />;
  if (/prime|composite|factor|multiple|hcf|lcm/.test(subTitle)) return <MathFactorsToolkitSVG sub={sub} />;
  if (/fraction|numerator|denominator|mixed number|equivalent/.test(subTitle)) return <MathFractionsToolkitSVG sub={sub} />;
  if (/decimal/.test(subTitle)) return <MathDecimalsToolkitSVG sub={sub} />;
  if (/ratio|percent|percentage/.test(subTitle)) return <MathRatioPercentToolkitSVG sub={sub} />;
  return <MathTextbookStarterSVG sub={sub} lessonTitle={lessonTitle} />;
}

function MathMethodStepsSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const steps = getMathSolveSteps(sub, lessonTitle);
  return (<div className="math-svg"><svg viewBox="0 0 640 300" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="300" rx="20" fill="#0F172A"/>
    <text x="36" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Method Path</text>
    {steps.map((step, idx) => {
      const y = 64 + idx * 56;
      return <g key={idx}>
        {idx < steps.length - 1 && <line x1="78" y1={y + 40} x2="78" y2={y + 60} stroke={theme.chip} strokeWidth="4" strokeLinecap="round" opacity="0.8"/>}
        <circle cx="78" cy={y + 20} r="18" fill={theme.accent}/>
        <text x="78" y={y + 26} textAnchor="middle" fill="#082F49" fontSize="16" fontWeight="900" fontFamily="'Baloo 2'">{idx + 1}</text>
        <rect x="112" y={y} width="486" height="40" rx="14" fill={theme.soft} opacity="0.18" stroke={theme.accent} strokeWidth="1.3"/>
        <SvgTextBlock text={step} x={132} y={y + 24} maxChars={50} maxLines={2} lineHeight={15} fill="#E2E8F0" size={13} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathWorkedExamplesSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const samples = getMathWorkedExamples(sub);
  return (<div className="math-svg"><svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="280" rx="20" fill="#0F172A"/>
    <text x="34" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Worked Examples</text>
    {samples.map((sample, idx) => {
      const y = 58 + idx * 68;
      return <g key={idx}>
        <rect x="28" y={y} width="584" height="52" rx="16" fill={theme.soft} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
        <rect x="42" y={y + 10} width="78" height="30" rx="12" fill={theme.accent}/>
        <text x="81" y={y + 30} textAnchor="middle" fill="#082F49" fontSize="13" fontWeight="900" fontFamily="'Baloo 2'">Example {idx + 1}</text>
        <SvgTextBlock text={sample} x={136} y={y + 22} maxChars={49} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathPracticePlanSVG({ sub, lessonTitle }) {
  const theme = getMathVisualTheme(sub, lessonTitle);
  const problem = clipSvgText(getMathPracticeExample(sub), 180);
  const checks = ["Underline the numbers.", "Pick the rule or operation.", "Solve neatly step by step.", "Check the answer against the story."];
  return (<div className="math-svg"><svg viewBox="0 0 640 280" xmlns="http://www.w3.org/2000/svg">
    <rect width="640" height="280" rx="20" fill="#0F172A"/>
    <text x="34" y="40" fill={theme.accent} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Problem Plan</text>
    <rect x="28" y="58" width="270" height="194" rx="18" fill={theme.soft} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
    <text x="46" y="86" fill="#F8FAFC" fontSize="18" fontWeight="800" fontFamily="'Baloo 2'">Try This Question</text>
    <SvgTextBlock text={problem} x={46} y={110} maxChars={28} maxLines={6} lineHeight={18} fill="#E2E8F0" size={14} weight={600} />
    <rect x="316" y="58" width="296" height="82" rx="18" fill={theme.accent} opacity="0.16" stroke={theme.accent} strokeWidth="1.2"/>
    <text x="336" y="84" fill={theme.chip} fontSize="13" fontWeight="800" fontFamily="'Baloo 2'">Quick Rule</text>
    <SvgTextBlock text={getMathQuickRule(sub, lessonTitle)} x={336} y={106} maxChars={30} maxLines={2} lineHeight={17} fill="#F8FAFC" size={14} weight={700} />
    {checks.map((item, idx) => {
      const y = 162 + idx * 28;
      return <g key={idx}>
        <rect x="334" y={y - 13} width="18" height="18" rx="4" fill={theme.soft} opacity="0.26" stroke={theme.chip} strokeWidth="1.1"/>
        <SvgTextBlock text={item} x={364} y={y} maxChars={28} maxLines={1} lineHeight={16} fill="#E2E8F0" size={13} weight={700} />
      </g>;
    })}
  </svg></div>);
}

function MathVisualDeck({ sub, lessonTitle }) {
  const primary = renderMathPrimaryVisual(sub);
  const cards = primary
    ? [
        { label: "Core Model", content: primary },
        { label: "Solve Steps", content: <MathMethodStepsSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Worked Examples", content: <MathWorkedExamplesSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Problem Practice", content: <MathPracticePlanSVG sub={sub} lessonTitle={lessonTitle} /> }
      ]
    : [
        { label: "Textbook Model", content: renderMathTextbookPrimarySVG(sub, lessonTitle) },
        { label: "Solve Steps", content: <MathMethodStepsSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Worked Examples", content: <MathWorkedExamplesSVG sub={sub} lessonTitle={lessonTitle} /> },
        { label: "Problem Practice", content: <MathPracticePlanSVG sub={sub} lessonTitle={lessonTitle} /> }
      ];
  return (
    <div className="math-visual-stack">
      {cards.map((card, idx) => (
        <div key={idx} className="math-visual-panel">
          <div className="math-visual-label">{card.label}</div>
          {card.content}
        </div>
      ))}
    </div>
  );
}

// ─── Math Sub-Quiz Component (proper hooks) ───
function MathSubQuiz({ questions, isUrdu }) {
  const [mqIdx, setMqIdx] = useState(0);
  const [mqAns, setMqAns] = useState([]);
  const [mqRev, setMqRev] = useState(false);
  const [mqDone, setMqDone] = useState(false);
  const mq = questions;
  const currentQ = mq[mqIdx] || {};
  const questionIsUrdu = isUrdu || isUrduText(currentQ.q);
  const mqScore = mqDone ? mqAns.reduce((a,v,i) => a + (v === mq[i]?.c ? 1 : 0), 0) : 0;
  const reset = () => { setMqIdx(0); setMqAns([]); setMqRev(false); setMqDone(false); };
  const speakText = (txt, e) => {
    if (e) e.stopPropagation();
    if (!isTtsEnabled()) return;
    const ur = isUrduText(txt);
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(ttsClean(txt));
    const speechConfig = getSpeechConfig(ur ? "ur" : "en", window.speechSynthesis.getVoices());
    u.lang = speechConfig.lang;
    u.rate = speechConfig.rate;
    if (speechConfig.voice) u.voice = speechConfig.voice;
    window.speechSynthesis.speak(u);
  };
  const playSound = (correct) => { try { const ac = new (window.AudioContext||window.webkitAudioContext)(); const osc = ac.createOscillator(); const gain = ac.createGain(); osc.connect(gain); gain.connect(ac.destination); gain.gain.value = 0.15; if(correct){ osc.frequency.value=523; osc.start(); osc.frequency.setValueAtTime(659,ac.currentTime+0.1); osc.frequency.setValueAtTime(784,ac.currentTime+0.2); osc.stop(ac.currentTime+0.35); } else { osc.frequency.value=330; osc.type="square"; osc.start(); osc.frequency.setValueAtTime(277,ac.currentTime+0.15); osc.stop(ac.currentTime+0.3); } } catch(e){} };

  if (mqDone) return (
    <div className="quiz-result">
      <div className="result-emoji">{mqScore >= mq.length - 1 ? "🏆" : mqScore >= mq.length / 2 ? "🌟" : "💪"}</div>
      <h2>{mqScore}/{mq.length} Correct!</h2>
      <p style={{color:"var(--text-secondary)",marginBottom:16,fontFamily:isUrdu?"'Noto Nastaliq Urdu',serif":"inherit",direction:isUrdu?"rtl":"ltr"}}>{mqScore >= mq.length - 1 ? (isUrdu?"شاباش! آپ نے یہ موضوع سیکھ لیا!":"Excellent! You mastered this topic!") : mqScore >= mq.length / 2 ? (isUrdu?"اچھا! غلط جوابات دوبارہ دیکھیں۔":"Good job! Review the ones you missed.") : (isUrdu?"مشق جاری رکھیں!":"Keep practicing! You'll get better.")}</p>
      <button className="start-quiz-btn" style={isUrdu?{fontFamily:"'Noto Nastaliq Urdu',serif"}:{}} onClick={reset}>{isUrdu?"🔄 دوبارہ کوشش":"🔄 Retry Quiz"}</button>
    </div>
  );

  return (
    <div className="quiz-container" style={questionIsUrdu?{direction:"rtl"}:{}}>
      <div className="quiz-progress">{mq.map((_, i) => <div key={i} className={"qp-dot" + (i < mqIdx ? " done" : i === mqIdx ? " current" : "")} />)}</div>
      <div className="quiz-question" onClick={()=>speakText(currentQ.q)} style={{cursor:"pointer",direction:questionIsUrdu?"rtl":"ltr",fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit",textAlign:questionIsUrdu?"right":"left"}}>
        <div className="q-num" style={{textAlign:questionIsUrdu?"right":"left",marginBottom:8,fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit"}}>{questionIsUrdu?("سوال "+(mqIdx+1)+" از "+mq.length):("Q "+(mqIdx+1)+" of "+mq.length)} <span style={{fontSize:14,opacity:0.5,marginLeft:6}}>🔈</span></div>
        <h3 style={{marginTop:4,fontFamily:questionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit"}}>{currentQ.q}</h3>
      </div>
      <div className="quiz-options" style={questionIsUrdu?{direction:"rtl"}:{}}>{currentQ.a.map((opt, oi) => {
        const optionIsUrdu = isUrdu || isUrduText(opt);
        const sel = mqAns[mqIdx] === oi, cor = oi === mq[mqIdx].c;
        let cls = "quiz-option";
        if (mqRev && cor) cls += " correct";
        else if (mqRev && sel && !cor) cls += " wrong";
        else if (sel) cls += " selected";
        return (<button key={oi} className={cls} disabled={mqRev} style={optionIsUrdu?{direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}} onClick={() => {
          if (mqRev) return;
          const na = [...mqAns]; na[mqIdx] = oi; setMqAns(na); setMqRev(true);
          playSound(oi === mq[mqIdx].c);
          setTimeout(() => { if (mqIdx < mq.length - 1) { setMqIdx(mqIdx + 1); setMqRev(false); } else setMqDone(true); }, 1200);
        }}><span className="opt-letter">{"ABCD"[oi]}</span><span style={{flex:1,fontFamily:optionIsUrdu?"'Noto Nastaliq Urdu',serif":"inherit",direction:optionIsUrdu?"rtl":"ltr",textAlign:optionIsUrdu?"right":"left"}}>{opt}</span><span style={{fontSize:13,opacity:0.4,marginLeft:6}} onClick={(e)=>speakText(opt,e)}>🔈</span></button>);
      })}</div>
    </div>
  );
}

// ─── TTS Text Cleaner — fixes number reading ───
// ─── Number to Words converter ───
function numToWords(n) {
  if (n === 0) return "zero";
  const ones = ["","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const tens = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  const scales = ["","thousand","million","billion","trillion"];
  if (n < 0) return "negative " + numToWords(-n);
  let words = "";
  let scaleIdx = 0;
  while (n > 0) {
    const chunk = n % 1000;
    if (chunk !== 0) {
      let cw = "";
      const h = Math.floor(chunk / 100), r = chunk % 100;
      if (h > 0) cw += ones[h] + " hundred ";
      if (r > 0) { if (h > 0) cw += "and "; if (r < 20) cw += ones[r]; else cw += tens[Math.floor(r/10)] + (r%10 ? " " + ones[r%10] : ""); }
      words = cw.trim() + (scales[scaleIdx] ? " " + scales[scaleIdx] : "") + (words ? " " : "") + words;
    }
    n = Math.floor(n / 1000);
    scaleIdx++;
  }
  return words.trim();
}

function ttsClean(text) {
  const source = String(text || "");
  const normalized = /[\u0600-\u06FF]/.test(source)
    ? source.replace(/\s*\/\s*/g, ' ')
    : source;
  return normalized
    .replace(/\[(\d+)\]/g, '$1')
    .replace(/₹|Rs\.?\s*/g, 'Rupees ')
    .replace(/→/g, ' to ')
    .replace(/\s=\s(?=_{3,}|\[\s*\]|\s*$)/g, ' ')
    .replace(/(\d)\s*>\s*(\d)/g, '$1 greater than $2')
    .replace(/(\d)\s*<\s*(\d)/g, '$1 less than $2')
    .replace(/___\s*>\s*/g, ' is greater than ')
    .replace(/___\s*<\s*/g, ' is less than ')
    .replace(/_{3,}/g, ' ')
    .replace(/\b>\b/g, ' greater than ')
    .replace(/[≈≥≤]/g, m => m==='≈'?' approximately ':m==='≥'?' greater than or equal to ':' less than or equal to ')
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/←/g, ' left ')
    .replace(/↑/g, ' up ')
    .replace(/↓/g, ' down ')
    // Convert numbers with commas or 4+ digits to words
    .replace(/\d{1,3}(,\d{3})+/g, m => numToWords(parseInt(m.replace(/,/g,""))))
    .replace(/\b\d{4,}\b/g, m => numToWords(parseInt(m)))
    .replace(/\s+/g, ' ').trim();
}

function normalizeHighlightTerm(value) {
  if (value == null) return "";
  return String(value)
    .replace(/\([^)]*\)/g, " ")
    .replace(/[=:_]/g, " ")
    .trim()
    .toLowerCase();
}

function isAsciiLetter(char) {
  return /^[A-Za-z]$/.test(char || "");
}

function getSingleWordHighlightBase(term) {
  const cleaned = normalizeHighlightTerm(term);
  return /^[a-z]+$/.test(cleaned) ? cleaned : "";
}

function buildWordFamilyForms(term) {
  const base = getSingleWordHighlightBase(term);
  const forms = new Set(base ? [base] : []);
  if (!base || base.length < 4) return forms;
  forms.add(base + "s");
  forms.add(base + "es");
  if (base.endsWith("y") && !/[aeiou]y$/.test(base)) forms.add(base.slice(0, -1) + "ies");
  if (base.endsWith("e")) {
    forms.add(base + "d");
    forms.add(base.slice(0, -1) + "ing");
  } else {
    forms.add(base + "ed");
    forms.add(base + "ing");
  }
  if (base.endsWith("c")) {
    forms.add(base + "ked");
    forms.add(base + "king");
  }
  if (/[aeiou][bcdfghjklmnpqrstvwxyz]$/.test(base) && !/[wxy]$/.test(base)) {
    const last = base.slice(-1);
    forms.add(base + last + "ed");
    forms.add(base + last + "ing");
  }
  return forms;
}

function buildHighlightTerms(highlight) {
  const source = Array.isArray(highlight) ? highlight : [highlight];
  return [...new Set(source.map(normalizeHighlightTerm).filter(Boolean))].sort((a, b) => b.length - a.length);
}

function renderHighlightText(text, highlight, keyPrefix = "hl") {
  const terms = buildHighlightTerms(highlight);
  if (!terms.length) return text;
  const lower = String(text).toLowerCase();
  const matches = [];
  terms.forEach(term => {
    let from = 0;
    while (from < lower.length) {
      const idx = lower.indexOf(term, from);
      if (idx === -1) break;
      const before = idx === 0 ? "" : text[idx - 1];
      const after = idx + term.length >= text.length ? "" : text[idx + term.length];
      const needsBoundary = /^[a-z ]+$/.test(term);
      if (!needsBoundary || (!isAsciiLetter(before) && !isAsciiLetter(after))) {
        matches.push({ start: idx, end: idx + term.length });
      }
      from = idx + term.length;
    }
  });
  const wordMatcher = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
  let wordMatch;
  while ((wordMatch = wordMatcher.exec(text)) !== null) {
    const token = wordMatch[0].toLowerCase();
    if (terms.some(term => buildWordFamilyForms(term).has(token))) {
      matches.push({ start: wordMatch.index, end: wordMatch.index + wordMatch[0].length });
    }
  }
  if (!matches.length) return text;
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));
  const merged = [];
  matches.forEach(match => {
    const last = merged[merged.length - 1];
    if (!last || match.start >= last.end) {
      merged.push(match);
    }
  });
  if (!merged.length) return text;
  const parts = [];
  let cursor = 0;
  merged.forEach((match, index) => {
    if (match.start > cursor) parts.push(text.slice(cursor, match.start));
    parts.push(<span key={keyPrefix + "-" + index} style={{ color:"#38BDF8", fontWeight:700 }}>{text.slice(match.start, match.end)}</span>);
    cursor = match.end;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function stripInlineUrduForKnownWords(text, words) {
  const families = (words || []).map(word => buildWordFamilyForms(word.en)).filter(set => set.size > 0);
  if (!families.length) return text;
  return String(text).replace(/([A-Za-z]+(?:'[A-Za-z]+)?)\s*\(([^)]*[\u0600-\u06FF][^)]*)\)/g, (full, englishWord) => {
    const token = englishWord.toLowerCase();
    return families.some(set => set.has(token)) ? englishWord : full;
  });
}

// ─── TTS Clickable Sentence ───
function SpeakableSentence({ text, lang = "en", highlight = null, fullWidth = true, buttonStyle = null, textStyle = null, studyItem = null, showStudyToolbar = true }) {
  const app = useContext(AppContext);
  const studyCard = studyItem ? resolveStudyCard(app, {
    prompt: text,
    answer: studyItem.answer,
    secondaryText: studyItem.secondaryText,
    subject: studyItem.subject,
    section: studyItem.section,
    sectionLabel: studyItem.sectionLabel,
  }) : null;
  const focusProps = getStudyFocusProps(app, studyCard);
  const [speaking, setSpeaking] = useState(false);
  const isLight = isLightUiTheme();
  const handleClick = () => {
    if (!isTtsEnabled()) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(ttsClean(text));
    const speechConfig = getSpeechConfig(lang, window.speechSynthesis.getVoices());
    u.lang = speechConfig.lang;
    u.rate = speechConfig.rate;
    u.pitch = 1.05;
    if (speechConfig.voice) u.voice = speechConfig.voice;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  const renderText = () => {
    let t = text;
    const parts = [];
    let lastIdx = 0;
    const symColors = {'>':'#22C55E','<':'#EF4444','=':'#38BDF8','≥':'#22C55E','≤':'#EF4444','≈':'#A855F7','+':'#F59E0B','×':'#EC4899','÷':'#14B8A6','→':'#38BDF8','←':'#38BDF8','↑':'#22C55E','↓':'#EF4444'};
    // Regex: [X] boxed | digit-symbol-digit math ops | standalone comparison symbols | arrows | blanks
    const re = /\[(\d+)\]|(\d\s*[><=≥≤≈+\-×÷]\s*\d)|([><=≥≤≈])|([→←↑↓])|(___)/g;
    let m;
    while ((m = re.exec(t)) !== null) {
      if (m.index > lastIdx) parts.push(t.slice(lastIdx, m.index));
      if (m[1]) {
        parts.push(<span key={"b"+m.index} style={{display:"inline-block",background:"#F59E0B22",border:"2px solid #F59E0B",borderRadius:6,padding:"0 5px",color:"#F59E0B",fontWeight:800,margin:"0 1px"}}>{m[1]}</span>);
      } else if (m[2]) {
        // digit-symbol-digit: color just the symbol, keep digits normal
        const inner = m[2];
        const si = inner.search(/[><=≥≤≈+\-×÷]/);
        const sym = inner[si];
        const sc = sym==='-'?'#EF4444':(symColors[sym]||'#F59E0B');
        parts.push(inner.slice(0,si));
        parts.push(<span key={"s"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 4px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
        parts.push(inner.slice(si+1));
      } else if (m[3]) {
        const sym = m[3].trim();
        const sc = symColors[sym]||'#F59E0B';
        parts.push(<span key={"c"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 4px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
      } else if (m[4]) {
        const sym = m[4];
        const sc = symColors[sym]||'#38BDF8';
        parts.push(<span key={"a"+m.index} style={{background:sc+"18",borderRadius:4,padding:"0 3px",color:sc,fontWeight:800,margin:"0 2px"}}>{sym}</span>);
      } else if (m[5]) {
        parts.push(<span key={"u"+m.index} style={{display:"inline-block",borderBottom:"3px solid #F59E0B",minWidth:50,margin:"0 4px"}}>&nbsp;&nbsp;&nbsp;&nbsp;</span>);
      }
      lastIdx = m.index + m[0].length;
    }
    if (parts.length > 0) { if (lastIdx < t.length) parts.push(t.slice(lastIdx)); return <>{parts}</>; }
    return renderHighlightText(text, highlight, "sentence");
  };
  const inlineTools = showStudyToolbar && studyCard;
  return (
    <div {...focusProps} className={inlineTools ? "inline-study-row" : ""} style={{ width: fullWidth ? "100%" : "auto", maxWidth: "100%" }}>
      <div style={{ flex: inlineTools && fullWidth ? 1 : "0 1 auto", minWidth: inlineTools ? 0 : "auto", display: inlineTools ? "flex" : "block" }}>
      <button onClick={handleClick} style={{ display: fullWidth ? "block" : "inline-block", width: fullWidth ? "100%" : "auto", maxWidth: "100%", textAlign: lang === "ur" ? "right" : "left", padding: "12px 16px", marginBottom: 0, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid var(--border)", background: speaking ? "rgba(56,189,248,0.12)" : (isLight ? "var(--bg-card)" : "rgba(30,41,59,0.6)"), color: speaking ? "#38BDF8" : "var(--text-primary)", fontFamily: lang === "ur" ? "'Noto Nastaliq Urdu', serif" : "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: lang === "ur" ? "rtl" : "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : (isLight ? "0 10px 24px rgba(15,23,42,0.05)" : "none"), position: "relative", ...buttonStyle }}>
        <span style={{ position: "absolute", right: lang === "ur" ? "auto" : 12, left: lang === "ur" ? 12 : "auto", top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" }}>{speaking ? "🔊" : "🔈"}</span>
        <span style={{ paddingRight: lang === "ur" ? 0 : 28, paddingLeft: lang === "ur" ? 28 : 0, ...textStyle }}>{renderText()}</span>
      </button>
      </div>
      {inlineTools ? <WordCollectionToolbar card={studyCard} compact={true} iconOnly={true} inline={true} showLists={false} /> : null}
    </div>
  );
}

function MixedUrduParagraphSentence({ text, highlight = null, studyItem = null, showStudyToolbar = true }) {
  const app = useContext(AppContext);
  const studyCard = studyItem ? resolveStudyCard(app, {
    prompt: text,
    answer: studyItem.answer,
    secondaryText: studyItem.secondaryText,
    subject: studyItem.subject,
    section: studyItem.section,
    sectionLabel: studyItem.sectionLabel,
  }) : null;
  const focusProps = getStudyFocusProps(app, studyCard);
  const [speaking, setSpeaking] = useState(false);
  const isLight = isLightUiTheme();
  const handleClick = () => {
    if (!isTtsEnabled()) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    const u = new SpeechSynthesisUtterance(ttsClean(text));
    u.lang = "en-US"; u.rate = 0.85; u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };
  const renderHighlighted = (segment, keyBase) => {
    return renderHighlightText(segment, highlight, keyBase + "-hl");
  };
  const renderText = () => {
    const parts = [];
    const re = /\(([^)]*[\u0600-\u06FF][^)]*)\)/g;
    let lastIdx = 0;
    let match;
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<React.Fragment key={"txt-" + match.index}>{renderHighlighted(text.slice(lastIdx, match.index), "txt-" + match.index)}</React.Fragment>);
      }
      parts.push(
        <span key={"ur-" + match.index}>
          (
          <span style={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", unicodeBidi: "isolate", textAlign: "right", color: "#C4B5FD" }}>
            {match[1]}
          </span>
          )
        </span>
      );
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) {
      parts.push(<React.Fragment key={"tail"}>{renderHighlighted(text.slice(lastIdx), "tail")}</React.Fragment>);
    }
    return parts.length ? <>{parts}</> : renderHighlighted(text, "full");
  };
  const inlineTools = showStudyToolbar && studyCard;
  return (
    <div {...focusProps} className={inlineTools ? "inline-study-row" : ""} style={{ width: "100%", maxWidth: "100%" }}>
      <div style={{ flex: inlineTools ? 1 : "0 1 auto", minWidth: inlineTools ? 0 : "auto", display: inlineTools ? "flex" : "block" }}>
      <button onClick={handleClick} style={{ display: "block", width: "100%", maxWidth: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 0, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid var(--border)", background: speaking ? "rgba(56,189,248,0.12)" : (isLight ? "var(--bg-card)" : "rgba(30,41,59,0.6)"), color: speaking ? "#38BDF8" : "var(--text-primary)", fontFamily: "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : (isLight ? "0 10px 24px rgba(15,23,42,0.05)" : "none"), position: "relative" }}>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" }}>{speaking ? "🔊" : "🔈"}</span>
        <span style={{ paddingRight: 28 }}>{renderText()}</span>
      </button>
      </div>
      {inlineTools ? <WordCollectionToolbar card={studyCard} compact={true} iconOnly={true} inline={true} showLists={false} /> : null}
    </div>
  );
}

function formatListedAnswer(text) {
  if (typeof text !== "string") return text;
  return text.replace(/(\d+\.)\s+/g, (match, marker, offset) => offset === 0 ? `${marker} ` : `\n${marker} `);
}

function isUrduText(text) {
  return /[\u0600-\u06FF]/.test(String(text || ""));
}

function normalizeText(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function trimQuestionText(text) {
  return normalizeText(String(text || "").replace(/_{3,}/g, "").replace(/\s*:\s*$/, "").replace(/\s*[?؟]\s*$/, ""));
}

function simpleHash(input) {
  const text = String(input || "");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash) + text.charCodeAt(index);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}

function shortPromptLabel(text, isUrdu) {
  const words = trimQuestionText(text).split(/\s+/).filter(Boolean);
  const maxWords = isUrdu ? 6 : 7;
  const label = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? label + "…" : label;
}

function capitalizeFirst(text) {
  const value = String(text || "").trim();
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

function buildPromptCue(text, isUrdu) {
  const clean = trimQuestionText(text);
  if (!clean) return "";
  if (isUrdu) {
    return clean
      .replace(/^(کیا|کون|کہاں|کب|کتنے|کس|نام)\s+/u, "")
      .replace(/\s+(کیا ہے|کون ہے|کہاں ہے|کب ہوا|کتنے ہیں)$/u, "")
      .trim();
  }
  return clean
    .replace(/^(what|which|who|where|when|why|how many|how much|name|list|identify|define|write)\s+/i, "")
    .trim();
}

function buildEnglishAnswerSentence(prompt, valueText) {
  const clean = trimQuestionText(prompt);
  let match;
  if ((match = clean.match(/^What is (.+)$/i))) return `${capitalizeFirst(match[1])} is ${valueText}.`;
  if ((match = clean.match(/^What are (.+)$/i))) return `${capitalizeFirst(match[1])} are ${valueText}.`;
  if ((match = clean.match(/^Who is (.+)$/i))) return `${capitalizeFirst(match[1])} is ${valueText}.`;
  if ((match = clean.match(/^Who was (.+)$/i))) return `${capitalizeFirst(match[1])} was ${valueText}.`;
  if ((match = clean.match(/^Where is (.+)$/i))) return `${capitalizeFirst(match[1])} is located in ${valueText}.`;
  if ((match = clean.match(/^Where are (.+)$/i))) return `${capitalizeFirst(match[1])} are located in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) become (.+)$/i))) return `${capitalizeFirst(match[1])} became ${match[2]} in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) begin$/i))) return `${capitalizeFirst(match[1])} began in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) start$/i))) return `${capitalizeFirst(match[1])} started in ${valueText}.`;
  if ((match = clean.match(/^When did (.+?) happen$/i))) return `${capitalizeFirst(match[1])} happened in ${valueText}.`;
  if ((match = clean.match(/^Which (.+?) is (.+)$/i))) return `The ${match[1]} that is ${match[2]} is ${valueText}.`;
  if ((match = clean.match(/^Which (.+?) are (.+)$/i))) return `The ${match[1]} that are ${match[2]} are ${valueText}.`;
  if ((match = clean.match(/^How many (.+)$/i))) return `${capitalizeFirst(match[1])}: ${valueText}.`;
  if ((match = clean.match(/^(Name|List|Identify|Write) (.+)$/i))) return `${capitalizeFirst(match[2])}: ${valueText}.`;
  return `${shortPromptLabel(buildPromptCue(clean, false) || clean, false)}: ${valueText}`;
}

function buildUrduAnswerSentence(prompt, valueText) {
  const clean = trimQuestionText(prompt);
  let match;
  if ((match = clean.match(/^(.+)\s+کیا ہے$/u))) return `${match[1]} ${valueText} ہے۔`;
  if ((match = clean.match(/^(.+)\s+کون ہے$/u))) return `${match[1]} ${valueText} ہے۔`;
  if ((match = clean.match(/^(.+)\s+کون تھا$/u))) return `${match[1]} ${valueText} تھا۔`;
  if ((match = clean.match(/^(.+)\s+کہاں ہے$/u))) return `${match[1]} ${valueText} میں ہے۔`;
  if ((match = clean.match(/^(.+)\s+کتنے ہیں$/u))) return `${match[1]} ${valueText} ہیں۔`;
  if ((match = clean.match(/^(.+)\s+کب ہوا$/u))) return `${match[1]} ${valueText} میں ہوا۔`;
  if ((match = clean.match(/^نام لکھیں[: ]*(.+)$/u))) return `${match[1]}: ${valueText}`;
  return `${shortPromptLabel(buildPromptCue(clean, true) || clean, true)}: ${valueText}`;
}

function getExerciseKind(question) {
  const q = String(question || "");
  const lower = q.toLowerCase();
  if (lower.includes("fill in the blank") || q.includes("خالی جگہ")) return "fill";
  if (lower.includes("true or false") || q.includes("درست یا غلط")) return "tf";
  if (lower.includes("match the columns") || q.includes("کالم ملائیں")) return "match";
  return null;
}

function buildSeedPairs(sub) {
  const pairs = [];
  const pushPair = (prompt, answer) => {
    const cleanPrompt = trimQuestionText(prompt);
    const cleanAnswer = normalizeText(answer);
    if (!cleanPrompt || !cleanAnswer) return;
    const key = cleanPrompt + "||" + cleanAnswer;
    if (!pairs.some(p => p.key === key)) pairs.push({ key, prompt: cleanPrompt, answer: cleanAnswer });
  };

  (sub.exercises || []).forEach(ex => {
    if (!Array.isArray(ex.parts) || !Array.isArray(ex.ans)) return;
    ex.parts.forEach((part, index) => pushPair(part, ex.ans[index]));
  });

  (sub.quiz || []).forEach(item => {
    if (!item || !Array.isArray(item.a) || typeof item.c !== "number") return;
    pushPair(item.q, item.a[item.c]);
  });

  (sub.wordProblems || []).forEach(item => {
    if (item && typeof item === "object" && item.q && item.a) pushPair(item.q, item.a);
  });

  return pairs;
}

function buildFillPrompt(pair, isUrdu) {
  return isUrdu
    ? buildUrduAnswerSentence(pair.prompt, "___")
    : buildEnglishAnswerSentence(pair.prompt, "___");
}

function buildTrueFalseStatement(pair, answerText, isUrdu) {
  return isUrdu
    ? buildUrduAnswerSentence(pair.prompt, answerText)
    : buildEnglishAnswerSentence(pair.prompt, answerText);
}

function buildGeneratedExercise(kind, pairs, count, isUrdu) {
  const parts = [];
  const ans = [];
  if (!pairs.length || count <= 0) return { parts, ans };

  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    if (kind === "fill") {
      parts.push(buildFillPrompt(pair, isUrdu));
      ans.push(pair.answer);
      continue;
    }

    if (kind === "tf") {
      const altPair = pairs[(i + 1) % pairs.length];
      const useFalse = i % 2 === 1 && altPair && altPair.answer !== pair.answer;
      parts.push(buildTrueFalseStatement(pair, useFalse ? altPair.answer : pair.answer, isUrdu));
      ans.push(isUrdu ? (useFalse ? "غلط" : "درست") : (useFalse ? "False" : "True"));
      continue;
    }

    if (kind === "match") {
      const cue = buildPromptCue(pair.prompt, isUrdu) || pair.prompt;
      parts.push(shortPromptLabel(cue, isUrdu));
      ans.push(pair.answer);
    }
  }

  return { parts, ans };
}

function splitFactSentences(text) {
  return String(text || "")
    .split(/(?<=[.!?۔؟])\s+/)
    .map(s => normalizeText(s))
    .filter(Boolean);
}

function buildScienceTrueFalseFacts(sub, isUrdu) {
  const facts = [];
  const seen = new Set();
  const addFact = (text) => {
    const clean = normalizeText(text);
    if (!clean) return;
    const key = clean.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    facts.push({ part: clean, ans: isUrdu ? "درست" : "True" });
  };

  (sub.examples || []).forEach(addFact);
  splitFactSentences(sub.c).forEach(addFact);
  (sub.wordProblems || []).forEach(item => {
    if (!item || typeof item !== "object" || !item.a) return;
    const firstSentence = splitFactSentences(item.a)[0];
    if (firstSentence) addFact(firstSentence);
  });

  return facts;
}

function ensureScienceTrueFalseCount(exercise, sub, isUrdu) {
  const targetCount = 10;
  const currentParts = Array.isArray(exercise.parts) ? [...exercise.parts] : [];
  const currentAns = Array.isArray(exercise.ans) ? [...exercise.ans] : [];
  if (currentParts.length >= targetCount) return exercise;

  const existing = new Set(currentParts.map(p => normalizeText(p).toLowerCase()));
  const facts = buildScienceTrueFalseFacts(sub, isUrdu);
  for (const fact of facts) {
    const key = fact.part.toLowerCase();
    if (existing.has(key)) continue;
    currentParts.push(fact.part);
    currentAns.push(fact.ans);
    existing.add(key);
    if (currentParts.length >= targetCount) break;
  }

  if (currentParts.length < targetCount) {
    const fallback = buildGeneratedExercise("tf", buildSeedPairs(sub), targetCount - currentParts.length, isUrdu);
    currentParts.push(...fallback.parts);
    currentAns.push(...fallback.ans);
  }

  return { ...exercise, parts: currentParts, ans: currentAns };
}

function stripMatchPrefixes(exercise) {
  const currentParts = Array.isArray(exercise.parts) ? exercise.parts : [];
  return {
    ...exercise,
    parts: currentParts.map(part => String(part || "").replace(/^Question\s+\d+:\s*/i, "").replace(/^سوال\s+\d+:\s*/i, ""))
  };
}

function ensureExerciseCount(exercise, kind, pairs, isUrdu) {
  const targetCount = 10;
  const currentParts = Array.isArray(exercise.parts) ? [...exercise.parts] : [];
  const currentAns = Array.isArray(exercise.ans) ? [...exercise.ans] : [];
  if (currentParts.length >= targetCount) return exercise;

  const generated = buildGeneratedExercise(kind, pairs, targetCount - currentParts.length, isUrdu);
  return { ...exercise, parts: [...currentParts, ...generated.parts], ans: [...currentAns, ...generated.ans] };
}

function normalizeSubLesson(sub, subjectId) {
  if (!sub || !Array.isArray(sub.exercises)) return sub;

  const isUrdu = subjectId === "urdu" || isUrduText(sub.t) || isUrduText(sub.c);
  const isScience = subjectId === "science";
  const canonicalLabels = {
    fill: isUrdu ? "خالی جگہیں پُر کریں:" : "Fill in the blanks:",
    tf: isUrdu ? "درست یا غلط:" : "True or False:",
    match: isUrdu ? "کالم ملائیں:" : "Match the columns:"
  };
  const pairs = buildSeedPairs(sub);
  const seenKinds = new Set();
  const exercises = sub.exercises.map(ex => {
    const kind = getExerciseKind(ex.q);
    if (!kind || seenKinds.has(kind)) return ex;
    seenKinds.add(kind);
    let ensured = isScience && kind === "tf"
      ? ensureScienceTrueFalseCount(ex, sub, isUrdu)
      : ensureExerciseCount(ex, kind, pairs, isUrdu);
    if (kind === "match") ensured = stripMatchPrefixes(ensured);
    return { ...ensured, q: canonicalLabels[kind] };
  });

  ["fill", "tf", "match"].forEach(kind => {
    if (seenKinds.has(kind) || !pairs.length) return;
    if (isScience && kind === "tf") {
      const generated = ensureScienceTrueFalseCount({ q: canonicalLabels[kind], parts: [], ans: [] }, sub, isUrdu);
      exercises.push({ q: canonicalLabels[kind], parts: generated.parts, ans: generated.ans });
      return;
    }
    let generated = buildGeneratedExercise(kind, pairs, 10, isUrdu);
    if (kind === "match") generated = stripMatchPrefixes(generated);
    exercises.push({ q: canonicalLabels[kind], parts: generated.parts, ans: generated.ans });
  });

  return { ...sub, exercises };
}

function formatDerivedDayLabel(dayEntry, isUrdu) {
  const dayNumber = dayEntry?.day || 1;
  return isUrdu ? `دن ${dayNumber}` : `Day ${dayNumber}`;
}

function buildDaySectionPairs(dayEntry, settingKey) {
  const pairs = [];
  const pushPair = (prompt, answer) => {
    const cleanPrompt = normalizeText(prompt);
    const cleanAnswer = normalizeText(answer);
    if (!cleanPrompt || !cleanAnswer) return;
    const key = `${cleanPrompt}||${cleanAnswer}`;
    if (!pairs.some((item) => item.key === key)) pairs.push({ key, prompt: cleanPrompt, answer: cleanAnswer });
  };

  if (Array.isArray(dayEntry?.words)) {
    dayEntry.words.forEach((word) => {
      if (!word) return;
      if (settingKey === "urduToEnglish") {
        pushPair(word.ur, word.en);
        return;
      }
      if (settingKey === "wordOpposites") {
        pushPair(word.en, word.opposite || word.oppositeUr || word.ur);
        return;
      }
      pushPair(word.en, word.ur || word.meaning || word.opposite || word.oppositeUr);
    });
  }

  if (Array.isArray(dayEntry?.sentencePairs)) {
    dayEntry.sentencePairs.forEach((pair) => pushPair(pair.en, pair.ur));
  }

  if (Array.isArray(dayEntry?.pairs)) {
    dayEntry.pairs.forEach((pair) => pushPair(pair.left, pair.right));
  }

  return pairs;
}

function buildDaySectionPrompt(kind, prompt, answer, settingKey, isUrdu) {
  const normalizedPrompt = normalizeText(prompt);
  const normalizedAnswer = normalizeText(answer);
  if (settingKey === "urduToEnglish") {
    return kind === "fill"
      ? `${normalizedPrompt} = ___`
      : kind === "tf"
        ? `${normalizedPrompt}: ${normalizedAnswer}`
        : normalizedPrompt;
  }
  if (settingKey === "wordOpposites") {
    if (kind === "fill") return isUrdu ? `"${normalizedPrompt}" کا متضاد ___ ہے` : `Opposite of "${normalizedPrompt}" is ___`;
    if (kind === "tf") return `${normalizedPrompt}: ${normalizedAnswer}`;
    return normalizedPrompt;
  }
  return kind === "fill" ? `${normalizedPrompt} = ___` : kind === "tf" ? `${normalizedPrompt}: ${normalizedAnswer}` : normalizedPrompt;
}

function buildDaySectionQuestion(prompt, settingKey, isUrdu) {
  const normalizedPrompt = normalizeText(prompt);
  if (settingKey === "urduToEnglish") {
    return isUrdu ? `"${normalizedPrompt}" کا انگریزی ترجمہ کیا ہے؟` : `What is the English translation of "${normalizedPrompt}"?`;
  }
  if (settingKey === "wordOpposites") {
    return isUrdu ? `"${normalizedPrompt}" کا متضاد کیا ہے؟` : `What is the opposite of "${normalizedPrompt}"?`;
  }
  if (settingKey === "sentences") {
    return isUrdu ? `"${normalizedPrompt}" کا اردو ترجمہ کیا ہے؟` : `What is the Urdu translation of "${normalizedPrompt}"?`;
  }
  return isUrdu ? `"${normalizedPrompt}" کا اردو مطلب کیا ہے؟` : `What is the Urdu meaning of "${normalizedPrompt}"?`;
}

function buildDaySectionExercises(dayEntry, settingKey, subjectId) {
  const isUrdu = subjectId === "urdu";
  const pairs = buildDaySectionPairs(dayEntry, settingKey);
  if (!pairs.length) return [];

  const fillLabel = isUrdu
    ? (settingKey === "wordOpposites" ? "خالی جگہیں پُر کریں:" : "صحیح معنی سے خالی جگہیں پُر کریں:")
    : (settingKey === "wordOpposites" ? "Fill in the blanks:" : "Fill in the blanks with correct meaning:");
  const tfLabel = isUrdu ? "درست یا غلط:" : "True or False:";
  const matchLabel = isUrdu ? "کالم ملائیں:" : "Match the columns:";

  const partsFill = pairs.map((pair) => buildDaySectionPrompt("fill", pair.prompt, pair.answer, settingKey, isUrdu));
  const ansFill = pairs.map((pair) => pair.answer);
  const partsTf = pairs.map((pair, index) => {
    const alternate = pairs[(index + 1) % pairs.length];
    const useFalse = index % 2 === 1 && alternate && alternate.answer !== pair.answer;
    return buildDaySectionPrompt("tf", pair.prompt, useFalse ? alternate.answer : pair.answer, settingKey, isUrdu);
  });
  const ansTf = pairs.map((_, index) => isUrdu ? (index % 2 === 1 ? "غلط" : "درست") : (index % 2 === 1 ? "False" : "True"));
  const partsMatch = pairs.map((pair) => buildDaySectionPrompt("match", pair.prompt, pair.answer, settingKey, isUrdu));
  const ansMatch = pairs.map((pair) => pair.answer);

  return [
    { q: fillLabel, parts: partsFill, ans: ansFill },
    { q: tfLabel, parts: partsTf, ans: ansTf },
    { q: matchLabel, parts: partsMatch, ans: ansMatch },
  ];
}

function buildDaySectionQuiz(dayEntry, settingKey, subjectId) {
  const isUrdu = subjectId === "urdu";
  const pairs = buildDaySectionPairs(dayEntry, settingKey);
  if (!pairs.length) return [];
  const pool = Array.from(new Set(pairs.map((pair) => pair.answer)));

  return pairs.map((pair, index) => {
    const distractors = [];
    for (let offset = 1; offset < pairs.length && distractors.length < 3; offset += 1) {
      const candidate = pairs[(index + offset) % pairs.length]?.answer;
      if (candidate && candidate !== pair.answer && !distractors.includes(candidate)) distractors.push(candidate);
    }
    for (const candidate of pool) {
      if (distractors.length >= 3) break;
      if (candidate !== pair.answer && !distractors.includes(candidate)) distractors.push(candidate);
    }
    while (distractors.length < 3) distractors.push(pair.answer);
    const options = [pair.answer, ...distractors.slice(0, 3)];
    const rotation = index % options.length;
    const shuffled = options.map((_, optionIndex) => options[(optionIndex + rotation) % options.length]);
    return {
      q: buildDaySectionQuestion(pair.prompt, settingKey, isUrdu),
      a: shuffled,
      c: shuffled.indexOf(pair.answer),
    };
  });
}

function buildDerivedDayBasedSub(sub, settingKey, itemsPerDay, subjectId) {
  if (!sub || !Array.isArray(sub.dayLessons)) return sub;
  const adjustedDayLessons = regroupDayEntries(sub.dayLessons, itemsPerDay);
  const exerciseGroups = adjustedDayLessons.map((lessonDay) => ({
    label: formatDerivedDayLabel(lessonDay, subjectId === "urdu"),
    exercises: buildDaySectionExercises(lessonDay, settingKey, subjectId),
  }));
  const quizGroups = adjustedDayLessons.map((lessonDay) => ({
    label: formatDerivedDayLabel(lessonDay, subjectId === "urdu"),
    questions: buildDaySectionQuiz(lessonDay, settingKey, subjectId),
  }));
  return {
    ...sub,
    dayLessons: adjustedDayLessons,
    exerciseGroups,
    quizGroups,
  };
}

function getTenseSubsectionIndex(lesson) {
  return Array.isArray(lesson?.subs) ? lesson.subs.findIndex((sub) => sub?.isTensesSub) : -1;
}

function buildDerivedSentenceSub(subs, itemsPerDay, subjectId) {
  const sentencePairs = [];
  (subs || []).forEach((sub) => {
    (sub.sentencePairs || []).forEach((pair) => sentencePairs.push(pair));
  });
  const groups = regroupSentencePairs(sentencePairs, itemsPerDay);
  return groups.map((group) => ({
    t: subjectId === "urdu" ? `جملے دن ${group.day}` : `Sentences Day ${group.day}`,
    c: subjectId === "urdu"
      ? "روزمرہ استعمال کے انگریزی جملے اور ان کے اردو ترجمے پڑھیں۔"
      : "Read daily-use English sentences with Urdu translations. Practice only this grouped set in the exercises and quiz.",
    examplesLabel: subjectId === "urdu" ? "🗣️ جملے" : "🗣️ Sentences",
    sentencePairs: group.sentencePairs,
    exercises: buildDaySectionExercises(group, "sentences", subjectId),
    quiz: buildDaySectionQuiz(group, "sentences", subjectId),
  }));
}

function isLightUiTheme() {
  return window.HomeSchoolPrefs?.resolvedTheme === "light";
}

function buildReviewStatsFallback(stats = {}, library = [], analytics = null) {
  const now = Date.now();
  const masteryThreshold = 5;
  const todayKey = window.HomeSchoolUtils.getDayKey(now);
  const safeLibrary = Array.isArray(library) ? library : [];
  const safeAnalytics = analytics || {};
  const todayHeatCell = Array.isArray(safeAnalytics.heatmap)
    ? safeAnalytics.heatmap.find((cell) => cell?.dayKey === todayKey) || safeAnalytics.heatmap[0]
    : null;
  const derived = {
    total: safeLibrary.length,
    due: safeLibrary.filter((card) => (Number(card?.dueAt) || 0) <= now).length,
    mastered: safeLibrary.filter((card) => (Number(card?.box) || 0) >= masteryThreshold).length,
    learning: safeLibrary.filter((card) => ((Number(card?.totalReviews) || 0) > 0 || (Number(card?.box) || 0) > 0) && (Number(card?.box) || 0) < masteryThreshold).length,
    newCards: safeLibrary.filter((card) => !card?.lastReviewedAt).length,
    reviewedToday: safeLibrary.filter((card) => card?.lastReviewedAt && window.HomeSchoolUtils.getDayKey(card.lastReviewedAt) === todayKey).length,
    favorites: safeLibrary.filter((card) => !!card?.favorite).length,
    notedWords: safeLibrary.filter((card) => String(card?.note || "").trim().length > 0).length,
    customLists: Array.isArray(safeAnalytics.customLists) ? safeAnalytics.customLists.length : 0,
    retentionRate: todayHeatCell?.count ? Number(todayHeatCell.accuracy) || 0 : 0,
  };
  const nextStats = { ...(stats || {}) };
  return {
    ...nextStats,
    total: Math.max(Number(nextStats.total) || 0, derived.total),
    due: Math.max(Number(nextStats.due) || 0, derived.due),
    mastered: Math.max(Number(nextStats.mastered) || 0, derived.mastered),
    learning: Math.max(Number(nextStats.learning) || 0, derived.learning),
    newCards: Math.max(Number(nextStats.newCards) || 0, derived.newCards),
    reviewedToday: Math.max(Number(nextStats.reviewedToday) || 0, derived.reviewedToday, Number(todayHeatCell?.count) || 0),
    favorites: Math.max(Number(nextStats.favorites) || 0, derived.favorites, Number(safeAnalytics?.totals?.favorites) || 0),
    notedWords: Math.max(Number(nextStats.notedWords) || 0, derived.notedWords, Number(safeAnalytics?.totals?.notedWords) || 0),
    customLists: Math.max(Number(nextStats.customLists) || 0, derived.customLists, Number(safeAnalytics?.totals?.customLists) || 0),
    retentionRate: Math.max(Number(nextStats.retentionRate) || 0, derived.retentionRate),
    reviewStreak: Number(nextStats.reviewStreak) || 0,
  };
}

function shuffleArray(items = []) {
  const next = [...items];
  for (let idx = next.length - 1; idx > 0; idx -= 1) {
    const swapIdx = Math.floor(Math.random() * (idx + 1));
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
  }
  return next;
}

function buildPracticeDeck(library = [], limit = 12) {
  return shuffleArray((library || []).filter((card) => card?.prompt && (card?.answer || card?.meaning))).slice(0, Math.max(4, Number(limit) || 12));
}

function normalizeAnswerText(value) {
  return normalizeText(String(value || ""))
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function isTypingAnswerCorrect(card, input) {
  const guess = normalizeAnswerText(input);
  if (!guess) return false;
  const acceptable = [
    card?.prompt,
    card?.answer,
    card?.meaning,
    card?.opposite,
    card?.oppositeUr,
  ]
    .filter(Boolean)
    .map((entry) => normalizeAnswerText(entry))
    .filter(Boolean);
  return acceptable.includes(guess);
}

function buildMatchRound(cards = [], count = 4) {
  const selected = shuffleArray(cards).slice(0, Math.max(3, Math.min(count, cards.length)));
  return {
    prompts: selected,
    answers: shuffleArray(selected.map((card) => ({
      id: card.id,
      text: card.answer || card.meaning || "",
    }))),
    matches: {},
    completed: false,
  };
}

function formatClockTime(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getReminderStatus(reminderSettings = {}, language = "en") {
  if (!reminderSettings?.enabled) return joinLocalizedText("Off", "آف", language);
  return joinLocalizedText(`Daily at ${reminderSettings.time || "18:00"}`, `روزانہ ${reminderSettings.time || "18:00"} پر`, language);
}

function createNotificationEntry(type, titleEn, titleUr, bodyEn, bodyUr, createdAt = Date.now(), extra = {}) {
  return {
    id: `notice_${createdAt}_${Math.random().toString(36).slice(2, 8)}`,
    type,
    titleEn,
    titleUr,
    bodyEn,
    bodyUr,
    createdAt,
    ...extra,
  };
}

function formatNotificationTime(createdAt, language = "en") {
  try {
    const stamp = new Date(createdAt || Date.now());
    return joinLocalizedText(
      stamp.toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      stamp.toLocaleString("ur-PK", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
      language,
    );
  } catch {
    return formatDate(createdAt || Date.now());
  }
}

function getReviewWordLookupKey(prompt, answer) {
  return `${normalizeText(prompt).toLowerCase()}|${normalizeText(answer).toLowerCase()}`;
}

function buildStandaloneStudyItemId(studyItem) {
  return `study_item_${simpleHash([
    normalizeText(studyItem?.subject || "english").toLowerCase(),
    normalizeText(studyItem?.section || "general").toLowerCase(),
    normalizeText(studyItem?.prompt || "").toLowerCase(),
    normalizeText(studyItem?.answer || "").toLowerCase(),
  ].join("|"))}`;
}

function buildStandaloneStudyMetaRecord(studyItem = {}, meta = null) {
  return {
    id: buildStandaloneStudyItemId(studyItem),
    prompt: studyItem.prompt || "",
    answer: studyItem.answer || studyItem.secondaryText || "",
    subject: studyItem.subject || "english",
    section: studyItem.section || "general",
    sectionLabel: studyItem.sectionLabel || studyItem.section || "General",
    source: meta?.source || studyItem.source || null,
    favorite: Boolean(meta?.favorite),
    note: String(meta?.note || ""),
    listIds: [],
    listNames: [],
    studyUpdatedAt: meta?.updatedAt || 0,
    reviewBacked: false,
    standalone: true,
  };
}

function applyStudyMetaToLookup(currentLookup, meta) {
  if (!meta?.id) return currentLookup;
  return {
    ...(currentLookup || {}),
    [meta.id]: {
      ...(currentLookup?.[meta.id] || {}),
      ...meta,
    },
  };
}

function resolveStudyCard(app, studyItem = {}) {
  const prompt = String(studyItem?.prompt || "").trim();
  const answer = String(studyItem?.answer || studyItem?.secondaryText || "").trim();
  if (!prompt) return null;
  const reviewCard = answer ? (app?.reviewWordLookup?.[getReviewWordLookupKey(prompt, answer)] || null) : null;
  if (reviewCard) {
    return {
      ...reviewCard,
      source: reviewCard.source || studyItem.source || app?.buildViewSource?.() || null,
      reviewBacked: true,
    };
  }
  const standaloneId = buildStandaloneStudyItemId(studyItem);
  const meta = app?.studyMetaLookup?.[standaloneId] || null;
  return buildStandaloneStudyMetaRecord({ ...studyItem, prompt, answer, source: studyItem.source || app?.buildViewSource?.() || null }, meta);
}

function getStudyFocusProps(app, studyCard, baseClassName = "") {
  const className = [
    baseClassName,
    studyCard?.id ? "study-focus-target" : "",
    studyCard?.id && app?.viewTargetId === studyCard.id ? "study-focus-active" : "",
  ].filter(Boolean).join(" ");

  return {
    className,
    "data-study-id": studyCard?.id || undefined,
  };
}

function getReviewDueLabel(card, language) {
  const now = Date.now();
  const dueAt = Number(card?.dueAt) || now;
  if (dueAt <= now) {
    const overdueDays = Math.floor((now - dueAt) / (24 * 60 * 60 * 1000));
    return overdueDays > 0
      ? joinLocalizedText(`${overdueDays}d overdue`, `${overdueDays} دن ${UI_TEXT.ur.overdue}`, language)
      : joinLocalizedText(UI_TEXT.en.dueNow, UI_TEXT.ur.dueNow, language);
  }
  const remainingDays = Math.max(1, Math.ceil((dueAt - now) / (24 * 60 * 60 * 1000)));
  return joinLocalizedText(`Due in ${remainingDays}d`, `${remainingDays} دن بعد`, language);
}

function WordCollectionToolbar({ card, compact = false, allowView = false, iconOnly = false, inline = false, showLists = true }) {
  const app = useContext(AppContext);
  const language = app?.language || "en";
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [draftNote, setDraftNote] = useState(card?.note || "");

  useEffect(() => {
    setDraftNote(card?.note || "");
  }, [card?.id, card?.note]);

  if (!card || !app?.onToggleFavorite) return null;
  const supportsLists = card.reviewBacked !== false;
  const canViewSource = allowView && Boolean(app?.onViewStudyItem);

  const buttonClass = `study-tool-btn${compact ? " compact" : ""}${card.favorite ? " active" : ""}${iconOnly ? " icon-only" : ""}`;
  const wrapperClass = `study-tools${compact ? " compact" : ""}${inline ? " inline" : ""}`;

  return (
    <div className={wrapperClass}>
      <div className="study-tool-row">
        <button
          type="button"
          className={buttonClass}
          onClick={(event) => {
            event.stopPropagation();
            if (card.reviewBacked === false) app.onToggleStudyFavorite?.(card);
            else app.onToggleFavorite(card.id);
          }}
          title={card.favorite ? "Remove favorite" : "Add favorite"}
          aria-label={card.favorite ? "Remove favorite" : "Add favorite"}
        >
          {iconOnly ? (card.favorite ? "★" : "☆") : <>{card.favorite ? "★" : "☆"} {renderLocalizedTextNode(joinLocalizedText("Favorite", "پسندیدہ", language), language)}</>}
        </button>
        <button
          type="button"
          className={`study-tool-btn${compact ? " compact" : ""}${showNoteEditor || card.note ? " active" : ""}${iconOnly ? " icon-only" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            setShowNoteEditor((value) => !value);
          }}
          title={language === "ur" ? UI_TEXT.ur.addNote : UI_TEXT.en.addNote}
          aria-label={language === "ur" ? UI_TEXT.ur.addNote : UI_TEXT.en.addNote}
        >
          {iconOnly ? "📝" : <>📝 {renderLocalizedTextNode(joinLocalizedText(UI_TEXT.en.addNote, UI_TEXT.ur.addNote, language), language)}</>}
        </button>
        {canViewSource ? (
          <button
            type="button"
            className={`study-tool-btn${compact ? " compact" : ""}${iconOnly ? " icon-only" : ""}`}
            onClick={(event) => {
              event.stopPropagation();
              app.onViewStudyItem?.(card);
            }}
            title={language === "ur" ? "دیکھیں" : "View"}
            aria-label={language === "ur" ? "دیکھیں" : "View"}
          >
            {iconOnly ? "👁️" : <>👁️ {renderLocalizedTextNode(joinLocalizedText("View", "دیکھیں", language), language)}</>}
          </button>
        ) : null}
      </div>

      {showLists && supportsLists && Array.isArray(app.customLists) && app.customLists.length > 0 && (
        <div className="study-list-pills">
          {app.customLists.map((list) => {
            const included = (card.listIds || []).includes(list.id);
            return (
              <button
                key={list.id}
                type="button"
                className={`study-list-chip${included ? " active" : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  app.onToggleCardInList?.(card.id, list.id);
                }}
              >
                {included ? "✓" : "+"} {list.name}
              </button>
            );
          })}
        </div>
      )}

      {showNoteEditor && (
        <div className="study-note-editor">
          <textarea
            value={draftNote}
            onChange={(event) => setDraftNote(event.target.value)}
            placeholder={language === "ur" ? UI_TEXT.ur.notePlaceholder : UI_TEXT.en.notePlaceholder}
            style={isUrduUi(language) ? { fontFamily: "var(--font-ur)", direction: "rtl", textAlign: "right" } : {}}
          />
          <div className="study-note-actions">
            <button
              type="button"
              className="study-tool-btn save"
              onClick={async (event) => {
                event.stopPropagation();
                if (card.reviewBacked === false) {
                  await app.onSaveStudyNote?.(card, draftNote);
                } else {
                  await app.onSaveWordNote?.(card.id, draftNote);
                }
                setShowNoteEditor(false);
              }}
            >
              {renderLocalizedTextNode(joinLocalizedText(UI_TEXT.en.saveNote, UI_TEXT.ur.saveNote, language), language)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionActionBar({ studyItem, revealed, onToggleReveal, showLabel, buttonStyle }) {
  const app = useContext(AppContext);
  const card = resolveStudyCard(app, studyItem);
  const label = revealed ? "Hide answer" : "Show answer";

  return (
    <div className="question-actions">
      <button
        type="button"
        onClick={onToggleReveal}
        className="question-show-btn study-tool-btn compact icon-only"
        style={buttonStyle}
        title={label}
        aria-label={label}
      >
        {revealed ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c5.6 0 9.4 5.1 10 6-.3.5-1.5 2.2-3.5 3.8" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6.2 6.3C3.9 8 2.4 10.1 2 11c.6 1 4.4 6 10 6 1.3 0 2.5-.2 3.6-.6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 12s3.8-7 10-7 10 7 10 7-3.8 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.9" />
          </svg>
        )}
      </button>
      {card ? <WordCollectionToolbar card={card} compact={true} iconOnly={true} inline={true} showLists={false} /> : null}
    </div>
  );
}

function InlineStudyActionBar({ studyItem }) {
  const app = useContext(AppContext);
  const card = resolveStudyCard(app, studyItem);
  if (!card) return null;
  return (
    <div className="question-actions">
      <WordCollectionToolbar card={card} compact={true} iconOnly={true} inline={true} showLists={false} />
    </div>
  );
}

function StudyWordCard({ card, showStats = true, allowView = false }) {
  const app = useContext(AppContext);
  const language = app?.language || "en";
  const accuracy = card.totalReviews ? Math.round(((card.correctReviews || 0) / card.totalReviews) * 100) : 0;
  return (
    <div className="study-word-card">
      <div className="study-word-head">
        <div>
          <div className="study-word-prompt">{card.prompt}</div>
          {card.answer ? <div className="study-word-answer">{card.answer}</div> : null}
        </div>
        <span className="study-word-section">{card.sectionLabel || card.section}</span>
      </div>
      {card.meaning ? <div className="study-word-meaning">{card.meaning}</div> : null}
      {card.note ? <div className="study-word-note">{card.note}</div> : null}
      {showStats && (
        <div className="study-word-stats">
          <span>{renderLocalizedTextNode(joinLocalizedText(`${UI_TEXT.en.accuracy}: ${accuracy}%`, `${UI_TEXT.ur.accuracy}: ${accuracy}%`, language), language)}</span>
          <span>{renderLocalizedTextNode(joinLocalizedText(`${UI_TEXT.en.lapses}: ${card.lapses || 0}`, `${UI_TEXT.ur.lapses}: ${card.lapses || 0}`, language), language)}</span>
          <span>{renderLocalizedTextNode(getReviewDueLabel(card, language), language)}</span>
        </div>
      )}
      <WordCollectionToolbar card={card} compact={showStats} allowView={allowView} />
    </div>
  );
}

function StudyItemInlineToolbar({ studyItem }) {
  const app = useContext(AppContext);
  const card = resolveStudyCard(app, studyItem);
  const focusProps = getStudyFocusProps(app, card);
  if (!card) return null;
  return (
    <div {...focusProps} style={{ marginTop: 8, marginBottom: 8, display: "flex", justifyContent: "flex-end" }}>
      <WordCollectionToolbar card={card} compact={true} iconOnly={true} inline={true} showLists={false} />
    </div>
  );
}

function getSimpleMachinePromptVisual(sub, exercise, prompt) {
  if (!sub || sub.t !== "Simple Machines" || !exercise || exercise.q !== "Name the simple machine:") return null;
  const lower = (prompt || "").toLowerCase();
  const badgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
    borderRadius: 10,
    background: "rgba(245,158,11,0.12)",
    border: "1px solid rgba(245,158,11,0.28)",
    color: "#FDE68A",
    flexShrink: 0
  };
  if (lower.includes("flagpole rope")) {
    return (
      <span style={badgeStyle}>
        <svg width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="15" y1="3" x2="15" y2="18" stroke="#CBD5E1" strokeWidth="1.8"/>
          <circle cx="11" cy="8" r="3.6" fill="none" stroke="#F59E0B" strokeWidth="1.8"/>
          <line x1="11" y1="11.6" x2="11" y2="16.5" stroke="#CBD5E1" strokeWidth="1.8"/>
          <rect x="8.1" y="16.5" width="5.8" height="2.8" rx="1.2" fill="#F59E0B" opacity="0.28" stroke="#F59E0B" strokeWidth="1.1"/>
          <line x1="15" y1="5" x2="18.2" y2="6.8" stroke="#22C55E" strokeWidth="1.8"/>
          <polygon points="18.6,6.9 16.6,5.8 16.8,8.1" fill="#22C55E"/>
        </svg>
      </span>
    );
  }
  const icon = lower.includes("seesaw") ? "⚖️"
    : lower.includes("doorknob") ? "🚪"
    : lower.includes("wheelchair ramp") ? "♿"
    : lower.includes("axe blade") ? "🪓"
    : lower.includes("screw in wood") ? "🔩"
    : lower.includes("scissors") ? "✂️"
    : lower.includes("slide") ? "🛝"
    : null;
  return icon ? <span style={{...badgeStyle,fontSize:18}}>{icon}</span> : null;
}

function WordRow({ en, ur }) {
  const app = useContext(AppContext);
  const studyCard = resolveStudyCard(app, { prompt: en, answer: ur, subject: "english", section: "englishWords", sectionLabel: "English" });
  const focusProps = getStudyFocusProps(app, studyCard, "word-row");
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const [sBoth, setSBoth] = useState(false);
  const speakEn = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const u = new SpeechSynthesisUtterance(ttsClean(en));
    const speechConfig = getSpeechConfig("en", window.speechSynthesis.getVoices());
    u.lang = speechConfig.lang;
    u.rate = speechConfig.rate;
    if (speechConfig.voice) u.voice = speechConfig.voice;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ttsClean(ur));
    const speechConfig = getSpeechConfig("ur", window.speechSynthesis.getVoices());
    u.lang = speechConfig.lang;
    u.rate = speechConfig.rate;
    if (speechConfig.voice) u.voice = speechConfig.voice;
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  const speakBoth = () => {
    if (!isTtsEnabled()) return;
    window.speechSynthesis.cancel();
    setSBoth(true);
    setSEn(true);
    setSUr(false);
    const enUtter = new SpeechSynthesisUtterance(ttsClean(en));
    const enSpeechConfig = getSpeechConfig("en", window.speechSynthesis.getVoices());
    enUtter.lang = enSpeechConfig.lang;
    enUtter.rate = enSpeechConfig.rate;
    if (enSpeechConfig.voice) enUtter.voice = enSpeechConfig.voice;
    enUtter.onend = () => {
      setSEn(false);
      setSUr(true);
      const urUtter = new SpeechSynthesisUtterance(ttsClean(ur));
      const urSpeechConfig = getSpeechConfig("ur", window.speechSynthesis.getVoices());
      urUtter.lang = urSpeechConfig.lang;
      urUtter.rate = urSpeechConfig.rate;
      if (urSpeechConfig.voice) urUtter.voice = urSpeechConfig.voice;
      urUtter.onend = () => { setSUr(false); setSBoth(false); };
      urUtter.onerror = () => { setSUr(false); setSBoth(false); };
      window.speechSynthesis.speak(urUtter);
    };
    enUtter.onerror = () => { setSEn(false); setSUr(false); setSBoth(false); };
    window.speechSynthesis.speak(enUtter);
  };
  return (
    <div {...focusProps} onClick={speakBoth} style={{ cursor: "pointer", boxShadow: sBoth ? "0 0 0 1px rgba(56,189,248,0.22)" : "none", transition: "box-shadow 0.2s", flexDirection: "column", alignItems: "stretch", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span className={"word-en" + (sEn ? " word-active" : "")} onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : undefined, transition: "color 0.2s", flex: 1 }}>{en} {sEn ? "🔊" : "🔈"}</span>
        <span className={"word-ur" + (sUr ? " word-active" : "")} onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : undefined, transition: "color 0.2s", flex: 1 }}>{sUr ? "🔊" : "🔈"} {ur}</span>
        <InlineStudyActionBar studyItem={{ prompt: en, answer: ur, subject: "english", section: "englishWords", sectionLabel: "English" }} />
      </div>
      {studyCard?.note ? <div className="word-study-row" onClick={(event) => event.stopPropagation()}><div style={{ width: "100%" }}><span className="word-study-note">{studyCard.note}</span></div></div> : null}
    </div>
  );
}


function OppositeWordRow({ en, ur, opposite, oppositeUr }) {
  const app = useContext(AppContext);
  const studyCard = resolveStudyCard(app, { prompt: en, answer: ur, subject: "english", section: "opposites", sectionLabel: "Opposites" });
  const focusProps = getStudyFocusProps(app, studyCard, "word-row");
  const isLight = isLightUiTheme();
  const cardStyle = {
    background: isLight ? "rgba(255,255,255,0.82)" : "rgba(15,23,42,0.45)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 6
  };
  const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "var(--text-muted)", textTransform: "uppercase" };
  return (
    <div {...focusProps} style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 8, width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, width: "100%", flex: 1 }}>
        <div style={cardStyle}>
          <span style={labelStyle}>Word</span>
          <SpeakableSentence text={en} lang="en" fullWidth={false} buttonStyle={{ background: isLight ? "rgba(56,189,248,0.10)" : "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.28)", color: isLight ? "var(--text-primary)" : "#E0F2FE", justifyContent: "flex-start" }} />
          <SpeakableSentence text={ur} lang="ur" fullWidth={false} buttonStyle={{ background: isLight ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: isLight ? "var(--text-primary)" : "#DCFCE7", justifyContent: "flex-start" }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
        </div>
        <div style={cardStyle}>
          <span style={labelStyle}>Opposite</span>
          <SpeakableSentence text={opposite} lang="en" fullWidth={false} buttonStyle={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: isLight ? "var(--text-primary)" : "#FEF3C7", justifyContent: "flex-start" }} />
          <SpeakableSentence text={oppositeUr} lang="ur" fullWidth={false} buttonStyle={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", color: isLight ? "var(--text-primary)" : "#F3E8FF", justifyContent: "flex-start" }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
        </div>
      </div>
      <InlineStudyActionBar studyItem={{ prompt: en, answer: ur, subject: "english", section: "opposites", sectionLabel: "Opposites" }} />
      </div>
    </div>
  );
}

function SentencePairRow({ en, ur }) {
  const app = useContext(AppContext);
  const studyCard = resolveStudyCard(app, { prompt: en, answer: ur, subject: "english", section: "sentences", sectionLabel: "Sentences" });
  const focusProps = getStudyFocusProps(app, studyCard, "word-row");
  const isLight = isLightUiTheme();
  const cardStyle = {
    background: isLight ? "rgba(255,255,255,0.82)" : "rgba(15,23,42,0.45)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "10px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 8
  };
  const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "var(--text-muted)", textTransform: "uppercase" };
  return (
    <div {...focusProps} style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
        <div style={{ ...cardStyle, flex: 1 }}>
          <span style={labelStyle}>English Sentence</span>
          <SpeakableSentence text={en} lang="en" showStudyToolbar={false} buttonStyle={{ background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.24)", color: isLight ? "var(--text-primary)" : "#E0F2FE", marginBottom: 0 }} />
          <span style={{ ...labelStyle, color: "#22C55E", marginTop: 2 }}>Urdu Translation</span>
          <SpeakableSentence text={ur} lang="ur" showStudyToolbar={false} buttonStyle={{ background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: isLight ? "var(--text-primary)" : "#DCFCE7", marginBottom: 0 }} textStyle={{ fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" }} />
        </div>
        <InlineStudyActionBar studyItem={{ prompt: en, answer: ur, subject: "english", section: "sentences", sectionLabel: "Sentences" }} />
      </div>
    </div>
  );
}

function AdjWordRow({ en, ur, comp, sup }) {
  const app = useContext(AppContext);
  const studyCard = resolveStudyCard(app, { prompt: en, answer: ur, subject: "english", section: "adjectives", sectionLabel: "Adjectives" });
  const focusProps = getStudyFocusProps(app, studyCard, "word-row");
  const isLight = isLightUiTheme();
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const speakEn = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const txt = en + ". " + comp + ". " + sup + ".";
    const u = new SpeechSynthesisUtterance(ttsClean(txt)); u.lang = "en-US"; u.rate = 0.75;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ttsClean(ur)); u.lang = "ur-PK"; u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"));
    if (pref) { u.voice = pref; u.lang = pref.lang; }
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <div {...focusProps} style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : "var(--text-primary)", fontWeight: 700, fontSize: 15, transition: "color 0.2s", flex: 1 }}>{en} → {comp} → {sup} {sEn ? "🔊" : "🔈"}</span>
        <span onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s", flex: 1 }}>{sUr ? "🔊" : "🔈"} {ur}</span>
        <InlineStudyActionBar studyItem={{ prompt: en, answer: ur, subject: "english", section: "adjectives", sectionLabel: "Adjectives" }} />
      </div>
    </div>
  );
}

function VerbWordRow({ en, ur, v2, v3 }) {
  const app = useContext(AppContext);
  const studyCard = resolveStudyCard(app, { prompt: en, answer: ur, subject: "english", section: "verbs", sectionLabel: "Verbs" });
  const focusProps = getStudyFocusProps(app, studyCard, "word-row");
  const isLight = isLightUiTheme();
  const [sEn, setSEn] = useState(false);
  const [sUr, setSUr] = useState(false);
  const speakEn = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSEn(true);
    const txt = en + ". " + v2 + ". " + v3 + ".";
    const u = new SpeechSynthesisUtterance(ttsClean(txt)); u.lang = "en-US"; u.rate = 0.75;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("en") && v.localService) || voices.find(v => v.lang.startsWith("en"));
    if (pref) u.voice = pref;
    u.onend = () => setSEn(false); u.onerror = () => setSEn(false);
    window.speechSynthesis.speak(u);
  };
  const speakUr = (e) => {
    if (!isTtsEnabled()) return;
    e.stopPropagation(); window.speechSynthesis.cancel(); setSUr(true);
    const u = new SpeechSynthesisUtterance(ttsClean(ur)); u.lang = "ur-PK"; u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const pref = voices.find(v => v.lang.startsWith("ur")) || voices.find(v => v.lang.startsWith("hi")) || voices.find(v => v.lang.includes("IN"));
    if (pref) { u.voice = pref; u.lang = pref.lang; }
    u.onend = () => setSUr(false); u.onerror = () => setSUr(false);
    window.speechSynthesis.speak(u);
  };
  return (
    <div {...focusProps} style={{ cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span onClick={speakEn} style={{ cursor: "pointer", color: sEn ? "#38BDF8" : "var(--text-primary)", fontWeight: 700, fontSize: 15, transition: "color 0.2s", flex: 1 }}>{en} → {v2} → {v3} {sEn ? "🔊" : "🔈"}</span>
        <span onClick={speakUr} style={{ cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s", flex: 1 }}>{sUr ? "🔊" : "🔈"} {ur}</span>
        <InlineStudyActionBar studyItem={{ prompt: en, answer: ur, subject: "english", section: "verbs", sectionLabel: "Verbs" }} />
      </div>
    </div>
  );
}

function HomeschoolApp() {
  const stored = loadState();
  const storedAiConfigs = sanitizeAiProviderConfigs(localStorageFallback("hs_ai_provider_configs") || {});
  const storedAiTutorPreferences = localStorageFallback("hs_ai_tutor_preferences") || {};
  const versionManagerRef = useRef(window.DataVersionManager ? new window.DataVersionManager(window.HomeSchoolDB) : null);
  const persistCustomizationRef = useRef(null);
  const [language, setLanguage] = useState(stored?.language || "en");
  const [themeMode, setThemeMode] = useState(stored?.themeMode || "dark");
  const ui = getUiText(language);
  const [daySectionOverrides, setDaySectionOverrides] = useState(stored?.daySectionOverrides || {});
  const [dailyReviewCap, setDailyReviewCap] = useState(Math.max(5, Math.min(50, Number(stored?.dailyReviewCap) || 20)));
  const [grade, setGrade] = useState(stored?.grade || null);
  const [studentName, setStudentName] = useState(stored?.studentName || "");
  const [studentNameUr, setStudentNameUr] = useState(stored?.studentNameUr || "");
  const [tab, setTab] = useState("home");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [selectedAdverbDay, setSelectedAdverbDay] = useState(null);
  const [selectedPrepDay, setSelectedPrepDay] = useState(null);
  const [selectedAdjDay, setSelectedAdjDay] = useState(null);
  const [selectedConjDay, setSelectedConjDay] = useState(null);
  const [selectedPronDay, setSelectedPronDay] = useState(null);
  const [selectedNounDay, setSelectedNounDay] = useState(null);
  const [selectedVerbDay, setSelectedVerbDay] = useState(null);
  const [posTab, setPosTab] = useState("adverbs");
  const [tenseMain, setTenseMain] = useState("present");
  const [tenseSub, setTenseSub] = useState("simple");
  const [selectedTensePara, setSelectedTensePara] = useState(null);
  const [selectedVocabDay, setSelectedVocabDay] = useState(null);
  const [mathSubIdx, setMathSubIdx] = useState(null);
  const [mathSubTab, setMathSubTab] = useState("examples");
  const [subExerciseGroupIdx, setSubExerciseGroupIdx] = useState(null);
  const [subQuizGroupIdx, setSubQuizGroupIdx] = useState(null);
  const [revealedEx, setRevealedEx] = useState({});
  const [completedQuizzes, setCompletedQuizzes] = useState(stored?.completedQuizzes || {});
  const [totalScore, setTotalScore] = useState(stored?.totalScore || 0);
  const [totalQuizzesDone, setTotalQuizzesDone] = useState(stored?.totalQuizzesDone || 0);
  const [streak, setStreak] = useState(stored?.streak || 0);
  const [lastQuizDate, setLastQuizDate] = useState(stored?.lastQuizDate || null);
  const [earnedBadges, setEarnedBadges] = useState(stored?.earnedBadges || []);
  const [xp, setXp] = useState(stored?.xp || 0);
  const [newBadges, setNewBadges] = useState([]);
  const [chatMessages, setChatMessages] = useState([{ role: "ai", text: "Assalam-o-Alaikum! 👋 I'm your AI tutor. Ask me anything about your lessons — I'll explain it in a way that's easy to understand!" }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [aiProviderConfigs, setAiProviderConfigs] = useState(storedAiConfigs);
  const [aiProviderDrafts, setAiProviderDrafts] = useState(storedAiConfigs);
  const [aiProviderBusy, setAiProviderBusy] = useState({});
  const [selectedAiProvider, setSelectedAiProvider] = useState(storedAiTutorPreferences?.providerId || "openai");
  const [currentVersion, setCurrentVersion] = useState(window.HomeSchoolData.VERSION);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(stored?.ttsEnabled ?? true);
  const [ttsRate, setTtsRate] = useState(Math.max(0.6, Math.min(1.3, Number(stored?.ttsRate) || 0.85)));
  const [availableVoices, setAvailableVoices] = useState([]);
  const [ttsVoiceSelections, setTtsVoiceSelections] = useState(stored?.ttsVoiceSelections || { en: "", ur: "" });
  const [storageLabel, setStorageLabel] = useState("IndexedDB + localStorage");
  const [reviewStats, setReviewStats] = useState({ due: 0, mastered: 0, learning: 0, reviewedToday: 0, retentionRate: 0, reviewStreak: 0 });
  const [reviewLibrary, setReviewLibrary] = useState([]);
  const [studyMetaLookup, setStudyMetaLookup] = useState({});
  const [reviewAnalytics, setReviewAnalytics] = useState({ heatmap: [], weakWords: [], favoriteWords: [], notedWords: [], customLists: [], wordGrowth: [], categoryPerformance: [], totals: { reviewedLastPeriod: 0, reviewedLast7: 0, uniqueReviewedLast7: 0, favorites: 0, notedWords: 0, customLists: 0 } });
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [reviewReveal, setReviewReveal] = useState(false);
  const [reviewSessionDone, setReviewSessionDone] = useState(false);
  const [reviewSessionXp, setReviewSessionXp] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [practiceMode, setPracticeMode] = useState(null);
  const [practiceDeck, setPracticeDeck] = useState([]);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceReveal, setPracticeReveal] = useState(false);
  const [practiceTypingInput, setPracticeTypingInput] = useState("");
  const [practiceTypingResult, setPracticeTypingResult] = useState(null);
  const [practiceMatchRound, setPracticeMatchRound] = useState(null);
  const [practiceMatchSelection, setPracticeMatchSelection] = useState(null);
  const [practiceSessionStats, setPracticeSessionStats] = useState({ attempted: 0, correct: 0 });
  const [viewTargetId, setViewTargetId] = useState(null);
  const [pageFlashActive, setPageFlashActive] = useState(false);
  const [heatmapExpanded, setHeatmapExpanded] = useState(false);
  const [customListDraft, setCustomListDraft] = useState("");
  const [studyGoals, setStudyGoals] = useState(stored?.studyGoals || { dailyReviews: 20, weeklyWords: 40 });
  const [focusTimerSettings, setFocusTimerSettings] = useState(stored?.focusTimerSettings || { durationMinutes: 20, autoStartBreak: false });
  const [focusTimerState, setFocusTimerState] = useState({ active: false, remainingSeconds: (Number(stored?.focusTimerSettings?.durationMinutes) || 20) * 60, startedAt: null, completedSessions: 0 });
  const [reminderSettings, setReminderSettings] = useState(stored?.reminderSettings || { enabled: false, time: "18:00", notifications: false, lastShownDay: null });
  const [navPosition, setNavPosition] = useState(["bottom", "right", "left", "top"].includes(stored?.navPosition) ? stored.navPosition : "top");
  const [navAutoHide, setNavAutoHide] = useState(Boolean(stored?.navAutoHide));
  const [navHidden, setNavHidden] = useState(false);
  const [navBarAutoHide, setNavBarAutoHide] = useState(Boolean(stored?.navBarAutoHide));
  const [navBarHidden, setNavBarHidden] = useState(false);
  const [transitionMode, setTransitionMode] = useState(["none", "fade", "slide", "zoom"].includes(stored?.transitionMode) ? stored.transitionMode : "slide");
  const [notificationHistory, setNotificationHistory] = useState(Array.isArray(stored?.notificationHistory) ? stored.notificationHistory : []);
  const [profileDisclosureOpen, setProfileDisclosureOpen] = useState(false);
  const [gradeDisclosureOpen, setGradeDisclosureOpen] = useState(false);
  const [resolvedTheme, setResolvedTheme] = useState(getResolvedTheme(stored?.themeMode || "dark"));
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [installAvailability, setInstallAvailability] = useState(isStandaloneMode() ? "installed" : "unavailable");
  const [installBannerDismissed, setInstallBannerDismissed] = useState(Boolean(stored?.installBannerDismissed));
  const [isInstalled, setIsInstalled] = useState(isStandaloneMode());
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState(window.location.protocol === "file:" ? "local-static" : "checking");
  const [isOnline, setIsOnline] = useState(navigator.onLine !== false);
  const chatEndRef = useRef(null);
  const headerRef = useRef(null);
  const headerHideTimerRef = useRef(null);
  const navBarRef = useRef(null);
  const navBarHideTimerRef = useRef(null);
  const [headerHideOffset, setHeaderHideOffset] = useState(0);
  const [navBarOffset, setNavBarOffset] = useState(0);

  // ─── DB-backed data state ───
  const [dbLoaded, setDbLoaded] = useState(false);
  const [dbPos, setDbPos] = useState({});
  const [dbTenses, setDbTenses] = useState({});
  const [dbVocab, setDbVocab] = useState([]);
  const daySectionSettings = buildDaySectionSettings(language, daySectionOverrides);
  const activeReviewCard = reviewQueue[reviewIdx] || null;
  const isLightTheme = resolvedTheme === "light";
  const revealToggleBaseStyle = {
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    minWidth: 56,
    transition: "all 0.2s",
  };
  const getRevealToggleStyle = (revealed, isUr) => ({
    ...revealToggleBaseStyle,
    border: `1.5px solid ${revealed ? "#22C55E55" : "var(--border)"}`,
    background: revealed ? (isLightTheme ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.12)") : "var(--bg-elevated)",
    color: revealed ? (isLightTheme ? "#166534" : "#22C55E") : "var(--text-secondary)",
    fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif",
  });
  const revealedAnswerButtonStyle = {
    background: isLightTheme ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.14)",
    border: "1px solid rgba(34,197,94,0.35)",
    color: isLightTheme ? "#14532D" : "#ECFDF5",
    padding: "8px 14px",
  };
  const getRevealedAnswerTextStyle = (isUrdu) => ({
    fontSize: 16,
    lineHeight: 1.5,
    whiteSpace: "pre-line",
    fontFamily: isUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit",
    direction: isUrdu ? "rtl" : "ltr",
    textAlign: isUrdu ? "right" : "left",
    color: isLightTheme ? "#14532D" : undefined,
  });
  const wordProblemAnswerPanelStyle = {
    background: isLightTheme ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.08)",
    border: "1px solid rgba(34,197,94,0.28)",
    borderRadius: 12,
    padding: "10px 10px 6px",
  };
  const wordProblemAnswerLabelStyle = (isUr) => ({
    color: isLightTheme ? "#166534" : "#86EFAC",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: 6,
    fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif",
  });
  const reviewRevealCardStyle = {
    padding: "16px 18px",
    borderRadius: 16,
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    marginBottom: 16,
  };
  const reviewAnswerButtonStyle = {
    marginBottom: 8,
    background: isLightTheme ? "rgba(34,197,94,0.14)" : "rgba(51,65,85,0.5)",
    border: "1px solid var(--border)",
    color: "var(--text-primary)",
  };
  const reviewExampleButtonStyle = {
    marginBottom: 0,
    background: isLightTheme ? "rgba(2,132,199,0.08)" : "rgba(30,41,59,0.42)",
    border: "1px solid var(--border)",
    color: "var(--text-secondary)",
  };
  const dayGroupBackButtonStyle = {
    width: "auto",
    marginTop: 0,
    padding: "10px 14px",
    background: isLightTheme
      ? "linear-gradient(135deg,rgba(226,232,240,0.96),rgba(241,245,249,0.98))"
      : "linear-gradient(135deg,#475569,#334155)",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  };

  const refreshStorageLabel = useCallback(async () => {
    if (!window.HomeSchoolDB) {
      setStorageLabel(await getStorageEstimateLabel("localStorage"));
      return;
    }
    const stats = await window.HomeSchoolDB.getStats();
    const quotaLabel = await getStorageEstimateLabel(`IndexedDB • ${stats.coreData || 0} lessons`);
    const lessonCountLabel = joinLocalizedText(`${stats.coreData || 0} lessons`, `${stats.coreData || 0} اسباق`, language);
    setStorageLabel(`${quotaLabel} • ${lessonCountLabel}`);
  }, [language]);

  const refreshReviewStats = useCallback(async () => {
    if (!window.HomeSchoolDB) return;
    const [nextStats, nextLibrary, nextAnalytics, nextMetaRows] = await Promise.all([
      window.HomeSchoolDB.getReviewStats().catch(() => ({})),
      window.HomeSchoolDB.getReviewLibrary().catch(() => []),
      window.HomeSchoolDB.getReviewAnalytics().catch(() => null),
      window.HomeSchoolDB.getAllStudyMeta().catch(() => []),
    ]);
    setStudyMetaLookup((nextMetaRows || []).reduce((acc, row) => {
      if (row?.id) acc[row.id] = row;
      return acc;
    }, {}));
    setReviewStats(buildReviewStatsFallback(nextStats, nextLibrary, nextAnalytics));
  }, []);

  const refreshReviewWorkspace = useCallback(async () => {
    if (!window.HomeSchoolDB) return;
    const [statsResult, libraryResult, analyticsResult, metaResult] = await Promise.allSettled([
      window.HomeSchoolDB.getReviewStats(),
      window.HomeSchoolDB.getReviewLibrary(),
      window.HomeSchoolDB.getReviewAnalytics(),
      window.HomeSchoolDB.getAllStudyMeta(),
    ]);
    const nextLibrary = libraryResult.status === "fulfilled" ? libraryResult.value : [];
    const nextAnalytics = analyticsResult.status === "fulfilled"
      ? analyticsResult.value
      : { heatmap: [], weakWords: [], favoriteWords: [], notedWords: [], customLists: [], wordGrowth: [], categoryPerformance: [], totals: { reviewedLastPeriod: 0, reviewedLast7: 0, uniqueReviewedLast7: 0, favorites: 0, notedWords: 0, customLists: 0 } };
    const nextMetaRows = metaResult.status === "fulfilled" ? metaResult.value : [];
    if (libraryResult.status !== "fulfilled") {
      console.log("Unable to refresh review library:", libraryResult.reason);
    }
    if (analyticsResult.status !== "fulfilled") {
      console.log("Unable to refresh review analytics:", analyticsResult.reason);
    }
    if (statsResult.status !== "fulfilled") {
      console.log("Unable to refresh review stats:", statsResult.reason);
    }
    if (metaResult.status !== "fulfilled") {
      console.log("Unable to refresh study metadata:", metaResult.reason);
    }
    setReviewLibrary(nextLibrary);
    setReviewAnalytics(nextAnalytics);
    setStudyMetaLookup((nextMetaRows || []).reduce((acc, row) => {
      if (row?.id) acc[row.id] = row;
      return acc;
    }, {}));
    setReviewStats(buildReviewStatsFallback(statsResult.status === "fulfilled" ? statsResult.value : {}, nextLibrary, nextAnalytics));
  }, []);

  const pushNotificationHistoryEntry = useCallback((entry) => {
    if (!entry) return;
    setNotificationHistory((current) => {
      const nextEntry = createNotificationEntry(
        entry.type || "info",
        entry.titleEn || "HomeSchool",
        entry.titleUr || "ہوم اسکول",
        entry.bodyEn || "",
        entry.bodyUr || "",
        entry.createdAt || Date.now(),
        { dedupeKey: entry.dedupeKey || null },
      );
      if (nextEntry.dedupeKey && current.some((item) => item?.dedupeKey === nextEntry.dedupeKey)) {
        return current;
      }
      return [nextEntry, ...(current || [])].slice(0, 40);
    });
  }, []);

  const clearNotificationHistory = useCallback(() => {
    setNotificationHistory([]);
  }, []);

  if (!persistCustomizationRef.current) {
    persistCustomizationRef.current = debounce(async (nextPayload) => {
      try {
        if (window.HomeSchoolDB) {
          await window.HomeSchoolDB.saveCustomization("preferences", {
            ttsEnabled: nextPayload.ttsEnabled,
            language: nextPayload.language,
            themeMode: nextPayload.themeMode,
            navPosition: nextPayload.navPosition,
            navAutoHide: nextPayload.navAutoHide,
            navBarAutoHide: nextPayload.navBarAutoHide,
            transitionMode: nextPayload.transitionMode,
          });
          await window.HomeSchoolDB.saveCustomization("audioPreferences", {
            ttsRate: nextPayload.ttsRate,
            ttsVoiceSelections: nextPayload.ttsVoiceSelections || { en: "", ur: "" },
          });
          await window.HomeSchoolDB.saveCustomization("reviewPreferences", {
            dailyReviewCap: nextPayload.dailyReviewCap,
          });
          await window.HomeSchoolDB.saveCustomization("daySectionPacing", nextPayload.daySectionOverrides || {});
          await window.HomeSchoolDB.saveCustomization("studyGoals", nextPayload.studyGoals || { dailyReviews: 20, weeklyWords: 40 });
          await window.HomeSchoolDB.saveCustomization("focusTimerSettings", nextPayload.focusTimerSettings || { durationMinutes: 20, autoStartBreak: false });
          await window.HomeSchoolDB.saveCustomization("reminderSettings", nextPayload.reminderSettings || { enabled: false, time: "18:00", notifications: false, lastShownDay: null });
          await window.HomeSchoolDB.saveCustomization("notificationHistory", (nextPayload.notificationHistory || []).slice(0, 40));
          await window.HomeSchoolDB.saveCustomization("studentProfile", {
            grade: nextPayload.grade,
            studentName: nextPayload.studentName,
            studentNameUr: nextPayload.studentNameUr,
          });
          await window.HomeSchoolDB.saveCustomization("aiProviderConfigs", nextPayload.aiProviderConfigs || createDefaultAiProviderConfigs());
          await window.HomeSchoolDB.saveCustomization("aiTutorPreferences", {
            providerId: nextPayload.selectedAiProvider || "openai",
          });
        } else {
          localStorageFallback("hs_ai_provider_configs", nextPayload.aiProviderConfigs || createDefaultAiProviderConfigs());
          localStorageFallback("hs_ai_tutor_preferences", {
            providerId: nextPayload.selectedAiProvider || "openai",
          });
        }
      } catch (error) {
        console.log("Unable to persist customizations:", error);
      }
    }, 250);
  }

  // Load from IndexedDB on mount
  useEffect(() => {
    if (!window.HomeSchoolDB) {
      const fallbackAiConfigs = sanitizeAiProviderConfigs(localStorageFallback("hs_ai_provider_configs") || {});
      const fallbackAiTutorPreferences = localStorageFallback("hs_ai_tutor_preferences") || {};
      setAiProviderConfigs(fallbackAiConfigs);
      setAiProviderDrafts(fallbackAiConfigs);
      if (fallbackAiTutorPreferences?.providerId) setSelectedAiProvider(fallbackAiTutorPreferences.providerId);
      setDbLoaded(true);
      return;
    }
    (async () => {
      try {
        await window.HomeSchoolDB.ensureSeeded(window.HomeSchoolData);
        const pos = await window.HomeSchoolDB.getAllPosTypes();
        if (Object.keys(pos).length > 0) setDbPos(pos);
        const tens = await window.HomeSchoolDB.getAllTenses();
        if (Object.keys(tens).length > 0) setDbTenses(tens);
        const voc = await window.HomeSchoolDB.getVocab();
        if (voc.length > 0) setDbVocab(voc);
        const customizations = await window.HomeSchoolDB.getCustomizationsMap();
        const storedPreferences = customizations.preferences?.data || null;
        const storedAudioPreferences = customizations.audioPreferences?.data || null;
        const storedReviewPreferences = customizations.reviewPreferences?.data || null;
        const storedPacing = customizations.daySectionPacing?.data || null;
        const storedGoals = customizations.studyGoals?.data || null;
        const storedFocusTimer = customizations.focusTimerSettings?.data || null;
        const storedReminderSettings = customizations.reminderSettings?.data || null;
        const storedNotificationHistory = customizations.notificationHistory?.data || null;
        const storedProfile = customizations.studentProfile?.data || null;
        const storedAiProviders = sanitizeAiProviderConfigs(customizations.aiProviderConfigs?.data || {});
        const storedAiTutor = customizations.aiTutorPreferences?.data || null;
        if (storedPreferences) {
          if (typeof storedPreferences.language !== "undefined") setLanguage(storedPreferences.language);
          if (typeof storedPreferences.ttsEnabled !== "undefined") setTtsEnabled(storedPreferences.ttsEnabled);
          if (typeof storedPreferences.themeMode !== "undefined") setThemeMode(storedPreferences.themeMode);
          if (typeof storedPreferences.navPosition !== "undefined" && ["bottom", "right", "left", "top"].includes(storedPreferences.navPosition)) setNavPosition(storedPreferences.navPosition);
          if (typeof storedPreferences.navAutoHide !== "undefined") setNavAutoHide(Boolean(storedPreferences.navAutoHide));
          if (typeof storedPreferences.navBarAutoHide !== "undefined") setNavBarAutoHide(Boolean(storedPreferences.navBarAutoHide));
          if (typeof storedPreferences.transitionMode !== "undefined" && ["none", "fade", "slide", "zoom"].includes(storedPreferences.transitionMode)) setTransitionMode(storedPreferences.transitionMode);
        }
        if (storedAudioPreferences) {
          if (typeof storedAudioPreferences.ttsRate !== "undefined") {
            setTtsRate(Math.max(0.6, Math.min(1.3, Number(storedAudioPreferences.ttsRate) || 0.85)));
          }
          if (storedAudioPreferences.ttsVoiceSelections && typeof storedAudioPreferences.ttsVoiceSelections === "object") {
            setTtsVoiceSelections({
              en: storedAudioPreferences.ttsVoiceSelections.en || "",
              ur: storedAudioPreferences.ttsVoiceSelections.ur || "",
            });
          }
        }
        if (storedReviewPreferences) {
          if (typeof storedReviewPreferences.dailyReviewCap !== "undefined") {
            setDailyReviewCap(Math.max(5, Math.min(50, Number(storedReviewPreferences.dailyReviewCap) || 20)));
          }
        }
        if (storedPacing && typeof storedPacing === "object") {
          setDaySectionOverrides(storedPacing);
        }
        if (storedGoals && typeof storedGoals === "object") {
          setStudyGoals({
            dailyReviews: Math.max(5, Math.min(60, Number(storedGoals.dailyReviews) || 20)),
            weeklyWords: Math.max(10, Math.min(140, Number(storedGoals.weeklyWords) || 40)),
          });
        }
        if (storedFocusTimer && typeof storedFocusTimer === "object") {
          const nextMinutes = Math.max(5, Math.min(60, Number(storedFocusTimer.durationMinutes) || 20));
          setFocusTimerSettings({
            durationMinutes: nextMinutes,
            autoStartBreak: Boolean(storedFocusTimer.autoStartBreak),
          });
          setFocusTimerState((current) => ({
            ...current,
            remainingSeconds: nextMinutes * 60,
          }));
        }
        if (storedReminderSettings && typeof storedReminderSettings === "object") {
          setReminderSettings({
            enabled: Boolean(storedReminderSettings.enabled),
            time: storedReminderSettings.time || "18:00",
            notifications: Boolean(storedReminderSettings.notifications),
            lastShownDay: storedReminderSettings.lastShownDay || null,
          });
        }
        if (Array.isArray(storedNotificationHistory)) {
          setNotificationHistory(storedNotificationHistory.slice(0, 40));
        }
        if (storedProfile) {
          if (typeof storedProfile.grade !== "undefined") setGrade(storedProfile.grade);
          if (typeof storedProfile.studentName !== "undefined") setStudentName(storedProfile.studentName || "");
          if (typeof storedProfile.studentNameUr !== "undefined") setStudentNameUr(storedProfile.studentNameUr || "");
        }
        setAiProviderConfigs(storedAiProviders);
        setAiProviderDrafts(storedAiProviders);
        if (storedAiTutor?.providerId) setSelectedAiProvider(storedAiTutor.providerId);
        const progressMap = await window.HomeSchoolDB.getProgressMap();
        if (Object.keys(progressMap).length > 0 && (!stored?.completedQuizzes || Object.keys(stored.completedQuizzes).length === 0)) {
          setCompletedQuizzes(progressMap);
        }
        const persistedStats = await window.HomeSchoolDB.getUserStats();
        if (persistedStats && persistedStats.totalQuizzes > 0 && !stored?.totalQuizzesDone) {
          setTotalQuizzesDone(persistedStats.totalQuizzes || 0);
          setTotalScore(persistedStats.totalScore || 0);
          setStreak(persistedStats.streak || 0);
          setLastQuizDate(persistedStats.lastQuizDate || null);
          setEarnedBadges(persistedStats.badges || []);
          setXp(persistedStats.xp || 0);
        }
        await refreshStorageLabel();
        if (versionManagerRef.current) {
          const versionState = await versionManagerRef.current.checkForUpdates(window.HomeSchoolData.VERSION, window.HomeSchoolData);
          setCurrentVersion(versionState.newVersion || window.HomeSchoolData.VERSION);
          setUpdateAvailable(versionState.needsUpdate);
        }
        await refreshReviewWorkspace();
      } catch(e) { console.log("DB load fallback to inline:", e); }
      setDbLoaded(true);
    })();
  }, []);

  // Resolve data: use DB if available, fallback to inline constants
  const POS = {
    adverbs: dbPos.adverbs || ADVERBS_DATA,
    prepositions: dbPos.prepositions || PREPOSITIONS_DATA,
    adjectives: dbPos.adjectives || ADJECTIVES_DATA,
    conjunctions: dbPos.conjunctions || CONJUNCTIONS_DATA,
    pronouns: dbPos.pronouns || PRONOUNS_DATA,
    collectiveNouns: dbPos.collectiveNouns || COLLECTIVE_NOUNS_DATA,
    verbs: dbPos.verbs || VERBS_DATA,
  };
  const TENSES = (dbTenses && Object.keys(dbTenses).length > 0) ? dbTenses : TENSES_DATA;
  const VOCAB = dbVocab.length > 0 ? dbVocab : VOCABULARY_DATA;
  const pacedPos = {
    adverbs: regroupDayEntries(POS.adverbs, daySectionSettings.adverbs.itemsPerDay),
    prepositions: regroupDayEntries(POS.prepositions, daySectionSettings.prepositions.itemsPerDay),
    adjectives: regroupDayEntries(POS.adjectives, daySectionSettings.adjectives.itemsPerDay),
    conjunctions: regroupDayEntries(POS.conjunctions, daySectionSettings.conjunctions.itemsPerDay),
    pronouns: regroupDayEntries(POS.pronouns, daySectionSettings.pronouns.itemsPerDay),
    collectiveNouns: regroupDayEntries(POS.collectiveNouns, daySectionSettings.collectiveNouns.itemsPerDay),
    verbs: regroupDayEntries(POS.verbs, daySectionSettings.verbs.itemsPerDay),
  };
  const pacedVocab = regroupDayEntries(VOCAB, daySectionSettings.vocabulary.itemsPerDay);
  const activeLessonSubs = selectedLesson?.hasMathSub
    ? (selectedLesson.key === "sentences"
      ? buildDerivedSentenceSub(selectedLesson.subs || [], daySectionSettings.sentences.itemsPerDay, selectedSubject?.id)
      : (selectedLesson.subs || []).map((sub) => {
        const settingKey = getSubsectionSettingKey(sub.t);
        if (!settingKey) return sub;
        return buildDerivedDayBasedSub(sub, settingKey, daySectionSettings[settingKey]?.itemsPerDay || 5, selectedSubject?.id);
      }))
    : [];

  const buildViewSource = useCallback((overrides = {}) => {
    const currentPosDay = posTab === "adverbs"
      ? selectedAdverbDay
      : posTab === "prepositions"
        ? selectedPrepDay
        : posTab === "adjectives"
          ? selectedAdjDay
          : posTab === "conjunctions"
            ? selectedConjDay
            : posTab === "pronouns"
              ? selectedPronDay
              : posTab === "nouns"
                ? selectedNounDay
                : posTab === "verbs"
                  ? selectedVerbDay
                  : null;
    const activeSub = mathSubIdx !== null ? (activeLessonSubs?.[mathSubIdx] || null) : null;
    const activeExerciseGroup = activeSub?.exerciseGroups && subExerciseGroupIdx !== null ? activeSub.exerciseGroups[subExerciseGroupIdx] : null;
    const activeQuizGroup = activeSub?.quizGroups && subQuizGroupIdx !== null ? activeSub.quizGroups[subQuizGroupIdx] : null;
    const derived = {
      subject: selectedSubject?.id || "english",
      lessonKey: selectedLesson?.key || null,
      lessonTitle: selectedLesson?.title || null,
    };

    if (selectedLesson?.hasAdverbs) {
      derived.lessonMode = "adverbs";
      derived.posTab = posTab;
      derived.day = currentPosDay?.day || null;
    } else if (selectedLesson?.hasVocab) {
      derived.lessonMode = "vocab";
      derived.day = selectedVocabDay?.day || null;
    } else if (selectedLesson?.hasTenses || (selectedLesson?.hasMathSub && activeSub?.isTensesSub)) {
      derived.lessonMode = "tenses";
      derived.tenseMain = tenseMain;
      derived.tenseSub = tenseSub;
      derived.paragraphTitle = selectedTensePara?.title || null;
    } else if (selectedLesson?.hasMathSub && activeSub) {
      derived.subIndex = mathSubIdx;
      derived.subTitle = activeSub.t;
      derived.subTab = mathSubTab;
      derived.groupLabel = activeExerciseGroup?.label || activeQuizGroup?.label || null;
    }

    return {
      ...derived,
      ...overrides,
    };
  }, [activeLessonSubs, mathSubIdx, mathSubTab, posTab, selectedAdverbDay, selectedAdjDay, selectedConjDay, selectedLesson, selectedNounDay, selectedPrepDay, selectedPronDay, selectedSubject, selectedTensePara, selectedVerbDay, selectedVocabDay, subExerciseGroupIdx, subQuizGroupIdx, tenseMain, tenseSub]);

  const inferViewSource = useCallback((card) => {
    if (!card) return null;
    const rawSource = card.source || null;
    const posSettingMap = {
      adverbs: "adverbs",
      prepositions: "prepositions",
      adjectives: "adjectives",
      conjunctions: "conjunctions",
      pronouns: "pronouns",
      nouns: "collectiveNouns",
      collectiveNouns: "collectiveNouns",
      verbs: "verbs",
    };

    if (rawSource?.subject === "english") {
      if (rawSource.lessonMode === "adverbs" || ["adverbs", "prepositions", "adjectives", "conjunctions", "pronouns", "collectiveNouns", "verbs"].includes(card.section)) {
        const posTabValue = rawSource.posTab || (card.section === "collectiveNouns" ? "nouns" : card.section) || "adverbs";
        return {
          subject: "english",
          lessonKey: "parts_of_speech",
          subSettingKey: posSettingMap[posTabValue] || posSettingMap[card.section] || "adverbs",
          posTab: posTabValue,
          day: rawSource.day ?? card.day ?? null,
        };
      }
      if (rawSource.lessonMode === "vocab" || card.section === "vocabulary") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsMeanings",
          day: rawSource.day ?? card.day ?? null,
        };
      }
      if ((rawSource.lessonKey === "sentences" && rawSource.subSettingKey === "adverbPhrases") || card.section === "adverbPhrases") {
        return {
          subject: "english",
          lessonKey: "phrases",
          subSettingKey: "adverbPhrases",
          day: rawSource.day ?? card.day ?? null,
        };
      }
      if ((rawSource.lessonKey === "sentences" && rawSource.subSettingKey === "opposites") || card.section === "opposites") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsOpposites",
          day: rawSource.day ?? card.day ?? null,
        };
      }
      if ((rawSource.lessonKey === "sentences" && rawSource.subSettingKey === "sentences") || card.section === "sentences") {
        return {
          subject: "english",
          lessonKey: "sentences",
          day: rawSource.day ?? card.day ?? null,
        };
      }
      if (rawSource.lessonKey || rawSource.lessonTitle || rawSource.subTitle) {
        return rawSource;
      }
    }
    if (card.subject === "english") {
      if (["adverbs", "prepositions", "adjectives", "conjunctions", "pronouns", "collectiveNouns", "verbs"].includes(card.section)) {
        return {
          subject: "english",
          lessonKey: "parts_of_speech",
          subSettingKey: card.section === "collectiveNouns" ? "collectiveNouns" : card.section,
          posTab: card.section === "collectiveNouns" ? "nouns" : card.section,
          day: card.day || null,
        };
      }
      if (card.section === "vocabulary") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsMeanings",
          day: card.day || null,
        };
      }
      if (card.section === "adverbPhrases") {
        return {
          subject: "english",
          lessonKey: "phrases",
          subSettingKey: "adverbPhrases",
          day: card.day || null,
        };
      }
      if (card.section === "opposites") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsOpposites",
          day: card.day || null,
        };
      }
      if (card.section === "sentences") {
        return {
          subject: "english",
          lessonKey: "sentences",
          day: card.day || null,
        };
      }
      if (String(card.section || "").toLowerCase().includes("tense")) {
        return {
          subject: "english",
          lessonMode: "tenses",
        };
      }
    }
    return card.source || null;
  }, []);

  const clearLessonSelections = useCallback(() => {
    setSelectedAdverbDay(null);
    setSelectedPrepDay(null);
    setSelectedAdjDay(null);
    setSelectedConjDay(null);
    setSelectedPronDay(null);
    setSelectedNounDay(null);
    setSelectedVerbDay(null);
    setSelectedTensePara(null);
    setSelectedVocabDay(null);
    setMathSubIdx(null);
    setMathSubTab("examples");
    setSubExerciseGroupIdx(null);
    setSubQuizGroupIdx(null);
    setRevealedEx({});
    setPosTab("adverbs");
    setTenseMain("present");
    setTenseSub("simple");
  }, []);

  useEffect(() => { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices(); return () => window.speechSynthesis.cancel(); }, []);
  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPromptEvent(event);
      setInstallAvailability("available");
      setInstallBannerDismissed(false);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setInstallPromptEvent(null);
      setInstallAvailability("installed");
      setInstallBannerDismissed(false);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const standaloneMedia = window.matchMedia ? window.matchMedia("(display-mode: standalone)") : null;
    const syncStandalone = () => {
      const standalone = isStandaloneMode();
      setIsInstalled(standalone);
      if (standalone) {
        setInstallPromptEvent(null);
        setInstallAvailability("installed");
      }
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    if (standaloneMedia?.addEventListener) standaloneMedia.addEventListener("change", syncStandalone);
    else if (standaloneMedia?.addListener) standaloneMedia.addListener(syncStandalone);
    registerServiceWorker({
      onStatus: (status) => setServiceWorkerStatus(status),
      onError: () => setServiceWorkerStatus("error"),
    }).then((result) => {
      if (!result?.registered) {
        if (result?.reason === "file") setServiceWorkerStatus("local-static");
        else if (result?.reason === "unsupported" || result?.reason === "insecure") setServiceWorkerStatus("unsupported");
      }
    });
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (standaloneMedia?.removeEventListener) standaloneMedia.removeEventListener("change", syncStandalone);
      else if (standaloneMedia?.removeListener) standaloneMedia.removeListener(syncStandalone);
    };
  }, []);
  useEffect(() => {
    if (dbLoaded) refreshStorageLabel();
  }, [dbLoaded, language]);
  useEffect(() => {
    if (dbLoaded) hideLaunchSplash();
  }, [dbLoaded]);
  useEffect(() => {
    const applyTheme = () => {
      const nextResolvedTheme = applyThemeMode(themeMode);
      setResolvedTheme(nextResolvedTheme);
    };
    applyTheme();
    if (themeMode !== "system" || !window.matchMedia) return undefined;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => applyTheme();
    if (mediaQuery.addEventListener) mediaQuery.addEventListener("change", handleChange);
    else if (mediaQuery.addListener) mediaQuery.addListener(handleChange);
    return () => {
      if (mediaQuery.removeEventListener) mediaQuery.removeEventListener("change", handleChange);
      else if (mediaQuery.removeListener) mediaQuery.removeListener(handleChange);
    };
  }, [themeMode]);
  useEffect(() => {
    window.HomeSchoolPrefs = { ttsEnabled, language, themeMode, resolvedTheme, ttsRate, ttsVoiceSelections };
    if (!ttsEnabled) window.speechSynthesis.cancel();
  }, [ttsEnabled, language, themeMode, resolvedTheme, ttsRate, ttsVoiceSelections]);
  useEffect(() => {
    if (!dbLoaded) return;
    persistCustomizationRef.current?.({
      ttsEnabled,
      ttsRate,
      ttsVoiceSelections,
      language,
      themeMode,
      navPosition,
      navAutoHide,
      navBarAutoHide,
      transitionMode,
      dailyReviewCap,
      daySectionOverrides,
      studyGoals,
      focusTimerSettings,
      reminderSettings,
      notificationHistory,
      grade,
      studentName,
      studentNameUr,
      aiProviderConfigs,
      selectedAiProvider,
    });
  }, [dbLoaded, ttsEnabled, ttsRate, ttsVoiceSelections, language, themeMode, navPosition, navAutoHide, navBarAutoHide, transitionMode, dailyReviewCap, daySectionOverrides, studyGoals, focusTimerSettings, reminderSettings, notificationHistory, grade, studentName, studentNameUr, aiProviderConfigs, selectedAiProvider]);
  useEffect(() => {
    if (grade) saveState({ grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, ttsRate, ttsVoiceSelections, language, themeMode, navPosition, navAutoHide, navBarAutoHide, transitionMode, dailyReviewCap, daySectionOverrides, studyGoals, focusTimerSettings, reminderSettings, notificationHistory, installBannerDismissed });
  }, [grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, ttsRate, ttsVoiceSelections, language, themeMode, navPosition, navAutoHide, navBarAutoHide, transitionMode, dailyReviewCap, daySectionOverrides, studyGoals, focusTimerSettings, reminderSettings, notificationHistory, installBannerDismissed]);
  useEffect(() => {
    setNavHidden(Boolean(navAutoHide));
  }, [navPosition, navAutoHide]);
  useEffect(() => {
    setNavBarHidden(Boolean(navBarAutoHide && navPosition !== "top"));
  }, [navPosition, navBarAutoHide]);
  useEffect(() => {
    const headerNode = headerRef.current;
    if (!headerNode) return undefined;
    const updateOffset = () => setHeaderHideOffset(headerNode.offsetHeight || 0);
    updateOffset();
    if (window.ResizeObserver) {
      const observer = new window.ResizeObserver(() => updateOffset());
      observer.observe(headerNode);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [navPosition]);
  useEffect(() => {
    const navBarNode = navBarRef.current;
    if (!navBarNode) return undefined;
    const updateOffset = () => setNavBarOffset(navPosition === "bottom" ? (navBarNode.offsetHeight || 0) : (navBarNode.offsetWidth || 0));
    updateOffset();
    if (window.ResizeObserver) {
      const observer = new window.ResizeObserver(() => updateOffset());
      observer.observe(navBarNode);
      return () => observer.disconnect();
    }
    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, [navPosition, navBarHidden]);
  const revealAutoHideHeader = useCallback(() => {
    if (!navAutoHide) return;
    if (headerHideTimerRef.current) {
      window.clearTimeout(headerHideTimerRef.current);
      headerHideTimerRef.current = null;
    }
    setNavHidden(false);
  }, [navAutoHide]);
  const concealAutoHideHeader = useCallback(() => {
    if (!navAutoHide) return;
    if (headerHideTimerRef.current) window.clearTimeout(headerHideTimerRef.current);
    headerHideTimerRef.current = window.setTimeout(() => {
      setNavHidden(true);
      headerHideTimerRef.current = null;
    }, 140);
  }, [navAutoHide]);
  const revealAutoHideNavBar = useCallback(() => {
    if (!navBarAutoHide || navPosition === "top") return;
    if (navBarHideTimerRef.current) {
      window.clearTimeout(navBarHideTimerRef.current);
      navBarHideTimerRef.current = null;
    }
    setNavBarHidden(false);
  }, [navBarAutoHide, navPosition]);
  const concealAutoHideNavBar = useCallback(() => {
    if (!navBarAutoHide || navPosition === "top") return;
    if (navBarHideTimerRef.current) window.clearTimeout(navBarHideTimerRef.current);
    navBarHideTimerRef.current = window.setTimeout(() => {
      setNavBarHidden(true);
      navBarHideTimerRef.current = null;
    }, 140);
  }, [navBarAutoHide, navPosition]);
  useEffect(() => {
    setNavHidden(Boolean(navAutoHide));
    setNavBarHidden(Boolean(navBarAutoHide && navPosition !== "top"));
  }, [tab, selectedSubject, selectedLesson, selectedAdverbDay, selectedPrepDay, selectedAdjDay, selectedConjDay, selectedPronDay, selectedNounDay, selectedVerbDay, selectedTensePara, selectedVocabDay, quizActive, quizDone, subExerciseGroupIdx, subQuizGroupIdx, mathSubIdx, practiceMode, reviewIdx, reviewSessionDone, navAutoHide, navBarAutoHide, navPosition]);
  useEffect(() => () => {
    if (headerHideTimerRef.current) {
      window.clearTimeout(headerHideTimerRef.current);
      headerHideTimerRef.current = null;
    }
    if (navBarHideTimerRef.current) {
      window.clearTimeout(navBarHideTimerRef.current);
      navBarHideTimerRef.current = null;
    }
  }, []);
  useEffect(() => {
    if (!window.speechSynthesis) return undefined;
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices?.() || [];
      setAvailableVoices(voices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      if (window.speechSynthesis.onvoiceschanged === loadVoices) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);
  useEffect(() => {
    const nextMinutes = Math.max(5, Math.min(60, Number(focusTimerSettings?.durationMinutes) || 20));
    if (!focusTimerState.active) {
      setFocusTimerState((current) => ({
        ...current,
        remainingSeconds: nextMinutes * 60,
      }));
    }
  }, [focusTimerSettings?.durationMinutes]);
  useEffect(() => {
    if (!focusTimerState.active) return undefined;
    const timerId = window.setInterval(() => {
      setFocusTimerState((current) => {
        if (!current.active) return current;
        if ((current.remainingSeconds || 0) <= 1) {
          pushNotificationHistoryEntry({
            type: "timer",
            titleEn: "Focus session complete",
            titleUr: "فوکس سیشن مکمل",
            bodyEn: "Your timer finished. Take a short break or start the next study sprint.",
            bodyUr: "آپ کا ٹائمر مکمل ہو گیا۔ تھوڑا آرام کریں یا اگلا مطالعہ سیشن شروع کریں۔",
          });
          try {
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("HomeSchool", { body: "Your focus session is complete." });
            }
          } catch (error) {
            console.log("Unable to show focus timer notification:", error);
          }
          return {
            ...current,
            active: false,
            remainingSeconds: 0,
            completedSessions: (current.completedSessions || 0) + 1,
          };
        }
        return {
          ...current,
          remainingSeconds: (current.remainingSeconds || 0) - 1,
        };
      });
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [focusTimerState.active, pushNotificationHistoryEntry]);
  useEffect(() => {
    if (!reminderSettings?.enabled) return undefined;
    const checkReminder = () => {
      const now = new Date();
      const todayKey = window.HomeSchoolUtils.getDayKey(now);
      const [hours, minutes] = String(reminderSettings.time || "18:00").split(":").map((part) => Number(part) || 0);
      const scheduledAt = new Date(now);
      scheduledAt.setHours(hours, minutes, 0, 0);
      if (now.getTime() < scheduledAt.getTime()) return;
      if (reminderSettings.lastShownDay === todayKey) return;
      const nextSettings = {
        ...reminderSettings,
        lastShownDay: todayKey,
      };
      setReminderSettings(nextSettings);
      pushNotificationHistoryEntry({
        type: "reminder",
        titleEn: "Study reminder",
        titleUr: "مطالعہ یاد دہانی",
        bodyEn: "Your study goal is waiting. Open HomeSchool and keep the streak going.",
        bodyUr: "آپ کا مطالعہ ہدف انتظار کر رہا ہے۔ ہوم اسکول کھولیں اور اپنا تسلسل جاری رکھیں۔",
        dedupeKey: `reminder_${todayKey}_${reminderSettings.time || "18:00"}`,
      });
      if (reminderSettings.notifications && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("HomeSchool Study Reminder", {
            body: "Your study goal is waiting. Open HomeSchool and keep the streak going.",
          });
        } catch (error) {
          console.log("Unable to show study reminder:", error);
        }
      }
    };
    checkReminder();
    const timerId = window.setInterval(checkReminder, 60000);
    return () => window.clearInterval(timerId);
  }, [reminderSettings, pushNotificationHistoryEntry]);
  useEffect(() => {
    setPendingReviewBadge(reviewStats.due || 0);
  }, [reviewStats.due]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);
  useEffect(() => {
    const readyProviders = AI_PROVIDER_ORDER.filter((providerId) => isAiProviderReady(aiProviderConfigs[providerId]));
    if (!readyProviders.length) return;
    if (!readyProviders.includes(selectedAiProvider)) {
      setSelectedAiProvider(readyProviders[0]);
    }
  }, [aiProviderConfigs, selectedAiProvider]);
  useEffect(() => {
    if (tab === "tutor" && !AI_PROVIDER_ORDER.some((providerId) => isAiProviderReady(aiProviderConfigs[providerId]))) {
      setTab("settings");
    }
  }, [aiProviderConfigs, tab]);
  useEffect(() => {
    setSelectedAdverbDay(null);
    setSelectedPrepDay(null);
    setSelectedAdjDay(null);
    setSelectedConjDay(null);
    setSelectedPronDay(null);
    setSelectedNounDay(null);
    setSelectedVerbDay(null);
    setSelectedVocabDay(null);
    setMathSubIdx(null);
    setSubExerciseGroupIdx(null);
    setSubQuizGroupIdx(null);
  }, [daySectionOverrides]);

  const checkBadges = useCallback((qs, qt, si) => {
    const nb = [], all = [...earnedBadges];
    const ck = id => { if (!all.includes(id)) { all.push(id); nb.push(id); } };
    if (totalQuizzesDone === 0) ck("first_quiz"); if (qs === 4) ck("perfect");
    if (totalQuizzesDone + 1 >= 5) ck("five_quizzes"); if (totalQuizzesDone + 1 >= 10) ck("ten_quizzes");
    if (qt < 30) ck("speed_demon"); if (streak + 1 >= 3) ck("streak_3"); if (streak + 1 >= 7) ck("streak_7");
    const ds = new Set(Object.keys(completedQuizzes).map(k => k.split("_")[0])); ds.add(si);
    if (ds.size >= 5) ck("all_subjects");
    setEarnedBadges(all);
    setNewBadges(nb);
    return { all, nb };
  }, [earnedBadges, totalQuizzesDone, streak, completedQuizzes]);

  const handleDaySectionChange = useCallback((sectionKey, itemsPerDay) => {
    const sectionMeta = DAY_SECTION_META[sectionKey];
    if (!sectionMeta) return;
    const nextValue = Math.max(1, Math.min(sectionMeta.max, Number(itemsPerDay) || sectionMeta.defaultSize));
    setDaySectionOverrides((current) => ({
      ...current,
      [sectionKey]: { itemsPerDay: nextValue },
    }));
  }, []);

  const handleTtsVoiceSelectionChange = useCallback((langCode, voiceId) => {
    setTtsVoiceSelections((current) => ({
      ...current,
      [langCode]: voiceId || "",
    }));
  }, []);

  const handleStudyGoalChange = useCallback((key, value) => {
    setStudyGoals((current) => ({
      ...current,
      [key]: key === "dailyReviews"
        ? Math.max(5, Math.min(60, Number(value) || current.dailyReviews || 20))
        : Math.max(10, Math.min(140, Number(value) || current.weeklyWords || 40)),
    }));
  }, []);

  const handleFocusTimerSettingChange = useCallback((durationMinutes) => {
    const nextMinutes = Math.max(5, Math.min(60, Number(durationMinutes) || 20));
    setFocusTimerSettings((current) => ({
      ...current,
      durationMinutes: nextMinutes,
    }));
  }, []);

  const handleReminderSettingsChange = useCallback((nextPartial) => {
    setReminderSettings((current) => ({
      ...current,
      ...nextPartial,
    }));
  }, []);

  const handleRequestNotificationPermission = useCallback(async () => {
    if (!("Notification" in window)) return;
    try {
      const result = await Notification.requestPermission();
      if (result === "granted") {
        setReminderSettings((current) => ({ ...current, notifications: true }));
      }
    } catch (error) {
      console.log("Unable to request notification permission:", error);
    }
  }, []);

  const handleAiProviderDraftChange = useCallback((providerId, field, value) => {
    setAiProviderDrafts((current) => ({
      ...current,
      [providerId]: {
        ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
        [field]: value,
      },
    }));
  }, []);

  const saveAiProviderConfiguration = useCallback(async (providerId, overrides = null) => {
    const definition = AI_PROVIDER_DEFS[providerId];
    if (!definition) return null;
    const source = overrides || aiProviderDrafts[providerId] || aiProviderConfigs[providerId] || createDefaultAiProviderConfigs()[providerId];
    const apiKey = String(source.apiKey || "").trim();
    const requestedModel = String(source.model || definition.defaultModel).trim() || definition.defaultModel;
    if (!apiKey) {
      setAiProviderConfigs((current) => ({
        ...current,
        [providerId]: {
          ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
          apiKey: "",
          status: "empty",
          lastError: "",
          validatedAt: null,
          model: requestedModel,
        },
      }));
      return null;
    }

    setAiProviderBusy((current) => ({ ...current, [providerId]: true }));
    try {
      const validation = await validateAiProviderConfig(providerId, apiKey, requestedModel);
      const nextConfig = {
        apiKey,
        model: validation.model || requestedModel,
        models: normalizeAiModelList(providerId, validation.models, validation.model || requestedModel),
        status: validation.status || "ready",
        lastError: "",
        validatedAt: Date.now(),
      };
      setAiProviderConfigs((current) => ({ ...current, [providerId]: nextConfig }));
      setAiProviderDrafts((current) => ({ ...current, [providerId]: { ...nextConfig } }));
      if (!String(aiProviderConfigs[selectedAiProvider]?.apiKey || "").trim()) {
        setSelectedAiProvider(providerId);
      }
      return nextConfig;
    } catch (error) {
      const nextStatus = getAiStatusFromError(error);
      const nextConfig = {
        apiKey,
        model: requestedModel,
        models: normalizeAiModelList(providerId, source.models, requestedModel),
        status: nextStatus,
        lastError: getFriendlyAiErrorMessage(providerId, error, language),
        validatedAt: null,
      };
      setAiProviderConfigs((current) => ({ ...current, [providerId]: nextConfig }));
      setAiProviderDrafts((current) => ({ ...current, [providerId]: { ...nextConfig } }));
      return nextConfig;
    } finally {
      setAiProviderBusy((current) => ({ ...current, [providerId]: false }));
    }
  }, [aiProviderConfigs, aiProviderDrafts, language, selectedAiProvider]);

  const handleSaveAiProvider = useCallback(async (providerId) => {
    await saveAiProviderConfiguration(providerId);
  }, [saveAiProviderConfiguration]);

  const handleClearAiProvider = useCallback((providerId) => {
    const fallback = createDefaultAiProviderConfigs()[providerId];
    setAiProviderConfigs((current) => ({ ...current, [providerId]: fallback }));
    setAiProviderDrafts((current) => ({ ...current, [providerId]: fallback }));
  }, []);

  const handleAiTutorModelChange = useCallback((providerId, model) => {
    if (!providerId) return;
    setAiProviderConfigs((current) => ({
      ...current,
      [providerId]: {
        ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
        model,
        models: normalizeAiModelList(providerId, current[providerId]?.models, model),
      },
    }));
    setAiProviderDrafts((current) => ({
      ...current,
      [providerId]: {
        ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
        model,
      },
    }));
  }, []);

  const finishQuiz = async (ans, qs) => {
    const sc = ans.reduce((a, v, i) => a + (v === qs[i].c ? 1 : 0), 0);
    const el = (Date.now() - quizStartTime) / 1000, today = new Date().toDateString();
    const streakMode = calculateStreak(lastQuizDate, today);
    const ns = streakMode === "increment" ? streak + 1 : streakMode === null ? streak : 1;
    const earnedXp = calculateXP(sc, qs.length, el < 30);
    setTotalScore(s => s + sc); setTotalQuizzesDone(n => n + 1); setStreak(ns); setLastQuizDate(today);
    setXp(x => x + earnedXp);
    setCompletedQuizzes(p => ({ ...p, [selectedLesson.id]: { score: sc, total: qs.length, date: today } }));
    const badgeResult = checkBadges(sc, el, selectedSubject.id);
    if (window.HomeSchoolDB) {
      try {
        await window.HomeSchoolDB.saveQuizResult(selectedSubject.id, selectedLesson.id, sc, qs.length, el, grade, badgeResult.all);
      } catch (error) {
        console.log("Unable to persist quiz result:", error);
      }
    }
    setQuizDone(true);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    const savedProviders = AI_PROVIDER_ORDER.filter((providerId) => String(aiProviderConfigs[providerId]?.apiKey || "").trim());
    const availableProviders = savedProviders.filter((providerId) => isAiProviderReady(aiProviderConfigs[providerId]));
    if (!savedProviders.length) {
      setChatMessages((messages) => [...messages, { role: "ai", text: ui.aiConfigureFirst || "Add at least one AI provider key in Settings to use the tutor." }]);
      return;
    }
    if (!availableProviders.length) {
      setChatMessages((messages) => [...messages, { role: "ai", text: joinLocalizedText("Your saved AI providers need attention in Settings before Tutor can chat.", "ٹیوٹر چیٹ شروع کرنے سے پہلے آپ کے محفوظ اے آئی فراہم کنندگان کو ترتیبات میں درست کرنا ہوگا۔", language) }]);
      return;
    }
    const browserCapability = canUseDirectAiFromBrowser();
    if (!browserCapability.ok) {
      setChatMessages((messages) => [...messages, { role: "ai", text: ui.aiBrowserBlocked || "Direct browser AI access works best on the published HTTPS site or localhost, not from file mode." }]);
      return;
    }
    const providerId = availableProviders.includes(selectedAiProvider) ? selectedAiProvider : availableProviders[0];
    const providerConfig = aiProviderConfigs[providerId] || createDefaultAiProviderConfigs()[providerId];
    const providerDefinition = AI_PROVIDER_DEFS[providerId];
    const providerLabel = joinLocalizedText(providerDefinition.name, providerDefinition.nameUr, language);
    const model = providerConfig.model || providerDefinition.defaultModel;
    const conversation = [...chatMessages, { role: "user", text: msg }];
    setChatInput("");
    setChatMessages((messages) => [...messages, { role: "user", text: msg }]);
    setChatLoading(true);
    try {
      const answer = await requestAiTutorResponse(providerId, providerConfig.apiKey, model, conversation.filter((entry) => entry.role === "user" || entry.role === "ai"), buildTutorSystemPrompt(grade, language));
      setChatMessages((messages) => [...messages, { role: "ai", text: answer, provider: providerId }]);
    } catch (error) {
      const nextStatus = getAiStatusFromError(error);
      const nextFriendlyMessage = getFriendlyAiErrorMessage(providerId, error, language);
      setAiProviderConfigs((current) => ({
        ...current,
        [providerId]: {
          ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
          status: nextStatus,
          lastError: nextFriendlyMessage,
          validatedAt: nextStatus === "ready" ? Date.now() : null,
        },
      }));
      setAiProviderDrafts((current) => ({
        ...current,
        [providerId]: {
          ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
          status: nextStatus,
          lastError: nextFriendlyMessage,
        },
      }));
      if (error?.code === "auth") {
        const replacementKey = prompt(joinLocalizedText(`Your ${providerDefinition.name} key needs to be updated. Paste a new key to continue.`, `${providerDefinition.nameUr} کی کی دوبارہ درج کریں تاکہ چیٹ جاری رہ سکے۔`, language), "");
        if (replacementKey && replacementKey.trim()) {
          const nextDraft = {
            ...(aiProviderDrafts[providerId] || providerConfig),
            apiKey: replacementKey.trim(),
            model,
          };
          setAiProviderDrafts((current) => ({
            ...current,
            [providerId]: {
              ...(current[providerId] || providerConfig),
              apiKey: replacementKey.trim(),
              model,
            },
          }));
          const updatedConfig = await saveAiProviderConfiguration(providerId, nextDraft);
          if (updatedConfig?.apiKey) {
            try {
              const retryAnswer = await requestAiTutorResponse(providerId, updatedConfig.apiKey, updatedConfig.model || model, conversation.filter((entry) => entry.role === "user" || entry.role === "ai"), buildTutorSystemPrompt(grade, language));
              setChatMessages((messages) => [...messages, { role: "ai", text: retryAnswer, provider: providerId }]);
              setChatLoading(false);
              return;
            } catch (retryError) {
              const retryMessage = getFriendlyAiErrorMessage(providerId, retryError, language);
              setAiProviderConfigs((current) => ({
                ...current,
                [providerId]: {
                  ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
                  status: getAiStatusFromError(retryError),
                  lastError: retryMessage,
                  validatedAt: null,
                },
              }));
              setAiProviderDrafts((current) => ({
                ...current,
                [providerId]: {
                  ...(current[providerId] || createDefaultAiProviderConfigs()[providerId]),
                  status: getAiStatusFromError(retryError),
                  lastError: retryMessage,
                },
              }));
              setChatMessages((messages) => [...messages, { role: "ai", text: `${providerLabel}: ${retryMessage}` }]);
              setChatLoading(false);
              return;
            }
          }
        }
      }
      setChatMessages((messages) => [...messages, { role: "ai", text: `${providerLabel}: ${nextFriendlyMessage}` }]);
    }
    setChatLoading(false);
  };

  const handleCheckUpdates = useCallback(async () => {
    if (!versionManagerRef.current) return;
    const result = await versionManagerRef.current.checkForUpdates(window.HomeSchoolData.VERSION, window.HomeSchoolData);
    setCurrentVersion(result.newVersion || window.HomeSchoolData.VERSION);
    setUpdateAvailable(result.needsUpdate);
    const changedSubjects = (result.changedSubjects || []).length > 0 ? `\n${ui.changedSubjects}: ${result.changedSubjects.join(", ")}` : "";
    alert(result.needsUpdate
      ? `${ui.updateAvailableTitle}\nCurrent DB version: ${result.currentVersion ?? "not seeded"}\nNew version: ${result.newVersion}${changedSubjects}`
      : `${ui.upToDateTitle}\nVersion: ${result.newVersion}`);
  }, [ui.changedSubjects, ui.updateAvailableTitle, ui.upToDateTitle]);

  const handleRefreshData = useCallback(async () => {
    if (!window.HomeSchoolDB) return;
    if (!confirm(ui.refreshConfirm)) return;
    const result = await window.HomeSchoolDB.refreshData(window.HomeSchoolData, window.HomeSchoolData.VERSION);
    const pos = await window.HomeSchoolDB.getAllPosTypes();
    const tens = await window.HomeSchoolDB.getAllTenses();
    const voc = await window.HomeSchoolDB.getVocab();
    setDbPos(pos);
    setDbTenses(tens);
    setDbVocab(voc);
    await refreshStorageLabel();
    await refreshReviewWorkspace();
    setCurrentVersion(window.HomeSchoolData.VERSION);
    setUpdateAvailable(false);
    alert(result.refreshed
      ? `${ui.refreshSuccess} (${formatDate(Date.now())})${result.changedSubjects?.length ? `\n${ui.changedSubjects}: ${result.changedSubjects.join(", ")}` : ""}`
      : ui.refreshNoChanges);
  }, [refreshReviewWorkspace, refreshStorageLabel, ui.changedSubjects, ui.refreshConfirm, ui.refreshNoChanges, ui.refreshSuccess]);

  const handleExportProgress = useCallback(async () => {
    const dbProgress = window.HomeSchoolDB ? await window.HomeSchoolDB.exportProgress() : null;
    downloadJson(`homeschool-progress-${Date.now()}.json`, {
      exportedAt: new Date().toISOString(),
      appVersion: window.HomeSchoolData.VERSION,
      appState: {
        grade,
        studentName,
        studentNameUr,
        completedQuizzes,
        totalScore,
        totalQuizzesDone,
        streak,
        lastQuizDate,
        earnedBadges,
        xp,
        ttsEnabled,
        ttsRate,
        ttsVoiceSelections,
        language,
        themeMode,
        navPosition,
        navAutoHide,
        navBarAutoHide,
        transitionMode,
        dailyReviewCap,
        daySectionOverrides,
        studyGoals,
        focusTimerSettings,
        reminderSettings,
        notificationHistory,
      },
      dbProgress,
    });
  }, [grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, ttsRate, ttsVoiceSelections, language, themeMode, navPosition, navAutoHide, navBarAutoHide, transitionMode, dailyReviewCap, daySectionOverrides, studyGoals, focusTimerSettings, reminderSettings, notificationHistory]);

  const handleImportProgress = useCallback(async (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    try {
      if (!confirm(ui.importNow)) return;
      const text = await file.text();
      const parsed = JSON.parse(text);
      const validation = validateProgressImport(parsed);
      if (!validation.ok) {
        alert(`${ui.importInvalid}\n${validation.errors.join("\n")}`);
        return;
      }
      if (parsed?.dbProgress?.dataVersion && parsed.dbProgress.dataVersion > window.HomeSchoolData.VERSION && !confirm(ui.importNewer)) {
        return;
      }
      const replaceMode = confirm(ui.replacePrompt);
      const mode = replaceMode ? "replace" : "merge";
      const nextState = parsed.appState || {};
      if (mode === "replace") {
        if (typeof nextState.grade !== "undefined") setGrade(nextState.grade);
        if (typeof nextState.studentName !== "undefined") setStudentName(nextState.studentName);
        if (typeof nextState.studentNameUr !== "undefined") setStudentNameUr(nextState.studentNameUr);
        if (nextState.completedQuizzes) setCompletedQuizzes(nextState.completedQuizzes);
        if (typeof nextState.totalScore !== "undefined") setTotalScore(nextState.totalScore);
        if (typeof nextState.totalQuizzesDone !== "undefined") setTotalQuizzesDone(nextState.totalQuizzesDone);
        if (typeof nextState.streak !== "undefined") setStreak(nextState.streak);
        if (typeof nextState.lastQuizDate !== "undefined") setLastQuizDate(nextState.lastQuizDate);
        if (nextState.earnedBadges) setEarnedBadges(nextState.earnedBadges);
        if (typeof nextState.xp !== "undefined") setXp(nextState.xp);
        if (typeof nextState.ttsEnabled !== "undefined") setTtsEnabled(nextState.ttsEnabled);
        if (typeof nextState.ttsRate !== "undefined") setTtsRate(Math.max(0.6, Math.min(1.3, Number(nextState.ttsRate) || 0.85)));
        if (nextState.ttsVoiceSelections) setTtsVoiceSelections({ en: nextState.ttsVoiceSelections.en || "", ur: nextState.ttsVoiceSelections.ur || "" });
        if (typeof nextState.language !== "undefined") setLanguage(nextState.language);
        if (typeof nextState.themeMode !== "undefined") setThemeMode(nextState.themeMode);
        if (typeof nextState.navPosition !== "undefined" && ["bottom", "right", "left", "top"].includes(nextState.navPosition)) setNavPosition(nextState.navPosition);
        if (typeof nextState.navAutoHide !== "undefined") setNavAutoHide(Boolean(nextState.navAutoHide));
        if (typeof nextState.navBarAutoHide !== "undefined") setNavBarAutoHide(Boolean(nextState.navBarAutoHide));
        if (typeof nextState.transitionMode !== "undefined" && ["none", "fade", "slide", "zoom"].includes(nextState.transitionMode)) setTransitionMode(nextState.transitionMode);
        if (typeof nextState.dailyReviewCap !== "undefined") setDailyReviewCap(Math.max(5, Math.min(50, Number(nextState.dailyReviewCap) || 20)));
        setDaySectionOverrides(nextState.daySectionOverrides || {});
        if (nextState.studyGoals) setStudyGoals({
          dailyReviews: Math.max(5, Math.min(60, Number(nextState.studyGoals.dailyReviews) || 20)),
          weeklyWords: Math.max(10, Math.min(140, Number(nextState.studyGoals.weeklyWords) || 40)),
        });
        if (nextState.focusTimerSettings) setFocusTimerSettings({
          durationMinutes: Math.max(5, Math.min(60, Number(nextState.focusTimerSettings.durationMinutes) || 20)),
          autoStartBreak: Boolean(nextState.focusTimerSettings.autoStartBreak),
        });
        if (nextState.reminderSettings) setReminderSettings({
          enabled: Boolean(nextState.reminderSettings.enabled),
          time: nextState.reminderSettings.time || "18:00",
          notifications: Boolean(nextState.reminderSettings.notifications),
          lastShownDay: nextState.reminderSettings.lastShownDay || null,
        });
        if (Array.isArray(nextState.notificationHistory)) setNotificationHistory(nextState.notificationHistory.slice(0, 40));
      } else {
        if (typeof nextState.grade !== "undefined") setGrade((current) => current || nextState.grade);
        if (typeof nextState.studentName !== "undefined") setStudentName((current) => current || nextState.studentName);
        if (typeof nextState.studentNameUr !== "undefined") setStudentNameUr((current) => current || nextState.studentNameUr);
        if (nextState.completedQuizzes) setCompletedQuizzes((current) => ({ ...current, ...nextState.completedQuizzes }));
        if (typeof nextState.totalScore !== "undefined") setTotalScore((current) => Math.max(current, nextState.totalScore));
        if (typeof nextState.totalQuizzesDone !== "undefined") setTotalQuizzesDone((current) => Math.max(current, nextState.totalQuizzesDone));
        if (typeof nextState.streak !== "undefined") setStreak((current) => Math.max(current, nextState.streak));
        if (typeof nextState.lastQuizDate !== "undefined") setLastQuizDate((current) => current || nextState.lastQuizDate);
        if (nextState.earnedBadges) setEarnedBadges((current) => Array.from(new Set([...(current || []), ...nextState.earnedBadges])));
        if (typeof nextState.xp !== "undefined") setXp((current) => Math.max(current, nextState.xp));
        if (typeof nextState.ttsEnabled !== "undefined") setTtsEnabled((current) => current && nextState.ttsEnabled);
        if (typeof nextState.ttsRate !== "undefined") setTtsRate((current) => Math.max(current, Math.min(1.3, Number(nextState.ttsRate) || current)));
        if (nextState.ttsVoiceSelections) setTtsVoiceSelections((current) => ({ ...current, ...nextState.ttsVoiceSelections }));
        if (typeof nextState.language !== "undefined") setLanguage((current) => current || nextState.language);
        if (typeof nextState.themeMode !== "undefined") setThemeMode((current) => current || nextState.themeMode);
        if (typeof nextState.navPosition !== "undefined" && ["bottom", "right", "left", "top"].includes(nextState.navPosition)) setNavPosition((current) => current || nextState.navPosition);
        if (typeof nextState.navAutoHide !== "undefined") setNavAutoHide((current) => current || Boolean(nextState.navAutoHide));
        if (typeof nextState.navBarAutoHide !== "undefined") setNavBarAutoHide((current) => current || Boolean(nextState.navBarAutoHide));
        if (typeof nextState.transitionMode !== "undefined" && ["none", "fade", "slide", "zoom"].includes(nextState.transitionMode)) setTransitionMode((current) => current || nextState.transitionMode);
        if (typeof nextState.dailyReviewCap !== "undefined") setDailyReviewCap((current) => Math.max(current, Math.min(50, Number(nextState.dailyReviewCap) || current)));
        if (nextState.daySectionOverrides) setDaySectionOverrides((current) => ({ ...current, ...nextState.daySectionOverrides }));
        if (nextState.studyGoals) setStudyGoals((current) => ({
          dailyReviews: Math.max(current.dailyReviews || 20, Math.min(60, Number(nextState.studyGoals.dailyReviews) || current.dailyReviews || 20)),
          weeklyWords: Math.max(current.weeklyWords || 40, Math.min(140, Number(nextState.studyGoals.weeklyWords) || current.weeklyWords || 40)),
        }));
        if (nextState.focusTimerSettings) setFocusTimerSettings((current) => ({
          durationMinutes: Math.max(current.durationMinutes || 20, Math.min(60, Number(nextState.focusTimerSettings.durationMinutes) || current.durationMinutes || 20)),
          autoStartBreak: current.autoStartBreak || Boolean(nextState.focusTimerSettings.autoStartBreak),
        }));
        if (nextState.reminderSettings) setReminderSettings((current) => ({
          ...current,
          enabled: current.enabled || Boolean(nextState.reminderSettings.enabled),
          time: current.time || nextState.reminderSettings.time || "18:00",
          notifications: current.notifications || Boolean(nextState.reminderSettings.notifications),
          lastShownDay: current.lastShownDay || nextState.reminderSettings.lastShownDay || null,
        }));
        if (Array.isArray(nextState.notificationHistory)) setNotificationHistory((current) => [...(current || []), ...nextState.notificationHistory].slice(0, 40));
      }
      if (window.HomeSchoolDB && parsed.dbProgress) await window.HomeSchoolDB.importProgress(parsed.dbProgress, { mode });
      await refreshStorageLabel();
      await refreshReviewWorkspace();
      alert(mode === "replace" ? ui.importSuccessReplace : ui.importSuccessMerge);
    } catch (error) {
      alert(`${ui.importInvalid}\n${error.message || error}`);
    } finally {
      event.target.value = "";
    }
  }, [refreshReviewWorkspace, refreshStorageLabel, ui.importInvalid, ui.importNewer, ui.importNow, ui.importSuccessMerge, ui.importSuccessReplace, ui.replacePrompt]);

  const handleResetProgress = useCallback(async () => {
    if (!confirm(ui.resetConfirm)) return;
    setCompletedQuizzes({});
    setTotalScore(0);
    setTotalQuizzesDone(0);
    setStreak(0);
    setLastQuizDate(null);
    setEarnedBadges([]);
    setXp(0);
    setNewBadges([]);
    if (window.HomeSchoolDB) await window.HomeSchoolDB.resetProgress();
    await refreshReviewWorkspace();
  }, [refreshReviewWorkspace, ui.resetConfirm]);

  const handleFullReset = useCallback(async () => {
    if (!confirm(ui.fullResetConfirm)) return;
    setCompletedQuizzes({});
    setTotalScore(0);
    setTotalQuizzesDone(0);
    setStreak(0);
    setLastQuizDate(null);
    setEarnedBadges([]);
    setXp(0);
    setNewBadges([]);
    if (window.HomeSchoolDB) await window.HomeSchoolDB.fullReset(window.HomeSchoolData, window.HomeSchoolData.VERSION);
    localStorage.removeItem(window.HomeSchoolUtils.STORE_KEY);
    location.reload();
  }, [ui.fullResetConfirm]);

  const handleStartReview = useCallback(async () => {
    if (!window.HomeSchoolDB) return;
    setReviewLoading(true);
    try {
      const queue = await window.HomeSchoolDB.getDueReviewCards(dailyReviewCap);
      setReviewQueue(queue);
      setPracticeMode(null);
      setPracticeDeck([]);
      setPracticeMatchRound(null);
      setReviewIdx(0);
      setReviewReveal(false);
      setReviewSessionDone(false);
      setReviewSessionXp(0);
      setTab("review");
    } finally {
      setReviewLoading(false);
    }
  }, [dailyReviewCap]);

  const handleReviewResponse = useCallback(async (rating) => {
    if (!window.HomeSchoolDB || !activeReviewCard) return;
    const result = await window.HomeSchoolDB.saveReviewResult(activeReviewCard.id, rating);
    if (result?.stats) {
      setXp(result.stats.xp || 0);
    }
    setReviewSessionXp((current) => current + (result?.xpGain || 0));
    setReviewReveal(false);
    if (reviewIdx >= reviewQueue.length - 1) {
      setReviewSessionDone(true);
      await refreshReviewWorkspace();
      return;
    }
    setReviewIdx((current) => current + 1);
    await refreshReviewWorkspace();
  }, [activeReviewCard, refreshReviewWorkspace, reviewIdx, reviewQueue.length]);

  const resetReviewSession = useCallback(() => {
    setReviewQueue([]);
    setReviewIdx(0);
    setReviewReveal(false);
    setReviewSessionDone(false);
    setReviewSessionXp(0);
  }, []);

  const resetPracticeSession = useCallback(() => {
    setPracticeMode(null);
    setPracticeDeck([]);
    setPracticeIdx(0);
    setPracticeReveal(false);
    setPracticeTypingInput("");
    setPracticeTypingResult(null);
    setPracticeMatchRound(null);
    setPracticeMatchSelection(null);
    setPracticeSessionStats({ attempted: 0, correct: 0 });
  }, []);

  const handleStartPractice = useCallback((mode) => {
    const deck = buildPracticeDeck(reviewLibrary, mode === "matching" ? 8 : 12);
    if (!deck.length) return;
    resetReviewSession();
    setPracticeMode(mode);
    setPracticeDeck(deck);
    setPracticeIdx(0);
    setPracticeReveal(false);
    setPracticeTypingInput("");
    setPracticeTypingResult(null);
    setPracticeSessionStats({ attempted: 0, correct: 0 });
    setPracticeMatchSelection(null);
    setPracticeMatchRound(mode === "matching" ? buildMatchRound(deck, 4) : null);
    setTab("review");
  }, [reviewLibrary, resetReviewSession]);

  const handlePracticeNext = useCallback(() => {
    if (practiceMode === "matching") {
      if (practiceIdx >= practiceDeck.length - 4) {
        resetPracticeSession();
        return;
      }
      const nextDeck = practiceDeck.slice(practiceIdx + 4);
      setPracticeIdx((current) => current + 4);
      setPracticeMatchSelection(null);
      setPracticeMatchRound(buildMatchRound(nextDeck, 4));
      return;
    }
    if (practiceIdx >= practiceDeck.length - 1) {
      resetPracticeSession();
      return;
    }
    setPracticeIdx((current) => current + 1);
    setPracticeReveal(false);
    setPracticeTypingInput("");
    setPracticeTypingResult(null);
  }, [practiceMode, practiceIdx, practiceDeck, resetPracticeSession]);

  const handleCheckTypedAnswer = useCallback(() => {
    const card = practiceDeck[practiceIdx];
    if (!card) return;
    const correct = isTypingAnswerCorrect(card, practiceTypingInput);
    setPracticeTypingResult(correct ? "correct" : "wrong");
    setPracticeReveal(true);
    setPracticeSessionStats((current) => ({
      attempted: (current.attempted || 0) + 1,
      correct: (current.correct || 0) + (correct ? 1 : 0),
    }));
  }, [practiceDeck, practiceIdx, practiceTypingInput]);

  const handleMatchSelection = useCallback((type, item) => {
    if (!practiceMatchRound || practiceMatchRound.completed) return;
    if (type === "prompt") {
      setPracticeMatchSelection({ type, item });
      return;
    }
    if (!practiceMatchSelection?.item) {
      setPracticeMatchSelection({ type, item });
      return;
    }
    const promptItem = practiceMatchSelection.type === "prompt" ? practiceMatchSelection.item : null;
    const answerItem = type === "answer" ? item : practiceMatchSelection.type === "answer" ? practiceMatchSelection.item : null;
    if (!promptItem || !answerItem) {
      setPracticeMatchSelection({ type, item });
      return;
    }
    const correct = promptItem.id === answerItem.id;
    const nextMatches = {
      ...(practiceMatchRound.matches || {}),
      [promptItem.id]: correct ? true : false,
    };
    const matchedCount = Object.entries(nextMatches).filter(([, value]) => value === true).length;
    const nextCompleted = matchedCount >= Math.min(4, practiceMatchRound.prompts.length);
    setPracticeSessionStats((current) => ({
      attempted: (current.attempted || 0) + 1,
      correct: (current.correct || 0) + (correct ? 1 : 0),
    }));
    setPracticeMatchSelection(null);
    setPracticeMatchRound({
      ...practiceMatchRound,
      matches: nextMatches,
      completed: nextCompleted,
    });
  }, [practiceMatchRound, practiceMatchSelection]);

  const handleViewStudyItem = useCallback((card) => {
    const source = inferViewSource(card);
    const subjectId = source?.subject || card?.subject || "english";
    const subject = (window.HomeSchoolData?.SUBJECTS || []).find((entry) => entry.id === subjectId) || null;
    const lessons = window.HomeSchoolData?.getLessons ? window.HomeSchoolData.getLessons(subjectId, grade) : [];
    let lesson = null;

    if (source?.lessonKey) {
      lesson = lessons.find((entry) => entry.key === source.lessonKey) || null;
    } else if (source?.lessonMode === "adverbs") {
      lesson = lessons.find((entry) => entry.hasAdverbs) || null;
    } else if (source?.lessonMode === "vocab") {
      lesson = lessons.find((entry) => entry.hasVocab) || null;
    } else if (source?.lessonMode === "tenses") {
      lesson = lessons.find((entry) => entry.hasTenses || getTenseSubsectionIndex(entry) >= 0) || null;
    } else if (source?.subTitle) {
      lesson = lessons.find((entry) => entry.hasMathSub && (entry.subs || []).some((sub) => sub.t === source.subTitle)) || null;
    } else if (source?.lessonTitle) {
      lesson = lessons.find((entry) => entry.title === source.lessonTitle) || null;
    }

    resetReviewSession();
    setTab("home");
    setSelectedSubject(subject);
    clearLessonSelections();
    setSelectedLesson(lesson);

    if (lesson?.hasAdverbs) {
      const posTabValue = source?.posTab || (card?.section === "collectiveNouns" ? "nouns" : card?.section) || "adverbs";
      setPosTab(posTabValue);
      if (source?.day) {
        const groups = pacedPos[posTabValue] || [];
        const dayEntry = groups.find((entry) => entry.day === source.day) || null;
        if (posTabValue === "adverbs") setSelectedAdverbDay(dayEntry);
        if (posTabValue === "prepositions") setSelectedPrepDay(dayEntry);
        if (posTabValue === "adjectives") setSelectedAdjDay(dayEntry);
        if (posTabValue === "conjunctions") setSelectedConjDay(dayEntry);
        if (posTabValue === "pronouns") setSelectedPronDay(dayEntry);
        if (posTabValue === "nouns") setSelectedNounDay(dayEntry);
        if (posTabValue === "verbs") setSelectedVerbDay(dayEntry);
      }
    } else if (lesson?.hasVocab) {
      if (source?.day) {
        const dayEntry = pacedVocab.find((entry) => entry.day === source.day) || null;
        setSelectedVocabDay(dayEntry);
      }
    } else if (lesson?.hasTenses || (source?.lessonMode === "tenses" && lesson?.hasMathSub && getTenseSubsectionIndex(lesson) >= 0)) {
      const tensesSubIndex = lesson?.hasMathSub ? getTenseSubsectionIndex(lesson) : -1;
      if (tensesSubIndex >= 0) {
        setMathSubIdx(tensesSubIndex);
        setMathSubTab("examples");
      }
      const nextMain = source?.tenseMain || tenseMain;
      const nextSub = source?.tenseSub || tenseSub;
      setTenseMain(nextMain);
      setTenseSub(nextSub);
      const tenseItems = TENSES?.[nextMain]?.[nextSub]?.items || [];
      const targetParagraph = tenseItems.find((item, index) => item.title === source?.paragraphTitle || index === source?.paragraphIndex) || null;
      if (targetParagraph) setSelectedTensePara(targetParagraph);
    } else if (lesson?.hasMathSub) {
      const derivedSubs = lesson.key === "sentences"
        ? buildDerivedSentenceSub(lesson.subs || [], daySectionSettings.sentences.itemsPerDay, subjectId)
        : (lesson.subs || []).map((sub) => {
          const settingKey = getSubsectionSettingKey(sub.t);
          if (!settingKey) return sub;
          return buildDerivedDayBasedSub(sub, settingKey, daySectionSettings[settingKey]?.itemsPerDay || 5, subjectId);
        });
      const subIndex = typeof source?.subIndex === "number"
        ? source.subIndex
        : derivedSubs.findIndex((sub) => sub.t === source?.subTitle || getSubsectionSettingKey(sub.t) === source?.subSettingKey);
      if (subIndex >= 0) {
        setMathSubIdx(subIndex);
        setMathSubTab(source?.subTab || "examples");
        if (source?.subTab === "exercises" && derivedSubs[subIndex]?.exerciseGroups && source?.groupLabel) {
          const exerciseIndex = derivedSubs[subIndex].exerciseGroups.findIndex((group) => group.label === source.groupLabel);
          if (exerciseIndex >= 0) setSubExerciseGroupIdx(exerciseIndex);
        }
        if (source?.subTab === "quiz" && derivedSubs[subIndex]?.quizGroups && source?.groupLabel) {
          const quizIndex = derivedSubs[subIndex].quizGroups.findIndex((group) => group.label === source.groupLabel);
          if (quizIndex >= 0) setSubQuizGroupIdx(quizIndex);
        }
      }
    }

    setViewTargetId(card?.id || null);
    setPageFlashActive(true);
    setTimeout(() => setPageFlashActive(false), 850);
  }, [TENSES, clearLessonSelections, daySectionSettings, grade, inferViewSource, pacedPos, pacedVocab, resetReviewSession, tenseMain, tenseSub]);

  useEffect(() => {
    if (!viewTargetId) return undefined;
    let activeHighlightNode = null;
    const timeout = setTimeout(() => {
      const safeId = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(String(viewTargetId)) : String(viewTargetId).replace(/"/g, '\\"');
      const target = document.querySelector(`[data-study-id="${safeId}"]`);
      if (target) {
        const highlightNode = target.closest(".word-row, .lesson-detail, .adverb-detail-section, .study-word-card, .review-panel, .settings-item, .settings-profile-card") || target;
        activeHighlightNode = highlightNode;
        highlightNode.classList.add("study-focus-active-manual");
        highlightNode.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      }
    }, 280);
    const cleanup = setTimeout(() => setViewTargetId(null), 1800);
    return () => {
      clearTimeout(timeout);
      clearTimeout(cleanup);
      if (activeHighlightNode) {
        activeHighlightNode.classList.remove("study-focus-active-manual");
      }
    };
  }, [mathSubIdx, selectedAdverbDay, selectedAdjDay, selectedConjDay, selectedLesson, selectedNounDay, selectedPrepDay, selectedPronDay, selectedSubject, selectedTensePara, selectedVerbDay, selectedVocabDay, subExerciseGroupIdx, subQuizGroupIdx, tab, tenseMain, tenseSub, viewTargetId]);

  const handleToggleFavorite = useCallback(async (cardId) => {
    if (!window.HomeSchoolDB || !cardId) return null;
    const nextMeta = await window.HomeSchoolDB.toggleWordFavorite(cardId);
    setReviewQueue((current) => current.map((card) => card.id === cardId ? { ...card, favorite: nextMeta?.favorite } : card));
    if (nextMeta?.id) {
      setStudyMetaLookup((current) => applyStudyMetaToLookup(current, nextMeta));
    }
    await refreshReviewWorkspace();
    return nextMeta;
  }, [refreshReviewWorkspace]);

  const handleToggleStudyFavorite = useCallback(async (studyItem) => {
    if (!window.HomeSchoolDB || !studyItem?.prompt) return null;
    const nextMeta = await window.HomeSchoolDB.toggleWordFavorite(null, null, studyItem);
    if (nextMeta?.id) {
      setStudyMetaLookup((current) => applyStudyMetaToLookup(current, nextMeta));
    }
    await refreshReviewWorkspace();
    return nextMeta;
  }, [refreshReviewWorkspace]);

  const handleSaveWordNote = useCallback(async (cardId, note) => {
    if (!window.HomeSchoolDB || !cardId) return null;
    const nextMeta = await window.HomeSchoolDB.saveWordNote(cardId, note);
    setReviewQueue((current) => current.map((card) => card.id === cardId ? { ...card, note: nextMeta?.note || "" } : card));
    if (nextMeta?.id) {
      setStudyMetaLookup((current) => applyStudyMetaToLookup(current, nextMeta));
    }
    await refreshReviewWorkspace();
    return nextMeta;
  }, [refreshReviewWorkspace]);

  const handleSaveStudyNote = useCallback(async (studyItem, note) => {
    if (!window.HomeSchoolDB || !studyItem?.prompt) return null;
    const nextMeta = await window.HomeSchoolDB.saveWordNote(null, note, studyItem);
    if (nextMeta?.id) {
      setStudyMetaLookup((current) => applyStudyMetaToLookup(current, nextMeta));
    }
    await refreshReviewWorkspace();
    return nextMeta;
  }, [refreshReviewWorkspace]);

  const handleToggleCardInList = useCallback(async (cardId, listId) => {
    if (!window.HomeSchoolDB || !cardId || !listId) return null;
    const result = await window.HomeSchoolDB.toggleCardInCustomList(listId, cardId);
    const listName = (reviewAnalytics.customLists || []).find((list) => list.id === listId)?.name || "";
    setReviewQueue((current) => current.map((card) => {
      if (card.id !== cardId) return card;
      const currentIds = Array.isArray(card.listIds) ? card.listIds : [];
      const currentNames = Array.isArray(card.listNames) ? card.listNames : [];
      if (result) {
        return {
          ...card,
          listIds: currentIds.includes(listId) ? currentIds : [...currentIds, listId],
          listNames: listName && !currentNames.includes(listName) ? [...currentNames, listName] : currentNames,
        };
      }
      return {
        ...card,
        listIds: currentIds.filter((id) => id !== listId),
        listNames: currentNames.filter((name) => name !== listName),
      };
    }));
    await refreshReviewWorkspace();
    return result;
  }, [refreshReviewWorkspace, reviewAnalytics.customLists]);

  const handleCreateCustomList = useCallback(async () => {
    const name = customListDraft.trim();
    if (!window.HomeSchoolDB || !name) return;
    await window.HomeSchoolDB.createCustomList(name);
    setCustomListDraft("");
    await refreshReviewWorkspace();
  }, [customListDraft, refreshReviewWorkspace]);

  const handleDeleteCustomList = useCallback(async (listId) => {
    if (!window.HomeSchoolDB || !listId) return;
    if (!confirm(joinLocalizedText("Delete this list?", "کیا یہ فہرست حذف کرنی ہے؟", language))) return;
    const listName = (reviewAnalytics.customLists || []).find((list) => list.id === listId)?.name || "";
    await window.HomeSchoolDB.deleteCustomList(listId);
    setReviewQueue((current) => current.map((card) => ({
      ...card,
      listIds: (card.listIds || []).filter((id) => id !== listId),
      listNames: (card.listNames || []).filter((name) => name !== listName),
    })));
    await refreshReviewWorkspace();
  }, [language, refreshReviewWorkspace, reviewAnalytics.customLists]);

  // Show loading while DB initializes
  if (!dbLoaded) return (<><div className="app-container"><div className="content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}><div style={{ fontSize: 56, marginBottom: 16 }}>📚</div><h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{ui.loadingHome}</h2><p style={{ color: "var(--text-secondary)", fontSize: 13 }}>{ui.loadingDb}</p><div style={{ width: 200, height: 4, background: "var(--bg-elevated)", borderRadius: 4, marginTop: 16, overflow: "hidden" }}><div style={{ width: "60%", height: "100%", background: "var(--accent)", borderRadius: 4, animation: "pulse 1s infinite" }} /></div></div></div></>);

  if (!grade) return (<><div className="app-container"><div className="content" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "32px 24px", direction: isUrduUi(language) ? "rtl" : "ltr" }}><div style={{ textAlign: "center", marginBottom: 32 }}><div style={{ fontSize: 56, marginBottom: 12 }}>📚</div><h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>HomeSchool</h1><p style={{ color: "var(--text-secondary)", fontSize: 14 }}>{renderLocalizedTextNode(ui.tagline, language)}</p>{language === "en" ? <p style={{ fontFamily: "var(--font-ur)", color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>آپ کا ذاتی تعلیمی ساتھی</p> : null}</div><div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>{renderLocalizedTextNode(ui.yourName, language)}</label><input value={studentName} onChange={e => setStudentName(e.target.value)} placeholder={ui.enterName} style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: isUrduUi(language) ? "'Noto Nastaliq Urdu',serif" : "var(--font)", fontSize: 15, outline: "none" }} /></div>{language !== "en" && <div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" }}>{renderLocalizedTextNode(ui.yourNameUr, language)}</label><input value={studentNameUr} onChange={e => setStudentNameUr(sanitizeUrduInput(e.target.value))} placeholder="اپنا نام درج کریں" style={{ width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "var(--font-ur)", fontSize: 15, outline: "none", direction: "rtl" }} /></div>}<label style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, display: "block" }}>{renderLocalizedTextNode(ui.selectGrade, language)}</label><div className="grade-grid">{GRADES.map(g => <button key={g.id} className="grade-btn" onClick={() => setGrade(g.id)}>{g.id}</button>)}</div></div></div></>);

  const goHome = () => {
    window.speechSynthesis.cancel();
    setNavHidden(Boolean(navAutoHide));
    setNavBarHidden(Boolean(navBarAutoHide && navPosition !== "top"));
    setTab("home");
    setSelectedSubject(null);
    setSelectedLesson(null);
    setQuizActive(false);
    setQuizDone(false);
    setQuizAnswers([]);
    setQuizIdx(0);
    setQuizRevealed(false);
    setSelectedAdverbDay(null);
    setSelectedPrepDay(null);
    setSelectedAdjDay(null);
    setSelectedConjDay(null);
    setSelectedPronDay(null);
    setSelectedNounDay(null);
    setSelectedVerbDay(null);
    setSelectedTensePara(null);
    setSelectedVocabDay(null);
    setMathSubIdx(null);
    setMathSubTab("examples");
    setSubExerciseGroupIdx(null);
    setSubQuizGroupIdx(null);
    setRevealedEx({});
    setPosTab("adverbs");
    setTenseMain("present");
    setTenseSub("simple");
    setNewBadges([]);
    resetReviewSession();
    resetPracticeSession();
  };
  const goBack = () => { window.speechSynthesis.cancel(); setNavHidden(Boolean(navAutoHide)); setNavBarHidden(Boolean(navBarAutoHide && navPosition !== "top")); if (practiceMode) { resetPracticeSession(); setTab("review"); } else if (quizDone || quizActive) { setQuizActive(false); setQuizDone(false); setQuizAnswers([]); setQuizIdx(0); setNewBadges([]); } else if (selectedAdverbDay) { setSelectedAdverbDay(null); } else if (selectedPrepDay) { setSelectedPrepDay(null); } else if (selectedAdjDay) { setSelectedAdjDay(null); } else if (selectedConjDay) { setSelectedConjDay(null); } else if (selectedPronDay) { setSelectedPronDay(null); } else if (selectedNounDay) { setSelectedNounDay(null); } else if (selectedVerbDay) { setSelectedVerbDay(null); } else if (selectedTensePara) { setSelectedTensePara(null); } else if (selectedVocabDay) { setSelectedVocabDay(null); } else if (subQuizGroupIdx !== null) { setSubQuizGroupIdx(null); } else if (subExerciseGroupIdx !== null) { setSubExerciseGroupIdx(null); } else if (mathSubIdx !== null) { setMathSubIdx(null); setMathSubTab("examples"); setSubExerciseGroupIdx(null); setSubQuizGroupIdx(null); setRevealedEx({}); } else if (selectedLesson) { setSelectedLesson(null); setPosTab("adverbs"); setTenseMain("present"); setTenseSub("simple"); } else if (selectedSubject) setSelectedSubject(null); else if (tab === "review") { resetReviewSession(); resetPracticeSession(); setTab("home"); } else setTab("home"); };
  const selDay = selectedAdverbDay || selectedPrepDay || selectedAdjDay || selectedConjDay || selectedPronDay || selectedNounDay || selectedVerbDay || selectedTensePara || selectedVocabDay || (mathSubIdx !== null);
  const headerTitle = quizActive || quizDone ? ui.quiz : selectedAdverbDay ? getScopedDayTitle(selectedAdverbDay.day, "Adverbs", "قید", language) : selectedPrepDay ? getScopedDayTitle(selectedPrepDay.day, "Prepositions", "حروف جار", language) : selectedAdjDay ? getScopedDayTitle(selectedAdjDay.day, "Adjectives", "صفات", language) : selectedConjDay ? getScopedDayTitle(selectedConjDay.day, "Conjunctions", "حروف عطف", language) : selectedPronDay ? getScopedDayTitle(selectedPronDay.day, "Pronouns", "ضمائر", language) : selectedNounDay ? getScopedDayTitle(selectedNounDay.day, "Collective Nouns", "اسم جمع", language) : selectedVerbDay ? getScopedDayTitle(selectedVerbDay.day, "Verbs", "افعال", language) : selectedTensePara ? selectedTensePara.title : selectedVocabDay ? getScopedDayTitle(selectedVocabDay.day, "Vocabulary", "ذخیرہ الفاظ", language) : selectedLesson ? selectedLesson.title : selectedSubject ? getSubjectDisplayName(selectedSubject, language) : tab === "home" ? "HomeSchool" : tab === "progress" ? ui.progress : tab === "review" ? ui.review : tab === "favorites" ? ui.favorites : tab === "badges" ? ui.achievements : tab === "tutor" ? ui.tutor : ui.settings;
  const showBack = selectedSubject || selectedLesson || quizActive || quizDone || selDay || tab !== "home";
  const currentQuiz = selectedLesson ? getQuiz(selectedSubject?.id, grade, selectedLesson.key) : [];
  const quizScore = quizDone ? quizAnswers.reduce((a, v, i) => a + (v === currentQuiz[i]?.c ? 1 : 0), 0) : 0;
  const localizedNames = getLocalizedNamePair(studentName, studentNameUr);
  const reviewReadyNowCount = Math.min(Number(reviewStats.due || 0), Number(dailyReviewCap || 20));
  const canInstallApp = Boolean(installPromptEvent) && !isInstalled;
  const canShowInstallBanner = !installBannerDismissed && !isInstalled && serviceWorkerStatus !== "unsupported" && serviceWorkerStatus !== "local-static";
  const installStatusLabel = isInstalled || installAvailability === "installed"
    ? ui.appInstalled
    : canInstallApp || installAvailability === "available"
      ? ui.appInstallAvailable
      : ui.appInstallUnavailable;
  const offlineStatusLabel = serviceWorkerStatus === "ready"
    ? ui.offlineReady
    : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking"
      ? ui.offlineCaching
      : serviceWorkerStatus === "local-static"
        ? ui.offlineLocalStatic
        : serviceWorkerStatus === "update-ready"
          ? ui.updateReady
          : serviceWorkerStatus === "unsupported"
            ? ui.offlineUnsupported
            : ui.offlineError;
  const networkStatusLabel = isOnline ? ui.online : ui.offline;
  const bannerTitleOptions = { gap: 1, enStyle: { fontSize: 15, fontWeight: 800 }, urStyle: { fontSize: 14, fontWeight: 700 } };
  const bannerBodyOptions = { gap: 2, enStyle: { fontSize: 12.5 }, urStyle: { fontSize: 12.5, lineHeight: 1.8 } };
  const bannerLabelOptions = { gap: 1, enStyle: { fontSize: 10.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }, urStyle: { fontSize: 10.5, color: "var(--text-muted)", fontWeight: 700 } };
  const bannerValueOptions = { gap: 1, enStyle: { fontSize: 12.5, color: "var(--accent)", fontWeight: 800 }, urStyle: { fontSize: 12.5, color: "var(--text-primary)", fontWeight: 700 } };
  const bannerButtonOptions = { gap: 0, enStyle: { fontSize: 12, fontWeight: 700 }, urStyle: { fontSize: 11.5, fontWeight: 700 } };
  const reviewWordLookup = reviewLibrary.reduce((acc, card) => {
    if (!card?.prompt || !card?.answer) return acc;
    const key = getReviewWordLookupKey(card.prompt, card.answer);
    if (!acc[key]) acc[key] = card;
    return acc;
  }, {});
  const groupedFavoriteWords = (reviewAnalytics.favoriteWords || []).reduce((groups, card) => {
    const subjectId = card?.subject || card?.source?.subject || "general";
    if (!groups[subjectId]) {
      const subject = SUBJECTS.find((entry) => entry.id === subjectId) || null;
      groups[subjectId] = { subjectId, subject, cards: [] };
    }
    groups[subjectId].cards.push(card);
    return groups;
  }, {});
  const favoriteSubjectGroups = Object.values(groupedFavoriteWords).sort((left, right) => {
    const leftName = (left.subject?.name || left.subjectId || "").toLowerCase();
    const rightName = (right.subject?.name || right.subjectId || "").toLowerCase();
    return leftName.localeCompare(rightName);
  });
  const recentNotificationHistory = (notificationHistory || []).slice(0, 5);
  const englishVoiceOptions = availableVoices.filter((voice) => String(voice.lang || "").toLowerCase().startsWith("en"));
  const urduVoiceOptions = availableVoices.filter((voice) => {
    const langCode = String(voice.lang || "").toLowerCase();
    return langCode.startsWith("ur") || langCode.startsWith("hi") || langCode.includes("in");
  });
  const activePracticeCard = practiceDeck[practiceIdx] || null;
  const dailyGoalProgress = Math.min(100, Math.round(((Number(reviewStats.reviewedToday) || 0) / Math.max(1, Number(studyGoals.dailyReviews) || 20)) * 100));
  const weeklyGoalProgress = Math.min(100, Math.round(((Number(reviewAnalytics.totals.uniqueReviewedLast7) || 0) / Math.max(1, Number(studyGoals.weeklyWords) || 40)) * 100));
  const currentReminderLabel = getReminderStatus(reminderSettings, language);
  const reminderDueNow = Boolean(reminderSettings?.enabled && reminderSettings?.lastShownDay === window.HomeSchoolUtils.getDayKey(Date.now()));
  const routeTransitionKey = [
    tab,
    selectedSubject?.id || "",
    selectedLesson?.key || "",
    selectedAdverbDay?.day || "",
    selectedPrepDay?.day || "",
    selectedAdjDay?.day || "",
    selectedConjDay?.day || "",
    selectedPronDay?.day || "",
    selectedNounDay?.day || "",
    selectedVerbDay?.day || "",
    selectedTensePara?.title || "",
    selectedVocabDay?.day || "",
    quizActive ? "quiz" : "",
    quizDone ? "quizDone" : "",
    subExerciseGroupIdx ?? "",
    subQuizGroupIdx ?? "",
    mathSubIdx ?? "",
    practiceMode || "",
    reviewIdx,
    reviewSessionDone ? "reviewDone" : "",
  ].join("|");
  const aiBrowserCapability = canUseDirectAiFromBrowser();
  const configuredAiProviderIds = AI_PROVIDER_ORDER.filter((providerId) => String(aiProviderConfigs[providerId]?.apiKey || "").trim());
  const readyAiProviderIds = configuredAiProviderIds.filter((providerId) => isAiProviderReady(aiProviderConfigs[providerId]));
  const currentAiProviderId = readyAiProviderIds.includes(selectedAiProvider) ? selectedAiProvider : (readyAiProviderIds[0] || "openai");
  const currentAiProviderConfig = aiProviderConfigs[currentAiProviderId] || createDefaultAiProviderConfigs()[currentAiProviderId];
  const currentAiModelOptions = normalizeAiModelList(currentAiProviderId, currentAiProviderConfig.models, currentAiProviderConfig.model);
  const aiSettingsProviders = AI_PROVIDER_ORDER.map((providerId) => {
    const definition = AI_PROVIDER_DEFS[providerId];
    const saved = aiProviderConfigs[providerId] || createDefaultAiProviderConfigs()[providerId];
    const draft = aiProviderDrafts[providerId] || saved;
    const statusLabel = saved.status === "ready"
      ? joinLocalizedText("Ready", "تیار", language)
      : saved.status === "auth"
        ? joinLocalizedText("Needs authorization", "دوبارہ اجازت درکار", language)
        : saved.status === "quota"
          ? joinLocalizedText("Quota or billing needed", "کوٹہ یا بلنگ درکار", language)
        : saved.status === "blocked"
          ? joinLocalizedText("Browser blocked", "براؤزر نے روکا", language)
          : saved.status === "error"
            ? joinLocalizedText("Needs review", "جائزہ درکار", language)
          : saved.apiKey
            ? joinLocalizedText("Saved locally", "مقامی طور پر محفوظ", language)
            : joinLocalizedText("Not configured", "ابھی شامل نہیں", language);
    return {
      id: providerId,
      label: joinLocalizedText(definition.name, definition.nameUr, language),
      apiKey: draft.apiKey || "",
      model: draft.model || definition.defaultModel,
      modelOptions: normalizeAiModelList(providerId, saved.models, draft.model || saved.model || definition.defaultModel),
      statusLabel,
      helpText: saved.lastError || (saved.apiKey
        ? `${maskApiKey(saved.apiKey)}`
        : joinLocalizedText("Add a key to enable this provider in Tutor.", "اس فراہم کنندہ کو فعال کرنے کے لیے کی شامل کریں۔", language)),
      busy: Boolean(aiProviderBusy[providerId]),
      availableInTutor: isAiProviderReady(saved),
    };
  });

  const playAll = (p) => { if (!isTtsEnabled()) return; window.speechSynthesis.cancel(); const ss = p.split(/(?<=[.!?])\s+/).filter(Boolean); let i = 0; const next = () => { if (i < ss.length) { const u = new SpeechSynthesisUtterance(ttsClean(ss[i])); const speechConfig = getSpeechConfig("en", window.speechSynthesis.getVoices()); u.lang = speechConfig.lang; u.rate = speechConfig.rate; u.pitch = 1.05; if (speechConfig.voice) u.voice = speechConfig.voice; u.onend = () => { i++; next(); }; window.speechSynthesis.speak(u); } }; next(); };
  const handleInstallApp = async () => {
    if (!installPromptEvent) return;
    try {
      await installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice?.outcome === "dismissed") {
        setInstallBannerDismissed(false);
      }
    } catch (error) {
      console.log("Install prompt failed:", error);
    }
    setInstallPromptEvent(null);
  };
  const navItems = [
    { id: "home", icon: "🏠", label: ui.home },
    { id: "progress", icon: "📊", label: ui.progress },
    { id: "review", icon: "🧠", label: ui.review },
    { id: "favorites", icon: "⭐", label: ui.favorites },
    { id: "badges", icon: "🏆", label: ui.badges },
    ...(readyAiProviderIds.length > 0 ? [{ id: "tutor", icon: "🤖", label: ui.tutor }] : []),
    { id: "settings", icon: "⚙️", label: ui.settings },
  ];
  const handleNavItemSelect = (nextTab) => {
    if (nextTab === "home") {
      goHome();
      return;
    }
    window.speechSynthesis.cancel();
    setNavHidden(Boolean(navAutoHide));
    setNavBarHidden(Boolean(navBarAutoHide && navPosition !== "top"));
    setTab(nextTab);
    setSelectedSubject(null);
    setSelectedLesson(null);
    setQuizActive(false);
    setQuizDone(false);
    setSelectedAdverbDay(null);
    setSelectedPrepDay(null);
    setSelectedAdjDay(null);
    setSelectedConjDay(null);
    setSelectedPronDay(null);
    setSelectedNounDay(null);
    setSelectedVerbDay(null);
    setSelectedTensePara(null);
    setSelectedVocabDay(null);
    setMathSubIdx(null);
    setMathSubTab("examples");
    setSubExerciseGroupIdx(null);
    setSubQuizGroupIdx(null);
    setRevealedEx({});
    setPosTab("adverbs");
    setTenseMain("present");
    setTenseSub("simple");
    if (nextTab !== "review") {
      resetReviewSession();
      resetPracticeSession();
    }
  };
  const renderNavBar = (position, inline = false) => (
    <div
      ref={!inline ? navBarRef : null}
      className={inline ? "header-top-nav" : `bottom-nav nav-position-${position}`}
      data-nav-position={position}
      onMouseEnter={!inline && navBarAutoHide && position !== "top" ? revealAutoHideNavBar : undefined}
      onMouseLeave={!inline && navBarAutoHide && position !== "top" ? concealAutoHideNavBar : undefined}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`nav-item ${tab === item.id ? "active" : ""}`}
          style={isUrduUi(language) ? { fontFamily: "var(--font-ur)" } : {}}
          onClick={() => handleNavItemSelect(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          {renderLocalizedTextNode(item.label, language)}
        </button>
      ))}
    </div>
  );
  return (<AppContext.Provider value={{ currentVersion, updateAvailable, ttsEnabled, language, storageLabel, reviewWordLookup, studyMetaLookup, customLists: reviewAnalytics.customLists || [], onToggleFavorite: handleToggleFavorite, onToggleStudyFavorite: handleToggleStudyFavorite, onSaveWordNote: handleSaveWordNote, onSaveStudyNote: handleSaveStudyNote, onToggleCardInList: handleToggleCardInList, onDeleteCustomList: handleDeleteCustomList, onViewStudyItem: handleViewStudyItem, viewTargetId, buildViewSource }}><><div className={`app-container nav-position-${navPosition}${navAutoHide ? " nav-autohide-enabled" : ""}${navHidden ? " nav-hidden" : ""}${navBarAutoHide && navPosition !== "top" ? " navbar-autohide-enabled" : ""}${navBarHidden ? " nav-bar-hidden" : ""}`} style={{ ...(navAutoHide ? { "--header-hide-offset": `${headerHideOffset || 0}px`, "--header-visible-offset": navHidden ? "0px" : `${headerHideOffset || 0}px` } : {}), ...(navBarAutoHide && navPosition !== "top" ? { "--nav-hide-offset": `${navBarOffset || 0}px`, "--nav-visible-offset": navBarHidden ? "0px" : `${navBarOffset || 0}px` } : {}) }}>
    {navAutoHide ? <div className="header-reveal-hotspot" onMouseEnter={revealAutoHideHeader} onMouseMove={revealAutoHideHeader} onPointerDown={revealAutoHideHeader} /> : null}
    <div ref={headerRef} className={`app-header${navPosition === "top" ? " app-header-top-nav" : ""}`} onMouseEnter={navAutoHide ? revealAutoHideHeader : undefined} onMouseLeave={navAutoHide ? concealAutoHideHeader : undefined}>
      <div className="header-leading">
        <span className="back-btn-slot">{showBack ? <button className="back-btn" onClick={goBack}>←</button> : null}</span>
        <button type="button" className="header-mark" title="HomeSchool" aria-label="Go home" onClick={goHome}>
          <img src="img/ui/header-hs.png" alt="HomeSchool" className="header-mark-img" />
        </button>
      </div>
      {navPosition === "top"
        ? renderNavBar("top", true)
        : <h1 style={(selectedSubject?.id==="urdu" || isUrduUi(language))?{fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}}>{renderLocalizedTextNode(headerTitle, language)}</h1>}
      <button
        type="button"
        className="header-badge"
        title="Open progress"
        aria-label="Open progress"
        onClick={(event) => {
          event.stopPropagation();
          handleNavItemSelect("progress");
        }}
      ><span>⭐</span><span>{xp} XP</span></button>
    </div>
    <div className="app-body">
      {navBarAutoHide && navPosition === "left" ? <div className="nav-reveal-hotspot nav-reveal-hotspot-left" onMouseEnter={revealAutoHideNavBar} onMouseMove={revealAutoHideNavBar} onPointerDown={revealAutoHideNavBar} /> : null}
      {navPosition === "left" ? renderNavBar("left") : null}
      <div key={`${transitionMode}:${routeTransitionKey}`} className={`content${pageFlashActive ? " page-focus-flash" : ""}${transitionMode !== "none" ? " transition-enabled" : ""}`} data-transition-mode={transitionMode}>
      {tab === "home" && !selectedSubject && !selectedLesson && !quizActive && !selectedAdverbDay && (<>
        <div className="welcome-card"><h2>{renderWelcomeGreeting(localizedNames, language)} 👋</h2><p>{renderLocalizedTextNode(joinLocalizedText("Ready to learn something amazing today?", "آج کچھ شاندار سیکھنے کے لیے تیار ہیں؟", language), language)}</p><span className="grade-tag">{renderLocalizedTextNode(ui.grade, language)} {grade}</span></div>
        {canShowInstallBanner && <div className="app-status-card" data-ui-language={language}><div className="app-status-head"><h3>{renderSeparatedLocalizedTextNode(UI_TEXT.en.installBannerTitle, UI_TEXT.ur.installBannerTitle, language, bannerTitleOptions)}</h3><button className="banner-dismiss" onClick={() => setInstallBannerDismissed(true)} aria-label={ui.hideBanner}>{renderSeparatedLocalizedTextNode(UI_TEXT.en.hideBanner, UI_TEXT.ur.hideBanner, language, bannerButtonOptions)}</button></div><p>{renderSeparatedLocalizedTextNode(UI_TEXT.en.installBannerText, UI_TEXT.ur.installBannerText, language, bannerBodyOptions)}</p>{(canInstallApp || installAvailability === "available") && <p className="install-browser-hint">{renderSeparatedLocalizedTextNode(UI_TEXT.en.installBrowserHint, UI_TEXT.ur.installBrowserHint, language, bannerBodyOptions)}</p>}<div className="app-status-grid"><div className="status-pill"><strong>{renderSeparatedLocalizedTextNode(UI_TEXT.en.installStatus, UI_TEXT.ur.installStatus, language, bannerLabelOptions)}</strong><span>{renderSeparatedLocalizedTextNode(isInstalled || installAvailability === "installed" ? UI_TEXT.en.appInstalled : canInstallApp || installAvailability === "available" ? UI_TEXT.en.appInstallAvailable : UI_TEXT.en.appInstallUnavailable, isInstalled || installAvailability === "installed" ? UI_TEXT.ur.appInstalled : canInstallApp || installAvailability === "available" ? UI_TEXT.ur.appInstallAvailable : UI_TEXT.ur.appInstallUnavailable, language, bannerValueOptions)}</span></div><div className="status-pill"><strong>{renderSeparatedLocalizedTextNode(UI_TEXT.en.offlineAccess, UI_TEXT.ur.offlineAccess, language, bannerLabelOptions)}</strong><span>{renderSeparatedLocalizedTextNode(serviceWorkerStatus === "ready" ? UI_TEXT.en.offlineReady : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking" ? UI_TEXT.en.offlineCaching : serviceWorkerStatus === "local-static" ? UI_TEXT.en.offlineLocalStatic : serviceWorkerStatus === "update-ready" ? UI_TEXT.en.updateReady : serviceWorkerStatus === "unsupported" ? UI_TEXT.en.offlineUnsupported : UI_TEXT.en.offlineError, serviceWorkerStatus === "ready" ? UI_TEXT.ur.offlineReady : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking" ? UI_TEXT.ur.offlineCaching : serviceWorkerStatus === "local-static" ? UI_TEXT.ur.offlineLocalStatic : serviceWorkerStatus === "update-ready" ? UI_TEXT.ur.updateReady : serviceWorkerStatus === "unsupported" ? UI_TEXT.ur.offlineUnsupported : UI_TEXT.ur.offlineError, language, bannerValueOptions)}</span></div><div className="status-pill"><strong>{renderSeparatedLocalizedTextNode(UI_TEXT.en.networkStatus, UI_TEXT.ur.networkStatus, language, bannerLabelOptions)}</strong><span>{renderSeparatedLocalizedTextNode(isOnline ? UI_TEXT.en.online : UI_TEXT.en.offline, isOnline ? UI_TEXT.ur.online : UI_TEXT.ur.offline, language, bannerValueOptions)}</span></div></div><div className="app-status-actions">{canInstallApp && <button className="install-cta" onClick={handleInstallApp}>{renderSeparatedLocalizedTextNode(UI_TEXT.en.installApp, UI_TEXT.ur.installApp, language, bannerButtonOptions)}</button>}{serviceWorkerStatus === "update-ready" && <button className="ghost-cta" onClick={applyServiceWorkerUpdate}>{renderSeparatedLocalizedTextNode(UI_TEXT.en.refreshToUpdate, UI_TEXT.ur.refreshToUpdate, language, bannerButtonOptions)}</button>}</div></div>}
        <button className="adverb-home-banner" style={{ width: "100%", textAlign: "left", background: "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(34,197,94,0.12))", borderColor: "rgba(56,189,248,0.35)" }} onClick={handleStartReview}>
          <div className="banner-icon">🧠</div>
          <div className="banner-text">
            <h3>{renderLocalizedTextNode(ui.reviewReady, language)}</h3>
            <p>{renderLocalizedTextNode(
              reviewStats.due > 0
                ? (language === "ur"
                  ? `${formatNumberLabel(reviewReadyNowCount)} ابھی تیار • ${formatNumberLabel(reviewStats.due || 0)} کل باقی`
                  : language === "bilingual"
                    ? `${formatNumberLabel(reviewReadyNowCount)} ready now • ${formatNumberLabel(reviewStats.due || 0)} total due / ${formatNumberLabel(reviewReadyNowCount)} ابھی تیار • ${formatNumberLabel(reviewStats.due || 0)} کل باقی`
                    : `${formatNumberLabel(reviewReadyNowCount)} ready now • ${formatNumberLabel(reviewStats.due || 0)} total due`)
                : (language === "ur"
                  ? `${formatNumberLabel(reviewStats.reviewedToday || 0)} آج دہرائے گئے • ${formatNumberLabel(reviewStats.learning || 0)} سیکھنے میں`
                  : language === "bilingual"
                    ? `${formatNumberLabel(reviewStats.reviewedToday || 0)} reviewed today • ${formatNumberLabel(reviewStats.learning || 0)} learning / ${formatNumberLabel(reviewStats.reviewedToday || 0)} آج دہرائے گئے • ${formatNumberLabel(reviewStats.learning || 0)} سیکھنے میں`
                    : `${formatNumberLabel(reviewStats.reviewedToday || 0)} reviewed today • ${formatNumberLabel(reviewStats.learning || 0)} learning`),
            language)}</p>
          </div>
        </button>
        <div className="review-panel" style={{ marginTop: 16 }}>
          <div className="review-panel-head">
            <div>
              <h3>{renderLocalizedTextNode(joinLocalizedText("Study Goals", "مطالعہ اہداف", language), language)}</h3>
              <p>{renderLocalizedTextNode(joinLocalizedText("Track your daily review target and weekly vocabulary momentum.", "اپنے روزانہ ریویو ہدف اور ہفتہ وار الفاظ کی رفتار یہاں دیکھیں۔", language), language)}</p>
            </div>
          </div>
          <div className="goal-progress-card">
            <div className="goal-progress-row">
              <div>
                <strong>{renderLocalizedTextNode(joinLocalizedText("Daily reviews", "روزانہ ریویوز", language), language)}</strong>
                <div className="goal-progress-meta">{renderLocalizedTextNode(joinLocalizedText(`${reviewStats.reviewedToday || 0} of ${studyGoals.dailyReviews}`, `${reviewStats.reviewedToday || 0} از ${studyGoals.dailyReviews}`, language), language)}</div>
              </div>
              <span className="goal-progress-badge">{dailyGoalProgress}%</span>
            </div>
            <div className="goal-progress-bar"><span style={{ width: `${dailyGoalProgress}%` }} /></div>
            <div className="goal-progress-row" style={{ marginTop: 14 }}>
              <div>
                <strong>{renderLocalizedTextNode(joinLocalizedText("Weekly words", "ہفتہ وار الفاظ", language), language)}</strong>
                <div className="goal-progress-meta">{renderLocalizedTextNode(joinLocalizedText(`${reviewAnalytics.totals.uniqueReviewedLast7 || 0} of ${studyGoals.weeklyWords}`, `${reviewAnalytics.totals.uniqueReviewedLast7 || 0} از ${studyGoals.weeklyWords}`, language), language)}</div>
              </div>
              <span className="goal-progress-badge">{weeklyGoalProgress}%</span>
            </div>
            <div className="goal-progress-bar accent-alt"><span style={{ width: `${weeklyGoalProgress}%` }} /></div>
          </div>
        </div>
        <div className="review-panel">
          <div className="review-panel-head">
            <div>
              <h3>{renderLocalizedTextNode(joinLocalizedText("Focus Timer & Reminders", "فوکس ٹائمر اور یاد دہانیاں", language), language)}</h3>
              <p>{renderLocalizedTextNode(joinLocalizedText("Start a quiet study sprint and keep your reminder schedule visible.", "ایک مختصر مطالعہ سیشن شروع کریں اور اپنی یاد دہانی کی حالت دیکھیں۔", language), language)}</p>
            </div>
          </div>
          <div className="timer-card">
            <div className="timer-clock">{formatClockTime(focusTimerState.remainingSeconds)}</div>
            <div className="timer-meta">
              {renderLocalizedTextNode(joinLocalizedText(`${focusTimerSettings.durationMinutes} min focus block`, `${focusTimerSettings.durationMinutes} منٹ فوکس وقت`, language), language)}
            </div>
            <div className="result-actions" style={{ marginTop: 12 }}>
              <button className="retry-btn" onClick={() => setFocusTimerState((current) => ({ ...current, active: !current.active || (current.remainingSeconds || 0) === 0, remainingSeconds: (current.remainingSeconds || 0) === 0 ? (focusTimerSettings.durationMinutes || 20) * 60 : current.remainingSeconds, startedAt: Date.now() }))}>
                {renderLocalizedTextNode(focusTimerState.active ? joinLocalizedText("Pause", "روکیں", language) : joinLocalizedText("Start", "شروع کریں", language), language)}
              </button>
              <button className="next-btn" onClick={() => setFocusTimerState((current) => ({ ...current, active: false, remainingSeconds: (focusTimerSettings.durationMinutes || 20) * 60 }))}>
                {renderLocalizedTextNode(joinLocalizedText("Reset", "دوبارہ", language), language)}
              </button>
            </div>
            <div className="timer-reminder-status">
              <span>{renderLocalizedTextNode(joinLocalizedText("Reminder", "یاد دہانی", language), language)}</span>
              <strong>{renderLocalizedTextNode(currentReminderLabel, language)}</strong>
            </div>
            {reminderDueNow ? <p className="empty-state" style={{ marginTop: 10 }}>{renderLocalizedTextNode(joinLocalizedText("Your study reminder is due now.", "آپ کی مطالعہ یاد دہانی ابھی کی ہے۔", language), language)}</p> : null}
          </div>
        </div>
        <div className="review-panel">
          <div className="review-panel-head">
            <div>
              <h3>{renderLocalizedTextNode(ui.notificationHistory, language)}</h3>
              <p>{renderLocalizedTextNode(ui.notificationHistoryHint, language)}</p>
            </div>
          </div>
          {recentNotificationHistory.length > 0 ? (
            <div className="notification-history-list">
              {recentNotificationHistory.map((entry) => (
                <div key={entry.id} className="notification-history-item">
                  <div className="notification-history-top">
                    <strong>{renderLocalizedTextNode(joinLocalizedText(entry.titleEn, entry.titleUr, language), language)}</strong>
                    <span>{renderLocalizedTextNode(formatNotificationTime(entry.createdAt, language), language)}</span>
                  </div>
                  <p>{renderLocalizedTextNode(joinLocalizedText(entry.bodyEn, entry.bodyUr, language), language)}</p>
                </div>
              ))}
            </div>
          ) : <p className="empty-state">{renderLocalizedTextNode(ui.noNotificationsYet, language)}</p>}
        </div>
        {streak > 0 && <div className="streak-banner"><span className="streak-fire">🔥</span><div className="streak-info"><h4>{renderLocalizedTextNode(joinLocalizedText(`${streak} Day Streak!`, `${streak} دن کا تسلسل!`, language), language)}</h4><p>{renderLocalizedTextNode(joinLocalizedText("Keep going, you're doing great!", "اسی طرح جاری رکھیں، آپ بہت اچھا کر رہے ہیں!", language), language)}</p></div></div>}
        <h3 className="section-title">{renderLocalizedTextNode(joinLocalizedText("Subjects", "مضامین", language), language)}</h3>
        <div className="subject-grid">{SUBJECTS.map(subj => { const ls = getLessons(subj.id, grade), done = ls.filter(l => completedQuizzes[l.id]).length, pct = ls.length > 0 ? (done / ls.length) * 100 : 0; return (<button key={subj.id} className="subject-card" onClick={() => setSelectedSubject(subj)}><span className="subj-icon">{subj.icon}</span><span className="subj-name">{subj.name}</span><span className="subj-name-ur">{subj.nameUr}</span><div className="subj-progress"><div className="subj-progress-fill" style={{ width: pct + "%", background: subj.color }} /></div></button>); })}</div>
      </>)}


      {tab === "home" && selectedSubject && !selectedLesson && !quizActive && (<>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, direction: (selectedSubject?.id==="urdu" || isUrduUi(language))?"rtl":"ltr" }}><span style={{ fontSize: 36 }}>{selectedSubject.icon}</span><div><h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: (selectedSubject?.id==="urdu" || isUrduUi(language))?"'Noto Nastaliq Urdu',serif":"inherit" }}>{renderLocalizedTextNode(getSubjectDisplayName(selectedSubject, language), language)}</h2><p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: (selectedSubject?.id==="urdu" || isUrduUi(language))?"'Noto Nastaliq Urdu',serif":"inherit" }}>{renderLocalizedTextNode(`${ui.grade} ${grade} • ${getLessons(selectedSubject.id, grade).length} ${ui.lessons}`, language)}</p></div></div>
        <div className="lesson-list" style={(selectedSubject?.id==="urdu" || isUrduUi(language))?{direction:"rtl"}:{}}>{getLessons(selectedSubject.id, grade).map((l, i) => { const d = completedQuizzes[l.id]; const isUr = selectedSubject?.id==="urdu" || isUrduUi(language); return (<button key={l.id} className="lesson-card" onClick={() => setSelectedLesson(l)} style={isUr?{direction:"rtl",textAlign:"right",fontFamily:"'Noto Nastaliq Urdu',serif"}:{}}><span className="lesson-num">{`${ui.lesson} ${i+1}`}</span><h3>{l.title}</h3><p style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif"}:{}}>{l.content.substring(0, 80)}...</p><div className="lesson-status" style={{ color: d ? "var(--success)" : "var(--text-muted)" }}>{d ? "✅" : "○"} {d ? `${ui.completed} - ${d.score}/4` : ui.notStarted}</div></button>); })}</div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && !selDay && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p><StudyItemInlineToolbar studyItem={{ prompt: selectedLesson.content, subject: "english", section: selectedLesson.key || "english", sectionLabel: selectedLesson.title }} />
          <button className="start-quiz-btn" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizDone(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🎯 {ui.startQuiz}</button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 14 }}>
          {[{id:"adverbs",label:"📖 Adverbs",c:"#38BDF8"},{id:"prepositions",label:"📍 Prepositions",c:"#22C55E"},{id:"adjectives",label:"🏷️ Adjectives",c:"#F59E0B"},{id:"conjunctions",label:"🔗 Conjunctions",c:"#A855F7"},{id:"pronouns",label:"👤 Pronouns",c:"#EC4899"},{id:"nouns",label:"📦 Col. Nouns",c:"#14B8A6"},{id:"verbs",label:"✏️ Verbs",c:"#F97316"}].map(t => (
            <button key={t.id} onClick={() => setPosTab(t.id)} style={{ flex: "1 1 30%", padding: "8px 4px", borderRadius: 10, border: posTab === t.id ? "2px solid "+t.c : "1px solid var(--border)", background: posTab === t.id ? t.c+"22" : "var(--bg-elevated)", color: posTab === t.id ? t.c : "var(--text-muted)", fontFamily: "'Baloo 2', sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" }}>{t.label}</button>
          ))}
        </div>

        <div className="tts-hint">🔊 Tap English → English voice | Tap Urdu → Urdu voice</div>

        {posTab === "adverbs" && pacedPos.adverbs.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedAdverbDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "prepositions" && pacedPos.prepositions.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedPrepDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "adjectives" && pacedPos.adjectives.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedAdjDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "conjunctions" && pacedPos.conjunctions.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedConjDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "pronouns" && pacedPos.pronouns.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedPronDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "nouns" && pacedPos.collectiveNouns.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedNounDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}

        {posTab === "verbs" && pacedPos.verbs.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedVerbDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdverbDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📝 Day {selectedAdverbDay.day} — Vocabulary</h3>{selectedAdverbDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedAdverbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const aw = selectedAdverbDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={aw?.en} studyItem={{ subject: "english", section: "adverbsParagraphs", sectionLabel: "Adverb Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedAdverbDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPrepDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📍 Day {selectedPrepDay.day} — Prepositions</h3>{selectedPrepDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedPrepDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const pw = selectedPrepDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split(" ")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={pw?.en} studyItem={{ subject: "english", section: "prepositionsParagraphs", sectionLabel: "Preposition Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedPrepDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
        {selectedPrepDay.difficult && (<div className="adverb-detail-section"><h3>📚 Difficult Words</h3>{selectedPrepDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdjDay && (<>
        <div className="tts-hint">🔊 Tap English forms → hear all 3 forms spoken | Tap Urdu → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>🏷️ Day {selectedAdjDay.day} — Adjective Forms</h3>{selectedAdjDay.words.map((w, i) => <AdjWordRow key={i} en={w.en} ur={w.ur} comp={w.comp} sup={w.super} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedAdjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const aw = selectedAdjDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={aw?.en} studyItem={{ subject: "english", section: "adjectivesParagraphs", sectionLabel: "Adjective Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedAdjDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedConjDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>🔗 Day {selectedConjDay.day} — Conjunctions</h3>{selectedConjDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedConjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const cw = selectedConjDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split("...")[0].split(" ")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={cw?.en} studyItem={{ subject: "english", section: "conjunctionParagraphs", sectionLabel: "Conjunction Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedConjDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
        {selectedConjDay.difficult && (<div className="adverb-detail-section"><h3>📚 Difficult Words</h3>{selectedConjDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPronDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>👤 Day {selectedPronDay.day} — Pronouns</h3>{selectedPronDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedPronDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const pw = selectedPronDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase().split(" ")[0].split("/")[0])); return <SpeakableSentence key={i} text={s} lang="en" highlight={pw?.en} studyItem={{ subject: "english", section: "pronounParagraphs", sectionLabel: "Pronoun Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedPronDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedNounDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu word → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>📦 Day {selectedNounDay.day} — Collective Nouns</h3>{selectedNounDay.words.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedNounDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const nw = selectedNounDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={nw?.en} studyItem={{ subject: "english", section: "collectiveNounParagraphs", sectionLabel: "Collective Noun Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedNounDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedVerbDay && (<>
        <div className="tts-hint">🔊 Tap V1 → V2 → V3 forms spoken | Tap Urdu → Urdu voice | Tap sentence → hear it read!</div>
        <div className="adverb-detail-section"><h3>✏️ Day {selectedVerbDay.day} — Verb Forms</h3>{selectedVerbDay.words.map((w, i) => <VerbWordRow key={i} en={w.en} ur={w.ur} v2={w.v2} v3={w.v3} />)}</div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedVerbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => { const vw = selectedVerbDay.words.find(w => s.toLowerCase().includes(w.en.toLowerCase())); return <SpeakableSentence key={i} text={s} lang="en" highlight={vw?.en} studyItem={{ subject: "english", section: "verbParagraphs", sectionLabel: "Verb Paragraphs" }} />; })}
          <button className="play-all-btn" onClick={() => playAll(selectedVerbDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && !selectedLesson.hasAdverbs && !selectedLesson.hasTenses && !selectedLesson.hasVocab && !selectedLesson.hasMathSub && (<div className="lesson-detail"><h2>{selectedLesson.title}</h2><p className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{selectedLesson.content}</p><StudyItemInlineToolbar studyItem={{ prompt: selectedLesson.content, subject: selectedSubject?.id || "general", section: selectedLesson.key || selectedLesson.title, sectionLabel: selectedLesson.title }} /><button className="start-quiz-btn" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizDone(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🎯 Start Quiz</button></div>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx === null && (<>
        {(() => { const isUr = selectedSubject?.id === "urdu"; return (<>
        <div className="lesson-detail" style={isUr?{direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"}:{}}><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p><StudyItemInlineToolbar studyItem={{ prompt: selectedLesson.content, subject: selectedSubject?.id || "general", section: selectedLesson.key || selectedLesson.title, sectionLabel: selectedLesson.title }} /></div>
        <h3 className="section-title" style={{ marginTop: 8, direction: isUr?"rtl":"ltr", textAlign: isUr?"right":"left" }}>{isUr ? "📐 موضوعات" : "📐 Topics"}</h3>
        {activeLessonSubs.map((sub, i) => {
          const topicColors = ["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899","#14B8A6","#F97316"];
          const tc = topicColors[i % topicColors.length];
          return (
          <div key={i} className="adverb-day-card" onClick={() => { setMathSubIdx(i); setMathSubTab("examples"); setSubExerciseGroupIdx(null); setSubQuizGroupIdx(null); setRevealedEx({}); }} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
            <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:tc+"22",border:"2px solid "+tc,color:tc,fontSize:16,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",flexShrink:0}}>{i+1}</span>
            <div style={{flex:1,textAlign:isUr?"right":"left"}}>
              <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{sub.t}</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{sub.c.substring(0,80)}...</p>
            </div>
          </div>);
        })}
        </>); })()}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx !== null && (() => {
        const sub = normalizeSubLesson(activeLessonSubs[mathSubIdx], selectedSubject?.id);
        const isTensesSub = !!sub?.isTensesSub;
        const adjustedDayLessons = sub.dayLessons;
        const toggleReveal = (k) => setRevealedEx(p => ({...p,[k]:!p[k]}));
        const isUr = selectedSubject?.id === "urdu";
        const isMath = selectedSubject?.id === "math";
        const activeExerciseGroup = sub.exerciseGroups && subExerciseGroupIdx !== null ? sub.exerciseGroups[subExerciseGroupIdx] : null;
        const activeQuizGroup = sub.quizGroups && subQuizGroupIdx !== null ? sub.quizGroups[subQuizGroupIdx] : null;
        const exercisesToRender = activeExerciseGroup ? activeExerciseGroup.exercises : (sub.exerciseGroups ? null : sub.exercises);
        const quizToRender = activeQuizGroup ? activeQuizGroup.questions : (sub.quizGroups ? null : sub.quiz);
        const urS = isUr ? {direction:"rtl",fontFamily:"'Noto Nastaliq Urdu',serif",textAlign:"right"} : {};
        if (isTensesSub) {
          return (<>
            {!selectedTensePara ? (<>
              <div className="lesson-detail"><h2>{sub.t}</h2><p>{sub.c}</p><StudyItemInlineToolbar studyItem={{ prompt: sub.c, subject: "english", section: "tenses", sectionLabel: sub.t }} /></div>

              <div style={{ display: "flex", gap: 6, marginTop: 8, marginBottom: 10 }}>
                {[{id:"present",label:"🕐 Present",c:"#38BDF8"},{id:"past",label:"🕑 Past",c:"#F59E0B"},{id:"future",label:"🕒 Future",c:"#22C55E"}].map(t => (
                  <button key={t.id} onClick={() => { setTenseMain(t.id); setTenseSub("simple"); }} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: tenseMain === t.id ? "2px solid "+t.c : "1px solid var(--border)", background: tenseMain === t.id ? t.c+"22" : "var(--bg-elevated)", color: tenseMain === t.id ? t.c : "var(--text-muted)", fontFamily: "'Baloo 2', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
                ))}
              </div>

              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {[{id:"simple",label:"Simple"},{id:"continuous",label:"Continuous"},{id:"perfect",label:"Perfect"},{id:"perfectContinuous",label:"Perf. Cont."}].map(t => (
                  <button key={t.id} onClick={() => setTenseSub(t.id)} style={{ flex: 1, padding: "8px 3px", borderRadius: 8, border: tenseSub === t.id ? "2px solid #E879F9" : "1px solid var(--border)", background: tenseSub === t.id ? "rgba(232,121,249,0.15)" : "var(--bg-elevated)", color: tenseSub === t.id ? "#E879F9" : "var(--text-muted)", fontFamily: "'Baloo 2', sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
                ))}
              </div>

              {TENSES[tenseMain] && TENSES[tenseMain][tenseSub] && (<>
                <div className="adverb-detail-section" style={{ marginBottom: 12 }}>
                  <h3 style={{ color: "#E879F9" }}>{TENSES[tenseMain][tenseSub].name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ur)", direction: "rtl", marginTop: 4 }}>{TENSES[tenseMain][tenseSub].nameUr}</p>
                  <p style={{ fontSize: 12, color: "#38BDF8", marginTop: 8, fontWeight: 600, background: "rgba(56,189,248,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(56,189,248,0.2)" }}>📐 {TENSES[tenseMain][tenseSub].formula}</p>
                  <StudyItemInlineToolbar studyItem={{ prompt: TENSES[tenseMain][tenseSub].formula, subject: "english", section: "tenseFormula", sectionLabel: TENSES[tenseMain][tenseSub].name, secondaryText: TENSES[tenseMain][tenseSub].nameUr }} />
                </div>
                <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
                {TENSES[tenseMain][tenseSub].items.map((item, i) => (
                  <div key={i} className="adverb-day-card" onClick={() => setSelectedTensePara(item)}>
                    <span className="day-num">Paragraph {i + 1}</span>
                    <h3>{item.title}</h3>
                    <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{item.para.substring(0, 80)}...</p>
                  </div>
                ))}
              </>)}
            </>) : (<>
              <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
              <div className="adverb-detail-section"><h3>📖 {selectedTensePara.title}</h3>
                {selectedTensePara.para.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => <SpeakableSentence key={i} text={s} lang="en" studyItem={{ subject: "english", section: "tenseParagraphs", sectionLabel: selectedTensePara.title }} />)}
                <button className="play-all-btn" onClick={() => playAll(selectedTensePara.para)}>▶️ Play Entire Paragraph</button>
              </div>
              {selectedTensePara.qs && (<div className="adverb-detail-section"><h3>❓ Comprehension Questions</h3>
                {selectedTensePara.qs.map((q, i) => (
                  <div key={i} style={{ padding: "10px 14px", marginBottom: 10, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 14, color: "var(--text-primary)" }}>
                    <div className="inline-study-row">
                      <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>Q{i+1}.</span>
                        <span>{q}</span>
                      </div>
                      <InlineStudyActionBar studyItem={{ prompt: q, subject: "english", section: "tenseQuestions", sectionLabel: selectedTensePara.title }} />
                    </div>
                  </div>
                ))}
              </div>)}
            </>)}
          </>);
        }
        return (<>
        <div className="adverb-detail-section" style={{marginBottom:10,...urS}}>
          <h3 style={{color:"#FF6B35",...urS}}>{isUr?"📖":"📐"} {sub.t}</h3>
          {isMath ? <MathVisualDeck sub={sub} lessonTitle={selectedLesson?.title} /> : <>
          {sub.svgType === "placeValue" && <PlaceValueChart number={sub.svgData.number} />}
          {sub.svgType === "expandedForm" && <ExpandedFormSVG number={sub.svgData.number} parts={sub.svgData.parts} />}
          {sub.svgType === "compare" && <CompareTripleSVG />}
          {sub.svgType === "rounding" && <RoundingDualSVG />}
          {sub.svgType === "columnAdd" && <ColumnAddSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />}
          {sub.svgType === "columnSub" && <ColumnSubSVG num1={sub.svgData.num1} num2={sub.svgData.num2} result={sub.svgData.result} />}
          {sub.svgType === "estimation" && <EstimationSVG num1={sub.svgData.num1} num2={sub.svgData.num2} op={sub.svgData.op} rounded1={sub.svgData.rounded1} rounded2={sub.svgData.rounded2} estimate={sub.svgData.estimate} exact={sub.svgData.exact} />}
{sub.svgType === "statesOfMatter" && <StatesOfMatterSVG />}
{sub.svgType === "materialProperties" && <MaterialPropertiesSVG />}
{sub.svgType === "mixturesSolutions" && <MixturesSolutionsSVG />}
{sub.svgType === "gravityForce" && <GravityForceSVG />}
{sub.svgType === "frictionForce" && <FrictionForceSVG />}
{sub.svgType === "foodChain" && <FoodChainSVG />}
{sub.svgType === "solarSystem" && <SolarSystemSVG />}
{sub.svgType === "earthLayers" && <EarthLayersSVG />}
{sub.svgType === "bodySystem" && <BodySystemSVG system={sub.svgData.system} />}
{sub.svgType === "moonPhases" && <MoonPhasesSVG />}
{sub.svgType === "magnetPoles" && <MagnetPolesSVG />}
{sub.svgType === "lightReflection" && <LightRefractionSVG />}
{sub.svgType === "simpleMachines" && <SimpleMachinesSVG />}
{sub.svgType === "energyTypes" && <EnergyTypesSVG />}
{sub.svgType === "dayNight" && <DayNightSVG />}
{sub.svgType === "seasonsCycle" && <SeasonsCycleSVG />}
{sub.svgType === "nervousSystem" && <NervousSystemSVG />}
{sub.svgType === "classificationGroups" && <ClassificationSVG />}
{sub.svgType === "adaptationTraits" && <AdaptationSVG />}
{sub.svgType === "soundWaves" && <SoundWavesSVG />}
{sub.svgType === "skeleton" && <SkeletonSVG />}
          {sub.svgType === "waterCycle" && <WaterCycleSVG />}
          {sub.svgType === "photosynthesis" && <PhotosynthesisSVG />}
          {sub.svgType === "pakistanMap" && <PakistanMapSVG />}
          {sub.svgType === "indusValley" && <IndusValleySVG />}
          {sub.svgType === "pakFlag" && <PakFlagSVG />}
          {sub.svgType === "pakGov" && <PakGovSVG />}
          {sub.svgType === "presidentialSystem" && <PresidentialSystemSVG />}
          {sub.svgType === "federalParliamentry" && <FederalParliamentrySVG />}
          {sub.svgType === "pakRivers" && <PakRiversSVG />}
          {sub.svgType === "numberLine" && <>
            <NumberLineSVG min={sub.svgData.min} max={sub.svgData.max} marks={sub.svgData.marks} highlight={sub.svgData.highlight} />
            <div className="math-svg"><svg viewBox="0 0 620 100" xmlns="http://www.w3.org/2000/svg">
              <rect width="620" height="100" rx="12" fill="#1E293B"/>
              <text x="310" y="18" textAnchor="middle" fill="#94A3B8" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive &amp; Negative Numbers</text>
              <line x1="30" y1="52" x2="590" y2="52" stroke="#475569" strokeWidth="3" strokeLinecap="round"/>
              <polygon points="22,52 30,46 30,58" fill="#475569"/>
              <polygon points="598,52 590,46 590,58" fill="#475569"/>
              {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map((n,i) => {
                const x = 310 + n * 52;
                const isZero = n === 0;
                const isNeg = n < 0;
                const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
                return (<g key={i} onClick={() => handleBoxClick(s.label)} style={{cursor: 'pointer'}}>
                  <line x1={x} y1="44" x2={x} y2="60" stroke={col} strokeWidth={isZero ? 4 : 2}/>
                  <text x={x} y="80" textAnchor="middle" fill={col} fontSize={isZero ? "18" : "15"} fontWeight={isZero ? "900" : "700"} fontFamily="'Baloo 2'">{n}</text>
                  {isZero && <circle cx={x} cy="52" r="6" fill="#F59E0B"/>}
                </g>);
              })}
              <text x="80" y="38" textAnchor="middle" fill="#EF4444" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">← Negative</text>
              <text x="540" y="38" textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="700" fontFamily="'Baloo 2'">Positive →</text>
            </svg></div>
          </>}
          </>}
          {sub.c.split(/(?<=[.!?۔؟])\s+/).filter(Boolean).map((s,i) => <SpeakableSentence key={i} text={s} lang={isUr?"ur":"en"} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: sub.t }} />)}
          <button className="play-all-btn" style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}:{}} onClick={() => playAll(sub.c)}>{isUr?"▶️ سنیں":"▶️ Play Explanation"}</button>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:14,direction:isUr?"rtl":"ltr"}}>
          {[{id:"examples",label:isUr?"💡 مثالیں":"💡 Examples",c:"#38BDF8"},{id:"exercises",label:isUr?"✏️ مشقیں":"✏️ Exercises",c:"#22C55E"},{id:"quiz",label:isUr?"🎯 امتحان":"🎯 Quiz",c:"#F59E0B"}].map(t=>(
            <button key={t.id} onClick={()=>{setMathSubTab(t.id);setSubExerciseGroupIdx(null);setSubQuizGroupIdx(null);setRevealedEx({});}} style={{flex:1,padding:"10px 6px",borderRadius:10,border:mathSubTab===t.id?"2px solid "+t.c:"1px solid var(--border)",background:mathSubTab===t.id?t.c+"22":"var(--bg-elevated)",color:mathSubTab===t.id?t.c:"var(--text-muted)",fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",fontSize:isUr?14:13,fontWeight:700,cursor:"pointer"}}>{t.label}</button>
          ))}
        </div>

        {mathSubTab === "examples" && adjustedDayLessons && (<div style={urS}>
          <h3 className="section-title" style={{color:"#38BDF8",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{sub.lessonLabel || (isUr?"📅 اسباق کے دن":"📅 Lesson Days")}</h3>
          {adjustedDayLessons.map((lessonDay, dayIdx) => (
            <div key={lessonDay.day || dayIdx} className="adverb-detail-section" style={urS}>
              <h3 style={{color:"#38BDF8",marginBottom:12,...urS}}>{isUr ? `📅 دن ${lessonDay.day}` : `📅 Day ${lessonDay.day}`}</h3>
              {lessonDay.title && <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10, ...urS }}>{lessonDay.title}</p>}
              {lessonDay.words && lessonDay.words.map((w, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  {"opposite" in w || "oppositeUr" in w ? <OppositeWordRow en={w.en} ur={w.ur} opposite={w.opposite} oppositeUr={w.oppositeUr} /> : "comp" in w || "super" in w ? <AdjWordRow en={w.en} ur={w.ur} comp={w.comp} sup={w.super} /> : "v2" in w || "v3" in w ? <VerbWordRow en={w.en} ur={w.ur} v2={w.v2} v3={w.v3} /> : <WordRow en={w.en} ur={w.ur} />}
                  {!sub.showWordSentences && w.meaning && <div style={{ padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>→ {w.meaning}</div>}
                  {sub.showWordSentences && (w.sentence || w.meaning) && (
                    <div style={{ marginTop: 8, paddingLeft: 14, paddingRight: 14 }}>
                      <SpeakableSentence
                        text={w.sentence || w.meaning}
                        lang="en"
                        studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: sub.t, answer: w.en }}
                        buttonStyle={{ background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.24)", color: isLightTheme ? "var(--text-primary)" : "#E0F2FE", marginBottom: 0, justifyContent: "flex-start", width: "100%" }}
                      />
                    </div>
                  )}
                </div>
              ))}
              {lessonDay.pairs && lessonDay.pairs.map((pair, i) => (
                <div key={i} className="word-row" style={{cursor:"default",gap:10,flexDirection:"column",alignItems:"stretch"}}>
                  <div style={{display:"flex",alignItems:"stretch",gap:10,width:"100%"}}>
                  <div style={{flex:1}}><SpeakableSentence text={pair.left} lang="en" showStudyToolbar={false} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Pairs`, secondaryText: pair.right }} /></div>
                  <span style={{color:"var(--accent)",fontWeight:800}}>↔</span>
                  <div style={{flex:1}}><SpeakableSentence text={pair.right} lang="en" showStudyToolbar={false} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Pairs`, secondaryText: pair.left }} /></div>
                  <InlineStudyActionBar studyItem={{ prompt: pair.left, answer: pair.right, subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Pairs` }} />
                  </div>
                </div>
              ))}
              {lessonDay.paragraph && (<>
                <div style={{fontSize:12,fontWeight:800,color:"#22C55E",marginTop:12,marginBottom:8,fontFamily:"'Baloo 2',sans-serif"}}>{isUr?"📖 پیراگراف":"📖 Practice Paragraph"}</div>
                {lessonDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => {
                  const found = (lessonDay.words || []).find(w => s.toLowerCase().includes((w.en || "").toLowerCase().split(" ")[0].replace("(", "")));
                  const hasOpposites = (lessonDay.words || []).some(w => "opposite" in w || "oppositeUr" in w);
                  const sentenceHighlights = (lessonDay.words || []).map(w => w.en).filter(Boolean).filter(word => s.toLowerCase().includes(normalizeHighlightTerm(word)));
                  const paragraphSentence = hasOpposites ? stripInlineUrduForKnownWords(s, lessonDay.words || []) : s;
                  return hasOpposites
                    ? <MixedUrduParagraphSentence key={i} text={paragraphSentence} highlight={sentenceHighlights} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Paragraph` }} />
                    : <SpeakableSentence key={i} text={s} lang="en" highlight={sentenceHighlights} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Paragraph` }} />;
                })}
                <button className="play-all-btn" onClick={() => playAll(lessonDay.paragraph)}>▶️ Play Entire Paragraph</button>
              </>)}
              {lessonDay.difficult && lessonDay.difficult.length > 0 && (<>
                <div style={{fontSize:12,fontWeight:800,color:"#F59E0B",marginTop:12,marginBottom:8,fontFamily:"'Baloo 2',sans-serif"}}>{isUr?"📚 مشکل الفاظ":"📚 Difficult Words"}</div>
                {lessonDay.difficult.map((w, i) => <WordRow key={i} en={w.en} ur={w.ur} />)}
              </>)}
            </div>
          ))}
        </div>)}

        {mathSubTab === "examples" && sub.sentencePairs && (<div className="adverb-detail-section">
          <h3 style={{color:"#38BDF8",marginBottom:10}}>{sub.examplesLabel || "🗣️ Sentences"}</h3>
          {regroupSentencePairs(sub.sentencePairs, daySectionSettings.sentences.itemsPerDay).map((group) => (
              <div key={group.day} style={{ marginBottom: 14 }}>
                <div style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 800, marginBottom: 8 }}>{language === "ur" ? `سیٹ ${group.day}` : `Set ${group.day}`}</div>
              {group.sentencePairs.map((pair, i) => <SentencePairRow key={`${group.day}_${i}`} en={pair.en} ur={pair.ur} />)}
            </div>
          ))}
          <button className="play-all-btn" onClick={()=>playAll(sub.sentencePairs.map(pair => pair.en).join(" "))}>▶️ Play All English Sentences</button>
        </div>)}

        {mathSubTab === "examples" && !sub.dayLessons && !sub.sentencePairs && sub.examples && (<div className="adverb-detail-section" style={urS}>
          <h3 style={{color:"#38BDF8",marginBottom:10,...urS}}>{sub.examplesLabel || (isUr?"💡 مثالیں":"💡 Examples")}</h3>
          {sub.examples.map((ex,i) => (
            <div key={i} className="inline-study-row" style={{ direction: isUr ? "rtl" : "ltr" }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex" }}>
                <SpeakableSentence
                  text={ex}
                  lang={isUr?"ur":"en"}
                  studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Examples` }}
                  showStudyToolbar={false}
                  buttonStyle={{ marginBottom: 0, height: "100%", display: "flex", alignItems: "center" }}
                />
              </div>
              <InlineStudyActionBar studyItem={{ prompt: ex, subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Examples` }} />
            </div>
          ))}
          <button className="play-all-btn" style={isUr?{fontFamily:"'Noto Nastaliq Urdu',serif",direction:"rtl"}:{}} onClick={()=>playAll(sub.examples.join(". "))}>{isUr?"▶️ سب سنیں":"▶️ Play All Examples"}</button>
        </div>)}

        {mathSubTab === "exercises" && (sub.exerciseGroups || sub.exercises) && (<div style={urS}>
          {sub.exerciseGroups && subExerciseGroupIdx === null ? (
            <>
              <h3 className="section-title" style={{color:"#22C55E",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{isUr?"✏️ مشق کے دن":"✏️ Exercise Days"}</h3>
              {sub.exerciseGroups.map((group, gi) => (
                <div key={group.label} className="adverb-day-card" onClick={() => { setSubExerciseGroupIdx(gi); setRevealedEx({}); }} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:"#22C55E22",border:"2px solid #22C55E",color:"#22C55E",fontSize:16,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{gi + 1}</span>
                  <div style={{flex:1,textAlign:isUr?"right":"left"}}>
                    <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{group.label}</h3>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{isUr?"ان دنوں کی تمام مشقیں":"All exercises for these days"}</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {activeExerciseGroup && <div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",direction:isUr?"rtl":"ltr"}}>
                  <h3 style={{color:"#22C55E",margin:0,...urS}}>{activeExerciseGroup.label}</h3>
<button className="play-all-btn" style={dayGroupBackButtonStyle} onClick={() => { setSubExerciseGroupIdx(null); setRevealedEx({}); }}>{isUr?"← دنوں کی فہرست":"← Back to Day Groups"}</button>
                </div>
              </div>}
          {exercisesToRender && exercisesToRender.map((ex,ei) => {
            const qColors = ["#38BDF8","#22C55E","#F59E0B","#A855F7","#EC4899","#14B8A6","#F97316","#6366F1"];
            const qc = qColors[ei % qColors.length];
            const isColumnMatch = ex.q === "Match the columns:" || ex.q === "کالم ملائیں:";
            const matchOrder = isColumnMatch && ex.ans ? ex.ans.map((_,i) => i) : [];
            if (isColumnMatch && matchOrder.length > 1) {
              for (let i = matchOrder.length - 1; i > 0; i--) {
                const swapIndex = ((ei + 1) * (i + 3) + ex.q.length) % (i + 1);
                [matchOrder[i], matchOrder[swapIndex]] = [matchOrder[swapIndex], matchOrder[i]];
              }
              if (matchOrder.every((value, index) => value === index)) {
                matchOrder.push(matchOrder.shift());
              }
            }
            return (
            <div key={ei} className="adverb-detail-section" style={{marginBottom:14,...urS}}>
              <div style={{display:"flex",direction:isUr?"rtl":"ltr",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:36,height:36,borderRadius:10,background:qc+"22",border:"2px solid "+qc,color:qc,fontSize:13,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?("س"+(ei+1)):("Q"+(ei+1))}</span>
                <div style={{flex:1}}><SpeakableSentence text={ex.q} lang={isUr?"ur":"en"} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Questions` }} showStudyToolbar={false} /></div>
              </div>
              {isColumnMatch ? (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))",gap:14,direction:isUr?"rtl":"ltr"}}>
                  <div style={{background:"var(--bg-elevated)",border:"1px solid rgba(56,189,248,0.25)",borderRadius:12,padding:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:8}}>
                      <span style={{color:"#38BDF8",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"کالم A":"Column A"}</span>
                      <span style={{color:"var(--text-muted)",fontSize:11,fontWeight:700,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"صحیح جواب کالم B میں":"Show correct from Column B"}</span>
                    </div>
                    {ex.parts.map((p,pi) => {
                      const rk = ei+"_A_"+pi;
                      const pc = qColors[(ei+pi+1) % qColors.length];
                      const displayP = p.replace(/(\d)̲/g, '[$1]').replace(/(\d)\u0332/g, '[$1]');
                      return (<div key={"A_"+pi} style={{display:"flex",alignItems:"stretch",gap:8,marginBottom:8,paddingLeft:isUr?0:4,paddingRight:isUr?4:0,direction:isUr?"rtl":"ltr"}}>
                        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>A{pi+1}</span>
                        <div style={{flex:1,minWidth:0,display:"flex"}}>
                          <SpeakableSentence
                            text={displayP}
                            lang={isUrduText(displayP)?"ur":"en"}
                            studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Items` }}
                            showStudyToolbar={false}
                            buttonStyle={{ marginBottom: 0, height: "100%", display: "flex", alignItems: "center" }}
                          />
                        </div>
                        {revealedEx[rk] && ex.ans && ex.ans[pi] && (
                          <div style={{flex:"0 1 auto",width:"fit-content",maxWidth:"50%",minWidth:0,display:"flex",alignSelf:"stretch"}}>
                            <SpeakableSentence
                              text={formatListedAnswer(ex.ans[pi])}
                              lang={isUrduText(ex.ans[pi])?"ur":"en"}
                              fullWidth={false}
                              studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Answers` }}
                              showStudyToolbar={false}
                              buttonStyle={{ ...revealedAnswerButtonStyle, marginBottom: 0, height: "100%", display: "flex", alignItems: "center", maxWidth: "100%" }}
                              textStyle={getRevealedAnswerTextStyle(isUrduText(ex.ans[pi]))}
                            />
                          </div>
                        )}
                        <QuestionActionBar
                          studyItem={{ prompt: displayP, subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Items` }}
                          revealed={revealedEx[rk]}
                          onToggleReveal={() => toggleReveal(rk)}
                          showLabel={revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}
                          buttonStyle={getRevealToggleStyle(revealedEx[rk], isUr)}
                        />
                      </div>);
                    })}
                  </div>
                  <div style={{background:"var(--bg-elevated)",border:"1px solid rgba(245,158,11,0.25)",borderRadius:12,padding:12}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,gap:8}}>
                      <span style={{color:"#F59E0B",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"کالم B":"Column B"}</span>
                      <span style={{color:"var(--text-muted)",fontSize:11,fontWeight:700,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif"}}>{isUr?"صحیح جواب کالم A میں":"Show correct from Column A"}</span>
                    </div>
                    {ex.ans && matchOrder.map((originalIndex,pi) => {
                      const rk = ei+"_B_"+originalIndex;
                      const pc = qColors[(ei+pi+3) % qColors.length];
                      const a = ex.ans[originalIndex];
                      return (<div key={"B_"+pi} style={{display:"flex",alignItems:"stretch",gap:8,marginBottom:8,paddingLeft:isUr?0:4,paddingRight:isUr?4:0,direction:isUr?"rtl":"ltr"}}>
                        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>B{pi+1}</span>
                        <div style={{flex:1,minWidth:0,display:"flex"}}>
                          <SpeakableSentence
                            text={a}
                            lang={isUrduText(a)?"ur":"en"}
                            studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Match Answers` }}
                            showStudyToolbar={false}
                            buttonStyle={{ marginBottom: 0, height: "100%", display: "flex", alignItems: "center" }}
                          />
                        </div>
                        {revealedEx[rk] && ex.parts && ex.parts[originalIndex] && (
                          <div style={{flex:"0 1 auto",width:"fit-content",maxWidth:"50%",minWidth:0,display:"flex",alignSelf:"stretch"}}>
                            <SpeakableSentence
                              text={formatListedAnswer(ex.parts[originalIndex])}
                              lang={isUrduText(ex.parts[originalIndex])?"ur":"en"}
                              fullWidth={false}
                              studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Match Prompts` }}
                              showStudyToolbar={false}
                              buttonStyle={{ ...revealedAnswerButtonStyle, marginBottom: 0, height: "100%", display: "flex", alignItems: "center", maxWidth: "100%" }}
                              textStyle={getRevealedAnswerTextStyle(isUrduText(ex.parts[originalIndex]))}
                            />
                          </div>
                        )}
                        <QuestionActionBar
                          studyItem={{ prompt: a, subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Match Answers` }}
                          revealed={revealedEx[rk]}
                          onToggleReveal={() => toggleReveal(rk)}
                          showLabel={revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}
                          buttonStyle={getRevealToggleStyle(revealedEx[rk], isUr)}
                        />
                      </div>);
                    })}
                  </div>
                </div>
              ) : ex.parts.map((p,pi) => {
                const rk = ei+"_"+pi;
                const pc = qColors[(ei+pi+1) % qColors.length];
                // Replace underlined chars (like 4̲) with boxed display
                const displayP = p.replace(/(\d)̲/g, '[$1]').replace(/(\d)\u0332/g, '[$1]');
                const promptVisual = getSimpleMachinePromptVisual(sub, ex, displayP);
                return (<div key={pi} style={{display:"flex",alignItems:"stretch",gap:8,marginBottom:8,paddingLeft:isUr?0:8,paddingRight:isUr?8:0,direction:isUr?"rtl":"ltr"}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:28,height:28,borderRadius:8,background:pc+"18",border:"1.5px solid "+pc+"66",color:pc,fontSize:11,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{String.fromCharCode(97+pi)}</span>
                  <div style={{flex:1,minWidth:0,display:"flex",alignItems:"stretch",gap:8}}>
                    {promptVisual ? <span style={{alignSelf:"center",display:"inline-flex"}}>{promptVisual}</span> : null}
                    <div style={{flex:1,minWidth:0,display:"flex"}}>
                      <SpeakableSentence
                        text={displayP}
                        lang={isUrduText(displayP)?"ur":"en"}
                        studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Items` }}
                        showStudyToolbar={false}
                        buttonStyle={{ marginBottom: 0, height: "100%", display: "flex", alignItems: "center" }}
                      />
                    </div>
                  </div>
                  {revealedEx[rk] && ex.ans && ex.ans[pi] && (
                    <div style={{flex:"0 1 auto",width:"fit-content",maxWidth:"50%",minWidth:0,display:"flex",alignSelf:"stretch"}}>
                      <SpeakableSentence
                        text={formatListedAnswer(ex.ans[pi])}
                        lang={isUrduText(ex.ans[pi])?"ur":"en"}
                        fullWidth={false}
                        studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Answers` }}
                        showStudyToolbar={false}
                        buttonStyle={{ ...revealedAnswerButtonStyle, marginBottom: 0, height: "100%", display: "flex", alignItems: "center", maxWidth: "100%" }}
                        textStyle={getRevealedAnswerTextStyle(isUrduText(ex.ans[pi]))}
                      />
                    </div>
                  )}
                  <QuestionActionBar
                    studyItem={{ prompt: displayP, subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Exercise Items` }}
                    revealed={revealedEx[rk]}
                    onToggleReveal={() => toggleReveal(rk)}
                    showLabel={revealedEx[rk]?(isUr?"چھپائیں":"Hide"):(isUr?"دکھائیں":"Show")}
                    buttonStyle={getRevealToggleStyle(revealedEx[rk], isUr)}
                  />
                </div>);
              })}
            </div>);
          })}
          {sub.wordProblems && (<div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
            <h3 style={{color:"#F59E0B",fontSize:14,marginBottom:10,...urS}}>{isUr?"🌍 عملی سوالات":"🌍 Word Problems"}</h3>
            {sub.wordProblems.map((wp,wi) => {
              const isObj = typeof wp === "object";
              const qText = isObj ? wp.q : wp;
              const aText = isObj ? wp.a : null;
              return (
              <div key={wi} style={{marginBottom:12}}>
                <div style={{display:"flex",direction:isUr?"rtl":"ltr",alignItems:"flex-start",gap:10}}>
                  <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:32,height:32,borderRadius:10,background:"#F59E0B22",border:"2px solid #F59E0B",color:"#F59E0B",fontSize:12,fontWeight:800,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"'Baloo 2',sans-serif",flexShrink:0}}>{isUr?("م"+(wi+1)):("W"+(wi+1))}</span>
                  <div style={{flex:1}}><SpeakableSentence text={qText} lang={isUr?"ur":"en"} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Word Problems` }} /></div>
                </div>
                {aText && <div style={{marginTop:6,marginLeft:isUr?0:42,marginRight:isUr?42:0,direction:isUr?"rtl":"ltr"}}>
                  <div style={wordProblemAnswerPanelStyle}>
                    <div style={wordProblemAnswerLabelStyle(isUr)}>{isUr?"✅ جواب":"✅ Answer"}</div>
                    <SpeakableSentence text={formatListedAnswer(aText)} lang={isUr?"ur":"en"} studyItem={{ subject: selectedSubject?.id || "general", section: sub.t, sectionLabel: `${sub.t} Word Problem Answers` }} buttonStyle={{...revealedAnswerButtonStyle, marginBottom:0}} textStyle={{...getRevealedAnswerTextStyle(isUr), lineHeight:1.55}} />
                  </div>
                </div>}
              </div>);
            })}
          </div>)}
            </>
          )}
        </div>)}

        {mathSubTab === "quiz" && (sub.quizGroups || sub.quiz) && (
          sub.quizGroups ? (
            subQuizGroupIdx === null ? (
              <div style={urS}>
                <h3 className="section-title" style={{color:"#F59E0B",marginBottom:12,direction:isUr?"rtl":"ltr",textAlign:isUr?"right":"left"}}>{isUr?"🎯 کوئز کے دن":"🎯 Quiz Days"}</h3>
                {sub.quizGroups.map((group, gi) => (
                  <div key={group.label} className="adverb-day-card" onClick={() => setSubQuizGroupIdx(gi)} style={{display:"flex",alignItems:"center",gap:14,direction:isUr?"rtl":"ltr"}}>
                    <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:40,height:40,borderRadius:12,background:"#F59E0B22",border:"2px solid #F59E0B",color:"#F59E0B",fontSize:16,fontWeight:800,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{gi + 1}</span>
                    <div style={{flex:1,textAlign:isUr?"right":"left"}}>
                      <h3 style={{fontSize:16,fontWeight:700,margin:0,fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit"}}>{group.label}</h3>
                      <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily:isUr?"'Noto Nastaliq Urdu',serif":"inherit" }}>{isUr?"ان دنوں کے سوالات":"Quiz questions for these days"}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={urS}>
                {activeQuizGroup && <div className="adverb-detail-section" style={{marginBottom:14,...urS}}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,flexWrap:"wrap",direction:isUr?"rtl":"ltr"}}>
                    <h3 style={{color:"#F59E0B",margin:0,...urS}}>{activeQuizGroup.label}</h3>
<button className="play-all-btn" style={dayGroupBackButtonStyle} onClick={() => setSubQuizGroupIdx(null)}>{isUr?"← دنوں کی فہرست":"← Back to Day Groups"}</button>
                  </div>
                </div>}
                {quizToRender && <MathSubQuiz key={"mq_"+mathSubIdx+"_"+subQuizGroupIdx} questions={quizToRender} isUrdu={selectedSubject?.id === "urdu"} />}
              </div>
            )
          ) : (
            <MathSubQuiz key={"mq_"+mathSubIdx} questions={sub.quiz} isUrdu={selectedSubject?.id === "urdu"} />
          )
        )}
        </>);
      })()}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && !selectedVocabDay && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p><StudyItemInlineToolbar studyItem={{ prompt: selectedLesson.content, subject: "english", section: "vocabulary", sectionLabel: selectedLesson.title }} /></div>
        <div className="tts-hint">🔊 Tap English → English voice | Tap Urdu → Urdu voice | 55 Days of Vocabulary</div>
        {pacedVocab.map(day => (<div key={day.day} className="adverb-day-card" onClick={() => setSelectedVocabDay(day)}><span className="day-num">{getDayDisplayLabel(day.day, language)}</span><h3>{day.words.map(w => w.en).join(" • ")}</h3><div className="word-preview">{day.words.map((w, i) => <span key={i} className="word-chip">{w.ur}</span>)}</div></div>))}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && selectedVocabDay && (<>
        <div className="tts-hint">🔊 Tap English word → English voice | Tap Urdu → Urdu voice | Tap sentence → hear it!</div>
        <div className="adverb-detail-section"><h3>📝 Day {selectedVocabDay.day} — Words</h3>
          {selectedVocabDay.words.map((w, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <WordRow en={w.en} ur={w.ur} />
              <div style={{ padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" }}>→ {w.meaning}</div>
            </div>
          ))}
        </div>
        <div className="adverb-detail-section"><h3>📖 Practice Paragraph</h3>
          {selectedVocabDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => {
            const sentenceHighlights = selectedVocabDay.words.map(w => w.en).filter(Boolean).filter(word => s.toLowerCase().includes(normalizeHighlightTerm(word)));
            return <SpeakableSentence key={i} text={s} lang="en" highlight={sentenceHighlights} studyItem={{ subject: "english", section: "vocabularyParagraphs", sectionLabel: "Vocabulary Paragraphs" }} />;
          })}
          <button className="play-all-btn" onClick={() => playAll(selectedVocabDay.paragraph)}>▶️ Play Entire Paragraph</button>
        </div>
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && !selectedTensePara && (<>
        <div className="lesson-detail"><h2>{selectedLesson.title}</h2><p>{selectedLesson.content}</p><StudyItemInlineToolbar studyItem={{ prompt: selectedLesson.content, subject: "english", section: "tenses", sectionLabel: selectedLesson.title }} /></div>

        <div style={{ display: "flex", gap: 6, marginTop: 8, marginBottom: 10 }}>
          {[{id:"present",label:"🕐 Present",c:"#38BDF8"},{id:"past",label:"🕑 Past",c:"#F59E0B"},{id:"future",label:"🕒 Future",c:"#22C55E"}].map(t => (
            <button key={t.id} onClick={() => { setTenseMain(t.id); setTenseSub("simple"); }} style={{ flex: 1, padding: "10px 6px", borderRadius: 10, border: tenseMain === t.id ? "2px solid "+t.c : "1px solid var(--border)", background: tenseMain === t.id ? t.c+"22" : "var(--bg-elevated)", color: tenseMain === t.id ? t.c : "var(--text-muted)", fontFamily: "'Baloo 2', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[{id:"simple",label:"Simple"},{id:"continuous",label:"Continuous"},{id:"perfect",label:"Perfect"},{id:"perfectContinuous",label:"Perf. Cont."}].map(t => (
            <button key={t.id} onClick={() => setTenseSub(t.id)} style={{ flex: 1, padding: "8px 3px", borderRadius: 8, border: tenseSub === t.id ? "2px solid #E879F9" : "1px solid var(--border)", background: tenseSub === t.id ? "rgba(232,121,249,0.15)" : "var(--bg-elevated)", color: tenseSub === t.id ? "#E879F9" : "var(--text-muted)", fontFamily: "'Baloo 2', sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{t.label}</button>
          ))}
        </div>

        {TENSES[tenseMain] && TENSES[tenseMain][tenseSub] && (<>
          <div className="adverb-detail-section" style={{ marginBottom: 12 }}>
            <h3 style={{ color: "#E879F9" }}>{TENSES[tenseMain][tenseSub].name}</h3>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ur)", direction: "rtl", marginTop: 4 }}>{TENSES[tenseMain][tenseSub].nameUr}</p>
            <p style={{ fontSize: 12, color: "#38BDF8", marginTop: 8, fontWeight: 600, background: "rgba(56,189,248,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(56,189,248,0.2)" }}>📐 {TENSES[tenseMain][tenseSub].formula}</p>
            <StudyItemInlineToolbar studyItem={{ prompt: TENSES[tenseMain][tenseSub].formula, subject: "english", section: "tenseFormula", sectionLabel: TENSES[tenseMain][tenseSub].name, secondaryText: TENSES[tenseMain][tenseSub].nameUr }} />
          </div>
          <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
          {TENSES[tenseMain][tenseSub].items.map((item, i) => (
            <div key={i} className="adverb-day-card" onClick={() => setSelectedTensePara(item)}>
              <span className="day-num">Paragraph {i + 1}</span>
              <h3>{item.title}</h3>
              <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>{item.para.substring(0, 80)}...</p>
            </div>
          ))}
        </>)}
      </>)}

      {tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && selectedTensePara && (<>
        <div className="tts-hint">🔊 Tap any sentence to hear it read aloud!</div>
        <div className="adverb-detail-section"><h3>📖 {selectedTensePara.title}</h3>
          {selectedTensePara.para.split(/(?<=[.!?])\s+/).filter(Boolean).map((s, i) => <SpeakableSentence key={i} text={s} lang="en" studyItem={{ subject: "english", section: "tenseParagraphs", sectionLabel: selectedTensePara.title }} />)}
          <button className="play-all-btn" onClick={() => playAll(selectedTensePara.para)}>▶️ Play Entire Paragraph</button>
        </div>
          {selectedTensePara.qs && (<div className="adverb-detail-section"><h3>❓ Comprehension Questions</h3>
            {selectedTensePara.qs.map((q, i) => (
              <div key={i} style={{ padding: "10px 14px", marginBottom: 10, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", fontSize: 14, color: "var(--text-primary)" }}>
                <div className="inline-study-row">
                  <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ color: "#F59E0B", fontWeight: 700, flexShrink: 0 }}>Q{i+1}.</span>
                    <span>{q}</span>
                  </div>
                  <InlineStudyActionBar studyItem={{ prompt: q, subject: "english", section: "tenseQuestions", sectionLabel: selectedTensePara.title }} />
                </div>
              </div>
            ))}
          </div>)}
      </>)}

      {tab === "home" && quizActive && !quizDone && currentQuiz.length > 0 && (<div className="quiz-container">
        <div className="quiz-progress">{currentQuiz.map((_, i) => <div key={i} className={"qp-dot" + (i < quizIdx ? " done" : i === quizIdx ? " current" : "")} />)}</div>
        <div className="quiz-question"><div className="q-num">Question {quizIdx + 1} of {currentQuiz.length}</div><h3 className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{currentQuiz[quizIdx].q}</h3></div>
        <div className="quiz-options">{currentQuiz[quizIdx].a.map((opt, oi) => { const sel = quizAnswers[quizIdx] === oi, cor = oi === currentQuiz[quizIdx].c; let cls = "quiz-option"; if (quizRevealed && cor) cls += " correct"; else if (quizRevealed && sel && !cor) cls += " wrong"; else if (sel) cls += " selected"; return (<button key={oi} className={cls} disabled={quizRevealed} onClick={() => { if (quizRevealed) return; const na = [...quizAnswers]; na[quizIdx] = oi; setQuizAnswers(na); setQuizRevealed(true); setTimeout(() => { if (quizIdx < currentQuiz.length - 1) { setQuizIdx(quizIdx + 1); setQuizRevealed(false); } else { finishQuiz(na, currentQuiz); setQuizActive(false); } }, 1200); }}><span className="opt-letter">{"ABCD"[oi]}</span><span className={selectedSubject?.id === "urdu" ? "urdu-text" : ""}>{opt}</span></button>); })}</div>
      </div>)}

      {tab === "home" && quizDone && (<div className="quiz-result">
        <div className="result-emoji">{quizScore === 4 ? "🏆" : quizScore >= 3 ? "🌟" : quizScore >= 2 ? "👍" : "💪"}</div>
        <h2>{quizScore === 4 ? "Perfect!" : quizScore >= 3 ? "Great Job!" : quizScore >= 2 ? "Good Try!" : "Keep Practicing!"}</h2>
        <p className="score-text">You scored</p><div className={"score-big " + (quizScore >= 3 ? "high" : quizScore >= 2 ? "mid" : "low")}>{quizScore}/{currentQuiz.length}</div>
        <p className="score-text">+{quizScore * 25 + (quizScore === 4 ? 50 : 0)} XP earned</p>
        {newBadges.map(bid => { const b = BADGES.find(x => x.id === bid); return b ? <div key={bid} className="badge-earned"><span className="badge-icon">{b.icon}</span><div className="badge-info"><h4>Badge Earned: {b.name}!</h4><p>{b.desc}</p></div></div> : null; })}
        <div className="result-actions"><button className="retry-btn" onClick={() => { setQuizActive(true); setQuizDone(false); setQuizIdx(0); setQuizAnswers([]); setQuizRevealed(false); setQuizStartTime(Date.now()); setNewBadges([]); }}>🔄 Retry</button><button className="next-btn" onClick={() => { setQuizDone(false); setSelectedLesson(null); setNewBadges([]); }}>📚 More Lessons</button></div>
      </div>)}

      {tab === "progress" && (<>
        <div className="stat-grid"><div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value">{totalQuizzesDone}</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("Quizzes Done", "مکمل کوئز", language), language)}</div></div><div className="stat-card"><div className="stat-icon">🎯</div><div className="stat-value">{totalQuizzesDone > 0 ? Math.round((totalScore / (totalQuizzesDone * 4)) * 100) : 0}%</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("Avg Score", "اوسط اسکور", language), language)}</div></div><div className="stat-card"><div className="stat-icon">🔥</div><div className="stat-value">{streak}</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("Day Streak", "دنوں کا تسلسل", language), language)}</div></div><div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-value">{xp}</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("Total XP", "کل ایکس پی", language), language)}</div></div></div>
        <h3 className="section-title">{renderLocalizedTextNode(joinLocalizedText("Subject Progress", "مضامین کی پیش رفت", language), language)}</h3>
        {SUBJECTS.map(subj => { const ls = getLessons(subj.id, grade), done = ls.filter(l => completedQuizzes[l.id]).length, pct = ls.length > 0 ? Math.round((done / ls.length) * 100) : 0; return (<div key={subj.id} className="progress-bar-container"><div className="progress-bar-label"><span>{subj.icon} {subj.name}</span><span style={{ color: "var(--text-muted)" }}>{done}/{ls.length}</span></div><div className="progress-bar-track"><div className="progress-bar-fill" style={{ width: pct + "%", background: subj.color }} /></div></div>); })}
      </>)}

      {tab === "review" && (<>
        {!activeReviewCard && !reviewSessionDone && !practiceMode && <>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-icon">🕒</div><div className="stat-value">{formatNumberLabel(reviewStats.due || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.dueReviews, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-value">{formatNumberLabel(reviewStats.reviewedToday || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.reviewedToday, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-value">{formatNumberLabel(reviewStats.learning || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.learningWords, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">🏆</div><div className="stat-value">{formatNumberLabel(reviewStats.retentionRate || 0)}%</div><div className="stat-label">{renderLocalizedTextNode(ui.retentionRate, language)}</div></div>
          </div>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-icon">📝</div><div className="stat-value">{formatNumberLabel(reviewStats.notedWords || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.notedWords, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">🗂️</div><div className="stat-value">{formatNumberLabel(reviewStats.customLists || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.customLists, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">📅</div><div className="stat-value">{formatNumberLabel(reviewAnalytics.totals.reviewedLastPeriod || 0)}</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("12-week reviews", "12 ہفتے کے ریویوز", language), language)}</div></div>
          </div>

          <div className="lesson-detail" style={{ textAlign: isUrduUi(language) ? "right" : "left", direction: isUrduUi(language) ? "rtl" : "ltr" }}>
            <h2>{renderLocalizedTextNode(ui.reviewReady, language)}</h2>
            <p>{renderLocalizedTextNode(ui.reviewHint, language)}</p>
            <button className="start-quiz-btn" style={isUrduUi(language) ? { fontFamily: "var(--font-ur)" } : {}} onClick={handleStartReview} disabled={reviewLoading}>{reviewLoading ? "..." : `🧠 ${ui.startReview}`}</button>
            {reviewStats.due === 0 && <p style={{ marginTop: 12, color: "var(--text-muted)" }}>{renderLocalizedTextNode(ui.noReviewsDue, language)}</p>}
          </div>

          <div className="review-panel">
            <div className="review-panel-head">
              <div>
                <h3>{renderLocalizedTextNode(joinLocalizedText("Practice Lab", "پریکٹس لیب", language), language)}</h3>
                <p>{renderLocalizedTextNode(joinLocalizedText("Use your review library in fast extra modes: flip cards, type answers, or match pairs.", "اپنی ریویو لائبریری کو اضافی مشق کے لیے استعمال کریں: کارڈ پلٹیں، جواب ٹائپ کریں، یا جوڑیاں ملائیں۔", language), language)}</p>
              </div>
            </div>
            <div className="practice-mode-grid">
              <button className="practice-mode-card" onClick={() => handleStartPractice("flashcards")}>
                <span className="practice-mode-icon">🃏</span>
                <strong>{renderLocalizedTextNode(joinLocalizedText("Flashcards", "فلیش کارڈز", language), language)}</strong>
              </button>
              <button className="practice-mode-card" onClick={() => handleStartPractice("typing")}>
                <span className="practice-mode-icon">⌨️</span>
                <strong>{renderLocalizedTextNode(joinLocalizedText("Type the Answer", "جواب ٹائپ کریں", language), language)}</strong>
              </button>
              <button className="practice-mode-card" onClick={() => handleStartPractice("matching")}>
                <span className="practice-mode-icon">🧩</span>
                <strong>{renderLocalizedTextNode(joinLocalizedText("Match Pairs", "جوڑیاں ملائیں", language), language)}</strong>
              </button>
            </div>
          </div>

          <div className="review-panel">
            <div className="review-panel-head">
              <div>
                <h3>{renderLocalizedTextNode(ui.reviewHeatmap, language)}</h3>
                <p>{renderLocalizedTextNode(ui.reviewHeatmapHint, language)}</p>
              </div>
              <button className="study-tool-btn compact" onClick={() => setHeatmapExpanded((value) => !value)}>
                {renderLocalizedTextNode(heatmapExpanded ? joinLocalizedText("Show Less", "کم دکھائیں", language) : joinLocalizedText("Show Heatmap", "ہیٹ میپ دکھائیں", language), language)}
              </button>
            </div>
            {heatmapExpanded ? (
              <>
                <div className="review-heatmap-grid">
                  {reviewAnalytics.heatmap.map((cell) => (
                    <div
                      key={cell.dayKey}
                      className={`review-heat-cell level-${cell.level}`}
                      title={`${cell.dateLabel}: ${cell.count} reviews`}
                    />
                  ))}
                </div>
                <div className="review-heat-legend">
                  <span>{renderLocalizedTextNode(joinLocalizedText("Less", "کم", language), language)}</span>
                  {[0, 1, 2, 3, 4].map((level) => <span key={level} className={`review-heat-cell level-${level}`} />)}
                  <span>{renderLocalizedTextNode(joinLocalizedText("More", "زیادہ", language), language)}</span>
                </div>
              </>
            ) : (
              <p className="empty-state" style={{ marginTop: 8 }}>{renderLocalizedTextNode(joinLocalizedText("Heatmap is hidden. Open it when you want a weekly review overview.", "ہیٹ میپ فی الحال بند ہے۔ ہفتہ وار جائزہ دیکھنے کے لیے اسے کھولیں۔", language), language)}</p>
            )}
          </div>

          <div className="study-word-columns">
            <div className="review-panel">
              <div className="review-panel-head">
                <div>
                  <h3>{renderLocalizedTextNode(joinLocalizedText("Word Growth", "الفاظ کی بڑھوتری", language), language)}</h3>
                  <p>{renderLocalizedTextNode(joinLocalizedText("Weekly review volume and unique cards over the recent study streak.", "حالیہ مطالعہ کے دوران ہفتہ وار ریویوز اور منفرد کارڈز کی تعداد۔", language), language)}</p>
                </div>
              </div>
              {reviewAnalytics.wordGrowth?.length ? (
                <div className="growth-chart">
                  {reviewAnalytics.wordGrowth.map((bucket) => (
                    <div key={bucket.weekKey} className="growth-bar-col">
                      <div className="growth-bar-stack">
                        <span className="growth-bar reviews" style={{ height: `${Math.max(12, Math.min(100, bucket.reviews * 6))}%` }} />
                        <span className="growth-bar unique" style={{ height: `${Math.max(8, Math.min(84, bucket.uniqueCards * 8))}%` }} />
                      </div>
                      <div className="growth-bar-label">{bucket.label}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="empty-state">{renderLocalizedTextNode(joinLocalizedText("Complete a few review sessions to unlock this chart.", "یہ چارٹ دیکھنے کے لیے چند ریویو سیشن مکمل کریں۔", language), language)}</p>}
            </div>
            <div className="review-panel">
              <div className="review-panel-head">
                <div>
                  <h3>{renderLocalizedTextNode(joinLocalizedText("Performance by Category", "قسم وار کارکردگی", language), language)}</h3>
                  <p>{renderLocalizedTextNode(joinLocalizedText("See which sections are strongest and which still need attention.", "دیکھیں کون سے سیکشن مضبوط ہیں اور کنہیں مزید توجہ چاہیے۔", language), language)}</p>
                </div>
              </div>
              {reviewAnalytics.categoryPerformance?.length ? (
                <div className="category-performance-list">
                  {reviewAnalytics.categoryPerformance.map((entry) => (
                    <div key={entry.id} className="category-performance-item">
                      <div className="category-performance-head">
                        <strong>{entry.sectionLabel}</strong>
                        <span>{entry.accuracy}%</span>
                      </div>
                      <div className="goal-progress-bar"><span style={{ width: `${entry.accuracy}%` }} /></div>
                      <div className="goal-progress-meta">{renderLocalizedTextNode(joinLocalizedText(`${entry.reviews} reviews • ${entry.uniqueCards} cards`, `${entry.reviews} ریویوز • ${entry.uniqueCards} کارڈز`, language), language)}</div>
                    </div>
                  ))}
                </div>
              ) : <p className="empty-state">{renderLocalizedTextNode(joinLocalizedText("Category performance will appear after more review history builds up.", "مزید ریویو تاریخ بننے کے بعد قسم وار کارکردگی یہاں نظر آئے گی۔", language), language)}</p>}
            </div>
          </div>

          <div className="review-panel">
            <div className="review-panel-head">
              <div>
                <h3>{renderLocalizedTextNode(ui.weakWordsReport, language)}</h3>
                <p>{renderLocalizedTextNode(ui.weakWordsHint, language)}</p>
              </div>
            </div>
            {reviewAnalytics.weakWords.length > 0 ? (
              <div className="study-word-grid">
                {reviewAnalytics.weakWords.map((card) => <StudyWordCard key={card.id} card={card} />)}
              </div>
            ) : (
              <p className="empty-state">{renderLocalizedTextNode(ui.noWeakWords, language)}</p>
            )}
          </div>

          <div className="review-panel">
            <div className="review-panel-head">
              <div>
                <h3>{renderLocalizedTextNode(ui.studyCollections, language)}</h3>
                <p>{renderLocalizedTextNode(joinLocalizedText("Create focused word packs for revision, dictation, or tricky vocabulary.", "ریویژن، املا، یا مشکل الفاظ کے لیے اپنی الگ فہرستیں بنائیں۔", language), language)}</p>
              </div>
            </div>
            <div className="review-list-creator">
              <input
                value={customListDraft}
                onChange={(event) => setCustomListDraft(event.target.value)}
                placeholder={language === "ur" ? ui.createListPlaceholder : ui.createListPlaceholder}
                className="review-list-input"
                style={isUrduUi(language) ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" } : {}}
              />
              <button className="ghost-cta" onClick={handleCreateCustomList} disabled={!customListDraft.trim()}>{renderLocalizedTextNode(ui.createList, language)}</button>
            </div>
            {reviewAnalytics.customLists.length > 0 ? (
              <div className="custom-list-grid">
                {reviewAnalytics.customLists.map((list) => (
                  <div key={list.id} className="custom-list-card">
                    <div className="custom-list-head">
                      <div>
                        <h4>{list.name}</h4>
                        <p>{renderLocalizedTextNode(joinLocalizedText(`${list.itemCount} items`, `${list.itemCount} الفاظ`, language), language)}</p>
                      </div>
                      <button className="study-tool-btn compact" onClick={() => handleDeleteCustomList(list.id)}>{renderLocalizedTextNode(ui.deleteList, language)}</button>
                    </div>
                    {list.items.length > 0 ? (
                      <div className="custom-list-items">
                        {list.items.slice(0, 6).map((item) => <span key={item.id} className="custom-list-item-pill">{item.prompt}</span>)}
                        {list.items.length > 6 ? <span className="custom-list-item-pill muted">+{list.items.length - 6}</span> : null}
                      </div>
                    ) : (
                      <p className="empty-state" style={{ marginTop: 10 }}>{renderLocalizedTextNode(ui.noListItems, language)}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">{renderLocalizedTextNode(ui.noCustomLists, language)}</p>
            )}
          </div>

          <div className="study-word-columns">
            <div className="review-panel">
              <div className="review-panel-head"><div><h3>{renderLocalizedTextNode(ui.notedWords, language)}</h3></div></div>
              {reviewAnalytics.notedWords.length > 0 ? reviewAnalytics.notedWords.slice(0, 6).map((card) => <StudyWordCard key={card.id} card={card} showStats={false} />) : <p className="empty-state">{renderLocalizedTextNode(ui.noNotes, language)}</p>}
            </div>
          </div>
        </>}
        {practiceMode && activePracticeCard && (
          <div className="lesson-detail" style={{ direction: isUrduUi(language) ? "rtl" : "ltr" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12, flexWrap: "wrap" }}>
              <span className="lesson-num">{renderLocalizedTextNode(joinLocalizedText(`${practiceMode === "flashcards" ? "Flashcards" : practiceMode === "typing" ? "Type the Answer" : "Match Pairs"} • ${practiceMode === "matching" ? Math.floor(practiceIdx / 4) + 1 : practiceIdx + 1}`, `${practiceMode === "flashcards" ? "فلیش کارڈز" : practiceMode === "typing" ? "جواب ٹائپ کریں" : "جوڑیاں ملائیں"} • ${practiceMode === "matching" ? Math.floor(practiceIdx / 4) + 1 : practiceIdx + 1}`, language), language)}</span>
              <span className="grade-tag" style={{ marginTop: 0 }}>{activePracticeCard.sectionLabel}</span>
            </div>
            <div className="study-word-stats" style={{ marginBottom: 14 }}>
              <span>{renderLocalizedTextNode(joinLocalizedText(`${practiceSessionStats.correct} correct`, `${practiceSessionStats.correct} درست`, language), language)}</span>
              <span>{renderLocalizedTextNode(joinLocalizedText(`${practiceSessionStats.attempted} attempts`, `${practiceSessionStats.attempted} کوششیں`, language), language)}</span>
            </div>
            {practiceMode === "flashcards" && (
              <div className="practice-card-shell">
                <div className="practice-card-face">
                  <div className="study-word-prompt">{activePracticeCard.prompt}</div>
                  {practiceReveal ? <div className="study-word-answer" style={{ marginTop: 14 }}>{activePracticeCard.answer}</div> : <p className="empty-state">{renderLocalizedTextNode(joinLocalizedText("Reveal when you are ready.", "تیار ہوں تو جواب دکھائیں۔", language), language)}</p>}
                </div>
                <div className="result-actions">
                  <button className="retry-btn" onClick={() => setPracticeReveal((value) => !value)}>{renderLocalizedTextNode(ui.revealAnswer, language)}</button>
                  <button className="next-btn" onClick={handlePracticeNext}>{renderLocalizedTextNode(joinLocalizedText("Next Card", "اگلا کارڈ", language), language)}</button>
                </div>
              </div>
            )}
            {practiceMode === "typing" && (
              <div className="practice-card-shell">
                <div className="practice-card-face">
                  <div className="practice-typing-prompt">{renderLocalizedTextNode(joinLocalizedText("Type the matching word for this clue:", "اس اشارے کے مطابق لفظ ٹائپ کریں:", language), language)}</div>
                  <div className="study-word-answer" style={{ marginTop: 10 }}>{activePracticeCard.answer || activePracticeCard.meaning}</div>
                  <input
                    className="review-list-input"
                    value={practiceTypingInput}
                    onChange={(event) => setPracticeTypingInput(event.target.value)}
                    placeholder={language === "ur" ? "جواب لکھیں..." : "Type your answer..."}
                    style={isUrduUi(language) ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)", marginTop: 14 } : { marginTop: 14 }}
                  />
                  {practiceTypingResult ? <p className={`practice-result ${practiceTypingResult}`}>{renderLocalizedTextNode(practiceTypingResult === "correct" ? joinLocalizedText("Correct", "درست", language) : joinLocalizedText("Try this correction", "اس درست جواب کو دیکھیں", language), language)}: {activePracticeCard.prompt}</p> : null}
                </div>
                <div className="result-actions">
                  <button className="retry-btn" onClick={handleCheckTypedAnswer} disabled={!practiceTypingInput.trim()}>{renderLocalizedTextNode(joinLocalizedText("Check", "جانچیں", language), language)}</button>
                  <button className="next-btn" onClick={handlePracticeNext}>{renderLocalizedTextNode(joinLocalizedText("Next", "اگلا", language), language)}</button>
                </div>
              </div>
            )}
            {practiceMode === "matching" && practiceMatchRound && (
              <div className="practice-card-shell">
                <div className="match-grid">
                  <div className="match-column">
                    {practiceMatchRound.prompts.map((card) => (
                      <button
                        key={`prompt_${card.id}`}
                        className={`match-chip match-chip-prompt ${practiceMatchSelection?.item?.id === card.id && practiceMatchSelection?.type === "prompt" ? "selected" : ""}${practiceMatchRound.matches?.[card.id] === true ? " matched" : practiceMatchRound.matches?.[card.id] === false ? " wrong" : ""}`}
                        onClick={() => handleMatchSelection("prompt", card)}
                      >
                        {card.prompt}
                      </button>
                    ))}
                  </div>
                  <div className="match-column">
                    {practiceMatchRound.answers.map((answer) => (
                      <button
                        key={`answer_${answer.id}`}
                        className={`match-chip match-chip-answer ${practiceMatchSelection?.item?.id === answer.id && practiceMatchSelection?.type === "answer" ? "selected" : ""}`}
                        onClick={() => handleMatchSelection("answer", answer)}
                        style={containsUrduText(answer.text) ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)", fontSize: 15, lineHeight: 1.8 } : null}
                      >
                        {answer.text}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="result-actions">
                  <button className="retry-btn" onClick={() => setPracticeMatchRound(buildMatchRound(practiceDeck.slice(practiceIdx), 4))}>{renderLocalizedTextNode(joinLocalizedText("Shuffle", "بدلیں", language), language)}</button>
                  <button className="next-btn" onClick={handlePracticeNext}>{renderLocalizedTextNode(joinLocalizedText("Next Round", "اگلا راؤنڈ", language), language)}</button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeReviewCard && !reviewSessionDone && <div className="lesson-detail" style={{ direction: isUrduUi(language) ? "rtl" : "ltr" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <span className="lesson-num">{renderLocalizedTextNode(joinLocalizedText(`Card ${reviewIdx + 1} of ${reviewQueue.length}`, `کارڈ ${reviewIdx + 1} از ${reviewQueue.length}`, language), language)}</span>
            <span className="grade-tag" style={{ marginTop: 0 }}>{activeReviewCard.sectionLabel}</span>
          </div>
          <h2 style={{ marginBottom: 10 }}>{activeReviewCard.prompt}</h2>
          <div className="study-word-stats" style={{ marginBottom: 14 }}>
            <span>{renderLocalizedTextNode(getReviewDueLabel(activeReviewCard, language), language)}</span>
            <span>{renderLocalizedTextNode(joinLocalizedText(`${ui.lapses}: ${activeReviewCard.lapses || 0}`, `${ui.lapses}: ${activeReviewCard.lapses || 0}`, language), language)}</span>
            <span>{renderLocalizedTextNode(joinLocalizedText(`${ui.accuracy}: ${activeReviewCard.totalReviews ? Math.round(((activeReviewCard.correctReviews || 0) / activeReviewCard.totalReviews) * 100) : 0}%`, `${ui.accuracy}: ${activeReviewCard.totalReviews ? Math.round(((activeReviewCard.correctReviews || 0) / activeReviewCard.totalReviews) * 100) : 0}%`, language), language)}</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <button className="grade-btn active" style={{ minWidth: 130 }} onClick={() => window.HomeSchoolUtils.speakText(activeReviewCard.prompt, "en")}>🔊 {renderLocalizedTextNode(joinLocalizedText("Speak", "سنیں", language), language)}</button>
            <button className="grade-btn" style={{ minWidth: 170 }} onClick={() => setReviewReveal((value) => !value)}>{renderLocalizedTextNode(ui.revealAnswer, language)}</button>
          </div>
          <WordCollectionToolbar card={activeReviewCard} />
          {reviewReveal && <div style={reviewRevealCardStyle}>
            <SpeakableSentence text={activeReviewCard.answer} lang="ur" fullWidth={true} buttonStyle={reviewAnswerButtonStyle} textStyle={{ fontSize: 24 }} />
            {activeReviewCard.meaning && <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{activeReviewCard.meaning}</div>}
            {(activeReviewCard.opposite || activeReviewCard.oppositeUr) && <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{renderLocalizedTextNode(joinLocalizedText(`Opposite: ${activeReviewCard.opposite} / ${activeReviewCard.oppositeUr}`, `متضاد: ${activeReviewCard.oppositeUr} / ${activeReviewCard.opposite}`, language), language)}</div>}
            {activeReviewCard.example && <div><div style={{ marginBottom: 6, color: "var(--text-secondary)", fontWeight: 700 }}><strong>{renderLocalizedTextNode(ui.reviewExample, language)}:</strong></div><SpeakableSentence text={activeReviewCard.example} lang="en" fullWidth={true} buttonStyle={reviewExampleButtonStyle} textStyle={{ fontSize: 16, lineHeight: 1.6 }} /></div>}
          </div>}
          <div className="result-actions">
            <button className="retry-btn" onClick={() => handleReviewResponse("again")}>{renderLocalizedTextNode(ui.reviewAgain, language)}</button>
            <button className="retry-btn" style={{ borderColor: "#22C55E55", color: "#22C55E" }} onClick={() => handleReviewResponse("good")}>{renderLocalizedTextNode(ui.reviewGood, language)}</button>
            <button className="next-btn" onClick={() => handleReviewResponse("easy")}>{renderLocalizedTextNode(ui.reviewEasy, language)}</button>
          </div>
        </div>}
      {reviewSessionDone && <div className="quiz-result"><div className="result-emoji">🧠</div><h2>{renderLocalizedTextNode(ui.reviewComplete, language)}</h2><p className="score-text">{renderLocalizedTextNode(ui.reviewEarnedXp, language)}</p><div className="score-big high">+{reviewSessionXp}</div><div className="result-actions"><button className="retry-btn" style={isUrduUi(language) ? { fontFamily: "var(--font-ur)" } : {}} onClick={() => { resetReviewSession(); setTab("home"); }}>{renderLocalizedTextNode(ui.home, language)}</button><button className="next-btn" style={isUrduUi(language) ? { fontFamily: "var(--font-ur)" } : {}} onClick={() => { resetReviewSession(); handleStartReview(); }}>{renderLocalizedTextNode(ui.startReview, language)}</button></div></div>}
      </>)}

      {tab === "badges" && (<><div style={{ textAlign: "center", marginBottom: 20 }}><p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{earnedBadges.length} of {BADGES.length} badges earned</p></div><div className="badge-grid">{BADGES.map(b => <div key={b.id} className={"badge-card " + (earnedBadges.includes(b.id) ? "earned" : "locked")}><div className="badge-big-icon">{b.icon}</div><h4>{b.name}</h4><p>{b.desc}</p></div>)}</div></>)}

      {tab === "tutor" && (<>
        <div className="review-panel">
          <div className="review-panel-head">
            <div>
              <h3>{renderLocalizedTextNode(joinLocalizedText("Tutor Setup", "اے آئی استاد سیٹ اپ", language), language)}</h3>
              <p>{renderLocalizedTextNode(ui.aiConnectionsHelp || "Keys stay only in this browser and are excluded from backup export. Browser API calls may still be blocked by a provider or by file mode.", language)}</p>
            </div>
          </div>
          {readyAiProviderIds.length > 0 ? (
            <>
              <div className="settings-item" style={{ display: "block" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
                  <span className="si-label">{renderLocalizedTextNode(ui.aiSelectProvider || "Provider", language)}</span>
                  <select
                    value={currentAiProviderId}
                    onChange={(event) => setSelectedAiProvider(event.target.value)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)", fontFamily: isUrduUi(language) ? "var(--font-ur)" : "var(--font)" }}
                  >
                    {readyAiProviderIds.map((providerId) => <option key={providerId} value={providerId}>{renderLocalizedTextNode(joinLocalizedText(AI_PROVIDER_DEFS[providerId].name, AI_PROVIDER_DEFS[providerId].nameUr, language), language)}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <span className="si-label">{renderLocalizedTextNode(ui.aiSelectModel || "Model", language)}</span>
                  <select
                    value={currentAiProviderConfig.model || AI_PROVIDER_DEFS[currentAiProviderId].defaultModel}
                    onChange={(event) => handleAiTutorModelChange(currentAiProviderId, event.target.value)}
                    style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg-elevated)", color: "var(--text-primary)", fontFamily: "var(--font)", minWidth: 220 }}
                  >
                    {currentAiModelOptions.map((modelName) => <option key={modelName} value={modelName}>{modelName}</option>)}
                  </select>
                </div>
              </div>
              {!aiBrowserCapability.ok ? <p className="empty-state" style={{ marginBottom: 12 }}>{renderLocalizedTextNode(ui.aiBrowserBlocked || "Direct browser AI access works best on the published HTTPS site or localhost, not from file mode.", language)}</p> : null}
            </>
          ) : (
            <div className="review-panel" style={{ marginBottom: 0 }}>
              <p className="empty-state" style={{ marginBottom: 12 }}>{renderLocalizedTextNode(configuredAiProviderIds.length > 0 ? joinLocalizedText("Your saved AI providers need attention in Settings before Tutor can chat.", "ٹیوٹر چیٹ شروع کرنے سے پہلے آپ کے محفوظ اے آئی فراہم کنندگان کو ترتیبات میں درست کرنا ہوگا۔", language) : (ui.aiConfigureFirst || "Add at least one AI provider key in Settings to use the tutor."), language)}</p>
              <button className="ghost-cta" onClick={() => setTab("settings")}>{renderLocalizedTextNode(ui.aiOpenSettings || "Open Settings", language)}</button>
            </div>
          )}
        </div>
        <div className="tutor-shell">
          <div className="tutor-chat">
            {chatMessages.map((m, i) => <div key={i} className={"chat-bubble " + (m.role === "ai" ? "ai" : "user")}>{m.text}</div>)}
            {chatLoading && <div className="chat-bubble ai"><div className="typing-dots"><span /><span /><span /></div></div>}
            <div ref={chatEndRef} />
          </div>
          <div className="chat-input-area">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendChat()}
              placeholder={!aiBrowserCapability.ok ? (language === "ur" ? "اے آئی چیٹ کے لیے HTTPS یا localhost استعمال کریں..." : "Use HTTPS or localhost for AI chat...") : readyAiProviderIds.length > 0 ? (language === "ur" ? "اپنے استاد سے کچھ بھی پوچھیں..." : "Ask your tutor anything...") : (language === "ur" ? "پہلے ترتیبات میں اے آئی کی شامل کریں..." : "Fix or add an AI key in Settings first...")}
              disabled={chatLoading || readyAiProviderIds.length === 0 || !aiBrowserCapability.ok}
            />
            <button onClick={sendChat} disabled={chatLoading || readyAiProviderIds.length === 0 || !aiBrowserCapability.ok}>➤</button>
          </div>
        </div>
      </>)}

      {tab === "favorites" && (<>
        <div className="review-panel" style={{ marginBottom: 18 }}>
          <div className="review-panel-head">
            <div>
              <h3>{renderLocalizedTextNode(ui.favoriteWords, language)}</h3>
              <p>{renderLocalizedTextNode(joinLocalizedText("Your starred items live here in subject-wise groups for quick revisits.", "آپ کے ستارہ لگائے گئے آئٹمز یہاں مضمون وار ترتیب سے رکھے گئے ہیں تاکہ آپ فوراً واپس جا سکیں۔", language), language)}</p>
            </div>
          </div>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-icon">⭐</div><div className="stat-value">{formatNumberLabel(reviewAnalytics.favoriteWords.length || 0)}</div><div className="stat-label">{renderLocalizedTextNode(ui.favoriteWords, language)}</div></div>
            <div className="stat-card"><div className="stat-icon">📘</div><div className="stat-value">{formatNumberLabel(favoriteSubjectGroups.length || 0)}</div><div className="stat-label">{renderLocalizedTextNode(joinLocalizedText("Subjects", "مضامین", language), language)}</div></div>
          </div>
        </div>
        {favoriteSubjectGroups.length > 0 ? favoriteSubjectGroups.map((group) => (
          <div key={group.subjectId} className="review-panel" style={{ marginBottom: 18 }}>
            <div className="review-panel-head">
              <div>
                <h3>{renderLocalizedTextNode(group.subject ? getSubjectDisplayName(group.subject, language) : joinLocalizedText("General", "عمومی", language), language)}</h3>
                <p>{renderLocalizedTextNode(joinLocalizedText(`${group.cards.length} saved favorites`, `${group.cards.length} محفوظ پسندیدہ آئٹمز`, language), language)}</p>
              </div>
            </div>
            <div className="study-word-grid">
              {group.cards.map((card) => <StudyWordCard key={card.id} card={card} showStats={false} allowView={true} />)}
            </div>
          </div>
        )) : (
          <div className="review-panel">
            <p className="empty-state">{renderLocalizedTextNode(ui.noFavorites, language)}</p>
          </div>
        )}
      </>)}
      {tab === "settings" && (<>
        <div className={`settings-disclosure${profileDisclosureOpen ? " open" : ""}`} data-transition-mode={transitionMode}>
          <button
            type="button"
            className="settings-disclosure-toggle"
            onClick={() => setProfileDisclosureOpen((value) => !value)}
            aria-expanded={profileDisclosureOpen ? "true" : "false"}
            style={language === "ur" ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" } : null}
          >
            <span className="settings-disclosure-label">{renderLocalizedTextNode(ui.profileSection, language)}</span>
            <span className="settings-disclosure-icon" aria-hidden="true">{profileDisclosureOpen ? "−" : "+"}</span>
          </button>
          <div className="settings-disclosure-body-wrap">
            <div className="settings-disclosure-body-clip">
          <div className="settings-disclosure-body">
            <div className="settings-item" style={isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row" } : {}}>
              <span className="si-label">{renderLocalizedTextNode(joinLocalizedText("Student Name", "طالب علم", language), language)}:</span>
              <span className="si-value">{studentName ? renderDirectionalName(studentName, "ltr", isUrduUi(language) ? { fontFamily: "var(--font)" } : {}) : renderLocalizedTextNode(joinLocalizedText("Not set", "درج نہیں", language), language)}</span>
            </div>
            {(studentNameUr || language !== "en") && <div className="settings-item" style={isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row" } : {}}>
              <span className="si-label">{renderLocalizedTextNode(joinLocalizedText("Urdu Name", "اردو نام", language), language)}:</span>
              <span className="si-value">{localizedNames.ur ? renderDirectionalName(localizedNames.ur, "rtl", { fontFamily: "var(--font-ur)" }) : renderLocalizedTextNode("درج نہیں", "ur")}</span>
            </div>}
            <div className="settings-profile-card" style={isUrduUi(language) ? { direction: "rtl", textAlign: "right" } : {}}>
              <div style={{ marginBottom: 12 }}>
                <label className="settings-input-label">{renderLocalizedTextNode(joinLocalizedText("English Name", "انگریزی نام", language), language)}</label>
                <input
                  className="settings-text-input"
                  value={studentName}
                  onChange={(event) => setStudentName(event.target.value)}
                  placeholder={language === "ur" ? "انگریزی نام درج کریں..." : "Enter English name..."}
                  style={{ direction: "ltr", textAlign: "left", fontFamily: "var(--font)" }}
                />
              </div>
              <div>
                <label className="settings-input-label">{renderLocalizedTextNode(joinLocalizedText("Urdu Name", "اردو نام", language), language)}</label>
                <input
                  className="settings-text-input"
                  value={studentNameUr}
                  onChange={(event) => setStudentNameUr(sanitizeUrduInput(event.target.value))}
                  placeholder="اپنا نام درج کریں"
                  style={{ direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" }}
                />
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
        <div className={`settings-disclosure${gradeDisclosureOpen ? " open" : ""}`} data-transition-mode={transitionMode}>
          <button
            type="button"
            className="settings-disclosure-toggle"
            onClick={() => setGradeDisclosureOpen((value) => !value)}
            aria-expanded={gradeDisclosureOpen ? "true" : "false"}
            style={language === "ur" ? { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" } : null}
          >
            <span className="settings-disclosure-label">{renderLocalizedTextNode(ui.gradeSection, language)}</span>
            <span className="settings-disclosure-icon" aria-hidden="true">{gradeDisclosureOpen ? "−" : "+"}</span>
          </button>
          <div className="settings-disclosure-body-wrap">
            <div className="settings-disclosure-body-clip">
          <div className="settings-disclosure-body">
            <div className="settings-item" style={isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row" } : {}}>
              <span className="si-label">📚 {renderLocalizedTextNode(ui.currentGrade, language)}</span>
              <span className="si-value">{renderGradeValueNode(ui.grade, grade, language)}</span>
            </div>
            <div className="grade-grid">{GRADES.map(g => <button key={g.id} className={"grade-btn " + (g.id === grade ? "active" : "")} onClick={() => setGrade(g.id)}>{g.id}</button>)}</div>
          </div>
            </div>
          </div>
        </div>
        {SettingsPanel ? (
          <SettingsPanel
            currentVersion={currentVersion}
            updateAvailable={updateAvailable}
            storageLabel={storageLabel}
            versionInfo={versionManagerRef.current?.getVersionInfo?.()}
            onCheckUpdates={handleCheckUpdates}
            onRefreshData={handleRefreshData}
            onExportProgress={handleExportProgress}
            onImportProgress={handleImportProgress}
            onResetProgress={handleResetProgress}
            onFullReset={handleFullReset}
            onToggleTTS={() => setTtsEnabled(value => !value)}
            ttsEnabled={ttsEnabled}
            ttsRate={ttsRate}
            onTtsRateChange={setTtsRate}
            englishVoiceOptions={englishVoiceOptions}
            urduVoiceOptions={urduVoiceOptions}
            ttsVoiceSelections={ttsVoiceSelections}
            onTtsVoiceSelectionChange={handleTtsVoiceSelectionChange}
            language={language}
            onLanguageChange={setLanguage}
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
      navPosition={navPosition}
      onNavPositionChange={setNavPosition}
      navAutoHide={navAutoHide}
      onNavAutoHideChange={setNavAutoHide}
      navBarAutoHide={navBarAutoHide}
      onNavBarAutoHideChange={setNavBarAutoHide}
      transitionMode={transitionMode}
      onTransitionModeChange={setTransitionMode}
            dailyReviewCap={dailyReviewCap}
            onDailyReviewCapChange={setDailyReviewCap}
            daySectionSettings={daySectionSettings}
            onDaySectionChange={handleDaySectionChange}
            studyGoals={studyGoals}
            onStudyGoalChange={handleStudyGoalChange}
            focusTimerSettings={focusTimerSettings}
            onFocusTimerSettingChange={handleFocusTimerSettingChange}
            reminderSettings={reminderSettings}
            onReminderSettingsChange={handleReminderSettingsChange}
            onRequestNotificationPermission={handleRequestNotificationPermission}
            notificationPermission={typeof Notification === "undefined" ? "unsupported" : Notification.permission}
            notificationHistory={notificationHistory}
            onClearNotificationHistory={clearNotificationHistory}
            installStatusLabel={installStatusLabel}
            offlineStatusLabel={offlineStatusLabel}
            networkStatusLabel={networkStatusLabel}
            canInstallApp={canInstallApp}
            onInstallApp={handleInstallApp}
            canReloadApp={serviceWorkerStatus === "update-ready"}
            onReloadApp={applyServiceWorkerUpdate}
            aiProviders={aiSettingsProviders}
            onAiProviderDraftChange={handleAiProviderDraftChange}
            onSaveAiProvider={handleSaveAiProvider}
            onClearAiProvider={handleClearAiProvider}
            aiBrowserBlocked={!aiBrowserCapability.ok}
            labels={ui}
          />
        ) : null}
      </>)}
      </div>
      {navBarAutoHide && navPosition === "right" ? <div className="nav-reveal-hotspot nav-reveal-hotspot-right" onMouseEnter={revealAutoHideNavBar} onMouseMove={revealAutoHideNavBar} onPointerDown={revealAutoHideNavBar} /> : null}
      {navPosition === "right" ? renderNavBar("right") : null}
    </div>
    {navBarAutoHide && navPosition === "bottom" ? <div className="nav-reveal-hotspot nav-reveal-hotspot-bottom" onMouseEnter={revealAutoHideNavBar} onMouseMove={revealAutoHideNavBar} onPointerDown={revealAutoHideNavBar} /> : null}
    {navPosition === "bottom" ? renderNavBar("bottom") : null}
  </div></></AppContext.Provider>);
}

window.HomeSchoolAppModule = { HomeschoolApp };

if (!window.__HOME_SCHOOL_BOOTSTRAPPED__ && document.getElementById('root')) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<HomeschoolApp />);
  window.__HOME_SCHOOL_BOOTSTRAPPED__ = true;
}

