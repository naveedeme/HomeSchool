(() => {
  "use strict";

  const db = new Dexie("HomeSchoolDB");

  db.version(4).stores({
    coreData: "id, type, subject, grade, lessonKey",
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey, grade",
    reviewCards: "id, subject, section, dueAt, box, mastered, updatedAt, lastReviewedAt",
    progress: "id, subject, lessonId, grade, completed, timestamp",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
  });

  db.version(5).stores({
    coreData: "id, type, subject, grade, lessonKey",
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey, grade",
    reviewCards: "id, subject, section, dueAt, box, mastered, updatedAt, lastReviewedAt, prompt",
    reviewHistory: "id, cardId, dayKey, reviewedAt, subject, section, rating",
    wordMeta: "id, subject, section, favorite, updatedAt",
    customLists: "id, updatedAt, name",
    customListItems: "id, listId, cardId, updatedAt",
    progress: "id, subject, lessonId, grade, completed, timestamp",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
  });

  db.version(7).stores({
    coreData: "id, type, subject, grade, lessonKey",
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey, grade",
    reviewCards: "id, subject, section, dueAt, box, mastered, updatedAt, lastReviewedAt, prompt",
    reviewHistory: "id, cardId, dayKey, reviewedAt, subject, section, rating",
    wordMeta: "id, subject, section, favorite, updatedAt",
    customLists: "id, updatedAt, name",
    customListItems: "id, listId, cardId, updatedAt",
    progress: "id, subject, lessonId, grade, completed, timestamp",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
  });

  db.version(8).stores({
    coreData: "id, type, subject, grade, lessonKey",
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey, grade",
    reviewCards: "id, subject, section, dueAt, box, mastered, updatedAt, lastReviewedAt, prompt",
    reviewHistory: "id, cardId, dayKey, reviewedAt, subject, section, rating",
    wordMeta: "id, subject, section, favorite, updatedAt",
    customLists: "id, updatedAt, name",
    customListItems: "id, listId, cardId, updatedAt",
    progress: "id, subject, lessonId, grade, completed, timestamp",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
    dictionaryEntries: "&normalized, updatedAt, deletedAt",
    dictionaryOutbox: "&normalized, updatedAt",
    dictionarySyncMeta: "&key, updatedAt",
  });

  function getStatsDefaults() {
    return {
      id: "main",
      xp: 0,
      streak: 0,
      lastQuizDate: null,
      badges: [],
      totalQuizzes: 0,
      totalScore: 0,
      averageScore: 0,
      subjectsCompleted: [],
      lastScore: 0,
      lastTotal: 0,
      lastTimeSpent: null,
      totalReviews: 0,
      correctReviews: 0,
      retentionRate: 0,
      reviewStreak: 0,
      lastReviewDate: null,
      updatedAt: Date.now(),
    };
  }

  function stableSort(value) {
    if (Array.isArray(value)) return value.map(stableSort);
    if (!value || typeof value !== "object") return value;
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = stableSort(value[key]);
      return acc;
    }, {});
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

  function buildSubjectPayload(dataLoader, subjectId) {
    const grades = dataLoader.MANIFEST?.[subjectId]?.grades || [];
    const lessonsByGrade = {};
    const quizzesByGrade = {};

    grades.forEach((grade) => {
      const lessons = dataLoader.getLessons(subjectId, grade) || [];
      lessonsByGrade[grade] = lessons;
      quizzesByGrade[grade] = lessons.reduce((acc, lesson) => {
        const questions = dataLoader.getQuiz(subjectId, grade, lesson.key) || [];
        if (questions.length > 0) acc[lesson.key] = questions;
        return acc;
      }, {});
    });

    const payload = {
      manifest: dataLoader.MANIFEST?.[subjectId] || null,
      lessonsByGrade,
      quizzesByGrade,
    };

    if (subjectId === "english") {
      payload.pos = dataLoader.POS_DATA || {};
      payload.tenses = dataLoader.TENSES_DATA || {};
      payload.vocabulary = dataLoader.VOCABULARY_DATA || [];
      payload.adverbPhrases = dataLoader.ADVERB_PHRASES_DATA || [];
      payload.opposites = dataLoader.ENGLISH_OPPOSITES_DATA || [];
      payload.sentences = dataLoader.ENGLISH_SENTENCE_DATA || [];
    }

    return payload;
  }

  function buildSubjectFingerprints(dataLoader) {
    const fingerprints = {};
    (dataLoader.SUBJECTS || []).forEach((subject) => {
      const payload = buildSubjectPayload(dataLoader, subject.id);
      const serialized = JSON.stringify(stableSort(payload));
      fingerprints[subject.id] = {
        hash: simpleHash(serialized),
        grades: dataLoader.MANIFEST?.[subject.id]?.grades || [],
        lessonCount: Object.values(payload.lessonsByGrade || {}).reduce((sum, lessons) => sum + lessons.length, 0),
        quizCount: Object.values(payload.quizzesByGrade || {}).reduce((sum, quizzes) => sum + Object.keys(quizzes).length, 0),
      };
    });
    return fingerprints;
  }

  function titleCase(value) {
    return String(value || "")
      .replace(/([A-Z])/g, " $1")
      .replace(/[-_]+/g, " ")
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  function looksLikeSentence(value) {
    const text = String(value || "").trim();
    return text.length > 12 && /\s/.test(text) && /[.!?۔؟]$/.test(text);
  }

  function normalizeWordToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\([^)]*\)/g, " ")
      .replace(/[^a-z\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getContextKeywords(prompt, word = {}) {
    const baseTokens = normalizeWordToken(prompt)
      .split(" ")
      .map((token) => token.trim())
      .filter((token) => token.length >= 4);
    const extraTokens = [word.comp, word.super, word.opposite]
      .flatMap((value) => normalizeWordToken(value).split(" "))
      .map((token) => token.trim())
      .filter((token) => token.length >= 4);
    return Array.from(new Set([...baseTokens, ...extraTokens]));
  }

  function isRelevantContext(example, keywords) {
    const text = normalizeWordToken(example);
    if (!text || !keywords.length) return false;
    return keywords.some((keyword) => text.includes(keyword));
  }

  function buildReviewCards(dataLoader) {
    const reviewCards = [];
    const now = Date.now();

    const buildReviewSource = (sectionId, dayValue = null) => {
      if (["adverbs", "prepositions", "adjectives", "conjunctions", "pronouns", "collectiveNouns", "verbs"].includes(sectionId)) {
        return {
          subject: "english",
          lessonKey: "parts_of_speech",
          subSettingKey: sectionId === "collectiveNouns" ? "collectiveNouns" : sectionId,
          posTab: sectionId === "collectiveNouns" ? "nouns" : sectionId,
          day: dayValue,
        };
      }
      if (sectionId === "vocabulary") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsMeanings",
          day: dayValue,
        };
      }
      if (sectionId === "adverbPhrases") {
        return {
          subject: "english",
          lessonKey: "phrases",
          subSettingKey: "adverbPhrases",
          day: dayValue,
        };
      }
      if (sectionId === "opposites") {
        return {
          subject: "english",
          lessonKey: "vocabulary",
          subSettingKey: "wordsOpposites",
          day: dayValue,
        };
      }
      if (sectionId === "sentences") {
        return {
          subject: "english",
          lessonKey: "sentences",
          day: dayValue,
        };
      }
      return {
        subject: "english",
        section: sectionId,
        day: dayValue,
      };
    };

    const addWordEntries = (sectionId, sectionLabel, entries) => {
      (entries || []).forEach((entry) => {
        const paragraph = entry?.paragraph || "";
        const words = entry?.words || [];
        const sentenceGroups = window.HomeSchoolUtils.mapSentencesToWords(
          window.HomeSchoolUtils.splitIntoSentences(paragraph),
          words.length,
        );

        words.forEach((word, index) => {
          const prompt = String(word?.en || "").trim();
          const answer = String(word?.ur || "").trim();
          if (!prompt || !answer) return;
          const rawMeaning = String(word?.meaning || "").trim();
          const directExample = String(word?.example || (looksLikeSentence(rawMeaning) ? rawMeaning : "")).trim();
          const mappedExample = (sentenceGroups[index] || []).join(" ").trim();
          const keywords = getContextKeywords(prompt, word);
          const contextExample = isRelevantContext(directExample, keywords)
            ? directExample
            : isRelevantContext(mappedExample, keywords)
              ? mappedExample
              : "";
          const idSeed = [
            sectionId,
            entry?.day ?? "",
            prompt.toLowerCase(),
            answer,
            rawMeaning,
            word?.opposite || "",
            index,
          ].join("|");
          reviewCards.push({
            id: `review_${sectionId}_${simpleHash(idSeed)}`,
            subject: "english",
            section: sectionId,
            sectionLabel,
            prompt,
            answer,
            meaning: contextExample === directExample && directExample ? "" : rawMeaning,
            opposite: word?.opposite || "",
            oppositeUr: word?.oppositeUr || "",
            example: contextExample,
            day: entry?.day ?? null,
            box: 0,
            intervalDays: 0,
            dueAt: now,
            totalReviews: 0,
            correctReviews: 0,
            mastered: false,
            lapses: 0,
            source: buildReviewSource(sectionId, entry?.day ?? null),
            lastReviewedAt: null,
            createdAt: now,
            updatedAt: now,
          });
        });
      });
    };

    Object.entries(dataLoader.POS_DATA || {}).forEach(([sectionId, entries]) => {
      addWordEntries(sectionId, titleCase(sectionId), entries);
    });
    addWordEntries("vocabulary", "Vocabulary", dataLoader.VOCABULARY_DATA || []);
    addWordEntries("adverbPhrases", "Adverb Phrases", dataLoader.ADVERB_PHRASES_DATA || []);
    addWordEntries("opposites", "Opposites", dataLoader.ENGLISH_OPPOSITES_DATA || []);

    return reviewCards;
  }

  async function getMainStats() {
    return (await db.userStats.get("main")) || getStatsDefaults();
  }

  async function getLatestCustomization(type) {
    const rows = await db.customizations.where("type").equals(type).toArray();
    if (!rows.length) return null;
    return rows.sort((left, right) => (right.ts || 0) - (left.ts || 0))[0];
  }

  async function saveCustomization(type, data) {
    const existing = await getLatestCustomization(type);
    const record = {
      ...(existing || {}),
      type,
      data,
      ts: Date.now(),
    };
    await db.customizations.put(record);
    return record;
  }

  async function getCustomizationsMap() {
    const rows = await db.customizations.toArray();
    return rows.reduce((acc, row) => {
      if (!row?.type) return acc;
      if (!acc[row.type] || (row.ts || 0) >= (acc[row.type].ts || 0)) {
        acc[row.type] = row;
      }
      return acc;
    }, {});
  }

  function normalizeDictionaryEntryRecord(entry) {
    const normalized = String(entry?.normalized || entry?.word || "").trim().toLowerCase();
    if (!normalized) return null;
    return {
      normalized,
      word: String(entry?.word || normalized),
      payload: entry?.payload && typeof entry.payload === "object" ? entry.payload : {},
      sourceRank: Number.isFinite(Number(entry?.sourceRank)) ? Number(entry.sourceRank) : 0,
      updatedAt: Number(entry?.updatedAt) || Date.now(),
      deletedAt: entry?.deletedAt ? Number(entry.deletedAt) || Date.now() : null,
      deviceId: entry?.deviceId ? String(entry.deviceId) : "",
    };
  }

  async function getDictionaryEntries() {
    if (!db.dictionaryEntries) return [];
    return db.dictionaryEntries.toArray();
  }

  async function getDictionaryEntriesMap() {
    const rows = await getDictionaryEntries();
    return rows.reduce((acc, row) => {
      if (!row?.normalized || row.deletedAt) return acc;
      acc[row.normalized] = row;
      return acc;
    }, {});
  }

  async function upsertDictionaryEntries(entries, options = {}) {
    if (!db.dictionaryEntries) return { saved: 0, queued: 0 };
    const queue = options.queue !== false;
    const normalizedEntries = (Array.isArray(entries) ? entries : [])
      .map((entry) => normalizeDictionaryEntryRecord(entry))
      .filter(Boolean);
    if (!normalizedEntries.length) return { saved: 0, queued: 0 };
    await db.dictionaryEntries.bulkPut(normalizedEntries);
    if (queue && db.dictionaryOutbox) {
      const outboxRows = normalizedEntries.map((entry) => ({
        normalized: entry.normalized,
        updatedAt: entry.updatedAt,
        payload: entry.payload,
        deletedAt: entry.deletedAt,
        sourceRank: entry.sourceRank,
        word: entry.word,
        deviceId: entry.deviceId || "",
      }));
      await db.dictionaryOutbox.bulkPut(outboxRows);
    }
    return { saved: normalizedEntries.length, queued: queue ? normalizedEntries.length : 0 };
  }

  async function replaceDictionaryEntries(entries, options = {}) {
    if (!db.dictionaryEntries) return { saved: 0, queued: 0 };
    await db.transaction("rw", [db.dictionaryEntries, db.dictionaryOutbox], async () => {
      await db.dictionaryEntries.clear();
      if (db.dictionaryOutbox) await db.dictionaryOutbox.clear();
      if (Array.isArray(entries) && entries.length > 0) {
        await upsertDictionaryEntries(entries, options);
      }
    });
    return { saved: Array.isArray(entries) ? entries.length : 0, queued: options.queue === false ? 0 : Array.isArray(entries) ? entries.length : 0 };
  }

  async function getDictionaryOutboxEntries(limit = 250) {
    if (!db.dictionaryOutbox) return [];
    const safeLimit = Math.max(1, Number(limit) || 250);
    return db.dictionaryOutbox.orderBy("updatedAt").reverse().limit(safeLimit).toArray();
  }

  async function clearDictionaryOutboxEntries(normalizedWords = []) {
    if (!db.dictionaryOutbox) return 0;
    const keys = (Array.isArray(normalizedWords) ? normalizedWords : [])
      .map((value) => String(value || "").trim().toLowerCase())
      .filter(Boolean);
    if (!keys.length) return 0;
    await db.dictionaryOutbox.bulkDelete(keys);
    return keys.length;
  }

  async function getDictionarySyncMeta(key) {
    if (!db.dictionarySyncMeta) return null;
    return db.dictionarySyncMeta.get(String(key || "").trim());
  }

  async function saveDictionarySyncMeta(key, data) {
    if (!db.dictionarySyncMeta) return null;
    const safeKey = String(key || "").trim();
    if (!safeKey) return null;
    const record = {
      key: safeKey,
      data: data && typeof data === "object" ? data : {},
      updatedAt: Date.now(),
    };
    await db.dictionarySyncMeta.put(record);
    return record;
  }

  function normalizeImportPayload(progressData) {
    return {
      progress: Array.isArray(progressData?.progress) ? progressData.progress : [],
      reviewCards: Array.isArray(progressData?.reviewCards) ? progressData.reviewCards : [],
      reviewHistory: Array.isArray(progressData?.reviewHistory) ? progressData.reviewHistory : [],
      userStats: Array.isArray(progressData?.userStats) ? progressData.userStats : [],
      wordMeta: Array.isArray(progressData?.wordMeta) ? progressData.wordMeta : [],
      customLists: Array.isArray(progressData?.customLists) ? progressData.customLists : [],
      customListItems: Array.isArray(progressData?.customListItems) ? progressData.customListItems : [],
      customizations: Array.isArray(progressData?.customizations) ? progressData.customizations.filter((row) => !isSensitiveCustomizationType(row?.type)) : [],
      dataVersion: progressData?.dataVersion ?? null,
    };
  }

  function isSensitiveCustomizationType(type) {
    return /^ai/i.test(String(type || ""));
  }

  function mergeUniqueRows(existingRows, incomingRows, keyField = "id") {
    const merged = new Map();
    [...existingRows, ...incomingRows].forEach((row) => {
      if (!row || typeof row !== "object") return;
      const key = row[keyField];
      if (typeof key === "undefined" || key === null) return;
      const previous = merged.get(key);
      if (!previous) {
        merged.set(key, row);
        return;
      }
      merged.set(key, (row.timestamp || row.updatedAt || 0) >= (previous.timestamp || previous.updatedAt || 0) ? row : previous);
    });
    return Array.from(merged.values());
  }

  function mergeMainStats(existingStats, incomingStats) {
    if (!incomingStats) return existingStats;
    const existing = existingStats || getStatsDefaults();
    const incoming = incomingStats || getStatsDefaults();
    const totalQuizzes = Math.max(existing.totalQuizzes || 0, incoming.totalQuizzes || 0);
    const totalScore = Math.max(existing.totalScore || 0, incoming.totalScore || 0);
    const totalReviews = Math.max(existing.totalReviews || 0, incoming.totalReviews || 0);
    const correctReviews = Math.max(existing.correctReviews || 0, incoming.correctReviews || 0);
    const updatedAt = Math.max(existing.updatedAt || 0, incoming.updatedAt || 0);
    const latest = (incoming.updatedAt || 0) >= (existing.updatedAt || 0) ? incoming : existing;
    return {
      ...existing,
      ...latest,
      id: "main",
      xp: Math.max(existing.xp || 0, incoming.xp || 0),
      streak: Math.max(existing.streak || 0, incoming.streak || 0),
      totalQuizzes,
      totalScore,
      averageScore: totalQuizzes ? totalScore / totalQuizzes : 0,
      totalReviews,
      correctReviews,
      retentionRate: totalReviews ? Math.round((correctReviews / totalReviews) * 100) : 0,
      reviewStreak: Math.max(existing.reviewStreak || 0, incoming.reviewStreak || 0),
      lastReviewDate: latest.lastReviewDate || existing.lastReviewDate || incoming.lastReviewDate || null,
      badges: Array.from(new Set([...(existing.badges || []), ...(incoming.badges || [])])),
      subjectsCompleted: Array.from(new Set([...(existing.subjectsCompleted || []), ...(incoming.subjectsCompleted || [])])),
      updatedAt,
    };
  }

  function mergeCustomizationRows(existingRows, incomingRows) {
    const merged = new Map();
    [...existingRows, ...incomingRows].forEach((row) => {
      if (!row || typeof row !== "object") return;
      const key = row.type || row.id;
      if (typeof key === "undefined" || key === null) return;
      const previous = merged.get(key);
      if (!previous) {
        merged.set(key, row);
        return;
      }
      merged.set(key, (row.ts || row.updatedAt || 0) >= (previous.ts || previous.updatedAt || 0) ? row : previous);
    });
    return Array.from(merged.values());
  }

  function normalizeAnswerToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildReviewEventId(cardId, reviewedAt, rating) {
    return `review_event_${simpleHash([cardId, reviewedAt, rating].join("|"))}`;
  }

  function normalizeStudyToken(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function buildStandaloneStudyItemId(studyItem) {
    return `study_item_${simpleHash([
      normalizeStudyToken(studyItem?.subject || "english"),
      normalizeStudyToken(studyItem?.section || "general"),
      normalizeStudyToken(studyItem?.prompt || ""),
      normalizeStudyToken(studyItem?.answer || ""),
    ].join("|"))}`;
  }

  function buildCustomListId(name) {
    return `list_${simpleHash([name, Date.now(), Math.random()].join("|"))}`;
  }

  function buildCustomListItemId(listId, cardId) {
    return `list_item_${simpleHash(`${listId}|${cardId}`)}`;
  }

  function buildReviewPriorityScore(card, now = Date.now()) {
    const reviewed = Math.max(0, Number(card?.totalReviews) || 0);
    const accuracy = reviewed > 0 ? (Number(card?.correctReviews) || 0) / reviewed : 0.55;
    const overdueDays = Math.max(0, ((Number(now) || Date.now()) - (Number(card?.dueAt) || Number(now) || Date.now())) / (24 * 60 * 60 * 1000));
    const lapseWeight = Math.max(0, Number(card?.lapses) || 0) * 2.4;
    const lowAccuracyWeight = Math.max(0, 1 - accuracy) * 4.5;
    const learningWeight = Math.max(0, 3 - Math.max(0, Number(card?.box) || 0));
    const newCardWeight = card?.lastReviewedAt ? 0 : 1.35;
    return overdueDays + lapseWeight + lowAccuracyWeight + learningWeight + newCardWeight;
  }

  function enrichReviewCards(cards, metaRows, lists, listItems) {
    const safeCards = Array.isArray(cards) ? cards : [];
    const metaMap = new Map((metaRows || []).map((row) => [row.id, row]));
    const listMap = new Map((lists || []).map((row) => [row.id, row]));
    const cardListsMap = new Map();

    (listItems || []).forEach((item) => {
      if (!item?.cardId || !item?.listId || !listMap.has(item.listId)) return;
      const existing = cardListsMap.get(item.cardId) || [];
      existing.push({
        id: item.listId,
        name: listMap.get(item.listId)?.name || item.listId,
      });
      cardListsMap.set(item.cardId, existing);
    });

    return safeCards.map((card) => {
      const meta = metaMap.get(card.id) || null;
      const listEntries = cardListsMap.get(card.id) || [];
      return {
        ...card,
        source: card.source || null,
        favorite: Boolean(meta?.favorite),
        note: String(meta?.note || ""),
        metaUpdatedAt: meta?.updatedAt || 0,
        studyUpdatedAt: Math.max(Number(card?.updatedAt) || 0, Number(meta?.updatedAt) || 0),
        listIds: listEntries.map((entry) => entry.id),
        listNames: listEntries.map((entry) => entry.name),
      };
    });
  }

  async function getReviewCollectionsSnapshot() {
    const [metaRows, lists, listItems] = await Promise.all([
      db.wordMeta.toArray(),
      db.customLists.toArray(),
      db.customListItems.toArray(),
    ]);
    return { metaRows, lists, listItems };
  }

  async function getOrCreateWordMeta(cardId) {
    const card = await db.reviewCards.get(cardId);
    if (!card) return null;
    const existing = await db.wordMeta.get(cardId);
    if (existing) return existing;
    const created = {
      id: card.id,
      subject: card.subject,
      section: card.section,
      sectionLabel: card.sectionLabel,
      prompt: card.prompt,
      answer: card.answer,
      favorite: false,
      note: "",
      updatedAt: Date.now(),
    };
    await db.wordMeta.put(created);
    return created;
  }

  async function getOrCreateStandaloneWordMeta(studyItem) {
    if (!studyItem?.prompt) return null;
    const id = studyItem.id || buildStandaloneStudyItemId(studyItem);
    const existing = await db.wordMeta.get(id);
    if (existing) {
      if (!existing.source && studyItem.source) {
        const next = {
          ...existing,
          source: studyItem.source,
          updatedAt: Date.now(),
        };
        await db.wordMeta.put(next);
        return next;
      }
      return existing;
    }
    const created = {
      id,
      subject: studyItem.subject || "english",
      section: studyItem.section || "general",
      sectionLabel: studyItem.sectionLabel || titleCase(studyItem.section || "general"),
      prompt: String(studyItem.prompt || "").trim(),
      answer: String(studyItem.answer || "").trim(),
      source: studyItem.source || null,
      favorite: false,
      note: "",
      standalone: true,
      updatedAt: Date.now(),
    };
    await db.wordMeta.put(created);
    return created;
  }

  async function getOrCreateStudyMeta(cardId, studyItem = null) {
    if (studyItem) return getOrCreateStandaloneWordMeta(studyItem);
    return getOrCreateWordMeta(cardId);
  }

  async function ensureReviewCardsSeeded(dataLoader) {
    const currentCount = await db.reviewCards.count();
    if (currentCount > 0) return { repaired: false, count: currentCount };
    if (!dataLoader) return { repaired: false, count: 0 };
    const reviewCards = buildReviewCards(dataLoader);
    if (reviewCards.length > 0) {
      await db.reviewCards.bulkPut(reviewCards);
    }
    return { repaired: reviewCards.length > 0, count: reviewCards.length };
  }

  async function seedData(dataLoader, options = {}) {
    const targetSubjects = options.subjects && options.subjects.length > 0
      ? Array.from(new Set(options.subjects))
      : (dataLoader.SUBJECTS || []).map((subject) => subject.id);
    const fingerprints = options.fingerprints || buildSubjectFingerprints(dataLoader);
    const curriculumRecords = [];
    const quizRecords = [];

    targetSubjects.forEach((subjectId) => {
      const grades = dataLoader.MANIFEST?.[subjectId]?.grades || [];
      grades.forEach((grade) => {
        const lessons = dataLoader.getLessons(subjectId, grade) || [];
        lessons.forEach((lesson) => {
          curriculumRecords.push({
            id: `${subjectId}_${grade}_${lesson.key}`,
            type: "lesson",
            subject: subjectId,
            grade,
            lessonKey: lesson.key,
            data: lesson,
          });

          if (lesson.hasMathSub || lesson.hasTenses || lesson.hasVocab) return;

          const questions = dataLoader.getQuiz(subjectId, grade, lesson.key) || [];
          if (questions.length > 0) {
            quizRecords.push({
              id: `${subjectId}_${grade}_${lesson.key}`,
              subject: subjectId,
              grade,
              lessonKey: lesson.key,
              questions,
            });
          }
        });
      });
    });

    await db.transaction(
      "rw",
      [
        db.coreData,
        db.posData,
        db.tensesData,
        db.vocabData,
        db.mathChapters,
        db.quizData,
        db.reviewCards,
        db.dataVersion,
      ],
      async () => {
        const existingReviewCards = targetSubjects.includes("english")
          ? await db.reviewCards.toArray()
          : [];

        if (!options.subjects) {
          await db.coreData.clear();
          await db.posData.clear();
          await db.tensesData.clear();
          await db.vocabData.clear();
          await db.mathChapters.clear();
          await db.quizData.clear();
          await db.reviewCards.clear();
          await db.dataVersion.clear();
        } else {
          await db.coreData.where("subject").anyOf(targetSubjects).delete();
          await db.quizData.where("subject").anyOf(targetSubjects).delete();
          if (targetSubjects.includes("english")) {
            await db.posData.clear();
            await db.tensesData.clear();
            await db.vocabData.clear();
            await db.reviewCards.clear();
          }
          if (targetSubjects.includes("math")) {
            await db.mathChapters.clear();
          }
        }

        if (curriculumRecords.length > 0) await db.coreData.bulkPut(curriculumRecords);
        if (quizRecords.length > 0) await db.quizData.bulkPut(quizRecords);

        if (targetSubjects.includes("english")) {
          const posData = dataLoader.POS_DATA || {};
          const tensesData = dataLoader.TENSES_DATA || {};
          const vocabularyData = dataLoader.VOCABULARY_DATA || [];

          for (const [type, items] of Object.entries(posData)) {
            if (!Array.isArray(items) || items.length === 0) continue;
            await db.posData.bulkPut(items.map((item) => ({
              ...item,
              type,
              id: `${type}_${item.day}`,
            })));
          }

          for (const main of ["present", "past", "future"]) {
            for (const sub of ["simple", "continuous", "perfect", "perfectContinuous"]) {
              const record = tensesData[main]?.[sub];
              if (!record) continue;
              await db.tensesData.put({
                ...record,
                id: `${main}_${sub}`,
                main,
                sub,
              });
            }
          }

          if (vocabularyData.length > 0) {
            await db.vocabData.bulkPut(vocabularyData.map((item) => ({
              ...item,
              id: `vocab_${item.day}`,
            })));
          }

          const reviewCards = buildReviewCards(dataLoader);
          if (reviewCards.length > 0) {
            const existingReviewMap = new Map(existingReviewCards.map((card) => [card.id, card]));
            await db.reviewCards.bulkPut(reviewCards.map((card) => {
              const existing = existingReviewMap.get(card.id);
              return existing ? {
                ...card,
                box: existing.box || 0,
                intervalDays: existing.intervalDays || 0,
                dueAt: existing.dueAt || card.dueAt,
                totalReviews: existing.totalReviews || 0,
                correctReviews: existing.correctReviews || 0,
                mastered: existing.mastered || false,
                lapses: existing.lapses || 0,
                lastReviewedAt: existing.lastReviewedAt || null,
                createdAt: existing.createdAt || card.createdAt,
                updatedAt: Date.now(),
              } : card;
            }));
          }
        }

        if (targetSubjects.includes("math")) {
          const mathLessons = dataLoader.getLessons("math", 5) || [];
          if (mathLessons.length > 0) {
            await db.mathChapters.bulkPut(mathLessons.map((lesson) => ({
              ...lesson,
              id: `math_${lesson.key}`,
              grade: 5,
            })));
          }
        }

        const currentMeta = await db.dataVersion.get("curriculum");
        const nextFingerprints = options.subjects
          ? { ...(currentMeta?.fingerprints || {}), ...targetSubjects.reduce((acc, subjectId) => {
            acc[subjectId] = fingerprints[subjectId];
            return acc;
          }, {}) }
          : fingerprints;

        await db.dataVersion.put({
          id: "curriculum",
          version: dataLoader.VERSION,
          lastUpdated: Date.now(),
          manifest: dataLoader.MANIFEST,
          fingerprints: nextFingerprints,
          changeLog: window.HomeSchoolDataVersion?.DATA_CHANGELOG || [],
          changedSubjects: targetSubjects,
        });
      },
    );
  }

  window.HomeSchoolDB = {
    db,

    buildSubjectFingerprints,

    async getStoredMetadata() {
      return (await db.dataVersion.get("curriculum")) || null;
    },

    async getStoredVersion() {
      const record = await db.dataVersion.get("curriculum");
      return record?.version ?? null;
    },

    async needsUpdate(currentVersion, dataLoader = null) {
      const storedVersion = await this.getStoredVersion();
      if (storedVersion !== currentVersion) return true;
      if (!dataLoader) return false;
      const currentMeta = await this.getStoredMetadata();
      const storedFingerprints = currentMeta?.fingerprints || {};
      const nextFingerprints = buildSubjectFingerprints(dataLoader);
      return Object.keys(nextFingerprints).some((subjectId) => nextFingerprints[subjectId]?.hash !== storedFingerprints[subjectId]?.hash);
    },

    async ensureSeeded(dataLoader) {
      const refreshResult = await this.refreshData(dataLoader, dataLoader.VERSION);
      await ensureReviewCardsSeeded(dataLoader);
      return refreshResult;
    },

    async refreshData(dataLoader, currentVersion) {
      const storedMeta = await this.getStoredMetadata();
      const nextFingerprints = buildSubjectFingerprints(dataLoader);
      const storedFingerprints = storedMeta?.fingerprints || {};
      const changedSubjects = (dataLoader.SUBJECTS || [])
        .map((subject) => subject.id)
        .filter((subjectId) => nextFingerprints[subjectId]?.hash !== storedFingerprints[subjectId]?.hash);

      if (!storedMeta) {
        await seedData(dataLoader, { fingerprints: nextFingerprints });
        return { refreshed: true, version: currentVersion, changedSubjects: (dataLoader.SUBJECTS || []).map((subject) => subject.id), mode: "full" };
      }

      if (storedMeta.version !== currentVersion) {
        if (changedSubjects.length > 0) {
          await seedData(dataLoader, { subjects: changedSubjects, fingerprints: nextFingerprints });
          return { refreshed: true, version: currentVersion, changedSubjects, mode: "partial" };
        }
        await seedData(dataLoader, { fingerprints: nextFingerprints });
        return { refreshed: true, version: currentVersion, changedSubjects: (dataLoader.SUBJECTS || []).map((subject) => subject.id), mode: "full" };
      }

      if (changedSubjects.length > 0) {
        await seedData(dataLoader, { subjects: changedSubjects, fingerprints: nextFingerprints });
        return { refreshed: true, version: currentVersion, changedSubjects, mode: "partial" };
      }

      const reviewCardCount = await db.reviewCards.count();
      if (reviewCardCount === 0) {
        await seedData(dataLoader, { subjects: ["english"], fingerprints: nextFingerprints });
        return { refreshed: true, version: currentVersion, changedSubjects: ["english"], mode: "repair" };
      }

      return { refreshed: false, version: currentVersion, changedSubjects: [], mode: "noop" };
    },

    async getLessons(subject, grade) {
      const records = await db.coreData.filter((item) => item.subject === subject && item.grade === grade).toArray();
      return records.map((record) => record.data);
    },

    async getQuiz(subject, key, grade = null) {
      if (grade !== null) {
        const record = await db.quizData.get(`${subject}_${grade}_${key}`);
        return record?.questions || [];
      }
      const records = await db.quizData.where("subject").equals(subject).filter((item) => item.lessonKey === key).toArray();
      return records[0]?.questions || [];
    },

    async getDueReviewCards(limit = 20, now = Date.now()) {
      const max = Math.max(1, Number(limit) || 20);
      const rows = await db.reviewCards
        .where("dueAt")
        .belowOrEqual(now)
        .sortBy("dueAt")
        .then((items) => items);
      const collections = await getReviewCollectionsSnapshot();
      return enrichReviewCards(rows, collections.metaRows, collections.lists, collections.listItems)
        .sort((left, right) => {
          const scoreDiff = buildReviewPriorityScore(right, now) - buildReviewPriorityScore(left, now);
          if (scoreDiff !== 0) return scoreDiff;
          return (left.dueAt || 0) - (right.dueAt || 0);
        })
        .slice(0, max);
    },

    async getReviewStats(options = {}) {
      const masteryThreshold = Math.max(3, Number(options.masteryThreshold) || 5);
      const now = Number(options.now) || Date.now();
      const todayKey = window.HomeSchoolUtils.getDayKey(now);
      const cards = await db.reviewCards.toArray();
      const stats = await getMainStats();
      const startOfToday = new Date(now);
      startOfToday.setHours(0, 0, 0, 0);
      const todayHistory = await db.reviewHistory.where("reviewedAt").aboveOrEqual(startOfToday.getTime()).toArray();
      const favorites = await db.wordMeta.filter((row) => row?.favorite === true).count();
      const notedWords = await db.wordMeta.filter((row) => String(row?.note || "").trim().length > 0).count();
      const customLists = await db.customLists.count();
      const due = cards.filter((card) => (card.dueAt || 0) <= now).length;
      const mastered = cards.filter((card) => (card.box || 0) >= masteryThreshold).length;
      const learning = cards.filter((card) => ((card.totalReviews || 0) > 0 || (card.box || 0) > 0) && (card.box || 0) < masteryThreshold).length;
      const newCards = cards.filter((card) => !card.lastReviewedAt).length;
      const reviewedToday = todayHistory.length || cards.filter((card) => card.lastReviewedAt && window.HomeSchoolUtils.getDayKey(card.lastReviewedAt) === todayKey).length;
      const correctToday = todayHistory.filter((row) => row.correct).length;
      const retentionRate = reviewedToday
        ? Math.round((correctToday / reviewedToday) * 100)
        : stats.totalReviews
          ? Math.round(((stats.correctReviews || 0) / stats.totalReviews) * 100)
          : 0;

      return {
        total: cards.length,
        due,
        mastered,
        learning,
        newCards,
        reviewedToday,
        retentionRate,
        reviewStreak: stats.reviewStreak || 0,
        favorites,
        notedWords,
        customLists,
      };
    },

    async getReviewLibrary() {
      const [cards, collections] = await Promise.all([
        db.reviewCards.toArray(),
        getReviewCollectionsSnapshot(),
      ]);
      return enrichReviewCards(cards, collections.metaRows, collections.lists, collections.listItems)
        .sort((left, right) => {
          const sectionDiff = String(left.sectionLabel || left.section || "").localeCompare(String(right.sectionLabel || right.section || ""));
          if (sectionDiff !== 0) return sectionDiff;
          const promptDiff = String(left.prompt || "").localeCompare(String(right.prompt || ""));
          if (promptDiff !== 0) return promptDiff;
          return String(left.answer || "").localeCompare(String(right.answer || ""));
        });
    },

    async getReviewAnalytics(options = {}) {
      const days = Math.max(28, Number(options.days) || 84);
      const weakLimit = Math.max(6, Number(options.weakLimit) || 12);
      const masteryThreshold = Math.max(3, Number(options.masteryThreshold) || 5);
      const intervalScale = Math.max(0.5, Math.min(3, Number(options.intervalScale) || 1));
      const upcomingDays = Math.max(7, Math.min(30, Number(options.upcomingDays) || 14));
      const now = Number(options.now) || Date.now();
      const today = new Date(now);
      const since = new Date(today);
      since.setHours(0, 0, 0, 0);
      since.setDate(since.getDate() - (days - 1));

      const [
        cards,
        historyRows,
        metaRows,
        lists,
        listItems,
      ] = await Promise.all([
        db.reviewCards.toArray(),
        db.reviewHistory.where("reviewedAt").aboveOrEqual(since.getTime()).toArray(),
        db.wordMeta.toArray(),
        db.customLists.toArray(),
        db.customListItems.toArray(),
      ]);

      const enrichedCards = enrichReviewCards(cards, metaRows, lists, listItems);
      const historyByDay = new Map();
      historyRows.forEach((row) => {
        const key = row.dayKey || window.HomeSchoolUtils.getDayKey(row.reviewedAt || now);
        const current = historyByDay.get(key) || { count: 0, correct: 0 };
        current.count += 1;
        current.correct += row.correct ? 1 : 0;
        historyByDay.set(key, current);
      });

      const heatmap = [];
      let maxCount = 0;
      for (let offset = 0; offset < days; offset += 1) {
        const day = new Date(today);
        day.setHours(0, 0, 0, 0);
        day.setDate(day.getDate() - offset);
        const dayKey = window.HomeSchoolUtils.getDayKey(day);
        const stats = historyByDay.get(dayKey) || { count: 0, correct: 0 };
        if (stats.count > maxCount) maxCount = stats.count;
        heatmap.push({
          dayKey,
          dateLabel: day.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          weekday: day.toLocaleDateString(undefined, { weekday: "short" }),
          count: stats.count,
          correct: stats.correct,
          accuracy: stats.count ? Math.round((stats.correct / stats.count) * 100) : 0,
          level: 0,
        });
      }
      heatmap.forEach((cell) => {
        if (!cell.count || !maxCount) {
          cell.level = 0;
          return;
        }
        const ratio = cell.count / maxCount;
        cell.level = ratio >= 0.8 ? 4 : ratio >= 0.55 ? 3 : ratio >= 0.3 ? 2 : 1;
      });

      const weakWords = enrichedCards
        .map((card) => {
          const totalReviews = Math.max(0, Number(card.totalReviews) || 0);
          const correctReviews = Math.max(0, Number(card.correctReviews) || 0);
          const accuracy = totalReviews ? Math.round((correctReviews / totalReviews) * 100) : 0;
          const overdueDays = Math.max(0, Math.round(((now - (card.dueAt || now)) / (24 * 60 * 60 * 1000)) * 10) / 10);
          const weakScore = buildReviewPriorityScore(card, now) + Math.max(0, Number(card.lapses) || 0);
          return {
            ...card,
            accuracy,
            overdueDays,
            weakScore,
          };
        })
        .filter((card) => card.totalReviews > 0 || card.lapses > 0 || (card.dueAt || 0) <= now)
        .sort((left, right) => right.weakScore - left.weakScore)
        .slice(0, weakLimit);

      const cardMap = new Map(enrichedCards.map((card) => [card.id, card]));
      const standaloneStudyItems = (metaRows || [])
        .filter((row) => row?.id && !cardMap.has(row.id))
        .map((row) => ({
          id: row.id,
          subject: row.subject || "english",
          section: row.section || "general",
          sectionLabel: row.sectionLabel || titleCase(row.section || "general"),
          prompt: row.prompt || "",
          answer: row.answer || "",
          source: row.source || null,
          favorite: Boolean(row.favorite),
          note: String(row.note || ""),
          listIds: [],
          listNames: [],
          standalone: true,
          reviewBacked: false,
          studyUpdatedAt: row.updatedAt || 0,
          totalReviews: 0,
          correctReviews: 0,
          lapses: 0,
          dueAt: null,
        }));

      const favoriteWords = [...enrichedCards.filter((card) => card.favorite), ...standaloneStudyItems.filter((item) => item.favorite)]
        .sort((left, right) => (right.studyUpdatedAt || 0) - (left.studyUpdatedAt || 0));

      const notedWords = [...enrichedCards.filter((card) => String(card.note || "").trim().length > 0), ...standaloneStudyItems.filter((item) => String(item.note || "").trim().length > 0)]
        .sort((left, right) => (right.studyUpdatedAt || 0) - (left.studyUpdatedAt || 0));

      const customLists = (lists || [])
        .map((list) => {
          const items = (listItems || [])
            .filter((item) => item.listId === list.id)
            .map((item) => cardMap.get(item.cardId))
            .filter(Boolean);
          return {
            ...list,
            itemCount: items.length,
            items,
          };
        })
        .sort((left, right) => (right.updatedAt || 0) - (left.updatedAt || 0));

      const weeklyBuckets = new Map();
      const categoryMap = new Map();
      const sinceLast7 = new Date(today);
      sinceLast7.setHours(0, 0, 0, 0);
      sinceLast7.setDate(sinceLast7.getDate() - 6);
      const recentHistory = historyRows.filter((row) => (row.reviewedAt || 0) >= sinceLast7.getTime());
      const uniqueReviewedLast7 = new Set(recentHistory.map((row) => row.cardId)).size;

      historyRows.forEach((row) => {
        const reviewedAt = Number(row.reviewedAt) || now;
        const weekStart = new Date(reviewedAt);
        weekStart.setHours(0, 0, 0, 0);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekKey = weekStart.toISOString().slice(0, 10);
        const weekRow = weeklyBuckets.get(weekKey) || {
          weekKey,
          label: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          reviews: 0,
          correct: 0,
          cards: new Set(),
        };
        weekRow.reviews += 1;
        weekRow.correct += row.correct ? 1 : 0;
        if (row.cardId) weekRow.cards.add(row.cardId);
        weeklyBuckets.set(weekKey, weekRow);

        const categoryKey = `${row.subject || "general"}__${row.section || "general"}`;
        const categoryRow = categoryMap.get(categoryKey) || {
          id: categoryKey,
          subject: row.subject || "general",
          section: row.section || "general",
          sectionLabel: row.sectionLabel || titleCase(row.section || "general"),
          reviews: 0,
          correct: 0,
          cards: new Set(),
        };
        categoryRow.reviews += 1;
        categoryRow.correct += row.correct ? 1 : 0;
        if (row.cardId) categoryRow.cards.add(row.cardId);
        categoryMap.set(categoryKey, categoryRow);
      });

      const wordGrowth = Array.from(weeklyBuckets.values())
        .sort((left, right) => String(left.weekKey).localeCompare(String(right.weekKey)))
        .slice(-8)
        .map((bucket) => ({
          weekKey: bucket.weekKey,
          label: bucket.label,
          reviews: bucket.reviews,
          uniqueCards: bucket.cards.size,
          accuracy: bucket.reviews ? Math.round((bucket.correct / bucket.reviews) * 100) : 0,
        }));

      const categoryPerformance = Array.from(categoryMap.values())
        .map((entry) => ({
          id: entry.id,
          subject: entry.subject,
          section: entry.section,
          sectionLabel: entry.sectionLabel,
          reviews: entry.reviews,
          uniqueCards: entry.cards.size,
          accuracy: entry.reviews ? Math.round((entry.correct / entry.reviews) * 100) : 0,
        }))
        .sort((left, right) => {
          if (right.reviews !== left.reviews) return right.reviews - left.reviews;
          return left.sectionLabel.localeCompare(right.sectionLabel);
        })
        .slice(0, 10);

      const leitnerBoxes = Array.from({ length: masteryThreshold + 1 }, (_, boxIndex) => {
        const count = enrichedCards.filter((card) => Math.max(0, Number(card.box) || 0) === boxIndex).length;
        return {
          box: boxIndex,
          label: boxIndex >= masteryThreshold ? "Mastered" : `Box ${boxIndex}`,
          count,
        };
      });

      const forgettingBuckets = [
        { id: "same_day", label: "Same day", min: 0, max: 0.99 },
        { id: "day_1", label: "1 day", min: 1, max: 1.99 },
        { id: "days_2_3", label: "2-3 days", min: 2, max: 3.99 },
        { id: "days_4_7", label: "4-7 days", min: 4, max: 7.99 },
        { id: "days_8_14", label: "8-14 days", min: 8, max: 14.99 },
        { id: "days_15_plus", label: "15+ days", min: 15, max: Number.POSITIVE_INFINITY },
      ].map((bucket) => ({ ...bucket, reviews: 0, correct: 0 }));

      historyRows.forEach((row) => {
        const delay = Math.max(0, Number(row.intervalDays) || 0);
        const bucket = forgettingBuckets.find((entry) => delay >= entry.min && delay <= entry.max);
        if (!bucket) return;
        bucket.reviews += 1;
        bucket.correct += row.correct ? 1 : 0;
      });

      const forgettingCurve = forgettingBuckets.map((bucket) => ({
        id: bucket.id,
        label: bucket.label,
        reviews: bucket.reviews,
        accuracy: bucket.reviews ? Math.round((bucket.correct / bucket.reviews) * 100) : 0,
      }));

      const upcomingCalendar = Array.from({ length: upcomingDays }, (_, offset) => {
        const date = new Date(now);
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + offset);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        const dueCount = enrichedCards.filter((card) => {
          const dueAt = Number(card.dueAt) || 0;
          return dueAt >= date.getTime() && dueAt < nextDate.getTime();
        }).length;
        return {
          dayKey: window.HomeSchoolUtils.getDayKey(date),
          label: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
          weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
          dueCount,
          isToday: offset === 0,
        };
      });

      const REVIEW_INTERVALS = [0, 1, 2, 4, 7, 14, 30, 60, 120];
      const estimateMasteryAt = (card) => {
        const currentBox = Math.max(0, Number(card?.box) || 0);
        if (currentBox >= masteryThreshold) return Number(card?.lastReviewedAt) || now;
        let projectedAt = Math.max(now, Number(card?.dueAt) || now);
        for (let nextBox = currentBox + 1; nextBox <= masteryThreshold; nextBox += 1) {
          const baseInterval = REVIEW_INTERVALS[Math.min(nextBox, REVIEW_INTERVALS.length - 1)] || 120;
          projectedAt += Math.max(1, Math.round((baseInterval * intervalScale) * 24 * 60 * 60 * 1000));
        }
        return projectedAt;
      };

      const unmasteredCards = enrichedCards.filter((card) => Math.max(0, Number(card.box) || 0) < masteryThreshold);
      const sectionPredictionMap = new Map();
      unmasteredCards.forEach((card) => {
        const key = `${card.subject || "general"}__${card.section || "general"}`;
        const current = sectionPredictionMap.get(key) || {
          id: key,
          subject: card.subject || "general",
          section: card.section || "general",
          sectionLabel: card.sectionLabel || titleCase(card.section || "general"),
          cardsRemaining: 0,
          projectedAt: 0,
        };
        current.cardsRemaining += 1;
        current.projectedAt = Math.max(current.projectedAt, estimateMasteryAt(card));
        sectionPredictionMap.set(key, current);
      });
      const predictedMastery = {
        cardsRemaining: unmasteredCards.length,
        projectedAt: unmasteredCards.length ? Math.max(...unmasteredCards.map((card) => estimateMasteryAt(card))) : now,
        sections: Array.from(sectionPredictionMap.values())
          .sort((left, right) => left.projectedAt - right.projectedAt)
          .slice(0, 8),
      };

      return {
        heatmap,
        weakWords,
        favoriteWords,
        notedWords,
        customLists,
        wordGrowth,
        categoryPerformance,
        leitnerBoxes,
        forgettingCurve,
        upcomingCalendar,
        predictedMastery,
        totals: {
          reviewedLastPeriod: historyRows.length,
          reviewedLast7: recentHistory.length,
          uniqueReviewedLast7,
          favorites: favoriteWords.length,
          notedWords: notedWords.length,
          customLists: customLists.length,
        },
      };
    },

    async getPosData(type) {
      return db.posData.where("type").equals(type).sortBy("day");
    },

    async getAllPosTypes() {
      const records = await db.posData.toArray();
      const grouped = {};
      records.forEach((record) => {
        if (!grouped[record.type]) grouped[record.type] = [];
        grouped[record.type].push(record);
      });
      Object.keys(grouped).forEach((key) => grouped[key].sort((a, b) => a.day - b.day));
      return grouped;
    },

    async getTenses(main, sub) {
      return db.tensesData.get(`${main}_${sub}`);
    },

    async getAllTenses() {
      const records = await db.tensesData.toArray();
      const grouped = {};
      records.forEach((record) => {
        if (!grouped[record.main]) grouped[record.main] = {};
        grouped[record.main][record.sub] = record;
      });
      return grouped;
    },

    async getVocab() {
      return db.vocabData.orderBy("day").toArray();
    },

    async getMathChapters(grade) {
      return db.mathChapters.where("grade").equals(grade).toArray();
    },

    async saveQuizResult(subject, lessonId, score, total, timeSpent, grade = null, badges = []) {
      const today = new Date().toDateString();
      const stats = await getMainStats();
      const streakMode = window.HomeSchoolUtils.calculateStreak(stats.lastQuizDate, today);
      const nextStreak = streakMode === "increment" ? stats.streak + 1 : streakMode === null ? stats.streak : 1;
      const xpGain = window.HomeSchoolUtils.calculateXP(score, total, timeSpent < 30);
      const subjectsCompleted = Array.from(new Set([...(stats.subjectsCompleted || []), subject]));

      await db.progress.put({
        id: lessonId,
        subject,
        lessonId,
        grade,
        score,
        total,
        completed: true,
        timestamp: Date.now(),
      });

      const totalQuizzes = (stats.totalQuizzes || 0) + 1;
      const totalScore = (stats.totalScore || 0) + score;
      const nextStats = {
        ...stats,
        id: "main",
        xp: (stats.xp || 0) + xpGain,
        streak: nextStreak,
        lastQuizDate: today,
        badges,
        totalQuizzes,
        totalScore,
        averageScore: totalQuizzes ? totalScore / totalQuizzes : 0,
        subjectsCompleted,
        lastScore: score,
        lastTotal: total,
        lastTimeSpent: timeSpent,
        updatedAt: Date.now(),
      };

      await db.userStats.put(nextStats);
      return nextStats;
    },

    async saveReviewResult(cardId, rating, options = {}) {
      const card = await db.reviewCards.get(cardId);
      if (!card) return null;

      const scheduleUpdate = window.HomeSchoolUtils.getReviewScheduleUpdate(card, rating, options);
      const today = new Date().toDateString();
      const stats = await getMainStats();
      const reviewStreakMode = window.HomeSchoolUtils.calculateStreak(stats.lastReviewDate, today);
      const nextReviewStreak = reviewStreakMode === "increment"
        ? (stats.reviewStreak || 0) + 1
        : reviewStreakMode === null
          ? (stats.reviewStreak || 0)
          : 1;
      const streakBonus = reviewStreakMode === "increment" ? 8 : 0;
      const totalReviews = (stats.totalReviews || 0) + 1;
      const correctReviews = (stats.correctReviews || 0) + (scheduleUpdate.correct ? 1 : 0);

      const nextCard = {
        ...card,
        box: scheduleUpdate.box,
        intervalDays: scheduleUpdate.intervalDays,
        dueAt: scheduleUpdate.dueAt,
        mastered: scheduleUpdate.mastered,
        lapses: scheduleUpdate.lapses,
        lastReviewedAt: Date.now(),
        totalReviews: (card.totalReviews || 0) + 1,
        correctReviews: (card.correctReviews || 0) + (scheduleUpdate.correct ? 1 : 0),
        updatedAt: Date.now(),
      };
      const reviewedAt = nextCard.lastReviewedAt;
      const reviewEvent = {
        id: buildReviewEventId(cardId, reviewedAt, scheduleUpdate.rating),
        cardId,
        prompt: card.prompt,
        answer: card.answer,
        subject: card.subject,
        section: card.section,
        sectionLabel: card.sectionLabel,
        rating: scheduleUpdate.rating,
        correct: scheduleUpdate.correct,
        box: scheduleUpdate.box,
        intervalDays: scheduleUpdate.intervalDays,
        reviewedAt,
        dayKey: window.HomeSchoolUtils.getDayKey(reviewedAt),
        xpGain: scheduleUpdate.xpGain,
      };

      const xpGain = scheduleUpdate.xpGain + streakBonus;
      const nextStats = {
        ...stats,
        id: "main",
        xp: (stats.xp || 0) + xpGain,
        totalReviews,
        correctReviews,
        retentionRate: totalReviews ? Math.round((correctReviews / totalReviews) * 100) : 0,
        reviewStreak: nextReviewStreak,
        lastReviewDate: today,
        updatedAt: Date.now(),
      };

      await db.transaction("rw", [db.reviewCards, db.userStats, db.reviewHistory], async () => {
        await db.reviewCards.put(nextCard);
        await db.userStats.put(nextStats);
        await db.reviewHistory.put(reviewEvent);
      });

      return {
        card: nextCard,
        stats: nextStats,
        xpGain,
        streakBonus,
      };
    },

    async toggleWordFavorite(cardId, favorite = null, studyItem = null) {
      const existing = await getOrCreateStudyMeta(cardId, studyItem);
      if (!existing) return null;
      const next = {
        ...existing,
        favorite: typeof favorite === "boolean" ? favorite : !existing.favorite,
        updatedAt: Date.now(),
      };
      await db.wordMeta.put(next);
      return next;
    },

    async saveWordNote(cardId, note, studyItem = null) {
      const existing = await getOrCreateStudyMeta(cardId, studyItem);
      if (!existing) return null;
      const next = {
        ...existing,
        note: String(note || "").trim(),
        updatedAt: Date.now(),
      };
      await db.wordMeta.put(next);
      return next;
    },

    async createCustomList(name) {
      const trimmed = String(name || "").trim();
      if (!trimmed) return null;
      const list = {
        id: buildCustomListId(trimmed),
        name: trimmed,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.customLists.put(list);
      return list;
    },

    async renameCustomList(listId, name) {
      const list = await db.customLists.get(listId);
      if (!list) return null;
      const trimmed = String(name || "").trim();
      if (!trimmed) return list;
      const next = {
        ...list,
        name: trimmed,
        updatedAt: Date.now(),
      };
      await db.customLists.put(next);
      return next;
    },

    async deleteCustomList(listId) {
      const relatedItems = await db.customListItems.where("listId").equals(listId).toArray();
      await db.transaction("rw", [db.customLists, db.customListItems], async () => {
        await db.customLists.delete(listId);
        if (relatedItems.length > 0) {
          await db.customListItems.bulkDelete(relatedItems.map((item) => item.id));
        }
      });
      return true;
    },

    async toggleCardInCustomList(listId, cardId) {
      const list = await db.customLists.get(listId);
      const card = await db.reviewCards.get(cardId);
      if (!list || !card) return null;
      const itemId = buildCustomListItemId(listId, cardId);
      const existing = await db.customListItems.get(itemId);
      if (existing) {
        await db.customListItems.delete(itemId);
      } else {
        await db.customListItems.put({
          id: itemId,
          listId,
          cardId,
          prompt: card.prompt,
          answer: card.answer,
          updatedAt: Date.now(),
        });
      }
      await db.customLists.put({
        ...list,
        updatedAt: Date.now(),
      });
      return !existing;
    },

    async getUserStats() {
      return getMainStats();
    },

    async getAllStudyMeta() {
      return db.wordMeta.toArray();
    },

    async getCustomization(type) {
      const record = await getLatestCustomization(type);
      return record?.data ?? null;
    },

    async saveCustomization(type, data) {
      return saveCustomization(type, data);
    },

    async getCustomizationsMap() {
      return getCustomizationsMap();
    },

    async getDictionaryEntries() {
      return getDictionaryEntries();
    },

    async getDictionaryEntriesMap() {
      return getDictionaryEntriesMap();
    },

    async upsertDictionaryEntries(entries, options = {}) {
      return upsertDictionaryEntries(entries, options);
    },

    async replaceDictionaryEntries(entries, options = {}) {
      return replaceDictionaryEntries(entries, options);
    },

    async getDictionaryOutboxEntries(limit = 250) {
      return getDictionaryOutboxEntries(limit);
    },

    async clearDictionaryOutboxEntries(normalizedWords = []) {
      return clearDictionaryOutboxEntries(normalizedWords);
    },

    async getDictionarySyncMeta(key) {
      return getDictionarySyncMeta(key);
    },

    async saveDictionarySyncMeta(key, data) {
      return saveDictionarySyncMeta(key, data);
    },

    async getProgressMap() {
      const records = await db.progress.toArray();
      return records.reduce((acc, record) => {
        acc[record.lessonId] = {
          score: record.score,
          total: record.total,
          date: new Date(record.timestamp).toDateString(),
        };
        return acc;
      }, {});
    },

    async getSubjectProgress(subject, grade) {
      const lessons = await this.getLessons(subject, grade);
      const progressRows = await db.progress.where("subject").equals(subject).toArray();
      const done = progressRows.filter((row) => row.grade === grade && row.completed).length;
      const total = lessons.length;
      return {
        subject,
        grade,
        completed: done,
        total,
        percentage: total ? Math.round((done / total) * 100) : 0,
      };
    },

    async exportProgress() {
      const metadata = await this.getStoredMetadata();
      return {
        exportedAt: new Date().toISOString(),
        progress: await db.progress.toArray(),
        reviewCards: await db.reviewCards.toArray(),
        reviewHistory: await db.reviewHistory.toArray(),
        userStats: await db.userStats.toArray(),
        wordMeta: await db.wordMeta.toArray(),
        customLists: await db.customLists.toArray(),
        customListItems: await db.customListItems.toArray(),
        customizations: (await db.customizations.toArray()).filter((row) => !isSensitiveCustomizationType(row?.type)),
        dataVersion: metadata?.version ?? null,
        changedSubjects: metadata?.changedSubjects || [],
      };
    },

    async importProgress(progressData, options = {}) {
      const mode = options.mode === "merge" ? "merge" : "replace";
      const normalized = normalizeImportPayload(progressData);

      await db.transaction("rw", [db.progress, db.reviewCards, db.reviewHistory, db.userStats, db.wordMeta, db.customLists, db.customListItems, db.customizations], async () => {
        if (mode === "replace") {
          await db.progress.clear();
          await db.reviewCards.clear();
          await db.reviewHistory.clear();
          await db.userStats.clear();
          await db.wordMeta.clear();
          await db.customLists.clear();
          await db.customListItems.clear();
          await db.customizations.clear();

          if (normalized.progress.length > 0) await db.progress.bulkPut(normalized.progress);
          if (normalized.reviewCards.length > 0) await db.reviewCards.bulkPut(normalized.reviewCards);
          if (normalized.reviewHistory.length > 0) await db.reviewHistory.bulkPut(normalized.reviewHistory);
          if (normalized.userStats.length > 0) await db.userStats.bulkPut(normalized.userStats);
          if (normalized.wordMeta.length > 0) await db.wordMeta.bulkPut(normalized.wordMeta);
          if (normalized.customLists.length > 0) await db.customLists.bulkPut(normalized.customLists);
          if (normalized.customListItems.length > 0) await db.customListItems.bulkPut(normalized.customListItems);
          if (normalized.customizations.length > 0) await db.customizations.bulkPut(normalized.customizations);
          return;
        }

        const existingProgress = await db.progress.toArray();
        const existingReviewCards = await db.reviewCards.toArray();
        const existingReviewHistory = await db.reviewHistory.toArray();
        const existingUserStats = await db.userStats.toArray();
        const existingWordMeta = await db.wordMeta.toArray();
        const existingCustomLists = await db.customLists.toArray();
        const existingCustomListItems = await db.customListItems.toArray();
        const existingCustomizations = await db.customizations.toArray();

        const mergedProgress = mergeUniqueRows(existingProgress, normalized.progress);
        const mergedReviewCards = mergeUniqueRows(existingReviewCards, normalized.reviewCards);
        const mergedReviewHistory = mergeUniqueRows(existingReviewHistory, normalized.reviewHistory);
        const mergedWordMeta = mergeUniqueRows(existingWordMeta, normalized.wordMeta);
        const mergedCustomLists = mergeUniqueRows(existingCustomLists, normalized.customLists);
        const mergedCustomListItems = mergeUniqueRows(existingCustomListItems, normalized.customListItems);
        const mergedCustomizations = mergeCustomizationRows(existingCustomizations, normalized.customizations);
        const mergedMain = mergeMainStats(existingUserStats.find((row) => row.id === "main"), normalized.userStats.find((row) => row.id === "main"));

        await db.progress.clear();
        await db.reviewCards.clear();
        await db.reviewHistory.clear();
        await db.userStats.clear();
        await db.wordMeta.clear();
        await db.customLists.clear();
        await db.customListItems.clear();
        await db.customizations.clear();

        if (mergedProgress.length > 0) await db.progress.bulkPut(mergedProgress);
        if (mergedReviewCards.length > 0) await db.reviewCards.bulkPut(mergedReviewCards);
        if (mergedReviewHistory.length > 0) await db.reviewHistory.bulkPut(mergedReviewHistory);
        if (mergedWordMeta.length > 0) await db.wordMeta.bulkPut(mergedWordMeta);
        if (mergedCustomLists.length > 0) await db.customLists.bulkPut(mergedCustomLists);
        if (mergedCustomListItems.length > 0) await db.customListItems.bulkPut(mergedCustomListItems);
        if (mergedCustomizations.length > 0) await db.customizations.bulkPut(mergedCustomizations);
        if (mergedMain) await db.userStats.put(mergedMain);
      });

      return {
        mode,
        importedRows: normalized.progress.length,
        importedVersion: normalized.dataVersion,
      };
    },

    async resetProgress() {
      await db.transaction("rw", [db.progress, db.reviewCards, db.reviewHistory, db.userStats], async () => {
        await db.progress.clear();
        await db.reviewCards.clear();
        await db.reviewHistory.clear();
        await db.userStats.clear();
        if (window.HomeSchoolData) {
          const reviewCards = buildReviewCards(window.HomeSchoolData);
          if (reviewCards.length > 0) await db.reviewCards.bulkPut(reviewCards);
        }
      });
    },

    async resetReviewSystem(dataLoader = null) {
      await db.transaction("rw", [db.reviewCards, db.reviewHistory], async () => {
        await db.reviewCards.clear();
        await db.reviewHistory.clear();
        const source = dataLoader || window.HomeSchoolData || null;
        if (source) {
          const reviewCards = buildReviewCards(source);
          if (reviewCards.length > 0) await db.reviewCards.bulkPut(reviewCards);
        }
      });
    },

    async clearStudyCollections() {
      await db.transaction("rw", [db.wordMeta, db.customLists, db.customListItems], async () => {
        await db.wordMeta.clear();
        await db.customLists.clear();
        await db.customListItems.clear();
      });
    },

    async clearCustomizationTypes(types = []) {
      const safeTypes = Array.isArray(types) ? types.filter(Boolean) : [];
      if (!safeTypes.length) return 0;
      const rows = await db.customizations.where("type").anyOf(safeTypes).toArray();
      const ids = rows
        .map((row) => row?.id)
        .filter((id) => typeof id !== "undefined" && id !== null);
      if (!ids.length) return 0;
      await db.customizations.bulkDelete(ids);
      return ids.length;
    },

    async resetPlanningData() {
      return this.clearCustomizationTypes([
        "studyGoals",
        "focusTimerSettings",
        "reminderSettings",
        "classScheduleSettings",
        "timeTrackingData",
        "notificationHistory",
        "backupReminderSettings",
      ]);
    },

    async fullReset(dataLoader, version = null) {
      await db.delete();
      await db.open();
      if (dataLoader) {
        await seedData({ ...dataLoader, VERSION: version || dataLoader.VERSION });
      }
    },

    async exportAll() {
      return {
        coreData: await db.coreData.toArray(),
        posData: await db.posData.toArray(),
        tensesData: await db.tensesData.toArray(),
        vocabData: await db.vocabData.toArray(),
        mathChapters: await db.mathChapters.toArray(),
        quizData: await db.quizData.toArray(),
        reviewCards: await db.reviewCards.toArray(),
        reviewHistory: await db.reviewHistory.toArray(),
        wordMeta: await db.wordMeta.toArray(),
        customLists: await db.customLists.toArray(),
        customListItems: await db.customListItems.toArray(),
        progress: await db.progress.toArray(),
        userStats: await db.userStats.toArray(),
        customizations: (await db.customizations.toArray()).filter((row) => !isSensitiveCustomizationType(row?.type)),
        dictionaryEntries: db.dictionaryEntries ? await db.dictionaryEntries.toArray() : [],
        dictionaryOutbox: db.dictionaryOutbox ? await db.dictionaryOutbox.toArray() : [],
        dictionarySyncMeta: db.dictionarySyncMeta ? await db.dictionarySyncMeta.toArray() : [],
        dataVersion: await db.dataVersion.toArray(),
      };
    },

    async getStats() {
      return {
        coreData: await db.coreData.count(),
        posData: await db.posData.count(),
        tensesData: await db.tensesData.count(),
        vocabData: await db.vocabData.count(),
        mathChapters: await db.mathChapters.count(),
        quizData: await db.quizData.count(),
        reviewCards: await db.reviewCards.count(),
        reviewHistory: await db.reviewHistory.count(),
        wordMeta: await db.wordMeta.count(),
        customLists: await db.customLists.count(),
        customListItems: await db.customListItems.count(),
        progress: await db.progress.count(),
        customizations: await db.customizations.count(),
        dictionaryEntries: db.dictionaryEntries ? await db.dictionaryEntries.count() : 0,
        dictionaryOutbox: db.dictionaryOutbox ? await db.dictionaryOutbox.count() : 0,
      };
    },

    async resetDB() {
      await db.delete();
      location.reload();
    },
  };
})();
