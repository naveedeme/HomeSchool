(() => {
  const { useState, useEffect, useRef, useCallback } = React;
  const {
    SUBJECTS,
    GRADES,
    BADGES,
    POS_DATA,
    TENSES_DATA,
    VOCABULARY_DATA,
    getLessons,
    getQuiz
  } = window.HomeSchoolData;
  const { loadState, saveState, debounce, downloadJson, calculateXP, calculateStreak, formatDate, isTtsEnabled, getStorageEstimateLabel, regroupDayEntries, regroupSentencePairs, validateProgressImport, applyThemeMode, getResolvedTheme, isStandaloneMode, hideLaunchSplash, registerServiceWorker, applyServiceWorkerUpdate, setPendingReviewBadge } = window.HomeSchoolUtils;
  const { SettingsPanel } = window.HomeSchoolSettings || {};
  const {
    adverbs: ADVERBS_DATA,
    prepositions: PREPOSITIONS_DATA,
    adjectives: ADJECTIVES_DATA,
    conjunctions: CONJUNCTIONS_DATA,
    pronouns: PRONOUNS_DATA,
    collectiveNouns: COLLECTIVE_NOUNS_DATA,
    verbs: VERBS_DATA
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
      textToSpeech: "Text to Speech",
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
      languageUrdu: "\u0627\u0631\u062F\u0648",
      languageBilingual: "Bilingual",
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
      hideBanner: "Hide"
    },
    ur: {
      loadingHome: "\u06C1\u0648\u0645 \u0627\u0633\u06A9\u0648\u0644 \u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
      loadingDb: "\u0622\u067E \u06A9\u0627 \u0644\u0631\u0646\u0646\u06AF \u0688\u06CC\u0679\u0627 \u0628\u06CC\u0633 \u062A\u06CC\u0627\u0631 \u06A9\u06CC\u0627 \u062C\u0627 \u0631\u06C1\u0627 \u06C1\u06D2",
      tagline: "\u0622\u067E \u06A9\u0627 \u0630\u0627\u062A\u06CC \u062A\u0639\u0644\u06CC\u0645\u06CC \u0633\u0627\u062A\u06BE\u06CC",
      yourName: "\u0622\u067E \u06A9\u0627 \u0646\u0627\u0645",
      enterName: "\u0627\u067E\u0646\u0627 \u0646\u0627\u0645 \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA...",
      yourNameUr: "\u0622\u067E \u06A9\u0627 \u0627\u0631\u062F\u0648 \u0646\u0627\u0645",
      enterNameUr: "\u0627\u067E\u0646\u0627 \u0627\u0631\u062F\u0648 \u0646\u0627\u0645 \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA...",
      selectGrade: "\u0627\u067E\u0646\u06CC \u062C\u0645\u0627\u0639\u062A \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
      lessons: "\u0627\u0633\u0628\u0627\u0642",
      grade: "\u062C\u0645\u0627\u0639\u062A",
      lesson: "\u0633\u0628\u0642",
      completed: "\u0645\u06A9\u0645\u0644",
      notStarted: "\u0634\u0631\u0648\u0639 \u0646\u06C1\u06CC\u06BA \u06C1\u0648\u0627",
      startQuiz: "\u0627\u0645\u062A\u062D\u0627\u0646 \u0634\u0631\u0648\u0639 \u06A9\u0631\u06CC\u06BA",
      progress: "\u067E\u06CC\u0634 \u0631\u0641\u062A",
      achievements: "\u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC\u0627\u06BA",
      tutor: "\u0627\u06D2 \u0622\u0626\u06CC \u0627\u0633\u062A\u0627\u062F",
      settings: "\u062A\u0631\u062A\u06CC\u0628\u0627\u062A",
      home: "\u06C1\u0648\u0645",
      badges: "\u0628\u06CC\u062C\u0632",
      quiz: "\u0627\u0645\u062A\u062D\u0627\u0646",
      currentGrade: "\u0645\u0648\u062C\u0648\u062F\u06C1 \u062C\u0645\u0627\u0639\u062A",
      changeGrade: "\u062C\u0645\u0627\u0639\u062A \u062A\u0628\u062F\u06CC\u0644 \u06A9\u0631\u06CC\u06BA",
      dataManagement: "\u0688\u06CC\u0679\u0627 \u0645\u06CC\u0646\u062C\u0645\u0646\u0679",
      dataVersion: "\u0688\u06CC\u0679\u0627 \u0648\u0631\u0698\u0646",
      checkUpdates: "\u0627\u067E \u0688\u06CC\u0679\u0633 \u0686\u06CC\u06A9 \u06A9\u0631\u06CC\u06BA",
      refreshCurriculum: "\u0633\u0648\u0631\u0633 \u0633\u06D2 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0644\u0648\u0688 \u06A9\u0631\u06CC\u06BA",
      exportProgress: "\u067E\u06CC\u0634 \u0631\u0641\u062A \u0627\u06CC\u06A9\u0633\u067E\u0648\u0631\u0679 \u06A9\u0631\u06CC\u06BA",
      importProgress: "\u067E\u06CC\u0634 \u0631\u0641\u062A \u0627\u0645\u067E\u0648\u0631\u0679 \u06A9\u0631\u06CC\u06BA",
      versionHistory: "\u0648\u0631\u0698\u0646 \u06C1\u0633\u0679\u0631\u06CC",
      userData: "\u06CC\u0648\u0632\u0631 \u0688\u06CC\u0679\u0627",
      storageUsage: "\u0627\u0633\u0679\u0648\u0631\u06CC\u062C",
      resetProgress: "\u067E\u06CC\u0634 \u0631\u0641\u062A \u0631\u06CC \u0633\u06CC\u0679 \u06A9\u0631\u06CC\u06BA",
      fullReset: "\u0645\u06A9\u0645\u0644 \u0631\u06CC \u0633\u06CC\u0679",
      dayBasedSections: "\u062F\u0646 \u06A9\u06D2 \u062D\u0633\u0627\u0628 \u0633\u06D2 \u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u0633\u06CC\u06A9\u0634\u0646\u0632",
      dayBasedDescription: "\u06C1\u0631 \u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u0630\u06CC\u0644\u06CC \u0633\u06CC\u06A9\u0634\u0646 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0644\u06AF \u0627\u0644\u06AF \u0637\u06D2 \u06A9\u0631\u06CC\u06BA \u06A9\u06C1 \u0627\u06CC\u06A9 \u062F\u0646 \u0645\u06CC\u06BA \u06A9\u062A\u0646\u06D2 \u0627\u0644\u0641\u0627\u0638 \u06CC\u0627 \u062C\u0645\u0644\u06D2 \u062F\u06A9\u06BE\u0627\u0626\u06D2 \u062C\u0627\u0626\u06CC\u06BA\u06D4",
      perDay: "\u0641\u06CC \u062F\u0646",
      pacingHelp: "\u06CC\u06C1 \u0633\u06CC\u0679\u0646\u06AF\u0632 \u0635\u0631\u0641 \u0645\u0637\u0627\u0644\u0639\u06D2 \u06A9\u06CC \u062F\u0646 \u0648\u0627\u0631 \u06AF\u0631\u0648\u067E\u0646\u06AF \u0628\u062F\u0644\u062A\u06CC \u06C1\u06CC\u06BA\u060C \u0627\u0635\u0644 \u0688\u06CC\u0679\u0627 \u0641\u0627\u0626\u0644\u06CC\u06BA \u0646\u06C1\u06CC\u06BA\u06D4",
      preferences: "\u062A\u0631\u062C\u06CC\u062D\u0627\u062A",
      textToSpeech: "\u0622\u0648\u0627\u0632 \u0645\u06CC\u06BA \u067E\u0691\u06BE\u0646\u0627",
      enabled: "\u0622\u0646",
      disabled: "\u0622\u0641",
      themeMode: "\u062A\u06BE\u06CC\u0645 \u0645\u0648\u0688",
      themeSystem: "\u0633\u0633\u0679\u0645",
      themeDark: "\u06AF\u06C1\u0631\u0627",
      themeLight: "\u06C1\u0644\u06A9\u0627",
      dailyReviewCap: "\u0631\u0648\u0632\u0627\u0646\u06C1 \u0631\u06CC\u0648\u06CC\u0648 \u062D\u062F",
      dailyReviewCapHelp: "\u0627\u06CC\u06A9 \u0631\u06CC\u0648\u06CC\u0648 \u0633\u06CC\u0634\u0646 \u0645\u06CC\u06BA \u0632\u06CC\u0627\u062F\u06C1 \u0633\u06D2 \u0632\u06CC\u0627\u062F\u06C1 \u06A9\u0627\u0631\u0688\u0632 \u06A9\u06CC \u062A\u0639\u062F\u0627\u062F \u0637\u06D2 \u06A9\u0631\u06CC\u06BA\u06D4",
      interfaceLanguage: "\u0627\u0646\u0679\u0631\u0641\u06CC\u0633 \u0632\u0628\u0627\u0646",
      languageEnglish: "English",
      languageUrdu: "\u0627\u0631\u062F\u0648",
      languageBilingual: "Bilingual",
      review: "\u0631\u06CC\u0648\u06CC\u0648",
      reviewReady: "\u0631\u06CC\u0648\u06CC\u0648 \u0642\u0637\u0627\u0631",
      dueReviews: "\u0628\u0627\u0642\u06CC \u0631\u06CC\u0648\u06CC\u0648\u0632",
      reviewedToday: "\u0622\u062C \u062F\u06C1\u0631\u0627\u0626\u06D2 \u06AF\u0626\u06D2",
      learningWords: "\u0633\u06CC\u06A9\u06BE\u06D2 \u062C\u0627 \u0631\u06C1\u06D2 \u0627\u0644\u0641\u0627\u0638",
      masteredWords: "\u0645\u06C1\u0627\u0631\u062A \u06CC\u0627\u0641\u062A\u06C1 \u0627\u0644\u0641\u0627\u0638",
      retentionRate: "\u06CC\u0627\u062F \u0631\u06A9\u06BE\u0646\u06D2 \u06A9\u06CC \u0634\u0631\u062D",
      startReview: "\u0631\u06CC\u0648\u06CC\u0648 \u0634\u0631\u0648\u0639 \u06A9\u0631\u06CC\u06BA",
      noReviewsDue: "\u0627\u0633 \u0648\u0642\u062A \u06A9\u0648\u0626\u06CC \u0631\u06CC\u0648\u06CC\u0648 \u0628\u0627\u0642\u06CC \u0646\u06C1\u06CC\u06BA\u06D4",
      revealAnswer: "\u062C\u0648\u0627\u0628 \u062F\u06A9\u06BE\u0627\u0626\u06CC\u06BA",
      reviewAgain: "\u062F\u0648\u0628\u0627\u0631\u06C1",
      reviewGood: "\u0627\u0686\u06BE\u0627",
      reviewEasy: "\u0622\u0633\u0627\u0646",
      reviewComplete: "\u0631\u06CC\u0648\u06CC\u0648 \u0633\u06CC\u0634\u0646 \u0645\u06A9\u0645\u0644",
      reviewEarnedXp: "\u062D\u0627\u0635\u0644 \u0634\u062F\u06C1 \u0631\u06CC\u0648\u06CC\u0648 \u0627\u06CC\u06A9\u0633 \u067E\u06CC",
      reviewHint: "\u0645\u0634\u06A9\u0644 \u0627\u0644\u0641\u0627\u0638 \u06A9\u0648 \u06CC\u0627\u062F \u0631\u06A9\u06BE\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0627\u0633\u067E\u06CC\u0633\u0688 \u0631\u06CC\u067E\u06CC\u0679\u06CC\u0634\u0646 \u0627\u0633\u062A\u0639\u0645\u0627\u0644 \u06A9\u0631\u06CC\u06BA\u06D4",
      reviewSection: "\u0633\u06CC\u06A9\u0634\u0646",
      reviewExample: "\u0645\u062B\u0627\u0644",
      reviewReadyNow: "\u0627\u0628\u06BE\u06CC \u062A\u06CC\u0627\u0631",
      reviewTotalDue: "\u06A9\u0644 \u0628\u0627\u0642\u06CC",
      importNow: "\u06A9\u06CC\u0627 \u06CC\u06C1 \u0628\u06CC\u06A9 \u0627\u067E \u0627\u0628\u06BE\u06CC \u0627\u0645\u067E\u0648\u0631\u0679 \u06A9\u0631\u0646\u0627 \u06C1\u06D2\u061F",
      replacePrompt: "\u0627\u0648\u06A9\u06D2 \u062F\u0628\u0627\u0626\u06CC\u06BA \u062A\u0627\u06A9\u06C1 \u0645\u0648\u062C\u0648\u062F\u06C1 \u067E\u06CC\u0634 \u0631\u0641\u062A \u0628\u062F\u0644 \u062F\u06CC \u062C\u0627\u0626\u06D2\u06D4\n\u06A9\u06CC\u0646\u0633\u0644 \u062F\u0628\u0627\u0626\u06CC\u06BA \u062A\u0627\u06A9\u06C1 \u0628\u06CC\u06A9 \u0627\u067E \u06A9\u0648 \u0645\u0648\u062C\u0648\u062F\u06C1 \u067E\u06CC\u0634 \u0631\u0641\u062A \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0645\u0644\u0627 \u062F\u06CC\u0627 \u062C\u0627\u0626\u06D2\u06D4",
      importSuccessReplace: "\u067E\u06CC\u0634 \u0631\u0641\u062A \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0627\u0645\u067E\u0648\u0631\u0679 \u06C1\u0648 \u06AF\u0626\u06CC \u0627\u0648\u0631 \u0645\u0648\u062C\u0648\u062F\u06C1 \u0688\u06CC\u0679\u0627 \u0628\u062F\u0644 \u062F\u06CC\u0627 \u06AF\u06CC\u0627\u06D4",
      importSuccessMerge: "\u067E\u06CC\u0634 \u0631\u0641\u062A \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0627\u0645\u067E\u0648\u0631\u0679 \u06C1\u0648 \u06AF\u0626\u06CC \u0627\u0648\u0631 \u0645\u0648\u062C\u0648\u062F\u06C1 \u0688\u06CC\u0679\u0627 \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u0645\u0644\u0627 \u062F\u06CC \u06AF\u0626\u06CC\u06D4",
      importInvalid: "\u06CC\u06C1 \u0628\u06CC\u06A9 \u0627\u067E \u0641\u0627\u0626\u0644 \u062F\u0631\u0633\u062A \u0646\u06C1\u06CC\u06BA \u06C1\u06D2\u06D4",
      importNewer: "\u06CC\u06C1 \u0628\u06CC\u06A9 \u0627\u067E \u0646\u0626\u06D2 \u0646\u0635\u0627\u0628\u06CC \u0648\u0631\u0698\u0646 \u0633\u06D2 \u0628\u0646\u0627\u06CC\u0627 \u06AF\u06CC\u0627 \u062A\u06BE\u0627\u06D4 \u06A9\u06CC\u0627 \u067E\u06BE\u0631 \u0628\u06BE\u06CC \u0627\u0645\u067E\u0648\u0631\u0679 \u06A9\u0631\u0646\u0627 \u06C1\u06D2\u061F",
      refreshConfirm: "\u06A9\u06CC\u0627 \u0633\u0648\u0631\u0633 \u0641\u0627\u0626\u0644\u0632 \u0633\u06D2 \u0646\u0635\u0627\u0628 \u062F\u0648\u0628\u0627\u0631\u06C1 \u0644\u0648\u0688 \u06A9\u06CC\u0627 \u062C\u0627\u0626\u06D2 \u062C\u0628\u06A9\u06C1 \u0622\u067E \u06A9\u06CC \u067E\u06CC\u0634 \u0631\u0641\u062A \u0645\u062D\u0641\u0648\u0638 \u0631\u06C1\u06D2\u061F",
      refreshSuccess: "\u0646\u0635\u0627\u0628 \u06A9\u0627\u0645\u06CC\u0627\u0628\u06CC \u0633\u06D2 \u0631\u06CC\u0641\u0631\u06CC\u0634 \u06C1\u0648 \u06AF\u06CC\u0627",
      refreshNoChanges: "\u0646\u0635\u0627\u0628 \u067E\u06C1\u0644\u06D2 \u06C1\u06CC \u062A\u0627\u0632\u06C1 \u062A\u0631\u06CC\u0646 \u06C1\u06D2\u06D4",
      resetConfirm: "\u06A9\u06CC\u0627 \u0646\u0635\u0627\u0628\u06CC \u0688\u06CC\u0679\u0627 \u0628\u0631\u0642\u0631\u0627\u0631 \u0631\u06A9\u06BE\u062A\u06D2 \u06C1\u0648\u0626\u06D2 \u06A9\u0648\u0626\u0632 \u067E\u06CC\u0634 \u0631\u0641\u062A \u0631\u06CC \u0633\u06CC\u0679 \u06A9\u0631\u0646\u06CC \u06C1\u06D2\u061F",
      fullResetConfirm: "\u0645\u06A9\u0645\u0644 \u0631\u06CC \u0633\u06CC\u0679 \u0688\u06CC\u0679\u0627 \u0628\u06CC\u0633 \u0627\u0648\u0631 \u067E\u06CC\u0634 \u0631\u0641\u062A \u062F\u0648\u0646\u0648\u06BA \u0635\u0627\u0641 \u06A9\u0631 \u062F\u06D2 \u06AF\u0627\u06D4 \u06A9\u06CC\u0627 \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u0646\u0627 \u06C1\u06D2\u061F",
      updateAvailableTitle: "\u0646\u0626\u06CC \u0627\u067E \u0688\u06CC\u0679 \u062F\u0633\u062A\u06CC\u0627\u0628 \u06C1\u06D2\u06D4",
      upToDateTitle: "\u0646\u0635\u0627\u0628 \u067E\u06C1\u0644\u06D2 \u06C1\u06CC \u062A\u0627\u0632\u06C1 \u062A\u0631\u06CC\u0646 \u06C1\u06D2\u06D4",
      changedSubjects: "\u0628\u062F\u0644\u06D2 \u06AF\u0626\u06D2 \u0645\u0636\u0627\u0645\u06CC\u0646",
      appExperience: "\u0627\u06CC\u067E \u062A\u062C\u0631\u0628\u06C1",
      installStatus: "\u0627\u0646\u0633\u0679\u0627\u0644 \u062D\u0627\u0644\u062A",
      offlineAccess: "\u0622\u0641 \u0644\u0627\u0626\u0646 \u0631\u0633\u0627\u0626\u06CC",
      networkStatus: "\u0646\u06CC\u0679 \u0648\u0631\u06A9",
      installApp: "\u0627\u06CC\u067E \u0627\u0646\u0633\u0679\u0627\u0644 \u06A9\u0631\u06CC\u06BA",
      appInstalled: "\u0627\u0646\u0633\u0679\u0627\u0644 \u0634\u062F\u06C1",
      appInstallAvailable: "\u0627\u0646\u0633\u0679\u0627\u0644 \u06A9\u06D2 \u0644\u06CC\u06D2 \u062A\u06CC\u0627\u0631",
      appInstallUnavailable: "\u0627\u0633 \u0628\u0631\u0627\u0624\u0632\u0631 \u0645\u06CC\u06BA \u0627\u0646\u0633\u0679\u0627\u0644 \u062F\u0633\u062A\u06CC\u0627\u0628 \u0646\u06C1\u06CC\u06BA",
      offlineReady: "\u0622\u0641 \u0644\u0627\u0626\u0646 \u06A9\u06CC\u0634 \u062A\u06CC\u0627\u0631",
      offlineCaching: "\u0622\u0641 \u0644\u0627\u0626\u0646 \u06A9\u06CC\u0634 \u062A\u06CC\u0627\u0631 \u06C1\u0648 \u0631\u06C1\u06CC \u06C1\u06D2",
      offlineLocalStatic: "\u0628\u0631\u0627\u06C1 \u0631\u0627\u0633\u062A \u0644\u0648\u06A9\u0644 \u0641\u0627\u0626\u0644 \u0645\u0648\u0688",
      offlineUnsupported: "\u06CC\u06C1\u0627\u06BA \u0622\u0641 \u0644\u0627\u0626\u0646 \u0648\u0631\u06A9\u0631 \u062F\u0633\u062A\u06CC\u0627\u0628 \u0646\u06C1\u06CC\u06BA",
      offlineError: "\u0622\u0641 \u0644\u0627\u0626\u0646 \u0633\u06CC\u0679 \u0627\u067E \u0646\u0627\u06A9\u0627\u0645",
      updateReady: "\u0631\u06CC\u0641\u0631\u06CC\u0634 \u06A9\u06D2 \u0628\u0639\u062F \u0627\u067E \u0688\u06CC\u0679 \u062A\u06CC\u0627\u0631",
      refreshToUpdate: "\u0627\u067E \u0688\u06CC\u0679 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0631\u06CC\u0641\u0631\u06CC\u0634 \u06A9\u0631\u06CC\u06BA",
      online: "\u0622\u0646 \u0644\u0627\u0626\u0646",
      offline: "\u0622\u0641 \u0644\u0627\u0626\u0646",
      installBannerTitle: "\u0627\u06CC\u067E \u0627\u0646\u0633\u0679\u0627\u0644 \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u0622\u0641 \u0644\u0627\u0626\u0646 \u067E\u0691\u06BE\u06CC\u06BA",
      installBannerText: "HomeSchool \u06A9\u0648 \u0627\u067E\u0646\u06D2 \u0688\u06CC\u0648\u0627\u0626\u0633 \u067E\u0631 \u0631\u06A9\u06BE\u06CC\u06BA \u062A\u0627\u06A9\u06C1 \u0627\u0646\u0679\u0631\u0646\u06CC\u0679 \u06A9\u06D2 \u0628\u063A\u06CC\u0631 \u0628\u06BE\u06CC \u0627\u0633\u0628\u0627\u0642 \u062F\u0633\u062A\u06CC\u0627\u0628 \u0631\u06C1\u06CC\u06BA\u06D4",
      installBrowserHint: "\u0627\u0646\u0633\u0679\u0627\u0644 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0628\u0631\u0627\u0624\u0632\u0631 \u06A9\u06CC \u0627\u06CC\u0688\u0631\u06CC\u0633 \u0628\u0627\u0631 \u06CC\u0627 \u0645\u06CC\u0646\u0648 \u0648\u0627\u0644\u0627 \u0622\u067E\u0634\u0646 \u0627\u0633\u062A\u0639\u0645\u0627\u0644 \u06A9\u0631\u06CC\u06BA\u06D4",
      hideBanner: "\u0686\u06BE\u067E\u0627\u0626\u06CC\u06BA"
    }
  };
  const DAY_SECTION_META = {
    adverbs: { labelEn: "Adverbs", labelUr: "\u0642\u06CC\u062F", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    prepositions: { labelEn: "Prepositions", labelUr: "\u062D\u0631\u0648\u0641 \u062C\u0627\u0631", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    adjectives: { labelEn: "Adjectives", labelUr: "\u0635\u0641\u0627\u062A", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    conjunctions: { labelEn: "Conjunctions", labelUr: "\u062D\u0631\u0648\u0641 \u0639\u0637\u0641", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    pronouns: { labelEn: "Pronouns", labelUr: "\u0636\u0645\u0627\u0626\u0631", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    collectiveNouns: { labelEn: "Collective Nouns", labelUr: "\u0627\u0633\u0645 \u062C\u0645\u0639", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    verbs: { labelEn: "Verbs", labelUr: "\u0627\u0641\u0639\u0627\u0644", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 3, max: 10 },
    vocabulary: { labelEn: "Vocabulary", labelUr: "\u0630\u062E\u06CC\u0631\u06C1 \u0627\u0644\u0641\u0627\u0638", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 5, max: 20 },
    wordMeanings: { labelEn: "Words Meanings", labelUr: "\u0627\u0644\u0641\u0627\u0638 \u06A9\u06D2 \u0645\u0639\u0627\u0646\u06CC", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 5, max: 20 },
    wordOpposites: { labelEn: "Words Opposites", labelUr: "\u0627\u0644\u0641\u0627\u0638 \u06A9\u06D2 \u0645\u062A\u0636\u0627\u062F", unitEn: "words", unitUr: "\u0627\u0644\u0641\u0627\u0638", defaultSize: 5, max: 20 },
    adverbPhrases: { labelEn: "Adverb Phrases", labelUr: "\u0641\u0642\u0631\u0627\u062A\u0650 \u062D\u0627\u0644", unitEn: "phrases", unitUr: "\u0641\u0642\u0631\u06D2", defaultSize: 5, max: 15 },
    sentences: { labelEn: "Sentence Sections", labelUr: "\u062C\u0645\u0644\u0648\u06BA \u0648\u0627\u0644\u06D2 \u0633\u06CC\u06A9\u0634\u0646", unitEn: "sentences", unitUr: "\u062C\u0645\u0644\u06D2", defaultSize: 10, max: 20 }
  };
  function getLocalizedNamePair(studentName, studentNameUr) {
    return {
      en: String(studentName || studentNameUr || "").trim(),
      ur: String(studentNameUr || studentName || "").trim()
    };
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
    return joinLocalizedText(`Day ${day}`, `\u062F\u0646 ${day}`, language);
  }
  function getScopedDayTitle(day, enTitle, urTitle, language) {
    return joinLocalizedText(`Day ${day} - ${enTitle}`, `${urTitle} \u062F\u0646 ${day}`, language);
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
          ...urStyle
        }
      }, text);
    }
    if (language !== "bilingual" || !text.includes(" / ")) return text;
    const [enText, ...rest] = text.split(" / ");
    const urText = rest.join(" / ");
    return React.createElement(
      React.Fragment,
      null,
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate"
        }
      }, enText),
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate"
        }
      }, " / "),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
          ...urStyle
        }
      }, urText)
    );
  }
  function renderSeparatedLocalizedTextNode(enText, urText, language, options = {}) {
    const {
      gap = 4,
      asBlock = false,
      align = "flex-start",
      enStyle = {},
      urStyle = {}
    } = options;
    if (language === "ur") {
      return React.createElement(asBlock ? "div" : "span", {
        style: {
          display: asBlock ? "block" : "inline-block",
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
          textAlign: "right",
          ...urStyle
        }
      }, urText);
    }
    if (language !== "bilingual") {
      return React.createElement(asBlock ? "div" : "span", {
        style: {
          display: asBlock ? "block" : "inline-block",
          direction: "ltr",
          unicodeBidi: "isolate",
          textAlign: "left",
          ...enStyle
        }
      }, enText);
    }
    return React.createElement(
      asBlock ? "div" : "span",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: align,
          gap
        }
      },
      React.createElement("span", {
        style: {
          direction: "ltr",
          unicodeBidi: "isolate",
          textAlign: "left",
          ...enStyle
        }
      }, enText),
      React.createElement("span", {
        style: {
          fontFamily: "var(--font-ur)",
          direction: "rtl",
          unicodeBidi: "isolate",
          textAlign: "right",
          ...urStyle
        }
      }, urText)
    );
  }
  function renderDirectionalName(name, fallbackDirection = "ltr", extraStyle = {}) {
    const trimmed = String(name || "").trim();
    return React.createElement("span", {
      style: {
        direction: trimmed && isUrduText(trimmed) ? "rtl" : fallbackDirection,
        unicodeBidi: "isolate",
        ...extraStyle
      }
    }, trimmed);
  }
  function renderGradeValueNode(gradeLabel, gradeValue, language) {
    const safeGrade = String(gradeValue || "").trim();
    if (language === "ur") {
      return React.createElement(
        "span",
        {
          style: {
            display: "inline-flex",
            alignItems: "baseline",
            gap: 6,
            fontFamily: "var(--font-ur)",
            direction: "rtl",
            unicodeBidi: "isolate"
          }
        },
        gradeLabel,
        React.createElement("span", {
          style: {
            direction: "ltr",
            unicodeBidi: "isolate",
            fontFamily: "var(--font)"
          }
        }, safeGrade)
      );
    }
    if (language === "bilingual") {
      return renderSeparatedLocalizedTextNode(
        `Grade ${safeGrade}`,
        `${gradeLabel} ${safeGrade}`,
        language,
        {
          gap: 1,
          enStyle: { fontSize: 14, fontWeight: 700 },
          urStyle: { fontSize: 14, fontWeight: 700 }
        }
      );
    }
    return React.createElement("span", {
      style: {
        direction: "ltr",
        unicodeBidi: "isolate"
      }
    }, `Grade ${safeGrade}`);
  }
  function renderWelcomeGreeting(namePair, language) {
    const hasName = Boolean(namePair.en || namePair.ur);
    if (!hasName) return renderLocalizedTextNode(joinLocalizedText("Welcome!", "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F!", language), language);
    if (language === "ur") {
      return React.createElement(
        "span",
        {
          style: {
            fontFamily: "var(--font-ur)",
            direction: "rtl",
            unicodeBidi: "isolate"
          }
        },
        "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F\u060C ",
        renderDirectionalName(namePair.ur, "rtl", { fontFamily: "inherit" }),
        "!"
      );
    }
    if (language === "bilingual") {
      return React.createElement(
        React.Fragment,
        null,
        React.createElement(
          "span",
          {
            style: {
              direction: "ltr",
              unicodeBidi: "isolate"
            }
          },
          "Hi, ",
          renderDirectionalName(namePair.en, "ltr"),
          "!"
        ),
        React.createElement("span", {
          style: {
            direction: "ltr",
            unicodeBidi: "isolate"
          }
        }, " / "),
        React.createElement(
          "span",
          {
            style: {
              fontFamily: "var(--font-ur)",
              direction: "rtl",
              unicodeBidi: "isolate"
            }
          },
          "\u062E\u0648\u0634 \u0622\u0645\u062F\u06CC\u062F\u060C ",
          renderDirectionalName(namePair.ur, "rtl", { fontFamily: "inherit" }),
          "!"
        )
      );
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
          `\u0627\u0633 \u0633\u06CC\u06A9\u0634\u0646 \u0645\u06CC\u06BA \u0627\u06CC\u06A9 \u062F\u0646 \u0645\u06CC\u06BA ${meta.unitUr} \u06A9\u06CC \u062A\u0639\u062F\u0627\u062F \u0645\u0642\u0631\u0631 \u06A9\u0631\u06CC\u06BA\u06D4`,
          language
        )
      };
      return acc;
    }, {});
  }
  function getSubsectionSettingKey(subtitle) {
    const value = String(subtitle || "").trim().toLowerCase();
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
    const s2 = String(number).replace(/,/g, "");
    const places = ["Ones", "Tens", "Hundreds", "Thousands", "Ten-Th", "Hund-Th", "Millions", "Ten-M", "Hund-M", "Billions"];
    const colors = ["#38BDF8", "#22C55E", "#F59E0B", "#EF4444", "#A855F7", "#EC4899", "#14B8A6", "#F97316", "#6366F1", "#D946EF"];
    const digits = s2.split("").reverse();
    const w = Math.max(digits.length * 90 + 40, 340);
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} 160`, xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: w, height: "160", rx: "12", fill: "#1E293B" }), digits.map((d, i) => {
      const x = w - 70 - i * 90;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x, y: "15", width: "70", height: "55", rx: "10", fill: colors[i % 10], opacity: "0.2", stroke: colors[i % 10], strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: x + 35, y: "54", textAnchor: "middle", fill: colors[i % 10], fontSize: "32", fontWeight: "800", fontFamily: "'Baloo 2'" }, d), /* @__PURE__ */ React.createElement("text", { x: x + 35, y: "100", textAnchor: "middle", fill: colors[i % 10], fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, places[i] || ""), /* @__PURE__ */ React.createElement("text", { x: x + 35, y: "130", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontFamily: "'Baloo 2'" }, d !== "0" ? d + new Array(i).fill("0").join("") : "0"));
    })));
  }
  function ExpandedFormSVG({ number, parts }) {
    const w = Math.max(parts.length * 120 + 60, 380);
    const colors = ["#EF4444", "#F59E0B", "#22C55E", "#38BDF8", "#A855F7", "#EC4899", "#14B8A6"];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} 120`, xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: w, height: "120", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: w / 2, y: "34", textAnchor: "middle", fill: "#F1F5F9", fontSize: "24", fontWeight: "800", fontFamily: "'Baloo 2'" }, number), /* @__PURE__ */ React.createElement("text", { x: w / 2, y: "58", textAnchor: "middle", fill: "#64748B", fontSize: "18", fontFamily: "'Baloo 2'" }, "="), parts.map((p, i) => {
      const x = 30 + i * 120;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x, y: "68", width: "100", height: "38", rx: "10", fill: colors[i % 7], opacity: "0.15", stroke: colors[i % 7], strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: x + 50, y: "93", textAnchor: "middle", fill: colors[i % 7], fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, p), i < parts.length - 1 && /* @__PURE__ */ React.createElement("text", { x: x + 112, y: "93", textAnchor: "middle", fill: "#64748B", fontSize: "20", fontWeight: "800" }, "+"));
    })));
  }
  function NumberLineSVG({ min, max, marks, highlight }) {
    const w = 620, h = 90, pad = 50;
    const lineW = w - pad * 2;
    const getX = (v) => pad + (v - min) / (max - min) * lineW;
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: w, height: h, rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("line", { x1: pad, y1: "48", x2: w - pad, y2: "48", stroke: "#475569", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: `${pad - 8},48 ${pad},42 ${pad},54`, fill: "#475569" }), /* @__PURE__ */ React.createElement("polygon", { points: `${w - pad + 8},48 ${w - pad},42 ${w - pad},54`, fill: "#475569" }), marks.map((m, i) => {
      const x = getX(m);
      const isHl = highlight && highlight.includes(m);
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: "40", x2: x, y2: "56", stroke: isHl ? "#F59E0B" : "#94A3B8", strokeWidth: isHl ? 3 : 2 }), /* @__PURE__ */ React.createElement("text", { x, y: isHl ? 28 : 75, textAnchor: "middle", fill: isHl ? "#F59E0B" : "#94A3B8", fontSize: isHl ? "15" : "13", fontWeight: isHl ? "800" : "600", fontFamily: "'Baloo 2'" }, m.toLocaleString()), isHl && /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "48", r: "6", fill: "#F59E0B" }));
    })));
  }
  function CompareBarsSVG({ num1, num2, label1, label2 }) {
    const mx = Math.max(num1, num2);
    const w1 = num1 / mx * 320, w2 = num2 / mx * 320;
    const sym = num1 > num2 ? ">" : num1 < num2 ? "<" : "=";
    const symWord = num1 > num2 ? "Greater than" : num1 < num2 ? "Less than" : "Equal to";
    const col1 = num1 >= num2 ? "#22C55E" : "#EF4444", col2 = num2 >= num1 ? "#22C55E" : "#EF4444";
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 120", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "120", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("rect", { x: "90", y: "15", width: w1, height: "30", rx: "8", fill: col1, opacity: "0.7" }), /* @__PURE__ */ React.createElement("text", { x: "10", y: "38", fill: "#F1F5F9", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, label1 || num1.toLocaleString()), /* @__PURE__ */ React.createElement("text", { x: 96 + w1, y: "38", fill: col1, fontSize: "14", fontWeight: "700", fontFamily: "'Baloo 2'" }, num1.toLocaleString()), /* @__PURE__ */ React.createElement("rect", { x: "90", y: "60", width: w2, height: "30", rx: "8", fill: col2, opacity: "0.7" }), /* @__PURE__ */ React.createElement("text", { x: "10", y: "83", fill: "#F1F5F9", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, label2 || num2.toLocaleString()), /* @__PURE__ */ React.createElement("text", { x: 96 + w2, y: "83", fill: col2, fontSize: "14", fontWeight: "700", fontFamily: "'Baloo 2'" }, num2.toLocaleString()), /* @__PURE__ */ React.createElement("line", { x1: "440", y1: "20", x2: "440", y2: "100", stroke: "#334155", strokeWidth: "1", strokeDasharray: "4" }), /* @__PURE__ */ React.createElement("text", { x: "530", y: "55", textAnchor: "middle", fill: "#F59E0B", fontSize: "36", fontWeight: "900", fontFamily: "'Baloo 2'" }, sym), /* @__PURE__ */ React.createElement("text", { x: "530", y: "85", textAnchor: "middle", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, symWord)));
  }
  function CompareTripleSVG() {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CompareBarsSVG, { num1: 5432, num2: 4999 }), /* @__PURE__ */ React.createElement(CompareBarsSVG, { num1: 3210, num2: 4567 }), /* @__PURE__ */ React.createElement(CompareBarsSVG, { num1: 5678, num2: 5678 }));
  }
  function RoundingSVG({ number, place, result, direction }) {
    const col = direction === "up" ? "#22C55E" : "#F59E0B";
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 110", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "110", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "18", width: "140", height: "70", rx: "12", fill: "#38BDF822", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "85", y: "44", textAnchor: "middle", fill: "#38BDF8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Original"), /* @__PURE__ */ React.createElement("text", { x: "85", y: "72", textAnchor: "middle", fill: "#F1F5F9", fontSize: "24", fontWeight: "800", fontFamily: "'Baloo 2'" }, number.toLocaleString()), /* @__PURE__ */ React.createElement("line", { x1: "165", y1: "53", x2: "220", y2: "53", stroke: col, strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: direction === "up" ? "220,48 230,53 220,58" : "220,48 230,53 220,58", fill: col }), /* @__PURE__ */ React.createElement("rect", { x: "240", y: "18", width: "130", height: "36", rx: "10", fill: col + "22", stroke: col, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "305", y: "42", textAnchor: "middle", fill: col, fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Round ", direction === "up" ? "\u2191 UP" : "\u2193 DOWN"), /* @__PURE__ */ React.createElement("text", { x: "305", y: "76", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontFamily: "'Baloo 2'" }, "nearest ", place), /* @__PURE__ */ React.createElement("line", { x1: "390", y1: "53", x2: "430", y2: "53", stroke: "#A855F7", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "430,48 440,53 430,58", fill: "#A855F7" }), /* @__PURE__ */ React.createElement("rect", { x: "445", y: "18", width: "140", height: "70", rx: "12", fill: "#A855F722", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "515", y: "44", textAnchor: "middle", fill: "#A855F7", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Result"), /* @__PURE__ */ React.createElement("text", { x: "515", y: "72", textAnchor: "middle", fill: "#F1F5F9", fontSize: "22", fontWeight: "800", fontFamily: "'Baloo 2'" }, result.toLocaleString())));
  }
  function RoundingDualSVG() {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(RoundingSVG, { number: 4567, place: "100", result: 4600, direction: "up" }), /* @__PURE__ */ React.createElement(RoundingSVG, { number: 3421, place: "100", result: 3400, direction: "down" }));
  }
  function StatesOfMatterSVG() {
    const [clickedBox, setClickedBox] = React.useState(null);
    const handleBoxClick2 = (label) => {
      setClickedBox(label);
      setTimeout(() => setClickedBox(null), 200);
      const utterance = new SpeechSynthesisUtterance(label);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    };
    const states = [
      { label: "Solid", emoji: "\u{1F9CA}", desc: "Fixed shape & volume", col: "#38BDF8", note: "Tightly packed", dots: [[95, 85], [105, 85], [100, 95], [95, 105], [105, 105], [100, 75], [110, 80], [90, 100]] },
      { label: "Liquid", emoji: "\u{1F4A7}", desc: "Fixed volume, takes shape", col: "#22C55E", note: "Loosely arranged", dots: [[280, 75], [295, 75], [288, 90], [280, 105], [295, 105], [288, 120], [275, 85], [300, 95]] },
      { label: "Gas", emoji: "\u{1F4A8}", desc: "Fills all space", col: "#F59E0B", note: "Far apart, fast-moving", dots: [[425, 50], [575, 65], [440, 95], [570, 125], [455, 150], [580, 170], [430, 185], [565, 75]] }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1000px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 215", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "215", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "20", textAnchor: "middle", fill: "#94A3B8", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2697\uFE0F Three States of Matter"), states.map((s2, i) => {
      const bx = i === 0 ? 10 : i === 1 ? 210 : 410;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: bx, y: "30", width: "180", height: "170", rx: "12", fill: clickedBox === s2.label ? s2.col + "40" : s2.col + "18", stroke: s2.col, strokeWidth: clickedBox === s2.label ? "3" : "2" }), /* @__PURE__ */ React.createElement("text", { x: bx + 90, y: "58", textAnchor: "middle", fill: s2.col, fontSize: "19", fontWeight: "800", fontFamily: "'Baloo 2'" }, s2.emoji, " ", s2.label), s2.dots.map((d, j) => /* @__PURE__ */ React.createElement("circle", { key: j, cx: d[0], cy: d[1], r: "9", fill: s2.col, opacity: "0.75" })), /* @__PURE__ */ React.createElement("text", { x: bx + 90, y: "168", textAnchor: "middle", fill: "#E2E8F0", fontSize: "14", fontWeight: "700", fontFamily: "'Baloo 2'" }, s2.desc), /* @__PURE__ */ React.createElement("text", { x: bx + 90, y: "186", textAnchor: "middle", fill: "#64748B", fontSize: "12", fontFamily: "'Baloo 2'" }, s2.note));
    }), /* @__PURE__ */ React.createElement("text", { x: "200", y: "118", textAnchor: "middle", fill: "#F59E0B", fontSize: "32", fontWeight: "800" }, "\u2192"), /* @__PURE__ */ React.createElement("text", { x: "200", y: "138", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontFamily: "'Baloo 2'" }, "+Heat"), /* @__PURE__ */ React.createElement("text", { x: "400", y: "118", textAnchor: "middle", fill: "#F59E0B", fontSize: "32", fontWeight: "800" }, "\u2192"), /* @__PURE__ */ React.createElement("text", { x: "400", y: "138", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontFamily: "'Baloo 2'" }, "+Heat")));
  }
  function FoodChainSVG() {
    const items = [
      { emoji: "\u2600\uFE0F", label: "Sun", sub: "Energy source", col: "#F59E0B" },
      { emoji: "\u{1F33F}", label: "Producer", sub: "Makes own food", col: "#22C55E" },
      { emoji: "\u{1F430}", label: "Herbivore", sub: "Eats plants", col: "#38BDF8" },
      { emoji: "\u{1F98A}", label: "Carnivore", sub: "Eats animals", col: "#EF4444" },
      { emoji: "\u{1F985}", label: "Top Predator", sub: "Apex of chain", col: "#A855F7" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1000px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 165", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "165", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "19", textAnchor: "middle", fill: "#94A3B8", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F331} Food Chain \u2014 Energy Flow"), items.map((it, i) => {
      const x = 15 + i * 118;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x, y: "28", width: "106", height: "125", rx: "11", fill: it.col + "18", stroke: it.col, strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "75", textAnchor: "middle", fontSize: "42" }, it.emoji), /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "100", textAnchor: "middle", fill: it.col, fontSize: "15", fontWeight: "700", fontFamily: "'Baloo 2'" }, it.label), /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "118", textAnchor: "middle", fill: "#94A3B8", fontSize: "12.5", fontFamily: "'Baloo 2'" }, it.sub), /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "143", textAnchor: "middle", fill: "#475569", fontSize: "11", fontFamily: "'Baloo 2'" }, ["Primary", "Secondary", "Tertiary", "", ""][i] || ""), i < 4 && /* @__PURE__ */ React.createElement("text", { x: x + 115, y: "94", fill: "#F59E0B", fontSize: "28", fontWeight: "800" }, "\u2192"));
    })));
  }
  function SolarSystemSVG() {
    const planets = [
      { l: "Mercury", d: 28, c: "#94A3B8", r: 5, n: "1st" },
      { l: "Venus", d: 52, c: "#F59E0B", r: 7, n: "2nd" },
      { l: "Earth", d: 78, c: "#38BDF8", r: 7, n: "3rd" },
      { l: "Mars", d: 104, c: "#EF4444", r: 6, n: "4th" },
      { l: "Jupiter", d: 140, c: "#F97316", r: 13, n: "5th" },
      { l: "Saturn", d: 174, c: "#E2C044", r: 11, n: "6th" },
      { l: "Uranus", d: 202, c: "#14B8A6", r: 9, n: "7th" },
      { l: "Neptune", d: 226, c: "#6366F1", r: 9, n: "8th" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1100px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 700 210", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "700", height: "210", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "350", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1FA90} Our Solar System \u2014 8 Planets"), [[80, 40], [180, 25], [260, 45], [370, 20], [450, 42], [540, 28], [630, 42], [50, 160], [150, 170], [280, 155], [380, 168], [480, 162], [590, 170], [660, 155]].map((s2, i) => /* @__PURE__ */ React.createElement("circle", { key: i, cx: s2[0], cy: s2[1], r: "1.5", fill: "white", opacity: "0.4" })), /* @__PURE__ */ React.createElement("circle", { cx: "36", cy: "115", r: "30", fill: "#F59E0B", opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "121", textAnchor: "middle", fontSize: "20" }, "\u2600\uFE0F"), /* @__PURE__ */ React.createElement("text", { x: "36", y: "158", textAnchor: "middle", fill: "#F59E0B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Sun"), planets.map((p, i) => {
      const cx = 70 + p.d * 2.7;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx, cy: "115", r: p.r, fill: p.c, opacity: "0.9" }), p.l === "Saturn" && /* @__PURE__ */ React.createElement("ellipse", { cx, cy: "115", rx: p.r + 8, ry: "3.5", fill: "none", stroke: "#E2C044", strokeWidth: "2", opacity: "0.75" }), /* @__PURE__ */ React.createElement("line", { x1: cx, y1: 115 + p.r + 3, x2: cx, y2: "162", stroke: p.c, strokeWidth: "0.8", opacity: "0.4" }), /* @__PURE__ */ React.createElement("text", { x: cx, y: "172", textAnchor: "middle", fill: p.c, fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, p.l), /* @__PURE__ */ React.createElement("text", { x: cx, y: "185", textAnchor: "middle", fill: "#475569", fontSize: "8.5", fontFamily: "'Baloo 2'" }, p.n));
    }), /* @__PURE__ */ React.createElement("text", { x: "185", y: "200", textAnchor: "middle", fill: "#475569", fontSize: "9", fontFamily: "'Baloo 2'" }, "\u2190 Rocky inner planets \u2192"), /* @__PURE__ */ React.createElement("text", { x: "510", y: "200", textAnchor: "middle", fill: "#475569", fontSize: "9", fontFamily: "'Baloo 2'" }, "\u2190 Gas giant outer planets \u2192")));
  }
  function EarthLayersSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1050px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 560 320", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "560", height: "320", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "280", y: "22", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F30D} Earth's Internal Layers"), /* @__PURE__ */ React.createElement("circle", { cx: "210", cy: "175", r: "130", fill: "#38BDF825", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "210", cy: "175", r: "100", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "210", cy: "175", r: "62", fill: "#EF444432", stroke: "#EF4444", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "210", cy: "175", r: "30", fill: "#F9731670", stroke: "#F97316", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "210", y: "172", textAnchor: "middle", fill: "#F1F5F9", fontSize: "8.5", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Inner"), /* @__PURE__ */ React.createElement("text", { x: "210", y: "182", textAnchor: "middle", fill: "#F1F5F9", fontSize: "8.5", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Core"), /* @__PURE__ */ React.createElement("line", { x1: "318", y1: "92", x2: "390", y2: "92", stroke: "#38BDF8", strokeWidth: "1", strokeDasharray: "4", opacity: "0.6" }), /* @__PURE__ */ React.createElement("rect", { x: "392", y: "62", width: "152", height: "50", rx: "8", fill: "#38BDF812", stroke: "#38BDF8", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "468", y: "80", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Crust"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "94", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, "5\u201370 km thick"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "106", textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "Thin outer shell"), /* @__PURE__ */ React.createElement("line", { x1: "292", y1: "150", x2: "390", y2: "150", stroke: "#F59E0B", strokeWidth: "1", strokeDasharray: "4", opacity: "0.6" }), /* @__PURE__ */ React.createElement("rect", { x: "392", y: "122", width: "152", height: "50", rx: "8", fill: "#F59E0B12", stroke: "#F59E0B", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "468", y: "140", textAnchor: "middle", fill: "#F59E0B", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Mantle"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "154", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, "~2,900 km thick"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "166", textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "Hot semi-solid rock"), /* @__PURE__ */ React.createElement("line", { x1: "258", y1: "205", x2: "390", y2: "205", stroke: "#EF4444", strokeWidth: "1", strokeDasharray: "4", opacity: "0.6" }), /* @__PURE__ */ React.createElement("rect", { x: "392", y: "182", width: "152", height: "50", rx: "8", fill: "#EF444412", stroke: "#EF4444", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "468", y: "200", textAnchor: "middle", fill: "#EF4444", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Outer Core"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "214", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, "Liquid iron + nickel"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "226", textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "Creates magnetic field"), /* @__PURE__ */ React.createElement("line", { x1: "236", y1: "175", x2: "390", y2: "266", stroke: "#F97316", strokeWidth: "1", strokeDasharray: "4", opacity: "0.6" }), /* @__PURE__ */ React.createElement("rect", { x: "392", y: "242", width: "152", height: "50", rx: "8", fill: "#F9731618", stroke: "#F97316", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "468", y: "260", textAnchor: "middle", fill: "#F97316", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Inner Core"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "274", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, "Solid iron + nickel"), /* @__PURE__ */ React.createElement("text", { x: "468", y: "286", textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "~5,500\xB0C")));
  }
  function BodySystemSVG({ system }) {
    const [clickedBox, setClickedBox] = React.useState(null);
    const handleBoxClick2 = (part) => {
      setClickedBox(part);
      setTimeout(() => setClickedBox(null), 200);
      const utterance = new SpeechSynthesisUtterance(part);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    };
    const data = {
      digestive: {
        title: "\u{1F37D}\uFE0F Digestive System",
        parts: ["Mouth", "Esophagus", "Stomach", "Small Intestine", "Large Intestine"],
        cols: ["#38BDF8", "#22C55E", "#F59E0B", "#A855F7", "#EC4899"],
        descs: ["Chew + saliva", "Pushes food down", "Acid breaks food", "Absorbs nutrients", "Absorbs water"]
      },
      respiratory: {
        title: "\u{1FAC1} Respiratory System",
        parts: ["Nose/Mouth", "Trachea", "Bronchi", "Lungs", "Alveoli"],
        cols: ["#38BDF8", "#22C55E", "#F59E0B", "#EF4444", "#A855F7"],
        descs: ["Filters + warms air", "Windpipe", "Splits to each lung", "Gas exchange", "O\u2082 into blood"]
      },
      circulatory: {
        title: "\u2764\uFE0F Circulatory System",
        parts: ["Heart", "Arteries", "Capillaries", "Veins", "Heart"],
        cols: ["#EF4444", "#F59E0B", "#EC4899", "#38BDF8", "#EF4444"],
        descs: ["Pumps blood", "Carry blood away", "Exchange O\u2082/CO\u2082", "Return to heart", "Cycle repeats"]
      }
    };
    const d = data[system];
    if (!d) return null;
    const illustrations = {
      digestive: {
        url: "img/grade-5/science/human-body-systems/digestive-system.jpg",
        desc: "Mouth \u2192 Esophagus \u2192 Stomach \u2192 Small Intestine \u2192 Large Intestine"
      },
      respiratory: {
        urls: ["img/grade-5/science/human-body-systems/respiratory-system.png", "img/grade-5/science/human-body-systems/respiration-process-2-1.jpg"],
        desc: "Nose \u2192 Trachea \u2192 Bronchi \u2192 Lungs \u2192 Alveoli (gas exchange)"
      },
      circulatory: {
        urls: ["img/grade-5/science/human-body-systems/human-circulatory-system.jpg", "img/grade-5/science/human-body-systems/human-circulatory-system-detail.jpg"],
        desc: "Heart \u2192 Arteries \u2192 Capillaries \u2192 Veins \u2192 Back to Heart"
      }
    };
    const illust = illustrations[system];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1000px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 630 170", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "630", height: "170", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "315", y: "20", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, d.title), d.parts.map((p, i) => {
      const x = 12 + i * 122;
      const isClicked = clickedBox === p;
      return /* @__PURE__ */ React.createElement("g", { key: i, onClick: () => handleBoxClick2(p), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("rect", { x, y: "30", width: "106", height: "128", rx: "10", fill: d.cols[i] + "22", stroke: d.cols[i], strokeWidth: "1.8", style: { transform: isClicked ? "scale(0.95)" : "scale(1)", transformOrigin: `${x + 53}px 94px`, transition: "transform 0.1s ease-out" } }), /* @__PURE__ */ React.createElement("g", { style: { transform: isClicked ? "scale(0.95)" : "scale(1)", transformOrigin: `${x + 53}px 68px`, transition: "transform 0.1s ease-out" } }, /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "68", textAnchor: "middle", fill: d.cols[i], fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, i + 1)), /* @__PURE__ */ React.createElement("g", { style: { transform: isClicked ? "scale(0.95)" : "scale(1)", transformOrigin: `${x + 53}px 92px`, transition: "transform 0.1s ease-out" } }, /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "92", textAnchor: "middle", fill: d.cols[i], fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, p)), /* @__PURE__ */ React.createElement("line", { x1: x + 10, y1: "100", x2: x + 96, y2: "100", stroke: d.cols[i] + "40", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: x + 53, y: "116", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, d.descs[i]), i < 4 && /* @__PURE__ */ React.createElement("text", { x: x + 114, y: "94", fill: "#F59E0B", fontSize: "28", fontWeight: "800", textAnchor: "middle" }, "\u2192"));
    }))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: "20px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#94A3B8", fontSize: "14px", marginBottom: "10px" } }, "Illustration"), illust.urls ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", maxWidth: "900px", margin: "0 auto" } }, illust.urls.map((url, idx) => /* @__PURE__ */ React.createElement("img", { key: idx, src: url, alt: `${system}-${idx}`, style: { width: "100%", height: "400px", borderRadius: "8px", border: "1px solid #475569", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", objectFit: "cover" } }))) : /* @__PURE__ */ React.createElement("img", { src: illust.url, alt: system, style: { maxWidth: "100%", maxHeight: "450px", borderRadius: "8px", border: "1px solid #475569", boxShadow: "0 4px 6px rgba(0,0,0,0.3)", objectFit: "contain" } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#CBD5E1", fontSize: "13px", marginTop: "10px", lineHeight: "1.5" } }, illust.desc)));
  }
  function MoonPhasesSVG() {
    const phases = [
      { e: "\u{1F311}", l: "New Moon", d: "Dark side facing us" },
      { e: "\u{1F312}", l: "Waxing Crescent", d: "Small right sliver" },
      { e: "\u{1F313}", l: "First Quarter", d: "Right half lit" },
      { e: "\u{1F314}", l: "Waxing Gibbous", d: "More than half lit" },
      { e: "\u{1F315}", l: "Full Moon", d: "Fully illuminated" },
      { e: "\u{1F316}", l: "Waning Gibbous", d: "Left shrinking" },
      { e: "\u{1F317}", l: "Last Quarter", d: "Left half lit" },
      { e: "\u{1F318}", l: "Waning Crescent", d: "Small left sliver" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1050px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 680 175", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "680", height: "175", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "340", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F319} Moon Phases \u2014 29.5 Day Cycle"), phases.map((ph, i) => {
      const x = 10 + i * 83;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x, y: "26", width: "74", height: "138", rx: "10", fill: "#1E293B", stroke: "#334155", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: x + 37, y: "74", textAnchor: "middle", fontSize: "36" }, ph.e), /* @__PURE__ */ React.createElement("text", { x: x + 37, y: "96", textAnchor: "middle", fill: "#CBD5E1", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, ph.l.split(" ")[0]), /* @__PURE__ */ React.createElement("text", { x: x + 37, y: "110", textAnchor: "middle", fill: "#CBD5E1", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, ph.l.split(" ").slice(1).join(" ")), /* @__PURE__ */ React.createElement("line", { x1: x + 8, y1: "118", x2: x + 66, y2: "118", stroke: "#334155", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: x + 37, y: "133", textAnchor: "middle", fill: "#64748B", fontSize: "8.5", fontFamily: "'Baloo 2'" }, ph.d.split(" ").slice(0, 2).join(" ")), /* @__PURE__ */ React.createElement("text", { x: x + 37, y: "147", textAnchor: "middle", fill: "#64748B", fontSize: "8.5", fontFamily: "'Baloo 2'" }, ph.d.split(" ").slice(2).join(" ")), i < 7 && /* @__PURE__ */ React.createElement("text", { x: x + 80, y: "77", fill: "#F59E0B", fontSize: "14", fontWeight: "800" }, "\u2192"));
    })));
  }
  function MagnetPolesSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 230", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "230", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "320", y: "20", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F9F2} Magnetic Poles \u2014 Attraction & Repulsion"), /* @__PURE__ */ React.createElement("rect", { x: "12", y: "30", width: "300", height: "188", rx: "12", fill: "#22C55E12", stroke: "#22C55E", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("text", { x: "162", y: "50", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2713 Unlike Poles ATTRACT"), /* @__PURE__ */ React.createElement("rect", { x: "28", y: "62", width: "72", height: "52", rx: "8", fill: "#EF444435", stroke: "#EF4444", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "64", y: "95", textAnchor: "middle", fill: "#EF4444", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "N"), /* @__PURE__ */ React.createElement("rect", { x: "122", y: "62", width: "72", height: "52", rx: "8", fill: "#38BDF835", stroke: "#38BDF8", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "158", y: "95", textAnchor: "middle", fill: "#38BDF8", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "S"), /* @__PURE__ */ React.createElement("text", { x: "111", y: "94", textAnchor: "middle", fill: "#F59E0B", fontSize: "22", fontWeight: "900" }, "\u27F5\u27F6"), /* @__PURE__ */ React.createElement("path", { d: "M100 72 Q111 52 122 72", fill: "none", stroke: "#F59E0B", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("path", { d: "M100 104 Q111 124 122 104", fill: "none", stroke: "#F59E0B", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("text", { x: "222", y: "72", fill: "#94A3B8", fontSize: "10.5", fontFamily: "'Baloo 2'" }, "Magnetic:"), /* @__PURE__ */ React.createElement("text", { x: "222", y: "87", fill: "#94A3B8", fontSize: "10.5", fontFamily: "'Baloo 2'" }, "iron \u{1F529} steel"), /* @__PURE__ */ React.createElement("text", { x: "222", y: "102", fill: "#94A3B8", fontSize: "10.5", fontFamily: "'Baloo 2'" }, "nickel, cobalt"), /* @__PURE__ */ React.createElement("text", { x: "222", y: "118", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "Not magnetic:"), /* @__PURE__ */ React.createElement("text", { x: "222", y: "133", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "wood, plastic,"), /* @__PURE__ */ React.createElement("text", { x: "222", y: "148", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "glass, copper"), /* @__PURE__ */ React.createElement("text", { x: "162", y: "204", textAnchor: "middle", fill: "#22C55E", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Force = PULL together \u2713"), /* @__PURE__ */ React.createElement("rect", { x: "328", y: "30", width: "300", height: "188", rx: "12", fill: "#EF444412", stroke: "#EF4444", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("text", { x: "478", y: "50", textAnchor: "middle", fill: "#EF4444", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2717 Like Poles REPEL"), /* @__PURE__ */ React.createElement("rect", { x: "345", y: "62", width: "72", height: "52", rx: "8", fill: "#EF444435", stroke: "#EF4444", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "381", y: "95", textAnchor: "middle", fill: "#EF4444", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "N"), /* @__PURE__ */ React.createElement("rect", { x: "438", y: "62", width: "72", height: "52", rx: "8", fill: "#EF444435", stroke: "#EF4444", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "474", y: "95", textAnchor: "middle", fill: "#EF4444", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "N"), /* @__PURE__ */ React.createElement("text", { x: "427", y: "94", textAnchor: "middle", fill: "#EF4444", fontSize: "22", fontWeight: "900" }, "\u27F6\u27F5"), /* @__PURE__ */ React.createElement("path", { d: "M417 72 Q405 52 388 67", fill: "none", stroke: "#EF4444", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("path", { d: "M417 104 Q405 124 388 109", fill: "none", stroke: "#EF4444", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("path", { d: "M427 72 Q438 52 455 67", fill: "none", stroke: "#EF4444", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("path", { d: "M427 104 Q438 124 455 109", fill: "none", stroke: "#EF4444", strokeWidth: "2", strokeDasharray: "4", opacity: "0.8" }), /* @__PURE__ */ React.createElement("text", { x: "536", y: "75", fill: "#94A3B8", fontSize: "10.5", fontFamily: "'Baloo 2'" }, "S+S also repels"), /* @__PURE__ */ React.createElement("text", { x: "536", y: "90", fill: "#94A3B8", fontSize: "10.5", fontFamily: "'Baloo 2'" }, "\u{1F9ED} Compass uses"), /* @__PURE__ */ React.createElement("text", { x: "536", y: "105", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "Earth's magnetic"), /* @__PURE__ */ React.createElement("text", { x: "536", y: "120", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "field to point N"), /* @__PURE__ */ React.createElement("text", { x: "478", y: "204", textAnchor: "middle", fill: "#EF4444", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Force = PUSH apart \u2717")));
  }
  function LightRefractionSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 265", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "265", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "320", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F4A1} Reflection & Refraction of Light"), /* @__PURE__ */ React.createElement("rect", { x: "10", y: "26", width: "302", height: "228", rx: "10", fill: "#38BDF815", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "161", y: "43", textAnchor: "middle", fill: "#38BDF8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "REFLECTION (Mirror)"), /* @__PURE__ */ React.createElement("line", { x1: "26", y1: "188", x2: "298", y2: "188", stroke: "#94A3B8", strokeWidth: "5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "161", y: "208", textAnchor: "middle", fill: "#64748B", fontSize: "11", fontFamily: "'Baloo 2'" }, "Smooth mirror surface"), /* @__PURE__ */ React.createElement("line", { x1: "161", y1: "100", x2: "161", y2: "188", stroke: "#475569", strokeWidth: "1.5", strokeDasharray: "5" }), /* @__PURE__ */ React.createElement("text", { x: "175", y: "113", fill: "#475569", fontSize: "11", fontFamily: "'Baloo 2'" }, "Normal"), /* @__PURE__ */ React.createElement("line", { x1: "82", y1: "74", x2: "161", y2: "188", stroke: "#F59E0B", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "70", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Incident"), /* @__PURE__ */ React.createElement("line", { x1: "161", y1: "188", x2: "240", y2: "74", stroke: "#22C55E", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "228", y: "70", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Reflected"), /* @__PURE__ */ React.createElement("text", { x: "108", y: "166", fill: "#F59E0B", fontSize: "15", fontFamily: "'Baloo 2'" }, "i\xB0"), /* @__PURE__ */ React.createElement("text", { x: "200", y: "166", fill: "#22C55E", fontSize: "15", fontFamily: "'Baloo 2'" }, "r\xB0"), /* @__PURE__ */ React.createElement("text", { x: "161", y: "244", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Angle i = Angle r (Law of Reflection)"), /* @__PURE__ */ React.createElement("rect", { x: "328", y: "26", width: "302", height: "228", rx: "10", fill: "#A855F715", stroke: "#A855F7", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "479", y: "43", textAnchor: "middle", fill: "#A855F7", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "REFRACTION (Water/Glass)"), /* @__PURE__ */ React.createElement("rect", { x: "338", y: "164", width: "282", height: "78", rx: "5", fill: "#38BDF818" }), /* @__PURE__ */ React.createElement("line", { x1: "338", y1: "164", x2: "620", y2: "164", stroke: "#38BDF8", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "479", y: "230", textAnchor: "middle", fill: "#38BDF8", fontSize: "11", fontFamily: "'Baloo 2'" }, "Water/Glass (denser medium)"), /* @__PURE__ */ React.createElement("line", { x1: "479", y1: "76", x2: "479", y2: "212", stroke: "#475569", strokeWidth: "1.5", strokeDasharray: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "400", y1: "72", x2: "479", y2: "164", stroke: "#F59E0B", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "372", y: "68", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Incident"), /* @__PURE__ */ React.createElement("line", { x1: "479", y1: "164", x2: "504", y2: "236", stroke: "#EC4899", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "506", y: "242", fill: "#EC4899", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Refracted (bent)"), /* @__PURE__ */ React.createElement("text", { x: "479", y: "118", textAnchor: "middle", fill: "#94A3B8", fontSize: "11", fontFamily: "'Baloo 2'" }, "Bends toward normal"), /* @__PURE__ */ React.createElement("text", { x: "479", y: "255", textAnchor: "middle", fill: "#A855F7", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Light slows & bends entering denser medium")));
  }
  function SimpleMachinesSVG() {
    const machines = [
      { n: "Lever", e: "\u2696\uFE0F", d: "Bar + fulcrum", x: "Seesaw, scissors", c: "#38BDF8" },
      { n: "Wheel & Axle", e: "\u{1F3A1}", d: "Wheel on rod", x: "Doorknob, steering", c: "#22C55E" },
      { n: "Pulley", e: null, d: "Rope + wheel", x: "Flagpole, crane", c: "#F59E0B" },
      { n: "Inclined Plane", e: "\u{1F4D0}", d: "Sloped surface", x: "Ramp, slide", c: "#A855F7" },
      { n: "Wedge", e: "\u{1FA93}", d: "Thin sharp edge", x: "Axe, knife", c: "#EF4444" },
      { n: "Screw", e: "\u{1F529}", d: "Wrapped ramp", x: "Jar lid, bolt", c: "#EC4899" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1050px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 590 310", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "590", height: "310", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "295", y: "19", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2699\uFE0F The 6 Simple Machines"), machines.map((m, i) => {
      const col = i % 3, row = Math.floor(i / 3);
      const bx = 10 + col * 192, by = 28 + row * 136;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: bx, y: by, width: "182", height: "128", rx: "10", fill: m.c + "18", stroke: m.c, strokeWidth: "1.5" }), m.e ? /* @__PURE__ */ React.createElement("text", { x: bx + 91, y: by + 46, textAnchor: "middle", fontSize: "32" }, m.e) : /* @__PURE__ */ React.createElement("g", null, /* @__PURE__ */ React.createElement("rect", { x: bx + 60, y: by + 9, width: "62", height: "8", rx: "3", fill: "#64748B" }), /* @__PURE__ */ React.createElement("line", { x1: bx + 91, y1: by + 17, x2: bx + 91, y2: by + 24, stroke: "#64748B", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: bx + 91, cy: by + 38, r: "14", fill: "none", stroke: "#F59E0B", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("circle", { cx: bx + 91, cy: by + 38, r: "5", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("path", { d: `M${bx + 77},${by + 38} A14,14 0 0,0 ${bx + 105},${by + 38}`, fill: "none", stroke: "#94A3B8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: bx + 77, y1: by + 38, x2: bx + 77, y2: by + 60, stroke: "#94A3B8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: bx + 69, y: by + 60, width: "16", height: "9", rx: "2", fill: "#F59E0B30", stroke: "#F59E0B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("line", { x1: bx + 105, y1: by + 38, x2: bx + 105, y2: by + 55, stroke: "#94A3B8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: bx + 107, y: by + 53, fill: "#22C55E", fontSize: "13", fontFamily: "'Baloo 2'" }, "\u2191F")), /* @__PURE__ */ React.createElement("text", { x: bx + 91, y: by + 76, textAnchor: "middle", fill: m.c, fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, m.n), /* @__PURE__ */ React.createElement("text", { x: bx + 91, y: by + 93, textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, m.d), /* @__PURE__ */ React.createElement("line", { x1: bx + 12, y1: by + 99, x2: bx + 170, y2: by + 99, stroke: m.c + "40", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: bx + 91, y: by + 114, textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, m.x.split(",")[0]), /* @__PURE__ */ React.createElement("text", { x: bx + 91, y: by + 127, textAnchor: "middle", fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, m.x.split(",")[1] || ""));
    })));
  }
  function SkeletonSVG() {
    const [clickedBone, setClickedBone] = React.useState(null);
    const handleBoneClick = (bone) => {
      setClickedBone(bone);
      setTimeout(() => setClickedBone(null), 200);
      const utterance = new SpeechSynthesisUtterance(bone);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1050px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 560 310", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "560", height: "310", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "280", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F9B4} Human Skeleton \u2014 206 Bones"), /* @__PURE__ */ React.createElement("line", { x1: "260", y1: "54", x2: "232", y2: "57", stroke: "#F59E0B", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "260", y1: "128", x2: "221", y2: "135", stroke: "#F59E0B", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "260", y1: "180", x2: "215", y2: "165", stroke: "#38BDF8", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "260", y1: "224", x2: "236", y2: "218", stroke: "#22C55E", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "78", y1: "137", x2: "155", y2: "141", stroke: "#A855F7", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "74", y1: "202", x2: "146", y2: "205", stroke: "#A855F7", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("line", { x1: "82", y1: "272", x2: "182", y2: "264", stroke: "#EC4899", strokeWidth: "1", strokeDasharray: "4", opacity: "0.5" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "207", cy: "57", rx: "25", ry: "34", fill: "#1E3A5F", stroke: clickedBone === "Skull" ? "#F59E0B" : "#CBD5E1", strokeWidth: clickedBone === "Skull" ? 2.5 : 1.5, style: { cursor: "pointer", transition: "stroke-width 0.1s, stroke 0.1s" }, onClick: () => handleBoneClick("Skull") }), /* @__PURE__ */ React.createElement("text", { x: "207", y: "63", textAnchor: "middle", fill: "#CBD5E1", fontSize: "15", style: { cursor: "pointer" }, onClick: () => handleBoneClick("Skull") }, "\u{1F480}"), /* @__PURE__ */ React.createElement("line", { x1: "207", y1: "91", x2: "207", y2: "213", stroke: clickedBone === "Spine" ? "#38BDF8" : "#94A3B8", strokeWidth: clickedBone === "Spine" ? 5 : 4, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Spine") }), [105, 121, 137, 153, 169, 185, 201].map((y, i) => /* @__PURE__ */ React.createElement("rect", { key: i, x: "200", y: y - 5, width: "14", height: "9", rx: "2", fill: clickedBone === "Rib Cage" ? "#F59E0B" : "#64748B", stroke: "#94A3B8", strokeWidth: "1", style: { cursor: "pointer", transition: "fill 0.1s" }, onClick: () => handleBoneClick("Rib Cage") })), [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement("g", { key: i, onClick: () => handleBoneClick("Rib Cage"), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("path", { d: `M207,${120 + i * 14} Q188,${113 + i * 14} 181,${127 + i * 14}`, fill: "none", stroke: clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Rib Cage" ? "3" : "2", style: { transition: "stroke 0.1s, stroke-width 0.1s" } }), /* @__PURE__ */ React.createElement("path", { d: `M207,${120 + i * 14} Q226,${113 + i * 14} 233,${127 + i * 14}`, fill: "none", stroke: clickedBone === "Rib Cage" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Rib Cage" ? "3" : "2", style: { transition: "stroke 0.1s, stroke-width 0.1s" } }))), /* @__PURE__ */ React.createElement("ellipse", { cx: "207", cy: "218", rx: "29", ry: "18", fill: "#1E3A5F", stroke: clickedBone === "Pelvis" ? "#22C55E" : "#94A3B8", strokeWidth: clickedBone === "Pelvis" ? 2.5 : 1.5, style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Pelvis") }), /* @__PURE__ */ React.createElement("line", { x1: "181", y1: "108", x2: "155", y2: "175", stroke: clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Humerus" ? 5 : 4, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Humerus") }), /* @__PURE__ */ React.createElement("line", { x1: "155", y1: "175", x2: "137", y2: "229", stroke: clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Radius/Ulna" ? 4 : 3, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Radius/Ulna") }), /* @__PURE__ */ React.createElement("line", { x1: "233", y1: "108", x2: "260", y2: "175", stroke: clickedBone === "Humerus" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Humerus" ? 5 : 4, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Humerus") }), /* @__PURE__ */ React.createElement("line", { x1: "260", y1: "175", x2: "278", y2: "229", stroke: clickedBone === "Radius/Ulna" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Radius/Ulna" ? 4 : 3, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Radius/Ulna") }), /* @__PURE__ */ React.createElement("line", { x1: "193", y1: "235", x2: "177", y2: "290", stroke: clickedBone === "Femur" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Femur" ? 7 : 6, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Femur") }), /* @__PURE__ */ React.createElement("line", { x1: "221", y1: "235", x2: "237", y2: "290", stroke: clickedBone === "Femur" ? "#F59E0B" : "#94A3B8", strokeWidth: clickedBone === "Femur" ? 7 : 6, strokeLinecap: "round", style: { cursor: "pointer", transition: "stroke 0.1s, stroke-width 0.1s" }, onClick: () => handleBoneClick("Femur") }), /* @__PURE__ */ React.createElement("line", { x1: "215", y1: "165", x2: "260", y2: "180", stroke: "#38BDF8", strokeWidth: clickedBone === "Spine" ? 2 : 1, strokeDasharray: "4", opacity: "0.5", style: { transition: "stroke-width 0.1s" } }), /* @__PURE__ */ React.createElement("rect", { x: "260", y: clickedBone === "Skull" ? 44 : 48, width: "70", height: "20", rx: "6", fill: "#F59E0B", opacity: clickedBone === "Skull" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Skull" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 61px" }, onClick: () => handleBoneClick("Skull") }), /* @__PURE__ */ React.createElement("text", { x: "295", y: "61", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Skull" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 61px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Skull") }, "Skull"), /* @__PURE__ */ React.createElement("rect", { x: "260", y: clickedBone === "Rib Cage" ? 118 : 122, width: "70", height: "20", rx: "6", fill: "#F59E0B", opacity: clickedBone === "Rib Cage" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Rib Cage" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 135px" }, onClick: () => handleBoneClick("Rib Cage") }), /* @__PURE__ */ React.createElement("text", { x: "295", y: "135", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Rib Cage" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 135px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Rib Cage") }, "Rib Cage"), /* @__PURE__ */ React.createElement("rect", { x: "260", y: clickedBone === "Spine" ? 168 : 172, width: "70", height: "20", rx: "6", fill: "#38BDF8", opacity: clickedBone === "Spine" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Spine" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 185px" }, onClick: () => handleBoneClick("Spine") }), /* @__PURE__ */ React.createElement("text", { x: "295", y: "185", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Spine" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 185px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Spine") }, "Spine"), /* @__PURE__ */ React.createElement("rect", { x: "260", y: clickedBone === "Pelvis" ? 212 : 216, width: "70", height: "20", rx: "6", fill: "#22C55E", opacity: clickedBone === "Pelvis" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Pelvis" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 229px" }, onClick: () => handleBoneClick("Pelvis") }), /* @__PURE__ */ React.createElement("text", { x: "295", y: "229", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Pelvis" ? "scale(0.95)" : "scale(1)", transformOrigin: "295px 229px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Pelvis") }, "Pelvis"), /* @__PURE__ */ React.createElement("rect", { x: "8", y: clickedBone === "Humerus" ? 125 : 129, width: "70", height: "20", rx: "6", fill: "#A855F7", opacity: clickedBone === "Humerus" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Humerus" ? "scale(0.95)" : "scale(1)", transformOrigin: "43px 142px" }, onClick: () => handleBoneClick("Humerus") }), /* @__PURE__ */ React.createElement("text", { x: "43", y: "142", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Humerus" ? "scale(0.95)" : "scale(1)", transformOrigin: "43px 142px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Humerus") }, "Humerus"), /* @__PURE__ */ React.createElement("rect", { x: "4", y: clickedBone === "Radius/Ulna" ? 190 : 194, width: "70", height: "20", rx: "6", fill: "#A855F7", opacity: clickedBone === "Radius/Ulna" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Radius/Ulna" ? "scale(0.95)" : "scale(1)", transformOrigin: "39px 207px" }, onClick: () => handleBoneClick("Radius/Ulna") }), /* @__PURE__ */ React.createElement("text", { x: "39", y: "207", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Radius/Ulna" ? "scale(0.95)" : "scale(1)", transformOrigin: "39px 207px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Radius/Ulna") }, "Radius/Ulna"), /* @__PURE__ */ React.createElement("rect", { x: "12", y: clickedBone === "Femur" ? 260 : 264, width: "70", height: "20", rx: "6", fill: "#EC4899", opacity: clickedBone === "Femur" ? 1 : 0.85, style: { cursor: "pointer", transition: "all 0.1s", transform: clickedBone === "Femur" ? "scale(0.95)" : "scale(1)", transformOrigin: "47px 277px" }, onClick: () => handleBoneClick("Femur") }), /* @__PURE__ */ React.createElement("text", { x: "47", y: "277", textAnchor: "middle", fill: "#1E293B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'", style: { cursor: "pointer", pointerEvents: "none", transform: clickedBone === "Femur" ? "scale(0.95)" : "scale(1)", transformOrigin: "47px 277px", transition: "transform 0.1s ease-out" }, onClick: () => handleBoneClick("Femur") }, "Femur")));
  }
  function WaterCycleSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1100px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 680 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "680", height: "260", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "340", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F4A7} The Water Cycle"), /* @__PURE__ */ React.createElement("circle", { cx: "77", cy: "69", r: "30", fill: "#F59E0B", opacity: "0.75" }), /* @__PURE__ */ React.createElement("text", { x: "77", y: "77", textAnchor: "middle", fontSize: "26" }, "\u2600\uFE0F"), /* @__PURE__ */ React.createElement("path", { d: "M0 202 Q115 185 230 202 Q345 219 460 202 Q570 185 680 202 L680 260 L0 260 Z", fill: "#38BDF830", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "340", y: "238", textAnchor: "middle", fill: "#38BDF8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Ocean / Lake / River"), /* @__PURE__ */ React.createElement("ellipse", { cx: "318", cy: "65", rx: "66", ry: "39", fill: "#F1F5F9", opacity: "0.88" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "283", cy: "75", rx: "42", ry: "32", fill: "#F1F5F9", opacity: "0.88" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "353", cy: "75", rx: "42", ry: "32", fill: "#F1F5F9", opacity: "0.88" }), /* @__PURE__ */ React.createElement("text", { x: "318", y: "77", textAnchor: "middle", fill: "#475569", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2601\uFE0F Cloud"), /* @__PURE__ */ React.createElement("text", { x: "195", y: "158", textAnchor: "middle", fill: "#F59E0B", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2B06 Evaporation"), [143, 176, 214, 247].map((x, i) => /* @__PURE__ */ React.createElement("text", { key: i, x, y: 191, fill: "#F59E0B", fontSize: "17", opacity: "0.8" }, "\u2191")), /* @__PURE__ */ React.createElement("text", { x: "450", y: "39", textAnchor: "middle", fill: "#8B5CF6", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Condensation (vapor \u2192 droplets)"), /* @__PURE__ */ React.createElement("text", { x: "472", y: "104", textAnchor: "middle", fill: "#38BDF8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F327}\uFE0F Precipitation"), [415, 448, 481, 514, 547].map((x, i) => /* @__PURE__ */ React.createElement("text", { key: i, x, y: 130, fill: "#38BDF8", fontSize: "18" }, "\u2193")), /* @__PURE__ */ React.createElement("polygon", { points: "612,202 642,115 672,202", fill: "#64748B", opacity: "0.75" }), /* @__PURE__ */ React.createElement("text", { x: "617", y: "156", fill: "#94A3B8", fontSize: "11", fontFamily: "'Baloo 2'" }, "\u26F0\uFE0F Mts"), /* @__PURE__ */ React.createElement("path", { d: "M639 202 Q651 202 659 224", fill: "none", stroke: "#38BDF8", strokeWidth: "2", strokeDasharray: "4" }), /* @__PURE__ */ React.createElement("text", { x: "636", y: "245", textAnchor: "middle", fill: "#64748B", fontSize: "10", fontFamily: "'Baloo 2'" }, "Runoff")));
  }
  function PhotosynthesisSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg", style: { maxWidth: "1100px" } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 230", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "230", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F33F} Photosynthesis \u2014 How Plants Make Food"), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "phArr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0,0 L10,5 L0,10 z", fill: "#94A3B8" }))), /* @__PURE__ */ React.createElement("circle", { cx: "64", cy: "96", r: "34", fill: "#F59E0B", opacity: "0.75" }), /* @__PURE__ */ React.createElement("text", { x: "64", y: "103", textAnchor: "middle", fontSize: "28" }, "\u2600\uFE0F"), /* @__PURE__ */ React.createElement("text", { x: "64", y: "152", textAnchor: "middle", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Sunlight"), /* @__PURE__ */ React.createElement("text", { x: "64", y: "174", textAnchor: "middle", fill: "#EF4444", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "CO\u2082 \u2197"), /* @__PURE__ */ React.createElement("text", { x: "64", y: "197", textAnchor: "middle", fill: "#38BDF8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "H\u2082O \u2197"), /* @__PURE__ */ React.createElement("path", { d: "M98 99 L195 121", stroke: "#F59E0B", strokeWidth: "2.5", opacity: "0.8", markerEnd: "url(#phArr)" }), /* @__PURE__ */ React.createElement("path", { d: "M98 174 L195 148", stroke: "#EF4444", strokeWidth: "2", opacity: "0.7", markerEnd: "url(#phArr)" }), /* @__PURE__ */ React.createElement("path", { d: "M98 196 L195 163", stroke: "#38BDF8", strokeWidth: "2", opacity: "0.7", markerEnd: "url(#phArr)" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "273", cy: "137", rx: "74", ry: "60", fill: "#22C55E", opacity: "0.65", stroke: "#22C55E", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("line", { x1: "202", y1: "137", x2: "344", y2: "137", stroke: "#15803D", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("line", { x1: "273", y1: "80", x2: "273", y2: "193", stroke: "#15803D", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "273", y: "141", textAnchor: "middle", fill: "#F0FDF4", fontSize: "14", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F33F} Leaf"), /* @__PURE__ */ React.createElement("text", { x: "273", y: "160", textAnchor: "middle", fill: "#dcfce7", fontSize: "10", fontFamily: "'Baloo 2'" }, "Chlorophyll absorbs light"), /* @__PURE__ */ React.createElement("path", { d: "M344 113 L425 77", stroke: "#A855F7", strokeWidth: "2.5", opacity: "0.8", markerEnd: "url(#phArr)" }), /* @__PURE__ */ React.createElement("path", { d: "M344 159 L425 178", stroke: "#22C55E", strokeWidth: "2.5", opacity: "0.8", markerEnd: "url(#phArr)" }), /* @__PURE__ */ React.createElement("rect", { x: "427", y: "56", width: "125", height: "54", rx: "8", fill: "#A855F720", stroke: "#A855F7", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "489", y: "81", textAnchor: "middle", fill: "#A855F7", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F36C} Glucose"), /* @__PURE__ */ React.createElement("text", { x: "489", y: "99", textAnchor: "middle", fill: "#A855F7", fontSize: "10", fontFamily: "'Baloo 2'" }, "(Energy / Food)"), /* @__PURE__ */ React.createElement("rect", { x: "427", y: "160", width: "125", height: "54", rx: "8", fill: "#22C55E20", stroke: "#22C55E", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "489", y: "185", textAnchor: "middle", fill: "#22C55E", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u{1F4A8} Oxygen"), /* @__PURE__ */ React.createElement("text", { x: "489", y: "203", textAnchor: "middle", fill: "#22C55E", fontSize: "10", fontFamily: "'Baloo 2'" }, "(Released into air)"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "222", textAnchor: "middle", fill: "#475569", fontSize: "11", fontFamily: "'Baloo 2'" }, "Formula: 6CO\u2082 + 6H\u2082O + Sunlight \u2192 C\u2086H\u2081\u2082O\u2086 + 6O\u2082")));
  }
  function MaterialPropertiesSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 240", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "240", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Properties of Materials"), /* @__PURE__ */ React.createElement("rect", { x: "36", y: "52", width: "258", height: "154", rx: "14", fill: "#0F172A", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "165", y: "76", textAnchor: "middle", fill: "#38BDF8", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Conductors and Insulators"), /* @__PURE__ */ React.createElement("circle", { cx: "80", cy: "128", r: "18", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("rect", { x: "74", y: "109", width: "12", height: "8", rx: "2", fill: "#94A3B8" }), /* @__PURE__ */ React.createElement("rect", { x: "74", y: "139", width: "12", height: "8", rx: "2", fill: "#94A3B8" }), /* @__PURE__ */ React.createElement("line", { x1: "98", y1: "128", x2: "150", y2: "128", stroke: "#F59E0B", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "150", y1: "128", x2: "192", y2: "104", stroke: "#22C55E", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "150", y1: "128", x2: "192", y2: "152", stroke: "#22C55E", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("circle", { cx: "208", cy: "104", r: "7", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("circle", { cx: "208", cy: "152", r: "7", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("rect", { x: "58", y: "166", width: "58", height: "24", rx: "8", fill: "#334155" }), /* @__PURE__ */ React.createElement("text", { x: "87", y: "182", textAnchor: "middle", fill: "#F8FAFC", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Metal"), /* @__PURE__ */ React.createElement("rect", { x: "178", y: "166", width: "74", height: "24", rx: "8", fill: "#334155" }), /* @__PURE__ */ React.createElement("text", { x: "215", y: "182", textAnchor: "middle", fill: "#F8FAFC", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Rubber"), /* @__PURE__ */ React.createElement("rect", { x: "324", y: "52", width: "260", height: "154", rx: "14", fill: "#0F172A", stroke: "#22C55E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "454", y: "76", textAnchor: "middle", fill: "#22C55E", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Transparent to Opaque"), /* @__PURE__ */ React.createElement("rect", { x: "360", y: "98", width: "44", height: "82", rx: "10", fill: "#DDF4FF", stroke: "#7DD3FC", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "382", y: "194", textAnchor: "middle", fill: "#7DD3FC", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Clear"), /* @__PURE__ */ React.createElement("rect", { x: "436", y: "98", width: "44", height: "82", rx: "10", fill: "#E2E8F055", stroke: "#CBD5E1", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "458", y: "194", textAnchor: "middle", fill: "#CBD5E1", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Frosted"), /* @__PURE__ */ React.createElement("rect", { x: "512", y: "98", width: "44", height: "82", rx: "10", fill: "#64748B", stroke: "#94A3B8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "534", y: "194", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Wood"), /* @__PURE__ */ React.createElement("polygon", { points: "336,139 351,132 351,146", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("polygon", { points: "412,139 427,132 427,146", fill: "#F8FAFC88" }), /* @__PURE__ */ React.createElement("polygon", { points: "488,139 503,132 503,146", fill: "#F8FAFC33" })));
  }
  function MixturesSolutionsSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 240", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "240", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Mixtures and Solutions"), /* @__PURE__ */ React.createElement("rect", { x: "42", y: "54", width: "248", height: "150", rx: "14", fill: "#0F172A", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "166", y: "78", textAnchor: "middle", fill: "#F59E0B", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Mixture"), /* @__PURE__ */ React.createElement("rect", { x: "104", y: "96", width: "124", height: "84", rx: "12", fill: "#38BDF822", stroke: "#7DD3FC", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "129", cy: "118", r: "8", fill: "#FACC15" }), /* @__PURE__ */ React.createElement("circle", { cx: "159", cy: "146", r: "8", fill: "#F97316" }), /* @__PURE__ */ React.createElement("circle", { cx: "198", cy: "121", r: "8", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("circle", { cx: "145", cy: "167", r: "8", fill: "#F97316" }), /* @__PURE__ */ React.createElement("circle", { cx: "205", cy: "159", r: "8", fill: "#FACC15" }), /* @__PURE__ */ React.createElement("text", { x: "166", y: "195", textAnchor: "middle", fill: "#94A3B8", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Different parts can still be seen"), /* @__PURE__ */ React.createElement("rect", { x: "330", y: "54", width: "248", height: "150", rx: "14", fill: "#0F172A", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "454", y: "78", textAnchor: "middle", fill: "#38BDF8", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Solution"), /* @__PURE__ */ React.createElement("rect", { x: "392", y: "96", width: "124", height: "84", rx: "12", fill: "#22C55E22", stroke: "#86EFAC", strokeWidth: "2" }), Array.from({ length: 5 }).map((_, r) => Array.from({ length: 6 }).map((__, c) => /* @__PURE__ */ React.createElement("circle", { key: r + "_" + c, cx: 411 + c * 16, cy: 114 + r * 13, r: "4", fill: r % 2 === 0 ? "#E2E8F0" : "#22C55E" }))), /* @__PURE__ */ React.createElement("text", { x: "454", y: "195", textAnchor: "middle", fill: "#94A3B8", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Particles spread evenly through the liquid")));
  }
  function GravityForceSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 240", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "240", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Gravity Pulls Toward Earth"), /* @__PURE__ */ React.createElement("circle", { cx: "310", cy: "184", r: "44", fill: "#2563EB" }), /* @__PURE__ */ React.createElement("path", { d: "M282 175c10-18 30-28 52-22", stroke: "#34D399", strokeWidth: "9", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M302 199c15 9 33 8 46-3", stroke: "#BBF7D0", strokeWidth: "9", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "189", textAnchor: "middle", fill: "#F8FAFC", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Earth"), /* @__PURE__ */ React.createElement("circle", { cx: "310", cy: "72", r: "18", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "90", x2: "310", y2: "126", stroke: "#F59E0B", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("polygon", { points: "310,146 301,128 319,128", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "146", x2: "310", y2: "136", stroke: "#38BDF8", strokeWidth: "4", strokeDasharray: "10 8" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "136", x2: "310", y2: "148", stroke: "#38BDF8", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("text", { x: "350", y: "110", fill: "#F8FAFC", fontSize: "14", fontWeight: "700", fontFamily: "'Baloo 2'" }, "apple falls"), /* @__PURE__ */ React.createElement("path", { d: "M310 140 L310 148", stroke: "#38BDF8", strokeWidth: "4", markerEnd: "url(#gravityArrow)" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "214", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Gravity gives objects weight, makes things fall, and keeps moons and satellites in orbit."), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "gravityArrow", viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0,0 L10,5 L0,10 z", fill: "#38BDF8" })))));
  }
  function FrictionForceSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 240", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "240", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Friction Opposes Motion"), /* @__PURE__ */ React.createElement("rect", { x: "78", y: "118", width: "180", height: "40", rx: "12", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("rect", { x: "58", y: "160", width: "230", height: "18", rx: "8", fill: "#475569" }), Array.from({ length: 11 }).map((_, i) => /* @__PURE__ */ React.createElement("line", { key: i, x1: 68 + i * 20, y1: "178", x2: 78 + i * 20, y2: "190", stroke: "#94A3B8", strokeWidth: "2" })), /* @__PURE__ */ React.createElement("line", { x1: "118", y1: "100", x2: "238", y2: "100", stroke: "#22C55E", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("polygon", { points: "253,100 235,91 235,109", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("line", { x1: "238", y1: "90", x2: "148", y2: "90", stroke: "#EF4444", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("polygon", { points: "133,90 151,81 151,99", fill: "#EF4444" }), /* @__PURE__ */ React.createElement("text", { x: "186", y: "72", textAnchor: "middle", fill: "#22C55E", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "motion"), /* @__PURE__ */ React.createElement("text", { x: "194", y: "56", textAnchor: "middle", fill: "#EF4444", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "friction"), /* @__PURE__ */ React.createElement("circle", { cx: "426", cy: "140", r: "54", fill: "#0F172A", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("path", { d: "M387 141c15-20 47-28 78-18", stroke: "#7DD3FC", strokeWidth: "8", fill: "none", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("text", { x: "426", y: "146", textAnchor: "middle", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "rough grip"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "214", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Rough surfaces increase friction. Oil, ice, and polished floors reduce friction.")));
  }
  function EnergyTypesSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 255", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "255", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Types of Energy"), [
      [110, 84, "#F59E0B", "Heat"],
      [220, 84, "#38BDF8", "Light"],
      [330, 84, "#A855F7", "Sound"],
      [440, 84, "#22C55E", "Kinetic"],
      [165, 164, "#EC4899", "Chemical"],
      [290, 164, "#F97316", "Electrical"],
      [415, 164, "#14B8A6", "Potential"]
    ].map(([x, y, color, label], i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r: "34", fill: color + "22", stroke: color, strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x, y: y + 5, textAnchor: "middle", fill: color, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, label))), /* @__PURE__ */ React.createElement("rect", { x: "234", y: "116", width: "152", height: "26", rx: "13", fill: "#0F172A", stroke: "#64748B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "133", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Energy can change form"), /* @__PURE__ */ React.createElement("path", { d: "M199 157 C 225 157, 238 157, 251 157", stroke: "#EC4899", strokeWidth: "3", fill: "none", markerEnd: "url(#energyArrow)" }), /* @__PURE__ */ React.createElement("path", { d: "M316 149 C 300 126, 275 112, 244 102", stroke: "#38BDF8", strokeWidth: "3", fill: "none", markerEnd: "url(#energyArrow)" }), /* @__PURE__ */ React.createElement("path", { d: "M314 147 C 323 125, 332 112, 334 102", stroke: "#A855F7", strokeWidth: "3", fill: "none", markerEnd: "url(#energyArrow)" }), /* @__PURE__ */ React.createElement("path", { d: "M421 149 C 432 132, 438 118, 440 102", stroke: "#22C55E", strokeWidth: "3", fill: "none", markerEnd: "url(#energyArrow)" }), /* @__PURE__ */ React.createElement("path", { d: "M412 90 C 340 70, 220 68, 143 80", stroke: "#F59E0B", strokeWidth: "3", fill: "none", markerEnd: "url(#energyArrow)" }), /* @__PURE__ */ React.createElement("text", { x: "225", y: "151", fill: "#EC4899", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "stored to current"), /* @__PURE__ */ React.createElement("text", { x: "239", y: "94", fill: "#38BDF8", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "powers light"), /* @__PURE__ */ React.createElement("text", { x: "342", y: "96", fill: "#A855F7", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "makes sound"), /* @__PURE__ */ React.createElement("text", { x: "451", y: "124", fill: "#22C55E", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "becomes motion"), /* @__PURE__ */ React.createElement("text", { x: "272", y: "66", textAnchor: "middle", fill: "#F59E0B", fontSize: "9.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "motion creates heat"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "232", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Energy can change form, such as chemical energy in food becoming motion and body heat."), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "energyArrow", viewBox: "0 0 10 10", refX: "8", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0,0 L10,5 L0,10 z", fill: "#CBD5E1" })))));
  }
  function DayNightSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 240", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "240", rx: "16", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("circle", { cx: "132", cy: "108", r: "38", fill: "#FACC15" }), Array.from({ length: 10 }).map((_, i) => {
      const a = i * Math.PI / 5;
      return /* @__PURE__ */ React.createElement("line", { key: i, x1: 132 + Math.cos(a) * 48, y1: 108 + Math.sin(a) * 48, x2: 132 + Math.cos(a) * 64, y2: 108 + Math.sin(a) * 64, stroke: "#FDE68A", strokeWidth: "4", strokeLinecap: "round" });
    }), /* @__PURE__ */ React.createElement("circle", { cx: "395", cy: "122", r: "66", fill: "#2563EB" }), /* @__PURE__ */ React.createElement("path", { d: "M395 56A66 66 0 0 1 395 188", fill: "#0B1220" }), /* @__PURE__ */ React.createElement("line", { x1: "395", y1: "56", x2: "395", y2: "188", stroke: "#F8FAFC55", strokeWidth: "2", strokeDasharray: "8 8" }), /* @__PURE__ */ React.createElement("line", { x1: "395", y1: "40", x2: "415", y2: "204", stroke: "#F59E0B", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "182", y1: "86", x2: "332", y2: "86", stroke: "#FACC15", strokeWidth: "5", strokeLinecap: "round", opacity: "0.95" }), /* @__PURE__ */ React.createElement("line", { x1: "182", y1: "108", x2: "340", y2: "108", stroke: "#FDE68A", strokeWidth: "6", strokeLinecap: "round", opacity: "0.95" }), /* @__PURE__ */ React.createElement("line", { x1: "182", y1: "130", x2: "332", y2: "130", stroke: "#FACC15", strokeWidth: "5", strokeLinecap: "round", opacity: "0.95" }), /* @__PURE__ */ React.createElement("polygon", { points: "349,108 334,100 334,116", fill: "#FDE68A" }), /* @__PURE__ */ React.createElement("path", { d: "M438 94c8-12 24-17 38-13-6 8-8 18-5 28-13 2-27-3-33-15z", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("circle", { cx: "472", cy: "156", r: "5", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("circle", { cx: "495", cy: "138", r: "4", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("circle", { cx: "504", cy: "164", r: "3.5", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("text", { x: "395", y: "222", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "As Earth rotates, one side faces the Sun for day while the opposite side experiences night.")));
  }
  function SeasonsCycleSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 250", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "250", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Seasons and Earth's Tilt"), /* @__PURE__ */ React.createElement("circle", { cx: "310", cy: "128", r: "34", fill: "#FACC15" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "310", cy: "128", rx: "205", ry: "72", fill: "none", stroke: "#475569", strokeWidth: "2", strokeDasharray: "10 8" }), [[105, 128, "Summer"], [310, 56, "Autumn"], [515, 128, "Winter"], [310, 200, "Spring"]].map(([x, y, label], i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r: "18", fill: "#2563EB" }), /* @__PURE__ */ React.createElement("line", { x1: x - 8, y1: y - 22, x2: x + 8, y2: y + 22, stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x, y: y + 40, textAnchor: "middle", fill: "#F8FAFC", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, label))), /* @__PURE__ */ React.createElement("text", { x: "310", y: "230", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Earth's tilt stays the same as it orbits the Sun, so different hemispheres get different sunlight.")));
  }
  function NervousSystemSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 255", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "255", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Nervous System"), /* @__PURE__ */ React.createElement("circle", { cx: "310", cy: "72", r: "26", fill: "#A855F7" }), /* @__PURE__ */ React.createElement("rect", { x: "300", y: "96", width: "20", height: "78", rx: "10", fill: "#8B5CF6" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "115", x2: "240", y2: "138", stroke: "#C084FC", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "115", x2: "380", y2: "138", stroke: "#C084FC", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "250", y1: "140", x2: "220", y2: "188", stroke: "#C084FC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "370", y1: "140", x2: "400", y2: "188", stroke: "#C084FC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "174", x2: "280", y2: "224", stroke: "#C084FC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "174", x2: "340", y2: "224", stroke: "#C084FC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("rect", { x: "60", y: "74", width: "120", height: "56", rx: "12", fill: "#0F172A", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "120", y: "98", textAnchor: "middle", fill: "#A855F7", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Brain"), /* @__PURE__ */ React.createElement("text", { x: "120", y: "116", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "command center"), /* @__PURE__ */ React.createElement("rect", { x: "440", y: "74", width: "120", height: "56", rx: "12", fill: "#0F172A", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "500", y: "98", textAnchor: "middle", fill: "#A855F7", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Spinal Cord"), /* @__PURE__ */ React.createElement("text", { x: "500", y: "116", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "signal highway"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "240", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Nerves carry messages between the brain, senses, muscles, and organs.")));
  }
  function ClassificationSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 245", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "245", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Classification of Living Things"), /* @__PURE__ */ React.createElement("rect", { x: "246", y: "48", width: "128", height: "40", rx: "12", fill: "#22C55E22", stroke: "#22C55E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "73", textAnchor: "middle", fill: "#22C55E", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Living Things"), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "88", x2: "310", y2: "116", stroke: "#94A3B8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "180", y1: "116", x2: "440", y2: "116", stroke: "#94A3B8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "180", y1: "116", x2: "180", y2: "140", stroke: "#94A3B8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "440", y1: "116", x2: "440", y2: "140", stroke: "#94A3B8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("rect", { x: "110", y: "140", width: "140", height: "44", rx: "12", fill: "#38BDF822", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "180", y: "166", textAnchor: "middle", fill: "#38BDF8", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Vertebrates"), /* @__PURE__ */ React.createElement("rect", { x: "370", y: "140", width: "140", height: "44", rx: "12", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "440", y: "166", textAnchor: "middle", fill: "#F59E0B", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Invertebrates"), /* @__PURE__ */ React.createElement("text", { x: "180", y: "206", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "have backbones"), /* @__PURE__ */ React.createElement("text", { x: "440", y: "206", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "no backbone"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "228", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Scientists group organisms by shared features such as kingdom and body structure.")));
  }
  function AdaptationSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 245", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "245", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Adaptation Helps Survival"), /* @__PURE__ */ React.createElement("rect", { x: "46", y: "60", width: "242", height: "146", rx: "14", fill: "#0F172A", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "167", y: "84", textAnchor: "middle", fill: "#F59E0B", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Desert Camel"), /* @__PURE__ */ React.createElement("ellipse", { cx: "167", cy: "150", rx: "65", ry: "30", fill: "#D6A56B" }), /* @__PURE__ */ React.createElement("circle", { cx: "224", cy: "132", r: "18", fill: "#D6A56B" }), /* @__PURE__ */ React.createElement("rect", { x: "128", y: "100", width: "40", height: "26", rx: "12", fill: "#C08457" }), /* @__PURE__ */ React.createElement("line", { x1: "132", y1: "175", x2: "125", y2: "204", stroke: "#D6A56B", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "158", y1: "175", x2: "153", y2: "204", stroke: "#D6A56B", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "185", y1: "175", x2: "190", y2: "204", stroke: "#D6A56B", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("line", { x1: "210", y1: "175", x2: "217", y2: "204", stroke: "#D6A56B", strokeWidth: "6" }), /* @__PURE__ */ React.createElement("text", { x: "167", y: "223", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "hump, eyelashes, wide feet"), /* @__PURE__ */ React.createElement("rect", { x: "332", y: "60", width: "242", height: "146", rx: "14", fill: "#0F172A", stroke: "#22C55E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "453", y: "84", textAnchor: "middle", fill: "#22C55E", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Arctic Polar Bear"), /* @__PURE__ */ React.createElement("ellipse", { cx: "453", cy: "152", rx: "68", ry: "26", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("circle", { cx: "505", cy: "136", r: "16", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("circle", { cx: "494", cy: "123", r: "5", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("circle", { cx: "515", cy: "123", r: "5", fill: "#E2E8F0" }), /* @__PURE__ */ React.createElement("text", { x: "453", y: "223", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "fur, camouflage, fat layer")));
  }
  function SoundWavesSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 245", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "245", rx: "16", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "24", textAnchor: "middle", fill: "#E2E8F0", fontSize: "17", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Sound Waves and Vibration"), /* @__PURE__ */ React.createElement("rect", { x: "60", y: "94", width: "48", height: "74", rx: "12", fill: "#475569" }), /* @__PURE__ */ React.createElement("circle", { cx: "130", cy: "131", r: "8", fill: "#F59E0B" }), [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement("path", { key: i, d: `M ${145 + i * 18} 131 q 9 -18 18 0 q 9 18 18 0`, fill: "none", stroke: "#38BDF8", strokeWidth: "4" })), /* @__PURE__ */ React.createElement("text", { x: "84", y: "183", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "speaker"), /* @__PURE__ */ React.createElement("text", { x: "272", y: "98", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "sound wave"), /* @__PURE__ */ React.createElement("path", { d: "M400 92 q 10 -24 20 0 q 10 24 20 0 q 10 -24 20 0 q 10 24 20 0", fill: "none", stroke: "#A855F7", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M400 152 q 25 -10 50 0 q 25 10 50 0", fill: "none", stroke: "#22C55E", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("text", { x: "486", y: "82", textAnchor: "middle", fill: "#A855F7", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "high pitch"), /* @__PURE__ */ React.createElement("text", { x: "486", y: "184", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "low pitch"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "224", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Sound is made by vibrations and travels through solids, liquids, and gases, but not through vacuum.")));
  }
  function PakistanMapSVG() {
    const legend = [["#38BDF8", "KPK"], ["#F59E0B", "Punjab"], ["#22C55E", "Balochistan"], ["#EF4444", "Sindh"], ["#8B5CF6", "GB/AJK"]];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 340", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "340", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "19", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Pakistan - Provinces & Borders"), /* @__PURE__ */ React.createElement("polygon", { points: "152,72 200,44 280,40 325,57 385,72 245,67 225,67", fill: "#8B5CF6", opacity: "0.78", stroke: "#7C3AED", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "268", y: "60", textAnchor: "middle", fill: "#DDD6FE", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Gilgit-Baltistan / AJK"), /* @__PURE__ */ React.createElement("polygon", { points: "92,135 155,72 225,67 245,84 245,164 188,184 122,169", fill: "#38BDF8", opacity: "0.78", stroke: "#0EA5E9", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "172", y: "124", textAnchor: "middle", fill: "#E0F2FE", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "KPK"), /* @__PURE__ */ React.createElement("text", { x: "172", y: "140", textAnchor: "middle", fill: "#BAE6FD", fontSize: "9", fontFamily: "'Baloo 2'" }, "Peshawar"), /* @__PURE__ */ React.createElement("polygon", { points: "245,67 388,72 400,88 398,190 328,200 268,200 245,164 245,84", fill: "#F59E0B", opacity: "0.78", stroke: "#D97706", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "320", y: "130", textAnchor: "middle", fill: "#FEF3C7", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Punjab"), /* @__PURE__ */ React.createElement("text", { x: "320", y: "148", textAnchor: "middle", fill: "#FDE68A", fontSize: "9", fontFamily: "'Baloo 2'" }, "Lahore"), /* @__PURE__ */ React.createElement("polygon", { points: "92,169 122,169 188,184 245,200 268,200 258,290 200,300 138,290 92,225", fill: "#22C55E", opacity: "0.72", stroke: "#16A34A", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "176", y: "248", textAnchor: "middle", fill: "#DCFCE7", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Balochistan"), /* @__PURE__ */ React.createElement("text", { x: "176", y: "266", textAnchor: "middle", fill: "#BBF7D0", fontSize: "9", fontFamily: "'Baloo 2'" }, "Quetta"), /* @__PURE__ */ React.createElement("polygon", { points: "268,200 328,200 398,190 435,210 448,300 392,300 258,290", fill: "#EF4444", opacity: "0.72", stroke: "#DC2626", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "352", y: "252", textAnchor: "middle", fill: "#FEE2E2", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Sindh"), /* @__PURE__ */ React.createElement("text", { x: "352", y: "270", textAnchor: "middle", fill: "#FECACA", fontSize: "9", fontFamily: "'Baloo 2'" }, "Karachi"), /* @__PURE__ */ React.createElement("circle", { cx: "282", cy: "104", r: "6", fill: "#F1F5F9", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "296", y: "102", fill: "#F59E0B", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Islamabad"), /* @__PURE__ */ React.createElement("text", { x: "44", y: "100", fill: "#64748B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Afghanistan"), /* @__PURE__ */ React.createElement("text", { x: "44", y: "210", fill: "#64748B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Iran"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "24", textAnchor: "middle", fill: "#64748B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "China"), /* @__PURE__ */ React.createElement("text", { x: "492", y: "148", fill: "#64748B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "India"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "322", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Arabian Sea"), legend.map(([c, n], i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: 480, y: 58 + i * 28, width: "15", height: "15", rx: "3", fill: c, opacity: "0.78" }), /* @__PURE__ */ React.createElement("text", { x: 499, y: 70 + i * 28, fill: "#94A3B8", fontSize: "10", fontFamily: "'Baloo 2'" }, n)))));
  }
  function IndusValleySVG() {
    const facts = ["2600-1900 BCE", "South Asia (Pakistan)", "Grid-plan streets", "Drainage system", "Standard weights", "Undeciphered script", "Agriculture & trade", "Pottery & seals"];
    const timeline = [{ x: 32, l: "3000 BCE", s: "Early Indus", c: "#22C55E" }, { x: 148, l: "2600 BCE", s: "Peak Civilization", c: "#38BDF8" }, { x: 268, l: "1900 BCE", s: "Decline", c: "#EF4444" }, { x: 388, l: "1526 CE", s: "Mughal Empire", c: "#F59E0B" }, { x: 505, l: "1947", s: "Independence", c: "#A855F7" }];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 300", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "300", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Indus Valley Civilization - Mohenjo-daro"), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "28", width: "176", height: "152", rx: "8", fill: "#B4530930", stroke: "#D97706", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "106", y: "46", textAnchor: "middle", fill: "#FDE68A", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Citadel (Upper City)"), /* @__PURE__ */ React.createElement("rect", { x: "28", y: "54", width: "72", height: "52", rx: "5", fill: "#38BDF840", stroke: "#0EA5E9", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "64", y: "74", textAnchor: "middle", fill: "#F1F5F9", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Great"), /* @__PURE__ */ React.createElement("text", { x: "64", y: "88", textAnchor: "middle", fill: "#F1F5F9", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Bath"), /* @__PURE__ */ React.createElement("rect", { x: "112", y: "54", width: "70", height: "52", rx: "5", fill: "#F59E0B40", stroke: "#D97706", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "147", y: "78", textAnchor: "middle", fill: "#FEF3C7", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Granary"), /* @__PURE__ */ React.createElement("text", { x: "147", y: "96", textAnchor: "middle", fill: "#FDE68A", fontSize: "8", fontFamily: "'Baloo 2'" }, "Food Store"), /* @__PURE__ */ React.createElement("rect", { x: "28", y: "116", width: "154", height: "56", rx: "5", fill: "#A855F730", stroke: "#9333EA", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "105", y: "148", textAnchor: "middle", fill: "#E9D5FF", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Assembly Hall"), /* @__PURE__ */ React.createElement("rect", { x: "206", y: "28", width: "240", height: "152", rx: "8", fill: "#64748B18", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "326", y: "45", textAnchor: "middle", fill: "#CBD5E1", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Lower City (Residential)"), [0, 1, 2, 3].map((i) => /* @__PURE__ */ React.createElement("line", { key: "h" + i, x1: "206", y1: 54 + i * 40, x2: "446", y2: 54 + i * 40, stroke: "#94A3B8", strokeWidth: "1", opacity: "0.5" })), [0, 1, 2, 3, 4].map((i) => /* @__PURE__ */ React.createElement("line", { key: "v" + i, x1: 214 + i * 46, y1: "28", x2: 214 + i * 46, y2: "180", stroke: "#94A3B8", strokeWidth: "1", opacity: "0.5" })), [[214, 54], [260, 54], [306, 54], [352, 54], [214, 94], [260, 94], [306, 94], [352, 94], [214, 134], [260, 134]].map(([x, y], i) => /* @__PURE__ */ React.createElement("rect", { key: i, x: x + 2, y: y + 2, width: "38", height: "34", rx: "4", fill: "#92400E", opacity: "0.4", stroke: "#D97706", strokeWidth: "1" })), /* @__PURE__ */ React.createElement("circle", { cx: "380", cy: "140", r: "11", fill: "#38BDF840", stroke: "#0EA5E9", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "380", y: "160", textAnchor: "middle", fill: "#94A3B8", fontSize: "8", fontFamily: "'Baloo 2'" }, "Public Well"), /* @__PURE__ */ React.createElement("rect", { x: "458", y: "28", width: "132", height: "152", rx: "8", fill: "#1E3A5F", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "524", y: "46", textAnchor: "middle", fill: "#38BDF8", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Key Facts"), facts.map((f, i) => /* @__PURE__ */ React.createElement("text", { key: i, x: "466", y: 60 + i * 18, fill: "#CBD5E1", fontSize: "8.5", fontFamily: "'Baloo 2'" }, f)), /* @__PURE__ */ React.createElement("rect", { x: "10", y: "188", width: "580", height: "102", rx: "8", fill: "#0F172A", stroke: "#334155", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "204", textAnchor: "middle", fill: "#94A3B8", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Timeline - Civilizations in Pakistan"), /* @__PURE__ */ React.createElement("line", { x1: "28", y1: "225", x2: "572", y2: "225", stroke: "#334155", strokeWidth: "1.5" }), timeline.map((t, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("circle", { cx: t.x, cy: 225, r: "6", fill: t.c }), /* @__PURE__ */ React.createElement("text", { x: t.x, y: 218, textAnchor: "middle", fill: t.c, fontSize: "8.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, t.l), /* @__PURE__ */ React.createElement("text", { x: t.x, y: 238, textAnchor: "middle", fill: "#94A3B8", fontSize: "8", fontFamily: "'Baloo 2'" }, t.s)))));
  }
  function PakFlagSVG() {
    const symbols = [
      { e: "Animal", n: "National Animal", v: "Snow Leopard" },
      { e: "Flower", n: "National Flower", v: "Jasmine" },
      { e: "Bird", n: "National Bird", v: "Shaheen" },
      { e: "Tree", n: "National Tree", v: "Deodar Cedar" },
      { e: "Fruit", n: "National Fruit", v: "Mango" },
      { e: "Sport", n: "National Sport", v: "Field Hockey" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 280", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "280", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Pakistan - National Identity & Symbols"), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "28", width: "208", height: "136", rx: "6", fill: "#01411C", stroke: "#334155", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "28", width: "42", height: "136", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("text", { x: "138", y: "108", textAnchor: "middle", fill: "#F8FAFC", fontSize: "52" }, "\u262A"), /* @__PURE__ */ React.createElement("text", { x: "122", y: "180", textAnchor: "middle", fill: "#22C55E", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Pakistan Flag"), [
      "Green = Muslim majority",
      "White = Religious minorities",
      "Crescent = Progress",
      "Star = Light & knowledge"
    ].map((t, i) => /* @__PURE__ */ React.createElement("text", { key: i, x: "18", y: 196 + i * 14, fill: "#64748B", fontSize: "9.5", fontFamily: "'Baloo 2'" }, t)), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "250", width: "208", height: "24", rx: "6", fill: "#22C55E18", stroke: "#22C55E", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "122", y: "262", textAnchor: "middle", fill: "#22C55E", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Qaumi Tarana - Hafeez Jalandhari"), symbols.map((s2, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const sx = 238 + col * 118;
      const sy = 28 + row * 124;
      return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: sx, y: sy, width: "112", height: "116", rx: "8", fill: "#334155", stroke: "#475569", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: sx + 56, y: sy + 38, textAnchor: "middle", fill: "#F1F5F9", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, s2.e), /* @__PURE__ */ React.createElement("text", { x: sx + 56, y: sy + 56, textAnchor: "middle", fill: "#94A3B8", fontSize: "9", fontFamily: "'Baloo 2'" }, s2.n), /* @__PURE__ */ React.createElement("line", { x1: sx + 8, y1: sy + 62, x2: sx + 104, y2: sy + 62, stroke: "#475569", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: sx + 56, y: sy + 80, textAnchor: "middle", fill: "#F1F5F9", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, s2.v));
    })));
  }
  function PakGovSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 296", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "296", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Pakistan's Government Structure"), /* @__PURE__ */ React.createElement("rect", { x: "222", y: "26", width: "156", height: "46", rx: "8", fill: "#F59E0B18", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "45", textAnchor: "middle", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "President"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "60", textAnchor: "middle", fill: "#FDE68A", fontSize: "9", fontFamily: "'Baloo 2'" }, "Head of State"), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "72", x2: "300", y2: "88", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "208", y: "88", width: "184", height: "46", rx: "8", fill: "#A855F718", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "107", textAnchor: "middle", fill: "#A855F7", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Prime Minister"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "122", textAnchor: "middle", fill: "#E9D5FF", fontSize: "9", fontFamily: "'Baloo 2'" }, "Head of Government"), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "134", x2: "300", y2: "148", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "218", y: "148", width: "164", height: "40", rx: "8", fill: "#38BDF818", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "165", textAnchor: "middle", fill: "#38BDF8", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Federal Cabinet"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "180", textAnchor: "middle", fill: "#BAE6FD", fontSize: "9", fontFamily: "'Baloo 2'" }, "Ministers of departments"), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "188", x2: "300", y2: "204", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "144", y1: "204", x2: "456", y2: "204", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "144", y1: "204", x2: "144", y2: "218", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "204", x2: "300", y2: "218", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "456", y1: "204", x2: "456", y2: "218", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "54", y: "218", width: "180", height: "48", rx: "8", fill: "#22C55E18", stroke: "#22C55E", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "144", y: "236", textAnchor: "middle", fill: "#22C55E", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Senate"), /* @__PURE__ */ React.createElement("text", { x: "144", y: "250", textAnchor: "middle", fill: "#BBF7D0", fontSize: "9", fontFamily: "'Baloo 2'" }, "Upper House"), /* @__PURE__ */ React.createElement("rect", { x: "218", y: "218", width: "164", height: "48", rx: "8", fill: "#EC489918", stroke: "#EC4899", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "236", textAnchor: "middle", fill: "#EC4899", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Supreme Court"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "250", textAnchor: "middle", fill: "#FBCFE8", fontSize: "9", fontFamily: "'Baloo 2'" }, "Judiciary"), /* @__PURE__ */ React.createElement("rect", { x: "366", y: "218", width: "180", height: "48", rx: "8", fill: "#EF444418", stroke: "#EF4444", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "456", y: "236", textAnchor: "middle", fill: "#EF4444", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "National Assembly"), /* @__PURE__ */ React.createElement("text", { x: "456", y: "250", textAnchor: "middle", fill: "#FECACA", fontSize: "9", fontFamily: "'Baloo 2'" }, "Lower House"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "286", textAnchor: "middle", fill: "#475569", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "Governed by the 1973 Constitution")));
  }
  function PresidentialSystemSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 600 300", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "600", height: "300", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Presidential System"), /* @__PURE__ */ React.createElement("rect", { x: "220", y: "28", width: "160", height: "48", rx: "8", fill: "#F59E0B18", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "48", textAnchor: "middle", fill: "#F59E0B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "President"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "63", textAnchor: "middle", fill: "#FDE68A", fontSize: "9", fontFamily: "'Baloo 2'" }, "Executive leader for a fixed term"), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "76", x2: "300", y2: "100", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "212", y: "100", width: "176", height: "38", rx: "8", fill: "#1E293B", stroke: "#64748B" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "122", textAnchor: "middle", fill: "#E2E8F0", fontSize: "10.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Cabinet and ministries"), /* @__PURE__ */ React.createElement("rect", { x: "52", y: "176", width: "140", height: "54", rx: "10", fill: "#38BDF818", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "122", y: "197", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Legislature"), /* @__PURE__ */ React.createElement("text", { x: "122", y: "216", textAnchor: "middle", fill: "#BAE6FD", fontSize: "9", fontFamily: "'Baloo 2'" }, "Makes laws"), /* @__PURE__ */ React.createElement("rect", { x: "230", y: "176", width: "140", height: "54", rx: "10", fill: "#22C55E18", stroke: "#22C55E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "197", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Executive"), /* @__PURE__ */ React.createElement("text", { x: "300", y: "216", textAnchor: "middle", fill: "#BBF7D0", fontSize: "9", fontFamily: "'Baloo 2'" }, "Runs government"), /* @__PURE__ */ React.createElement("rect", { x: "408", y: "176", width: "140", height: "54", rx: "10", fill: "#A855F718", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "478", y: "197", textAnchor: "middle", fill: "#C4B5FD", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Judiciary"), /* @__PURE__ */ React.createElement("text", { x: "478", y: "216", textAnchor: "middle", fill: "#DDD6FE", fontSize: "9", fontFamily: "'Baloo 2'" }, "Interprets laws"), /* @__PURE__ */ React.createElement("line", { x1: "122", y1: "176", x2: "300", y2: "144", stroke: "#334155", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "300", y1: "176", x2: "300", y2: "144", stroke: "#334155", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "478", y1: "176", x2: "300", y2: "144", stroke: "#334155", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "148", y: "252", width: "304", height: "28", rx: "8", fill: "#111827", stroke: "#334155" }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "270", textAnchor: "middle", fill: "#CBD5E1", fontSize: "10", fontFamily: "'Baloo 2'" }, "Checks and balances stop one branch from taking all power")));
  }
  function FederalParliamentrySVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 308", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "308", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Federal Parliamentry System"), /* @__PURE__ */ React.createElement("rect", { x: "246", y: "28", width: "128", height: "40", rx: "8", fill: "#22C55E18", stroke: "#22C55E", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "50", textAnchor: "middle", fill: "#22C55E", fontSize: "11.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Citizens / Voters"), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "68", x2: "310", y2: "94", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "136", y: "94", width: "348", height: "52", rx: "10", fill: "#38BDF818", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "116", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Parliament"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "132", textAnchor: "middle", fill: "#BAE6FD", fontSize: "9", fontFamily: "'Baloo 2'" }, "National Assembly represents people \u2022 Senate represents provinces"), /* @__PURE__ */ React.createElement("rect", { x: "238", y: "176", width: "144", height: "48", rx: "8", fill: "#F59E0B18", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "196", textAnchor: "middle", fill: "#F59E0B", fontSize: "11.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Prime Minister"), /* @__PURE__ */ React.createElement("text", { x: "310", y: "212", textAnchor: "middle", fill: "#FDE68A", fontSize: "9", fontFamily: "'Baloo 2'" }, "Head of government from parliamentary majority"), /* @__PURE__ */ React.createElement("rect", { x: "54", y: "176", width: "126", height: "48", rx: "8", fill: "#A855F718", stroke: "#A855F7", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "117", y: "196", textAnchor: "middle", fill: "#C4B5FD", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "President"), /* @__PURE__ */ React.createElement("text", { x: "117", y: "212", textAnchor: "middle", fill: "#DDD6FE", fontSize: "8.8", fontFamily: "'Baloo 2'" }, "Head of state"), /* @__PURE__ */ React.createElement("rect", { x: "440", y: "176", width: "126", height: "48", rx: "8", fill: "#14B8A618", stroke: "#14B8A6", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "503", y: "196", textAnchor: "middle", fill: "#5EEAD4", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Provinces"), /* @__PURE__ */ React.createElement("text", { x: "503", y: "212", textAnchor: "middle", fill: "#99F6E4", fontSize: "8.8", fontFamily: "'Baloo 2'" }, "Assemblies share federal power"), /* @__PURE__ */ React.createElement("line", { x1: "310", y1: "146", x2: "310", y2: "176", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "180", y1: "200", x2: "238", y2: "200", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "382", y1: "200", x2: "440", y2: "200", stroke: "#475569", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "144", y: "250", width: "332", height: "30", rx: "8", fill: "#0F172A", stroke: "#334155" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "269", textAnchor: "middle", fill: "#CBD5E1", fontSize: "10", fontFamily: "'Baloo 2'" }, "The 1973 Constitution explains how federal and parliamentary institutions work together")));
  }
  function PakRiversSVG() {
    const rivers = [
      { n: "Indus", km: "3,180 km", c: "#38BDF8", note: "Longest - main artery" },
      { n: "Jhelum", km: "725 km", c: "#22C55E", note: "Punjab - Mangla Dam" },
      { n: "Chenab", km: "960 km", c: "#A855F7", note: "Joins Indus in Sindh" },
      { n: "Ravi", km: "720 km", c: "#F59E0B", note: "Flows past Lahore" },
      { n: "Kabul", km: "700 km", c: "#EC4899", note: "Meets Indus at Attock" },
      { n: "Sutlej", km: "1,551 km", c: "#14B8A6", note: "Enters from India" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 630 295", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "630", height: "295", rx: "12", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "315", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Pakistan's Rivers & Water System"), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "26", width: "368", height: "256", rx: "8", fill: "#1E3A5F14", stroke: "#334155", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("polygon", { points: "18,95 48,52 90,72 130,44 168,64 198,40 232,57 268,36 300,54 340,30 372,50 386,95", fill: "#64748B", opacity: "0.45" }), /* @__PURE__ */ React.createElement("text", { x: "202", y: "72", textAnchor: "middle", fill: "#94A3B8", fontSize: "9", fontFamily: "'Baloo 2'" }, "Himalayas / Karakoram / Hindu Kush"), /* @__PURE__ */ React.createElement("path", { d: "M232,44 Q236,82 222,118 Q212,154 217,194 Q220,234 212,268", fill: "none", stroke: "#38BDF8", strokeWidth: "5.5", strokeLinecap: "round", opacity: "0.9" }), /* @__PURE__ */ React.createElement("text", { x: "168", y: "178", fill: "#38BDF8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Indus River"), /* @__PURE__ */ React.createElement("path", { d: "M298,48 Q292,82 283,112 Q267,142 244,162 Q234,167 222,168", fill: "none", stroke: "#22C55E", strokeWidth: "3", strokeLinecap: "round", opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: "276", y: "112", fill: "#22C55E", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Jhelum"), /* @__PURE__ */ React.createElement("path", { d: "M332,52 Q322,82 312,114 Q297,142 272,160 Q257,165 242,166", fill: "none", stroke: "#A855F7", strokeWidth: "3", strokeLinecap: "round", opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: "314", y: "110", fill: "#A855F7", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Chenab"), /* @__PURE__ */ React.createElement("path", { d: "M362,57 Q350,82 340,107 Q322,132 302,150 Q282,160 267,160", fill: "none", stroke: "#F59E0B", strokeWidth: "2.5", strokeLinecap: "round", opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: "346", y: "102", fill: "#F59E0B", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Ravi"), /* @__PURE__ */ React.createElement("path", { d: "M18,110 Q78,110 132,114 Q178,118 217,118", fill: "none", stroke: "#EC4899", strokeWidth: "2.5", strokeLinecap: "round", opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: "82", y: "106", fill: "#EC4899", fontSize: "9", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Kabul"), [{ x: 234, y: 102, n: "Tarbela", c: "#EF4444" }, { x: 287, y: 128, n: "Mangla", c: "#EF4444" }, { x: 172, y: 118, n: "Warsak", c: "#F97316" }].map((d, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("rect", { x: d.x - 13, y: d.y - 9, width: "26", height: "18", rx: "3", fill: d.c, opacity: "0.85" }), /* @__PURE__ */ React.createElement("text", { x: d.x, y: d.y + 5, textAnchor: "middle", fill: "#F1F5F9", fontSize: "7", fontWeight: "700", fontFamily: "'Baloo 2'" }, "DAM"), /* @__PURE__ */ React.createElement("text", { x: d.x, y: d.y - 13, textAnchor: "middle", fill: d.c, fontSize: "8.5", fontWeight: "700", fontFamily: "'Baloo 2'" }, d.n))), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "268", width: "368", height: "14", fill: "#38BDF8", opacity: "0.25" }), /* @__PURE__ */ React.createElement("text", { x: "202", y: "279", textAnchor: "middle", fill: "#38BDF8", fontSize: "9.5", fontFamily: "'Baloo 2'" }, "Arabian Sea"), /* @__PURE__ */ React.createElement("rect", { x: "398", y: "26", width: "220", height: "256", rx: "8", fill: "#1E293B", stroke: "#334155", strokeWidth: "1" }), /* @__PURE__ */ React.createElement("text", { x: "508", y: "44", textAnchor: "middle", fill: "#38BDF8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Major Rivers"), rivers.map((r, i) => /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: "406", y1: 58 + i * 34, x2: "610", y2: 58 + i * 34, stroke: r.c, strokeWidth: "2.5", opacity: "0.7" }), /* @__PURE__ */ React.createElement("text", { x: "408", y: 72 + i * 34, fill: r.c, fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, r.n, " (", r.km, ")"), /* @__PURE__ */ React.createElement("text", { x: "408", y: 84 + i * 34, fill: "#64748B", fontSize: "8.5", fontFamily: "'Baloo 2'" }, r.note)))));
  }
  function ColumnAddSVG({ num1, num2, result }) {
    const sr = String(result).split("");
    const maxL = sr.length;
    const s1 = String(num1).padStart(maxL, " ").split("");
    const s2 = String(num2).padStart(maxL, " ").split("");
    const d1r = String(num1).split("").reverse().map(Number);
    const d2r = String(num2).split("").reverse().map(Number);
    const carryArr = new Array(maxL).fill(0);
    let carry = 0;
    for (let i = 0; i < d1r.length || i < d2r.length; i++) {
      const sum = (d1r[i] || 0) + (d2r[i] || 0) + carry;
      carry = sum >= 10 ? 1 : 0;
      if (carry && maxL - 2 - i >= 0) carryArr[maxL - 2 - i] = 1;
    }
    const cw = 48, pad = 55;
    const w = maxL * cw + pad + 20, h = 200;
    const xOf = (i) => pad + i * cw + cw / 2;
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: w, height: h, rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: w - 10, y: "18", textAnchor: "end", fill: "#64748B", fontSize: "11", fontFamily: "'Baloo 2'" }, "Column Addition"), carryArr.map((c, i) => c ? /* @__PURE__ */ React.createElement("g", { key: "c" + i }, /* @__PURE__ */ React.createElement("circle", { cx: xOf(i), cy: "40", r: "14", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: xOf(i), y: "45", textAnchor: "middle", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1"), /* @__PURE__ */ React.createElement("path", { d: `M${xOf(i + 1) - 5},62 Q${xOf(i + 1) - cw / 2},30 ${xOf(i) + 5},50`, fill: "none", stroke: "#F59E0B", strokeWidth: "1.5", strokeDasharray: "3", opacity: "0.6" })) : null), s1.map((d, i) => d !== " " ? /* @__PURE__ */ React.createElement("text", { key: "a" + i, x: xOf(i), y: "85", textAnchor: "middle", fill: "#38BDF8", fontSize: "28", fontWeight: "800", fontFamily: "'Baloo 2'" }, d) : null), /* @__PURE__ */ React.createElement("text", { x: "22", y: "122", fill: "#22C55E", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "+"), s2.map((d, i) => d !== " " ? /* @__PURE__ */ React.createElement("text", { key: "b" + i, x: xOf(i), y: "122", textAnchor: "middle", fill: "#22C55E", fontSize: "28", fontWeight: "800", fontFamily: "'Baloo 2'" }, d) : null), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "135", x2: w - 12, y2: "135", stroke: "#F59E0B", strokeWidth: "3" }), sr.map((d, i) => /* @__PURE__ */ React.createElement("text", { key: "r" + i, x: xOf(i), y: "172", textAnchor: "middle", fill: "#F1F5F9", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, d))));
  }
  function ColumnSubSVG({ num1, num2, result }) {
    const maxL = Math.max(String(num1).length, String(num2).length, String(result).length);
    const s1 = String(num1).padStart(maxL, "0").split("").map(Number);
    const s2 = String(num2).padStart(maxL, "0").split("").map(Number);
    const sr = String(result).padStart(maxL, " ").split("");
    const newTop = [...s1];
    const changed = new Array(maxL).fill(false);
    for (let i = maxL - 1; i >= 0; i--) {
      if (newTop[i] < s2[i]) {
        let j = i - 1;
        while (j >= 0 && newTop[j] === 0) {
          newTop[j] = 9;
          changed[j] = true;
          j--;
        }
        if (j >= 0) {
          newTop[j] -= 1;
          changed[j] = true;
        }
        newTop[i] += 10;
        changed[i] = true;
      }
    }
    const cw = 48, pad = 55;
    const w = maxL * cw + pad + 20, h = 210;
    const xOf = (i) => pad + i * cw + cw / 2;
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: `0 0 ${w} ${h}`, xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: w, height: h, rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: w - 10, y: "18", textAnchor: "end", fill: "#64748B", fontSize: "11", fontFamily: "'Baloo 2'" }, "Borrowing"), changed.map((ch, i) => {
      if (!ch) return null;
      const gave = newTop[i] < s1[i];
      const got = newTop[i] > s1[i];
      return /* @__PURE__ */ React.createElement("g", { key: "bw" + i }, /* @__PURE__ */ React.createElement("text", { x: xOf(i) + 12, y: "38", textAnchor: "middle", fill: "#EF4444", fontSize: "12", fontWeight: "600", fontFamily: "'Baloo 2'", opacity: "0.5" }, /* @__PURE__ */ React.createElement("tspan", { textDecoration: "line-through" }, s1[i])), /* @__PURE__ */ React.createElement("circle", { cx: xOf(i) - 8, cy: "42", r: "13", fill: got ? "#22C55E22" : "#F59E0B22", stroke: got ? "#22C55E" : "#F59E0B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: xOf(i) - 8, y: "47", textAnchor: "middle", fill: got ? "#22C55E" : "#F59E0B", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, newTop[i]), got && i > 0 && /* @__PURE__ */ React.createElement("path", { d: `M${xOf(i - 1) + 10},55 Q${xOf(i) - cw / 2 + 10},25 ${xOf(i) - 20},35`, fill: "none", stroke: "#F59E0B", strokeWidth: "2", markerEnd: "url(#bArr)" }));
    }), s1.map((d, i) => /* @__PURE__ */ React.createElement("text", { key: "a" + i, x: xOf(i), y: "82", textAnchor: "middle", fill: "#38BDF8", fontSize: "28", fontWeight: "800", fontFamily: "'Baloo 2'", opacity: changed[i] ? 0.25 : 1 }, d)), /* @__PURE__ */ React.createElement("text", { x: "22", y: "118", fill: "#EF4444", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2212"), s2.map((d, i) => /* @__PURE__ */ React.createElement("text", { key: "b" + i, x: xOf(i), y: "118", textAnchor: "middle", fill: "#EF4444", fontSize: "28", fontWeight: "800", fontFamily: "'Baloo 2'" }, d)), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "132", x2: w - 12, y2: "132", stroke: "#EF4444", strokeWidth: "3" }), sr.map((d, i) => /* @__PURE__ */ React.createElement("text", { key: "r" + i, x: xOf(i), y: "170", textAnchor: "middle", fill: "#F1F5F9", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, d)), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", { id: "bArr", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "5", markerHeight: "5", orient: "auto" }, /* @__PURE__ */ React.createElement("path", { d: "M0,0 L10,5 L0,10 z", fill: "#F59E0B" })))));
  }
  function EstimationSVG({ num1, num2, op, rounded1, rounded2, estimate, exact }) {
    const opSym = op === "+" ? "+" : "\u2212";
    const opCol = op === "+" ? "#22C55E" : "#EF4444";
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 580 130", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "580", height: "130", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "290", y: "18", textAnchor: "middle", fill: "#64748B", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Estimation: Round \u2192 Calculate"), /* @__PURE__ */ React.createElement("rect", { x: "15", y: "30", width: "130", height: "85", rx: "10", fill: "#38BDF822", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "80", y: "52", textAnchor: "middle", fill: "#38BDF8", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Original"), /* @__PURE__ */ React.createElement("text", { x: "80", y: "75", textAnchor: "middle", fill: "#F1F5F9", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, num1.toLocaleString()), /* @__PURE__ */ React.createElement("text", { x: "80", y: "95", textAnchor: "middle", fill: opCol, fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, opSym, " ", num2.toLocaleString()), /* @__PURE__ */ React.createElement("line", { x1: "155", y1: "72", x2: "195", y2: "72", stroke: "#F59E0B", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "195,67 205,72 195,77", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x: "180", y: "62", textAnchor: "middle", fill: "#F59E0B", fontSize: "10", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Round"), /* @__PURE__ */ React.createElement("rect", { x: "215", y: "30", width: "130", height: "85", rx: "10", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "280", y: "52", textAnchor: "middle", fill: "#F59E0B", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Rounded"), /* @__PURE__ */ React.createElement("text", { x: "280", y: "75", textAnchor: "middle", fill: "#F1F5F9", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, rounded1.toLocaleString()), /* @__PURE__ */ React.createElement("text", { x: "280", y: "95", textAnchor: "middle", fill: opCol, fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, opSym, " ", rounded2.toLocaleString()), /* @__PURE__ */ React.createElement("line", { x1: "355", y1: "72", x2: "395", y2: "72", stroke: "#A855F7", strokeWidth: "2.5", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "395,67 405,72 395,77", fill: "#A855F7" }), /* @__PURE__ */ React.createElement("rect", { x: "415", y: "30", width: "150", height: "85", rx: "10", fill: "#22C55E22", stroke: "#22C55E", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "490", y: "52", textAnchor: "middle", fill: "#22C55E", fontSize: "11", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Estimate"), /* @__PURE__ */ React.createElement("text", { x: "490", y: "78", textAnchor: "middle", fill: "#F1F5F9", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2248 ", estimate.toLocaleString()), /* @__PURE__ */ React.createElement("text", { x: "490", y: "102", textAnchor: "middle", fill: "#94A3B8", fontSize: "11", fontFamily: "'Baloo 2'" }, "Exact: ", exact.toLocaleString())));
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
    return clean.slice(0, Math.max(0, maxLength - 1)).trimEnd() + "\u2026";
  }
  function wrapSvgLines(text, maxChars = 30, maxLines = 4) {
    const words = clipSvgText(text, maxChars * maxLines + 20).split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    words.forEach((word) => {
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
    trimmed[maxLines - 1] = trimmed[maxLines - 1].replace(/…?$/, "") + "\u2026";
    return trimmed;
  }
  function SvgTextBlock({ text, x, y, maxChars = 30, maxLines = 4, lineHeight = 18, fill = "#E2E8F0", anchor = "start", size = 14, weight = 600 }) {
    const lines = wrapSvgLines(text, maxChars, maxLines);
    return /* @__PURE__ */ React.createElement("text", { x, y, textAnchor: anchor, fill, fontSize: size, fontWeight: weight, fontFamily: "'Baloo 2'" }, lines.map((line, idx) => /* @__PURE__ */ React.createElement("tspan", { key: idx, x, dy: idx === 0 ? 0 : lineHeight }, line)));
  }
  function getUniqueMathText(items, limit) {
    const seen = /* @__PURE__ */ new Set();
    const out = [];
    items.forEach((item) => {
      const clean = clipSvgText(item, 150);
      const key = clean.toLowerCase();
      if (!clean || seen.has(key)) return;
      seen.add(key);
      out.push(clean);
    });
    return out.slice(0, limit);
  }
  function getMathWorkedExamples(sub) {
    const examples = getUniqueMathText(sub?.examples || [], 3);
    if (examples.length >= 3) return examples;
    const derived = [...examples];
    (sub?.exercises || []).forEach((ex) => {
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
    if (/place value/.test(title)) return "Value = digit \xD7 its place.";
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
    if (/parallel|perpendicular/.test(title)) return "Parallel never meet; perpendicular meet at 90\xB0.";
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
    if (/parallel|perpendicular/.test(title)) return ["See whether the lines ever meet.", "If they meet, check for a 90\xB0 angle.", "Name them as parallel or perpendicular.", "Match the idea to a real-life example."];
    if (/2d shapes/.test(title)) return ["Count sides and corners.", "Look for equal sides or right angles.", "Check symmetry if needed.", "Name the shape using its properties."];
    if (/3d shapes/.test(title)) return ["Count faces, edges, and vertices.", "Notice whether the solid rolls or stacks.", "Match its net or real object.", "Name the solid correctly."];
    if (/perimeter/.test(title)) return ["Read every side length.", "Add all outer sides together.", "Use the same unit throughout.", "Check that you measured around the shape."];
    if (/area/.test(title)) return ["Identify the base and height or length and width.", "Use the correct area formula.", "Multiply to find the space inside.", "Write square units in the answer."];
    if (/volume/.test(title)) return ["Read the three dimensions.", "Multiply length \xD7 width \xD7 height.", "Compare the result with cube counting if helpful.", "Write cubic units in the answer."];
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
    if (sub.svgType === "placeValue") return /* @__PURE__ */ React.createElement(PlaceValueChart, { number: sub.svgData.number });
    if (sub.svgType === "expandedForm") return /* @__PURE__ */ React.createElement(ExpandedFormSVG, { number: sub.svgData.number, parts: sub.svgData.parts });
    if (sub.svgType === "compare") return /* @__PURE__ */ React.createElement(CompareTripleSVG, null);
    if (sub.svgType === "rounding") return /* @__PURE__ */ React.createElement(RoundingDualSVG, null);
    if (sub.svgType === "columnAdd") return /* @__PURE__ */ React.createElement(ColumnAddSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, result: sub.svgData.result });
    if (sub.svgType === "columnSub") return /* @__PURE__ */ React.createElement(ColumnSubSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, result: sub.svgData.result });
    if (sub.svgType === "estimation") return /* @__PURE__ */ React.createElement(EstimationSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, op: sub.svgData.op, rounded1: sub.svgData.rounded1, rounded2: sub.svgData.rounded2, estimate: sub.svgData.estimate, exact: sub.svgData.exact });
    if (sub.svgType === "numberLine") {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NumberLineSVG, { min: sub.svgData.min, max: sub.svgData.max, marks: sub.svgData.marks, highlight: sub.svgData.highlight }), /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 100", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "100", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Positive & Negative Numbers"), /* @__PURE__ */ React.createElement("line", { x1: "30", y1: "52", x2: "590", y2: "52", stroke: "#475569", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "22,52 30,46 30,58", fill: "#475569" }), /* @__PURE__ */ React.createElement("polygon", { points: "598,52 590,46 590,58", fill: "#475569" }), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n, i) => {
        const x = 310 + n * 52;
        const isZero = n === 0;
        const isNeg = n < 0;
        const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
        return /* @__PURE__ */ React.createElement("g", { key: i }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: "44", x2: x, y2: "60", stroke: col, strokeWidth: isZero ? 4 : 2 }), /* @__PURE__ */ React.createElement("text", { x, y: "80", textAnchor: "middle", fill: col, fontSize: isZero ? "18" : "15", fontWeight: isZero ? "900" : "700", fontFamily: "'Baloo 2'" }, n), isZero && /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "52", r: "6", fill: "#F59E0B" }));
      }), /* @__PURE__ */ React.createElement("text", { x: "80", y: "38", textAnchor: "middle", fill: "#EF4444", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2190 Negative"), /* @__PURE__ */ React.createElement("text", { x: "540", y: "38", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Positive \u2192"))));
    }
    return null;
  }
  function MathWordProblemStrategySVG({ sub, lessonTitle }) {
    const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
    const multDiv = /multiplication|division/.test(title) || /shared equally|each|per|divided/.test(sub?.c || "");
    const pav = /perimeter|area|volume/.test(lessonTitle || "");
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "260", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("rect", { x: "28", y: "56", width: "182", height: "152", rx: "16", fill: "#1E293B", stroke: "#38BDF8", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "50", y: "82", fill: "#38BDF8", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1. Read the Story"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: multDiv ? "Circle equal groups, each, total, and share clues." : pav ? "Underline dimensions, units, cost, and what must be found." : "Circle numbers and clue words like total, left, or difference.", x: 50, y: 108, maxChars: 22, maxLines: 5, fill: "#E2E8F0", size: 13, weight: 600 }), /* @__PURE__ */ React.createElement("rect", { x: "228", y: "56", width: "182", height: "152", rx: "16", fill: "#1E293B", stroke: "#22C55E", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "250", y: "82", fill: "#22C55E", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "2. Choose Method"), multDiv ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "252", y: "108", width: "48", height: "36", rx: "10", fill: "#22C55E22", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "276", y: "131", textAnchor: "middle", fill: "#F8FAFC", fontSize: "20", fontWeight: "900", fontFamily: "'Baloo 2'" }, "4"), /* @__PURE__ */ React.createElement("text", { x: "306", y: "131", fill: "#94A3B8", fontSize: "18", fontWeight: "700", fontFamily: "'Baloo 2'" }, "groups \xD7 6"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "170", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Equal groups \u2192 multiply"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "190", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Shared equally \u2192 divide")) : pav ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "250", y: "104", width: "96", height: "54", rx: "10", fill: "#F59E0B22", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x: "298", y: "128", textAnchor: "middle", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "l = 12 m"), /* @__PURE__ */ React.createElement("text", { x: "298", y: "148", textAnchor: "middle", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "w = 8 m"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "182", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Around \u2192 perimeter"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "200", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Inside \u2192 area or volume")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "250", y: "116", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "48 + 27 = 75"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "148", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "75 \u2212 19 = 56"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "178", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Total / altogether \u2192 add"), /* @__PURE__ */ React.createElement("text", { x: "250", y: "198", fill: "#E2E8F0", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Left / difference \u2192 subtract")), /* @__PURE__ */ React.createElement("rect", { x: "428", y: "56", width: "184", height: "152", rx: "16", fill: "#1E293B", stroke: "#A855F7", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "450", y: "82", fill: "#A855F7", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "3. Solve & Check"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: multDiv ? "Write the number sentence, solve, and check if the answer matches the groups." : pav ? "Use the right formula, keep units, and check whether the answer is distance, area, or capacity." : "Solve neatly, label the answer, then compare it with the story.", x: 450, y: 110, maxChars: 20, maxLines: 5, fill: "#E2E8F0", size: 13, weight: 600 }), /* @__PURE__ */ React.createElement("line", { x1: "210", y1: "132", x2: "228", y2: "132", stroke: "#64748B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("polygon", { points: "228,132 218,126 218,138", fill: "#64748B" }), /* @__PURE__ */ React.createElement("line", { x1: "410", y1: "132", x2: "428", y2: "132", stroke: "#64748B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("polygon", { points: "428,132 418,126 418,138", fill: "#64748B" })));
  }
  function MathMultiplicationMethodSVG() {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "18px" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "math-visual-label", style: { marginBottom: 8 } }, "Column Method with Carry"), /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 310", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "760", height: "310", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("rect", { x: "78", y: "34", width: "604", height: "248", rx: "18", fill: "#1E293B", stroke: "#86EFAC", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("text", { x: "118", y: "64", fill: "#86EFAC", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Multiply ones first, then tens, then add the partial products"), /* @__PURE__ */ React.createElement("circle", { cx: "568", cy: "78", r: "14", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("text", { x: "568", y: "83", textAnchor: "middle", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1"), /* @__PURE__ */ React.createElement("path", { d: "M582 98 Q576 66 575 76", fill: "none", stroke: "#F59E0B", strokeWidth: "1.5", strokeDasharray: "3", opacity: "0.7" }), /* @__PURE__ */ React.createElement("text", { x: "590", y: "120", textAnchor: "end", fill: "#F8FAFC", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, "23"), /* @__PURE__ */ React.createElement("text", { x: "590", y: "156", textAnchor: "end", fill: "#22C55E", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\xD7 14"), /* @__PURE__ */ React.createElement("line", { x1: "448", y1: "168", x2: "592", y2: "168", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "590", y: "204", textAnchor: "end", fill: "#38BDF8", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "92"), /* @__PURE__ */ React.createElement("text", { x: "590", y: "236", textAnchor: "end", fill: "#A855F7", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "230"), /* @__PURE__ */ React.createElement("line", { x1: "448", y1: "246", x2: "592", y2: "246", stroke: "#475569", strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("text", { x: "590", y: "274", textAnchor: "end", fill: "#F8FAFC", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, "322"), /* @__PURE__ */ React.createElement("text", { x: "140", y: "122", fill: "#94A3B8", fontSize: "15", fontWeight: "700", fontFamily: "'Baloo 2'" }, "3 \xD7 4 = 12, write 2 and carry 1"), /* @__PURE__ */ React.createElement("text", { x: "140", y: "154", fill: "#94A3B8", fontSize: "15", fontWeight: "700", fontFamily: "'Baloo 2'" }, "2 \xD7 4 = 8, then add the carried 1 to make 9"), /* @__PURE__ */ React.createElement("text", { x: "140", y: "202", fill: "#94A3B8", fontSize: "15", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Now multiply by 1 ten, so the next line starts in the tens place"), /* @__PURE__ */ React.createElement("text", { x: "140", y: "234", fill: "#94A3B8", fontSize: "15", fontWeight: "700", fontFamily: "'Baloo 2'" }, "23 \xD7 10 = 230, then add 92 + 230")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "math-visual-label", style: { marginBottom: 8 } }, "Area / Partial Products"), /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 760 286", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "760", height: "286", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "30", width: "692", height: "226", rx: "18", fill: "#1E293B", stroke: "#22C55E", strokeWidth: "1.6" }), /* @__PURE__ */ React.createElement("text", { x: "76", y: "66", fill: "#22C55E", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Split 23 into tens and ones, then add both products"), /* @__PURE__ */ React.createElement("text", { x: "204", y: "98", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, "20"), /* @__PURE__ */ React.createElement("text", { x: "556", y: "98", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "96", y: "160", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, "14"), /* @__PURE__ */ React.createElement("rect", { x: "116", y: "112", width: "176", height: "88", rx: "14", fill: "#38BDF822", stroke: "#38BDF8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "292", y: "112", width: "176", height: "88", rx: "14", fill: "#14B8A622", stroke: "#14B8A6", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("rect", { x: "468", y: "112", width: "176", height: "88", rx: "14", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "204", y: "136", textAnchor: "middle", fill: "#38BDF8", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "14 \xD7 20"), /* @__PURE__ */ React.createElement("text", { x: "204", y: "174", textAnchor: "middle", fill: "#F8FAFC", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "280"), /* @__PURE__ */ React.createElement("text", { x: "380", y: "136", textAnchor: "middle", fill: "#14B8A6", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Add the parts"), /* @__PURE__ */ React.createElement("text", { x: "380", y: "174", textAnchor: "middle", fill: "#F8FAFC", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "280 + 42"), /* @__PURE__ */ React.createElement("text", { x: "556", y: "136", textAnchor: "middle", fill: "#F59E0B", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "14 \xD7 3"), /* @__PURE__ */ React.createElement("text", { x: "556", y: "174", textAnchor: "middle", fill: "#F8FAFC", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "42"), /* @__PURE__ */ React.createElement("path", { d: "M214 150 C248 126, 300 126, 338 150", fill: "none", stroke: "#14B8A6", strokeWidth: "3.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "338,150 328,145 329,155", fill: "#14B8A6" }), /* @__PURE__ */ React.createElement("path", { d: "M546 150 C512 126, 460 126, 422 150", fill: "none", stroke: "#14B8A6", strokeWidth: "3.2", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "422,150 432,145 431,155", fill: "#14B8A6" }), /* @__PURE__ */ React.createElement("line", { x1: "116", y1: "214", x2: "644", y2: "214", stroke: "#334155", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "380", y: "240", textAnchor: "middle", fill: "#E2E8F0", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, "14 \xD7 23 = 280 + 42 = 322")))));
  }
  function MathLongDivisionWorkedSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 320", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "320", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("path", { d: "M296 112 h-228 v126", fill: "none", stroke: "#38BDF8", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M296 112 q-18 -18 -36 0", fill: "none", stroke: "#38BDF8", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("text", { x: "44", y: "164", textAnchor: "middle", fill: "#F8FAFC", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "5"), /* @__PURE__ */ React.createElement("text", { x: "174", y: "104", textAnchor: "end", fill: "#22C55E", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "27"), /* @__PURE__ */ React.createElement("text", { x: "126", y: "140", textAnchor: "middle", fill: "#F8FAFC", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "1"), /* @__PURE__ */ React.createElement("text", { x: "150", y: "140", textAnchor: "middle", fill: "#F8FAFC", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "174", y: "140", textAnchor: "middle", fill: "#F8FAFC", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "5"), /* @__PURE__ */ React.createElement("text", { x: "108", y: "162", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2212"), /* @__PURE__ */ React.createElement("text", { x: "126", y: "162", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "1"), /* @__PURE__ */ React.createElement("text", { x: "150", y: "162", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "0"), /* @__PURE__ */ React.createElement("line", { x1: "92", y1: "168", x2: "182", y2: "168", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "150", y: "186", textAnchor: "middle", fill: "#F8FAFC", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "174", y: "186", textAnchor: "middle", fill: "#F8FAFC", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "5"), /* @__PURE__ */ React.createElement("text", { x: "126", y: "210", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2212"), /* @__PURE__ */ React.createElement("text", { x: "150", y: "210", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "174", y: "210", textAnchor: "middle", fill: "#A855F7", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "5"), /* @__PURE__ */ React.createElement("line", { x1: "92", y1: "216", x2: "182", y2: "216", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "174", y: "236", textAnchor: "middle", fill: "#F8FAFC", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "0"), /* @__PURE__ */ React.createElement("rect", { x: "324", y: "86", width: "284", height: "184", rx: "16", fill: "#1E293B", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "344", y: "114", fill: "#94A3B8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Repeat the steps"), /* @__PURE__ */ React.createElement("text", { x: "344", y: "144", fill: "#22C55E", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1. Divide: 13 \xF7 5 = 2"), /* @__PURE__ */ React.createElement("text", { x: "344", y: "170", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "2. Multiply: 2 \xD7 5 = 10"), /* @__PURE__ */ React.createElement("text", { x: "344", y: "196", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "3. Subtract: 13 \u2212 10 = 3"), /* @__PURE__ */ React.createElement("text", { x: "344", y: "222", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "4. Bring down 5 to make 35"), /* @__PURE__ */ React.createElement("text", { x: "344", y: "246", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "5. Divide again: 35 \xF7 5 = 7")));
  }
  function MathFactorsToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "260", rx: "20", fill: "#0F172A" }), title.includes("lcm") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Find the LCM"), /* @__PURE__ */ React.createElement("text", { x: "48", y: "108", fill: "#38BDF8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Multiples of 4"), ["4", "8", "12", "16"].map((n, i) => /* @__PURE__ */ React.createElement("rect", { key: n, x: 48 + i * 64, y: "122", width: "52", height: "34", rx: "10", fill: n === "12" ? "#22C55E22" : "#1E293B", stroke: n === "12" ? "#22C55E" : "#475569" })), ["4", "8", "12", "16"].map((n, i) => /* @__PURE__ */ React.createElement("text", { key: "t" + n, x: 74 + i * 64, y: "144", textAnchor: "middle", fill: "#F8FAFC", fontSize: "16", fontWeight: "900", fontFamily: "'Baloo 2'" }, n)), /* @__PURE__ */ React.createElement("text", { x: "48", y: "192", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Multiples of 6"), ["6", "12", "18", "24"].map((n, i) => /* @__PURE__ */ React.createElement("rect", { key: n, x: 48 + i * 64, y: "206", width: "52", height: "34", rx: "10", fill: n === "12" ? "#22C55E22" : "#1E293B", stroke: n === "12" ? "#22C55E" : "#475569" })), ["6", "12", "18", "24"].map((n, i) => /* @__PURE__ */ React.createElement("text", { key: "b" + n, x: 74 + i * 64, y: "228", textAnchor: "middle", fill: "#F8FAFC", fontSize: "16", fontWeight: "900", fontFamily: "'Baloo 2'" }, n)), /* @__PURE__ */ React.createElement("text", { x: "374", y: "150", fill: "#22C55E", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "LCM(4, 6) = 12"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "List multiples in order and choose the first number that appears in both lists.", x: 374, y: 182, maxChars: 28, maxLines: 3, fill: "#E2E8F0", size: 13, weight: 700 })) : title.includes("hcf") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Find the HCF"), /* @__PURE__ */ React.createElement("text", { x: "48", y: "104", fill: "#38BDF8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Factors of 18"), /* @__PURE__ */ React.createElement("text", { x: "48", y: "126", fill: "#F8FAFC", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, "1, 2, 3, 6, 9, 18"), /* @__PURE__ */ React.createElement("text", { x: "48", y: "166", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Factors of 24"), /* @__PURE__ */ React.createElement("text", { x: "48", y: "188", fill: "#F8FAFC", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, "1, 2, 3, 4, 6, 8, 12, 24"), /* @__PURE__ */ React.createElement("rect", { x: "394", y: "92", width: "174", height: "110", rx: "16", fill: "#1E293B", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "482", y: "126", textAnchor: "middle", fill: "#22C55E", fontSize: "16", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Common Factors"), /* @__PURE__ */ React.createElement("text", { x: "482", y: "154", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "1, 2, 3, 6"), /* @__PURE__ */ React.createElement("text", { x: "482", y: "184", textAnchor: "middle", fill: "#F59E0B", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "HCF = 6")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Prime, Composite, Factors"), /* @__PURE__ */ React.createElement("rect", { x: "44", y: "104", width: "160", height: "108", rx: "16", fill: "#1E293B", stroke: "#38BDF8" }), /* @__PURE__ */ React.createElement("text", { x: "124", y: "130", textAnchor: "middle", fill: "#38BDF8", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Prime: 13"), /* @__PURE__ */ React.createElement("text", { x: "124", y: "164", textAnchor: "middle", fill: "#F8FAFC", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1 and 13"), /* @__PURE__ */ React.createElement("text", { x: "124", y: "192", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Exactly two factors"), /* @__PURE__ */ React.createElement("rect", { x: "238", y: "104", width: "160", height: "108", rx: "16", fill: "#1E293B", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x: "318", y: "130", textAnchor: "middle", fill: "#F59E0B", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Composite: 12"), /* @__PURE__ */ React.createElement("text", { x: "318", y: "164", textAnchor: "middle", fill: "#F8FAFC", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1, 2, 3, 4, 6, 12"), /* @__PURE__ */ React.createElement("text", { x: "318", y: "192", textAnchor: "middle", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "More than two factors"), /* @__PURE__ */ React.createElement("rect", { x: "432", y: "104", width: "164", height: "108", rx: "16", fill: "#1E293B", stroke: "#A855F7" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "List factor pairs to find all factors, then classify the number.", x: 452, y: 144, maxChars: 18, maxLines: 4, fill: "#E2E8F0", size: 14, weight: 700 }))));
  }
  function MathFractionsToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "260", rx: "20", fill: "#0F172A" }), title.includes("mixed") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Improper to Mixed Number"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "116", fill: "#F8FAFC", fontSize: "22", fontWeight: "900", fontFamily: "'Baloo 2'" }, "11 \xF7 4 = 2 remainder 3"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "170", fill: "#8B5CF6", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, "11/4 = 2 3/4"), /* @__PURE__ */ React.createElement("rect", { x: "346", y: "96", width: "216", height: "108", rx: "16", fill: "#1E293B", stroke: "#C4B5FD" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Whole number = quotient, fraction = remainder over the same denominator.", x: 366, y: 130, maxChars: 22, maxLines: 4, fill: "#E2E8F0", size: 14, weight: 700 })) : title.includes("equivalent") || title.includes("simplifying") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, title.includes("equivalent") ? "Equivalent Fractions" : "Simplifying Fractions"), /* @__PURE__ */ React.createElement("rect", { x: "48", y: "108", width: "92", height: "34", rx: "10", fill: "#8B5CF622", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("text", { x: "94", y: "131", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "1/2"), /* @__PURE__ */ React.createElement("text", { x: "158", y: "132", fill: "#94A3B8", fontSize: "20", fontWeight: "900", fontFamily: "'Baloo 2'" }, "="), /* @__PURE__ */ React.createElement("rect", { x: "180", y: "108", width: "92", height: "34", rx: "10", fill: "#8B5CF622", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("text", { x: "226", y: "131", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2/4"), /* @__PURE__ */ React.createElement("text", { x: "290", y: "132", fill: "#94A3B8", fontSize: "20", fontWeight: "900", fontFamily: "'Baloo 2'" }, "="), /* @__PURE__ */ React.createElement("rect", { x: "312", y: "108", width: "92", height: "34", rx: "10", fill: "#8B5CF622", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("text", { x: "358", y: "131", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "4/8"), /* @__PURE__ */ React.createElement("text", { x: "50", y: "188", fill: "#F59E0B", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "12/18 \xF7 6 = 2/3"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Multiply or divide the numerator and denominator by the same number to keep the value unchanged.", x: 50, y: 214, maxChars: 40, maxLines: 2, fill: "#E2E8F0", size: 13, weight: 700 })) : title.includes("add") || title.includes("subtract") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Add and Subtract Fractions"), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "110", width: "180", height: "28", rx: "10", fill: "#1E293B", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("rect", { x: "50", y: "110", width: "45", height: "28", rx: "10", fill: "#8B5CF6" }), /* @__PURE__ */ React.createElement("rect", { x: "250", y: "110", width: "180", height: "28", rx: "10", fill: "#1E293B", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("rect", { x: "250", y: "110", width: "90", height: "28", rx: "10", fill: "#A78BFA" }), /* @__PURE__ */ React.createElement("text", { x: "140", y: "92", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "1/4"), /* @__PURE__ */ React.createElement("text", { x: "240", y: "128", textAnchor: "middle", fill: "#94A3B8", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "+"), /* @__PURE__ */ React.createElement("text", { x: "340", y: "92", textAnchor: "middle", fill: "#F8FAFC", fontSize: "18", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2/4"), /* @__PURE__ */ React.createElement("text", { x: "500", y: "128", fill: "#22C55E", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "= 3/4"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "If denominators match, add only the numerators. If they differ, make equivalent fractions first.", x: 50, y: 192, maxChars: 42, maxLines: 3, fill: "#E2E8F0", size: 13, weight: 700 })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Proper and Improper Fractions"), /* @__PURE__ */ React.createElement("text", { x: "74", y: "100", fill: "#8B5CF6", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Proper 3/5"), /* @__PURE__ */ React.createElement("rect", { x: "54", y: "116", width: "160", height: "28", rx: "10", fill: "#1E293B", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("rect", { x: "54", y: "116", width: "96", height: "28", rx: "10", fill: "#8B5CF6" }), /* @__PURE__ */ React.createElement("text", { x: "332", y: "100", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Improper 7/5"), /* @__PURE__ */ React.createElement("rect", { x: "268", y: "116", width: "160", height: "28", rx: "10", fill: "#1E293B", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("rect", { x: "268", y: "116", width: "160", height: "28", rx: "10", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("rect", { x: "438", y: "116", width: "60", height: "28", rx: "10", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Numerator smaller than denominator \u2192 proper. Numerator equal to or greater than denominator \u2192 improper.", x: 54, y: 188, maxChars: 44, maxLines: 3, fill: "#E2E8F0", size: 13, weight: 700 }))));
  }
  function MathDecimalsToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "260", rx: "20", fill: "#0F172A" }), title.includes("fractions") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Fractions and Decimals"), /* @__PURE__ */ React.createElement("text", { x: "62", y: "130", fill: "#F8FAFC", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3/4 = 0.75"), /* @__PURE__ */ React.createElement("text", { x: "62", y: "170", fill: "#94A3B8", fontSize: "16", fontWeight: "700", fontFamily: "'Baloo 2'" }, "divide 3 by 4"), /* @__PURE__ */ React.createElement("rect", { x: "342", y: "94", width: "220", height: "116", rx: "16", fill: "#1E293B", stroke: "#38BDF8" }), /* @__PURE__ */ React.createElement("text", { x: "452", y: "126", textAnchor: "middle", fill: "#38BDF8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Place Value"), /* @__PURE__ */ React.createElement("text", { x: "452", y: "158", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "0 . 7 5"), /* @__PURE__ */ React.createElement("text", { x: "452", y: "186", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "7 tenths, 5 hundredths")) : title.includes("add") || title.includes("subtract") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Add and Subtract Decimals"), /* @__PURE__ */ React.createElement("text", { x: "144", y: "126", textAnchor: "end", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "12.30"), /* @__PURE__ */ React.createElement("text", { x: "144", y: "156", textAnchor: "end", fill: "#22C55E", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "+ 4.75"), /* @__PURE__ */ React.createElement("line", { x1: "68", y1: "166", x2: "150", y2: "166", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "144", y: "198", textAnchor: "end", fill: "#38BDF8", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "17.05"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Keep decimal points in one straight line and add zeros if places are missing.", x: 220, y: 136, maxChars: 28, maxLines: 3, fill: "#E2E8F0", size: 14, weight: 700 })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Decimal Place Value"), /* @__PURE__ */ React.createElement("rect", { x: "52", y: "96", width: "508", height: "82", rx: "16", fill: "#1E293B", stroke: "#38BDF8" }), ["Ones", "Tenths", "Hundredths", "Thousandths"].map((label, i) => /* @__PURE__ */ React.createElement("g", { key: label }, /* @__PURE__ */ React.createElement("line", { x1: 52 + i * 127, y1: "96", x2: 52 + i * 127, y2: "178", stroke: "#334155" }), /* @__PURE__ */ React.createElement("text", { x: 115 + i * 127, y: "122", textAnchor: "middle", fill: "#38BDF8", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, label))), /* @__PURE__ */ React.createElement("text", { x: "115", y: "156", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "242", y: "156", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "4"), /* @__PURE__ */ React.createElement("text", { x: "369", y: "156", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "8"), /* @__PURE__ */ React.createElement("text", { x: "496", y: "156", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2"), /* @__PURE__ */ React.createElement("text", { x: "177", y: "156", textAnchor: "middle", fill: "#F59E0B", fontSize: "28", fontWeight: "900", fontFamily: "'Baloo 2'" }, "."))));
  }
  function MathRatioPercentToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 260", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "260", rx: "20", fill: "#0F172A" }), title.includes("ratio to fraction") ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Ratio to Fraction"), /* @__PURE__ */ React.createElement("rect", { x: "56", y: "104", width: "72", height: "52", rx: "14", fill: "#EC489922" }), /* @__PURE__ */ React.createElement("text", { x: "92", y: "138", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2"), /* @__PURE__ */ React.createElement("text", { x: "144", y: "138", fill: "#94A3B8", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, ":"), /* @__PURE__ */ React.createElement("rect", { x: "164", y: "104", width: "72", height: "52", rx: "14", fill: "#EC489922" }), /* @__PURE__ */ React.createElement("text", { x: "200", y: "138", textAnchor: "middle", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3"), /* @__PURE__ */ React.createElement("text", { x: "280", y: "138", fill: "#94A3B8", fontSize: "26", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2192"), /* @__PURE__ */ React.createElement("text", { x: "332", y: "138", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2/5 and 3/5"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Add parts first: 2 + 3 = 5. Then write each part over the total.", x: 58, y: 196, maxChars: 42, maxLines: 2, fill: "#E2E8F0", size: 13, weight: 700 })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Percent as Part of 100"), Array.from({ length: 20 }).map((_, i) => {
      const x = 58 + i % 10 * 20;
      const y = 106 + Math.floor(i / 10) * 20;
      return /* @__PURE__ */ React.createElement("rect", { key: i, x, y, width: "18", height: "18", fill: "#EC4899", stroke: "#0F172A" });
    }), Array.from({ length: 80 }).map((_, i) => {
      const x = 58 + (i + 20) % 10 * 20;
      const y = 106 + Math.floor((i + 20) / 10) * 20;
      return /* @__PURE__ */ React.createElement("rect", { key: "w" + i, x, y, width: "18", height: "18", fill: "#1E293B", stroke: "#334155" });
    }), /* @__PURE__ */ React.createElement("text", { x: "300", y: "150", fill: "#F8FAFC", fontSize: "30", fontWeight: "900", fontFamily: "'Baloo 2'" }, "20%"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: "Shade 20 out of 100 boxes. 25% = one quarter, 50% = one half, 75% = three quarters.", x: 372, y: 126, maxChars: 24, maxLines: 4, fill: "#E2E8F0", size: 13, weight: 700 }))));
  }
  function MathLinesAnglesToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Lines and Angles"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "250", height: "146", rx: "16", fill: "#1E293B", stroke: "#38BDF8" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "112", fill: "#38BDF8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Line, Ray, Segment"), /* @__PURE__ */ React.createElement("line", { x1: "64", y1: "138", x2: "246", y2: "138", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("polygon", { points: "64,138 74,132 74,144", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("polygon", { points: "246,138 236,132 236,144", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "156", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Line goes on in both directions"), /* @__PURE__ */ React.createElement("circle", { cx: "68", cy: "188", r: "6", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("line", { x1: "68", y1: "188", x2: "246", y2: "188", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("polygon", { points: "246,188 236,182 236,194", fill: "#F8FAFC" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "208", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Ray has one endpoint"), /* @__PURE__ */ React.createElement("circle", { cx: "68", cy: "224", r: "6", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("circle", { cx: "246", cy: "224", r: "6", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("line", { x1: "68", y1: "224", x2: "246", y2: "224", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "244", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Segment has two endpoints"), /* @__PURE__ */ React.createElement("rect", { x: "306", y: "88", width: "300", height: "146", rx: "16", fill: "#1E293B", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "326", y: "112", fill: "#22C55E", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Classify the Angles"), /* @__PURE__ */ React.createElement("line", { x1: "346", y1: "192", x2: "346", y2: "136", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "346", y1: "192", x2: "402", y2: "192", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M346 176 A16 16 0 0 1 362 192", fill: "none", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "372", y: "170", fill: "#22C55E", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "90\xB0 Right"), /* @__PURE__ */ React.createElement("line", { x1: "456", y1: "192", x2: "456", y2: "136", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "456", y1: "192", x2: "508", y2: "154", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M456 174 A22 22 0 0 1 478 176", fill: "none", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "500", y: "144", fill: "#F59E0B", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Acute < 90\xB0"), /* @__PURE__ */ React.createElement("line", { x1: "346", y1: "234", x2: "396", y2: "234", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "346", y1: "234", x2: "316", y2: "194", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M332 214 A26 26 0 0 0 372 232", fill: "none", stroke: "#A855F7", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "404", y: "236", fill: "#A855F7", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Obtuse > 90\xB0"), /* @__PURE__ */ React.createElement("line", { x1: "456", y1: "234", x2: "522", y2: "234", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "456", y1: "234", x2: "390", y2: "234", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("text", { x: "464", y: "220", fill: "#38BDF8", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "180\xB0 Straight")));
  }
  function MathParallelPerpendicularToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Parallel and Perpendicular"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "266", height: "146", rx: "16", fill: "#1E293B", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "54", y: "112", fill: "#22C55E", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Parallel Lines"), /* @__PURE__ */ React.createElement("line", { x1: "74", y1: "142", x2: "254", y2: "142", stroke: "#F8FAFC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "74", y1: "178", x2: "254", y2: "178", stroke: "#F8FAFC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "96", y1: "130", x2: "96", y2: "192", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("line", { x1: "232", y1: "130", x2: "232", y2: "192", stroke: "#F59E0B", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "54", y: "214", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Same distance apart like train tracks"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "234", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Symbol: ||"), /* @__PURE__ */ React.createElement("rect", { x: "322", y: "88", width: "284", height: "146", rx: "16", fill: "#1E293B", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x: "342", y: "112", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Perpendicular Lines"), /* @__PURE__ */ React.createElement("line", { x1: "462", y1: "132", x2: "462", y2: "220", stroke: "#F8FAFC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("line", { x1: "396", y1: "176", x2: "528", y2: "176", stroke: "#F8FAFC", strokeWidth: "5" }), /* @__PURE__ */ React.createElement("rect", { x: "462", y: "160", width: "20", height: "20", fill: "none", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "342", y: "206", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Meet to form a right angle of 90\xB0"), /* @__PURE__ */ React.createElement("text", { x: "342", y: "226", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Symbol: \u22A5")));
  }
  function Math2DShapesToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "2D Shapes"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "572", height: "146", rx: "16", fill: "#1E293B", stroke: "#8B5CF6" }), /* @__PURE__ */ React.createElement("rect", { x: "68", y: "128", width: "54", height: "54", fill: "#8B5CF622", stroke: "#C4B5FD", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "95", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Square"), /* @__PURE__ */ React.createElement("rect", { x: "156", y: "136", width: "76", height: "42", fill: "#38BDF822", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "194", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Rectangle"), /* @__PURE__ */ React.createElement("polygon", { points: "288,182 250,128 326,128", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "288", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Triangle"), /* @__PURE__ */ React.createElement("circle", { cx: "390", cy: "156", r: "28", fill: "#22C55E22", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "390", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Circle"), /* @__PURE__ */ React.createElement("polygon", { points: "470,182 444,162 454,130 486,130 496,162", fill: "#EC489922", stroke: "#EC4899", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "470", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Pentagon"), /* @__PURE__ */ React.createElement("polygon", { points: "554,182 530,168 530,142 554,128 578,142 578,168", fill: "#FACC1522", stroke: "#FACC15", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "554", y: "204", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Hexagon"), /* @__PURE__ */ React.createElement("text", { x: "52", y: "112", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Flat shapes have length and width. Count sides, corners, and equal sides.")));
  }
  function Math3DShapesToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "3D Shapes"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "572", height: "146", rx: "16", fill: "#1E293B", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("g", { transform: "translate(70 112)" }, /* @__PURE__ */ React.createElement("rect", { x: "0", y: "18", width: "54", height: "54", fill: "none", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("rect", { x: "18", y: "0", width: "54", height: "54", fill: "none", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "0", y1: "18", x2: "18", y2: "0", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "54", y1: "18", x2: "72", y2: "0", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "54", y1: "72", x2: "72", y2: "54", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "0", y1: "72", x2: "18", y2: "54", stroke: "#38BDF8", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "96", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Cube")), /* @__PURE__ */ React.createElement("g", { transform: "translate(206 110)" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "36", cy: "12", rx: "30", ry: "12", fill: "#22C55E22", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "12", x2: "6", y2: "72", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "66", y1: "12", x2: "66", y2: "72", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "36", cy: "72", rx: "30", ry: "12", fill: "#22C55E22", stroke: "#22C55E", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "102", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Cylinder")), /* @__PURE__ */ React.createElement("g", { transform: "translate(338 110)" }, /* @__PURE__ */ React.createElement("ellipse", { cx: "36", cy: "74", rx: "32", ry: "12", fill: "#A855F722", stroke: "#A855F7", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "4", y1: "74", x2: "36", y2: "8", stroke: "#A855F7", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("line", { x1: "68", y1: "74", x2: "36", y2: "8", stroke: "#A855F7", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "102", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Cone")), /* @__PURE__ */ React.createElement("g", { transform: "translate(470 110)" }, /* @__PURE__ */ React.createElement("circle", { cx: "36", cy: "42", r: "34", fill: "#F59E0B22", stroke: "#F59E0B", strokeWidth: "3" }), /* @__PURE__ */ React.createElement("ellipse", { cx: "36", cy: "42", rx: "34", ry: "12", fill: "none", stroke: "#FDE68A", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "102", textAnchor: "middle", fill: "#F8FAFC", fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Sphere")), /* @__PURE__ */ React.createElement("text", { x: "52", y: "112", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "3D shapes have length, width, and height. Count faces, edges, and vertices.")));
  }
  function MathGeometryToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    if (title.includes("parallel") || title.includes("perpendicular")) return /* @__PURE__ */ React.createElement(MathParallelPerpendicularToolkitSVG, null);
    if (title.includes("2d")) return /* @__PURE__ */ React.createElement(Math2DShapesToolkitSVG, null);
    if (title.includes("3d")) return /* @__PURE__ */ React.createElement(Math3DShapesToolkitSVG, null);
    return /* @__PURE__ */ React.createElement(MathLinesAnglesToolkitSVG, null);
  }
  function MathBarGraphToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Bar Graphs"), /* @__PURE__ */ React.createElement("line", { x1: "86", y1: "210", x2: "292", y2: "210", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "86", y1: "210", x2: "86", y2: "98", stroke: "#F8FAFC", strokeWidth: "4" }), [0, 10, 20, 30].map((n, i) => /* @__PURE__ */ React.createElement("g", { key: n }, /* @__PURE__ */ React.createElement("line", { x1: "78", y1: 210 - i * 34, x2: "94", y2: 210 - i * 34, stroke: "#94A3B8", strokeWidth: "2" }), /* @__PURE__ */ React.createElement("text", { x: "64", y: 214 - i * 34, textAnchor: "end", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, n))), /* @__PURE__ */ React.createElement("rect", { x: "114", y: "142", width: "34", height: "68", rx: "6", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("rect", { x: "170", y: "108", width: "34", height: "102", rx: "6", fill: "#22C55E" }), /* @__PURE__ */ React.createElement("rect", { x: "226", y: "74", width: "34", height: "136", rx: "6", fill: "#A855F7" }), /* @__PURE__ */ React.createElement("text", { x: "131", y: "230", textAnchor: "middle", fill: "#F8FAFC", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Apple"), /* @__PURE__ */ React.createElement("text", { x: "187", y: "230", textAnchor: "middle", fill: "#F8FAFC", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Banana"), /* @__PURE__ */ React.createElement("text", { x: "243", y: "230", textAnchor: "middle", fill: "#F8FAFC", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Mango"), /* @__PURE__ */ React.createElement("rect", { x: "330", y: "88", width: "276", height: "146", rx: "16", fill: "#1E293B", stroke: "#38BDF8" }), /* @__PURE__ */ React.createElement("text", { x: "350", y: "114", fill: "#38BDF8", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "How to Read"), /* @__PURE__ */ React.createElement("text", { x: "350", y: "146", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1. Read the title and both axes."), /* @__PURE__ */ React.createElement("text", { x: "350", y: "172", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "2. Check the scale: 0, 10, 20, 30."), /* @__PURE__ */ React.createElement("text", { x: "350", y: "198", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "3. Compare bar heights to find most or least."), /* @__PURE__ */ React.createElement("text", { x: "350", y: "224", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Equal-width bars with equal spacing make the graph fair.")));
  }
  function MathPictographToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Pictographs"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "262", height: "146", rx: "16", fill: "#1E293B", stroke: "#22C55E" }), /* @__PURE__ */ React.createElement("text", { x: "54", y: "114", fill: "#22C55E", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Key"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "142", fill: "#F8FAFC", fontSize: "20", fontWeight: "900", fontFamily: "'Baloo 2'" }, "\u2605 = 4 students"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "178", fill: "#F8FAFC", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Blue  \u2605 \u2605 \u2605  = 12"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "204", fill: "#F8FAFC", fontSize: "16", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Red   \u2605 \u2605    = 8"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "228", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Half a symbol means half the key value."), /* @__PURE__ */ React.createElement("rect", { x: "318", y: "88", width: "288", height: "146", rx: "16", fill: "#1E293B", stroke: "#86EFAC" }), /* @__PURE__ */ React.createElement("text", { x: "338", y: "114", fill: "#86EFAC", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "How to Solve"), /* @__PURE__ */ React.createElement("text", { x: "338", y: "146", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "1. Read one picture from the key."), /* @__PURE__ */ React.createElement("text", { x: "338", y: "172", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "2. Count pictures in each row."), /* @__PURE__ */ React.createElement("text", { x: "338", y: "198", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "3. Multiply count by key value."), /* @__PURE__ */ React.createElement("text", { x: "338", y: "224", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Example: 3 stars means 3 \xD7 4 = 12 students.")));
  }
  function MathLineGraphToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Line Graphs"), /* @__PURE__ */ React.createElement("line", { x1: "86", y1: "212", x2: "300", y2: "212", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("line", { x1: "86", y1: "212", x2: "86", y2: "96", stroke: "#F8FAFC", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("polyline", { points: "110,188 154,170 198,136 242,150 286,116", fill: "none", stroke: "#A855F7", strokeWidth: "4" }), [["Mon", 110, 188], ["Tue", 154, 170], ["Wed", 198, 136], ["Thu", 242, 150], ["Fri", 286, 116]].map(([d, x, y]) => /* @__PURE__ */ React.createElement("g", { key: d }, /* @__PURE__ */ React.createElement("circle", { cx: x, cy: y, r: "6", fill: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x, y: "232", textAnchor: "middle", fill: "#F8FAFC", fontSize: "12", fontWeight: "800", fontFamily: "'Baloo 2'" }, d))), /* @__PURE__ */ React.createElement("text", { x: "330", y: "112", fill: "#A855F7", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Trend Reading"), /* @__PURE__ */ React.createElement("rect", { x: "330", y: "126", width: "276", height: "108", rx: "16", fill: "#1E293B", stroke: "#A855F7" }), /* @__PURE__ */ React.createElement("text", { x: "350", y: "154", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Line rising upward = increase"), /* @__PURE__ */ React.createElement("text", { x: "350", y: "180", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Line falling downward = decrease"), /* @__PURE__ */ React.createElement("text", { x: "350", y: "206", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Flat line = no change"), /* @__PURE__ */ React.createElement("text", { x: "350", y: "228", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Steeper slope means faster change.")));
  }
  function MathDataInterpretationToolkitSVG() {
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Interpreting Data"), /* @__PURE__ */ React.createElement("rect", { x: "34", y: "88", width: "248", height: "146", rx: "16", fill: "#1E293B", stroke: "#F59E0B" }), /* @__PURE__ */ React.createElement("text", { x: "54", y: "114", fill: "#F59E0B", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Sample Table"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "142", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Apples   30"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "168", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Bananas  45"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "194", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Oranges  20"), /* @__PURE__ */ React.createElement("text", { x: "54", y: "220", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Grapes   35"), /* @__PURE__ */ React.createElement("rect", { x: "304", y: "88", width: "302", height: "146", rx: "16", fill: "#1E293B", stroke: "#FDE68A" }), /* @__PURE__ */ React.createElement("text", { x: "324", y: "114", fill: "#FDE68A", fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Question Checks"), /* @__PURE__ */ React.createElement("text", { x: "324", y: "144", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Highest: 45 bananas"), /* @__PURE__ */ React.createElement("text", { x: "324", y: "170", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Lowest: 20 oranges"), /* @__PURE__ */ React.createElement("text", { x: "324", y: "196", fill: "#F8FAFC", fontSize: "14", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Range: 45 - 20 = 25"), /* @__PURE__ */ React.createElement("text", { x: "324", y: "222", fill: "#94A3B8", fontSize: "13", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Always read title, labels, total, difference, and trend.")));
  }
  function MathDataHandlingToolkitSVG({ sub }) {
    const title = (sub?.t || "").toLowerCase();
    if (title.includes("pictograph")) return /* @__PURE__ */ React.createElement(MathPictographToolkitSVG, null);
    if (title.includes("line")) return /* @__PURE__ */ React.createElement(MathLineGraphToolkitSVG, null);
    if (title.includes("interpreting")) return /* @__PURE__ */ React.createElement(MathDataInterpretationToolkitSVG, null);
    return /* @__PURE__ */ React.createElement(MathBarGraphToolkitSVG, null);
  }
  function MathTextbookStarterSVG({ sub, lessonTitle }) {
    const theme = getMathVisualTheme(sub, lessonTitle);
    const examples = getMathWorkedExamples(sub).slice(0, 2);
    const rule = getMathQuickRule(sub, lessonTitle);
    const steps = getMathSolveSteps(sub, lessonTitle).slice(0, 3);
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 270", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "270", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "66", fill: "#F8FAFC", fontSize: "24", fontWeight: "900", fontFamily: "'Baloo 2'" }, clipSvgText(sub?.t || "Math Method", 24)), /* @__PURE__ */ React.createElement("rect", { x: "32", y: "86", width: "242", height: "152", rx: "18", fill: theme.soft, opacity: "0.18", stroke: theme.accent, strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("text", { x: "52", y: "112", fill: theme.accent, fontSize: "15", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Worked Pattern"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: examples[0] || rule, x: 52, y: 138, maxChars: 24, maxLines: 3, lineHeight: 18, fill: "#F8FAFC", size: 14, weight: 700 }), /* @__PURE__ */ React.createElement("line", { x1: "52", y1: "178", x2: "254", y2: "178", stroke: "#334155", strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: examples[1] || "Check the same pattern with another example.", x: 52, y: 202, maxChars: 24, maxLines: 3, lineHeight: 18, fill: "#CBD5E1", size: 13, weight: 600 }), /* @__PURE__ */ React.createElement("rect", { x: "292", y: "86", width: "316", height: "58", rx: "18", fill: theme.accent, opacity: "0.16", stroke: theme.accent, strokeWidth: "1.4" }), /* @__PURE__ */ React.createElement("text", { x: "314", y: "112", fill: theme.chip, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Rule to Remember"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: rule, x: 314, y: 134, maxChars: 31, maxLines: 2, lineHeight: 17, fill: "#F8FAFC", size: 14, weight: 700 }), steps.map((step, idx) => {
      const y = 170 + idx * 28;
      return /* @__PURE__ */ React.createElement("g", { key: idx }, /* @__PURE__ */ React.createElement("circle", { cx: "314", cy: y - 4, r: "10", fill: theme.accent }), /* @__PURE__ */ React.createElement("text", { x: "314", y, textAnchor: "middle", fill: "#082F49", fontSize: "12", fontWeight: "900", fontFamily: "'Baloo 2'" }, idx + 1), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: step, x: 334, y, maxChars: 31, maxLines: 1, lineHeight: 16, fill: "#E2E8F0", size: 13, weight: 700 }));
    })));
  }
  function renderMathTextbookPrimarySVG(sub, lessonTitle) {
    const title = `${lessonTitle || ""} ${sub?.t || ""}`.toLowerCase();
    const subTitle = (sub?.t || "").toLowerCase();
    const content = (sub?.c || "").toLowerCase();
    if ((lessonTitle || "").toLowerCase().includes("geometry")) return /* @__PURE__ */ React.createElement(MathGeometryToolkitSVG, { sub });
    if ((lessonTitle || "").toLowerCase().includes("data handling")) return /* @__PURE__ */ React.createElement(MathDataHandlingToolkitSVG, { sub });
    if (subTitle === "long division") return /* @__PURE__ */ React.createElement(MathLongDivisionWorkedSVG, null);
    if (subTitle === "word problems") return /* @__PURE__ */ React.createElement(MathWordProblemStrategySVG, { sub, lessonTitle });
    if (subTitle === "large multiplication") return /* @__PURE__ */ React.createElement(MathMultiplicationMethodSVG, null);
    if (/word problem|story problem|problem solving/.test(title) || /shared equally|each|perimeter|area|volume|altogether|left/.test(content)) return /* @__PURE__ */ React.createElement(MathWordProblemStrategySVG, { sub, lessonTitle });
    if (/division|divide|quotient|remainder/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathLongDivisionWorkedSVG, null);
    if (/multiplication|multiply|times/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathMultiplicationMethodSVG, null);
    if (/prime|composite|factor|multiple|hcf|lcm/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathFactorsToolkitSVG, { sub });
    if (/fraction|numerator|denominator|mixed number|equivalent/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathFractionsToolkitSVG, { sub });
    if (/decimal/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathDecimalsToolkitSVG, { sub });
    if (/ratio|percent|percentage/.test(subTitle)) return /* @__PURE__ */ React.createElement(MathRatioPercentToolkitSVG, { sub });
    return /* @__PURE__ */ React.createElement(MathTextbookStarterSVG, { sub, lessonTitle });
  }
  function MathMethodStepsSVG({ sub, lessonTitle }) {
    const theme = getMathVisualTheme(sub, lessonTitle);
    const steps = getMathSolveSteps(sub, lessonTitle);
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 300", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "300", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "36", y: "40", fill: theme.accent, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Method Path"), steps.map((step, idx) => {
      const y = 64 + idx * 56;
      return /* @__PURE__ */ React.createElement("g", { key: idx }, idx < steps.length - 1 && /* @__PURE__ */ React.createElement("line", { x1: "78", y1: y + 40, x2: "78", y2: y + 60, stroke: theme.chip, strokeWidth: "4", strokeLinecap: "round", opacity: "0.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "78", cy: y + 20, r: "18", fill: theme.accent }), /* @__PURE__ */ React.createElement("text", { x: "78", y: y + 26, textAnchor: "middle", fill: "#082F49", fontSize: "16", fontWeight: "900", fontFamily: "'Baloo 2'" }, idx + 1), /* @__PURE__ */ React.createElement("rect", { x: "112", y, width: "486", height: "40", rx: "14", fill: theme.soft, opacity: "0.18", stroke: theme.accent, strokeWidth: "1.3" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: step, x: 132, y: y + 24, maxChars: 50, maxLines: 2, lineHeight: 15, fill: "#E2E8F0", size: 13, weight: 700 }));
    })));
  }
  function MathWorkedExamplesSVG({ sub, lessonTitle }) {
    const theme = getMathVisualTheme(sub, lessonTitle);
    const samples = getMathWorkedExamples(sub);
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 280", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "280", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "40", fill: theme.accent, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Worked Examples"), samples.map((sample, idx) => {
      const y = 58 + idx * 68;
      return /* @__PURE__ */ React.createElement("g", { key: idx }, /* @__PURE__ */ React.createElement("rect", { x: "28", y, width: "584", height: "52", rx: "16", fill: theme.soft, opacity: "0.16", stroke: theme.accent, strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("rect", { x: "42", y: y + 10, width: "78", height: "30", rx: "12", fill: theme.accent }), /* @__PURE__ */ React.createElement("text", { x: "81", y: y + 30, textAnchor: "middle", fill: "#082F49", fontSize: "13", fontWeight: "900", fontFamily: "'Baloo 2'" }, "Example ", idx + 1), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: sample, x: 136, y: y + 22, maxChars: 49, maxLines: 2, lineHeight: 17, fill: "#F8FAFC", size: 14, weight: 700 }));
    })));
  }
  function MathPracticePlanSVG({ sub, lessonTitle }) {
    const theme = getMathVisualTheme(sub, lessonTitle);
    const problem = clipSvgText(getMathPracticeExample(sub), 180);
    const checks = ["Underline the numbers.", "Pick the rule or operation.", "Solve neatly step by step.", "Check the answer against the story."];
    return /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 640 280", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "640", height: "280", rx: "20", fill: "#0F172A" }), /* @__PURE__ */ React.createElement("text", { x: "34", y: "40", fill: theme.accent, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Problem Plan"), /* @__PURE__ */ React.createElement("rect", { x: "28", y: "58", width: "270", height: "194", rx: "18", fill: theme.soft, opacity: "0.16", stroke: theme.accent, strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("text", { x: "46", y: "86", fill: "#F8FAFC", fontSize: "18", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Try This Question"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: problem, x: 46, y: 110, maxChars: 28, maxLines: 6, lineHeight: 18, fill: "#E2E8F0", size: 14, weight: 600 }), /* @__PURE__ */ React.createElement("rect", { x: "316", y: "58", width: "296", height: "82", rx: "18", fill: theme.accent, opacity: "0.16", stroke: theme.accent, strokeWidth: "1.2" }), /* @__PURE__ */ React.createElement("text", { x: "336", y: "84", fill: theme.chip, fontSize: "13", fontWeight: "800", fontFamily: "'Baloo 2'" }, "Quick Rule"), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: getMathQuickRule(sub, lessonTitle), x: 336, y: 106, maxChars: 30, maxLines: 2, lineHeight: 17, fill: "#F8FAFC", size: 14, weight: 700 }), checks.map((item, idx) => {
      const y = 162 + idx * 28;
      return /* @__PURE__ */ React.createElement("g", { key: idx }, /* @__PURE__ */ React.createElement("rect", { x: "334", y: y - 13, width: "18", height: "18", rx: "4", fill: theme.soft, opacity: "0.26", stroke: theme.chip, strokeWidth: "1.1" }), /* @__PURE__ */ React.createElement(SvgTextBlock, { text: item, x: 364, y, maxChars: 28, maxLines: 1, lineHeight: 16, fill: "#E2E8F0", size: 13, weight: 700 }));
    })));
  }
  function MathVisualDeck({ sub, lessonTitle }) {
    const primary = renderMathPrimaryVisual(sub);
    const cards = primary ? [
      { label: "Core Model", content: primary },
      { label: "Solve Steps", content: /* @__PURE__ */ React.createElement(MathMethodStepsSVG, { sub, lessonTitle }) },
      { label: "Worked Examples", content: /* @__PURE__ */ React.createElement(MathWorkedExamplesSVG, { sub, lessonTitle }) },
      { label: "Problem Practice", content: /* @__PURE__ */ React.createElement(MathPracticePlanSVG, { sub, lessonTitle }) }
    ] : [
      { label: "Textbook Model", content: renderMathTextbookPrimarySVG(sub, lessonTitle) },
      { label: "Solve Steps", content: /* @__PURE__ */ React.createElement(MathMethodStepsSVG, { sub, lessonTitle }) },
      { label: "Worked Examples", content: /* @__PURE__ */ React.createElement(MathWorkedExamplesSVG, { sub, lessonTitle }) },
      { label: "Problem Practice", content: /* @__PURE__ */ React.createElement(MathPracticePlanSVG, { sub, lessonTitle }) }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "math-visual-stack" }, cards.map((card, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "math-visual-panel" }, /* @__PURE__ */ React.createElement("div", { className: "math-visual-label" }, card.label), card.content)));
  }
  function MathSubQuiz({ questions, isUrdu }) {
    const [mqIdx, setMqIdx] = useState(0);
    const [mqAns, setMqAns] = useState([]);
    const [mqRev, setMqRev] = useState(false);
    const [mqDone, setMqDone] = useState(false);
    const mq = questions;
    const currentQ = mq[mqIdx] || {};
    const questionIsUrdu = isUrdu || isUrduText(currentQ.q);
    const mqScore = mqDone ? mqAns.reduce((a, v, i) => a + (v === mq[i]?.c ? 1 : 0), 0) : 0;
    const reset = () => {
      setMqIdx(0);
      setMqAns([]);
      setMqRev(false);
      setMqDone(false);
    };
    const speakText = (txt, e) => {
      if (e) e.stopPropagation();
      if (!isTtsEnabled()) return;
      const ur = isUrduText(txt);
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(ttsClean(txt));
      u.lang = ur ? "ur-PK" : "en-US";
      u.rate = 0.85;
      const v = window.speechSynthesis.getVoices();
      const p = ur ? v.find((x) => x.lang.startsWith("ur")) || v.find((x) => x.lang.startsWith("hi")) || v.find((x) => x.lang.includes("IN")) : v.find((x) => x.lang.startsWith("en") && x.localService) || v.find((x) => x.lang.startsWith("en"));
      if (p) {
        u.voice = p;
        if (ur) u.lang = p.lang;
      }
      window.speechSynthesis.speak(u);
    };
    const playSound = (correct) => {
      try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.connect(gain);
        gain.connect(ac.destination);
        gain.gain.value = 0.15;
        if (correct) {
          osc.frequency.value = 523;
          osc.start();
          osc.frequency.setValueAtTime(659, ac.currentTime + 0.1);
          osc.frequency.setValueAtTime(784, ac.currentTime + 0.2);
          osc.stop(ac.currentTime + 0.35);
        } else {
          osc.frequency.value = 330;
          osc.type = "square";
          osc.start();
          osc.frequency.setValueAtTime(277, ac.currentTime + 0.15);
          osc.stop(ac.currentTime + 0.3);
        }
      } catch (e) {
      }
    };
    if (mqDone) return /* @__PURE__ */ React.createElement("div", { className: "quiz-result" }, /* @__PURE__ */ React.createElement("div", { className: "result-emoji" }, mqScore >= mq.length - 1 ? "\u{1F3C6}" : mqScore >= mq.length / 2 ? "\u{1F31F}" : "\u{1F4AA}"), /* @__PURE__ */ React.createElement("h2", null, mqScore, "/", mq.length, " Correct!"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-secondary)", marginBottom: 16, fontFamily: isUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit", direction: isUrdu ? "rtl" : "ltr" } }, mqScore >= mq.length - 1 ? isUrdu ? "\u0634\u0627\u0628\u0627\u0634! \u0622\u067E \u0646\u06D2 \u06CC\u06C1 \u0645\u0648\u0636\u0648\u0639 \u0633\u06CC\u06A9\u06BE \u0644\u06CC\u0627!" : "Excellent! You mastered this topic!" : mqScore >= mq.length / 2 ? isUrdu ? "\u0627\u0686\u06BE\u0627! \u063A\u0644\u0637 \u062C\u0648\u0627\u0628\u0627\u062A \u062F\u0648\u0628\u0627\u0631\u06C1 \u062F\u06CC\u06A9\u06BE\u06CC\u06BA\u06D4" : "Good job! Review the ones you missed." : isUrdu ? "\u0645\u0634\u0642 \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA!" : "Keep practicing! You'll get better."), /* @__PURE__ */ React.createElement("button", { className: "start-quiz-btn", style: isUrdu ? { fontFamily: "'Noto Nastaliq Urdu',serif" } : {}, onClick: reset }, isUrdu ? "\u{1F504} \u062F\u0648\u0628\u0627\u0631\u06C1 \u06A9\u0648\u0634\u0634" : "\u{1F504} Retry Quiz"));
    return /* @__PURE__ */ React.createElement("div", { className: "quiz-container", style: questionIsUrdu ? { direction: "rtl" } : {} }, /* @__PURE__ */ React.createElement("div", { className: "quiz-progress" }, mq.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "qp-dot" + (i < mqIdx ? " done" : i === mqIdx ? " current" : "") }))), /* @__PURE__ */ React.createElement("div", { className: "quiz-question", onClick: () => speakText(currentQ.q), style: { cursor: "pointer", direction: questionIsUrdu ? "rtl" : "ltr", fontFamily: questionIsUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit", textAlign: questionIsUrdu ? "right" : "left" } }, /* @__PURE__ */ React.createElement("div", { className: "q-num", style: { textAlign: questionIsUrdu ? "right" : "left", marginBottom: 8, fontFamily: questionIsUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, questionIsUrdu ? "\u0633\u0648\u0627\u0644 " + (mqIdx + 1) + " \u0627\u0632 " + mq.length : "Q " + (mqIdx + 1) + " of " + mq.length, " ", /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, opacity: 0.5, marginLeft: 6 } }, "\u{1F508}")), /* @__PURE__ */ React.createElement("h3", { style: { marginTop: 4, fontFamily: questionIsUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, currentQ.q)), /* @__PURE__ */ React.createElement("div", { className: "quiz-options", style: questionIsUrdu ? { direction: "rtl" } : {} }, currentQ.a.map((opt, oi) => {
      const optionIsUrdu = isUrdu || isUrduText(opt);
      const sel = mqAns[mqIdx] === oi, cor = oi === mq[mqIdx].c;
      let cls = "quiz-option";
      if (mqRev && cor) cls += " correct";
      else if (mqRev && sel && !cor) cls += " wrong";
      else if (sel) cls += " selected";
      return /* @__PURE__ */ React.createElement("button", { key: oi, className: cls, disabled: mqRev, style: optionIsUrdu ? { direction: "rtl", fontFamily: "'Noto Nastaliq Urdu',serif", textAlign: "right" } : {}, onClick: () => {
        if (mqRev) return;
        const na = [...mqAns];
        na[mqIdx] = oi;
        setMqAns(na);
        setMqRev(true);
        playSound(oi === mq[mqIdx].c);
        setTimeout(() => {
          if (mqIdx < mq.length - 1) {
            setMqIdx(mqIdx + 1);
            setMqRev(false);
          } else setMqDone(true);
        }, 1200);
      } }, /* @__PURE__ */ React.createElement("span", { className: "opt-letter" }, "ABCD"[oi]), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontFamily: optionIsUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit", direction: optionIsUrdu ? "rtl" : "ltr", textAlign: optionIsUrdu ? "right" : "left" } }, opt), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, opacity: 0.4, marginLeft: 6 }, onClick: (e) => speakText(opt, e) }, "\u{1F508}"));
    })));
  }
  function numToWords(n) {
    if (n === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const scales = ["", "thousand", "million", "billion", "trillion"];
    if (n < 0) return "negative " + numToWords(-n);
    let words = "";
    let scaleIdx = 0;
    while (n > 0) {
      const chunk = n % 1e3;
      if (chunk !== 0) {
        let cw = "";
        const h = Math.floor(chunk / 100), r = chunk % 100;
        if (h > 0) cw += ones[h] + " hundred ";
        if (r > 0) {
          if (h > 0) cw += "and ";
          if (r < 20) cw += ones[r];
          else cw += tens[Math.floor(r / 10)] + (r % 10 ? " " + ones[r % 10] : "");
        }
        words = cw.trim() + (scales[scaleIdx] ? " " + scales[scaleIdx] : "") + (words ? " " : "") + words;
      }
      n = Math.floor(n / 1e3);
      scaleIdx++;
    }
    return words.trim();
  }
  function ttsClean(text) {
    return text.replace(/\[(\d+)\]/g, "$1").replace(/₹|Rs\.?\s*/g, "Rupees ").replace(/→/g, " to ").replace(/\s=\s(?=_{3,}|\[\s*\]|\s*$)/g, " ").replace(/(\d)\s*>\s*(\d)/g, "$1 greater than $2").replace(/(\d)\s*<\s*(\d)/g, "$1 less than $2").replace(/___\s*>\s*/g, " is greater than ").replace(/___\s*<\s*/g, " is less than ").replace(/_{3,}/g, " ").replace(/\b>\b/g, " greater than ").replace(/[≈≥≤]/g, (m) => m === "\u2248" ? " approximately " : m === "\u2265" ? " greater than or equal to " : " less than or equal to ").replace(/×/g, " times ").replace(/÷/g, " divided by ").replace(/←/g, " left ").replace(/↑/g, " up ").replace(/↓/g, " down ").replace(/\d{1,3}(,\d{3})+/g, (m) => numToWords(parseInt(m.replace(/,/g, "")))).replace(/\b\d{4,}\b/g, (m) => numToWords(parseInt(m))).replace(/\s+/g, " ").trim();
  }
  function normalizeHighlightTerm(value) {
    if (value == null) return "";
    return String(value).replace(/\([^)]*\)/g, " ").replace(/[=:_]/g, " ").trim().toLowerCase();
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
    terms.forEach((term) => {
      let from = 0;
      while (from < lower.length) {
        const idx = lower.indexOf(term, from);
        if (idx === -1) break;
        const before = idx === 0 ? "" : text[idx - 1];
        const after = idx + term.length >= text.length ? "" : text[idx + term.length];
        const needsBoundary = /^[a-z ]+$/.test(term);
        if (!needsBoundary || !isAsciiLetter(before) && !isAsciiLetter(after)) {
          matches.push({ start: idx, end: idx + term.length });
        }
        from = idx + term.length;
      }
    });
    const wordMatcher = /[A-Za-z]+(?:'[A-Za-z]+)?/g;
    let wordMatch;
    while ((wordMatch = wordMatcher.exec(text)) !== null) {
      const token = wordMatch[0].toLowerCase();
      if (terms.some((term) => buildWordFamilyForms(term).has(token))) {
        matches.push({ start: wordMatch.index, end: wordMatch.index + wordMatch[0].length });
      }
    }
    if (!matches.length) return text;
    matches.sort((a, b) => a.start - b.start || b.end - b.start - (a.end - a.start));
    const merged = [];
    matches.forEach((match) => {
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
      parts.push(/* @__PURE__ */ React.createElement("span", { key: keyPrefix + "-" + index, style: { color: "#38BDF8", fontWeight: 700 } }, text.slice(match.start, match.end)));
      cursor = match.end;
    });
    if (cursor < text.length) parts.push(text.slice(cursor));
    return /* @__PURE__ */ React.createElement(React.Fragment, null, parts);
  }
  function stripInlineUrduForKnownWords(text, words) {
    const families = (words || []).map((word) => buildWordFamilyForms(word.en)).filter((set) => set.size > 0);
    if (!families.length) return text;
    return String(text).replace(/([A-Za-z]+(?:'[A-Za-z]+)?)\s*\(([^)]*[\u0600-\u06FF][^)]*)\)/g, (full, englishWord) => {
      const token = englishWord.toLowerCase();
      return families.some((set) => set.has(token)) ? englishWord : full;
    });
  }
  function SpeakableSentence({ text, lang = "en", highlight = null, fullWidth = true, buttonStyle = null, textStyle = null }) {
    const [speaking, setSpeaking] = useState(false);
    const handleClick = () => {
      if (!isTtsEnabled()) return;
      window.speechSynthesis.cancel();
      setSpeaking(true);
      const u = new SpeechSynthesisUtterance(ttsClean(text));
      u.lang = lang === "ur" ? "ur-PK" : "en-US";
      u.rate = 0.85;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const pref = lang === "ur" ? voices.find((v) => v.lang.startsWith("ur")) || voices.find((v) => v.lang.startsWith("hi")) || voices.find((v) => v.lang.includes("IN")) : voices.find((v) => v.lang.startsWith("en") && v.localService) || voices.find((v) => v.lang.startsWith("en"));
      if (pref) u.voice = pref;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(u);
    };
    const renderText = () => {
      let t = text;
      const parts = [];
      let lastIdx = 0;
      const symColors = { ">": "#22C55E", "<": "#EF4444", "=": "#38BDF8", "\u2265": "#22C55E", "\u2264": "#EF4444", "\u2248": "#A855F7", "+": "#F59E0B", "\xD7": "#EC4899", "\xF7": "#14B8A6", "\u2192": "#38BDF8", "\u2190": "#38BDF8", "\u2191": "#22C55E", "\u2193": "#EF4444" };
      const re = /\[(\d+)\]|(\d\s*[><=≥≤≈+\-×÷]\s*\d)|(\s[><=≥≤≈]\s)|([→←↑↓])|(___)/g;
      let m;
      while ((m = re.exec(t)) !== null) {
        if (m.index > lastIdx) parts.push(t.slice(lastIdx, m.index));
        if (m[1]) {
          parts.push(/* @__PURE__ */ React.createElement("span", { key: "b" + m.index, style: { display: "inline-block", background: "#F59E0B22", border: "2px solid #F59E0B", borderRadius: 6, padding: "0 5px", color: "#F59E0B", fontWeight: 800, margin: "0 1px" } }, m[1]));
        } else if (m[2]) {
          const inner = m[2];
          const si = inner.search(/[><=≥≤≈+\-×÷]/);
          const sym = inner[si];
          const sc = sym === "-" ? "#EF4444" : symColors[sym] || "#F59E0B";
          parts.push(inner.slice(0, si));
          parts.push(/* @__PURE__ */ React.createElement("span", { key: "s" + m.index, style: { background: sc + "18", borderRadius: 4, padding: "0 4px", color: sc, fontWeight: 800, margin: "0 2px" } }, sym));
          parts.push(inner.slice(si + 1));
        } else if (m[3]) {
          const sym = m[3].trim();
          const sc = symColors[sym] || "#F59E0B";
          parts.push(" ");
          parts.push(/* @__PURE__ */ React.createElement("span", { key: "c" + m.index, style: { background: sc + "18", borderRadius: 4, padding: "0 4px", color: sc, fontWeight: 800, margin: "0 2px" } }, sym));
          parts.push(" ");
        } else if (m[4]) {
          const sym = m[4];
          const sc = symColors[sym] || "#38BDF8";
          parts.push(/* @__PURE__ */ React.createElement("span", { key: "a" + m.index, style: { background: sc + "18", borderRadius: 4, padding: "0 3px", color: sc, fontWeight: 800, margin: "0 2px" } }, sym));
        } else if (m[5]) {
          parts.push(/* @__PURE__ */ React.createElement("span", { key: "u" + m.index, style: { display: "inline-block", borderBottom: "3px solid #F59E0B", minWidth: 50, margin: "0 4px" } }, "\xA0\xA0\xA0\xA0"));
        }
        lastIdx = m.index + m[0].length;
      }
      if (parts.length > 0) {
        if (lastIdx < t.length) parts.push(t.slice(lastIdx));
        return /* @__PURE__ */ React.createElement(React.Fragment, null, parts);
      }
      return renderHighlightText(text, highlight, "sentence");
    };
    return /* @__PURE__ */ React.createElement("button", { onClick: handleClick, style: { display: fullWidth ? "block" : "inline-block", width: fullWidth ? "100%" : "auto", maxWidth: "100%", textAlign: lang === "ur" ? "right" : "left", padding: "12px 16px", marginBottom: 6, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid rgba(148,163,184,0.15)", background: speaking ? "rgba(56,189,248,0.12)" : "rgba(30,41,59,0.6)", color: speaking ? "#38BDF8" : "#F1F5F9", fontFamily: lang === "ur" ? "'Noto Nastaliq Urdu', serif" : "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: lang === "ur" ? "rtl" : "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : "none", position: "relative", ...buttonStyle } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: lang === "ur" ? "auto" : 12, left: lang === "ur" ? 12 : "auto", top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" } }, speaking ? "\u{1F50A}" : "\u{1F508}"), /* @__PURE__ */ React.createElement("span", { style: { paddingRight: lang === "ur" ? 0 : 28, paddingLeft: lang === "ur" ? 28 : 0, ...textStyle } }, renderText()));
  }
  function MixedUrduParagraphSentence({ text, highlight = null }) {
    const [speaking, setSpeaking] = useState(false);
    const handleClick = () => {
      if (!isTtsEnabled()) return;
      window.speechSynthesis.cancel();
      setSpeaking(true);
      const u = new SpeechSynthesisUtterance(ttsClean(text));
      u.lang = "en-US";
      u.rate = 0.85;
      u.pitch = 1.05;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((v) => v.lang.startsWith("en") && v.localService) || voices.find((v) => v.lang.startsWith("en"));
      if (pref) u.voice = pref;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
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
          parts.push(/* @__PURE__ */ React.createElement(React.Fragment, { key: "txt-" + match.index }, renderHighlighted(text.slice(lastIdx, match.index), "txt-" + match.index)));
        }
        parts.push(
          /* @__PURE__ */ React.createElement("span", { key: "ur-" + match.index }, "(", /* @__PURE__ */ React.createElement("span", { style: { fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", unicodeBidi: "isolate", textAlign: "right", color: "#C4B5FD" } }, match[1]), ")")
        );
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < text.length) {
        parts.push(/* @__PURE__ */ React.createElement(React.Fragment, { key: "tail" }, renderHighlighted(text.slice(lastIdx), "tail")));
      }
      return parts.length ? /* @__PURE__ */ React.createElement(React.Fragment, null, parts) : renderHighlighted(text, "full");
    };
    return /* @__PURE__ */ React.createElement("button", { onClick: handleClick, style: { display: "block", width: "100%", maxWidth: "100%", textAlign: "left", padding: "12px 16px", marginBottom: 6, borderRadius: 10, border: speaking ? "2px solid #38BDF8" : "1px solid rgba(148,163,184,0.15)", background: speaking ? "rgba(56,189,248,0.12)" : "rgba(30,41,59,0.6)", color: speaking ? "#38BDF8" : "#F1F5F9", fontFamily: "'Baloo 2', sans-serif", fontSize: 18, lineHeight: 1.7, cursor: "pointer", transition: "all 0.25s", direction: "ltr", boxShadow: speaking ? "0 0 16px rgba(56,189,248,0.2)" : "none", position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: speaking ? 1 : 0.4, transition: "opacity 0.2s" } }, speaking ? "\u{1F50A}" : "\u{1F508}"), /* @__PURE__ */ React.createElement("span", { style: { paddingRight: 28 } }, renderText()));
  }
  function formatListedAnswer(text) {
    if (typeof text !== "string") return text;
    return text.replace(/(\d+\.)\s+/g, (match, marker, offset) => offset === 0 ? `${marker} ` : `
${marker} `);
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
  function shortPromptLabel(text, isUrdu) {
    const words = trimQuestionText(text).split(/\s+/).filter(Boolean);
    const maxWords = isUrdu ? 6 : 7;
    const label = words.slice(0, maxWords).join(" ");
    return words.length > maxWords ? label + "\u2026" : label;
  }
  function capitalizeFirst(text) {
    const value = String(text || "").trim();
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
  }
  function buildPromptCue(text, isUrdu) {
    const clean = trimQuestionText(text);
    if (!clean) return "";
    if (isUrdu) {
      return clean.replace(/^(کیا|کون|کہاں|کب|کتنے|کس|نام)\s+/u, "").replace(/\s+(کیا ہے|کون ہے|کہاں ہے|کب ہوا|کتنے ہیں)$/u, "").trim();
    }
    return clean.replace(/^(what|which|who|where|when|why|how many|how much|name|list|identify|define|write)\s+/i, "").trim();
  }
  function buildEnglishAnswerSentence(prompt, valueText) {
    const clean = trimQuestionText(prompt);
    let match;
    if (match = clean.match(/^What is (.+)$/i)) return `${capitalizeFirst(match[1])} is ${valueText}.`;
    if (match = clean.match(/^What are (.+)$/i)) return `${capitalizeFirst(match[1])} are ${valueText}.`;
    if (match = clean.match(/^Who is (.+)$/i)) return `${capitalizeFirst(match[1])} is ${valueText}.`;
    if (match = clean.match(/^Who was (.+)$/i)) return `${capitalizeFirst(match[1])} was ${valueText}.`;
    if (match = clean.match(/^Where is (.+)$/i)) return `${capitalizeFirst(match[1])} is located in ${valueText}.`;
    if (match = clean.match(/^Where are (.+)$/i)) return `${capitalizeFirst(match[1])} are located in ${valueText}.`;
    if (match = clean.match(/^When did (.+?) become (.+)$/i)) return `${capitalizeFirst(match[1])} became ${match[2]} in ${valueText}.`;
    if (match = clean.match(/^When did (.+?) begin$/i)) return `${capitalizeFirst(match[1])} began in ${valueText}.`;
    if (match = clean.match(/^When did (.+?) start$/i)) return `${capitalizeFirst(match[1])} started in ${valueText}.`;
    if (match = clean.match(/^When did (.+?) happen$/i)) return `${capitalizeFirst(match[1])} happened in ${valueText}.`;
    if (match = clean.match(/^Which (.+?) is (.+)$/i)) return `The ${match[1]} that is ${match[2]} is ${valueText}.`;
    if (match = clean.match(/^Which (.+?) are (.+)$/i)) return `The ${match[1]} that are ${match[2]} are ${valueText}.`;
    if (match = clean.match(/^How many (.+)$/i)) return `${capitalizeFirst(match[1])}: ${valueText}.`;
    if (match = clean.match(/^(Name|List|Identify|Write) (.+)$/i)) return `${capitalizeFirst(match[2])}: ${valueText}.`;
    return `${shortPromptLabel(buildPromptCue(clean, false) || clean, false)}: ${valueText}`;
  }
  function buildUrduAnswerSentence(prompt, valueText) {
    const clean = trimQuestionText(prompt);
    let match;
    if (match = clean.match(/^(.+)\s+کیا ہے$/u)) return `${match[1]} ${valueText} \u06C1\u06D2\u06D4`;
    if (match = clean.match(/^(.+)\s+کون ہے$/u)) return `${match[1]} ${valueText} \u06C1\u06D2\u06D4`;
    if (match = clean.match(/^(.+)\s+کون تھا$/u)) return `${match[1]} ${valueText} \u062A\u06BE\u0627\u06D4`;
    if (match = clean.match(/^(.+)\s+کہاں ہے$/u)) return `${match[1]} ${valueText} \u0645\u06CC\u06BA \u06C1\u06D2\u06D4`;
    if (match = clean.match(/^(.+)\s+کتنے ہیں$/u)) return `${match[1]} ${valueText} \u06C1\u06CC\u06BA\u06D4`;
    if (match = clean.match(/^(.+)\s+کب ہوا$/u)) return `${match[1]} ${valueText} \u0645\u06CC\u06BA \u06C1\u0648\u0627\u06D4`;
    if (match = clean.match(/^نام لکھیں[: ]*(.+)$/u)) return `${match[1]}: ${valueText}`;
    return `${shortPromptLabel(buildPromptCue(clean, true) || clean, true)}: ${valueText}`;
  }
  function getExerciseKind(question) {
    const q = String(question || "");
    const lower = q.toLowerCase();
    if (lower.includes("fill in the blank") || q.includes("\u062E\u0627\u0644\u06CC \u062C\u06AF\u06C1")) return "fill";
    if (lower.includes("true or false") || q.includes("\u062F\u0631\u0633\u062A \u06CC\u0627 \u063A\u0644\u0637")) return "tf";
    if (lower.includes("match the columns") || q.includes("\u06A9\u0627\u0644\u0645 \u0645\u0644\u0627\u0626\u06CC\u06BA")) return "match";
    return null;
  }
  function buildSeedPairs(sub) {
    const pairs = [];
    const pushPair = (prompt, answer) => {
      const cleanPrompt = trimQuestionText(prompt);
      const cleanAnswer = normalizeText(answer);
      if (!cleanPrompt || !cleanAnswer) return;
      const key = cleanPrompt + "||" + cleanAnswer;
      if (!pairs.some((p) => p.key === key)) pairs.push({ key, prompt: cleanPrompt, answer: cleanAnswer });
    };
    (sub.exercises || []).forEach((ex) => {
      if (!Array.isArray(ex.parts) || !Array.isArray(ex.ans)) return;
      ex.parts.forEach((part, index) => pushPair(part, ex.ans[index]));
    });
    (sub.quiz || []).forEach((item) => {
      if (!item || !Array.isArray(item.a) || typeof item.c !== "number") return;
      pushPair(item.q, item.a[item.c]);
    });
    (sub.wordProblems || []).forEach((item) => {
      if (item && typeof item === "object" && item.q && item.a) pushPair(item.q, item.a);
    });
    return pairs;
  }
  function buildFillPrompt(pair, isUrdu) {
    return isUrdu ? buildUrduAnswerSentence(pair.prompt, "___") : buildEnglishAnswerSentence(pair.prompt, "___");
  }
  function buildTrueFalseStatement(pair, answerText, isUrdu) {
    return isUrdu ? buildUrduAnswerSentence(pair.prompt, answerText) : buildEnglishAnswerSentence(pair.prompt, answerText);
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
        ans.push(isUrdu ? useFalse ? "\u063A\u0644\u0637" : "\u062F\u0631\u0633\u062A" : useFalse ? "False" : "True");
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
    return String(text || "").split(/(?<=[.!?۔؟])\s+/).map((s2) => normalizeText(s2)).filter(Boolean);
  }
  function buildScienceTrueFalseFacts(sub, isUrdu) {
    const facts = [];
    const seen = /* @__PURE__ */ new Set();
    const addFact = (text) => {
      const clean = normalizeText(text);
      if (!clean) return;
      const key = clean.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      facts.push({ part: clean, ans: isUrdu ? "\u062F\u0631\u0633\u062A" : "True" });
    };
    (sub.examples || []).forEach(addFact);
    splitFactSentences(sub.c).forEach(addFact);
    (sub.wordProblems || []).forEach((item) => {
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
    const existing = new Set(currentParts.map((p) => normalizeText(p).toLowerCase()));
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
      parts: currentParts.map((part) => String(part || "").replace(/^Question\s+\d+:\s*/i, "").replace(/^سوال\s+\d+:\s*/i, ""))
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
      fill: isUrdu ? "\u062E\u0627\u0644\u06CC \u062C\u06AF\u06C1\u06CC\u06BA \u067E\u064F\u0631 \u06A9\u0631\u06CC\u06BA:" : "Fill in the blanks:",
      tf: isUrdu ? "\u062F\u0631\u0633\u062A \u06CC\u0627 \u063A\u0644\u0637:" : "True or False:",
      match: isUrdu ? "\u06A9\u0627\u0644\u0645 \u0645\u0644\u0627\u0626\u06CC\u06BA:" : "Match the columns:"
    };
    const pairs = buildSeedPairs(sub);
    const seenKinds = /* @__PURE__ */ new Set();
    const exercises = sub.exercises.map((ex) => {
      const kind = getExerciseKind(ex.q);
      if (!kind || seenKinds.has(kind)) return ex;
      seenKinds.add(kind);
      let ensured = isScience && kind === "tf" ? ensureScienceTrueFalseCount(ex, sub, isUrdu) : ensureExerciseCount(ex, kind, pairs, isUrdu);
      if (kind === "match") ensured = stripMatchPrefixes(ensured);
      return { ...ensured, q: canonicalLabels[kind] };
    });
    ["fill", "tf", "match"].forEach((kind) => {
      if (seenKinds.has(kind) || !pairs.length) return;
      if (isScience && kind === "tf") {
        const generated2 = ensureScienceTrueFalseCount({ q: canonicalLabels[kind], parts: [], ans: [] }, sub, isUrdu);
        exercises.push({ q: canonicalLabels[kind], parts: generated2.parts, ans: generated2.ans });
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
    return isUrdu ? `\u062F\u0646 ${dayNumber}` : `Day ${dayNumber}`;
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
    if (settingKey === "wordOpposites") {
      if (kind === "fill") return isUrdu ? `"${normalizedPrompt}" \u06A9\u0627 \u0645\u062A\u0636\u0627\u062F ___ \u06C1\u06D2` : `Opposite of "${normalizedPrompt}" is ___`;
      if (kind === "tf") return `${normalizedPrompt}: ${normalizedAnswer}`;
      return normalizedPrompt;
    }
    return kind === "fill" ? `${normalizedPrompt} = ___` : kind === "tf" ? `${normalizedPrompt}: ${normalizedAnswer}` : normalizedPrompt;
  }
  function buildDaySectionQuestion(prompt, settingKey, isUrdu) {
    const normalizedPrompt = normalizeText(prompt);
    if (settingKey === "wordOpposites") {
      return isUrdu ? `"${normalizedPrompt}" \u06A9\u0627 \u0645\u062A\u0636\u0627\u062F \u06A9\u06CC\u0627 \u06C1\u06D2\u061F` : `What is the opposite of "${normalizedPrompt}"?`;
    }
    if (settingKey === "sentences") {
      return isUrdu ? `"${normalizedPrompt}" \u06A9\u0627 \u0627\u0631\u062F\u0648 \u062A\u0631\u062C\u0645\u06C1 \u06A9\u06CC\u0627 \u06C1\u06D2\u061F` : `What is the Urdu translation of "${normalizedPrompt}"?`;
    }
    return isUrdu ? `"${normalizedPrompt}" \u06A9\u0627 \u0627\u0631\u062F\u0648 \u0645\u0637\u0644\u0628 \u06A9\u06CC\u0627 \u06C1\u06D2\u061F` : `What is the Urdu meaning of "${normalizedPrompt}"?`;
  }
  function buildDaySectionExercises(dayEntry, settingKey, subjectId) {
    const isUrdu = subjectId === "urdu";
    const pairs = buildDaySectionPairs(dayEntry, settingKey);
    if (!pairs.length) return [];
    const fillLabel = isUrdu ? settingKey === "wordOpposites" ? "\u062E\u0627\u0644\u06CC \u062C\u06AF\u06C1\u06CC\u06BA \u067E\u064F\u0631 \u06A9\u0631\u06CC\u06BA:" : "\u0635\u062D\u06CC\u062D \u0645\u0639\u0646\u06CC \u0633\u06D2 \u062E\u0627\u0644\u06CC \u062C\u06AF\u06C1\u06CC\u06BA \u067E\u064F\u0631 \u06A9\u0631\u06CC\u06BA:" : settingKey === "wordOpposites" ? "Fill in the blanks:" : "Fill in the blanks with correct meaning:";
    const tfLabel = isUrdu ? "\u062F\u0631\u0633\u062A \u06CC\u0627 \u063A\u0644\u0637:" : "True or False:";
    const matchLabel = isUrdu ? "\u06A9\u0627\u0644\u0645 \u0645\u0644\u0627\u0626\u06CC\u06BA:" : "Match the columns:";
    const partsFill = pairs.map((pair) => buildDaySectionPrompt("fill", pair.prompt, pair.answer, settingKey, isUrdu));
    const ansFill = pairs.map((pair) => pair.answer);
    const partsTf = pairs.map((pair, index) => {
      const alternate = pairs[(index + 1) % pairs.length];
      const useFalse = index % 2 === 1 && alternate && alternate.answer !== pair.answer;
      return buildDaySectionPrompt("tf", pair.prompt, useFalse ? alternate.answer : pair.answer, settingKey, isUrdu);
    });
    const ansTf = pairs.map((_, index) => isUrdu ? index % 2 === 1 ? "\u063A\u0644\u0637" : "\u062F\u0631\u0633\u062A" : index % 2 === 1 ? "False" : "True");
    const partsMatch = pairs.map((pair) => buildDaySectionPrompt("match", pair.prompt, pair.answer, settingKey, isUrdu));
    const ansMatch = pairs.map((pair) => pair.answer);
    return [
      { q: fillLabel, parts: partsFill, ans: ansFill },
      { q: tfLabel, parts: partsTf, ans: ansTf },
      { q: matchLabel, parts: partsMatch, ans: ansMatch }
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
        c: shuffled.indexOf(pair.answer)
      };
    });
  }
  function buildDerivedDayBasedSub(sub, settingKey, itemsPerDay, subjectId) {
    if (!sub || !Array.isArray(sub.dayLessons)) return sub;
    const adjustedDayLessons = regroupDayEntries(sub.dayLessons, itemsPerDay);
    const exerciseGroups = adjustedDayLessons.map((lessonDay) => ({
      label: formatDerivedDayLabel(lessonDay, subjectId === "urdu"),
      exercises: buildDaySectionExercises(lessonDay, settingKey, subjectId)
    }));
    const quizGroups = adjustedDayLessons.map((lessonDay) => ({
      label: formatDerivedDayLabel(lessonDay, subjectId === "urdu"),
      questions: buildDaySectionQuiz(lessonDay, settingKey, subjectId)
    }));
    return {
      ...sub,
      dayLessons: adjustedDayLessons,
      exerciseGroups,
      quizGroups
    };
  }
  function buildDerivedSentenceSub(subs, itemsPerDay, subjectId) {
    const sentencePairs = [];
    (subs || []).forEach((sub) => {
      (sub.sentencePairs || []).forEach((pair) => sentencePairs.push(pair));
    });
    const groups = regroupSentencePairs(sentencePairs, itemsPerDay);
    return groups.map((group) => ({
      t: subjectId === "urdu" ? `\u062C\u0645\u0644\u06D2 \u062F\u0646 ${group.day}` : `Sentences Day ${group.day}`,
      c: subjectId === "urdu" ? "\u0631\u0648\u0632\u0645\u0631\u06C1 \u0627\u0633\u062A\u0639\u0645\u0627\u0644 \u06A9\u06D2 \u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u062C\u0645\u0644\u06D2 \u0627\u0648\u0631 \u0627\u0646 \u06A9\u06D2 \u0627\u0631\u062F\u0648 \u062A\u0631\u062C\u0645\u06D2 \u067E\u0691\u06BE\u06CC\u06BA\u06D4" : "Read daily-use English sentences with Urdu translations. Practice only this grouped set in the exercises and quiz.",
      examplesLabel: subjectId === "urdu" ? "\u{1F5E3}\uFE0F \u062C\u0645\u0644\u06D2" : "\u{1F5E3}\uFE0F Sentences",
      sentencePairs: group.sentencePairs,
      exercises: buildDaySectionExercises(group, "sentences", subjectId),
      quiz: buildDaySectionQuiz(group, "sentences", subjectId)
    }));
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
      return /* @__PURE__ */ React.createElement("span", { style: badgeStyle }, /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 22 22", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("line", { x1: "15", y1: "3", x2: "15", y2: "18", stroke: "#CBD5E1", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "8", r: "3.6", fill: "none", stroke: "#F59E0B", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("line", { x1: "11", y1: "11.6", x2: "11", y2: "16.5", stroke: "#CBD5E1", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("rect", { x: "8.1", y: "16.5", width: "5.8", height: "2.8", rx: "1.2", fill: "#F59E0B", opacity: "0.28", stroke: "#F59E0B", strokeWidth: "1.1" }), /* @__PURE__ */ React.createElement("line", { x1: "15", y1: "5", x2: "18.2", y2: "6.8", stroke: "#22C55E", strokeWidth: "1.8" }), /* @__PURE__ */ React.createElement("polygon", { points: "18.6,6.9 16.6,5.8 16.8,8.1", fill: "#22C55E" })));
    }
    const icon = lower.includes("seesaw") ? "\u2696\uFE0F" : lower.includes("doorknob") ? "\u{1F6AA}" : lower.includes("wheelchair ramp") ? "\u267F" : lower.includes("axe blade") ? "\u{1FA93}" : lower.includes("screw in wood") ? "\u{1F529}" : lower.includes("scissors") ? "\u2702\uFE0F" : lower.includes("slide") ? "\u{1F6DD}" : null;
    return icon ? /* @__PURE__ */ React.createElement("span", { style: { ...badgeStyle, fontSize: 18 } }, icon) : null;
  }
  function WordRow({ en, ur }) {
    const [sEn, setSEn] = useState(false);
    const [sUr, setSUr] = useState(false);
    const [sBoth, setSBoth] = useState(false);
    const getEnglishVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      return voices.find((v) => v.lang.startsWith("en") && v.localService) || voices.find((v) => v.lang.startsWith("en"));
    };
    const getUrduVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      return voices.find((v) => v.lang.startsWith("ur")) || voices.find((v) => v.lang.startsWith("hi")) || voices.find((v) => v.lang.includes("IN"));
    };
    const speakEn = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSEn(true);
      const u = new SpeechSynthesisUtterance(ttsClean(en));
      u.lang = "en-US";
      u.rate = 0.8;
      const pref = getEnglishVoice();
      if (pref) u.voice = pref;
      u.onend = () => setSEn(false);
      u.onerror = () => setSEn(false);
      window.speechSynthesis.speak(u);
    };
    const speakUr = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSUr(true);
      const u = new SpeechSynthesisUtterance(ur);
      u.lang = "ur-PK";
      u.rate = 0.8;
      const pref = getUrduVoice();
      if (pref) {
        u.voice = pref;
        u.lang = pref.lang;
      }
      u.onend = () => setSUr(false);
      u.onerror = () => setSUr(false);
      window.speechSynthesis.speak(u);
    };
    const speakBoth = () => {
      if (!isTtsEnabled()) return;
      window.speechSynthesis.cancel();
      setSBoth(true);
      setSEn(true);
      setSUr(false);
      const enUtter = new SpeechSynthesisUtterance(ttsClean(en));
      enUtter.lang = "en-US";
      enUtter.rate = 0.8;
      const enVoice = getEnglishVoice();
      if (enVoice) enUtter.voice = enVoice;
      enUtter.onend = () => {
        setSEn(false);
        setSUr(true);
        const urUtter = new SpeechSynthesisUtterance(ur);
        urUtter.lang = "ur-PK";
        urUtter.rate = 0.8;
        const urVoice = getUrduVoice();
        if (urVoice) {
          urUtter.voice = urVoice;
          urUtter.lang = urVoice.lang;
        }
        urUtter.onend = () => {
          setSUr(false);
          setSBoth(false);
        };
        urUtter.onerror = () => {
          setSUr(false);
          setSBoth(false);
        };
        window.speechSynthesis.speak(urUtter);
      };
      enUtter.onerror = () => {
        setSEn(false);
        setSUr(false);
        setSBoth(false);
      };
      window.speechSynthesis.speak(enUtter);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "word-row", onClick: speakBoth, style: { cursor: "pointer", boxShadow: sBoth ? "0 0 0 1px rgba(56,189,248,0.22)" : "none", transition: "box-shadow 0.2s" } }, /* @__PURE__ */ React.createElement("span", { className: "word-en" + (sEn ? " word-active" : ""), onClick: speakEn, style: { cursor: "pointer", color: sEn ? "#38BDF8" : void 0, transition: "color 0.2s" } }, en, " ", sEn ? "\u{1F50A}" : "\u{1F508}"), /* @__PURE__ */ React.createElement("span", { className: "word-ur" + (sUr ? " word-active" : ""), onClick: speakUr, style: { cursor: "pointer", color: sUr ? "#38BDF8" : void 0, transition: "color 0.2s" } }, sUr ? "\u{1F50A}" : "\u{1F508}", " ", ur));
  }
  function OppositeWordRow({ en, ur, opposite, oppositeUr }) {
    const cardStyle = {
      background: "rgba(15,23,42,0.45)",
      border: "1px solid rgba(148,163,184,0.18)",
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 6
    };
    const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#94A3B8", textTransform: "uppercase" };
    return /* @__PURE__ */ React.createElement("div", { className: "word-row", style: { cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: cardStyle }, /* @__PURE__ */ React.createElement("span", { style: labelStyle }, "Word"), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: en, lang: "en", fullWidth: false, buttonStyle: { background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.28)", color: "#E0F2FE", justifyContent: "flex-start" } }), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: ur, lang: "ur", fullWidth: false, buttonStyle: { background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: "#DCFCE7", justifyContent: "flex-start" }, textStyle: { fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" } })), /* @__PURE__ */ React.createElement("div", { style: cardStyle }, /* @__PURE__ */ React.createElement("span", { style: labelStyle }, "Opposite"), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: opposite, lang: "en", fullWidth: false, buttonStyle: { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.28)", color: "#FEF3C7", justifyContent: "flex-start" } }), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: oppositeUr, lang: "ur", fullWidth: false, buttonStyle: { background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.30)", color: "#F3E8FF", justifyContent: "flex-start" }, textStyle: { fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" } }))));
  }
  function SentencePairRow({ en, ur }) {
    const cardStyle = {
      background: "rgba(15,23,42,0.45)",
      border: "1px solid rgba(148,163,184,0.18)",
      borderRadius: 12,
      padding: "10px 12px",
      display: "flex",
      flexDirection: "column",
      gap: 8
    };
    const labelStyle = { fontSize: 11, fontWeight: 800, letterSpacing: 0.5, color: "#94A3B8", textTransform: "uppercase" };
    return /* @__PURE__ */ React.createElement("div", { className: "word-row", style: { cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: cardStyle }, /* @__PURE__ */ React.createElement("span", { style: labelStyle }, "English Sentence"), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: en, lang: "en", buttonStyle: { background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.24)", color: "#E0F2FE", marginBottom: 0 } }), /* @__PURE__ */ React.createElement("span", { style: { ...labelStyle, color: "#22C55E", marginTop: 2 } }, "Urdu Translation"), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: ur, lang: "ur", buttonStyle: { background: "rgba(34,197,94,0.10)", border: "1px solid rgba(34,197,94,0.26)", color: "#DCFCE7", marginBottom: 0 }, textStyle: { fontFamily: "'Noto Nastaliq Urdu', serif", direction: "rtl", textAlign: "right" } })));
  }
  function AdjWordRow({ en, ur, comp, sup }) {
    const [sEn, setSEn] = useState(false);
    const [sUr, setSUr] = useState(false);
    const speakEn = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSEn(true);
      const txt = en + ". " + comp + ". " + sup + ".";
      const u = new SpeechSynthesisUtterance(ttsClean(txt));
      u.lang = "en-US";
      u.rate = 0.75;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((v) => v.lang.startsWith("en") && v.localService) || voices.find((v) => v.lang.startsWith("en"));
      if (pref) u.voice = pref;
      u.onend = () => setSEn(false);
      u.onerror = () => setSEn(false);
      window.speechSynthesis.speak(u);
    };
    const speakUr = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSUr(true);
      const u = new SpeechSynthesisUtterance(ur);
      u.lang = "ur-PK";
      u.rate = 0.8;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((v) => v.lang.startsWith("ur")) || voices.find((v) => v.lang.startsWith("hi")) || voices.find((v) => v.lang.includes("IN"));
      if (pref) {
        u.voice = pref;
        u.lang = pref.lang;
      }
      u.onend = () => setSUr(false);
      u.onerror = () => setSUr(false);
      window.speechSynthesis.speak(u);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "word-row", style: { cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { onClick: speakEn, style: { cursor: "pointer", color: sEn ? "#38BDF8" : "#F1F5F9", fontWeight: 700, fontSize: 15, transition: "color 0.2s" } }, en, " \u2192 ", comp, " \u2192 ", sup, " ", sEn ? "\u{1F50A}" : "\u{1F508}"), /* @__PURE__ */ React.createElement("span", { onClick: speakUr, style: { cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s" } }, sUr ? "\u{1F50A}" : "\u{1F508}", " ", ur)));
  }
  function VerbWordRow({ en, ur, v2, v3 }) {
    const [sEn, setSEn] = useState(false);
    const [sUr, setSUr] = useState(false);
    const speakEn = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSEn(true);
      const txt = en + ". " + v2 + ". " + v3 + ".";
      const u = new SpeechSynthesisUtterance(ttsClean(txt));
      u.lang = "en-US";
      u.rate = 0.75;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((v) => v.lang.startsWith("en") && v.localService) || voices.find((v) => v.lang.startsWith("en"));
      if (pref) u.voice = pref;
      u.onend = () => setSEn(false);
      u.onerror = () => setSEn(false);
      window.speechSynthesis.speak(u);
    };
    const speakUr = (e) => {
      if (!isTtsEnabled()) return;
      e.stopPropagation();
      window.speechSynthesis.cancel();
      setSUr(true);
      const u = new SpeechSynthesisUtterance(ur);
      u.lang = "ur-PK";
      u.rate = 0.8;
      const voices = window.speechSynthesis.getVoices();
      const pref = voices.find((v) => v.lang.startsWith("ur")) || voices.find((v) => v.lang.startsWith("hi")) || voices.find((v) => v.lang.includes("IN"));
      if (pref) {
        u.voice = pref;
        u.lang = pref.lang;
      }
      u.onend = () => setSUr(false);
      u.onerror = () => setSUr(false);
      window.speechSynthesis.speak(u);
    };
    return /* @__PURE__ */ React.createElement("div", { className: "word-row", style: { cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 6 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { onClick: speakEn, style: { cursor: "pointer", color: sEn ? "#38BDF8" : "#F1F5F9", fontWeight: 700, fontSize: 15, transition: "color 0.2s" } }, en, " \u2192 ", v2, " \u2192 ", v3, " ", sEn ? "\u{1F50A}" : "\u{1F508}"), /* @__PURE__ */ React.createElement("span", { onClick: speakUr, style: { cursor: "pointer", color: sUr ? "#38BDF8" : "var(--text-secondary)", fontFamily: "'Noto Nastaliq Urdu', serif", fontSize: 14, direction: "rtl", transition: "color 0.2s" } }, sUr ? "\u{1F50A}" : "\u{1F508}", " ", ur)));
  }
  function HomeschoolApp() {
    const stored = loadState();
    const versionManagerRef = useRef(window.DataVersionManager ? new window.DataVersionManager(window.HomeSchoolDB) : null);
    const persistCustomizationRef = useRef(null);
    const [language, setLanguage] = useState(stored?.language || "bilingual");
    const [themeMode, setThemeMode] = useState(stored?.themeMode || "system");
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
    const [chatMessages, setChatMessages] = useState([{ role: "ai", text: "Assalam-o-Alaikum! \u{1F44B} I'm your AI tutor. Ask me anything about your lessons \u2014 I'll explain it in a way that's easy to understand!" }]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [currentVersion, setCurrentVersion] = useState(window.HomeSchoolData.VERSION);
    const [updateAvailable, setUpdateAvailable] = useState(false);
    const [ttsEnabled, setTtsEnabled] = useState(stored?.ttsEnabled ?? true);
    const [storageLabel, setStorageLabel] = useState("IndexedDB + localStorage");
    const [reviewStats, setReviewStats] = useState({ due: 0, mastered: 0, learning: 0, reviewedToday: 0, retentionRate: 0, reviewStreak: 0 });
    const [reviewQueue, setReviewQueue] = useState([]);
    const [reviewIdx, setReviewIdx] = useState(0);
    const [reviewReveal, setReviewReveal] = useState(false);
    const [reviewSessionDone, setReviewSessionDone] = useState(false);
    const [reviewSessionXp, setReviewSessionXp] = useState(0);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [resolvedTheme, setResolvedTheme] = useState(getResolvedTheme(stored?.themeMode || "system"));
    const [installPromptEvent, setInstallPromptEvent] = useState(null);
    const [installAvailability, setInstallAvailability] = useState(isStandaloneMode() ? "installed" : "unavailable");
    const [installBannerDismissed, setInstallBannerDismissed] = useState(Boolean(stored?.installBannerDismissed));
    const [isInstalled, setIsInstalled] = useState(isStandaloneMode());
    const [serviceWorkerStatus, setServiceWorkerStatus] = useState(window.location.protocol === "file:" ? "local-static" : "checking");
    const [isOnline, setIsOnline] = useState(navigator.onLine !== false);
    const chatEndRef = useRef(null);
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
      transition: "all 0.2s"
    };
    const getRevealToggleStyle = (revealed, isUr) => ({
      ...revealToggleBaseStyle,
      border: `1.5px solid ${revealed ? "#22C55E55" : "var(--border)"}`,
      background: revealed ? isLightTheme ? "rgba(34,197,94,0.14)" : "rgba(34,197,94,0.12)" : "var(--bg-elevated)",
      color: revealed ? isLightTheme ? "#166534" : "#22C55E" : "var(--text-secondary)",
      fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif"
    });
    const revealedAnswerButtonStyle = {
      background: isLightTheme ? "rgba(34,197,94,0.16)" : "rgba(34,197,94,0.14)",
      border: "1px solid rgba(34,197,94,0.35)",
      color: isLightTheme ? "#14532D" : "#ECFDF5",
      padding: "8px 14px"
    };
    const getRevealedAnswerTextStyle = (isUrdu) => ({
      fontSize: 16,
      lineHeight: 1.5,
      whiteSpace: "pre-line",
      fontFamily: isUrdu ? "'Noto Nastaliq Urdu',serif" : "inherit",
      direction: isUrdu ? "rtl" : "ltr",
      textAlign: isUrdu ? "right" : "left",
      color: isLightTheme ? "#14532D" : void 0
    });
    const wordProblemAnswerPanelStyle = {
      background: isLightTheme ? "rgba(34,197,94,0.10)" : "rgba(34,197,94,0.08)",
      border: "1px solid rgba(34,197,94,0.28)",
      borderRadius: 12,
      padding: "10px 10px 6px"
    };
    const wordProblemAnswerLabelStyle = (isUr) => ({
      color: isLightTheme ? "#166534" : "#86EFAC",
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      marginBottom: 6,
      fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif"
    });
    const reviewRevealCardStyle = {
      padding: "16px 18px",
      borderRadius: 16,
      background: "var(--bg-elevated)",
      border: "1px solid var(--border)",
      marginBottom: 16
    };
    const reviewAnswerButtonStyle = {
      marginBottom: 8,
      background: isLightTheme ? "rgba(34,197,94,0.14)" : "rgba(51,65,85,0.5)",
      border: "1px solid var(--border)",
      color: "var(--text-primary)"
    };
    const reviewExampleButtonStyle = {
      marginBottom: 0,
      background: isLightTheme ? "rgba(2,132,199,0.08)" : "rgba(30,41,59,0.42)",
      border: "1px solid var(--border)",
      color: "var(--text-secondary)"
    };
    const refreshStorageLabel = useCallback(async () => {
      if (!window.HomeSchoolDB) {
        setStorageLabel(await getStorageEstimateLabel("localStorage"));
        return;
      }
      const stats = await window.HomeSchoolDB.getStats();
      const quotaLabel = await getStorageEstimateLabel(`IndexedDB \u2022 ${stats.coreData || 0} lessons`);
      const lessonCountLabel = joinLocalizedText(`${stats.coreData || 0} lessons`, `${stats.coreData || 0} \u0627\u0633\u0628\u0627\u0642`, language);
      setStorageLabel(`${quotaLabel} \u2022 ${lessonCountLabel}`);
    }, [language]);
    const refreshReviewStats = useCallback(async () => {
      if (!window.HomeSchoolDB) return;
      const nextStats = await window.HomeSchoolDB.getReviewStats();
      setReviewStats(nextStats);
    }, []);
    if (!persistCustomizationRef.current) {
      persistCustomizationRef.current = debounce(async (nextPayload) => {
        if (!window.HomeSchoolDB) return;
        try {
          await window.HomeSchoolDB.saveCustomization("preferences", {
            ttsEnabled: nextPayload.ttsEnabled,
            language: nextPayload.language,
            themeMode: nextPayload.themeMode
          });
          await window.HomeSchoolDB.saveCustomization("reviewPreferences", {
            dailyReviewCap: nextPayload.dailyReviewCap
          });
          await window.HomeSchoolDB.saveCustomization("daySectionPacing", nextPayload.daySectionOverrides || {});
          await window.HomeSchoolDB.saveCustomization("studentProfile", {
            grade: nextPayload.grade,
            studentName: nextPayload.studentName,
            studentNameUr: nextPayload.studentNameUr
          });
        } catch (error) {
          console.log("Unable to persist customizations:", error);
        }
      }, 250);
    }
    useEffect(() => {
      if (!window.HomeSchoolDB) {
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
          const storedReviewPreferences = customizations.reviewPreferences?.data || null;
          const storedPacing = customizations.daySectionPacing?.data || null;
          const storedProfile = customizations.studentProfile?.data || null;
          if (storedPreferences) {
            if (typeof storedPreferences.language !== "undefined") setLanguage(storedPreferences.language);
            if (typeof storedPreferences.ttsEnabled !== "undefined") setTtsEnabled(storedPreferences.ttsEnabled);
            if (typeof storedPreferences.themeMode !== "undefined") setThemeMode(storedPreferences.themeMode);
          }
          if (storedReviewPreferences) {
            if (typeof storedReviewPreferences.dailyReviewCap !== "undefined") {
              setDailyReviewCap(Math.max(5, Math.min(50, Number(storedReviewPreferences.dailyReviewCap) || 20)));
            }
          }
          if (storedPacing && typeof storedPacing === "object") {
            setDaySectionOverrides(storedPacing);
          }
          if (storedProfile) {
            if (typeof storedProfile.grade !== "undefined") setGrade(storedProfile.grade);
            if (typeof storedProfile.studentName !== "undefined") setStudentName(storedProfile.studentName || "");
            if (typeof storedProfile.studentNameUr !== "undefined") setStudentNameUr(storedProfile.studentNameUr || "");
          }
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
          await refreshReviewStats();
        } catch (e) {
          console.log("DB load fallback to inline:", e);
        }
        setDbLoaded(true);
      })();
    }, []);
    const POS = {
      adverbs: dbPos.adverbs || ADVERBS_DATA,
      prepositions: dbPos.prepositions || PREPOSITIONS_DATA,
      adjectives: dbPos.adjectives || ADJECTIVES_DATA,
      conjunctions: dbPos.conjunctions || CONJUNCTIONS_DATA,
      pronouns: dbPos.pronouns || PRONOUNS_DATA,
      collectiveNouns: dbPos.collectiveNouns || COLLECTIVE_NOUNS_DATA,
      verbs: dbPos.verbs || VERBS_DATA
    };
    const TENSES = dbTenses && Object.keys(dbTenses).length > 0 ? dbTenses : TENSES_DATA;
    const VOCAB = dbVocab.length > 0 ? dbVocab : VOCABULARY_DATA;
    const pacedPos = {
      adverbs: regroupDayEntries(POS.adverbs, daySectionSettings.adverbs.itemsPerDay),
      prepositions: regroupDayEntries(POS.prepositions, daySectionSettings.prepositions.itemsPerDay),
      adjectives: regroupDayEntries(POS.adjectives, daySectionSettings.adjectives.itemsPerDay),
      conjunctions: regroupDayEntries(POS.conjunctions, daySectionSettings.conjunctions.itemsPerDay),
      pronouns: regroupDayEntries(POS.pronouns, daySectionSettings.pronouns.itemsPerDay),
      collectiveNouns: regroupDayEntries(POS.collectiveNouns, daySectionSettings.collectiveNouns.itemsPerDay),
      verbs: regroupDayEntries(POS.verbs, daySectionSettings.verbs.itemsPerDay)
    };
    const pacedVocab = regroupDayEntries(VOCAB, daySectionSettings.vocabulary.itemsPerDay);
    const activeLessonSubs = selectedLesson?.hasMathSub ? selectedLesson.key === "sentences" ? buildDerivedSentenceSub(selectedLesson.subs || [], daySectionSettings.sentences.itemsPerDay, selectedSubject?.id) : (selectedLesson.subs || []).map((sub) => {
      const settingKey = getSubsectionSettingKey(sub.t);
      if (!settingKey) return sub;
      return buildDerivedDayBasedSub(sub, settingKey, daySectionSettings[settingKey]?.itemsPerDay || 5, selectedSubject?.id);
    }) : [];
    useEffect(() => {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
      return () => window.speechSynthesis.cancel();
    }, []);
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
        onError: () => setServiceWorkerStatus("error")
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
      if (themeMode !== "system" || !window.matchMedia) return void 0;
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
      window.HomeSchoolPrefs = { ttsEnabled, language, themeMode, resolvedTheme };
      if (!ttsEnabled) window.speechSynthesis.cancel();
    }, [ttsEnabled, language, themeMode, resolvedTheme]);
    useEffect(() => {
      if (!dbLoaded || !window.HomeSchoolDB) return;
      persistCustomizationRef.current?.({
        ttsEnabled,
        language,
        themeMode,
        dailyReviewCap,
        daySectionOverrides,
        grade,
        studentName,
        studentNameUr
      });
    }, [dbLoaded, ttsEnabled, language, themeMode, dailyReviewCap, daySectionOverrides, grade, studentName, studentNameUr]);
    useEffect(() => {
      if (grade) saveState({ grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, language, themeMode, dailyReviewCap, daySectionOverrides, installBannerDismissed });
    }, [grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, language, themeMode, dailyReviewCap, daySectionOverrides, installBannerDismissed]);
    useEffect(() => {
      setPendingReviewBadge(reviewStats.due || 0);
    }, [reviewStats.due]);
    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);
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
      const ck = (id) => {
        if (!all.includes(id)) {
          all.push(id);
          nb.push(id);
        }
      };
      if (totalQuizzesDone === 0) ck("first_quiz");
      if (qs === 4) ck("perfect");
      if (totalQuizzesDone + 1 >= 5) ck("five_quizzes");
      if (totalQuizzesDone + 1 >= 10) ck("ten_quizzes");
      if (qt < 30) ck("speed_demon");
      if (streak + 1 >= 3) ck("streak_3");
      if (streak + 1 >= 7) ck("streak_7");
      const ds = new Set(Object.keys(completedQuizzes).map((k) => k.split("_")[0]));
      ds.add(si);
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
        [sectionKey]: { itemsPerDay: nextValue }
      }));
    }, []);
    const finishQuiz = async (ans, qs) => {
      const sc = ans.reduce((a, v, i) => a + (v === qs[i].c ? 1 : 0), 0);
      const el = (Date.now() - quizStartTime) / 1e3, today = (/* @__PURE__ */ new Date()).toDateString();
      const streakMode = calculateStreak(lastQuizDate, today);
      const ns = streakMode === "increment" ? streak + 1 : streakMode === null ? streak : 1;
      const earnedXp = calculateXP(sc, qs.length, el < 30);
      setTotalScore((s2) => s2 + sc);
      setTotalQuizzesDone((n) => n + 1);
      setStreak(ns);
      setLastQuizDate(today);
      setXp((x) => x + earnedXp);
      setCompletedQuizzes((p) => ({ ...p, [selectedLesson.id]: { score: sc, total: qs.length, date: today } }));
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
      setChatInput("");
      setChatMessages((m) => [...m, { role: "user", text: msg }]);
      setChatLoading(true);
      try {
        const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1e3, system: "You are a friendly AI tutor named Ustaad for a Grade " + grade + " student in Pakistan. Explain simply, use Pakistani examples, respond in English or Urdu. Keep responses concise (2-4 paragraphs). Use emojis occasionally.", messages: [...chatMessages.filter((m, i) => i > 0 || m.role !== "ai").map((m) => ({ role: m.role === "ai" ? "assistant" : "user", content: m.text })), { role: "user", content: msg }] }) });
        const d = await r.json();
        setChatMessages((m) => [...m, { role: "ai", text: d.content?.map((c) => c.text || "").join("") || "Sorry, please try again!" }]);
      } catch {
        setChatMessages((m) => [...m, { role: "ai", text: "Oops! Connection issue. Please try again. \u{1F64F}" }]);
      }
      setChatLoading(false);
    };
    const handleCheckUpdates = useCallback(async () => {
      if (!versionManagerRef.current) return;
      const result = await versionManagerRef.current.checkForUpdates(window.HomeSchoolData.VERSION, window.HomeSchoolData);
      setCurrentVersion(result.newVersion || window.HomeSchoolData.VERSION);
      setUpdateAvailable(result.needsUpdate);
      const changedSubjects = (result.changedSubjects || []).length > 0 ? `
${ui.changedSubjects}: ${result.changedSubjects.join(", ")}` : "";
      alert(result.needsUpdate ? `${ui.updateAvailableTitle}
Current DB version: ${result.currentVersion ?? "not seeded"}
New version: ${result.newVersion}${changedSubjects}` : `${ui.upToDateTitle}
Version: ${result.newVersion}`);
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
      await refreshReviewStats();
      setCurrentVersion(window.HomeSchoolData.VERSION);
      setUpdateAvailable(false);
      alert(result.refreshed ? `${ui.refreshSuccess} (${formatDate(Date.now())})${result.changedSubjects?.length ? `
${ui.changedSubjects}: ${result.changedSubjects.join(", ")}` : ""}` : ui.refreshNoChanges);
    }, [refreshReviewStats, refreshStorageLabel, ui.changedSubjects, ui.refreshConfirm, ui.refreshNoChanges, ui.refreshSuccess]);
    const handleExportProgress = useCallback(async () => {
      const dbProgress = window.HomeSchoolDB ? await window.HomeSchoolDB.exportProgress() : null;
      downloadJson(`homeschool-progress-${Date.now()}.json`, {
        exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
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
          language,
          themeMode,
          dailyReviewCap,
          daySectionOverrides
        },
        dbProgress
      });
    }, [grade, studentName, studentNameUr, completedQuizzes, totalScore, totalQuizzesDone, streak, lastQuizDate, earnedBadges, xp, ttsEnabled, language, themeMode, dailyReviewCap, daySectionOverrides]);
    const handleImportProgress = useCallback(async (event) => {
      const file = event?.target?.files?.[0];
      if (!file) return;
      try {
        if (!confirm(ui.importNow)) return;
        const text = await file.text();
        const parsed = JSON.parse(text);
        const validation = validateProgressImport(parsed);
        if (!validation.ok) {
          alert(`${ui.importInvalid}
${validation.errors.join("\n")}`);
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
          if (typeof nextState.language !== "undefined") setLanguage(nextState.language);
          if (typeof nextState.themeMode !== "undefined") setThemeMode(nextState.themeMode);
          if (typeof nextState.dailyReviewCap !== "undefined") setDailyReviewCap(Math.max(5, Math.min(50, Number(nextState.dailyReviewCap) || 20)));
          setDaySectionOverrides(nextState.daySectionOverrides || {});
        } else {
          if (typeof nextState.grade !== "undefined") setGrade((current) => current || nextState.grade);
          if (typeof nextState.studentName !== "undefined") setStudentName((current) => current || nextState.studentName);
          if (typeof nextState.studentNameUr !== "undefined") setStudentNameUr((current) => current || nextState.studentNameUr);
          if (nextState.completedQuizzes) setCompletedQuizzes((current) => ({ ...current, ...nextState.completedQuizzes }));
          if (typeof nextState.totalScore !== "undefined") setTotalScore((current) => Math.max(current, nextState.totalScore));
          if (typeof nextState.totalQuizzesDone !== "undefined") setTotalQuizzesDone((current) => Math.max(current, nextState.totalQuizzesDone));
          if (typeof nextState.streak !== "undefined") setStreak((current) => Math.max(current, nextState.streak));
          if (typeof nextState.lastQuizDate !== "undefined") setLastQuizDate((current) => current || nextState.lastQuizDate);
          if (nextState.earnedBadges) setEarnedBadges((current) => Array.from(/* @__PURE__ */ new Set([...current || [], ...nextState.earnedBadges])));
          if (typeof nextState.xp !== "undefined") setXp((current) => Math.max(current, nextState.xp));
          if (typeof nextState.ttsEnabled !== "undefined") setTtsEnabled((current) => current && nextState.ttsEnabled);
          if (typeof nextState.language !== "undefined") setLanguage((current) => current || nextState.language);
          if (typeof nextState.themeMode !== "undefined") setThemeMode((current) => current || nextState.themeMode);
          if (typeof nextState.dailyReviewCap !== "undefined") setDailyReviewCap((current) => Math.max(current, Math.min(50, Number(nextState.dailyReviewCap) || current)));
          if (nextState.daySectionOverrides) setDaySectionOverrides((current) => ({ ...current, ...nextState.daySectionOverrides }));
        }
        if (window.HomeSchoolDB && parsed.dbProgress) await window.HomeSchoolDB.importProgress(parsed.dbProgress, { mode });
        await refreshStorageLabel();
        await refreshReviewStats();
        alert(mode === "replace" ? ui.importSuccessReplace : ui.importSuccessMerge);
      } catch (error) {
        alert(`${ui.importInvalid}
${error.message || error}`);
      } finally {
        event.target.value = "";
      }
    }, [refreshReviewStats, refreshStorageLabel, ui.importInvalid, ui.importNewer, ui.importNow, ui.importSuccessMerge, ui.importSuccessReplace, ui.replacePrompt]);
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
      await refreshReviewStats();
    }, [refreshReviewStats, ui.resetConfirm]);
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
        await refreshReviewStats();
        return;
      }
      setReviewIdx((current) => current + 1);
      await refreshReviewStats();
    }, [activeReviewCard, refreshReviewStats, reviewIdx, reviewQueue.length]);
    const resetReviewSession = useCallback(() => {
      setReviewQueue([]);
      setReviewIdx(0);
      setReviewReveal(false);
      setReviewSessionDone(false);
      setReviewSessionXp(0);
    }, []);
    if (!dbLoaded) return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "app-container" }, /* @__PURE__ */ React.createElement("div", { className: "content", style: { display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 56, marginBottom: 16 } }, "\u{1F4DA}"), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 20, fontWeight: 700, marginBottom: 8 } }, ui.loadingHome), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 13 } }, ui.loadingDb), /* @__PURE__ */ React.createElement("div", { style: { width: 200, height: 4, background: "var(--bg-elevated)", borderRadius: 4, marginTop: 16, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "60%", height: "100%", background: "var(--accent)", borderRadius: 4, animation: "pulse 1s infinite" } })))));
    if (!grade) return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "app-container" }, /* @__PURE__ */ React.createElement("div", { className: "content", style: { display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh", padding: "32px 24px", direction: isUrduUi(language) ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 32 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 56, marginBottom: 12 } }, "\u{1F4DA}"), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 28, fontWeight: 800, marginBottom: 4 } }, "HomeSchool"), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--text-secondary)", fontSize: 14 } }, renderLocalizedTextNode(ui.tagline, language)), language === "en" ? /* @__PURE__ */ React.createElement("p", { style: { fontFamily: "var(--font-ur)", color: "var(--text-muted)", fontSize: 14, marginTop: 4 } }, "\u0622\u067E \u06A9\u0627 \u0630\u0627\u062A\u06CC \u062A\u0639\u0644\u06CC\u0645\u06CC \u0633\u0627\u062A\u06BE\u06CC") : null), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" } }, renderLocalizedTextNode(ui.yourName, language)), /* @__PURE__ */ React.createElement("input", { value: studentName, onChange: (e) => setStudentName(e.target.value), placeholder: ui.enterName, style: { width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: isUrduUi(language) ? "'Noto Nastaliq Urdu',serif" : "var(--font)", fontSize: 15, outline: "none" } })), language !== "en" && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8, display: "block" } }, renderLocalizedTextNode(ui.yourNameUr, language)), /* @__PURE__ */ React.createElement("input", { value: studentNameUr, onChange: (e) => setStudentNameUr(e.target.value), placeholder: ui.enterNameUr, style: { width: "100%", padding: "14px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontFamily: "var(--font-ur)", fontSize: 15, outline: "none", direction: "rtl" } })), /* @__PURE__ */ React.createElement("label", { style: { fontSize: 13, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 10, display: "block" } }, renderLocalizedTextNode(ui.selectGrade, language)), /* @__PURE__ */ React.createElement("div", { className: "grade-grid" }, GRADES.map((g) => /* @__PURE__ */ React.createElement("button", { key: g.id, className: "grade-btn", onClick: () => setGrade(g.id) }, g.id))))));
    const goHome = () => {
      window.speechSynthesis.cancel();
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
    };
    const goBack = () => {
      window.speechSynthesis.cancel();
      if (quizDone || quizActive) {
        setQuizActive(false);
        setQuizDone(false);
        setQuizAnswers([]);
        setQuizIdx(0);
        setNewBadges([]);
      } else if (selectedAdverbDay) {
        setSelectedAdverbDay(null);
      } else if (selectedPrepDay) {
        setSelectedPrepDay(null);
      } else if (selectedAdjDay) {
        setSelectedAdjDay(null);
      } else if (selectedConjDay) {
        setSelectedConjDay(null);
      } else if (selectedPronDay) {
        setSelectedPronDay(null);
      } else if (selectedNounDay) {
        setSelectedNounDay(null);
      } else if (selectedVerbDay) {
        setSelectedVerbDay(null);
      } else if (selectedTensePara) {
        setSelectedTensePara(null);
      } else if (selectedVocabDay) {
        setSelectedVocabDay(null);
      } else if (subQuizGroupIdx !== null) {
        setSubQuizGroupIdx(null);
      } else if (subExerciseGroupIdx !== null) {
        setSubExerciseGroupIdx(null);
      } else if (mathSubIdx !== null) {
        setMathSubIdx(null);
        setMathSubTab("examples");
        setSubExerciseGroupIdx(null);
        setSubQuizGroupIdx(null);
        setRevealedEx({});
      } else if (selectedLesson) {
        setSelectedLesson(null);
        setPosTab("adverbs");
        setTenseMain("present");
        setTenseSub("simple");
      } else if (selectedSubject) setSelectedSubject(null);
      else if (tab === "review") {
        resetReviewSession();
        setTab("home");
      } else setTab("home");
    };
    const selDay = selectedAdverbDay || selectedPrepDay || selectedAdjDay || selectedConjDay || selectedPronDay || selectedNounDay || selectedVerbDay || selectedTensePara || selectedVocabDay || mathSubIdx !== null;
    const headerTitle = quizActive || quizDone ? ui.quiz : selectedAdverbDay ? getScopedDayTitle(selectedAdverbDay.day, "Adverbs", "\u0642\u06CC\u062F", language) : selectedPrepDay ? getScopedDayTitle(selectedPrepDay.day, "Prepositions", "\u062D\u0631\u0648\u0641 \u062C\u0627\u0631", language) : selectedAdjDay ? getScopedDayTitle(selectedAdjDay.day, "Adjectives", "\u0635\u0641\u0627\u062A", language) : selectedConjDay ? getScopedDayTitle(selectedConjDay.day, "Conjunctions", "\u062D\u0631\u0648\u0641 \u0639\u0637\u0641", language) : selectedPronDay ? getScopedDayTitle(selectedPronDay.day, "Pronouns", "\u0636\u0645\u0627\u0626\u0631", language) : selectedNounDay ? getScopedDayTitle(selectedNounDay.day, "Collective Nouns", "\u0627\u0633\u0645 \u062C\u0645\u0639", language) : selectedVerbDay ? getScopedDayTitle(selectedVerbDay.day, "Verbs", "\u0627\u0641\u0639\u0627\u0644", language) : selectedTensePara ? selectedTensePara.title : selectedVocabDay ? getScopedDayTitle(selectedVocabDay.day, "Vocabulary", "\u0630\u062E\u06CC\u0631\u06C1 \u0627\u0644\u0641\u0627\u0638", language) : selectedLesson ? selectedLesson.title : selectedSubject ? getSubjectDisplayName(selectedSubject, language) : tab === "home" ? "HomeSchool" : tab === "progress" ? ui.progress : tab === "review" ? ui.review : tab === "badges" ? ui.achievements : tab === "tutor" ? ui.tutor : ui.settings;
    const showBack = selectedSubject || selectedLesson || quizActive || quizDone || selDay || tab !== "home";
    const currentQuiz = selectedLesson ? getQuiz(selectedSubject?.id, grade, selectedLesson.key) : [];
    const quizScore = quizDone ? quizAnswers.reduce((a, v, i) => a + (v === currentQuiz[i]?.c ? 1 : 0), 0) : 0;
    const localizedNames = getLocalizedNamePair(studentName, studentNameUr);
    const reviewReadyNowCount = Math.min(Number(reviewStats.due || 0), Number(dailyReviewCap || 20));
    const canInstallApp = Boolean(installPromptEvent) && !isInstalled;
    const canShowInstallBanner = !installBannerDismissed && !isInstalled && serviceWorkerStatus !== "unsupported" && serviceWorkerStatus !== "local-static";
    const installStatusLabel = isInstalled || installAvailability === "installed" ? ui.appInstalled : canInstallApp || installAvailability === "available" ? ui.appInstallAvailable : ui.appInstallUnavailable;
    const offlineStatusLabel = serviceWorkerStatus === "ready" ? ui.offlineReady : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking" ? ui.offlineCaching : serviceWorkerStatus === "local-static" ? ui.offlineLocalStatic : serviceWorkerStatus === "update-ready" ? ui.updateReady : serviceWorkerStatus === "unsupported" ? ui.offlineUnsupported : ui.offlineError;
    const networkStatusLabel = isOnline ? ui.online : ui.offline;
    const bannerTitleOptions = { gap: 1, enStyle: { fontSize: 15, fontWeight: 800 }, urStyle: { fontSize: 14, fontWeight: 700 } };
    const bannerBodyOptions = { gap: 2, enStyle: { fontSize: 12.5 }, urStyle: { fontSize: 12.5, lineHeight: 1.8 } };
    const bannerLabelOptions = { gap: 1, enStyle: { fontSize: 10.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".4px" }, urStyle: { fontSize: 10.5, color: "var(--text-muted)", fontWeight: 700 } };
    const bannerValueOptions = { gap: 1, enStyle: { fontSize: 12.5, color: "var(--accent)", fontWeight: 800 }, urStyle: { fontSize: 12.5, color: "var(--text-primary)", fontWeight: 700 } };
    const bannerButtonOptions = { gap: 0, enStyle: { fontSize: 12, fontWeight: 700 }, urStyle: { fontSize: 11.5, fontWeight: 700 } };
    const playAll = (p) => {
      if (!isTtsEnabled()) return;
      window.speechSynthesis.cancel();
      const ss = p.split(/(?<=[.!?])\s+/).filter(Boolean);
      let i = 0;
      const next = () => {
        if (i < ss.length) {
          const u = new SpeechSynthesisUtterance(ttsClean(ss[i]));
          u.lang = "en-US";
          u.rate = 0.85;
          u.pitch = 1.05;
          const v = window.speechSynthesis.getVoices();
          const pr = v.find((x) => x.lang.startsWith("en") && x.localService) || v.find((x) => x.lang.startsWith("en"));
          if (pr) u.voice = pr;
          u.onend = () => {
            i++;
            next();
          };
          window.speechSynthesis.speak(u);
        }
      };
      next();
    };
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
    return /* @__PURE__ */ React.createElement(AppContext.Provider, { value: { currentVersion, updateAvailable, ttsEnabled, language, storageLabel } }, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "app-container" }, /* @__PURE__ */ React.createElement("div", { className: "app-header", style: selectedSubject?.id === "urdu" || isUrduUi(language) ? { direction: "rtl" } : {} }, showBack && /* @__PURE__ */ React.createElement("button", { className: "back-btn", onClick: goBack }, "\u2190"), /* @__PURE__ */ React.createElement("button", { className: "home-btn", onClick: goHome, title: ui.home }, "\u{1F3E0}"), /* @__PURE__ */ React.createElement("h1", { style: selectedSubject?.id === "urdu" || isUrduUi(language) ? { fontFamily: "'Noto Nastaliq Urdu',serif", textAlign: "right" } : {} }, renderLocalizedTextNode(headerTitle, language)), /* @__PURE__ */ React.createElement("div", { className: "header-badge" }, /* @__PURE__ */ React.createElement("span", null, "\u2B50"), /* @__PURE__ */ React.createElement("span", null, xp, " XP"))), /* @__PURE__ */ React.createElement("div", { className: "content" }, tab === "home" && !selectedSubject && !selectedLesson && !quizActive && !selectedAdverbDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "welcome-card" }, /* @__PURE__ */ React.createElement("h2", null, renderWelcomeGreeting(localizedNames, language), " \u{1F44B}"), /* @__PURE__ */ React.createElement("p", null, renderLocalizedTextNode(joinLocalizedText("Ready to learn something amazing today?", "\u0622\u062C \u06A9\u0686\u06BE \u0634\u0627\u0646\u062F\u0627\u0631 \u0633\u06CC\u06A9\u06BE\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u062A\u06CC\u0627\u0631 \u06C1\u06CC\u06BA\u061F", language), language)), /* @__PURE__ */ React.createElement("span", { className: "grade-tag" }, renderLocalizedTextNode(ui.grade, language), " ", grade)), canShowInstallBanner && /* @__PURE__ */ React.createElement("div", { className: "app-status-card", "data-ui-language": language }, /* @__PURE__ */ React.createElement("div", { className: "app-status-head" }, /* @__PURE__ */ React.createElement("h3", null, renderSeparatedLocalizedTextNode(UI_TEXT.en.installBannerTitle, UI_TEXT.ur.installBannerTitle, language, bannerTitleOptions)), /* @__PURE__ */ React.createElement("button", { className: "banner-dismiss", onClick: () => setInstallBannerDismissed(true), "aria-label": ui.hideBanner }, renderSeparatedLocalizedTextNode(UI_TEXT.en.hideBanner, UI_TEXT.ur.hideBanner, language, bannerButtonOptions))), /* @__PURE__ */ React.createElement("p", null, renderSeparatedLocalizedTextNode(UI_TEXT.en.installBannerText, UI_TEXT.ur.installBannerText, language, bannerBodyOptions)), (canInstallApp || installAvailability === "available") && /* @__PURE__ */ React.createElement("p", { className: "install-browser-hint" }, renderSeparatedLocalizedTextNode(UI_TEXT.en.installBrowserHint, UI_TEXT.ur.installBrowserHint, language, bannerBodyOptions)), /* @__PURE__ */ React.createElement("div", { className: "app-status-grid" }, /* @__PURE__ */ React.createElement("div", { className: "status-pill" }, /* @__PURE__ */ React.createElement("strong", null, renderSeparatedLocalizedTextNode(UI_TEXT.en.installStatus, UI_TEXT.ur.installStatus, language, bannerLabelOptions)), /* @__PURE__ */ React.createElement("span", null, renderSeparatedLocalizedTextNode(isInstalled || installAvailability === "installed" ? UI_TEXT.en.appInstalled : canInstallApp || installAvailability === "available" ? UI_TEXT.en.appInstallAvailable : UI_TEXT.en.appInstallUnavailable, isInstalled || installAvailability === "installed" ? UI_TEXT.ur.appInstalled : canInstallApp || installAvailability === "available" ? UI_TEXT.ur.appInstallAvailable : UI_TEXT.ur.appInstallUnavailable, language, bannerValueOptions))), /* @__PURE__ */ React.createElement("div", { className: "status-pill" }, /* @__PURE__ */ React.createElement("strong", null, renderSeparatedLocalizedTextNode(UI_TEXT.en.offlineAccess, UI_TEXT.ur.offlineAccess, language, bannerLabelOptions)), /* @__PURE__ */ React.createElement("span", null, renderSeparatedLocalizedTextNode(serviceWorkerStatus === "ready" ? UI_TEXT.en.offlineReady : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking" ? UI_TEXT.en.offlineCaching : serviceWorkerStatus === "local-static" ? UI_TEXT.en.offlineLocalStatic : serviceWorkerStatus === "update-ready" ? UI_TEXT.en.updateReady : serviceWorkerStatus === "unsupported" ? UI_TEXT.en.offlineUnsupported : UI_TEXT.en.offlineError, serviceWorkerStatus === "ready" ? UI_TEXT.ur.offlineReady : serviceWorkerStatus === "caching" || serviceWorkerStatus === "checking" ? UI_TEXT.ur.offlineCaching : serviceWorkerStatus === "local-static" ? UI_TEXT.ur.offlineLocalStatic : serviceWorkerStatus === "update-ready" ? UI_TEXT.ur.updateReady : serviceWorkerStatus === "unsupported" ? UI_TEXT.ur.offlineUnsupported : UI_TEXT.ur.offlineError, language, bannerValueOptions))), /* @__PURE__ */ React.createElement("div", { className: "status-pill" }, /* @__PURE__ */ React.createElement("strong", null, renderSeparatedLocalizedTextNode(UI_TEXT.en.networkStatus, UI_TEXT.ur.networkStatus, language, bannerLabelOptions)), /* @__PURE__ */ React.createElement("span", null, renderSeparatedLocalizedTextNode(isOnline ? UI_TEXT.en.online : UI_TEXT.en.offline, isOnline ? UI_TEXT.ur.online : UI_TEXT.ur.offline, language, bannerValueOptions)))), /* @__PURE__ */ React.createElement("div", { className: "app-status-actions" }, canInstallApp && /* @__PURE__ */ React.createElement("button", { className: "install-cta", onClick: handleInstallApp }, renderSeparatedLocalizedTextNode(UI_TEXT.en.installApp, UI_TEXT.ur.installApp, language, bannerButtonOptions)), serviceWorkerStatus === "update-ready" && /* @__PURE__ */ React.createElement("button", { className: "ghost-cta", onClick: applyServiceWorkerUpdate }, renderSeparatedLocalizedTextNode(UI_TEXT.en.refreshToUpdate, UI_TEXT.ur.refreshToUpdate, language, bannerButtonOptions)))), /* @__PURE__ */ React.createElement("button", { className: "adverb-home-banner", style: { width: "100%", textAlign: "left", background: "linear-gradient(135deg,rgba(14,165,233,0.18),rgba(34,197,94,0.12))", borderColor: "rgba(56,189,248,0.35)" }, onClick: handleStartReview }, /* @__PURE__ */ React.createElement("div", { className: "banner-icon" }, "\u{1F9E0}"), /* @__PURE__ */ React.createElement("div", { className: "banner-text" }, /* @__PURE__ */ React.createElement("h3", null, renderLocalizedTextNode(ui.reviewReady, language)), /* @__PURE__ */ React.createElement("p", null, renderLocalizedTextNode(language === "ur" ? `${formatNumberLabel(reviewReadyNowCount)} \u0627\u0628\u06BE\u06CC \u062A\u06CC\u0627\u0631 \u2022 ${formatNumberLabel(reviewStats.due || 0)} \u06A9\u0644 \u0628\u0627\u0642\u06CC` : language === "bilingual" ? `${formatNumberLabel(reviewReadyNowCount)} ready now \u2022 ${formatNumberLabel(reviewStats.due || 0)} total due / ${formatNumberLabel(reviewReadyNowCount)} \u0627\u0628\u06BE\u06CC \u062A\u06CC\u0627\u0631 \u2022 ${formatNumberLabel(reviewStats.due || 0)} \u06A9\u0644 \u0628\u0627\u0642\u06CC` : `${formatNumberLabel(reviewReadyNowCount)} ready now \u2022 ${formatNumberLabel(reviewStats.due || 0)} total due`, language)))), streak > 0 && /* @__PURE__ */ React.createElement("div", { className: "streak-banner" }, /* @__PURE__ */ React.createElement("span", { className: "streak-fire" }, "\u{1F525}"), /* @__PURE__ */ React.createElement("div", { className: "streak-info" }, /* @__PURE__ */ React.createElement("h4", null, renderLocalizedTextNode(joinLocalizedText(`${streak} Day Streak!`, `${streak} \u062F\u0646 \u06A9\u0627 \u062A\u0633\u0644\u0633\u0644!`, language), language)), /* @__PURE__ */ React.createElement("p", null, renderLocalizedTextNode(joinLocalizedText("Keep going, you're doing great!", "\u0627\u0633\u06CC \u0637\u0631\u062D \u062C\u0627\u0631\u06CC \u0631\u06A9\u06BE\u06CC\u06BA\u060C \u0622\u067E \u0628\u06C1\u062A \u0627\u0686\u06BE\u0627 \u06A9\u0631 \u0631\u06C1\u06D2 \u06C1\u06CC\u06BA!", language), language)))), /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, renderLocalizedTextNode(joinLocalizedText("Subjects", "\u0645\u0636\u0627\u0645\u06CC\u0646", language), language)), /* @__PURE__ */ React.createElement("div", { className: "subject-grid" }, SUBJECTS.map((subj) => {
      const ls = getLessons(subj.id, grade), done = ls.filter((l) => completedQuizzes[l.id]).length, pct = ls.length > 0 ? done / ls.length * 100 : 0;
      return /* @__PURE__ */ React.createElement("button", { key: subj.id, className: "subject-card", onClick: () => setSelectedSubject(subj) }, /* @__PURE__ */ React.createElement("span", { className: "subj-icon" }, subj.icon), /* @__PURE__ */ React.createElement("span", { className: "subj-name" }, subj.name), /* @__PURE__ */ React.createElement("span", { className: "subj-name-ur" }, subj.nameUr), /* @__PURE__ */ React.createElement("div", { className: "subj-progress" }, /* @__PURE__ */ React.createElement("div", { className: "subj-progress-fill", style: { width: pct + "%", background: subj.color } })));
    }))), tab === "home" && selectedSubject && !selectedLesson && !quizActive && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20, direction: selectedSubject?.id === "urdu" || isUrduUi(language) ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 36 } }, selectedSubject.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 20, fontWeight: 800, fontFamily: selectedSubject?.id === "urdu" || isUrduUi(language) ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, renderLocalizedTextNode(getSubjectDisplayName(selectedSubject, language), language)), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-secondary)", fontFamily: selectedSubject?.id === "urdu" || isUrduUi(language) ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, renderLocalizedTextNode(`${ui.grade} ${grade} \u2022 ${getLessons(selectedSubject.id, grade).length} ${ui.lessons}`, language)))), /* @__PURE__ */ React.createElement("div", { className: "lesson-list", style: selectedSubject?.id === "urdu" || isUrduUi(language) ? { direction: "rtl" } : {} }, getLessons(selectedSubject.id, grade).map((l, i) => {
      const d = completedQuizzes[l.id];
      const isUr = selectedSubject?.id === "urdu" || isUrduUi(language);
      return /* @__PURE__ */ React.createElement("button", { key: l.id, className: "lesson-card", onClick: () => setSelectedLesson(l), style: isUr ? { direction: "rtl", textAlign: "right", fontFamily: "'Noto Nastaliq Urdu',serif" } : {} }, /* @__PURE__ */ React.createElement("span", { className: "lesson-num" }, `${ui.lesson} ${i + 1}`), /* @__PURE__ */ React.createElement("h3", null, l.title), /* @__PURE__ */ React.createElement("p", { style: isUr ? { fontFamily: "'Noto Nastaliq Urdu',serif" } : {} }, l.content.substring(0, 80), "..."), /* @__PURE__ */ React.createElement("div", { className: "lesson-status", style: { color: d ? "var(--success)" : "var(--text-muted)" } }, d ? "\u2705" : "\u25CB", " ", d ? `${ui.completed} - ${d.score}/4` : ui.notStarted));
    }))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && !selDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "lesson-detail" }, /* @__PURE__ */ React.createElement("h2", null, selectedLesson.title), /* @__PURE__ */ React.createElement("p", null, selectedLesson.content), /* @__PURE__ */ React.createElement("button", { className: "start-quiz-btn", onClick: () => {
      setQuizActive(true);
      setQuizIdx(0);
      setQuizAnswers([]);
      setQuizRevealed(false);
      setQuizDone(false);
      setQuizStartTime(Date.now());
      setNewBadges([]);
    } }, "\u{1F3AF} ", ui.startQuiz)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 14 } }, [{ id: "adverbs", label: "\u{1F4D6} Adverbs", c: "#38BDF8" }, { id: "prepositions", label: "\u{1F4CD} Prepositions", c: "#22C55E" }, { id: "adjectives", label: "\u{1F3F7}\uFE0F Adjectives", c: "#F59E0B" }, { id: "conjunctions", label: "\u{1F517} Conjunctions", c: "#A855F7" }, { id: "pronouns", label: "\u{1F464} Pronouns", c: "#EC4899" }, { id: "nouns", label: "\u{1F4E6} Col. Nouns", c: "#14B8A6" }, { id: "verbs", label: "\u270F\uFE0F Verbs", c: "#F97316" }].map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setPosTab(t.id), style: { flex: "1 1 30%", padding: "8px 4px", borderRadius: 10, border: posTab === t.id ? "2px solid " + t.c : "1px solid rgba(148,163,184,0.15)", background: posTab === t.id ? t.c + "22" : "rgba(30,41,59,0.6)", color: posTab === t.id ? t.c : "#94A3B8", fontFamily: "'Baloo 2', sans-serif", fontSize: 11, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" } }, t.label))), /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English \u2192 English voice | Tap Urdu \u2192 Urdu voice"), posTab === "adverbs" && pacedPos.adverbs.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedAdverbDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "prepositions" && pacedPos.prepositions.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedPrepDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "adjectives" && pacedPos.adjectives.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedAdjDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "conjunctions" && pacedPos.conjunctions.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedConjDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "pronouns" && pacedPos.pronouns.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedPronDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "nouns" && pacedPos.collectiveNouns.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedNounDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur))))), posTab === "verbs" && pacedPos.verbs.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedVerbDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur)))))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdverbDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu word \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4DD} Day ", selectedAdverbDay.day, " \u2014 Vocabulary"), selectedAdverbDay.words.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedAdverbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const aw = selectedAdverbDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase()));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: aw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedAdverbDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPrepDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu word \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4CD} Day ", selectedPrepDay.day, " \u2014 Prepositions"), selectedPrepDay.words.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedPrepDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const pw = selectedPrepDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase().split(" ")[0]));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: pw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedPrepDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph")), selectedPrepDay.difficult && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4DA} Difficult Words"), selectedPrepDay.difficult.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur })))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedAdjDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English forms \u2192 hear all 3 forms spoken | Tap Urdu \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F3F7}\uFE0F Day ", selectedAdjDay.day, " \u2014 Adjective Forms"), selectedAdjDay.words.map((w, i) => /* @__PURE__ */ React.createElement(AdjWordRow, { key: i, en: w.en, ur: w.ur, comp: w.comp, sup: w.super }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedAdjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const aw = selectedAdjDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase()));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: aw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedAdjDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedConjDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu word \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F517} Day ", selectedConjDay.day, " \u2014 Conjunctions"), selectedConjDay.words.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedConjDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const cw = selectedConjDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase().split("...")[0].split(" ")[0]));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: cw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedConjDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph")), selectedConjDay.difficult && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4DA} Difficult Words"), selectedConjDay.difficult.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur })))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedPronDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu word \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F464} Day ", selectedPronDay.day, " \u2014 Pronouns"), selectedPronDay.words.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedPronDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const pw = selectedPronDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase().split(" ")[0].split("/")[0]));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: pw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedPronDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedNounDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu word \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4E6} Day ", selectedNounDay.day, " \u2014 Collective Nouns"), selectedNounDay.words.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedNounDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const nw = selectedNounDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase()));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: nw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedNounDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasAdverbs && selectedVerbDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap V1 \u2192 V2 \u2192 V3 forms spoken | Tap Urdu \u2192 Urdu voice | Tap sentence \u2192 hear it read!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u270F\uFE0F Day ", selectedVerbDay.day, " \u2014 Verb Forms"), selectedVerbDay.words.map((w, i) => /* @__PURE__ */ React.createElement(VerbWordRow, { key: i, en: w.en, ur: w.ur, v2: w.v2, v3: w.v3 }))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedVerbDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const vw = selectedVerbDay.words.find((w) => s2.toLowerCase().includes(w.en.toLowerCase()));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: vw?.en });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedVerbDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && !selectedLesson.hasAdverbs && !selectedLesson.hasTenses && !selectedLesson.hasVocab && !selectedLesson.hasMathSub && /* @__PURE__ */ React.createElement("div", { className: "lesson-detail" }, /* @__PURE__ */ React.createElement("h2", null, selectedLesson.title), /* @__PURE__ */ React.createElement("p", { className: selectedSubject?.id === "urdu" ? "urdu-text" : "" }, selectedLesson.content), /* @__PURE__ */ React.createElement("button", { className: "start-quiz-btn", onClick: () => {
      setQuizActive(true);
      setQuizIdx(0);
      setQuizAnswers([]);
      setQuizRevealed(false);
      setQuizDone(false);
      setQuizStartTime(Date.now());
      setNewBadges([]);
    } }, "\u{1F3AF} Start Quiz")), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx === null && /* @__PURE__ */ React.createElement(React.Fragment, null, (() => {
      const isUr = selectedSubject?.id === "urdu";
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "lesson-detail", style: isUr ? { direction: "rtl", fontFamily: "'Noto Nastaliq Urdu',serif", textAlign: "right" } : {} }, /* @__PURE__ */ React.createElement("h2", null, selectedLesson.title), /* @__PURE__ */ React.createElement("p", null, selectedLesson.content)), /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 8, direction: isUr ? "rtl" : "ltr", textAlign: isUr ? "right" : "left" } }, isUr ? "\u{1F4D0} \u0645\u0648\u0636\u0648\u0639\u0627\u062A" : "\u{1F4D0} Topics"), activeLessonSubs.map((sub, i) => {
        const topicColors = ["#38BDF8", "#22C55E", "#F59E0B", "#A855F7", "#EC4899", "#14B8A6", "#F97316"];
        const tc = topicColors[i % topicColors.length];
        return /* @__PURE__ */ React.createElement("div", { key: i, className: "adverb-day-card", onClick: () => {
          setMathSubIdx(i);
          setMathSubTab("examples");
          setSubExerciseGroupIdx(null);
          setSubQuizGroupIdx(null);
          setRevealedEx({});
        }, style: { display: "flex", alignItems: "center", gap: 14, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 40, borderRadius: 12, background: tc + "22", border: "2px solid " + tc, color: tc, fontSize: 16, fontWeight: 800, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif", flexShrink: 0 } }, i + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: isUr ? "right" : "left" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 700, margin: 0, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, sub.t), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, sub.c.substring(0, 80), "...")));
      }));
    })()), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasMathSub && mathSubIdx !== null && (() => {
      const sub = normalizeSubLesson(activeLessonSubs[mathSubIdx], selectedSubject?.id);
      const adjustedDayLessons = sub.dayLessons;
      const toggleReveal = (k) => setRevealedEx((p) => ({ ...p, [k]: !p[k] }));
      const isUr = selectedSubject?.id === "urdu";
      const isMath = selectedSubject?.id === "math";
      const activeExerciseGroup = sub.exerciseGroups && subExerciseGroupIdx !== null ? sub.exerciseGroups[subExerciseGroupIdx] : null;
      const activeQuizGroup = sub.quizGroups && subQuizGroupIdx !== null ? sub.quizGroups[subQuizGroupIdx] : null;
      const exercisesToRender = activeExerciseGroup ? activeExerciseGroup.exercises : sub.exerciseGroups ? null : sub.exercises;
      const quizToRender = activeQuizGroup ? activeQuizGroup.questions : sub.quizGroups ? null : sub.quiz;
      const urS = isUr ? { direction: "rtl", fontFamily: "'Noto Nastaliq Urdu',serif", textAlign: "right" } : {};
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: { marginBottom: 10, ...urS } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#FF6B35", ...urS } }, isUr ? "\u{1F4D6}" : "\u{1F4D0}", " ", sub.t), isMath ? /* @__PURE__ */ React.createElement(MathVisualDeck, { sub, lessonTitle: selectedLesson?.title }) : /* @__PURE__ */ React.createElement(React.Fragment, null, sub.svgType === "placeValue" && /* @__PURE__ */ React.createElement(PlaceValueChart, { number: sub.svgData.number }), sub.svgType === "expandedForm" && /* @__PURE__ */ React.createElement(ExpandedFormSVG, { number: sub.svgData.number, parts: sub.svgData.parts }), sub.svgType === "compare" && /* @__PURE__ */ React.createElement(CompareTripleSVG, null), sub.svgType === "rounding" && /* @__PURE__ */ React.createElement(RoundingDualSVG, null), sub.svgType === "columnAdd" && /* @__PURE__ */ React.createElement(ColumnAddSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, result: sub.svgData.result }), sub.svgType === "columnSub" && /* @__PURE__ */ React.createElement(ColumnSubSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, result: sub.svgData.result }), sub.svgType === "estimation" && /* @__PURE__ */ React.createElement(EstimationSVG, { num1: sub.svgData.num1, num2: sub.svgData.num2, op: sub.svgData.op, rounded1: sub.svgData.rounded1, rounded2: sub.svgData.rounded2, estimate: sub.svgData.estimate, exact: sub.svgData.exact }), sub.svgType === "statesOfMatter" && /* @__PURE__ */ React.createElement(StatesOfMatterSVG, null), sub.svgType === "materialProperties" && /* @__PURE__ */ React.createElement(MaterialPropertiesSVG, null), sub.svgType === "mixturesSolutions" && /* @__PURE__ */ React.createElement(MixturesSolutionsSVG, null), sub.svgType === "gravityForce" && /* @__PURE__ */ React.createElement(GravityForceSVG, null), sub.svgType === "frictionForce" && /* @__PURE__ */ React.createElement(FrictionForceSVG, null), sub.svgType === "foodChain" && /* @__PURE__ */ React.createElement(FoodChainSVG, null), sub.svgType === "solarSystem" && /* @__PURE__ */ React.createElement(SolarSystemSVG, null), sub.svgType === "earthLayers" && /* @__PURE__ */ React.createElement(EarthLayersSVG, null), sub.svgType === "bodySystem" && /* @__PURE__ */ React.createElement(BodySystemSVG, { system: sub.svgData.system }), sub.svgType === "moonPhases" && /* @__PURE__ */ React.createElement(MoonPhasesSVG, null), sub.svgType === "magnetPoles" && /* @__PURE__ */ React.createElement(MagnetPolesSVG, null), sub.svgType === "lightReflection" && /* @__PURE__ */ React.createElement(LightRefractionSVG, null), sub.svgType === "simpleMachines" && /* @__PURE__ */ React.createElement(SimpleMachinesSVG, null), sub.svgType === "energyTypes" && /* @__PURE__ */ React.createElement(EnergyTypesSVG, null), sub.svgType === "dayNight" && /* @__PURE__ */ React.createElement(DayNightSVG, null), sub.svgType === "seasonsCycle" && /* @__PURE__ */ React.createElement(SeasonsCycleSVG, null), sub.svgType === "nervousSystem" && /* @__PURE__ */ React.createElement(NervousSystemSVG, null), sub.svgType === "classificationGroups" && /* @__PURE__ */ React.createElement(ClassificationSVG, null), sub.svgType === "adaptationTraits" && /* @__PURE__ */ React.createElement(AdaptationSVG, null), sub.svgType === "soundWaves" && /* @__PURE__ */ React.createElement(SoundWavesSVG, null), sub.svgType === "skeleton" && /* @__PURE__ */ React.createElement(SkeletonSVG, null), sub.svgType === "waterCycle" && /* @__PURE__ */ React.createElement(WaterCycleSVG, null), sub.svgType === "photosynthesis" && /* @__PURE__ */ React.createElement(PhotosynthesisSVG, null), sub.svgType === "pakistanMap" && /* @__PURE__ */ React.createElement(PakistanMapSVG, null), sub.svgType === "indusValley" && /* @__PURE__ */ React.createElement(IndusValleySVG, null), sub.svgType === "pakFlag" && /* @__PURE__ */ React.createElement(PakFlagSVG, null), sub.svgType === "pakGov" && /* @__PURE__ */ React.createElement(PakGovSVG, null), sub.svgType === "presidentialSystem" && /* @__PURE__ */ React.createElement(PresidentialSystemSVG, null), sub.svgType === "federalParliamentry" && /* @__PURE__ */ React.createElement(FederalParliamentrySVG, null), sub.svgType === "pakRivers" && /* @__PURE__ */ React.createElement(PakRiversSVG, null), sub.svgType === "numberLine" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(NumberLineSVG, { min: sub.svgData.min, max: sub.svgData.max, marks: sub.svgData.marks, highlight: sub.svgData.highlight }), /* @__PURE__ */ React.createElement("div", { className: "math-svg" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 620 100", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("rect", { width: "620", height: "100", rx: "12", fill: "#1E293B" }), /* @__PURE__ */ React.createElement("text", { x: "310", y: "18", textAnchor: "middle", fill: "#94A3B8", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Positive & Negative Numbers"), /* @__PURE__ */ React.createElement("line", { x1: "30", y1: "52", x2: "590", y2: "52", stroke: "#475569", strokeWidth: "3", strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("polygon", { points: "22,52 30,46 30,58", fill: "#475569" }), /* @__PURE__ */ React.createElement("polygon", { points: "598,52 590,46 590,58", fill: "#475569" }), [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((n, i) => {
        const x = 310 + n * 52;
        const isZero = n === 0;
        const isNeg = n < 0;
        const col = isZero ? "#F59E0B" : isNeg ? "#EF4444" : "#22C55E";
        return /* @__PURE__ */ React.createElement("g", { key: i, onClick: () => handleBoxClick(s.label), style: { cursor: "pointer" } }, /* @__PURE__ */ React.createElement("line", { x1: x, y1: "44", x2: x, y2: "60", stroke: col, strokeWidth: isZero ? 4 : 2 }), /* @__PURE__ */ React.createElement("text", { x, y: "80", textAnchor: "middle", fill: col, fontSize: isZero ? "18" : "15", fontWeight: isZero ? "900" : "700", fontFamily: "'Baloo 2'" }, n), isZero && /* @__PURE__ */ React.createElement("circle", { cx: x, cy: "52", r: "6", fill: "#F59E0B" }));
      }), /* @__PURE__ */ React.createElement("text", { x: "80", y: "38", textAnchor: "middle", fill: "#EF4444", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "\u2190 Negative"), /* @__PURE__ */ React.createElement("text", { x: "540", y: "38", textAnchor: "middle", fill: "#22C55E", fontSize: "12", fontWeight: "700", fontFamily: "'Baloo 2'" }, "Positive \u2192"))))), sub.c.split(/(?<=[.!?۔؟])\s+/).filter(Boolean).map((s2, i) => /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: isUr ? "ur" : "en" })), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", style: isUr ? { fontFamily: "'Noto Nastaliq Urdu',serif", direction: "rtl" } : {}, onClick: () => playAll(sub.c) }, isUr ? "\u25B6\uFE0F \u0633\u0646\u06CC\u06BA" : "\u25B6\uFE0F Play Explanation")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14, direction: isUr ? "rtl" : "ltr" } }, [{ id: "examples", label: isUr ? "\u{1F4A1} \u0645\u062B\u0627\u0644\u06CC\u06BA" : "\u{1F4A1} Examples", c: "#38BDF8" }, { id: "exercises", label: isUr ? "\u270F\uFE0F \u0645\u0634\u0642\u06CC\u06BA" : "\u270F\uFE0F Exercises", c: "#22C55E" }, { id: "quiz", label: isUr ? "\u{1F3AF} \u0627\u0645\u062A\u062D\u0627\u0646" : "\u{1F3AF} Quiz", c: "#F59E0B" }].map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => {
        setMathSubTab(t.id);
        setSubExerciseGroupIdx(null);
        setSubQuizGroupIdx(null);
        setRevealedEx({});
      }, style: { flex: 1, padding: "10px 6px", borderRadius: 10, border: mathSubTab === t.id ? "2px solid " + t.c : "1px solid rgba(148,163,184,0.15)", background: mathSubTab === t.id ? t.c + "22" : "rgba(30,41,59,0.6)", color: mathSubTab === t.id ? t.c : "#94A3B8", fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif", fontSize: isUr ? 14 : 13, fontWeight: 700, cursor: "pointer" } }, t.label))), mathSubTab === "examples" && adjustedDayLessons && /* @__PURE__ */ React.createElement("div", { style: urS }, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { color: "#38BDF8", marginBottom: 12, direction: isUr ? "rtl" : "ltr", textAlign: isUr ? "right" : "left" } }, sub.lessonLabel || (isUr ? "\u{1F4C5} \u0627\u0633\u0628\u0627\u0642 \u06A9\u06D2 \u062F\u0646" : "\u{1F4C5} Lesson Days")), adjustedDayLessons.map((lessonDay, dayIdx) => /* @__PURE__ */ React.createElement("div", { key: lessonDay.day || dayIdx, className: "adverb-detail-section", style: urS }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#38BDF8", marginBottom: 12, ...urS } }, isUr ? `\u{1F4C5} \u062F\u0646 ${lessonDay.day}` : `\u{1F4C5} Day ${lessonDay.day}`), lessonDay.words && lessonDay.words.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { marginBottom: 10 } }, "opposite" in w || "oppositeUr" in w ? /* @__PURE__ */ React.createElement(OppositeWordRow, { en: w.en, ur: w.ur, opposite: w.opposite, oppositeUr: w.oppositeUr }) : "comp" in w || "super" in w ? /* @__PURE__ */ React.createElement(AdjWordRow, { en: w.en, ur: w.ur, comp: w.comp, sup: w.super }) : "v2" in w || "v3" in w ? /* @__PURE__ */ React.createElement(VerbWordRow, { en: w.en, ur: w.ur, v2: w.v2, v3: w.v3 }) : /* @__PURE__ */ React.createElement(WordRow, { en: w.en, ur: w.ur }), !sub.showWordSentences && w.meaning && /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" } }, "\u2192 ", w.meaning), sub.showWordSentences && (w.sentence || w.meaning) && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, paddingLeft: 14, paddingRight: 14 } }, /* @__PURE__ */ React.createElement(
        SpeakableSentence,
        {
          text: w.sentence || w.meaning,
          lang: "en",
          buttonStyle: { background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.24)", color: "#E0F2FE", marginBottom: 0, justifyContent: "flex-start", width: "100%" }
        }
      )))), lessonDay.pairs && lessonDay.pairs.map((pair, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "word-row", style: { cursor: "default", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: pair.left, lang: "en" })), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--accent)", fontWeight: 800 } }, "\u2194"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: pair.right, lang: "en" })))), lessonDay.paragraph && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: "#22C55E", marginTop: 12, marginBottom: 8, fontFamily: "'Baloo 2',sans-serif" } }, isUr ? "\u{1F4D6} \u067E\u06CC\u0631\u0627\u06AF\u0631\u0627\u0641" : "\u{1F4D6} Practice Paragraph"), lessonDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
        const found = (lessonDay.words || []).find((w) => s2.toLowerCase().includes((w.en || "").toLowerCase().split(" ")[0].replace("(", "")));
        const hasOpposites = (lessonDay.words || []).some((w) => "opposite" in w || "oppositeUr" in w);
        const sentenceHighlights = (lessonDay.words || []).map((w) => w.en).filter(Boolean).filter((word) => s2.toLowerCase().includes(normalizeHighlightTerm(word)));
        const paragraphSentence = hasOpposites ? stripInlineUrduForKnownWords(s2, lessonDay.words || []) : s2;
        return hasOpposites ? /* @__PURE__ */ React.createElement(MixedUrduParagraphSentence, { key: i, text: paragraphSentence, highlight: sentenceHighlights }) : /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: sentenceHighlights });
      }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(lessonDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph")), lessonDay.difficult && lessonDay.difficult.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 800, color: "#F59E0B", marginTop: 12, marginBottom: 8, fontFamily: "'Baloo 2',sans-serif" } }, isUr ? "\u{1F4DA} \u0645\u0634\u06A9\u0644 \u0627\u0644\u0641\u0627\u0638" : "\u{1F4DA} Difficult Words"), lessonDay.difficult.map((w, i) => /* @__PURE__ */ React.createElement(WordRow, { key: i, en: w.en, ur: w.ur })))))), mathSubTab === "examples" && sub.sentencePairs && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#38BDF8", marginBottom: 10 } }, sub.examplesLabel || "\u{1F5E3}\uFE0F Sentences"), regroupSentencePairs(sub.sentencePairs, daySectionSettings.sentences.itemsPerDay).map((group) => /* @__PURE__ */ React.createElement("div", { key: group.day, style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { color: "#94A3B8", fontSize: 12, fontWeight: 800, marginBottom: 8 } }, language === "ur" ? `\u0633\u06CC\u0679 ${group.day}` : `Set ${group.day}`), group.sentencePairs.map((pair, i) => /* @__PURE__ */ React.createElement(SentencePairRow, { key: `${group.day}_${i}`, en: pair.en, ur: pair.ur })))), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(sub.sentencePairs.map((pair) => pair.en).join(" ")) }, "\u25B6\uFE0F Play All English Sentences")), mathSubTab === "examples" && !sub.dayLessons && !sub.sentencePairs && sub.examples && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: urS }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#38BDF8", marginBottom: 10, ...urS } }, sub.examplesLabel || (isUr ? "\u{1F4A1} \u0645\u062B\u0627\u0644\u06CC\u06BA" : "\u{1F4A1} Examples")), sub.examples.map((ex, i) => /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: ex, lang: isUr ? "ur" : "en" })), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", style: isUr ? { fontFamily: "'Noto Nastaliq Urdu',serif", direction: "rtl" } : {}, onClick: () => playAll(sub.examples.join(". ")) }, isUr ? "\u25B6\uFE0F \u0633\u0628 \u0633\u0646\u06CC\u06BA" : "\u25B6\uFE0F Play All Examples")), mathSubTab === "exercises" && (sub.exerciseGroups || sub.exercises) && /* @__PURE__ */ React.createElement("div", { style: urS }, sub.exerciseGroups && subExerciseGroupIdx === null ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { color: "#22C55E", marginBottom: 12, direction: isUr ? "rtl" : "ltr", textAlign: isUr ? "right" : "left" } }, isUr ? "\u270F\uFE0F \u0645\u0634\u0642 \u06A9\u06D2 \u062F\u0646" : "\u270F\uFE0F Exercise Days"), sub.exerciseGroups.map((group, gi) => /* @__PURE__ */ React.createElement("div", { key: group.label, className: "adverb-day-card", onClick: () => {
        setSubExerciseGroupIdx(gi);
        setRevealedEx({});
      }, style: { display: "flex", alignItems: "center", gap: 14, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 40, borderRadius: 12, background: "#22C55E22", border: "2px solid #22C55E", color: "#22C55E", fontSize: 16, fontWeight: 800, fontFamily: "'Baloo 2',sans-serif", flexShrink: 0 } }, gi + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: isUr ? "right" : "left" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 700, margin: 0, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, group.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, isUr ? "\u0627\u0646 \u062F\u0646\u0648\u06BA \u06A9\u06CC \u062A\u0645\u0627\u0645 \u0645\u0634\u0642\u06CC\u06BA" : "All exercises for these days"))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, activeExerciseGroup && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: { marginBottom: 14, ...urS } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#22C55E", margin: 0, ...urS } }, activeExerciseGroup.label), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", style: { width: "auto", marginTop: 0, padding: "10px 14px", background: "linear-gradient(135deg,#475569,#334155)" }, onClick: () => {
        setSubExerciseGroupIdx(null);
        setRevealedEx({});
      } }, isUr ? "\u2190 \u062F\u0646\u0648\u06BA \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A" : "\u2190 Back to Day Groups"))), exercisesToRender && exercisesToRender.map((ex, ei) => {
        const qColors = ["#38BDF8", "#22C55E", "#F59E0B", "#A855F7", "#EC4899", "#14B8A6", "#F97316", "#6366F1"];
        const qc = qColors[ei % qColors.length];
        const isColumnMatch = ex.q === "Match the columns:" || ex.q === "\u06A9\u0627\u0644\u0645 \u0645\u0644\u0627\u0626\u06CC\u06BA:";
        const matchOrder = isColumnMatch && ex.ans ? ex.ans.map((_, i) => i) : [];
        if (isColumnMatch && matchOrder.length > 1) {
          for (let i = matchOrder.length - 1; i > 0; i--) {
            const swapIndex = ((ei + 1) * (i + 3) + ex.q.length) % (i + 1);
            [matchOrder[i], matchOrder[swapIndex]] = [matchOrder[swapIndex], matchOrder[i]];
          }
          if (matchOrder.every((value, index) => value === index)) {
            matchOrder.push(matchOrder.shift());
          }
        }
        return /* @__PURE__ */ React.createElement("div", { key: ei, className: "adverb-detail-section", style: { marginBottom: 14, ...urS } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", direction: isUr ? "rtl" : "ltr", alignItems: "center", gap: 10, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 36, height: 36, borderRadius: 10, background: qc + "22", border: "2px solid " + qc, color: qc, fontSize: 13, fontWeight: 800, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif" } }, isUr ? "\u0633" + (ei + 1) : "Q" + (ei + 1)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: ex.q, lang: isUr ? "ur" : "en" }))), isColumnMatch ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(15,23,42,0.55)", border: "1px solid rgba(56,189,248,0.25)", borderRadius: 12, padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#38BDF8", fontSize: 12, fontWeight: 800, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif" } }, isUr ? "\u06A9\u0627\u0644\u0645 A" : "Column A"), /* @__PURE__ */ React.createElement("span", { style: { color: "#94A3B8", fontSize: 11, fontWeight: 700, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif" } }, isUr ? "\u0635\u062D\u06CC\u062D \u062C\u0648\u0627\u0628 \u06A9\u0627\u0644\u0645 B \u0645\u06CC\u06BA" : "Show correct from Column B")), ex.parts.map((p, pi) => {
          const rk = ei + "_A_" + pi;
          const pc = qColors[(ei + pi + 1) % qColors.length];
          const displayP = p.replace(/(\d)̲/g, "[$1]").replace(/(\d)\u0332/g, "[$1]");
          return /* @__PURE__ */ React.createElement("div", { key: "A_" + pi, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: isUr ? 0 : 4, paddingRight: isUr ? 4 : 0, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, borderRadius: 8, background: pc + "18", border: "1.5px solid " + pc + "66", color: pc, fontSize: 11, fontWeight: 800, fontFamily: "'Baloo 2',sans-serif", flexShrink: 0 } }, "A", pi + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: displayP, lang: isUrduText(displayP) ? "ur" : "en" })), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleReveal(rk), style: getRevealToggleStyle(revealedEx[rk], isUr) }, revealedEx[rk] ? isUr ? "\u0686\u06BE\u067E\u0627\u0626\u06CC\u06BA" : "Hide" : isUr ? "\u062F\u06A9\u06BE\u0627\u0626\u06CC\u06BA" : "Show"), revealedEx[rk] && ex.ans && ex.ans[pi] && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "100%" } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: formatListedAnswer(ex.ans[pi]), lang: isUrduText(ex.ans[pi]) ? "ur" : "en", fullWidth: false, buttonStyle: revealedAnswerButtonStyle, textStyle: getRevealedAnswerTextStyle(isUrduText(ex.ans[pi])) })));
        })), /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(15,23,42,0.55)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 12, padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#F59E0B", fontSize: 12, fontWeight: 800, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif" } }, isUr ? "\u06A9\u0627\u0644\u0645 B" : "Column B"), /* @__PURE__ */ React.createElement("span", { style: { color: "#94A3B8", fontSize: 11, fontWeight: 700, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif" } }, isUr ? "\u0635\u062D\u06CC\u062D \u062C\u0648\u0627\u0628 \u06A9\u0627\u0644\u0645 A \u0645\u06CC\u06BA" : "Show correct from Column A")), ex.ans && matchOrder.map((originalIndex, pi) => {
          const rk = ei + "_B_" + originalIndex;
          const pc = qColors[(ei + pi + 3) % qColors.length];
          const a = ex.ans[originalIndex];
          return /* @__PURE__ */ React.createElement("div", { key: "B_" + pi, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: isUr ? 0 : 4, paddingRight: isUr ? 4 : 0, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, borderRadius: 8, background: pc + "18", border: "1.5px solid " + pc + "66", color: pc, fontSize: 11, fontWeight: 800, fontFamily: "'Baloo 2',sans-serif", flexShrink: 0 } }, "B", pi + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: a, lang: isUrduText(a) ? "ur" : "en" })), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleReveal(rk), style: getRevealToggleStyle(revealedEx[rk], isUr) }, revealedEx[rk] ? isUr ? "\u0686\u06BE\u067E\u0627\u0626\u06CC\u06BA" : "Hide" : isUr ? "\u062F\u06A9\u06BE\u0627\u0626\u06CC\u06BA" : "Show"), revealedEx[rk] && ex.parts && ex.parts[originalIndex] && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "100%" } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: formatListedAnswer(ex.parts[originalIndex]), lang: isUrduText(ex.parts[originalIndex]) ? "ur" : "en", fullWidth: false, buttonStyle: revealedAnswerButtonStyle, textStyle: getRevealedAnswerTextStyle(isUrduText(ex.parts[originalIndex])) })));
        }))) : ex.parts.map((p, pi) => {
          const rk = ei + "_" + pi;
          const pc = qColors[(ei + pi + 1) % qColors.length];
          const displayP = p.replace(/(\d)̲/g, "[$1]").replace(/(\d)\u0332/g, "[$1]");
          const promptVisual = getSimpleMachinePromptVisual(sub, ex, displayP);
          return /* @__PURE__ */ React.createElement("div", { key: pi, style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, paddingLeft: isUr ? 0 : 8, paddingRight: isUr ? 8 : 0, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 28, height: 28, borderRadius: 8, background: pc + "18", border: "1.5px solid " + pc + "66", color: pc, fontSize: 11, fontWeight: 800, fontFamily: "'Baloo 2',sans-serif", flexShrink: 0 } }, String.fromCharCode(97 + pi)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, display: "flex", alignItems: "center", gap: 8 } }, promptVisual, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: displayP, lang: isUrduText(displayP) ? "ur" : "en" }))), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleReveal(rk), style: getRevealToggleStyle(revealedEx[rk], isUr) }, revealedEx[rk] ? isUr ? "\u0686\u06BE\u067E\u0627\u0626\u06CC\u06BA" : "Hide" : isUr ? "\u062F\u06A9\u06BE\u0627\u0626\u06CC\u06BA" : "Show"), revealedEx[rk] && ex.ans && ex.ans[pi] && /* @__PURE__ */ React.createElement("div", { style: { maxWidth: "100%" } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: formatListedAnswer(ex.ans[pi]), lang: isUrduText(ex.ans[pi]) ? "ur" : "en", fullWidth: false, buttonStyle: revealedAnswerButtonStyle, textStyle: getRevealedAnswerTextStyle(isUrduText(ex.ans[pi])) })));
        }));
      }), sub.wordProblems && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: { marginBottom: 14, ...urS } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#F59E0B", fontSize: 14, marginBottom: 10, ...urS } }, isUr ? "\u{1F30D} \u0639\u0645\u0644\u06CC \u0633\u0648\u0627\u0644\u0627\u062A" : "\u{1F30D} Word Problems"), sub.wordProblems.map((wp, wi) => {
        const isObj = typeof wp === "object";
        const qText = isObj ? wp.q : wp;
        const aText = isObj ? wp.a : null;
        return /* @__PURE__ */ React.createElement("div", { key: wi, style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", direction: isUr ? "rtl" : "ltr", alignItems: "flex-start", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 32, height: 32, borderRadius: 10, background: "#F59E0B22", border: "2px solid #F59E0B", color: "#F59E0B", fontSize: 12, fontWeight: 800, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "'Baloo 2',sans-serif", flexShrink: 0 } }, isUr ? "\u0645" + (wi + 1) : "W" + (wi + 1)), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: qText, lang: isUr ? "ur" : "en" }))), aText && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, marginLeft: isUr ? 0 : 42, marginRight: isUr ? 42 : 0, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("div", { style: wordProblemAnswerPanelStyle }, /* @__PURE__ */ React.createElement("div", { style: wordProblemAnswerLabelStyle(isUr) }, isUr ? "\u2705 \u062C\u0648\u0627\u0628" : "\u2705 Answer"), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: formatListedAnswer(aText), lang: isUr ? "ur" : "en", buttonStyle: { ...revealedAnswerButtonStyle, marginBottom: 0 }, textStyle: { ...getRevealedAnswerTextStyle(isUr), lineHeight: 1.55 } }))));
      })))), mathSubTab === "quiz" && (sub.quizGroups || sub.quiz) && (sub.quizGroups ? subQuizGroupIdx === null ? /* @__PURE__ */ React.createElement("div", { style: urS }, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { color: "#F59E0B", marginBottom: 12, direction: isUr ? "rtl" : "ltr", textAlign: isUr ? "right" : "left" } }, isUr ? "\u{1F3AF} \u06A9\u0648\u0626\u0632 \u06A9\u06D2 \u062F\u0646" : "\u{1F3AF} Quiz Days"), sub.quizGroups.map((group, gi) => /* @__PURE__ */ React.createElement("div", { key: group.label, className: "adverb-day-card", onClick: () => setSubQuizGroupIdx(gi), style: { display: "flex", alignItems: "center", gap: 14, direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 40, height: 40, borderRadius: 12, background: "#F59E0B22", border: "2px solid #F59E0B", color: "#F59E0B", fontSize: 16, fontWeight: 800, fontFamily: "'Baloo 2',sans-serif", flexShrink: 0 } }, gi + 1), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: isUr ? "right" : "left" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 700, margin: 0, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, group.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-secondary)", marginTop: 4, fontFamily: isUr ? "'Noto Nastaliq Urdu',serif" : "inherit" } }, isUr ? "\u0627\u0646 \u062F\u0646\u0648\u06BA \u06A9\u06D2 \u0633\u0648\u0627\u0644\u0627\u062A" : "Quiz questions for these days"))))) : /* @__PURE__ */ React.createElement("div", { style: urS }, activeQuizGroup && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: { marginBottom: 14, ...urS } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", direction: isUr ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#F59E0B", margin: 0, ...urS } }, activeQuizGroup.label), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", style: { width: "auto", marginTop: 0, padding: "10px 14px", background: "linear-gradient(135deg,#475569,#334155)" }, onClick: () => setSubQuizGroupIdx(null) }, isUr ? "\u2190 \u062F\u0646\u0648\u06BA \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A" : "\u2190 Back to Day Groups"))), quizToRender && /* @__PURE__ */ React.createElement(MathSubQuiz, { key: "mq_" + mathSubIdx + "_" + subQuizGroupIdx, questions: quizToRender, isUrdu: selectedSubject?.id === "urdu" })) : /* @__PURE__ */ React.createElement(MathSubQuiz, { key: "mq_" + mathSubIdx, questions: sub.quiz, isUrdu: selectedSubject?.id === "urdu" })));
    })(), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && !selectedVocabDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "lesson-detail" }, /* @__PURE__ */ React.createElement("h2", null, selectedLesson.title), /* @__PURE__ */ React.createElement("p", null, selectedLesson.content)), /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English \u2192 English voice | Tap Urdu \u2192 Urdu voice | 55 Days of Vocabulary"), pacedVocab.map((day) => /* @__PURE__ */ React.createElement("div", { key: day.day, className: "adverb-day-card", onClick: () => setSelectedVocabDay(day) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, getDayDisplayLabel(day.day, language)), /* @__PURE__ */ React.createElement("h3", null, day.words.map((w) => w.en).join(" \u2022 ")), /* @__PURE__ */ React.createElement("div", { className: "word-preview" }, day.words.map((w, i) => /* @__PURE__ */ React.createElement("span", { key: i, className: "word-chip" }, w.ur)))))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasVocab && selectedVocabDay && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap English word \u2192 English voice | Tap Urdu \u2192 Urdu voice | Tap sentence \u2192 hear it!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4DD} Day ", selectedVocabDay.day, " \u2014 Words"), selectedVocabDay.words.map((w, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { marginBottom: 10 } }, /* @__PURE__ */ React.createElement(WordRow, { en: w.en, ur: w.ur }), /* @__PURE__ */ React.createElement("div", { style: { padding: "4px 14px", fontSize: 12, color: "var(--text-muted)", fontStyle: "italic" } }, "\u2192 ", w.meaning)))), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} Practice Paragraph"), selectedVocabDay.paragraph.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => {
      const sentenceHighlights = selectedVocabDay.words.map((w) => w.en).filter(Boolean).filter((word) => s2.toLowerCase().includes(normalizeHighlightTerm(word)));
      return /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en", highlight: sentenceHighlights });
    }), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedVocabDay.paragraph) }, "\u25B6\uFE0F Play Entire Paragraph"))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && !selectedTensePara && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "lesson-detail" }, /* @__PURE__ */ React.createElement("h2", null, selectedLesson.title), /* @__PURE__ */ React.createElement("p", null, selectedLesson.content)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 8, marginBottom: 10 } }, [{ id: "present", label: "\u{1F550} Present", c: "#38BDF8" }, { id: "past", label: "\u{1F551} Past", c: "#F59E0B" }, { id: "future", label: "\u{1F552} Future", c: "#22C55E" }].map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => {
      setTenseMain(t.id);
      setTenseSub("simple");
    }, style: { flex: 1, padding: "10px 6px", borderRadius: 10, border: tenseMain === t.id ? "2px solid " + t.c : "1px solid rgba(148,163,184,0.15)", background: tenseMain === t.id ? t.c + "22" : "rgba(30,41,59,0.6)", color: tenseMain === t.id ? t.c : "#94A3B8", fontFamily: "'Baloo 2', sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer" } }, t.label))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 14 } }, [{ id: "simple", label: "Simple" }, { id: "continuous", label: "Continuous" }, { id: "perfect", label: "Perfect" }, { id: "perfectContinuous", label: "Perf. Cont." }].map((t) => /* @__PURE__ */ React.createElement("button", { key: t.id, onClick: () => setTenseSub(t.id), style: { flex: 1, padding: "8px 3px", borderRadius: 8, border: tenseSub === t.id ? "2px solid #E879F9" : "1px solid rgba(148,163,184,0.15)", background: tenseSub === t.id ? "rgba(232,121,249,0.15)" : "rgba(30,41,59,0.6)", color: tenseSub === t.id ? "#E879F9" : "#64748B", fontFamily: "'Baloo 2', sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer" } }, t.label))), TENSES[tenseMain] && TENSES[tenseMain][tenseSub] && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section", style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("h3", { style: { color: "#E879F9" } }, TENSES[tenseMain][tenseSub].name), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ur)", direction: "rtl", marginTop: 4 } }, TENSES[tenseMain][tenseSub].nameUr), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#38BDF8", marginTop: 8, fontWeight: 600, background: "rgba(56,189,248,0.08)", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(56,189,248,0.2)" } }, "\u{1F4D0} ", TENSES[tenseMain][tenseSub].formula)), /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap any sentence to hear it read aloud!"), TENSES[tenseMain][tenseSub].items.map((item, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "adverb-day-card", onClick: () => setSelectedTensePara(item) }, /* @__PURE__ */ React.createElement("span", { className: "day-num" }, "Paragraph ", i + 1), /* @__PURE__ */ React.createElement("h3", null, item.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "var(--text-secondary)", marginTop: 4 } }, item.para.substring(0, 80), "..."))))), tab === "home" && selectedLesson && !quizActive && !quizDone && selectedLesson.hasTenses && selectedTensePara && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tts-hint" }, "\u{1F50A} Tap any sentence to hear it read aloud!"), /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u{1F4D6} ", selectedTensePara.title), selectedTensePara.para.split(/(?<=[.!?])\s+/).filter(Boolean).map((s2, i) => /* @__PURE__ */ React.createElement(SpeakableSentence, { key: i, text: s2, lang: "en" })), /* @__PURE__ */ React.createElement("button", { className: "play-all-btn", onClick: () => playAll(selectedTensePara.para) }, "\u25B6\uFE0F Play Entire Paragraph")), selectedTensePara.qs && /* @__PURE__ */ React.createElement("div", { className: "adverb-detail-section" }, /* @__PURE__ */ React.createElement("h3", null, "\u2753 Comprehension Questions"), selectedTensePara.qs.map((q, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { padding: "10px 14px", marginBottom: 6, borderRadius: 10, border: "1px solid rgba(148,163,184,0.15)", background: "rgba(30,41,59,0.6)", fontSize: 14, color: "#F1F5F9" } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#F59E0B", fontWeight: 700, marginRight: 8 } }, "Q", i + 1, "."), q)))), tab === "home" && quizActive && !quizDone && currentQuiz.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "quiz-container" }, /* @__PURE__ */ React.createElement("div", { className: "quiz-progress" }, currentQuiz.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "qp-dot" + (i < quizIdx ? " done" : i === quizIdx ? " current" : "") }))), /* @__PURE__ */ React.createElement("div", { className: "quiz-question" }, /* @__PURE__ */ React.createElement("div", { className: "q-num" }, "Question ", quizIdx + 1, " of ", currentQuiz.length), /* @__PURE__ */ React.createElement("h3", { className: selectedSubject?.id === "urdu" ? "urdu-text" : "" }, currentQuiz[quizIdx].q)), /* @__PURE__ */ React.createElement("div", { className: "quiz-options" }, currentQuiz[quizIdx].a.map((opt, oi) => {
      const sel = quizAnswers[quizIdx] === oi, cor = oi === currentQuiz[quizIdx].c;
      let cls = "quiz-option";
      if (quizRevealed && cor) cls += " correct";
      else if (quizRevealed && sel && !cor) cls += " wrong";
      else if (sel) cls += " selected";
      return /* @__PURE__ */ React.createElement("button", { key: oi, className: cls, disabled: quizRevealed, onClick: () => {
        if (quizRevealed) return;
        const na = [...quizAnswers];
        na[quizIdx] = oi;
        setQuizAnswers(na);
        setQuizRevealed(true);
        setTimeout(() => {
          if (quizIdx < currentQuiz.length - 1) {
            setQuizIdx(quizIdx + 1);
            setQuizRevealed(false);
          } else {
            finishQuiz(na, currentQuiz);
            setQuizActive(false);
          }
        }, 1200);
      } }, /* @__PURE__ */ React.createElement("span", { className: "opt-letter" }, "ABCD"[oi]), /* @__PURE__ */ React.createElement("span", { className: selectedSubject?.id === "urdu" ? "urdu-text" : "" }, opt));
    }))), tab === "home" && quizDone && /* @__PURE__ */ React.createElement("div", { className: "quiz-result" }, /* @__PURE__ */ React.createElement("div", { className: "result-emoji" }, quizScore === 4 ? "\u{1F3C6}" : quizScore >= 3 ? "\u{1F31F}" : quizScore >= 2 ? "\u{1F44D}" : "\u{1F4AA}"), /* @__PURE__ */ React.createElement("h2", null, quizScore === 4 ? "Perfect!" : quizScore >= 3 ? "Great Job!" : quizScore >= 2 ? "Good Try!" : "Keep Practicing!"), /* @__PURE__ */ React.createElement("p", { className: "score-text" }, "You scored"), /* @__PURE__ */ React.createElement("div", { className: "score-big " + (quizScore >= 3 ? "high" : quizScore >= 2 ? "mid" : "low") }, quizScore, "/", currentQuiz.length), /* @__PURE__ */ React.createElement("p", { className: "score-text" }, "+", quizScore * 25 + (quizScore === 4 ? 50 : 0), " XP earned"), newBadges.map((bid) => {
      const b = BADGES.find((x) => x.id === bid);
      return b ? /* @__PURE__ */ React.createElement("div", { key: bid, className: "badge-earned" }, /* @__PURE__ */ React.createElement("span", { className: "badge-icon" }, b.icon), /* @__PURE__ */ React.createElement("div", { className: "badge-info" }, /* @__PURE__ */ React.createElement("h4", null, "Badge Earned: ", b.name, "!"), /* @__PURE__ */ React.createElement("p", null, b.desc))) : null;
    }), /* @__PURE__ */ React.createElement("div", { className: "result-actions" }, /* @__PURE__ */ React.createElement("button", { className: "retry-btn", onClick: () => {
      setQuizActive(true);
      setQuizDone(false);
      setQuizIdx(0);
      setQuizAnswers([]);
      setQuizRevealed(false);
      setQuizStartTime(Date.now());
      setNewBadges([]);
    } }, "\u{1F504} Retry"), /* @__PURE__ */ React.createElement("button", { className: "next-btn", onClick: () => {
      setQuizDone(false);
      setSelectedLesson(null);
      setNewBadges([]);
    } }, "\u{1F4DA} More Lessons"))), tab === "progress" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "stat-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F4DD}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, totalQuizzesDone), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(joinLocalizedText("Quizzes Done", "\u0645\u06A9\u0645\u0644 \u06A9\u0648\u0626\u0632", language), language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F3AF}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, totalQuizzesDone > 0 ? Math.round(totalScore / (totalQuizzesDone * 4) * 100) : 0, "%"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(joinLocalizedText("Avg Score", "\u0627\u0648\u0633\u0637 \u0627\u0633\u06A9\u0648\u0631", language), language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F525}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, streak), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(joinLocalizedText("Day Streak", "\u062F\u0646\u0648\u06BA \u06A9\u0627 \u062A\u0633\u0644\u0633\u0644", language), language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u2B50"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, xp), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(joinLocalizedText("Total XP", "\u06A9\u0644 \u0627\u06CC\u06A9\u0633 \u067E\u06CC", language), language)))), /* @__PURE__ */ React.createElement("h3", { className: "section-title" }, renderLocalizedTextNode(joinLocalizedText("Subject Progress", "\u0645\u0636\u0627\u0645\u06CC\u0646 \u06A9\u06CC \u067E\u06CC\u0634 \u0631\u0641\u062A", language), language)), SUBJECTS.map((subj) => {
      const ls = getLessons(subj.id, grade), done = ls.filter((l) => completedQuizzes[l.id]).length, pct = ls.length > 0 ? Math.round(done / ls.length * 100) : 0;
      return /* @__PURE__ */ React.createElement("div", { key: subj.id, className: "progress-bar-container" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-label" }, /* @__PURE__ */ React.createElement("span", null, subj.icon, " ", subj.name), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, done, "/", ls.length)), /* @__PURE__ */ React.createElement("div", { className: "progress-bar-track" }, /* @__PURE__ */ React.createElement("div", { className: "progress-bar-fill", style: { width: pct + "%", background: subj.color } })));
    })), tab === "review" && /* @__PURE__ */ React.createElement(React.Fragment, null, !activeReviewCard && !reviewSessionDone && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "stat-grid" }, /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F552}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, formatNumberLabel(reviewStats.due || 0)), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(ui.dueReviews, language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u2705"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, formatNumberLabel(reviewStats.reviewedToday || 0)), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(ui.reviewedToday, language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F4DA}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, formatNumberLabel(reviewStats.learning || 0)), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(ui.learningWords, language))), /* @__PURE__ */ React.createElement("div", { className: "stat-card" }, /* @__PURE__ */ React.createElement("div", { className: "stat-icon" }, "\u{1F3C6}"), /* @__PURE__ */ React.createElement("div", { className: "stat-value" }, formatNumberLabel(reviewStats.retentionRate || 0), "%"), /* @__PURE__ */ React.createElement("div", { className: "stat-label" }, renderLocalizedTextNode(ui.retentionRate, language)))), /* @__PURE__ */ React.createElement("div", { className: "lesson-detail", style: { textAlign: isUrduUi(language) ? "right" : "left", direction: isUrduUi(language) ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("h2", null, renderLocalizedTextNode(ui.reviewReady, language)), /* @__PURE__ */ React.createElement("p", null, renderLocalizedTextNode(ui.reviewHint, language)), /* @__PURE__ */ React.createElement("button", { className: "start-quiz-btn", onClick: handleStartReview, disabled: reviewLoading }, reviewLoading ? "..." : `\u{1F9E0} ${ui.startReview}`), reviewStats.due === 0 && /* @__PURE__ */ React.createElement("p", { style: { marginTop: 12, color: "var(--text-muted)" } }, renderLocalizedTextNode(ui.noReviewsDue, language)))), activeReviewCard && !reviewSessionDone && /* @__PURE__ */ React.createElement("div", { className: "lesson-detail", style: { direction: isUrduUi(language) ? "rtl" : "ltr" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { className: "lesson-num" }, renderLocalizedTextNode(joinLocalizedText(`Card ${reviewIdx + 1} of ${reviewQueue.length}`, `\u06A9\u0627\u0631\u0688 ${reviewIdx + 1} \u0627\u0632 ${reviewQueue.length}`, language), language)), /* @__PURE__ */ React.createElement("span", { className: "grade-tag", style: { marginTop: 0 } }, activeReviewCard.sectionLabel)), /* @__PURE__ */ React.createElement("h2", { style: { marginBottom: 18 } }, activeReviewCard.prompt), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 } }, /* @__PURE__ */ React.createElement("button", { className: "grade-btn active", style: { minWidth: 130 }, onClick: () => window.HomeSchoolUtils.speakText(activeReviewCard.prompt, "en") }, "\u{1F50A} ", renderLocalizedTextNode(joinLocalizedText("Speak", "\u0633\u0646\u06CC\u06BA", language), language)), /* @__PURE__ */ React.createElement("button", { className: "grade-btn", style: { minWidth: 170 }, onClick: () => setReviewReveal((value) => !value) }, renderLocalizedTextNode(ui.revealAnswer, language))), reviewReveal && /* @__PURE__ */ React.createElement("div", { style: reviewRevealCardStyle }, /* @__PURE__ */ React.createElement(SpeakableSentence, { text: activeReviewCard.answer, lang: "ur", fullWidth: true, buttonStyle: reviewAnswerButtonStyle, textStyle: { fontSize: 24 } }), activeReviewCard.meaning && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-secondary)", marginBottom: 8 } }, activeReviewCard.meaning), (activeReviewCard.opposite || activeReviewCard.oppositeUr) && /* @__PURE__ */ React.createElement("div", { style: { color: "var(--text-secondary)", marginBottom: 8 } }, renderLocalizedTextNode(joinLocalizedText(`Opposite: ${activeReviewCard.opposite} / ${activeReviewCard.oppositeUr}`, `\u0645\u062A\u0636\u0627\u062F: ${activeReviewCard.oppositeUr} / ${activeReviewCard.opposite}`, language), language)), activeReviewCard.example && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6, color: "var(--text-secondary)", fontWeight: 700 } }, /* @__PURE__ */ React.createElement("strong", null, renderLocalizedTextNode(ui.reviewExample, language), ":")), /* @__PURE__ */ React.createElement(SpeakableSentence, { text: activeReviewCard.example, lang: "en", fullWidth: true, buttonStyle: reviewExampleButtonStyle, textStyle: { fontSize: 16, lineHeight: 1.6 } }))), /* @__PURE__ */ React.createElement("div", { className: "result-actions" }, /* @__PURE__ */ React.createElement("button", { className: "retry-btn", onClick: () => handleReviewResponse("again") }, renderLocalizedTextNode(ui.reviewAgain, language)), /* @__PURE__ */ React.createElement("button", { className: "retry-btn", style: { borderColor: "#22C55E55", color: "#22C55E" }, onClick: () => handleReviewResponse("good") }, renderLocalizedTextNode(ui.reviewGood, language)), /* @__PURE__ */ React.createElement("button", { className: "next-btn", onClick: () => handleReviewResponse("easy") }, renderLocalizedTextNode(ui.reviewEasy, language)))), reviewSessionDone && /* @__PURE__ */ React.createElement("div", { className: "quiz-result" }, /* @__PURE__ */ React.createElement("div", { className: "result-emoji" }, "\u{1F9E0}"), /* @__PURE__ */ React.createElement("h2", null, renderLocalizedTextNode(ui.reviewComplete, language)), /* @__PURE__ */ React.createElement("p", { className: "score-text" }, renderLocalizedTextNode(ui.reviewEarnedXp, language)), /* @__PURE__ */ React.createElement("div", { className: "score-big high" }, "+", reviewSessionXp), /* @__PURE__ */ React.createElement("div", { className: "result-actions" }, /* @__PURE__ */ React.createElement("button", { className: "retry-btn", onClick: () => {
      resetReviewSession();
      setTab("home");
    } }, renderLocalizedTextNode(ui.home, language)), /* @__PURE__ */ React.createElement("button", { className: "next-btn", onClick: () => {
      resetReviewSession();
      handleStartReview();
    } }, renderLocalizedTextNode(ui.startReview, language))))), tab === "badges" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "var(--text-secondary)" } }, earnedBadges.length, " of ", BADGES.length, " badges earned")), /* @__PURE__ */ React.createElement("div", { className: "badge-grid" }, BADGES.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "badge-card " + (earnedBadges.includes(b.id) ? "earned" : "locked") }, /* @__PURE__ */ React.createElement("div", { className: "badge-big-icon" }, b.icon), /* @__PURE__ */ React.createElement("h4", null, b.name), /* @__PURE__ */ React.createElement("p", null, b.desc))))), tab === "tutor" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "tutor-chat" }, chatMessages.map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "chat-bubble " + (m.role === "ai" ? "ai" : "user") }, m.text)), chatLoading && /* @__PURE__ */ React.createElement("div", { className: "chat-bubble ai" }, /* @__PURE__ */ React.createElement("div", { className: "typing-dots" }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null))), /* @__PURE__ */ React.createElement("div", { ref: chatEndRef })), /* @__PURE__ */ React.createElement("div", { className: "chat-input-area" }, /* @__PURE__ */ React.createElement("input", { value: chatInput, onChange: (e) => setChatInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendChat(), placeholder: "Ask your tutor anything..." }), /* @__PURE__ */ React.createElement("button", { onClick: sendChat, disabled: chatLoading }, "\u27A4"))), tab === "settings" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "settings-item", style: isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row-reverse" } : {} }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, renderLocalizedTextNode(joinLocalizedText("Student Name", "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645", language), language), ":"), /* @__PURE__ */ React.createElement("span", { className: "si-value" }, studentName ? renderDirectionalName(studentName, "ltr", isUrduUi(language) ? { fontFamily: "var(--font)" } : {}) : renderLocalizedTextNode(joinLocalizedText("Not set", "\u062F\u0631\u062C \u0646\u06C1\u06CC\u06BA", language), language))), (studentNameUr || language !== "en") && /* @__PURE__ */ React.createElement("div", { className: "settings-item", style: isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row-reverse" } : {} }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, renderLocalizedTextNode(joinLocalizedText("Urdu Name", "\u0627\u0631\u062F\u0648 \u0646\u0627\u0645", language), language), ":"), /* @__PURE__ */ React.createElement("span", { className: "si-value" }, localizedNames.ur ? renderDirectionalName(localizedNames.ur, "rtl", { fontFamily: "var(--font-ur)" }) : renderLocalizedTextNode("\u062F\u0631\u062C \u0646\u06C1\u06CC\u06BA", "ur"))), /* @__PURE__ */ React.createElement("div", { className: "settings-item", style: isUrduUi(language) ? { direction: "rtl", textAlign: "right", flexDirection: "row-reverse" } : {} }, /* @__PURE__ */ React.createElement("span", { className: "si-label" }, "\u{1F4DA} ", renderLocalizedTextNode(ui.currentGrade, language)), /* @__PURE__ */ React.createElement("span", { className: "si-value" }, renderGradeValueNode(ui.grade, grade, language))), /* @__PURE__ */ React.createElement("div", { className: "settings-profile-card", style: isUrduUi(language) ? { direction: "rtl", textAlign: "right" } : {} }, /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 0, marginBottom: 12 } }, renderLocalizedTextNode(joinLocalizedText("Edit Names", "\u0646\u0627\u0645 \u062A\u0628\u062F\u06CC\u0644 \u06A9\u0631\u06CC\u06BA", language), language)), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("label", { className: "settings-input-label" }, renderLocalizedTextNode(joinLocalizedText("English Name", "\u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u0646\u0627\u0645", language), language)), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "settings-text-input",
        value: studentName,
        onChange: (event) => setStudentName(event.target.value),
        placeholder: language === "ur" ? "\u0627\u0646\u06AF\u0631\u06CC\u0632\u06CC \u0646\u0627\u0645 \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA..." : "Enter English name...",
        style: { direction: "ltr", textAlign: "left", fontFamily: "var(--font)" }
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "settings-input-label" }, renderLocalizedTextNode(joinLocalizedText("Urdu Name", "\u0627\u0631\u062F\u0648 \u0646\u0627\u0645", language), language)), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "settings-text-input",
        value: studentNameUr,
        onChange: (event) => setStudentNameUr(event.target.value),
        placeholder: language === "en" ? "Enter Urdu name..." : "\u0627\u067E\u0646\u0627 \u0627\u0631\u062F\u0648 \u0646\u0627\u0645 \u062F\u0631\u062C \u06A9\u0631\u06CC\u06BA...",
        style: { direction: "rtl", textAlign: "right", fontFamily: "var(--font-ur)" }
      }
    ))), /* @__PURE__ */ React.createElement("h3", { className: "section-title", style: { marginTop: 20 } }, renderLocalizedTextNode(ui.changeGrade, language)), /* @__PURE__ */ React.createElement("div", { className: "grade-grid" }, GRADES.map((g) => /* @__PURE__ */ React.createElement("button", { key: g.id, className: "grade-btn " + (g.id === grade ? "active" : ""), onClick: () => setGrade(g.id) }, g.id))), SettingsPanel ? /* @__PURE__ */ React.createElement(
      SettingsPanel,
      {
        currentVersion,
        updateAvailable,
        storageLabel,
        versionInfo: versionManagerRef.current?.getVersionInfo?.(),
        onCheckUpdates: handleCheckUpdates,
        onRefreshData: handleRefreshData,
        onExportProgress: handleExportProgress,
        onImportProgress: handleImportProgress,
        onResetProgress: handleResetProgress,
        onFullReset: handleFullReset,
        onToggleTTS: () => setTtsEnabled((value) => !value),
        ttsEnabled,
        language,
        onLanguageChange: setLanguage,
        themeMode,
        onThemeModeChange: setThemeMode,
        dailyReviewCap,
        onDailyReviewCapChange: setDailyReviewCap,
        daySectionSettings,
        onDaySectionChange: handleDaySectionChange,
        installStatusLabel,
        offlineStatusLabel,
        networkStatusLabel,
        canInstallApp,
        onInstallApp: handleInstallApp,
        canReloadApp: serviceWorkerStatus === "update-ready",
        onReloadApp: applyServiceWorkerUpdate,
        labels: ui
      }
    ) : null)), /* @__PURE__ */ React.createElement("div", { className: "bottom-nav" }, [{ id: "home", icon: "\u{1F3E0}", label: ui.home }, { id: "progress", icon: "\u{1F4CA}", label: ui.progress }, { id: "review", icon: "\u{1F9E0}", label: ui.review }, { id: "badges", icon: "\u{1F3C6}", label: ui.badges }, { id: "tutor", icon: "\u{1F916}", label: ui.tutor }, { id: "settings", icon: "\u2699\uFE0F", label: ui.settings }].map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, className: "nav-item " + (tab === item.id ? "active" : ""), style: isUrduUi(language) ? { fontFamily: "var(--font-ur)" } : {}, onClick: () => {
      if (item.id === "home") {
        goHome();
        return;
      }
      window.speechSynthesis.cancel();
      setTab(item.id);
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
      if (item.id !== "review") resetReviewSession();
    } }, /* @__PURE__ */ React.createElement("span", { className: "nav-icon" }, item.icon), renderLocalizedTextNode(item.label, language)))))));
  }
  window.HomeSchoolAppModule = { HomeschoolApp };
  if (!window.__HOME_SCHOOL_BOOTSTRAPPED__ && document.getElementById("root")) {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(/* @__PURE__ */ React.createElement(HomeschoolApp, null));
    window.__HOME_SCHOOL_BOOTSTRAPPED__ = true;
  }
})();
