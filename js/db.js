(() => {
  "use strict";

  const db = new Dexie("HomeSchoolDB");

  db.version(3).stores({
    coreData: "id, type, subject, grade, lessonKey",
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey, grade",
    progress: "id, subject, lessonId, grade, completed, timestamp",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
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

  async function getMainStats() {
    return (await db.userStats.get("main")) || getStatsDefaults();
  }

  function normalizeImportPayload(progressData) {
    return {
      progress: Array.isArray(progressData?.progress) ? progressData.progress : [],
      userStats: Array.isArray(progressData?.userStats) ? progressData.userStats : [],
      customizations: Array.isArray(progressData?.customizations) ? progressData.customizations : [],
      dataVersion: progressData?.dataVersion ?? null,
    };
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
      badges: Array.from(new Set([...(existing.badges || []), ...(incoming.badges || [])])),
      subjectsCompleted: Array.from(new Set([...(existing.subjectsCompleted || []), ...(incoming.subjectsCompleted || [])])),
      updatedAt,
    };
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
        db.dataVersion,
      ],
      async () => {
        if (!options.subjects) {
          await db.coreData.clear();
          await db.posData.clear();
          await db.tensesData.clear();
          await db.vocabData.clear();
          await db.mathChapters.clear();
          await db.quizData.clear();
          await db.dataVersion.clear();
        } else {
          await db.coreData.where("subject").anyOf(targetSubjects).delete();
          await db.quizData.where("subject").anyOf(targetSubjects).delete();
          if (targetSubjects.includes("english")) {
            await db.posData.clear();
            await db.tensesData.clear();
            await db.vocabData.clear();
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
      await this.refreshData(dataLoader, dataLoader.VERSION);
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

    async getUserStats() {
      return getMainStats();
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
        userStats: await db.userStats.toArray(),
        customizations: await db.customizations.toArray(),
        dataVersion: metadata?.version ?? null,
        changedSubjects: metadata?.changedSubjects || [],
      };
    },

    async importProgress(progressData, options = {}) {
      const mode = options.mode === "merge" ? "merge" : "replace";
      const normalized = normalizeImportPayload(progressData);

      await db.transaction("rw", [db.progress, db.userStats, db.customizations], async () => {
        if (mode === "replace") {
          await db.progress.clear();
          await db.userStats.clear();
          await db.customizations.clear();

          if (normalized.progress.length > 0) await db.progress.bulkPut(normalized.progress);
          if (normalized.userStats.length > 0) await db.userStats.bulkPut(normalized.userStats);
          if (normalized.customizations.length > 0) await db.customizations.bulkPut(normalized.customizations);
          return;
        }

        const existingProgress = await db.progress.toArray();
        const existingUserStats = await db.userStats.toArray();
        const existingCustomizations = await db.customizations.toArray();

        const mergedProgress = mergeUniqueRows(existingProgress, normalized.progress);
        const mergedCustomizations = mergeUniqueRows(existingCustomizations, normalized.customizations, "id");
        const mergedMain = mergeMainStats(existingUserStats.find((row) => row.id === "main"), normalized.userStats.find((row) => row.id === "main"));

        await db.progress.clear();
        await db.userStats.clear();
        await db.customizations.clear();

        if (mergedProgress.length > 0) await db.progress.bulkPut(mergedProgress);
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
      await db.transaction("rw", [db.progress, db.userStats], async () => {
        await db.progress.clear();
        await db.userStats.clear();
      });
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
        progress: await db.progress.toArray(),
        userStats: await db.userStats.toArray(),
        customizations: await db.customizations.toArray(),
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
        progress: await db.progress.count(),
        customizations: await db.customizations.count(),
      };
    },

    async resetDB() {
      await db.delete();
      location.reload();
    },
  };
})();
