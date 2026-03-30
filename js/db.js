(() => {
  "use strict";

  const db = new Dexie("HomeSchoolDB");

  db.version(2).stores({
    posData: "id, type, day",
    tensesData: "id, main, sub",
    vocabData: "id, day",
    mathChapters: "id, key, grade",
    quizData: "id, subject, lessonKey",
    progress: "id, subject, lessonId",
    userStats: "id",
    dataVersion: "id, version, lastUpdated",
    customizations: "++id, type, ts",
  });

  async function seedData(dataLoader) {
    const version = dataLoader.VERSION;
    const posData = dataLoader.POS_DATA || {};
    const tensesData = dataLoader.TENSES_DATA || {};
    const vocabularyData = dataLoader.VOCABULARY_DATA || [];

    const mathGradeFive = dataLoader.getLessons("math", 5) || [];
    const quizRecords = [];

    for (const subject of dataLoader.SUBJECTS) {
      for (const grade of dataLoader.GRADES.map((item) => item.id)) {
        const lessons = dataLoader.getLessons(subject.id, grade) || [];
        for (const lesson of lessons) {
          if (lesson.hasMathSub || lesson.hasTenses || lesson.hasVocab) {
            continue;
          }

          const questions = dataLoader.getQuiz(subject.id, grade, lesson.key) || [];
          if (questions.length > 0) {
            quizRecords.push({
              id: `${subject.id}_${lesson.key}`,
              subject: subject.id,
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
        db.posData,
        db.tensesData,
        db.vocabData,
        db.mathChapters,
        db.quizData,
        db.dataVersion,
      ],
      async () => {
        await db.posData.clear();
        await db.tensesData.clear();
        await db.vocabData.clear();
        await db.mathChapters.clear();
        await db.quizData.clear();
        await db.dataVersion.clear();

        for (const [type, items] of Object.entries(posData)) {
          if (!Array.isArray(items) || items.length === 0) {
            continue;
          }

          await db.posData.bulkPut(
            items.map((item) => ({
              ...item,
              type,
              id: `${type}_${item.day}`,
            })),
          );
        }

        for (const main of ["present", "past", "future"]) {
          for (const sub of ["simple", "continuous", "perfect", "perfectContinuous"]) {
            const record = tensesData[main]?.[sub];
            if (!record) {
              continue;
            }

            await db.tensesData.put({
              ...record,
              id: `${main}_${sub}`,
              main,
              sub,
            });
          }
        }

        if (vocabularyData.length > 0) {
          await db.vocabData.bulkPut(
            vocabularyData.map((item) => ({
              ...item,
              id: `vocab_${item.day}`,
            })),
          );
        }

        if (mathGradeFive.length > 0) {
          await db.mathChapters.bulkPut(
            mathGradeFive.map((chapter) => ({
              ...chapter,
              id: `math_${chapter.key}`,
              grade: 5,
            })),
          );
        }

        if (quizRecords.length > 0) {
          await db.quizData.bulkPut(quizRecords);
        }

        await db.dataVersion.put({
          id: "curriculum",
          version,
          lastUpdated: Date.now(),
        });
      },
    );
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
      if (needsSeed) {
        await seedData(dataLoader);
      }
    },

    async refreshData(dataLoader, currentVersion) {
      const needsSeed = await this.needsUpdate(currentVersion);
      if (needsSeed) {
        await seedData(dataLoader);
      }
    },

    async getPosData(type) {
      return db.posData.where("type").equals(type).sortBy("day");
    },

    async getAllPosTypes() {
      const records = await db.posData.toArray();
      const grouped = {};
      records.forEach((record) => {
        if (!grouped[record.type]) {
          grouped[record.type] = [];
        }
        grouped[record.type].push(record);
      });

      for (const key of Object.keys(grouped)) {
        grouped[key].sort((left, right) => left.day - right.day);
      }

      return grouped;
    },

    async getTenses(main, sub) {
      return db.tensesData.get(`${main}_${sub}`);
    },

    async getAllTenses() {
      const records = await db.tensesData.toArray();
      const grouped = {};
      records.forEach((record) => {
        if (!grouped[record.main]) {
          grouped[record.main] = {};
        }
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

    async getQuiz(subject, key) {
      const record = await db.quizData.get(`${subject}_${key}`);
      return record?.questions || [];
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

    async exportAll() {
      return {
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
        posData: await db.posData.count(),
        tensesData: await db.tensesData.count(),
        vocabData: await db.vocabData.count(),
        mathChapters: await db.mathChapters.count(),
        quizData: await db.quizData.count(),
        progress: await db.progress.count(),
        customizations: await db.customizations.count(),
      };
    },

    async resetProgress() {
      await db.transaction("rw", [db.progress, db.userStats], async () => {
        await db.progress.clear();
        await db.userStats.clear();
      });
    },

    async resetDB() {
      await db.delete();
      location.reload();
    },
  };
})();
