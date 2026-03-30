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

  async function seedData(dataLoader) {
    const posData = dataLoader.POS_DATA || {};
    const tensesData = dataLoader.TENSES_DATA || {};
    const vocabularyData = dataLoader.VOCABULARY_DATA || [];
    const curriculumRecords = [];
    const quizRecords = [];

    for (const subject of dataLoader.SUBJECTS) {
      for (const grade of dataLoader.GRADES.map((item) => item.id)) {
        const lessons = dataLoader.getLessons(subject.id, grade) || [];
        for (const lesson of lessons) {
          curriculumRecords.push({
            id: `${subject.id}_${grade}_${lesson.key}`,
            type: "lesson",
            subject: subject.id,
            grade,
            lessonKey: lesson.key,
            data: lesson,
          });

          if (lesson.hasMathSub || lesson.hasTenses || lesson.hasVocab) {
            continue;
          }

          const questions = dataLoader.getQuiz(subject.id, grade, lesson.key) || [];
          if (questions.length > 0) {
            quizRecords.push({
              id: `${subject.id}_${grade}_${lesson.key}`,
              subject: subject.id,
              grade,
              lessonKey: lesson.key,
              questions,
            });
          }
        }
      }
    }

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
        await db.coreData.clear();
        await db.posData.clear();
        await db.tensesData.clear();
        await db.vocabData.clear();
        await db.mathChapters.clear();
        await db.quizData.clear();
        await db.dataVersion.clear();

        if (curriculumRecords.length > 0) await db.coreData.bulkPut(curriculumRecords);

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

        const mathLessons = dataLoader.getLessons("math", 5) || [];
        if (mathLessons.length > 0) {
          await db.mathChapters.bulkPut(mathLessons.map((lesson) => ({
            ...lesson,
            id: `math_${lesson.key}`,
            grade: 5,
          })));
        }

        if (quizRecords.length > 0) await db.quizData.bulkPut(quizRecords);

        await db.dataVersion.put({
          id: "curriculum",
          version: dataLoader.VERSION,
          lastUpdated: Date.now(),
        });
      },
    );
  }

  async function getMainStats() {
    return (await db.userStats.get("main")) || getStatsDefaults();
  }

  window.HomeSchoolDB = {
    db,

    async getStoredVersion() {
      const record = await db.dataVersion.get("curriculum");
      return record?.version ?? null;
    },

    async needsUpdate(currentVersion) {
      const storedVersion = await this.getStoredVersion();
      return storedVersion !== currentVersion;
    },

    async ensureSeeded(dataLoader) {
      const needsSeed = await this.needsUpdate(dataLoader.VERSION);
      if (needsSeed) await seedData(dataLoader);
    },

    async refreshData(dataLoader, currentVersion) {
      const needsSeed = await this.needsUpdate(currentVersion);
      if (needsSeed) await seedData(dataLoader);
      return { refreshed: needsSeed, version: currentVersion };
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
      return {
        progress: await db.progress.toArray(),
        userStats: await db.userStats.toArray(),
        customizations: await db.customizations.toArray(),
        dataVersion: await this.getStoredVersion(),
      };
    },

    async importProgress(progressData) {
      await db.transaction("rw", [db.progress, db.userStats, db.customizations], async () => {
        await db.progress.clear();
        await db.userStats.clear();
        await db.customizations.clear();

        if (Array.isArray(progressData.progress) && progressData.progress.length > 0) {
          await db.progress.bulkPut(progressData.progress);
        }
        if (Array.isArray(progressData.userStats) && progressData.userStats.length > 0) {
          await db.userStats.bulkPut(progressData.userStats);
        }
        if (Array.isArray(progressData.customizations) && progressData.customizations.length > 0) {
          await db.customizations.bulkPut(progressData.customizations);
        }
      });
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
