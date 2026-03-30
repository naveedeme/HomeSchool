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
    return String(text || "")
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
    return window.HomeSchoolPrefs?.ttsEnabled !== false;
  }

  function speakText(text, lang = "en") {
    if (!isTtsEnabled()) return null;
    const utterance = new SpeechSynthesisUtterance(ttsClean(text));
    const voices = window.speechSynthesis.getVoices();
    const isUrdu = lang === "ur";
    utterance.lang = isUrdu ? "ur-PK" : "en-US";
    utterance.rate = isUrdu ? 0.8 : 0.85;
    const preferredVoice = isUrdu
      ? voices.find((voice) => voice.lang.startsWith("ur")) || voices.find((voice) => voice.lang.startsWith("hi")) || voices.find((voice) => voice.lang.includes("IN"))
      : voices.find((voice) => voice.lang.startsWith("en") && voice.localService) || voices.find((voice) => voice.lang.startsWith("en"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    return utterance;
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
    ttsClean,
    speakText,
    calculateXP,
    calculateStreak,
    checkBadges,
    formatDate,
    downloadJson,
    isTtsEnabled,
  };
})();
