(() => {
  "use strict";

  const STORE_KEY = "homeschool_state";

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write failures in static/offline mode.
    }
  }

  function localStorageFallback(key, data) {
    try {
      if (typeof data === "undefined") {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(key, JSON.stringify(data));
      return data;
    } catch {
      return null;
    }
  }

  function debounce(callback, wait) {
    let timeoutId = null;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback(...args), wait);
    };
  }

  function chunkArray(items, size) {
    const normalizedSize = Math.max(1, Number(size) || 1);
    const chunks = [];
    for (let index = 0; index < items.length; index += normalizedSize) {
      chunks.push(items.slice(index, index + normalizedSize));
    }
    return chunks;
  }

  function splitIntoSentences(text) {
    return String(text || "")
      .split(/(?<=[.!?۔؟])\s+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function mapSentencesToWords(sentences, wordCount) {
    const totalWords = Math.max(0, Number(wordCount) || 0);
    if (!sentences.length || totalWords === 0) return Array.from({ length: totalWords }, () => []);

    if (totalWords <= sentences.length) {
      return Array.from({ length: totalWords }, (_, index) => {
        const start = Math.floor((index * sentences.length) / totalWords);
        const end = Math.floor(((index + 1) * sentences.length) / totalWords);
        return sentences.slice(start, Math.max(start + 1, end));
      });
    }

    return Array.from({ length: totalWords }, (_, index) => {
      const sentenceIndex = Math.min(sentences.length - 1, Math.floor((index * sentences.length) / totalWords));
      return sentences[sentenceIndex] ? [sentences[sentenceIndex]] : [];
    });
  }

  function numToWords(n) {
    if (n === 0) return "zero";
    const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    const scales = ["", "thousand", "million", "billion", "trillion"];
    if (n < 0) return "negative " + numToWords(-n);

    let words = "";
    let scaleIndex = 0;
    let value = n;

    while (value > 0) {
      const chunk = value % 1000;
      if (chunk !== 0) {
        let chunkWords = "";
        const hundreds = Math.floor(chunk / 100);
        const remainder = chunk % 100;
        if (hundreds > 0) chunkWords += ones[hundreds] + " hundred ";
        if (remainder > 0) {
          if (hundreds > 0) chunkWords += "and ";
          if (remainder < 20) chunkWords += ones[remainder];
          else chunkWords += tens[Math.floor(remainder / 10)] + (remainder % 10 ? " " + ones[remainder % 10] : "");
        }
        words = chunkWords.trim() + (scales[scaleIndex] ? " " + scales[scaleIndex] : "") + (words ? " " : "") + words;
      }
      value = Math.floor(value / 1000);
      scaleIndex += 1;
    }

    return words.trim();
  }

  function ttsClean(text) {
    const source = String(text || "");
    const normalized = /[\u0600-\u06FF]/.test(source)
      ? source.replace(/\s*\/\s*/g, " ")
      : source;
    return normalized
      .replace(/\[(\d+)\]/g, "$1")
      .replace(/₹|Rs\.?\s*/g, "Rupees ")
      .replace(/→/g, " to ")
      .replace(/(\d)\s*>\s*(\d)/g, "$1 greater than $2")
      .replace(/(\d)\s*<\s*(\d)/g, "$1 less than $2")
      .replace(/_{3,}/g, " ")
      .replace(/[≈≥≤]/g, (match) => match === "≈" ? " approximately " : match === "≥" ? " greater than or equal to " : " less than or equal to ")
      .replace(/×/g, " times ")
      .replace(/÷/g, " divided by ")
      .replace(/\d{1,3}(,\d{3})+/g, (match) => numToWords(parseInt(match.replace(/,/g, ""), 10)))
      .replace(/\b\d{4,}\b/g, (match) => numToWords(parseInt(match, 10)))
      .replace(/\s+/g, " ")
      .trim();
  }

  function isTtsEnabled() {
    return window.HomeSchoolPrefs?.ttsEnabled !== false && window.HomeSchoolPrefs?.audioMuted !== true;
  }

  function getSpeechConfig(lang = "en", voices = window.speechSynthesis?.getVoices?.() || []) {
    const prefs = window.HomeSchoolPrefs || {};
    const langKey = lang === "ur" ? "ur" : "en";
    const defaultRate = langKey === "ur" ? 0.8 : 0.85;
    const configuredRate = Number(prefs.ttsRate?.[langKey]);
    const rate = Number.isFinite(configuredRate) && configuredRate > 0 ? configuredRate : defaultRate;
    const configuredVoice = String(prefs.ttsVoiceSelections?.[langKey] || "").trim();
    const fallbackVoice = langKey === "ur"
      ? voices.find((voice) => voice.lang.startsWith("ur")) || voices.find((voice) => voice.lang.startsWith("hi")) || voices.find((voice) => voice.lang.includes("IN"))
      : voices.find((voice) => voice.lang.startsWith("en") && voice.localService) || voices.find((voice) => voice.lang.startsWith("en"));
    const voice = configuredVoice
      ? voices.find((entry) => (entry.voiceURI || entry.name) === configuredVoice) || fallbackVoice
      : fallbackVoice;
    return {
      lang: voice?.lang || (langKey === "ur" ? "ur-PK" : "en-US"),
      rate,
      voice: voice || null,
    };
  }

  function speakText(text, lang = "en") {
    if (!isTtsEnabled()) return null;
    const utterance = new SpeechSynthesisUtterance(ttsClean(text));
    const speechConfig = getSpeechConfig(lang, window.speechSynthesis.getVoices());
    utterance.lang = speechConfig.lang;
    utterance.rate = speechConfig.rate;
    if (speechConfig.voice) utterance.voice = speechConfig.voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  function playFeedbackSound(kind = "correct") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const context = new AudioCtx();
      const now = context.currentTime;
      const createTone = (frequency, start, duration, gainValue, type = "sine") => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + duration);
      };
      if (kind === "correct") {
        createTone(392, now, 0.28, 0.05, "triangle");
        createTone(523.25, now + 0.08, 0.34, 0.045, "triangle");
        createTone(659.25, now + 0.16, 0.42, 0.04, "triangle");
      } else {
        createTone(220, now, 0.22, 0.03, "sine");
        createTone(196, now + 0.08, 0.26, 0.028, "sine");
      }
      window.setTimeout(() => {
        context.close?.();
      }, 900);
    } catch {
      // Ignore audio feedback failures in unsupported or locked-down environments.
    }
  }

  function calculateXP(score, total, timeBonus = false) {
    if (!total) return 0;
    const baseXp = Math.round((score / total) * 100);
    const perfectBonus = score === total ? 50 : 0;
    const speedBonus = timeBonus ? 25 : 0;
    return baseXp + perfectBonus + speedBonus;
  }

  function calculateStreak(lastDate, today) {
    const todayDate = new Date(today);
    const last = lastDate ? new Date(lastDate) : null;
    if (!last) return 1;

    const msPerDay = 24 * 60 * 60 * 1000;
    const diff = Math.round((new Date(todayDate.toDateString()) - new Date(last.toDateString())) / msPerDay);
    if (diff === 0) return null;
    if (diff === 1) return "increment";
    return 1;
  }

  function checkBadges(stats, earnedBadges = []) {
    const known = new Set(earnedBadges);
    const newlyEarned = [];
    const award = (badge) => {
      if (!known.has(badge)) {
        known.add(badge);
        newlyEarned.push(badge);
      }
    };

    if ((stats.totalQuizzes || 0) >= 1) award("first_quiz");
    if ((stats.totalQuizzes || 0) >= 5) award("five_quizzes");
    if ((stats.totalQuizzes || 0) >= 10) award("ten_quizzes");
    if ((stats.streak || 0) >= 3) award("streak_3");
    if ((stats.streak || 0) >= 7) award("streak_7");
    if ((stats.lastScore || 0) === (stats.lastTotal || 0) && (stats.lastTotal || 0) > 0) award("perfect");
    if ((stats.lastTimeSpent || Infinity) < 30) award("speed_demon");
    if ((stats.subjectsCompleted || []).length >= 5) award("all_subjects");

    return {
      earnedBadges: Array.from(known),
      newlyEarned,
    };
  }

  function formatDate(timestamp) {
    if (!timestamp) return "";
    try {
      return new Date(timestamp).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return String(timestamp);
    }
  }

  function formatBytes(bytes) {
    const value = Number(bytes) || 0;
    if (!value) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let size = value;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size >= 10 ? size.toFixed(0) : size.toFixed(1)} ${units[unitIndex]}`;
  }

  async function getStorageEstimateLabel(fallbackLabel = "IndexedDB + localStorage") {
    try {
      if (!navigator.storage?.estimate) return fallbackLabel;
      const estimate = await navigator.storage.estimate();
      const usage = formatBytes(estimate.usage || 0);
      const quota = formatBytes(estimate.quota || 0);
      return `${usage} used / ${quota} available`;
    } catch {
      return fallbackLabel;
    }
  }

  function getResolvedTheme(preference = "system") {
    if (preference === "light" || preference === "dark") return preference;
    try {
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    } catch {
      return "dark";
    }
  }

  function applyThemeMode(preference = "system") {
    const resolvedTheme = getResolvedTheme(preference);
    const root = document.documentElement;
    root.setAttribute("data-theme", resolvedTheme);
    root.style.colorScheme = resolvedTheme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute("content", resolvedTheme === "light" ? "#F8FAFC" : "#0F172A");
    }
    return resolvedTheme;
  }

  function isStandaloneMode() {
    try {
      return Boolean(
        window.matchMedia?.("(display-mode: standalone)").matches ||
        window.navigator.standalone === true
      );
    } catch {
      return false;
    }
  }

  function hideLaunchSplash() {
    const splash = document.getElementById("app-splash");
    if (!splash) return;
    splash.classList.add("is-hidden");
    setTimeout(() => {
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }, 320);
  }

  function canRegisterServiceWorker() {
    if (!("serviceWorker" in navigator)) return { ok: false, reason: "unsupported" };
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    if (protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1") {
      return { ok: true };
    }
    return { ok: false, reason: protocol === "file:" ? "file" : "insecure" };
  }

  async function syncServiceWorkerStatus(registration, onStatus) {
    const activeRegistration = registration || window.__HOME_SCHOOL_SW_REG__ || await navigator.serviceWorker?.getRegistration?.();
    if (!activeRegistration) {
      onStatus?.("error");
      return { ok: false, reason: "missing" };
    }
    if (activeRegistration.waiting) {
      onStatus?.("update-ready");
      return { ok: true, registration: activeRegistration, updateReady: true };
    }
    if (activeRegistration.installing) {
      onStatus?.("caching");
      return { ok: true, registration: activeRegistration, updateReady: false, installing: true };
    }
    onStatus?.("ready");
    return { ok: true, registration: activeRegistration, updateReady: false };
  }

  async function registerServiceWorker(options = {}) {
    const support = canRegisterServiceWorker();
    if (!support.ok) return { registered: false, reason: support.reason };
    try {
      const registration = await navigator.serviceWorker.register("./sw.js");
      window.__HOME_SCHOOL_SW_REG__ = registration;
      options.onStatus?.("checking");

      if (registration.waiting) {
        options.onStatus?.("update-ready");
      }

      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        options.onStatus?.("caching");
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed") {
            options.onStatus?.(navigator.serviceWorker.controller ? "update-ready" : "ready");
          } else if (worker.state === "redundant") {
            options.onStatus?.("error");
          }
        });
      });

      navigator.serviceWorker.ready
        .then(() => syncServiceWorkerStatus(registration, options.onStatus))
        .catch(() => options.onStatus?.("error"));

      registration.update().catch(() => null);

      return { registered: true, registration };
    } catch (error) {
      options.onError?.(error);
      options.onStatus?.("error");
      return { registered: false, reason: "error", error };
    }
  }

  async function checkServiceWorkerForUpdates(options = {}) {
    const support = canRegisterServiceWorker();
    if (!support.ok) return { ok: false, reason: support.reason, updateReady: false };
    try {
      const registration = window.__HOME_SCHOOL_SW_REG__ || await navigator.serviceWorker?.getRegistration?.();
      if (!registration) return { ok: false, reason: "missing", updateReady: false };
      options.onStatus?.("checking");
      await registration.update().catch(() => null);
      return await syncServiceWorkerStatus(registration, options.onStatus);
    } catch (error) {
      options.onStatus?.("error");
      return { ok: false, reason: "error", error, updateReady: false };
    }
  }

  async function applyServiceWorkerUpdate() {
    try {
      const registration = window.__HOME_SCHOOL_SW_REG__ || await navigator.serviceWorker?.getRegistration?.();
      if (registration?.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    } catch {
      // Fall back to reload below.
    }
    window.location.reload();
  }

  async function setPendingReviewBadge(count) {
    try {
      const safeCount = Math.max(0, Number(count) || 0);
      if (safeCount > 0 && navigator.setAppBadge) {
        await navigator.setAppBadge(safeCount);
      } else if (safeCount === 0 && navigator.clearAppBadge) {
        await navigator.clearAppBadge();
      }
    } catch {
      // Ignore unsupported badge APIs.
    }
  }

  function getDayKey(value = Date.now()) {
    const date = value instanceof Date ? value : new Date(value);
    return date.toDateString();
  }

  const REVIEW_INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60, 120];

  function getReviewScheduleUpdate(card, rating, options = {}) {
    const now = Number(options.now) || Date.now();
    const masteryThreshold = Math.max(3, Number(options.masteryThreshold) || 5);
    const intervalScale = Math.max(0.5, Math.min(3, Number(options.intervalScale) || 1));
    const againMinutes = Math.max(5, Math.min(180, Number(options.againMinutes) || 10));
    const currentBox = Math.max(0, Number(card?.box) || 0);
    const normalizedRating = ["again", "good", "easy"].includes(rating) ? rating : "good";

    let nextBox = currentBox;
    let intervalDays = 0;
    let dueAt = now;
    let xpGain = 10;
    let correct = false;

    if (normalizedRating === "again") {
      nextBox = Math.max(0, currentBox - 1);
      intervalDays = 0;
      dueAt = now + (againMinutes * 60 * 1000);
      xpGain = 5;
    } else if (normalizedRating === "easy") {
      nextBox = Math.min(masteryThreshold, Math.max(2, currentBox + 2));
      intervalDays = Math.max(1, Math.round(((REVIEW_INTERVALS[Math.min(nextBox, REVIEW_INTERVALS.length - 1)] || 30) * intervalScale) * 10) / 10);
      dueAt = now + (intervalDays * 24 * 60 * 60 * 1000);
      xpGain = 20;
      correct = true;
    } else {
      nextBox = Math.min(masteryThreshold, Math.max(1, currentBox + 1));
      intervalDays = Math.max(1, Math.round(((REVIEW_INTERVALS[Math.min(nextBox, REVIEW_INTERVALS.length - 1)] || 14) * intervalScale) * 10) / 10);
      dueAt = now + (intervalDays * 24 * 60 * 60 * 1000);
      xpGain = 12;
      correct = true;
    }

    return {
      rating: normalizedRating,
      box: nextBox,
      intervalDays,
      dueAt,
      mastered: nextBox >= masteryThreshold,
      xpGain,
      correct,
      lapses: normalizedRating === "again" ? (Number(card?.lapses) || 0) + 1 : (Number(card?.lapses) || 0),
    };
  }

  function regroupDayEntries(entries, itemsPerDay) {
    const list = Array.isArray(entries) ? entries : [];
    if (!list.length) return [];
    const flattened = [];

    list.forEach((entry) => {
      const words = Array.isArray(entry.words) ? entry.words : [];
      const sentences = splitIntoSentences(entry.paragraph || "");
      const sentenceGroups = mapSentencesToWords(sentences, words.length);
      words.forEach((word, wordIndex) => {
        flattened.push({
          ...word,
          __paragraphSentences: sentenceGroups[wordIndex] || [],
          __difficult: Array.isArray(entry.difficult) ? entry.difficult : [],
          __sourceDay: entry.day,
        });
      });
    });

    const groups = chunkArray(flattened, itemsPerDay);
    return groups.map((group, index) => {
      const paragraphSentences = [];
      const seenSentences = new Set();
      group.forEach((item) => {
        (item.__paragraphSentences || []).forEach((sentence) => {
          const key = sentence.trim();
          if (!key || seenSentences.has(key)) return;
          seenSentences.add(key);
          paragraphSentences.push(sentence);
        });
      });
      const paragraph = paragraphSentences.join(" ");
      const difficult = [];
      const difficultSeen = new Set();
      group.forEach((item) => {
        (item.__difficult || []).forEach((word) => {
          const key = JSON.stringify(word);
          if (!difficultSeen.has(key)) {
            difficultSeen.add(key);
            difficult.push(word);
          }
        });
      });

      return {
        day: index + 1,
        words: group.map((item) => {
          const nextItem = { ...item };
          delete nextItem.__paragraphSentences;
          delete nextItem.__difficult;
          delete nextItem.__sourceDay;
          return nextItem;
        }),
        paragraph,
        paragraphSentences,
        difficult,
        sourceDays: Array.from(new Set(group.map((item) => item.__sourceDay))),
      };
    });
  }

  function regroupSentencePairs(pairs, itemsPerDay) {
    const list = Array.isArray(pairs) ? pairs : [];
    if (!list.length) return [];
    return chunkArray(list, itemsPerDay).map((group, index) => ({
      day: index + 1,
      sentencePairs: group,
      sourceRange: [index * Math.max(1, Number(itemsPerDay) || 1) + 1, index * Math.max(1, Number(itemsPerDay) || 1) + group.length],
    }));
  }

  function validateProgressImport(payload) {
    const errors = [];
    if (!payload || typeof payload !== "object") {
      errors.push("Import file is empty or invalid.");
      return { ok: false, errors };
    }

    if (payload.appState && typeof payload.appState !== "object") {
      errors.push("App state must be an object.");
    }

    if (payload.dbProgress && typeof payload.dbProgress !== "object") {
      errors.push("Database progress must be an object.");
    }

    const progress = payload.dbProgress?.progress;
    const reviewCards = payload.dbProgress?.reviewCards;
    const reviewHistory = payload.dbProgress?.reviewHistory;
    const userStats = payload.dbProgress?.userStats;
    const wordMeta = payload.dbProgress?.wordMeta;
    const customLists = payload.dbProgress?.customLists;
    const customListItems = payload.dbProgress?.customListItems;
    const customizations = payload.dbProgress?.customizations;

    if (typeof progress !== "undefined" && !Array.isArray(progress)) {
      errors.push("Progress rows must be an array.");
    }
    if (typeof reviewCards !== "undefined" && !Array.isArray(reviewCards)) {
      errors.push("Review cards must be an array.");
    }
    if (typeof reviewHistory !== "undefined" && !Array.isArray(reviewHistory)) {
      errors.push("Review history must be an array.");
    }
    if (typeof userStats !== "undefined" && !Array.isArray(userStats)) {
      errors.push("User stats rows must be an array.");
    }
    if (typeof wordMeta !== "undefined" && !Array.isArray(wordMeta)) {
      errors.push("Word metadata must be an array.");
    }
    if (typeof customLists !== "undefined" && !Array.isArray(customLists)) {
      errors.push("Custom lists must be an array.");
    }
    if (typeof customListItems !== "undefined" && !Array.isArray(customListItems)) {
      errors.push("Custom list items must be an array.");
    }
    if (typeof customizations !== "undefined" && !Array.isArray(customizations)) {
      errors.push("Customizations rows must be an array.");
    }

    return {
      ok: errors.length === 0,
      errors,
    };
  }

  function downloadJson(filename, payload) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  }

  window.HomeSchoolUtils = {
    STORE_KEY,
    loadState,
    saveState,
    localStorageFallback,
    debounce,
    chunkArray,
    splitIntoSentences,
    mapSentencesToWords,
    ttsClean,
    speakText,
    playFeedbackSound,
    calculateXP,
    calculateStreak,
    checkBadges,
    formatDate,
    formatBytes,
    getResolvedTheme,
    applyThemeMode,
    isStandaloneMode,
    hideLaunchSplash,
    registerServiceWorker,
    checkServiceWorkerForUpdates,
    applyServiceWorkerUpdate,
    setPendingReviewBadge,
    getDayKey,
    getReviewScheduleUpdate,
    getStorageEstimateLabel,
    regroupDayEntries,
    regroupSentencePairs,
    validateProgressImport,
    downloadJson,
    isTtsEnabled,
    getSpeechConfig,
  };
})();
